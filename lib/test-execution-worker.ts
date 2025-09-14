/**
 * Test Execution Worker - Professional Protocol Analyzer Test Runner
 * Handles distributed test execution with queue management and worker coordination
 */

import { createClient } from './supabase';
import LayerMappingUtility, { DecodedMessage, InformationElement, LayerParameter } from './layer-mapping-utility';

export interface TestExecutionJob {
  id: string;
  run_id: string;
  user_id: string;
  test_ids: string[];
  execution_mode: 'simulation' | 'realtime' | 'batch';
  configuration: {
    time_acceleration: number;
    log_level: 'basic' | 'detailed' | 'verbose';
    capture_mode: 'messages' | 'full' | 'performance';
    input_files?: string[];
    timeout_seconds?: number;
    retry_count?: number;
    environment_variables?: Record<string, string>;
  };
  priority: number;
  scheduled_at: string;
}

export interface TestExecutionResult {
  test_id: string;
  status: 'passed' | 'failed' | 'skipped' | 'warning';
  duration_seconds: number;
  metrics: {
    latency_ms: number;
    throughput_mbps: number;
    success_rate: number;
    [key: string]: any;
  };
  errors: string[];
  warnings: string[];
  artifacts: {
    type: string;
    file_name: string;
    file_path: string;
    metadata: any;
  }[];
}

export interface WorkerCapabilities {
  protocols: string[];
  execution_modes: string[];
  max_concurrent_tests: number;
  supported_features: string[];
}

export class TestExecutionWorker {
  private workerId: string;
  private workerName: string;
  private supabase: any;
  private isRunning: boolean = false;
  private currentJobs: Map<string, TestExecutionJob> = new Map();
  private capabilities: WorkerCapabilities;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor(workerId: string, workerName: string, capabilities: WorkerCapabilities) {
    this.workerId = workerId;
    this.workerName = workerName;
    this.capabilities = capabilities;
    this.supabase = createClient();
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      throw new Error('Worker is already running');
    }

    this.isRunning = true;
    console.log(`🚀 Starting test execution worker: ${this.workerName} (${this.workerId})`);

    // Register worker in database
    await this.registerWorker();

    // Start heartbeat
    this.startHeartbeat();

    // Start job processing
    this.processJobs();

    console.log(`✅ Test execution worker started successfully`);
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    console.log(`🛑 Stopping test execution worker: ${this.workerName}`);

    // Stop heartbeat
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    // Cancel current jobs
    for (const [jobId, job] of this.currentJobs) {
      await this.cancelJob(jobId);
    }

    // Mark worker as inactive
    await this.unregisterWorker();

    console.log(`✅ Test execution worker stopped`);
  }

  private async registerWorker(): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('test_execution_workers')
        .upsert({
          worker_id: this.workerId,
          worker_name: this.workerName,
          status: 'active',
          capabilities: this.capabilities,
          current_load: 0,
          max_load: this.capabilities.max_concurrent_tests,
          last_heartbeat: new Date().toISOString()
        });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Failed to register worker:', error);
      throw error;
    }
  }

  private async unregisterWorker(): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('test_execution_workers')
        .update({ status: 'inactive' })
        .eq('worker_id', this.workerId);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Failed to unregister worker:', error);
    }
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(async () => {
      try {
        await this.supabase
          .from('test_execution_workers')
          .update({
            last_heartbeat: new Date().toISOString(),
            current_load: this.currentJobs.size
          })
          .eq('worker_id', this.workerId);
      } catch (error) {
        console.error('Heartbeat failed:', error);
      }
    }, 30000); // Every 30 seconds
  }

  private async processJobs(): Promise<void> {
    while (this.isRunning) {
      try {
        // Check if we can accept more jobs
        if (this.currentJobs.size >= this.capabilities.max_concurrent_tests) {
          await new Promise(resolve => setTimeout(resolve, 5000));
          continue;
        }

        // Get next job from queue
        const job = await this.getNextJob();
        if (!job) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }

        // Process job
        this.currentJobs.set(job.id, job);
        this.processJob(job).finally(() => {
          this.currentJobs.delete(job.id);
        });

      } catch (error) {
        console.error('Error in job processing loop:', error);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }

  private async getNextJob(): Promise<TestExecutionJob | null> {
    try {
      const { data, error } = await this.supabase
        .from('test_run_queue')
        .select('*')
        .eq('status', 'queued')
        .lte('scheduled_at', new Date().toISOString())
        .order('priority', { ascending: false })
        .order('scheduled_at', { ascending: true })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      if (!data) {
        return null;
      }

      // Claim the job
      const { error: claimError } = await this.supabase
        .from('test_run_queue')
        .update({
          status: 'running',
          started_at: new Date().toISOString(),
          worker_id: this.workerId
        })
        .eq('id', data.id)
        .eq('status', 'queued'); // Ensure it's still queued

      if (claimError) {
        console.log('Failed to claim job, another worker may have taken it');
        return null;
      }

      return data as TestExecutionJob;
    } catch (error) {
      console.error('Failed to get next job:', error);
      return null;
    }
  }

  private async processJob(job: TestExecutionJob): Promise<void> {
    console.log(`🔄 Processing job ${job.id} with ${job.test_ids.length} tests`);

    try {
      // Update execution status
      await this.updateExecutionStatus(job.run_id, 'running', 0);

      const results: TestExecutionResult[] = [];
      let completedTests = 0;

      // Process each test
      for (const testId of job.test_ids) {
        try {
          console.log(`🧪 Executing test ${testId}`);
          
          const result = await this.executeTest(testId, job);
          results.push(result);

          completedTests++;
          const progress = Math.round((completedTests / job.test_ids.length) * 100);
          
          await this.updateExecutionStatus(job.run_id, 'running', progress, testId);

          // Update test result in database
          await this.saveTestResult(job.run_id, testId, result);

        } catch (error) {
          console.error(`Failed to execute test ${testId}:`, error);
          
          const errorResult: TestExecutionResult = {
            test_id: testId,
            status: 'failed',
            duration_seconds: 0,
            metrics: {},
            errors: [error instanceof Error ? error.message : 'Unknown error'],
            warnings: [],
            artifacts: []
          };

          results.push(errorResult);
          await this.saveTestResult(job.run_id, testId, errorResult);
        }
      }

      // Mark execution as completed
      const passedTests = results.filter(r => r.status === 'passed').length;
      const failedTests = results.filter(r => r.status === 'failed').length;
      const successRate = results.length > 0 ? (passedTests / results.length) * 100 : 0;

      await this.updateExecutionStatus(job.run_id, 'completed', 100, undefined, {
        total_tests: results.length,
        completed_tests: results.length,
        passed_tests: passedTests,
        failed_tests: failedTests,
        success_rate: successRate
      });

      // Mark queue item as completed
      await this.supabase
        .from('test_run_queue')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', job.id);

      console.log(`✅ Job ${job.id} completed successfully`);

    } catch (error) {
      console.error(`❌ Job ${job.id} failed:`, error);

      // Mark execution as failed
      await this.updateExecutionStatus(job.run_id, 'failed', 0, undefined, {
        error_message: error instanceof Error ? error.message : 'Unknown error'
      });

      // Mark queue item as failed
      await this.supabase
        .from('test_run_queue')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          error_message: error instanceof Error ? error.message : 'Unknown error'
        })
        .eq('id', job.id);
    }
  }

  private async executeTest(testId: string, job: TestExecutionJob): Promise<TestExecutionResult> {
    const startTime = Date.now();

    try {
      // Get test case details
      const { data: testCase, error } = await this.supabase
        .from('test_cases')
        .select('*')
        .eq('id', testId)
        .single();

      if (error || !testCase) {
        throw new Error(`Test case ${testId} not found`);
      }

      // Get test case messages and expected flow
      const { data: testMessages, error: messagesError } = await this.supabase
        .from('test_case_messages')
        .select('*')
        .eq('test_case_id', testId)
        .order('step_order');

      if (messagesError) {
        throw new Error(`Failed to get test messages: ${messagesError.message}`);
      }

      // Simulate test execution with message flow
      const duration = await this.simulateTestExecutionWithFlow(testCase, testMessages, job.configuration);
      
      // Process and analyze the simulated messages
      const { metrics, decodedMessages, validationResults } = await this.processTestMessages(
        testCase, 
        testMessages, 
        job.run_id
      );
      
      // Determine pass/fail based on metrics and test criteria
      const status = this.evaluateTestResult(testCase, metrics, validationResults);
      
      // Generate errors and warnings
      const { errors, warnings } = this.generateTestIssues(testCase, metrics, status, validationResults);

      const result: TestExecutionResult = {
        test_id: testId,
        status,
        duration_seconds: duration,
        metrics,
        errors,
        warnings,
        artifacts: []
      };

      return result;

    } catch (error) {
      const duration = (Date.now() - startTime) / 1000;
      
      return {
        test_id: testId,
        status: 'failed',
        duration_seconds: duration,
        metrics: {},
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        warnings: [],
        artifacts: []
      };
    }
  }

  private async simulateTestExecutionWithFlow(testCase: any, testMessages: any[], config: any): Promise<number> {
    // Simulate realistic test execution time based on message flow
    const baseDuration = testCase.duration_minutes * 60; // Convert to seconds
    const acceleration = config.time_acceleration || 1;
    const actualDuration = baseDuration / acceleration;
    
    // Add some randomness
    const randomFactor = 0.8 + Math.random() * 0.4; // 80% to 120% of expected time
    const finalDuration = actualDuration * randomFactor;
    
    // Simulate execution time
    await new Promise(resolve => setTimeout(resolve, Math.min(finalDuration * 100, 5000))); // Cap at 5 seconds for simulation
    
    return finalDuration;
  }

  private async processTestMessages(testCase: any, testMessages: any[], runId: string): Promise<{
    metrics: any;
    decodedMessages: DecodedMessage[];
    validationResults: any[];
  }> {
    const layerMapping = LayerMappingUtility.getInstance();
    const decodedMessages: DecodedMessage[] = [];
    const validationResults: any[] = [];
    const metrics: any = {};

    // Process each test message
    for (const testMessage of testMessages) {
      // Generate realistic message data based on test case
      const messageData = this.generateMessageData(testCase, testMessage);
      
      // Create decoded message object
      const decodedMessage: DecodedMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        protocol: testMessage.protocol,
        message_type: testMessage.message_type,
        message_name: testMessage.message_name,
        message_direction: testMessage.direction,
        decoded_data: messageData,
        timestamp_us: Date.now() * 1000 + testMessage.timestamp_ms * 1000,
        source_entity: this.getSourceEntity(testMessage),
        target_entity: this.getTargetEntity(testMessage)
      };

      // Map message to layer
      const layerMappingResult = layerMapping.mapMessageToLayer(decodedMessage);
      
      // Extract information elements
      const informationElements = layerMapping.extractInformationElements(decodedMessage);
      
      // Extract layer parameters
      const layerParameters = layerMapping.extractLayerParameters(decodedMessage, layerMappingResult.layer);
      
      // Validate message
      const validation = layerMapping.validateMessage(decodedMessage, layerMappingResult.layer);
      
      // Store decoded message in database
      await this.storeDecodedMessage(decodedMessage, layerMappingResult, informationElements, layerParameters, runId);
      
      // Store validation results
      validationResults.push({
        message_id: decodedMessage.id,
        layer: layerMappingResult.layer,
        validation: validation,
        confidence: layerMappingResult.confidence
      });

      decodedMessages.push(decodedMessage);
    }

    // Calculate metrics from processed messages
    metrics.total_messages = decodedMessages.length;
    metrics.layers_analyzed = [...new Set(validationResults.map(r => r.layer))];
    metrics.validation_errors = validationResults.filter(r => !r.validation.isValid).length;
    metrics.validation_warnings = validationResults.reduce((sum, r) => sum + r.validation.warnings.length, 0);
    metrics.avg_confidence = validationResults.reduce((sum, r) => sum + r.confidence, 0) / validationResults.length;

    // Add protocol-specific metrics
    if (testCase.protocol === 'NR' || testCase.protocol === 'LTE') {
      metrics.rsrp_dbm = -80 - Math.random() * 40;
      metrics.rsrq_db = -10 - Math.random() * 10;
      metrics.sinr_db = 10 + Math.random() * 20;
    }

    return { metrics, decodedMessages, validationResults };
  }

  private generateMessageData(testCase: any, testMessage: any): any {
    // Generate realistic message data based on test case and message type
    const baseData = testMessage.validation_criteria || {};
    
    // Add protocol-specific data
    switch (testMessage.protocol) {
      case 'NR':
      case 'LTE':
        return {
          ...baseData,
          rrc_transaction_id: Math.floor(Math.random() * 3),
          establishment_cause: 'mo-Data',
          ue_identity: '001010123456789',
          cell_id: 12345,
          pci: 123,
          rsrp: -80 - Math.random() * 40,
          rsrq: -10 - Math.random() * 10,
          sinr: 10 + Math.random() * 20
        };
      
      case 'SIP':
        return {
          ...baseData,
          call_id: `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          cseq: Math.floor(Math.random() * 1000),
          from: 'sip:user1@example.com',
          to: 'sip:user2@example.com',
          contact: 'sip:user1@192.168.1.100:5060'
        };
      
      case 'E2':
        return {
          ...baseData,
          e2_node_id: 'e2node_001',
          service_model: 'ORAN-E2SM-KPM',
          subscription_id: Math.floor(Math.random() * 1000)
        };
      
      default:
        return baseData;
    }
  }

  private getSourceEntity(testMessage: any): string {
    if (testMessage.direction === 'UL') {
      return 'UE';
    } else if (testMessage.direction === 'DL') {
      return testMessage.protocol === 'SIP' ? 'IMS' : 'gNodeB';
    }
    return 'Unknown';
  }

  private getTargetEntity(testMessage: any): string {
    if (testMessage.direction === 'UL') {
      return testMessage.protocol === 'SIP' ? 'IMS' : 'gNodeB';
    } else if (testMessage.direction === 'DL') {
      return 'UE';
    }
    return 'Unknown';
  }

  private async storeDecodedMessage(
    message: DecodedMessage,
    layerMapping: any,
    informationElements: InformationElement[],
    layerParameters: LayerParameter[],
    runId: string
  ): Promise<void> {
    try {
      // Store decoded message
      const { data: storedMessage, error: messageError } = await this.supabase
        .from('decoded_messages')
        .insert({
          log_file_id: null, // Will be set if processing uploaded files
          test_run_id: runId,
          message_id: message.id,
          timestamp_us: message.timestamp_us,
          protocol: message.protocol,
          message_type: message.message_type,
          message_name: message.message_name,
          message_direction: message.message_direction,
          layer: layerMapping.layer,
          sublayer: layerMapping.sublayer,
          source_entity: message.source_entity,
          target_entity: message.target_entity,
          decoded_data: message.decoded_data,
          information_elements: informationElements.reduce((acc, ie) => {
            acc[ie.name] = ie.value;
            return acc;
          }, {} as any),
          ie_count: informationElements.length,
          validation_status: 'valid',
          standard_reference: layerMapping.standard_reference
        })
        .select()
        .single();

      if (messageError) {
        console.error('Failed to store decoded message:', messageError);
        return;
      }

      // Store information elements
      for (const ie of informationElements) {
        await this.supabase
          .from('decoded_information_elements')
          .insert({
            message_id: storedMessage.id,
            ie_name: ie.name,
            ie_type: ie.type,
            ie_value: ie.value,
            ie_value_hex: ie.hex_value,
            ie_value_binary: ie.binary_value,
            ie_size: ie.size,
            mandatory: ie.mandatory,
            is_valid: true,
            standard_reference: ie.standard_reference
          });
      }

      // Store layer parameters
      for (const param of layerParameters) {
        await this.supabase
          .from('decoded_layer_parameters')
          .insert({
            message_id: storedMessage.id,
            layer: layerMapping.layer,
            parameter_category: param.context,
            parameter_name: param.name,
            parameter_type: param.type,
            parameter_value: param.value,
            parameter_unit: param.unit,
            context: param.context,
            source: param.source
          });
      }

    } catch (error) {
      console.error('Failed to store decoded message data:', error);
    }
  }

  private generateTestMetrics(testCase: any, config: any): any {
    const baseMetrics = testCase.expected_results || {};
    
    // Generate realistic metrics with some variation
    const metrics: any = {};
    
    if (baseMetrics.latency_ms) {
      const baseLatency = baseMetrics.latency_ms;
      const variation = baseLatency * 0.2; // 20% variation
      metrics.latency_ms = Math.max(0, baseLatency + (Math.random() - 0.5) * variation);
    }
    
    if (baseMetrics.throughput_mbps) {
      const baseThroughput = baseMetrics.throughput_mbps;
      const variation = baseThroughput * 0.15; // 15% variation
      metrics.throughput_mbps = Math.max(0, baseThroughput + (Math.random() - 0.5) * variation);
    }
    
    if (baseMetrics.success_rate) {
      const baseSuccessRate = baseMetrics.success_rate;
      const variation = 5; // 5% variation
      metrics.success_rate = Math.max(0, Math.min(100, baseSuccessRate + (Math.random() - 0.5) * variation));
    }

    // Add protocol-specific metrics
    if (testCase.protocol === 'NR' || testCase.protocol === 'LTE') {
      metrics.rsrp_dbm = -80 - Math.random() * 40; // -80 to -120 dBm
      metrics.rsrq_db = -10 - Math.random() * 10; // -10 to -20 dB
      metrics.sinr_db = 10 + Math.random() * 20; // 10 to 30 dB
    }

    return metrics;
  }

  private evaluateTestResult(testCase: any, metrics: any, validationResults?: any[]): 'passed' | 'failed' | 'warning' {
    const successCriteria = testCase.success_criteria || {};
    const failureThresholds = testCase.failure_thresholds || {};
    
    // Check validation results first
    if (validationResults) {
      const validationErrors = validationResults.filter(r => !r.validation.isValid).length;
      const validationWarnings = validationResults.reduce((sum, r) => sum + r.validation.warnings.length, 0);
      
      if (validationErrors > 0) {
        return 'failed';
      }
      
      if (validationWarnings > 0) {
        return 'warning';
      }
    }
    
    // Check latency criteria
    if (successCriteria.latency_ms?.max && metrics.latency_ms > successCriteria.latency_ms.max) {
      return 'failed';
    }
    
    // Check throughput criteria
    if (successCriteria.throughput_mbps?.min && metrics.throughput_mbps < successCriteria.throughput_mbps.min) {
      return 'failed';
    }
    
    // Check success rate criteria
    if (successCriteria.success_rate && metrics.success_rate < successCriteria.success_rate) {
      return 'failed';
    }
    
    // Check message validation criteria
    if (metrics.validation_errors > 0) {
      return 'failed';
    }
    
    if (metrics.validation_warnings > 0) {
      return 'warning';
    }
    
    // Check for warnings (close to failure thresholds)
    if (failureThresholds.latency_ms?.max && metrics.latency_ms > failureThresholds.latency_ms.max * 0.8) {
      return 'warning';
    }
    
    return 'passed';
  }

  private generateTestIssues(testCase: any, metrics: any, status: string, validationResults?: any[]): { errors: string[], warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Add validation errors and warnings
    if (validationResults) {
      for (const result of validationResults) {
        if (!result.validation.isValid) {
          errors.push(...result.validation.errors);
        }
        if (result.validation.warnings.length > 0) {
          warnings.push(...result.validation.warnings);
        }
      }
    }
    
    if (status === 'failed' && errors.length === 0) {
      // Generate realistic failure reasons if no validation errors
      const failureReasons = [
        'RRC connection timeout',
        'Handover failure',
        'Authentication failure',
        'PDU session establishment failed',
        'Registration timeout',
        'Security key derivation failed',
        'Bearer setup failure',
        'Mobility management error'
      ];
      
      errors.push(failureReasons[Math.floor(Math.random() * failureReasons.length)]);
    }
    
    if (status === 'warning' && warnings.length === 0) {
      // Generate warnings if no validation warnings
      const warningReasons = [
        'Minor timing variation detected',
        'Signal quality below optimal',
        'High mobility scenario exceeded expected latency',
        'Network congestion detected',
        'Power control adjustment required',
        'Beamforming optimization needed'
      ];
      
      warnings.push(warningReasons[Math.floor(Math.random() * warningReasons.length)]);
    }
    
    return { errors, warnings };
  }

  private async updateExecutionStatus(
    runId: string, 
    status: string, 
    progress: number, 
    currentTestId?: string,
    results?: any
  ): Promise<void> {
    try {
      const updateData: any = {
        status,
        progress,
        updated_at: new Date().toISOString()
      };

      if (currentTestId) {
        updateData.current_test_id = currentTestId;
      }

      if (results) {
        updateData.results = results;
      }

      if (status === 'running' && progress === 0) {
        updateData.start_time = new Date().toISOString();
      }

      if (status === 'completed' || status === 'failed') {
        updateData.end_time = new Date().toISOString();
      }

      const { error } = await this.supabase
        .from('test_case_executions')
        .update(updateData)
        .eq('id', runId);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Failed to update execution status:', error);
    }
  }

  private async saveTestResult(runId: string, testId: string, result: TestExecutionResult): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('test_case_results')
        .insert({
          execution_id: runId,
          test_case_id: testId,
          status: result.status,
          duration_seconds: result.duration_seconds,
          metrics: result.metrics,
          errors: result.errors,
          warnings: result.warnings
        });

      if (error) {
        throw error;
      }

      // Save metrics
      for (const [metricName, metricValue] of Object.entries(result.metrics)) {
        await this.supabase
          .from('test_execution_metrics')
          .insert({
            run_id: runId,
            test_id: testId,
            metric_name: metricName,
            metric_value: metricValue,
            metric_unit: this.getMetricUnit(metricName)
          });
      }
    } catch (error) {
      console.error('Failed to save test result:', error);
    }
  }

  private getMetricUnit(metricName: string): string {
    const units: Record<string, string> = {
      'latency_ms': 'ms',
      'throughput_mbps': 'Mbps',
      'success_rate': '%',
      'rsrp_dbm': 'dBm',
      'rsrq_db': 'dB',
      'sinr_db': 'dB'
    };
    
    return units[metricName] || '';
  }

  private async cancelJob(jobId: string): Promise<void> {
    try {
      await this.supabase
        .from('test_run_queue')
        .update({
          status: 'cancelled',
          completed_at: new Date().toISOString()
        })
        .eq('id', jobId);
    } catch (error) {
      console.error('Failed to cancel job:', error);
    }
  }

  // Public methods for external control
  async getStatus(): Promise<any> {
    return {
      worker_id: this.workerId,
      worker_name: this.workerName,
      is_running: this.isRunning,
      current_load: this.currentJobs.size,
      max_load: this.capabilities.max_concurrent_tests,
      capabilities: this.capabilities,
      current_jobs: Array.from(this.currentJobs.keys())
    };
  }

  async getCurrentJobs(): Promise<TestExecutionJob[]> {
    return Array.from(this.currentJobs.values());
  }
}

// Worker manager for coordinating multiple workers
export class TestExecutionWorkerManager {
  private workers: Map<string, TestExecutionWorker> = new Map();
  private isRunning: boolean = false;

  async startWorker(workerId: string, workerName: string, capabilities: WorkerCapabilities): Promise<void> {
    if (this.workers.has(workerId)) {
      throw new Error(`Worker ${workerId} already exists`);
    }

    const worker = new TestExecutionWorker(workerId, workerName, capabilities);
    await worker.start();
    this.workers.set(workerId, worker);
  }

  async stopWorker(workerId: string): Promise<void> {
    const worker = this.workers.get(workerId);
    if (!worker) {
      throw new Error(`Worker ${workerId} not found`);
    }

    await worker.stop();
    this.workers.delete(workerId);
  }

  async stopAllWorkers(): Promise<void> {
    const stopPromises = Array.from(this.workers.values()).map(worker => worker.stop());
    await Promise.all(stopPromises);
    this.workers.clear();
  }

  getWorkerStatus(): any[] {
    return Array.from(this.workers.values()).map(worker => worker.getStatus());
  }

  getTotalLoad(): number {
    return Array.from(this.workers.values()).reduce((total, worker) => {
      return total + worker.getCurrentJobs().length;
    }, 0);
  }
}

// Default worker capabilities
export const DEFAULT_WORKER_CAPABILITIES: WorkerCapabilities = {
  protocols: ['5G_NR', '4G_LTE', 'IMS_SIP', 'O_RAN', 'NB_IoT', 'V2X', 'NTN'],
  execution_modes: ['simulation', 'realtime', 'batch'],
  max_concurrent_tests: 5,
  supported_features: ['message_flow', 'performance_metrics', 'artifact_generation', 'real_time_monitoring']
};
/**
 * Test Execution Worker - Professional Protocol Analyzer Test Runner
 * Handles distributed test execution with queue management and worker coordination
 */

import { createClient } from './supabase';

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

      // Simulate test execution based on test type and configuration
      const duration = await this.simulateTestExecution(testCase, job.configuration);
      
      // Generate realistic metrics based on test type
      const metrics = this.generateTestMetrics(testCase, job.configuration);
      
      // Determine pass/fail based on metrics and test criteria
      const status = this.evaluateTestResult(testCase, metrics);
      
      // Generate errors and warnings
      const { errors, warnings } = this.generateTestIssues(testCase, metrics, status);

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

  private async simulateTestExecution(testCase: any, config: any): Promise<number> {
    // Simulate realistic test execution time
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

  private evaluateTestResult(testCase: any, metrics: any): 'passed' | 'failed' | 'warning' {
    const successCriteria = testCase.success_criteria || {};
    const failureThresholds = testCase.failure_thresholds || {};
    
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
    
    // Check for warnings (close to failure thresholds)
    if (failureThresholds.latency_ms?.max && metrics.latency_ms > failureThresholds.latency_ms.max * 0.8) {
      return 'warning';
    }
    
    return 'passed';
  }

  private generateTestIssues(testCase: any, metrics: any, status: string): { errors: string[], warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    if (status === 'failed') {
      // Generate realistic failure reasons
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
    
    if (status === 'warning' || Math.random() < 0.3) {
      // Generate warnings
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
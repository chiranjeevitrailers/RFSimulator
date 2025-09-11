import { TestCase, TestCaseExecution, TestCaseResult } from './test-cases';

export interface ProtocolLayer {
  name: string;
  parameters: Record<string, any>;
  status: 'idle' | 'active' | 'error';
  metrics: Record<string, any>;
}

export interface SimulationStep {
  id: string;
  name: string;
  layer: string;
  direction: 'UL' | 'DL' | 'BIDIRECTIONAL';
  message: string;
  parameters: Record<string, any>;
  expectedResult: any;
  timeout: number;
  retryCount: number;
  dependencies: string[];
}

export interface SimulationContext {
  testCase: TestCase;
  execution: TestCaseExecution;
  currentStep: number;
  layers: Map<string, ProtocolLayer>;
  variables: Record<string, any>;
  startTime: number;
  endTime?: number;
}

export interface SimulationResult {
  success: boolean;
  duration: number;
  steps: SimulationStepResult[];
  errors: string[];
  metrics: Record<string, any>;
  logs: string[];
}

export interface SimulationStepResult {
  stepId: string;
  success: boolean;
  duration: number;
  result?: any;
  error?: string;
  metrics?: Record<string, any>;
}

export class ProtocolSimulator {
  private context: SimulationContext | null = null;
  private isRunning = false;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor() {
    this.setupEventListeners();
  }

  // Event System
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  private setupEventListeners(): void {
    // Setup default event listeners for logging
    this.on('step_started', (data) => {
      console.log(`Step started: ${data.step.name}`);
    });

    this.on('step_completed', (data) => {
      console.log(`Step completed: ${data.step.name} (${data.duration}ms)`);
    });

    this.on('step_failed', (data) => {
      console.error(`Step failed: ${data.step.name} - ${data.error}`);
    });

    this.on('simulation_progress', (data) => {
      console.log(`Simulation progress: ${data.progress}%`);
    });
  }

  // Main Simulation Methods
  async startSimulation(testCase: TestCase, execution: TestCaseExecution): Promise<SimulationResult> {
    if (this.isRunning) {
      throw new Error('Simulation is already running');
    }

    this.isRunning = true;
    this.context = this.createSimulationContext(testCase, execution);

    try {
      this.emit('simulation_started', { testCase, execution });
      
      const result = await this.executeSimulation();
      
      this.emit('simulation_completed', { result });
      return result;
    } catch (error) {
      this.emit('simulation_failed', { error });
      throw error;
    } finally {
      this.isRunning = false;
      this.context = null;
    }
  }

  async stopSimulation(): Promise<void> {
    if (!this.isRunning || !this.context) {
      return;
    }

    this.isRunning = false;
    this.context.endTime = Date.now();
    
    this.emit('simulation_stopped', { 
      duration: this.context.endTime - this.context.startTime 
    });
  }

  private createSimulationContext(testCase: TestCase, execution: TestCaseExecution): SimulationContext {
    const layers = new Map<string, ProtocolLayer>();
    
    // Initialize protocol layers based on test case
    if (testCase.layers) {
      Object.keys(testCase.layers).forEach(layerName => {
        layers.set(layerName, {
          name: layerName,
          parameters: testCase.layers[layerName] || {},
          status: 'idle',
          metrics: {}
        });
      });
    }

    return {
      testCase,
      execution,
      currentStep: 0,
      layers,
      variables: {},
      startTime: Date.now()
    };
  }

  private async executeSimulation(): Promise<SimulationResult> {
    if (!this.context) {
      throw new Error('No simulation context available');
    }

    const steps = this.parseMessageFlow(this.context.testCase.message_flow);
    const stepResults: SimulationStepResult[] = [];
    const errors: string[] = [];
    const logs: string[] = [];

    this.context.execution.total_steps = steps.length;
    this.context.execution.status = 'running';

    for (let i = 0; i < steps.length; i++) {
      if (!this.isRunning) {
        break;
      }

      const step = steps[i];
      this.context.currentStep = i;
      this.context.execution.current_step = step.name;
      this.context.execution.progress_percentage = Math.round((i / steps.length) * 100);

      this.emit('simulation_progress', { 
        progress: this.context.execution.progress_percentage,
        currentStep: step.name,
        totalSteps: steps.length
      });

      try {
        const stepResult = await this.executeStep(step);
        stepResults.push(stepResult);
        
        if (stepResult.success) {
          this.context.execution.completed_steps++;
          logs.push(`Step ${i + 1}: ${step.name} - PASSED`);
        } else {
          errors.push(`Step ${i + 1}: ${step.name} - ${stepResult.error}`);
          logs.push(`Step ${i + 1}: ${step.name} - FAILED: ${stepResult.error}`);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Step ${i + 1}: ${step.name} - ${errorMessage}`);
        logs.push(`Step ${i + 1}: ${step.name} - ERROR: ${errorMessage}`);
        
        stepResults.push({
          stepId: step.id,
          success: false,
          duration: 0,
          error: errorMessage
        });
      }
    }

    const success = errors.length === 0;
    const duration = Date.now() - this.context.startTime;

    this.context.execution.status = success ? 'completed' : 'failed';
    this.context.execution.end_time = new Date().toISOString();
    this.context.execution.duration_ms = duration;
    this.context.execution.progress_percentage = 100;

    return {
      success,
      duration,
      steps: stepResults,
      errors,
      metrics: this.calculateMetrics(),
      logs
    };
  }

  private parseMessageFlow(messageFlow: any[]): SimulationStep[] {
    return messageFlow.map((message, index) => ({
      id: `step_${index}`,
      name: message.message || `Step ${index + 1}`,
      layer: message.layer || 'UNKNOWN',
      direction: message.direction || 'BIDIRECTIONAL',
      message: message.message || '',
      parameters: message.values || {},
      expectedResult: message.expected_result,
      timeout: message.timeout || 5000,
      retryCount: 0,
      dependencies: message.dependencies || []
    }));
  }

  private async executeStep(step: SimulationStep): Promise<SimulationStepResult> {
    const startTime = Date.now();
    
    this.emit('step_started', { step });

    try {
      // Simulate step execution based on layer
      const result = await this.simulateLayerOperation(step);
      const duration = Date.now() - startTime;

      this.emit('step_completed', { step, result, duration });

      return {
        stepId: step.id,
        success: true,
        duration,
        result,
        metrics: this.getLayerMetrics(step.layer)
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      this.emit('step_failed', { step, error: errorMessage, duration });

      return {
        stepId: step.id,
        success: false,
        duration,
        error: errorMessage
      };
    }
  }

  private async simulateLayerOperation(step: SimulationStep): Promise<any> {
    if (!this.context) {
      throw new Error('No simulation context available');
    }

    const layer = this.context.layers.get(step.layer);
    if (!layer) {
      throw new Error(`Layer ${step.layer} not found`);
    }

    // Simulate different layer operations
    switch (step.layer) {
      case 'PHY':
        return this.simulatePHYOperation(step, layer);
      case 'MAC':
        return this.simulateMACOperation(step, layer);
      case 'RLC':
        return this.simulateRLCOperation(step, layer);
      case 'PDCP':
        return this.simulatePDCPOperation(step, layer);
      case 'RRC':
        return this.simulateRRCOperation(step, layer);
      case 'NAS':
        return this.simulateNASOperation(step, layer);
      case 'SIP':
        return this.simulateSIPOperation(step, layer);
      case 'IMS':
        return this.simulateIMSOperation(step, layer);
      case 'E2':
        return this.simulateE2Operation(step, layer);
      case 'PC5':
        return this.simulatePC5Operation(step, layer);
      case 'V2X':
        return this.simulateV2XOperation(step, layer);
      case 'NTN':
        return this.simulateNTNOperation(step, layer);
      default:
        return this.simulateGenericOperation(step, layer);
    }
  }

  // Layer-specific simulation methods
  private async simulatePHYOperation(step: SimulationStep, layer: ProtocolLayer): Promise<any> {
    // Simulate PHY layer operations (PRACH, RAR, measurements, etc.)
    await this.delay(this.getRandomDelay(100, 500));
    
    layer.status = 'active';
    layer.metrics = {
      ...layer.metrics,
      rsrp: this.getRandomValue(-120, -60),
      rsrq: this.getRandomValue(-20, -5),
      sinr: this.getRandomValue(0, 25),
      cqi: this.getRandomValue(1, 15),
      bler: this.getRandomValue(0, 0.1)
    };

    return {
      layer: 'PHY',
      operation: step.message,
      parameters: step.parameters,
      metrics: layer.metrics
    };
  }

  private async simulateMACOperation(step: SimulationStep, layer: ProtocolLayer): Promise<any> {
    // Simulate MAC layer operations (HARQ, scheduling, random access, etc.)
    await this.delay(this.getRandomDelay(50, 200));
    
    layer.status = 'active';
    layer.metrics = {
      ...layer.metrics,
      harq_processes: this.getRandomValue(1, 16),
      sched_requests: this.getRandomValue(0, 10),
      buffer_status_reports: this.getRandomValue(0, 5)
    };

    return {
      layer: 'MAC',
      operation: step.message,
      parameters: step.parameters,
      metrics: layer.metrics
    };
  }

  private async simulateRLCOperation(step: SimulationStep, layer: ProtocolLayer): Promise<any> {
    // Simulate RLC layer operations (AM/UM modes, sequence numbers, etc.)
    await this.delay(this.getRandomDelay(20, 100));
    
    layer.status = 'active';
    layer.metrics = {
      ...layer.metrics,
      tx_pdus: this.getRandomValue(0, 100),
      rx_pdus: this.getRandomValue(0, 100),
      retransmissions: this.getRandomValue(0, 10)
    };

    return {
      layer: 'RLC',
      operation: step.message,
      parameters: step.parameters,
      metrics: layer.metrics
    };
  }

  private async simulatePDCPOperation(step: SimulationStep, layer: ProtocolLayer): Promise<any> {
    // Simulate PDCP layer operations (sequence numbers, security, etc.)
    await this.delay(this.getRandomDelay(10, 50));
    
    layer.status = 'active';
    layer.metrics = {
      ...layer.metrics,
      tx_packets: this.getRandomValue(0, 200),
      rx_packets: this.getRandomValue(0, 200),
      dropped_packets: this.getRandomValue(0, 5)
    };

    return {
      layer: 'PDCP',
      operation: step.message,
      parameters: step.parameters,
      metrics: layer.metrics
    };
  }

  private async simulateRRCOperation(step: SimulationStep, layer: ProtocolLayer): Promise<any> {
    // Simulate RRC layer operations (connection management, mobility, etc.)
    await this.delay(this.getRandomDelay(100, 1000));
    
    layer.status = 'active';
    layer.metrics = {
      ...layer.metrics,
      connection_state: 'RRC_CONNECTED',
      establishment_cause: step.parameters.establishment_cause || 'mo-Data'
    };

    return {
      layer: 'RRC',
      operation: step.message,
      parameters: step.parameters,
      metrics: layer.metrics
    };
  }

  private async simulateNASOperation(step: SimulationStep, layer: ProtocolLayer): Promise<any> {
    // Simulate NAS layer operations (registration, authentication, PDU sessions, etc.)
    await this.delay(this.getRandomDelay(200, 2000));
    
    layer.status = 'active';
    layer.metrics = {
      ...layer.metrics,
      registration_state: 'REGISTERED',
      security_context: 'active'
    };

    return {
      layer: 'NAS',
      operation: step.message,
      parameters: step.parameters,
      metrics: layer.metrics
    };
  }

  private async simulateSIPOperation(step: SimulationStep, layer: ProtocolLayer): Promise<any> {
    // Simulate SIP operations (registration, call setup, etc.)
    await this.delay(this.getRandomDelay(100, 1000));
    
    layer.status = 'active';
    layer.metrics = {
      ...layer.metrics,
      response_code: this.getRandomValue(200, 299),
      call_id: this.generateCallId()
    };

    return {
      layer: 'SIP',
      operation: step.message,
      parameters: step.parameters,
      metrics: layer.metrics
    };
  }

  private async simulateIMSOperation(step: SimulationStep, layer: ProtocolLayer): Promise<any> {
    // Simulate IMS operations (service routing, charging, etc.)
    await this.delay(this.getRandomDelay(50, 500));
    
    layer.status = 'active';
    layer.metrics = {
      ...layer.metrics,
      service_route: 'configured',
      p_asserted_identity: 'verified'
    };

    return {
      layer: 'IMS',
      operation: step.message,
      parameters: step.parameters,
      metrics: layer.metrics
    };
  }

  private async simulateE2Operation(step: SimulationStep, layer: ProtocolLayer): Promise<any> {
    // Simulate O-RAN E2 operations (setup, subscription, reporting, etc.)
    await this.delay(this.getRandomDelay(100, 500));
    
    layer.status = 'active';
    layer.metrics = {
      ...layer.metrics,
      interface_type: 'E2',
      connection_state: 'CONNECTED'
    };

    return {
      layer: 'E2',
      operation: step.message,
      parameters: step.parameters,
      metrics: layer.metrics
    };
  }

  private async simulatePC5Operation(step: SimulationStep, layer: ProtocolLayer): Promise<any> {
    // Simulate PC5 sidelink operations (discovery, communication, etc.)
    await this.delay(this.getRandomDelay(100, 1000));
    
    layer.status = 'active';
    layer.metrics = {
      ...layer.metrics,
      sidelink_operation: 'active',
      communication_mode: 'broadcast'
    };

    return {
      layer: 'PC5',
      operation: step.message,
      parameters: step.parameters,
      metrics: layer.metrics
    };
  }

  private async simulateV2XOperation(step: SimulationStep, layer: ProtocolLayer): Promise<any> {
    // Simulate V2X operations (CAM, DENM, etc.)
    await this.delay(this.getRandomDelay(50, 200));
    
    layer.status = 'active';
    layer.metrics = {
      ...layer.metrics,
      service_type: 'V2V',
      message_type: 'CAM'
    };

    return {
      layer: 'V2X',
      operation: step.message,
      parameters: step.parameters,
      metrics: layer.metrics
    };
  }

  private async simulateNTNOperation(step: SimulationStep, layer: ProtocolLayer): Promise<any> {
    // Simulate NTN operations (satellite access, high latency compensation, etc.)
    await this.delay(this.getRandomDelay(1000, 5000)); // Higher latency for NTN
    
    layer.status = 'active';
    layer.metrics = {
      ...layer.metrics,
      network_type: 'LEO',
      latency_compensation: 'applied'
    };

    return {
      layer: 'NTN',
      operation: step.message,
      parameters: step.parameters,
      metrics: layer.metrics
    };
  }

  private async simulateGenericOperation(step: SimulationStep, layer: ProtocolLayer): Promise<any> {
    // Generic simulation for unknown layers
    await this.delay(this.getRandomDelay(50, 200));
    
    layer.status = 'active';
    layer.metrics = {
      ...layer.metrics,
      operation: step.message,
      timestamp: Date.now()
    };

    return {
      layer: step.layer,
      operation: step.message,
      parameters: step.parameters,
      metrics: layer.metrics
    };
  }

  // Utility methods
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getRandomDelay(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private getRandomValue(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  private generateCallId(): string {
    return Math.random().toString(36).substring(2, 15) + '@kamailio.org';
  }

  private getLayerMetrics(layerName: string): Record<string, any> {
    if (!this.context) {
      return {};
    }

    const layer = this.context.layers.get(layerName);
    return layer?.metrics || {};
  }

  private calculateMetrics(): Record<string, any> {
    if (!this.context) {
      return {};
    }

    const metrics: Record<string, any> = {};
    
    this.context.layers.forEach((layer, name) => {
      metrics[name] = layer.metrics;
    });

    return metrics;
  }

  // Public getters
  get isSimulationRunning(): boolean {
    return this.isRunning;
  }

  get currentContext(): SimulationContext | null {
    return this.context;
  }

  get progress(): number {
    if (!this.context) {
      return 0;
    }
    return this.context.execution.progress_percentage;
  }
}
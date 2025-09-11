import { TestCase, TestCaseService } from './test-cases';
import { ProtocolSimulator } from './protocol-simulator';
import { SimulationManager } from './simulation-manager';
import { RealTimeSimulator } from './real-time-simulator';

export interface TestExecutionResult {
  id: string;
  testCaseId: string;
  userId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  progress: number;
  currentStep: number;
  totalSteps: number;
  results: {
    success: boolean;
    errorMessage?: string;
    performanceMetrics: {
      executionTime: number;
      memoryUsage: number;
      cpuUsage: number;
      networkLatency: number;
      throughput: number;
      errorRate: number;
    };
    layerResults: {
      [layer: string]: {
        success: boolean;
        messagesProcessed: number;
        errors: number;
        timing: number;
        parameters: any;
      };
    };
    messageFlow: Array<{
      timestamp: number;
      direction: 'UL' | 'DL';
      layer: string;
      message: string;
      values: any;
      success: boolean;
      error?: string;
    }>;
  };
  logs: Array<{
    timestamp: Date;
    level: 'info' | 'warn' | 'error' | 'debug';
    message: string;
    data?: any;
  }>;
}

export interface TestExecutionConfig {
  userId: string;
  testCaseId: string;
  executionMode: 'standard' | 'realtime' | 'batch';
  timeAcceleration?: number;
  maxConcurrentExecutions?: number;
  enableLogging?: boolean;
  enableMetrics?: boolean;
  customParameters?: any;
}

export class TestExecutionEngine {
  private static instance: TestExecutionEngine;
  private activeExecutions: Map<string, TestExecutionResult> = new Map();
  private executionQueue: TestExecutionConfig[] = [];
  private isProcessing = false;
  private maxConcurrentExecutions = 5;
  private eventListeners: Map<string, Function[]> = new Map();

  private constructor() {
    this.startExecutionProcessor();
  }

  public static getInstance(): TestExecutionEngine {
    if (!TestExecutionEngine.instance) {
      TestExecutionEngine.instance = new TestExecutionEngine();
    }
    return TestExecutionEngine.instance;
  }

  // Event system
  public on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  public off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  // Execution management
  public async executeTest(config: TestExecutionConfig): Promise<string> {
    const executionId = this.generateExecutionId();
    
    // Create execution result
    const execution: TestExecutionResult = {
      id: executionId,
      testCaseId: config.testCaseId,
      userId: config.userId,
      status: 'pending',
      startTime: new Date(),
      progress: 0,
      currentStep: 0,
      totalSteps: 0,
      results: {
        success: false,
        performanceMetrics: {
          executionTime: 0,
          memoryUsage: 0,
          cpuUsage: 0,
          networkLatency: 0,
          throughput: 0,
          errorRate: 0
        },
        layerResults: {},
        messageFlow: []
      },
      logs: []
    };

    this.activeExecutions.set(executionId, execution);
    this.executionQueue.push(config);

    this.emit('executionQueued', { executionId, config });
    this.log(executionId, 'info', 'Test execution queued', { config });

    return executionId;
  }

  public async cancelExecution(executionId: string): Promise<boolean> {
    const execution = this.activeExecutions.get(executionId);
    if (!execution) {
      return false;
    }

    if (execution.status === 'running') {
      execution.status = 'cancelled';
      execution.endTime = new Date();
      execution.duration = execution.endTime.getTime() - execution.startTime.getTime();
      
      this.log(executionId, 'info', 'Test execution cancelled');
      this.emit('executionCancelled', { executionId, execution });
    }

    return true;
  }

  public getExecutionStatus(executionId: string): TestExecutionResult | null {
    return this.activeExecutions.get(executionId) || null;
  }

  public getAllExecutions(userId?: string): TestExecutionResult[] {
    const executions = Array.from(this.activeExecutions.values());
    return userId ? executions.filter(e => e.userId === userId) : executions;
  }

  // Execution processor
  private async startExecutionProcessor(): Promise<void> {
    setInterval(async () => {
      if (!this.isProcessing && this.executionQueue.length > 0) {
        await this.processExecutionQueue();
      }
    }, 1000);
  }

  private async processExecutionQueue(): Promise<void> {
    this.isProcessing = true;

    while (this.executionQueue.length > 0 && this.getActiveExecutionCount() < this.maxConcurrentExecutions) {
      const config = this.executionQueue.shift();
      if (config) {
        this.executeTestAsync(config).catch(error => {
          console.error('Test execution error:', error);
        });
      }
    }

    this.isProcessing = false;
  }

  private getActiveExecutionCount(): number {
    return Array.from(this.activeExecutions.values()).filter(e => e.status === 'running').length;
  }

  private async executeTestAsync(config: TestExecutionConfig): Promise<void> {
    const execution = this.activeExecutions.get(config.testCaseId);
    if (!execution) {
      return;
    }

    try {
      execution.status = 'running';
      this.emit('executionStarted', { executionId: execution.id, execution });

      // Load test case
      const testCase = await TestCaseService.getTestCase(config.testCaseId);
      if (!testCase) {
        throw new Error('Test case not found');
      }

      execution.totalSteps = testCase.message_flow.length;
      this.log(execution.id, 'info', 'Test case loaded', { testCaseId: config.testCaseId });

      // Initialize simulator based on execution mode
      let simulator: ProtocolSimulator | RealTimeSimulator;
      
      if (config.executionMode === 'realtime') {
        simulator = new RealTimeSimulator({
          timeAcceleration: config.timeAcceleration || 1,
          enableBuffering: true,
          enableSynchronization: true
        });
      } else {
        simulator = new ProtocolSimulator();
      }

      // Execute test case
      const startTime = Date.now();
      const results = await this.executeTestCase(testCase, simulator, execution, config);
      const endTime = Date.now();

      // Update execution results
      execution.status = results.success ? 'completed' : 'failed';
      execution.endTime = new Date();
      execution.duration = endTime - startTime;
      execution.progress = 100;
      execution.results = results;
      execution.results.performanceMetrics.executionTime = execution.duration;

      this.log(execution.id, 'info', 'Test execution completed', { 
        success: results.success, 
        duration: execution.duration 
      });

      this.emit('executionCompleted', { executionId: execution.id, execution });

    } catch (error) {
      execution.status = 'failed';
      execution.endTime = new Date();
      execution.duration = execution.endTime.getTime() - execution.startTime.getTime();
      execution.results.errorMessage = error instanceof Error ? error.message : 'Unknown error';

      this.log(execution.id, 'error', 'Test execution failed', { error: error.message });
      this.emit('executionFailed', { executionId: execution.id, execution, error });
    }
  }

  private async executeTestCase(
    testCase: TestCase, 
    simulator: ProtocolSimulator | RealTimeSimulator, 
    execution: TestExecutionResult,
    config: TestExecutionConfig
  ): Promise<TestExecutionResult['results']> {
    const results: TestExecutionResult['results'] = {
      success: true,
      performanceMetrics: {
        executionTime: 0,
        memoryUsage: 0,
        cpuUsage: 0,
        networkLatency: 0,
        throughput: 0,
        errorRate: 0
      },
      layerResults: {},
      messageFlow: []
    };

    try {
      // Initialize layers
      const layers = testCase.layers;
      const layerNames = Object.keys(layers);
      
      for (const layerName of layerNames) {
        results.layerResults[layerName] = {
          success: true,
          messagesProcessed: 0,
          errors: 0,
          timing: 0,
          parameters: layers[layerName]
        };
      }

      // Execute message flow
      for (let i = 0; i < testCase.message_flow.length; i++) {
        const message = testCase.message_flow[i];
        execution.currentStep = i + 1;
        execution.progress = ((i + 1) / testCase.message_flow.length) * 100;

        this.log(execution.id, 'debug', `Executing step ${i + 1}/${testCase.message_flow.length}`, { message });

        // Simulate message processing
        const messageResult = await this.simulateMessage(message, layers, simulator, config);
        
        results.messageFlow.push({
          timestamp: message.timestamp,
          direction: message.direction,
          layer: message.layer,
          message: message.message,
          values: message.values,
          success: messageResult.success,
          error: messageResult.error
        });

        // Update layer results
        if (results.layerResults[message.layer]) {
          results.layerResults[message.layer].messagesProcessed++;
          if (!messageResult.success) {
            results.layerResults[message.layer].errors++;
            results.layerResults[message.layer].success = false;
            results.success = false;
          }
        }

        // Emit progress update
        this.emit('executionProgress', { 
          executionId: execution.id, 
          progress: execution.progress, 
          currentStep: execution.currentStep,
          totalSteps: execution.totalSteps 
        });

        // Add delay for real-time simulation
        if (config.executionMode === 'realtime' && i < testCase.message_flow.length - 1) {
          const nextMessage = testCase.message_flow[i + 1];
          const delay = (nextMessage.timestamp - message.timestamp) / (config.timeAcceleration || 1);
          if (delay > 0) {
            await this.sleep(delay);
          }
        }
      }

      // Calculate performance metrics
      results.performanceMetrics = this.calculatePerformanceMetrics(results, execution);

    } catch (error) {
      results.success = false;
      results.errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.log(execution.id, 'error', 'Test case execution failed', { error: error.message });
    }

    return results;
  }

  private async simulateMessage(
    message: any, 
    layers: any, 
    simulator: ProtocolSimulator | RealTimeSimulator,
    config: TestExecutionConfig
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Simulate message processing based on layer
      switch (message.layer) {
        case 'RRC':
          return await this.simulateRRCMessage(message, layers, simulator);
        case 'MAC':
          return await this.simulateMACMessage(message, layers, simulator);
        case 'RLC':
          return await this.simulateRLCMessage(message, layers, simulator);
        case 'PDCP':
          return await this.simulatePDCPMessage(message, layers, simulator);
        case 'NAS':
          return await this.simulateNASMessage(message, layers, simulator);
        case 'SIP':
          return await this.simulateSIPMessage(message, layers, simulator);
        case 'E2':
          return await this.simulateE2Message(message, layers, simulator);
        case 'A1':
          return await this.simulateA1Message(message, layers, simulator);
        case 'O1':
          return await this.simulateO1Message(message, layers, simulator);
        case 'PC5':
          return await this.simulatePC5Message(message, layers, simulator);
        case 'NTN':
          return await this.simulateNTNMessage(message, layers, simulator);
        default:
          return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Layer-specific simulation methods
  private async simulateRRCMessage(message: any, layers: any, simulator: any): Promise<{ success: boolean; error?: string }> {
    // Simulate RRC message processing
    await this.sleep(Math.random() * 10 + 5); // 5-15ms simulation delay
    return { success: Math.random() > 0.05 }; // 95% success rate
  }

  private async simulateMACMessage(message: any, layers: any, simulator: any): Promise<{ success: boolean; error?: string }> {
    // Simulate MAC message processing
    await this.sleep(Math.random() * 5 + 2); // 2-7ms simulation delay
    return { success: Math.random() > 0.02 }; // 98% success rate
  }

  private async simulateRLCMessage(message: any, layers: any, simulator: any): Promise<{ success: boolean; error?: string }> {
    // Simulate RLC message processing
    await this.sleep(Math.random() * 8 + 3); // 3-11ms simulation delay
    return { success: Math.random() > 0.03 }; // 97% success rate
  }

  private async simulatePDCPMessage(message: any, layers: any, simulator: any): Promise<{ success: boolean; error?: string }> {
    // Simulate PDCP message processing
    await this.sleep(Math.random() * 6 + 2); // 2-8ms simulation delay
    return { success: Math.random() > 0.01 }; // 99% success rate
  }

  private async simulateNASMessage(message: any, layers: any, simulator: any): Promise<{ success: boolean; error?: string }> {
    // Simulate NAS message processing
    await this.sleep(Math.random() * 15 + 10); // 10-25ms simulation delay
    return { success: Math.random() > 0.04 }; // 96% success rate
  }

  private async simulateSIPMessage(message: any, layers: any, simulator: any): Promise<{ success: boolean; error?: string }> {
    // Simulate SIP message processing
    await this.sleep(Math.random() * 20 + 10); // 10-30ms simulation delay
    return { success: Math.random() > 0.03 }; // 97% success rate
  }

  private async simulateE2Message(message: any, layers: any, simulator: any): Promise<{ success: boolean; error?: string }> {
    // Simulate E2 message processing
    await this.sleep(Math.random() * 25 + 15); // 15-40ms simulation delay
    return { success: Math.random() > 0.05 }; // 95% success rate
  }

  private async simulateA1Message(message: any, layers: any, simulator: any): Promise<{ success: boolean; error?: string }> {
    // Simulate A1 message processing
    await this.sleep(Math.random() * 30 + 20); // 20-50ms simulation delay
    return { success: Math.random() > 0.06 }; // 94% success rate
  }

  private async simulateO1Message(message: any, layers: any, simulator: any): Promise<{ success: boolean; error?: string }> {
    // Simulate O1 message processing
    await this.sleep(Math.random() * 40 + 30); // 30-70ms simulation delay
    return { success: Math.random() > 0.07 }; // 93% success rate
  }

  private async simulatePC5Message(message: any, layers: any, simulator: any): Promise<{ success: boolean; error?: string }> {
    // Simulate PC5 message processing
    await this.sleep(Math.random() * 12 + 5); // 5-17ms simulation delay
    return { success: Math.random() > 0.04 }; // 96% success rate
  }

  private async simulateNTNMessage(message: any, layers: any, simulator: any): Promise<{ success: boolean; error?: string }> {
    // Simulate NTN message processing
    await this.sleep(Math.random() * 100 + 50); // 50-150ms simulation delay (satellite delay)
    return { success: Math.random() > 0.08 }; // 92% success rate
  }

  private calculatePerformanceMetrics(results: TestExecutionResult['results'], execution: TestExecutionResult): TestExecutionResult['results']['performanceMetrics'] {
    const totalMessages = results.messageFlow.length;
    const successfulMessages = results.messageFlow.filter(m => m.success).length;
    const failedMessages = totalMessages - successfulMessages;

    return {
      executionTime: execution.duration || 0,
      memoryUsage: Math.random() * 100 + 50, // Simulated memory usage (50-150 MB)
      cpuUsage: Math.random() * 30 + 10, // Simulated CPU usage (10-40%)
      networkLatency: Math.random() * 50 + 10, // Simulated network latency (10-60ms)
      throughput: totalMessages / ((execution.duration || 1) / 1000), // Messages per second
      errorRate: (failedMessages / totalMessages) * 100 // Error rate percentage
    };
  }

  private generateExecutionId(): string {
    return `exec_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private log(executionId: string, level: 'info' | 'warn' | 'error' | 'debug', message: string, data?: any): void {
    const execution = this.activeExecutions.get(executionId);
    if (execution) {
      execution.logs.push({
        timestamp: new Date(),
        level,
        message,
        data
      });
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Cleanup methods
  public cleanup(): void {
    this.activeExecutions.clear();
    this.executionQueue = [];
    this.eventListeners.clear();
  }

  public getStats(): {
    activeExecutions: number;
    queuedExecutions: number;
    completedExecutions: number;
    failedExecutions: number;
  } {
    const executions = Array.from(this.activeExecutions.values());
    return {
      activeExecutions: executions.filter(e => e.status === 'running').length,
      queuedExecutions: this.executionQueue.length,
      completedExecutions: executions.filter(e => e.status === 'completed').length,
      failedExecutions: executions.filter(e => e.status === 'failed').length
    };
  }
}
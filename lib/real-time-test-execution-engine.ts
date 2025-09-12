/**
 * Real-Time Test Execution Engine for 5GLabX Platform
 * Integrates with Protocol Analyzer for live message flow display
 */

import { ComprehensiveTestCaseGenerator, TestCaseExecution, TestCaseMessage, LayerStatistics } from './comprehensive-test-case-generator';

export interface RealTimeExecutionConfig {
  testCaseId: string;
  userId: string;
  executionMode: 'simulation' | 'realtime' | 'batch';
  timeAcceleration: number;
  logLevel: 'basic' | 'detailed' | 'verbose';
  captureMode: 'messages' | 'full' | 'performance';
  enableProtocolAnalyzer: boolean;
  enableLayerStatistics: boolean;
  enablePerformanceMetrics: boolean;
}

export interface RealTimeExecutionResult {
  executionId: string;
  testCaseId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startTime: number;
  endTime?: number;
  duration?: number;
  progress: number;
  currentStep: string;
  totalSteps: number;
  completedSteps: number;
  messages: TestCaseMessage[];
  layerStatistics: LayerStatistics[];
  performanceMetrics: {
    totalMessages: number;
    successfulMessages: number;
    failedMessages: number;
    averageLatency: number;
    maxLatency: number;
    minLatency: number;
    throughput: number;
    errorRate: number;
    successRate: number;
    overallComplianceScore: number;
  };
  logs: string[];
  errors: string[];
  warnings: string[];
  protocolAnalyzerData: {
    messageFlow: TestCaseMessage[];
    layerBreakdown: { [layer: string]: TestCaseMessage[] };
    performanceTrends: any[];
    complianceMetrics: any;
  };
}

export class RealTimeTestExecutionEngine {
  private static instance: RealTimeTestExecutionEngine;
  private testCaseGenerator: ComprehensiveTestCaseGenerator;
  private activeExecutions: Map<string, RealTimeExecutionResult> = new Map();
  private executionCallbacks: Map<string, Function[]> = new Map();
  private protocolAnalyzerCallbacks: Map<string, Function[]> = new Map();
  private layerStatisticsCallbacks: Map<string, Function[]> = new Map();

  private constructor() {
    this.testCaseGenerator = ComprehensiveTestCaseGenerator.getInstance();
  }

  static getInstance(): RealTimeTestExecutionEngine {
    if (!RealTimeTestExecutionEngine.instance) {
      RealTimeTestExecutionEngine.instance = new RealTimeTestExecutionEngine();
    }
    return RealTimeTestExecutionEngine.instance;
  }

  /**
   * Start real-time test execution
   */
  async startRealTimeExecution(config: RealTimeExecutionConfig): Promise<string> {
    const executionId = `rt_exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Get test case from generator
    const testCases = this.testCaseGenerator.generateComprehensiveTestCases();
    const testCase = testCases.find(tc => tc.id === config.testCaseId);
    
    if (!testCase) {
      throw new Error(`Test case ${config.testCaseId} not found`);
    }

    // Initialize execution result
    const executionResult: RealTimeExecutionResult = {
      executionId,
      testCaseId: config.testCaseId,
      status: 'running',
      startTime: Date.now(),
      progress: 0,
      currentStep: 'Initializing real-time execution',
      totalSteps: testCase.messageFlow.length,
      completedSteps: 0,
      messages: [],
      layerStatistics: [],
      performanceMetrics: {
        totalMessages: 0,
        successfulMessages: 0,
        failedMessages: 0,
        averageLatency: 0,
        maxLatency: 0,
        minLatency: 0,
        throughput: 0,
        errorRate: 0,
        successRate: 0,
        overallComplianceScore: 0
      },
      logs: [],
      errors: [],
      warnings: [],
      protocolAnalyzerData: {
        messageFlow: [],
        layerBreakdown: {},
        performanceTrends: [],
        complianceMetrics: {}
      }
    };

    // Store active execution
    this.activeExecutions.set(executionId, executionResult);

    // Start real-time execution process
    this.executeRealTimeTestCase(executionId, testCase, config);

    return executionId;
  }

  /**
   * Execute test case with real-time updates
   */
  private async executeRealTimeTestCase(
    executionId: string, 
    testCase: any, 
    config: RealTimeExecutionConfig
  ): Promise<void> {
    const execution = this.activeExecutions.get(executionId);
    if (!execution) return;

    try {
      execution.logs.push(`Starting real-time execution of ${testCase.name}`);
      execution.logs.push(`Execution mode: ${config.executionMode}`);
      execution.logs.push(`Time acceleration: ${config.timeAcceleration}x`);
      this.notifyExecutionUpdate(executionId);

      // Process each message in the test case
      for (let i = 0; i < testCase.messageFlow.length; i++) {
        const originalMessage = testCase.messageFlow[i];
        
        // Simulate real-time processing delay based on time acceleration
        const processingDelay = this.calculateProcessingDelay(originalMessage, config);
        await new Promise(resolve => setTimeout(resolve, processingDelay));

        // Create real-time message with current timestamp
        const realTimeMessage: TestCaseMessage = {
          ...originalMessage,
          timestamp: Date.now(),
          performanceData: this.generateRealTimePerformanceData(originalMessage)
        };

        // Add message to execution
        execution.messages.push(realTimeMessage);

        // Update progress
        execution.completedSteps = i + 1;
        execution.progress = Math.round((execution.completedSteps / execution.totalSteps) * 100);
        execution.currentStep = `Processing ${realTimeMessage.messageName}`;

        // Update layer statistics in real-time
        execution.layerStatistics = this.generateRealTimeLayerStatistics(execution.messages);

        // Update performance metrics in real-time
        this.updateRealTimePerformanceMetrics(execution);

        // Update protocol analyzer data in real-time
        this.updateProtocolAnalyzerData(execution, realTimeMessage);

        // Add real-time log entry
        execution.logs.push(
          `[${new Date().toISOString()}] Processed ${realTimeMessage.messageName} ` +
          `(${realTimeMessage.direction} ${realTimeMessage.layer}) - ` +
          `Latency: ${realTimeMessage.performanceData.latency}ms`
        );

        // Notify all listeners
        this.notifyExecutionUpdate(executionId);
        this.notifyProtocolAnalyzerUpdate(executionId, execution.protocolAnalyzerData);
        this.notifyLayerStatisticsUpdate(executionId, execution.layerStatistics);
      }

      // Complete execution
      execution.status = 'completed';
      execution.endTime = Date.now();
      execution.duration = execution.endTime - execution.startTime;
      execution.progress = 100;
      execution.currentStep = 'Execution completed successfully';
      execution.logs.push(`Real-time execution completed in ${execution.duration}ms`);
      execution.logs.push(`Total messages processed: ${execution.messages.length}`);
      execution.logs.push(`Success rate: ${execution.performanceMetrics.successRate.toFixed(2)}%`);

      this.notifyExecutionUpdate(executionId);

    } catch (error) {
      execution.status = 'failed';
      execution.endTime = Date.now();
      execution.duration = execution.endTime - execution.startTime;
      execution.errors.push(error instanceof Error ? error.message : 'Unknown error');
      execution.logs.push(`Real-time execution failed: ${error}`);

      this.notifyExecutionUpdate(executionId);
    }
  }

  /**
   * Calculate processing delay based on message type and configuration
   */
  private calculateProcessingDelay(message: TestCaseMessage, config: RealTimeExecutionConfig): number {
    const baseDelay = this.getBaseDelayForMessageType(message.messageType);
    const timeAcceleration = config.timeAcceleration || 1;
    const randomVariation = Math.random() * 0.5 + 0.75; // 0.75 to 1.25
    
    return Math.max(10, (baseDelay / timeAcceleration) * randomVariation);
  }

  /**
   * Get base delay for message type
   */
  private getBaseDelayForMessageType(messageType: string): number {
    const delays: { [key: string]: number } = {
      'RRCSetupRequest': 50,
      'RRCSetup': 100,
      'RRCSetupComplete': 75,
      'RRCReconfiguration': 150,
      'MeasurementReport': 200,
      'HandoverCommand': 300,
      'HandoverComplete': 250,
      'Paging': 25,
      'ServiceRequest': 100,
      'AttachRequest': 200,
      'AttachAccept': 150,
      'AttachComplete': 100,
      'REGISTER': 100,
      '200 OK': 50,
      'INVITE': 200,
      '100 Trying': 25,
      '180 Ringing': 30,
      'ACK': 50,
      'BYE': 100
    };
    
    return delays[messageType] || 100;
  }

  /**
   * Generate real-time performance data
   */
  private generateRealTimePerformanceData(message: TestCaseMessage): any {
    const baseLatency = this.getBaseDelayForMessageType(message.messageType);
    const variation = (Math.random() - 0.5) * 0.4; // ±20% variation
    const latency = Math.max(1, baseLatency * (1 + variation));
    
    return {
      latency: Math.round(latency),
      processingTime: Math.round(latency * 0.3),
      memoryUsage: Math.floor(Math.random() * 500) + 100,
      cpuUsage: Math.floor(Math.random() * 20) + 5
    };
  }

  /**
   * Generate real-time layer statistics
   */
  private generateRealTimeLayerStatistics(messages: TestCaseMessage[]): LayerStatistics[] {
    const layerStats: Map<string, LayerStatistics> = new Map();

    messages.forEach(message => {
      if (!layerStats.has(message.layer)) {
        layerStats.set(message.layer, {
          layer: message.layer,
          totalMessages: 0,
          successfulMessages: 0,
          failedMessages: 0,
          averageLatency: 0,
          maxLatency: 0,
          minLatency: Infinity,
          throughput: 0,
          errorRate: 0,
          successRate: 0,
          messageTypes: {},
          performanceMetrics: {
            memoryUsage: 0,
            cpuUsage: 0,
            processingTime: 0
          }
        });
      }

      const stats = layerStats.get(message.layer)!;
      stats.totalMessages++;
      
      if (message.validationResult.isValid) {
        stats.successfulMessages++;
      } else {
        stats.failedMessages++;
      }

      stats.averageLatency += message.performanceData.latency;
      stats.maxLatency = Math.max(stats.maxLatency, message.performanceData.latency);
      stats.minLatency = Math.min(stats.minLatency, message.performanceData.latency);

      if (!stats.messageTypes[message.messageType]) {
        stats.messageTypes[message.messageType] = 0;
      }
      stats.messageTypes[message.messageType]++;

      stats.performanceMetrics.memoryUsage += message.performanceData.memoryUsage;
      stats.performanceMetrics.cpuUsage += message.performanceData.cpuUsage;
      stats.performanceMetrics.processingTime += message.performanceData.processingTime;
    });

    // Calculate real-time averages and rates
    layerStats.forEach(stats => {
      if (stats.totalMessages > 0) {
        stats.averageLatency = Math.round(stats.averageLatency / stats.totalMessages);
        stats.errorRate = Math.round((stats.failedMessages / stats.totalMessages) * 100 * 100) / 100;
        stats.successRate = Math.round((stats.successfulMessages / stats.totalMessages) * 100 * 100) / 100;
        stats.throughput = Math.round((stats.totalMessages / (stats.averageLatency / 1000)) * 100) / 100;
        
        stats.performanceMetrics.memoryUsage = Math.round(stats.performanceMetrics.memoryUsage / stats.totalMessages);
        stats.performanceMetrics.cpuUsage = Math.round(stats.performanceMetrics.cpuUsage / stats.totalMessages);
        stats.performanceMetrics.processingTime = Math.round(stats.performanceMetrics.processingTime / stats.totalMessages);
      }
    });

    return Array.from(layerStats.values());
  }

  /**
   * Update real-time performance metrics
   */
  private updateRealTimePerformanceMetrics(execution: RealTimeExecutionResult): void {
    const messages = execution.messages;
    const totalMessages = messages.length;
    
    if (totalMessages === 0) return;

    const successfulMessages = messages.filter(m => m.validationResult.isValid).length;
    const failedMessages = totalMessages - successfulMessages;
    const currentTime = Date.now();
    const executionTime = (currentTime - execution.startTime) / 1000; // seconds

    execution.performanceMetrics = {
      totalMessages,
      successfulMessages,
      failedMessages,
      averageLatency: Math.round(messages.reduce((sum, m) => sum + m.performanceData.latency, 0) / totalMessages),
      maxLatency: Math.max(...messages.map(m => m.performanceData.latency)),
      minLatency: Math.min(...messages.map(m => m.performanceData.latency)),
      throughput: Math.round((totalMessages / executionTime) * 100) / 100,
      errorRate: Math.round((failedMessages / totalMessages) * 100 * 100) / 100,
      successRate: Math.round((successfulMessages / totalMessages) * 100 * 100) / 100,
      overallComplianceScore: Math.round(messages.reduce((sum, m) => sum + m.validationResult.complianceScore, 0) / totalMessages)
    };
  }

  /**
   * Update protocol analyzer data in real-time
   */
  private updateProtocolAnalyzerData(execution: RealTimeExecutionResult, newMessage: TestCaseMessage): void {
    // Update message flow
    execution.protocolAnalyzerData.messageFlow = [...execution.messages];

    // Update layer breakdown
    const layerBreakdown: { [layer: string]: TestCaseMessage[] } = {};
    execution.messages.forEach(message => {
      if (!layerBreakdown[message.layer]) {
        layerBreakdown[message.layer] = [];
      }
      layerBreakdown[message.layer].push(message);
    });
    execution.protocolAnalyzerData.layerBreakdown = layerBreakdown;

    // Update performance trends
    const trend = {
      timestamp: newMessage.timestamp,
      latency: newMessage.performanceData.latency,
      throughput: execution.performanceMetrics.throughput,
      successRate: execution.performanceMetrics.successRate,
      errorRate: execution.performanceMetrics.errorRate
    };
    execution.protocolAnalyzerData.performanceTrends.push(trend);

    // Keep only last 100 trend points for performance
    if (execution.protocolAnalyzerData.performanceTrends.length > 100) {
      execution.protocolAnalyzerData.performanceTrends = execution.protocolAnalyzerData.performanceTrends.slice(-100);
    }

    // Update compliance metrics
    execution.protocolAnalyzerData.complianceMetrics = {
      overallScore: execution.performanceMetrics.overallComplianceScore,
      layerCompliance: execution.layerStatistics.map(stat => ({
        layer: stat.layer,
        complianceScore: stat.successRate,
        messageCount: stat.totalMessages
      })),
      messageTypeCompliance: this.calculateMessageTypeCompliance(execution.messages)
    };
  }

  /**
   * Calculate message type compliance
   */
  private calculateMessageTypeCompliance(messages: TestCaseMessage[]): any {
    const messageTypeStats: { [key: string]: { total: number; successful: number } } = {};
    
    messages.forEach(message => {
      if (!messageTypeStats[message.messageType]) {
        messageTypeStats[message.messageType] = { total: 0, successful: 0 };
      }
      messageTypeStats[message.messageType].total++;
      if (message.validationResult.isValid) {
        messageTypeStats[message.messageType].successful++;
      }
    });

    return Object.entries(messageTypeStats).map(([messageType, stats]) => ({
      messageType,
      totalMessages: stats.total,
      successfulMessages: stats.successful,
      complianceScore: Math.round((stats.successful / stats.total) * 100 * 100) / 100
    }));
  }

  /**
   * Notify execution update
   */
  private notifyExecutionUpdate(executionId: string): void {
    const execution = this.activeExecutions.get(executionId);
    if (!execution) return;

    const callbacks = this.executionCallbacks.get(executionId) || [];
    callbacks.forEach(callback => callback(execution));
  }

  /**
   * Notify protocol analyzer update
   */
  private notifyProtocolAnalyzerUpdate(executionId: string, protocolAnalyzerData: any): void {
    const callbacks = this.protocolAnalyzerCallbacks.get(executionId) || [];
    callbacks.forEach(callback => callback(protocolAnalyzerData));
  }

  /**
   * Notify layer statistics update
   */
  private notifyLayerStatisticsUpdate(executionId: string, layerStatistics: LayerStatistics[]): void {
    const callbacks = this.layerStatisticsCallbacks.get(executionId) || [];
    callbacks.forEach(callback => callback(layerStatistics));
  }

  /**
   * Subscribe to execution updates
   */
  subscribeToExecution(executionId: string, callback: (execution: RealTimeExecutionResult) => void): void {
    if (!this.executionCallbacks.has(executionId)) {
      this.executionCallbacks.set(executionId, []);
    }
    this.executionCallbacks.get(executionId)!.push(callback);
  }

  /**
   * Subscribe to protocol analyzer updates
   */
  subscribeToProtocolAnalyzer(executionId: string, callback: (data: any) => void): void {
    if (!this.protocolAnalyzerCallbacks.has(executionId)) {
      this.protocolAnalyzerCallbacks.set(executionId, []);
    }
    this.protocolAnalyzerCallbacks.get(executionId)!.push(callback);
  }

  /**
   * Subscribe to layer statistics updates
   */
  subscribeToLayerStatistics(executionId: string, callback: (statistics: LayerStatistics[]) => void): void {
    if (!this.layerStatisticsCallbacks.has(executionId)) {
      this.layerStatisticsCallbacks.set(executionId, []);
    }
    this.layerStatisticsCallbacks.get(executionId)!.push(callback);
  }

  /**
   * Get execution by ID
   */
  getExecution(executionId: string): RealTimeExecutionResult | undefined {
    return this.activeExecutions.get(executionId);
  }

  /**
   * Get all active executions
   */
  getAllExecutions(): RealTimeExecutionResult[] {
    return Array.from(this.activeExecutions.values());
  }

  /**
   * Stop execution
   */
  stopExecution(executionId: string): void {
    const execution = this.activeExecutions.get(executionId);
    if (execution && execution.status === 'running') {
      execution.status = 'cancelled';
      execution.endTime = Date.now();
      execution.duration = execution.endTime - execution.startTime;
      execution.logs.push(`Execution cancelled by user at ${new Date().toISOString()}`);
      this.notifyExecutionUpdate(executionId);
    }
  }

  /**
   * Get test cases
   */
  getTestCases(): any[] {
    return this.testCaseGenerator.generateComprehensiveTestCases();
  }

  /**
   * Get test case by ID
   */
  getTestCase(testCaseId: string): any {
    const testCases = this.getTestCases();
    return testCases.find(tc => tc.id === testCaseId);
  }
}

export default RealTimeTestExecutionEngine;
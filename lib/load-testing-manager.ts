import { supabase } from './supabase';

export interface LoadTestConfig {
  id: string;
  name: string;
  description: string;
  type: 'stress' | 'spike' | 'volume' | 'endurance' | 'scalability';
  target: {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    body?: any;
    timeout?: number;
  };
  load: {
    virtualUsers: number;
    rampUpTime: number; // seconds
    duration: number; // seconds
    rampDownTime: number; // seconds
    thinkTime: number; // seconds between requests
  };
  thresholds: {
    responseTime: number; // milliseconds
    errorRate: number; // percentage
    throughput: number; // requests per second
    cpuUsage: number; // percentage
    memoryUsage: number; // percentage
  };
  scenarios: Array<{
    name: string;
    weight: number; // percentage of traffic
    steps: Array<{
      action: string;
      url?: string;
      method?: string;
      headers?: Record<string, string>;
      body?: any;
      waitTime?: number;
    }>;
  }>;
  monitoring: {
    enabled: boolean;
    metrics: string[];
    samplingRate: number; // percentage
  };
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoadTestExecution {
  id: string;
  configId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt: Date;
  completedAt?: Date;
  duration?: number; // seconds
  results: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    minResponseTime: number;
    maxResponseTime: number;
    p50ResponseTime: number;
    p90ResponseTime: number;
    p95ResponseTime: number;
    p99ResponseTime: number;
    throughput: number; // requests per second
    errorRate: number; // percentage
    systemMetrics: {
      cpuUsage: number[];
      memoryUsage: number[];
      diskUsage: number[];
      networkUsage: number[];
    };
    errors: Array<{
      type: string;
      message: string;
      count: number;
      percentage: number;
    }>;
  };
  metadata: {
    config: LoadTestConfig;
    environment: string;
    version: string;
    notes?: string;
  };
  createdAt: Date;
}

export interface PerformanceBaseline {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  method: string;
  baseline: {
    averageResponseTime: number;
    p95ResponseTime: number;
    p99ResponseTime: number;
    throughput: number;
    errorRate: number;
  };
  thresholds: {
    responseTimeIncrease: number; // percentage
    throughputDecrease: number; // percentage
    errorRateIncrease: number; // percentage
  };
  lastUpdated: Date;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ScalabilityTest {
  id: string;
  name: string;
  description: string;
  type: 'horizontal' | 'vertical' | 'auto-scaling';
  target: {
    service: string;
    endpoint: string;
    method: string;
  };
  scaling: {
    startInstances: number;
    maxInstances: number;
    stepSize: number;
    stepInterval: number; // seconds
    loadPerInstance: number; // requests per second
  };
  metrics: {
    responseTime: number[];
    throughput: number[];
    resourceUsage: {
      cpu: number[];
      memory: number[];
      network: number[];
    };
    instanceCount: number[];
  };
  results: {
    optimalInstances: number;
    maxThroughput: number;
    bottlenecks: string[];
    recommendations: string[];
  };
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class LoadTestingManager {
  private static instance: LoadTestingManager;
  private testConfigs: LoadTestConfig[] = [];
  private testExecutions: LoadTestExecution[] = [];
  private performanceBaselines: PerformanceBaseline[] = [];
  private scalabilityTests: ScalabilityTest[] = [];
  private isInitialized = false;
  private runningTests = new Set<string>();

  private constructor() {
    this.initializeDefaultConfigs();
    this.initializeDefaultBaselines();
  }

  public static getInstance(): LoadTestingManager {
    if (!LoadTestingManager.instance) {
      LoadTestingManager.instance = new LoadTestingManager();
    }
    return LoadTestingManager.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await this.loadTestConfigs();
      await this.loadPerformanceBaselines();
      await this.loadScalabilityTests();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize LoadTestingManager:', error);
    }
  }

  // Test Configuration Management
  public async createTestConfig(config: Omit<LoadTestConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<LoadTestConfig> {
    const loadTestConfig: LoadTestConfig = {
      id: this.generateId(),
      ...config,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.testConfigs.push(loadTestConfig);
    await this.storeTestConfig(loadTestConfig);
    return loadTestConfig;
  }

  public async updateTestConfig(id: string, updates: Partial<LoadTestConfig>): Promise<LoadTestConfig | null> {
    const index = this.testConfigs.findIndex(config => config.id === id);
    if (index === -1) return null;

    this.testConfigs[index] = {
      ...this.testConfigs[index],
      ...updates,
      updatedAt: new Date()
    };

    await this.storeTestConfig(this.testConfigs[index]);
    return this.testConfigs[index];
  }

  public async deleteTestConfig(id: string): Promise<boolean> {
    const index = this.testConfigs.findIndex(config => config.id === id);
    if (index === -1) return false;

    this.testConfigs.splice(index, 1);
    await this.deleteStoredTestConfig(id);
    return true;
  }

  public getTestConfigs(): LoadTestConfig[] {
    return [...this.testConfigs];
  }

  public getTestConfig(id: string): LoadTestConfig | null {
    return this.testConfigs.find(config => config.id === id) || null;
  }

  // Test Execution Management
  public async executeLoadTest(configId: string, environment: string = 'staging', version: string = 'latest'): Promise<LoadTestExecution> {
    const config = this.getTestConfig(configId);
    if (!config) {
      throw new Error('Test configuration not found');
    }

    const execution: LoadTestExecution = {
      id: this.generateId(),
      configId,
      status: 'pending',
      startedAt: new Date(),
      results: {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0,
        minResponseTime: 0,
        maxResponseTime: 0,
        p50ResponseTime: 0,
        p90ResponseTime: 0,
        p95ResponseTime: 0,
        p99ResponseTime: 0,
        throughput: 0,
        errorRate: 0,
        systemMetrics: {
          cpuUsage: [],
          memoryUsage: [],
          diskUsage: [],
          networkUsage: []
        },
        errors: []
      },
      metadata: {
        config,
        environment,
        version
      },
      createdAt: new Date()
    };

    this.testExecutions.push(execution);
    await this.storeTestExecution(execution);

    // Start test execution
    this.runLoadTest(execution);
    return execution;
  }

  public async getTestExecutions(): Promise<LoadTestExecution[]> {
    return [...this.testExecutions];
  }

  public async getTestExecution(id: string): Promise<LoadTestExecution | null> {
    return this.testExecutions.find(execution => execution.id === id) || null;
  }

  public async cancelTestExecution(id: string): Promise<boolean> {
    const execution = this.testExecutions.find(e => e.id === id);
    if (!execution || execution.status !== 'running') return false;

    execution.status = 'cancelled';
    execution.completedAt = new Date();
    execution.duration = execution.completedAt.getTime() - execution.startedAt.getTime();

    this.runningTests.delete(id);
    await this.updateTestExecution(execution);
    return true;
  }

  // Performance Baseline Management
  public async createPerformanceBaseline(baseline: Omit<PerformanceBaseline, 'id' | 'createdAt' | 'updatedAt'>): Promise<PerformanceBaseline> {
    const performanceBaseline: PerformanceBaseline = {
      id: this.generateId(),
      ...baseline,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.performanceBaselines.push(performanceBaseline);
    await this.storePerformanceBaseline(performanceBaseline);
    return performanceBaseline;
  }

  public async updatePerformanceBaseline(id: string, updates: Partial<PerformanceBaseline>): Promise<PerformanceBaseline | null> {
    const index = this.performanceBaselines.findIndex(baseline => baseline.id === id);
    if (index === -1) return null;

    this.performanceBaselines[index] = {
      ...this.performanceBaselines[index],
      ...updates,
      updatedAt: new Date()
    };

    await this.storePerformanceBaseline(this.performanceBaselines[index]);
    return this.performanceBaselines[index];
  }

  public getPerformanceBaselines(): PerformanceBaseline[] {
    return [...this.performanceBaselines];
  }

  public getPerformanceBaseline(id: string): PerformanceBaseline | null {
    return this.performanceBaselines.find(baseline => baseline.id === id) || null;
  }

  // Scalability Test Management
  public async createScalabilityTest(test: Omit<ScalabilityTest, 'id' | 'createdAt' | 'updatedAt'>): Promise<ScalabilityTest> {
    const scalabilityTest: ScalabilityTest = {
      id: this.generateId(),
      ...test,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.scalabilityTests.push(scalabilityTest);
    await this.storeScalabilityTest(scalabilityTest);
    return scalabilityTest;
  }

  public async executeScalabilityTest(testId: string): Promise<void> {
    const test = this.scalabilityTests.find(t => t.id === testId);
    if (!test) {
      throw new Error('Scalability test not found');
    }

    try {
      test.status = 'running';
      test.startedAt = new Date();
      await this.updateScalabilityTest(testId, test);

      // Simulate scalability test execution
      await this.simulateScalabilityTest(test);

      test.status = 'completed';
      test.completedAt = new Date();
      await this.updateScalabilityTest(testId, test);

    } catch (error) {
      test.status = 'failed';
      test.completedAt = new Date();
      await this.updateScalabilityTest(testId, test);
      throw error;
    }
  }

  public getScalabilityTests(): ScalabilityTest[] {
    return [...this.scalabilityTests];
  }

  public getScalabilityTest(id: string): ScalabilityTest | null {
    return this.scalabilityTests.find(test => test.id === testId) || null;
  }

  // Load Test Execution
  private async runLoadTest(execution: LoadTestExecution): Promise<void> {
    try {
      this.runningTests.add(execution.id);
      execution.status = 'running';
      await this.updateTestExecution(execution);

      const config = execution.metadata.config;
      const startTime = Date.now();

      // Simulate load test execution
      await this.simulateLoadTest(execution);

      execution.status = 'completed';
      execution.completedAt = new Date();
      execution.duration = Math.floor((execution.completedAt.getTime() - execution.startedAt.getTime()) / 1000);

      await this.updateTestExecution(execution);

      // Compare against performance baselines
      await this.compareAgainstBaselines(execution);

    } catch (error) {
      execution.status = 'failed';
      execution.completedAt = new Date();
      execution.duration = Math.floor((execution.completedAt.getTime() - execution.startedAt.getTime()) / 1000);
      await this.updateTestExecution(execution);
    } finally {
      this.runningTests.delete(execution.id);
    }
  }

  private async simulateLoadTest(execution: LoadTestExecution): Promise<void> {
    const config = execution.metadata.config;
    const totalRequests = config.load.virtualUsers * Math.floor(config.load.duration / config.load.thinkTime);
    
    // Simulate realistic test results
    const responseTimes: number[] = [];
    let successfulRequests = 0;
    let failedRequests = 0;
    const errors: { [key: string]: number } = {};

    for (let i = 0; i < totalRequests; i++) {
      // Simulate response time based on load
      const baseResponseTime = 100 + Math.random() * 200;
      const loadFactor = Math.min(config.load.virtualUsers / 100, 2);
      const responseTime = baseResponseTime * loadFactor;
      
      responseTimes.push(responseTime);

      // Simulate success/failure based on load
      const failureRate = Math.min(config.load.virtualUsers / 1000, 0.1);
      if (Math.random() < failureRate) {
        failedRequests++;
        const errorType = ['timeout', 'connection_error', 'server_error'][Math.floor(Math.random() * 3)];
        errors[errorType] = (errors[errorType] || 0) + 1;
      } else {
        successfulRequests++;
      }

      // Simulate system metrics
      if (i % 100 === 0) {
        execution.results.systemMetrics.cpuUsage.push(30 + Math.random() * 40);
        execution.results.systemMetrics.memoryUsage.push(40 + Math.random() * 30);
        execution.results.systemMetrics.diskUsage.push(20 + Math.random() * 20);
        execution.results.systemMetrics.networkUsage.push(10 + Math.random() * 30);
      }
    }

    // Calculate statistics
    responseTimes.sort((a, b) => a - b);
    const totalRequests = successfulRequests + failedRequests;

    execution.results.totalRequests = totalRequests;
    execution.results.successfulRequests = successfulRequests;
    execution.results.failedRequests = failedRequests;
    execution.results.averageResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
    execution.results.minResponseTime = responseTimes[0];
    execution.results.maxResponseTime = responseTimes[responseTimes.length - 1];
    execution.results.p50ResponseTime = responseTimes[Math.floor(responseTimes.length * 0.5)];
    execution.results.p90ResponseTime = responseTimes[Math.floor(responseTimes.length * 0.9)];
    execution.results.p95ResponseTime = responseTimes[Math.floor(responseTimes.length * 0.95)];
    execution.results.p99ResponseTime = responseTimes[Math.floor(responseTimes.length * 0.99)];
    execution.results.throughput = totalRequests / config.load.duration;
    execution.results.errorRate = (failedRequests / totalRequests) * 100;

    // Convert errors to array format
    execution.results.errors = Object.entries(errors).map(([type, count]) => ({
      type,
      message: this.getErrorMessage(type),
      count,
      percentage: (count / totalRequests) * 100
    }));
  }

  private async simulateScalabilityTest(test: ScalabilityTest): Promise<void> {
    const { startInstances, maxInstances, stepSize, stepInterval, loadPerInstance } = test.scaling;
    
    test.metrics.responseTime = [];
    test.metrics.throughput = [];
    test.metrics.resourceUsage.cpu = [];
    test.metrics.resourceUsage.memory = [];
    test.metrics.resourceUsage.network = [];
    test.metrics.instanceCount = [];

    let currentInstances = startInstances;
    const bottlenecks: string[] = [];
    const recommendations: string[] = [];

    while (currentInstances <= maxInstances) {
      // Simulate metrics for current instance count
      const baseResponseTime = 100;
      const responseTime = baseResponseTime + (currentInstances * 5); // Degradation with scale
      const throughput = currentInstances * loadPerInstance;
      const cpuUsage = Math.min(30 + (currentInstances * 2), 90);
      const memoryUsage = Math.min(40 + (currentInstances * 1.5), 85);
      const networkUsage = Math.min(20 + (currentInstances * 3), 80);

      test.metrics.responseTime.push(responseTime);
      test.metrics.throughput.push(throughput);
      test.metrics.resourceUsage.cpu.push(cpuUsage);
      test.metrics.resourceUsage.memory.push(memoryUsage);
      test.metrics.resourceUsage.network.push(networkUsage);
      test.metrics.instanceCount.push(currentInstances);

      // Identify bottlenecks
      if (cpuUsage > 80) {
        bottlenecks.push('CPU utilization high');
        recommendations.push('Consider CPU optimization or horizontal scaling');
      }
      if (memoryUsage > 80) {
        bottlenecks.push('Memory usage high');
        recommendations.push('Optimize memory usage or increase instance memory');
      }
      if (networkUsage > 80) {
        bottlenecks.push('Network bandwidth saturated');
        recommendations.push('Optimize network usage or increase bandwidth');
      }

      currentInstances += stepSize;
    }

    // Calculate results
    const maxThroughput = Math.max(...test.metrics.throughput);
    const optimalInstances = test.metrics.instanceCount[test.metrics.throughput.indexOf(maxThroughput)];

    test.results = {
      optimalInstances,
      maxThroughput,
      bottlenecks: [...new Set(bottlenecks)],
      recommendations: [...new Set(recommendations)]
    };
  }

  private async compareAgainstBaselines(execution: LoadTestExecution): Promise<void> {
    const config = execution.metadata.config;
    const baselines = this.performanceBaselines.filter(baseline => 
      baseline.endpoint === config.target.url && 
      baseline.method === config.target.method
    );

    for (const baseline of baselines) {
      const responseTimeIncrease = ((execution.results.averageResponseTime - baseline.baseline.averageResponseTime) / baseline.baseline.averageResponseTime) * 100;
      const throughputDecrease = ((baseline.baseline.throughput - execution.results.throughput) / baseline.baseline.throughput) * 100;
      const errorRateIncrease = execution.results.errorRate - baseline.baseline.errorRate;

      if (responseTimeIncrease > baseline.thresholds.responseTimeIncrease) {
        console.warn(`Response time increased by ${responseTimeIncrease.toFixed(2)}% (threshold: ${baseline.thresholds.responseTimeIncrease}%)`);
      }

      if (throughputDecrease > baseline.thresholds.throughputDecrease) {
        console.warn(`Throughput decreased by ${throughputDecrease.toFixed(2)}% (threshold: ${baseline.thresholds.throughputDecrease}%)`);
      }

      if (errorRateIncrease > baseline.thresholds.errorRateIncrease) {
        console.warn(`Error rate increased by ${errorRateIncrease.toFixed(2)}% (threshold: ${baseline.thresholds.errorRateIncrease}%)`);
      }
    }
  }

  private getErrorMessage(errorType: string): string {
    const errorMessages: { [key: string]: string } = {
      timeout: 'Request timeout - server did not respond within the specified time',
      connection_error: 'Connection error - unable to establish connection to server',
      server_error: 'Server error - internal server error (5xx)',
      client_error: 'Client error - bad request (4xx)',
      network_error: 'Network error - network connectivity issue'
    };
    return errorMessages[errorType] || 'Unknown error occurred';
  }

  // Database Operations
  private async loadTestConfigs(): Promise<void> {
    try {
      const { data, error } = await supabase.from('load_test_configs').select('*');
      if (error) throw error;
      this.testConfigs = data || [];
    } catch (error) {
      console.error('Failed to load test configs:', error);
    }
  }

  private async loadPerformanceBaselines(): Promise<void> {
    try {
      const { data, error } = await supabase.from('performance_baselines').select('*');
      if (error) throw error;
      this.performanceBaselines = data || [];
    } catch (error) {
      console.error('Failed to load performance baselines:', error);
    }
  }

  private async loadScalabilityTests(): Promise<void> {
    try {
      const { data, error } = await supabase.from('scalability_tests').select('*');
      if (error) throw error;
      this.scalabilityTests = data || [];
    } catch (error) {
      console.error('Failed to load scalability tests:', error);
    }
  }

  private async storeTestConfig(config: LoadTestConfig): Promise<void> {
    try {
      await supabase.from('load_test_configs').upsert({
        id: config.id,
        name: config.name,
        description: config.description,
        type: config.type,
        target: config.target,
        load: config.load,
        thresholds: config.thresholds,
        scenarios: config.scenarios,
        monitoring: config.monitoring,
        enabled: config.enabled,
        created_at: config.createdAt.toISOString(),
        updated_at: config.updatedAt.toISOString()
      });
    } catch (error) {
      console.error('Failed to store test config:', error);
    }
  }

  private async storeTestExecution(execution: LoadTestExecution): Promise<void> {
    try {
      await supabase.from('load_test_executions').insert({
        id: execution.id,
        config_id: execution.configId,
        status: execution.status,
        started_at: execution.startedAt.toISOString(),
        completed_at: execution.completedAt?.toISOString(),
        duration: execution.duration,
        results: execution.results,
        metadata: execution.metadata,
        created_at: execution.createdAt.toISOString()
      });
    } catch (error) {
      console.error('Failed to store test execution:', error);
    }
  }

  private async updateTestExecution(execution: LoadTestExecution): Promise<void> {
    try {
      await supabase.from('load_test_executions').update({
        status: execution.status,
        completed_at: execution.completedAt?.toISOString(),
        duration: execution.duration,
        results: execution.results
      }).eq('id', execution.id);
    } catch (error) {
      console.error('Failed to update test execution:', error);
    }
  }

  private async storePerformanceBaseline(baseline: PerformanceBaseline): Promise<void> {
    try {
      await supabase.from('performance_baselines').upsert({
        id: baseline.id,
        name: baseline.name,
        description: baseline.description,
        endpoint: baseline.endpoint,
        method: baseline.method,
        baseline: baseline.baseline,
        thresholds: baseline.thresholds,
        last_updated: baseline.lastUpdated.toISOString(),
        enabled: baseline.enabled,
        created_at: baseline.createdAt.toISOString(),
        updated_at: baseline.updatedAt.toISOString()
      });
    } catch (error) {
      console.error('Failed to store performance baseline:', error);
    }
  }

  private async storeScalabilityTest(test: ScalabilityTest): Promise<void> {
    try {
      await supabase.from('scalability_tests').upsert({
        id: test.id,
        name: test.name,
        description: test.description,
        type: test.type,
        target: test.target,
        scaling: test.scaling,
        metrics: test.metrics,
        results: test.results,
        status: test.status,
        started_at: test.startedAt.toISOString(),
        completed_at: test.completedAt?.toISOString(),
        created_at: test.createdAt.toISOString(),
        updated_at: test.updatedAt.toISOString()
      });
    } catch (error) {
      console.error('Failed to store scalability test:', error);
    }
  }

  private async updateScalabilityTest(id: string, test: ScalabilityTest): Promise<void> {
    try {
      await supabase.from('scalability_tests').update({
        status: test.status,
        started_at: test.startedAt.toISOString(),
        completed_at: test.completedAt?.toISOString(),
        metrics: test.metrics,
        results: test.results
      }).eq('id', id);
    } catch (error) {
      console.error('Failed to update scalability test:', error);
    }
  }

  private async deleteStoredTestConfig(id: string): Promise<void> {
    try {
      await supabase.from('load_test_configs').delete().eq('id', id);
    } catch (error) {
      console.error('Failed to delete test config:', error);
    }
  }

  private generateId(): string {
    return 'load_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // Default Initializations
  private initializeDefaultConfigs(): void {
    this.testConfigs = [
      {
        id: 'api_stress_test',
        name: 'API Stress Test',
        description: 'Stress test for main API endpoints',
        type: 'stress',
        target: {
          url: '/api/test-cases',
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          timeout: 5000
        },
        load: {
          virtualUsers: 100,
          rampUpTime: 60,
          duration: 300,
          rampDownTime: 30,
          thinkTime: 1
        },
        thresholds: {
          responseTime: 2000,
          errorRate: 5,
          throughput: 50,
          cpuUsage: 80,
          memoryUsage: 85
        },
        scenarios: [
          {
            name: 'Browse Test Cases',
            weight: 60,
            steps: [
              { action: 'GET', url: '/api/test-cases', waitTime: 1 },
              { action: 'GET', url: '/api/test-cases/1', waitTime: 2 }
            ]
          },
          {
            name: 'Create Test Case',
            weight: 40,
            steps: [
              { action: 'POST', url: '/api/test-cases', body: { name: 'Test Case' }, waitTime: 3 }
            ]
          }
        ],
        monitoring: {
          enabled: true,
          metrics: ['response_time', 'throughput', 'error_rate'],
          samplingRate: 100
        },
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'spike_test',
        name: 'Spike Test',
        description: 'Test system behavior under sudden load spikes',
        type: 'spike',
        target: {
          url: '/api/simulations',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        },
        load: {
          virtualUsers: 200,
          rampUpTime: 10,
          duration: 120,
          rampDownTime: 10,
          thinkTime: 0.5
        },
        thresholds: {
          responseTime: 5000,
          errorRate: 10,
          throughput: 100,
          cpuUsage: 90,
          memoryUsage: 90
        },
        scenarios: [
          {
            name: 'Run Simulation',
            weight: 100,
            steps: [
              { action: 'POST', url: '/api/simulations', body: { testCaseId: 1 }, waitTime: 2 }
            ]
          }
        ],
        monitoring: {
          enabled: true,
          metrics: ['response_time', 'throughput', 'error_rate', 'cpu_usage'],
          samplingRate: 100
        },
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  private initializeDefaultBaselines(): void {
    this.performanceBaselines = [
      {
        id: 'api_baseline',
        name: 'API Performance Baseline',
        description: 'Baseline performance metrics for API endpoints',
        endpoint: '/api/test-cases',
        method: 'GET',
        baseline: {
          averageResponseTime: 150,
          p95ResponseTime: 300,
          p99ResponseTime: 500,
          throughput: 100,
          errorRate: 0.1
        },
        thresholds: {
          responseTimeIncrease: 50,
          throughputDecrease: 20,
          errorRateIncrease: 2
        },
        lastUpdated: new Date(),
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }
}
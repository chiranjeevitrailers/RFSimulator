// Test Execution Engine - Orchestrates test execution between Supabase, Backend, and Frontend
// Provides real-time test execution with comprehensive monitoring and logging

class TestExecutionEngine {
  constructor() {
    this.supabaseIntegration = window.SupabaseTestingIntegration;
    this.backendIntegration = window.BackendIntegration;
    this.activeExecutions = new Map();
    this.executionCallbacks = new Map();
    this.isInitialized = false;
    
    this.initialize();
  }

  // Initialize the execution engine
  async initialize() {
    try {
      // Setup message handlers for real-time updates
      this.setupMessageHandlers();
      
      // Setup Supabase real-time subscriptions
      if (this.supabaseIntegration) {
        this.supabaseIntegration.onTestExecutionUpdate((update) => {
          this.handleSupabaseUpdate(update);
        });
      }
      
      this.isInitialized = true;
      console.log('✅ Test Execution Engine initialized');
      
    } catch (error) {
      console.error('❌ Test Execution Engine initialization failed:', error);
    }
  }

  // Setup message handlers for backend communication
  setupMessageHandlers() {
    if (!this.backendIntegration) return;

    // Handle execution status updates
    this.backendIntegration.onMessage('execution_status', (data, executionId) => {
      this.handleExecutionStatusUpdate(executionId, data);
    });

    // Handle execution logs
    this.backendIntegration.onMessage('execution_log', (data, executionId) => {
      this.handleExecutionLogUpdate(executionId, data);
    });

    // Handle protocol layer updates
    this.backendIntegration.onMessage('protocol_layer_update', (data, executionId) => {
      this.handleProtocolLayerUpdate(executionId, data);
    });

    // Handle test completion
    this.backendIntegration.onMessage('execution_complete', (data, executionId) => {
      this.handleExecutionComplete(executionId, data);
    });

    // Handle test failure
    this.backendIntegration.onMessage('execution_failed', (data, executionId) => {
      this.handleExecutionFailed(executionId, data);
    });
  }

  // Execute test case with full integration
  async executeTestCase(testCaseId, executionConfig = {}) {
    if (!this.isInitialized) {
      throw new Error('Test Execution Engine not initialized');
    }

    try {
      console.log(`🚀 Starting test execution: ${testCaseId}`);

      // 1. Fetch test case data from Supabase
      const testCase = await this.fetchTestCaseData(testCaseId);
      if (!testCase) {
        throw new Error(`Test case not found: ${testCaseId}`);
      }

      // 2. Create execution record in Supabase
      const execution = await this.createExecutionRecord(testCase, executionConfig);

      // 3. Start backend execution
      const backendExecution = await this.startBackendExecution(testCase, execution.id, executionConfig);

      // 4. Track active execution
      this.activeExecutions.set(execution.id, {
        testCaseId,
        testCase,
        execution,
        backendExecution,
        status: 'running',
        startTime: new Date(),
        config: executionConfig,
        logs: [],
        protocolLayers: {},
        results: null
      });

      // 5. Notify callbacks
      this.notifyExecutionCallbacks(execution.id, 'started', {
        testCase,
        execution,
        backendExecution
      });

      console.log(`✅ Test execution started: ${execution.id}`);
      return execution;

    } catch (error) {
      console.error('❌ Test execution failed:', error);
      throw error;
    }
  }

  // Fetch test case data from Supabase
  async fetchTestCaseData(testCaseId) {
    try {
      if (this.supabaseIntegration && this.supabaseIntegration.isConnected) {
        return await this.supabaseIntegration.getTestCaseById(testCaseId);
      } else {
        // Fallback to config
        return window.TestingPlatformConfig?.getTestCaseById(testCaseId);
      }
    } catch (error) {
      console.error('Error fetching test case data:', error);
      return null;
    }
  }

  // Create execution record in Supabase
  async createExecutionRecord(testCase, config) {
    try {
      if (this.supabaseIntegration && this.supabaseIntegration.isConnected) {
        // Create execution record in Supabase
        const executionData = {
          test_case_id: testCase.id,
          status: 'running',
          started_at: new Date().toISOString(),
          execution_config: config
        };

        // This would be handled by Supabase integration
        return {
          id: 'exec-' + Date.now(),
          ...executionData
        };
      } else {
        // Fallback execution record
        return {
          id: 'exec-' + Date.now(),
          test_case_id: testCase.id,
          status: 'running',
          started_at: new Date().toISOString(),
          execution_config: config
        };
      }
    } catch (error) {
      console.error('Error creating execution record:', error);
      throw error;
    }
  }

  // Start backend execution
  async startBackendExecution(testCase, executionId, config) {
    try {
      if (this.backendIntegration && this.backendIntegration.isConnected) {
        return await this.backendIntegration.executeTestCase(testCase.id, config);
      } else {
        // Simulate backend execution
        return await this.simulateBackendExecution(testCase, executionId, config);
      }
    } catch (error) {
      console.error('Error starting backend execution:', error);
      throw error;
    }
  }

  // Simulate backend execution for offline mode
  async simulateBackendExecution(testCase, executionId, config) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'backend-' + Date.now(),
          testCaseId: testCase.id,
          status: 'running',
          startTime: new Date().toISOString()
        });
      }, 100);
    });
  }

  // Handle Supabase updates
  handleSupabaseUpdate(update) {
    const { type, event, data, timestamp } = update;
    
    if (type === 'execution_log') {
      // Find execution by test case ID
      const execution = Array.from(this.activeExecutions.values())
        .find(exec => exec.testCaseId === data.test_case_id);
      
      if (execution) {
        this.handleExecutionLogUpdate(execution.id, data);
      }
    }
  }

  // Handle execution status updates
  handleExecutionStatusUpdate(executionId, data) {
    const execution = this.activeExecutions.get(executionId);
    if (!execution) return;

    execution.status = data.status;
    execution.lastUpdate = new Date();

    this.notifyExecutionCallbacks(executionId, 'status_update', data);
  }

  // Handle execution log updates
  handleExecutionLogUpdate(executionId, data) {
    const execution = this.activeExecutions.get(executionId);
    if (!execution) return;

    execution.logs.push({
      timestamp: new Date(),
      level: data.level,
      message: data.message,
      data: data.data
    });

    // Keep only last 1000 logs
    if (execution.logs.length > 1000) {
      execution.logs = execution.logs.slice(-1000);
    }

    this.notifyExecutionCallbacks(executionId, 'log_update', data);
  }

  // Handle protocol layer updates
  handleProtocolLayerUpdate(executionId, data) {
    const execution = this.activeExecutions.get(executionId);
    if (!execution) return;

    const { layer, message, parameters } = data;
    
    if (!execution.protocolLayers[layer]) {
      execution.protocolLayers[layer] = {
        messages: [],
        parameters: {},
        status: 'active'
      };
    }

    execution.protocolLayers[layer].messages.push({
      timestamp: new Date(),
      message,
      parameters
    });

    // Keep only last 100 messages per layer
    if (execution.protocolLayers[layer].messages.length > 100) {
      execution.protocolLayers[layer].messages = execution.protocolLayers[layer].messages.slice(-100);
    }

    this.notifyExecutionCallbacks(executionId, 'protocol_update', data);
  }

  // Handle execution completion
  handleExecutionComplete(executionId, data) {
    const execution = this.activeExecutions.get(executionId);
    if (!execution) return;

    execution.status = 'completed';
    execution.endTime = new Date();
    execution.results = data.results;
    execution.duration = execution.endTime - execution.startTime;

    this.notifyExecutionCallbacks(executionId, 'completed', data);
    
    // Clean up after 5 minutes
    setTimeout(() => {
      this.activeExecutions.delete(executionId);
    }, 300000);
  }

  // Handle execution failure
  handleExecutionFailed(executionId, data) {
    const execution = this.activeExecutions.get(executionId);
    if (!execution) return;

    execution.status = 'failed';
    execution.endTime = new Date();
    execution.error = data.error;
    execution.duration = execution.endTime - execution.startTime;

    this.notifyExecutionCallbacks(executionId, 'failed', data);
    
    // Clean up after 5 minutes
    setTimeout(() => {
      this.activeExecutions.delete(executionId);
    }, 300000);
  }

  // Stop test execution
  async stopTestExecution(executionId) {
    try {
      const execution = this.activeExecutions.get(executionId);
      if (!execution) {
        throw new Error(`Execution not found: ${executionId}`);
      }

      // Stop backend execution
      if (this.backendIntegration && this.backendIntegration.isConnected) {
        await this.backendIntegration.stopTestExecution(execution.backendExecution.id);
      }

      // Update execution status
      execution.status = 'stopped';
      execution.endTime = new Date();
      execution.duration = execution.endTime - execution.startTime;

      this.notifyExecutionCallbacks(executionId, 'stopped', {
        reason: 'user_requested',
        duration: execution.duration
      });

      console.log(`🛑 Test execution stopped: ${executionId}`);

    } catch (error) {
      console.error('❌ Error stopping test execution:', error);
      throw error;
    }
  }

  // Get execution status
  getExecutionStatus(executionId) {
    const execution = this.activeExecutions.get(executionId);
    if (!execution) return null;

    return {
      id: executionId,
      testCaseId: execution.testCaseId,
      status: execution.status,
      startTime: execution.startTime,
      endTime: execution.endTime,
      duration: execution.duration,
      logs: execution.logs,
      protocolLayers: execution.protocolLayers,
      results: execution.results,
      error: execution.error
    };
  }

  // Get all active executions
  getAllActiveExecutions() {
    return Array.from(this.activeExecutions.entries()).map(([id, execution]) => ({
      id,
      testCaseId: execution.testCaseId,
      testCase: execution.testCase,
      status: execution.status,
      startTime: execution.startTime,
      duration: execution.endTime ? execution.endTime - execution.startTime : Date.now() - execution.startTime
    }));
  }

  // Subscribe to execution updates
  onExecutionUpdate(executionId, callback) {
    if (!this.executionCallbacks.has(executionId)) {
      this.executionCallbacks.set(executionId, []);
    }
    this.executionCallbacks.get(executionId).push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.executionCallbacks.get(executionId);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  // Notify execution callbacks
  notifyExecutionCallbacks(executionId, event, data) {
    const callbacks = this.executionCallbacks.get(executionId);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(event, data, executionId);
        } catch (error) {
          console.error('Error in execution callback:', error);
        }
      });
    }
  }

  // Execute batch of test cases
  async executeBatch(testCaseIds, config = {}) {
    const results = [];
    
    for (const testCaseId of testCaseIds) {
      try {
        const execution = await this.executeTestCase(testCaseId, config);
        results.push({ testCaseId, execution, status: 'started' });
        
        // Wait between executions if specified
        if (config.delayBetweenTests) {
          await new Promise(resolve => setTimeout(resolve, config.delayBetweenTests));
        }
        
      } catch (error) {
        results.push({ testCaseId, error: error.message, status: 'failed' });
      }
    }
    
    return results;
  }

  // Get execution statistics
  getExecutionStatistics() {
    const executions = Array.from(this.activeExecutions.values());
    
    return {
      total: executions.length,
      running: executions.filter(e => e.status === 'running').length,
      completed: executions.filter(e => e.status === 'completed').length,
      failed: executions.filter(e => e.status === 'failed').length,
      stopped: executions.filter(e => e.status === 'stopped').length,
      averageDuration: executions
        .filter(e => e.duration)
        .reduce((sum, e) => sum + e.duration, 0) / executions.filter(e => e.duration).length || 0
    };
  }

  // Cleanup
  destroy() {
    this.activeExecutions.clear();
    this.executionCallbacks.clear();
  }
}

// Initialize global test execution engine
window.TestExecutionEngine = new TestExecutionEngine();

console.log('🚀 Test Execution Engine initialized');
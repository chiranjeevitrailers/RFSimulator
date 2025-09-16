// Backend Integration for 5GLabX Testing Platform
// Handles communication between frontend and 5GLabX backend for test execution

class BackendIntegration {
  constructor() {
    this.backendUrl = 'http://localhost:3001'; // 5GLabX backend URL
    this.isConnected = false;
    this.websocket = null;
    this.messageHandlers = new Map();
    this.testExecutionQueue = [];
    this.activeExecutions = new Map();
    
    this.initializeBackend();
  }

  // Initialize backend connection
  async initializeBackend() {
    try {
      // Test backend connectivity
      await this.testBackendConnection();
      
      // Initialize WebSocket connection for real-time updates
      this.initializeWebSocket();
      
      this.isConnected = true;
      console.log('✅ 5GLabX Backend connected successfully');
      
    } catch (error) {
      console.error('❌ Backend connection failed:', error);
      this.isConnected = false;
    }
  }

  // Test backend connection
  async testBackendConnection() {
    try {
      const response = await fetch(`${this.backendUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Backend health check failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('Backend health status:', data);
      
    } catch (error) {
      throw new Error(`Backend connection test failed: ${error.message}`);
    }
  }

  // Initialize WebSocket for real-time communication
  initializeWebSocket() {
    try {
      const wsUrl = this.backendUrl.replace('http', 'ws') + '/ws';
      this.websocket = new WebSocket(wsUrl);

      this.websocket.onopen = () => {
        console.log('🔗 WebSocket connection established');
        this.isConnected = true;
      };

      this.websocket.onmessage = (event) => {
        this.handleWebSocketMessage(event);
      };

      this.websocket.onclose = () => {
        console.log('🔌 WebSocket connection closed');
        this.isConnected = false;
        // Attempt to reconnect after 5 seconds
        setTimeout(() => this.initializeWebSocket(), 5000);
      };

      this.websocket.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        this.isConnected = false;
      };

    } catch (error) {
      console.error('❌ WebSocket initialization failed:', error);
    }
  }

  // Handle WebSocket messages
  handleWebSocketMessage(event) {
    try {
      const message = JSON.parse(event.data);
      const { type, data, executionId } = message;

      // Route message to appropriate handler
      if (this.messageHandlers.has(type)) {
        this.messageHandlers.get(type)(data, executionId);
      } else {
        console.log('Unhandled message type:', type, data);
      }

    } catch (error) {
      console.error('❌ Error parsing WebSocket message:', error);
    }
  }

  // Register message handler
  onMessage(type, handler) {
    this.messageHandlers.set(type, handler);
  }

  // Remove message handler
  offMessage(type) {
    this.messageHandlers.delete(type);
  }

  // Send message via WebSocket
  sendMessage(type, data) {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify({ type, data }));
    } else {
      console.warn('⚠️ WebSocket not connected, message not sent:', type, data);
    }
  }

  // Execute test case via backend
  async executeTestCase(testCaseId, executionConfig = {}) {
    if (!this.isConnected) {
      throw new Error('Backend not connected');
    }

    try {
      // Create execution request
      const executionRequest = {
        testCaseId,
        config: {
          timeout: executionConfig.timeout || 300000,
          retryAttempts: executionConfig.retryAttempts || 3,
          logLevel: executionConfig.logLevel || 'INFO',
          realTimeUpdates: true,
          ...executionConfig
        }
      };

      // Send execution request to backend
      const response = await fetch(`${this.backendUrl}/api/test-execution/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(executionRequest)
      });

      if (!response.ok) {
        throw new Error(`Test execution failed: ${response.status}`);
      }

      const execution = await response.json();
      
      // Track active execution
      this.activeExecutions.set(execution.id, {
        testCaseId,
        status: 'running',
        startTime: new Date(),
        config: executionConfig
      });

      console.log('🚀 Test execution started:', execution.id);
      return execution;

    } catch (error) {
      console.error('❌ Test execution error:', error);
      throw error;
    }
  }

  // Stop test execution
  async stopTestExecution(executionId) {
    if (!this.isConnected) {
      throw new Error('Backend not connected');
    }

    try {
      const response = await fetch(`${this.backendUrl}/api/test-execution/${executionId}/stop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Stop execution failed: ${response.status}`);
      }

      const result = await response.json();
      
      // Update active execution
      if (this.activeExecutions.has(executionId)) {
        const execution = this.activeExecutions.get(executionId);
        execution.status = 'stopped';
        execution.endTime = new Date();
      }

      console.log('🛑 Test execution stopped:', executionId);
      return result;

    } catch (error) {
      console.error('❌ Stop execution error:', error);
      throw error;
    }
  }

  // Get execution status
  async getExecutionStatus(executionId) {
    if (!this.isConnected) {
      throw new Error('Backend not connected');
    }

    try {
      const response = await fetch(`${this.backendUrl}/api/test-execution/${executionId}/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Status check failed: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('❌ Status check error:', error);
      throw error;
    }
  }

  // Get execution logs
  async getExecutionLogs(executionId, limit = 100) {
    if (!this.isConnected) {
      throw new Error('Backend not connected');
    }

    try {
      const response = await fetch(`${this.backendUrl}/api/test-execution/${executionId}/logs?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Log retrieval failed: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('❌ Log retrieval error:', error);
      throw error;
    }
  }

  // Get test case data from backend
  async getTestCaseData(testCaseId) {
    if (!this.isConnected) {
      throw new Error('Backend not connected');
    }

    try {
      const response = await fetch(`${this.backendUrl}/api/test-cases/${testCaseId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Test case retrieval failed: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('❌ Test case retrieval error:', error);
      throw error;
    }
  }

  // Get all test cases from backend
  async getAllTestCases() {
    if (!this.isConnected) {
      throw new Error('Backend not connected');
    }

    try {
      const response = await fetch(`${this.backendUrl}/api/test-cases`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Test cases retrieval failed: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('❌ Test cases retrieval error:', error);
      throw error;
    }
  }

  // Get protocol layer data
  async getProtocolLayerData(executionId, layer) {
    if (!this.isConnected) {
      throw new Error('Backend not connected');
    }

    try {
      const response = await fetch(`${this.backendUrl}/api/test-execution/${executionId}/protocol-layers/${layer}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Protocol layer data retrieval failed: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('❌ Protocol layer data retrieval error:', error);
      throw error;
    }
  }

  // Get RAN component status
  async getRanComponentStatus() {
    if (!this.isConnected) {
      throw new Error('Backend not connected');
    }

    try {
      const response = await fetch(`${this.backendUrl}/api/ran-components/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`RAN component status retrieval failed: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('❌ RAN component status retrieval error:', error);
      throw error;
    }
  }

  // Upload test case to backend
  async uploadTestCase(testCaseData) {
    if (!this.isConnected) {
      throw new Error('Backend not connected');
    }

    try {
      const response = await fetch(`${this.backendUrl}/api/test-cases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testCaseData)
      });

      if (!response.ok) {
        throw new Error(`Test case upload failed: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('❌ Test case upload error:', error);
      throw error;
    }
  }

  // Download test results
  async downloadTestResults(executionId, format = 'json') {
    if (!this.isConnected) {
      throw new Error('Backend not connected');
    }

    try {
      const response = await fetch(`${this.backendUrl}/api/test-execution/${executionId}/results?format=${format}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Results download failed: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('❌ Results download error:', error);
      throw error;
    }
  }

  // Get system metrics
  async getSystemMetrics() {
    if (!this.isConnected) {
      throw new Error('Backend not connected');
    }

    try {
      const response = await fetch(`${this.backendUrl}/api/system/metrics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`System metrics retrieval failed: ${response.status}`);
      }

      return await response.json();

    } catch (error) {
      console.error('❌ System metrics retrieval error:', error);
      throw error;
    }
  }

  // Cleanup
  destroy() {
    if (this.websocket) {
      this.websocket.close();
    }
    this.messageHandlers.clear();
    this.activeExecutions.clear();
  }
}

// Initialize global backend integration
window.BackendIntegration = new BackendIntegration();

console.log('🔗 5GLabX Backend Integration initialized');
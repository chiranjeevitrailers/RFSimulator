// OranCliIntegration - Integrate O-RAN CLI with backend
class OranCliIntegration {
  constructor() {
    try {
      this.isConnected = false;
      this.logStreams = new Map();
      this.callbacks = [];
      this.reconnectInterval = null;
    } catch (error) {
      console.error('OranCliIntegration constructor error:', error);
      reportError(error);
    }
  }

  async connect() {
    try {
      const response = await fetch('http://localhost:5000/api/oran/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        this.isConnected = true;
        this.startLogStreaming();
        this.notifyCallbacks('connected');
        return true;
      }
      return false;
    } catch (error) {
      console.error('OranCliIntegration connect error:', error);
      return false;
    }
  }

  async startComponent(componentType, config) {
    try {
      if (!this.isConnected) {
        throw new Error('Not connected to CLI backend');
      }

      const response = await fetch('http://localhost:5000/api/oran/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ componentType, config })
      });

      const result = await response.json();
      if (result.success) {
        this.notifyCallbacks('component_started', { componentType, pid: result.pid });
      }
      return result;
    } catch (error) {
      console.error('OranCliIntegration start component error:', error);
      throw error;
    }
  }

  async stopComponent(componentType) {
    try {
      const response = await fetch('http://localhost:5000/api/oran/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ componentType })
      });

      const result = await response.json();
      if (result.success) {
        this.notifyCallbacks('component_stopped', { componentType });
      }
      return result;
    } catch (error) {
      console.error('OranCliIntegration stop component error:', error);
      throw error;
    }
  }

  startLogStreaming() {
    try {
      // Simulate log streaming
      const streamLogs = () => {
        const mockLog = {
          timestamp: new Date().toISOString(),
          component: 'oran',
          level: 'INFO',
          message: 'F1AP message processed successfully',
          messageType: 'F1SetupRequest'
        };
        this.notifyCallbacks('log_received', mockLog);
      };

      setInterval(streamLogs, 3000);
    } catch (error) {
      console.error('OranCliIntegration start log streaming error:', error);
    }
  }

  subscribe(callback) {
    try {
      this.callbacks.push(callback);
      return () => {
        const index = this.callbacks.indexOf(callback);
        if (index > -1) this.callbacks.splice(index, 1);
      };
    } catch (error) {
      return () => {};
    }
  }

  notifyCallbacks(event, data) {
    try {
      this.callbacks.forEach(callback => {
        try {
          callback(event, data);
        } catch (error) {
          console.error('OranCliIntegration callback error:', error);
        }
      });
    } catch (error) {
      console.error('OranCliIntegration notify error:', error);
    }
  }
}

window.OranCliIntegration = OranCliIntegration;

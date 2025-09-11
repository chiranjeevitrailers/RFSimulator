// ConfigAPI Service - Enhanced backend configuration management with real CLI execution
class ConfigAPI {
  constructor() {
    this.baseURL = 'http://localhost:5000/api';
  }

  // Start a component with configuration - writes config file and starts CLI
  async startComponent(component, config, configName) {
    try {
      const response = await fetch(`${this.baseURL}/start-component`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          component, 
          config,
          configName: configName || `${component}_config`,
          writeConfigFile: true,
          startCLI: true
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to start ${component}: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Start component API error:', error);
      throw error;
    }
  }

  // Stop a component - kills the CLI process
  async stopComponent(component) {
    try {
      const response = await fetch(`${this.baseURL}/stop-component`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ component, killProcess: true })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to stop ${component}: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Stop component API error:', error);
      throw error;
    }
  }

  // Get real-time component status
  async getComponentStatus(component) {
    try {
      const response = await fetch(`${this.baseURL}/component-status/${component}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get component status API error:', error);
      throw error;
    }
  }

  // Check environment and CLI availability
  async checkEnvironment() {
    try {
      const response = await fetch(`${this.baseURL}/environment-check`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Environment check API error:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // Get real-time logs
  async getLogs(component, limit = 100) {
    try {
      const response = await fetch(`${this.baseURL}/logs/${component}?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Get logs API error:', error);
      throw error;
    }
  }
}

// Export ConfigAPI
window.ConfigAPI = new ConfigAPI();

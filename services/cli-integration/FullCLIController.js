// Full CLI Controller - Complete CLI integration management
class FullCLIController {
  constructor() {
    this.dataAdapter = null;
    this.safetyManager = null;
    this.dashboard = null;
    this.isInitialized = false;
  }

  async initialize() {
    try {
      // Initialize core components
      this.dataAdapter = new DataAdapter();
      this.safetyManager = new ProductionSafetyManager();
      this.dashboard = new ProductionDashboard();

      // Initialize components
      await this.dataAdapter.initialize();
      await this.safetyManager.initialize();
      await this.dashboard.initialize();

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('FullCLIController initialization error:', error);
      return false;
    }
  }

  async startSystem(config = {}) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const sources = config.sources || ['srsran', 'open5gs', 'kamailio'];
      await this.dataAdapter.start(sources);
      
      return {
        success: true,
        message: 'CLI system started successfully',
        activeSources: sources
      };
    } catch (error) {
      console.error('FullCLIController startSystem error:', error);
      return {
        success: false,
        message: 'Failed to start CLI system',
        error: error.message
      };
    }
  }

  stopSystem() {
    try {
      if (this.dataAdapter) {
        this.dataAdapter.stop();
      }
      if (this.dashboard) {
        this.dashboard.stopMonitoring();
      }
      
      return { success: true, message: 'CLI system stopped' };
    } catch (error) {
      console.error('FullCLIController stopSystem error:', error);
      return { success: false, error: error.message };
    }
  }

  getSystemStatus() {
    return {
      initialized: this.isInitialized,
      dataAdapter: this.dataAdapter ? this.dataAdapter.getStatus() : null,
      dashboard: this.dashboard ? this.dashboard.getDashboardSummary() : null,
      safety: this.safetyManager ? this.safetyManager.getStatus() : null
    };
  }

  subscribe(callback) {
    return this.dataAdapter ? this.dataAdapter.subscribe(callback) : () => {};
  }
}

if (typeof window !== 'undefined') {
  window.FullCLIController = FullCLIController;
}
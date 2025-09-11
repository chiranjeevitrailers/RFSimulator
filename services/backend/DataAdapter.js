// Data Adapter - Enhanced CLI integration bridge
class DataAdapter {
  constructor() {
    this.subscribers = [];
    this.isActive = false;
    this.dataSourceManager = null;
    this.safetyManager = null;
    this.performanceOptimizer = null;
  }

  async initialize() {
    try {
      this.dataSourceManager = new DataSourceManager();
      this.safetyManager = new ProductionSafetyManager();
      this.performanceOptimizer = new CLIPerformanceOptimizer();

      await this.dataSourceManager.initialize();
      await this.safetyManager.initialize();
      return true;
    } catch (error) {
      console.error('DataAdapter initialization error:', error);
      return false;
    }
  }

  async start(sources = ['srsran', 'open5gs', 'kamailio']) {
    try {
      if (!this.dataSourceManager) {
        await this.initialize();
      }

      this.isActive = true;
      
      for (const source of sources) {
        await this.dataSourceManager.connectSource(source);
      }
      
      this.dataSourceManager.subscribe((logEntry) => {
        this.processData(logEntry);
      });
      
      console.log('DataAdapter started for sources:', sources);
    } catch (error) {
      console.error('DataAdapter start error:', error);
      throw error;
    }
  }

  processData(logEntry) {
    try {
      const optimized = this.performanceOptimizer ? 
        this.performanceOptimizer.optimizeLogProcessing([logEntry])[0] : 
        logEntry;
      this.notifySubscribers(optimized);
    } catch (error) {
      console.error('DataAdapter processData error:', error);
    }
  }

  notifySubscribers(data) {
    this.subscribers.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('DataAdapter subscriber error:', error);
      }
    });
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) this.subscribers.splice(index, 1);
    };
  }

  stop() {
    this.isActive = false;
    if (this.dataSourceManager) {
      const activeSources = this.dataSourceManager.getActiveSources();
      activeSources.forEach(source => {
        this.dataSourceManager.disconnectSource(source);
      });
    }
  }

  getStatus() {
    return {
      isActive: this.isActive,
      activeSources: this.dataSourceManager ? 
        this.dataSourceManager.getActiveSources() : [],
      statistics: this.dataSourceManager ? 
        this.dataSourceManager.getOverallStatistics() : {},
      performance: this.performanceOptimizer ? 
        this.performanceOptimizer.getCacheStats() : {}
    };
  }
}

window.DataAdapter = DataAdapter;

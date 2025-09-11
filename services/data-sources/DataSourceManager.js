// Data Source Manager - Central management for all data sources
class DataSourceManager {
  constructor() {
    this.sources = new Map();
    this.activeConnections = new Set();
    this.dataMerger = null;
    this.isInitialized = false;
  }

  async initialize() {
    try {
      // Initialize CLI data merger
      this.dataMerger = new CLIDataMerger();
      const mergerInit = this.dataMerger.initialize();
      
      if (!mergerInit) {
        throw new Error('Failed to initialize CLI data merger');
      }

      // Register available sources
      this.registerSource('srsran', {
        type: 'cli',
        description: 'srsRAN 5G Stack',
        status: 'available'
      });

      this.registerSource('open5gs', {
        type: 'cli', 
        description: 'Open5GS 5G Core',
        status: 'available'
      });

      this.registerSource('kamailio', {
        type: 'cli',
        description: 'Kamailio SIP Server',
        status: 'available'
      });

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('DataSourceManager initialization error:', error);
      return false;
    }
  }

  registerSource(name, config) {
    try {
      this.sources.set(name, {
        ...config,
        registeredAt: new Date().toISOString(),
        isActive: false
      });
    } catch (error) {
      console.error('DataSourceManager registerSource error:', error);
    }
  }

  async connectSource(sourceName) {
    try {
      const source = this.sources.get(sourceName);
      if (!source) {
        throw new Error(`Source ${sourceName} not found`);
      }

      if (source.type === 'cli' && this.dataMerger) {
        await this.dataMerger.startReading([sourceName]);
        source.isActive = true;
        this.activeConnections.add(sourceName);
        return true;
      }

      return false;
    } catch (error) {
      console.error('DataSourceManager connectSource error:', error);
      return false;
    }
  }

  disconnectSource(sourceName) {
    try {
      const source = this.sources.get(sourceName);
      if (source) {
        source.isActive = false;
        this.activeConnections.delete(sourceName);
      }

      // If no active connections, stop the merger
      if (this.activeConnections.size === 0 && this.dataMerger) {
        this.dataMerger.stopReading();
      }

      return true;
    } catch (error) {
      console.error('DataSourceManager disconnectSource error:', error);
      return false;
    }
  }

  subscribe(callback) {
    try {
      if (this.dataMerger) {
        return this.dataMerger.subscribe(callback);
      }
      return () => {};
    } catch (error) {
      console.error('DataSourceManager subscribe error:', error);
      return () => {};
    }
  }

  getAvailableSources() {
    return Array.from(this.sources.entries()).map(([name, config]) => ({
      name,
      ...config
    }));
  }

  getActiveSources() {
    return Array.from(this.activeConnections);
  }

  getSourceData(sourceName, options = {}) {
    try {
      if (this.dataMerger) {
        const { count = 100, timeRange } = options;
        
        if (timeRange) {
          return this.dataMerger.getLogsByTimeRange(
            timeRange.start, 
            timeRange.end, 
            sourceName
          );
        }
        
        return this.dataMerger.getRecentLogs(count, sourceName);
      }
      return [];
    } catch (error) {
      console.error('DataSourceManager getSourceData error:', error);
      return [];
    }
  }

  getOverallStatistics() {
    try {
      if (this.dataMerger) {
        return this.dataMerger.getStatistics();
      }
      return { totalLogs: 0, sourceBreakdown: {}, levelBreakdown: {} };
    } catch (error) {
      console.error('DataSourceManager getOverallStatistics error:', error);
      return { totalLogs: 0, sourceBreakdown: {}, levelBreakdown: {} };
    }
  }
}

if (typeof window !== 'undefined') {
  window.DataSourceManager = DataSourceManager;
}
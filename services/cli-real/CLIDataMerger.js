// CLI Data Merger - Unifies logs from multiple CLI sources
class CLIDataMerger {
  constructor() {
    this.readers = new Map();
    this.subscribers = new Set();
    this.isActive = false;
    this.logQueue = [];
    this.maxQueueSize = 10000;
  }

  initialize() {
    try {
      // Initialize all CLI readers
      this.readers.set('srsran', new RealSrsranReader());
      this.readers.set('open5gs', new RealOpen5gsReader());
      this.readers.set('kamailio', new RealKamailioReader());
      
      // Subscribe to all readers
      this.readers.forEach((reader, source) => {
        reader.subscribe((logEntry) => {
          this.handleLogEntry({
            ...logEntry,
            source,
            mergedTimestamp: new Date().toISOString()
          });
        });
      });
      
      return true;
    } catch (error) {
      console.error('CLIDataMerger initialization error:', error);
      return false;
    }
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  handleLogEntry(logEntry) {
    try {
      // Add to queue with size management
      this.logQueue.push(logEntry);
      if (this.logQueue.length > this.maxQueueSize) {
        this.logQueue.shift();
      }

      // Notify subscribers
      this.subscribers.forEach(callback => {
        try {
          callback(logEntry);
        } catch (error) {
          console.error('Subscriber notification error:', error);
        }
      });
    } catch (error) {
      console.error('CLIDataMerger handleLogEntry error:', error);
    }
  }

  async startReading(sources = ['srsran', 'open5gs', 'kamailio']) {
    try {
      this.isActive = true;
      
      // Start reading from specified sources
      for (const source of sources) {
        const reader = this.readers.get(source);
        if (reader) {
          await reader.startReading();
        }
      }
      
      return true;
    } catch (error) {
      console.error('CLIDataMerger startReading error:', error);
      return false;
    }
  }

  stopReading() {
    try {
      this.isActive = false;
      
      // Stop all readers
      this.readers.forEach(reader => {
        reader.stopReading();
      });
    } catch (error) {
      console.error('CLIDataMerger stopReading error:', error);
    }
  }

  getRecentLogs(count = 100, source = null) {
    try {
      let logs = [...this.logQueue];
      
      if (source) {
        logs = logs.filter(log => log.source === source);
      }
      
      return logs.slice(-count).reverse();
    } catch (error) {
      console.error('CLIDataMerger getRecentLogs error:', error);
      return [];
    }
  }

  getLogsByTimeRange(startTime, endTime, source = null) {
    try {
      const start = new Date(startTime);
      const end = new Date(endTime);
      
      return this.logQueue.filter(log => {
        const logTime = new Date(log.timestamp);
        const timeMatch = logTime >= start && logTime <= end;
        const sourceMatch = !source || log.source === source;
        return timeMatch && sourceMatch;
      });
    } catch (error) {
      console.error('CLIDataMerger getLogsByTimeRange error:', error);
      return [];
    }
  }

  getStatistics() {
    try {
      const stats = {
        totalLogs: this.logQueue.length,
        sourceBreakdown: {},
        levelBreakdown: {},
        isActive: this.isActive
      };

      this.logQueue.forEach(log => {
        // Source statistics
        stats.sourceBreakdown[log.source] = 
          (stats.sourceBreakdown[log.source] || 0) + 1;
        
        // Level statistics
        const level = log.level || 'unknown';
        stats.levelBreakdown[level] = 
          (stats.levelBreakdown[level] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('CLIDataMerger getStatistics error:', error);
      return { totalLogs: 0, sourceBreakdown: {}, levelBreakdown: {}, isActive: false };
    }
  }
}

if (typeof window !== 'undefined') {
  window.CLIDataMerger = CLIDataMerger;
}
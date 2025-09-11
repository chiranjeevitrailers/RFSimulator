// PhyMetricsProcessor - Process PHY metrics from CLI logs
class PhyMetricsProcessor {
  constructor() {
    try {
      this.metricsHistory = new Map();
      this.subscribers = new Set();
      this.maxHistorySize = 1000;
    } catch (error) {
      console.error('PhyMetricsProcessor constructor error:', error);
      reportError(error);
    }
  }

  // Process PHY metrics from logs
  processLogs(logs) {
    try {
      const phyLogs = logs.filter(log => 
        log.protocol === 'PHY' || 
        log.component === 'PHY' ||
        this.containsPhyMetrics(log.message)
      );

      const metrics = this.extractMetrics(phyLogs);
      this.updateHistory(metrics);
      this.notifySubscribers(metrics);
      
      return metrics;
    } catch (error) {
      console.error('PhyMetricsProcessor process logs error:', error);
      reportError(error);
      return {};
    }
  }

  // Check if message contains PHY metrics
  containsPhyMetrics(message) {
    try {
      const phyKeywords = ['RSRP', 'RSRQ', 'SINR', 'CQI', 'MCS', 'BLER', 'throughput'];
      return phyKeywords.some(keyword => 
        message.toLowerCase().includes(keyword.toLowerCase())
      );
    } catch (error) {
      console.error('PhyMetricsProcessor contains PHY metrics error:', error);
      return false;
    }
  }

  // Extract comprehensive PHY metrics
  extractMetrics(logs) {
    try {
      const metrics = {
        rsrp: [],
        rsrq: [],
        sinr: [],
        cqi: [],
        mcs: [],
        throughput: [],
        bler: [],
        timestamp: new Date().toISOString()
      };

      logs.forEach(log => {
        const msg = log.message;
        
        // Extract all metric types
        this.extractRSRP(msg, metrics.rsrp);
        this.extractRSRQ(msg, metrics.rsrq);
        this.extractSINR(msg, metrics.sinr);
        this.extractCQI(msg, metrics.cqi);
        this.extractMCS(msg, metrics.mcs);
        this.extractThroughput(msg, metrics.throughput);
        this.extractBLER(msg, metrics.bler);
      });

      // Calculate statistics
      return this.calculateStatistics(metrics);
    } catch (error) {
      console.error('PhyMetricsProcessor extract metrics error:', error);
      return {};
    }
  }

  // Extract RSRP values
  extractRSRP(message, values) {
    const match = message.match(/RSRP[=:\s]*(-?\d+(?:\.\d+)?)/i);
    if (match) values.push(parseFloat(match[1]));
  }

  // Extract RSRQ values
  extractRSRQ(message, values) {
    const match = message.match(/RSRQ[=:\s]*(-?\d+(?:\.\d+)?)/i);
    if (match) values.push(parseFloat(match[1]));
  }

  // Extract SINR values
  extractSINR(message, values) {
    const match = message.match(/SINR[=:\s]*(-?\d+(?:\.\d+)?)/i);
    if (match) values.push(parseFloat(match[1]));
  }

  // Extract CQI values
  extractCQI(message, values) {
    const match = message.match(/CQI[=:\s]*(\d+)/i);
    if (match) values.push(parseInt(match[1]));
  }

  // Extract MCS values
  extractMCS(message, values) {
    const match = message.match(/MCS[=:\s]*(\d+)/i);
    if (match) values.push(parseInt(match[1]));
  }

  // Extract throughput values
  extractThroughput(message, values) {
    const match = message.match(/(\d+(?:\.\d+)?)\s*Mbps/i);
    if (match) values.push(parseFloat(match[1]));
  }

  // Extract BLER values
  extractBLER(message, values) {
    const match = message.match(/BLER[=:\s]*(\d+(?:\.\d+)?)/i);
    if (match) values.push(parseFloat(match[1]));
  }

  // Calculate statistics for metrics
  calculateStatistics(metrics) {
    try {
      const stats = {};
      
      Object.keys(metrics).forEach(key => {
        if (key === 'timestamp') {
          stats[key] = metrics[key];
          return;
        }
        
        const values = metrics[key];
        if (values.length > 0) {
          stats[key] = {
            current: values[values.length - 1],
            average: values.reduce((a, b) => a + b, 0) / values.length,
            min: Math.min(...values),
            max: Math.max(...values),
            count: values.length,
            values: values.slice(-20) // Keep last 20 values for charts
          };
        }
      });
      
      return stats;
    } catch (error) {
      console.error('PhyMetricsProcessor calculate statistics error:', error);
      return {};
    }
  }

  // Update metrics history
  updateHistory(metrics) {
    try {
      const timestamp = metrics.timestamp;
      this.metricsHistory.set(timestamp, metrics);
      
      // Maintain history size
      if (this.metricsHistory.size > this.maxHistorySize) {
        const firstKey = this.metricsHistory.keys().next().value;
        this.metricsHistory.delete(firstKey);
      }
    } catch (error) {
      console.error('PhyMetricsProcessor update history error:', error);
      reportError(error);
    }
  }

  // Subscribe to metrics updates
  subscribe(callback) {
    try {
      this.subscribers.add(callback);
    } catch (error) {
      console.error('PhyMetricsProcessor subscribe error:', error);
      reportError(error);
    }
  }

  // Unsubscribe from metrics updates
  unsubscribe(callback) {
    try {
      this.subscribers.delete(callback);
    } catch (error) {
      console.error('PhyMetricsProcessor unsubscribe error:', error);
      reportError(error);
    }
  }

  // Notify subscribers of metrics updates
  notifySubscribers(metrics) {
    try {
      this.subscribers.forEach(callback => {
        try {
          callback(metrics);
        } catch (error) {
          console.error('PhyMetricsProcessor notify callback error:', error);
        }
      });
    } catch (error) {
      console.error('PhyMetricsProcessor notify subscribers error:', error);
      reportError(error);
    }
  }

  // Get metrics history
  getHistory() {
    try {
      return Array.from(this.metricsHistory.values());
    } catch (error) {
      console.error('PhyMetricsProcessor get history error:', error);
      return [];
    }
  }
}

// Export PhyMetricsProcessor
window.PhyMetricsProcessor = PhyMetricsProcessor;

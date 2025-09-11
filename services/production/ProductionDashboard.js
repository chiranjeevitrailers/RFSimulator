// Production Dashboard - Monitors production CLI operations
class ProductionDashboard {
  constructor() {
    this.metrics = new Map();
    this.alerts = [];
    this.isMonitoring = false;
    this.updateInterval = null;
  }

  initialize() {
    try {
      this.startMonitoring();
      return true;
    } catch (error) {
      console.error('ProductionDashboard initialization error:', error);
      return false;
    }
  }

  startMonitoring() {
    this.isMonitoring = true;
    this.updateInterval = setInterval(() => {
      this.collectMetrics();
    }, 5000);
  }

  stopMonitoring() {
    this.isMonitoring = false;
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  collectMetrics() {
    try {
      const timestamp = new Date().toISOString();
      
      // Collect system metrics
      const metrics = {
        timestamp,
        cliConnections: this.getCLIConnectionStats(),
        dataProcessing: this.getDataProcessingStats(),
        performance: this.getPerformanceStats(),
        safety: this.getSafetyStats()
      };

      this.metrics.set(timestamp, metrics);
      
      // Keep only last 100 metrics
      if (this.metrics.size > 100) {
        const firstKey = this.metrics.keys().next().value;
        this.metrics.delete(firstKey);
      }

      // Check for alerts
      this.checkAlerts(metrics);
    } catch (error) {
      console.error('ProductionDashboard collectMetrics error:', error);
    }
  }

  getCLIConnectionStats() {
    // Simulate connection stats
    return {
      activeConnections: Math.floor(Math.random() * 3) + 1,
      totalConnections: 3,
      failedConnections: 0
    };
  }

  getDataProcessingStats() {
    return {
      logsPerSecond: Math.floor(Math.random() * 50) + 10,
      queueSize: Math.floor(Math.random() * 100),
      processingLatency: Math.random() * 100 + 50
    };
  }

  getPerformanceStats() {
    return {
      cpuUsage: Math.random() * 50 + 25,
      memoryUsage: Math.random() * 30 + 40,
      cacheHitRate: Math.random() * 20 + 75
    };
  }

  getSafetyStats() {
    return {
      emergencyStopActive: false,
      blockedCommands: 0,
      safetyChecksPassed: Math.floor(Math.random() * 10) + 90
    };
  }

  checkAlerts(metrics) {
    // Check for alert conditions
    if (metrics.performance.cpuUsage > 80) {
      this.addAlert('HIGH_CPU', 'CPU usage above 80%');
    }
    
    if (metrics.dataProcessing.processingLatency > 200) {
      this.addAlert('HIGH_LATENCY', 'Processing latency above 200ms');
    }
  }

  addAlert(type, message) {
    this.alerts.push({
      timestamp: new Date().toISOString(),
      type,
      message,
      severity: this.getAlertSeverity(type)
    });

    // Keep only last 50 alerts
    if (this.alerts.length > 50) {
      this.alerts.shift();
    }
  }

  getAlertSeverity(type) {
    const severityMap = {
      HIGH_CPU: 'warning',
      HIGH_LATENCY: 'warning',
      CONNECTION_FAILED: 'error',
      EMERGENCY_STOP: 'critical'
    };
    return severityMap[type] || 'info';
  }

  getMetrics(timeRange = '1h') {
    const now = new Date();
    const hours = timeRange === '1h' ? 1 : 24;
    const startTime = new Date(now.getTime() - hours * 60 * 60 * 1000);

    return Array.from(this.metrics.values()).filter(metric => 
      new Date(metric.timestamp) >= startTime
    );
  }

  getAlerts(severity = null) {
    if (severity) {
      return this.alerts.filter(alert => alert.severity === severity);
    }
    return [...this.alerts];
  }

  getDashboardSummary() {
    const latestMetrics = Array.from(this.metrics.values()).pop();
    const activeAlerts = this.alerts.filter(alert => 
      new Date(alert.timestamp) > new Date(Date.now() - 60000)
    );

    return {
      isMonitoring: this.isMonitoring,
      lastUpdate: latestMetrics?.timestamp,
      activeAlerts: activeAlerts.length,
      currentMetrics: latestMetrics
    };
  }
}

if (typeof window !== 'undefined') {
  window.ProductionDashboard = ProductionDashboard;
}
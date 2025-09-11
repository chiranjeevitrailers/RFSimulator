// KpiMetrics Data Model
class KpiMetrics {
  constructor(data = {}) {
    try {
      this.id = data.id || window.HELPERS.generateId();
      this.timestamp = data.timestamp || new Date().toISOString();
      this.source = data.source || 'unknown';
      this.category = data.category || 'performance';
      this.metrics = data.metrics || {};
      this.thresholds = data.thresholds || {};
      this.alerts = data.alerts || [];
    } catch (error) {
      console.error('KpiMetrics constructor error:', error);
      reportError(error);
    }
  }

  // Add metric value
  addMetric(name, value, unit = '', threshold = null) {
    try {
      this.metrics[name] = {
        value: value,
        unit: unit,
        timestamp: new Date().toISOString()
      };
      
      if (threshold !== null) {
        this.thresholds[name] = threshold;
        this.checkThreshold(name);
      }
    } catch (error) {
      console.error('KpiMetrics add metric error:', error);
      reportError(error);
    }
  }

  // Check threshold violation
  checkThreshold(metricName) {
    try {
      const metric = this.metrics[metricName];
      const threshold = this.thresholds[metricName];
      
      if (metric && threshold) {
        if (metric.value > threshold.max || metric.value < threshold.min) {
          this.addAlert(metricName, 'threshold_violation', metric.value);
        }
      }
    } catch (error) {
      console.error('KpiMetrics threshold check error:', error);
      reportError(error);
    }
  }

  // Add alert
  addAlert(metricName, type, value) {
    try {
      this.alerts.push({
        id: window.HELPERS.generateId(),
        timestamp: new Date().toISOString(),
        metricName: metricName,
        type: type,
        value: value,
        severity: this.getAlertSeverity(type)
      });
    } catch (error) {
      console.error('KpiMetrics add alert error:', error);
      reportError(error);
    }
  }

  // Get alert severity
  getAlertSeverity(type) {
    try {
      const severityMap = {
        'threshold_violation': 'high',
        'performance_degradation': 'medium',
        'connection_lost': 'critical',
        'quality_issue': 'medium'
      };
      return severityMap[type] || 'low';
    } catch (error) {
      console.error('KpiMetrics alert severity error:', error);
      return 'low';
    }
  }

  // Get metrics summary
  getSummary() {
    try {
      const summary = {
        totalMetrics: Object.keys(this.metrics).length,
        activeAlerts: this.alerts.length,
        lastUpdate: this.timestamp,
        source: this.source
      };
      
      return summary;
    } catch (error) {
      console.error('KpiMetrics summary error:', error);
      return {};
    }
  }

  // Export to chart format
  toChartData() {
    try {
      const chartData = {
        labels: [],
        datasets: []
      };
      
      Object.entries(this.metrics).forEach(([name, metric]) => {
        chartData.labels.push(name);
        chartData.datasets.push({
          label: name,
          value: metric.value,
          unit: metric.unit
        });
      });
      
      return chartData;
    } catch (error) {
      console.error('KpiMetrics chart data error:', error);
      return { labels: [], datasets: [] };
    }
  }
}

// Export KpiMetrics class
window.KpiMetrics = KpiMetrics;

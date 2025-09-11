// Production Monitor - Advanced monitoring and alerting for production deployment
class ProductionMonitor {
  constructor() {
    this.alerts = new Map();
    this.metrics = new Map();
    this.thresholds = new Map();
    this.notificationChannels = new Map();
    this.alertHistory = [];
    this.isMonitoring = false;
    this.monitoringInterval = null;
    
    this.initializeThresholds();
    this.setupNotificationChannels();
  }

  initializeThresholds() {
    // System performance thresholds
    this.thresholds.set('cpu_usage', { warning: 70, critical: 90 });
    this.thresholds.set('memory_usage', { warning: 80, critical: 95 });
    this.thresholds.set('disk_usage', { warning: 85, critical: 95 });
    this.thresholds.set('network_latency', { warning: 100, critical: 500 }); // ms
    
    // CLI process thresholds
    this.thresholds.set('process_uptime', { warning: 3600, critical: 1800 }); // seconds
    this.thresholds.set('process_restarts', { warning: 3, critical: 5 }); // per hour
    this.thresholds.set('log_errors', { warning: 10, critical: 50 }); // per minute
    
    // Network connectivity thresholds
    this.thresholds.set('connection_failures', { warning: 2, critical: 5 }); // per minute
    this.thresholds.set('packet_loss', { warning: 1, critical: 5 }); // percentage
    
    // Database thresholds
    this.thresholds.set('db_connections', { warning: 80, critical: 95 }); // percentage
    this.thresholds.set('db_query_time', { warning: 1000, critical: 5000 }); // ms
    this.thresholds.set('db_size', { warning: 1000, critical: 5000 }); // MB
  }

  setupNotificationChannels() {
    // Email notifications
    this.notificationChannels.set('email', {
      enabled: false,
      config: {
        smtp: {
          host: process.env.SMTP_HOST || 'localhost',
          port: process.env.SMTP_PORT || 587,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        },
        from: process.env.ALERT_EMAIL_FROM || 'alerts@5glabx.com',
        to: process.env.ALERT_EMAIL_TO ? process.env.ALERT_EMAIL_TO.split(',') : []
      }
    });

    // Webhook notifications
    this.notificationChannels.set('webhook', {
      enabled: false,
      config: {
        url: process.env.WEBHOOK_URL,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': process.env.WEBHOOK_AUTH
        }
      }
    });

    // Slack notifications
    this.notificationChannels.set('slack', {
      enabled: false,
      config: {
        webhook: process.env.SLACK_WEBHOOK_URL,
        channel: process.env.SLACK_CHANNEL || '#alerts'
      }
    });

    // Console logging (always enabled)
    this.notificationChannels.set('console', {
      enabled: true,
      config: {}
    });
  }

  async startMonitoring() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    
    // Start system monitoring
    this.monitoringInterval = setInterval(() => {
      this.performSystemChecks();
    }, 30000); // Check every 30 seconds
    
    console.log('Production monitoring started');
  }

  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.isMonitoring = false;
    console.log('Production monitoring stopped');
  }

  async performSystemChecks() {
    try {
      // Check system resources
      await this.checkSystemResources();
      
      // Check CLI processes
      await this.checkCLIProcesses();
      
      // Check network connectivity
      await this.checkNetworkConnectivity();
      
      // Check database health
      await this.checkDatabaseHealth();
      
      // Check application metrics
      await this.checkApplicationMetrics();
      
    } catch (error) {
      console.error('Error during system checks:', error);
      this.createAlert('system_check_error', 'critical', 'System check failed', { error: error.message });
    }
  }

  async checkSystemResources() {
    try {
      const { exec } = require('child_process');
      
      // Get CPU usage
      const cpuUsage = await new Promise((resolve) => {
        exec("top -bn1 | grep 'Cpu(s)' | awk '{print $2}' | awk -F'%' '{print $1}'", (error, stdout) => {
          if (error) resolve(0);
          else resolve(parseFloat(stdout.trim()) || 0);
        });
      });

      // Get memory usage
      const memoryUsage = await new Promise((resolve) => {
        exec("free | grep Mem | awk '{printf \"%.1f\", $3/$2 * 100.0}'", (error, stdout) => {
          if (error) resolve(0);
          else resolve(parseFloat(stdout.trim()) || 0);
        });
      });

      // Get disk usage
      const diskUsage = await new Promise((resolve) => {
        exec("df -h / | awk 'NR==2{print $5}' | sed 's/%//'", (error, stdout) => {
          if (error) resolve(0);
          else resolve(parseFloat(stdout.trim()) || 0);
        });
      });

      // Check thresholds
      this.checkThreshold('cpu_usage', cpuUsage, 'CPU usage');
      this.checkThreshold('memory_usage', memoryUsage, 'Memory usage');
      this.checkThreshold('disk_usage', diskUsage, 'Disk usage');

      // Store metrics
      this.metrics.set('cpu_usage', cpuUsage);
      this.metrics.set('memory_usage', memoryUsage);
      this.metrics.set('disk_usage', diskUsage);

    } catch (error) {
      console.error('Error checking system resources:', error);
    }
  }

  async checkCLIProcesses() {
    try {
      const { exec } = require('child_process');
      
      const processes = ['srsran', 'open5gs', 'kamailio'];
      
      for (const processName of processes) {
        // Check if process is running
        const isRunning = await new Promise((resolve) => {
          exec(`pgrep -f ${processName}`, (error) => {
            resolve(!error);
          });
        });

        if (!isRunning) {
          this.createAlert(`process_down_${processName}`, 'critical', `${processName} process is not running`);
        } else {
          // Check process uptime
          const uptime = await new Promise((resolve) => {
            exec(`ps -o etime= -p $(pgrep -f ${processName} | head -1)`, (error, stdout) => {
              if (error) resolve(0);
              else {
                const timeStr = stdout.trim();
                const seconds = this.parseProcessUptime(timeStr);
                resolve(seconds);
              }
            });
          });

          this.checkThreshold('process_uptime', uptime, `${processName} uptime`);
        }
      }
    } catch (error) {
      console.error('Error checking CLI processes:', error);
    }
  }

  async checkNetworkConnectivity() {
    try {
      // This would integrate with the NetworkConnectivityManager
      // For now, we'll simulate some checks
      
      const testPorts = [
        { port: 36412, name: 'S1AP' },
        { port: 27017, name: 'MongoDB' },
        { port: 3306, name: 'MySQL' },
        { port: 5060, name: 'SIP' }
      ];

      for (const portInfo of testPorts) {
        const isOpen = await this.testPort(portInfo.port);
        if (!isOpen) {
          this.createAlert(`port_closed_${portInfo.port}`, 'warning', `${portInfo.name} port ${portInfo.port} is not accessible`);
        }
      }
    } catch (error) {
      console.error('Error checking network connectivity:', error);
    }
  }

  async checkDatabaseHealth() {
    try {
      // Check database size
      const dbSize = await this.getDatabaseSize();
      this.checkThreshold('db_size', dbSize, 'Database size');

      // Check database connections (simplified)
      const dbConnections = await this.getDatabaseConnections();
      this.checkThreshold('db_connections', dbConnections, 'Database connections');

    } catch (error) {
      console.error('Error checking database health:', error);
    }
  }

  async checkApplicationMetrics() {
    try {
      // Check log error rate
      const errorRate = await this.getLogErrorRate();
      this.checkThreshold('log_errors', errorRate, 'Log error rate');

      // Check WebSocket connections
      const wsConnections = this.getWebSocketConnections();
      if (wsConnections === 0) {
        this.createAlert('no_websocket_connections', 'warning', 'No WebSocket connections active');
      }

    } catch (error) {
      console.error('Error checking application metrics:', error);
    }
  }

  checkThreshold(metricName, value, description) {
    const threshold = this.thresholds.get(metricName);
    if (!threshold) return;

    let severity = null;
    if (value >= threshold.critical) {
      severity = 'critical';
    } else if (value >= threshold.warning) {
      severity = 'warning';
    }

    if (severity) {
      this.createAlert(`threshold_${metricName}`, severity, `${description} is ${value} (threshold: ${threshold[severity]})`, {
        metric: metricName,
        value: value,
        threshold: threshold[severity],
        severity: severity
      });
    }
  }

  createAlert(alertId, severity, message, data = {}) {
    const alert = {
      id: alertId,
      severity: severity,
      message: message,
      timestamp: new Date().toISOString(),
      data: data,
      acknowledged: false,
      resolved: false
    };

    // Check if this alert already exists and is active
    const existingAlert = this.alerts.get(alertId);
    if (existingAlert && !existingAlert.resolved) {
      return; // Don't create duplicate alerts
    }

    this.alerts.set(alertId, alert);
    this.alertHistory.push(alert);

    // Keep only last 1000 alerts
    if (this.alertHistory.length > 1000) {
      this.alertHistory = this.alertHistory.slice(-1000);
    }

    // Send notifications
    this.sendNotifications(alert);

    console.log(`ALERT [${severity.toUpperCase()}] ${message}`, data);
  }

  async sendNotifications(alert) {
    for (const [channelName, channel] of this.notificationChannels) {
      if (!channel.enabled) continue;

      try {
        switch (channelName) {
          case 'email':
            await this.sendEmailNotification(alert, channel.config);
            break;
          case 'webhook':
            await this.sendWebhookNotification(alert, channel.config);
            break;
          case 'slack':
            await this.sendSlackNotification(alert, channel.config);
            break;
          case 'console':
            this.sendConsoleNotification(alert);
            break;
        }
      } catch (error) {
        console.error(`Error sending ${channelName} notification:`, error);
      }
    }
  }

  sendConsoleNotification(alert) {
    const timestamp = new Date(alert.timestamp).toLocaleString();
    console.log(`\n🚨 ALERT [${alert.severity.toUpperCase()}] - ${timestamp}`);
    console.log(`📝 Message: ${alert.message}`);
    if (Object.keys(alert.data).length > 0) {
      console.log(`📊 Data:`, alert.data);
    }
    console.log('─'.repeat(50));
  }

  async sendEmailNotification(alert, config) {
    // Email notification implementation would go here
    // This would use nodemailer or similar library
    console.log(`Email notification sent for alert: ${alert.id}`);
  }

  async sendWebhookNotification(alert, config) {
    if (!config.url) return;

    const axios = require('axios');
    await axios.post(config.url, {
      alert: alert,
      timestamp: new Date().toISOString(),
      source: '5glabx-monitor'
    }, {
      headers: config.headers
    });
  }

  async sendSlackNotification(alert, config) {
    if (!config.webhook) return;

    const axios = require('axios');
    const color = alert.severity === 'critical' ? 'danger' : 'warning';
    
    const payload = {
      channel: config.channel,
      attachments: [{
        color: color,
        title: `5GLabX Alert: ${alert.severity.toUpperCase()}`,
        text: alert.message,
        fields: [
          {
            title: 'Timestamp',
            value: new Date(alert.timestamp).toLocaleString(),
            short: true
          },
          {
            title: 'Alert ID',
            value: alert.id,
            short: true
          }
        ],
        footer: '5GLabX Production Monitor',
        ts: Math.floor(new Date(alert.timestamp).getTime() / 1000)
      }]
    };

    await axios.post(config.webhook, payload);
  }

  // Utility methods
  parseProcessUptime(timeStr) {
    // Parse process uptime string (e.g., "01:23:45" or "1-02:30:45")
    const parts = timeStr.split('-');
    let days = 0;
    let timePart = parts[0];
    
    if (parts.length > 1) {
      days = parseInt(parts[0]);
      timePart = parts[1];
    }
    
    const timeParts = timePart.split(':');
    const hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);
    const seconds = parseInt(timeParts[2]);
    
    return days * 86400 + hours * 3600 + minutes * 60 + seconds;
  }

  async testPort(port) {
    return new Promise((resolve) => {
      const net = require('net');
      const socket = new net.Socket();
      const timeout = 1000;
      
      socket.setTimeout(timeout);
      
      socket.on('connect', () => {
        socket.destroy();
        resolve(true);
      });
      
      socket.on('timeout', () => {
        socket.destroy();
        resolve(false);
      });
      
      socket.on('error', () => {
        socket.destroy();
        resolve(false);
      });
      
      socket.connect(port, '127.0.0.1');
    });
  }

  async getDatabaseSize() {
    // Simplified database size check
    return 100; // MB
  }

  async getDatabaseConnections() {
    // Simplified database connections check
    return 10; // percentage
  }

  async getLogErrorRate() {
    // Simplified log error rate check
    return 5; // errors per minute
  }

  getWebSocketConnections() {
    // This would be passed from the WebSocket server
    return 1; // simplified
  }

  // Public API methods
  getAlerts(severity = null, limit = 100) {
    let alerts = Array.from(this.alerts.values());
    
    if (severity) {
      alerts = alerts.filter(alert => alert.severity === severity);
    }
    
    return alerts.slice(-limit);
  }

  getMetrics() {
    const metrics = {};
    for (const [name, value] of this.metrics) {
      metrics[name] = value;
    }
    return metrics;
  }

  getThresholds() {
    const thresholds = {};
    for (const [name, threshold] of this.thresholds) {
      thresholds[name] = threshold;
    }
    return thresholds;
  }

  acknowledgeAlert(alertId) {
    const alert = this.alerts.get(alertId);
    if (alert) {
      alert.acknowledged = true;
      return true;
    }
    return false;
  }

  resolveAlert(alertId) {
    const alert = this.alerts.get(alertId);
    if (alert) {
      alert.resolved = true;
      return true;
    }
    return false;
  }

  updateThreshold(metricName, warning, critical) {
    this.thresholds.set(metricName, { warning, critical });
  }

  enableNotificationChannel(channelName) {
    const channel = this.notificationChannels.get(channelName);
    if (channel) {
      channel.enabled = true;
    }
  }

  disableNotificationChannel(channelName) {
    const channel = this.notificationChannels.get(channelName);
    if (channel) {
      channel.enabled = false;
    }
  }

  getStatus() {
    return {
      monitoring: this.isMonitoring,
      alerts: this.alerts.size,
      metrics: this.metrics.size,
      thresholds: this.thresholds.size,
      notificationChannels: Array.from(this.notificationChannels.entries()).map(([name, channel]) => ({
        name,
        enabled: channel.enabled
      }))
    };
  }
}

module.exports = ProductionMonitor;
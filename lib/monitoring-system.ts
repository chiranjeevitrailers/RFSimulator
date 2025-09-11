import { supabase } from './supabase';

export interface SystemMetrics {
  timestamp: Date;
  cpu: {
    usage: number;
    cores: number;
    loadAverage: number[];
  };
  memory: {
    total: number;
    used: number;
    free: number;
    usage: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
    usage: number;
  };
  network: {
    bytesIn: number;
    bytesOut: number;
    packetsIn: number;
    packetsOut: number;
    connections: number;
  };
  database: {
    connections: number;
    queries: number;
    slowQueries: number;
    cacheHitRate: number;
  };
  application: {
    requests: number;
    responseTime: number;
    errorRate: number;
    activeUsers: number;
  };
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  metric: string;
  condition: 'greater_than' | 'less_than' | 'equals' | 'not_equals';
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  cooldown: number; // minutes
  notificationChannels: string[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Alert {
  id: string;
  ruleId: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'resolved' | 'acknowledged';
  triggeredAt: Date;
  resolvedAt?: Date;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
  metadata: any;
  notifications: Array<{
    channel: string;
    sentAt: Date;
    status: 'sent' | 'failed';
    error?: string;
  }>;
}

export interface NotificationChannel {
  id: string;
  name: string;
  type: 'email' | 'slack' | 'webhook' | 'sms';
  config: any;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface HealthCheck {
  id: string;
  name: string;
  type: 'http' | 'tcp' | 'database' | 'custom';
  config: any;
  status: 'healthy' | 'unhealthy' | 'unknown';
  lastCheck: Date;
  responseTime: number;
  error?: string;
  tags: string[];
}

export interface MonitoringConfig {
  metricsInterval: number; // seconds
  healthCheckInterval: number; // seconds
  alertEvaluationInterval: number; // seconds
  retentionPeriod: number; // days
  enableRealTime: boolean;
  enableHistoricalData: boolean;
  maxMetricsPerBatch: number;
}

export class MonitoringSystem {
  private static instance: MonitoringSystem;
  private config: MonitoringConfig;
  private metrics: SystemMetrics[] = [];
  private alertRules: AlertRule[] = [];
  private alerts: Alert[] = [];
  private notificationChannels: NotificationChannel[] = [];
  private healthChecks: HealthCheck[] = [];
  private isMonitoring = false;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private alertEvaluationInterval: NodeJS.Timeout | null = null;
  private healthCheckInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.config = {
      metricsInterval: 30,
      healthCheckInterval: 60,
      alertEvaluationInterval: 60,
      retentionPeriod: 30,
      enableRealTime: true,
      enableHistoricalData: true,
      maxMetricsPerBatch: 100
    };

    this.initializeDefaultRules();
    this.initializeDefaultChannels();
    this.initializeDefaultHealthChecks();
  }

  public static getInstance(): MonitoringSystem {
    if (!MonitoringSystem.instance) {
      MonitoringSystem.instance = new MonitoringSystem();
    }
    return MonitoringSystem.instance;
  }

  // Core monitoring methods
  public async startMonitoring(): Promise<void> {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    
    // Start metrics collection
    this.monitoringInterval = setInterval(() => {
      this.collectMetrics();
    }, this.config.metricsInterval * 1000);

    // Start alert evaluation
    this.alertEvaluationInterval = setInterval(() => {
      this.evaluateAlerts();
    }, this.config.alertEvaluationInterval * 1000);

    // Start health checks
    this.healthCheckInterval = setInterval(() => {
      this.runHealthChecks();
    }, this.config.healthCheckInterval * 1000);

    console.log('Monitoring system started');
  }

  public async stopMonitoring(): Promise<void> {
    this.isMonitoring = false;

    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    if (this.alertEvaluationInterval) {
      clearInterval(this.alertEvaluationInterval);
      this.alertEvaluationInterval = null;
    }

    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }

    console.log('Monitoring system stopped');
  }

  // Metrics collection
  private async collectMetrics(): Promise<void> {
    try {
      const metrics: SystemMetrics = {
        timestamp: new Date(),
        cpu: await this.getCpuMetrics(),
        memory: await this.getMemoryMetrics(),
        disk: await this.getDiskMetrics(),
        network: await this.getNetworkMetrics(),
        database: await this.getDatabaseMetrics(),
        application: await this.getApplicationMetrics()
      };

      this.metrics.push(metrics);

      // Maintain retention period
      const cutoffDate = new Date(Date.now() - this.config.retentionPeriod * 24 * 60 * 60 * 1000);
      this.metrics = this.metrics.filter(m => m.timestamp > cutoffDate);

      // Store in database if enabled
      if (this.config.enableHistoricalData) {
        await this.storeMetrics(metrics);
      }

    } catch (error) {
      console.error('Failed to collect metrics:', error);
    }
  }

  private async getCpuMetrics(): Promise<SystemMetrics['cpu']> {
    // In a real implementation, you would use system APIs
    // For now, return mock data
    return {
      usage: Math.random() * 100,
      cores: 4,
      loadAverage: [Math.random() * 2, Math.random() * 2, Math.random() * 2]
    };
  }

  private async getMemoryMetrics(): Promise<SystemMetrics['memory']> {
    // In a real implementation, you would use system APIs
    const total = 8 * 1024 * 1024 * 1024; // 8GB
    const used = total * Math.random();
    return {
      total,
      used,
      free: total - used,
      usage: (used / total) * 100
    };
  }

  private async getDiskMetrics(): Promise<SystemMetrics['disk']> {
    // In a real implementation, you would use system APIs
    const total = 500 * 1024 * 1024 * 1024; // 500GB
    const used = total * Math.random();
    return {
      total,
      used,
      free: total - used,
      usage: (used / total) * 100
    };
  }

  private async getNetworkMetrics(): Promise<SystemMetrics['network']> {
    // In a real implementation, you would use system APIs
    return {
      bytesIn: Math.floor(Math.random() * 1000000),
      bytesOut: Math.floor(Math.random() * 1000000),
      packetsIn: Math.floor(Math.random() * 10000),
      packetsOut: Math.floor(Math.random() * 10000),
      connections: Math.floor(Math.random() * 100)
    };
  }

  private async getDatabaseMetrics(): Promise<SystemMetrics['database']> {
    try {
      // Get database metrics from Supabase
      const { data, error } = await supabase.rpc('get_database_metrics');
      if (error) throw error;

      return {
        connections: data?.connections || 0,
        queries: data?.queries || 0,
        slowQueries: data?.slow_queries || 0,
        cacheHitRate: data?.cache_hit_rate || 0
      };
    } catch (error) {
      return {
        connections: 0,
        queries: 0,
        slowQueries: 0,
        cacheHitRate: 0
      };
    }
  }

  private async getApplicationMetrics(): Promise<SystemMetrics['application']> {
    // In a real implementation, you would track application metrics
    return {
      requests: Math.floor(Math.random() * 1000),
      responseTime: Math.random() * 1000,
      errorRate: Math.random() * 5,
      activeUsers: Math.floor(Math.random() * 100)
    };
  }

  // Alert management
  public async createAlertRule(rule: Omit<AlertRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<AlertRule> {
    const alertRule: AlertRule = {
      id: this.generateId(),
      ...rule,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.alertRules.push(alertRule);
    await this.storeAlertRule(alertRule);
    return alertRule;
  }

  public async updateAlertRule(id: string, updates: Partial<AlertRule>): Promise<AlertRule | null> {
    const index = this.alertRules.findIndex(rule => rule.id === id);
    if (index === -1) return null;

    this.alertRules[index] = {
      ...this.alertRules[index],
      ...updates,
      updatedAt: new Date()
    };

    await this.storeAlertRule(this.alertRules[index]);
    return this.alertRules[index];
  }

  public async deleteAlertRule(id: string): Promise<boolean> {
    const index = this.alertRules.findIndex(rule => rule.id === id);
    if (index === -1) return false;

    this.alertRules.splice(index, 1);
    await this.deleteStoredAlertRule(id);
    return true;
  }

  private async evaluateAlerts(): Promise<void> {
    if (this.metrics.length === 0) return;

    const latestMetrics = this.metrics[this.metrics.length - 1];

    for (const rule of this.alertRules) {
      if (!rule.enabled) continue;

      // Check if rule is in cooldown
      const lastAlert = this.alerts
        .filter(alert => alert.ruleId === rule.id && alert.status === 'active')
        .sort((a, b) => b.triggeredAt.getTime() - a.triggeredAt.getTime())[0];

      if (lastAlert) {
        const cooldownMs = rule.cooldown * 60 * 1000;
        if (Date.now() - lastAlert.triggeredAt.getTime() < cooldownMs) {
          continue;
        }
      }

      // Evaluate rule condition
      const value = this.getMetricValue(latestMetrics, rule.metric);
      const shouldTrigger = this.evaluateCondition(value, rule.condition, rule.threshold);

      if (shouldTrigger) {
        await this.createAlert(rule, latestMetrics, value);
      }
    }
  }

  private getMetricValue(metrics: SystemMetrics, metricPath: string): number {
    const parts = metricPath.split('.');
    let value: any = metrics;

    for (const part of parts) {
      value = value[part];
      if (value === undefined) return 0;
    }

    return typeof value === 'number' ? value : 0;
  }

  private evaluateCondition(value: number, condition: string, threshold: number): boolean {
    switch (condition) {
      case 'greater_than':
        return value > threshold;
      case 'less_than':
        return value < threshold;
      case 'equals':
        return value === threshold;
      case 'not_equals':
        return value !== threshold;
      default:
        return false;
    }
  }

  private async createAlert(rule: AlertRule, metrics: SystemMetrics, value: number): Promise<void> {
    const alert: Alert = {
      id: this.generateId(),
      ruleId: rule.id,
      title: rule.name,
      description: `${rule.description} - Current value: ${value.toFixed(2)}`,
      severity: rule.severity,
      status: 'active',
      triggeredAt: new Date(),
      metadata: {
        metric: rule.metric,
        value,
        threshold: rule.threshold,
        condition: rule.condition,
        metrics: metrics
      },
      notifications: []
    };

    this.alerts.push(alert);
    await this.storeAlert(alert);

    // Send notifications
    await this.sendNotifications(alert, rule.notificationChannels);
  }

  // Notification management
  public async createNotificationChannel(channel: Omit<NotificationChannel, 'id' | 'createdAt' | 'updatedAt'>): Promise<NotificationChannel> {
    const notificationChannel: NotificationChannel = {
      id: this.generateId(),
      ...channel,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.notificationChannels.push(notificationChannel);
    await this.storeNotificationChannel(notificationChannel);
    return notificationChannel;
  }

  private async sendNotifications(alert: Alert, channelIds: string[]): Promise<void> {
    for (const channelId of channelIds) {
      const channel = this.notificationChannels.find(c => c.id === channelId);
      if (!channel || !channel.enabled) continue;

      try {
        await this.sendNotification(alert, channel);
        alert.notifications.push({
          channel: channelId,
          sentAt: new Date(),
          status: 'sent'
        });
      } catch (error) {
        alert.notifications.push({
          channel: channelId,
          sentAt: new Date(),
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    await this.updateAlert(alert);
  }

  private async sendNotification(alert: Alert, channel: NotificationChannel): Promise<void> {
    switch (channel.type) {
      case 'email':
        await this.sendEmailNotification(alert, channel);
        break;
      case 'slack':
        await this.sendSlackNotification(alert, channel);
        break;
      case 'webhook':
        await this.sendWebhookNotification(alert, channel);
        break;
      case 'sms':
        await this.sendSMSNotification(alert, channel);
        break;
    }
  }

  private async sendEmailNotification(alert: Alert, channel: NotificationChannel): Promise<void> {
    // Implement email notification
    console.log('Sending email notification:', alert.title);
  }

  private async sendSlackNotification(alert: Alert, channel: NotificationChannel): Promise<void> {
    // Implement Slack notification
    console.log('Sending Slack notification:', alert.title);
  }

  private async sendWebhookNotification(alert: Alert, channel: NotificationChannel): Promise<void> {
    // Implement webhook notification
    console.log('Sending webhook notification:', alert.title);
  }

  private async sendSMSNotification(alert: Alert, channel: NotificationChannel): Promise<void> {
    // Implement SMS notification
    console.log('Sending SMS notification:', alert.title);
  }

  // Health checks
  public async createHealthCheck(healthCheck: Omit<HealthCheck, 'id' | 'lastCheck' | 'status' | 'responseTime'>): Promise<HealthCheck> {
    const newHealthCheck: HealthCheck = {
      id: this.generateId(),
      ...healthCheck,
      lastCheck: new Date(),
      status: 'unknown',
      responseTime: 0
    };

    this.healthChecks.push(newHealthCheck);
    await this.storeHealthCheck(newHealthCheck);
    return newHealthCheck;
  }

  private async runHealthChecks(): Promise<void> {
    for (const healthCheck of this.healthChecks) {
      try {
        const startTime = Date.now();
        const result = await this.executeHealthCheck(healthCheck);
        const responseTime = Date.now() - startTime;

        healthCheck.lastCheck = new Date();
        healthCheck.responseTime = responseTime;
        healthCheck.status = result.healthy ? 'healthy' : 'unhealthy';
        healthCheck.error = result.error;

        await this.updateHealthCheck(healthCheck);
      } catch (error) {
        healthCheck.lastCheck = new Date();
        healthCheck.status = 'unhealthy';
        healthCheck.error = error instanceof Error ? error.message : 'Unknown error';
        await this.updateHealthCheck(healthCheck);
      }
    }
  }

  private async executeHealthCheck(healthCheck: HealthCheck): Promise<{ healthy: boolean; error?: string }> {
    switch (healthCheck.type) {
      case 'http':
        return await this.executeHttpHealthCheck(healthCheck);
      case 'tcp':
        return await this.executeTcpHealthCheck(healthCheck);
      case 'database':
        return await this.executeDatabaseHealthCheck(healthCheck);
      case 'custom':
        return await this.executeCustomHealthCheck(healthCheck);
      default:
        return { healthy: false, error: 'Unknown health check type' };
    }
  }

  private async executeHttpHealthCheck(healthCheck: HealthCheck): Promise<{ healthy: boolean; error?: string }> {
    try {
      const response = await fetch(healthCheck.config.url, {
        method: healthCheck.config.method || 'GET',
        timeout: healthCheck.config.timeout || 5000
      });

      return {
        healthy: response.ok && response.status === (healthCheck.config.expectedStatus || 200)
      };
    } catch (error) {
      return {
        healthy: false,
        error: error instanceof Error ? error.message : 'HTTP check failed'
      };
    }
  }

  private async executeTcpHealthCheck(healthCheck: HealthCheck): Promise<{ healthy: boolean; error?: string }> {
    // Implement TCP health check
    return { healthy: true };
  }

  private async executeDatabaseHealthCheck(healthCheck: HealthCheck): Promise<{ healthy: boolean; error?: string }> {
    try {
      const { error } = await supabase.from('users').select('count').limit(1);
      return { healthy: !error };
    } catch (error) {
      return {
        healthy: false,
        error: error instanceof Error ? error.message : 'Database check failed'
      };
    }
  }

  private async executeCustomHealthCheck(healthCheck: HealthCheck): Promise<{ healthy: boolean; error?: string }> {
    // Implement custom health check
    return { healthy: true };
  }

  // Database operations
  private async storeMetrics(metrics: SystemMetrics): Promise<void> {
    try {
      await supabase.from('system_metrics').insert({
        timestamp: metrics.timestamp.toISOString(),
        cpu_usage: metrics.cpu.usage,
        memory_usage: metrics.memory.usage,
        disk_usage: metrics.disk.usage,
        network_bytes_in: metrics.network.bytesIn,
        network_bytes_out: metrics.network.bytesOut,
        database_connections: metrics.database.connections,
        application_requests: metrics.application.requests,
        application_response_time: metrics.application.responseTime,
        application_error_rate: metrics.application.errorRate
      });
    } catch (error) {
      console.error('Failed to store metrics:', error);
    }
  }

  private async storeAlertRule(rule: AlertRule): Promise<void> {
    try {
      await supabase.from('alert_rules').upsert({
        id: rule.id,
        name: rule.name,
        description: rule.description,
        metric: rule.metric,
        condition: rule.condition,
        threshold: rule.threshold,
        severity: rule.severity,
        enabled: rule.enabled,
        cooldown: rule.cooldown,
        notification_channels: rule.notificationChannels,
        tags: rule.tags,
        created_at: rule.createdAt.toISOString(),
        updated_at: rule.updatedAt.toISOString()
      });
    } catch (error) {
      console.error('Failed to store alert rule:', error);
    }
  }

  private async storeAlert(alert: Alert): Promise<void> {
    try {
      await supabase.from('alerts').insert({
        id: alert.id,
        rule_id: alert.ruleId,
        title: alert.title,
        description: alert.description,
        severity: alert.severity,
        status: alert.status,
        triggered_at: alert.triggeredAt.toISOString(),
        resolved_at: alert.resolvedAt?.toISOString(),
        acknowledged_at: alert.acknowledgedAt?.toISOString(),
        acknowledged_by: alert.acknowledgedBy,
        metadata: alert.metadata,
        notifications: alert.notifications
      });
    } catch (error) {
      console.error('Failed to store alert:', error);
    }
  }

  private async updateAlert(alert: Alert): Promise<void> {
    try {
      await supabase.from('alerts').update({
        status: alert.status,
        resolved_at: alert.resolvedAt?.toISOString(),
        acknowledged_at: alert.acknowledgedAt?.toISOString(),
        acknowledged_by: alert.acknowledgedBy,
        notifications: alert.notifications
      }).eq('id', alert.id);
    } catch (error) {
      console.error('Failed to update alert:', error);
    }
  }

  private async storeNotificationChannel(channel: NotificationChannel): Promise<void> {
    try {
      await supabase.from('notification_channels').upsert({
        id: channel.id,
        name: channel.name,
        type: channel.type,
        config: channel.config,
        enabled: channel.enabled,
        created_at: channel.createdAt.toISOString(),
        updated_at: channel.updatedAt.toISOString()
      });
    } catch (error) {
      console.error('Failed to store notification channel:', error);
    }
  }

  private async storeHealthCheck(healthCheck: HealthCheck): Promise<void> {
    try {
      await supabase.from('health_checks').upsert({
        id: healthCheck.id,
        name: healthCheck.name,
        type: healthCheck.type,
        config: healthCheck.config,
        status: healthCheck.status,
        last_check: healthCheck.lastCheck.toISOString(),
        response_time: healthCheck.responseTime,
        error: healthCheck.error,
        tags: healthCheck.tags
      });
    } catch (error) {
      console.error('Failed to store health check:', error);
    }
  }

  private async updateHealthCheck(healthCheck: HealthCheck): Promise<void> {
    try {
      await supabase.from('health_checks').update({
        status: healthCheck.status,
        last_check: healthCheck.lastCheck.toISOString(),
        response_time: healthCheck.responseTime,
        error: healthCheck.error
      }).eq('id', healthCheck.id);
    } catch (error) {
      console.error('Failed to update health check:', error);
    }
  }

  private async deleteStoredAlertRule(id: string): Promise<void> {
    try {
      await supabase.from('alert_rules').delete().eq('id', id);
    } catch (error) {
      console.error('Failed to delete alert rule:', error);
    }
  }

  // Utility methods
  private generateId(): string {
    return 'mon_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private initializeDefaultRules(): void {
    this.alertRules = [
      {
        id: 'cpu_high',
        name: 'High CPU Usage',
        description: 'CPU usage is above 80%',
        metric: 'cpu.usage',
        condition: 'greater_than',
        threshold: 80,
        severity: 'high',
        enabled: true,
        cooldown: 5,
        notificationChannels: [],
        tags: ['system', 'performance'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'memory_high',
        name: 'High Memory Usage',
        description: 'Memory usage is above 85%',
        metric: 'memory.usage',
        condition: 'greater_than',
        threshold: 85,
        severity: 'high',
        enabled: true,
        cooldown: 5,
        notificationChannels: [],
        tags: ['system', 'performance'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'disk_high',
        name: 'High Disk Usage',
        description: 'Disk usage is above 90%',
        metric: 'disk.usage',
        condition: 'greater_than',
        threshold: 90,
        severity: 'critical',
        enabled: true,
        cooldown: 10,
        notificationChannels: [],
        tags: ['system', 'storage'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'response_time_high',
        name: 'High Response Time',
        description: 'Application response time is above 2 seconds',
        metric: 'application.responseTime',
        condition: 'greater_than',
        threshold: 2000,
        severity: 'medium',
        enabled: true,
        cooldown: 5,
        notificationChannels: [],
        tags: ['application', 'performance'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'error_rate_high',
        name: 'High Error Rate',
        description: 'Application error rate is above 5%',
        metric: 'application.errorRate',
        condition: 'greater_than',
        threshold: 5,
        severity: 'high',
        enabled: true,
        cooldown: 5,
        notificationChannels: [],
        tags: ['application', 'errors'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  private initializeDefaultChannels(): void {
    this.notificationChannels = [
      {
        id: 'email_default',
        name: 'Default Email',
        type: 'email',
        config: {
          to: 'admin@5glabx.com',
          from: 'alerts@5glabx.com'
        },
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  private initializeDefaultHealthChecks(): void {
    this.healthChecks = [
      {
        id: 'api_health',
        name: 'API Health Check',
        type: 'http',
        config: {
          url: '/api/health',
          method: 'GET',
          expectedStatus: 200,
          timeout: 5000
        },
        status: 'unknown',
        lastCheck: new Date(),
        responseTime: 0,
        tags: ['api', 'http']
      },
      {
        id: 'database_health',
        name: 'Database Health Check',
        type: 'database',
        config: {},
        status: 'unknown',
        lastCheck: new Date(),
        responseTime: 0,
        tags: ['database']
      }
    ];
  }

  // Public getters
  public getMetrics(): SystemMetrics[] {
    return [...this.metrics];
  }

  public getLatestMetrics(): SystemMetrics | null {
    return this.metrics.length > 0 ? this.metrics[this.metrics.length - 1] : null;
  }

  public getAlertRules(): AlertRule[] {
    return [...this.alertRules];
  }

  public getAlerts(): Alert[] {
    return [...this.alerts];
  }

  public getActiveAlerts(): Alert[] {
    return this.alerts.filter(alert => alert.status === 'active');
  }

  public getNotificationChannels(): NotificationChannel[] {
    return [...this.notificationChannels];
  }

  public getHealthChecks(): HealthCheck[] {
    return [...this.healthChecks];
  }

  public getConfig(): MonitoringConfig {
    return { ...this.config };
  }

  public updateConfig(updates: Partial<MonitoringConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  public isMonitoringActive(): boolean {
    return this.isMonitoring;
  }
}
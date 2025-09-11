import { supabase } from './supabase';

export interface AlertTemplate {
  id: string;
  name: string;
  description: string;
  category: 'system' | 'application' | 'database' | 'network' | 'security';
  metric: string;
  condition: 'greater_than' | 'less_than' | 'equals' | 'not_equals';
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  cooldown: number; // minutes
  tags: string[];
  notificationChannels: string[];
  escalationPolicy?: {
    levels: Array<{
      delay: number; // minutes
      channels: string[];
      severity: 'low' | 'medium' | 'high' | 'critical';
    }>;
  };
}

export interface AlertAction {
  id: string;
  name: string;
  type: 'webhook' | 'script' | 'email' | 'slack' | 'pagerduty';
  config: any;
  enabled: boolean;
  conditions: Array<{
    field: string;
    operator: string;
    value: any;
  }>;
}

export interface AlertSuppression {
  id: string;
  name: string;
  description: string;
  rules: Array<{
    field: string;
    operator: string;
    value: any;
  }>;
  schedule?: {
    timezone: string;
    days: number[]; // 0-6 (Sunday-Saturday)
    startTime: string; // HH:MM format
    endTime: string; // HH:MM format
  };
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AlertCorrelation {
  id: string;
  name: string;
  description: string;
  rules: Array<{
    metric: string;
    condition: string;
    threshold: number;
    timeWindow: number; // minutes
  }>;
  correlationWindow: number; // minutes
  action: 'suppress' | 'escalate' | 'combine';
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class AlertManager {
  private static instance: AlertManager;
  private alertTemplates: AlertTemplate[] = [];
  private alertActions: AlertAction[] = [];
  private alertSuppressions: AlertSuppression[] = [];
  private alertCorrelations: AlertCorrelation[] = [];
  private isInitialized = false;

  private constructor() {
    this.initializeDefaultTemplates();
    this.initializeDefaultActions();
    this.initializeDefaultSuppressions();
    this.initializeDefaultCorrelations();
  }

  public static getInstance(): AlertManager {
    if (!AlertManager.instance) {
      AlertManager.instance = new AlertManager();
    }
    return AlertManager.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await this.loadAlertTemplates();
      await this.loadAlertActions();
      await this.loadAlertSuppressions();
      await this.loadAlertCorrelations();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize AlertManager:', error);
    }
  }

  // Alert Template Management
  public async createAlertTemplate(template: Omit<AlertTemplate, 'id'>): Promise<AlertTemplate> {
    const alertTemplate: AlertTemplate = {
      id: this.generateId(),
      ...template
    };

    this.alertTemplates.push(alertTemplate);
    await this.storeAlertTemplate(alertTemplate);
    return alertTemplate;
  }

  public async updateAlertTemplate(id: string, updates: Partial<AlertTemplate>): Promise<AlertTemplate | null> {
    const index = this.alertTemplates.findIndex(template => template.id === id);
    if (index === -1) return null;

    this.alertTemplates[index] = {
      ...this.alertTemplates[index],
      ...updates
    };

    await this.storeAlertTemplate(this.alertTemplates[index]);
    return this.alertTemplates[index];
  }

  public async deleteAlertTemplate(id: string): Promise<boolean> {
    const index = this.alertTemplates.findIndex(template => template.id === id);
    if (index === -1) return false;

    this.alertTemplates.splice(index, 1);
    await this.deleteStoredAlertTemplate(id);
    return true;
  }

  public getAlertTemplates(): AlertTemplate[] {
    return [...this.alertTemplates];
  }

  public getAlertTemplate(id: string): AlertTemplate | null {
    return this.alertTemplates.find(template => template.id === id) || null;
  }

  public getAlertTemplatesByCategory(category: string): AlertTemplate[] {
    return this.alertTemplates.filter(template => template.category === category);
  }

  // Alert Action Management
  public async createAlertAction(action: Omit<AlertAction, 'id'>): Promise<AlertAction> {
    const alertAction: AlertAction = {
      id: this.generateId(),
      ...action
    };

    this.alertActions.push(alertAction);
    await this.storeAlertAction(alertAction);
    return alertAction;
  }

  public async updateAlertAction(id: string, updates: Partial<AlertAction>): Promise<AlertAction | null> {
    const index = this.alertActions.findIndex(action => action.id === id);
    if (index === -1) return null;

    this.alertActions[index] = {
      ...this.alertActions[index],
      ...updates
    };

    await this.storeAlertAction(this.alertActions[index]);
    return this.alertActions[index];
  }

  public async deleteAlertAction(id: string): Promise<boolean> {
    const index = this.alertActions.findIndex(action => action.id === id);
    if (index === -1) return false;

    this.alertActions.splice(index, 1);
    await this.deleteStoredAlertAction(id);
    return true;
  }

  public getAlertActions(): AlertAction[] {
    return [...this.alertActions];
  }

  public getAlertAction(id: string): AlertAction | null {
    return this.alertActions.find(action => action.id === id) || null;
  }

  // Alert Suppression Management
  public async createAlertSuppression(suppression: Omit<AlertSuppression, 'id' | 'createdAt' | 'updatedAt'>): Promise<AlertSuppression> {
    const alertSuppression: AlertSuppression = {
      id: this.generateId(),
      ...suppression,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.alertSuppressions.push(alertSuppression);
    await this.storeAlertSuppression(alertSuppression);
    return alertSuppression;
  }

  public async updateAlertSuppression(id: string, updates: Partial<AlertSuppression>): Promise<AlertSuppression | null> {
    const index = this.alertSuppressions.findIndex(suppression => suppression.id === id);
    if (index === -1) return null;

    this.alertSuppressions[index] = {
      ...this.alertSuppressions[index],
      ...updates,
      updatedAt: new Date()
    };

    await this.storeAlertSuppression(this.alertSuppressions[index]);
    return this.alertSuppressions[index];
  }

  public async deleteAlertSuppression(id: string): Promise<boolean> {
    const index = this.alertSuppressions.findIndex(suppression => suppression.id === id);
    if (index === -1) return false;

    this.alertSuppressions.splice(index, 1);
    await this.deleteStoredAlertSuppression(id);
    return true;
  }

  public getAlertSuppressions(): AlertSuppression[] {
    return [...this.alertSuppressions];
  }

  public getAlertSuppression(id: string): AlertSuppression | null {
    return this.alertSuppressions.find(suppression => suppression.id === id) || null;
  }

  // Alert Correlation Management
  public async createAlertCorrelation(correlation: Omit<AlertCorrelation, 'id' | 'createdAt' | 'updatedAt'>): Promise<AlertCorrelation> {
    const alertCorrelation: AlertCorrelation = {
      id: this.generateId(),
      ...correlation,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.alertCorrelations.push(alertCorrelation);
    await this.storeAlertCorrelation(alertCorrelation);
    return alertCorrelation;
  }

  public async updateAlertCorrelation(id: string, updates: Partial<AlertCorrelation>): Promise<AlertCorrelation | null> {
    const index = this.alertCorrelations.findIndex(correlation => correlation.id === id);
    if (index === -1) return null;

    this.alertCorrelations[index] = {
      ...this.alertCorrelations[index],
      ...updates,
      updatedAt: new Date()
    };

    await this.storeAlertCorrelation(this.alertCorrelations[index]);
    return this.alertCorrelations[index];
  }

  public async deleteAlertCorrelation(id: string): Promise<boolean> {
    const index = this.alertCorrelations.findIndex(correlation => correlation.id === id);
    if (index === -1) return false;

    this.alertCorrelations.splice(index, 1);
    await this.deleteStoredAlertCorrelation(id);
    return true;
  }

  public getAlertCorrelations(): AlertCorrelation[] {
    return [...this.alertCorrelations];
  }

  public getAlertCorrelation(id: string): AlertCorrelation | null {
    return this.alertCorrelations.find(correlation => correlation.id === id) || null;
  }

  // Alert Processing
  public async processAlert(alert: any): Promise<void> {
    try {
      // Check for suppressions
      const shouldSuppress = await this.checkSuppressions(alert);
      if (shouldSuppress) {
        console.log('Alert suppressed:', alert.id);
        return;
      }

      // Check for correlations
      const correlatedAlerts = await this.checkCorrelations(alert);
      if (correlatedAlerts.length > 0) {
        await this.handleCorrelatedAlerts(alert, correlatedAlerts);
        return;
      }

      // Execute alert actions
      await this.executeAlertActions(alert);

      // Handle escalation if configured
      await this.handleEscalation(alert);

    } catch (error) {
      console.error('Failed to process alert:', error);
    }
  }

  private async checkSuppressions(alert: any): Promise<boolean> {
    for (const suppression of this.alertSuppressions) {
      if (!suppression.enabled) continue;

      // Check if suppression is active based on schedule
      if (suppression.schedule && !this.isSuppressionActive(suppression.schedule)) {
        continue;
      }

      // Check if alert matches suppression rules
      if (this.matchesSuppressionRules(alert, suppression.rules)) {
        return true;
      }
    }

    return false;
  }

  private isSuppressionActive(schedule: AlertSuppression['schedule']): boolean {
    if (!schedule) return true;

    const now = new Date();
    const currentDay = now.getDay();
    const currentTime = now.toTimeString().substring(0, 5);

    // Check if current day is in schedule
    if (!schedule.days.includes(currentDay)) {
      return false;
    }

    // Check if current time is within schedule
    return currentTime >= schedule.startTime && currentTime <= schedule.endTime;
  }

  private matchesSuppressionRules(alert: any, rules: AlertSuppression['rules']): boolean {
    for (const rule of rules) {
      const alertValue = this.getAlertValue(alert, rule.field);
      if (!this.evaluateRule(alertValue, rule.operator, rule.value)) {
        return false;
      }
    }
    return true;
  }

  private async checkCorrelations(alert: any): Promise<any[]> {
    const correlatedAlerts: any[] = [];

    for (const correlation of this.alertCorrelations) {
      if (!correlation.enabled) continue;

      // Check if alert matches correlation rules
      if (this.matchesCorrelationRules(alert, correlation.rules)) {
        // Find other alerts within correlation window
        const relatedAlerts = await this.findRelatedAlerts(alert, correlation.correlationWindow);
        if (relatedAlerts.length > 0) {
          correlatedAlerts.push(...relatedAlerts);
        }
      }
    }

    return correlatedAlerts;
  }

  private matchesCorrelationRules(alert: any, rules: AlertCorrelation['rules']): boolean {
    for (const rule of rules) {
      const alertValue = this.getAlertValue(alert, rule.metric);
      if (!this.evaluateRule(alertValue, rule.condition, rule.threshold)) {
        return false;
      }
    }
    return true;
  }

  private async findRelatedAlerts(alert: any, correlationWindow: number): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('status', 'active')
        .gte('triggered_at', new Date(Date.now() - correlationWindow * 60 * 1000).toISOString())
        .neq('id', alert.id);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to find related alerts:', error);
      return [];
    }
  }

  private async handleCorrelatedAlerts(alert: any, correlatedAlerts: any[]): Promise<void> {
    // Implement correlation handling logic
    console.log('Handling correlated alerts:', alert.id, correlatedAlerts.length);
  }

  private async executeAlertActions(alert: any): Promise<void> {
    for (const action of this.alertActions) {
      if (!action.enabled) continue;

      // Check if action conditions are met
      if (this.matchesActionConditions(alert, action.conditions)) {
        await this.executeAction(alert, action);
      }
    }
  }

  private matchesActionConditions(alert: any, conditions: AlertAction['conditions']): boolean {
    for (const condition of conditions) {
      const alertValue = this.getAlertValue(alert, condition.field);
      if (!this.evaluateRule(alertValue, condition.operator, condition.value)) {
        return false;
      }
    }
    return true;
  }

  private async executeAction(alert: any, action: AlertAction): Promise<void> {
    try {
      switch (action.type) {
        case 'webhook':
          await this.executeWebhookAction(alert, action);
          break;
        case 'script':
          await this.executeScriptAction(alert, action);
          break;
        case 'email':
          await this.executeEmailAction(alert, action);
          break;
        case 'slack':
          await this.executeSlackAction(alert, action);
          break;
        case 'pagerduty':
          await this.executePagerDutyAction(alert, action);
          break;
      }
    } catch (error) {
      console.error('Failed to execute action:', action.id, error);
    }
  }

  private async executeWebhookAction(alert: any, action: AlertAction): Promise<void> {
    const response = await fetch(action.config.url, {
      method: action.config.method || 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...action.config.headers
      },
      body: JSON.stringify({
        alert,
        action: action.id,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
    }
  }

  private async executeScriptAction(alert: any, action: AlertAction): Promise<void> {
    // Implement script execution
    console.log('Executing script action:', action.id);
  }

  private async executeEmailAction(alert: any, action: AlertAction): Promise<void> {
    // Implement email action
    console.log('Executing email action:', action.id);
  }

  private async executeSlackAction(alert: any, action: AlertAction): Promise<void> {
    // Implement Slack action
    console.log('Executing Slack action:', action.id);
  }

  private async executePagerDutyAction(alert: any, action: AlertAction): Promise<void> {
    // Implement PagerDuty action
    console.log('Executing PagerDuty action:', action.id);
  }

  private async handleEscalation(alert: any): Promise<void> {
    // Implement escalation logic
    console.log('Handling escalation for alert:', alert.id);
  }

  // Utility methods
  private getAlertValue(alert: any, field: string): any {
    const parts = field.split('.');
    let value = alert;

    for (const part of parts) {
      value = value[part];
      if (value === undefined) return null;
    }

    return value;
  }

  private evaluateRule(value: any, operator: string, expectedValue: any): boolean {
    switch (operator) {
      case 'equals':
        return value === expectedValue;
      case 'not_equals':
        return value !== expectedValue;
      case 'greater_than':
        return Number(value) > Number(expectedValue);
      case 'less_than':
        return Number(value) < Number(expectedValue);
      case 'contains':
        return String(value).includes(String(expectedValue));
      case 'not_contains':
        return !String(value).includes(String(expectedValue));
      case 'starts_with':
        return String(value).startsWith(String(expectedValue));
      case 'ends_with':
        return String(value).endsWith(String(expectedValue));
      case 'regex':
        return new RegExp(expectedValue).test(String(value));
      default:
        return false;
    }
  }

  private generateId(): string {
    return 'alert_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // Database operations
  private async loadAlertTemplates(): Promise<void> {
    try {
      const { data, error } = await supabase.from('alert_templates').select('*');
      if (error) throw error;
      this.alertTemplates = data || [];
    } catch (error) {
      console.error('Failed to load alert templates:', error);
    }
  }

  private async loadAlertActions(): Promise<void> {
    try {
      const { data, error } = await supabase.from('alert_actions').select('*');
      if (error) throw error;
      this.alertActions = data || [];
    } catch (error) {
      console.error('Failed to load alert actions:', error);
    }
  }

  private async loadAlertSuppressions(): Promise<void> {
    try {
      const { data, error } = await supabase.from('alert_suppressions').select('*');
      if (error) throw error;
      this.alertSuppressions = data || [];
    } catch (error) {
      console.error('Failed to load alert suppressions:', error);
    }
  }

  private async loadAlertCorrelations(): Promise<void> {
    try {
      const { data, error } = await supabase.from('alert_correlations').select('*');
      if (error) throw error;
      this.alertCorrelations = data || [];
    } catch (error) {
      console.error('Failed to load alert correlations:', error);
    }
  }

  private async storeAlertTemplate(template: AlertTemplate): Promise<void> {
    try {
      await supabase.from('alert_templates').upsert({
        id: template.id,
        name: template.name,
        description: template.description,
        category: template.category,
        metric: template.metric,
        condition: template.condition,
        threshold: template.threshold,
        severity: template.severity,
        cooldown: template.cooldown,
        tags: template.tags,
        notification_channels: template.notificationChannels,
        escalation_policy: template.escalationPolicy
      });
    } catch (error) {
      console.error('Failed to store alert template:', error);
    }
  }

  private async storeAlertAction(action: AlertAction): Promise<void> {
    try {
      await supabase.from('alert_actions').upsert({
        id: action.id,
        name: action.name,
        type: action.type,
        config: action.config,
        enabled: action.enabled,
        conditions: action.conditions
      });
    } catch (error) {
      console.error('Failed to store alert action:', error);
    }
  }

  private async storeAlertSuppression(suppression: AlertSuppression): Promise<void> {
    try {
      await supabase.from('alert_suppressions').upsert({
        id: suppression.id,
        name: suppression.name,
        description: suppression.description,
        rules: suppression.rules,
        schedule: suppression.schedule,
        enabled: suppression.enabled,
        created_at: suppression.createdAt.toISOString(),
        updated_at: suppression.updatedAt.toISOString()
      });
    } catch (error) {
      console.error('Failed to store alert suppression:', error);
    }
  }

  private async storeAlertCorrelation(correlation: AlertCorrelation): Promise<void> {
    try {
      await supabase.from('alert_correlations').upsert({
        id: correlation.id,
        name: correlation.name,
        description: correlation.description,
        rules: correlation.rules,
        correlation_window: correlation.correlationWindow,
        action: correlation.action,
        enabled: correlation.enabled,
        created_at: correlation.createdAt.toISOString(),
        updated_at: correlation.updatedAt.toISOString()
      });
    } catch (error) {
      console.error('Failed to store alert correlation:', error);
    }
  }

  private async deleteStoredAlertTemplate(id: string): Promise<void> {
    try {
      await supabase.from('alert_templates').delete().eq('id', id);
    } catch (error) {
      console.error('Failed to delete alert template:', error);
    }
  }

  private async deleteStoredAlertAction(id: string): Promise<void> {
    try {
      await supabase.from('alert_actions').delete().eq('id', id);
    } catch (error) {
      console.error('Failed to delete alert action:', error);
    }
  }

  private async deleteStoredAlertSuppression(id: string): Promise<void> {
    try {
      await supabase.from('alert_suppressions').delete().eq('id', id);
    } catch (error) {
      console.error('Failed to delete alert suppression:', error);
    }
  }

  private async deleteStoredAlertCorrelation(id: string): Promise<void> {
    try {
      await supabase.from('alert_correlations').delete().eq('id', id);
    } catch (error) {
      console.error('Failed to delete alert correlation:', error);
    }
  }

  // Default initializations
  private initializeDefaultTemplates(): void {
    this.alertTemplates = [
      {
        id: 'cpu_high_template',
        name: 'High CPU Usage',
        description: 'CPU usage exceeds threshold',
        category: 'system',
        metric: 'cpu.usage',
        condition: 'greater_than',
        threshold: 80,
        severity: 'high',
        cooldown: 5,
        tags: ['system', 'performance'],
        notificationChannels: ['email_default']
      },
      {
        id: 'memory_high_template',
        name: 'High Memory Usage',
        description: 'Memory usage exceeds threshold',
        category: 'system',
        metric: 'memory.usage',
        condition: 'greater_than',
        threshold: 85,
        severity: 'high',
        cooldown: 5,
        tags: ['system', 'performance'],
        notificationChannels: ['email_default']
      },
      {
        id: 'disk_high_template',
        name: 'High Disk Usage',
        description: 'Disk usage exceeds threshold',
        category: 'system',
        metric: 'disk.usage',
        condition: 'greater_than',
        threshold: 90,
        severity: 'critical',
        cooldown: 10,
        tags: ['system', 'storage'],
        notificationChannels: ['email_default']
      },
      {
        id: 'response_time_high_template',
        name: 'High Response Time',
        description: 'Application response time exceeds threshold',
        category: 'application',
        metric: 'application.responseTime',
        condition: 'greater_than',
        threshold: 2000,
        severity: 'medium',
        cooldown: 5,
        tags: ['application', 'performance'],
        notificationChannels: ['email_default']
      },
      {
        id: 'error_rate_high_template',
        name: 'High Error Rate',
        description: 'Application error rate exceeds threshold',
        category: 'application',
        metric: 'application.errorRate',
        condition: 'greater_than',
        threshold: 5,
        severity: 'high',
        cooldown: 5,
        tags: ['application', 'errors'],
        notificationChannels: ['email_default']
      }
    ];
  }

  private initializeDefaultActions(): void {
    this.alertActions = [
      {
        id: 'email_notification',
        name: 'Email Notification',
        type: 'email',
        config: {
          to: 'admin@5glabx.com',
          subject: 'Alert: {{alert.title}}',
          template: 'alert_email_template'
        },
        enabled: true,
        conditions: []
      },
      {
        id: 'slack_notification',
        name: 'Slack Notification',
        type: 'slack',
        config: {
          webhook_url: process.env.SLACK_WEBHOOK_URL,
          channel: '#alerts',
          username: '5GLabX Monitor'
        },
        enabled: false,
        conditions: [
          {
            field: 'severity',
            operator: 'greater_than',
            value: 'medium'
          }
        ]
      }
    ];
  }

  private initializeDefaultSuppressions(): void {
    this.alertSuppressions = [
      {
        id: 'maintenance_window',
        name: 'Maintenance Window',
        description: 'Suppress alerts during maintenance window',
        rules: [
          {
            field: 'tags',
            operator: 'contains',
            value: 'maintenance'
          }
        ],
        schedule: {
          timezone: 'UTC',
          days: [0, 6], // Sunday and Saturday
          startTime: '02:00',
          endTime: '06:00'
        },
        enabled: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  private initializeDefaultCorrelations(): void {
    this.alertCorrelations = [
      {
        id: 'system_correlation',
        name: 'System Resource Correlation',
        description: 'Correlate system resource alerts',
        rules: [
          {
            metric: 'cpu.usage',
            condition: 'greater_than',
            threshold: 80,
            timeWindow: 5
          },
          {
            metric: 'memory.usage',
            condition: 'greater_than',
            threshold: 85,
            timeWindow: 5
          }
        ],
        correlationWindow: 10,
        action: 'combine',
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }
}
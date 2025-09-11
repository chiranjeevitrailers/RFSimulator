import { supabase } from './supabase';

export interface AuditEvent {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: any;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'authentication' | 'authorization' | 'data_access' | 'data_modification' | 'system_change' | 'security' | 'compliance';
  outcome: 'success' | 'failure' | 'error';
  sessionId?: string;
  requestId?: string;
}

export interface AuditQuery {
  userId?: string;
  action?: string;
  resource?: string;
  category?: string;
  severity?: string;
  outcome?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
}

export interface AuditStats {
  totalEvents: number;
  eventsByCategory: { [category: string]: number };
  eventsBySeverity: { [severity: string]: number };
  eventsByOutcome: { [outcome: string]: number };
  topUsers: Array<{ userId: string; count: number }>;
  topActions: Array<{ action: string; count: number }>;
  topResources: Array<{ resource: string; count: number }>;
  recentActivity: AuditEvent[];
}

export class AuditLogger {
  private static instance: AuditLogger;
  private events: AuditEvent[] = [];
  private config: {
    enableLocalStorage: boolean;
    enableDatabaseStorage: boolean;
    maxLocalEvents: number;
    batchSize: number;
    flushInterval: number;
  };

  private constructor() {
    this.config = {
      enableLocalStorage: true,
      enableDatabaseStorage: true,
      maxLocalEvents: 1000,
      batchSize: 50,
      flushInterval: 30000 // 30 seconds
    };

    this.startBatchFlush();
  }

  public static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  // Core logging methods
  public async log(event: Omit<AuditEvent, 'id' | 'timestamp'>): Promise<void> {
    const auditEvent: AuditEvent = {
      id: this.generateEventId(),
      timestamp: new Date(),
      ...event
    };

    // Store locally
    if (this.config.enableLocalStorage) {
      this.events.push(auditEvent);
      
      // Maintain max local events
      if (this.events.length > this.config.maxLocalEvents) {
        this.events = this.events.slice(-this.config.maxLocalEvents);
      }
    }

    // Store in database (async)
    if (this.config.enableDatabaseStorage) {
      this.storeInDatabase(auditEvent).catch(error => {
        console.error('Failed to store audit event in database:', error);
      });
    }
  }

  // Specific logging methods
  public async logAuthentication(
    userId: string,
    action: 'login' | 'logout' | 'login_failed' | 'password_change' | 'password_reset',
    outcome: 'success' | 'failure' | 'error',
    details: any,
    ipAddress: string,
    userAgent: string
  ): Promise<void> {
    await this.log({
      userId,
      action,
      resource: 'authentication',
      details,
      ipAddress,
      userAgent,
      severity: outcome === 'failure' ? 'medium' : 'low',
      category: 'authentication',
      outcome
    });
  }

  public async logDataAccess(
    userId: string,
    resource: string,
    resourceId: string,
    action: 'read' | 'export' | 'download',
    details: any,
    ipAddress: string,
    userAgent: string
  ): Promise<void> {
    await this.log({
      userId,
      action,
      resource,
      resourceId,
      details,
      ipAddress,
      userAgent,
      severity: 'low',
      category: 'data_access',
      outcome: 'success'
    });
  }

  public async logDataModification(
    userId: string,
    resource: string,
    resourceId: string,
    action: 'create' | 'update' | 'delete',
    details: any,
    ipAddress: string,
    userAgent: string
  ): Promise<void> {
    await this.log({
      userId,
      action,
      resource,
      resourceId,
      details,
      ipAddress,
      userAgent,
      severity: 'medium',
      category: 'data_modification',
      outcome: 'success'
    });
  }

  public async logSystemChange(
    userId: string,
    action: string,
    resource: string,
    details: any,
    ipAddress: string,
    userAgent: string
  ): Promise<void> {
    await this.log({
      userId,
      action,
      resource,
      details,
      ipAddress,
      userAgent,
      severity: 'high',
      category: 'system_change',
      outcome: 'success'
    });
  }

  public async logSecurityEvent(
    userId: string | undefined,
    action: string,
    resource: string,
    details: any,
    ipAddress: string,
    userAgent: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ): Promise<void> {
    await this.log({
      userId,
      action,
      resource,
      details,
      ipAddress,
      userAgent,
      severity,
      category: 'security',
      outcome: 'failure'
    });
  }

  public async logComplianceEvent(
    userId: string,
    action: string,
    resource: string,
    details: any,
    ipAddress: string,
    userAgent: string
  ): Promise<void> {
    await this.log({
      userId,
      action,
      resource,
      details,
      ipAddress,
      userAgent,
      severity: 'medium',
      category: 'compliance',
      outcome: 'success'
    });
  }

  // Query methods
  public async queryEvents(query: AuditQuery): Promise<AuditEvent[]> {
    try {
      if (this.config.enableDatabaseStorage) {
        return await this.queryFromDatabase(query);
      } else {
        return this.queryFromLocal(query);
      }
    } catch (error) {
      console.error('Failed to query audit events:', error);
      return this.queryFromLocal(query);
    }
  }

  public async getAuditStats(timeRange: { start: Date; end: Date }): Promise<AuditStats> {
    const events = await this.queryEvents({
      startDate: timeRange.start,
      endDate: timeRange.end
    });

    const stats: AuditStats = {
      totalEvents: events.length,
      eventsByCategory: {},
      eventsBySeverity: {},
      eventsByOutcome: {},
      topUsers: [],
      topActions: [],
      topResources: [],
      recentActivity: events.slice(0, 10)
    };

    // Calculate statistics
    events.forEach(event => {
      // Category stats
      stats.eventsByCategory[event.category] = (stats.eventsByCategory[event.category] || 0) + 1;
      
      // Severity stats
      stats.eventsBySeverity[event.severity] = (stats.eventsBySeverity[event.severity] || 0) + 1;
      
      // Outcome stats
      stats.eventsByOutcome[event.outcome] = (stats.eventsByOutcome[event.outcome] || 0) + 1;
    });

    // Top users
    const userCounts: { [userId: string]: number } = {};
    events.forEach(event => {
      if (event.userId) {
        userCounts[event.userId] = (userCounts[event.userId] || 0) + 1;
      }
    });
    stats.topUsers = Object.entries(userCounts)
      .map(([userId, count]) => ({ userId, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Top actions
    const actionCounts: { [action: string]: number } = {};
    events.forEach(event => {
      actionCounts[event.action] = (actionCounts[event.action] || 0) + 1;
    });
    stats.topActions = Object.entries(actionCounts)
      .map(([action, count]) => ({ action, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Top resources
    const resourceCounts: { [resource: string]: number } = {};
    events.forEach(event => {
      resourceCounts[event.resource] = (resourceCounts[event.resource] || 0) + 1;
    });
    stats.topResources = Object.entries(resourceCounts)
      .map(([resource, count]) => ({ resource, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return stats;
  }

  // Export methods
  public async exportEvents(
    query: AuditQuery,
    format: 'json' | 'csv' | 'excel'
  ): Promise<Blob> {
    const events = await this.queryEvents(query);
    
    switch (format) {
      case 'json':
        return new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' });
      case 'csv':
        return this.exportToCSV(events);
      case 'excel':
        return this.exportToExcel(events);
      default:
        throw new Error('Unsupported export format');
    }
  }

  // Database operations
  private async storeInDatabase(event: AuditEvent): Promise<void> {
    try {
      const { error } = await supabase.from('audit_events').insert({
        id: event.id,
        user_id: event.userId,
        action: event.action,
        resource: event.resource,
        resource_id: event.resourceId,
        details: event.details,
        ip_address: event.ipAddress,
        user_agent: event.userAgent,
        timestamp: event.timestamp.toISOString(),
        severity: event.severity,
        category: event.category,
        outcome: event.outcome,
        session_id: event.sessionId,
        request_id: event.requestId
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Failed to store audit event in database:', error);
      throw error;
    }
  }

  private async queryFromDatabase(query: AuditQuery): Promise<AuditEvent[]> {
    try {
      let supabaseQuery = supabase.from('audit_events').select('*');

      if (query.userId) {
        supabaseQuery = supabaseQuery.eq('user_id', query.userId);
      }
      if (query.action) {
        supabaseQuery = supabaseQuery.eq('action', query.action);
      }
      if (query.resource) {
        supabaseQuery = supabaseQuery.eq('resource', query.resource);
      }
      if (query.category) {
        supabaseQuery = supabaseQuery.eq('category', query.category);
      }
      if (query.severity) {
        supabaseQuery = supabaseQuery.eq('severity', query.severity);
      }
      if (query.outcome) {
        supabaseQuery = supabaseQuery.eq('outcome', query.outcome);
      }
      if (query.startDate) {
        supabaseQuery = supabaseQuery.gte('timestamp', query.startDate.toISOString());
      }
      if (query.endDate) {
        supabaseQuery = supabaseQuery.lte('timestamp', query.endDate.toISOString());
      }

      supabaseQuery = supabaseQuery
        .order('timestamp', { ascending: false })
        .limit(query.limit || 100)
        .range(query.offset || 0, (query.offset || 0) + (query.limit || 100) - 1);

      const { data, error } = await supabaseQuery;

      if (error) {
        throw error;
      }

      return data.map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        action: row.action,
        resource: row.resource,
        resourceId: row.resource_id,
        details: row.details,
        ipAddress: row.ip_address,
        userAgent: row.user_agent,
        timestamp: new Date(row.timestamp),
        severity: row.severity,
        category: row.category,
        outcome: row.outcome,
        sessionId: row.session_id,
        requestId: row.request_id
      }));
    } catch (error) {
      console.error('Failed to query audit events from database:', error);
      throw error;
    }
  }

  private queryFromLocal(query: AuditQuery): AuditEvent[] {
    let filteredEvents = [...this.events];

    if (query.userId) {
      filteredEvents = filteredEvents.filter(event => event.userId === query.userId);
    }
    if (query.action) {
      filteredEvents = filteredEvents.filter(event => event.action === query.action);
    }
    if (query.resource) {
      filteredEvents = filteredEvents.filter(event => event.resource === query.resource);
    }
    if (query.category) {
      filteredEvents = filteredEvents.filter(event => event.category === query.category);
    }
    if (query.severity) {
      filteredEvents = filteredEvents.filter(event => event.severity === query.severity);
    }
    if (query.outcome) {
      filteredEvents = filteredEvents.filter(event => event.outcome === query.outcome);
    }
    if (query.startDate) {
      filteredEvents = filteredEvents.filter(event => event.timestamp >= query.startDate!);
    }
    if (query.endDate) {
      filteredEvents = filteredEvents.filter(event => event.timestamp <= query.endDate!);
    }

    // Sort by timestamp descending
    filteredEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Apply limit and offset
    const offset = query.offset || 0;
    const limit = query.limit || 100;
    return filteredEvents.slice(offset, offset + limit);
  }

  // Batch operations
  private startBatchFlush(): void {
    setInterval(() => {
      this.flushBatch();
    }, this.config.flushInterval);
  }

  private async flushBatch(): Promise<void> {
    if (this.events.length === 0) return;

    const batch = this.events.splice(0, this.config.batchSize);
    
    try {
      await Promise.all(batch.map(event => this.storeInDatabase(event)));
    } catch (error) {
      console.error('Failed to flush audit batch:', error);
      // Re-add events to the beginning of the array
      this.events.unshift(...batch);
    }
  }

  // Export utilities
  private exportToCSV(events: AuditEvent[]): Blob {
    const headers = [
      'ID', 'User ID', 'Action', 'Resource', 'Resource ID', 'Details',
      'IP Address', 'User Agent', 'Timestamp', 'Severity', 'Category', 'Outcome'
    ];

    const rows = events.map(event => [
      event.id,
      event.userId || '',
      event.action,
      event.resource,
      event.resourceId || '',
      JSON.stringify(event.details),
      event.ipAddress,
      event.userAgent,
      event.timestamp.toISOString(),
      event.severity,
      event.category,
      event.outcome
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    return new Blob([csvContent], { type: 'text/csv' });
  }

  private exportToExcel(events: AuditEvent[]): Blob {
    // This would be implemented with a proper Excel library
    // For now, return a placeholder
    return new Blob(['Excel export not implemented'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  // Utility methods
  private generateEventId(): string {
    return 'audit_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // Public getters
  public getLocalEvents(): AuditEvent[] {
    return [...this.events];
  }

  public getConfig(): typeof this.config {
    return { ...this.config };
  }

  public updateConfig(updates: Partial<typeof this.config>): void {
    this.config = { ...this.config, ...updates };
  }

  public clearLocalEvents(): void {
    this.events = [];
  }

  public getEventCount(): number {
    return this.events.length;
  }
}
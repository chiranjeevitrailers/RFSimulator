// Database Service - Integrates database with the application
class DatabaseService {
  constructor() {
    this.dbManager = null;
    this.isInitialized = false;
    this.batchSize = 100;
    this.batchBuffer = new Map();
    this.flushInterval = null;
  }

  async initialize() {
    try {
      if (typeof require !== 'undefined') {
        const DatabaseManager = require('./DatabaseManager');
        this.dbManager = new DatabaseManager();
        await this.dbManager.initialize();
        this.isInitialized = true;
        
        // Start batch processing
        this.startBatchProcessing();
        
        console.log('Database service initialized successfully');
      } else {
        console.log('Database service not available in browser environment');
      }
    } catch (error) {
      console.error('Database service initialization error:', error);
      // Continue without database in case of error
      this.isInitialized = false;
    }
  }

  startBatchProcessing() {
    // Flush batches every 5 seconds
    this.flushInterval = setInterval(() => {
      this.flushBatches();
    }, 5000);
  }

  async flushBatches() {
    if (!this.isInitialized) return;

    try {
      for (const [table, batch] of this.batchBuffer) {
        if (batch.length > 0) {
          await this.flushBatch(table, batch);
          batch.length = 0; // Clear the batch
        }
      }
    } catch (error) {
      console.error('Error flushing batches:', error);
    }
  }

  async flushBatch(table, batch) {
    if (!this.isInitialized || batch.length === 0) return;

    try {
      switch (table) {
        case 'log_entries':
          await this.batchInsertLogEntries(batch);
          break;
        case 'health_metrics':
          await this.batchInsertHealthMetrics(batch);
          break;
        case 'performance_metrics':
          await this.batchInsertPerformanceMetrics(batch);
          break;
        case 'system_events':
          await this.batchInsertSystemEvents(batch);
          break;
      }
    } catch (error) {
      console.error(`Error flushing ${table} batch:`, error);
    }
  }

  async batchInsertLogEntries(entries) {
    if (!this.isInitialized) return;

    const sql = `
      INSERT INTO log_entries 
      (timestamp, source, level, component, message, layer, message_type, rnti, ue_id, fields, raw_data)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    for (const entry of entries) {
      const params = [
        entry.timestamp,
        entry.source,
        entry.level,
        entry.component,
        entry.message,
        entry.layer,
        entry.messageType,
        entry.rnti,
        entry.ueId,
        JSON.stringify(entry.fields),
        entry.rawData
      ];
      await this.dbManager.runQuery(sql, params);
    }
  }

  async batchInsertHealthMetrics(metrics) {
    if (!this.isInitialized) return;

    const sql = `
      INSERT INTO health_metrics (process_type, metric_name, metric_value, timestamp)
      VALUES (?, ?, ?, ?)
    `;

    for (const metric of metrics) {
      await this.dbManager.runQuery(sql, [
        metric.processType,
        metric.metricName,
        metric.metricValue,
        metric.timestamp
      ]);
    }
  }

  async batchInsertPerformanceMetrics(metrics) {
    if (!this.isInitialized) return;

    const sql = `
      INSERT INTO performance_metrics 
      (process_type, metric_type, value, unit, timestamp, metadata)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    for (const metric of metrics) {
      await this.dbManager.runQuery(sql, [
        metric.processType,
        metric.metricType,
        metric.value,
        metric.unit,
        metric.timestamp,
        metric.metadata ? JSON.stringify(metric.metadata) : null
      ]);
    }
  }

  async batchInsertSystemEvents(events) {
    if (!this.isInitialized) return;

    const sql = `
      INSERT INTO system_events (event_type, event_data, severity, source, timestamp)
      VALUES (?, ?, ?, ?, ?)
    `;

    for (const event of events) {
      await this.dbManager.runQuery(sql, [
        event.eventType,
        JSON.stringify(event.eventData),
        event.severity,
        event.source,
        event.timestamp
      ]);
    }
  }

  // Public API methods
  async saveLogEntry(logEntry) {
    if (!this.isInitialized) {
      // Store in memory buffer if database not available
      this.addToBuffer('log_entries', logEntry);
      return;
    }

    try {
      // Add to batch buffer
      this.addToBuffer('log_entries', logEntry);
      
      // Flush immediately if batch is full
      const batch = this.batchBuffer.get('log_entries') || [];
      if (batch.length >= this.batchSize) {
        await this.flushBatch('log_entries', batch);
        batch.length = 0;
      }
    } catch (error) {
      console.error('Error saving log entry:', error);
    }
  }

  async saveProcessStatus(processType, status, pid = null, config = null, errorMessage = null) {
    if (!this.isInitialized) return;

    try {
      await this.dbManager.saveProcessStatus(processType, status, pid, config, errorMessage);
    } catch (error) {
      console.error('Error saving process status:', error);
    }
  }

  async saveHealthMetrics(processType, metrics) {
    if (!this.isInitialized) {
      // Store in memory buffer
      const timestamp = new Date().toISOString();
      const metricEntries = Object.entries(metrics).map(([name, value]) => ({
        processType,
        metricName: name,
        metricValue: value,
        timestamp
      }));
      
      this.addToBuffer('health_metrics', ...metricEntries);
      return;
    }

    try {
      await this.dbManager.saveHealthMetrics(processType, metrics);
    } catch (error) {
      console.error('Error saving health metrics:', error);
    }
  }

  async savePerformanceMetrics(processType, metrics) {
    if (!this.isInitialized) {
      // Store in memory buffer
      const timestamp = new Date().toISOString();
      const metricEntries = Object.entries(metrics).map(([type, data]) => ({
        processType,
        metricType: type,
        value: data.value,
        unit: data.unit,
        timestamp,
        metadata: data.metadata
      }));
      
      this.addToBuffer('performance_metrics', ...metricEntries);
      return;
    }

    try {
      await this.dbManager.savePerformanceMetrics(processType, metrics);
    } catch (error) {
      console.error('Error saving performance metrics:', error);
    }
  }

  async saveSystemEvent(eventType, eventData, severity = 'info', source = null) {
    if (!this.isInitialized) {
      // Store in memory buffer
      this.addToBuffer('system_events', {
        eventType,
        eventData,
        severity,
        source,
        timestamp: new Date().toISOString()
      });
      return;
    }

    try {
      await this.dbManager.saveSystemEvent(eventType, eventData, severity, source);
    } catch (error) {
      console.error('Error saving system event:', error);
    }
  }

  async saveConfiguration(processType, config, userId = null, changeReason = null) {
    if (!this.isInitialized) return;

    try {
      await this.dbManager.saveConfiguration(processType, config, userId, changeReason);
    } catch (error) {
      console.error('Error saving configuration:', error);
    }
  }

  async getLogEntries(filters = {}, limit = 1000, offset = 0) {
    if (!this.isInitialized) {
      return []; // Return empty array if database not available
    }

    try {
      return await this.dbManager.getLogEntries(filters, limit, offset);
    } catch (error) {
      console.error('Error getting log entries:', error);
      return [];
    }
  }

  async getProcessStatusHistory(processType, limit = 100) {
    if (!this.isInitialized) {
      return [];
    }

    try {
      return await this.dbManager.getProcessStatusHistory(processType, limit);
    } catch (error) {
      console.error('Error getting process status history:', error);
      return [];
    }
  }

  async getHealthMetrics(processType, startTime, endTime) {
    if (!this.isInitialized) {
      return [];
    }

    try {
      return await this.dbManager.getHealthMetrics(processType, startTime, endTime);
    } catch (error) {
      console.error('Error getting health metrics:', error);
      return [];
    }
  }

  async getPerformanceMetrics(processType, metricType, startTime, endTime) {
    if (!this.isInitialized) {
      return [];
    }

    try {
      return await this.dbManager.getPerformanceMetrics(processType, metricType, startTime, endTime);
    } catch (error) {
      console.error('Error getting performance metrics:', error);
      return [];
    }
  }

  async getConfigurationHistory(processType, limit = 50) {
    if (!this.isInitialized) {
      return [];
    }

    try {
      return await this.dbManager.getConfigurationHistory(processType, limit);
    } catch (error) {
      console.error('Error getting configuration history:', error);
      return [];
    }
  }

  async getDatabaseStats() {
    if (!this.isInitialized) {
      return { status: 'not_available' };
    }

    try {
      return await this.dbManager.getDatabaseStats();
    } catch (error) {
      console.error('Error getting database stats:', error);
      return { status: 'error', error: error.message };
    }
  }

  // Utility methods
  addToBuffer(table, ...items) {
    if (!this.batchBuffer.has(table)) {
      this.batchBuffer.set(table, []);
    }
    this.batchBuffer.get(table).push(...items);
  }

  async close() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    
    // Flush remaining batches
    await this.flushBatches();
    
    if (this.dbManager) {
      await this.dbManager.close();
    }
  }

  isAvailable() {
    return this.isInitialized;
  }
}

// Create global instance
window.DatabaseService = new DatabaseService();

// Initialize when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.DatabaseService.initialize();
  });
}
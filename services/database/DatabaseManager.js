// Database Manager - Handles data persistence and retrieval
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class DatabaseManager {
  constructor() {
    this.db = null;
    this.isConnected = false;
    this.dbPath = path.join(__dirname, '../../data/5glabx.db');
    this.retentionDays = 30; // Keep data for 30 days
  }

  async initialize() {
    try {
      // Ensure data directory exists
      const dataDir = path.dirname(this.dbPath);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      // Connect to database
      this.db = new sqlite3.Database(this.dbPath);
      this.isConnected = true;

      // Create tables
      await this.createTables();
      
      // Set up cleanup job
      this.setupCleanupJob();

      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  async createTables() {
    const tables = [
      // Log entries table
      `CREATE TABLE IF NOT EXISTS log_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME NOT NULL,
        source TEXT NOT NULL,
        level TEXT NOT NULL,
        component TEXT,
        message TEXT NOT NULL,
        layer TEXT,
        message_type TEXT,
        rnti TEXT,
        ue_id TEXT,
        fields TEXT, -- JSON string
        raw_data TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Process status table
      `CREATE TABLE IF NOT EXISTS process_status (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        process_type TEXT NOT NULL,
        pid INTEGER,
        status TEXT NOT NULL,
        start_time DATETIME,
        stop_time DATETIME,
        config TEXT, -- JSON string
        error_message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Health metrics table
      `CREATE TABLE IF NOT EXISTS health_metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        process_type TEXT NOT NULL,
        metric_name TEXT NOT NULL,
        metric_value REAL NOT NULL,
        timestamp DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Configuration history table
      `CREATE TABLE IF NOT EXISTS config_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        process_type TEXT NOT NULL,
        config_data TEXT NOT NULL, -- JSON string
        config_hash TEXT NOT NULL,
        user_id TEXT,
        change_reason TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // System events table
      `CREATE TABLE IF NOT EXISTS system_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_type TEXT NOT NULL,
        event_data TEXT, -- JSON string
        severity TEXT NOT NULL,
        source TEXT,
        timestamp DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Performance metrics table
      `CREATE TABLE IF NOT EXISTS performance_metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        process_type TEXT NOT NULL,
        metric_type TEXT NOT NULL,
        value REAL NOT NULL,
        unit TEXT,
        timestamp DATETIME NOT NULL,
        metadata TEXT, -- JSON string
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    for (const table of tables) {
      await this.runQuery(table);
    }

    // Create indexes for better performance
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_log_entries_timestamp ON log_entries(timestamp)',
      'CREATE INDEX IF NOT EXISTS idx_log_entries_source ON log_entries(source)',
      'CREATE INDEX IF NOT EXISTS idx_log_entries_level ON log_entries(level)',
      'CREATE INDEX IF NOT EXISTS idx_health_metrics_timestamp ON health_metrics(timestamp)',
      'CREATE INDEX IF NOT EXISTS idx_performance_metrics_timestamp ON performance_metrics(timestamp)',
      'CREATE INDEX IF NOT EXISTS idx_system_events_timestamp ON system_events(timestamp)'
    ];

    for (const index of indexes) {
      await this.runQuery(index);
    }
  }

  async runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  async getQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async getAllQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Log entry operations
  async saveLogEntry(logEntry) {
    try {
      const sql = `
        INSERT INTO log_entries 
        (timestamp, source, level, component, message, layer, message_type, rnti, ue_id, fields, raw_data)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const params = [
        logEntry.timestamp,
        logEntry.source,
        logEntry.level,
        logEntry.component,
        logEntry.message,
        logEntry.layer,
        logEntry.messageType,
        logEntry.rnti,
        logEntry.ueId,
        JSON.stringify(logEntry.fields),
        logEntry.rawData
      ];

      return await this.runQuery(sql, params);
    } catch (error) {
      console.error('Error saving log entry:', error);
      throw error;
    }
  }

  async getLogEntries(filters = {}, limit = 1000, offset = 0) {
    try {
      let sql = 'SELECT * FROM log_entries WHERE 1=1';
      const params = [];

      if (filters.source) {
        sql += ' AND source = ?';
        params.push(filters.source);
      }

      if (filters.level) {
        sql += ' AND level = ?';
        params.push(filters.level);
      }

      if (filters.startTime) {
        sql += ' AND timestamp >= ?';
        params.push(filters.startTime);
      }

      if (filters.endTime) {
        sql += ' AND timestamp <= ?';
        params.push(filters.endTime);
      }

      if (filters.component) {
        sql += ' AND component = ?';
        params.push(filters.component);
      }

      sql += ' ORDER BY timestamp DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const rows = await this.getAllQuery(sql, params);
      
      // Parse JSON fields
      return rows.map(row => ({
        ...row,
        fields: row.fields ? JSON.parse(row.fields) : {}
      }));
    } catch (error) {
      console.error('Error getting log entries:', error);
      throw error;
    }
  }

  // Process status operations
  async saveProcessStatus(processType, status, pid = null, config = null, errorMessage = null) {
    try {
      const sql = `
        INSERT INTO process_status 
        (process_type, pid, status, start_time, stop_time, config, error_message)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      
      const now = new Date().toISOString();
      const params = [
        processType,
        pid,
        status,
        status === 'running' ? now : null,
        status === 'stopped' ? now : null,
        config ? JSON.stringify(config) : null,
        errorMessage
      ];

      return await this.runQuery(sql, params);
    } catch (error) {
      console.error('Error saving process status:', error);
      throw error;
    }
  }

  async getProcessStatusHistory(processType, limit = 100) {
    try {
      const sql = `
        SELECT * FROM process_status 
        WHERE process_type = ? 
        ORDER BY created_at DESC 
        LIMIT ?
      `;
      
      const rows = await this.getAllQuery(sql, [processType, limit]);
      
      return rows.map(row => ({
        ...row,
        config: row.config ? JSON.parse(row.config) : null
      }));
    } catch (error) {
      console.error('Error getting process status history:', error);
      throw error;
    }
  }

  // Health metrics operations
  async saveHealthMetrics(processType, metrics) {
    try {
      const timestamp = new Date().toISOString();
      const sql = `
        INSERT INTO health_metrics (process_type, metric_name, metric_value, timestamp)
        VALUES (?, ?, ?, ?)
      `;

      const promises = Object.entries(metrics).map(([name, value]) => {
        return this.runQuery(sql, [processType, name, value, timestamp]);
      });

      await Promise.all(promises);
    } catch (error) {
      console.error('Error saving health metrics:', error);
      throw error;
    }
  }

  async getHealthMetrics(processType, startTime, endTime) {
    try {
      const sql = `
        SELECT * FROM health_metrics 
        WHERE process_type = ? AND timestamp BETWEEN ? AND ?
        ORDER BY timestamp ASC
      `;
      
      return await this.getAllQuery(sql, [processType, startTime, endTime]);
    } catch (error) {
      console.error('Error getting health metrics:', error);
      throw error;
    }
  }

  // Configuration operations
  async saveConfiguration(processType, config, userId = null, changeReason = null) {
    try {
      const configHash = this.generateConfigHash(config);
      const sql = `
        INSERT INTO config_history 
        (process_type, config_data, config_hash, user_id, change_reason)
        VALUES (?, ?, ?, ?, ?)
      `;
      
      const params = [
        processType,
        JSON.stringify(config),
        configHash,
        userId,
        changeReason
      ];

      return await this.runQuery(sql, params);
    } catch (error) {
      console.error('Error saving configuration:', error);
      throw error;
    }
  }

  async getConfigurationHistory(processType, limit = 50) {
    try {
      const sql = `
        SELECT * FROM config_history 
        WHERE process_type = ? 
        ORDER BY created_at DESC 
        LIMIT ?
      `;
      
      const rows = await this.getAllQuery(sql, [processType, limit]);
      
      return rows.map(row => ({
        ...row,
        config_data: JSON.parse(row.config_data)
      }));
    } catch (error) {
      console.error('Error getting configuration history:', error);
      throw error;
    }
  }

  // System events operations
  async saveSystemEvent(eventType, eventData, severity = 'info', source = null) {
    try {
      const sql = `
        INSERT INTO system_events (event_type, event_data, severity, source, timestamp)
        VALUES (?, ?, ?, ?, ?)
      `;
      
      const params = [
        eventType,
        JSON.stringify(eventData),
        severity,
        source,
        new Date().toISOString()
      ];

      return await this.runQuery(sql, params);
    } catch (error) {
      console.error('Error saving system event:', error);
      throw error;
    }
  }

  // Performance metrics operations
  async savePerformanceMetrics(processType, metrics) {
    try {
      const timestamp = new Date().toISOString();
      const sql = `
        INSERT INTO performance_metrics 
        (process_type, metric_type, value, unit, timestamp, metadata)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      const promises = Object.entries(metrics).map(([type, data]) => {
        return this.runQuery(sql, [
          processType,
          type,
          data.value,
          data.unit || null,
          timestamp,
          data.metadata ? JSON.stringify(data.metadata) : null
        ]);
      });

      await Promise.all(promises);
    } catch (error) {
      console.error('Error saving performance metrics:', error);
      throw error;
    }
  }

  async getPerformanceMetrics(processType, metricType, startTime, endTime) {
    try {
      const sql = `
        SELECT * FROM performance_metrics 
        WHERE process_type = ? AND metric_type = ? AND timestamp BETWEEN ? AND ?
        ORDER BY timestamp ASC
      `;
      
      const rows = await this.getAllQuery(sql, [processType, metricType, startTime, endTime]);
      
      return rows.map(row => ({
        ...row,
        metadata: row.metadata ? JSON.parse(row.metadata) : null
      }));
    } catch (error) {
      console.error('Error getting performance metrics:', error);
      throw error;
    }
  }

  // Utility methods
  generateConfigHash(config) {
    const crypto = require('crypto');
    return crypto.createHash('md5').update(JSON.stringify(config)).digest('hex');
  }

  setupCleanupJob() {
    // Run cleanup every 24 hours
    setInterval(() => {
      this.cleanupOldData();
    }, 24 * 60 * 60 * 1000);
  }

  async cleanupOldData() {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.retentionDays);
      const cutoffString = cutoffDate.toISOString();

      const cleanupQueries = [
        'DELETE FROM log_entries WHERE timestamp < ?',
        'DELETE FROM health_metrics WHERE timestamp < ?',
        'DELETE FROM performance_metrics WHERE timestamp < ?',
        'DELETE FROM system_events WHERE timestamp < ?'
      ];

      for (const query of cleanupQueries) {
        const result = await this.runQuery(query, [cutoffString]);
        console.log(`Cleaned up ${result.changes} old records`);
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }

  async getDatabaseStats() {
    try {
      const stats = {};
      
      const tables = ['log_entries', 'process_status', 'health_metrics', 'config_history', 'system_events', 'performance_metrics'];
      
      for (const table of tables) {
        const result = await this.getQuery(`SELECT COUNT(*) as count FROM ${table}`);
        stats[table] = result.count;
      }

      // Get database size
      const dbSize = await this.getQuery(`SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size()`);
      stats.database_size = dbSize.size;

      return stats;
    } catch (error) {
      console.error('Error getting database stats:', error);
      throw error;
    }
  }

  async close() {
    if (this.db) {
      return new Promise((resolve) => {
        this.db.close((err) => {
          if (err) {
            console.error('Error closing database:', err);
          } else {
            console.log('Database connection closed');
          }
          this.isConnected = false;
          resolve();
        });
      });
    }
  }
}

module.exports = DatabaseManager;
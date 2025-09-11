// LogEntry Model - Represents a structured log entry
class LogEntry {
  constructor(data = {}) {
    this.id = data.id || Date.now() + Math.random();
    this.timestamp = data.timestamp || new Date().toISOString();
    this.source = data.source || 'unknown';
    this.level = data.level || 'info';
    this.component = data.component || 'UNKNOWN';
    this.message = data.message || '';
    this.layer = data.layer || 'OTHER';
    this.messageType = data.messageType || 'GENERIC';
    this.rnti = data.rnti || null;
    this.ueId = data.ueId || null;
    this.fields = data.fields || {};
  }

  toJSON() {
    return {
      id: this.id,
      timestamp: this.timestamp,
      source: this.source,
      level: this.level,
      component: this.component,
      message: this.message,
      layer: this.layer,
      messageType: this.messageType,
      rnti: this.rnti,
      ueId: this.ueId,
      fields: this.fields
    };
  }

  static fromJSON(json) {
    return new LogEntry(json);
  }
}

window.LogEntry = LogEntry;
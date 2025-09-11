// OranModels - Data models for O-RAN entities
window.OranModels = {
  // O-RAN Node Model
  OranNode: class {
    constructor(data = {}) {
      try {
        this.id = data.id || window.HELPERS.generateId();
        this.type = data.type || 'unknown'; // cu-cp, cu-up, du, ru
        this.name = data.name || `${this.type}-${this.id}`;
        this.status = data.status || 'offline';
        this.ipAddress = data.ipAddress || '127.0.0.1';
        this.capabilities = data.capabilities || [];
        this.metrics = data.metrics || {};
        this.createdAt = data.createdAt || new Date().toISOString();
      } catch (error) {
        console.error('OranNode constructor error:', error);
        reportError(error);
      }
    }

    updateStatus(status) {
      try {
        this.status = status;
        this.lastUpdate = new Date().toISOString();
      } catch (error) {
        console.error('OranNode update status error:', error);
      }
    }

    updateMetrics(metrics) {
      try {
        this.metrics = { ...this.metrics, ...metrics };
        this.lastMetricsUpdate = new Date().toISOString();
      } catch (error) {
        console.error('OranNode update metrics error:', error);
      }
    }
  },

  // O-RAN Interface Model
  OranInterface: class {
    constructor(data = {}) {
      try {
        this.id = data.id || window.HELPERS.generateId();
        this.type = data.type || 'unknown'; // f1-c, f1-u, e1, o1, a1
        this.sourceNode = data.sourceNode || null;
        this.targetNode = data.targetNode || null;
        this.status = data.status || 'down';
        this.metrics = data.metrics || {};
        this.createdAt = data.createdAt || new Date().toISOString();
      } catch (error) {
        console.error('OranInterface constructor error:', error);
        reportError(error);
      }
    }

    updateMetrics(metrics) {
      try {
        this.metrics = { ...this.metrics, ...metrics };
        this.lastUpdate = new Date().toISOString();
      } catch (error) {
        console.error('OranInterface update metrics error:', error);
      }
    }
  },

  // O-RAN Message Model
  OranMessage: class {
    constructor(data = {}) {
      try {
        this.id = data.id || window.HELPERS.generateId();
        this.timestamp = data.timestamp || new Date().toISOString();
        this.interface = data.interface || 'unknown';
        this.messageType = data.messageType || 'unknown';
        this.source = data.source || null;
        this.destination = data.destination || null;
        this.payload = data.payload || {};
        this.result = data.result || 'unknown';
        this.latency = data.latency || 0;
      } catch (error) {
        console.error('OranMessage constructor error:', error);
        reportError(error);
      }
    }

    isSuccessful() {
      try {
        return this.result === 'success' || this.result === 'Success';
      } catch (error) {
        return false;
      }
    }
  }
};

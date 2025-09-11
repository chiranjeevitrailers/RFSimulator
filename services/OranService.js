// OranService - Core O-RAN functionality
class OranService {
  constructor() {
    try {
      this.nodes = new Map();
      this.interfaces = new Map();
      this.messages = [];
      this.metrics = {};
      this.callbacks = [];
      this.isMonitoring = false;
    } catch (error) {
      console.error('OranService constructor error:', error);
      reportError(error);
    }
  }

  // Node Management
  addNode(nodeData) {
    try {
      const node = new window.OranModels.OranNode(nodeData);
      this.nodes.set(node.id, node);
      this.notifyCallbacks('node_added', node);
      return node;
    } catch (error) {
      console.error('OranService add node error:', error);
      reportError(error);
      return null;
    }
  }

  updateNode(nodeId, updates) {
    try {
      const node = this.nodes.get(nodeId);
      if (node) {
        Object.assign(node, updates);
        this.notifyCallbacks('node_updated', node);
        return node;
      }
      return null;
    } catch (error) {
      console.error('OranService update node error:', error);
      reportError(error);
      return null;
    }
  }

  // Interface Management
  addInterface(interfaceData) {
    try {
      const intf = new window.OranModels.OranInterface(interfaceData);
      this.interfaces.set(intf.id, intf);
      this.notifyCallbacks('interface_added', intf);
      return intf;
    } catch (error) {
      console.error('OranService add interface error:', error);
      reportError(error);
      return null;
    }
  }

  updateInterface(interfaceId, updates) {
    try {
      const intf = this.interfaces.get(interfaceId);
      if (intf) {
        Object.assign(intf, updates);
        this.notifyCallbacks('interface_updated', intf);
        return intf;
      }
      return null;
    } catch (error) {
      console.error('OranService update interface error:', error);
      reportError(error);
      return null;
    }
  }

  // Message Processing
  processMessage(messageData) {
    try {
      const message = new window.OranModels.OranMessage(messageData);
      this.messages.push(message);
      
      // Keep last 1000 messages
      if (this.messages.length > 1000) {
        this.messages.shift();
      }
      
      this.notifyCallbacks('message_received', message);
      return message;
    } catch (error) {
      console.error('OranService process message error:', error);
      reportError(error);
      return null;
    }
  }

  // Metrics Management
  updateMetrics(metricsData) {
    try {
      this.metrics = { ...this.metrics, ...metricsData };
      this.notifyCallbacks('metrics_updated', this.metrics);
    } catch (error) {
      console.error('OranService update metrics error:', error);
      reportError(error);
    }
  }

  // Subscription Management
  subscribe(callback) {
    try {
      this.callbacks.push(callback);
      return () => {
        const index = this.callbacks.indexOf(callback);
        if (index > -1) {
          this.callbacks.splice(index, 1);
        }
      };
    } catch (error) {
      console.error('OranService subscribe error:', error);
      reportError(error);
      return () => {};
    }
  }

  notifyCallbacks(event, data) {
    try {
      this.callbacks.forEach(callback => {
        try {
          callback(event, data);
        } catch (error) {
          console.error('OranService callback error:', error);
        }
      });
    } catch (error) {
      console.error('OranService notify callbacks error:', error);
      reportError(error);
    }
  }
}

// Export OranService
window.OranService = OranService;

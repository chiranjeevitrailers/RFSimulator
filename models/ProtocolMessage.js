// ProtocolMessage Data Model
class ProtocolMessage {
  constructor(data = {}) {
    try {
      this.id = data.id || window.HELPERS.generateId();
      this.timestamp = data.timestamp || new Date().toISOString();
      this.source = data.source || 'unknown';
      this.destination = data.destination || 'unknown';
      this.layer = data.layer || 'unknown';
      this.messageType = data.messageType || 'unknown';
      this.direction = data.direction || 'unknown'; // uplink/downlink
      this.payload = data.payload || {};
      this.size = data.size || 0;
      this.sequence = data.sequence || 0;
      this.correlationId = data.correlationId || null;
      this.callFlowId = data.callFlowId || null;
    } catch (error) {
      console.error('ProtocolMessage constructor error:', error);
      reportError(error);
    }
  }

  // Validate protocol message
  isValid() {
    try {
      return !!(this.timestamp && this.layer && this.messageType);
    } catch (error) {
      console.error('ProtocolMessage validation error:', error);
      return false;
    }
  }

  // Get protocol layer color
  getLayerColor() {
    try {
      const colorMap = {
        'phy': 'purple',
        'mac': 'blue',
        'rlc': 'green',
        'pdcp': 'yellow',
        'rrc': 'red',
        'nas': 'indigo',
        'sip': 'pink',
        'gtp': 'orange'
      };
      return colorMap[this.layer.toLowerCase()] || 'gray';
    } catch (error) {
      console.error('ProtocolMessage layer color error:', error);
      return 'gray';
    }
  }

  // Convert to display format
  toDisplayFormat() {
    try {
      return {
        id: this.id,
        timestamp: window.HELPERS.formatTimestamp(this.timestamp),
        layer: this.layer.toUpperCase(),
        messageType: this.messageType,
        direction: this.direction,
        size: window.HELPERS.formatFileSize(this.size),
        source: this.source,
        destination: this.destination,
        color: this.getLayerColor()
      };
    } catch (error) {
      console.error('ProtocolMessage display format error:', error);
      reportError(error);
      return null;
    }
  }

  // Extract message summary
  getSummary() {
    try {
      return `${this.layer.toUpperCase()}: ${this.messageType} (${this.direction})`;
    } catch (error) {
      console.error('ProtocolMessage summary error:', error);
      return 'Unknown Message';
    }
  }

  // Check if message is control plane
  isControlPlane() {
    try {
      const controlLayers = ['rrc', 'nas', 'sip'];
      return controlLayers.includes(this.layer.toLowerCase());
    } catch (error) {
      console.error('ProtocolMessage control plane check error:', error);
      return false;
    }
  }

  // Check if message is user plane
  isUserPlane() {
    try {
      const userLayers = ['phy', 'mac', 'rlc', 'pdcp', 'gtp'];
      return userLayers.includes(this.layer.toLowerCase());
    } catch (error) {
      console.error('ProtocolMessage user plane check error:', error);
      return false;
    }
  }
}

// Export ProtocolMessage class
window.ProtocolMessage = ProtocolMessage;

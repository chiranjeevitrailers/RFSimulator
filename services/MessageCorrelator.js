// MessageCorrelator - Cross-system message correlation service
class MessageCorrelator {
  constructor() {
    try {
      this.correlationMap = new Map();
      this.timeWindow = 5000; // 5 seconds correlation window
      this.maxCorrelations = 1000;
      this.cleanupInterval = 30000; // 30 seconds cleanup
      this.startCleanupTimer();
    } catch (error) {
      console.error('MessageCorrelator constructor error:', error);
      reportError(error);
    }
  }

  // Correlate protocol message
  correlateMessage(protocolMessage) {
    try {
      const correlationKey = this.generateCorrelationKey(protocolMessage);
      if (!correlationKey) return null;
      
      const existingCorrelation = this.correlationMap.get(correlationKey);
      const now = Date.now();
      
      if (existingCorrelation) {
        // Add to existing correlation
        existingCorrelation.messages.push(protocolMessage);
        existingCorrelation.lastUpdate = now;
        return existingCorrelation;
      } else {
        // Create new correlation
        const correlation = {
          id: window.HELPERS.generateId(),
          key: correlationKey,
          messages: [protocolMessage],
          startTime: now,
          lastUpdate: now,
          systems: [protocolMessage.source]
        };
        
        this.correlationMap.set(correlationKey, correlation);
        return correlation;
      }
    } catch (error) {
      console.error('MessageCorrelator correlate message error:', error);
      reportError(error);
      return null;
    }
  }

  // Generate correlation key from protocol message
  generateCorrelationKey(protocolMessage) {
    try {
      // Use different correlation strategies based on layer
      switch (protocolMessage.layer) {
        case 'rrc':
          return this.extractRrcCorrelationKey(protocolMessage);
        case 'nas':
          return this.extractNasCorrelationKey(protocolMessage);
        case 'sip':
          return this.extractSipCorrelationKey(protocolMessage);
        case 'gtp':
          return this.extractGtpCorrelationKey(protocolMessage);
        default:
          return this.extractGenericCorrelationKey(protocolMessage);
      }
    } catch (error) {
      console.error('MessageCorrelator generate correlation key error:', error);
      return null;
    }
  }

  // Extract RRC correlation key
  extractRrcCorrelationKey(protocolMessage) {
    try {
      // Look for UE identifier in payload
      if (protocolMessage.payload && protocolMessage.payload.ueId) {
        return `rrc_${protocolMessage.payload.ueId}`;
      }
      return null;
    } catch (error) {
      console.error('MessageCorrelator extract RRC correlation key error:', error);
      return null;
    }
  }

  // Extract NAS correlation key
  extractNasCorrelationKey(protocolMessage) {
    try {
      // Look for IMSI or TMSI in payload
      if (protocolMessage.payload) {
        if (protocolMessage.payload.imsi) {
          return `nas_${protocolMessage.payload.imsi}`;
        }
        if (protocolMessage.payload.tmsi) {
          return `nas_${protocolMessage.payload.tmsi}`;
        }
      }
      return null;
    } catch (error) {
      console.error('MessageCorrelator extract NAS correlation key error:', error);
      return null;
    }
  }

  // Extract SIP correlation key
  extractSipCorrelationKey(protocolMessage) {
    try {
      // Look for Call-ID in payload
      if (protocolMessage.payload && protocolMessage.payload.callId) {
        return `sip_${protocolMessage.payload.callId}`;
      }
      return null;
    } catch (error) {
      console.error('MessageCorrelator extract SIP correlation key error:', error);
      return null;
    }
  }

  // Extract GTP correlation key
  extractGtpCorrelationKey(protocolMessage) {
    try {
      // Look for TEID in payload
      if (protocolMessage.payload && protocolMessage.payload.teid) {
        return `gtp_${protocolMessage.payload.teid}`;
      }
      return null;
    } catch (error) {
      console.error('MessageCorrelator extract GTP correlation key error:', error);
      return null;
    }
  }

  // Extract generic correlation key
  extractGenericCorrelationKey(protocolMessage) {
    try {
      // Use timestamp-based correlation for generic messages
      const timeSlot = Math.floor(Date.now() / 1000) * 1000; // 1-second slots
      return `generic_${protocolMessage.layer}_${timeSlot}`;
    } catch (error) {
      console.error('MessageCorrelator extract generic correlation key error:', error);
      return null;
    }
  }

  // Get correlation by ID
  getCorrelation(correlationId) {
    try {
      for (const correlation of this.correlationMap.values()) {
        if (correlation.id === correlationId) {
          return correlation;
        }
      }
      return null;
    } catch (error) {
      console.error('MessageCorrelator get correlation error:', error);
      return null;
    }
  }

  // Get all active correlations
  getActiveCorrelations() {
    try {
      return Array.from(this.correlationMap.values());
    } catch (error) {
      console.error('MessageCorrelator get active correlations error:', error);
      return [];
    }
  }

  // Start cleanup timer
  startCleanupTimer() {
    try {
      setInterval(() => {
        this.cleanup();
      }, this.cleanupInterval);
    } catch (error) {
      console.error('MessageCorrelator start cleanup timer error:', error);
      reportError(error);
    }
  }

  // Cleanup old correlations
  cleanup() {
    try {
      const now = Date.now();
      const keysToDelete = [];
      
      for (const [key, correlation] of this.correlationMap.entries()) {
        if (now - correlation.lastUpdate > this.timeWindow) {
          keysToDelete.push(key);
        }
      }
      
      keysToDelete.forEach(key => {
        this.correlationMap.delete(key);
      });
      
      // Limit total correlations
      if (this.correlationMap.size > this.maxCorrelations) {
        const excess = this.correlationMap.size - this.maxCorrelations;
        const oldestKeys = Array.from(this.correlationMap.keys()).slice(0, excess);
        oldestKeys.forEach(key => {
          this.correlationMap.delete(key);
        });
      }
    } catch (error) {
      console.error('MessageCorrelator cleanup error:', error);
      reportError(error);
    }
  }
}

// Export MessageCorrelator
// Export for ES6 modules
export default MessageCorrelator;
export { MessageCorrelator };

// Also make available globally for backward compatibility
window.MessageCorrelator = MessageCorrelator;

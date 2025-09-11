// RrcMessageExtractor - RRC message extraction service
class RrcMessageExtractor {
  constructor() {
    try {
      this.rrcMessages = [
        'RRC_SETUP', 'RRC_SETUP_COMPLETE', 'RRC_SETUP_REQUEST',
        'RRC_RECONFIGURATION', 'RRC_RECONFIGURATION_COMPLETE',
        'RRC_RELEASE', 'RRC_RESUME', 'RRC_SUSPEND',
        'MEASUREMENT_REPORT', 'HANDOVER_COMMAND', 'HANDOVER_COMPLETE'
      ];
      this.rrcStates = ['IDLE', 'CONNECTED', 'INACTIVE'];
    } catch (error) {
      console.error('RrcMessageExtractor constructor error:', error);
      reportError(error);
    }
  }

  // Extract RRC message from log entry
  extractFromLogEntry(logEntry) {
    try {
      if (logEntry.source !== 'srsran' || logEntry.component !== 'RRC') {
        return null;
      }
      
      const message = logEntry.message;
      const rrcMessage = this.identifyRrcMessage(message);
      
      if (!rrcMessage) return null;
      
      return new ProtocolMessage({
        timestamp: logEntry.timestamp,
        source: 'gnb',
        destination: 'ue',
        layer: 'rrc',
        messageType: rrcMessage,
        direction: this.extractDirection(message),
        payload: this.extractRrcPayload(message),
        correlationId: this.extractCorrelationId(message)
      });
    } catch (error) {
      console.error('RrcMessageExtractor extract from log entry error:', error);
      reportError(error);
      return null;
    }
  }

  // Identify RRC message type
  identifyRrcMessage(message) {
    try {
      const upperMessage = message.toUpperCase();
      
      for (const rrcMsg of this.rrcMessages) {
        if (upperMessage.includes(rrcMsg)) {
          return rrcMsg;
        }
      }
      
      return null;
    } catch (error) {
      console.error('RrcMessageExtractor identify RRC message error:', error);
      return null;
    }
  }

  // Extract direction from message
  extractDirection(message) {
    try {
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes('tx') || lowerMessage.includes('send')) {
        return 'downlink';
      }
      if (lowerMessage.includes('rx') || lowerMessage.includes('receive')) {
        return 'uplink';
      }
      
      return 'unknown';
    } catch (error) {
      console.error('RrcMessageExtractor extract direction error:', error);
      return 'unknown';
    }
  }

  // Extract RRC payload information
  extractRrcPayload(message) {
    try {
      const payload = {};
      
      // Extract UE identifier
      const ueIdMatch = message.match(/ue[_\s]*id[:\s]*(\w+)/i);
      if (ueIdMatch) payload.ueId = ueIdMatch[1];
      
      // Extract RNTI
      const rntiMatch = message.match(/rnti[:\s]*(\w+)/i);
      if (rntiMatch) payload.rnti = rntiMatch[1];
      
      // Extract Cell ID
      const cellIdMatch = message.match(/cell[_\s]*id[:\s]*(\d+)/i);
      if (cellIdMatch) payload.cellId = parseInt(cellIdMatch[1]);
      
      // Extract RRC State
      for (const state of this.rrcStates) {
        if (message.toUpperCase().includes(state)) {
          payload.rrcState = state;
          break;
        }
      }
      
      return payload;
    } catch (error) {
      console.error('RrcMessageExtractor extract RRC payload error:', error);
      return {};
    }
  }

  // Extract correlation ID
  extractCorrelationId(message) {
    try {
      // Use UE ID as correlation ID for RRC messages
      const ueIdMatch = message.match(/ue[_\s]*id[:\s]*(\w+)/i);
      if (ueIdMatch) {
        return `rrc_${ueIdMatch[1]}`;
      }
      
      // Use RNTI as fallback
      const rntiMatch = message.match(/rnti[:\s]*(\w+)/i);
      if (rntiMatch) {
        return `rrc_${rntiMatch[1]}`;
      }
      
      return null;
    } catch (error) {
      console.error('RrcMessageExtractor extract correlation ID error:', error);
      return null;
    }
  }

  // Get supported message types
  getSupportedMessageTypes() {
    try {
      return [...this.rrcMessages];
    } catch (error) {
      console.error('RrcMessageExtractor get supported message types error:', error);
      return [];
    }
  }
}

// Export RrcMessageExtractor
window.RrcMessageExtractor = RrcMessageExtractor;

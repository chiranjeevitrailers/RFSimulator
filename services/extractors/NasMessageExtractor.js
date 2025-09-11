// NasMessageExtractor - NAS message extraction service
class NasMessageExtractor {
  constructor() {
    try {
      this.nasMessages = [
        'REGISTRATION_REQUEST', 'REGISTRATION_ACCEPT', 'REGISTRATION_COMPLETE',
        'DEREGISTRATION_REQUEST', 'DEREGISTRATION_ACCEPT',
        'SERVICE_REQUEST', 'SERVICE_ACCEPT', 'SERVICE_REJECT',
        'PDU_SESSION_ESTABLISHMENT_REQUEST', 'PDU_SESSION_ESTABLISHMENT_ACCEPT',
        'PDU_SESSION_MODIFICATION_REQUEST', 'PDU_SESSION_RELEASE_REQUEST',
        'AUTHENTICATION_REQUEST', 'AUTHENTICATION_RESPONSE',
        'SECURITY_MODE_COMMAND', 'SECURITY_MODE_COMPLETE'
      ];
      this.nasStates = ['DEREGISTERED', 'REGISTERED', 'SERVICE_REQUEST'];
    } catch (error) {
      console.error('NasMessageExtractor constructor error:', error);
      reportError(error);
    }
  }

  // Extract NAS message from log entry
  extractFromLogEntry(logEntry) {
    try {
      if (logEntry.source !== 'open5gs' || !logEntry.layer || logEntry.layer !== 'nas') {
        return null;
      }
      
      const message = logEntry.message;
      const nasMessage = this.identifyNasMessage(message);
      
      if (!nasMessage) return null;
      
      return new ProtocolMessage({
        timestamp: logEntry.timestamp,
        source: 'amf',
        destination: 'ue',
        layer: 'nas',
        messageType: nasMessage,
        direction: this.extractDirection(message),
        payload: this.extractNasPayload(message),
        correlationId: this.extractCorrelationId(message)
      });
    } catch (error) {
      console.error('NasMessageExtractor extract from log entry error:', error);
      reportError(error);
      return null;
    }
  }

  // Identify NAS message type
  identifyNasMessage(message) {
    try {
      const upperMessage = message.toUpperCase().replace(/[-_\s]/g, '_');
      
      for (const nasMsg of this.nasMessages) {
        if (upperMessage.includes(nasMsg)) {
          return nasMsg;
        }
      }
      
      // Check for abbreviated forms
      if (upperMessage.includes('REG') && upperMessage.includes('REQ')) {
        return 'REGISTRATION_REQUEST';
      }
      if (upperMessage.includes('PDU') && upperMessage.includes('EST')) {
        return 'PDU_SESSION_ESTABLISHMENT_REQUEST';
      }
      if (upperMessage.includes('AUTH') && upperMessage.includes('REQ')) {
        return 'AUTHENTICATION_REQUEST';
      }
      
      return null;
    } catch (error) {
      console.error('NasMessageExtractor identify NAS message error:', error);
      return null;
    }
  }

  // Extract direction from message
  extractDirection(message) {
    try {
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes('from ue') || lowerMessage.includes('uplink')) {
        return 'uplink';
      }
      if (lowerMessage.includes('to ue') || lowerMessage.includes('downlink')) {
        return 'downlink';
      }
      
      // Infer from message type
      if (message.toUpperCase().includes('REQUEST')) {
        return 'uplink';
      }
      if (message.toUpperCase().includes('ACCEPT') || message.toUpperCase().includes('COMMAND')) {
        return 'downlink';
      }
      
      return 'unknown';
    } catch (error) {
      console.error('NasMessageExtractor extract direction error:', error);
      return 'unknown';
    }
  }

  // Extract NAS payload information
  extractNasPayload(message) {
    try {
      const payload = {};
      
      // Extract IMSI
      const imsiMatch = message.match(/imsi[:\s]*([0-9-]+)/i);
      if (imsiMatch) payload.imsi = imsiMatch[1];
      
      // Extract TMSI
      const tmsiMatch = message.match(/tmsi[:\s]*(\w+)/i);
      if (tmsiMatch) payload.tmsi = tmsiMatch[1];
      
      // Extract SUPI
      const supiMatch = message.match(/supi[:\s]*([0-9-]+)/i);
      if (supiMatch) payload.supi = supiMatch[1];
      
      // Extract 5G-GUTI
      const gutiMatch = message.match(/guti[:\s]*(\w+)/i);
      if (gutiMatch) payload.guti = gutiMatch[1];
      
      // Extract PDU Session ID
      const pduSessionMatch = message.match(/pdu[_\s]*session[_\s]*id[:\s]*(\d+)/i);
      if (pduSessionMatch) payload.pduSessionId = parseInt(pduSessionMatch[1]);
      
      // Extract NAS State
      for (const state of this.nasStates) {
        if (message.toUpperCase().includes(state)) {
          payload.nasState = state;
          break;
        }
      }
      
      return payload;
    } catch (error) {
      console.error('NasMessageExtractor extract NAS payload error:', error);
      return {};
    }
  }

  // Extract correlation ID
  extractCorrelationId(message) {
    try {
      // Use IMSI as primary correlation ID
      const imsiMatch = message.match(/imsi[:\s]*([0-9-]+)/i);
      if (imsiMatch) {
        return `nas_${imsiMatch[1]}`;
      }
      
      // Use SUPI as fallback
      const supiMatch = message.match(/supi[:\s]*([0-9-]+)/i);
      if (supiMatch) {
        return `nas_${supiMatch[1]}`;
      }
      
      // Use TMSI as last resort
      const tmsiMatch = message.match(/tmsi[:\s]*(\w+)/i);
      if (tmsiMatch) {
        return `nas_${tmsiMatch[1]}`;
      }
      
      return null;
    } catch (error) {
      console.error('NasMessageExtractor extract correlation ID error:', error);
      return null;
    }
  }

  // Get supported message types
  getSupportedMessageTypes() {
    try {
      return [...this.nasMessages];
    } catch (error) {
      console.error('NasMessageExtractor get supported message types error:', error);
      return [];
    }
  }
}

// Export NasMessageExtractor
window.NasMessageExtractor = NasMessageExtractor;

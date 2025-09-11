// GtpMessageExtractor - GTP message extraction service
class GtpMessageExtractor {
  constructor() {
    try {
      this.gtpMessages = [
        'CREATE_SESSION_REQUEST', 'CREATE_SESSION_RESPONSE',
        'DELETE_SESSION_REQUEST', 'DELETE_SESSION_RESPONSE',
        'MODIFY_BEARER_REQUEST', 'MODIFY_BEARER_RESPONSE',
        'CREATE_BEARER_REQUEST', 'CREATE_BEARER_RESPONSE',
        'DELETE_BEARER_REQUEST', 'DELETE_BEARER_RESPONSE',
        'ECHO_REQUEST', 'ECHO_RESPONSE'
      ];
      this.gtpVersions = ['GTPv1', 'GTPv2'];
    } catch (error) {
      console.error('GtpMessageExtractor constructor error:', error);
      reportError(error);
    }
  }

  // Extract GTP message from log entry
  extractFromLogEntry(logEntry) {
    try {
      if (!this.isGtpLog(logEntry)) {
        return null;
      }
      
      const message = logEntry.message;
      const gtpMessage = this.identifyGtpMessage(message);
      
      if (!gtpMessage) return null;
      
      return new ProtocolMessage({
        timestamp: logEntry.timestamp,
        source: this.extractSource(message),
        destination: this.extractDestination(message),
        layer: 'gtp',
        messageType: gtpMessage,
        direction: this.extractDirection(message),
        payload: this.extractGtpPayload(message),
        correlationId: this.extractCorrelationId(message)
      });
    } catch (error) {
      console.error('GtpMessageExtractor extract from log entry error:', error);
      reportError(error);
      return null;
    }
  }

  // Check if log entry contains GTP information
  isGtpLog(logEntry) {
    try {
      const message = logEntry.message.toUpperCase();
      return message.includes('GTP') || message.includes('TEID') || message.includes('TUNNEL');
    } catch (error) {
      console.error('GtpMessageExtractor is GTP log error:', error);
      return false;
    }
  }

  // Identify GTP message type
  identifyGtpMessage(message) {
    try {
      const upperMessage = message.toUpperCase().replace(/[-_\s]/g, '_');
      
      for (const gtpMsg of this.gtpMessages) {
        if (upperMessage.includes(gtpMsg)) {
          return gtpMsg;
        }
      }
      
      // Check for abbreviated forms
      if (upperMessage.includes('CREATE') && upperMessage.includes('SESSION')) {
        return 'CREATE_SESSION_REQUEST';
      }
      if (upperMessage.includes('DELETE') && upperMessage.includes('SESSION')) {
        return 'DELETE_SESSION_REQUEST';
      }
      
      return null;
    } catch (error) {
      console.error('GtpMessageExtractor identify GTP message error:', error);
      return null;
    }
  }

  // Extract source from message
  extractSource(message) {
    try {
      // Look for source IP in GTP context
      const srcMatch = message.match(/src[:\s]*(\d+\.\d+\.\d+\.\d+)/i);
      if (srcMatch) return srcMatch[1];
      
      // Look for SGW/PGW identifiers
      if (message.toUpperCase().includes('SGW')) return 'sgw';
      if (message.toUpperCase().includes('PGW')) return 'pgw';
      if (message.toUpperCase().includes('UPF')) return 'upf';
      
      return 'unknown';
    } catch (error) {
      console.error('GtpMessageExtractor extract source error:', error);
      return 'unknown';
    }
  }

  // Extract destination from message
  extractDestination(message) {
    try {
      // Look for destination IP in GTP context
      const dstMatch = message.match(/dst[:\s]*(\d+\.\d+\.\d+\.\d+)/i);
      if (dstMatch) return dstMatch[1];
      
      return 'unknown';
    } catch (error) {
      console.error('GtpMessageExtractor extract destination error:', error);
      return 'unknown';
    }
  }

  // Extract direction from message
  extractDirection(message) {
    try {
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes('tx') || lowerMessage.includes('send')) {
        return 'outgoing';
      }
      if (lowerMessage.includes('rx') || lowerMessage.includes('receive')) {
        return 'incoming';
      }
      
      return 'unknown';
    } catch (error) {
      console.error('GtpMessageExtractor extract direction error:', error);
      return 'unknown';
    }
  }

  // Extract GTP payload information
  extractGtpPayload(message) {
    try {
      const payload = {};
      
      // Extract TEID
      const teidMatch = message.match(/teid[:\s]*(\w+)/i);
      if (teidMatch) payload.teid = teidMatch[1];
      
      // Extract Sequence Number
      const seqMatch = message.match(/seq[:\s]*(\d+)/i);
      if (seqMatch) payload.sequenceNumber = parseInt(seqMatch[1]);
      
      // Extract IMSI
      const imsiMatch = message.match(/imsi[:\s]*([0-9-]+)/i);
      if (imsiMatch) payload.imsi = imsiMatch[1];
      
      // Extract APN
      const apnMatch = message.match(/apn[:\s]*([^\s;]+)/i);
      if (apnMatch) payload.apn = apnMatch[1];
      
      return payload;
    } catch (error) {
      console.error('GtpMessageExtractor extract GTP payload error:', error);
      return {};
    }
  }

  // Extract correlation ID
  extractCorrelationId(message) {
    try {
      // Use TEID as correlation ID for GTP messages
      const teidMatch = message.match(/teid[:\s]*(\w+)/i);
      if (teidMatch) {
        return `gtp_${teidMatch[1]}`;
      }
      
      // Use IMSI as fallback
      const imsiMatch = message.match(/imsi[:\s]*([0-9-]+)/i);
      if (imsiMatch) {
        return `gtp_${imsiMatch[1]}`;
      }
      
      return null;
    } catch (error) {
      console.error('GtpMessageExtractor extract correlation ID error:', error);
      return null;
    }
  }

  // Get supported message types
  getSupportedMessageTypes() {
    try {
      return [...this.gtpMessages];
    } catch (error) {
      console.error('GtpMessageExtractor get supported message types error:', error);
      return [];
    }
  }
}

// Export GtpMessageExtractor
window.GtpMessageExtractor = GtpMessageExtractor;

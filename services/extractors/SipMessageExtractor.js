// SipMessageExtractor - SIP message extraction service
class SipMessageExtractor {
  constructor() {
    try {
      this.sipMethods = window.CONSTANTS.SIP_METHODS;
      this.sipResponses = {
        '100': 'Trying',
        '180': 'Ringing',
        '200': 'OK',
        '401': 'Unauthorized',
        '404': 'Not Found',
        '486': 'Busy Here',
        '487': 'Request Terminated'
      };
    } catch (error) {
      console.error('SipMessageExtractor constructor error:', error);
      reportError(error);
    }
  }

  // Extract SIP message from log entry
  extractFromLogEntry(logEntry) {
    try {
      if (logEntry.source !== 'kamailio' || logEntry.layer !== 'sip') {
        return null;
      }
      
      const message = logEntry.message;
      const sipMessage = this.identifySipMessage(message);
      
      if (!sipMessage) return null;
      
      return new ProtocolMessage({
        timestamp: logEntry.timestamp,
        source: this.extractSource(message),
        destination: this.extractDestination(message),
        layer: 'sip',
        messageType: sipMessage.type,
        direction: this.extractDirection(message),
        payload: this.extractSipPayload(message),
        correlationId: this.extractCorrelationId(message)
      });
    } catch (error) {
      console.error('SipMessageExtractor extract from log entry error:', error);
      reportError(error);
      return null;
    }
  }

  // Identify SIP message type
  identifySipMessage(message) {
    try {
      // Check for SIP methods
      for (const method of this.sipMethods) {
        if (message.includes(method)) {
          return { type: method, category: 'request' };
        }
      }
      
      // Check for SIP responses
      const responseMatch = message.match(/SIP\/2\.0\s+(\d{3})/);
      if (responseMatch) {
        const code = responseMatch[1];
        const reason = this.sipResponses[code] || 'Unknown';
        return { type: `${code} ${reason}`, category: 'response' };
      }
      
      return null;
    } catch (error) {
      console.error('SipMessageExtractor identify SIP message error:', error);
      return null;
    }
  }

  // Extract SIP payload information
  extractSipPayload(message) {
    try {
      const payload = {};
      
      // Extract Call-ID
      const callIdMatch = message.match(/Call-ID[:\s]*([^\s;]+)/i);
      if (callIdMatch) payload.callId = callIdMatch[1];
      
      // Extract CSeq
      const cseqMatch = message.match(/CSeq[:\s]*(\d+\s+\w+)/i);
      if (cseqMatch) payload.cseq = cseqMatch[1];
      
      // Extract Via
      const viaMatch = message.match(/Via[:\s]*([^\r\n]+)/i);
      if (viaMatch) payload.via = viaMatch[1];
      
      return payload;
    } catch (error) {
      console.error('SipMessageExtractor extract SIP payload error:', error);
      return {};
    }
  }

  // Extract correlation ID
  extractCorrelationId(message) {
    try {
      // Use Call-ID as correlation ID for SIP messages
      const callIdMatch = message.match(/Call-ID[:\s]*([^\s;]+)/i);
      if (callIdMatch) {
        return `sip_${callIdMatch[1]}`;
      }
      
      return null;
    } catch (error) {
      console.error('SipMessageExtractor extract correlation ID error:', error);
      return null;
    }
  }

  // Get supported message types
  getSupportedMessageTypes() {
    try {
      return [...this.sipMethods, ...Object.values(this.sipResponses)];
    } catch (error) {
      console.error('SipMessageExtractor get supported message types error:', error);
      return [];
    }
  }
}

// Export SipMessageExtractor
window.SipMessageExtractor = SipMessageExtractor;

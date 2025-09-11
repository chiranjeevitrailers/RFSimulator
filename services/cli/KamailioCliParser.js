// Kamailio CLI Parser - Parses Kamailio SIP/IMS logs
class KamailioCliParser {
  constructor() {
    this.name = 'kamailio';
    this.sipMethods = ['INVITE', 'ACK', 'BYE', 'CANCEL', 'REGISTER', 'OPTIONS', 'INFO', 'UPDATE'];
  }

  parseLine(line) {
    try {
      // Kamailio log format: level(pid) module: message
      const match = line.match(/(\w+)\((\d+)\)\s+([^:]+):\s+(.+)/);
      
      if (!match) {
        return this.parseGenericLine(line);
      }

      const [, level, pid, module, message] = match;
      
      return {
        pid: pid,
        component: module.trim(),
        level: this.normalizeLevel(level),
        message: message,
        layer: 'IMS',
        messageType: this.extractMessageType(message),
        fields: this.extractSipFields(message)
      };
    } catch (error) {
      console.error('KamailioCliParser parseLine error:', error);
      return this.parseGenericLine(line);
    }
  }

  parseGenericLine(line) {
    return {
      component: 'KAMAILIO',
      level: 'info',
      message: line,
      layer: 'IMS',
      messageType: 'GENERIC',
      fields: {}
    };
  }

  normalizeLevel(level) {
    const levelMap = {
      'CRITICAL': 'error',
      'ERROR': 'error',
      'WARNING': 'warning', 
      'NOTICE': 'info',
      'INFO': 'info',
      'DEBUG': 'debug'
    };
    return levelMap[level.toUpperCase()] || 'info';
  }

  extractMessageType(message) {
    for (const method of this.sipMethods) {
      if (message.includes(method)) {
        return `SIP_${method}`;
      }
    }
    
    if (message.includes('Response')) return 'SIP_RESPONSE';
    if (message.includes('Registration')) return 'SIP_REGISTER';
    return 'SIP_GENERIC';
  }

  extractSipFields(message) {
    const fields = {};
    
    // Extract Call-ID
    const callIdMatch = message.match(/Call-ID:\s*([^\s,]+)/);
    if (callIdMatch) fields.callId = callIdMatch[1];
    
    // Extract From/To headers
    const fromMatch = message.match(/From:\s*([^;,]+)/);
    if (fromMatch) fields.from = fromMatch[1];
    
    const toMatch = message.match(/To:\s*([^;,]+)/);
    if (toMatch) fields.to = toMatch[1];
    
    // Extract SIP method
    const methodMatch = message.match(/(INVITE|ACK|BYE|CANCEL|REGISTER|OPTIONS)/);
    if (methodMatch) fields.sipMethod = methodMatch[1];
    
    return fields;
  }
}

window.KamailioCliParser = KamailioCliParser;
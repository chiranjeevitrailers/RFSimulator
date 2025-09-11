// Open5GS CLI Parser - Parses Open5GS 5G core network logs
class Open5gsCliParser {
  constructor() {
    this.name = 'open5gs';
    this.components = ['AMF', 'SMF', 'UPF', 'NRF', 'AUSF', 'UDM', 'UDR', 'PCF', 'BSF', 'NSSF'];
  }

  parseLine(line) {
    try {
      // Open5GS log format: timestamp [component] level: message
      const match = line.match(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+)\s+\[([A-Z]+)\]\s+(\w+):\s+(.+)/);
      
      if (!match) {
        return this.parseGenericLine(line);
      }

      const [, timestamp, component, level, message] = match;
      
      return {
        timestamp: timestamp,
        component: component,
        level: this.normalizeLevel(level),
        message: message,
        layer: this.getLayerForComponent(component),
        messageType: this.extractMessageType(message),
        fields: this.extractFields(message, component)
      };
    } catch (error) {
      console.error('Open5gsCliParser parseLine error:', error);
      return this.parseGenericLine(line);
    }
  }

  parseGenericLine(line) {
    return {
      component: 'OPEN5GS',
      level: 'info',
      message: line,
      layer: 'CORE',
      messageType: 'GENERIC',
      fields: {}
    };
  }

  normalizeLevel(level) {
    const levelMap = {
      'FATAL': 'error',
      'ERROR': 'error', 
      'WARN': 'warning',
      'INFO': 'info',
      'DEBUG': 'debug',
      'TRACE': 'trace'
    };
    return levelMap[level.toUpperCase()] || 'info';
  }

  getLayerForComponent(component) {
    const layerMap = {
      'AMF': 'NAS',
      'SMF': 'NAS', 
      'UPF': 'GTP',
      'NRF': 'SBI',
      'AUSF': 'SBI',
      'UDM': 'SBI',
      'UDR': 'SBI',
      'PCF': 'SBI',
      'BSF': 'SBI',
      'NSSF': 'SBI'
    };
    return layerMap[component] || 'CORE';
  }

  extractMessageType(message) {
    if (message.includes('Registration')) return 'REGISTRATION';
    if (message.includes('PDU Session')) return 'PDU_SESSION';
    if (message.includes('Service Request')) return 'SERVICE_REQUEST';
    if (message.includes('Handover')) return 'HANDOVER';
    if (message.includes('Authentication')) return 'AUTH';
    return 'GENERIC';
  }

  extractFields(message, component) {
    const fields = {};
    
    // Extract SUPI/IMSI
    const supiMatch = message.match(/SUPI\[([^\]]+)\]/);
    if (supiMatch) fields.supi = supiMatch[1];
    
    // Extract Session ID
    const sessionMatch = message.match(/Session\[(\d+)\]/);
    if (sessionMatch) fields.sessionId = sessionMatch[1];
    
    // Extract DNN
    const dnnMatch = message.match(/DNN\[([^\]]+)\]/);
    if (dnnMatch) fields.dnn = dnnMatch[1];
    
    return fields;
  }
}

window.Open5gsCliParser = Open5gsCliParser;
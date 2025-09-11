// ORAN Log Decoder - Based on srsRAN project ORAN log formats
class OranLogDecoder {
  constructor() {
    this.patterns = {
      // E1 Interface logs
      e1: /^\[E1\]\s*\[([IWED])\]\s*(.*?)(?:\[([^\]]+)\])?\s*(.*)$/,
      // F1 Interface logs  
      f1: /^\[F1\]\s*\[([IWED])\]\s*(.*?)(?:\[([^\]]+)\])?\s*(.*)$/,
      // CU-CP logs
      cucp: /^\[CU-CP\]\s*\[([IWED])\]\s*(.*?)(?:\[RNTI:([^\]]+)\])?\s*(.*)$/,
      // CU-UP logs
      cuup: /^\[CU-UP\]\s*\[([IWED])\]\s*(.*?)(?:\[TEID:([^\]]+)\])?\s*(.*)$/,
      // DU logs
      du: /^\[DU\]\s*\[([IWED])\]\s*(.*?)(?:\[Cell:([^\]]+)\])?\s*(.*)$/,
      // xApp logs
      xapp: /^\[xApp:([^\]]+)\]\s*\[([IWED])\]\s*(.*)$/,
      // SMO logs
      smo: /^\[SMO\]\s*\[([IWED])\]\s*(.*?)(?:\[([^\]]+)\])?\s*(.*)$/
    };
  }

  decode(logLine, source = 'oran') {
    try {
      for (const [component, pattern] of Object.entries(this.patterns)) {
        const match = pattern.exec(logLine);
        if (match) {
          return this.parseOranLog(component, match, logLine);
        }
      }
      
      return this.parseGenericOranLog(logLine);
    } catch (error) {
      console.error('OranLogDecoder error:', error);
      return null;
    }
  }

  parseOranLog(component, match, raw) {
    const base = {
      timestamp: new Date().toISOString(),
      component,
      source: 'oran',
      raw
    };

    switch (component) {
      case 'e1':
      case 'f1':
        return {
          ...base,
          level: match[1],
          procedure: match[2],
          context: match[3] || 'unknown',
          message: match[4]
        };
      
      case 'cucp':
        return {
          ...base,
          level: match[1],
          procedure: match[2],
          rnti: match[3] || 'unknown',
          message: match[4]
        };
      
      case 'cuup':
        return {
          ...base,
          level: match[1],
          procedure: match[2], 
          teid: match[3] || 'unknown',
          message: match[4]
        };

      case 'du':
        return {
          ...base,
          level: match[1],
          procedure: match[2],
          cellId: match[3] || 'unknown', 
          message: match[4]
        };

      case 'xapp':
        return {
          ...base,
          appName: match[1],
          level: match[2],
          message: match[3]
        };

      default:
        return {
          ...base,
          level: match[1],
          message: match[2] || raw
        };
    }
  }

  parseGenericOranLog(logLine) {
    return {
      timestamp: new Date().toISOString(),
      component: 'unknown',
      level: 'I',
      message: logLine,
      source: 'oran',
      raw: logLine
    };
  }
}

if (typeof window !== 'undefined') {
  window.OranLogDecoder = OranLogDecoder;
}
// NB-IoT Log Decoder - Based on srsRAN NB-IoT log formats
class NbiotLogDecoder {
  constructor() {
    this.patterns = {
      // NB-IoT PHY logs
      phy: /^\[NBIOT-PHY\]\s*\[([IWED])\]\s*(.*?)(?:\[EARFCN:(\d+)\])?\s*(.*)$/,
      // NB-IoT MAC logs
      mac: /^\[NBIOT-MAC\]\s*\[([IWED])\]\s*(.*?)(?:\[C-RNTI:([^\]]+)\])?\s*(.*)$/,
      // NB-IoT RRC logs
      rrc: /^\[NBIOT-RRC\]\s*\[([IWED])\]\s*(.*?)(?:\[UE:([^\]]+)\])?\s*(.*)$/,
      // NB-IoT PDCP logs
      pdcp: /^\[NBIOT-PDCP\]\s*\[([IWED])\]\s*(.*?)(?:\[LCID:(\d+)\])?\s*(.*)$/,
      // NB-IoT scheduling logs
      sched: /^\[NBIOT-SCHED\]\s*\[([IWED])\]\s*(.*?)(?:\[UE:([^\]]+)\])?\s*(.*)$/
    };
  }

  decode(logLine, source = 'nbiot') {
    try {
      for (const [layer, pattern] of Object.entries(this.patterns)) {
        const match = pattern.exec(logLine);
        if (match) {
          return this.parseNbiotLog(layer, match, logLine);
        }
      }
      
      return this.parseGenericNbiotLog(logLine);
    } catch (error) {
      console.error('NbiotLogDecoder error:', error);
      return null;
    }
  }

  parseNbiotLog(layer, match, raw) {
    const base = {
      timestamp: new Date().toISOString(),
      layer,
      source: 'nbiot',
      raw
    };

    switch (layer) {
      case 'phy':
        return {
          ...base,
          level: match[1],
          procedure: match[2],
          earfcn: match[3] || 'unknown',
          message: match[4]
        };
      
      case 'mac':
        return {
          ...base,
          level: match[1],
          procedure: match[2],
          crnti: match[3] || 'unknown',
          message: match[4]
        };
      
      case 'rrc':
        return {
          ...base,
          level: match[1],
          procedure: match[2],
          ueId: match[3] || 'unknown',
          message: match[4]
        };

      case 'pdcp':
        return {
          ...base,
          level: match[1],
          procedure: match[2],
          lcid: match[3] || 'unknown',
          message: match[4]
        };

      case 'sched':
        return {
          ...base,
          level: match[1],
          procedure: match[2],
          ueId: match[3] || 'unknown',
          message: match[4]
        };

      default:
        return {
          ...base,
          level: match[1],
          message: match[2] || raw
        };
    }
  }

  parseGenericNbiotLog(logLine) {
    return {
      timestamp: new Date().toISOString(),
      layer: 'unknown',
      level: 'I',
      message: logLine,
      source: 'nbiot',
      raw: logLine
    };
  }
}

if (typeof window !== 'undefined') {
  window.NbiotLogDecoder = NbiotLogDecoder;
}
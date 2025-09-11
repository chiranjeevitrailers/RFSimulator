// NTN Log Decoder - Based on srsRAN NTN log formats
class NtnLogDecoder {
  constructor() {
    this.patterns = {
      // NTN PHY logs
      phy: /^\[NTN-PHY\]\s*\[([IWED])\]\s*(.*?)(?:\[SAT:([^\]]+)\])?\s*(.*)$/,
      // NTN MAC logs
      mac: /^\[NTN-MAC\]\s*\[([IWED])\]\s*(.*?)(?:\[Beam:(\d+)\])?\s*(.*)$/,
      // Satellite specific logs
      sat: /^\[SATELLITE\]\s*\[([IWED])\]\s*(.*?)(?:\[ID:([^\]]+)\])?\s*(.*)$/,
      // SIB19 logs (NTN system info)
      sib19: /^\[SIB19\]\s*\[([IWED])\]\s*(.*?)(?:\[Epoch:([^\]]+)\])?\s*(.*)$/,
      // Timing advance logs
      ta: /^\[NTN-TA\]\s*\[([IWED])\]\s*(.*?)(?:\[TA:([^\]]+)\])?\s*(.*)$/,
      // Doppler compensation logs
      doppler: /^\[DOPPLER\]\s*\[([IWED])\]\s*(.*?)(?:\[Shift:([^\]]+)\])?\s*(.*)$/,
      // Feeder link logs
      feeder: /^\[FEEDER\]\s*\[([IWED])\]\s*(.*?)(?:\[GW:([^\]]+)\])?\s*(.*)$/
    };
  }

  decode(logLine, source = 'ntn') {
    try {
      for (const [component, pattern] of Object.entries(this.patterns)) {
        const match = pattern.exec(logLine);
        if (match) {
          return this.parseNtnLog(component, match, logLine);
        }
      }
      
      return this.parseGenericNtnLog(logLine);
    } catch (error) {
      console.error('NtnLogDecoder error:', error);
      return null;
    }
  }

  parseNtnLog(component, match, raw) {
    const base = {
      timestamp: new Date().toISOString(),
      component,
      source: 'ntn',
      raw
    };

    switch (component) {
      case 'phy':
        return {
          ...base,
          level: match[1],
          procedure: match[2],
          satelliteId: match[3] || 'unknown',
          message: match[4]
        };
      
      case 'mac':
        return {
          ...base,
          level: match[1],
          procedure: match[2],
          beamId: match[3] || 'unknown',
          message: match[4]
        };
      
      case 'sat':
        return {
          ...base,
          level: match[1],
          procedure: match[2],
          satelliteId: match[3] || 'unknown',
          message: match[4]
        };

      case 'sib19':
        return {
          ...base,
          level: match[1],
          procedure: match[2],
          epoch: match[3] || 'unknown',
          message: match[4]
        };

      case 'ta':
        return {
          ...base,
          level: match[1],
          procedure: match[2],
          timingAdvance: match[3] || 'unknown',
          message: match[4]
        };

      case 'doppler':
        return {
          ...base,
          level: match[1],
          procedure: match[2],
          dopplerShift: match[3] || 'unknown',
          message: match[4]
        };

      case 'feeder':
        return {
          ...base,
          level: match[1],
          procedure: match[2],
          gateway: match[3] || 'unknown',
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

  parseGenericNtnLog(logLine) {
    return {
      timestamp: new Date().toISOString(),
      component: 'unknown',
      level: 'I',
      message: logLine,
      source: 'ntn',
      raw: logLine
    };
  }
}

if (typeof window !== 'undefined') {
  window.NtnLogDecoder = NtnLogDecoder;
}
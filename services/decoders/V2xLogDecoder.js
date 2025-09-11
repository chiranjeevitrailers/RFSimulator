// V2X Log Decoder - Based on srsRAN V2X log formats
class V2xLogDecoder {
  constructor() {
    this.patterns = {
      // V2X PHY logs
      phy: /^\[V2X-PHY\]\s*\[([IWED])\]\s*(.*?)(?:\[Pool:(\d+)\])?\s*(.*)$/,
      // V2X MAC logs
      mac: /^\[V2X-MAC\]\s*\[([IWED])\]\s*(.*?)(?:\[SL-RNTI:([^\]]+)\])?\s*(.*)$/,
      // V2X RLC logs
      rlc: /^\[V2X-RLC\]\s*\[([IWED])\]\s*(.*?)(?:\[LCID:(\d+)\])?\s*(.*)$/,
      // V2X PDCP logs
      pdcp: /^\[V2X-PDCP\]\s*\[([IWED])\]\s*(.*?)(?:\[SN:(\d+)\])?\s*(.*)$/,
      // Sidelink specific logs
      sidelink: /^\[SIDELINK\]\s*\[([IWED])\]\s*(.*?)(?:\[Dest:([^\]]+)\])?\s*(.*)$/,
      // PC5 interface logs
      pc5: /^\[PC5\]\s*\[([IWED])\]\s*(.*?)(?:\[L2ID:([^\]]+)\])?\s*(.*)$/
    };
  }

  decode(logLine, source = 'v2x') {
    try {
      for (const [component, pattern] of Object.entries(this.patterns)) {
        const match = pattern.exec(logLine);
        if (match) {
          return this.parseV2xLog(component, match, logLine);
        }
      }
      
      return this.parseGenericV2xLog(logLine);
    } catch (error) {
      console.error('V2xLogDecoder error:', error);
      return null;
    }
  }

  parseV2xLog(component, match, raw) {
    const base = {
      timestamp: new Date().toISOString(),
      component,
      source: 'v2x',
      raw
    };

    switch (component) {
      case 'phy':
        return {
          ...base,
          level: match[1],
          procedure: match[2],
          poolId: match[3] || 'unknown',
          message: match[4]
        };
      
      case 'mac':
        return {
          ...base,
          level: match[1],
          procedure: match[2],
          slRnti: match[3] || 'unknown',
          message: match[4]
        };
      
      case 'rlc':
      case 'pdcp':
        return {
          ...base,
          level: match[1],
          procedure: match[2],
          [component === 'rlc' ? 'lcid' : 'sn']: match[3] || 'unknown',
          message: match[4]
        };

      case 'sidelink':
        return {
          ...base,
          level: match[1],
          procedure: match[2],
          destination: match[3] || 'unknown',
          message: match[4]
        };

      case 'pc5':
        return {
          ...base,
          level: match[1],
          procedure: match[2],
          l2Id: match[3] || 'unknown',
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

  parseGenericV2xLog(logLine) {
    return {
      timestamp: new Date().toISOString(),
      component: 'unknown',
      level: 'I',
      message: logLine,
      source: 'v2x',
      raw: logLine
    };
  }
}

if (typeof window !== 'undefined') {
  window.V2xLogDecoder = V2xLogDecoder;
}
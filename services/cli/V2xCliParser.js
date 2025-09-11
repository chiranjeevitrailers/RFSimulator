// V2xCliParser - Parser for C-V2X specific logs and messages
class V2xCliParser {
  constructor() {
    this.messagePatterns = {
      pssch: /PSSCH.*sci.*(\d+).*mcs.*(\d+)/i,
      pscch: /PSCCH.*resource.*(\d+).*format.*(\d+)/i,
      pc5: /PC5.*interface.*event.*(\w+)/i,
      rri: /RRI.*resource.*(\d+).*pool.*(\d+)/i,
      rtx: /RTX.*retransmission.*(\d+).*harq.*(\d+)/i,
      sidelink: /sidelink.*communication.*(\w+)/i,
      v2x_phy: /V2X.*PHY.*snr.*(-?\d+\.?\d*)/i,
      v2x_mac: /V2X.*MAC.*pdu.*size.*(\d+)/i
    };
  }

  parseLogLine(line) {
    try {
      if (!line) return null;

      const timestamp = this.extractTimestamp(line);
      const level = this.extractLogLevel(line);
      
      for (const [type, pattern] of Object.entries(this.messagePatterns)) {
        const match = line.match(pattern);
        if (match) {
          return {
            timestamp: timestamp,
            level: level,
            source: 'v2x',
            component: type.toUpperCase(),
            message: line.trim(),
            messageType: type,
            parameters: this.extractParameters(type, match)
          };
        }
      }

      return {
        timestamp: timestamp,
        level: level,
        source: 'v2x',
        component: 'GENERAL',
        message: line.trim()
      };
    } catch (error) {
      console.error('V2xCliParser parse error:', error);
      return null;
    }
  }

  extractTimestamp(line) {
    try {
      const timeMatch = line.match(/(\d{2}:\d{2}:\d{2})/);
      if (timeMatch) {
        const today = new Date();
        const timeStr = timeMatch[1];
        const [hours, minutes, seconds] = timeStr.split(':').map(Number);
        today.setHours(hours, minutes, seconds, 0);
        return today.toISOString();
      }
      return new Date().toISOString();
    } catch (error) {
      return new Date().toISOString();
    }
  }

  extractLogLevel(line) {
    try {
      if (line.includes('ERROR') || line.includes('[E]')) return 'error';
      if (line.includes('WARN') || line.includes('[W]')) return 'warn';
      if (line.includes('INFO') || line.includes('[I]')) return 'info';
      if (line.includes('DEBUG') || line.includes('[D]')) return 'debug';
      return 'info';
    } catch (error) {
      return 'info';
    }
  }

  extractParameters(type, match) {
    try {
      switch (type) {
        case 'pssch':
          return { sci: match[1], mcs: match[2] };
        case 'pscch':
          return { resource: match[1], format: match[2] };
        case 'pc5':
          return { event: match[1] };
        case 'rri':
          return { resource: match[1], pool: match[2] };
        case 'rtx':
          return { retransmission: match[1], harq: match[2] };
        case 'sidelink':
          return { communication: match[1] };
        case 'v2x_phy':
          return { snr: parseFloat(match[1]) };
        case 'v2x_mac':
          return { pdu_size: match[1] };
        default:
          return {};
      }
    } catch (error) {
      return {};
    }
  }

  parseProtocolMessage(message) {
    try {
      return {
        messageType: this.detectMessageType(message),
        decoded: this.decodeMessage(message),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('V2xCliParser protocol message parse error:', error);
      return null;
    }
  }

  detectMessageType(message) {
    try {
      if (message.includes('PSSCH')) return 'PSSCH';
      if (message.includes('PSCCH')) return 'PSCCH';
      if (message.includes('PC5')) return 'PC5';
      if (message.includes('RRI')) return 'RRI';
      if (message.includes('RTX')) return 'RTX';
      return 'UNKNOWN';
    } catch (error) {
      return 'UNKNOWN';
    }
  }

  decodeMessage(message) {
    try {
      return {
        raw: message,
        summary: message.substring(0, 100) + '...'
      };
    } catch (error) {
      return { raw: message, summary: 'Decode error' };
    }
  }
}

window.V2xCliParser = V2xCliParser;

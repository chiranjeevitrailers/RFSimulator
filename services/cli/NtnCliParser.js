// NtnCliParser - Parser for NTN (Non-Terrestrial Network) specific logs and messages
class NtnCliParser {
  constructor() {
    this.messagePatterns = {
      sib19: /SIB19.*satellite.*position.*(\d+\.?\d*).*(\d+\.?\d*)/i,
      doppler: /doppler.*shift.*(-?\d+\.?\d*).*hz/i,
      delay: /propagation.*delay.*(\d+\.?\d*).*ms/i,
      timing: /timing.*advance.*(\d+).*samples/i,
      harq: /HARQ.*adaptation.*(\w+)/i,
      geo: /GEO.*satellite.*(\w+)/i,
      meo: /MEO.*satellite.*(\w+)/i,
      leo: /LEO.*satellite.*(\w+)/i,
      ntn_phy: /NTN.*PHY.*snr.*(-?\d+\.?\d*)/i,
      ntn_mac: /NTN.*MAC.*pdu.*size.*(\d+)/i,
      band256: /band.*256.*freq.*(\d+)/i
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
            source: 'ntn',
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
        source: 'ntn',
        component: 'GENERAL',
        message: line.trim()
      };
    } catch (error) {
      console.error('NtnCliParser parse error:', error);
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
        case 'sib19':
          return { latitude: parseFloat(match[1]), longitude: parseFloat(match[2]) };
        case 'doppler':
          return { shift_hz: parseFloat(match[1]) };
        case 'delay':
          return { delay_ms: parseFloat(match[1]) };
        case 'timing':
          return { advance_samples: parseInt(match[1]) };
        case 'harq':
          return { adaptation: match[1] };
        case 'geo':
        case 'meo':
        case 'leo':
          return { satellite_type: type.toUpperCase(), status: match[1] };
        case 'ntn_phy':
          return { snr: parseFloat(match[1]) };
        case 'ntn_mac':
          return { pdu_size: parseInt(match[1]) };
        case 'band256':
          return { frequency: parseInt(match[1]) };
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
      console.error('NtnCliParser protocol message parse error:', error);
      return null;
    }
  }

  detectMessageType(message) {
    try {
      if (message.includes('SIB19')) return 'SIB19';
      if (message.includes('DOPPLER')) return 'DOPPLER';
      if (message.includes('DELAY')) return 'DELAY';
      if (message.includes('TIMING')) return 'TIMING';
      if (message.includes('HARQ')) return 'HARQ';
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

window.NtnCliParser = NtnCliParser;

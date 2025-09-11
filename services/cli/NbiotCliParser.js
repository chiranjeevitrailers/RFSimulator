// NbiotCliParser - Parser for NB-IoT specific logs and messages
class NbiotCliParser {
  constructor() {
    this.messagePatterns = {
      nprach: /NPRACH.*preamble.*coverage.*(\d+)/i,
      npdcch: /NPDCCH.*ncce.*(\d+).*aggregation.*(\d+)/i,
      npdsch: /NPDSCH.*harq.*(\d+).*rv.*(\d+)/i,
      mib_nb: /MIB-NB.*system.*frame.*(\d+)/i,
      sib_nb: /SIB.*NB.*scheduling.*info/i,
      rrc_nb: /RRC.*NB.*connection.*setup/i,
      mac_nb: /MAC.*NB.*pdu.*size.*(\d+)/i,
      phy_nb: /PHY.*NB.*subcarrier.*(\d+)/i
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
            source: 'nbiot',
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
        source: 'nbiot',
        component: 'GENERAL',
        message: line.trim()
      };
    } catch (error) {
      console.error('NbiotCliParser parse error:', error);
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
        case 'nprach':
          return { coverage_level: match[1] };
        case 'npdcch':
          return { ncce: match[1], aggregation: match[2] };
        case 'npdsch':
          return { harq_id: match[1], rv: match[2] };
        case 'mib_nb':
          return { system_frame: match[1] };
        case 'mac_nb':
          return { pdu_size: match[1] };
        case 'phy_nb':
          return { subcarrier: match[1] };
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
      console.error('NbiotCliParser protocol message parse error:', error);
      return null;
    }
  }

  detectMessageType(message) {
    try {
      if (message.includes('NPRACH')) return 'NPRACH';
      if (message.includes('NPDCCH')) return 'NPDCCH';
      if (message.includes('NPDSCH')) return 'NPDSCH';
      if (message.includes('MIB-NB')) return 'MIB-NB';
      if (message.includes('SIB-NB')) return 'SIB-NB';
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

window.NbiotCliParser = NbiotCliParser;

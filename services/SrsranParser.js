// SrsranParser - Parse srsRAN O-RAN specific logs
class SrsranParser {
  constructor() {
    try {
      this.layerMap = {
        'MAC': 'mac',
        'RLC': 'rlc', 
        'PDCP': 'pdcp',
        'RRC': 'rrc',
        'SDAP': 'sdap',
        'NGAP': 'ngap',
        'GTPU': 'gtpu',
        'RADIO': 'radio',
        'FAPI': 'fapi',
        'F1U': 'f1u',
        'DU': 'du',
        'CU': 'cu',
        'F1AP': 'f1ap',
        'E1AP': 'e1ap',
        'E2AP': 'e2ap'
      };
    } catch (error) {
      console.error('SrsranParser constructor error:', error);
      reportError(error);
    }
  }

  parseLogLine(line) {
    try {
      // Format: Timestamp [Layer] [Level] [TTI] message
      const regex = /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}) \[(\w+)\] \[([EWID])\] (?:\[(\d+\.\d+)\] )?(.*)/;
      const match = line.match(regex);
      
      if (!match) return null;

      const [, timestamp, layer, level, tti, message] = match;
      
      return {
        timestamp: timestamp,
        layer: this.layerMap[layer] || layer.toLowerCase(),
        level: this.mapLogLevel(level),
        tti: tti || null,
        message: message.trim(),
        source: 'srsran',
        parsed: true
      };
    } catch (error) {
      console.error('SrsranParser parse line error:', error);
      reportError(error);
      return null;
    }
  }

  mapLogLevel(level) {
    const levelMap = {
      'E': 'error',
      'W': 'warning', 
      'I': 'info',
      'D': 'debug'
    };
    return levelMap[level] || 'info';
  }

  parseF1APMessage(message) {
    try {
      // Basic F1AP message parsing
      const f1apPatterns = {
        'F1 Setup Request': /F1.*Setup.*Request/i,
        'F1 Setup Response': /F1.*Setup.*Response/i,
        'gNB-DU Configuration Update': /gNB-DU.*Configuration.*Update/i,
        'gNB-CU Configuration Update': /gNB-CU.*Configuration.*Update/i,
        'UE Context Setup Request': /UE.*Context.*Setup.*Request/i,
        'UE Context Setup Response': /UE.*Context.*Setup.*Response/i
      };

      for (const [type, pattern] of Object.entries(f1apPatterns)) {
        if (pattern.test(message)) {
          return {
            messageType: type,
            interface: 'f1ap',
            decoded: true
          };
        }
      }

      return { messageType: 'Unknown F1AP', interface: 'f1ap', decoded: false };
    } catch (error) {
      console.error('SrsranParser parse F1AP error:', error);
      reportError(error);
      return null;
    }
  }

  parseE1APMessage(message) {
    try {
      // Basic E1AP message parsing
      const e1apPatterns = {
        'gNB-CU-UP E1 Setup Request': /gNB-CU-UP.*E1.*Setup.*Request/i,
        'gNB-CU-UP E1 Setup Response': /gNB-CU-UP.*E1.*Setup.*Response/i,
        'Bearer Context Setup Request': /Bearer.*Context.*Setup.*Request/i,
        'Bearer Context Setup Response': /Bearer.*Context.*Setup.*Response/i
      };

      for (const [type, pattern] of Object.entries(e1apPatterns)) {
        if (pattern.test(message)) {
          return {
            messageType: type,
            interface: 'e1ap',
            decoded: true
          };
        }
      }

      return { messageType: 'Unknown E1AP', interface: 'e1ap', decoded: false };
    } catch (error) {
      console.error('SrsranParser parse E1AP error:', error);
      reportError(error);
      return null;
    }
  }
}

// Export SrsranParser
window.SrsranParser = SrsranParser;

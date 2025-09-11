// OranCliParser - Parse O-RAN interface messages
class OranCliParser {
  constructor() {
    try {
      this.source = 'oran';
      this.interfaces = ['f1ap', 'e1ap', 'ngap', 'o1', 'a1'];
      this.messageTypes = {
        f1ap: ['F1SetupRequest', 'F1SetupResponse', 'UEContextSetupRequest'],
        e1ap: ['GNB-CU-UP-E1SetupRequest', 'BearerContextSetupRequest'],
        ngap: ['NGSetupRequest', 'InitialContextSetupRequest', 'PDUSessionResourceSetupRequest']
      };
    } catch (error) {
      console.error('OranCliParser constructor error:', error);
      reportError(error);
    }
  }

  parseLogLine(line) {
    try {
      const timestamp = this.extractTimestamp(line);
      const level = this.extractLogLevel(line);
      const interfaceType = this.extractInterface(line);
      const messageType = this.extractMessageType(line);
      const message = this.extractMessage(line);
      const metrics = this.extractOranMetrics(line);

      return new LogEntry({
        timestamp: timestamp,
        level: level,
        source: this.source,
        component: interfaceType,
        layer: 'oran',
        message: message,
        messageType: messageType,
        rawLine: line,
        metrics: metrics,
        parsed: true
      });
    } catch (error) {
      console.error('OranCliParser parse line error:', error);
      return null;
    }
  }

  extractInterface(line) {
    try {
      for (const intf of this.interfaces) {
        if (line.toLowerCase().includes(intf)) {
          return intf.toUpperCase();
        }
      }
      return 'ORAN';
    } catch (error) {
      return 'ORAN';
    }
  }

  extractMessageType(line) {
    try {
      for (const [intf, types] of Object.entries(this.messageTypes)) {
        for (const type of types) {
          if (line.includes(type)) {
            return type;
          }
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  extractOranMetrics(line) {
    try {
      const metrics = {};
      
      // Extract transaction ID
      const transactionMatch = line.match(/transaction[_\s]*id[:\s]*(\d+)/i);
      if (transactionMatch) metrics.transactionId = parseInt(transactionMatch[1]);

      // Extract gNB ID
      const gnbMatch = line.match(/gnb[_\s]*id[:\s]*(\d+)/i);
      if (gnbMatch) metrics.gnbId = parseInt(gnbMatch[1]);

      return metrics;
    } catch (error) {
      return {};
    }
  }

  extractTimestamp(line) {
    try {
      const match = line.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+)/);
      return match ? match[1] : new Date().toISOString();
    } catch (error) {
      return new Date().toISOString();
    }
  }

  extractLogLevel(line) {
    try {
      const match = line.match(/\[(\w+)\]/);
      return match ? match[1].toLowerCase() : 'info';
    } catch (error) {
      return 'info';
    }
  }

  extractMessage(line) {
    try {
      return line.replace(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+\s+/, '').trim();
    } catch (error) {
      return line;
    }
  }
}

window.OranCliParser = OranCliParser;

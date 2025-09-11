// LogProcessor Service - Processes and transforms log entries
class LogProcessor {
  constructor() {
    this.callbacks = [];
    this.parserFactory = new CliParserFactory();
  }

  async processLogLine(line, source = 'unknown') {
    try {
      const parser = this.parserFactory.getParser(source);
      if (!parser) {
        return this.createBasicLogEntry(line, source);
      }
      
      const parsedData = parser.parseLine(line);
      const logEntry = new LogEntry({
        id: Date.now() + Math.random(),
        timestamp: parsedData.timestamp || new Date().toISOString(),
        source: source,
        level: parsedData.level || 'info',
        component: parsedData.component || 'UNKNOWN',
        message: line,
        layer: parsedData.layer || 'OTHER',
        messageType: parsedData.messageType || 'GENERIC',
        rnti: parsedData.rnti,
        ueId: parsedData.ueId,
        // Map parser fields to UI expectations
        fields: {
          ...parsedData.fields,
          ...parsedData.metrics, // Include PHY metrics from SrsranCliParser
          rawData: parsedData.rawLine,
          direction: parsedData.direction || 'UL',
          channel: parsedData.channel,
          sfn: parsedData.sfn,
          ies: this.formatIEs(parsedData.metrics || parsedData.fields)
        }
      });
      
      this.notifyCallbacks(logEntry);
      return logEntry;
    } catch (error) {
      console.error('LogProcessor processLogLine error:', error);
      return this.createBasicLogEntry(line, source);
    }
  }

  createBasicLogEntry(line, source) {
    return new LogEntry({
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      source: source,
      level: 'info',
      component: 'UNKNOWN',
      message: line,
      layer: 'OTHER'
    });
  }

  notifyCallbacks(logEntry) {
    this.callbacks.forEach(callback => {
      try {
        callback(logEntry);
      } catch (error) {
        console.error('LogProcessor callback error:', error);
      }
    });
  }

  formatIEs(data) {
    try {
      if (!data) return '';
      const ieStrings = [];
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          ieStrings.push(`${key}=${value}`);
        }
      });
      return ieStrings.join(', ');
    } catch (error) {
      return '';
    }
  }

  subscribe(callback) {
    try {
      this.callbacks.push(callback);
      return () => {
        const index = this.callbacks.indexOf(callback);
        if (index > -1) this.callbacks.splice(index, 1);
      };
    } catch (error) {
      return () => {};
    }
  }
}

window.LogProcessor = LogProcessor;
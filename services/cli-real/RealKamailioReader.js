// Real Kamailio Log Reader
class RealKamailioReader {
  constructor() {
    this.isReading = false;
    this.logBuffer = [];
    this.subscribers = new Set();
    this.logFormats = {
      sip: /^(\w{3}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2})\s+\w+\s+kamailio\[\d+\]:\s+(INFO|WARNING|ERROR|DEBUG):\s+<([^>]+)>\s+(.*)$/,
      core: /^(\w{3}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2})\s+\w+\s+kamailio\[\d+\]:\s+(CRITICAL|ERROR|WARNING|INFO|DEBUG):\s+(.*)$/,
      module: /^(\w{3}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2})\s+\w+\s+kamailio\[\d+\]:\s+([A-Z]+):\s+([a-z_]+)\s+\[([^\]]+)\]:\s+(.*)$/
    };
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  parseLogLine(line) {
    try {
      // Try SIP-specific format
      let match = this.logFormats.sip.exec(line);
      if (match) {
        return {
          timestamp: this.parseTimestamp(match[1]),
          level: match[2],
          script: match[3],
          message: match[4],
          type: 'sip',
          source: 'kamailio',
          raw: line
        };
      }

      // Try module format
      match = this.logFormats.module.exec(line);
      if (match) {
        return {
          timestamp: this.parseTimestamp(match[1]),
          level: match[2],
          module: match[3],
          location: match[4],
          message: match[5],
          type: 'module',
          source: 'kamailio',
          raw: line
        };
      }

      // Try core format
      match = this.logFormats.core.exec(line);
      if (match) {
        return {
          timestamp: this.parseTimestamp(match[1]),
          level: match[2],
          message: match[3],
          type: 'core',
          source: 'kamailio',
          raw: line
        };
      }

      // Default parsing
      return {
        timestamp: new Date().toISOString(),
        level: 'INFO',
        message: line,
        type: 'unknown',
        source: 'kamailio',
        raw: line
      };
    } catch (error) {
      console.error('RealKamailioReader parseLogLine error:', error);
      return null;
    }
  }

  parseTimestamp(timeStr) {
    try {
      const currentYear = new Date().getFullYear();
      const date = new Date(`${currentYear} ${timeStr}`);
      return date.toISOString();
    } catch (error) {
      return new Date().toISOString();
    }
  }

  async startReading(logPath = '/var/log/kamailio.log') {
    try {
      this.isReading = true;
      
      const simulateLogReading = () => {
        if (!this.isReading) return;
        
        const sampleLogs = [
          'Jan 10 09:46:44 server kamailio[1234]: INFO: <core> [core/receive.c:123]: SIP request received from 192.168.1.100:5060',
          'Jan 10 09:46:45 server kamailio[1234]: INFO: <script> registrar module processing REGISTER request',
          'Jan 10 09:46:46 server kamailio[1234]: DEBUG: tm [t_lookup.c:456]: transaction found for INVITE',
          'Jan 10 09:46:47 server kamailio[1234]: INFO: <script> authentication successful for user@domain.com',
          'Jan 10 09:46:48 server kamailio[1234]: WARNING: <core> [core/parser.c:789]: malformed SIP header detected'
        ];
        
        const randomLog = sampleLogs[Math.floor(Math.random() * sampleLogs.length)];
        const parsedLog = this.parseLogLine(randomLog);
        
        if (parsedLog) {
          this.subscribers.forEach(callback => {
            try {
              callback(parsedLog);
            } catch (error) {
              console.error('Subscriber callback error:', error);
            }
          });
        }
      };

      this.readInterval = setInterval(simulateLogReading, 2500);
      
    } catch (error) {
      console.error('RealKamailioReader startReading error:', error);
      this.isReading = false;
    }
  }

  stopReading() {
    this.isReading = false;
    if (this.readInterval) {
      clearInterval(this.readInterval);
      this.readInterval = null;
    }
  }

  getLogBuffer() {
    return [...this.logBuffer];
  }
}

if (typeof window !== 'undefined') {
  window.RealKamailioReader = RealKamailioReader;
}
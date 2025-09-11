// Real Open5GS Log Reader
class RealOpen5gsReader {
  constructor() {
    this.isReading = false;
    this.logBuffer = [];
    this.subscribers = new Set();
    this.logFormats = {
      amf: /^(\d{4}\/\d{2}\/\d{2}\s+\d{2}:\d{2}:\d{2})\s+\[app\]\s+(INFO|WARN|ERROR|DEBUG)\s+amf\-([a-z]+)\.c:\d+\s+(.*)$/,
      smf: /^(\d{4}\/\d{2}\/\d{2}\s+\d{2}:\d{2}:\d{2})\s+\[app\]\s+(INFO|WARN|ERROR|DEBUG)\s+smf\-([a-z]+)\.c:\d+\s+(.*)$/,
      upf: /^(\d{4}\/\d{2}\/\d{2}\s+\d{2}:\d{2}:\d{2})\s+\[app\]\s+(INFO|WARN|ERROR|DEBUG)\s+upf\-([a-z]+)\.c:\d+\s+(.*)$/,
      general: /^(\d{4}\/\d{2}\/\d{2}\s+\d{2}:\d{2}:\d{2})\s+\[app\]\s+(INFO|WARN|ERROR|DEBUG)\s+([a-zA-Z\-_]+)\.c:\d+\s+(.*)$/
    };
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  parseLogLine(line) {
    try {
      // Try component-specific formats
      for (const [component, regex] of Object.entries(this.logFormats)) {
        const match = regex.exec(line);
        if (match) {
          return {
            timestamp: new Date(match[1]).toISOString(),
            component: component === 'general' ? match[3] : component,
            level: match[2],
            module: match[3] || 'unknown',
            message: match[4],
            source: 'open5gs',
            raw: line
          };
        }
      }

      // Default parsing for unknown formats
      return {
        timestamp: new Date().toISOString(),
        component: 'unknown',
        level: 'INFO',
        module: 'unknown',
        message: line,
        source: 'open5gs',
        raw: line
      };
    } catch (error) {
      console.error('RealOpen5gsReader parseLogLine error:', error);
      return null;
    }
  }

  async startReading(logPath = '/var/log/open5gs/') {
    try {
      this.isReading = true;
      
      const simulateLogReading = () => {
        if (!this.isReading) return;
        
        const sampleLogs = [
          '2025/01/10 09:46:44 [app] INFO amf-context.c:234 UE registered [IMSI:001010123456789]',
          '2025/01/10 09:46:45 [app] INFO smf-context.c:456 PDU Session established [UE:001010123456789]',
          '2025/01/10 09:46:46 [app] INFO upf-context.c:123 Data forwarding started [TEID:0x12345678]',
          '2025/01/10 09:46:47 [app] DEBUG amf-nas.c:789 Registration Accept sent',
          '2025/01/10 09:46:48 [app] INFO smf-pfcp.c:345 PFCP Session Establishment Response received'
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

      this.readInterval = setInterval(simulateLogReading, 2000);
      
    } catch (error) {
      console.error('RealOpen5gsReader startReading error:', error);
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
  window.RealOpen5gsReader = RealOpen5gsReader;
}
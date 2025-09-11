// CliIntegrationTest - Test real CLI integration
class CliIntegrationTest {
  static async testSrsranIntegration() {
    try {
      const testLogs = [
        "2024-01-15T10:30:45.123456 [INFO ] [PHY    ] Cell search found 1 cells in 120ms",
        "2024-01-15T10:30:45.124000 [INFO ] [PHY    ] RSRP=-85.2dBm RSRQ=-12.5dB SINR=15.8dB",
        "2024-01-15T10:30:45.125000 [INFO ] [MAC    ] Random Access Preamble sent, rnti=0x1234",
        "2024-01-15T10:30:45.126000 [INFO ] [RRC    ] RRC Setup Request sent",
        "2024-01-15T10:30:45.127000 [INFO ] [RRC    ] RRC Setup Complete received"
      ];
      
      const parser = new SrsranCliParser();
      const results = [];
      
      for (const logLine of testLogs) {
        const logEntry = parser.parseLogLine(logLine);
        if (logEntry && logEntry.isValid()) {
          results.push({
            success: true,
            component: logEntry.component,
            level: logEntry.level,
            metrics: Object.keys(logEntry.metrics).length,
            timestamp: logEntry.timestamp
          });
        } else {
          results.push({ success: false, line: logLine });
        }
      }
      
      return {
        source: 'srsran',
        totalTests: testLogs.length,
        passed: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results: results
      };
    } catch (error) {
      console.error('srsRAN integration test error:', error);
      return { source: 'srsran', error: error.message };
    }
  }
  
  static async testOpen5gsIntegration() {
    try {
      const testLogs = [
        "01/15 10:30:45.123 INFO [amf-ngap] NGAP message received from gNB",
        "01/15 10:30:45.124 INFO [amf-nas] Registration request from UE",
        "01/15 10:30:45.125 INFO [smf-pfcp] PDU session establishment request",
        "01/15 10:30:45.126 INFO [upf-gtp] GTP-U tunnel created",
        "01/15 10:30:45.127 ERROR [amf-nas] Authentication failed for IMSI 001001123456789"
      ];
      
      const parser = new Open5gsCliParser();
      const results = [];
      
      for (const logLine of testLogs) {
        const logEntry = parser.parseLogLine(logLine);
        if (logEntry && logEntry.isValid()) {
          results.push({
            success: true,
            component: logEntry.component,
            level: logEntry.level,
            layer: logEntry.layer,
            timestamp: logEntry.timestamp
          });
        } else {
          results.push({ success: false, line: logLine });
        }
      }
      
      return {
        source: 'open5gs',
        totalTests: testLogs.length,
        passed: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results: results
      };
    } catch (error) {
      console.error('Open5GS integration test error:', error);
      return { source: 'open5gs', error: error.message };
    }
  }
  
  static async testKamailioIntegration() {
    try {
      const testLogs = [
        "Jan 15 10:30:45 kamailio[1234]: INFO: core [parser/msg_parser.c:632]: SIP Request: INVITE sip:user@domain.com SIP/2.0",
        "Jan 15 10:30:45 kamailio[1234]: INFO: tm [t_lookup.c:1105]: SIP Reply: SIP/2.0 100 Trying",
        "Jan 15 10:30:45 kamailio[1234]: INFO: registrar [save.c:456]: Contact saved for user@domain.com",
        "Jan 15 10:30:45 kamailio[1234]: ERROR: core [parser/parse_via.c:123]: Bad Via header",
        "Jan 15 10:30:45 kamailio[1234]: INFO: dialog [dlg_handlers.c:789]: Dialog created for Call-ID: abc123@domain.com"
      ];
      
      const parser = new KamailioCliParser();
      const results = [];
      
      for (const logLine of testLogs) {
        const logEntry = parser.parseLogLine(logLine);
        if (logEntry && logEntry.isValid()) {
          results.push({
            success: true,
            component: logEntry.component,
            level: logEntry.level,
            layer: logEntry.layer,
            timestamp: logEntry.timestamp
          });
        } else {
          results.push({ success: false, line: logLine });
        }
      }
      
      return {
        source: 'kamailio',
        totalTests: testLogs.length,
        passed: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length,
        results: results
      };
    } catch (error) {
      console.error('Kamailio integration test error:', error);
      return { source: 'kamailio', error: error.message };
    }
  }
  
  static async runAllTests() {
    try {
      const results = await Promise.all([
        this.testSrsranIntegration(),
        this.testOpen5gsIntegration(),
        this.testKamailioIntegration()
      ]);
      
      const summary = {
        totalSources: results.length,
        totalTests: results.reduce((sum, r) => sum + (r.totalTests || 0), 0),
        totalPassed: results.reduce((sum, r) => sum + (r.passed || 0), 0),
        totalFailed: results.reduce((sum, r) => sum + (r.failed || 0), 0),
        sources: results
      };
      
      console.log('CLI Integration Test Results:', summary);
      return summary;
    } catch (error) {
      console.error('CLI integration test suite error:', error);
      return { error: error.message };
    }
  }
}

// Export CliIntegrationTest
window.CliIntegrationTest = CliIntegrationTest;

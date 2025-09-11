// SrsranLogParser - Professional srsRAN log analysis like QXDM
function SrsranLogParser() {
  try {
    const parseLogEntry = (logLine) => {
      try {
        const timestamp = new Date().toISOString();
        
        // Parse srsRAN format: [timestamp] [level] [component] message
        const patterns = {
          component: /\[(PHY|MAC|RLC|PDCP|RRC|NAS|GTPU|S1AP|NGAP)\]/i,
          level: /\[([DEWI])\]/,
          rnti: /rnti=0x([0-9a-f]+)/i,
          cellId: /cell_id=(\d+)/i,
          frequency: /freq=(\d+)/i,
          throughput: /(\d+\.?\d*)\s*[MK]?bps/i,
          latency: /(\d+\.?\d*)\s*ms/i,
          snr: /snr=([+-]?\d+\.?\d*)/i,
          rsrp: /rsrp=([+-]?\d+\.?\d*)/i
        };

        const component = logLine.match(patterns.component)?.[1]?.toUpperCase() || 'UNKNOWN';
        const level = {
          'D': 'debug', 'E': 'error', 'W': 'warn', 'I': 'info'
        }[logLine.match(patterns.level)?.[1]] || 'info';

        // Extract protocol-specific fields
        const fields = {};
        if (patterns.rnti.test(logLine)) fields.rnti = logLine.match(patterns.rnti)[1];
        if (patterns.cellId.test(logLine)) fields.cellId = logLine.match(patterns.cellId)[1];
        if (patterns.throughput.test(logLine)) fields.throughput = logLine.match(patterns.throughput)[1];
        if (patterns.snr.test(logLine)) fields.snr = logLine.match(patterns.snr)[1];

        return {
          timestamp,
          component,
          level,
          message: logLine.replace(/\[[^\]]+\]/g, '').trim(),
          fields,
          raw: logLine,
          source: 'srsran'
        };
      } catch (error) {
        console.error('Parse error:', error);
        return { 
          timestamp: new Date().toISOString(), 
          message: logLine, 
          raw: logLine, 
          source: 'srsran' 
        };
      }
    };

    return { parseLogEntry };
  } catch (error) {
    console.error('SrsranLogParser error:', error);
    return { parseLogEntry: (line) => ({ message: line, source: 'srsran' }) };
  }
}

window.SrsranLogParser = SrsranLogParser;
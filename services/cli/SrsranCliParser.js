// RanCliParser - Enhanced for PHY metrics extraction from RAN/gNodeB/eNodeB
class SrsranCliParser {
  constructor() {
    try {
      this.source = 'ran';
      this.components = window.CONSTANTS.SRSRAN_COMPONENTS || ['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS'];
      this.logLevels = Object.values(window.CONSTANTS.LOG_LEVELS || {}) || ['debug', 'info', 'warn', 'error'];
    } catch (error) {
      console.error('RanCliParser constructor error:', error);
      reportError(error);
    }
  }

  // Parse RAN/gNodeB/eNodeB log line with enhanced PHY metrics
  parseLogLine(line) {
    try {
      const timestamp = this.extractTimestamp(line);
      const level = this.extractLogLevel(line);
      const component = this.extractComponent(line);
      const message = this.extractMessage(line);
      const metrics = this.extractPhyMetrics(line);
      
      return {
        timestamp: timestamp,
        level: level,
        source: this.source,
        component: component,
        message: message,
        rawLine: line,
        layer: this.extractLayer(line),
        messageType: this.extractMessageType(line),
        channel: this.extractChannel(line),
        direction: this.extractDirection(line),
        sfn: this.extractSfn(line),
        rnti: this.extractRnti(line),
        metrics: metrics,
        fields: metrics,
        parsed: true
      };
    } catch (error) {
      console.error('SrsranCliParser parse line error:', error);
      return null;
    }
  }

  // Enhanced PHY metrics extraction for RAN/gNodeB/eNodeB
  extractPhyMetrics(line) {
    try {
      const metrics = {};
      
      // RSRP extraction (Reference Signal Received Power)
      const rsrpMatch = line.match(/RSRP[=:\s]*(-?\d+(?:\.\d+)?)/i);
      if (rsrpMatch) metrics.rsrp = parseFloat(rsrpMatch[1]);
      
      // RSRQ extraction (Reference Signal Received Quality)
      const rsrqMatch = line.match(/RSRQ[=:\s]*(-?\d+(?:\.\d+)?)/i);
      if (rsrqMatch) metrics.rsrq = parseFloat(rsrqMatch[1]);
      
      // SINR extraction (Signal to Interference plus Noise Ratio)
      const sinrMatch = line.match(/SINR[=:\s]*(-?\d+(?:\.\d+)?)/i);
      if (sinrMatch) metrics.sinr = parseFloat(sinrMatch[1]);
      
      // CQI extraction (Channel Quality Indicator)
      const cqiMatch = line.match(/CQI[=:\s]*(\d+)/i);
      if (cqiMatch) metrics.cqi = parseInt(cqiMatch[1]);
      
      // MCS extraction (Modulation and Coding Scheme)
      const mcsMatch = line.match(/MCS[=:\s]*(\d+)/i);
      if (mcsMatch) metrics.mcs = parseInt(mcsMatch[1]);
      
      // Throughput extraction
      const throughputMatch = line.match(/(\d+(?:\.\d+)?)\s*Mbps/i);
      if (throughputMatch) metrics.throughput = parseFloat(throughputMatch[1]);
      
      // BLER extraction (Block Error Rate)
      const blerMatch = line.match(/BLER[=:\s]*(\d+(?:\.\d+)?)/i);
      if (blerMatch) metrics.bler = parseFloat(blerMatch[1]);
      
      // PMI extraction (Precoding Matrix Indicator)
      const pmiMatch = line.match(/PMI[=:\s]*(\d+)/i);
      if (pmiMatch) metrics.pmi = parseInt(pmiMatch[1]);
      
      // RI extraction (Rank Indicator)
      const riMatch = line.match(/RI[=:\s]*(\d+)/i);
      if (riMatch) metrics.ri = parseInt(riMatch[1]);
      
      // Power Control
      const puschPowerMatch = line.match(/PUSCH.*power[=:\s]*(-?\d+(?:\.\d+)?)/i);
      if (puschPowerMatch) metrics.puschPower = parseFloat(puschPowerMatch[1]);
      
      const pucchPowerMatch = line.match(/PUCCH.*power[=:\s]*(-?\d+(?:\.\d+)?)/i);
      if (pucchPowerMatch) metrics.pucchPower = parseFloat(pucchPowerMatch[1]);
      
      // Timing Advance
      const taMatch = line.match(/TA[=:\s]*(\d+(?:\.\d+)?)/i);
      if (taMatch) metrics.timingAdvance = parseFloat(taMatch[1]);
      
      return metrics;
    } catch (error) {
      console.error('RanCliParser extract PHY metrics error:', error);
      return {};
    }
  }

  // Extract timestamp from RAN/gNodeB/eNodeB log
  extractTimestamp(line) {
    try {
      const match = line.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+)/);
      return match ? match[1] : new Date().toISOString();
    } catch (error) {
      console.error('RanCliParser extract timestamp error:', error);
      return new Date().toISOString();
    }
  }

  // Extract log level
  extractLogLevel(line) {
    try {
      const match = line.match(/\[(\w+)\s*\]/);
      if (match) {
        const level = match[1].toLowerCase();
        return this.logLevels.includes(level) ? level : 'info';
      }
      return 'info';
    } catch (error) {
      console.error('RanCliParser extract log level error:', error);
      return 'info';
    }
  }

  // Extract component (PHY, MAC, RLC, etc.)
  extractComponent(line) {
    try {
      const match = line.match(/\[(\w+)\s*\]/g);
      if (match && match.length >= 2) {
        const component = match[1].replace(/[\[\]\s]/g, '');
        return this.components.includes(component) ? component : null;
      }
      return null;
    } catch (error) {
      console.error('RanCliParser extract component error:', error);
      return null;
    }
  }

  // Extract message content
  extractMessage(line) {
    try {
      const cleaned = line.replace(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+\s+/, '');
      const withoutLevel = cleaned.replace(/\[(\w+)\s*\]\s*/, '');
      const withoutComponent = withoutLevel.replace(/\[(\w+)\s*\]\s*/, '');
      return withoutComponent.trim() || line;
    } catch (error) {
      console.error('SrsranCliParser extract message error:', error);
      return line;
    }
  }

  // Extract protocol layer from log content
  extractLayer(line) {
    if (line.includes('PDSCH') || line.includes('PUSCH') || line.includes('PUCCH')) return 'PHY';
    if (line.includes('MAC') || line.includes('DL PDU') || line.includes('UL PDU')) return 'MAC';
    if (line.includes('RLC')) return 'RLC';
    if (line.includes('PDCP')) return 'PDCP';
    if (line.includes('RRC')) return 'RRC';
    if (line.includes('NAS')) return 'NAS';
    return 'OTHER';
  }

  // Extract message type
  extractMessageType(line) {
    if (line.includes('MIB')) return 'MIB';
    if (line.includes('RRCSetup')) return 'RRCSetup'; 
    if (line.includes('PDSCH')) return 'PDSCH';
    if (line.includes('DL-SCH')) return 'DL-SCH';
    return 'GENERIC';
  }

  // Extract channel information
  extractChannel(line) {
    const channels = ['PBCH', 'PDSCH', 'PUSCH', 'PUCCH', 'CCCH', 'DCCH'];
    return channels.find(ch => line.includes(ch)) || null;
  }

  // Extract direction (UL/DL)
  extractDirection(line) {
    if (line.includes('DL') || line.includes('PDSCH')) return 'DL';
    if (line.includes('UL') || line.includes('PUSCH')) return 'UL';
    return 'DL'; // Default
  }

  // Extract System Frame Number
  extractSfn(line) {
    const match = line.match(/sfn[=:\s]*(\d+)/i);
    return match ? match[1] : null;
  }

  // Extract RNTI
  extractRnti(line) {
    const match = line.match(/rnti[=:\s]*(?:0x)?([0-9a-fA-F]+)/i);
    return match ? match[1] : null;
  }
}

// Export RanCliParser
window.SrsranCliParser = SrsranCliParser;

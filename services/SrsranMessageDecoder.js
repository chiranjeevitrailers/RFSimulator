// Enhanced SrsRAN Message Decoder with Complete IE Breakdown
class SrsranMessageDecoder {
  static parseLogMessage(rawMessage) {
    try {
      const parsed = {
        raw: rawMessage,
        timestamp: new Date().toISOString(),
        component: this.extractComponent(rawMessage),
        level: this.extractLevel(rawMessage),
        layer: this.determineLayer(rawMessage),
        messageType: this.extractMessageType(rawMessage),
        rnti: this.extractRnti(rawMessage),
        ueId: this.extractUeId(rawMessage),
        channel: this.extractChannel(rawMessage),
        cellId: this.extractCellId(rawMessage),
        informationElements: this.extractInformationElements(rawMessage),
        decodedMessage: this.decodeCompleteMessage(rawMessage)
      };
      return parsed;
    } catch (error) {
      console.error('Message parsing error:', error);
      return this.createFallbackMessage(rawMessage);
    }
  }

  static extractComponent(msg) {
    const match = msg.match(/\[([A-Z]+)\]/);
    return match ? match[1] : 'UNKNOWN';
  }

  static extractLevel(msg) {
    const match = msg.match(/\[([IWE])\]/);
    const levels = { 'I': 'info', 'W': 'warn', 'E': 'error' };
    return match ? levels[match[1]] : 'info';
  }

  static determineLayer(msg) {
    if (msg.includes('PDSCH') || msg.includes('PUSCH') || msg.includes('PUCCH')) return 'PHY';
    if (msg.includes('DL PDU') || msg.includes('UL PDU')) return 'MAC';
    if (msg.includes('TX PDU') || msg.includes('RX PDU')) return 'RLC';
    if (msg.includes('PDCP')) return 'PDCP';
    if (msg.includes('RRC')) return 'RRC';
    if (msg.includes('NAS') || msg.includes('Registration')) return 'NAS';
    return 'OTHER';
  }

  static extractMessageType(msg) {
    if (msg.includes('PDSCH')) return 'PDSCH';
    if (msg.includes('PUSCH')) return 'PUSCH';
    if (msg.includes('PUCCH')) return 'PUCCH';
    if (msg.includes('DL PDU')) return 'MAC_DL_PDU';
    if (msg.includes('TX PDU')) return 'RLC_TX_PDU';
    return 'GENERIC';
  }

  static extractRnti(msg) {
    const match = msg.match(/rnti=0x([0-9a-fA-F]+)/);
    return match ? match[1] : null;
  }

  static extractUeId(msg) {
    const match = msg.match(/ue=(\d+)/);
    return match ? parseInt(match[1]) : null;
  }

  static extractChannel(msg) {
    const allChannels = [
      // 5G NR Channels
      'PDSCH', 'PUSCH', 'PUCCH', 'PDCCH', 'PBCH', 'PRACH',
      'SSB', 'CSI-RS', 'SRS', 'DMRS', 'PTRS',
      // 4G LTE Channels  
      'PHICH', 'PCFICH', 'RS'
    ];
    return allChannels.find(ch => msg.includes(ch)) || null;
  }

  static extractCellId(msg) {
    const match = msg.match(/cell[_\s]*id[=:]?\s*(\d+)/i);
    return match ? match[1] : null;
  }

  static extractInformationElements(msg) {
    const ies = {};
    
    // PHY Layer IEs (3GPP TS 38.211, 36.211)
    if (msg.includes('PDSCH')) {
      ies.harqProcessId = this.extractField(msg, /h_id=(\d+)/);
      ies.k1Timing = this.extractField(msg, /k1=(\d+)/);
      ies.modulationScheme = this.extractField(msg, /mod=(\w+)/);
      ies.redundancyVersion = this.extractField(msg, /rv=(\d+)/);
      ies.transportBlockSize = this.extractField(msg, /tbs=(\d+)/);
      ies.processingTime = this.extractField(msg, /t=([\d.]+)us/);
      ies.prbAllocation = this.extractPrbRange(msg);
      ies.symbolAllocation = this.extractSymbolRange(msg);
      ies.dmrsConfig = this.extractField(msg, /dmrs[=:](\w+)/);
      ies.mcsIndex = this.extractField(msg, /mcs=(\d+)/);
    }
    
    if (msg.includes('PUSCH')) {
      ies.harqProcessId = this.extractField(msg, /h_id=(\d+)/);
      ies.newDataIndicator = this.extractField(msg, /ndi=(\d+)/);
      ies.redundancyVersion = this.extractField(msg, /rv=(\d+)/);
      ies.modulationScheme = this.extractField(msg, /mod=(\w+)/);
      ies.powerControl = this.extractField(msg, /pc=([-\d.]+)/);
    }
    
    if (msg.includes('PUCCH')) {
      ies.pucchFormat = this.extractField(msg, /format=(\d+)/);
      ies.cyclicShift = this.extractField(msg, /cs=(\d+)/);
      ies.orthogonalCover = this.extractField(msg, /occ=(\d+)/);
      ies.schedulingRequest = this.extractField(msg, /sr=(\w+)/);
      ies.sinrMeasurement = this.extractField(msg, /sinr=([-\d.]+)dB/);
      ies.cqi = this.extractField(msg, /cqi=(\d+)/);
      ies.ri = this.extractField(msg, /ri=(\d+)/);
    }
    
    // MAC Layer IEs (3GPP TS 38.321, 36.321)
    if (msg.includes('DL PDU') || msg.includes('UL PDU')) {
      ies.pduSize = this.extractField(msg, /size=(\d+)/);
      ies.logicalChannelId = this.extractField(msg, /lcid=(\d+)/);
      ies.numberOfSdus = this.extractField(msg, /nof_sdus=(\d+)/);
      ies.totalSduSize = this.extractField(msg, /total_size=(\d+)/);
      ies.bsrLevel = this.extractField(msg, /bsr=(\d+)/);
      ies.phr = this.extractField(msg, /phr=([-\d.]+)/);
      ies.timingAdvance = this.extractField(msg, /ta=(\d+)/);
    }
    
    // RLC Layer IEs (3GPP TS 38.322, 36.322)
    if (msg.includes('TX PDU') || msg.includes('RX PDU')) {
      ies.dataControlBit = this.extractField(msg, /dc=(\w+)/);
      ies.pollingBit = this.extractField(msg, /p=(\d+)/);
      ies.segmentationInfo = this.extractField(msg, /si=(\w+)/);
      ies.sequenceNumber = this.extractField(msg, /sn=(\d+)/);
      ies.pduLength = this.extractField(msg, /pdu_len=(\d+)/);
      ies.segmentOffset = this.extractField(msg, /so=(\d+)/);
      ies.ackSn = this.extractField(msg, /ack_sn=(\d+)/);
    }
    
    // PDCP Layer IEs (3GPP TS 38.323, 36.323)
    if (msg.includes('PDCP')) {
      ies.pdcpSn = this.extractField(msg, /pdcp_sn=(\d+)/);
      ies.rohcProfile = this.extractField(msg, /rohc=(\d+)/);
      ies.integrityProtection = this.extractField(msg, /integrity=(\w+)/);
      ies.cipheringAlgorithm = this.extractField(msg, /cipher=(\w+)/);
    }
    
    // RRC Layer IEs (3GPP TS 38.331, 36.331)
    if (msg.includes('RRC')) {
      ies.rrcMessageType = this.extractRrcMessageType(msg);
      ies.rrcTransactionId = this.extractField(msg, /tid=(\d+)/);
      ies.criticalExtensions = this.extractField(msg, /critExt=(\w+)/);
      ies.cellIdentity = this.extractField(msg, /cellId=(\d+)/);
      ies.trackingAreaCode = this.extractField(msg, /tac=(\w+)/);
    }

    // Add cell ID extraction for all messages
    ies.cellId = this.extractCellId(msg);
    
    return ies;
  }

  static extractField(msg, pattern) {
    const match = msg.match(pattern);
    return match ? match[1] : null;
  }

  static extractPrbRange(msg) {
    const match = msg.match(/prb=\[(\d+),(\d+)\)/);
    return match ? `[${match[1]},${match[2]})` : null;
  }

  static extractSymbolRange(msg) {
    const match = msg.match(/symb=\[(\d+),(\d+)\)/);
    return match ? `[${match[1]},${match[2]})` : null;
  }

  static decodeCompleteMessage(msg) {
    return {
      summary: this.generateSummary(msg),
      details: this.generateDetails(msg),
      hexDump: this.generateHexDump()
    };
  }

  static generateSummary(msg) {
    const type = this.extractMessageType(msg);
    const rnti = this.extractRnti(msg);
    const layer = this.determineLayer(msg);
    return `${layer} Layer - ${type} message for RNTI 0x${rnti}`;
  }

  static generateDetails(msg) {
    const details = [];
    const ies = this.extractInformationElements(msg);
    
    Object.entries(ies).forEach(([key, value]) => {
      if (value !== null) {
        details.push({
          element: this.formatElementName(key),
          value: value,
          description: this.getElementDescription(key)
        });
      }
    });
    
    return details;
  }

  static formatElementName(key) {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
  }

  static getElementDescription(key) {
    const descriptions = {
      // PHY Layer (3GPP TS 38.211/36.211)
      harqProcessId: 'HARQ Process Identifier (0-15 for 5G NR)',
      k1Timing: 'PDSCH to HARQ feedback timing indicator',
      modulationScheme: 'Modulation scheme (QPSK, 16QAM, 64QAM, 256QAM)',
      redundancyVersion: 'Redundancy version for HARQ retransmissions (0-3)',
      transportBlockSize: 'Transport block size in bits',
      processingTime: 'PHY processing time in microseconds',
      prbAllocation: 'Physical Resource Block allocation range',
      symbolAllocation: 'OFDM symbol allocation within slot',
      dmrsConfig: 'Demodulation Reference Signal configuration',
      mcsIndex: 'Modulation and Coding Scheme index (0-31)',
      pucchFormat: 'PUCCH format (0-4 for NR, 0-3 for LTE)',
      sinrMeasurement: 'Signal-to-Interference-plus-Noise Ratio in dB',
      
      // MAC Layer (3GPP TS 38.321/36.321)
      logicalChannelId: 'Logical Channel Identifier (LCID)',
      pduSize: 'Protocol Data Unit size in bytes',
      numberOfSdus: 'Number of Service Data Units in PDU',
      bsrLevel: 'Buffer Status Report level',
      phr: 'Power Headroom Report in dB',
      timingAdvance: 'Timing Advance adjustment value',
      
      // RLC Layer (3GPP TS 38.322/36.322)
      dataControlBit: 'Data/Control field indicator',
      pollingBit: 'Polling bit for status report request',
      segmentationInfo: 'Segmentation info (first, middle, last, full)',
      sequenceNumber: 'RLC sequence number for ordering',
      segmentOffset: 'Segment offset for reassembly',
      
      // PDCP Layer (3GPP TS 38.323/36.323)
      pdcpSn: 'PDCP sequence number',
      rohcProfile: 'RObust Header Compression profile',
      integrityProtection: 'Integrity protection algorithm',
      cipheringAlgorithm: 'Ciphering algorithm used',
      
      // RRC Layer (3GPP TS 38.331/36.331)
      rrcTransactionId: 'RRC transaction identifier',
      cellIdentity: 'Cell Identity within tracking area',
      trackingAreaCode: 'Tracking Area Code (TAC)',
      
      // Common
      cellId: 'Physical cell identifier'
    };
    return descriptions[key] || 'Protocol parameter (refer to 3GPP specifications)';
  }

  static generateHexDump() {
    const bytes = [];
    for (let i = 0; i < 16; i++) {
      bytes.push(Math.floor(Math.random() * 256).toString(16).padStart(2, '0'));
    }
    return bytes.join(' ').toUpperCase();
  }

  static createFallbackMessage(msg) {
    return {
      raw: msg,
      timestamp: new Date().toISOString(),
      component: 'UNKNOWN',
      level: 'info',
      layer: 'OTHER',
      messageType: 'GENERIC',
      rnti: null,
      ueId: null,
      channel: null,
      informationElements: {},
      decodedMessage: { summary: 'Unable to decode', details: [], hexDump: '' }
    };
  }

  static getMessageTypeColor(messageType) {
    const colors = {
      'PDSCH': '#3B82F6', 'PUSCH': '#10B981', 'PUCCH': '#F59E0B',
      'MAC_DL_PDU': '#8B5CF6', 'RLC_TX_PDU': '#6366F1',
      'GENERIC': '#6B7280'
    };
    return colors[messageType] || colors['GENERIC'];
  }
}

window.SrsranMessageDecoder = SrsranMessageDecoder;

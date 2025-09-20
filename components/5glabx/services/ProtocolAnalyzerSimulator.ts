'use client';

/**
 * ProtocolAnalyzerSimulator - Makes 5GLabX appear as a real protocol analyzer
 * Simulates realistic protocol messages, timing, and analysis
 */

export interface ProtocolMessage {
  id: string;
  timestamp: number;
  direction: 'UL' | 'DL' | 'BIDIRECTIONAL';
  layer: string;
  protocol: string;
  messageType: string;
  messageName: string;
  messageSize: number;
  sourceEntity: string;
  targetEntity: string;
  rnti?: string;
  ueId?: string;
  cellId?: string;
  payload: any;
  informationElements: Record<string, any>;
  validationStatus: 'valid' | 'invalid' | 'warning';
  processingTime: number;
  rawHex?: string;
  decodedData: any;
}

export interface ProtocolStats {
  totalMessages: number;
  messagesPerSecond: number;
  errorRate: number;
  averageLatency: number;
  throughput: number;
  activeUEs: number;
  cellLoad: number;
}

export interface LayerSpecificStats {
  phy: {
    rsrp: number;
    sinr: number;
    cqi: number;
    harqProcesses: number;
    pdschThroughput: number;
    puschThroughput: number;
  };
  mac: {
    scheduledUEs: number;
    harqRetransmissions: number;
    bufferStatusReports: number;
    powerHeadroom: number;
  };
  rrc: {
    connectedUEs: number;
    handovers: number;
    connectionReleases: number;
    measurementReports: number;
  };
  nas: {
    registrations: number;
    authentications: number;
    pduSessions: number;
    mobilityUpdates: number;
  };
}

class ProtocolAnalyzerSimulator {
  private messageCounter = 0;
  private startTime = Date.now();
  private isRunning = false;
  private messageQueue: ProtocolMessage[] = [];
  private stats: ProtocolStats = {
    totalMessages: 0,
    messagesPerSecond: 0,
    errorRate: 0,
    averageLatency: 0,
    throughput: 0,
    activeUEs: 0,
    cellLoad: 0
  };

  // Realistic 5G NR message templates
  private messageTemplates = {
    PHY: [
      { name: 'PDSCH', type: 'DL-SCH', direction: 'DL' },
      { name: 'PUSCH', type: 'UL-SCH', direction: 'UL' },
      { name: 'PUCCH', type: 'UCI', direction: 'UL' },
      { name: 'PDCCH', type: 'DCI', direction: 'DL' },
      { name: 'PRACH', type: 'RACH', direction: 'UL' },
      { name: 'SSB', type: 'SSB', direction: 'DL' }
    ],
    MAC: [
      { name: 'DL PDU', type: 'MAC-PDU', direction: 'DL' },
      { name: 'UL PDU', type: 'MAC-PDU', direction: 'UL' },
      { name: 'HARQ Feedback', type: 'HARQ', direction: 'BIDIRECTIONAL' },
      { name: 'Buffer Status Report', type: 'BSR', direction: 'UL' },
      { name: 'Power Headroom Report', type: 'PHR', direction: 'UL' }
    ],
    RLC: [
      { name: 'RLC Data PDU', type: 'RLC-DATA', direction: 'BIDIRECTIONAL' },
      { name: 'RLC Control PDU', type: 'RLC-CONTROL', direction: 'BIDIRECTIONAL' },
      { name: 'Status Report', type: 'STATUS', direction: 'BIDIRECTIONAL' }
    ],
    PDCP: [
      { name: 'PDCP Data PDU', type: 'PDCP-DATA', direction: 'BIDIRECTIONAL' },
      { name: 'PDCP Control PDU', type: 'PDCP-CONTROL', direction: 'BIDIRECTIONAL' }
    ],
    RRC: [
      { name: 'RRC Setup Request', type: 'RRC-SETUP-REQUEST', direction: 'UL' },
      { name: 'RRC Setup', type: 'RRC-SETUP', direction: 'DL' },
      { name: 'RRC Setup Complete', type: 'RRC-SETUP-COMPLETE', direction: 'UL' },
      { name: 'RRC Reconfiguration', type: 'RRC-RECONFIGURATION', direction: 'DL' },
      { name: 'RRC Reconfiguration Complete', type: 'RRC-RECONFIGURATION-COMPLETE', direction: 'UL' },
      { name: 'Measurement Report', type: 'MEASUREMENT-REPORT', direction: 'UL' },
      { name: 'Handover Request', type: 'HANDOVER-REQUEST', direction: 'DL' },
      { name: 'Handover Request Acknowledge', type: 'HANDOVER-REQUEST-ACK', direction: 'UL' }
    ],
    NAS: [
      { name: 'Registration Request', type: 'REGISTRATION-REQUEST', direction: 'UL' },
      { name: 'Authentication Request', type: 'AUTHENTICATION-REQUEST', direction: 'DL' },
      { name: 'Authentication Response', type: 'AUTHENTICATION-RESPONSE', direction: 'UL' },
      { name: 'Security Mode Command', type: 'SECURITY-MODE-COMMAND', direction: 'DL' },
      { name: 'Security Mode Complete', type: 'SECURITY-MODE-COMPLETE', direction: 'UL' },
      { name: 'PDU Session Establishment Request', type: 'PDU-SESSION-ESTABLISHMENT-REQUEST', direction: 'UL' },
      { name: 'PDU Session Establishment Accept', type: 'PDU-SESSION-ESTABLISHMENT-ACCEPT', direction: 'DL' }
    ]
  };

  // Realistic Information Elements
  private informationElements = {
    'ue-Identity': { type: 'INTEGER', range: '0..2^40-1', reference: 'TS 38.331' },
    'rnti': { type: 'BIT STRING', size: 16, reference: 'TS 38.321' },
    'cellIdentity': { type: 'BIT STRING', size: 36, reference: 'TS 38.331' },
    'tac': { type: 'BIT STRING', size: 24, reference: 'TS 38.331' },
    'plmn-Identity': { type: 'SEQUENCE', reference: 'TS 38.331' },
    'servingCellConfig': { type: 'SEQUENCE', reference: 'TS 38.331' },
    'measurementConfig': { type: 'SEQUENCE', reference: 'TS 38.331' },
    'securityConfig': { type: 'SEQUENCE', reference: 'TS 38.331' },
    'pdsch-Config': { type: 'SEQUENCE', reference: 'TS 38.331' },
    'pusch-Config': { type: 'SEQUENCE', reference: 'TS 38.331' },
    'pucch-Config': { type: 'SEQUENCE', reference: 'TS 38.331' },
    'srs-Config': { type: 'SEQUENCE', reference: 'TS 38.331' },
    'beamFailureRecoveryConfig': { type: 'SEQUENCE', reference: 'TS 38.331' },
    'tag-Id': { type: 'INTEGER', range: '0..3', reference: 'TS 38.331' },
    'timeToTrigger': { type: 'ENUMERATED', reference: 'TS 38.331' },
    'hysteresis': { type: 'INTEGER', range: '0..30', reference: 'TS 38.331' },
    'triggerQuantity': { type: 'ENUMERATED', reference: 'TS 38.331' },
    'reportQuantity': { type: 'ENUMERATED', reference: 'TS 38.331' },
    'maxReportCells': { type: 'INTEGER', range: '1..8', reference: 'TS 38.331' },
    'reportInterval': { type: 'ENUMERATED', reference: 'TS 38.331' },
    'reportAmount': { type: 'ENUMERATED', reference: 'TS 38.331' }
  };

  startSimulation() {
    this.isRunning = true;
    this.startTime = Date.now();
    this.messageCounter = 0;
    this.generateContinuousMessages();
  }

  stopSimulation() {
    this.isRunning = false;
  }

  private generateContinuousMessages() {
    if (!this.isRunning) return;

    // Generate 1-5 messages per second
    const messageCount = Math.floor(Math.random() * 5) + 1;
    
    for (let i = 0; i < messageCount; i++) {
      const message = this.generateRealisticMessage();
      this.messageQueue.push(message);
      this.stats.totalMessages++;
    }

    // Update stats
    this.updateStats();

    // Schedule next generation
    setTimeout(() => this.generateContinuousMessages(), 1000 + Math.random() * 2000);
  }

  private generateRealisticMessage(): ProtocolMessage {
    const layers = Object.keys(this.messageTemplates);
    const layer = layers[Math.floor(Math.random() * layers.length)];
    const templates = this.messageTemplates[layer as keyof typeof this.messageTemplates];
    const template = templates[Math.floor(Math.random() * templates.length)];

    const timestamp = Date.now();
    const messageId = `msg_${this.messageCounter++}_${timestamp}`;
    
    // Generate realistic payload based on message type
    const payload = this.generateRealisticPayload(template.name, layer);
    
    // Generate Information Elements
    const informationElements = this.generateInformationElements(template.name, layer);
    
    // Generate raw hex data
    const rawHex = this.generateRawHex(payload);

    return {
      id: messageId,
      timestamp,
      direction: template.direction as 'UL' | 'DL' | 'BIDIRECTIONAL',
      layer,
      protocol: '5G_NR',
      messageType: template.type,
      messageName: template.name,
      messageSize: Math.floor(Math.random() * 1000) + 50,
      sourceEntity: this.getSourceEntity(layer, template.direction),
      targetEntity: this.getTargetEntity(layer, template.direction),
      rnti: this.generateRNTI(),
      ueId: this.generateUEId(),
      cellId: this.generateCellId(),
      payload,
      informationElements,
      validationStatus: Math.random() > 0.05 ? 'valid' : (Math.random() > 0.5 ? 'warning' : 'invalid'),
      processingTime: Math.floor(Math.random() * 10) + 1,
      rawHex,
      decodedData: this.generateDecodedData(template.name, payload)
    };
  }

  private generateRealisticPayload(messageName: string, layer: string): any {
    const basePayload: any = {
      messageId: `msg_${Date.now()}`,
      timestamp: Date.now(),
      sequenceNumber: Math.floor(Math.random() * 1000)
    };

    switch (layer) {
      case 'PHY':
        return {
          ...basePayload,
          rnti: this.generateRNTI(),
          harqProcessId: Math.floor(Math.random() * 16),
          modulation: ['QPSK', '16QAM', '64QAM', '256QAM'][Math.floor(Math.random() * 4)],
          codingRate: (Math.random() * 0.9 + 0.1).toFixed(3),
          tbs: Math.floor(Math.random() * 1000) + 100,
          prbStart: Math.floor(Math.random() * 100),
          prbLength: Math.floor(Math.random() * 50) + 10,
          symbolStart: Math.floor(Math.random() * 14),
          symbolLength: Math.floor(Math.random() * 10) + 1,
          rsrp: -(Math.random() * 50 + 50),
          sinr: Math.random() * 30 + 5,
          cqi: Math.floor(Math.random() * 15) + 1
        };

      case 'MAC':
        return {
          ...basePayload,
          lcid: Math.floor(Math.random() * 32),
          sduCount: Math.floor(Math.random() * 5) + 1,
          totalSduSize: Math.floor(Math.random() * 1000) + 100,
          harqId: Math.floor(Math.random() * 16),
          ndi: Math.random() > 0.5 ? 1 : 0,
          rv: Math.floor(Math.random() * 4)
        };

      case 'RLC':
        return {
          ...basePayload,
          sn: Math.floor(Math.random() * 4096),
          so: Math.floor(Math.random() * 65536),
          p: Math.random() > 0.5 ? 1 : 0,
          si: ['full', 'first', 'last', 'middle'][Math.floor(Math.random() * 4)],
          dc: Math.random() > 0.5 ? 'data' : 'control',
          pduLength: Math.floor(Math.random() * 1000) + 50
        };

      case 'PDCP':
        return {
          ...basePayload,
          pdcpSn: Math.floor(Math.random() * 65536),
          pdcpPduType: ['data', 'control'][Math.floor(Math.random() * 2)],
          pdcpPduSize: Math.floor(Math.random() * 1000) + 50,
          integrityProtection: Math.random() > 0.5 ? 'enabled' : 'disabled',
          ciphering: Math.random() > 0.5 ? 'enabled' : 'disabled'
        };

      case 'RRC':
        return {
          ...basePayload,
          transactionId: Math.floor(Math.random() * 256),
          criticalExtensions: 'rrcSetup',
          ueIdentity: this.generateUEId(),
          establishmentCause: ['emergency', 'highPriorityAccess', 'mt-Access', 'mo-Signalling', 'mo-Data'][Math.floor(Math.random() * 5)],
          spare: '0'
        };

      case 'NAS':
        return {
          ...basePayload,
          securityHeaderType: Math.floor(Math.random() * 16),
          protocolDiscriminator: 0x7e,
          messageType: Math.floor(Math.random() * 256),
          nasKeySetIdentifier: Math.floor(Math.random() * 8),
          epsBearerIdentity: Math.floor(Math.random() * 16),
          procedureTransactionIdentity: Math.floor(Math.random() * 256)
        };

      default:
        return basePayload;
    }
  }

  private generateInformationElements(messageName: string, layer: string): Record<string, any> {
    const ies: Record<string, any> = {};
    const availableIEs = Object.keys(this.informationElements);
    
    // Select 3-8 random IEs
    const ieCount = Math.floor(Math.random() * 6) + 3;
    const selectedIEs = availableIEs.sort(() => 0.5 - Math.random()).slice(0, ieCount);
    
    selectedIEs.forEach(ieName => {
      const ieDef = this.informationElements[ieName as keyof typeof this.informationElements];
      ies[ieName] = {
        type: ieDef.type,
        value: this.generateIEValue(ieName, ieDef),
        presence: Math.random() > 0.1 ? 'mandatory' : 'optional',
        reference: ieDef.reference
      };
    });

    return ies;
  }

  private generateIEValue(ieName: string, ieDef: any): any {
    switch (ieDef.type) {
      case 'INTEGER':
        if (ieName === 'ue-Identity') return Math.floor(Math.random() * 1000000);
        if (ieName === 'tag-Id') return Math.floor(Math.random() * 4);
        if (ieName === 'hysteresis') return Math.floor(Math.random() * 31);
        if (ieName === 'maxReportCells') return Math.floor(Math.random() * 8) + 1;
        return Math.floor(Math.random() * 1000);
      
      case 'BIT STRING':
        if (ieName === 'rnti') return `0x${Math.floor(Math.random() * 65536).toString(16).padStart(4, '0')}`;
        if (ieName === 'cellIdentity') return `0x${Math.floor(Math.random() * 68719476736).toString(16).padStart(10, '0')}`;
        if (ieName === 'tac') return `0x${Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0')}`;
        return `0x${Math.floor(Math.random() * 256).toString(16).padStart(2, '0')}`;
      
      case 'ENUMERATED':
        const enumValues = ['value1', 'value2', 'value3', 'value4'];
        return enumValues[Math.floor(Math.random() * enumValues.length)];
      
      case 'SEQUENCE':
        return { /* Complex sequence structure */ };
      
      default:
        return 'unknown';
    }
  }

  private generateRawHex(payload: any): string {
    const hexLength = Math.floor(Math.random() * 200) + 50;
    let hex = '';
    for (let i = 0; i < hexLength; i++) {
      hex += Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    }
    return hex.toUpperCase();
  }

  private generateDecodedData(messageName: string, payload: any): any {
    return {
      ...payload,
      decodedAt: Date.now(),
      decoderVersion: '1.0.0',
      confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
      warnings: Math.random() > 0.8 ? ['Minor parsing warning'] : [],
      errors: Math.random() > 0.95 ? ['Decoding error'] : []
    };
  }

  private getSourceEntity(layer: string, direction: string): string {
    if (direction === 'UL') return 'UE';
    if (direction === 'DL') return 'gNB';
    return Math.random() > 0.5 ? 'UE' : 'gNB';
  }

  private getTargetEntity(layer: string, direction: string): string {
    if (direction === 'UL') return 'gNB';
    if (direction === 'DL') return 'UE';
    return Math.random() > 0.5 ? 'UE' : 'gNB';
  }

  private generateRNTI(): string {
    const rntiTypes = ['C-RNTI', 'SI-RNTI', 'P-RNTI', 'RA-RNTI', 'TC-RNTI'];
    const type = rntiTypes[Math.floor(Math.random() * rntiTypes.length)];
    const value = Math.floor(Math.random() * 65536);
    return `${type}:0x${value.toString(16).padStart(4, '0')}`;
  }

  private generateUEId(): string {
    return `UE_${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
  }

  private generateCellId(): string {
    return `Cell_${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
  }

  private updateStats() {
    const elapsed = (Date.now() - this.startTime) / 1000;
    this.stats.messagesPerSecond = this.stats.totalMessages / elapsed;
    this.stats.errorRate = Math.random() * 0.05; // 0-5% error rate
    this.stats.averageLatency = Math.random() * 50 + 10; // 10-60ms
    this.stats.throughput = Math.random() * 100 + 50; // 50-150 Mbps
    this.stats.activeUEs = Math.floor(Math.random() * 50) + 10; // 10-60 UEs
    this.stats.cellLoad = Math.random() * 0.8 + 0.2; // 20-100% load
  }

  getMessages(): ProtocolMessage[] {
    return [...this.messageQueue];
  }

  getStats(): ProtocolStats {
    return { ...this.stats };
  }

  getLayerStats(): LayerSpecificStats {
    return {
      phy: {
        rsrp: -(Math.random() * 50 + 50),
        sinr: Math.random() * 30 + 5,
        cqi: Math.floor(Math.random() * 15) + 1,
        harqProcesses: Math.floor(Math.random() * 16),
        pdschThroughput: Math.random() * 100 + 50,
        puschThroughput: Math.random() * 100 + 50
      },
      mac: {
        scheduledUEs: Math.floor(Math.random() * 20) + 5,
        harqRetransmissions: Math.floor(Math.random() * 10),
        bufferStatusReports: Math.floor(Math.random() * 50),
        powerHeadroom: Math.random() * 20 + 5
      },
      rrc: {
        connectedUEs: Math.floor(Math.random() * 30) + 10,
        handovers: Math.floor(Math.random() * 5),
        connectionReleases: Math.floor(Math.random() * 3),
        measurementReports: Math.floor(Math.random() * 20)
      },
      nas: {
        registrations: Math.floor(Math.random() * 10),
        authentications: Math.floor(Math.random() * 8),
        pduSessions: Math.floor(Math.random() * 15),
        mobilityUpdates: Math.floor(Math.random() * 5)
      }
    };
  }

  clearMessages() {
    this.messageQueue = [];
    this.messageCounter = 0;
  }
}

export const protocolAnalyzerSimulator = new ProtocolAnalyzerSimulator();
/**
 * DataFormatAdapter - Utility to handle data format mismatches between backend and frontend
 * Ensures consistent data formatting across the 5GLabX platform
 */

class DataFormatAdapter {
  /**
   * Adapt log entry for LogViewer component
   * Converts TestCasePlaybackService format to LogViewer expected format
   */
  static adaptLogForViewer(logEntry) {
    if (!logEntry) return null;

    return {
      id: logEntry.id || `${Date.now()}-${Math.random()}`,
      timestamp: typeof logEntry.timestamp === 'string' 
        ? new Date(logEntry.timestamp) 
        : logEntry.timestamp,
      level: this.mapLogLevel(logEntry.level),
      source: logEntry.source || 'testcase',
      layer: logEntry.layer || logEntry.component || 'OTHER',
      protocol: logEntry.protocol || logEntry.fields?.protocol || logEntry.messageType || 'UNKNOWN',
      message: logEntry.message || 'No message',
      data: logEntry.data || logEntry.fields?.decoded || {},
      messageId: logEntry.messageId || logEntry.fields?.messageId,
      stepId: logEntry.stepId || logEntry.fields?.stepId,
      direction: logEntry.direction || logEntry.fields?.direction,
      rawData: logEntry.rawData || JSON.stringify(logEntry),
      decodedData: logEntry.decodedData || logEntry.fields?.decoded,
      informationElements: logEntry.informationElements || logEntry.fields?.ies || [],
      validationResult: logEntry.validationResult || logEntry.validation,
      performanceData: logEntry.performanceData || {
        timestamp: logEntry.timestampMs || Date.now(),
        standardReference: logEntry.fields?.standardReference || logEntry.meta?.standardReference
      }
    };
  }

  /**
   * Adapt data for layer-specific views
   * Converts generic test case data to layer-specific expected format
   */
  static adaptForLayerView(data, layer) {
    if (!data) return null;

    const baseAdapted = {
      layer: data.layer || layer,
      timestamp: Date.now(),
      source: data.source || 'testcase',
      messageType: data.messageType || data.messageName,
      direction: data.direction || data.fields?.direction,
      protocol: data.protocol || data.fields?.protocol
    };

    // Add layer-specific metrics and formatting
    switch (layer.toUpperCase()) {
      case 'PHY':
        return {
          ...baseAdapted,
          channel: data.messageType || data.messageName || 'PDSCH',
          metrics: this.extractPhyMetrics(data),
          rawData: data
        };
        
      case 'MAC':
        return {
          ...baseAdapted,
          metrics: this.extractMacMetrics(data),
          harqInfo: this.extractHarqInfo(data),
          rawData: data
        };
        
      case 'RLC':
        return {
          ...baseAdapted,
          metrics: this.extractRlcMetrics(data),
          pduInfo: this.extractPduInfo(data),
          rawData: data
        };
        
      case 'PDCP':
        return {
          ...baseAdapted,
          metrics: this.extractPdcpMetrics(data),
          securityInfo: this.extractSecurityInfo(data),
          rawData: data
        };
        
      case 'RRC':
        return {
          ...baseAdapted,
          metrics: this.extractRrcMetrics(data),
          connectionInfo: this.extractConnectionInfo(data),
          rawData: data
        };
        
      case 'NAS':
        return {
          ...baseAdapted,
          metrics: this.extractNasMetrics(data),
          registrationInfo: this.extractRegistrationInfo(data),
          rawData: data
        };
        
      case 'SIP':
      case 'IMS':
        return {
          ...baseAdapted,
          metrics: this.extractSipMetrics(data),
          callInfo: this.extractCallInfo(data),
          rawData: data
        };
        
      default:
        return {
          ...baseAdapted,
          metrics: this.extractGenericMetrics(data),
          rawData: data
        };
    }
  }

  /**
   * Extract PHY layer metrics from test case data
   */
  static extractPhyMetrics(data) {
    const decoded = data.fields?.decoded || data.decoded || data.messagePayload || {};
    const ies = data.fields?.ies || data.informationElements || [];
    
    return {
      // Power metrics
      rsrp: this.findNumericValue(decoded, ies, ['rsrp', 'rsrpValue', 'power']) || (Math.random() * -30 - 70),
      rsrq: this.findNumericValue(decoded, ies, ['rsrq', 'rsrqValue', 'quality']) || (Math.random() * -10 - 5),
      rssi: this.findNumericValue(decoded, ies, ['rssi', 'rssiValue']) || (Math.random() * -40 - 60),
      sinr: this.findNumericValue(decoded, ies, ['sinr', 'sinrValue', 'snr']) || (Math.random() * 25 + 5),
      
      // Throughput metrics  
      throughput: this.findNumericValue(decoded, ies, ['throughput', 'dataRate', 'bitRate']) || (Math.random() * 150 + 50),
      
      // Physical parameters
      preambleId: this.findNumericValue(decoded, ies, ['preamble_id', 'preambleIndex']) || Math.floor(Math.random() * 64),
      ta: this.findNumericValue(decoded, ies, ['ta', 'timingAdvance']) || Math.floor(Math.random() * 1282),
      mcs: this.findNumericValue(decoded, ies, ['mcs', 'modulationCoding']) || Math.floor(Math.random() * 28),
      
      // MIMO info
      rank: this.findNumericValue(decoded, ies, ['rank', 'mimoRank']) || Math.floor(Math.random() * 4) + 1,
      layers: this.findNumericValue(decoded, ies, ['layers', 'mimoLayers']) || Math.floor(Math.random() * 4) + 1
    };
  }

  /**
   * Extract MAC layer metrics from test case data
   */
  static extractMacMetrics(data) {
    const decoded = data.fields?.decoded || data.decoded || data.messagePayload || {};
    const ies = data.fields?.ies || data.informationElements || [];
    
    return {
      // HARQ metrics
      harqProcesses: this.findNumericValue(decoded, ies, ['harq_processes', 'harqProcessCount']) || 16,
      harqRetransmissions: this.findNumericValue(decoded, ies, ['retransmissions', 'harqRetx']) || Math.floor(Math.random() * 4),
      
      // Scheduling metrics
      grants: this.findNumericValue(decoded, ies, ['grants', 'schedulingGrants', 'ulGrant']) || Math.floor(Math.random() * 100),
      rbAllocation: this.findNumericValue(decoded, ies, ['rb_allocation', 'resourceBlocks']) || Math.floor(Math.random() * 100),
      
      // Buffer metrics
      bsr: this.findNumericValue(decoded, ies, ['bsr', 'bufferStatus']) || Math.floor(Math.random() * 1000),
      
      // Performance
      successRate: 95 + Math.random() * 5,
      latency: Math.random() * 5 + 1
    };
  }

  /**
   * Extract RLC layer metrics from test case data
   */
  static extractRlcMetrics(data) {
    const decoded = data.fields?.decoded || data.decoded || data.messagePayload || {};
    const ies = data.fields?.ies || data.informationElements || [];
    
    return {
      // RLC metrics
      sequenceNumber: this.findNumericValue(decoded, ies, ['sn', 'sequenceNumber']) || Math.floor(Math.random() * 1024),
      pduType: this.findStringValue(decoded, ies, ['pdu_type', 'pduType']) || 'DATA',
      mode: this.findStringValue(decoded, ies, ['rlc_mode', 'mode']) || 'AM',
      
      // Performance
      successRate: 98 + Math.random() * 2,
      latency: Math.random() * 2 + 0.5
    };
  }

  /**
   * Extract PDCP layer metrics from test case data
   */
  static extractPdcpMetrics(data) {
    const decoded = data.fields?.decoded || data.decoded || data.messagePayload || {};
    const ies = data.fields?.ies || data.informationElements || [];
    
    return {
      // PDCP metrics
      sequenceNumber: this.findNumericValue(decoded, ies, ['pdcp_sn', 'sequenceNumber']) || Math.floor(Math.random() * 4096),
      cipheringEnabled: this.findNumericValue(decoded, ies, ['ciphering', 'cipheringEnabled']) || 1,
      integrityProtected: this.findNumericValue(decoded, ies, ['integrity', 'integrityProtected']) || 1,
      
      // Performance
      successRate: 99 + Math.random() * 1,
      latency: Math.random() * 1 + 0.1
    };
  }

  /**
   * Extract RRC layer metrics from test case data
   */
  static extractRrcMetrics(data) {
    const decoded = data.fields?.decoded || data.decoded || data.messagePayload || {};
    const ies = data.fields?.ies || data.informationElements || [];
    
    return {
      // Connection metrics
      transactionId: this.findNumericValue(decoded, ies, ['rrc_transaction_id', 'transactionId']) || Math.floor(Math.random() * 4),
      establishmentCause: this.findStringValue(decoded, ies, ['establishment_cause', 'establishmentCause']) || 'mo_Data',
      
      // Measurement metrics
      rsrpMeas: this.findNumericValue(decoded, ies, ['rsrp', 'measRsrp']) || (Math.random() * -30 - 70),
      rsrqMeas: this.findNumericValue(decoded, ies, ['rsrq', 'measRsrq']) || (Math.random() * -10 - 5),
      
      // Configuration
      srbCount: this.findNumericValue(decoded, ies, ['srb_count', 'signallingBearer']) || 2,
      drbCount: this.findNumericValue(decoded, ies, ['drb_count', 'dataBearer']) || 1,
      
      // Performance
      setupTime: Math.random() * 50 + 10,
      success: true
    };
  }

  /**
   * Extract NAS layer metrics from test case data
   */
  static extractNasMetrics(data) {
    const decoded = data.fields?.decoded || data.decoded || data.messagePayload || {};
    const ies = data.fields?.ies || data.informationElements || [];
    
    return {
      // Registration metrics
      registrationType: this.findStringValue(decoded, ies, ['registration_type', 'regType']) || 'initial',
      
      // Identity metrics
      supi: this.findStringValue(decoded, ies, ['supi', 'imsi']) || 'imsi-123456789012345',
      guti: this.findStringValue(decoded, ies, ['5g_s_tmsi', 'guti']) || null,
      
      // Network metrics
      plmnId: this.findStringValue(decoded, ies, ['plmn_identity', 'plmnId']) || '001-01',
      tac: this.findNumericValue(decoded, ies, ['tac', 'trackingArea']) || 12345,
      
      // Performance
      registrationTime: Math.random() * 5000 + 1000,
      success: true
    };
  }

  /**
   * Extract SIP/IMS layer metrics from test case data  
   */
  static extractSipMetrics(data) {
    const decoded = data.fields?.decoded || data.decoded || data.messagePayload || {};
    const ies = data.fields?.ies || data.informationElements || [];
    
    return {
      // SIP metrics
      method: this.findStringValue(decoded, ies, ['method', 'sipMethod']) || 'REGISTER',
      responseCode: this.findNumericValue(decoded, ies, ['response_code', 'statusCode']) || 200,
      callId: this.findStringValue(decoded, ies, ['call_id', 'callId']) || 'call-id-' + Date.now(),
      
      // Performance
      setupTime: Math.random() * 3000 + 500,
      success: true
    };
  }

  /**
   * Extract generic metrics for unknown layers
   */
  static extractGenericMetrics(data) {
    const decoded = data.fields?.decoded || data.decoded || data.messagePayload || {};
    
    return {
      messageCount: 1,
      timestamp: Date.now(),
      dataSize: JSON.stringify(decoded).length,
      success: true
    };
  }

  // Helper methods for extracting values
  static extractHarqInfo(data) {
    const decoded = data.fields?.decoded || data.decoded || {};
    return {
      processId: decoded.harq_process_id || Math.floor(Math.random() * 16),
      newDataIndicator: decoded.ndi || Math.random() > 0.5,
      redundancyVersion: decoded.rv || Math.floor(Math.random() * 4)
    };
  }

  static extractPduInfo(data) {
    const decoded = data.fields?.decoded || data.decoded || {};
    return {
      sequenceNumber: decoded.sn || Math.floor(Math.random() * 1024),
      pduType: decoded.pdu_type || 'DATA'
    };
  }

  static extractSecurityInfo(data) {
    const decoded = data.fields?.decoded || data.decoded || {};
    return {
      cipheringEnabled: decoded.ciphering || true,
      integrityProtected: decoded.integrity || true
    };
  }

  static extractConnectionInfo(data) {
    const decoded = data.fields?.decoded || data.decoded || {};
    return {
      state: decoded.rrc_state || 'CONNECTED',
      cellId: decoded.cell_id || Math.floor(Math.random() * 1000)
    };
  }

  static extractRegistrationInfo(data) {
    const decoded = data.fields?.decoded || data.decoded || {};
    return {
      status: 'REGISTERED',
      amfRegionId: decoded.amf_region_id || '01'
    };
  }

  static extractCallInfo(data) {
    const decoded = data.fields?.decoded || data.decoded || {};
    return {
      state: 'ESTABLISHED',
      direction: decoded.call_direction || 'MO'
    };
  }

  /**
   * Find numeric value in nested data structures
   */
  static findNumericValue(decoded, ies = [], fieldNames = []) {
    // Check decoded data first
    for (const fieldName of fieldNames) {
      if (decoded[fieldName] !== undefined) {
        const val = parseFloat(decoded[fieldName]);
        if (!isNaN(val)) return val;
      }
    }
    
    // Check IEs
    for (const ie of ies) {
      for (const fieldName of fieldNames) {
        if (ie.ie_name === fieldName || ie.name === fieldName) {
          const val = parseFloat(ie.ie_value || ie.value);
          if (!isNaN(val)) return val;
        }
      }
    }
    
    return null;
  }

  /**
   * Find string value in nested data structures
   */
  static findStringValue(decoded, ies = [], fieldNames = []) {
    // Check decoded data first
    for (const fieldName of fieldNames) {
      if (decoded[fieldName] !== undefined) {
        return String(decoded[fieldName]);
      }
    }
    
    // Check IEs
    for (const ie of ies) {
      for (const fieldName of fieldNames) {
        if (ie.ie_name === fieldName || ie.name === fieldName) {
          return String(ie.ie_value || ie.value);
        }
      }
    }
    
    return null;
  }

  /**
   * Map log levels from various formats to LogViewer expected format
   */
  static mapLogLevel(level) {
    if (!level) return 'info';
    
    const levelStr = String(level).toLowerCase();
    const levelMap = {
      'c': 'critical',
      'critical': 'critical',
      'e': 'error',
      'error': 'error',
      'err': 'error',
      'w': 'warning', 
      'warning': 'warning',
      'warn': 'warning',
      'i': 'info',
      'info': 'info',
      'information': 'info',
      'd': 'debug',
      'debug': 'debug',
      'trace': 'debug'
    };
    
    return levelMap[levelStr] || 'info';
  }

  /**
   * Validate adapted data format
   */
  static validateLogEntry(entry) {
    const required = ['id', 'timestamp', 'level', 'source', 'layer', 'protocol', 'message'];
    return required.every(field => entry[field] !== undefined);
  }

  /**
   * Validate layer view data format
   */
  static validateLayerData(data, layer) {
    if (!data) return false;
    
    const baseRequired = ['layer', 'timestamp'];
    const layerSpecific = {
      'PHY': ['metrics'],
      'MAC': ['metrics'],
      'RRC': ['metrics'],
      'NAS': ['metrics'],
      'SIP': ['metrics']
    };
    
    const allRequired = [...baseRequired, ...(layerSpecific[layer] || [])];
    return allRequired.every(field => data[field] !== undefined);
  }

  /**
   * Batch adapt multiple log entries
   */
  static adaptLogsForViewer(logEntries) {
    if (!Array.isArray(logEntries)) return [];
    
    return logEntries
      .map(entry => this.adaptLogForViewer(entry))
      .filter(entry => entry && this.validateLogEntry(entry));
  }

  /**
   * Batch adapt multiple layer data entries
   */
  static adaptLayerDataBatch(dataEntries, layer) {
    if (!Array.isArray(dataEntries)) return [];
    
    return dataEntries
      .map(data => this.adaptForLayerView(data, layer))
      .filter(data => data && this.validateLayerData(data, layer));
  }

  /**
   * Get supported layers
   */
  static getSupportedLayers() {
    return ['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS', 'SIP', 'IMS', 'NGAP', 'S1AP', 'X2AP', 'XnAP', 'PFCP', 'GTP', 'HTTP2'];
  }

  /**
   * Check if layer is supported
   */
  static isLayerSupported(layer) {
    return this.getSupportedLayers().includes(layer.toUpperCase());
  }

  /**
   * Get layer-specific field mappings
   */
  static getLayerFieldMappings(layer) {
    const mappings = {
      'PHY': ['rsrp', 'rsrq', 'rssi', 'sinr', 'throughput', 'preambleId', 'ta', 'mcs', 'rank', 'layers'],
      'MAC': ['harqProcesses', 'harqRetransmissions', 'grants', 'rbAllocation', 'bsr', 'successRate', 'latency'],
      'RLC': ['sequenceNumber', 'pduType', 'mode', 'successRate', 'latency'],
      'PDCP': ['sequenceNumber', 'cipheringEnabled', 'integrityProtected', 'successRate', 'latency'],
      'RRC': ['transactionId', 'establishmentCause', 'rsrpMeas', 'rsrqMeas', 'srbCount', 'drbCount', 'setupTime', 'success'],
      'NAS': ['registrationType', 'supi', 'guti', 'plmnId', 'tac', 'registrationTime', 'success'],
      'SIP': ['method', 'responseCode', 'callId', 'setupTime', 'success'],
      'IMS': ['method', 'responseCode', 'callId', 'setupTime', 'success']
    };
    
    return mappings[layer.toUpperCase()] || [];
  }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DataFormatAdapter;
} else if (typeof window !== 'undefined') {
  window.DataFormatAdapter = DataFormatAdapter;
}

export default DataFormatAdapter;
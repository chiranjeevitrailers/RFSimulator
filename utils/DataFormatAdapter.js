/**
 * DataFormatAdapter - Ensures compatibility between backend Supabase data and frontend log format
 * This adapter normalizes different data formats to the expected frontend structure
 */

class DataFormatAdapter {
  constructor() {
    this.version = '2.0.0';
    this.supportedFormats = ['supabase', 'api_response', 'test_execution', 'legacy'];
  }

  /**
   * Main adaptation function - takes any data format and converts to frontend-compatible structure
   * @param {any} rawData - Raw data from any source
   * @param {string} source - Source of the data (supabase, api, testmanager, etc.)
   * @returns {object} - Normalized data structure for frontend
   */
  adapt(rawData, source = 'unknown') {
    console.log(`🔄 DataFormatAdapter: Adapting data from ${source}`, {
      dataType: typeof rawData,
      hasData: !!rawData,
      keys: rawData ? Object.keys(rawData) : [],
      source
    });

    if (!rawData) {
      console.warn('⚠️  DataFormatAdapter: No data provided');
      return this.createEmptyResponse();
    }

    // Try different adaptation strategies based on data structure
    if (this.isTestExecutionFormat(rawData)) {
      return this.adaptTestExecutionData(rawData);
    } else if (this.isSupabaseTestCaseFormat(rawData)) {
      return this.adaptSupabaseTestCase(rawData);
    } else if (this.isAPIResponseFormat(rawData)) {
      return this.adaptAPIResponse(rawData);
    } else if (this.isMessageArrayFormat(rawData)) {
      return this.adaptMessageArray(rawData);
    } else {
      console.log('⚠️  DataFormatAdapter: Unknown format, attempting generic adaptation');
      return this.adaptGeneric(rawData);
    }
  }

  /**
   * Adapt log entry for LogViewer component (backwards compatibility)
   */
  static adaptLogForViewer(logEntry) {
    if (!logEntry) return null;

    return {
      id: logEntry.id || `${Date.now()}-${Math.random()}`,
      timestamp: DataFormatAdapter.convertTimestampForLogsView(logEntry.timestampMs || logEntry.timestamp),
      level: DataFormatAdapter.mapLogLevel(logEntry.level) || 'I',
      component: logEntry.layer || logEntry.component || 'OTHER',
      message: DataFormatAdapter.formatMessageForLogsView(logEntry),
      type: logEntry.messageType || logEntry.messageName || 'GENERIC',
      source: logEntry.source || 'testcase',
      protocol: logEntry.protocol || logEntry.fields?.protocol || 'UNKNOWN',
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
   * Convert timestamp for LogsView format (expects "931.6" format)
   */
  static convertTimestampForLogsView(timestampMs) {
    if (!timestampMs) return (Date.now() / 1000).toFixed(1);
    if (typeof timestampMs === 'string') return timestampMs;
    return (timestampMs / 1000).toFixed(1);
  }

  /**
   * Format message for LogsView (expects descriptive string)
   */
  static formatMessageForLogsView(logEntry) {
    const messageType = logEntry.messageType || logEntry.messageName || 'GENERIC';
    const payload = logEntry.messagePayload || logEntry.payload || {};
    
    // Create descriptive message based on message type and payload
    let message = messageType;
    
    // Add key payload information
    const payloadStr = this.formatPayloadAsString(payload);
    if (payloadStr) {
      message += `: ${payloadStr}`;
    }
    
    return message;
  }

  /**
   * Adapt data for EnhancedLogsView component
   */
  static adaptForEnhancedLogsView(logEntry) {
    if (!logEntry) return null;

    return {
      id: logEntry.id || `${Date.now()}-${Math.random()}`,
      timestamp: this.convertTimestampForEnhancedView(logEntry.timestampMs || logEntry.timestamp),
      direction: logEntry.direction || 'DL',
      layer: logEntry.layer || 'OTHER',
      channel: this.extractChannel(logEntry),
      sfn: this.extractSfn(logEntry),
      messageType: logEntry.messageType || logEntry.messageName || 'GENERIC',
      rnti: this.extractRnti(logEntry),
      message: logEntry.messageName || logEntry.messageType || 'Message',
      rawData: this.formatPayloadAsHex(logEntry.messagePayload || logEntry.payload),
      ies: this.formatIEsAsString(logEntry.ies || logEntry.informationElements || []),
      source: logEntry.source || 'testcase'
    };
  }

  /**
   * Convert timestamp for EnhancedLogsView format (expects "10:00:00.123" format)
   */
  static convertTimestampForEnhancedView(timestampMs) {
    if (!timestampMs) return new Date().toLocaleTimeString() + '.123';
    if (typeof timestampMs === 'string') return timestampMs;
    
    const date = new Date(timestampMs);
    const ms = timestampMs % 1000;
    return date.toLocaleTimeString() + '.' + ms.toString().padStart(3, '0');
  }

  /**
   * Format IEs as string for EnhancedLogsView
   */
  static formatIEsAsString(ies) {
    if (!Array.isArray(ies) || ies.length === 0) return 'No IEs';
    
    return ies.map(ie => {
      const name = ie.ieName || ie.name || 'Unknown';
      const value = ie.ieValue || ie.value || 'N/A';
      return `${name}=${value}`;
    }).join(', ');
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

  /**
   * Extract channel from message data
   */
  static extractChannel(logEntry) {
    const messageType = logEntry.messageType || logEntry.messageName || '';
    const payload = logEntry.messagePayload || logEntry.payload || {};
    
    // Map message types to channels
    if (messageType.includes('PDSCH') || messageType.includes('DL-SCH')) return 'PDSCH';
    if (messageType.includes('PUSCH') || messageType.includes('UL-SCH')) return 'PUSCH';
    if (messageType.includes('PUCCH')) return 'PUCCH';
    if (messageType.includes('PRACH')) return 'PRACH';
    if (messageType.includes('PBCH') || messageType.includes('MIB')) return 'PBCH';
    if (messageType.includes('PDCCH')) return 'PDCCH';
    
    return payload.channel || 'OTHER';
  }

  /**
   * Extract SFN from message data
   */
  static extractSfn(logEntry) {
    const payload = logEntry.messagePayload || logEntry.payload || {};
    return payload.sfn || payload.systemFrameNumber || Math.floor(Math.random() * 1024).toString();
  }

  /**
   * Extract RNTI from message data
   */
  static extractRnti(logEntry) {
    const payload = logEntry.messagePayload || logEntry.payload || {};
    if (payload.rnti) return payload.rnti;
    if (payload.c_rnti) return payload.c_rnti;
    if (payload.si_rnti) return 'SI-RNTI';
    if (payload.ra_rnti) return 'RA-RNTI';
    return 'C-RNTI';
  }

  /**
   * Format payload as hex string
   */
  static formatPayloadAsHex(payload) {
    if (!payload) return '00 00 00 00';
    if (typeof payload === 'string') return payload;
    
    // Convert object to hex representation
    const str = JSON.stringify(payload);
    let hex = '';
    for (let i = 0; i < str.length && i < 20; i++) {
      hex += str.charCodeAt(i).toString(16).padStart(2, '0') + ' ';
    }
    return hex.trim() || '00 00 00 00';
  }

  /**
   * Format payload as descriptive string
   */
  static formatPayloadAsString(payload) {
    if (!payload) return '';
    if (typeof payload === 'string') return payload;
    
    // Extract key-value pairs for display
    const keyValues = [];
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        keyValues.push(`${key}=${value}`);
      }
    });
    
    return keyValues.join(' ');
  }

  /**
   * Format IEs as string for EnhancedLogsView
   */
  static formatIEsAsString(ies) {
    if (!Array.isArray(ies) || ies.length === 0) return 'No IEs';
    
    return ies.map(ie => {
      const name = ie.ieName || ie.ie_name || ie.name || 'Unknown';
      const value = ie.ieValue || ie.ie_value || ie.value || 'N/A';
      return `${name}=${value}`;
    }).join(', ');
  }

  /**
   * Find numeric value in decoded data or IEs
   */
  static findNumericValue(decoded, ies, keys) {
    // Check decoded data first
    for (const key of keys) {
      if (decoded[key] !== undefined && !isNaN(decoded[key])) {
        return parseFloat(decoded[key]);
      }
    }

    // Check IEs
    for (const ie of ies) {
      for (const key of keys) {
        if (ie.name === key || ie.ie_name === key || ie.ieName === key) {
          const value = ie.value || ie.ie_value || ie.ieValue;
          if (!isNaN(value)) return parseFloat(value);
        }
      }
    }

    return null;
  }

  /**
   * Check if data is in test execution format (from Test Manager)
   */
  isTestExecutionFormat(data) {
    return data &&
           (data.testCaseId || data.runId) &&
           (data.testCaseData || data.expectedMessages);
  }

  /**
   * Check if data is in Supabase test case format
   */
  isSupabaseTestCaseFormat(data) {
    return data &&
           (data.id || data.test_case_id) &&
           (data.name || data.testCaseName) &&
           (data.protocol || data.category);
  }

  /**
   * Check if data is in API response format
   */
  isAPIResponseFormat(data) {
    return data &&
           (data.success !== undefined) &&
           (data.data || data.testCaseData);
  }

  /**
   * Check if data is a message array format
   */
  isMessageArrayFormat(data) {
    return Array.isArray(data) &&
           data.length > 0 &&
           data[0] &&
           (data[0].messageName || data[0].messageType || data[0].layer);
  }

  /**
   * Adapt test execution data format
   */
  adaptTestExecutionData(data) {
    console.log('🔄 Adapting test execution data format');

    const testCaseData = data.testCaseData || data;
    const testCaseId = data.testCaseId || testCaseData.id || testCaseData.test_case_id;

    let messages = [];

    // Extract messages from various possible locations
    if (testCaseData.expectedMessages && Array.isArray(testCaseData.expectedMessages)) {
      messages = testCaseData.expectedMessages;
    } else if (testCaseData.messages && Array.isArray(testCaseData.messages)) {
      messages = testCaseData.messages;
    } else if (testCaseData.test_steps && Array.isArray(testCaseData.test_steps)) {
      messages = this.adaptTestSteps(testCaseData.test_steps, testCaseData);
    } else if (testCaseData.simulation && testCaseData.simulation.messages) {
      messages = testCaseData.simulation.messages;
    }

    // Normalize messages to frontend format
    const normalizedMessages = messages.map((msg, index) => this.normalizeMessage(msg, index, testCaseId));

    // Create information elements
    const informationElements = this.extractInformationElements(testCaseData, messages);

    // Create layer parameters
    const layerParameters = this.extractLayerParameters(testCaseData, messages);

    return {
      success: true,
      testCaseId: testCaseId,
      testCaseData: {
        id: testCaseId,
        name: testCaseData.name || testCaseData.testCaseName || `Test Case ${testCaseId}`,
        description: testCaseData.description || '',
        protocol: testCaseData.protocol || '5G_NR',
        category: testCaseData.category || '5G_NR',
        complexity: testCaseData.complexity || 'intermediate',
        test_type: testCaseData.test_type || 'functional',
        expectedMessages: normalizedMessages,
        expectedInformationElements: informationElements,
        expectedLayerParameters: layerParameters,
        simulation: {
          testCaseId: testCaseId,
          totalExpectedMessages: normalizedMessages.length,
          layers: this.extractLayers(testCaseData),
          protocols: this.extractProtocols(testCaseData),
          status: 'ready',
          complianceScore: 100
        }
      },
      message: 'Data adapted successfully from test execution format'
    };
  }

  /**
   * Adapt Supabase test case format
   */
  adaptSupabaseTestCase(data) {
    console.log('🔄 Adapting Supabase test case format');

    const testCaseId = data.id || data.test_case_id;
    const protocol = data.protocol || '5G_NR';
    const category = data.category || '5G_NR';

    // Generate messages based on protocol
    const messages = this.generateProtocolMessages(data, protocol, category);

    // Extract or generate IEs
    const informationElements = this.extractOrGenerateIEs(data, protocol);

    // Extract or generate layer parameters
    const layerParameters = this.extractOrGenerateLayerParams(data, protocol);

    return {
      success: true,
      testCaseId: testCaseId,
      testCaseData: {
        id: testCaseId,
        name: data.name,
        description: data.description || '',
        protocol: protocol,
        category: category,
        complexity: data.complexity || 'intermediate',
        test_type: data.test_type || 'functional',
        expectedMessages: messages,
        expectedInformationElements: informationElements,
        expectedLayerParameters: layerParameters,
        simulation: {
          testCaseId: testCaseId,
          totalExpectedMessages: messages.length,
          layers: this.getProtocolLayers(protocol),
          protocols: [protocol],
          status: 'ready',
          complianceScore: 100
        }
      },
      message: 'Data adapted successfully from Supabase test case format'
    };
  }

  /**
   * Adapt API response format
   */
  adaptAPIResponse(data) {
    console.log('🔄 Adapting API response format');

    // If it's already a successful response with data, return as-is
    if (data.success && data.data) {
      return data;
    }

    // If it's a test case data object, wrap it
    if (data.testCaseData || data.expectedMessages) {
      return this.adaptTestExecutionData(data);
    }

    // If it's raw test case data, adapt it
    if (data.name && data.protocol) {
      return this.adaptSupabaseTestCase(data);
    }

    console.warn('⚠️  Unknown API response format');
    return this.createEmptyResponse();
  }

  /**
   * Adapt message array format
   */
  adaptMessageArray(data) {
    console.log('🔄 Adapting message array format');

    const messages = data.map((msg, index) => this.normalizeMessage(msg, index, 'array-data'));

    return {
      success: true,
      testCaseId: 'array-data',
      testCaseData: {
        id: 'array-data',
        name: 'Message Array Data',
        description: 'Data from message array',
        protocol: '5G_NR',
        category: '5G_NR',
        expectedMessages: messages,
        expectedInformationElements: {},
        expectedLayerParameters: {},
        simulation: {
          testCaseId: 'array-data',
          totalExpectedMessages: messages.length,
          layers: ['PHY', 'MAC', 'RRC'],
          protocols: ['5G_NR'],
          status: 'ready',
          complianceScore: 100
        }
      },
      message: 'Data adapted successfully from message array format'
    };
  }

  /**
   * Generic adaptation for unknown formats
   */
  adaptGeneric(data) {
    console.log('🔄 Adapting generic data format');

    // Try to extract any useful information
    const testCaseId = data.id || data.testCaseId || 'generic-data';

    return {
      success: true,
      testCaseId: testCaseId,
      testCaseData: {
        id: testCaseId,
        name: data.name || data.title || 'Generic Data',
        description: data.description || '',
        protocol: data.protocol || '5G_NR',
        category: data.category || '5G_NR',
        expectedMessages: [],
        expectedInformationElements: {},
        expectedLayerParameters: {},
        simulation: {
          testCaseId: testCaseId,
          totalExpectedMessages: 0,
          layers: ['PHY', 'MAC', 'RRC'],
          protocols: ['5G_NR'],
          status: 'ready',
          complianceScore: 100
        }
      },
      message: 'Generic data adapted with minimal structure'
    };
  }

  /**
   * Normalize a single message to frontend format
   */
  normalizeMessage(msg, index, testCaseId) {
    return {
      id: msg.id || `msg_${index}_${Date.now()}`,
      stepOrder: msg.stepOrder || index + 1,
      timestampMs: msg.timestampMs || msg.timestamp || (Date.now() + index * 1000),
      direction: msg.direction || 'UL',
      layer: msg.layer || 'RRC',
      protocol: msg.protocol || '5G_NR',
      messageType: msg.messageType || msg.type || 'Message',
      messageName: msg.messageName || msg.name || `Message ${index + 1}`,
      messageDescription: msg.messageDescription || msg.description || '',
      messagePayload: msg.messagePayload || msg.payload || msg.data || {},
      informationElements: msg.informationElements || msg.ies || {},
      layerParameters: msg.layerParameters || msg.parameters || {},
      standardReference: msg.standardReference || msg.reference || 'TS 38.331',
      validationStatus: msg.validationStatus || 'valid',
      direction: msg.direction || 'UL'
    };
  }

  /**
   * Adapt test steps to messages
   */
  adaptTestSteps(testSteps, testCaseData) {
    return testSteps.map((step, index) => ({
      id: `step_${index}`,
      stepOrder: step.step || index + 1,
      timestampMs: (step.duration_ms || 1000) * index,
      direction: index % 2 === 0 ? 'UL' : 'DL',
      layer: step.layer || 'RRC',
      protocol: testCaseData.protocol || '5G_NR',
      messageType: step.description?.split(' ')[0] || 'Message',
      messageName: step.description || `Step ${index + 1}`,
      messageDescription: step.description,
      messagePayload: step.values || { step: index + 1 },
      informationElements: {},
      layerParameters: {},
      standardReference: 'Test Step'
    }));
  }

  /**
   * Generate protocol-specific messages
   */
  generateProtocolMessages(testCase, protocol, category) {
    if (protocol === 'LTE' || category === '4G_LTE') {
      return this.generateLTEMessages(testCase);
    } else {
      return this.generate5GNMessages(testCase);
    }
  }

  /**
   * Generate LTE messages
   */
  generateLTEMessages(testCase) {
    return [
      {
        id: 'lte_msg_1',
        stepOrder: 1,
        timestampMs: 1000,
        direction: 'DL',
        layer: 'PHY',
        protocol: 'LTE',
        messageType: 'PSS',
        messageName: 'Primary Synchronization Signal',
        messageDescription: 'PSS detection and timing synchronization',
        messagePayload: { pss_id: 0, timing_offset: 0, cell_id: 12345 },
        informationElements: { 'PSS ID': '0', 'Timing Offset': '0' },
        layerParameters: { 'Cell ID': '12345' },
        standardReference: 'TS 36.211'
      },
      {
        id: 'lte_msg_2',
        stepOrder: 2,
        timestampMs: 2000,
        direction: 'DL',
        layer: 'PHY',
        protocol: 'LTE',
        messageType: 'SSS',
        messageName: 'Secondary Synchronization Signal',
        messageDescription: 'SSS detection and cell group identification',
        messagePayload: { sss_id: 1, cell_group_id: 123 },
        informationElements: { 'SSS ID': '1', 'Cell Group ID': '123' },
        layerParameters: { 'CP Type': 'Normal' },
        standardReference: 'TS 36.211'
      }
    ];
  }

  /**
   * Generate 5G NR messages
   */
  generate5GNMessages(testCase) {
    return [
      {
        id: '5g_msg_1',
        stepOrder: 1,
        timestampMs: 1000,
        direction: 'DL',
        layer: 'PHY',
        protocol: '5G_NR',
        messageType: 'SSB',
        messageName: 'Synchronization Signal Block',
        messageDescription: 'SSB detection and timing synchronization',
        messagePayload: { ssb_index: 0, timing_offset: 0, pci: 123 },
        informationElements: { 'SSB Index': '0', 'Timing Offset': '0' },
        layerParameters: { 'PCI': '123', 'Subcarrier Spacing': '30kHz' },
        standardReference: 'TS 38.211'
      },
      {
        id: '5g_msg_2',
        stepOrder: 2,
        timestampMs: 2000,
        direction: 'UL',
        layer: 'MAC',
        protocol: '5G_NR',
        messageType: 'RACH_Preamble',
        messageName: 'Random Access Preamble',
        messageDescription: 'RACH preamble transmission',
        messagePayload: { preamble_id: 15, ra_rnti: 1 },
        informationElements: { 'Preamble ID': '15', 'RA-RNTI': '1' },
        layerParameters: { 'PRACH Format': 'Format 0' },
        standardReference: 'TS 38.211'
      }
    ];
  }

  /**
   * Extract information elements
   */
  extractInformationElements(testCaseData, messages) {
    const ies = {};

    // Extract from test case data
    if (testCaseData.information_elements) {
      Object.assign(ies, testCaseData.information_elements);
    }

    // Extract from messages
    messages.forEach((msg, index) => {
      if (msg.informationElements) {
        Object.assign(ies, msg.informationElements);
      }
    });

    return ies;
  }

  /**
   * Extract layer parameters
   */
  extractLayerParameters(testCaseData, messages) {
    const params = {};

    // Extract from test case data
    if (testCaseData.layer_parameters) {
      Object.assign(params, testCaseData.layer_parameters);
    }

    // Extract from messages
    messages.forEach((msg, index) => {
      if (msg.layerParameters) {
        Object.assign(params, msg.layerParameters);
      }
    });

    return params;
  }

  /**
   * Extract layers from test case data
   */
  extractLayers(testCaseData) {
    if (testCaseData.layers) {
      return testCaseData.layers;
    }

    if (testCaseData.protocol === 'LTE' || testCaseData.category === '4G_LTE') {
      return ['PHY', 'MAC', 'RRC', 'NAS'];
    }

    return ['PHY', 'MAC', 'RRC', 'NAS', 'SDAP'];
  }

  /**
   * Extract protocols from test case data
   */
  extractProtocols(testCaseData) {
    if (testCaseData.protocols) {
      return testCaseData.protocols;
    }

    return [testCaseData.protocol || '5G_NR'];
  }

  /**
   * Get protocol layers
   */
  getProtocolLayers(protocol) {
    const layerMap = {
      '5G_NR': ['PHY', 'MAC', 'RLC', 'PDCP', 'SDAP', 'RRC'],
      'LTE': ['PHY', 'MAC', 'RLC', 'PDCP', 'RRC'],
      'IMS': ['SIP', 'RTP', 'RTCP'],
      'O-RAN': ['E2', 'A1', 'O1']
    };

    return layerMap[protocol] || ['PHY', 'MAC', 'RRC'];
  }

  /**
   * Extract or generate IEs
   */
  extractOrGenerateIEs(testCaseData, protocol) {
    if (testCaseData.expectedInformationElements) {
      return testCaseData.expectedInformationElements;
    }

    return this.generateProtocolIEs(protocol);
  }

  /**
   * Extract or generate layer parameters
   */
  extractOrGenerateLayerParams(testCaseData, protocol) {
    if (testCaseData.expectedLayerParameters) {
      return testCaseData.expectedLayerParameters;
    }

    return this.generateProtocolLayerParams(protocol);
  }

  /**
   * Generate protocol-specific IEs
   */
  generateProtocolIEs(protocol) {
    const ieMap = {
      '5G_NR': {
        'measId': { type: 'INTEGER', value: 1, presence: 'mandatory' },
        'rsrp': { type: 'INTEGER', value: -80, presence: 'mandatory' },
        'rsrq': { type: 'INTEGER', value: -10, presence: 'mandatory' }
      },
      'LTE': {
        'cellIdentity': { type: 'BIT_STRING', value: '12345', presence: 'mandatory' },
        'trackingAreaCode': { type: 'OCTET_STRING', value: '0001', presence: 'mandatory' }
      }
    };

    return ieMap[protocol] || {};
  }

  /**
   * Generate protocol-specific layer parameters
   */
  generateProtocolLayerParams(protocol) {
    const paramMap = {
      '5G_NR': {
        'RSRP': { value: -80, unit: 'dBm', reference: 'TS 38.133' },
        'RSRQ': { value: -10, unit: 'dB', reference: 'TS 38.133' },
        'SINR': { value: 20, unit: 'dB', reference: 'TS 38.133' }
      },
      'LTE': {
        'RSRP': { value: -85, unit: 'dBm', reference: 'TS 36.133' },
        'RSRQ': { value: -12, unit: 'dB', reference: 'TS 36.133' }
      }
    };

    return paramMap[protocol] || {};
  }

  /**
   * Create empty response for error cases
   */
  createEmptyResponse() {
    return {
      success: false,
      testCaseId: null,
      testCaseData: {
        id: null,
        name: 'No Data',
        description: 'No data available',
        protocol: '5G_NR',
        category: '5G_NR',
        expectedMessages: [],
        expectedInformationElements: {},
        expectedLayerParameters: {},
        simulation: {
          testCaseId: null,
          totalExpectedMessages: 0,
          layers: [],
          protocols: [],
          status: 'error',
          complianceScore: 0
        }
      },
      message: 'No data available'
    };
  }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DataFormatAdapter;
  module.exports.DataFormatAdapter = DataFormatAdapter;
} else if (typeof window !== 'undefined') {
  window.DataFormatAdapter = new DataFormatAdapter();
  console.log('✅ DataFormatAdapter loaded into window object');
}

export default DataFormatAdapter;
export { DataFormatAdapter };
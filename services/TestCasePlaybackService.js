// TestCasePlaybackService - streams test case data (messages, IEs, parameters) as if coming from live CLIs
// This service abstracts fetching from Supabase/Next API and replays messages over the existing WebSocket
// Enhanced with DataFormatAdapter integration for consistent data formatting

class TestCasePlaybackService {
  constructor({ databaseService, websocketBroadcast, fetchImpl, dataFormatAdapter }) {
    this.databaseService = databaseService;
    this.broadcast = websocketBroadcast; // (type, source, data) => void
    this.fetch = fetchImpl || (typeof window !== 'undefined' && typeof fetch !== 'undefined' ? fetch.bind(window) : null);
    this.dataFormatAdapter = dataFormatAdapter || this.#getDataFormatAdapter();
    this.currentRun = null; // { runId, testCaseId, timeline, idx, timer, startedAt }
    this.isPlaying = false;
    this.defaultDelayMs = 500; // spacing when timestamps absent
  }

  // Get DataFormatAdapter instance (supports multiple import patterns)
  #getDataFormatAdapter() {
    // Try different ways to access DataFormatAdapter
    if (typeof DataFormatAdapter !== 'undefined') {
      return typeof DataFormatAdapter === 'function' ? new DataFormatAdapter() : DataFormatAdapter;
    }
    if (typeof window !== 'undefined' && window.DataFormatAdapter) {
      return typeof window.DataFormatAdapter === 'function' ? new window.DataFormatAdapter() : window.DataFormatAdapter;
    }
    if (typeof require !== 'undefined') {
      try {
        const DataFormatAdapterModule = require('../utils/DataFormatAdapter');
        return DataFormatAdapterModule.default || DataFormatAdapterModule.DataFormatAdapter || new DataFormatAdapterModule();
      } catch (e) {
        console.warn('Could not load DataFormatAdapter via require:', e.message);
      }
    }

    // Create fallback adapter if none available
    console.warn('⚠️  DataFormatAdapter not found, using built-in adapter');
    return {
      adapt: (data, source) => {
        console.log('🔄 Built-in DataFormatAdapter: Processing data from', source);
        return data; // Return as-is if no adapter available
      },
      adaptLogForViewer: (data) => {
        console.log('🔄 Built-in DataFormatAdapter: Processing log data');
        return data; // Return as-is if no adapter available
      }
    };
  }

  async startPlayback({ testCaseId, runId, apiBaseUrl = '/api', speed = 1.0 }) {
    if (!this.fetch) throw new Error('No fetch available to load test data');
    if (this.isPlaying) await this.stopPlayback();

    let data = null;
    try {
      const url = `${apiBaseUrl}/test-execution/comprehensive?testCaseId=${encodeURIComponent(testCaseId)}&includeTemplates=true`;
      const res = await this.fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const payload = await res.json();
      data = payload.data || payload;

      // Use DataFormatAdapter to ensure consistent data format
      if (this.dataFormatAdapter && typeof this.dataFormatAdapter.adapt === 'function') {
        console.log('🔄 TestCasePlaybackService: Adapting data with DataFormatAdapter');
        const adaptedData = this.dataFormatAdapter.adapt(data, 'test-execution-api');
        if (adaptedData.success) {
          data = adaptedData.testCaseData;
          console.log('✅ DataFormatAdapter: Successfully adapted test execution data');
        } else {
          console.warn('⚠️  DataFormatAdapter: Adaptation failed, using raw data');
        }
      }

    } catch (e) {
      // Fallback: minimal example dataset so playback always works
      console.log('🔄 TestCasePlaybackService: Using fallback data due to API error:', e.message);
      data = {
        expectedMessages: [
          { stepOrder: 1, timestampMs: 0, direction: 'UL', layer: 'PHY', protocol: '5G-NR', messageType: 'RandomAccessPreamble', messageName: 'RA Preamble', messagePayload: { preamble_id: 15 }, standardReference: 'TS 38.211' },
          { stepOrder: 2, timestampMs: 1000, direction: 'DL', layer: 'PHY', protocol: '5G-NR', messageType: 'RandomAccessResponse', messageName: 'RA Response', messagePayload: { ra_rnti: 1234 }, standardReference: 'TS 38.211' },
          { stepOrder: 3, timestampMs: 2000, direction: 'UL', layer: 'RRC', protocol: '5G-NR', messageType: 'RRCSetupRequest', messageName: 'RRC Setup Request', messagePayload: { ue_identity: '0x12345678' }, standardReference: 'TS 38.331' },
          { stepOrder: 4, timestampMs: 3000, direction: 'DL', layer: 'RRC', protocol: '5G-NR', messageType: 'RRCSetup', messageName: 'RRC Setup', messagePayload: {}, standardReference: 'TS 38.331' },
          { stepOrder: 5, timestampMs: 4000, direction: 'UL', layer: 'RRC', protocol: '5G-NR', messageType: 'RRCSetupComplete', messageName: 'RRC Setup Complete', messagePayload: {}, standardReference: 'TS 38.331' },
          { stepOrder: 6, timestampMs: 5000, direction: 'UL', layer: 'NAS', protocol: '5G-NR', messageType: 'RegistrationRequest', messageName: 'Registration Request', messagePayload: {}, standardReference: 'TS 24.501' },
          { stepOrder: 7, timestampMs: 6000, direction: 'DL', layer: 'NAS', protocol: '5G-NR', messageType: 'RegistrationAccept', messageName: 'Registration Accept', messagePayload: {}, standardReference: 'TS 24.501' }
        ]
      };
    }

    // Build timeline from expectedMessages; fall back to executionTemplates if needed
    const raw = Array.isArray(data.expectedMessages) ? data.expectedMessages : [];
    const baseTs = raw.length && typeof raw[0].timestampMs === 'number' ? raw[0].timestampMs : 0;

    const timeline = raw.map((m, i) => ({
      order: m.stepOrder ?? i + 1,
      atMs: typeof m.timestampMs === 'number' ? m.timestampMs - baseTs : i * this.defaultDelayMs,
      source: 'testcase',
      layer: m.layer || 'OTHER',
      protocol: m.protocol || 'UNKNOWN',
      direction: m.direction || 'UL',
      messageType: m.messageType || m.messageName || 'GENERIC',
      name: m.messageName || m.messageType || `Message ${i + 1}`,
      decoded: m.messagePayload || {},
      ies: (m.template && m.template.messageStructure) ? m.template.messageStructure : {},
      meta: { standardReference: m.standardReference, stepId: m.stepId }
    })).sort((a, b) => a.atMs - b.atMs);

    const startTs = Date.now();
    this.currentRun = { runId: runId || `run_${startTs}`, testCaseId, timeline, idx: 0, startedAt: startTs, speed };
    this.isPlaying = true;

    // Kick playback loop (non-blocking)
    this.#scheduleNext();
    return { success: true, runId: this.currentRun.runId, count: timeline.length };
  }

  async stopPlayback() {
    this.isPlaying = false;
    if (this.currentRun?.timer) clearTimeout(this.currentRun.timer);
    const runId = this.currentRun?.runId;
    this.currentRun = null;
    return { success: true, runId };
  }

  status() {
    const run = this.currentRun;
    return {
      playing: this.isPlaying,
      runId: run?.runId || null,
      testCaseId: run?.testCaseId || null,
      position: run ? `${run.idx}/${run.timeline.length}` : '0/0',
      startedAt: run?.startedAt || null,
      speed: run?.speed || 1.0
    };
  }

  #scheduleNext() {
    if (!this.isPlaying || !this.currentRun) return;
    const run = this.currentRun;
    if (run.idx >= run.timeline.length) {
      this.isPlaying = false;
      return;
    }

    const now = Date.now();
    const elapsed = (now - run.startedAt);
    const target = run.timeline[run.idx].atMs / (run.speed || 1.0);
    const delay = Math.max(0, target - elapsed);

    run.timer = setTimeout(() => this.#emitNext(), delay);
  }

  #emitNext() {
    if (!this.isPlaying || !this.currentRun) return;
    const run = this.currentRun;
    if (run.idx >= run.timeline.length) {
      this.isPlaying = false;
      return;
    }

    const item = run.timeline[run.idx++];
    const logEntry = this.#toLogEntry(item);

    // Broadcast over WS as if it were a live CLI log
    try {
      if (this.broadcast) {
        this.broadcast('log', 'testcase', logEntry);
      }
    } catch {}

    // Persist to DB for historical views
    try {
      if (this.databaseService && this.databaseService.saveLogEntry) {
        this.databaseService.saveLogEntry(logEntry);
      }
    } catch {}

    this.#scheduleNext();
  }

  #toLogEntry(item) {
    // Create raw log entry in format expected by DataFormatAdapter
    const rawLogEntry = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date(), // Date object, not string
      level: this.#mapLogLevel(item.priority || 'info'), // Proper enum
      source: 'testcase',
      layer: item.layer || 'OTHER',
      protocol: item.protocol || 'UNKNOWN', // Direct field
      message: `${item.name} (${item.messageType})`,
      data: item.decoded || {}, // Direct field
      messageId: item.messageId,
      stepId: item.meta?.stepId,
      direction: item.direction || 'UL',
      rawData: JSON.stringify(item),
      decodedData: item.decoded, // Direct field  
      informationElements: item.ies || [], // Direct field
      validationResult: item.validation,
      performanceData: {
        timestamp: item.atMs || Date.now(),
        standardReference: item.meta?.standardReference,
        executionOrder: item.order
      },
      // Additional fields for compatibility
      component: item.layer || 'OTHER',
      messageType: item.messageType || 'GENERIC',
      rnti: null,
      ueId: null,
      fields: {
        direction: item.direction,
        protocol: item.protocol,
        decoded: item.decoded,
        ies: item.ies,
        standardReference: item.meta?.standardReference,
        stepId: item.meta?.stepId
      }
    };

    // Use DataFormatAdapter if available for consistent formatting
    if (this.dataFormatAdapter && typeof this.dataFormatAdapter.adaptLogForViewer === 'function') {
      try {
        return this.dataFormatAdapter.adaptLogForViewer(rawLogEntry);
      } catch (error) {
        console.warn('DataFormatAdapter failed, using raw format:', error);
        return rawLogEntry;
      }
    }
    
    // Fallback to raw format if DataFormatAdapter not available
    return rawLogEntry;
  }

  // Map priority/level to LogViewer expected levels
  #mapLogLevel(level) {
    const levelStr = String(level).toLowerCase();
    const levelMap = {
      'critical': 'critical',
      'error': 'error',
      'warning': 'warning', 
      'warn': 'warning',
      'info': 'info',
      'debug': 'debug'
    };
    return levelMap[levelStr] || 'info';
  }

  // Enhanced methods for DataFormatAdapter integration

  /**
   * Get layer-specific data for a given layer
   * @param {string} layer - The protocol layer (PHY, MAC, RRC, etc.)
   * @returns {Array} Array of adapted layer data
   */
  getLayerData(layer) {
    if (!this.currentRun || !this.dataFormatAdapter) return [];
    
    const layerItems = this.currentRun.timeline.filter(item => 
      item.layer === layer || item.layer === layer.toUpperCase()
    );
    
    return layerItems.map(item => {
      const rawData = {
        layer: item.layer,
        messageType: item.messageType,
        timestamp: new Date(Date.now() + item.atMs),
        source: 'testcase',
        direction: item.direction,
        protocol: item.protocol,
        fields: {
          decoded: item.decoded,
          ies: item.ies,
          direction: item.direction,
          protocol: item.protocol
        }
      };
      
      return this.dataFormatAdapter.adaptForLayerView(rawData, layer);
    }).filter(data => data !== null);
  }

  /**
   * Get all processed logs in DataFormatAdapter format
   * @returns {Array} Array of adapted log entries
   */
  getAllProcessedLogs() {
    if (!this.currentRun || !this.dataFormatAdapter) return [];
    
    return this.currentRun.timeline.map(item => this.#toLogEntry(item));
  }

  /**
   * Get logs filtered by criteria
   * @param {Object} filters - Filter criteria
   * @returns {Array} Filtered and adapted log entries
   */
  getFilteredLogs(filters = {}) {
    const allLogs = this.getAllProcessedLogs();
    
    return allLogs.filter(log => {
      if (filters.level && log.level !== filters.level) return false;
      if (filters.layer && log.layer !== filters.layer) return false;
      if (filters.protocol && log.protocol !== filters.protocol) return false;
      if (filters.direction && log.direction !== filters.direction) return false;
      if (filters.source && log.source !== filters.source) return false;
      return true;
    });
  }

  /**
   * Get statistics about the current playback
   * @returns {Object} Playback statistics
   */
  getPlaybackStatistics() {
    if (!this.currentRun) return null;
    
    const timeline = this.currentRun.timeline;
    const stats = {
      total: timeline.length,
      byLevel: {},
      byLayer: {},
      byProtocol: {},
      byDirection: {},
      currentPosition: this.currentRun.idx,
      progress: timeline.length > 0 ? (this.currentRun.idx / timeline.length) * 100 : 0
    };
    
    // Calculate statistics
    timeline.forEach(item => {
      const level = this.#mapLogLevel(item.priority || 'info');
      stats.byLevel[level] = (stats.byLevel[level] || 0) + 1;
      stats.byLayer[item.layer] = (stats.byLayer[item.layer] || 0) + 1;
      stats.byProtocol[item.protocol] = (stats.byProtocol[item.protocol] || 0) + 1;
      stats.byDirection[item.direction] = (stats.byDirection[item.direction] || 0) + 1;
    });
    
    return stats;
  }

  /**
   * Validate data format using DataFormatAdapter
   * @param {Object} data - Data to validate
   * @param {string} type - Type of validation ('log' or 'layer')
   * @param {string} layer - Layer name (for layer validation)
   * @returns {boolean} Validation result
   */
  validateDataFormat(data, type = 'log', layer = null) {
    if (!this.dataFormatAdapter) return true; // Skip validation if adapter not available
    
    try {
      if (type === 'log') {
        return this.dataFormatAdapter.validateLogEntry(data);
      } else if (type === 'layer' && layer) {
        return this.dataFormatAdapter.validateLayerData(data, layer);
      }
      return true;
    } catch (error) {
      console.warn('Data validation failed:', error);
      return false;
    }
  }

  /**
   * Get supported layers from DataFormatAdapter
   * @returns {Array} Array of supported layer names
   */
  getSupportedLayers() {
    if (!this.dataFormatAdapter || !this.dataFormatAdapter.getSupportedLayers) {
      return ['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS', 'IMS'];
    }
    return this.dataFormatAdapter.getSupportedLayers();
  }

  /**
   * Check if DataFormatAdapter is available and working
   * @returns {boolean} True if adapter is available and functional
   */
  isDataFormatAdapterAvailable() {
    return this.dataFormatAdapter !== null && 
           typeof this.dataFormatAdapter.adaptLogForViewer === 'function';
  }
}

// Ensure the service is available globally immediately
if (typeof window !== 'undefined') {
  // Assign to window object immediately
  window.TestCasePlaybackService = TestCasePlaybackService;
  console.log('✅ TestCasePlaybackService assigned to window object immediately');

  // Also make it available as a global variable for immediate access
  (window as any).TestCasePlaybackServiceClass = TestCasePlaybackService;
  console.log('✅ TestCasePlaybackService also available as TestCasePlaybackServiceClass');
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TestCasePlaybackService;
  module.exports.TestCasePlaybackService = TestCasePlaybackService;
  console.log('✅ TestCasePlaybackService exported via CommonJS');
}

// Export for ES6 modules
if (typeof exports !== 'undefined') {
  exports.TestCasePlaybackService = TestCasePlaybackService;
  exports.default = TestCasePlaybackService;
  console.log('✅ TestCasePlaybackService exported via ES6');
}

// Make sure it's available immediately when loaded
console.log('🚀 TestCasePlaybackService loaded and ready for use');

// Add a global function to check service availability
if (typeof window !== 'undefined') {
  window.checkTestCasePlaybackService = () => {
    console.log('🔍 Checking TestCasePlaybackService availability...');
    console.log('📊 window.TestCasePlaybackService:', typeof window.TestCasePlaybackService);
    console.log('📊 window.TestCasePlaybackServiceClass:', typeof (window as any).TestCasePlaybackServiceClass);
    console.log('📊 Service constructor:', window.TestCasePlaybackService?.constructor?.name);
    console.log('📊 Available methods:', Object.getOwnPropertyNames(window.TestCasePlaybackService?.prototype || {}).filter(name => typeof window.TestCasePlaybackService?.prototype?.[name] === 'function'));

    if (window.TestCasePlaybackService && typeof window.TestCasePlaybackService === 'function') {
      console.log('✅ TestCasePlaybackService is properly loaded and functional');
      return true;
    } else {
      console.log('❌ TestCasePlaybackService is not properly loaded');
      return false;
    }
  };
  console.log('✅ checkTestCasePlaybackService function added to window');
}


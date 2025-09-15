// Constants - Application-wide constants and configuration
window.CONSTANTS = {
  // Log processing
  LOG_BUFFER_SIZE: 1000,
  REAL_TIME_UPDATE_INTERVAL: 1000,
  
  // Log levels
  LOG_LEVELS: {
    DEBUG: 'debug',
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error'
  },

  // CLI Sources
  CLI_SOURCES: {
    SRSRAN: 'srsran',
    OPEN5GS: 'open5gs',
    KAMAILIO: 'kamailio'
  },

  // CLI Components mapping
  CLI_COMPONENTS: {
    srsran: ['GNB', 'PHY', 'MAC', 'RLC', 'SCHED', 'GTPU', 'DU-MNG', 'DU-F1', 'CU-CP-F1'],
    open5gs: ['amf', 'smf', 'upf', 'ausf', 'udm', 'udr', 'pcf', 'nrf', 'scp', 'mme', 'sgwc', 'sgwu', 'pgwc', 'pgwu'],
    kamailio: ['core', 'script', 'tm', 'registrar', 'usrloc', 'auth', 'dialog']
  },

  // srsRAN Log patterns
  SRSRAN_LOG_PATTERNS: {
    TIMESTAMP: /\[(\d+\.\d+)\]/,
    COMPONENT: /\[([A-Z-]+)\]/,
    LEVEL: /\[([IWED])\]/,
    SLOT: /\[(\d+\.\d+)\]/
  },

  // Open5GS Log patterns  
  OPEN5GS_LOG_PATTERNS: {
    MAIN: /^(\d{2}\/\d{2}\s+\d{2}:\d{2}:\d{2}\.\d{3}):\s+\[([^\]]+)\]\s+(\w+):\s+(.*)$/,
    TIMESTAMP: /^(\d{2}\/\d{2}\s+\d{2}:\d{2}:\d{2}\.\d{3})/,
    COMPONENT: /\[([^\]]+)\]/,
    LEVEL: /\]\s+(\w+):/
  },

  // Kamailio Log patterns
  KAMAILIO_LOG_PATTERNS: {
    MAIN: /^(\w{3}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2})\s+(\w+)\s+kamailio\[(\d+)\]:\s+(\w+):\s+<([^>]+)>\s+(?:\[([^\]]+)\])?\s*:\s*(.*)$/,
    TIMESTAMP: /^(\w{3}\s+\d{1,2}\s+\d{2}:\d{2}:\d{2})/,
    SIP_METHOD: /\b(INVITE|REGISTER|BYE|CANCEL|ACK|OPTIONS|INFO|SUBSCRIBE|NOTIFY|UPDATE|PRACK|REFER)\b/,
    XLOG_CALL: /CALL:\s+(\w+)\s+from\s+([^\s]+)\s+to\s+([^\s]+)\s+via\s+([^:]+):(\d+)/
  },

  // Log level mappings
  LOG_LEVEL_MAPPING: {
    srsran: { 'I': 'info', 'W': 'warn', 'E': 'error', 'D': 'debug' },
    open5gs: { 'fatal': 'error', 'error': 'error', 'warn': 'warn', 'info': 'info', 'debug': 'debug', 'trace': 'debug' },
    kamailio: { 'CRITICAL': 'error', 'ERROR': 'error', 'WARNING': 'warn', 'NOTICE': 'info', 'INFO': 'info', 'DEBUG': 'debug' }
  },

  // srsRAN components
  SRSRAN_COMPONENTS: ['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS'],
  
  // O-RAN interfaces
  ORAN_INTERFACES: ['F1AP', 'E1AP', 'NGAP', 'O1', 'A1'],
  
  // NB-IoT channels
  NBIOT_CHANNELS: ['NPRACH', 'NPDCCH', 'NPDSCH', 'NPUSCH'],
  
  // V2X channels and interfaces
  V2X_CHANNELS: ['PSSCH', 'PSCCH', 'PC5'],
  V2X_MESSAGE_TYPES: ['CAM', 'DENM', 'CPM', 'VAM'],
  V2X_FREQUENCIES: [5855, 5875, 5895, 5905, 5915, 5925], // MHz
  
  // NTN (Non-Terrestrial Network) constants
  NTN_SATELLITE_TYPES: ['GEO', 'MEO', 'LEO'],
  NTN_BANDS: [256, 257, 258], // NTN frequency bands
  NTN_CHANNELS: ['SIB19', 'DOPPLER', 'DELAY', 'TIMING'],
  NTN_PROPAGATION_DELAYS: {
    GEO: 270, // ms
    MEO: 50,  // ms
    LEO: 5    // ms
  },
  NTN_MAX_DOPPLER: {
    GEO: 100,   // Hz
    MEO: 2000,  // Hz
    LEO: 8000   // Hz
  },
  
  // Protocol layers
  PROTOCOL_LAYERS: ['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS', 'APP'],
  
  // File types
  SUPPORTED_FILE_TYPES: ['.log', '.txt', '.pcap', '.pcapng'],
  
  // WebSocket configuration
  WEBSOCKET_RECONNECT_INTERVAL: 5000,
  WEBSOCKET_MAX_RETRIES: 10,

  // External API base (Next/Supabase gateway)
  API_BASE_URL: (typeof window !== 'undefined' && window.__API_BASE_URL__) || '/api',
  
  // UI configuration
  SIDEBAR_WIDTH: 256,
  SIDEBAR_COLLAPSED_WIDTH: 64,
  
  // Chart colors
  CHART_COLORS: {
    PRIMARY: '#3B82F6',
    SUCCESS: '#10B981',
    WARNING: '#F59E0B',
    ERROR: '#EF4444',
    INFO: '#6366F1',
    V2X: '#10B981',
    NBIOT: '#8B5CF6',
    ORAN: '#3B82F6',
    NTN: '#6366F1'
  },

  // Performance thresholds
  PERFORMANCE_THRESHOLDS: {
    LATENCY_WARNING: 50, // ms
    LATENCY_CRITICAL: 100, // ms
    THROUGHPUT_WARNING: 10, // Mbps
    RELIABILITY_WARNING: 95, // %
    SNR_WARNING: 10, // dB
    RSRP_WARNING: -100, // dBm
    PROPAGATION_DELAY_WARNING: 300, // ms for NTN
    DOPPLER_SHIFT_WARNING: 1000 // Hz for NTN
  },

  // Test scenarios
  V2X_TEST_SCENARIOS: [
    'Highway Communication',
    'Urban Intersection',
    'Emergency Broadcast',
    'Platooning Test',
    'Pedestrian Safety',
    'Traffic Light Coordination'
  ],

  // NTN test scenarios
  NTN_TEST_SCENARIOS: [
    'GEO Satellite Link',
    'MEO Handover Test',
    'LEO Constellation',
    'Doppler Compensation',
    'SIB19 Broadcast Test',
    'Timing Advance Test'
  ]
};

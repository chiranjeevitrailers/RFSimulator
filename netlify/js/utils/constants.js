// Constants for 5GLabX Platform Frontend Demo
window.Constants = {
  // Application constants
  APP_NAME: '5GLabX Platform',
  APP_VERSION: '1.0.0',
  APP_DESCRIPTION: 'Advanced 5G Network Analysis Platform',
  
  // Demo mode
  IS_DEMO: true,
  DEMO_MODE: 'netlify',
  
  // API endpoints (mock for demo)
  API_BASE_URL: '/api',
  WS_URL: 'wss://demo.5glabx.com/ws',
  
  // Log levels
  LOG_LEVELS: {
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
    DEBUG: 'debug'
  },
  
  // Protocol types
  PROTOCOLS: {
    SRSRAN: 'srsran',
    OPEN5GS: 'open5gs',
    KAMAILIO: 'kamailio'
  },
  
  // View types
  VIEWS: {
    DASHBOARD: 'dashboard',
    LOGS: 'logs',
    CONFIG: 'config',
    STATS: 'stats'
  },
  
  // Demo data
  DEMO_DATA: {
    SAMPLE_LOGS: [
      {
        timestamp: new Date().toISOString(),
        level: 'info',
        source: 'srsran',
        message: '[PHY] [I] PDSCH: rnti=0x4601 mcs=12 prb=50 symb=14 tbs=1024',
        parsed: {
          layer: 'PHY',
          messageType: 'PDSCH',
          rnti: '0x4601',
          mcs: 12,
          prb: 50
        }
      },
      {
        timestamp: new Date(Date.now() - 1000).toISOString(),
        level: 'info',
        source: 'open5gs',
        message: '[AMF] INFO: Registration Request from SUPI[001010123456789]',
        parsed: {
          component: 'AMF',
          messageType: 'Registration Request',
          supi: '001010123456789'
        }
      },
      {
        timestamp: new Date(Date.now() - 2000).toISOString(),
        level: 'info',
        source: 'kamailio',
        message: 'INFO(12345) core: SIP Request INVITE from 192.168.1.100',
        parsed: {
          component: 'core',
          messageType: 'SIP Request',
          method: 'INVITE',
          source: '192.168.1.100'
        }
      }
    ],
    
    SAMPLE_METRICS: {
      srsran: {
        ue_count: 15,
        cell_load: 75,
        throughput: 125.5,
        errors: 2
      },
      open5gs: {
        subscribers: 12,
        sessions: 8,
        throughput: 98.3,
        errors: 0
      },
      kamailio: {
        registrations: 25,
        calls: 5,
        sip_errors: 1
      }
    }
  }
};
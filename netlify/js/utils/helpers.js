// Helper functions for 5GLabX Platform Frontend Demo
window.Helpers = {
  // Format timestamp
  formatTimestamp(timestamp) {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString() + '.' + date.getMilliseconds().toString().padStart(3, '0');
    } catch (error) {
      return 'Invalid time';
    }
  },
  
  // Format log level
  formatLogLevel(level) {
    const levels = {
      error: { text: 'ERROR', color: 'text-red-600', bg: 'bg-red-100' },
      warning: { text: 'WARN', color: 'text-yellow-600', bg: 'bg-yellow-100' },
      info: { text: 'INFO', color: 'text-blue-600', bg: 'bg-blue-100' },
      debug: { text: 'DEBUG', color: 'text-gray-600', bg: 'bg-gray-100' }
    };
    return levels[level] || levels.info;
  },
  
  // Format source name
  formatSource(source) {
    const sources = {
      srsran: 'srsRAN',
      open5gs: 'Open5GS',
      kamailio: 'Kamailio'
    };
    return sources[source] || source;
  },
  
  // Generate random data for demo
  generateRandomLog() {
    const sources = ['srsran', 'open5gs', 'kamailio'];
    const levels = ['info', 'warning', 'error', 'debug'];
    const messages = {
      srsran: [
        '[PHY] [I] PDSCH: rnti=0x4601 mcs=12 prb=50 symb=14 tbs=1024',
        '[MAC] [I] UL PDU: ue=0 rnti=0x4601 size=256 crc=OK',
        '[RLC] [I] TX PDU: sn=15 size=128 nof_segments=1',
        '[RRC] [I] RRC Connection Request from UE'
      ],
      open5gs: [
        '[AMF] INFO: Registration Request from SUPI[001010123456789]',
        '[SMF] INFO: PDU Session Establishment for DNN[internet]',
        '[UPF] DEBUG: Data forwarding for Session[12345]',
        '[AUSF] INFO: Authentication successful for SUPI'
      ],
      kamailio: [
        'INFO(12345) core: SIP Request INVITE from 192.168.1.100',
        'DEBUG(12346) tm: SIP Response 200 OK to Call-ID: abc123@kamailio.org',
        'NOTICE(12347) registrar: User sip:user@domain.com registered',
        'ERROR(12348) tm: SIP timeout for transaction'
      ]
    };
    
    const source = sources[Math.floor(Math.random() * sources.length)];
    const level = levels[Math.floor(Math.random() * levels.length)];
    const message = messages[source][Math.floor(Math.random() * messages[source].length)];
    
    return {
      timestamp: new Date().toISOString(),
      level,
      source,
      message,
      parsed: this.parseLogMessage(message, source)
    };
  },
  
  // Parse log message (simplified for demo)
  parseLogMessage(message, source) {
    try {
      // Simple parsing for demo purposes
      if (source === 'srsran') {
        const rntiMatch = message.match(/rnti=([0-9a-fA-Fx]+)/);
        const mcsMatch = message.match(/mcs=(\d+)/);
        return {
          rnti: rntiMatch ? rntiMatch[1] : null,
          mcs: mcsMatch ? parseInt(mcsMatch[1]) : null,
          layer: message.includes('[PHY]') ? 'PHY' : 
                 message.includes('[MAC]') ? 'MAC' : 
                 message.includes('[RLC]') ? 'RLC' : 'RRC'
        };
      } else if (source === 'open5gs') {
        const supiMatch = message.match(/SUPI\[([^\]]+)\]/);
        const componentMatch = message.match(/\[([^\]]+)\]/);
        return {
          supi: supiMatch ? supiMatch[1] : null,
          component: componentMatch ? componentMatch[1] : null
        };
      } else if (source === 'kamailio') {
        const methodMatch = message.match(/SIP Request (\w+)/);
        const ipMatch = message.match(/from (\d+\.\d+\.\d+\.\d+)/);
        return {
          method: methodMatch ? methodMatch[1] : null,
          source_ip: ipMatch ? ipMatch[1] : null
        };
      }
      return {};
    } catch (error) {
      console.error('Error parsing log message:', error);
      return {};
    }
  },
  
  // Generate random metrics
  generateRandomMetrics() {
    return {
      srsran: {
        ue_count: Math.floor(Math.random() * 20) + 5,
        cell_load: Math.floor(Math.random() * 100),
        throughput: (Math.random() * 200).toFixed(1),
        errors: Math.floor(Math.random() * 5)
      },
      open5gs: {
        subscribers: Math.floor(Math.random() * 15) + 3,
        sessions: Math.floor(Math.random() * 10) + 2,
        throughput: (Math.random() * 150).toFixed(1),
        errors: Math.floor(Math.random() * 3)
      },
      kamailio: {
        registrations: Math.floor(Math.random() * 30) + 10,
        calls: Math.floor(Math.random() * 8) + 1,
        sip_errors: Math.floor(Math.random() * 3)
      }
    };
  },
  
  // Debounce function
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  // Throttle function
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};
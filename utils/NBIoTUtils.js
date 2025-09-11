// NBIoTUtils - Utility functions for NB-IoT operations
window.NBIoTUtils = {
  // Coverage level mapping
  getCoverageLevel(rsrp) {
    try {
      if (rsrp >= -100) return 0;
      if (rsrp >= -110) return 1;
      if (rsrp >= -120) return 2;
      return 3;
    } catch (error) {
      return 0;
    }
  },

  // Calculate repetitions based on coverage level
  getRepetitions(coverageLevel, messageType) {
    try {
      const repetitionMap = {
        nprach: [1, 2, 4, 8],
        npdcch: [1, 2, 4, 8],
        npdsch: [4, 8, 16, 32]
      };
      
      const reps = repetitionMap[messageType];
      return reps ? reps[coverageLevel] || 1 : 1;
    } catch (error) {
      return 1;
    }
  },

  // Format NB-IoT message for display
  formatMessage(message) {
    try {
      if (!message) return 'Unknown Message';
      
      const formatted = {
        NPRACH: 'NB-IoT Physical Random Access Channel',
        NPDCCH: 'NB-IoT Physical Downlink Control Channel',
        NPDSCH: 'NB-IoT Physical Downlink Shared Channel',
        'MIB-NB': 'Master Information Block - NB-IoT',
        'SIB-NB': 'System Information Block - NB-IoT'
      };
      
      return formatted[message] || message;
    } catch (error) {
      return 'Unknown Message';
    }
  },

  // Calculate throughput for NB-IoT
  calculateThroughput(bytes, timeMs) {
    try {
      if (!timeMs || timeMs === 0) return 0;
      return (bytes * 8) / (timeMs / 1000); // bits per second
    } catch (error) {
      return 0;
    }
  },

  // Validate NB-IoT configuration
  validateConfig(config) {
    try {
      const errors = [];
      
      if (!config.nbiot?.enabled) {
        errors.push('NB-IoT must be enabled');
      }
      
      if (config.cell?.n_prb !== 1) {
        errors.push('NB-IoT requires n_prb = 1');
      }
      
      if (config.nbiot?.nprach_periodicity && 
          ![40, 80, 160, 240, 320, 640, 1280, 2560].includes(config.nbiot.nprach_periodicity)) {
        errors.push('Invalid NPRACH periodicity');
      }
      
      return { valid: errors.length === 0, errors };
    } catch (error) {
      return { valid: false, errors: ['Configuration validation failed'] };
    }
  },

  // Generate test data for NB-IoT
  generateTestData(type, count = 10) {
    try {
      const data = [];
      
      for (let i = 0; i < count; i++) {
        switch (type) {
          case 'coverage':
            data.push({
              level: Math.floor(Math.random() * 4),
              rsrp: -100 - Math.random() * 40,
              devices: Math.floor(Math.random() * 50) + 10
            });
            break;
          case 'throughput':
            data.push({
              timestamp: new Date(Date.now() - i * 60000).toISOString(),
              value: Math.random() * 10 + 2
            });
            break;
          default:
            data.push({ id: i, value: Math.random() * 100 });
        }
      }
      
      return data;
    } catch (error) {
      return [];
    }
  }
};

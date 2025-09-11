// CLIDataBridge - Simple CLI data processing
const CLIDataBridge = {
  isConnected: false,
  rawLogs: [],
  maxLogs: 500,
  logInterval: null,

  getInstance() {
    return this;
  },

  connect() {
    this.isConnected = true;
    this.startLogGeneration();
  },

  disconnect() {
    this.isConnected = false;
    if (this.logInterval) {
      clearInterval(this.logInterval);
    }
  },

  startLogGeneration() {
    const patterns = [
      '[PHY] [I] PDSCH: rnti=0x4601 tbs=309',
      '[MAC] [I] DL PDU: ue=0 size=169',
      '[RLC] [I] TX PDU: SRB1 sn=0',
      '[NAS] [I] Registration Request'
    ];

    this.logInterval = setInterval(() => {
      if (this.isConnected) {
        const pattern = patterns[Math.floor(Math.random() * patterns.length)];
        this.addLog({
          raw: pattern,
          message: pattern,
          timestamp: new Date().toISOString()
        });
      }
    }, 1000);
  },

  addLog(log) {
    this.rawLogs.push(log);
    if (this.rawLogs.length > this.maxLogs) {
      this.rawLogs = this.rawLogs.slice(-this.maxLogs);
    }
  },

  getDataFlows() {
    return {
      rawLogs: this.rawLogs,
      isConnected: this.isConnected
    };
  },

  getRealtimeLogs() {
    return this.rawLogs.map(log => ({
      ...log,
      layer: this.extractLayer(log.message || log.raw),
      channel: this.extractChannel(log.message || log.raw),
      level: 'info',
      ueId: null,
      rnti: this.extractRnti(log.message || log.raw),
      messageType: 'Generic',
      component: 'srsRAN'
    }));
  },

  extractLayer(message) {
    if (!message) return 'Unknown';
    if (message.includes('[PHY]')) return 'PHY';
    if (message.includes('[MAC]')) return 'MAC';
    if (message.includes('[RLC]')) return 'RLC';
    if (message.includes('[NAS]')) return 'NAS';
    return 'PHY';
  },

  extractChannel(message) {
    if (!message) return null;
    if (message.includes('PDSCH')) return 'PDSCH';
    if (message.includes('PUSCH')) return 'PUSCH';
    if (message.includes('PUCCH')) return 'PUCCH';
    return null;
  },

  extractRnti(message) {
    if (!message) return null;
    const match = message.match(/rnti=0x([0-9a-fA-F]+)/);
    return match ? match[1] : null;
  }

};

window.CLIDataBridge = CLIDataBridge;

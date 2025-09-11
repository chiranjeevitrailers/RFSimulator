// CLI Manager - Manages CLI processes and data collection
class CLIManager {
  constructor() {
    this.processes = new Map();
    this.isProduction = false; // Set to true for real CLI integration
    this.dataCallbacks = [];
    this.simulationInterval = null;
  }

  async startProcess(processType, config = {}) {
    try {
      if (this.isProduction) {
        return await this.startRealProcess(processType, config);
      } else {
        return await this.startSimulatedProcess(processType, config);
      }
    } catch (error) {
      console.error('CLIManager startProcess error:', error);
      throw error;
    }
  }

  async startRealProcess(processType, config) {
    // Production implementation would spawn actual CLI processes
    console.log(`Starting real ${processType} process with config:`, config);
    
    const processInfo = {
      type: processType,
      pid: Date.now(),
      status: 'running',
      config: config,
      startTime: new Date()
    };
    
    this.processes.set(processType, processInfo);
    return processInfo;
  }

  async startSimulatedProcess(processType, config) {
    console.log(`Starting simulated ${processType} process`);
    
    const processInfo = {
      type: processType,
      pid: `sim_${Date.now()}`,
      status: 'running',
      config: config,
      startTime: new Date()
    };
    
    this.processes.set(processType, processInfo);
    this.startDataSimulation(processType);
    return processInfo;
  }

  startDataSimulation(processType) {
    if (this.simulationInterval) return;
    
    this.simulationInterval = setInterval(() => {
      const sampleData = this.generateSampleData(processType);
      this.notifyDataCallbacks(sampleData);
    }, 1000);
  }

  generateSampleData(processType) {
    const samples = {
      srsran: [
        '[PHY] [I] PDSCH: rnti=0x4601 mcs=12 prb=50 symb=14 tbs=1024',
        '[MAC] [I] UL PDU: ue=0 rnti=0x4601 size=256 crc=OK',
        '[RLC] [I] TX PDU: sn=15 size=128 nof_segments=1'
      ],
      open5gs: [
        '2025-01-15T10:30:45.123 [AMF] INFO: Registration Request from SUPI[001010123456789]',
        '2025-01-15T10:30:46.234 [SMF] INFO: PDU Session Establishment for DNN[internet]',
        '2025-01-15T10:30:47.345 [UPF] DEBUG: Data forwarding for Session[12345]'
      ],
      kamailio: [
        'INFO(12345) core: SIP Request INVITE from 192.168.1.100',
        'DEBUG(12346) tm: SIP Response 200 OK to Call-ID: abc123@kamailio.org',
        'NOTICE(12347) registrar: User sip:user@domain.com registered'
      ]
    };
    
    const messages = samples[processType] || samples.srsran;
    return messages[Math.floor(Math.random() * messages.length)];
  }

  notifyDataCallbacks(data) {
    this.dataCallbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('CLI data callback error:', error);
      }
    });
  }

  subscribe(callback) {
    this.dataCallbacks.push(callback);
    return () => {
      const index = this.dataCallbacks.indexOf(callback);
      if (index > -1) this.dataCallbacks.splice(index, 1);
    };
  }

  stopProcess(processType) {
    const process = this.processes.get(processType);
    if (process) {
      process.status = 'stopped';
      this.processes.delete(processType);
    }
    
    if (this.simulationInterval && this.processes.size === 0) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }

  getProcessStatus() {
    return Array.from(this.processes.values());
  }
}

window.CLIManager = CLIManager;
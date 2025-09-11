// CLI Manager - Manages CLI processes and data collection
class CLIManager {
  constructor() {
    this.processes = new Map();
    this.isProduction = true; // Enable real CLI integration
    this.dataCallbacks = [];
    this.simulationInterval = null;
    this.processSpawner = new ProcessSpawner();
    this.healthMonitor = new CLIHealthMonitor();
    this.configManager = new CLIConfigManager();
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
    try {
      console.log(`Starting real ${processType} process with config:`, config);
      
      // Validate configuration
      const validatedConfig = await this.configManager.validateConfig(processType, config);
      
      // Check if process is already running
      if (this.processes.has(processType)) {
        const existingProcess = this.processes.get(processType);
        if (existingProcess.status === 'running') {
          console.log(`${processType} process already running with PID: ${existingProcess.pid}`);
          return existingProcess;
        }
      }
      
      // Spawn real CLI process
      const processInfo = await this.processSpawner.spawnProcess(processType, validatedConfig);
      
      // Set up health monitoring
      this.healthMonitor.startMonitoring(processType, processInfo.pid);
      
      // Set up data collection
      this.setupDataCollection(processType, processInfo);
      
      this.processes.set(processType, processInfo);
      
      console.log(`Successfully started ${processType} process with PID: ${processInfo.pid}`);
      return processInfo;
      
    } catch (error) {
      console.error(`Failed to start real ${processType} process:`, error);
      throw new Error(`Failed to start ${processType}: ${error.message}`);
    }
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

  setupDataCollection(processType, processInfo) {
    // Set up real-time data collection from CLI process
    const dataCollector = new CLIDataCollector(processType, processInfo.pid);
    
    dataCollector.onData((data) => {
      this.notifyDataCallbacks(data);
    });
    
    dataCollector.onError((error) => {
      console.error(`Data collection error for ${processType}:`, error);
      this.healthMonitor.reportError(processType, error);
    });
    
    processInfo.dataCollector = dataCollector;
  }

  async stopProcess(processType) {
    const process = this.processes.get(processType);
    if (process) {
      try {
        // Stop data collection
        if (process.dataCollector) {
          process.dataCollector.stop();
        }
        
        // Stop health monitoring
        this.healthMonitor.stopMonitoring(processType);
        
        // Terminate process
        if (process.pid && process.status === 'running') {
          await this.processSpawner.terminateProcess(process.pid);
        }
        
        process.status = 'stopped';
        this.processes.delete(processType);
        
        console.log(`Successfully stopped ${processType} process`);
      } catch (error) {
        console.error(`Error stopping ${processType} process:`, error);
        throw error;
      }
    }
  }

  async restartProcess(processType, config = {}) {
    await this.stopProcess(processType);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
    return await this.startProcess(processType, config);
  }

  getHealthStatus() {
    return this.healthMonitor.getStatus();
  }
}

// Process Spawner - Handles actual CLI process spawning
class ProcessSpawner {
  constructor() {
    this.processConfigs = {
      srsran: {
        command: 'srsenb',
        args: ['--rf.device=zmq', '--rf.device_args="fail_on_disconnect=true"'],
        env: { 'SRS_LOG_LEVEL': 'info' },
        cwd: '/opt/srsran'
      },
      open5gs: {
        command: 'open5gs-mmed',
        args: ['-c', '/etc/open5gs/mme.yaml'],
        env: { 'OPEN5GS_LOG_LEVEL': 'info' },
        cwd: '/opt/open5gs'
      },
      kamailio: {
        command: 'kamailio',
        args: ['-f', '/etc/kamailio/kamailio.cfg', '-DD', '-E'],
        env: { 'KAMAILIO_LOG_LEVEL': 'info' },
        cwd: '/opt/kamailio'
      }
    };
  }

  async spawnProcess(processType, config) {
    const processConfig = this.processConfigs[processType];
    if (!processConfig) {
      throw new Error(`Unknown process type: ${processType}`);
    }

    try {
      const { spawn } = require('child_process');
      
      const childProcess = spawn(processConfig.command, processConfig.args, {
        env: { ...process.env, ...processConfig.env },
        cwd: processConfig.cwd,
        stdio: ['ignore', 'pipe', 'pipe']
      });

      const processInfo = {
        type: processType,
        pid: childProcess.pid,
        status: 'running',
        config: config,
        startTime: new Date(),
        process: childProcess
      };

      // Handle process events
      childProcess.on('error', (error) => {
        console.error(`${processType} process error:`, error);
        processInfo.status = 'error';
        processInfo.error = error.message;
      });

      childProcess.on('exit', (code, signal) => {
        console.log(`${processType} process exited with code ${code}, signal ${signal}`);
        processInfo.status = 'stopped';
        processInfo.exitCode = code;
        processInfo.exitSignal = signal;
      });

      return processInfo;
    } catch (error) {
      console.error(`Failed to spawn ${processType} process:`, error);
      throw error;
    }
  }

  async terminateProcess(pid) {
    try {
      const { exec } = require('child_process');
      
      // Try graceful termination first
      await new Promise((resolve, reject) => {
        exec(`kill -TERM ${pid}`, (error) => {
          if (error) reject(error);
          else resolve();
        });
      });

      // Wait for graceful shutdown
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Force kill if still running
      await new Promise((resolve, reject) => {
        exec(`kill -KILL ${pid}`, (error) => {
          if (error) reject(error);
          else resolve();
        });
      });
    } catch (error) {
      console.error(`Error terminating process ${pid}:`, error);
      throw error;
    }
  }
}

// CLI Health Monitor - Monitors CLI process health
class CLIHealthMonitor {
  constructor() {
    this.monitors = new Map();
    this.healthStatus = new Map();
  }

  startMonitoring(processType, pid) {
    const monitor = {
      processType,
      pid,
      startTime: Date.now(),
      lastCheck: Date.now(),
      status: 'healthy',
      errors: [],
      metrics: {}
    };

    this.monitors.set(processType, monitor);
    this.healthStatus.set(processType, 'healthy');

    // Start periodic health checks
    const healthCheckInterval = setInterval(() => {
      this.performHealthCheck(processType, pid);
    }, 30000); // Check every 30 seconds

    monitor.healthCheckInterval = healthCheckInterval;
  }

  async performHealthCheck(processType, pid) {
    try {
      const { exec } = require('child_process');
      
      // Check if process is still running
      const isRunning = await new Promise((resolve) => {
        exec(`ps -p ${pid}`, (error) => {
          resolve(!error);
        });
      });

      const monitor = this.monitors.get(processType);
      if (monitor) {
        monitor.lastCheck = Date.now();
        
        if (!isRunning) {
          monitor.status = 'stopped';
          this.healthStatus.set(processType, 'stopped');
          clearInterval(monitor.healthCheckInterval);
        } else {
          monitor.status = 'healthy';
          this.healthStatus.set(processType, 'healthy');
        }
      }
    } catch (error) {
      console.error(`Health check failed for ${processType}:`, error);
      this.reportError(processType, error);
    }
  }

  reportError(processType, error) {
    const monitor = this.monitors.get(processType);
    if (monitor) {
      monitor.errors.push({
        timestamp: Date.now(),
        error: error.message,
        stack: error.stack
      });
      
      // Keep only last 10 errors
      if (monitor.errors.length > 10) {
        monitor.errors = monitor.errors.slice(-10);
      }
      
      monitor.status = 'error';
      this.healthStatus.set(processType, 'error');
    }
  }

  stopMonitoring(processType) {
    const monitor = this.monitors.get(processType);
    if (monitor && monitor.healthCheckInterval) {
      clearInterval(monitor.healthCheckInterval);
    }
    this.monitors.delete(processType);
    this.healthStatus.delete(processType);
  }

  getStatus() {
    const status = {};
    for (const [processType, health] of this.healthStatus) {
      const monitor = this.monitors.get(processType);
      status[processType] = {
        status: health,
        uptime: monitor ? Date.now() - monitor.startTime : 0,
        lastCheck: monitor ? monitor.lastCheck : 0,
        errorCount: monitor ? monitor.errors.length : 0
      };
    }
    return status;
  }
}

// CLI Config Manager - Manages CLI tool configurations
class CLIConfigManager {
  constructor() {
    this.configTemplates = {
      srsran: {
        enb: {
          enb_id: '0x19B',
          cell_id: '0x01',
          tac: '0x0007',
          mcc: '001',
          mnc: '01',
          mme_addr: '127.0.0.1',
          gtp_bind_addr: '127.0.0.1'
        },
        log: {
          filename: '/var/log/srsran/enb.log',
          file_max_size: '-1',
          print_level: 'info',
          log_level: 'info'
        },
        rf: {
          device_name: 'zmq',
          device_args: 'fail_on_disconnect=true',
          tx_gain: '50',
          rx_gain: '40'
        }
      },
      open5gs: {
        logger: {
          file: '/var/log/open5gs/mme.log',
          level: 'info'
        },
        mme: {
          freeDiameter: '/etc/freeDiameter/mme.conf',
          s1ap: { addr: '127.0.0.1' },
          gtpc: { addr: '127.0.0.1' }
        }
      },
      kamailio: {
        global: {
          log_facility: 'LOG_LOCAL0',
          log_prefix: '"KAMAILIO: "',
          port: 5060,
          listen: 'udp:127.0.0.1:5060'
        }
      }
    };
  }

  async validateConfig(processType, config) {
    const template = this.configTemplates[processType];
    if (!template) {
      throw new Error(`Unknown process type: ${processType}`);
    }

    // Merge with template and validate
    const validatedConfig = { ...template, ...config };
    
    // Perform type-specific validation
    switch (processType) {
      case 'srsran':
        this.validateSrsranConfig(validatedConfig);
        break;
      case 'open5gs':
        this.validateOpen5gsConfig(validatedConfig);
        break;
      case 'kamailio':
        this.validateKamailioConfig(validatedConfig);
        break;
    }

    return validatedConfig;
  }

  validateSrsranConfig(config) {
    if (!config.enb?.enb_id) {
      throw new Error('srsRAN eNB ID is required');
    }
    if (!config.enb?.mcc || !config.enb?.mnc) {
      throw new Error('srsRAN MCC and MNC are required');
    }
  }

  validateOpen5gsConfig(config) {
    if (!config.mme?.s1ap?.addr) {
      throw new Error('Open5GS MME S1AP address is required');
    }
  }

  validateKamailioConfig(config) {
    if (!config.global?.port || config.global.port < 1 || config.global.port > 65535) {
      throw new Error('Kamailio port must be between 1-65535');
    }
  }
}

// CLI Data Collector - Collects data from CLI processes
class CLIDataCollector {
  constructor(processType, pid) {
    this.processType = processType;
    this.pid = pid;
    this.isCollecting = false;
    this.dataCallbacks = [];
    this.errorCallbacks = [];
    this.logWatcher = null;
  }

  onData(callback) {
    this.dataCallbacks.push(callback);
  }

  onError(callback) {
    this.errorCallbacks.push(callback);
  }

  start() {
    if (this.isCollecting) return;
    
    this.isCollecting = true;
    this.startLogWatching();
  }

  stop() {
    this.isCollecting = false;
    if (this.logWatcher) {
      this.logWatcher.close();
      this.logWatcher = null;
    }
  }

  startLogWatching() {
    const logPaths = {
      srsran: ['/var/log/srsran/enb.log', '/tmp/srsran.log'],
      open5gs: ['/var/log/open5gs/mme.log', '/var/log/open5gs/smf.log'],
      kamailio: ['/var/log/kamailio.log', '/tmp/kamailio.log']
    };

    const paths = logPaths[this.processType] || [];
    
    for (const logPath of paths) {
      try {
        const fs = require('fs');
        if (fs.existsSync(logPath)) {
          this.watchLogFile(logPath);
          break;
        }
      } catch (error) {
        console.error(`Error checking log path ${logPath}:`, error);
      }
    }
  }

  watchLogFile(logPath) {
    try {
      const fs = require('fs');
      
      this.logWatcher = fs.watch(logPath, (eventType) => {
        if (eventType === 'change' && this.isCollecting) {
          this.readNewLogLines(logPath);
        }
      });

      console.log(`Started watching log file: ${logPath}`);
    } catch (error) {
      console.error(`Error setting up log watcher for ${logPath}:`, error);
      this.notifyError(error);
    }
  }

  readNewLogLines(logPath) {
    try {
      const fs = require('fs');
      const content = fs.readFileSync(logPath, 'utf8');
      const lines = content.split('\n').filter(line => line.trim());
      
      // Get the last few lines (assuming file grows)
      const newLines = lines.slice(-10);
      
      newLines.forEach(line => {
        if (line.trim()) {
          this.notifyData({
            processType: this.processType,
            pid: this.pid,
            timestamp: new Date().toISOString(),
            data: line,
            source: 'log_file'
          });
        }
      });
    } catch (error) {
      console.error(`Error reading log file ${logPath}:`, error);
      this.notifyError(error);
    }
  }

  notifyData(data) {
    this.dataCallbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Data callback error:', error);
      }
    });
  }

  notifyError(error) {
    this.errorCallbacks.forEach(callback => {
      try {
        callback(error);
      } catch (callbackError) {
        console.error('Error callback error:', callbackError);
      }
    });
  }
}

window.CLIManager = CLIManager;
window.ProcessSpawner = ProcessSpawner;
window.CLIHealthMonitor = CLIHealthMonitor;
window.CLIConfigManager = CLIConfigManager;
window.CLIDataCollector = CLIDataCollector;
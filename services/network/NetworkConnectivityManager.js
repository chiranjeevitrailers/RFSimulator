// Network Connectivity Manager - Validates real network connections
const net = require('net');
const dgram = require('dgram');
const { exec } = require('child_process');

class NetworkConnectivityManager {
  constructor() {
    this.connectionTests = new Map();
    this.testResults = new Map();
    this.testInterval = null;
    this.isMonitoring = false;
  }

  async initialize() {
    console.log('Network Connectivity Manager initialized');
    this.startPeriodicTesting();
  }

  startPeriodicTesting() {
    if (this.testInterval) return;
    
    // Test connections every 30 seconds
    this.testInterval = setInterval(() => {
      this.performAllConnectionTests();
    }, 30000);
    
    this.isMonitoring = true;
    console.log('Started periodic network connectivity testing');
  }

  stopPeriodicTesting() {
    if (this.testInterval) {
      clearInterval(this.testInterval);
      this.testInterval = null;
    }
    this.isMonitoring = false;
    console.log('Stopped periodic network connectivity testing');
  }

  async performAllConnectionTests() {
    const tests = [
      { name: 'srsran-open5gs', from: 'srsran', to: 'open5gs', port: 36412, protocol: 'sctp' },
      { name: 'open5gs-srsran', from: 'open5gs', to: 'srsran', port: 36412, protocol: 'sctp' },
      { name: 'open5gs-database', from: 'open5gs', to: 'database', port: 27017, protocol: 'tcp' },
      { name: 'kamailio-database', from: 'kamailio', to: 'database', port: 3306, protocol: 'tcp' },
      { name: 'kamailio-sip', from: 'kamailio', to: 'sip_clients', port: 5060, protocol: 'udp' },
      { name: 'srsran-ue', from: 'srsran', to: 'ue', port: 50020, protocol: 'udp' }
    ];

    for (const test of tests) {
      try {
        const result = await this.testConnection(test);
        this.testResults.set(test.name, result);
      } catch (error) {
        this.testResults.set(test.name, {
          success: false,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }
  }

  async testConnection(testConfig) {
    const startTime = Date.now();
    
    try {
      let result;
      
      switch (testConfig.protocol) {
        case 'tcp':
          result = await this.testTcpConnection(testConfig);
          break;
        case 'udp':
          result = await this.testUdpConnection(testConfig);
          break;
        case 'sctp':
          result = await this.testSctpConnection(testConfig);
          break;
        default:
          throw new Error(`Unsupported protocol: ${testConfig.protocol}`);
      }

      return {
        success: result.success,
        latency: Date.now() - startTime,
        timestamp: new Date().toISOString(),
        details: result.details
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        latency: Date.now() - startTime,
        timestamp: new Date().toISOString()
      };
    }
  }

  async testTcpConnection(testConfig) {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      const timeout = 5000; // 5 second timeout
      
      socket.setTimeout(timeout);
      
      socket.on('connect', () => {
        socket.destroy();
        resolve({
          success: true,
          details: `TCP connection to ${testConfig.to}:${testConfig.port} successful`
        });
      });
      
      socket.on('timeout', () => {
        socket.destroy();
        resolve({
          success: false,
          details: `TCP connection to ${testConfig.to}:${testConfig.port} timed out`
        });
      });
      
      socket.on('error', (error) => {
        socket.destroy();
        resolve({
          success: false,
          details: `TCP connection to ${testConfig.to}:${testConfig.port} failed: ${error.message}`
        });
      });
      
      // Connect to localhost for testing
      socket.connect(testConfig.port, '127.0.0.1');
    });
  }

  async testUdpConnection(testConfig) {
    return new Promise((resolve) => {
      const socket = dgram.createSocket('udp4');
      const timeout = 5000;
      let resolved = false;
      
      const resolveOnce = (result) => {
        if (!resolved) {
          resolved = true;
          socket.close();
          resolve(result);
        }
      };
      
      socket.on('message', () => {
        resolveOnce({
          success: true,
          details: `UDP connection to ${testConfig.to}:${testConfig.port} successful`
        });
      });
      
      socket.on('error', (error) => {
        resolveOnce({
          success: false,
          details: `UDP connection to ${testConfig.to}:${testConfig.port} failed: ${error.message}`
        });
      });
      
      // Send a test packet
      const testMessage = Buffer.from('test');
      socket.send(testMessage, testConfig.port, '127.0.0.1', (error) => {
        if (error) {
          resolveOnce({
            success: false,
            details: `UDP send to ${testConfig.to}:${testConfig.port} failed: ${error.message}`
          });
        }
      });
      
      // Timeout if no response
      setTimeout(() => {
        resolveOnce({
          success: false,
          details: `UDP connection to ${testConfig.to}:${testConfig.port} timed out`
        });
      }, timeout);
    });
  }

  async testSctpConnection(testConfig) {
    // SCTP testing is more complex, use netstat to check if port is listening
    return new Promise((resolve) => {
      exec(`netstat -an | grep :${testConfig.port}`, (error, stdout, stderr) => {
        if (error) {
          resolve({
            success: false,
            details: `SCTP port ${testConfig.port} not found: ${error.message}`
          });
        } else if (stdout.includes(`:${testConfig.port}`)) {
          resolve({
            success: true,
            details: `SCTP port ${testConfig.port} is listening`
          });
        } else {
          resolve({
            success: false,
            details: `SCTP port ${testConfig.port} is not listening`
          });
        }
      });
    });
  }

  async testSpecificConnection(fromTool, toTarget) {
    const testConfigs = {
      'srsran-open5gs': { from: 'srsran', to: 'open5gs', port: 36412, protocol: 'sctp' },
      'open5gs-srsran': { from: 'open5gs', to: 'srsran', port: 36412, protocol: 'sctp' },
      'open5gs-database': { from: 'open5gs', to: 'database', port: 27017, protocol: 'tcp' },
      'kamailio-database': { from: 'kamailio', to: 'database', port: 3306, protocol: 'tcp' },
      'kamailio-sip': { from: 'kamailio', to: 'sip_clients', port: 5060, protocol: 'udp' },
      'srsran-ue': { from: 'srsran', to: 'ue', port: 50020, protocol: 'udp' }
    };

    const testName = `${fromTool}-${toTarget}`;
    const testConfig = testConfigs[testName];
    
    if (!testConfig) {
      throw new Error(`Unknown connection test: ${testName}`);
    }

    return await this.testConnection(testConfig);
  }

  async checkPortAvailability(port, protocol = 'tcp') {
    return new Promise((resolve) => {
      if (protocol === 'tcp') {
        const socket = new net.Socket();
        socket.setTimeout(1000);
        
        socket.on('connect', () => {
          socket.destroy();
          resolve({ available: false, message: `Port ${port} is in use` });
        });
        
        socket.on('timeout', () => {
          socket.destroy();
          resolve({ available: true, message: `Port ${port} is available` });
        });
        
        socket.on('error', () => {
          socket.destroy();
          resolve({ available: true, message: `Port ${port} is available` });
        });
        
        socket.connect(port, '127.0.0.1');
      } else {
        // For UDP, we can't easily test availability without binding
        resolve({ available: true, message: `UDP port ${port} availability cannot be determined` });
      }
    });
  }

  async getNetworkStatistics() {
    return new Promise((resolve, reject) => {
      exec('netstat -i', (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          const stats = this.parseNetstatOutput(stdout);
          resolve(stats);
        }
      });
    });
  }

  parseNetstatOutput(output) {
    const lines = output.split('\n');
    const interfaces = [];
    
    for (let i = 2; i < lines.length; i++) { // Skip header lines
      const line = lines[i].trim();
      if (line && !line.startsWith('lo')) { // Skip loopback
        const parts = line.split(/\s+/);
        if (parts.length >= 10) {
          interfaces.push({
            name: parts[0],
            mtu: parseInt(parts[1]),
            rx_ok: parseInt(parts[2]),
            rx_err: parseInt(parts[3]),
            rx_drp: parseInt(parts[4]),
            rx_ovr: parseInt(parts[5]),
            tx_ok: parseInt(parts[6]),
            tx_err: parseInt(parts[7]),
            tx_drp: parseInt(parts[8]),
            tx_ovr: parseInt(parts[9])
          });
        }
      }
    }
    
    return interfaces;
  }

  async getActiveConnections() {
    return new Promise((resolve, reject) => {
      exec('netstat -an | grep ESTABLISHED', (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          const connections = this.parseConnectionsOutput(stdout);
          resolve(connections);
        }
      });
    });
  }

  parseConnectionsOutput(output) {
    const lines = output.split('\n');
    const connections = [];
    
    for (const line of lines) {
      if (line.trim()) {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 4) {
          connections.push({
            protocol: parts[0],
            local_address: parts[3],
            foreign_address: parts[4],
            state: parts[5] || 'ESTABLISHED'
          });
        }
      }
    }
    
    return connections;
  }

  getTestResults() {
    const results = {};
    for (const [name, result] of this.testResults) {
      results[name] = result;
    }
    return results;
  }

  getConnectionStatus(fromTool, toTarget) {
    const testName = `${fromTool}-${toTarget}`;
    const result = this.testResults.get(testName);
    
    if (!result) {
      return 'unknown';
    }
    
    if (result.success) {
      return 'connected';
    } else {
      return 'disconnected';
    }
  }

  async performDiagnostics() {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      network_interfaces: await this.getNetworkStatistics(),
      active_connections: await this.getActiveConnections(),
      connection_tests: this.getTestResults(),
      port_availability: {}
    };

    // Check key ports
    const keyPorts = [
      { port: 36412, name: 'S1AP' },
      { port: 27017, name: 'MongoDB' },
      { port: 3306, name: 'MySQL' },
      { port: 5060, name: 'SIP' },
      { port: 50020, name: 'UE' }
    ];

    for (const portInfo of keyPorts) {
      diagnostics.port_availability[portInfo.name] = await this.checkPortAvailability(portInfo.port);
    }

    return diagnostics;
  }
}

module.exports = NetworkConnectivityManager;
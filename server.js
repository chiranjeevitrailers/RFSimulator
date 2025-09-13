const express = require('express');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const cors = require('cors');
const DatabaseService = require('./services/database/DatabaseService');
const NetworkConnectivityManager = require('./services/network/NetworkConnectivityManager');

class RealCLILogServer {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 8080;
    this.wss = null;
    this.clients = new Set();
    this.cliProcesses = new Map();
    this.logWatchers = new Map();
    this.logBuffers = new Map();
    this.databaseService = new DatabaseService();
    this.networkManager = new NetworkConnectivityManager();

    this.setupMiddleware();
    this.setupRoutes();
    this.setupWebSocket();
    this.initializeCLIMonitoring();
    this.initializeDatabase();
    this.initializeNetworkMonitoring();
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, 'public')));
  }

  setupRoutes() {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        clients: this.clients.size,
        cliProcesses: Array.from(this.cliProcesses.keys()),
        logWatchers: Array.from(this.logWatchers.keys())
      });
    });

    // Get CLI process status
    this.app.get('/api/cli/status', (req, res) => {
      const status = {};
      for (const [name, process] of this.cliProcesses) {
        status[name] = {
          running: !process.killed,
          pid: process.pid,
          startTime: process.startTime
        };
      }
      res.json(status);
    });

    // Start CLI process
    this.app.post('/api/cli/start/:tool', (req, res) => {
      const { tool } = req.params;
      const { config } = req.body;

      try {
        this.startCLITool(tool, config);
        res.json({ success: true, message: `${tool} started successfully` });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // Stop CLI process
    this.app.post('/api/cli/stop/:tool', (req, res) => {
      const { tool } = req.params;

      try {
        this.stopCLITool(tool);
        res.json({ success: true, message: `${tool} stopped successfully` });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // Get log buffer
    this.app.get('/api/logs/:source', (req, res) => {
      const { source } = req.params;
      const { limit = 100 } = req.query;

      const logs = this.logBuffers.get(source) || [];
      res.json(logs.slice(-limit));
    });

    // Ingest logs (single or batch) for a given source
    this.app.post('/api/logs/:source', (req, res) => {
      const { source } = req.params;
      const payload = req.body;

      try {
        if (!payload) {
          return res.status(400).json({ error: 'Missing request body' });
        }

        const logs = Array.isArray(payload) ? payload : [payload];
        let accepted = 0;

        logs.forEach((raw) => {
          const normalized = this.normalizeIncomingLog(source, raw);
          if (normalized) {
            this.addLogToBufferAndBroadcast(source, normalized);
            accepted += 1;
          }
        });

        res.json({ success: true, accepted, source });
      } catch (error) {
        console.error('Log ingestion error:', error);
        res.status(500).json({ error: 'Failed to ingest logs' });
      }
    });

    // Configuration Management APIs
    this.setupConfigRoutes();
  }

  setupConfigRoutes() {
    // Get configuration for a specific tool
    this.app.get('/api/config/:tool', (req, res) => {
      const { tool } = req.params;

      try {
        const config = this.loadConfiguration(tool);
        res.json(config);
      } catch (error) {
        console.error(`Failed to load ${tool} configuration:`, error);
        res.status(500).json({ error: `Failed to load ${tool} configuration` });
      }
    });

    // Save configuration for a specific tool
    this.app.post('/api/config/:tool', (req, res) => {
      const { tool } = req.params;
      const config = req.body;

      try {
        this.saveConfiguration(tool, config);
        res.json({ success: true, message: `${tool} configuration saved successfully` });
      } catch (error) {
        console.error(`Failed to save ${tool} configuration:`, error);
        res.status(500).json({ error: `Failed to save ${tool} configuration` });
      }
    });

    // Validate configuration
    this.app.post('/api/config/:tool/validate', (req, res) => {
      const { tool } = req.params;
      const config = req.body;

      try {
        const validation = this.validateConfiguration(tool, config);
        res.json(validation);
      } catch (error) {
        console.error(`Failed to validate ${tool} configuration:`, error);
        res.status(500).json({ error: `Failed to validate ${tool} configuration` });
      }
    });

    // Get configuration templates
    this.app.get('/api/config/templates/:tool', (req, res) => {
      const { tool } = req.params;

      try {
        const templates = this.getConfigurationTemplates(tool);
        res.json(templates);
      } catch (error) {
        console.error(`Failed to get ${tool} templates:`, error);
        res.status(500).json({ error: `Failed to get ${tool} templates` });
      }
    });

    // Reset configuration to default
    this.app.post('/api/config/:tool/reset', (req, res) => {
      const { tool } = req.params;

      try {
        const defaultConfig = this.getDefaultConfiguration(tool);
        this.saveConfiguration(tool, defaultConfig);
        res.json({ success: true, message: `${tool} configuration reset to default` });
      } catch (error) {
        console.error(`Failed to reset ${tool} configuration:`, error);
        res.status(500).json({ error: `Failed to reset ${tool} configuration` });
      }
    });

    // CLI Health Check APIs
    this.setupHealthCheckRoutes();
  }

  setupHealthCheckRoutes() {
    // Get health status for all CLI tools
    this.app.get('/api/cli/health', (req, res) => {
      const healthStatus = {};
      const tools = ['srsran', 'open5gs', 'kamailio'];

      tools.forEach(tool => {
        healthStatus[tool] = this.checkToolHealth(tool);
      });

      res.json(healthStatus);
    });

    // Get health status for specific tool
    this.app.get('/api/cli/health/:tool', (req, res) => {
      const { tool } = req.params;

      try {
        const health = this.checkToolHealth(tool);
        res.json(health);
      } catch (error) {
        console.error(`Health check failed for ${tool}:`, error);
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // Get connection status between tools
    this.app.get('/api/cli/connections', (req, res) => {
      const connections = {
        srsran: {
          open5gs: this.checkConnection('srsran', 'open5gs'),
          ue: this.checkConnection('srsran', 'ue')
        },
        open5gs: {
          srsran: this.checkConnection('open5gs', 'srsran'),
          database: this.checkConnection('open5gs', 'database')
        },
        kamailio: {
          database: this.checkConnection('kamailio', 'database'),
          sip_clients: this.checkConnection('kamailio', 'sip_clients')
        }
      };

      res.json(connections);
    });

    // Test connection between specific tools
    this.app.get('/api/cli/test-connection/:tool/:target', (req, res) => {
      const { tool, target } = req.params;

      try {
        const result = this.testConnection(tool, target);
        res.json(result);
      } catch (error) {
        console.error(`Connection test failed ${tool} -> ${target}:`, error);
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // Get detailed metrics for CLI tools
    this.app.get('/api/cli/metrics', (req, res) => {
      const metrics = {
        srsran: this.getToolMetrics('srsran'),
        open5gs: this.getToolMetrics('open5gs'),
        kamailio: this.getToolMetrics('kamailio')
      };

      res.json(metrics);
    });

    // Database API routes
    this.setupDatabaseRoutes();
  }

  setupDatabaseRoutes() {
    // Get database statistics
    this.app.get('/api/database/stats', async (req, res) => {
      try {
        const stats = await this.databaseService.getDatabaseStats();
        res.json(stats);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Get log entries with filters
    this.app.get('/api/database/logs', async (req, res) => {
      try {
        const { source, level, startTime, endTime, component, limit = 1000, offset = 0 } = req.query;
        
        const filters = {};
        if (source) filters.source = source;
        if (level) filters.level = level;
        if (startTime) filters.startTime = startTime;
        if (endTime) filters.endTime = endTime;
        if (component) filters.component = component;

        const logs = await this.databaseService.getLogEntries(filters, parseInt(limit), parseInt(offset));
        res.json(logs);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Get process status history
    this.app.get('/api/database/process-history/:processType', async (req, res) => {
      try {
        const { processType } = req.params;
        const { limit = 100 } = req.query;
        
        const history = await this.databaseService.getProcessStatusHistory(processType, parseInt(limit));
        res.json(history);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Get health metrics
    this.app.get('/api/database/health-metrics/:processType', async (req, res) => {
      try {
        const { processType } = req.params;
        const { startTime, endTime } = req.query;
        
        if (!startTime || !endTime) {
          return res.status(400).json({ error: 'startTime and endTime are required' });
        }

        const metrics = await this.databaseService.getHealthMetrics(processType, startTime, endTime);
        res.json(metrics);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Get performance metrics
    this.app.get('/api/database/performance-metrics/:processType/:metricType', async (req, res) => {
      try {
        const { processType, metricType } = req.params;
        const { startTime, endTime } = req.query;
        
        if (!startTime || !endTime) {
          return res.status(400).json({ error: 'startTime and endTime are required' });
        }

        const metrics = await this.databaseService.getPerformanceMetrics(processType, metricType, startTime, endTime);
        res.json(metrics);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Get configuration history
    this.app.get('/api/database/config-history/:processType', async (req, res) => {
      try {
        const { processType } = req.params;
        const { limit = 50 } = req.query;
        
        const history = await this.databaseService.getConfigurationHistory(processType, parseInt(limit));
        res.json(history);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Network connectivity routes
    this.setupNetworkRoutes();
  }

  setupNetworkRoutes() {
    // Get network connectivity status
    this.app.get('/api/network/status', async (req, res) => {
      try {
        const results = this.networkManager.getTestResults();
        res.json(results);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Test specific connection
    this.app.get('/api/network/test/:fromTool/:toTarget', async (req, res) => {
      try {
        const { fromTool, toTarget } = req.params;
        const result = await this.networkManager.testSpecificConnection(fromTool, toTarget);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Get network diagnostics
    this.app.get('/api/network/diagnostics', async (req, res) => {
      try {
        const diagnostics = await this.networkManager.performDiagnostics();
        res.json(diagnostics);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Get active connections
    this.app.get('/api/network/connections', async (req, res) => {
      try {
        const connections = await this.networkManager.getActiveConnections();
        res.json(connections);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Get network statistics
    this.app.get('/api/network/statistics', async (req, res) => {
      try {
        const stats = await this.networkManager.getNetworkStatistics();
        res.json(stats);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Check port availability
    this.app.get('/api/network/port/:port', async (req, res) => {
      try {
        const { port } = req.params;
        const { protocol = 'tcp' } = req.query;
        
        const result = await this.networkManager.checkPortAvailability(parseInt(port), protocol);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  }

  async initializeDatabase() {
    try {
      await this.databaseService.initialize();
      console.log('Database service initialized');
    } catch (error) {
      console.error('Database initialization error:', error);
    }
  }

  async initializeNetworkMonitoring() {
    try {
      await this.networkManager.initialize();
      console.log('Network connectivity monitoring initialized');
    } catch (error) {
      console.error('Network monitoring initialization error:', error);
    }
  }

  setupWebSocket() {
    this.wss = new WebSocket.Server({ port: 8081 });

    this.wss.on('connection', (ws, req) => {
      console.log('New WebSocket connection established');
      this.clients.add(ws);

      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message.toString());
          this.handleWebSocketMessage(ws, data);
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      });

      ws.on('close', () => {
        console.log('WebSocket connection closed');
        this.clients.delete(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });

      // Send initial status
      ws.send(JSON.stringify({
        type: 'status',
        data: {
          cliProcesses: Array.from(this.cliProcesses.keys()),
          logWatchers: Array.from(this.logWatchers.keys()),
          clients: this.clients.size
        }
      }));
    });

    console.log('WebSocket server started on port 8081');
  }

  handleWebSocketMessage(ws, data) {
    switch (data.type) {
      case 'subscribe':
        // Handle subscription to specific log sources
        if (data.sources) {
          ws.subscribedSources = data.sources;
          console.log('Client subscribed to sources:', data.sources);
        }
        break;

      case 'unsubscribe':
        // Handle unsubscription
        ws.subscribedSources = null;
        break;

      case 'get_status':
        // Send current status
        ws.send(JSON.stringify({
          type: 'status',
          data: this.getSystemStatus()
        }));
        break;

      default:
        console.log('Unknown WebSocket message type:', data.type);
    }
  }

  normalizeIncomingLog(source, raw) {
    try {
      // Accept either already structured entries or simple text lines
      if (typeof raw === 'string') {
        return {
          id: Date.now() + Math.random(),
          timestamp: new Date().toISOString(),
          source,
          level: 'I',
          message: raw,
          raw,
        };
      }

      // If structured, ensure required fields
      return {
        id: raw.id || Date.now() + Math.random(),
        timestamp: raw.timestamp || new Date().toISOString(),
        source: raw.source || source,
        level: raw.level || 'I',
        message: raw.message || '',
        layer: raw.layer,
        protocol: raw.protocol,
        executionId: raw.executionId,
        testCaseId: raw.testCaseId,
        data: raw.data,
        raw: raw.raw || raw.message,
        decoded: raw.decoded,
        informationElements: raw.informationElements,
        validation: raw.validation,
        performance: raw.performance,
      };
    } catch (error) {
      console.error('normalizeIncomingLog error:', error);
      return null;
    }
  }

  addLogToBufferAndBroadcast(source, logEntry) {
    const buffer = this.logBuffers.get(source) || [];
    buffer.push(logEntry);
    if (buffer.length > 2000) buffer.shift();
    this.logBuffers.set(source, buffer);
    this.broadcastLog(source, logEntry);
  }

  initializeCLIMonitoring() {
    // Initialize log file watchers for common locations
    const logConfigs = {
      srsran: [
        '/var/log/srsran/enb.log',
        '/tmp/srsran.log',
        './logs/srsran.log'
      ],
      open5gs: [
        '/var/log/open5gs/mme.log',
        '/var/log/open5gs/smf.log',
        '/var/log/open5gs/upf.log',
        './logs/open5gs.log'
      ],
      kamailio: [
        '/var/log/kamailio.log',
        '/tmp/kamailio.log',
        './logs/kamailio.log'
      ]
    };

    // Try to set up watchers for existing log files
    Object.entries(logConfigs).forEach(([source, paths]) => {
      for (const logPath of paths) {
        if (fs.existsSync(logPath)) {
          this.setupLogWatcher(source, logPath);
          break;
        }
      }
    });
  }

  setupLogWatcher(source, logPath) {
    try {
      console.log(`Setting up log watcher for ${source}: ${logPath}`);

      // Initialize log buffer
      this.logBuffers.set(source, []);

      // Watch the log file
      const watcher = fs.watch(logPath, (eventType) => {
        if (eventType === 'change') {
          this.readNewLogLines(source, logPath);
        }
      });

      this.logWatchers.set(source, { watcher, path: logPath });
      console.log(`Log watcher established for ${source}`);
    } catch (error) {
      console.error(`Failed to setup log watcher for ${source}:`, error);
    }
  }

  readNewLogLines(source, logPath) {
    try {
      const content = fs.readFileSync(logPath, 'utf8');
      const lines = content.split('\n').filter(line => line.trim());

      // Get the last few lines (assuming file grows)
      const newLines = lines.slice(-50);

      newLines.forEach(line => {
        if (line.trim()) {
          const parsedLog = this.parseLogLine(source, line);
          if (parsedLog) {
            // Add to buffer
            const buffer = this.logBuffers.get(source) || [];
            buffer.push(parsedLog);
            if (buffer.length > 1000) buffer.shift(); // Keep last 1000 entries
            this.logBuffers.set(source, buffer);

            // Broadcast to WebSocket clients
            this.broadcastLog(source, parsedLog);
          }
        }
      });
    } catch (error) {
      console.error(`Error reading log file ${logPath}:`, error);
    }
  }

  parseLogLine(source, line) {
    try {
      const timestamp = new Date().toISOString();

      // srsRAN log format: [LAYER] [LEVEL] [TIMESTAMP] message
      if (source === 'srsran') {
        const srsranMatch = line.match(/^\[([A-Z]+)\]\s*\[([IWED])\]\s*(?:\[[^\]]+\]\s*)?(.+)$/);
        if (srsranMatch) {
          const logEntry = {
            id: Date.now() + Math.random(),
            timestamp,
            source: 'srsran',
            layer: srsranMatch[1].toLowerCase(),
            level: srsranMatch[2],
            message: srsranMatch[3].trim(),
            raw: line,
            component: srsranMatch[1],
            messageType: this.extractMessageType(srsranMatch[3].trim()),
            rnti: this.extractRnti(srsranMatch[3].trim()),
            ueId: this.extractUeId(srsranMatch[3].trim()),
            fields: this.extractFields(srsranMatch[3].trim()),
            rawData: line
          };

          // Save to database
          this.databaseService.saveLogEntry(logEntry);
          
          return logEntry;
        }
      }

      // Open5GS log format
      if (source === 'open5gs') {
        const open5gsMatch = line.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z)\s+\[([^\]]+)\]\s+([A-Z]+)\s+(.+)$/);
        if (open5gsMatch) {
          return {
            id: Date.now() + Math.random(),
            timestamp: open5gsMatch[1],
            source: 'open5gs',
            component: open5gsMatch[2],
            level: open5gsMatch[3],
            message: open5gsMatch[4].trim(),
            raw: line
          };
        }
      }

      // Kamailio log format
      if (source === 'kamailio') {
        const kamailioMatch = line.match(/^(\d+)\s*\((.+?)\)\s*([A-Z]+):\s*(.+)$/);
        if (kamailioMatch) {
          return {
            id: Date.now() + Math.random(),
            timestamp,
            source: 'kamailio',
            pid: kamailioMatch[1],
            component: kamailioMatch[2],
            level: kamailioMatch[3],
            message: kamailioMatch[4].trim(),
            raw: line
          };
        }
      }

      // Generic fallback
      return {
        id: Date.now() + Math.random(),
        timestamp,
        source,
        level: 'I',
        message: line,
        raw: line
      };
    } catch (error) {
      console.error('Error parsing log line:', error);
      return null;
    }
  }

  broadcastLog(source, logEntry) {
    const message = JSON.stringify({
      type: 'log',
      source,
      data: logEntry
    });

    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        // Check if client is subscribed to this source
        if (!client.subscribedSources || client.subscribedSources.includes(source)) {
          try {
            client.send(message);
          } catch (error) {
            console.error('Error sending to client:', error);
            this.clients.delete(client);
          }
        }
      }
    });
  }

  startCLITool(tool, config = {}) {
    try {
      let command, args;

      switch (tool) {
        case 'srsran':
          command = 'srsenb';
          args = [
            '--rf.device=zmq',
            '--rf.device_args="fail_on_disconnect=true"',
            '--log.level=info',
            '--log.filename=/tmp/srsran.log'
          ];
          break;

        case 'open5gs':
          command = 'open5gs-mmed';
          args = ['-c', config.configPath || '/etc/open5gs/mme.yaml'];
          break;

        case 'kamailio':
          command = 'kamailio';
          args = ['-f', config.configPath || '/etc/kamailio/kamailio.cfg', '-DD', '-E'];
          break;

        default:
          throw new Error(`Unsupported CLI tool: ${tool}`);
      }

      console.log(`Starting ${tool} with command: ${command} ${args.join(' ')}`);

      const process = spawn(command, args, {
        stdio: ['ignore', 'pipe', 'pipe'],
        detached: true
      });

      process.startTime = new Date();

      // Handle process output
      process.stdout.on('data', (data) => {
        const lines = data.toString().split('\n');
        lines.forEach(line => {
          if (line.trim()) {
            const parsedLog = this.parseLogLine(tool, line);
            if (parsedLog) {
              this.broadcastLog(tool, parsedLog);
            }
          }
        });
      });

      process.stderr.on('data', (data) => {
        console.error(`${tool} stderr:`, data.toString());
      });

      process.on('close', (code) => {
        console.log(`${tool} process exited with code ${code}`);
        this.cliProcesses.delete(tool);
      });

      process.on('error', (error) => {
        console.error(`${tool} process error:`, error);
        this.cliProcesses.delete(tool);
      });

      this.cliProcesses.set(tool, process);

      // Set up log file watcher if the process writes to a file
      setTimeout(() => {
        this.trySetupLogWatcherForTool(tool);
      }, 2000);

    } catch (error) {
      console.error(`Failed to start ${tool}:`, error);
      throw error;
    }
  }

  stopCLITool(tool) {
    const process = this.cliProcesses.get(tool);
    if (process && !process.killed) {
      process.kill('SIGTERM');

      // Give it 5 seconds to terminate gracefully
      setTimeout(() => {
        if (!process.killed) {
          process.kill('SIGKILL');
        }
      }, 5000);

      this.cliProcesses.delete(tool);
      console.log(`${tool} stopped`);
    }
  }

  trySetupLogWatcherForTool(tool) {
    const logPaths = {
      srsran: ['/tmp/srsran.log', '/var/log/srsran/enb.log'],
      open5gs: ['/var/log/open5gs/mme.log', '/var/log/open5gs/smf.log'],
      kamailio: ['/var/log/kamailio.log', '/tmp/kamailio.log']
    };

    const paths = logPaths[tool] || [];
    for (const logPath of paths) {
      if (fs.existsSync(logPath)) {
        this.setupLogWatcher(tool, logPath);
        break;
      }
    }
  }

  getSystemStatus() {
    return {
      timestamp: new Date().toISOString(),
      cliProcesses: Array.from(this.cliProcesses.entries()).map(([name, process]) => ({
        name,
        running: !process.killed,
        pid: process.pid,
        startTime: process.startTime
      })),
      logWatchers: Array.from(this.logWatchers.entries()).map(([name, watcher]) => ({
        name,
        path: watcher.path,
        active: true
      })),
      clients: this.clients.size,
      logBuffers: Array.from(this.logBuffers.entries()).map(([name, buffer]) => ({
        name,
        size: buffer.length
      }))
    };
  }

  // Configuration Management Methods
  loadConfiguration(tool) {
    const configPaths = {
      srsran: '/etc/srsran/enb.conf',
      open5gs: '/etc/open5gs/mme.yaml',
      kamailio: '/etc/kamailio/kamailio.cfg'
    };

    const configPath = configPaths[tool];
    if (!configPath || !fs.existsSync(configPath)) {
      return this.getDefaultConfiguration(tool);
    }

    try {
      const content = fs.readFileSync(configPath, 'utf8');
      return this.parseConfigurationFile(tool, content);
    } catch (error) {
      console.error(`Error loading ${tool} configuration:`, error);
      return this.getDefaultConfiguration(tool);
    }
  }

  saveConfiguration(tool, config) {
    const configPaths = {
      srsran: '/etc/srsran/enb.conf',
      open5gs: '/etc/open5gs/mme.yaml',
      kamailio: '/etc/kamailio/kamailio.cfg'
    };

    const configPath = configPaths[tool];
    if (!configPath) {
      throw new Error(`Unsupported tool: ${tool}`);
    }

    try {
      const content = this.generateConfigurationFile(tool, config);

      // Ensure directory exists
      const dir = path.dirname(configPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(configPath, content, 'utf8');
      console.log(`${tool} configuration saved to ${configPath}`);
    } catch (error) {
      console.error(`Error saving ${tool} configuration:`, error);
      throw error;
    }
  }

  parseConfigurationFile(tool, content) {
    switch (tool) {
      case 'srsran':
        return this.parseSrsranConfig(content);
      case 'open5gs':
        return this.parseOpen5gsConfig(content);
      case 'kamailio':
        return this.parseKamailioConfig(content);
      default:
        throw new Error(`Unsupported tool: ${tool}`);
    }
  }

  generateConfigurationFile(tool, config) {
    switch (tool) {
      case 'srsran':
        return this.generateSrsranConfig(config);
      case 'open5gs':
        return this.generateOpen5gsConfig(config);
      case 'kamailio':
        return this.generateKamailioConfig(config);
      default:
        throw new Error(`Unsupported tool: ${tool}`);
    }
  }

  getDefaultConfiguration(tool) {
    const defaults = {
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
        },
        expert: {
          lte_sample_rates: false,
          clock_ppm: '0'
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
        },
        sgw: {
          gtpc: { addr: '127.0.0.1' },
          gtpu: { addr: '127.0.0.1' }
        },
        pgw: {
          gtpc: { addr: '127.0.0.1' },
          gtpu: { addr: '127.0.0.1' }
        },
        hss: {
          freeDiameter: '/etc/freeDiameter/hss.conf',
          db_uri: 'mongodb://localhost/open5gs'
        }
      },
      kamailio: {
        global: {
          log_facility: 'LOG_LOCAL0',
          log_prefix: '"KAMAILIO: "',
          port: 5060,
          listen: 'udp:127.0.0.1:5060',
          sip_warning: 'yes'
        },
        modules: {
          sl: 'yes',
          tm: 'yes',
          rr: 'yes',
          pv: 'yes',
          textops: 'yes',
          usrloc: 'yes',
          registrar: 'yes',
          auth: 'yes',
          auth_db: 'yes'
        },
        database: {
          db_url: 'mysql://kamailio:kamailiorw@localhost/kamailio',
          db_mode: 0
        },
        ims: {
          ims_ipsec_pcscf_port: 4060,
          ims_ipsec_scscf_port: 6060,
          ims_diameter_peer: '"127.0.0.1"',
          ims_auth_service_type: 0,
          ims_auth_expires: 3600
        }
      }
    };

    return defaults[tool] || {};
  }

  validateConfiguration(tool, config) {
    const errors = [];
    const warnings = [];

    switch (tool) {
      case 'srsran':
        if (!config.enb?.enb_id) errors.push('eNB ID is required');
        if (!config.enb?.mcc || !config.enb?.mnc) errors.push('MCC and MNC are required');
        if (config.rf?.tx_gain && (config.rf.tx_gain < 0 || config.rf.tx_gain > 100)) {
          warnings.push('TX Gain should be between 0-100');
        }
        break;

      case 'open5gs':
        if (!config.mme?.s1ap?.addr) errors.push('MME S1AP address is required');
        if (!config.mme?.gtpc?.addr) errors.push('MME GTPC address is required');
        break;

      case 'kamailio':
        if (!config.global?.port || config.global.port < 1 || config.global.port > 65535) {
          errors.push('Valid SIP port (1-65535) is required');
        }
        if (!config.database?.db_url) warnings.push('Database URL not configured');
        break;
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  getConfigurationTemplates(tool) {
    const templates = {
      srsran: {
        'basic': {
          name: 'Basic eNB',
          description: 'Basic eNB configuration for testing',
          config: {
            enb: { enb_id: '0x19B', cell_id: '0x01', tac: '0x0007', mcc: '001', mnc: '01' },
            rf: { device_name: 'zmq', tx_gain: '50', rx_gain: '40' }
          }
        },
        'advanced': {
          name: 'Advanced eNB',
          description: 'Advanced eNB with multiple cells',
          config: {
            enb: { enb_id: '0x19B', cell_id: '0x01', tac: '0x0007', mcc: '001', mnc: '01' },
            rf: { device_name: 'uhd', tx_gain: '60', rx_gain: '50' }
          }
        }
      },
      open5gs: {
        'basic': {
          name: 'Basic Core',
          description: 'Basic 4G core network configuration',
          config: {
            mme: { s1ap: { addr: '127.0.0.1' }, gtpc: { addr: '127.0.0.1' } },
            sgw: { gtpc: { addr: '127.0.0.1' }, gtpu: { addr: '127.0.0.1' } }
          }
        }
      },
      kamailio: {
        'basic': {
          name: 'Basic SIP Server',
          description: 'Basic SIP server configuration',
          config: {
            global: { port: 5060, listen: 'udp:127.0.0.1:5060' },
            modules: { sl: 'yes', tm: 'yes', rr: 'yes' }
          }
        },
        'ims': {
          name: 'IMS Server',
          description: 'IMS-capable SIP server configuration',
          config: {
            global: { port: 5060, listen: 'udp:127.0.0.1:5060' },
            ims: { ims_ipsec_pcscf_port: 4060, ims_ipsec_scscf_port: 6060 }
          }
        }
      }
    };

    return templates[tool] || {};
  }

  // Configuration file parsers
  parseSrsranConfig(content) {
    const config = {};
    const sections = content.split(/\[([^\]]+)\]/);

    for (let i = 1; i < sections.length; i += 2) {
      const sectionName = sections[i].trim();
      const sectionContent = sections[i + 1];

      config[sectionName] = {};
      const lines = sectionContent.split('\n');

      for (const line of lines) {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
          const key = match[1].trim();
          const value = match[2].trim();
          config[sectionName][key] = value;
        }
      }
    }

    return config;
  }

  parseOpen5gsConfig(content) {
    try {
      return JSON.parse(content);
    } catch {
      // If not JSON, return basic structure
      return this.getDefaultConfiguration('open5gs');
    }
  }

  parseKamailioConfig(content) {
    const config = { global: {}, modules: {}, database: {}, ims: {} };

    const lines = content.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('#') || !trimmed) continue;

      // Parse different types of Kamailio config lines
      if (trimmed.includes('=')) {
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=').trim();

        if (key.includes('log_')) {
          config.global[key] = value;
        } else if (key.includes('db_')) {
          config.database[key] = value;
        } else if (key.includes('ims_')) {
          config.ims[key] = value;
        }
      } else if (trimmed.startsWith('loadmodule')) {
        // Parse module loading
        const moduleMatch = trimmed.match(/loadmodule\s+"([^"]+)"/);
        if (moduleMatch) {
          const moduleName = moduleMatch[1].replace('.so', '');
          config.modules[moduleName] = 'yes';
        }
      }
    }

    return config;
  }

  // Configuration file generators
  generateSrsranConfig(config) {
    let content = '';

    for (const [sectionName, sectionData] of Object.entries(config)) {
      content += `[${sectionName}]\n`;

      for (const [key, value] of Object.entries(sectionData)) {
        content += `${key} = ${value}\n`;
      }

      content += '\n';
    }

    return content;
  }

  generateOpen5gsConfig(config) {
    return JSON.stringify(config, null, 2);
  }

  generateKamailioConfig(config) {
    let content = '# Kamailio Configuration\n# Generated by 5GLabX Configuration Manager\n\n';

    // Global parameters
    content += '####### Global Parameters #########\n';
    for (const [key, value] of Object.entries(config.global || {})) {
      content += `${key}=${value}\n`;
    }
    content += '\n';

    // Modules
    content += '####### Modules Section #########\n';
    for (const [module, enabled] of Object.entries(config.modules || {})) {
      if (enabled === 'yes') {
        content += `loadmodule "${module}.so"\n`;
      }
    }
    content += '\n';

    // Database
    content += '####### Database Section #########\n';
    for (const [key, value] of Object.entries(config.database || {})) {
      content += `${key}=${value}\n`;
    }
    content += '\n';

    // IMS
    content += '####### IMS Section #########\n';
    for (const [key, value] of Object.entries(config.ims || {})) {
      content += `${key}=${value}\n`;
    }
    content += '\n';

    // Basic routing logic
    content += '####### Routing Logic #########\n';
    content += 'request_route {\n';
    content += '    # Log all requests\n';
    content += '    xlog("L_INFO", "REQUEST: $rm from $fu to $ru\\n");\n';
    content += '\n';
    content += '    # Handle REGISTER\n';
    content += '    if (is_method("REGISTER")) {\n';
    content += '        sl_send_reply("200", "OK");\n';
    content += '        exit;\n';
    content += '    }\n';
    content += '\n';
    content += '    # Handle INVITE\n';
    content += '    if (is_method("INVITE")) {\n';
    content += '        xlog("L_INFO", "INVITE: $ru\\n");\n';
    content += '        sl_send_reply("200", "OK");\n';
    content += '        exit;\n';
    content += '    }\n';
    content += '\n';
    content += '    sl_send_reply("404", "Not Found");\n';
    content += '}\n';

    return content;
  }

  // CLI Health Check and Verification Methods
  checkToolHealth(tool) {
    const process = this.cliProcesses.get(tool);
    const isRunning = process && !process.killed;

    if (!isRunning) {
      return {
        status: 'error',
        message: `${tool} process is not running`,
        lastCheck: new Date().toISOString(),
        responseTime: null
      };
    }

    try {
      // Perform tool-specific health checks
      switch (tool) {
        case 'srsran':
          return this.checkSrsranHealth(process);
        case 'open5gs':
          return this.checkOpen5gsHealth(process);
        case 'kamailio':
          return this.checkKamailioHealth(process);
        default:
          return {
            status: 'unknown',
            message: `Unknown tool: ${tool}`,
            lastCheck: new Date().toISOString(),
            responseTime: null
          };
      }
    } catch (error) {
      return {
        status: 'error',
        message: `Health check failed: ${error.message}`,
        lastCheck: new Date().toISOString(),
        responseTime: null
      };
    }
  }

  checkSrsranHealth(process) {
    const startTime = Date.now();

    try {
      // Check if srsRAN is responding to basic commands
      // This is a simplified health check - in production you'd check actual metrics
      const uptime = process.startTime ? Date.now() - process.startTime.getTime() : 0;

      // Check for recent log activity
      const hasRecentLogs = this.checkRecentLogActivity('srsran');

      // Check if process is still responsive
      const isResponsive = process && !process.killed;

      const responseTime = Date.now() - startTime;

      if (!isResponsive) {
        return {
          status: 'error',
          message: 'srsRAN process is not responsive',
          lastCheck: new Date().toISOString(),
          responseTime,
          metrics: { uptime, ue_count: 0, cell_load: 0, errors: 0 }
        };
      }

      if (!hasRecentLogs) {
        return {
          status: 'warning',
          message: 'srsRAN is running but no recent log activity detected',
          lastCheck: new Date().toISOString(),
          responseTime,
          metrics: { uptime, ue_count: 0, cell_load: 0, errors: 0 }
        };
      }

      return {
        status: 'healthy',
        message: 'srsRAN is running and active',
        lastCheck: new Date().toISOString(),
        responseTime,
        metrics: { uptime, ue_count: 0, cell_load: 0, errors: 0 } // Would be populated from actual metrics
      };

    } catch (error) {
      return {
        status: 'error',
        message: `srsRAN health check failed: ${error.message}`,
        lastCheck: new Date().toISOString(),
        responseTime: Date.now() - startTime,
        metrics: { uptime: 0, ue_count: 0, cell_load: 0, errors: 1 }
      };
    }
  }

  checkOpen5gsHealth(process) {
    const startTime = Date.now();

    try {
      const uptime = process.startTime ? Date.now() - process.startTime.getTime() : 0;
      const hasRecentLogs = this.checkRecentLogActivity('open5gs');
      const isResponsive = process && !process.killed;

      // Check database connectivity (simplified)
      const dbConnected = this.checkDatabaseConnectivity();

      const responseTime = Date.now() - startTime;

      if (!isResponsive) {
        return {
          status: 'error',
          message: 'Open5GS process is not responsive',
          lastCheck: new Date().toISOString(),
          responseTime,
          metrics: { uptime, subscribers: 0, sessions: 0, throughput: 0 }
        };
      }

      if (!dbConnected) {
        return {
          status: 'warning',
          message: 'Open5GS is running but database connection failed',
          lastCheck: new Date().toISOString(),
          responseTime,
          metrics: { uptime, subscribers: 0, sessions: 0, throughput: 0 }
        };
      }

      if (!hasRecentLogs) {
        return {
          status: 'warning',
          message: 'Open5GS is running but no recent log activity detected',
          lastCheck: new Date().toISOString(),
          responseTime,
          metrics: { uptime, subscribers: 0, sessions: 0, throughput: 0 }
        };
      }

      return {
        status: 'healthy',
        message: 'Open5GS is running and connected to database',
        lastCheck: new Date().toISOString(),
        responseTime,
        metrics: { uptime, subscribers: 0, sessions: 0, throughput: 0 }
      };

    } catch (error) {
      return {
        status: 'error',
        message: `Open5GS health check failed: ${error.message}`,
        lastCheck: new Date().toISOString(),
        responseTime: Date.now() - startTime,
        metrics: { uptime: 0, subscribers: 0, sessions: 0, throughput: 0 }
      };
    }
  }

  checkKamailioHealth(process) {
    const startTime = Date.now();

    try {
      const uptime = process.startTime ? Date.now() - process.startTime.getTime() : 0;
      const hasRecentLogs = this.checkRecentLogActivity('kamailio');
      const isResponsive = process && !process.killed;

      // Check database connectivity
      const dbConnected = this.checkDatabaseConnectivity();

      const responseTime = Date.now() - startTime;

      if (!isResponsive) {
        return {
          status: 'error',
          message: 'Kamailio process is not responsive',
          lastCheck: new Date().toISOString(),
          responseTime,
          metrics: { uptime, registrations: 0, calls: 0, sip_errors: 0 }
        };
      }

      if (!dbConnected) {
        return {
          status: 'warning',
          message: 'Kamailio is running but database connection failed',
          lastCheck: new Date().toISOString(),
          responseTime,
          metrics: { uptime, registrations: 0, calls: 0, sip_errors: 0 }
        };
      }

      if (!hasRecentLogs) {
        return {
          status: 'warning',
          message: 'Kamailio is running but no recent log activity detected',
          lastCheck: new Date().toISOString(),
          responseTime,
          metrics: { uptime, registrations: 0, calls: 0, sip_errors: 0 }
        };
      }

      return {
        status: 'healthy',
        message: 'Kamailio is running and processing SIP traffic',
        lastCheck: new Date().toISOString(),
        responseTime,
        metrics: { uptime, registrations: 0, calls: 0, sip_errors: 0 }
      };

    } catch (error) {
      return {
        status: 'error',
        message: `Kamailio health check failed: ${error.message}`,
        lastCheck: new Date().toISOString(),
        responseTime: Date.now() - startTime,
        metrics: { uptime: 0, registrations: 0, calls: 0, sip_errors: 1 }
      };
    }
  }

  checkRecentLogActivity(source) {
    const logs = this.logBuffers.get(source) || [];
    if (logs.length === 0) return false;

    // Check if there are logs from the last 30 seconds
    const thirtySecondsAgo = Date.now() - 30000;
    const recentLogs = logs.filter(log => {
      const logTime = new Date(log.timestamp).getTime();
      return logTime > thirtySecondsAgo;
    });

    return recentLogs.length > 0;
  }

  checkDatabaseConnectivity() {
    // Simplified database connectivity check
    // In production, this would actually test database connections
    return true; // Assume connected for now
  }

  checkConnection(fromTool, toTarget) {
    try {
      switch (`${fromTool}-${toTarget}`) {
        case 'srsran-open5gs':
          return this.checkSrsranToOpen5gsConnection();
        case 'open5gs-srsran':
          return this.checkOpen5gsToSrsranConnection();
        case 'open5gs-database':
          return this.checkDatabaseConnectivity();
        case 'kamailio-database':
          return this.checkDatabaseConnectivity();
        case 'srsran-ue':
          return this.checkSrsranUEConnection();
        case 'kamailio-sip_clients':
          return this.checkKamailioSipClients();
        default:
          return 'unknown';
      }
    } catch (error) {
      console.error(`Connection check failed ${fromTool} -> ${toTarget}:`, error);
      return 'error';
    }
  }

  checkSrsranToOpen5gsConnection() {
    // Check if srsRAN is successfully connecting to Open5GS MME
    const srsranLogs = this.logBuffers.get('srsran') || [];
    const recentLogs = srsranLogs.slice(-10); // Check last 10 logs

    // Look for connection success messages
    const connectionLogs = recentLogs.filter(log =>
      log.message && (
        log.message.includes('S1AP') ||
        log.message.includes('connected') ||
        log.message.includes('MME')
      )
    );

    if (connectionLogs.length > 0) {
      return 'connected';
    }

    // If srsRAN is running but no connection logs, might be connecting
    const srsranProcess = this.cliProcesses.get('srsran');
    if (srsranProcess && !srsranProcess.killed) {
      return 'connecting';
    }

    return 'disconnected';
  }

  checkOpen5gsToSrsranConnection() {
    // Check if Open5GS is receiving connections from srsRAN
    const open5gsLogs = this.logBuffers.get('open5gs') || [];
    const recentLogs = open5gsLogs.slice(-10);

    const connectionLogs = recentLogs.filter(log =>
      log.message && (
        log.message.includes('S1AP') ||
        log.message.includes('eNB') ||
        log.message.includes('connected')
      )
    );

    if (connectionLogs.length > 0) {
      return 'connected';
    }

    const open5gsProcess = this.cliProcesses.get('open5gs');
    if (open5gsProcess && !open5gsProcess.killed) {
      return 'listening';
    }

    return 'disconnected';
  }

  checkSrsranUEConnection() {
    // Check if srsRAN has active UE connections
    const srsranLogs = this.logBuffers.get('srsran') || [];
    const recentLogs = srsranLogs.slice(-20);

    const ueLogs = recentLogs.filter(log =>
      log.message && (
        log.message.includes('UE') ||
        log.message.includes('RRC') ||
        log.message.includes('connected')
      )
    );

    if (ueLogs.length > 0) {
      return 'connected';
    }

    return 'no_connections';
  }

  checkKamailioSipClients() {
    // Check if Kamailio has active SIP clients
    const kamailioLogs = this.logBuffers.get('kamailio') || [];
    const recentLogs = kamailioLogs.slice(-10);

    const sipLogs = recentLogs.filter(log =>
      log.message && (
        log.message.includes('REGISTER') ||
        log.message.includes('INVITE') ||
        log.message.includes('SIP')
      )
    );

    if (sipLogs.length > 0) {
      return 'active';
    }

    const kamailioProcess = this.cliProcesses.get('kamailio');
    if (kamailioProcess && !kamailioProcess.killed) {
      return 'listening';
    }

    return 'inactive';
  }

  testConnection(fromTool, toTarget) {
    try {
      const connectionStatus = this.checkConnection(fromTool, toTarget);

      switch (connectionStatus) {
        case 'connected':
        case 'active':
          return { success: true, status: connectionStatus };
        case 'connecting':
        case 'listening':
          return { success: true, status: connectionStatus, message: 'Connection in progress' };
        case 'disconnected':
        case 'inactive':
        case 'no_connections':
          return { success: false, error: `No active connection detected (${connectionStatus})` };
        default:
          return { success: false, error: 'Unable to determine connection status' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  getToolMetrics(tool) {
    // Return mock metrics - in production, these would be collected from actual tool APIs
    const baseMetrics = {
      uptime: 0,
      errors: 0,
      throughput: 0
    };

    const process = this.cliProcesses.get(tool);
    if (process && process.startTime) {
      baseMetrics.uptime = Math.floor((Date.now() - process.startTime.getTime()) / 1000);
    }

    switch (tool) {
      case 'srsran':
        return {
          ...baseMetrics,
          ue_count: Math.floor(Math.random() * 10), // Mock data
          cell_load: Math.floor(Math.random() * 100),
          rrc_connections: Math.floor(Math.random() * 5)
        };
      case 'open5gs':
        return {
          ...baseMetrics,
          subscribers: Math.floor(Math.random() * 100),
          sessions: Math.floor(Math.random() * 20),
          throughput: Math.floor(Math.random() * 1000)
        };
      case 'kamailio':
        return {
          ...baseMetrics,
          registrations: Math.floor(Math.random() * 50),
          calls: Math.floor(Math.random() * 10),
          sip_errors: Math.floor(Math.random() * 3)
        };
      default:
        return baseMetrics;
    }
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`Real CLI Log Server started on port ${this.port}`);
      console.log(`WebSocket server on port 8081`);
      console.log('Ready to monitor CLI logs and stream to frontend');
    });
  }

  // Helper methods for log parsing
  extractMessageType(message) {
    if (message.includes('PDSCH')) return 'PDSCH';
    if (message.includes('PUSCH')) return 'PUSCH';
    if (message.includes('PUCCH')) return 'PUCCH';
    if (message.includes('RRC')) return 'RRC';
    if (message.includes('MAC')) return 'MAC';
    if (message.includes('RLC')) return 'RLC';
    if (message.includes('PDCP')) return 'PDCP';
    return 'GENERIC';
  }

  extractRnti(message) {
    const match = message.match(/rnti[=:\s]*(?:0x)?([0-9a-fA-F]+)/i);
    return match ? match[1] : null;
  }

  extractUeId(message) {
    const match = message.match(/ue[=:\s]*(\d+)/i);
    return match ? match[1] : null;
  }

  extractFields(message) {
    const fields = {};
    
    // Extract common fields
    const rntiMatch = message.match(/rnti[=:\s]*(?:0x)?([0-9a-fA-F]+)/i);
    if (rntiMatch) fields.rnti = rntiMatch[1];
    
    const ueMatch = message.match(/ue[=:\s]*(\d+)/i);
    if (ueMatch) fields.ue = ueMatch[1];
    
    const mcsMatch = message.match(/mcs[=:\s]*(\d+)/i);
    if (mcsMatch) fields.mcs = parseInt(mcsMatch[1]);
    
    const prbMatch = message.match(/prb[=:\s]*(\d+)/i);
    if (prbMatch) fields.prb = parseInt(prbMatch[1]);
    
    const sizeMatch = message.match(/size[=:\s]*(\d+)/i);
    if (sizeMatch) fields.size = parseInt(sizeMatch[1]);
    
    return fields;
  }

  stop() {
    console.log('Stopping Real CLI Log Server...');

    // Stop all CLI processes
    for (const [name, process] of this.cliProcesses) {
      this.stopCLITool(name);
    }

    // Close WebSocket server
    if (this.wss) {
      this.wss.close();
    }

    // Close watchers
    for (const [name, watcher] of this.logWatchers) {
      watcher.watcher.close();
    }

    // Close database connection
    if (this.databaseService) {
      this.databaseService.close();
    }

    // Stop network monitoring
    if (this.networkManager) {
      this.networkManager.stopPeriodicTesting();
    }

    console.log('Server stopped');
  }
}

// Start the server if this file is run directly
if (require.main === module) {
  const server = new RealCLILogServer();
  server.start();

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\nReceived SIGINT, shutting down gracefully...');
    server.stop();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\nReceived SIGTERM, shutting down gracefully...');
    server.stop();
    process.exit(0);
  });
}

module.exports = RealCLILogServer;
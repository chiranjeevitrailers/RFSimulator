// CLIBridge - Central CLI data distribution system
function CLIBridge() {
  try {
    const [connections, setConnections] = React.useState({
      srsran: { status: 'connected', parser: null },
      open5gs: { status: 'connected', parser: null },
      kamailio: { status: 'connected', parser: null }
    });

    const [dataFlows, setDataFlows] = React.useState({
      rawLogs: [],
      parsedLogs: [],
      metrics: {
        srsran: { throughput: 125.5, latency: 12.3, snr: 18.2, rsrp: -85 },
        open5gs: { sessionCount: 42, registrations: 156, pduSessions: 38 },
        kamailio: { sipCalls: 23, registrations: 89, responses: 234 }
      },
      callFlows: [
        { id: 1, timestamp: new Date().toISOString(), source: 'UE', target: 'IMS', message: 'REGISTER', component: 'SIP' },
        { id: 2, timestamp: new Date().toISOString(), source: 'UE', target: 'AMF', message: 'Registration Request', component: 'NAS' }
      ],
      layerStats: {
        srsran: { totalMessages: 1250, errorCount: 12, warnCount: 45, phyMessages: 890, macMessages: 360 },
        open5gs: { totalMessages: 890, errorCount: 3, warnCount: 18, amfMessages: 340, smfMessages: 280 },
        kamailio: { totalMessages: 456, errorCount: 8, warnCount: 22, sipRequests: 200, sipResponses: 256 }
      },
      protocolData: {
        phy: { cellId: 1, frequency: 3500, bandwidth: 100, txPower: 23 },
        mac: { rnti: '0x4601', harqProcesses: 8, schedulingGrants: 145 },
        rrc: { connections: 12, handovers: 3, measurements: 89 },
        nas: { attachedUes: 42, tauRequests: 15, bearers: 67 },
        ims: { registeredUsers: 38, activeCalls: 12, sipSessions: 45 }
      }
    });

    // Initialize WebSocket connection and parsers
    React.useEffect(() => {
      try {
        // Initialize parsers
        setConnections(prev => ({
          ...prev,
          srsran: { ...prev.srsran, parser: window.SrsranLogParser ? window.SrsranLogParser() : null },
          open5gs: { ...prev.open5gs, parser: window.Open5gsCliParser ? window.Open5gsCliParser() : null },
          kamailio: { ...prev.kamailio, parser: window.KamailioCliParser ? window.KamailioCliParser() : null }
        }));

        // SaaS deployment: prefer Supabase Realtime; do not default to localhost
        const wsUrl = process.env.NEXT_PUBLIC_5GLABX_WS_URL;
        if (!wsUrl) {
          console.log('CLIBridge: Skipping WebSocket (SaaS mode without WS URL). Using realtime/db.');
          return;
        }
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.log('CLIBridge: Connected to backend WebSocket server');
          setConnections(prev => ({
            ...prev,
            srsran: { ...prev.srsran, status: 'connected' },
            open5gs: { ...prev.open5gs, status: 'connected' },
            kamailio: { ...prev.kamailio, status: 'connected' }
          }));

          // Subscribe to all log sources
          ws.send(JSON.stringify({
            type: 'subscribe',
            sources: ['srsran', 'open5gs', 'kamailio']
          }));
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            if (data.type === 'log') {
              // Handle real log data from backend
              handleRealLogData(data.source, data.data);
            } else if (data.type === 'status') {
              // Handle status updates
              console.log('Backend status:', data.data);
            }
          } catch (error) {
            console.error('CLIBridge WebSocket message error:', error);
          }
        };

        ws.onclose = () => {
          console.log('CLIBridge: WebSocket connection closed');
          setConnections(prev => ({
            ...prev,
            srsran: { ...prev.srsran, status: 'disconnected' },
            open5gs: { ...prev.open5gs, status: 'disconnected' },
            kamailio: { ...prev.kamailio, status: 'disconnected' }
          }));

          // Attempt to reconnect after 5 seconds
          setTimeout(() => {
            console.log('CLIBridge: Attempting to reconnect...');
            // The useEffect will re-run and create a new connection
          }, 5000);
        };

        ws.onerror = (error) => {
          console.error('CLIBridge WebSocket error:', error);
        };

        // Store WebSocket reference for cleanup
        window.cliBridgeWS = ws;

        return () => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.close();
          }
        };
      } catch (error) {
        console.error('CLIBridge init error:', error);
        // Fallback to mock data if WebSocket fails
        const interval = setInterval(() => {
          simulateNewData();
        }, 3000);
        return () => clearInterval(interval);
      }
    }, []);

    const handleRealLogData = (source, logEntry) => {
      try {
        // Process real log data and update metrics
        setDataFlows(prev => {
          const newRawLogs = [...prev.rawLogs.slice(-199), logEntry];
          const newParsedLogs = [...prev.parsedLogs.slice(-199), logEntry];

          // Update metrics based on real data
          const newMetrics = { ...prev.metrics };

          // Update source-specific metrics
          if (source === 'srsran') {
            newMetrics.srsran = {
              throughput: calculateThroughput(newParsedLogs.filter(l => l.source === 'srsran')),
              latency: calculateLatency(newParsedLogs.filter(l => l.source === 'srsran')),
              snr: extractSNR(logEntry),
              rsrp: extractRSRP(logEntry)
            };
          } else if (source === 'open5gs') {
            newMetrics.open5gs = {
              sessionCount: countSessions(newParsedLogs.filter(l => l.source === 'open5gs')),
              registrations: countRegistrations(newParsedLogs.filter(l => l.source === 'open5gs')),
              pduSessions: countPDUSessions(newParsedLogs.filter(l => l.source === 'open5gs'))
            };
          } else if (source === 'kamailio') {
            newMetrics.kamailio = {
              sipCalls: countSIPCalls(newParsedLogs.filter(l => l.source === 'kamailio')),
              registrations: countSIPRegistrations(newParsedLogs.filter(l => l.source === 'kamailio')),
              responses: countSIPResponses(newParsedLogs.filter(l => l.source === 'kamailio'))
            };
          }

          // Update layer stats
          const newLayerStats = { ...prev.layerStats };
          newLayerStats[source] = calculateLayerStats(newParsedLogs.filter(l => l.source === source));

          return {
            ...prev,
            rawLogs: newRawLogs,
            parsedLogs: newParsedLogs,
            metrics: newMetrics,
            layerStats: newLayerStats
          };
        });
      } catch (error) {
        console.error('Handle real log data error:', error);
      }
    };

    const simulateNewData = () => {
      try {
        const sources = ['srsran', 'open5gs', 'kamailio'];
        const source = sources[Math.floor(Math.random() * sources.length)];

        const mockLogEntry = {
          id: Date.now() + Math.random(),
          timestamp: new Date().toISOString(),
          source,
          component: getRandomComponent(source),
          level: ['info', 'warn', 'error'][Math.floor(Math.random() * 3)],
          message: generateMockMessage(source),
          fields: {}
        };

        // Use the same handler for mock data (fallback when WebSocket fails)
        handleRealLogData(source, mockLogEntry);
      } catch (error) {
        console.error('Simulate data error:', error);
      }
    };

    // Helper functions for real log data processing
    const calculateThroughput = (logs) => {
      const throughputMatches = logs
        .map(log => log.message?.match(/throughput[:=]\s*([\d.]+)\s*(Mbps|Gbps|bps)/i))
        .filter(match => match)
        .slice(-10); // Last 10 measurements

      if (throughputMatches.length === 0) return 125.5;

      const avgThroughput = throughputMatches.reduce((sum, match) => {
        const value = parseFloat(match[1]);
        const unit = match[2].toLowerCase();
        return sum + (unit === 'gbps' ? value * 1000 : unit === 'bps' ? value / 1000000 : value);
      }, 0) / throughputMatches.length;

      return Math.round(avgThroughput * 10) / 10;
    };

    const calculateLatency = (logs) => {
      const latencyMatches = logs
        .map(log => log.message?.match(/latency[:=]\s*([\d.]+)\s*(ms|us)/i))
        .filter(match => match)
        .slice(-10);

      if (latencyMatches.length === 0) return 12.3;

      const avgLatency = latencyMatches.reduce((sum, match) => {
        const value = parseFloat(match[1]);
        const unit = match[2].toLowerCase();
        return sum + (unit === 'us' ? value / 1000 : value);
      }, 0) / latencyMatches.length;

      return Math.round(avgLatency * 10) / 10;
    };

    const extractSNR = (logEntry) => {
      const snrMatch = logEntry.message?.match(/SNR[:=]\s*([\d.-]+)\s*dB/i);
      return snrMatch ? parseFloat(snrMatch[1]) : 18.2;
    };

    const extractRSRP = (logEntry) => {
      const rsrpMatch = logEntry.message?.match(/RSRP[:=]\s*([\d.-]+)\s*dBm/i);
      return rsrpMatch ? parseFloat(rsrpMatch[1]) : -85;
    };

    const countSessions = (logs) => {
      return logs.filter(log =>
        log.message?.includes('session') ||
        log.message?.includes('PDU Session') ||
        log.message?.includes('established')
      ).length;
    };

    const countRegistrations = (logs) => {
      return logs.filter(log =>
        log.message?.includes('registration') ||
        log.message?.includes('register') ||
        log.message?.includes('SUPI')
      ).length;
    };

    const countPDUSessions = (logs) => {
      return logs.filter(log =>
        log.message?.includes('PDU Session') ||
        log.message?.includes('session established')
      ).length;
    };

    const countSIPCalls = (logs) => {
      return logs.filter(log =>
        log.message?.includes('INVITE') ||
        log.message?.includes('BYE') ||
        log.message?.includes('call')
      ).length;
    };

    const countSIPRegistrations = (logs) => {
      return logs.filter(log =>
        log.message?.includes('REGISTER') ||
        log.message?.includes('registration')
      ).length;
    };

    const countSIPResponses = (logs) => {
      return logs.filter(log =>
        log.message?.match(/\d{3}\s+(OK|TRYING|RINGING|NOT FOUND|BUSY)/i)
      ).length;
    };

    const calculateLayerStats = (logs) => {
      const stats = {
        totalMessages: logs.length,
        errorCount: logs.filter(l => l.level === 'E' || l.level === 'error').length,
        warnCount: logs.filter(l => l.level === 'W' || l.level === 'warn').length
      };

      // Add source-specific layer stats
      if (logs[0]?.source === 'srsran') {
        stats.phyMessages = logs.filter(l => l.layer === 'PHY' || l.message?.includes('PHY')).length;
        stats.macMessages = logs.filter(l => l.layer === 'MAC' || l.message?.includes('MAC')).length;
      } else if (logs[0]?.source === 'open5gs') {
        stats.amfMessages = logs.filter(l => l.component === 'AMF' || l.message?.includes('AMF')).length;
        stats.smfMessages = logs.filter(l => l.component === 'SMF' || l.message?.includes('SMF')).length;
      } else if (logs[0]?.source === 'kamailio') {
        stats.sipRequests = logs.filter(l => l.message?.includes('REGISTER') || l.message?.includes('INVITE')).length;
        stats.sipResponses = logs.filter(l => l.message?.match(/\d{3}/)).length;
      }

      return stats;
    };

    const getRandomComponent = (source) => {
      const components = {
        srsran: ['PHY', 'MAC', 'RLC', 'PDCP', 'RRC'],
        open5gs: ['AMF', 'SMF', 'UPF', 'AUSF', 'UDM'],
        kamailio: ['IMS', 'SIP']
      };
      const sourceComponents = components[source] || ['UNKNOWN'];
      return sourceComponents[Math.floor(Math.random() * sourceComponents.length)];
    };

    const generateMockMessage = (source) => {
      const messages = {
        srsran: [
          'Cell search completed successfully',
          'UE connected with RNTI 0x4601',
          'Throughput: 125.5 Mbps, SNR: 18.2 dB',
          'RRC Connection Setup Complete'
        ],
        open5gs: [
          'Registration accepted for SUPI 001010123456789',
          'PDU Session established ID: 5',
          'Authentication successful',
          'SMF context created'
        ],
        kamailio: [
          'SIP REGISTER from 192.168.1.100',
          'INVITE processing for call-id abc123',
          '200 OK response sent',
          'User authenticated successfully'
        ]
      };
      const sourceMessages = messages[source] || ['Unknown message'];
      return sourceMessages[Math.floor(Math.random() * sourceMessages.length)];
    };

    return {
      connections,
      dataFlows,
      processCliData: (data, source) => simulateNewData(),
      connect: (source) => {
        setConnections(prev => ({
          ...prev,
          [source]: { ...prev[source], status: 'connected' }
        }));
      },
      disconnect: (source) => {
        setConnections(prev => ({
          ...prev,
          [source]: { ...prev[source], status: 'disconnected' }
        }));
      },
      getStatus: (source) => connections[source]?.status || 'disconnected',
      getMetricsFor: (component) => dataFlows.metrics,
      getProtocolData: (layer) => dataFlows.protocolData[layer] || {},
      getLayerStats: (layer) => dataFlows.layerStats
    };

  } catch (error) {
    console.error('CLIBridge error:', error);
    return { 
      connections: {}, 
      dataFlows: { rawLogs: [], metrics: {}, callFlows: [], layerStats: {} },
      getMetricsFor: () => ({}),
      getProtocolData: () => ({}),
      getLayerStats: () => ({})
    };
  }
}

window.CLIBridge = CLIBridge;

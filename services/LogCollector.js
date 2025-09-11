// Log Collector Service - Enhanced centralized log collection with parser integration
function LogCollector() {
  try {
    const [logs, setLogs] = React.useState([]);
    const [stats, setStats] = React.useState({
      total: 0,
      bySource: { srsran: 0, open5gs: 0, kamailio: 0 },
      byLevel: { error: 0, warn: 0, info: 0, debug: 0 }
    });
    const [sources, setSources] = React.useState({
      srsran: { enabled: false, connected: false, parser: null },
      open5gs: { enabled: false, connected: false, parser: null },
      kamailio: { enabled: false, connected: false, parser: null }
    });

    // Initialize parsers
    React.useEffect(() => {
      setSources(prev => ({
        ...prev,
        srsran: { ...prev.srsran, parser: window.SrsranLogParser() },
        open5gs: { ...prev.open5gs, parser: window.Open5gsCliParser() },
        kamailio: { ...prev.kamailio, parser: window.KamailioCliParser() }
      }));
    }, []);

    // Start log collection for a source
    const startCollection = async (sourceType) => {
      try {
        setSources(prev => ({
          ...prev,
          [sourceType]: { ...prev[sourceType], enabled: true, connected: true }
        }));
        
        // Simulate real-time log streaming
        startLogStreaming(sourceType);
      } catch (error) {
        console.error('Start collection error:', error);
      }
    };

    // Stop log collection
    const stopCollection = (sourceType) => {
      try {
        setSources(prev => ({
          ...prev,
          [sourceType]: { ...prev[sourceType], enabled: false, connected: false }
        }));
      } catch (error) {
        console.error('Stop collection error:', error);
      }
    };

    // Simulate log streaming
    const startLogStreaming = (sourceType) => {
      const interval = setInterval(() => {
        if (!sources[sourceType]?.enabled) {
          clearInterval(interval);
          return;
        }
        
        const mockLog = generateMockLog(sourceType);
        processLogEntry(mockLog, sourceType);
      }, 2000 + Math.random() * 3000);
    };

    // Generate mock logs for demonstration
    const generateMockLog = (sourceType) => {
      const mockLogs = {
        srsran: [
          '[PHY] [I] [931.6] PDSCH: rnti=0x4601 h_id=0 k1=4 prb=[0,87) symb=[1,14) mod=QPSK rv=0 tbs=309 t=135.5us',
          '[MAC] [I] [938.5] DL PDU: ue=0 rnti=0x4601 size=169: SDU: lcid=1 nof_sdus=1 total_size=55'
        ],
        open5gs: [
          '09/06 11:44:07.168: [amf] INFO: UE SUPI[imsi-001010000000001] registered',
          '09/06 11:44:07.200: [smf] INFO: UE SUPI[imsi-001010000000001] DNN[internet] IPv4[10.45.0.2]'
        ],
        kamailio: [
          'Sep  6 11:44:07 server kamailio[12345]: INFO: <core> [cfg.y:3581]: CALL: INVITE from sip:alice@example.com to sip:bob@example.com',
          'Sep  6 11:44:07 server kamailio[12345]: WARNING: <registrar> [save.c:247]: contact expires=3600'
        ]
      };
      
      const logs = mockLogs[sourceType] || [];
      return logs[Math.floor(Math.random() * logs.length)];
    };

    // Process log entry with appropriate parser
    const processLogEntry = (logEntry, sourceType) => {
      try {
        const parser = sources[sourceType]?.parser;
        let parsedLog = { message: logEntry, raw: logEntry };
        
        if (parser && parser.parseLogEntry) {
          parsedLog = parser.parseLogEntry(logEntry);
        }

        const processedLog = {
          id: window.HELPERS.generateId(),
          timestamp: parsedLog.timestamp || new Date().toISOString(),
          source: sourceType,
          component: parsedLog.component || 'unknown',
          level: parsedLog.level || 'info',
          message: parsedLog.message || logEntry,
          fields: parsedLog.fields || {},
          raw: logEntry
        };

        setLogs(prev => [...prev.slice(-999), processedLog]);
        updateStats(processedLog);
        return processedLog;
      } catch (error) {
        console.error('Process log entry error:', error);
        return null;
      }
    };

    // Update statistics
    const updateStats = (log) => {
      setStats(prev => ({
        total: prev.total + 1,
        bySource: {
          ...prev.bySource,
          [log.source]: (prev.bySource[log.source] || 0) + 1
        },
        byLevel: {
          ...prev.byLevel,
          [log.level]: (prev.byLevel[log.level] || 0) + 1
        }
      }));
    };

    return {
      logs,
      stats,
      sources,
      startCollection,
      stopCollection,
      processLogEntry,
      clearLogs: () => {
        setLogs([]);
        setStats({
          total: 0,
          bySource: { srsran: 0, open5gs: 0, kamailio: 0 },
          byLevel: { error: 0, warn: 0, info: 0, debug: 0 }
        });
      }
    };

  } catch (error) {
    console.error('LogCollector error:', error);
    return {
      logs: [],
      stats: {},
      sources: {},
      startCollection: () => {},
      stopCollection: () => {},
      processLogEntry: () => null,
      clearLogs: () => {}
    };
  }
}

window.LogCollector = LogCollector;

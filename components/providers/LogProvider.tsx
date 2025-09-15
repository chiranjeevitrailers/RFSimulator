import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'debug' | 'info' | 'warning' | 'error' | 'critical';
  source: string;
  layer: string;
  protocol: string;
  message: string;
  data: any;
  messageId?: string;
  stepId?: string;
  direction?: 'UL' | 'DL' | 'BIDIRECTIONAL';
  rawData?: string;
  decodedData?: any;
  informationElements?: any[];
  validationResult?: any;
  performanceData?: any;
}

interface LogContextValue {
  logs: LogEntry[];
  clearLogs: () => void;
}

const LogContext = createContext<LogContextValue | undefined>(undefined);

function normaliseIncoming(data: any): LogEntry | null {
  try {
    // If payload already matches interface, return directly
    if (data && data.id && data.timestamp && data.message) {
      return {
        ...data,
        timestamp: new Date(data.timestamp),
      } as LogEntry;
    }

    // Fallback minimal mapping
    return {
      id: data.id || `log_${Date.now()}`,
      timestamp: new Date(data.timestamp || Date.now()),
      level: data.level || 'info',
      source: data.source || 'unknown',
      layer: data.layer || 'OTHER',
      protocol: data.protocol || 'UNKNOWN',
      message: data.message || JSON.stringify(data),
      data: data.data || {},
      direction: data.direction,
      rawData: data.rawData,
      decodedData: data.decoded,
      informationElements: data.ies || data.informationElements,
      validationResult: data.validationResult,
      performanceData: data.performanceData,
    } as LogEntry;
  } catch {
    return null;
  }
}

export const LogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = useCallback((log: LogEntry) => {
    setLogs((prev) => [...prev.slice(-999), log]);
  }, []);

  const clearLogs = useCallback(() => setLogs([]), []);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8081';
    const ws = new WebSocket(url);

    let hasRealData = false;
    let mockInterval: any = null;

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        // Accept two envelope styles: {type, payload} or plain log
        let candidate: any;
        if (msg.type === 'log' || msg.type === 'realtime_data') {
          candidate = msg.payload ?? msg.data ?? msg;
        } else {
          candidate = msg;
        }
        const normalised = normaliseIncoming(candidate);
        if (normalised) {
          hasRealData = true;
          addLog(normalised);
        }
      } catch (err) {
        // Non-JSON payloads ignored
      }
    };

    ws.onerror = () => {
      // ignore; fallback handled below
    };

    // After 2 seconds, if still no real data, start emitting mock logs for demo
    const demoTimeout = setTimeout(() => {
      if (!hasRealData) {
        mockInterval = setInterval(() => {
          const now = Date.now();
          const layers = ['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS'];
          const layer = layers[Math.floor(Math.random()*layers.length)];
          const newLog: LogEntry = {
            id: `demo_${now}`,
            timestamp: new Date(),
            level: ['debug','info','warning','error'][Math.floor(Math.random()*4)] as any,
            source: layer,
            layer,
            protocol: `NR-${layer}`,
            message: `Mock ${layer} message ${Math.random().toString(36).substr(2,5)}`,
            data: { messageType: 'Demo', size: Math.floor(Math.random()*800)+100 },
          } as LogEntry;
          addLog(newLog);
        }, 800);
      }
    }, 2000);

    return () => {
      ws.close();
      clearTimeout(demoTimeout);
      if (mockInterval) clearInterval(mockInterval);
    };
  }, [addLog]);

  return (
    <LogContext.Provider value={{ logs, clearLogs }}>
      {children}
    </LogContext.Provider>
  );
};

export const useLogs = () => {
  const ctx = useContext(LogContext);
  if (!ctx) throw new Error('useLogs must be used within LogProvider');
  return ctx;
};
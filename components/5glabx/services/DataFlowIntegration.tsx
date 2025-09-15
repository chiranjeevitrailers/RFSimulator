'use client';

import React, { useEffect, useState, createContext, useContext } from 'react';

// Data Flow Context
interface DataFlowContextType {
  testCaseData: any;
  layerData: Record<string, any>;
  realTimeData: any;
  isConnected: boolean;
  startTestCase: (testCaseId: string) => Promise<void>;
  stopTestCase: () => void;
  subscribeToLayer: (layer: string, callback: (data: any) => void) => () => void;
}

const DataFlowContext = createContext<DataFlowContextType | null>(null);

export const useDataFlow = () => {
  const context = useContext(DataFlowContext);
  if (!context) {
    throw new Error('useDataFlow must be used within DataFlowProvider');
  }
  return context;
};

// Data Flow Provider Component
export const DataFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [testCaseData, setTestCaseData] = useState<any>(null);
  const [layerData, setLayerData] = useState<Record<string, any>>({});
  const [realTimeData, setRealTimeData] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [layerSubscribers, setLayerSubscribers] = useState<Record<string, Set<(data: any) => void>>>({});

  useEffect(() => {
    const initializeDataFlow = async () => {
      try {
        // Initialize WebSocket connection for real-time data
        if (typeof window !== 'undefined' && window.WebSocketService) {
          const wsService = new window.WebSocketService();
          wsService.connect('ws://localhost:8081');
          
          wsService.on('connected', () => {
            setIsConnected(true);
            console.log('Data flow WebSocket connected');
          });

          wsService.on('disconnected', () => {
            setIsConnected(false);
            console.log('Data flow WebSocket disconnected');
          });

          wsService.on('message', (data: any) => {
            setRealTimeData(data);
            // Distribute data to appropriate layers
            distributeDataToLayers(data);
          });
        }

        // Initialize Test Case Playback Service
        if (typeof window !== 'undefined' && window.TestCasePlaybackService) {
          const playbackService = new window.TestCasePlaybackService({
            databaseService: null, // Will be set when needed
            websocketBroadcast: (type: string, source: string, data: any) => {
              // Broadcast test case data to all subscribers
              broadcastToSubscribers(type, data);
            },
            fetchImpl: fetch
          });
          
          // Store reference for later use
          (window as any).playbackService = playbackService;
        }

        // Initialize Layer Stats Service
        if (typeof window !== 'undefined' && window.LayerStatsService) {
          const layerStats = window.LayerStatsService;
          layerStats.init();
          
          // Subscribe to layer stats updates
          layerStats.subscribe((stats: any) => {
            setLayerData(prev => ({ ...prev, ...stats }));
            // Notify layer subscribers
            Object.keys(stats).forEach(layer => {
              notifyLayerSubscribers(layer, stats[layer]);
            });
          });
        }

        // Initialize Stream Processor
        if (typeof window !== 'undefined' && window.StreamProcessor) {
          const processor = window.StreamProcessor;
          processor.startProcessing();
          
          // Subscribe to processed data
          processor.subscribe((processedData: any) => {
            distributeDataToLayers(processedData);
          });
        }

        // Initialize Log Processor
        if (typeof window !== 'undefined' && window.LogProcessor) {
          const logProcessor = new window.LogProcessor();
          
          logProcessor.subscribe((logs: any[]) => {
            // Process logs by layer
            const logsByLayer = processLogsByLayer(logs);
            setLayerData(prev => ({ ...prev, ...logsByLayer }));
            
            // Notify layer subscribers
            Object.keys(logsByLayer).forEach(layer => {
              notifyLayerSubscribers(layer, logsByLayer[layer]);
            });
          });
        }

        // Initialize Message Analyzer
        if (typeof window !== 'undefined' && window.MessageAnalyzer) {
          const messageAnalyzer = new window.MessageAnalyzer();
          
          messageAnalyzer.subscribe((analysis: any) => {
            // Distribute analysis results to appropriate layers
            distributeAnalysisToLayers(analysis);
          });
        }

        // Initialize CLI Bridge for real-time CLI data
        if (typeof window !== 'undefined' && window.CLIBridge) {
          const cliBridge = new window.CLIBridge();
          
          cliBridge.subscribe((cliData: any) => {
            setRealTimeData(cliData);
            distributeDataToLayers(cliData);
          });
        }

      } catch (error) {
        console.error('Data flow initialization error:', error);
      }
    };

    initializeDataFlow();
  }, []);

  const processLogsByLayer = (logs: any[]) => {
    const layers = ['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS', 'SIP', 'O-RAN', 'NB-IoT', 'V2X', 'NTN'];
    const logsByLayer: Record<string, any> = {};

    layers.forEach(layer => {
      logsByLayer[layer] = logs.filter(log => 
        log.layer === layer || 
        log.protocol === layer || 
        log.component === layer ||
        log.message?.includes(layer)
      );
    });

    return logsByLayer;
  };

  const distributeDataToLayers = (data: any) => {
    if (!data) return;

    // Determine which layer this data belongs to
    const layer = determineLayer(data);
    if (layer) {
      setLayerData(prev => ({
        ...prev,
        [layer]: {
          ...prev[layer],
          ...data,
          timestamp: Date.now()
        }
      }));
      
      // Notify layer subscribers
      notifyLayerSubscribers(layer, data);
    }
  };

  const determineLayer = (data: any): string | null => {
    if (data.layer) return data.layer;
    if (data.protocol) return data.protocol;
    if (data.component) return data.component;
    
    // Check message content for layer indicators
    const message = data.message || data.content || '';
    if (message.includes('PHY') || message.includes('PDSCH') || message.includes('PUSCH')) return 'PHY';
    if (message.includes('MAC') || message.includes('HARQ') || message.includes('grant')) return 'MAC';
    if (message.includes('RLC') || message.includes('PDU')) return 'RLC';
    if (message.includes('PDCP') || message.includes('cipher')) return 'PDCP';
    if (message.includes('RRC') || message.includes('setup') || message.includes('reconfiguration')) return 'RRC';
    if (message.includes('NAS') || message.includes('registration') || message.includes('authentication')) return 'NAS';
    if (message.includes('SIP') || message.includes('INVITE') || message.includes('IMS')) return 'SIP';
    if (message.includes('O-RAN') || message.includes('F1') || message.includes('E1')) return 'O-RAN';
    if (message.includes('NB-IoT') || message.includes('NPRACH')) return 'NB-IoT';
    if (message.includes('V2X') || message.includes('sidelink')) return 'V2X';
    if (message.includes('NTN') || message.includes('satellite')) return 'NTN';
    
    return null;
  };

  const distributeAnalysisToLayers = (analysis: any) => {
    if (!analysis) return;

    // Distribute analysis results to appropriate layers
    Object.keys(analysis).forEach(layer => {
      setLayerData(prev => ({
        ...prev,
        [layer]: {
          ...prev[layer],
          analysis: analysis[layer],
          timestamp: Date.now()
        }
      }));
      
      notifyLayerSubscribers(layer, analysis[layer]);
    });
  };

  const notifyLayerSubscribers = (layer: string, data: any) => {
    const subscribers = layerSubscribers[layer];
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error notifying subscriber for layer ${layer}:`, error);
        }
      });
    }
  };

  const broadcastToSubscribers = (type: string, data: any) => {
    // Broadcast to all layer subscribers
    Object.keys(layerSubscribers).forEach(layer => {
      notifyLayerSubscribers(layer, { type, data, timestamp: Date.now() });
    });
  };

  const startTestCase = async (testCaseId: string) => {
    try {
      if (typeof window !== 'undefined' && (window as any).playbackService) {
        const playbackService = (window as any).playbackService;
        await playbackService.startPlayback({ testCaseId });
        console.log(`Started test case: ${testCaseId}`);
      } else {
        // Fallback: fetch test case data directly
        const response = await fetch(`/api/test-execution/comprehensive?testCaseId=${testCaseId}&includeTemplates=true`);
        const data = await response.json();
        setTestCaseData(data);
        console.log(`Loaded test case data: ${testCaseId}`);
      }
    } catch (error) {
      console.error('Error starting test case:', error);
    }
  };

  const stopTestCase = () => {
    try {
      if (typeof window !== 'undefined' && (window as any).playbackService) {
        const playbackService = (window as any).playbackService;
        playbackService.stopPlayback();
        console.log('Stopped test case playback');
      }
    } catch (error) {
      console.error('Error stopping test case:', error);
    }
  };

  const subscribeToLayer = (layer: string, callback: (data: any) => void) => {
    setLayerSubscribers(prev => ({
      ...prev,
      [layer]: new Set([...(prev[layer] || []), callback])
    }));

    // Return unsubscribe function
    return () => {
      setLayerSubscribers(prev => {
        const newSubscribers = { ...prev };
        if (newSubscribers[layer]) {
          newSubscribers[layer].delete(callback);
          if (newSubscribers[layer].size === 0) {
            delete newSubscribers[layer];
          }
        }
        return newSubscribers;
      });
    };
  };

  const contextValue: DataFlowContextType = {
    testCaseData,
    layerData,
    realTimeData,
    isConnected,
    startTestCase,
    stopTestCase,
    subscribeToLayer
  };

  return (
    <DataFlowContext.Provider value={contextValue}>
      {children}
    </DataFlowContext.Provider>
  );
};

export default DataFlowProvider;
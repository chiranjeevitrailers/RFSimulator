'use client';

import React, { useEffect, useState, createContext, useContext } from 'react';
import { DataFormatAdapter } from '@/utils/DataFormatAdapter';
import { useDataFormatAdapter } from '@/utils/DataFormatAdapterIntegration';

// Data Flow Context
interface DataFlowContextType {
  testCaseData: any;
  layerData: Record<string, any>;
  realTimeData: any;
  isConnected: boolean;
  dataFormatAdapter: any;
  adapterAvailable: boolean;
  startTestCase: (testCaseId: string) => Promise<void>;
  stopTestCase: () => void;
  subscribeToLayer: (layer: string, callback: (data: any) => void) => () => void;
  processData: (data: any, type?: 'log' | 'layer', layer?: string) => any;
  validateData: (data: any, type?: 'log' | 'layer', layer?: string) => boolean;
  getSupportedLayers: () => string[];
  getLayerStatistics: () => Record<string, any>;
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
  const [dataFormatAdapter, setDataFormatAdapter] = useState<any>(null);
  const [adapterAvailable, setAdapterAvailable] = useState(false);
  const [layerStatistics, setLayerStatistics] = useState<Record<string, any>>({});
  
  // Use DataFormatAdapter hook
  const { processLogs, processLayerData, validateData: validateDataHook, getSupportedLayers } = useDataFormatAdapter();

  useEffect(() => {
    const initializeDataFlow = async () => {
      try {
        // Initialize DataFormatAdapter first
        if (DataFormatAdapter) {
          setDataFormatAdapter(DataFormatAdapter);
          setAdapterAvailable(true);
          console.log('DataFormatAdapter initialized in DataFlowProvider');
        } else {
          console.warn('DataFormatAdapter not available, using fallback mode');
        }

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

        // Initialize Test Case Playback Service with DataFormatAdapter
        if (typeof window !== 'undefined' && window.TestCasePlaybackService) {
          const playbackService = new window.TestCasePlaybackService({
            databaseService: null, // Will be set when needed
            websocketBroadcast: (type: string, source: string, data: any) => {
              // Broadcast test case data to all subscribers
              broadcastToSubscribers(type, data);
            },
            fetchImpl: fetch,
            dataFormatAdapter: DataFormatAdapter // Pass the adapter
          });
          
          // Store reference for later use
          (window as any).playbackService = playbackService;
          console.log('TestCasePlaybackService initialized with DataFormatAdapter');
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
    const supportedLayers = getSupportedLayers();
    const logsByLayer: Record<string, any> = {};

    supportedLayers.forEach(layer => {
      const layerLogs = logs.filter(log => 
        log.layer === layer || 
        log.protocol === layer || 
        log.component === layer ||
        log.message?.includes(layer)
      );
      
      // Use DataFormatAdapter if available to format logs properly
      if (adapterAvailable && dataFormatAdapter) {
        try {
          logsByLayer[layer] = layerLogs.map(log => 
            dataFormatAdapter.adaptLogForViewer(log)
          ).filter(log => log !== null);
        } catch (error) {
          console.warn(`Error processing logs for layer ${layer}:`, error);
          logsByLayer[layer] = layerLogs;
        }
      } else {
        logsByLayer[layer] = layerLogs;
      }
    });

    // Update layer statistics
    updateLayerStatistics(logsByLayer);

    return logsByLayer;
  };

  const distributeDataToLayers = (data: any) => {
    if (!data) return;

    // Determine which layer this data belongs to
    const layer = determineLayer(data);
    if (layer) {
      // Use DataFormatAdapter if available for proper formatting
      let adaptedData = data;
      if (adapterAvailable && dataFormatAdapter) {
        try {
          adaptedData = dataFormatAdapter.adaptForLayerView(data, layer);
        } catch (error) {
          console.warn(`Error adapting data for layer ${layer}:`, error);
          adaptedData = data; // Fallback to original data
        }
      }
      
      setLayerData(prev => ({
        ...prev,
        [layer]: {
          ...prev[layer],
          ...adaptedData,
          timestamp: Date.now()
        }
      }));
      
      // Notify layer subscribers with adapted data
      notifyLayerSubscribers(layer, adaptedData);
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

  // Helper function to update layer statistics
  const updateLayerStatistics = (logsByLayer: Record<string, any>) => {
    const stats: Record<string, any> = {};
    
    Object.keys(logsByLayer).forEach(layer => {
      const logs = logsByLayer[layer];
      stats[layer] = {
        count: logs.length,
        lastUpdate: Date.now(),
        errorCount: logs.filter((log: any) => log.level === 'error' || log.level === 'critical').length,
        warningCount: logs.filter((log: any) => log.level === 'warning').length,
        infoCount: logs.filter((log: any) => log.level === 'info').length
      };
    });
    
    setLayerStatistics(stats);
  };

  // Enhanced data processing function
  const processData = (data: any, type: 'log' | 'layer' = 'log', layer?: string) => {
    if (!adapterAvailable || !dataFormatAdapter) {
      return data; // Fallback to original data
    }

    try {
      if (type === 'log') {
        return dataFormatAdapter.adaptLogForViewer(data);
      } else if (type === 'layer' && layer) {
        return dataFormatAdapter.adaptForLayerView(data, layer);
      }
      return data;
    } catch (error) {
      console.warn('Error processing data:', error);
      return data; // Fallback to original data
    }
  };

  // Enhanced data validation function
  const validateData = (data: any, type: 'log' | 'layer' = 'log', layer?: string) => {
    if (!adapterAvailable || !dataFormatAdapter) {
      return true; // Skip validation if adapter not available
    }

    try {
      if (type === 'log') {
        return dataFormatAdapter.validateLogEntry(data);
      } else if (type === 'layer' && layer) {
        return dataFormatAdapter.validateLayerData(data, layer);
      }
      return true;
    } catch (error) {
      console.warn('Error validating data:', error);
      return false;
    }
  };

  // Get layer statistics
  const getLayerStatistics = () => {
    return layerStatistics;
  };

  const contextValue: DataFlowContextType = {
    testCaseData,
    layerData,
    realTimeData,
    isConnected,
    dataFormatAdapter,
    adapterAvailable,
    startTestCase,
    stopTestCase,
    subscribeToLayer,
    processData,
    validateData,
    getSupportedLayers,
    getLayerStatistics
  };

  return (
    <DataFlowContext.Provider value={contextValue}>
      {children}
    </DataFlowContext.Provider>
  );
};

export default DataFlowProvider;
'use client';

import React, { useEffect, useState } from 'react';

// Service Integration Component
// This component initializes and wires all the backend services to the frontend
const ServiceIntegration: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [servicesInitialized, setServicesInitialized] = useState(false);
  const [serviceStatus, setServiceStatus] = useState<Record<string, string>>({});

  useEffect(() => {
    const initializeServices = async () => {
      try {
        // Initialize WebSocket Service
        if (typeof window !== 'undefined' && window.WebSocketService) {
          const wsService = new window.WebSocketService();
          wsService.connect('ws://localhost:8081');
          setServiceStatus(prev => ({ ...prev, websocket: 'Connected' }));
        }

        // Initialize Test Case Playback Service
        if (typeof window !== 'undefined' && window.TestCasePlaybackService) {
          const playbackService = new window.TestCasePlaybackService({
            databaseService: window.DatabaseService,
            websocketBroadcast: (type: string, source: string, data: any) => {
              console.log('Broadcasting:', type, source, data);
            },
            fetchImpl: fetch
          });
          setServiceStatus(prev => ({ ...prev, playback: 'Initialized' }));
        }

        // Initialize Real Time Data Bridge
        if (typeof window !== 'undefined' && window.RealTimeDataBridge) {
          const bridge = window.RealTimeDataBridge;
          bridge.initialize();
          setServiceStatus(prev => ({ ...prev, dataBridge: 'Active' }));
        }

        // Initialize Stream Processor
        if (typeof window !== 'undefined' && window.StreamProcessor) {
          const processor = window.StreamProcessor;
          processor.startProcessing();
          setServiceStatus(prev => ({ ...prev, streamProcessor: 'Processing' }));
        }

        // Initialize Layer Stats Service
        if (typeof window !== 'undefined' && window.LayerStatsService) {
          const layerStats = window.LayerStatsService;
          layerStats.init();
          setServiceStatus(prev => ({ ...prev, layerStats: 'Ready' }));
        }

        // Initialize Log Processor
        if (typeof window !== 'undefined' && window.LogProcessor) {
          const logProcessor = new window.LogProcessor();
          setServiceStatus(prev => ({ ...prev, logProcessor: 'Active' }));
        }

        // Initialize Message Analyzer
        if (typeof window !== 'undefined' && window.MessageAnalyzer) {
          const messageAnalyzer = new window.MessageAnalyzer();
          setServiceStatus(prev => ({ ...prev, messageAnalyzer: 'Ready' }));
        }

        // Initialize CLI Bridge
        if (typeof window !== 'undefined' && window.CLIBridge) {
          const cliBridge = new window.CLIBridge();
          setServiceStatus(prev => ({ ...prev, cliBridge: 'Connected' }));
        }

        // Initialize CLI Manager
        if (typeof window !== 'undefined' && window.CLIManager) {
          const cliManager = new window.CLIManager();
          setServiceStatus(prev => ({ ...prev, cliManager: 'Active' }));
        }

        // Initialize CLI Health Check
        if (typeof window !== 'undefined' && window.CLIHealthCheck) {
          const healthCheck = new window.CLIHealthCheck();
          setServiceStatus(prev => ({ ...prev, healthCheck: 'Monitoring' }));
        }

        // Initialize Data Adapter
        if (typeof window !== 'undefined' && window.DataAdapter) {
          const dataAdapter = new window.DataAdapter();
          setServiceStatus(prev => ({ ...prev, dataAdapter: 'Ready' }));
        }

        // Initialize Process Monitor
        if (typeof window !== 'undefined' && window.ProcessMonitor) {
          const processMonitor = new window.ProcessMonitor();
          setServiceStatus(prev => ({ ...prev, processMonitor: 'Monitoring' }));
        }

        // Initialize Layer-specific Processors
        if (typeof window !== 'undefined' && window.PhyMetricsProcessor) {
          const phyProcessor = new window.PhyMetricsProcessor();
          setServiceStatus(prev => ({ ...prev, phyProcessor: 'Active' }));
        }

        if (typeof window !== 'undefined' && window.NBIoTLogProcessor) {
          const nbiotProcessor = new window.NBIoTLogProcessor();
          setServiceStatus(prev => ({ ...prev, nbiotProcessor: 'Active' }));
        }

        if (typeof window !== 'undefined' && window.V2xLogProcessor) {
          const v2xProcessor = new window.V2xLogProcessor();
          setServiceStatus(prev => ({ ...prev, v2xProcessor: 'Active' }));
        }

        if (typeof window !== 'undefined' && window.NtnLogProcessor) {
          const ntnProcessor = new window.NtnLogProcessor();
          setServiceStatus(prev => ({ ...prev, ntnProcessor: 'Active' }));
        }

        // Initialize Analyzers
        if (typeof window !== 'undefined' && window.ThreeGPPMessageAnalyzer) {
          const analyzer = new window.ThreeGPPMessageAnalyzer();
          setServiceStatus(prev => ({ ...prev, threegppAnalyzer: 'Ready' }));
        }

        if (typeof window !== 'undefined' && window.OranMessageCorrelator) {
          const correlator = new window.OranMessageCorrelator();
          setServiceStatus(prev => ({ ...prev, oranCorrelator: 'Active' }));
        }

        // Initialize O-RAN Services
        if (typeof window !== 'undefined' && window.OranService) {
          const oranService = new window.OranService();
          setServiceStatus(prev => ({ ...prev, oranService: 'Active' }));
        }

        if (typeof window !== 'undefined' && window.OranCliIntegration) {
          const oranCli = new window.OranCliIntegration();
          setServiceStatus(prev => ({ ...prev, oranCli: 'Connected' }));
        }

        // Initialize KPI Calculator
        if (typeof window !== 'undefined' && window.KpiCalculator) {
          const kpiCalculator = new window.KpiCalculator();
          setServiceStatus(prev => ({ ...prev, kpiCalculator: 'Ready' }));
        }

        // Initialize Message Correlator
        if (typeof window !== 'undefined' && window.MessageCorrelator) {
          const messageCorrelator = new window.MessageCorrelator();
          setServiceStatus(prev => ({ ...prev, messageCorrelator: 'Active' }));
        }

        // Initialize State Service
        if (typeof window !== 'undefined' && window.StateService) {
          const stateService = new window.StateService();
          setServiceStatus(prev => ({ ...prev, stateService: 'Active' }));
        }

        // Initialize Real Time Processor
        if (typeof window !== 'undefined' && window.RealTimeProcessor) {
          const realTimeProcessor = new window.RealTimeProcessor();
          setServiceStatus(prev => ({ ...prev, realTimeProcessor: 'Processing' }));
        }

        // Initialize Enhanced Parser
        if (typeof window !== 'undefined' && window.EnhancedParser) {
          const enhancedParser = new window.EnhancedParser();
          setServiceStatus(prev => ({ ...prev, enhancedParser: 'Ready' }));
        }

        // Initialize Log Collector
        if (typeof window !== 'undefined' && window.LogCollector) {
          const logCollector = new window.LogCollector();
          setServiceStatus(prev => ({ ...prev, logCollector: 'Collecting' }));
        }

        // Initialize SRSRAN Parsers
        if (typeof window !== 'undefined' && window.SrsranLogParser) {
          const srsranParser = new window.SrsranLogParser();
          setServiceStatus(prev => ({ ...prev, srsranParser: 'Ready' }));
        }

        if (typeof window !== 'undefined' && window.SrsranMessageDecoder) {
          const srsranDecoder = new window.SrsranMessageDecoder();
          setServiceStatus(prev => ({ ...prev, srsranDecoder: 'Ready' }));
        }

        if (typeof window !== 'undefined' && window.SrsranParser) {
          const srsranMainParser = new window.SrsranParser();
          setServiceStatus(prev => ({ ...prev, srsranMainParser: 'Active' }));
        }

        setServicesInitialized(true);
        console.log('All services initialized successfully');

      } catch (error) {
        console.error('Service initialization error:', error);
        setServiceStatus(prev => ({ ...prev, error: 'Initialization failed' }));
      }
    };

    initializeServices();
  }, []);

  // Service Status Display
  const ServiceStatusDisplay = () => (
    <div className="fixed bottom-4 right-4 bg-white border rounded-lg shadow-lg p-4 max-w-sm">
      <h3 className="text-sm font-semibold mb-2">Service Status</h3>
      <div className="space-y-1 text-xs">
        {Object.entries(serviceStatus).map(([service, status]) => (
          <div key={service} className="flex justify-between">
            <span className="text-gray-600">{service}:</span>
            <span className={`font-medium ${
              status === 'Connected' || status === 'Active' || status === 'Ready' || status === 'Processing' || status === 'Monitoring' || status === 'Collecting'
                ? 'text-green-600' 
                : status === 'Initialization failed' 
                ? 'text-red-600' 
                : 'text-yellow-600'
            }`}>
              {status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {children}
      {servicesInitialized && <ServiceStatusDisplay />}
    </>
  );
};

export default ServiceIntegration;
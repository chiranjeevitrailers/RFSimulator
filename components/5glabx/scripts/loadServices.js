// Load all services and components into window object
// This script ensures all JavaScript services are available for React components

// Load core services
import('/services/WebSocketService.js').then(module => {
  window.WebSocketService = module.default || module.WebSocketService;
});

import('/services/TestCasePlaybackService.js').then(module => {
  window.TestCasePlaybackService = module.default || module.TestCasePlaybackService;
});

import('/services/RealTimeDataBridge.js').then(module => {
  window.RealTimeDataBridge = module.default || module.RealTimeDataBridge;
});

import('/services/StreamProcessor.js').then(module => {
  window.StreamProcessor = module.default || module.StreamProcessor;
});

import('/services/LayerStatsService.js').then(module => {
  window.LayerStatsService = module.default || module.LayerStatsService;
});

import('/services/LogProcessor.js').then(module => {
  window.LogProcessor = module.default || module.LogProcessor;
});

import('/services/MessageAnalyzer.js').then(module => {
  window.MessageAnalyzer = module.default || module.MessageAnalyzer;
});

import('/services/MessageCorrelator.js').then(module => {
  window.MessageCorrelator = module.default || module.MessageCorrelator;
});

import('/services/StateService.js').then(module => {
  window.StateService = module.default || module.StateService;
});

import('/services/RealTimeProcessor.js').then(module => {
  window.RealTimeProcessor = module.default || module.RealTimeProcessor;
});

import('/services/EnhancedParser.js').then(module => {
  window.EnhancedParser = module.default || module.EnhancedParser;
});

import('/services/LogCollector.js').then(module => {
  window.LogCollector = module.default || module.LogCollector;
});

import('/services/KpiCalculator.js').then(module => {
  window.KpiCalculator = module.default || module.KpiCalculator;
});

// Load CLI services
import('/services/backend/CLIBridge.js').then(module => {
  window.CLIBridge = module.default || module.CLIBridge;
});

import('/services/backend/CLIHealthCheck.js').then(module => {
  window.CLIHealthCheck = module.default || module.CLIHealthCheck;
});

import('/services/backend/CLIManager.js').then(module => {
  window.CLIManager = module.default || module.CLIManager;
});

import('/services/backend/DataAdapter.js').then(module => {
  window.DataAdapter = module.default || module.DataAdapter;
});

import('/services/backend/ProcessMonitor.js').then(module => {
  window.ProcessMonitor = module.default || module.ProcessMonitor;
});

// Load layer-specific processors
import('/services/PhyMetricsProcessor.js').then(module => {
  window.PhyMetricsProcessor = module.default || module.PhyMetricsProcessor;
});

import('/services/NBIoTLogProcessor.js').then(module => {
  window.NBIoTLogProcessor = module.default || module.NBIoTLogProcessor;
});

import('/services/V2xLogProcessor.js').then(module => {
  window.V2xLogProcessor = module.default || module.V2xLogProcessor;
});

import('/services/NtnLogProcessor.js').then(module => {
  window.NtnLogProcessor = module.default || module.NtnLogProcessor;
});

// Load analyzers
import('/services/analyzers/ThreeGPPMessageAnalyzer.js').then(module => {
  window.ThreeGPPMessageAnalyzer = module.default || module.ThreeGPPMessageAnalyzer;
});

import('/services/OranMessageCorrelator.js').then(module => {
  window.OranMessageCorrelator = module.default || module.OranMessageCorrelator;
});

// Load O-RAN services
import('/services/OranService.js').then(module => {
  window.OranService = module.default || module.OranService;
});

import('/services/OranCliIntegration.js').then(module => {
  window.OranCliIntegration = module.default || module.OranCliIntegration;
});

// Load SRSRAN parsers
import('/services/SrsranLogParser.js').then(module => {
  window.SrsranLogParser = module.default || module.SrsranLogParser;
});

import('/services/SrsranMessageDecoder.js').then(module => {
  window.SrsranMessageDecoder = module.default || module.SrsranMessageDecoder;
});

import('/services/SrsranParser.js').then(module => {
  window.SrsranParser = module.default || module.SrsranParser;
});

// Load all view components
const viewComponents = [
  'AmfAnalyzerView', 'AnalyticsView', 'AusfAnalyzerView', 'CallFlowView', 'CLIMonitorView',
  'ConfigManagerView', 'DashboardView', 'EnhancedLogsView', 'ExportManagerView',
  'HelpSupportView', 'ImsLayerView', 'LayerTraceView', 'LogsView', 'MacLayerView',
  'MmeAnalyzerView', 'NasLayerView', 'NBIoTAnalyticsView', 'NBIoTCallFlowView',
  'NBIoTMacLayerView', 'NBIoTOverviewView', 'NBIoTPhyLayerView', 'NBIoTRrcLayerView',
  'NBIoTTestingView', 'NtnAnalyticsView', 'NtnDopplerView', 'NtnOverviewView',
  'NtnSatellitesView', 'NtnScenariosView', 'NtnSib19View', 'NtnTimingView',
  'OranCuAnalysisView', 'OranDuAnalysisView', 'OranE1InterfaceView', 'OranF1InterfaceView',
  'OranInterfacesView', 'OranOverviewView', 'OranPerformanceView', 'OranSmoView',
  'OranXappsView', 'PdcpLayerView', 'PgwAnalyzerView', 'PhyLayerView',
  'ReportGeneratorView', 'RlcLayerView', 'RrcLayerView', 'SgwAnalyzerView',
  'SmfAnalyzerView', 'UpfAnalyzerView', 'UdmAnalyzerView', 'UserDashboardView',
  'V2xAnalyticsView', 'V2xMacLayerView', 'V2xOverviewView', 'V2xPhyLayerView',
  'V2xScenariosView', 'V2xSidelinkView', 'V2xTestingView', 'EnhancedOranOverviewView'
];

// Load view components dynamically
viewComponents.forEach(componentName => {
  const componentPath = `/components/views/${componentName}.js`;
  import(componentPath).then(module => {
    window[componentName] = module.default || module[componentName];
  }).catch(error => {
    console.warn(`Failed to load ${componentName}:`, error);
  });
});

// Load enhanced views
import('/components/views/enhanced/EnhancedOranOverviewView.js').then(module => {
  window.EnhancedOranOverviewView = module.default || module.EnhancedOranOverviewView;
}).catch(error => {
  console.warn('Failed to load EnhancedOranOverviewView:', error);
});

console.log('All services and components loaded into window object');
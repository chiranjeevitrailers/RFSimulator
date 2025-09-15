'use client';

import React from 'react';

// Generic placeholder view for fallback
const GenericView: React.FC<{ title: string; description: string; badge?: string }> = ({ title, description, badge }) => (
  <div className="p-6 space-y-6">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      {badge && (
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">{badge}</span>
        </div>
      )}
    </div>
    <div className="bg-white p-6 rounded-lg border">
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

// Generic wrapper function for JavaScript components
const createViewWrapper = (componentName: string, title: string, description: string, badge?: string) => {
  return React.forwardRef<HTMLDivElement, { appState?: any; onStateChange?: (state: any) => void }>((props, ref) => {
    if (typeof window !== 'undefined' && (window as any)[componentName]) {
      return React.createElement((window as any)[componentName], { ...props, ref });
    }
    return <GenericView title={title} description={description} badge={badge} />;
  });
};

// O-RAN Views
export const OranOverviewView = createViewWrapper('OranOverviewView', 'O-RAN Overview', 'O-RAN architecture overview and analysis.');
export const OranInterfacesView = createViewWrapper('OranInterfacesView', 'O-RAN Interfaces', 'O-RAN interface analysis and monitoring.');
export const OranCuAnalysisView = createViewWrapper('OranCuAnalysisView', 'O-RAN CU Analysis', 'Central Unit analysis and monitoring.');
export const OranDuAnalysisView = createViewWrapper('OranDuAnalysisView', 'O-RAN DU Analysis', 'Distributed Unit analysis and monitoring.');
export const OranE1InterfaceView = createViewWrapper('OranE1InterfaceView', 'O-RAN E1 Interface', 'E1 interface analysis and monitoring.');
export const OranF1InterfaceView = createViewWrapper('OranF1InterfaceView', 'O-RAN F1 Interface', 'F1 interface analysis and monitoring.');
export const OranPerformanceView = createViewWrapper('OranPerformanceView', 'O-RAN Performance', 'O-RAN performance analysis and monitoring.');
export const OranXappsView = createViewWrapper('OranXappsView', 'O-RAN xApps', 'xApps analysis and management.');
export const OranSmoView = createViewWrapper('OranSmoView', 'O-RAN SMO', 'Service Management and Orchestration analysis.');

// NB-IoT Views
export const NBIoTOverviewView = createViewWrapper('NBIoTOverviewView', 'NB-IoT Overview', 'NB-IoT network overview and analysis.');
export const NBIoTCallFlowView = createViewWrapper('NBIoTCallFlowView', 'NB-IoT Call Flow', 'NB-IoT call flow analysis and monitoring.');
export const NBIoTAnalyticsView = createViewWrapper('NBIoTAnalyticsView', 'NB-IoT Analytics', 'NB-IoT analytics and performance monitoring.');
export const NBIoTPhyLayerView = createViewWrapper('NBIoTPhyLayerView', 'NB-IoT PHY Layer', 'NB-IoT physical layer analysis.');
export const NBIoTMacLayerView = createViewWrapper('NBIoTMacLayerView', 'NB-IoT MAC Layer', 'NB-IoT MAC layer analysis.');
export const NBIoTRrcLayerView = createViewWrapper('NBIoTRrcLayerView', 'NB-IoT RRC Layer', 'NB-IoT RRC layer analysis.');
export const NBIoTTestingView = createViewWrapper('NBIoTTestingView', 'NB-IoT Testing', 'NB-IoT test management and execution.');

// V2X Views
export const V2xOverviewView = createViewWrapper('V2xOverviewView', 'V2X Overview', 'Vehicle-to-everything communication overview.');
export const V2xSidelinkView = createViewWrapper('V2xSidelinkView', 'V2X Sidelink', 'V2X sidelink communication analysis.');
export const V2xAnalyticsView = createViewWrapper('V2xAnalyticsView', 'V2X Analytics', 'V2X analytics and performance monitoring.');
export const V2xPhyLayerView = createViewWrapper('V2xPhyLayerView', 'V2X PHY Layer', 'V2X physical layer analysis.');
export const V2xMacLayerView = createViewWrapper('V2xMacLayerView', 'V2X MAC Layer', 'V2X MAC layer analysis.');
export const V2xTestingView = createViewWrapper('V2xTestingView', 'V2X Testing', 'V2X test management and execution.');
export const V2xScenariosView = createViewWrapper('V2xScenariosView', 'V2X Scenarios', 'V2X scenario analysis and testing.');

// NTN Views
export const NtnOverviewView = createViewWrapper('NtnOverviewView', 'NTN Overview', 'Non-Terrestrial Network overview and analysis.');
export const NtnSatellitesView = createViewWrapper('NtnSatellitesView', 'Satellite Links', 'Satellite link analysis and monitoring.');
export const NtnAnalyticsView = createViewWrapper('NtnAnalyticsView', 'NTN Analytics', 'NTN analytics and performance monitoring.', 'LIVE');
export const NtnSib19View = createViewWrapper('NtnSib19View', 'SIB19 Analysis', 'System Information Block 19 analysis.');
export const NtnTimingView = createViewWrapper('NtnTimingView', 'Timing & Delay', 'NTN timing and delay analysis.');
export const NtnDopplerView = createViewWrapper('NtnDopplerView', 'Doppler Analysis', 'Doppler effect analysis for NTN.');
export const NtnScenariosView = createViewWrapper('NtnScenariosView', 'NTN Scenarios', 'NTN scenario analysis and testing.');

// Protocol Layer Views
export const PhyLayerView = createViewWrapper('PhyLayerView', 'PHY Layer', 'Physical layer analysis and monitoring.');
export const MacLayerView = createViewWrapper('MacLayerView', 'MAC Layer', 'MAC layer analysis and monitoring.');
export const RlcLayerView = createViewWrapper('RlcLayerView', 'RLC Layer', 'RLC layer analysis and monitoring.');
export const PdcpLayerView = createViewWrapper('PdcpLayerView', 'PDCP Layer', 'PDCP layer analysis and monitoring.');
export const RrcLayerView = createViewWrapper('RrcLayerView', 'RRC Layer', 'RRC layer analysis and monitoring.');
export const NasLayerView = createViewWrapper('NasLayerView', 'NAS Layer', 'NAS layer analysis and monitoring.');
export const ImsLayerView = createViewWrapper('ImsLayerView', 'IMS Analysis', 'IMS protocol analysis and monitoring.');

// Core Network Views
export const AmfAnalyzerView = createViewWrapper('AmfAnalyzerView', 'AMF Analyzer', 'Access and Mobility Management Function analyzer.');
export const SmfAnalyzerView = createViewWrapper('SmfAnalyzerView', 'SMF Analyzer', 'Session Management Function analyzer.');
export const UpfAnalyzerView = createViewWrapper('UpfAnalyzerView', 'UPF Analyzer', 'User Plane Function analyzer.');
export const AusfAnalyzerView = createViewWrapper('AusfAnalyzerView', 'AUSF Analyzer', 'Authentication Server Function analyzer.');
export const UdmAnalyzerView = createViewWrapper('UdmAnalyzerView', 'UDM Analyzer', 'Unified Data Management analyzer.');
export const ConfigManagerView = createViewWrapper('ConfigManagerView', 'Config Manager', 'Configuration management and monitoring.');

// 4G Legacy Views
export const MmeAnalyzerView = createViewWrapper('MmeAnalyzerView', 'MME Analyzer', 'Mobility Management Entity analyzer.');
export const SgwAnalyzerView = createViewWrapper('SgwAnalyzerView', 'SGW Analyzer', 'Serving Gateway analyzer.');
export const PgwAnalyzerView = createViewWrapper('PgwAnalyzerView', 'PGW Analyzer', 'Packet Data Network Gateway analyzer.');

// Utility Views
export const ReportGeneratorView = createViewWrapper('ReportGeneratorView', 'Report Generator', 'Generate comprehensive analysis reports.');
export const ExportManagerView = createViewWrapper('ExportManagerView', 'Export Manager', 'Export data and analysis results.');
export const HelpSupportView = createViewWrapper('HelpSupportView', 'Help & Support', 'User support and documentation.');

// CLI Monitor View
export const CLIMonitorView = createViewWrapper('CLIMonitorView', 'CLI Monitor', 'CLI backend monitoring and management.');

// Enhanced Views
export const EnhancedOranOverviewView = createViewWrapper('EnhancedOranOverviewView', 'Enhanced O-RAN Overview', 'Enhanced O-RAN analysis with advanced features.');

// User Dashboard View
export const UserDashboardView = createViewWrapper('UserDashboardView', 'User Dashboard', 'User-specific dashboard and analytics.');
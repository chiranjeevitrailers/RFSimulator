'use client';

import React, { useState } from 'react';
import { 
  Activity, BarChart3, Settings, Shield, Database, Monitor, MessageSquare,
  Layers, Wifi, Cloud, Play, Pause, Square, Eye, Download, Upload,
  RefreshCw, Plus, Search, Filter, Calendar, Clock, TrendingUp,
  AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronRight,
  Satellite, Network, Server, Phone, MapPin, FileText, HelpCircle
} from 'lucide-react';

// Import existing components from codebase
import LogsView from './views/LogsView';
import TestSuitesView from './views/TestSuitesView';
import AnalyticsView from './views/AnalyticsView';
import CallFlowView from './views/CallFlowView';
import LayerTraceView from './views/LayerTraceView';

// Enhanced Dashboard View
const DashboardView: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">5GLabX Protocol Analyzer Dashboard</h1>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">System Online</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Total Messages</h3>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-blue-600">1,247</p>
          <p className="text-xs text-gray-500 mt-1">+12% from last hour</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Avg Throughput</h3>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-green-600">156.7 Mbps</p>
          <p className="text-xs text-gray-500 mt-1">Peak: 234.2 Mbps</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Error Rate</h3>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-red-600">0.02%</p>
          <p className="text-xs text-gray-500 mt-1">-0.01% from last hour</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Success Rate</h3>
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-purple-600">99.98%</p>
          <p className="text-xs text-gray-500 mt-1">+0.01% from last hour</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Message Distribution by Component</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">PHY Layer</span>
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">456</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">MAC Layer</span>
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">234</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">RLC Layer</span>
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">189</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">RRC Layer</span>
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">156</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">NAS Layer</span>
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">98</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">IMS Layer</span>
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">114</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Protocol Message Types</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm font-medium">PDSCH</span>
              </div>
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">234</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium">DL PDU</span>
              </div>
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">189</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm font-medium">RRC Setup</span>
              </div>
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">156</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-sm font-medium">NAS Attach</span>
              </div>
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">98</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm font-medium">SIP INVITE</span>
              </div>
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">114</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">New UE attached - IMSI: 310150123456789</span>
            <span className="text-xs text-gray-400 ml-auto">2 minutes ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">RRC Connection established - Cell ID: 12345</span>
            <span className="text-xs text-gray-400 ml-auto">5 minutes ago</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Handover completed - Target Cell: 12346</span>
            <span className="text-xs text-gray-400 ml-auto">8 minutes ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Logs Component - using existing implementation
const EnhancedLogsView: React.FC = () => {
  // Use the existing EnhancedLogsView from the codebase
  if (typeof window !== 'undefined' && window.EnhancedLogsView) {
    return React.createElement(window.EnhancedLogsView);
  }
  
  // Fallback if not available
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Enhanced Logs</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Enhanced Analysis</span>
          </div>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg border">
        <p className="text-gray-600">Enhanced logs view with comprehensive filtering and message decoding capabilities.</p>
      </div>
    </div>
  );
};

// Wrapper components for JavaScript views
const OranOverviewView: React.FC = () => {
  if (typeof window !== 'undefined' && window.OranOverviewView) {
    return React.createElement(window.OranOverviewView);
  }
  return <GenericView title="O-RAN Overview" description="O-RAN architecture overview and analysis." />;
};

const OranInterfacesView: React.FC = () => {
  if (typeof window !== 'undefined' && window.OranInterfacesView) {
    return React.createElement(window.OranInterfacesView);
  }
  return <GenericView title="O-RAN Interfaces" description="O-RAN interface analysis and monitoring." />;
};

const OranCuAnalysisView: React.FC = () => {
  if (typeof window !== 'undefined' && window.OranCuAnalysisView) {
    return React.createElement(window.OranCuAnalysisView);
  }
  return <GenericView title="O-RAN CU Analysis" description="Central Unit analysis and monitoring." />;
};

const OranDuAnalysisView: React.FC = () => {
  if (typeof window !== 'undefined' && window.OranDuAnalysisView) {
    return React.createElement(window.OranDuAnalysisView);
  }
  return <GenericView title="O-RAN DU Analysis" description="Distributed Unit analysis and monitoring." />;
};

const OranE1InterfaceView: React.FC = () => {
  if (typeof window !== 'undefined' && window.OranE1InterfaceView) {
    return React.createElement(window.OranE1InterfaceView);
  }
  return <GenericView title="O-RAN E1 Interface" description="E1 interface analysis and monitoring." />;
};

const OranF1InterfaceView: React.FC = () => {
  if (typeof window !== 'undefined' && window.OranF1InterfaceView) {
    return React.createElement(window.OranF1InterfaceView);
  }
  return <GenericView title="O-RAN F1 Interface" description="F1 interface analysis and monitoring." />;
};

const OranPerformanceView: React.FC = () => {
  if (typeof window !== 'undefined' && window.OranPerformanceView) {
    return React.createElement(window.OranPerformanceView);
  }
  return <GenericView title="O-RAN Performance" description="O-RAN performance analysis and monitoring." />;
};

const OranXappsView: React.FC = () => {
  if (typeof window !== 'undefined' && window.OranXappsView) {
    return React.createElement(window.OranXappsView);
  }
  return <GenericView title="O-RAN xApps" description="xApps analysis and management." />;
};

const OranSmoView: React.FC = () => {
  if (typeof window !== 'undefined' && window.OranSmoView) {
    return React.createElement(window.OranSmoView);
  }
  return <GenericView title="O-RAN SMO" description="Service Management and Orchestration analysis." />;
};

const NBIoTOverviewView: React.FC = () => {
  if (typeof window !== 'undefined' && window.NBIoTOverviewView) {
    return React.createElement(window.NBIoTOverviewView);
  }
  return <GenericView title="NB-IoT Overview" description="NB-IoT network overview and analysis." />;
};

const NBIoTCallFlowView: React.FC = () => {
  if (typeof window !== 'undefined' && window.NBIoTCallFlowView) {
    return React.createElement(window.NBIoTCallFlowView);
  }
  return <GenericView title="NB-IoT Call Flow" description="NB-IoT call flow analysis and monitoring." />;
};

const NBIoTAnalyticsView: React.FC = () => {
  if (typeof window !== 'undefined' && window.NBIoTAnalyticsView) {
    return React.createElement(window.NBIoTAnalyticsView);
  }
  return <GenericView title="NB-IoT Analytics" description="NB-IoT analytics and performance monitoring." />;
};

const NBIoTPhyLayerView: React.FC = () => {
  if (typeof window !== 'undefined' && window.NBIoTPhyLayerView) {
    return React.createElement(window.NBIoTPhyLayerView);
  }
  return <GenericView title="NB-IoT PHY Layer" description="NB-IoT physical layer analysis." />;
};

const NBIoTMacLayerView: React.FC = () => {
  if (typeof window !== 'undefined' && window.NBIoTMacLayerView) {
    return React.createElement(window.NBIoTMacLayerView);
  }
  return <GenericView title="NB-IoT MAC Layer" description="NB-IoT MAC layer analysis." />;
};

const NBIoTRrcLayerView: React.FC = () => {
  if (typeof window !== 'undefined' && window.NBIoTRrcLayerView) {
    return React.createElement(window.NBIoTRrcLayerView);
  }
  return <GenericView title="NB-IoT RRC Layer" description="NB-IoT RRC layer analysis." />;
};

const NBIoTTestingView: React.FC = () => {
  if (typeof window !== 'undefined' && window.NBIoTTestingView) {
    return React.createElement(window.NBIoTTestingView);
  }
  return <GenericView title="NB-IoT Testing" description="NB-IoT test management and execution." />;
};

const V2xOverviewView: React.FC = () => {
  if (typeof window !== 'undefined' && window.V2xOverviewView) {
    return React.createElement(window.V2xOverviewView);
  }
  return <GenericView title="V2X Overview" description="Vehicle-to-everything communication overview." />;
};

const V2xSidelinkView: React.FC = () => {
  if (typeof window !== 'undefined' && window.V2xSidelinkView) {
    return React.createElement(window.V2xSidelinkView);
  }
  return <GenericView title="V2X Sidelink" description="V2X sidelink communication analysis." />;
};

const V2xAnalyticsView: React.FC = () => {
  if (typeof window !== 'undefined' && window.V2xAnalyticsView) {
    return React.createElement(window.V2xAnalyticsView);
  }
  return <GenericView title="V2X Analytics" description="V2X analytics and performance monitoring." />;
};

const V2xPhyLayerView: React.FC = () => {
  if (typeof window !== 'undefined' && window.V2xPhyLayerView) {
    return React.createElement(window.V2xPhyLayerView);
  }
  return <GenericView title="V2X PHY Layer" description="V2X physical layer analysis." />;
};

const V2xMacLayerView: React.FC = () => {
  if (typeof window !== 'undefined' && window.V2xMacLayerView) {
    return React.createElement(window.V2xMacLayerView);
  }
  return <GenericView title="V2X MAC Layer" description="V2X MAC layer analysis." />;
};

const V2xTestingView: React.FC = () => {
  if (typeof window !== 'undefined' && window.V2xTestingView) {
    return React.createElement(window.V2xTestingView);
  }
  return <GenericView title="V2X Testing" description="V2X test management and execution." />;
};

const V2xScenariosView: React.FC = () => {
  if (typeof window !== 'undefined' && window.V2xScenariosView) {
    return React.createElement(window.V2xScenariosView);
  }
  return <GenericView title="V2X Scenarios" description="V2X scenario analysis and testing." />;
};

const NtnOverviewView: React.FC = () => {
  if (typeof window !== 'undefined' && window.NtnOverviewView) {
    return React.createElement(window.NtnOverviewView);
  }
  return <GenericView title="NTN Overview" description="Non-Terrestrial Network overview and analysis." />;
};

const NtnSatellitesView: React.FC = () => {
  if (typeof window !== 'undefined' && window.NtnSatellitesView) {
    return React.createElement(window.NtnSatellitesView);
  }
  return <GenericView title="Satellite Links" description="Satellite link analysis and monitoring." />;
};

const NtnAnalyticsView: React.FC = () => {
  if (typeof window !== 'undefined' && window.NtnAnalyticsView) {
    return React.createElement(window.NtnAnalyticsView);
  }
  return <GenericView title="NTN Analytics" description="NTN analytics and performance monitoring." badge="LIVE" />;
};

const NtnSib19View: React.FC = () => {
  if (typeof window !== 'undefined' && window.NtnSib19View) {
    return React.createElement(window.NtnSib19View);
  }
  return <GenericView title="SIB19 Analysis" description="System Information Block 19 analysis." />;
};

const NtnTimingView: React.FC = () => {
  if (typeof window !== 'undefined' && window.NtnTimingView) {
    return React.createElement(window.NtnTimingView);
  }
  return <GenericView title="Timing & Delay" description="NTN timing and delay analysis." />;
};

const NtnDopplerView: React.FC = () => {
  if (typeof window !== 'undefined' && window.NtnDopplerView) {
    return React.createElement(window.NtnDopplerView);
  }
  return <GenericView title="Doppler Analysis" description="Doppler effect analysis for NTN." />;
};

const NtnScenariosView: React.FC = () => {
  if (typeof window !== 'undefined' && window.NtnScenariosView) {
    return React.createElement(window.NtnScenariosView);
  }
  return <GenericView title="NTN Scenarios" description="NTN scenario analysis and testing." />;
};

const PhyLayerView: React.FC = () => {
  if (typeof window !== 'undefined' && window.PhyLayerView) {
    return React.createElement(window.PhyLayerView);
  }
  return <GenericView title="PHY Layer" description="Physical layer analysis and monitoring." />;
};

const MacLayerView: React.FC = () => {
  if (typeof window !== 'undefined' && window.MacLayerView) {
    return React.createElement(window.MacLayerView);
  }
  return <GenericView title="MAC Layer" description="MAC layer analysis and monitoring." />;
};

const RlcLayerView: React.FC = () => {
  if (typeof window !== 'undefined' && window.RlcLayerView) {
    return React.createElement(window.RlcLayerView);
  }
  return <GenericView title="RLC Layer" description="RLC layer analysis and monitoring." />;
};

const PdcpLayerView: React.FC = () => {
  if (typeof window !== 'undefined' && window.PdcpLayerView) {
    return React.createElement(window.PdcpLayerView);
  }
  return <GenericView title="PDCP Layer" description="PDCP layer analysis and monitoring." />;
};

const RrcLayerView: React.FC = () => {
  if (typeof window !== 'undefined' && window.RrcLayerView) {
    return React.createElement(window.RrcLayerView);
  }
  return <GenericView title="RRC Layer" description="RRC layer analysis and monitoring." />;
};

const NasLayerView: React.FC = () => {
  if (typeof window !== 'undefined' && window.NasLayerView) {
    return React.createElement(window.NasLayerView);
  }
  return <GenericView title="NAS Layer" description="NAS layer analysis and monitoring." />;
};

const ImsLayerView: React.FC = () => {
  if (typeof window !== 'undefined' && window.ImsLayerView) {
    return React.createElement(window.ImsLayerView);
  }
  return <GenericView title="IMS Analysis" description="IMS protocol analysis and monitoring." />;
};

const AmfAnalyzerView: React.FC = () => {
  if (typeof window !== 'undefined' && window.AmfAnalyzerView) {
    return React.createElement(window.AmfAnalyzerView);
  }
  return <GenericView title="AMF Analyzer" description="Access and Mobility Management Function analyzer." />;
};

const SmfAnalyzerView: React.FC = () => {
  if (typeof window !== 'undefined' && window.SmfAnalyzerView) {
    return React.createElement(window.SmfAnalyzerView);
  }
  return <GenericView title="SMF Analyzer" description="Session Management Function analyzer." />;
};

const UpfAnalyzerView: React.FC = () => {
  if (typeof window !== 'undefined' && window.UpfAnalyzerView) {
    return React.createElement(window.UpfAnalyzerView);
  }
  return <GenericView title="UPF Analyzer" description="User Plane Function analyzer." />;
};

const AusfAnalyzerView: React.FC = () => {
  if (typeof window !== 'undefined' && window.AusfAnalyzerView) {
    return React.createElement(window.AusfAnalyzerView);
  }
  return <GenericView title="AUSF Analyzer" description="Authentication Server Function analyzer." />;
};

const UdmAnalyzerView: React.FC = () => {
  if (typeof window !== 'undefined' && window.UdmAnalyzerView) {
    return React.createElement(window.UdmAnalyzerView);
  }
  return <GenericView title="UDM Analyzer" description="Unified Data Management analyzer." />;
};

const ConfigManagerView: React.FC = () => {
  if (typeof window !== 'undefined' && window.ConfigManagerView) {
    return React.createElement(window.ConfigManagerView);
  }
  return <GenericView title="Config Manager" description="Configuration management and monitoring." />;
};

const MmeAnalyzerView: React.FC = () => {
  if (typeof window !== 'undefined' && window.MmeAnalyzerView) {
    return React.createElement(window.MmeAnalyzerView);
  }
  return <GenericView title="MME Analyzer" description="Mobility Management Entity analyzer." />;
};

const SgwAnalyzerView: React.FC = () => {
  if (typeof window !== 'undefined' && window.SgwAnalyzerView) {
    return React.createElement(window.SgwAnalyzerView);
  }
  return <GenericView title="SGW Analyzer" description="Serving Gateway analyzer." />;
};

const PgwAnalyzerView: React.FC = () => {
  if (typeof window !== 'undefined' && window.PgwAnalyzerView) {
    return React.createElement(window.PgwAnalyzerView);
  }
  return <GenericView title="PGW Analyzer" description="Packet Data Network Gateway analyzer." />;
};

const ReportGeneratorView: React.FC = () => {
  if (typeof window !== 'undefined' && window.ReportGeneratorView) {
    return React.createElement(window.ReportGeneratorView);
  }
  return <GenericView title="Report Generator" description="Generate comprehensive analysis reports." />;
};

const ExportManagerView: React.FC = () => {
  if (typeof window !== 'undefined' && window.ExportManagerView) {
    return React.createElement(window.ExportManagerView);
  }
  return <GenericView title="Export Manager" description="Export data and analysis results." />;
};

const HelpSupportView: React.FC = () => {
  if (typeof window !== 'undefined' && window.HelpSupportView) {
    return React.createElement(window.HelpSupportView);
  }
  return <GenericView title="Help & Support" description="User support and documentation." />;
};

// Generic View Component
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

// Sidebar Component
const Sidebar: React.FC<{
  currentView: string;
  onNavigate: (viewId: string) => void;
}> = ({ currentView, onNavigate }) => {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    'oran-analysis': false,
    'nbiot-analysis': false,
    'v2x-analysis': false,
    'ntn-analysis': false
  });

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderMenuItem = (item: any) => {
    const Icon = item.icon;
    return (
      <button
        key={item.id}
        onClick={() => onNavigate(item.id)}
        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
          item.active
            ? 'bg-blue-100 text-blue-700 border-l-2 border-blue-500'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        <Icon className="w-4 h-4 mr-3" />
        <span className="flex-1 text-left">{item.label}</span>
        {item.badge && (
          <span className="ml-2 px-2 py-1 text-xs font-semibold bg-red-500 text-white rounded-full animate-pulse">
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  const renderSection = (section: any, items: any[], title: string) => {
    const isCollapsed = collapsedSections[section];
    return (
      <div className="mb-2">
        <button
          onClick={() => toggleSection(section)}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md"
        >
          <ChevronRight className={`w-4 h-4 mr-3 transition-transform ${isCollapsed ? 'rotate-0' : 'rotate-90'}`} />
          <span className="flex-1 text-left">{title}</span>
        </button>
        {!isCollapsed && (
          <div className="ml-4 mt-1 space-y-1">
            {items.map((item: any) => renderMenuItem(item))}
          </div>
        )}
      </div>
    );
  };

  // Menu items
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity, active: currentView === 'dashboard' },
    { id: 'logs', label: 'Logs Viewer', icon: FileText },
    { id: 'enhanced-logs', label: 'Enhanced Logs', icon: Search },
    { id: 'layer-trace', label: 'Layer Trace', icon: Network },
    { id: 'callflow', label: 'Call Flow', icon: Phone }
  ];

  const analyticsItems = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: 'LIVE' }
  ];

  const oranItems = [
    { id: 'oran-overview', label: 'O-RAN Overview', icon: Network },
    { id: 'oran-interfaces', label: 'O-RAN Interfaces', icon: Network },
    { id: 'oran-cu-analysis', label: 'O-RAN CU Analysis', icon: Server },
    { id: 'oran-du-analysis', label: 'O-RAN DU Analysis', icon: Server },
    { id: 'oran-e1-interface', label: 'O-RAN E1 Interface', icon: Network },
    { id: 'oran-f1-interface', label: 'O-RAN F1 Interface', icon: Network },
    { id: 'oran-performance', label: 'O-RAN Performance', icon: TrendingUp },
    { id: 'oran-xapps', label: 'O-RAN xApps', icon: Cloud },
    { id: 'oran-smo', label: 'O-RAN SMO', icon: Settings }
  ];

  const nbiotItems = [
    { id: 'nbiot-overview', label: 'NB-IoT Overview', icon: Network },
    { id: 'nbiot-callflow', label: 'NB-IoT Call Flow', icon: Phone },
    { id: 'nbiot-analytics', label: 'NB-IoT Analytics', icon: BarChart3 },
    { id: 'nbiot-phy-layer', label: 'NB-IoT PHY Layer', icon: Wifi },
    { id: 'nbiot-mac-layer', label: 'NB-IoT MAC Layer', icon: Network },
    { id: 'nbiot-rrc-layer', label: 'NB-IoT RRC Layer', icon: Network },
    { id: 'nbiot-testing', label: 'NB-IoT Testing', icon: Shield }
  ];

  const v2xItems = [
    { id: 'v2x-overview', label: 'V2X Overview', icon: Network },
    { id: 'v2x-sidelink', label: 'V2X Sidelink', icon: Network },
    { id: 'v2x-analytics', label: 'V2X Analytics', icon: BarChart3 },
    { id: 'v2x-phy-layer', label: 'V2X PHY Layer', icon: Wifi },
    { id: 'v2x-mac-layer', label: 'V2X MAC Layer', icon: Network },
    { id: 'v2x-testing', label: 'V2X Testing', icon: Shield },
    { id: 'v2x-scenarios', label: 'V2X Scenarios', icon: MapPin }
  ];

  const ntnItems = [
    { id: 'ntn-overview', label: 'NTN Overview', icon: Satellite },
    { id: 'ntn-satellites', label: 'Satellite Links', icon: Satellite },
    { id: 'ntn-analytics', label: 'NTN Analytics', icon: BarChart3, badge: 'LIVE' },
    { id: 'ntn-sib19', label: 'SIB19 Analysis', icon: FileText },
    { id: 'ntn-timing', label: 'Timing & Delay', icon: Clock },
    { id: 'ntn-doppler', label: 'Doppler Analysis', icon: Activity },
    { id: 'ntn-scenarios', label: 'NTN Scenarios', icon: MapPin }
  ];

  const protocolLayers = [
    { id: 'phy-layer', label: 'PHY Layer', icon: Wifi },
    { id: 'mac-layer', label: 'MAC Layer', icon: Network },
    { id: 'rlc-layer', label: 'RLC Layer', icon: Network },
    { id: 'pdcp-layer', label: 'PDCP Layer', icon: FileText },
    { id: 'rrc-layer', label: 'RRC Layer', icon: Network },
    { id: 'nas-layer', label: 'NAS Layer', icon: Server },
    { id: 'ims-layer', label: 'IMS Analysis', icon: Phone }
  ];

  const coreNetwork = [
    { id: 'amf-analyzer', label: 'AMF Analyzer', icon: Server },
    { id: 'smf-analyzer', label: 'SMF Analyzer', icon: Server },
    { id: 'upf-analyzer', label: 'UPF Analyzer', icon: Server },
    { id: 'ausf-analyzer', label: 'AUSF Analyzer', icon: Server },
    { id: 'udm-analyzer', label: 'UDM Analyzer', icon: Database },
    { id: 'config-manager', label: 'Config Manager', icon: Settings }
  ];

  const legacy4G = [
    { id: 'mme-analyzer', label: 'MME Analyzer', icon: Server },
    { id: 'sgw-analyzer', label: 'SGW Analyzer', icon: Server },
    { id: 'pgw-analyzer', label: 'PGW Analyzer', icon: Server }
  ];

  const utilities = [
    { id: 'report-generator', label: 'Report Generator', icon: FileText },
    { id: 'export-manager', label: 'Export Manager', icon: Download },
    { id: 'help-support', label: 'Help & Support', icon: HelpCircle }
  ];

  const testSuites = [
    { id: 'test-suites', label: 'Test Suites', icon: Shield }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4">
        <h1 className="text-xl font-bold text-gray-900">5GLabX</h1>
      </div>
      
      <nav className="px-4 space-y-2">
        {/* Main Views */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">MAIN VIEWS</h3>
          <div className="space-y-1">
            {menuItems.map(renderMenuItem)}
          </div>
        </div>

        {/* Analytics */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">ANALYTICS</h3>
          <div className="space-y-1">
            {analyticsItems.map(renderMenuItem)}
          </div>
        </div>

        {/* O-RAN Analysis */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">O-RAN ANALYSIS</h3>
          <div className="space-y-1">
            {renderSection('oran-analysis', oranItems, 'O-RAN ANALYSIS')}
          </div>
        </div>

        {/* NB-IoT Analysis */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">NB-IOT ANALYSIS</h3>
          <div className="space-y-1">
            {renderSection('nbiot-analysis', nbiotItems, 'NB-IOT ANALYSIS')}
          </div>
        </div>

        {/* C-V2X Analysis */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">C-V2X ANALYSIS</h3>
          <div className="space-y-1">
            {renderSection('v2x-analysis', v2xItems, 'C-V2X ANALYSIS')}
          </div>
        </div>

        {/* NTN Analysis */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">NTN ANALYSIS</h3>
          <div className="space-y-1">
            {renderSection('ntn-analysis', ntnItems, 'NTN ANALYSIS')}
          </div>
        </div>

        {/* Protocol Layers */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">PROTOCOL LAYERS</h3>
          <div className="space-y-1">
            {protocolLayers.map(renderMenuItem)}
          </div>
        </div>

        {/* Core Network */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">CORE NETWORK</h3>
          <div className="space-y-1">
            {coreNetwork.map(renderMenuItem)}
          </div>
        </div>

        {/* 4G Legacy */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">4G LEGACY</h3>
          <div className="space-y-1">
            {legacy4G.map(renderMenuItem)}
          </div>
        </div>

        {/* Utilities */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">UTILITIES</h3>
          <div className="space-y-1">
            {utilities.map(renderMenuItem)}
          </div>
        </div>

        {/* Test Suites */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">TEST SUITES</h3>
          <div className="space-y-1">
            {testSuites.map(renderMenuItem)}
          </div>
        </div>
      </nav>
    </div>
  );
};

// Main 5GLabX Platform Component
const FiveGLabXPlatformMinimal: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  const navigate = (viewId: string) => {
    setCurrentView(viewId);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'logs':
        return <LogsView appState={{}} onStateChange={() => {}} />;
      case 'enhanced-logs':
        return <EnhancedLogsView />;
      case 'test-suites':
        return <TestSuitesView appState={{}} onStateChange={() => {}} />;
      case 'layer-trace':
        return <LayerTraceView appState={{}} onStateChange={() => {}} />;
      case 'callflow':
        return <CallFlowView appState={{}} onStateChange={() => {}} />;
      case 'analytics':
        return <AnalyticsView appState={{}} onStateChange={() => {}} />;
      case 'oran-overview':
        return <OranOverviewView />;
      case 'oran-interfaces':
        return <OranInterfacesView />;
      case 'oran-cu-analysis':
        return <OranCuAnalysisView />;
      case 'oran-du-analysis':
        return <OranDuAnalysisView />;
      case 'oran-e1-interface':
        return <OranE1InterfaceView />;
      case 'oran-f1-interface':
        return <OranF1InterfaceView />;
      case 'oran-performance':
        return <OranPerformanceView />;
      case 'oran-xapps':
        return <OranXappsView />;
      case 'oran-smo':
        return <OranSmoView />;
      case 'nbiot-overview':
        return <NBIoTOverviewView />;
      case 'nbiot-callflow':
        return <NBIoTCallFlowView />;
      case 'nbiot-analytics':
        return <NBIoTAnalyticsView />;
      case 'nbiot-phy-layer':
        return <NBIoTPhyLayerView />;
      case 'nbiot-mac-layer':
        return <NBIoTMacLayerView />;
      case 'nbiot-rrc-layer':
        return <NBIoTRrcLayerView />;
      case 'nbiot-testing':
        return <NBIoTTestingView />;
      case 'v2x-overview':
        return <V2xOverviewView />;
      case 'v2x-sidelink':
        return <V2xSidelinkView />;
      case 'v2x-analytics':
        return <V2xAnalyticsView />;
      case 'v2x-phy-layer':
        return <V2xPhyLayerView />;
      case 'v2x-mac-layer':
        return <V2xMacLayerView />;
      case 'v2x-testing':
        return <V2xTestingView />;
      case 'v2x-scenarios':
        return <V2xScenariosView />;
      case 'ntn-overview':
        return <NtnOverviewView />;
      case 'ntn-satellites':
        return <NtnSatellitesView />;
      case 'ntn-analytics':
        return <NtnAnalyticsView />;
      case 'ntn-sib19':
        return <NtnSib19View />;
      case 'ntn-timing':
        return <NtnTimingView />;
      case 'ntn-doppler':
        return <NtnDopplerView />;
      case 'ntn-scenarios':
        return <NtnScenariosView />;
      case 'phy-layer':
        return <PhyLayerView />;
      case 'mac-layer':
        return <MacLayerView />;
      case 'rlc-layer':
        return <RlcLayerView />;
      case 'pdcp-layer':
        return <PdcpLayerView />;
      case 'rrc-layer':
        return <RrcLayerView />;
      case 'nas-layer':
        return <NasLayerView />;
      case 'ims-layer':
        return <ImsLayerView />;
      case 'amf-analyzer':
        return <AmfAnalyzerView />;
      case 'smf-analyzer':
        return <SmfAnalyzerView />;
      case 'upf-analyzer':
        return <UpfAnalyzerView />;
      case 'ausf-analyzer':
        return <AusfAnalyzerView />;
      case 'udm-analyzer':
        return <UdmAnalyzerView />;
      case 'config-manager':
        return <ConfigManagerView />;
      case 'mme-analyzer':
        return <MmeAnalyzerView />;
      case 'sgw-analyzer':
        return <SgwAnalyzerView />;
      case 'pgw-analyzer':
        return <PgwAnalyzerView />;
      case 'report-generator':
        return <ReportGeneratorView />;
      case 'export-manager':
        return <ExportManagerView />;
      case 'help-support':
        return <HelpSupportView />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">View Not Found</h2>
              <p className="text-gray-600">View "{currentView}" is not available</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen flex bg-gray-50">
      <Sidebar currentView={currentView} onNavigate={navigate} />
      <div className="flex-1 overflow-auto">
        {renderCurrentView()}
      </div>
    </div>
  );
};

export default FiveGLabXPlatformMinimal;
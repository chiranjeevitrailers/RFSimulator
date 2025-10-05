'use client';

import React, { useState, useEffect } from 'react';
import { 
  Play, Square, RotateCcw, Settings, Download, Upload, Save, 
  FileText, Folder, Search, Filter, CheckCircle, XCircle, 
  Clock, AlertTriangle, Activity, BarChart3, Database, Network,
  Phone, Wifi, Server, Shield, Layers, ChevronRight, ChevronDown,
  Eye, EyeOff, Maximize2, Minimize2, Grid, List, Calendar,
  User, Bell, HelpCircle, LogOut, Menu, X
} from 'lucide-react';

const TestManager_1_Layout: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState('enodeb');
  const [selectedTestSuite, setSelectedTestSuite] = useState('5g-nr');
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [executionResults, setExecutionResults] = useState<any[]>([]);

  // RAN Components
  const ranComponents = [
    { id: 'enodeb', name: 'eNodeB', status: 'active', color: 'green', tests: 1250 },
    { id: 'gnodeb', name: 'gNodeB', status: 'active', color: 'green', tests: 1800 },
    { id: 'core', name: 'Core Network', status: 'active', color: 'green', tests: 950 },
    { id: 'ims', name: 'IMS Core', status: 'warning', color: 'yellow', tests: 650 },
    { id: 'ntn', name: 'NTN Satellite', status: 'active', color: 'green', tests: 320 }
  ];

  // Test Suites with comprehensive structure
  const testSuites = [
    {
      id: '5g-nr',
      name: '5G NR',
      totalCount: 1200,
      expanded: true,
      icon: Wifi,
      children: [
        { id: '5g-initial-access', name: 'Initial Access & Cell Search', count: 250, status: 'passed' },
        { id: '5g-rach', name: 'RACH Procedures', count: 180, status: 'passed' },
        { id: '5g-pdu-session', name: 'PDU Session Management', count: 200, status: 'running' },
        { id: '5g-handover', name: 'Handover & Mobility', count: 220, status: 'passed' },
        { id: '5g-beamforming', name: 'Beamforming & MIMO', count: 150, status: 'failed' },
        { id: '5g-scheduling', name: 'Scheduling & Resource Allocation', count: 200, status: 'pending' }
      ]
    },
    {
      id: '4g-lte',
      name: '4G LTE',
      totalCount: 980,
      expanded: false,
      icon: Network,
      children: [
        { id: 'lte-attach', name: 'Attach Procedures', count: 200, status: 'passed' },
        { id: 'lte-handover', name: 'Inter-RAT Handover', count: 180, status: 'passed' },
        { id: 'lte-bearer', name: 'Bearer Management', count: 160, status: 'running' },
        { id: 'lte-security', name: 'Security Procedures', count: 140, status: 'passed' },
        { id: 'lte-measurement', name: 'Measurement Reports', count: 120, status: 'failed' },
        { id: 'lte-power', name: 'Power Control', count: 180, status: 'pending' }
      ]
    },
    {
      id: 'core-network',
      name: 'Core Network',
      totalCount: 750,
      expanded: false,
      icon: Server,
      children: [
        { id: 'amf-tests', name: 'AMF Procedures', count: 150, status: 'passed' },
        { id: 'smf-tests', name: 'SMF Session Management', count: 120, status: 'running' },
        { id: 'upf-tests', name: 'UPF Data Plane', count: 100, status: 'passed' },
        { id: 'ausf-tests', name: 'AUSF Authentication', count: 90, status: 'passed' },
        { id: 'udm-tests', name: 'UDM User Data', count: 80, status: 'failed' },
        { id: 'nssf-tests', name: 'NSSF Network Slicing', count: 210, status: 'pending' }
      ]
    },
    {
      id: 'ims-volte',
      name: 'IMS/VoLTE',
      totalCount: 620,
      expanded: false,
      icon: Phone,
      children: [
        { id: 'sip-registration', name: 'SIP Registration', count: 120, status: 'passed' },
        { id: 'voice-calls', name: 'Voice Call Setup', count: 150, status: 'running' },
        { id: 'video-calls', name: 'Video Call Features', count: 100, status: 'passed' },
        { id: 'conference', name: 'Conference Calls', count: 80, status: 'failed' },
        { id: 'emergency', name: 'Emergency Services', count: 90, status: 'passed' },
        { id: 'sms-over-ip', name: 'SMS over IP', count: 80, status: 'pending' }
      ]
    },
    {
      id: 'oran',
      name: 'O-RAN',
      totalCount: 450,
      expanded: false,
      icon: Layers,
      children: [
        { id: 'o1-interface', name: 'O1 Management', count: 80, status: 'passed' },
        { id: 'a1-interface', name: 'A1 Policy', count: 90, status: 'running' },
        { id: 'e2-interface', name: 'E2 Service Model', count: 100, status: 'passed' },
        { id: 'xapps', name: 'xApps Testing', count: 70, status: 'failed' },
        { id: 'ric-platform', name: 'RIC Platform', count: 60, status: 'passed' },
        { id: 'smo-orchestration', name: 'SMO Orchestration', count: 50, status: 'pending' }
      ]
    },
    {
      id: 'nbiot-ntn',
      name: 'NB-IoT/NTN',
      totalCount: 380,
      expanded: false,
      icon: Database,
      children: [
        { id: 'nbiot-attach', name: 'NB-IoT Attach', count: 80, status: 'passed' },
        { id: 'nbiot-data', name: 'NB-IoT Data Transfer', count: 70, status: 'running' },
        { id: 'nbiot-power', name: 'Power Saving Mode', count: 60, status: 'passed' },
        { id: 'ntn-handover', name: 'NTN Handover', count: 50, status: 'failed' },
        { id: 'ntn-timing', name: 'NTN Timing Advance', count: 40, status: 'passed' },
        { id: 'satellite-link', name: 'Satellite Link Management', count: 80, status: 'pending' }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'running': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'running': return <Activity className="w-4 h-4 animate-pulse" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </button>
            <h1 className="text-xl font-bold text-gray-900">Professional Test Manager</h1>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Connected</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Execution Controls */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`p-2 rounded ${
                  isRunning 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {isRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <RotateCcw className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Settings className="w-4 h-4" />
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${
                  viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${
                  viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-gray-900 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <HelpCircle className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-lg">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700">Admin</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        {!sidebarCollapsed && (
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            {/* RAN Components Section */}
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                RAN Components
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {ranComponents.map((component) => (
                  <button
                    key={component.id}
                    onClick={() => setSelectedComponent(component.id)}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                      selectedComponent === component.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        component.color === 'green' ? 'bg-green-500' :
                        component.color === 'yellow' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}></div>
                      <span className="text-sm font-medium text-gray-900">{component.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">{component.tests} tests</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Test Suites Section */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Test Suites
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-gray-400" />
                    <Filter className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  {testSuites.map((suite) => {
                    const Icon = suite.icon;
                    return (
                      <div key={suite.id} className="border border-gray-200 rounded-lg">
                        <button
                          onClick={() => setSelectedTestSuite(suite.id)}
                          className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50"
                        >
                          <div className="flex items-center space-x-2">
                            <Icon className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-900">{suite.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">{suite.totalCount}</span>
                            {suite.expanded ? 
                              <ChevronDown className="w-4 h-4 text-gray-400" /> :
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            }
                          </div>
                        </button>
                        
                        {suite.expanded && (
                          <div className="border-t border-gray-200 p-2 space-y-1">
                            {suite.children.map((child) => (
                              <div
                                key={child.id}
                                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                              >
                                <div className="flex items-center space-x-2">
                                  <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(child.status)}`}>
                                    {getStatusIcon(child.status)}
                                  </div>
                                  <span className="text-xs text-gray-700">{child.name}</span>
                                </div>
                                <span className="text-xs text-gray-500">{child.count}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Test Execution Dashboard */}
          <div className="bg-white border-b border-gray-200 p-6">
            <div className="grid grid-cols-5 gap-6 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">3,780</div>
                <div className="text-sm text-gray-600">Total Test Cases</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">2,845</div>
                <div className="text-sm text-gray-600">Passed</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-red-600">127</div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">345</div>
                <div className="text-sm text-gray-600">Running</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">463</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                <span className="text-sm text-gray-500">75.3% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75.3%' }}></div>
              </div>
            </div>
          </div>

          {/* Test Results Area */}
          <div className="flex-1 p-6 overflow-auto">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testSuites.find(s => s.id === selectedTestSuite)?.children.map((test) => (
                  <div key={test.id} className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{test.name}</h4>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(test.status)}`}>
                        {test.status.toUpperCase()}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      {test.count} test cases
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full ${
                          test.status === 'passed' ? 'bg-green-500' :
                          test.status === 'failed' ? 'bg-red-500' :
                          test.status === 'running' ? 'bg-blue-500' :
                          'bg-yellow-500'
                        }`}
                        style={{ 
                          width: test.status === 'passed' ? '100%' :
                                 test.status === 'running' ? '60%' :
                                 test.status === 'failed' ? '40%' : '0%'
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Test Execution Results</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Test Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Count
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Progress
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {testSuites.find(s => s.id === selectedTestSuite)?.children.map((test) => (
                        <tr key={test.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {test.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                              {getStatusIcon(test.status)}
                              <span className="ml-1">{test.status.toUpperCase()}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {test.count} cases
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  test.status === 'passed' ? 'bg-green-500' :
                                  test.status === 'failed' ? 'bg-red-500' :
                                  test.status === 'running' ? 'bg-blue-500' :
                                  'bg-yellow-500'
                                }`}
                                style={{ 
                                  width: test.status === 'passed' ? '100%' :
                                         test.status === 'running' ? '60%' :
                                         test.status === 'failed' ? '40%' : '0%'
                                }}
                              ></div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-600 hover:text-blue-800">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="text-green-600 hover:text-green-800">
                                <Play className="w-4 h-4" />
                              </button>
                              <button className="text-gray-600 hover:text-gray-800">
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestManager_1_Layout;
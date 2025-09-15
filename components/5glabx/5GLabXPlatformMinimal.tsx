'use client';

import React, { useState } from 'react';
import { 
  Activity, BarChart3, Settings, Shield, Database, Monitor, MessageSquare,
  Layers, Wifi, Cloud, Play, Pause, Square, Eye, Download, Upload,
  RefreshCw, Plus, Search, Filter, Calendar, Clock, TrendingUp,
  AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronRight,
  Satellite, Network, Server, Phone, MapPin, FileText, HelpCircle
} from 'lucide-react';

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

// Logs Viewer Component
const LogsViewerView: React.FC = () => {
  const sampleLogs = [
    { timestamp: '2024-01-15 14:23:45.123', level: 'INFO', component: 'PHY', message: 'PDSCH transmission scheduled for UE 12345' },
    { timestamp: '2024-01-15 14:23:45.156', level: 'DEBUG', component: 'MAC', message: 'DL PDU received from RLC layer' },
    { timestamp: '2024-01-15 14:23:45.189', level: 'WARN', component: 'RRC', message: 'RRC connection timeout for UE 12346' },
    { timestamp: '2024-01-15 14:23:45.234', level: 'INFO', component: 'NAS', message: 'NAS Attach Request received' },
    { timestamp: '2024-01-15 14:23:45.267', level: 'ERROR', component: 'IMS', message: 'SIP INVITE failed - 408 Request Timeout' },
    { timestamp: '2024-01-15 14:23:45.298', level: 'INFO', component: 'PHY', message: 'Uplink grant allocated to UE 12347' },
    { timestamp: '2024-01-15 14:23:45.334', level: 'DEBUG', component: 'MAC', message: 'UL PDU transmitted successfully' },
    { timestamp: '2024-01-15 14:23:45.367', level: 'INFO', component: 'RRC', message: 'RRC Connection Reconfiguration completed' }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'ERROR': return 'text-red-600 bg-red-50';
      case 'WARN': return 'text-yellow-600 bg-yellow-50';
      case 'INFO': return 'text-blue-600 bg-blue-50';
      case 'DEBUG': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Logs Viewer</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Live Monitoring</span>
          </div>
          <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
            <RefreshCw className="w-4 h-4 mr-2 inline" />
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search logs..." 
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Levels</option>
              <option>ERROR</option>
              <option>WARN</option>
              <option>INFO</option>
              <option>DEBUG</option>
            </select>
            <select className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Components</option>
              <option>PHY</option>
              <option>MAC</option>
              <option>RRC</option>
              <option>NAS</option>
              <option>IMS</option>
            </select>
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Component</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sampleLogs.map((log, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 font-mono">{log.timestamp}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(log.level)}`}>
                      {log.level}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{log.component}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{log.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Enhanced Logs Component
const EnhancedLogsView: React.FC = () => {
  const sampleRows = [
    {
      id: 1,
      timestamp: '2024-01-15 14:23:45.123',
      level: 'INFO',
      component: 'PHY',
      message: 'PDSCH transmission scheduled for UE 12345',
      details: {
        ueId: '12345',
        cellId: '12345',
        mcs: 15,
        tbs: 1024,
        prb: 25
      }
    },
    {
      id: 2,
      timestamp: '2024-01-15 14:23:45.156',
      level: 'DEBUG',
      component: 'MAC',
      message: 'DL PDU received from RLC layer',
      details: {
        pduSize: 512,
        lcid: 3,
        harqId: 0,
        ndi: 1
      }
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Enhanced Logs</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Enhanced Analysis</span>
          </div>
          <button className="px-3 py-1.5 bg-green-600 text-white rounded-md text-sm hover:bg-green-700">
            <Download className="w-4 h-4 mr-2 inline" />
            Export
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Advanced search..." 
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Filter className="w-4 h-4 text-gray-400" />
              <select className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Time</option>
                <option>Last Hour</option>
                <option>Last 24 Hours</option>
                <option>Last Week</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                <Eye className="w-4 h-4 mr-2 inline" />
                View Details
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Component</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sampleRows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900 font-mono">{row.timestamp}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      row.level === 'INFO' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 bg-gray-50'
                    }`}>
                      {row.level}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium">{row.component}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{row.message}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    <div className="space-y-1">
                      {Object.entries(row.details).map(([key, value]) => (
                        <div key={key} className="text-xs">
                          <span className="font-medium">{key}:</span> {value}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <button className="text-blue-600 hover:text-blue-800 mr-2">Analyze</button>
                    <button className="text-green-600 hover:text-green-800">Trace</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Test Suites Component
const TestSuitesView: React.FC = () => {
  const categories = [
    { id: '5g-nr', name: '5G NR', count: 150 },
    { id: 'lte', name: 'LTE', count: 120 },
    { id: 'oran', name: 'O-RAN', count: 85 },
    { id: 'nbiot', name: 'NB-IoT', count: 65 },
    { id: 'v2x', name: 'V2X', count: 45 },
    { id: 'ntn', name: 'NTN', count: 35 },
    { id: 'ims', name: 'IMS', count: 55 },
    { id: 'security', name: 'Security', count: 40 }
  ];

  const testSuites = [
    { id: 1, name: '5G NR Initial Access', category: '5g-nr', status: 'ready', duration: '2m 30s', description: 'Complete initial access procedure testing' },
    { id: 2, name: 'LTE Handover Procedures', category: 'lte', status: 'running', duration: '1m 45s', description: 'Inter-cell handover validation' },
    { id: 3, name: 'O-RAN F1 Interface', category: 'oran', status: 'ready', duration: '3m 15s', description: 'F1 interface protocol testing' },
    { id: 4, name: 'NB-IoT Attach Flow', category: 'nbiot', status: 'completed', duration: '1m 20s', description: 'NB-IoT device attachment procedures' },
    { id: 5, name: 'V2X Sidelink Communication', category: 'v2x', status: 'ready', duration: '4m 10s', description: 'Vehicle-to-vehicle communication testing' },
    { id: 6, name: 'NTN Satellite Handover', category: 'ntn', status: 'ready', duration: '5m 30s', description: 'Non-terrestrial network handover procedures' },
    { id: 7, name: 'IMS SIP Registration', category: 'ims', status: 'failed', duration: '2m 15s', description: 'SIP registration and authentication' },
    { id: 8, name: '5G Security Authentication', category: 'security', status: 'ready', duration: '1m 50s', description: '5G-AKA authentication procedures' }
  ];

  const [selectedCategory, setSelectedCategory] = React.useState('5g-nr');
  const [selectedTests, setSelectedTests] = React.useState<number[]>([]);

  const filteredTests = testSuites.filter(test => test.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-blue-600 bg-blue-50';
      case 'completed': return 'text-green-600 bg-green-50';
      case 'failed': return 'text-red-600 bg-red-50';
      case 'ready': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Test Suites</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Test Engine Ready</span>
          </div>
          <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center">
            <Play className="w-4 h-4 mr-2" />
            Run Selected
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center">
            <Square className="w-4 h-4 mr-2" />
            Stop All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-4">
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-100 text-blue-700 border-l-2 border-blue-500'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{category.name}</span>
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Test Suites List */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {categories.find(c => c.id === selectedCategory)?.name} Test Suites
                </h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedTests.length === filteredTests.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTests(filteredTests.map(test => test.id));
                      } else {
                        setSelectedTests([]);
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-600">Select All</span>
                </div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {filteredTests.map((test) => (
                <div key={test.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedTests.includes(test.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTests([...selectedTests, test.id]);
                          } else {
                            setSelectedTests(selectedTests.filter(id => id !== test.id));
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{test.name}</h4>
                        <p className="text-sm text-gray-500">{test.description}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-gray-400">Duration: {test.duration}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                            {test.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                        <Play className="w-3 h-3 mr-1 inline" />
                        Run
                      </button>
                      <button className="px-3 py-1.5 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700">
                        <Eye className="w-3 h-3 mr-1 inline" />
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
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
        return <GenericView title="Logs Viewer" description="Protocol log analysis and monitoring." />;
      case 'enhanced-logs':
        return <GenericView title="Enhanced Logs" description="Advanced log filtering and analysis capabilities." />;
      case 'layer-trace':
        return <GenericView title="Layer Trace" description="Protocol layer message flow and timing analysis." />;
      case 'callflow':
        return <GenericView title="Call Flow" description="Protocol message sequences and call flow analysis." />;
      case 'analytics':
        return <GenericView title="Analytics" description="Real-time analytics and performance monitoring." badge="LIVE" />;
      case 'oran-overview':
        return <GenericView title="O-RAN Overview" description="O-RAN architecture overview and analysis." />;
      case 'oran-interfaces':
        return <GenericView title="O-RAN Interfaces" description="O-RAN interface analysis and monitoring." />;
      case 'oran-cu-analysis':
        return <GenericView title="O-RAN CU Analysis" description="Central Unit analysis and monitoring." />;
      case 'oran-du-analysis':
        return <GenericView title="O-RAN DU Analysis" description="Distributed Unit analysis and monitoring." />;
      case 'oran-e1-interface':
        return <GenericView title="O-RAN E1 Interface" description="E1 interface analysis and monitoring." />;
      case 'oran-f1-interface':
        return <GenericView title="O-RAN F1 Interface" description="F1 interface analysis and monitoring." />;
      case 'oran-performance':
        return <GenericView title="O-RAN Performance" description="O-RAN performance analysis and monitoring." />;
      case 'oran-xapps':
        return <GenericView title="O-RAN xApps" description="xApps analysis and management." />;
      case 'oran-smo':
        return <GenericView title="O-RAN SMO" description="Service Management and Orchestration analysis." />;
      case 'nbiot-overview':
        return <GenericView title="NB-IoT Overview" description="NB-IoT network overview and analysis." />;
      case 'nbiot-callflow':
        return <GenericView title="NB-IoT Call Flow" description="NB-IoT call flow analysis and monitoring." />;
      case 'nbiot-analytics':
        return <GenericView title="NB-IoT Analytics" description="NB-IoT analytics and performance monitoring." />;
      case 'nbiot-phy-layer':
        return <GenericView title="NB-IoT PHY Layer" description="NB-IoT physical layer analysis." />;
      case 'nbiot-mac-layer':
        return <GenericView title="NB-IoT MAC Layer" description="NB-IoT MAC layer analysis." />;
      case 'nbiot-rrc-layer':
        return <GenericView title="NB-IoT RRC Layer" description="NB-IoT RRC layer analysis." />;
      case 'nbiot-testing':
        return <GenericView title="NB-IoT Testing" description="NB-IoT test management and execution." />;
      case 'v2x-overview':
        return <GenericView title="V2X Overview" description="Vehicle-to-everything communication overview." />;
      case 'v2x-sidelink':
        return <GenericView title="V2X Sidelink" description="V2X sidelink communication analysis." />;
      case 'v2x-analytics':
        return <GenericView title="V2X Analytics" description="V2X analytics and performance monitoring." />;
      case 'v2x-phy-layer':
        return <GenericView title="V2X PHY Layer" description="V2X physical layer analysis." />;
      case 'v2x-mac-layer':
        return <GenericView title="V2X MAC Layer" description="V2X MAC layer analysis." />;
      case 'v2x-testing':
        return <GenericView title="V2X Testing" description="V2X test management and execution." />;
      case 'v2x-scenarios':
        return <GenericView title="V2X Scenarios" description="V2X scenario analysis and testing." />;
      case 'ntn-overview':
        return <GenericView title="NTN Overview" description="Non-Terrestrial Network overview and analysis." />;
      case 'ntn-satellites':
        return <GenericView title="Satellite Links" description="Satellite link analysis and monitoring." />;
      case 'ntn-analytics':
        return <GenericView title="NTN Analytics" description="NTN analytics and performance monitoring." badge="LIVE" />;
      case 'ntn-sib19':
        return <GenericView title="SIB19 Analysis" description="System Information Block 19 analysis." />;
      case 'ntn-timing':
        return <GenericView title="Timing & Delay" description="NTN timing and delay analysis." />;
      case 'ntn-doppler':
        return <GenericView title="Doppler Analysis" description="Doppler effect analysis for NTN." />;
      case 'ntn-scenarios':
        return <GenericView title="NTN Scenarios" description="NTN scenario analysis and testing." />;
      case 'phy-layer':
        return <GenericView title="PHY Layer" description="Physical layer analysis and monitoring." />;
      case 'mac-layer':
        return <GenericView title="MAC Layer" description="MAC layer analysis and monitoring." />;
      case 'rlc-layer':
        return <GenericView title="RLC Layer" description="RLC layer analysis and monitoring." />;
      case 'pdcp-layer':
        return <GenericView title="PDCP Layer" description="PDCP layer analysis and monitoring." />;
      case 'rrc-layer':
        return <GenericView title="RRC Layer" description="RRC layer analysis and monitoring." />;
      case 'nas-layer':
        return <GenericView title="NAS Layer" description="NAS layer analysis and monitoring." />;
      case 'ims-layer':
        return <GenericView title="IMS Analysis" description="IMS protocol analysis and monitoring." />;
      case 'amf-analyzer':
        return <GenericView title="AMF Analyzer" description="Access and Mobility Management Function analyzer." />;
      case 'smf-analyzer':
        return <GenericView title="SMF Analyzer" description="Session Management Function analyzer." />;
      case 'upf-analyzer':
        return <GenericView title="UPF Analyzer" description="User Plane Function analyzer." />;
      case 'ausf-analyzer':
        return <GenericView title="AUSF Analyzer" description="Authentication Server Function analyzer." />;
      case 'udm-analyzer':
        return <GenericView title="UDM Analyzer" description="Unified Data Management analyzer." />;
      case 'config-manager':
        return <GenericView title="Config Manager" description="Configuration management and monitoring." />;
      case 'mme-analyzer':
        return <GenericView title="MME Analyzer" description="Mobility Management Entity analyzer." />;
      case 'sgw-analyzer':
        return <GenericView title="SGW Analyzer" description="Serving Gateway analyzer." />;
      case 'pgw-analyzer':
        return <GenericView title="PGW Analyzer" description="Packet Data Network Gateway analyzer." />;
      case 'report-generator':
        return <GenericView title="Report Generator" description="Generate comprehensive analysis reports." />;
      case 'export-manager':
        return <GenericView title="Export Manager" description="Export data and analysis results." />;
      case 'help-support':
        return <GenericView title="Help & Support" description="User support and documentation." />;
      case 'test-suites':
        return <GenericView title="Test Suites" description="Comprehensive test suite management and execution." />;
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
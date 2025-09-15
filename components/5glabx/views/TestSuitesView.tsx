'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Play, 
  Pause, 
  Square, 
  Eye, 
  Download, 
  Upload, 
  Search, 
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  Settings,
  FileText,
  Network,
  Phone,
  Wifi,
  Server,
  Database
} from 'lucide-react';

const TestSuitesView: React.FC<{
  appState: any;
  onStateChange: (state: any) => void;
}> = ({ appState, onStateChange }) => {
  const [testSuites, setTestSuites] = useState([
    {
      id: '5g-nr-initial-access',
      name: '5G NR Initial Access',
      description: 'Comprehensive test suite for 5G NR initial access procedures including random access, system information acquisition, and initial connection establishment.',
      category: '5G NR',
      testCount: 50,
      status: 'active',
      lastRun: '2024-01-15 14:30:00',
      successRate: 96.2,
      avgDuration: '2m 15s',
      icon: Network,
      color: 'blue',
      tags: ['5G', 'NR', 'Initial Access', 'Random Access', 'System Information']
    },
    {
      id: '5g-nr-handover',
      name: '5G NR Handover',
      description: 'Test suite for 5G NR handover procedures and mobility management including intra-frequency, inter-frequency, and inter-RAT handovers.',
      category: '5G NR',
      testCount: 50,
      status: 'active',
      lastRun: '2024-01-14 16:45:00',
      successRate: 94.8,
      avgDuration: '3m 30s',
      icon: Network,
      color: 'blue',
      tags: ['5G', 'NR', 'Handover', 'Mobility', 'Inter-frequency']
    },
    {
      id: '5g-nr-measurement',
      name: '5G NR Measurement',
      description: '5G NR measurement procedures including RSRP, RSRQ, SINR measurements and measurement reporting.',
      category: '5G NR',
      testCount: 50,
      status: 'active',
      lastRun: '2024-01-13 11:20:00',
      successRate: 98.1,
      avgDuration: '1m 45s',
      icon: BarChart3,
      color: 'blue',
      tags: ['5G', 'NR', 'Measurement', 'RSRP', 'RSRQ', 'SINR']
    },
    {
      id: '5g-nr-mobility',
      name: '5G NR Mobility',
      description: '5G NR mobility procedures including cell reselection, handover, and mobility state management.',
      category: '5G NR',
      testCount: 50,
      status: 'active',
      lastRun: '2024-01-12 09:15:00',
      successRate: 95.5,
      avgDuration: '2m 50s',
      icon: Network,
      color: 'blue',
      tags: ['5G', 'NR', 'Mobility', 'Cell Reselection', 'Handover']
    },
    {
      id: '5g-nr-pdu-session',
      name: '5G NR PDU Session',
      description: '5G NR PDU session establishment, modification, and release procedures.',
      category: '5G NR',
      testCount: 50,
      status: 'active',
      lastRun: '2024-01-11 13:40:00',
      successRate: 97.3,
      avgDuration: '4m 10s',
      icon: Server,
      color: 'blue',
      tags: ['5G', 'NR', 'PDU Session', 'Session Management', 'Core Network']
    },
    {
      id: '5g-nr-power-control',
      name: '5G NR Power Control',
      description: '5G NR power control procedures including uplink power control and power headroom reporting.',
      category: '5G NR',
      testCount: 50,
      status: 'active',
      lastRun: '2024-01-10 15:25:00',
      successRate: 93.7,
      avgDuration: '1m 55s',
      icon: Settings,
      color: 'blue',
      tags: ['5G', 'NR', 'Power Control', 'Uplink', 'Power Headroom']
    },
    {
      id: '5g-nr-scheduling',
      name: '5G NR Scheduling',
      description: '5G NR scheduling procedures including downlink and uplink scheduling, resource allocation.',
      category: '5G NR',
      testCount: 50,
      status: 'active',
      lastRun: '2024-01-09 10:50:00',
      successRate: 96.8,
      avgDuration: '2m 20s',
      icon: BarChart3,
      color: 'blue',
      tags: ['5G', 'NR', 'Scheduling', 'Resource Allocation', 'MAC']
    },
    {
      id: '5g-nr-security',
      name: '5G NR Security',
      description: '5G NR security procedures including authentication, key management, and ciphering.',
      category: '5G NR',
      testCount: 50,
      status: 'active',
      lastRun: '2024-01-08 12:35:00',
      successRate: 99.1,
      avgDuration: '3m 45s',
      icon: Shield,
      color: 'blue',
      tags: ['5G', 'NR', 'Security', 'Authentication', 'Key Management']
    },
    {
      id: 'lte-initial-access',
      name: 'LTE Initial Access',
      description: 'LTE initial access procedures including cell search, system information acquisition, and random access.',
      category: '4G LTE',
      testCount: 50,
      status: 'active',
      lastRun: '2024-01-07 14:20:00',
      successRate: 97.8,
      avgDuration: '2m 05s',
      icon: Network,
      color: 'green',
      tags: ['LTE', 'Initial Access', 'Cell Search', 'Random Access']
    },
    {
      id: 'lte-handover',
      name: 'LTE Handover',
      description: 'LTE handover procedures including X2 and S1 handovers, mobility management.',
      category: '4G LTE',
      testCount: 50,
      status: 'active',
      lastRun: '2024-01-06 16:10:00',
      successRate: 95.2,
      avgDuration: '3m 15s',
      icon: Network,
      color: 'green',
      tags: ['LTE', 'Handover', 'X2', 'S1', 'Mobility']
    },
    {
      id: 'lte-measurement',
      name: 'LTE Measurement',
      description: 'LTE measurement procedures including RSRP, RSRQ, and measurement reporting.',
      category: '4G LTE',
      testCount: 50,
      status: 'active',
      lastRun: '2024-01-05 11:45:00',
      successRate: 98.5,
      avgDuration: '1m 40s',
      icon: BarChart3,
      color: 'green',
      tags: ['LTE', 'Measurement', 'RSRP', 'RSRQ', 'Reporting']
    },
    {
      id: 'lte-mobility',
      name: 'LTE Mobility',
      description: 'LTE mobility procedures including cell reselection and mobility state management.',
      category: '4G LTE',
      testCount: 50,
      status: 'active',
      lastRun: '2024-01-04 13:30:00',
      successRate: 96.9,
      avgDuration: '2m 35s',
      icon: Network,
      color: 'green',
      tags: ['LTE', 'Mobility', 'Cell Reselection', 'State Management']
    },
    {
      id: 'lte-security',
      name: 'LTE Security',
      description: 'LTE security procedures including authentication, key management, and ciphering.',
      category: '4G LTE',
      testCount: 50,
      status: 'active',
      lastRun: '2024-01-03 15:15:00',
      successRate: 99.3,
      avgDuration: '3m 20s',
      icon: Shield,
      color: 'green',
      tags: ['LTE', 'Security', 'Authentication', 'Key Management']
    },
    {
      id: 'lte-bearer-management',
      name: 'LTE Bearer Management',
      description: 'LTE bearer establishment, modification, and release procedures.',
      category: '4G LTE',
      testCount: 50,
      status: 'active',
      lastRun: '2024-01-02 09:25:00',
      successRate: 97.1,
      avgDuration: '4m 00s',
      icon: Server,
      color: 'green',
      tags: ['LTE', 'Bearer Management', 'EPS Bearer', 'QoS']
    },
    {
      id: 'volte-vonr-conference-ims',
      name: 'VoLTE/VoNR Conference IMS',
      description: 'VoLTE and VoNR conference call procedures including IMS signaling and media handling.',
      category: 'IMS',
      testCount: 25,
      status: 'active',
      lastRun: '2024-01-01 12:00:00',
      successRate: 94.4,
      avgDuration: '5m 30s',
      icon: Phone,
      color: 'purple',
      tags: ['VoLTE', 'VoNR', 'IMS', 'Conference', 'SIP']
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [runningTests, setRunningTests] = useState<Set<string>>(new Set());

  const categories = ['all', '5G NR', '4G LTE', 'IMS'];
  const statuses = ['all', 'active', 'inactive', 'running'];

  const filteredTestSuites = testSuites.filter(suite => {
    const matchesSearch = suite.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         suite.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         suite.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || suite.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || suite.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'green':
        return 'bg-green-100 text-green-600 border-green-200';
      case 'purple':
        return 'bg-purple-100 text-purple-600 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const handleRunTest = (suiteId: string) => {
    setRunningTests(prev => new Set(prev).add(suiteId));
    // Simulate test execution
    setTimeout(() => {
      setRunningTests(prev => {
        const newSet = new Set(prev);
        newSet.delete(suiteId);
        return newSet;
      });
    }, 5000);
  };

  const getStatusIcon = (suite: any) => {
    if (runningTests.has(suite.id)) {
      return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
    }
    return suite.status === 'active' ? 
      <CheckCircle className="w-4 h-4 text-green-500" /> : 
      <XCircle className="w-4 h-4 text-gray-400" />;
  };

  const getStatusColor = (suite: any) => {
    if (runningTests.has(suite.id)) {
      return 'bg-blue-100 text-blue-800';
    }
    return suite.status === 'active' ? 
      'bg-green-100 text-green-800' : 
      'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Test Suites</h1>
          <p className="text-gray-600 mt-1">Comprehensive 3GPP-compliant test case library</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">1000+ Test Cases Available</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search test suites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Test Suites</p>
              <p className="text-2xl font-semibold text-gray-900">{testSuites.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Test Cases</p>
              <p className="text-2xl font-semibold text-gray-900">
                {testSuites.reduce((sum, suite) => sum + suite.testCount, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Suites</p>
              <p className="text-2xl font-semibold text-gray-900">
                {testSuites.filter(s => s.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BarChart3 className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Success Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {(testSuites.reduce((sum, suite) => sum + suite.successRate, 0) / testSuites.length).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Test Suites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTestSuites.map((suite) => {
          const Icon = suite.icon;
          return (
            <div key={suite.id} className="bg-white rounded-lg border shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClasses(suite.color)}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{suite.name}</h3>
                    <p className="text-sm text-gray-500">{suite.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(suite)}
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(suite)}`}>
                    {runningTests.has(suite.id) ? 'Running' : suite.status}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{suite.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Test Cases:</span>
                  <span className="font-medium">{suite.testCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Success Rate:</span>
                  <span className="font-medium text-green-600">{suite.successRate}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Avg Duration:</span>
                  <span className="font-medium">{suite.avgDuration}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Last Run:</span>
                  <span className="font-medium">{suite.lastRun}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {suite.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                    {tag}
                  </span>
                ))}
                {suite.tags.length > 3 && (
                  <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                    +{suite.tags.length - 3}
                  </span>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleRunTest(suite.id)}
                  disabled={runningTests.has(suite.id)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {runningTests.has(suite.id) ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Run Tests
                    </>
                  )}
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredTestSuites.length === 0 && (
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No test suites found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
        </div>
      )}
    </div>
  );
};

export default TestSuitesView;
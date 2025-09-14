'use client';

import React, { useState } from 'react';
import { 
  Download, 
  Eye, 
  BarChart3,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  Activity,
  FileText,
  Database,
  RefreshCw,
  Filter,
  Search,
  Calendar,
  Timer,
  Zap,
  Shield,
  Network,
  Layers
} from 'lucide-react';

interface TestResultsViewerProps {
  activeRun: any;
}

const TestResultsViewer: React.FC<TestResultsViewerProps> = ({ activeRun }) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'details' | 'metrics' | 'export'>('overview');
  const [filterStatus, setFilterStatus] = useState<'all' | 'passed' | 'failed'>('all');

  // Mock test results data
  const mockResults = [
    {
      test_id: '5NR_INIT_0001',
      name: '5G NR Initial Access - Basic',
      status: 'passed',
      duration_seconds: 120,
      metrics: {
        latency_ms: 95,
        throughput_mbps: 52,
        success_rate: 98
      },
      errors: [],
      warnings: ['Minor timing variation detected'],
      protocol: '5G_NR',
      complexity: 'beginner'
    },
    {
      test_id: '5NR_INIT_0002',
      name: '5G NR Initial Access - High Mobility',
      status: 'failed',
      duration_seconds: 180,
      metrics: {
        latency_ms: 250,
        throughput_mbps: 35,
        success_rate: 85
      },
      errors: ['RRC connection timeout', 'Handover failure'],
      warnings: ['High mobility scenario exceeded expected latency'],
      protocol: '5G_NR',
      complexity: 'intermediate'
    },
    {
      test_id: 'LTE_ATTACH_0001',
      name: 'LTE Attach Procedure - Basic',
      status: 'passed',
      duration_seconds: 90,
      metrics: {
        latency_ms: 80,
        throughput_mbps: 45,
        success_rate: 99
      },
      errors: [],
      warnings: [],
      protocol: '4G_LTE',
      complexity: 'beginner'
    }
  ];

  const filteredResults = mockResults.filter(result => 
    filterStatus === 'all' || result.status === filterStatus
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-800 border-green-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProtocolIcon = (protocol: string) => {
    switch (protocol) {
      case '5G_NR': return <Network className="w-4 h-4" />;
      case '4G_LTE': return <Layers className="w-4 h-4" />;
      case 'IMS_SIP': return <Activity className="w-4 h-4" />;
      default: return <Database className="w-4 h-4" />;
    }
  };

  const exportResults = (format: 'csv' | 'json' | 'pdf') => {
    console.log(`Exporting results as ${format}`);
    // Implement export functionality
  };

  if (!activeRun) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Test Results</h3>
        <p className="text-gray-600">Run some tests to see results here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Test Results</h3>
          <p className="text-sm text-gray-600">Run ID: {activeRun.run_id}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => exportResults('csv')}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            CSV
          </button>
          <button
            onClick={() => exportResults('json')}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            JSON
          </button>
          <button
            onClick={() => exportResults('pdf')}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Tests</p>
              <p className="text-xl font-bold text-gray-900">{mockResults.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Passed</p>
              <p className="text-xl font-bold text-gray-900">
                {mockResults.filter(r => r.status === 'passed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Failed</p>
              <p className="text-xl font-bold text-gray-900">
                {mockResults.filter(r => r.status === 'failed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-xl font-bold text-gray-900">
                {Math.round((mockResults.filter(r => r.status === 'passed').length / mockResults.length) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'details', label: 'Details', icon: FileText },
              { id: 'metrics', label: 'Metrics', icon: TrendingUp },
              { id: 'export', label: 'Export', icon: Download }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="text-sm border border-gray-300 rounded px-3 py-1"
                  >
                    <option value="all">All Results</option>
                    <option value="passed">Passed Only</option>
                    <option value="failed">Failed Only</option>
                  </select>
                </div>
              </div>

              {/* Results List */}
              <div className="space-y-4">
                {filteredResults.map((result, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(result.status)}
                        <div>
                          <h4 className="font-semibold text-gray-900">{result.name}</h4>
                          <p className="text-sm text-gray-600 font-mono">{result.test_id}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(result.status)}`}>
                          {result.status}
                        </span>
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Timer className="w-4 h-4" />
                          <span>{result.duration_seconds}s</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Latency:</span>
                        <span className="ml-2 font-medium">{result.metrics.latency_ms}ms</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Throughput:</span>
                        <span className="ml-2 font-medium">{result.metrics.throughput_mbps} Mbps</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Success Rate:</span>
                        <span className="ml-2 font-medium">{result.metrics.success_rate}%</span>
                      </div>
                    </div>

                    {result.errors.length > 0 && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <h5 className="text-sm font-medium text-red-800 mb-2">Errors:</h5>
                        <ul className="text-sm text-red-700 space-y-1">
                          {result.errors.map((error, i) => (
                            <li key={i}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {result.warnings.length > 0 && (
                      <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h5 className="text-sm font-medium text-yellow-800 mb-2">Warnings:</h5>
                        <ul className="text-sm text-yellow-700 space-y-1">
                          {result.warnings.map((warning, i) => (
                            <li key={i}>• {warning}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'details' && (
            <div className="space-y-4">
              <p className="text-gray-600">Detailed test execution information will be displayed here.</p>
              {/* Implement detailed view */}
            </div>
          )}

          {selectedTab === 'metrics' && (
            <div className="space-y-4">
              <p className="text-gray-600">Performance metrics and charts will be displayed here.</p>
              {/* Implement metrics view */}
            </div>
          )}

          {selectedTab === 'export' && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">Export Results</h4>
              <p className="text-gray-600">Choose a format to export your test results.</p>
              
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => exportResults('csv')}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 text-center"
                >
                  <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <div className="font-medium">CSV</div>
                  <div className="text-sm text-gray-600">Spreadsheet format</div>
                </button>
                
                <button
                  onClick={() => exportResults('json')}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 text-center"
                >
                  <Database className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <div className="font-medium">JSON</div>
                  <div className="text-sm text-gray-600">Machine readable</div>
                </button>
                
                <button
                  onClick={() => exportResults('pdf')}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 text-center"
                >
                  <Download className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <div className="font-medium">PDF</div>
                  <div className="text-sm text-gray-600">Report format</div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestResultsViewer;
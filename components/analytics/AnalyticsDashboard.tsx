'use client';

import React, { useState, useEffect } from 'react';
import { AnalyticsEngine, AnalyticsMetrics, ReportConfig, ReportData } from '@/lib/analytics-engine';
import { TestExecutionEngine } from '@/lib/test-execution-engine';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Download,
  FileText,
  Calendar,
  Filter,
  RefreshCw,
  Eye,
  Settings,
  PieChart,
  LineChart,
  BarChart,
  Target,
  Zap,
  Globe,
  Database,
  Server,
  Network,
  Cpu,
  MemoryStick,
  HardDrive,
  Router,
  Switch,
  Shield,
  Bell,
  Info,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  Share,
  Copy,
  ExternalLink,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Square
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface AnalyticsDashboardProps {
  userId: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ userId }) => {
  const [analyticsEngine] = useState(() => AnalyticsEngine.getInstance());
  const [executionEngine] = useState(() => TestExecutionEngine.getInstance());
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [reports, setReports] = useState<ReportData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedProtocol, setSelectedProtocol] = useState('all');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    reportType: 'executive',
    timeRange: {
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      end: new Date()
    },
    filters: {},
    metrics: ['executions', 'successRate', 'performance'],
    format: 'pdf',
    includeCharts: true,
    includeRawData: false
  });
  const [expandedChart, setExpandedChart] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
    setupEventListeners();
    
    return () => {
      cleanupEventListeners();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      loadAnalytics();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      
      // Get all executions
      const executions = executionEngine.getAllExecutions();
      
      // Calculate metrics
      const calculatedMetrics = await analyticsEngine.calculateMetrics(executions);
      setMetrics(calculatedMetrics);
      
      // Get dashboard data
      const dashboard = analyticsEngine.getDashboardData();
      setDashboardData(dashboard);
      
      // Get reports
      const allReports = analyticsEngine.getAllReports();
      setReports(allReports);
      
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupEventListeners = () => {
    analyticsEngine.on('metricsUpdated', (data) => {
      setMetrics(data);
    });

    analyticsEngine.on('reportGenerated', (data) => {
      setReports(prev => [...prev, data]);
    });

    executionEngine.on('executionCompleted', () => {
      loadAnalytics();
    });

    executionEngine.on('executionFailed', () => {
      loadAnalytics();
    });
  };

  const cleanupEventListeners = () => {
    // Cleanup if needed
  };

  const handleGenerateReport = async () => {
    try {
      setIsLoading(true);
      const report = await analyticsEngine.generateReport(reportConfig);
      setShowReportModal(false);
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportReport = async (reportId: string, format: string) => {
    try {
      const blob = await analyticsEngine.exportReport(reportId, format);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report_${reportId}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export report:', error);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getProtocolColor = (protocol: string) => {
    const colors: { [key: string]: string } = {
      '5G NR': '#3B82F6',
      '4G LTE': '#10B981',
      'IMS/SIP': '#F59E0B',
      'O-RAN': '#EF4444',
      'NB-IoT': '#8B5CF6',
      'V2X': '#EC4899',
      'NTN': '#06B6D4'
    };
    return colors[protocol] || '#6B7280';
  };

  if (isLoading && !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
              <p className="text-sm text-gray-500">Comprehensive insights and performance metrics</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowReportModal(true)}
            >
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
            <Button
              variant="outline"
              onClick={loadAnalytics}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="1d">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedProtocol}
              onChange={(e) => setSelectedProtocol(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Protocols</option>
              <option value="5G NR">5G NR</option>
              <option value="4G LTE">4G LTE</option>
              <option value="IMS/SIP">IMS/SIP</option>
              <option value="O-RAN">O-RAN</option>
              <option value="NB-IoT">NB-IoT</option>
              <option value="V2X">V2X</option>
              <option value="NTN">NTN</option>
            </select>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Executions</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(dashboardData.overview.totalExecutions)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.overview.successRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Execution Time</p>
                <p className="text-2xl font-bold text-gray-900">{formatDuration(dashboardData.overview.averageTime)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.overview.activeUsers}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      {dashboardData && dashboardData.charts && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {dashboardData.charts.map((chart: any, index: number) => (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{chart.title}</h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExpandedChart(
                      expandedChart === chart.title ? null : chart.title
                    )}
                  >
                    {expandedChart === chart.title ? 
                      <Minimize2 className="w-4 h-4" /> : 
                      <Maximize2 className="w-4 h-4" />
                    }
                  </Button>
                </div>
              </div>
              
              <div className={`${expandedChart === chart.title ? 'h-96' : 'h-64'}`}>
                {chart.type === 'pie' && (
                  <div className="flex items-center justify-center h-full">
                    <div className="grid grid-cols-2 gap-4">
                      {chart.data.map((item: any, itemIndex: number) => (
                        <div key={itemIndex} className="flex items-center space-x-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: getProtocolColor(item.name) }}
                          ></div>
                          <span className="text-sm text-gray-600">{item.name}</span>
                          <span className="text-sm font-medium text-gray-900">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {chart.type === 'line' && (
                  <div className="h-full flex items-center justify-center">
                    <div className="w-full">
                      <div className="text-center text-gray-500">
                        <LineChart className="w-16 h-16 mx-auto mb-2 text-gray-300" />
                        <p>Line chart visualization</p>
                        <p className="text-sm">Data points: {chart.data.length}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {chart.type === 'bar' && (
                  <div className="h-full flex items-center justify-center">
                    <div className="w-full">
                      <div className="text-center text-gray-500">
                        <BarChart className="w-16 h-16 mx-auto mb-2 text-gray-300" />
                        <p>Bar chart visualization</p>
                        <p className="text-sm">Layers: {chart.data.length}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Alerts */}
      {dashboardData && dashboardData.alerts && dashboardData.alerts.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Alerts</h3>
          <div className="space-y-3">
            {dashboardData.alerts.map((alert: any, index: number) => (
              <div
                key={index}
                className={`flex items-center space-x-3 p-3 rounded-lg ${
                  alert.type === 'error' ? 'bg-red-50 border border-red-200' :
                  alert.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                  'bg-blue-50 border border-blue-200'
                }`}
              >
                {alert.type === 'error' ? (
                  <XCircle className="w-5 h-5 text-red-500" />
                ) : alert.type === 'warning' ? (
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Info className="w-5 h-5 text-blue-500" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reports */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Generated Reports</h3>
          <Button
            variant="outline"
            onClick={() => setShowReportModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Report
          </Button>
        </div>
        
        {reports.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Generated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{report.name}</div>
                          <div className="text-sm text-gray-500">{report.id.substring(0, 12)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(report.generatedAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExportReport(report.id, 'pdf')}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExportReport(report.id, 'excel')}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExportReport(report.id, 'csv')}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No reports generated</h4>
            <p className="text-gray-500 mb-4">Generate your first analytics report to get started.</p>
            <Button onClick={() => setShowReportModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        )}
      </div>

      {/* Generate Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Generate Analytics Report</h3>
              <Button
                variant="outline"
                onClick={() => setShowReportModal(false)}
              >
                Close
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                <select
                  value={reportConfig.reportType}
                  onChange={(e) => setReportConfig({
                    ...reportConfig,
                    reportType: e.target.value as 'executive' | 'technical' | 'detailed' | 'custom'
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="executive">Executive Summary</option>
                  <option value="technical">Technical Report</option>
                  <option value="detailed">Detailed Analysis</option>
                  <option value="custom">Custom Report</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={reportConfig.timeRange.start.toISOString().split('T')[0]}
                      onChange={(e) => setReportConfig({
                        ...reportConfig,
                        timeRange: {
                          ...reportConfig.timeRange,
                          start: new Date(e.target.value)
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">End Date</label>
                    <input
                      type="date"
                      value={reportConfig.timeRange.end.toISOString().split('T')[0]}
                      onChange={(e) => setReportConfig({
                        ...reportConfig,
                        timeRange: {
                          ...reportConfig.timeRange,
                          end: new Date(e.target.value)
                        }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
                <select
                  value={reportConfig.format}
                  onChange={(e) => setReportConfig({
                    ...reportConfig,
                    format: e.target.value as 'pdf' | 'excel' | 'csv' | 'json'
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                </select>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={reportConfig.includeCharts}
                    onChange={(e) => setReportConfig({
                      ...reportConfig,
                      includeCharts: e.target.checked
                    })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Include Charts</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={reportConfig.includeRawData}
                    onChange={(e) => setReportConfig({
                      ...reportConfig,
                      includeRawData: e.target.checked
                    })}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Include Raw Data</span>
                </label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowReportModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleGenerateReport}
                  disabled={isLoading}
                >
                  {isLoading ? 'Generating...' : 'Generate Report'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
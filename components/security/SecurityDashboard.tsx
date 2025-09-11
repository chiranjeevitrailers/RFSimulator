'use client';

import React, { useState, useEffect } from 'react';
import { SecurityManager, SecurityEvent, ComplianceReport } from '@/lib/security-manager';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Activity, 
  Users, 
  Globe, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  Info,
  Settings,
  RefreshCw,
  Download,
  Filter,
  Search,
  Calendar,
  FileText,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Zap,
  Database,
  Server,
  Network,
  Cpu,
  MemoryStick,
  HardDrive,
  Router,
  Switch,
  Bell,
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
  Square,
  Download as DownloadIcon,
  Upload,
  Monitor,
  Smartphone,
  Globe as GlobeIcon,
  Shield as ShieldIcon,
  Bell as BellIcon,
  Info as InfoIcon,
  AlertCircle as AlertCircleIcon
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface SecurityDashboardProps {
  userId: string;
}

const SecurityDashboard: React.FC<SecurityDashboardProps> = ({ userId }) => {
  const [securityManager] = useState(() => SecurityManager.getInstance());
  const [metrics, setMetrics] = useState<any>(null);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [complianceReports, setComplianceReports] = useState<ComplianceReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [showComplianceModal, setShowComplianceModal] = useState(false);
  const [selectedComplianceType, setSelectedComplianceType] = useState<'GDPR' | 'CCPA' | 'SOX' | 'HIPAA' | 'PCI-DSS' | 'ISO27001'>('GDPR');
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [blockedIPs, setBlockedIPs] = useState<string[]>([]);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);

  useEffect(() => {
    loadSecurityData();
    setupRealTimeUpdates();
    
    return () => {
      cleanupRealTimeUpdates();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      loadSecurityData();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const loadSecurityData = async () => {
    try {
      setIsLoading(true);
      
      const currentMetrics = securityManager.getSecurityMetrics();
      const currentEvents = securityManager.getSecurityEvents(100);
      const currentBlockedIPs = securityManager.getBlockedIPs();
      const currentSessions = securityManager.getActiveSessions();
      
      setMetrics(currentMetrics);
      setSecurityEvents(currentEvents);
      setBlockedIPs(currentBlockedIPs);
      setActiveSessions(currentSessions);
      
    } catch (error) {
      console.error('Failed to load security data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealTimeUpdates = () => {
    // Setup real-time security event monitoring
    // This would be implemented with WebSocket or Server-Sent Events
  };

  const cleanupRealTimeUpdates = () => {
    // Cleanup real-time monitoring
  };

  const handleGenerateComplianceReport = async () => {
    try {
      setIsLoading(true);
      const report = await securityManager.generateComplianceReport(selectedComplianceType);
      setComplianceReports(prev => [report, ...prev]);
      setShowComplianceModal(false);
    } catch (error) {
      console.error('Failed to generate compliance report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnblockIP = (ipAddress: string) => {
    securityManager.unblockIP(ipAddress);
    setBlockedIPs(prev => prev.filter(ip => ip !== ipAddress));
  };

  const handleResolveEvent = (eventId: string) => {
    // This would update the event in the database
    setSecurityEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, resolved: true } : event
    ));
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
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days}d ${hours % 24}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="w-4 h-4" />;
      case 'high':
        return <AlertTriangle className="w-4 h-4" />;
      case 'medium':
        return <AlertCircle className="w-4 h-4" />;
      case 'low':
        return <Info className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'login_attempt':
        return <Users className="w-4 h-4" />;
      case 'failed_login':
        return <Lock className="w-4 h-4" />;
      case 'suspicious_activity':
        return <AlertTriangle className="w-4 h-4" />;
      case 'data_access':
        return <Database className="w-4 h-4" />;
      case 'system_change':
        return <Settings className="w-4 h-4" />;
      case 'security_violation':
        return <Shield className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getComplianceStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'text-green-600 bg-green-100';
      case 'partial':
        return 'text-yellow-600 bg-yellow-100';
      case 'non-compliant':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading && !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading security data...</p>
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
            <div className="w-10 h-10 bg-gradient-to-r from-red-100 to-orange-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Security Dashboard</h2>
              <p className="text-sm text-gray-500">Comprehensive security monitoring and compliance</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowComplianceModal(true)}
            >
              <FileText className="w-4 h-4 mr-2" />
              Compliance Report
            </Button>
            <Button
              variant="outline"
              onClick={loadSecurityData}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Security Status */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-600">Security Status: Active</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              Last scan: {metrics?.lastSecurityScan ? new Date(metrics.lastSecurityScan).toLocaleString() : 'Never'}
            </span>
          </div>
        </div>
      </div>

      {/* Security Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Critical Events</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.criticalEvents}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Lock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Failed Logins</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.failedLoginAttempts}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Blocked IPs</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.blockedIPs}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Compliance Score</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.complianceScore}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Events */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Security Events</h3>
          <div className="flex items-center space-x-2">
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-3">
          {securityEvents
            .filter(event => selectedSeverity === 'all' || event.severity === selectedSeverity)
            .slice(0, 10)
            .map((event) => (
            <div
              key={event.id}
              className={`border rounded-lg p-4 ${
                event.resolved ? 'border-gray-200 bg-gray-50' : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getEventTypeIcon(event.type)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        {event.type.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(event.severity)}`}>
                        {event.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {event.ipAddress} • {new Date(event.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!event.resolved && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResolveEvent(event.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Resolve
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExpandedEvent(
                      expandedEvent === event.id ? null : event.id
                    )}
                  >
                    {expandedEvent === event.id ? 
                      <ChevronDown className="w-4 h-4" /> : 
                      <ChevronRight className="w-4 h-4" />
                    }
                  </Button>
                </div>
              </div>
              
              {expandedEvent === event.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Event Details</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><strong>Type:</strong> {event.type}</p>
                        <p><strong>Severity:</strong> {event.severity}</p>
                        <p><strong>IP Address:</strong> {event.ipAddress}</p>
                        <p><strong>User Agent:</strong> {event.userAgent}</p>
                        <p><strong>Timestamp:</strong> {new Date(event.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Additional Information</h4>
                      <div className="text-sm text-gray-600">
                        <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                          {JSON.stringify(event.details, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Blocked IPs */}
      {blockedIPs.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Blocked IP Addresses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blockedIPs.map((ip) => (
              <div key={ip} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-red-600" />
                  <span className="font-mono text-sm text-gray-900">{ip}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUnblockIP(ip)}
                >
                  <Unlock className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Sessions */}
      {activeSessions.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Sessions</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activeSessions.map((session) => (
                  <tr key={session.sessionId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {session.userId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {session.ipAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(session.lastActivity).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDuration(Date.now() - new Date(session.lastActivity).getTime())}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Compliance Reports */}
      {complianceReports.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Reports</h3>
          <div className="space-y-4">
            {complianceReports.map((report) => (
              <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <h4 className="font-medium text-gray-900">{report.type} Compliance Report</h4>
                      <p className="text-sm text-gray-600">
                        Generated: {new Date(report.lastAssessment).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplianceStatusColor(report.status)}`}>
                      {report.status.toUpperCase()}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {report.score.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compliance Report Modal */}
      {showComplianceModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Generate Compliance Report</h3>
              <Button
                variant="outline"
                onClick={() => setShowComplianceModal(false)}
              >
                Close
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Compliance Type</label>
                <select
                  value={selectedComplianceType}
                  onChange={(e) => setSelectedComplianceType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="GDPR">GDPR</option>
                  <option value="CCPA">CCPA</option>
                  <option value="SOX">SOX</option>
                  <option value="HIPAA">HIPAA</option>
                  <option value="PCI-DSS">PCI-DSS</option>
                  <option value="ISO27001">ISO27001</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowComplianceModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleGenerateComplianceReport}
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

export default SecurityDashboard;
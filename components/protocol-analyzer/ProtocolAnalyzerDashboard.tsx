'use client';

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Download, 
  Upload,
  Settings,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Zap,
  Shield,
  Database,
  FileText,
  Code,
  Network,
  Activity,
  TrendingUp,
  Target,
  Award,
  Filter,
  Search,
  RefreshCw,
  Monitor,
  Smartphone,
  Wifi,
  Signal,
  Battery,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Layers,
  MessageSquare,
  Globe,
  Server,
  Router,
  Antenna
} from 'lucide-react';

interface ProtocolSession {
  id: string;
  name: string;
  status: 'running' | 'paused' | 'stopped' | 'completed';
  startTime: Date;
  endTime?: Date;
  testCase: string;
  protocol: string;
  messages: number;
  errors: number;
  successRate: number;
  duration: number;
}

interface ProtocolStats {
  totalSessions: number;
  activeSessions: number;
  totalMessages: number;
  totalErrors: number;
  averageSuccessRate: number;
  protocols: {
    '5G NR': { sessions: number; messages: number; successRate: number };
    'LTE': { sessions: number; messages: number; successRate: number };
    '3G': { sessions: number; messages: number; successRate: number };
    '2G': { sessions: number; messages: number; successRate: number };
  };
}

const ProtocolAnalyzerDashboard: React.FC = () => {
  const [sessions, setSessions] = useState<ProtocolSession[]>([]);
  const [stats, setStats] = useState<ProtocolStats>({
    totalSessions: 0,
    activeSessions: 0,
    totalMessages: 0,
    totalErrors: 0,
    averageSuccessRate: 0,
    protocols: {
      '5G NR': { sessions: 0, messages: 0, successRate: 0 },
      'LTE': { sessions: 0, messages: 0, successRate: 0 },
      '3G': { sessions: 0, messages: 0, successRate: 0 },
      '2G': { sessions: 0, messages: 0, successRate: 0 }
    }
  });
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [filterProtocol, setFilterProtocol] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    // Mock data for protocol sessions
    const mockSessions: ProtocolSession[] = [
      {
        id: 'session-001',
        name: '5G NR Random Access Test',
        status: 'running',
        startTime: new Date(Date.now() - 300000), // 5 minutes ago
        testCase: 'TC-5G-NR-RA-001',
        protocol: '5G NR',
        messages: 1247,
        errors: 3,
        successRate: 99.76,
        duration: 300
      },
      {
        id: 'session-002',
        name: 'LTE Handover Analysis',
        status: 'completed',
        startTime: new Date(Date.now() - 1800000), // 30 minutes ago
        endTime: new Date(Date.now() - 600000), // 10 minutes ago
        testCase: 'TC-LTE-HO-002',
        protocol: 'LTE',
        messages: 2156,
        errors: 12,
        successRate: 99.44,
        duration: 1200
      },
      {
        id: 'session-003',
        name: '3G Call Setup Procedure',
        status: 'paused',
        startTime: new Date(Date.now() - 900000), // 15 minutes ago
        testCase: 'TC-3G-CS-003',
        protocol: '3G',
        messages: 892,
        errors: 1,
        successRate: 99.89,
        duration: 900
      },
      {
        id: 'session-004',
        name: '2G SMS Transmission',
        status: 'stopped',
        startTime: new Date(Date.now() - 3600000), // 1 hour ago
        endTime: new Date(Date.now() - 3300000), // 55 minutes ago
        testCase: 'TC-2G-SMS-004',
        protocol: '2G',
        messages: 445,
        errors: 0,
        successRate: 100,
        duration: 300
      }
    ];

    setSessions(mockSessions);

    // Calculate stats
    const totalSessions = mockSessions.length;
    const activeSessions = mockSessions.filter(s => s.status === 'running' || s.status === 'paused').length;
    const totalMessages = mockSessions.reduce((sum, s) => sum + s.messages, 0);
    const totalErrors = mockSessions.reduce((sum, s) => sum + s.errors, 0);
    const averageSuccessRate = mockSessions.reduce((sum, s) => sum + s.successRate, 0) / totalSessions;

    const protocolStats = {
      '5G NR': {
        sessions: mockSessions.filter(s => s.protocol === '5G NR').length,
        messages: mockSessions.filter(s => s.protocol === '5G NR').reduce((sum, s) => sum + s.messages, 0),
        successRate: mockSessions.filter(s => s.protocol === '5G NR').reduce((sum, s) => sum + s.successRate, 0) / mockSessions.filter(s => s.protocol === '5G NR').length || 0
      },
      'LTE': {
        sessions: mockSessions.filter(s => s.protocol === 'LTE').length,
        messages: mockSessions.filter(s => s.protocol === 'LTE').reduce((sum, s) => sum + s.messages, 0),
        successRate: mockSessions.filter(s => s.protocol === 'LTE').reduce((sum, s) => sum + s.successRate, 0) / mockSessions.filter(s => s.protocol === 'LTE').length || 0
      },
      '3G': {
        sessions: mockSessions.filter(s => s.protocol === '3G').length,
        messages: mockSessions.filter(s => s.protocol === '3G').reduce((sum, s) => sum + s.messages, 0),
        successRate: mockSessions.filter(s => s.protocol === '3G').reduce((sum, s) => sum + s.successRate, 0) / mockSessions.filter(s => s.protocol === '3G').length || 0
      },
      '2G': {
        sessions: mockSessions.filter(s => s.protocol === '2G').length,
        messages: mockSessions.filter(s => s.protocol === '2G').reduce((sum, s) => sum + s.messages, 0),
        successRate: mockSessions.filter(s => s.protocol === '2G').reduce((sum, s) => sum + s.successRate, 0) / mockSessions.filter(s => s.protocol === '2G').length || 0
      }
    };

    setStats({
      totalSessions,
      activeSessions,
      totalMessages,
      totalErrors,
      averageSuccessRate,
      protocols: protocolStats
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800 border-green-200';
      case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'stopped': return 'bg-red-100 text-red-800 border-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProtocolIcon = (protocol: string) => {
    switch (protocol) {
      case '5G NR': return <Antenna className="w-4 h-4" />;
      case 'LTE': return <Wifi className="w-4 h-4" />;
      case '3G': return <Signal className="w-4 h-4" />;
      case '2G': return <Network className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesProtocol = filterProtocol === 'all' || session.protocol === filterProtocol;
    const matchesStatus = filterStatus === 'all' || session.status === filterStatus;
    return matchesProtocol && matchesStatus;
  });

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Protocol Analyzer Dashboard</h1>
          <p className="text-gray-600">Monitor and analyze protocol communications in real-time</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsCreatingSession(true)}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Play className="w-4 h-4 mr-2" />
            New Session
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Monitor className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSessions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Sessions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeSessions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMessages.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageSuccessRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Protocol Statistics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Protocol Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(stats.protocols).map(([protocol, data]) => (
            <div key={protocol} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getProtocolIcon(protocol)}
                  <span className="font-medium text-gray-900">{protocol}</span>
                </div>
                <span className="text-sm text-gray-600">{data.sessions} sessions</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Messages</span>
                  <span className="font-medium">{data.messages.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-medium text-green-600">{data.successRate.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterProtocol}
              onChange={(e) => setFilterProtocol(e.target.value)}
              className="text-sm border border-gray-300 rounded px-3 py-1"
            >
              <option value="all">All Protocols</option>
              <option value="5G NR">5G NR</option>
              <option value="LTE">LTE</option>
              <option value="3G">3G</option>
              <option value="2G">2G</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-sm border border-gray-300 rounded px-3 py-1"
            >
              <option value="all">All Status</option>
              <option value="running">Running</option>
              <option value="paused">Paused</option>
              <option value="stopped">Stopped</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search sessions..."
              className="text-sm border border-gray-300 rounded px-3 py-1 w-48"
            />
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Protocol Sessions</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                selectedSession === session.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
              onClick={() => setSelectedSession(session.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getProtocolIcon(session.protocol)}
                    <div>
                      <h4 className="font-semibold text-gray-900">{session.name}</h4>
                      <p className="text-sm text-gray-600">{session.testCase}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(session.status)}`}>
                    {session.status}
                  </span>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Messages</p>
                    <p className="font-semibold">{session.messages.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Errors</p>
                    <p className="font-semibold text-red-600">{session.errors}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Success Rate</p>
                    <p className="font-semibold text-green-600">{session.successRate.toFixed(1)}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-semibold">{formatDuration(session.duration)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Play className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Pause className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Square className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Session Modal */}
      {isCreatingSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Protocol Session</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Session Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter session name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Protocol</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option value="5G NR">5G NR</option>
                  <option value="LTE">LTE</option>
                  <option value="3G">3G</option>
                  <option value="2G">2G</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Test Case</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option value="TC-5G-NR-RA-001">5G NR Random Access</option>
                  <option value="TC-LTE-HO-002">LTE Handover</option>
                  <option value="TC-3G-CS-003">3G Call Setup</option>
                  <option value="TC-2G-SMS-004">2G SMS</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsCreatingSession(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsCreatingSession(false)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Create Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProtocolAnalyzerDashboard;
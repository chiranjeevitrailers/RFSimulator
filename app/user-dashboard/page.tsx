'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Activity, 
  BarChart3, 
  Settings, 
  LogOut,
  User,
  Bell,
  HelpCircle,
  Shield,
  Database,
  Monitor,
  MessageSquare,
  Layers,
  Wifi,
  Cloud,
  Play,
  Pause,
  Square,
  Eye,
  Download,
  Upload,
  RefreshCw,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Subscribed5glabx from '@/components/subscriptions/Subscribed5glabx';
import EnhancedProtocolAnalyzerDashboard from '@/components/protocol-analyzer/EnhancedProtocolAnalyzerDashboard';
import ProtocolAnalyzerViewer from '@/components/protocol-analyzer/ProtocolAnalyzerViewer';
import TestSuitesDashboard from '@/components/test-suites/TestSuitesDashboard';
import FiveGLabXPlatform from '@/components/5glabx/5GLabXPlatformBasic';

const UserDashboard: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>({
    id: 'user-1',
    email: 'user@5glabx.com',
    full_name: 'Demo User',
    role: 'user',
    subscription_tier: 'pro',
    subscription_status: 'active'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Mock user loading for static export
    setIsLoading(false);
  }, []);

  const handleSignOut = () => {
    // Mock sign out for static export
    console.log('Sign out clicked');
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-primary-600">5GLabX</h1>
              </div>
              <nav className="ml-10 flex space-x-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'overview'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Activity className="w-4 h-4 inline mr-2" />
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('simulations')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'simulations'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Play className="w-4 h-4 inline mr-2" />
                  Simulations
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'analytics'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 inline mr-2" />
                  Analytics
                </button>
                <button
                  onClick={() => setActiveTab('5glabx-platform')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === '5glabx-platform'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Monitor className="w-4 h-4 inline mr-2" />
                  5GLabX Platform
                </button>
                <button
                  onClick={() => setActiveTab('protocol-analyzer')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'protocol-analyzer'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Layers className="w-4 h-4 inline mr-2" />
                  Protocol Analyzer
                </button>
                <button
                  onClick={() => setActiveTab('advanced-analyzer')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'advanced-analyzer'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Monitor className="w-4 h-4 inline mr-2" />
                  Advanced Analyzer
                </button>
                <button
                  onClick={() => setActiveTab('test-suites')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'test-suites'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Shield className="w-4 h-4 inline mr-2" />
                  Test Suites
                </button>
                <button
                  onClick={() => setActiveTab('test-cases')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'test-cases'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Shield className="w-4 h-4 inline mr-2" />
                  Test Cases
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'settings'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Settings className="w-4 h-4 inline mr-2" />
                  Settings
                </button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <HelpCircle className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user.email}
                </span>
              </div>
              <button 
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2 inline" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user.full_name}!</h2>
              <p className="text-gray-600">Here's what's happening with your 5G simulations today.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Activity className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Active Simulations</p>
                    <p className="text-2xl font-semibold text-gray-900">3</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Completed Today</p>
                    <p className="text-2xl font-semibold text-gray-900">12</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Success Rate</p>
                    <p className="text-2xl font-semibold text-gray-900">94.2%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Avg. Duration</p>
                    <p className="text-2xl font-semibold text-gray-900">2.3m</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">5G NR Random Access simulation completed successfully</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">LTE Attach Procedure simulation started</p>
                    <p className="text-xs text-gray-500">5 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">IMS SIP Registration simulation in progress</p>
                    <p className="text-xs text-gray-500">8 minutes ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'simulations' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Simulations</h2>
              <button className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                <Plus className="w-4 h-4 mr-2" />
                New Simulation
              </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search simulations..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>
              </div>
            </div>

            {/* Simulations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  id: 1,
                  name: '5G NR Random Access',
                  status: 'running',
                  progress: 65,
                  duration: '2m 30s',
                  category: '5G NR'
                },
                {
                  id: 2,
                  name: 'LTE Attach Procedure',
                  status: 'completed',
                  progress: 100,
                  duration: '1m 45s',
                  category: '4G LTE'
                },
                {
                  id: 3,
                  name: 'IMS SIP Registration',
                  status: 'pending',
                  progress: 0,
                  duration: '0s',
                  category: 'IMS'
                }
              ].map((simulation) => (
                <div key={simulation.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{simulation.name}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      simulation.status === 'running' ? 'bg-blue-100 text-blue-800' :
                      simulation.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {simulation.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{simulation.category}</p>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{simulation.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full" 
                        style={{ width: `${simulation.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {simulation.duration}
                    </span>
                    <div className="flex space-x-2">
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-gray-600">Analytics dashboard coming soon...</p>
            </div>
          </div>
        )}

        {activeTab === '5glabx-platform' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">5GLabX Platform</h2>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Platform Online</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-[800px]">
                <FiveGLabXPlatform />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'protocol-analyzer' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">5GLabX Protocol Analyzer Dashboard</h2>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Analyzer Online</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional 5GLabX Protocol Analyzer</h3>
                <EnhancedProtocolAnalyzerDashboard />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'advanced-analyzer' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Advanced Protocol Analyzer</h2>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Professional Analyzer Online</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional QXDM/Keysight-like Protocol Analyzer</h3>
                <ProtocolAnalyzerViewer 
                  executionId="exec-001"
                  testCaseId="TC-5G-NR-RA-001"
                  userId={user.id}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'test-suites' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Test Suites</h2>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">1000+ Test Cases Available</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Test Suite Library</h3>
                <TestSuitesDashboard />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'test-cases' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Test Cases</h2>
              <button className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                <Plus className="w-4 h-4 mr-2" />
                New Test Case
              </button>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">3GPP Test Cases</h3>
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Test Case Management will be integrated here</p>
                    <p className="text-sm text-gray-500">3GPP-compliant test cases with detailed analysis</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-gray-600">Settings panel coming soon...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
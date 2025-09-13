'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Activity, 
  BarChart3, 
  Settings, 
  LogOut,
  FileText,
  Play,
  User,
  Bell,
  HelpCircle,
  Shield,
  Award,
  Database,
  Monitor,
  MessageSquare,
  Layers,
  Wifi,
  Cloud
} from 'lucide-react';
import ProtocolAnalyzerViewer from '@/components/protocol-analyzer/ProtocolAnalyzerViewer';
import ProtocolAnalyzerDashboard from '@/components/protocol-analyzer/ProtocolAnalyzerDashboard';
import LogViewer from '@/components/logs/LogViewer';
import ThreeGPPTestCaseViewer from '@/components/test-cases/ThreeGPPTestCaseViewer';
import ProfessionalTestCaseViewer from '@/components/test-cases/ProfessionalTestCaseViewer';
import DetailedTestCaseViewer from '@/components/test-cases/DetailedTestCaseViewer';
import ProtocolLayerDisplay from '@/components/protocol-layers/ProtocolLayerDisplay';
import Subscribed5glabx from '@/components/subscriptions/Subscribed5glabx';

const UserDashboard: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>({
    id: 'user-1',
    email: 'user@5glabx.com',
    full_name: 'Demo User',
    role: 'user'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('simulations');
  const [selectedExecutionId, setSelectedExecutionId] = useState<string | null>(null);
  const [protocolAnalyzerView, setProtocolAnalyzerView] = useState<'dashboard' | 'analyzer'>('dashboard');

  useEffect(() => {
    // Mock user loading for static export
    setIsLoading(false);
  }, []);

  const handleSignOut = () => {
    // Mock sign out for static export
    console.log('Sign out clicked');
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
                  onClick={() => setActiveTab('simulations')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'simulations'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Activity className="w-4 h-4 inline mr-2" />
                  Simulations
                </button>
                <button
                  onClick={() => setActiveTab('executions')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'executions'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Activity className="w-4 h-4 inline mr-2" />
                  Executions
                </button>
                <button
                  onClick={() => setActiveTab('realtime')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'realtime'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Activity className="w-4 h-4 inline mr-2" />
                  Real-Time
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
                  onClick={() => setActiveTab('api-docs')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'api-docs'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FileText className="w-4 h-4 inline mr-2" />
                  API Docs
                </button>
                <button
                  onClick={() => setActiveTab('api-testing')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'api-testing'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Play className="w-4 h-4 inline mr-2" />
                  API Testing
                </button>
                <button
                  onClick={() => setActiveTab('3gpp-test-cases')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === '3gpp-test-cases'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Shield className="w-4 h-4 inline mr-2" />
                  3GPP Test Cases
                </button>
            <button
              onClick={() => setActiveTab('professional-test-cases')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'professional-test-cases'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Award className="w-4 h-4 inline mr-2" />
              Professional Tests
            </button>
            <button
              onClick={() => setActiveTab('detailed-test-cases')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'detailed-test-cases'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Database className="w-4 h-4 inline mr-2" />
              Detailed Analysis
            </button>
            <button
              onClick={() => setActiveTab('protocol-analyzer')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'protocol-analyzer'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Monitor className="w-4 h-4 inline mr-2" />
              Protocol Analyzer
            </button>
            <button
              onClick={() => setActiveTab('log-viewer')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'log-viewer'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Log Viewer
            </button>
            <button
              onClick={() => setActiveTab('protocol-layers')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'protocol-layers'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Layers className="w-4 h-4 inline mr-2" />
              Protocol Layers
            </button>
            <button
              onClick={() => setActiveTab('equipment')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'equipment'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Wifi className="w-4 h-4 inline mr-2" />
              Equipment
            </button>
            <button
              onClick={() => setActiveTab('5glab-services')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === '5glab-services'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Cloud className="w-4 h-4 inline mr-2" />
              5GLAB Services
            </button>
                <button
                  onClick={() => setActiveTab('monitoring')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'monitoring'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Activity className="w-4 h-4 inline mr-2" />
                  Monitoring
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
        {activeTab === 'simulations' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Simulation Dashboard</h3>
            <p className="text-gray-600">Simulation dashboard coming soon...</p>
          </div>
        )}
        
        {activeTab === 'executions' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Execution Dashboard</h3>
            <p className="text-gray-600">Test execution dashboard coming soon...</p>
          </div>
        )}
        
        {activeTab === 'realtime' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-Time Simulation View</h3>
            <p className="text-gray-600">Real-time simulation view coming soon...</p>
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Dashboard</h3>
            <p className="text-gray-600">Analytics dashboard coming soon...</p>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Monitor</h3>
            <p className="text-gray-600">Performance monitor coming soon...</p>
          </div>
        )}
        
        {activeTab === 'api-docs' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">API Documentation</h3>
            <p className="text-gray-600">API documentation coming soon...</p>
          </div>
        )}
        
        {activeTab === 'api-testing' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">API Testing Interface</h3>
            <p className="text-gray-600">API testing interface coming soon...</p>
          </div>
        )}
        
        {activeTab === 'monitoring' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monitoring Dashboard</h3>
            <p className="text-gray-600">Monitoring dashboard coming soon...</p>
          </div>
        )}
        
        {activeTab === '3gpp-test-cases' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">3GPP Test Cases</h3>
              <Subscribed5glabx>
                <ThreeGPPTestCaseViewer 
                  userId={user.id}
                  apiBase="/api/5glabx"
                />
              </Subscribed5glabx>
            </div>
          </div>
        )}
        
            {activeTab === 'professional-test-cases' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Test Cases</h3>
                  <Subscribed5glabx>
                    <ProfessionalTestCaseViewer 
                      userId={user.id}
                      apiBase="/api/5glabx"
                    />
                  </Subscribed5glabx>
                </div>
              </div>
            )}

            {activeTab === 'detailed-test-cases' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Test Cases</h3>
                  <Subscribed5glabx>
                    <DetailedTestCaseViewer 
                      userId={user.id}
                      apiBase="/api/5glabx"
                    />
                  </Subscribed5glabx>
                </div>
              </div>
            )}

            {activeTab === 'protocol-analyzer' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {protocolAnalyzerView === 'dashboard' ? (
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Protocol Analyzer</h3>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setProtocolAnalyzerView('dashboard')}
                          className={`px-3 py-1 rounded-lg text-sm font-medium ${
                            protocolAnalyzerView === 'dashboard'
                              ? 'bg-primary-100 text-primary-700'
                              : 'text-gray-600 hover:text-gray-700'
                          }`}
                        >
                          Dashboard
                        </button>
                        <button
                          onClick={() => setProtocolAnalyzerView('analyzer')}
                          className={`px-3 py-1 rounded-lg text-sm font-medium ${
                            protocolAnalyzerView === 'analyzer'
                              ? 'bg-primary-100 text-primary-700'
                              : 'text-gray-600 hover:text-gray-700'
                          }`}
                        >
                          Live Analyzer
                        </button>
                      </div>
                    </div>
                    <Subscribed5glabx>
                      <ProtocolAnalyzerDashboard 
                        userId={user.id}
                        apiBase="/api/5glabx"
                      />
                    </Subscribed5glabx>
                  </div>
                ) : (
                  <div>
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Live Protocol Analyzer</h3>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setProtocolAnalyzerView('dashboard')}
                            className={`px-3 py-1 rounded-lg text-sm font-medium ${
                              protocolAnalyzerView === 'dashboard'
                                ? 'bg-primary-100 text-primary-700'
                                : 'text-gray-600 hover:text-gray-700'
                            }`}
                          >
                            Dashboard
                          </button>
                          <button
                            onClick={() => setProtocolAnalyzerView('analyzer')}
                            className={`px-3 py-1 rounded-lg text-sm font-medium ${
                              protocolAnalyzerView === 'analyzer'
                                ? 'bg-primary-100 text-primary-700'
                                : 'text-gray-600 hover:text-gray-700'
                            }`}
                          >
                            Live Analyzer
                          </button>
                        </div>
                      </div>
                    </div>
                    <Subscribed5glabx>
                      <ProtocolAnalyzerViewer 
                        executionId="exec-001"
                        testCaseId="tc-5g-nr-random-access"
                        userId={user.id}
                        apiBase="/api/5glabx"
                      />
                    </Subscribed5glabx>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'log-viewer' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">5GLabX Platform</h3>
                  <Subscribed5glabx iframeSrc="/5glabx/simple.html" />
                </div>
              </div>
            )}

            {activeTab === 'protocol-layers' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Protocol Layers</h3>
                  <Subscribed5glabx>
                    <ProtocolLayerDisplay 
                      userId={user.id}
                      apiBase="/api/5glabx"
                    />
                  </Subscribed5glabx>
                </div>
              </div>
            )}
      </main>
    </div>
  );
};

export default UserDashboard;
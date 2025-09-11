'use client';

import React, { useEffect, useState } from 'react';
import AuthGuard from '@/components/auth/AuthGuard';
import UserMenu from '@/components/auth/UserMenu';
import { auth } from '@/lib/auth';
import { 
  Play, 
  Pause, 
  Settings, 
  BarChart3, 
  FileText, 
  Zap,
  Network,
  Cpu,
  Shield,
  Globe,
  Users,
  Clock
} from 'lucide-react';

interface TestCase {
  id: string;
  name: string;
  category: string;
  description: string;
  protocol_version: string;
  complexity: string;
  duration_ms: number;
}

interface User {
  id: string;
  email: string;
  profile?: {
    first_name?: string;
    last_name?: string;
    role?: string;
  };
}

const UserDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = await auth.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Mock test cases data
  useEffect(() => {
    const mockTestCases: TestCase[] = [
      {
        id: '1',
        name: '5G NR Initial Access - RRC Setup Request',
        category: '5G_NR_RRC',
        description: 'UE performs initial access and sends RRC Setup Request',
        protocol_version: '5G NR',
        complexity: 'medium',
        duration_ms: 30000,
      },
      {
        id: '2',
        name: 'LTE Attach Procedure',
        category: '4G_LTE_NAS',
        description: 'UE performs initial attach procedure in LTE',
        protocol_version: '4G LTE',
        complexity: 'medium',
        duration_ms: 45000,
      },
      {
        id: '3',
        name: 'IMS SIP Registration',
        category: 'IMS_SIP',
        description: 'SIP user registers with Kamailio IMS core',
        protocol_version: 'IMS',
        complexity: 'low',
        duration_ms: 60000,
      },
    ];
    setTestCases(mockTestCases);
  }, []);

  const handleStartTest = (testCase: TestCase) => {
    setSelectedTestCase(testCase);
    setIsRunning(true);
    // Simulate test execution
    setTimeout(() => {
      setIsRunning(false);
    }, testCase.duration_ms);
  };

  const handleStopTest = () => {
    setIsRunning(false);
    setSelectedTestCase(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard requireAuth={true} redirectTo="/login">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">5G</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">5GLabX</span>
                </div>
                <div className="hidden md:block text-sm text-gray-500">
                  Protocol Simulator
                </div>
              </div>
              
              {user && <UserMenu user={user} />}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.profile?.first_name || 'User'}!
            </h1>
            <p className="text-gray-600">
              Select a test case to start your protocol analysis session.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Network className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">1000+</div>
                  <div className="text-sm text-gray-600">Test Cases</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">7</div>
                  <div className="text-sm text-gray-600">Protocols</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">24/7</div>
                  <div className="text-sm text-gray-600">Access</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">10K+</div>
                  <div className="text-sm text-gray-600">Users</div>
                </div>
              </div>
            </div>
          </div>

          {/* Test Cases Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testCases.map((testCase) => (
              <div key={testCase.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {testCase.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {testCase.description}
                    </p>
                  </div>
                  <div className="ml-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      testCase.complexity === 'low' ? 'bg-green-100 text-green-800' :
                      testCase.complexity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {testCase.complexity}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{testCase.protocol_version}</span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {Math.round(testCase.duration_ms / 1000)}s
                  </span>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleStartTest(testCase)}
                    disabled={isRunning}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {isRunning && selectedTestCase?.id === testCase.id ? 'Running...' : 'Start Test'}
                  </button>
                  
                  {isRunning && selectedTestCase?.id === testCase.id && (
                    <button
                      onClick={handleStopTest}
                      className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                    >
                      <Pause className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <BarChart3 className="w-6 h-6 text-primary-600 mr-3" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">View Analytics</div>
                  <div className="text-sm text-gray-600">Check your test results</div>
                </div>
              </button>
              
              <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <FileText className="w-6 h-6 text-primary-600 mr-3" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">Export Reports</div>
                  <div className="text-sm text-gray-600">Download test reports</div>
                </div>
              </button>
              
              <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <Settings className="w-6 h-6 text-primary-600 mr-3" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">Settings</div>
                  <div className="text-sm text-gray-600">Configure preferences</div>
                </div>
              </button>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
};

export default UserDashboard;
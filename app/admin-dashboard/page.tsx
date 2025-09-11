'use client';

import React, { useState, useEffect } from 'react';
import AuthGuard from '@/components/auth/AuthGuard';
import UserMenu from '@/components/auth/UserMenu';
import UserManagement from '@/components/admin/UserManagement';
import SystemAnalytics from '@/components/admin/SystemAnalytics';
import TestCaseManagement from '@/components/admin/TestCaseManagement';
import SecurityDashboard from '@/components/security/SecurityDashboard';
import MonitoringDashboard from '@/components/monitoring/MonitoringDashboard';
import AlertManagement from '@/components/monitoring/AlertManagement';
import BackupDashboard from '@/components/backup/BackupDashboard';
import LoadTestingDashboard from '@/components/load-testing/LoadTestingDashboard';
import DeploymentDashboard from '@/components/deployment/DeploymentDashboard';
import { auth } from '@/lib/auth';
import { 
  Users, 
  BarChart3, 
  FileText, 
  Settings, 
  Shield,
  Activity,
  Monitor, // Added
  AlertTriangle, // Added
  Database, // Added
  Zap, // Added
  Rocket, // Added
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Database,
  Server,
  Cpu,
  HardDrive,
  Wifi
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  profile?: {
    first_name?: string;
    last_name?: string;
    role?: string;
    company?: string;
  };
  created_at: string;
  last_sign_in_at?: string;
  is_active?: boolean;
}

interface TestCase {
  id: string;
  name: string;
  category: string;
  description: string;
  protocol_version: string;
  complexity: string;
  duration_ms: number;
  layers: any;
  message_flow: any[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  uptime: number;
  activeConnections: number;
  totalRequests: number;
  errorRate: number;
}

interface UserActivity {
  date: string;
  activeUsers: number;
  newUsers: number;
  testExecutions: number;
}

const AdminDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  // Mock system metrics
  const [systemMetrics] = useState<SystemMetrics>({
    cpu: 45,
    memory: 68,
    disk: 75,
    network: 32,
    uptime: 86400 * 7 + 3600 * 12, // 7 days 12 hours
    activeConnections: 1247,
    totalRequests: 45678,
    errorRate: 0.8,
  });

  // Mock user activity data
  const [userActivity] = useState<UserActivity[]>([
    { date: '2024-01-15', activeUsers: 45, newUsers: 3, testExecutions: 120 },
    { date: '2024-01-16', activeUsers: 52, newUsers: 5, testExecutions: 145 },
    { date: '2024-01-17', activeUsers: 48, newUsers: 2, testExecutions: 98 },
    { date: '2024-01-18', activeUsers: 61, newUsers: 7, testExecutions: 167 },
    { date: '2024-01-19', activeUsers: 55, newUsers: 4, testExecutions: 134 },
    { date: '2024-01-20', activeUsers: 58, newUsers: 6, testExecutions: 156 },
    { date: '2024-01-21', activeUsers: 49, newUsers: 3, testExecutions: 112 },
  ]);

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const currentUser = await auth.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }

        // Mock data for demonstration
        const mockUsers: User[] = [
          {
            id: '1',
            email: 'john.doe@example.com',
            profile: {
              first_name: 'John',
              last_name: 'Doe',
              role: 'user',
              company: 'Tech Corp',
            },
            created_at: '2024-01-15T10:30:00Z',
            last_sign_in_at: '2024-01-20T14:22:00Z',
            is_active: true,
          },
          {
            id: '2',
            email: 'jane.smith@example.com',
            profile: {
              first_name: 'Jane',
              last_name: 'Smith',
              role: 'user',
              company: 'Network Solutions',
            },
            created_at: '2024-01-10T09:15:00Z',
            last_sign_in_at: '2024-01-19T16:45:00Z',
            is_active: true,
          },
          {
            id: '3',
            email: 'mike.wilson@example.com',
            profile: {
              first_name: 'Mike',
              last_name: 'Wilson',
              role: 'user',
              company: '5G Labs',
            },
            created_at: '2024-01-08T11:20:00Z',
            last_sign_in_at: '2024-01-18T12:30:00Z',
            is_active: false,
          },
          {
            id: '4',
            email: 'sarah.chen@example.com',
            profile: {
              first_name: 'Sarah',
              last_name: 'Chen',
              role: 'admin',
              company: '5GLabX',
            },
            created_at: '2024-01-05T08:00:00Z',
            last_sign_in_at: '2024-01-21T09:15:00Z',
            is_active: true,
          },
        ];

        const mockTestCases: TestCase[] = [
          {
            id: '1',
            name: '5G NR Initial Access - RRC Setup Request',
            category: '5G_NR_RRC',
            description: 'UE performs initial access and sends RRC Setup Request',
            protocol_version: '5G NR',
            complexity: 'medium',
            duration_ms: 30000,
            layers: {},
            message_flow: [],
            is_active: true,
            created_at: '2024-01-15T10:30:00Z',
            updated_at: '2024-01-15T10:30:00Z',
          },
          {
            id: '2',
            name: 'LTE Attach Procedure',
            category: '4G_LTE_NAS',
            description: 'UE performs initial attach procedure in LTE',
            protocol_version: '4G LTE',
            complexity: 'medium',
            duration_ms: 45000,
            layers: {},
            message_flow: [],
            is_active: true,
            created_at: '2024-01-10T09:15:00Z',
            updated_at: '2024-01-10T09:15:00Z',
          },
          {
            id: '3',
            name: 'IMS SIP Registration',
            category: 'IMS_SIP',
            description: 'SIP user registers with Kamailio IMS core',
            protocol_version: 'IMS',
            complexity: 'low',
            duration_ms: 60000,
            layers: {},
            message_flow: [],
            is_active: true,
            created_at: '2024-01-08T11:20:00Z',
            updated_at: '2024-01-08T11:20:00Z',
          },
          {
            id: '4',
            name: 'O-RAN E2 Interface Test',
            category: 'O_RAN',
            description: 'Test O-RAN E2 interface communication',
            protocol_version: 'O-RAN',
            complexity: 'high',
            duration_ms: 90000,
            layers: {},
            message_flow: [],
            is_active: false,
            created_at: '2024-01-05T08:00:00Z',
            updated_at: '2024-01-05T08:00:00Z',
          },
        ];

        setUsers(mockUsers);
        setTestCases(mockTestCases);
      } catch (error) {
        console.error('Error loading admin data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAdminData();
  }, []);

  const handleUserUpdate = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  const handleUserDelete = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const handleUserCreate = (newUser: Partial<User>) => {
    const user: User = {
      id: Date.now().toString(),
      email: newUser.email || '',
      profile: newUser.profile,
      created_at: new Date().toISOString(),
      is_active: true,
    };
    setUsers(prev => [...prev, user]);
  };

  const handleTestCaseUpdate = (updatedTestCase: TestCase) => {
    setTestCases(prev => prev.map(tc => tc.id === updatedTestCase.id ? updatedTestCase : tc));
  };

  const handleTestCaseDelete = (testCaseId: string) => {
    setTestCases(prev => prev.filter(tc => tc.id !== testCaseId));
  };

  const handleTestCaseCreate = (newTestCase: Partial<TestCase>) => {
    const testCase: TestCase = {
      id: Date.now().toString(),
      name: newTestCase.name || '',
      category: newTestCase.category || '',
      description: newTestCase.description || '',
      protocol_version: newTestCase.protocol_version || '',
      complexity: newTestCase.complexity || 'medium',
      duration_ms: newTestCase.duration_ms || 30000,
      layers: newTestCase.layers || {},
      message_flow: newTestCase.message_flow || [],
      is_active: newTestCase.is_active !== false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setTestCases(prev => [...prev, testCase]);
  };

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.is_active !== false).length,
    newUsersThisMonth: users.filter(u => 
      new Date(u.created_at) > new Date('2024-01-01')
    ).length,
    totalTestCases: testCases.length,
    activeTestCases: testCases.filter(tc => tc.is_active).length,
    totalTestExecutions: 1250,
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'users', name: 'Users', icon: <Users className="w-4 h-4" /> },
    { id: 'test-cases', name: 'Test Cases', icon: <FileText className="w-4 h-4" /> },
    { id: 'security', name: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'monitoring', name: 'Monitoring', icon: <Monitor className="w-4 h-4" /> }, // Added
    { id: 'alerts', name: 'Alerts', icon: <AlertTriangle className="w-4 h-4" /> }, // Added
    { id: 'backup', name: 'Backup', icon: <Database className="w-4 h-4" /> }, // Added
    { id: 'load-testing', name: 'Load Testing', icon: <Zap className="w-4 h-4" /> }, // Added
    { id: 'deployment', name: 'Deployment', icon: <Rocket className="w-4 h-4" /> }, // Added
    { id: 'analytics', name: 'Analytics', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'settings', name: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard requireAuth={true} requireAdmin={true} redirectTo="/login">
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
                  Admin Dashboard
                </div>
              </div>
              
              {user && <UserMenu user={user} />}
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="mb-8">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Welcome Section */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome back, {user?.profile?.first_name || 'Admin'}!
                </h1>
                <p className="text-gray-600">
                  Here's what's happening with your platform today.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
                      <div className="text-sm text-gray-600">Total Users</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Activity className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-2xl font-bold text-gray-900">{stats.activeUsers}</div>
                      <div className="text-sm text-gray-600">Active Users</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-2xl font-bold text-gray-900">{stats.totalTestCases}</div>
                      <div className="text-sm text-gray-600">Test Cases</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-2xl font-bold text-gray-900">{stats.totalTestExecutions}</div>
                      <div className="text-sm text-gray-600">Test Executions</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Status */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Server className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-600">Server Status</span>
                      </div>
                      <span className="flex items-center text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Online
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Database className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-600">Database</span>
                      </div>
                      <span className="flex items-center text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Healthy
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Wifi className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-600">API Endpoints</span>
                      </div>
                      <span className="flex items-center text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Operational
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-600">Uptime</span>
                      </div>
                      <span className="text-sm text-gray-900">7d 12h</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">CPU Usage</span>
                      <span className="text-sm font-medium text-gray-900">{systemMetrics.cpu}%</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Memory Usage</span>
                      <span className="text-sm font-medium text-gray-900">{systemMetrics.memory}%</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Disk Usage</span>
                      <span className="text-sm font-medium text-gray-900">{systemMetrics.disk}%</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Error Rate</span>
                      <span className="text-sm font-medium text-green-600">{systemMetrics.errorRate}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">New user registration: jane.smith@example.com</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Activity className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Test execution completed: 5G NR Initial Access</p>
                      <p className="text-xs text-gray-500">4 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">System maintenance scheduled for tonight</p>
                      <p className="text-xs text-gray-500">6 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <UserManagement
              users={users}
              onUserUpdate={handleUserUpdate}
              onUserDelete={handleUserDelete}
              onUserCreate={handleUserCreate}
            />
          )}

          {activeTab === 'test-cases' && (
            <TestCaseManagement
              testCases={testCases}
              onTestCaseUpdate={handleTestCaseUpdate}
              onTestCaseDelete={handleTestCaseDelete}
              onTestCaseCreate={handleTestCaseCreate}
            />
          )}
          
        {activeTab === 'security' && (
          <SecurityDashboard userId={user.id} />
        )}

        {activeTab === 'monitoring' && (
          <MonitoringDashboard userId={user.id} />
        )}

        {activeTab === 'alerts' && (
          <AlertManagement userId={user.id} />
        )}

        {activeTab === 'backup' && (
          <BackupDashboard userId={user.id} />
        )}

        {activeTab === 'load-testing' && (
          <LoadTestingDashboard userId={user.id} />
        )}

        {activeTab === 'deployment' && (
          <DeploymentDashboard userId={user.id} />
        )}

          {activeTab === 'analytics' && (
            <SystemAnalytics
              metrics={systemMetrics}
              userActivity={userActivity}
            />
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
              <p className="text-gray-600">Settings panel coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
};

export default AdminDashboard;
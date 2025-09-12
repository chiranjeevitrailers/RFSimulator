'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import RouteGuard from '@/components/auth/RouteGuard';
import {
  SubscriptionTab,
  SimulationsTab,
  ExecutionsTab,
  RealTimeTab,
  AnalyticsTab,
  APIDocsTab,
  APITestingTab,
  ThreeGPPTestCasesTab,
  ProfessionalTestCasesTab,
  DetailedTestCasesTab,
  ProtocolAnalyzerTab,
  LogViewerTab,
  ProtocolLayersTab,
  MonitoringTab,
  SettingsTab
} from '@/components/dashboard/DashboardTabs';
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
  CreditCard,
  Crown,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Globe,
  Server,
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  Router,
  Switch,
  Smartphone,
  Wifi,
  Signal,
  Battery,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Download,
  Upload,
  RefreshCw,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  Copy,
  Share,
  ExternalLink,
  Maximize2,
  Minimize2,
  Pause,
  Square,
  RotateCcw,
  Code,
  TrendingUp,
  Target,
  Info,
  AlertTriangle,
  CheckCircle2,
  XCircle2,
  AlertCircle,
  Calendar,
  Save,
  Send,
  FileText as FileTextIcon,
  BookOpen,
  Terminal,
  Command,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ChevronLeft
} from 'lucide-react';

const UserDashboard: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('simulations');
  const [selectedExecutionId, setSelectedExecutionId] = useState<string | null>(null);

  const handleSignOut = () => {
    logout();
  };


  return (
    <RouteGuard requireAuth={true} requireAdmin={false}>
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
                  onClick={() => setActiveTab('subscription')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'subscription'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Crown className="w-4 h-4 inline mr-2" />
                  Subscription
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
        {activeTab === 'simulations' && <SimulationsTab />}
        {activeTab === 'executions' && <ExecutionsTab />}
        {activeTab === 'realtime' && <RealTimeTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
        {activeTab === 'api-docs' && <APIDocsTab />}
        {activeTab === 'api-testing' && <APITestingTab />}
        {activeTab === '3gpp-test-cases' && <ThreeGPPTestCasesTab />}
        {activeTab === 'professional-test-cases' && <ProfessionalTestCasesTab />}
        {activeTab === 'detailed-test-cases' && <DetailedTestCasesTab />}
        {activeTab === 'protocol-analyzer' && <ProtocolAnalyzerTab />}
        {activeTab === 'log-viewer' && <LogViewerTab />}
        {activeTab === 'protocol-layers' && <ProtocolLayersTab />}
        {activeTab === 'monitoring' && <MonitoringTab />}
        {activeTab === 'subscription' && <SubscriptionTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </main>
      </div>
    </RouteGuard>
  );
};

export default UserDashboard;
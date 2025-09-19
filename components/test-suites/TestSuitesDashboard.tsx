'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Filter, 
  Search, 
  Download, 
  Upload,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  Settings,
  Calendar,
  Users,
  Zap,
  Target,
  Award,
  Activity,
  TrendingUp,
  FileText,
  Database,
  Network,
  Shield,
  Layers,
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
  MessageSquare,
  Globe,
  Server,
  Router,
  Antenna,
  RefreshCw,
  Plus,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Star,
  Bookmark,
  Share2,
  Copy,
  Edit,
  Trash2,
  Archive,
  Tag,
  Hash,
  Calendar as CalendarIcon,
  Timer,
  CheckSquare,
  Square as SquareIcon,
  Phone,
  Car,
  Satellite
} from 'lucide-react';
import TestSuitesList from './TestSuitesList';
import TestSuiteFilters from './TestSuiteFilters';
import TestExecutionModal from './TestExecutionModal';
import TestResultsViewer from './TestResultsViewer';
import TestScheduler from './TestScheduler';

interface TestCase {
  id: string;
  test_case_id: string;
  name: string;
  description: string;
  category: string;
  protocol: string;
  complexity: string;
  test_type: string;
  duration_minutes: number;
  tags: string[];
  protocol_layers: string[];
  is_premium: boolean;
  is_featured: boolean;
  created_at: string;
}

interface TestRun {
  run_id: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  current_test?: string;
  start_time: string;
  estimated_completion?: string;
  results: {
    total_tests: number;
    completed_tests: number;
    passed_tests: number;
    failed_tests: number;
    success_rate: number;
  };
}

interface TestSuitesStats {
  total_tests: number;
  available_tests: number;
  premium_tests: number;
  protocols: {
    '5G_NR': number;
    '4G_LTE': number;
    'IMS_SIP': number;
    'O_RAN': number;
    'NB_IoT': number;
    'V2X': number;
    'NTN': number;
    'GCF': number;
    'PTCRB': number;
  };
  test_types: {
    functional: number;
    performance: number;
    stability: number;
    stress: number;
    interoperability: number;
    security: number;
    mobility: number;
    conformance: number;
  };
  recent_runs: number;
  success_rate: number;
}

const TestSuitesDashboard: React.FC = () => {
  const [tests, setTests] = useState<TestCase[]>([]);
  const [stats, setStats] = useState<TestSuitesStats>({
    total_tests: 0,
    available_tests: 0,
    premium_tests: 0,
    protocols: {
      '5G_NR': 0,
      '4G_LTE': 0,
      'IMS_SIP': 0,
      'O_RAN': 0,
      'NB_IoT': 0,
      'V2X': 0,
      'NTN': 0,
      'GCF': 0,
      'PTCRB': 0
    },
    test_types: {
      functional: 0,
      performance: 0,
      stability: 0,
      stress: 0,
      interoperability: 0,
      security: 0,
      mobility: 0,
      conformance: 0
    },
    recent_runs: 0,
    success_rate: 0
  });
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [activeRun, setActiveRun] = useState<TestRun | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'list' | 'execution' | 'results' | 'scheduler'>('list');
  const [filters, setFilters] = useState({
    protocol: 'all',
    test_type: 'all',
    complexity: 'all',
    search: '',
    tags: [] as string[],
    is_premium: false
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0
  });

  // Load test cases and stats
  const loadTests = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.protocol !== 'all' && { protocol: filters.protocol }),
        ...(filters.test_type !== 'all' && { test_type: filters.test_type }),
        ...(filters.complexity !== 'all' && { complexity: filters.complexity }),
        ...(filters.search && { search: filters.search }),
        ...(filters.tags.length > 0 && { tags: filters.tags.join(',') }),
        ...(filters.is_premium && { is_premium: 'true' })
      });

      const response = await fetch(`/api/tests?${params}`);
      const data = await response.json();
      
      setTests(data.tests || []);
      setPagination(data.pagination || pagination);
    } catch (error) {
      console.error('Failed to load tests:', error);
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  // Load stats
  const loadStats = useCallback(async () => {
    try {
      const response = await fetch('/api/tests/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }, []);

  // Load active run
  const loadActiveRun = useCallback(async () => {
    try {
      const response = await fetch('/api/tests/runs/active');
      if (response.ok) {
        const data = await response.json();
        setActiveRun(data);
      }
    } catch (error) {
      console.error('Failed to load active run:', error);
    }
  }, []);

  useEffect(() => {
    loadTests();
    loadStats();
    loadActiveRun();
  }, [loadTests, loadStats, loadActiveRun]);

  // Poll for active run updates
  useEffect(() => {
    if (activeRun && activeRun.status === 'running') {
      const interval = setInterval(loadActiveRun, 2000);
      return () => clearInterval(interval);
    }
  }, [activeRun, loadActiveRun]);

  const handleTestSelection = (testId: string, selected: boolean) => {
    if (selected) {
      setSelectedTests(prev => [...prev, testId]);
    } else {
      setSelectedTests(prev => prev.filter(id => id !== testId));
    }
  };

  const handleBulkSelection = (selected: boolean) => {
    if (selected) {
      setSelectedTests(tests.map(test => test.id));
    } else {
      setSelectedTests([]);
    }
  };

  const handleRunTests = async (testIds: string[], config: any) => {
    try {
      const response = await fetch('/api/tests/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          test_ids: testIds,
          ...config
        })
      });
      
      const data = await response.json();
      setActiveRun(data);
      setCurrentView('execution');
    } catch (error) {
      console.error('Failed to run tests:', error);
    }
  };

  const getProtocolIcon = (protocol: string) => {
    switch (protocol) {
      case '5G_NR': return <Antenna className="w-4 h-4" />;
      case '4G_LTE': return <Wifi className="w-4 h-4" />;
      case 'IMS_SIP': return <Phone className="w-4 h-4" />;
      case 'O_RAN': return <Network className="w-4 h-4" />;
      case 'NB_IoT': return <Satellite className="w-4 h-4" />;
      case 'V2X': return <Car className="w-4 h-4" />;
      case 'NTN': return <Globe className="w-4 h-4" />;
      case 'GCF': return <Shield className="w-4 h-4" />;
      case 'PTCRB': return <Award className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  const getTestTypeColor = (testType: string) => {
    switch (testType) {
      case 'functional': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'performance': return 'bg-green-100 text-green-800 border-green-200';
      case 'stability': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'stress': return 'bg-red-100 text-red-800 border-red-200';
      case 'interoperability': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'security': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'mobility': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'conformance': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Test Suites</h1>
          <p className="text-gray-600">Professional 5G/4G protocol test case library with 1000+ test cases</p>
        </div>
        <div className="flex items-center space-x-3">
          {selectedTests.length > 0 && (
            <button
              onClick={() => setCurrentView('execution')}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <Play className="w-4 h-4 mr-2" />
              Run Selected ({selectedTests.length})
            </button>
          )}
          <button
            onClick={() => setCurrentView('scheduler')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Schedule
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_tests.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available Tests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.available_tests.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Premium Tests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.premium_tests.toLocaleString()}</p>
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
              <p className="text-2xl font-bold text-gray-900">{stats.success_rate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Protocol Distribution */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Protocol Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {Object.entries(stats.protocols).map(([protocol, count]) => (
            <div key={protocol} className="text-center">
              <div className="flex items-center justify-center mb-2">
                {getProtocolIcon(protocol)}
              </div>
              <div className="text-sm font-medium text-gray-900">{protocol}</div>
              <div className="text-lg font-bold text-primary-600">{count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Run Status */}
      {activeRun && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Active Test Run</h3>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                activeRun.status === 'running' ? 'bg-green-500' :
                activeRun.status === 'completed' ? 'bg-blue-500' :
                activeRun.status === 'failed' ? 'bg-red-500' :
                'bg-yellow-500'
              }`}></div>
              <span className="text-sm font-medium text-gray-600 capitalize">{activeRun.status}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{activeRun.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${activeRun.progress}%` }}
              ></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total Tests:</span>
                <span className="ml-2 font-medium">{activeRun.results.total_tests}</span>
              </div>
              <div>
                <span className="text-gray-600">Completed:</span>
                <span className="ml-2 font-medium">{activeRun.results.completed_tests}</span>
              </div>
              <div>
                <span className="text-gray-600">Passed:</span>
                <span className="ml-2 font-medium text-green-600">{activeRun.results.passed_tests}</span>
              </div>
              <div>
                <span className="text-gray-600">Failed:</span>
                <span className="ml-2 font-medium text-red-600">{activeRun.results.failed_tests}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'list', label: 'Test Cases', icon: FileText },
              { id: 'execution', label: 'Execution', icon: Play },
              { id: 'results', label: 'Results', icon: BarChart3 },
              { id: 'scheduler', label: 'Scheduler', icon: Calendar }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentView(tab.id as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  currentView === tab.id
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
          {currentView === 'list' && (
            <div className="space-y-6">
              <TestSuiteFilters 
                filters={filters}
                onFiltersChange={setFilters}
                stats={stats}
              />
              
              <TestSuitesList
                tests={tests}
                selectedTests={selectedTests}
                onTestSelection={handleTestSelection}
                onBulkSelection={handleBulkSelection}
                isLoading={isLoading}
                pagination={pagination}
                onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
                getProtocolIcon={getProtocolIcon}
                getTestTypeColor={getTestTypeColor}
                getComplexityColor={getComplexityColor}
              />
            </div>
          )}

          {currentView === 'execution' && (
            <TestExecutionModal
              selectedTests={selectedTests}
              onRunTests={handleRunTests}
              activeRun={activeRun}
            />
          )}

          {currentView === 'results' && (
            <TestResultsViewer
              activeRun={activeRun}
            />
          )}

          {currentView === 'scheduler' && (
            <TestScheduler
              tests={tests}
              onSchedule={async (schedule) => {
                // Handle scheduling
                console.log('Schedule:', schedule);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TestSuitesDashboard;
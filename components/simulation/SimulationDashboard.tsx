'use client';

import React, { useState, useEffect } from 'react';
import { SimulationManager, SimulationSession, SimulationMetrics } from '@/lib/simulation-manager';
import { TestCase, TestCaseService } from '@/lib/test-cases';
import SimulationEngine from './SimulationEngine';
import RealTimeSimulationView from './RealTimeSimulationView';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock,
  Layers,
  BarChart3,
  FileText,
  AlertTriangle,
  Users,
  Zap,
  TrendingUp,
  TrendingDown,
  Settings,
  Filter,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface SimulationDashboardProps {
  userId: string;
}

const SimulationDashboard: React.FC<SimulationDashboardProps> = ({ userId }) => {
  const [simulationManager] = useState(() => new SimulationManager());
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [sessions, setSessions] = useState<SimulationSession[]>([]);
  const [metrics, setMetrics] = useState<SimulationMetrics | null>(null);
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase | null>(null);
  const [selectedSession, setSelectedSession] = useState<SimulationSession | null>(null);
  const [viewMode, setViewMode] = useState<'standard' | 'realtime'>('standard');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterComplexity, setFilterComplexity] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);
  const [showFailed, setShowFailed] = useState(true);

  useEffect(() => {
    initializeDashboard();
  }, []);

  useEffect(() => {
    // Setup simulation manager event listeners
    simulationManager.on('simulation_created', handleSimulationCreated);
    simulationManager.on('simulation_started', handleSimulationStarted);
    simulationManager.on('simulation_completed', handleSimulationCompleted);
    simulationManager.on('simulation_failed', handleSimulationFailed);
    simulationManager.on('simulation_cancelled', handleSimulationCancelled);
    simulationManager.on('metrics_updated', handleMetricsUpdated);

    return () => {
      // Cleanup event listeners
      simulationManager.off('simulation_created', handleSimulationCreated);
      simulationManager.off('simulation_started', handleSimulationStarted);
      simulationManager.off('simulation_completed', handleSimulationCompleted);
      simulationManager.off('simulation_failed', handleSimulationFailed);
      simulationManager.off('simulation_cancelled', handleSimulationCancelled);
      simulationManager.off('metrics_updated', handleMetricsUpdated);
    };
  }, [simulationManager]);

  const initializeDashboard = async () => {
    try {
      setIsLoading(true);
      
      // Load test cases
      const testCasesData = await TestCaseService.getTestCases({ limit: 100 });
      setTestCases(testCasesData);
      
      // Load user sessions
      const userSessions = simulationManager.getUserSessions(userId);
      setSessions(userSessions);
      
      // Get initial metrics
      setMetrics(simulationManager.getMetrics());
      
    } catch (error) {
      console.error('Failed to initialize dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulationCreated = (data: { session: SimulationSession }) => {
    setSessions(prev => [...prev, data.session]);
  };

  const handleSimulationStarted = (data: { session: SimulationSession }) => {
    setSessions(prev => prev.map(session => 
      session.id === data.session.id ? data.session : session
    ));
  };

  const handleSimulationCompleted = (data: { session: SimulationSession, result: any }) => {
    setSessions(prev => prev.map(session => 
      session.id === data.session.id ? data.session : session
    ));
  };

  const handleSimulationFailed = (data: { session: SimulationSession, error: any }) => {
    setSessions(prev => prev.map(session => 
      session.id === data.session.id ? data.session : session
    ));
  };

  const handleSimulationCancelled = (data: { session: SimulationSession }) => {
    setSessions(prev => prev.map(session => 
      session.id === data.session.id ? data.session : session
    ));
  };

  const handleMetricsUpdated = (data: { metrics: SimulationMetrics }) => {
    setMetrics(data.metrics);
  };

  const startSimulation = async (testCase: TestCase) => {
    try {
      const session = await simulationManager.startSimulation(testCase, userId);
      setSelectedTestCase(testCase);
      setSelectedSession(session);
    } catch (error) {
      console.error('Failed to start simulation:', error);
    }
  };

  const stopSimulation = async (sessionId: string) => {
    try {
      await simulationManager.stopSimulation(sessionId);
    } catch (error) {
      console.error('Failed to stop simulation:', error);
    }
  };

  const pauseSimulation = async (sessionId: string) => {
    try {
      await simulationManager.pauseSimulation(sessionId);
    } catch (error) {
      console.error('Failed to pause simulation:', error);
    }
  };

  const resumeSimulation = async (sessionId: string) => {
    try {
      await simulationManager.resumeSimulation(sessionId);
    } catch (error) {
      console.error('Failed to resume simulation:', error);
    }
  };

  const getFilteredTestCases = (): TestCase[] => {
    return testCases.filter(testCase => {
      const matchesSearch = !searchTerm || 
        testCase.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testCase.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testCase.test_case_id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !filterCategory || testCase.category === filterCategory;
      const matchesComplexity = !filterComplexity || testCase.complexity === filterComplexity;
      
      return matchesSearch && matchesCategory && matchesComplexity;
    });
  };

  const getFilteredSessions = (): SimulationSession[] => {
    return sessions.filter(session => {
      if (session.status === 'completed' && !showCompleted) return false;
      if (session.status === 'failed' && !showFailed) return false;
      return true;
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Activity className="w-4 h-4 text-blue-500" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'cancelled':
        return <Square className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-blue-100 text-blue-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatDuration = (startTime: number, endTime?: number) => {
    const duration = (endTime || Date.now()) - startTime;
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading simulation dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Simulation Dashboard</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">View Mode:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === 'standard' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('standard')}
                >
                  Standard
                </Button>
                <Button
                  variant={viewMode === 'realtime' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('realtime')}
                >
                  Real-Time
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Overview */}
        {metrics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <Activity className="w-5 h-5 text-blue-600 mr-2" />
                <div>
                  <div className="text-sm font-medium text-blue-900">Active Simulations</div>
                  <div className="text-2xl font-bold text-blue-600">{metrics.activeSimulations}</div>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <div>
                  <div className="text-sm font-medium text-green-900">Success Rate</div>
                  <div className="text-2xl font-bold text-green-600">{metrics.successRate.toFixed(1)}%</div>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center">
                <BarChart3 className="w-5 h-5 text-purple-600 mr-2" />
                <div>
                  <div className="text-sm font-medium text-purple-900">Total Simulations</div>
                  <div className="text-2xl font-bold text-purple-600">{metrics.totalSimulations}</div>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-orange-600 mr-2" />
                <div>
                  <div className="text-sm font-medium text-orange-900">Avg Duration</div>
                  <div className="text-2xl font-bold text-orange-600">
                    {Math.round(metrics.averageExecutionTime / 1000)}s
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Test Cases Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Available Test Cases</h3>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search test cases..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option value="5G_NR_RRC">5G NR RRC</option>
              <option value="4G_LTE_NAS">4G LTE NAS</option>
              <option value="IMS_SIP">IMS SIP</option>
              <option value="O_RAN">O-RAN</option>
              <option value="NB_IoT">NB-IoT</option>
              <option value="V2X">V2X</option>
              <option value="NTN">NTN</option>
            </select>
            <select
              value={filterComplexity}
              onChange={(e) => setFilterComplexity(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Complexities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getFilteredTestCases().map((testCase) => (
            <div key={testCase.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900">{testCase.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  testCase.complexity === 'low' ? 'bg-green-100 text-green-800' :
                  testCase.complexity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {testCase.complexity}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{testCase.description}</p>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {testCase.protocol_version} • {testCase.category}
                </div>
                <Button
                  size="sm"
                  onClick={() => startSimulation(testCase)}
                  disabled={simulationManager.getActiveSimulations().length >= 5}
                >
                  <Play className="w-3 h-3 mr-1" />
                  Start
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Simulations */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Active Simulations</h3>
          <div className="flex items-center space-x-2">
            <label className="flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
                className="mr-2"
              />
              Show Completed
            </label>
            <label className="flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                checked={showFailed}
                onChange={(e) => setShowFailed(e.target.checked)}
                className="mr-2"
              />
              Show Failed
            </label>
          </div>
        </div>

        <div className="space-y-3">
          {getFilteredSessions().map((session) => (
            <div key={session.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(session.status)}
                  <div>
                    <h4 className="font-medium text-gray-900">{session.testCase.name}</h4>
                    <p className="text-sm text-gray-600">{session.testCase.test_case_id}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                    {session.status}
                  </span>
                  <div className="flex space-x-1">
                    {session.status === 'running' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => pauseSimulation(session.id)}
                      >
                        <Pause className="w-3 h-3" />
                      </Button>
                    )}
                    {session.status === 'paused' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => resumeSimulation(session.id)}
                      >
                        <Play className="w-3 h-3" />
                      </Button>
                    )}
                    {(session.status === 'running' || session.status === 'paused') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => stopSimulation(session.id)}
                      >
                        <Square className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div>Duration: {formatDuration(session.startTime, session.endTime)}</div>
                <div>Started: {new Date(session.startTime).toLocaleTimeString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Simulation View */}
      {selectedTestCase && selectedSession && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {selectedTestCase.name} - {viewMode === 'standard' ? 'Standard' : 'Real-Time'} View
            </h3>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedTestCase(null);
                setSelectedSession(null);
              }}
            >
              Close
            </Button>
          </div>
          
          {viewMode === 'standard' ? (
            <SimulationEngine
              testCase={selectedTestCase}
              onSimulationComplete={(result) => {
                console.log('Simulation completed:', result);
              }}
              onSimulationUpdate={(execution) => {
                console.log('Simulation updated:', execution);
              }}
            />
          ) : (
            <RealTimeSimulationView
              testCase={selectedTestCase}
              execution={selectedSession.execution}
              onSimulationComplete={(result) => {
                console.log('Real-time simulation completed:', result);
              }}
              onSimulationUpdate={(execution) => {
                console.log('Real-time simulation updated:', execution);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SimulationDashboard;
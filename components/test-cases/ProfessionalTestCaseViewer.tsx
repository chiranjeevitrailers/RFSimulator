'use client';

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Eye, 
  Download, 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Info,
  Layers,
  MessageSquare,
  BarChart3,
  Clock,
  Zap,
  Shield,
  FileText,
  Database,
  Activity,
  Network,
  Lock,
  Move,
  FileCheck,
  TrendingUp,
  Target,
  Award,
  BookOpen,
  Filter,
  Search,
  Star,
  Timer,
  Users,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { 
  TEST_CATEGORIES, 
  TEST_SUB_CATEGORIES, 
  TestCategoryManager,
  TestCategory,
  TestSubCategory 
} from '@/lib/3gpp-test-categories';
import { 
  enhanced3GPPTestGenerator, 
  ProfessionalTestCase,
  EnhancedTestCategory 
} from '@/lib/enhanced-3gpp-test-generator';

interface ProfessionalTestCaseViewerProps {
  userId: string;
}

const ProfessionalTestCaseViewer: React.FC<ProfessionalTestCaseViewerProps> = ({ userId }) => {
  const [testCases, setTestCases] = useState<ProfessionalTestCase[]>([]);
  const [selectedTestCase, setSelectedTestCase] = useState<ProfessionalTestCase | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<TestCategory | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<TestSubCategory | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'test-phases' | 'metrics' | 'analysis' | 'reporting'>('overview');
  const [filter, setFilter] = useState({
    category: 'all',
    protocol: 'all',
    complexity: 'all',
    status: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTestCases();
  }, []);

  const loadTestCases = async () => {
    try {
      // Generate comprehensive test suite for demonstration
      const protocols = ['5G_NR', '4G_LTE', 'NAS', 'IMS'];
      const layers = ['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS'];
      const complexities = ['low', 'medium', 'high', 'expert'];
      
      const generatedTestCases: ProfessionalTestCase[] = [];
      
      // Generate test cases for each category
      for (const category of TEST_CATEGORIES) {
        for (const protocol of protocols) {
          if (category.applicable_protocols.includes(protocol)) {
            for (const layer of layers) {
              if (category.applicable_layers.includes(layer)) {
                for (const complexity of complexities) {
                  if (category.complexity === complexity) {
                    try {
                      const testCase = enhanced3GPPTestGenerator.generateCategoryTestCase(
                        protocol,
                        layer,
                        category.id,
                        complexity as any
                      );
                      generatedTestCases.push(testCase);
                    } catch (error) {
                      console.warn(`Failed to generate test case for ${category.id}-${protocol}-${layer}:`, error);
                    }
                  }
                }
              }
            }
          }
        }
      }
      
      setTestCases(generatedTestCases);
    } catch (error) {
      console.error('Error loading test cases:', error);
    }
  };

  const executeTestCase = async (testCase: ProfessionalTestCase) => {
    setIsExecuting(true);
    
    try {
      // Simulate test execution
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update test case with execution results
      const updatedTestCase = {
        ...testCase,
        execution_history: [
          ...(testCase.execution_history || []),
          {
            execution_id: `exec_${Date.now()}`,
            timestamp: new Date().toISOString(),
            user_id: userId,
            status: 'success',
            duration_ms: 2000,
            results: { success: true, metrics: testCase.success_metrics },
            errors: [],
            performance_metrics: testCase.success_metrics
          }
        ]
      };
      
      setTestCases(prev => prev.map(tc => 
        tc.id === testCase.id ? updatedTestCase : tc
      ));
      
      setSelectedTestCase(updatedTestCase);
    } catch (error) {
      console.error('Error executing test case:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    const icons: Record<string, any> = {
      'functional': CheckCircle,
      'performance': Zap,
      'stability': Shield,
      'stress': AlertTriangle,
      'interoperability': Network,
      'security': Lock,
      'mobility': Move,
      'conformance': FileCheck
    };
    return icons[categoryId] || FileText;
  };

  const getCategoryColor = (category: TestCategory) => {
    return {
      bg: category.bgColor,
      border: category.borderColor,
      text: category.textColor,
      icon: category.color
    };
  };

  const filteredTestCases = testCases.filter(tc => {
    if (filter.category !== 'all' && tc.test_category.category.id !== filter.category) return false;
    if (filter.protocol !== 'all' && tc.category !== filter.protocol) return false;
    if (filter.complexity !== 'all' && tc.complexity !== filter.complexity) return false;
    if (searchTerm && !tc.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const renderCategoryCard = (category: TestCategory) => {
    const Icon = getCategoryIcon(category.id);
    const colors = getCategoryColor(category);
    const categoryTestCases = testCases.filter(tc => tc.test_category.category.id === category.id);
    
    return (
      <div
        key={category.id}
        className={`${colors.bg} ${colors.border} border-2 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow`}
        onClick={() => setSelectedCategory(category)}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-${colors.icon}-100`}>
              <Icon className={`w-6 h-6 text-${colors.icon}-600`} />
            </div>
            <div>
              <h3 className={`font-semibold ${colors.text}`}>{category.name}</h3>
              <p className="text-sm text-gray-600">{categoryTestCases.length} test cases</p>
            </div>
          </div>
          <div className="text-right">
            <span className={`px-2 py-1 rounded text-xs ${colors.bg} ${colors.text}`}>
              {category.complexity}
            </span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">{category.description}</p>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="font-medium">Duration:</span>
            <span className="ml-1">{category.duration_range[0]}-{category.duration_range[1]}min</span>
          </div>
          <div>
            <span className="font-medium">Success Rate:</span>
            <span className="ml-1">{category.success_criteria.min_success_rate}%</span>
          </div>
          <div>
            <span className="font-medium">Max Latency:</span>
            <span className="ml-1">{category.success_criteria.max_latency_ms}ms</span>
          </div>
          <div>
            <span className="font-medium">Min Throughput:</span>
            <span className="ml-1">{category.success_criteria.min_throughput_mbps}Mbps</span>
          </div>
        </div>
      </div>
    );
  };

  const renderTestCaseCard = (testCase: ProfessionalTestCase) => {
    const category = testCase.test_category.category;
    const colors = getCategoryColor(category);
    const Icon = getCategoryIcon(category.id);
    const lastExecution = testCase.execution_history?.[testCase.execution_history.length - 1];
    
    return (
      <div
        key={testCase.id}
        className={`bg-white border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow ${
          selectedTestCase?.id === testCase.id ? 'ring-2 ring-blue-500' : ''
        }`}
        onClick={() => setSelectedTestCase(testCase)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-${colors.icon}-100`}>
              <Icon className={`w-5 h-5 text-${colors.icon}-600`} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{testCase.name}</h3>
              <p className="text-sm text-gray-600">{testCase.test_category.category.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded text-xs ${colors.bg} ${colors.text}`}>
              {testCase.complexity}
            </span>
            {lastExecution && (
              <div className={`w-2 h-2 rounded-full ${
                lastExecution.status === 'success' ? 'bg-green-500' : 'bg-red-500'
              }`} />
            )}
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">{testCase.description}</p>
        
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
          <div>
            <span className="font-medium">Protocol:</span>
            <span className="ml-1">{testCase.protocol_version}</span>
          </div>
          <div>
            <span className="font-medium">Test ID:</span>
            <span className="ml-1 font-mono">{testCase.test_case_id}</span>
          </div>
          <div>
            <span className="font-medium">Duration:</span>
            <span className="ml-1">{Math.floor(testCase.duration_ms / 60000)}min</span>
          </div>
          <div>
            <span className="font-medium">Executions:</span>
            <span className="ml-1">{testCase.execution_history?.length || 0}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-gray-600">
              {testCase.test_category.category.priority}/8 Priority
            </span>
          </div>
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              executeTestCase(testCase);
            }}
            disabled={isExecuting}
            className="text-xs"
          >
            {isExecuting ? <Activity className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
          </Button>
        </div>
      </div>
    );
  };

  const renderTestPhases = (testCase: ProfessionalTestCase) => {
    return (
      <div className="space-y-4">
        {testCase.test_phases.map((phase, index) => (
          <div key={phase.phase_id} className="border rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{phase.phase_name}</h3>
                  <p className="text-sm text-gray-600">{phase.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Timer className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{phase.duration_minutes}min</span>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Test Steps</h4>
              <div className="space-y-2">
                {phase.test_steps.map((step, stepIndex) => (
                  <div key={step.step_id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium">{stepIndex + 1}</span>
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium">{step.step_name}</span>
                      <p className="text-xs text-gray-600">{step.description}</p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {step.timeout_seconds}s timeout
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Expected Outcomes</h4>
              <div className="space-y-1">
                {phase.expected_outcomes.map((outcome, outcomeIndex) => (
                  <div key={outcomeIndex} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderMetrics = (testCase: ProfessionalTestCase) => {
    const metrics = testCase.success_metrics;
    
    return (
      <div className="space-y-6">
        {/* Functional Metrics */}
        <div className="border rounded-lg p-4 bg-white">
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold">Functional Metrics</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{metrics.functional_metrics.message_success_rate}%</div>
              <div className="text-sm text-gray-600">Message Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{metrics.functional_metrics.state_transition_success}%</div>
              <div className="text-sm text-gray-600">State Transition Success</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{metrics.functional_metrics.error_handling_success}%</div>
              <div className="text-sm text-gray-600">Error Handling Success</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{metrics.functional_metrics.protocol_compliance}%</div>
              <div className="text-sm text-gray-600">Protocol Compliance</div>
            </div>
          </div>
        </div>
        
        {/* Performance Metrics */}
        <div className="border rounded-lg p-4 bg-white">
          <div className="flex items-center space-x-2 mb-4">
            <Zap className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Performance Metrics</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{metrics.performance_metrics.throughput_mbps} Mbps</div>
              <div className="text-sm text-gray-600">Throughput</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{metrics.performance_metrics.latency_ms} ms</div>
              <div className="text-sm text-gray-600">Latency</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{metrics.performance_metrics.resource_utilization}%</div>
              <div className="text-sm text-gray-600">Resource Utilization</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{metrics.performance_metrics.efficiency_percentage}%</div>
              <div className="text-sm text-gray-600">Efficiency</div>
            </div>
          </div>
        </div>
        
        {/* Stability Metrics */}
        <div className="border rounded-lg p-4 bg-white">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold">Stability Metrics</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{metrics.stability_metrics.uptime_percentage}%</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{metrics.stability_metrics.memory_stability}%</div>
              <div className="text-sm text-gray-600">Memory Stability</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{metrics.stability_metrics.error_accumulation_rate}%</div>
              <div className="text-sm text-gray-600">Error Accumulation</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{metrics.stability_metrics.performance_degradation}%</div>
              <div className="text-sm text-gray-600">Performance Degradation</div>
            </div>
          </div>
        </div>
        
        {/* Stress Metrics */}
        <div className="border rounded-lg p-4 bg-white">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold">Stress Metrics</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{metrics.stress_metrics.max_load_handled}%</div>
              <div className="text-sm text-gray-600">Max Load Handled</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{metrics.stress_metrics.degradation_threshold}%</div>
              <div className="text-sm text-gray-600">Degradation Threshold</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{metrics.stress_metrics.recovery_time_seconds}s</div>
              <div className="text-sm text-gray-600">Recovery Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{metrics.stress_metrics.error_recovery_rate}%</div>
              <div className="text-sm text-gray-600">Error Recovery Rate</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Professional 3GPP Test Cases</h1>
        <p className="text-gray-600">
          Comprehensive protocol testing with Functional, Performance, Stability, Stress, and other professional test categories
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search test cases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
        
        <select
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="all">All Categories</option>
          {TEST_CATEGORIES.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        
        <select
          value={filter.protocol}
          onChange={(e) => setFilter({ ...filter, protocol: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="all">All Protocols</option>
          <option value="5G_NR">5G NR</option>
          <option value="4G_LTE">4G LTE</option>
          <option value="NAS">NAS</option>
          <option value="IMS">IMS</option>
        </select>
        
        <select
          value={filter.complexity}
          onChange={(e) => setFilter({ ...filter, complexity: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="all">All Complexities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="expert">Expert</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-4">
            <h2 className="text-lg font-semibold mb-4">Test Categories</h2>
            <div className="space-y-3">
              {TEST_CATEGORIES.map(renderCategoryCard)}
            </div>
          </div>
        </div>

        {/* Test Cases List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Test Cases ({filteredTestCases.length})</h2>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {filteredTestCases.map(renderTestCaseCard)}
            </div>
          </div>
        </div>

        {/* Test Case Details */}
        <div className="lg:col-span-1">
          {selectedTestCase ? (
            <div className="bg-white rounded-lg border">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Test Details</h2>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900">{selectedTestCase.name}</h3>
                    <p className="text-sm text-gray-600">{selectedTestCase.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Category:</span>
                      <span className="ml-1">{selectedTestCase.test_category.category.name}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Protocol:</span>
                      <span className="ml-1">{selectedTestCase.protocol_version}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Complexity:</span>
                      <span className="ml-1">{selectedTestCase.complexity}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Duration:</span>
                      <span className="ml-1">{Math.floor(selectedTestCase.duration_ms / 60000)}min</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Test Scenarios</h4>
                    <div className="space-y-1">
                      {selectedTestCase.test_category.test_scenarios.slice(0, 3).map((scenario, index) => (
                        <div key={index} className="text-sm text-gray-600">• {scenario}</div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Performance Targets</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Success Rate:</span>
                        <span className="font-medium">{selectedTestCase.test_category.performance_targets.success_rate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Max Latency:</span>
                        <span className="font-medium">{selectedTestCase.test_category.performance_targets.max_latency_ms}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Min Throughput:</span>
                        <span className="font-medium">{selectedTestCase.test_category.performance_targets.min_throughput_mbps}Mbps</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Test Case</h3>
              <p className="text-gray-600">Choose a test case to view detailed information and execution options.</p>
            </div>
          )}
        </div>
      </div>

      {/* Detailed View Modal */}
      {selectedTestCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{selectedTestCase.name}</h2>
                  <p className="text-gray-600">{selectedTestCase.test_category.category.name} - {selectedTestCase.protocol_version}</p>
                </div>
                <button
                  onClick={() => setSelectedTestCase(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Tabs */}
              <div className="border-b mb-6">
                <nav className="flex space-x-8">
                  {[
                    { id: 'overview', name: 'Overview', icon: Info },
                    { id: 'test-phases', name: 'Test Phases', icon: Clock },
                    { id: 'metrics', name: 'Metrics', icon: BarChart3 },
                    { id: 'analysis', name: 'Analysis', icon: TrendingUp },
                    { id: 'reporting', name: 'Reporting', icon: FileText }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{tab.name}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
              
              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-3">Test Category Information</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Category:</span>
                          <span className="font-medium">{selectedTestCase.test_category.category.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Complexity:</span>
                          <span className="font-medium">{selectedTestCase.test_category.category.complexity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration Range:</span>
                          <span className="font-medium">{selectedTestCase.test_category.category.duration_range[0]}-{selectedTestCase.test_category.category.duration_range[1]}min</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Priority:</span>
                          <span className="font-medium">{selectedTestCase.test_category.category.priority}/8</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-3">Success Criteria</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Min Success Rate:</span>
                          <span className="font-medium">{selectedTestCase.test_category.category.success_criteria.min_success_rate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Max Latency:</span>
                          <span className="font-medium">{selectedTestCase.test_category.category.success_criteria.max_latency_ms}ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Min Throughput:</span>
                          <span className="font-medium">{selectedTestCase.test_category.category.success_criteria.min_throughput_mbps}Mbps</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Max Error Rate:</span>
                          <span className="font-medium">{selectedTestCase.test_category.category.success_criteria.max_error_rate}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Test Scenarios</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedTestCase.test_category.test_scenarios.map((scenario, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{scenario}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'test-phases' && renderTestPhases(selectedTestCase)}
              {activeTab === 'metrics' && renderMetrics(selectedTestCase)}
              {activeTab === 'analysis' && (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Analysis View</h3>
                  <p className="text-gray-600">Detailed analysis and insights will be displayed here.</p>
                </div>
              )}
              {activeTab === 'reporting' && (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Reporting View</h3>
                  <p className="text-gray-600">Test reports and documentation will be displayed here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfessionalTestCaseViewer;
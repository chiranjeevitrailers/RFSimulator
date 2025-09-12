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
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { enhancedTestCaseManager, EnhancedTestCase, TestCaseExecutionResult } from '@/lib/enhanced-test-case-manager';

interface ThreeGPPTestCaseViewerProps {
  userId: string;
}

const ThreeGPPTestCaseViewer: React.FC<ThreeGPPTestCaseViewerProps> = ({ userId }) => {
  const [testCases, setTestCases] = useState<EnhancedTestCase[]>([]);
  const [selectedTestCase, setSelectedTestCase] = useState<EnhancedTestCase | null>(null);
  const [executionResult, setExecutionResult] = useState<TestCaseExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'message-flow' | 'layer-stats' | 'compliance' | 'execution'>('overview');
  const [filter, setFilter] = useState({
    category: 'all',
    complexity: 'all',
    compliance: 'all'
  });

  useEffect(() => {
    loadTestCases();
  }, []);

  const loadTestCases = async () => {
    try {
      // Load 3GPP compliant test cases
      const { data, error } = await supabase
        .from('enhanced_test_cases')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const loadedTestCases = data.map((tc: any) => ({
        id: tc.id,
        name: tc.name,
        category: tc.category,
        description: tc.description,
        protocol_version: tc.protocol_version,
        test_case_id: tc.test_case_id,
        complexity: tc.complexity,
        message_flow: tc.message_flow,
        layers: tc.layers,
        compliance: tc.compliance,
        expected_results: tc.expected_results,
        performance_metrics: tc.performance_metrics,
        unique_data: tc.unique_data,
        execution_history: tc.execution_history || [],
        performance_baseline: tc.performance_baseline || {},
        validation_results: tc.validation_results || {},
        layer_statistics: tc.layer_statistics || []
      }));

      setTestCases(loadedTestCases);
    } catch (error) {
      console.error('Error loading test cases:', error);
    }
  };

  const executeTestCase = async (testCase: EnhancedTestCase) => {
    setIsExecuting(true);
    setExecutionResult(null);

    try {
      const result = await enhancedTestCaseManager.executeTestCase(testCase.id, userId);
      setExecutionResult(result);
      
      if (result.status === 'success') {
        setActiveTab('execution');
      }
    } catch (error) {
      console.error('Error executing test case:', error);
      setExecutionResult({
        execution_id: 'error',
        test_case_id: testCase.id,
        status: 'failure',
        duration_ms: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const filteredTestCases = testCases.filter(tc => {
    if (filter.category !== 'all' && tc.category !== filter.category) return false;
    if (filter.complexity !== 'all' && tc.complexity !== filter.complexity) return false;
    if (filter.compliance !== 'all') {
      const isCompliant = tc.compliance?.validation === true;
      if (filter.compliance === 'compliant' && !isCompliant) return false;
      if (filter.compliance === 'non-compliant' && isCompliant) return false;
    }
    return true;
  });

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplianceStatus = (compliance: any) => {
    if (compliance?.validation === true) {
      return { status: 'compliant', color: 'text-green-600', icon: CheckCircle };
    }
    return { status: 'non-compliant', color: 'text-red-600', icon: XCircle };
  };

  const renderMessageFlow = (messageFlow: any[]) => {
    return (
      <div className="space-y-4">
        {messageFlow.map((message, index) => (
          <div key={index} className="border rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  message.direction === 'UL' ? 'bg-blue-500' : 
                  message.direction === 'DL' ? 'bg-green-500' : 'bg-purple-500'
                }`} />
                <span className="font-medium">{message.message_name}</span>
                <span className="text-sm text-gray-500">({message.layer})</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">{message.timestamp}ms</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  message.direction === 'UL' ? 'bg-blue-100 text-blue-800' : 
                  message.direction === 'DL' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                }`}>
                  {message.direction}
                </span>
              </div>
            </div>
            
            <div className="mb-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Information Elements (3GPP IEs)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(message.information_elements || {}).map(([ieName, ieValue]: [string, any]) => (
                  <div key={ieName} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <span className="font-mono text-sm">{ieName}</span>
                      <div className="text-xs text-gray-500">{ieValue.reference}</div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-sm">{JSON.stringify(ieValue.value)}</span>
                      <div className="flex items-center space-x-1">
                        {ieValue.validation.valid ? (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        ) : (
                          <XCircle className="w-3 h-3 text-red-500" />
                        )}
                        <span className="text-xs text-gray-500">
                          {ieValue.validation.valid ? 'Valid' : 'Invalid'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {message.layer_parameters && Object.keys(message.layer_parameters).length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Layer Parameters</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(message.layer_parameters).map(([key, value]) => (
                    <div key={key} className="flex justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">{key}</span>
                      <span className="text-sm font-mono">{JSON.stringify(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderLayerStatistics = (layers: any) => {
    return (
      <div className="space-y-6">
        {Object.entries(layers).map(([layerName, layerData]: [string, any]) => (
          <div key={layerName} className="border rounded-lg p-4 bg-white">
            <div className="flex items-center space-x-2 mb-4">
              <Layers className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">{layerName} Layer</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Statistics */}
              {layerData.statistics && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Statistics</h4>
                  <div className="space-y-2">
                    {Object.entries(layerData.statistics).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-sm text-gray-600">{key}</span>
                        <span className="text-sm font-mono">{JSON.stringify(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Unique Parameters */}
              {layerData.unique_parameters && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Unique Parameters</h4>
                  <div className="space-y-2">
                    {Object.entries(layerData.unique_parameters).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-sm text-gray-600">{key}</span>
                        <span className="text-sm font-mono">{JSON.stringify(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Capabilities */}
              {layerData.capabilities && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Capabilities</h4>
                  <div className="space-y-2">
                    {Object.entries(layerData.capabilities).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-sm text-gray-600">{key}</span>
                        <span className="text-sm font-mono">{JSON.stringify(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderComplianceInfo = (compliance: any) => {
    return (
      <div className="space-y-4">
        <div className="border rounded-lg p-4 bg-white">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold">3GPP Compliance</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Standard Information</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Standard</span>
                  <span className="text-sm font-mono">{compliance.standard}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Release</span>
                  <span className="text-sm font-mono">{compliance.release}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Validation</span>
                  <span className={`text-sm ${compliance.validation ? 'text-green-600' : 'text-red-600'}`}>
                    {compliance.validation ? 'Valid' : 'Invalid'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">IE Coverage</span>
                  <span className="text-sm font-mono">{compliance.ie_coverage}%</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Message Types</h4>
              <div className="space-y-1">
                {compliance.message_types?.map((msgType: string) => (
                  <div key={msgType} className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                    {msgType}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-4 bg-white">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Information Elements</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {compliance.information_elements?.map((ie: string) => (
              <div key={ie} className="text-sm font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {ie}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderExecutionResult = (result: TestCaseExecutionResult) => {
    return (
      <div className="space-y-4">
        <div className="border rounded-lg p-4 bg-white">
          <div className="flex items-center space-x-2 mb-4">
            {result.status === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            <h3 className="text-lg font-semibold">
              Execution Result - {result.status === 'success' ? 'Success' : 'Failed'}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Execution Details</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Execution ID</span>
                  <span className="text-sm font-mono">{result.execution_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Duration</span>
                  <span className="text-sm font-mono">{result.duration_ms}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`text-sm ${result.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {result.status}
                  </span>
                </div>
              </div>
            </div>
            
            {result.performance_metrics && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Performance Metrics</h4>
                <div className="space-y-2">
                  {Object.entries(result.performance_metrics).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-sm text-gray-600">{key}</span>
                      <span className="text-sm font-mono">{JSON.stringify(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {result.error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">Error</span>
              </div>
              <p className="text-sm text-red-700 mt-1">{result.error}</p>
            </div>
          )}
        </div>
        
        {result.results && (
          <div className="border rounded-lg p-4 bg-white">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Detailed Results</h4>
            <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
              {JSON.stringify(result.results, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">3GPP Compliant Test Cases</h1>
        <p className="text-gray-600">
          Professional-grade protocol testing with full 3GPP compliance, proper Information Elements, and unique data generation
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <select
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="all">All Categories</option>
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
        
        <select
          value={filter.compliance}
          onChange={(e) => setFilter({ ...filter, compliance: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="all">All Compliance</option>
          <option value="compliant">3GPP Compliant</option>
          <option value="non-compliant">Non-Compliant</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Test Cases List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Test Cases ({filteredTestCases.length})</h2>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {filteredTestCases.map((testCase) => {
                const complianceStatus = getComplianceStatus(testCase.compliance);
                const ComplianceIcon = complianceStatus.icon;
                
                return (
                  <div
                    key={testCase.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedTestCase?.id === testCase.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => setSelectedTestCase(testCase)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-sm">{testCase.name}</h3>
                      <ComplianceIcon className={`w-4 h-4 ${complianceStatus.color}`} />
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs ${getComplexityColor(testCase.complexity)}`}>
                        {testCase.complexity}
                      </span>
                      <span className="text-xs text-gray-500">{testCase.protocol_version}</span>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-2">{testCase.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-gray-500">{testCase.test_case_id}</span>
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
              })}
            </div>
          </div>
        </div>

        {/* Test Case Details */}
        <div className="lg:col-span-2">
          {selectedTestCase ? (
            <div className="bg-white rounded-lg border">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold">{selectedTestCase.name}</h2>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs ${getComplexityColor(selectedTestCase.complexity)}`}>
                      {selectedTestCase.complexity}
                    </span>
                    {(() => {
                      const complianceStatus = getComplianceStatus(selectedTestCase.compliance);
                      const ComplianceIcon = complianceStatus.icon;
                      return <ComplianceIcon className={`w-4 h-4 ${complianceStatus.color}`} />;
                    })()}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{selectedTestCase.description}</p>
                <p className="text-xs font-mono text-gray-500 mt-1">{selectedTestCase.test_case_id}</p>
              </div>

              {/* Tabs */}
              <div className="border-b">
                <nav className="flex space-x-8 px-4">
                  {[
                    { id: 'overview', name: 'Overview', icon: Info },
                    { id: 'message-flow', name: 'Message Flow', icon: MessageSquare },
                    { id: 'layer-stats', name: 'Layer Stats', icon: BarChart3 },
                    { id: 'compliance', name: '3GPP Compliance', icon: Shield },
                    { id: 'execution', name: 'Execution', icon: Play }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center space-x-1 py-4 px-1 border-b-2 font-medium text-sm ${
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
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Test Case Information</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Protocol Version</span>
                            <span className="text-sm font-mono">{selectedTestCase.protocol_version}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Complexity</span>
                            <span className="text-sm">{selectedTestCase.complexity}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">3GPP Standard</span>
                            <span className="text-sm font-mono">{selectedTestCase.compliance?.standard}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Release</span>
                            <span className="text-sm font-mono">{selectedTestCase.compliance?.release}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Performance Metrics</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Target Latency</span>
                            <span className="text-sm font-mono">{selectedTestCase.performance_metrics?.latency?.target}ms</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Target Throughput</span>
                            <span className="text-sm font-mono">{selectedTestCase.performance_metrics?.throughput?.target}Mbps</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Success Rate</span>
                            <span className="text-sm font-mono">{selectedTestCase.performance_metrics?.reliability?.success_rate}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'message-flow' && renderMessageFlow(selectedTestCase.message_flow)}
                {activeTab === 'layer-stats' && renderLayerStatistics(selectedTestCase.layers)}
                {activeTab === 'compliance' && renderComplianceInfo(selectedTestCase.compliance)}
                {activeTab === 'execution' && executionResult && renderExecutionResult(executionResult)}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Test Case</h3>
              <p className="text-gray-600">Choose a test case from the list to view its details and execute it.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThreeGPPTestCaseViewer;
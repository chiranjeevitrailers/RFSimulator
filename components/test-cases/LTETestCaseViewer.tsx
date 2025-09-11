'use client';

import React, { useState, useEffect } from 'react';
import { TestCase, TestCaseService } from '@/lib/test-cases';
import { LTETestCaseGenerator } from '@/lib/4g-lte-test-generator';
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
  Filter,
  Search,
  Download,
  Upload,
  Settings,
  Eye,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  Wifi,
  Signal
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface LTETestCaseViewerProps {
  userId: string;
}

const LTETestCaseViewer: React.FC<LTETestCaseViewerProps> = ({ userId }) => {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [filteredTestCases, setFilteredTestCases] = useState<TestCase[]>([]);
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterComplexity, setFilterComplexity] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadTestCases();
  }, []);

  useEffect(() => {
    filterTestCases();
  }, [testCases, searchTerm, filterCategory, filterComplexity, filterPriority]);

  const loadTestCases = async () => {
    try {
      setIsLoading(true);
      const data = await TestCaseService.getTestCases({
        protocol_version: '4G LTE',
        limit: 200
      });
      setTestCases(data);
    } catch (error) {
      console.error('Failed to load test cases:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterTestCases = () => {
    let filtered = testCases;

    if (searchTerm) {
      filtered = filtered.filter(testCase =>
        testCase.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testCase.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testCase.test_case_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory) {
      filtered = filtered.filter(testCase => testCase.category === filterCategory);
    }

    if (filterComplexity) {
      filtered = filtered.filter(testCase => testCase.complexity === filterComplexity);
    }

    if (filterPriority) {
      filtered = filtered.filter(testCase => testCase.priority === filterPriority);
    }

    setFilteredTestCases(filtered);
  };

  const generateTestCases = async () => {
    try {
      setIsLoading(true);
      const templates = LTETestCaseGenerator.generateAllLTETestCases();
      const testCases = templates.map(template => LTETestCaseGenerator.convertToTestCase(template));
      
      // Import test cases to database
      await TestCaseService.importTestCases(testCases);
      
      // Reload test cases
      await loadTestCases();
    } catch (error) {
      console.error('Failed to generate test cases:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (testCase: TestCase) => {
    if (testCase.is_active) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else {
      return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '4G_LTE_RRC':
        return <Activity className="w-4 h-4 text-blue-500" />;
      case '4G_LTE_NAS':
        return <FileText className="w-4 h-4 text-green-500" />;
      case '4G_LTE_PHY':
        return <BarChart3 className="w-4 h-4 text-purple-500" />;
      case '4G_LTE_MAC':
        return <Layers className="w-4 h-4 text-orange-500" />;
      default:
        return <Settings className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading 4G LTE test cases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Wifi className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">4G LTE Test Cases</h2>
              <p className="text-sm text-gray-500">Comprehensive LTE protocol test cases</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={generateTestCases}
              disabled={isLoading}
            >
              <Plus className="w-4 h-4 mr-2" />
              Generate Test Cases
            </Button>
            <Button
              variant="outline"
              onClick={loadTestCases}
              disabled={isLoading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search test cases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            <option value="4G_LTE_RRC">4G LTE RRC</option>
            <option value="4G_LTE_NAS">4G LTE NAS</option>
            <option value="4G_LTE_PHY">4G LTE PHY</option>
            <option value="4G_LTE_MAC">4G LTE MAC</option>
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
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              List
            </Button>
          </div>
        </div>
      </div>

      {/* Test Cases Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestCases.map((testCase) => (
            <div key={testCase.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(testCase.category)}
                  <div>
                    <h3 className="font-semibold text-gray-900">{testCase.name}</h3>
                    <p className="text-sm text-gray-500">{testCase.test_case_id}</p>
                  </div>
                </div>
                {getStatusIcon(testCase)}
              </div>

              <p className="text-sm text-gray-600 mb-4">{testCase.description}</p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplexityColor(testCase.complexity)}`}>
                    {testCase.complexity}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(testCase.priority)}`}>
                    {testCase.priority}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatDuration(testCase.duration_ms)}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {testCase.protocol_version} • {testCase.category}
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedTestCase(testCase);
                      setShowDetails(true);
                    }}
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Start simulation
                      console.log('Start simulation for:', testCase.name);
                    }}
                  >
                    <Play className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test Case
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Complexity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTestCases.map((testCase) => (
                  <tr key={testCase.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getCategoryIcon(testCase.category)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{testCase.name}</div>
                          <div className="text-sm text-gray-500">{testCase.test_case_id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {testCase.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplexityColor(testCase.complexity)}`}>
                        {testCase.complexity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(testCase.priority)}`}>
                        {testCase.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDuration(testCase.duration_ms)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusIcon(testCase)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedTestCase(testCase);
                            setShowDetails(true);
                          }}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Start simulation
                            console.log('Start simulation for:', testCase.name);
                          }}
                        >
                          <Play className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Test Case Details Modal */}
      {showDetails && selectedTestCase && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Wifi className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedTestCase.name}</h3>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowDetails(false)}
              >
                Close
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Test Case ID</label>
                  <p className="text-sm text-gray-900">{selectedTestCase.test_case_id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <p className="text-sm text-gray-900">{selectedTestCase.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Complexity</label>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplexityColor(selectedTestCase.complexity)}`}>
                    {selectedTestCase.complexity}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedTestCase.priority)}`}>
                    {selectedTestCase.priority}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <p className="text-sm text-gray-900">{selectedTestCase.description}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Protocol Layers</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mt-2">
                  {Object.keys(selectedTestCase.layers || {}).map((layer) => (
                    <div key={layer} className="text-center p-2 bg-gray-100 rounded">
                      <div className="text-xs font-medium text-gray-900">{layer}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Message Flow</label>
                <div className="mt-2 max-h-64 overflow-y-auto">
                  {selectedTestCase.message_flow?.map((message, index) => (
                    <div key={index} className="flex items-center space-x-3 py-2 border-b border-gray-200 last:border-b-0">
                      <div className="text-xs text-gray-500 w-16">
                        {message.timestamp}ms
                      </div>
                      <div className="text-xs text-gray-500 w-8">
                        {message.direction}
                      </div>
                      <div className="text-xs font-medium text-gray-900 flex-1">
                        {message.message}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDetails(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    // Start simulation
                    console.log('Start simulation for:', selectedTestCase.name);
                    setShowDetails(false);
                  }}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Simulation
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredTestCases.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wifi className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No test cases found</h3>
          <p className="text-gray-500 mb-4">
            {testCases.length === 0 
              ? "No 4G LTE test cases have been generated yet."
              : "No test cases match your current filters."
            }
          </p>
          {testCases.length === 0 && (
            <Button onClick={generateTestCases}>
              <Plus className="w-4 h-4 mr-2" />
              Generate Test Cases
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default LTETestCaseViewer;
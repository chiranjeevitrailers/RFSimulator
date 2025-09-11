'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Play, 
  Pause,
  Eye,
  Download,
  Upload,
  Network,
  Cpu,
  Shield,
  Globe,
  Zap,
  Users,
  Clock,
  ChevronDown,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

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

interface TestCaseManagementProps {
  testCases: TestCase[];
  onTestCaseUpdate: (testCase: TestCase) => void;
  onTestCaseDelete: (testCaseId: string) => void;
  onTestCaseCreate: (testCase: Partial<TestCase>) => void;
}

const TestCaseManagement: React.FC<TestCaseManagementProps> = ({
  testCases,
  onTestCaseUpdate,
  onTestCaseDelete,
  onTestCaseCreate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterProtocol, setFilterProtocol] = useState('all');
  const [filterComplexity, setFilterComplexity] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedTestCases, setSelectedTestCases] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTestCase, setEditingTestCase] = useState<TestCase | null>(null);
  const [viewingTestCase, setViewingTestCase] = useState<TestCase | null>(null);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: '5G_NR_RRC', label: '5G NR RRC' },
    { value: '4G_LTE_NAS', label: '4G LTE NAS' },
    { value: 'IMS_SIP', label: 'IMS SIP' },
    { value: 'O_RAN', label: 'O-RAN' },
    { value: 'NB_IoT', label: 'NB-IoT' },
    { value: 'V2X', label: 'V2X' },
    { value: 'NTN', label: 'NTN' },
  ];

  const protocols = [
    { value: 'all', label: 'All Protocols' },
    { value: '5G NR', label: '5G NR' },
    { value: '4G LTE', label: '4G LTE' },
    { value: 'IMS', label: 'IMS' },
    { value: 'O-RAN', label: 'O-RAN' },
    { value: 'NB-IoT', label: 'NB-IoT' },
    { value: 'V2X', label: 'V2X' },
    { value: 'NTN', label: 'NTN' },
  ];

  const complexities = [
    { value: 'all', label: 'All Complexities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

  // Filter and sort test cases
  const filteredTestCases = testCases
    .filter(testCase => {
      const matchesSearch = testCase.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           testCase.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filterCategory === 'all' || testCase.category === filterCategory;
      const matchesProtocol = filterProtocol === 'all' || testCase.protocol_version === filterProtocol;
      const matchesComplexity = filterComplexity === 'all' || testCase.complexity === filterComplexity;
      
      return matchesSearch && matchesCategory && matchesProtocol && matchesComplexity;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        case 'protocol':
          aValue = a.protocol_version;
          bValue = b.protocol_version;
          break;
        case 'complexity':
          const complexityOrder = { low: 1, medium: 2, high: 3 };
          aValue = complexityOrder[a.complexity as keyof typeof complexityOrder] || 0;
          bValue = complexityOrder[b.complexity as keyof typeof complexityOrder] || 0;
          break;
        case 'duration':
          aValue = a.duration_ms;
          bValue = b.duration_ms;
          break;
        default:
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSelectTestCase = (testCaseId: string) => {
    setSelectedTestCases(prev => 
      prev.includes(testCaseId) 
        ? prev.filter(id => id !== testCaseId)
        : [...prev, testCaseId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTestCases.length === filteredTestCases.length) {
      setSelectedTestCases([]);
    } else {
      setSelectedTestCases(filteredTestCases.map(testCase => testCase.id));
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedTestCases.length === 0) {
      toast.error('Please select test cases first');
      return;
    }

    switch (action) {
      case 'activate':
        selectedTestCases.forEach(testCaseId => {
          const testCase = testCases.find(tc => tc.id === testCaseId);
          if (testCase) {
            onTestCaseUpdate({ ...testCase, is_active: true });
          }
        });
        toast.success(`${selectedTestCases.length} test cases activated`);
        break;
      case 'deactivate':
        selectedTestCases.forEach(testCaseId => {
          const testCase = testCases.find(tc => tc.id === testCaseId);
          if (testCase) {
            onTestCaseUpdate({ ...testCase, is_active: false });
          }
        });
        toast.success(`${selectedTestCases.length} test cases deactivated`);
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete ${selectedTestCases.length} test cases?`)) {
          selectedTestCases.forEach(testCaseId => onTestCaseDelete(testCaseId));
          toast.success(`${selectedTestCases.length} test cases deleted`);
        }
        break;
    }
    
    setSelectedTestCases([]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.round(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  };

  const getProtocolIcon = (protocol: string) => {
    switch (protocol) {
      case '5G NR':
        return <Cpu className="w-4 h-4" />;
      case '4G LTE':
        return <Network className="w-4 h-4" />;
      case 'IMS':
        return <Shield className="w-4 h-4" />;
      case 'O-RAN':
        return <Globe className="w-4 h-4" />;
      case 'NB-IoT':
        return <Zap className="w-4 h-4" />;
      case 'V2X':
        return <Users className="w-4 h-4" />;
      case 'NTN':
        return <Globe className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Test Case Management</h2>
          <p className="text-gray-600 mt-1">
            Manage and organize protocol test cases
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Test Case
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search test cases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>

          {/* Protocol Filter */}
          <select
            value={filterProtocol}
            onChange={(e) => setFilterProtocol(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {protocols.map(protocol => (
              <option key={protocol.value} value={protocol.value}>
                {protocol.label}
              </option>
            ))}
          </select>

          {/* Complexity Filter */}
          <select
            value={filterComplexity}
            onChange={(e) => setFilterComplexity(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {complexities.map(complexity => (
              <option key={complexity.value} value={complexity.value}>
                {complexity.label}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="created_at-desc">Newest First</option>
            <option value="created_at-asc">Oldest First</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="category-asc">Category A-Z</option>
            <option value="protocol-asc">Protocol A-Z</option>
            <option value="complexity-asc">Complexity Low-High</option>
            <option value="duration-asc">Duration Short-Long</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedTestCases.length > 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-primary-900">
                {selectedTestCases.length} test case{selectedTestCases.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('activate')}
                >
                  <Play className="w-4 h-4 mr-1" />
                  Activate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('deactivate')}
                >
                  <Pause className="w-4 h-4 mr-1" />
                  Deactivate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('delete')}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
            <button
              onClick={() => setSelectedTestCases([])}
              className="text-primary-600 hover:text-primary-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Test Cases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTestCases.map((testCase) => (
          <div key={testCase.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedTestCases.includes(testCase.id)}
                  onChange={() => handleSelectTestCase(testCase.id)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <div className="flex items-center text-primary-600">
                  {getProtocolIcon(testCase.protocol_version)}
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setViewingTestCase(testCase)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setEditingTestCase(testCase)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this test case?')) {
                      onTestCaseDelete(testCase.id);
                    }
                  }}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {testCase.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {testCase.description}
              </p>
              
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatDuration(testCase.duration_ms)}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  testCase.complexity === 'low' ? 'bg-green-100 text-green-800' :
                  testCase.complexity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {testCase.complexity}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${
                  testCase.is_active ? 'bg-green-400' : 'bg-gray-400'
                }`} />
                <span className="text-xs text-gray-500">
                  {testCase.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="text-xs text-gray-400">
                {formatDate(testCase.created_at)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTestCases.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No test cases found</h3>
          <p className="text-gray-500">
            {searchTerm || filterCategory !== 'all' || filterProtocol !== 'all' || filterComplexity !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by adding your first test case'}
          </p>
        </div>
      )}

      {/* Create Test Case Modal */}
      {showCreateModal && (
        <CreateTestCaseModal
          onClose={() => setShowCreateModal(false)}
          onCreate={onTestCaseCreate}
        />
      )}

      {/* Edit Test Case Modal */}
      {editingTestCase && (
        <EditTestCaseModal
          testCase={editingTestCase}
          onClose={() => setEditingTestCase(null)}
          onUpdate={onTestCaseUpdate}
        />
      )}

      {/* View Test Case Modal */}
      {viewingTestCase && (
        <ViewTestCaseModal
          testCase={viewingTestCase}
          onClose={() => setViewingTestCase(null)}
        />
      )}
    </div>
  );
};

// Create Test Case Modal Component
const CreateTestCaseModal: React.FC<{
  onClose: () => void;
  onCreate: (testCase: Partial<TestCase>) => void;
}> = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    protocol_version: '',
    complexity: 'medium',
    duration_ms: 30000,
    is_active: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      ...formData,
      layers: {},
      message_flow: [],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Test Case</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Category</option>
                <option value="5G_NR_RRC">5G NR RRC</option>
                <option value="4G_LTE_NAS">4G LTE NAS</option>
                <option value="IMS_SIP">IMS SIP</option>
                <option value="O_RAN">O-RAN</option>
                <option value="NB_IoT">NB-IoT</option>
                <option value="V2X">V2X</option>
                <option value="NTN">NTN</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Protocol Version</label>
              <select
                required
                value={formData.protocol_version}
                onChange={(e) => setFormData({ ...formData, protocol_version: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Protocol</option>
                <option value="5G NR">5G NR</option>
                <option value="4G LTE">4G LTE</option>
                <option value="IMS">IMS</option>
                <option value="O-RAN">O-RAN</option>
                <option value="NB-IoT">NB-IoT</option>
                <option value="V2X">V2X</option>
                <option value="NTN">NTN</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Complexity</label>
              <select
                value={formData.complexity}
                onChange={(e) => setFormData({ ...formData, complexity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (ms)</label>
              <input
                type="number"
                required
                value={formData.duration_ms}
                onChange={(e) => setFormData({ ...formData, duration_ms: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
            </label>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create Test Case
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Test Case Modal Component
const EditTestCaseModal: React.FC<{
  testCase: TestCase;
  onClose: () => void;
  onUpdate: (testCase: TestCase) => void;
}> = ({ testCase, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: testCase.name,
    category: testCase.category,
    description: testCase.description,
    protocol_version: testCase.protocol_version,
    complexity: testCase.complexity,
    duration_ms: testCase.duration_ms,
    is_active: testCase.is_active,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...testCase,
      ...formData,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Test Case</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="5G_NR_RRC">5G NR RRC</option>
                <option value="4G_LTE_NAS">4G LTE NAS</option>
                <option value="IMS_SIP">IMS SIP</option>
                <option value="O_RAN">O-RAN</option>
                <option value="NB_IoT">NB-IoT</option>
                <option value="V2X">V2X</option>
                <option value="NTN">NTN</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Protocol Version</label>
              <select
                required
                value={formData.protocol_version}
                onChange={(e) => setFormData({ ...formData, protocol_version: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="5G NR">5G NR</option>
                <option value="4G LTE">4G LTE</option>
                <option value="IMS">IMS</option>
                <option value="O-RAN">O-RAN</option>
                <option value="NB-IoT">NB-IoT</option>
                <option value="V2X">V2X</option>
                <option value="NTN">NTN</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Complexity</label>
              <select
                value={formData.complexity}
                onChange={(e) => setFormData({ ...formData, complexity: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (ms)</label>
              <input
                type="number"
                required
                value={formData.duration_ms}
                onChange={(e) => setFormData({ ...formData, duration_ms: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
            </label>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Update Test Case
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// View Test Case Modal Component
const ViewTestCaseModal: React.FC<{
  testCase: TestCase;
  onClose: () => void;
}> = ({ testCase, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Test Case Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-3">Basic Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="text-sm text-gray-900">{testCase.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <p className="text-sm text-gray-900">{testCase.category}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Protocol Version</label>
                <p className="text-sm text-gray-900">{testCase.protocol_version}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Complexity</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  testCase.complexity === 'low' ? 'bg-green-100 text-green-800' :
                  testCase.complexity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {testCase.complexity}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Duration</label>
                <p className="text-sm text-gray-900">{Math.round(testCase.duration_ms / 1000)}s</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  testCase.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {testCase.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <p className="text-sm text-gray-900 mt-1">{testCase.description}</p>
            </div>
          </div>

          {/* Message Flow */}
          {testCase.message_flow && testCase.message_flow.length > 0 && (
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">Message Flow</h4>
              <div className="space-y-2">
                {testCase.message_flow.map((message, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          message.direction === 'UL' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {message.direction}
                        </span>
                        <span className="text-sm font-medium text-gray-900">{message.message}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {message.layer} • {message.timestamp}ms
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end pt-6">
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestCaseManagement;
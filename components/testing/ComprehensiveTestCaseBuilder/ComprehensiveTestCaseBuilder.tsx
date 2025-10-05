'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Settings, 
  Play, 
  Save, 
  Download, 
  Upload, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  RefreshCw,
  Zap,
  Wifi,
  Phone,
  Car,
  Satellite,
  Network,
  Shield,
  Activity,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  ChevronDown,
  ChevronRight,
  Clock,
  Target,
  BarChart3,
  Layers,
  Database,
  TestTube,
  Globe,
  Smartphone,
  Radio,
  Signal,
  Battery,
  WifiOff,
  WifiIcon,
  SignalHigh,
  SignalLow,
  SignalZero,
  SignalMedium
} from 'lucide-react';
import { comprehensiveTestCaseTemplateGenerator, ComprehensiveTestCaseTemplate } from '@/utils/ComprehensiveTestCaseTemplates';

interface ComprehensiveTestCaseBuilderProps {
  onTestCaseCreated?: (testCase: ComprehensiveTestCaseTemplate) => void;
  onTestCaseUpdated?: (testCase: ComprehensiveTestCaseTemplate) => void;
}

const ComprehensiveTestCaseBuilder: React.FC<ComprehensiveTestCaseBuilderProps> = ({ 
  onTestCaseCreated, 
  onTestCaseUpdated 
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [testCase, setTestCase] = useState<ComprehensiveTestCaseTemplate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTechnology, setFilterTechnology] = useState<string>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const availableTemplates = comprehensiveTestCaseTemplateGenerator.getAvailableTemplates();

  const technologyIcons = {
    'LTE': <Wifi className="w-4 h-4" />,
    '5G_NSA': <Zap className="w-4 h-4" />,
    '5G_SA': <Zap className="w-4 h-4" />,
    'LTE_5G': <Network className="w-4 h-4" />,
    'LTE_UMTS': <Radio className="w-4 h-4" />,
    'O_RAN': <Network className="w-4 h-4" />,
    'NB_IOT': <Activity className="w-4 h-4" />,
    'V2X': <Car className="w-4 h-4" />,
    'NTN': <Satellite className="w-4 h-4" />
  };

  const categoryIcons = {
    'CELL_SEARCH': <Search className="w-4 h-4" />,
    'DUAL_CONNECTIVITY': <Network className="w-4 h-4" />,
    'REGISTRATION': <Shield className="w-4 h-4" />,
    'PERFORMANCE': <BarChart3 className="w-4 h-4" />,
    'MOBILITY': <RefreshCw className="w-4 h-4" />,
    'O_RAN': <Settings className="w-4 h-4" />,
    'COVERAGE': <SignalHigh className="w-4 h-4" />,
    'SIDELINK': <Network className="w-4 h-4" />,
    'SATELLITE': <Satellite className="w-4 h-4" />
  };

  const priorityColors = {
    'CRITICAL': 'text-red-600 bg-red-100',
    'HIGH': 'text-orange-600 bg-orange-100',
    'MEDIUM': 'text-yellow-600 bg-yellow-100',
    'LOW': 'text-green-600 bg-green-100'
  };

  const complexityColors = {
    'SIMPLE': 'text-green-600 bg-green-100',
    'MODERATE': 'text-yellow-600 bg-yellow-100',
    'COMPLEX': 'text-orange-600 bg-orange-100',
    'VERY_COMPLEX': 'text-red-600 bg-red-100'
  };

  const technologies = ['ALL', 'LTE', '5G_NSA', '5G_SA', 'LTE_5G', 'LTE_UMTS', 'O_RAN', 'NB_IOT', 'V2X', 'NTN'];
  const categories = ['ALL', 'CELL_SEARCH', 'DUAL_CONNECTIVITY', 'REGISTRATION', 'PERFORMANCE', 'MOBILITY', 'O_RAN', 'COVERAGE', 'SIDELINK', 'SATELLITE'];
  const priorities = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

  const filteredTemplates = availableTemplates
    .map(id => comprehensiveTestCaseTemplateGenerator.getTemplate(id))
    .filter(template => {
      if (!template) return false;
      
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTechnology = filterTechnology === 'ALL' || template.technology === filterTechnology;
      const matchesCategory = filterCategory === 'ALL' || template.category === filterCategory;
      const matchesPriority = filterPriority === 'ALL' || template.priority === filterPriority;
      
      return matchesSearch && matchesTechnology && matchesCategory && matchesPriority;
    })
    .sort((a, b) => {
      if (!a || !b) return 0;
      
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'technology':
          comparison = a.technology.localeCompare(b.technology);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'priority':
          const priorityOrder = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
          comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
          break;
        case 'complexity':
          const complexityOrder = { 'VERY_COMPLEX': 4, 'COMPLEX': 3, 'MODERATE': 2, 'SIMPLE': 1 };
          comparison = complexityOrder[b.complexity] - complexityOrder[a.complexity];
          break;
        case 'duration':
          comparison = a.duration - b.duration;
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setIsGenerating(true);
    
    try {
      const generatedTestCase = comprehensiveTestCaseTemplateGenerator.generateTestCase(templateId);
      setTestCase(generatedTestCase);
      setActiveTab('edit');
    } catch (error) {
      console.error('Error generating test case:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!testCase) return;
    
    setIsSaving(true);
    try {
      const testCaseJson = JSON.stringify(testCase, null, 2);
      const blob = new Blob([testCaseJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${testCase.testCaseId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      if (onTestCaseCreated) {
        onTestCaseCreated(testCase);
      }
    } catch (error) {
      console.error('Error saving test case:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const renderTemplateBrowser = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search test cases..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Technology</label>
            <select
              value={filterTechnology}
              onChange={(e) => setFilterTechnology(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {technologies.map(tech => (
                <option key={tech} value={tech}>{tech}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {priorities.map(pri => (
                <option key={pri} value={pri}>{pri}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Name</option>
                <option value="technology">Technology</option>
                <option value="category">Category</option>
                <option value="priority">Priority</option>
                <option value="complexity">Complexity</option>
                <option value="duration">Duration</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-1 hover:bg-gray-100 rounded"
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            {filteredTemplates.length} test cases found
          </div>
        </div>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => {
          if (!template) return null;

          const techIcon = technologyIcons[template.technology as keyof typeof technologyIcons] || <Network className="w-4 h-4" />;
          const catIcon = categoryIcons[template.category as keyof typeof categoryIcons] || <Settings className="w-4 h-4" />;

          return (
            <div
              key={template.testCaseId}
              onClick={() => handleTemplateSelect(template.testCaseId)}
              className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {techIcon}
                  <span className="font-medium text-gray-900">{template.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[template.priority]}`}>
                    {template.priority}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${complexityColors[template.complexity]}`}>
                    {template.complexity}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                  {catIcon}
                  <span>{template.category}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3" />
                  <span>{template.duration}min</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderTestCaseEditor = () => {
    if (!testCase) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Edit Test Case</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Test Case ID</label>
                <input
                  type="text"
                  value={testCase.testCaseId}
                  onChange={(e) => setTestCase({...testCase, testCaseId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={testCase.name}
                  onChange={(e) => setTestCase({...testCase, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={testCase.description}
                  onChange={(e) => setTestCase({...testCase, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Technology</label>
                  <select
                    value={testCase.technology}
                    onChange={(e) => setTestCase({...testCase, technology: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="LTE">LTE</option>
                    <option value="5G_NSA">5G NSA</option>
                    <option value="5G_SA">5G SA</option>
                    <option value="LTE_5G">LTE/5G</option>
                    <option value="LTE_UMTS">LTE/UMTS</option>
                    <option value="O_RAN">O-RAN</option>
                    <option value="NB_IOT">NB-IoT</option>
                    <option value="V2X">V2X</option>
                    <option value="NTN">NTN</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={testCase.category}
                    onChange={(e) => setTestCase({...testCase, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="CELL_SEARCH">Cell Search</option>
                    <option value="DUAL_CONNECTIVITY">Dual Connectivity</option>
                    <option value="REGISTRATION">Registration</option>
                    <option value="PERFORMANCE">Performance</option>
                    <option value="MOBILITY">Mobility</option>
                    <option value="O_RAN">O-RAN</option>
                    <option value="COVERAGE">Coverage</option>
                    <option value="SIDELINK">Sidelink</option>
                    <option value="SATELLITE">Satellite</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={testCase.priority}
                    onChange={(e) => setTestCase({...testCase, priority: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Complexity</label>
                  <select
                    value={testCase.complexity}
                    onChange={(e) => setTestCase({...testCase, complexity: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="SIMPLE">Simple</option>
                    <option value="MODERATE">Moderate</option>
                    <option value="COMPLEX">Complex</option>
                    <option value="VERY_COMPLEX">Very Complex</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Test Environment */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Environment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Environment Name</label>
                <input
                  type="text"
                  value={testCase.testEnvironment.name}
                  onChange={(e) => setTestCase({
                    ...testCase,
                    testEnvironment: {...testCase.testEnvironment, name: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={testCase.testEnvironment.description}
                  onChange={(e) => setTestCase({
                    ...testCase,
                    testEnvironment: {...testCase.testEnvironment, description: e.target.value}
                  })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Network Topology</label>
                <input
                  type="text"
                  value={testCase.testEnvironment.networkTopology}
                  onChange={(e) => setTestCase({
                    ...testCase,
                    testEnvironment: {...testCase.testEnvironment, networkTopology: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">Comprehensive Test Case Builder</h1>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              1000 Test Cases
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'browse'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Browse Templates
            </button>
            <button
              onClick={() => setActiveTab('edit')}
              disabled={!testCase}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'edit'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              } ${!testCase ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Edit Test Case
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'browse' && renderTemplateBrowser()}
        {activeTab === 'edit' && renderTestCaseEditor()}
      </div>
    </div>
  );
};

export default ComprehensiveTestCaseBuilder;
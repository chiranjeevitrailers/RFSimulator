'use client';

import React, { useState } from 'react';
import { 
  Filter, 
  Search, 
  X, 
  ChevronDown, 
  ChevronUp,
  Tag,
  Hash,
  Star,
  Clock,
  Zap,
  Shield,
  Activity,
  Network,
  Wifi,
  Antenna,
  Phone,
  Car,
  Globe,
  Satellite
} from 'lucide-react';

interface Filters {
  protocol: string;
  test_type: string;
  complexity: string;
  search: string;
  tags: string[];
  is_premium: boolean;
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

interface TestSuiteFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  stats: TestSuitesStats;
}

const TestSuiteFilters: React.FC<TestSuiteFiltersProps> = ({
  filters,
  onFiltersChange,
  stats
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const protocolOptions = [
    { value: 'all', label: 'All Protocols', icon: Network, count: stats.total_tests },
    { value: '5G_NR', label: '5G NR', icon: Antenna, count: stats.protocols['5G_NR'] },
    { value: '4G_LTE', label: '4G LTE', icon: Wifi, count: stats.protocols['4G_LTE'] },
    { value: 'IMS_SIP', label: 'IMS/SIP', icon: Phone, count: stats.protocols['IMS_SIP'] },
    { value: 'O_RAN', label: 'O-RAN', icon: Network, count: stats.protocols['O_RAN'] },
    { value: 'NB_IoT', label: 'NB-IoT', icon: Satellite, count: stats.protocols['NB_IoT'] },
    { value: 'V2X', label: 'V2X', icon: Car, count: stats.protocols['V2X'] },
    { value: 'NTN', label: 'NTN', icon: Globe, count: stats.protocols['NTN'] }
  ];

  const testTypeOptions = [
    { value: 'all', label: 'All Types', icon: Activity, count: stats.total_tests },
    { value: 'functional', label: 'Functional', icon: CheckCircle, count: stats.test_types.functional },
    { value: 'performance', label: 'Performance', icon: Zap, count: stats.test_types.performance },
    { value: 'stability', label: 'Stability', icon: Shield, count: stats.test_types.stability },
    { value: 'stress', label: 'Stress', icon: AlertTriangle, count: stats.test_types.stress },
    { value: 'interoperability', label: 'Interoperability', icon: Network, count: stats.test_types.interoperability },
    { value: 'security', label: 'Security', icon: Shield, count: stats.test_types.security },
    { value: 'mobility', label: 'Mobility', icon: Activity, count: stats.test_types.mobility },
    { value: 'conformance', label: 'Conformance', icon: CheckCircle, count: stats.test_types.conformance }
  ];

  const complexityOptions = [
    { value: 'all', label: 'All Levels', count: stats.total_tests },
    { value: 'beginner', label: 'Beginner', count: Math.floor(stats.total_tests * 0.3) },
    { value: 'intermediate', label: 'Intermediate', count: Math.floor(stats.total_tests * 0.4) },
    { value: 'advanced', label: 'Advanced', count: Math.floor(stats.total_tests * 0.2) },
    { value: 'expert', label: 'Expert', count: Math.floor(stats.total_tests * 0.1) }
  ];

  const popularTags = [
    'initial_access', 'handover', 'performance', 'security', 'mobility',
    'interoperability', 'conformance', 'stress', 'stability', 'regression'
  ];

  const handleFilterChange = (key: keyof Filters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    
    handleFilterChange('tags', newTags);
  };

  const clearFilters = () => {
    onFiltersChange({
      protocol: 'all',
      test_type: 'all',
      complexity: 'all',
      search: '',
      tags: [],
      is_premium: false
    });
  };

  const hasActiveFilters = filters.protocol !== 'all' || 
    filters.test_type !== 'all' || 
    filters.complexity !== 'all' || 
    filters.search || 
    filters.tags.length > 0 || 
    filters.is_premium;

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            {hasActiveFilters && (
              <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                {[
                  filters.protocol !== 'all' && 'Protocol',
                  filters.test_type !== 'all' && 'Type',
                  filters.complexity !== 'all' && 'Complexity',
                  filters.search && 'Search',
                  filters.tags.length > 0 && 'Tags',
                  filters.is_premium && 'Premium'
                ].filter(Boolean).length} active
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-1"
              >
                <X className="w-4 h-4" />
                <span>Clear all</span>
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-1"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search test cases by name, ID, or description..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {isExpanded && (
          <div className="space-y-6">
            {/* Protocol Filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Protocol</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {protocolOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange('protocol', option.value)}
                    className={`flex items-center space-x-2 p-3 rounded-lg border text-left transition-colors ${
                      filters.protocol === option.value
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <option.icon className="w-4 h-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{option.label}</div>
                      <div className="text-xs text-gray-500">{option.count} tests</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Test Type Filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Test Type</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {testTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange('test_type', option.value)}
                    className={`flex items-center space-x-2 p-3 rounded-lg border text-left transition-colors ${
                      filters.test_type === option.value
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <option.icon className="w-4 h-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{option.label}</div>
                      <div className="text-xs text-gray-500">{option.count} tests</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Complexity Filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Complexity</h4>
              <div className="flex flex-wrap gap-2">
                {complexityOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange('complexity', option.value)}
                    className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                      filters.complexity === option.value
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {option.label}
                    <span className="ml-2 text-xs text-gray-500">({option.count})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tags Filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm transition-colors ${
                      filters.tags.includes(tag)
                        ? 'bg-primary-100 text-primary-700 border border-primary-200'
                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Premium Filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Premium Tests</h4>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filters.is_premium}
                  onChange={(e) => handleFilterChange('is_premium', e.target.checked)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Show only premium tests</span>
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-xs text-gray-500">({stats.premium_tests} tests)</span>
              </label>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{stats.total_tests.toLocaleString()}</div>
              <div className="text-gray-600">Total Tests</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{stats.available_tests.toLocaleString()}</div>
              <div className="text-gray-600">Available</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{stats.premium_tests.toLocaleString()}</div>
              <div className="text-gray-600">Premium</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{stats.success_rate.toFixed(1)}%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSuiteFilters;
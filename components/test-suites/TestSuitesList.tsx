'use client';

import React, { useState, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Eye, 
  Download, 
  Star,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Tag,
  Hash,
  Timer,
  CheckSquare,
  Square as SquareIcon,
  Filter,
  Search,
  SortAsc,
  SortDesc
} from 'lucide-react';

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

interface TestSuitesListProps {
  tests: TestCase[];
  selectedTests: string[];
  onTestSelection: (testId: string, selected: boolean) => void;
  onBulkSelection: (selected: boolean) => void;
  isLoading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  getProtocolIcon: (protocol: string) => React.ReactNode;
  getTestTypeColor: (testType: string) => string;
  getComplexityColor: (complexity: string) => string;
}

const TestSuitesList: React.FC<TestSuitesListProps> = ({
  tests,
  selectedTests,
  onTestSelection,
  onBulkSelection,
  isLoading,
  pagination,
  onPageChange,
  getProtocolIcon,
  getTestTypeColor,
  getComplexityColor
}) => {
  const [expandedTests, setExpandedTests] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'name' | 'protocol' | 'complexity' | 'duration' | 'created_at'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const sortedTests = useMemo(() => {
    return [...tests].sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'protocol':
          aValue = a.protocol;
          bValue = b.protocol;
          break;
        case 'complexity':
          const complexityOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3, 'expert': 4 };
          aValue = complexityOrder[a.complexity as keyof typeof complexityOrder] || 0;
          bValue = complexityOrder[b.complexity as keyof typeof complexityOrder] || 0;
          break;
        case 'duration':
          aValue = a.duration_minutes;
          bValue = b.duration_minutes;
          break;
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [tests, sortBy, sortOrder]);

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const toggleExpanded = (testId: string) => {
    const newExpanded = new Set(expandedTests);
    if (newExpanded.has(testId)) {
      newExpanded.delete(testId);
    } else {
      newExpanded.add(testId);
    }
    setExpandedTests(newExpanded);
  };

  const isAllSelected = tests.length > 0 && selectedTests.length === tests.length;
  const isPartiallySelected = selectedTests.length > 0 && selectedTests.length < tests.length;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-20 h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with bulk actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onBulkSelection(!isAllSelected)}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
            >
              {isAllSelected ? (
                <CheckSquare className="w-4 h-4 text-primary-600" />
              ) : isPartiallySelected ? (
                <div className="w-4 h-4 border-2 border-primary-600 rounded bg-primary-100"></div>
              ) : (
                <SquareIcon className="w-4 h-4" />
              )}
              <span>
                {isAllSelected ? 'Deselect All' : 'Select All'} ({selectedTests.length} selected)
              </span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {pagination.total.toLocaleString()} tests
            </span>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handleSort('name')}
                className={`flex items-center space-x-1 text-xs px-2 py-1 rounded ${
                  sortBy === 'name' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>Name</span>
                {sortBy === 'name' && (sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />)}
              </button>
              <button
                onClick={() => handleSort('protocol')}
                className={`flex items-center space-x-1 text-xs px-2 py-1 rounded ${
                  sortBy === 'protocol' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>Protocol</span>
                {sortBy === 'protocol' && (sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />)}
              </button>
              <button
                onClick={() => handleSort('complexity')}
                className={`flex items-center space-x-1 text-xs px-2 py-1 rounded ${
                  sortBy === 'complexity' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>Complexity</span>
                {sortBy === 'complexity' && (sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />)}
              </button>
              <button
                onClick={() => handleSort('duration')}
                className={`flex items-center space-x-1 text-xs px-2 py-1 rounded ${
                  sortBy === 'duration' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>Duration</span>
                {sortBy === 'duration' && (sortOrder === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />)}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Test Cases List */}
      <div className="space-y-2">
        {sortedTests.map((test) => {
          const isSelected = selectedTests.includes(test.id);
          const isExpanded = expandedTests.has(test.id);
          
          return (
            <div
              key={test.id}
              className={`bg-white rounded-lg border transition-all ${
                isSelected ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="p-4">
                <div className="flex items-center space-x-4">
                  {/* Selection checkbox */}
                  <button
                    onClick={() => onTestSelection(test.id, !isSelected)}
                    className="flex-shrink-0"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-primary-600" />
                    ) : (
                      <SquareIcon className="w-4 h-4 text-gray-400" />
                    )}
                  </button>

                  {/* Protocol icon */}
                  <div className="flex-shrink-0">
                    {getProtocolIcon(test.protocol)}
                  </div>

                  {/* Test info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {test.name}
                      </h3>
                      {test.is_premium && (
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      )}
                      {test.is_featured && (
                        <div className="px-1.5 py-0.5 bg-primary-100 text-primary-700 text-xs rounded">
                          Featured
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                      <span className="font-mono">{test.test_case_id}</span>
                      <span className={`px-2 py-0.5 rounded-full ${getTestTypeColor(test.test_type)}`}>
                        {test.test_type}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full ${getComplexityColor(test.complexity)}`}>
                        {test.complexity}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Timer className="w-3 h-3" />
                        <span>{test.duration_minutes}m</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleExpanded(test.id)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-700">{test.description}</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {test.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div>
                        <h4 className="text-xs font-medium text-gray-600 mb-2">Protocol Layers</h4>
                        <div className="flex flex-wrap gap-1">
                          {test.protocol_layers.map((layer) => (
                            <span
                              key={layer}
                              className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                            >
                              <Hash className="w-3 h-3 mr-1" />
                              {layer}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-600">
                        <span>Created: {new Date(test.created_at).toLocaleDateString()}</span>
                        <span>Category: {test.category}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} tests
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            
            <div className="flex items-center space-x-1">
              {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-1 text-sm border rounded ${
                      pagination.page === page
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {tests.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tests found</h3>
          <p className="text-gray-600">Try adjusting your filters or search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default TestSuitesList;
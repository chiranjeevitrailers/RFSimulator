'use client';

import React, { useState, useEffect } from 'react';
import { apiDocumentation } from '@/lib/api-documentation';
import { APIDocumentation, APIEndpoint } from '@/lib/api-client';
import { 
  BookOpen, 
  Code, 
  Download, 
  Copy, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronRight, 
  Play, 
  Eye, 
  FileText, 
  Globe, 
  Shield, 
  Zap, 
  Settings, 
  Users, 
  BarChart3, 
  Activity, 
  Database, 
  Server, 
  Network, 
  Cpu, 
  MemoryStick, 
  HardDrive, 
  Router, 
  Switch, 
  Bell, 
  Info, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Maximize2, 
  Minimize2, 
  ExternalLink, 
  Plus, 
  Edit, 
  Trash2, 
  Share, 
  RefreshCw, 
  Save, 
  Upload, 
  Monitor, 
  Smartphone, 
  Globe as GlobeIcon, 
  Shield as ShieldIcon, 
  Bell as BellIcon, 
  Info as InfoIcon, 
  AlertCircle as AlertCircleIcon
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface APIDocumentationViewerProps {
  userId: string;
}

const APIDocumentationViewer: React.FC<APIDocumentationViewerProps> = ({ userId }) => {
  const [documentation, setDocumentation] = useState<APIDocumentation | null>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [selectedMethod, setSelectedMethod] = useState('all');
  const [viewMode, setViewMode] = useState<'overview' | 'endpoints' | 'schemas' | 'examples'>('overview');
  const [expandedEndpoints, setExpandedEndpoints] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [showCodeExample, setShowCodeExample] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'javascript' | 'python' | 'curl'>('javascript');

  useEffect(() => {
    loadDocumentation();
  }, []);

  const loadDocumentation = async () => {
    try {
      setIsLoading(true);
      const doc = apiDocumentation.getDocumentation();
      setDocumentation(doc);
    } catch (error) {
      console.error('Failed to load API documentation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportDocumentation = (format: 'markdown' | 'openapi' | 'postman') => {
    try {
      let content: string;
      let filename: string;
      let mimeType: string;

      switch (format) {
        case 'markdown':
          content = apiDocumentation.generateMarkdown();
          filename = 'api-documentation.md';
          mimeType = 'text/markdown';
          break;
        case 'openapi':
          content = JSON.stringify(apiDocumentation.getOpenAPISpec(), null, 2);
          filename = 'openapi-spec.json';
          mimeType = 'application/json';
          break;
        case 'postman':
          content = JSON.stringify(apiDocumentation.getPostmanCollection(), null, 2);
          filename = 'postman-collection.json';
          mimeType = 'application/json';
          break;
        default:
          return;
      }

      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export documentation:', error);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const toggleEndpointExpansion = (endpointId: string) => {
    const newExpanded = new Set(expandedEndpoints);
    if (newExpanded.has(endpointId)) {
      newExpanded.delete(endpointId);
    } else {
      newExpanded.add(endpointId);
    }
    setExpandedEndpoints(newExpanded);
  };

  const getFilteredEndpoints = (): APIEndpoint[] => {
    if (!documentation) return [];

    return documentation.endpoints.filter(endpoint => {
      const matchesSearch = !searchQuery || 
        endpoint.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        endpoint.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTag = selectedTag === 'all' || endpoint.tags.includes(selectedTag);
      const matchesMethod = selectedMethod === 'all' || endpoint.method === selectedMethod;

      return matchesSearch && matchesTag && matchesMethod;
    });
  };

  const getUniqueTags = (): string[] => {
    if (!documentation) return [];
    const tags = new Set<string>();
    documentation.endpoints.forEach(endpoint => {
      endpoint.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-green-100 text-green-800';
      case 'POST':
        return 'bg-blue-100 text-blue-800';
      case 'PUT':
        return 'bg-yellow-100 text-yellow-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      case 'PATCH':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const generateCodeExample = (endpoint: APIEndpoint): string => {
    const baseURL = documentation?.baseURL || 'http://localhost:3000/api';
    const url = `${baseURL}${endpoint.path}`;

    switch (selectedLanguage) {
      case 'javascript':
        return `// ${endpoint.description}
const response = await fetch('${url}', {
  method: '${endpoint.method}',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  }${endpoint.requestBody ? `,
  body: JSON.stringify({
    // Request body parameters
  })` : ''}
});

const data = await response.json();
console.log(data);`;

      case 'python':
        return `# ${endpoint.description}
import requests

url = '${url}'
headers = {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
}${endpoint.requestBody ? `
data = {
    # Request body parameters
}` : ''}

response = requests.${endpoint.method.toLowerCase()}(
    url, 
    headers=headers${endpoint.requestBody ? ', json=data' : ''}
)
print(response.json())`;

      case 'curl':
        return `# ${endpoint.description}
curl -X ${endpoint.method} '${url}' \\
  -H 'Authorization: Bearer YOUR_TOKEN' \\
  -H 'Content-Type: application/json'${endpoint.requestBody ? ` \\
  -d '{
    "key": "value"
  }'` : ''}`;

      default:
        return '';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading API documentation...</p>
        </div>
      </div>
    );
  }

  if (!documentation) {
    return (
      <div className="text-center py-8">
        <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No documentation available</h3>
        <p className="text-gray-500">API documentation could not be loaded.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{documentation.title}</h2>
              <p className="text-sm text-gray-500">Version {documentation.version}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => handleExportDocumentation('markdown')}
            >
              <Download className="w-4 h-4 mr-2" />
              Markdown
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExportDocumentation('openapi')}
            >
              <Download className="w-4 h-4 mr-2" />
              OpenAPI
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExportDocumentation('postman')}
            >
              <Download className="w-4 h-4 mr-2" />
              Postman
            </Button>
          </div>
        </div>

        <p className="text-gray-600 mb-4">{documentation.description}</p>

        {/* Navigation */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setViewMode('overview')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              viewMode === 'overview'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setViewMode('endpoints')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              viewMode === 'endpoints'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Endpoints
          </button>
          <button
            onClick={() => setViewMode('schemas')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              viewMode === 'schemas'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Schemas
          </button>
          <button
            onClick={() => setViewMode('examples')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              viewMode === 'examples'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Examples
          </button>
        </div>
      </div>

      {/* Overview */}
      {viewMode === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Authentication</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">{documentation.authentication.description}</p>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">Type: {documentation.authentication.type}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Code className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">Scheme: {documentation.authentication.scheme}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate Limiting</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">
                  {documentation.rateLimiting.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              {documentation.rateLimiting.enabled && (
                <>
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">
                      {documentation.rateLimiting.limit} requests per {documentation.rateLimiting.window}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Base URL</h3>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-400" />
              <code className="text-sm bg-gray-100 px-2 py-1 rounded">{documentation.baseURL}</code>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Error Codes</h3>
            <div className="space-y-2">
              {documentation.errorCodes.slice(0, 5).map((error) => (
                <div key={error.code} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{error.code}</span>
                  <span className="text-sm text-gray-600">{error.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Endpoints */}
      {viewMode === 'endpoints' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search endpoints..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Tags</option>
                {getUniqueTags().map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Methods</option>
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>
          </div>

          {/* Endpoints List */}
          <div className="space-y-4">
            {getFilteredEndpoints().map((endpoint) => {
              const endpointId = `${endpoint.method}-${endpoint.path}`;
              const isExpanded = expandedEndpoints.has(endpointId);

              return (
                <div key={endpointId} className="bg-white rounded-lg border border-gray-200">
                  <div
                    className="p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleEndpointExpansion(endpointId)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(endpoint.method)}`}>
                          {endpoint.method}
                        </span>
                        <code className="text-sm font-mono text-gray-900">{endpoint.path}</code>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          {endpoint.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{endpoint.description}</p>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-gray-200 p-4">
                      <div className="space-y-4">
                        {/* Parameters */}
                        {endpoint.parameters && endpoint.parameters.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Parameters</h4>
                            <div className="overflow-x-auto">
                              <table className="min-w-full text-sm">
                                <thead>
                                  <tr className="border-b border-gray-200">
                                    <th className="text-left py-2">Name</th>
                                    <th className="text-left py-2">Type</th>
                                    <th className="text-left py-2">Required</th>
                                    <th className="text-left py-2">Description</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {endpoint.parameters.map((param) => (
                                    <tr key={param.name} className="border-b border-gray-100">
                                      <td className="py-2 font-mono">{param.name}</td>
                                      <td className="py-2 text-gray-600">{param.type}</td>
                                      <td className="py-2">
                                        {param.required ? (
                                          <span className="text-red-600">Yes</span>
                                        ) : (
                                          <span className="text-gray-500">No</span>
                                        )}
                                      </td>
                                      <td className="py-2 text-gray-600">{param.description}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {/* Request Body */}
                        {endpoint.requestBody && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Request Body</h4>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <pre className="text-sm text-gray-700 overflow-x-auto">
                                {JSON.stringify(endpoint.requestBody.example || {}, null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}

                        {/* Responses */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Responses</h4>
                          <div className="space-y-2">
                            {endpoint.responses.map((response) => (
                              <div key={response.statusCode} className="border border-gray-200 rounded-lg p-3">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    response.statusCode >= 200 && response.statusCode < 300
                                      ? 'bg-green-100 text-green-800'
                                      : response.statusCode >= 400
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {response.statusCode}
                                  </span>
                                  <span className="text-sm text-gray-600">{response.description}</span>
                                </div>
                                {response.example && (
                                  <div className="bg-gray-50 p-2 rounded text-sm">
                                    <pre className="text-gray-700 overflow-x-auto">
                                      {JSON.stringify(response.example, null, 2)}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Code Example */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">Code Example</h4>
                            <div className="flex items-center space-x-2">
                              <select
                                value={selectedLanguage}
                                onChange={(e) => setSelectedLanguage(e.target.value as any)}
                                className="px-2 py-1 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              >
                                <option value="javascript">JavaScript</option>
                                <option value="python">Python</option>
                                <option value="curl">cURL</option>
                              </select>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCopyCode(generateCodeExample(endpoint))}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
                            <pre className="text-sm overflow-x-auto">
                              <code>{generateCodeExample(endpoint)}</code>
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Schemas */}
      {viewMode === 'schemas' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Schemas</h3>
          <div className="space-y-4">
            {Object.entries(documentation.schemas).map(([name, schema]) => (
              <div key={name} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">{name}</h4>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <pre className="text-sm text-gray-700 overflow-x-auto">
                    {JSON.stringify(schema, null, 2)}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Examples */}
      {viewMode === 'examples' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">API Examples</h3>
          <div className="space-y-4">
            {Object.entries(documentation.examples).map(([name, example]) => (
              <div key={name} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">{name}</h4>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <pre className="text-sm text-gray-700 overflow-x-auto">
                    {JSON.stringify(example, null, 2)}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default APIDocumentationViewer;
'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { APIDocumentation } from '@/lib/api-client';
import { 
  Play, 
  Stop, 
  RefreshCw, 
  Copy, 
  Download, 
  Upload, 
  Settings, 
  Code, 
  Globe, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  FileText, 
  Send, 
  Zap, 
  Database, 
  Server, 
  Network, 
  Cpu, 
  MemoryStick, 
  HardDrive, 
  Router, 
  Switch, 
  Bell, 
  ChevronDown, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  ExternalLink, 
  Share, 
  Monitor, 
  Smartphone, 
  Globe as GlobeIcon, 
  Shield as ShieldIcon, 
  Bell as BellIcon, 
  Info as InfoIcon, 
  AlertCircle as AlertCircleIcon
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface APITestingInterfaceProps {
  userId: string;
}

interface TestRequest {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers: Record<string, string>;
  body: string;
  params: Record<string, string>;
  timestamp: Date;
}

interface TestResponse {
  id: string;
  requestId: string;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  duration: number;
  timestamp: Date;
  success: boolean;
  error?: string;
}

const APITestingInterface: React.FC<APITestingInterfaceProps> = ({ userId }) => {
  const [requests, setRequests] = useState<TestRequest[]>([]);
  const [responses, setResponses] = useState<TestResponse[]>([]);
  const [currentRequest, setCurrentRequest] = useState<TestRequest>({
    id: '',
    name: 'New Request',
    method: 'GET',
    url: '',
    headers: { 'Content-Type': 'application/json' },
    body: '',
    params: {},
    timestamp: new Date()
  });
  const [isExecuting, setIsExecuting] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [showHeaders, setShowHeaders] = useState(true);
  const [showBody, setShowBody] = useState(false);
  const [showParams, setShowParams] = useState(false);
  const [environment, setEnvironment] = useState({
    baseURL: 'http://localhost:3000/api',
    authToken: '',
    variables: {} as Record<string, string>
  });

  useEffect(() => {
    loadSavedRequests();
  }, []);

  const loadSavedRequests = () => {
    // Load saved requests from localStorage
    const saved = localStorage.getItem('api_test_requests');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setRequests(parsed);
      } catch (error) {
        console.error('Failed to load saved requests:', error);
      }
    }
  };

  const saveRequests = (requestsToSave: TestRequest[]) => {
    localStorage.setItem('api_test_requests', JSON.stringify(requestsToSave));
  };

  const handleExecuteRequest = async () => {
    if (!currentRequest.url) {
      alert('Please enter a URL');
      return;
    }

    setIsExecuting(true);
    const requestId = currentRequest.id || Date.now().toString();
    const startTime = Date.now();

    try {
      // Prepare headers
      const headers = { ...currentRequest.headers };
      if (environment.authToken) {
        headers['Authorization'] = `Bearer ${environment.authToken}`;
      }

      // Replace variables in URL and body
      let url = currentRequest.url;
      let body = currentRequest.body;
      
      Object.entries(environment.variables).forEach(([key, value]) => {
        const placeholder = `{{${key}}}`;
        url = url.replace(new RegExp(placeholder, 'g'), value);
        body = body.replace(new RegExp(placeholder, 'g'), value);
      });

      // Execute request
      const response = await fetch(url, {
        method: currentRequest.method,
        headers,
        body: currentRequest.method !== 'GET' ? body : undefined
      });

      const duration = Date.now() - startTime;
      const responseText = await response.text();
      let responseBody: any;

      try {
        responseBody = JSON.parse(responseText);
      } catch {
        responseBody = responseText;
      }

      // Create response object
      const testResponse: TestResponse = {
        id: Date.now().toString(),
        requestId,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: typeof responseBody === 'string' ? responseBody : JSON.stringify(responseBody, null, 2),
        duration,
        timestamp: new Date(),
        success: response.ok,
        error: response.ok ? undefined : responseBody.error || responseBody.message || 'Request failed'
      };

      setResponses(prev => [testResponse, ...prev]);

      // Save request if it's new
      if (!currentRequest.id) {
        const newRequest = { ...currentRequest, id: requestId, timestamp: new Date() };
        const updatedRequests = [newRequest, ...requests];
        setRequests(updatedRequests);
        saveRequests(updatedRequests);
        setCurrentRequest(newRequest);
      }

    } catch (error) {
      const duration = Date.now() - startTime;
      const testResponse: TestResponse = {
        id: Date.now().toString(),
        requestId,
        status: 0,
        statusText: 'Network Error',
        headers: {},
        body: '',
        duration,
        timestamp: new Date(),
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      setResponses(prev => [testResponse, ...prev]);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSaveRequest = () => {
    if (!currentRequest.name || !currentRequest.url) {
      alert('Please enter a name and URL');
      return;
    }

    const requestId = currentRequest.id || Date.now().toString();
    const updatedRequest = { ...currentRequest, id: requestId, timestamp: new Date() };
    
    const existingIndex = requests.findIndex(r => r.id === requestId);
    let updatedRequests: TestRequest[];

    if (existingIndex >= 0) {
      updatedRequests = [...requests];
      updatedRequests[existingIndex] = updatedRequest;
    } else {
      updatedRequests = [updatedRequest, ...requests];
    }

    setRequests(updatedRequests);
    saveRequests(updatedRequests);
    setCurrentRequest(updatedRequest);
  };

  const handleLoadRequest = (request: TestRequest) => {
    setCurrentRequest(request);
    setSelectedRequestId(request.id);
  };

  const handleDeleteRequest = (requestId: string) => {
    const updatedRequests = requests.filter(r => r.id !== requestId);
    setRequests(updatedRequests);
    saveRequests(updatedRequests);
    
    if (selectedRequestId === requestId) {
      setSelectedRequestId(null);
      setCurrentRequest({
        id: '',
        name: 'New Request',
        method: 'GET',
        url: '',
        headers: { 'Content-Type': 'application/json' },
        body: '',
        params: {},
        timestamp: new Date()
      });
    }
  };

  const handleCopyResponse = (response: TestResponse) => {
    navigator.clipboard.writeText(response.body);
  };

  const handleExportRequests = () => {
    const data = {
      requests,
      environment,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'api-requests.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportRequests = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.requests) {
          setRequests(data.requests);
          saveRequests(data.requests);
        }
        if (data.environment) {
          setEnvironment(data.environment);
        }
      } catch (error) {
        alert('Failed to import requests');
      }
    };
    reader.readAsText(file);
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-600';
    if (status >= 400 && status < 500) return 'text-yellow-600';
    if (status >= 500) return 'text-red-600';
    return 'text-gray-600';
  };

  const getStatusIcon = (status: number) => {
    if (status >= 200 && status < 300) return <CheckCircle className="w-4 h-4" />;
    if (status >= 400) return <XCircle className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">API Testing Interface</h2>
              <p className="text-sm text-gray-500">Test and debug API endpoints</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleExportRequests}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <label className="cursor-pointer">
              <Button variant="outline" as="span">
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={handleImportRequests}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Request Builder */}
        <div className="lg:col-span-2 space-y-6">
          {/* Request Configuration */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Request Builder</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={handleSaveRequest}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button
                  onClick={handleExecuteRequest}
                  disabled={isExecuting}
                >
                  {isExecuting ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  {isExecuting ? 'Executing...' : 'Send'}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Method and URL */}
              <div className="flex items-center space-x-2">
                <select
                  value={currentRequest.method}
                  onChange={(e) => setCurrentRequest({
                    ...currentRequest,
                    method: e.target.value as any
                  })}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                  <option value="PATCH">PATCH</option>
                </select>
                <input
                  type="text"
                  placeholder="Enter URL..."
                  value={currentRequest.url}
                  onChange={(e) => setCurrentRequest({
                    ...currentRequest,
                    url: e.target.value
                  })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Request Name */}
              <input
                type="text"
                placeholder="Request name..."
                value={currentRequest.name}
                onChange={(e) => setCurrentRequest({
                  ...currentRequest,
                  name: e.target.value
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />

              {/* Headers */}
              <div>
                <button
                  onClick={() => setShowHeaders(!showHeaders)}
                  className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2"
                >
                  {showHeaders ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  <span>Headers</span>
                </button>
                {showHeaders && (
                  <div className="space-y-2">
                    {Object.entries(currentRequest.headers).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <input
                          type="text"
                          placeholder="Header name"
                          value={key}
                          onChange={(e) => {
                            const newHeaders = { ...currentRequest.headers };
                            delete newHeaders[key];
                            newHeaders[e.target.value] = value;
                            setCurrentRequest({ ...currentRequest, headers: newHeaders });
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          placeholder="Header value"
                          value={value}
                          onChange={(e) => setCurrentRequest({
                            ...currentRequest,
                            headers: { ...currentRequest.headers, [key]: e.target.value }
                          })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newHeaders = { ...currentRequest.headers };
                            delete newHeaders[key];
                            setCurrentRequest({ ...currentRequest, headers: newHeaders });
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentRequest({
                        ...currentRequest,
                        headers: { ...currentRequest.headers, '': '' }
                      })}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Header
                    </Button>
                  </div>
                )}
              </div>

              {/* Body */}
              {currentRequest.method !== 'GET' && (
                <div>
                  <button
                    onClick={() => setShowBody(!showBody)}
                    className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2"
                  >
                    {showBody ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    <span>Body</span>
                  </button>
                  {showBody && (
                    <textarea
                      placeholder="Request body (JSON, XML, etc.)"
                      value={currentRequest.body}
                      onChange={(e) => setCurrentRequest({
                        ...currentRequest,
                        body: e.target.value
                      })}
                      rows={8}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono"
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Response */}
          {responses.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Response</h3>
              <div className="space-y-4">
                {responses.slice(0, 5).map((response) => (
                  <div key={response.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(response.status)}
                        <span className={`font-medium ${getStatusColor(response.status)}`}>
                          {response.status} {response.statusText}
                        </span>
                        <span className="text-sm text-gray-500">
                          {response.duration}ms
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyResponse(response)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <pre className="text-sm text-gray-700 overflow-x-auto whitespace-pre-wrap">
                        {response.body}
                      </pre>
                    </div>
                    {response.error && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                        {response.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Environment */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Environment</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base URL</label>
                <input
                  type="text"
                  value={environment.baseURL}
                  onChange={(e) => setEnvironment({
                    ...environment,
                    baseURL: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Auth Token</label>
                <input
                  type="password"
                  value={environment.authToken}
                  onChange={(e) => setEnvironment({
                    ...environment,
                    authToken: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Saved Requests */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Saved Requests</h3>
            <div className="space-y-2">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    selectedRequestId === request.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                  }`}
                  onClick={() => handleLoadRequest(request)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm text-gray-900">{request.name}</div>
                      <div className="text-xs text-gray-500">{request.method} {request.url}</div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRequest(request.id);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
              {requests.length === 0 && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No saved requests
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APITestingInterface;
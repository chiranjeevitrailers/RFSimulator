'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare,
  Clock,
  ArrowUp,
  ArrowDown,
  ArrowRightLeft,
  Eye,
  EyeOff,
  Filter,
  Search,
  ChevronDown,
  ChevronRight,
  Copy,
  Download,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Layers,
  Network,
  Shield,
  Activity,
  Signal,
  Wifi,
  Phone,
  Globe,
  Car,
  Satellite,
  BarChart3,
  TrendingUp,
  FileText,
  Database,
  Code,
  Hexagon
} from 'lucide-react';
import LayerPanel from './LayerPanel';

interface DecodedMessage {
  id: string;
  message_id: string;
  timestamp_us: number;
  timestamp_ms: number;
  protocol: string;
  message_type: string;
  message_name: string;
  message_direction: 'UL' | 'DL' | 'BIDIRECTIONAL';
  layer: string;
  sublayer?: string;
  source_entity?: string;
  target_entity?: string;
  decoded_data: any;
  information_elements: any[];
  layer_parameters: any[];
  validation_status: 'pending' | 'valid' | 'invalid' | 'warning';
  validation_errors: string[];
  validation_warnings: string[];
  standard_reference?: string;
  ie_count: number;
}

interface LayerStats {
  layer: string;
  message_count: number;
  avg_size: number;
  error_count: number;
  warning_count: number;
}

interface ProtocolStats {
  protocol: string;
  message_count: number;
  unique_message_types: number;
  avg_processing_time: number;
}

interface EnhancedMessageViewerProps {
  testRunId: string;
}

const EnhancedMessageViewer: React.FC<EnhancedMessageViewerProps> = ({ testRunId }) => {
  const [messages, setMessages] = useState<DecodedMessage[]>([]);
  const [layerStats, setLayerStats] = useState<LayerStats[]>([]);
  const [protocolStats, setProtocolStats] = useState<ProtocolStats[]>([]);
  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<DecodedMessage | null>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'tree' | 'hex'>('timeline');
  const [filters, setFilters] = useState({
    layer: 'all',
    protocol: 'all',
    direction: 'all',
    search: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    limit: 100,
    offset: 0,
    total: 0,
    hasMore: false
  });

  // Load messages and statistics
  useEffect(() => {
    loadMessages();
  }, [testRunId, filters, pagination.offset]);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        limit: pagination.limit.toString(),
        offset: pagination.offset.toString(),
        ...(filters.layer !== 'all' && { layer: filters.layer }),
        ...(filters.protocol !== 'all' && { protocol: filters.protocol }),
        ...(filters.direction !== 'all' && { direction: filters.direction })
      });

      const response = await fetch(`/api/tests/runs/${testRunId}/messages?${params}`);
      const data = await response.json();
      
      setMessages(data.messages || []);
      setLayerStats(data.statistics?.layers || []);
      setProtocolStats(data.statistics?.protocols || []);
      setPagination(prev => ({
        ...prev,
        total: data.pagination?.total || 0,
        hasMore: data.pagination?.has_more || false
      }));

      // Initialize selected layers with all layers
      if (selectedLayers.length === 0 && data.statistics?.layers) {
        setSelectedLayers(data.statistics.layers.map((stat: LayerStats) => stat.layer));
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLayerToggle = (layer: string) => {
    setSelectedLayers(prev => 
      prev.includes(layer) 
        ? prev.filter(l => l !== layer)
        : [...prev, layer]
    );
  };

  const handleSelectAllLayers = () => {
    setSelectedLayers(layerStats.map(stat => stat.layer));
  };

  const handleDeselectAllLayers = () => {
    setSelectedLayers([]);
  };

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'UL': return <ArrowUp className="w-4 h-4 text-green-600" />;
      case 'DL': return <ArrowDown className="w-4 h-4 text-blue-600" />;
      case 'BIDIRECTIONAL': return <ArrowRightLeft className="w-4 h-4 text-purple-600" />;
      default: return <ArrowRightLeft className="w-4 h-4 text-gray-600" />;
    }
  };

  const getLayerIcon = (layer: string) => {
    switch (layer) {
      case 'PHY': return <Signal className="w-4 h-4" />;
      case 'MAC': return <Wifi className="w-4 h-4" />;
      case 'RLC': return <Activity className="w-4 h-4" />;
      case 'PDCP': return <Shield className="w-4 h-4" />;
      case 'RRC': return <Network className="w-4 h-4" />;
      case 'NAS': return <Globe className="w-4 h-4" />;
      case 'IMS': return <Phone className="w-4 h-4" />;
      case 'E2': return <Network className="w-4 h-4" />;
      case 'PC5': return <Car className="w-4 h-4" />;
      default: return <Layers className="w-4 h-4" />;
    }
  };

  const getValidationIcon = (status: string) => {
    switch (status) {
      case 'valid': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'invalid': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default: return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatTimestamp = (timestampUs: number) => {
    const date = new Date(timestampUs / 1000);
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  };

  const filteredMessages = messages.filter(msg => 
    selectedLayers.includes(msg.layer) &&
    (filters.search === '' || 
     msg.message_name.toLowerCase().includes(filters.search.toLowerCase()) ||
     msg.message_type.toLowerCase().includes(filters.search.toLowerCase()))
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <MessageSquare className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Message Flow Analysis</h2>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">{filteredMessages.length} messages</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as any)}
            className="text-sm border border-gray-300 rounded px-3 py-1"
          >
            <option value="timeline">Timeline View</option>
            <option value="tree">Tree View</option>
            <option value="hex">Hex View</option>
          </select>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Layer Panel */}
        <div className="w-80 border-r border-gray-200 overflow-y-auto">
          <LayerPanel
            layerStats={layerStats}
            selectedLayers={selectedLayers}
            onLayerToggle={handleLayerToggle}
            onSelectAll={handleSelectAllLayers}
            onDeselectAll={handleDeselectAllLayers}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Filters */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="text-sm border border-gray-300 rounded px-3 py-1 w-64"
                />
              </div>
              
              <select
                value={filters.protocol}
                onChange={(e) => setFilters(prev => ({ ...prev, protocol: e.target.value }))}
                className="text-sm border border-gray-300 rounded px-3 py-1"
              >
                <option value="all">All Protocols</option>
                <option value="NR">5G NR</option>
                <option value="LTE">4G LTE</option>
                <option value="SIP">IMS/SIP</option>
                <option value="E2">O-RAN E2</option>
                <option value="PC5">V2X PC5</option>
              </select>
              
              <select
                value={filters.direction}
                onChange={(e) => setFilters(prev => ({ ...prev, direction: e.target.value }))}
                className="text-sm border border-gray-300 rounded px-3 py-1"
              >
                <option value="all">All Directions</option>
                <option value="UL">Uplink</option>
                <option value="DL">Downlink</option>
                <option value="BIDIRECTIONAL">Bidirectional</option>
              </select>
            </div>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-600">Loading messages...</div>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => setSelectedMessage(message)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedMessage?.id === message.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getDirectionIcon(message.message_direction)}
                        <div className="flex items-center space-x-2">
                          {getLayerIcon(message.layer)}
                          <span className="text-sm font-medium text-gray-900">{message.layer}</span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{message.message_name}</div>
                          <div className="text-xs text-gray-600">{message.message_type}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm text-gray-900">{formatTimestamp(message.timestamp_us)}</div>
                          <div className="text-xs text-gray-600">{message.protocol}</div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {getValidationIcon(message.validation_status)}
                          <span className="text-xs text-gray-600">{message.ie_count} IEs</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Message details */}
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
                      <div className="flex items-center space-x-4">
                        <span>{message.source_entity} → {message.target_entity}</span>
                        {message.standard_reference && (
                          <span>Ref: {message.standard_reference}</span>
                        )}
                      </div>
                      
                      {message.validation_errors.length > 0 && (
                        <div className="flex items-center space-x-1 text-red-600">
                          <XCircle className="w-3 h-3" />
                          <span>{message.validation_errors.length} errors</span>
                        </div>
                      )}
                      
                      {message.validation_warnings.length > 0 && (
                        <div className="flex items-center space-x-1 text-yellow-600">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{message.validation_warnings.length} warnings</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Message Details */}
        {selectedMessage && (
          <div className="w-96 border-l border-gray-200 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Message Details</h3>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <EyeOff className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Basic Info */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Basic Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Message ID:</span>
                    <span className="font-mono">{selectedMessage.message_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Timestamp:</span>
                    <span>{formatTimestamp(selectedMessage.timestamp_us)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Protocol:</span>
                    <span>{selectedMessage.protocol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Layer:</span>
                    <span>{selectedMessage.layer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Direction:</span>
                    <span>{selectedMessage.message_direction}</span>
                  </div>
                </div>
              </div>

              {/* Validation Status */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Validation Status</h4>
                <div className="flex items-center space-x-2">
                  {getValidationIcon(selectedMessage.validation_status)}
                  <span className="text-sm capitalize">{selectedMessage.validation_status}</span>
                </div>
                
                {selectedMessage.validation_errors.length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs font-medium text-red-600 mb-1">Errors:</div>
                    <ul className="text-xs text-red-600 space-y-1">
                      {selectedMessage.validation_errors.map((error, i) => (
                        <li key={i}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {selectedMessage.validation_warnings.length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs font-medium text-yellow-600 mb-1">Warnings:</div>
                    <ul className="text-xs text-yellow-600 space-y-1">
                      {selectedMessage.validation_warnings.map((warning, i) => (
                        <li key={i}>• {warning}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Information Elements */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Information Elements ({selectedMessage.ie_count})</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedMessage.information_elements.map((ie, i) => (
                    <div key={i} className="p-2 bg-gray-50 rounded text-xs">
                      <div className="font-medium">{ie.ie_name}</div>
                      <div className="text-gray-600">{ie.ie_type}: {JSON.stringify(ie.ie_value)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Layer Parameters */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Layer Parameters</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedMessage.layer_parameters.map((param, i) => (
                    <div key={i} className="p-2 bg-gray-50 rounded text-xs">
                      <div className="font-medium">{param.parameter_name}</div>
                      <div className="text-gray-600">{param.parameter_type}: {JSON.stringify(param.parameter_value)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decoded Data */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Decoded Data</h4>
                <div className="bg-gray-50 rounded p-3 text-xs font-mono max-h-40 overflow-y-auto">
                  <pre>{JSON.stringify(selectedMessage.decoded_data, null, 2)}</pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedMessageViewer;
'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronDown, ChevronRight, Clock, ArrowUp, ArrowDown, 
  AlertTriangle, CheckCircle, XCircle, Activity, Zap
} from 'lucide-react';

interface LiveMessage {
  id: string;
  timestamp: number;
  layer: string;
  message_type: string;
  message_name: string;
  direction: 'UL' | 'DL' | 'BIDIRECTIONAL';
  decoded_data: any;
  information_elements: any[];
  validation_status: 'valid' | 'invalid' | 'warning';
  processing_time_ms: number;
}

interface LayerGroup {
  name: string;
  color: string;
  bgColor: string;
  messages: LiveMessage[];
  isExpanded: boolean;
  isActive: boolean;
}

interface LiveLayerGroupingProps {
  testCaseId: string;
  onMessageSelect?: (message: LiveMessage) => void;
  filters?: {
    layers: string[];
    messageTypes: string[];
    directions: string[];
    validationStatus: string[];
  };
}

const LAYER_CONFIG = {
  PHY: { color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
  MAC: { color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
  RLC: { color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
  PDCP: { color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  RRC: { color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  NAS: { color: 'text-indigo-600', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200' },
  IMS: { color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
};

export default function LiveLayerGrouping({ testCaseId, onMessageSelect, filters }: LiveLayerGroupingProps) {
  const [layerGroups, setLayerGroups] = useState<LayerGroup[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [highlightErrors, setHighlightErrors] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize layer groups
  useEffect(() => {
    const initialGroups: LayerGroup[] = Object.keys(LAYER_CONFIG).map(layer => ({
      name: layer,
      color: LAYER_CONFIG[layer as keyof typeof LAYER_CONFIG].color,
      bgColor: LAYER_CONFIG[layer as keyof typeof LAYER_CONFIG].bgColor,
      messages: [],
      isExpanded: true,
      isActive: false,
    }));
    setLayerGroups(initialGroups);
  }, []);

  // WebSocket connection for live updates
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:3000/api/simulation/stream?testCaseId=${testCaseId}`);
    
    ws.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected for layer grouping');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'message') {
          const message: LiveMessage = data.data;
          addMessageToLayer(message);
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    setWebsocket(ws);

    return () => {
      ws.close();
    };
  }, [testCaseId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [layerGroups, autoScroll]);

  const addMessageToLayer = (message: LiveMessage) => {
    setLayerGroups(prevGroups => {
      const newGroups = prevGroups.map(group => {
        if (group.name === message.layer) {
          const newMessage = {
            ...message,
            id: `${message.id}-${Date.now()}`, // Ensure unique ID
          };
          
          return {
            ...group,
            messages: [...group.messages, newMessage],
            isActive: true,
          };
        }
        return group;
      });

      // Reset active state after a short delay
      setTimeout(() => {
        setLayerGroups(groups => 
          groups.map(group => ({ ...group, isActive: false }))
        );
      }, 1000);

      return newGroups;
    });
  };

  const toggleLayerExpansion = (layerName: string) => {
    setLayerGroups(prevGroups =>
      prevGroups.map(group =>
        group.name === layerName
          ? { ...group, isExpanded: !group.isExpanded }
          : group
      )
    );
  };

  const clearLayerMessages = (layerName: string) => {
    setLayerGroups(prevGroups =>
      prevGroups.map(group =>
        group.name === layerName
          ? { ...group, messages: [] }
          : group
      )
    );
  };

  const clearAllMessages = () => {
    setLayerGroups(prevGroups =>
      prevGroups.map(group => ({ ...group, messages: [] }))
    );
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  };

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'UL':
        return <ArrowUp className="w-4 h-4 text-green-600" />;
      case 'DL':
        return <ArrowDown className="w-4 h-4 text-blue-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getValidationIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'invalid':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getMessageRowClass = (message: LiveMessage) => {
    let baseClass = "p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors";
    
    if (highlightErrors && message.validation_status === 'invalid') {
      baseClass += " bg-red-50 border-red-200";
    } else if (highlightErrors && message.validation_status === 'warning') {
      baseClass += " bg-yellow-50 border-yellow-200";
    }
    
    return baseClass;
  };

  const filteredLayerGroups = layerGroups.filter(group => 
    !filters || filters.layers.length === 0 || filters.layers.includes(group.name)
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <h3 className="text-lg font-semibold text-gray-900">Live Layer Grouping</h3>
            <span className="text-sm text-gray-500">
              ({layerGroups.reduce((sum, group) => sum + group.messages.length, 0)} messages)
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setAutoScroll(!autoScroll)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                autoScroll ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Auto-scroll
            </button>
            <button
              onClick={() => setShowTimestamps(!showTimestamps)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                showTimestamps ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Timestamps
            </button>
            <button
              onClick={() => setHighlightErrors(!highlightErrors)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                highlightErrors ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              }`}
            >
              Highlight Errors
            </button>
            <button
              onClick={clearAllMessages}
              className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Layer Groups */}
      <div className="max-h-96 overflow-y-auto">
        {filteredLayerGroups.map((group) => (
          <div key={group.name} className="border-b border-gray-100 last:border-b-0">
            {/* Layer Header */}
            <div
              className={`p-3 cursor-pointer transition-colors ${
                group.isActive ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => toggleLayerExpansion(group.name)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {group.isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                  <div className={`px-2 py-1 rounded text-sm font-medium ${group.bgColor} ${group.color}`}>
                    {group.name}
                  </div>
                  <span className="text-sm text-gray-500">
                    {group.messages.length} messages
                  </span>
                  {group.isActive && (
                    <div className="flex items-center space-x-1">
                      <Zap className="w-4 h-4 text-blue-500" />
                      <span className="text-xs text-blue-600">Live</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearLayerMessages(group.name);
                    }}
                    className="text-xs text-gray-500 hover:text-red-600 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Layer Messages */}
            {group.isExpanded && (
              <div className="bg-gray-50">
                {group.messages.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No messages in {group.name} layer
                  </div>
                ) : (
                  group.messages.map((message) => (
                    <div
                      key={message.id}
                      className={getMessageRowClass(message)}
                      onClick={() => onMessageSelect?.(message)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getDirectionIcon(message.direction)}
                          {getValidationIcon(message.validation_status)}
                          <div>
                            <div className="font-medium text-gray-900">
                              {message.message_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {message.message_type}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          {showTimestamps && (
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{formatTimestamp(message.timestamp)}</span>
                            </div>
                          )}
                          <div className="text-xs text-gray-500">
                            {message.processing_time_ms.toFixed(1)}ms
                          </div>
                        </div>
                      </div>
                      
                      {/* Information Elements Preview */}
                      {message.information_elements && message.information_elements.length > 0 && (
                        <div className="mt-2 text-xs text-gray-600">
                          <span className="font-medium">IEs:</span> {message.information_elements.length} elements
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Footer */}
      <div className="p-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span>Total: {layerGroups.reduce((sum, group) => sum + group.messages.length, 0)} messages</span>
            <span>Status: {isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Live Updates</span>
          </div>
        </div>
      </div>
    </div>
  );
}
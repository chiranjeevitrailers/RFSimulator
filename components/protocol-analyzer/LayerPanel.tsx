'use client';

import React, { useState } from 'react';
import { 
  Layers,
  Filter,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  Activity,
  Signal,
  Wifi,
  Shield,
  Network,
  Phone,
  Globe,
  Car,
  Satellite,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';

interface LayerStats {
  layer: string;
  message_count: number;
  avg_size: number;
  error_count: number;
  warning_count: number;
}

interface LayerPanelProps {
  layerStats: LayerStats[];
  selectedLayers: string[];
  onLayerToggle: (layer: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

const LayerPanel: React.FC<LayerPanelProps> = ({
  layerStats,
  selectedLayers,
  onLayerToggle,
  onSelectAll,
  onDeselectAll
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

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

  const getLayerColor = (layer: string) => {
    switch (layer) {
      case 'PHY': return 'text-red-600 bg-red-50 border-red-200';
      case 'MAC': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'RLC': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'PDCP': return 'text-green-600 bg-green-50 border-green-200';
      case 'RRC': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'NAS': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      case 'IMS': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'E2': return 'text-pink-600 bg-pink-50 border-pink-200';
      case 'PC5': return 'text-cyan-600 bg-cyan-50 border-cyan-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getLayerDescription = (layer: string) => {
    switch (layer) {
      case 'PHY': return 'Physical Layer - Radio transmission and reception';
      case 'MAC': return 'Medium Access Control - Scheduling and multiplexing';
      case 'RLC': return 'Radio Link Control - Error correction and flow control';
      case 'PDCP': return 'Packet Data Convergence Protocol - Header compression and security';
      case 'RRC': return 'Radio Resource Control - Connection management and mobility';
      case 'NAS': return 'Non-Access Stratum - Core network signaling';
      case 'IMS': return 'IP Multimedia Subsystem - Voice and multimedia services';
      case 'E2': return 'O-RAN E2 Interface - Service management and control';
      case 'PC5': return 'V2X PC5 Interface - Vehicle-to-everything communication';
      default: return 'Unknown layer';
    }
  };

  const totalMessages = layerStats.reduce((sum, stat) => sum + stat.message_count, 0);
  const totalErrors = layerStats.reduce((sum, stat) => sum + stat.error_count, 0);
  const totalWarnings = layerStats.reduce((sum, stat) => sum + stat.warning_count, 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Protocol Layers</h3>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
        
        {isExpanded && (
          <div className="mt-3 flex items-center space-x-2">
            <button
              onClick={onSelectAll}
              className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded hover:bg-primary-200"
            >
              Select All
            </button>
            <button
              onClick={onDeselectAll}
              className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Deselect All
            </button>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Summary Statistics */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{totalMessages.toLocaleString()}</div>
              <div className="text-gray-600">Messages</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-red-600">{totalErrors}</div>
              <div className="text-gray-600">Errors</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-yellow-600">{totalWarnings}</div>
              <div className="text-gray-600">Warnings</div>
            </div>
          </div>

          {/* Layer List */}
          <div className="space-y-2">
            {layerStats.map((stat) => {
              const isSelected = selectedLayers.includes(stat.layer);
              const hasIssues = stat.error_count > 0 || stat.warning_count > 0;
              
              return (
                <div
                  key={stat.layer}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => onLayerToggle(stat.layer)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-1 rounded ${getLayerColor(stat.layer)}`}>
                        {getLayerIcon(stat.layer)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{stat.layer}</div>
                        <div className="text-xs text-gray-600">{getLayerDescription(stat.layer)}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {/* Status indicators */}
                      {hasIssues && (
                        <div className="flex items-center space-x-1">
                          {stat.error_count > 0 && (
                            <div className="flex items-center space-x-1">
                              <XCircle className="w-3 h-3 text-red-500" />
                              <span className="text-xs text-red-600">{stat.error_count}</span>
                            </div>
                          )}
                          {stat.warning_count > 0 && (
                            <div className="flex items-center space-x-1">
                              <AlertTriangle className="w-3 h-3 text-yellow-500" />
                              <span className="text-xs text-yellow-600">{stat.warning_count}</span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Message count */}
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{stat.message_count.toLocaleString()}</div>
                        <div className="text-xs text-gray-600">messages</div>
                      </div>
                      
                      {/* Selection indicator */}
                      <div className="flex items-center">
                        {isSelected ? (
                          <Eye className="w-4 h-4 text-primary-600" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional stats */}
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-600">
                    <span>Avg size: {stat.avg_size.toFixed(1)} bytes</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <BarChart3 className="w-3 h-3" />
                        <span>{((stat.message_count / totalMessages) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Layer Performance Chart */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Layer Distribution</h4>
            <div className="space-y-1">
              {layerStats.map((stat) => {
                const percentage = totalMessages > 0 ? (stat.message_count / totalMessages) * 100 : 0;
                const colorClass = getLayerColor(stat.layer).split(' ')[0].replace('text-', 'bg-');
                
                return (
                  <div key={stat.layer} className="flex items-center space-x-2">
                    <div className="w-12 text-xs text-gray-600">{stat.layer}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${colorClass}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="w-12 text-xs text-gray-600 text-right">{percentage.toFixed(1)}%</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Layer Information */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Layer Filtering</p>
                <p className="mt-1">
                  Select layers to filter messages in the timeline. Each layer represents a different 
                  protocol level in the 4G/5G stack, from physical transmission (PHY) to application services (IMS).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LayerPanel;
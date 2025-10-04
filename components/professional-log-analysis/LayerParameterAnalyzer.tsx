'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Layers, 
  Network, 
  Wifi, 
  Database, 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Filter,
  Search,
  Download,
  RefreshCw,
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';

interface LayerParameter {
  id: string;
  name: string;
  value: number | string;
  unit: string;
  range: string;
  description: string;
  category: string;
  subCategory: string;
  standardReference: string;
  timestamp: number;
  layer: string;
  status: 'NORMAL' | 'WARNING' | 'ERROR' | 'CRITICAL';
  trend: 'UP' | 'DOWN' | 'STABLE';
  threshold: {
    min: number;
    max: number;
    warning: number;
    critical: number;
  };
}

interface LayerParameterAnalyzerProps {
  executionId?: string | null;
  platform: '5GLABX' | 'UE_ANALYSIS';
}

const LayerParameterAnalyzer: React.FC<LayerParameterAnalyzerProps> = ({ 
  executionId, 
  platform 
}) => {
  const [parameters, setParameters] = useState<LayerParameter[]>([]);
  const [filteredParameters, setFilteredParameters] = useState<LayerParameter[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyAlerts, setShowOnlyAlerts] = useState(false);
  const [selectedParameter, setSelectedParameter] = useState<LayerParameter | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards' | 'charts'>('table');

  // Generate realistic layer parameters
  const generateLayerParameters = useMemo((): LayerParameter[] => {
    const params: LayerParameter[] = [];
    const startTime = Date.now() - 60000; // 1 minute ago

    // PHY Layer Parameters
    const phyParams = [
      {
        name: 'RSRP',
        unit: 'dBm',
        range: '-140 to -44',
        description: 'Reference Signal Received Power',
        category: 'Signal Quality',
        subCategory: 'Power',
        standardReference: '3GPP TS 38.215',
        threshold: { min: -140, max: -44, warning: -100, critical: -120 }
      },
      {
        name: 'RSRQ',
        unit: 'dB',
        range: '-20 to -3',
        description: 'Reference Signal Received Quality',
        category: 'Signal Quality',
        subCategory: 'Quality',
        standardReference: '3GPP TS 38.215',
        threshold: { min: -20, max: -3, warning: -15, critical: -18 }
      },
      {
        name: 'SINR',
        unit: 'dB',
        range: '-10 to 30',
        description: 'Signal to Interference plus Noise Ratio',
        category: 'Signal Quality',
        subCategory: 'Quality',
        standardReference: '3GPP TS 38.215',
        threshold: { min: -10, max: 30, warning: 5, critical: 0 }
      },
      {
        name: 'CQI',
        unit: '',
        range: '0 to 15',
        description: 'Channel Quality Indicator',
        category: 'Channel Quality',
        subCategory: 'Indicator',
        standardReference: '3GPP TS 38.214',
        threshold: { min: 0, max: 15, warning: 5, critical: 2 }
      },
      {
        name: 'MCS',
        unit: '',
        range: '0 to 31',
        description: 'Modulation and Coding Scheme',
        category: 'Channel Quality',
        subCategory: 'Scheme',
        standardReference: '3GPP TS 38.214',
        threshold: { min: 0, max: 31, warning: 10, critical: 5 }
      },
      {
        name: 'Pathloss',
        unit: 'dB',
        range: '50 to 150',
        description: 'Path Loss',
        category: 'Signal Quality',
        subCategory: 'Loss',
        standardReference: '3GPP TS 38.215',
        threshold: { min: 50, max: 150, warning: 120, critical: 140 }
      }
    ];

    // MAC Layer Parameters
    const macParams = [
      {
        name: 'HARQ-Process-ID',
        unit: '',
        range: '0 to 15',
        description: 'HARQ Process Identifier',
        category: 'HARQ',
        subCategory: 'Process',
        standardReference: '3GPP TS 38.321',
        threshold: { min: 0, max: 15, warning: 12, critical: 14 }
      },
      {
        name: 'NDI',
        unit: '',
        range: '0 to 1',
        description: 'New Data Indicator',
        category: 'HARQ',
        subCategory: 'Indicator',
        standardReference: '3GPP TS 38.321',
        threshold: { min: 0, max: 1, warning: 0.5, critical: 0.5 }
      },
      {
        name: 'RV',
        unit: '',
        range: '0 to 3',
        description: 'Redundancy Version',
        category: 'HARQ',
        subCategory: 'Version',
        standardReference: '3GPP TS 38.321',
        threshold: { min: 0, max: 3, warning: 2, critical: 3 }
      },
      {
        name: 'BSR',
        unit: 'bytes',
        range: '0 to 150000',
        description: 'Buffer Status Report',
        category: 'Buffer',
        subCategory: 'Status',
        standardReference: '3GPP TS 38.321',
        threshold: { min: 0, max: 150000, warning: 100000, critical: 140000 }
      }
    ];

    // RLC Layer Parameters
    const rlcParams = [
      {
        name: 'SN',
        unit: '',
        range: '0 to 1023',
        description: 'Sequence Number',
        category: 'RLC',
        subCategory: 'Sequence',
        standardReference: '3GPP TS 38.322',
        threshold: { min: 0, max: 1023, warning: 900, critical: 1000 }
      },
      {
        name: 'SO',
        unit: 'bytes',
        range: '0 to 65535',
        description: 'Segment Offset',
        category: 'RLC',
        subCategory: 'Segment',
        standardReference: '3GPP TS 38.322',
        threshold: { min: 0, max: 65535, warning: 50000, critical: 60000 }
      },
      {
        name: 'LI',
        unit: 'bytes',
        range: '0 to 1500',
        description: 'Length Indicator',
        category: 'RLC',
        subCategory: 'Length',
        standardReference: '3GPP TS 38.322',
        threshold: { min: 0, max: 1500, warning: 1200, critical: 1400 }
      }
    ];

    // RRC Layer Parameters
    const rrcParams = [
      {
        name: 'Transaction-ID',
        unit: '',
        range: '0 to 3',
        description: 'Transaction Identifier',
        category: 'RRC',
        subCategory: 'Transaction',
        standardReference: '3GPP TS 38.331',
        threshold: { min: 0, max: 3, warning: 2, critical: 3 }
      },
      {
        name: 'Procedure-Code',
        unit: '',
        range: '0 to 255',
        description: 'RRC Procedure Code',
        category: 'RRC',
        subCategory: 'Procedure',
        standardReference: '3GPP TS 38.331',
        threshold: { min: 0, max: 255, warning: 200, critical: 250 }
      }
    ];

    // NAS Layer Parameters
    const nasParams = [
      {
        name: 'Security-Header-Type',
        unit: '',
        range: '0 to 15',
        description: 'Security Header Type',
        category: 'Security',
        subCategory: 'Header',
        standardReference: '3GPP TS 24.501',
        threshold: { min: 0, max: 15, warning: 12, critical: 14 }
      },
      {
        name: 'Protocol-Discriminator',
        unit: '',
        range: '0 to 15',
        description: 'Protocol Discriminator',
        category: 'Security',
        subCategory: 'Protocol',
        standardReference: '3GPP TS 24.501',
        threshold: { min: 0, max: 15, warning: 12, critical: 14 }
      }
    ];

    // Combine all parameters
    const allParams = [
      ...phyParams.map(p => ({ ...p, layer: 'PHY' })),
      ...macParams.map(p => ({ ...p, layer: 'MAC' })),
      ...rlcParams.map(p => ({ ...p, layer: 'RLC' })),
      ...rrcParams.map(p => ({ ...p, layer: 'RRC' })),
      ...nasParams.map(p => ({ ...p, layer: 'NAS' }))
    ];

    // Generate parameter values over time
    allParams.forEach((param, paramIndex) => {
      for (let i = 0; i < 20; i++) {
        const timestamp = startTime + (i * 3000) + (paramIndex * 100);
        const baseValue = typeof param.threshold.min === 'number' ? 
          param.threshold.min + Math.random() * (param.threshold.max - param.threshold.min) : 
          'Default Value';
        
        // Determine status based on value
        let status: 'NORMAL' | 'WARNING' | 'ERROR' | 'CRITICAL' = 'NORMAL';
        if (typeof baseValue === 'number') {
          if (baseValue >= param.threshold.critical) status = 'CRITICAL';
          else if (baseValue >= param.threshold.warning) status = 'WARNING';
          else if (baseValue <= param.threshold.min) status = 'ERROR';
        }

        // Determine trend
        const trend: 'UP' | 'DOWN' | 'STABLE' = Math.random() > 0.6 ? 
          (Math.random() > 0.5 ? 'UP' : 'DOWN') : 'STABLE';

        params.push({
          id: `param-${param.layer}-${param.name}-${i}`,
          name: param.name,
          value: baseValue,
          unit: param.unit,
          range: param.range,
          description: param.description,
          category: param.category,
          subCategory: param.subCategory,
          standardReference: param.standardReference,
          timestamp: timestamp,
          layer: param.layer,
          status: status,
          trend: trend,
          threshold: param.threshold
        });
      }
    });

    return params;
  }, [executionId]);

  // Load parameters on mount
  useEffect(() => {
    setParameters(generateLayerParameters);
  }, [generateLayerParameters]);

  // Apply filters
  useEffect(() => {
    let filtered = parameters;

    // Layer filter
    if (selectedLayer !== 'ALL') {
      filtered = filtered.filter(param => param.layer === selectedLayer);
    }

    // Category filter
    if (selectedCategory !== 'ALL') {
      filtered = filtered.filter(param => param.category === selectedCategory);
    }

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(param => 
        param.name.toLowerCase().includes(query) ||
        param.description.toLowerCase().includes(query) ||
        param.category.toLowerCase().includes(query) ||
        param.subCategory.toLowerCase().includes(query)
      );
    }

    // Alerts filter
    if (showOnlyAlerts) {
      filtered = filtered.filter(param => 
        param.status === 'WARNING' || 
        param.status === 'ERROR' || 
        param.status === 'CRITICAL'
      );
    }

    setFilteredParameters(filtered);
  }, [parameters, selectedLayer, selectedCategory, searchQuery, showOnlyAlerts]);

  // Get available layers and categories
  const availableLayers = useMemo(() => {
    const layers = Array.from(new Set(parameters.map(p => p.layer)));
    return ['ALL', ...layers];
  }, [parameters]);

  const availableCategories = useMemo(() => {
    const categories = Array.from(new Set(parameters.map(p => p.category)));
    return ['ALL', ...categories];
  }, [parameters]);

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'NORMAL': return 'text-green-600 bg-green-50';
      case 'WARNING': return 'text-yellow-600 bg-yellow-50';
      case 'ERROR': return 'text-red-600 bg-red-50';
      case 'CRITICAL': return 'text-red-800 bg-red-100';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // Get trend icon
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'UP': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'DOWN': return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'STABLE': return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
      default: return null;
    }
  };

  // Get layer color
  const getLayerColor = (layer: string): string => {
    const colorMap: Record<string, string> = {
      'PHY': 'text-orange-600 bg-orange-50',
      'MAC': 'text-red-600 bg-red-50',
      'RLC': 'text-yellow-600 bg-yellow-50',
      'PDCP': 'text-green-600 bg-green-50',
      'RRC': 'text-blue-600 bg-blue-50',
      'NAS': 'text-purple-600 bg-purple-50',
      'IMS': 'text-pink-600 bg-pink-50',
      'APPLICATION': 'text-indigo-600 bg-indigo-50'
    };
    return colorMap[layer] || 'text-gray-600 bg-gray-50';
  };

  // Format timestamp
  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  };

  // Calculate statistics
  const statistics = useMemo(() => {
    const total = filteredParameters.length;
    const normal = filteredParameters.filter(p => p.status === 'NORMAL').length;
    const warning = filteredParameters.filter(p => p.status === 'WARNING').length;
    const error = filteredParameters.filter(p => p.status === 'ERROR').length;
    const critical = filteredParameters.filter(p => p.status === 'CRITICAL').length;

    return { total, normal, warning, error, critical };
  }, [filteredParameters]);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-gray-900">
              Layer Parameter Analyzer - {platform}
            </h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live</span>
            </div>
            <span className="text-sm text-gray-500">
              {filteredParameters.length} parameters
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
            >
              {viewMode === 'table' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span>{viewMode === 'table' ? 'Cards' : 'Table'}</span>
            </button>
            <button
              onClick={() => setViewMode('charts')}
              className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Charts</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Bar */}
      <div className="bg-gray-100 border-b border-gray-200 p-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span className="font-medium">Total: {statistics.total}</span>
            <span className="text-green-600">Normal: {statistics.normal}</span>
            <span className="text-yellow-600">Warning: {statistics.warning}</span>
            <span className="text-red-600">Error: {statistics.error}</span>
            <span className="text-red-800">Critical: {statistics.critical}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search parameters..."
              />
            </div>
          </div>

          {/* Layer Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Layer</label>
            <select
              value={selectedLayer}
              onChange={(e) => setSelectedLayer(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {availableLayers.map(layer => (
                <option key={layer} value={layer}>{layer}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {availableCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Alerts Filter */}
          <div className="flex items-end">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showOnlyAlerts}
                onChange={(e) => setShowOnlyAlerts(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Show only alerts</span>
            </label>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Parameters List */}
        <div className="flex-1 overflow-auto">
          {viewMode === 'table' ? (
            <div className="p-4">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Parameter
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Layer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Value
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trend
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredParameters.map((param) => (
                      <tr
                        key={param.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => setSelectedParameter(param)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{param.name}</div>
                            <div className="text-sm text-gray-500">{param.description}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getLayerColor(param.layer)}`}>
                            {param.layer}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {param.value} {param.unit}
                          </div>
                          <div className="text-sm text-gray-500">
                            Range: {param.range}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(param.status)}`}>
                            {param.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getTrendIcon(param.trend)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatTimestamp(param.timestamp)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : viewMode === 'cards' ? (
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredParameters.map((param) => (
                  <div
                    key={param.id}
                    className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedParameter(param)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{param.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(param.status)}`}>
                        {param.status}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Layer:</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getLayerColor(param.layer)}`}>
                          {param.layer}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Value:</span>
                        <span className="text-sm font-medium">
                          {param.value} {param.unit}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Trend:</span>
                        <div className="flex items-center">
                          {getTrendIcon(param.trend)}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTimestamp(param.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Parameter Charts</h3>
                <div className="text-center text-gray-500">
                  Charts view coming soon...
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Parameter Details Panel */}
        {selectedParameter && (
          <div className="w-1/3 border-l border-gray-200 bg-white">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Parameter Details</h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Basic Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{selectedParameter.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Layer:</span>
                    <span className="font-medium">{selectedParameter.layer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-medium">{selectedParameter.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sub Category:</span>
                    <span className="font-medium">{selectedParameter.subCategory}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Value:</span>
                    <span className="font-medium">
                      {selectedParameter.value} {selectedParameter.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Range:</span>
                    <span className="font-medium">{selectedParameter.range}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${
                      selectedParameter.status === 'NORMAL' ? 'text-green-600' : 
                      selectedParameter.status === 'WARNING' ? 'text-yellow-600' : 
                      selectedParameter.status === 'ERROR' ? 'text-red-600' : 'text-red-800'
                    }`}>
                      {selectedParameter.status}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                <p className="text-sm text-gray-600">{selectedParameter.description}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Thresholds</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Min:</span>
                    <span className="font-medium">{selectedParameter.threshold.min}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Max:</span>
                    <span className="font-medium">{selectedParameter.threshold.max}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Warning:</span>
                    <span className="font-medium">{selectedParameter.threshold.warning}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Critical:</span>
                    <span className="font-medium">{selectedParameter.threshold.critical}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Standard Reference</h4>
                <p className="text-sm text-gray-600">{selectedParameter.standardReference}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LayerParameterAnalyzer;
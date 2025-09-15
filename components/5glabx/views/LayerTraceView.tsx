'use client';

import React, { useState, useEffect } from 'react';
import { 
  Network, 
  ArrowRight, 
  ArrowDown, 
  Clock, 
  Search, 
  Filter,
  Play,
  Pause,
  Square,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';

const LayerTraceView: React.FC<{
  appState: any;
  onStateChange: (state: any) => void;
}> = ({ appState, onStateChange }) => {
  const [traceData, setTraceData] = useState([
    {
      id: 1,
      timestamp: '931.6',
      layer: 'PHY',
      direction: 'DL',
      message: 'PDSCH: rnti=0x4601 h_id=0 k1=4 prb=[0,87) symb=[1,14) mod=QPSK rv=0 tbs=309 t=135.5us',
      status: 'success',
      duration: '135.5us'
    },
    {
      id: 2,
      timestamp: '932.1',
      layer: 'PHY',
      direction: 'UL',
      message: 'PUCCH decode failed: rnti=0x4601 format=1',
      status: 'error',
      duration: '0us'
    },
    {
      id: 3,
      timestamp: '933.2',
      layer: 'MAC',
      direction: 'DL',
      message: 'DL PDU: ue=0 rnti=0x4601 size=169: SDU: lcid=1 nof_sdus=1 total_size=55',
      status: 'success',
      duration: '2.1ms'
    },
    {
      id: 4,
      timestamp: '935.3',
      layer: 'RLC',
      direction: 'DL',
      message: 'du=0 ue=0 SRB1 DL: TX PDU. dc=data p=1 si=full sn=0 pdu_len=53 grant_len=55',
      status: 'success',
      duration: '1.8ms'
    },
    {
      id: 5,
      timestamp: '937.1',
      layer: 'PDCP',
      direction: 'DL',
      message: 'PDCP PDU: ue=0 lcid=1 sn=0 pdu_len=51',
      status: 'success',
      duration: '0.5ms'
    },
    {
      id: 6,
      timestamp: '937.6',
      layer: 'RRC',
      direction: 'DL',
      message: 'RRC DL Information Transfer: ue=0 nas_pdu_len=45',
      status: 'success',
      duration: '1.2ms'
    },
    {
      id: 7,
      timestamp: '938.8',
      layer: 'NAS',
      direction: 'DL',
      message: 'NAS DL Information Transfer: ue=0 nas_pdu_len=45',
      status: 'success',
      duration: '0.8ms'
    }
  ]);

  const [selectedLayer, setSelectedLayer] = useState('all');
  const [selectedDirection, setSelectedDirection] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isPlaying, setIsPlaying] = useState(false);

  const layers = ['all', 'PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS'];
  const directions = ['all', 'DL', 'UL'];
  const statuses = ['all', 'success', 'error', 'warning'];

  const filteredTraceData = traceData.filter(trace => {
    const matchesLayer = selectedLayer === 'all' || trace.layer === selectedLayer;
    const matchesDirection = selectedDirection === 'all' || trace.direction === selectedDirection;
    const matchesStatus = selectedStatus === 'all' || trace.status === selectedStatus;
    
    return matchesLayer && matchesDirection && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getLayerColor = (layer: string) => {
    switch (layer) {
      case 'PHY':
        return 'bg-blue-100 text-blue-800';
      case 'MAC':
        return 'bg-green-100 text-green-800';
      case 'RLC':
        return 'bg-purple-100 text-purple-800';
      case 'PDCP':
        return 'bg-orange-100 text-orange-800';
      case 'RRC':
        return 'bg-pink-100 text-pink-800';
      case 'NAS':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDirectionIcon = (direction: string) => {
    return direction === 'DL' ? 
      <ArrowDown className="w-4 h-4 text-blue-500" /> : 
      <ArrowRight className="w-4 h-4 text-green-500" />;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Layer Trace</h1>
          <p className="text-gray-600 mt-1">Protocol layer message flow and timing analysis</p>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center space-x-4">
          <select
            value={selectedLayer}
            onChange={(e) => setSelectedLayer(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {layers.map(layer => (
              <option key={layer} value={layer}>
                {layer === 'all' ? 'All Layers' : layer}
              </option>
            ))}
          </select>
          <select
            value={selectedDirection}
            onChange={(e) => setSelectedDirection(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {directions.map(direction => (
              <option key={direction} value={direction}>
                {direction === 'all' ? 'All Directions' : direction}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Layer Flow Visualization */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Protocol Layer Flow</h3>
        <div className="space-y-4">
          {filteredTraceData.map((trace, index) => (
            <div key={trace.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-mono text-gray-600">{trace.timestamp}</span>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLayerColor(trace.layer)}`}>
                  {trace.layer}
                </span>
              </div>
              
              <div className="flex-shrink-0">
                <div className="flex items-center space-x-1">
                  {getDirectionIcon(trace.direction)}
                  <span className="text-sm font-medium text-gray-700">{trace.direction}</span>
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">{trace.message}</p>
              </div>
              
              <div className="flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{trace.duration}</span>
                  <div className="flex items-center">
                    {getStatusIcon(trace.status)}
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Layer Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Layer Distribution</h3>
          <div className="space-y-3">
            {layers.slice(1).map(layer => {
              const count = filteredTraceData.filter(trace => trace.layer === layer).length;
              const percentage = filteredTraceData.length > 0 ? (count / filteredTraceData.length) * 100 : 0;
              return (
                <div key={layer} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{layer}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getLayerColor(layer).split(' ')[0]}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Summary</h3>
          <div className="space-y-3">
            {statuses.slice(1).map(status => {
              const count = filteredTraceData.filter(trace => trace.status === status).length;
              return (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(status)}
                    <span className="text-sm font-medium text-gray-700 capitalize">{status}</span>
                  </div>
                  <span className="text-sm text-gray-600">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Total Messages</span>
              <span className="text-sm font-medium text-gray-900">{filteredTraceData.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Success Rate</span>
              <span className="text-sm font-medium text-green-600">
                {filteredTraceData.length > 0 ? 
                  ((filteredTraceData.filter(t => t.status === 'success').length / filteredTraceData.length) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-700">Avg Duration</span>
              <span className="text-sm font-medium text-gray-900">
                {filteredTraceData.length > 0 ? 
                  (filteredTraceData.reduce((sum, trace) => {
                    const duration = parseFloat(trace.duration.replace(/[^\d.]/g, ''));
                    return sum + duration;
                  }, 0) / filteredTraceData.length).toFixed(1) + 'ms' : '0ms'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayerTraceView;
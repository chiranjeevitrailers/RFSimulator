'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, RefreshCw, Eye, AlertTriangle, Info, CheckCircle, X } from 'lucide-react';

const EnhancedLogsView: React.FC<{
  appState: any;
  onStateChange: (state: any) => void;
}> = ({ appState, onStateChange }) => {
  const [logs, setLogs] = useState([
    {
      id: 1,
      timestamp: '10:00:00.123',
      direction: 'DL',
      layer: 'PHY',
      channel: 'PBCH',
      sfn: '100',
      messageType: 'MIB',
      rnti: 'SI-RNTI',
      message: 'MIB decoded',
      rawData: '40 04 64 40 00',
      ies: 'SFN=100, BW=20MHz',
      source: 'srsRAN'
    },
    {
      id: 2,
      timestamp: '10:00:01.456',
      direction: 'DL',
      layer: 'MAC',
      channel: 'PDSCH',
      sfn: '101',
      messageType: 'DL-SCH',
      rnti: 'C-RNTI',
      message: 'HARQ transmission',
      rawData: '01 23 45 67 89',
      ies: 'HARQ-ID=1, RV=0, MCS=16',
      source: 'srsRAN'
    }
  ]);

  const [filteredLogs, setFilteredLogs] = useState(logs);
  const [filters, setFilters] = useState({
    layer: 'ALL',
    channel: 'ALL',
    messageType: 'ALL',
    direction: 'ALL',
    source: 'ALL',
    search: ''
  });
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [showDecoder, setShowDecoder] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Comprehensive filter definitions
  const layers = ['ALL', 'PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS', 'NGAP', 'GTP', 'SCTP', 'OTHER'];
  const channels = ['ALL', 'PBCH', 'PDCCH', 'PDSCH', 'PUSCH', 'PUCCH', 'PRACH', 'CCCH', 'DCCH', 'DTCH', 'BCCH', 'PCCH'];
  const messageTypes = ['ALL', 'MIB', 'SIB1', 'RRCSetup', 'RRCReconfiguration', 'SecurityModeCommand', 
    'UECapabilityEnquiry', 'PDSCH', 'PUSCH', 'DL-SCH', 'UL-SCH', 'MAC-PDU', 'RLC-PDU', 'PDCP-PDU', 
    'NAS-PDU', 'NGAP-PDU', 'GTP-PDU', 'GENERIC'];
  const directions = ['ALL', 'DL', 'UL', 'BOTH'];
  const sources = ['ALL', 'srsRAN', 'Open5GS', 'Kamailio'];

  // Apply filters
  useEffect(() => {
    let filtered = logs;
    
    if (filters.layer !== 'ALL') {
      filtered = filtered.filter(log => log.layer === filters.layer);
    }
    if (filters.channel !== 'ALL') {
      filtered = filtered.filter(log => log.channel === filters.channel);
    }
    if (filters.messageType !== 'ALL') {
      filtered = filtered.filter(log => log.messageType === filters.messageType);
    }
    if (filters.direction !== 'ALL') {
      filtered = filtered.filter(log => log.direction === filters.direction);
    }
    if (filters.source !== 'ALL') {
      filtered = filtered.filter(log => log.source === filters.source);
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(log => 
        log.message?.toLowerCase().includes(searchTerm) ||
        log.ies?.toLowerCase().includes(searchTerm) ||
        log.messageType?.toLowerCase().includes(searchTerm)
      );
    }
    
    setFilteredLogs(filtered);
  }, [logs, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const decodeMessage = (log: any) => {
    setSelectedMessage(log);
    setShowDecoder(true);
  };

  const getDirectionColor = (direction: string) => {
    switch (direction) {
      case 'DL': return 'bg-green-100 text-green-700';
      case 'UL': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getLayerColor = (layer: string) => {
    switch (layer) {
      case 'PHY': return 'bg-blue-100 text-blue-700';
      case 'MAC': return 'bg-purple-100 text-purple-700';
      case 'RLC': return 'bg-yellow-100 text-yellow-700';
      case 'RRC': return 'bg-red-100 text-red-700';
      case 'NAS': return 'bg-indigo-100 text-indigo-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Enhanced Logs</h1>
        <p className="text-gray-600 mt-1">Real-time log viewer with comprehensive filtering and message decoding</p>
      </div>

      {/* Status and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="mb-4 flex items-center gap-4">
          <span className="font-medium">Status:</span>
          <span className={`px-3 py-1 rounded-full text-sm ${
            isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isConnected ? '🟢 CLI Connected' : '🔴 Sample Data'}
          </span>
          <span className="text-sm text-gray-500">
            {filteredLogs.length} of {logs.length} logs
          </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1">Layer</label>
            <select
              value={filters.layer}
              onChange={(e) => handleFilterChange('layer', e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
            >
              {layers.map(layer => (
                <option key={layer} value={layer}>{layer}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium mb-1">Channel</label>
            <select
              value={filters.channel}
              onChange={(e) => handleFilterChange('channel', e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
            >
              {channels.map(channel => (
                <option key={channel} value={channel}>{channel}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium mb-1">Message</label>
            <select
              value={filters.messageType}
              onChange={(e) => handleFilterChange('messageType', e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
            >
              {messageTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium mb-1">Direction</label>
            <select
              value={filters.direction}
              onChange={(e) => handleFilterChange('direction', e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm"
            >
              {directions.map(dir => (
                <option key={dir} value={dir}>{dir}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-3">
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Search logs, IEs, components..."
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Time', 'Dir', 'Layer', 'Channel', 'SFN', 'Type', 'RNTI', 'IEs', 'Decode'].map(header => (
                <th key={header} className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredLogs.map(log => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 font-mono text-xs">{log.timestamp}</td>
                <td className="px-3 py-2">
                  <span className={`px-1 py-0.5 text-xs rounded ${getDirectionColor(log.direction)}`}>
                    {log.direction}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span className={`px-1 py-0.5 text-xs rounded ${getLayerColor(log.layer)}`}>
                    {log.layer}
                  </span>
                </td>
                <td className="px-3 py-2 text-xs">{log.channel || '-'}</td>
                <td className="px-3 py-2 font-mono text-xs">{log.sfn || '-'}</td>
                <td className="px-3 py-2 font-medium text-xs">{log.messageType}</td>
                <td className="px-3 py-2 font-mono text-xs">{log.rnti || '-'}</td>
                <td className="px-3 py-2 text-xs max-w-xs truncate">{log.ies || '-'}</td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => decodeMessage(log)}
                    className="text-blue-600 hover:bg-blue-50 p-1 rounded"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Decoder Modal */}
      {showDecoder && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Message Decoder - {selectedMessage.messageType}
              </h3>
              <button
                onClick={() => setShowDecoder(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Raw Data</h4>
                <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                  {selectedMessage.rawData || 'No raw data available'}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Decoded Information</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>IEs:</strong> {selectedMessage.ies || 'No IEs available'}
                  </p>
                  <p>
                    <strong>Source:</strong> {selectedMessage.source || 'Unknown'}
                  </p>
                  <p>
                    <strong>Message:</strong> {selectedMessage.message || 'No message available'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedLogsView;
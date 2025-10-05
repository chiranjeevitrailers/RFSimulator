'use client';

import React, { useState, useEffect } from 'react';
import { Search, Activity, Database, Wifi, Server, Phone, Shield, AlertTriangle, CheckCircle, Clock, XCircle, Smartphone, Signal, Battery, MapPin, Filter, MoreHorizontal } from 'lucide-react';

interface UEEnhancedLogsProps {
  executionId?: string | null;
}

// Mock log data for demonstration
const mockLogData = [
  {
    time: '16:07:28.927',
    dir: 'DL',
    layer: 'PHY',
    channel: 'PDSCH',
    sfn: '800',
    type: 'Generic',
    rnti: '4601',
    ies: 'srsRAN-eNB: [PHY] [I] PDSCH: rnti=0x4601 h_id=3 tbs=309 mcs=16 rv=0 k1=4',
    decode: '🔍'
  },
  {
    time: '16:07:30.904',
    dir: 'DL',
    layer: 'RLC',
    channel: 'GENERIC',
    sfn: '63',
    type: 'Generic',
    rnti: 'N/A',
    ies: 'srsRAN-UE: [RLC] [I] TX PDU: SRB1 sn=157 p=0 si=full pdu_len=24',
    decode: '🔍'
  },
  {
    time: '16:07:32.881',
    dir: 'DL',
    layer: 'PHY',
    channel: 'GENERIC',
    sfn: '104',
    type: 'Generic',
    rnti: 'N/A',
    ies: 'OpenSGS-SGW: [GTP] [I] Create Session Request: IMSI=001010000000001 TEID=0x1...',
    decode: '🔍'
  },
  {
    time: '16:07:34.865',
    dir: 'DL',
    layer: 'SIP',
    channel: 'SIP',
    sfn: '876',
    type: 'Generic',
    rnti: 'N/A',
    ies: 'Kamailio-PCSCF: [SIP] INVITE sip:+491234567890@ims.mnc001.mcc001.3gppnetwork...',
    decode: '🔍'
  }
];

const UEEnhancedLogs: React.FC<UEEnhancedLogsProps> = ({ executionId }) => {
  const [isReceivingData, setIsReceivingData] = useState(true); // Set to true to show data
  const [lastDataReceived, setLastDataReceived] = useState<Date | null>(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [layerFilter, setLayerFilter] = useState('ALL');
  const [channelFilter, setChannelFilter] = useState('ALL');
  const [messageFilter, setMessageFilter] = useState('ALL');
  const [directionFilter, setDirectionFilter] = useState('ALL');

  useEffect(() => {
    const handleTestExecution = (event: any) => {
      if (event.type === '5GLABX_TEST_EXECUTION' && event.detail?.testCaseData) {
        console.log('🔥 UEEnhancedLogs: Received test execution event:', event.detail);
        setIsReceivingData(true);
        setLastDataReceived(new Date());
      }
    };

    window.addEventListener('5GLABX_TEST_EXECUTION', handleTestExecution);
    return () => window.removeEventListener('5GLABX_TEST_EXECUTION', handleTestExecution);
  }, []);

  const filteredLogs = mockLogData.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.ies.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.layer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.channel.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLayer = layerFilter === 'ALL' || log.layer === layerFilter;
    const matchesChannel = channelFilter === 'ALL' || log.channel === channelFilter;
    const matchesDirection = directionFilter === 'ALL' || log.dir === directionFilter;
    
    return matchesSearch && matchesLayer && matchesChannel && matchesDirection;
  });

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-900">5G Network Simulator - Live Protocol Analysis</h1>
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-green-700">Live Network Simulation</span>
            </div>
            <div className="flex items-center space-x-2">
              <Smartphone className="w-4 h-4 text-blue-600" />
              <span className="text-gray-700">34 Active UEs</span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-green-600" />
              <span className="text-gray-700">22.4% Network Load</span>
            </div>
            <div className="flex items-center space-x-2">
              <Wifi className="w-4 h-4 text-orange-600" />
              <span className="text-gray-700">331 Mbps Total</span>
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4">Real-time network simulation with 3GPP-compliant protocol messages</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="font-medium text-gray-700">Status:</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-700 font-medium">CLI Connected</span>
            </div>
            <span className="text-gray-500">4 of 4 logs</span>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <select 
              value={layerFilter}
              onChange={(e) => setLayerFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">ALL</option>
              <option value="PHY">PHY</option>
              <option value="RLC">RLC</option>
              <option value="SIP">SIP</option>
            </select>

            <select 
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">ALL</option>
              <option value="PDSCH">PDSCH</option>
              <option value="GENERIC">GENERIC</option>
              <option value="SIP">SIP</option>
            </select>

            <select 
              value={messageFilter}
              onChange={(e) => setMessageFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">ALL</option>
            </select>

            <select 
              value={directionFilter}
              onChange={(e) => setDirectionFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ALL">ALL</option>
              <option value="DL">DL</option>
              <option value="UL">UL</option>
            </select>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs, IEs, components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-80"
            />
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="flex-1 overflow-auto bg-white">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dir</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Layer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SFN</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RNTI</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IEs</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Decode</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLogs.map((log, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.time}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                    {log.dir}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    log.layer === 'PHY' ? 'bg-blue-100 text-blue-800' :
                    log.layer === 'RLC' ? 'bg-purple-100 text-purple-800' :
                    log.layer === 'SIP' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {log.layer}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.channel}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.sfn}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.rnti}</td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-md truncate">{log.ies}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    {log.decode}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UEEnhancedLogs;
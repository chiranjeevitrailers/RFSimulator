'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, RefreshCw, Eye, AlertTriangle, Info, CheckCircle, X } from 'lucide-react';

const LogsView: React.FC<{
  appState: any;
  onStateChange: (state: any) => void;
}> = ({ appState, onStateChange }) => {
  const [logs, setLogs] = useState([
    {
      id: 1,
      timestamp: '931.6',
      level: 'I',
      component: 'PHY',
      message: 'PDSCH: rnti=0x4601 h_id=0 k1=4 prb=[0,87) symb=[1,14) mod=QPSK rv=0 tbs=309 t=135.5us',
      type: 'PDSCH',
      direction: 'DL',
      protocol: '5G_NR',
      rawData: '{"rnti": "0x4601", "harq_id": 0, "k1": 4, "prb_range": "[0,87)", "symbols": "[1,14)", "modulation": "QPSK", "rv": 0, "tbs": 309, "time": "135.5us"}',
      informationElements: {
        'rnti': { type: 'INTEGER', value: '0x4601', presence: 'mandatory', reference: 'TS 38.212' },
        'harq-ProcessId': { type: 'INTEGER', value: 0, range: '0..15', presence: 'mandatory', reference: 'TS 38.321' },
        'modulation': { type: 'ENUMERATED', value: 'QPSK', presence: 'mandatory', reference: 'TS 38.211' }
      },
      layerParameters: {
        'SS-RSRP': { value: -85, unit: 'dBm', range: '(-156, -31)', reference: 'TS 38.215 5.1.1' },
        'TBS': { value: 309, unit: 'bits', reference: 'TS 38.214' }
      },
      ies: 'rnti=0x4601, harq_id=0, modulation=QPSK, tbs=309'
    },
    {
      id: 2,
      timestamp: '938.5',
      level: 'I',
      component: 'MAC',
      message: 'DL PDU: ue=0 rnti=0x4601 size=169: SDU: lcid=1 nof_sdus=1 total_size=55',
      type: 'DL PDU',
      direction: 'DL',
      protocol: '5G_NR',
      rawData: '{"ue_id": 0, "rnti": "0x4601", "pdu_size": 169, "lcid": 1, "num_sdus": 1, "total_size": 55}',
      informationElements: {
        'ue-Identity': { type: 'INTEGER', value: 0, presence: 'mandatory', reference: 'TS 38.321' },
        'rnti': { type: 'BIT STRING', value: '0x4601', size: 16, presence: 'mandatory', reference: 'TS 38.321' },
        'lcid': { type: 'INTEGER', value: 1, range: '1..32', presence: 'mandatory', reference: 'TS 38.321' }
      },
      layerParameters: {
        'PDU-Size': { value: 169, unit: 'bytes', reference: 'TS 38.321' },
        'SDU-Count': { value: 1, reference: 'TS 38.321' }
      },
      ies: 'ue=0, rnti=0x4601, lcid=1, size=169'
    },
    {
      id: 3,
      timestamp: '940.1',
      level: 'I',
      component: 'RLC',
      message: 'du=0 ue=0 SRB1 DL: TX PDU. dc=data p=1 si=full sn=0 pdu_len=53 grant_len=55',
      type: 'TX PDU',
      direction: 'DL',
      protocol: '5G_NR',
      rawData: '{"du": 0, "ue": 0, "bearer": "SRB1", "dc": "data", "p": 1, "si": "full", "sn": 0, "pdu_len": 53, "grant_len": 55}',
      informationElements: {
        'sequence-Number': { type: 'INTEGER', value: 0, range: '0..4095', presence: 'mandatory', reference: 'TS 38.322' },
        'segmentation-Info': { type: 'ENUMERATED', value: 'full', presence: 'mandatory', reference: 'TS 38.322' },
        'polling-Bit': { type: 'BOOLEAN', value: true, presence: 'optional', reference: 'TS 38.322' }
      },
      layerParameters: {
        'PDU-Length': { value: 53, unit: 'bytes', reference: 'TS 38.322' },
        'Grant-Length': { value: 55, unit: 'bytes', reference: 'TS 38.322' }
      },
      ies: 'sn=0, si=full, p=1, pdu_len=53'
    },
    {
      id: 4,
      timestamp: '932.1',
      level: 'E',
      component: 'PHY',
      message: 'PUCCH decode failed: rnti=0x4601 format=1',
      type: 'PUCCH',
      direction: 'UL',
      protocol: '5G_NR',
      rawData: '{"rnti": "0x4601", "format": 1, "decode_result": "failed"}',
      informationElements: {
        'rnti': { type: 'BIT STRING', value: '0x4601', size: 16, presence: 'mandatory', reference: 'TS 38.213' },
        'pucch-Format': { type: 'INTEGER', value: 1, range: '0..4', presence: 'mandatory', reference: 'TS 38.213' }
      },
      layerParameters: {
        'PUCCH-Power': { value: 10, unit: 'dBm', range: '(-40, 23)', reference: 'TS 38.213' }
      },
      ies: 'rnti=0x4601, format=1, result=failed'
    },
    {
      id: 5,
      timestamp: '933.2',
      level: 'W',
      component: 'SCHED',
      message: 'High scheduling latency detected: 250us',
      type: 'Scheduling',
      direction: 'N/A',
      protocol: '5G_NR',
      rawData: '{"latency": "250us", "threshold": "100us", "status": "warning"}',
      informationElements: {
        'scheduling-Latency': { type: 'INTEGER', value: 250, unit: 'microseconds', presence: 'mandatory', reference: 'TS 38.321' },
        'latency-Threshold': { type: 'INTEGER', value: 100, unit: 'microseconds', reference: 'TS 38.321' }
      },
      layerParameters: {
        'Max-Latency': { value: 100, unit: 'us', reference: 'TS 38.321' },
        'Current-Latency': { value: 250, unit: 'us', reference: 'TS 38.321' }
      },
      ies: 'latency=250us, threshold=100us'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedComponent, setSelectedComponent] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [showDecoder, setShowDecoder] = useState(false);

  // Listen for Test Manager data and integrate with 5GLabX log analysis
  useEffect(() => {
    // Listen for Test Manager test execution data
    const handleTestCaseData = (event: MessageEvent) => {
      if (event.data.type === '5GLABX_TEST_EXECUTION') {
        console.log('📊 LogsView received test case data for analysis:', event.data.testCaseId);
        const { testCaseData, testCaseId } = event.data;
        
        if (testCaseData.expectedMessages) {
          // Process each message as a log entry
          testCaseData.expectedMessages.forEach((message: any, index: number) => {
            setTimeout(() => {
              const newLog = {
                id: Date.now() + index,
                timestamp: (Date.now() / 1000).toFixed(1),
                level: 'I',
                component: message.layer,
                message: `${message.messageName}: ${JSON.stringify(message.messagePayload || {})}`,
                type: message.messageType,
                source: 'TestManager',
                testCaseId: testCaseId,
                direction: message.direction,
                protocol: message.protocol,
                // Enhanced data for IE viewing
                rawData: JSON.stringify(message.messagePayload || {}, null, 2),
                informationElements: message.informationElements || {},
                layerParameters: message.layerParameters || {},
                standardReference: message.standardReference || 'Unknown',
                messagePayload: message.messagePayload || {},
                ies: message.informationElements ? 
                  Object.entries(message.informationElements).map(([k, v]: [string, any]) => 
                    `${k}=${typeof v === 'object' ? v.value || JSON.stringify(v) : v}`
                  ).join(', ') : 
                  Object.entries(message.messagePayload || {}).map(([k, v]) => `${k}=${v}`).join(', ')
              };
              
              setLogs(prev => [...prev.slice(-99), newLog]); // Keep last 100 logs
              console.log(`📊 LogsView: Added message ${index + 1} - ${message.messageName}`);
            }, index * 500);
          });
        }
      }
    };

    // Listen for log analysis events
    const handleLogAnalysis = (event: CustomEvent) => {
      console.log('🔬 LogsView received log analysis data:', event.detail);
      const { messages, testCaseId } = event.detail;
      
      if (Array.isArray(messages)) {
        messages.forEach((message: any, index: number) => {
          setTimeout(() => {
            const analysisLog = {
              id: Date.now() + index + 1000,
              timestamp: (Date.now() / 1000).toFixed(1),
              level: 'I',
              component: message.layer,
              message: `Analysis: ${message.messageName} - ${JSON.stringify(message.payload || {})}`,
              type: `${message.messageType}_ANALYSIS`,
              source: 'LogAnalysis',
              testCaseId: testCaseId
            };
            
            setLogs(prev => [...prev.slice(-99), analysisLog]);
          }, index * 300);
        });
      }
    };

    // Listen for direct log updates
    const handleDirectLogUpdate = (event: CustomEvent) => {
      console.log('📊 LogsView: Direct log update received:', event.detail);
      const logData = event.detail;
      
      const newLog = {
        id: logData.id || Date.now(),
        timestamp: logData.timestamp || (Date.now() / 1000).toFixed(1),
        level: logData.level || 'I',
        component: logData.component || logData.layer || 'TEST',
        message: logData.message || `${logData.messageType}: ${JSON.stringify(logData.payload || {})}`,
        type: logData.messageType || logData.type || 'DATA',
        source: 'TestManager'
      };
      
      setLogs(prev => [...prev.slice(-99), newLog]);
      console.log('📊 LogsView: Added direct log entry:', newLog.message);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('message', handleTestCaseData);
      window.addEventListener('5glabxLogAnalysis', handleLogAnalysis as EventListener);
      window.addEventListener('logsViewUpdate', handleDirectLogUpdate as EventListener);
      console.log('✅ LogsView: All event listeners registered for Test Manager integration');
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('message', handleTestCaseData);
        window.removeEventListener('5glabxLogAnalysis', handleLogAnalysis as EventListener);
        window.removeEventListener('logsViewUpdate', handleDirectLogUpdate as EventListener);
      }
    };
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.component.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || log.level === selectedLevel;
    const matchesComponent = selectedComponent === 'all' || log.component === selectedComponent;
    
    return matchesSearch && matchesLevel && matchesComponent;
  });

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'E':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'W':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'I':
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'E':
        return 'bg-red-100 text-red-800';
      case 'W':
        return 'bg-yellow-100 text-yellow-800';
      case 'I':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  // Decode message function (like Enhanced Logs)
  const decodeMessage = (log: any) => {
    setSelectedMessage(log);
    setShowDecoder(true);
  };

  return (
    <div className="p-6 space-y-6" data-component="LogsView">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Logs Viewer</h1>
        <div className="flex items-center space-x-2">
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
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
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Levels</option>
            <option value="E">Error</option>
            <option value="W">Warning</option>
            <option value="I">Info</option>
          </select>
          <select
            value={selectedComponent}
            onChange={(e) => setSelectedComponent(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Components</option>
            <option value="PHY">PHY</option>
            <option value="MAC">MAC</option>
            <option value="RLC">RLC</option>
            <option value="SCHED">SCHED</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Component
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                    {log.timestamp}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(log.level)}`}>
                      {getLevelIcon(log.level)}
                      <span className="ml-1">{log.level}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.component}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.type}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-md truncate">
                    {log.message}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => decodeMessage(log)}
                      className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-1 rounded"
                      title="View Information Elements (IEs)"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {filteredLogs.length} of {logs.length} logs
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span>Errors: {logs.filter(l => l.level === 'E').length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <span>Warnings: {logs.filter(l => l.level === 'W').length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Info className="w-4 h-4 text-blue-500" />
              <span>Info: {logs.filter(l => l.level === 'I').length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Wireshark-style Decoder Modal */}
      {showDecoder && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  📊 Message Decoder - {selectedMessage.type} ({selectedMessage.component})
                </h3>
                <button
                  onClick={() => setShowDecoder(false)}
                  className="text-gray-500 hover:text-gray-700 p-2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column: Message Details */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">📋 Message Information</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Timestamp:</span>
                        <span className="font-mono">{selectedMessage.timestamp}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Layer:</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {selectedMessage.component}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Message Type:</span>
                        <span className="font-mono">{selectedMessage.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Direction:</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          selectedMessage.direction === 'UL' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {selectedMessage.direction || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Protocol:</span>
                        <span className="font-mono">{selectedMessage.protocol || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Standard:</span>
                        <span className="text-blue-600 text-xs">{selectedMessage.standardReference || 'Unknown'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">🔍 Information Elements (IEs)</h4>
                    <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                      {selectedMessage.informationElements && Object.keys(selectedMessage.informationElements).length > 0 ? (
                        <div className="space-y-3">
                          {Object.entries(selectedMessage.informationElements).map(([ieName, ieData]: [string, any]) => (
                            <div key={ieName} className="border-l-4 border-blue-500 pl-3">
                              <div className="font-medium text-gray-900">{ieName}</div>
                              <div className="text-sm text-gray-600 space-y-1">
                                {ieData.type && (
                                  <div><span className="font-medium">Type:</span> {ieData.type}</div>
                                )}
                                {ieData.value !== undefined && (
                                  <div><span className="font-medium">Value:</span> 
                                    <span className="font-mono ml-1">
                                      {typeof ieData.value === 'object' ? JSON.stringify(ieData.value) : String(ieData.value)}
                                    </span>
                                  </div>
                                )}
                                {ieData.presence && (
                                  <div><span className="font-medium">Presence:</span> 
                                    <span className={`ml-1 px-1 py-0.5 rounded text-xs ${
                                      ieData.presence === 'mandatory' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {ieData.presence}
                                    </span>
                                  </div>
                                )}
                                {ieData.criticality && (
                                  <div><span className="font-medium">Criticality:</span> 
                                    <span className="ml-1 text-orange-600">{ieData.criticality}</span>
                                  </div>
                                )}
                                {ieData.reference && (
                                  <div><span className="font-medium">Reference:</span> 
                                    <span className="ml-1 text-blue-600 text-xs">{ieData.reference}</span>
                                  </div>
                                )}
                                {ieData.range && (
                                  <div><span className="font-medium">Range:</span> 
                                    <span className="ml-1 font-mono text-xs">{ieData.range}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 py-4">
                          <div className="text-sm">No structured Information Elements available</div>
                          <div className="text-xs mt-1">Raw IEs: {selectedMessage.ies || 'None'}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column: Raw Data and Layer Parameters */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">📦 Raw Message Data</h4>
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
                      <pre className="whitespace-pre-wrap">
                        {selectedMessage.rawData || JSON.stringify(selectedMessage.messagePayload || {}, null, 2)}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">⚙️ Layer Parameters</h4>
                    <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                      {selectedMessage.layerParameters && Object.keys(selectedMessage.layerParameters).length > 0 ? (
                        <div className="space-y-2">
                          {Object.entries(selectedMessage.layerParameters).map(([paramName, paramData]: [string, any]) => (
                            <div key={paramName} className="border-l-4 border-green-500 pl-3">
                              <div className="font-medium text-gray-900">{paramName}</div>
                              <div className="text-sm text-gray-600">
                                {paramData.value !== undefined && (
                                  <div><span className="font-medium">Value:</span> 
                                    <span className="font-mono ml-1">
                                      {paramData.value} {paramData.unit && `${paramData.unit}`}
                                    </span>
                                  </div>
                                )}
                                {paramData.range && (
                                  <div><span className="font-medium">Range:</span> 
                                    <span className="ml-1 font-mono text-xs">{paramData.range}</span>
                                  </div>
                                )}
                                {paramData.reference && (
                                  <div><span className="font-medium">Reference:</span> 
                                    <span className="ml-1 text-blue-600 text-xs">{paramData.reference}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 py-4 text-sm">
                          No layer parameters available
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">📊 Message Summary</h4>
                    <div className="bg-blue-50 p-4 rounded-lg text-sm">
                      <div className="space-y-1">
                        <div><span className="font-medium">Source:</span> {selectedMessage.source}</div>
                        <div><span className="font-medium">Test Case:</span> {selectedMessage.testCaseId || 'N/A'}</div>
                        <div><span className="font-medium">Message:</span> {selectedMessage.message}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowDecoder(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogsView;
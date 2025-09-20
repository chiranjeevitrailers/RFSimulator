'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, RefreshCw, Eye, AlertTriangle, Info, CheckCircle } from 'lucide-react';

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
      type: 'PDSCH'
    },
    {
      id: 2,
      timestamp: '938.5',
      level: 'I',
      component: 'MAC',
      message: 'DL PDU: ue=0 rnti=0x4601 size=169: SDU: lcid=1 nof_sdus=1 total_size=55',
      type: 'DL PDU'
    },
    {
      id: 3,
      timestamp: '940.1',
      level: 'I',
      component: 'RLC',
      message: 'du=0 ue=0 SRB1 DL: TX PDU. dc=data p=1 si=full sn=0 pdu_len=53 grant_len=55',
      type: 'TX PDU'
    },
    {
      id: 4,
      timestamp: '932.1',
      level: 'E',
      component: 'PHY',
      message: 'PUCCH decode failed: rnti=0x4601 format=1',
      type: 'PUCCH'
    },
    {
      id: 5,
      timestamp: '933.2',
      level: 'W',
      component: 'SCHED',
      message: 'High scheduling latency detected: 250us',
      type: 'Scheduling'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedComponent, setSelectedComponent] = useState('all');

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
                protocol: message.protocol
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
                    <button className="text-blue-600 hover:text-blue-900">
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
    </div>
  );
};

export default LogsView;
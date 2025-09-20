'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Activity, 
  Database, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Eye,
  Download
} from 'lucide-react';

interface DataFlowEvent {
  id: string;
  timestamp: Date;
  type: 'SENT' | 'RECEIVED' | 'PROCESSED' | 'ERROR';
  source: string;
  target: string;
  data: any;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  details: string;
}

const DataFlowDebugger: React.FC = () => {
  const [events, setEvents] = useState<DataFlowEvent[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [testData, setTestData] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState<{
    testManager: boolean;
    postMessage: boolean;
    localStorage: boolean;
    globalVariable: boolean;
  }>({
    testManager: false,
    postMessage: false,
    localStorage: false,
    globalVariable: false
  });

  // Add event to the debug log
  const addEvent = (event: Omit<DataFlowEvent, 'id' | 'timestamp'>) => {
    const newEvent: DataFlowEvent = {
      ...event,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    
    setEvents(prev => [newEvent, ...prev.slice(0, 99)]); // Keep last 100 events
    console.log('🔍 DataFlowDebugger:', newEvent);
  };

  // Check connection status
  const checkConnectionStatus = () => {
    const status = {
      testManager: false,
      postMessage: false,
      localStorage: false,
      globalVariable: false
    };

    // Check global variable
    if ((window as any).latestTestCaseData) {
      status.globalVariable = true;
      setTestData((window as any).latestTestCaseData);
    }

    // Check localStorage
    try {
      const storedData = localStorage.getItem('5glabx_test_data');
      if (storedData) {
        status.localStorage = true;
        if (!status.globalVariable) {
          setTestData(JSON.parse(storedData));
        }
      }
    } catch (e) {
      console.warn('Failed to check localStorage:', e);
    }

    setConnectionStatus(status);
    addEvent({
      type: 'PROCESSED',
      source: 'DataFlowDebugger',
      target: 'StatusCheck',
      data: status,
      status: 'SUCCESS',
      details: 'Connection status checked'
    });
  };

  // Monitor for test manager events
  useEffect(() => {
    if (!isMonitoring) return;

    const handlePostMessage = (event: MessageEvent) => {
      if (event.data.type === '5GLABX_TEST_EXECUTION') {
        addEvent({
          type: 'RECEIVED',
          source: 'TestManager',
          target: '5GLabX',
          data: {
            testCaseId: event.data.testCaseId,
            messageCount: event.data.testCaseData?.expectedMessages?.length || 0,
            dataSource: event.data.dataSource
          },
          status: 'SUCCESS',
          details: `Received test case: ${event.data.testCaseData?.testCase?.name || 'Unknown'}`
        });
        
        setTestData(event.data);
        checkConnectionStatus();
      }
    };

    const handleCustomEvent = (event: CustomEvent) => {
      if (event.type === 'testCaseExecutionStarted') {
        addEvent({
          type: 'RECEIVED',
          source: 'TestManager',
          target: '5GLabX',
          data: event.detail,
          status: 'SUCCESS',
          details: 'Custom event received'
        });
      }
    };

    window.addEventListener('message', handlePostMessage);
    window.addEventListener('testCaseExecutionStarted', handleCustomEvent as EventListener);

    return () => {
      window.removeEventListener('message', handlePostMessage);
      window.removeEventListener('testCaseExecutionStarted', handleCustomEvent as EventListener);
    };
  }, [isMonitoring]);

  // Start monitoring
  const startMonitoring = () => {
    setIsMonitoring(true);
    addEvent({
      type: 'SENT',
      source: 'DataFlowDebugger',
      target: 'System',
      data: { action: 'start_monitoring' },
      status: 'SUCCESS',
      details: 'Started monitoring data flow'
    });
    
    // Check initial status
    setTimeout(() => {
      checkConnectionStatus();
    }, 100);
  };

  // Stop monitoring
  const stopMonitoring = () => {
    setIsMonitoring(false);
    addEvent({
      type: 'SENT',
      source: 'DataFlowDebugger',
      target: 'System',
      data: { action: 'stop_monitoring' },
      status: 'SUCCESS',
      details: 'Stopped monitoring data flow'
    });
  };

  // Clear events
  const clearEvents = () => {
    setEvents([]);
    addEvent({
      type: 'SENT',
      source: 'DataFlowDebugger',
      target: 'System',
      data: { action: 'clear_events' },
      status: 'SUCCESS',
      details: 'Cleared all events'
    });
  };

  // Export events
  const exportEvents = () => {
    const dataStr = JSON.stringify(events, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dataflow-debug-${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Success</Badge>;
      case 'FAILED':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      case 'PENDING':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get type badge
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'SENT':
        return <Badge variant="outline" className="text-blue-600"><Activity className="w-3 h-3 mr-1" />Sent</Badge>;
      case 'RECEIVED':
        return <Badge variant="outline" className="text-green-600"><MessageSquare className="w-3 h-3 mr-1" />Received</Badge>;
      case 'PROCESSED':
        return <Badge variant="outline" className="text-purple-600"><Database className="w-3 h-3 mr-1" />Processed</Badge>;
      case 'ERROR':
        return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Error</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Flow Debugger</h1>
          <p className="text-gray-600 mt-1">Monitor and debug the integration between Test Manager and 5GLabX</p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
            variant={isMonitoring ? "destructive" : "default"}
            className="flex items-center"
          >
            {isMonitoring ? <XCircle className="w-4 h-4 mr-2" /> : <Activity className="w-4 h-4 mr-2" />}
            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </Button>
          <Button onClick={checkConnectionStatus} variant="outline" className="flex items-center">
            <RefreshCw className="w-4 h-4 mr-2" />
            Check Status
          </Button>
          <Button onClick={clearEvents} variant="outline" className="flex items-center">
            <XCircle className="w-4 h-4 mr-2" />
            Clear
          </Button>
          <Button onClick={exportEvents} variant="outline" className="flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="status" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="status">Connection Status</TabsTrigger>
          <TabsTrigger value="events">Events Log</TabsTrigger>
          <TabsTrigger value="data">Test Data</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Connection Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">Test Manager</span>
                  {connectionStatus.testManager ? 
                    <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Connected</Badge> :
                    <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Disconnected</Badge>
                  }
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">PostMessage</span>
                  {connectionStatus.postMessage ? 
                    <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge> :
                    <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Inactive</Badge>
                  }
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">LocalStorage</span>
                  {connectionStatus.localStorage ? 
                    <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Available</Badge> :
                    <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Empty</Badge>
                  }
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium">Global Variable</span>
                  {connectionStatus.globalVariable ? 
                    <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Set</Badge> :
                    <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Not Set</Badge>
                  }
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Events Log ({events.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {events.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No events recorded yet. Start monitoring to see data flow events.</p>
                  </div>
                ) : (
                  events.map((event) => (
                    <div key={event.id} className="p-3 border rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getTypeBadge(event.type)}
                          {getStatusBadge(event.status)}
                        </div>
                        <span className="text-sm text-gray-500">
                          {event.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-sm">
                        <p><strong>Source:</strong> {event.source} → <strong>Target:</strong> {event.target}</p>
                        <p><strong>Details:</strong> {event.details}</p>
                        {event.data && (
                          <details className="mt-2">
                            <summary className="cursor-pointer text-blue-600">View Data</summary>
                            <pre className="mt-2 p-2 bg-white border rounded text-xs overflow-x-auto">
                              {JSON.stringify(event.data, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Current Test Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              {testData ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <strong>Test Case ID:</strong> {testData.testCaseId}
                    </div>
                    <div>
                      <strong>Data Source:</strong> {testData.dataSource}
                    </div>
                    <div>
                      <strong>Test Case Name:</strong> {testData.testCaseData?.testCase?.name || 'Unknown'}
                    </div>
                    <div>
                      <strong>Message Count:</strong> {testData.testCaseData?.expectedMessages?.length || 0}
                    </div>
                  </div>
                  <details>
                    <summary className="cursor-pointer text-blue-600 font-medium">View Full Data Structure</summary>
                    <pre className="mt-2 p-4 bg-gray-100 border rounded text-xs overflow-x-auto max-h-96">
                      {JSON.stringify(testData, null, 2)}
                    </pre>
                  </details>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No test data available. Run a test case to see data here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Data Flow Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{events.length}</div>
                    <div className="text-sm text-gray-600">Total Events</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {events.filter(e => e.status === 'SUCCESS').length}
                    </div>
                    <div className="text-sm text-gray-600">Successful</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {events.filter(e => e.status === 'FAILED').length}
                    </div>
                    <div className="text-sm text-gray-600">Failed</div>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Integration Health</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Data Flow Status</span>
                      {connectionStatus.globalVariable || connectionStatus.localStorage ? 
                        <Badge variant="default" className="bg-green-500">Healthy</Badge> :
                        <Badge variant="destructive">No Data</Badge>
                      }
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Event Monitoring</span>
                      {isMonitoring ? 
                        <Badge variant="default" className="bg-green-500">Active</Badge> :
                        <Badge variant="secondary">Inactive</Badge>
                      }
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Test Data Available</span>
                      {testData ? 
                        <Badge variant="default" className="bg-green-500">Yes</Badge> :
                        <Badge variant="destructive">No</Badge>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataFlowDebugger;
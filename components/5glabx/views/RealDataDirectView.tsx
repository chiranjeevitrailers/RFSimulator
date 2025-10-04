'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, Database, Wifi, Server, Phone, Shield } from 'lucide-react';

interface RealTestData {
  testCaseId: string;
  testCaseData: {
    id: string;
    name: string;
    description: string;
    protocol: string;
    category: string;
    expectedMessages: any[];
  };
}

const RealDataDirectView: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [realTestData, setRealTestData] = useState<RealTestData | null>(null);

  // Load real test case data from Supabase
  const loadRealTestData = async () => {
    try {
      setIsLoading(true);
      console.log('📡 Loading real test case data from Supabase...');
      
      // Fetch real test cases from Supabase
      const response = await fetch('/api/test-cases/comprehensive/?limit=1');
      const data = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        const testCase = data.data[0];
        console.log('✅ Real test case loaded:', testCase.name);
        
        // Execute the test case to get real data
        const executionResponse = await fetch('/api/test-execution/simple/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            testCaseId: testCase.id, 
            userId: 'real-data-user' 
          })
        });
        
        const executionData = await executionResponse.json();
        
        if (executionData.success && executionData.testCaseData) {
          const realData: RealTestData = {
            testCaseId: testCase.id,
            testCaseData: executionData.testCaseData
          };
          
          setRealTestData(realData);
          processRealData(realData);
          setIsConnected(true);
          setLastUpdate(new Date().toLocaleString());
        } else {
          throw new Error('Failed to execute test case');
        }
      } else {
        throw new Error('No test cases found in database');
      }
    } catch (error) {
      console.error('❌ Error loading real data:', error);
      setLogs(prev => [...prev, {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        level: 'E',
        component: 'ERROR',
        message: `Failed to load real data: ${error.message}`,
        type: 'ERROR',
        source: 'REAL_DATA_LOADER'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Process real data from Supabase
  const processRealData = (data: RealTestData) => {
    console.log('🔄 Processing real data from Supabase:', data);
    
    const newLogs = data.testCaseData.expectedMessages.map((message, index) => ({
      id: message.id || `real-${data.testCaseId}-${index}`,
      timestamp: message.timestampMs ? 
        new Date(message.timestampMs).toLocaleTimeString() : 
        new Date().toLocaleTimeString(),
      level: 'I',
      component: message.layer || 'UNKNOWN',
      message: `${message.messageName || message.messageType || 'Real Message'}: ${JSON.stringify(message.messagePayload || {}, null, 2)}`,
      type: message.messageType || 'REAL_MESSAGE',
      source: 'SUPABASE_REAL_DATA',
      testCaseId: data.testCaseId,
      direction: message.direction || 'UL',
      protocol: message.protocol || '5G_NR',
      rawData: JSON.stringify(message.messagePayload || {}, null, 2),
      informationElements: message.informationElements || {},
      layerParameters: message.layerParameters || {},
      standardReference: message.standardReference || '3GPP Specification'
    }));

    setLogs(prev => [...prev, ...newLogs]);
    console.log(`✅ Processed ${newLogs.length} real messages from Supabase`);
  };

  // Listen for real-time events from Test Manager
  useEffect(() => {
    const handleTestExecution = (event: any) => {
      if (event.type === '5GLABX_TEST_EXECUTION' && event.detail?.testCaseData) {
        console.log('🔥 Real-time event received:', event.detail);
        processRealData({
          testCaseId: event.detail.testCaseId,
          testCaseData: event.detail.testCaseData
        });
        setIsConnected(true);
        setLastUpdate(new Date().toLocaleString());
      }
    };

    window.addEventListener('5GLABX_TEST_EXECUTION', handleTestExecution);
    return () => window.removeEventListener('5GLABX_TEST_EXECUTION', handleTestExecution);
  }, []);

  // Auto-load real data on component mount
  useEffect(() => {
    loadRealTestData();
  }, []);

  const getLayerIcon = (layer: string) => {
    switch (layer?.toUpperCase()) {
      case 'PHY': return <Wifi className="w-4 h-4" />;
      case 'MAC': return <Network className="w-4 h-4" />;
      case 'RLC': return <Server className="w-4 h-4" />;
      case 'PDCP': return <Database className="w-4 h-4" />;
      case 'RRC': return <Activity className="w-4 h-4" />;
      case 'NAS': return <Phone className="w-4 h-4" />;
      case 'IMS': return <Shield className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'I': return 'bg-blue-100 text-blue-800';
      case 'W': return 'bg-yellow-100 text-yellow-800';
      case 'E': return 'bg-red-100 text-red-800';
      case 'S': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-6 h-6 text-blue-600" />
            <span>5GLabX Real Data Direct View</span>
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? "Connected to Supabase" : "Disconnected"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Button 
                onClick={loadRealTestData} 
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? 'Loading...' : 'Load Real Data from Supabase'}
              </Button>
              <div className="text-sm text-gray-600">
                Last Update: {lastUpdate || 'Never'}
              </div>
            </div>
            
            {realTestData && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">Real Test Case Data</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Test Case:</strong> {realTestData.testCaseData.name}</div>
                  <div><strong>Protocol:</strong> {realTestData.testCaseData.protocol}</div>
                  <div><strong>Category:</strong> {realTestData.testCaseData.category}</div>
                  <div><strong>Messages:</strong> {realTestData.testCaseData.expectedMessages.length}</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-6 h-6 text-green-600" />
            <span>Real-Time Logs from Supabase</span>
            <Badge variant="outline">{logs.length} messages</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No real data yet. Click "Load Real Data from Supabase" or run a test from Test Manager.
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    {getLayerIcon(log.component)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge className={getLevelColor(log.level)}>
                        {log.level}
                      </Badge>
                      <Badge variant="outline">{log.component}</Badge>
                      <Badge variant="outline">{log.direction}</Badge>
                      <span className="text-xs text-gray-500">{log.timestamp}</span>
                    </div>
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      {log.message}
                    </div>
                    <div className="text-xs text-gray-600">
                      <strong>Source:</strong> {log.source} | 
                      <strong> Protocol:</strong> {log.protocol} |
                      <strong> Type:</strong> {log.type}
                    </div>
                    {log.rawData && (
                      <details className="mt-2">
                        <summary className="text-xs text-blue-600 cursor-pointer">
                          View Raw Data
                        </summary>
                        <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                          {log.rawData}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RealDataDirectView;
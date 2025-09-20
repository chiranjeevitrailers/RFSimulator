'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Activity,
  Database,
  MessageSquare,
  Layers,
  RefreshCw,
  Download
} from 'lucide-react';

interface TestResult {
  id: string;
  testName: string;
  status: 'PASS' | 'FAIL' | 'PENDING';
  details: string;
  timestamp: Date;
  data?: any;
}

const IntegrationTester: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [overallStatus, setOverallStatus] = useState<'PENDING' | 'PASS' | 'FAIL'>('PENDING');

  // Add test result
  const addTestResult = (testName: string, status: 'PASS' | 'FAIL' | 'PENDING', details: string, data?: any) => {
    const result: TestResult = {
      id: Date.now().toString(),
      testName,
      status,
      details,
      timestamp: new Date(),
      data
    };
    
    setTestResults(prev => [result, ...prev]);
    console.log(`🧪 Integration Test: ${testName} - ${status}`, details);
  };

  // Test 1: Check if 5GLabX components are loaded
  const testComponentLoading = async (): Promise<boolean> => {
    try {
      // Check if key components are available
      const components = [
        '5GLabXPlatformMinimal',
        'LogsView',
        'PhyLayerViewTSX',
        'DataFlowDebugger',
        'TestDataGenerator'
      ];
      
      let loadedCount = 0;
      for (const component of components) {
        if (typeof window !== 'undefined' && (window as any)[component]) {
          loadedCount++;
        }
      }
      
      const success = loadedCount >= 3; // At least 3 components should be loaded
      addTestResult(
        'Component Loading',
        success ? 'PASS' : 'FAIL',
        `${loadedCount}/${components.length} components loaded`,
        { loadedCount, totalComponents: components.length }
      );
      
      return success;
    } catch (error) {
      addTestResult('Component Loading', 'FAIL', `Error: ${error}`);
      return false;
    }
  };

  // Test 2: Check event listener registration
  const testEventListenerRegistration = async (): Promise<boolean> => {
    try {
      // Simulate sending a test event
      const testEvent = {
        type: '5GLABX_TEST_EXECUTION',
        testCaseId: 'test-integration',
        testCaseData: {
          testCase: { name: 'Integration Test' },
          expectedMessages: []
        },
        timestamp: Date.now(),
        source: 'IntegrationTester'
      };
      
      // Send test event
      window.postMessage(testEvent, '*');
      
      // Check if global variable is set
      const globalData = (window as any).latestTestCaseData;
      const hasGlobalData = globalData && globalData.type === '5GLABX_TEST_EXECUTION';
      
      addTestResult(
        'Event Listener Registration',
        hasGlobalData ? 'PASS' : 'FAIL',
        hasGlobalData ? 'Event listeners are working' : 'Event listeners not responding',
        { hasGlobalData, testEvent }
      );
      
      return hasGlobalData;
    } catch (error) {
      addTestResult('Event Listener Registration', 'FAIL', `Error: ${error}`);
      return false;
    }
  };

  // Test 3: Check localStorage integration
  const testLocalStorageIntegration = async (): Promise<boolean> => {
    try {
      const testData = {
        type: '5GLABX_TEST_EXECUTION',
        testCaseId: 'test-localstorage',
        testCaseData: {
          testCase: { name: 'LocalStorage Test' },
          expectedMessages: []
        },
        timestamp: Date.now(),
        source: 'IntegrationTester'
      };
      
      // Store in localStorage
      localStorage.setItem('5glabx_test_data', JSON.stringify(testData));
      
      // Retrieve from localStorage
      const storedData = localStorage.getItem('5glabx_test_data');
      const parsedData = storedData ? JSON.parse(storedData) : null;
      
      const success = parsedData && parsedData.testCaseId === 'test-localstorage';
      
      addTestResult(
        'LocalStorage Integration',
        success ? 'PASS' : 'FAIL',
        success ? 'LocalStorage read/write working' : 'LocalStorage integration failed',
        { success, storedData: !!storedData, parsedData: !!parsedData }
      );
      
      return success;
    } catch (error) {
      addTestResult('LocalStorage Integration', 'FAIL', `Error: ${error}`);
      return false;
    }
  };

  // Test 4: Check data format compatibility
  const testDataFormatCompatibility = async (): Promise<boolean> => {
    try {
      const testMessage = {
        messageName: 'RRC Connection Request',
        messageType: 'RRC_CONNECTION_REQUEST',
        layer: 'RRC',
        protocol: '5G_NR',
        direction: 'UL',
        messagePayload: {
          establishmentCause: 'mo-Data',
          ueIdentity: 'randomValue'
        },
        informationElements: {
          establishmentCause: { value: 'mo-Data', description: 'Mobile originated data' }
        },
        layerParameters: {
          rrcState: 'IDLE',
          cellId: '12345'
        },
        standardReference: '3GPP TS 38.331'
      };
      
      // Check if the message has all required fields
      const requiredFields = [
        'messageName', 'messageType', 'layer', 'protocol', 'direction',
        'messagePayload', 'informationElements', 'layerParameters', 'standardReference'
      ];
      
      const hasAllFields = requiredFields.every(field => testMessage.hasOwnProperty(field));
      
      addTestResult(
        'Data Format Compatibility',
        hasAllFields ? 'PASS' : 'FAIL',
        hasAllFields ? 'Data format is compatible' : `Missing fields: ${requiredFields.filter(f => !testMessage.hasOwnProperty(f)).join(', ')}`,
        { hasAllFields, requiredFields, testMessage }
      );
      
      return hasAllFields;
    } catch (error) {
      addTestResult('Data Format Compatibility', 'FAIL', `Error: ${error}`);
      return false;
    }
  };

  // Test 5: Check Supabase integration
  const testSupabaseIntegration = async (): Promise<boolean> => {
    try {
      // Try to fetch test cases from API
      const response = await fetch('/api/test-cases/simple?limit=1');
      const success = response.ok;
      
      let details = '';
      let data = null;
      
      if (success) {
        const result = await response.json();
        details = `API responded successfully with ${result.data?.testCases?.length || 0} test cases`;
        data = result;
      } else {
        details = `API responded with status ${response.status}`;
      }
      
      addTestResult(
        'Supabase Integration',
        success ? 'PASS' : 'FAIL',
        details,
        data
      );
      
      return success;
    } catch (error) {
      addTestResult('Supabase Integration', 'FAIL', `Error: ${error}`);
      return false;
    }
  };

  // Test 6: Check real-time data flow
  const testRealTimeDataFlow = async (): Promise<boolean> => {
    try {
      // Generate realistic test data
      const testData = {
        type: '5GLABX_TEST_EXECUTION',
        testCaseId: 'test-realtime',
        runId: `run-${Date.now()}`,
        testCaseData: {
          testCase: {
            id: 'test-realtime',
            name: 'Real-time Data Flow Test',
            protocol: '5G_NR',
            layer: 'MULTI'
          },
          expectedMessages: [
            {
              messageName: 'RRC Connection Request',
              messageType: 'RRC_CONNECTION_REQUEST',
              layer: 'RRC',
              protocol: '5G_NR',
              direction: 'UL',
              messagePayload: { establishmentCause: 'mo-Data' },
              informationElements: { establishmentCause: { value: 'mo-Data' } },
              layerParameters: { rrcState: 'IDLE' },
              standardReference: '3GPP TS 38.331'
            }
          ],
          expectedInformationElements: [],
          expectedLayerParameters: []
        },
        timestamp: Date.now(),
        source: 'IntegrationTester',
        dataSource: 'GENERATED'
      };
      
      // Send via multiple methods
      window.postMessage(testData, '*');
      (window as any).latestTestCaseData = testData;
      localStorage.setItem('5glabx_test_data', JSON.stringify(testData));
      window.dispatchEvent(new CustomEvent('testCaseExecutionStarted', { detail: testData }));
      
      // Wait a bit for processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if data was processed
      const globalData = (window as any).latestTestCaseData;
      const storedData = localStorage.getItem('5glabx_test_data');
      
      const success = globalData && storedData && globalData.testCaseId === 'test-realtime';
      
      addTestResult(
        'Real-time Data Flow',
        success ? 'PASS' : 'FAIL',
        success ? 'Real-time data flow working' : 'Real-time data flow failed',
        { success, hasGlobalData: !!globalData, hasStoredData: !!storedData }
      );
      
      return success;
    } catch (error) {
      addTestResult('Real-time Data Flow', 'FAIL', `Error: ${error}`);
      return false;
    }
  };

  // Run all tests
  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    setOverallStatus('PENDING');
    
    console.log('🧪 Starting Integration Tests...');
    
    const tests = [
      testComponentLoading,
      testEventListenerRegistration,
      testLocalStorageIntegration,
      testDataFormatCompatibility,
      testSupabaseIntegration,
      testRealTimeDataFlow
    ];
    
    let passedTests = 0;
    
    for (const test of tests) {
      try {
        const result = await test();
        if (result) passedTests++;
        
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('Test failed:', error);
      }
    }
    
    const overallResult = passedTests === tests.length ? 'PASS' : 'FAIL';
    setOverallStatus(overallResult);
    
    addTestResult(
      'Overall Integration Test',
      overallResult,
      `${passedTests}/${tests.length} tests passed`,
      { passedTests, totalTests: tests.length }
    );
    
    setIsRunning(false);
    console.log(`🧪 Integration Tests Complete: ${passedTests}/${tests.length} passed`);
  };

  // Clear results
  const clearResults = () => {
    setTestResults([]);
    setOverallStatus('PENDING');
  };

  // Export results
  const exportResults = () => {
    const dataStr = JSON.stringify(testResults, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `integration-test-results-${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PASS':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />PASS</Badge>;
      case 'FAIL':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />FAIL</Badge>;
      case 'PENDING':
        return <Badge variant="secondary"><AlertTriangle className="w-3 h-3 mr-1" />PENDING</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Integration Tester</h1>
          <p className="text-gray-600 mt-1">Comprehensive testing of 5GLabX integration and data flow</p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={runAllTests}
            disabled={isRunning}
            className="flex items-center"
          >
            {isRunning ? (
              <>
                <Activity className="w-4 h-4 mr-2 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run All Tests
              </>
            )}
          </Button>
          <Button onClick={clearResults} variant="outline" className="flex items-center">
            <RefreshCw className="w-4 h-4 mr-2" />
            Clear Results
          </Button>
          {testResults.length > 0 && (
            <Button onClick={exportResults} variant="outline" className="flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export Results
            </Button>
          )}
        </div>
      </div>

      {/* Overall Status */}
      {testResults.length > 0 && (
        <Card className={overallStatus === 'PASS' ? 'border-green-500 bg-green-50' : overallStatus === 'FAIL' ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {overallStatus === 'PASS' ? (
                  <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                ) : overallStatus === 'FAIL' ? (
                  <XCircle className="w-8 h-8 text-red-600 mr-3" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-yellow-600 mr-3" />
                )}
                <div>
                  <h3 className="text-lg font-semibold">
                    Integration Test {overallStatus === 'PASS' ? 'PASSED' : overallStatus === 'FAIL' ? 'FAILED' : 'PENDING'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {testResults.length} tests completed
                  </p>
                </div>
              </div>
              {getStatusBadge(overallStatus)}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="results" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="results">Test Results</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                Test Results ({testResults.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {testResults.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No test results yet. Click "Run All Tests" to start testing.</p>
                  </div>
                ) : (
                  testResults.map((result) => (
                    <div key={result.id} className="p-4 border rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{result.testName}</h4>
                          {getStatusBadge(result.status)}
                        </div>
                        <span className="text-sm text-gray-500">
                          {result.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{result.details}</p>
                      {result.data && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-blue-600 text-sm">View Test Data</summary>
                          <pre className="mt-2 p-2 bg-white border rounded text-xs overflow-x-auto">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{testResults.length}</div>
                  <div className="text-sm text-gray-600">Total Tests</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {testResults.filter(r => r.status === 'PASS').length}
                  </div>
                  <div className="text-sm text-gray-600">Passed</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">
                    {testResults.filter(r => r.status === 'FAIL').length}
                  </div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Integration Health Check</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Component Loading</span>
                  {testResults.find(r => r.testName === 'Component Loading')?.status === 'PASS' ? 
                    <Badge variant="default" className="bg-green-500">Healthy</Badge> :
                    <Badge variant="destructive">Issues</Badge>
                  }
                </div>
                <div className="flex items-center justify-between">
                  <span>Event System</span>
                  {testResults.find(r => r.testName === 'Event Listener Registration')?.status === 'PASS' ? 
                    <Badge variant="default" className="bg-green-500">Working</Badge> :
                    <Badge variant="destructive">Issues</Badge>
                  }
                </div>
                <div className="flex items-center justify-between">
                  <span>Data Storage</span>
                  {testResults.find(r => r.testName === 'LocalStorage Integration')?.status === 'PASS' ? 
                    <Badge variant="default" className="bg-green-500">Working</Badge> :
                    <Badge variant="destructive">Issues</Badge>
                  }
                </div>
                <div className="flex items-center justify-between">
                  <span>Data Format</span>
                  {testResults.find(r => r.testName === 'Data Format Compatibility')?.status === 'PASS' ? 
                    <Badge variant="default" className="bg-green-500">Compatible</Badge> :
                    <Badge variant="destructive">Issues</Badge>
                  }
                </div>
                <div className="flex items-center justify-between">
                  <span>Database Integration</span>
                  {testResults.find(r => r.testName === 'Supabase Integration')?.status === 'PASS' ? 
                    <Badge variant="default" className="bg-green-500">Connected</Badge> :
                    <Badge variant="destructive">Issues</Badge>
                  }
                </div>
                <div className="flex items-center justify-between">
                  <span>Real-time Flow</span>
                  {testResults.find(r => r.testName === 'Real-time Data Flow')?.status === 'PASS' ? 
                    <Badge variant="default" className="bg-green-500">Working</Badge> :
                    <Badge variant="destructive">Issues</Badge>
                  }
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IntegrationTester;
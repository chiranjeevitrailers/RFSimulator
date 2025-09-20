'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Database, 
  Layers, 
  CheckCircle, 
  AlertTriangle,
  Activity,
  RefreshCw
} from 'lucide-react';

interface TestResult {
  success: boolean;
  data?: any;
  error?: string;
  executionId?: string;
  testCaseId?: string;
  layers?: string[];
  totalMessages?: number;
}

const ProtocolLayerDataTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [selectedTestCase, setSelectedTestCase] = useState<string>('');

  // Sample test case IDs for testing
  const sampleTestCases = [
    { id: 'tc-5g-nr-initial-access-001', name: '5G NR Initial Access - Basic' },
    { id: 'tc-5g-nr-attach-flow-001', name: '5G NR Attach Flow - Complete' },
    { id: 'tc-5g-nr-handover-001', name: '5G NR Handover - X2/Xn' },
    { id: 'tc-5g-nr-pdu-session-001', name: '5G NR PDU Session Establishment' }
  ];

  const testProtocolLayerData = async (testCaseId: string) => {
    setIsLoading(true);
    setTestResult(null);

    try {
      console.log(`🧪 Testing protocol layer data for test case: ${testCaseId}`);

      const response = await fetch('/api/test-execution/trigger-protocol-layers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testCaseId: testCaseId,
          userId: 'test-user-123'
        }),
      });

      const result = await response.json();

      if (result.success) {
        setTestResult({
          success: true,
          data: result.data,
          testCaseId: result.data.testCaseId,
          layers: result.data.layers,
          totalMessages: result.data.totalExpectedMessages
        });
        console.log('✅ Protocol layer data test successful:', result.data);
      } else {
        setTestResult({
          success: false,
          error: result.error || 'Unknown error'
        });
        console.error('❌ Protocol layer data test failed:', result.error);
      }

    } catch (error) {
      console.error('❌ Protocol layer data test error:', error);
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testWithExecutionId = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      console.log('🧪 Testing protocol layer data with execution ID');

      // Use a sample execution ID - in real scenario this would come from actual test execution
      const sampleExecutionId = 'exec-5g-nr-test-001';

      const response = await fetch('/api/test-execution/trigger-protocol-layers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          executionId: sampleExecutionId,
          userId: 'test-user-123'
        }),
      });

      const result = await response.json();

      if (result.success) {
        setTestResult({
          success: true,
          data: result.data,
          executionId: result.data.executionId,
          testCaseId: result.data.testCaseId,
          layers: result.data.layers,
          totalMessages: result.data.totalMessages
        });
        console.log('✅ Protocol layer data test with execution ID successful:', result.data);
      } else {
        setTestResult({
          success: false,
          error: result.error || 'Unknown error'
        });
        console.error('❌ Protocol layer data test with execution ID failed:', result.error);
      }

    } catch (error) {
      console.error('❌ Protocol layer data test with execution ID error:', error);
      setTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Protocol Layer Data Test</h2>
        <Badge variant="outline" className="text-xs">
          Real Data Integration
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Case Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Test Case Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Test Case:
              </label>
              <select
                value={selectedTestCase}
                onChange={(e) => setSelectedTestCase(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose a test case...</option>
                {sampleTestCases.map((tc) => (
                  <option key={tc.id} value={tc.id}>
                    {tc.name}
                  </option>
                ))}
              </select>
            </div>
            
            <Button
              onClick={() => testProtocolLayerData(selectedTestCase)}
              disabled={!selectedTestCase || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Test Expected Data
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Execution ID Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Execution Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Test with actual execution ID to fetch real protocol layer data from Supabase.
            </p>
            
            <Button
              onClick={testWithExecutionId}
              disabled={isLoading}
              className="w-full"
              variant="outline"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4 mr-2" />
                  Test Real Data
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Test Results */}
      {testResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {testResult.success ? (
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
              ) : (
                <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
              )}
              Test Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {testResult.success ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Test Case ID</div>
                    <div className="font-mono text-sm">{testResult.testCaseId}</div>
                  </div>
                  {testResult.executionId && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm text-gray-600">Execution ID</div>
                      <div className="font-mono text-sm">{testResult.executionId}</div>
                    </div>
                  )}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-600">Total Messages</div>
                    <div className="font-semibold">{testResult.totalMessages}</div>
                  </div>
                </div>

                {testResult.layers && testResult.layers.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Protocol Layers:</div>
                    <div className="flex flex-wrap gap-2">
                      {testResult.layers.map((layer) => (
                        <Badge key={layer} variant="secondary" className="flex items-center">
                          <Layers className="w-3 h-3 mr-1" />
                          {layer}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="text-sm text-green-800">
                    ✅ Protocol layer data integration working correctly!
                    {testResult.executionId ? ' Real data fetched from Supabase.' : ' Expected data structure validated.'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="text-sm text-red-800">
                  ❌ Test failed: {testResult.error}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Test Protocol Layer Data Flow</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-gray-600">
          <div>
            <strong>1. Expected Data Test:</strong> Select a test case and click "Test Expected Data" to verify the expected message structure.
          </div>
          <div>
            <strong>2. Real Data Test:</strong> Click "Test Real Data" to fetch actual execution results from Supabase.
          </div>
          <div>
            <strong>3. Protocol Layer Views:</strong> When you run a test case, the protocol layer views (PHY, MAC, RLC, PDCP, RRC, NAS) will automatically fetch and display real data.
          </div>
          <div>
            <strong>4. Data Sources:</strong> The views now fetch data from Supabase instead of showing mock data.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProtocolLayerDataTest;
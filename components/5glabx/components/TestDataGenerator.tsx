'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Play, 
  Database, 
  MessageSquare, 
  Layers, 
  Activity,
  CheckCircle,
  Send,
  Download
} from 'lucide-react';

interface TestMessage {
  messageName: string;
  messageType: string;
  layer: string;
  protocol: string;
  direction: 'UL' | 'DL' | 'BIDIRECTIONAL';
  messagePayload: any;
  informationElements: any;
  layerParameters: any;
  standardReference: string;
}

const TestDataGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [selectedTestCase, setSelectedTestCase] = useState<string>('5g-attach');

  // Predefined test cases with realistic 5G protocol data
  const testCases = {
    '5g-attach': {
      name: '5G NR Initial Attach',
      description: 'Complete 5G NR initial attach procedure with all protocol layers',
      messages: [
        {
          messageName: 'RRC Connection Request',
          messageType: 'RRC_CONNECTION_REQUEST',
          layer: 'RRC',
          protocol: '5G_NR',
          direction: 'UL',
          messagePayload: {
            establishmentCause: 'mo-Data',
            ueIdentity: 'randomValue',
            spare: '0000'
          },
          informationElements: {
            establishmentCause: { value: 'mo-Data', description: 'Mobile originated data' },
            ueIdentity: { value: 'randomValue', description: 'Random UE identity' }
          },
          layerParameters: {
            rrcState: 'IDLE',
            cellId: '12345',
            tac: '67890'
          },
          standardReference: '3GPP TS 38.331'
        },
        {
          messageName: 'RRC Connection Setup',
          messageType: 'RRC_CONNECTION_SETUP',
          layer: 'RRC',
          protocol: '5G_NR',
          direction: 'DL',
          messagePayload: {
            rrcTransactionIdentifier: 1,
            criticalExtensions: 'rrcConnectionSetup'
          },
          informationElements: {
            rrcTransactionIdentifier: { value: 1, description: 'RRC transaction ID' },
            criticalExtensions: { value: 'rrcConnectionSetup', description: 'Critical extensions' }
          },
          layerParameters: {
            rrcState: 'CONNECTED',
            cellId: '12345',
            tac: '67890'
          },
          standardReference: '3GPP TS 38.331'
        },
        {
          messageName: 'RRC Connection Setup Complete',
          messageType: 'RRC_CONNECTION_SETUP_COMPLETE',
          layer: 'RRC',
          protocol: '5G_NR',
          direction: 'UL',
          messagePayload: {
            rrcTransactionIdentifier: 1,
            criticalExtensions: 'rrcConnectionSetupComplete'
          },
          informationElements: {
            rrcTransactionIdentifier: { value: 1, description: 'RRC transaction ID' },
            criticalExtensions: { value: 'rrcConnectionSetupComplete', description: 'Setup complete' }
          },
          layerParameters: {
            rrcState: 'CONNECTED',
            cellId: '12345',
            tac: '67890'
          },
          standardReference: '3GPP TS 38.331'
        },
        {
          messageName: 'Initial UE Message',
          messageType: 'INITIAL_UE_MESSAGE',
          layer: 'NAS',
          protocol: '5G_NR',
          direction: 'UL',
          messagePayload: {
            nasPdu: 'registrationRequest',
            ueContextRequest: 'requested'
          },
          informationElements: {
            nasPdu: { value: 'registrationRequest', description: 'NAS PDU content' },
            ueContextRequest: { value: 'requested', description: 'UE context request' }
          },
          layerParameters: {
            nasState: 'REGISTERED',
            amfId: 'AMF001',
            guami: 'GUAMI001'
          },
          standardReference: '3GPP TS 38.413'
        },
        {
          messageName: 'PDSCH Data',
          messageType: 'PDSCH_DATA',
          layer: 'PHY',
          protocol: '5G_NR',
          direction: 'DL',
          messagePayload: {
            transportBlockSize: 1024,
            modulationOrder: 4,
            codeRate: 0.5
          },
          informationElements: {
            transportBlockSize: { value: 1024, description: 'Transport block size in bits' },
            modulationOrder: { value: 4, description: 'QPSK modulation' },
            codeRate: { value: 0.5, description: 'Code rate' }
          },
          layerParameters: {
            sinr: 15.5,
            rsrp: -85.2,
            rsrq: -10.8
          },
          standardReference: '3GPP TS 38.211'
        }
      ]
    },
    '5g-handover': {
      name: '5G NR Handover',
      description: '5G NR handover procedure between cells',
      messages: [
        {
          messageName: 'Measurement Report',
          messageType: 'MEASUREMENT_REPORT',
          layer: 'RRC',
          protocol: '5G_NR',
          direction: 'UL',
          messagePayload: {
            measId: 1,
            measResult: {
              rsrp: -80.5,
              rsrq: -8.2
            }
          },
          informationElements: {
            measId: { value: 1, description: 'Measurement ID' },
            measResult: { value: { rsrp: -80.5, rsrq: -8.2 }, description: 'Measurement results' }
          },
          layerParameters: {
            rrcState: 'CONNECTED',
            cellId: '12345',
            targetCellId: '54321'
          },
          standardReference: '3GPP TS 38.331'
        },
        {
          messageName: 'RRC Reconfiguration',
          messageType: 'RRC_RECONFIGURATION',
          layer: 'RRC',
          protocol: '5G_NR',
          direction: 'DL',
          messagePayload: {
            rrcTransactionIdentifier: 2,
            criticalExtensions: 'rrcReconfiguration'
          },
          informationElements: {
            rrcTransactionIdentifier: { value: 2, description: 'RRC transaction ID' },
            criticalExtensions: { value: 'rrcReconfiguration', description: 'Reconfiguration' }
          },
          layerParameters: {
            rrcState: 'CONNECTED',
            cellId: '54321',
            tac: '67890'
          },
          standardReference: '3GPP TS 38.331'
        }
      ]
    },
    'lte-attach': {
      name: 'LTE Initial Attach',
      description: 'LTE initial attach procedure',
      messages: [
        {
          messageName: 'RRC Connection Request',
          messageType: 'RRC_CONNECTION_REQUEST',
          layer: 'RRC',
          protocol: 'LTE',
          direction: 'UL',
          messagePayload: {
            establishmentCause: 'mo-Data',
            ueIdentity: 'randomValue'
          },
          informationElements: {
            establishmentCause: { value: 'mo-Data', description: 'Mobile originated data' },
            ueIdentity: { value: 'randomValue', description: 'Random UE identity' }
          },
          layerParameters: {
            rrcState: 'IDLE',
            cellId: '12345',
            tac: '67890'
          },
          standardReference: '3GPP TS 36.331'
        }
      ]
    }
  };

  // Generate test data
  const generateTestData = async () => {
    setIsGenerating(true);
    
    try {
      const testCase = testCases[selectedTestCase as keyof typeof testCases];
      
      // Simulate realistic timing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const testData = {
        type: '5GLABX_TEST_EXECUTION',
        testCaseId: `test-${Date.now()}`,
        runId: `run-${Date.now()}`,
        testCaseData: {
          testCase: {
            id: `test-${Date.now()}`,
            name: testCase.name,
            description: testCase.description,
            protocol: '5G_NR',
            layer: 'MULTI',
            category: '5G_NR',
            standardReference: '3GPP TS 38.331'
          },
          expectedMessages: testCase.messages,
          expectedInformationElements: testCase.messages.flatMap(msg => 
            Object.entries(msg.informationElements).map(([key, value]) => ({
              ieName: key,
              ieType: typeof value.value,
              ieValue: value.value,
              description: value.description,
              mandatory: true,
              standardReference: msg.standardReference
            }))
          ),
          expectedLayerParameters: testCase.messages.flatMap(msg => 
            Object.entries(msg.layerParameters).map(([key, value]) => ({
              layer: msg.layer,
              parameterName: key,
              parameterType: typeof value,
              parameterValue: value,
              standardReference: msg.standardReference
            }))
          )
        },
        timestamp: Date.now(),
        source: 'TestDataGenerator',
        dataSource: 'GENERATED'
      };
      
      setGeneratedData(testData);
      
      // Send to 5GLabX components
      if (typeof window !== 'undefined') {
        // Method 1: PostMessage
        window.postMessage(testData, '*');
        
        // Method 2: Global variable
        (window as any).latestTestCaseData = testData;
        
        // Method 3: LocalStorage
        localStorage.setItem('5glabx_test_data', JSON.stringify(testData));
        
        // Method 4: Custom event
        window.dispatchEvent(new CustomEvent('testCaseExecutionStarted', {
          detail: testData
        }));
        
        console.log('✅ TestDataGenerator: Generated and sent test data:', {
          testCase: testCase.name,
          messageCount: testCase.messages.length,
          dataSource: 'GENERATED'
        });
      }
      
    } catch (error) {
      console.error('❌ TestDataGenerator: Failed to generate test data:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Export generated data
  const exportData = () => {
    if (!generatedData) return;
    
    const dataStr = JSON.stringify(generatedData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `test-data-${selectedTestCase}-${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Test Data Generator</h1>
          <p className="text-gray-600 mt-1">Generate realistic test data for 5GLabX components</p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={generateTestData}
            disabled={isGenerating}
            className="flex items-center"
          >
            {isGenerating ? (
              <>
                <Activity className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Generate Test Data
              </>
            )}
          </Button>
          {generatedData && (
            <Button onClick={exportData} variant="outline" className="flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="testcases" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="testcases">Test Cases</TabsTrigger>
          <TabsTrigger value="generated">Generated Data</TabsTrigger>
          <TabsTrigger value="messages">Message Details</TabsTrigger>
        </TabsList>

        <TabsContent value="testcases" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(testCases).map(([key, testCase]) => (
              <Card 
                key={key} 
                className={`cursor-pointer transition-all ${
                  selectedTestCase === key ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedTestCase(key)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-lg">{testCase.name}</span>
                    {selectedTestCase === key && (
                      <Badge variant="default" className="bg-blue-500">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Selected
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">{testCase.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Messages:</span>
                    <Badge variant="outline">{testCase.messages.length}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="generated" className="space-y-4">
          {generatedData ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  Generated Test Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <strong>Test Case ID:</strong> {generatedData.testCaseId}
                    </div>
                    <div>
                      <strong>Run ID:</strong> {generatedData.runId}
                    </div>
                    <div>
                      <strong>Test Case Name:</strong> {generatedData.testCaseData.testCase.name}
                    </div>
                    <div>
                      <strong>Message Count:</strong> {generatedData.testCaseData.expectedMessages.length}
                    </div>
                    <div>
                      <strong>IE Count:</strong> {generatedData.testCaseData.expectedInformationElements.length}
                    </div>
                    <div>
                      <strong>Layer Param Count:</strong> {generatedData.testCaseData.expectedLayerParameters.length}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center text-green-800">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <strong>Data Successfully Generated and Sent to 5GLabX Components</strong>
                    </div>
                    <p className="text-green-700 mt-1">
                      The test data has been sent via PostMessage, global variable, localStorage, and custom events.
                    </p>
                  </div>
                  
                  <details>
                    <summary className="cursor-pointer text-blue-600 font-medium">View Full Data Structure</summary>
                    <pre className="mt-2 p-4 bg-gray-100 border rounded text-xs overflow-x-auto max-h-96">
                      {JSON.stringify(generatedData, null, 2)}
                    </pre>
                  </details>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Database className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">No test data generated yet. Select a test case and click "Generate Test Data".</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          {selectedTestCase && testCases[selectedTestCase as keyof typeof testCases] ? (
            <div className="space-y-4">
              {testCases[selectedTestCase as keyof typeof testCases].messages.map((message, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-lg">{message.messageName}</span>
                      <div className="flex space-x-2">
                        <Badge variant="outline">{message.layer}</Badge>
                        <Badge variant="outline">{message.direction}</Badge>
                        <Badge variant="outline">{message.protocol}</Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <strong>Message Type:</strong> {message.messageType}
                      </div>
                      <div>
                        <strong>Standard Reference:</strong> {message.standardReference}
                      </div>
                      
                      <div>
                        <strong>Information Elements:</strong>
                        <div className="mt-2 space-y-1">
                          {Object.entries(message.informationElements).map(([key, value]) => (
                            <div key={key} className="text-sm bg-gray-50 p-2 rounded">
                              <strong>{key}:</strong> {JSON.stringify(value.value)} - {value.description}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <strong>Layer Parameters:</strong>
                        <div className="mt-2 space-y-1">
                          {Object.entries(message.layerParameters).map(([key, value]) => (
                            <div key={key} className="text-sm bg-gray-50 p-2 rounded">
                              <strong>{key}:</strong> {JSON.stringify(value)}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <details>
                        <summary className="cursor-pointer text-blue-600 font-medium">View Message Payload</summary>
                        <pre className="mt-2 p-2 bg-gray-100 border rounded text-xs overflow-x-auto">
                          {JSON.stringify(message.messagePayload, null, 2)}
                        </pre>
                      </details>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">Select a test case to view message details.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestDataGenerator;
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Download, 
  Upload,
  MessageSquare,
  Layers,
  Settings,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Zap,
  Shield,
  Database,
  FileText,
  Code,
  Network,
  Activity,
  TrendingUp,
  Target,
  Award
} from 'lucide-react';

interface TestCaseMessage {
  id: string;
  step_id: string;
  step_order: number;
  timestamp_ms: number;
  direction: 'UL' | 'DL' | 'BIDIRECTIONAL';
  layer: string;
  protocol: string;
  message_type: string;
  message_name: string;
  message_description: string;
  standard_reference: string;
  release_version: string;
  dependencies: string[];
  expected_response_step_id?: string;
  timeout_ms: number;
  validation_criteria: any;
  information_elements?: InformationElement[];
}

interface InformationElement {
  id: string;
  ie_name: string;
  ie_type: string;
  ie_size?: number;
  ie_range?: any;
  ie_value: any;
  ie_value_hex?: string;
  ie_value_binary?: string;
  mandatory: boolean;
  standard_reference: string;
  ie_description: string;
  validation_result: any;
  is_valid: boolean;
  validation_errors: string[];
  validation_warnings: string[];
}

interface LayerParameters {
  layer: string;
  layer_configuration: any;
  layer_capabilities: any;
  performance_parameters: any;
  expected_statistics: any;
  performance_metrics: any;
  standard_reference: string;
  compliance_level: string;
}

interface DetailedTestCase {
  id: string;
  name: string;
  category: string;
  description: string;
  complexity: string;
  protocol_layers: string[];
  test_data: any;
  expected_results: any;
  test_case_id: string;
  version: string;
  tags: string[];
  priority: string;
  is_active: boolean;
  messages: TestCaseMessage[];
  layer_parameters: LayerParameters[];
  compliance_score: number;
  message_compliance: number;
  ie_compliance: number;
}

interface DetailedTestCaseViewerProps {
  userId: string;
}

const DetailedTestCaseViewer: React.FC<DetailedTestCaseViewerProps> = ({ userId }) => {
  const [testCases, setTestCases] = useState<DetailedTestCase[]>([]);
  const [selectedTestCase, setSelectedTestCase] = useState<DetailedTestCase | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showHex, setShowHex] = useState(false);
  const [showBinary, setShowBinary] = useState(false);
  const [filteredLayers, setFilteredLayers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDetailedTestCases();
  }, [userId]);

  const fetchDetailedTestCases = async () => {
    try {
      setLoading(true);
      // Simulate API call to fetch detailed test cases
      const mockTestCases: DetailedTestCase[] = [
        {
          id: '1',
          name: '5G NR Initial Access - Complete Flow',
          category: '5G_NR',
          description: 'Complete 5G NR initial access procedure including RRC connection establishment, NAS registration, and PDU session establishment',
          complexity: 'intermediate',
          protocol_layers: ['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS'],
          test_data: { scenario: 'initial_access', ue_type: 'smartphone', cell_type: 'macro', band: 'n78' },
          expected_results: { success_rate: 95, latency_ms: 150, throughput_mbps: 100 },
          test_case_id: '5NR_INIT_0001',
          version: '1.0',
          tags: ['5G', 'NR', 'initial_access', 'RRC', 'NAS'],
          priority: 'high',
          is_active: true,
          messages: [
            {
              id: '1',
              step_id: 'step_1',
              step_order: 1,
              timestamp_ms: 0,
              direction: 'UL',
              layer: 'PHY',
              protocol: 'NR-PHY',
              message_type: 'RandomAccessPreamble',
              message_name: 'RA Preamble',
              message_description: 'Random Access Preamble transmission',
              standard_reference: 'TS 38.211 6.1.1',
              release_version: 'Release 17',
              dependencies: [],
              expected_response_step_id: 'step_2',
              timeout_ms: 1000,
              validation_criteria: { preamble_id: { min: 0, max: 63 }, ra_rnti: { min: 1, max: 65536 } },
              information_elements: [
                {
                  id: '1',
                  ie_name: 'preamble_id',
                  ie_type: 'integer',
                  ie_size: 6,
                  ie_range: { min: 0, max: 63 },
                  ie_value: { value: 15 },
                  ie_value_hex: '0F',
                  ie_value_binary: '001111',
                  mandatory: true,
                  standard_reference: 'TS 38.211 6.1.1',
                  ie_description: 'Random Access Preamble ID',
                  validation_result: { valid: true, errors: [], warnings: [] },
                  is_valid: true,
                  validation_errors: [],
                  validation_warnings: []
                },
                {
                  id: '2',
                  ie_name: 'ra_rnti',
                  ie_type: 'integer',
                  ie_size: 16,
                  ie_range: { min: 1, max: 65536 },
                  ie_value: { value: 12345 },
                  ie_value_hex: '3039',
                  ie_value_binary: '0011000000111001',
                  mandatory: true,
                  standard_reference: 'TS 38.211 6.1.1',
                  ie_description: 'Random Access RNTI',
                  validation_result: { valid: true, errors: [], warnings: [] },
                  is_valid: true,
                  validation_errors: [],
                  validation_warnings: []
                }
              ]
            },
            {
              id: '2',
              step_id: 'step_2',
              step_order: 2,
              timestamp_ms: 1000,
              direction: 'DL',
              layer: 'PHY',
              protocol: 'NR-PHY',
              message_type: 'RandomAccessResponse',
              message_name: 'RA Response',
              message_description: 'Random Access Response from gNB',
              standard_reference: 'TS 38.211 6.1.2',
              release_version: 'Release 17',
              dependencies: ['step_1'],
              expected_response_step_id: 'step_3',
              timeout_ms: 2000,
              validation_criteria: { ra_rnti: { min: 1, max: 65536 }, ta: { min: 0, max: 1282 } },
              information_elements: [
                {
                  id: '3',
                  ie_name: 'ra_rnti',
                  ie_type: 'integer',
                  ie_size: 16,
                  ie_range: { min: 1, max: 65536 },
                  ie_value: { value: 12345 },
                  ie_value_hex: '3039',
                  ie_value_binary: '0011000000111001',
                  mandatory: true,
                  standard_reference: 'TS 38.211 6.1.2',
                  ie_description: 'Random Access RNTI',
                  validation_result: { valid: true, errors: [], warnings: [] },
                  is_valid: true,
                  validation_errors: [],
                  validation_warnings: []
                },
                {
                  id: '4',
                  ie_name: 'ta',
                  ie_type: 'integer',
                  ie_size: 11,
                  ie_range: { min: 0, max: 1282 },
                  ie_value: { value: 100 },
                  ie_value_hex: '64',
                  ie_value_binary: '01100100',
                  mandatory: true,
                  standard_reference: 'TS 38.211 6.1.2',
                  ie_description: 'Timing Advance',
                  validation_result: { valid: true, errors: [], warnings: [] },
                  is_valid: true,
                  validation_errors: [],
                  validation_warnings: []
                }
              ]
            }
          ],
          layer_parameters: [
            {
              layer: 'PHY',
              layer_configuration: { dl_arfcn: 3732480, ul_arfcn: 3732480, bandwidth: 100, subcarrier_spacing: 30, pci: 123, cell_id: 123456 },
              layer_capabilities: { max_bandwidth: 100, max_mimo_layers: 4, supported_modulations: ['QPSK', '16QAM', '64QAM', '256QAM'], carrier_aggregation: true },
              performance_parameters: { rsrp_target: -80, rsrq_target: -10, sinr_target: 15, cqi_target: 12 },
              expected_statistics: { rsrp: -85, rsrq: -12, sinr: 18, cqi: 13, mcs: 20, bler: 0.01, throughput: 150 },
              performance_metrics: { latency_ms: 1, throughput_mbps: 150, reliability: 99.9 },
              standard_reference: 'TS 38.211',
              compliance_level: 'full'
            },
            {
              layer: 'RRC',
              layer_configuration: { rrc_state: 'RRC_CONNECTED', security_activated: true, mobility_management: 'enabled' },
              layer_capabilities: { states: ['RRC_IDLE', 'RRC_INACTIVE', 'RRC_CONNECTED'], security_algorithms: ['AES-128', 'AES-256'] },
              performance_parameters: { rrc_transaction_id: 1, establishment_cause: 'mo-Data', ue_identity: '0010101234567890' },
              expected_statistics: { rrc_setup_requests: 1, rrc_setup_complete: 1, rrc_reconfigurations: 0 },
              performance_metrics: { latency_ms: 5, throughput_mbps: 150, reliability: 99.5 },
              standard_reference: 'TS 38.331',
              compliance_level: 'full'
            }
          ],
          compliance_score: 98.5,
          message_compliance: 100,
          ie_compliance: 97
        }
      ];
      
      setTestCases(mockTestCases);
      if (mockTestCases.length > 0) {
        setSelectedTestCase(mockTestCases[0]);
        setFilteredLayers(mockTestCases[0].protocol_layers);
      }
    } catch (err) {
      setError('Failed to fetch detailed test cases');
      console.error('Error fetching detailed test cases:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'UL': return '⬆️';
      case 'DL': return '⬇️';
      case 'BIDIRECTIONAL': return '↕️';
      default: return '↔️';
    }
  };

  const getLayerColor = (layer: string) => {
    const colors: Record<string, string> = {
      'PHY': 'bg-red-100 text-red-800',
      'MAC': 'bg-orange-100 text-orange-800',
      'RLC': 'bg-yellow-100 text-yellow-800',
      'PDCP': 'bg-green-100 text-green-800',
      'RRC': 'bg-blue-100 text-blue-800',
      'NAS': 'bg-indigo-100 text-indigo-800',
      'SIP': 'bg-purple-100 text-purple-800',
      'IMS': 'bg-pink-100 text-pink-800'
    };
    return colors[layer] || 'bg-gray-100 text-gray-800';
  };

  const getComplianceColor = (score: number) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getComplianceIcon = (score: number) => {
    if (score >= 95) return <CheckCircle className="w-4 h-4" />;
    if (score >= 85) return <AlertTriangle className="w-4 h-4" />;
    return <XCircle className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <XCircle className="w-8 h-8 mx-auto mb-2" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Detailed Test Case Viewer</h2>
          <p className="text-gray-600">Comprehensive 3GPP-compliant test case analysis with messages, IEs, and layer parameters</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
        </div>
      </div>

      {/* Test Case Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2" />
            Test Case Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testCases.map((testCase) => (
              <Card 
                key={testCase.id} 
                className={`cursor-pointer transition-all ${
                  selectedTestCase?.id === testCase.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
                }`}
                onClick={() => {
                  setSelectedTestCase(testCase);
                  setFilteredLayers(testCase.protocol_layers);
                  setCurrentStep(0);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-sm">{testCase.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {testCase.test_case_id}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">{testCase.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className={getLayerColor(testCase.category)}>
                        {testCase.category}
                      </Badge>
                      <Badge variant="outline">
                        {testCase.complexity}
                      </Badge>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      {getComplianceIcon(testCase.compliance_score)}
                      <span className="ml-1">{testCase.compliance_score}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Test Case View */}
      {selectedTestCase && (
        <div className="space-y-6">
          {/* Test Case Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  {selectedTestCase.name}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge className={getLayerColor(selectedTestCase.category)}>
                    {selectedTestCase.category}
                  </Badge>
                  <Badge variant="outline">
                    {selectedTestCase.complexity}
                  </Badge>
                  <Badge variant="outline">
                    {selectedTestCase.priority}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Compliance Score */}
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Shield className="w-6 h-6 mr-2" />
                    <span className="text-lg font-semibold">3GPP Compliance</span>
                  </div>
                  <div className={`text-3xl font-bold ${getComplianceColor(selectedTestCase.compliance_score)}`}>
                    {selectedTestCase.compliance_score}%
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {selectedTestCase.message_compliance}% Messages | {selectedTestCase.ie_compliance}% IEs
                  </div>
                </div>

                {/* Message Count */}
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <MessageSquare className="w-6 h-6 mr-2" />
                    <span className="text-lg font-semibold">Messages</span>
                  </div>
                  <div className="text-3xl font-bold text-blue-600">
                    {selectedTestCase.messages.length}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {selectedTestCase.protocol_layers.length} Protocol Layers
                  </div>
                </div>

                {/* Information Elements */}
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Code className="w-6 h-6 mr-2" />
                    <span className="text-lg font-semibold">Information Elements</span>
                  </div>
                  <div className="text-3xl font-bold text-green-600">
                    {selectedTestCase.messages.reduce((total, msg) => total + (msg.information_elements?.length || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Across all messages
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for different views */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="messages">Message Flow</TabsTrigger>
              <TabsTrigger value="layers">Layer Parameters</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Test Case Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="w-5 h-5 mr-2" />
                      Test Case Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Description</label>
                      <p className="text-sm text-gray-600 mt-1">{selectedTestCase.description}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Protocol Layers</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedTestCase.protocol_layers.map((layer) => (
                          <Badge key={layer} className={getLayerColor(layer)}>
                            {layer}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Tags</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedTestCase.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Expected Results */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="w-5 h-5 mr-2" />
                      Expected Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(selectedTestCase.expected_results).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {key.replace('_', ' ')}
                        </span>
                        <span className="text-sm text-gray-600">{value}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Message Flow Tab */}
            <TabsContent value="messages" className="space-y-4">
              {/* Message Flow Controls */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Network className="w-5 h-5 mr-2" />
                      Message Flow
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePlayPause}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleStop}
                      >
                        <Square className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleReset}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant={showHex ? "default" : "outline"}
                          size="sm"
                          onClick={() => setShowHex(!showHex)}
                        >
                          <Code className="w-4 h-4 mr-1" />
                          Hex
                        </Button>
                        <Button
                          variant={showBinary ? "default" : "outline"}
                          size="sm"
                          onClick={() => setShowBinary(!showBinary)}
                        >
                          <Code className="w-4 h-4 mr-1" />
                          Binary
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      Step {currentStep + 1} of {selectedTestCase.messages.length}
                    </div>
                  </div>
                  <Progress 
                    value={((currentStep + 1) / selectedTestCase.messages.length) * 100} 
                    className="mb-4"
                  />
                </CardContent>
              </Card>

              {/* Messages List */}
              <div className="space-y-4">
                {selectedTestCase.messages
                  .filter(msg => filteredLayers.includes(msg.layer))
                  .map((message, index) => (
                  <Card 
                    key={message.id} 
                    className={`transition-all ${
                      index === currentStep ? 'ring-2 ring-primary bg-primary/5' : ''
                    }`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                              {message.step_id}
                            </span>
                            <Badge className={getLayerColor(message.layer)}>
                              {message.layer}
                            </Badge>
                            <span className="text-sm text-gray-600">
                              {getDirectionIcon(message.direction)}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold">{message.message_name}</h3>
                            <p className="text-sm text-gray-600">{message.message_description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">
                            {message.timestamp_ms}ms
                          </div>
                          <div className="text-xs text-gray-500">
                            {message.protocol}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Information Elements */}
                      {message.information_elements && message.information_elements.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-medium text-sm">Information Elements</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {message.information_elements.map((ie) => (
                              <div key={ie.id} className="border rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-mono text-sm font-medium">{ie.ie_name}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {ie.ie_type}
                                    </Badge>
                                    {ie.mandatory && (
                                      <Badge variant="destructive" className="text-xs">
                                        Mandatory
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center">
                                    {ie.is_valid ? (
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <XCircle className="w-4 h-4 text-red-600" />
                                    )}
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div>
                                    <span className="text-xs text-gray-600">Value: </span>
                                    <span className="font-mono text-sm">
                                      {JSON.stringify(ie.ie_value)}
                                    </span>
                                  </div>
                                  {showHex && ie.ie_value_hex && (
                                    <div>
                                      <span className="text-xs text-gray-600">Hex: </span>
                                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                        {ie.ie_value_hex}
                                      </span>
                                    </div>
                                  )}
                                  {showBinary && ie.ie_value_binary && (
                                    <div>
                                      <span className="text-xs text-gray-600">Binary: </span>
                                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                        {ie.ie_value_binary}
                                      </span>
                                    </div>
                                  )}
                                  <div>
                                    <span className="text-xs text-gray-600">Reference: </span>
                                    <span className="text-xs text-blue-600">{ie.standard_reference}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Layer Parameters Tab */}
            <TabsContent value="layers" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedTestCase.layer_parameters.map((layerParam) => (
                  <Card key={layerParam.layer}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Layers className="w-5 h-5 mr-2" />
                          {layerParam.layer} Layer
                        </div>
                        <Badge variant="outline">
                          {layerParam.compliance_level}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Configuration */}
                      <div>
                        <h4 className="font-medium text-sm mb-2">Configuration</h4>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <pre className="text-xs text-gray-700 overflow-x-auto">
                            {JSON.stringify(layerParam.layer_configuration, null, 2)}
                          </pre>
                        </div>
                      </div>

                      {/* Capabilities */}
                      <div>
                        <h4 className="font-medium text-sm mb-2">Capabilities</h4>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <pre className="text-xs text-gray-700 overflow-x-auto">
                            {JSON.stringify(layerParam.layer_capabilities, null, 2)}
                          </pre>
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      <div>
                        <h4 className="font-medium text-sm mb-2">Performance Metrics</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(layerParam.performance_metrics).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 capitalize">
                                {key.replace('_', ' ')}
                              </span>
                              <span className="font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Expected Statistics */}
                      <div>
                        <h4 className="font-medium text-sm mb-2">Expected Statistics</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(layerParam.expected_statistics).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 capitalize">
                                {key.replace('_', ' ')}
                              </span>
                              <span className="font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Analysis Tab */}
            <TabsContent value="analysis" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Compliance Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="w-5 h-5 mr-2" />
                      Compliance Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className={`text-4xl font-bold ${getComplianceColor(selectedTestCase.compliance_score)}`}>
                        {selectedTestCase.compliance_score}%
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Overall 3GPP Compliance</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Message Compliance</span>
                        <span className="text-sm font-medium">{selectedTestCase.message_compliance}%</span>
                      </div>
                      <Progress value={selectedTestCase.message_compliance} />
                      <div className="flex items-center justify-between">
                        <span className="text-sm">IE Compliance</span>
                        <span className="text-sm font-medium">{selectedTestCase.ie_compliance}%</span>
                      </div>
                      <Progress value={selectedTestCase.ie_compliance} />
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Analysis */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Performance Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {selectedTestCase.expected_results.latency_ms}ms
                        </div>
                        <p className="text-xs text-gray-600">Latency</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {selectedTestCase.expected_results.throughput_mbps} Mbps
                        </div>
                        <p className="text-xs text-gray-600">Throughput</p>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {selectedTestCase.expected_results.success_rate}%
                      </div>
                      <p className="text-xs text-gray-600">Success Rate</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default DetailedTestCaseViewer;
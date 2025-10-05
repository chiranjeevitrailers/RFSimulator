'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Settings, 
  Play, 
  Save, 
  Download, 
  Upload, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Plus,
  Edit,
  Trash2,
  Eye,
  Copy,
  RefreshCw,
  Zap,
  Wifi,
  Phone,
  Car,
  Satellite,
  Network,
  Shield,
  Activity,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  ChevronDown,
  ChevronRight,
  Clock,
  Target,
  BarChart3,
  Layers,
  Database,
  TestTube,
  Globe,
  Smartphone,
  Radio,
  Signal,
  Battery,
  WifiOff,
  WifiIcon,
  SignalHigh,
  SignalLow,
  SignalZero,
  SignalMedium,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  TrendingDown,
  Minus,
  PlusCircle,
  Info,
  AlertCircle,
  CheckCircle2,
  XCircle2
} from 'lucide-react';
import { enhancedTestCaseTemplateGenerator, EnhancedTestCaseTemplate, CallFlowMessage, LayerParameterUpdate } from '@/utils/EnhancedTestCaseTemplates';

interface EnhancedTestCaseBuilderProps {
  onTestCaseCreated?: (testCase: EnhancedTestCaseTemplate) => void;
  onTestCaseUpdated?: (testCase: EnhancedTestCaseTemplate) => void;
}

const EnhancedTestCaseBuilder: React.FC<EnhancedTestCaseBuilderProps> = ({ 
  onTestCaseCreated, 
  onTestCaseUpdated 
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [testCase, setTestCase] = useState<EnhancedTestCaseTemplate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('browse');
  const [activeView, setActiveView] = useState('callflow');
  const [selectedMessage, setSelectedMessage] = useState<string>('');
  const [selectedLayer, setSelectedLayer] = useState<string>('PHY');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationData, setSimulationData] = useState<LayerParameterUpdate[]>([]);

  const availableTemplates = enhancedTestCaseTemplateGenerator.getAvailableTemplates();

  const technologyIcons = {
    'LTE': <Wifi className="w-4 h-4" />,
    '5G_SA': <Zap className="w-4 h-4" />,
    'LTE_5G': <Network className="w-4 h-4" />
  };

  const layerIcons = {
    'PHY': <Radio className="w-4 h-4" />,
    'MAC': <Layers className="w-4 h-4" />,
    'RLC': <Network className="w-4 h-4" />,
    'PDCP': <Shield className="w-4 h-4" />,
    'RRC': <Settings className="w-4 h-4" />,
    'NAS': <Activity className="w-4 h-4" />
  };

  const directionIcons = {
    'UE_TO_NETWORK': <ArrowRight className="w-4 h-4 text-blue-600" />,
    'NETWORK_TO_UE': <ArrowLeft className="w-4 h-4 text-green-600" />,
    'INTERNAL': <ArrowUp className="w-4 h-4 text-gray-600" />
  };

  const trendIcons = {
    'INCREASING': <TrendingUp className="w-4 h-4 text-green-600" />,
    'DECREASING': <TrendingDown className="w-4 h-4 text-red-600" />,
    'STABLE': <Minus className="w-4 h-4 text-gray-600" />,
    'FLUCTUATING': <RefreshCw className="w-4 h-4 text-yellow-600" />
  };

  const criticalityColors = {
    'NORMAL': 'text-green-600 bg-green-100',
    'WARNING': 'text-yellow-600 bg-yellow-100',
    'CRITICAL': 'text-orange-600 bg-orange-100',
    'ERROR': 'text-red-600 bg-red-100'
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setIsGenerating(true);
    
    try {
      const generatedTestCase = enhancedTestCaseTemplateGenerator.generateTestCase(templateId);
      setTestCase(generatedTestCase);
      setActiveTab('edit');
      setActiveView('callflow');
    } catch (error) {
      console.error('Error generating test case:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!testCase) return;
    
    setIsSaving(true);
    try {
      const testCaseJson = JSON.stringify(testCase, null, 2);
      const blob = new Blob([testCaseJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${testCase.testCaseId}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      if (onTestCaseCreated) {
        onTestCaseCreated(testCase);
      }
    } catch (error) {
      console.error('Error saving test case:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const startSimulation = () => {
    if (!testCase) return;
    
    setIsSimulating(true);
    // Simulate dynamic parameter changes
    const interval = setInterval(() => {
      const updates: LayerParameterUpdate[] = [];
      
      // Generate random parameter updates
      Object.entries(testCase.layerParameters).forEach(([layer, parameters]) => {
        parameters.forEach(param => {
          const change = (Math.random() - 0.5) * param.variation;
          const newValue = Math.max(param.minValue, Math.min(param.maxValue, param.currentValue + change));
          
          updates.push({
            layer,
            parameterName: param.parameterName,
            currentValue: newValue,
            previousValue: param.currentValue,
            change: newValue - param.currentValue,
            changePercent: ((newValue - param.currentValue) / param.currentValue) * 100,
            unit: param.unit,
            timestamp: Date.now(),
            trend: change > 0 ? 'INCREASING' : change < 0 ? 'DECREASING' : 'STABLE',
            criticality: newValue < param.criticalThresholds.critical ? 'ERROR' : 
                        newValue < param.criticalThresholds.error ? 'CRITICAL' :
                        newValue < param.criticalThresholds.warning ? 'WARNING' : 'NORMAL',
            description: param.description
          });
          
          // Update the parameter value
          param.currentValue = newValue;
        });
      });
      
      setSimulationData(prev => [...prev, ...updates].slice(-100)); // Keep last 100 updates
    }, 1000);
    
    // Stop simulation after 30 seconds
    setTimeout(() => {
      clearInterval(interval);
      setIsSimulating(false);
    }, 30000);
  };

  const renderCallFlowView = () => {
    if (!testCase) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Call Flow Messages</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={startSimulation}
              disabled={isSimulating}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSimulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              <span>{isSimulating ? 'Simulating...' : 'Start Simulation'}</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {testCase.callFlow.map((message, index) => (
            <div
              key={message.messageId}
              className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                selectedMessage === message.messageId
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedMessage(message.messageId)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {directionIcons[message.direction]}
                  <span className="font-medium text-gray-900">{message.messageName}</span>
                  <span className="text-sm text-gray-500">({message.layer})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">{message.timestamp}ms</span>
                  <span className="text-xs text-gray-500">{message.duration}ms</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{message.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Information Elements</h4>
                  <div className="space-y-1">
                    {message.informationElements.slice(0, 3).map((ie, ieIndex) => (
                      <div key={ieIndex} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">{ie.name}</span>
                        <span className="text-gray-900">{ie.value}</span>
                      </div>
                    ))}
                    {message.informationElements.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{message.informationElements.length - 3} more IEs
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Layer Parameters</h4>
                  <div className="space-y-1">
                    {message.layerParameters.slice(0, 3).map((param, paramIndex) => (
                      <div key={paramIndex} className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">{param.parameterName}</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-gray-900">{param.currentValue} {param.unit}</span>
                          {trendIcons[param.trend]}
                        </div>
                      </div>
                    ))}
                    {message.layerParameters.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{message.layerParameters.length - 3} more parameters
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLayerStatsView = () => {
    if (!testCase) return null;

    const currentLayer = testCase.layerParameters[selectedLayer as keyof typeof testCase.layerParameters] || [];

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Layer Statistics</h3>
          <div className="flex items-center space-x-2">
            <select
              value={selectedLayer}
              onChange={(e) => setSelectedLayer(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.keys(testCase.layerParameters).map(layer => (
                <option key={layer} value={layer}>{layer}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentLayer.map((param, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {layerIcons[selectedLayer as keyof typeof layerIcons]}
                  <span className="font-medium text-gray-900">{param.parameterName}</span>
                </div>
                <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                  param.currentValue < param.criticalThresholds.critical ? 'bg-red-100 text-red-800' :
                  param.currentValue < param.criticalThresholds.error ? 'bg-orange-100 text-orange-800' :
                  param.currentValue < param.criticalThresholds.warning ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {param.currentValue < param.criticalThresholds.critical ? 'ERROR' :
                   param.currentValue < param.criticalThresholds.error ? 'CRITICAL' :
                   param.currentValue < param.criticalThresholds.warning ? 'WARNING' : 'NORMAL'}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Current Value</span>
                  <span className="font-medium text-gray-900">{param.currentValue} {param.unit}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Base Value</span>
                  <span className="text-gray-900">{param.baseValue} {param.unit}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Range</span>
                  <span className="text-gray-900">{param.minValue} - {param.maxValue} {param.unit}</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${((param.currentValue - param.minValue) / (param.maxValue - param.minValue)) * 100}%`
                    }}
                  ></div>
                </div>
                
                <div className="text-xs text-gray-500">
                  Update every {param.updateInterval}ms
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Real-time Parameter Updates */}
        {simulationData.length > 0 && (
          <div className="mt-6">
            <h4 className="text-md font-medium text-gray-900 mb-3">Real-time Parameter Updates</h4>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {simulationData.slice(-20).reverse().map((update, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    {trendIcons[update.trend]}
                    <span className="text-sm font-medium">{update.layer}.{update.parameterName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-900">{update.currentValue} {update.unit}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${criticalityColors[update.criticality]}`}>
                      {update.criticality}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTemplateBrowser = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Enhanced Test Case Templates</h2>
        <p className="text-gray-600">Complete call flows with all IEs and dynamic layer parameters</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableTemplates.map((templateId) => {
          const template = enhancedTestCaseTemplateGenerator.getTemplate(templateId);
          if (!template) return null;

          const techIcon = technologyIcons[template.technology as keyof typeof technologyIcons] || <Network className="w-4 h-4" />;

          return (
            <div
              key={templateId}
              onClick={() => handleTemplateSelect(templateId)}
              className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center space-x-2 mb-2">
                {techIcon}
                <span className="font-medium text-gray-900">{template.name}</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-blue-600 font-medium">{template.technology}</span>
                  <span className="text-xs text-gray-500">{template.category}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs text-gray-500">{template.duration}min</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderTestCaseEditor = () => {
    if (!testCase) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Enhanced Test Case Editor</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Test Case ID</label>
                <input
                  type="text"
                  value={testCase.testCaseId}
                  onChange={(e) => setTestCase({...testCase, testCaseId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={testCase.name}
                  onChange={(e) => setTestCase({...testCase, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={testCase.description}
                  onChange={(e) => setTestCase({...testCase, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Call Flow Summary */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Call Flow Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Messages</span>
                <span className="font-medium text-gray-900">{testCase.callFlow.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total IEs</span>
                <span className="font-medium text-gray-900">
                  {testCase.callFlow.reduce((sum, msg) => sum + msg.informationElements.length, 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Duration</span>
                <span className="font-medium text-gray-900">
                  {testCase.callFlow.reduce((sum, msg) => sum + msg.duration, 0)}ms
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Layers</span>
                <span className="font-medium text-gray-900">
                  {Object.keys(testCase.layerParameters).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">Enhanced Test Case Builder</h1>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              Complete Call Flows
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'browse'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Browse Templates
            </button>
            <button
              onClick={() => setActiveTab('edit')}
              disabled={!testCase}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'edit'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              } ${!testCase ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Edit Test Case
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'browse' && renderTemplateBrowser()}
        {activeTab === 'edit' && (
          <div className="space-y-6">
            {renderTestCaseEditor()}
            
            {/* View Tabs */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => setActiveView('callflow')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeView === 'callflow'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 inline mr-2" />
                    Call Flow
                  </button>
                  <button
                    onClick={() => setActiveView('layerstats')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeView === 'layerstats'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4 inline mr-2" />
                    Layer Stats
                  </button>
                </nav>
              </div>
              
              <div className="p-6">
                {activeView === 'callflow' && renderCallFlowView()}
                {activeView === 'layerstats' && renderLayerStatsView()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedTestCaseBuilder;
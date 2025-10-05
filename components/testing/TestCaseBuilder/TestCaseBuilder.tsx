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
  Activity
} from 'lucide-react';
import { testCaseTemplateGenerator, TestCaseTemplate, ValidationResult } from '@/utils/TestCaseTemplateGenerator';

interface TestCaseBuilderProps {
  onTestCaseCreated?: (testCase: TestCaseTemplate) => void;
  onTestCaseUpdated?: (testCase: TestCaseTemplate) => void;
}

const TestCaseBuilder: React.FC<TestCaseBuilderProps> = ({ onTestCaseCreated, onTestCaseUpdated }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [testCase, setTestCase] = useState<TestCaseTemplate | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('template');
  const [customizations, setCustomizations] = useState<Partial<TestCaseTemplate>>({});

  const availableTemplates = testCaseTemplateGenerator.getAvailableTemplates();

  const technologyIcons = {
    'LTE': <Wifi className="w-4 h-4" />,
    '5G_NR': <Zap className="w-4 h-4" />,
    'O_RAN': <Network className="w-4 h-4" />,
    'NB_IOT': <Activity className="w-4 h-4" />,
    'C_V2X': <Car className="w-4 h-4" />,
    'NTN': <Satellite className="w-4 h-4" />
  };

  const categoryIcons = {
    'POWER_ON': <Play className="w-4 h-4" />,
    'INITIAL_ACCESS': <Activity className="w-4 h-4" />,
    'HANDOVER': <RefreshCw className="w-4 h-4" />,
    'CALL_SETUP': <Phone className="w-4 h-4" />,
    'DATA_SESSION': <FileText className="w-4 h-4" />,
    'PDU_SESSION': <FileText className="w-4 h-4" />,
    'MOBILITY': <RefreshCw className="w-4 h-4" />,
    'RIC_TEST': <Settings className="w-4 h-4" />,
    'XAPP_DEPLOYMENT': <Settings className="w-4 h-4" />,
    'ATTACH': <Shield className="w-4 h-4" />,
    'DATA_TRANSMISSION': <FileText className="w-4 h-4" />,
    'SIDELINK': <Network className="w-4 h-4" />,
    'SAFETY_MESSAGE': <Shield className="w-4 h-4" />,
    'SATELLITE_ACCESS': <Satellite className="w-4 h-4" />
  };

  const handleTemplateSelect = (templateType: string) => {
    setSelectedTemplate(templateType);
    setIsGenerating(true);
    
    try {
      const generatedTestCase = testCaseTemplateGenerator.generateTestCase(templateType, customizations);
      setTestCase(generatedTestCase);
      setActiveTab('edit');
    } catch (error) {
      console.error('Error generating test case:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleValidate = async () => {
    if (!testCase) return;
    
    setIsValidating(true);
    try {
      const result = testCaseTemplateGenerator.validateTestCase(testCase);
      setValidationResult(result);
    } catch (error) {
      console.error('Error validating test case:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const handleSave = async () => {
    if (!testCase) return;
    
    setIsSaving(true);
    try {
      // Save test case to file
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

  const handleCustomize = (field: string, value: any) => {
    setCustomizations(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderTemplateSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Test Case Template</h2>
        <p className="text-gray-600">Choose a 3GPP-compliant template to create your test case</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableTemplates.map((templateType) => {
          const template = testCaseTemplateGenerator.getTemplate(templateType);
          if (!template) return null;

          const techIcon = technologyIcons[template.technology as keyof typeof technologyIcons] || <Network className="w-4 h-4" />;
          const catIcon = categoryIcons[template.category as keyof typeof categoryIcons] || <Settings className="w-4 h-4" />;

          return (
            <div
              key={templateType}
              onClick={() => handleTemplateSelect(templateType)}
              className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center space-x-2 mb-2">
                {techIcon}
                <span className="font-medium text-gray-900">{template.name}</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {catIcon}
                  <span className="text-xs text-gray-500">{template.category}</span>
                </div>
                <span className="text-xs text-blue-600 font-medium">{template.technology}</span>
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
          <h2 className="text-2xl font-bold text-gray-900">Edit Test Case</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleValidate}
              disabled={isValidating}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isValidating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              <span>Validate</span>
            </button>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Technology</label>
                  <select
                    value={testCase.technology}
                    onChange={(e) => setTestCase({...testCase, technology: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="LTE">LTE</option>
                    <option value="5G_NR">5G NR</option>
                    <option value="O_RAN">O-RAN</option>
                    <option value="NB_IOT">NB-IoT</option>
                    <option value="C_V2X">C-V2X</option>
                    <option value="NTN">NTN</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={testCase.category}
                    onChange={(e) => setTestCase({...testCase, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="POWER_ON">Power On</option>
                    <option value="INITIAL_ACCESS">Initial Access</option>
                    <option value="HANDOVER">Handover</option>
                    <option value="CALL_SETUP">Call Setup</option>
                    <option value="DATA_SESSION">Data Session</option>
                    <option value="PDU_SESSION">PDU Session</option>
                    <option value="MOBILITY">Mobility</option>
                    <option value="RIC_TEST">RIC Test</option>
                    <option value="XAPP_DEPLOYMENT">xApp Deployment</option>
                    <option value="ATTACH">Attach</option>
                    <option value="DATA_TRANSMISSION">Data Transmission</option>
                    <option value="SIDELINK">Sidelink</option>
                    <option value="SAFETY_MESSAGE">Safety Message</option>
                    <option value="SATELLITE_ACCESS">Satellite Access</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* UE Profile */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">UE Profile</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">IMSI</label>
                <input
                  type="text"
                  value={testCase.ueProfile.imsi}
                  onChange={(e) => setTestCase({
                    ...testCase,
                    ueProfile: {...testCase.ueProfile, imsi: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">IMEI</label>
                <input
                  type="text"
                  value={testCase.ueProfile.imei}
                  onChange={(e) => setTestCase({
                    ...testCase,
                    ueProfile: {...testCase.ueProfile, imei: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default APN</label>
                <input
                  type="text"
                  value={testCase.ueProfile.defaultApn}
                  onChange={(e) => setTestCase({
                    ...testCase,
                    ueProfile: {...testCase.ueProfile, defaultApn: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Cell Configuration */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cell Configuration</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">MCC</label>
                  <input
                    type="text"
                    value={testCase.cellConfig.mcc}
                    onChange={(e) => setTestCase({
                      ...testCase,
                      cellConfig: {...testCase.cellConfig, mcc: e.target.value}
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">MNC</label>
                  <input
                    type="text"
                    value={testCase.cellConfig.mnc}
                    onChange={(e) => setTestCase({
                      ...testCase,
                      cellConfig: {...testCase.cellConfig, mnc: e.target.value}
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">TAC</label>
                <input
                  type="number"
                  value={testCase.cellConfig.tac}
                  onChange={(e) => setTestCase({
                    ...testCase,
                    cellConfig: {...testCase.cellConfig, tac: parseInt(e.target.value)}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bandwidth (MHz)</label>
                <input
                  type="number"
                  value={testCase.cellConfig.bandwidth}
                  onChange={(e) => setTestCase({
                    ...testCase,
                    cellConfig: {...testCase.cellConfig, bandwidth: parseFloat(e.target.value)}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Validation Results */}
          {validationResult && (
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Validation Results</h3>
              <div className="space-y-3">
                {validationResult.errors.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-red-600 mb-2">Errors ({validationResult.errors.length})</h4>
                    <div className="space-y-1">
                      {validationResult.errors.map((error, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-red-600">
                          <XCircle className="w-4 h-4" />
                          <span>{error}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {validationResult.warnings.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-yellow-600 mb-2">Warnings ({validationResult.warnings.length})</h4>
                    <div className="space-y-1">
                      {validationResult.warnings.map((warning, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm text-yellow-600">
                          <AlertTriangle className="w-4 h-4" />
                          <span>{warning}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {validationResult.isValid && validationResult.errors.length === 0 && (
                  <div className="flex items-center space-x-2 text-sm text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>Test case is valid and ready for use</span>
                  </div>
                )}
              </div>
            </div>
          )}
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
            <h1 className="text-xl font-bold text-gray-900">Test Case Builder</h1>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              3GPP Compliant
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('template')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'template'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Templates
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
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'template' && renderTemplateSelection()}
        {activeTab === 'edit' && renderTestCaseEditor()}
      </div>
    </div>
  );
};

export default TestCaseBuilder;
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { 
  Play, 
  Pause, 
  Square, 
  RefreshCw, 
  Phone, 
  Smartphone, 
  Wifi, 
  Server,
  ArrowRight,
  ArrowDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Activity
} from 'lucide-react';

interface CallFlowStep {
  id: string;
  timestamp: number;
  direction: 'UL' | 'DL' | 'BIDIRECTIONAL';
  layer: string;
  messageName: string;
  messageType: string;
  source: string;
  target: string;
  description: string;
  status: 'success' | 'warning' | 'error' | 'pending';
  duration?: number;
  details?: any;
}

interface CallFlow {
  id: string;
  name: string;
  type: '5G_ATTACH' | '5G_HANDOVER' | '5G_PDU_SESSION' | '4G_ATTACH' | 'IMS_CALL';
  status: 'active' | 'completed' | 'failed';
  startTime: number;
  endTime?: number;
  steps: CallFlowStep[];
  ueId: string;
  cellId: string;
}

const RealisticCallFlowView: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [callFlows, setCallFlows] = useState<CallFlow[]>([]);
  const [selectedFlow, setSelectedFlow] = useState<CallFlow | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const callFlowTemplates = {
    '5G_ATTACH': [
      { messageName: 'RRC Setup Request', layer: 'RRC', direction: 'UL', description: 'UE initiates RRC connection' },
      { messageName: 'RRC Setup', layer: 'RRC', direction: 'DL', description: 'gNB responds with RRC setup' },
      { messageName: 'RRC Setup Complete', layer: 'RRC', direction: 'UL', description: 'UE completes RRC setup' },
      { messageName: 'Registration Request', layer: 'NAS', direction: 'UL', description: 'UE requests network registration' },
      { messageName: 'Authentication Request', layer: 'NAS', direction: 'DL', description: 'Network requests authentication' },
      { messageName: 'Authentication Response', layer: 'NAS', direction: 'UL', description: 'UE provides authentication' },
      { messageName: 'Security Mode Command', layer: 'NAS', direction: 'DL', description: 'Network activates security' },
      { messageName: 'Security Mode Complete', layer: 'NAS', direction: 'UL', description: 'UE completes security setup' },
      { messageName: 'Registration Accept', layer: 'NAS', direction: 'DL', description: 'Network accepts registration' },
      { messageName: 'Registration Complete', layer: 'NAS', direction: 'UL', description: 'UE completes registration' }
    ],
    '5G_PDU_SESSION': [
      { messageName: 'PDU Session Establishment Request', layer: 'NAS', direction: 'UL', description: 'UE requests PDU session' },
      { messageName: 'PDU Session Establishment Accept', layer: 'NAS', direction: 'DL', description: 'Network accepts PDU session' },
      { messageName: 'PDU Session Establishment Complete', layer: 'NAS', direction: 'UL', description: 'UE completes PDU session setup' }
    ],
    '5G_HANDOVER': [
      { messageName: 'Measurement Report', layer: 'RRC', direction: 'UL', description: 'UE reports measurements' },
      { messageName: 'Handover Request', layer: 'RRC', direction: 'DL', description: 'Source gNB initiates handover' },
      { messageName: 'Handover Request Acknowledge', layer: 'RRC', direction: 'UL', description: 'Target gNB acknowledges handover' },
      { messageName: 'RRC Reconfiguration', layer: 'RRC', direction: 'DL', description: 'UE receives handover command' },
      { messageName: 'RRC Reconfiguration Complete', layer: 'RRC', direction: 'UL', description: 'UE completes handover' }
    ]
  };

  const generateCallFlow = (type: keyof typeof callFlowTemplates): CallFlow => {
    const template = callFlowTemplates[type];
    const flowId = `flow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();
    
    const steps: CallFlowStep[] = template.map((step, index) => ({
      id: `step_${flowId}_${index}`,
      timestamp: startTime + (index * 1000),
      direction: step.direction as 'UL' | 'DL' | 'BIDIRECTIONAL',
      layer: step.layer,
      messageName: step.messageName,
      messageType: step.messageName.replace(/\s+/g, '_').toUpperCase(),
      source: step.direction === 'UL' ? 'UE' : 'gNB',
      target: step.direction === 'UL' ? 'gNB' : 'UE',
      description: step.description,
      status: 'pending' as const,
      duration: Math.floor(Math.random() * 100) + 50
    }));

    return {
      id: flowId,
      name: `${type.replace(/_/g, ' ')} Flow`,
      type,
      status: 'active',
      startTime,
      steps,
      ueId: `UE_${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      cellId: `Cell_${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
    };
  };

  const startCallFlowSimulation = () => {
    setIsRunning(true);
    const flowTypes: (keyof typeof callFlowTemplates)[] = ['5G_ATTACH', '5G_PDU_SESSION', '5G_HANDOVER'];
    const randomType = flowTypes[Math.floor(Math.random() * flowTypes.length)];
    const newFlow = generateCallFlow(randomType);
    
    setCallFlows(prev => [newFlow, ...prev.slice(0, 4)]);
    setSelectedFlow(newFlow);
    setCurrentStep(0);
    
    // Simulate step progression
    simulateStepProgression(newFlow);
  };

  const simulateStepProgression = (flow: CallFlow) => {
    let stepIndex = 0;
    
    const progressStep = () => {
      if (stepIndex < flow.steps.length) {
        setCallFlows(prev => prev.map(f => 
          f.id === flow.id 
            ? {
                ...f,
                steps: f.steps.map((step, index) => 
                  index === stepIndex 
                    ? { ...step, status: 'success' as const }
                    : step
                )
              }
            : f
        ));
        
        setCurrentStep(stepIndex + 1);
        stepIndex++;
        
        if (stepIndex < flow.steps.length) {
          setTimeout(progressStep, 2000 + Math.random() * 3000);
        } else {
          // Complete the flow
          setCallFlows(prev => prev.map(f => 
            f.id === flow.id 
              ? { ...f, status: 'completed', endTime: Date.now() }
              : f
          ));
          setIsRunning(false);
        }
      }
    };
    
    setTimeout(progressStep, 1000);
  };

  const stopSimulation = () => {
    setIsRunning(false);
    setCallFlows(prev => prev.map(f => ({ ...f, status: 'failed' as const, endTime: Date.now() })));
  };

  const clearFlows = () => {
    setCallFlows([]);
    setSelectedFlow(null);
    setCurrentStep(0);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-gray-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'UL': return <ArrowRight className="w-4 h-4 text-blue-500" />;
      case 'DL': return <ArrowDown className="w-4 h-4 text-green-500" />;
      case 'BIDIRECTIONAL': return <Activity className="w-4 h-4 text-purple-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getLayerColor = (layer: string) => {
    switch (layer) {
      case 'PHY': return 'bg-blue-100 text-blue-800';
      case 'MAC': return 'bg-green-100 text-green-800';
      case 'RLC': return 'bg-yellow-100 text-yellow-800';
      case 'PDCP': return 'bg-purple-100 text-purple-800';
      case 'RRC': return 'bg-red-100 text-red-800';
      case 'NAS': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Call Flow Analysis</h1>
          <p className="text-gray-600 mt-1">Real-time 5G/4G Protocol Call Flow Monitoring</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-sm text-gray-600">
              {isRunning ? 'LIVE SIMULATION' : 'STOPPED'}
            </span>
          </div>
          <Button
            onClick={isRunning ? stopSimulation : startCallFlowSimulation}
            className={isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
          >
            {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isRunning ? 'Stop Simulation' : 'Start Simulation'}
          </Button>
          <Button onClick={clearFlows} variant="outline">
            <Square className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Call Flow List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Active Call Flows ({callFlows.length})
                </div>
                <Button size="sm" variant="outline" onClick={() => setCallFlows(prev => [...prev])}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {callFlows.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Phone className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>No call flows yet. Start a simulation to see call flows.</p>
                  </div>
                ) : (
                  callFlows.map((flow) => (
                    <div
                      key={flow.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedFlow?.id === flow.id ? 'bg-blue-50 border-blue-200' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedFlow(flow)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{flow.name}</h4>
                        <Badge className={
                          flow.status === 'active' ? 'bg-green-100 text-green-800' :
                          flow.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {flow.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div className="flex justify-between">
                          <span>UE ID:</span>
                          <span className="font-mono">{flow.ueId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cell ID:</span>
                          <span className="font-mono">{flow.cellId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Steps:</span>
                          <span>{flow.steps.filter(s => s.status === 'success').length}/{flow.steps.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Started:</span>
                          <span>{new Date(flow.startTime).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call Flow Details */}
        <div className="lg:col-span-2">
          {selectedFlow ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Smartphone className="w-5 h-5 mr-2" />
                    {selectedFlow.name} - {selectedFlow.ueId}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getLayerColor(selectedFlow.type.split('_')[0])}>
                      {selectedFlow.type}
                    </Badge>
                    <Badge className={
                      selectedFlow.status === 'active' ? 'bg-green-100 text-green-800' :
                      selectedFlow.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {selectedFlow.status}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedFlow.steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`flex items-center space-x-4 p-3 border rounded-lg transition-colors ${
                        step.status === 'success' ? 'bg-green-50 border-green-200' :
                        step.status === 'error' ? 'bg-red-50 border-red-200' :
                        step.status === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                        'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {getStatusIcon(step.status)}
                      </div>
                      <div className="flex-shrink-0">
                        {getDirectionIcon(step.direction)}
                      </div>
                      <div className="flex-shrink-0">
                        <Badge className={getLayerColor(step.layer)}>
                          {step.layer}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">{step.messageName}</h4>
                          <span className="text-sm text-gray-500">
                            {new Date(step.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span>{step.source} → {step.target}</span>
                          {step.duration && <span>Duration: {step.duration}ms</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center text-gray-500">
                  <Phone className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">No Call Flow Selected</h3>
                  <p>Select a call flow from the list to view detailed analysis</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealisticCallFlowView;
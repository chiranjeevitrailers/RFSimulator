'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  ArrowDown, 
  Clock, 
  Layers, 
  Network, 
  Phone, 
  Wifi, 
  Database,
  Play,
  Pause,
  Square,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Move,
  Settings
} from 'lucide-react';

interface CallFlowStep {
  id: string;
  timestamp: number;
  layer: string;
  direction: 'UL' | 'DL';
  messageType: string;
  messageName: string;
  description: string;
  parameters: Record<string, any>;
  status: 'SUCCESS' | 'FAIL' | 'PENDING';
  duration?: number;
  nextStep?: string;
  prevStep?: string;
}

interface CallFlowVisualizationProps {
  executionId?: string | null;
  platform: '5GLABX' | 'UE_ANALYSIS';
}

const CallFlowVisualization: React.FC<CallFlowVisualizationProps> = ({ 
  executionId, 
  platform 
}) => {
  const [callFlowSteps, setCallFlowSteps] = useState<CallFlowStep[]>([]);
  const [selectedStep, setSelectedStep] = useState<CallFlowStep | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate realistic call flow steps
  const generateCallFlowSteps = (): CallFlowStep[] => {
    const steps: CallFlowStep[] = [
      // Initial Access Phase
      {
        id: 'step-1',
        timestamp: Date.now() - 60000,
        layer: 'PHY',
        direction: 'DL',
        messageType: 'SSB',
        messageName: 'Synchronization Signal Block',
        description: 'UE receives SSB for cell search and synchronization',
        parameters: {
          'SSB-Index': 0,
          'PCI': 123,
          'RSRP': -85,
          'RSRQ': -10
        },
        status: 'SUCCESS',
        duration: 1000,
        nextStep: 'step-2'
      },
      {
        id: 'step-2',
        timestamp: Date.now() - 59000,
        layer: 'RRC',
        direction: 'DL',
        messageType: 'SIB1',
        messageName: 'System Information Block 1',
        description: 'UE receives SIB1 with cell access information',
        parameters: {
          'PLMN-Identity': '310-410',
          'Cell-Identity': '12345',
          'TAC': '67890'
        },
        status: 'SUCCESS',
        duration: 2000,
        nextStep: 'step-3',
        prevStep: 'step-1'
      },
      {
        id: 'step-3',
        timestamp: Date.now() - 57000,
        layer: 'RRC',
        direction: 'DL',
        messageType: 'SIB2',
        messageName: 'System Information Block 2',
        description: 'UE receives SIB2 with random access configuration',
        parameters: {
          'RACH-ConfigCommon': 'RACH-Config',
          'PRACH-Config': 'PRACH-Config'
        },
        status: 'SUCCESS',
        duration: 1500,
        nextStep: 'step-4',
        prevStep: 'step-2'
      },

      // Random Access Phase
      {
        id: 'step-4',
        timestamp: Date.now() - 55500,
        layer: 'PHY',
        direction: 'UL',
        messageType: 'RACH_PREAMBLE',
        messageName: 'Random Access Preamble',
        description: 'UE sends RACH preamble for initial access',
        parameters: {
          'Preamble-Index': 0,
          'PRACH-Resource': 'PRACH-0',
          'Power': 23
        },
        status: 'SUCCESS',
        duration: 500,
        nextStep: 'step-5',
        prevStep: 'step-3'
      },
      {
        id: 'step-5',
        timestamp: Date.now() - 55000,
        layer: 'MAC',
        direction: 'DL',
        messageType: 'RAR',
        messageName: 'Random Access Response',
        description: 'gNB responds with RAR containing timing advance and C-RNTI',
        parameters: {
          'RA-RNTI': 1234,
          'C-RNTI': 12345,
          'Timing-Advance': 10,
          'UL-Grant': 'UL-Grant-Info'
        },
        status: 'SUCCESS',
        duration: 1000,
        nextStep: 'step-6',
        prevStep: 'step-4'
      },

      // RRC Connection Setup Phase
      {
        id: 'step-6',
        timestamp: Date.now() - 54000,
        layer: 'RRC',
        direction: 'UL',
        messageType: 'RRC_SETUP_REQUEST',
        messageName: 'RRC Setup Request',
        description: 'UE sends RRC setup request with establishment cause',
        parameters: {
          'UE-Identity': 'IMSI-123456789012345',
          'Establishment-Cause': 'mo-Data',
          'Spare': '0'
        },
        status: 'SUCCESS',
        duration: 2000,
        nextStep: 'step-7',
        prevStep: 'step-5'
      },
      {
        id: 'step-7',
        timestamp: Date.now() - 52000,
        layer: 'RRC',
        direction: 'DL',
        messageType: 'RRC_SETUP',
        messageName: 'RRC Setup',
        description: 'gNB sends RRC setup with radio bearer configuration',
        parameters: {
          'RRC-Transaction-Identifier': 1,
          'RadioBearerConfig': 'SRB1-Config',
          'MasterCellGroup': 'MCG-Config'
        },
        status: 'SUCCESS',
        duration: 1500,
        nextStep: 'step-8',
        prevStep: 'step-6'
      },
      {
        id: 'step-8',
        timestamp: Date.now() - 50500,
        layer: 'RRC',
        direction: 'UL',
        messageType: 'RRC_SETUP_COMPLETE',
        messageName: 'RRC Setup Complete',
        description: 'UE completes RRC setup and sends selected PLMN',
        parameters: {
          'RRC-Transaction-Identifier': 1,
          'Selected-PLMN-Identity': '310-410'
        },
        status: 'SUCCESS',
        duration: 1000,
        nextStep: 'step-9',
        prevStep: 'step-7'
      },

      // Security Phase
      {
        id: 'step-9',
        timestamp: Date.now() - 49500,
        layer: 'RRC',
        direction: 'DL',
        messageType: 'SECURITY_MODE_COMMAND',
        messageName: 'Security Mode Command',
        description: 'gNB initiates security mode setup',
        parameters: {
          'Security-Algorithm': 'NEA1, NIA1',
          'Key-Change-Indicator': false,
          'Next-Hop-Chaining-Count': 0
        },
        status: 'SUCCESS',
        duration: 2000,
        nextStep: 'step-10',
        prevStep: 'step-8'
      },
      {
        id: 'step-10',
        timestamp: Date.now() - 47500,
        layer: 'RRC',
        direction: 'UL',
        messageType: 'SECURITY_MODE_COMPLETE',
        messageName: 'Security Mode Complete',
        description: 'UE completes security mode setup',
        parameters: {
          'RRC-Transaction-Identifier': 2
        },
        status: 'SUCCESS',
        duration: 1000,
        nextStep: 'step-11',
        prevStep: 'step-9'
      },

      // Registration Phase
      {
        id: 'step-11',
        timestamp: Date.now() - 46500,
        layer: 'NAS',
        direction: 'UL',
        messageType: 'REGISTRATION_REQUEST',
        messageName: 'Registration Request',
        description: 'UE initiates registration with 5GC',
        parameters: {
          'Registration-Type': 'Initial-Registration',
          'SUCI': 'SUCI-123456789012345',
          '5GMM-Capability': '5GMM-Cap'
        },
        status: 'SUCCESS',
        duration: 3000,
        nextStep: 'step-12',
        prevStep: 'step-10'
      },
      {
        id: 'step-12',
        timestamp: Date.now() - 43500,
        layer: 'NAS',
        direction: 'DL',
        messageType: 'REGISTRATION_ACCEPT',
        messageName: 'Registration Accept',
        description: '5GC accepts registration and provides GUTI',
        parameters: {
          '5G-GUTI': 'GUTI-123456789012345',
          'TAI-List': 'TAI-List',
          'Allowed-NSSAI': 'NSSAI-List'
        },
        status: 'SUCCESS',
        duration: 2000,
        nextStep: 'step-13',
        prevStep: 'step-11'
      },
      {
        id: 'step-13',
        timestamp: Date.now() - 41500,
        layer: 'NAS',
        direction: 'UL',
        messageType: 'REGISTRATION_COMPLETE',
        messageName: 'Registration Complete',
        description: 'UE completes registration procedure',
        parameters: {
          '5G-GUTI': 'GUTI-123456789012345'
        },
        status: 'SUCCESS',
        duration: 1000,
        nextStep: 'step-14',
        prevStep: 'step-12'
      },

      // PDU Session Establishment Phase
      {
        id: 'step-14',
        timestamp: Date.now() - 40500,
        layer: 'NAS',
        direction: 'UL',
        messageType: 'PDU_SESSION_ESTABLISHMENT_REQUEST',
        messageName: 'PDU Session Establishment Request',
        description: 'UE requests PDU session establishment',
        parameters: {
          'PDU-Session-ID': 1,
          'Request-Type': 'Initial-Request',
          'S-NSSAI': 'S-NSSAI-1',
          'DNN': 'internet'
        },
        status: 'SUCCESS',
        duration: 4000,
        nextStep: 'step-15',
        prevStep: 'step-13'
      },
      {
        id: 'step-15',
        timestamp: Date.now() - 36500,
        layer: 'NAS',
        direction: 'DL',
        messageType: 'PDU_SESSION_ESTABLISHMENT_ACCEPT',
        messageName: 'PDU Session Establishment Accept',
        description: '5GC accepts PDU session establishment',
        parameters: {
          'PDU-Session-ID': 1,
          'QFI': 1,
          'SSC-Mode': 1,
          'PDU-Address': '192.168.1.100'
        },
        status: 'SUCCESS',
        duration: 2000,
        nextStep: 'step-16',
        prevStep: 'step-14'
      },

      // Data Transfer Phase
      {
        id: 'step-16',
        timestamp: Date.now() - 34500,
        layer: 'RLC',
        direction: 'UL',
        messageType: 'RLC_DATA_PDU',
        messageName: 'RLC Data PDU',
        description: 'UE sends user data',
        parameters: {
          'SN': 0,
          'SO': 0,
          'Data': 'User-Data-Payload'
        },
        status: 'SUCCESS',
        duration: 1000,
        nextStep: 'step-17',
        prevStep: 'step-15'
      },
      {
        id: 'step-17',
        timestamp: Date.now() - 33500,
        layer: 'RLC',
        direction: 'DL',
        messageType: 'RLC_DATA_PDU',
        messageName: 'RLC Data PDU',
        description: 'gNB sends user data',
        parameters: {
          'SN': 0,
          'SO': 0,
          'Data': 'User-Data-Payload'
        },
        status: 'SUCCESS',
        duration: 1000,
        nextStep: 'step-18',
        prevStep: 'step-16'
      },

      // Measurement Report Phase
      {
        id: 'step-18',
        timestamp: Date.now() - 32500,
        layer: 'RRC',
        direction: 'UL',
        messageType: 'MEASUREMENT_REPORT',
        messageName: 'Measurement Report',
        description: 'UE sends measurement report',
        parameters: {
          'MeasId': 1,
          'MeasResultPCell': 'RSRP=-85, RSRQ=-10',
          'MeasResultNeighCells': 'Neighbor-1: RSRP=-90'
        },
        status: 'SUCCESS',
        duration: 1500,
        nextStep: 'step-19',
        prevStep: 'step-17'
      },

      // Handover Phase
      {
        id: 'step-19',
        timestamp: Date.now() - 31000,
        layer: 'RRC',
        direction: 'DL',
        messageType: 'RRC_RECONFIGURATION',
        messageName: 'RRC Reconfiguration',
        description: 'gNB initiates handover to target cell',
        parameters: {
          'RRC-Transaction-Identifier': 3,
          'Mobility-Controllnfo': 'Handover-Command',
          'Target-Cell-Identity': '67890'
        },
        status: 'SUCCESS',
        duration: 3000,
        nextStep: 'step-20',
        prevStep: 'step-18'
      },
      {
        id: 'step-20',
        timestamp: Date.now() - 28000,
        layer: 'RRC',
        direction: 'UL',
        messageType: 'RRC_RECONFIGURATION_COMPLETE',
        messageName: 'RRC Reconfiguration Complete',
        description: 'UE completes handover to target cell',
        parameters: {
          'RRC-Transaction-Identifier': 3
        },
        status: 'SUCCESS',
        duration: 1000,
        nextStep: 'step-21',
        prevStep: 'step-19'
      },

      // Release Phase
      {
        id: 'step-21',
        timestamp: Date.now() - 27000,
        layer: 'RRC',
        direction: 'DL',
        messageType: 'RRC_RELEASE',
        messageName: 'RRC Release',
        description: 'gNB initiates RRC connection release',
        parameters: {
          'RRC-Transaction-Identifier': 4,
          'Release-Cause': 'Other'
        },
        status: 'SUCCESS',
        duration: 2000,
        nextStep: 'step-22',
        prevStep: 'step-20'
      },
      {
        id: 'step-22',
        timestamp: Date.now() - 25000,
        layer: 'RRC',
        direction: 'UL',
        messageType: 'RRC_RELEASE_COMPLETE',
        messageName: 'RRC Release Complete',
        description: 'UE completes RRC connection release',
        parameters: {
          'RRC-Transaction-Identifier': 4
        },
        status: 'SUCCESS',
        duration: 1000,
        prevStep: 'step-21'
      }
    ];

    return steps;
  };

  // Load call flow steps on mount
  useEffect(() => {
    setCallFlowSteps(generateCallFlowSteps());
  }, [executionId]);

  // Playback functionality
  const startPlayback = () => {
    setIsPlaying(true);
    setCurrentStepIndex(0);
  };

  const stopPlayback = () => {
    setIsPlaying(false);
  };

  const resetPlayback = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  // Auto-advance during playback
  useEffect(() => {
    if (isPlaying && currentStepIndex < callFlowSteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, 2000); // 2 seconds per step
      return () => clearTimeout(timer);
    } else if (isPlaying && currentStepIndex >= callFlowSteps.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStepIndex, callFlowSteps.length]);

  // Handle mouse events for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getLayerColor = (layer: string): string => {
    const colorMap: Record<string, string> = {
      'PHY': 'bg-orange-100 text-orange-800 border-orange-200',
      'MAC': 'bg-red-100 text-red-800 border-red-200',
      'RLC': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'PDCP': 'bg-green-100 text-green-800 border-green-200',
      'RRC': 'bg-blue-100 text-blue-800 border-blue-200',
      'NAS': 'bg-purple-100 text-purple-800 border-purple-200',
      'IMS': 'bg-pink-100 text-pink-800 border-pink-200',
      'APPLICATION': 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };
    return colorMap[layer] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getDirectionColor = (direction: string): string => {
    return direction === 'UL' ? 'text-blue-600' : 'text-purple-600';
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'SUCCESS': return 'text-green-600 bg-green-50';
      case 'FAIL': return 'text-red-600 bg-red-50';
      case 'PENDING': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-gray-900">
              Call Flow Visualization - {platform}
            </h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live</span>
            </div>
            <span className="text-sm text-gray-500">
              Step {currentStepIndex + 1} of {callFlowSteps.length}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={isPlaying ? stopPlayback : startPlayback}
              className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <button
              onClick={resetPlayback}
              className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.1))}
                className="p-1 text-gray-600 hover:text-gray-800"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600">{Math.round(zoomLevel * 100)}%</span>
              <button
                onClick={() => setZoomLevel(prev => Math.min(2, prev + 0.1))}
                className="p-1 text-gray-600 hover:text-gray-800"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-100 border-b border-gray-200 p-2">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / callFlowSteps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Call Flow Steps */}
        <div className="flex-1 overflow-auto p-4">
          <div 
            className="relative"
            style={{ 
              transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
              transformOrigin: 'top left'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <div className="space-y-4">
              {callFlowSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={`relative ${
                    index <= currentStepIndex ? 'opacity-100' : 'opacity-50'
                  } transition-opacity duration-500`}
                >
                  {/* Step Card */}
                  <div
                    className={`bg-white border-2 rounded-lg p-4 cursor-pointer hover:shadow-md transition-all ${
                      index === currentStepIndex ? 'border-blue-500 shadow-lg' : 'border-gray-200'
                    } ${
                      selectedStep?.id === step.id ? 'ring-2 ring-blue-300' : ''
                    }`}
                    onClick={() => setSelectedStep(step)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            index <= currentStepIndex ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {index + 1}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono text-gray-500">
                            {formatTimestamp(step.timestamp)}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getLayerColor(step.layer)}`}>
                            {step.layer}
                          </span>
                          <span className={`text-sm ${getDirectionColor(step.direction)}`}>
                            {step.direction === 'UL' ? '↑' : '↓'}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(step.status)}`}>
                            {step.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">
                          {step.messageName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {step.messageType}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2">
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>

                    {/* Parameters */}
                    <div className="mt-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {Object.entries(step.parameters).slice(0, 4).map(([key, value]) => (
                          <div key={key} className="text-xs">
                            <span className="font-medium text-gray-700">{key}:</span>
                            <span className="text-gray-600 ml-1">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Arrow to next step */}
                  {index < callFlowSteps.length - 1 && (
                    <div className="flex justify-center py-2">
                      <ArrowDown className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step Details Panel */}
        {selectedStep && (
          <div className="w-1/3 border-l border-gray-200 bg-white">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Step Details</h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Basic Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Message Type:</span>
                    <span className="font-medium">{selectedStep.messageType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Layer:</span>
                    <span className="font-medium">{selectedStep.layer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Direction:</span>
                    <span className="font-medium">{selectedStep.direction}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${
                      selectedStep.status === 'SUCCESS' ? 'text-green-600' : 
                      selectedStep.status === 'FAIL' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {selectedStep.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{selectedStep.duration}ms</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                <p className="text-sm text-gray-600">{selectedStep.description}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Parameters</h4>
                <div className="space-y-2">
                  {Object.entries(selectedStep.parameters).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-gray-600">{key}:</span>
                      <span className="font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallFlowVisualization;
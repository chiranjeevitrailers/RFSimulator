/**
 * LTE Cell Search Builder Component
 * Complete cell search procedure with all steps and IEs
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Radio, 
  Signal, 
  Wifi, 
  Activity, 
  Layers, 
  MessageSquare, 
  BarChart3,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Clock,
  Zap,
  Target,
  Eye,
  Database,
  FileText,
  Settings,
  Monitor,
  Smartphone,
  Network,
  WifiOff,
  WifiIcon
} from 'lucide-react';

interface LTECellSearchBuilderProps {
  className?: string;
}

interface CellSearchStep {
  stepId: string;
  stepNumber: number;
  stepName: string;
  description: string;
  layer: string;
  protocol: string;
  direction: 'UE_TO_NETWORK' | 'NETWORK_TO_UE' | 'INTERNAL';
  timestamp: number;
  duration: number;
  informationElements: InformationElement[];
  layerParameters: LayerParameterUpdate[];
  messageContent: {
    hex: string;
    decoded: any;
    asn1: string;
  };
  successCriteria: string[];
  failureCriteria: string[];
  status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED';
  progress: number;
}

interface InformationElement {
  ieId: string;
  name: string;
  type: string;
  value: any;
  description: string;
  mandatory: boolean;
  standardReference: string;
  layer: string;
  protocol: string;
  encoding: 'BER' | 'PER' | 'XER' | 'JSON';
  size: number;
  criticality: 'REJECT' | 'IGNORE' | 'NOTIFY';
  bitPosition?: number;
  fieldLength?: number;
}

interface LayerParameterUpdate {
  layer: string;
  parameterName: string;
  currentValue: number;
  previousValue: number;
  change: number;
  changePercent: number;
  unit: string;
  timestamp: number;
  trend: 'INCREASING' | 'DECREASING' | 'STABLE' | 'FLUCTUATING';
  criticality: 'NORMAL' | 'WARNING' | 'CRITICAL' | 'ERROR';
  description: string;
  measurementMethod: string;
}

const LTECellSearchBuilder: React.FC<LTECellSearchBuilderProps> = ({ className = '' }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'callflow' | 'ies' | 'layers' | 'simulation'>('overview');
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [simulationData, setSimulationData] = useState<CellSearchStep[]>([]);
  const [layerStats, setLayerStats] = useState<LayerParameterUpdate[]>([]);

  // Complete LTE Cell Search Steps
  const cellSearchSteps: CellSearchStep[] = useMemo(() => [
    {
      stepId: 'LTE-001-STEP-001',
      stepNumber: 1,
      stepName: 'RSSI Scanning Multiple Cells',
      description: 'UE performs RSSI scanning across multiple cells to identify potential candidates',
      layer: 'PHY',
      protocol: 'PHY',
      direction: 'UE_TO_NETWORK',
      timestamp: 0,
      duration: 5000,
      informationElements: [
        {
          ieId: 'RSSI-SCAN-RESULT',
          name: 'RSSI Scan Result',
          type: 'SEQUENCE',
          value: [
            { earfcn: 1850, rssi: -85.2, cellId: 'CELL-001' },
            { earfcn: 1850, rssi: -92.1, cellId: 'CELL-002' },
            { earfcn: 1850, rssi: -88.7, cellId: 'CELL-003' }
          ],
          description: 'RSSI scan results for multiple cells',
          mandatory: true,
          standardReference: '3GPP TS 36.101',
          layer: 'PHY',
          protocol: 'PHY',
          encoding: 'BER',
          size: 24,
          criticality: 'REJECT'
        },
        {
          ieId: 'SCANNED-EARFCN',
          name: 'Scanned EARFCN',
          type: 'INTEGER',
          value: 1850,
          description: 'E-UTRA Absolute Radio Frequency Channel Number',
          mandatory: true,
          standardReference: '3GPP TS 36.101',
          layer: 'PHY',
          protocol: 'PHY',
          encoding: 'BER',
          size: 16,
          criticality: 'REJECT'
        },
        {
          ieId: 'SCAN-DURATION',
          name: 'Scan Duration',
          type: 'INTEGER',
          value: 5000,
          description: 'Duration of RSSI scan in milliseconds',
          mandatory: true,
          standardReference: '3GPP TS 36.101',
          layer: 'PHY',
          protocol: 'PHY',
          encoding: 'BER',
          size: 16,
          criticality: 'REJECT'
        }
      ],
      layerParameters: [
        {
          layer: 'PHY',
          parameterName: 'rssi',
          currentValue: -85.2,
          previousValue: -100.0,
          change: 14.8,
          changePercent: 14.8,
          unit: 'dBm',
          timestamp: 0,
          trend: 'INCREASING',
          criticality: 'NORMAL',
          description: 'Received Signal Strength Indicator',
          measurementMethod: 'RSSI measurement'
        },
        {
          layer: 'PHY',
          parameterName: 'scan_progress',
          currentValue: 100.0,
          previousValue: 0.0,
          change: 100.0,
          changePercent: 100.0,
          unit: '%',
          timestamp: 0,
          trend: 'INCREASING',
          criticality: 'NORMAL',
          description: 'RSSI scan progress percentage',
          measurementMethod: 'Progress tracking'
        }
      ],
      messageContent: {
        hex: '0x1A2B3C4D5E6F',
        decoded: { 
          scanResults: [
            { earfcn: 1850, rssi: -85.2, cellId: 'CELL-001' },
            { earfcn: 1850, rssi: -92.1, cellId: 'CELL-002' },
            { earfcn: 1850, rssi: -88.7, cellId: 'CELL-003' }
          ],
          scanDuration: 5000
        },
        asn1: 'RSSI-Scan-Result ::= SEQUENCE { earfcn INTEGER, rssi INTEGER, cellId OCTET STRING }'
      },
      successCriteria: ['RSSI scan completed', 'Multiple cells detected', 'Best cell identified'],
      failureCriteria: ['RSSI scan timeout', 'No cells detected', 'Scan failure'],
      status: 'PENDING',
      progress: 0
    },
    {
      stepId: 'LTE-001-STEP-002',
      stepNumber: 2,
      stepName: 'PSS Detection and Sync',
      description: 'UE detects Primary Synchronization Signal and achieves time synchronization',
      layer: 'PHY',
      protocol: 'PHY',
      direction: 'UE_TO_NETWORK',
      timestamp: 5000,
      duration: 2000,
      informationElements: [
        {
          ieId: 'PSS-INDEX',
          name: 'PSS Index',
          type: 'INTEGER',
          value: 0,
          description: 'Primary Synchronization Signal Index (0-2)',
          mandatory: true,
          standardReference: '3GPP TS 36.211',
          layer: 'PHY',
          protocol: 'PHY',
          encoding: 'BER',
          size: 2,
          criticality: 'REJECT',
          bitPosition: 0,
          fieldLength: 2
        },
        {
          ieId: 'PSS-CORRELATION',
          name: 'PSS Correlation',
          type: 'REAL',
          value: 0.95,
          description: 'PSS correlation peak value',
          mandatory: true,
          standardReference: '3GPP TS 36.211',
          layer: 'PHY',
          protocol: 'PHY',
          encoding: 'BER',
          size: 16,
          criticality: 'REJECT'
        },
        {
          ieId: 'PSS-TIMING',
          name: 'PSS Timing',
          type: 'INTEGER',
          value: 1234,
          description: 'PSS timing offset in samples',
          mandatory: true,
          standardReference: '3GPP TS 36.211',
          layer: 'PHY',
          protocol: 'PHY',
          encoding: 'BER',
          size: 16,
          criticality: 'REJECT'
        }
      ],
      layerParameters: [
        {
          layer: 'PHY',
          parameterName: 'pss_correlation',
          currentValue: 0.95,
          previousValue: 0.0,
          change: 0.95,
          changePercent: 95.0,
          unit: 'ratio',
          timestamp: 5000,
          trend: 'INCREASING',
          criticality: 'NORMAL',
          description: 'PSS correlation peak value',
          measurementMethod: 'Correlation analysis'
        },
        {
          layer: 'PHY',
          parameterName: 'timing_offset',
          currentValue: 1234,
          previousValue: 0,
          change: 1234,
          changePercent: 100.0,
          unit: 'samples',
          timestamp: 5000,
          trend: 'STABLE',
          criticality: 'NORMAL',
          description: 'Timing offset from PSS detection',
          measurementMethod: 'Timing measurement'
        }
      ],
      messageContent: {
        hex: '0x2B3C4D5E',
        decoded: { pssIndex: 0, correlation: 0.95, timing: 1234 },
        asn1: 'PSS-Index ::= 0, PSS-Correlation ::= 0.95, PSS-Timing ::= 1234'
      },
      successCriteria: ['PSS detected', 'Timing sync achieved', 'Correlation > 0.8'],
      failureCriteria: ['PSS detection failed', 'Timing sync failed', 'Low correlation'],
      status: 'PENDING',
      progress: 0
    },
    {
      stepId: 'LTE-001-STEP-003',
      stepNumber: 3,
      stepName: 'SSS Detection and PCI Calculation',
      description: 'UE detects Secondary Synchronization Signal and calculates Physical Cell ID',
      layer: 'PHY',
      protocol: 'PHY',
      direction: 'UE_TO_NETWORK',
      timestamp: 7000,
      duration: 1500,
      informationElements: [
        {
          ieId: 'SSS-INDEX',
          name: 'SSS Index',
          type: 'INTEGER',
          value: 0,
          description: 'Secondary Synchronization Signal Index (0-167)',
          mandatory: true,
          standardReference: '3GPP TS 36.211',
          layer: 'PHY',
          protocol: 'PHY',
          encoding: 'BER',
          size: 8,
          criticality: 'REJECT'
        },
        {
          ieId: 'PCI',
          name: 'Physical Cell ID',
          type: 'INTEGER',
          value: 123,
          description: 'Physical Cell Identifier (0-503)',
          mandatory: true,
          standardReference: '3GPP TS 36.211',
          layer: 'PHY',
          protocol: 'PHY',
          encoding: 'BER',
          size: 9,
          criticality: 'REJECT'
        },
        {
          ieId: 'SSS-CORRELATION',
          name: 'SSS Correlation',
          type: 'REAL',
          value: 0.92,
          description: 'SSS correlation peak value',
          mandatory: true,
          standardReference: '3GPP TS 36.211',
          layer: 'PHY',
          protocol: 'PHY',
          encoding: 'BER',
          size: 16,
          criticality: 'REJECT'
        }
      ],
      layerParameters: [
        {
          layer: 'PHY',
          parameterName: 'sss_correlation',
          currentValue: 0.92,
          previousValue: 0.0,
          change: 0.92,
          changePercent: 92.0,
          unit: 'ratio',
          timestamp: 7000,
          trend: 'INCREASING',
          criticality: 'NORMAL',
          description: 'SSS correlation peak value',
          measurementMethod: 'Correlation analysis'
        },
        {
          layer: 'PHY',
          parameterName: 'pci',
          currentValue: 123,
          previousValue: 0,
          change: 123,
          changePercent: 100.0,
          unit: 'id',
          timestamp: 7000,
          trend: 'STABLE',
          criticality: 'NORMAL',
          description: 'Physical Cell ID',
          measurementMethod: 'PCI calculation'
        }
      ],
      messageContent: {
        hex: '0x3C4D5E6F',
        decoded: { sssIndex: 0, pci: 123, correlation: 0.92 },
        asn1: 'SSS-Index ::= 0, PCI ::= 123, SSS-Correlation ::= 0.92'
      },
      successCriteria: ['SSS detected', 'PCI calculated', 'Correlation > 0.8'],
      failureCriteria: ['SSS detection failed', 'PCI calculation failed', 'Low correlation'],
      status: 'PENDING',
      progress: 0
    },
    {
      stepId: 'LTE-001-STEP-004',
      stepNumber: 4,
      stepName: 'DMRS Detection',
      description: 'UE detects Demodulation Reference Signal for channel estimation',
      layer: 'PHY',
      protocol: 'PHY',
      direction: 'NETWORK_TO_UE',
      timestamp: 8500,
      duration: 1000,
      informationElements: [
        {
          ieId: 'DMRS-SEQUENCE',
          name: 'DMRS Sequence',
          type: 'BIT_STRING',
          value: '1101010101010101',
          description: 'DMRS sequence bits',
          mandatory: true,
          standardReference: '3GPP TS 36.211',
          layer: 'PHY',
          protocol: 'PHY',
          encoding: 'BER',
          size: 16,
          criticality: 'REJECT'
        },
        {
          ieId: 'DMRS-POWER',
          name: 'DMRS Power',
          type: 'REAL',
          value: -85.5,
          description: 'DMRS received power in dBm',
          mandatory: true,
          standardReference: '3GPP TS 36.211',
          layer: 'PHY',
          protocol: 'PHY',
          encoding: 'BER',
          size: 16,
          criticality: 'REJECT'
        },
        {
          ieId: 'DMRS-SNR',
          name: 'DMRS SNR',
          type: 'REAL',
          value: 15.2,
          description: 'DMRS Signal to Noise Ratio in dB',
          mandatory: true,
          standardReference: '3GPP TS 36.211',
          layer: 'PHY',
          protocol: 'PHY',
          encoding: 'BER',
          size: 16,
          criticality: 'REJECT'
        }
      ],
      layerParameters: [
        {
          layer: 'PHY',
          parameterName: 'dmrs_power',
          currentValue: -85.5,
          previousValue: -90.0,
          change: 4.5,
          changePercent: 5.0,
          unit: 'dBm',
          timestamp: 8500,
          trend: 'INCREASING',
          criticality: 'NORMAL',
          description: 'DMRS received power',
          measurementMethod: 'Power measurement'
        },
        {
          layer: 'PHY',
          parameterName: 'dmrs_snr',
          currentValue: 15.2,
          previousValue: 12.0,
          change: 3.2,
          changePercent: 26.7,
          unit: 'dB',
          timestamp: 8500,
          trend: 'INCREASING',
          criticality: 'NORMAL',
          description: 'DMRS Signal to Noise Ratio',
          measurementMethod: 'SNR measurement'
        }
      ],
      messageContent: {
        hex: '0x4D5E6F70',
        decoded: { dmrsSequence: '1101010101010101', power: -85.5, snr: 15.2 },
        asn1: 'DMRS-Sequence ::= BIT STRING, DMRS-Power ::= -85.5, DMRS-SNR ::= 15.2'
      },
      successCriteria: ['DMRS detected', 'Channel estimation successful', 'SNR > 10 dB'],
      failureCriteria: ['DMRS detection failed', 'Channel estimation failed', 'Low SNR'],
      status: 'PENDING',
      progress: 0
    },
    {
      stepId: 'LTE-001-STEP-005',
      stepNumber: 5,
      stepName: 'PBCH-MIB Decode',
      description: 'UE decodes Physical Broadcast Channel to obtain Master Information Block',
      layer: 'PHY',
      protocol: 'PHY',
      direction: 'NETWORK_TO_UE',
      timestamp: 9500,
      duration: 2000,
      informationElements: [
        {
          ieId: 'DL-BANDWIDTH',
          name: 'DL Bandwidth',
          type: 'ENUMERATED',
          value: 'n100',
          description: 'Downlink bandwidth configuration (n6, n15, n25, n50, n75, n100)',
          mandatory: true,
          standardReference: '3GPP TS 36.211',
          layer: 'PHY',
          protocol: 'PHY',
          encoding: 'BER',
          size: 3,
          criticality: 'REJECT'
        },
        {
          ieId: 'PHICH-CONFIG',
          name: 'PHICH Configuration',
          type: 'SEQUENCE',
          value: { duration: 'NORMAL', resource: 'ONE_SIXTH' },
          description: 'PHICH configuration parameters',
          mandatory: true,
          standardReference: '3GPP TS 36.211',
          layer: 'PHY',
          protocol: 'PHY',
          encoding: 'BER',
          size: 8,
          criticality: 'REJECT'
        },
        {
          ieId: 'SYSTEM-FRAME-NUMBER',
          name: 'System Frame Number',
          type: 'INTEGER',
          value: 1234,
          description: 'System Frame Number (0-1023)',
          mandatory: true,
          standardReference: '3GPP TS 36.211',
          layer: 'PHY',
          protocol: 'PHY',
          encoding: 'BER',
          size: 10,
          criticality: 'REJECT'
        }
      ],
      layerParameters: [
        {
          layer: 'PHY',
          parameterName: 'mib_decode_success',
          currentValue: 1,
          previousValue: 0,
          change: 1,
          changePercent: 100.0,
          unit: 'boolean',
          timestamp: 9500,
          trend: 'STABLE',
          criticality: 'NORMAL',
          description: 'MIB decode success flag',
          measurementMethod: 'Decode verification'
        },
        {
          layer: 'PHY',
          parameterName: 'dl_bandwidth',
          currentValue: 100,
          previousValue: 0,
          change: 100,
          changePercent: 100.0,
          unit: 'MHz',
          timestamp: 9500,
          trend: 'STABLE',
          criticality: 'NORMAL',
          description: 'Downlink bandwidth',
          measurementMethod: 'MIB decode'
        }
      ],
      messageContent: {
        hex: '0x5E6F7081',
        decoded: { 
          dlBandwidth: 'n100', 
          phichConfig: { duration: 'NORMAL', resource: 'ONE_SIXTH' },
          sfn: 1234
        },
        asn1: 'DL-Bandwidth ::= n100, PHICH-Config ::= { duration NORMAL, resource ONE_SIXTH }, SFN ::= 1234'
      },
      successCriteria: ['MIB decoded successfully', 'Bandwidth identified', 'SFN obtained'],
      failureCriteria: ['MIB decode failed', 'Invalid bandwidth', 'SFN error'],
      status: 'PENDING',
      progress: 0
    }
  ], []);

  // Simulation functions
  const startSimulation = () => {
    setIsSimulating(true);
    setCurrentStep(0);
    setSimulationData([...cellSearchSteps]);
    setLayerStats([]);
  };

  const stopSimulation = () => {
    setIsSimulating(false);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setCurrentStep(0);
    setSimulationData([...cellSearchSteps]);
    setLayerStats([]);
  };

  // Simulation effect
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      if (currentStep < cellSearchSteps.length) {
        const step = cellSearchSteps[currentStep];
        
        // Update step status
        setSimulationData(prev => prev.map((s, index) => 
          index === currentStep 
            ? { ...s, status: 'RUNNING', progress: 100 }
            : index < currentStep 
            ? { ...s, status: 'SUCCESS', progress: 100 }
            : s
        ));

        // Add layer parameters to stats
        setLayerStats(prev => [...prev, ...step.layerParameters]);

        setCurrentStep(prev => prev + 1);
      } else {
        setIsSimulating(false);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulating, currentStep, cellSearchSteps]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'FAILED': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'RUNNING': return <Activity className="w-5 h-5 text-blue-500 animate-pulse" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'NORMAL': return 'text-green-600 bg-green-50';
      case 'WARNING': return 'text-yellow-600 bg-yellow-50';
      case 'CRITICAL': return 'text-orange-600 bg-orange-50';
      case 'ERROR': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'INCREASING': return <Activity className="w-4 h-4 text-green-500" />;
      case 'DECREASING': return <Activity className="w-4 h-4 text-red-500 rotate-180" />;
      case 'STABLE': return <Activity className="w-4 h-4 text-blue-500" />;
      case 'FLUCTUATING': return <Activity className="w-4 h-4 text-yellow-500 animate-pulse" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Search className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">LTE Cell Search & Sync Complete</h2>
              <p className="text-sm text-gray-600">Complete cell search procedure with all steps and IEs</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <button
                onClick={startSimulation}
                disabled={isSimulating}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-4 h-4" />
                <span>Start</span>
              </button>
              <button
                onClick={stopSimulation}
                disabled={!isSimulating}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Pause className="w-4 h-4" />
                <span>Stop</span>
              </button>
              <button
                onClick={resetSimulation}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 py-3 border-b border-gray-200">
        <div className="flex space-x-6">
          {[
            { id: 'overview', label: 'Overview', icon: Monitor },
            { id: 'callflow', label: 'Call Flow', icon: MessageSquare },
            { id: 'ies', label: 'Information Elements', icon: Database },
            { id: 'layers', label: 'Layer Stats', icon: BarChart3 },
            { id: 'simulation', label: 'Simulation', icon: Activity }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Radio className="w-8 h-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-blue-900">RSSI Scanning</h3>
                    <p className="text-sm text-blue-700">Multiple cells detection</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Signal className="w-8 h-8 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-900">PSS/SSS Sync</h3>
                    <p className="text-sm text-green-700">Primary/Secondary sync</p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Target className="w-8 h-8 text-purple-600" />
                  <div>
                    <h3 className="font-semibold text-purple-900">PCI Calculation</h3>
                    <p className="text-sm text-purple-700">Physical Cell ID</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <Wifi className="w-8 h-8 text-orange-600" />
                  <div>
                    <h3 className="font-semibold text-orange-900">DMRS Detection</h3>
                    <p className="text-sm text-orange-700">Channel estimation</p>
                  </div>
                </div>
              </div>
              <div className="bg-indigo-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-indigo-600" />
                  <div>
                    <h3 className="font-semibold text-indigo-900">PBCH-MIB Decode</h3>
                    <p className="text-sm text-indigo-700">Master Information Block</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Test Case Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Steps:</span>
                  <span className="ml-2 font-medium">5</span>
                </div>
                <div>
                  <span className="text-gray-600">IEs:</span>
                  <span className="ml-2 font-medium">15</span>
                </div>
                <div>
                  <span className="text-gray-600">Duration:</span>
                  <span className="ml-2 font-medium">60s</span>
                </div>
                <div>
                  <span className="text-gray-600">Layers:</span>
                  <span className="ml-2 font-medium">6</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'callflow' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Complete Call Flow</h3>
            {cellSearchSteps.map((step, index) => (
              <div key={step.stepId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(step.status)}
                    <div>
                      <h4 className="font-semibold text-gray-900">{step.stepName}</h4>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      Step {step.stepNumber} • {step.layer} • {step.protocol}
                    </div>
                    <div className="text-sm text-gray-500">
                      {step.timestamp}ms • {step.duration}ms
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Success Criteria</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {step.successCriteria.map((criteria, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>{criteria}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Failure Criteria</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {step.failureCriteria.map((criteria, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <XCircle className="w-4 h-4 text-red-500" />
                          <span>{criteria}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2">Message Content</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Hex:</span>
                      <div className="font-mono text-xs mt-1">{step.messageContent.hex}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Decoded:</span>
                      <div className="font-mono text-xs mt-1">
                        {JSON.stringify(step.messageContent.decoded, null, 2)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">ASN1:</span>
                      <div className="font-mono text-xs mt-1">{step.messageContent.asn1}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'ies' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Information Elements</h3>
            {cellSearchSteps.map((step, index) => (
              <div key={step.stepId} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">{step.stepName}</h4>
                <div className="space-y-3">
                  {step.informationElements.map((ie, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{ie.name}</h5>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getCriticalityColor(ie.criticality)}`}>
                          {ie.criticality}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Type:</span>
                          <span className="ml-2 font-medium">{ie.type}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Size:</span>
                          <span className="ml-2 font-medium">{ie.size} bytes</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Encoding:</span>
                          <span className="ml-2 font-medium">{ie.encoding}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Mandatory:</span>
                          <span className="ml-2 font-medium">{ie.mandatory ? 'Yes' : 'No'}</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="text-gray-600">Description:</span>
                        <p className="text-sm text-gray-700 mt-1">{ie.description}</p>
                      </div>
                      <div className="mt-2">
                        <span className="text-gray-600">Standard Reference:</span>
                        <span className="ml-2 font-medium text-blue-600">{ie.standardReference}</span>
                      </div>
                      <div className="mt-2">
                        <span className="text-gray-600">Value:</span>
                        <div className="font-mono text-xs mt-1 bg-white p-2 rounded border">
                          {typeof ie.value === 'object' ? JSON.stringify(ie.value, null, 2) : ie.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'layers' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Layer Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {layerStats.map((param, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{param.parameterName}</h5>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(param.trend)}
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getCriticalityColor(param.criticality)}`}>
                        {param.criticality}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current:</span>
                      <span className="font-medium">{param.currentValue} {param.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Previous:</span>
                      <span className="font-medium">{param.previousValue} {param.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Change:</span>
                      <span className={`font-medium ${param.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {param.change >= 0 ? '+' : ''}{param.change} {param.unit} ({param.changePercent.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Layer:</span>
                      <span className="font-medium">{param.layer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Timestamp:</span>
                      <span className="font-medium">{param.timestamp}ms</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-600">{param.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'simulation' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Simulation Control</h3>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-4">
                <Activity className="w-6 h-6 text-blue-600" />
                <div>
                  <h4 className="font-semibold text-blue-900">Simulation Status</h4>
                  <p className="text-sm text-blue-700">
                    {isSimulating ? 'Running' : 'Stopped'} • Step {currentStep + 1} of {cellSearchSteps.length}
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / cellSearchSteps.length) * 100}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Completed Steps:</span>
                  <span className="ml-2 font-medium">{currentStep}</span>
                </div>
                <div>
                  <span className="text-gray-600">Total Steps:</span>
                  <span className="ml-2 font-medium">{cellSearchSteps.length}</span>
                </div>
                <div>
                  <span className="text-gray-600">Progress:</span>
                  <span className="ml-2 font-medium">{Math.round(((currentStep + 1) / cellSearchSteps.length) * 100)}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Step Progress</h4>
              {cellSearchSteps.map((step, index) => (
                <div key={step.stepId} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  {getStatusIcon(step.status)}
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{step.stepName}</h5>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    {step.timestamp}ms
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LTECellSearchBuilder;
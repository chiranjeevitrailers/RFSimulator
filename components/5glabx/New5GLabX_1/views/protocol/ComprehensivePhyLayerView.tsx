'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Wifi, Activity, Signal, TrendingUp, TrendingDown, 
  BarChart3, Gauge, AlertTriangle, CheckCircle, 
  Clock, Zap, Radio, Antenna, Layers, Eye
} from 'lucide-react';
import { dataFlowManager, DataFlowEvent } from '@/utils/DataFlowManager';

interface PhyLayerData {
  // Signal Quality
  rsrp: number;
  rsrq: number;
  sinr: number;
  cqi: number;
  
  // Cell Synchronization
  pss_sequence: number;
  sss_sequence: number;
  pci: number;
  pci_group: number;
  pci_sector: number;
  dmrs_sequence_id: number;
  
  // Channel Decoding
  mib_decode_success: boolean;
  pcfich_decode_success: boolean;
  pdcch_decode_success: boolean;
  sib1_decode_success: boolean;
  sib2_decode_success: boolean;
  sib3_decode_success: boolean;
  
  // MIMO Parameters
  mimo_layers: number;
  mimo_mode: string;
  precoding_matrix: number;
  transmission_mode: number;
  antenna_ports: number;
  beamforming: boolean;
  channel_rank: number;
  
  // MCS & CQI
  mcs_index: number;
  mcs_modulation: string;
  mcs_code_rate: number;
  mcs_spectral_efficiency: number;
  cqi_modulation: string;
  cqi_code_rate: number;
  cqi_efficiency: number;
  
  // Resource Allocation
  resource_block_start: number;
  resource_block_length: number;
  resource_block_allocation: Array<{
    rb_index: number;
    allocated: boolean;
    power: number;
    interference: number;
  }>;
  
  // Timing
  timing_advance: number;
  subframe_offset: number;
  
  // Channel State
  channel_condition: string;
  interference_level: number;
  noise_level: number;
}

const ComprehensivePhyLayerView: React.FC<{ executionId?: string | null }> = ({ executionId }) => {
  const [phyData, setPhyData] = useState<PhyLayerData | null>(null);
  const [isReceivingData, setIsReceivingData] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [signalTrend, setSignalTrend] = useState<Array<{ time: number; rsrp: number; rsrq: number; sinr: number }>>([]);
  const [mcsTrend, setMcsTrend] = useState<Array<{ time: number; mcs: number; cqi: number }>>([]);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    if (!executionId) return;

    console.log(`📡 ComprehensivePhyLayerView: Subscribing to events for execution: ${executionId}`);

    const unsubscribe = dataFlowManager.subscribe('ALL', (event: DataFlowEvent) => {
      if (event.executionId === executionId && event.type === 'MESSAGE_TO_5GLABX') {
        const message = event.data;
        
        if (message.layer === 'PHY' || message.eventType === 'CELL_SYNC') {
          console.log('📡 PHY Layer: Received PHY data:', message);
          
          const newPhyData: PhyLayerData = {
            // Signal Quality
            rsrp: message.ieMap?.rsrp || -95,
            rsrq: message.ieMap?.rsrq || -10,
            sinr: message.ieMap?.sinr || 15,
            cqi: message.ieMap?.cqi || 12,
            
            // Cell Synchronization
            pss_sequence: message.ieMap?.pss_sequence || 0,
            sss_sequence: message.ieMap?.sss_sequence || 25,
            pci: message.ieMap?.pci || 123,
            pci_group: message.ieMap?.pci_group || 41,
            pci_sector: message.ieMap?.pci_sector || 0,
            dmrs_sequence_id: message.ieMap?.dmrs_sequence_id || 123,
            
            // Channel Decoding
            mib_decode_success: message.ieMap?.mib_decode_success || true,
            pcfich_decode_success: message.ieMap?.pcfich_decode_success || true,
            pdcch_decode_success: message.ieMap?.pdcch_decode_success || true,
            sib1_decode_success: message.ieMap?.sib1_decode_success || true,
            sib2_decode_success: message.ieMap?.sib2_decode_success || true,
            sib3_decode_success: message.ieMap?.sib3_decode_success || true,
            
            // MIMO Parameters
            mimo_layers: message.ieMap?.mimo_layers || 1,
            mimo_mode: message.ieMap?.mimo_mode || 'SINGLE_LAYER',
            precoding_matrix: message.ieMap?.precoding_matrix || 0,
            transmission_mode: message.ieMap?.transmission_mode || 1,
            antenna_ports: message.ieMap?.antenna_ports || 1,
            beamforming: message.ieMap?.beamforming || false,
            channel_rank: message.ieMap?.channel_rank || 1,
            
            // MCS & CQI
            mcs_index: message.ieMap?.mcs_index || 15,
            mcs_modulation: message.ieMap?.mcs_modulation || '16QAM',
            mcs_code_rate: message.ieMap?.mcs_code_rate || 0.88,
            mcs_spectral_efficiency: message.ieMap?.mcs_spectral_efficiency || 3.52,
            cqi_modulation: message.ieMap?.cqi_modulation || '16QAM',
            cqi_code_rate: message.ieMap?.cqi_code_rate || 0.81,
            cqi_efficiency: message.ieMap?.cqi_efficiency || 3.24,
            
            // Resource Allocation
            resource_block_start: message.ieMap?.resource_block_start || 10,
            resource_block_length: message.ieMap?.resource_block_length || 5,
            resource_block_allocation: message.ieMap?.resource_block_allocation || [],
            
            // Timing
            timing_advance: message.ieMap?.timing_advance || 125,
            subframe_offset: message.ieMap?.subframe_offset || 2,
            
            // Channel State
            channel_condition: message.ieMap?.channel_condition || 'GOOD',
            interference_level: message.ieMap?.interference_level || -85.5,
            noise_level: message.ieMap?.noise_level || -115.2,
          };
          
          setPhyData(newPhyData);
          setIsReceivingData(true);
          setLastUpdate(new Date());
          
          // Update trends
          const now = Date.now();
          setSignalTrend(prev => [...prev.slice(-19), { time: now, rsrp: newPhyData.rsrp, rsrq: newPhyData.rsrq, sinr: newPhyData.sinr }]);
          setMcsTrend(prev => [...prev.slice(-19), { time: now, mcs: newPhyData.mcs_index, cqi: newPhyData.cqi }]);
        }
      }
    });

    return () => {
      console.log(`📡 ComprehensivePhyLayerView: Unsubscribing from events for execution: ${executionId}`);
      unsubscribe();
    };
  }, [executionId]);

  const getSignalQualityStatus = (rsrp: number, sinr: number) => {
    if (rsrp > -70 && sinr > 20) return { status: 'EXCELLENT', color: 'text-green-600', bg: 'bg-green-100' };
    if (rsrp > -85 && sinr > 10) return { status: 'GOOD', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (rsrp > -100 && sinr > 0) return { status: 'FAIR', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { status: 'POOR', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const getChannelConditionColor = (condition: string) => {
    switch (condition) {
      case 'EXCELLENT': return 'text-green-600 bg-green-100';
      case 'GOOD': return 'text-blue-600 bg-blue-100';
      case 'FAIR': return 'text-yellow-600 bg-yellow-100';
      case 'POOR': return 'text-orange-600 bg-orange-100';
      case 'VERY_POOR': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!phyData) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Wifi className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">PHY Layer Analysis</p>
          <p className="text-gray-400 text-sm">Waiting for test execution data...</p>
        </div>
      </div>
    );
  }

  const signalStatus = getSignalQualityStatus(phyData.rsrp, phyData.sinr);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Wifi className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">PHY Layer Analysis</h2>
            <span className={`px-2 py-1 rounded text-xs font-medium ${signalStatus.bg} ${signalStatus.color}`}>
              {signalStatus.status}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              isReceivingData ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {isReceivingData ? 'Live Data' : 'Waiting'}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isReceivingData ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
              <span className="text-sm text-gray-600">
                {isReceivingData ? '🟢 Live' : '⚪ Waiting'}
              </span>
            </div>
            {lastUpdate && (
              <span className="text-xs text-gray-500">
                Last: {lastUpdate.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-4 flex space-x-1">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'signal', label: 'Signal Quality', icon: Signal },
            { id: 'mimo', label: 'MIMO Analysis', icon: Layers },
            { id: 'mcs', label: 'MCS & CQI', icon: BarChart3 },
            { id: 'resources', label: 'Resource Allocation', icon: Radio },
            { id: 'timing', label: 'Timing', icon: Clock }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {selectedTab === 'overview' && (
          <div className="space-y-6">
            {/* Signal Quality Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Signal className="w-5 h-5 mr-2" />
                Signal Quality Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{phyData.rsrp.toFixed(1)} dBm</div>
                  <div className="text-sm text-gray-600">RSRP</div>
                  <div className="text-xs text-gray-500">Reference Signal Power</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{phyData.rsrq.toFixed(1)} dB</div>
                  <div className="text-sm text-gray-600">RSRQ</div>
                  <div className="text-xs text-gray-500">Reference Signal Quality</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{phyData.sinr.toFixed(1)} dB</div>
                  <div className="text-sm text-gray-600">SINR</div>
                  <div className="text-xs text-gray-500">Signal to Interference + Noise</div>
                </div>
              </div>
            </div>

            {/* Cell Synchronization Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Radio className="w-5 h-5 mr-2" />
                Cell Synchronization Status
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{phyData.pci}</div>
                  <div className="text-sm text-gray-600">PCI</div>
                  <div className="text-xs text-gray-500">Physical Cell ID</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{phyData.pss_sequence}</div>
                  <div className="text-sm text-gray-600">PSS</div>
                  <div className="text-xs text-gray-500">Primary Sync Signal</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{phyData.sss_sequence}</div>
                  <div className="text-sm text-gray-600">SSS</div>
                  <div className="text-xs text-gray-500">Secondary Sync Signal</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{phyData.dmrs_sequence_id}</div>
                  <div className="text-sm text-gray-600">DMRS</div>
                  <div className="text-xs text-gray-500">Demodulation Reference</div>
                </div>
              </div>
            </div>

            {/* Channel Decoding Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Channel Decoding Status
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { name: 'MIB', status: phyData.mib_decode_success },
                  { name: 'PCFICH', status: phyData.pcfich_decode_success },
                  { name: 'PDCCH', status: phyData.pdcch_decode_success },
                  { name: 'SIB1', status: phyData.sib1_decode_success },
                  { name: 'SIB2', status: phyData.sib2_decode_success },
                  { name: 'SIB3', status: phyData.sib3_decode_success }
                ].map((channel) => (
                  <div key={channel.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900">{channel.name}</span>
                    <div className={`flex items-center space-x-1 ${
                      channel.status ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {channel.status ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                      <span className="text-xs font-medium">
                        {channel.status ? 'SUCCESS' : 'FAILED'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'signal' && (
          <div className="space-y-6">
            {/* Signal Quality Charts */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Signal Quality Trends</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Real-time signal quality charts</p>
                  <p className="text-gray-400 text-sm">RSRP: {phyData.rsrp.toFixed(1)} dBm | RSRQ: {phyData.rsrq.toFixed(1)} dB | SINR: {phyData.sinr.toFixed(1)} dB</p>
                </div>
              </div>
            </div>

            {/* Signal Quality Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Signal Measurements</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">RSRP</span>
                    <span className="text-sm font-medium text-gray-900">{phyData.rsrp.toFixed(1)} dBm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">RSRQ</span>
                    <span className="text-sm font-medium text-gray-900">{phyData.rsrq.toFixed(1)} dB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">SINR</span>
                    <span className="text-sm font-medium text-gray-900">{phyData.sinr.toFixed(1)} dB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">CQI</span>
                    <span className="text-sm font-medium text-gray-900">{phyData.cqi}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Channel Conditions</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Channel Condition</span>
                    <span className={`text-sm font-medium px-2 py-1 rounded ${getChannelConditionColor(phyData.channel_condition)}`}>
                      {phyData.channel_condition}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Interference Level</span>
                    <span className="text-sm font-medium text-gray-900">{phyData.interference_level.toFixed(1)} dBm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Noise Level</span>
                    <span className="text-sm font-medium text-gray-900">{phyData.noise_level.toFixed(1)} dBm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'mimo' && (
          <div className="space-y-6">
            {/* MIMO Configuration */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Layers className="w-5 h-5 mr-2" />
                MIMO Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">MIMO Layers</span>
                    <span className="text-lg font-semibold text-gray-900">{phyData.mimo_layers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">MIMO Mode</span>
                    <span className="text-sm font-medium text-gray-900">{phyData.mimo_mode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Transmission Mode</span>
                    <span className="text-sm font-medium text-gray-900">TM{phyData.transmission_mode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Antenna Ports</span>
                    <span className="text-sm font-medium text-gray-900">{phyData.antenna_ports}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Precoding Matrix</span>
                    <span className="text-sm font-medium text-gray-900">{phyData.precoding_matrix}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Channel Rank</span>
                    <span className="text-sm font-medium text-gray-900">{phyData.channel_rank}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Beamforming</span>
                    <span className={`text-sm font-medium px-2 py-1 rounded ${
                      phyData.beamforming ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {phyData.beamforming ? 'ENABLED' : 'DISABLED'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'mcs' && (
          <div className="space-y-6">
            {/* MCS & CQI Analysis */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">MCS & CQI Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Modulation & Coding Scheme</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">MCS Index</span>
                      <span className="text-lg font-semibold text-gray-900">{phyData.mcs_index}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Modulation</span>
                      <span className="text-sm font-medium text-gray-900">{phyData.mcs_modulation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Code Rate</span>
                      <span className="text-sm font-medium text-gray-900">{phyData.mcs_code_rate.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Spectral Efficiency</span>
                      <span className="text-sm font-medium text-gray-900">{phyData.mcs_spectral_efficiency.toFixed(2)} bits/s/Hz</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Channel Quality Indicator</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">CQI</span>
                      <span className="text-lg font-semibold text-gray-900">{phyData.cqi}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">CQI Modulation</span>
                      <span className="text-sm font-medium text-gray-900">{phyData.cqi_modulation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">CQI Code Rate</span>
                      <span className="text-sm font-medium text-gray-900">{phyData.cqi_code_rate.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">CQI Efficiency</span>
                      <span className="text-sm font-medium text-gray-900">{phyData.cqi_efficiency.toFixed(2)} bits/s/Hz</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'resources' && (
          <div className="space-y-6">
            {/* Resource Block Allocation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Block Allocation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Allocation Summary</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Start RB</span>
                      <span className="text-sm font-medium text-gray-900">{phyData.resource_block_start}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Length</span>
                      <span className="text-sm font-medium text-gray-900">{phyData.resource_block_length} RBs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Allocated</span>
                      <span className="text-sm font-medium text-gray-900">{phyData.resource_block_length} RBs</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Resource Block Details</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {phyData.resource_block_allocation.map((rb, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-xs text-gray-600">RB {rb.rb_index}</span>
                        <div className="flex space-x-2">
                          <span className="text-xs text-gray-500">{rb.power.toFixed(1)} dBm</span>
                          <span className="text-xs text-gray-500">{rb.interference.toFixed(1)} dBm</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'timing' && (
          <div className="space-y-6">
            {/* Timing Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Timing Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Timing Advance</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Current TA</span>
                      <span className="text-lg font-semibold text-gray-900">{phyData.timing_advance} Ts</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Subframe Offset</span>
                      <span className="text-sm font-medium text-gray-900">{phyData.subframe_offset}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Timing Status</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <span className="text-sm font-medium text-green-600">SYNCHRONIZED</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Last Update</span>
                      <span className="text-sm font-medium text-gray-900">
                        {lastUpdate ? lastUpdate.toLocaleTimeString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComprehensivePhyLayerView;
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Smartphone, Activity, Signal, TrendingUp, TrendingDown, 
  BarChart3, Gauge, AlertTriangle, CheckCircle, 
  Clock, Zap, Radio, Antenna, Layers, Eye, Battery
} from 'lucide-react';
import { dataFlowManager, DataFlowEvent } from '@/utils/DataFlowManager';

interface UEPhyLayerData {
  // UE Signal Quality
  ue_rsrp: number;
  ue_rsrq: number;
  ue_sinr: number;
  ue_cqi: number;
  ue_ri: number;
  ue_pmi: number;
  
  // UE Cell Synchronization
  ue_pss_detection: boolean;
  ue_sss_detection: boolean;
  ue_pci_detected: number;
  ue_dmrs_detection: boolean;
  ue_mib_decode: boolean;
  ue_sib_decode: boolean;
  
  // UE MIMO Configuration
  ue_mimo_capability: number;
  ue_antenna_ports: number;
  ue_transmission_mode: number;
  ue_beamforming_capable: boolean;
  ue_ca_capable: boolean;
  ue_ca_bands: string[];
  
  // UE Power Management
  ue_tx_power: number;
  ue_max_tx_power: number;
  ue_power_headroom: number;
  ue_battery_level: number;
  ue_thermal_state: string;
  
  // UE Channel Measurements
  ue_serving_cell_rsrp: number;
  ue_neighbor_cells: Array<{
    pci: number;
    rsrp: number;
    rsrq: number;
  }>;
  ue_handover_candidates: Array<{
    pci: number;
    rsrp: number;
    priority: number;
  }>;
  
  // UE Performance Metrics
  ue_throughput_dl: number;
  ue_throughput_ul: number;
  ue_latency: number;
  ue_packet_loss: number;
  ue_retransmission_rate: number;
  
  // UE Mobility
  ue_mobility_state: string;
  ue_velocity: number;
  ue_direction: number;
  ue_location: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
}

const UEComprehensivePhyLayerView: React.FC<{ executionId?: string | null }> = ({ executionId }) => {
  const [uePhyData, setUePhyData] = useState<UEPhyLayerData | null>(null);
  const [isReceivingData, setIsReceivingData] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [signalTrend, setSignalTrend] = useState<Array<{ time: number; rsrp: number; rsrq: number; sinr: number }>>([]);
  const [throughputTrend, setThroughputTrend] = useState<Array<{ time: number; dl: number; ul: number }>>([]);

  useEffect(() => {
    if (!executionId) return;

    console.log(`📱 UEComprehensivePhyLayerView: Subscribing to events for execution: ${executionId}`);

    const unsubscribe = dataFlowManager.subscribe('ALL', (event: DataFlowEvent) => {
      if (event.executionId === executionId && event.type === 'MESSAGE_TO_UE_ANALYSIS') {
        const message = event.data;
        
        if (message.layer === 'PHY' || message.eventType === 'CELL_SYNC' || message.eventType === 'UE_CONNECTED') {
          console.log('📱 UE PHY Layer: Received UE PHY data:', message);
          
          const newUePhyData: UEPhyLayerData = {
            // UE Signal Quality
            ue_rsrp: message.ieMap?.ue_rsrp || message.ieMap?.rsrp || -95,
            ue_rsrq: message.ieMap?.ue_rsrq || message.ieMap?.rsrq || -10,
            ue_sinr: message.ieMap?.ue_sinr || message.ieMap?.sinr || 15,
            ue_cqi: message.ieMap?.ue_cqi || message.ieMap?.cqi || 12,
            ue_ri: message.ieMap?.ue_ri || 1,
            ue_pmi: message.ieMap?.ue_pmi || 0,
            
            // UE Cell Synchronization
            ue_pss_detection: message.ieMap?.ue_pss_detection || message.ieMap?.pss_detection_success || true,
            ue_sss_detection: message.ieMap?.ue_sss_detection || message.ieMap?.sss_detection_success || true,
            ue_pci_detected: message.ieMap?.ue_pci_detected || message.ieMap?.pci || 123,
            ue_dmrs_detection: message.ieMap?.ue_dmrs_detection || true,
            ue_mib_decode: message.ieMap?.ue_mib_decode || message.ieMap?.mib_decode_success || true,
            ue_sib_decode: message.ieMap?.ue_sib_decode || message.ieMap?.sib1_decode_success || true,
            
            // UE MIMO Configuration
            ue_mimo_capability: message.ieMap?.ue_mimo_capability || 2,
            ue_antenna_ports: message.ieMap?.ue_antenna_ports || 2,
            ue_transmission_mode: message.ieMap?.ue_transmission_mode || 4,
            ue_beamforming_capable: message.ieMap?.ue_beamforming_capable || true,
            ue_ca_capable: message.ieMap?.ue_ca_capable || true,
            ue_ca_bands: message.ieMap?.ue_ca_bands || ['B1', 'B3', 'B7'],
            
            // UE Power Management
            ue_tx_power: message.ieMap?.ue_tx_power || 20.5,
            ue_max_tx_power: message.ieMap?.ue_max_tx_power || 23,
            ue_power_headroom: message.ieMap?.ue_power_headroom || 2.5,
            ue_battery_level: message.ieMap?.ue_battery_level || 85,
            ue_thermal_state: message.ieMap?.ue_thermal_state || 'NORMAL',
            
            // UE Channel Measurements
            ue_serving_cell_rsrp: message.ieMap?.ue_serving_cell_rsrp || -95,
            ue_neighbor_cells: message.ieMap?.ue_neighbor_cells || [
              { pci: 124, rsrp: -98, rsrq: -12 },
              { pci: 125, rsrp: -102, rsrq: -15 },
              { pci: 126, rsrp: -105, rsrq: -18 }
            ],
            ue_handover_candidates: message.ieMap?.ue_handover_candidates || [
              { pci: 124, rsrp: -98, priority: 1 },
              { pci: 125, rsrp: -102, priority: 2 }
            ],
            
            // UE Performance Metrics
            ue_throughput_dl: message.ieMap?.ue_throughput_dl || 45.2,
            ue_throughput_ul: message.ieMap?.ue_throughput_ul || 12.8,
            ue_latency: message.ieMap?.ue_latency || 15.3,
            ue_packet_loss: message.ieMap?.ue_packet_loss || 0.1,
            ue_retransmission_rate: message.ieMap?.ue_retransmission_rate || 0.05,
            
            // UE Mobility
            ue_mobility_state: message.ieMap?.ue_mobility_state || 'STATIONARY',
            ue_velocity: message.ieMap?.ue_velocity || 0,
            ue_direction: message.ieMap?.ue_direction || 0,
            ue_location: message.ieMap?.ue_location || {
              latitude: 37.7749,
              longitude: -122.4194,
              accuracy: 5.0
            }
          };
          
          setUePhyData(newUePhyData);
          setIsReceivingData(true);
          setLastUpdate(new Date());
          
          // Update trends
          const now = Date.now();
          setSignalTrend(prev => [...prev.slice(-19), { 
            time: now, 
            rsrp: newUePhyData.ue_rsrp, 
            rsrq: newUePhyData.ue_rsrq, 
            sinr: newUePhyData.ue_sinr 
          }]);
          setThroughputTrend(prev => [...prev.slice(-19), { 
            time: now, 
            dl: newUePhyData.ue_throughput_dl, 
            ul: newUePhyData.ue_throughput_ul 
          }]);
        }
      }
    });

    return () => {
      console.log(`📱 UEComprehensivePhyLayerView: Unsubscribing from events for execution: ${executionId}`);
      unsubscribe();
    };
  }, [executionId]);

  const getUESignalQualityStatus = (rsrp: number, sinr: number) => {
    if (rsrp > -70 && sinr > 20) return { status: 'EXCELLENT', color: 'text-green-600', bg: 'bg-green-100' };
    if (rsrp > -85 && sinr > 10) return { status: 'GOOD', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (rsrp > -100 && sinr > 0) return { status: 'FAIR', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { status: 'POOR', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const getBatteryStatus = (batteryLevel: number) => {
    if (batteryLevel > 80) return { status: 'HIGH', color: 'text-green-600', bg: 'bg-green-100' };
    if (batteryLevel > 50) return { status: 'MEDIUM', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (batteryLevel > 20) return { status: 'LOW', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { status: 'CRITICAL', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const getThermalStatus = (thermalState: string) => {
    switch (thermalState) {
      case 'NORMAL': return { status: 'NORMAL', color: 'text-green-600', bg: 'bg-green-100' };
      case 'WARM': return { status: 'WARM', color: 'text-yellow-600', bg: 'bg-yellow-100' };
      case 'HOT': return { status: 'HOT', color: 'text-orange-600', bg: 'bg-orange-100' };
      case 'CRITICAL': return { status: 'CRITICAL', color: 'text-red-600', bg: 'bg-red-100' };
      default: return { status: 'UNKNOWN', color: 'text-gray-600', bg: 'bg-gray-100' };
    }
  };

  if (!uePhyData) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Smartphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">UE PHY Layer Analysis</p>
          <p className="text-gray-400 text-sm">Waiting for UE test execution data...</p>
        </div>
      </div>
    );
  }

  const signalStatus = getUESignalQualityStatus(uePhyData.ue_rsrp, uePhyData.ue_sinr);
  const batteryStatus = getBatteryStatus(uePhyData.ue_battery_level);
  const thermalStatus = getThermalStatus(uePhyData.ue_thermal_state);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Smartphone className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">UE PHY Layer Analysis</h2>
            <span className={`px-2 py-1 rounded text-xs font-medium ${signalStatus.bg} ${signalStatus.color}`}>
              Signal: {signalStatus.status}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${batteryStatus.bg} ${batteryStatus.color}`}>
              Battery: {batteryStatus.status}
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
            { id: 'mimo', label: 'MIMO & CA', icon: Layers },
            { id: 'power', label: 'Power & Battery', icon: Battery },
            { id: 'performance', label: 'Performance', icon: BarChart3 },
            { id: 'mobility', label: 'Mobility', icon: Radio }
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
            {/* UE Signal Quality Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Signal className="w-5 h-5 mr-2" />
                UE Signal Quality Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{uePhyData.ue_rsrp.toFixed(1)} dBm</div>
                  <div className="text-sm text-gray-600">RSRP</div>
                  <div className="text-xs text-gray-500">Reference Signal Power</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{uePhyData.ue_rsrq.toFixed(1)} dB</div>
                  <div className="text-sm text-gray-600">RSRQ</div>
                  <div className="text-xs text-gray-500">Reference Signal Quality</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{uePhyData.ue_sinr.toFixed(1)} dB</div>
                  <div className="text-sm text-gray-600">SINR</div>
                  <div className="text-xs text-gray-500">Signal to Interference + Noise</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{uePhyData.ue_cqi}</div>
                  <div className="text-sm text-gray-600">CQI</div>
                  <div className="text-xs text-gray-500">Channel Quality Indicator</div>
                </div>
              </div>
            </div>

            {/* UE Performance Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                UE Performance Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{uePhyData.ue_throughput_dl.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">DL Throughput</div>
                  <div className="text-xs text-gray-500">Mbps</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{uePhyData.ue_throughput_ul.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">UL Throughput</div>
                  <div className="text-xs text-gray-500">Mbps</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{uePhyData.ue_latency.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">Latency</div>
                  <div className="text-xs text-gray-500">ms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{(uePhyData.ue_packet_loss * 100).toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Packet Loss</div>
                  <div className="text-xs text-gray-500">Rate</div>
                </div>
              </div>
            </div>

            {/* UE Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Smartphone className="w-5 h-5 mr-2" />
                UE Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{uePhyData.ue_battery_level}%</div>
                  <div className="text-sm text-gray-600">Battery Level</div>
                  <div className={`text-xs px-2 py-1 rounded ${batteryStatus.bg} ${batteryStatus.color}`}>
                    {batteryStatus.status}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{uePhyData.ue_thermal_state}</div>
                  <div className="text-sm text-gray-600">Thermal State</div>
                  <div className={`text-xs px-2 py-1 rounded ${thermalStatus.bg} ${thermalStatus.color}`}>
                    {thermalStatus.status}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{uePhyData.ue_mobility_state}</div>
                  <div className="text-sm text-gray-600">Mobility State</div>
                  <div className="text-xs text-gray-500">{uePhyData.ue_velocity} km/h</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'signal' && (
          <div className="space-y-6">
            {/* UE Signal Quality Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">UE Signal Quality Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Signal Measurements</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">RSRP</span>
                      <span className="text-sm font-medium text-gray-900">{uePhyData.ue_rsrp.toFixed(1)} dBm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">RSRQ</span>
                      <span className="text-sm font-medium text-gray-900">{uePhyData.ue_rsrq.toFixed(1)} dB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">SINR</span>
                      <span className="text-sm font-medium text-gray-900">{uePhyData.ue_sinr.toFixed(1)} dB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">CQI</span>
                      <span className="text-sm font-medium text-gray-900">{uePhyData.ue_cqi}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">RI (Rank Indicator)</span>
                      <span className="text-sm font-medium text-gray-900">{uePhyData.ue_ri}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">PMI (Precoding Matrix)</span>
                      <span className="text-sm font-medium text-gray-900">{uePhyData.ue_pmi}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Cell Synchronization</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">PSS Detection</span>
                      <span className={`text-sm font-medium px-2 py-1 rounded ${
                        uePhyData.ue_pss_detection ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {uePhyData.ue_pss_detection ? 'SUCCESS' : 'FAILED'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">SSS Detection</span>
                      <span className={`text-sm font-medium px-2 py-1 rounded ${
                        uePhyData.ue_sss_detection ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {uePhyData.ue_sss_detection ? 'SUCCESS' : 'FAILED'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">PCI Detected</span>
                      <span className="text-sm font-medium text-gray-900">{uePhyData.ue_pci_detected}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">DMRS Detection</span>
                      <span className={`text-sm font-medium px-2 py-1 rounded ${
                        uePhyData.ue_dmrs_detection ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {uePhyData.ue_dmrs_detection ? 'SUCCESS' : 'FAILED'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">MIB Decode</span>
                      <span className={`text-sm font-medium px-2 py-1 rounded ${
                        uePhyData.ue_mib_decode ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {uePhyData.ue_mib_decode ? 'SUCCESS' : 'FAILED'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">SIB Decode</span>
                      <span className={`text-sm font-medium px-2 py-1 rounded ${
                        uePhyData.ue_sib_decode ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {uePhyData.ue_sib_decode ? 'SUCCESS' : 'FAILED'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Neighbor Cells */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Neighbor Cells</h3>
              <div className="space-y-3">
                {uePhyData.ue_neighbor_cells.map((cell, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-gray-900">PCI {cell.pci}</span>
                      <span className="text-sm text-gray-600">RSRP: {cell.rsrp.toFixed(1)} dBm</span>
                      <span className="text-sm text-gray-600">RSRQ: {cell.rsrq.toFixed(1)} dB</span>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded ${
                      cell.rsrp > -100 ? 'bg-green-100 text-green-800' : 
                      cell.rsrp > -110 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {cell.rsrp > -100 ? 'STRONG' : cell.rsrp > -110 ? 'WEAK' : 'VERY_WEAK'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'mimo' && (
          <div className="space-y-6">
            {/* UE MIMO Configuration */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Layers className="w-5 h-5 mr-2" />
                UE MIMO Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">MIMO Capabilities</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">MIMO Capability</span>
                      <span className="text-sm font-medium text-gray-900">{uePhyData.ue_mimo_capability}x{uePhyData.ue_mimo_capability}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Antenna Ports</span>
                      <span className="text-sm font-medium text-gray-900">{uePhyData.ue_antenna_ports}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Transmission Mode</span>
                      <span className="text-sm font-medium text-gray-900">TM{uePhyData.ue_transmission_mode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Beamforming Capable</span>
                      <span className={`text-sm font-medium px-2 py-1 rounded ${
                        uePhyData.ue_beamforming_capable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {uePhyData.ue_beamforming_capable ? 'YES' : 'NO'}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Carrier Aggregation</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">CA Capable</span>
                      <span className={`text-sm font-medium px-2 py-1 rounded ${
                        uePhyData.ue_ca_capable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {uePhyData.ue_ca_capable ? 'YES' : 'NO'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">CA Bands</span>
                      <span className="text-sm font-medium text-gray-900">{uePhyData.ue_ca_bands.join(', ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Current RI</span>
                      <span className="text-sm font-medium text-gray-900">{uePhyData.ue_ri}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Current PMI</span>
                      <span className="text-sm font-medium text-gray-900">{uePhyData.ue_pmi}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'power' && (
          <div className="space-y-6">
            {/* UE Power Management */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Battery className="w-5 h-5 mr-2" />
                UE Power Management
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Power Levels</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Current TX Power</span>
                      <span className="text-lg font-semibold text-gray-900">{uePhyData.ue_tx_power.toFixed(1)} dBm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Max TX Power</span>
                      <span className="text-sm font-medium text-gray-900">{uePhyData.ue_max_tx_power} dBm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Power Headroom</span>
                      <span className="text-sm font-medium text-gray-900">{uePhyData.ue_power_headroom.toFixed(1)} dB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Power Efficiency</span>
                      <span className="text-sm font-medium text-gray-900">
                        {((uePhyData.ue_tx_power / uePhyData.ue_max_tx_power) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Battery & Thermal</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Battery Level</span>
                      <span className="text-lg font-semibold text-gray-900">{uePhyData.ue_battery_level}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Thermal State</span>
                      <span className={`text-sm font-medium px-2 py-1 rounded ${thermalStatus.bg} ${thermalStatus.color}`}>
                        {uePhyData.ue_thermal_state}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Battery Status</span>
                      <span className={`text-sm font-medium px-2 py-1 rounded ${batteryStatus.bg} ${batteryStatus.color}`}>
                        {batteryStatus.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Power Control Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Power Control Trends</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Power control trends</p>
                  <p className="text-gray-400 text-sm">TX Power: {uePhyData.ue_tx_power.toFixed(1)} dBm | Battery: {uePhyData.ue_battery_level}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'performance' && (
          <div className="space-y-6">
            {/* UE Performance Metrics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">UE Performance Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Throughput</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Downlink Throughput</span>
                      <span className="text-lg font-semibold text-gray-900">{uePhyData.ue_throughput_dl.toFixed(1)} Mbps</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Uplink Throughput</span>
                      <span className="text-lg font-semibold text-gray-900">{uePhyData.ue_throughput_ul.toFixed(1)} Mbps</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Throughput</span>
                      <span className="text-sm font-medium text-gray-900">
                        {(uePhyData.ue_throughput_dl + uePhyData.ue_throughput_ul).toFixed(1)} Mbps
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Quality Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Latency</span>
                      <span className="text-lg font-semibold text-gray-900">{uePhyData.ue_latency.toFixed(1)} ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Packet Loss Rate</span>
                      <span className="text-lg font-semibold text-gray-900">{(uePhyData.ue_packet_loss * 100).toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Retransmission Rate</span>
                      <span className="text-sm font-medium text-gray-900">{(uePhyData.ue_retransmission_rate * 100).toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Trends */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Performance trends</p>
                  <p className="text-gray-400 text-sm">DL: {uePhyData.ue_throughput_dl.toFixed(1)} Mbps | UL: {uePhyData.ue_throughput_ul.toFixed(1)} Mbps</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'mobility' && (
          <div className="space-y-6">
            {/* UE Mobility Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Radio className="w-5 h-5 mr-2" />
                UE Mobility Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Mobility State</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Mobility State</span>
                      <span className="text-sm font-medium text-gray-900">{uePhyData.ue_mobility_state}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Velocity</span>
                      <span className="text-sm font-medium text-gray-900">{uePhyData.ue_velocity} km/h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Direction</span>
                      <span className="text-sm font-medium text-gray-900">{uePhyData.ue_direction}°</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Location</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Latitude</span>
                      <span className="text-sm font-medium text-gray-900">{uePhyData.ue_location.latitude.toFixed(6)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Longitude</span>
                      <span className="text-sm font-medium text-gray-900">{uePhyData.ue_location.longitude.toFixed(6)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Accuracy</span>
                      <span className="text-sm font-medium text-gray-900">±{uePhyData.ue_location.accuracy}m</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Handover Candidates */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Handover Candidates</h3>
              <div className="space-y-3">
                {uePhyData.ue_handover_candidates.map((candidate, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-gray-900">PCI {candidate.pci}</span>
                      <span className="text-sm text-gray-600">RSRP: {candidate.rsrp.toFixed(1)} dBm</span>
                      <span className="text-sm text-gray-600">Priority: {candidate.priority}</span>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded ${
                      candidate.priority === 1 ? 'bg-green-100 text-green-800' : 
                      candidate.priority === 2 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {candidate.priority === 1 ? 'HIGH' : candidate.priority === 2 ? 'MEDIUM' : 'LOW'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UEComprehensivePhyLayerView;
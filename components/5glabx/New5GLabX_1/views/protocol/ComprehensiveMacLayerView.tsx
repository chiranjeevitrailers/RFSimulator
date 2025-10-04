'use client';

import React, { useState, useEffect } from 'react';
import { 
  Network, Activity, BarChart3, TrendingUp, TrendingDown, 
  Gauge, AlertTriangle, CheckCircle, Clock, Zap, 
  Layers, Eye, RefreshCw, Shield
} from 'lucide-react';
import { dataFlowManager, DataFlowEvent } from '@/utils/DataFlowManager';

interface MacLayerData {
  // HARQ Parameters
  harq_process_id: number;
  harq_redundancy_version: number;
  harq_new_data_indicator: boolean;
  harq_ack_nack: string;
  harq_retransmission_count: number;
  harq_max_retransmissions: number;
  
  // Scheduling Information
  scheduling_request: boolean;
  buffer_status_report: number;
  power_headroom_report: number;
  cqi_report: number;
  ri_report: number;
  pmi_report: number;
  
  // Power Control
  tpc_command: number;
  power_headroom: number;
  power_control_offset: number;
  max_tx_power: number;
  current_tx_power: number;
  
  // Resource Allocation
  allocated_rbs: number;
  total_rbs: number;
  rb_utilization: number;
  scheduling_priority: number;
  
  // MAC Layer Statistics
  mac_pdu_count: number;
  mac_pdu_errors: number;
  mac_throughput: number;
  mac_latency: number;
  
  // Random Access
  rach_attempts: number;
  rach_success_rate: number;
  rach_preamble_index: number;
  rach_power_ramping: number;
  
  // Discontinuous Reception (DRX)
  drx_cycle_length: number;
  drx_inactivity_timer: number;
  drx_retransmission_timer: number;
  drx_short_cycle_timer: number;
}

const ComprehensiveMacLayerView: React.FC<{ executionId?: string | null }> = ({ executionId }) => {
  const [macData, setMacData] = useState<MacLayerData | null>(null);
  const [isReceivingData, setIsReceivingData] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [harqTrend, setHarqTrend] = useState<Array<{ time: number; success_rate: number; retransmissions: number }>>([]);
  const [throughputTrend, setThroughputTrend] = useState<Array<{ time: number; throughput: number }>>([]);

  useEffect(() => {
    if (!executionId) return;

    console.log(`📡 ComprehensiveMacLayerView: Subscribing to events for execution: ${executionId}`);

    const unsubscribe = dataFlowManager.subscribe('ALL', (event: DataFlowEvent) => {
      if (event.executionId === executionId && event.type === 'MESSAGE_TO_5GLABX') {
        const message = event.data;
        
        if (message.layer === 'MAC' || message.eventType === 'PRACH_ATTEMPT' || message.eventType === 'PRACH_SUCCESS') {
          console.log('📡 MAC Layer: Received MAC data:', message);
          
          const newMacData: MacLayerData = {
            // HARQ Parameters
            harq_process_id: message.ieMap?.harq_process_id || 0,
            harq_redundancy_version: message.ieMap?.harq_redundancy_version || 0,
            harq_new_data_indicator: message.ieMap?.harq_new_data_indicator || true,
            harq_ack_nack: message.ieMap?.harq_ack_nack || 'ACK',
            harq_retransmission_count: message.ieMap?.harq_retransmission_count || 0,
            harq_max_retransmissions: message.ieMap?.harq_max_retransmissions || 4,
            
            // Scheduling Information
            scheduling_request: message.ieMap?.scheduling_request || false,
            buffer_status_report: message.ieMap?.buffer_status_report || 0,
            power_headroom_report: message.ieMap?.power_headroom_report || 0,
            cqi_report: message.ieMap?.cqi_report || 12,
            ri_report: message.ieMap?.ri_report || 1,
            pmi_report: message.ieMap?.pmi_report || 0,
            
            // Power Control
            tpc_command: message.ieMap?.tpc_command || 1,
            power_headroom: message.ieMap?.power_headroom || 2.5,
            power_control_offset: message.ieMap?.power_control_offset || 1.2,
            max_tx_power: message.ieMap?.max_tx_power || 23,
            current_tx_power: message.ieMap?.current_tx_power || 20.5,
            
            // Resource Allocation
            allocated_rbs: message.ieMap?.allocated_rbs || 5,
            total_rbs: message.ieMap?.total_rbs || 100,
            rb_utilization: message.ieMap?.rb_utilization || 0.05,
            scheduling_priority: message.ieMap?.scheduling_priority || 1,
            
            // MAC Layer Statistics
            mac_pdu_count: message.ieMap?.mac_pdu_count || 0,
            mac_pdu_errors: message.ieMap?.mac_pdu_errors || 0,
            mac_throughput: message.ieMap?.mac_throughput || 0,
            mac_latency: message.ieMap?.mac_latency || 0,
            
            // Random Access
            rach_attempts: message.ieMap?.rach_attempts || 1,
            rach_success_rate: message.ieMap?.rach_success_rate || 1.0,
            rach_preamble_index: message.ieMap?.rach_preamble_index || 3,
            rach_power_ramping: message.ieMap?.rach_power_ramping || 0,
            
            // Discontinuous Reception (DRX)
            drx_cycle_length: message.ieMap?.drx_cycle_length || 10,
            drx_inactivity_timer: message.ieMap?.drx_inactivity_timer || 10,
            drx_retransmission_timer: message.ieMap?.drx_retransmission_timer || 8,
            drx_short_cycle_timer: message.ieMap?.drx_short_cycle_timer || 2,
          };
          
          setMacData(newMacData);
          setIsReceivingData(true);
          setLastUpdate(new Date());
          
          // Update trends
          const now = Date.now();
          const successRate = newMacData.harq_retransmission_count === 0 ? 1.0 : 
            Math.max(0, 1 - (newMacData.harq_retransmission_count / newMacData.harq_max_retransmissions));
          
          setHarqTrend(prev => [...prev.slice(-19), { 
            time: now, 
            success_rate: successRate, 
            retransmissions: newMacData.harq_retransmission_count 
          }]);
          setThroughputTrend(prev => [...prev.slice(-19), { 
            time: now, 
            throughput: newMacData.mac_throughput 
          }]);
        }
      }
    });

    return () => {
      console.log(`📡 ComprehensiveMacLayerView: Unsubscribing from events for execution: ${executionId}`);
      unsubscribe();
    };
  }, [executionId]);

  const getHarqStatus = (retransmissionCount: number, maxRetransmissions: number) => {
    const retransmissionRate = retransmissionCount / maxRetransmissions;
    if (retransmissionRate === 0) return { status: 'EXCELLENT', color: 'text-green-600', bg: 'bg-green-100' };
    if (retransmissionRate < 0.25) return { status: 'GOOD', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (retransmissionRate < 0.5) return { status: 'FAIR', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { status: 'POOR', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const getPowerStatus = (currentPower: number, maxPower: number) => {
    const powerRatio = currentPower / maxPower;
    if (powerRatio < 0.5) return { status: 'LOW', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (powerRatio < 0.8) return { status: 'OPTIMAL', color: 'text-green-600', bg: 'bg-green-100' };
    if (powerRatio < 0.95) return { status: 'HIGH', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { status: 'MAXIMUM', color: 'text-red-600', bg: 'bg-red-100' };
  };

  if (!macData) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Network className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">MAC Layer Analysis</p>
          <p className="text-gray-400 text-sm">Waiting for test execution data...</p>
        </div>
      </div>
    );
  }

  const harqStatus = getHarqStatus(macData.harq_retransmission_count, macData.harq_max_retransmissions);
  const powerStatus = getPowerStatus(macData.current_tx_power, macData.max_tx_power);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Network className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">MAC Layer Analysis</h2>
            <span className={`px-2 py-1 rounded text-xs font-medium ${harqStatus.bg} ${harqStatus.color}`}>
              HARQ: {harqStatus.status}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${powerStatus.bg} ${powerStatus.color}`}>
              Power: {powerStatus.status}
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
            { id: 'harq', label: 'HARQ', icon: RefreshCw },
            { id: 'scheduling', label: 'Scheduling', icon: BarChart3 },
            { id: 'power', label: 'Power Control', icon: Zap },
            { id: 'resources', label: 'Resources', icon: Layers },
            { id: 'rach', label: 'RACH', icon: Network }
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
            {/* MAC Layer Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                MAC Layer Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{macData.mac_pdu_count}</div>
                  <div className="text-sm text-gray-600">MAC PDUs</div>
                  <div className="text-xs text-gray-500">Processed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{macData.mac_throughput.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">Throughput</div>
                  <div className="text-xs text-gray-500">Mbps</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{macData.mac_latency.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">Latency</div>
                  <div className="text-xs text-gray-500">ms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{(macData.rb_utilization * 100).toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">RB Utilization</div>
                  <div className="text-xs text-gray-500">Resource Blocks</div>
                </div>
              </div>
            </div>

            {/* HARQ Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <RefreshCw className="w-5 h-5 mr-2" />
                HARQ Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">Process {macData.harq_process_id}</div>
                  <div className="text-sm text-gray-600">Current Process</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">RV{macData.harq_redundancy_version}</div>
                  <div className="text-sm text-gray-600">Redundancy Version</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">{macData.harq_retransmission_count}/{macData.harq_max_retransmissions}</div>
                  <div className="text-sm text-gray-600">Retransmissions</div>
                </div>
              </div>
            </div>

            {/* Power Control Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Power Control Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Current Power</span>
                    <span className="text-lg font-semibold text-gray-900">{macData.current_tx_power.toFixed(1)} dBm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Max Power</span>
                    <span className="text-sm font-medium text-gray-900">{macData.max_tx_power} dBm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Power Headroom</span>
                    <span className="text-sm font-medium text-gray-900">{macData.power_headroom.toFixed(1)} dB</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">TPC Command</span>
                    <span className="text-sm font-medium text-gray-900">{macData.tpc_command}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Power Control Offset</span>
                    <span className="text-sm font-medium text-gray-900">{macData.power_control_offset.toFixed(1)} dB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'harq' && (
          <div className="space-y-6">
            {/* HARQ Process Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">HARQ Process Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Process Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Process ID</span>
                      <span className="text-sm font-medium text-gray-900">{macData.harq_process_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Redundancy Version</span>
                      <span className="text-sm font-medium text-gray-900">RV{macData.harq_redundancy_version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">New Data Indicator</span>
                      <span className={`text-sm font-medium px-2 py-1 rounded ${
                        macData.harq_new_data_indicator ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {macData.harq_new_data_indicator ? 'NEW' : 'RETRANSMISSION'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">ACK/NACK</span>
                      <span className={`text-sm font-medium px-2 py-1 rounded ${
                        macData.harq_ack_nack === 'ACK' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {macData.harq_ack_nack}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Retransmission Statistics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Current Retransmissions</span>
                      <span className="text-sm font-medium text-gray-900">{macData.harq_retransmission_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Max Retransmissions</span>
                      <span className="text-sm font-medium text-gray-900">{macData.harq_max_retransmissions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Success Rate</span>
                      <span className={`text-sm font-medium ${
                        harqStatus.color
                      }`}>
                        {((1 - macData.harq_retransmission_count / macData.harq_max_retransmissions) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* HARQ Performance Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">HARQ Performance Trends</h3>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">HARQ performance charts</p>
                  <p className="text-gray-400 text-sm">Success Rate: {((1 - macData.harq_retransmission_count / macData.harq_max_retransmissions) * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'scheduling' && (
          <div className="space-y-6">
            {/* Scheduling Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Scheduling Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Scheduling Requests</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Scheduling Request</span>
                      <span className={`text-sm font-medium px-2 py-1 rounded ${
                        macData.scheduling_request ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {macData.scheduling_request ? 'PENDING' : 'NONE'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Buffer Status Report</span>
                      <span className="text-sm font-medium text-gray-900">{macData.buffer_status_report}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Scheduling Priority</span>
                      <span className="text-sm font-medium text-gray-900">{macData.scheduling_priority}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Channel Quality Reports</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">CQI Report</span>
                      <span className="text-sm font-medium text-gray-900">{macData.cqi_report}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">RI Report</span>
                      <span className="text-sm font-medium text-gray-900">{macData.ri_report}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">PMI Report</span>
                      <span className="text-sm font-medium text-gray-900">{macData.pmi_report}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resource Allocation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Allocation</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{macData.allocated_rbs}</div>
                  <div className="text-sm text-gray-600">Allocated RBs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{macData.total_rbs}</div>
                  <div className="text-sm text-gray-600">Total RBs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{(macData.rb_utilization * 100).toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Utilization</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'power' && (
          <div className="space-y-6">
            {/* Power Control Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Power Control Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Power Levels</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Current TX Power</span>
                      <span className="text-lg font-semibold text-gray-900">{macData.current_tx_power.toFixed(1)} dBm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Maximum TX Power</span>
                      <span className="text-sm font-medium text-gray-900">{macData.max_tx_power} dBm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Power Headroom</span>
                      <span className="text-sm font-medium text-gray-900">{macData.power_headroom.toFixed(1)} dB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Power Headroom Report</span>
                      <span className="text-sm font-medium text-gray-900">{macData.power_headroom_report}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Power Control Commands</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">TPC Command</span>
                      <span className="text-sm font-medium text-gray-900">{macData.tpc_command}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Power Control Offset</span>
                      <span className="text-sm font-medium text-gray-900">{macData.power_control_offset.toFixed(1)} dB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Power Status</span>
                      <span className={`text-sm font-medium px-2 py-1 rounded ${powerStatus.bg} ${powerStatus.color}`}>
                        {powerStatus.status}
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
                  <p className="text-gray-400 text-sm">Current: {macData.current_tx_power.toFixed(1)} dBm | Max: {macData.max_tx_power} dBm</p>
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
                      <span className="text-sm text-gray-600">Allocated RBs</span>
                      <span className="text-lg font-semibold text-gray-900">{macData.allocated_rbs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total RBs</span>
                      <span className="text-sm font-medium text-gray-900">{macData.total_rbs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Utilization</span>
                      <span className="text-sm font-medium text-gray-900">{(macData.rb_utilization * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Scheduling Priority</span>
                      <span className="text-sm font-medium text-gray-900">{macData.scheduling_priority}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Resource Efficiency</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">MAC Throughput</span>
                      <span className="text-sm font-medium text-gray-900">{macData.mac_throughput.toFixed(2)} Mbps</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">MAC Latency</span>
                      <span className="text-sm font-medium text-gray-900">{macData.mac_latency.toFixed(1)} ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">PDU Count</span>
                      <span className="text-sm font-medium text-gray-900">{macData.mac_pdu_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">PDU Errors</span>
                      <span className="text-sm font-medium text-gray-900">{macData.mac_pdu_errors}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'rach' && (
          <div className="space-y-6">
            {/* Random Access Channel */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Random Access Channel (RACH)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">RACH Attempts</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Attempts</span>
                      <span className="text-lg font-semibold text-gray-900">{macData.rach_attempts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Success Rate</span>
                      <span className="text-sm font-medium text-gray-900">{(macData.rach_success_rate * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Preamble Index</span>
                      <span className="text-sm font-medium text-gray-900">{macData.rach_preamble_index}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Power Ramping</span>
                      <span className="text-sm font-medium text-gray-900">{macData.rach_power_ramping}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">DRX Configuration</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">DRX Cycle Length</span>
                      <span className="text-sm font-medium text-gray-900">{macData.drx_cycle_length} ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Inactivity Timer</span>
                      <span className="text-sm font-medium text-gray-900">{macData.drx_inactivity_timer} ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Retransmission Timer</span>
                      <span className="text-sm font-medium text-gray-900">{macData.drx_retransmission_timer} ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Short Cycle Timer</span>
                      <span className="text-sm font-medium text-gray-900">{macData.drx_short_cycle_timer} ms</span>
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

export default ComprehensiveMacLayerView;
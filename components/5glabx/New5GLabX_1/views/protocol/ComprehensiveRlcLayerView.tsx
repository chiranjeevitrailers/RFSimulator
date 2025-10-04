'use client';

import React, { useState, useEffect } from 'react';
import { 
  Layers, Activity, BarChart3, TrendingUp, TrendingDown, 
  Gauge, AlertTriangle, CheckCircle, Clock, Zap, 
  RefreshCw, Eye, Shield, Database
} from 'lucide-react';
import { dataFlowManager, DataFlowEvent } from '@/utils/DataFlowManager';

interface RlcLayerData {
  // RLC Mode
  rlc_mode: 'TM' | 'UM' | 'AM';
  rlc_entity_id: number;
  
  // ARQ Parameters
  arq_enabled: boolean;
  max_retransmissions: number;
  retransmission_count: number;
  retransmission_timer: number;
  poll_retransmit_timer: number;
  t_reordering: number;
  t_status_prohibit: number;
  
  // Sequence Numbers
  tx_sn: number;
  rx_sn: number;
  tx_next: number;
  rx_next: number;
  tx_next_ack: number;
  rx_next_highest: number;
  
  // Buffer Status
  tx_buffer_size: number;
  rx_buffer_size: number;
  tx_buffer_utilization: number;
  rx_buffer_utilization: number;
  buffer_overflow_count: number;
  buffer_underflow_count: number;
  
  // PDU Statistics
  tx_pdu_count: number;
  rx_pdu_count: number;
  tx_pdu_bytes: number;
  rx_pdu_bytes: number;
  duplicate_pdu_count: number;
  out_of_order_pdu_count: number;
  missing_pdu_count: number;
  
  // Error Handling
  crc_errors: number;
  segmentation_errors: number;
  reassembly_errors: number;
  timeout_errors: number;
  
  // Performance Metrics
  throughput_dl: number;
  throughput_ul: number;
  latency: number;
  jitter: number;
  packet_loss_rate: number;
  
  // Window Management
  window_size: number;
  window_utilization: number;
  window_stall_count: number;
  
  // Status Reports
  status_report_pending: boolean;
  last_status_report: number;
  status_report_interval: number;
}

const ComprehensiveRlcLayerView: React.FC<{ executionId?: string | null }> = ({ executionId }) => {
  const [rlcData, setRlcData] = useState<RlcLayerData | null>(null);
  const [isReceivingData, setIsReceivingData] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [throughputTrend, setThroughputTrend] = useState<Array<{ time: number; dl: number; ul: number }>>([]);
  const [bufferTrend, setBufferTrend] = useState<Array<{ time: number; tx: number; rx: number }>>([]);

  useEffect(() => {
    if (!executionId) return;

    console.log(`📡 ComprehensiveRlcLayerView: Subscribing to events for execution: ${executionId}`);

    const unsubscribe = dataFlowManager.subscribe('ALL', (event: DataFlowEvent) => {
      if (event.executionId === executionId && event.type === 'MESSAGE_TO_5GLABX') {
        const message = event.data;
        
        if (message.layer === 'RLC' || message.eventType === 'RRC_CONN_REQUEST' || message.eventType === 'RRC_CONN_SETUP') {
          console.log('📡 RLC Layer: Received RLC data:', message);
          
          const newRlcData: RlcLayerData = {
            // RLC Mode
            rlc_mode: message.ieMap?.rlc_mode || 'AM',
            rlc_entity_id: message.ieMap?.rlc_entity_id || 1,
            
            // ARQ Parameters
            arq_enabled: message.ieMap?.arq_enabled || true,
            max_retransmissions: message.ieMap?.max_retransmissions || 4,
            retransmission_count: message.ieMap?.retransmission_count || 0,
            retransmission_timer: message.ieMap?.retransmission_timer || 100,
            poll_retransmit_timer: message.ieMap?.poll_retransmit_timer || 50,
            t_reordering: message.ieMap?.t_reordering || 35,
            t_status_prohibit: message.ieMap?.t_status_prohibit || 0,
            
            // Sequence Numbers
            tx_sn: message.ieMap?.tx_sn || 0,
            rx_sn: message.ieMap?.rx_sn || 0,
            tx_next: message.ieMap?.tx_next || 0,
            rx_next: message.ieMap?.rx_next || 0,
            tx_next_ack: message.ieMap?.tx_next_ack || 0,
            rx_next_highest: message.ieMap?.rx_next_highest || 0,
            
            // Buffer Status
            tx_buffer_size: message.ieMap?.tx_buffer_size || 1024,
            rx_buffer_size: message.ieMap?.rx_buffer_size || 1024,
            tx_buffer_utilization: message.ieMap?.tx_buffer_utilization || 0.15,
            rx_buffer_utilization: message.ieMap?.rx_buffer_utilization || 0.12,
            buffer_overflow_count: message.ieMap?.buffer_overflow_count || 0,
            buffer_underflow_count: message.ieMap?.buffer_underflow_count || 0,
            
            // PDU Statistics
            tx_pdu_count: message.ieMap?.tx_pdu_count || 0,
            rx_pdu_count: message.ieMap?.rx_pdu_count || 0,
            tx_pdu_bytes: message.ieMap?.tx_pdu_bytes || 0,
            rx_pdu_bytes: message.ieMap?.rx_pdu_bytes || 0,
            duplicate_pdu_count: message.ieMap?.duplicate_pdu_count || 0,
            out_of_order_pdu_count: message.ieMap?.out_of_order_pdu_count || 0,
            missing_pdu_count: message.ieMap?.missing_pdu_count || 0,
            
            // Error Handling
            crc_errors: message.ieMap?.crc_errors || 0,
            segmentation_errors: message.ieMap?.segmentation_errors || 0,
            reassembly_errors: message.ieMap?.reassembly_errors || 0,
            timeout_errors: message.ieMap?.timeout_errors || 0,
            
            // Performance Metrics
            throughput_dl: message.ieMap?.throughput_dl || 0,
            throughput_ul: message.ieMap?.throughput_ul || 0,
            latency: message.ieMap?.latency || 0,
            jitter: message.ieMap?.jitter || 0,
            packet_loss_rate: message.ieMap?.packet_loss_rate || 0,
            
            // Window Management
            window_size: message.ieMap?.window_size || 512,
            window_utilization: message.ieMap?.window_utilization || 0.25,
            window_stall_count: message.ieMap?.window_stall_count || 0,
            
            // Status Reports
            status_report_pending: message.ieMap?.status_report_pending || false,
            last_status_report: message.ieMap?.last_status_report || 0,
            status_report_interval: message.ieMap?.status_report_interval || 1000,
          };
          
          setRlcData(newRlcData);
          setIsReceivingData(true);
          setLastUpdate(new Date());
          
          // Update trends
          const now = Date.now();
          setThroughputTrend(prev => [...prev.slice(-19), { 
            time: now, 
            dl: newRlcData.throughput_dl, 
            ul: newRlcData.throughput_ul 
          }]);
          setBufferTrend(prev => [...prev.slice(-19), { 
            time: now, 
            tx: newRlcData.tx_buffer_utilization * 100, 
            rx: newRlcData.rx_buffer_utilization * 100 
          }]);
        }
      }
    });

    return () => {
      console.log(`📡 ComprehensiveRlcLayerView: Unsubscribing from events for execution: ${executionId}`);
      unsubscribe();
    };
  }, [executionId]);

  const getRlcModeColor = (mode: string) => {
    switch (mode) {
      case 'AM': return 'text-blue-600 bg-blue-100';
      case 'UM': return 'text-green-600 bg-green-100';
      case 'TM': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getBufferStatus = (utilization: number) => {
    if (utilization < 0.3) return { status: 'LOW', color: 'text-green-600', bg: 'bg-green-100' };
    if (utilization < 0.7) return { status: 'NORMAL', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (utilization < 0.9) return { status: 'HIGH', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { status: 'CRITICAL', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const getErrorRate = (errors: number, total: number) => {
    if (total === 0) return 0;
    return (errors / total) * 100;
  };

  if (!rlcData) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Layers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">RLC Layer Analysis</p>
          <p className="text-gray-400 text-sm">Waiting for test execution data...</p>
        </div>
      </div>
    );
  }

  const txBufferStatus = getBufferStatus(rlcData.tx_buffer_utilization);
  const rxBufferStatus = getBufferStatus(rlcData.rx_buffer_utilization);
  const totalPdus = rlcData.tx_pdu_count + rlcData.rx_pdu_count;
  const errorRate = getErrorRate(rlcData.crc_errors + rlcData.segmentation_errors + rlcData.reassembly_errors, totalPdus);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Layers className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">RLC Layer Analysis</h2>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getRlcModeColor(rlcData.rlc_mode)}`}>
              {rlcData.rlc_mode}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${txBufferStatus.bg} ${txBufferStatus.color}`}>
              TX: {txBufferStatus.status}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${rxBufferStatus.bg} ${rxBufferStatus.color}`}>
              RX: {rxBufferStatus.status}
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
            { id: 'arq', label: 'ARQ', icon: RefreshCw },
            { id: 'buffers', label: 'Buffers', icon: Database },
            { id: 'pdu', label: 'PDU Stats', icon: BarChart3 },
            { id: 'errors', label: 'Errors', icon: AlertTriangle },
            { id: 'performance', label: 'Performance', icon: TrendingUp }
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
            {/* RLC Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2" />
                RLC Layer Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{rlcData.tx_pdu_count + rlcData.rx_pdu_count}</div>
                  <div className="text-sm text-gray-600">Total PDUs</div>
                  <div className="text-xs text-gray-500">Processed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{(rlcData.throughput_dl + rlcData.throughput_ul).toFixed(1)}</div>
                  <div className="text-sm text-gray-600">Throughput</div>
                  <div className="text-xs text-gray-500">Mbps</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{rlcData.latency.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">Latency</div>
                  <div className="text-xs text-gray-500">ms</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{errorRate.toFixed(2)}%</div>
                  <div className="text-sm text-gray-600">Error Rate</div>
                  <div className="text-xs text-gray-500">PDU Errors</div>
                </div>
              </div>
            </div>

            {/* RLC Mode & Configuration */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                RLC Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Mode & Entity</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">RLC Mode</span>
                      <span className={`text-sm font-medium px-2 py-1 rounded ${getRlcModeColor(rlcData.rlc_mode)}`}>
                        {rlcData.rlc_mode}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Entity ID</span>
                      <span className="text-sm font-medium text-gray-900">{rlcData.rlc_entity_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">ARQ Enabled</span>
                      <span className={`text-sm font-medium px-2 py-1 rounded ${
                        rlcData.arq_enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {rlcData.arq_enabled ? 'YES' : 'NO'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Max Retransmissions</span>
                      <span className="text-sm font-medium text-gray-900">{rlcData.max_retransmissions}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Timers</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Retransmission Timer</span>
                      <span className="text-sm font-medium text-gray-900">{rlcData.retransmission_timer} ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Poll Retransmit Timer</span>
                      <span className="text-sm font-medium text-gray-900">{rlcData.poll_retransmit_timer} ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">T-Reordering</span>
                      <span className="text-sm font-medium text-gray-900">{rlcData.t_reordering} ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">T-Status-Prohibit</span>
                      <span className="text-sm font-medium text-gray-900">{rlcData.t_status_prohibit} ms</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Buffer Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Buffer Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">TX Buffer</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Buffer Size</span>
                      <span className="text-sm font-medium text-gray-900">{rlcData.tx_buffer_size} bytes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Utilization</span>
                      <span className="text-sm font-medium text-gray-900">{(rlcData.tx_buffer_utilization * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <span className={`text-sm font-medium px-2 py-1 rounded ${txBufferStatus.bg} ${txBufferStatus.color}`}>
                        {txBufferStatus.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Overflow Count</span>
                      <span className="text-sm font-medium text-gray-900">{rlcData.buffer_overflow_count}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">RX Buffer</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Buffer Size</span>
                      <span className="text-sm font-medium text-gray-900">{rlcData.rx_buffer_size} bytes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Utilization</span>
                      <span className="text-sm font-medium text-gray-900">{(rlcData.rx_buffer_utilization * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <span className={`text-sm font-medium px-2 py-1 rounded ${rxBufferStatus.bg} ${rxBufferStatus.color}`}>
                        {rxBufferStatus.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Underflow Count</span>
                      <span className="text-sm font-medium text-gray-900">{rlcData.buffer_underflow_count}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'arq' && (
          <div className="space-y-6">
            {/* ARQ Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">ARQ Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">ARQ Configuration</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">ARQ Enabled</span>
                      <span className={`text-sm font-medium px-2 py-1 rounded ${
                        rlcData.arq_enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {rlcData.arq_enabled ? 'YES' : 'NO'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Max Retransmissions</span>
                      <span className="text-sm font-medium text-gray-900">{rlcData.max_retransmissions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Current Retransmissions</span>
                      <span className="text-sm font-medium text-gray-900">{rlcData.retransmission_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Retransmission Rate</span>
                      <span className="text-sm font-medium text-gray-900">
                        {rlcData.max_retransmissions > 0 ? ((rlcData.retransmission_count / rlcData.max_retransmissions) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">ARQ Timers</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Retransmission Timer</span>
                      <span className="text-sm font-medium text-gray-900">{rlcData.retransmission_timer} ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Poll Retransmit Timer</span>
                      <span className="text-sm font-medium text-gray-900">{rlcData.poll_retransmit_timer} ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">T-Reordering</span>
                      <span className="text-sm font-medium text-gray-900">{rlcData.t_reordering} ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">T-Status-Prohibit</span>
                      <span className="text-sm font-medium text-gray-900">{rlcData.t_status_prohibit} ms</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sequence Numbers */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sequence Numbers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">TX Sequence Numbers</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">TX SN</span>
                      <span className="text-sm font-medium text-gray-900">{rlcData.tx_sn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">TX Next</span>
                      <span className="text-sm font-medium text-gray-900">{rlcData.tx_next}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">TX Next ACK</span>
                      <span className="text-sm font-medium text-gray-900">{rlcData.tx_next_ack}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">RX Sequence Numbers</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">RX SN</span>
                      <span className="text-sm font-medium text-gray-900">{rlcData.rx_sn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">RX Next</span>
                      <span className="text-sm font-medium text-gray-900">{rlcData.rx_next}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">RX Next Highest</span>
                      <span className="text-sm font-medium text-gray-900">{rlcData.rx_next_highest}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'buffers' && (
          <div className="space-y-6">
            {/* Buffer Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Buffer Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">TX Buffer</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Buffer Size</span>
                      <span className="text-lg font-semibold text-gray-900">{rlcData.tx_buffer_size} bytes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Utilization</span>
                      <span className="text-lg font-semibold text-gray-900">{(rlcData.tx_buffer_utilization * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Used Space</span>
                      <span className="text-sm font-medium text-gray-900">
                        {Math.round(rlcData.tx_buffer_size * rlcData.tx_buffer_utilization)} bytes
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Free Space</span>
                      <span className="text-sm font-medium text-gray-900">
                        {Math.round(rlcData.tx_buffer_size * (1 - rlcData.tx_buffer_utilization))} bytes
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Overflow Count</span>
                      <span className="text-sm font-medium text-gray-900">{rlcData.buffer_overflow_count}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">RX Buffer</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Buffer Size</span>
                      <span className="text-lg font-semibold text-gray-900">{rlcData.rx_buffer_size} bytes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Utilization</span>
                      <span className="text-lg font-semibold text-gray-900">{(rlcData.rx_buffer_utilization * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Used Space</span>
                      <span className="text-sm font-medium text-gray-900">
                        {Math.round(rlcData.rx_buffer_size * rlcData.rx_buffer_utilization)} bytes
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Free Space</span>
                      <span className="text-sm font-medium text-gray-900">
                        {Math.round(rlcData.rx_buffer_size * (1 - rlcData.rx_buffer_utilization))} bytes
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Underflow Count</span>
                      <span className="text-sm font-medium text-gray-900">{rlcData.buffer_underflow_count}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Window Management */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Window Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{rlcData.window_size}</div>
                  <div className="text-sm text-gray-600">Window Size</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{(rlcData.window_utilization * 100).toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Window Utilization</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{rlcData.window_stall_count}</div>
                  <div className="text-sm text-gray-600">Stall Count</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'pdu' && (
          <div className="space-y-6">
            {/* PDU Statistics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">PDU Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">TX PDU Statistics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">TX PDU Count</span>
                      <span className="text-lg font-semibold text-gray-900">{rlcData.tx_pdu_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">TX PDU Bytes</span>
                      <span className="text-sm font-medium text-gray-900">{rlcData.tx_pdu_bytes} bytes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Avg TX PDU Size</span>
                      <span className="text-sm font-medium text-gray-900">
                        {rlcData.tx_pdu_count > 0 ? (rlcData.tx_pdu_bytes / rlcData.tx_pdu_count).toFixed(1) : 0} bytes
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">RX PDU Statistics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">RX PDU Count</span>
                      <span className="text-lg font-semibold text-gray-900">{rlcData.rx_pdu_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">RX PDU Bytes</span>
                      <span className="text-sm font-medium text-gray-900">{rlcData.rx_pdu_bytes} bytes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Avg RX PDU Size</span>
                      <span className="text-sm font-medium text-gray-900">
                        {rlcData.rx_pdu_count > 0 ? (rlcData.rx_pdu_bytes / rlcData.rx_pdu_count).toFixed(1) : 0} bytes
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PDU Error Statistics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">PDU Error Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{rlcData.duplicate_pdu_count}</div>
                  <div className="text-sm text-gray-600">Duplicate PDUs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{rlcData.out_of_order_pdu_count}</div>
                  <div className="text-sm text-gray-600">Out of Order</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{rlcData.missing_pdu_count}</div>
                  <div className="text-sm text-gray-600">Missing PDUs</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'errors' && (
          <div className="space-y-6">
            {/* Error Statistics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Error Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Error Counts</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">CRC Errors</span>
                      <span className="text-lg font-semibold text-red-600">{rlcData.crc_errors}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Segmentation Errors</span>
                      <span className="text-lg font-semibold text-orange-600">{rlcData.segmentation_errors}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Reassembly Errors</span>
                      <span className="text-lg font-semibold text-yellow-600">{rlcData.reassembly_errors}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Timeout Errors</span>
                      <span className="text-lg font-semibold text-purple-600">{rlcData.timeout_errors}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Error Rates</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Error Rate</span>
                      <span className="text-lg font-semibold text-gray-900">{errorRate.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">CRC Error Rate</span>
                      <span className="text-sm font-medium text-gray-900">
                        {totalPdus > 0 ? ((rlcData.crc_errors / totalPdus) * 100).toFixed(2) : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Segmentation Error Rate</span>
                      <span className="text-sm font-medium text-gray-900">
                        {totalPdus > 0 ? ((rlcData.segmentation_errors / totalPdus) * 100).toFixed(2) : 0}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Reassembly Error Rate</span>
                      <span className="text-sm font-medium text-gray-900">
                        {totalPdus > 0 ? ((rlcData.reassembly_errors / totalPdus) * 100).toFixed(2) : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'performance' && (
          <div className="space-y-6">
            {/* Performance Metrics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Throughput</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Downlink Throughput</span>
                      <span className="text-lg font-semibold text-gray-900">{rlcData.throughput_dl.toFixed(1)} Mbps</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Uplink Throughput</span>
                      <span className="text-lg font-semibold text-gray-900">{rlcData.throughput_ul.toFixed(1)} Mbps</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Throughput</span>
                      <span className="text-sm font-medium text-gray-900">
                        {(rlcData.throughput_dl + rlcData.throughput_ul).toFixed(1)} Mbps
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Quality Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Latency</span>
                      <span className="text-lg font-semibold text-gray-900">{rlcData.latency.toFixed(1)} ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Jitter</span>
                      <span className="text-lg font-semibold text-gray-900">{rlcData.jitter.toFixed(1)} ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Packet Loss Rate</span>
                      <span className="text-sm font-medium text-gray-900">{(rlcData.packet_loss_rate * 100).toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Reports */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Reports</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${rlcData.status_report_pending ? 'text-orange-600' : 'text-green-600'}`}>
                    {rlcData.status_report_pending ? 'PENDING' : 'NONE'}
                  </div>
                  <div className="text-sm text-gray-600">Status Report</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{rlcData.last_status_report}</div>
                  <div className="text-sm text-gray-600">Last Report (ms ago)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{rlcData.status_report_interval}</div>
                  <div className="text-sm text-gray-600">Report Interval (ms)</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComprehensiveRlcLayerView;
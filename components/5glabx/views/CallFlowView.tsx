'use client';

import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  ArrowRight, 
  ArrowDown, 
  Clock, 
  Search, 
  Filter,
  Play,
  Pause,
  Square,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  Info,
  User,
  Server,
  Network
} from 'lucide-react';

const CallFlowView: React.FC<{
  appState: any;
  onStateChange: (state: any) => void;
}> = ({ appState, onStateChange }) => {
  const [callFlows, setCallFlows] = useState([
    {
      id: 1,
      name: '5G NR Initial Access',
      type: 'Initial Access',
      status: 'completed',
      duration: '2.3s',
      steps: [
        { id: 1, from: 'UE', to: 'gNB', message: 'Random Access Preamble', timestamp: '0ms', status: 'success' },
        { id: 2, from: 'gNB', to: 'UE', message: 'Random Access Response', timestamp: '15ms', status: 'success' },
        { id: 3, from: 'UE', to: 'gNB', message: 'RRC Connection Request', timestamp: '25ms', status: 'success' },
        { id: 4, from: 'gNB', to: 'UE', message: 'RRC Connection Setup', timestamp: '35ms', status: 'success' },
        { id: 5, from: 'UE', to: 'gNB', message: 'RRC Connection Setup Complete', timestamp: '45ms', status: 'success' },
        { id: 6, from: 'gNB', to: 'AMF', message: 'Initial UE Message', timestamp: '50ms', status: 'success' },
        { id: 7, from: 'AMF', to: 'gNB', message: 'Downlink NAS Transport', timestamp: '120ms', status: 'success' },
        { id: 8, from: 'gNB', to: 'UE', message: 'DL Information Transfer', timestamp: '125ms', status: 'success' },
        { id: 9, from: 'UE', to: 'gNB', message: 'UL Information Transfer', timestamp: '135ms', status: 'success' },
        { id: 10, from: 'gNB', to: 'AMF', message: 'Uplink NAS Transport', timestamp: '140ms', status: 'success' }
      ]
    },
    {
      id: 2,
      name: 'LTE Attach Procedure',
      type: 'Attach',
      status: 'completed',
      duration: '1.8s',
      steps: [
        { id: 1, from: 'UE', to: 'eNB', message: 'RRC Connection Request', timestamp: '0ms', status: 'success' },
        { id: 2, from: 'eNB', to: 'UE', message: 'RRC Connection Setup', timestamp: '10ms', status: 'success' },
        { id: 3, from: 'UE', to: 'eNB', message: 'RRC Connection Setup Complete', timestamp: '20ms', status: 'success' },
        { id: 4, from: 'eNB', to: 'MME', message: 'Initial UE Message', timestamp: '25ms', status: 'success' },
        { id: 5, from: 'MME', to: 'eNB', message: 'Downlink NAS Transport', timestamp: '80ms', status: 'success' },
        { id: 6, from: 'eNB', to: 'UE', message: 'DL Information Transfer', timestamp: '85ms', status: 'success' },
        { id: 7, from: 'UE', to: 'eNB', message: 'UL Information Transfer', timestamp: '95ms', status: 'success' },
        { id: 8, from: 'eNB', to: 'MME', message: 'Uplink NAS Transport', timestamp: '100ms', status: 'success' },
        { id: 9, from: 'MME', to: 'SGW', message: 'Create Session Request', timestamp: '150ms', status: 'success' },
        { id: 10, from: 'SGW', to: 'PGW', message: 'Create Session Request', timestamp: '200ms', status: 'success' },
        { id: 11, from: 'PGW', to: 'SGW', message: 'Create Session Response', timestamp: '300ms', status: 'success' },
        { id: 12, from: 'SGW', to: 'MME', message: 'Create Session Response', timestamp: '350ms', status: 'success' },
        { id: 13, from: 'MME', to: 'eNB', message: 'Initial Context Setup Request', timestamp: '400ms', status: 'success' },
        { id: 14, from: 'eNB', to: 'UE', message: 'RRC Connection Reconfiguration', timestamp: '405ms', status: 'success' },
        { id: 15, from: 'UE', to: 'eNB', message: 'RRC Connection Reconfiguration Complete', timestamp: '415ms', status: 'success' },
        { id: 16, from: 'eNB', to: 'MME', message: 'Initial Context Setup Response', timestamp: '420ms', status: 'success' }
      ]
    },
    {
      id: 3,
      name: 'IMS SIP Registration',
      type: 'IMS',
      status: 'in-progress',
      duration: '0.8s',
      steps: [
        { id: 1, from: 'UE', to: 'P-CSCF', message: 'SIP REGISTER', timestamp: '0ms', status: 'success' },
        { id: 2, from: 'P-CSCF', to: 'I-CSCF', message: 'SIP REGISTER', timestamp: '50ms', status: 'success' },
        { id: 3, from: 'I-CSCF', to: 'S-CSCF', message: 'SIP REGISTER', timestamp: '100ms', status: 'success' },
        { id: 4, from: 'S-CSCF', to: 'HSS', message: 'Cx-Query', timestamp: '150ms', status: 'success' },
        { id: 5, from: 'HSS', to: 'S-CSCF', message: 'Cx-Query Response', timestamp: '200ms', status: 'success' },
        { id: 6, from: 'S-CSCF', to: 'I-CSCF', message: 'SIP 200 OK', timestamp: '250ms', status: 'success' },
        { id: 7, from: 'I-CSCF', to: 'P-CSCF', message: 'SIP 200 OK', timestamp: '300ms', status: 'success' },
        { id: 8, from: 'P-CSCF', to: 'UE', message: 'SIP 200 OK', timestamp: '350ms', status: 'success' }
      ]
    }
  ]);

  const [selectedFlow, setSelectedFlow] = useState(callFlows[0]);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isPlaying, setIsPlaying] = useState(false);

  const types = ['all', 'Initial Access', 'Attach', 'Handover', 'IMS', 'Data Transfer'];
  const statuses = ['all', 'completed', 'in-progress', 'failed'];

  const filteredCallFlows = callFlows.filter(flow => {
    const matchesType = selectedType === 'all' || flow.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || flow.status === selectedStatus;
    
    return matchesType && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEntityIcon = (entity: string) => {
    switch (entity) {
      case 'UE':
        return <User className="w-4 h-4 text-blue-500" />;
      case 'gNB':
      case 'eNB':
        return <Network className="w-4 h-4 text-green-500" />;
      case 'AMF':
      case 'MME':
      case 'S-CSCF':
      case 'I-CSCF':
      case 'P-CSCF':
      case 'HSS':
      case 'SGW':
      case 'PGW':
        return <Server className="w-4 h-4 text-purple-500" />;
      default:
        return <Network className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Call Flow</h1>
          <p className="text-gray-600 mt-1">Protocol message sequences and call flow analysis</p>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center space-x-4">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {types.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Types' : type}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Call Flow List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Call Flows</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredCallFlows.map((flow) => (
                <div 
                  key={flow.id}
                  onClick={() => setSelectedFlow(flow)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedFlow.id === flow.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{flow.name}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(flow.status)}`}>
                      {flow.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{flow.type}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{flow.steps.length} steps</span>
                    <span>{flow.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call Flow Visualization */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{selectedFlow.name}</h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedFlow.status)}`}>
                    {selectedFlow.status}
                  </span>
                  <span className="text-sm text-gray-500">{selectedFlow.duration}</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {selectedFlow.steps.map((step, index) => (
                  <div key={step.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-16 text-right">
                      <span className="text-sm font-mono text-gray-500">{step.timestamp}</span>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <div className="flex items-center space-x-2">
                        {getEntityIcon(step.from)}
                        <span className="text-sm font-medium text-gray-700">{step.from}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 flex items-center justify-center">
                      <div className="flex items-center space-x-2">
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
                          {step.message}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-700">{step.to}</span>
                        {getEntityIcon(step.to)}
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0">
                      {getStatusIcon(step.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call Flow Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Phone className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Call Flows</p>
              <p className="text-2xl font-semibold text-gray-900">{callFlows.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {callFlows.filter(f => f.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900">
                {callFlows.filter(f => f.status === 'in-progress').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Failed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {callFlows.filter(f => f.status === 'failed').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallFlowView;
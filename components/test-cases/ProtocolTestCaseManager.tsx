'use client';

import React, { useState } from 'react';
import NRTestCaseViewer from './NRTestCaseViewer';
import LTETestCaseViewer from './LTETestCaseViewer';
import IMSSIPTestCaseViewer from './IMSSIPTestCaseViewer';
import { 
  Wifi, 
  Signal, 
  Activity, 
  Layers,
  BarChart3,
  FileText,
  Settings,
  Database,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ProtocolTestCaseManagerProps {
  userId: string;
}

const ProtocolTestCaseManager: React.FC<ProtocolTestCaseManagerProps> = ({ userId }) => {
  const [activeProtocol, setActiveProtocol] = useState<'5G_NR' | '4G_LTE' | 'IMS_SIP' | 'O_RAN' | 'NB_IoT' | 'V2X' | 'NTN'>('5G_NR');

  const protocols = [
    {
      id: '5G_NR',
      name: '5G NR',
      description: '5G New Radio protocol test cases',
      icon: <Signal className="w-5 h-5" />,
      color: 'bg-blue-100 text-blue-600',
      count: '150+',
      status: 'completed'
    },
    {
      id: '4G_LTE',
      name: '4G LTE',
      description: '4G Long Term Evolution protocol test cases',
      icon: <Wifi className="w-5 h-5" />,
      color: 'bg-green-100 text-green-600',
      count: '150+',
      status: 'completed'
    },
    {
      id: 'IMS_SIP',
      name: 'IMS/SIP',
      description: 'IP Multimedia Subsystem and SIP protocol test cases',
      icon: <Activity className="w-5 h-5" />,
      color: 'bg-purple-100 text-purple-600',
      count: '100+',
      status: 'completed'
    },
    {
      id: 'O_RAN',
      name: 'O-RAN',
      description: 'Open Radio Access Network protocol test cases',
      icon: <Layers className="w-5 h-5" />,
      color: 'bg-orange-100 text-orange-600',
      count: '100+',
      status: 'pending'
    },
    {
      id: 'NB_IoT',
      name: 'NB-IoT',
      description: 'Narrowband Internet of Things protocol test cases',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'bg-yellow-100 text-yellow-600',
      count: '50+',
      status: 'pending'
    },
    {
      id: 'V2X',
      name: 'V2X',
      description: 'Vehicle-to-Everything communication protocol test cases',
      icon: <FileText className="w-5 h-5" />,
      color: 'bg-red-100 text-red-600',
      count: '50+',
      status: 'pending'
    },
    {
      id: 'NTN',
      name: 'NTN',
      description: 'Non-Terrestrial Network protocol test cases',
      icon: <Settings className="w-5 h-5" />,
      color: 'bg-indigo-100 text-indigo-600',
      count: '50+',
      status: 'pending'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderProtocolViewer = () => {
    switch (activeProtocol) {
      case '5G_NR':
        return <NRTestCaseViewer userId={userId} />;
      case '4G_LTE':
        return <LTETestCaseViewer userId={userId} />;
      case 'IMS_SIP':
        return <IMSSIPTestCaseViewer userId={userId} />;
      case 'O_RAN':
        return (
          <div className="text-center py-12">
            <Layers className="w-12 h-12 text-orange-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">O-RAN Test Cases</h3>
            <p className="text-gray-500">Coming soon in Phase 2, Week 6</p>
          </div>
        );
      case 'NB_IoT':
        return (
          <div className="text-center py-12">
            <BarChart3 className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">NB-IoT Test Cases</h3>
            <p className="text-gray-500">Coming soon in Phase 2, Week 7</p>
          </div>
        );
      case 'V2X':
        return (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">V2X Test Cases</h3>
            <p className="text-gray-500">Coming soon in Phase 2, Week 7</p>
          </div>
        );
      case 'NTN':
        return (
          <div className="text-center py-12">
            <Settings className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">NTN Test Cases</h3>
            <p className="text-gray-500">Coming soon in Phase 2, Week 7</p>
          </div>
        );
      default:
        return <NRTestCaseViewer userId={userId} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Protocol Selection */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Protocol Test Cases</h2>
            <p className="text-gray-600">Comprehensive test cases for all 3GPP protocols</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Database className="w-4 h-4" />
              <span>7 Protocols</span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Zap className="w-4 h-4" />
              <span>650+ Test Cases</span>
            </div>
          </div>
        </div>

        {/* Protocol Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {protocols.map((protocol) => (
            <button
              key={protocol.id}
              onClick={() => setActiveProtocol(protocol.id as any)}
              className={`p-4 rounded-lg border-2 transition-all ${
                activeProtocol === protocol.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 ${protocol.color}`}>
                  {protocol.icon}
                </div>
                <h3 className="font-medium text-gray-900 text-sm mb-1">{protocol.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{protocol.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700">{protocol.count}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(protocol.status)}`}>
                    {protocol.status}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Protocol Viewer */}
      <div className="bg-white rounded-lg border border-gray-200">
        {renderProtocolViewer()}
      </div>
    </div>
  );
};

export default ProtocolTestCaseManager;
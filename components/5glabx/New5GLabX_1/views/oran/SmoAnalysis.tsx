'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Activity, Database, Wifi, Server, Phone, Shield, AlertTriangle, CheckCircle, Clock, XCircle, Layers, Cpu, BarChart3 } from 'lucide-react';

interface SmoAnalysisProps {
  executionId?: string | null;
}

const SmoAnalysis: React.FC<SmoAnalysisProps> = ({ executionId }) => {
  const [isReceivingData, setIsReceivingData] = useState(true); // Set to true to show data
  const [lastDataReceived, setLastDataReceived] = useState<Date | null>(new Date());

  useEffect(() => {
    const handleTestExecution = (event: any) => {
      if (event.type === '5GLABX_TEST_EXECUTION' && event.detail?.testCaseData) {
        console.log('🔥 SmoAnalysis: Received test execution event:', event.detail);
        setIsReceivingData(true);
        setLastDataReceived(new Date());
      }
    };

    window.addEventListener('5GLABX_TEST_EXECUTION', handleTestExecution);
    return () => window.removeEventListener('5GLABX_TEST_EXECUTION', handleTestExecution);
  }, []);

  const orchestratedServices = [
    { name: 'Network Slicing', instances: 3, cpuUsage: 45, status: 'active', color: 'bg-green-500' },
    { name: 'Resource Management', instances: 2, cpuUsage: 30, status: 'active', color: 'bg-green-500' },
    { name: 'Policy Engine', instances: 1, cpuUsage: 25, status: 'active', color: 'bg-green-500' },
    { name: 'Analytics Service', instances: 0, cpuUsage: 0, status: 'failed', color: 'bg-red-500' },
    { name: 'Configuration Management', instances: 1, cpuUsage: 15, status: 'pending', color: 'bg-yellow-500' }
  ];

  const policyManagement = [
    { name: 'QoS Policy', type: 'A1', priority: 'high', status: 'active' },
    { name: 'Resource Allocation', type: 'O1', priority: 'medium', status: 'active' },
    { name: 'Security Policy', type: 'A1', priority: 'high', status: 'inactive' },
    { name: 'Traffic Steering', type: 'A1', priority: 'low', status: 'active' }
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">SMO Analysis</h1>
        </div>

        {/* Service Overview Cards */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">8</div>
            <div className="text-sm text-gray-600">Total Services</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">6</div>
            <div className="text-sm text-gray-600">Active Services</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600">1</div>
            <div className="text-sm text-gray-600">Failed Services</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">1</div>
            <div className="text-sm text-gray-600">Pending Services</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orchestrated Services */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Layers className="w-5 h-5 mr-2 text-blue-600" />
              Orchestrated Services
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {orchestratedServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${service.color}`}></div>
                    <div>
                      <div className="font-medium text-gray-900">{service.name}</div>
                      <div className="text-sm text-gray-500">{service.instances} instances</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{service.cpuUsage}% CPU</div>
                    <div className="text-xs text-gray-500 capitalize">{service.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Policy Management */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-600" />
              Policy Management
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {policyManagement.map((policy, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{policy.name}</div>
                    <div className="text-sm text-gray-500">Type: {policy.type}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      policy.priority === 'high' 
                        ? 'bg-red-100 text-red-800' 
                        : policy.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {policy.priority}
                    </span>
                    <div className={`w-3 h-3 rounded-full ${
                      policy.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Activate Windows Watermark (as shown in image) */}
      <div className="fixed bottom-4 right-4 text-gray-400 text-sm">
        <div>Activate Windows</div>
        <div className="text-xs">Go to Settings to activate Windows.</div>
      </div>
    </div>
  );
};

export default SmoAnalysis;
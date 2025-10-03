'use client';

import React from 'react';
import { Network, Server, Database, Settings, BarChart3 } from 'lucide-react';

const OranView: React.FC<{ viewId?: string }> = ({ viewId = 'oran-overview' }) => {
  const getViewContent = () => {
    switch (viewId) {
      case 'oran-overview':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Network className="w-5 h-5 mr-2" />
                O-RAN Overview
              </h3>
              <p className="text-gray-600 mb-4">
                Open Radio Access Network (O-RAN) analysis and monitoring dashboard.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900">CU Status</h4>
                  <p className="text-2xl font-bold text-blue-600">Active</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900">DU Status</h4>
                  <p className="text-2xl font-bold text-green-600">Connected</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-900">xApps</h4>
                  <p className="text-2xl font-bold text-purple-600">3 Running</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'oran-performance':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                O-RAN Performance Metrics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700">Throughput</h4>
                  <p className="text-2xl font-bold text-blue-600">1.2 Gbps</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700">Latency</h4>
                  <p className="text-2xl font-bold text-green-600">5.2 ms</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700">Availability</h4>
                  <p className="text-2xl font-bold text-purple-600">99.9%</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700">Active UEs</h4>
                  <p className="text-2xl font-bold text-orange-600">1,247</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Network className="w-5 h-5 mr-2" />
              {viewId.replace('oran-', '').replace('-', ' ').toUpperCase()}
            </h3>
            <p className="text-gray-600">
              O-RAN {viewId.replace('oran-', '').replace('-', ' ')} analysis view.
            </p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800">
                This O-RAN analysis view is ready for implementation with real-time data from your O-RAN infrastructure.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">O-RAN Analysis</h2>
        <p className="text-gray-600">Open Radio Access Network monitoring and analysis</p>
      </div>
      {getViewContent()}
    </div>
  );
};

export default OranView;
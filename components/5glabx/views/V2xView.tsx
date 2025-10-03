'use client';

import React from 'react';
import { Network, Wifi, BarChart3, CheckCircle, FileText } from 'lucide-react';

const V2xView: React.FC<{ viewId?: string }> = ({ viewId = 'v2x-overview' }) => {
  const getViewContent = () => {
    switch (viewId) {
      case 'v2x-overview':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Network className="w-5 h-5 mr-2" />
                C-V2X Overview
              </h3>
              <p className="text-gray-600 mb-4">
                Cellular Vehicle-to-Everything (C-V2X) communication analysis and monitoring.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900">Active Vehicles</h4>
                  <p className="text-2xl font-bold text-blue-600">1,456</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900">PC5 Links</h4>
                  <p className="text-2xl font-bold text-green-600">3,247</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-900">Safety Messages</h4>
                  <p className="text-2xl font-bold text-purple-600">15,678/s</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'v2x-analytics':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                C-V2X Analytics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700">Latency</h4>
                  <p className="text-2xl font-bold text-green-600">3.2 ms</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700">Reliability</h4>
                  <p className="text-2xl font-bold text-blue-600">99.99%</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700">Range</h4>
                  <p className="text-2xl font-bold text-purple-600">1.5 km</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700">Throughput</h4>
                  <p className="text-2xl font-bold text-orange-600">10 Mbps</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'v2x-sidelink':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Wifi className="w-5 h-5 mr-2" />
              PC5 Sidelink Analysis
            </h3>
            <p className="text-gray-600 mb-4">
              Direct vehicle-to-vehicle communication via PC5 interface.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900">Active Sidelinks</h4>
                <p className="text-2xl font-bold text-blue-600">2,847</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900">Message Rate</h4>
                <p className="text-2xl font-bold text-green-600">10 Hz</p>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Network className="w-5 h-5 mr-2" />
              {viewId.replace('v2x-', '').replace('-', ' ').toUpperCase()}
            </h3>
            <p className="text-gray-600">
              C-V2X {viewId.replace('v2x-', '').replace('-', ' ')} analysis view.
            </p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800">
                This C-V2X analysis view is ready for implementation with real-time data from your vehicular network.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">C-V2X Analysis</h2>
        <p className="text-gray-600">Cellular Vehicle-to-Everything communication analysis</p>
      </div>
      {getViewContent()}
    </div>
  );
};

export default V2xView;
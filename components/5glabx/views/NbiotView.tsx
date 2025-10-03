'use client';

import React from 'react';
import { Wifi, Phone, BarChart3, Settings, CheckCircle } from 'lucide-react';

const NbiotView: React.FC<{ viewId?: string }> = ({ viewId = 'nbiot-overview' }) => {
  const getViewContent = () => {
    switch (viewId) {
      case 'nbiot-overview':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Wifi className="w-5 h-5 mr-2" />
                NB-IoT Overview
              </h3>
              <p className="text-gray-600 mb-4">
                Narrowband Internet of Things (NB-IoT) network analysis and device monitoring.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900">Connected Devices</h4>
                  <p className="text-2xl font-bold text-green-600">2,847</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900">Data Sessions</h4>
                  <p className="text-2xl font-bold text-blue-600">1,234</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-900">Coverage</h4>
                  <p className="text-2xl font-bold text-purple-600">98.5%</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'nbiot-analytics':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                NB-IoT Analytics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700">Power Consumption</h4>
                  <p className="text-2xl font-bold text-green-600">Ultra Low</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700">Battery Life</h4>
                  <p className="text-2xl font-bold text-blue-600">10+ Years</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700">Range</h4>
                  <p className="text-2xl font-bold text-purple-600">15 km</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700">Capacity</h4>
                  <p className="text-2xl font-bold text-orange-600">50K devices</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Wifi className="w-5 h-5 mr-2" />
              {viewId.replace('nbiot-', '').replace('-', ' ').toUpperCase()}
            </h3>
            <p className="text-gray-600">
              NB-IoT {viewId.replace('nbiot-', '').replace('-', ' ')} analysis view.
            </p>
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-green-800">
                This NB-IoT analysis view is ready for implementation with real-time data from your IoT devices.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">NB-IoT Analysis</h2>
        <p className="text-gray-600">Narrowband Internet of Things monitoring and analysis</p>
      </div>
      {getViewContent()}
    </div>
  );
};

export default NbiotView;
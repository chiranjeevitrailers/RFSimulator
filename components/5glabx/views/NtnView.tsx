'use client';

import React from 'react';
import { Network, Wifi, BarChart3, FileText, Clock, Activity } from 'lucide-react';

const NtnView: React.FC<{ viewId?: string }> = ({ viewId = 'ntn-overview' }) => {
  const getViewContent = () => {
    switch (viewId) {
      case 'ntn-overview':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Network className="w-5 h-5 mr-2" />
                NTN Overview
              </h3>
              <p className="text-gray-600 mb-4">
                Non-Terrestrial Network (NTN) satellite communication analysis and monitoring.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900">Active Satellites</h4>
                  <p className="text-2xl font-bold text-blue-600">12</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900">Coverage</h4>
                  <p className="text-2xl font-bold text-green-600">Global</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-900">Connected UEs</h4>
                  <p className="text-2xl font-bold text-purple-600">5,678</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'ntn-analytics':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                NTN Analytics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700">Propagation Delay</h4>
                  <p className="text-2xl font-bold text-blue-600">250 ms</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700">Doppler Shift</h4>
                  <p className="text-2xl font-bold text-green-600">±7 kHz</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700">Link Budget</h4>
                  <p className="text-2xl font-bold text-purple-600">-120 dBm</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700">Elevation</h4>
                  <p className="text-2xl font-bold text-orange-600">45°</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'ntn-satellites':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Wifi className="w-5 h-5 mr-2" />
              Satellite Links
            </h3>
            <p className="text-gray-600 mb-4">
              Real-time satellite constellation and link status monitoring.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900">LEO Satellites</h4>
                <p className="text-2xl font-bold text-blue-600">8 Active</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900">GEO Satellites</h4>
                <p className="text-2xl font-bold text-green-600">4 Active</p>
              </div>
            </div>
          </div>
        );
      
      case 'ntn-timing':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Timing & Delay Analysis
            </h3>
            <p className="text-gray-600 mb-4">
              Satellite timing advance and propagation delay compensation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700">Round Trip Time</h4>
                <p className="text-2xl font-bold text-blue-600">500 ms</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700">Timing Advance</h4>
                <p className="text-2xl font-bold text-green-600">±250 ms</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700">Sync Accuracy</h4>
                <p className="text-2xl font-bold text-purple-600">±1 μs</p>
              </div>
            </div>
          </div>
        );
      
      case 'ntn-doppler':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Doppler Analysis
            </h3>
            <p className="text-gray-600 mb-4">
              Doppler shift compensation and frequency tracking for satellite links.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900">Max Doppler Shift</h4>
                <p className="text-2xl font-bold text-blue-600">±7 kHz</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900">Compensation Rate</h4>
                <p className="text-2xl font-bold text-green-600">1 kHz/s</p>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Network className="w-5 h-5 mr-2" />
              {viewId.replace('ntn-', '').replace('-', ' ').toUpperCase()}
            </h3>
            <p className="text-gray-600">
              NTN {viewId.replace('ntn-', '').replace('-', ' ')} analysis view.
            </p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800">
                This NTN analysis view is ready for implementation with real-time data from your satellite network.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">NTN Analysis</h2>
        <p className="text-gray-600">Non-Terrestrial Network satellite communication analysis</p>
      </div>
      {getViewContent()}
    </div>
  );
};

export default NtnView;
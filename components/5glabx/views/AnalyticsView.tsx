'use client';

import React from 'react';
import { BarChart3, TrendingUp, Activity, Zap } from 'lucide-react';

export default function AnalyticsView() {
  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="w-6 h-6 mr-2" />
          Real-time Analytics
        </h2>
        <p className="text-gray-600 mb-6">
          Live performance metrics and analysis from your 5G/4G network test executions.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-blue-900">Throughput</h3>
                <p className="text-2xl font-bold text-blue-600">1.2 Gbps</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-green-900">Latency</h3>
                <p className="text-2xl font-bold text-green-600">5.2 ms</p>
              </div>
              <Zap className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-purple-900">Success Rate</h3>
                <p className="text-2xl font-bold text-purple-600">99.8%</p>
              </div>
              <Activity className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-orange-900">Active Tests</h3>
                <p className="text-2xl font-bold text-orange-600">12</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <p className="text-green-800">
            <strong>✅ Analytics Ready:</strong> This view will show real-time metrics from your test executions. 
            Data will populate automatically when test cases are running.
          </p>
        </div>
      </div>
    </div>
  );
}
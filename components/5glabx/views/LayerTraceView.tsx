'use client';

import React from 'react';
import { Network, ArrowRight, ArrowDown, ArrowUp } from 'lucide-react';

export default function LayerTraceView() {
  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <Network className="w-6 h-6 mr-2" />
          Layer Trace Analysis
        </h2>
        <p className="text-gray-600 mb-6">
          Real-time protocol layer message tracing and flow analysis.
        </p>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
              <ArrowUp className="w-4 h-4 mr-2" />
              Uplink Messages
            </h3>
            <div className="text-sm text-blue-800">
              PHY → MAC → RLC → PDCP → RRC → NAS
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2 flex items-center">
              <ArrowDown className="w-4 h-4 mr-2" />
              Downlink Messages
            </h3>
            <div className="text-sm text-green-800">
              NAS → RRC → PDCP → RLC → MAC → PHY
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-semibold text-purple-900 mb-2 flex items-center">
              <ArrowRight className="w-4 h-4 mr-2" />
              Cross-Layer Interactions
            </h3>
            <div className="text-sm text-purple-800">
              Real-time cross-layer message correlation and timing analysis
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <p className="text-green-800">
            <strong>✅ Layer Trace Ready:</strong> This view will show real-time protocol layer message flows 
            and cross-layer interactions when test cases are executing.
          </p>
        </div>
      </div>
    </div>
  );
}
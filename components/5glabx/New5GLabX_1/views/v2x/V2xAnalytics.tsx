'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, Activity, Database, Wifi, Server, Phone, Shield, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';

interface V2xAnalyticsProps {
  executionId?: string | null;
}

const V2xAnalytics: React.FC<V2xAnalyticsProps> = ({ executionId }) => {
  const [isReceivingData, setIsReceivingData] = useState(false);
  const [lastDataReceived, setLastDataReceived] = useState<Date | null>(null);

  useEffect(() => {
    const handleTestExecution = (event: any) => {
      if (event.type === '5GLABX_TEST_EXECUTION' && event.detail?.testCaseData) {
        console.log('🔥 V2xAnalytics: Received test execution event:', event.detail);
        setIsReceivingData(true);
        setLastDataReceived(new Date());
      }
    };

    window.addEventListener('5GLABX_TEST_EXECUTION', handleTestExecution);
    return () => window.removeEventListener('5GLABX_TEST_EXECUTION', handleTestExecution);
  }, []);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">V2x Analytics</h2>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              isReceivingData ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {isReceivingData ? 'Live Data' : 'Waiting'}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${isReceivingData ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-3 h-3 rounded-full ${isReceivingData ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
              <span className="text-sm font-medium">
                {isReceivingData ? '🟢 Live Data' : '⚪ Waiting'}
              </span>
            </div>
            {lastDataReceived && (
              <span className="text-xs text-gray-500">
                Last: {lastDataReceived.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className={`w-12 h-12 rounded-full ${isReceivingData ? 'bg-green-100 animate-pulse' : 'bg-gray-100'} flex items-center justify-center mb-4 mx-auto`}>
            {isReceivingData ? (
              <div className="w-6 h-6 bg-green-500 rounded-full animate-bounce"></div>
            ) : (
              <BarChart3 className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <p className="text-gray-500 text-sm mb-2">
            {isReceivingData ? '🎯 V2x Analytics - 3GPP standard parameters...' : '📭 No v2x analytics data available'}
          </p>
          <p className="text-gray-400 text-xs">
            {isReceivingData
              ? 'Real-time analysis with 3GPP standard parameters'
              : 'Start a test execution to see v2x analytics data'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default V2xAnalytics;
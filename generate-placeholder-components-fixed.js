const fs = require('fs');
const path = require('path');

// Define all the components to create
const components = [
  // Main views
  { path: 'views/LayerTraceView.tsx', name: 'LayerTraceView', icon: 'Network' },
  { path: 'views/CallFlowView.tsx', name: 'CallFlowView', icon: 'Phone' },
  { path: 'views/AnalyticsView.tsx', name: 'AnalyticsView', icon: 'BarChart3' },

  // O-RAN Analysis
  { path: 'views/oran/OranOverview.tsx', name: 'OranOverview', icon: 'Network' },
  { path: 'views/oran/InterfacesView.tsx', name: 'InterfacesView', icon: 'ChevronRight' },
  { path: 'views/oran/CuAnalysis.tsx', name: 'CuAnalysis', icon: 'Server' },
  { path: 'views/oran/DuAnalysis.tsx', name: 'DuAnalysis', icon: 'Database' },
  { path: 'views/oran/E1Interface.tsx', name: 'E1Interface', icon: 'ChevronRight' },
  { path: 'views/oran/F1Interface.tsx', name: 'F1Interface', icon: 'ChevronRight' },
  { path: 'views/oran/OranPerformance.tsx', name: 'OranPerformance', icon: 'BarChart3' },
  { path: 'views/oran/XAppsView.tsx', name: 'XAppsView', icon: 'Settings' },
  { path: 'views/oran/SmoAnalysis.tsx', name: 'SmoAnalysis', icon: 'Settings' },

  // NB-IoT Analysis
  { path: 'views/nbiot/NbiotOverview.tsx', name: 'NbiotOverview', icon: 'Wifi' },
  { path: 'views/nbiot/NbiotCallFlow.tsx', name: 'NbiotCallFlow', icon: 'Phone' },
  { path: 'views/nbiot/NbiotAnalytics.tsx', name: 'NbiotAnalytics', icon: 'BarChart3' },
  { path: 'views/nbiot/NbiotPhy.tsx', name: 'NbiotPhy', icon: 'Wifi' },
  { path: 'views/nbiot/NbiotMac.tsx', name: 'NbiotMac', icon: 'Network' },
  { path: 'views/nbiot/NbiotRrc.tsx', name: 'NbiotRrc', icon: 'Settings' },
  { path: 'views/nbiot/NbiotTesting.tsx', name: 'NbiotTesting', icon: 'CheckCircle' },

  // C-V2X Analysis
  { path: 'views/v2x/V2xOverview.tsx', name: 'V2xOverview', icon: 'Network' },
  { path: 'views/v2x/Pc5Sidelink.tsx', name: 'Pc5Sidelink', icon: 'Wifi' },
  { path: 'views/v2x/V2xAnalytics.tsx', name: 'V2xAnalytics', icon: 'BarChart3' },
  { path: 'views/v2x/V2xPhy.tsx', name: 'V2xPhy', icon: 'Wifi' },
  { path: 'views/v2x/V2xMac.tsx', name: 'V2xMac', icon: 'Network' },
  { path: 'views/v2x/V2xTesting.tsx', name: 'V2xTesting', icon: 'CheckCircle' },
  { path: 'views/v2x/TestScenarios.tsx', name: 'TestScenarios', icon: 'FileText' },

  // NTN Analysis
  { path: 'views/ntn/NtnOverview.tsx', name: 'NtnOverview', icon: 'Network' },
  { path: 'views/ntn/SatelliteLinks.tsx', name: 'SatelliteLinks', icon: 'Wifi' },
  { path: 'views/ntn/NtnAnalytics.tsx', name: 'NtnAnalytics', icon: 'BarChart3' },
  { path: 'views/ntn/Sib19Analysis.tsx', name: 'Sib19Analysis', icon: 'FileText' },
  { path: 'views/ntn/TimingDelay.tsx', name: 'TimingDelay', icon: 'Clock' },
  { path: 'views/ntn/DopplerAnalysis.tsx', name: 'DopplerAnalysis', icon: 'Activity' },
  { path: 'views/ntn/NtnScenarios.tsx', name: 'NtnScenarios', icon: 'FileText' },

  // Protocol Layers
  { path: 'views/protocol/MacLayerView.tsx', name: 'MacLayerView', icon: 'Network' },
  { path: 'views/protocol/RlcLayerView.tsx', name: 'RlcLayerView', icon: 'Layers' },
  { path: 'views/protocol/PdcpLayerView.tsx', name: 'PdcpLayerView', icon: 'FileText' },
  { path: 'views/protocol/RrcLayerView.tsx', name: 'RrcLayerView', icon: 'Network' },
  { path: 'views/protocol/NasLayerView.tsx', name: 'NasLayerView', icon: 'Server' },
  { path: 'views/protocol/ImsAnalysis.tsx', name: 'ImsAnalysis', icon: 'Phone' },

  // Core Network
  { path: 'views/core/SmfAnalyzer.tsx', name: 'SmfAnalyzer', icon: 'Server' },
  { path: 'views/core/UpfAnalyzer.tsx', name: 'UpfAnalyzer', icon: 'Network' },
  { path: 'views/core/AusfAnalyzer.tsx', name: 'AusfAnalyzer', icon: 'Shield' },
  { path: 'views/core/UdmAnalyzer.tsx', name: 'UdmAnalyzer', icon: 'Settings' },
  { path: 'views/core/ConfigManager.tsx', name: 'ConfigManager', icon: 'Settings' },

  // 4G Legacy
  { path: 'views/legacy/MmeAnalyzer.tsx', name: 'MmeAnalyzer', icon: 'Database' },
  { path: 'views/legacy/SgwAnalyzer.tsx', name: 'SgwAnalyzer', icon: 'Server' },
  { path: 'views/legacy/PgwAnalyzer.tsx', name: 'PgwAnalyzer', icon: 'Network' }
];

// Template for placeholder components
const componentTemplate = (name, icon) => {
  return `'use client';

import React, { useState, useEffect } from 'react';
import { ${icon}, Activity, Database, Wifi, Server, Phone, Shield, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';

interface ${name}Props {
  executionId?: string | null;
}

const ${name}: React.FC<${name}Props> = ({ executionId }) => {
  const [isReceivingData, setIsReceivingData] = useState(false);
  const [lastDataReceived, setLastDataReceived] = useState<Date | null>(null);

  useEffect(() => {
    const handleTestExecution = (event: any) => {
      if (event.type === '5GLABX_TEST_EXECUTION' && event.detail?.testCaseData) {
        console.log('🔥 ${name}: Received test execution event:', event.detail);
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
            <${icon} className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">${name.replace(/([A-Z])/g, ' $1').trim()}</h2>
            <span className={\`px-2 py-1 rounded text-xs font-medium \${
              isReceivingData ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }\`}>
              {isReceivingData ? 'Live Data' : 'Waiting'}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <div className={\`flex items-center space-x-2 \${isReceivingData ? 'text-green-600' : 'text-gray-400'}\`}>
              <div className={\`w-3 h-3 rounded-full \${isReceivingData ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}\`}></div>
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
          <div className={\`w-12 h-12 rounded-full \${isReceivingData ? 'bg-green-100 animate-pulse' : 'bg-gray-100'} flex items-center justify-center mb-4 mx-auto\`}>
            {isReceivingData ? (
              <div className="w-6 h-6 bg-green-500 rounded-full animate-bounce"></div>
            ) : (
              <${icon} className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <p className="text-gray-500 text-sm mb-2">
            {isReceivingData ? '🎯 ${name.replace(/([A-Z])/g, ' $1').trim()} - 3GPP standard parameters...' : '📭 No ${name.replace(/([A-Z])/g, ' $1').trim().toLowerCase()} data available'}
          </p>
          <p className="text-gray-400 text-xs">
            {isReceivingData
              ? 'Real-time analysis with 3GPP standard parameters'
              : 'Start a test execution to see ${name.replace(/([A-Z])/g, ' $1').trim().toLowerCase()} data'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ${name};`;
};

// Create directories and files
const baseDir = '/workspace/components/5glabx/New5GLabX_1';

components.forEach(component => {
  const fullPath = path.join(baseDir, component.path);
  const dir = path.dirname(fullPath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Create component file
  const content = componentTemplate(component.name, component.icon);
  fs.writeFileSync(fullPath, content);
  console.log(`Created: ${component.path}`);
});

console.log('All placeholder components created successfully!');
const fs = require('fs');
const path = require('path');

// Define all the UE components to create
const components = [
  // Main UE views
  { path: 'views/UEEnhancedLogs.tsx', name: 'UEEnhancedLogs', icon: 'Search' },
  { path: 'views/UELayerTraceView.tsx', name: 'UELayerTraceView', icon: 'Network' },
  { path: 'views/UECallFlowView.tsx', name: 'UECallFlowView', icon: 'Phone' },
  { path: 'views/UEAnalyticsView.tsx', name: 'UEAnalyticsView', icon: 'BarChart3' },

  // UE Protocol Layers
  { path: 'views/protocol/UEApplicationLayer.tsx', name: 'UEApplicationLayer', icon: 'Smartphone' },
  { path: 'views/protocol/UEIMSLayer.tsx', name: 'UEIMSLayer', icon: 'Phone' },
  { path: 'views/protocol/UENASLayer.tsx', name: 'UENASLayer', icon: 'Server' },
  { path: 'views/protocol/UERRCLayer.tsx', name: 'UERRCLayer', icon: 'Network' },
  { path: 'views/protocol/UEPDCPLayer.tsx', name: 'UEPDCPLayer', icon: 'FileText' },
  { path: 'views/protocol/UERLCLayer.tsx', name: 'UERLCLayer', icon: 'Layers' },
  { path: 'views/protocol/UEMACLayer.tsx', name: 'UEMACLayer', icon: 'Network' },

  // UE Performance Views
  { path: 'views/performance/UEPerformanceAnalysis.tsx', name: 'UEPerformanceAnalysis', icon: 'BarChart3' },
  { path: 'views/performance/UEMobilityAnalysis.tsx', name: 'UEMobilityAnalysis', icon: 'Globe' },
  { path: 'views/security/UESecurityAnalysis.tsx', name: 'UESecurityAnalysis', icon: 'Shield' },
  { path: 'views/performance/UECallFlowAnalysis.tsx', name: 'UECallFlowAnalysis', icon: 'Phone' },

  // UE Technology Views
  { path: 'views/technology/UE5GNR.tsx', name: 'UE5GNR', icon: 'Wifi' },
  { path: 'views/technology/UE4GLTE.tsx', name: 'UE4GLTE', icon: 'Network' },
  { path: 'views/technology/UEOran.tsx', name: 'UEOran', icon: 'Server' },
  { path: 'views/technology/UENbiot.tsx', name: 'UENbiot', icon: 'Wifi' },
  { path: 'views/technology/UEV2x.tsx', name: 'UEV2x', icon: 'Car' },
  { path: 'views/technology/UENTN.tsx', name: 'UENTN', icon: 'Satellite' },

  // UE Device Views
  { path: 'views/device/UEDeviceInfo.tsx', name: 'UEDeviceInfo', icon: 'Smartphone' },
  { path: 'views/device/UECapabilities.tsx', name: 'UECapabilities', icon: 'Settings' },
  { path: 'views/device/UEStatus.tsx', name: 'UEStatus', icon: 'Activity' },
  { path: 'views/device/UELocation.tsx', name: 'UELocation', icon: 'MapPin' }
];

// Simple template for UE components
const createUEComponent = (name, icon) => {
  // Create a unique set of icons to avoid duplicates
  const allIcons = [icon, 'Activity', 'Database', 'Wifi', 'Server', 'Phone', 'Shield', 'AlertTriangle', 'CheckCircle', 'Clock', 'XCircle', 'Smartphone', 'Signal', 'Battery', 'MapPin'];
  const uniqueIcons = [...new Set(allIcons)];
  const iconImports = uniqueIcons.join(', ');
  
  return `'use client';

import React, { useState, useEffect } from 'react';
import { ${iconImports} } from 'lucide-react';

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
            {isReceivingData ? '🎯 ${name.replace(/([A-Z])/g, ' $1').trim()} - 3GPP UE standard parameters...' : '📭 No ${name.replace(/([A-Z])/g, ' $1').trim().toLowerCase()} data available'}
          </p>
          <p className="text-gray-400 text-xs">
            {isReceivingData
              ? 'Real-time UE analysis with 3GPP standard parameters'
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
const baseDir = '/workspace/components/ue-analysis/NewUEAnalysis_1';

components.forEach(component => {
  const fullPath = path.join(baseDir, component.path);
  const dir = path.dirname(fullPath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Create component file
  const content = createUEComponent(component.name, component.icon);
  fs.writeFileSync(fullPath, content);
  console.log(`Created: ${component.path}`);
});

console.log('All UE placeholder components created successfully!');
'use client';

import React, { useEffect } from 'react';

/**
 * DirectDataInjector - Directly injects Test Manager data into 5GLabX views
 * Bypasses complex service loading and ensures data reaches all views
 */
const DirectDataInjector: React.FC = () => {
  useEffect(() => {
    console.log('🔗 DirectDataInjector: Initializing direct data injection...');

    const handleTestManagerData = (event: MessageEvent) => {
      if (event.data && event.data.type === '5GLABX_TEST_EXECUTION') {
        console.log('🔗 DirectDataInjector: Received test data:', event.data.testCaseId);
        const { testCaseData, testCaseId } = event.data;
        
        if (testCaseData && testCaseData.expectedMessages) {
          console.log(`🔗 DirectDataInjector: Processing ${testCaseData.expectedMessages.length} messages for direct injection`);
          
          // Direct injection to all possible 5GLabX components
          testCaseData.expectedMessages.forEach((message: any, index: number) => {
            setTimeout(() => {
              const logEntry = {
                id: Date.now() + index,
                timestamp: (Date.now() / 1000 + index * 0.5).toFixed(1),
                level: 'I',
                component: message.layer,
                layer: message.layer,
                protocol: message.protocol,
                messageType: message.messageType,
                messageName: message.messageName,
                message: `${message.messageName}: ${JSON.stringify(message.messagePayload || {})}`,
                direction: message.direction,
                source: 'TestManager',
                testCaseId: testCaseId,
                payload: message.messagePayload,
                ies: testCaseData.expectedInformationElements || [],
                layerParams: testCaseData.expectedLayerParameters || []
              };

              // Try to find and update React components directly
              try {
                // Find LogsView component and update its state
                const logsViewElements = document.querySelectorAll('[data-component="LogsView"]');
                if (logsViewElements.length > 0) {
                  console.log('🔗 Found LogsView element, injecting data...');
                  // Trigger React state update via DOM event
                  logsViewElements[0].dispatchEvent(new CustomEvent('dataUpdate', {
                    detail: logEntry
                  }));
                }

                // Find EnhancedLogsView component
                const enhancedLogsElements = document.querySelectorAll('[data-component="EnhancedLogsView"]');
                if (enhancedLogsElements.length > 0) {
                  console.log('🔗 Found EnhancedLogsView element, injecting data...');
                  enhancedLogsElements[0].dispatchEvent(new CustomEvent('dataUpdate', {
                    detail: logEntry
                  }));
                }

                // Find layer-specific components
                const layerElements = document.querySelectorAll(`[data-layer="${message.layer}"]`);
                layerElements.forEach(element => {
                  console.log(`🔗 Found ${message.layer} layer element, injecting data...`);
                  element.dispatchEvent(new CustomEvent('layerDataUpdate', {
                    detail: logEntry
                  }));
                });

              } catch (domError) {
                console.warn('DOM injection failed:', domError);
              }

              // Also try global window events (existing approach)
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('5glabxDirectDataInjection', {
                  detail: {
                    type: 'LOG_ENTRY',
                    data: logEntry,
                    testCaseId: testCaseId,
                    messageIndex: index,
                    totalMessages: testCaseData.expectedMessages.length
                  }
                }));
              }

              console.log(`🔗 DirectDataInjector: Injected message ${index + 1}/${testCaseData.expectedMessages.length} - ${message.messageName}`);
            }, index * 500);
          });
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('message', handleTestManagerData);
      console.log('✅ DirectDataInjector: Event listener registered');
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('message', handleTestManagerData);
      }
    };
  }, []);

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-green-700 text-sm font-medium">Direct Data Injector Active</span>
      </div>
      <div className="text-green-600 text-xs mt-1">
        Monitoring for Test Manager data and injecting directly into 5GLabX views
      </div>
    </div>
  );
};

export default DirectDataInjector;
'use client';

import React, { useEffect } from 'react';

/**
 * Event Bridge Service - Bridges Test Manager events to 5GLabX Platform
 * Fixes the event dispatch mismatch between Test Manager and Log Views
 */
export const EventBridge: React.FC = () => {
  useEffect(() => {
    console.log('🔗 EventBridge: Initializing event bridge service...');

    // Bridge testCaseExecutionStarted to immediate-logs-update
    const handleTestCaseExecutionStarted = (event: CustomEvent) => {
      console.log('🔗 EventBridge: Received testCaseExecutionStarted event:', event.detail);
      
      const { testCaseId, testCaseData, executionId } = event.detail;
      
      if (testCaseData && testCaseData.expectedMessages) {
        console.log(`🔗 EventBridge: Converting ${testCaseData.expectedMessages.length} messages to logs format`);
        
        // Convert expectedMessages to logs format
        const logs = testCaseData.expectedMessages.map((message: any, index: number) => ({
          id: `bridge-${testCaseId}-${index}-${Date.now()}`,
          timestamp: (Date.now() / 1000).toFixed(1),
          level: 'I',
          component: message.layer || 'RRC',
          message: `${message.messageName || message.messageType}: ${JSON.stringify(message.messagePayload || {})}`,
          type: message.messageType || 'TEST_MESSAGE',
          source: 'TestManager',
          testCaseId: testCaseId,
          executionId: executionId,
          direction: message.direction || 'UL',
          protocol: message.protocol || '5G_NR',
          rawData: JSON.stringify(message.messagePayload || {}, null, 2),
          informationElements: message.informationElements || {},
          layerParameters: message.layerParameters || {},
          standardReference: message.standardReference || 'Unknown',
          messagePayload: message.messagePayload || {},
          ies: message.informationElements ?
            Object.entries(message.informationElements).map(([k, v]: [string, any]) =>
              `${k}=${typeof v === 'object' ? v.value || JSON.stringify(v) : v}`
            ).join(', ') :
            Object.entries(message.messagePayload || {}).map(([k, v]) => `${k}=${v}`).join(', ')
        }));

        // Dispatch immediate-logs-update event
        const immediateLogsEvent = new CustomEvent('immediate-logs-update', {
          detail: {
            logs: logs,
            source: 'EventBridge',
            testCaseId: testCaseId,
            executionId: executionId,
            originalEvent: 'testCaseExecutionStarted'
          }
        });
        
        window.dispatchEvent(immediateLogsEvent);
        console.log(`🔗 EventBridge: Dispatched immediate-logs-update with ${logs.length} logs`);
        
        // Also dispatch enhanced logs update
        const enhancedLogsEvent = new CustomEvent('enhancedLogsUpdate', {
          detail: logs.map(log => ({
            id: log.id,
            timestamp: log.timestamp + '.123',
            direction: log.direction,
            layer: log.component,
            channel: log.type,
            sfn: Math.floor(Math.random() * 1024).toString(),
            messageType: log.type,
            rnti: 'C-RNTI',
            message: log.message,
            rawData: log.rawData.substring(0, 20),
            ies: log.ies,
            source: 'EventBridge'
          }))
        });
        
        window.dispatchEvent(enhancedLogsEvent);
        console.log(`🔗 EventBridge: Dispatched enhancedLogsUpdate with ${logs.length} enhanced logs`);
        
        // Dispatch layer-specific events
        const layers = ['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS', 'IMS'];
        layers.forEach(layer => {
          const layerLogs = logs.filter(log => log.component === layer);
          if (layerLogs.length > 0) {
            const layerEvent = new CustomEvent(`${layer.toLowerCase()}layerupdate`, {
              detail: layerLogs
            });
            window.dispatchEvent(layerEvent);
            console.log(`🔗 EventBridge: Dispatched ${layer} layer update with ${layerLogs.length} logs`);
          }
        });
        
        // Dispatch call flow update
        const callFlowEvent = new CustomEvent('callFlowUpdate', {
          detail: logs
        });
        window.dispatchEvent(callFlowEvent);
        console.log(`🔗 EventBridge: Dispatched callFlowUpdate with ${logs.length} logs`);
        
        // Dispatch layer trace update
        const layerTraceEvent = new CustomEvent('layerTraceUpdate', {
          detail: logs
        });
        window.dispatchEvent(layerTraceEvent);
        console.log(`🔗 EventBridge: Dispatched layerTraceUpdate with ${logs.length} logs`);
        
      } else {
        console.warn('🔗 EventBridge: No expectedMessages found in testCaseData');
      }
    };

    // Bridge 5GLABX_TEST_EXECUTION postMessage to immediate-logs-update
    const handlePostMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === '5GLABX_TEST_EXECUTION') {
        console.log('🔗 EventBridge: Received 5GLABX_TEST_EXECUTION postMessage:', event.data);
        
        const { testCaseId, testCaseData, executionId } = event.data;
        
        if (testCaseData && testCaseData.expectedMessages) {
          console.log(`🔗 EventBridge: Converting postMessage ${testCaseData.expectedMessages.length} messages to logs format`);
          
          // Convert expectedMessages to logs format
          const logs = testCaseData.expectedMessages.map((message: any, index: number) => ({
            id: `bridge-post-${testCaseId}-${index}-${Date.now()}`,
            timestamp: (Date.now() / 1000).toFixed(1),
            level: 'I',
            component: message.layer || 'RRC',
            message: `${message.messageName || message.messageType}: ${JSON.stringify(message.messagePayload || {})}`,
            type: message.messageType || 'TEST_MESSAGE',
            source: 'PostMessage',
            testCaseId: testCaseId,
            executionId: executionId,
            direction: message.direction || 'UL',
            protocol: message.protocol || '5G_NR',
            rawData: JSON.stringify(message.messagePayload || {}, null, 2),
            informationElements: message.informationElements || {},
            layerParameters: message.layerParameters || {},
            standardReference: message.standardReference || 'Unknown',
            messagePayload: message.messagePayload || {},
            ies: message.informationElements ?
              Object.entries(message.informationElements).map(([k, v]: [string, any]) =>
                `${k}=${typeof v === 'object' ? v.value || JSON.stringify(v) : v}`
              ).join(', ') :
              Object.entries(message.messagePayload || {}).map(([k, v]) => `${k}=${v}`).join(', ')
          }));

          // Dispatch immediate-logs-update event
          const immediateLogsEvent = new CustomEvent('immediate-logs-update', {
            detail: {
              logs: logs,
              source: 'EventBridge-PostMessage',
              testCaseId: testCaseId,
              executionId: executionId,
              originalEvent: '5GLABX_TEST_EXECUTION'
            }
          });
          
          window.dispatchEvent(immediateLogsEvent);
          console.log(`🔗 EventBridge: Dispatched immediate-logs-update from postMessage with ${logs.length} logs`);
        }
      }
    };

    // Register event listeners
    if (typeof window !== 'undefined') {
      window.addEventListener('testCaseExecutionStarted', handleTestCaseExecutionStarted as EventListener);
      window.addEventListener('message', handlePostMessage);
      
      console.log('✅ EventBridge: Event listeners registered');
      
      return () => {
        window.removeEventListener('testCaseExecutionStarted', handleTestCaseExecutionStarted as EventListener);
        window.removeEventListener('message', handlePostMessage);
        console.log('🔗 EventBridge: Event listeners cleaned up');
      };
    }
  }, []);

  // This component doesn't render anything, it's just a service
  return null;
};

export default EventBridge;
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, TrendingUp, TrendingDown, BarChart3, 
  Radio, Signal, Zap, Monitor, Eye, RefreshCw,
  Antenna, Waves, Target, Grid
} from 'lucide-react';

interface ChannelParameter {
  name: string;
  value: number | string;
  unit?: string;
  range?: string;
  reference?: string;
  channel: string;
  direction: 'DL' | 'UL' | 'BOTH';
  timestamp: number;
  trend?: 'up' | 'down' | 'stable';
  previousValue?: number | string;
  quality?: 'good' | 'fair' | 'poor';
}

interface ChannelParameterHistory {
  [parameterName: string]: ChannelParameter[];
}

const ChannelParametersTracker: React.FC<{
  testCaseData?: any;
}> = ({ testCaseData }) => {
  const [channelParameters, setChannelParameters] = useState<Record<string, ChannelParameter>>({});
  const [parameterHistory, setParameterHistory] = useState<ChannelParameterHistory>({});
  const [selectedChannel, setSelectedChannel] = useState<string>('ALL');
  const [selectedDirection, setSelectedDirection] = useState<string>('ALL');
  const [isLiveTracking, setIsLiveTracking] = useState(false);

  // Initialize with comprehensive channel parameters
  useEffect(() => {
    const initializeChannelParameters = () => {
      const initialParams: Record<string, ChannelParameter> = {
        // PSS (Primary Synchronization Signal) - 5G/LTE
        'PSS-Power': {
          name: 'PSS-Power',
          value: 43.2,
          unit: 'dBm',
          range: '(30, 50)',
          reference: 'TS 38.211 7.4.2.2 / TS 36.211 6.11.1',
          channel: 'PSS',
          direction: 'DL',
          timestamp: Date.now(),
          trend: 'stable',
          quality: 'good'
        },
        'PSS-RSRP': {
          name: 'PSS-RSRP',
          value: -85.5,
          unit: 'dBm',
          range: '(-156, -31)',
          reference: 'TS 38.215 5.1.1',
          channel: 'PSS',
          direction: 'DL',
          timestamp: Date.now(),
          trend: 'stable',
          quality: 'good'
        },
        'PSS-Correlation': {
          name: 'PSS-Correlation',
          value: 0.92,
          range: '(0, 1)',
          reference: 'TS 38.211 7.4.2.2',
          channel: 'PSS',
          direction: 'DL',
          timestamp: Date.now(),
          trend: 'stable',
          quality: 'good'
        },

        // SSS (Secondary Synchronization Signal) - 5G/LTE
        'SSS-Power': {
          name: 'SSS-Power',
          value: 43.0,
          unit: 'dBm',
          range: '(30, 50)',
          reference: 'TS 38.211 7.4.2.3 / TS 36.211 6.11.2',
          channel: 'SSS',
          direction: 'DL',
          timestamp: Date.now(),
          trend: 'stable',
          quality: 'good'
        },
        'SSS-RSRP': {
          name: 'SSS-RSRP',
          value: -86.2,
          unit: 'dBm',
          range: '(-156, -31)',
          reference: 'TS 38.215 5.1.1',
          channel: 'SSS',
          direction: 'DL',
          timestamp: Date.now(),
          trend: 'stable',
          quality: 'good'
        },
        'SSS-Sequence-ID': {
          name: 'SSS-Sequence-ID',
          value: 168,
          range: '(0, 335)',
          reference: 'TS 38.211 7.4.2.3',
          channel: 'SSS',
          direction: 'DL',
          timestamp: Date.now(),
          trend: 'stable',
          quality: 'good'
        },

        // DMRS (Demodulation Reference Signal) - 5G/LTE
        'DMRS-Power': {
          name: 'DMRS-Power',
          value: 40.5,
          unit: 'dBm',
          range: '(20, 50)',
          reference: 'TS 38.211 7.4.1.1 / TS 36.211 6.10.3',
          channel: 'DMRS',
          direction: 'BOTH',
          timestamp: Date.now(),
          trend: 'stable',
          quality: 'good'
        },
        'DMRS-RSRP': {
          name: 'DMRS-RSRP',
          value: -82.8,
          unit: 'dBm',
          range: '(-156, -31)',
          reference: 'TS 38.215 5.1.1',
          channel: 'DMRS',
          direction: 'BOTH',
          timestamp: Date.now(),
          trend: 'up',
          quality: 'good'
        },
        'DMRS-Port-Count': {
          name: 'DMRS-Port-Count',
          value: 2,
          range: '(1, 8)',
          reference: 'TS 38.211 7.4.1.1',
          channel: 'DMRS',
          direction: 'BOTH',
          timestamp: Date.now(),
          trend: 'stable',
          quality: 'good'
        },

        // PBCH (Physical Broadcast Channel) - 5G/LTE
        'PBCH-Power': {
          name: 'PBCH-Power',
          value: 42.8,
          unit: 'dBm',
          range: '(30, 50)',
          reference: 'TS 38.211 7.3.3 / TS 36.211 6.6',
          channel: 'PBCH',
          direction: 'DL',
          timestamp: Date.now(),
          trend: 'stable',
          quality: 'good'
        },
        'PBCH-BLER': {
          name: 'PBCH-BLER',
          value: 0.02,
          unit: '%',
          range: '(0, 10)',
          reference: 'TS 38.211 7.3.3',
          channel: 'PBCH',
          direction: 'DL',
          timestamp: Date.now(),
          trend: 'down',
          quality: 'good'
        },
        'PBCH-SNR': {
          name: 'PBCH-SNR',
          value: 18.5,
          unit: 'dB',
          range: '(-10, 40)',
          reference: 'TS 38.215',
          channel: 'PBCH',
          direction: 'DL',
          timestamp: Date.now(),
          trend: 'up',
          quality: 'good'
        },

        // PHICH (Physical HARQ Indicator Channel) - LTE Only
        'PHICH-Power': {
          name: 'PHICH-Power',
          value: 38.2,
          unit: 'dBm',
          range: '(20, 50)',
          reference: 'TS 36.211 6.9',
          channel: 'PHICH',
          direction: 'DL',
          timestamp: Date.now(),
          trend: 'stable',
          quality: 'good'
        },
        'PHICH-ACK-Rate': {
          name: 'PHICH-ACK-Rate',
          value: 95.8,
          unit: '%',
          range: '(80, 100)',
          reference: 'TS 36.211 6.9',
          channel: 'PHICH',
          direction: 'DL',
          timestamp: Date.now(),
          trend: 'up',
          quality: 'good'
        },

        // PCFICH (Physical Control Format Indicator Channel) - LTE Only
        'PCFICH-Power': {
          name: 'PCFICH-Power',
          value: 39.5,
          unit: 'dBm',
          range: '(20, 50)',
          reference: 'TS 36.211 6.7',
          channel: 'PCFICH',
          direction: 'DL',
          timestamp: Date.now(),
          trend: 'stable',
          quality: 'good'
        },
        'PCFICH-CFI': {
          name: 'PCFICH-CFI',
          value: 2,
          range: '(1, 4)',
          reference: 'TS 36.211 6.7',
          channel: 'PCFICH',
          direction: 'DL',
          timestamp: Date.now(),
          trend: 'stable',
          quality: 'good'
        },

        // PDCCH (Physical Downlink Control Channel) - 5G/LTE
        'PDCCH-Power': {
          name: 'PDCCH-Power',
          value: 41.2,
          unit: 'dBm',
          range: '(20, 50)',
          reference: 'TS 38.211 7.3.2 / TS 36.211 6.8',
          channel: 'PDCCH',
          direction: 'DL',
          timestamp: Date.now(),
          trend: 'stable',
          quality: 'good'
        },
        'PDCCH-BLER': {
          name: 'PDCCH-BLER',
          value: 1.2,
          unit: '%',
          range: '(0, 10)',
          reference: 'TS 38.211 7.3.2',
          channel: 'PDCCH',
          direction: 'DL',
          timestamp: Date.now(),
          trend: 'down',
          quality: 'good'
        },
        'PDCCH-Aggregation-Level': {
          name: 'PDCCH-Aggregation-Level',
          value: 4,
          range: '(1, 16)',
          reference: 'TS 38.211 7.3.2',
          channel: 'PDCCH',
          direction: 'DL',
          timestamp: Date.now(),
          trend: 'stable',
          quality: 'good'
        },

        // PDSCH (Physical Downlink Shared Channel) - 5G/LTE
        'PDSCH-Power': {
          name: 'PDSCH-Power',
          value: 38.8,
          unit: 'dBm',
          range: '(10, 50)',
          reference: 'TS 38.211 7.3.1 / TS 36.211 6.3',
          channel: 'PDSCH',
          direction: 'DL',
          timestamp: Date.now(),
          trend: 'up',
          quality: 'good'
        },
        'PDSCH-Throughput': {
          name: 'PDSCH-Throughput',
          value: 85.6,
          unit: 'Mbps',
          range: '(0, 1000)',
          reference: 'TS 38.214',
          channel: 'PDSCH',
          direction: 'DL',
          timestamp: Date.now(),
          trend: 'up',
          quality: 'good'
        },
        'PDSCH-MCS': {
          name: 'PDSCH-MCS',
          value: 16,
          range: '(0, 31)',
          reference: 'TS 38.214 5.1.3',
          channel: 'PDSCH',
          direction: 'DL',
          timestamp: Date.now(),
          trend: 'stable',
          quality: 'good'
        },
        'PDSCH-BLER': {
          name: 'PDSCH-BLER',
          value: 2.8,
          unit: '%',
          range: '(0, 10)',
          reference: 'TS 38.214',
          channel: 'PDSCH',
          direction: 'DL',
          timestamp: Date.now(),
          trend: 'down',
          quality: 'good'
        },

        // PRACH (Physical Random Access Channel) - 5G/LTE
        'PRACH-Power': {
          name: 'PRACH-Power',
          value: 23.5,
          unit: 'dBm',
          range: '(-50, 33)',
          reference: 'TS 38.213 7.3 / TS 36.213 5.1.1',
          channel: 'PRACH',
          direction: 'UL',
          timestamp: Date.now(),
          trend: 'stable',
          quality: 'good'
        },
        'PRACH-Detection-Rate': {
          name: 'PRACH-Detection-Rate',
          value: 98.5,
          unit: '%',
          range: '(80, 100)',
          reference: 'TS 38.211 6.3.3',
          channel: 'PRACH',
          direction: 'UL',
          timestamp: Date.now(),
          trend: 'up',
          quality: 'good'
        },
        'PRACH-Preamble-Index': {
          name: 'PRACH-Preamble-Index',
          value: 23,
          range: '(0, 63)',
          reference: 'TS 38.211 6.3.3.1',
          channel: 'PRACH',
          direction: 'UL',
          timestamp: Date.now(),
          trend: 'stable',
          quality: 'good'
        },

        // PUCCH (Physical Uplink Control Channel) - 5G/LTE
        'PUCCH-Power': {
          name: 'PUCCH-Power',
          value: 10.2,
          unit: 'dBm',
          range: '(-40, 23)',
          reference: 'TS 38.213 7.2 / TS 36.213 5.1.2',
          channel: 'PUCCH',
          direction: 'UL',
          timestamp: Date.now(),
          trend: 'stable',
          quality: 'good'
        },
        'PUCCH-Format': {
          name: 'PUCCH-Format',
          value: 1,
          range: '(0, 4)',
          reference: 'TS 38.211 6.3.2',
          channel: 'PUCCH',
          direction: 'UL',
          timestamp: Date.now(),
          trend: 'stable',
          quality: 'good'
        },
        'PUCCH-BLER': {
          name: 'PUCCH-BLER',
          value: 1.5,
          unit: '%',
          range: '(0, 10)',
          reference: 'TS 38.213',
          channel: 'PUCCH',
          direction: 'UL',
          timestamp: Date.now(),
          trend: 'down',
          quality: 'good'
        },

        // PUSCH (Physical Uplink Shared Channel) - 5G/LTE
        'PUSCH-Power': {
          name: 'PUSCH-Power',
          value: 15.8,
          unit: 'dBm',
          range: '(-40, 23)',
          reference: 'TS 38.213 7.1 / TS 36.213 5.1.1',
          channel: 'PUSCH',
          direction: 'UL',
          timestamp: Date.now(),
          trend: 'up',
          quality: 'good'
        },
        'PUSCH-Throughput': {
          name: 'PUSCH-Throughput',
          value: 42.3,
          unit: 'Mbps',
          range: '(0, 500)',
          reference: 'TS 38.214',
          channel: 'PUSCH',
          direction: 'UL',
          timestamp: Date.now(),
          trend: 'up',
          quality: 'good'
        },
        'PUSCH-MCS': {
          name: 'PUSCH-MCS',
          value: 12,
          range: '(0, 31)',
          reference: 'TS 38.214 6.1.4',
          channel: 'PUSCH',
          direction: 'UL',
          timestamp: Date.now(),
          trend: 'stable',
          quality: 'good'
        },
        'PUSCH-BLER': {
          name: 'PUSCH-BLER',
          value: 3.2,
          unit: '%',
          range: '(0, 10)',
          reference: 'TS 38.214',
          channel: 'PUSCH',
          direction: 'UL',
          timestamp: Date.now(),
          trend: 'down',
          quality: 'good'
        },

        // DL-SCH (Downlink Shared Channel) - 5G/LTE
        'DLSCH-Throughput': {
          name: 'DLSCH-Throughput',
          value: 88.2,
          unit: 'Mbps',
          range: '(0, 1000)',
          reference: 'TS 38.212 / TS 36.212',
          channel: 'DL-SCH',
          direction: 'DL',
          timestamp: Date.now(),
          trend: 'up',
          quality: 'good'
        },
        'DLSCH-HARQ-ACK-Rate': {
          name: 'DLSCH-HARQ-ACK-Rate',
          value: 96.8,
          unit: '%',
          range: '(80, 100)',
          reference: 'TS 38.321 5.4.2',
          channel: 'DL-SCH',
          direction: 'DL',
          timestamp: Date.now(),
          trend: 'up',
          quality: 'good'
        },

        // UL-SCH (Uplink Shared Channel) - 5G/LTE
        'ULSCH-Throughput': {
          name: 'ULSCH-Throughput',
          value: 44.5,
          unit: 'Mbps',
          range: '(0, 500)',
          reference: 'TS 38.212 / TS 36.212',
          channel: 'UL-SCH',
          direction: 'UL',
          timestamp: Date.now(),
          trend: 'up',
          quality: 'good'
        },
        'ULSCH-HARQ-ACK-Rate': {
          name: 'ULSCH-HARQ-ACK-Rate',
          value: 94.2,
          unit: '%',
          range: '(80, 100)',
          reference: 'TS 38.321 5.4.2',
          channel: 'UL-SCH',
          direction: 'UL',
          timestamp: Date.now(),
          trend: 'stable',
          quality: 'good'
        },

        // PCH (Paging Channel) - 5G/LTE
        'PCH-Power': {
          name: 'PCH-Power',
          value: 40.2,
          unit: 'dBm',
          range: '(20, 50)',
          reference: 'TS 38.211 / TS 36.211',
          channel: 'PCH',
          direction: 'DL',
          timestamp: Date.now(),
          trend: 'stable',
          quality: 'good'
        },
        'PCH-Paging-Rate': {
          name: 'PCH-Paging-Rate',
          value: 12.5,
          unit: 'pages/sec',
          range: '(0, 100)',
          reference: 'TS 38.331',
          channel: 'PCH',
          direction: 'DL',
          timestamp: Date.now(),
          trend: 'stable',
          quality: 'good'
        },

        // BCH (Broadcast Channel) - 5G/LTE
        'BCH-Power': {
          name: 'BCH-Power',
          value: 43.5,
          unit: 'dBm',
          range: '(30, 50)',
          reference: 'TS 38.211 / TS 36.211',
          channel: 'BCH',
          direction: 'DL',
          timestamp: Date.now(),
          trend: 'stable',
          quality: 'good'
        },
        'BCH-Block-Error-Rate': {
          name: 'BCH-Block-Error-Rate',
          value: 0.8,
          unit: '%',
          range: '(0, 5)',
          reference: 'TS 38.211',
          channel: 'BCH',
          direction: 'DL',
          timestamp: Date.now(),
          trend: 'down',
          quality: 'good'
        }
      };
      
      setChannelParameters(initialParams);
      
      // Initialize history
      const history: ChannelParameterHistory = {};
      Object.values(initialParams).forEach(param => {
        history[param.name] = [param];
      });
      setParameterHistory(history);
    };

    initializeChannelParameters();
  }, []);

  // Listen for test case data and update channel parameters
  useEffect(() => {
    const handleTestCaseData = (event: MessageEvent) => {
      if (event.data && event.data.type === '5GLABX_TEST_EXECUTION') {
        console.log('📡 Channel Parameters Tracker: Received test data:', event.data.testCaseId);
        setIsLiveTracking(true);
        
        const { testCaseData } = event.data;
        
        if (testCaseData && testCaseData.expectedMessages) {
          // Process each message for channel parameter updates
          testCaseData.expectedMessages.forEach((message: any, index: number) => {
            setTimeout(() => {
              updateChannelParameters(message, index);
            }, index * 1500); // Update every 1.5 seconds
          });
        }
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('message', handleTestCaseData);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('message', handleTestCaseData);
      }
    };
  }, []);

  const updateChannelParameters = (message: any, messageIndex: number) => {
    const timestamp = Date.now() + messageIndex * 1500;
    
    // Generate realistic channel parameter variations based on message type and test scenario
    const parameterUpdates: Record<string, Partial<ChannelParameter>> = {};
    
    // PSS/SSS variations (sync signals)
    if (message.messageType?.includes('Sync') || message.layer === 'PHY') {
      parameterUpdates['PSS-RSRP'] = {
        value: -85.5 + (Math.random() - 0.5) * 8, // ±4 dBm
        timestamp,
        trend: Math.random() > 0.5 ? 'up' : 'down',
        quality: Math.random() > 0.8 ? 'fair' : 'good'
      };
      
      parameterUpdates['SSS-RSRP'] = {
        value: -86.2 + (Math.random() - 0.5) * 8, // ±4 dBm
        timestamp,
        trend: Math.random() > 0.5 ? 'up' : 'down'
      };
      
      parameterUpdates['PSS-Correlation'] = {
        value: 0.92 + (Math.random() - 0.5) * 0.1, // ±0.05
        timestamp,
        trend: Math.random() > 0.5 ? 'up' : 'down'
      };
    }
    
    // PDSCH/PUSCH variations (data channels)
    if (message.messageType?.includes('Data') || message.messageType?.includes('PDU')) {
      parameterUpdates['PDSCH-Throughput'] = {
        value: 85.6 + (Math.random() - 0.5) * 30, // ±15 Mbps
        timestamp,
        trend: Math.random() > 0.5 ? 'up' : 'down'
      };
      
      parameterUpdates['PUSCH-Throughput'] = {
        value: 42.3 + (Math.random() - 0.5) * 20, // ±10 Mbps
        timestamp,
        trend: Math.random() > 0.5 ? 'up' : 'down'
      };
      
      parameterUpdates['PDSCH-MCS'] = {
        value: Math.floor(12 + Math.random() * 12), // 12-24
        timestamp,
        trend: 'stable'
      };
      
      parameterUpdates['PUSCH-MCS'] = {
        value: Math.floor(8 + Math.random() * 12), // 8-20
        timestamp,
        trend: 'stable'
      };
      
      parameterUpdates['PDSCH-BLER'] = {
        value: 2.8 + (Math.random() - 0.5) * 2, // ±1%
        timestamp,
        trend: Math.random() > 0.7 ? 'down' : 'stable'
      };
    }
    
    // PRACH variations (random access)
    if (message.messageType?.includes('PRACH') || message.messageType?.includes('RandomAccess')) {
      parameterUpdates['PRACH-Power'] = {
        value: 23.5 + (Math.random() - 0.5) * 6, // ±3 dBm
        timestamp,
        trend: Math.random() > 0.5 ? 'up' : 'down'
      };
      
      parameterUpdates['PRACH-Detection-Rate'] = {
        value: 98.5 + (Math.random() - 0.5) * 3, // ±1.5%
        timestamp,
        trend: Math.random() > 0.8 ? 'up' : 'stable'
      };
      
      parameterUpdates['PRACH-Preamble-Index'] = {
        value: Math.floor(Math.random() * 64), // 0-63
        timestamp,
        trend: 'stable'
      };
    }
    
    // PDCCH variations (control channel)
    if (message.messageType?.includes('Control') || message.messageType?.includes('DCI')) {
      parameterUpdates['PDCCH-BLER'] = {
        value: 1.2 + (Math.random() - 0.5) * 1.5, // ±0.75%
        timestamp,
        trend: Math.random() > 0.6 ? 'down' : 'stable'
      };
      
      parameterUpdates['PDCCH-Aggregation-Level'] = {
        value: Math.pow(2, Math.floor(Math.random() * 4)), // 1, 2, 4, 8
        timestamp,
        trend: 'stable'
      };
    }
    
    // PUCCH variations (uplink control)
    if (message.direction === 'UL' && message.messageType?.includes('Control')) {
      parameterUpdates['PUCCH-Power'] = {
        value: 10.2 + (Math.random() - 0.5) * 8, // ±4 dBm
        timestamp,
        trend: Math.random() > 0.5 ? 'up' : 'down'
      };
      
      parameterUpdates['PUCCH-BLER'] = {
        value: 1.5 + (Math.random() - 0.5) * 1, // ±0.5%
        timestamp,
        trend: Math.random() > 0.7 ? 'down' : 'stable'
      };
    }
    
    // DMRS variations (reference signals)
    if (message.messageType?.includes('Reference') || Math.random() > 0.7) {
      parameterUpdates['DMRS-RSRP'] = {
        value: -82.8 + (Math.random() - 0.5) * 6, // ±3 dBm
        timestamp,
        trend: Math.random() > 0.5 ? 'up' : 'down'
      };
      
      parameterUpdates['DMRS-Port-Count'] = {
        value: Math.floor(1 + Math.random() * 4), // 1-4 ports
        timestamp,
        trend: 'stable'
      };
    }
    
    // HARQ-related updates
    if (message.messageType?.includes('HARQ') || Math.random() > 0.6) {
      parameterUpdates['DLSCH-HARQ-ACK-Rate'] = {
        value: 96.8 + (Math.random() - 0.5) * 4, // ±2%
        timestamp,
        trend: Math.random() > 0.6 ? 'up' : 'stable'
      };
      
      parameterUpdates['ULSCH-HARQ-ACK-Rate'] = {
        value: 94.2 + (Math.random() - 0.5) * 4, // ±2%
        timestamp,
        trend: Math.random() > 0.6 ? 'up' : 'stable'
      };
    }
    
    // Apply updates
    setChannelParameters(prev => {
      const updated = { ...prev };
      
      Object.entries(parameterUpdates).forEach(([paramName, update]) => {
        if (updated[paramName]) {
          const previousValue = updated[paramName].value;
          updated[paramName] = {
            ...updated[paramName],
            ...update,
            previousValue
          };
        }
      });
      
      return updated;
    });
    
    // Update history
    setParameterHistory(prev => {
      const updated = { ...prev };
      
      Object.entries(parameterUpdates).forEach(([paramName, update]) => {
        if (updated[paramName] && channelParameters[paramName]) {
          const newEntry = {
            ...channelParameters[paramName],
            ...update,
            previousValue: channelParameters[paramName].value
          };
          
          updated[paramName] = [...(updated[paramName] || []), newEntry].slice(-20);
        }
      });
      
      return updated;
    });
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'PSS':
      case 'SSS': return <Antenna className="w-4 h-4" />;
      case 'DMRS': return <Signal className="w-4 h-4" />;
      case 'PBCH':
      case 'BCH': return <Radio className="w-4 h-4" />;
      case 'PDCCH':
      case 'PCFICH': return <Grid className="w-4 h-4" />;
      case 'PDSCH':
      case 'DL-SCH': return <TrendingDown className="w-4 h-4" />;
      case 'PRACH':
      case 'PUCCH':
      case 'PUSCH':
      case 'UL-SCH': return <TrendingUp className="w-4 h-4" />;
      case 'PHICH': return <Target className="w-4 h-4" />;
      case 'PCH': return <Waves className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case 'PSS':
      case 'SSS': return 'bg-blue-100 text-blue-800';
      case 'DMRS': return 'bg-green-100 text-green-800';
      case 'PBCH':
      case 'BCH': return 'bg-purple-100 text-purple-800';
      case 'PDCCH':
      case 'PCFICH': return 'bg-orange-100 text-orange-800';
      case 'PDSCH':
      case 'DL-SCH': return 'bg-red-100 text-red-800';
      case 'PRACH':
      case 'PUCCH':
      case 'PUSCH':
      case 'UL-SCH': return 'bg-indigo-100 text-indigo-800';
      case 'PHICH': return 'bg-yellow-100 text-yellow-800';
      case 'PCH': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'good': return 'text-green-600';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const filteredParameters = Object.values(channelParameters).filter(param => {
    const matchesChannel = selectedChannel === 'ALL' || param.channel === selectedChannel;
    const matchesDirection = selectedDirection === 'ALL' || param.direction === selectedDirection || param.direction === 'BOTH';
    return matchesChannel && matchesDirection;
  });

  const channels = ['ALL', 'PSS', 'SSS', 'DMRS', 'PBCH', 'PHICH', 'PCFICH', 'PDCCH', 'PDSCH', 'PRACH', 'PUCCH', 'PUSCH', 'DL-SCH', 'UL-SCH', 'PCH', 'BCH'];
  const directions = ['ALL', 'DL', 'UL', 'BOTH'];

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Radio className="w-5 h-5 mr-2 text-blue-600" />
          Channel Parameters Variation Tracker
        </h3>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {isLiveTracking ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600 font-medium">Live Tracking</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Waiting for Test Data</span>
              </>
            )}
          </div>
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="text-sm border rounded px-2 py-1"
          >
            {channels.map(channel => (
              <option key={channel} value={channel}>{channel}</option>
            ))}
          </select>
          <select
            value={selectedDirection}
            onChange={(e) => setSelectedDirection(e.target.value)}
            className="text-sm border rounded px-2 py-1"
          >
            {directions.map(direction => (
              <option key={direction} value={direction}>{direction}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredParameters.map((param) => (
          <div key={param.name} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getChannelIcon(param.channel)}
                <span className={`px-2 py-1 rounded text-xs font-medium ${getChannelColor(param.channel)}`}>
                  {param.channel}
                </span>
                <span className={`px-1 py-0.5 rounded text-xs font-medium ${
                  param.direction === 'DL' ? 'bg-green-100 text-green-700' :
                  param.direction === 'UL' ? 'bg-orange-100 text-orange-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {param.direction}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                {getTrendIcon(param.trend || 'stable')}
                {param.quality && (
                  <div className={`w-2 h-2 rounded-full ${
                    param.quality === 'good' ? 'bg-green-500' :
                    param.quality === 'fair' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                )}
              </div>
            </div>
            
            <div className="mb-2">
              <h4 className="font-medium text-gray-900 text-sm">{param.name}</h4>
              <div className="flex items-baseline space-x-1">
                <span className="text-lg font-bold text-gray-900">
                  {typeof param.value === 'number' ? param.value.toFixed(1) : param.value}
                </span>
                {param.unit && (
                  <span className="text-sm text-gray-600">{param.unit}</span>
                )}
              </div>
            </div>
            
            {param.previousValue !== undefined && param.previousValue !== param.value && (
              <div className="text-xs text-gray-500 mb-2">
                Previous: {typeof param.previousValue === 'number' ? param.previousValue.toFixed(1) : param.previousValue}
                {param.unit && ` ${param.unit}`}
              </div>
            )}
            
            {param.range && (
              <div className="text-xs text-gray-500 mb-1">
                Range: <span className="font-mono">{param.range}</span>
              </div>
            )}
            
            {param.reference && (
              <div className="text-xs text-blue-600 mb-1">
                {param.reference}
              </div>
            )}
            
            <div className="mt-2 text-xs text-gray-400">
              Updated: {new Date(param.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      {filteredParameters.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Radio className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>No channel parameters available for selected filters</p>
          <p className="text-sm">Run a test case to see live channel parameter variations</p>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Total Parameters: {filteredParameters.length}</span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span>Increasing: {filteredParameters.filter(p => p.trend === 'up').length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingDown className="w-4 h-4 text-red-600" />
              <span>Decreasing: {filteredParameters.filter(p => p.trend === 'down').length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Activity className="w-4 h-4 text-gray-600" />
              <span>Stable: {filteredParameters.filter(p => p.trend === 'stable').length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Good: {filteredParameters.filter(p => p.quality === 'good').length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelParametersTracker;
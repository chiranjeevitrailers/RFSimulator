'use client';

import React, { useEffect, useState } from 'react';
import { DataFormatAdapter } from '@/utils/DataFormatAdapter';

// Enhanced Service Integration Component with DataFormatAdapter
const ServiceIntegrationWithAdapter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [servicesInitialized, setServicesInitialized] = useState(false);
  const [serviceStatus, setServiceStatus] = useState<Record<string, string>>({});
  const [dataFormatAdapter, setDataFormatAdapter] = useState<any>(null);

  useEffect(() => {
    const initializeServices = async () => {
      try {
        // Initialize DataFormatAdapter first
        if (DataFormatAdapter) {
          setDataFormatAdapter(DataFormatAdapter);
          setServiceStatus(prev => ({ ...prev, dataFormatAdapter: 'Ready' }));
        }

        // Initialize Test Case Playback Service with DataFormatAdapter
        if (typeof window !== 'undefined' && window.TestCasePlaybackService) {
          const playbackService = new window.TestCasePlaybackService({
            databaseService: window.DatabaseService,
            websocketBroadcast: (type: string, source: string, data: any) => {
              console.log('Broadcasting:', type, source, data);
            },
            fetchImpl: fetch,
            dataFormatAdapter: DataFormatAdapter
          });
          window.TestCasePlaybackServiceInstance = playbackService;
          setServiceStatus(prev => ({ ...prev, playback: 'Initialized with Adapter' }));
        }

        // Initialize other services...
        setServicesInitialized(true);
      } catch (error) {
        console.error('Service initialization failed:', error);
      }
    };

    initializeServices();
  }, []);

  return (
    <div className="service-integration">
      {servicesInitialized ? children : (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Initializing services...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceIntegrationWithAdapter;
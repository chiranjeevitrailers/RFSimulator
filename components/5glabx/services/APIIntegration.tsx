'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

// API Integration Context
interface APIContextType {
  // Test Cases API
  fetchTestCases: (params?: {
    category?: string;
    protocol?: string;
    layer?: string;
    complexity?: string;
    limit?: number;
    offset?: number;
    search?: string;
    includeData?: boolean;
  }) => Promise<any>;
  
  fetchTestCase: (testCaseId: string, includeTemplates?: boolean) => Promise<any>;
  
  // Test Execution API
  executeTestCase: (testCaseId: string, params?: any) => Promise<any>;
  fetchTestExecution: (testCaseId?: string, runId?: string, includeTemplates?: boolean) => Promise<any>;
  
  // Test Runs API
  fetchTestRuns: (testId?: string) => Promise<any>;
  fetchTestRun: (runId: string) => Promise<any>;
  fetchTestRunMessages: (runId: string) => Promise<any>;
  fetchActiveTestRuns: () => Promise<any>;
  
  // Test Stats API
  fetchTestStats: () => Promise<any>;
  
  // Simulation API
  startSimulation: (params: any) => Promise<any>;
  stopSimulation: () => Promise<any>;
  
  // Volte/VoNR Conference IMS API
  fetchVolteVonrConferenceIms: () => Promise<any>;
  
  // Attach Flow API
  fetchAttachFlow: () => Promise<any>;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
}

const APIContext = createContext<APIContextType | null>(null);

export const useAPI = () => {
  const context = useContext(APIContext);
  if (!context) {
    throw new Error('useAPI must be used within APIProvider');
  }
  return context;
};

// API Provider Component
export const APIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequest = useCallback(async (requestFn: () => Promise<any>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await requestFn();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('API request error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Test Cases API
  const fetchTestCases = useCallback(async (params: {
    category?: string;
    protocol?: string;
    layer?: string;
    complexity?: string;
    limit?: number;
    offset?: number;
    search?: string;
    includeData?: boolean;
  } = {}) => {
    return handleRequest(async () => {
      const searchParams = new URLSearchParams();
      
      if (params.category) searchParams.append('category', params.category);
      if (params.protocol) searchParams.append('protocol', params.protocol);
      if (params.layer) searchParams.append('layer', params.layer);
      if (params.complexity) searchParams.append('complexity', params.complexity);
      if (params.limit) searchParams.append('limit', params.limit.toString());
      if (params.offset) searchParams.append('offset', params.offset.toString());
      if (params.search) searchParams.append('search', params.search);
      if (params.includeData) searchParams.append('includeData', params.includeData.toString());

      const response = await fetch(`/api/test-cases/comprehensive?${searchParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    });
  }, [handleRequest]);

  const fetchTestCase = useCallback(async (testCaseId: string, includeTemplates: boolean = true) => {
    return handleRequest(async () => {
      const response = await fetch(`/api/test-execution/comprehensive?testCaseId=${encodeURIComponent(testCaseId)}&includeTemplates=${includeTemplates}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    });
  }, [handleRequest]);

  // Test Execution API
  const executeTestCase = useCallback(async (testCaseId: string, params: any = {}) => {
    return handleRequest(async () => {
      const response = await fetch('/api/test-execution/comprehensive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testCaseId,
          ...params
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    });
  }, [handleRequest]);

  const fetchTestExecution = useCallback(async (testCaseId?: string, runId?: string, includeTemplates: boolean = true) => {
    return handleRequest(async () => {
      const searchParams = new URLSearchParams();
      
      if (testCaseId) searchParams.append('testCaseId', testCaseId);
      if (runId) searchParams.append('runId', runId);
      if (includeTemplates) searchParams.append('includeTemplates', includeTemplates.toString());

      const response = await fetch(`/api/test-execution/comprehensive?${searchParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    });
  }, [handleRequest]);

  // Test Runs API
  const fetchTestRuns = useCallback(async (testId?: string) => {
    return handleRequest(async () => {
      const url = testId ? `/api/tests/${testId}/runs` : '/api/tests/runs';
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    });
  }, [handleRequest]);

  const fetchTestRun = useCallback(async (runId: string) => {
    return handleRequest(async () => {
      const response = await fetch(`/api/tests/runs/${runId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    });
  }, [handleRequest]);

  const fetchTestRunMessages = useCallback(async (runId: string) => {
    return handleRequest(async () => {
      const response = await fetch(`/api/tests/runs/${runId}/messages`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    });
  }, [handleRequest]);

  const fetchActiveTestRuns = useCallback(async () => {
    return handleRequest(async () => {
      const response = await fetch('/api/tests/runs/active');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    });
  }, [handleRequest]);

  // Test Stats API
  const fetchTestStats = useCallback(async () => {
    return handleRequest(async () => {
      const response = await fetch('/api/tests/stats');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    });
  }, [handleRequest]);

  // Simulation API
  const startSimulation = useCallback(async (params: any) => {
    return handleRequest(async () => {
      const response = await fetch('/api/simulation/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    });
  }, [handleRequest]);

  const stopSimulation = useCallback(async () => {
    return handleRequest(async () => {
      const response = await fetch('/api/simulation/stream', {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    });
  }, [handleRequest]);

  // Volte/VoNR Conference IMS API
  const fetchVolteVonrConferenceIms = useCallback(async () => {
    return handleRequest(async () => {
      const response = await fetch('/api/test-cases/volte-vonr-conference-ims');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    });
  }, [handleRequest]);

  // Attach Flow API
  const fetchAttachFlow = useCallback(async () => {
    return handleRequest(async () => {
      const response = await fetch('/api/test-execution/attach-flow');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    });
  }, [handleRequest]);

  const contextValue: APIContextType = {
    // Test Cases API
    fetchTestCases,
    fetchTestCase,
    
    // Test Execution API
    executeTestCase,
    fetchTestExecution,
    
    // Test Runs API
    fetchTestRuns,
    fetchTestRun,
    fetchTestRunMessages,
    fetchActiveTestRuns,
    
    // Test Stats API
    fetchTestStats,
    
    // Simulation API
    startSimulation,
    stopSimulation,
    
    // Volte/VoNR Conference IMS API
    fetchVolteVonrConferenceIms,
    
    // Attach Flow API
    fetchAttachFlow,
    
    // Loading states
    isLoading,
    error
  };

  return (
    <APIContext.Provider value={contextValue}>
      {children}
    </APIContext.Provider>
  );
};

export default APIProvider;
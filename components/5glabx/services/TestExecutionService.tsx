'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export interface TestExecutionRequest {
  testCaseId: string;
  userId: string;
  executionMode?: 'comprehensive' | 'simple';
  configuration?: any;
  timeAcceleration?: number;
  logLevel?: string;
  captureMode?: string;
}

export interface TestExecutionResponse {
  success: boolean;
  executionId?: string;
  queueId?: string;
  status: string;
  message: string;
  data?: any;
}

export interface TestCaseData {
  id: string;
  name: string;
  description: string;
  protocol: string;
  layer: string;
  complexity: string;
  category: string;
  expectedMessages: any[];
  expectedInformationElements: any[];
  expectedLayerParameters: any[];
  simulation: {
    testCaseId: string;
    runId?: string;
    totalExpectedMessages: number;
    totalActualMessages: number;
    layers: string[];
    protocols: string[];
    duration: number;
    status: string;
    complianceScore: number;
  };
}

export interface TestExecutionStatus {
  executionId: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  currentMessage?: string;
  messagesProcessed: number;
  totalMessages: number;
  startTime?: string;
  endTime?: string;
  error?: string;
}

class TestExecutionService {
  private static instance: TestExecutionService;
  private baseUrl = '/api';
  private activeExecutions = new Map<string, TestExecutionStatus>();
  private statusCallbacks = new Map<string, (status: TestExecutionStatus) => void>();
  private messageCallbacks = new Map<string, (message: any) => void>();

  private constructor() {}

  static getInstance(): TestExecutionService {
    if (!TestExecutionService.instance) {
      TestExecutionService.instance = new TestExecutionService();
    }
    return TestExecutionService.instance;
  }

  /**
   * Fetch comprehensive test case data
   */
  async getTestCaseData(testCaseId: string): Promise<TestCaseData | null> {
    try {
      const response = await fetch(`${this.baseUrl}/test-execution/comprehensive?testCaseId=${encodeURIComponent(testCaseId)}&includeTemplates=true`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        return result.data;
      }

      return null;
    } catch (error) {
      console.error('Error fetching test case data:', error);
      throw error;
    }
  }

  /**
   * Execute test case
   */
  async executeTestCase(request: TestExecutionRequest): Promise<TestExecutionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/test-execution/comprehensive`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Initialize execution tracking
      if (result.success && result.data?.executionId) {
        this.activeExecutions.set(result.data.executionId, {
          executionId: result.data.executionId,
          status: 'queued',
          progress: 0,
          messagesProcessed: 0,
          totalMessages: 0,
        });

        // Start monitoring execution status
        this.monitorExecutionStatus(result.data.executionId);
      }

      return result;
    } catch (error) {
      console.error('Error executing test case:', error);
      throw error;
    }
  }

  /**
   * Monitor execution status via polling
   */
  private async monitorExecutionStatus(executionId: string): Promise<void> {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`${this.baseUrl}/tests/runs/${executionId}`);
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            const status = result.data;
            const currentStatus = this.activeExecutions.get(executionId);

            if (currentStatus) {
              const updatedStatus: TestExecutionStatus = {
                executionId,
                status: status.status,
                progress: status.progress || 0,
                currentMessage: status.current_message,
                messagesProcessed: status.actual_message_count || 0,
                totalMessages: status.expected_message_count || 0,
                startTime: status.start_time,
                endTime: status.end_time,
                error: status.error,
              };

              this.activeExecutions.set(executionId, updatedStatus);
              this.notifyStatusCallbacks(executionId, updatedStatus);

              // Stop polling if execution is complete or failed
              if (['completed', 'failed', 'cancelled'].includes(status.status)) {
                clearInterval(pollInterval);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error monitoring execution status:', error);
      }
    }, 1000);

    // Clean up after 5 minutes
    setTimeout(() => {
      clearInterval(pollInterval);
    }, 300000);
  }

  /**
   * Get execution status
   */
  getExecutionStatus(executionId: string): TestExecutionStatus | null {
    return this.activeExecutions.get(executionId) || null;
  }

  /**
   * Cancel execution
   */
  async cancelExecution(executionId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/tests/runs/${executionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const currentStatus = this.activeExecutions.get(executionId);
        if (currentStatus) {
          currentStatus.status = 'cancelled';
          this.notifyStatusCallbacks(executionId, currentStatus);
        }
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error cancelling execution:', error);
      return false;
    }
  }

  /**
   * Register status callback
   */
  onExecutionStatus(executionId: string, callback: (status: TestExecutionStatus) => void): void {
    this.statusCallbacks.set(executionId, callback);
  }

  /**
   * Unregister status callback
   */
  offExecutionStatus(executionId: string): void {
    this.statusCallbacks.delete(executionId);
  }

  /**
   * Register message callback
   */
  onExecutionMessage(executionId: string, callback: (message: any) => void): void {
    this.messageCallbacks.set(executionId, callback);
  }

  /**
   * Unregister message callback
   */
  offExecutionMessage(executionId: string): void {
    this.messageCallbacks.delete(executionId);
  }

  private notifyStatusCallbacks(executionId: string, status: TestExecutionStatus): void {
    const callback = this.statusCallbacks.get(executionId);
    if (callback) {
      callback(status);
    }
  }

  private notifyMessageCallbacks(executionId: string, message: any): void {
    const callback = this.messageCallbacks.get(executionId);
    if (callback) {
      callback(message);
    }
  }
}

// React hook for using the test execution service
export const useTestExecution = () => {
  const [executions, setExecutions] = useState<Map<string, TestExecutionStatus>>(new Map());
  const service = TestExecutionService.getInstance();

  useEffect(() => {
    // Update executions state when service state changes
    const updateExecutions = () => {
      const newExecutions = new Map();
      service['activeExecutions'].forEach((status, executionId) => {
        newExecutions.set(executionId, status);
      });
      setExecutions(newExecutions);
    };

    // Poll for updates
    const interval = setInterval(updateExecutions, 500);
    return () => clearInterval(interval);
  }, [service]);

  const executeTestCase = useCallback(async (request: TestExecutionRequest): Promise<TestExecutionResponse> => {
    return service.executeTestCase(request);
  }, [service]);

  const getTestCaseData = useCallback(async (testCaseId: string): Promise<TestCaseData | null> => {
    return service.getTestCaseData(testCaseId);
  }, [service]);

  const getExecutionStatus = useCallback((executionId: string): TestExecutionStatus | null => {
    return service.getExecutionStatus(executionId);
  }, [service]);

  const cancelExecution = useCallback(async (executionId: string): Promise<boolean> => {
    return service.cancelExecution(executionId);
  }, [service]);

  const onExecutionStatus = useCallback((executionId: string, callback: (status: TestExecutionStatus) => void) => {
    service.onExecutionStatus(executionId, callback);
  }, [service]);

  const offExecutionStatus = useCallback((executionId: string) => {
    service.offExecutionStatus(executionId);
  }, [service]);

  const onExecutionMessage = useCallback((executionId: string, callback: (message: any) => void) => {
    service.onExecutionMessage(executionId, callback);
  }, [service]);

  const offExecutionMessage = useCallback((executionId: string) => {
    service.offExecutionMessage(executionId);
  }, [service]);

  return {
    executeTestCase,
    getTestCaseData,
    getExecutionStatus,
    cancelExecution,
    onExecutionStatus,
    offExecutionStatus,
    onExecutionMessage,
    offExecutionMessage,
    executions,
  };
};

export default TestExecutionService;
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface TestExecutionMessage {
  executionId: string;
  timestamp: number;
  type: 'message' | 'status' | 'progress' | 'complete' | 'error';
  data: any;
  layer?: string;
  protocol?: string;
  messageType?: string;
  direction?: 'UL' | 'DL' | 'BIDIRECTIONAL';
}

export interface TestExecutionWebSocketConfig {
  url?: string;
  executionId: string;
  reconnectAttempts?: number;
  reconnectDelay?: number;
  heartbeatInterval?: number;
}

class TestExecutionWebSocketService {
  private static instance: TestExecutionWebSocketService;
  private ws: WebSocket | null = null;
  private config: TestExecutionWebSocketConfig | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private heartbeatIntervalMs = 30000;
  private isConnected = false;
  private messageHandlers: ((message: TestExecutionMessage) => void)[] = [];
  private connectionHandlers: ((connected: boolean) => void)[] = [];
  private errorHandlers: ((error: Error) => void)[] = [];

  private constructor() {}

  static getInstance(): TestExecutionWebSocketService {
    if (!TestExecutionWebSocketService.instance) {
      TestExecutionWebSocketService.instance = new TestExecutionWebSocketService();
    }
    return TestExecutionWebSocketService.instance;
  }

  /**
   * Connect to test execution WebSocket
   */
  connect(config: TestExecutionWebSocketConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      this.config = config;
      this.maxReconnectAttempts = config.reconnectAttempts || 5;
      this.reconnectDelay = config.reconnectDelay || 1000;
      this.heartbeatIntervalMs = config.heartbeatInterval || 30000;

      const wsUrl = this.buildWebSocketUrl(config);
      console.log('Connecting to WebSocket:', wsUrl);

      try {
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('WebSocket connected for execution:', config.executionId);
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.startHeartbeat();

          // Notify connection handlers
          this.connectionHandlers.forEach(handler => handler(true));

          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            const message: TestExecutionMessage = {
              executionId: config.executionId,
              timestamp: Date.now(),
              type: data.type || 'message',
              data: data.data || data,
              layer: data.layer,
              protocol: data.protocol,
              messageType: data.messageType,
              direction: data.direction,
            };

            this.messageHandlers.forEach(handler => handler(message));
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
            this.errorHandlers.forEach(handler => handler(error as Error));
          }
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket closed for execution:', config.executionId, 'Code:', event.code, 'Reason:', event.reason);
          this.isConnected = false;
          this.stopHeartbeat();

          // Notify connection handlers
          this.connectionHandlers.forEach(handler => handler(false));

          // Attempt to reconnect if not a clean close
          if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error for execution:', config.executionId, error);
          this.isConnected = false;
          this.errorHandlers.forEach(handler => handler(new Error('WebSocket connection error')));
          reject(error);
        };

      } catch (error) {
        console.error('Failed to create WebSocket connection:', error);
        reject(error);
      }
    });
  }

  /**
   * Disconnect WebSocket
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close(1000, 'Client disconnecting');
      this.ws = null;
    }
    this.stopHeartbeat();
    this.isConnected = false;
  }

  /**
   * Send message through WebSocket
   */
  sendMessage(message: any): boolean {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
        return true;
      } catch (error) {
        console.error('Error sending WebSocket message:', error);
        return false;
      }
    }
    return false;
  }

  /**
   * Add message handler
   */
  onMessage(handler: (message: TestExecutionMessage) => void): void {
    this.messageHandlers.push(handler);
  }

  /**
   * Remove message handler
   */
  offMessage(handler: (message: TestExecutionMessage) => void): void {
    const index = this.messageHandlers.indexOf(handler);
    if (index > -1) {
      this.messageHandlers.splice(index, 1);
    }
  }

  /**
   * Add connection handler
   */
  onConnection(handler: (connected: boolean) => void): void {
    this.connectionHandlers.push(handler);
  }

  /**
   * Remove connection handler
   */
  offConnection(handler: (connected: boolean) => void): void {
    const index = this.connectionHandlers.indexOf(handler);
    if (index > -1) {
      this.connectionHandlers.splice(index, 1);
    }
  }

  /**
   * Add error handler
   */
  onError(handler: (error: Error) => void): void {
    this.errorHandlers.push(handler);
  }

  /**
   * Remove error handler
   */
  offError(handler: (error: Error) => void): void {
    const index = this.errorHandlers.indexOf(handler);
    if (index > -1) {
      this.errorHandlers.splice(index, 1);
    }
  }

  /**
   * Get connection status
   */
  isConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Get current config
   */
  getConfig(): TestExecutionWebSocketConfig | null {
    return this.config;
  }

  private buildWebSocketUrl(config: TestExecutionWebSocketConfig): string {
    const baseUrl = config.url || process.env.NEXT_PUBLIC_5GLABX_WS_URL || 'ws://localhost:8082';
    const url = new URL(baseUrl);

    // Add query parameters
    url.searchParams.set('executionId', config.executionId);
    url.searchParams.set('type', 'test-execution');

    return url.toString();
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), 30000);

    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      if (this.config) {
        this.connect(this.config).catch(error => {
          console.error('Reconnection failed:', error);
        });
      }
    }, delay);
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();

    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        // Send heartbeat ping
        this.ws.send(JSON.stringify({
          type: 'ping',
          timestamp: Date.now()
        }));
      }
    }, this.heartbeatIntervalMs);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
}

// React hook for using the test execution WebSocket service
export const useTestExecutionWebSocket = (config: TestExecutionWebSocketConfig | null) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<TestExecutionMessage[]>([]);
  const [connectionError, setConnectionError] = useState<Error | null>(null);
  const service = TestExecutionWebSocketService.getInstance();

  // Connection handler
  useEffect(() => {
    const handleConnection = (connected: boolean) => {
      setIsConnected(connected);
      setConnectionError(null);
    };

    const handleError = (error: Error) => {
      setConnectionError(error);
    };

    service.onConnection(handleConnection);
    service.onError(handleError);

    return () => {
      service.offConnection(handleConnection);
      service.offError(handleError);
    };
  }, [service]);

  // Message handler
  useEffect(() => {
    const handleMessage = (message: TestExecutionMessage) => {
      setMessages(prev => [...prev.slice(-99), message]); // Keep last 100 messages
    };

    service.onMessage(handleMessage);

    return () => {
      service.offMessage(handleMessage);
    };
  }, [service]);

  // Auto-connect when config changes
  useEffect(() => {
    if (config) {
      service.connect(config).catch(error => {
        setConnectionError(error);
      });
    } else {
      service.disconnect();
    }

    return () => {
      service.disconnect();
    };
  }, [config, service]);

  const sendMessage = useCallback((message: any): boolean => {
    return service.sendMessage(message);
  }, [service]);

  const getMessagesByType = useCallback((type: string): TestExecutionMessage[] => {
    return messages.filter(msg => msg.type === type);
  }, [messages]);

  const getMessagesByLayer = useCallback((layer: string): TestExecutionMessage[] => {
    return messages.filter(msg => msg.layer === layer);
  }, [messages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    isConnected,
    messages,
    connectionError,
    sendMessage,
    getMessagesByType,
    getMessagesByLayer,
    clearMessages,
  };
};

export default TestExecutionWebSocketService;
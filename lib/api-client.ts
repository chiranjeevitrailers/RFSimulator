import { supabase } from './supabase';

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode: number;
  timestamp: string;
  requestId: string;
}

export interface APIRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, any>;
  timeout?: number;
}

export interface APIConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  enableLogging: boolean;
  enableCaching: boolean;
  cacheTimeout: number;
  enableRateLimiting: boolean;
  rateLimitPerMinute: number;
}

export interface APIEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description: string;
  parameters?: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
    example?: any;
  }>;
  requestBody?: {
    type: string;
    schema: any;
    example?: any;
  };
  responses: Array<{
    statusCode: number;
    description: string;
    schema?: any;
    example?: any;
  }>;
  tags: string[];
  security?: Array<{
    type: string;
    scheme: string;
  }>;
}

export class APIClient {
  private static instance: APIClient;
  private config: APIConfig;
  private requestCache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private rateLimitTracker: Map<string, { count: number; windowStart: number }> = new Map();
  private requestQueue: Array<() => Promise<any>> = [];
  private isProcessingQueue = false;

  private constructor() {
    this.config = {
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
      timeout: 30000,
      retryAttempts: 3,
      retryDelay: 1000,
      enableLogging: true,
      enableCaching: true,
      cacheTimeout: 300000, // 5 minutes
      enableRateLimiting: true,
      rateLimitPerMinute: 100
    };
  }

  public static getInstance(): APIClient {
    if (!APIClient.instance) {
      APIClient.instance = new APIClient();
    }
    return APIClient.instance;
  }

  // Core API methods
  public async request<T = any>(request: APIRequest): Promise<APIResponse<T>> {
    const requestId = this.generateRequestId();
    const startTime = Date.now();

    try {
      // Check rate limiting
      if (this.config.enableRateLimiting && !this.checkRateLimit(requestId)) {
        return {
          success: false,
          error: 'Rate limit exceeded',
          statusCode: 429,
          timestamp: new Date().toISOString(),
          requestId
        };
      }

      // Check cache for GET requests
      if (request.method === 'GET' && this.config.enableCaching) {
        const cached = this.getCachedResponse(request);
        if (cached) {
          return {
            success: true,
            data: cached,
            statusCode: 200,
            timestamp: new Date().toISOString(),
            requestId
          };
        }
      }

      // Execute request
      const response = await this.executeRequest(request, requestId);

      // Cache successful GET responses
      if (request.method === 'GET' && this.config.enableCaching && response.success) {
        this.cacheResponse(request, response.data);
      }

      // Log request
      if (this.config.enableLogging) {
        this.logRequest(request, response, Date.now() - startTime);
      }

      return response;
    } catch (error) {
      const errorResponse: APIResponse<T> = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        statusCode: 500,
        timestamp: new Date().toISOString(),
        requestId
      };

      if (this.config.enableLogging) {
        this.logRequest(request, errorResponse, Date.now() - startTime);
      }

      return errorResponse;
    }
  }

  // Convenience methods
  public async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<APIResponse<T>> {
    return this.request<T>({
      method: 'GET',
      endpoint,
      params
    });
  }

  public async post<T = any>(endpoint: string, body?: any): Promise<APIResponse<T>> {
    return this.request<T>({
      method: 'POST',
      endpoint,
      body
    });
  }

  public async put<T = any>(endpoint: string, body?: any): Promise<APIResponse<T>> {
    return this.request<T>({
      method: 'PUT',
      endpoint,
      body
    });
  }

  public async delete<T = any>(endpoint: string): Promise<APIResponse<T>> {
    return this.request<T>({
      method: 'DELETE',
      endpoint
    });
  }

  public async patch<T = any>(endpoint: string, body?: any): Promise<APIResponse<T>> {
    return this.request<T>({
      method: 'PATCH',
      endpoint,
      body
    });
  }

  // Test Case API methods
  public async getTestCases(params?: {
    category?: string;
    protocol?: string;
    complexity?: string;
    limit?: number;
    offset?: number;
  }): Promise<APIResponse<any[]>> {
    return this.get('/test-cases', params);
  }

  public async getTestCase(id: string): Promise<APIResponse<any>> {
    return this.get(`/test-cases/${id}`);
  }

  public async createTestCase(testCase: any): Promise<APIResponse<any>> {
    return this.post('/test-cases', testCase);
  }

  public async updateTestCase(id: string, testCase: any): Promise<APIResponse<any>> {
    return this.put(`/test-cases/${id}`, testCase);
  }

  public async deleteTestCase(id: string): Promise<APIResponse<void>> {
    return this.delete(`/test-cases/${id}`);
  }

  // Test Execution API methods
  public async executeTestCase(testCaseId: string, config?: any): Promise<APIResponse<any>> {
    return this.post(`/test-cases/${testCaseId}/execute`, config);
  }

  public async getTestExecutions(params?: {
    testCaseId?: string;
    userId?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<APIResponse<any[]>> {
    return this.get('/test-executions', params);
  }

  public async getTestExecution(id: string): Promise<APIResponse<any>> {
    return this.get(`/test-executions/${id}`);
  }

  public async cancelTestExecution(id: string): Promise<APIResponse<void>> {
    return this.post(`/test-executions/${id}/cancel`);
  }

  // Analytics API methods
  public async getAnalytics(params?: {
    timeRange?: string;
    protocol?: string;
    userId?: string;
  }): Promise<APIResponse<any>> {
    return this.get('/analytics', params);
  }

  public async generateReport(config: any): Promise<APIResponse<any>> {
    return this.post('/analytics/reports', config);
  }

  public async getReport(id: string): Promise<APIResponse<any>> {
    return this.get(`/analytics/reports/${id}`);
  }

  // User API methods
  public async getUsers(params?: {
    role?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<APIResponse<any[]>> {
    return this.get('/users', params);
  }

  public async getUser(id: string): Promise<APIResponse<any>> {
    return this.get(`/users/${id}`);
  }

  public async updateUser(id: string, user: any): Promise<APIResponse<any>> {
    return this.put(`/users/${id}`, user);
  }

  public async deleteUser(id: string): Promise<APIResponse<void>> {
    return this.delete(`/users/${id}`);
  }

  // Security API methods
  public async getSecurityEvents(params?: {
    type?: string;
    severity?: string;
    resolved?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<APIResponse<any[]>> {
    return this.get('/security/events', params);
  }

  public async getSecurityMetrics(): Promise<APIResponse<any>> {
    return this.get('/security/metrics');
  }

  public async generateComplianceReport(type: string): Promise<APIResponse<any>> {
    return this.post('/security/compliance', { type });
  }

  public async blockIP(ipAddress: string, reason: string): Promise<APIResponse<void>> {
    return this.post('/security/block-ip', { ipAddress, reason });
  }

  public async unblockIP(ipAddress: string): Promise<APIResponse<void>> {
    return this.delete(`/security/block-ip/${ipAddress}`);
  }

  // System API methods
  public async getSystemStatus(): Promise<APIResponse<any>> {
    return this.get('/system/status');
  }

  public async getSystemMetrics(): Promise<APIResponse<any>> {
    return this.get('/system/metrics');
  }

  public async getSystemLogs(params?: {
    level?: string;
    service?: string;
    limit?: number;
    offset?: number;
  }): Promise<APIResponse<any[]>> {
    return this.get('/system/logs', params);
  }

  // Batch operations
  public async batchRequest<T = any>(requests: APIRequest[]): Promise<APIResponse<T>[]> {
    return Promise.all(requests.map(request => this.request<T>(request)));
  }

  // Request queuing
  public async queueRequest<T = any>(request: APIRequest): Promise<APIResponse<T>> {
    return new Promise((resolve, reject) => {
      this.requestQueue.push(async () => {
        try {
          const response = await this.request<T>(request);
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });

      this.processQueue();
    });
  }

  // Configuration management
  public updateConfig(updates: Partial<APIConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  public getConfig(): APIConfig {
    return { ...this.config };
  }

  // Cache management
  public clearCache(): void {
    this.requestCache.clear();
  }

  public getCacheStats(): {
    size: number;
    hitRate: number;
    entries: Array<{ key: string; ttl: number; size: number }>;
  } {
    const entries = Array.from(this.requestCache.entries()).map(([key, value]) => ({
      key,
      ttl: value.ttl,
      size: JSON.stringify(value.data).length
    }));

    return {
      size: this.requestCache.size,
      hitRate: 0, // This would be calculated based on actual usage
      entries
    };
  }

  // Private methods
  private async executeRequest(request: APIRequest, requestId: string): Promise<APIResponse> {
    const url = this.buildURL(request.endpoint, request.params);
    const headers = this.buildHeaders(request.headers);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), request.timeout || this.config.timeout);

    try {
      const response = await fetch(url, {
        method: request.method,
        headers,
        body: request.body ? JSON.stringify(request.body) : undefined,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      return {
        success: response.ok,
        data: response.ok ? data : undefined,
        error: response.ok ? undefined : data.error || data.message || 'Request failed',
        statusCode: response.status,
        timestamp: new Date().toISOString(),
        requestId
      };
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private buildURL(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(endpoint, this.config.baseURL);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  private buildHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...customHeaders
    };

    // Add authentication header if available
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private getAuthToken(): string | null {
    // This would get the auth token from Supabase or localStorage
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  private checkRateLimit(requestId: string): boolean {
    const now = Date.now();
    const windowStart = now - 60000; // 1 minute window
    const tracker = this.rateLimitTracker.get(requestId);

    if (!tracker || tracker.windowStart < windowStart) {
      this.rateLimitTracker.set(requestId, { count: 1, windowStart: now });
      return true;
    }

    if (tracker.count >= this.config.rateLimitPerMinute) {
      return false;
    }

    tracker.count++;
    return true;
  }

  private getCachedResponse(request: APIRequest): any | null {
    const cacheKey = this.generateCacheKey(request);
    const cached = this.requestCache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }

    if (cached) {
      this.requestCache.delete(cacheKey);
    }

    return null;
  }

  private cacheResponse(request: APIRequest, data: any): void {
    const cacheKey = this.generateCacheKey(request);
    this.requestCache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl: this.config.cacheTimeout
    });
  }

  private generateCacheKey(request: APIRequest): string {
    return `${request.method}:${request.endpoint}:${JSON.stringify(request.params || {})}`;
  }

  private generateRequestId(): string {
    return 'req_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private logRequest(request: APIRequest, response: APIResponse, duration: number): void {
    if (this.config.enableLogging) {
      console.log('API Request:', {
        method: request.method,
        endpoint: request.endpoint,
        statusCode: response.statusCode,
        duration: `${duration}ms`,
        success: response.success,
        requestId: response.requestId
      });
    }
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;
    const batch = this.requestQueue.splice(0, 10); // Process up to 10 requests at a time

    try {
      await Promise.all(batch.map(request => request()));
    } catch (error) {
      console.error('Queue processing error:', error);
    } finally {
      this.isProcessingQueue = false;
      
      if (this.requestQueue.length > 0) {
        setTimeout(() => this.processQueue(), 100);
      }
    }
  }
}

// Export singleton instance
export const apiClient = APIClient.getInstance();
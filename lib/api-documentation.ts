import { APIEndpoint } from './api-client';

export interface APIDocumentation {
  title: string;
  version: string;
  description: string;
  baseURL: string;
  endpoints: APIEndpoint[];
  schemas: Record<string, any>;
  examples: Record<string, any>;
  authentication: {
    type: string;
    description: string;
    scheme: string;
  };
  rateLimiting: {
    enabled: boolean;
    limit: number;
    window: string;
  };
  errorCodes: Array<{
    code: number;
    message: string;
    description: string;
  }>;
}

export class APIDocumentationGenerator {
  private static instance: APIDocumentationGenerator;
  private documentation: APIDocumentation;

  private constructor() {
    this.documentation = this.generateDocumentation();
  }

  public static getInstance(): APIDocumentationGenerator {
    if (!APIDocumentationGenerator.instance) {
      APIDocumentationGenerator.instance = new APIDocumentationGenerator();
    }
    return APIDocumentationGenerator.instance;
  }

  public getDocumentation(): APIDocumentation {
    return this.documentation;
  }

  public getOpenAPISpec(): any {
    return {
      openapi: '3.0.0',
      info: {
        title: this.documentation.title,
        version: this.documentation.version,
        description: this.documentation.description
      },
      servers: [
        {
          url: this.documentation.baseURL,
          description: 'Production server'
        }
      ],
      security: [
        {
          bearerAuth: []
        }
      ],
      paths: this.generatePaths(),
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        },
        schemas: this.documentation.schemas
      }
    };
  }

  public getPostmanCollection(): any {
    return {
      info: {
        name: this.documentation.title,
        description: this.documentation.description,
        version: this.documentation.version
      },
      auth: {
        type: 'bearer',
        bearer: [
          {
            key: 'token',
            value: '{{auth_token}}',
            type: 'string'
          }
        ]
      },
      item: this.generatePostmanItems(),
      variable: [
        {
          key: 'base_url',
          value: this.documentation.baseURL
        }
      ]
    };
  }

  public generateMarkdown(): string {
    let markdown = `# ${this.documentation.title}\n\n`;
    markdown += `**Version:** ${this.documentation.version}\n\n`;
    markdown += `${this.documentation.description}\n\n`;

    // Authentication
    markdown += `## Authentication\n\n`;
    markdown += `${this.documentation.authentication.description}\n\n`;
    markdown += `**Type:** ${this.documentation.authentication.type}\n`;
    markdown += `**Scheme:** ${this.documentation.authentication.scheme}\n\n`;

    // Rate Limiting
    markdown += `## Rate Limiting\n\n`;
    if (this.documentation.rateLimiting.enabled) {
      markdown += `Rate limiting is enabled with a limit of ${this.documentation.rateLimiting.limit} requests per ${this.documentation.rateLimiting.window}.\n\n`;
    } else {
      markdown += `Rate limiting is not enabled.\n\n`;
    }

    // Error Codes
    markdown += `## Error Codes\n\n`;
    markdown += `| Code | Message | Description |\n`;
    markdown += `|------|---------|-------------|\n`;
    this.documentation.errorCodes.forEach(error => {
      markdown += `| ${error.code} | ${error.message} | ${error.description} |\n`;
    });
    markdown += `\n`;

    // Endpoints
    markdown += `## API Endpoints\n\n`;
    this.documentation.endpoints.forEach(endpoint => {
      markdown += this.generateEndpointMarkdown(endpoint);
    });

    // Examples
    markdown += `## Examples\n\n`;
    Object.entries(this.documentation.examples).forEach(([name, example]) => {
      markdown += `### ${name}\n\n`;
      markdown += `\`\`\`json\n${JSON.stringify(example, null, 2)}\n\`\`\`\n\n`;
    });

    return markdown;
  }

  private generateDocumentation(): APIDocumentation {
    return {
      title: '5GLabX API',
      version: '1.0.0',
      description: 'Comprehensive API for 5GLabX Protocol Simulator Platform',
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
      endpoints: this.generateEndpoints(),
      schemas: this.generateSchemas(),
      examples: this.generateExamples(),
      authentication: {
        type: 'Bearer Token',
        description: 'All API requests require a valid JWT token in the Authorization header',
        scheme: 'Bearer'
      },
      rateLimiting: {
        enabled: true,
        limit: 100,
        window: 'minute'
      },
      errorCodes: this.generateErrorCodes()
    };
  }

  private generateEndpoints(): APIEndpoint[] {
    return [
      // Test Cases
      {
        path: '/test-cases',
        method: 'GET',
        description: 'Get all test cases with optional filtering',
        parameters: [
          {
            name: 'category',
            type: 'string',
            required: false,
            description: 'Filter by test case category',
            example: '5G NR'
          },
          {
            name: 'protocol',
            type: 'string',
            required: false,
            description: 'Filter by protocol type',
            example: 'RRC'
          },
          {
            name: 'complexity',
            type: 'string',
            required: false,
            description: 'Filter by complexity level',
            example: 'medium'
          },
          {
            name: 'limit',
            type: 'number',
            required: false,
            description: 'Maximum number of results',
            example: 50
          },
          {
            name: 'offset',
            type: 'number',
            required: false,
            description: 'Number of results to skip',
            example: 0
          }
        ],
        responses: [
          {
            statusCode: 200,
            description: 'Successfully retrieved test cases',
            schema: {
              type: 'array',
              items: { $ref: '#/components/schemas/TestCase' }
            }
          },
          {
            statusCode: 401,
            description: 'Unauthorized',
            schema: { $ref: '#/components/schemas/Error' }
          }
        ],
        tags: ['Test Cases']
      },
      {
        path: '/test-cases/{id}',
        method: 'GET',
        description: 'Get a specific test case by ID',
        parameters: [
          {
            name: 'id',
            type: 'string',
            required: true,
            description: 'Test case ID',
            example: 'tc_5g_nr_rrc_001'
          }
        ],
        responses: [
          {
            statusCode: 200,
            description: 'Successfully retrieved test case',
            schema: { $ref: '#/components/schemas/TestCase' }
          },
          {
            statusCode: 404,
            description: 'Test case not found',
            schema: { $ref: '#/components/schemas/Error' }
          }
        ],
        tags: ['Test Cases']
      },
      {
        path: '/test-cases',
        method: 'POST',
        description: 'Create a new test case',
        requestBody: {
          type: 'object',
          schema: { $ref: '#/components/schemas/CreateTestCaseRequest' }
        },
        responses: [
          {
            statusCode: 201,
            description: 'Test case created successfully',
            schema: { $ref: '#/components/schemas/TestCase' }
          },
          {
            statusCode: 400,
            description: 'Invalid request data',
            schema: { $ref: '#/components/schemas/Error' }
          }
        ],
        tags: ['Test Cases']
      },
      {
        path: '/test-cases/{id}',
        method: 'PUT',
        description: 'Update an existing test case',
        parameters: [
          {
            name: 'id',
            type: 'string',
            required: true,
            description: 'Test case ID'
          }
        ],
        requestBody: {
          type: 'object',
          schema: { $ref: '#/components/schemas/UpdateTestCaseRequest' }
        },
        responses: [
          {
            statusCode: 200,
            description: 'Test case updated successfully',
            schema: { $ref: '#/components/schemas/TestCase' }
          },
          {
            statusCode: 404,
            description: 'Test case not found',
            schema: { $ref: '#/components/schemas/Error' }
          }
        ],
        tags: ['Test Cases']
      },
      {
        path: '/test-cases/{id}',
        method: 'DELETE',
        description: 'Delete a test case',
        parameters: [
          {
            name: 'id',
            type: 'string',
            required: true,
            description: 'Test case ID'
          }
        ],
        responses: [
          {
            statusCode: 204,
            description: 'Test case deleted successfully'
          },
          {
            statusCode: 404,
            description: 'Test case not found',
            schema: { $ref: '#/components/schemas/Error' }
          }
        ],
        tags: ['Test Cases']
      },
      // Test Executions
      {
        path: '/test-cases/{id}/execute',
        method: 'POST',
        description: 'Execute a test case',
        parameters: [
          {
            name: 'id',
            type: 'string',
            required: true,
            description: 'Test case ID'
          }
        ],
        requestBody: {
          type: 'object',
          schema: { $ref: '#/components/schemas/ExecuteTestCaseRequest' }
        },
        responses: [
          {
            statusCode: 202,
            description: 'Test execution started',
            schema: { $ref: '#/components/schemas/TestExecution' }
          },
          {
            statusCode: 400,
            description: 'Invalid execution parameters',
            schema: { $ref: '#/components/schemas/Error' }
          }
        ],
        tags: ['Test Executions']
      },
      {
        path: '/test-executions',
        method: 'GET',
        description: 'Get test executions with optional filtering',
        parameters: [
          {
            name: 'testCaseId',
            type: 'string',
            required: false,
            description: 'Filter by test case ID'
          },
          {
            name: 'userId',
            type: 'string',
            required: false,
            description: 'Filter by user ID'
          },
          {
            name: 'status',
            type: 'string',
            required: false,
            description: 'Filter by execution status',
            example: 'completed'
          }
        ],
        responses: [
          {
            statusCode: 200,
            description: 'Successfully retrieved test executions',
            schema: {
              type: 'array',
              items: { $ref: '#/components/schemas/TestExecution' }
            }
          }
        ],
        tags: ['Test Executions']
      },
      {
        path: '/test-executions/{id}',
        method: 'GET',
        description: 'Get a specific test execution by ID',
        parameters: [
          {
            name: 'id',
            type: 'string',
            required: true,
            description: 'Test execution ID'
          }
        ],
        responses: [
          {
            statusCode: 200,
            description: 'Successfully retrieved test execution',
            schema: { $ref: '#/components/schemas/TestExecution' }
          }
        ],
        tags: ['Test Executions']
      },
      {
        path: '/test-executions/{id}/cancel',
        method: 'POST',
        description: 'Cancel a running test execution',
        parameters: [
          {
            name: 'id',
            type: 'string',
            required: true,
            description: 'Test execution ID'
          }
        ],
        responses: [
          {
            statusCode: 200,
            description: 'Test execution cancelled successfully',
            schema: { $ref: '#/components/schemas/TestExecution' }
          }
        ],
        tags: ['Test Executions']
      },
      // Analytics
      {
        path: '/analytics',
        method: 'GET',
        description: 'Get analytics data',
        parameters: [
          {
            name: 'timeRange',
            type: 'string',
            required: false,
            description: 'Time range for analytics',
            example: '7d'
          },
          {
            name: 'protocol',
            type: 'string',
            required: false,
            description: 'Filter by protocol'
          }
        ],
        responses: [
          {
            statusCode: 200,
            description: 'Successfully retrieved analytics data',
            schema: { $ref: '#/components/schemas/AnalyticsData' }
          }
        ],
        tags: ['Analytics']
      },
      {
        path: '/analytics/reports',
        method: 'POST',
        description: 'Generate an analytics report',
        requestBody: {
          type: 'object',
          schema: { $ref: '#/components/schemas/GenerateReportRequest' }
        },
        responses: [
          {
            statusCode: 201,
            description: 'Report generation started',
            schema: { $ref: '#/components/schemas/Report' }
          }
        ],
        tags: ['Analytics']
      },
      {
        path: '/analytics/reports/{id}',
        method: 'GET',
        description: 'Get a specific analytics report',
        parameters: [
          {
            name: 'id',
            type: 'string',
            required: true,
            description: 'Report ID'
          }
        ],
        responses: [
          {
            statusCode: 200,
            description: 'Successfully retrieved report',
            schema: { $ref: '#/components/schemas/Report' }
          }
        ],
        tags: ['Analytics']
      },
      // Security
      {
        path: '/security/events',
        method: 'GET',
        description: 'Get security events',
        parameters: [
          {
            name: 'type',
            type: 'string',
            required: false,
            description: 'Filter by event type'
          },
          {
            name: 'severity',
            type: 'string',
            required: false,
            description: 'Filter by severity level'
          }
        ],
        responses: [
          {
            statusCode: 200,
            description: 'Successfully retrieved security events',
            schema: {
              type: 'array',
              items: { $ref: '#/components/schemas/SecurityEvent' }
            }
          }
        ],
        tags: ['Security']
      },
      {
        path: '/security/metrics',
        method: 'GET',
        description: 'Get security metrics',
        responses: [
          {
            statusCode: 200,
            description: 'Successfully retrieved security metrics',
            schema: { $ref: '#/components/schemas/SecurityMetrics' }
          }
        ],
        tags: ['Security']
      },
      {
        path: '/security/compliance',
        method: 'POST',
        description: 'Generate a compliance report',
        requestBody: {
          type: 'object',
          schema: { $ref: '#/components/schemas/ComplianceReportRequest' }
        },
        responses: [
          {
            statusCode: 201,
            description: 'Compliance report generated',
            schema: { $ref: '#/components/schemas/ComplianceReport' }
          }
        ],
        tags: ['Security']
      },
      // System
      {
        path: '/system/status',
        method: 'GET',
        description: 'Get system status',
        responses: [
          {
            statusCode: 200,
            description: 'Successfully retrieved system status',
            schema: { $ref: '#/components/schemas/SystemStatus' }
          }
        ],
        tags: ['System']
      },
      {
        path: '/system/metrics',
        method: 'GET',
        description: 'Get system metrics',
        responses: [
          {
            statusCode: 200,
            description: 'Successfully retrieved system metrics',
            schema: { $ref: '#/components/schemas/SystemMetrics' }
          }
        ],
        tags: ['System']
      }
    ];
  }

  private generateSchemas(): Record<string, any> {
    return {
      TestCase: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'string' },
          protocol: { type: 'string' },
          complexity: { type: 'string', enum: ['low', 'medium', 'high'] },
          duration: { type: 'number' },
          parameters: { type: 'object' },
          expectedResults: { type: 'object' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        },
        required: ['id', 'name', 'category', 'protocol']
      },
      CreateTestCaseRequest: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'string' },
          protocol: { type: 'string' },
          complexity: { type: 'string' },
          parameters: { type: 'object' },
          expectedResults: { type: 'object' }
        },
        required: ['name', 'category', 'protocol']
      },
      UpdateTestCaseRequest: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          parameters: { type: 'object' },
          expectedResults: { type: 'object' }
        }
      },
      TestExecution: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          testCaseId: { type: 'string' },
          userId: { type: 'string' },
          status: { type: 'string', enum: ['pending', 'running', 'completed', 'failed', 'cancelled'] },
          startTime: { type: 'string', format: 'date-time' },
          endTime: { type: 'string', format: 'date-time' },
          duration: { type: 'number' },
          results: { type: 'object' },
          logs: { type: 'array', items: { type: 'string' } }
        },
        required: ['id', 'testCaseId', 'status']
      },
      ExecuteTestCaseRequest: {
        type: 'object',
        properties: {
          parameters: { type: 'object' },
          timeout: { type: 'number' },
          priority: { type: 'string', enum: ['low', 'normal', 'high'] }
        }
      },
      AnalyticsData: {
        type: 'object',
        properties: {
          totalExecutions: { type: 'number' },
          successRate: { type: 'number' },
          averageExecutionTime: { type: 'number' },
          protocolDistribution: { type: 'object' },
          timeSeriesData: { type: 'array' }
        }
      },
      GenerateReportRequest: {
        type: 'object',
        properties: {
          reportType: { type: 'string', enum: ['executive', 'technical', 'detailed'] },
          timeRange: { type: 'object' },
          filters: { type: 'object' },
          format: { type: 'string', enum: ['pdf', 'excel', 'csv'] }
        },
        required: ['reportType']
      },
      Report: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          type: { type: 'string' },
          status: { type: 'string' },
          generatedAt: { type: 'string', format: 'date-time' },
          downloadUrl: { type: 'string' }
        }
      },
      SecurityEvent: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: { type: 'string' },
          severity: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
          userId: { type: 'string' },
          ipAddress: { type: 'string' },
          userAgent: { type: 'string' },
          details: { type: 'object' },
          timestamp: { type: 'string', format: 'date-time' },
          resolved: { type: 'boolean' }
        }
      },
      SecurityMetrics: {
        type: 'object',
        properties: {
          totalEvents: { type: 'number' },
          criticalEvents: { type: 'number' },
          failedLoginAttempts: { type: 'number' },
          blockedIPs: { type: 'number' },
          complianceScore: { type: 'number' }
        }
      },
      ComplianceReportRequest: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['GDPR', 'CCPA', 'SOX', 'HIPAA', 'PCI-DSS', 'ISO27001'] }
        },
        required: ['type']
      },
      ComplianceReport: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          type: { type: 'string' },
          status: { type: 'string' },
          score: { type: 'number' },
          findings: { type: 'array' },
          recommendations: { type: 'array' },
          generatedAt: { type: 'string', format: 'date-time' }
        }
      },
      SystemStatus: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['healthy', 'degraded', 'unhealthy'] },
          services: { type: 'object' },
          uptime: { type: 'number' },
          lastCheck: { type: 'string', format: 'date-time' }
        }
      },
      SystemMetrics: {
        type: 'object',
        properties: {
          cpu: { type: 'number' },
          memory: { type: 'number' },
          disk: { type: 'number' },
          network: { type: 'object' },
          activeUsers: { type: 'number' },
          totalRequests: { type: 'number' }
        }
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          message: { type: 'string' },
          statusCode: { type: 'number' },
          timestamp: { type: 'string', format: 'date-time' },
          requestId: { type: 'string' }
        },
        required: ['error', 'statusCode']
      }
    };
  }

  private generateExamples(): Record<string, any> {
    return {
      'Test Case': {
        id: 'tc_5g_nr_rrc_001',
        name: '5G NR RRC Connection Setup',
        description: 'Test case for 5G NR RRC connection establishment',
        category: '5G NR',
        protocol: 'RRC',
        complexity: 'medium',
        duration: 5000,
        parameters: {
          frequency: 3500,
          bandwidth: 100,
          powerLevel: -20
        },
        expectedResults: {
          successRate: 95,
          maxLatency: 100
        }
      },
      'Test Execution': {
        id: 'exec_001',
        testCaseId: 'tc_5g_nr_rrc_001',
        userId: 'user_123',
        status: 'completed',
        startTime: '2024-01-15T10:00:00Z',
        endTime: '2024-01-15T10:00:05Z',
        duration: 5000,
        results: {
          success: true,
          latency: 85,
          throughput: 1000
        }
      },
      'Analytics Data': {
        totalExecutions: 1250,
        successRate: 94.5,
        averageExecutionTime: 3200,
        protocolDistribution: {
          '5G NR': 450,
          '4G LTE': 380,
          'IMS/SIP': 200,
          'O-RAN': 150,
          'NB-IoT': 70
        }
      },
      'Security Event': {
        id: 'sec_001',
        type: 'failed_login',
        severity: 'medium',
        userId: 'user_123',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0...',
        details: {
          reason: 'Invalid password',
          attempts: 3
        },
        timestamp: '2024-01-15T10:00:00Z',
        resolved: false
      }
    };
  }

  private generateErrorCodes(): Array<{ code: number; message: string; description: string }> {
    return [
      { code: 400, message: 'Bad Request', description: 'The request was invalid or cannot be served' },
      { code: 401, message: 'Unauthorized', description: 'Authentication is required and has failed' },
      { code: 403, message: 'Forbidden', description: 'The request was valid but the server is refusing action' },
      { code: 404, message: 'Not Found', description: 'The requested resource could not be found' },
      { code: 409, message: 'Conflict', description: 'The request conflicts with the current state of the resource' },
      { code: 422, message: 'Unprocessable Entity', description: 'The request was well-formed but contains semantic errors' },
      { code: 429, message: 'Too Many Requests', description: 'Rate limit exceeded' },
      { code: 500, message: 'Internal Server Error', description: 'An unexpected error occurred on the server' },
      { code: 502, message: 'Bad Gateway', description: 'The server received an invalid response from upstream' },
      { code: 503, message: 'Service Unavailable', description: 'The server is temporarily unable to handle the request' }
    ];
  }

  private generatePaths(): any {
    const paths: any = {};
    
    this.documentation.endpoints.forEach(endpoint => {
      if (!paths[endpoint.path]) {
        paths[endpoint.path] = {};
      }
      
      paths[endpoint.path][endpoint.method.toLowerCase()] = {
        summary: endpoint.description,
        tags: endpoint.tags,
        parameters: endpoint.parameters?.map(param => ({
          name: param.name,
          in: 'path' in endpoint.path ? 'path' : 'query',
          required: param.required,
          description: param.description,
          schema: { type: param.type },
          example: param.example
        })),
        requestBody: endpoint.requestBody ? {
          required: true,
          content: {
            'application/json': {
              schema: endpoint.requestBody.schema,
              example: endpoint.requestBody.example
            }
          }
        } : undefined,
        responses: endpoint.responses.reduce((acc, response) => {
          acc[response.statusCode] = {
            description: response.description,
            content: response.schema ? {
              'application/json': {
                schema: response.schema,
                example: response.example
              }
            } : undefined
          };
          return acc;
        }, {} as any)
      };
    });
    
    return paths;
  }

  private generatePostmanItems(): any[] {
    return this.documentation.endpoints.map(endpoint => ({
      name: `${endpoint.method} ${endpoint.path}`,
      request: {
        method: endpoint.method,
        header: [
          {
            key: 'Authorization',
            value: 'Bearer {{auth_token}}',
            type: 'text'
          },
          {
            key: 'Content-Type',
            value: 'application/json',
            type: 'text'
          }
        ],
        url: {
          raw: `{{base_url}}${endpoint.path}`,
          host: ['{{base_url}}'],
          path: endpoint.path.split('/').filter(Boolean)
        },
        body: endpoint.requestBody ? {
          mode: 'raw',
          raw: JSON.stringify(endpoint.requestBody.example || {}, null, 2)
        } : undefined,
        description: endpoint.description
      }
    }));
  }

  private generateEndpointMarkdown(endpoint: APIEndpoint): string {
    let markdown = `### ${endpoint.method} ${endpoint.path}\n\n`;
    markdown += `${endpoint.description}\n\n`;

    if (endpoint.parameters && endpoint.parameters.length > 0) {
      markdown += `**Parameters:**\n\n`;
      markdown += `| Name | Type | Required | Description | Example |\n`;
      markdown += `|------|------|----------|-------------|----------|\n`;
      endpoint.parameters.forEach(param => {
        markdown += `| ${param.name} | ${param.type} | ${param.required ? 'Yes' : 'No'} | ${param.description} | ${param.example || '-'} |\n`;
      });
      markdown += `\n`;
    }

    if (endpoint.requestBody) {
      markdown += `**Request Body:**\n\n`;
      markdown += `\`\`\`json\n${JSON.stringify(endpoint.requestBody.example || {}, null, 2)}\n\`\`\`\n\n`;
    }

    markdown += `**Responses:**\n\n`;
    endpoint.responses.forEach(response => {
      markdown += `- **${response.statusCode}**: ${response.description}\n`;
      if (response.example) {
        markdown += `  \`\`\`json\n  ${JSON.stringify(response.example, null, 2)}\n  \`\`\`\n`;
      }
    });
    markdown += `\n`;

    return markdown;
  }
}

// Export singleton instance
export const apiDocumentation = APIDocumentationGenerator.getInstance();
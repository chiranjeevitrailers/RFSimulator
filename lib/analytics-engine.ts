import { TestExecutionResult } from './test-execution-engine';
import { TestCase } from './test-cases';

export interface AnalyticsMetrics {
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  successRate: number;
  averageExecutionTime: number;
  totalExecutionTime: number;
  protocolDistribution: {
    [protocol: string]: {
      count: number;
      successRate: number;
      averageTime: number;
    };
  };
  layerPerformance: {
    [layer: string]: {
      totalMessages: number;
      successfulMessages: number;
      failedMessages: number;
      averageLatency: number;
      errorRate: number;
    };
  };
  timeSeriesData: Array<{
    timestamp: Date;
    executions: number;
    successRate: number;
    averageTime: number;
  }>;
  userActivity: {
    [userId: string]: {
      totalExecutions: number;
      lastActivity: Date;
      favoriteProtocols: string[];
      averageSessionTime: number;
    };
  };
  performanceTrends: {
    executionTime: Array<{ date: Date; value: number }>;
    successRate: Array<{ date: Date; value: number }>;
    throughput: Array<{ date: Date; value: number }>;
    errorRate: Array<{ date: Date; value: number }>;
  };
}

export interface ReportConfig {
  reportType: 'executive' | 'technical' | 'detailed' | 'custom';
  timeRange: {
    start: Date;
    end: Date;
  };
  filters: {
    protocols?: string[];
    users?: string[];
    status?: string[];
    layers?: string[];
  };
  metrics: string[];
  format: 'pdf' | 'excel' | 'csv' | 'json';
  includeCharts: boolean;
  includeRawData: boolean;
}

export interface ReportData {
  id: string;
  name: string;
  type: string;
  generatedAt: Date;
  config: ReportConfig;
  data: AnalyticsMetrics;
  charts: Array<{
    type: string;
    title: string;
    data: any;
    config: any;
  }>;
  summary: {
    keyInsights: string[];
    recommendations: string[];
    alerts: string[];
  };
}

export class AnalyticsEngine {
  private static instance: AnalyticsEngine;
  private metrics: AnalyticsMetrics | null = null;
  private reportCache: Map<string, ReportData> = new Map();
  private eventListeners: Map<string, Function[]> = new Map();

  private constructor() {
    this.initializeMetrics();
  }

  public static getInstance(): AnalyticsEngine {
    if (!AnalyticsEngine.instance) {
      AnalyticsEngine.instance = new AnalyticsEngine();
    }
    return AnalyticsEngine.instance;
  }

  // Event system
  public on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  public off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  // Metrics calculation
  public async calculateMetrics(executions: TestExecutionResult[]): Promise<AnalyticsMetrics> {
    const metrics: AnalyticsMetrics = {
      totalExecutions: executions.length,
      successfulExecutions: 0,
      failedExecutions: 0,
      successRate: 0,
      averageExecutionTime: 0,
      totalExecutionTime: 0,
      protocolDistribution: {},
      layerPerformance: {},
      timeSeriesData: [],
      userActivity: {},
      performanceTrends: {
        executionTime: [],
        successRate: [],
        throughput: [],
        errorRate: []
      }
    };

    // Basic metrics
    let totalTime = 0;
    const protocolCounts: { [key: string]: { count: number; success: number; time: number } } = {};
    const layerCounts: { [key: string]: { total: number; success: number; failed: number; latency: number } } = {};
    const userCounts: { [key: string]: { executions: number; lastActivity: Date; protocols: Set<string>; sessionTime: number } } = {};
    const timeSeriesMap: { [key: string]: { executions: number; success: number; time: number } } = {};

    executions.forEach(execution => {
      // Success/failure counts
      if (execution.status === 'completed') {
        metrics.successfulExecutions++;
      } else if (execution.status === 'failed') {
        metrics.failedExecutions++;
      }

      // Execution time
      if (execution.duration) {
        totalTime += execution.duration;
      }

      // Protocol distribution
      const protocol = this.extractProtocolFromTestCaseId(execution.testCaseId);
      if (!protocolCounts[protocol]) {
        protocolCounts[protocol] = { count: 0, success: 0, time: 0 };
      }
      protocolCounts[protocol].count++;
      if (execution.status === 'completed') {
        protocolCounts[protocol].success++;
      }
      if (execution.duration) {
        protocolCounts[protocol].time += execution.duration;
      }

      // Layer performance
      if (execution.results.layerResults) {
        Object.entries(execution.results.layerResults).forEach(([layer, result]) => {
          if (!layerCounts[layer]) {
            layerCounts[layer] = { total: 0, success: 0, failed: 0, latency: 0 };
          }
          layerCounts[layer].total += result.messagesProcessed;
          layerCounts[layer].success += result.messagesProcessed - result.errors;
          layerCounts[layer].failed += result.errors;
          layerCounts[layer].latency += result.timing;
        });
      }

      // User activity
      if (!userCounts[execution.userId]) {
        userCounts[execution.userId] = {
          executions: 0,
          lastActivity: execution.startTime,
          protocols: new Set(),
          sessionTime: 0
        };
      }
      userCounts[execution.userId].executions++;
      userCounts[execution.userId].protocols.add(protocol);
      if (execution.duration) {
        userCounts[execution.userId].sessionTime += execution.duration;
      }
      if (execution.startTime > userCounts[execution.userId].lastActivity) {
        userCounts[execution.userId].lastActivity = execution.startTime;
      }

      // Time series data
      const dateKey = execution.startTime.toISOString().split('T')[0];
      if (!timeSeriesMap[dateKey]) {
        timeSeriesMap[dateKey] = { executions: 0, success: 0, time: 0 };
      }
      timeSeriesMap[dateKey].executions++;
      if (execution.status === 'completed') {
        timeSeriesMap[dateKey].success++;
      }
      if (execution.duration) {
        timeSeriesMap[dateKey].time += execution.duration;
      }
    });

    // Calculate derived metrics
    metrics.successRate = metrics.totalExecutions > 0 ? 
      (metrics.successfulExecutions / metrics.totalExecutions) * 100 : 0;
    metrics.averageExecutionTime = metrics.totalExecutions > 0 ? 
      totalTime / metrics.totalExecutions : 0;
    metrics.totalExecutionTime = totalTime;

    // Protocol distribution
    Object.entries(protocolCounts).forEach(([protocol, data]) => {
      metrics.protocolDistribution[protocol] = {
        count: data.count,
        successRate: data.count > 0 ? (data.success / data.count) * 100 : 0,
        averageTime: data.count > 0 ? data.time / data.count : 0
      };
    });

    // Layer performance
    Object.entries(layerCounts).forEach(([layer, data]) => {
      metrics.layerPerformance[layer] = {
        totalMessages: data.total,
        successfulMessages: data.success,
        failedMessages: data.failed,
        averageLatency: data.total > 0 ? data.latency / data.total : 0,
        errorRate: data.total > 0 ? (data.failed / data.total) * 100 : 0
      };
    });

    // User activity
    Object.entries(userCounts).forEach(([userId, data]) => {
      metrics.userActivity[userId] = {
        totalExecutions: data.executions,
        lastActivity: data.lastActivity,
        favoriteProtocols: Array.from(data.protocols),
        averageSessionTime: data.executions > 0 ? data.sessionTime / data.executions : 0
      };
    });

    // Time series data
    Object.entries(timeSeriesMap).forEach(([date, data]) => {
      metrics.timeSeriesData.push({
        timestamp: new Date(date),
        executions: data.executions,
        successRate: data.executions > 0 ? (data.success / data.executions) * 100 : 0,
        averageTime: data.executions > 0 ? data.time / data.executions : 0
      });
    });

    // Performance trends
    metrics.timeSeriesData.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    metrics.timeSeriesData.forEach(data => {
      metrics.performanceTrends.executionTime.push({
        date: data.timestamp,
        value: data.averageTime
      });
      metrics.performanceTrends.successRate.push({
        date: data.timestamp,
        value: data.successRate
      });
      metrics.performanceTrends.throughput.push({
        date: data.timestamp,
        value: data.executions
      });
      metrics.performanceTrends.errorRate.push({
        date: data.timestamp,
        value: 100 - data.successRate
      });
    });

    this.metrics = metrics;
    this.emit('metricsUpdated', metrics);
    return metrics;
  }

  // Report generation
  public async generateReport(config: ReportConfig): Promise<ReportData> {
    const reportId = this.generateReportId();
    const reportName = this.generateReportName(config);
    
    // Get filtered data
    const filteredMetrics = await this.getFilteredMetrics(config);
    
    // Generate charts
    const charts = this.generateCharts(filteredMetrics, config);
    
    // Generate summary
    const summary = this.generateSummary(filteredMetrics);
    
    const report: ReportData = {
      id: reportId,
      name: reportName,
      type: config.reportType,
      generatedAt: new Date(),
      config,
      data: filteredMetrics,
      charts,
      summary
    };

    this.reportCache.set(reportId, report);
    this.emit('reportGenerated', report);
    
    return report;
  }

  // Export functionality
  public async exportReport(reportId: string, format: string): Promise<Blob> {
    const report = this.reportCache.get(reportId);
    if (!report) {
      throw new Error('Report not found');
    }

    switch (format.toLowerCase()) {
      case 'json':
        return new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      case 'csv':
        return this.exportToCSV(report);
      case 'excel':
        return this.exportToExcel(report);
      case 'pdf':
        return this.exportToPDF(report);
      default:
        throw new Error('Unsupported export format');
    }
  }

  // Dashboard data
  public getDashboardData(): {
    overview: {
      totalExecutions: number;
      successRate: number;
      averageTime: number;
      activeUsers: number;
    };
    charts: Array<{
      type: string;
      title: string;
      data: any;
    }>;
    alerts: Array<{
      type: 'warning' | 'error' | 'info';
      message: string;
      timestamp: Date;
    }>;
  } {
    if (!this.metrics) {
      return {
        overview: {
          totalExecutions: 0,
          successRate: 0,
          averageTime: 0,
          activeUsers: 0
        },
        charts: [],
        alerts: []
      };
    }

    return {
      overview: {
        totalExecutions: this.metrics.totalExecutions,
        successRate: this.metrics.successRate,
        averageTime: this.metrics.averageExecutionTime,
        activeUsers: Object.keys(this.metrics.userActivity).length
      },
      charts: [
        {
          type: 'pie',
          title: 'Protocol Distribution',
          data: Object.entries(this.metrics.protocolDistribution).map(([protocol, data]) => ({
            name: protocol,
            value: data.count
          }))
        },
        {
          type: 'line',
          title: 'Success Rate Trend',
          data: this.metrics.performanceTrends.successRate
        },
        {
          type: 'bar',
          title: 'Layer Performance',
          data: Object.entries(this.metrics.layerPerformance).map(([layer, data]) => ({
            name: layer,
            success: data.successfulMessages,
            failed: data.failedMessages
          }))
        }
      ],
      alerts: this.generateAlerts()
    };
  }

  // Helper methods
  private extractProtocolFromTestCaseId(testCaseId: string): string {
    if (testCaseId.includes('NR_')) return '5G NR';
    if (testCaseId.includes('LTE_')) return '4G LTE';
    if (testCaseId.includes('IMS_')) return 'IMS/SIP';
    if (testCaseId.includes('ORAN_')) return 'O-RAN';
    if (testCaseId.includes('NBIOT_')) return 'NB-IoT';
    if (testCaseId.includes('V2X_')) return 'V2X';
    if (testCaseId.includes('NTN_')) return 'NTN';
    return 'Unknown';
  }

  private generateReportId(): string {
    return `report_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private generateReportName(config: ReportConfig): string {
    const type = config.reportType.charAt(0).toUpperCase() + config.reportType.slice(1);
    const startDate = config.timeRange.start.toISOString().split('T')[0];
    const endDate = config.timeRange.end.toISOString().split('T')[0];
    return `${type} Report - ${startDate} to ${endDate}`;
  }

  private async getFilteredMetrics(config: ReportConfig): Promise<AnalyticsMetrics> {
    // This would filter the metrics based on the config
    // For now, return the full metrics
    return this.metrics || await this.calculateMetrics([]);
  }

  private generateCharts(metrics: AnalyticsMetrics, config: ReportConfig): Array<{
    type: string;
    title: string;
    data: any;
    config: any;
  }> {
    const charts = [];

    if (config.includeCharts) {
      // Protocol distribution pie chart
      charts.push({
        type: 'pie',
        title: 'Protocol Distribution',
        data: Object.entries(metrics.protocolDistribution).map(([protocol, data]) => ({
          name: protocol,
          value: data.count,
          successRate: data.successRate
        })),
        config: {
          colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4']
        }
      });

      // Success rate trend line chart
      charts.push({
        type: 'line',
        title: 'Success Rate Trend',
        data: metrics.performanceTrends.successRate,
        config: {
          xAxis: 'date',
          yAxis: 'value',
          color: '#10B981'
        }
      });

      // Layer performance bar chart
      charts.push({
        type: 'bar',
        title: 'Layer Performance',
        data: Object.entries(metrics.layerPerformance).map(([layer, data]) => ({
          name: layer,
          success: data.successfulMessages,
          failed: data.failedMessages,
          errorRate: data.errorRate
        })),
        config: {
          xAxis: 'name',
          yAxis: ['success', 'failed'],
          colors: ['#10B981', '#EF4444']
        }
      });
    }

    return charts;
  }

  private generateSummary(metrics: AnalyticsMetrics): {
    keyInsights: string[];
    recommendations: string[];
    alerts: string[];
  } {
    const insights = [];
    const recommendations = [];
    const alerts = [];

    // Key insights
    insights.push(`Total executions: ${metrics.totalExecutions}`);
    insights.push(`Overall success rate: ${metrics.successRate.toFixed(1)}%`);
    insights.push(`Average execution time: ${(metrics.averageExecutionTime / 1000).toFixed(1)}s`);

    // Recommendations
    if (metrics.successRate < 95) {
      recommendations.push('Success rate is below 95%. Consider investigating failed executions.');
    }
    if (metrics.averageExecutionTime > 30000) {
      recommendations.push('Average execution time is high. Consider optimizing test cases.');
    }

    // Alerts
    if (metrics.successRate < 90) {
      alerts.push('Critical: Success rate is below 90%');
    }
    if (metrics.averageExecutionTime > 60000) {
      alerts.push('Warning: Average execution time exceeds 1 minute');
    }

    return { keyInsights: insights, recommendations, alerts };
  }

  private generateAlerts(): Array<{
    type: 'warning' | 'error' | 'info';
    message: string;
    timestamp: Date;
  }> {
    const alerts = [];
    
    if (this.metrics) {
      if (this.metrics.successRate < 90) {
        alerts.push({
          type: 'error',
          message: 'Success rate is critically low',
          timestamp: new Date()
        });
      }
      if (this.metrics.averageExecutionTime > 60000) {
        alerts.push({
          type: 'warning',
          message: 'Average execution time is high',
          timestamp: new Date()
        });
      }
    }

    return alerts;
  }

  private async exportToCSV(report: ReportData): Promise<Blob> {
    // CSV export implementation
    const csvData = this.convertToCSV(report.data);
    return new Blob([csvData], { type: 'text/csv' });
  }

  private async exportToExcel(report: ReportData): Promise<Blob> {
    // Excel export implementation
    const excelData = this.convertToExcel(report.data);
    return new Blob([excelData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  private async exportToPDF(report: ReportData): Promise<Blob> {
    // PDF export implementation
    const pdfData = this.convertToPDF(report);
    return new Blob([pdfData], { type: 'application/pdf' });
  }

  private convertToCSV(data: AnalyticsMetrics): string {
    // CSV conversion implementation
    return 'Protocol,Count,Success Rate,Average Time\n' +
      Object.entries(data.protocolDistribution).map(([protocol, metrics]) =>
        `${protocol},${metrics.count},${metrics.successRate.toFixed(1)}%,${metrics.averageTime.toFixed(0)}ms`
      ).join('\n');
  }

  private convertToExcel(data: AnalyticsMetrics): ArrayBuffer {
    // Excel conversion implementation
    return new ArrayBuffer(0);
  }

  private convertToPDF(report: ReportData): ArrayBuffer {
    // PDF conversion implementation
    return new ArrayBuffer(0);
  }

  private initializeMetrics(): void {
    this.metrics = {
      totalExecutions: 0,
      successfulExecutions: 0,
      failedExecutions: 0,
      successRate: 0,
      averageExecutionTime: 0,
      totalExecutionTime: 0,
      protocolDistribution: {},
      layerPerformance: {},
      timeSeriesData: [],
      userActivity: {},
      performanceTrends: {
        executionTime: [],
        successRate: [],
        throughput: [],
        errorRate: []
      }
    };
  }

  // Public getters
  public getMetrics(): AnalyticsMetrics | null {
    return this.metrics;
  }

  public getReport(reportId: string): ReportData | null {
    return this.reportCache.get(reportId) || null;
  }

  public getAllReports(): ReportData[] {
    return Array.from(this.reportCache.values());
  }

  public clearCache(): void {
    this.reportCache.clear();
  }
}
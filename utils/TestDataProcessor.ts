/**
 * Test Data Processor for File-Based System
 * Processes test cases and generates realistic test data
 */

import { TestCase, TestResult, TestEvent, LayerStatistics, PerformanceMetrics } from './TestCaseManager';
import { layerParameterSimulator, LayerParameterUpdate } from './LayerParameterSimulator';
import { dataFlowManager } from './DataFlowManager';

export class TestDataProcessor {
  /**
   * Process a test case and generate test data
   */
  async processTestCase(testCase: TestCase, sessionId: string): Promise<TestResult> {
    console.log(`🔄 Processing test case: ${testCase.name}`);
    
    const startTime = new Date();
    const events: TestEvent[] = [];
    const layerStatistics: LayerStatistics[] = [];
    const performanceMetrics: PerformanceMetrics[] = [];

    // Initialize layer parameter simulator
    layerParameterSimulator.initializeBaseValues(testCase);
    
    // Start parameter simulation
    layerParameterSimulator.startSimulation();
    
    // Subscribe to parameter updates
    const unsubscribe = layerParameterSimulator.subscribe((update: LayerParameterUpdate) => {
      console.log(`📊 Layer parameter update: ${update.layer}.${update.parameterName} = ${update.currentValue} ${update.unit} (${update.trend})`);
      
      // Convert parameter update to layer statistics
      const layerStat: LayerStatistics = {
        layer: update.layer,
        metricName: update.parameterName,
        value: update.currentValue,
        unit: update.unit,
        timestamp: update.timestamp,
        trend: update.trend,
        change: update.change,
        changePercent: update.changePercent
      };
      
      layerStatistics.push(layerStat);
      
      // Dispatch layer parameter update to frontends
      dataFlowManager.dispatchLayerParameterUpdate(update);
      dataFlowManager.dispatchLayerStatisticsUpdate(layerStat);
    });

    // Process each test step
    for (const step of testCase.expectedMessageSequence) {
      console.log(`📋 Processing step ${step.step}: ${step.eventType}`);
      
      // Generate events for this step
      const stepEvents = this.generateStepEvents(step, sessionId);
      events.push(...stepEvents);
      
      // Generate layer statistics
      const stepLayerStats = this.generateLayerStatistics(step, sessionId);
      layerStatistics.push(...stepLayerStats);
      
      // Generate performance metrics
      const stepPerfMetrics = this.generatePerformanceMetrics(step, sessionId);
      performanceMetrics.push(...stepPerfMetrics);
      
      // Simulate step duration
      await this.delay(step.duration || 1000);
    }

    // Stop parameter simulation
    layerParameterSimulator.stopSimulation();
    unsubscribe();

    const endTime = new Date();
    
    const result: TestResult = {
      sessionId,
      testCaseId: testCase.testCaseId,
      status: 'COMPLETED',
      startTime,
      endTime,
      events,
      layerStatistics,
      performanceMetrics
    };

    console.log(`✅ Test case processing completed: ${events.length} events, ${layerStatistics.length} layer stats`);
    return result;
  }

  /**
   * Generate events for a test step
   */
  private generateStepEvents(step: any, sessionId: string): TestEvent[] {
    const events: TestEvent[] = [];
    const baseTimestamp = Date.now();

    // Main event
    events.push({
      id: `${sessionId}-${step.step}-main`,
      timestamp: baseTimestamp,
      eventType: step.eventType,
      layer: step.layer,
      description: step.description,
      data: step.expectedIEs || {},
      step: step.step
    });

    // Sub-steps
    if (step.subSteps) {
      step.subSteps.forEach((subStep: string, index: number) => {
        events.push({
          id: `${sessionId}-${step.step}-${index}`,
          timestamp: baseTimestamp + (index * 100),
          eventType: subStep,
          layer: step.layer,
          description: `Sub-step: ${subStep}`,
          data: this.generateSubStepData(subStep, step.expectedIEs),
          step: step.step
        });
      });
    }

    return events;
  }

  /**
   * Generate layer statistics for a test step
   */
  private generateLayerStatistics(step: any, sessionId: string): LayerStatistics[] {
    const stats: LayerStatistics[] = [];
    const timestamp = Date.now();

    // Generate statistics based on step type
    switch (step.eventType) {
      case 'CELL_SYNC':
        stats.push(
          { layer: 'PHY', metricName: 'rsrp', value: -95.2, unit: 'dBm', timestamp },
          { layer: 'PHY', metricName: 'rsrq', value: -10.5, unit: 'dB', timestamp },
          { layer: 'PHY', metricName: 'sinr', value: 15.3, unit: 'dB', timestamp },
          { layer: 'PHY', metricName: 'cqi', value: 12, unit: 'index', timestamp },
          { layer: 'PHY', metricName: 'pci', value: 123, unit: 'id', timestamp }
        );
        break;
      
      case 'PRACH_ATTEMPT':
        stats.push(
          { layer: 'PHY', metricName: 'prach_attempts', value: 1, unit: 'count', timestamp },
          { layer: 'PHY', metricName: 'prach_power', value: -90, unit: 'dBm', timestamp },
          { layer: 'PHY', metricName: 'prach_success_rate', value: 1.0, unit: 'ratio', timestamp }
        );
        break;
      
      case 'RRC_CONN_REQUEST':
        stats.push(
          { layer: 'RRC', metricName: 'rrc_requests', value: 1, unit: 'count', timestamp },
          { layer: 'RRC', metricName: 'rrc_success_rate', value: 1.0, unit: 'ratio', timestamp },
          { layer: 'RRC', metricName: 'rrc_setup_time', value: 150, unit: 'ms', timestamp }
        );
        break;
      
      case 'NAS_ATTACH_REQUEST':
        stats.push(
          { layer: 'NAS', metricName: 'attach_requests', value: 1, unit: 'count', timestamp },
          { layer: 'NAS', metricName: 'attach_success_rate', value: 1.0, unit: 'ratio', timestamp },
          { layer: 'NAS', metricName: 'attach_time', value: 2500, unit: 'ms', timestamp }
        );
        break;
    }

    return stats;
  }

  /**
   * Generate performance metrics for a test step
   */
  private generatePerformanceMetrics(step: any, sessionId: string): PerformanceMetrics[] {
    const metrics: PerformanceMetrics[] = [];
    const timestamp = Date.now();

    // Generate performance metrics based on step
    const baseThroughput = this.getBaseThroughput(step.eventType);
    const baseLatency = this.getBaseLatency(step.eventType);
    const baseErrorRate = this.getBaseErrorRate(step.eventType);

    metrics.push({
      layer: step.layer,
      throughput: baseThroughput,
      latency: baseLatency,
      errorRate: baseErrorRate,
      timestamp
    });

    return metrics;
  }

  /**
   * Generate data for sub-steps
   */
  private generateSubStepData(subStep: string, expectedIEs: any): any {
    const data: any = {};

    switch (subStep) {
      case 'PSS_DETECTION':
        data.pss_sequence = 0;
        data.pss_correlation_peak = 0.95;
        data.pss_timing_offset = 0;
        data.pss_frequency_offset = 0;
        data.pss_snr = 15.2;
        break;
      
      case 'SSS_DETECTION':
        data.sss_sequence = 25;
        data.sss_correlation_peak = 0.92;
        data.sss_timing_offset = 0;
        data.sss_frequency_offset = 0;
        data.sss_snr = 14.8;
        break;
      
      case 'PCI_CALCULATION':
        data.pci = 123;
        data.pci_group = 41;
        data.pci_sector = 0;
        break;
      
      case 'DMRS_DETECTION':
        data.dmrs_sequence_id = 123;
        data.dmrs_correlation_peak = 0.88;
        data.dmrs_timing_offset = 0;
        data.dmrs_frequency_offset = 0;
        data.dmrs_snr = 14.5;
        break;
      
      case 'PBCH_MIB_DECODE':
        data.mib_dl_bandwidth = 20;
        data.mib_phich_config = { phich_duration: 'NORMAL', phich_resource: 1 };
        data.mib_system_frame_number = 0;
        data.mib_crc_check = 'PASS';
        data.mib_decode_success = true;
        break;
    }

    return { ...data, ...expectedIEs };
  }

  /**
   * Get base throughput for event type
   */
  private getBaseThroughput(eventType: string): number {
    const throughputMap: { [key: string]: number } = {
      'CELL_SYNC': 0,
      'PRACH_ATTEMPT': 0,
      'RRC_CONN_REQUEST': 0.1,
      'RRC_CONN_SETUP': 0.5,
      'NAS_ATTACH_REQUEST': 1.0,
      'NAS_ATTACH_ACCEPT': 2.0,
      'DEFAULT_BEARER_ACTIVATION': 5.0
    };
    return throughputMap[eventType] || 0;
  }

  /**
   * Get base latency for event type
   */
  private getBaseLatency(eventType: string): number {
    const latencyMap: { [key: string]: number } = {
      'CELL_SYNC': 2000,
      'PRACH_ATTEMPT': 1000,
      'RRC_CONN_REQUEST': 150,
      'RRC_CONN_SETUP': 100,
      'NAS_ATTACH_REQUEST': 2500,
      'NAS_ATTACH_ACCEPT': 200,
      'DEFAULT_BEARER_ACTIVATION': 500
    };
    return latencyMap[eventType] || 100;
  }

  /**
   * Get base error rate for event type
   */
  private getBaseErrorRate(eventType: string): number {
    const errorRateMap: { [key: string]: number } = {
      'CELL_SYNC': 0.001,
      'PRACH_ATTEMPT': 0.01,
      'RRC_CONN_REQUEST': 0.005,
      'RRC_CONN_SETUP': 0.002,
      'NAS_ATTACH_REQUEST': 0.01,
      'NAS_ATTACH_ACCEPT': 0.001,
      'DEFAULT_BEARER_ACTIVATION': 0.005
    };
    return errorRateMap[eventType] || 0.001;
  }

  /**
   * Delay execution for specified milliseconds
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const testDataProcessor = new TestDataProcessor();
/**
 * Layer Parameter Simulator
 * Simulates realistic changes in layer parameters during test execution
 */

export interface LayerParameterUpdate {
  layer: string;
  parameterName: string;
  currentValue: number;
  previousValue: number;
  change: number;
  changePercent: number;
  timestamp: number;
  unit: string;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface LayerStatistics {
  layer: string;
  metricName: string;
  value: number;
  unit: string;
  timestamp: number;
  trend?: 'increasing' | 'decreasing' | 'stable';
  change?: number;
  changePercent?: number;
}

export class LayerParameterSimulator {
  private updateInterval: number = 15000; // 15 seconds
  private isRunning: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;
  private callbacks: ((update: LayerParameterUpdate) => void)[] = [];
  private currentValues: Map<string, number> = new Map();
  private baseValues: Map<string, number> = new Map();

  constructor(updateInterval: number = 15000) {
    this.updateInterval = updateInterval;
  }

  /**
   * Start simulating layer parameter changes
   */
  startSimulation(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log(`🔄 Starting layer parameter simulation (${this.updateInterval}ms intervals)`);
    
    this.intervalId = setInterval(() => {
      this.generateParameterUpdates();
    }, this.updateInterval);
  }

  /**
   * Stop simulating layer parameter changes
   */
  stopSimulation(): void {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    console.log('⏹️ Layer parameter simulation stopped');
  }

  /**
   * Subscribe to parameter updates
   */
  subscribe(callback: (update: LayerParameterUpdate) => void): () => void {
    this.callbacks.push(callback);
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  /**
   * Initialize base values for a test case
   */
  initializeBaseValues(testCase: any): void {
    this.baseValues.clear();
    this.currentValues.clear();

    // Initialize PHY layer parameters
    this.baseValues.set('phy_rsrp', -95.2);
    this.baseValues.set('phy_rsrq', -10.5);
    this.baseValues.set('phy_sinr', 15.3);
    this.baseValues.set('phy_cqi', 12);
    this.baseValues.set('phy_pci', 123);
    this.baseValues.set('phy_earfcn', 1850);
    this.baseValues.set('phy_bandwidth', 20);
    this.baseValues.set('phy_timing_advance', 125);
    this.baseValues.set('phy_power_headroom', 2.5);

    // Initialize MAC layer parameters
    this.baseValues.set('mac_throughput_dl', 45.2);
    this.baseValues.set('mac_throughput_ul', 12.8);
    this.baseValues.set('mac_packet_loss_rate', 0.001);
    this.baseValues.set('mac_retransmission_rate', 0.005);
    this.baseValues.set('mac_buffer_utilization', 0.35);
    this.baseValues.set('mac_scheduling_efficiency', 0.92);

    // Initialize RLC layer parameters
    this.baseValues.set('rlc_throughput_dl', 44.8);
    this.baseValues.set('rlc_throughput_ul', 12.5);
    this.baseValues.set('rlc_packet_loss_rate', 0.0008);
    this.baseValues.set('rlc_retransmission_rate', 0.003);
    this.baseValues.set('rlc_buffer_occupancy', 0.28);
    this.baseValues.set('rlc_window_size', 512);

    // Initialize PDCP layer parameters
    this.baseValues.set('pdcp_throughput_dl', 44.5);
    this.baseValues.set('pdcp_throughput_ul', 12.2);
    this.baseValues.set('pdcp_packet_loss_rate', 0.0005);
    this.baseValues.set('pdcp_retransmission_rate', 0.002);
    this.baseValues.set('pdcp_buffer_occupancy', 0.22);
    this.baseValues.set('pdcp_sequence_number', 1024);

    // Initialize RRC layer parameters
    this.baseValues.set('rrc_connection_state', 1); // 1 = RRC_CONNECTED
    this.baseValues.set('rrc_handover_count', 0);
    this.baseValues.set('rrc_connection_attempts', 1);
    this.baseValues.set('rrc_connection_success_rate', 1.0);
    this.baseValues.set('rrc_setup_time', 150);
    this.baseValues.set('rrc_release_cause', 0);

    // Initialize NAS layer parameters
    this.baseValues.set('nas_attach_state', 1); // 1 = ATTACHED
    this.baseValues.set('nas_attach_attempts', 1);
    this.baseValues.set('nas_attach_success_rate', 1.0);
    this.baseValues.set('nas_attach_time', 2500);
    this.baseValues.set('nas_authentication_success', 1);
    this.baseValues.set('nas_security_mode', 1);

    // Copy base values to current values
    this.baseValues.forEach((value, key) => {
      this.currentValues.set(key, value);
    });

    console.log(`📊 Initialized ${this.baseValues.size} layer parameters`);
  }

  /**
   * Generate parameter updates
   */
  private generateParameterUpdates(): void {
    if (!this.isRunning) return;

    const updates: LayerParameterUpdate[] = [];
    const timestamp = Date.now();

    // Update PHY layer parameters
    updates.push(...this.updatePHYParameters(timestamp));
    
    // Update MAC layer parameters
    updates.push(...this.updateMACParameters(timestamp));
    
    // Update RLC layer parameters
    updates.push(...this.updateRLCParameters(timestamp));
    
    // Update PDCP layer parameters
    updates.push(...this.updatePDCPParameters(timestamp));
    
    // Update RRC layer parameters
    updates.push(...this.updateRRCParameters(timestamp));
    
    // Update NAS layer parameters
    updates.push(...this.updateNASParameters(timestamp));

    // Dispatch updates
    updates.forEach(update => {
      this.callbacks.forEach(callback => {
        try {
          callback(update);
        } catch (error) {
          console.error('Error in parameter update callback:', error);
        }
      });
    });

    console.log(`📈 Generated ${updates.length} parameter updates`);
  }

  /**
   * Update PHY layer parameters
   */
  private updatePHYParameters(timestamp: number): LayerParameterUpdate[] {
    const updates: LayerParameterUpdate[] = [];
    
    // RSRP changes (signal strength)
    const rsrpChange = this.generateRealisticChange(-95.2, 0.5, 0.1);
    updates.push(this.createUpdate('phy_rsrp', rsrpChange, 'dBm', timestamp));
    
    // RSRQ changes (signal quality)
    const rsrqChange = this.generateRealisticChange(-10.5, 0.3, 0.05);
    updates.push(this.createUpdate('phy_rsrq', rsrqChange, 'dB', timestamp));
    
    // SINR changes (signal to noise ratio)
    const sinrChange = this.generateRealisticChange(15.3, 0.8, 0.1);
    updates.push(this.createUpdate('phy_sinr', sinrChange, 'dB', timestamp));
    
    // CQI changes (channel quality indicator)
    const cqiChange = this.generateRealisticChange(12, 0.3, 0.05);
    updates.push(this.createUpdate('phy_cqi', Math.round(cqiChange), 'index', timestamp));
    
    // Timing advance changes
    const taChange = this.generateRealisticChange(125, 2, 0.1);
    updates.push(this.createUpdate('phy_timing_advance', Math.round(taChange), 'μs', timestamp));
    
    // Power headroom changes
    const phrChange = this.generateRealisticChange(2.5, 0.2, 0.05);
    updates.push(this.createUpdate('phy_power_headroom', phrChange, 'dB', timestamp));

    return updates;
  }

  /**
   * Update MAC layer parameters
   */
  private updateMACParameters(timestamp: number): LayerParameterUpdate[] {
    const updates: LayerParameterUpdate[] = [];
    
    // Downlink throughput
    const dlThrChange = this.generateRealisticChange(45.2, 1.5, 0.1);
    updates.push(this.createUpdate('mac_throughput_dl', dlThrChange, 'Mbps', timestamp));
    
    // Uplink throughput
    const ulThrChange = this.generateRealisticChange(12.8, 0.8, 0.1);
    updates.push(this.createUpdate('mac_throughput_ul', ulThrChange, 'Mbps', timestamp));
    
    // Packet loss rate
    const plrChange = this.generateRealisticChange(0.001, 0.0002, 0.1);
    updates.push(this.createUpdate('mac_packet_loss_rate', plrChange, 'ratio', timestamp));
    
    // Retransmission rate
    const rtrChange = this.generateRealisticChange(0.005, 0.001, 0.1);
    updates.push(this.createUpdate('mac_retransmission_rate', rtrChange, 'ratio', timestamp));
    
    // Buffer utilization
    const bufChange = this.generateRealisticChange(0.35, 0.05, 0.1);
    updates.push(this.createUpdate('mac_buffer_utilization', bufChange, 'ratio', timestamp));
    
    // Scheduling efficiency
    const schedChange = this.generateRealisticChange(0.92, 0.02, 0.05);
    updates.push(this.createUpdate('mac_scheduling_efficiency', schedChange, 'ratio', timestamp));

    return updates;
  }

  /**
   * Update RLC layer parameters
   */
  private updateRLCParameters(timestamp: number): LayerParameterUpdate[] {
    const updates: LayerParameterUpdate[] = [];
    
    // Downlink throughput
    const dlThrChange = this.generateRealisticChange(44.8, 1.2, 0.1);
    updates.push(this.createUpdate('rlc_throughput_dl', dlThrChange, 'Mbps', timestamp));
    
    // Uplink throughput
    const ulThrChange = this.generateRealisticChange(12.5, 0.6, 0.1);
    updates.push(this.createUpdate('rlc_throughput_ul', ulThrChange, 'Mbps', timestamp));
    
    // Packet loss rate
    const plrChange = this.generateRealisticChange(0.0008, 0.0001, 0.1);
    updates.push(this.createUpdate('rlc_packet_loss_rate', plrChange, 'ratio', timestamp));
    
    // Retransmission rate
    const rtrChange = this.generateRealisticChange(0.003, 0.0005, 0.1);
    updates.push(this.createUpdate('rlc_retransmission_rate', rtrChange, 'ratio', timestamp));
    
    // Buffer occupancy
    const bufChange = this.generateRealisticChange(0.28, 0.03, 0.1);
    updates.push(this.createUpdate('rlc_buffer_occupancy', bufChange, 'ratio', timestamp));
    
    // Window size
    const winChange = this.generateRealisticChange(512, 10, 0.05);
    updates.push(this.createUpdate('rlc_window_size', Math.round(winChange), 'packets', timestamp));

    return updates;
  }

  /**
   * Update PDCP layer parameters
   */
  private updatePDCPParameters(timestamp: number): LayerParameterUpdate[] {
    const updates: LayerParameterUpdate[] = [];
    
    // Downlink throughput
    const dlThrChange = this.generateRealisticChange(44.5, 1.0, 0.1);
    updates.push(this.createUpdate('pdcp_throughput_dl', dlThrChange, 'Mbps', timestamp));
    
    // Uplink throughput
    const ulThrChange = this.generateRealisticChange(12.2, 0.5, 0.1);
    updates.push(this.createUpdate('pdcp_throughput_ul', ulThrChange, 'Mbps', timestamp));
    
    // Packet loss rate
    const plrChange = this.generateRealisticChange(0.0005, 0.0001, 0.1);
    updates.push(this.createUpdate('pdcp_packet_loss_rate', plrChange, 'ratio', timestamp));
    
    // Retransmission rate
    const rtrChange = this.generateRealisticChange(0.002, 0.0003, 0.1);
    updates.push(this.createUpdate('pdcp_retransmission_rate', rtrChange, 'ratio', timestamp));
    
    // Buffer occupancy
    const bufChange = this.generateRealisticChange(0.22, 0.02, 0.1);
    updates.push(this.createUpdate('pdcp_buffer_occupancy', bufChange, 'ratio', timestamp));
    
    // Sequence number
    const seqChange = this.generateRealisticChange(1024, 50, 0.1);
    updates.push(this.createUpdate('pdcp_sequence_number', Math.round(seqChange), 'count', timestamp));

    return updates;
  }

  /**
   * Update RRC layer parameters
   */
  private updateRRCParameters(timestamp: number): LayerParameterUpdate[] {
    const updates: LayerParameterUpdate[] = [];
    
    // Connection state (usually stable)
    const stateChange = this.generateRealisticChange(1, 0.1, 0.05);
    updates.push(this.createUpdate('rrc_connection_state', Math.round(stateChange), 'state', timestamp));
    
    // Handover count (increases over time)
    const hoChange = this.generateRealisticChange(0, 0.1, 0.2);
    updates.push(this.createUpdate('rrc_handover_count', Math.max(0, Math.round(hoChange)), 'count', timestamp));
    
    // Connection attempts (usually stable)
    const attChange = this.generateRealisticChange(1, 0.05, 0.02);
    updates.push(this.createUpdate('rrc_connection_attempts', Math.round(attChange), 'count', timestamp));
    
    // Success rate (high, with small variations)
    const succChange = this.generateRealisticChange(1.0, 0.01, 0.02);
    updates.push(this.createUpdate('rrc_connection_success_rate', Math.min(1.0, succChange), 'ratio', timestamp));
    
    // Setup time (varies with network conditions)
    const setupChange = this.generateRealisticChange(150, 5, 0.1);
    updates.push(this.createUpdate('rrc_setup_time', Math.round(setupChange), 'ms', timestamp));

    return updates;
  }

  /**
   * Update NAS layer parameters
   */
  private updateNASParameters(timestamp: number): LayerParameterUpdate[] {
    const updates: LayerParameterUpdate[] = [];
    
    // Attach state (usually stable)
    const stateChange = this.generateRealisticChange(1, 0.05, 0.02);
    updates.push(this.createUpdate('nas_attach_state', Math.round(stateChange), 'state', timestamp));
    
    // Attach attempts (usually stable)
    const attChange = this.generateRealisticChange(1, 0.05, 0.02);
    updates.push(this.createUpdate('nas_attach_attempts', Math.round(attChange), 'count', timestamp));
    
    // Success rate (high, with small variations)
    const succChange = this.generateRealisticChange(1.0, 0.01, 0.02);
    updates.push(this.createUpdate('nas_attach_success_rate', Math.min(1.0, succChange), 'ratio', timestamp));
    
    // Attach time (varies with network conditions)
    const timeChange = this.generateRealisticChange(2500, 50, 0.1);
    updates.push(this.createUpdate('nas_attach_time', Math.round(timeChange), 'ms', timestamp));
    
    // Authentication success (usually stable)
    const authChange = this.generateRealisticChange(1, 0.05, 0.02);
    updates.push(this.createUpdate('nas_authentication_success', Math.round(authChange), 'success', timestamp));
    
    // Security mode (usually stable)
    const secChange = this.generateRealisticChange(1, 0.05, 0.02);
    updates.push(this.createUpdate('nas_security_mode', Math.round(secChange), 'mode', timestamp));

    return updates;
  }

  /**
   * Generate realistic parameter changes
   */
  private generateRealisticChange(baseValue: number, maxChange: number, variation: number): number {
    // Generate random change within bounds
    const change = (Math.random() - 0.5) * 2 * maxChange;
    const newValue = baseValue + change;
    
    // Apply some variation to make it more realistic
    const variationFactor = 1 + (Math.random() - 0.5) * variation;
    return newValue * variationFactor;
  }

  /**
   * Create parameter update object
   */
  private createUpdate(parameterName: string, newValue: number, unit: string, timestamp: number): LayerParameterUpdate {
    const previousValue = this.currentValues.get(parameterName) || newValue;
    const change = newValue - previousValue;
    const changePercent = previousValue !== 0 ? (change / previousValue) * 100 : 0;
    
    // Update current value
    this.currentValues.set(parameterName, newValue);
    
    // Determine trend
    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (Math.abs(changePercent) > 1) {
      trend = change > 0 ? 'increasing' : 'decreasing';
    }
    
    // Extract layer from parameter name
    const layer = parameterName.split('_')[0].toUpperCase();
    
    return {
      layer,
      parameterName,
      currentValue: newValue,
      previousValue,
      change,
      changePercent,
      timestamp,
      unit,
      trend
    };
  }

  /**
   * Get current parameter values
   */
  getCurrentValues(): Map<string, number> {
    return new Map(this.currentValues);
  }

  /**
   * Get parameter statistics
   */
  getParameterStatistics(): LayerStatistics[] {
    const stats: LayerStatistics[] = [];
    const timestamp = Date.now();
    
    this.currentValues.forEach((value, key) => {
      const layer = key.split('_')[0].toUpperCase();
      const metricName = key.split('_').slice(1).join('_');
      const unit = this.getUnitForKey(key);
      
      stats.push({
        layer,
        metricName,
        value,
        unit,
        timestamp
      });
    });
    
    return stats;
  }

  /**
   * Get unit for parameter key
   */
  private getUnitForKey(key: string): string {
    if (key.includes('throughput')) return 'Mbps';
    if (key.includes('rate') || key.includes('utilization') || key.includes('occupancy')) return 'ratio';
    if (key.includes('rsrp') || key.includes('power')) return 'dBm';
    if (key.includes('rsrq') || key.includes('sinr')) return 'dB';
    if (key.includes('time') || key.includes('setup')) return 'ms';
    if (key.includes('count') || key.includes('attempts') || key.includes('number')) return 'count';
    if (key.includes('state') || key.includes('mode') || key.includes('success')) return 'state';
    if (key.includes('cqi') || key.includes('index')) return 'index';
    if (key.includes('advance')) return 'μs';
    return 'value';
  }
}

export const layerParameterSimulator = new LayerParameterSimulator();
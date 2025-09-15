import { createClient } from '@/lib/supabase';

export interface SimulationMessage {
  id: string;
  timestamp: number;
  layer: string;
  message_type: string;
  message_name: string;
  direction: 'UL' | 'DL' | 'BIDIRECTIONAL';
  decoded_data: any;
  information_elements: any;
  validation_status: 'valid' | 'invalid' | 'warning';
  processing_time_ms: number;
}

export interface SimulationKPIs {
  messagesPerSecond: number;
  successRate: number;
  errorRate: number;
  throughputMbps: number;
  latencyMs: number;
  totalMessages: number;
  processedMessages: number;
  layerDistribution: Record<string, number>;
}

export interface SimulationControls {
  isPlaying: boolean;
  isPaused: boolean;
  speed: number; // 0.5x to 20x
  currentTime: number;
  totalDuration: number;
  startTime: number;
  endTime: number;
}

export interface SimulationFilters {
  layers: string[];
  messageTypes: string[];
  directions: string[];
  validationStatus: string[];
  timeRange: { start: number; end: number };
}

export class RealtimeSimulationEngine {
  private supabase = createClient();
  private messages: SimulationMessage[] = [];
  private currentIndex = 0;
  private startTime = 0;
  private simulationStartTime = 0;
  private intervalId: NodeJS.Timeout | null = null;
  private controls: SimulationControls;
  private filters: SimulationFilters;
  private kpis: SimulationKPIs;
  private callbacks: {
    onMessage: ((message: SimulationMessage) => void)[];
    onKPIUpdate: ((kpis: SimulationKPIs) => void)[];
    onProgress: ((progress: number) => void)[];
    onComplete: (() => void)[];
    onError: ((error: Error) => void)[];
  };

  constructor() {
    this.controls = {
      isPlaying: false,
      isPaused: false,
      speed: 1.0,
      currentTime: 0,
      totalDuration: 0,
      startTime: 0,
      endTime: 0,
    };

    this.filters = {
      layers: ['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS', 'IMS'],
      messageTypes: [],
      directions: ['UL', 'DL', 'BIDIRECTIONAL'],
      validationStatus: ['valid', 'invalid', 'warning'],
      timeRange: { start: 0, end: Infinity },
    };

    this.kpis = {
      messagesPerSecond: 0,
      successRate: 0,
      errorRate: 0,
      throughputMbps: 0,
      latencyMs: 0,
      totalMessages: 0,
      processedMessages: 0,
      layerDistribution: {},
    };

    this.callbacks = {
      onMessage: [],
      onKPIUpdate: [],
      onProgress: [],
      onComplete: [],
      onError: [],
    };
  }

  /**
   * Initialize simulation with test case data
   */
  async initializeSimulation(testCaseId: string): Promise<void> {
    try {
      // Fetch test case messages with timing information
      const { data: messages, error } = await this.supabase
        .from('test_case_messages')
        .select(`
          *,
          test_case_information_elements(*),
          test_case_layer_parameters(*)
        `)
        .eq('test_case_id', testCaseId)
        .order('timestamp_ms');

      if (error) throw error;

      // Convert to simulation messages
      this.messages = messages.map((msg, index) => ({
        id: msg.id,
        timestamp: msg.timestamp_ms,
        layer: msg.layer,
        message_type: msg.message_type,
        message_name: msg.message_name,
        direction: msg.direction,
        decoded_data: msg.decoded_data || {},
        information_elements: msg.test_case_information_elements || [],
        validation_status: 'valid' as const,
        processing_time_ms: Math.random() * 10 + 1, // Simulate processing time
      }));

      // Set up simulation timing
      this.controls.totalDuration = this.messages.length > 0 
        ? this.messages[this.messages.length - 1].timestamp 
        : 0;
      this.controls.startTime = this.messages.length > 0 
        ? this.messages[0].timestamp 
        : 0;
      this.controls.endTime = this.controls.totalDuration;
      this.controls.currentTime = this.controls.startTime;

      // Initialize KPIs
      this.updateKPIs();

      console.log(`Simulation initialized with ${this.messages.length} messages`);
    } catch (error) {
      console.error('Failed to initialize simulation:', error);
      this.emitError(error as Error);
    }
  }

  /**
   * Start real-time simulation
   */
  start(): void {
    if (this.controls.isPlaying) return;

    this.controls.isPlaying = true;
    this.controls.isPaused = false;
    this.simulationStartTime = Date.now();

    this.startMessageStreaming();
    console.log('Simulation started');
  }

  /**
   * Pause simulation
   */
  pause(): void {
    this.controls.isPlaying = false;
    this.controls.isPaused = true;
    this.stopMessageStreaming();
    console.log('Simulation paused');
  }

  /**
   * Resume simulation
   */
  resume(): void {
    if (!this.controls.isPaused) return;

    this.controls.isPlaying = true;
    this.controls.isPaused = false;
    this.simulationStartTime = Date.now() - (this.controls.currentTime - this.controls.startTime);
    this.startMessageStreaming();
    console.log('Simulation resumed');
  }

  /**
   * Stop simulation
   */
  stop(): void {
    this.controls.isPlaying = false;
    this.controls.isPaused = false;
    this.stopMessageStreaming();
    this.currentIndex = 0;
    this.controls.currentTime = this.controls.startTime;
    this.updateKPIs();
    console.log('Simulation stopped');
  }

  /**
   * Reset simulation to beginning
   */
  reset(): void {
    this.stop();
    this.currentIndex = 0;
    this.controls.currentTime = this.controls.startTime;
    this.kpis = {
      messagesPerSecond: 0,
      successRate: 0,
      errorRate: 0,
      throughputMbps: 0,
      latencyMs: 0,
      totalMessages: this.messages.length,
      processedMessages: 0,
      layerDistribution: {},
    };
    this.updateKPIs();
    console.log('Simulation reset');
  }

  /**
   * Set simulation speed
   */
  setSpeed(speed: number): void {
    this.controls.speed = Math.max(0.1, Math.min(20, speed));
    console.log(`Simulation speed set to ${this.controls.speed}x`);
  }

  /**
   * Jump to specific time in simulation
   */
  jumpToTime(time: number): void {
    const targetTime = Math.max(this.controls.startTime, Math.min(this.controls.endTime, time));
    this.controls.currentTime = targetTime;

    // Find the message index for this time
    this.currentIndex = this.messages.findIndex(msg => msg.timestamp >= targetTime);
    if (this.currentIndex === -1) this.currentIndex = this.messages.length;

    this.updateKPIs();
    console.log(`Jumped to time ${targetTime}ms`);
  }

  /**
   * Set simulation filters
   */
  setFilters(filters: Partial<SimulationFilters>): void {
    this.filters = { ...this.filters, ...filters };
    console.log('Simulation filters updated:', this.filters);
  }

  /**
   * Get current simulation state
   */
  getState(): {
    controls: SimulationControls;
    kpis: SimulationKPIs;
    filters: SimulationFilters;
    progress: number;
  } {
    const progress = this.controls.totalDuration > 0 
      ? ((this.controls.currentTime - this.controls.startTime) / (this.controls.endTime - this.controls.startTime)) * 100
      : 0;

    return {
      controls: { ...this.controls },
      kpis: { ...this.kpis },
      filters: { ...this.filters },
      progress,
    };
  }

  /**
   * Add event listeners
   */
  on(event: 'message' | 'kpi' | 'progress' | 'complete' | 'error', callback: Function): void {
    this.callbacks[`on${event.charAt(0).toUpperCase() + event.slice(1)}` as keyof typeof this.callbacks].push(callback);
  }

  /**
   * Remove event listeners
   */
  off(event: 'message' | 'kpi' | 'progress' | 'complete' | 'error', callback: Function): void {
    const callbacks = this.callbacks[`on${event.charAt(0).toUpperCase() + event.slice(1)}` as keyof typeof this.callbacks];
    const index = callbacks.indexOf(callback);
    if (index > -1) callbacks.splice(index, 1);
  }

  /**
   * Start message streaming
   */
  private startMessageStreaming(): void {
    if (this.intervalId) return;

    const interval = Math.max(10, 1000 / (this.controls.speed * 100)); // Adjust interval based on speed
    this.intervalId = setInterval(() => {
      this.processNextMessage();
    }, interval);
  }

  /**
   * Stop message streaming
   */
  private stopMessageStreaming(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Process next message in simulation
   */
  private processNextMessage(): void {
    if (this.currentIndex >= this.messages.length) {
      this.completeSimulation();
      return;
    }

    const message = this.messages[this.currentIndex];
    
    // Check if message should be processed based on current time and speed
    const elapsedTime = (Date.now() - this.simulationStartTime) * this.controls.speed;
    const targetTime = this.controls.startTime + elapsedTime;

    if (message.timestamp <= targetTime) {
      // Apply filters
      if (this.shouldProcessMessage(message)) {
        this.emitMessage(message);
        this.updateKPIs();
      }

      this.currentIndex++;
      this.controls.currentTime = message.timestamp;
      this.emitProgress();
    }
  }

  /**
   * Check if message should be processed based on filters
   */
  private shouldProcessMessage(message: SimulationMessage): boolean {
    // Layer filter
    if (this.filters.layers.length > 0 && !this.filters.layers.includes(message.layer)) {
      return false;
    }

    // Message type filter
    if (this.filters.messageTypes.length > 0 && !this.filters.messageTypes.includes(message.message_type)) {
      return false;
    }

    // Direction filter
    if (this.filters.directions.length > 0 && !this.filters.directions.includes(message.direction)) {
      return false;
    }

    // Validation status filter
    if (this.filters.validationStatus.length > 0 && !this.filters.validationStatus.includes(message.validation_status)) {
      return false;
    }

    // Time range filter
    if (message.timestamp < this.filters.timeRange.start || message.timestamp > this.filters.timeRange.end) {
      return false;
    }

    return true;
  }

  /**
   * Update KPIs based on processed messages
   */
  private updateKPIs(): void {
    const processedMessages = this.messages.slice(0, this.currentIndex);
    const validMessages = processedMessages.filter(msg => msg.validation_status === 'valid');
    const invalidMessages = processedMessages.filter(msg => msg.validation_status === 'invalid');

    // Calculate layer distribution
    const layerDistribution: Record<string, number> = {};
    processedMessages.forEach(msg => {
      layerDistribution[msg.layer] = (layerDistribution[msg.layer] || 0) + 1;
    });

    // Calculate throughput (simplified)
    const totalDataSize = processedMessages.reduce((sum, msg) => {
      return sum + (JSON.stringify(msg.decoded_data).length + JSON.stringify(msg.information_elements).length);
    }, 0);

    this.kpis = {
      messagesPerSecond: this.calculateMessagesPerSecond(),
      successRate: processedMessages.length > 0 ? (validMessages.length / processedMessages.length) * 100 : 0,
      errorRate: processedMessages.length > 0 ? (invalidMessages.length / processedMessages.length) * 100 : 0,
      throughputMbps: (totalDataSize / 1024 / 1024) * 8, // Convert to Mbps
      latencyMs: this.calculateAverageLatency(processedMessages),
      totalMessages: this.messages.length,
      processedMessages: this.currentIndex,
      layerDistribution,
    };

    this.emitKPIUpdate();
  }

  /**
   * Calculate messages per second
   */
  private calculateMessagesPerSecond(): number {
    if (this.controls.currentTime <= this.controls.startTime) return 0;
    
    const elapsedSeconds = (this.controls.currentTime - this.controls.startTime) / 1000;
    return elapsedSeconds > 0 ? this.currentIndex / elapsedSeconds : 0;
  }

  /**
   * Calculate average latency
   */
  private calculateAverageLatency(messages: SimulationMessage[]): number {
    if (messages.length === 0) return 0;
    
    const totalLatency = messages.reduce((sum, msg) => sum + msg.processing_time_ms, 0);
    return totalLatency / messages.length;
  }

  /**
   * Complete simulation
   */
  private completeSimulation(): void {
    this.stopMessageStreaming();
    this.controls.isPlaying = false;
    this.controls.isPaused = false;
    this.emitComplete();
    console.log('Simulation completed');
  }

  /**
   * Emit events
   */
  private emitMessage(message: SimulationMessage): void {
    this.callbacks.onMessage.forEach(callback => callback(message));
  }

  private emitKPIUpdate(): void {
    this.callbacks.onKPIUpdate.forEach(callback => callback(this.kpis));
  }

  private emitProgress(): void {
    const progress = this.controls.totalDuration > 0 
      ? ((this.controls.currentTime - this.controls.startTime) / (this.controls.endTime - this.controls.startTime)) * 100
      : 0;
    this.callbacks.onProgress.forEach(callback => callback(progress));
  }

  private emitComplete(): void {
    this.callbacks.onComplete.forEach(callback => callback());
  }

  private emitError(error: Error): void {
    this.callbacks.onError.forEach(callback => callback(error));
  }
}

export default RealtimeSimulationEngine;
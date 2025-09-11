import { ProtocolSimulator, SimulationContext, SimulationStep } from './protocol-simulator';
import { TestCase, TestCaseExecution } from './test-cases';

export interface RealTimeConfig {
  enableRealTimeMode: boolean;
  timeAcceleration: number; // 1x = real time, 10x = 10x faster
  maxTimeAcceleration: number;
  enableTimeSync: boolean;
  enableLayerSync: boolean;
  enableEventReplay: boolean;
  bufferSize: number;
  updateInterval: number; // milliseconds
}

export interface RealTimeEvent {
  id: string;
  timestamp: number;
  type: 'message' | 'state_change' | 'metric_update' | 'error' | 'warning';
  layer: string;
  direction: 'UL' | 'DL' | 'BIDIRECTIONAL';
  data: any;
  originalTimestamp: number;
  playbackTimestamp: number;
}

export interface RealTimeMetrics {
  messagesPerSecond: number;
  averageLatency: number;
  throughput: number;
  errorRate: number;
  layerActivity: Record<string, number>;
  timeSyncAccuracy: number;
}

export class RealTimeSimulator {
  private simulator: ProtocolSimulator;
  private config: RealTimeConfig;
  private isRunning = false;
  private isPaused = false;
  private startTime = 0;
  private playbackStartTime = 0;
  private timeAcceleration = 1;
  private eventBuffer: RealTimeEvent[] = [];
  private eventListeners: Map<string, Function[]> = new Map();
  private metrics: RealTimeMetrics;
  private updateInterval: NodeJS.Timeout | null = null;
  private layerStates: Map<string, any> = new Map();
  private messageQueue: RealTimeEvent[] = [];
  private currentTestCase: TestCase | null = null;
  private currentExecution: TestCaseExecution | null = null;

  constructor(config?: Partial<RealTimeConfig>) {
    this.simulator = new ProtocolSimulator();
    this.config = {
      enableRealTimeMode: true,
      timeAcceleration: 1,
      maxTimeAcceleration: 100,
      enableTimeSync: true,
      enableLayerSync: true,
      enableEventReplay: true,
      bufferSize: 1000,
      updateInterval: 100, // 100ms updates
      ...config
    };

    this.metrics = {
      messagesPerSecond: 0,
      averageLatency: 0,
      throughput: 0,
      errorRate: 0,
      layerActivity: {},
      timeSyncAccuracy: 100
    };

    this.setupSimulatorListeners();
  }

  // Event System
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in real-time event listener for ${event}:`, error);
        }
      });
    }
  }

  // Main Real-Time Simulation Methods
  async startRealTimeSimulation(testCase: TestCase, execution: TestCaseExecution): Promise<void> {
    if (this.isRunning) {
      throw new Error('Real-time simulation is already running');
    }

    this.currentTestCase = testCase;
    this.currentExecution = execution;
    this.isRunning = true;
    this.isPaused = false;
    this.startTime = Date.now();
    this.playbackStartTime = Date.now();
    this.eventBuffer = [];
    this.messageQueue = [];
    this.layerStates.clear();

    // Initialize layer states
    this.initializeLayerStates(testCase);

    // Start the update loop
    this.startUpdateLoop();

    this.emit('realtime_started', { testCase, execution });

    // Start the underlying simulation
    try {
      await this.simulator.startSimulation(testCase, execution);
    } catch (error) {
      this.stopRealTimeSimulation();
      throw error;
    }
  }

  async pauseRealTimeSimulation(): Promise<void> {
    if (!this.isRunning || this.isPaused) {
      return;
    }

    this.isPaused = true;
    this.emit('realtime_paused', { timestamp: Date.now() });
  }

  async resumeRealTimeSimulation(): Promise<void> {
    if (!this.isRunning || !this.isPaused) {
      return;
    }

    this.isPaused = false;
    this.playbackStartTime = Date.now() - (this.getElapsedTime() / this.timeAcceleration);
    this.emit('realtime_resumed', { timestamp: Date.now() });
  }

  async stopRealTimeSimulation(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    this.isPaused = false;
    this.stopUpdateLoop();

    this.emit('realtime_stopped', { 
      duration: this.getElapsedTime(),
      eventsProcessed: this.eventBuffer.length
    });

    // Stop the underlying simulation
    await this.simulator.stopSimulation();
  }

  // Time Control
  setTimeAcceleration(acceleration: number): void {
    if (acceleration < 0.1 || acceleration > this.config.maxTimeAcceleration) {
      throw new Error(`Time acceleration must be between 0.1 and ${this.config.maxTimeAcceleration}`);
    }

    const oldAcceleration = this.timeAcceleration;
    this.timeAcceleration = acceleration;
    this.config.timeAcceleration = acceleration;

    // Adjust playback start time to maintain continuity
    if (this.isRunning) {
      const currentElapsed = this.getElapsedTime();
      this.playbackStartTime = Date.now() - (currentElapsed / acceleration);
    }

    this.emit('time_acceleration_changed', { 
      oldAcceleration, 
      newAcceleration: acceleration 
    });
  }

  getTimeAcceleration(): number {
    return this.timeAcceleration;
  }

  // Event Management
  addEvent(event: Omit<RealTimeEvent, 'id' | 'playbackTimestamp'>): void {
    const realTimeEvent: RealTimeEvent = {
      ...event,
      id: this.generateEventId(),
      playbackTimestamp: this.calculatePlaybackTimestamp(event.originalTimestamp)
    };

    this.eventBuffer.push(realTimeEvent);
    this.messageQueue.push(realTimeEvent);

    // Maintain buffer size
    if (this.eventBuffer.length > this.config.bufferSize) {
      this.eventBuffer.shift();
    }

    this.emit('event_added', { event: realTimeEvent });
  }

  getEventsInTimeRange(startTime: number, endTime: number): RealTimeEvent[] {
    return this.eventBuffer.filter(event => 
      event.playbackTimestamp >= startTime && event.playbackTimestamp <= endTime
    );
  }

  getEventsByLayer(layer: string): RealTimeEvent[] {
    return this.eventBuffer.filter(event => event.layer === layer);
  }

  getEventsByType(type: string): RealTimeEvent[] {
    return this.eventBuffer.filter(event => event.type === type);
  }

  // Layer State Management
  updateLayerState(layer: string, state: any): void {
    this.layerStates.set(layer, {
      ...this.layerStates.get(layer),
      ...state,
      lastUpdated: Date.now()
    });

    this.addEvent({
      timestamp: Date.now(),
      type: 'state_change',
      layer,
      direction: 'BIDIRECTIONAL',
      data: state,
      originalTimestamp: Date.now()
    });

    this.emit('layer_state_updated', { layer, state });
  }

  getLayerState(layer: string): any {
    return this.layerStates.get(layer);
  }

  getAllLayerStates(): Map<string, any> {
    return new Map(this.layerStates);
  }

  // Metrics and Statistics
  getMetrics(): RealTimeMetrics {
    return { ...this.metrics };
  }

  private updateMetrics(): void {
    const now = Date.now();
    const timeWindow = 1000; // 1 second window
    const recentEvents = this.eventBuffer.filter(
      event => now - event.playbackTimestamp < timeWindow
    );

    // Calculate messages per second
    this.metrics.messagesPerSecond = recentEvents.length;

    // Calculate average latency
    const latencyEvents = recentEvents.filter(event => event.type === 'message');
    if (latencyEvents.length > 0) {
      const totalLatency = latencyEvents.reduce(
        (sum, event) => sum + (event.playbackTimestamp - event.originalTimestamp), 0
      );
      this.metrics.averageLatency = totalLatency / latencyEvents.length;
    }

    // Calculate throughput (events per second)
    this.metrics.throughput = recentEvents.length;

    // Calculate error rate
    const errorEvents = recentEvents.filter(event => event.type === 'error');
    this.metrics.errorRate = recentEvents.length > 0 
      ? (errorEvents.length / recentEvents.length) * 100 
      : 0;

    // Calculate layer activity
    this.metrics.layerActivity = {};
    recentEvents.forEach(event => {
      this.metrics.layerActivity[event.layer] = 
        (this.metrics.layerActivity[event.layer] || 0) + 1;
    });

    // Calculate time sync accuracy
    if (this.config.enableTimeSync) {
      this.metrics.timeSyncAccuracy = this.calculateTimeSyncAccuracy();
    }

    this.emit('metrics_updated', { metrics: this.metrics });
  }

  private calculateTimeSyncAccuracy(): number {
    // Calculate how well the playback time matches the original time
    const now = Date.now();
    const expectedTime = this.startTime + (now - this.playbackStartTime) * this.timeAcceleration;
    const actualTime = now;
    const timeDiff = Math.abs(expectedTime - actualTime);
    
    // Return accuracy as percentage (100% = perfect sync)
    return Math.max(0, 100 - (timeDiff / 1000) * 10); // 10% penalty per second of drift
  }

  // Configuration Management
  updateConfig(newConfig: Partial<RealTimeConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.emit('config_updated', { config: this.config });
  }

  getConfig(): RealTimeConfig {
    return { ...this.config };
  }

  // Private Methods
  private setupSimulatorListeners(): void {
    this.simulator.on('step_started', (data) => {
      this.addEvent({
        timestamp: Date.now(),
        type: 'message',
        layer: data.step.layer || 'UNKNOWN',
        direction: data.step.direction || 'BIDIRECTIONAL',
        data: {
          message: data.step.message,
          parameters: data.step.parameters
        },
        originalTimestamp: Date.now()
      });
    });

    this.simulator.on('step_completed', (data) => {
      this.addEvent({
        timestamp: Date.now(),
        type: 'metric_update',
        layer: data.step.layer || 'UNKNOWN',
        direction: 'BIDIRECTIONAL',
        data: {
          result: data.result,
          metrics: data.result.metrics,
          duration: data.duration
        },
        originalTimestamp: Date.now()
      });

      // Update layer state
      if (data.result.metrics) {
        this.updateLayerState(data.step.layer, data.result.metrics);
      }
    });

    this.simulator.on('step_failed', (data) => {
      this.addEvent({
        timestamp: Date.now(),
        type: 'error',
        layer: data.step.layer || 'UNKNOWN',
        direction: 'BIDIRECTIONAL',
        data: {
          error: data.error,
          step: data.step.name
        },
        originalTimestamp: Date.now()
      });
    });
  }

  private initializeLayerStates(testCase: TestCase): void {
    if (testCase.layers) {
      Object.keys(testCase.layers).forEach(layerName => {
        this.layerStates.set(layerName, {
          ...testCase.layers[layerName],
          status: 'idle',
          lastUpdated: Date.now()
        });
      });
    }
  }

  private startUpdateLoop(): void {
    this.updateInterval = setInterval(() => {
      if (!this.isPaused) {
        this.processMessageQueue();
        this.updateMetrics();
      }
    }, this.config.updateInterval);
  }

  private stopUpdateLoop(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  private processMessageQueue(): void {
    const now = Date.now();
    const eventsToProcess = this.messageQueue.filter(
      event => event.playbackTimestamp <= now
    );

    eventsToProcess.forEach(event => {
      this.emit('event_processed', { event });
    });

    // Remove processed events
    this.messageQueue = this.messageQueue.filter(
      event => event.playbackTimestamp > now
    );
  }

  private calculatePlaybackTimestamp(originalTimestamp: number): number {
    if (!this.isRunning) {
      return originalTimestamp;
    }

    const elapsed = originalTimestamp - this.startTime;
    return this.playbackStartTime + (elapsed / this.timeAcceleration);
  }

  private getElapsedTime(): number {
    if (!this.isRunning) {
      return 0;
    }

    return Date.now() - this.startTime;
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  // Public Getters
  get isRealTimeRunning(): boolean {
    return this.isRunning;
  }

  get isRealTimePaused(): boolean {
    return this.isPaused;
  }

  get currentTestCase(): TestCase | null {
    return this.currentTestCase;
  }

  get currentExecution(): TestCaseExecution | null {
    return this.currentExecution;
  }

  get eventBufferSize(): number {
    return this.eventBuffer.length;
  }

  get messageQueueSize(): number {
    return this.messageQueue.length;
  }
}
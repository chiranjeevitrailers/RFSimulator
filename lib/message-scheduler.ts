import { createClient } from './supabase';

export interface ScheduledMessage {
  id: string;
  timestamp: number;
  layer: string;
  message_type: string;
  message_name: string;
  direction: 'UL' | 'DL' | 'BIDIRECTIONAL';
  decoded_data: any;
  information_elements: any[];
  validation_status: 'valid' | 'invalid' | 'warning';
  processing_time_ms: number;
  scheduled_time: number;
  priority: number;
  dependencies: string[];
  retry_count: number;
  max_retries: number;
}

export interface SchedulingConfig {
  timeWindow: number; // milliseconds
  maxConcurrentMessages: number;
  retryDelay: number; // milliseconds
  priorityWeights: Record<string, number>;
  layerPriorities: Record<string, number>;
  messageTypePriorities: Record<string, number>;
}

export interface SchedulingMetrics {
  totalScheduled: number;
  totalProcessed: number;
  totalFailed: number;
  averageLatency: number;
  throughput: number;
  queueSize: number;
  processingRate: number;
  errorRate: number;
}

export class MessageScheduler {
  private supabase = createClient();
  private messageQueue: ScheduledMessage[] = [];
  private processingQueue: ScheduledMessage[] = [];
  private completedMessages: ScheduledMessage[] = [];
  private failedMessages: ScheduledMessage[] = [];
  private config: SchedulingConfig;
  private metrics: SchedulingMetrics;
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;
  private callbacks: {
    onMessageScheduled: ((message: ScheduledMessage) => void)[];
    onMessageProcessed: ((message: ScheduledMessage) => void)[];
    onMessageFailed: ((message: ScheduledMessage, error: Error) => void)[];
    onMetricsUpdate: ((metrics: SchedulingMetrics) => void)[];
    onQueueUpdate: ((queueSize: number) => void)[];
  };

  constructor(config?: Partial<SchedulingConfig>) {
    this.config = {
      timeWindow: 1000, // 1 second
      maxConcurrentMessages: 10,
      retryDelay: 100,
      priorityWeights: {
        timestamp: 0.4,
        layer: 0.3,
        messageType: 0.2,
        dependencies: 0.1,
      },
      layerPriorities: {
        PHY: 1,
        MAC: 2,
        RLC: 3,
        PDCP: 4,
        RRC: 5,
        NAS: 6,
        IMS: 7,
      },
      messageTypePriorities: {
        'RRCSetupRequest': 1,
        'RRCSetupResponse': 1,
        'RRCReconfiguration': 2,
        'RRCRelease': 3,
        'NASAttachRequest': 1,
        'NASAttachAccept': 1,
        'NASDetachRequest': 2,
        'NASDetachAccept': 2,
      },
    };

    // Merge with provided config
    if (config) {
      this.config = { ...this.config, ...config };
    }

    this.metrics = {
      totalScheduled: 0,
      totalProcessed: 0,
      totalFailed: 0,
      averageLatency: 0,
      throughput: 0,
      queueSize: 0,
      processingRate: 0,
      errorRate: 0,
    };

    this.callbacks = {
      onMessageScheduled: [],
      onMessageProcessed: [],
      onMessageFailed: [],
      onMetricsUpdate: [],
      onQueueUpdate: [],
    };
  }

  /**
   * Initialize scheduler with test case messages
   */
  async initialize(testCaseId: string): Promise<void> {
    try {
      // Fetch test case messages
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

      // Convert to scheduled messages
      const scheduledMessages: ScheduledMessage[] = messages.map((msg, index) => ({
        id: msg.id,
        timestamp: msg.timestamp_ms,
        layer: msg.layer,
        message_type: msg.message_type,
        message_name: msg.message_name,
        direction: msg.direction,
        decoded_data: msg.decoded_data || {},
        information_elements: msg.test_case_information_elements || [],
        validation_status: 'valid' as const,
        processing_time_ms: Math.random() * 10 + 1,
        scheduled_time: msg.timestamp_ms,
        priority: this.calculatePriority(msg),
        dependencies: this.calculateDependencies(msg, messages, index),
        retry_count: 0,
        max_retries: 3,
      }));

      // Sort by priority and timestamp
      this.messageQueue = scheduledMessages.sort((a, b) => {
        if (a.priority !== b.priority) {
          return a.priority - b.priority;
        }
        return a.timestamp - b.timestamp;
      });

      this.metrics.totalScheduled = this.messageQueue.length;
      this.metrics.queueSize = this.messageQueue.length;
      this.updateMetrics();

      console.log(`Scheduler initialized with ${this.messageQueue.length} messages`);
    } catch (error) {
      console.error('Failed to initialize scheduler:', error);
      throw error;
    }
  }

  /**
   * Start the scheduler
   */
  start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.intervalId = setInterval(() => {
      this.processQueue();
    }, this.config.timeWindow / 10); // Process 10 times per time window

    console.log('Message scheduler started');
  }

  /**
   * Stop the scheduler
   */
  stop(): void {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    console.log('Message scheduler stopped');
  }

  /**
   * Pause the scheduler
   */
  pause(): void {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    console.log('Message scheduler paused');
  }

  /**
   * Resume the scheduler
   */
  resume(): void {
    if (this.isRunning) return;
    this.start();
  }

  /**
   * Get current metrics
   */
  getMetrics(): SchedulingMetrics {
    return { ...this.metrics };
  }

  /**
   * Get queue status
   */
  getQueueStatus(): {
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  } {
    return {
      pending: this.messageQueue.length,
      processing: this.processingQueue.length,
      completed: this.completedMessages.length,
      failed: this.failedMessages.length,
    };
  }

  /**
   * Add event listeners
   */
  on(event: 'scheduled' | 'processed' | 'failed' | 'metrics' | 'queue', callback: Function): void {
    this.callbacks[`onMessage${event.charAt(0).toUpperCase() + event.slice(1)}` as keyof typeof this.callbacks].push(callback);
  }

  /**
   * Remove event listeners
   */
  off(event: 'scheduled' | 'processed' | 'failed' | 'metrics' | 'queue', callback: Function): void {
    const callbacks = this.callbacks[`onMessage${event.charAt(0).toUpperCase() + event.slice(1)}` as keyof typeof this.callbacks];
    const index = callbacks.indexOf(callback);
    if (index > -1) callbacks.splice(index, 1);
  }

  /**
   * Process the message queue
   */
  private processQueue(): void {
    if (!this.isRunning) return;

    const currentTime = Date.now();
    const timeWindowStart = currentTime - this.config.timeWindow;

    // Move messages from queue to processing queue
    while (
      this.messageQueue.length > 0 &&
      this.processingQueue.length < this.config.maxConcurrentMessages &&
      this.messageQueue[0].scheduled_time <= currentTime
    ) {
      const message = this.messageQueue.shift()!;
      
      // Check dependencies
      if (this.areDependenciesMet(message)) {
        this.processingQueue.push(message);
        this.emitMessageScheduled(message);
      } else {
        // Re-queue message if dependencies not met
        this.messageQueue.push(message);
        break;
      }
    }

    // Process messages in processing queue
    this.processingQueue.forEach((message, index) => {
      if (this.shouldProcessMessage(message, currentTime)) {
        this.processMessage(message);
        this.processingQueue.splice(index, 1);
      }
    });

    this.updateMetrics();
  }

  /**
   * Process a single message
   */
  private async processMessage(message: ScheduledMessage): Promise<void> {
    try {
      // Simulate message processing
      await this.simulateMessageProcessing(message);
      
      // Mark as completed
      this.completedMessages.push(message);
      this.emitMessageProcessed(message);
      
    } catch (error) {
      // Handle retry logic
      if (message.retry_count < message.max_retries) {
        message.retry_count++;
        message.scheduled_time = Date.now() + this.config.retryDelay;
        this.messageQueue.push(message);
        this.messageQueue.sort((a, b) => a.scheduled_time - b.scheduled_time);
      } else {
        this.failedMessages.push(message);
        this.emitMessageFailed(message, error as Error);
      }
    }
  }

  /**
   * Simulate message processing
   */
  private async simulateMessageProcessing(message: ScheduledMessage): Promise<void> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, message.processing_time_ms));
    
    // Simulate occasional failures
    if (Math.random() < 0.05) { // 5% failure rate
      throw new Error(`Simulated processing failure for message ${message.id}`);
    }
  }

  /**
   * Check if message dependencies are met
   */
  private areDependenciesMet(message: ScheduledMessage): boolean {
    if (message.dependencies.length === 0) return true;
    
    return message.dependencies.every(depId => 
      this.completedMessages.some(completed => completed.id === depId)
    );
  }

  /**
   * Check if message should be processed
   */
  private shouldProcessMessage(message: ScheduledMessage, currentTime: number): boolean {
    return message.scheduled_time <= currentTime;
  }

  /**
   * Calculate message priority
   */
  private calculatePriority(message: any): number {
    let priority = 0;
    
    // Layer priority
    priority += (this.config.layerPriorities[message.layer] || 5) * this.config.priorityWeights.layer;
    
    // Message type priority
    priority += (this.config.messageTypePriorities[message.message_type] || 5) * this.config.priorityWeights.messageType;
    
    // Timestamp priority (earlier messages have higher priority)
    priority += (1 / (message.timestamp_ms + 1)) * this.config.priorityWeights.timestamp;
    
    return priority;
  }

  /**
   * Calculate message dependencies
   */
  private calculateDependencies(message: any, allMessages: any[], currentIndex: number): string[] {
    const dependencies: string[] = [];
    
    // Simple dependency logic: messages from the same layer that come before this message
    for (let i = 0; i < currentIndex; i++) {
      const prevMessage = allMessages[i];
      if (prevMessage.layer === message.layer && 
          prevMessage.timestamp_ms < message.timestamp_ms &&
          Math.abs(prevMessage.timestamp_ms - message.timestamp_ms) < 1000) { // Within 1 second
        dependencies.push(prevMessage.id);
      }
    }
    
    return dependencies;
  }

  /**
   * Update metrics
   */
  private updateMetrics(): void {
    const totalMessages = this.metrics.totalScheduled;
    const processedMessages = this.completedMessages.length;
    const failedMessages = this.failedMessages.length;
    
    this.metrics = {
      totalScheduled: totalMessages,
      totalProcessed: processedMessages,
      totalFailed: failedMessages,
      averageLatency: this.calculateAverageLatency(),
      throughput: this.calculateThroughput(),
      queueSize: this.messageQueue.length,
      processingRate: this.calculateProcessingRate(),
      errorRate: totalMessages > 0 ? (failedMessages / totalMessages) * 100 : 0,
    };

    this.emitMetricsUpdate();
    this.emitQueueUpdate();
  }

  /**
   * Calculate average latency
   */
  private calculateAverageLatency(): number {
    if (this.completedMessages.length === 0) return 0;
    
    const totalLatency = this.completedMessages.reduce((sum, msg) => 
      sum + msg.processing_time_ms, 0);
    
    return totalLatency / this.completedMessages.length;
  }

  /**
   * Calculate throughput
   */
  private calculateThroughput(): number {
    const timeElapsed = Date.now() - (this.completedMessages[0]?.scheduled_time || Date.now());
    if (timeElapsed === 0) return 0;
    
    return (this.completedMessages.length / timeElapsed) * 1000; // messages per second
  }

  /**
   * Calculate processing rate
   */
  private calculateProcessingRate(): number {
    const totalMessages = this.metrics.totalScheduled;
    if (totalMessages === 0) return 0;
    
    return (this.completedMessages.length / totalMessages) * 100;
  }

  /**
   * Emit events
   */
  private emitMessageScheduled(message: ScheduledMessage): void {
    this.callbacks.onMessageScheduled.forEach(callback => callback(message));
  }

  private emitMessageProcessed(message: ScheduledMessage): void {
    this.callbacks.onMessageProcessed.forEach(callback => callback(message));
  }

  private emitMessageFailed(message: ScheduledMessage, error: Error): void {
    this.callbacks.onMessageFailed.forEach(callback => callback(message, error));
  }

  private emitMetricsUpdate(): void {
    this.callbacks.onMetricsUpdate.forEach(callback => callback(this.metrics));
  }

  private emitQueueUpdate(): void {
    this.callbacks.onQueueUpdate.forEach(callback => callback(this.messageQueue.length));
  }
}

export default MessageScheduler;
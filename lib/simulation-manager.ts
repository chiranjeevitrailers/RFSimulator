import { ProtocolSimulator, SimulationResult, SimulationContext } from './protocol-simulator';
import { TestCase, TestCaseExecution, TestCaseService } from './test-cases';

export interface SimulationSession {
  id: string;
  testCase: TestCase;
  execution: TestCaseExecution;
  simulator: ProtocolSimulator;
  startTime: number;
  endTime?: number;
  status: 'pending' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';
  result?: SimulationResult;
  error?: string;
}

export interface SimulationConfig {
  maxConcurrentSimulations: number;
  defaultTimeout: number;
  retryAttempts: number;
  enableRealTimeUpdates: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  performanceMonitoring: boolean;
}

export interface SimulationMetrics {
  totalSimulations: number;
  successfulSimulations: number;
  failedSimulations: number;
  averageExecutionTime: number;
  successRate: number;
  activeSimulations: number;
  queuedSimulations: number;
}

export class SimulationManager {
  private sessions: Map<string, SimulationSession> = new Map();
  private config: SimulationConfig;
  private eventListeners: Map<string, Function[]> = new Map();
  private metrics: SimulationMetrics;
  private isInitialized = false;

  constructor(config?: Partial<SimulationConfig>) {
    this.config = {
      maxConcurrentSimulations: 5,
      defaultTimeout: 300000, // 5 minutes
      retryAttempts: 3,
      enableRealTimeUpdates: true,
      logLevel: 'info',
      performanceMonitoring: true,
      ...config
    };

    this.metrics = {
      totalSimulations: 0,
      successfulSimulations: 0,
      failedSimulations: 0,
      averageExecutionTime: 0,
      successRate: 0,
      activeSimulations: 0,
      queuedSimulations: 0
    };

    this.initialize();
  }

  private async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Setup periodic metrics update
      setInterval(() => {
        this.updateMetrics();
      }, 5000);

      // Setup cleanup for completed sessions
      setInterval(() => {
        this.cleanupCompletedSessions();
      }, 60000); // Every minute

      this.isInitialized = true;
      this.emit('manager_initialized', { config: this.config });
    } catch (error) {
      this.emit('manager_error', { error });
      throw error;
    }
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
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  // Main Simulation Management Methods
  async startSimulation(testCase: TestCase, userId: string): Promise<SimulationSession> {
    await this.initialize();

    // Check if we can start a new simulation
    if (this.getActiveSimulations().length >= this.config.maxConcurrentSimulations) {
      throw new Error('Maximum concurrent simulations reached');
    }

    // Create test case execution
    const execution = await TestCaseService.createExecution(testCase.id, userId);

    // Create simulation session
    const sessionId = this.generateSessionId();
    const simulator = new ProtocolSimulator();
    const session: SimulationSession = {
      id: sessionId,
      testCase,
      execution,
      simulator,
      startTime: Date.now(),
      status: 'pending'
    };

    this.sessions.set(sessionId, session);
    this.metrics.totalSimulations++;
    this.metrics.activeSimulations++;

    this.emit('simulation_created', { session });

    try {
      // Setup simulator event listeners
      this.setupSimulatorListeners(session);

      // Start the simulation
      session.status = 'running';
      this.emit('simulation_started', { session });

      const result = await simulator.startSimulation(testCase, execution);
      
      session.status = 'completed';
      session.endTime = Date.now();
      session.result = result;

      this.metrics.successfulSimulations++;
      this.emit('simulation_completed', { session, result });

      // Update execution in database
      await TestCaseService.updateExecution(execution.id, {
        status: 'completed',
        end_time: new Date(session.endTime).toISOString(),
        duration_ms: session.endTime - session.startTime,
        progress_percentage: 100,
        results: result
      });

      return session;
    } catch (error) {
      session.status = 'failed';
      session.endTime = Date.now();
      session.error = error instanceof Error ? error.message : 'Unknown error';

      this.metrics.failedSimulations++;
      this.emit('simulation_failed', { session, error });

      // Update execution in database
      await TestCaseService.updateExecution(execution.id, {
        status: 'failed',
        end_time: new Date(session.endTime).toISOString(),
        duration_ms: session.endTime - session.startTime,
        errors: { error: session.error }
      });

      throw error;
    } finally {
      this.metrics.activeSimulations--;
      this.updateMetrics();
    }
  }

  async pauseSimulation(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Simulation session not found');
    }

    if (session.status !== 'running') {
      throw new Error('Simulation is not running');
    }

    await session.simulator.stopSimulation();
    session.status = 'paused';
    
    this.emit('simulation_paused', { session });
  }

  async resumeSimulation(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Simulation session not found');
    }

    if (session.status !== 'paused') {
      throw new Error('Simulation is not paused');
    }

    // Note: Resuming a simulation requires restarting from the beginning
    // In a real implementation, you might want to save/restore state
    session.status = 'running';
    this.emit('simulation_resumed', { session });
  }

  async stopSimulation(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Simulation session not found');
    }

    if (session.status === 'running' || session.status === 'paused') {
      await session.simulator.stopSimulation();
      session.status = 'cancelled';
      session.endTime = Date.now();

      this.emit('simulation_cancelled', { session });

      // Update execution in database
      await TestCaseService.updateExecution(session.execution.id, {
        status: 'cancelled',
        end_time: new Date(session.endTime).toISOString(),
        duration_ms: session.endTime - session.startTime
      });
    }
  }

  async cancelSimulation(sessionId: string): Promise<void> {
    await this.stopSimulation(sessionId);
  }

  // Session Management
  getSession(sessionId: string): SimulationSession | undefined {
    return this.sessions.get(sessionId);
  }

  getAllSessions(): SimulationSession[] {
    return Array.from(this.sessions.values());
  }

  getActiveSimulations(): SimulationSession[] {
    return Array.from(this.sessions.values()).filter(
      session => session.status === 'running' || session.status === 'paused'
    );
  }

  getCompletedSimulations(): SimulationSession[] {
    return Array.from(this.sessions.values()).filter(
      session => session.status === 'completed' || session.status === 'failed'
    );
  }

  getUserSessions(userId: string): SimulationSession[] {
    return Array.from(this.sessions.values()).filter(
      session => session.execution.user_id === userId
    );
  }

  // Metrics and Statistics
  getMetrics(): SimulationMetrics {
    return { ...this.metrics };
  }

  private updateMetrics(): void {
    const sessions = Array.from(this.sessions.values());
    const completedSessions = sessions.filter(
      s => s.status === 'completed' || s.status === 'failed'
    );

    this.metrics.activeSimulations = sessions.filter(
      s => s.status === 'running' || s.status === 'paused'
    ).length;

    this.metrics.queuedSimulations = sessions.filter(
      s => s.status === 'pending'
    ).length;

    if (completedSessions.length > 0) {
      const totalTime = completedSessions.reduce(
        (sum, session) => sum + (session.endTime! - session.startTime), 0
      );
      this.metrics.averageExecutionTime = totalTime / completedSessions.length;
    }

    this.metrics.successRate = this.metrics.totalSimulations > 0
      ? (this.metrics.successfulSimulations / this.metrics.totalSimulations) * 100
      : 0;

    this.emit('metrics_updated', { metrics: this.metrics });
  }

  // Configuration Management
  updateConfig(newConfig: Partial<SimulationConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.emit('config_updated', { config: this.config });
  }

  getConfig(): SimulationConfig {
    return { ...this.config };
  }

  // Cleanup and Maintenance
  private cleanupCompletedSessions(): void {
    const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago
    const sessionsToRemove: string[] = [];

    this.sessions.forEach((session, sessionId) => {
      if (
        (session.status === 'completed' || session.status === 'failed' || session.status === 'cancelled') &&
        session.endTime && session.endTime < cutoffTime
      ) {
        sessionsToRemove.push(sessionId);
      }
    });

    sessionsToRemove.forEach(sessionId => {
      this.sessions.delete(sessionId);
    });

    if (sessionsToRemove.length > 0) {
      this.emit('sessions_cleaned_up', { count: sessionsToRemove.length });
    }
  }

  // Utility Methods
  private generateSessionId(): string {
    return `sim_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private setupSimulatorListeners(session: SimulationSession): void {
    const simulator = session.simulator;

    simulator.on('simulation_started', (data) => {
      this.emit('simulation_progress', { sessionId: session.id, event: 'started', data });
    });

    simulator.on('simulation_completed', (data) => {
      this.emit('simulation_progress', { sessionId: session.id, event: 'completed', data });
    });

    simulator.on('simulation_failed', (data) => {
      this.emit('simulation_progress', { sessionId: session.id, event: 'failed', data });
    });

    simulator.on('simulation_progress', (data) => {
      this.emit('simulation_progress', { sessionId: session.id, event: 'progress', data });
    });

    simulator.on('step_started', (data) => {
      this.emit('simulation_progress', { sessionId: session.id, event: 'step_started', data });
    });

    simulator.on('step_completed', (data) => {
      this.emit('simulation_progress', { sessionId: session.id, event: 'step_completed', data });
    });

    simulator.on('step_failed', (data) => {
      this.emit('simulation_progress', { sessionId: session.id, event: 'step_failed', data });
    });
  }

  // Batch Operations
  async startBatchSimulations(testCases: TestCase[], userId: string): Promise<SimulationSession[]> {
    const sessions: SimulationSession[] = [];

    for (const testCase of testCases) {
      try {
        const session = await this.startSimulation(testCase, userId);
        sessions.push(session);
      } catch (error) {
        console.error(`Failed to start simulation for test case ${testCase.id}:`, error);
      }
    }

    return sessions;
  }

  async stopAllUserSimulations(userId: string): Promise<void> {
    const userSessions = this.getUserSessions(userId);
    const activeSessions = userSessions.filter(
      session => session.status === 'running' || session.status === 'paused'
    );

    await Promise.all(
      activeSessions.map(session => this.stopSimulation(session.id))
    );
  }

  // Health Check
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    details: any;
  }> {
    try {
      const activeSimulations = this.getActiveSimulations().length;
      const totalSessions = this.sessions.size;
      const successRate = this.metrics.successRate;

      let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

      if (activeSimulations >= this.config.maxConcurrentSimulations) {
        status = 'degraded';
      }

      if (successRate < 80 && this.metrics.totalSimulations > 10) {
        status = 'degraded';
      }

      if (activeSimulations > this.config.maxConcurrentSimulations * 1.5) {
        status = 'unhealthy';
      }

      return {
        status,
        details: {
          activeSimulations,
          totalSessions,
          successRate,
          config: this.config,
          metrics: this.metrics
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: { error: error instanceof Error ? error.message : 'Unknown error' }
      };
    }
  }
}
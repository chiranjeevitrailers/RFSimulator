import { supabase } from './supabase';

export interface DisasterRecoveryScenario {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'hardware' | 'software' | 'network' | 'data' | 'security' | 'natural';
  probability: number; // 0-100
  impact: {
    rto: number; // Recovery Time Objective in minutes
    rpo: number; // Recovery Point Objective in minutes
    cost: number; // Estimated cost in USD
    affectedUsers: number;
    affectedServices: string[];
  };
  triggers: Array<{
    type: 'metric' | 'event' | 'manual' | 'schedule';
    condition: string;
    threshold?: number;
    description: string;
  }>;
  response: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
    communication: {
      internal: string[];
      external: string[];
      customers: string[];
    };
  };
  testing: {
    frequency: 'monthly' | 'quarterly' | 'annually';
    lastTest?: Date;
    nextTest?: Date;
  };
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DisasterRecoveryTest {
  id: string;
  scenarioId: string;
  name: string;
  type: 'tabletop' | 'simulation' | 'full' | 'partial';
  status: 'planned' | 'running' | 'completed' | 'failed' | 'cancelled';
  scheduledAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  duration?: number; // minutes
  participants: Array<{
    name: string;
    role: string;
    email: string;
    phone: string;
    attended: boolean;
  }>;
  objectives: string[];
  results: {
    objectivesMet: boolean;
    rtoAchieved: boolean;
    rpoAchieved: boolean;
    issuesFound: string[];
    improvements: string[];
    lessonsLearned: string[];
    overallScore: number; // 0-100
  };
  createdAt: Date;
  updatedAt: Date;
}

export class DisasterRecoveryManager {
  private static instance: DisasterRecoveryManager;
  private scenarios: DisasterRecoveryScenario[] = [];
  private tests: DisasterRecoveryTest[] = [];
  private isInitialized = false;

  private constructor() {
    this.initializeDefaultScenarios();
  }

  public static getInstance(): DisasterRecoveryManager {
    if (!DisasterRecoveryManager.instance) {
      DisasterRecoveryManager.instance = new DisasterRecoveryManager();
    }
    return DisasterRecoveryManager.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await this.loadScenarios();
      await this.loadTests();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize DisasterRecoveryManager:', error);
    }
  }

  // Scenario Management
  public async createScenario(scenario: Omit<DisasterRecoveryScenario, 'id' | 'createdAt' | 'updatedAt'>): Promise<DisasterRecoveryScenario> {
    const disasterRecoveryScenario: DisasterRecoveryScenario = {
      id: this.generateId(),
      ...scenario,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.scenarios.push(disasterRecoveryScenario);
    await this.storeScenario(disasterRecoveryScenario);
    return disasterRecoveryScenario;
  }

  public getScenarios(): DisasterRecoveryScenario[] {
    return [...this.scenarios];
  }

  public getScenario(id: string): DisasterRecoveryScenario | null {
    return this.scenarios.find(scenario => scenario.id === id) || null;
  }

  // Test Management
  public async createTest(test: Omit<DisasterRecoveryTest, 'id' | 'createdAt' | 'updatedAt'>): Promise<DisasterRecoveryTest> {
    const disasterRecoveryTest: DisasterRecoveryTest = {
      id: this.generateId(),
      ...test,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.tests.push(disasterRecoveryTest);
    await this.storeTest(disasterRecoveryTest);
    return disasterRecoveryTest;
  }

  public getTests(): DisasterRecoveryTest[] {
    return [...this.tests];
  }

  public getTest(id: string): DisasterRecoveryTest | null {
    return this.tests.find(test => test.id === id) || null;
  }

  // Risk Assessment
  public async performRiskAssessment(): Promise<any> {
    const assessment = {
      timestamp: new Date(),
      scenarios: this.scenarios.map(scenario => ({
        id: scenario.id,
        name: scenario.name,
        category: scenario.category,
        severity: scenario.severity,
        probability: scenario.probability,
        impact: scenario.impact,
        riskScore: this.calculateRiskScore(scenario)
      })),
      overallRisk: this.calculateOverallRisk(),
      topRisks: this.getTopRisks()
    };

    return assessment;
  }

  private calculateRiskScore(scenario: DisasterRecoveryScenario): number {
    const probabilityScore = scenario.probability / 100;
    const impactScore = Math.min(scenario.impact.rto / 60, 1);
    return Math.round(probabilityScore * impactScore * 100);
  }

  private calculateOverallRisk(): number {
    if (this.scenarios.length === 0) return 0;
    const totalRiskScore = this.scenarios.reduce((sum, scenario) => {
      return sum + this.calculateRiskScore(scenario);
    }, 0);
    return Math.round(totalRiskScore / this.scenarios.length);
  }

  private getTopRisks(): DisasterRecoveryScenario[] {
    return this.scenarios
      .sort((a, b) => this.calculateRiskScore(b) - this.calculateRiskScore(a))
      .slice(0, 5);
  }

  // Database Operations
  private async loadScenarios(): Promise<void> {
    try {
      const { data, error } = await supabase.from('disaster_recovery_scenarios').select('*');
      if (error) throw error;
      this.scenarios = data || [];
    } catch (error) {
      console.error('Failed to load scenarios:', error);
    }
  }

  private async loadTests(): Promise<void> {
    try {
      const { data, error } = await supabase.from('disaster_recovery_tests').select('*');
      if (error) throw error;
      this.tests = data || [];
    } catch (error) {
      console.error('Failed to load tests:', error);
    }
  }

  private async storeScenario(scenario: DisasterRecoveryScenario): Promise<void> {
    try {
      await supabase.from('disaster_recovery_scenarios').upsert({
        id: scenario.id,
        name: scenario.name,
        description: scenario.description,
        severity: scenario.severity,
        category: scenario.category,
        probability: scenario.probability,
        impact: scenario.impact,
        triggers: scenario.triggers,
        response: scenario.response,
        testing: scenario.testing,
        enabled: scenario.enabled,
        created_at: scenario.createdAt.toISOString(),
        updated_at: scenario.updatedAt.toISOString()
      });
    } catch (error) {
      console.error('Failed to store scenario:', error);
    }
  }

  private async storeTest(test: DisasterRecoveryTest): Promise<void> {
    try {
      await supabase.from('disaster_recovery_tests').upsert({
        id: test.id,
        scenario_id: test.scenarioId,
        name: test.name,
        type: test.type,
        status: test.status,
        scheduled_at: test.scheduledAt.toISOString(),
        started_at: test.startedAt?.toISOString(),
        completed_at: test.completedAt?.toISOString(),
        duration: test.duration,
        participants: test.participants,
        objectives: test.objectives,
        results: test.results,
        created_at: test.createdAt.toISOString(),
        updated_at: test.updatedAt.toISOString()
      });
    } catch (error) {
      console.error('Failed to store test:', error);
    }
  }

  private generateId(): string {
    return 'dr_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // Default Initializations
  private initializeDefaultScenarios(): void {
    this.scenarios = [
      {
        id: 'server_failure',
        name: 'Server Hardware Failure',
        description: 'Critical server hardware failure affecting primary services',
        severity: 'high',
        category: 'hardware',
        probability: 30,
        impact: {
          rto: 120,
          rpo: 15,
          cost: 50000,
          affectedUsers: 500,
          affectedServices: ['web', 'api', 'database']
        },
        triggers: [
          {
            type: 'metric',
            condition: 'cpu_temperature > 80',
            threshold: 80,
            description: 'CPU temperature exceeds safe operating limits'
          }
        ],
        response: {
          immediate: ['Activate incident response team', 'Assess scope of failure'],
          shortTerm: ['Restore services on backup hardware', 'Verify data integrity'],
          longTerm: ['Replace failed hardware', 'Update monitoring systems'],
          communication: {
            internal: ['IT team', 'Management'],
            external: ['Vendors'],
            customers: ['Service status page']
          }
        },
        testing: {
          frequency: 'quarterly',
          nextTest: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        },
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }
}
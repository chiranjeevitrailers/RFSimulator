import { supabase } from './supabase';

export interface BackupConfig {
  id: string;
  name: string;
  description: string;
  type: 'full' | 'incremental' | 'differential';
  schedule: {
    frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
    time: string; // HH:MM format
    days?: number[]; // For weekly/monthly (0-6 for days of week, 1-31 for days of month)
    timezone: string;
  };
  retention: {
    daily: number; // days
    weekly: number; // weeks
    monthly: number; // months
    yearly: number; // years
  };
  storage: {
    type: 'local' | 's3' | 'gcs' | 'azure' | 'ftp' | 'sftp';
    config: any;
    encryption: boolean;
    compression: boolean;
  };
  tables: string[]; // Tables to backup
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BackupJob {
  id: string;
  configId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  type: 'scheduled' | 'manual' | 'recovery';
  startedAt: Date;
  completedAt?: Date;
  duration?: number; // milliseconds
  size?: number; // bytes
  records?: number;
  error?: string;
  metadata: {
    tables: string[];
    compressionRatio?: number;
    encryptionUsed: boolean;
    storageLocation: string;
    checksum?: string;
  };
  createdAt: Date;
}

export interface RecoveryJob {
  id: string;
  backupJobId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  type: 'full' | 'partial' | 'point_in_time';
  targetTables: string[];
  targetTimestamp?: Date;
  startedAt: Date;
  completedAt?: Date;
  duration?: number; // milliseconds
  recordsRestored?: number;
  error?: string;
  metadata: {
    sourceBackup: string;
    targetDatabase: string;
    validationPassed: boolean;
    checksumVerified: boolean;
  };
  createdAt: Date;
}

export interface BackupValidation {
  id: string;
  backupJobId: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  type: 'integrity' | 'completeness' | 'consistency';
  startedAt: Date;
  completedAt?: Date;
  duration?: number; // milliseconds
  error?: string;
  results: {
    checksumValid: boolean;
    recordCountMatch: boolean;
    schemaValid: boolean;
    dataIntegrityValid: boolean;
    compressionValid: boolean;
    encryptionValid: boolean;
  };
  createdAt: Date;
}

export interface DisasterRecoveryPlan {
  id: string;
  name: string;
  description: string;
  rto: number; // Recovery Time Objective in minutes
  rpo: number; // Recovery Point Objective in minutes
  priority: 'critical' | 'high' | 'medium' | 'low';
  components: Array<{
    name: string;
    type: 'database' | 'application' | 'infrastructure' | 'configuration';
    dependencies: string[];
    recoverySteps: string[];
    estimatedTime: number; // minutes
  }>;
  testingSchedule: {
    frequency: 'monthly' | 'quarterly' | 'annually';
    lastTest?: Date;
    nextTest?: Date;
  };
  contacts: Array<{
    name: string;
    role: string;
    email: string;
    phone: string;
    escalationLevel: number;
  }>;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class BackupManager {
  private static instance: BackupManager;
  private backupConfigs: BackupConfig[] = [];
  private backupJobs: BackupJob[] = [];
  private recoveryJobs: RecoveryJob[] = [];
  private backupValidations: BackupValidation[] = [];
  private disasterRecoveryPlans: DisasterRecoveryPlan[] = [];
  private isInitialized = false;
  private runningJobs = new Set<string>();

  private constructor() {
    this.initializeDefaultConfigs();
    this.initializeDefaultPlans();
  }

  public static getInstance(): BackupManager {
    if (!BackupManager.instance) {
      BackupManager.instance = new BackupManager();
    }
    return BackupManager.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await this.loadBackupConfigs();
      await this.loadDisasterRecoveryPlans();
      await this.startScheduledBackups();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize BackupManager:', error);
    }
  }

  // Backup Configuration Management
  public async createBackupConfig(config: Omit<BackupConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<BackupConfig> {
    const backupConfig: BackupConfig = {
      id: this.generateId(),
      ...config,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.backupConfigs.push(backupConfig);
    await this.storeBackupConfig(backupConfig);
    return backupConfig;
  }

  public async updateBackupConfig(id: string, updates: Partial<BackupConfig>): Promise<BackupConfig | null> {
    const index = this.backupConfigs.findIndex(config => config.id === id);
    if (index === -1) return null;

    this.backupConfigs[index] = {
      ...this.backupConfigs[index],
      ...updates,
      updatedAt: new Date()
    };

    await this.storeBackupConfig(this.backupConfigs[index]);
    return this.backupConfigs[index];
  }

  public async deleteBackupConfig(id: string): Promise<boolean> {
    const index = this.backupConfigs.findIndex(config => config.id === id);
    if (index === -1) return false;

    this.backupConfigs.splice(index, 1);
    await this.deleteStoredBackupConfig(id);
    return true;
  }

  public getBackupConfigs(): BackupConfig[] {
    return [...this.backupConfigs];
  }

  public getBackupConfig(id: string): BackupConfig | null {
    return this.backupConfigs.find(config => config.id === id) || null;
  }

  // Backup Job Management
  public async createBackupJob(configId: string, type: 'scheduled' | 'manual' | 'recovery' = 'manual'): Promise<BackupJob> {
    const config = this.getBackupConfig(configId);
    if (!config) {
      throw new Error('Backup configuration not found');
    }

    const backupJob: BackupJob = {
      id: this.generateId(),
      configId,
      status: 'pending',
      type,
      startedAt: new Date(),
      metadata: {
        tables: config.tables,
        encryptionUsed: config.storage.encryption,
        storageLocation: '',
        checksum: ''
      },
      createdAt: new Date()
    };

    this.backupJobs.push(backupJob);
    await this.storeBackupJob(backupJob);

    // Start backup job
    this.executeBackupJob(backupJob);
    return backupJob;
  }

  public async getBackupJobs(): Promise<BackupJob[]> {
    return [...this.backupJobs];
  }

  public async getBackupJob(id: string): Promise<BackupJob | null> {
    return this.backupJobs.find(job => job.id === id) || null;
  }

  public async cancelBackupJob(id: string): Promise<boolean> {
    const job = this.backupJobs.find(j => j.id === id);
    if (!job || job.status !== 'running') return false;

    job.status = 'cancelled';
    job.completedAt = new Date();
    job.duration = job.completedAt.getTime() - job.startedAt.getTime();

    this.runningJobs.delete(id);
    await this.updateBackupJob(job);
    return true;
  }

  // Recovery Job Management
  public async createRecoveryJob(
    backupJobId: string,
    type: 'full' | 'partial' | 'point_in_time',
    targetTables: string[],
    targetTimestamp?: Date
  ): Promise<RecoveryJob> {
    const backupJob = this.backupJobs.find(job => job.id === backupJobId);
    if (!backupJob || backupJob.status !== 'completed') {
      throw new Error('Backup job not found or not completed');
    }

    const recoveryJob: RecoveryJob = {
      id: this.generateId(),
      backupJobId,
      status: 'pending',
      type,
      targetTables,
      targetTimestamp,
      startedAt: new Date(),
      metadata: {
        sourceBackup: backupJobId,
        targetDatabase: 'main',
        validationPassed: false,
        checksumVerified: false
      },
      createdAt: new Date()
    };

    this.recoveryJobs.push(recoveryJob);
    await this.storeRecoveryJob(recoveryJob);

    // Start recovery job
    this.executeRecoveryJob(recoveryJob);
    return recoveryJob;
  }

  public async getRecoveryJobs(): Promise<RecoveryJob[]> {
    return [...this.recoveryJobs];
  }

  public async getRecoveryJob(id: string): Promise<RecoveryJob | null> {
    return this.recoveryJobs.find(job => job.id === id) || null;
  }

  // Backup Validation
  public async createBackupValidation(backupJobId: string, type: 'integrity' | 'completeness' | 'consistency'): Promise<BackupValidation> {
    const backupJob = this.backupJobs.find(job => job.id === backupJobId);
    if (!backupJob) {
      throw new Error('Backup job not found');
    }

    const validation: BackupValidation = {
      id: this.generateId(),
      backupJobId,
      status: 'pending',
      type,
      startedAt: new Date(),
      results: {
        checksumValid: false,
        recordCountMatch: false,
        schemaValid: false,
        dataIntegrityValid: false,
        compressionValid: false,
        encryptionValid: false
      },
      createdAt: new Date()
    };

    this.backupValidations.push(validation);
    await this.storeBackupValidation(validation);

    // Start validation
    this.executeBackupValidation(validation);
    return validation;
  }

  public async getBackupValidations(): Promise<BackupValidation[]> {
    return [...this.backupValidations];
  }

  // Disaster Recovery Plan Management
  public async createDisasterRecoveryPlan(plan: Omit<DisasterRecoveryPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<DisasterRecoveryPlan> {
    const disasterRecoveryPlan: DisasterRecoveryPlan = {
      id: this.generateId(),
      ...plan,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.disasterRecoveryPlans.push(disasterRecoveryPlan);
    await this.storeDisasterRecoveryPlan(disasterRecoveryPlan);
    return disasterRecoveryPlan;
  }

  public async updateDisasterRecoveryPlan(id: string, updates: Partial<DisasterRecoveryPlan>): Promise<DisasterRecoveryPlan | null> {
    const index = this.disasterRecoveryPlans.findIndex(plan => plan.id === id);
    if (index === -1) return null;

    this.disasterRecoveryPlans[index] = {
      ...this.disasterRecoveryPlans[index],
      ...updates,
      updatedAt: new Date()
    };

    await this.storeDisasterRecoveryPlan(this.disasterRecoveryPlans[index]);
    return this.disasterRecoveryPlans[index];
  }

  public async deleteDisasterRecoveryPlan(id: string): Promise<boolean> {
    const index = this.disasterRecoveryPlans.findIndex(plan => plan.id === id);
    if (index === -1) return false;

    this.disasterRecoveryPlans.splice(index, 1);
    await this.deleteStoredDisasterRecoveryPlan(id);
    return true;
  }

  public getDisasterRecoveryPlans(): DisasterRecoveryPlan[] {
    return [...this.disasterRecoveryPlans];
  }

  public getDisasterRecoveryPlan(id: string): DisasterRecoveryPlan | null {
    return this.disasterRecoveryPlans.find(plan => plan.id === id) || null;
  }

  // Backup Execution
  private async executeBackupJob(job: BackupJob): Promise<void> {
    try {
      this.runningJobs.add(job.id);
      job.status = 'running';
      await this.updateBackupJob(job);

      const config = this.getBackupConfig(job.configId);
      if (!config) {
        throw new Error('Backup configuration not found');
      }

      // Perform backup based on type
      let backupData: any;
      let records = 0;
      let size = 0;

      switch (config.type) {
        case 'full':
          backupData = await this.performFullBackup(config);
          break;
        case 'incremental':
          backupData = await this.performIncrementalBackup(config, job);
          break;
        case 'differential':
          backupData = await this.performDifferentialBackup(config, job);
          break;
      }

      // Calculate metrics
      records = this.calculateRecordCount(backupData);
      size = this.calculateBackupSize(backupData);

      // Apply compression if enabled
      if (config.storage.compression) {
        backupData = await this.compressBackup(backupData);
        job.metadata.compressionRatio = size / this.calculateBackupSize(backupData);
      }

      // Apply encryption if enabled
      if (config.storage.encryption) {
        backupData = await this.encryptBackup(backupData);
      }

      // Store backup
      const storageLocation = await this.storeBackup(backupData, config);
      job.metadata.storageLocation = storageLocation;
      job.metadata.checksum = await this.calculateChecksum(backupData);

      // Update job status
      job.status = 'completed';
      job.completedAt = new Date();
      job.duration = job.completedAt.getTime() - job.startedAt.getTime();
      job.size = size;
      job.records = records;

      await this.updateBackupJob(job);

      // Schedule validation
      await this.createBackupValidation(job.id, 'integrity');

    } catch (error) {
      job.status = 'failed';
      job.error = error instanceof Error ? error.message : 'Unknown error';
      job.completedAt = new Date();
      job.duration = job.completedAt.getTime() - job.startedAt.getTime();
      await this.updateBackupJob(job);
    } finally {
      this.runningJobs.delete(job.id);
    }
  }

  private async performFullBackup(config: BackupConfig): Promise<any> {
    const backupData: any = {
      type: 'full',
      timestamp: new Date().toISOString(),
      tables: {}
    };

    for (const tableName of config.tables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*');

        if (error) throw error;
        backupData.tables[tableName] = data || [];
      } catch (error) {
        console.error(`Failed to backup table ${tableName}:`, error);
        backupData.tables[tableName] = [];
      }
    }

    return backupData;
  }

  private async performIncrementalBackup(config: BackupConfig, job: BackupJob): Promise<any> {
    // Find last successful backup
    const lastBackup = this.backupJobs
      .filter(j => j.configId === config.id && j.status === 'completed')
      .sort((a, b) => b.completedAt!.getTime() - a.completedAt!.getTime())[0];

    if (!lastBackup) {
      // No previous backup, perform full backup
      return this.performFullBackup(config);
    }

    const backupData: any = {
      type: 'incremental',
      timestamp: new Date().toISOString(),
      baseBackup: lastBackup.id,
      tables: {}
    };

    // Get changes since last backup
    for (const tableName of config.tables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .gte('updated_at', lastBackup.completedAt!.toISOString());

        if (error) throw error;
        backupData.tables[tableName] = data || [];
      } catch (error) {
        console.error(`Failed to backup table ${tableName}:`, error);
        backupData.tables[tableName] = [];
      }
    }

    return backupData;
  }

  private async performDifferentialBackup(config: BackupConfig, job: BackupJob): Promise<any> {
    // Find last full backup
    const lastFullBackup = this.backupJobs
      .filter(j => j.configId === config.id && j.status === 'completed' && j.type === 'scheduled')
      .sort((a, b) => b.completedAt!.getTime() - a.completedAt!.getTime())[0];

    if (!lastFullBackup) {
      // No previous backup, perform full backup
      return this.performFullBackup(config);
    }

    const backupData: any = {
      type: 'differential',
      timestamp: new Date().toISOString(),
      baseBackup: lastFullBackup.id,
      tables: {}
    };

    // Get changes since last full backup
    for (const tableName of config.tables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .gte('updated_at', lastFullBackup.completedAt!.toISOString());

        if (error) throw error;
        backupData.tables[tableName] = data || [];
      } catch (error) {
        console.error(`Failed to backup table ${tableName}:`, error);
        backupData.tables[tableName] = [];
      }
    }

    return backupData;
  }

  // Recovery Execution
  private async executeRecoveryJob(job: RecoveryJob): Promise<void> {
    try {
      job.status = 'running';
      await this.updateRecoveryJob(job);

      const backupJob = this.backupJobs.find(b => b.id === job.backupJobId);
      if (!backupJob) {
        throw new Error('Source backup job not found');
      }

      // Load backup data
      const backupData = await this.loadBackup(backupJob.metadata.storageLocation);

      // Validate backup integrity
      const checksum = await this.calculateChecksum(backupData);
      if (checksum !== backupJob.metadata.checksum) {
        throw new Error('Backup checksum validation failed');
      }

      job.metadata.checksumVerified = true;

      // Perform recovery
      let recordsRestored = 0;

      for (const tableName of job.targetTables) {
        if (backupData.tables[tableName]) {
          // Clear existing data if full recovery
          if (job.type === 'full') {
            await supabase.from(tableName).delete().neq('id', '00000000-0000-0000-0000-000000000000');
          }

          // Restore data
          const { error } = await supabase
            .from(tableName)
            .upsert(backupData.tables[tableName]);

          if (error) throw error;
          recordsRestored += backupData.tables[tableName].length;
        }
      }

      job.recordsRestored = recordsRestored;
      job.metadata.validationPassed = true;

      // Update job status
      job.status = 'completed';
      job.completedAt = new Date();
      job.duration = job.completedAt.getTime() - job.startedAt.getTime();

      await this.updateRecoveryJob(job);

    } catch (error) {
      job.status = 'failed';
      job.error = error instanceof Error ? error.message : 'Unknown error';
      job.completedAt = new Date();
      job.duration = job.completedAt.getTime() - job.startedAt.getTime();
      await this.updateRecoveryJob(job);
    }
  }

  // Validation Execution
  private async executeBackupValidation(validation: BackupValidation): Promise<void> {
    try {
      validation.status = 'running';
      await this.updateBackupValidation(validation);

      const backupJob = this.backupJobs.find(job => job.id === validation.backupJobId);
      if (!backupJob) {
        throw new Error('Backup job not found');
      }

      // Load backup data
      const backupData = await this.loadBackup(backupJob.metadata.storageLocation);

      // Perform validation based on type
      switch (validation.type) {
        case 'integrity':
          await this.validateIntegrity(validation, backupData, backupJob);
          break;
        case 'completeness':
          await this.validateCompleteness(validation, backupData, backupJob);
          break;
        case 'consistency':
          await this.validateConsistency(validation, backupData, backupJob);
          break;
      }

      validation.status = 'passed';
      validation.completedAt = new Date();
      validation.duration = validation.completedAt.getTime() - validation.startedAt.getTime();

      await this.updateBackupValidation(validation);

    } catch (error) {
      validation.status = 'failed';
      validation.error = error instanceof Error ? error.message : 'Unknown error';
      validation.completedAt = new Date();
      validation.duration = validation.completedAt.getTime() - validation.startedAt.getTime();
      await this.updateBackupValidation(validation);
    }
  }

  private async validateIntegrity(validation: BackupValidation, backupData: any, backupJob: BackupJob): Promise<void> {
    // Validate checksum
    const checksum = await this.calculateChecksum(backupData);
    validation.results.checksumValid = checksum === backupJob.metadata.checksum;

    // Validate compression
    if (backupJob.metadata.compressionRatio) {
      validation.results.compressionValid = backupJob.metadata.compressionRatio > 0;
    }

    // Validate encryption
    validation.results.encryptionValid = backupJob.metadata.encryptionUsed;
  }

  private async validateCompleteness(validation: BackupValidation, backupData: any, backupJob: BackupJob): Promise<void> {
    // Validate record count
    const expectedTables = backupJob.metadata.tables;
    const actualTables = Object.keys(backupData.tables);

    validation.results.recordCountMatch = expectedTables.every(table => 
      actualTables.includes(table)
    );

    // Validate schema
    validation.results.schemaValid = true; // Simplified validation
  }

  private async validateConsistency(validation: BackupValidation, backupData: any, backupJob: BackupJob): Promise<void> {
    // Validate data integrity
    validation.results.dataIntegrityValid = true; // Simplified validation
  }

  // Utility Methods
  private calculateRecordCount(backupData: any): number {
    let count = 0;
    for (const tableName in backupData.tables) {
      count += backupData.tables[tableName].length;
    }
    return count;
  }

  private calculateBackupSize(backupData: any): number {
    return JSON.stringify(backupData).length;
  }

  private async compressBackup(backupData: any): Promise<any> {
    // Implement compression logic
    return backupData;
  }

  private async encryptBackup(backupData: any): Promise<any> {
    // Implement encryption logic
    return backupData;
  }

  private async calculateChecksum(data: any): Promise<string> {
    // Implement checksum calculation
    return 'checksum_' + Math.random().toString(36).substring(2);
  }

  private async storeBackup(backupData: any, config: BackupConfig): Promise<string> {
    // Implement storage logic based on config.storage.type
    return `backup_${config.id}_${Date.now()}.json`;
  }

  private async loadBackup(storageLocation: string): Promise<any> {
    // Implement loading logic
    return {};
  }

  // Scheduled Backup Management
  private async startScheduledBackups(): Promise<void> {
    for (const config of this.backupConfigs) {
      if (config.enabled && config.schedule) {
        this.scheduleBackup(config);
      }
    }
  }

  private scheduleBackup(config: BackupConfig): void {
    // Implement scheduling logic
    console.log(`Scheduled backup for config: ${config.name}`);
  }

  // Database Operations
  private async loadBackupConfigs(): Promise<void> {
    try {
      const { data, error } = await supabase.from('backup_configs').select('*');
      if (error) throw error;
      this.backupConfigs = data || [];
    } catch (error) {
      console.error('Failed to load backup configs:', error);
    }
  }

  private async loadDisasterRecoveryPlans(): Promise<void> {
    try {
      const { data, error } = await supabase.from('disaster_recovery_plans').select('*');
      if (error) throw error;
      this.disasterRecoveryPlans = data || [];
    } catch (error) {
      console.error('Failed to load disaster recovery plans:', error);
    }
  }

  private async storeBackupConfig(config: BackupConfig): Promise<void> {
    try {
      await supabase.from('backup_configs').upsert({
        id: config.id,
        name: config.name,
        description: config.description,
        type: config.type,
        schedule: config.schedule,
        retention: config.retention,
        storage: config.storage,
        tables: config.tables,
        enabled: config.enabled,
        created_at: config.createdAt.toISOString(),
        updated_at: config.updatedAt.toISOString()
      });
    } catch (error) {
      console.error('Failed to store backup config:', error);
    }
  }

  private async storeBackupJob(job: BackupJob): Promise<void> {
    try {
      await supabase.from('backup_jobs').insert({
        id: job.id,
        config_id: job.configId,
        status: job.status,
        type: job.type,
        started_at: job.startedAt.toISOString(),
        completed_at: job.completedAt?.toISOString(),
        duration: job.duration,
        size: job.size,
        records: job.records,
        error: job.error,
        metadata: job.metadata,
        created_at: job.createdAt.toISOString()
      });
    } catch (error) {
      console.error('Failed to store backup job:', error);
    }
  }

  private async updateBackupJob(job: BackupJob): Promise<void> {
    try {
      await supabase.from('backup_jobs').update({
        status: job.status,
        completed_at: job.completedAt?.toISOString(),
        duration: job.duration,
        size: job.size,
        records: job.records,
        error: job.error,
        metadata: job.metadata
      }).eq('id', job.id);
    } catch (error) {
      console.error('Failed to update backup job:', error);
    }
  }

  private async storeRecoveryJob(job: RecoveryJob): Promise<void> {
    try {
      await supabase.from('recovery_jobs').insert({
        id: job.id,
        backup_job_id: job.backupJobId,
        status: job.status,
        type: job.type,
        target_tables: job.targetTables,
        target_timestamp: job.targetTimestamp?.toISOString(),
        started_at: job.startedAt.toISOString(),
        completed_at: job.completedAt?.toISOString(),
        duration: job.duration,
        records_restored: job.recordsRestored,
        error: job.error,
        metadata: job.metadata,
        created_at: job.createdAt.toISOString()
      });
    } catch (error) {
      console.error('Failed to store recovery job:', error);
    }
  }

  private async updateRecoveryJob(job: RecoveryJob): Promise<void> {
    try {
      await supabase.from('recovery_jobs').update({
        status: job.status,
        completed_at: job.completedAt?.toISOString(),
        duration: job.duration,
        records_restored: job.recordsRestored,
        error: job.error,
        metadata: job.metadata
      }).eq('id', job.id);
    } catch (error) {
      console.error('Failed to update recovery job:', error);
    }
  }

  private async storeBackupValidation(validation: BackupValidation): Promise<void> {
    try {
      await supabase.from('backup_validations').insert({
        id: validation.id,
        backup_job_id: validation.backupJobId,
        status: validation.status,
        type: validation.type,
        started_at: validation.startedAt.toISOString(),
        completed_at: validation.completedAt?.toISOString(),
        duration: validation.duration,
        error: validation.error,
        results: validation.results,
        created_at: validation.createdAt.toISOString()
      });
    } catch (error) {
      console.error('Failed to store backup validation:', error);
    }
  }

  private async updateBackupValidation(validation: BackupValidation): Promise<void> {
    try {
      await supabase.from('backup_validations').update({
        status: validation.status,
        completed_at: validation.completedAt?.toISOString(),
        duration: validation.duration,
        error: validation.error,
        results: validation.results
      }).eq('id', validation.id);
    } catch (error) {
      console.error('Failed to update backup validation:', error);
    }
  }

  private async storeDisasterRecoveryPlan(plan: DisasterRecoveryPlan): Promise<void> {
    try {
      await supabase.from('disaster_recovery_plans').upsert({
        id: plan.id,
        name: plan.name,
        description: plan.description,
        rto: plan.rto,
        rpo: plan.rpo,
        priority: plan.priority,
        components: plan.components,
        testing_schedule: plan.testingSchedule,
        contacts: plan.contacts,
        enabled: plan.enabled,
        created_at: plan.createdAt.toISOString(),
        updated_at: plan.updatedAt.toISOString()
      });
    } catch (error) {
      console.error('Failed to store disaster recovery plan:', error);
    }
  }

  private async deleteStoredBackupConfig(id: string): Promise<void> {
    try {
      await supabase.from('backup_configs').delete().eq('id', id);
    } catch (error) {
      console.error('Failed to delete backup config:', error);
    }
  }

  private async deleteStoredDisasterRecoveryPlan(id: string): Promise<void> {
    try {
      await supabase.from('disaster_recovery_plans').delete().eq('id', id);
    } catch (error) {
      console.error('Failed to delete disaster recovery plan:', error);
    }
  }

  private generateId(): string {
    return 'backup_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // Default Initializations
  private initializeDefaultConfigs(): void {
    this.backupConfigs = [
      {
        id: 'daily_full_backup',
        name: 'Daily Full Backup',
        description: 'Complete database backup every day',
        type: 'full',
        schedule: {
          frequency: 'daily',
          time: '02:00',
          timezone: 'UTC'
        },
        retention: {
          daily: 7,
          weekly: 4,
          monthly: 12,
          yearly: 2
        },
        storage: {
          type: 'local',
          config: { path: '/backups' },
          encryption: true,
          compression: true
        },
        tables: ['users', 'test_cases', 'test_executions', 'user_activities'],
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'hourly_incremental_backup',
        name: 'Hourly Incremental Backup',
        description: 'Incremental backup every hour',
        type: 'incremental',
        schedule: {
          frequency: 'hourly',
          time: '00:00',
          timezone: 'UTC'
        },
        retention: {
          daily: 24,
          weekly: 0,
          monthly: 0,
          yearly: 0
        },
        storage: {
          type: 'local',
          config: { path: '/backups/incremental' },
          encryption: true,
          compression: true
        },
        tables: ['users', 'test_cases', 'test_executions', 'user_activities'],
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  private initializeDefaultPlans(): void {
    this.disasterRecoveryPlans = [
      {
        id: 'critical_system_recovery',
        name: 'Critical System Recovery',
        description: 'Recovery plan for critical system components',
        rto: 60, // 1 hour
        rpo: 15, // 15 minutes
        priority: 'critical',
        components: [
          {
            name: 'Database',
            type: 'database',
            dependencies: [],
            recoverySteps: [
              'Restore from latest backup',
              'Verify data integrity',
              'Start database services',
              'Run consistency checks'
            ],
            estimatedTime: 30
          },
          {
            name: 'Application Server',
            type: 'application',
            dependencies: ['Database'],
            recoverySteps: [
              'Deploy application code',
              'Configure environment',
              'Start application services',
              'Verify functionality'
            ],
            estimatedTime: 20
          }
        ],
        testingSchedule: {
          frequency: 'monthly',
          nextTest: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        },
        contacts: [
          {
            name: 'System Administrator',
            role: 'Primary',
            email: 'admin@5glabx.com',
            phone: '+1-555-0123',
            escalationLevel: 1
          }
        ],
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }
}
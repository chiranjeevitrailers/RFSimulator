/**
 * Test Configuration Manager
 * Manages test configurations for 4G/5G test cases
 * Stores configurations in Supabase and provides real-time updates
 */

export interface TestConfiguration {
  id: string;
  name: string;
  description: string;
  testCaseId: string;
  userId: string;
  category: '4G_LTE' | '5G_NR' | 'IMS_SIP' | 'O_RAN' | 'NB_IoT' | 'V2X' | 'NTN';
  protocol: string;
  version: string;
  
  // General Configuration
  general: {
    executionMode: 'simulation' | 'realtime' | 'batch';
    timeAcceleration: number;
    logLevel: 'basic' | 'detailed' | 'verbose';
    captureMode: 'messages' | 'full' | 'performance';
    outputFormat: 'json' | 'hex' | 'binary' | 'text';
    autoStart: boolean;
    autoStop: boolean;
    timeout: number;
  };
  
  // Network Configuration
  network: {
    plmn: {
      mcc: string;
      mnc: string;
    };
    cell: {
      cellId: number;
      pci: number;
      tac: number;
      earfcn?: number; // 4G LTE
      arfcn?: number;  // 5G NR
    };
    frequency: {
      dlFreq: number;
      ulFreq: number;
      bandwidth: number;
      subcarrierSpacing?: number; // 5G NR
    };
    power: {
      txPower: number;
      rxPower: number;
      rsrp: number;
      rsrq: number;
      sinr: number;
    };
  };
  
  // UE Configuration
  ue: {
    identity: {
      imsi: string;
      imei: string;
      suci: string;
      guti: string;
    };
    capabilities: {
      maxBandwidth: number;
      maxMimoLayers: number;
      supportedModulations: string[];
      carrierAggregation: boolean;
    };
    security: {
      authentication: 'AKA' | '5G-AKA' | 'EAP-AKA';
      encryption: 'AES-128' | 'AES-256' | 'SNOW-3G';
      integrity: 'AES-128' | 'AES-256' | 'SNOW-3G';
    };
  };
  
  // Protocol Layer Configurations
  layers: {
    PHY?: PHYConfiguration;
    MAC?: MACConfiguration;
    RLC?: RLCConfiguration;
    PDCP?: PDCPConfiguration;
    RRC?: RRCConfiguration;
    NAS?: NASConfiguration;
    SIP?: SIPConfiguration;
    IMS?: IMSConfiguration;
  };
  
  // Test Specific Configuration
  testSpecific: {
    scenario: string;
    testType: 'functional' | 'performance' | 'stability' | 'stress' | 'interoperability' | 'security' | 'mobility' | 'conformance';
    duration: number;
    iterations: number;
    successCriteria: any;
    failureThresholds: any;
    performanceTargets: any;
  };
  
  // Advanced Configuration
  advanced: {
    debugMode: boolean;
    traceLevel: 'none' | 'basic' | 'detailed' | 'full';
    memoryLimit: number;
    cpuLimit: number;
    customParameters: Record<string, any>;
  };
  
  // Metadata
  metadata: {
    created: Date;
    updated: Date;
    createdBy: string;
    tags: string[];
    isTemplate: boolean;
    isPublic: boolean;
    version: string;
  };
}

export interface PHYConfiguration {
  dlArfcn: number;
  ulArfcn: number;
  bandwidth: number;
  subcarrierSpacing: number;
  pci: number;
  cellId: number;
  rsrp: number;
  rsrq: number;
  sinr: number;
  cqi: number;
  mcs: number;
  bler: number;
  mimoLayers: number;
  modulation: string;
  codingRate: number;
  powerControl: {
    enabled: boolean;
    algorithm: string;
    target: number;
  };
  beamforming: {
    enabled: boolean;
    algorithm: string;
    beams: number;
  };
}

export interface MACConfiguration {
  harq: {
    enabled: boolean;
    maxProcesses: number;
    maxRetransmissions: number;
    algorithm: string;
  };
  scheduling: {
    algorithm: 'proportional_fair' | 'round_robin' | 'max_cqi' | 'custom';
    interval: number;
    priority: Record<string, number>;
  };
  logicalChannels: {
    maxChannels: number;
    channelConfig: Record<string, any>;
  };
  randomAccess: {
    preambleFormat: string;
    maxAttempts: number;
    backoffTime: number;
  };
}

export interface RLCConfiguration {
  mode: 'AM' | 'UM' | 'TM';
  maxRetransmissions: number;
  pollingInterval: number;
  windowSize: number;
  segmentation: {
    enabled: boolean;
    maxSize: number;
  };
  reordering: {
    enabled: boolean;
    timer: number;
  };
}

export interface PDCPConfiguration {
  mode: 'AM' | 'UM' | 'TM';
  security: {
    enabled: boolean;
    encryption: string;
    integrity: string;
  };
  compression: {
    enabled: boolean;
    algorithm: string;
  };
  sequenceNumber: {
    size: number;
    window: number;
  };
}

export interface RRCConfiguration {
  state: 'RRC_IDLE' | 'RRC_INACTIVE' | 'RRC_CONNECTED';
  security: {
    activated: boolean;
    algorithms: string[];
  };
  mobility: {
    enabled: boolean;
    measurements: boolean;
    handover: boolean;
  };
  measurements: {
    enabled: boolean;
    interval: number;
    reporting: boolean;
  };
}

export interface NASConfiguration {
  state: 'DEREGISTERED' | 'REGISTERED' | 'DEREGISTERED_INITIATED';
  security: {
    context: 'activated' | 'deactivated';
    algorithms: string[];
  };
  mobility: {
    enabled: boolean;
    trackingArea: string;
  };
  session: {
    maxSessions: number;
    defaultSession: any;
  };
}

export interface SIPConfiguration {
  version: string;
  transport: 'UDP' | 'TCP' | 'TLS';
  port: number;
  authentication: 'Digest' | 'AKA' | 'None';
  registration: {
    interval: number;
    maxAttempts: number;
  };
  session: {
    timer: number;
    refresh: number;
  };
}

export interface IMSConfiguration {
  version: string;
  serviceProfile: string[];
  authentication: 'AKA' | 'Digest';
  services: {
    voice: boolean;
    video: boolean;
    messaging: boolean;
  };
  network: {
    domain: string;
    proxy: string;
  };
}

export class TestConfigurationManager {
  private supabase: any;
  private configurations: Map<string, TestConfiguration> = new Map();
  private templates: Map<string, TestConfiguration> = new Map();

  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = require('@supabase/supabase-js').createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Create a new test configuration
   */
  async createConfiguration(config: Partial<TestConfiguration>): Promise<string> {
    try {
      const configuration: TestConfiguration = {
        id: `config_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: config.name || 'New Configuration',
        description: config.description || '',
        testCaseId: config.testCaseId || '',
        userId: config.userId || '',
        category: config.category || '5G_NR',
        protocol: config.protocol || 'NR',
        version: config.version || '1.0',
        
        general: {
          executionMode: 'simulation',
          timeAcceleration: 1,
          logLevel: 'detailed',
          captureMode: 'full',
          outputFormat: 'json',
          autoStart: false,
          autoStop: true,
          timeout: 300000,
          ...config.general
        },
        
        network: {
          plmn: { mcc: '001', mnc: '01', ...config.network?.plmn },
          cell: { cellId: 123456, pci: 123, tac: 1, ...config.network?.cell },
          frequency: { dlFreq: 2100, ulFreq: 1900, bandwidth: 20, ...config.network?.frequency },
          power: { txPower: 23, rxPower: -80, rsrp: -85, rsrq: -12, sinr: 18, ...config.network?.power }
        },
        
        ue: {
          identity: {
            imsi: '001010123456789',
            imei: '123456789012345',
            suci: '001010123456789',
            guti: '001010123456789',
            ...config.ue?.identity
          },
          capabilities: {
            maxBandwidth: 100,
            maxMimoLayers: 4,
            supportedModulations: ['QPSK', '16QAM', '64QAM', '256QAM'],
            carrierAggregation: true,
            ...config.ue?.capabilities
          },
          security: {
            authentication: '5G-AKA',
            encryption: 'AES-128',
            integrity: 'AES-128',
            ...config.ue?.security
          }
        },
        
        layers: config.layers || {},
        
        testSpecific: {
          scenario: 'default',
          testType: 'functional',
          duration: 300,
          iterations: 1,
          successCriteria: {},
          failureThresholds: {},
          performanceTargets: {},
          ...config.testSpecific
        },
        
        advanced: {
          debugMode: false,
          traceLevel: 'basic',
          memoryLimit: 1024,
          cpuLimit: 80,
          customParameters: {},
          ...config.advanced
        },
        
        metadata: {
          created: new Date(),
          updated: new Date(),
          createdBy: config.userId || '',
          tags: [],
          isTemplate: false,
          isPublic: false,
          version: '1.0',
          ...config.metadata
        }
      };

      // Store in database
      const { data, error } = await this.supabase
        .from('test_configurations')
        .insert({
          id: configuration.id,
          name: configuration.name,
          description: configuration.description,
          test_case_id: configuration.testCaseId,
          user_id: configuration.userId,
          category: configuration.category,
          protocol: configuration.protocol,
          version: configuration.version,
          configuration_data: configuration,
          created_at: configuration.metadata.created.toISOString(),
          updated_at: configuration.metadata.updated.toISOString(),
          is_template: configuration.metadata.isTemplate,
          is_public: configuration.metadata.isPublic
        })
        .select()
        .single();

      if (error) throw error;

      // Store in memory
      this.configurations.set(configuration.id, configuration);

      return configuration.id;
    } catch (error) {
      console.error('Failed to create test configuration:', error);
      throw error;
    }
  }

  /**
   * Get test configuration by ID
   */
  async getConfiguration(configId: string): Promise<TestConfiguration | null> {
    try {
      // Check memory first
      if (this.configurations.has(configId)) {
        return this.configurations.get(configId)!;
      }

      // Fetch from database
      const { data, error } = await this.supabase
        .from('test_configurations')
        .select('*')
        .eq('id', configId)
        .single();

      if (error) throw error;
      if (!data) return null;

      const configuration: TestConfiguration = data.configuration_data;
      this.configurations.set(configId, configuration);

      return configuration;
    } catch (error) {
      console.error('Failed to get test configuration:', error);
      throw error;
    }
  }

  /**
   * Update test configuration
   */
  async updateConfiguration(configId: string, updates: Partial<TestConfiguration>): Promise<void> {
    try {
      const existingConfig = await this.getConfiguration(configId);
      if (!existingConfig) throw new Error('Configuration not found');

      const updatedConfig: TestConfiguration = {
        ...existingConfig,
        ...updates,
        metadata: {
          ...existingConfig.metadata,
          ...updates.metadata,
          updated: new Date()
        }
      };

      // Update database
      const { error } = await this.supabase
        .from('test_configurations')
        .update({
          name: updatedConfig.name,
          description: updatedConfig.description,
          configuration_data: updatedConfig,
          updated_at: updatedConfig.metadata.updated.toISOString()
        })
        .eq('id', configId);

      if (error) throw error;

      // Update memory
      this.configurations.set(configId, updatedConfig);
    } catch (error) {
      console.error('Failed to update test configuration:', error);
      throw error;
    }
  }

  /**
   * Delete test configuration
   */
  async deleteConfiguration(configId: string): Promise<void> {
    try {
      // Delete from database
      const { error } = await this.supabase
        .from('test_configurations')
        .delete()
        .eq('id', configId);

      if (error) throw error;

      // Remove from memory
      this.configurations.delete(configId);
    } catch (error) {
      console.error('Failed to delete test configuration:', error);
      throw error;
    }
  }

  /**
   * List configurations for a user
   */
  async listConfigurations(userId: string, category?: string): Promise<TestConfiguration[]> {
    try {
      let query = this.supabase
        .from('test_configurations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data.map((item: any) => item.configuration_data);
    } catch (error) {
      console.error('Failed to list configurations:', error);
      throw error;
    }
  }

  /**
   * Create configuration template
   */
  async createTemplate(config: TestConfiguration): Promise<string> {
    const templateConfig = {
      ...config,
      id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      metadata: {
        ...config.metadata,
        isTemplate: true,
        isPublic: true,
        created: new Date(),
        updated: new Date()
      }
    };

    return await this.createConfiguration(templateConfig);
  }

  /**
   * Get configuration templates
   */
  async getTemplates(category?: string): Promise<TestConfiguration[]> {
    try {
      let query = this.supabase
        .from('test_configurations')
        .select('*')
        .eq('is_template', true)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data.map((item: any) => item.configuration_data);
    } catch (error) {
      console.error('Failed to get templates:', error);
      throw error;
    }
  }

  /**
   * Clone configuration
   */
  async cloneConfiguration(configId: string, newName: string, userId: string): Promise<string> {
    try {
      const originalConfig = await this.getConfiguration(configId);
      if (!originalConfig) throw new Error('Configuration not found');

      const clonedConfig = {
        ...originalConfig,
        name: newName,
        userId,
        metadata: {
          ...originalConfig.metadata,
          created: new Date(),
          updated: new Date(),
          createdBy: userId,
          isTemplate: false,
          isPublic: false
        }
      };

      return await this.createConfiguration(clonedConfig);
    } catch (error) {
      console.error('Failed to clone configuration:', error);
      throw error;
    }
  }

  /**
   * Validate configuration
   */
  validateConfiguration(config: TestConfiguration): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Basic validation
    if (!config.name) errors.push('Configuration name is required');
    if (!config.testCaseId) errors.push('Test case ID is required');
    if (!config.userId) errors.push('User ID is required');

    // Network validation
    if (!config.network.plmn.mcc) errors.push('MCC is required');
    if (!config.network.plmn.mnc) errors.push('MNC is required');
    if (!config.network.cell.cellId) errors.push('Cell ID is required');

    // UE validation
    if (!config.ue.identity.imsi) errors.push('IMSI is required');
    if (!config.ue.identity.imei) errors.push('IMEI is required');

    // Layer validation
    if (config.category === '5G_NR') {
      if (!config.layers.PHY) errors.push('PHY layer configuration is required for 5G NR');
      if (!config.layers.MAC) errors.push('MAC layer configuration is required for 5G NR');
      if (!config.layers.RRC) errors.push('RRC layer configuration is required for 5G NR');
      if (!config.layers.NAS) errors.push('NAS layer configuration is required for 5G NR');
    }

    if (config.category === '4G_LTE') {
      if (!config.layers.PHY) errors.push('PHY layer configuration is required for 4G LTE');
      if (!config.layers.MAC) errors.push('MAC layer configuration is required for 4G LTE');
      if (!config.layers.RRC) errors.push('RRC layer configuration is required for 4G LTE');
      if (!config.layers.NAS) errors.push('NAS layer configuration is required for 4G LTE');
    }

    if (config.category === 'IMS_SIP') {
      if (!config.layers.SIP) errors.push('SIP layer configuration is required for IMS');
      if (!config.layers.IMS) errors.push('IMS layer configuration is required for IMS');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get default configuration for test case
   */
  getDefaultConfiguration(testCaseId: string, category: string): Partial<TestConfiguration> {
    const baseConfig: Partial<TestConfiguration> = {
      testCaseId,
      category: category as any,
      general: {
        executionMode: 'simulation',
        timeAcceleration: 1,
        logLevel: 'detailed',
        captureMode: 'full',
        outputFormat: 'json',
        autoStart: false,
        autoStop: true,
        timeout: 300000
      },
      network: {
        plmn: { mcc: '001', mnc: '01' },
        cell: { cellId: 123456, pci: 123, tac: 1 },
        frequency: { dlFreq: 2100, ulFreq: 1900, bandwidth: 20 },
        power: { txPower: 23, rxPower: -80, rsrp: -85, rsrq: -12, sinr: 18 }
      },
      ue: {
        identity: {
          imsi: '001010123456789',
          imei: '123456789012345',
          suci: '001010123456789',
          guti: '001010123456789'
        },
        capabilities: {
          maxBandwidth: 100,
          maxMimoLayers: 4,
          supportedModulations: ['QPSK', '16QAM', '64QAM', '256QAM'],
          carrierAggregation: true
        },
        security: {
          authentication: '5G-AKA',
          encryption: 'AES-128',
          integrity: 'AES-128'
        }
      },
      testSpecific: {
        scenario: 'default',
        testType: 'functional',
        duration: 300,
        iterations: 1,
        successCriteria: {},
        failureThresholds: {},
        performanceTargets: {}
      },
      advanced: {
        debugMode: false,
        traceLevel: 'basic',
        memoryLimit: 1024,
        cpuLimit: 80,
        customParameters: {}
      }
    };

    // Add category-specific configurations
    switch (category) {
      case '5G_NR':
        baseConfig.layers = {
          PHY: {
            dlArfcn: 3732480,
            ulArfcn: 3732480,
            bandwidth: 100,
            subcarrierSpacing: 30,
            pci: 123,
            cellId: 123456,
            rsrp: -85,
            rsrq: -12,
            sinr: 18,
            cqi: 13,
            mcs: 20,
            bler: 0.01,
            mimoLayers: 4,
            modulation: '256QAM',
            codingRate: 0.8,
            powerControl: { enabled: true, algorithm: 'closed_loop', target: -80 },
            beamforming: { enabled: true, algorithm: 'digital', beams: 4 }
          },
          MAC: {
            harq: { enabled: true, maxProcesses: 16, maxRetransmissions: 3, algorithm: 'incremental_redundancy' },
            scheduling: { algorithm: 'proportional_fair', interval: 1, priority: {} },
            logicalChannels: { maxChannels: 32, channelConfig: {} },
            randomAccess: { preambleFormat: 'format_0', maxAttempts: 3, backoffTime: 100 }
          },
          RLC: {
            mode: 'AM',
            maxRetransmissions: 3,
            pollingInterval: 100,
            windowSize: 1024,
            segmentation: { enabled: true, maxSize: 9000 },
            reordering: { enabled: true, timer: 100 }
          },
          PDCP: {
            mode: 'AM',
            security: { enabled: true, encryption: 'AES-128', integrity: 'AES-128' },
            compression: { enabled: true, algorithm: 'ROHC' },
            sequenceNumber: { size: 12, window: 4096 }
          },
          RRC: {
            state: 'RRC_CONNECTED',
            security: { activated: true, algorithms: ['AES-128', 'AES-256'] },
            mobility: { enabled: true, measurements: true, handover: true },
            measurements: { enabled: true, interval: 1000, reporting: true }
          },
          NAS: {
            state: 'REGISTERED',
            security: { context: 'activated', algorithms: ['AES-128', 'AES-256'] },
            mobility: { enabled: true, trackingArea: '123456' },
            session: { maxSessions: 15, defaultSession: {} }
          }
        };
        break;

      case '4G_LTE':
        baseConfig.layers = {
          PHY: {
            dlArfcn: 1800,
            ulArfcn: 1800,
            bandwidth: 20,
            subcarrierSpacing: 15,
            pci: 123,
            cellId: 123456,
            rsrp: -85,
            rsrq: -12,
            sinr: 18,
            cqi: 13,
            mcs: 20,
            bler: 0.01,
            mimoLayers: 4,
            modulation: '64QAM',
            codingRate: 0.8,
            powerControl: { enabled: true, algorithm: 'closed_loop', target: -80 },
            beamforming: { enabled: false, algorithm: 'none', beams: 1 }
          },
          MAC: {
            harq: { enabled: true, maxProcesses: 8, maxRetransmissions: 3, algorithm: 'incremental_redundancy' },
            scheduling: { algorithm: 'proportional_fair', interval: 1, priority: {} },
            logicalChannels: { maxChannels: 16, channelConfig: {} },
            randomAccess: { preambleFormat: 'format_0', maxAttempts: 3, backoffTime: 100 }
          },
          RLC: {
            mode: 'AM',
            maxRetransmissions: 3,
            pollingInterval: 100,
            windowSize: 512,
            segmentation: { enabled: true, maxSize: 9000 },
            reordering: { enabled: true, timer: 100 }
          },
          PDCP: {
            mode: 'AM',
            security: { enabled: true, encryption: 'AES-128', integrity: 'AES-128' },
            compression: { enabled: true, algorithm: 'ROHC' },
            sequenceNumber: { size: 12, window: 4096 }
          },
          RRC: {
            state: 'RRC_CONNECTED',
            security: { activated: true, algorithms: ['AES-128', 'AES-256'] },
            mobility: { enabled: true, measurements: true, handover: true },
            measurements: { enabled: true, interval: 1000, reporting: true }
          },
          NAS: {
            state: 'REGISTERED',
            security: { context: 'activated', algorithms: ['AES-128', 'AES-256'] },
            mobility: { enabled: true, trackingArea: '123456' },
            session: { maxSessions: 11, defaultSession: {} }
          }
        };
        break;

      case 'IMS_SIP':
        baseConfig.layers = {
          SIP: {
            version: '2.0',
            transport: 'UDP',
            port: 5060,
            authentication: 'Digest',
            registration: { interval: 3600, maxAttempts: 3 },
            session: { timer: 1800, refresh: 1800 }
          },
          IMS: {
            version: '3GPP Release 15',
            serviceProfile: ['voice', 'video'],
            authentication: 'AKA',
            services: { voice: true, video: true, messaging: true },
            network: { domain: 'ims.mnc001.mcc001.3gppnetwork.org', proxy: 'p-cscf.ims.mnc001.mcc001.3gppnetwork.org' }
          }
        };
        break;
    }

    return baseConfig;
  }
}

export default TestConfigurationManager;
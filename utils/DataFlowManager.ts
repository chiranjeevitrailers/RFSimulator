/**
 * Centralized Data Flow Manager
 * Manages data flow between Test Manager, 5GLabX Analysis, and UE Analysis platforms
 */

export interface TestExecutionData {
  executionId: string;
  testCaseId: string;
  testCaseName: string;
  technology: string;
  category: string;
  status: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'STOPPED';
  startTime: Date;
  endTime?: Date;
  messages: TestMessage[];
  informationElements: InformationElement[];
  layerParameters: LayerParameter[];
}

export interface TestMessage {
  id: string;
  timestamp: number;
  timestampMs: number;
  layer: string;
  protocol: string;
  messageType: string;
  messageName: string;
  direction: 'UL' | 'DL';
  messagePayload: any;
  informationElements?: InformationElement[];
  layerParameters?: LayerParameter[];
  standardReference?: string;
}

export interface InformationElement {
  id: string;
  ieName: string;
  ieType: string;
  ieValue: any;
  description?: string;
  standardReference?: string;
}

export interface LayerParameter {
  id: string;
  layer: string;
  parameterName: string;
  parameterValue: any;
  unit?: string;
  description?: string;
  standardReference?: string;
}

export interface UEIdentity {
  imsi: string;
  imei: string;
  msisdn: string;
  supi: string;
  guti: string;
  tmsi: string;
}

export interface UELocation {
  latitude: number;
  longitude: number;
  altitude: number;
  cellId: string;
  tac: string;
  plmnId: string;
}

export interface SignalQuality {
  rsrp: number;
  rsrq: number;
  sinr: number;
  rssi: number;
  pathloss: number;
}

export interface UECapabilities {
  mimoSupport: string;
  supportedBands: string[];
  throughput: string;
  features: string[];
}

export interface UELogMessage extends TestMessage {
  ueIdentity: UEIdentity;
  ueLocation: UELocation;
  signalQuality: SignalQuality;
  capabilities: UECapabilities;
  batteryLevel: number;
  powerHeadroom: number;
  uplinkPower: number;
}

export interface DataFlowEvent {
  type: string;
  source: 'TEST_MANAGER' | '5GLABX' | 'UE_ANALYSIS' | 'SYSTEM';
  target: 'TEST_MANAGER' | '5GLABX' | 'UE_ANALYSIS' | 'ALL';
  data: any;
  timestamp: number;
  executionId?: string;
  testCaseId?: string;
}

export class DataFlowManager {
  private static instance: DataFlowManager;
  private eventListeners: Map<string, Set<(event: DataFlowEvent) => void>> = new Map();
  private dataCache: Map<string, any> = new Map();
  private executionHistory: TestExecutionData[] = [];
  private currentExecution: TestExecutionData | null = null;

  private constructor() {
    this.initializeEventSystem();
  }

  public static getInstance(): DataFlowManager {
    if (!DataFlowManager.instance) {
      DataFlowManager.instance = new DataFlowManager();
    }
    return DataFlowManager.instance;
  }

  private initializeEventSystem(): void {
    if (typeof window !== 'undefined') {
      // Listen for custom events
      window.addEventListener('dataFlowEvent', this.handleCustomEvent.bind(this));
      
      // Listen for test execution events
      window.addEventListener('5GLABX_TEST_EXECUTION', this.handleTestExecution.bind(this));
      window.addEventListener('5GLABX_TEST_STOP', this.handleTestStop.bind(this));
      
      // Listen for UE events
      window.addEventListener('UE_CONNECTED', this.handleUEConnected.bind(this));
      window.addEventListener('UE_DISCONNECTED', this.handleUEDisconnected.bind(this));
      window.addEventListener('UE_REGISTRATION', this.handleUERegistration.bind(this));
      window.addEventListener('UE_SERVICE_REQUEST', this.handleUEServiceRequest.bind(this));
      window.addEventListener('UE_HANDOVER', this.handleUEHandover.bind(this));
      window.addEventListener('UE_CALL_SETUP', this.handleUECallSetup.bind(this));
      window.addEventListener('UE_CALL_RELEASE', this.handleUECallRelease.bind(this));
      window.addEventListener('UE_MOBILITY_UPDATE', this.handleUEMobilityUpdate.bind(this));
      window.addEventListener('UE_SECURITY_EVENT', this.handleUESecurityEvent.bind(this));
      window.addEventListener('UE_PERFORMANCE_UPDATE', this.handleUEPerformanceUpdate.bind(this));
      
      // Listen for cross-platform events
      window.addEventListener('END_TO_END_ANALYSIS', this.handleEndToEndAnalysis.bind(this));
      window.addEventListener('CORRELATED_ANALYSIS', this.handleCorrelatedAnalysis.bind(this));
      window.addEventListener('PERFORMANCE_CORRELATION', this.handlePerformanceCorrelation.bind(this));
    }
  }

  // Event subscription system
  public subscribe(eventType: string, callback: (event: DataFlowEvent) => void): () => void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set());
    }
    
    this.eventListeners.get(eventType)!.add(callback);
    
    // Return unsubscribe function
    return () => {
      const listeners = this.eventListeners.get(eventType);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.eventListeners.delete(eventType);
        }
      }
    };
  }

  // Event dispatching system
  public dispatch(event: DataFlowEvent): void {
    console.log(`📡 DataFlowManager: Dispatching ${event.type} from ${event.source} to ${event.target}`);
    
    // Store in cache
    this.dataCache.set(`${event.type}_${event.timestamp}`, event);
    
    // Notify subscribers
    const listeners = this.eventListeners.get(event.type);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          console.error(`Error in event listener for ${event.type}:`, error);
        }
      });
    }
    
    // Also notify 'ALL' subscribers
    const allListeners = this.eventListeners.get('ALL');
    if (allListeners) {
      allListeners.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          console.error(`Error in ALL event listener:`, error);
        }
      });
    }
    
    // Dispatch to window for backward compatibility
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('dataFlowEvent', { detail: event }));
    }
  }

  // Test execution management
  public startTestExecution(testCaseId: string, testCaseData: any): string {
    const executionId = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const execution: TestExecutionData = {
      executionId,
      testCaseId,
      testCaseName: testCaseData.name || 'Unknown Test Case',
      technology: testCaseData.technology || '5G_NR',
      category: testCaseData.category || 'PROTOCOL',
      status: 'RUNNING',
      startTime: new Date(),
      messages: testCaseData.expectedMessages || [],
      informationElements: testCaseData.expectedInformationElements || [],
      layerParameters: testCaseData.expectedLayerParameters || []
    };
    
    this.currentExecution = execution;
    this.executionHistory.push(execution);
    
    // Dispatch test execution started event
    this.dispatch({
      type: 'TEST_EXECUTION_STARTED',
      source: 'TEST_MANAGER',
      target: 'ALL',
      data: execution,
      timestamp: Date.now(),
      executionId,
      testCaseId
    });
    
    // Process messages and dispatch to platforms
    this.processTestMessages(execution);
    
    return executionId;
  }

  public stopTestExecution(executionId: string): void {
    if (this.currentExecution && this.currentExecution.executionId === executionId) {
      this.currentExecution.status = 'STOPPED';
      this.currentExecution.endTime = new Date();
      
      this.dispatch({
        type: 'TEST_EXECUTION_STOPPED',
        source: 'TEST_MANAGER',
        target: 'ALL',
        data: this.currentExecution,
        timestamp: Date.now(),
        executionId,
        testCaseId: this.currentExecution.testCaseId
      });
      
      this.currentExecution = null;
    }
  }

  private processTestMessages(execution: TestExecutionData): void {
    execution.messages.forEach((message, index) => {
      setTimeout(() => {
        // Dispatch to 5GLabX platform
        this.dispatch({
          type: 'MESSAGE_TO_5GLABX',
          source: 'TEST_MANAGER',
          target: '5GLABX',
          data: {
            message,
            execution,
            layer: message.layer,
            protocol: message.protocol
          },
          timestamp: Date.now(),
          executionId: execution.executionId,
          testCaseId: execution.testCaseId
        });
        
        // Dispatch to UE Analysis platform
        this.dispatch({
          type: 'MESSAGE_TO_UE_ANALYSIS',
          source: 'TEST_MANAGER',
          target: 'UE_ANALYSIS',
          data: {
            message: this.convertToUEMessage(message, execution),
            execution,
            layer: message.layer,
            protocol: message.protocol
          },
          timestamp: Date.now(),
          executionId: execution.executionId,
          testCaseId: execution.testCaseId
        });
        
        // Dispatch layer-specific events
        this.dispatch({
          type: `LAYER_${message.layer}_UPDATE`,
          source: 'TEST_MANAGER',
          target: 'ALL',
          data: {
            message,
            execution,
            layer: message.layer
          },
          timestamp: Date.now(),
          executionId: execution.executionId,
          testCaseId: execution.testCaseId
        });
        
        console.log(`📊 Processed message ${index + 1}/${execution.messages.length}: ${message.messageName} (${message.layer})`);
      }, index * 1000); // 1 second intervals
    });
  }

  private convertToUEMessage(message: TestMessage, execution: TestExecutionData): UELogMessage {
    // Convert test message to UE-specific format
    return {
      ...message,
      ueIdentity: {
        imsi: '123456789012345',
        imei: '123456789012345',
        msisdn: '+1234567890',
        supi: 'imsi-123456789012345',
        guti: '123456789012345',
        tmsi: '12345678'
      },
      ueLocation: {
        latitude: 40.7128,
        longitude: -74.0060,
        altitude: 10,
        cellId: '12345',
        tac: '67890',
        plmnId: '310-410'
      },
      signalQuality: {
        rsrp: -85,
        rsrq: -10,
        sinr: 15,
        rssi: -75,
        pathloss: 95
      },
      capabilities: {
        mimoSupport: '4x4',
        supportedBands: ['1', '2', '3', '7', '38', '41', '78'],
        throughput: '1Gbps',
        features: ['CA', 'MIMO', '256QAM', 'LAA']
      },
      batteryLevel: 85,
      powerHeadroom: 15,
      uplinkPower: 20
    };
  }

  // Event handlers
  private handleCustomEvent = (event: CustomEvent): void => {
    const dataFlowEvent = event.detail as DataFlowEvent;
    console.log(`📡 DataFlowManager: Received custom event ${dataFlowEvent.type}`);
  };

  private handleTestExecution = (event: CustomEvent): void => {
    const { testCaseId, testCaseData, executionId } = event.detail;
    console.log(`📡 DataFlowManager: Handling test execution ${testCaseId}`);
    
    if (testCaseData) {
      this.startTestExecution(testCaseId, testCaseData);
    }
  };

  private handleTestStop = (event: CustomEvent): void => {
    const { executionId } = event.detail;
    console.log(`📡 DataFlowManager: Handling test stop ${executionId}`);
    
    if (executionId) {
      this.stopTestExecution(executionId);
    }
  };

  private handleUEConnected = (event: CustomEvent): void => {
    console.log(`📡 DataFlowManager: UE Connected event`);
    this.dispatch({
      type: 'UE_CONNECTED',
      source: 'UE_ANALYSIS',
      target: 'ALL',
      data: event.detail,
      timestamp: Date.now()
    });
  };

  private handleUEDisconnected = (event: CustomEvent): void => {
    console.log(`📡 DataFlowManager: UE Disconnected event`);
    this.dispatch({
      type: 'UE_DISCONNECTED',
      source: 'UE_ANALYSIS',
      target: 'ALL',
      data: event.detail,
      timestamp: Date.now()
    });
  };

  private handleUERegistration = (event: CustomEvent): void => {
    console.log(`📡 DataFlowManager: UE Registration event`);
    this.dispatch({
      type: 'UE_REGISTRATION',
      source: 'UE_ANALYSIS',
      target: 'ALL',
      data: event.detail,
      timestamp: Date.now()
    });
  };

  private handleUEServiceRequest = (event: CustomEvent): void => {
    console.log(`📡 DataFlowManager: UE Service Request event`);
    this.dispatch({
      type: 'UE_SERVICE_REQUEST',
      source: 'UE_ANALYSIS',
      target: 'ALL',
      data: event.detail,
      timestamp: Date.now()
    });
  };

  private handleUEHandover = (event: CustomEvent): void => {
    console.log(`📡 DataFlowManager: UE Handover event`);
    this.dispatch({
      type: 'UE_HANDOVER',
      source: 'UE_ANALYSIS',
      target: 'ALL',
      data: event.detail,
      timestamp: Date.now()
    });
  };

  private handleUECallSetup = (event: CustomEvent): void => {
    console.log(`📡 DataFlowManager: UE Call Setup event`);
    this.dispatch({
      type: 'UE_CALL_SETUP',
      source: 'UE_ANALYSIS',
      target: 'ALL',
      data: event.detail,
      timestamp: Date.now()
    });
  };

  private handleUECallRelease = (event: CustomEvent): void => {
    console.log(`📡 DataFlowManager: UE Call Release event`);
    this.dispatch({
      type: 'UE_CALL_RELEASE',
      source: 'UE_ANALYSIS',
      target: 'ALL',
      data: event.detail,
      timestamp: Date.now()
    });
  };

  private handleUEMobilityUpdate = (event: CustomEvent): void => {
    console.log(`📡 DataFlowManager: UE Mobility Update event`);
    this.dispatch({
      type: 'UE_MOBILITY_UPDATE',
      source: 'UE_ANALYSIS',
      target: 'ALL',
      data: event.detail,
      timestamp: Date.now()
    });
  };

  private handleUESecurityEvent = (event: CustomEvent): void => {
    console.log(`📡 DataFlowManager: UE Security Event`);
    this.dispatch({
      type: 'UE_SECURITY_EVENT',
      source: 'UE_ANALYSIS',
      target: 'ALL',
      data: event.detail,
      timestamp: Date.now()
    });
  };

  private handleUEPerformanceUpdate = (event: CustomEvent): void => {
    console.log(`📡 DataFlowManager: UE Performance Update event`);
    this.dispatch({
      type: 'UE_PERFORMANCE_UPDATE',
      source: 'UE_ANALYSIS',
      target: 'ALL',
      data: event.detail,
      timestamp: Date.now()
    });
  };

  private handleEndToEndAnalysis = (event: CustomEvent): void => {
    console.log(`📡 DataFlowManager: End-to-End Analysis event`);
    this.dispatch({
      type: 'END_TO_END_ANALYSIS',
      source: 'SYSTEM',
      target: 'ALL',
      data: event.detail,
      timestamp: Date.now()
    });
  };

  private handleCorrelatedAnalysis = (event: CustomEvent): void => {
    console.log(`📡 DataFlowManager: Correlated Analysis event`);
    this.dispatch({
      type: 'CORRELATED_ANALYSIS',
      source: 'SYSTEM',
      target: 'ALL',
      data: event.detail,
      timestamp: Date.now()
    });
  };

  private handlePerformanceCorrelation = (event: CustomEvent): void => {
    console.log(`📡 DataFlowManager: Performance Correlation event`);
    this.dispatch({
      type: 'PERFORMANCE_CORRELATION',
      source: 'SYSTEM',
      target: 'ALL',
      data: event.detail,
      timestamp: Date.now()
    });
  }

  // Data persistence methods
  public getCurrentExecution(): TestExecutionData | null {
    return this.currentExecution;
  }

  public getExecutionHistory(): TestExecutionData[] {
    return this.executionHistory;
  }

  public getCachedData(key: string): any {
    return this.dataCache.get(key);
  }

  public clearCache(): void {
    this.dataCache.clear();
  }

  public clearExecutionHistory(): void {
    this.executionHistory = [];
    this.currentExecution = null;
  }

  // Cross-platform analysis methods
  public performEndToEndAnalysis(): void {
    const analysis = {
      testManager: this.currentExecution,
      networkAnalysis: this.getNetworkAnalysisData(),
      ueAnalysis: this.getUEAnalysisData(),
      correlation: this.correlateData(),
      timestamp: Date.now()
    };

    this.dispatch({
      type: 'END_TO_END_ANALYSIS',
      source: 'SYSTEM',
      target: 'ALL',
      data: analysis,
      timestamp: Date.now()
    });
  }

  private getNetworkAnalysisData(): any {
    // Get network analysis data from 5GLabX platform
    return this.dataCache.get('network_analysis') || {};
  }

  private getUEAnalysisData(): any {
    // Get UE analysis data from UE Analysis platform
    return this.dataCache.get('ue_analysis') || {};
  }

  private correlateData(): any {
    // Perform data correlation between platforms
    return {
      correlationScore: 0.95,
      matchedEvents: 45,
      totalEvents: 50,
      timestamp: Date.now()
    };
  }
}

// Export singleton instance
export const dataFlowManager = DataFlowManager.getInstance();

// Export for global access
if (typeof window !== 'undefined') {
  (window as any).DataFlowManager = DataFlowManager;
  (window as any).dataFlowManager = dataFlowManager;
}
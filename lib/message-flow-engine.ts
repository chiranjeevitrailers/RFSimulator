/**
 * Message Flow Engine - Handles 3GPP Protocol Message Flow and Data Flow
 * Implements realistic message sequencing, timing, and data flow simulation
 */

export interface MessageFlowStep {
  step_id: string;
  timestamp: number;
  direction: 'UL' | 'DL' | 'BIDIRECTIONAL';
  layer: string;
  message_type: string;
  message_name: string;
  source: string;
  destination: string;
  data_payload: any;
  information_elements: Record<string, any>;
  layer_parameters: Record<string, any>;
  expected_response?: {
    message_type: string;
    timeout: number;
    validation_criteria: Record<string, any>;
  };
  dependencies: string[];
  processing_delay: number;
  retry_count: number;
  max_retries: number;
}

export interface DataFlowContext {
  session_id: string;
  ue_id: string;
  cell_id: string;
  plmn: { mcc: string; mnc: string };
  current_state: string;
  variables: Record<string, any>;
  layer_states: Record<string, any>;
  message_history: MessageFlowStep[];
  performance_metrics: Record<string, any>;
}

export interface MessageFlowResult {
  step_id: string;
  success: boolean;
  processing_time: number;
  response_data?: any;
  error?: string;
  metrics: Record<string, any>;
  next_steps: string[];
}

export class MessageFlowEngine {
  private static instance: MessageFlowEngine;
  private eventListeners: Map<string, Function[]> = new Map();
  private activeFlows: Map<string, DataFlowContext> = new Map();
  private messageQueue: MessageFlowStep[] = [];
  private isProcessing = false;

  static getInstance(): MessageFlowEngine {
    if (!MessageFlowEngine.instance) {
      MessageFlowEngine.instance = new MessageFlowEngine();
    }
    return MessageFlowEngine.instance;
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

  // Main Message Flow Execution
  async executeMessageFlow(
    messageFlow: MessageFlowStep[],
    context: DataFlowContext
  ): Promise<MessageFlowResult[]> {
    const results: MessageFlowResult[] = [];
    this.activeFlows.set(context.session_id, context);

    this.emit('flow_started', { context, messageFlow });

    try {
      // Process messages in sequence with dependencies
      const processedSteps = new Set<string>();
      let currentIndex = 0;

      while (currentIndex < messageFlow.length) {
        const step = messageFlow[currentIndex];
        
        // Check if dependencies are met
        if (this.areDependenciesMet(step, processedSteps)) {
          const result = await this.processMessageStep(step, context);
          results.push(result);
          processedSteps.add(step.step_id);

          // Update context with step results
          this.updateContext(context, step, result);

          // Emit step completion event
          this.emit('step_completed', { step, result, context });

          // Move to next step
          currentIndex++;
        } else {
          // Wait for dependencies or handle timeout
          await this.waitForDependencies(step, context);
        }
      }

      this.emit('flow_completed', { context, results });
      return results;

    } catch (error) {
      this.emit('flow_failed', { context, error });
      throw error;
    } finally {
      this.activeFlows.delete(context.session_id);
    }
  }

  // Process Individual Message Step
  private async processMessageStep(
    step: MessageFlowStep,
    context: DataFlowContext
  ): Promise<MessageFlowResult> {
    const startTime = Date.now();
    
    this.emit('step_started', { step, context });

    try {
      // Simulate processing delay
      await this.delay(step.processing_delay);

      // Process message based on layer and type
      const result = await this.processMessageByLayer(step, context);
      
      const processingTime = Date.now() - startTime;

      // Generate response if expected
      let responseData = null;
      if (step.expected_response) {
        responseData = await this.generateResponse(step, context, result);
      }

      // Calculate metrics
      const metrics = this.calculateStepMetrics(step, result, processingTime);

      // Determine next steps
      const nextSteps = this.determineNextSteps(step, result, context);

      const messageResult: MessageFlowResult = {
        step_id: step.step_id,
        success: true,
        processing_time: processingTime,
        response_data: responseData,
        metrics,
        next_steps: nextSteps
      };

      this.emit('step_success', { step, result: messageResult, context });
      return messageResult;

    } catch (error) {
      const processingTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      const messageResult: MessageFlowResult = {
        step_id: step.step_id,
        success: false,
        processing_time: processingTime,
        error: errorMessage,
        metrics: {},
        next_steps: []
      };

      this.emit('step_failed', { step, result: messageResult, context });
      return messageResult;
    }
  }

  // Process Message by Protocol Layer
  private async processMessageByLayer(
    step: MessageFlowStep,
    context: DataFlowContext
  ): Promise<any> {
    switch (step.layer) {
      case 'PHY':
        return this.processPHYMessage(step, context);
      case 'MAC':
        return this.processMACMessage(step, context);
      case 'RLC':
        return this.processRLCMessage(step, context);
      case 'PDCP':
        return this.processPDCPMessage(step, context);
      case 'RRC':
        return this.processRRCMessage(step, context);
      case 'NAS':
        return this.processNASMessage(step, context);
      case 'SIP':
        return this.processSIPMessage(step, context);
      case 'IMS':
        return this.processIMSMessage(step, context);
      default:
        return this.processGenericMessage(step, context);
    }
  }

  // PHY Layer Message Processing
  private async processPHYMessage(step: MessageFlowStep, context: DataFlowContext): Promise<any> {
    const { message_type, data_payload, information_elements } = step;
    
    switch (message_type) {
      case 'PRACH_Preamble':
        return {
          layer: 'PHY',
          message_type: 'PRACH_Preamble',
          processing_result: 'preamble_transmitted',
          metrics: {
            preamble_id: information_elements.preamble_id,
            power: information_elements.power || 23,
            timing: information_elements.timing || 0,
            frequency: information_elements.frequency || 3732480
          },
          next_action: 'wait_for_rar'
        };

      case 'RAR':
        return {
          layer: 'PHY',
          message_type: 'RAR',
          processing_result: 'rar_received',
          metrics: {
            ra_rnti: information_elements.ra_rnti,
            ta: information_elements.ta,
            ul_grant: information_elements.ul_grant,
            timing_advance: information_elements.ta
          },
          next_action: 'send_msg3'
        };

      case 'PDSCH':
        return {
          layer: 'PHY',
          message_type: 'PDSCH',
          processing_result: 'data_received',
          metrics: {
            mcs: information_elements.mcs,
            prb_allocation: information_elements.prb_allocation,
            harq_process: information_elements.harq_process,
            rv: information_elements.rv
          },
          next_action: 'process_data'
        };

      case 'PUSCH':
        return {
          layer: 'PHY',
          message_type: 'PUSCH',
          processing_result: 'data_transmitted',
          metrics: {
            mcs: information_elements.mcs,
            prb_allocation: information_elements.prb_allocation,
            harq_process: information_elements.harq_process,
            power: information_elements.power
          },
          next_action: 'wait_for_ack'
        };

      default:
        return {
          layer: 'PHY',
          message_type: message_type,
          processing_result: 'processed',
          metrics: information_elements
        };
    }
  }

  // MAC Layer Message Processing
  private async processMACMessage(step: MessageFlowStep, context: DataFlowContext): Promise<any> {
    const { message_type, data_payload, information_elements } = step;
    
    switch (message_type) {
      case 'MAC_PDU':
        return {
          layer: 'MAC',
          message_type: 'MAC_PDU',
          processing_result: 'pdu_processed',
          metrics: {
            lcid: information_elements.lcid,
            length: information_elements.length,
            harq_process: information_elements.harq_process,
            ndi: information_elements.ndi
          },
          next_action: 'forward_to_rlc'
        };

      case 'BSR':
        return {
          layer: 'MAC',
          message_type: 'BSR',
          processing_result: 'buffer_status_reported',
          metrics: {
            lcg_id: information_elements.lcg_id,
            buffer_size: information_elements.buffer_size,
            bsr_type: information_elements.bsr_type
          },
          next_action: 'schedule_ul_grant'
        };

      case 'PHR':
        return {
          layer: 'MAC',
          message_type: 'PHR',
          processing_result: 'power_headroom_reported',
          metrics: {
            phr: information_elements.phr,
            pcmax: information_elements.pcmax,
            phr_type: information_elements.phr_type
          },
          next_action: 'adjust_power'
        };

      default:
        return {
          layer: 'MAC',
          message_type: message_type,
          processing_result: 'processed',
          metrics: information_elements
        };
    }
  }

  // RLC Layer Message Processing
  private async processRLCMessage(step: MessageFlowStep, context: DataFlowContext): Promise<any> {
    const { message_type, data_payload, information_elements } = step;
    
    switch (message_type) {
      case 'RLC_Data_PDU':
        return {
          layer: 'RLC',
          message_type: 'RLC_Data_PDU',
          processing_result: 'data_pdu_processed',
          metrics: {
            sn: information_elements.sn,
            si: information_elements.si,
            p: information_elements.p,
            data_length: information_elements.data_length
          },
          next_action: 'forward_to_pdcp'
        };

      case 'RLC_Control_PDU':
        return {
          layer: 'RLC',
          message_type: 'RLC_Control_PDU',
          processing_result: 'control_pdu_processed',
          metrics: {
            cpt: information_elements.cpt,
            ack_sn: information_elements.ack_sn,
            nack_sn: information_elements.nack_sn
          },
          next_action: 'process_ack_nack'
        };

      default:
        return {
          layer: 'RLC',
          message_type: message_type,
          processing_result: 'processed',
          metrics: information_elements
        };
    }
  }

  // PDCP Layer Message Processing
  private async processPDCPMessage(step: MessageFlowStep, context: DataFlowContext): Promise<any> {
    const { message_type, data_payload, information_elements } = step;
    
    switch (message_type) {
      case 'PDCP_Data_PDU':
        return {
          layer: 'PDCP',
          message_type: 'PDCP_Data_PDU',
          processing_result: 'data_pdu_processed',
          metrics: {
            pdcp_sn: information_elements.pdcp_sn,
            d_c: information_elements.d_c,
            data_length: information_elements.data_length,
            security_applied: information_elements.security_applied
          },
          next_action: 'forward_to_rlc'
        };

      case 'PDCP_Control_PDU':
        return {
          layer: 'PDCP',
          message_type: 'PDCP_Control_PDU',
          processing_result: 'control_pdu_processed',
          metrics: {
            cpt: information_elements.cpt,
            rohc_feedback: information_elements.rohc_feedback
          },
          next_action: 'process_rohc_feedback'
        };

      default:
        return {
          layer: 'PDCP',
          message_type: message_type,
          processing_result: 'processed',
          metrics: information_elements
        };
    }
  }

  // RRC Layer Message Processing
  private async processRRCMessage(step: MessageFlowStep, context: DataFlowContext): Promise<any> {
    const { message_type, data_payload, information_elements } = step;
    
    switch (message_type) {
      case 'RRCSetupRequest':
        return {
          layer: 'RRC',
          message_type: 'RRCSetupRequest',
          processing_result: 'setup_request_processed',
          metrics: {
            rrc_transaction_id: information_elements.rrc_transaction_id,
            establishment_cause: information_elements.establishment_cause,
            ue_identity: information_elements.ue_identity
          },
          next_action: 'send_rrc_setup'
        };

      case 'RRCSetup':
        return {
          layer: 'RRC',
          message_type: 'RRCSetup',
          processing_result: 'setup_processed',
          metrics: {
            rrc_transaction_id: information_elements.rrc_transaction_id,
            srb1_config: information_elements.srb1_config,
            cell_group_config: information_elements.cell_group_config
          },
          next_action: 'send_rrc_setup_complete'
        };

      case 'RRCSetupComplete':
        return {
          layer: 'RRC',
          message_type: 'RRCSetupComplete',
          processing_result: 'setup_complete_processed',
          metrics: {
            rrc_transaction_id: information_elements.rrc_transaction_id,
            selected_plmn: information_elements.selected_plmn
          },
          next_action: 'rrc_connected'
        };

      case 'RRCReconfiguration':
        return {
          layer: 'RRC',
          message_type: 'RRCReconfiguration',
          processing_result: 'reconfiguration_processed',
          metrics: {
            rrc_transaction_id: information_elements.rrc_transaction_id,
            radio_bearer_config: information_elements.radio_bearer_config,
            meas_config: information_elements.meas_config
          },
          next_action: 'send_reconfiguration_complete'
        };

      default:
        return {
          layer: 'RRC',
          message_type: message_type,
          processing_result: 'processed',
          metrics: information_elements
        };
    }
  }

  // NAS Layer Message Processing
  private async processNASMessage(step: MessageFlowStep, context: DataFlowContext): Promise<any> {
    const { message_type, data_payload, information_elements } = step;
    
    switch (message_type) {
      case 'RegistrationRequest':
        return {
          layer: 'NAS',
          message_type: 'RegistrationRequest',
          processing_result: 'registration_request_processed',
          metrics: {
            nas_key_set_identifier: information_elements.nas_key_set_identifier,
            registration_type: information_elements.registration_type,
            mobile_identity: information_elements.mobile_identity
          },
          next_action: 'send_registration_accept'
        };

      case 'RegistrationAccept':
        return {
          layer: 'NAS',
          message_type: 'RegistrationAccept',
          processing_result: 'registration_accept_processed',
          metrics: {
            nas_key_set_identifier: information_elements.nas_key_set_identifier,
            guti: information_elements.guti,
            tai_list: information_elements.tai_list
          },
          next_action: 'send_registration_complete'
        };

      case 'AuthenticationRequest':
        return {
          layer: 'NAS',
          message_type: 'AuthenticationRequest',
          processing_result: 'authentication_request_processed',
          metrics: {
            nas_key_set_identifier: information_elements.nas_key_set_identifier,
            rand: information_elements.rand,
            autn: information_elements.autn
          },
          next_action: 'send_authentication_response'
        };

      default:
        return {
          layer: 'NAS',
          message_type: message_type,
          processing_result: 'processed',
          metrics: information_elements
        };
    }
  }

  // SIP Layer Message Processing
  private async processSIPMessage(step: MessageFlowStep, context: DataFlowContext): Promise<any> {
    const { message_type, data_payload, information_elements } = step;
    
    switch (message_type) {
      case 'SIP_REGISTER':
        return {
          layer: 'SIP',
          message_type: 'SIP_REGISTER',
          processing_result: 'register_processed',
          metrics: {
            from: information_elements.from,
            to: information_elements.to,
            contact: information_elements.contact,
            expires: information_elements.expires
          },
          next_action: 'send_200_ok'
        };

      case 'SIP_INVITE':
        return {
          layer: 'SIP',
          message_type: 'SIP_INVITE',
          processing_result: 'invite_processed',
          metrics: {
            from: information_elements.from,
            to: information_elements.to,
            call_id: information_elements.call_id,
            sdp: information_elements.sdp
          },
          next_action: 'send_100_trying'
        };

      default:
        return {
          layer: 'SIP',
          message_type: message_type,
          processing_result: 'processed',
          metrics: information_elements
        };
    }
  }

  // IMS Layer Message Processing
  private async processIMSMessage(step: MessageFlowStep, context: DataFlowContext): Promise<any> {
    const { message_type, data_payload, information_elements } = step;
    
    switch (message_type) {
      case 'IMS_Service_Route':
        return {
          layer: 'IMS',
          message_type: 'IMS_Service_Route',
          processing_result: 'service_route_processed',
          metrics: {
            service_route: information_elements.service_route,
            path: information_elements.path,
            p_asserted_identity: information_elements.p_asserted_identity
          },
          next_action: 'update_route'
        };

      default:
        return {
          layer: 'IMS',
          message_type: message_type,
          processing_result: 'processed',
          metrics: information_elements
        };
    }
  }

  // Generic Message Processing
  private async processGenericMessage(step: MessageFlowStep, context: DataFlowContext): Promise<any> {
    return {
      layer: step.layer,
      message_type: step.message_type,
      processing_result: 'processed',
      metrics: step.information_elements
    };
  }

  // Generate Response Message
  private async generateResponse(
    step: MessageFlowStep,
    context: DataFlowContext,
    result: any
  ): Promise<any> {
    const { expected_response } = step;
    
    if (!expected_response) {
      return null;
    }

    // Simulate response generation delay
    await this.delay(50);

    return {
      message_type: expected_response.message_type,
      response_data: {
        success: result.success !== false,
        timestamp: Date.now(),
        correlation_id: step.step_id,
        response_metrics: result.metrics
      },
      validation_criteria: expected_response.validation_criteria
    };
  }

  // Calculate Step Metrics
  private calculateStepMetrics(
    step: MessageFlowStep,
    result: any,
    processingTime: number
  ): Record<string, any> {
    return {
      processing_time_ms: processingTime,
      message_size_bytes: JSON.stringify(step.data_payload).length,
      layer: step.layer,
      direction: step.direction,
      success: result.success !== false,
      timestamp: Date.now(),
      ...result.metrics
    };
  }

  // Determine Next Steps
  private determineNextSteps(
    step: MessageFlowStep,
    result: any,
    context: DataFlowContext
  ): string[] {
    const nextSteps: string[] = [];
    
    // Add next action from result
    if (result.next_action) {
      nextSteps.push(result.next_action);
    }

    // Add conditional next steps based on result
    if (result.success !== false) {
      nextSteps.push(`${step.step_id}_success`);
    } else {
      nextSteps.push(`${step.step_id}_retry`);
    }

    return nextSteps;
  }

  // Update Context with Step Results
  private updateContext(
    context: DataFlowContext,
    step: MessageFlowStep,
    result: MessageFlowResult
  ): void {
    // Update layer states
    if (!context.layer_states[step.layer]) {
      context.layer_states[step.layer] = {};
    }
    context.layer_states[step.layer][step.message_type] = result;

    // Update variables
    if (result.response_data) {
      Object.assign(context.variables, result.response_data);
    }

    // Update performance metrics
    Object.assign(context.performance_metrics, result.metrics);

    // Add to message history
    context.message_history.push({
      ...step,
      processing_result: result
    });
  }

  // Check Dependencies
  private areDependenciesMet(step: MessageFlowStep, processedSteps: Set<string>): boolean {
    return step.dependencies.every(dep => processedSteps.has(dep));
  }

  // Wait for Dependencies
  private async waitForDependencies(step: MessageFlowStep, context: DataFlowContext): Promise<void> {
    // Simple timeout-based waiting
    await this.delay(100);
  }

  // Utility Methods
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get Active Flow Context
  getActiveFlow(sessionId: string): DataFlowContext | undefined {
    return this.activeFlows.get(sessionId);
  }

  // Get All Active Flows
  getAllActiveFlows(): DataFlowContext[] {
    return Array.from(this.activeFlows.values());
  }

  // Stop Flow
  stopFlow(sessionId: string): void {
    this.activeFlows.delete(sessionId);
    this.emit('flow_stopped', { sessionId });
  }

  // Get Flow Statistics
  getFlowStatistics(): Record<string, any> {
    const activeFlows = this.getAllActiveFlows();
    
    return {
      active_flows: activeFlows.length,
      total_messages_processed: activeFlows.reduce((sum, flow) => sum + flow.message_history.length, 0),
      average_processing_time: this.calculateAverageProcessingTime(activeFlows),
      success_rate: this.calculateSuccessRate(activeFlows)
    };
  }

  private calculateAverageProcessingTime(flows: DataFlowContext[]): number {
    const allMessages = flows.flatMap(flow => flow.message_history);
    if (allMessages.length === 0) return 0;
    
    const totalTime = allMessages.reduce((sum, msg) => {
      const result = (msg as any).processing_result;
      return sum + (result?.processing_time_ms || 0);
    }, 0);
    
    return totalTime / allMessages.length;
  }

  private calculateSuccessRate(flows: DataFlowContext[]): number {
    const allMessages = flows.flatMap(flow => flow.message_history);
    if (allMessages.length === 0) return 0;
    
    const successfulMessages = allMessages.filter(msg => {
      const result = (msg as any).processing_result;
      return result?.success !== false;
    });
    
    return (successfulMessages.length / allMessages.length) * 100;
  }
}

// Export the engine instance
export const messageFlowEngine = MessageFlowEngine.getInstance();
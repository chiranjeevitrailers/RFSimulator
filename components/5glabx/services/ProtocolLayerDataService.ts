'use client';

import { createClient } from '@/lib/supabase';

export interface ProtocolLayerMessage {
  id: string;
  timestamp: number;
  direction: 'UL' | 'DL' | 'BIDIRECTIONAL';
  layer: string;
  protocol: string;
  messageType: string;
  messageName: string;
  messageSize: number;
  validationStatus: 'valid' | 'invalid' | 'warning';
  processingTime: number;
  informationElements: any[];
  layerParameters: any[];
  decodedData: any;
}

export interface ProtocolLayerStats {
  messageCount: number;
  successRate: number;
  errorCount: number;
  averageLatency: number;
  throughput: number;
  lastActivity: Date;
}

export interface LayerSpecificData {
  // PHY Layer specific
  pdschStats?: {
    count: number;
    avgThroughput: number;
    avgSinr: number;
    harqProcesses: number;
  };
  puschStats?: {
    count: number;
    avgPower: number;
    successRate: number;
    retransmissions: number;
  };
  pucchStats?: {
    count: number;
    avgCqi: number;
    srCount: number;
    ackNackCount: number;
  };
  channelEstimation?: {
    rsrp: number;
    rsrq: number;
    rssi: number;
  };

  // MAC Layer specific
  harqStats?: {
    processes: number;
    retransmissions: number;
    successRate: number;
  };
  schedulingStats?: {
    dlGrants: number;
    ulGrants: number;
    avgLatency: number;
  };
  bufferStats?: {
    bsr: number;
    dlBuffer: number;
    ulBuffer: number;
  };

  // RLC Layer specific
  amModeStats?: {
    txPdus: number;
    rxPdus: number;
    retransmissions: number;
    sequenceNumber: number;
  };
  umModeStats?: {
    txPdus: number;
    rxPdus: number;
    outOfOrder: number;
    duplicates: number;
  };

  // PDCP Layer specific
  securityStats?: {
    cipheringEnabled: boolean;
    integrityEnabled: boolean;
    keyRefresh: number;
  };
  sequenceStats?: {
    dlSequence: number;
    ulSequence: number;
    maxSequence: number;
  };

  // RRC Layer specific
  connectionStats?: {
    state: string;
    transactionId: number;
    establishmentCause: string;
  };
  measurementStats?: {
    rsrp: number;
    rsrq: number;
    numCells: number;
    reportsSent: number;
  };

  // NAS Layer specific
  registrationStats?: {
    state: string;
    type: string;
    attempts: number;
    success: boolean;
  };
  securityStats?: {
    ksi: number;
    authenticated: boolean;
    ciphered: boolean;
    integrityProtected: boolean;
  };
}

export class ProtocolLayerDataService {
  private supabase = createClient();

  /**
   * Fetch real protocol layer data from Supabase for a specific test execution
   */
  async fetchLayerData(executionId: string, layer: string): Promise<{
    messages: ProtocolLayerMessage[];
    stats: ProtocolLayerStats;
    layerSpecificData: LayerSpecificData;
  }> {
    try {
      console.log(`🔍 Fetching ${layer} layer data for execution: ${executionId}`);

      // Fetch decoded messages for the specific layer
      const { data: messages, error: messagesError } = await this.supabase
        .from('decoded_messages')
        .select(`
          id,
          message_id,
          timestamp_us,
          protocol,
          message_type,
          message_name,
          message_direction,
          layer,
          sublayer,
          source_entity,
          target_entity,
          decoded_data,
          information_elements,
          ie_count,
          validation_status,
          validation_errors,
          validation_warnings,
          message_size,
          processing_time_ms,
          decoded_information_elements(
            id,
            ie_name,
            ie_type,
            ie_value,
            ie_value_hex,
            ie_size,
            mandatory,
            is_valid,
            validation_errors,
            standard_reference
          ),
          decoded_layer_parameters(
            id,
            layer,
            parameter_name,
            parameter_type,
            parameter_value,
            parameter_unit,
            context,
            source,
            is_valid,
            validation_errors,
            standard_reference
          )
        `)
        .eq('test_case_execution_id', executionId)
        .eq('layer', layer)
        .order('timestamp_us', { ascending: true });

      if (messagesError) {
        console.error(`Error fetching ${layer} messages:`, messagesError);
        throw messagesError;
      }

      // Fetch layer parameter analysis
      const { data: layerParams, error: layerParamsError } = await this.supabase
        .from('layer_parameter_analysis')
        .select('*')
        .eq('test_case_execution_id', executionId)
        .eq('layer', layer);

      if (layerParamsError) {
        console.error(`Error fetching ${layer} parameters:`, layerParamsError);
      }

      // Process messages
      const processedMessages: ProtocolLayerMessage[] = (messages || []).map(msg => ({
        id: msg.id,
        timestamp: msg.timestamp_us,
        direction: msg.message_direction as 'UL' | 'DL' | 'BIDIRECTIONAL',
        layer: msg.layer,
        protocol: msg.protocol,
        messageType: msg.message_type,
        messageName: msg.message_name,
        messageSize: msg.message_size || 0,
        validationStatus: msg.validation_status as 'valid' | 'invalid' | 'warning',
        processingTime: msg.processing_time_ms || 0,
        informationElements: msg.decoded_information_elements || [],
        layerParameters: msg.decoded_layer_parameters || [],
        decodedData: msg.decoded_data
      }));

      // Calculate statistics
      const stats = this.calculateLayerStats(processedMessages);

      // Generate layer-specific data
      const layerSpecificData = this.generateLayerSpecificData(processedMessages, layerParams || [], layer);

      console.log(`✅ Fetched ${processedMessages.length} ${layer} messages with stats:`, stats);

      return {
        messages: processedMessages,
        stats,
        layerSpecificData
      };

    } catch (error) {
      console.error(`❌ Error fetching ${layer} layer data:`, error);
      throw error;
    }
  }

  /**
   * Calculate layer statistics from messages
   */
  private calculateLayerStats(messages: ProtocolLayerMessage[]): ProtocolLayerStats {
    if (messages.length === 0) {
      return {
        messageCount: 0,
        successRate: 100,
        errorCount: 0,
        averageLatency: 0,
        throughput: 0,
        lastActivity: new Date()
      };
    }

    const validMessages = messages.filter(msg => msg.validationStatus === 'valid');
    const errorMessages = messages.filter(msg => msg.validationStatus === 'invalid');
    const totalSize = messages.reduce((sum, msg) => sum + msg.messageSize, 0);
    const totalProcessingTime = messages.reduce((sum, msg) => sum + msg.processingTime, 0);
    const timeSpan = messages.length > 1 ? 
      (messages[messages.length - 1].timestamp - messages[0].timestamp) / 1000000 : 1; // Convert to seconds

    return {
      messageCount: messages.length,
      successRate: (validMessages.length / messages.length) * 100,
      errorCount: errorMessages.length,
      averageLatency: totalProcessingTime / messages.length,
      throughput: timeSpan > 0 ? (totalSize * 8) / (timeSpan * 1000000) : 0, // Mbps
      lastActivity: new Date(Math.max(...messages.map(msg => msg.timestamp / 1000)))
    };
  }

  /**
   * Generate layer-specific data based on messages and parameters
   */
  private generateLayerSpecificData(
    messages: ProtocolLayerMessage[], 
    layerParams: any[], 
    layer: string
  ): LayerSpecificData {
    const data: LayerSpecificData = {};

    switch (layer.toUpperCase()) {
      case 'PHY':
        data.pdschStats = this.calculatePhyPdschStats(messages);
        data.puschStats = this.calculatePhyPuschStats(messages);
        data.pucchStats = this.calculatePhyPucchStats(messages);
        data.channelEstimation = this.calculateChannelEstimation(messages, layerParams);
        break;

      case 'MAC':
        data.harqStats = this.calculateMacHarqStats(messages);
        data.schedulingStats = this.calculateMacSchedulingStats(messages);
        data.bufferStats = this.calculateMacBufferStats(messages, layerParams);
        break;

      case 'RLC':
        data.amModeStats = this.calculateRlcAmStats(messages);
        data.umModeStats = this.calculateRlcUmStats(messages);
        break;

      case 'PDCP':
        data.securityStats = this.calculatePdcpSecurityStats(messages, layerParams);
        data.sequenceStats = this.calculatePdcpSequenceStats(messages, layerParams);
        break;

      case 'RRC':
        data.connectionStats = this.calculateRrcConnectionStats(messages);
        data.measurementStats = this.calculateRrcMeasurementStats(messages, layerParams);
        break;

      case 'NAS':
        data.registrationStats = this.calculateNasRegistrationStats(messages);
        data.securityStats = this.calculateNasSecurityStats(messages, layerParams);
        break;
    }

    return data;
  }

  // PHY Layer calculations
  private calculatePhyPdschStats(messages: ProtocolLayerMessage[]) {
    const pdschMessages = messages.filter(msg => 
      msg.messageType.includes('PDSCH') || msg.messageType.includes('DL')
    );
    
    return {
      count: pdschMessages.length,
      avgThroughput: this.calculateAverageThroughput(pdschMessages),
      avgSinr: this.extractParameterValue(messages, 'SINR') || 15,
      harqProcesses: this.extractParameterValue(messages, 'HARQ_PROCESSES') || 8
    };
  }

  private calculatePhyPuschStats(messages: ProtocolLayerMessage[]) {
    const puschMessages = messages.filter(msg => 
      msg.messageType.includes('PUSCH') || (msg.messageType.includes('UL') && msg.direction === 'UL')
    );
    
    return {
      count: puschMessages.length,
      avgPower: this.extractParameterValue(messages, 'TX_POWER') || 23,
      successRate: this.calculateSuccessRate(puschMessages),
      retransmissions: this.countRetransmissions(puschMessages)
    };
  }

  private calculatePhyPucchStats(messages: ProtocolLayerMessage[]) {
    const pucchMessages = messages.filter(msg => 
      msg.messageType.includes('PUCCH')
    );
    
    return {
      count: pucchMessages.length,
      avgCqi: this.extractParameterValue(messages, 'CQI') || 12,
      srCount: this.countMessageType(messages, 'SR'),
      ackNackCount: this.countMessageType(messages, 'ACK') + this.countMessageType(messages, 'NACK')
    };
  }

  private calculateChannelEstimation(messages: ProtocolLayerMessage[], layerParams: any[]) {
    return {
      rsrp: this.extractParameterValue(messages, 'RSRP') || this.extractLayerParamValue(layerParams, 'RSRP') || -85,
      rsrq: this.extractParameterValue(messages, 'RSRQ') || this.extractLayerParamValue(layerParams, 'RSRQ') || -10,
      rssi: this.extractParameterValue(messages, 'RSSI') || this.extractLayerParamValue(layerParams, 'RSSI') || -80
    };
  }

  // MAC Layer calculations
  private calculateMacHarqStats(messages: ProtocolLayerMessage[]) {
    const retransmissions = this.countRetransmissions(messages);
    return {
      processes: this.extractParameterValue(messages, 'HARQ_PROCESSES') || 8,
      retransmissions,
      successRate: this.calculateSuccessRate(messages)
    };
  }

  private calculateMacSchedulingStats(messages: ProtocolLayerMessage[]) {
    const dlMessages = messages.filter(msg => msg.direction === 'DL');
    const ulMessages = messages.filter(msg => msg.direction === 'UL');
    
    return {
      dlGrants: dlMessages.length,
      ulGrants: ulMessages.length,
      avgLatency: this.calculateAverageLatency(messages)
    };
  }

  private calculateMacBufferStats(messages: ProtocolLayerMessage[], layerParams: any[]) {
    return {
      bsr: this.extractLayerParamValue(layerParams, 'BSR') || 0,
      dlBuffer: this.extractLayerParamValue(layerParams, 'DL_BUFFER') || 0,
      ulBuffer: this.extractLayerParamValue(layerParams, 'UL_BUFFER') || 0
    };
  }

  // RLC Layer calculations
  private calculateRlcAmStats(messages: ProtocolLayerMessage[]) {
    const amMessages = messages.filter(msg => 
      msg.messageType.includes('AM') || msg.messageType.includes('ACK')
    );
    
    return {
      txPdus: amMessages.filter(msg => msg.direction === 'UL').length,
      rxPdus: amMessages.filter(msg => msg.direction === 'DL').length,
      retransmissions: this.countRetransmissions(amMessages),
      sequenceNumber: this.extractParameterValue(messages, 'SEQUENCE_NUMBER') || 0
    };
  }

  private calculateRlcUmStats(messages: ProtocolLayerMessage[]) {
    const umMessages = messages.filter(msg => 
      msg.messageType.includes('UM') || msg.messageType.includes('UNACKNOWLEDGED')
    );
    
    return {
      txPdus: umMessages.filter(msg => msg.direction === 'UL').length,
      rxPdus: umMessages.filter(msg => msg.direction === 'DL').length,
      outOfOrder: this.countOutOfOrder(umMessages),
      duplicates: this.countDuplicates(umMessages)
    };
  }

  // PDCP Layer calculations
  private calculatePdcpSecurityStats(messages: ProtocolLayerMessage[], layerParams: any[]) {
    return {
      cipheringEnabled: this.extractLayerParamValue(layerParams, 'CIPHERING_ENABLED') !== false,
      integrityEnabled: this.extractLayerParamValue(layerParams, 'INTEGRITY_ENABLED') !== false,
      keyRefresh: this.extractLayerParamValue(layerParams, 'KEY_REFRESH_COUNT') || 0
    };
  }

  private calculatePdcpSequenceStats(messages: ProtocolLayerMessage[], layerParams: any[]) {
    return {
      dlSequence: this.extractLayerParamValue(layerParams, 'DL_SEQUENCE_NUMBER') || 0,
      ulSequence: this.extractLayerParamValue(layerParams, 'UL_SEQUENCE_NUMBER') || 0,
      maxSequence: 4095
    };
  }

  // RRC Layer calculations
  private calculateRrcConnectionStats(messages: ProtocolLayerMessage[]) {
    const setupMessages = messages.filter(msg => 
      msg.messageType.includes('Setup') || msg.messageType.includes('CONNECTED')
    );
    
    return {
      state: setupMessages.length > 0 ? 'RRC_CONNECTED' : 'RRC_IDLE',
      transactionId: this.extractParameterValue(messages, 'TRANSACTION_ID') || 0,
      establishmentCause: this.extractParameterValue(messages, 'ESTABLISHMENT_CAUSE') || 'mo-Data'
    };
  }

  private calculateRrcMeasurementStats(messages: ProtocolLayerMessage[], layerParams: any[]) {
    const measurementMessages = messages.filter(msg => 
      msg.messageType.includes('Measurement') || msg.messageType.includes('Report')
    );
    
    return {
      rsrp: this.extractLayerParamValue(layerParams, 'RSRP') || -85,
      rsrq: this.extractLayerParamValue(layerParams, 'RSRQ') || -10,
      numCells: this.extractLayerParamValue(layerParams, 'NEIGHBOR_CELLS') || 1,
      reportsSent: measurementMessages.length
    };
  }

  // NAS Layer calculations
  private calculateNasRegistrationStats(messages: ProtocolLayerMessage[]) {
    const registrationMessages = messages.filter(msg => 
      msg.messageType.includes('Registration') || msg.messageType.includes('Attach')
    );
    
    return {
      state: registrationMessages.length > 0 ? 'REGISTERED' : 'DEREGISTERED',
      type: 'initial',
      attempts: registrationMessages.length,
      success: registrationMessages.some(msg => msg.validationStatus === 'valid')
    };
  }

  private calculateNasSecurityStats(messages: ProtocolLayerMessage[], layerParams: any[]) {
    return {
      ksi: this.extractLayerParamValue(layerParams, 'KSI') || 5,
      authenticated: this.extractLayerParamValue(layerParams, 'AUTHENTICATED') !== false,
      ciphered: this.extractLayerParamValue(layerParams, 'CIPHERED') !== false,
      integrityProtected: this.extractLayerParamValue(layerParams, 'INTEGRITY_PROTECTED') !== false
    };
  }

  // Helper methods
  private calculateAverageThroughput(messages: ProtocolLayerMessage[]): number {
    if (messages.length === 0) return 0;
    const totalSize = messages.reduce((sum, msg) => sum + msg.messageSize, 0);
    const timeSpan = messages.length > 1 ? 
      (messages[messages.length - 1].timestamp - messages[0].timestamp) / 1000000 : 1;
    return timeSpan > 0 ? (totalSize * 8) / (timeSpan * 1000000) : 0; // Mbps
  }

  private calculateSuccessRate(messages: ProtocolLayerMessage[]): number {
    if (messages.length === 0) return 100;
    const validMessages = messages.filter(msg => msg.validationStatus === 'valid');
    return (validMessages.length / messages.length) * 100;
  }

  private calculateAverageLatency(messages: ProtocolLayerMessage[]): number {
    if (messages.length === 0) return 0;
    const totalLatency = messages.reduce((sum, msg) => sum + msg.processingTime, 0);
    return totalLatency / messages.length;
  }

  private countRetransmissions(messages: ProtocolLayerMessage[]): number {
    return messages.filter(msg => 
      msg.messageType.includes('RETRANSMIT') || 
      msg.messageType.includes('REPEAT') ||
      msg.validationStatus === 'invalid'
    ).length;
  }

  private countMessageType(messages: ProtocolLayerMessage[], type: string): number {
    return messages.filter(msg => msg.messageType.includes(type)).length;
  }

  private countOutOfOrder(messages: ProtocolLayerMessage[]): number {
    // Simple implementation - could be enhanced with sequence number analysis
    return messages.filter(msg => msg.validationStatus === 'warning').length;
  }

  private countDuplicates(messages: ProtocolLayerMessage[]): number {
    const messageIds = new Set();
    let duplicates = 0;
    messages.forEach(msg => {
      if (messageIds.has(msg.messageName)) {
        duplicates++;
      } else {
        messageIds.add(msg.messageName);
      }
    });
    return duplicates;
  }

  private extractParameterValue(messages: ProtocolLayerMessage[], paramName: string): number | null {
    for (const msg of messages) {
      const param = msg.layerParameters.find(p => 
        p.parameter_name?.toUpperCase().includes(paramName.toUpperCase())
      );
      if (param && param.parameter_value) {
        return parseFloat(param.parameter_value);
      }
    }
    return null;
  }

  private extractLayerParamValue(layerParams: any[], paramName: string): any {
    const param = layerParams.find(p => 
      p.parameter_name?.toUpperCase().includes(paramName.toUpperCase())
    );
    return param ? param.parameter_value : null;
  }
}

export const protocolLayerDataService = new ProtocolLayerDataService();
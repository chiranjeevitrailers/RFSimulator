/**
 * Layer Mapping Utility - Professional Protocol Analyzer
 * Maps decoded messages to protocol layers (PHY, MAC, RLC, PDCP, RRC, NAS, IMS)
 * Based on 3GPP standards and message type analysis
 */

export interface DecodedMessage {
  id: string;
  protocol: string;
  message_type: string;
  message_name: string;
  message_direction: 'UL' | 'DL' | 'BIDIRECTIONAL';
  raw_data?: Uint8Array;
  hex_data?: string;
  decoded_data: any;
  timestamp_us: number;
  source_entity?: string;
  target_entity?: string;
}

export interface LayerMappingResult {
  layer: 'PHY' | 'MAC' | 'RLC' | 'PDCP' | 'RRC' | 'NAS' | 'IMS' | 'E2' | 'PC5';
  sublayer?: string;
  confidence: number; // 0-1 confidence score
  mapping_reason: string;
  standard_reference?: string;
}

export interface InformationElement {
  name: string;
  type: string;
  value: any;
  hex_value?: string;
  binary_value?: string;
  size?: number;
  mandatory: boolean;
  standard_reference?: string;
}

export interface LayerParameter {
  name: string;
  type: string;
  value: any;
  unit?: string;
  context: 'measurement' | 'configuration' | 'status' | 'control';
  source: 'message' | 'derived' | 'calculated';
}

export class LayerMappingUtility {
  private static instance: LayerMappingUtility;
  
  // 5G NR message type to layer mapping
  private static readonly NR_LAYER_MAPPING = {
    // PHY Layer
    'NR-PHY': {
      'SSB': 'PHY',
      'PSS': 'PHY',
      'SSS': 'PHY',
      'PBCH': 'PHY',
      'PDSCH': 'PHY',
      'PUSCH': 'PHY',
      'PDCCH': 'PHY',
      'PUCCH': 'PHY',
      'PRACH': 'PHY',
      'DMRS': 'PHY',
      'CSI-RS': 'PHY',
      'SRS': 'PHY'
    },
    
    // MAC Layer
    'NR-MAC': {
      'MAC-CE': 'MAC',
      'BSR': 'MAC',
      'PHR': 'MAC',
      'RAR': 'MAC',
      'RA-Preamble': 'MAC',
      'MAC-PDU': 'MAC',
      'MAC-SDU': 'MAC'
    },
    
    // RLC Layer
    'NR-RLC': {
      'RLC-AM': 'RLC',
      'RLC-UM': 'RLC',
      'RLC-TM': 'RLC',
      'RLC-Status': 'RLC',
      'RLC-Data': 'RLC',
      'RLC-Control': 'RLC'
    },
    
    // PDCP Layer
    'NR-PDCP': {
      'PDCP-Data': 'PDCP',
      'PDCP-Control': 'PDCP',
      'PDCP-Status': 'PDCP',
      'ROHC': 'PDCP'
    },
    
    // RRC Layer
    'NR-RRC': {
      'RRCSetupRequest': 'RRC',
      'RRCSetup': 'RRC',
      'RRCSetupComplete': 'RRC',
      'RRCReject': 'RRC',
      'RRCResumeRequest': 'RRC',
      'RRCResume': 'RRC',
      'RRCResumeComplete': 'RRC',
      'RRCRelease': 'RRC',
      'RRCReconfiguration': 'RRC',
      'RRCReconfigurationComplete': 'RRC',
      'RRCReconfigurationFailure': 'RRC',
      'SecurityModeCommand': 'RRC',
      'SecurityModeComplete': 'RRC',
      'SecurityModeFailure': 'RRC',
      'UECapabilityEnquiry': 'RRC',
      'UECapabilityInformation': 'RRC',
      'MeasurementReport': 'RRC',
      'MeasurementConfiguration': 'RRC',
      'HandoverPreparationInformation': 'RRC',
      'HandoverCommand': 'RRC',
      'HandoverComplete': 'RRC',
      'HandoverFailure': 'RRC'
    },
    
    // NAS Layer
    'NR-NAS': {
      'RegistrationRequest': 'NAS',
      'RegistrationAccept': 'NAS',
      'RegistrationReject': 'NAS',
      'RegistrationComplete': 'NAS',
      'ServiceRequest': 'NAS',
      'ServiceAccept': 'NAS',
      'ServiceReject': 'NAS',
      'AuthenticationRequest': 'NAS',
      'AuthenticationResponse': 'NAS',
      'AuthenticationReject': 'NAS',
      'AuthenticationFailure': 'NAS',
      'SecurityModeCommand': 'NAS',
      'SecurityModeComplete': 'NAS',
      'SecurityModeReject': 'NAS',
      'IdentityRequest': 'NAS',
      'IdentityResponse': 'NAS',
      'ConfigurationUpdateCommand': 'NAS',
      'ConfigurationUpdateComplete': 'NAS',
      'PDUSessionEstablishmentRequest': 'NAS',
      'PDUSessionEstablishmentAccept': 'NAS',
      'PDUSessionEstablishmentReject': 'NAS',
      'PDUSessionModificationRequest': 'NAS',
      'PDUSessionModificationAccept': 'NAS',
      'PDUSessionModificationReject': 'NAS',
      'PDUSessionReleaseRequest': 'NAS',
      'PDUSessionReleaseCommand': 'NAS',
      'PDUSessionReleaseComplete': 'NAS'
    }
  };

  // 4G LTE message type to layer mapping
  private static readonly LTE_LAYER_MAPPING = {
    // PHY Layer
    'LTE-PHY': {
      'PSS': 'PHY',
      'SSS': 'PHY',
      'PBCH': 'PHY',
      'PDSCH': 'PHY',
      'PUSCH': 'PHY',
      'PDCCH': 'PHY',
      'PUCCH': 'PHY',
      'PRACH': 'PHY',
      'DMRS': 'PHY',
      'SRS': 'PHY',
      'CRS': 'PHY'
    },
    
    // MAC Layer
    'LTE-MAC': {
      'MAC-CE': 'MAC',
      'BSR': 'MAC',
      'PHR': 'MAC',
      'RAR': 'MAC',
      'RA-Preamble': 'MAC',
      'MAC-PDU': 'MAC'
    },
    
    // RLC Layer
    'LTE-RLC': {
      'RLC-AM': 'RLC',
      'RLC-UM': 'RLC',
      'RLC-TM': 'RLC',
      'RLC-Status': 'RLC',
      'RLC-Data': 'RLC'
    },
    
    // PDCP Layer
    'LTE-PDCP': {
      'PDCP-Data': 'PDCP',
      'PDCP-Control': 'PDCP',
      'ROHC': 'PDCP'
    },
    
    // RRC Layer
    'LTE-RRC': {
      'RRCConnectionRequest': 'RRC',
      'RRCConnectionSetup': 'RRC',
      'RRCConnectionSetupComplete': 'RRC',
      'RRCConnectionReject': 'RRC',
      'RRCConnectionReestablishmentRequest': 'RRC',
      'RRCConnectionReestablishment': 'RRC',
      'RRCConnectionReestablishmentComplete': 'RRC',
      'RRCConnectionReestablishmentReject': 'RRC',
      'RRCConnectionRelease': 'RRC',
      'RRCConnectionReconfiguration': 'RRC',
      'RRCConnectionReconfigurationComplete': 'RRC',
      'RRCConnectionReconfigurationFailure': 'RRC',
      'SecurityModeCommand': 'RRC',
      'SecurityModeComplete': 'RRC',
      'SecurityModeFailure': 'RRC',
      'UECapabilityEnquiry': 'RRC',
      'UECapabilityInformation': 'RRC',
      'MeasurementReport': 'RRC',
      'MeasurementConfiguration': 'RRC',
      'HandoverPreparationInformation': 'RRC',
      'HandoverCommand': 'RRC',
      'HandoverComplete': 'RRC',
      'HandoverFailure': 'RRC'
    },
    
    // NAS Layer
    'LTE-NAS': {
      'AttachRequest': 'NAS',
      'AttachAccept': 'NAS',
      'AttachReject': 'NAS',
      'AttachComplete': 'NAS',
      'DetachRequest': 'NAS',
      'DetachAccept': 'NAS',
      'ServiceRequest': 'NAS',
      'ServiceAccept': 'NAS',
      'ServiceReject': 'NAS',
      'AuthenticationRequest': 'NAS',
      'AuthenticationResponse': 'NAS',
      'AuthenticationReject': 'NAS',
      'AuthenticationFailure': 'NAS',
      'SecurityModeCommand': 'NAS',
      'SecurityModeComplete': 'NAS',
      'SecurityModeReject': 'NAS',
      'IdentityRequest': 'NAS',
      'IdentityResponse': 'NAS',
      'TrackingAreaUpdateRequest': 'NAS',
      'TrackingAreaUpdateAccept': 'NAS',
      'TrackingAreaUpdateReject': 'NAS',
      'TrackingAreaUpdateComplete': 'NAS',
      'ESM-InformationRequest': 'NAS',
      'ESM-InformationResponse': 'NAS',
      'ActivateDefaultEPSBearerContextRequest': 'NAS',
      'ActivateDefaultEPSBearerContextAccept': 'NAS',
      'ActivateDefaultEPSBearerContextReject': 'NAS',
      'ActivateDedicatedEPSBearerContextRequest': 'NAS',
      'ActivateDedicatedEPSBearerContextAccept': 'NAS',
      'ActivateDedicatedEPSBearerContextReject': 'NAS',
      'ModifyEPSBearerContextRequest': 'NAS',
      'ModifyEPSBearerContextAccept': 'NAS',
      'ModifyEPSBearerContextReject': 'NAS',
      'DeactivateEPSBearerContextRequest': 'NAS',
      'DeactivateEPSBearerContextAccept': 'NAS'
    }
  };

  // IMS/SIP message type to layer mapping
  private static readonly IMS_LAYER_MAPPING = {
    'SIP': {
      'INVITE': 'IMS',
      '100 Trying': 'IMS',
      '180 Ringing': 'IMS',
      '200 OK': 'IMS',
      'ACK': 'IMS',
      'BYE': 'IMS',
      'CANCEL': 'IMS',
      'REGISTER': 'IMS',
      'OPTIONS': 'IMS',
      'INFO': 'IMS',
      'UPDATE': 'IMS',
      'PRACK': 'IMS',
      'REFER': 'IMS',
      'NOTIFY': 'IMS',
      'SUBSCRIBE': 'IMS',
      'PUBLISH': 'IMS',
      'MESSAGE': 'IMS'
    }
  };

  // O-RAN E2 message type to layer mapping
  private static readonly ORAN_LAYER_MAPPING = {
    'E2': {
      'E2SetupRequest': 'E2',
      'E2SetupResponse': 'E2',
      'E2SetupFailure': 'E2',
      'E2NodeConfigurationUpdate': 'E2',
      'E2NodeConfigurationUpdateAcknowledge': 'E2',
      'E2NodeConfigurationUpdateFailure': 'E2',
      'E2RemovalRequest': 'E2',
      'E2RemovalResponse': 'E2',
      'E2RemovalFailure': 'E2',
      'SubscriptionRequest': 'E2',
      'SubscriptionResponse': 'E2',
      'SubscriptionFailure': 'E2',
      'SubscriptionDeleteRequest': 'E2',
      'SubscriptionDeleteResponse': 'E2',
      'SubscriptionDeleteFailure': 'E2',
      'Indication': 'E2',
      'ControlRequest': 'E2',
      'ControlResponse': 'E2',
      'ControlFailure': 'E2',
      'QueryRequest': 'E2',
      'QueryResponse': 'E2',
      'QueryFailure': 'E2'
    }
  };

  // V2X PC5 message type to layer mapping
  private static readonly V2X_LAYER_MAPPING = {
    'PC5': {
      'PC5-S-Request': 'PC5',
      'PC5-S-Response': 'PC5',
      'PC5-S-Notification': 'PC5',
      'PC5-S-Update': 'PC5',
      'PC5-S-Delete': 'PC5',
      'PC5-S-Status': 'PC5',
      'PC5-RRC': 'PC5',
      'PC5-MAC': 'PC5',
      'PC5-PHY': 'PC5'
    }
  };

  public static getInstance(): LayerMappingUtility {
    if (!LayerMappingUtility.instance) {
      LayerMappingUtility.instance = new LayerMappingUtility();
    }
    return LayerMappingUtility.instance;
  }

  /**
   * Map a decoded message to its protocol layer
   */
  public mapMessageToLayer(message: DecodedMessage): LayerMappingResult {
    const protocol = message.protocol.toUpperCase();
    const messageType = message.message_type;
    const messageName = message.message_name;

    // Try exact match first
    let layer = this.findExactMatch(protocol, messageType, messageName);
    if (layer) {
      return {
        layer: layer.layer,
        sublayer: layer.sublayer,
        confidence: 1.0,
        mapping_reason: `Exact match for ${protocol} ${messageType}`,
        standard_reference: layer.standard_reference
      };
    }

    // Try pattern matching
    layer = this.findPatternMatch(protocol, messageType, messageName);
    if (layer) {
      return {
        layer: layer.layer,
        sublayer: layer.sublayer,
        confidence: 0.8,
        mapping_reason: `Pattern match for ${protocol} ${messageType}`,
        standard_reference: layer.standard_reference
      };
    }

    // Try heuristic analysis
    layer = this.heuristicAnalysis(message);
    if (layer) {
      return {
        layer: layer.layer,
        sublayer: layer.sublayer,
        confidence: layer.confidence,
        mapping_reason: layer.mapping_reason,
        standard_reference: layer.standard_reference
      };
    }

    // Default fallback
    return {
      layer: 'RRC', // Default to RRC for unknown messages
      confidence: 0.1,
      mapping_reason: `Unknown message type, defaulting to RRC layer`,
      standard_reference: 'Unknown'
    };
  }

  /**
   * Extract information elements from a decoded message
   */
  public extractInformationElements(message: DecodedMessage): InformationElement[] {
    const ies: InformationElement[] = [];
    const decodedData = message.decoded_data;

    if (!decodedData || typeof decodedData !== 'object') {
      return ies;
    }

    // Recursively extract IEs from the decoded data
    this.extractIEsRecursive(decodedData, '', ies);

    return ies;
  }

  /**
   * Extract layer parameters from a decoded message
   */
  public extractLayerParameters(message: DecodedMessage, layer: string): LayerParameter[] {
    const parameters: LayerParameter[] = [];
    const decodedData = message.decoded_data;

    if (!decodedData || typeof decodedData !== 'object') {
      return parameters;
    }

    // Extract layer-specific parameters based on the layer
    switch (layer) {
      case 'PHY':
        this.extractPHYParameters(decodedData, parameters);
        break;
      case 'MAC':
        this.extractMACParameters(decodedData, parameters);
        break;
      case 'RLC':
        this.extractRLCParameters(decodedData, parameters);
        break;
      case 'PDCP':
        this.extractPDCPParameters(decodedData, parameters);
        break;
      case 'RRC':
        this.extractRRCParameters(decodedData, parameters);
        break;
      case 'NAS':
        this.extractNASParameters(decodedData, parameters);
        break;
      case 'IMS':
        this.extractIMSParameters(decodedData, parameters);
        break;
      case 'E2':
        this.extractE2Parameters(decodedData, parameters);
        break;
      case 'PC5':
        this.extractPC5Parameters(decodedData, parameters);
        break;
    }

    return parameters;
  }

  /**
   * Validate a message against its layer requirements
   */
  public validateMessage(message: DecodedMessage, layer: string): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Basic validation
    if (!message.message_type) {
      errors.push('Message type is missing');
    }

    if (!message.timestamp_us) {
      errors.push('Timestamp is missing');
    }

    if (!message.decoded_data) {
      errors.push('Decoded data is missing');
    }

    // Layer-specific validation
    switch (layer) {
      case 'PHY':
        this.validatePHYMessage(message, errors, warnings);
        break;
      case 'MAC':
        this.validateMACMessage(message, errors, warnings);
        break;
      case 'RLC':
        this.validateRLCMessage(message, errors, warnings);
        break;
      case 'PDCP':
        this.validatePDCPMessage(message, errors, warnings);
        break;
      case 'RRC':
        this.validateRRCMessage(message, errors, warnings);
        break;
      case 'NAS':
        this.validateNASMessage(message, errors, warnings);
        break;
      case 'IMS':
        this.validateIMSMessage(message, errors, warnings);
        break;
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  private findExactMatch(protocol: string, messageType: string, messageName: string): any {
    const mappings = [
      LayerMappingUtility.NR_LAYER_MAPPING,
      LayerMappingUtility.LTE_LAYER_MAPPING,
      LayerMappingUtility.IMS_LAYER_MAPPING,
      LayerMappingUtility.ORAN_LAYER_MAPPING,
      LayerMappingUtility.V2X_LAYER_MAPPING
    ];

    for (const mapping of mappings) {
      for (const [protocolKey, protocolMapping] of Object.entries(mapping)) {
        if (protocolKey.includes(protocol)) {
          for (const [msgType, layer] of Object.entries(protocolMapping)) {
            if (msgType === messageType || msgType === messageName) {
              return {
                layer,
                standard_reference: this.getStandardReference(protocol, layer)
              };
            }
          }
        }
      }
    }

    return null;
  }

  private findPatternMatch(protocol: string, messageType: string, messageName: string): any {
    // Pattern matching for common message types
    const patterns = [
      { pattern: /Setup|Request|Complete|Reject|Failure/, layer: 'RRC', confidence: 0.9 },
      { pattern: /Registration|Authentication|Security/, layer: 'NAS', confidence: 0.9 },
      { pattern: /INVITE|ACK|BYE|REGISTER/, layer: 'IMS', confidence: 0.9 },
      { pattern: /MAC|BSR|PHR|RAR/, layer: 'MAC', confidence: 0.8 },
      { pattern: /RLC|AM|UM|TM/, layer: 'RLC', confidence: 0.8 },
      { pattern: /PDCP|ROHC/, layer: 'PDCP', confidence: 0.8 },
      { pattern: /PHY|PSS|SSS|PBCH|PDSCH|PUSCH/, layer: 'PHY', confidence: 0.8 }
    ];

    for (const { pattern, layer, confidence } of patterns) {
      if (pattern.test(messageType) || pattern.test(messageName)) {
        return {
          layer,
          confidence,
          standard_reference: this.getStandardReference(protocol, layer)
        };
      }
    }

    return null;
  }

  private heuristicAnalysis(message: DecodedMessage): any {
    const decodedData = message.decoded_data;
    
    // Analyze message size
    if (message.raw_data) {
      const size = message.raw_data.length;
      if (size < 10) {
        return {
          layer: 'PHY',
          confidence: 0.6,
          mapping_reason: 'Small message size suggests PHY layer',
          standard_reference: 'TS 38.211'
        };
      } else if (size > 1000) {
        return {
          layer: 'RRC',
          confidence: 0.6,
          mapping_reason: 'Large message size suggests RRC layer',
          standard_reference: 'TS 38.331'
        };
      }
    }

    // Analyze message direction
    if (message.message_direction === 'UL' && message.message_type.includes('Request')) {
      return {
        layer: 'RRC',
        confidence: 0.7,
        mapping_reason: 'UL request message suggests RRC layer',
        standard_reference: 'TS 38.331'
      };
    }

    // Analyze protocol
    if (message.protocol === 'SIP') {
      return {
        layer: 'IMS',
        confidence: 0.9,
        mapping_reason: 'SIP protocol indicates IMS layer',
        standard_reference: 'RFC 3261'
      };
    }

    return null;
  }

  private extractIEsRecursive(obj: any, path: string, ies: InformationElement[]): void {
    if (typeof obj !== 'object' || obj === null) {
      return;
    }

    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof value === 'object' && value !== null) {
        this.extractIEsRecursive(value, currentPath, ies);
      } else {
        ies.push({
          name: key,
          type: typeof value,
          value: value,
          mandatory: false, // Would need schema to determine
          standard_reference: this.getIEReference(key)
        });
      }
    }
  }

  private extractPHYParameters(data: any, parameters: LayerParameter[]): void {
    // Extract PHY-specific parameters
    const phyParams = ['rsrp', 'rsrq', 'sinr', 'cqi', 'pci', 'arfcn', 'bandwidth'];
    
    for (const param of phyParams) {
      if (data[param] !== undefined) {
        parameters.push({
          name: param,
          type: typeof data[param],
          value: data[param],
          unit: this.getParameterUnit(param),
          context: 'measurement',
          source: 'message'
        });
      }
    }
  }

  private extractMACParameters(data: any, parameters: LayerParameter[]): void {
    // Extract MAC-specific parameters
    const macParams = ['lcid', 'harq_id', 'bsr_level', 'phr_level'];
    
    for (const param of macParams) {
      if (data[param] !== undefined) {
        parameters.push({
          name: param,
          type: typeof data[param],
          value: data[param],
          context: 'control',
          source: 'message'
        });
      }
    }
  }

  private extractRLCParameters(data: any, parameters: LayerParameter[]): void {
    // Extract RLC-specific parameters
    const rlcParams = ['sn', 'si', 'p', 'vr_r', 'vr_mr'];
    
    for (const param of rlcParams) {
      if (data[param] !== undefined) {
        parameters.push({
          name: param,
          type: typeof data[param],
          value: data[param],
          context: 'control',
          source: 'message'
        });
      }
    }
  }

  private extractPDCPParameters(data: any, parameters: LayerParameter[]): void {
    // Extract PDCP-specific parameters
    const pdcpParams = ['pdcp_sn', 'd_c', 'rohc_profile'];
    
    for (const param of pdcpParams) {
      if (data[param] !== undefined) {
        parameters.push({
          name: param,
          type: typeof data[param],
          value: data[param],
          context: 'control',
          source: 'message'
        });
      }
    }
  }

  private extractRRCParameters(data: any, parameters: LayerParameter[]): void {
    // Extract RRC-specific parameters
    const rrcParams = ['rrc_transaction_id', 'establishment_cause', 'ue_identity'];
    
    for (const param of rrcParams) {
      if (data[param] !== undefined) {
        parameters.push({
          name: param,
          type: typeof data[param],
          value: data[param],
          context: 'control',
          source: 'message'
        });
      }
    }
  }

  private extractNASParameters(data: any, parameters: LayerParameter[]): void {
    // Extract NAS-specific parameters
    const nasParams = ['nas_key_set_identifier', 'registration_type', 'mobile_identity'];
    
    for (const param of nasParams) {
      if (data[param] !== undefined) {
        parameters.push({
          name: param,
          type: typeof data[param],
          value: data[param],
          context: 'control',
          source: 'message'
        });
      }
    }
  }

  private extractIMSParameters(data: any, parameters: LayerParameter[]): void {
    // Extract IMS-specific parameters
    const imsParams = ['call_id', 'cseq', 'from', 'to', 'contact'];
    
    for (const param of imsParams) {
      if (data[param] !== undefined) {
        parameters.push({
          name: param,
          type: typeof data[param],
          value: data[param],
          context: 'control',
          source: 'message'
        });
      }
    }
  }

  private extractE2Parameters(data: any, parameters: LayerParameter[]): void {
    // Extract E2-specific parameters
    const e2Params = ['e2_node_id', 'service_model', 'subscription_id'];
    
    for (const param of e2Params) {
      if (data[param] !== undefined) {
        parameters.push({
          name: param,
          type: typeof data[param],
          value: data[param],
          context: 'control',
          source: 'message'
        });
      }
    }
  }

  private extractPC5Parameters(data: any, parameters: LayerParameter[]): void {
    // Extract PC5-specific parameters
    const pc5Params = ['pc5_id', 'service_type', 'prose_id'];
    
    for (const param of pc5Params) {
      if (data[param] !== undefined) {
        parameters.push({
          name: param,
          type: typeof data[param],
          value: data[param],
          context: 'control',
          source: 'message'
        });
      }
    }
  }

  private validatePHYMessage(message: DecodedMessage, errors: string[], warnings: string[]): void {
    // PHY layer validation
    if (!message.raw_data || message.raw_data.length === 0) {
      errors.push('PHY messages must have raw data');
    }
  }

  private validateMACMessage(message: DecodedMessage, errors: string[], warnings: string[]): void {
    // MAC layer validation
    if (!message.decoded_data.lcid && !message.decoded_data.harq_id) {
      warnings.push('MAC message missing LCID or HARQ ID');
    }
  }

  private validateRLCMessage(message: DecodedMessage, errors: string[], warnings: string[]): void {
    // RLC layer validation
    if (!message.decoded_data.sn) {
      errors.push('RLC message missing sequence number');
    }
  }

  private validatePDCPMessage(message: DecodedMessage, errors: string[], warnings: string[]): void {
    // PDCP layer validation
    if (!message.decoded_data.pdcp_sn) {
      errors.push('PDCP message missing sequence number');
    }
  }

  private validateRRCMessage(message: DecodedMessage, errors: string[], warnings: string[]): void {
    // RRC layer validation
    if (!message.decoded_data.rrc_transaction_id && message.message_direction === 'UL') {
      warnings.push('UL RRC message missing transaction ID');
    }
  }

  private validateNASMessage(message: DecodedMessage, errors: string[], warnings: string[]): void {
    // NAS layer validation
    if (!message.decoded_data.nas_key_set_identifier) {
      warnings.push('NAS message missing key set identifier');
    }
  }

  private validateIMSMessage(message: DecodedMessage, errors: string[], warnings: string[]): void {
    // IMS layer validation
    if (!message.decoded_data.call_id) {
      errors.push('SIP message missing Call-ID');
    }
  }

  private getStandardReference(protocol: string, layer: string): string {
    const references: Record<string, Record<string, string>> = {
      'NR': {
        'PHY': 'TS 38.211',
        'MAC': 'TS 38.321',
        'RLC': 'TS 38.322',
        'PDCP': 'TS 38.323',
        'RRC': 'TS 38.331',
        'NAS': 'TS 24.501'
      },
      'LTE': {
        'PHY': 'TS 36.211',
        'MAC': 'TS 36.321',
        'RLC': 'TS 36.322',
        'PDCP': 'TS 36.323',
        'RRC': 'TS 36.331',
        'NAS': 'TS 24.301'
      },
      'SIP': {
        'IMS': 'RFC 3261'
      },
      'E2': {
        'E2': 'O-RAN.WG3.E2AP'
      },
      'PC5': {
        'PC5': 'TS 23.303'
      }
    };

    return references[protocol]?.[layer] || 'Unknown';
  }

  private getIEReference(ieName: string): string {
    // Map IE names to their standard references
    const ieReferences: Record<string, string> = {
      'rsrp': 'TS 38.215',
      'rsrq': 'TS 38.215',
      'sinr': 'TS 38.215',
      'cqi': 'TS 38.214',
      'pci': 'TS 38.211',
      'arfcn': 'TS 38.104',
      'bandwidth': 'TS 38.104',
      'lcid': 'TS 38.321',
      'harq_id': 'TS 38.321',
      'sn': 'TS 38.322',
      'pdcp_sn': 'TS 38.323',
      'rrc_transaction_id': 'TS 38.331',
      'establishment_cause': 'TS 38.331',
      'ue_identity': 'TS 38.331',
      'nas_key_set_identifier': 'TS 24.501',
      'registration_type': 'TS 24.501',
      'mobile_identity': 'TS 24.501',
      'call_id': 'RFC 3261',
      'cseq': 'RFC 3261',
      'from': 'RFC 3261',
      'to': 'RFC 3261',
      'contact': 'RFC 3261'
    };

    return ieReferences[ieName] || 'Unknown';
  }

  private getParameterUnit(paramName: string): string {
    const units: Record<string, string> = {
      'rsrp': 'dBm',
      'rsrq': 'dB',
      'sinr': 'dB',
      'cqi': '',
      'arfcn': '',
      'bandwidth': 'MHz',
      'power': 'dBm',
      'frequency': 'MHz',
      'time': 'ms',
      'latency': 'ms',
      'throughput': 'Mbps'
    };

    return units[paramName] || '';
  }
}

export default LayerMappingUtility;
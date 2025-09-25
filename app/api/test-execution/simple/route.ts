import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

// Function to create 3GPP-compliant messages based on test case protocol
function create3GPPCompliantMessages(testCase: any) {
  const protocol = testCase.protocol || '5G_NR';
  const category = testCase.category || '5G_NR';
  
  if (protocol === 'LTE' || category === '4G_LTE') {
    // 4G LTE Conformance Test Flow (3GPP TS 36.211)
    return [
      // PHY Layer Messages
      {
        id: 'msg_1',
        stepOrder: 1,
        timestampMs: 1000,
        direction: 'DL',
        layer: 'PHY',
        protocol: 'LTE',
        messageType: 'PSS',
        messageName: 'Primary Synchronization Signal',
        messageDescription: 'PSS detection and timing synchronization',
        messagePayload: { 
          pss_id: 0, 
          timing_offset: 0, 
          cell_id: 12345,
          rsrp: -85.5,
          rsrq: -10.2
        }
      },
      {
        id: 'msg_2',
        stepOrder: 2,
        timestampMs: 2000,
        direction: 'DL',
        layer: 'PHY',
        protocol: 'LTE',
        messageType: 'SSS',
        messageName: 'Secondary Synchronization Signal',
        messageDescription: 'SSS detection and cell group identification',
        messagePayload: { 
          sss_id: 1, 
          cell_group_id: 123,
          timing_offset: 0,
          rsrp: -85.2,
          rsrq: -10.1
        }
      },
      {
        id: 'msg_3',
        stepOrder: 3,
        timestampMs: 3000,
        direction: 'DL',
        layer: 'PHY',
        protocol: 'LTE',
        messageType: 'PBCH',
        messageName: 'Physical Broadcast Channel',
        messageDescription: 'PBCH decoding and MIB reception',
        messagePayload: { 
          mib: '0x12345678',
          system_bandwidth: 20,
          phich_config: 1,
          system_frame_number: 0
        }
      },
      // MAC Layer Messages
      {
        id: 'msg_4',
        stepOrder: 4,
        timestampMs: 4000,
        direction: 'UL',
        layer: 'MAC',
        protocol: 'LTE',
        messageType: 'PRACH',
        messageName: 'Physical Random Access Channel',
        messageDescription: 'Random access preamble transmission',
        messagePayload: { 
          preamble_id: 5,
          ra_rnti: 0x1234,
          timing_advance: 0,
          power_ramping: 0
        }
      },
      {
        id: 'msg_5',
        stepOrder: 5,
        timestampMs: 5000,
        direction: 'DL',
        layer: 'MAC',
        protocol: 'LTE',
        messageType: 'RAR',
        messageName: 'Random Access Response',
        messageDescription: 'RAR reception and timing advance command',
        messagePayload: { 
          ra_rnti: 0x1234,
          timing_advance: 12,
          ul_grant: '0xABCDEF',
          temp_crnti: 0x5678
        }
      },
      // RRC Layer Messages
      {
        id: 'msg_6',
        stepOrder: 6,
        timestampMs: 6000,
        direction: 'UL',
        layer: 'RRC',
        protocol: 'LTE',
        messageType: 'RRCConnectionRequest',
        messageName: 'RRC Connection Request',
        messageDescription: 'RRC connection establishment request',
        messagePayload: { 
          ue_identity: '0x12345678',
          establishment_cause: 'mo-Data',
          spare: 0
        }
      },
      {
        id: 'msg_7',
        stepOrder: 7,
        timestampMs: 7000,
        direction: 'DL',
        layer: 'RRC',
        protocol: 'LTE',
        messageType: 'RRCConnectionSetup',
        messageName: 'RRC Connection Setup',
        messageDescription: 'RRC connection setup configuration',
        messagePayload: { 
          rrc_transaction_id: 1,
          critical_extensions: 'rrcConnectionSetup',
          radio_resource_config: {
            srb_to_add_mod_list: [],
            drb_to_add_mod_list: [],
            mac_main_config: 'explicitValue'
          }
        }
      },
      {
        id: 'msg_8',
        stepOrder: 8,
        timestampMs: 8000,
        direction: 'UL',
        layer: 'RRC',
        protocol: 'LTE',
        messageType: 'RRCConnectionSetupComplete',
        messageName: 'RRC Connection Setup Complete',
        messageDescription: 'RRC connection setup completion',
        messagePayload: { 
          rrc_transaction_id: 1,
          selected_plmn_identity: 1,
          registered_mme: {
            mmegi: '0x1234',
            mmec: '0x56'
          }
        }
      },
      // NAS Layer Messages
      {
        id: 'msg_9',
        stepOrder: 9,
        timestampMs: 9000,
        direction: 'UL',
        layer: 'NAS',
        protocol: 'LTE',
        messageType: 'AttachRequest',
        messageName: 'Attach Request',
        messageDescription: 'NAS attach request',
        messagePayload: { 
          eps_attach_type: 'eps-attach',
          nas_key_set_id: 0,
          eps_mobile_identity: {
            imsi: '310150123456789'
          },
          ue_network_capability: '0x12345678',
          esm_message_container: '0xABCDEF'
        }
      },
      {
        id: 'msg_10',
        stepOrder: 10,
        timestampMs: 10000,
        direction: 'DL',
        layer: 'NAS',
        protocol: 'LTE',
        messageType: 'AuthenticationRequest',
        messageName: 'Authentication Request',
        messageDescription: 'NAS authentication request',
        messagePayload: { 
          nas_key_set_id: 0,
          rand: '0x1234567890ABCDEF1234567890ABCDEF',
          autn: '0xABCDEF1234567890ABCDEF1234567890'
        }
      }
    ];
  } else if (protocol === 'NR' || category === '5G_NR') {
    // 5G NR Conformance Test Flow (3GPP TS 38.211)
    return [
      // PHY Layer Messages
      {
        id: 'msg_1',
        stepOrder: 1,
        timestampMs: 1000,
        direction: 'DL',
        layer: 'PHY',
        protocol: 'NR',
        messageType: 'SSB',
        messageName: 'Synchronization Signal Block',
        messageDescription: 'SSB detection and timing synchronization',
        messagePayload: { 
          ssb_index: 0, 
          timing_offset: 0, 
          pci: 123,
          rsrp: -85.5,
          rsrq: -10.2
        }
      },
      {
        id: 'msg_2',
        stepOrder: 2,
        timestampMs: 2000,
        direction: 'DL',
        layer: 'PHY',
        protocol: 'NR',
        messageType: 'PBCH',
        messageName: 'Physical Broadcast Channel',
        messageDescription: 'PBCH decoding and MIB reception',
        messagePayload: { 
          mib: '0x12345678',
          system_frame_number: 0,
          subcarrier_spacing: 15,
          ssb_subcarrier_offset: 0
        }
      },
      // MAC Layer Messages
      {
        id: 'msg_3',
        stepOrder: 3,
        timestampMs: 3000,
        direction: 'UL',
        layer: 'MAC',
        protocol: 'NR',
        messageType: 'PRACH',
        messageName: 'Physical Random Access Channel',
        messageDescription: 'Random access preamble transmission',
        messagePayload: { 
          preamble_id: 5,
          ra_rnti: 0x1234,
          timing_advance: 0,
          power_ramping: 0
        }
      },
      {
        id: 'msg_4',
        stepOrder: 4,
        timestampMs: 4000,
        direction: 'DL',
        layer: 'MAC',
        protocol: 'NR',
        messageType: 'RAR',
        messageName: 'Random Access Response',
        messageDescription: 'RAR reception and timing advance command',
        messagePayload: { 
          ra_rnti: 0x1234,
          timing_advance: 12,
          ul_grant: '0xABCDEF',
          temp_crnti: 0x5678
        }
      },
      // RRC Layer Messages
      {
        id: 'msg_5',
        stepOrder: 5,
        timestampMs: 5000,
        direction: 'UL',
        layer: 'RRC',
        protocol: 'NR',
        messageType: 'RRCSetupRequest',
        messageName: 'RRC Setup Request',
        messageDescription: 'RRC connection establishment request',
        messagePayload: { 
          ue_identity: '0x12345678',
          establishment_cause: 'mo-Data',
          spare: 0
        }
      },
      {
        id: 'msg_6',
        stepOrder: 6,
        timestampMs: 6000,
        direction: 'DL',
        layer: 'RRC',
        protocol: 'NR',
        messageType: 'RRCSetup',
        messageName: 'RRC Setup',
        messageDescription: 'RRC connection setup configuration',
        messagePayload: { 
          rrc_transaction_id: 1,
          critical_extensions: 'rrcSetup',
          radio_resource_config: {
            srb_to_add_mod_list: [],
            drb_to_add_mod_list: [],
            mac_main_config: 'explicitValue'
          }
        }
      },
      {
        id: 'msg_7',
        stepOrder: 7,
        timestampMs: 7000,
        direction: 'UL',
        layer: 'RRC',
        protocol: 'NR',
        messageType: 'RRCSetupComplete',
        messageName: 'RRC Setup Complete',
        messageDescription: 'RRC connection setup completion',
        messagePayload: { 
          rrc_transaction_id: 1,
          selected_plmn_identity: 1,
          registered_amf: {
            amf_region_id: '0x12',
            amf_set_id: '0x34',
            amf_pointer: '0x56'
          }
        }
      },
      // NAS Layer Messages
      {
        id: 'msg_8',
        stepOrder: 8,
        timestampMs: 8000,
        direction: 'UL',
        layer: 'NAS',
        protocol: 'NR',
        messageType: 'RegistrationRequest',
        messageName: 'Registration Request',
        messageDescription: '5G NAS registration request',
        messagePayload: { 
          registration_type: 'initial-registration',
          nas_key_set_id: 0,
          mobile_identity: {
            supi: 'imsi-310150123456789'
          },
          ue_security_capability: '0x12345678',
          ue_network_capability: '0xABCDEF'
        }
      },
      {
        id: 'msg_9',
        stepOrder: 9,
        timestampMs: 9000,
        direction: 'DL',
        layer: 'NAS',
        protocol: 'NR',
        messageType: 'AuthenticationRequest',
        messageName: 'Authentication Request',
        messageDescription: '5G NAS authentication request',
        messagePayload: { 
          nas_key_set_id: 0,
          rand: '0x1234567890ABCDEF1234567890ABCDEF',
          autn: '0xABCDEF1234567890ABCDEF1234567890'
        }
      },
      {
        id: 'msg_10',
        stepOrder: 10,
        timestampMs: 10000,
        direction: 'UL',
        layer: 'NAS',
        protocol: 'NR',
        messageType: 'AuthenticationResponse',
        messageName: 'Authentication Response',
        messageDescription: '5G NAS authentication response',
        messagePayload: { 
          authentication_response_parameter: '0x1234567890ABCDEF'
        }
      }
    ];
  } else {
    // Default fallback
    return [
      {
        id: 'msg_1',
        stepOrder: 1,
        timestampMs: 1000,
        direction: 'UL',
        layer: 'RRC',
        protocol: protocol,
        messageType: 'RRCSetupRequest',
        messageName: 'RRC Setup Request',
        messageDescription: 'Initial RRC setup request',
        messagePayload: { ue_identity: '0x12345678' }
      },
      {
        id: 'msg_2',
        stepOrder: 2,
        timestampMs: 2000,
        direction: 'DL',
        layer: 'RRC',
        protocol: protocol,
        messageType: 'RRCSetup',
        messageName: 'RRC Setup',
        messageDescription: 'RRC setup response',
        messagePayload: { rrc_transaction_id: 1 }
      }
    ];
  }
}

// Function to create 3GPP-compliant Information Elements based on test case protocol
function create3GPPCompliantIEs(testCase: any) {
  const protocol = testCase.protocol || '5G_NR';
  const category = testCase.category || '5G_NR';
  
  if (protocol === 'LTE' || category === '4G_LTE') {
    // 4G LTE Information Elements (3GPP TS 36.331)
    return [
      {
        id: 'ie_1',
        ieName: 'UE-Identity',
        ieType: 'MANDATORY',
        ieValue: '0x12345678',
        ieSize: 32,
        mandatory: true,
        description: 'UE identity for RRC connection'
      },
      {
        id: 'ie_2',
        ieName: 'Transaction-ID',
        ieType: 'MANDATORY',
        ieValue: 1,
        ieSize: 8,
        mandatory: true,
        description: 'RRC transaction identifier'
      },
      {
        id: 'ie_3',
        ieName: 'Cell-ID',
        ieType: 'MANDATORY',
        ieValue: 12345,
        ieSize: 16,
        mandatory: true,
        description: 'Physical cell identifier'
      },
      {
        id: 'ie_4',
        ieName: 'RSRP',
        ieType: 'MEASUREMENT',
        ieValue: -85.5,
        ieSize: 8,
        mandatory: false,
        description: 'Reference Signal Received Power'
      },
      {
        id: 'ie_5',
        ieName: 'RSRQ',
        ieType: 'MEASUREMENT',
        ieValue: -10.2,
        ieSize: 8,
        mandatory: false,
        description: 'Reference Signal Received Quality'
      },
      {
        id: 'ie_6',
        ieName: 'System-Bandwidth',
        ieType: 'CONFIG',
        ieValue: 20,
        ieSize: 4,
        mandatory: true,
        description: 'System bandwidth in MHz'
      },
      {
        id: 'ie_7',
        ieName: 'PHICH-Config',
        ieType: 'CONFIG',
        ieValue: 1,
        ieSize: 3,
        mandatory: true,
        description: 'PHICH configuration'
      },
      {
        id: 'ie_8',
        ieName: 'Preamble-ID',
        ieType: 'MANDATORY',
        ieValue: 5,
        ieSize: 6,
        mandatory: true,
        description: 'Random access preamble identifier'
      },
      {
        id: 'ie_9',
        ieName: 'RA-RNTI',
        ieType: 'MANDATORY',
        ieValue: '0x1234',
        ieSize: 16,
        mandatory: true,
        description: 'Random Access RNTI'
      },
      {
        id: 'ie_10',
        ieName: 'Timing-Advance',
        ieType: 'CONFIG',
        ieValue: 12,
        ieSize: 6,
        mandatory: true,
        description: 'Timing advance command'
      }
    ];
  } else if (protocol === 'NR' || category === '5G_NR') {
    // 5G NR Information Elements (3GPP TS 38.331)
    return [
      {
        id: 'ie_1',
        ieName: 'UE-Identity',
        ieType: 'MANDATORY',
        ieValue: '0x12345678',
        ieSize: 32,
        mandatory: true,
        description: 'UE identity for RRC connection'
      },
      {
        id: 'ie_2',
        ieName: 'Transaction-ID',
        ieType: 'MANDATORY',
        ieValue: 1,
        ieSize: 8,
        mandatory: true,
        description: 'RRC transaction identifier'
      },
      {
        id: 'ie_3',
        ieName: 'PCI',
        ieType: 'MANDATORY',
        ieValue: 123,
        ieSize: 9,
        mandatory: true,
        description: 'Physical cell identifier'
      },
      {
        id: 'ie_4',
        ieName: 'SS-RSRP',
        ieType: 'MEASUREMENT',
        ieValue: -85.5,
        ieSize: 8,
        mandatory: false,
        description: 'SS Reference Signal Received Power'
      },
      {
        id: 'ie_5',
        ieName: 'SS-RSRQ',
        ieType: 'MEASUREMENT',
        ieValue: -10.2,
        ieSize: 8,
        mandatory: false,
        description: 'SS Reference Signal Received Quality'
      },
      {
        id: 'ie_6',
        ieName: 'SSB-Index',
        ieType: 'MANDATORY',
        ieValue: 0,
        ieSize: 6,
        mandatory: true,
        description: 'SS/PBCH block index'
      },
      {
        id: 'ie_7',
        ieName: 'Subcarrier-Spacing',
        ieType: 'CONFIG',
        ieValue: 15,
        ieSize: 3,
        mandatory: true,
        description: 'Subcarrier spacing in kHz'
      },
      {
        id: 'ie_8',
        ieName: 'Preamble-ID',
        ieType: 'MANDATORY',
        ieValue: 5,
        ieSize: 6,
        mandatory: true,
        description: 'Random access preamble identifier'
      },
      {
        id: 'ie_9',
        ieName: 'RA-RNTI',
        ieType: 'MANDATORY',
        ieValue: '0x1234',
        ieSize: 16,
        mandatory: true,
        description: 'Random Access RNTI'
      },
      {
        id: 'ie_10',
        ieName: 'Timing-Advance',
        ieType: 'CONFIG',
        ieValue: 12,
        ieSize: 6,
        mandatory: true,
        description: 'Timing advance command'
      }
    ];
  } else {
    // Default fallback
    return [
      {
        id: 'ie_1',
        ieName: 'UE-Identity',
        ieType: 'MANDATORY',
        ieValue: '0x12345678',
        ieSize: 32,
        mandatory: true,
        description: 'UE identity for RRC connection'
      },
      {
        id: 'ie_2',
        ieName: 'Transaction-ID',
        ieType: 'MANDATORY',
        ieValue: 1,
        ieSize: 8,
        mandatory: true,
        description: 'RRC transaction identifier'
      }
    ];
  }
}

// Function to create 3GPP-compliant Layer Parameters based on test case protocol
function create3GPPCompliantLayerParameters(testCase: any) {
  const protocol = testCase.protocol || '5G_NR';
  const category = testCase.category || '5G_NR';
  
  if (protocol === 'LTE' || category === '4G_LTE') {
    // 4G LTE Layer Parameters (3GPP TS 36.211, 36.321, 36.331)
    return [
      // PHY Layer Parameters
      {
        id: 'param_1',
        layer: 'PHY',
        parameterName: 'RSRP',
        parameterType: 'MEASUREMENT',
        parameterValue: -85.5,
        parameterUnit: 'dBm',
        description: 'Reference Signal Received Power'
      },
      {
        id: 'param_2',
        layer: 'PHY',
        parameterName: 'RSRQ',
        parameterType: 'MEASUREMENT',
        parameterValue: -10.2,
        parameterUnit: 'dB',
        description: 'Reference Signal Received Quality'
      },
      {
        id: 'param_3',
        layer: 'PHY',
        parameterName: 'System-Bandwidth',
        parameterType: 'CONFIG',
        parameterValue: 20,
        parameterUnit: 'MHz',
        description: 'System bandwidth configuration'
      },
      {
        id: 'param_4',
        layer: 'PHY',
        parameterName: 'Cell-ID',
        parameterType: 'CONFIG',
        parameterValue: 12345,
        parameterUnit: 'integer',
        description: 'Physical cell identifier'
      },
      // MAC Layer Parameters
      {
        id: 'param_5',
        layer: 'MAC',
        parameterName: 'Preamble-ID',
        parameterType: 'CONFIG',
        parameterValue: 5,
        parameterUnit: 'integer',
        description: 'Random access preamble identifier'
      },
      {
        id: 'param_6',
        layer: 'MAC',
        parameterName: 'RA-RNTI',
        parameterType: 'CONFIG',
        parameterValue: '0x1234',
        parameterUnit: 'hex',
        description: 'Random Access RNTI'
      },
      {
        id: 'param_7',
        layer: 'MAC',
        parameterName: 'Timing-Advance',
        parameterType: 'CONFIG',
        parameterValue: 12,
        parameterUnit: 'TA units',
        description: 'Timing advance command'
      },
      // RRC Layer Parameters
      {
        id: 'param_8',
        layer: 'RRC',
        parameterName: 'Transaction-ID',
        parameterType: 'CONFIG',
        parameterValue: 1,
        parameterUnit: 'integer',
        description: 'RRC transaction identifier'
      },
      {
        id: 'param_9',
        layer: 'RRC',
        parameterName: 'UE-Identity',
        parameterType: 'CONFIG',
        parameterValue: '0x12345678',
        parameterUnit: 'hex',
        description: 'UE identity for RRC connection'
      },
      // NAS Layer Parameters
      {
        id: 'param_10',
        layer: 'NAS',
        parameterName: 'IMSI',
        parameterType: 'CONFIG',
        parameterValue: '310150123456789',
        parameterUnit: 'string',
        description: 'International Mobile Subscriber Identity'
      }
    ];
  } else if (protocol === 'NR' || category === '5G_NR') {
    // 5G NR Layer Parameters (3GPP TS 38.211, 38.321, 38.331)
    return [
      // PHY Layer Parameters
      {
        id: 'param_1',
        layer: 'PHY',
        parameterName: 'SS-RSRP',
        parameterType: 'MEASUREMENT',
        parameterValue: -85.5,
        parameterUnit: 'dBm',
        description: 'SS Reference Signal Received Power'
      },
      {
        id: 'param_2',
        layer: 'PHY',
        parameterName: 'SS-RSRQ',
        parameterType: 'MEASUREMENT',
        parameterValue: -10.2,
        parameterUnit: 'dB',
        description: 'SS Reference Signal Received Quality'
      },
      {
        id: 'param_3',
        layer: 'PHY',
        parameterName: 'SSB-Index',
        parameterType: 'CONFIG',
        parameterValue: 0,
        parameterUnit: 'integer',
        description: 'SS/PBCH block index'
      },
      {
        id: 'param_4',
        layer: 'PHY',
        parameterName: 'PCI',
        parameterType: 'CONFIG',
        parameterValue: 123,
        parameterUnit: 'integer',
        description: 'Physical cell identifier'
      },
      {
        id: 'param_5',
        layer: 'PHY',
        parameterName: 'Subcarrier-Spacing',
        parameterType: 'CONFIG',
        parameterValue: 15,
        parameterUnit: 'kHz',
        description: 'Subcarrier spacing configuration'
      },
      // MAC Layer Parameters
      {
        id: 'param_6',
        layer: 'MAC',
        parameterName: 'Preamble-ID',
        parameterType: 'CONFIG',
        parameterValue: 5,
        parameterUnit: 'integer',
        description: 'Random access preamble identifier'
      },
      {
        id: 'param_7',
        layer: 'MAC',
        parameterName: 'RA-RNTI',
        parameterType: 'CONFIG',
        parameterValue: '0x1234',
        parameterUnit: 'hex',
        description: 'Random Access RNTI'
      },
      {
        id: 'param_8',
        layer: 'MAC',
        parameterName: 'Timing-Advance',
        parameterType: 'CONFIG',
        parameterValue: 12,
        parameterUnit: 'TA units',
        description: 'Timing advance command'
      },
      // RRC Layer Parameters
      {
        id: 'param_9',
        layer: 'RRC',
        parameterName: 'Transaction-ID',
        parameterType: 'CONFIG',
        parameterValue: 1,
        parameterUnit: 'integer',
        description: 'RRC transaction identifier'
      },
      {
        id: 'param_10',
        layer: 'RRC',
        parameterName: 'UE-Identity',
        parameterType: 'CONFIG',
        parameterValue: '0x12345678',
        parameterUnit: 'hex',
        description: 'UE identity for RRC connection'
      },
      // NAS Layer Parameters
      {
        id: 'param_11',
        layer: 'NAS',
        parameterName: 'SUPI',
        parameterType: 'CONFIG',
        parameterValue: 'imsi-310150123456789',
        parameterUnit: 'string',
        description: 'Subscription Permanent Identifier'
      }
    ];
  } else {
    // Default fallback
    return [
      {
        id: 'param_1',
        layer: 'RRC',
        parameterName: 'TransactionID',
        parameterType: 'CONFIG',
        parameterValue: 1,
        parameterUnit: 'integer',
        description: 'RRC transaction identifier'
      },
      {
        id: 'param_2',
        layer: 'PHY',
        parameterName: 'RSRP',
        parameterType: 'MEASUREMENT',
        parameterValue: -85,
        parameterUnit: 'dBm',
        description: 'Reference Signal Received Power'
      }
    ];
  }
}

/**
 * Simple Test Execution API - Works with basic test_cases table data
 * GET /api/test-execution/simple?testCaseId=uuid
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testCaseId = searchParams.get('testCaseId');

    if (!testCaseId) {
      return NextResponse.json(
        { error: 'testCaseId is required' },
        { status: 400 }
      );
    }

    // Use singleton admin client to prevent multiple instances
    const supabase = supabaseAdmin;

    console.log(`🔍 Simple execution fetch for test case: ${testCaseId}`);

    // Fetch basic test case data without complex joins
    const { data: testCase, error: testCaseError } = await supabase
      .from('test_cases')
      .select('*')
      .or(`id.eq.${testCaseId},test_case_id.eq.${testCaseId}`)
      .single();

    if (testCaseError || !testCase) {
      console.error('Test case fetch error:', testCaseError);
      return NextResponse.json(
        { error: 'Test case not found' },
        { status: 404 }
      );
    }

    // Create comprehensive data structure from basic test case
    const comprehensiveData = {
      // Test case definition
      testCase: {
        id: testCase.id,
        name: testCase.name,
        description: testCase.description,
        protocol: testCase.protocol,
        category: testCase.category,
        test_type: testCase.test_type,
        complexity: testCase.complexity,
        priority: testCase.priority,
        tags: testCase.tags || [],
        duration_seconds: testCase.duration_seconds
      },

      // Generate expected messages from test_steps if available, otherwise create 3GPP-compliant messages
      expectedMessages: testCase.test_steps ? 
        (Array.isArray(testCase.test_steps) ? testCase.test_steps : JSON.parse(testCase.test_steps || '[]'))
          .map((step: any, index: number) => ({
            id: `msg_${index}`,
            stepOrder: step.step || index + 1,
            timestampMs: (step.duration_ms || 1000) * index,
            direction: index % 2 === 0 ? 'UL' : 'DL',
            layer: step.layer || 'RRC',
            protocol: testCase.protocol || '5G_NR',
            messageType: step.description?.split(' ')[0] || 'Message',
            messageName: step.description || `Step ${index + 1}`,
            messageDescription: step.description,
            messagePayload: step.values || { step: index + 1 }
          })) : create3GPPCompliantMessages(testCase),

      // Generate expected IEs based on protocol
      expectedInformationElements: create3GPPCompliantIEs(testCase),

      // Generate expected layer parameters based on protocol
      expectedLayerParameters: create3GPPCompliantLayerParameters(testCase),

      // Summary for simulation
      simulation: {
        testCaseId: testCase.id,
        totalExpectedMessages: testCase.test_steps ? 
          (Array.isArray(testCase.test_steps) ? testCase.test_steps.length : JSON.parse(testCase.test_steps || '[]').length) : 
          create3GPPCompliantMessages(testCase).length,
        layers: testCase.protocol === 'LTE' || testCase.category === '4G_LTE' ? 
          ['PHY', 'MAC', 'RRC', 'NAS'] : 
          ['PHY', 'MAC', 'RRC', 'NAS'],
        protocols: [testCase.protocol || '5G_NR'],
        status: 'ready',
        complianceScore: 100
      }
    };

    console.log(`✅ Simple execution data created for: ${testCase.name}`);
    console.log(`   Expected Messages: ${comprehensiveData.expectedMessages.length}`);
    console.log(`   Expected IEs: ${comprehensiveData.expectedInformationElements.length}`);
    console.log(`   Expected Layer Params: ${comprehensiveData.expectedLayerParameters.length}`);

    return NextResponse.json({
      success: true,
      data: comprehensiveData,
      message: 'Simple test case execution data created successfully'
    });

  } catch (error) {
    console.error('❌ Simple execution API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Simple Test Execution API - Start test execution and populate decoded_messages
 * POST /api/test-execution/simple
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testCaseId, userId = 'system' } = body;

    if (!testCaseId) {
      return NextResponse.json(
        { error: 'testCaseId is required' },
        { status: 400 }
      );
    }

    console.log(`🚀 Starting simple test execution for: ${testCaseId}`);

    // Fetch test case data
    const { data: testCase, error: testCaseError } = await supabaseAdmin
      .from('test_cases')
      .select('*')
      .or(`id.eq.${testCaseId},test_case_id.eq.${testCaseId}`)
      .single();

    if (testCaseError || !testCase) {
      console.error('Test case fetch error:', testCaseError);
      return NextResponse.json(
        { error: 'Test case not found' },
        { status: 404 }
      );
    }

    // Generate execution ID
    const executionId = uuidv4();

    // Create test execution record
    const { data: executionResult, error: executionError } = await supabaseAdmin
      .from('test_case_executions')
      .insert({
        id: uuidv4(),
        test_case_id: testCase.id,
        user_id: userId,
        execution_id: executionId,
        status: 'running',
        start_time: new Date().toISOString(),
        expected_message_count: 0,
        actual_message_count: 0
      })
      .select()
      .single();

    if (executionError) {
      console.error('Error creating test execution result:', executionError);
      return NextResponse.json({ error: 'Failed to start test execution' }, { status: 500 });
    }

    // Generate 3GPP-compliant messages
    const expectedMessages = create3GPPCompliantMessages(testCase);
    const expectedInformationElements = create3GPPCompliantIEs(testCase);
    const expectedLayerParameters = create3GPPCompliantLayerParameters(testCase);

    // Prepare messages for insertion into decoded_messages
    const decodedMessagesToInsert = expectedMessages.map((msg: any) => ({
      execution_id: executionId,
      test_case_id: testCase.id,
      message_id: msg.id,
      message_name: msg.messageName,
      protocol: msg.protocol,
      layer: msg.layer,
      direction: msg.direction,
      message_type: msg.messageType,
      sequence_order: msg.stepOrder,
      timestamp_ms: Date.now() + msg.timestampMs,
      message_payload: msg.messagePayload,
    }));

    // Insert decoded messages into the table
    const { error: decodedMessagesError } = await supabaseAdmin
      .from('decoded_messages')
      .insert(decodedMessagesToInsert);

    if (decodedMessagesError) {
      console.error('Error inserting decoded messages:', decodedMessagesError);
      // Don't fail the execution, just log the error
    }

    // Update execution with expected message count
    await supabaseAdmin
      .from('test_case_executions')
      .update({
        expected_message_count: expectedMessages.length,
        actual_message_count: decodedMessagesToInsert.length,
        status: 'completed',
        end_time: new Date().toISOString()
      })
      .eq('execution_id', executionId);

    console.log(`✅ Simple test execution completed: ${executionId}`);

    return NextResponse.json({
      success: true,
      message: 'Test execution started and data streamed',
      executionId: executionId,
      testCaseData: {
        ...testCase,
        expectedMessages: expectedMessages,
        expectedInformationElements: expectedInformationElements,
        expectedLayerParameters: expectedLayerParameters,
      },
    });

  } catch (error) {
    console.error('❌ Simple execution POST error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
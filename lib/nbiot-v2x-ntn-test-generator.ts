import { TestCase } from './test-cases';

export interface NBIoTV2XNTNTestCaseTemplate {
  name: string;
  category: string;
  description: string;
  protocol_version: string;
  layers: any;
  message_flow: any[];
  duration_ms: number;
  complexity: 'low' | 'medium' | 'high';
  tags: string[];
  prerequisites: any;
  expected_results: any;
  success_criteria: any;
  failure_scenarios: any;
  performance_metrics: any;
  test_environment: any;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export class NBIoTV2XNTNTestCaseGenerator {
  private static generateTestCaseId(category: string, index: number): string {
    const categoryPrefix = category.split('_').map(c => c.substring(0, 2)).join('');
    return `${categoryPrefix}_${categoryPrefix}_${index.toString().padStart(4, '0')}`;
  }

  private static generateNBIoTLayers(): any {
    return {
      "RRC": {
        "message_type": ["RRCConnectionRequest", "RRCConnectionSetup", "RRCConnectionSetupComplete", "RRCConnectionReconfiguration", "RRCConnectionRelease"][Math.floor(Math.random() * 5)],
        "ue_identity": `random_value_${Math.floor(Math.random() * 1000)}`,
        "establishment_cause": ["mo_Data", "mo_Signaling", "mt_Access", "emergency"][Math.floor(Math.random() * 4)],
        "ue_category": "nb1",
        "power_class": ["class3", "class5"][Math.floor(Math.random() * 2)],
        "multi_tone": Math.random() > 0.5,
        "single_tone": Math.random() > 0.5
      }
    };
  }

  private static generateV2XLayers(): any {
    return {
      "PC5": {
        "message_type": ["BSM", "CAM", "DENM", "IVIM", "MAPEM", "SPATEM", "SSEM", "RTCMEM"][Math.floor(Math.random() * 8)],
        "message_id": `message_${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        "timestamp": new Date().toISOString(),
        "source_id": `vehicle_${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        "destination_id": ["broadcast", `vehicle_${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`][Math.floor(Math.random() * 2)],
        "priority": Math.floor(Math.random() * 5) + 1
      }
    };
  }

  private static generateNTNLayers(): any {
    return {
      "NTN": {
        "message_type": ["NTN_CONNECTION_REQUEST", "NTN_CONNECTION_RESPONSE", "NTN_HANDOVER_REQUEST", "NTN_HANDOVER_RESPONSE", "NTN_BEAM_SWITCH", "NTN_POWER_CONTROL"][Math.floor(Math.random() * 6)],
        "message_id": `ntn_${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        "timestamp": new Date().toISOString(),
        "satellite_id": `sat_${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        "beam_id": `beam_${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        "frequency_band": ["S_BAND", "C_BAND", "KU_BAND", "KA_BAND"][Math.floor(Math.random() * 4)]
      }
    };
  }

  private static generateNBIoTParams(): any {
    return {
      "NB_IoT": {
        "plmn_id": `${Math.floor(Math.random() * 1000).toString().padStart(5, '0')}`,
        "cell_id": `${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
        "tac": `${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        "arfcn": Math.floor(Math.random() * 1000) + 2000,
        "bandwidth": [200, 1800, 3600][Math.floor(Math.random() * 3)],
        "subcarrier_spacing": 15,
        "nprach_periodicity": [40, 80, 160, 320, 640, 1280, 2560, 5120, 10240, 20480][Math.floor(Math.random() * 10)],
        "nprach_subcarrier_offset": Math.floor(Math.random() * 12),
        "nprach_num_subcarriers": [12, 24, 36, 48][Math.floor(Math.random() * 4)],
        "nprach_start_time": Math.floor(Math.random() * 16) + 1
      }
    };
  }

  private static generateV2XParams(): any {
    return {
      "V2X": {
        "plmn_id": `${Math.floor(Math.random() * 1000).toString().padStart(5, '0')}`,
        "cell_id": `${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
        "ue_id": `${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`,
        "service_type": ["V2V", "V2I", "V2P", "V2N"][Math.floor(Math.random() * 4)],
        "communication_range": Math.floor(Math.random() * 1000) + 100,
        "message_frequency": Math.floor(Math.random() * 20) + 1,
        "security_level": ["authenticated", "encrypted", "signed"][Math.floor(Math.random() * 3)],
        "vehicle_speed": Math.floor(Math.random() * 200) + 1,
        "vehicle_direction": Math.floor(Math.random() * 360),
        "vehicle_position": {
          "lat": (Math.random() - 0.5) * 180,
          "lon": (Math.random() - 0.5) * 360
        }
      }
    };
  }

  private static generateNTNParams(): any {
    return {
      "NTN_PARAMS": {
        "plmn_id": `${Math.floor(Math.random() * 1000).toString().padStart(5, '0')}`,
        "cell_id": `${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`,
        "ue_id": `${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}`,
        "service_type": "NTN",
        "satellite_altitude": Math.floor(Math.random() * 2000) + 200,
        "satellite_speed": Math.random() * 10 + 5,
        "beam_coverage": Math.floor(Math.random() * 2000) + 500,
        "propagation_delay": Math.floor(Math.random() * 50) + 10,
        "doppler_shift": Math.random() * 2,
        "elevation_angle": Math.floor(Math.random() * 90) + 1
      }
    };
  }

  // NB-IoT Test Cases (50 cases)
  static generateNBIoTTestCases(): NBIoTV2XNTNTestCaseTemplate[] {
    const testCases: NBIoTV2XNTNTestCaseTemplate[] = [];
    
    const nbiotProcedures = [
      'RRC Connection Setup', 'Data Transmission', 'RRC Connection Reconfiguration', 'RRC Connection Release',
      'Random Access', 'Paging', 'System Information', 'Measurement Report', 'Handover', 'Power Control',
      'Scheduling Request', 'Buffer Status Report', 'Channel Quality Indicator', 'Precoding Matrix Indicator',
      'Rank Indicator', 'Sounding Reference Signal', 'Physical Uplink Control Channel', 'Physical Uplink Shared Channel',
      'Physical Downlink Control Channel', 'Physical Downlink Shared Channel', 'Physical Broadcast Channel',
      'Physical Control Format Indicator Channel', 'Physical Hybrid ARQ Indicator Channel', 'Physical Random Access Channel',
      'Synchronization Signal', 'Reference Signal', 'Cell Search', 'Cell Selection', 'Cell Reselection', 'Idle Mode',
      'Connected Mode', 'Discontinuous Reception', 'Discontinuous Transmission', 'Carrier Aggregation', 'MIMO',
      'Beamforming', 'Interference Coordination', 'Load Balancing', 'Mobility Management', 'Security',
      'Quality of Service', 'Traffic Management', 'Resource Allocation', 'Link Adaptation', 'HARQ',
      'ARQ', 'FEC', 'Channel Coding', 'Modulation', 'Demodulation', 'Equalization'
    ];

    for (let i = 1; i <= 50; i++) {
      const procedure = nbiotProcedures[(i - 1) % nbiotProcedures.length];
      const layers = {
        ...this.generateNBIoTLayers(),
        ...this.generateNBIoTParams()
      };

      testCases.push({
        name: `NB-IoT ${procedure}`,
        category: 'NB_IoT',
        description: `NB-IoT ${procedure.toLowerCase()} procedure`,
        protocol_version: 'NB-IoT',
        test_case_id: this.generateTestCaseId('NB_IoT', i),
        layers,
        message_flow: [
          {"timestamp": 0, "direction": "UL", "layer": "RRC", "message": layers.RRC.message_type, "values": {"ue_identity": layers.RRC.ue_identity, "establishment_cause": layers.RRC.establishment_cause}},
          {"timestamp": 10, "direction": "DL", "layer": "RRC", "message": layers.RRC.message_type.replace("Request", "Response"), "values": {"status": "SUCCESS"}}
        ],
        duration_ms: Math.floor(Math.random() * 10000) + 2000,
        complexity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        tags: [procedure.toLowerCase().replace(/\s+/g, '-'), 'nbiot', 'rrc'],
        prerequisites: {"nbiot_network_available": true, "ue_configured": true, "cell_available": true},
        expected_results: {"nbiot_procedure_successful": true, "ue_connected": true},
        success_criteria: {"nbiot_procedure_time_ms": "< 3000", "success_rate_percent": "> 95"},
        failure_scenarios: {"nbiot_procedure_failure": "Cell not available", "ue_failure": "UE not configured"},
        performance_metrics: {"nbiot_procedure_success_rate_percent": "> 95", "connection_time_ms": "< 3000"},
        test_environment: {"nbiot_network": "nbiot-network-001", "cell_id": layers.NB_IoT.cell_id, "bandwidth": layers.NB_IoT.bandwidth},
        priority: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as 'low' | 'medium' | 'high' | 'critical'
      });
    }

    return testCases;
  }

  // V2X Test Cases (50 cases)
  static generateV2XTestCases(): NBIoTV2XNTNTestCaseTemplate[] {
    const testCases: NBIoTV2XNTNTestCaseTemplate[] = [];
    
    const v2xProcedures = [
      'PC5 Communication', 'Uu Communication', 'BSM Transmission', 'CAM Transmission', 'DENM Transmission',
      'IVIM Transmission', 'MAPEM Transmission', 'SPATEM Transmission', 'SSEM Transmission', 'RTCMEM Transmission',
      'V2V Communication', 'V2I Communication', 'V2P Communication', 'V2N Communication', 'PC5 Discovery',
      'PC5 Authentication', 'PC5 Security', 'PC5 Resource Allocation', 'PC5 Power Control', 'PC5 Interference Management',
      'Uu Resource Allocation', 'Uu Power Control', 'Uu Interference Management', 'Uu Mobility Management', 'Uu Security',
      'V2X Service Discovery', 'V2X Service Registration', 'V2X Service Deregistration', 'V2X Service Update',
      'V2X Quality of Service', 'V2X Traffic Management', 'V2X Load Balancing', 'V2X Handover', 'V2X Roaming',
      'V2X Emergency Services', 'V2X Public Safety', 'V2X Commercial Services', 'V2X Private Services',
      'V2X Group Communication', 'V2X Multicast Communication', 'V2X Broadcast Communication', 'V2X Unicast Communication',
      'V2X Proximity Services', 'V2X Location Services', 'V2X Timing Services', 'V2X Synchronization Services',
      'V2X Network Services', 'V2X Application Services', 'V2X Platform Services', 'V2X Infrastructure Services'
    ];

    for (let i = 1; i <= 50; i++) {
      const procedure = v2xProcedures[(i - 1) % v2xProcedures.length];
      const layers = {
        ...this.generateV2XLayers(),
        ...this.generateV2XParams()
      };

      testCases.push({
        name: `V2X ${procedure}`,
        category: 'V2X',
        description: `V2X ${procedure.toLowerCase()} procedure`,
        protocol_version: 'V2X',
        test_case_id: this.generateTestCaseId('V2X', i),
        layers,
        message_flow: [
          {"timestamp": 0, "direction": "UL", "layer": "PC5", "message": layers.PC5.message_type, "values": {"message_id": layers.PC5.message_id, "source_id": layers.PC5.source_id, "priority": layers.PC5.priority}},
          {"timestamp": 5, "direction": "DL", "layer": "PC5", "message": "PC5_ACK", "values": {"message_id": layers.PC5.message_id, "status": "received"}}
        ],
        duration_ms: Math.floor(Math.random() * 8000) + 1000,
        complexity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        tags: [procedure.toLowerCase().replace(/\s+/g, '-'), 'v2x', 'pc5'],
        prerequisites: {"v2x_network_available": true, "pc5_interface_configured": true, "vehicle_connected": true},
        expected_results: {"v2x_procedure_successful": true, "communication_established": true},
        success_criteria: {"v2x_procedure_time_ms": "< 2000", "success_rate_percent": "> 95"},
        failure_scenarios: {"v2x_procedure_failure": "PC5 interface unavailable", "communication_failure": "Communication failed"},
        performance_metrics: {"v2x_procedure_success_rate_percent": "> 95", "communication_time_ms": "< 2000"},
        test_environment: {"v2x_network": "v2x-network-001", "service_type": layers.V2X.service_type, "communication_range": layers.V2X.communication_range},
        priority: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as 'low' | 'medium' | 'high' | 'critical'
      });
    }

    return testCases;
  }

  // NTN Test Cases (50 cases)
  static generateNTNTestCases(): NBIoTV2XNTNTestCaseTemplate[] {
    const testCases: NBIoTV2XNTNTestCaseTemplate[] = [];
    
    const ntnProcedures = [
      'Satellite Connection', 'Handover', 'Beam Switch', 'Power Control', 'Frequency Management',
      'Timing Synchronization', 'Doppler Compensation', 'Propagation Delay Compensation', 'Link Budget Management',
      'Interference Management', 'Load Balancing', 'Resource Allocation', 'Quality of Service', 'Traffic Management',
      'Mobility Management', 'Security Management', 'Authentication', 'Authorization', 'Encryption', 'Decryption',
      'Satellite Tracking', 'Orbit Prediction', 'Visibility Calculation', 'Elevation Angle Calculation',
      'Azimuth Angle Calculation', 'Range Calculation', 'Velocity Calculation', 'Acceleration Calculation',
      'Satellite Constellation Management', 'Ground Station Management', 'Network Management', 'Service Management',
      'Application Management', 'Platform Management', 'Infrastructure Management', 'Operations Management',
      'Maintenance Management', 'Fault Management', 'Performance Management', 'Configuration Management',
      'Accounting Management', 'Security Management', 'Privacy Management', 'Compliance Management',
      'Risk Management', 'Change Management', 'Release Management', 'Incident Management', 'Problem Management',
      'Knowledge Management'
    ];

    for (let i = 1; i <= 50; i++) {
      const procedure = ntnProcedures[(i - 1) % ntnProcedures.length];
      const layers = {
        ...this.generateNTNLayers(),
        ...this.generateNTNParams()
      };

      testCases.push({
        name: `NTN ${procedure}`,
        category: 'NTN',
        description: `NTN ${procedure.toLowerCase()} procedure`,
        protocol_version: 'NTN',
        test_case_id: this.generateTestCaseId('NTN', i),
        layers,
        message_flow: [
          {"timestamp": 0, "direction": "UL", "layer": "NTN", "message": layers.NTN.message_type, "values": {"satellite_id": layers.NTN.satellite_id, "beam_id": layers.NTN.beam_id, "frequency_band": layers.NTN.frequency_band}},
          {"timestamp": 20, "direction": "DL", "layer": "NTN", "message": layers.NTN.message_type.replace("Request", "Response"), "values": {"satellite_id": layers.NTN.satellite_id, "beam_id": layers.NTN.beam_id, "status": "SUCCESS"}}
        ],
        duration_ms: Math.floor(Math.random() * 20000) + 5000,
        complexity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        tags: [procedure.toLowerCase().replace(/\s+/g, '-'), 'ntn', 'satellite'],
        prerequisites: {"ntn_network_available": true, "satellite_visible": true, "ue_configured": true},
        expected_results: {"ntn_procedure_successful": true, "satellite_connected": true},
        success_criteria: {"ntn_procedure_time_ms": "< 10000", "success_rate_percent": "> 90"},
        failure_scenarios: {"ntn_procedure_failure": "Satellite not visible", "connection_failure": "Connection failed"},
        performance_metrics: {"ntn_procedure_success_rate_percent": "> 90", "satellite_availability_percent": "> 95"},
        test_environment: {"ntn_network": "ntn-network-001", "satellite_id": layers.NTN.satellite_id, "beam_id": layers.NTN.beam_id},
        priority: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as 'low' | 'medium' | 'high' | 'critical'
      });
    }

    return testCases;
  }

  // Generate all NB-IoT, V2X, NTN test cases
  static generateAllNBIoTV2XNTNTestCases(): NBIoTV2XNTNTestCaseTemplate[] {
    return [
      ...this.generateNBIoTTestCases(),
      ...this.generateV2XTestCases(),
      ...this.generateNTNTestCases()
    ];
  }

  // Convert template to TestCase format
  static convertToTestCase(template: NBIoTV2XNTNTestCaseTemplate): TestCase {
    return {
      id: '', // Will be generated by database
      name: template.name,
      category: template.category,
      description: template.description,
      protocol_version: template.protocol_version,
      layers: template.layers,
      message_flow: template.message_flow,
      duration_ms: template.duration_ms,
      complexity: template.complexity,
      test_case_id: template.test_case_id,
      tags: template.tags,
      prerequisites: template.prerequisites,
      expected_results: template.expected_results,
      success_criteria: template.success_criteria,
      failure_scenarios: template.failure_scenarios,
      performance_metrics: template.performance_metrics,
      test_environment: template.test_environment,
      is_active: true,
      priority: template.priority,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
}
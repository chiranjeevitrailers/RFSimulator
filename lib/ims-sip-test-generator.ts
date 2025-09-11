import { TestCase } from './test-cases';

export interface IMSSIPTestCaseTemplate {
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

export class IMSSIPTestCaseGenerator {
  private static generateTestCaseId(category: string, index: number): string {
    const categoryPrefix = category.split('_').map(c => c.substring(0, 2)).join('');
    return `IMS${categoryPrefix}_IMS_${index.toString().padStart(4, '0')}`;
  }

  private static generateSIPLayers(): any {
    return {
      "SIP": {
        "method": ["REGISTER", "INVITE", "ACK", "BYE", "CANCEL", "OPTIONS", "INFO", "UPDATE", "PRACK", "REFER", "NOTIFY", "SUBSCRIBE", "PUBLISH", "MESSAGE"][Math.floor(Math.random() * 14)],
        "from": `sip:user${Math.floor(Math.random() * 1000)}@domain.com`,
        "to": `sip:user${Math.floor(Math.random() * 1000)}@domain.com`,
        "call_id": Math.random().toString(36).substring(2, 15) + "@kamailio.org",
        "cseq": Math.floor(Math.random() * 100) + 1,
        "contact": `sip:user${Math.floor(Math.random() * 1000)}@192.168.1.${Math.floor(Math.random() * 255)}:5060`,
        "expires": Math.floor(Math.random() * 7200) + 3600,
        "via": `SIP/2.0/UDP 192.168.1.${Math.floor(Math.random() * 255)}:5060;branch=z9hG4bK${Math.random().toString(36).substring(2, 15)}`,
        "max_forwards": 70,
        "user_agent": "5GLabX-SIP-Client/1.0",
        "content_length": Math.floor(Math.random() * 1000),
        "content_type": ["application/sdp", "text/plain", "application/xml"][Math.floor(Math.random() * 3)]
      }
    };
  }

  private static generateIMSLayers(): any {
    return {
      "IMS": {
        "p_asserted_identity": `sip:user${Math.floor(Math.random() * 1000)}@domain.com`,
        "p_associated_uri": `sip:user${Math.floor(Math.random() * 1000)}@domain.com`,
        "security_verify": "Digest realm=\"domain.com\"",
        "service_route": "sip:scscf.domain.com:5060",
        "path": "sip:pcscf.domain.com:5060;lr",
        "p_charging_vector": `icid-value=${Math.floor(Math.random() * 10000000000)}`,
        "p_charging_function_addresses": "ccf=ccf.domain.com;ecf=ecf.domain.com"
      }
    };
  }

  private static generateSDPLayers(): any {
    return {
      "SDP": {
        "version": 0,
        "origin": `user${Math.floor(Math.random() * 1000)} ${Math.floor(Math.random() * 10000000000)} ${Math.floor(Math.random() * 10000000000)} IN IP4 192.168.1.${Math.floor(Math.random() * 255)}`,
        "session_name": "5GLabX Session",
        "connection": `IN IP4 192.168.1.${Math.floor(Math.random() * 255)}`,
        "media": {
          "type": ["audio", "video", "application"][Math.floor(Math.random() * 3)],
          "port": Math.floor(Math.random() * 10000) + 5000,
          "protocol": "RTP/AVP",
          "codecs": ["PCMU", "PCMA", "G722", "H264", "VP8"][Math.floor(Math.random() * 5)]
        }
      }
    };
  }

  private static generatePIDFLayers(): any {
    return {
      "PIDF": {
        "entity": `sip:user${Math.floor(Math.random() * 1000)}@domain.com`,
        "status": ["open", "closed", "busy"][Math.floor(Math.random() * 3)],
        "note": ["Available for calls", "Busy", "Away", "Do not disturb"][Math.floor(Math.random() * 4)],
        "timestamp": new Date().toISOString()
      }
    };
  }

  // Registration Test Cases (25 cases)
  static generateRegistrationTestCases(): IMSSIPTestCaseTemplate[] {
    const testCases: IMSSIPTestCaseTemplate[] = [];
    
    const registrationProcedures = [
      'SIP Registration', 'SIP Registration with Digest Authentication', 'SIP Registration with TLS', 'SIP Registration with SRTP',
      'SIP Registration with IPv6', 'SIP Registration with Multiple Contacts', 'SIP Registration with Service Route',
      'SIP Registration with Path Header', 'SIP Registration with P-Asserted-Identity', 'SIP Registration with P-Charging-Vector',
      'SIP Registration with P-Charging-Function-Addresses', 'SIP Registration with Security-Verify',
      'SIP Registration with P-Associated-URI', 'SIP Registration with P-Visited-Network-ID',
      'SIP Registration with P-Access-Network-Info', 'SIP Registration with P-Called-Party-ID',
      'SIP Registration with P-Served-User', 'SIP Registration with P-Profile-Key',
      'SIP Registration with P-User-Database', 'SIP Registration with P-User-Location-Info',
      'SIP Registration with P-User-Data', 'SIP Registration with P-User-Profile',
      'SIP Registration with P-User-Service-Info', 'SIP Registration with P-User-Session-Info',
      'SIP Registration with P-User-Context-Info'
    ];

    for (let i = 1; i <= 25; i++) {
      const procedure = registrationProcedures[(i - 1) % registrationProcedures.length];
      const layers = {
        ...this.generateSIPLayers(),
        ...this.generateIMSLayers()
      };

      testCases.push({
        name: `IMS ${procedure}`,
        category: 'IMS_SIP',
        description: `SIP user performs ${procedure.toLowerCase()} procedure in IMS network`,
        protocol_version: 'IMS',
        test_case_id: this.generateTestCaseId('IMS_SIP', i),
        layers,
        message_flow: [
          {"timestamp": 0, "direction": "UL", "layer": "SIP", "message": "REGISTER sip:domain.com SIP/2.0", "values": {"from": layers.SIP.from, "contact": layers.SIP.contact, "expires": layers.SIP.expires}},
          {"timestamp": 10, "direction": "DL", "layer": "SIP", "message": "SIP/2.0 401 Unauthorized", "values": {"www_authenticate": "Digest realm=\"domain.com\", nonce=\"abc123\", algorithm=MD5"}},
          {"timestamp": 20, "direction": "UL", "layer": "SIP", "message": "REGISTER sip:domain.com SIP/2.0 (Auth)", "values": {"authorization": "Digest username=\"user\", realm=\"domain.com\", nonce=\"abc123\", response=\"def456\""}},
          {"timestamp": 30, "direction": "DL", "layer": "SIP", "message": "SIP/2.0 200 OK", "values": {"contact": layers.SIP.contact, "expires": layers.SIP.expires, "service_route": "sip:scscf.domain.com:5060"}}
        ],
        duration_ms: Math.floor(Math.random() * 30000) + 10000,
        complexity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        tags: [procedure.toLowerCase().replace(/\s+/g, '-'), 'sip-registration', 'ims'],
        prerequisites: {"ims_network_available": true, "sip_client_configured": true},
        expected_results: {"registration_successful": true, "contact_registered": true},
        success_criteria: {"registration_time_ms": "< 1000", "success_rate_percent": "> 95"},
        failure_scenarios: {"registration_failure": "Authentication failed", "network_failure": "IMS core unavailable"},
        performance_metrics: {"registration_success_rate_percent": "> 99", "response_time_ms": "< 500"},
        test_environment: {"ims_core": "kamailio", "sip_transport": "UDP", "port": 5060},
        priority: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as 'low' | 'medium' | 'high' | 'critical'
      });
    }

    return testCases;
  }

  // Call Control Test Cases (25 cases)
  static generateCallControlTestCases(): IMSSIPTestCaseTemplate[] {
    const testCases: IMSSIPTestCaseTemplate[] = [];
    
    const callControlProcedures = [
      'SIP Call Setup - INVITE', 'SIP Call Termination - BYE', 'SIP Call Hold - Re-INVITE', 'SIP Call Resume - Re-INVITE',
      'SIP Call Transfer - REFER', 'SIP Call Forwarding', 'SIP Call Waiting', 'SIP Call Conference',
      'SIP Call with Early Media', 'SIP Call with Late Media', 'SIP Call with Media Update',
      'SIP Call with Codec Negotiation', 'SIP Call with DTMF', 'SIP Call with Hold/Resume',
      'SIP Call with Transfer', 'SIP Call with Conference', 'SIP Call with Recording',
      'SIP Call with Encryption', 'SIP Call with QoS', 'SIP Call with NAT Traversal',
      'SIP Call with IPv6', 'SIP Call with SRTP', 'SIP Call with ICE', 'SIP Call with TURN',
      'SIP Call with STUN'
    ];

    for (let i = 1; i <= 25; i++) {
      const procedure = callControlProcedures[(i - 1) % callControlProcedures.length];
      const layers = {
        ...this.generateSIPLayers(),
        ...this.generateIMSLayers(),
        ...this.generateSDPLayers()
      };

      testCases.push({
        name: `IMS ${procedure}`,
        category: 'IMS_SIP',
        description: `SIP user performs ${procedure.toLowerCase()} procedure in IMS network`,
        protocol_version: 'IMS',
        test_case_id: this.generateTestCaseId('IMS_SIP', i + 25),
        layers,
        message_flow: [
          {"timestamp": 0, "direction": "UL", "layer": "SIP", "message": "INVITE sip:user2@domain.com SIP/2.0", "values": {"from": layers.SIP.from, "to": layers.SIP.to, "call_id": layers.SIP.call_id}},
          {"timestamp": 100, "direction": "DL", "layer": "SIP", "message": "SIP/2.0 100 Trying", "values": {}},
          {"timestamp": 200, "direction": "DL", "layer": "SIP", "message": "SIP/2.0 180 Ringing", "values": {}},
          {"timestamp": 3000, "direction": "DL", "layer": "SIP", "message": "SIP/2.0 200 OK", "values": {"contact": layers.SIP.contact, "content_type": "application/sdp"}},
          {"timestamp": 3100, "direction": "UL", "layer": "SIP", "message": "ACK sip:user2@domain.com SIP/2.0", "values": {}}
        ],
        duration_ms: Math.floor(Math.random() * 20000) + 5000,
        complexity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        tags: [procedure.toLowerCase().replace(/\s+/g, '-'), 'sip-call-control', 'ims'],
        prerequisites: {"ims_network_available": true, "both_users_registered": true},
        expected_results: {"call_setup_successful": true, "sdp_negotiation_successful": true},
        success_criteria: {"call_setup_time_ms": "< 5000", "success_rate_percent": "> 95"},
        failure_scenarios: {"call_setup_failure": "User not available", "sdp_failure": "Codec negotiation failed"},
        performance_metrics: {"call_setup_success_rate_percent": "> 95", "sdp_success_rate_percent": "> 98"},
        test_environment: {"ims_core": "kamailio", "call_type": "audio", "codecs": ["PCMU", "PCMA"]},
        priority: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as 'low' | 'medium' | 'high' | 'critical'
      });
    }

    return testCases;
  }

  // Presence Test Cases (25 cases)
  static generatePresenceTestCases(): IMSSIPTestCaseTemplate[] {
    const testCases: IMSSIPTestCaseTemplate[] = [];
    
    const presenceProcedures = [
      'SIP Presence - PUBLISH', 'SIP Presence - SUBSCRIBE', 'SIP Presence - NOTIFY', 'SIP Presence - Unsubscribe',
      'SIP Presence with PIDF', 'SIP Presence with Rich Presence', 'SIP Presence with Geolocation',
      'SIP Presence with Activity', 'SIP Presence with Mood', 'SIP Presence with Note',
      'SIP Presence with Contact', 'SIP Presence with Service', 'SIP Presence with Device',
      'SIP Presence with Person', 'SIP Presence with Tuple', 'SIP Presence with Status',
      'SIP Presence with Timestamp', 'SIP Presence with Priority', 'SIP Presence with Class',
      'SIP Presence with Sub-Status', 'SIP Presence with Icon', 'SIP Presence with Display-Name',
      'SIP Presence with Homepage', 'SIP Presence with Birthday', 'SIP Presence with Anniversary'
    ];

    for (let i = 1; i <= 25; i++) {
      const procedure = presenceProcedures[(i - 1) % presenceProcedures.length];
      const layers = {
        ...this.generateSIPLayers(),
        ...this.generateIMSLayers(),
        ...this.generatePIDFLayers()
      };

      testCases.push({
        name: `IMS ${procedure}`,
        category: 'IMS_SIP',
        description: `SIP user performs ${procedure.toLowerCase()} procedure in IMS network`,
        protocol_version: 'IMS',
        test_case_id: this.generateTestCaseId('IMS_SIP', i + 50),
        layers,
        message_flow: [
          {"timestamp": 0, "direction": "UL", "layer": "SIP", "message": "PUBLISH sip:user@domain.com SIP/2.0", "values": {"from": layers.SIP.from, "event": "presence", "expires": layers.SIP.expires}},
          {"timestamp": 50, "direction": "DL", "layer": "SIP", "message": "SIP/2.0 200 OK", "values": {"expires": layers.SIP.expires, "sip_etag": "presence123"}}
        ],
        duration_ms: Math.floor(Math.random() * 10000) + 2000,
        complexity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        tags: [procedure.toLowerCase().replace(/\s+/g, '-'), 'sip-presence', 'ims'],
        prerequisites: {"ims_network_available": true, "presence_server_configured": true},
        expected_results: {"presence_published": true, "presence_server_updated": true},
        success_criteria: {"publish_time_ms": "< 500", "success_rate_percent": "> 95"},
        failure_scenarios: {"publish_failure": "Presence server unavailable", "pidf_failure": "Invalid PIDF format"},
        performance_metrics: {"publish_success_rate_percent": "> 98"},
        test_environment: {"ims_core": "kamailio", "presence_server": "presence.domain.com", "event": "presence"},
        priority: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as 'low' | 'medium' | 'high' | 'critical'
      });
    }

    return testCases;
  }

  // Messaging Test Cases (25 cases)
  static generateMessagingTestCases(): IMSSIPTestCaseTemplate[] {
    const testCases: IMSSIPTestCaseTemplate[] = [];
    
    const messagingProcedures = [
      'SIP Instant Message - MESSAGE', 'SIP Message with Delivery Status', 'SIP Message with Read Receipt',
      'SIP Message with Typing Indicator', 'SIP Message with File Transfer', 'SIP Message with Image',
      'SIP Message with Video', 'SIP Message with Audio', 'SIP Message with Location',
      'SIP Message with Contact', 'SIP Message with Calendar', 'SIP Message with Task',
      'SIP Message with Note', 'SIP Message with Reminder', 'SIP Message with Alert',
      'SIP Message with Notification', 'SIP Message with Invitation', 'SIP Message with Response',
      'SIP Message with Update', 'SIP Message with Delete', 'SIP Message with Forward',
      'SIP Message with Reply', 'SIP Message with Reply All', 'SIP Message with Copy',
      'SIP Message with Blind Copy'
    ];

    for (let i = 1; i <= 25; i++) {
      const procedure = messagingProcedures[(i - 1) % messagingProcedures.length];
      const layers = {
        ...this.generateSIPLayers(),
        ...this.generateIMSLayers()
      };

      testCases.push({
        name: `IMS ${procedure}`,
        category: 'IMS_SIP',
        description: `SIP user performs ${procedure.toLowerCase()} procedure in IMS network`,
        protocol_version: 'IMS',
        test_case_id: this.generateTestCaseId('IMS_SIP', i + 75),
        layers,
        message_flow: [
          {"timestamp": 0, "direction": "UL", "layer": "SIP", "message": "MESSAGE sip:user2@domain.com SIP/2.0", "values": {"from": layers.SIP.from, "to": layers.SIP.to, "content_type": "text/plain"}},
          {"timestamp": 50, "direction": "DL", "layer": "SIP", "message": "SIP/2.0 200 OK", "values": {}}
        ],
        duration_ms: Math.floor(Math.random() * 5000) + 1000,
        complexity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
        tags: [procedure.toLowerCase().replace(/\s+/g, '-'), 'sip-messaging', 'ims'],
        prerequisites: {"ims_network_available": true, "both_users_registered": true},
        expected_results: {"message_sent": true, "message_delivered": true},
        success_criteria: {"message_delivery_time_ms": "< 500", "success_rate_percent": "> 95"},
        failure_scenarios: {"message_failure": "User not available", "delivery_failure": "Message server unavailable"},
        performance_metrics: {"message_success_rate_percent": "> 98"},
        test_environment: {"ims_core": "kamailio", "message_type": "text/plain", "encoding": "UTF-8"},
        priority: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as 'low' | 'medium' | 'high' | 'critical'
      });
    }

    return testCases;
  }

  // Generate all IMS/SIP test cases
  static generateAllIMSSIPTestCases(): IMSSIPTestCaseTemplate[] {
    return [
      ...this.generateRegistrationTestCases(),
      ...this.generateCallControlTestCases(),
      ...this.generatePresenceTestCases(),
      ...this.generateMessagingTestCases()
    ];
  }

  // Convert template to TestCase format
  static convertToTestCase(template: IMSSIPTestCaseTemplate): TestCase {
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
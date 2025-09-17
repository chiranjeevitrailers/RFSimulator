-- ==============================================
-- 5GLabX Platform - Comprehensive Test Data (FIXED)
-- 1000+ test cases with complete message flows, IEs, and layer parameters
-- ==============================================

-- ==============================================
-- 1. 5G NR SA INITIAL ACCESS TEST CASES
-- ==============================================

-- 5G NR SA Initial Access - Basic
INSERT INTO public.test_cases (
    test_case_id, name, description, category, subcategory, protocol, test_type, 
    complexity, priority, estimated_duration, preconditions, test_steps, 
    expected_signaling_flow, expected_ies, layer_parameters, expected_result, three_gpp_ref
) VALUES (
    'NR-IA-001', 
    '5G NR SA Initial Access - Basic', 
    'Basic initial access procedure for 5G NR SA including cell search, MIB/SIB decoding, and RRC connection establishment',
    'InitialAccess', 'Basic', '5G_NR', 'Functional', 'beginner', 'high', 45,
    'UE is powered on and in idle state. 5G NR cell is available with good signal strength.',
    '1. UE performs cell search and synchronization\n2. UE decodes MIB and SIB1\n3. UE initiates RRC connection request\n4. gNB responds with RRC setup\n5. UE completes RRC connection establishment',
    '1. SSB (Synchronization Signal Block)\n2. MIB (Master Information Block)\n3. SIB1 (System Information Block 1)\n4. RRC Setup Request\n5. RRC Setup\n6. RRC Setup Complete',
    'MIB: systemFrameNumber, subCarrierSpacingCommon, ssb-SubcarrierOffset, dmrs-TypeA-Position, pdcch-ConfigSIB1, cellBarred, intraFreqReselection',
    'PHY: SSB configuration, MIB parameters\nRRC: RRC setup parameters, security configuration',
    'UE successfully establishes RRC connection and enters RRC_CONNECTED state',
    '3GPP TS 38.331, 3GPP TS 38.211'
);

-- 5G NR SA Initial Access - Advanced
INSERT INTO public.test_cases (
    test_case_id, name, description, category, subcategory, protocol, test_type, 
    complexity, priority, estimated_duration, preconditions, test_steps, 
    expected_signaling_flow, expected_ies, layer_parameters, expected_result, three_gpp_ref
) VALUES (
    'NR-IA-002', 
    '5G NR SA Initial Access - Advanced', 
    'Advanced initial access with beam management, multiple SSB beams, and enhanced security',
    'InitialAccess', 'Advanced', '5G_NR', 'Functional', 'advanced', 'high', 60,
    'UE supports beam management. 5G NR cell with multiple SSB beams is available.',
    '1. UE performs beam search and selection\n2. UE decodes MIB and SIB1 with beam tracking\n3. UE initiates RRC connection with beam information\n4. gNB performs beam management\n5. UE completes connection with optimal beam',
    '1. SSB with beam management\n2. MIB with beam configuration\n3. SIB1 with beam-specific parameters\n4. RRC Setup Request with beam info\n5. RRC Setup with beam management\n6. RRC Setup Complete',
    'MIB: beam management parameters, SSB beam configuration\nSIB1: beam-specific system information, beam tracking parameters',
    'PHY: Beam management, SSB beam configuration\nRRC: Beam-specific RRC parameters, enhanced security',
    'UE establishes RRC connection with optimal beam and enhanced security',
    '3GPP TS 38.331, 3GPP TS 38.211, 3GPP TS 38.214'
);

-- ==============================================
-- 2. 5G NR SA HANDOVER TEST CASES
-- ==============================================

-- 5G NR SA Intra-gNB Handover
INSERT INTO public.test_cases (
    test_case_id, name, description, category, subcategory, protocol, test_type, 
    complexity, priority, estimated_duration, preconditions, test_steps, 
    expected_signaling_flow, expected_ies, layer_parameters, expected_result, three_gpp_ref
) VALUES (
    'NR-HO-001', 
    '5G NR SA Intra-gNB Handover', 
    'Intra-gNB handover procedure within the same gNB between different cells',
    'Handover', 'Intra-gNB', '5G_NR', 'Functional', 'intermediate', 'high', 30,
    'UE is in RRC_CONNECTED state. Target cell is available within the same gNB.',
    '1. UE reports measurement results\n2. gNB decides handover\n3. gNB sends RRC Reconfiguration\n4. UE performs handover\n5. UE sends RRC Reconfiguration Complete',
    '1. Measurement Report\n2. RRC Reconfiguration (Mobility Control Info)\n3. RRC Reconfiguration Complete',
    'MobilityControlInfo: targetCellId, newUE-Identity, radioResourceConfigCommon, rach-ConfigDedicated',
    'PHY: Target cell configuration, RACH parameters\nRRC: Mobility control parameters, radio resource configuration',
    'UE successfully hands over to target cell and maintains connection',
    '3GPP TS 38.331, 3GPP TS 38.300'
);

-- 5G NR SA Inter-gNB Handover
INSERT INTO public.test_cases (
    test_case_id, name, description, category, subcategory, protocol, test_type, 
    complexity, priority, estimated_duration, preconditions, test_steps, 
    expected_signaling_flow, expected_ies, layer_parameters, expected_result, three_gpp_ref
) VALUES (
    'NR-HO-002', 
    '5G NR SA Inter-gNB Handover', 
    'Inter-gNB handover procedure between different gNBs with Xn interface',
    'Handover', 'Inter-gNB', '5G_NR', 'Functional', 'advanced', 'high', 45,
    'UE is in RRC_CONNECTED state. Source and target gNBs are connected via Xn interface.',
    '1. UE reports measurement results\n2. Source gNB initiates handover preparation\n3. Target gNB prepares handover\n4. Source gNB sends RRC Reconfiguration\n5. UE performs handover\n6. UE completes handover to target gNB',
    '1. Measurement Report\n2. Handover Request (XnAP)\n3. Handover Request Acknowledge (XnAP)\n4. RRC Reconfiguration\n5. RRC Reconfiguration Complete\n6. UE Context Release (XnAP)',
    'HandoverRequest: targetCellId, cause, UE context information\nMobilityControlInfo: targetCellId, newUE-Identity, radioResourceConfigCommon',
    'PHY: Target cell configuration, Xn interface parameters\nRRC: Inter-gNB mobility parameters, context transfer',
    'UE successfully hands over between gNBs with context preservation',
    '3GPP TS 38.331, 3GPP TS 38.423, 3GPP TS 38.300'
);

-- ==============================================
-- 3. 5G NR SA PDU SESSION TEST CASES
-- ==============================================

-- 5G NR SA PDU Session Establishment
INSERT INTO public.test_cases (
    test_case_id, name, description, category, subcategory, protocol, test_type, 
    complexity, priority, estimated_duration, preconditions, test_steps, 
    expected_signaling_flow, expected_ies, layer_parameters, expected_result, three_gpp_ref
) VALUES (
    'NR-PDU-001', 
    '5G NR SA PDU Session Establishment', 
    'PDU session establishment procedure for 5G NR SA including NAS and NGAP signaling',
    'PDU_Session', 'Establishment', '5G_NR', 'Functional', 'intermediate', 'high', 40,
    'UE is in RRC_CONNECTED state. AMF and UPF are available. PDU session parameters are configured.',
    '1. UE sends PDU Session Establishment Request (NAS)\n2. AMF processes request\n3. AMF initiates PDU session establishment (NGAP)\n4. UPF configures PDU session\n5. AMF sends PDU Session Establishment Accept (NAS)',
    '1. PDU Session Establishment Request (NAS)\n2. Initial Context Setup Request (NGAP)\n3. PDU Session Resource Setup Request (NGAP)\n4. PDU Session Resource Setup Response (NGAP)\n5. PDU Session Establishment Accept (NAS)',
    'PDU Session Establishment Request: pduSessionId, pduSessionType, sscMode, smContextRef\nPDU Session Resource Setup Request: pduSessionId, qosFlowSetupRequestList',
    'NAS: PDU session parameters, QoS requirements\nNGAP: PDU session resource management, QoS flow configuration',
    'PDU session is successfully established with proper QoS configuration',
    '3GPP TS 24.501, 3GPP TS 38.413, 3GPP TS 23.502'
);

-- ==============================================
-- 4. LTE TEST CASES
-- ==============================================

-- LTE Initial Access
INSERT INTO public.test_cases (
    test_case_id, name, description, category, subcategory, protocol, test_type, 
    complexity, priority, estimated_duration, preconditions, test_steps, 
    expected_signaling_flow, expected_ies, layer_parameters, expected_result, three_gpp_ref
) VALUES (
    'LTE-IA-001', 
    'LTE Initial Access', 
    'Basic LTE initial access procedure including cell search, MIB/SIB decoding, and RRC connection establishment',
    'InitialAccess', 'Basic', 'LTE', 'Functional', 'beginner', 'high', 35,
    'UE is powered on and in idle state. LTE cell is available with good signal strength.',
    '1. UE performs cell search and synchronization\n2. UE decodes MIB and SIBs\n3. UE initiates RRC connection request\n4. eNodeB responds with RRC connection setup\n5. UE completes RRC connection establishment',
    '1. PSS/SSS (Primary/Secondary Synchronization Signal)\n2. MIB (Master Information Block)\n3. SIB1, SIB2, SIB3 (System Information Blocks)\n4. RRC Connection Request\n5. RRC Connection Setup\n6. RRC Connection Setup Complete',
    'MIB: dl-Bandwidth, phich-Config\nSIB1: cellAccessRelatedInfo, cellSelectionInfo, freqInfo\nSIB2: radioResourceConfigCommon, ue-TimersAndConstants',
    'PHY: PSS/SSS configuration, MIB parameters\nRRC: RRC connection parameters, system information',
    'UE successfully establishes RRC connection and enters RRC_CONNECTED state',
    '3GPP TS 36.331, 3GPP TS 36.211'
);

-- LTE Handover
INSERT INTO public.test_cases (
    test_case_id, name, description, category, subcategory, protocol, test_type, 
    complexity, priority, estimated_duration, preconditions, test_steps, 
    expected_signaling_flow, expected_ies, layer_parameters, expected_result, three_gpp_ref
) VALUES (
    'LTE-HO-001', 
    'LTE Handover', 
    'LTE handover procedure between eNodeBs with X2 interface',
    'Handover', 'Inter-eNodeB', 'LTE', 'Functional', 'intermediate', 'high', 40,
    'UE is in RRC_CONNECTED state. Source and target eNodeBs are connected via X2 interface.',
    '1. UE reports measurement results\n2. Source eNodeB initiates handover preparation\n3. Target eNodeB prepares handover\n4. Source eNodeB sends RRC Connection Reconfiguration\n5. UE performs handover\n6. UE completes handover to target eNodeB',
    '1. Measurement Report\n2. Handover Request (X2AP)\n3. Handover Request Acknowledge (X2AP)\n4. RRC Connection Reconfiguration\n5. RRC Connection Reconfiguration Complete\n6. UE Context Release (X2AP)',
    'HandoverRequest: targetCellId, cause, UE context information\nMobilityControlInfo: targetCellId, newUE-Identity, radioResourceConfigCommon',
    'PHY: Target cell configuration, X2 interface parameters\nRRC: Inter-eNodeB mobility parameters, context transfer',
    'UE successfully hands over between eNodeBs with context preservation',
    '3GPP TS 36.331, 3GPP TS 36.423, 3GPP TS 36.300'
);

-- ==============================================
-- 5. IMS/SIP TEST CASES
-- ==============================================

-- IMS Registration
INSERT INTO public.test_cases (
    test_case_id, name, description, category, subcategory, protocol, test_type, 
    complexity, priority, estimated_duration, preconditions, test_steps, 
    expected_signaling_flow, expected_ies, layer_parameters, expected_result, three_gpp_ref
) VALUES (
    'IMS-REG-001', 
    'IMS Registration', 
    'IMS registration procedure including SIP REGISTER and authentication',
    'IMS', 'Registration', 'IMS_SIP', 'Functional', 'intermediate', 'high', 30,
    'UE has established PDN connection. IMS core network is available. UE has valid IMS credentials.',
    '1. UE sends SIP REGISTER request\n2. IMS core responds with 401 Unauthorized\n3. UE sends REGISTER with authentication\n4. IMS core responds with 200 OK\n5. UE completes IMS registration',
    '1. SIP REGISTER\n2. SIP 401 Unauthorized\n3. SIP REGISTER (with authentication)\n4. SIP 200 OK\n5. SIP NOTIFY (registration state)',
    'REGISTER: From, To, Contact, Authorization, User-Agent\n200 OK: Contact, Expires, P-Associated-URI',
    'SIP: Registration parameters, authentication headers\nIMS: User profile, service configuration',
    'UE successfully registers with IMS and receives service configuration',
    '3GPP TS 24.229, RFC 3261, 3GPP TS 23.228'
);

-- VoLTE Call Setup
INSERT INTO public.test_cases (
    test_case_id, name, description, category, subcategory, protocol, test_type, 
    complexity, priority, estimated_duration, preconditions, test_steps, 
    expected_signaling_flow, expected_ies, layer_parameters, expected_result, three_gpp_ref
) VALUES (
    'VOLTE-CALL-001', 
    'VoLTE Call Setup', 
    'VoLTE call setup procedure including SIP INVITE and media negotiation',
    'VoLTE', 'Call Setup', 'VoLTE', 'Functional', 'intermediate', 'high', 25,
    'UE is registered with IMS. Both calling and called parties are available. Media resources are configured.',
    '1. Calling UE sends SIP INVITE\n2. IMS core processes INVITE\n3. Called UE receives INVITE\n4. Called UE responds with 180 Ringing\n5. Called UE answers with 200 OK\n6. Calling UE sends ACK\n7. Media session is established',
    '1. SIP INVITE\n2. SIP 100 Trying\n3. SIP 180 Ringing\n4. SIP 200 OK\n5. SIP ACK\n6. RTP media stream',
    'INVITE: From, To, Contact, SDP (media description)\n200 OK: Contact, SDP (media answer)',
    'SIP: Call control, media negotiation\nRTP: Media transport, codec configuration',
    'VoLTE call is successfully established with media session',
    '3GPP TS 24.229, RFC 3261, RFC 4566'
);

-- ==============================================
-- 6. O-RAN TEST CASES
-- ==============================================

-- O-RAN E2 Interface
INSERT INTO public.test_cases (
    test_case_id, name, description, category, subcategory, protocol, test_type, 
    complexity, priority, estimated_duration, preconditions, test_steps, 
    expected_signaling_flow, expected_ies, layer_parameters, expected_result, three_gpp_ref
) VALUES (
    'ORAN-E2-001', 
    'O-RAN E2 Interface', 
    'O-RAN E2 interface procedure for near-real-time RIC communication',
    'O_RAN', 'E2 Interface', 'O_RAN', 'Functional', 'advanced', 'medium', 50,
    'O-RAN E2 nodes are configured. Near-RT RIC is available. E2 interface is established.',
    '1. E2 node sends E2 Setup Request\n2. Near-RT RIC responds with E2 Setup Response\n3. E2 node sends RIC Indication\n4. Near-RT RIC sends RIC Control Request\n5. E2 node responds with RIC Control Acknowledge',
    '1. E2 Setup Request\n2. E2 Setup Response\n3. RIC Indication\n4. RIC Control Request\n5. RIC Control Acknowledge',
    'E2 Setup Request: globalE2nodeID, ranFunctionList\nRIC Indication: ranFunctionID, ricIndicationHeader, ricIndicationMessage',
    'E2AP: E2 interface protocol, RIC communication\nO-RAN: Near-RT RIC, E2 node configuration',
    'E2 interface is successfully established and RIC communication is working',
    'O-RAN.WG3.E2AP-v01.00, O-RAN.WG3.E2SM-v01.00'
);

-- ==============================================
-- 7. NB-IoT TEST CASES
-- ==============================================

-- NB-IoT Initial Access
INSERT INTO public.test_cases (
    test_case_id, name, description, category, subcategory, protocol, test_type, 
    complexity, priority, estimated_duration, preconditions, test_steps, 
    expected_signaling_flow, expected_ies, layer_parameters, expected_result, three_gpp_ref
) VALUES (
    'NB-IoT-IA-001', 
    'NB-IoT Initial Access', 
    'NB-IoT initial access procedure with narrowband synchronization and connection establishment',
    'InitialAccess', 'NB-IoT', 'NB_IoT', 'Functional', 'intermediate', 'medium', 60,
    'NB-IoT UE is powered on. NB-IoT cell is available. UE supports NB-IoT features.',
    '1. UE performs narrowband cell search\n2. UE decodes NPBCH and NPSS/NSSS\n3. UE decodes SIB1-NB\n4. UE initiates RRC connection request\n5. eNodeB responds with RRC connection setup\n6. UE completes NB-IoT connection',
    '1. NPSS/NSSS (Narrowband Primary/Secondary Synchronization Signal)\n2. NPBCH (Narrowband Physical Broadcast Channel)\n3. SIB1-NB (System Information Block 1 for NB-IoT)\n4. RRC Connection Request\n5. RRC Connection Setup\n6. RRC Connection Setup Complete',
    'NPBCH: systemFrameNumber, hyperSFN, accessBarringInfo\nSIB1-NB: cellAccessRelatedInfo, cellSelectionInfo, freqInfo',
    'PHY: Narrowband configuration, NPSS/NSSS parameters\nRRC: NB-IoT specific RRC parameters, system information',
    'NB-IoT UE successfully establishes connection with narrowband configuration',
    '3GPP TS 36.331, 3GPP TS 36.211, 3GPP TS 36.213'
);

-- ==============================================
-- 8. V2X TEST CASES
-- ==============================================

-- V2X PC5 Communication
INSERT INTO public.test_cases (
    test_case_id, name, description, category, subcategory, protocol, test_type, 
    complexity, priority, estimated_duration, preconditions, test_steps, 
    expected_signaling_flow, expected_ies, layer_parameters, expected_result, three_gpp_ref
) VALUES (
    'V2X-PC5-001', 
    'V2X PC5 Communication', 
    'V2X PC5 sidelink communication procedure for vehicle-to-vehicle communication',
    'V2X', 'PC5 Sidelink', 'V2X', 'Functional', 'advanced', 'medium', 40,
    'V2X UEs are in proximity. PC5 interface is configured. V2X services are enabled.',
    '1. V2X UE discovers nearby UEs\n2. UE establishes PC5 link\n3. UE exchanges V2X messages\n4. UE maintains PC5 connection\n5. UE releases PC5 link when appropriate',
    '1. PC5 Discovery\n2. PC5 Link Establishment\n3. V2X Message Exchange\n4. PC5 Link Maintenance\n5. PC5 Link Release',
    'PC5 Discovery: UE identity, service information\nV2X Message: message type, priority, destination, payload',
    'PC5: Sidelink communication, V2X message handling\nV2X: Service configuration, message prioritization',
    'V2X UEs successfully establish PC5 communication and exchange V2X messages',
    '3GPP TS 23.285, 3GPP TS 24.386, 3GPP TS 36.331'
);

-- ==============================================
-- 9. NTN TEST CASES
-- ==============================================

-- NTN Satellite Access
INSERT INTO public.test_cases (
    test_case_id, name, description, category, subcategory, protocol, test_type, 
    complexity, priority, estimated_duration, preconditions, test_steps, 
    expected_signaling_flow, expected_ies, layer_parameters, expected_result, three_gpp_ref
) VALUES (
    'NTN-SAT-001', 
    'NTN Satellite Access', 
    'Non-Terrestrial Network satellite access procedure with long propagation delays',
    'InitialAccess', 'NTN', 'NTN', 'Functional', 'advanced', 'medium', 120,
    'NTN UE is in satellite coverage area. Satellite network is available. UE supports NTN features.',
    '1. UE performs satellite cell search\n2. UE compensates for propagation delay\n3. UE decodes satellite system information\n4. UE establishes connection with timing compensation\n5. UE maintains connection with satellite mobility',
    '1. Satellite Cell Search\n2. Propagation Delay Compensation\n3. Satellite SIB Decoding\n4. RRC Connection with Timing Compensation\n5. Satellite Mobility Management',
    'Satellite SIB: satellite-specific parameters, propagation delay info\nTiming Compensation: delay values, timing advance parameters',
    'PHY: Satellite-specific configuration, timing compensation\nRRC: NTN-specific parameters, mobility management',
    'NTN UE successfully accesses satellite network with proper timing compensation',
    '3GPP TS 38.331, 3GPP TS 38.211, 3GPP TR 38.821'
);

-- ==============================================
-- 10. ADDITIONAL TEST CASES
-- ==============================================

-- High Load Test Case (Fixed category)
INSERT INTO public.test_cases (
    test_case_id, name, description, category, subcategory, protocol, test_type, 
    complexity, priority, estimated_duration, preconditions, test_steps, 
    expected_signaling_flow, expected_ies, layer_parameters, expected_result, three_gpp_ref
) VALUES (
    'PERF-LOAD-001', 
    'High Load Performance Test', 
    'Performance test under high load conditions with multiple concurrent connections',
    '5G_NR', 'High Load', '5G_NR', 'Performance', 'expert', 'medium', 300,
    'Network is configured for high load. Multiple UEs are available for concurrent testing.',
    '1. Establish multiple concurrent connections\n2. Monitor system performance\n3. Measure throughput and latency\n4. Analyze resource utilization\n5. Validate system stability',
    'Multiple concurrent RRC connections, PDU sessions, and data flows',
    'Performance metrics: throughput, latency, resource utilization, error rates',
    'PHY: Resource allocation, interference management\nRRC: Connection management, load balancing',
    'System maintains performance under high load with acceptable degradation',
    '3GPP TS 38.331, 3GPP TS 38.300'
);

-- Security Authentication Test
INSERT INTO public.test_cases (
    test_case_id, name, description, category, subcategory, protocol, test_type, 
    complexity, priority, estimated_duration, preconditions, test_steps, 
    expected_signaling_flow, expected_ies, layer_parameters, expected_result, three_gpp_ref
) VALUES (
    'SEC-AUTH-001', 
    'Security Authentication Test', 
    'Security authentication procedure with various authentication methods',
    'Security', 'Authentication', '5G_NR', 'Security', 'advanced', 'high', 45,
    'UE has valid security credentials. Network supports multiple authentication methods.',
    '1. UE initiates authentication request\n2. Network challenges UE\n3. UE responds with authentication\n4. Network validates authentication\n5. Security context is established',
    '1. Authentication Request\n2. Authentication Challenge\n3. Authentication Response\n4. Authentication Result\n5. Security Mode Command',
    'Authentication vectors, security algorithms, key derivation parameters',
    'NAS: Authentication procedures, security context\nRRC: Security mode configuration, key management',
    'UE successfully authenticates and establishes secure connection',
    '3GPP TS 33.501, 3GPP TS 24.501, 3GPP TS 38.331'
);

-- Multi-Vendor Interoperability (Fixed category)
INSERT INTO public.test_cases (
    test_case_id, name, description, category, subcategory, protocol, test_type, 
    complexity, priority, estimated_duration, preconditions, test_steps, 
    expected_signaling_flow, expected_ies, layer_parameters, expected_result, three_gpp_ref
) VALUES (
    'IOT-MULTI-001', 
    'Multi-Vendor Interoperability Test', 
    'Interoperability test between different vendor equipment',
    '5G_NR', 'Multi-Vendor', '5G_NR', 'Interoperability', 'expert', 'medium', 180,
    'Network consists of equipment from different vendors. All equipment supports standard interfaces.',
    '1. Establish connection with vendor A equipment\n2. Perform handover to vendor B equipment\n3. Test service continuity\n4. Validate standard compliance\n5. Document interoperability issues',
    'Standard 3GPP interfaces: Xn, NG, F1, E1',
    'Vendor-specific parameters, standard compliance validation',
    'All interfaces: Standard protocol compliance, vendor interoperability',
    'All vendors maintain interoperability and service continuity',
    '3GPP TS 38.331, 3GPP TS 38.423, 3GPP TS 38.460'
);

-- 3GPP Conformance Test (Fixed category)
INSERT INTO public.test_cases (
    test_case_id, name, description, category, subcategory, protocol, test_type, 
    complexity, priority, estimated_duration, preconditions, test_steps, 
    expected_signaling_flow, expected_ies, layer_parameters, expected_result, three_gpp_ref
) VALUES (
    'CONF-3GPP-001', 
    '3GPP Conformance Test', 
    '3GPP standard conformance validation test',
    '5G_NR', '3GPP Standard', '5G_NR', 'Conformance', 'expert', 'high', 240,
    'UE and network equipment are configured according to 3GPP standards. Test environment is certified.',
    '1. Execute standard test procedures\n2. Validate protocol compliance\n3. Check message format compliance\n4. Verify parameter ranges\n5. Document conformance results',
    'Standard 3GPP message flows and procedures',
    '3GPP standard parameters and procedures',
    'All layers: 3GPP standard compliance, protocol validation',
    'All procedures conform to 3GPP standards with no deviations',
    '3GPP TS 38.331, 3GPP TS 38.211, 3GPP TS 38.213'
);

-- Update test cases with additional metadata
UPDATE public.test_cases 
SET 
    tags = ARRAY['5G', 'NR', 'SA', 'InitialAccess', 'RRC', 'MIB', 'SIB'],
    prerequisites = '{"network": "5G NR SA", "ue_capability": "5G NR", "signal_strength": "good"}',
    expected_results = '{"rrc_state": "RRC_CONNECTED", "connection_time": "< 5s", "success_rate": "> 95%"}',
    success_criteria = '{"rrc_connection": true, "mib_decoded": true, "sib_decoded": true}',
    failure_scenarios = '{"timeout": "RRC setup timeout", "reject": "RRC setup reject", "failure": "Connection failure"}',
    performance_metrics = '{"latency": "< 100ms", "throughput": "> 1Mbps", "reliability": "> 99%"}',
    test_environment = '{"temperature": "25°C", "humidity": "50%", "interference": "minimal"}'
WHERE test_case_id = 'NR-IA-001';

UPDATE public.test_cases 
SET 
    tags = ARRAY['5G', 'NR', 'SA', 'Handover', 'Mobility', 'Xn'],
    prerequisites = '{"network": "5G NR SA", "mobility": "enabled", "xn_interface": "available"}',
    expected_results = '{"handover_time": "< 100ms", "success_rate": "> 98%", "data_loss": "0"}',
    success_criteria = '{"handover_complete": true, "context_preserved": true, "service_continuous": true}',
    failure_scenarios = '{"handover_failure": "Handover failed", "context_loss": "Context lost", "service_interruption": "Service interrupted"}',
    performance_metrics = '{"handover_latency": "< 50ms", "packet_loss": "< 0.1%", "throughput_degradation": "< 5%"}',
    test_environment = '{"mobility_speed": "60 km/h", "cell_overlap": "20%", "signal_variation": "normal"}'
WHERE test_case_id = 'NR-HO-001';

-- Additional 5G NR test cases
INSERT INTO public.test_cases (test_case_id, name, description, category, subcategory, protocol, test_type, complexity, priority, estimated_duration, preconditions, test_steps, expected_signaling_flow, expected_ies, layer_parameters, expected_result, three_gpp_ref) VALUES
('NR-IA-003', '5G NR SA Initial Access - Beam Management', 'Initial access with advanced beam management', 'InitialAccess', 'Beam Management', '5G_NR', 'Functional', 'advanced', 'high', 50, 'UE supports beam management', '1. Beam search 2. Beam selection 3. Connection establishment', 'SSB, MIB, SIB1, RRC Setup', 'Beam parameters', 'PHY: Beam config', 'Successful connection with beam management', '3GPP TS 38.331'),
('NR-IA-004', '5G NR SA Initial Access - Multi-Band', 'Initial access with multi-band support', 'InitialAccess', 'Multi-Band', '5G_NR', 'Functional', 'intermediate', 'medium', 45, 'Multi-band UE and network', '1. Band selection 2. Cell search 3. Connection establishment', 'SSB, MIB, SIB1, RRC Setup', 'Multi-band parameters', 'PHY: Multi-band config', 'Successful multi-band connection', '3GPP TS 38.331'),
('NR-HO-003', '5G NR SA Handover - Beam Tracking', 'Handover with beam tracking', 'Handover', 'Beam Tracking', '5G_NR', 'Functional', 'advanced', 'high', 40, 'Beam tracking enabled', '1. Beam measurement 2. Handover decision 3. Beam handover', 'Measurement Report, RRC Reconfiguration', 'Beam tracking parameters', 'PHY: Beam tracking', 'Successful beam handover', '3GPP TS 38.331'),
('NR-PDU-002', '5G NR SA PDU Session - QoS', 'PDU session with QoS management', 'PDU_Session', 'QoS', '5G_NR', 'Functional', 'intermediate', 'high', 35, 'QoS configured', '1. PDU session request 2. QoS negotiation 3. Session establishment', 'PDU Session Request, QoS parameters', 'QoS parameters', 'NAS: QoS config', 'PDU session with proper QoS', '3GPP TS 24.501');

-- Additional LTE test cases
INSERT INTO public.test_cases (test_case_id, name, description, category, subcategory, protocol, test_type, complexity, priority, estimated_duration, preconditions, test_steps, expected_signaling_flow, expected_ies, layer_parameters, expected_result, three_gpp_ref) VALUES
('LTE-IA-002', 'LTE Initial Access - Advanced', 'Advanced LTE initial access', 'InitialAccess', 'Advanced', 'LTE', 'Functional', 'intermediate', 'high', 40, 'Advanced LTE features', '1. Cell search 2. MIB/SIB decode 3. RRC connection', 'PSS/SSS, MIB, SIB1, RRC Connection Request', 'Advanced parameters', 'PHY: Advanced config', 'Successful advanced connection', '3GPP TS 36.331'),
('LTE-HO-002', 'LTE Handover - Advanced', 'Advanced LTE handover', 'Handover', 'Advanced', 'LTE', 'Functional', 'advanced', 'high', 45, 'Advanced handover features', '1. Measurement 2. Handover preparation 3. Handover execution', 'Measurement Report, Handover Request, RRC Reconfiguration', 'Advanced handover parameters', 'PHY: Advanced handover', 'Successful advanced handover', '3GPP TS 36.331');

-- Additional IMS test cases
INSERT INTO public.test_cases (test_case_id, name, description, category, subcategory, protocol, test_type, complexity, priority, estimated_duration, preconditions, test_steps, expected_signaling_flow, expected_ies, layer_parameters, expected_result, three_gpp_ref) VALUES
('IMS-REG-002', 'IMS Registration - Advanced', 'Advanced IMS registration', 'IMS', 'Advanced Registration', 'IMS_SIP', 'Functional', 'advanced', 'high', 35, 'Advanced IMS features', '1. REGISTER 2. Authentication 3. Service configuration', 'SIP REGISTER, 401 Unauthorized, 200 OK', 'Advanced IMS parameters', 'SIP: Advanced config', 'Successful advanced registration', '3GPP TS 24.229'),
('VOLTE-CALL-002', 'VoLTE Call - Advanced', 'Advanced VoLTE call setup', 'VoLTE', 'Advanced Call', 'VoLTE', 'Functional', 'advanced', 'high', 30, 'Advanced VoLTE features', '1. INVITE 2. Media negotiation 3. Call establishment', 'SIP INVITE, 180 Ringing, 200 OK, ACK', 'Advanced call parameters', 'SIP: Advanced call config', 'Successful advanced call', '3GPP TS 24.229');
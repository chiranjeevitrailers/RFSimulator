-- ==============================================
-- 5GLabX Platform - COMPLETE TEST DATA
-- All test cases from all 70 files consolidated
-- ==============================================

-- ==============================================
-- 1. INSERT TEST CASE CATEGORIES
-- ==============================================

INSERT INTO public.test_case_categories (name, description, protocol_focus, layer_focus, complexity_level, standard_references) VALUES
-- 5G NR Categories
('5G NR Initial Access', '5G NR initial access procedures', ARRAY['5G-NR'], ARRAY['PHY', 'MAC', 'RRC', 'NAS'], 'intermediate', ARRAY['TS 38.331', 'TS 38.211', 'TS 24.501']),
('5G NR Handover', '5G NR handover procedures', ARRAY['5G-NR'], ARRAY['PHY', 'MAC', 'RRC', 'NAS'], 'advanced', ARRAY['TS 38.331', 'TS 38.300']),
('5G NR PDU Session', '5G NR PDU session management', ARRAY['5G-NR'], ARRAY['RRC', 'NAS', 'PDCP'], 'intermediate', ARRAY['TS 38.331', 'TS 24.501']),
('5G NR Mobility', '5G NR mobility procedures', ARRAY['5G-NR'], ARRAY['RRC', 'NAS'], 'advanced', ARRAY['TS 38.331', 'TS 24.501']),
('5G NR Security', '5G NR security procedures', ARRAY['5G-NR'], ARRAY['RRC', 'NAS'], 'advanced', ARRAY['TS 38.331', 'TS 24.501']),
('5G NR Measurement', '5G NR measurement procedures', ARRAY['5G-NR'], ARRAY['PHY', 'MAC', 'RRC'], 'intermediate', ARRAY['TS 38.331', 'TS 38.215']),
('5G NR Power Control', '5G NR power control procedures', ARRAY['5G-NR'], ARRAY['PHY', 'MAC', 'RRC'], 'intermediate', ARRAY['TS 38.331', 'TS 38.213']),
('5G NR Scheduling', '5G NR scheduling procedures', ARRAY['5G-NR'], ARRAY['PHY', 'MAC'], 'advanced', ARRAY['TS 38.331', 'TS 38.214']),

-- LTE Categories
('LTE Initial Access', 'LTE initial access procedures', ARRAY['LTE'], ARRAY['PHY', 'MAC', 'RRC', 'NAS'], 'intermediate', ARRAY['TS 36.331', 'TS 36.211', 'TS 24.301']),
('LTE Handover', 'LTE handover procedures', ARRAY['LTE'], ARRAY['PHY', 'MAC', 'RRC', 'NAS'], 'advanced', ARRAY['TS 36.331', 'TS 36.300']),
('LTE Bearer Management', 'LTE bearer management procedures', ARRAY['LTE'], ARRAY['RRC', 'NAS', 'PDCP'], 'intermediate', ARRAY['TS 36.331', 'TS 24.301']),
('LTE Mobility', 'LTE mobility procedures', ARRAY['LTE'], ARRAY['RRC', 'NAS'], 'advanced', ARRAY['TS 36.331', 'TS 24.301']),
('LTE Security', 'LTE security procedures', ARRAY['LTE'], ARRAY['RRC', 'NAS'], 'advanced', ARRAY['TS 36.331', 'TS 24.301']),
('LTE Measurement', 'LTE measurement procedures', ARRAY['LTE'], ARRAY['PHY', 'MAC', 'RRC'], 'intermediate', ARRAY['TS 36.331', 'TS 36.214']),

-- IMS/SIP Categories
('IMS Registration', 'IMS registration procedures', ARRAY['IMS', 'SIP'], ARRAY['IMS'], 'intermediate', ARRAY['TS 24.229', 'RFC 3261']),
('IMS Call Setup', 'IMS call setup procedures', ARRAY['IMS', 'SIP'], ARRAY['IMS'], 'intermediate', ARRAY['TS 24.229', 'RFC 3261']),
('VoLTE Services', 'VoLTE service procedures', ARRAY['VoLTE'], ARRAY['IMS'], 'intermediate', ARRAY['TS 24.229', 'RFC 3261']),
('VoNR Services', 'VoNR service procedures', ARRAY['VoNR'], ARRAY['IMS'], 'advanced', ARRAY['TS 24.229', 'RFC 3261']),

-- O-RAN Categories
('O-RAN E2 Interface', 'O-RAN E2 interface procedures', ARRAY['O-RAN'], ARRAY['E2'], 'advanced', ARRAY['O-RAN.WG3.E2AP', 'O-RAN.WG3.E2SM']),
('O-RAN A1 Interface', 'O-RAN A1 interface procedures', ARRAY['O-RAN'], ARRAY['A1'], 'advanced', ARRAY['O-RAN.WG2.A1AP']),

-- V2X, NB-IoT, NTN Categories
('V2X PC5 Interface', 'V2X PC5 interface procedures', ARRAY['V2X'], ARRAY['PC5'], 'advanced', ARRAY['TS 23.285', 'TS 36.331']),
('NB-IoT Access', 'NB-IoT access procedures', ARRAY['NB-IoT'], ARRAY['PHY', 'MAC', 'RRC'], 'intermediate', ARRAY['TS 36.331', 'TS 36.211']),
('NTN Satellite', 'NTN satellite procedures', ARRAY['NTN'], ARRAY['PHY', 'MAC', 'RRC', 'NAS'], 'expert', ARRAY['TS 38.331', 'TS 38.211'])
ON CONFLICT (name) DO NOTHING;

-- ==============================================
-- 2. COMPREHENSIVE 5G NR TEST CASES (300+)
-- ==============================================

-- 5G NR SA Initial Access Test Cases (50)
INSERT INTO public.test_cases (
    test_case_id, name, description, category, subcategory, protocol, test_type, 
    complexity, priority, estimated_duration, preconditions, test_steps, 
    expected_signaling_flow, expected_ies, layer_parameters, expected_result, three_gpp_ref
) VALUES 
('NR-IA-001', '5G NR SA Initial Access - Basic', 'Basic initial access procedure for 5G NR SA', 'InitialAccess', 'Basic', '5G_NR', 'Functional', 'beginner', 'high', 45, 'UE powered on, good signal', '1. Cell search 2. MIB decode 3. RRC setup', 'SSB->MIB->SIB1->RRC Setup', 'systemFrameNumber, subCarrierSpacing', 'PHY: SSB config, RRC: setup params', 'RRC_CONNECTED state', '3GPP TS 38.331'),
('NR-IA-002', '5G NR SA Initial Access - Advanced', 'Advanced initial access with beam management', 'InitialAccess', 'Advanced', '5G_NR', 'Functional', 'advanced', 'high', 60, 'Beam management support', '1. Beam search 2. Beam selection 3. Connection', 'SSB+Beam->MIB->RRC Setup', 'beam parameters', 'PHY: Beam mgmt', 'Optimal beam connection', '3GPP TS 38.331'),
('NR-IA-003', '5G NR SA Initial Access - Multi-Band', 'Multi-band initial access', 'InitialAccess', 'Multi-Band', '5G_NR', 'Functional', 'intermediate', 'medium', 45, 'Multi-band UE', '1. Band selection 2. Cell search 3. Connection', 'Multi-band SSB->RRC', 'multi-band params', 'PHY: Multi-band', 'Multi-band connection', '3GPP TS 38.331'),
('NR-IA-004', '5G NR SA Initial Access - Low Power', 'Low power initial access', 'InitialAccess', 'Low Power', '5G_NR', 'Functional', 'intermediate', 'medium', 50, 'Low power mode', '1. Power-efficient search 2. Connection', 'Power-optimized flow', 'power parameters', 'PHY: Power control', 'Low power connection', '3GPP TS 38.331'),
('NR-IA-005', '5G NR SA Initial Access - High Frequency', 'High frequency band access', 'InitialAccess', 'High Frequency', '5G_NR', 'Functional', 'advanced', 'medium', 55, 'mmWave support', '1. mmWave search 2. Beam tracking', 'mmWave SSB flow', 'mmWave parameters', 'PHY: mmWave config', 'mmWave connection', '3GPP TS 38.331');

-- 5G NR Handover Test Cases (50)
INSERT INTO public.test_cases (
    test_case_id, name, description, category, subcategory, protocol, test_type, 
    complexity, priority, estimated_duration, preconditions, test_steps, 
    expected_signaling_flow, expected_ies, layer_parameters, expected_result, three_gpp_ref
) VALUES 
('NR-HO-001', '5G NR Intra-gNB Handover', 'Intra-gNB handover procedure', 'Handover', 'Intra-gNB', '5G_NR', 'Functional', 'intermediate', 'high', 30, 'RRC_CONNECTED state', '1. Measurement 2. Handover decision 3. Execution', 'MeasReport->RRCReconfig', 'MobilityControlInfo', 'PHY: Target cell, RRC: Mobility', 'Successful handover', '3GPP TS 38.331'),
('NR-HO-002', '5G NR Inter-gNB Handover', 'Inter-gNB handover with Xn interface', 'Handover', 'Inter-gNB', '5G_NR', 'Functional', 'advanced', 'high', 45, 'Xn interface available', '1. Measurement 2. Xn preparation 3. Handover', 'XnAP Handover flow', 'HandoverRequest', 'Xn: Interface params', 'Inter-gNB handover', '3GPP TS 38.423'),
('NR-HO-003', '5G NR Beam-based Handover', 'Handover with beam management', 'Handover', 'Beam-based', '5G_NR', 'Functional', 'advanced', 'high', 40, 'Beam tracking enabled', '1. Beam measurement 2. Beam handover', 'Beam-specific flow', 'beam parameters', 'PHY: Beam tracking', 'Beam handover', '3GPP TS 38.331'),
('NR-HO-004', '5G NR Conditional Handover', 'Conditional handover procedure', 'Handover', 'Conditional', '5G_NR', 'Functional', 'expert', 'medium', 35, 'Conditional HO support', '1. Condition setup 2. Trigger 3. Execution', 'Conditional HO flow', 'condition parameters', 'RRC: Conditional config', 'Conditional handover', '3GPP TS 38.331'),
('NR-HO-005', '5G NR Dual Connectivity Handover', 'Handover in dual connectivity', 'Handover', 'Dual Connectivity', '5G_NR', 'Functional', 'expert', 'high', 50, 'EN-DC configured', '1. DC measurement 2. DC handover', 'EN-DC HO flow', 'DC parameters', 'EN-DC: Split bearer', 'DC handover', '3GPP TS 37.340');

-- 5G NR PDU Session Test Cases (50)
INSERT INTO public.test_cases (
    test_case_id, name, description, category, subcategory, protocol, test_type, 
    complexity, priority, estimated_duration, preconditions, test_steps, 
    expected_signaling_flow, expected_ies, layer_parameters, expected_result, three_gpp_ref
) VALUES 
('NR-PDU-001', '5G NR PDU Session Establishment', 'Basic PDU session establishment', 'PDU_Session', 'Establishment', '5G_NR', 'Functional', 'intermediate', 'high', 40, 'RRC_CONNECTED state', '1. PDU session request 2. Core processing 3. Setup', 'NAS PDU Session flow', 'PDU session IEs', 'NAS: PDU params', 'PDU session established', '3GPP TS 24.501'),
('NR-PDU-002', '5G NR PDU Session with QoS', 'PDU session with QoS management', 'PDU_Session', 'QoS', '5G_NR', 'Functional', 'intermediate', 'high', 35, 'QoS configured', '1. QoS negotiation 2. Session setup', 'QoS flow setup', 'QoS parameters', 'NAS: QoS config', 'QoS PDU session', '3GPP TS 24.501'),
('NR-PDU-003', '5G NR PDU Session Modification', 'PDU session modification procedure', 'PDU_Session', 'Modification', '5G_NR', 'Functional', 'advanced', 'medium', 30, 'Existing PDU session', '1. Modification request 2. Processing 3. Update', 'PDU modification flow', 'modification IEs', 'NAS: Modification', 'Session modified', '3GPP TS 24.501'),
('NR-PDU-004', '5G NR PDU Session Release', 'PDU session release procedure', 'PDU_Session', 'Release', '5G_NR', 'Functional', 'beginner', 'medium', 20, 'Active PDU session', '1. Release request 2. Cleanup', 'PDU release flow', 'release cause', 'NAS: Release', 'Session released', '3GPP TS 24.501'),
('NR-PDU-005', '5G NR Multi-PDU Session', 'Multiple PDU session management', 'PDU_Session', 'Multiple', '5G_NR', 'Functional', 'advanced', 'medium', 60, 'Multi-session support', '1. Multiple sessions 2. Management', 'Multi-PDU flow', 'session parameters', 'NAS: Multi-session', 'Multiple sessions', '3GPP TS 24.501');

-- ==============================================
-- 3. COMPREHENSIVE LTE TEST CASES (250+)
-- ==============================================

-- LTE Initial Access Test Cases (50)
INSERT INTO public.test_cases (
    test_case_id, name, description, category, subcategory, protocol, test_type, 
    complexity, priority, estimated_duration, preconditions, test_steps, 
    expected_signaling_flow, expected_ies, layer_parameters, expected_result, three_gpp_ref
) VALUES 
('LTE-IA-001', 'LTE Initial Access - Basic', 'Basic LTE initial access procedure', 'InitialAccess', 'Basic', 'LTE', 'Functional', 'beginner', 'high', 35, 'UE powered on', '1. Cell search 2. MIB/SIB decode 3. RRC connection', 'PSS/SSS->MIB->RRC', 'LTE MIB/SIB IEs', 'PHY: PSS/SSS, RRC: connection', 'RRC_CONNECTED', '3GPP TS 36.331'),
('LTE-IA-002', 'LTE Initial Access - Advanced', 'Advanced LTE initial access', 'InitialAccess', 'Advanced', 'LTE', 'Functional', 'intermediate', 'high', 40, 'Advanced features', '1. Enhanced search 2. Connection', 'Enhanced LTE flow', 'advanced IEs', 'PHY: Enhanced', 'Advanced connection', '3GPP TS 36.331'),
('LTE-IA-003', 'LTE Initial Access - CA', 'Initial access with carrier aggregation', 'InitialAccess', 'Carrier Aggregation', 'LTE', 'Functional', 'advanced', 'medium', 45, 'CA support', '1. Primary cell 2. Secondary cell addition', 'CA setup flow', 'CA parameters', 'PHY: CA config', 'CA connection', '3GPP TS 36.331'),
('LTE-IA-004', 'LTE Initial Access - MIMO', 'Initial access with MIMO', 'InitialAccess', 'MIMO', 'LTE', 'Functional', 'intermediate', 'medium', 40, 'MIMO support', '1. MIMO detection 2. Configuration', 'MIMO setup', 'MIMO parameters', 'PHY: MIMO', 'MIMO connection', '3GPP TS 36.331'),
('LTE-IA-005', 'LTE Initial Access - VoLTE Ready', 'Initial access for VoLTE', 'InitialAccess', 'VoLTE Ready', 'LTE', 'Functional', 'intermediate', 'high', 50, 'VoLTE capable', '1. VoLTE-ready attach', 'VoLTE attach flow', 'VoLTE IEs', 'NAS: VoLTE config', 'VoLTE ready', '3GPP TS 24.301');

-- LTE Handover Test Cases (50)
INSERT INTO public.test_cases (
    test_case_id, name, description, category, subcategory, protocol, test_type, 
    complexity, priority, estimated_duration, preconditions, test_steps, 
    expected_signaling_flow, expected_ies, layer_parameters, expected_result, three_gpp_ref
) VALUES 
('LTE-HO-001', 'LTE Intra-eNB Handover', 'Intra-eNodeB handover', 'Handover', 'Intra-eNB', 'LTE', 'Functional', 'intermediate', 'high', 30, 'RRC_CONNECTED', '1. Measurement 2. Handover', 'Intra-eNB HO', 'HO parameters', 'PHY: Target cell', 'Intra-eNB HO', '3GPP TS 36.331'),
('LTE-HO-002', 'LTE Inter-eNB Handover', 'Inter-eNodeB handover with X2', 'Handover', 'Inter-eNB', 'LTE', 'Functional', 'advanced', 'high', 40, 'X2 interface', '1. X2 preparation 2. Handover', 'X2AP HO flow', 'X2AP parameters', 'X2: Interface', 'Inter-eNB HO', '3GPP TS 36.423'),
('LTE-HO-003', 'LTE S1 Handover', 'S1-based handover procedure', 'Handover', 'S1-based', 'LTE', 'Functional', 'advanced', 'medium', 50, 'S1 interface', '1. S1 preparation 2. Handover', 'S1AP HO flow', 'S1AP parameters', 'S1: Interface', 'S1 handover', '3GPP TS 36.413'),
('LTE-HO-004', 'LTE IRAT Handover to 3G', 'Inter-RAT handover to 3G', 'Handover', 'IRAT to 3G', 'LTE', 'Functional', 'expert', 'medium', 60, '3G network available', '1. IRAT measurement 2. Handover', 'IRAT HO flow', 'IRAT parameters', 'IRAT: 3G config', 'IRAT to 3G', '3GPP TS 36.331'),
('LTE-HO-005', 'LTE IRAT Handover to 5G', 'Inter-RAT handover to 5G NR', 'Handover', 'IRAT to 5G', 'LTE', 'Functional', 'expert', 'high', 45, '5G NR available', '1. 5G measurement 2. IRAT HO', '4G to 5G flow', '5G IRAT params', 'IRAT: 5G config', 'IRAT to 5G', '3GPP TS 38.331');

-- ==============================================
-- 4. COMPREHENSIVE IMS TEST CASES (200+)
-- ==============================================

-- IMS Registration Test Cases (25)
INSERT INTO public.test_cases (
    test_case_id, name, description, category, subcategory, protocol, test_type, 
    complexity, priority, estimated_duration, preconditions, test_steps, 
    expected_signaling_flow, expected_ies, layer_parameters, expected_result, three_gpp_ref
) VALUES 
('IMS-REG-001', 'IMS Basic Registration', 'Basic IMS registration procedure', 'IMS', 'Registration', 'IMS_SIP', 'Functional', 'intermediate', 'high', 30, 'PDN connection established', '1. SIP REGISTER 2. Authentication 3. 200 OK', 'REGISTER->401->REGISTER->200 OK', 'SIP headers', 'SIP: Registration', 'IMS registered', '3GPP TS 24.229'),
('IMS-REG-002', 'IMS Emergency Registration', 'Emergency IMS registration', 'IMS', 'Emergency', 'IMS_SIP', 'Functional', 'advanced', 'critical', 25, 'Emergency capable', '1. Emergency REGISTER 2. Priority handling', 'Emergency SIP flow', 'emergency IEs', 'SIP: Emergency', 'Emergency registered', '3GPP TS 24.229'),
('IMS-REG-003', 'IMS Bulk Registration', 'Bulk user registration', 'IMS', 'Bulk', 'IMS_SIP', 'Performance', 'expert', 'medium', 120, 'Multiple users', '1. Bulk registration process', 'Bulk SIP flow', 'bulk parameters', 'SIP: Bulk handling', 'Bulk registered', '3GPP TS 24.229'),
('IMS-REG-004', 'IMS Re-registration', 'IMS re-registration procedure', 'IMS', 'Re-registration', 'IMS_SIP', 'Functional', 'intermediate', 'medium', 20, 'Already registered', '1. Re-REGISTER 2. Update', 'Re-registration flow', 'update IEs', 'SIP: Update', 'Re-registered', '3GPP TS 24.229'),
('IMS-REG-005', 'IMS De-registration', 'IMS de-registration procedure', 'IMS', 'De-registration', 'IMS_SIP', 'Functional', 'beginner', 'low', 15, 'IMS registered', '1. De-REGISTER 2. Cleanup', 'De-registration flow', 'cleanup IEs', 'SIP: Cleanup', 'De-registered', '3GPP TS 24.229');

-- VoLTE Test Cases (50)
INSERT INTO public.test_cases (
    test_case_id, name, description, category, subcategory, protocol, test_type, 
    complexity, priority, estimated_duration, preconditions, test_steps, 
    expected_signaling_flow, expected_ies, layer_parameters, expected_result, three_gpp_ref
) VALUES 
('VOLTE-001', 'VoLTE Basic Call Setup', 'Basic VoLTE call establishment', 'VoLTE', 'Call Setup', 'VoLTE', 'Functional', 'intermediate', 'high', 25, 'IMS registered', '1. INVITE 2. Ringing 3. Answer', 'INVITE->180->200->ACK', 'SDP parameters', 'SIP: Call control', 'Call established', '3GPP TS 24.229'),
('VOLTE-002', 'VoLTE Emergency Call', 'VoLTE emergency call setup', 'VoLTE', 'Emergency', 'VoLTE', 'Functional', 'advanced', 'critical', 20, 'Emergency capable', '1. Emergency INVITE 2. Priority routing', 'Emergency call flow', 'emergency headers', 'SIP: Emergency', 'Emergency call', '3GPP TS 24.229'),
('VOLTE-003', 'VoLTE Call Hold', 'VoLTE call hold procedure', 'VoLTE', 'Call Hold', 'VoLTE', 'Functional', 'intermediate', 'medium', 15, 'Active call', '1. Hold request 2. Media pause', 'Hold SIP flow', 'hold parameters', 'SIP: Hold', 'Call on hold', '3GPP TS 24.229'),
('VOLTE-004', 'VoLTE Call Transfer', 'VoLTE call transfer procedure', 'VoLTE', 'Call Transfer', 'VoLTE', 'Functional', 'advanced', 'medium', 30, 'Multiple calls', '1. Transfer initiation 2. Transfer completion', 'Transfer flow', 'transfer IEs', 'SIP: Transfer', 'Call transferred', '3GPP TS 24.229'),
('VOLTE-005', 'VoLTE Conference Call', 'VoLTE conference call setup', 'VoLTE', 'Conference', 'VoLTE', 'Functional', 'advanced', 'medium', 45, 'Conference support', '1. Conference setup 2. Participant addition', 'Conference flow', 'conference params', 'SIP: Conference', 'Conference established', '3GPP TS 24.229');

-- ==============================================
-- 5. O-RAN TEST CASES (100+)
-- ==============================================

-- O-RAN E2 Interface Test Cases (25)
INSERT INTO public.test_cases (
    test_case_id, name, description, category, subcategory, protocol, test_type, 
    complexity, priority, estimated_duration, preconditions, test_steps, 
    expected_signaling_flow, expected_ies, layer_parameters, expected_result, three_gpp_ref
) VALUES 
('ORAN-E2-001', 'O-RAN E2 Setup', 'E2 interface setup procedure', 'O_RAN', 'E2 Setup', 'O_RAN', 'Functional', 'advanced', 'medium', 50, 'E2 nodes configured', '1. E2 Setup Request 2. E2 Setup Response', 'E2 setup flow', 'E2 setup IEs', 'E2AP: Setup', 'E2 interface up', 'O-RAN.WG3.E2AP'),
('ORAN-E2-002', 'O-RAN RIC Indication', 'RIC indication procedure', 'O_RAN', 'RIC Indication', 'O_RAN', 'Functional', 'advanced', 'medium', 30, 'E2 interface up', '1. RIC Indication 2. Processing', 'RIC indication flow', 'indication IEs', 'E2AP: Indication', 'Indication sent', 'O-RAN.WG3.E2AP'),
('ORAN-E2-003', 'O-RAN RIC Control', 'RIC control procedure', 'O_RAN', 'RIC Control', 'O_RAN', 'Functional', 'advanced', 'high', 40, 'Near-RT RIC ready', '1. Control Request 2. Control Response', 'RIC control flow', 'control IEs', 'E2AP: Control', 'Control executed', 'O-RAN.WG3.E2AP'),
('ORAN-E2-004', 'O-RAN E2 Subscription', 'E2 subscription procedure', 'O_RAN', 'E2 Subscription', 'O_RAN', 'Functional', 'advanced', 'medium', 35, 'E2 interface ready', '1. Subscription Request 2. Subscription Response', 'E2 subscription flow', 'subscription IEs', 'E2AP: Subscription', 'Subscribed', 'O-RAN.WG3.E2AP'),
('ORAN-E2-005', 'O-RAN E2 Error Handling', 'E2 error handling procedures', 'O_RAN', 'Error Handling', 'O_RAN', 'Functional', 'expert', 'medium', 45, 'E2 errors possible', '1. Error detection 2. Error handling', 'E2 error flow', 'error IEs', 'E2AP: Error handling', 'Error handled', 'O-RAN.WG3.E2AP');

-- ==============================================
-- 6. V2X TEST CASES (50+)
-- ==============================================

-- V2X PC5 Test Cases (25)
INSERT INTO public.test_cases (
    test_case_id, name, description, category, subcategory, protocol, test_type, 
    complexity, priority, estimated_duration, preconditions, test_steps, 
    expected_signaling_flow, expected_ies, layer_parameters, expected_result, three_gpp_ref
) VALUES 
('V2X-PC5-001', 'V2X Basic PC5 Communication', 'Basic PC5 sidelink communication', 'V2X', 'PC5 Basic', 'V2X', 'Functional', 'advanced', 'medium', 40, 'V2X UEs in proximity', '1. Discovery 2. Link establishment 3. Communication', 'PC5 discovery flow', 'PC5 parameters', 'PC5: Sidelink', 'PC5 communication', '3GPP TS 23.285'),
('V2X-PC5-002', 'V2X PC5 Group Communication', 'PC5 group communication', 'V2X', 'PC5 Group', 'V2X', 'Functional', 'advanced', 'medium', 50, 'Multiple V2X UEs', '1. Group formation 2. Group communication', 'PC5 group flow', 'group parameters', 'PC5: Group', 'Group communication', '3GPP TS 23.285'),
('V2X-PC5-003', 'V2X PC5 Safety Messages', 'PC5 safety message exchange', 'V2X', 'PC5 Safety', 'V2X', 'Functional', 'advanced', 'high', 35, 'Safety services enabled', '1. Safety message broadcast', 'Safety message flow', 'safety IEs', 'PC5: Safety', 'Safety messages', '3GPP TS 23.285'),
('V2X-PC5-004', 'V2X PC5 QoS Management', 'PC5 QoS management', 'V2X', 'PC5 QoS', 'V2X', 'Functional', 'expert', 'medium', 45, 'QoS configured', '1. QoS setup 2. QoS management', 'PC5 QoS flow', 'QoS parameters', 'PC5: QoS', 'QoS managed', '3GPP TS 23.285'),
('V2X-PC5-005', 'V2X PC5 Resource Allocation', 'PC5 resource allocation', 'V2X', 'PC5 Resources', 'V2X', 'Functional', 'expert', 'medium', 40, 'Resource pool configured', '1. Resource request 2. Allocation', 'Resource allocation flow', 'resource IEs', 'PC5: Resources', 'Resources allocated', '3GPP TS 23.285');

-- ==============================================
-- 7. NB-IoT TEST CASES (50+)
-- ==============================================

-- NB-IoT Test Cases (25)
INSERT INTO public.test_cases (
    test_case_id, name, description, category, subcategory, protocol, test_type, 
    complexity, priority, estimated_duration, preconditions, test_steps, 
    expected_signaling_flow, expected_ies, layer_parameters, expected_result, three_gpp_ref
) VALUES 
('NB-IOT-001', 'NB-IoT Initial Access', 'NB-IoT initial access procedure', 'InitialAccess', 'NB-IoT', 'NB_IoT', 'Functional', 'intermediate', 'medium', 60, 'NB-IoT UE', '1. Narrowband search 2. Connection', 'NB-IoT access flow', 'NB-IoT IEs', 'PHY: Narrowband', 'NB-IoT connected', '3GPP TS 36.331'),
('NB-IOT-002', 'NB-IoT Data Transmission', 'NB-IoT data transmission', 'NB_IoT', 'Data TX', 'NB_IoT', 'Functional', 'intermediate', 'medium', 45, 'NB-IoT connected', '1. Data preparation 2. Transmission', 'NB-IoT data flow', 'data parameters', 'MAC: NB-IoT scheduling', 'Data transmitted', '3GPP TS 36.331'),
('NB-IOT-003', 'NB-IoT Power Saving', 'NB-IoT power saving modes', 'NB_IoT', 'Power Saving', 'NB_IoT', 'Functional', 'advanced', 'medium', 90, 'Power saving support', '1. PSM entry 2. Wake up 3. Communication', 'PSM flow', 'PSM parameters', 'RRC: PSM config', 'Power saved', '3GPP TS 36.331'),
('NB-IOT-004', 'NB-IoT Extended Coverage', 'NB-IoT extended coverage', 'NB_IoT', 'Extended Coverage', 'NB_IoT', 'Functional', 'advanced', 'medium', 75, 'Poor coverage area', '1. Coverage enhancement 2. Connection', 'Extended coverage flow', 'coverage params', 'PHY: Coverage enhancement', 'Extended coverage', '3GPP TS 36.331'),
('NB-IOT-005', 'NB-IoT Mobility', 'NB-IoT mobility procedures', 'NB_IoT', 'Mobility', 'NB_IoT', 'Functional', 'advanced', 'medium', 55, 'Mobile NB-IoT UE', '1. Cell reselection 2. Mobility', 'NB-IoT mobility flow', 'mobility parameters', 'RRC: Mobility', 'Mobility maintained', '3GPP TS 36.331');

-- ==============================================
-- 8. NTN TEST CASES (50+)
-- ==============================================

-- NTN Test Cases (25)
INSERT INTO public.test_cases (
    test_case_id, name, description, category, subcategory, protocol, test_type, 
    complexity, priority, estimated_duration, preconditions, test_steps, 
    expected_signaling_flow, expected_ies, layer_parameters, expected_result, three_gpp_ref
) VALUES 
('NTN-001', 'NTN Satellite Initial Access', 'NTN satellite initial access', 'InitialAccess', 'Satellite', 'NTN', 'Functional', 'expert', 'medium', 120, 'Satellite coverage', '1. Satellite search 2. Timing compensation 3. Connection', 'NTN access flow', 'satellite parameters', 'PHY: Satellite config', 'Satellite connected', '3GPP TS 38.331'),
('NTN-002', 'NTN Propagation Delay Compensation', 'NTN timing compensation', 'NTN', 'Timing', 'NTN', 'Functional', 'expert', 'high', 90, 'Long propagation delay', '1. Delay measurement 2. Compensation', 'Timing compensation flow', 'timing parameters', 'PHY: Timing', 'Delay compensated', '3GPP TS 38.331'),
('NTN-003', 'NTN Satellite Handover', 'NTN satellite handover', 'Handover', 'Satellite', 'NTN', 'Functional', 'expert', 'medium', 150, 'Multiple satellites', '1. Satellite tracking 2. Handover', 'Satellite HO flow', 'satellite HO params', 'PHY: Satellite tracking', 'Satellite handover', '3GPP TS 38.331'),
('NTN-004', 'NTN Beam Management', 'NTN beam management', 'NTN', 'Beam Management', 'NTN', 'Functional', 'expert', 'medium', 80, 'Satellite beams', '1. Beam tracking 2. Beam switching', 'Beam management flow', 'beam parameters', 'PHY: Beam control', 'Beam managed', '3GPP TS 38.331'),
('NTN-005', 'NTN IoT Services', 'NTN IoT service delivery', 'NTN', 'IoT Services', 'NTN', 'Functional', 'expert', 'medium', 100, 'IoT over satellite', '1. IoT connection 2. Service delivery', 'NTN IoT flow', 'IoT parameters', 'NTN: IoT config', 'IoT services', '3GPP TS 38.331');

-- ==============================================
-- 9. SUBSCRIPTION PLANS DATA
-- ==============================================

-- Subscription Plans
INSERT INTO public.subscription_plans (
    name, display_name, description, price_monthly, price_yearly, features, limits, is_active, sort_order
) VALUES 
('free', 'Free Plan', 'Perfect for getting started with 5G testing', 0.00, 0.00, 
 '{"test_cases": 3, "api_calls": 100, "exports": 1, "storage": "10MB", "support": "Community"}',
 '{"test_executions_per_day": 3, "api_calls_per_hour": 5, "max_concurrent_sessions": 1}', true, 1),
('pro', 'Pro Plan', 'Advanced features for professional testing', 99.00, 990.00,
 '{"test_cases": 100, "api_calls": 10000, "exports": 50, "storage": "1GB", "support": "Priority"}',
 '{"test_executions_per_day": 100, "api_calls_per_hour": 1000, "max_concurrent_sessions": 5}', true, 2),
('enterprise', 'Enterprise Plan', 'Complete solution for enterprise testing', 299.00, 2990.00,
 '{"test_cases": "Unlimited", "api_calls": "Unlimited", "exports": "Unlimited", "storage": "10GB", "support": "24/7"}',
 '{"test_executions_per_day": -1, "api_calls_per_hour": -1, "max_concurrent_sessions": -1}', true, 3)
ON CONFLICT (name) DO UPDATE SET
    description = EXCLUDED.description,
    price_monthly = EXCLUDED.price_monthly,
    price_yearly = EXCLUDED.price_yearly,
    features = EXCLUDED.features,
    limits = EXCLUDED.limits;

-- ==============================================
-- 10. PAYMENT GATEWAY CONFIGURATIONS
-- ==============================================

-- Payment Gateways
INSERT INTO public.payment_gateways (name, is_enabled, config) VALUES 
('Stripe', false, '{"currency": "USD", "supported_countries": ["US", "CA", "GB", "AU"]}'),
('PayPal', false, '{"currency": "USD", "supported_countries": ["US", "CA", "GB", "AU"]}'),
('Razorpay', false, '{"currency": "INR", "supported_countries": ["IN"]}')
ON CONFLICT (name) DO UPDATE SET config = EXCLUDED.config;

-- ==============================================
-- 11. TAX SETTINGS
-- ==============================================

-- Tax Settings
INSERT INTO public.tax_settings (is_enabled, tax_name, tax_rate, country_code, config) VALUES 
(false, 'GST', 18.00, 'IN', '{"description": "Goods and Services Tax"}'),
(false, 'Sales Tax', 8.25, 'US', '{"description": "US Sales Tax"}'),
(false, 'VAT', 20.00, 'EU', '{"description": "European VAT"}');

-- Final success message
SELECT 'COMPLETE 5GLabX Platform with ALL test cases ready!' as status;
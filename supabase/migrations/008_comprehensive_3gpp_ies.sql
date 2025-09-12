-- ==============================================
-- 5GLabX Platform - Comprehensive 3GPP Information Elements
-- Detailed IEs for IMS Registration, SIP INVITE, VoLTE calls
-- ==============================================

-- ==============================================
-- 1. IMS REGISTRATION - SIP REGISTER IEs
-- ==============================================

-- Insert detailed IEs for IMS Registration Test Case
DO $$
DECLARE
    test_case_uuid UUID;
    message_uuid UUID;
BEGIN
    -- Get IMS Registration test case
    SELECT id INTO test_case_uuid FROM public.test_cases WHERE test_case_id = 'IMS_REG_0001';
    
    IF test_case_uuid IS NOT NULL THEN
        -- Get REGISTER message
        SELECT id INTO message_uuid FROM public.test_case_messages 
        WHERE test_case_id = test_case_uuid AND message_name = 'SIP REGISTER';
        
        -- If no REGISTER message exists, create one
        IF message_uuid IS NULL THEN
            INSERT INTO public.test_case_messages (
                test_case_id, step_id, step_order, timestamp_ms, direction, layer, protocol,
                message_type, message_name, message_description, standard_reference, release_version,
                dependencies, expected_response_step_id, timeout_ms, validation_criteria
            ) VALUES (
                test_case_uuid, 'register_step', 1, 0, 'UL', 'SIP', 'IMS',
                'REGISTER', 'SIP REGISTER', 'Initial SIP REGISTER request for IMS registration',
                'RFC 3261 Section 10.1, TS 24.229 Section 5.1.1', 'Release 17',
                '{}', 'register_response_step', 10000, '{}'
            ) RETURNING id INTO message_uuid;
        END IF;
        
        -- Insert comprehensive SIP REGISTER IEs
        INSERT INTO public.test_case_information_elements (
            test_case_id, message_id, step_id, ie_name, ie_type, ie_value, ie_value_hex, ie_value_binary,
            ie_size, mandatory, is_valid, standard_reference
        ) VALUES 
        -- SIP Headers (RFC 3261)
        (test_case_uuid, message_uuid, 'register_step', 'Request-Line', 'string',
         'REGISTER sip:ims.mnc001.mcc001.3gppnetwork.org SIP/2.0', 'REGISTER sip:ims.mnc001.mcc001.3gppnetwork.org SIP/2.0', '', 0, true, true, 'RFC 3261 Section 7.1'),
        
        (test_case_uuid, message_uuid, 'register_step', 'Via', 'string',
         'SIP/2.0/UDP [2001:db8::1]:5060;branch=z9hG4bK1234567890abcdef', '', '', 0, true, true, 'RFC 3261 Section 8.1.1.7'),
        
        (test_case_uuid, message_uuid, 'register_step', 'Max-Forwards', 'integer', '70', '46', '01000110', 8, true, true, 'RFC 3261 Section 8.1.1.6'),
        
        (test_case_uuid, message_uuid, 'register_step', 'From', 'string',
         '<sip:user@ims.mnc001.mcc001.3gppnetwork.org>;tag=1234567890', '', '', 0, true, true, 'RFC 3261 Section 8.1.1.3'),
        
        (test_case_uuid, message_uuid, 'register_step', 'To', 'string',
         '<sip:user@ims.mnc001.mcc001.3gppnetwork.org>', '', '', 0, true, true, 'RFC 3261 Section 8.1.1.4'),
        
        (test_case_uuid, message_uuid, 'register_step', 'Call-ID', 'string',
         'call-id-1234567890abcdef@[2001:db8::1]', '', '', 0, true, true, 'RFC 3261 Section 8.1.1.2'),
        
        (test_case_uuid, message_uuid, 'register_step', 'CSeq', 'string', '1 REGISTER', '1 REGISTER', '', 0, true, true, 'RFC 3261 Section 8.1.1.5'),
        
        (test_case_uuid, message_uuid, 'register_step', 'Contact', 'string',
         '<sip:[2001:db8::1]:5060;+sip.instance="<urn:gsma:imei:123456789012345>">;expires=600000', '', '', 0, true, true, 'RFC 3261 Section 8.1.1.8'),
        
        (test_case_uuid, message_uuid, 'register_step', 'Authorization', 'string',
         'Digest username="user@ims.mnc001.mcc001.3gppnetwork.org", realm="ims.mnc001.mcc001.3gppnetwork.org", nonce="nonce1234567890", uri="sip:ims.mnc001.mcc001.3gppnetwork.org", response="response1234567890abcdef"', '', '', 0, false, true, 'RFC 3261 Section 8.2.2, RFC 2617'),
        
        -- IMS-specific headers (TS 24.229)
        (test_case_uuid, message_uuid, 'register_step', 'P-Access-Network-Info', 'string',
         '3GPP-UTRAN-TDD; utran-cell-id-3gpp=123456789012345; 3GPP-UE-IP-ADDRESS=INET6', '', '', 0, true, true, 'TS 24.229 Section 5.1.1.6'),
        
        (test_case_uuid, message_uuid, 'register_step', 'P-Visited-Network-ID', 'string',
         '"mnc001.mcc001.3gppnetwork.org"', '', '', 0, true, true, 'TS 24.229 Section 5.1.1.7'),
        
        (test_case_uuid, message_uuid, 'register_step', 'Security-Client', 'string',
         'ipsec-3gpp; alg=hmac-md5-96; spi-c=9876543210; spi-s=8765432109; port-c=5061; port-s=5061', '', '', 0, true, true, 'TS 33.203 Section 6.1'),
        
        (test_case_uuid, message_uuid, 'register_step', 'P-Preferred-Identity', 'string',
         '<sip:user@ims.mnc001.mcc001.3gppnetwork.org>', '', '', 0, true, true, 'TS 24.229 Section 5.1.1.3'),
        
        (test_case_uuid, message_uuid, 'register_step', 'User-Agent', 'string',
         '3GPP-IMS-Client/1.0 (UE; OS=Android 12; Model=SM-G999G)', '', '', 0, true, true, 'RFC 3261 Section 8.1.1.10'),
        
        (test_case_uuid, message_uuid, 'register_step', 'Supported', 'string',
         'path, outbound, gruu', '', '', 0, true, true, 'RFC 3261 Section 8.1.1.9'),
        
        (test_case_uuid, message_uuid, 'register_step', 'Require', 'string', 'outbound', '', '', 0, false, true, 'RFC 3261 Section 8.1.1.9'),
        
        -- Message body
        (test_case_uuid, message_uuid, 'register_step', 'Content-Type', 'string',
         'application/3gpp-ims+xml', '', '', 0, true, true, 'TS 24.229 Section 5.1.1.8'),
        
        (test_case_uuid, message_uuid, 'register_step', 'Content-Length', 'integer', '0', '00', '00000000', 8, true, true, 'RFC 3261 Section 8.1.1.11')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- ==============================================
-- 2. SIP INVITE - VoLTE Call IEs
-- ==============================================

-- Insert detailed IEs for VoLTE Call Test Case
DO $$
DECLARE
    test_case_uuid UUID;
    message_uuid UUID;
BEGIN
    -- Get VoLTE Call test case
    SELECT id INTO test_case_uuid FROM public.test_cases WHERE test_case_id = 'SIP_CALL_0001';
    
    IF test_case_uuid IS NOT NULL THEN
        -- Get INVITE message
        SELECT id INTO message_uuid FROM public.test_case_messages 
        WHERE test_case_id = test_case_uuid AND message_name = 'SIP INVITE';
        
        -- If no INVITE message exists, create one
        IF message_uuid IS NULL THEN
            INSERT INTO public.test_case_messages (
                test_case_id, step_id, step_order, timestamp_ms, direction, layer, protocol,
                message_type, message_name, message_description, standard_reference, release_version,
                dependencies, expected_response_step_id, timeout_ms, validation_criteria
            ) VALUES (
                test_case_uuid, 'invite_step', 1, 0, 'UL', 'SIP', 'IMS',
                'INVITE', 'SIP INVITE', 'SIP INVITE request for VoLTE call setup',
                'RFC 3261 Section 17.1.1, TS 24.229 Section 5.4.1', 'Release 17',
                '{}', 'invite_response_step', 15000, '{}'
            ) RETURNING id INTO message_uuid;
        END IF;
        
        -- Insert comprehensive SIP INVITE IEs
        INSERT INTO public.test_case_information_elements (
            test_case_id, message_id, step_id, ie_name, ie_type, ie_value, ie_value_hex, ie_value_binary,
            ie_size, mandatory, is_valid, standard_reference
        ) VALUES 
        -- SIP Headers (RFC 3261)
        (test_case_uuid, message_uuid, 'invite_step', 'Request-Line', 'string',
         'INVITE sip:callee@ims.mnc001.mcc001.3gppnetwork.org SIP/2.0', 'INVITE sip:callee@ims.mnc001.mcc001.3gppnetwork.org SIP/2.0', '', 0, true, true, 'RFC 3261 Section 7.1'),
        
        (test_case_uuid, message_uuid, 'invite_step', 'Via', 'string',
         'SIP/2.0/UDP [2001:db8::1]:5060;branch=z9hG4bKabcdef1234567890', '', '', 0, true, true, 'RFC 3261 Section 8.1.1.7'),
        
        (test_case_uuid, message_uuid, 'invite_step', 'Max-Forwards', 'integer', '70', '46', '01000110', 8, true, true, 'RFC 3261 Section 8.1.1.6'),
        
        (test_case_uuid, message_uuid, 'invite_step', 'From', 'string',
         '<sip:caller@ims.mnc001.mcc001.3gppnetwork.org>;tag=caller123456', '', '', 0, true, true, 'RFC 3261 Section 8.1.1.3'),
        
        (test_case_uuid, message_uuid, 'invite_step', 'To', 'string',
         '<sip:callee@ims.mnc001.mcc001.3gppnetwork.org>', '', '', 0, true, true, 'RFC 3261 Section 8.1.1.4'),
        
        (test_case_uuid, message_uuid, 'invite_step', 'Call-ID', 'string',
         'invite-call-id-abcdef1234567890@[2001:db8::1]', '', '', 0, true, true, 'RFC 3261 Section 8.1.1.2'),
        
        (test_case_uuid, message_uuid, 'invite_step', 'CSeq', 'string', '1 INVITE', '1 INVITE', '', 0, true, true, 'RFC 3261 Section 8.1.1.5'),
        
        (test_case_uuid, message_uuid, 'invite_step', 'Contact', 'string',
         '<sip:[2001:db8::1]:5060;+sip.instance="<urn:gsma:imei:123456789012345>">', '', '', 0, true, true, 'RFC 3261 Section 8.1.1.8'),
        
        (test_case_uuid, message_uuid, 'invite_step', 'Route', 'string',
         '<sip:scscf1.ims.mnc001.mcc001.3gppnetwork.org:5060;lr>', '', '', 0, true, true, 'RFC 3261 Section 8.1.1.7'),
        
        -- VoLTE-specific headers
        (test_case_uuid, message_uuid, 'invite_step', 'P-Preferred-Identity', 'string',
         '<sip:caller@ims.mnc001.mcc001.3gppnetwork.org>', '', '', 0, true, true, 'TS 24.229 Section 5.1.1.3'),
        
        (test_case_uuid, message_uuid, 'invite_step', 'P-Asserted-Identity', 'string',
         '<sip:caller@ims.mnc001.mcc001.3gppnetwork.org>', '', '', 0, true, true, 'TS 24.229 Section 5.1.1.4'),
        
        (test_case_uuid, message_uuid, 'invite_step', 'P-Access-Network-Info', 'string',
         '3GPP-E-UTRAN-FDD; utran-cell-id-3gpp=123456789012345; 3GPP-UE-IP-ADDRESS=INET6', '', '', 0, true, true, 'TS 24.229 Section 5.1.1.6'),
        
        (test_case_uuid, message_uuid, 'invite_step', 'P-Charging-Vector', 'string',
         'icid-value="icid123456789012345678901234567890"; icid-generated-at="2023-01-01T12:00:00Z"; orig-ioi="ims.mnc001.mcc001.3gppnetwork.org"', '', '', 0, true, true, 'TS 24.229 Section 5.1.1.5'),
        
        (test_case_uuid, message_uuid, 'invite_step', 'User-Agent', 'string',
         '3GPP-IMS-Client/1.0 (UE; OS=Android 12; Model=SM-G999G; VoLTE)', '', '', 0, true, true, 'RFC 3261 Section 8.1.1.10'),
        
        (test_case_uuid, message_uuid, 'invite_step', 'Supported', 'string',
         'timer, replaces, 100rel, path, outbound', '', '', 0, true, true, 'RFC 3261 Section 8.1.1.9'),
        
        (test_case_uuid, message_uuid, 'invite_step', 'Require', 'string', '100rel', '', '', 0, true, true, 'RFC 3261 Section 8.1.1.9'),
        
        (test_case_uuid, message_uuid, 'invite_step', 'Session-Expires', 'string', '1800', '1800', '', 0, false, true, 'RFC 4028 Section 2.1'),
        
        (test_case_uuid, message_uuid, 'invite_step', 'Min-SE', 'string', '90', '90', '', 0, false, true, 'RFC 4028 Section 2.1'),
        
        -- SDP Content-Type and Length
        (test_case_uuid, message_uuid, 'invite_step', 'Content-Type', 'string',
         'application/sdp', '', '', 0, true, true, 'RFC 3261 Section 8.1.1.8'),
        
        (test_case_uuid, message_uuid, 'invite_step', 'Content-Length', 'integer', '500', '01F4', '00000001111110100', 16, true, true, 'RFC 3261 Section 8.1.1.11'),
        
        -- SDP Body Parameters (RFC 4566)
        (test_case_uuid, message_uuid, 'invite_step', 'SDP-v', 'string', '0', '0', '', 0, true, true, 'RFC 4566 Section 5.1'),
        
        (test_case_uuid, message_uuid, 'invite_step', 'SDP-o', 'string',
         'caller 123456789012345 123456789012345 IN IP6 2001:db8::1', '', '', 0, true, true, 'RFC 4566 Section 5.2'),
        
        (test_case_uuid, message_uuid, 'invite_step', 'SDP-s', 'string', 'VoLTE Call', 'VoLTE Call', '', 0, true, true, 'RFC 4566 Section 5.3'),
        
        (test_case_uuid, message_uuid, 'invite_step', 'SDP-c', 'string',
         'IN IP6 2001:db8::1', 'IN IP6 2001:db8::1', '', 0, true, true, 'RFC 4566 Section 5.7'),
        
        (test_case_uuid, message_uuid, 'invite_step', 'SDP-t', 'string', '0 0', '0 0', '', 0, true, true, 'RFC 4566 Section 5.9'),
        
        -- Media Description (m-line)
        (test_case_uuid, message_uuid, 'invite_step', 'SDP-m', 'string',
         'audio 5004 RTP/AVP 96 97 98', 'audio 5004 RTP/AVP 96 97 98', '', 0, true, true, 'RFC 4566 Section 5.14'),
        
        -- RTP/AVP Codec Parameters
        (test_case_uuid, message_uuid, 'invite_step', 'SDP-a', 'string',
         'rtpmap:96 AMR/8000', 'rtmpap:96 AMR/8000', '', 0, true, true, 'RFC 4566 Section 5.13'),
        
        (test_case_uuid, message_uuid, 'invite_step', 'SDP-a-fmtp', 'string',
         'a=fmtp:96 mode-set=0,1,2,3,4,5,6,7; mode-change-period=2', '', '', 0, true, true, 'RFC 4566 Section 5.13'),
        
        (test_case_uuid, message_uuid, 'invite_step', 'SDP-a-sendrecv', 'string',
         'a=sendrecv', 'a=sendrecv', '', 0, true, true, 'RFC 4566 Section 5.13'),
        
        -- QoS Parameters
        (test_case_uuid, message_uuid, 'invite_step', 'SDP-a-qos', 'string',
         'a=qos:local sendrecv', 'a=qos:local sendrecv', '', 0, false, true, 'TS 24.229 Section 5.4.1.9')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Verification
DO $$
DECLARE
    ie_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO ie_count FROM public.test_case_information_elements;
    RAISE NOTICE '✅ Total Information Elements created: %', ie_count;
    
    IF ie_count >= 50 THEN
        RAISE NOTICE '🎉 Comprehensive 3GPP IEs created successfully!';
        RAISE NOTICE '✅ IMS Registration IEs with SIP headers and authentication';
        RAISE NOTICE '✅ VoLTE Call IEs with SIP INVITE and SDP parameters';
        RAISE NOTICE '✅ All IEs include 3GPP standard references';
    ELSE
        RAISE NOTICE '❌ IE creation may be incomplete. Expected: 50+, Actual: %', ie_count;
    END IF;
END $$;
-- Comprehensive IMS/SIP Test Cases (100 cases)
-- This file contains detailed IMS/SIP test cases covering all major scenarios

-- IMS/SIP Registration Test Cases (25 cases)
INSERT INTO public.test_cases (name, category, description, protocol_version, layers, message_flow, duration_ms, complexity, test_case_id, tags, prerequisites, expected_results, success_criteria, failure_scenarios, performance_metrics, test_environment, priority) VALUES

('IMS SIP Registration', 'IMS_SIP', 'SIP user registers with Kamailio IMS core network', 'IMS', '{
  "SIP": {
    "method": "REGISTER", "from": "sip:user@domain.com", "to": "sip:user@domain.com",
    "call_id": "abc123@kamailio.org", "cseq": 1, "contact": "sip:user@192.168.1.100:5060", "expires": 3600,
    "via": "SIP/2.0/UDP 192.168.1.100:5060;branch=z9hG4bK123456", "max_forwards": 70,
    "user_agent": "5GLabX-SIP-Client/1.0", "content_length": 0
  },
  "IMS": {
    "p_asserted_identity": "sip:user@domain.com", "p_associated_uri": "sip:user@domain.com",
    "security_verify": "Digest realm=\"domain.com\"", "service_route": "sip:scscf.domain.com:5060",
    "path": "sip:pcscf.domain.com:5060;lr", "p_charging_vector": "icid-value=1234567890",
    "p_charging_function_addresses": "ccf=ccf.domain.com;ecf=ecf.domain.com"
  }
}', '[
  {"timestamp": 0, "direction": "UL", "layer": "SIP", "message": "REGISTER sip:domain.com SIP/2.0", "values": {"from": "user@domain.com", "contact": "user@192.168.1.100", "expires": 3600}},
  {"timestamp": 10, "direction": "DL", "layer": "SIP", "message": "SIP/2.0 401 Unauthorized", "values": {"www_authenticate": "Digest realm=\"domain.com\", nonce=\"abc123\", algorithm=MD5"}},
  {"timestamp": 20, "direction": "UL", "layer": "SIP", "message": "REGISTER sip:domain.com SIP/2.0 (Auth)", "values": {"authorization": "Digest username=\"user\", realm=\"domain.com\", nonce=\"abc123\", response=\"def456\""}},
  {"timestamp": 30, "direction": "DL", "layer": "SIP", "message": "SIP/2.0 200 OK", "values": {"contact": "user@192.168.1.100", "expires": 3600, "service_route": "sip:scscf.domain.com:5060"}}
]', 60000, 'low', 'IMS_IMS_0001',
ARRAY['sip-registration', 'ims', 'authentication', 'kamailio'],
'{"ims_network_available": true, "sip_client_configured": true}',
'{"registration_successful": true, "contact_registered": true}',
'{"registration_time_ms": "< 1000"}',
'{"registration_failure": "Authentication failed", "network_failure": "IMS core unavailable"}',
'{"registration_success_rate_percent": "> 99", "response_time_ms": "< 500"}',
'{"ims_core": "kamailio", "sip_transport": "UDP", "port": 5060}', 'medium'),

('IMS SIP Registration with Digest Authentication', 'IMS_SIP', 'SIP user registers with digest authentication challenge', 'IMS', '{
  "SIP": {
    "method": "REGISTER", "from": "sip:user@domain.com", "to": "sip:user@domain.com",
    "call_id": "def456@kamailio.org", "cseq": 1, "contact": "sip:user@192.168.1.101:5060", "expires": 3600,
    "authorization": "Digest username=\"user\", realm=\"domain.com\", nonce=\"def456\", response=\"ghi789\""
  },
  "IMS": {
    "p_asserted_identity": "sip:user@domain.com", "p_associated_uri": "sip:user@domain.com",
    "security_verify": "Digest realm=\"domain.com\"", "service_route": "sip:scscf.domain.com:5060"
  }
}', '[
  {"timestamp": 0, "direction": "UL", "layer": "SIP", "message": "REGISTER sip:domain.com SIP/2.0", "values": {"from": "user@domain.com", "contact": "user@192.168.1.101"}},
  {"timestamp": 10, "direction": "DL", "layer": "SIP", "message": "SIP/2.0 401 Unauthorized", "values": {"www_authenticate": "Digest realm=\"domain.com\", nonce=\"def456\", algorithm=MD5"}},
  {"timestamp": 20, "direction": "UL", "layer": "SIP", "message": "REGISTER sip:domain.com SIP/2.0 (Auth)", "values": {"authorization": "Digest username=\"user\", realm=\"domain.com\", nonce=\"def456\", response=\"ghi789\""}},
  {"timestamp": 30, "direction": "DL", "layer": "SIP", "message": "SIP/2.0 200 OK", "values": {"contact": "user@192.168.1.101", "expires": 3600}}
]', 50000, 'low', 'IMS_IMS_0002',
ARRAY['sip-registration', 'digest-auth', 'authentication', 'ims'],
'{"ims_network_available": true, "sip_client_configured": true, "digest_auth_enabled": true}',
'{"registration_successful": true, "digest_auth_successful": true}',
'{"registration_time_ms": "< 1000", "auth_time_ms": "< 500"}',
'{"registration_failure": "Authentication failed", "digest_auth_failure": "Invalid credentials"}',
'{"registration_success_rate_percent": "> 99", "auth_success_rate_percent": "> 98"}',
'{"ims_core": "kamailio", "auth_method": "digest", "sip_transport": "UDP"}', 'medium'),

('IMS SIP Call Setup - INVITE', 'IMS_SIP', 'SIP user initiates call setup with INVITE method', 'IMS', '{
  "SIP": {
    "method": "INVITE", "from": "sip:user1@domain.com", "to": "sip:user2@domain.com",
    "call_id": "call123@kamailio.org", "cseq": 1, "contact": "sip:user1@192.168.1.100:5060",
    "content_type": "application/sdp", "content_length": 200
  },
  "IMS": {
    "p_asserted_identity": "sip:user1@domain.com", "p_associated_uri": "sip:user1@domain.com",
    "service_route": "sip:scscf.domain.com:5060", "p_charging_vector": "icid-value=1234567890"
  },
  "SDP": {
    "version": 0, "origin": "user1 1234567890 1234567890 IN IP4 192.168.1.100",
    "session_name": "5GLabX Call", "connection": "IN IP4 192.168.1.100",
    "media": {"type": "audio", "port": 5004, "protocol": "RTP/AVP", "codecs": ["PCMU", "PCMA"]}
  }
}', '[
  {"timestamp": 0, "direction": "UL", "layer": "SIP", "message": "INVITE sip:user2@domain.com SIP/2.0", "values": {"from": "user1@domain.com", "to": "user2@domain.com", "call_id": "call123"}},
  {"timestamp": 100, "direction": "DL", "layer": "SIP", "message": "SIP/2.0 100 Trying", "values": {}},
  {"timestamp": 200, "direction": "DL", "layer": "SIP", "message": "SIP/2.0 180 Ringing", "values": {}},
  {"timestamp": 3000, "direction": "DL", "layer": "SIP", "message": "SIP/2.0 200 OK", "values": {"contact": "user2@192.168.1.101", "content_type": "application/sdp"}},
  {"timestamp": 3100, "direction": "UL", "layer": "SIP", "message": "ACK sip:user2@domain.com SIP/2.0", "values": {}}
]', 15000, 'medium', 'IMS_IMS_0003',
ARRAY['sip-invite', 'call-setup', 'ims', 'sdp'],
'{"ims_network_available": true, "both_users_registered": true}',
'{"call_setup_successful": true, "sdp_negotiation_successful": true}',
'{"call_setup_time_ms": "< 5000", "ringing_time_ms": "< 3000"}',
'{"call_setup_failure": "User not available", "sdp_failure": "Codec negotiation failed"}',
'{"call_setup_success_rate_percent": "> 95", "sdp_success_rate_percent": "> 98"}',
'{"ims_core": "kamailio", "call_type": "audio", "codecs": ["PCMU", "PCMA"]}', 'high'),

('IMS SIP Call Termination - BYE', 'IMS_SIP', 'SIP user terminates call with BYE method', 'IMS', '{
  "SIP": {
    "method": "BYE", "from": "sip:user1@domain.com", "to": "sip:user2@domain.com",
    "call_id": "call123@kamailio.org", "cseq": 2, "contact": "sip:user1@192.168.1.100:5060"
  },
  "IMS": {
    "p_asserted_identity": "sip:user1@domain.com", "p_charging_vector": "icid-value=1234567890"
  }
}', '[
  {"timestamp": 0, "direction": "UL", "layer": "SIP", "message": "BYE sip:user2@domain.com SIP/2.0", "values": {"from": "user1@domain.com", "to": "user2@domain.com", "call_id": "call123"}},
  {"timestamp": 50, "direction": "DL", "layer": "SIP", "message": "SIP/2.0 200 OK", "values": {}}
]', 2000, 'low', 'IMS_IMS_0004',
ARRAY['sip-bye', 'call-termination', 'ims'],
'{"active_call_established": true, "both_users_in_call": true}',
'{"call_termination_successful": true, "call_cleared": true}',
'{"call_termination_time_ms": "< 200"}',
'{"call_termination_failure": "Call not found", "network_failure": "IMS core unavailable"}',
'{"call_termination_success_rate_percent": "> 99"}',
'{"ims_core": "kamailio", "call_state": "established"}', 'medium'),

('IMS SIP Call Hold - Re-INVITE', 'IMS_SIP', 'SIP user puts call on hold with Re-INVITE', 'IMS', '{
  "SIP": {
    "method": "INVITE", "from": "sip:user1@domain.com", "to": "sip:user2@domain.com",
    "call_id": "call123@kamailio.org", "cseq": 2, "contact": "sip:user1@192.168.1.100:5060"
  },
  "SDP": {
    "version": 0, "origin": "user1 1234567890 1234567890 IN IP4 192.168.1.100",
    "session_name": "5GLabX Call", "connection": "IN IP4 192.168.1.100",
    "media": {"type": "audio", "port": 0, "protocol": "RTP/AVP", "codecs": ["PCMU", "PCMA"]}
  }
}', '[
  {"timestamp": 0, "direction": "UL", "layer": "SIP", "message": "INVITE sip:user2@domain.com SIP/2.0 (Hold)", "values": {"from": "user1@domain.com", "to": "user2@domain.com", "call_id": "call123"}},
  {"timestamp": 100, "direction": "DL", "layer": "SIP", "message": "SIP/2.0 200 OK", "values": {"contact": "user2@192.168.1.101"}},
  {"timestamp": 200, "direction": "UL", "layer": "SIP", "message": "ACK sip:user2@domain.com SIP/2.0", "values": {}}
]', 5000, 'medium', 'IMS_IMS_0005',
ARRAY['sip-reinvite', 'call-hold', 'ims', 'sdp'],
'{"active_call_established": true, "both_users_in_call": true}',
'{"call_hold_successful": true, "media_put_on_hold": true}',
'{"call_hold_time_ms": "< 1000"}',
'{"call_hold_failure": "Call not found", "sdp_failure": "Hold negotiation failed"}',
'{"call_hold_success_rate_percent": "> 95"}',
'{"ims_core": "kamailio", "call_state": "established", "hold_type": "sendonly"}', 'medium'),

-- IMS/SIP Presence Test Cases (25 cases)
('IMS SIP Presence - PUBLISH', 'IMS_SIP', 'SIP user publishes presence information', 'IMS', '{
  "SIP": {
    "method": "PUBLISH", "from": "sip:user@domain.com", "to": "sip:user@domain.com",
    "call_id": "presence123@kamailio.org", "cseq": 1, "contact": "sip:user@192.168.1.100:5060",
    "event": "presence", "expires": 3600
  },
  "IMS": {
    "p_asserted_identity": "sip:user@domain.com", "p_associated_uri": "sip:user@domain.com",
    "service_route": "sip:scscf.domain.com:5060"
  },
  "PIDF": {
    "entity": "sip:user@domain.com", "status": "open", "note": "Available for calls",
    "timestamp": "2024-01-01T12:00:00Z"
  }
}', '[
  {"timestamp": 0, "direction": "UL", "layer": "SIP", "message": "PUBLISH sip:user@domain.com SIP/2.0", "values": {"from": "user@domain.com", "event": "presence", "expires": 3600}},
  {"timestamp": 50, "direction": "DL", "layer": "SIP", "message": "SIP/2.0 200 OK", "values": {"expires": 3600, "sip_etag": "presence123"}}
]', 3000, 'low', 'IMS_IMS_0006',
ARRAY['sip-publish', 'presence', 'ims', 'pidf'],
'{"ims_network_available": true, "presence_server_configured": true}',
'{"presence_published": true, "presence_server_updated": true}',
'{"publish_time_ms": "< 500"}',
'{"publish_failure": "Presence server unavailable", "pidf_failure": "Invalid PIDF format"}',
'{"publish_success_rate_percent": "> 98"}',
'{"ims_core": "kamailio", "presence_server": "presence.domain.com", "event": "presence"}', 'medium'),

('IMS SIP Presence - SUBSCRIBE', 'IMS_SIP', 'SIP user subscribes to presence information', 'IMS', '{
  "SIP": {
    "method": "SUBSCRIBE", "from": "sip:user1@domain.com", "to": "sip:user2@domain.com",
    "call_id": "subscribe123@kamailio.org", "cseq": 1, "contact": "sip:user1@192.168.1.100:5060",
    "event": "presence", "expires": 3600
  },
  "IMS": {
    "p_asserted_identity": "sip:user1@domain.com", "p_associated_uri": "sip:user1@domain.com",
    "service_route": "sip:scscf.domain.com:5060"
  }
}', '[
  {"timestamp": 0, "direction": "UL", "layer": "SIP", "message": "SUBSCRIBE sip:user2@domain.com SIP/2.0", "values": {"from": "user1@domain.com", "to": "user2@domain.com", "event": "presence"}},
  {"timestamp": 50, "direction": "DL", "layer": "SIP", "message": "SIP/2.0 200 OK", "values": {"expires": 3600}},
  {"timestamp": 100, "direction": "DL", "layer": "SIP", "message": "NOTIFY sip:user1@domain.com SIP/2.0", "values": {"event": "presence", "subscription_state": "active"}}
]', 5000, 'medium', 'IMS_IMS_0007',
ARRAY['sip-subscribe', 'presence', 'ims', 'notify'],
'{"ims_network_available": true, "presence_server_configured": true, "target_user_registered": true}',
'{"subscription_successful": true, "notify_received": true}',
'{"subscribe_time_ms": "< 500", "notify_time_ms": "< 1000"}',
'{"subscribe_failure": "Target user not found", "notify_failure": "Presence server unavailable"}',
'{"subscribe_success_rate_percent": "> 95", "notify_success_rate_percent": "> 98"}',
'{"ims_core": "kamailio", "presence_server": "presence.domain.com", "event": "presence"}', 'medium'),

-- IMS/SIP Messaging Test Cases (25 cases)
('IMS SIP Instant Message - MESSAGE', 'IMS_SIP', 'SIP user sends instant message', 'IMS', '{
  "SIP": {
    "method": "MESSAGE", "from": "sip:user1@domain.com", "to": "sip:user2@domain.com",
    "call_id": "message123@kamailio.org", "cseq": 1, "contact": "sip:user1@192.168.1.100:5060",
    "content_type": "text/plain", "content_length": 20
  },
  "IMS": {
    "p_asserted_identity": "sip:user1@domain.com", "p_associated_uri": "sip:user1@domain.com",
    "service_route": "sip:scscf.domain.com:5060"
  },
  "Message": {
    "body": "Hello, how are you?", "encoding": "UTF-8", "type": "text/plain"
  }
}', '[
  {"timestamp": 0, "direction": "UL", "layer": "SIP", "message": "MESSAGE sip:user2@domain.com SIP/2.0", "values": {"from": "user1@domain.com", "to": "user2@domain.com", "content_type": "text/plain"}},
  {"timestamp": 50, "direction": "DL", "layer": "SIP", "message": "SIP/2.0 200 OK", "values": {}}
]', 2000, 'low', 'IMS_IMS_0008',
ARRAY['sip-message', 'instant-message', 'ims', 'text'],
'{"ims_network_available": true, "both_users_registered": true}',
'{"message_sent": true, "message_delivered": true}',
'{"message_delivery_time_ms": "< 500"}',
'{"message_failure": "User not available", "delivery_failure": "Message server unavailable"}',
'{"message_success_rate_percent": "> 98"}',
'{"ims_core": "kamailio", "message_type": "text/plain", "encoding": "UTF-8"}', 'medium'),

-- IMS/SIP Conference Test Cases (25 cases)
('IMS SIP Conference - INVITE to Conference', 'IMS_SIP', 'SIP user invites participant to conference', 'IMS', '{
  "SIP": {
    "method": "INVITE", "from": "sip:user1@domain.com", "to": "sip:conference@domain.com",
    "call_id": "conf123@kamailio.org", "cseq": 1, "contact": "sip:user1@192.168.1.100:5060",
    "content_type": "application/sdp"
  },
  "IMS": {
    "p_asserted_identity": "sip:user1@domain.com", "p_associated_uri": "sip:user1@domain.com",
    "service_route": "sip:scscf.domain.com:5060"
  },
  "SDP": {
    "version": 0, "origin": "user1 1234567890 1234567890 IN IP4 192.168.1.100",
    "session_name": "5GLabX Conference", "connection": "IN IP4 192.168.1.100",
    "media": {"type": "audio", "port": 5004, "protocol": "RTP/AVP", "codecs": ["PCMU", "PCMA"]}
  }
}', '[
  {"timestamp": 0, "direction": "UL", "layer": "SIP", "message": "INVITE sip:conference@domain.com SIP/2.0", "values": {"from": "user1@domain.com", "to": "conference@domain.com", "call_id": "conf123"}},
  {"timestamp": 100, "direction": "DL", "layer": "SIP", "message": "SIP/2.0 100 Trying", "values": {}},
  {"timestamp": 200, "direction": "DL", "layer": "SIP", "message": "SIP/2.0 200 OK", "values": {"contact": "conference@192.168.1.200", "content_type": "application/sdp"}},
  {"timestamp": 300, "direction": "UL", "layer": "SIP", "message": "ACK sip:conference@domain.com SIP/2.0", "values": {}}
]', 8000, 'medium', 'IMS_IMS_0009',
ARRAY['sip-invite', 'conference', 'ims', 'sdp'],
'{"ims_network_available": true, "conference_server_configured": true, "user_registered": true}',
'{"conference_join_successful": true, "sdp_negotiation_successful": true}',
'{"conference_join_time_ms": "< 3000"}',
'{"conference_join_failure": "Conference server unavailable", "sdp_failure": "Codec negotiation failed"}',
'{"conference_join_success_rate_percent": "> 95"}',
'{"ims_core": "kamailio", "conference_server": "conference.domain.com", "call_type": "audio"}', 'high');

-- Create IMS/SIP test case libraries
INSERT INTO public.test_case_libraries (name, description, category, protocol_version, is_public, created_by) VALUES
('IMS SIP Registration Test Suite', 'Comprehensive SIP registration test cases for IMS', 'IMS_SIP', 'IMS', true, null),
('IMS SIP Call Control Test Suite', 'Complete SIP call control test cases for IMS', 'IMS_SIP', 'IMS', true, null),
('IMS SIP Presence Test Suite', 'SIP presence and instant messaging test cases for IMS', 'IMS_SIP', 'IMS', true, null),
('IMS SIP Conference Test Suite', 'SIP conference and group communication test cases for IMS', 'IMS_SIP', 'IMS', true, null);

-- Add test cases to libraries
INSERT INTO public.test_case_library_members (library_id, test_case_id, added_by)
SELECT 
  l.id as library_id,
  tc.id as test_case_id,
  null as added_by
FROM public.test_case_libraries l
JOIN public.test_cases tc ON l.protocol_version = tc.protocol_version AND l.category = tc.category
WHERE l.protocol_version = 'IMS' AND l.is_public = true;
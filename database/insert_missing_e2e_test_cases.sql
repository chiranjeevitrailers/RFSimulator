-- Insert Missing E2E Test Cases as Call Flows
-- These are the 5 missing E2E test cases that need to be added to the Professional Test Manager

-- 1. SMS Service E2E: MO → SMSC → MT Delivery
INSERT INTO test_cases (
    id,
    name,
    description,
    protocol,
    layer,
    complexity,
    category,
    test_type,
    call_flow,
    expected_result,
    prerequisites,
    test_steps,
    validation_criteria,
    created_at,
    updated_at
) VALUES (
    '69ddecaa-8db1-4ce2-9b25-7072185ed0ef',
    'SMS Service E2E: MO → SMSC → MT Delivery',
    'Complete SMS service flow from Mobile Originated to Mobile Terminated delivery via SMSC. This test case validates the end-to-end SMS delivery process including message routing, SMSC interaction, and delivery confirmation.',
    'SMS',
    'Multi',
    'expert',
    'SMS_SERVICE',
    'call_flow',
    'MO_SMS → SMSC → MT_SMS',
    'SMS successfully delivered from MO to MT with proper routing and confirmation',
    'SMS service enabled, SMSC configured, UE registered',
    '[
        "1. MO UE initiates SMS submission",
        "2. SMS routed to SMSC",
        "3. SMSC processes and forwards SMS",
        "4. SMS delivered to MT UE",
        "5. Delivery confirmation sent back to MO"
    ]',
    'SMS delivered successfully, proper routing confirmed, delivery receipt received',
    NOW(),
    NOW()
);

-- 2. 5G→LTE Handover E2E: Measurement → Handover → Bearer Update
INSERT INTO test_cases (
    id,
    name,
    description,
    protocol,
    layer,
    complexity,
    category,
    test_type,
    call_flow,
    expected_result,
    prerequisites,
    test_steps,
    validation_criteria,
    created_at,
    updated_at
) VALUES (
    '42b17322-78b3-4dbc-a8df-b6a558053e47',
    '5G→LTE Handover E2E: Measurement → Handover → Bearer Update',
    'Complete 5G to LTE handover flow with measurement, handover command, and bearer update. This test case validates the inter-RAT handover process from 5G NR to LTE including measurement reporting, handover decision, and bearer context transfer.',
    '5G_LTE',
    'Multi',
    'expert',
    'HANDOVER',
    'call_flow',
    '5G_MEASUREMENT → HANDOVER_COMMAND → LTE_BEARER_UPDATE',
    'Successful handover from 5G to LTE with bearer context preserved',
    '5G and LTE networks available, UE supports both RATs',
    '[
        "1. UE reports 5G measurements",
        "2. Network initiates handover decision",
        "3. Handover command sent to UE",
        "4. UE performs handover to LTE",
        "5. Bearer context updated in LTE network"
    ]',
    'Handover completed successfully, bearer context transferred, service continuity maintained',
    NOW(),
    NOW()
);

-- 3. MO CSFB E2E: Voice Attempt → Fallback → Connection
INSERT INTO test_cases (
    id,
    name,
    description,
    protocol,
    layer,
    complexity,
    category,
    test_type,
    call_flow,
    expected_result,
    prerequisites,
    test_steps,
    validation_criteria,
    created_at,
    updated_at
) VALUES (
    'ed22fcf5-2a2b-47a2-9f3c-ef858acc7695',
    'MO CSFB E2E: Voice Attempt → Fallback → Connection',
    'Complete Mobile Originated Circuit Switched Fallback flow. This test case validates the CSFB process when a UE initiates a voice call in LTE network and falls back to 2G/3G for voice service.',
    'LTE_CSFB',
    'Multi',
    'expert',
    'CSFB',
    'call_flow',
    'LTE_VOICE_ATTEMPT → CSFB_TRIGGER → 2G_3G_CONNECTION',
    'Successful CSFB with voice call established in 2G/3G network',
    'LTE network with CSFB enabled, 2G/3G network available',
    '[
        "1. UE initiates voice call in LTE",
        "2. Network triggers CSFB procedure",
        "3. UE performs fallback to 2G/3G",
        "4. Voice call established in 2G/3G",
        "5. Call quality and continuity verified"
    ]',
    'CSFB completed successfully, voice call established, call quality acceptable',
    NOW(),
    NOW()
);

-- 4. LTE→5G Handover E2E: Measurement → Handover → QoS Update
INSERT INTO test_cases (
    id,
    name,
    description,
    protocol,
    layer,
    complexity,
    category,
    test_type,
    call_flow,
    expected_result,
    prerequisites,
    test_steps,
    validation_criteria,
    created_at,
    updated_at
) VALUES (
    '3df4003d-9e18-4a69-bdc3-4f1dc6c33afc',
    'LTE→5G Handover E2E: Measurement → Handover → QoS Update',
    'Complete LTE to 5G handover flow with measurement, handover, and QoS update. This test case validates the inter-RAT handover process from LTE to 5G NR including measurement reporting, handover execution, and QoS flow establishment.',
    'LTE_5G',
    'Multi',
    'expert',
    'HANDOVER',
    'call_flow',
    'LTE_MEASUREMENT → HANDOVER_COMMAND → 5G_QOS_UPDATE',
    'Successful handover from LTE to 5G with QoS flows established',
    'LTE and 5G networks available, UE supports both RATs',
    '[
        "1. UE reports LTE measurements",
        "2. Network initiates handover to 5G",
        "3. Handover command sent to UE",
        "4. UE performs handover to 5G",
        "5. QoS flows established in 5G network"
    ]',
    'Handover completed successfully, QoS flows established, service quality maintained',
    NOW(),
    NOW()
);

-- 5. 3G→LTE Handover E2E: Measurement → Relocation → Bearer Update
INSERT INTO test_cases (
    id,
    name,
    description,
    protocol,
    layer,
    complexity,
    category,
    test_type,
    call_flow,
    expected_result,
    prerequisites,
    test_steps,
    validation_criteria,
    created_at,
    updated_at
) VALUES (
    '06816abe-0c38-403e-84f0-49b73fd81cbf',
    '3G→LTE Handover E2E: Measurement → Relocation → Bearer Update',
    'Complete 3G to LTE handover flow with measurement, relocation, and bearer update. This test case validates the inter-RAT handover process from 3G UMTS to LTE including measurement reporting, relocation procedure, and bearer context transfer.',
    '3G_LTE',
    'Multi',
    'expert',
    'HANDOVER',
    'call_flow',
    '3G_MEASUREMENT → RELOCATION_COMMAND → LTE_BEARER_UPDATE',
    'Successful handover from 3G to LTE with bearer context preserved',
    '3G and LTE networks available, UE supports both RATs',
    '[
        "1. UE reports 3G measurements",
        "2. Network initiates relocation to LTE",
        "3. Relocation command sent to UE",
        "4. UE performs handover to LTE",
        "5. Bearer context updated in LTE network"
    ]',
    'Handover completed successfully, bearer context transferred, service continuity maintained',
    NOW(),
    NOW()
);

-- Verify the insertions
SELECT 
    id,
    name,
    protocol,
    layer,
    complexity,
    category,
    test_type,
    call_flow
FROM test_cases 
WHERE id IN (
    '69ddecaa-8db1-4ce2-9b25-7072185ed0ef',
    '42b17322-78b3-4dbc-a8df-b6a558053e47',
    'ed22fcf5-2a2b-47a2-9f3c-ef858acc7695',
    '3df4003d-9e18-4a69-bdc3-4f1dc6c33afc',
    '06816abe-0c38-403e-84f0-49b73fd81cbf'
)
ORDER BY name;
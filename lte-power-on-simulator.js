// LTE Power-On Test Simulator
// Simulates the complete LTE Power-On procedure with realistic message sequence

const { createClient } = require('@supabase/supabase-js');

class LTEPowerOnSimulator {
    constructor(supabaseUrl, supabaseKey) {
        this.supabase = createClient(supabaseUrl, supabaseKey);
        this.sessionId = null;
        this.testCaseId = null;
        this.ueProfile = null;
        this.cellConfig = null;
        this.messageSequence = [];
        this.currentStep = 0;
        this.startTime = null;
        this.metrics = {};
    }

    async initialize(testCaseId) {
        console.log(`🚀 Initializing LTE Power-On Simulator for test case: ${testCaseId}`);
        
        try {
            // Load test case from database
            const { data: testCase, error: testCaseError } = await this.supabase
                .from('test_cases')
                .select('*')
                .eq('id', testCaseId)
                .single();

            if (testCaseError) throw testCaseError;

            this.testCaseId = testCaseId;
            this.ueProfile = testCase.ue_profile_id;
            this.cellConfig = testCase.run_config.cell_config;
            this.messageSequence = this.generateMessageSequence();
            
            console.log(`✅ Test case loaded: ${testCase.name}`);
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize simulator:', error);
            return false;
        }
    }

    async startTest() {
        console.log('🔥 Starting LTE Power-On Test...');
        this.startTime = Date.now();
        
        try {
            // Create session
            const { data: session, error: sessionError } = await this.supabase
                .from('sessions')
                .insert({
                    test_case_id: this.testCaseId,
                    ue_profile_id: this.ueProfile,
                    session_state: 'INIT',
                    enb_id: `eNB_${this.cellConfig.pci}`,
                    metrics: {}
                })
                .select()
                .single();

            if (sessionError) throw sessionError;
            this.sessionId = session.id;
            
            console.log(`✅ Session created: ${this.sessionId}`);
            
            // Start message sequence
            await this.executeMessageSequence();
            
            return true;
        } catch (error) {
            console.error('❌ Failed to start test:', error);
            return false;
        }
    }

    generateMessageSequence() {
        return [
            {
                step: 1,
                eventType: 'CELL_SYNC',
                layer: 'PHY',
                delay: 0,
                description: 'UE powers on and performs cell search & sync',
                generateData: () => this.generateCellSyncData()
            },
            {
                step: 2,
                eventType: 'PRACH_ATTEMPT',
                layer: 'PHY',
                delay: 20,
                description: 'Random Access procedure initiation',
                generateData: () => this.generatePRACHData()
            },
            {
                step: 3,
                eventType: 'PRACH_SUCCESS',
                layer: 'PHY',
                delay: 40,
                description: 'Random Access successful',
                generateData: () => this.generatePRACHSuccessData()
            },
            {
                step: 4,
                eventType: 'RRC_CONN_REQUEST',
                layer: 'RRC',
                delay: 60,
                description: 'RRC Connection Request',
                generateData: () => this.generateRRCConnRequestData()
            },
            {
                step: 5,
                eventType: 'RRC_CONN_SETUP',
                layer: 'RRC',
                delay: 120,
                description: 'RRC Connection Setup from eNB',
                generateData: () => this.generateRRCConnSetupData()
            },
            {
                step: 6,
                eventType: 'RRC_CONN_SETUP_COMPLETE',
                layer: 'RRC',
                delay: 150,
                description: 'RRC Connection Setup Complete with NAS Attach Request',
                generateData: () => this.generateRRCConnSetupCompleteData()
            },
            {
                step: 7,
                eventType: 'S1AP_INITIAL_UE_MESSAGE',
                layer: 'S1AP',
                delay: 170,
                description: 'S1AP Initial UE Message from eNB to MME',
                generateData: () => this.generateS1APInitialUEMessageData()
            },
            {
                step: 8,
                eventType: 'NAS_ATTACH_REQUEST',
                layer: 'NAS',
                delay: 180,
                description: 'NAS Attach Request from UE to MME',
                generateData: () => this.generateNASAttachRequestData()
            },
            {
                step: 9,
                eventType: 'AUTH_REQUEST',
                layer: 'NAS',
                delay: 210,
                description: 'Authentication Request from MME to UE',
                generateData: () => this.generateAuthRequestData()
            },
            {
                step: 10,
                eventType: 'AUTH_RESPONSE',
                layer: 'NAS',
                delay: 250,
                description: 'Authentication Response from UE to MME',
                generateData: () => this.generateAuthResponseData()
            },
            {
                step: 11,
                eventType: 'SEC_MODE_COMMAND',
                layer: 'NAS',
                delay: 300,
                description: 'Security Mode Command from MME to UE',
                generateData: () => this.generateSecModeCommandData()
            },
            {
                step: 12,
                eventType: 'SEC_MODE_COMPLETE',
                layer: 'NAS',
                delay: 320,
                description: 'Security Mode Complete from UE to MME',
                generateData: () => this.generateSecModeCompleteData()
            },
            {
                step: 13,
                eventType: 'GTP_CREATE_SESSION_REQ',
                layer: 'GTP',
                delay: 400,
                description: 'GTP-C Create Session Request from MME to SGW/PGW',
                generateData: () => this.generateGTPCreateSessionReqData()
            },
            {
                step: 14,
                eventType: 'GTP_CREATE_SESSION_RESP',
                layer: 'GTP',
                delay: 420,
                description: 'GTP-C Create Session Response from SGW/PGW to MME',
                generateData: () => this.generateGTPCreateSessionRespData()
            },
            {
                step: 15,
                eventType: 'NAS_ATTACH_ACCEPT',
                layer: 'NAS',
                delay: 450,
                description: 'NAS Attach Accept from MME to UE',
                generateData: () => this.generateNASAttachAcceptData()
            },
            {
                step: 16,
                eventType: 'S1AP_INITIAL_CONTEXT_SETUP',
                layer: 'S1AP',
                delay: 470,
                description: 'S1AP Initial Context Setup from MME to eNB',
                generateData: () => this.generateS1APInitialContextSetupData()
            },
            {
                step: 17,
                eventType: 'E_RAB_SETUP_RESPONSE',
                layer: 'S1AP',
                delay: 490,
                description: 'E-RAB Setup Response from eNB to MME',
                generateData: () => this.generateERABSetupResponseData()
            },
            {
                step: 18,
                eventType: 'NAS_ATTACH_COMPLETE',
                layer: 'NAS',
                delay: 510,
                description: 'NAS Attach Complete from UE to MME',
                generateData: () => this.generateNASAttachCompleteData()
            },
            {
                step: 19,
                eventType: 'GTPU_DATA',
                layer: 'GTP',
                delay: 530,
                description: 'First GTP-U data packets (user plane active)',
                generateData: () => this.generateGTPUData()
            }
        ];
    }

    async executeMessageSequence() {
        console.log('📡 Executing message sequence...');
        
        for (const message of this.messageSequence) {
            await this.delay(message.delay);
            await this.processMessage(message);
        }
        
        // Update session state to ACTIVE
        await this.updateSessionState('ACTIVE');
        console.log('✅ LTE Power-On test completed successfully!');
    }

    async processMessage(message) {
        const eventData = message.generateData();
        const timestamp = new Date(this.startTime + message.delay);
        
        console.log(`📨 Step ${message.step}: ${message.eventType} - ${message.description}`);
        
        try {
            // Insert event into database
            const { error: eventError } = await this.supabase
                .from('events')
                .insert({
                    session_id: this.sessionId,
                    event_type: message.eventType,
                    event_ts: timestamp,
                    message_hex: eventData.messageHex,
                    ie_map: eventData.ieMap,
                    layer: message.layer,
                    severity: 'INFO',
                    meta: eventData.meta,
                    sfn: eventData.sfn,
                    subframe: eventData.subframe
                });

            if (eventError) throw eventError;

            // Update metrics
            this.updateMetrics(message.eventType, eventData);
            
            // Update session state based on message type
            if (message.eventType === 'RRC_CONN_SETUP_COMPLETE') {
                await this.updateSessionState('RRC_CONNECTED');
            } else if (message.eventType === 'NAS_ATTACH_ACCEPT') {
                await this.updateSessionState('ATTACHED');
            }

            // Evaluate assertions
            await this.evaluateAssertions(message, eventData);

        } catch (error) {
            console.error(`❌ Failed to process message ${message.eventType}:`, error);
        }
    }

    async updateSessionState(state) {
        const { error } = await this.supabase
            .from('sessions')
            .update({ 
                session_state: state,
                metrics: this.metrics,
                updated_at: new Date().toISOString()
            })
            .eq('id', this.sessionId);

        if (error) {
            console.error('❌ Failed to update session state:', error);
        } else {
            console.log(`✅ Session state updated to: ${state}`);
        }
    }

    updateMetrics(eventType, eventData) {
        const currentTime = Date.now();
        
        // Update layer-specific metrics
        if (eventData.ieMap.rsrp !== undefined) {
            this.metrics.rsrp = eventData.ieMap.rsrp;
        }
        if (eventData.ieMap.rsrq !== undefined) {
            this.metrics.rsrq = eventData.ieMap.rsrq;
        }
        if (eventData.ieMap.sinr !== undefined) {
            this.metrics.sinr = eventData.ieMap.sinr;
        }
        
        // Calculate timing metrics
        if (eventType === 'RRC_CONN_REQUEST') {
            this.metrics.rrcSetupStartTime = currentTime;
        } else if (eventType === 'RRC_CONN_SETUP_COMPLETE') {
            this.metrics.rrcSetupTime = currentTime - this.metrics.rrcSetupStartTime;
        }
        
        if (eventType === 'RRC_CONN_REQUEST') {
            this.metrics.attachStartTime = currentTime;
        } else if (eventType === 'NAS_ATTACH_ACCEPT') {
            this.metrics.attachTime = currentTime - this.metrics.attachStartTime;
        }
        
        // Update bearer information
        if (eventData.ieMap.epsBearerContext) {
            this.metrics.epsBearerId = eventData.ieMap.epsBearerContext.ebi;
            this.metrics.qci = eventData.ieMap.epsBearerContext.qci;
        }
    }

    async evaluateAssertions(message, eventData) {
        const assertions = this.getAssertionsForEvent(message.eventType);
        if (!assertions) return;

        for (const [key, assertion] of Object.entries(assertions)) {
            const actualValue = eventData.ieMap[key];
            const result = this.evaluateAssertion(actualValue, assertion);
            
            await this.recordTestResult(message.eventType, key, assertion, actualValue, result);
        }
    }

    getAssertionsForEvent(eventType) {
        const assertionMap = {
            'CELL_SYNC': { 'rsrp_dbm': { min: -110, max: -70 } },
            'PRACH_SUCCESS': { 'prach_success': true },
            'RRC_CONN_REQUEST': { 'establishment_cause': 'mo-signalling' },
            'NAS_ATTACH_REQUEST': { 'imsi_present': true, 'apn_requested': 'internet' },
            'NAS_ATTACH_ACCEPT': { 'qci': 9, 'eps_bearer_created': true },
            'GTPU_DATA': { 'user_plane_active': true }
        };
        
        return assertionMap[eventType];
    }

    evaluateAssertion(actualValue, assertion) {
        if (typeof assertion === 'boolean') {
            return actualValue === assertion;
        } else if (assertion.min !== undefined) {
            return actualValue >= assertion.min;
        } else if (assertion.max !== undefined) {
            return actualValue <= assertion.max;
        } else if (assertion.values) {
            return assertion.values.includes(actualValue);
        }
        return actualValue === assertion;
    }

    async recordTestResult(stepName, assertionKey, expected, actual, result) {
        const { error } = await this.supabase
            .from('test_results')
            .insert({
                session_id: this.sessionId,
                test_case_id: this.testCaseId,
                step_name: stepName,
                expected_value: expected,
                actual_value: actual,
                assertion_result: result ? 'PASS' : 'FAIL',
                assertion_message: `${assertionKey}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`
            });

        if (error) {
            console.error('❌ Failed to record test result:', error);
        }
    }

    // Data generation methods for each message type
    generateCellSyncData() {
        return {
            ieMap: {
                cell_id: this.cellConfig.pci.toString(),
                pci: this.cellConfig.pci,
                earfcn: this.cellConfig.earfcn,
                dl_bandwidth: this.cellConfig.bandwidth,
                rrc_state: 'IDLE',
                rsrp: -95 + Math.random() * 10,
                rsrq: -10 + Math.random() * 5,
                sinr: 15 + Math.random() * 10,
                timing_advance_estimate: 0,
                mib_sfn: 0,
                sib1_periodicity: 20
            },
            messageHex: '0x1234567890abcdef',
            meta: { cell_sync_success: true },
            sfn: 0,
            subframe: 0
        };
    }

    generatePRACHData() {
        return {
            ieMap: {
                raPreambleIndex: Math.floor(Math.random() * 64),
                ra_RNTI: 0,
                prachFormat: 0,
                preambleTxPower: 23,
                prachTimingOffset: 0,
                numAttempts: 1
            },
            messageHex: '0x2345678901bcdef0',
            meta: { prach_attempt: true },
            sfn: 1,
            subframe: 1
        };
    }

    generatePRACHSuccessData() {
        return {
            ieMap: {
                raPreambleIndex: Math.floor(Math.random() * 64),
                ra_RNTI: 0x1a2,
                response_window: 'SUCCESS',
                contentionResolutionID: '0x12345678',
                timing_advance: 10 + Math.floor(Math.random() * 20)
            },
            messageHex: '0x3456789012cdef01',
            meta: { prach_success: true },
            sfn: 2,
            subframe: 2
        };
    }

    generateRRCConnRequestData() {
        return {
            ieMap: {
                establishmentCause: 'mo-signalling',
                s_TMSI: '0x12345678',
                ue_Identity: 'random_12345',
                rntiCandidate: 0x5c
            },
            messageHex: '0x4567890123def012',
            meta: { rrc_conn_request: true },
            sfn: 3,
            subframe: 3
        };
    }

    generateRRCConnSetupData() {
        return {
            ieMap: {
                cfg_rlc: true,
                cfg_pdcp: true,
                initial_RRC_configuration: 'DEFAULT',
                selected_PLMN: '404-12',
                radioResourceConfigDedicated: 'SRB1_CONFIG',
                rntiAssigned: 0x5c
            },
            messageHex: '0x5678901234ef0123',
            meta: { rrc_conn_setup: true, c_rnti: 0x5c },
            sfn: 4,
            subframe: 4
        };
    }

    generateRRCConnSetupCompleteData() {
        return {
            ieMap: {
                ue_Capability: 'LTE_CAPABILITIES',
                nas_PDU: 'ATTACH_REQUEST',
                ue_Identity: 0x5c,
                selected_PLMN: '404-12'
            },
            messageHex: '0x6789012345f01234',
            meta: { rrc_conn_setup_complete: true, nas_encapsulated: true },
            sfn: 5,
            subframe: 5
        };
    }

    generateS1APInitialUEMessageData() {
        return {
            ieMap: {
                enb_ue_s1ap_id: 12345,
                mme_ue_s1ap_id: null,
                nas_pdu: 'ATTACH_REQUEST_HEX',
                ue_context_request: true,
                ue_security_capabilities: 'EEA0,EEA1,EIA0,EIA1'
            },
            messageHex: '0x7890123456012345',
            meta: { s1ap_initial_ue_message: true },
            sfn: 6,
            subframe: 6
        };
    }

    generateNASAttachRequestData() {
        return {
            ieMap: {
                messageType: 'Attach Request',
                epsAttachType: 'EPS_ATTACH',
                imsi: '404123456789012',
                imei: '359123456789012',
                ueNetworkCapability: {
                    EEA: ['EEA0', 'EEA1'],
                    EIA: ['EIA0', 'EIA1']
                },
                requestedAPN: 'internet',
                securityContextAvailable: false,
                oldGUTI: null,
                msisdn: null
            },
            messageHex: '0x8901234567123456',
            meta: { nas_attach_request: true, imsi: '404123456789012' },
            sfn: 7,
            subframe: 7
        };
    }

    generateAuthRequestData() {
        return {
            ieMap: {
                rand: '0x1234567890abcdef1234567890abcdef',
                autn: '0xabcdef1234567890abcdef1234567890',
                securityAlgorithm: 'EIA1',
                cipheringAlgorithm: 'EEA1'
            },
            messageHex: '0x9012345678234567',
            meta: { auth_request: true },
            sfn: 8,
            subframe: 8
        };
    }

    generateAuthResponseData() {
        return {
            ieMap: {
                res: '0x1234567890abcdef',
                xres: '0x1234567890abcdef',
                success: true,
                securityAlgorithm: 'EIA1'
            },
            messageHex: '0x0123456789345678',
            meta: { auth_response: true, auth_success: true },
            sfn: 9,
            subframe: 9
        };
    }

    generateSecModeCommandData() {
        return {
            ieMap: {
                selected_integ_algo: 'EIA1',
                selected_cipher_algo: 'EEA1',
                count: 0,
                nonce: '0x12345678'
            },
            messageHex: '0x1234567890456789',
            meta: { security_mode_command: true },
            sfn: 10,
            subframe: 10
        };
    }

    generateSecModeCompleteData() {
        return {
            ieMap: {
                selected_integ_algo: 'EIA1',
                selected_cipher_algo: 'EEA1',
                imeisv: '3591234567890123'
            },
            messageHex: '0x2345678901567890',
            meta: { security_mode_complete: true },
            sfn: 11,
            subframe: 11
        };
    }

    generateGTPCreateSessionReqData() {
        return {
            ieMap: {
                imsi: '404123456789012',
                msisdn: null,
                apn: 'internet',
                mme_s11_teid: 0x12345678,
                sgw_s11_teid: null,
                pdn_type: 'IPv4',
                bearer_ctx: {
                    ebi: 5,
                    qci: 9,
                    ambr: { ul: 1000000, dl: 1000000 },
                    gwAddress: '192.168.1.100'
                },
                pco: 'INTERNET_PROTOCOL_CONFIGURATION'
            },
            messageHex: '0x3456789012678901',
            meta: { gtp_create_session_req: true },
            sfn: 12,
            subframe: 12
        };
    }

    generateGTPCreateSessionRespData() {
        return {
            ieMap: {
                imsi: '404123456789012',
                mme_s11_teid: 0x12345678,
                sgw_s11_teid: 0x87654321,
                cause: 'REQUEST_ACCEPTED',
                bearer_ctx: {
                    ebi: 5,
                    qci: 9,
                    sgw_s1u_teid: 0x11111111,
                    pgw_s5s8_teid: 0x22222222,
                    pgw_address: '192.168.1.200'
                },
                pdn_address: '10.0.0.100'
            },
            messageHex: '0x4567890123789012',
            meta: { gtp_create_session_resp: true, session_created: true },
            sfn: 13,
            subframe: 13
        };
    }

    generateNASAttachAcceptData() {
        return {
            ieMap: {
                mmeAssignedGUTI: '404-12-1234567890',
                locationAreaIdentifier: '404-12-12345',
                tac: this.cellConfig.tac,
                epsBearerContext: {
                    ebi: 5,
                    qci: 9,
                    arp: 9,
                    gbr: 0,
                    mbr: 1000000
                },
                apnRestriction: 'NO_RESTRICTION',
                emm_cause: 'ATTACH_ACCEPT'
            },
            messageHex: '0x5678901234890123',
            meta: { nas_attach_accept: true, guti_assigned: true },
            sfn: 14,
            subframe: 14
        };
    }

    generateS1APInitialContextSetupData() {
        return {
            ieMap: {
                eNB_UE_S1AP_ID: 12345,
                MME_UE_S1AP_ID: 67890,
                e_rab_to_be_setup_list: {
                    e_rab_id: 5,
                    transportLayerAddress: '192.168.1.100',
                    gtp_teid: 0x11111111
                },
                ueAggregateMaximumBitRate: {
                    ul: 1000000,
                    dl: 1000000
                }
            },
            messageHex: '0x6789012345901234',
            meta: { s1ap_initial_context_setup: true },
            sfn: 15,
            subframe: 15
        };
    }

    generateERABSetupResponseData() {
        return {
            ieMap: {
                eNB_UE_S1AP_ID: 12345,
                MME_UE_S1AP_ID: 67890,
                e_rab_setup_list: {
                    e_rab_id: 5,
                    transportLayerAddress: '192.168.1.101',
                    gtp_teid: 0x33333333
                },
                cause: 'SUCCESS'
            },
            messageHex: '0x7890123456012345',
            meta: { e_rab_setup_response: true, bearer_configured: true },
            sfn: 16,
            subframe: 16
        };
    }

    generateNASAttachCompleteData() {
        return {
            ieMap: {
                attachCompleteIndicator: true,
                pco_info: 'INTERNET_PROTOCOL_CONFIGURATION',
                eps_bearer_status: 'ACTIVE'
            },
            messageHex: '0x8901234567123456',
            meta: { nas_attach_complete: true, attach_success: true },
            sfn: 17,
            subframe: 17
        };
    }

    generateGTPUData() {
        return {
            ieMap: {
                s1u_teid_dl: 0x11111111,
                s1u_teid_ul: 0x33333333,
                src_ip: '192.168.1.101',
                dst_ip: '192.168.1.100',
                src_port: 2152,
                dst_port: 2152,
                pdcp_pdu_count: 1,
                throughput_kbps: 10
            },
            messageHex: '0x9012345678234567',
            meta: { gtp_u_data: true, user_plane_active: true },
            sfn: 18,
            subframe: 18
        };
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async stopTest() {
        console.log('🛑 Stopping LTE Power-On test...');
        await this.updateSessionState('FAILED');
    }
}

module.exports = LTEPowerOnSimulator;
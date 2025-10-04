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
        // Generate PSS detection
        const pssSequence = Math.floor(Math.random() * 3);
        const pssCorrelationPeak = 0.8 + Math.random() * 0.2;
        
        // Generate SSS detection
        const sssSequence = Math.floor(Math.random() * 168);
        const sssCorrelationPeak = 0.8 + Math.random() * 0.2;
        
        // Calculate PCI from PSS and SSS
        const pciGroup = Math.floor(sssSequence / 3);
        const pciSector = pssSequence;
        const pci = pciGroup * 3 + pciSector;
        
        // Generate DMRS detection
        const dmrsSequenceId = pci;
        const dmrsCorrelationPeak = 0.7 + Math.random() * 0.3;
        
        // Generate MIB parameters
        const mibSfn = Math.floor(Math.random() * 1024);
        const dlBandwidth = this.cellConfig.bandwidth;
        const phichDuration = Math.random() > 0.5 ? 'NORMAL' : 'EXTENDED';
        const phichResource = Math.floor(Math.random() * 8);
        
        // Generate PCFICH
        const cfi = 1 + Math.floor(Math.random() * 3);
        
        // Generate PDCCH with realistic MIMO and MCS parameters
        const pdcchAggregationLevel = [1, 2, 4, 8][Math.floor(Math.random() * 4)];
        const pdcchDciFormat = ['1A', '1', '1B', '1C', '1D', '2', '2A', '2B', '2C'][Math.floor(Math.random() * 9)];
        const pdcchCceIndex = Math.floor(Math.random() * 16);
        
        // Generate realistic MIMO parameters
        const mimoLayers = Math.random() > 0.3 ? (Math.random() > 0.5 ? 2 : 1) : 1; // 70% single layer, 30% dual layer
        const mimoMode = mimoLayers === 1 ? 'SINGLE_LAYER' : 'DUAL_LAYER';
        const precodingMatrix = mimoLayers === 1 ? 0 : Math.floor(Math.random() * 4);
        const transmissionMode = mimoLayers === 1 ? 1 : (Math.random() > 0.5 ? 2 : 4);
        
        // Generate realistic MCS parameters
        const mcsIndex = Math.floor(Math.random() * 29); // 0-28
        const mcsTable = this.getMCSTable(mcsIndex);
        const modulation = mcsTable.modulation;
        const codeRate = mcsTable.codeRate;
        const spectralEfficiency = mcsTable.spectralEfficiency;
        
        // Generate CQI and link adaptation parameters
        const cqi = Math.floor(Math.random() * 16); // 0-15
        const cqiTable = this.getCQITable(cqi);
        const cqiModulation = cqiTable.modulation;
        const cqiCodeRate = cqiTable.codeRate;
        const cqiEfficiency = cqiTable.efficiency;
        
        // Generate resource allocation parameters
        const resourceBlockStart = Math.floor(Math.random() * 50);
        const resourceBlockLength = 1 + Math.floor(Math.random() * 20);
        const resourceBlockAllocation = this.generateResourceBlockAllocation(resourceBlockStart, resourceBlockLength);
        
        // Generate power control parameters
        const tpcCommand = Math.floor(Math.random() * 4); // 0-3
        const powerHeadroom = -10 + Math.random() * 20; // -10 to +10 dB
        const powerControlOffset = -6 + Math.random() * 12; // -6 to +6 dB
        
        // Generate HARQ parameters
        const harqProcessId = Math.floor(Math.random() * 8); // 0-7
        const harqRedundancyVersion = Math.floor(Math.random() * 4); // 0-3
        const harqNewDataIndicator = Math.random() > 0.5;
        
        // Generate timing parameters
        const timingAdvance = Math.floor(Math.random() * 1283); // 0-1282 Ts
        const timingAdvanceCommand = Math.floor(Math.random() * 11); // 0-10
        const subframeOffset = Math.floor(Math.random() * 10); // 0-9
        
        // Generate antenna parameters
        const antennaPorts = mimoLayers === 1 ? 1 : 2;
        const antennaSelection = Math.random() > 0.5 ? 'ANTENNA_SELECTION' : 'NO_ANTENNA_SELECTION';
        const beamforming = Math.random() > 0.7; // 30% chance of beamforming
        
        // Generate channel state information
        const channelRank = mimoLayers;
        const channelCondition = this.getChannelCondition(cqi);
        const interferenceLevel = -100 + Math.random() * 20; // -100 to -80 dBm
        const noiseLevel = -120 + Math.random() * 10; // -120 to -110 dBm
        
        // Generate SIB1 parameters
        const plmnList = [{
            mcc: this.cellConfig.mcc,
            mnc: this.cellConfig.mnc,
            reserved: 0
        }];
        const tac = this.cellConfig.tac;
        const cellIdentity = Math.floor(Math.random() * 268435456);
        const cellBarred = false;
        const intraFreqReselection = 'ALLOWED';
        const csRestrict = false;
        const qRxlevmin = -70 - Math.floor(Math.random() * 20);
        const pMax = 20 + Math.floor(Math.random() * 10);
        const freqBandIndicator = 3;
        
        // Generate SIB2 parameters
        const rachConfig = {
            preamble_info: {
                number_of_ra_preambles: 64,
                preambles_group_a_config: {
                    size_of_ra_preambles_group_a: 56,
                    message_size_group_a: 56,
                    message_power_offset_group_b: -1
                }
            },
            power_ramping_step: 0,
            preamble_initial_received_target_power: -120,
            preamble_max_transmissions: 10,
            ra_response_window_size: 10
        };
        
        const prachConfig = {
            root_sequence_index: 0,
            prach_config_info: {
                prach_config_index: 0,
                high_speed_flag: false,
                zero_correlation_zone_config: 0,
                prach_freq_offset: 0
            }
        };
        
        const puschConfig = {
            pusch_config_basic: {
                n_sb: 1,
                hopping_mode: 'INTRA_AND_INTER_SUBFRAME',
                pusch_hopping_offset: 0,
                enable_64_qam: false
            },
            ul_reference_signals_pusch: {
                group_hopping_enabled: false,
                group_assignment_pusch: 0,
                sequence_hopping_enabled: false,
                cyclic_shift: 0
            }
        };
        
        const pucchConfig = {
            delta_pucch_shift: 1,
            n_rb_cqi: 0,
            n_cs_an: 0,
            n1_pucch_an: 0
        };
        
        // Generate SIB3 parameters
        const reselectionConfig = {
            cell_reselection_info_common: {
                q_hyst: 0,
                speed_dependent_reselection_params: {
                    mobility_state_params: {
                        t_evaluation: 30,
                        t_hyst_normal: 0,
                        n_cell_change_medium: 1,
                        n_cell_change_high: 1
                    },
                    q_hyst_sf: {
                        sf_medium: 0,
                        sf_high: 0
                    }
                }
            },
            cell_reselection_serving_freq_info: {
                s_non_intra_search: 0,
                thresh_serving_low: 0,
                cell_reselection_priority: 0
            },
            intra_freq_cell_reselection_info: {
                q_rxlevmin: qRxlevmin,
                s_intra_search: 0,
                presence_antenna_port1: false,
                neighbour_cell_config: 0,
                t_reselection_eutra: 0
            }
        };
        
        return {
            ieMap: {
                // Basic cell info
                cell_id: pci.toString(),
                pci: pci,
                pci_group: pciGroup,
                pci_sector: pciSector,
                earfcn: this.cellConfig.earfcn,
                dl_bandwidth: dlBandwidth,
                rrc_state: 'IDLE',
                
                // Signal quality measurements
                rsrp: -95 + Math.random() * 10,
                rsrq: -10 + Math.random() * 5,
                sinr: 15 + Math.random() * 10,
                timing_advance_estimate: 0,
                
                // PSS detection
                pss_sequence: pssSequence,
                pss_correlation_peak: pssCorrelationPeak,
                pss_timing_offset: 0,
                pss_frequency_offset: 0,
                pss_snr: 15 + Math.random() * 5,
                
                // SSS detection
                sss_sequence: sssSequence,
                sss_correlation_peak: sssCorrelationPeak,
                sss_timing_offset: 0,
                sss_frequency_offset: 0,
                sss_snr: 14 + Math.random() * 5,
                
                // DMRS detection
                dmrs_sequence_id: dmrsSequenceId,
                dmrs_correlation_peak: dmrsCorrelationPeak,
                dmrs_timing_offset: 0,
                dmrs_frequency_offset: 0,
                dmrs_snr: 14 + Math.random() * 5,
                
                // MIB parameters
                mib_sfn: mibSfn,
                mib_dl_bandwidth: dlBandwidth,
                mib_phich_config: {
                    phich_duration: phichDuration,
                    phich_resource: phichResource
                },
                mib_system_frame_number: mibSfn,
                mib_crc_check: 'PASS',
                mib_decode_success: true,
                
                // PHICH parameters
                phich_duration: phichDuration,
                phich_resource: phichResource,
                phich_ng: 1,
                phich_ack_nack: 'NACK',
                phich_power: -8.5 + Math.random() * 2,
                
                // PCFICH parameters
                cfi: cfi,
                pcfich_crc_check: 'PASS',
                pcfich_decode_success: true,
                pcfich_snr: 13 + Math.random() * 3,
                
                // PDCCH parameters
                pdcch_aggregation_level: pdcchAggregationLevel,
                pdcch_dci_format: pdcchDciFormat,
                pdcch_cce_index: pdcchCceIndex,
                pdcch_crc_check: 'PASS',
                pdcch_decode_success: true,
                pdcch_snr: 12 + Math.random() * 3,
                
                // MIMO parameters
                mimo_layers: mimoLayers,
                mimo_mode: mimoMode,
                precoding_matrix: precodingMatrix,
                transmission_mode: transmissionMode,
                antenna_ports: antennaPorts,
                antenna_selection: antennaSelection,
                beamforming: beamforming,
                channel_rank: channelRank,
                
                // MCS parameters
                mcs_index: mcsIndex,
                mcs_modulation: modulation,
                mcs_code_rate: codeRate,
                mcs_spectral_efficiency: spectralEfficiency,
                
                // CQI parameters
                cqi: cqi,
                cqi_modulation: cqiModulation,
                cqi_code_rate: cqiCodeRate,
                cqi_efficiency: cqiEfficiency,
                
                // Resource allocation
                resource_block_start: resourceBlockStart,
                resource_block_length: resourceBlockLength,
                resource_block_allocation: resourceBlockAllocation,
                
                // Power control
                tpc_command: tpcCommand,
                power_headroom: powerHeadroom,
                power_control_offset: powerControlOffset,
                
                // HARQ parameters
                harq_process_id: harqProcessId,
                harq_redundancy_version: harqRedundancyVersion,
                harq_new_data_indicator: harqNewDataIndicator,
                
                // Timing parameters
                timing_advance: timingAdvance,
                timing_advance_command: timingAdvanceCommand,
                subframe_offset: subframeOffset,
                
                // Channel state information
                channel_condition: channelCondition,
                interference_level: interferenceLevel,
                noise_level: noiseLevel,
                
                // SIB1 parameters
                sib1_plmn_list: plmnList,
                sib1_tracking_area_code: tac,
                sib1_cell_identity: cellIdentity,
                sib1_cell_barred: cellBarred,
                sib1_intra_freq_reselection: intraFreqReselection,
                sib1_cs_restrict: csRestrict,
                sib1_q_rxlevmin: qRxlevmin,
                sib1_p_max: pMax,
                sib1_freq_band_indicator: freqBandIndicator,
                sib1_scheduling_info: [{
                    si_periodicity: 8,
                    si_mapping_info: 0
                }],
                sib1_tdd_config: null,
                sib1_si_window_length: 10,
                sib1_system_info_value_tag: 0,
                sib1_decode_success: true,
                
                // SIB2 parameters
                sib2_rach_config: rachConfig,
                sib2_prach_config: prachConfig,
                sib2_pusch_config: puschConfig,
                sib2_pucch_config: pucchConfig,
                sib2_decode_success: true,
                
                // SIB3 parameters
                sib3_reselection_config: reselectionConfig,
                sib3_decode_success: true,
                
                // Legacy parameters for compatibility
                mib_sfn: mibSfn,
                sib1_periodicity: 20
            },
            messageHex: '0x1234567890abcdef',
            meta: { 
                cell_sync_success: true,
                pss_detection_success: true,
                sss_detection_success: true,
                mib_decode_success: true,
                sib1_decode_success: true,
                sib2_decode_success: true,
                sib3_decode_success: true
            },
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

    // Helper methods for realistic parameter generation
    getMCSTable(mcsIndex) {
        const mcsTable = [
            { modulation: 'QPSK', codeRate: 0.12, spectralEfficiency: 0.15 },
            { modulation: 'QPSK', codeRate: 0.19, spectralEfficiency: 0.23 },
            { modulation: 'QPSK', codeRate: 0.30, spectralEfficiency: 0.38 },
            { modulation: 'QPSK', codeRate: 0.44, spectralEfficiency: 0.60 },
            { modulation: 'QPSK', codeRate: 0.59, spectralEfficiency: 0.88 },
            { modulation: 'QPSK', codeRate: 0.74, spectralEfficiency: 1.18 },
            { modulation: 'QPSK', codeRate: 0.85, spectralEfficiency: 1.33 },
            { modulation: 'QPSK', codeRate: 0.93, spectralEfficiency: 1.48 },
            { modulation: '16QAM', codeRate: 0.33, spectralEfficiency: 1.33 },
            { modulation: '16QAM', codeRate: 0.41, spectralEfficiency: 1.64 },
            { modulation: '16QAM', codeRate: 0.48, spectralEfficiency: 1.91 },
            { modulation: '16QAM', codeRate: 0.56, spectralEfficiency: 2.25 },
            { modulation: '16QAM', codeRate: 0.65, spectralEfficiency: 2.60 },
            { modulation: '16QAM', codeRate: 0.73, spectralEfficiency: 2.91 },
            { modulation: '16QAM', codeRate: 0.81, spectralEfficiency: 3.24 },
            { modulation: '16QAM', codeRate: 0.88, spectralEfficiency: 3.52 },
            { modulation: '64QAM', codeRate: 0.33, spectralEfficiency: 1.98 },
            { modulation: '64QAM', codeRate: 0.41, spectralEfficiency: 2.46 },
            { modulation: '64QAM', codeRate: 0.48, spectralEfficiency: 2.87 },
            { modulation: '64QAM', codeRate: 0.56, spectralEfficiency: 3.38 },
            { modulation: '64QAM', codeRate: 0.65, spectralEfficiency: 3.90 },
            { modulation: '64QAM', codeRate: 0.73, spectralEfficiency: 4.38 },
            { modulation: '64QAM', codeRate: 0.81, spectralEfficiency: 4.86 },
            { modulation: '64QAM', codeRate: 0.88, spectralEfficiency: 5.30 },
            { modulation: '64QAM', codeRate: 0.93, spectralEfficiency: 5.59 },
            { modulation: '64QAM', codeRate: 0.98, spectralEfficiency: 5.88 },
            { modulation: '64QAM', codeRate: 1.00, spectralEfficiency: 6.00 },
            { modulation: '64QAM', codeRate: 1.00, spectralEfficiency: 6.00 },
            { modulation: '64QAM', codeRate: 1.00, spectralEfficiency: 6.00 }
        ];
        return mcsTable[mcsIndex] || mcsTable[0];
    }

    getCQITable(cqi) {
        const cqiTable = [
            { modulation: 'OUT_OF_RANGE', codeRate: 0, efficiency: 0 },
            { modulation: 'QPSK', codeRate: 0.08, efficiency: 0.15 },
            { modulation: 'QPSK', codeRate: 0.12, efficiency: 0.23 },
            { modulation: 'QPSK', codeRate: 0.19, efficiency: 0.38 },
            { modulation: 'QPSK', codeRate: 0.30, efficiency: 0.60 },
            { modulation: 'QPSK', codeRate: 0.44, efficiency: 0.88 },
            { modulation: 'QPSK', codeRate: 0.59, efficiency: 1.18 },
            { modulation: 'QPSK', codeRate: 0.74, efficiency: 1.48 },
            { modulation: '16QAM', codeRate: 0.33, efficiency: 1.33 },
            { modulation: '16QAM', codeRate: 0.41, efficiency: 1.64 },
            { modulation: '16QAM', codeRate: 0.48, efficiency: 1.91 },
            { modulation: '16QAM', codeRate: 0.56, efficiency: 2.25 },
            { modulation: '16QAM', codeRate: 0.65, efficiency: 2.60 },
            { modulation: '16QAM', codeRate: 0.73, efficiency: 2.91 },
            { modulation: '16QAM', codeRate: 0.81, efficiency: 3.24 },
            { modulation: '64QAM', codeRate: 0.88, efficiency: 3.52 }
        ];
        return cqiTable[cqi] || cqiTable[0];
    }

    generateResourceBlockAllocation(start, length) {
        const allocation = [];
        for (let i = start; i < start + length; i++) {
            allocation.push({
                rb_index: i,
                allocated: true,
                power: -10 + Math.random() * 20, // -10 to +10 dBm
                interference: -100 + Math.random() * 20 // -100 to -80 dBm
            });
        }
        return allocation;
    }

    getChannelCondition(cqi) {
        if (cqi >= 13) return 'EXCELLENT';
        if (cqi >= 10) return 'GOOD';
        if (cqi >= 7) return 'FAIR';
        if (cqi >= 4) return 'POOR';
        return 'VERY_POOR';
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
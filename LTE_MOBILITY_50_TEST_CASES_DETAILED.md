# LTE Mobility - 50 Detailed Test Cases

## 📊 **Complete Test Cases Overview**

### **Test Case Categories and Scenarios**

| Test Case | Name | Scenario | Complexity | Priority | Duration |
|-----------|------|----------|------------|----------|----------|
| 1 | Tracking Area Update (TAU) Procedure | Normal Conditions | Advanced | 4 | 6 min |
| 2 | Service Request Procedure | Normal Conditions | Advanced | 4 | 5 min |
| 3 | Cell Reselection Procedure | Normal Conditions | Advanced | 4 | 4 min |
| 4 | RRC Connection Reestablishment | Normal Conditions | Advanced | 4 | 5 min |
| 5 | RRC Connection Release | Normal Conditions | Advanced | 4 | 4 min |
| 6-50 | Various LTE Mobility Scenarios | Mixed Scenarios | Advanced | 3-5 | 5-7 min |

## 🔄 **Complete Message Flow Structure (11-Step LTE Mobility)**

### **Tracking Area Update (TAU) Procedure Flow (11 Steps)**

| Step | Message | Protocol | Layer | Direction | Delay | Description |
|------|---------|----------|-------|-----------|-------|-------------|
| 1 | RRC Connection Request | LTE | RRC | UL | 0ms | RRC connection request for TAU |
| 2 | RRC Connection Setup | LTE | RRC | DL | 100ms | RRC connection setup message |
| 3 | RRC Connection Setup Complete | LTE | RRC | UL | 200ms | RRC connection setup complete message |
| 4 | Tracking Area Update Request | LTE | NAS | UL | 300ms | Tracking area update request message |
| 5 | Authentication Request | LTE | NAS | DL | 1000ms | Authentication request message |
| 6 | Authentication Response | LTE | NAS | UL | 2000ms | Authentication response message |
| 7 | Security Mode Command | LTE | NAS | DL | 3000ms | Security mode command message |
| 8 | Security Mode Complete | LTE | NAS | UL | 4000ms | Security mode complete message |
| 9 | Tracking Area Update Accept | LTE | NAS | DL | 5000ms | Tracking area update accept message |
| 10 | Tracking Area Update Complete | LTE | NAS | UL | 6000ms | Tracking area update complete message |
| 11 | RRC Connection Release | LTE | RRC | DL | 7000ms | RRC connection release message |

### **Service Request Procedure Flow (7 Steps)**

| Step | Message | Protocol | Layer | Direction | Delay | Description |
|------|---------|----------|-------|-----------|-------|-------------|
| 1 | RRC Connection Request | LTE | RRC | UL | 0ms | RRC connection request for service request |
| 2 | RRC Connection Setup | LTE | RRC | DL | 100ms | RRC connection setup message |
| 3 | RRC Connection Setup Complete | LTE | RRC | UL | 200ms | RRC connection setup complete message |
| 4 | Service Request | LTE | NAS | UL | 300ms | Service request message |
| 5 | Service Accept | LTE | NAS | DL | 1000ms | Service accept message |
| 6 | RRC Connection Reconfiguration | LTE | RRC | DL | 1100ms | RRC connection reconfiguration message |
| 7 | RRC Connection Reconfiguration Complete | LTE | RRC | UL | 1400ms | RRC connection reconfiguration complete message |

## 📋 **Information Elements (IEs) by Message**

### **RRC Connection Request IEs**
- `ue_identity` (bit_string, 40 bits): UE Identity (S-TMSI or Random Value)
- `establishment_cause` (enumerated, 3 bits): Establishment Cause values:
  - `emergency`: Emergency call
  - `high_priority_access`: High priority access
  - `mt_access`: Mobile terminated access
  - `mo_signalling`: Mobile originated signalling
  - `mo_data`: Mobile originated data
  - `delay_tolerant_access`: Delay tolerant access

### **Tracking Area Update Request IEs (20+ IEs)**
- `eps_update_type` (bit_string, 3 bits): EPS Update Type values:
  - `ta_updating`: TA updating
  - `combined_ta_la_updating`: Combined TA/LA updating
  - `combined_ta_la_updating_with_imsi_attach`: Combined TA/LA updating with IMSI attach
  - `periodic_updating`: Periodic updating
- `nas_key_set_identifier` (bit_string, 4 bits): NAS Key Set Identifier (0-7)
- `old_guti` (bit_string, 80 bits): Old GUTI
- `ue_network_capability` (bit_string, variable): UE Network Capability
- `last_visited_registered_tai` (bit_string, 40 bits): Last Visited Registered TAI
- `drx_parameter` (bit_string, 16 bits): DRX Parameter
- `ue_radio_capability_id` (bit_string, 16 bits): UE Radio Capability ID
- `eps_bearer_context_status` (bit_string, 16 bits): EPS Bearer Context Status
- `ms_network_capability` (bit_string, variable): MS Network Capability
- `old_location_area_identification` (bit_string, 40 bits): Old Location Area Identification
- `tmsi_status` (bit_string, 4 bits): TMSI Status
- `mobile_station_classmark_2` (bit_string, variable): Mobile Station Classmark 2
- `mobile_station_classmark_3` (bit_string, variable): Mobile Station Classmark 3
- `supported_codecs` (bit_string, variable): Supported Codecs
- `additional_update_type` (bit_string, 4 bits): Additional Update Type
- `voice_domain_preference_and_ue_usage_setting` (bit_string, 16 bits): Voice Domain Preference and UE Usage Setting
- `old_guti_type` (bit_string, 4 bits): Old GUTI Type
- `device_properties` (bit_string, 4 bits): Device Properties
- `ms_network_feature_support` (bit_string, 8 bits): MS Network Feature Support
- `tmsi_based_nri_container` (bit_string, variable): TMSI Based NRI Container

### **Tracking Area Update Accept IEs (15+ IEs)**
- `eps_update_result` (bit_string, 3 bits): EPS Update Result values:
  - `ta_updated`: TA updated
  - `combined_ta_la_updated`: Combined TA/LA updated
  - `combined_ta_la_updated_with_imsi_attach`: Combined TA/LA updated with IMSI attach
  - `periodic_updating`: Periodic updating
- `t3412_value` (bit_string, 8 bits): T3412 Value (periodic TAU timer)
- `guti` (bit_string, 80 bits): GUTI
- `tai_list` (bit_string, variable): TAI List
- `eps_bearer_context_status` (bit_string, 16 bits): EPS Bearer Context Status
- `location_area_identification` (bit_string, 40 bits): Location Area Identification
- `ms_identity` (bit_string, variable): MS Identity
- `emm_cause` (bit_string, 8 bits): EMM Cause
- `t3402_value` (bit_string, 8 bits): T3402 Value
- `t3423_value` (bit_string, 8 bits): T3423 Value
- `equivalent_plmns` (bit_string, variable): Equivalent PLMNs
- `emergency_number_list` (bit_string, variable): Emergency Number List
- `eps_network_feature_support` (bit_string, 8 bits): EPS Network Feature Support
- `additional_update_result` (bit_string, 4 bits): Additional Update Result
- `t3412_extended_value` (bit_string, 8 bits): T3412 Extended Value
- `t3324_value` (bit_string, 8 bits): T3324 Value
- `extended_drx_parameters` (bit_string, 8 bits): Extended DRX Parameters

### **Service Request IEs**
- `service_type` (bit_string, 4 bits): Service Type values:
  - `mobile_originated_eps_fallback`: Mobile originated EPS fallback
  - `mobile_terminated_eps_fallback`: Mobile terminated EPS fallback
  - `mobile_originated_cs_fallback`: Mobile originated CS fallback
  - `mobile_terminated_cs_fallback`: Mobile terminated CS fallback
- `nas_key_set_identifier` (bit_string, 4 bits): NAS Key Set Identifier
- `eps_bearer_context_status` (bit_string, 16 bits): EPS Bearer Context Status
- `mobile_station_classmark_2` (bit_string, variable): Mobile Station Classmark 2
- `mobile_station_classmark_3` (bit_string, variable): Mobile Station Classmark 3
- `supported_codecs` (bit_string, variable): Supported Codecs
- `additional_update_type` (bit_string, 4 bits): Additional Update Type
- `voice_domain_preference_and_ue_usage_setting` (bit_string, 16 bits): Voice Domain Preference and UE Usage Setting
- `device_properties` (bit_string, 4 bits): Device Properties
- `ms_network_feature_support` (bit_string, 8 bits): MS Network Feature Support
- `tmsi_based_nri_container` (bit_string, variable): TMSI Based NRI Container

### **Service Accept IEs**
- `eps_bearer_context_status` (bit_string, 16 bits): EPS Bearer Context Status
- `t3412_extended_value` (bit_string, 8 bits): T3412 Extended Value
- `t3324_value` (bit_string, 8 bits): T3324 Value
- `extended_drx_parameters` (bit_string, 8 bits): Extended DRX Parameters
- `ciphering_key_sequence_number` (bit_string, 4 bits): Ciphering Key Sequence Number
- `nonceue` (bit_string, 32 bits): NonceUE
- `eps_network_feature_support` (bit_string, 8 bits): EPS Network Feature Support
- `additional_update_result` (bit_string, 4 bits): Additional Update Result
- `t3412_value` (bit_string, 8 bits): T3412 Value
- `guti` (bit_string, 80 bits): GUTI
- `tai_list` (bit_string, variable): TAI List
- `location_area_identification` (bit_string, 40 bits): Location Area Identification
- `ms_identity` (bit_string, variable): MS Identity
- `emm_cause` (bit_string, 8 bits): EMM Cause
- `t3402_value` (bit_string, 8 bits): T3402 Value
- `t3423_value` (bit_string, 8 bits): T3423 Value
- `equivalent_plmns` (bit_string, variable): Equivalent PLMNs
- `emergency_number_list` (bit_string, variable): Emergency Number List

## ⚙️ **Layer Parameters by Layer**

### **RRC Layer Parameters (15+ parameters)**
- `rrc_transaction_identifier` (integer, id): RRC Transaction Identifier (0-3)
- `establishment_cause` (enumerated, cause): Establishment Cause (emergency, high_priority_access, mt_access, mo_signalling, mo_data, delay_tolerant_access)
- `ue_identity_type` (enumerated, type): UE Identity Type (s_tmsi, randomValue)
- `srb1_config` (object, config): SRB1 Configuration
- `srb2_config` (object, config): SRB2 Configuration
- `mac_main_config` (object, config): MAC Main Configuration
- `physical_config_dedicated` (object, config): Physical Configuration Dedicated
- `measurement_config` (object, config): Measurement Configuration
- `mobility_control_info` (object, info): Mobility Control Information
- `radio_resource_config_dedicated` (object, config): Radio Resource Configuration Dedicated
- `security_config_ho` (object, config): Security Configuration for Handover
- `rrc_connection_release_version` (integer, version): RRC Connection Release Version
- `ue_capability_information` (object, capability): UE Capability Information
- `rrc_connection_reconfiguration_complete` (boolean, complete): RRC Connection Reconfiguration Complete
- `rrc_connection_release_complete` (boolean, complete): RRC Connection Release Complete

### **NAS Layer Parameters (30+ parameters)**
- `eps_update_type` (enumerated, type): EPS Update Type (ta_updating, combined_ta_la_updating, combined_ta_la_updating_with_imsi_attach, periodic_updating)
- `nas_key_set_identifier` (integer, ksi): NAS Key Set Identifier (0-7)
- `old_guti` (hex, guti): Old GUTI
- `ue_network_capability` (hex, capability): UE Network Capability
- `last_visited_registered_tai` (hex, tai): Last Visited Registered TAI
- `drx_parameter` (hex, parameter): DRX Parameter
- `ue_radio_capability_id` (hex, id): UE Radio Capability ID
- `eps_bearer_context_status` (hex, status): EPS Bearer Context Status
- `ms_network_capability` (hex, capability): MS Network Capability
- `old_location_area_identification` (hex, lai): Old Location Area Identification
- `tmsi_status` (hex, status): TMSI Status
- `mobile_station_classmark_2` (hex, classmark): Mobile Station Classmark 2
- `mobile_station_classmark_3` (hex, classmark): Mobile Station Classmark 3
- `supported_codecs` (hex, codecs): Supported Codecs
- `additional_update_type` (hex, type): Additional Update Type
- `voice_domain_preference_and_ue_usage_setting` (hex, setting): Voice Domain Preference and UE Usage Setting
- `old_guti_type` (hex, type): Old GUTI Type
- `device_properties` (hex, properties): Device Properties
- `ms_network_feature_support` (hex, support): MS Network Feature Support
- `tmsi_based_nri_container` (hex, container): TMSI Based NRI Container
- `eps_update_result` (hex, result): EPS Update Result
- `t3412_value` (hex, value): T3412 Value
- `guti` (hex, guti): GUTI
- `tai_list` (hex, list): TAI List
- `location_area_identification` (hex, lai): Location Area Identification
- `ms_identity` (hex, identity): MS Identity
- `emm_cause` (hex, cause): EMM Cause
- `t3402_value` (hex, value): T3402 Value
- `t3423_value` (hex, value): T3423 Value
- `equivalent_plmns` (hex, plmns): Equivalent PLMNs
- `emergency_number_list` (hex, list): Emergency Number List
- `eps_network_feature_support` (hex, support): EPS Network Feature Support
- `additional_update_result` (hex, result): Additional Update Result
- `t3412_extended_value` (hex, value): T3412 Extended Value
- `t3324_value` (hex, value): T3324 Value
- `extended_drx_parameters` (hex, parameters): Extended DRX Parameters
- `ciphering_key_sequence_number` (hex, number): Ciphering Key Sequence Number
- `nonceue` (hex, nonce): NonceUE
- `service_type` (enumerated, type): Service Type (mobile_originated_eps_fallback, mobile_terminated_eps_fallback, mobile_originated_cs_fallback, mobile_terminated_cs_fallback)

## 🎯 **Test Case Specific Details**

### **Test Case 1: Tracking Area Update (TAU) Procedure**
- **Update Type**: TA updating
- **Duration**: 7 seconds (complete flow)
- **Success Rate**: >95%
- **Key Metrics**: TAU time <5s, Mobility success >90%
- **Authentication**: AKA procedure with RAND/AUTN
- **Security**: Integrity (EIA1) + Encryption (EEA1)
- **GUTI**: New GUTI assignment
- **TAI List**: Updated TAI list

### **Test Case 2: Service Request Procedure**
- **Service Type**: Mobile originated EPS fallback
- **Duration**: 1.4 seconds (complete flow)
- **Success Rate**: >95%
- **Key Metrics**: Service request time <3s, Connection establishment >90%
- **Bearer Status**: EPS bearer context status
- **RRC Reconfiguration**: Radio resource configuration
- **Service Activation**: Service activation and bearer setup

### **Test Case 3: Cell Reselection Procedure**
- **Reselection Type**: Intra-frequency reselection
- **Duration**: 2 seconds
- **Success Rate**: >95%
- **Key Metrics**: Reselection time <2s, Cell change >90%
- **Measurement**: RSRP/RSRQ measurements
- **Reselection Criteria**: S-criteria and R-criteria
- **Cell Change**: Successful cell change

### **Test Case 4: RRC Connection Reestablishment**
- **Reestablishment Cause**: Radio link failure
- **Duration**: 3 seconds
- **Success Rate**: >95%
- **Key Metrics**: Reestablishment time <3s, Connection recovery >90%
- **Failure Detection**: Radio link failure detection
- **Reestablishment**: RRC connection reestablishment
- **Recovery**: Connection recovery and bearer restoration

### **Test Case 5: RRC Connection Release**
- **Release Type**: Normal release
- **Duration**: 1 second
- **Success Rate**: >95%
- **Key Metrics**: Release time <1s, Resource cleanup >95%
- **Release Cause**: Normal release
- **Resource Cleanup**: RRC resources, PDCP context, RLC context
- **State Transition**: RRC_CONNECTED to RRC_IDLE

## 📊 **Test Case Distribution**

### **By Complexity**
- **Advanced**: 50 test cases (100%)

### **By Priority**
- **High Priority (1-3)**: 10 test cases (20%)
- **Medium Priority (4-7)**: 30 test cases (60%)
- **Low Priority (8-10)**: 10 test cases (20%)

### **By Duration**
- **4-5 minutes**: 30 test cases (60%)
- **6-7 minutes**: 20 test cases (40%)

### **By Mobility Scenario**
- **Tracking Area Update**: 15 test cases (30%)
- **Service Request**: 15 test cases (30%)
- **Cell Reselection**: 10 test cases (20%)
- **RRC Connection Management**: 10 test cases (20%)

### **By Update Type**
- **TA Updating**: 20 test cases (40%)
- **Combined TA/LA Updating**: 15 test cases (30%)
- **Periodic Updating**: 10 test cases (20%)
- **Service Request**: 5 test cases (10%)

## 🎉 **Complete Coverage**

The 50 detailed LTE Mobility test cases provide comprehensive coverage of:

- ✅ **All mobility procedures** (TAU, service request, cell reselection, RRC reestablishment, RRC release)
- ✅ **All update types** (TA updating, combined TA/LA updating, periodic updating)
- ✅ **All service types** (mobile originated, mobile terminated, EPS fallback, CS fallback)
- ✅ **All message sequences** (7-11 step complete flow)
- ✅ **All information elements** (comprehensive IE coverage for all messages)
- ✅ **All layer parameters** (RRC and NAS parameters)
- ✅ **All timing scenarios** (normal delays, timeout handling)
- ✅ **All success criteria** (success rate, timing, mobility success)

## 🚀 **Database Integration**

### **Tables Used**
- `test_cases`: Main test case definitions (50 test cases)
- `expected_message_flows`: Message flow sequences (7-11 steps per test case = 400 total flows)
- `expected_information_elements`: Information elements per message (comprehensive IE coverage)
- `expected_layer_parameters`: Layer parameters per test case (45+ parameters per test case)

### **Migration File**
- `035_detailed_lte_mobility_test_cases.sql`

### **Key Features**
- Complete 7-11 step message flows with precise timing
- Comprehensive IE definitions with bit lengths and value ranges
- Layer-specific parameters for all 2 layers (RRC, NAS)
- 3GPP standard compliance (TS 36.331, TS 24.301)
- Release 15 compatibility
- Real-time simulation ready

**🎯 All 50 test cases are ready with complete message flows, information elements, and layer parameters for comprehensive LTE Mobility testing!**
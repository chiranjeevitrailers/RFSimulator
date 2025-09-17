// Generate All 1000 Test Cases for Professional Testing Platform
// This script generates comprehensive test cases for Supabase database

class TestCaseGenerator {
  constructor() {
    this.testCases = [];
    this.testMessages = [];
    this.informationElements = [];
    this.layerParameters = [];
  }

  // Generate all test cases
  generateAllTestCases() {
    console.log('🚀 Starting generation of 1000 test cases...');
    
    // 5G NR Test Cases (400 test cases - 40%)
    this.generateComplete5GNRTestCases();
    
    // NSA Test Cases (120 test cases - 12%)
    this.generateNSATestCases();
    
    // VoLTE & VoNR Test Cases (160 test cases - 16%)
    this.generateVoLTEVoNRTestCases();
    
    // LTE Test Cases (300 test cases - 30%)
    this.generateLTETestCases();
    
    // IMS/SIP Test Cases (60 test cases - 6%)
    this.generateIMSTestCases();
    
    // Conference Call Test Cases (45 test cases - 4.5%)
    this.generateConferenceTestCases();
    
    // Enhanced IMS Registration Test Cases (35 test cases - 3.5%)
    this.generateEnhancedIMSTestCases();
    
    // O-RAN Test Cases (30 test cases - 3%)
    this.generateORANTestCases();
    
    // V2X Test Cases (20 test cases - 2%)
    this.generateV2XTestCases();
    
    // NTN Test Cases (20 test cases - 2%)
    this.generateNTNTestCases();
    
    // NB-IoT Test Cases (20 test cases - 2%)
    this.generateNBIoTTestCases();
    
    console.log(`✅ Generated ${this.testCases.length} test cases`);
    return {
      testCases: this.testCases,
      testMessages: this.testMessages,
      informationElements: this.informationElements,
      layerParameters: this.layerParameters
    };
  }

  // 5G NR Test Cases (400 test cases)
  generateComplete5GNRTestCases() {
    const categories = [
      { name: 'Initial_Access', count: 50, description: '5G NR Initial Access procedures' },
      { name: 'Handover', count: 50, description: '5G NR Handover procedures' },
      { name: 'PDU_Session', count: 50, description: '5G NR PDU Session management' },
      { name: 'Mobility', count: 50, description: '5G NR Mobility procedures' },
      { name: 'Security', count: 50, description: '5G NR Security procedures' },
      { name: 'Measurement', count: 50, description: '5G NR Measurement procedures' },
      { name: 'Power_Control', count: 50, description: '5G NR Power Control procedures' },
      { name: 'Scheduling', count: 50, description: '5G NR Scheduling procedures' }
    ];

    categories.forEach(category => {
      for (let i = 1; i <= category.count; i++) {
        this.generateTestCase({
          testCaseId: `TC_5G_NR_${category.name}_${i.toString().padStart(3, '0')}`,
          name: `5G NR ${category.name.replace('_', ' ')} - ${i}`,
          description: `${category.description} - Test Case ${i}`,
          category: '5G_NR',
          protocol: '5G_NR',
          subcategory: category.name,
          testNumber: i,
          complexity: this.getComplexity(i),
          priority: this.getPriority(i),
          duration: this.getDuration('5G_NR', category.name),
          messages: this.get5GNRMessages(category.name, i),
          layerParameters: this.get5GNRLayerParameters(category.name)
        });
      }
    });
  }

  // LTE Test Cases (300 test cases)
  generateLTETestCases() {
    const categories = [
      { name: 'Initial_Access', count: 50, description: 'LTE Initial Access procedures' },
      { name: 'Handover', count: 50, description: 'LTE Handover procedures' },
      { name: 'Bearer_Management', count: 50, description: 'LTE Bearer Management procedures' },
      { name: 'Mobility', count: 50, description: 'LTE Mobility procedures' },
      { name: 'Security', count: 50, description: 'LTE Security procedures' },
      { name: 'Measurement', count: 50, description: 'LTE Measurement procedures' }
    ];

    categories.forEach(category => {
      for (let i = 1; i <= category.count; i++) {
        this.generateTestCase({
          testCaseId: `TC_LTE_${category.name}_${i.toString().padStart(3, '0')}`,
          name: `LTE ${category.name.replace('_', ' ')} - ${i}`,
          description: `${category.description} - Test Case ${i}`,
          category: '4G_LTE',
          protocol: 'LTE',
          subcategory: category.name,
          testNumber: i,
          complexity: this.getComplexity(i),
          priority: this.getPriority(i),
          duration: this.getDuration('LTE', category.name),
          messages: this.getLTEMessages(category.name, i),
          layerParameters: this.getLTELayerParameters(category.name)
        });
      }
    });
  }

  // VoLTE & VoNR Test Cases (160 test cases)
  generateVoLTEVoNRTestCases() {
    const categories = [
      { name: 'Call_Setup', count: 40, description: 'VoLTE/VoNR Call Setup procedures' },
      { name: 'Call_Release', count: 30, description: 'VoLTE/VoNR Call Release procedures' },
      { name: 'Call_Handover', count: 50, description: 'VoLTE/VoNR Call Handover procedures' },
      { name: 'Emergency_Call', count: 20, description: 'VoLTE/VoNR Emergency Call procedures' }
    ];

    categories.forEach(category => {
      for (let i = 1; i <= category.count; i++) {
        this.generateTestCase({
          testCaseId: `TC_VoLTE_VoNR_${category.name}_${i.toString().padStart(3, '0')}`,
          name: `VoLTE/VoNR ${category.name.replace('_', ' ')} - ${i}`,
          description: `${category.description} - Test Case ${i}`,
          category: 'VoLTE_VoNR',
          protocol: 'IMS_SIP',
          subcategory: category.name,
          testNumber: i,
          complexity: 'advanced',
          priority: category.name === 'Emergency_Call' ? 'critical' : 'high',
          duration: this.getDuration('VoLTE_VoNR', category.name),
          messages: this.getVoLTEVoNRMessages(category.name, i),
          layerParameters: this.getVoLTEVoNRLayerParameters()
        });
      }
    });
  }

  // IMS/SIP Test Cases (60 test cases)
  generateIMSTestCases() {
    const categories = [
      { name: 'Registration', count: 20, description: 'IMS Registration procedures' },
      { name: 'Call_Setup', count: 15, description: 'IMS Call Setup procedures' },
      { name: 'Call_Release', count: 10, description: 'IMS Call Release procedures' },
      { name: 'Supplementary_Services', count: 10, description: 'IMS Supplementary Services' },
      { name: 'Emergency_Services', count: 5, description: 'IMS Emergency Services' }
    ];

    categories.forEach(category => {
      for (let i = 1; i <= category.count; i++) {
        this.generateTestCase({
          testCaseId: `TC_IMS_${category.name}_${i.toString().padStart(3, '0')}`,
          name: `IMS ${category.name.replace('_', ' ')} - ${i}`,
          description: `${category.description} - Test Case ${i}`,
          category: 'IMS',
          protocol: 'IMS_SIP',
          subcategory: category.name,
          testNumber: i,
          complexity: 'advanced',
          priority: category.name === 'Emergency_Services' ? 'critical' : 'high',
          duration: this.getDuration('IMS', category.name),
          messages: this.getIMSMessages(category.name, i),
          layerParameters: this.getIMSLayerParameters()
        });
      }
    });
  }

  // Conference Call Test Cases (45 test cases)
  generateConferenceTestCases() {
    const categories = [
      { name: 'Conference_Setup', count: 15, description: 'IMS Conference Setup procedures' },
      { name: 'Conference_Management', count: 20, description: 'IMS Conference Management procedures' },
      { name: 'Conference_Release', count: 10, description: 'IMS Conference Release procedures' }
    ];

    categories.forEach(category => {
      for (let i = 1; i <= category.count; i++) {
        this.generateTestCase({
          testCaseId: `TC_CONF_${category.name}_${i.toString().padStart(3, '0')}`,
          name: `Conference ${category.name.replace('_', ' ')} - ${i}`,
          description: `${category.description} - Test Case ${i}`,
          category: 'Conference_Call',
          protocol: 'IMS_SIP',
          subcategory: category.name,
          testNumber: i,
          complexity: 'expert',
          priority: 'medium',
          duration: this.getDuration('Conference', category.name),
          messages: this.getConferenceMessages(category.name, i),
          layerParameters: this.getConferenceLayerParameters()
        });
      }
    });
  }

  // Enhanced IMS Registration Test Cases (35 test cases)
  generateEnhancedIMSTestCases() {
    const categories = [
      { name: 'Initial_Registration', count: 20, description: 'IMS Initial Registration procedures' },
      { name: 'Re_registration', count: 10, description: 'IMS Re-registration procedures' },
      { name: 'De_registration', count: 3, description: 'IMS De-registration procedures' },
      { name: 'Emergency_Registration', count: 2, description: 'IMS Emergency Registration procedures' }
    ];

    categories.forEach(category => {
      for (let i = 1; i <= category.count; i++) {
        this.generateTestCase({
          testCaseId: `TC_IMS_ENH_${category.name}_${i.toString().padStart(3, '0')}`,
          name: `Enhanced IMS ${category.name.replace('_', ' ')} - ${i}`,
          description: `${category.description} - Test Case ${i}`,
          category: 'Enhanced_IMS_Registration',
          protocol: 'IMS_SIP',
          subcategory: category.name,
          testNumber: i,
          complexity: 'expert',
          priority: category.name === 'Emergency_Registration' ? 'critical' : 'high',
          duration: this.getDuration('Enhanced_IMS', category.name),
          messages: this.getEnhancedIMSMessages(category.name, i),
          layerParameters: this.getEnhancedIMSLayerParameters()
        });
      }
    });
  }

  // O-RAN Test Cases (30 test cases)
  generateORANTestCases() {
    const categories = [
      { name: 'E2_Interface', count: 15, description: 'O-RAN E2 Interface procedures' },
      { name: 'A1_Interface', count: 10, description: 'O-RAN A1 Interface procedures' },
      { name: 'O1_Interface', count: 5, description: 'O-RAN O1 Interface procedures' }
    ];

    categories.forEach(category => {
      for (let i = 1; i <= category.count; i++) {
        this.generateTestCase({
          testCaseId: `TC_ORAN_${category.name}_${i.toString().padStart(3, '0')}`,
          name: `O-RAN ${category.name.replace('_', ' ')} - ${i}`,
          description: `${category.description} - Test Case ${i}`,
          category: 'O_RAN',
          protocol: 'O_RAN',
          subcategory: category.name,
          testNumber: i,
          complexity: 'expert',
          priority: 'high',
          duration: this.getDuration('O_RAN', category.name),
          messages: this.getORANMessages(category.name, i),
          layerParameters: this.getORANLayerParameters(category.name)
        });
      }
    });
  }

  // V2X Test Cases (20 test cases)
  generateV2XTestCases() {
    const categories = [
      { name: 'PC5_Interface', count: 15, description: 'V2X PC5 Interface procedures' },
      { name: 'Uu_Interface', count: 5, description: 'V2X Uu Interface procedures' }
    ];

    categories.forEach(category => {
      for (let i = 1; i <= category.count; i++) {
        this.generateTestCase({
          testCaseId: `TC_V2X_${category.name}_${i.toString().padStart(3, '0')}`,
          name: `V2X ${category.name.replace('_', ' ')} - ${i}`,
          description: `${category.description} - Test Case ${i}`,
          category: 'V2X',
          protocol: 'V2X',
          subcategory: category.name,
          testNumber: i,
          complexity: 'expert',
          priority: 'high',
          duration: this.getDuration('V2X', category.name),
          messages: this.getV2XMessages(category.name, i),
          layerParameters: this.getV2XLayerParameters(category.name)
        });
      }
    });
  }

  // NTN Test Cases (20 test cases)
  generateNTNTestCases() {
    const categories = [
      { name: 'Initial_Access', count: 15, description: 'NTN Initial Access procedures' },
      { name: 'Handover', count: 5, description: 'NTN Handover procedures' }
    ];

    categories.forEach(category => {
      for (let i = 1; i <= category.count; i++) {
        this.generateTestCase({
          testCaseId: `TC_NTN_${category.name}_${i.toString().padStart(3, '0')}`,
          name: `NTN ${category.name.replace('_', ' ')} - ${i}`,
          description: `${category.description} - Test Case ${i}`,
          category: 'NTN',
          protocol: 'NTN',
          subcategory: category.name,
          testNumber: i,
          complexity: 'expert',
          priority: 'high',
          duration: this.getDuration('NTN', category.name),
          messages: this.getNTNMessages(category.name, i),
          layerParameters: this.getNTNLayerParameters(category.name)
        });
      }
    });
  }

  // NB-IoT Test Cases (20 test cases)
  generateNBIoTTestCases() {
    const categories = [
      { name: 'Initial_Access', count: 15, description: 'NB-IoT Initial Access procedures' },
      { name: 'Data_Transmission', count: 5, description: 'NB-IoT Data Transmission procedures' }
    ];

    categories.forEach(category => {
      for (let i = 1; i <= category.count; i++) {
        this.generateTestCase({
          testCaseId: `TC_NBIOT_${category.name}_${i.toString().padStart(3, '0')}`,
          name: `NB-IoT ${category.name.replace('_', ' ')} - ${i}`,
          description: `${category.description} - Test Case ${i}`,
          category: 'NB_IoT',
          protocol: 'NB_IoT',
          subcategory: category.name,
          testNumber: i,
          complexity: 'advanced',
          priority: 'medium',
          duration: this.getDuration('NB_IoT', category.name),
          messages: this.getNBIoTMessages(category.name, i),
          layerParameters: this.getNBIoTLayerParameters(category.name)
        });
      }
    });
  }

  // NSA Test Cases (120 test cases)
  generateNSATestCases() {
    const categories = [
      { name: 'EN_DC', count: 50, description: 'EN-DC (E-UTRAN-NR Dual Connectivity) procedures' },
      { name: 'NE_DC', count: 30, description: 'NE-DC (NR-E-UTRAN Dual Connectivity) procedures' },
      { name: 'Multiple_Split_Bearer', count: 40, description: 'Multiple Split Bearer procedures' }
    ];

    categories.forEach(category => {
      for (let i = 1; i <= category.count; i++) {
        this.generateTestCase({
          testCaseId: `TC_NSA_${category.name}_${i.toString().padStart(3, '0')}`,
          name: `NSA ${category.name.replace('_', ' ')} - ${i}`,
          description: `${category.description} - Test Case ${i}`,
          category: 'NSA',
          protocol: 'NSA',
          subcategory: category.name,
          testNumber: i,
          complexity: 'expert',
          priority: 'high',
          duration: this.getDuration('NSA', category.name),
          messages: this.getNSAMessages(category.name, i),
          layerParameters: this.getNSALayerParameters(category.name)
        });
      }
    });
  }

  // Helper methods
  generateTestCase(testCaseData) {
    const testCase = {
      test_case_id: testCaseData.testCaseId,
      name: testCaseData.name,
      description: testCaseData.description,
      category: testCaseData.category,
      protocol: testCaseData.protocol,
      test_type: 'functional',
      complexity: testCaseData.complexity,
      duration_seconds: testCaseData.duration,
      priority: testCaseData.priority,
      tags: this.generateTags(testCaseData.category, testCaseData.subcategory),
      expected_result: 'successful_execution',
      prerequisites: this.getPrerequisites(testCaseData.category, testCaseData.subcategory),
      test_steps: this.generateTestSteps(testCaseData.messages),
      subcategory: testCaseData.subcategory,
      test_number: testCaseData.testNumber,
      protocol_version: this.getProtocolVersion(testCaseData.protocol),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.testCases.push(testCase);

    // Generate messages for this test case
    if (testCaseData.messages) {
      testCaseData.messages.forEach((message, index) => {
        this.generateTestMessage(testCase.test_case_id, message, index + 1);
      });
    }

    // Generate layer parameters for this test case
    if (testCaseData.layerParameters) {
      testCaseData.layerParameters.forEach(param => {
        this.generateLayerParameter(testCase.test_case_id, param);
      });
    }
  }

  generateTestMessage(testCaseId, messageData, sequenceOrder) {
    const message = {
      test_case_id: testCaseId,
      message_id: `${testCaseId}_MSG_${sequenceOrder.toString().padStart(3, '0')}`,
      message_name: messageData.messageName,
      protocol: messageData.protocol || '5G_NR',
      layer: messageData.layer,
      direction: messageData.direction,
      message_type: messageData.messageType || messageData.messageName.toUpperCase().replace(/\s+/g, '_'),
      sequence_order: sequenceOrder,
      timestamp_offset_ms: messageData.timestampOffset || (sequenceOrder - 1) * 100,
      message_payload: messageData.payload || {},
      expected_response: messageData.expectedResponse,
      timeout_ms: messageData.timeout || 5000,
      validation_rules: messageData.validationRules || {},
      created_at: new Date().toISOString()
    };

    this.testMessages.push(message);

    // Generate information elements for this message
    if (messageData.informationElements) {
      messageData.informationElements.forEach(ie => {
        this.generateInformationElement(message.message_id, ie);
      });
    }
  }

  generateInformationElement(messageId, ieData) {
    const ie = {
      message_id: messageId,
      ie_id: ieData.ieId,
      ie_name: ieData.ieName,
      ie_type: ieData.ieType || 'MANDATORY',
      data_type: ieData.dataType || 'STRING',
      ie_value: ieData.ieValue || this.getDefaultIEValue(ieData.dataType),
      ie_description: ieData.ieDescription || `${ieData.ieName} information element`,
      validation_rules: ieData.validationRules || {},
      dependencies: ieData.dependencies || {},
      created_at: new Date().toISOString()
    };

    this.informationElements.push(ie);
  }

  generateLayerParameter(testCaseId, paramData) {
    const param = {
      test_case_id: testCaseId,
      layer: paramData.layer,
      parameter_name: paramData.parameterName,
      parameter_type: paramData.parameterType || 'CONFIG',
      parameter_value: paramData.parameterValue || this.getDefaultParameterValue(paramData.parameterName),
      parameter_unit: paramData.parameterUnit || this.getParameterUnit(paramData.parameterName),
      min_value: paramData.minValue,
      max_value: paramData.maxValue,
      default_value: paramData.defaultValue || paramData.parameterValue,
      description: paramData.description || `${paramData.parameterName} parameter for ${paramData.layer} layer`,
      created_at: new Date().toISOString()
    };

    this.layerParameters.push(param);
  }

  // Utility methods
  getComplexity(testNumber) {
    if (testNumber <= 10) return 'beginner';
    if (testNumber <= 30) return 'intermediate';
    if (testNumber <= 45) return 'advanced';
    return 'expert';
  }

  getPriority(testNumber) {
    if (testNumber <= 5) return 'critical';
    if (testNumber <= 15) return 'high';
    if (testNumber <= 35) return 'medium';
    return 'low';
  }

  getDuration(protocol, category) {
    const baseDuration = {
      '5G_NR': 120,
      'LTE': 150,
      'VoLTE_VoNR': 180,
      'IMS': 90,
      'Conference': 300,
      'Enhanced_IMS': 120,
      'O_RAN': 240,
      'V2X': 180,
      'NTN': 300,
      'NB_IoT': 60,
      'NSA': 200
    };
    
    return baseDuration[protocol] || 120;
  }

  generateTags(category, subcategory) {
    const baseTags = [category];
    if (subcategory) baseTags.push(subcategory);
    
    const protocolTags = {
      '5G_NR': ['5G', 'NR', '3GPP'],
      '4G_LTE': ['LTE', '4G', '3GPP'],
      'VoLTE_VoNR': ['VoLTE', 'VoNR', 'Voice', 'IMS'],
      'IMS': ['IMS', 'SIP', 'Voice'],
      'Conference_Call': ['Conference', 'IMS', 'SIP'],
      'Enhanced_IMS_Registration': ['IMS', 'Registration', 'SIP'],
      'O_RAN': ['O-RAN', 'OpenRAN', '5G'],
      'V2X': ['V2X', 'Vehicle', '5G'],
      'NTN': ['NTN', 'Satellite', '5G'],
      'NB_IoT': ['NB-IoT', 'IoT', 'LTE'],
      'NSA': ['NSA', 'Dual_Connectivity', '5G']
    };
    
    return [...baseTags, ...(protocolTags[category] || [])];
  }

  getPrerequisites(category, subcategory) {
    const prerequisites = {
      '5G_NR': '5G NR network configuration and UE capabilities',
      '4G_LTE': 'LTE network configuration and UE capabilities',
      'VoLTE_VoNR': 'IMS network configuration and VoLTE/VoNR capabilities',
      'IMS': 'IMS network configuration and SIP capabilities',
      'Conference_Call': 'IMS network and conference server configuration',
      'Enhanced_IMS_Registration': 'IMS network and enhanced registration features',
      'O_RAN': 'O-RAN network configuration and interfaces',
      'V2X': 'V2X network configuration and vehicle capabilities',
      'NTN': 'NTN network configuration and satellite capabilities',
      'NB_IoT': 'NB-IoT network configuration and IoT device capabilities',
      'NSA': 'NSA network configuration and dual connectivity capabilities'
    };
    
    return prerequisites[category] || 'Standard network configuration';
  }

  generateTestSteps(messages) {
    if (!messages) return [];
    
    return messages.map((message, index) => ({
      step: index + 1,
      description: `Execute ${message.messageName} message`,
      layer: message.layer,
      direction: message.direction,
      duration_ms: 100,
      expected_result: 'Message sent successfully'
    }));
  }

  getProtocolVersion(protocol) {
    const versions = {
      '5G_NR': '16.0.0',
      'LTE': '14.0.0',
      'IMS_SIP': '2.0',
      'O_RAN': '1.0',
      'V2X': '1.0',
      'NTN': '1.0',
      'NB_IoT': '1.0',
      'NSA': '1.0'
    };
    
    return versions[protocol] || '1.0.0';
  }

  getDefaultIEValue(dataType) {
    const defaults = {
      'INTEGER': 1,
      'STRING': 'default_value',
      'BOOLEAN': true,
      'ENUM': 'default_option',
      'BITSTRING': '00000000',
      'OCTETSTRING': '00'
    };
    
    return defaults[dataType] || 'default_value';
  }

  getDefaultParameterValue(parameterName) {
    const defaults = {
      'RSRP': -85,
      'RSRQ': -10,
      'SINR': 15,
      'RA_Preamble': 1,
      'RRC_Transaction_ID': 1
    };
    
    return defaults[parameterName] || 'default_value';
  }

  getParameterUnit(parameterName) {
    const units = {
      'RSRP': 'dBm',
      'RSRQ': 'dB',
      'SINR': 'dB',
      'RA_Preamble': 'index',
      'RRC_Transaction_ID': 'index',
      'Duration': 'ms',
      'Frequency': 'Hz',
      'Power': 'dBm'
    };
    
    return units[parameterName] || '';
  }

  // Message generation methods for different protocols
  get5GNRMessages(category, testNumber) {
    return this.getGenericMessages('5G_NR', category, testNumber);
  }

  getLTEMessages(category, testNumber) {
    return this.getGenericMessages('LTE', category, testNumber);
  }

  getVoLTEVoNRMessages(category, testNumber) {
    return this.getGenericMessages('IMS_SIP', category, testNumber);
  }

  getIMSMessages(category, testNumber) {
    return this.getGenericMessages('IMS_SIP', category, testNumber);
  }

  getConferenceMessages(category, testNumber) {
    return this.getGenericMessages('IMS_SIP', category, testNumber);
  }

  getEnhancedIMSMessages(category, testNumber) {
    return this.getGenericMessages('IMS_SIP', category, testNumber);
  }

  getORANMessages(category, testNumber) {
    return this.getGenericMessages('O_RAN', category, testNumber);
  }

  getV2XMessages(category, testNumber) {
    return this.getGenericMessages('V2X', category, testNumber);
  }

  getNTNMessages(category, testNumber) {
    return this.getGenericMessages('NTN', category, testNumber);
  }

  getNBIoTMessages(category, testNumber) {
    return this.getGenericMessages('NB_IoT', category, testNumber);
  }

  getNSAMessages(category, testNumber) {
    return this.getGenericMessages('NSA', category, testNumber);
  }

  getGenericMessages(protocol, category, testNumber) {
    const messageCount = Math.min(5 + (testNumber % 10), 15);
    const messages = [];
    
    for (let i = 0; i < messageCount; i++) {
      messages.push({
        messageName: `${protocol} Message ${i + 1}`,
        protocol: protocol,
        layer: this.getRandomLayer(protocol),
        direction: i % 2 === 0 ? 'UL' : 'DL',
        messageType: `${protocol}_MESSAGE_${i + 1}`,
        timestampOffset: i * 100,
        informationElements: this.getGenericIEs(protocol, i)
      });
    }
    
    return messages;
  }

  getRandomLayer(protocol) {
    const layers = {
      '5G_NR': ['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS'],
      'LTE': ['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS'],
      'IMS_SIP': ['IMS', 'SIP'],
      'O_RAN': ['E2', 'A1', 'O1'],
      'V2X': ['PHY', 'MAC', 'RLC', 'RRC', 'PC5'],
      'NTN': ['PHY', 'MAC', 'RLC', 'RRC', 'NAS'],
      'NB_IoT': ['PHY', 'MAC', 'RLC', 'RRC', 'NAS'],
      'NSA': ['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS']
    };
    
    const protocolLayers = layers[protocol] || ['PHY', 'MAC', 'RLC', 'RRC'];
    return protocolLayers[Math.floor(Math.random() * protocolLayers.length)];
  }

  getGenericIEs(protocol, messageIndex) {
    const ieCount = 2 + (messageIndex % 5);
    const ies = [];
    
    for (let i = 0; i < ieCount; i++) {
      ies.push({
        ieId: `ie_${messageIndex}_${i}`,
        ieName: `Information Element ${i + 1}`,
        ieType: i === 0 ? 'MANDATORY' : 'OPTIONAL',
        dataType: ['INTEGER', 'STRING', 'ENUM', 'BOOLEAN'][i % 4]
      });
    }
    
    return ies;
  }

  // Layer parameter generation methods
  get5GNRLayerParameters(category) {
    return [
      { layer: 'PHY', parameterName: 'RSRP', parameterType: 'MEASUREMENT' },
      { layer: 'PHY', parameterName: 'RSRQ', parameterType: 'MEASUREMENT' },
      { layer: 'MAC', parameterName: 'RA_Preamble', parameterType: 'CONFIG' },
      { layer: 'RRC', parameterName: 'RRC_Transaction_ID', parameterType: 'CONFIG' }
    ];
  }

  getLTELayerParameters(category) {
    return [
      { layer: 'PHY', parameterName: 'RSRP', parameterType: 'MEASUREMENT' },
      { layer: 'PHY', parameterName: 'RSRQ', parameterType: 'MEASUREMENT' },
      { layer: 'MAC', parameterName: 'RA_Preamble', parameterType: 'CONFIG' },
      { layer: 'RRC', parameterName: 'RRC_Transaction_ID', parameterType: 'CONFIG' }
    ];
  }

  getVoLTEVoNRLayerParameters() {
    return [
      { layer: 'IMS', parameterName: 'Call_ID', parameterType: 'CONFIG' },
      { layer: 'IMS', parameterName: 'SIP_Version', parameterType: 'CONFIG' }
    ];
  }

  getIMSLayerParameters() {
    return [
      { layer: 'IMS', parameterName: 'Call_ID', parameterType: 'CONFIG' },
      { layer: 'IMS', parameterName: 'SIP_Version', parameterType: 'CONFIG' }
    ];
  }

  getConferenceLayerParameters() {
    return [
      { layer: 'IMS', parameterName: 'Conference_ID', parameterType: 'CONFIG' },
      { layer: 'IMS', parameterName: 'Participant_Count', parameterType: 'MEASUREMENT' }
    ];
  }

  getEnhancedIMSLayerParameters() {
    return [
      { layer: 'IMS', parameterName: 'Registration_ID', parameterType: 'CONFIG' },
      { layer: 'IMS', parameterName: 'Expires', parameterType: 'CONFIG' }
    ];
  }

  getORANLayerParameters(category) {
    return [
      { layer: category, parameterName: 'Interface_ID', parameterType: 'CONFIG' },
      { layer: category, parameterName: 'Message_Type', parameterType: 'CONFIG' }
    ];
  }

  getV2XLayerParameters(category) {
    return [
      { layer: category, parameterName: 'Vehicle_ID', parameterType: 'CONFIG' },
      { layer: category, parameterName: 'Message_Priority', parameterType: 'CONFIG' }
    ];
  }

  getNTNLayerParameters(category) {
    return [
      { layer: 'PHY', parameterName: 'Doppler_Shift', parameterType: 'MEASUREMENT' },
      { layer: 'PHY', parameterName: 'Propagation_Delay', parameterType: 'MEASUREMENT' }
    ];
  }

  getNBIoTLayerParameters(category) {
    return [
      { layer: 'PHY', parameterName: 'RSRP', parameterType: 'MEASUREMENT' },
      { layer: 'MAC', parameterName: 'NPRACH_Preamble', parameterType: 'CONFIG' }
    ];
  }

  getNSALayerParameters(category) {
    return [
      { layer: 'PHY', parameterName: 'LTE_RSRP', parameterType: 'MEASUREMENT' },
      { layer: 'PHY', parameterName: 'NR_RSRP', parameterType: 'MEASUREMENT' },
      { layer: 'RRC', parameterName: 'Dual_Connectivity_Config', parameterType: 'CONFIG' }
    ];
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TestCaseGenerator;
} else if (typeof window !== 'undefined') {
  window.TestCaseGenerator = TestCaseGenerator;
}

// Usage example
if (typeof window !== 'undefined') {
  console.log('Test Case Generator loaded. Use: const generator = new TestCaseGenerator(); const data = generator.generateAllTestCases();');
}
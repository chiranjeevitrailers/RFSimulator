// Insert VoLTE & VoNR Test Cases to Database
// This script inserts all 160 VoLTE & VoNR test cases with detailed 3GPP message flows

class VoLTEVoNRDatabaseInserter {
  constructor() {
    this.supabaseUrl = 'https://your-project.supabase.co';
    this.supabaseKey = 'your-anon-key';
    this.supabase = null;
    this.insertedCount = 0;
    this.errorCount = 0;
    this.batchSize = 20;
  }

  // Initialize Supabase connection
  async initializeSupabase() {
    try {
      if (typeof window.supabase === 'undefined') {
        await this.loadSupabaseLibrary();
      }
      
      this.supabase = window.supabase.createClient(this.supabaseUrl, this.supabaseKey);
      console.log('✅ Supabase connected successfully');
      return true;
    } catch (error) {
      console.error('❌ Supabase connection failed:', error);
      return false;
    }
  }

  // Load Supabase library dynamically
  async loadSupabaseLibrary() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      script.onload = () => {
        window.supabase = window.supabase || window.supabase;
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Insert all VoLTE & VoNR test cases
  async insertAllVoLTEVoNRTestCases() {
    console.log('🚀 Starting insertion of VoLTE & VoNR test cases...');
    
    if (!await this.initializeSupabase()) {
      console.error('❌ Cannot proceed without Supabase connection');
      return;
    }

    try {
      // Generate all VoLTE & VoNR test cases
      const generator = new window.VoLTEVoNRTestCaseGenerator();
      const allTestData = generator.generateAllVoLTEVoNRTestCases();
      
      console.log(`📊 Generated ${allTestData.testCases.length} VoLTE & VoNR test cases`);
      
      // Separate VoLTE and VoNR test cases
      const volteTestCases = allTestData.testCases.filter(tc => tc.category === 'VoLTE');
      const vonrTestCases = allTestData.testCases.filter(tc => tc.category === 'VoNR');
      
      console.log(`📊 VoLTE test cases: ${volteTestCases.length}`);
      console.log(`📊 VoNR test cases: ${vonrTestCases.length}`);
      
      // Insert VoLTE test cases
      await this.insertVoLTETestCases(volteTestCases);
      
      // Insert VoNR test cases
      await this.insertVoNRTestCases(vonrTestCases);
      
      // Insert SIP messages
      await this.insertSIPMessages(allTestData.testMessages);
      
      // Insert RTP messages
      await this.insertRTPMessages(allTestData.testMessages);
      
      // Insert information elements
      await this.insertInformationElements(allTestData.informationElements);
      
      // Insert layer parameters
      await this.insertLayerParameters(allTestData.layerParameters);
      
      console.log(`✅ Insertion completed: ${this.insertedCount} records inserted, ${this.errorCount} errors`);
      
    } catch (error) {
      console.error('❌ Error during VoLTE/VoNR test case insertion:', error);
    }
  }

  // Insert VoLTE test cases
  async insertVoLTETestCases(volteTestCases) {
    console.log('📡 Inserting VoLTE test cases...');
    
    for (let i = 0; i < volteTestCases.length; i += this.batchSize) {
      const batch = volteTestCases.slice(i, i + this.batchSize);
      
      try {
        const { data, error } = await this.supabase
          .from('volte_test_cases')
          .insert(batch.map(tc => this.formatVoLTETestCaseForInsert(tc)));
        
        if (error) {
          console.error(`❌ Error inserting VoLTE test cases batch ${i}-${i + batch.length}:`, error);
          this.errorCount += batch.length;
        } else {
          console.log(`✅ Inserted VoLTE test cases batch ${i}-${i + batch.length}`);
          this.insertedCount += batch.length;
        }
        
        await this.delay(100);
        
      } catch (error) {
        console.error(`❌ Exception inserting VoLTE test cases batch ${i}-${i + batch.length}:`, error);
        this.errorCount += batch.length;
      }
    }
  }

  // Insert VoNR test cases
  async insertVoNRTestCases(vonrTestCases) {
    console.log('📡 Inserting VoNR test cases...');
    
    for (let i = 0; i < vonrTestCases.length; i += this.batchSize) {
      const batch = vonrTestCases.slice(i, i + this.batchSize);
      
      try {
        const { data, error } = await this.supabase
          .from('vonr_test_cases')
          .insert(batch.map(tc => this.formatVoNRTestCaseForInsert(tc)));
        
        if (error) {
          console.error(`❌ Error inserting VoNR test cases batch ${i}-${i + batch.length}:`, error);
          this.errorCount += batch.length;
        } else {
          console.log(`✅ Inserted VoNR test cases batch ${i}-${i + batch.length}`);
          this.insertedCount += batch.length;
        }
        
        await this.delay(100);
        
      } catch (error) {
        console.error(`❌ Exception inserting VoNR test cases batch ${i}-${i + batch.length}:`, error);
        this.errorCount += batch.length;
      }
    }
  }

  // Insert SIP messages
  async insertSIPMessages(testMessages) {
    console.log('📡 Inserting SIP messages...');
    
    const sipMessages = testMessages.filter(msg => 
      msg.layer === 'SIP' || msg.messageName.includes('SIP') || 
      ['INVITE', 'ACK', 'BYE', '200 OK', '180 Ringing'].includes(msg.messageName)
    );
    
    for (let i = 0; i < sipMessages.length; i += this.batchSize) {
      const batch = sipMessages.slice(i, i + this.batchSize);
      
      try {
        const { data, error } = await this.supabase
          .from('sip_messages')
          .insert(batch.map(msg => this.formatSIPMessageForInsert(msg)));
        
        if (error) {
          console.error(`❌ Error inserting SIP messages batch ${i}-${i + batch.length}:`, error);
          this.errorCount += batch.length;
        } else {
          console.log(`✅ Inserted SIP messages batch ${i}-${i + batch.length}`);
          this.insertedCount += batch.length;
        }
        
        await this.delay(100);
        
      } catch (error) {
        console.error(`❌ Exception inserting SIP messages batch ${i}-${i + batch.length}:`, error);
        this.errorCount += batch.length;
      }
    }
  }

  // Insert RTP messages
  async insertRTPMessages(testMessages) {
    console.log('📡 Inserting RTP messages...');
    
    const rtpMessages = testMessages.filter(msg => 
      msg.layer === 'RTP' || msg.messageName.includes('RTP') || 
      msg.messageName.includes('RTCP')
    );
    
    for (let i = 0; i < rtpMessages.length; i += this.batchSize) {
      const batch = rtpMessages.slice(i, i + this.batchSize);
      
      try {
        const { data, error } = await this.supabase
          .from('rtp_messages')
          .insert(batch.map(msg => this.formatRTPMessageForInsert(msg)));
        
        if (error) {
          console.error(`❌ Error inserting RTP messages batch ${i}-${i + batch.length}:`, error);
          this.errorCount += batch.length;
        } else {
          console.log(`✅ Inserted RTP messages batch ${i}-${i + batch.length}`);
          this.insertedCount += batch.length;
        }
        
        await this.delay(100);
        
      } catch (error) {
        console.error(`❌ Exception inserting RTP messages batch ${i}-${i + batch.length}:`, error);
        this.errorCount += batch.length;
      }
    }
  }

  // Insert information elements
  async insertInformationElements(informationElements) {
    console.log('📡 Inserting information elements...');
    
    for (let i = 0; i < informationElements.length; i += this.batchSize) {
      const batch = informationElements.slice(i, i + this.batchSize);
      
      try {
        const { data, error } = await this.supabase
          .from('sip_information_elements')
          .insert(batch.map(ie => this.formatInformationElementForInsert(ie)));
        
        if (error) {
          console.error(`❌ Error inserting information elements batch ${i}-${i + batch.length}:`, error);
          this.errorCount += batch.length;
        } else {
          console.log(`✅ Inserted information elements batch ${i}-${i + batch.length}`);
          this.insertedCount += batch.length;
        }
        
        await this.delay(100);
        
      } catch (error) {
        console.error(`❌ Exception inserting information elements batch ${i}-${i + batch.length}:`, error);
        this.errorCount += batch.length;
      }
    }
  }

  // Insert layer parameters
  async insertLayerParameters(layerParameters) {
    console.log('📡 Inserting layer parameters...');
    
    // Separate VoLTE and VoNR layer parameters
    const volteLayerParams = layerParameters.filter(lp => 
      lp.testCaseId && lp.testCaseId.includes('VoLTE')
    );
    const vonrLayerParams = layerParameters.filter(lp => 
      lp.testCaseId && lp.testCaseId.includes('VoNR')
    );
    
    // Insert VoLTE layer parameters
    if (volteLayerParams.length > 0) {
      await this.insertVoLTELayerParameters(volteLayerParams);
    }
    
    // Insert VoNR layer parameters
    if (vonrLayerParams.length > 0) {
      await this.insertVoNRLayerParameters(vonrLayerParams);
    }
  }

  // Insert VoLTE layer parameters
  async insertVoLTELayerParameters(layerParameters) {
    console.log('📡 Inserting VoLTE layer parameters...');
    
    for (let i = 0; i < layerParameters.length; i += this.batchSize) {
      const batch = layerParameters.slice(i, i + this.batchSize);
      
      try {
        const { data, error } = await this.supabase
          .from('volte_layer_parameters')
          .insert(batch.map(lp => this.formatVoLTELayerParameterForInsert(lp)));
        
        if (error) {
          console.error(`❌ Error inserting VoLTE layer parameters batch ${i}-${i + batch.length}:`, error);
          this.errorCount += batch.length;
        } else {
          console.log(`✅ Inserted VoLTE layer parameters batch ${i}-${i + batch.length}`);
          this.insertedCount += batch.length;
        }
        
        await this.delay(100);
        
      } catch (error) {
        console.error(`❌ Exception inserting VoLTE layer parameters batch ${i}-${i + batch.length}:`, error);
        this.errorCount += batch.length;
      }
    }
  }

  // Insert VoNR layer parameters
  async insertVoNRLayerParameters(layerParameters) {
    console.log('📡 Inserting VoNR layer parameters...');
    
    for (let i = 0; i < layerParameters.length; i += this.batchSize) {
      const batch = layerParameters.slice(i, i + this.batchSize);
      
      try {
        const { data, error } = await this.supabase
          .from('vonr_layer_parameters')
          .insert(batch.map(lp => this.formatVoNRLayerParameterForInsert(lp)));
        
        if (error) {
          console.error(`❌ Error inserting VoNR layer parameters batch ${i}-${i + batch.length}:`, error);
          this.errorCount += batch.length;
        } else {
          console.log(`✅ Inserted VoNR layer parameters batch ${i}-${i + batch.length}`);
          this.insertedCount += batch.length;
        }
        
        await this.delay(100);
        
      } catch (error) {
        console.error(`❌ Exception inserting VoNR layer parameters batch ${i}-${i + batch.length}:`, error);
        this.errorCount += batch.length;
      }
    }
  }

  // Format VoLTE test case for database insertion
  formatVoLTETestCaseForInsert(testCase) {
    return {
      test_case_id: testCase.id,
      name: testCase.name,
      description: testCase.description,
      category: testCase.subcategory || 'CallSetup',
      subcategory: testCase.subcategory,
      test_type: testCase.testType,
      complexity: testCase.complexity || 'intermediate',
      priority: testCase.priority || 'high',
      estimated_duration: testCase.estimatedDuration || 120,
      preconditions: testCase.preconditions,
      test_steps: testCase.testSteps,
      expected_signaling_flow: testCase.expectedSignalingFlow,
      expected_ies: testCase.expectedIEs,
      layer_parameters: testCase.layerParameters,
      expected_result: testCase.expectedResult,
      three_gpp_ref: testCase.threeGPPRef,
      tags: testCase.tags || []
    };
  }

  // Format VoNR test case for database insertion
  formatVoNRTestCaseForInsert(testCase) {
    return {
      test_case_id: testCase.id,
      name: testCase.name,
      description: testCase.description,
      category: testCase.subcategory || 'CallSetup',
      subcategory: testCase.subcategory,
      test_type: testCase.testType,
      complexity: testCase.complexity || 'advanced',
      priority: testCase.priority || 'high',
      estimated_duration: testCase.estimatedDuration || 150,
      preconditions: testCase.preconditions,
      test_steps: testCase.testSteps,
      expected_signaling_flow: testCase.expectedSignalingFlow,
      expected_ies: testCase.expectedIEs,
      layer_parameters: testCase.layerParameters,
      expected_result: testCase.expectedResult,
      three_gpp_ref: testCase.threeGPPRef,
      tags: testCase.tags || []
    };
  }

  // Format SIP message for database insertion
  formatSIPMessageForInsert(testMessage) {
    return {
      test_case_id: testMessage.testCaseId,
      message_id: testMessage.id,
      message_name: testMessage.messageName,
      message_type: this.mapSIPMessageType(testMessage.messageName),
      direction: this.mapSIPDirection(testMessage.direction),
      sequence_number: testMessage.sequenceNumber,
      timestamp_offset_ms: testMessage.timestampOffset || 0,
      message_payload: testMessage.messagePayload || null,
      expected_response: testMessage.expectedResponse || null,
      timeout_ms: testMessage.timeout || 5000,
      validation_rules: testMessage.validationRules || null
    };
  }

  // Format RTP message for database insertion
  formatRTPMessageForInsert(testMessage) {
    return {
      test_case_id: testMessage.testCaseId,
      message_id: testMessage.id,
      message_name: testMessage.messageName,
      message_type: this.mapRTPMessageType(testMessage.messageName),
      direction: this.mapRTPDirection(testMessage.direction),
      sequence_number: testMessage.sequenceNumber,
      timestamp_offset_ms: testMessage.timestampOffset || 0,
      payload_type: this.extractPayloadType(testMessage),
      ssrc: this.extractSSRC(testMessage),
      codec: this.extractCodec(testMessage),
      bitrate: this.extractBitrate(testMessage),
      packet_size: this.extractPacketSize(testMessage),
      validation_rules: testMessage.validationRules || null
    };
  }

  // Format information element for database insertion
  formatInformationElementForInsert(informationElement) {
    return {
      test_case_id: informationElement.testCaseId,
      message_id: informationElement.messageId,
      ie_name: informationElement.name,
      ie_type: informationElement.type,
      data_type: informationElement.dataType || 'STRING',
      ie_value: informationElement.values ? JSON.stringify(informationElement.values) : null,
      ie_description: informationElement.description,
      validation_rules: informationElement.validationRules || null,
      three_gpp_ref: informationElement.threeGPPRef || null
    };
  }

  // Format VoLTE layer parameter for database insertion
  formatVoLTELayerParameterForInsert(layerParameter) {
    return {
      test_case_id: layerParameter.testCaseId,
      layer: layerParameter.layer,
      parameter_name: layerParameter.parameterName,
      parameter_type: layerParameter.parameterType,
      parameter_value: layerParameter.value,
      parameter_unit: layerParameter.unit || null,
      min_value: layerParameter.minValue || null,
      max_value: layerParameter.maxValue || null,
      default_value: layerParameter.defaultValue || null,
      description: layerParameter.description,
      three_gpp_ref: layerParameter.threeGPPRef || null
    };
  }

  // Format VoNR layer parameter for database insertion
  formatVoNRLayerParameterForInsert(layerParameter) {
    return {
      test_case_id: layerParameter.testCaseId,
      layer: layerParameter.layer,
      parameter_name: layerParameter.parameterName,
      parameter_type: layerParameter.parameterType,
      parameter_value: layerParameter.value,
      parameter_unit: layerParameter.unit || null,
      min_value: layerParameter.minValue || null,
      max_value: layerParameter.maxValue || null,
      default_value: layerParameter.defaultValue || null,
      description: layerParameter.description,
      three_gpp_ref: layerParameter.threeGPPRef || null
    };
  }

  // Map SIP message types
  mapSIPMessageType(messageName) {
    const mapping = {
      'SIP INVITE': 'INVITE',
      'SIP 180 Ringing': '180_Ringing',
      'SIP 200 OK': '200_OK',
      'SIP ACK': 'ACK',
      'SIP BYE': 'BYE',
      'SIP CANCEL': 'CANCEL',
      'SIP REFER': 'REFER',
      'SIP UPDATE': 'UPDATE',
      'SIP INFO': 'INFO',
      'SIP MESSAGE': 'MESSAGE',
      'SIP REGISTER': 'REGISTER'
    };
    return mapping[messageName] || 'INVITE';
  }

  // Map SIP directions
  mapSIPDirection(direction) {
    const mapping = {
      'UE_to_gNB': 'UE_to_P-CSCF',
      'gNB_to_UE': 'P-CSCF_to_UE',
      'UL': 'UE_to_P-CSCF',
      'DL': 'P-CSCF_to_UE',
      'BIDIR': 'BIDIR'
    };
    return mapping[direction] || 'UE_to_P-CSCF';
  }

  // Map RTP message types
  mapRTPMessageType(messageName) {
    if (messageName.includes('RTP_Audio')) return 'RTP_Audio';
    if (messageName.includes('RTP_Video')) return 'RTP_Video';
    if (messageName.includes('RTCP')) return 'RTCP_SR';
    return 'RTP_Audio';
  }

  // Map RTP directions
  mapRTPDirection(direction) {
    const mapping = {
      'UE_to_gNB': 'UL',
      'gNB_to_UE': 'DL',
      'UL': 'UL',
      'DL': 'DL',
      'BIDIR': 'BIDIR'
    };
    return mapping[direction] || 'BIDIR';
  }

  // Extract payload type from message
  extractPayloadType(testMessage) {
    // Default payload types for common codecs
    if (testMessage.messageName.includes('AMR')) return 96;
    if (testMessage.messageName.includes('G.711')) return 0;
    if (testMessage.messageName.includes('EVS')) return 97;
    return 96; // Default AMR
  }

  // Extract SSRC from message
  extractSSRC(testMessage) {
    return Math.floor(Math.random() * 4294967295); // Random SSRC
  }

  // Extract codec from message
  extractCodec(testMessage) {
    if (testMessage.messageName.includes('AMR')) return 'AMR-WB';
    if (testMessage.messageName.includes('G.711')) return 'G.711';
    if (testMessage.messageName.includes('EVS')) return 'EVS';
    return 'AMR-WB'; // Default
  }

  // Extract bitrate from message
  extractBitrate(testMessage) {
    if (testMessage.messageName.includes('AMR')) return 12800;
    if (testMessage.messageName.includes('G.711')) return 64000;
    if (testMessage.messageName.includes('EVS')) return 12800;
    return 12800; // Default AMR bitrate
  }

  // Extract packet size from message
  extractPacketSize(testMessage) {
    if (testMessage.messageName.includes('AMR')) return 32;
    if (testMessage.messageName.includes('G.711')) return 160;
    if (testMessage.messageName.includes('EVS')) return 32;
    return 32; // Default AMR packet size
  }

  // Get insertion statistics
  getStatistics() {
    return {
      insertedCount: this.insertedCount,
      errorCount: this.errorCount,
      successRate: this.insertedCount / (this.insertedCount + this.errorCount) * 100
    };
  }

  // Utility function for delays
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VoLTEVoNRDatabaseInserter;
} else {
  window.VoLTEVoNRDatabaseInserter = VoLTEVoNRDatabaseInserter;
}

console.log('📡 VoLTE & VoNR Database Inserter loaded');
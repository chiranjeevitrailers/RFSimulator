// Insert Complete Test Cases to Supabase Database
// This script inserts all 1000+ test cases including complete 5G NR SA and NSA test cases

class CompleteTestCasesInserter {
  constructor() {
    this.supabaseUrl = 'https://your-project.supabase.co';
    this.supabaseKey = 'your-anon-key';
    this.supabase = null;
    this.insertedCount = 0;
    this.errorCount = 0;
    this.batchSize = 50;
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

  // Insert all test cases
  async insertAllTestCases() {
    console.log('🚀 Starting insertion of complete test cases...');
    
    if (!await this.initializeSupabase()) {
      console.error('❌ Cannot proceed without Supabase connection');
      return;
    }

    try {
      // Generate all test cases
      const generator = new window.TestCaseGenerator();
      const allTestData = generator.generateAllTestCases();
      
      console.log(`📊 Generated ${allTestData.testCases.length} test cases`);
      
      // Insert test cases in batches
      await this.insertTestCasesInBatches(allTestData.testCases);
      
      // Insert test messages
      await this.insertTestMessagesInBatches(allTestData.testMessages);
      
      // Insert information elements
      await this.insertInformationElementsInBatches(allTestData.informationElements);
      
      // Insert layer parameters
      await this.insertLayerParametersInBatches(allTestData.layerParameters);
      
      console.log(`✅ Insertion completed: ${this.insertedCount} records inserted, ${this.errorCount} errors`);
      
    } catch (error) {
      console.error('❌ Error during test case insertion:', error);
    }
  }

  // Insert test cases in batches
  async insertTestCasesInBatches(testCases) {
    console.log('📡 Inserting test cases...');
    
    for (let i = 0; i < testCases.length; i += this.batchSize) {
      const batch = testCases.slice(i, i + this.batchSize);
      
      try {
        const { data, error } = await this.supabase
          .from('test_cases')
          .insert(batch.map(tc => this.formatTestCaseForInsert(tc)));
        
        if (error) {
          console.error(`❌ Error inserting test cases batch ${i}-${i + batch.length}:`, error);
          this.errorCount += batch.length;
        } else {
          console.log(`✅ Inserted test cases batch ${i}-${i + batch.length}`);
          this.insertedCount += batch.length;
        }
        
        // Add delay between batches to avoid rate limiting
        await this.delay(100);
        
      } catch (error) {
        console.error(`❌ Exception inserting test cases batch ${i}-${i + batch.length}:`, error);
        this.errorCount += batch.length;
      }
    }
  }

  // Insert test messages in batches
  async insertTestMessagesInBatches(testMessages) {
    console.log('📡 Inserting test messages...');
    
    for (let i = 0; i < testMessages.length; i += this.batchSize) {
      const batch = testMessages.slice(i, i + this.batchSize);
      
      try {
        const { data, error } = await this.supabase
          .from('test_messages')
          .insert(batch.map(tm => this.formatTestMessageForInsert(tm)));
        
        if (error) {
          console.error(`❌ Error inserting test messages batch ${i}-${i + batch.length}:`, error);
          this.errorCount += batch.length;
        } else {
          console.log(`✅ Inserted test messages batch ${i}-${i + batch.length}`);
          this.insertedCount += batch.length;
        }
        
        await this.delay(100);
        
      } catch (error) {
        console.error(`❌ Exception inserting test messages batch ${i}-${i + batch.length}:`, error);
        this.errorCount += batch.length;
      }
    }
  }

  // Insert information elements in batches
  async insertInformationElementsInBatches(informationElements) {
    console.log('📡 Inserting information elements...');
    
    for (let i = 0; i < informationElements.length; i += this.batchSize) {
      const batch = informationElements.slice(i, i + this.batchSize);
      
      try {
        const { data, error } = await this.supabase
          .from('information_elements')
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

  // Insert layer parameters in batches
  async insertLayerParametersInBatches(layerParameters) {
    console.log('📡 Inserting layer parameters...');
    
    for (let i = 0; i < layerParameters.length; i += this.batchSize) {
      const batch = layerParameters.slice(i, i + this.batchSize);
      
      try {
        const { data, error } = await this.supabase
          .from('layer_parameters')
          .insert(batch.map(lp => this.formatLayerParameterForInsert(lp)));
        
        if (error) {
          console.error(`❌ Error inserting layer parameters batch ${i}-${i + batch.length}:`, error);
          this.errorCount += batch.length;
        } else {
          console.log(`✅ Inserted layer parameters batch ${i}-${i + batch.length}`);
          this.insertedCount += batch.length;
        }
        
        await this.delay(100);
        
      } catch (error) {
        console.error(`❌ Exception inserting layer parameters batch ${i}-${i + batch.length}:`, error);
        this.errorCount += batch.length;
      }
    }
  }

  // Format test case for database insertion
  formatTestCaseForInsert(testCase) {
    return {
      test_case_id: testCase.id,
      name: testCase.name,
      description: testCase.description,
      category: testCase.category,
      subcategory: testCase.subcategory || null,
      protocol: testCase.protocol,
      test_type: testCase.testType,
      complexity: testCase.complexity,
      priority: testCase.priority,
      estimated_duration: testCase.estimatedDuration,
      preconditions: testCase.preconditions ? testCase.preconditions.join('; ') : null,
      test_steps: testCase.testSteps ? testCase.testSteps.join('; ') : null,
      expected_signaling_flow: testCase.expectedSignalingFlow ? testCase.expectedSignalingFlow.join('; ') : null,
      expected_ies: testCase.expectedIEs ? testCase.expectedIEs.join('; ') : null,
      layer_parameters: testCase.layerParameters ? testCase.layerParameters.join('; ') : null,
      expected_result: testCase.expectedResult,
      three_gpp_ref: testCase.threeGPPRef,
      tags: testCase.tags || []
    };
  }

  // Format test message for database insertion
  formatTestMessageForInsert(testMessage) {
    return {
      test_case_id: testMessage.testCaseId,
      message_id: testMessage.id,
      message_name: testMessage.messageName,
      protocol: testMessage.protocol,
      layer: testMessage.layer,
      direction: testMessage.direction,
      message_type: testMessage.messageType || testMessage.messageName,
      sequence_number: testMessage.sequenceNumber,
      timestamp_offset_ms: testMessage.timestampOffset || 0,
      message_payload: testMessage.messagePayload || null,
      expected_response: testMessage.expectedResponse || null,
      timeout_ms: testMessage.timeout || 5000,
      validation_rules: testMessage.validationRules || null
    };
  }

  // Format information element for database insertion
  formatInformationElementForInsert(informationElement) {
    return {
      test_case_id: informationElement.testCaseId,
      message_id: informationElement.messageId,
      ie_id: informationElement.id,
      ie_name: informationElement.name,
      ie_type: informationElement.type,
      data_type: informationElement.dataType || 'STRING',
      ie_value: informationElement.values ? JSON.stringify(informationElement.values) : null,
      ie_description: informationElement.description,
      validation_rules: informationElement.validationRules || null,
      dependencies: informationElement.dependencies || null,
      three_gpp_ref: informationElement.threeGPPRef || null
    };
  }

  // Format layer parameter for database insertion
  formatLayerParameterForInsert(layerParameter) {
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

  // Insert specific 5G NR test cases
  async insert5GNRTestCases() {
    console.log('📡 Inserting 5G NR test cases...');
    
    // Generate 5G NR test cases
    const generator = new window.Complete5GNRTestCaseGenerator();
    const nrTestData = generator.generateAll5GNRTestCases();
    
    console.log(`📊 Generated ${nrTestData.testCases.length} 5G NR test cases`);
    
    // Insert 5G NR test cases
    await this.insertTestCasesInBatches(nrTestData.testCases);
    await this.insertTestMessagesInBatches(nrTestData.testMessages);
    await this.insertInformationElementsInBatches(nrTestData.informationElements);
    await this.insertLayerParametersInBatches(nrTestData.layerParameters);
  }

  // Insert NSA test cases
  async insertNSATestCases() {
    console.log('📡 Inserting NSA test cases...');
    
    // Generate NSA test cases
    const generator = new window.NSATestCaseGenerator();
    const nsaTestData = generator.generateAllNSATestCases();
    
    console.log(`📊 Generated ${nsaTestData.testCases.length} NSA test cases`);
    
    // Insert NSA test cases
    await this.insertTestCasesInBatches(nsaTestData.testCases);
    await this.insertTestMessagesInBatches(nsaTestData.testMessages);
    await this.insertInformationElementsInBatches(nsaTestData.informationElements);
    await this.insertLayerParametersInBatches(nsaTestData.layerParameters);
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

  // Clear all test data (for testing purposes)
  async clearAllTestData() {
    console.log('🗑️ Clearing all test data...');
    
    if (!this.supabase) {
      console.error('❌ Supabase not initialized');
      return;
    }

    try {
      // Delete in reverse order due to foreign key constraints
      await this.supabase.from('execution_logs').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await this.supabase.from('test_results').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await this.supabase.from('test_executions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await this.supabase.from('layer_parameters').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await this.supabase.from('information_elements').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await this.supabase.from('test_messages').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await this.supabase.from('test_cases').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      console.log('✅ All test data cleared');
    } catch (error) {
      console.error('❌ Error clearing test data:', error);
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CompleteTestCasesInserter;
} else {
  window.CompleteTestCasesInserter = CompleteTestCasesInserter;
}

console.log('📡 Complete Test Cases Inserter loaded');
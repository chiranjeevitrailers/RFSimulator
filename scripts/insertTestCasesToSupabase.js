// Insert All 1000 Test Cases to Supabase Database
// This script generates and inserts comprehensive test cases into Supabase

class SupabaseTestCaseInserter {
  constructor(supabaseUrl, supabaseKey) {
    this.supabaseUrl = supabaseUrl;
    this.supabaseKey = supabaseKey;
    this.batchSize = 50; // Insert in batches of 50
  }

  async insertAllTestCases() {
    console.log('🚀 Starting insertion of 1000 test cases to Supabase...');
    
    try {
      // Generate all test cases
      const generator = new TestCaseGenerator();
      const data = generator.generateAllTestCases();
      
      console.log(`📊 Generated data:`);
      console.log(`   - Test Cases: ${data.testCases.length}`);
      console.log(`   - Test Messages: ${data.testMessages.length}`);
      console.log(`   - Information Elements: ${data.informationElements.length}`);
      console.log(`   - Layer Parameters: ${data.layerParameters.length}`);
      
      // Insert test cases
      await this.insertTestCases(data.testCases);
      
      // Insert test messages
      await this.insertTestMessages(data.testMessages);
      
      // Insert information elements
      await this.insertInformationElements(data.informationElements);
      
      // Insert layer parameters
      await this.insertLayerParameters(data.layerParameters);
      
      console.log('✅ Successfully inserted all test cases to Supabase!');
      
    } catch (error) {
      console.error('❌ Error inserting test cases:', error);
      throw error;
    }
  }

  async insertTestCases(testCases) {
    console.log('📝 Inserting test cases...');
    
    const batches = this.chunkArray(testCases, this.batchSize);
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`   Inserting batch ${i + 1}/${batches.length} (${batch.length} test cases)`);
      
      try {
        const response = await fetch(`${this.supabaseUrl}/rest/v1/test_cases`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': this.supabaseKey,
            'Authorization': `Bearer ${this.supabaseKey}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(batch)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to insert test cases batch ${i + 1}: ${response.status} ${errorText}`);
        }
        
        // Add delay between batches to avoid rate limiting
        if (i < batches.length - 1) {
          await this.delay(1000);
        }
        
      } catch (error) {
        console.error(`❌ Error inserting test cases batch ${i + 1}:`, error);
        throw error;
      }
    }
    
    console.log('✅ Test cases inserted successfully!');
  }

  async insertTestMessages(testMessages) {
    console.log('📨 Inserting test messages...');
    
    const batches = this.chunkArray(testMessages, this.batchSize);
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`   Inserting batch ${i + 1}/${batches.length} (${batch.length} test messages)`);
      
      try {
        const response = await fetch(`${this.supabaseUrl}/rest/v1/test_messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': this.supabaseKey,
            'Authorization': `Bearer ${this.supabaseKey}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(batch)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to insert test messages batch ${i + 1}: ${response.status} ${errorText}`);
        }
        
        // Add delay between batches
        if (i < batches.length - 1) {
          await this.delay(1000);
        }
        
      } catch (error) {
        console.error(`❌ Error inserting test messages batch ${i + 1}:`, error);
        throw error;
      }
    }
    
    console.log('✅ Test messages inserted successfully!');
  }

  async insertInformationElements(informationElements) {
    console.log('🔧 Inserting information elements...');
    
    const batches = this.chunkArray(informationElements, this.batchSize);
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`   Inserting batch ${i + 1}/${batches.length} (${batch.length} information elements)`);
      
      try {
        const response = await fetch(`${this.supabaseUrl}/rest/v1/information_elements`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': this.supabaseKey,
            'Authorization': `Bearer ${this.supabaseKey}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(batch)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to insert information elements batch ${i + 1}: ${response.status} ${errorText}`);
        }
        
        // Add delay between batches
        if (i < batches.length - 1) {
          await this.delay(1000);
        }
        
      } catch (error) {
        console.error(`❌ Error inserting information elements batch ${i + 1}:`, error);
        throw error;
      }
    }
    
    console.log('✅ Information elements inserted successfully!');
  }

  async insertLayerParameters(layerParameters) {
    console.log('⚙️ Inserting layer parameters...');
    
    const batches = this.chunkArray(layerParameters, this.batchSize);
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`   Inserting batch ${i + 1}/${batches.length} (${batch.length} layer parameters)`);
      
      try {
        const response = await fetch(`${this.supabaseUrl}/rest/v1/layer_parameters`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': this.supabaseKey,
            'Authorization': `Bearer ${this.supabaseKey}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(batch)
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to insert layer parameters batch ${i + 1}: ${response.status} ${errorText}`);
        }
        
        // Add delay between batches
        if (i < batches.length - 1) {
          await this.delay(1000);
        }
        
      } catch (error) {
        console.error(`❌ Error inserting layer parameters batch ${i + 1}:`, error);
        throw error;
      }
    }
    
    console.log('✅ Layer parameters inserted successfully!');
  }

  // Utility methods
  chunkArray(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Validation methods
  async validateInsertion() {
    console.log('🔍 Validating insertion...');
    
    try {
      // Check test cases count
      const testCasesResponse = await fetch(`${this.supabaseUrl}/rest/v1/test_cases?select=count`, {
        headers: {
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`
        }
      });
      
      if (testCasesResponse.ok) {
        const testCasesData = await testCasesResponse.json();
        console.log(`   Test Cases: ${testCasesData.length}`);
      }
      
      // Check test messages count
      const testMessagesResponse = await fetch(`${this.supabaseUrl}/rest/v1/test_messages?select=count`, {
        headers: {
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`
        }
      });
      
      if (testMessagesResponse.ok) {
        const testMessagesData = await testMessagesResponse.json();
        console.log(`   Test Messages: ${testMessagesData.length}`);
      }
      
      // Check information elements count
      const iesResponse = await fetch(`${this.supabaseUrl}/rest/v1/information_elements?select=count`, {
        headers: {
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`
        }
      });
      
      if (iesResponse.ok) {
        const iesData = await iesResponse.json();
        console.log(`   Information Elements: ${iesData.length}`);
      }
      
      // Check layer parameters count
      const paramsResponse = await fetch(`${this.supabaseUrl}/rest/v1/layer_parameters?select=count`, {
        headers: {
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`
        }
      });
      
      if (paramsResponse.ok) {
        const paramsData = await paramsResponse.json();
        console.log(`   Layer Parameters: ${paramsData.length}`);
      }
      
      console.log('✅ Validation completed!');
      
    } catch (error) {
      console.error('❌ Error during validation:', error);
    }
  }

  // Get test case statistics
  async getTestCaseStatistics() {
    console.log('📊 Getting test case statistics...');
    
    try {
      const response = await fetch(`${this.supabaseUrl}/rest/v1/test_case_categories`, {
        headers: {
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('📈 Test Case Statistics:');
        data.forEach(stat => {
          console.log(`   ${stat.category} - ${stat.subcategory}: ${stat.test_count} test cases`);
        });
      }
      
    } catch (error) {
      console.error('❌ Error getting statistics:', error);
    }
  }
}

// Usage function
async function insertAllTestCasesToSupabase() {
  // Replace with your actual Supabase URL and key
  const supabaseUrl = 'YOUR_SUPABASE_URL';
  const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
  
  const inserter = new SupabaseTestCaseInserter(supabaseUrl, supabaseKey);
  
  try {
    await inserter.insertAllTestCases();
    await inserter.validateInsertion();
    await inserter.getTestCaseStatistics();
    
    console.log('🎉 All test cases successfully inserted to Supabase!');
    
  } catch (error) {
    console.error('💥 Failed to insert test cases:', error);
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SupabaseTestCaseInserter;
} else if (typeof window !== 'undefined') {
  window.SupabaseTestCaseInserter = SupabaseTestCaseInserter;
  window.insertAllTestCasesToSupabase = insertAllTestCasesToSupabase;
}

// Auto-run if in browser and Supabase credentials are available
if (typeof window !== 'undefined' && window.SUPABASE_URL && window.SUPABASE_ANON_KEY) {
  console.log('🚀 Auto-starting test case insertion...');
  insertAllTestCasesToSupabase();
}
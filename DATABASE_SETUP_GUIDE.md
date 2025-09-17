# Database Setup Guide for Professional Testing Platform

## Overview
This guide provides comprehensive instructions for setting up the database for the Professional Testing Platform, including all 1000+ test cases with complete 5G NR SA and NSA scenarios.

## Database Architecture

### Core Tables

#### 1. test_cases
Primary table storing all test case definitions including SA and NSA scenarios.

**Key Features:**
- Support for all test case categories (5G_NR, 4G_LTE, IMS, O_RAN, etc.)
- SA and NSA test case support
- Comprehensive test metadata
- 3GPP reference compliance

**Schema:**
```sql
CREATE TABLE test_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    subcategory VARCHAR(100),
    protocol VARCHAR(50) NOT NULL,
    test_type VARCHAR(50) NOT NULL,
    complexity VARCHAR(20) NOT NULL,
    priority VARCHAR(10) NOT NULL,
    estimated_duration INTEGER,
    preconditions TEXT,
    test_steps TEXT,
    expected_signaling_flow TEXT,
    expected_ies TEXT,
    layer_parameters TEXT,
    expected_result TEXT,
    three_gpp_ref TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 2. test_messages
Stores detailed message flows for each test case.

**Key Features:**
- Support for all protocol layers (PHY, MAC, RLC, PDCP, RRC, NAS, etc.)
- Message sequencing and timing
- Validation rules and expected responses
- JSON payload support

**Schema:**
```sql
CREATE TABLE test_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id UUID REFERENCES test_cases(id) ON DELETE CASCADE,
    message_id VARCHAR(50) NOT NULL,
    message_name VARCHAR(255) NOT NULL,
    protocol VARCHAR(50) NOT NULL,
    layer VARCHAR(20) NOT NULL,
    direction VARCHAR(20) NOT NULL,
    message_type VARCHAR(100) NOT NULL,
    sequence_number INTEGER NOT NULL,
    timestamp_offset_ms INTEGER DEFAULT 0,
    message_payload JSONB,
    expected_response VARCHAR(100),
    timeout_ms INTEGER DEFAULT 5000,
    validation_rules JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 3. information_elements
Stores 3GPP-compliant information elements for each message.

**Key Features:**
- 3GPP-compliant IE definitions
- Mandatory/Optional/Conditional IE types
- Validation rules and dependencies
- Multiple data types support

**Schema:**
```sql
CREATE TABLE information_elements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id UUID REFERENCES test_cases(id) ON DELETE CASCADE,
    message_id UUID REFERENCES test_messages(id) ON DELETE CASCADE,
    ie_id VARCHAR(50) NOT NULL,
    ie_name VARCHAR(255) NOT NULL,
    ie_type VARCHAR(50) NOT NULL,
    data_type VARCHAR(50) NOT NULL,
    ie_value JSONB,
    ie_description TEXT,
    validation_rules JSONB,
    dependencies JSONB,
    three_gpp_ref TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 4. layer_parameters
Stores protocol layer parameters for each test case.

**Key Features:**
- Support for all protocol layers
- Parameter types (CONFIG, MEASUREMENT, STATUS, CONTROL)
- Value ranges and validation
- 3GPP reference compliance

**Schema:**
```sql
CREATE TABLE layer_parameters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id UUID REFERENCES test_cases(id) ON DELETE CASCADE,
    layer VARCHAR(20) NOT NULL,
    parameter_name VARCHAR(255) NOT NULL,
    parameter_type VARCHAR(50) NOT NULL,
    parameter_value JSONB,
    parameter_unit VARCHAR(50),
    min_value JSONB,
    max_value JSONB,
    default_value JSONB,
    description TEXT,
    three_gpp_ref TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### NSA-Specific Tables

#### 5. nsa_configurations
Stores NSA (Non-Standalone) configuration details.

**Key Features:**
- EN-DC, NE-DC, NGEN-DC support
- Split bearer configurations
- Carrier aggregation settings
- Measurement configurations

**Schema:**
```sql
CREATE TABLE nsa_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_case_id UUID REFERENCES test_cases(id) ON DELETE CASCADE,
    nsa_type VARCHAR(20) NOT NULL,
    anchor_rat VARCHAR(10) NOT NULL,
    secondary_rat VARCHAR(10) NOT NULL,
    split_bearer_config JSONB,
    carrier_aggregation_config JSONB,
    measurement_config JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 6. split_bearers
Stores split bearer configurations for NSA test cases.

**Key Features:**
- MCG, SCG, Split bearer types
- QoS parameters
- PDCP and RLC configurations
- Multiple split bearer support

**Schema:**
```sql
CREATE TABLE split_bearers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nsa_config_id UUID REFERENCES nsa_configurations(id) ON DELETE CASCADE,
    bearer_id VARCHAR(50) NOT NULL,
    bearer_type VARCHAR(20) NOT NULL,
    qos_parameters JSONB,
    pdcp_config JSONB,
    rlc_config JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Execution and Monitoring Tables

#### 7. test_executions
Tracks test execution instances.

**Key Features:**
- Execution status tracking
- Performance metrics
- Configuration management
- Result storage

#### 8. execution_logs
Real-time execution logging.

**Key Features:**
- Multi-level logging (ERROR, WARN, INFO, DEBUG)
- Layer-specific logging
- Component tracking
- Real-time updates

#### 9. test_results
Stores detailed test results.

**Key Features:**
- Message-level results
- Layer-specific results
- Performance metrics
- Error tracking

#### 10. performance_metrics
Performance measurement storage.

**Key Features:**
- Latency measurements
- Throughput metrics
- Success rates
- Resource utilization

## Setup Instructions

### 1. Database Schema Setup

#### Option A: Using Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/enhanced_testing_platform_schema.sql`
4. Execute the SQL script

#### Option B: Using the Setup Script
```javascript
// Initialize the database setup
const dbSetup = new CompleteDatabaseSetup();
await dbSetup.setupCompleteDatabase();
```

### 2. Test Case Data Insertion

#### Option A: Using the Complete Inserter
```javascript
// Insert all test cases
const inserter = new CompleteTestCasesInserter();
await inserter.insertAllTestCases();
```

#### Option B: Insert Specific Test Case Types
```javascript
// Insert only 5G NR test cases
await inserter.insert5GNRTestCases();

// Insert only NSA test cases
await inserter.insertNSATestCases();
```

### 3. Verification

```javascript
// Verify database setup
const dbSetup = new CompleteDatabaseSetup();
await dbSetup.verifySetup();

// Get database statistics
const stats = await dbSetup.getDatabaseStatistics();
console.log('Database Statistics:', stats);
```

## Test Case Distribution

### SA (Standalone) Test Cases - 350 test cases
- **Initial Access**: 50 test cases
- **Handover**: 50 test cases
- **PDU Session**: 50 test cases
- **Mobility**: 50 test cases
- **Security**: 50 test cases
- **Measurement**: 50 test cases
- **Power Control**: 50 test cases
- **Scheduling**: 50 test cases

### NSA (Non-Standalone) Test Cases - 50 test cases
- **EN-DC Functional**: 20 test cases
- **EN-DC Performance**: 10 test cases
- **EN-DC RF**: 10 test cases
- **EN-DC Stability**: 5 test cases
- **EN-DC Sanity**: 5 test cases

### Other Protocol Test Cases - 600 test cases
- **LTE**: 300 test cases
- **VoLTE/VoNR**: 160 test cases
- **IMS/SIP**: 60 test cases
- **Conference Call**: 45 test cases
- **Enhanced IMS**: 35 test cases
- **O-RAN**: 30 test cases
- **V2X**: 20 test cases
- **NTN**: 20 test cases
- **NB-IoT**: 20 test cases

**Total**: 1000+ test cases

## Database Views

### 1. test_case_summary
Provides a summary view of all test cases with counts.

### 2. test_execution_summary
Provides execution status and results summary.

### 3. nsa_test_summary
Provides NSA-specific test case summary.

## Performance Optimization

### Indexes
- Category, protocol, and test type indexes
- Message sequence indexes
- Execution timestamp indexes
- Full-text search indexes

### Row Level Security (RLS)
- Public read access for all tables
- Configurable security policies
- User-based access control

## Usage Examples

### Query Test Cases by Category
```sql
SELECT * FROM test_case_summary 
WHERE category = '5G_NR' 
ORDER BY priority DESC;
```

### Get NSA Test Cases
```sql
SELECT * FROM nsa_test_summary 
WHERE nsa_type = 'EN-DC';
```

### Get Test Execution Results
```sql
SELECT * FROM test_execution_summary 
WHERE status = 'COMPLETED' 
ORDER BY completed_at DESC;
```

### Get Performance Metrics
```sql
SELECT metric_name, AVG(metric_value) as avg_value
FROM performance_metrics 
WHERE metric_type = 'LATENCY'
GROUP BY metric_name;
```

## Maintenance

### Backup
```javascript
// Export all data
const dbSetup = new CompleteDatabaseSetup();
const exportData = await dbSetup.exportDatabaseData();
```

### Clear Data (for testing)
```javascript
// Clear all test data
const dbSetup = new CompleteDatabaseSetup();
await dbSetup.clearAllData();
```

### Statistics
```javascript
// Get database statistics
const stats = await dbSetup.getDatabaseStatistics();
console.log('Total test cases:', stats.test_cases);
console.log('Total messages:', stats.test_messages);
console.log('Category distribution:', stats.categoryDistribution);
```

## Troubleshooting

### Common Issues

1. **Foreign Key Constraints**
   - Ensure test cases are inserted before messages
   - Use proper deletion order when clearing data

2. **Performance Issues**
   - Check index usage
   - Monitor query performance
   - Use batch operations for large inserts

3. **Data Validation**
   - Verify 3GPP compliance
   - Check message sequence numbers
   - Validate IE dependencies

### Support
For issues or questions, refer to:
- 3GPP specifications (TS 38.300, TS 37.340, etc.)
- Supabase documentation
- Database schema documentation

## Conclusion

The database setup provides a comprehensive foundation for the Professional Testing Platform, supporting all 1000+ test cases with real 3GPP-compliant message flows, information elements, and layer parameters. The schema is designed for scalability, performance, and maintainability while ensuring full compliance with 3GPP standards.

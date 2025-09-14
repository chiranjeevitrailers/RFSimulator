# 5GLabX Supabase Deployment Guide

## 🎯 **Overview**

This guide provides step-by-step instructions for deploying the 5GLabX Platform to Supabase with all real-time simulation features enabled.

## ✅ **Pre-Deployment Verification**

The database completeness verification shows:
- **100% Database Completeness** ✅
- **24/24 Tables** ✅
- **5/5 Functions** ✅
- **3/3 Views** ✅
- **3/3 Extensions** ✅
- **9/9 Seed Files** ✅
- **52 RLS Policies** ✅
- **304 Indexes** ✅
- **40 Triggers** ✅

## 🚀 **Deployment Steps**

### **1. Supabase Project Setup**

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Initialize project (if not already done)
supabase init

# Link to your Supabase project
supabase link --project-ref YOUR_PROJECT_REF
```

### **2. Database Migration**

Run migrations in the correct order:

```bash
# Core schema
supabase db push --file supabase/migrations/001_complete_platform_schema.sql

# Enhanced test cases
supabase db push --file supabase/migrations/002_test_cases_enhanced.sql

# Test cases seed data
supabase db push --file supabase/migrations/003_comprehensive_test_cases_seed.sql

# Default configurations
supabase db push --file supabase/migrations/004_default_configurations_seed.sql

# Alert management
supabase db push --file supabase/migrations/005_alert_management_tables.sql

# 1000 test cases
supabase db push --file supabase/migrations/006_comprehensive_1000_test_cases.sql

# Remaining protocols
supabase db push --file supabase/migrations/007_remaining_protocols_test_cases.sql

# 3GPP IEs
supabase db push --file supabase/migrations/008_comprehensive_3gpp_ies.sql

# Message flows
supabase db push --file supabase/migrations/009_complete_3gpp_message_flows.sql

# Test configuration
supabase db push --file supabase/migrations/010_test_configuration_tables.sql

# Test suites enhancements
supabase db push --file supabase/migrations/011_test_suites_enhancements.sql

# Decoded messages schema (CRITICAL for real-time simulation)
supabase db push --file supabase/migrations/012_decoded_messages_schema.sql

# Missing columns and improvements
supabase db push --file supabase/migrations/013_fix_missing_columns_and_improvements.sql

# Comprehensive seed data
supabase db push --file supabase/migrations/014_comprehensive_seed_data_setup.sql

# Database optimization
supabase db push --file supabase/migrations/015_final_database_optimization.sql

# Missing tables and functions
supabase db push --file supabase/migrations/016_missing_tables_and_functions.sql

# Missing indexes (CRITICAL for performance)
supabase db push --file supabase/migrations/017_missing_indexes.sql
```

### **3. Seed Data Loading**

```bash
# Core seed data
supabase db push --file supabase/seed.sql

# Test cases
supabase db push --file supabase/seed_test_cases.sql

# 5G NR test cases
supabase db push --file supabase/seed_5g_nr_test_cases.sql

# 4G LTE test cases
supabase db push --file supabase/seed_4g_lte_test_cases.sql

# 3GPP compliant test cases
supabase db push --file supabase/seed_3gpp_compliant_test_cases.sql

# IMS SIP test cases
supabase db push --file supabase/seed_ims_sip_test_cases.sql

# O-RAN test cases
supabase db push --file supabase/seed_oran_test_cases.sql

# NB-IoT, V2X, NTN test cases
supabase db push --file supabase/seed_nbiot_v2x_ntn_test_cases.sql

# Detailed test cases
supabase db push --file supabase/seed_detailed_test_cases.sql
```

### **4. Environment Configuration**

Create `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Real-time Simulation Configuration
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:3000
NEXT_PUBLIC_SIMULATION_API_URL=http://localhost:3000/api/simulation

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=5GLabX Protocol Analyzer
```

### **5. Supabase Configuration**

#### **Enable Real-time Features**

```sql
-- Enable real-time for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.test_case_executions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.decoded_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.test_run_queue;
ALTER PUBLICATION supabase_realtime ADD TABLE public.test_run_metrics;
```

#### **Configure Row Level Security**

All tables have RLS enabled with appropriate policies. Verify with:

```sql
-- Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true;
```

#### **Set up Storage Buckets**

```sql
-- Create storage buckets for log files
INSERT INTO storage.buckets (id, name, public) VALUES 
('log-files', 'log-files', false),
('test-artifacts', 'test-artifacts', false),
('reports', 'reports', false);
```

### **6. Real-time Simulation Setup**

#### **WebSocket Configuration**

The real-time simulation requires WebSocket support. Configure in your Next.js app:

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})
```

#### **API Routes Configuration**

Ensure all API routes are properly configured:

- `/api/simulation/stream` - Real-time simulation control
- `/api/tests/*` - Test case management
- `/api/test-suites/*` - Test suite management

### **7. Performance Optimization**

#### **Database Indexes**

All 304 indexes are automatically created. Monitor performance with:

```sql
-- Check index usage
SELECT * FROM public.index_usage_stats 
ORDER BY idx_scan DESC;

-- Check table sizes
SELECT * FROM public.table_size_stats 
ORDER BY total_size DESC;
```

#### **Connection Pooling**

Configure Supabase connection pooling:

```env
# In your Supabase dashboard
DATABASE_POOL_SIZE=20
DATABASE_POOL_TIMEOUT=30
```

### **8. Security Configuration**

#### **API Keys**

- **Anon Key**: For client-side operations
- **Service Role Key**: For server-side operations (keep secret)
- **JWT Secret**: For authentication

#### **CORS Configuration**

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
}
```

### **9. Testing Deployment**

#### **Database Connectivity Test**

```typescript
// Test database connection
const testConnection = async () => {
  const { data, error } = await supabase
    .from('test_cases')
    .select('count')
    .limit(1);
  
  if (error) {
    console.error('Database connection failed:', error);
  } else {
    console.log('Database connection successful');
  }
};
```

#### **Real-time Simulation Test**

```typescript
// Test real-time simulation
const testSimulation = async () => {
  const response = await fetch('/api/simulation/stream?testCaseId=tc-001&action=initialize');
  const data = await response.json();
  
  if (data.success) {
    console.log('Real-time simulation initialized successfully');
  } else {
    console.error('Real-time simulation failed:', data.error);
  }
};
```

### **10. Monitoring and Maintenance**

#### **Health Checks**

Set up monitoring for:

- Database performance
- Real-time connections
- API response times
- Error rates
- Storage usage

#### **Backup Strategy**

```bash
# Automated backups (configure in Supabase dashboard)
# Daily backups with 30-day retention
# Point-in-time recovery enabled
```

#### **Scaling Considerations**

- **Database**: Supabase handles automatic scaling
- **Storage**: Monitor usage and upgrade as needed
- **Real-time**: WebSocket connections scale automatically
- **API**: Next.js API routes scale with Vercel/Netlify

## 🎯 **Real-time Simulation Features**

### **Supported Features**

✅ **Real-time Message Streaming**
✅ **Live KPI Updates**
✅ **Interactive Playback Controls**
✅ **Layer-based Message Grouping**
✅ **Live Charts and Analytics**
✅ **Time-based Navigation**
✅ **Message Filtering**
✅ **Performance Metrics**

### **Required Tables**

- `test_case_messages` - Test case message definitions
- `decoded_messages` - Real-time message data
- `test_run_queue` - Execution queue management
- `test_run_configs` - Configuration management
- `test_execution_workers` - Worker management

### **Required Functions**

- `get_layer_statistics()` - Layer performance metrics
- `get_protocol_statistics()` - Protocol performance metrics
- `get_test_execution_progress()` - Execution progress tracking

## 🚨 **Troubleshooting**

### **Common Issues**

1. **WebSocket Connection Failed**
   - Check CORS configuration
   - Verify WebSocket URL
   - Check firewall settings

2. **Database Connection Timeout**
   - Check connection pool settings
   - Verify database credentials
   - Check network connectivity

3. **Real-time Updates Not Working**
   - Verify RLS policies
   - Check real-time publication settings
   - Verify WebSocket connection

4. **Performance Issues**
   - Check index usage
   - Monitor query performance
   - Optimize database queries

### **Debug Commands**

```sql
-- Check active connections
SELECT * FROM pg_stat_activity WHERE state = 'active';

-- Check real-time subscriptions
SELECT * FROM pg_replication_slots;

-- Check table sizes
SELECT * FROM public.table_size_stats;

-- Check index usage
SELECT * FROM public.index_usage_stats;
```

## 📊 **Post-Deployment Verification**

Run the verification script:

```bash
node verify-database-completeness.js
```

Expected output:
- ✅ 100% Database Completeness
- ✅ All real-time simulation dependencies available
- ✅ No critical issues found
- ✅ Ready for Supabase deployment: YES

## 🎉 **Success Criteria**

Your 5GLabX deployment is successful when:

1. ✅ All 24 tables are created
2. ✅ All 5 functions are working
3. ✅ All 3 views are accessible
4. ✅ Real-time simulation is functional
5. ✅ WebSocket connections are stable
6. ✅ API endpoints are responding
7. ✅ User authentication is working
8. ✅ Test cases are loaded (1000+)
9. ✅ Performance is optimal
10. ✅ Security policies are enforced

## 🚀 **Next Steps**

After successful deployment:

1. **User Testing**: Test all real-time simulation features
2. **Performance Monitoring**: Set up monitoring dashboards
3. **User Training**: Provide user documentation
4. **Feature Updates**: Plan future enhancements
5. **Scaling**: Monitor usage and scale as needed

---

**🎯 The 5GLabX Platform is now ready for production use with full real-time simulation capabilities!**
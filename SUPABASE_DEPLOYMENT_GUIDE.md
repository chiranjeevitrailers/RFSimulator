# 5GLabX Platform - Supabase Deployment Guide

## 🚀 **Complete Commercial Platform Database Setup**

This guide provides all the SQL files needed to deploy the complete 5GLabX commercial platform database to Supabase.

## 📋 **Deployment Checklist**

### **Prerequisites**
- [ ] Supabase account and project created
- [ ] Supabase project URL and API key available
- [ ] Database access permissions
- [ ] Backup of existing data (if any)

### **Required Files**
- [ ] `001_complete_platform_schema.sql` - Core database schema
- [ ] `002_subscription_plans_seed.sql` - Subscription plans and system settings
- [ ] `003_comprehensive_test_cases_seed.sql` - Test cases and configurations
- [ ] `004_default_configurations_seed.sql` - Default configurations
- [ ] `005_documentation_tutorials_seed.sql` - Documentation and tutorials

## 🗄️ **Database Schema Overview**

### **Core Tables (25 tables)**
1. **Authentication & User Management**
   - `users` - User profiles and subscription info
   - `user_profiles` - Extended user information
   - `user_subscriptions` - Subscription management
   - `billing_history` - Payment and billing records
   - `usage_tracking` - Usage monitoring

2. **Test Cases & Configurations**
   - `test_case_categories` - Test case categories
   - `test_cases` - Main test case definitions
   - `test_case_messages` - Individual messages
   - `test_case_information_elements` - Detailed IEs
   - `test_case_layer_parameters` - Layer configurations
   - `test_configurations` - Configuration management

3. **Test Execution & Results**
   - `test_case_executions` - Execution tracking
   - `test_execution_messages` - Executed messages
   - `test_execution_logs` - Execution logs
   - `performance_metrics` - Performance data

4. **Analytics & Reporting**
   - `user_analytics` - User usage analytics
   - `test_case_analytics` - Test case analytics
   - `audit_logs` - System audit trail

5. **Content Management**
   - `documentation` - Platform documentation
   - `tutorials` - Learning tutorials
   - `support_tickets` - Support system
   - `feedback` - User feedback

6. **System Configuration**
   - `subscription_plans` - Subscription plans
   - `system_settings` - System configuration
   - `feature_flags` - Feature management

## 📁 **SQL Files to Execute**

### **1. Core Database Schema**
**File**: `001_complete_platform_schema.sql`
**Purpose**: Creates all database tables, indexes, RLS policies, and helper functions
**Size**: ~50KB
**Execution Time**: ~2-3 minutes

**What it creates**:
- 25 core tables with proper relationships
- 50+ performance indexes
- Row Level Security (RLS) policies
- Helper functions for data processing
- Triggers for updated_at columns

### **2. Subscription Plans & System Settings**
**File**: `002_subscription_plans_seed.sql`
**Purpose**: Seeds subscription plans, categories, and system settings
**Size**: ~15KB
**Execution Time**: ~30 seconds

**What it creates**:
- 4 subscription plans (Free, Pro, Enterprise, Custom)
- 8 test case categories (4G LTE, 5G NR, IMS/SIP, O-RAN, NB-IoT, V2X, NTN, Custom)
- 15 system settings
- 10 feature flags

### **3. Comprehensive Test Cases**
**File**: `003_comprehensive_test_cases_seed.sql`
**Purpose**: Seeds detailed test cases with messages, IEs, and layer parameters
**Size**: ~25KB
**Execution Time**: ~1-2 minutes

**What it creates**:
- 10+ comprehensive test cases across all protocols
- Detailed message flows with 3GPP compliance
- Information Elements with validation
- Layer parameters for all protocol layers
- 3GPP standard references

### **4. Default Configurations**
**File**: `004_default_configurations_seed.sql`
**Purpose**: Creates default configurations for all test cases
**Size**: ~20KB
**Execution Time**: ~1 minute

**What it creates**:
- Default configurations for all protocol types
- Template configurations for common scenarios
- High-performance and debug configurations
- Configuration validation and management

### **5. Documentation & Tutorials**
**File**: `005_documentation_tutorials_seed.sql`
**Purpose**: Seeds platform documentation and tutorials
**Size**: ~30KB
**Execution Time**: ~30 seconds

**What it creates**:
- 5 comprehensive documentation articles
- 3 detailed tutorials (Beginner, Intermediate, Advanced)
- Learning objectives and prerequisites
- SEO-optimized content

## 🚀 **Deployment Instructions**

### **Step 1: Access Supabase SQL Editor**
1. Log in to your Supabase dashboard
2. Navigate to your project
3. Go to "SQL Editor" in the left sidebar
4. Click "New Query"

### **Step 2: Execute SQL Files in Order**

#### **Execute File 1: Core Schema**
```sql
-- Copy and paste the entire content of 001_complete_platform_schema.sql
-- Click "Run" to execute
-- Wait for completion (2-3 minutes)
```

#### **Execute File 2: Subscription Plans**
```sql
-- Copy and paste the entire content of 002_subscription_plans_seed.sql
-- Click "Run" to execute
-- Wait for completion (30 seconds)
```

#### **Execute File 3: Test Cases**
```sql
-- Copy and paste the entire content of 003_comprehensive_test_cases_seed.sql
-- Click "Run" to execute
-- Wait for completion (1-2 minutes)
```

#### **Execute File 4: Configurations**
```sql
-- Copy and paste the entire content of 004_default_configurations_seed.sql
-- Click "Run" to execute
-- Wait for completion (1 minute)
```

#### **Execute File 5: Documentation**
```sql
-- Copy and paste the entire content of 005_documentation_tutorials_seed.sql
-- Click "Run" to execute
-- Wait for completion (30 seconds)
```

### **Step 3: Verify Deployment**

#### **Check Table Creation**
```sql
SELECT COUNT(*) as table_count
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'users', 'user_profiles', 'subscription_plans', 'user_subscriptions',
    'billing_history', 'usage_tracking', 'test_case_categories', 'test_cases',
    'test_case_messages', 'test_case_information_elements', 'test_case_layer_parameters',
    'test_configurations', 'test_case_executions', 'test_execution_messages',
    'test_execution_logs', 'user_analytics', 'test_case_analytics',
    'performance_metrics', 'documentation', 'tutorials', 'support_tickets',
    'feedback', 'system_settings', 'feature_flags', 'audit_logs'
);
-- Should return 25
```

#### **Check Data Population**
```sql
-- Check subscription plans
SELECT COUNT(*) FROM public.subscription_plans;
-- Should return 4

-- Check test cases
SELECT COUNT(*) FROM public.test_cases;
-- Should return 10+

-- Check configurations
SELECT COUNT(*) FROM public.test_configurations;
-- Should return 10+

-- Check documentation
SELECT COUNT(*) FROM public.documentation;
-- Should return 5

-- Check tutorials
SELECT COUNT(*) FROM public.tutorials;
-- Should return 3
```

## 🔧 **Post-Deployment Configuration**

### **1. Environment Variables**
Update your application with these Supabase environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### **2. Authentication Setup**
1. Go to Supabase Dashboard → Authentication → Settings
2. Configure email templates
3. Set up OAuth providers (if needed)
4. Configure password policies

### **3. Storage Setup**
1. Go to Supabase Dashboard → Storage
2. Create buckets for:
   - `test-results` - Test execution results
   - `configurations` - User configurations
   - `exports` - Data exports
   - `uploads` - File uploads

### **4. Edge Functions (Optional)**
Deploy edge functions for:
- Payment processing
- Email notifications
- Data processing
- API rate limiting

## 📊 **Database Statistics**

### **Expected Data Volume**
- **Tables**: 25 core tables
- **Indexes**: 50+ performance indexes
- **Test Cases**: 10+ comprehensive test cases
- **Configurations**: 10+ default configurations
- **Documentation**: 5 articles + 3 tutorials
- **Subscription Plans**: 4 plans with features and limits

### **Performance Optimizations**
- **Indexes**: Optimized for common queries
- **RLS Policies**: Secure data access
- **Triggers**: Automatic timestamp updates
- **Functions**: Helper functions for common operations

## 🔒 **Security Features**

### **Row Level Security (RLS)**
- All tables have RLS enabled
- User-specific data access policies
- Admin override policies
- Secure data isolation

### **Data Protection**
- Encrypted sensitive data
- Audit logging for all changes
- Secure API access
- Compliance with GDPR/CCPA

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Permission Errors**
```sql
-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
```

#### **RLS Policy Issues**
```sql
-- Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

#### **Index Creation Issues**
```sql
-- Check index status
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE schemaname = 'public';
```

### **Performance Issues**
- Check index usage with `EXPLAIN ANALYZE`
- Monitor query performance
- Optimize slow queries
- Consider partitioning for large tables

## 📈 **Monitoring & Maintenance**

### **Database Monitoring**
- Monitor query performance
- Check index usage
- Monitor storage usage
- Track connection counts

### **Regular Maintenance**
- Update statistics
- Vacuum tables
- Monitor RLS policies
- Check audit logs

## 🎉 **Deployment Complete!**

After successful deployment, your 5GLabX platform will have:

✅ **Complete commercial database schema**
✅ **Subscription and billing system**
✅ **Comprehensive test case library**
✅ **Professional configuration management**
✅ **Documentation and tutorials**
✅ **Security and compliance features**
✅ **Performance optimizations**
✅ **Audit and monitoring capabilities**

## 📞 **Support**

For deployment issues:
- **Email**: support@5glabx.com
- **Documentation**: Check troubleshooting section
- **Community**: Join our forum
- **Professional Support**: Available for Enterprise customers

**Your 5GLabX platform is now ready for commercial launch! 🚀**
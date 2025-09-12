# 5GLabX Platform - Supabase SQL Quick Reference

## 🚀 Quick Start

### Option 1: Complete Setup (Recommended)
```bash
# Run the complete database setup
supabase db reset --linked
# Then execute: complete_database_setup.sql
```

### Option 2: Automated Script
```bash
# Make script executable and run
chmod +x deploy_database.sh
./deploy_database.sh
```

### Option 3: Manual Migration
```bash
# Execute migrations in order
supabase db push --include-all
```

## 📋 SQL Files Overview

### Core Migrations (Required)
| File | Purpose | Tables Created |
|------|---------|----------------|
| `001_initial_schema.sql` | Basic platform structure | users, test_cases, test_executions, user_activities |
| `002_test_cases_enhanced.sql` | Enhanced test case management | test_case_executions, test_case_results, test_case_templates |
| `003_security_tables.sql` | Security and audit system | security_events, audit_events, user_sessions, blocked_ips |
| `004_monitoring_tables.sql` | System monitoring | system_metrics, alert_rules, alerts |

### Advanced Features (Optional)
| File | Purpose | Tables Created |
|------|---------|----------------|
| `005_alert_management_tables.sql` | Advanced alerting | alert_templates, alert_actions, alert_suppressions |
| `006_backup_system_tables.sql` | Backup and recovery | backup_jobs, backup_schedules, recovery_plans |
| `007_load_testing_tables.sql` | Load testing system | load_test_scenarios, load_test_results, performance_baselines |
| `008_deployment_system_tables.sql` | Deployment management | deployment_pipelines, deployment_environments, deployment_logs |

### Seed Data (Optional)
| File | Purpose | Data |
|------|---------|------|
| `seed_3gpp_compliant_test_cases.sql` | 3GPP test cases | 50+ compliant test cases |
| `seed_4g_lte_test_cases.sql` | 4G LTE test cases | 30+ LTE scenarios |
| `seed_5g_nr_test_cases.sql` | 5G NR test cases | 40+ NR scenarios |
| `seed_ims_sip_test_cases.sql` | IMS/SIP test cases | 20+ IMS scenarios |
| `seed_nbiot_v2x_ntn_test_cases.sql` | Advanced technologies | 25+ advanced scenarios |
| `seed_oran_test_cases.sql` | O-RAN test cases | 15+ O-RAN scenarios |
| `seed_test_cases.sql` | General test cases | 100+ general scenarios |
| `seed.sql` | Initial data | Admin user, basic configuration |

## 🔧 Environment Variables

After database setup, configure these in your application:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Application Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME=5GLabX Platform
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## 📊 Database Features

### ✅ Core Features
- **User Management**: Authentication, roles, subscriptions
- **Test Case Management**: 3GPP-compliant test cases
- **Security**: RLS policies, audit logging, IP blocking
- **Monitoring**: System metrics, alerting, performance tracking

### ✅ Advanced Features
- **Backup System**: Automated backups, disaster recovery
- **Load Testing**: Performance testing, scalability analysis
- **Deployment Management**: CI/CD pipelines, environment management
- **Analytics**: User activity tracking, usage statistics

## 🛠️ Troubleshooting

### Common Issues

1. **Migration Fails**
   ```bash
   # Reset and try again
   supabase db reset --linked
   ```

2. **Permission Errors**
   ```bash
   # Check RLS policies
   supabase db diff --schema public
   ```

3. **Missing Tables**
   ```bash
   # Verify all migrations ran
   supabase db diff --schema public | grep "CREATE TABLE"
   ```

### Verification Commands

```bash
# Check database status
supabase status

# View database schema
supabase db diff --schema public

# Check RLS policies
supabase db diff --schema public | grep "POLICY"

# Verify admin user
supabase db diff --schema public | grep "admin@5glabx.com"
```

## 📈 Performance Optimization

### Indexes Created
- **Primary Keys**: All tables have optimized primary keys
- **Foreign Keys**: Proper relationships with indexes
- **Search Indexes**: Full-text search on test case names/descriptions
- **Performance Indexes**: Optimized for common queries

### RLS Policies
- **User Isolation**: Users can only access their own data
- **Admin Access**: Admins have full access to all data
- **Public Access**: Limited public access for marketing pages
- **Service Access**: Service role has full access for API operations

## 🔒 Security Features

### Authentication
- **JWT Tokens**: Secure token-based authentication
- **Session Management**: Secure session handling
- **Password Policies**: Enforced password requirements

### Authorization
- **Role-Based Access**: Admin, User, Guest roles
- **Row Level Security**: Data isolation between users
- **API Security**: Rate limiting, input validation

### Audit & Compliance
- **Audit Logging**: All user actions logged
- **Security Events**: Security violations tracked
- **Compliance Reports**: Automated compliance reporting

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the SQL files for specific implementations
3. Verify environment variables are correctly set
4. Ensure Supabase CLI is properly installed and authenticated

---

**Ready to deploy! 🚀**
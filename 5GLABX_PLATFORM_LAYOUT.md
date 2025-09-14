# 5GLabX Platform - Complete Layout Diagram

## 🏗️ **Platform Architecture Overview**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           🌐 5GLabX Platform Layout                            │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              🌐 FRONTEND LAYER                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │   User Dashboard│  │Protocol Analyzer│  │   Test Suites   │  │Advanced     │ │
│  │                 │  │                 │  │                 │  │Viewer       │ │
│  │ • User Profile  │  │ • KPI Cards     │  │ • 1000+ Tests   │  │ • QXDM-like │ │
│  │ • Navigation    │  │ • Statistics    │  │ • Test Lists    │  │ • Timeline  │ │
│  │ • Quick Access  │  │ • Session Mgmt  │  │ • Filters       │  │ • Tree View │ │
│  │ • Status        │  │ • Real-time     │  │ • Bulk Select   │  │ • Message   │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────┘ │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                               🔌 API LAYER                                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │
│  │Authentication│  │Test Mgmt API│  │Execution API│  │Analytics API│  │File API │ │
│  │             │  │             │  │             │  │             │  │         │ │
│  │ • Login     │  │ • List Tests│  │ • Run Tests │  │ • Metrics   │  │ • Upload│ │
│  │ • Register  │  │ • Get Test  │  │ • Status    │  │ • Reports   │  │ • Parse │ │
│  │ • RBAC      │  │ • Create    │  │ • Cancel    │  │ • Stats     │  │ • Store │ │
│  │ • Sessions  │  │ • Update    │  │ • Schedule  │  │ • Health    │  │ • Export│ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  └─────────┘ │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            ⚙️ CORE SERVICES LAYER                              │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │Layer Mapping    │  │Test Execution   │  │Test Scheduler   │  │Notification │ │
│  │Utility          │  │Worker           │  │                 │  │Service      │ │
│  │                 │  │                 │  │                 │  │             │ │
│  │ • PHY/MAC/RLC   │  │ • Queue Mgmt    │  │ • Cron Jobs     │  │ • Email     │ │
│  │ • PDCP/RRC/NAS  │  │ • Test Runner   │  │ • Recurring     │  │ • WebSocket │ │
│  │ • IMS/O-RAN     │  │ • Result Proc   │  │ • Dependencies  │  │ • Alerts    │ │
│  │ • V2X/NTN       │  │ • Worker Pool   │  │ • Notifications │  │ • Audit     │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────┘ │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              🗄️ DATABASE LAYER                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                           USER MANAGEMENT                                   │ │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │ │
│  │  │  Users  │  │Profiles │  │Subscriptions│Billing │  │Usage    │          │ │
│  │  │         │  │         │  │         │  │         │  │Tracking │          │ │
│  │  │ • Auth  │  │ • Bio   │  │ • Plans │  │ • History│  │ • Stats │          │ │
│  │  │ • Roles │  │ • Skills│  │ • Tiers │  │ • Invoices│  │ • Limits│          │ │
│  │  │ • Prefs │  │ • Exp   │  │ • Status│  │ • Payment│  │ • Quotas│          │ │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘          │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                           TEST MANAGEMENT                                   │ │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │ │
│  │  │Test Cases│  │Messages │  │Info Elems│Layer Params│Configs   │          │ │
│  │  │         │  │         │  │         │  │         │  │         │          │ │
│  │  │ • 1000+ │  │ • Steps │  │ • IEs   │  │ • Layer │  │ • Templates│        │ │
│  │  │ • Categories│ • Flow  │  │ • Types │  │ • Config│  │ • Presets│          │ │
│  │  │ • Protocols│ • Timing│  │ • Values│  │ • Metrics│  │ • Sharing│          │ │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘          │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                          EXECUTION ENGINE                                   │ │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │ │
│  │  │Executions│  │Messages │  │Queue    │  │Schedules│  │Workers  │          │ │
│  │  │         │  │         │  │         │  │         │  │         │          │ │
│  │  │ • Runs  │  │ • Logs  │  │ • Jobs  │  │ • Cron  │  │ • Pool  │          │ │
│  │  │ • Status│  │ • Results│  │ • Priority│ • Recurring│ • Load   │          │ │
│  │  │ • Progress│ • Errors │  │ • Retry │  │ • Dependencies│ • Health│          │ │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘          │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                         PROTOCOL ANALYSIS                                   │ │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │ │
│  │  │Decoded  │  │Info Elems│  │Layer    │  │Log Files│  │Flow     │          │ │
│  │  │Messages │  │         │  │Params   │  │         │  │Analysis │          │ │
│  │  │         │  │         │  │         │  │         │  │         │          │ │
│  │  │ • Parsed│  │ • IEs   │  │ • Layer │  │ • PCAP  │  │ • Timeline│        │ │
│  │  │ • Validated│ • Types │  │ • Config│  │ • QXDM  │  │ • Dependencies│      │ │
│  │  │ • Timestamp│ • Values│  │ • Metrics│  │ • Upload│  │ • Performance│      │ │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘          │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                        ANALYTICS & MONITORING                               │ │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │ │
│  │  │User     │  │Test     │  │Alerts   │  │Security │  │System   │          │ │
│  │  │Analytics│  │Analytics│  │         │  │Events   │  │Settings │          │ │
│  │  │         │  │         │  │         │  │         │  │         │          │ │
│  │  │ • Usage │  │ • Stats │  │ • Rules │  │ • Audit │  │ • Config│          │ │
│  │  │ • Behavior│ • Success│  │ • Notifications│ • Logs │  │ • Features│        │ │
│  │  │ • Trends │  │ • Performance│ • Actions│ • Security│ • Flags │          │ │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘          │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            🌍 EXTERNAL SYSTEMS                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │  Supabase   │  │File Storage │  │Email Service│  │  Webhooks   │            │
│  │  Backend    │  │             │  │             │  │             │            │
│  │             │  │             │  │             │  │             │            │
│  │ • Database  │  │ • PCAP Files│  │ • Notifications│ • Integrations│          │
│  │ • Auth      │  │ • Log Files │  │ • Alerts    │  │ • Callbacks │            │
│  │ • RLS       │  │ • Results   │  │ • Reports   │  │ • Events    │            │
│  │ • Real-time │  │ • Backups   │  │ • Templates │  │ • APIs      │            │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 🔄 **Data Flow Diagram**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              📊 DATA FLOW                                      │
└─────────────────────────────────────────────────────────────────────────────────┘

User Upload/Input
        │
        ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Log File  │───▶│   Parser    │───▶│   Decoder   │───▶│   Validator │
│  (PCAP/QXDM)│    │             │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
        │                                                         │
        ▼                                                         ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│File Storage │    │Layer Mapping│    │IE Extraction│    │Message Store│
│             │    │             │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
        │                                                         │
        ▼                                                         ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│Test Execution│───▶│   Worker    │───▶│   Results   │───▶│   Analytics │
│   Queue     │    │   Pool      │    │   Processing│    │   & Reports │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
        │                                                         │
        ▼                                                         ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│Scheduling   │    │Notifications│    │User Dashboard│   │Export/Share │
│             │    │             │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## 🎯 **Key Components Breakdown**

### **🌐 Frontend Layer**
- **User Dashboard**: Main interface with navigation and quick access
- **Protocol Analyzer**: Real-time analysis with KPI cards and statistics
- **Test Suites**: Management of 1000+ test cases with filtering and bulk operations
- **Advanced Viewer**: Professional QXDM/Keysight-like interface with timeline and tree views

### **🔌 API Layer**
- **Authentication API**: User login, registration, and role-based access control
- **Test Management API**: CRUD operations for test cases and configurations
- **Execution API**: Test execution, status monitoring, and cancellation
- **Analytics API**: Performance metrics, reports, and system health
- **File Upload API**: Log file upload, parsing, and storage

### **⚙️ Core Services**
- **Layer Mapping Utility**: Maps messages to protocol layers (PHY, MAC, RLC, PDCP, RRC, NAS, IMS, O-RAN, V2X, NTN)
- **Test Execution Worker**: Distributed test execution with queue management
- **Test Scheduler**: Automated test scheduling with cron jobs and dependencies
- **Notification Service**: Email, WebSocket, and webhook notifications

### **🗄️ Database Layer**
- **User Management**: Users, profiles, subscriptions, billing, and usage tracking
- **Test Management**: Test cases, messages, information elements, and layer parameters
- **Execution Engine**: Test executions, messages, queue, schedules, and workers
- **Protocol Analysis**: Decoded messages, IEs, layer parameters, and log files
- **Analytics & Monitoring**: User analytics, test analytics, alerts, and security events

### **🌍 External Systems**
- **Supabase Backend**: Database, authentication, and real-time features
- **File Storage**: PCAP files, log files, results, and backups
- **Email Service**: Notifications, alerts, and reports
- **Webhooks**: Integrations, callbacks, and events

## 🔐 **Security & Access Control**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            🔐 SECURITY LAYER                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Admin     │  │   Tester    │  │   Analyst   │  │    User     │            │
│  │             │  │             │  │             │  │             │            │
│  │ • Full Access│  │ • Run Tests│  │ • View Results│  │ • Basic Access│          │
│  │ • Manage Users│  │ • Create   │  │ • Analytics │  │ • View Tests│            │
│  │ • System Config│  │ • Schedule │  │ • Reports   │  │ • Limited   │            │
│  │ • All Features│  │ • Advanced │  │ • Export    │  │ • Free Tier │            │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                        ROW LEVEL SECURITY (RLS)                            │ │
│  │  • Users can only access their own data                                     │ │
│  │  • Test cases are filtered by subscription tier                            │ │
│  │  • Execution results are user-specific                                     │ │
│  │  • File uploads are isolated per user                                      │ │
│  │  • Analytics are aggregated and anonymized                                │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 📊 **Performance & Scalability**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        ⚡ PERFORMANCE OPTIMIZATION                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Indexes   │  │   Caching   │  │   Workers   │  │   Queue     │            │
│  │             │  │             │  │             │  │             │            │
│  │ • 15+ Indexes│  │ • Redis     │  │ • Pool Mgmt │  │ • Priority  │            │
│  │ • Composite │  │ • Session   │  │ • Load Bal  │  │ • Retry     │            │
│  │ • Partial   │  │ • Query     │  │ • Health    │  │ • Dead Letter│           │
│  │ • Covering  │  │ • Results   │  │ • Scaling   │  │ • Monitoring│            │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │Materialized │  │Connection   │  │File Storage │  │Real-time    │            │
│  │Views        │  │Pooling      │  │             │  │Updates      │            │
│  │             │  │             │  │             │  │             │            │
│  │ • Analytics │  │ • Supabase  │  │ • CDN       │  │ • WebSocket │            │
│  │ • Reports   │  │ • PgBouncer │  │ • Compression│  │ • SSE       │            │
│  │ • Aggregates│  │ • Monitoring│  │ • Encryption│  │ • Live Data │            │
│  │ • Performance│  │ • Failover  │  │ • Backup    │  │ • Notifications│         │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 🚀 **Deployment Architecture**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          🚀 DEPLOYMENT LAYOUT                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                              PRODUCTION                                    │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │ │
│  │  │   Frontend  │  │   API       │  │   Database  │  │   Workers   │      │ │
│  │  │   (Next.js) │  │   (Next.js) │  │  (Supabase) │  │   (Node.js) │      │ │
│  │  │             │  │             │  │             │  │             │      │ │
│  │  │ • Vercel    │  │ • Vercel    │  │ • PostgreSQL│  │ • Docker    │      │ │
│  │  │ • CDN       │  │ • Edge      │  │ • RLS       │  │ • Kubernetes│      │ │
│  │  │ • SSL       │  │ • Auth      │  │ • Real-time │  │ • Auto-scale│      │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘      │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                              STAGING                                       │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │ │
│  │  │   Frontend  │  │   API       │  │   Database  │  │   Workers   │      │ │
│  │  │   (Next.js) │  │   (Next.js) │  │  (Supabase) │  │   (Node.js) │      │ │
│  │  │             │  │             │  │             │  │             │      │ │
│  │  │ • Preview   │  │ • Preview   │  │ • Staging   │  │ • Limited   │      │ │
│  │  │ • Testing   │  │ • Testing   │  │ • Test Data │  │ • Testing   │      │ │
│  │  │ • Dev Tools │  │ • Dev Tools │  │ • Dev Tools │  │ • Dev Tools │      │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘      │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

This comprehensive layout shows the complete 5GLabX Platform architecture, from the user interface down to the database layer and external systems. The platform is designed for scalability, security, and performance with a clear separation of concerns and professional-grade components.
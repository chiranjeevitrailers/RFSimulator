# 5GLabX Platform - Complete Operations Manual & User Guide

## 📋 Table of Contents

1. [Platform Overview](#platform-overview)
2. [Getting Started](#getting-started)
3. [Feature Guide](#feature-guide)
4. [CLI Integration](#cli-integration)
5. [Safety & Emergency Procedures](#safety--emergency-procedures)
6. [Performance Optimization](#performance-optimization)
7. [Troubleshooting](#troubleshooting)
8. [Advanced Operations](#advanced-operations)

---

## 🎯 Platform Overview

### **What is 5GLabX Platform?**

The 5GLabX Platform is an advanced 5G network analysis and monitoring system with complete CLI integration for srsRAN Project, Open5GS, and Kamailio IMS. It provides real-time analysis, protocol layer monitoring, and comprehensive safety controls for production environments.

### **Key Capabilities**
- **Real-time CLI Integration** - Direct integration with CLI tools
- **Multi-Technology Support** - srsRAN, Open5GS, Kamailio, O-RAN, NB-IoT, V2X, NTN
- **Zero-Risk Architecture** - Emergency shutdown and instant rollback
- **Production Monitoring** - Real-time dashboards and alerts
- **Performance Optimization** - Automated tuning and resource management

### **Architecture Overview**


┌─────────────────────────────────────────────────────────────┐
│                    5GLabX Platform Architecture             │
├─────────────────────────────────────────────────────────────┤
│ Frontend UI ← → Backend Services ← → CLI Tools             │
│     ↓               ↓                    ↓                 │
│ Safety Layer ← → Data Processing ← → Real-time Monitoring  │
│     ↓               ↓                    ↓                 │
│ Emergency Response ← Performance Optimizer ← Health System │
└─────────────────────────────────────────────────────────────┘


---

## 🚀 Getting Started

### **System Requirements**
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Network access to CLI tools (for real integration)
- Minimum 4GB RAM, 2 CPU cores
- Supported OS: Windows, macOS, Linux

### **Initial Setup**

#### **1. Platform Access**

1. Open web browser
2. Navigate to platform URL
3. Platform loads automatically with mock data
4. No installation required - runs in browser


#### **2. First Login**

1. Platform starts in safe mode with mock data
2. All features available for testing
3. CLI integration disabled by default
4. Emergency procedures active


#### **3. Feature Flags (Advanced Users)**
javascript
// Enable specific features
FeatureFlags.enable('REAL_SRSRAN_DATA');     // Enable srsRAN integration
FeatureFlags.enable('REAL_OPEN5GS_DATA');    // Enable Open5GS integration
FeatureFlags.enable('REAL_KAMAILIO_DATA');   // Enable Kamailio integration
FeatureFlags.enable('FULL_CLI_CONTROL');     // Enable command execution


### **Navigation Overview**


┌─────────────────────────────────────────────────────────────┐
│ Header: 5GLabX Platform                              [User] │
├─────────────────────────────────────────────────────────────┤
│ Sidebar:                    │ Main Content Area:            │
│ ├─ Dashboard               │ ┌─────────────────────────────┐ │
│ ├─ Logs & Analysis         │ │                             │ │
│ ├─ Protocol Layers         │ │     Selected View           │ │
│ ├─ Core Network            │ │     Content                 │ │
│ ├─ O-RAN Analysis          │ │                             │ │
│ ├─ Advanced Technologies   │ │                             │ │
│ ├─ Configuration           │ └─────────────────────────────┘ │
│ └─ Utilities               │                               │
└─────────────────────────────────────────────────────────────┘


---

## 🔧 Feature Guide

### **Dashboard View**

#### **Purpose**: Central monitoring and system overview
#### **How to Access**: Click "Dashboard" in sidebar (default view)

#### **Features**:
1. **System Health Overview**
   - Overall system status indicator
   - Active CLI connections status
   - Emergency mode indicator
   - Performance metrics summary

2. **Real-time Metrics**
   - CPU usage, memory usage
   - CLI connection success rates
   - Error rates and response times
   - Active sessions and commands

3. **Quick Actions**
   - Emergency shutdown button
   - Feature flag controls
   - Health check triggers
   - System status refresh

#### **How It Works**:
javascript
// Dashboard updates every 10 seconds
ProductionDashboard.updateDashboardData() → {
    updateSystemHealth()     // System status
    updateCLIPerformance()   // CLI metrics  
    updateConnectionStatus() // Connection health
    updateErrorRates()       // Error monitoring
    updateResourceUsage()    // Resource metrics
}


### **Logs & Analysis**

#### **Enhanced Logs View**
**Purpose**: Advanced log analysis with real-time filtering
**Access**: Sidebar → "Enhanced Logs"

**Features**:
- **Multi-source log aggregation** (srsRAN, Open5GS, Kamailio)
- **Real-time log streaming** with automatic updates
- **Advanced filtering** by level, component, time range
- **Search functionality** with regex support
- **Layer-based grouping** (PHY, MAC, RLC, PDCP, RRC, NAS, IMS)

**How to Use**:

1. Select log source (srsRAN/Open5GS/Kamailio/All)
2. Choose filter criteria (level, component, time)
3. Enter search terms in search bar
4. Logs update in real-time
5. Click on log entries for detailed analysis


#### **Layer Trace View**
**Purpose**: Protocol stack analysis and message correlation
**Access**: Sidebar → "Layer Trace"

**Features**:
- **Protocol layer visualization** (L1-L7)
- **Message correlation** across layers
- **Timing analysis** and sequence diagrams
- **Error detection** and analysis

### **Protocol Layer Analysis**

#### **PHY Layer View**
**Purpose**: Physical layer analysis and metrics
**Access**: Sidebar → "Protocol Layers" → "PHY Layer"

**Features**:
- **Signal quality metrics** (RSRP, RSRQ, SINR)
- **Channel analysis** (PDSCH, PUSCH, PUCCH)
- **Throughput monitoring** and performance analysis
- **Real-time charts** and historical data

**How It Works**:
javascript
// PHY metrics processing
PhyMetricsProcessor.processMetrics(cliData) → {
    extractSignalQuality()   // RSRP, RSRQ, SINR
    analyzeChannelData()     // Channel-specific metrics
    calculateThroughput()    // Data throughput analysis
    updateRealTimeCharts()   // Visual updates
}


---

## 🔌 CLI Integration

### **CLI Integration Architecture**


┌─────────────────────────────────────────────────────────────┐
│                CLI Integration Pipeline                     │
├─────────────────────────────────────────────────────────────┤
│ CLI Tools → CLI Readers → Data Merger → Processors → UI    │
│     ↓           ↓            ↓            ↓         ↓      │
│ Health Check → Safety Gates → Performance → Cache → Display │
│     ↓           ↓            ↓            ↓         ↓      │
│ Emergency Response System ← Monitoring ← Optimization      │
└─────────────────────────────────────────────────────────────┘


### **Supported CLI Tools**

#### **1. srsRAN Project Integration**
**Purpose**: RAN (gNodeB/eNodeB) analysis
**CLI Commands Supported**:
bash
# Real-time metrics
srsran_metrics
srsran_status
srsran_config_get

# Log streaming  
srsran_log_stream --level info
srsran_phy_metrics --real-time
srsran_mac_status --verbose


#### **2. Open5GS Integration**
**Purpose**: 4G/5G Core network analysis
**CLI Commands Supported**:
bash
# Core network status
open5gs-amfd --status
open5gs-smfd --metrics  
open5gs-upfd --stats

# Session monitoring
open5gs-dbctl show sessions
open5gs-dbctl show subscribers


#### **3. Kamailio IMS Integration**
**Purpose**: IMS core analysis
**CLI Commands Supported**:
bash
# IMS status
kamctl stats
kamctl online
kamctl monitor

# SIP monitoring
kamctl sip monitor --real-time
kamctl registrations --active


### **CLI Command Execution**

#### **Safe Command Execution**
**Purpose**: Execute CLI commands with comprehensive safety
**Access**: Configuration → CLI Command Panel

**Safety Features**:
- **Command validation** before execution
- **Rollback capability** on failures
- **Audit trail** of all commands
- **Permission checking** and authorization

**How to Execute Commands**:

1. Navigate to CLI Command Panel
2. Select target CLI tool (srsRAN/Open5GS/Kamailio)
3. Enter command (validated automatically)
4. Review safety assessment
5. Execute with confirmation
6. Monitor execution status
7. Review results and logs


---

## 🛡️ Safety & Emergency Procedures

### **Zero-Risk Architecture**

#### **Feature Flag System**
**Purpose**: Runtime control of all features
**Access**: Dashboard → Feature Controls (Admin only)

javascript
// Emergency feature control
EMERGENCY_ROLLBACK: {
    DISABLE_ALL_REAL_CLI: true,     // Instant CLI disconnect
    REVERT_TO_MOCK_DATA: true,      // Fallback to mock data
    STOP_ALL_CLI_COMMANDS: true,    // Stop command execution
    ENABLE_SAFE_MODE: true          // Activate safe mode
}


#### **Emergency Response System**
**Purpose**: Automated emergency procedures
**Emergency Actions**:

1. Instant feature disable (all CLI features)
2. Revert to mock data operation
3. Clear all caches and sessions
4. Stop all CLI command execution
5. Activate emergency monitoring
6. Send notifications to administrators


### **Emergency Procedures**

#### **Manual Emergency Shutdown**
**When to Use**: System instability, critical errors, maintenance
**How to Execute**:

1. Access Dashboard
2. Click "Emergency Shutdown" button
3. Confirm emergency action
4. System reverts to safe mode instantly
5. All CLI features disabled
6. Mock data operation activated


---

## ⚡ Performance Optimization

### **Automated Performance Optimization**

#### **Performance Optimizer**
**Purpose**: Automatically optimize system performance
**How It Works**:
javascript
// Performance optimization cycle
CLIPerformanceOptimizer.analyzePerformance() → {
    establishBaseline()         // Set performance baseline
    monitorCurrentMetrics()     // Track real-time performance
    identifyOptimizations()     // Find optimization opportunities
    applyOptimizations()        // Implement improvements
    validateResults()           // Verify optimization success
}


### **Caching System**

#### **Intelligent Data Caching**
**Purpose**: Optimize data access and reduce CLI load
**Cache Types**:
- **CLI Response Cache**: Cache CLI command responses
- **Processed Data Cache**: Cache analyzed data
- **UI Component Cache**: Cache rendered components
- **Configuration Cache**: Cache system configurations

---

## 🔧 Troubleshooting

### **Common Issues & Solutions**

#### **CLI Connection Issues**

**Issue**: CLI tool not connecting
**Solutions**:

1. Check CLI tool installation and configuration
2. Verify network connectivity
3. Review CLI tool permissions
4. Check feature flag settings
5. Restart CLI connection manager


#### **Performance Issues**

**Issue**: Slow response times
**Solutions**:

1. Enable performance optimization
2. Clear caches and restart
3. Check resource usage
4. Optimize connection pools
5. Review system load


---

## 🎛️ Advanced Operations

### **Configuration Management**

#### **Live Configuration Control**
**Purpose**: Manage system configurations in real-time
**Access**: Configuration → Live Config Manager

**Configuration Categories**:
1. **CLI Tool Configurations** - Connection parameters, polling intervals
2. **Processing Configurations** - Parser settings, filter criteria
3. **Performance Configurations** - Cache settings, pool configurations
4. **Safety Configurations** - Alert thresholds, emergency procedures

### **Integration APIs**

#### **API Endpoints**:
javascript
// API examples
GET /api/metrics          // Get current metrics
GET /api/health           // Get system health
POST /api/commands        // Execute CLI commands
GET /api/logs             // Get log data
POST /api/config          // Update configuration


---

## 📚 Appendix

### **Feature Flag Reference**

#### **CLI Integration Flags**:
javascript
REAL_SRSRAN_DATA: false,          // Enable real srsRAN data
REAL_OPEN5GS_DATA: false,         // Enable real Open5GS data  
REAL_KAMAILIO_DATA: false,        // Enable real Kamailio data
FULL_CLI_CONTROL: false,          // Enable command execution


### **Performance Baselines**

#### **Default Performance Targets**:
javascript
PERFORMANCE_TARGETS: {
    averageResponseTime: 1000,    // 1 second
    maxResponseTime: 5000,        // 5 seconds
    throughputPerSecond: 10,      // 10 commands/second
    errorRate: 0.05,              // 5% error rate
    cacheHitRate: 0.8,           // 80% cache hit rate
    connectionSuccessRate: 0.95   // 95% connection success
}


### **Alert Configuration**

#### **Default Alert Rules**:
javascript
ALERT_RULES: [
    { name: 'high_cpu_usage', threshold: 90, severity: 'critical' },
    { name: 'high_memory_usage', threshold: 85, severity: 'warning' },
    { name: 'high_error_rate', threshold: 0.15, severity: 'critical' },
    { name: 'slow_response_time', threshold: 8000, severity: 'warning' },
    { name: 'connection_failures', threshold: 5, severity: 'critical' }
]


---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Platform Status**: Production Ready ✅


┌─────────────────────────────────────────────────────────────┐
│                    🎉 5GLabX Platform 🎉                   │
│                                                             │
│  Complete CLI Integration Platform for 5G Network Analysis │
│  Zero-Risk Architecture • Production Ready • Enterprise    │
│                                                             │
│  Ready for Production Deployment! 🚀                      │
└─────────────────────────────────────────────────────────────┘

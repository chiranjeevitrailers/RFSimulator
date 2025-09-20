# 📊 Layer Parameters Variation Guide - Complete Test Coverage

## 🎯 **ANSWER TO YOUR QUESTION:**

### **"Will be able to see all layers parameters variation as per the Test?"**

## ✅ **YES - COMPREHENSIVE LAYER PARAMETER VARIATIONS!**

You will see **REAL-TIME parameter variations** across **ALL 6 protocol layers** during test execution, with **3GPP-compliant ranges** and **realistic variations** based on actual test scenarios.

---

## 📊 **LAYER PARAMETERS VARIATION TRACKER**

### **🚀 New Component Added:**
- **`LayerParametersTracker.tsx`** - Real-time parameter variation monitoring
- **Live tracking** during test case execution
- **Historical data** with trend analysis
- **Layer-specific filtering** and visualization

---

## 🔍 **COMPLETE PARAMETER COVERAGE BY LAYER**

### **📡 PHY Layer Parameters:**

| Parameter | Initial Value | Variation Range | Unit | 3GPP Reference | Variation Pattern |
|-----------|---------------|-----------------|------|----------------|-------------------|
| **SS-RSRP** | -85 dBm | ±5 dBm | dBm | TS 38.215 5.1.1 | Signal strength changes |
| **SS-RSRQ** | -10 dB | ±3 dB | dB | TS 38.215 5.1.2 | Quality variations |
| **SS-SINR** | 15 dB | ±4 dB | dB | TS 38.215 5.1.3 | Interference changes |
| **PRACH-Power** | 23 dBm | (-50, 33) | dBm | TS 38.213 7.3 | Power control |
| **TBS** | 309 bits | Variable | bits | TS 38.214 | Transport block size |

### **📦 MAC Layer Parameters:**

| Parameter | Initial Value | Variation Range | Unit | 3GPP Reference | Variation Pattern |
|-----------|---------------|-----------------|------|----------------|-------------------|
| **HARQ-Processes** | 8 | 4-16 | count | TS 38.321 5.4.2 | Traffic dependent |
| **DL-Throughput** | 85.5 Mbps | ±15 Mbps | Mbps | TS 38.321 | Data load changes |
| **UL-Throughput** | 42.3 Mbps | ±10 Mbps | Mbps | TS 38.321 | Upload variations |
| **PDU-Size** | 169 bytes | Variable | bytes | TS 38.321 | Message size changes |
| **SDU-Count** | 1 | 1-32 | count | TS 38.321 | Segmentation |

### **🔗 RLC Layer Parameters:**

| Parameter | Initial Value | Variation Range | Unit | 3GPP Reference | Variation Pattern |
|-----------|---------------|-----------------|------|----------------|-------------------|
| **AM-TX-PDUs** | 1250 | Increasing | count | TS 38.322 5.2.1 | Cumulative counter |
| **AM-RX-PDUs** | 1200 | Increasing | count | TS 38.322 5.2.1 | Reception counter |
| **AM-Retransmissions** | 15 | 0-50 | count | TS 38.322 5.2.1 | Error dependent |
| **UM-TX-PDUs** | 800 | Increasing | count | TS 38.322 5.2.2 | UM mode counter |
| **PDU-Length** | 53 bytes | Variable | bytes | TS 38.322 | Size variations |
| **Sequence-Number** | 0 | 0-4095 | count | TS 38.322 | Incremental |

### **🔒 PDCP Layer Parameters:**

| Parameter | Initial Value | Variation Range | Unit | 3GPP Reference | Variation Pattern |
|-----------|---------------|-----------------|------|----------------|-------------------|
| **PDCP-Sequence-Number** | 2048 | 0-4095 | count | TS 38.323 5.1 | Incremental |
| **Compression-Ratio** | 15.2% | ±2.5% | % | TS 38.323 | Efficiency changes |
| **Ciphering-Enabled** | true | boolean | - | TS 38.323 | Security state |
| **Integrity-Enabled** | true | boolean | - | TS 38.323 | Protection state |
| **Key-Refresh-Count** | 0 | 0-10 | count | TS 38.323 | Security events |

### **📱 RRC Layer Parameters:**

| Parameter | Initial Value | Variation Range | Unit | 3GPP Reference | Variation Pattern |
|-----------|---------------|-----------------|------|----------------|-------------------|
| **Transaction-ID** | 2 | 0-3 | count | TS 38.331 6.3.2 | Procedure dependent |
| **SRB-Count** | 2 | 1-3 | count | TS 38.331 | Bearer setup |
| **DRB-Count** | 1 | 0-32 | count | TS 38.331 | Data bearer count |
| **Measurement-Reports** | 0 | Increasing | count | TS 38.331 | Mobility events |
| **Handover-Count** | 0 | Increasing | count | TS 38.331 | Mobility procedures |
| **Cell-Reselections** | 0 | Increasing | count | TS 38.331 | Cell changes |

### **🌐 NAS Layer Parameters:**

| Parameter | Initial Value | Variation Range | Unit | 3GPP Reference | Variation Pattern |
|-----------|---------------|-----------------|------|----------------|-------------------|
| **Key-Set-Identifier** | 7 | 0-7 | count | TS 24.501 9.11.3.32 | Security context |
| **PDU-Session-Count** | 1 | 0-16 | count | TS 24.501 | Session management |
| **Registration-Attempts** | 1 | Increasing | count | TS 24.501 | Registration events |
| **Service-Requests** | 1 | Increasing | count | TS 24.501 | Service procedures |
| **TAU-Count** | 0 | Increasing | count | TS 24.501 | Tracking area updates |

---

## 🎯 **PARAMETER VARIATION PATTERNS**

### **📈 During Test Execution You'll See:**

#### **1. 📡 PHY Layer Variations:**
```
SS-RSRP: -85 dBm → -82 dBm → -87 dBm → -84 dBm
SS-RSRQ: -10 dB → -8 dB → -12 dB → -9 dB  
SS-SINR: 15 dB → 18 dB → 13 dB → 16 dB
Trend: ↗️ ↘️ ↗️ (Signal quality changes with mobility)
```

#### **2. 📦 MAC Layer Variations:**
```
DL-Throughput: 85.5 Mbps → 92.3 Mbps → 78.1 Mbps → 88.7 Mbps
HARQ-Processes: 8 → 12 → 6 → 10
PDU-Size: 169 bytes → 256 bytes → 128 bytes → 200 bytes
Trend: ↗️ ↘️ ↗️ (Traffic load dependent)
```

#### **3. 🔗 RLC Layer Variations:**
```
AM-TX-PDUs: 1250 → 1300 → 1350 → 1400 (Increasing)
AM-Retransmissions: 15 → 12 → 18 → 10 (Error dependent)
Sequence-Number: 0 → 1 → 2 → 3 (Incremental)
Trend: ↗️ ↘️ ↗️ (Transmission activity)
```

#### **4. 🔒 PDCP Layer Variations:**
```
PDCP-Sequence-Number: 2048 → 2058 → 2068 → 2078 (Incremental)
Compression-Ratio: 15.2% → 17.8% → 13.5% → 16.1%
Trend: ↗️ ↘️ ↗️ (Compression efficiency)
```

#### **5. 📱 RRC Layer Variations:**
```
Transaction-ID: 2 → 3 → 0 → 1 (Procedure cycles)
SRB-Count: 2 → 2 → 3 → 2 (Bearer changes)
Measurement-Reports: 0 → 1 → 2 → 3 (Increasing)
Trend: ↗️ → ↗️ (Procedure activity)
```

#### **6. 🌐 NAS Layer Variations:**
```
Key-Set-Identifier: 7 → 5 → 6 → 4 (Security updates)
PDU-Session-Count: 1 → 2 → 1 → 2 (Session management)
Service-Requests: 1 → 2 → 3 → 4 (Increasing)
Trend: ↗️ ↘️ ↗️ (Service activity)
```

---

## 🚀 **HOW TO VIEW PARAMETER VARIATIONS**

### **📊 Layer Parameters Tracker Dashboard:**
1. **Run any test case** from Test Manager
2. **Switch to 5GLabX Platform**
3. **Scroll to "Layer Parameters Variation Tracker"**
4. **Select layer filter** (ALL, PHY, MAC, RLC, PDCP, RRC, NAS)
5. **Watch real-time updates** every second during test execution

### **👁️ Individual Message Analysis:**
1. **Go to LogsView or Enhanced LogsView**
2. **Click Eye symbol** on any log entry
3. **View "Layer Parameters" section** in decoder modal
4. **See parameter values** for that specific message

### **📈 Live Tracking Features:**
- **🟢 Live indicator** when test is running
- **Trend arrows** (↗️ increasing, ↘️ decreasing, → stable)
- **Previous values** comparison
- **3GPP standard references** for all parameters
- **Value ranges** and units
- **Layer-specific color coding**
- **Real-time timestamps**

---

## 🎯 **TEST SCENARIO EXAMPLES**

### **📱 5G NR Initial Access Test:**
```
PHY: SS-RSRP varies -90 to -80 dBm (signal acquisition)
MAC: HARQ processes scale 4→8→12 (traffic ramp-up)
RLC: TX PDUs increase 0→100→500 (data transmission)
PDCP: Sequence numbers increment 0→50→100
RRC: Transaction ID cycles 0→1→2→3→0
NAS: Registration attempts 1→2 (if retry needed)
```

### **🔄 Handover Test:**
```
PHY: RSRP drops -85→-95 dBm, then recovers -95→-82 dBm
MAC: Throughput drops 90→30 Mbps, then recovers 30→95 Mbps
RRC: Handover count increases 0→1
NAS: TAU count increases 0→1 (tracking area update)
```

### **📊 Data Transfer Test:**
```
MAC: DL throughput ramps 10→50→90 Mbps
RLC: TX PDUs increase rapidly 100→1000→5000
PDCP: Compression ratio optimizes 10%→20%→15%
```

---

## ✅ **FINAL ANSWER:**

### **YES - COMPLETE LAYER PARAMETER VARIATIONS!**

**🎯 You will see:**
- **Real-time variations** across all 6 protocol layers
- **3GPP-compliant parameter ranges** and references  
- **Test-specific patterns** (handover, data transfer, registration)
- **Historical trends** with visual indicators
- **Live tracking** during test execution
- **Professional parameter analysis** like network analyzers

**📊 Coverage:**
- **PHY**: Signal quality (RSRP, RSRQ, SINR) with mobility variations
- **MAC**: Throughput, HARQ processes with traffic patterns
- **RLC**: PDU counters, retransmissions with error patterns
- **PDCP**: Sequence numbers, compression with efficiency changes
- **RRC**: Transaction IDs, bearer counts with procedure activity
- **NAS**: Security contexts, sessions with registration events

**🚀 Result**: Complete visibility into all layer parameter variations during any test case execution, with professional-grade monitoring and 3GPP compliance! 📊📈

---

## 📁 **Implementation Status:**
- ✅ **LayerParametersTracker.tsx** - Real-time parameter monitoring
- ✅ **Integrated into 5GLabX Platform** - Dashboard view
- ✅ **Live data updates** - Test case driven variations
- ✅ **3GPP compliance** - All parameters with standard references
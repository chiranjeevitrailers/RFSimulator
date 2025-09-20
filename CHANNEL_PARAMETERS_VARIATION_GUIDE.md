# 📡 Channel Parameters Variation Guide - Complete Channel Coverage

## 🎯 **ANSWER TO YOUR QUESTION:**

### **"Will be able to see all channel's PSS,SSS,DMRS,PBCH,PHICH,PCFICH,PDCCH,PDSCH,RACH/PRACH/PUCCH/PUSCH,DLsch/ULsch,PCH,BCH etc. parameters variation as per the Test?"**

## ✅ **YES - COMPLETE CHANNEL PARAMETER VARIATIONS!**

You will see **REAL-TIME parameter variations** for **ALL 15+ channels** across both **5G NR and LTE** with **comprehensive channel-specific parameters**, **3GPP-compliant ranges**, and **realistic test-based variations**.

---

## 📡 **CHANNEL PARAMETERS VARIATION TRACKER**

### **🚀 New Component Added:**
- **`ChannelParametersTracker.tsx`** - Real-time channel parameter monitoring
- **Live tracking** for all physical channels during test execution
- **Channel and direction filtering** (DL/UL/BOTH)
- **Quality indicators** and trend analysis
- **3GPP standard references** for all parameters

---

## 🔍 **COMPLETE CHANNEL COVERAGE (15 Channels, 40+ Parameters)**

### **📡 PSS (Primary Synchronization Signal) - 5G/LTE:**

| Parameter | Initial Value | Variation Range | Unit | 3GPP Reference | Variation Pattern |
|-----------|---------------|-----------------|------|----------------|-------------------|
| **PSS-Power** | 43.2 dBm | (30, 50) | dBm | TS 38.211 7.4.2.2 / TS 36.211 6.11.1 | Cell power changes |
| **PSS-RSRP** | -85.5 dBm | ±4 dBm | dBm | TS 38.215 5.1.1 | Signal strength |
| **PSS-Correlation** | 0.92 | ±0.05 | - | TS 38.211 7.4.2.2 | Sync quality |

### **📡 SSS (Secondary Synchronization Signal) - 5G/LTE:**

| Parameter | Initial Value | Variation Range | Unit | 3GPP Reference | Variation Pattern |
|-----------|---------------|-----------------|------|----------------|-------------------|
| **SSS-Power** | 43.0 dBm | (30, 50) | dBm | TS 38.211 7.4.2.3 / TS 36.211 6.11.2 | Cell power changes |
| **SSS-RSRP** | -86.2 dBm | ±4 dBm | dBm | TS 38.215 5.1.1 | Signal strength |
| **SSS-Sequence-ID** | 168 | (0, 335) | - | TS 38.211 7.4.2.3 | Cell ID dependent |

### **📡 DMRS (Demodulation Reference Signal) - 5G/LTE:**

| Parameter | Initial Value | Variation Range | Unit | 3GPP Reference | Variation Pattern |
|-----------|---------------|-----------------|------|----------------|-------------------|
| **DMRS-Power** | 40.5 dBm | (20, 50) | dBm | TS 38.211 7.4.1.1 / TS 36.211 6.10.3 | Power control |
| **DMRS-RSRP** | -82.8 dBm | ±3 dBm | dBm | TS 38.215 5.1.1 | Channel quality |
| **DMRS-Port-Count** | 2 | (1, 8) | ports | TS 38.211 7.4.1.1 | MIMO configuration |

### **📡 PBCH (Physical Broadcast Channel) - 5G/LTE:**

| Parameter | Initial Value | Variation Range | Unit | 3GPP Reference | Variation Pattern |
|-----------|---------------|-----------------|------|----------------|-------------------|
| **PBCH-Power** | 42.8 dBm | (30, 50) | dBm | TS 38.211 7.3.3 / TS 36.211 6.6 | Broadcast power |
| **PBCH-BLER** | 0.02% | (0, 10) | % | TS 38.211 7.3.3 | Error rate |
| **PBCH-SNR** | 18.5 dB | (-10, 40) | dB | TS 38.215 | Signal quality |

### **📡 PHICH (Physical HARQ Indicator Channel) - LTE Only:**

| Parameter | Initial Value | Variation Range | Unit | 3GPP Reference | Variation Pattern |
|-----------|---------------|-----------------|------|----------------|-------------------|
| **PHICH-Power** | 38.2 dBm | (20, 50) | dBm | TS 36.211 6.9 | Control power |
| **PHICH-ACK-Rate** | 95.8% | (80, 100) | % | TS 36.211 6.9 | HARQ feedback |

### **📡 PCFICH (Physical Control Format Indicator Channel) - LTE Only:**

| Parameter | Initial Value | Variation Range | Unit | 3GPP Reference | Variation Pattern |
|-----------|---------------|-----------------|------|----------------|-------------------|
| **PCFICH-Power** | 39.5 dBm | (20, 50) | dBm | TS 36.211 6.7 | Control power |
| **PCFICH-CFI** | 2 | (1, 4) | symbols | TS 36.211 6.7 | Control format |

### **📡 PDCCH (Physical Downlink Control Channel) - 5G/LTE:**

| Parameter | Initial Value | Variation Range | Unit | 3GPP Reference | Variation Pattern |
|-----------|---------------|-----------------|------|----------------|-------------------|
| **PDCCH-Power** | 41.2 dBm | (20, 50) | dBm | TS 38.211 7.3.2 / TS 36.211 6.8 | Control power |
| **PDCCH-BLER** | 1.2% | (0, 10) | % | TS 38.211 7.3.2 | Control error rate |
| **PDCCH-Aggregation-Level** | 4 | (1, 16) | CCEs | TS 38.211 7.3.2 | Channel quality |

### **📡 PDSCH (Physical Downlink Shared Channel) - 5G/LTE:**

| Parameter | Initial Value | Variation Range | Unit | 3GPP Reference | Variation Pattern |
|-----------|---------------|-----------------|------|----------------|-------------------|
| **PDSCH-Power** | 38.8 dBm | (10, 50) | dBm | TS 38.211 7.3.1 / TS 36.211 6.3 | Data power |
| **PDSCH-Throughput** | 85.6 Mbps | (0, 1000) | Mbps | TS 38.214 | Traffic load |
| **PDSCH-MCS** | 16 | (0, 31) | index | TS 38.214 5.1.3 | Channel adaptation |
| **PDSCH-BLER** | 2.8% | (0, 10) | % | TS 38.214 | Data error rate |

### **📡 PRACH (Physical Random Access Channel) - 5G/LTE:**

| Parameter | Initial Value | Variation Range | Unit | 3GPP Reference | Variation Pattern |
|-----------|---------------|-----------------|------|----------------|-------------------|
| **PRACH-Power** | 23.5 dBm | (-50, 33) | dBm | TS 38.213 7.3 / TS 36.213 5.1.1 | Power ramping |
| **PRACH-Detection-Rate** | 98.5% | (80, 100) | % | TS 38.211 6.3.3 | Access success |
| **PRACH-Preamble-Index** | 23 | (0, 63) | index | TS 38.211 6.3.3.1 | Random selection |

### **📡 PUCCH (Physical Uplink Control Channel) - 5G/LTE:**

| Parameter | Initial Value | Variation Range | Unit | 3GPP Reference | Variation Pattern |
|-----------|---------------|-----------------|------|----------------|-------------------|
| **PUCCH-Power** | 10.2 dBm | (-40, 23) | dBm | TS 38.213 7.2 / TS 36.213 5.1.2 | Power control |
| **PUCCH-Format** | 1 | (0, 4) | format | TS 38.211 6.3.2 | Control info size |
| **PUCCH-BLER** | 1.5% | (0, 10) | % | TS 38.213 | Control error rate |

### **📡 PUSCH (Physical Uplink Shared Channel) - 5G/LTE:**

| Parameter | Initial Value | Variation Range | Unit | 3GPP Reference | Variation Pattern |
|-----------|---------------|-----------------|------|----------------|-------------------|
| **PUSCH-Power** | 15.8 dBm | (-40, 23) | dBm | TS 38.213 7.1 / TS 36.213 5.1.1 | Power control |
| **PUSCH-Throughput** | 42.3 Mbps | (0, 500) | Mbps | TS 38.214 | UL traffic load |
| **PUSCH-MCS** | 12 | (0, 31) | index | TS 38.214 6.1.4 | UL channel adapt |
| **PUSCH-BLER** | 3.2% | (0, 10) | % | TS 38.214 | UL data error rate |

### **📡 DL-SCH (Downlink Shared Channel) - 5G/LTE:**

| Parameter | Initial Value | Variation Range | Unit | 3GPP Reference | Variation Pattern |
|-----------|---------------|-----------------|------|----------------|-------------------|
| **DLSCH-Throughput** | 88.2 Mbps | (0, 1000) | Mbps | TS 38.212 / TS 36.212 | DL data rate |
| **DLSCH-HARQ-ACK-Rate** | 96.8% | (80, 100) | % | TS 38.321 5.4.2 | DL HARQ success |

### **📡 UL-SCH (Uplink Shared Channel) - 5G/LTE:**

| Parameter | Initial Value | Variation Range | Unit | 3GPP Reference | Variation Pattern |
|-----------|---------------|-----------------|------|----------------|-------------------|
| **ULSCH-Throughput** | 44.5 Mbps | (0, 500) | Mbps | TS 38.212 / TS 36.212 | UL data rate |
| **ULSCH-HARQ-ACK-Rate** | 94.2% | (80, 100) | % | TS 38.321 5.4.2 | UL HARQ success |

### **📡 PCH (Paging Channel) - 5G/LTE:**

| Parameter | Initial Value | Variation Range | Unit | 3GPP Reference | Variation Pattern |
|-----------|---------------|-----------------|------|----------------|-------------------|
| **PCH-Power** | 40.2 dBm | (20, 50) | dBm | TS 38.211 / TS 36.211 | Paging power |
| **PCH-Paging-Rate** | 12.5 pages/sec | (0, 100) | pages/sec | TS 38.331 | Paging load |

### **📡 BCH (Broadcast Channel) - 5G/LTE:**

| Parameter | Initial Value | Variation Range | Unit | 3GPP Reference | Variation Pattern |
|-----------|---------------|-----------------|------|----------------|-------------------|
| **BCH-Power** | 43.5 dBm | (30, 50) | dBm | TS 38.211 / TS 36.211 | Broadcast power |
| **BCH-Block-Error-Rate** | 0.8% | (0, 5) | % | TS 38.211 | System info errors |

---

## 🎯 **CHANNEL PARAMETER VARIATION PATTERNS**

### **📈 During Test Execution You'll See:**

#### **1. 📡 Synchronization Channels (PSS/SSS):**
```
PSS-RSRP: -85.5 dBm → -82.1 dBm → -87.8 dBm → -84.2 dBm
SSS-RSRP: -86.2 dBm → -83.5 dBm → -88.1 dBm → -85.0 dBm
PSS-Correlation: 0.92 → 0.95 → 0.89 → 0.93
Trend: ↗️ ↘️ ↗️ (Signal quality with mobility)
```

#### **2. 📊 Data Channels (PDSCH/PUSCH):**
```
PDSCH-Throughput: 85.6 Mbps → 92.3 Mbps → 78.1 Mbps → 88.7 Mbps
PUSCH-Throughput: 42.3 Mbps → 38.9 Mbps → 45.8 Mbps → 41.2 Mbps
PDSCH-MCS: 16 → 20 → 12 → 18 (Channel adaptation)
PUSCH-MCS: 12 → 15 → 9 → 14 (UL adaptation)
Trend: ↗️ ↘️ ↗️ (Traffic and channel quality dependent)
```

#### **3. 🎯 Control Channels (PDCCH/PUCCH):**
```
PDCCH-BLER: 1.2% → 0.8% → 1.5% → 1.0% (Control reliability)
PUCCH-Power: 10.2 dBm → 12.5 dBm → 8.7 dBm → 11.1 dBm
PDCCH-Aggregation-Level: 4 → 8 → 2 → 4 (Channel adaptation)
Trend: ↗️ ↘️ ↗️ (Channel quality dependent)
```

#### **4. 🔄 Access Channels (PRACH):**
```
PRACH-Power: 23.5 dBm → 26.2 dBm → 20.8 dBm → 24.1 dBm
PRACH-Detection-Rate: 98.5% → 99.2% → 97.8% → 98.9%
PRACH-Preamble-Index: 23 → 45 → 12 → 38 (Random selection)
Trend: ↗️ ↘️ ↗️ (Power ramping and access attempts)
```

#### **5. 📻 Reference Signals (DMRS):**
```
DMRS-RSRP: -82.8 dBm → -80.5 dBm → -84.2 dBm → -81.9 dBm
DMRS-Port-Count: 2 → 4 → 2 → 2 (MIMO adaptation)
Trend: ↗️ ↘️ ↗️ (Channel estimation quality)
```

#### **6. 📢 Broadcast Channels (PBCH/BCH):**
```
PBCH-SNR: 18.5 dB → 21.2 dB → 16.8 dB → 19.3 dB
BCH-Block-Error-Rate: 0.8% → 0.5% → 1.2% → 0.7%
Trend: ↗️ ↘️ ↗️ (System information reliability)
```

---

## 🚀 **HOW TO VIEW CHANNEL PARAMETER VARIATIONS**

### **📡 Channel Parameters Tracker Dashboard:**
1. **Run any test case** from Test Manager
2. **Switch to 5GLabX Platform**
3. **Scroll to "Channel Parameters Variation Tracker"**
4. **Select channel filter** (ALL, PSS, SSS, DMRS, PBCH, PDCCH, PDSCH, etc.)
5. **Select direction filter** (ALL, DL, UL, BOTH)
6. **Watch real-time updates** with quality indicators

### **👁️ Individual Channel Analysis:**
1. **Go to LogsView or Enhanced LogsView**
2. **Click Eye symbol** on any log entry
3. **View channel-specific parameters** in decoder modal
4. **See parameter variations** for that specific message

### **📈 Live Tracking Features:**
- **🟢 Live indicator** when test is running
- **Channel icons** and color coding for each channel type
- **Direction indicators** (DL/UL/BOTH)
- **Quality indicators** (🟢 Good, 🟡 Fair, 🔴 Poor)
- **Trend arrows** (↗️ ↘️ →) for each parameter
- **Previous values** comparison
- **3GPP references** for all parameters
- **Real-time timestamps**

---

## 🎯 **TEST SCENARIO EXAMPLES**

### **📱 5G NR Initial Access Test:**
```
PSS/SSS: Signal acquisition and correlation improvement
PRACH: Power ramping from -50 dBm to optimal level
PDCCH: Control channel establishment with aggregation level adaptation
PDSCH: Data channel setup with MCS adaptation
DMRS: Reference signal power optimization
```

### **🔄 Handover Test:**
```
PSS/SSS: Source cell RSRP drops, target cell RSRP increases
PDSCH: Throughput drops during handover, then recovers
PRACH: Random access to target cell
PUCCH: Control feedback to both cells
DMRS: Reference signal switching between cells
```

### **📊 Data Transfer Test:**
```
PDSCH: Throughput ramps up with MCS adaptation
PUSCH: UL throughput increases with power control
PDCCH: Control channel load increases
HARQ: ACK rates optimize with retransmissions
DMRS: Port count adapts for MIMO optimization
```

### **📢 Broadcast Information Test:**
```
PBCH: System information broadcast with SNR variations
BCH: Master information block transmission
PCH: Paging channel activity for idle UEs
PSS/SSS: Synchronization signal quality monitoring
```

---

## 🎛️ **ADVANCED FILTERING AND ANALYSIS**

### **📊 Channel Type Filtering:**
- **Synchronization**: PSS, SSS, DMRS
- **Broadcast**: PBCH, BCH, PCH
- **Control**: PDCCH, PUCCH, PHICH, PCFICH
- **Data**: PDSCH, PUSCH, DL-SCH, UL-SCH
- **Access**: PRACH

### **📡 Direction Filtering:**
- **Downlink (DL)**: PSS, SSS, PBCH, PDCCH, PDSCH, DL-SCH, PCH, BCH, PHICH, PCFICH
- **Uplink (UL)**: PRACH, PUCCH, PUSCH, UL-SCH
- **Both (BOTH)**: DMRS

### **🎯 Quality Monitoring:**
- **🟢 Good**: Normal operation, optimal performance
- **🟡 Fair**: Degraded but acceptable performance
- **🔴 Poor**: Poor performance, potential issues

---

## ✅ **FINAL ANSWER:**

### **🏆 COMPLETE CHANNEL PARAMETER VISIBILITY!**

**📡 You get:**
- **40+ parameters** across **15 channels** (PSS, SSS, DMRS, PBCH, PHICH, PCFICH, PDCCH, PDSCH, PRACH, PUCCH, PUSCH, DL-SCH, UL-SCH, PCH, BCH)
- **Real-time variations** during test execution with realistic patterns
- **3GPP-compliant ranges** and standard references for all parameters
- **Channel-specific behavior** (sync, data, control, broadcast, access)
- **Direction-aware monitoring** (DL/UL/BOTH)
- **Quality indicators** and trend analysis
- **Professional channel analysis** like RF test equipment

**🎯 Coverage:**
- **Synchronization**: PSS/SSS correlation and power variations
- **Data Channels**: PDSCH/PUSCH throughput, MCS, BLER with traffic patterns
- **Control Channels**: PDCCH/PUCCH power, aggregation, error rates
- **Access Channels**: PRACH power ramping and detection rates
- **Reference Signals**: DMRS power and port adaptation
- **Broadcast Channels**: PBCH/BCH/PCH system information quality

**📁 Implementation**: `ChannelParametersTracker.tsx` - **DEPLOYED!** ✅

**🎉 Result**: You now have complete visibility into ALL channel parameter variations during any test case execution, with professional-grade real-time monitoring and 3GPP compliance for every physical channel! 📡📈**

---

## 📋 **Quick Reference - All Channels Covered:**

✅ **PSS** - Primary Synchronization Signal (Power, RSRP, Correlation)  
✅ **SSS** - Secondary Synchronization Signal (Power, RSRP, Sequence ID)  
✅ **DMRS** - Demodulation Reference Signal (Power, RSRP, Port Count)  
✅ **PBCH** - Physical Broadcast Channel (Power, BLER, SNR)  
✅ **PHICH** - Physical HARQ Indicator Channel (Power, ACK Rate) - LTE  
✅ **PCFICH** - Physical Control Format Indicator (Power, CFI) - LTE  
✅ **PDCCH** - Physical Downlink Control Channel (Power, BLER, Aggregation)  
✅ **PDSCH** - Physical Downlink Shared Channel (Power, Throughput, MCS, BLER)  
✅ **PRACH** - Physical Random Access Channel (Power, Detection Rate, Preamble)  
✅ **PUCCH** - Physical Uplink Control Channel (Power, Format, BLER)  
✅ **PUSCH** - Physical Uplink Shared Channel (Power, Throughput, MCS, BLER)  
✅ **DL-SCH** - Downlink Shared Channel (Throughput, HARQ ACK Rate)  
✅ **UL-SCH** - Uplink Shared Channel (Throughput, HARQ ACK Rate)  
✅ **PCH** - Paging Channel (Power, Paging Rate)  
✅ **BCH** - Broadcast Channel (Power, Block Error Rate)  

**Total: 15 Channels, 40+ Parameters, Full 5G/LTE Coverage!** 🚀
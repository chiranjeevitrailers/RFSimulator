# 📋 Test Case Creation Guide

## 🎯 **Overview**

This guide provides comprehensive instructions for creating 3GPP-compliant test cases using the Test Case Builder. The system ensures all test cases follow industry standards and best practices.

## 🏗️ **Test Case Template System**

### **Available Templates**

| Technology | Template | Category | Description |
|------------|----------|----------|-------------|
| **LTE** | `lte-power-on` | POWER_ON | Complete LTE UE power-on and attach procedure |
| **LTE** | `lte-handover` | HANDOVER | LTE handover procedures (X2/S1) |
| **LTE** | `lte-call-setup` | CALL_SETUP | LTE voice call establishment |
| **LTE** | `lte-data-session` | DATA_SESSION | LTE data session establishment |
| **5G NR** | `5g-nr-initial-access` | INITIAL_ACCESS | 5G NR initial access and registration |
| **5G NR** | `5g-nr-handover` | HANDOVER | 5G NR handover procedures |
| **5G NR** | `5g-nr-pdu-session` | PDU_SESSION | 5G NR PDU session establishment |
| **5G NR** | `5g-nr-mobility` | MOBILITY | 5G NR mobility procedures |
| **O-RAN** | `oran-ric-test` | RIC_TEST | O-RAN RIC functionality testing |
| **O-RAN** | `oran-xapp-deployment` | XAPP_DEPLOYMENT | O-RAN xApp deployment testing |
| **NB-IoT** | `nb-iot-attach` | ATTACH | NB-IoT attach procedure |
| **NB-IoT** | `nb-iot-data-transmission` | DATA_TRANSMISSION | NB-IoT data transmission |
| **C-V2X** | `c-v2x-sidelink` | SIDELINK | C-V2X sidelink communication |
| **C-V2X** | `c-v2x-safety-message` | SAFETY_MESSAGE | C-V2X safety message transmission |
| **NTN** | `ntn-satellite-access` | SATELLITE_ACCESS | NTN satellite access |
| **NTN** | `ntn-handover` | HANDOVER | NTN handover procedures |

## 📝 **Step-by-Step Creation Process**

### **Step 1: Select Template**

1. **Open Test Case Builder**
   - Navigate to User Dashboard
   - Click "Test Case Builder" tab

2. **Choose Technology**
   - Select the appropriate technology (LTE, 5G NR, O-RAN, etc.)
   - Choose the test category (Power On, Handover, Call Setup, etc.)

3. **Review Template Details**
   - Check the template description
   - Verify it matches your test requirements
   - Click on the template to generate

### **Step 2: Customize Test Case**

#### **Basic Information**
- **Test Case ID**: Unique identifier (auto-generated)
- **Name**: Descriptive test case name
- **Description**: Detailed test case description
- **Technology**: LTE, 5G NR, O-RAN, NB-IoT, C-V2X, NTN
- **Category**: Power On, Handover, Call Setup, etc.

#### **UE Profile Configuration**
- **IMSI**: International Mobile Subscriber Identity (15 digits)
- **IMEI**: International Mobile Equipment Identity (15 digits)
- **Default APN**: Access Point Name for data services
- **Device Capabilities**: MIMO support, CA support, features
- **Security Support**: Encryption and integrity algorithms
- **Mobility Support**: Handover types, measurement capabilities
- **Service Support**: Voice, data, SMS, emergency services

#### **Cell Configuration**
- **MCC**: Mobile Country Code (3 digits)
- **MNC**: Mobile Network Code (2-3 digits)
- **TAC**: Tracking Area Code
- **Bandwidth**: Channel bandwidth in MHz
- **PCI/NCI**: Physical Cell ID / NR Cell Identity
- **EARFCN/NRARFCN**: Absolute Radio Frequency Channel Number
- **Frequency Band**: Operating frequency band
- **Duplex Mode**: FDD or TDD

### **Step 3: Define Message Sequence**

#### **Test Steps Structure**
```json
{
  "step": 1,
  "eventType": "CELL_SYNC",
  "layer": "PHY",
  "description": "UE performs cell synchronization",
  "subSteps": ["PSS_DETECTION", "SSS_DETECTION", "PCI_CALCULATION"],
  "expectedIEs": [...],
  "assertions": [...],
  "duration": 3000,
  "trigger": {...},
  "expectedResponse": {...}
}
```

#### **Information Elements (IEs)**
```json
{
  "name": "rsrp",
  "type": "REAL",
  "value": -95.2,
  "description": "Reference Signal Received Power",
  "mandatory": true,
  "standardReference": "3GPP TS 36.101"
}
```

#### **Assertions**
```json
{
  "parameter": "rsrp",
  "operator": "gte",
  "expectedValue": -110,
  "description": "RSRP should be above -110 dBm",
  "severity": "ERROR"
}
```

### **Step 4: Configure Layer Parameters**

#### **Parameter Definition**
```json
{
  "layer": "PHY",
  "parameterName": "rsrp",
  "description": "Reference Signal Received Power",
  "unit": "dBm",
  "expectedRange": {"min": -140, "max": -44},
  "typicalValue": -95,
  "variation": 5,
  "criticalThresholds": {"warning": -100, "error": -110}
}
```

#### **Supported Layers**
- **PHY**: RSRP, RSRQ, SINR, CQI, PCI, Timing Advance
- **MAC**: Throughput, Packet Loss Rate, Retransmission Rate
- **RLC**: Throughput, Buffer Occupancy, Window Size
- **PDCP**: Throughput, Sequence Number, Buffer Status
- **RRC**: Connection State, Handover Count, Setup Time
- **NAS**: Attach State, Authentication, Security Mode

### **Step 5: Define Validation Rules**

#### **3GPP Compliance Rules**
```json
{
  "ruleId": "LTE-001",
  "name": "RSRP Threshold",
  "description": "RSRP must be above -110 dBm",
  "layer": "PHY",
  "parameter": "rsrp",
  "condition": "rsrp > -110",
  "expectedResult": true,
  "severity": "CRITICAL",
  "standardReference": "3GPP TS 36.101"
}
```

#### **Rule Severity Levels**
- **CRITICAL**: Test fails if rule is violated
- **MAJOR**: Warning if rule is violated
- **MINOR**: Info if rule is violated

### **Step 6: Validate Test Case**

#### **Automatic Validation**
- **Structure Validation**: Required fields present
- **Format Validation**: Data types and formats correct
- **3GPP Compliance**: Standards compliance checking
- **Range Validation**: Parameter values within valid ranges
- **Dependency Validation**: Cross-field dependencies

#### **Validation Results**
- **✅ Valid**: Test case ready for use
- **⚠️ Warnings**: Non-critical issues
- **❌ Errors**: Critical issues that must be fixed

### **Step 7: Save and Deploy**

#### **Save Options**
- **JSON File**: Download as JSON file
- **Database**: Save to test case database
- **Version Control**: Track changes and versions

#### **Deployment**
- **Test Manager**: Available in File-Based Test Manager
- **Execution**: Ready for test execution
- **Analysis**: Compatible with analysis platforms

## 🔧 **Technology-Specific Guidelines**

### **LTE Test Cases**

#### **Required Parameters**
- **EARFCN**: E-UTRA Absolute Radio Frequency Channel Number
- **PCI**: Physical Cell ID (0-503)
- **Bandwidth**: 1.4, 3, 5, 10, 15, 20 MHz
- **Duplex Mode**: FDD or TDD

#### **Message Sequence**
1. **CELL_SYNC**: PSS, SSS, PBCH, SIB1/2/3
2. **PRACH**: Random Access Procedure
3. **RRC_SETUP**: RRC Connection Setup
4. **NAS_ATTACH**: Attach Request/Accept
5. **BEARER_SETUP**: Default Bearer Activation

#### **Validation Rules**
- RSRP > -110 dBm
- RSRQ > -20 dB
- SINR > 0 dB
- Attach time < 10 seconds

### **5G NR Test Cases**

#### **Required Parameters**
- **NRARFCN**: NR Absolute Radio Frequency Channel Number
- **NCI**: NR Cell Identity
- **Bandwidth**: 5, 10, 15, 20, 25, 30, 40, 50, 60, 80, 100, 200, 400 MHz
- **Duplex Mode**: TDD or FDD

#### **Message Sequence**
1. **SSB_DETECTION**: SSB detection and synchronization
2. **RACH**: Random Access Procedure
3. **RRC_SETUP**: RRC Connection Setup
4. **REGISTRATION**: Registration Request/Accept
5. **PDU_SESSION**: PDU Session Establishment

#### **Validation Rules**
- SSB detection time < 5 seconds
- Registration time < 10 seconds
- PDU session setup < 5 seconds

### **O-RAN Test Cases**

#### **Required Parameters**
- **RIC_ID**: RIC Instance ID
- **xApp_ID**: xApp Instance ID
- **Interface**: E2, A1, O1, O2
- **Policy**: Policy ID and parameters

#### **Message Sequence**
1. **RIC_CONNECTION**: RIC connection establishment
2. **xAPP_DEPLOYMENT**: xApp deployment
3. **POLICY_CONFIG**: Policy configuration
4. **MEASUREMENT**: Measurement collection
5. **CONTROL**: Control action execution

### **NB-IoT Test Cases**

#### **Required Parameters**
- **EARFCN**: E-UTRA Absolute Radio Frequency Channel Number
- **Bandwidth**: 0.2 MHz (fixed)
- **Coverage Enhancement**: CE level (0-2)
- **Power Class**: 5, 6, or 7

#### **Message Sequence**
1. **CELL_SYNC**: Cell synchronization
2. **RACH**: Random Access (NPRACH)
3. **RRC_SETUP**: RRC Connection Setup
4. **ATTACH**: Attach procedure
5. **DATA_TRANSMISSION**: Data transmission

### **C-V2X Test Cases**

#### **Required Parameters**
- **PC5_FREQUENCY**: PC5 interface frequency
- **SIDELINK_BANDWIDTH**: Sidelink bandwidth
- **V2X_SERVICES**: V2X service types
- **SAFETY_ZONE**: Safety zone configuration

#### **Message Sequence**
1. **SIDELINK_SYNC**: Sidelink synchronization
2. **DISCOVERY**: Service discovery
3. **CONNECTION**: PC5 connection setup
4. **SAFETY_MESSAGE**: Safety message transmission
5. **COOPERATIVE_AWARENESS**: Cooperative awareness

### **NTN Test Cases**

#### **Required Parameters**
- **SATELLITE_ID**: Satellite identifier
- **ORBIT_TYPE**: LEO, MEO, GEO
- **COVERAGE_AREA**: Coverage area
- **DELAY_COMPENSATION**: Delay compensation

#### **Message Sequence**
1. **SATELLITE_ACCESS**: Satellite access
2. **TIMING_SYNC**: Timing synchronization
3. **DOPPLER_COMP**: Doppler compensation
4. **HANDOVER**: Satellite handover
5. **DATA_TRANSMISSION**: Data transmission

## 📊 **Best Practices**

### **Test Case Design**

1. **Clear Objectives**
   - Define specific test objectives
   - Identify success/failure criteria
   - Set realistic expectations

2. **Realistic Scenarios**
   - Use realistic parameter values
   - Follow 3GPP specifications
   - Consider real-world conditions

3. **Comprehensive Coverage**
   - Cover all protocol layers
   - Include edge cases
   - Test error conditions

4. **Maintainable Structure**
   - Use clear naming conventions
   - Document assumptions
   - Version control changes

### **Parameter Configuration**

1. **Value Ranges**
   - Use 3GPP-compliant ranges
   - Set realistic typical values
   - Define appropriate variations

2. **Thresholds**
   - Set warning thresholds
   - Define error thresholds
   - Consider performance limits

3. **Dependencies**
   - Check parameter dependencies
   - Validate cross-layer relationships
   - Ensure consistency

### **Validation Strategy**

1. **Multi-Level Validation**
   - Structure validation
   - Format validation
   - Range validation
   - 3GPP compliance

2. **Error Handling**
   - Clear error messages
   - Suggested fixes
   - Severity levels

3. **Testing**
   - Unit testing
   - Integration testing
   - End-to-end testing

## 🚀 **Quick Start Examples**

### **LTE Power-On Test Case**

```json
{
  "testCaseId": "lte-power-on-example",
  "name": "LTE Power-On Default Attach",
  "technology": "LTE",
  "category": "POWER_ON",
  "ueProfile": {
    "imsi": "404123456789012",
    "imei": "359123456789012",
    "defaultApn": "internet"
  },
  "cellConfig": {
    "pci": 123,
    "earfcn": 1850,
    "bandwidth": 20,
    "tac": 12345,
    "mcc": "404",
    "mnc": "12"
  }
}
```

### **5G NR Initial Access Test Case**

```json
{
  "testCaseId": "5g-nr-initial-access-example",
  "name": "5G NR Initial Access Procedure",
  "technology": "5G_NR",
  "category": "INITIAL_ACCESS",
  "ueProfile": {
    "imsi": "404123456789013",
    "imei": "359123456789013",
    "defaultApn": "internet"
  },
  "cellConfig": {
    "nci": "12345678901234567890",
    "nrarfcn": 632448,
    "bandwidth": 100,
    "tac": 54321,
    "mcc": "404",
    "mnc": "12"
  }
}
```

## 📚 **References**

### **3GPP Specifications**
- **TS 36.101**: LTE UE radio transmission and reception
- **TS 36.211**: LTE physical channels and modulation
- **TS 36.331**: LTE RRC protocol specification
- **TS 24.301**: LTE NAS protocol specification
- **TS 38.101**: 5G NR UE radio transmission and reception
- **TS 38.211**: 5G NR physical channels and modulation
- **TS 38.331**: 5G NR RRC protocol specification
- **TS 24.501**: 5G NR NAS protocol specification

### **O-RAN Specifications**
- **O-RAN.WG1.O-RAN Architecture Description**
- **O-RAN.WG2.O-RAN Architecture Description**
- **O-RAN.WG3.O-RAN Architecture Description**

### **Additional Resources**
- **Test Case Builder UI**: Interactive test case creation
- **Validation Engine**: Automatic 3GPP compliance checking
- **Template Library**: Pre-built test case templates
- **Documentation**: Comprehensive API documentation

---

**Ready to create your first test case? Start with the Test Case Builder and follow this guide step by step!** 🚀
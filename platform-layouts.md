# 5GLabX Platform Layouts

## 1. NewTestManager_1 Layout

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Header - Test Manager                                    [Connected] [Last: 14:30] │
│ [Activity Icon] Test Manager  [Run Test] [Stop Test]                            │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────┬─────────────────────────────────────────┐
│ Test Cases Panel (50%)              │ Automation Log Panel (50%)              │
├─────────────────────────────────────┼─────────────────────────────────────────┤
│ Test Cases                          │ Automation Log                          │
│ 1,250 test cases loaded             │ 45 log entries              [Clear]     │
├─────────────────────────────────────┼─────────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │ ┌─────────────────────────────────────┐ │
│ │ Test Case Item 1                │ │ │ 14:30:25 [INFO] TestManager:        │ │
│ │ 5G NR Protocol Test             │ │ │ Starting test execution...          │ │
│ │ 5G_NR • PROTOCOL                │ │ └─────────────────────────────────────┘ │
│ │ Last run: 2024-01-15    [✓] [✓] │ │ ┌─────────────────────────────────────┐ │
│ └─────────────────────────────────┘ │ │ 14:30:24 [DEBUG] TestManager:        │ │
│ ┌─────────────────────────────────┐ │ │ API Response received                │ │
│ │ Test Case Item 2                │ │ └─────────────────────────────────────┘ │
│ │ 4G LTE Handover Test            │ │ ┌─────────────────────────────────────┐ │
│ │ 4G_LTE • MOBILITY               │ │ │ 14:30:23 [INFO] TestManager:        │ │
│ │ Last run: 2024-01-14    [✓] [ ] │ │ │ Processing 15 messages              │ │
│ └─────────────────────────────────┘ │ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │ ┌─────────────────────────────────────┐ │
│ │ Test Case Item 3                │ │ │ 14:30:22 [INFO] TestManager:        │ │
│ │ O-RAN Interface Test            │ │ │ Event dispatched successfully       │ │
│ │ O_RAN • INTERFACE               │ │ └─────────────────────────────────────┘ │
│ │ Last run: 2024-01-13    [✓] [ ] │ │                                         │
│ └─────────────────────────────────┘ │                                         │
│ ... (more test cases)              │ ... (more log entries)                 │
└─────────────────────────────────────┴─────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│ Status Bar - Bottom                                                             │
│ Execution: exec-1704123456789-abc123  Status: RUNNING  Started: 14:30:25      │
│ Test Case: 5G NR Protocol Test                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 2. New5GLabX_1 Layout

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Header - 5GLabX Analysis Platform                                              │
│ [Database Icon] 5GLabX Analysis  [Connection Status] [Live Data Badge]         │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┬──────────────────────────────────────────────────────────────┐
│ Left Sidebar    │ Main Content Area                                           │
│ (25%)           │ (75%)                                                       │
├─────────────────┼──────────────────────────────────────────────────────────────┤
│ Enhanced        │ ┌──────────────────────────────────────────────────────────┐ │
│ Dashboard       │ │ Enhanced Dashboard                                      │ │
│                 │ │ Connection: Connected  Status: running                  │ │
│ Logs Viewer     │ │ Test Execution Status: Active Test Case: abc123        │ │
│ [15]            │ └──────────────────────────────────────────────────────────┘ │
│                 │                                                              │
│ Enhanced Logs   │ ┌──────────────────────────────────────────────────────────┐ │
│ [LIVE]          │ │ Layer Statistics                                        │ │
│                 │ │ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │ │
│ Layer Trace     │ │ │PHY Layer│ │MAC Layer│ │RLC Layer│ │PDCP Layer│        │ │
│ [LIVE]          │ │ │Total: 45│ │Total: 32│ │Total: 28│ │Total: 41│        │ │
│                 │ │ │Errors: 0│ │Errors: 0│ │Errors: 0│ │Errors: 0│        │ │
│ Call Flow       │ │ └─────────┘ └─────────┘ └─────────┘ └─────────┘        │ │
│                 │ └──────────────────────────────────────────────────────────┘ │
│ Analytics       │                                                              │
│ [LIVE]          │ ┌──────────────────────────────────────────────────────────┐ │
│                 │ │ Real-time Data Flow                                     │ │
│ Test Suites     │ │ Total Messages: 146  Layer Messages: 89  Active: 7     │ │
│                 │ └──────────────────────────────────────────────────────────┘ │
│                 │                                                              │
│ ▼ Protocol      │ ┌──────────────────────────────────────────────────────────┐ │
│ Layers          │ │ Test Manager Integration                                │ │
│ PHY Layer [12]  │ │ Test Manager Connection: Ready                          │ │
│ MAC Layer [8]   │ │ Available Test Cases: 1,000+                           │ │
│ RLC Layer [6]   │ │ How to Use: 1. Go to Test Manager 2. Select test case  │ │
│ PDCP Layer [9]  │ │ 3. Click Run 4. Return here to view analysis           │ │
│ RRC Layer [5]   │ └──────────────────────────────────────────────────────────┘ │
│ NAS Layer [3]   │                                                              │
│ IMS Analysis [2]│                                                              │
│                 │                                                              │
│ ▼ O-RAN         │                                                              │
│ Analysis        │                                                              │
│ O-RAN Overview  │                                                              │
│ Interfaces      │                                                              │
│ CU Analysis     │                                                              │
│ DU Analysis     │                                                              │
│ E1 Interface    │                                                              │
│ F1 Interface    │                                                              │
│ Performance     │                                                              │
│ [LIVE]          │                                                              │
│ xApps           │                                                              │
│ SMO Analysis    │                                                              │
│                 │                                                              │
│ ▼ NB-IoT        │                                                              │
│ Analysis        │                                                              │
│ NB-IoT Overview │                                                              │
│ NB-IoT Call Flow│                                                              │
│ NB-IoT Analytics│                                                              │
│ [LIVE]          │                                                              │
│ NB-IoT PHY      │                                                              │
│ NB-IoT MAC      │                                                              │
│ NB-IoT RRC      │                                                              │
│ NB-IoT Testing  │                                                              │
│                 │                                                              │
│ ▼ C-V2X         │                                                              │
│ Analysis        │                                                              │
│ V2X Overview    │                                                              │
│ PC5 Sidelink    │                                                              │
│ V2X Analytics   │                                                              │
│ [LIVE]          │                                                              │
│ V2X PHY         │                                                              │
│ V2X MAC         │                                                              │
│ V2X Testing     │                                                              │
│ Test Scenarios  │                                                              │
│                 │                                                              │
│ ▼ NTN Analysis  │                                                              │
│ NTN Overview    │                                                              │
│ Satellite Links │                                                              │
│ NTN Analytics   │                                                              │
│ [LIVE]          │                                                              │
│ SIB19 Analysis  │                                                              │
│ Timing & Delay  │                                                              │
│ Doppler Analysis│                                                              │
│ NTN Scenarios   │                                                              │
│                 │                                                              │
│ ▼ Core Network  │                                                              │
│ AMF Analyzer    │                                                              │
│ SMF Analyzer    │                                                              │
│ UPF Analyzer    │                                                              │
│ AUSF Analyzer   │                                                              │
│ UDM Analyzer    │                                                              │
│ Config Manager  │                                                              │
│                 │                                                              │
│ ▼ 4G Legacy     │                                                              │
│ MME Analyzer    │                                                              │
│ SGW Analyzer    │                                                              │
│ PGW Analyzer    │                                                              │
└─────────────────┴──────────────────────────────────────────────────────────────┘
```

## 3. NewUEAnalysis_1 Layout

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Header - UE Analysis Platform                                                   │
│ [Smartphone Icon] UE Analysis  [Connection Status] [Live Data Badge]           │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┬──────────────────────────────────────────────────────────────┐
│ Left Sidebar    │ Main Content Area                                           │
│ (25%)           │ (75%)                                                       │
├─────────────────┼──────────────────────────────────────────────────────────────┤
│ UE Overview     │ ┌──────────────────────────────────────────────────────────┐ │
│                 │ │ UE Analysis Dashboard                                  │ │
│ UE Logs Viewer  │ │ Connection: Connected  Status: running                  │ │
│ [23]            │ │ Active UE: IMSI-123456789012345                        │ │
│                 │ └──────────────────────────────────────────────────────────┘ │
│ UE Enhanced     │                                                              │
│ Logs [LIVE]     │ ┌──────────────────────────────────────────────────────────┐ │
│                 │ │ UE Statistics                                          │ │
│ UE Layer Trace  │ │ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │ │
│ [LIVE]          │ │ │UE Count │ │Active   │ │Signal   │ │Battery  │        │ │
│                 │ │ │Total: 5 │ │UEs: 3   │ │Quality  │ │Level    │        │ │
│ UE Call Flow    │ │ │         │ │         │ │Good     │ │85%      │        │ │
│                 │ │ └─────────┘ └─────────┘ └─────────┘ └─────────┘        │ │
│ UE Analytics    │ └──────────────────────────────────────────────────────────┘ │
│ [LIVE]          │                                                              │
│                 │ ┌──────────────────────────────────────────────────────────┐ │
│ ▼ UE Protocol   │ │ Real-time UE Data Flow                                  │ │
│ Stack           │ │ UE Messages: 89  Protocol Messages: 67  Active: 4      │ │
│ Application     │ └──────────────────────────────────────────────────────────┘ │
│ Layer [8]       │                                                              │
│ IMS Layer [5]   │ ┌──────────────────────────────────────────────────────────┐ │
│ NAS Layer [12]  │ │ UE Identity Information                                 │ │
│ RRC Layer [15]  │ │ IMSI: 123456789012345  IMEI: 123456789012345           │ │
│ PDCP Layer [9]  │ │ SUPI: imsi-123456789012345  GUTI: 123456789012345      │ │
│ RLC Layer [7]   │ │ MSISDN: +1234567890  TMSI: 12345678                    │ │
│ MAC Layer [6]   │ └──────────────────────────────────────────────────────────┘ │
│ PHY Layer [4]   │                                                              │
│                 │ ┌──────────────────────────────────────────────────────────┐ │
│ ▼ UE Performance│ │ UE Location & Signal Quality                            │ │
│ Analysis        │ │ Latitude: 40.7128°  Longitude: -74.0060°               │ │
│ UE Performance  │ │ Cell ID: 12345  TAC: 67890  PLMN: 310-410              │ │
│ Analysis        │ │ RSRP: -85 dBm  RSRQ: -10 dB  SINR: 15 dB               │ │
│ UE Mobility     │ │ RSSI: -75 dBm  Pathloss: 95 dB                         │ │
│ Analysis        │ └──────────────────────────────────────────────────────────┘ │
│ UE Security     │                                                              │
│ Analysis        │ ┌──────────────────────────────────────────────────────────┐ │
│ UE Call Flow    │ │ UE Capabilities & Power Info                           │ │
│ Analysis        │ │ MIMO: 4x4  Bands: 1,2,3,7,38,41,78  Throughput: 1Gbps  │ │
│                 │ │ Battery: 85%  Power Headroom: 15 dBm  UL Power: 20 dBm  │ │
│ ▼ UE Analytics  │ └──────────────────────────────────────────────────────────┘ │
│ UE Analytics    │                                                              │
│ View [LIVE]     │ ┌──────────────────────────────────────────────────────────┐ │
│                 │ │ Live UE Messages (Last 10)                              │ │
│ ▼ UE Technology │ │ ┌──────────────────────────────────────────────────────┐ │ │
│ Specific        │ │ │ 14:30:25 [INFO] UE-APPLICATION:                      │ │ │
│ 5G NR UE [12]   │ │ │ App Data Request: {"type": "video", "size": "2MB"}  │ │ │
│ 4G LTE UE [8]   │ │ └──────────────────────────────────────────────────────┘ │ │
│ O-RAN UE [5]    │ │ ┌──────────────────────────────────────────────────────┐ │ │
│ NB-IoT UE [3]   │ │ │ 14:30:24 [INFO] UE-NAS:                             │ │ │
│ C-V2X UE [2]    │ │ │ Registration Request: {"cause": "emergency"}        │ │ │
│ NTN UE [1]      │ │ └──────────────────────────────────────────────────────┘ │ │
│                 │ │ ┌──────────────────────────────────────────────────────┐ │ │
│ ▼ UE Device     │ │ │ 14:30:23 [INFO] UE-RRC:                             │ │ │
│ Specific        │ │ │ RRC Setup Request: {"establishmentCause": "mo-data"}│ │ │
│ UE Device Info  │ │ └──────────────────────────────────────────────────────┘ │ │
│ UE Capabilities │ │ ... (more UE messages)                                  │ │
│ UE Status       │ └──────────────────────────────────────────────────────────┘ │
│ UE Location     │                                                              │
└─────────────────┴──────────────────────────────────────────────────────────────┘
```

## 4. Complete User Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Header - 5GLabX Platform                                                        │
│ [Activity Icon] 5GLabX Platform  [Platform Online] [User: Demo User] [Sign Out]│
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│ Navigation Tabs                                                                 │
│ [Test Manager] [5GLabX Analysis] [UE Analysis]                                 │
│    Active Tab                                                                   │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│ Main Content Area (800px height)                                               │
│                                                                                 │
│ ┌─────────────────────────────────────────────────────────────────────────────┐ │
│ │ Selected Platform Component (NewTestManager_1, New5GLabX_1, or NewUEAnalysis_1) │ │
│ │                                                                             │ │
│ │ [Full platform layout as shown above]                                      │ │
│ │                                                                             │ │
│ └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Key Features Summary

### NewTestManager_1
- **Split Layout**: Test Cases (50%) + Automation Log (50%)
- **Real-time Logging**: Comprehensive test execution tracking
- **API Integration**: Loads from Supabase, executes via API
- **Event Dispatching**: Sends events to analysis platforms

### New5GLabX_1
- **Sidebar Navigation**: Collapsible sections for different analysis types
- **Protocol Layers**: PHY, MAC, RLC, PDCP, RRC, NAS, IMS
- **Technology Analysis**: O-RAN, NB-IoT, C-V2X, NTN
- **Core Network**: AMF, SMF, UPF, AUSF, UDM, Config Manager
- **4G Legacy**: MME, SGW, PGW
- **Live Data**: Real-time status indicators and data flow

### NewUEAnalysis_1
- **UE-Focused**: Complete UE log analysis and monitoring
- **3GPP Standards**: IMSI, IMEI, SUPI, GUTI, RSRP, RSRQ, etc.
- **Protocol Stack**: Application, IMS, NAS, RRC, PDCP, RLC, MAC, PHY
- **Performance**: Mobility, Security, Call Flow analysis
- **Technology Support**: 5G NR, 4G LTE, O-RAN, NB-IoT, C-V2X, NTN
- **Device Monitoring**: Capabilities, Status, Location tracking

### Complete Integration
- **Tab-based Navigation**: Switch between all three platforms
- **Event-driven**: Test Manager triggers analysis in other platforms
- **Consistent UI**: Same design language across all platforms
- **Real-time Data**: Live updates and status indicators throughout
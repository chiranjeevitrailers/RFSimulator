# 🎨 Complete "5GLabX + Test Manager" Frontend Layout

## 📐 Overall Layout Structure

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                            5GLabX PLATFORM + TEST MANAGER                          │
│                          🟢 Full Integration Active                                │
├─────────────────────────────────────────────────────────────────────────────────────┤
│  SIDEBAR (384px)           │                MAIN CONTENT AREA                       │
│  ┌─────────────────────┐   │  ┌───────────────────────────────────────────────────┐ │
│  │                     │   │  │                                                   │ │
│  │  🧪 TEST MANAGER    │   │  │           ACTIVE VIEW CONTENT                     │ │
│  │     (Integrated)    │   │  │                                                   │ │
│  │                     │   │  │  • Protocol Layer Analysis                       │ │
│  │  ├─ Test Library    │   │  │  • Log Views                                     │ │
│  │  ├─ Active Tests    │   │  │  • Enhanced Analysis                             │ │
│  │  ├─ Results         │   │  │  • Real-time Updates                             │ │
│  │  └─ Backend Status  │   │  │                                                   │ │
│  │                     │   │  │                                                   │ │
│  │  🔧 5GLABX NAV      │   │  │                                                   │ │
│  │                     │   │  │                                                   │ │
│  │  Protocol Layers:   │   │  │                                                   │ │
│  │  • PHY Layer        │   │  │                                                   │ │
│  │  • MAC Layer        │   │  │                                                   │ │
│  │  • RLC Layer        │   │  │                                                   │ │
│  │  • PDCP Layer       │   │  │                                                   │ │
│  │  • RRC Layer        │   │  │                                                   │ │
│  │  • NAS Layer        │   │  │                                                   │ │
│  │  • IMS Layer        │   │  │                                                   │ │
│  │                     │   │  │                                                   │ │
│  │  Analysis Views:    │   │  │                                                   │ │
│  │  • Logs View        │   │  │                                                   │ │
│  │  • Enhanced Logs    │   │  │                                                   │ │
│  │  • Analytics        │   │  │                                                   │ │
│  │  • Layer Trace      │   │  │                                                   │ │
│  │  • Call Flow        │   │  │                                                   │ │
│  │                     │   │  │                                                   │ │
│  │  Technology:        │   │  │                                                   │ │
│  │  • O-RAN Analysis   │   │  │                                                   │ │
│  │  • V2X Analysis     │   │  │                                                   │ │
│  │  • NTN Analysis     │   │  │                                                   │ │
│  │  • NB-IoT Analysis  │   │  │                                                   │ │
│  │  • 5G Core          │   │  │                                                   │ │
│  │  • Legacy Network   │   │  │                                                   │ │
│  │                     │   │  │                                                   │ │
│  └─────────────────────┘   │  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## 🧪 Test Manager Sidebar Section (Detailed)

```
┌─────────────────────────────────────────────────────────────┐
│                    🧪 TEST MANAGER                          │
│                  [Expand/Collapse]                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📑 TABS:                                                   │
│  ┌─────┬─────────┬─────────┬─────────────────────────────┐  │
│  │ 📚  │   🏃    │   📊    │           🔧                │  │
│  │Libr │ Active  │Results  │        Backend              │  │
│  │ary  │  Tests  │         │       Services              │  │
│  └─────┴─────────┴─────────┴─────────────────────────────┘  │
│                                                             │
│  📚 TEST LIBRARY TAB (Selected):                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │  🔍 Search: [                              ] 🔎    │   │
│  │                                                     │   │
│  │  📁 TEST CATEGORIES:                               │   │
│  │                                                     │   │
│  │  📡 5G NR (450+ tests)                    [▼]      │   │
│  │    ├─ Initial Attach Procedure                     │   │
│  │    ├─ Registration Update                          │   │
│  │    ├─ PDU Session Establishment                    │   │
│  │    ├─ Handover Procedures                          │   │
│  │    └─ Data Transfer Tests                          │   │
│  │                                                     │   │
│  │  📱 LTE (320+ tests)                      [▶]      │   │
│  │  📞 VoLTE/VoNR/IMS (280+ tests)           [▶]      │   │
│  │  🌐 O-RAN (200+ tests)                    [▶]      │   │
│  │  🚗 V2X (180+ tests)                      [▶]      │   │
│  │  🛰️ NTN (150+ tests)                      [▶]      │   │
│  │  📡 NB-IoT (220+ tests)                   [▶]      │   │
│  │                                                     │   │
│  │  📋 TEST CASE DETAILS:                            │   │
│  │  ┌─────────────────────────────────────────────┐  │   │
│  │  │ 🏷️  5G NR Initial Attach Procedure        │  │   │
│  │  │                                             │  │   │
│  │  │ 📄 Description:                            │  │   │
│  │  │ Complete UE attach procedure with           │  │   │
│  │  │ authentication and PDU session setup       │  │   │
│  │  │                                             │  │   │
│  │  │ 📨 Messages (6):                           │  │   │
│  │  │ • Registration Request (NAS)               │  │   │
│  │  │ • Authentication Request/Response (NAS)    │  │   │
│  │  │ • Security Mode Command/Complete (NAS)     │  │   │
│  │  │ • Registration Accept (NAS)                │  │   │
│  │  │ • PDU Session Establishment (NAS)          │  │   │
│  │  │ • RRC Setup/Reconfiguration (RRC)          │  │   │
│  │  │                                             │  │   │
│  │  │ 🏗️ Layer Parameters:                       │  │   │
│  │  │ • PHY: SSB, RACH, PUSCH/PDSCH configs     │  │   │
│  │  │ • MAC: Random Access, BSR, PHR procedures │  │   │
│  │  │ • RLC: AM/UM configurations               │  │   │
│  │  │ • PDCP: Security algorithms, compression  │  │   │
│  │  │ • RRC: Connection establishment, caps     │  │   │
│  │  │ • NAS: Registration, auth, session setup  │  │   │
│  │  │                                             │  │   │
│  │  │        [🎯 Execute Test] [📄 Details]      │  │   │
│  │  └─────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🏃 Active Executions Tab

```
┌─────────────────────────────────────────────────────────────┐
│                   🏃 ACTIVE EXECUTIONS                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📊 RUNNING TESTS:                                          │
│                                                             │
│  🔄 5G NR Initial Attach Procedure                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ⏱️  Started: 10:45:23 AM                            │   │
│  │ 📊 Progress: ████████████████████░░░░  75%           │   │
│  │ 📍 Current: PDU Session Establishment                │   │
│  │ ⏳ ETA: 00:00:32 remaining                           │   │
│  │ 📈 Messages Sent: 4/6                               │   │
│  │                                                      │   │
│  │ 🔍 Real-time Status:                                │   │
│  │ • RRC Connection: ✅ Established                     │   │
│  │ • NAS Registration: ✅ Complete                      │   │
│  │ • Authentication: ✅ Successful                      │   │
│  │ • PDU Session: 🔄 In Progress                       │   │
│  │                                                      │   │
│  │        [⏸️ Pause] [⏹️ Stop] [👁️ Monitor]           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  📋 EXECUTION QUEUE (3 pending):                           │
│  • LTE Attach Procedure                                    │
│  • VoLTE Call Setup                                        │
│  • Handover Test Case                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Recent Results Tab

```
┌─────────────────────────────────────────────────────────────┐
│                    📊 RECENT RESULTS                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📈 EXECUTION HISTORY:                                      │
│                                                             │
│  ✅ 5G NR Registration Update                              │
│     ⏱️ 10:42:15 AM | ⏱️ Duration: 1m 23s | 📊 Success      │
│     📈 Messages: 5/5 | 🎯 All layers verified             │
│                                                             │
│  ✅ LTE Attach Procedure                                   │
│     ⏱️ 10:38:42 AM | ⏱️ Duration: 2m 15s | 📊 Success      │
│     📈 Messages: 8/8 | 🎯 Performance: Excellent          │
│                                                             │
│  ❌ VoLTE Call Setup                                       │
│     ⏱️ 10:35:20 AM | ⏱️ Duration: 0m 45s | 📊 Failed       │
│     ⚠️ Error: IMS registration timeout                     │
│                                                             │
│  ✅ O-RAN F1 Interface Test                               │
│     ⏱️ 10:32:18 AM | ⏱️ Duration: 3m 02s | 📊 Success      │
│     📈 Messages: 12/12 | 🎯 All interfaces active         │
│                                                             │
│  📊 STATISTICS:                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Total Tests: 24 | Success: 22 | Failed: 2          │   │
│  │ Success Rate: 91.7%                                 │   │
│  │ Avg Duration: 1m 45s                               │   │
│  │ Most Used: 5G NR tests (45%)                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Backend Services Monitor Tab

```
┌─────────────────────────────────────────────────────────────┐
│                🔧 BACKEND SERVICES MONITOR                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🏗️ SERVICE STATUS:                                         │
│                                                             │
│  ✅ Database Service                                        │
│     🔗 Status: Connected | 📊 Queries: 1,247 | ⚡ 15ms     │
│                                                             │
│  ✅ Test Case Playback Service                             │
│     🎬 Status: Ready | 🎭 Active Sessions: 1 | 📈 Queue: 3  │
│                                                             │
│  ✅ Enhanced Test Case Manager                             │
│     📚 Status: Active | 🧪 Test Cases: 1,847 | 🔄 Cached   │
│                                                             │
│  ✅ API Integration Service                                │
│     🌐 Status: Connected | 📡 Endpoints: 12/12 | ⚡ 28ms    │
│                                                             │
│  ✅ Supabase Client                                        │
│     ☁️ Status: Connected | 📊 Sync: Real-time | 🔐 Auth: ✓  │
│                                                             │
│  ✅ WebSocket Service                                       │
│     🔌 Status: Active | 👥 Connections: 1 | 📊 Events: 456  │
│                                                             │
│  ✅ Real-time Processor                                    │
│     ⚡ Status: Processing | 🔄 Messages/sec: 45 | 📈 Queue: 0 │
│                                                             │
│  ✅ Test Execution Service                                 │
│     🎯 Status: Ready | 🏃 Active: 1 | ✅ Completed: 24      │
│                                                             │
│  📊 SYSTEM HEALTH:                                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ CPU Usage: ████████░░ 78%                          │   │
│  │ Memory: ██████░░░░ 62%                              │   │
│  │ Network: ████░░░░░░ 34%                             │   │
│  │ Uptime: 4h 23m                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 5GLabX Navigation Sidebar (Below Test Manager)

```
┌─────────────────────────────────────────────────────────────┐
│                   🔧 5GLABX NAVIGATION                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📡 PROTOCOL LAYERS:                                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📶 PHY Layer           🔴 Live Data       [Select] │   │
│  │ 📊 MAC Layer           🟢 Active         [Select] │   │
│  │ 🔄 RLC Layer           🟡 Processing     [Select] │   │
│  │ 📦 PDCP Layer          🟢 Active         [Select] │   │
│  │ 📻 RRC Layer           🔴 Live Data       [Select] │   │
│  │ 🌐 NAS Layer           🟢 Active         [Select] │   │
│  │ ☎️ IMS Layer           🟡 Processing     [Select] │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  📊 ANALYSIS VIEWS:                                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📄 Logs View           📈 456 messages   [Select] │   │
│  │ ⚡ Enhanced Logs       🔍 Detailed      [Select] │   │
│  │ 📊 Analytics View      📈 Real-time     [Select] │   │
│  │ 🔍 Layer Trace View    🎯 Active        [Select] │   │
│  │ 📞 Call Flow View      🔄 Sequence      [Select] │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  🌐 SPECIALIZED ANALYSIS:                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🏗️ O-RAN Analysis      📡 Interfaces    [Select] │   │
│  │ 🚗 V2X Analysis        🛣️ Sidelink      [Select] │   │
│  │ 🛰️ NTN Analysis        🌍 Satellite     [Select] │   │
│  │ 📡 NB-IoT Analysis     🔋 Low Power     [Select] │   │
│  │ 🏢 5G Core Analysis    ☁️ Cloud Native   [Select] │   │
│  │ 📞 Legacy Network      📶 2G/3G/4G      [Select] │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  🎛️ SYSTEM CONTROLS:                                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ⚙️ Settings            🔧 Configure     [Access]  │   │
│  │ 📊 System Monitor      📈 Performance   [Access]  │   │
│  │ 🔍 Search & Filter     🔎 Find Data     [Access]  │   │
│  │ 📤 Export Data         💾 Save Results  [Access]  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 📱 Main Content Area Views

### When PHY Layer is Selected:
```
┌───────────────────────────────────────────────────────────────────────────────┐
│                           📶 PHY LAYER ANALYSIS                               │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  📊 REAL-TIME PHY METRICS (from active test execution):                      │
│                                                                               │
│  🎯 SSB Detection:                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐     │
│  │ RSRP: -85 dBm | RSRQ: -12 dB | SINR: 18 dB | PCI: 1              │     │
│  │ SSB Index: 4/8 | Frequency: 3.5 GHz | Bandwidth: 100 MHz          │     │
│  └─────────────────────────────────────────────────────────────────────┘     │
│                                                                               │
│  🎯 RACH Procedure (from test execution):                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐     │
│  │ Preamble: Format 0 | RA-RNTI: 0x002A | RAPID: 15                  │     │
│  │ Timing Advance: 12 | Power Ramping: +3dB | Attempts: 1/4          │     │
│  │ Status: ✅ Success | RAR Received: Yes | Contention: Resolved      │     │
│  └─────────────────────────────────────────────────────────────────────┘     │
│                                                                               │
│  📈 THROUGHPUT ANALYSIS:                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐     │
│  │          UL Throughput    ████████████░░░░  75 Mbps                │     │
│  │          DL Throughput    ██████████████░░  120 Mbps               │     │
│  │          BLER Rate        ██░░░░░░░░░░░░░░  0.1%                    │     │
│  └─────────────────────────────────────────────────────────────────────┘     │
│                                                                               │
│  🔄 DATA UPDATING FROM TEST: "5G NR Initial Attach Procedure"               │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘
```

### When Enhanced Logs is Selected:
```
┌───────────────────────────────────────────────────────────────────────────────┐
│                        ⚡ ENHANCED LOGS VIEW                                  │
├───────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  🕒 REAL-TIME MESSAGE FLOW (from active test execution):                     │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐     │
│  │ 10:45:23.156 | UL   | NAS | Registration Request                   │     │
│  │ ├─ Message Type: 0x41 (Registration Request)                       │     │
│  │ ├─ 5G-GUTI: [PLMN: 001-01] [AMF: 0x8001] [TMSI: 0x12345678]      │     │
│  │ ├─ UE Security Capability: [EA: 0x80] [IA: 0x80]                  │     │
│  │ └─ Requested NSSAI: [SST: 1] [SD: 0x000001]                       │     │
│  │                                                                     │     │
│  │ 10:45:23.234 | DL   | NAS | Authentication Request                │     │
│  │ ├─ Message Type: 0x56 (Authentication Request)                     │     │
│  │ ├─ Authentication Parameter RAND: 0x1234...                        │     │
│  │ ├─ Authentication Parameter AUTN: 0x5678...                        │     │
│  │ └─ ngKSI: 0x07                                                     │     │
│  │                                                                     │     │
│  │ 10:45:23.298 | UL   | NAS | Authentication Response               │     │
│  │ ├─ Message Type: 0x57 (Authentication Response)                    │     │
│  │ └─ Authentication Response Parameter RES: 0x9ABC...                │     │
│  │                                                                     │     │
│  │ 🔄 LIVE: Test execution in progress...                             │     │
│  └─────────────────────────────────────────────────────────────────────┘     │
│                                                                               │
│  🔍 MESSAGE DECODE ANALYSIS:                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐     │
│  │ Current Message: Registration Request                               │     │
│  │ Compliance: ✅ 3GPP TS 24.501 compliant                           │     │
│  │ Layer: NAS (Layer 3)                                               │     │
│  │ Direction: UE → AMF                                                │     │
│  │ Security: Not protected (initial message)                          │     │
│  │ Information Elements: 8 mandatory, 12 optional present            │     │
│  └─────────────────────────────────────────────────────────────────────┘     │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘
```

## 🎯 Key Features of the Layout:

### ✅ **Integrated Test Manager**
- **Location**: Top of sidebar (384px wide)
- **Tabs**: Test Library, Active Executions, Recent Results, Backend Services
- **Real-time**: Live test execution monitoring
- **Supabase**: 1800+ test cases loaded and accessible

### ✅ **Complete 5GLabX Navigation**
- **Protocol Layers**: PHY, MAC, RLC, PDCP, RRC, NAS, IMS (7 layers)
- **Analysis Views**: Logs, Enhanced Logs, Analytics, Layer Trace, Call Flow
- **Specialized**: O-RAN, V2X, NTN, NB-IoT, 5G Core, Legacy Network

### ✅ **Real-time Data Flow**
- **From**: Test Manager execution
- **To**: All 5GLabX protocol layers and analysis views  
- **Method**: Custom events (5GLABX_TEST_EXECUTION) + DataFlowProvider
- **Result**: Live updates in all views without manual refresh

### ✅ **Professional UI**
- **Style**: Industry-standard (QXDM/Keysight compatible)
- **Colors**: Status indicators (🔴 Live, 🟢 Active, 🟡 Processing)
- **Icons**: Professional iconography with Lucide React
- **Layout**: Responsive and organized for professional use

**🎯 This layout provides the complete integrated experience with seamless data flow from Test Manager to all 5GLabX analysis components!**
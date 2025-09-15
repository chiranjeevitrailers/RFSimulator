# 5GLabX Test Case Data Flow Architecture

## Overview

The 5GLabX platform implements a comprehensive data flow architecture that connects test case data from the database through multiple processing layers to the frontend components. This document explains how test case data flows into 5GLabX and gets distributed to different layers and components.

## Architecture Components

### 1. Data Sources Layer

#### Database Layer (Supabase/PostgreSQL)
- **Location**: `/supabase/` directory
- **Content**: 1000+ 3GPP-compliant test cases
- **Structure**: 
  - `test_cases` table with test case metadata
  - `test_case_messages` table with expected messages
  - `test_case_information_elements` table with IEs
  - `test_case_layer_parameters` table with layer-specific parameters
- **API Access**: Next.js API routes (`/api/test-cases/comprehensive`)

#### CLI Backend (srsRAN/Open5GS/Kamailio)
- **Location**: `/services/cli/` and `/services/backend/`
- **Components**:
  - `CLIBridge.js` - Connects to CLI backends
  - `CLIManager.js` - Manages CLI processes
  - `CLIHealthCheck.js` - Monitors CLI health
  - `ProcessMonitor.js` - Monitors backend processes

### 2. Data Ingestion Layer

#### Test Case Playback Service
- **File**: `/services/TestCasePlaybackService.js`
- **Purpose**: Streams test case data as if coming from live CLIs
- **Key Functions**:
  - `startPlayback()` - Loads test case data and creates timeline
  - `#emitNext()` - Streams messages at correct timing
  - `#toLogEntry()` - Converts test data to log format
- **Integration**: Connected to WebSocket for real-time streaming

#### WebSocket Service
- **File**: `/services/WebSocketService.js`
- **Purpose**: Real-time data streaming between backend and frontend
- **Features**:
  - Automatic reconnection
  - Message broadcasting
  - Connection status monitoring
- **URL**: `ws://localhost:8081`

#### Real-Time Data Bridge
- **File**: `/services/RealTimeDataBridge.js`
- **Purpose**: Connects CLI backend to frontend
- **Key Functions**:
  - `setupDataFlow()` - Establishes data flow connections
  - `processCLIData()` - Processes incoming CLI data
  - `notifySubscribers()` - Distributes data to components

### 3. Processing Layer

#### Stream Processor
- **File**: `/services/StreamProcessor.js`
- **Purpose**: Processes data streams in real-time
- **Features**:
  - Batch processing (100ms intervals)
  - Source-specific processors (srsRAN, Open5GS, Kamailio)
  - Data adaptation and transformation

#### Log Processor
- **File**: `/services/LogProcessor.js`
- **Purpose**: Parses and processes log data
- **Key Functions**:
  - `processLogLine()` - Parses individual log lines
  - `formatIEs()` - Formats Information Elements
  - `notifyCallbacks()` - Notifies subscribers

#### Message Analyzer
- **File**: `/services/MessageAnalyzer.js`
- **Purpose**: Analyzes message patterns and calculates KPIs
- **Features**:
  - Statistical analysis
  - KPI calculation (error rate, throughput, latency)
  - Timeline visualization
  - Message correlation

#### Layer Stats Service
- **File**: `/services/LayerStatsService.js`
- **Purpose**: Calculates layer-specific statistics
- **Supported Layers**:
  - PHY: RSRP, SINR, channel measurements
  - MAC: HARQ, scheduling, grants
  - RRC: Connection management, handovers
  - NAS: Registration, authentication
  - SIP: SIP signaling, call flows

### 4. Layer-Specific Processors

#### PHY Metrics Processor
- **File**: `/services/PhyMetricsProcessor.js`
- **Purpose**: Processes physical layer metrics
- **Data**: RSRP, SINR, PDSCH/PUSCH data, channel analysis

#### NB-IoT Log Processor
- **File**: `/services/NBIoTLogProcessor.js`
- **Purpose**: Processes NB-IoT specific logs
- **Data**: NPRACH, power optimization, coverage analysis

#### V2X Log Processor
- **File**: `/services/V2xLogProcessor.js`
- **Purpose**: Processes V2X communication logs
- **Data**: Sidelink communication, vehicle scenarios, safety applications

#### NTN Log Processor
- **File**: `/services/NtnLogProcessor.js`
- **Purpose**: Processes Non-Terrestrial Network logs
- **Data**: Satellite links, Doppler analysis, timing compensation

### 5. Analyzers

#### 3GPP Message Analyzer
- **File**: `/services/analyzers/ThreeGPPMessageAnalyzer.js`
- **Purpose**: Analyzes 3GPP-compliant messages
- **Features**: Message validation, IE analysis, standard compliance

#### O-RAN Message Correlator
- **File**: `/services/OranMessageCorrelator.js`
- **Purpose**: Correlates O-RAN interface messages
- **Features**: F1/E1 interface analysis, CU/DU correlation

### 6. Data Distribution Layer

#### WebSocket Broadcast System
- **Purpose**: Real-time updates to all connected clients
- **Features**: Event-driven distribution, multiple subscribers

#### Callback System
- **Purpose**: Component subscriptions and notifications
- **Features**: Error handling, recovery mechanisms

### 7. Frontend Integration

#### Service Integration
- **File**: `/components/5glabx/services/ServiceIntegration.tsx`
- **Purpose**: Initializes and wires all backend services
- **Services Integrated**:
  - WebSocketService
  - TestCasePlaybackService
  - RealTimeDataBridge
  - StreamProcessor
  - LayerStatsService
  - LogProcessor
  - MessageAnalyzer
  - CLIBridge
  - All layer-specific processors
  - All analyzers

#### Data Flow Integration
- **File**: `/components/5glabx/services/DataFlowIntegration.tsx`
- **Purpose**: Manages data flow between services and components
- **Features**:
  - Real-time data distribution
  - Layer-specific subscriptions
  - Test case execution management
  - Data flow monitoring

#### API Integration
- **File**: `/components/5glabx/services/APIIntegration.tsx`
- **Purpose**: Connects frontend to all API routes
- **API Endpoints**:
  - `/api/test-cases/comprehensive` - Test case management
  - `/api/test-execution/comprehensive` - Test execution
  - `/api/tests/runs` - Test run management
  - `/api/simulation/stream` - Simulation control
  - `/api/test-cases/volte-vonr-conference-ims` - IMS flows
  - `/api/test-execution/attach-flow` - Attach flow data

### 8. View Components

#### React Wrapper System
- **File**: `/components/5glabx/views/ViewWrappers.tsx`
- **Purpose**: Wraps JavaScript components for React integration
- **Components Wrapped**:
  - All O-RAN views (9 components)
  - All NB-IoT views (7 components)
  - All V2X views (7 components)
  - All NTN views (7 components)
  - All protocol layer views (7 components)
  - All core network views (6 components)
  - All 4G legacy views (3 components)
  - All utility views (3 components)

#### Test Case Data Flow Component
- **File**: `/components/5glabx/components/TestCaseDataFlow.tsx`
- **Purpose**: Demonstrates complete data flow architecture
- **Features**:
  - Test case selection and execution
  - Real-time data flow visualization
  - Layer status monitoring
  - Data flow architecture display

## Data Flow Process

### 1. Test Case Loading
```
Database → API Routes → TestCasePlaybackService → Timeline Creation → WebSocket Stream
```

### 2. Real-time Processing
```
CLI Data → RealTimeDataBridge → StreamProcessor → LogProcessor → MessageAnalyzer
```

### 3. Layer Distribution
```
Processed Data → LayerStatsService → Layer-specific Views
```

### 4. Frontend Updates
```
WebSocket → Callback System → Component Updates → UI Refresh
```

## Key Features

### Real-time Streaming
- WebSocket-based real-time updates
- Configurable playback speed
- Automatic reconnection
- Error isolation

### Layer-specific Processing
- PHY: RSRP, SINR, channel measurements
- MAC: HARQ, scheduling, grants
- RRC: Connection management, handovers
- NAS: Registration, authentication
- IMS: SIP signaling, call flows

### Advanced Analytics
- KPI calculation (error rate, throughput, latency)
- Statistical analysis by component/layer
- Timeline visualization
- Message correlation

### Flexible Architecture
- Feature flag controlled
- Graceful fallback mechanisms
- Error isolation
- Zero-risk deployment

## Integration Status

✅ **Completed Integrations**:
- All services wired to frontend
- All JavaScript views wrapped for React
- API routes connected to frontend
- CLI backend services integrated
- Layer-specific processors connected
- Analyzers connected to views
- Complete data flow architecture implemented

## Usage

1. **Start the Platform**: Navigate to the 5GLabX platform
2. **Select Test Case**: Use the "Test Case Data Flow" view to select a test case
3. **Execute Test Case**: Click "Start" to begin test case execution
4. **Monitor Data Flow**: Watch real-time data flow through all layers
5. **View Layer Data**: Navigate to specific layer views to see detailed analysis

## Benefits

- **Comprehensive Coverage**: All 5G protocol layers supported
- **Real-time Analysis**: Live data processing and visualization
- **Scalable Architecture**: Easy to add new layers and protocols
- **Standards Compliant**: 3GPP-compliant test cases and analysis
- **Production Ready**: Robust error handling and monitoring

This architecture ensures that test case data flows seamlessly from the database through multiple processing layers to the appropriate frontend components, providing real-time analysis and visualization capabilities for comprehensive 5G protocol testing.
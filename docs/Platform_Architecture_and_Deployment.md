# 5GLabX Platform - Architecture & Deployment Guide

## 🌐 Platform Type: Web-Based Application

### **Deployment Model**
The 5GLabX Platform is a **web-based application** that runs in the browser with no local installation required.


┌─────────────────────────────────────────────────────────────┐
│                Platform Deployment Architecture             │
├─────────────────────────────────────────────────────────────┤
│ User Browser ← → Web Server ← → CLI Tools (Local/Remote)   │
│     ↓              ↓                ↓                      │
│ React App ← → WebSocket/HTTP ← → CLI Parsers               │
│     ↓              ↓                ↓                      │
│ UI Components ← → Real-time Data ← → Log Processors        │
└─────────────────────────────────────────────────────────────┘


### **How It Works**

#### **1. Frontend (Browser-Based)**
html
<!-- index.html - Runs entirely in browser -->
<!DOCTYPE html>
<html>
<head>
    <!-- React 18 + TailwindCSS + Lucide Icons -->
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <div id="root"></div>
    <!-- All components loaded as separate JS files -->
    <script type="text/babel" src="app.js"></script>
</body>
</html>


#### **2. No Backend Server Required (Initially)**
- Platform starts with **mock data** for immediate use
- All processing happens in the browser
- No server installation needed for basic functionality

#### **3. CLI Integration Architecture**

Browser Application ← → WebSocket/HTTP ← → CLI Bridge ← → CLI Tools


---

## 🔌 CLI Integration: How Log Detection Works

### **Architecture for CLI Log Detection**

javascript
// Real-time log detection pipeline
CLI Tools (srsRAN/Open5GS/Kamailio) → CLI Readers → WebSocket → Browser
     ↓                                      ↓           ↓         ↓
Log Output                            Parse & Process  Stream    Display


### **1. CLI Tool Log Monitoring**

#### **srsRAN Log Detection**
javascript
// services/cli/SrsranCliParser.js
class SrsranCliParser {
    parseLogLine(line) {
        // Detect srsRAN log format: 2024-01-15T10:30:45.123 [INFO] [PHY] message
        const timestamp = this.extractTimestamp(line);
        const level = this.extractLogLevel(line);
        const component = this.extractComponent(line); // PHY, MAC, RLC, etc.
        const metrics = this.extractPhyMetrics(line);  // RSRP, RSRQ, SINR
        
        return new LogEntry({
            timestamp, level, source: 'srsran', 
            component, message, metrics
        });
    }
}


#### **Open5GS Log Detection**
javascript
// services/cli/Open5gsCliParser.js  
class Open5gsCliParser {
    parseLogLine(line) {
        // Detect Open5GS format: 01/15 10:30:45.123 INFO [amf-ngap] message
        const timestamp = this.extractTimestamp(line);
        const nfFunction = this.extractNfFunction(line); // amf, smf, upf
        const procedure = this.extractProcedure(line);   // ngap, nas, pfcp
        
        return new LogEntry({
            timestamp, level, source: 'open5gs',
            component: nfFunction, layer: procedure, message
        });
    }
}


#### **Kamailio Log Detection**
javascript
// services/cli/KamailioCliParser.js
class KamailioCliParser {
    parseLogLine(line) {
        // Detect Kamailio format: Jan 15 10:30:45 ims[1234]: INFO: module message
        const timestamp = this.extractTimestamp(line);
        const module = this.extractModule(line);      // tm, sl, rr, registrar
        const sipMethod = this.extractSipMethod(line); // INVITE, REGISTER, BYE
        
        return new LogEntry({
            timestamp, level, source: 'kamailio',
            component: module, layer: 'sip', message
        });
    }
}


### **2. Automatic Log Detection Process**

#### **Log Source Detection**
javascript
// services/LogProcessor.js
detectCliSource(line) {
    // Automatic detection based on log patterns
    if (line.includes('[PHY]') || line.includes('srsran')) {
        return 'srsran';
    }
    if (line.includes('[amf') || line.includes('open5gs')) {
        return 'open5gs';  
    }
    if (line.includes('kamailio') || line.includes('SIP/')) {
        return 'kamailio';
    }
    return 'unknown';
}


#### **Real-time Processing Pipeline**
javascript
// Continuous log processing
async processLogFile(fileContent, fileName) {
    const lines = fileContent.split('\n');
    
    for (const line of lines) {
        if (line.trim()) {
            const logEntry = await this.processLogLine(line, fileName);
            if (logEntry) {
                this.addToBuffer(logEntry);
                this.notifyCallbacks(logEntry); // Real-time updates
            }
        }
    }
}


---

## 🚀 Deployment Options

### **Option 1: Standalone Web Application (Current)**

┌─────────────────────────────────────────┐
│ User opens browser                      │
│ ↓                                       │
│ Loads 5GLabX Platform (HTML/JS/CSS)    │
│ ↓                                       │
│ Platform runs with mock data           │
│ ↓                                       │
│ Ready to use immediately!               │
└─────────────────────────────────────────┘


**Advantages**:
- ✅ No installation required
- ✅ Works immediately with mock data
- ✅ Cross-platform (any OS with browser)
- ✅ Zero setup time

### **Option 2: Web Server + CLI Integration**

┌─────────────────────────────────────────┐
│ Web Server hosts platform              │
│ ↓                                       │
│ CLI Bridge connects to tools            │
│ ↓                                       │
│ Real-time log streaming                 │
│ ↓                                       │
│ Browser displays live data              │
└─────────────────────────────────────────┘


**For Real CLI Integration**:
javascript
// Enable real CLI connections
FeatureFlags.enable('REAL_SRSRAN_DATA');
FeatureFlags.enable('REAL_OPEN5GS_DATA');
FeatureFlags.enable('REAL_KAMAILIO_DATA');


---

## 📡 Real-time Log Streaming Architecture

### **WebSocket-Based Real-time Updates**

javascript
// services/WebSocketService.js
class WebSocketService {
    // Real-time CLI data streaming
    enableRealTimeStreaming() {
        this.streamingEnabled = true;
        this.startHeartbeat();
    }
    
    processCLIData(data) {
        // Buffer CLI data for processing
        this.messageBuffer.push(data);
        this.emit('cli_stream', data); // Real-time updates
    }
}


### **How Logs Are Automatically Detected**

#### **1. File System Monitoring**
bash
# CLI tools write logs to standard locations
srsRAN:    /var/log/srsran/
Open5GS:   /var/log/open5gs/
Kamailio:  /var/log/kamailio/


#### **2. Real-time Log Tailing**
javascript
// Conceptual log monitoring
tail -f /var/log/srsran/gnb.log | WebSocket → Browser
tail -f /var/log/open5gs/amf.log | WebSocket → Browser  
tail -f /var/log/kamailio/kamailio.log | WebSocket → Browser


#### **3. Automatic Parser Selection**
javascript
// LogProcessor automatically selects parser
const source = this.detectCliSource(line);
const parser = this.parserFactory.getParser(source);
const logEntry = parser.parseLogLine(line);


---

## 🔧 Installation & Setup Options

### **Option A: Immediate Use (No Installation)**
bash
# Simply open in web browser
1. Download/clone repository
2. Open index.html in browser
3. Platform loads with mock data
4. Ready to use immediately!


### **Option B: Local Web Server**
bash
# For development/testing
python -m http.server 8000
# or
npx serve .
# Then open: http://localhost:8000


### **Option C: Production Deployment**
bash
# Deploy to web server
1. Copy files to web server directory
2. Configure CLI bridge (optional)
3. Set up WebSocket server (for real-time)
4. Enable CLI integration features


---

## 🔄 How Real CLI Integration Works

### **1. CLI Tool Detection**
javascript
// Automatic CLI tool discovery
CLIEnvironmentValidator.validateEnvironment() → {
    checkSrsranInstallation()   // Look for srsRAN binaries
    checkOpen5gsInstallation()  // Look for Open5GS services
    checkKamailioInstallation() // Look for Kamailio process
}


### **2. Log File Monitoring**
javascript
// Real-time log file monitoring
RealSrsranReader.startMonitoring() → {
    monitorLogFiles()           // Watch log files for changes
    parseNewEntries()           // Parse new log entries
    streamToWebSocket()         // Send to browser
}


### **3. WebSocket Communication**
javascript
// Browser ← → WebSocket ← → CLI Tools
WebSocketService.connect() → {
    establishConnection()       // Connect to WebSocket server
    enableRealTimeStreaming()   // Enable live data streaming
    processIncomingData()       // Process CLI data
}


---

## 💡 Key Benefits of Web-Based Architecture

### **✅ Immediate Usability**
- No installation required
- Works with mock data instantly
- Cross-platform compatibility
- Zero setup time

### **✅ Scalable Integration**
- Start with mock data
- Enable CLI integration when ready
- Gradual feature enablement
- Production-ready scaling

### **✅ Safety & Reliability**
- Zero-risk deployment
- Instant rollback capability
- Graceful degradation
- Emergency shutdown

### **✅ Real-time Capabilities**
- Live log streaming
- Real-time metrics
- Instant updates
- Performance monitoring

---

## 🎯 Summary

**The 5GLabX Platform is a web-based application that:**

1. **Runs in any modern browser** - No installation required
2. **Starts with mock data** - Immediate usability
3. **Supports real CLI integration** - When CLI tools are available
4. **Automatically detects logs** - Real-time parsing and streaming
5. **Provides zero-risk operation** - Safe deployment and rollback

**Perfect for both development and production environments!** 🚀

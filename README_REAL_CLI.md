# 5GLabX Platform - Real CLI Log Integration

## 🚀 Real-Time CLI Log Analysis Setup

This guide explains how to set up the 5GLabX platform to monitor **real CLI logs** from srsRAN, Open5GS, and Kamailio instead of using mock data.

## 📋 Prerequisites

### System Requirements
- **Node.js**: 16+ (for backend server)
- **srsRAN**: Installed and configured
- **Open5GS**: Core network installed
- **Kamailio**: IMS server installed
- **Log Files**: Access to log directories

### Directory Permissions
```bash
# Ensure log directories are accessible
sudo mkdir -p /var/log/srsran
sudo mkdir -p /var/log/open5gs
sudo mkdir -p /var/log/kamailio

# Set appropriate permissions
sudo chown -R $USER:$USER /var/log/srsran
sudo chown -R $USER:$USER /var/log/open5gs
sudo chown -R $USER:$USER /var/log/kamailio
```

## 🛠️ Installation & Setup

### 1. Install Dependencies
```bash
cd /path/to/5glabx-platform
npm install
```

### 2. Configure Log File Paths
Edit `config/log-paths.json` to match your system:

```json
{
  "srsran": {
    "primary": "/var/log/srsran/enb.log",
    "fallback": ["/tmp/srsran.log", "./logs/srsran.log"]
  },
  "open5gs": {
    "primary": "/var/log/open5gs/mme.log",
    "fallback": ["/var/log/open5gs/smf.log", "./logs/open5gs.log"]
  },
  "kamailio": {
    "primary": "/var/log/kamailio.log",
    "fallback": ["/tmp/kamailio.log", "./logs/kamailio.log"]
  }
}
```

### 3. Start the Backend Server
```bash
# Start the real CLI log monitoring server
npm run server

# Or for development with auto-restart
npm run server-dev
```

The server will start on:
- **HTTP API**: http://localhost:8080
- **WebSocket**: ws://localhost:8081

### 4. Start the Frontend
```bash
# In a new terminal, start the Electron app
npm run dev

# Or run both server and frontend together
npm run dev-full
```

## 🔧 CLI Tool Configuration

### srsRAN Setup
```bash
# Configure srsRAN to write logs to monitored location
# Edit srsRAN configuration file
log:
  filename: /tmp/srsran.log
  level: info

# Start srsRAN
srsenb --rf.device=zmq --log.filename=/tmp/srsran.log
```

### Open5GS Setup
```bash
# Configure Open5GS logging
# Edit /etc/open5gs/mme.yaml
logger:
  file: /var/log/open5gs/mme.log

# Start Open5GS components
sudo systemctl start open5gs-mmed
sudo systemctl start open5gs-smfd
sudo systemctl start open5gs-upfd
```

### Kamailio Setup
```bash
# Configure Kamailio logging
# Edit /etc/kamailio/kamailio.cfg
log_facility=LOG_LOCAL0
log_prefix="KAMAILIO: "

# Start Kamailio
kamailio -f /etc/kamailio/kamailio.cfg -DD -E
```

## 📊 Real-Time Monitoring

### Backend Server Status
Check server health:
```bash
curl http://localhost:8080/health
```

Expected response:
```json
{
  "status": "ok",
  "clients": 1,
  "cliProcesses": ["srsran"],
  "logWatchers": ["srsran"]
}
```

### CLI Process Management
```bash
# Start a CLI tool via API
curl -X POST http://localhost:8080/api/cli/start/srsran

# Stop a CLI tool
curl -X POST http://localhost:8080/api/cli/stop/srsran

# Check CLI status
curl http://localhost:8080/api/cli/status
```

### Log File Monitoring
The backend automatically:
- ✅ Monitors log files for new entries
- ✅ Parses logs in real-time
- ✅ Broadcasts parsed data via WebSocket
- ✅ Maintains connection to running CLI processes
- ✅ Handles log rotation and file recreation

## 🎯 Using Real Logs in Enhanced Components

### MACStats Component
The enhanced MACStats component now displays:
- **Real HARQ metrics** from srsRAN logs
- **Live throughput data** extracted from log messages
- **Actual RNTI tracking** from running UEs
- **Real-time scheduling statistics**

### RRCStats Component
The enhanced RRCStats component shows:
- **Live connection procedures** from srsRAN RRC logs
- **Real handover events** with success/failure rates
- **Actual security mode commands** and completions
- **UE-specific RRC statistics** from live network

### Data Flow
```
CLI Tools → Log Files → File Watchers → Backend Parser → WebSocket → Enhanced Components
     ↓            ↓            ↓              ↓            ↓            ↓
srsRAN     /tmp/srsran.log  fs.watch()    Real-Time     ws://8081    MACStats.js
Open5GS    /var/log/open5gs  tail -f      Parsing       Broadcast    RRCStats.js
Kamailio   /var/log/kamailio  inotify     Metrics       Live Data    Dashboards
```

## 🔍 Troubleshooting

### Backend Server Issues
```bash
# Check if server is running
ps aux | grep server.js

# Check server logs
tail -f server.log

# Restart server
npm run server-dev
```

### Log File Access Issues
```bash
# Check log file permissions
ls -la /var/log/srsran/

# Test log file creation
echo "test log" >> /tmp/srsran.log

# Check if file watcher is active
curl http://localhost:8080/health
```

### WebSocket Connection Issues
```bash
# Check WebSocket port
netstat -tlnp | grep 8081

# Test WebSocket connection
# Open browser console and check for connection errors
```

### CLI Tool Issues
```bash
# Check if CLI tools are running
ps aux | grep srsenb
ps aux | grep open5gs
ps aux | grep kamailio

# Check CLI tool logs
tail -f /tmp/srsran.log
tail -f /var/log/open5gs/mme.log
tail -f /var/log/kamailio.log
```

## 📈 Performance Optimization

### Log Processing
- **Batch Processing**: Logs processed in batches for efficiency
- **Buffer Management**: Automatic cleanup of old log entries
- **Memory Limits**: Configurable buffer sizes to prevent memory issues

### WebSocket Streaming
- **Connection Pooling**: Efficient client connection management
- **Message Filtering**: Clients receive only subscribed log sources
- **Reconnection Logic**: Automatic reconnection on connection loss

### File Watching
- **Efficient Monitoring**: Uses native file system events
- **Position Tracking**: Remembers last read position in log files
- **Rotation Handling**: Automatically handles log file rotation

## 🚀 Production Deployment

### Systemd Service Setup
```bash
# Create systemd service for backend server
sudo tee /etc/systemd/system/5glabx-server.service > /dev/null <<EOF
[Unit]
Description=5GLabX Real CLI Log Server
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=/path/to/5glabx-platform
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
sudo systemctl enable 5glabx-server
sudo systemctl start 5glabx-server
```

### Log Rotation Configuration
```bash
# Configure logrotate for application logs
sudo tee /etc/logrotate.d/5glabx > /dev/null <<EOF
/var/log/5glabx/*.log {
    daily
    rotate 7
    compress
    missingok
    notifempty
    create 0644 $USER $USER
    postrotate
        systemctl reload 5glabx-server
    endscript
}
EOF
```

## 📊 Monitoring & Metrics

### Real-Time Metrics
- **Log Processing Rate**: Logs processed per second
- **WebSocket Connections**: Active client connections
- **CLI Process Status**: Running CLI tool status
- **File Watcher Health**: Log file monitoring status

### Health Checks
```bash
# Comprehensive health check
curl http://localhost:8080/health

# CLI process status
curl http://localhost:8080/api/cli/status

# Log buffer status
curl http://localhost:8080/api/logs/srsran?limit=10
```

## 🎯 Next Steps

### Advanced Features
1. **Log Aggregation**: Combine logs from multiple sources
2. **Alert System**: Real-time alerting on log patterns
3. **Historical Analysis**: Long-term log storage and analysis
4. **Multi-Node Support**: Monitor logs from multiple servers

### Integration Options
1. **Database Storage**: Store parsed logs in PostgreSQL/MongoDB
2. **External Monitoring**: Integration with Prometheus/Grafana
3. **API Integration**: REST API for external log sources
4. **Plugin System**: Extensible parser architecture

## 📞 Support

### Common Issues
- **No logs appearing**: Check file permissions and paths
- **WebSocket disconnects**: Verify firewall settings
- **High CPU usage**: Adjust log processing batch sizes
- **Memory issues**: Configure appropriate buffer limits

### Debug Mode
```bash
# Enable debug logging
DEBUG=5glabx:* npm run server-dev

# Check WebSocket traffic
# Use browser dev tools to monitor WebSocket messages
```

---

## ✅ Success Checklist

- [ ] Backend server running on port 8080
- [ ] WebSocket server on port 8081
- [ ] Log files accessible and being written
- [ ] CLI tools configured with correct log paths
- [ ] Frontend connected to WebSocket
- [ ] Real logs appearing in enhanced components
- [ ] MAC and RRC statistics updating in real-time

**The 5GLabX platform is now configured for real CLI log monitoring!** 🎉
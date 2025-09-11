# 🚀 5GLabX Platform - Single-Click Installation Guide

## 🎯 One-Click Installation Options

### Option 1: Automated Ubuntu Installation (Recommended)
```bash
# Download and run the installer
wget https://raw.githubusercontent.com/your-repo/5glabx/main/install.sh
chmod +x install.sh
./install.sh
```

### Option 2: Quick Install (if files are already downloaded)
```bash
# If you have the files locally
chmod +x install.sh
./install.sh
```

### Option 3: Using npm scripts
```bash
# Install all components automatically
npm run install:all

# Check installation status
npm run install:check

# Uninstall if needed
npm run uninstall
```

### Option 4: Manual Installation (for custom setups)
Follow the step-by-step guide in `README_REAL_CLI.md`

---

## 📋 What Gets Installed

### ✅ Core Components
- **Node.js 18+** - JavaScript runtime
- **srsRAN** - 4G/5G RAN implementation
- **Open5GS** - 5G Core Network
- **Kamailio** - IMS/SIP server
- **5GLabX Platform** - Main application

### ✅ System Services
- **Backend Server** (Port 8080) - Real-time log processing
- **WebSocket Server** (Port 8081) - Live data streaming
- **Systemd Services** - Automatic startup
- **Desktop Shortcuts** - Easy access

### ✅ Configuration Files
- **CLI Tool Configs** - srsRAN, Open5GS, Kamailio
- **Log Paths** - Automatic log file detection
- **Systemd Services** - Production deployment
- **Desktop Integration** - Ubuntu application menu

---

## 🎮 Quick Start After Installation

### 1. Start the Platform
```bash
# Option A: Start both server and frontend
npm start

# Option B: Start components separately
npm run server    # Backend server
npm run dev       # Frontend app
```

### 2. Start CLI Tools (in separate terminals)
```bash
# Terminal 1: srsRAN
sudo srsenb /etc/srsran/enb.conf

# Terminal 2: Open5GS
sudo open5gs-mmed -c /etc/open5gs/mme.yaml

# Terminal 3: Kamailio
sudo kamailio -f /etc/kamailio/kamailio.cfg -DD -E
```

### 3. Access the Dashboard
- **Web Interface**: http://localhost:3000
- **API Health**: http://localhost:8080/health
- **Desktop App**: Search for "5GLabX Platform" in applications

---

## 🔧 Installation Scripts Overview

### `install.sh` - Main Installer
- **550+ lines** of automated installation
- **System compatibility checks** (Ubuntu 20.04/22.04/24.04)
- **Dependency management** (Node.js, databases, build tools)
- **CLI tool compilation** (srsRAN, Open5GS, Kamailio)
- **Configuration setup** (log paths, systemd services)
- **Error handling** and rollback capabilities

### `quick-install.sh` - Simple Wrapper
- **One-liner installation** for downloaded packages
- **GitHub integration** ready (update URL)
- **Minimal dependencies** (curl, bash)

### `install.bat` - Windows Helper
- **WSL guidance** for Windows users
- **Cross-platform instructions**
- **Ubuntu/WSL setup guidance**

---

## 📊 Installation Process Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   System Check  │ -> │ Dependencies    │ -> │ CLI Tools       │
│                 │    │ Installation    │    │ Compilation     │
│ • Ubuntu        │    │                 │    │                 │
│ • RAM/Storage   │    │ • Node.js       │    │ • srsRAN        │
│ • Internet      │    │ • Databases     │    │ • Open5GS       │
│ • Permissions   │    │ • Build Tools   │    │ • Kamailio      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
┌─────────────────┐    ┌─────────────────┐             │
│  5GLabX Setup  │ <- │ Configuration   │ <───────────┘
│                 │    │                 │
│ • Platform      │    │ • Log Paths     │
│ • Services      │    │ • Systemd       │
│ • Shortcuts     │    │ • Permissions   │
│ • Verification  │    │ • Testing       │
└─────────────────┘    └─────────────────┘
```

---

## 🎯 Post-Installation Commands

### Start Services
```bash
# Start all services
sudo systemctl start 5glabx-server
sudo systemctl start open5gs-mmed
sudo systemctl start kamailio

# Check status
sudo systemctl status 5glabx-server
```

### Monitor Logs
```bash
# Platform logs
tail -f /var/log/5glabx/server.log

# CLI tool logs
tail -f /var/log/srsran/enb.log
tail -f /var/log/open5gs/mme.log
tail -f /var/log/kamailio.log
```

### Test API
```bash
# Health check
curl http://localhost:8080/health

# CLI status
curl http://localhost:8080/api/cli/status

# Log data
curl http://localhost:8080/api/logs/srsran?limit=5
```

---

## 🔍 Troubleshooting Installation

### Common Issues & Solutions

#### **1. Permission Denied**
```bash
# Fix sudo access
sudo usermod -aG sudo $USER
# Logout and login again

# Fix log permissions
sudo chown -R $USER:$USER /var/log/srsran
sudo chown -R $USER:$USER /var/log/open5gs
sudo chown kamailio:kamailio /var/log/kamailio.log
```

#### **2. Compilation Errors**
```bash
# Install missing dependencies
sudo apt install -y build-essential cmake git

# Clean and retry
cd /tmp/srsRAN && rm -rf build && mkdir build && cd build
cmake ../ && make -j$(nproc)
```

#### **3. Port Conflicts**
```bash
# Check port usage
sudo netstat -tlnp | grep :8080
sudo netstat -tlnp | grep :8081

# Kill conflicting processes
sudo fuser -k 8080/tcp
sudo fuser -k 8081/tcp
```

#### **4. Service Failures**
```bash
# Check service logs
sudo journalctl -u 5glabx-server -f
sudo journalctl -u open5gs-mmed -f
sudo journalctl -u kamailio -f

# Restart services
sudo systemctl restart 5glabx-server
```

---

## 🚀 Advanced Installation Options

### Custom Installation Directory
```bash
# Set custom install path
export INSTALL_DIR="/custom/path/5glabx"
./install.sh
```

### Skip CLI Tool Installation
```bash
# If CLI tools are already installed
export SKIP_CLI_INSTALL=true
./install.sh
```

### Development Mode Installation
```bash
# Install with development tools
export DEV_MODE=true
./install.sh
```

### Offline Installation
```bash
# Pre-download packages for offline install
export OFFLINE_MODE=true
./install.sh
```

---

## 📱 Desktop Integration

### Ubuntu Application Menu
After installation, 5GLabX appears in your applications menu:
- **Name**: 5GLabX Platform
- **Category**: Development
- **Icon**: Custom 5GLabX icon
- **Command**: Launches the full platform

### Desktop Shortcuts
- **Start Script**: `/opt/5glabx/start.sh`
- **Desktop Entry**: `~/.local/share/applications/5glabx.desktop`
- **Quick Launch**: Available from dash/search

---

## 🔄 Update & Maintenance

### Update 5GLabX Platform
```bash
cd /opt/5glabx
git pull
npm install
npm run setup
sudo systemctl restart 5glabx-server
```

### Update CLI Tools
```bash
# Update srsRAN
cd /tmp/srsRAN
git pull
cd build && make -j$(nproc) && sudo make install

# Update Open5GS
cd /tmp/open5gs
git pull
meson build --prefix=/usr
sudo ninja -C build install

# Update Kamailio
cd /tmp/kamailio
git pull
make all && sudo make install
```

### Backup Configuration
```bash
# Backup configs
cp -r /opt/5glabx/config ~/5glabx-config-backup
cp /etc/srsran/enb.conf ~/srsran-backup.conf
cp /etc/open5gs/mme.yaml ~/open5gs-backup.yaml
cp /etc/kamailio/kamailio.cfg ~/kamailio-backup.cfg
```

---

## 🎉 Success Indicators

### ✅ Installation Successful When:
- [ ] `npm run install:check` shows all components installed
- [ ] Backend server responds on http://localhost:8080/health
- [ ] WebSocket server active on port 8081
- [ ] CLI tools start without errors
- [ ] Frontend loads with real-time data
- [ ] MAC/RRC statistics update with live logs
- [ ] Desktop shortcut launches the application

### 🎯 Platform Ready When:
- [ ] Real CLI logs appear in dashboards
- [ ] UE connections tracked in real-time
- [ ] HARQ metrics calculated from actual data
- [ ] RRC procedures analyzed from live network
- [ ] Performance metrics reflect actual network load

---

## 📞 Support & Resources

### Quick Help Commands
```bash
# Installation status
npm run install:check

# View installation logs
cat /var/log/5glabx-install.log

# Test platform
npm run server-test

# View platform logs
npm run logs
```

### Documentation
- **Installation Guide**: `INSTALL.md`
- **Real CLI Setup**: `README_REAL_CLI.md`
- **Troubleshooting**: Check `/var/log/5glabx/` directory
- **Configuration**: `/opt/5glabx/config/log-paths.json`

### Community Support
- **GitHub Issues**: Report bugs and request features
- **Documentation**: Comprehensive guides in `/docs/`
- **Logs**: All installation logs in `/var/log/5glabx-install.log`

---

## 🎊 One-Click Installation Summary

**For Ubuntu users:**
```bash
wget https://raw.githubusercontent.com/your-repo/5glabx/main/install.sh
chmod +x install.sh
./install.sh
```

**That's it!** The installer handles everything automatically:
- ✅ System compatibility checks
- ✅ All dependencies installation
- ✅ CLI tools compilation
- ✅ Platform deployment
- ✅ Service configuration
- ✅ Desktop integration
- ✅ Production-ready setup

**Time Estimate**: 15-30 minutes depending on internet speed and system performance.

**Result**: Fully functional 5GLabX platform with real-time 4G/5G network log analysis! 🚀
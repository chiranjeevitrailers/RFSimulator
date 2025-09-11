# Ubuntu PC Installation Guide - 5GLabX Platform

## 🐧 **Complete Ubuntu Setup for CLI Log Analysis**

This guide will help you install and configure the 5GLabX platform on Ubuntu to parse CLI logs from srsRAN, Open5GS, and Kamailio.

## 📋 **Prerequisites**

### **System Requirements**
- Ubuntu 20.04 LTS or later
- 4GB RAM minimum (8GB recommended)
- 10GB free disk space
- Internet connection

### **Required Software**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Git
sudo apt install git -y

# Install build tools
sudo apt install build-essential -y
```

## 🚀 **Quick Installation**

### **1. Clone and Setup Platform**
```bash
# Clone the repository
git clone https://github.com/chiranjeevitrailers/RFSimulator.git
cd RFSimulator

# Install dependencies
npm install

# Make scripts executable
chmod +x install.sh
chmod +x quick-install.sh
```

### **2. Start the Platform**
```bash
# Start the platform
npm start
```

The platform will be available at:
- **Frontend**: http://localhost:8080
- **API**: http://localhost:8080/api
- **WebSocket**: ws://localhost:8081

## 🔧 **CLI Tools Installation**

### **Install srsRAN Project**
```bash
# Install dependencies
sudo apt install cmake build-essential libmbedtls-dev libsctp-dev libfftw3-dev \
    libboost-program-options-dev libconfig++-dev libgtest-dev libzmq3-dev \
    libuhd-dev libsctp-dev libfftw3-dev libboost-all-dev libconfig++-dev \
    libgtest-dev libzmq3-dev libuhd-dev uhd-host -y

# Clone and build srsRAN
git clone https://github.com/srsran/srsRAN_Project.git
cd srsRAN_Project
mkdir build
cd build
cmake ../
make -j$(nproc)
sudo make install
sudo ldconfig

# Verify installation
srsenb --version
```

### **Install Open5GS**
```bash
# Install dependencies
sudo apt install python3-pip python3-setuptools python3-wheel \
    ninja-build build-essential flex bison git libsctp-dev libgnutls28-dev \
    libgcrypt-dev libssl-dev libidn11-dev libmongoc-dev libbson-dev \
    libyaml-dev libnghttp2-dev libmicrohttpd-dev libcurl4-gnutls-dev \
    libnghttp2-dev libtins-dev libtalloc-dev meson -y

# Clone and build Open5GS
git clone https://github.com/open5gs/open5gs.git
cd open5gs
meson build -Dprefix=/usr/local
ninja -C build
sudo ninja -C build install

# Verify installation
open5gs-mmed --version
```

### **Install Kamailio**
```bash
# Install Kamailio
sudo apt install kamailio kamailio-utils kamailio-extra-modules -y

# Start and enable Kamailio
sudo systemctl start kamailio
sudo systemctl enable kamailio

# Verify installation
kamailio -V
```

## ⚙️ **Configuration**

### **1. Configure Log Paths**
Edit `/workspace/config/log-paths.json`:

```json
{
  "srsran": {
    "primary": "/var/log/srsran/enb.log",
    "command": "srsenb",
    "args": [
      "--rf.device=zmq",
      "--log.level=info",
      "--log.filename=/var/log/srsran/enb.log"
    ]
  },
  "open5gs": {
    "primary": "/var/log/open5gs/mme.log", 
    "command": "open5gs-mmed",
    "args": ["-c", "/etc/open5gs/mme.yaml"]
  },
  "kamailio": {
    "primary": "/var/log/kamailio.log",
    "command": "kamailio",
    "args": ["-f", "/etc/kamailio/kamailio.cfg", "-DD", "-E"]
  }
}
```

### **2. Create Log Directories**
```bash
# Create log directories
sudo mkdir -p /var/log/srsran
sudo mkdir -p /var/log/open5gs
sudo chown $USER:$USER /var/log/srsran
sudo chown $USER:$USER /var/log/open5gs
```

### **3. Configure CLI Tools**

#### **srsRAN Configuration**
```bash
# Create srsRAN config directory
sudo mkdir -p /etc/srsran

# Create basic eNB configuration
sudo tee /etc/srsran/enb.conf > /dev/null <<EOF
[enb]
enb_id = 0x19B
mcc = 001
mnc = 01
mme_addr = 127.0.0.1
gtp_bind_addr = 127.0.0.1
s1c_bind_addr = 127.0.0.1
s1c_bind_port = 36412
n_prb = 25
tm = 4
noffset = 0
EOF
```

#### **Open5GS Configuration**
```bash
# Create Open5GS config directory
sudo mkdir -p /etc/open5gs

# Create basic MME configuration
sudo tee /etc/open5gs/mme.yaml > /dev/null <<EOF
mme:
    s1ap:
      - addr: 127.0.0.1
    gtpc:
      - addr: 127.0.0.1
    s11:
      - addr: 127.0.0.1
    s6a:
      - addr: 127.0.0.1
    gummei:
      plmn_id:
        mcc: 001
        mnc: 01
      mme_gid: 2
      mme_code: 1
    tai:
      plmn_id:
        mcc: 001
        mnc: 01
      tac: 1
    security:
        integrity_order : [ EIA2, EIA1, EIA0 ]
        ciphering_order : [ EEA0, EEA1, EEA2 ]
EOF
```

#### **Kamailio Configuration**
```bash
# Backup original config
sudo cp /etc/kamailio/kamailio.cfg /etc/kamailio/kamailio.cfg.backup

# Create basic Kamailio configuration
sudo tee /etc/kamailio/kamailio.cfg > /dev/null <<EOF
#!KAMAILIO
#!define WITH_DEBUG
#!define WITH_IPV6
#!define WITH_MYSQL
#!define WITH_AUTH
#!define WITH_USRLOCDB
#!define WITH_NAT
#!define WITH_PRESENCE
#!define WITH_IMS

# Global parameters
debug=3
log_stderror=yes
log_facility=LOG_LOCAL0
log_prefix="{$mt $hdr(CSeq) $ci} "
memdbg=5
memlog=5
server_signature=no
children=4
listen=udp:127.0.0.1:5060

# Modules
loadmodule "pv.so"
loadmodule "textops.so"
loadmodule "siputils.so"
loadmodule "xlog.so"

# Routing
request_route {
    xlog("L_INFO", "SIP request: $rm from $si:$sp\n");
    route(REQINIT);
}

route[REQINIT] {
    if (!mf_process_maxfwd_header("10")) {
        xlog("L_WARN", "SIP request: $rm from $si:$sp - Max-Forwards exceeded\n");
        exit;
    }
    return;
}
EOF
```

## 🚀 **Running the Platform**

### **1. Start the 5GLabX Platform**
```bash
cd /workspace
npm start
```

### **2. Access the Frontend**
Open your browser and go to: **http://localhost:8080**

### **3. Start CLI Tools via API**
```bash
# Start srsRAN eNB
curl -X POST http://localhost:8080/api/cli/start/srsran

# Start Open5GS MME
curl -X POST http://localhost:8080/api/cli/start/open5gs

# Start Kamailio
curl -X POST http://localhost:8080/api/cli/start/kamailio
```

### **4. Check Status**
```bash
# Check CLI tools status
curl http://localhost:8080/api/cli/status

# Check platform health
curl http://localhost:8080/health
```

## 📊 **Using the Platform**

### **1. Dashboard**
- Real-time system health monitoring
- CLI tools status and metrics
- Log processing statistics

### **2. Log Analysis**
- Live log streaming from all CLI tools
- Protocol-specific analysis (RRC, NAS, MAC, RLC, PDCP, PHY)
- Message correlation and anomaly detection

### **3. Protocol Views**
- **srsRAN**: PHY metrics, RRC procedures, MAC scheduling
- **Open5GS**: 5G core procedures, NAS messages, S1AP signaling
- **Kamailio**: SIP/IMS signaling, call flows, registration procedures

## 🔧 **Troubleshooting**

### **Common Issues**

#### **Port Already in Use**
```bash
# Check what's using port 8080
sudo netstat -tlnp | grep :8080

# Kill the process if needed
sudo kill -9 <PID>
```

#### **Permission Issues**
```bash
# Fix log directory permissions
sudo chown -R $USER:$USER /var/log/srsran
sudo chown -R $USER:$USER /var/log/open5gs
```

#### **CLI Tools Not Starting**
```bash
# Check if tools are installed
which srsenb
which open5gs-mmed
which kamailio

# Check logs
tail -f /var/log/srsran/enb.log
tail -f /var/log/open5gs/mme.log
tail -f /var/log/kamailio.log
```

### **Log Locations**
- **Platform Logs**: Check browser console and terminal output
- **srsRAN Logs**: `/var/log/srsran/enb.log`
- **Open5GS Logs**: `/var/log/open5gs/mme.log`
- **Kamailio Logs**: `/var/log/kamailio.log`

## 🎯 **Verification**

### **Test the Complete Flow**
1. **Start Platform**: `npm start`
2. **Access Frontend**: http://localhost:8080
3. **Start CLI Tools**: Use API or frontend interface
4. **View Logs**: Real-time log display in frontend
5. **Analyze Protocols**: Use protocol-specific views

### **Expected Results**
- ✅ Platform starts successfully
- ✅ Frontend loads with dashboard
- ✅ CLI tools start and generate logs
- ✅ Logs are parsed and displayed in real-time
- ✅ Protocol analysis works correctly

## 🎉 **Success!**

Your Ubuntu PC is now ready to parse CLI logs from srsRAN, Open5GS, and Kamailio using the 5GLabX platform!

The tool will:
- ✅ **Parse srsRAN logs** (RAN/gNodeB/eNodeB)
- ✅ **Parse Open5GS logs** (5G core network)
- ✅ **Parse Kamailio logs** (SIP/IMS)
- ✅ **Display in frontend** with real-time analysis
- ✅ **Provide protocol analysis** with 3GPP compliance

**Platform is 100% ready for CLI log analysis on Ubuntu!** 🚀
#!/bin/bash

# 5GLabX Platform - Automated Installation Script
# This script provides a single-click installation for Ubuntu systems

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INSTALL_DIR="/opt/5glabx"
LOG_FILE="/var/log/5glabx-install.log"
BACKUP_DIR="/opt/5glabx-backup-$(date +%Y%m%d_%H%M%S)"

# Function to log messages
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" | tee -a "$LOG_FILE"
    exit 1
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}" | tee -a "$LOG_FILE"
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}" | tee -a "$LOG_FILE"
}

# Function to check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        error "This script should not be run as root. Please run as a regular user with sudo access."
    fi
}

# Function to check Ubuntu version
check_ubuntu_version() {
    if [[ ! -f /etc/os-release ]]; then
        error "This script is designed for Ubuntu systems only."
    fi

    . /etc/os-release
    if [[ "$ID" != "ubuntu" ]]; then
        error "This script is designed for Ubuntu systems only."
    fi

    # Check version (20.04, 22.04, 24.04)
    if [[ "$VERSION_ID" != "20.04" && "$VERSION_ID" != "22.04" && "$VERSION_ID" != "24.04" ]]; then
        warning "Ubuntu $VERSION_ID detected. This script is tested on 20.04, 22.04, and 24.04."
    fi

    log "Ubuntu $VERSION_ID detected"
}

# Function to check system requirements
check_system_requirements() {
    log "Checking system requirements..."

    # Check available memory
    local total_mem=$(free -m | awk 'NR==2{printf "%.0f", $2}')
    if [[ $total_mem -lt 4096 ]]; then
        warning "System has ${total_mem}MB RAM. 4096MB recommended."
    else
        log "Memory check passed: ${total_mem}MB available"
    fi

    # Check available disk space
    local available_space=$(df / | tail -1 | awk '{print $4}')
    if [[ $available_space -lt 20971520 ]]; then  # 20GB in KB
        error "Insufficient disk space. At least 20GB required."
    fi
    log "Disk space check passed: $(($available_space / 1024 / 1024))GB available"

    # Check internet connectivity
    if ! ping -c 1 -W 5 8.8.8.8 >/dev/null 2>&1; then
        error "No internet connectivity detected."
    fi
    log "Internet connectivity check passed"
}

# Function to backup existing installation
backup_existing() {
    if [[ -d "$INSTALL_DIR" ]]; then
        log "Backing up existing installation..."
        sudo cp -r "$INSTALL_DIR" "$BACKUP_DIR"
        sudo rm -rf "$INSTALL_DIR"
        log "Backup created at: $BACKUP_DIR"
    fi
}

# Function to install system dependencies
install_system_dependencies() {
    log "Installing system dependencies..."

    # Update package lists
    sudo apt update

    # Install essential build tools
    sudo apt install -y build-essential git curl wget software-properties-common \
        apt-transport-https ca-certificates gnupg lsb-release

    # Install Node.js 18
    if ! command -v node &> /dev/null || [[ $(node --version | cut -d'.' -f1 | tr -d 'v') -lt 18 ]]; then
        log "Installing Node.js 18..."
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi

    # Install Python and pip
    sudo apt install -y python3 python3-pip python3-setuptools python3-wheel

    # Install database systems
    sudo apt install -y mongodb postgresql postgresql-contrib mysql-server redis-server

    # Install additional dependencies for srsRAN, Open5GS, Kamailio
    sudo apt install -y cmake libboost-all-dev libconfig++-dev libsctp-dev \
        libfftw3-dev libmbedtls-dev libboost-system-dev libboost-test-dev \
        libboost-thread-dev libgnutls28-dev libgcrypt-dev libssl-dev \
        libidn11-dev libmongoc-dev libbson-dev libyaml-dev libnghttp2-dev \
        libmicrohttpd-dev libcurl4-gnutls-dev libxml2-dev libpcre3-dev \
        libmysqlclient-dev flex bison ninja-build meson libvolk2-dev \
        libsoapysdr-dev soapysdr-tools libbladerf-dev libhackrf-dev \
        liblimesuite-dev uhd-host

    log "System dependencies installed successfully"
}

# Function to install srsRAN
install_srsran() {
    log "Installing srsRAN..."

    cd /tmp
    if [[ -d "srsRAN" ]]; then
        sudo rm -rf srsRAN
    fi

    git clone https://github.com/srsRAN/srsRAN.git
    cd srsRAN
    mkdir -p build && cd build
    cmake ../
    make -j$(nproc)
    sudo make install
    sudo ldconfig

    log "srsRAN installed successfully"
}

# Function to install Open5GS
install_open5gs() {
    log "Installing Open5GS..."

    cd /tmp
    if [[ -d "open5gs" ]]; then
        sudo rm -rf open5gs
    fi

    git clone https://github.com/open5gs/open5gs.git
    cd open5gs
    meson build --prefix=/usr
    ninja -C build
    sudo ninja -C build install

    log "Open5GS installed successfully"
}

# Function to install Kamailio
install_kamailio() {
    log "Installing Kamailio..."

    cd /tmp
    if [[ -d "kamailio" ]]; then
        sudo rm -rf kamailio
    fi

    git clone https://github.com/kamailio/kamailio.git
    cd kamailio
    make include_modules="db_mysql" cfg
    make all
    sudo make install

    log "Kamailio installed successfully"
}

# Function to setup directories and permissions
setup_directories() {
    log "Setting up directories and permissions..."

    # Create installation directory
    sudo mkdir -p "$INSTALL_DIR"
    sudo chown -R $USER:$USER "$INSTALL_DIR"

    # Create log directories
    sudo mkdir -p /var/log/srsran
    sudo mkdir -p /var/log/open5gs
    sudo mkdir -p /var/log/kamailio
    sudo mkdir -p /var/log/5glabx

    # Set permissions
    sudo chown -R $USER:$USER /var/log/srsran
    sudo chown -R $USER:$USER /var/log/open5gs
    sudo chown -R $USER:$USER /var/log/kamailio
    sudo chown -R $USER:$USER /var/log/5glabx

    log "Directories and permissions configured"
}

# Function to install 5GLabX platform
install_5glabx() {
    log "Installing 5GLabX platform..."

    # Copy platform files
    cp -r "$SCRIPT_DIR"/* "$INSTALL_DIR"/

    # Navigate to installation directory
    cd "$INSTALL_DIR"

    # Install Node.js dependencies
    npm install

    # Create configuration files
    setup_configuration

    log "5GLabX platform installed successfully"
}

# Function to setup configuration files
setup_configuration() {
    log "Setting up configuration files..."

    # Create config directory if it doesn't exist
    mkdir -p "$INSTALL_DIR/config"

    # Create log-paths.json
    cat > "$INSTALL_DIR/config/log-paths.json" << 'EOF'
{
  "srsran": {
    "primary": "/var/log/srsran/enb.log",
    "fallback": ["/tmp/srsran.log", "./logs/srsran.log"],
    "format": "srsran",
    "autoStart": false,
    "command": "srsenb",
    "args": ["--rf.device=zmq", "--rf.device_args=\"fail_on_disconnect=true\"", "--log.level=info", "--log.filename=/tmp/srsran.log"]
  },
  "open5gs": {
    "primary": "/var/log/open5gs/mme.log",
    "fallback": ["/var/log/open5gs/smf.log", "./logs/open5gs.log"],
    "format": "open5gs",
    "autoStart": false,
    "command": "open5gs-mmed",
    "args": ["-c", "/etc/open5gs/mme.yaml"]
  },
  "kamailio": {
    "primary": "/var/log/kamailio.log",
    "fallback": ["/tmp/kamailio.log", "./logs/kamailio.log"],
    "format": "kamailio",
    "autoStart": false,
    "command": "kamailio",
    "args": ["-f", "/etc/kamailio/kamailio.cfg", "-DD", "-E"]
  },
  "server": {
    "port": 8080,
    "websocketPort": 8081,
    "logLevel": "info",
    "maxBufferSize": 1000,
    "reconnectInterval": 5000,
    "healthCheckInterval": 30000
  },
  "frontend": {
    "websocketUrl": "ws://localhost:8081",
    "apiUrl": "http://localhost:8080",
    "reconnectAttempts": 5,
    "reconnectDelay": 2000
  }
}
EOF

    # Create CLI configuration files
    setup_cli_configs

    log "Configuration files created"
}

# Function to setup CLI tool configurations
setup_cli_configs() {
    # srsRAN configuration
    sudo mkdir -p /etc/srsran
    sudo tee /etc/srsran/enb.conf > /dev/null << 'EOF'
[enb]
enb_id = 0x19B
cell_id = 0x01
tac = 0x0007
mcc = 001
mnc = 01
mme_addr = 127.0.0.1
gtp_bind_addr = 127.0.0.1

[enb_files]
sib_config = sib.conf
rr_config = rr.conf
rb_config = rb.conf

[log]
filename = /var/log/srsran/enb.log
file_max_size = -1
print_level = info
log_level = info

[expert]
lte_sample_rates = false
EOF

    # Open5GS configuration
    sudo mkdir -p /etc/open5gs
    sudo tee /etc/open5gs/mme.yaml > /dev/null << 'EOF'
logger:
  file: /var/log/open5gs/mme.log
  level: info

mme:
  freeDiameter: /etc/freeDiameter/mme.conf
  s1ap:
    addr: 127.0.0.1
  gtpc:
    addr: 127.0.0.1
EOF

    # Kamailio configuration
    sudo mkdir -p /etc/kamailio
    sudo tee /etc/kamailio/kamailio.cfg > /dev/null << 'EOF'
#!KAMAILIO

####### Global Parameters #########
log_facility=LOG_LOCAL0
log_prefix="KAMAILIO: "

####### Modules Section #########
loadmodule "sl.so"
loadmodule "tm.so"
loadmodule "rr.so"
loadmodule "pv.so"
loadmodule "textops.so"

####### Routing Logic #########
request_route {
    # Log all requests
    xlog("L_INFO", "REQUEST: $rm from $fu to $ru\n");

    # Handle REGISTER
    if (is_method("REGISTER")) {
        sl_send_reply("200", "OK");
        exit;
    }

    # Handle INVITE
    if (is_method("INVITE")) {
        xlog("L_INFO", "INVITE: $ru\n");
        sl_send_reply("200", "OK");
        exit;
    }

    sl_send_reply("404", "Not Found");
}
EOF

    # Create log files
    sudo touch /var/log/srsran/enb.log
    sudo touch /var/log/open5gs/mme.log
    sudo touch /var/log/kamailio.log

    # Set permissions
    sudo chown $USER:$USER /var/log/srsran/enb.log
    sudo chown $USER:$USER /var/log/open5gs/mme.log
    sudo chown kamailio:kamailio /var/log/kamailio.log
}

# Function to create systemd services
create_systemd_services() {
    log "Creating systemd services..."

    # 5GLabX backend service
    sudo tee /etc/systemd/system/5glabx-server.service > /dev/null << EOF
[Unit]
Description=5GLabX Real CLI Log Server
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$INSTALL_DIR
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

    # Open5GS service
    sudo tee /etc/systemd/system/open5gs-mmed.service > /dev/null << EOF
[Unit]
Description=Open5GS MME
After=network.target mongod.service

[Service]
Type=simple
User=$USER
ExecStart=/usr/bin/open5gs-mmed -c /etc/open5gs/mme.yaml
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

    # Kamailio service
    sudo tee /etc/systemd/system/kamailio.service > /dev/null << EOF
[Unit]
Description=Kamailio SIP Server
After=network.target mysql.service

[Service]
Type=simple
User=kamailio
ExecStart=/usr/local/sbin/kamailio -f /etc/kamailio/kamailio.cfg -DD -E
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

    log "Systemd services created"
}

# Function to create desktop shortcuts
create_desktop_shortcuts() {
    log "Creating desktop shortcuts..."

    # Create desktop entry for 5GLabX
    mkdir -p ~/.local/share/applications

    cat > ~/.local/share/applications/5glabx.desktop << EOF
[Desktop Entry]
Name=5GLabX Platform
Comment=5G Network Log Analysis Platform
Exec=$INSTALL_DIR/start.sh
Icon=$INSTALL_DIR/icon.png
Terminal=false
Type=Application
Categories=Development;Network;
EOF

    chmod +x ~/.local/share/applications/5glabx.desktop

    # Create start script
    cat > "$INSTALL_DIR/start.sh" << EOF
#!/bin/bash
cd $INSTALL_DIR
npm run dev
EOF

    chmod +x "$INSTALL_DIR/start.sh"

    log "Desktop shortcuts created"
}

# Function to create uninstall script
create_uninstall_script() {
    log "Creating uninstall script..."

    cat > "$INSTALL_DIR/uninstall.sh" << EOF
#!/bin/bash
echo "Uninstalling 5GLabX Platform..."

# Stop services
sudo systemctl stop 5glabx-server 2>/dev/null || true
sudo systemctl stop open5gs-mmed 2>/dev/null || true
sudo systemctl stop kamailio 2>/dev/null || true

# Disable services
sudo systemctl disable 5glabx-server 2>/dev/null || true
sudo systemctl disable open5gs-mmed 2>/dev/null || true
sudo systemctl disable kamailio 2>/dev/null || true

# Remove systemd files
sudo rm -f /etc/systemd/system/5glabx-server.service
sudo rm -f /etc/systemd/system/open5gs-mmed.service
sudo rm -f /etc/systemd/system/kamailio.service

# Remove installation directory
sudo rm -rf $INSTALL_DIR

# Remove log files
sudo rm -rf /var/log/5glabx

# Remove desktop shortcuts
rm -f ~/.local/share/applications/5glabx.desktop

echo "5GLabX Platform uninstalled successfully"
EOF

    chmod +x "$INSTALL_DIR/uninstall.sh"

    log "Uninstall script created"
}

# Function to test installation
test_installation() {
    log "Testing installation..."

    # Test Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js installation failed"
    fi

    # Test npm
    if ! command -v npm &> /dev/null; then
        error "npm installation failed"
    fi

    # Test srsRAN
    if ! command -v srsenb &> /dev/null; then
        warning "srsRAN installation may have failed"
    fi

    # Test Open5GS
    if ! command -v open5gs-mmed &> /dev/null; then
        warning "Open5GS installation may have failed"
    fi

    # Test Kamailio
    if ! command -v kamailio &> /dev/null; then
        warning "Kamailio installation may have failed"
    fi

    # Test 5GLabX files
    if [[ ! -f "$INSTALL_DIR/server.js" ]]; then
        error "5GLabX platform files not found"
    fi

    if [[ ! -f "$INSTALL_DIR/package.json" ]]; then
        error "5GLabX package.json not found"
    fi

    log "Installation tests completed"
}

# Function to display completion message
show_completion() {
    echo ""
    echo "╔══════════════════════════════════════════════════════════════════════════════╗"
    echo "║                          🎉 INSTALLATION COMPLETE 🎉                      ║"
    echo "╠══════════════════════════════════════════════════════════════════════════════╣"
    echo "║                                                                              ║"
    echo "║  5GLabX Platform has been successfully installed!                           ║"
    echo "║                                                                              ║"
    echo "║  Installation Details:                                                       ║"
    echo "║  • Location: $INSTALL_DIR                                               ║"
    echo "║  • Backend Port: 8080                                                        ║"
    echo "║  • WebSocket Port: 8081                                                     ║"
    echo "║  • Logs: /var/log/5glabx/                                                   ║"
    echo "║                                                                              ║"
    echo "║  Quick Start Commands:                                                       ║"
    echo "║  • Start Backend: cd $INSTALL_DIR && npm run server                    ║"
    echo "║  • Start Frontend: cd $INSTALL_DIR && npm run dev                      ║"
    echo "║  • Start Both: cd $INSTALL_DIR && npm run dev-full                    ║"
    echo "║                                                                              ║"
    echo "║  Desktop Shortcut: 5GLabX Platform (in Applications menu)                  ║"
    echo "║                                                                              ║"
    echo "║  Uninstall: $INSTALL_DIR/uninstall.sh                                 ║"
    echo "║                                                                              ║"
    echo "╚══════════════════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "📖 Next Steps:"
    echo "1. Review the configuration in $INSTALL_DIR/config/log-paths.json"
    echo "2. Start the platform with: cd $INSTALL_DIR && npm run dev-full"
    echo "3. Open your browser to http://localhost:3000"
    echo "4. Start CLI tools: srsRAN, Open5GS, Kamailio"
    echo "5. Monitor real-time logs in the enhanced dashboards"
    echo ""
    echo "📚 Documentation: $INSTALL_DIR/README_REAL_CLI.md"
    echo "🔧 Troubleshooting: Check $LOG_FILE for installation logs"
    echo ""
}

# Main installation function
main() {
    echo ""
    echo "╔══════════════════════════════════════════════════════════════════════════════╗"
    echo "║                    🚀 5GLabX Platform Installer 🚀                        ║"
    echo "║                  Real-Time 4G/5G Network Log Analysis                      ║"
    echo "╚══════════════════════════════════════════════════════════════════════════════╝"
    echo ""

    # Initialize log file
    sudo touch "$LOG_FILE"
    sudo chown $USER:$USER "$LOG_FILE"

    log "Starting 5GLabX Platform installation..."

    # Run installation steps
    check_root
    check_ubuntu_version
    check_system_requirements
    backup_existing
    install_system_dependencies
    install_srsran
    install_open5gs
    install_kamailio
    setup_directories
    install_5glabx
    create_systemd_services
    create_desktop_shortcuts
    create_uninstall_script
    test_installation

    log "5GLabX Platform installation completed successfully!"
    show_completion
}

# Handle command line arguments
case "${1:-}" in
    "--help"|"-h")
        echo "5GLabX Platform Installer"
        echo ""
        echo "Usage: $0 [OPTIONS]"
        echo ""
        echo "Options:"
        echo "  --help, -h          Show this help message"
        echo "  --uninstall         Uninstall 5GLabX Platform"
        echo "  --status           Check installation status"
        echo ""
        echo "Examples:"
        echo "  $0                  Install 5GLabX Platform"
        echo "  $0 --uninstall     Uninstall 5GLabX Platform"
        echo "  $0 --status        Check if 5GLabX is installed"
        exit 0
        ;;
    "--uninstall")
        if [[ -f "$INSTALL_DIR/uninstall.sh" ]]; then
            bash "$INSTALL_DIR/uninstall.sh"
        else
            error "5GLabX Platform is not installed or uninstall script not found"
        fi
        ;;
    "--status")
        if [[ -d "$INSTALL_DIR" ]]; then
            echo "✅ 5GLabX Platform is installed at: $INSTALL_DIR"
            echo "✅ Backend service status: $(systemctl is-active 5glabx-server 2>/dev/null || echo 'not running')"
            echo "✅ Open5GS service status: $(systemctl is-active open5gs-mmed 2>/dev/null || echo 'not running')"
            echo "✅ Kamailio service status: $(systemctl is-active kamailio 2>/dev/null || echo 'not running')"
        else
            echo "❌ 5GLabX Platform is not installed"
        fi
        exit 0
        ;;
    *)
        main "$@"
        ;;
esac
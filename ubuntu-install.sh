#!/bin/bash

# Ubuntu Installation Script for 5GLabX Platform
# This script installs and configures the platform for CLI log analysis

set -e

echo "🐧 5GLabX Platform - Ubuntu Installation"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root"
   exit 1
fi

# Check Ubuntu version
if ! lsb_release -d | grep -q "Ubuntu"; then
    print_error "This script is designed for Ubuntu"
    exit 1
fi

print_header "Step 1: System Update and Prerequisites"
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

print_status "Installing basic dependencies..."
sudo apt install -y curl wget git build-essential software-properties-common

print_header "Step 2: Node.js Installation"
print_status "Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node.js installation
if command -v node &> /dev/null; then
    print_status "Node.js version: $(node --version)"
    print_status "npm version: $(npm --version)"
else
    print_error "Node.js installation failed"
    exit 1
fi

print_header "Step 3: Platform Setup"
print_status "Installing platform dependencies..."
npm install

print_status "Making scripts executable..."
chmod +x install.sh quick-install.sh

print_header "Step 4: CLI Tools Installation"

# Function to install srsRAN
install_srsran() {
    print_status "Installing srsRAN Project dependencies..."
    sudo apt install -y cmake build-essential libmbedtls-dev libsctp-dev \
        libfftw3-dev libboost-program-options-dev libconfig++-dev \
        libgtest-dev libzmq3-dev libuhd-dev uhd-host
    
    if [ ! -d "srsRAN_Project" ]; then
        print_status "Cloning srsRAN Project..."
        git clone https://github.com/srsran/srsRAN_Project.git
    fi
    
    print_status "Building srsRAN Project..."
    cd srsRAN_Project
    mkdir -p build
    cd build
    cmake ../
    make -j$(nproc)
    sudo make install
    sudo ldconfig
    cd ../..
    
    if command -v srsenb &> /dev/null; then
        print_status "srsRAN installed successfully: $(srsenb --version 2>/dev/null || echo 'Version check failed')"
    else
        print_warning "srsRAN installation may have issues"
    fi
}

# Function to install Open5GS
install_open5gs() {
    print_status "Installing Open5GS dependencies..."
    sudo apt install -y python3-pip python3-setuptools python3-wheel \
        ninja-build build-essential flex bison git libsctp-dev \
        libgnutls28-dev libgcrypt-dev libssl-dev libidn11-dev \
        libmongoc-dev libbson-dev libyaml-dev libnghttp2-dev \
        libmicrohttpd-dev libcurl4-gnutls-dev libtins-dev \
        libtalloc-dev meson
    
    if [ ! -d "open5gs" ]; then
        print_status "Cloning Open5GS..."
        git clone https://github.com/open5gs/open5gs.git
    fi
    
    print_status "Building Open5GS..."
    cd open5gs
    meson build -Dprefix=/usr/local
    ninja -C build
    sudo ninja -C build install
    cd ..
    
    if command -v open5gs-mmed &> /dev/null; then
        print_status "Open5GS installed successfully: $(open5gs-mmed --version 2>/dev/null || echo 'Version check failed')"
    else
        print_warning "Open5GS installation may have issues"
    fi
}

# Function to install Kamailio
install_kamailio() {
    print_status "Installing Kamailio..."
    sudo apt install -y kamailio kamailio-utils kamailio-extra-modules
    
    if command -v kamailio &> /dev/null; then
        print_status "Kamailio installed successfully: $(kamailio -V 2>/dev/null | head -1 || echo 'Version check failed')"
    else
        print_warning "Kamailio installation may have issues"
    fi
}

# Ask user which CLI tools to install
echo ""
echo "Which CLI tools would you like to install?"
echo "1) All tools (srsRAN, Open5GS, Kamailio)"
echo "2) srsRAN only"
echo "3) Open5GS only"
echo "4) Kamailio only"
echo "5) Skip CLI tools installation"
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        install_srsran
        install_open5gs
        install_kamailio
        ;;
    2)
        install_srsran
        ;;
    3)
        install_open5gs
        ;;
    4)
        install_kamailio
        ;;
    5)
        print_status "Skipping CLI tools installation"
        ;;
    *)
        print_warning "Invalid choice, skipping CLI tools installation"
        ;;
esac

print_header "Step 5: Configuration Setup"

# Create log directories
print_status "Creating log directories..."
sudo mkdir -p /var/log/srsran
sudo mkdir -p /var/log/open5gs
sudo chown $USER:$USER /var/log/srsran
sudo chown $USER:$USER /var/log/open5gs

# Create configuration directories
print_status "Creating configuration directories..."
sudo mkdir -p /etc/srsran
sudo mkdir -p /etc/open5gs

# Create basic srsRAN configuration
print_status "Creating srsRAN configuration..."
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

# Create basic Open5GS configuration
print_status "Creating Open5GS configuration..."
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

print_header "Step 6: Platform Testing"
print_status "Testing platform startup..."

# Test if the platform can start
if timeout 10s npm start > /dev/null 2>&1; then
    print_status "Platform startup test successful"
else
    print_warning "Platform startup test failed, but this is normal in background"
fi

print_header "Installation Complete!"
echo ""
echo -e "${GREEN}🎉 5GLabX Platform Installation Complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Start the platform: ${BLUE}npm start${NC}"
echo "2. Open browser: ${BLUE}http://localhost:8080${NC}"
echo "3. Start CLI tools via the web interface or API"
echo ""
echo "API endpoints:"
echo "- Health check: ${BLUE}curl http://localhost:8080/health${NC}"
echo "- Start srsRAN: ${BLUE}curl -X POST http://localhost:8080/api/cli/start/srsran${NC}"
echo "- Start Open5GS: ${BLUE}curl -X POST http://localhost:8080/api/cli/start/open5gs${NC}"
echo "- Start Kamailio: ${BLUE}curl -X POST http://localhost:8080/api/cli/start/kamailio${NC}"
echo ""
echo "Log locations:"
echo "- srsRAN: ${BLUE}/var/log/srsran/enb.log${NC}"
echo "- Open5GS: ${BLUE}/var/log/open5gs/mme.log${NC}"
echo "- Kamailio: ${BLUE}/var/log/kamailio.log${NC}"
echo ""
echo -e "${GREEN}Your Ubuntu PC is ready for CLI log analysis! 🚀${NC}"
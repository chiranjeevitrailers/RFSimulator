#!/bin/bash
# 5GLabX Platform - Quick Install Script
# Run this with: curl -fsSL https://raw.githubusercontent.com/your-repo/5glabx/main/quick-install.sh | bash

set -e

echo "🚀 Installing 5GLabX Platform..."

# Check if running on Ubuntu
if ! command -v lsb_release &> /dev/null || [[ "$(lsb_release -si)" != "Ubuntu" ]]; then
    echo "❌ This installer is designed for Ubuntu systems only."
    echo "Please use the manual installation guide for other systems."
    exit 1
fi

# Run the main installer
if [[ -f "./install.sh" ]]; then
    chmod +x ./install.sh
    ./install.sh
else
    echo "❌ install.sh not found. Please ensure all files are present."
    exit 1
fi

echo "✅ 5GLabX Platform installation completed!"
echo "🎯 Run 'npm start' to launch the platform"
#!/bin/bash

# Dependency Installation Script for 5GLabX Platform
# This script installs all required dependencies for the platform

set -e  # Exit on any error

echo "📦 Installing dependencies for 5GLabX Platform..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check system requirements
check_system_requirements() {
    print_status "Checking system requirements..."
    
    # Check Node.js version
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$NODE_VERSION" -lt 18 ]; then
            print_error "Node.js version 18+ is required. Current version: $(node --version)"
            exit 1
        fi
        print_success "Node.js version: $(node --version)"
    else
        print_error "Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi
    
    # Check npm version
    if command -v npm &> /dev/null; then
        print_success "npm version: $(npm --version)"
    else
        print_error "npm is not installed"
        exit 1
    fi
    
    # Check if pnpm is installed
    if ! command -v pnpm &> /dev/null; then
        print_warning "pnpm is not installed. Installing pnpm..."
        npm install -g pnpm@8
        print_success "pnpm installed successfully"
    else
        print_success "pnpm version: $(pnpm --version)"
    fi
}

# Install global dependencies
install_global_dependencies() {
    print_status "Installing global dependencies..."
    
    # Install Netlify CLI
    if ! command -v netlify &> /dev/null; then
        print_status "Installing Netlify CLI..."
        npm install -g netlify-cli
        print_success "Netlify CLI installed"
    else
        print_success "Netlify CLI already installed"
    fi
    
    # Install Supabase CLI
    if ! command -v supabase &> /dev/null; then
        print_status "Installing Supabase CLI..."
        npm install -g supabase
        print_success "Supabase CLI installed"
    else
        print_success "Supabase CLI already installed"
    fi
    
    # Install TypeScript globally
    if ! command -v tsc &> /dev/null; then
        print_status "Installing TypeScript..."
        npm install -g typescript
        print_success "TypeScript installed"
    else
        print_success "TypeScript already installed"
    fi
}

# Install project dependencies
install_project_dependencies() {
    print_status "Installing project dependencies..."
    
    # Install dependencies using pnpm
    pnpm install --frozen-lockfile
    
    print_success "Project dependencies installed successfully"
}

# Install development dependencies
install_dev_dependencies() {
    print_status "Installing development dependencies..."
    
    # Install additional dev tools if needed
    pnpm add -D @types/node @types/react @types/react-dom
    
    print_success "Development dependencies installed"
}

# Set up environment file
setup_environment() {
    print_status "Setting up environment configuration..."
    
    if [ ! -f .env.local ]; then
        if [ -f .env.example ]; then
            print_status "Creating .env.local from .env.example..."
            cp .env.example .env.local
            print_warning "Please update .env.local with your actual environment variables"
        else
            print_warning ".env.example not found. Please create .env.local manually"
        fi
    else
        print_success ".env.local already exists"
    fi
}

# Verify installation
verify_installation() {
    print_status "Verifying installation..."
    
    # Check if node_modules exists
    if [ -d "node_modules" ]; then
        print_success "node_modules directory exists"
    else
        print_error "node_modules directory not found"
        exit 1
    fi
    
    # Check if pnpm-lock.yaml exists
    if [ -f "pnpm-lock.yaml" ]; then
        print_success "pnpm-lock.yaml exists"
    else
        print_warning "pnpm-lock.yaml not found"
    fi
    
    # Try to run type check
    print_status "Running TypeScript type check..."
    if pnpm type-check; then
        print_success "TypeScript type check passed"
    else
        print_warning "TypeScript type check failed (this might be expected if environment variables are not set)"
    fi
    
    # Try to run lint
    print_status "Running ESLint..."
    if pnpm lint; then
        print_success "ESLint check passed"
    else
        print_warning "ESLint check failed (this might be expected if environment variables are not set)"
    fi
}

# Main installation function
main() {
    print_status "Starting dependency installation for 5GLabX Platform"
    
    # Check system requirements
    check_system_requirements
    
    # Install global dependencies
    install_global_dependencies
    
    # Install project dependencies
    install_project_dependencies
    
    # Install development dependencies
    install_dev_dependencies
    
    # Set up environment
    setup_environment
    
    # Verify installation
    verify_installation
    
    print_success "🎉 All dependencies installed successfully!"
    print_status "Next steps:"
    print_status "1. Update .env.local with your environment variables"
    print_status "2. Set up Supabase database"
    print_status "3. Run 'pnpm dev' to start development server"
    print_status "4. Run './scripts/setup-netlify.sh' to set up Netlify deployment"
}

# Handle command line arguments
case "${1:-}" in
    "help"|"-h"|"--help")
        echo "Usage: $0 [help]"
        echo ""
        echo "This script installs all required dependencies for the 5GLabX platform."
        echo ""
        echo "Requirements:"
        echo "  - Node.js 18+"
        echo "  - npm 8+"
        echo ""
        echo "What this script does:"
        echo "  - Checks system requirements"
        echo "  - Installs global dependencies (Netlify CLI, Supabase CLI, TypeScript)"
        echo "  - Installs project dependencies using pnpm"
        echo "  - Sets up environment configuration"
        echo "  - Verifies installation"
        ;;
    *)
        main
        ;;
esac
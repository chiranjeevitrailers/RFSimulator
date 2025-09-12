#!/bin/bash

# 5GLabX Platform Deployment Script
# This script handles the complete deployment process

set -e  # Exit on any error

echo "🚀 Starting 5GLabX Platform Deployment..."

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

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi
    
    if ! command -v pnpm &> /dev/null; then
        print_error "pnpm is not installed. Please install pnpm 8+"
        exit 1
    fi
    
    if ! command -v netlify &> /dev/null; then
        print_warning "Netlify CLI is not installed. Installing..."
        npm install -g netlify-cli
    fi
    
    print_success "All dependencies are available"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    pnpm install --frozen-lockfile
    print_success "Dependencies installed successfully"
}

# Run tests
run_tests() {
    print_status "Running tests..."
    
    # Type check
    print_status "Running TypeScript type check..."
    pnpm type-check
    
    # Lint check
    print_status "Running ESLint..."
    pnpm lint
    
    # Unit tests
    print_status "Running unit tests..."
    pnpm test --passWithNoTests
    
    print_success "All tests passed"
}

# Build the application
build_application() {
    print_status "Building application..."
    
    # Set production environment
    export NODE_ENV=production
    
    # Build Next.js application
    pnpm build
    
    print_success "Application built successfully"
}

# Deploy to Netlify
deploy_to_netlify() {
    local environment=${1:-staging}
    
    print_status "Deploying to Netlify ($environment)..."
    
    if [ "$environment" = "production" ]; then
        # Production deployment
        netlify deploy --dir=.next --prod --site=$NETLIFY_PRODUCTION_SITE_ID
        print_success "Deployed to production successfully"
    else
        # Staging deployment
        netlify deploy --dir=.next --prod --site=$NETLIFY_STAGING_SITE_ID
        print_success "Deployed to staging successfully"
    fi
}

# Run health checks
run_health_checks() {
    local url=${1:-"https://staging.5glabx.com"}
    
    print_status "Running health checks on $url..."
    
    # Wait for deployment to be ready
    sleep 30
    
    # Check health endpoint
    if curl -f "$url/api/health" > /dev/null 2>&1; then
        print_success "Health check passed"
    else
        print_error "Health check failed"
        exit 1
    fi
    
    # Check main page
    if curl -f "$url" > /dev/null 2>&1; then
        print_success "Main page check passed"
    else
        print_error "Main page check failed"
        exit 1
    fi
}

# Main deployment function
main() {
    local environment=${1:-staging}
    
    print_status "Starting deployment to $environment environment"
    
    # Check dependencies
    check_dependencies
    
    # Install dependencies
    install_dependencies
    
    # Run tests
    run_tests
    
    # Build application
    build_application
    
    # Deploy to Netlify
    deploy_to_netlify $environment
    
    # Run health checks
    if [ "$environment" = "production" ]; then
        run_health_checks "https://5glabx.com"
    else
        run_health_checks "https://staging.5glabx.com"
    fi
    
    print_success "🎉 Deployment completed successfully!"
    print_status "Environment: $environment"
    print_status "Timestamp: $(date)"
}

# Handle command line arguments
case "${1:-}" in
    "production")
        main "production"
        ;;
    "staging")
        main "staging"
        ;;
    "help"|"-h"|"--help")
        echo "Usage: $0 [staging|production|help]"
        echo ""
        echo "Commands:"
        echo "  staging     Deploy to staging environment (default)"
        echo "  production  Deploy to production environment"
        echo "  help        Show this help message"
        ;;
    *)
        main "staging"
        ;;
esac
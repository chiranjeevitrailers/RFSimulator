#!/bin/bash

# Simple Deployment Script for 5GLabX Platform
# This script handles basic deployment to Netlify

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

# Check if Netlify CLI is installed
check_netlify_cli() {
    print_status "Checking Netlify CLI installation..."
    
    if ! command -v netlify &> /dev/null; then
        print_warning "Netlify CLI is not installed. Installing..."
        npm install -g netlify-cli
        print_success "Netlify CLI installed successfully"
    else
        print_success "Netlify CLI is already installed"
    fi
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
        if [ -n "$NETLIFY_PRODUCTION_SITE_ID" ]; then
            netlify deploy --dir=out --prod --site=$NETLIFY_PRODUCTION_SITE_ID
        else
            print_warning "NETLIFY_PRODUCTION_SITE_ID not set. Creating new site..."
            netlify deploy --dir=out --prod
        fi
        print_success "Deployed to production successfully"
    else
        # Staging deployment
        if [ -n "$NETLIFY_STAGING_SITE_ID" ]; then
            netlify deploy --dir=out --prod --site=$NETLIFY_STAGING_SITE_ID
        else
            print_warning "NETLIFY_STAGING_SITE_ID not set. Creating new site..."
            netlify deploy --dir=out --prod
        fi
        print_success "Deployed to staging successfully"
    fi
}

# Main deployment function
main() {
    local environment=${1:-staging}
    
    print_status "Starting deployment to $environment environment"
    
    # Check Netlify CLI
    check_netlify_cli
    
    # Build application
    build_application
    
    # Deploy to Netlify
    deploy_to_netlify $environment
    
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
        echo ""
        echo "Environment Variables:"
        echo "  NETLIFY_STAGING_SITE_ID    - Staging site ID"
        echo "  NETLIFY_PRODUCTION_SITE_ID - Production site ID"
        ;;
    *)
        main "staging"
        ;;
esac
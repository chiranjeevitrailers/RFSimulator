#!/bin/bash

# 5GLabX Platform - Automated Netlify Deployment Script
# Updated for the latest build configuration
#
# IMPORTANT: Run this script on your LOCAL MACHINE (not in Docker container)
# as it requires interactive browser authentication

set -e  # Exit on any error

echo "🚀 Starting 5GLabX Platform Deployment to Netlify..."

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

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root directory."
    exit 1
fi

# Check if Netlify CLI is installed
print_status "Checking Netlify CLI installation..."
if ! command -v netlify &> /dev/null; then
    print_warning "Netlify CLI not found. Installing..."
    npm install -g netlify-cli
    print_success "Netlify CLI installed successfully"
else
    print_success "Netlify CLI is already installed"
fi

# Check if logged in to Netlify
print_status "Checking Netlify authentication..."
if ! netlify status &> /dev/null; then
    print_warning "Not logged in to Netlify. Please login:"
    netlify login
    if [ $? -ne 0 ]; then
        print_error "Failed to login to Netlify. Please try again."
        exit 1
    fi
else
    print_success "Already logged in to Netlify"
fi

# Install dependencies
print_status "Installing dependencies..."
if command -v pnpm &> /dev/null; then
    pnpm install
else
    print_warning "pnpm not found, using npm instead..."
    npm install
fi

if [ $? -ne 0 ]; then
    print_error "Failed to install dependencies"
    exit 1
fi
print_success "Dependencies installed successfully"

# Build the project
print_status "Building the project..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Build failed. Please check the error messages above."
    exit 1
fi
print_success "Project built successfully"

# Check if this is a new site or existing site
print_status "Checking if site is already configured..."
if [ -f ".netlify/state.json" ]; then
    print_success "Site already configured. Deploying to existing site..."
    netlify deploy --prod
else
    print_status "Initializing new Netlify site..."
    netlify init
    print_success "Site initialized. Deploying..."
    netlify deploy --prod
fi

if [ $? -ne 0 ]; then
    print_error "Deployment failed. Please check the error messages above."
    exit 1
fi

print_success "🎉 Deployment completed successfully!"
print_status "Your 5GLabX Platform is now live on Netlify!"

# Get the site URL
SITE_URL=$(netlify status --json | grep -o '"url":"[^"]*' | cut -d'"' -f4)
if [ ! -z "$SITE_URL" ]; then
    print_success "🌐 Site URL: $SITE_URL"
fi

print_status "Next steps:"
echo "1. Configure environment variables in Netlify dashboard"
echo "2. Set up custom domain (optional)"
echo "3. Test all functionality"
echo "4. Monitor performance and errors"

print_success "Deployment script completed!"
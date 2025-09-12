#!/bin/bash

# Netlify Setup Script for 5GLabX Platform
# This script sets up Netlify deployment configuration

set -e  # Exit on any error

echo "🔧 Setting up Netlify for 5GLabX Platform..."

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

# Login to Netlify
login_to_netlify() {
    print_status "Logging into Netlify..."
    
    if netlify status &> /dev/null; then
        print_success "Already logged into Netlify"
    else
        print_status "Please log into Netlify in your browser..."
        netlify login
        print_success "Logged into Netlify successfully"
    fi
}

# Create Netlify sites
create_sites() {
    print_status "Creating Netlify sites..."
    
    # Create staging site
    print_status "Creating staging site..."
    STAGING_SITE_ID=$(netlify sites:create --name "5glabx-staging" --account-slug "your-team-slug" | grep -o 'Site ID: [a-f0-9-]*' | cut -d' ' -f3)
    echo "NETLIFY_STAGING_SITE_ID=$STAGING_SITE_ID" >> .env.local
    print_success "Staging site created: $STAGING_SITE_ID"
    
    # Create production site
    print_status "Creating production site..."
    PRODUCTION_SITE_ID=$(netlify sites:create --name "5glabx-production" --account-slug "your-team-slug" | grep -o 'Site ID: [a-f0-9-]*' | cut -d' ' -f3)
    echo "NETLIFY_PRODUCTION_SITE_ID=$PRODUCTION_SITE_ID" >> .env.local
    print_success "Production site created: $PRODUCTION_SITE_ID"
}

# Set up environment variables
setup_environment_variables() {
    print_status "Setting up environment variables..."
    
    # Staging environment variables
    print_status "Setting staging environment variables..."
    netlify env:set NODE_ENV production --site $STAGING_SITE_ID
    netlify env:set NEXT_PUBLIC_API_URL "https://staging-api.5glabx.com" --site $STAGING_SITE_ID
    netlify env:set NEXT_PUBLIC_SUPABASE_URL "$NEXT_PUBLIC_SUPABASE_URL" --site $STAGING_SITE_ID
    netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "$NEXT_PUBLIC_SUPABASE_ANON_KEY" --site $STAGING_SITE_ID
    netlify env:set NEXTAUTH_SECRET "$NEXTAUTH_SECRET" --site $STAGING_SITE_ID
    netlify env:set NEXTAUTH_URL "https://staging.5glabx.com" --site $STAGING_SITE_ID
    
    # Production environment variables
    print_status "Setting production environment variables..."
    netlify env:set NODE_ENV production --site $PRODUCTION_SITE_ID
    netlify env:set NEXT_PUBLIC_API_URL "https://api.5glabx.com" --site $PRODUCTION_SITE_ID
    netlify env:set NEXT_PUBLIC_SUPABASE_URL "$NEXT_PUBLIC_SUPABASE_URL" --site $PRODUCTION_SITE_ID
    netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "$NEXT_PUBLIC_SUPABASE_ANON_KEY" --site $PRODUCTION_SITE_ID
    netlify env:set NEXTAUTH_SECRET "$NEXTAUTH_SECRET" --site $PRODUCTION_SITE_ID
    netlify env:set NEXTAUTH_URL "https://5glabx.com" --site $PRODUCTION_SITE_ID
    
    print_success "Environment variables set successfully"
}

# Set up custom domains
setup_domains() {
    print_status "Setting up custom domains..."
    
    # Add staging domain
    print_status "Adding staging domain..."
    netlify domains:add staging.5glabx.com --site $STAGING_SITE_ID
    
    # Add production domain
    print_status "Adding production domain..."
    netlify domains:add 5glabx.com --site $PRODUCTION_SITE_ID
    netlify domains:add www.5glabx.com --site $PRODUCTION_SITE_ID
    
    print_success "Custom domains configured"
}

# Set up SSL certificates
setup_ssl() {
    print_status "Setting up SSL certificates..."
    
    # Enable SSL for staging
    netlify ssl:create --site $STAGING_SITE_ID
    
    # Enable SSL for production
    netlify ssl:create --site $PRODUCTION_SITE_ID
    
    print_success "SSL certificates configured"
}

# Set up form handling
setup_forms() {
    print_status "Setting up form handling..."
    
    # Configure contact form
    netlify forms:create contact --site $STAGING_SITE_ID
    netlify forms:create contact --site $PRODUCTION_SITE_ID
    
    print_success "Form handling configured"
}

# Set up functions
setup_functions() {
    print_status "Setting up Netlify functions..."
    
    # Deploy functions to staging
    netlify functions:deploy --site $STAGING_SITE_ID
    
    # Deploy functions to production
    netlify functions:deploy --site $PRODUCTION_SITE_ID
    
    print_success "Functions deployed successfully"
}

# Set up build hooks
setup_build_hooks() {
    print_status "Setting up build hooks..."
    
    # Create build hook for staging
    STAGING_HOOK=$(netlify build-hooks:create --site $STAGING_SITE_ID --title "Staging Build Hook" | grep -o 'https://[^ ]*')
    echo "NETLIFY_STAGING_BUILD_HOOK=$STAGING_HOOK" >> .env.local
    
    # Create build hook for production
    PRODUCTION_HOOK=$(netlify build-hooks:create --site $PRODUCTION_SITE_ID --title "Production Build Hook" | grep -o 'https://[^ ]*')
    echo "NETLIFY_PRODUCTION_BUILD_HOOK=$PRODUCTION_HOOK" >> .env.local
    
    print_success "Build hooks created successfully"
}

# Set up monitoring
setup_monitoring() {
    print_status "Setting up monitoring..."
    
    # Enable Netlify Analytics
    netlify analytics:enable --site $STAGING_SITE_ID
    netlify analytics:enable --site $PRODUCTION_SITE_ID
    
    print_success "Monitoring configured"
}

# Main setup function
main() {
    print_status "Starting Netlify setup for 5GLabX Platform"
    
    # Check if .env.local exists
    if [ ! -f .env.local ]; then
        print_error ".env.local file not found. Please create it with your environment variables."
        exit 1
    fi
    
    # Source environment variables
    source .env.local
    
    # Check required environment variables
    if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ] || [ -z "$NEXTAUTH_SECRET" ]; then
        print_error "Required environment variables are missing. Please check your .env.local file."
        exit 1
    fi
    
    # Run setup steps
    check_netlify_cli
    login_to_netlify
    create_sites
    setup_environment_variables
    setup_domains
    setup_ssl
    setup_forms
    setup_functions
    setup_build_hooks
    setup_monitoring
    
    print_success "🎉 Netlify setup completed successfully!"
    print_status "Staging Site ID: $STAGING_SITE_ID"
    print_status "Production Site ID: $PRODUCTION_SITE_ID"
    print_status "Staging URL: https://staging.5glabx.com"
    print_status "Production URL: https://5glabx.com"
}

# Handle command line arguments
case "${1:-}" in
    "help"|"-h"|"--help")
        echo "Usage: $0 [help]"
        echo ""
        echo "This script sets up Netlify deployment for the 5GLabX platform."
        echo "Make sure you have a .env.local file with your environment variables."
        echo ""
        echo "Required environment variables:"
        echo "  NEXT_PUBLIC_SUPABASE_URL"
        echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY"
        echo "  NEXTAUTH_SECRET"
        ;;
    *)
        main
        ;;
esac
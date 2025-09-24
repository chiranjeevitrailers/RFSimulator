#!/bin/bash

# 🚀 5GLabX Platform - Netlify Deployment Script
# This script helps deploy the 5GLabX platform to Netlify

set -e

echo "🚀 5GLabX Platform - Netlify Deployment"
echo "========================================="

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ first."
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Installing..."
    npm install -g pnpm@8
fi

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI is not installed. Installing..."
    npm install -g netlify-cli
fi

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Installing..."
    npm install -g supabase
fi

echo "✅ Prerequisites check complete"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# Build the application
echo "🔨 Building application..."
pnpm build

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Not in a git repository. Please initialize git first."
    echo "Run: git init && git add . && git commit -m 'Initial commit'"
    exit 1
fi

# Check if we have a remote repository
if ! git remote -v | grep -q origin; then
    echo "⚠️  No remote repository found. Please set up GitHub repository first."
    echo "Visit: https://github.com/new to create a repository"
    echo "Then run: git remote add origin https://github.com/your-username/your-repo.git"
    echo ""
    read -p "Do you want to continue without pushing to GitHub? (y/N): " -r
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    # Push to GitHub
    echo "📤 Pushing to GitHub..."
    git add .
    git commit -m "Deploy 5GLabX to Netlify" || echo "No changes to commit"
    git push origin main
fi

# Deploy to Netlify
echo "🌐 Deploying to Netlify..."

# Check if site already exists
if netlify status &> /dev/null; then
    echo "✅ Site already linked to Netlify"
    echo "🔄 Deploying..."
    netlify deploy --prod --dir=.next
else
    echo "🔗 Linking to Netlify..."
    echo "Please follow the prompts to authenticate and create a new site:"
    netlify init

    echo "📝 Setting environment variables..."
    echo "Please set the following environment variables in Netlify dashboard:"
    echo ""
    echo "Required Variables:"
    echo "=================="
    echo "NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co"
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key"
    echo "SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key"
    echo "NEXTAUTH_SECRET=your_nextauth_secret"
    echo "NEXTAUTH_URL=https://your-netlify-site.netlify.app"
    echo ""
    echo "After setting these variables, run this script again or deploy manually:"
    echo "netlify deploy --prod --dir=.next"
fi

echo ""
echo "🎉 Deployment process complete!"
echo ""
echo "Next steps:"
echo "1. Set environment variables in Netlify dashboard"
echo "2. Configure your Supabase database"
echo "3. Test your deployed application"
echo "4. Set up custom domain (optional)"
echo ""
echo "Your site will be available at: https://your-site-name.netlify.app"
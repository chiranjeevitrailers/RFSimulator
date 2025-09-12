#!/bin/bash

# 5GLabX Platform - Test Deployment Script
# This script tests the build and creates a preview deployment

set -e

echo "🧪 Testing 5GLabX Platform Build and Deployment..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

# Test 1: Check project structure
print_status "Testing project structure..."
required_files=("package.json" "next.config.js" "netlify.toml" "app/layout.tsx" "app/page.tsx")
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        print_success "✓ $file exists"
    else
        print_error "✗ $file missing"
        exit 1
    fi
done

# Test 2: Install dependencies
print_status "Testing dependency installation..."
if command -v pnpm &> /dev/null; then
    pnpm install --frozen-lockfile
else
    npm ci
fi
print_success "✓ Dependencies installed"

# Test 3: Type checking
print_status "Testing TypeScript compilation..."
if command -v pnpm &> /dev/null; then
    pnpm type-check
else
    npx tsc --noEmit
fi
print_success "✓ TypeScript compilation passed"

# Test 4: Build test
print_status "Testing production build..."
if command -v pnpm &> /dev/null; then
    pnpm build
else
    npm run build
fi
print_success "✓ Production build successful"

# Test 5: Check build output
print_status "Testing build output..."
if [ -d "out" ]; then
    print_success "✓ Build output directory exists"
    
    # Check for key files
    if [ -f "out/index.html" ]; then
        print_success "✓ index.html generated"
    else
        print_error "✗ index.html missing"
        exit 1
    fi
    
    if [ -d "out/_next" ]; then
        print_success "✓ Next.js assets generated"
    else
        print_error "✗ Next.js assets missing"
        exit 1
    fi
else
    print_error "✗ Build output directory missing"
    exit 1
fi

# Test 6: Create preview deployment (if Netlify CLI available)
if command -v netlify &> /dev/null; then
    print_status "Testing Netlify preview deployment..."
    if netlify status &> /dev/null; then
        netlify deploy --dir=out
        print_success "✓ Preview deployment created"
    else
        print_status "⚠ Netlify not logged in, skipping preview deployment"
    fi
else
    print_status "⚠ Netlify CLI not available, skipping preview deployment"
fi

print_success "🎉 All tests passed! The project is ready for deployment."
echo ""
echo "Next steps:"
echo "1. Run './deploy.sh' to deploy to production"
echo "2. Or manually deploy via Netlify dashboard"
echo "3. Configure environment variables"
echo "4. Test all functionality"
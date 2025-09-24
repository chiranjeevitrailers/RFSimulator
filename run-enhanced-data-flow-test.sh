#!/bin/bash

echo "🚀 Starting 5GLabX Enhanced Data Flow Test"
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

# Check if .env.local exists for Supabase configuration
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found. Creating template..."
    echo "# Supabase Configuration" > .env.local
    echo "NEXT_PUBLIC_SUPABASE_URL=your_supabase_url" >> .env.local
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key" >> .env.local
    echo "SUPABASE_SERVICE_ROLE_KEY=your_service_role_key" >> .env.local
    echo "NEXTAUTH_SECRET=your_nextauth_secret" >> .env.local
    echo "NEXTAUTH_URL=http://localhost:3000" >> .env.local
    echo "Please update .env.local with your Supabase credentials"
fi

echo "✅ Dependencies installed"
echo "✅ Configuration files ready"

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Function to kill process on port
kill_port() {
    local pid=$(lsof -ti:$1)
    if [ ! -z "$pid" ]; then
        echo "🛑 Killing process $pid on port $1"
        kill -9 $pid
        sleep 2
    fi
}

# Clean up any existing processes
echo "🧹 Cleaning up existing processes..."
kill_port 3000
kill_port 8080
kill_port 8081
kill_port 8082

echo "✅ Ports cleaned up"

# Start the servers in the background
echo "🚀 Starting servers..."

# Start CLI Server (includes WebSocket server for test execution)
echo "📡 Starting CLI Server with Test Execution WebSocket..."
node server.js &
CLI_SERVER_PID=$!
sleep 3

# Check if CLI server started successfully
if ! check_port 8080; then
    echo "❌ CLI Server failed to start"
    kill $CLI_SERVER_PID
    exit 1
fi

echo "✅ CLI Server started on port 8080"

# Start Next.js application
echo "🌐 Starting Next.js application..."
npm run dev &
NEXTJS_PID=$!
sleep 5

# Check if Next.js started successfully
if ! check_port 3000; then
    echo "❌ Next.js application failed to start"
    kill $CLI_SERVER_PID
    kill $NEXTJS_PID
    exit 1
fi

echo "✅ Next.js application started on port 3000"

echo ""
echo "🎉 All servers started successfully!"
echo "=================================="
echo "📋 Server Information:"
echo "   🌐 Next.js App: http://localhost:3000"
echo "   📡 CLI Server: http://localhost:8080"
echo "   🔌 Test Execution WebSocket: ws://localhost:8082"
echo ""
echo "🔧 Available Services:"
echo "   • Test Execution API: http://localhost:3000/api/test-execution/enhanced"
echo "   • Test Suites UI: http://localhost:3000/user-dashboard"
echo "   • 5GLabX Platform: http://localhost:3000"
echo ""
echo "🧪 Testing data flow..."

# Run the enhanced data flow test
node test-enhanced-data-flow.js

TEST_EXIT_CODE=$?

echo ""
if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo "🎉 DATA FLOW TEST PASSED!"
    echo "=========================="
    echo "✅ Test execution to frontend data flow is working"
    echo "✅ WebSocket real-time streaming is functional"
    echo "✅ Database integration is working"
    echo ""
    echo "🚀 You can now:"
    echo "   1. Open http://localhost:3000 in your browser"
    echo "   2. Navigate to the User Dashboard"
    echo "   3. Select a test case and run it"
    echo "   4. See live data streaming in the 5GLabX Platform"
else
    echo "❌ DATA FLOW TEST FAILED!"
    echo "=========================="
    echo "🔍 Check the test output above for details"
fi

echo ""
echo "🛑 Stopping servers..."

# Clean up processes
kill $CLI_SERVER_PID 2>/dev/null
kill $NEXTJS_PID 2>/dev/null

echo "✅ Servers stopped"
echo "✅ Test completed"
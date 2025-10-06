"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Activity, BarChart3, Settings, LogOut, User, Bell, HelpCircle, Shield, Monitor, TestTube, Database, Layers, CheckCircle } from "lucide-react"
import ProfessionalTestManager from "@/components/testing/ProfessionalTestManager"
import Enhanced5GLabXPlatform from "@/components/5glabx/Enhanced5GLabXPlatform"
import Complete5GLabXWithFullTestManager from "@/components/5glabx/Complete5GLabXWithFullTestManager"

const UserDashboard: React.FC = () => {
  const router = useRouter()
  const [user, setUser] = useState<any>({
    id: "user-1",
    email: "user@5glabx.com",
    full_name: "Demo User",
    role: "user",
    subscription_tier: "pro",
    subscription_status: "active",
  })
  const [activeTab, setActiveTab] = useState("overview")

  // Load DataFormatAdapter and DataFlowManager
  useEffect(() => {
    const loadServices = async () => {
      try {
        // Load DataFormatAdapter
        const { DataFormatAdapter } = await import('@/utils/DataFormatAdapter');
        if (typeof window !== 'undefined') {
          (window as any).DataFormatAdapter = DataFormatAdapter;
          console.log('✅ DataFormatAdapter loaded successfully');
        }

        // Load DataFlowManager
        const { dataFlowManager } = await import('@/utils/DataFlowManager');
        if (typeof window !== 'undefined') {
          (window as any).dataFlowManager = dataFlowManager;
          console.log('✅ DataFlowManager loaded successfully');
        }
      } catch (error) {
        console.error('❌ Failed to load services:', error);
      }
    };

    loadServices();
  }, []);

  // Memoize the platforms to prevent unnecessary remounting
  const Memoized5GLabXPlatform = useMemo(() => {
    return <Enhanced5GLabXPlatform />;
  }, []);

  const MemoizedIntegratedPlatform = useMemo(() => {
    return <Complete5GLabXWithFullTestManager />;
  }, []);

  const handleSignOut = () => {
    console.log("Sign out clicked")
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-primary-600">5GLabX</h1>
              </div>
              <nav className="ml-10 flex space-x-6">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === "overview" ? "bg-primary-100 text-primary-700" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Activity className="w-4 h-4 inline mr-2" />
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("test-manager")}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === "test-manager"
                      ? "bg-primary-100 text-primary-700"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <TestTube className="w-4 h-4 inline mr-2" />
                  Test Manager
                </button>
                <button
                  onClick={() => setActiveTab("5glabx-platform")}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === "5glabx-platform"
                      ? "bg-primary-100 text-primary-700"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Monitor className="w-4 h-4 inline mr-2" />
                  5GLabX Platform
                </button>
                <button
                  onClick={() => setActiveTab("5glabx-integrated")}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === "5glabx-integrated"
                      ? "bg-primary-100 text-primary-700"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Layers className="w-4 h-4 inline mr-2" />
                  5GLabX + Test Manager
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === "settings" ? "bg-primary-100 text-primary-700" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Settings className="w-4 h-4 inline mr-2" />
                  Settings
                </button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <HelpCircle className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">{user.email}</span>
              </div>
              <button
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2 inline" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user.full_name}!</h2>
              <p className="text-gray-600">Your 5GLabX Professional Analysis Platform is ready for use.</p>
            </div>

            {/* Platform Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Test Manager */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <TestTube className="w-8 h-8 text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Test Manager</h3>
                </div>
                <p className="text-gray-600 mb-4">Execute and manage test cases with real-time monitoring</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Professional Test Manager</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>

              {/* 5GLabX Platform */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <Database className="w-8 h-8 text-green-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">5GLabX Platform</h3>
                </div>
                <p className="text-gray-600 mb-4">Network analysis and monitoring with professional tools</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Enhanced 5GLabX Platform</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>

              {/* 5GLabX + Test Manager Integration */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <Layers className="w-8 h-8 text-green-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">5GLabX + Test Manager</h3>
                </div>
                <p className="text-gray-600 mb-4">Complete integration - Test Manager + 5GLabX Protocol Analysis</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Full Integration</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Features Overview */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:col-span-2 lg:col-span-3">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Activity className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="text-sm font-medium text-gray-900">Real-time Analysis</h4>
                    <p className="text-xs text-gray-500">Live data streaming</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Layers className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="text-sm font-medium text-gray-900">Protocol Layers</h4>
                    <p className="text-xs text-gray-500">PHY, MAC, RLC, PDCP, RRC, NAS</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <BarChart3 className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="text-sm font-medium text-gray-900">Professional UI</h4>
                    <p className="text-xs text-gray-500">QXDM/Keysight compatible</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <Shield className="w-6 h-6 text-orange-600" />
                    </div>
                    <h4 className="text-sm font-medium text-gray-900">3GPP Standards</h4>
                    <p className="text-xs text-gray-500">Industry compliant</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "5glabx-platform" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">5GLabX Platform</h2>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Platform Online</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-[800px]">
                {Memoized5GLabXPlatform}
              </div>
            </div>
          </div>
        )}

        {activeTab === "test-manager" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Professional Test Manager</h2>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Online</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <ProfessionalTestManager />
            </div>
          </div>
        )}


        {activeTab === "5glabx-integrated" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">5GLabX Platform + Integrated Test Manager</h2>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Full Integration Active</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 p-4 mb-6">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <div>
                  <h3 className="font-semibold text-green-800">Complete Integration Active</h3>
                  <p className="text-green-700 text-sm">Test Manager is fully integrated as a sidebar component. No data loss between Test Manager and 5GLabX!</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-[800px]">
                {MemoizedIntegratedPlatform}
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-gray-600">Settings panel coming soon...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default UserDashboard

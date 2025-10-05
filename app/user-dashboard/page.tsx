"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Activity, BarChart3, Settings, LogOut, User, Bell, HelpCircle, Shield, Monitor, TestTube, Database, Smartphone, Layers, FileText, MessageSquare, Search } from "lucide-react"
import ProfessionalTestManager from "@/components/testing/ProfessionalTestManager"
import Enhanced5GLabXPlatform from "@/components/5glabx/Enhanced5GLabXPlatform"
import NewTestManager from "@/components/testing/NewTestManager_1/NewTestManager"
import NewTestManagerFileBased from "@/components/testing/NewTestManager_1/NewTestManagerFileBased"
import New5GLabXPlatform from "@/components/5glabx/New5GLabX_1/New5GLabXPlatform"
import NewUEAnalysisPlatform from "@/components/ue-analysis/NewUEAnalysis_1/NewUEAnalysisPlatform"
import ProfessionalAnalysisPlatform from "@/components/professional-log-analysis/ProfessionalAnalysisPlatform"
import TestCaseBuilder from "@/components/testing/TestCaseBuilder/TestCaseBuilder"
import ComprehensiveTestCaseBuilder from "@/components/testing/ComprehensiveTestCaseBuilder/ComprehensiveTestCaseBuilder"
import EnhancedTestCaseBuilder from "@/components/testing/EnhancedTestCaseBuilder/EnhancedTestCaseBuilder"
import LTECellSearchBuilder from "@/components/testing/LTECellSearchBuilder/LTECellSearchBuilder"

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

  const MemoizedNew5GLabXPlatform = useMemo(() => {
    return <New5GLabXPlatform />;
  }, []);

  const MemoizedUEAnalysisPlatform = useMemo(() => {
    return <NewUEAnalysisPlatform />;
  }, []);

  const MemoizedProfessionalAnalysisPlatform = useMemo(() => {
    return <ProfessionalAnalysisPlatform executionId={null} platform="5GLABX" />;
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
            onClick={() => setActiveTab("new-test-manager")}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === "new-test-manager"
                ? "bg-primary-100 text-primary-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            New Test Manager
          </button>
          <button
            onClick={() => setActiveTab("file-based-test-manager")}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === "file-based-test-manager"
                ? "bg-primary-100 text-primary-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <TestTube className="w-4 h-4 inline mr-2" />
            File-Based Test Manager
          </button>
          <button
            onClick={() => setActiveTab("test-case-builder")}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === "test-case-builder"
                ? "bg-primary-100 text-primary-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Test Case Builder
          </button>
          <button
            onClick={() => setActiveTab("comprehensive-test-case-builder")}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === "comprehensive-test-case-builder"
                ? "bg-primary-100 text-primary-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Database className="w-4 h-4 inline mr-2" />
            Comprehensive Test Case Builder
          </button>
          <button
            onClick={() => setActiveTab("enhanced-test-case-builder")}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === "enhanced-test-case-builder"
                ? "bg-primary-100 text-primary-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Enhanced Test Case Builder
          </button>
          <button
            onClick={() => setActiveTab("lte-cell-search")}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === "lte-cell-search"
                ? "bg-primary-100 text-primary-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Search className="w-4 h-4 inline mr-2" />
            LTE Cell Search Complete
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
                  onClick={() => setActiveTab("new-5glabx")}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === "new-5glabx"
                      ? "bg-primary-100 text-primary-700"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Database className="w-4 h-4 inline mr-2" />
                  New 5GLabX
                </button>
                <button
                  onClick={() => setActiveTab("ue-analysis")}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === "ue-analysis"
                      ? "bg-primary-100 text-primary-700"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Smartphone className="w-4 h-4 inline mr-2" />
                  UE Analysis
                </button>
                <button
                  onClick={() => setActiveTab("professional-analysis")}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === "professional-analysis"
                      ? "bg-primary-100 text-primary-700"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Layers className="w-4 h-4 inline mr-2" />
                  Professional Analysis
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
                  <span className="text-sm text-gray-500">New 5GLabX Platform</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>

              {/* UE Analysis */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <Smartphone className="w-8 h-8 text-purple-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">UE Analysis</h3>
                </div>
                <p className="text-gray-600 mb-4">UE log analysis and device monitoring</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">UE Analysis Platform</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>

              {/* Professional Analysis */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <Layers className="w-8 h-8 text-orange-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Professional Analysis</h3>
                </div>
                <p className="text-gray-600 mb-4">QXDM/Keysight-compatible professional analysis tools</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Industry Standard</span>
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

        {activeTab === "new-test-manager" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">New Test Manager</h2>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Online</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-[800px]">
                <NewTestManager />
              </div>
            </div>
          </div>
        )}

        {activeTab === "file-based-test-manager" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">File-Based Test Manager</h2>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Online</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-[800px]">
                <NewTestManagerFileBased />
              </div>
            </div>
          </div>
        )}

        {activeTab === "test-case-builder" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Test Case Builder</h2>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">3GPP Compliant</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-[800px]">
                <TestCaseBuilder />
              </div>
            </div>
          </div>
        )}

        {activeTab === "comprehensive-test-case-builder" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Comprehensive Test Case Builder</h2>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">1000 Test Cases</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-[800px]">
                <ComprehensiveTestCaseBuilder />
              </div>
            </div>
          </div>
        )}

        {activeTab === "enhanced-test-case-builder" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Enhanced Test Case Builder</h2>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Complete Call Flows</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-[800px]">
                <EnhancedTestCaseBuilder />
              </div>
            </div>
          </div>
        )}

        {activeTab === "lte-cell-search" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">LTE Cell Search Complete</h2>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Complete Cell Search Procedure</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-[800px]">
                <LTECellSearchBuilder />
              </div>
            </div>
          </div>
        )}

        {activeTab === "new-5glabx" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">New 5GLabX Platform</h2>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Online</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-[800px]">
                {MemoizedNew5GLabXPlatform}
              </div>
            </div>
          </div>
        )}

        {activeTab === "ue-analysis" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">UE Analysis Platform</h2>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Online</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-[800px]">
                {MemoizedUEAnalysisPlatform}
              </div>
            </div>
          </div>
        )}

        {activeTab === "professional-analysis" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Professional Analysis Platform</h2>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Live Analysis</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-[800px]">
                {MemoizedProfessionalAnalysisPlatform}
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

"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Activity, BarChart3, Settings, LogOut, User, Bell, HelpCircle, Shield, Monitor, TestTube, Database, Smartphone } from "lucide-react"
import NewTestManager from "@/components/testing/NewTestManager_1/NewTestManager"
import New5GLabXPlatform from "@/components/5glabx/New5GLabX_1/New5GLabXPlatform"
import NewUEAnalysisPlatform from "@/components/ue-analysis/NewUEAnalysis_1/NewUEAnalysisPlatform"

const CompleteUserDashboard: React.FC = () => {
  const router = useRouter()
  const [user, setUser] = useState<any>({
    id: "user-1",
    email: "user@5glabx.com",
    full_name: "Demo User",
    role: "user",
    subscription_tier: "pro",
    subscription_status: "active",
  })
  const [activeTab, setActiveTab] = useState("test-manager")

  // Load DataFormatAdapter
  useEffect(() => {
    const loadDataFormatAdapter = async () => {
      try {
        const { DataFormatAdapter } = await import('@/utils/DataFormatAdapter');
        if (typeof window !== 'undefined') {
          (window as any).DataFormatAdapter = DataFormatAdapter;
          console.log('✅ DataFormatAdapter loaded successfully');
        }
      } catch (error) {
        console.error('❌ Failed to load DataFormatAdapter:', error);
      }
    };

    loadDataFormatAdapter();
  }, []);

  // Memoize the platforms to prevent unnecessary remounting
  const Memoized5GLabXPlatform = useMemo(() => {
    return <New5GLabXPlatform />;
  }, []);

  const MemoizedUEAnalysisPlatform = useMemo(() => {
    return <NewUEAnalysisPlatform />;
  }, []);

  const handleSignOut = () => {
    console.log("Sign out clicked")
    router.push("/login")
  }

  const tabs = [
    { id: "test-manager", label: "Test Manager", icon: TestTube, description: "Execute and manage test cases" },
    { id: "5glabx", label: "5GLabX Analysis", icon: Database, description: "Real-time network analysis and monitoring" },
    { id: "ue-analysis", label: "UE Analysis", icon: Smartphone, description: "UE log analysis and device monitoring" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-semibold text-gray-900">5GLabX Complete Platform</h1>
                <p className="text-sm text-gray-500">Professional 5G Testing, Analysis & UE Monitoring</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Platform Online</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-700">{user.full_name}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "test-manager" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-[800px]">
                <NewTestManager />
              </div>
            </div>
          </div>
        )}

        {activeTab === "5glabx" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-[800px]">
                {Memoized5GLabXPlatform}
              </div>
            </div>
          </div>
        )}

        {activeTab === "ue-analysis" && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-[800px]">
                {MemoizedUEAnalysisPlatform}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default CompleteUserDashboard
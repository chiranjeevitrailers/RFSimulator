"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Activity, BarChart3, Settings, LogOut, User, Bell, HelpCircle, Shield, Monitor } from "lucide-react"
import ProfessionalTestManager from "@/components/testing/ProfessionalTestManager"
import FiveGLabXPlatform from "@/components/5glabx/5GLabXPlatformMinimal"

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
              <nav className="ml-10 flex space-x-8">
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
                  <BarChart3 className="w-4 h-4 inline mr-2" />
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
              <p className="text-gray-600">Your 5GLabX dashboard is ready for use.</p>
            </div>

            {/* Clean Dashboard */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dashboard Status</h3>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-gray-600">Dashboard is clean and ready for new features</p>
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
                <FiveGLabXPlatform />
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

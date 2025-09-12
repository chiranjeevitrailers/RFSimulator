'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, BarChart3, FileText, Settings, Edit3, LogOut } from 'lucide-react';
import HomepageEditor from '@/components/admin/HomepageEditor';
import AuthGuard from '@/components/auth/AuthGuard';
import { sessionManager } from '@/lib/session-manager';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  const handleSignOut = () => {
    // Clear all sessions using session manager
    sessionManager.clearAllSessions();
    
    // Redirect to admin login page
    router.push('/admin/login');
  };

  useEffect(() => {
    // Ensure we're on the client side
    setIsClient(true);
  }, []);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'homepage', name: 'Homepage Editor', icon: <Edit3 className="w-4 h-4" /> },
    { id: 'users', name: 'Users', icon: <Users className="w-4 h-4" /> },
    { id: 'test-cases', name: 'Test Cases', icon: <FileText className="w-4 h-4" /> },
    { id: 'settings', name: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  // Don't render on server side
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard requireAuth={true} requireAdmin={true} redirectTo="/admin/login">
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">5G</span>
                </div>
                <span className="text-xl font-bold text-gray-900">5GLabX Admin</span>
              </div>
              <button 
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, Admin!
              </h1>
              <p className="text-gray-600">
                Here's what's happening with your platform today.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">1,234</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Test Cases</p>
                    <p className="text-2xl font-bold text-gray-900">5,678</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Services</p>
                    <p className="text-2xl font-bold text-gray-900">89</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Settings className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Equipment</p>
                    <p className="text-2xl font-bold text-gray-900">156</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('homepage')}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Edit3 className="w-5 h-5 text-primary-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Edit Homepage</p>
                    <p className="text-sm text-gray-600">Update homepage content</p>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('users')}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Users className="w-5 h-5 text-primary-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Manage Users</p>
                    <p className="text-sm text-gray-600">User management</p>
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('settings')}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-5 h-5 text-primary-600 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">System Settings</p>
                    <p className="text-sm text-gray-600">Configure system</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'homepage' && <HomepageEditor />}

        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Management</h3>
            <p className="text-gray-600">User management interface coming soon...</p>
          </div>
        )}

        {activeTab === 'test-cases' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Case Management</h3>
            <p className="text-gray-600">Test case management interface coming soon...</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>
            <p className="text-gray-600">Settings panel coming soon...</p>
          </div>
        )}
      </div>
    </div>
    </AuthGuard>
  );
};

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default AdminDashboard;
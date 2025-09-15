'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Activity, 
  Settings, 
  LogOut,
  User,
  Bell,
  HelpCircle
} from 'lucide-react';

const UserDashboard: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>({
    id: 'user-1',
    email: 'user@5glabx.com',
    full_name: 'Demo User',
    role: 'user',
    subscription_tier: 'pro',
    subscription_status: 'active'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Mock user loading for static export
    setIsLoading(false);
  }, []);

  const handleSignOut = () => {
    // Mock sign out for static export
    console.log('Sign out clicked');
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
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
                <span className="text-sm font-medium text-gray-700">
                  {user.email}
                </span>
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
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user.full_name}!</h2>
            <p className="text-gray-600">Your 5GLabX dashboard is ready.</p>
          </div>

          {/* Empty State */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="text-center">
              <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Dashboard Functionalities Removed</h3>
              <p className="text-gray-600 mb-4">
                The dashboard functionalities have been removed as requested. 
                Only the basic dashboard structure remains.
              </p>
              <p className="text-sm text-gray-500">
                Contact your administrator if you need access to specific features.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
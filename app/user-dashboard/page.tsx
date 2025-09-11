'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import SimulationDashboard from '@/components/simulation/SimulationDashboard';
import TestExecutionDashboard from '@/components/simulation/TestExecutionDashboard';
import RealTimeSimulationView from '@/components/simulation/RealTimeSimulationView';
import { 
  Activity, 
  BarChart3, 
  Settings, 
  LogOut,
  User,
  Bell,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

const UserDashboard: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('simulations');
  const [selectedExecutionId, setSelectedExecutionId] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await auth.getCurrentUser();
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
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
              <nav className="ml-10 flex space-x-8">
                <button
                  onClick={() => setActiveTab('simulations')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'simulations'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Activity className="w-4 h-4 inline mr-2" />
                  Simulations
                </button>
                <button
                  onClick={() => setActiveTab('executions')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'executions'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Activity className="w-4 h-4 inline mr-2" />
                  Executions
                </button>
                <button
                  onClick={() => setActiveTab('realtime')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'realtime'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Activity className="w-4 h-4 inline mr-2" />
                  Real-Time
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'analytics'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 inline mr-2" />
                  Analytics
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'settings'
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-500 hover:text-gray-700'
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
                <span className="text-sm font-medium text-gray-700">
                  {user.email}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'simulations' && (
          <SimulationDashboard userId={user.id} />
        )}
        
        {activeTab === 'executions' && (
          <TestExecutionDashboard userId={user.id} />
        )}
        
        {activeTab === 'realtime' && (
          <RealTimeSimulationView 
            userId={user.id} 
            executionId={selectedExecutionId || undefined}
          />
        )}
        
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics</h2>
            <p className="text-gray-600">Analytics dashboard coming soon...</p>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
            <p className="text-gray-600">Settings panel coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
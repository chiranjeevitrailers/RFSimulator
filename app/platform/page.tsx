'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User, Crown, AlertTriangle, Clock } from 'lucide-react';
import AuthGuard from '@/components/auth/AuthGuard';
import { sessionManager } from '@/lib/session-manager';
import { subscriptionManager } from '@/lib/subscription-manager';

const PlatformPage: React.FC = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  useEffect(() => {
    // Ensure we're on the client side
    setIsClient(true);
    
    // Get user session
    const userSession = sessionManager.getUserSession();
    if (userSession) {
      setUser(userSession);
      
      // Check subscription status
      const status = subscriptionManager.checkSubscriptionStatus(userSession.id);
      setSubscriptionStatus(status);
      
      // If no subscription, start a trial
      if (!status.hasAccess) {
        try {
          subscriptionManager.startTrial(userSession.id, 'starter');
          const newStatus = subscriptionManager.checkSubscriptionStatus(userSession.id);
          setSubscriptionStatus(newStatus);
        } catch (error) {
          console.error('Error starting trial:', error);
        }
      }
    }
  }, []);

  const handleSignOut = () => {
    // Clear all sessions using session manager
    sessionManager.clearAllSessions();
    
    // Redirect to login page
    router.push('/login');
  };

  // Don't render on server side
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading 5GLabX Platform...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard requireAuth={true} requireAdmin={false} redirectTo="/login">
      <div className="min-h-screen bg-gray-50">
        {/* Header with User Info and Sign Out */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">5G</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">5GLabX Platform</h1>
                    <p className="text-sm text-gray-600">Professional Protocol Analyzer & Network Simulation</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm text-gray-600">Platform Active</span>
                </div>
                
                {/* Subscription Status */}
                {subscriptionStatus && (
                  <div className="flex items-center space-x-2">
                    {subscriptionStatus.isTrial ? (
                      <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                        <Clock className="w-3 h-3" />
                        <span>Trial: {subscriptionStatus.daysRemaining} days left</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        <Crown className="w-3 h-3" />
                        <span>Subscribed</span>
                      </div>
                    )}
                    
                    {/* Trial Usage Warning */}
                    {subscriptionStatus.isTrial && subscriptionStatus.usage && (
                      <div className="flex items-center space-x-1 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                        <AlertTriangle className="w-3 h-3" />
                        <span>{subscriptionStatus.usage.testCasesThisMonth}/3 test cases used</span>
                      </div>
                    )}
                    
                    <button
                      onClick={() => setShowSubscriptionModal(true)}
                      className="text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      Manage
                    </button>
                  </div>
                )}
                
                {user && (
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user.email}
                    </span>
                  </div>
                )}
                
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content - 5GLabX Platform */}
        <main className="flex-1">
          <div className="h-screen">
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">5G</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">5GLabX Platform</h2>
                <p className="text-gray-600 mb-6">Professional Protocol Analyzer & Network Simulation</p>
                <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Features</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>O-RAN Analysis</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>NB-IoT Testing</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>V2X Communication</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>NTN Monitoring</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Protocol Layers</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Real-time Analysis</span>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Platform Status:</strong> Active and Ready
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      All 5GLabX features are available and operational
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Subscription Management Modal */}
        {showSubscriptionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Subscription Management</h3>
                  <button
                    onClick={() => setShowSubscriptionModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                
                {subscriptionStatus && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">Current Plan</span>
                        <span className="text-sm text-gray-600">
                          {subscriptionStatus.isTrial ? 'Free Trial' : 'Professional'}
                        </span>
                      </div>
                      
                      {subscriptionStatus.isTrial && (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-yellow-600 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>{subscriptionStatus.daysRemaining} days remaining</span>
                          </div>
                          <div className="text-xs text-gray-600">
                            <div className="font-medium text-red-600 mb-1">Trial Limitations:</div>
                            <div>• Only 3 test cases allowed</div>
                            <div>• 1 concurrent session only</div>
                            <div>• Limited to basic features</div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {subscriptionStatus.usage && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900">Usage This Month</h4>
                        <div className="text-sm text-gray-600">
                          <div>Test Cases: {subscriptionStatus.usage.testCasesThisMonth} / {subscriptionStatus.limitations?.testCasesPerMonth || 'Unlimited'}</div>
                          <div>API Calls: {subscriptionStatus.usage.apiCallsThisMonth} / {subscriptionStatus.limitations?.apiCallsPerMonth || 'Unlimited'}</div>
                          <div>Active Sessions: {subscriptionStatus.usage.currentSessions} / {subscriptionStatus.limitations?.concurrentSessions || 'Unlimited'}</div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex space-x-3 pt-4">
                      <button
                        onClick={() => {
                          setShowSubscriptionModal(false);
                          router.push('/pricing');
                        }}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {subscriptionStatus.isTrial ? 'Upgrade Now' : 'Change Plan'}
                      </button>
                      <button
                        onClick={() => setShowSubscriptionModal(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
};

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default PlatformPage;
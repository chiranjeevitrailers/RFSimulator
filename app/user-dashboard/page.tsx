'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User, Crown, AlertTriangle, Clock } from 'lucide-react';
import AuthGuard from '@/components/auth/AuthGuard';
import { sessionManager } from '@/lib/session-manager';
import { subscriptionManager } from '@/lib/subscription-manager';

const UserDashboard: React.FC = () => {
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

    // Load 5GLabX Platform - Simple iframe approach
    const load5GLabXPlatform = () => {
      console.log('Starting to load 5GLabX Platform...');
      const rootElement = document.getElementById('5glabx-platform-root');
      if (!rootElement) {
        console.error('5glabx-platform-root element not found!');
        return;
      }
      console.log('Found 5glabx-platform-root element:', rootElement);

      // Create iframe to load the 5GLabX platform
      const iframe = document.createElement('iframe');
      iframe.src = '/index.html';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      iframe.title = '5GLabX Platform';
      iframe.sandbox = 'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox';
      
      console.log('Created iframe with src:', iframe.src);
      
      // Add loading indicator
      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'flex items-center justify-center h-full bg-gray-100';
      loadingDiv.innerHTML = `
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-600">Loading 5GLabX Platform...</p>
        </div>
      `;
      
      rootElement.appendChild(loadingDiv);
      
      iframe.onload = () => {
        console.log('5GLabX Platform iframe loaded successfully');
        rootElement.removeChild(loadingDiv);
        rootElement.appendChild(iframe);
        console.log('5GLabX Platform loaded successfully');
      };
      
      iframe.onerror = (error) => {
        console.error('5GLabX Platform iframe failed to load:', error);
        loadingDiv.innerHTML = `
          <div class="text-center">
            <div class="text-red-600 mb-4">
              <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Failed to Load Platform</h3>
            <p class="text-gray-600 mb-4">There was an error loading the 5GLabX platform.</p>
            <button onclick="location.reload()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Retry
            </button>
          </div>
        `;
      };
    };

    // Load platform after a short delay to ensure DOM is ready
    setTimeout(load5GLabXPlatform, 100);
  }, []);

  const handleSignOut = () => {
    // Clear all sessions using session manager
    sessionManager.clearAllSessions();
    
    // Redirect to login page
    router.push('/login');
  };

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
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <h1 className="text-xl font-bold text-primary-600">5GLabX Platform</h1>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {/* Subscription Status Display */}
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
            <div id="5glabx-platform-root" className="w-full h-full">
              {/* 5GLabX Platform will be loaded here */}
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

export default UserDashboard;
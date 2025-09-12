'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';
import AuthGuard from '@/components/auth/AuthGuard';
import { sessionManager } from '@/lib/session-manager';

const PlatformPage: React.FC = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Ensure we're on the client side
    setIsClient(true);
    
    // Get user session
    const userSession = sessionManager.getUserSession();
    if (userSession) {
      setUser(userSession);
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
            <iframe
              src="/index.html"
              className="w-full h-full border-0"
              title="5GLabX Platform"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            />
          </div>
        </main>
      </div>
    </AuthGuard>
  );
};

// Disable static generation for this page
export const dynamic = 'force-dynamic';

export default PlatformPage;
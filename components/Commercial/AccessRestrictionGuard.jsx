import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, BarChart3, Shield, X } from 'lucide-react';
import { checkAccess } from '../../utils/accessRestrictions';

const AccessRestrictionGuard = ({ 
  children, 
  user, 
  action, 
  context = {},
  onUpgrade,
  onClose 
}) => {
  const [accessCheck, setAccessCheck] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const performAccessCheck = async () => {
      if (!user) {
        setAccessCheck({ allowed: false, reason: 'no_user' });
        setIsLoading(false);
        return;
      }

      try {
        const result = await checkAccess(user, action, context);
        setAccessCheck(result);
      } catch (error) {
        console.error('Access check failed:', error);
        setAccessCheck({ allowed: false, reason: 'check_failed', message: 'Access check failed. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    };

    performAccessCheck();
  }, [user, action, context]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If access is allowed, render children
  if (accessCheck.allowed) {
    return children;
  }

  // If access is denied, show restriction message
  const getRestrictionIcon = (reason) => {
    switch (reason) {
      case 'time_limit_exceeded':
      case 'grace_period':
        return <Clock className="w-6 h-6" />;
      case 'usage_limit_exceeded':
        return <BarChart3 className="w-6 h-6" />;
      case 'test_repetition_limit':
        return <AlertTriangle className="w-6 h-6" />;
      case 'concurrent_session_limit':
        return <Shield className="w-6 h-6" />;
      default:
        return <AlertTriangle className="w-6 h-6" />;
    }
  };

  const getRestrictionColor = (reason) => {
    switch (reason) {
      case 'time_limit_exceeded':
        return 'red';
      case 'grace_period':
        return 'yellow';
      case 'usage_limit_exceeded':
        return 'red';
      case 'test_repetition_limit':
        return 'yellow';
      case 'concurrent_session_limit':
        return 'red';
      default:
        return 'red';
    }
  };

  const color = getRestrictionColor(accessCheck.reason);

  return (
    <div className="access-restriction-guard">
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          {/* Background overlay */}
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

          {/* Modal */}
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            {/* Header */}
            <div className={`bg-${color}-50 px-6 py-4 border-b border-${color}-200`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getRestrictionIcon(accessCheck.reason)}
                  <h3 className={`text-lg font-semibold text-${color}-900`}>
                    Access Restricted
                  </h3>
                </div>
                {onClose && (
                  <button
                    onClick={onClose}
                    className={`text-${color}-400 hover:text-${color}-600 transition-colors`}
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-4">
              <p className={`text-${color}-700 mb-4`}>
                {accessCheck.message}
              </p>

              {/* Additional details based on restriction type */}
              {accessCheck.reason === 'time_limit_exceeded' && (
                <div className={`bg-${color}-100 border border-${color}-200 rounded-lg p-4 mb-4`}>
                  <h4 className={`font-medium text-${color}-800 mb-2`}>Your free trial has expired</h4>
                  <p className={`text-sm text-${color}-700`}>
                    You've been using the free tier for 4 months. To continue using the platform, 
                    please upgrade to a paid plan.
                  </p>
                </div>
              )}

              {accessCheck.reason === 'usage_limit_exceeded' && (
                <div className={`bg-${color}-100 border border-${color}-200 rounded-lg p-4 mb-4`}>
                  <h4 className={`font-medium text-${color}-800 mb-2`}>Usage limit reached</h4>
                  <p className={`text-sm text-${color}-700`}>
                    Current usage: {accessCheck.currentUsage} / {accessCheck.limit}
                  </p>
                </div>
              )}

              {accessCheck.reason === 'test_repetition_limit' && (
                <div className={`bg-${color}-100 border border-${color}-200 rounded-lg p-4 mb-4`}>
                  <h4 className={`font-medium text-${color}-800 mb-2`}>Test repetition limit</h4>
                  <p className={`text-sm text-${color}-700`}>
                    You've executed this test case {accessCheck.recentExecutions} times in the last hour. 
                    Please wait {accessCheck.cooldownMinutes} minutes before trying again.
                  </p>
                </div>
              )}

              {accessCheck.reason === 'concurrent_session_limit' && (
                <div className={`bg-${color}-100 border border-${color}-200 rounded-lg p-4 mb-4`}>
                  <h4 className={`font-medium text-${color}-800 mb-2`}>Concurrent session limit</h4>
                  <p className={`text-sm text-${color}-700`}>
                    You have {accessCheck.currentSessions} active sessions. 
                    Maximum allowed: {accessCheck.maxSessions}
                  </p>
                </div>
              )}

              {/* Upgrade options */}
              {accessCheck.upgradeRequired && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-blue-800 mb-2">Upgrade to continue</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Upgrade to Pro or Enterprise to remove these restrictions and get access to more features.
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={onUpgrade}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Upgrade Now
                    </button>
                    <button
                      onClick={onClose}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Maybe Later
                    </button>
                  </div>
                </div>
              )}

              {/* Non-upgrade restrictions */}
              {!accessCheck.upgradeRequired && (
                <div className="flex space-x-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Understood
                  </button>
                  {accessCheck.reason === 'test_repetition_limit' && (
                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Refresh Page
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessRestrictionGuard;
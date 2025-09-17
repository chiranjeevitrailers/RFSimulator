import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, BarChart3, Shield, Upgrade } from 'lucide-react';
import { checkTimeLimit, checkUsageLimit, getUserUsageStats } from '../../utils/accessRestrictions';

const AccessRestrictions = ({ user, onUpgrade }) => {
  const [usageStats, setUsageStats] = useState({});
  const [restrictions, setRestrictions] = useState({});
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (user) {
      // Check time limits
      const timeCheck = checkTimeLimit(user);
      setRestrictions(prev => ({ ...prev, time: timeCheck }));

      // Get usage statistics
      getUserUsageStats(user.id).then(stats => {
        setUsageStats(stats);
        
        // Check usage limits
        const usageCheck = checkUsageLimit(user, 'testExecutions', stats);
        setRestrictions(prev => ({ ...prev, usage: usageCheck }));
      });
    }
  }, [user]);

  const getRestrictionIcon = (type) => {
    switch (type) {
      case 'time':
        return <Clock className="w-5 h-5" />;
      case 'usage':
        return <BarChart3 className="w-5 h-5" />;
      case 'security':
        return <Shield className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getRestrictionColor = (restriction) => {
    if (!restriction.allowed) return 'red';
    if (restriction.warning) return 'yellow';
    return 'green';
  };

  const getUsagePercentage = (current, limit) => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((current / limit) * 100, 100);
  };

  const getUsageColor = (percentage) => {
    if (percentage >= 90) return 'red';
    if (percentage >= 70) return 'yellow';
    return 'green';
  };

  return (
    <div className="access-restrictions">
      {/* Time Limit Warning */}
      {restrictions.time && (restrictions.time.warning || !restrictions.time.allowed) && (
        <div className={`mb-4 p-4 rounded-lg border ${
          restrictions.time.allowed 
            ? 'bg-yellow-50 border-yellow-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start">
            {getRestrictionIcon('time')}
            <div className="ml-3 flex-1">
              <h3 className={`text-sm font-medium ${
                restrictions.time.allowed ? 'text-yellow-800' : 'text-red-800'
              }`}>
                {restrictions.time.allowed ? 'Trial Expiring Soon' : 'Trial Expired'}
              </h3>
              <p className={`mt-1 text-sm ${
                restrictions.time.allowed ? 'text-yellow-700' : 'text-red-700'
              }`}>
                {restrictions.time.message}
              </p>
              {restrictions.time.daysRemaining > 0 && (
                <p className="mt-1 text-sm text-yellow-600">
                  {restrictions.time.daysRemaining} days remaining
                </p>
              )}
              {restrictions.time.upgradeRequired && (
                <button
                  onClick={onUpgrade}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Upgrade Now
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Usage Statistics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Usage & Limits</h3>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        {/* Test Executions */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Test Executions</span>
            <span className="text-sm text-gray-600">
              {usageStats.testExecutions || 0} / {user?.tier === 'enterprise' ? '∞' : user?.tier === 'pro' ? '100' : '3'} today
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                getUsageColor(getUsagePercentage(usageStats.testExecutions || 0, user?.tier === 'enterprise' ? -1 : user?.tier === 'pro' ? 100 : 3)) === 'red' ? 'bg-red-500' :
                getUsageColor(getUsagePercentage(usageStats.testExecutions || 0, user?.tier === 'enterprise' ? -1 : user?.tier === 'pro' ? 100 : 3)) === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${getUsagePercentage(usageStats.testExecutions || 0, user?.tier === 'enterprise' ? -1 : user?.tier === 'pro' ? 100 : 3)}%` }}
            ></div>
          </div>
        </div>

        {/* API Calls */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">API Calls</span>
            <span className="text-sm text-gray-600">
              {usageStats.apiCalls || 0} / {user?.tier === 'enterprise' ? '∞' : user?.tier === 'pro' ? '1000' : '5'} per hour
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                getUsageColor(getUsagePercentage(usageStats.apiCalls || 0, user?.tier === 'enterprise' ? -1 : user?.tier === 'pro' ? 1000 : 5)) === 'red' ? 'bg-red-500' :
                getUsageColor(getUsagePercentage(usageStats.apiCalls || 0, user?.tier === 'enterprise' ? -1 : user?.tier === 'pro' ? 1000 : 5)) === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${getUsagePercentage(usageStats.apiCalls || 0, user?.tier === 'enterprise' ? -1 : user?.tier === 'pro' ? 1000 : 5)}%` }}
            ></div>
          </div>
        </div>

        {/* Storage Usage */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Storage</span>
            <span className="text-sm text-gray-600">
              {usageStats.storageUsed || 0} MB / {user?.tier === 'enterprise' ? '10 GB' : user?.tier === 'pro' ? '1 GB' : '10 MB'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                getUsageColor(getUsagePercentage(usageStats.storageUsed || 0, user?.tier === 'enterprise' ? 10000 : user?.tier === 'pro' ? 1000 : 10)) === 'red' ? 'bg-red-500' :
                getUsageColor(getUsagePercentage(usageStats.storageUsed || 0, user?.tier === 'enterprise' ? 10000 : user?.tier === 'pro' ? 1000 : 10)) === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${getUsagePercentage(usageStats.storageUsed || 0, user?.tier === 'enterprise' ? 10000 : user?.tier === 'pro' ? 1000 : 10)}%` }}
            ></div>
          </div>
        </div>

        {/* Detailed Usage Information */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Detailed Usage</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Exports this week:</span>
                <span className="ml-2 font-medium">{usageStats.exports || 0}</span>
              </div>
              <div>
                <span className="text-gray-600">Bandwidth used:</span>
                <span className="ml-2 font-medium">{usageStats.bandwidthUsed || 0} GB</span>
              </div>
              <div>
                <span className="text-gray-600">Current tier:</span>
                <span className="ml-2 font-medium capitalize">{user?.tier || 'free'}</span>
              </div>
              <div>
                <span className="text-gray-600">Period:</span>
                <span className="ml-2 font-medium">{usageStats.period || 'day'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Upgrade CTA for Free Users */}
        {user?.tier === 'free' && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Need more resources?</h4>
                <p className="text-sm text-gray-600">Upgrade to Pro for higher limits and advanced features</p>
              </div>
              <button
                onClick={onUpgrade}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Upgrade className="w-4 h-4" />
                <span>Upgrade</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Usage Restrictions Info */}
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-800">Usage Restrictions</h4>
            <p className="text-sm text-blue-700 mt-1">
              To ensure fair usage and prevent abuse, we have implemented usage limits and restrictions. 
              These limits help maintain service quality for all users.
            </p>
            <ul className="text-sm text-blue-700 mt-2 list-disc list-inside">
              <li>Free users: 4-month trial period</li>
              <li>Test case repetition limits to prevent spam</li>
              <li>Resource usage monitoring</li>
              <li>Concurrent session limits</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessRestrictions;
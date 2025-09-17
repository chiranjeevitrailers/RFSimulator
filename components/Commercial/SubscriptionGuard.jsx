import React, { useState, useEffect } from 'react';
import { Lock, Crown, Zap, ArrowRight } from 'lucide-react';

const SubscriptionGuard = ({ 
  children, 
  requiredTier = 'pro', 
  feature = 'this feature',
  currentTier = 'free',
  onUpgrade 
}) => {
  const [showUpgrade, setShowUpgrade] = useState(false);

  // Check if user has access to the feature
  const hasAccess = () => {
    const tierHierarchy = { free: 0, pro: 1, enterprise: 2 };
    return tierHierarchy[currentTier] >= tierHierarchy[requiredTier];
  };

  // Get tier information
  const getTierInfo = (tier) => {
    const tiers = {
      free: {
        name: 'Free',
        color: 'gray',
        icon: Lock,
        description: '3 Test Cases',
        features: ['Basic 5G NR', 'Basic LTE', 'Basic IMS']
      },
      pro: {
        name: 'Pro',
        color: 'blue',
        icon: Crown,
        description: '1000+ Test Cases',
        features: ['All Protocols', 'Advanced Analysis', 'Export & API']
      },
      enterprise: {
        name: 'Enterprise',
        color: 'purple',
        icon: Zap,
        description: 'Unlimited',
        features: ['Custom Protocols', 'White-label', 'Dedicated Support']
      }
    };
    return tiers[tier];
  };

  const currentTierInfo = getTierInfo(currentTier);
  const requiredTierInfo = getTierInfo(requiredTier);

  // If user has access, render children
  if (hasAccess()) {
    return children;
  }

  // Show upgrade prompt
  return (
    <div className="subscription-guard">
      <div className="upgrade-prompt-overlay">
        <div className="upgrade-prompt">
          <div className="upgrade-header">
            <div className="tier-comparison">
              <div className="current-tier">
                <currentTierInfo.icon className={`w-8 h-8 text-${currentTierInfo.color}-600`} />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{currentTierInfo.name}</h3>
                  <p className="text-sm text-gray-600">{currentTierInfo.description}</p>
                </div>
              </div>
              
              <ArrowRight className="w-6 h-6 text-gray-400 mx-4" />
              
              <div className="required-tier">
                <requiredTierInfo.icon className={`w-8 h-8 text-${requiredTierInfo.color}-600`} />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{requiredTierInfo.name}</h3>
                  <p className="text-sm text-gray-600">{requiredTierInfo.description}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="upgrade-content">
            <div className="upgrade-message">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Upgrade to {requiredTierInfo.name} to access {feature}
              </h2>
              <p className="text-gray-600 mb-6">
                Unlock {requiredTierInfo.description} and get access to all professional features
              </p>
            </div>

            <div className="feature-comparison">
              <div className="current-features">
                <h4 className="font-semibold text-gray-900 mb-2">Current Plan Features:</h4>
                <ul className="space-y-1">
                  {currentTierInfo.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="upgrade-features">
                <h4 className="font-semibold text-gray-900 mb-2">Upgrade to {requiredTierInfo.name}:</h4>
                <ul className="space-y-1">
                  {requiredTierInfo.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="upgrade-actions">
              <button
                onClick={onUpgrade}
                className={`w-full px-6 py-3 bg-${requiredTierInfo.color}-600 text-white rounded-lg font-semibold hover:bg-${requiredTierInfo.color}-700 transition-colors flex items-center justify-center space-x-2`}
              >
                <Crown className="w-5 h-5" />
                <span>Upgrade to {requiredTierInfo.name}</span>
              </button>
              
              <button
                onClick={() => setShowUpgrade(false)}
                className="w-full px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionGuard;
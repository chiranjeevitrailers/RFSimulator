import React, { useState } from 'react';
import { X, Crown, Zap, Lock, ArrowRight, Star, Check } from 'lucide-react';

const UpgradePrompt = ({ 
  isOpen, 
  onClose, 
  onUpgrade, 
  currentTier = 'free',
  feature = 'this feature',
  showPricing = false 
}) => {
  const [selectedPlan, setSelectedPlan] = useState('pro');

  if (!isOpen) return null;

  const plans = {
    pro: {
      id: 'pro',
      name: 'Pro',
      price: 99,
      period: 'month',
      icon: Crown,
      color: 'blue',
      features: [
        '1000+ Test Cases (All Protocols)',
        'Advanced Protocol Analysis',
        'Real-time Monitoring',
        'Export & Reporting',
        'API Access',
        'Priority Support',
        '5 User Accounts'
      ],
      popular: true
    },
    enterprise: {
      id: 'enterprise',
      name: 'Enterprise',
      price: 299,
      period: 'month',
      icon: Zap,
      color: 'purple',
      features: [
        'Unlimited Test Cases',
        'Custom Protocol Support',
        'Advanced Analytics',
        'White-label Solution',
        'Dedicated Support',
        'Unlimited Users',
        'Custom Integrations'
      ],
      popular: false
    }
  };

  const getCurrentTierInfo = (tier) => {
    const tiers = {
      free: {
        name: 'Free',
        icon: Lock,
        color: 'gray',
        description: '3 Test Cases',
        features: ['Basic 5G NR', 'Basic LTE', 'Basic IMS']
      },
      pro: {
        name: 'Pro',
        icon: Crown,
        color: 'blue',
        description: '1000+ Test Cases',
        features: ['All Protocols', 'Advanced Analysis', 'Export & API']
      }
    };
    return tiers[tier] || tiers.free;
  };

  const currentTierInfo = getCurrentTierInfo(currentTier);

  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade(selectedPlan);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Upgrade to unlock {feature}
                </h3>
                <p className="text-gray-600 mt-1">
                  Get access to professional features and unlimited test cases
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Current vs Upgrade Comparison */}
            <div className="mb-8">
              <div className="flex items-center justify-center space-x-8">
                {/* Current Plan */}
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-${currentTierInfo.color}-100 mb-4`}>
                    <currentTierInfo.icon className={`w-8 h-8 text-${currentTierInfo.color}-600`} />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">{currentTierInfo.name}</h4>
                  <p className="text-sm text-gray-600">{currentTierInfo.description}</p>
                </div>

                <ArrowRight className="w-6 h-6 text-gray-400" />

                {/* Upgrade Plan */}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                    <Crown className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Pro</h4>
                  <p className="text-sm text-gray-600">1000+ Test Cases</p>
                </div>
              </div>
            </div>

            {/* Pricing Options */}
            {showPricing && (
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Plan</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.values(plans).map((plan) => {
                    const Icon = plan.icon;
                    return (
                      <div
                        key={plan.id}
                        className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
                          selectedPlan === plan.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        {plan.popular && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                              <Star className="w-3 h-3" />
                              <span>Popular</span>
                            </div>
                          </div>
                        )}

                        <div className="text-center">
                          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-${plan.color}-100 mb-4`}>
                            <Icon className={`w-6 h-6 text-${plan.color}-600`} />
                          </div>
                          <h5 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h5>
                          <div className="mb-4">
                            <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                            <span className="text-gray-600 ml-1">/{plan.period}</span>
                          </div>
                        </div>

                        <ul className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start text-sm">
                              <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Feature Benefits */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">What you'll get with Pro:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">1000+ Test Cases</h5>
                    <p className="text-sm text-gray-600">Access to all 5G NR, LTE, IMS, O-RAN, V2X, NTN, and NB-IoT test cases</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">Advanced Analysis</h5>
                    <p className="text-sm text-gray-600">Professional protocol analysis with detailed IE validation</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">Export & API</h5>
                    <p className="text-sm text-gray-600">Export test results and access via API for automation</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">Priority Support</h5>
                    <p className="text-sm text-gray-600">24/7 priority support with dedicated account manager</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>7-day free trial</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>30-day money-back guarantee</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <p>Need help choosing? <button className="text-blue-600 hover:text-blue-800">Contact our sales team</button></p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Maybe Later
              </button>
              <button
                onClick={handleUpgrade}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Crown className="w-4 h-4" />
                <span>Upgrade to Pro</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePrompt;
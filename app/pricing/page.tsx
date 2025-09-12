'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Star, Zap, Shield, Users, Building2 } from 'lucide-react';

const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for individual developers and small teams',
      icon: <Zap className="w-6 h-6" />,
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: [
        'Access to 5GLabX Platform',
        'Basic Protocol Analysis',
        'O-RAN Network Monitoring',
        'NB-IoT Testing Tools',
        'V2X Communication Analysis',
        'NTN Satellite Monitoring',
        'Standard Support',
        '5 Concurrent Sessions'
      ],
      limitations: [
        'Limited to 100 test cases per month',
        'Basic analytics only',
        'Community support'
      ],
      popular: false,
      cta: 'Start Free Trial',
      href: '/signup?plan=starter'
    },
    {
      name: 'Professional',
      description: 'Ideal for professional developers and medium teams',
      icon: <Shield className="w-6 h-6" />,
      monthlyPrice: 99,
      yearlyPrice: 990,
      features: [
        'Everything in Starter',
        'Advanced Protocol Analysis',
        'Real-time Network Monitoring',
        'Custom Test Case Creation',
        'Advanced Analytics & Reporting',
        'API Access',
        'Priority Support',
        '25 Concurrent Sessions',
        'Data Export (CSV, JSON)',
        'Custom Integrations'
      ],
      limitations: [
        'Limited to 1000 test cases per month',
        'Standard SLA (99.5%)'
      ],
      popular: true,
      cta: 'Start Free Trial',
      href: '/signup?plan=professional'
    },
    {
      name: 'Enterprise',
      description: 'For large organizations and enterprise teams',
      icon: <Building2 className="w-6 h-6" />,
      monthlyPrice: 299,
      yearlyPrice: 2990,
      features: [
        'Everything in Professional',
        'Unlimited Test Cases',
        'Advanced Security Features',
        'Custom Deployment Options',
        'Dedicated Account Manager',
        '24/7 Premium Support',
        'Unlimited Concurrent Sessions',
        'White-label Options',
        'Custom Training & Onboarding',
        'SLA Guarantee (99.9%)',
        'Advanced Compliance Tools'
      ],
      limitations: [],
      popular: false,
      cta: 'Contact Sales',
      href: '/contact?plan=enterprise'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">5G</span>
              </div>
              <span className="text-xl font-bold text-gray-900">5GLabX</span>
            </Link>
            <nav className="flex items-center space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link href="/features" className="text-gray-600 hover:text-gray-900">Features</Link>
              <Link href="/pricing" className="text-blue-600 font-medium">Pricing</Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
              <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Sign In
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Start with a <strong>14-day free trial</strong> (3 test cases only) to experience the 5GLabX Platform. 
            Upgrade to unlock unlimited access to professional protocol analysis, real-time monitoring, 
            and advanced 5G/4G testing capabilities.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                Save 17%
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl shadow-lg border-2 ${
                  plan.popular ? 'border-blue-500' : 'border-gray-200'
                } p-8`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 text-blue-600">
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">
                      ${billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                    </span>
                    <span className="text-gray-600 ml-2">
                      /{billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>

                  <Link
                    href={plan.href}
                    className={`w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg transition-colors ${
                      plan.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 mb-3">What's included:</h4>
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.limitations.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3">Limitations:</h4>
                      {plan.limitations.map((limitation, limitIndex) => (
                        <div key={limitIndex} className="flex items-start space-x-3">
                          <span className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0">•</span>
                          <span className="text-gray-600">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trial Information */}
      <section className="py-16 bg-yellow-50 border-y border-yellow-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🎯 Free Trial - Limited Access
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              New users get a <strong>14-day free trial</strong> with <strong>limited access</strong> to test the platform:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 mb-2">Test Cases</h3>
                <p className="text-red-700 text-sm">Only <strong>3 test cases</strong> allowed during trial</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 mb-2">Sessions</h3>
                <p className="text-red-700 text-sm">Only <strong>1 concurrent session</strong> at a time</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 mb-2">Features</h3>
                <p className="text-red-700 text-sm">Limited to <strong>basic features only</strong></p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              <strong>Upgrade to any paid plan</strong> to unlock unlimited test cases, advanced features, and full platform access.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I try the platform before subscribing?
              </h3>
              <p className="text-gray-600">
                Yes! New users get a 14-day free trial with limited access (3 test cases only). 
                No credit card required to start. Upgrade to unlock full platform access.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What happens if I exceed my plan limits?
              </h3>
              <p className="text-gray-600">
                We'll notify you when you're approaching your limits. You can upgrade your plan or purchase additional capacity as needed.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600">
                Absolutely. You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you offer custom enterprise solutions?
              </h3>
              <p className="text-gray-600">
                Yes! Our Enterprise plan includes custom deployment options, dedicated support, and tailored solutions for large organizations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of developers and engineers using 5GLabX Platform
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-blue-600 bg-white hover:bg-gray-50 transition-colors"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">5G</span>
                </div>
                <span className="text-xl font-bold">5GLabX</span>
              </div>
              <p className="text-gray-400">
                Professional 5G/4G protocol analysis and network simulation platform.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features" className="hover:text-white">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link href="/docs" className="hover:text-white">Documentation</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/feedback" className="hover:text-white">Feedback</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 5GLabX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PricingPage;
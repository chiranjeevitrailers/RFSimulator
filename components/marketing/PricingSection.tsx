'use client';

import React, { useState } from 'react';
import { Check, X, Star, Zap, Crown, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for getting started with protocol analysis',
      price: { monthly: 0, annual: 0 },
      icon: <Zap className="w-6 h-6" />,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      popular: false,
      features: [
        '5 test cases per month',
        'Basic protocol analysis',
        'Community support',
        'Standard export formats',
        'Basic dashboard',
        'Limited to 1 user',
      ],
      limitations: [
        'No advanced analytics',
        'No team collaboration',
        'No API access',
        'No priority support',
      ],
      cta: 'Get Started Free',
      ctaVariant: 'outline' as const,
    },
    {
      name: 'Professional',
      description: 'Ideal for individual engineers and small teams',
      price: { monthly: 49, annual: 39 },
      icon: <Star className="w-6 h-6" />,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
      borderColor: 'border-primary-200',
      popular: true,
      features: [
        'Unlimited test cases',
        'Advanced protocol analysis',
        'Real-time simulation',
        'Professional dashboard',
        'Export to multiple formats',
        'Email support',
        'Up to 5 team members',
        'Basic analytics',
        'Custom test scenarios',
        'API access (limited)',
      ],
      limitations: [
        'No advanced team features',
        'No dedicated support',
      ],
      cta: 'Start Free Trial',
      ctaVariant: 'primary' as const,
    },
    {
      name: 'Enterprise',
      description: 'Complete solution for large organizations',
      price: { monthly: 149, annual: 119 },
      icon: <Crown className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      popular: false,
      features: [
        'Everything in Professional',
        'Unlimited team members',
        'Advanced team collaboration',
        'Custom integrations',
        'Dedicated support',
        'Priority support',
        'Advanced analytics',
        'Custom reporting',
        'SSO integration',
        'Audit logging',
        'Custom deployment',
        'Training & onboarding',
        'SLA guarantee',
        'API access (unlimited)',
      ],
      limitations: [],
      cta: 'Contact Sales',
      ctaVariant: 'secondary' as const,
    },
  ];

  const addOns = [
    {
      name: 'Additional Team Members',
      description: 'Add more team members to your plan',
      price: { monthly: 10, annual: 8 },
      unit: 'per user/month',
    },
    {
      name: 'Priority Support',
      description: 'Get faster response times and dedicated support',
      price: { monthly: 25, annual: 20 },
      unit: 'per month',
    },
    {
      name: 'Custom Integrations',
      description: 'Integrate with your existing tools and systems',
      price: { monthly: 50, annual: 40 },
      unit: 'per integration',
    },
    {
      name: 'Training & Onboarding',
      description: 'Professional training for your team',
      price: { monthly: 100, annual: 80 },
      unit: 'per session',
    },
  ];

  const faqs = [
    {
      question: 'Can I change my plan at any time?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate any billing differences.',
    },
    {
      question: 'What happens to my data if I cancel?',
      answer: 'Your data is safely stored for 30 days after cancellation. You can export all your data during this period or reactivate your account.',
    },
    {
      question: 'Do you offer educational discounts?',
      answer: 'Yes, we offer special pricing for educational institutions and students. Contact our sales team for more information.',
    },
    {
      question: 'Is there a free trial for Enterprise?',
      answer: 'Yes, we offer a 14-day free trial for all plans, including Enterprise. No credit card required to start.',
    },
  ];

  return (
    <section id="pricing" className="section-padding bg-gray-50">
      <div className="container-max">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose the plan that fits your needs. All plans include our core protocol analysis features 
            with no hidden fees or setup costs.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                isAnnual ? 'bg-primary-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
              Annual
            </span>
            {isAnnual && (
              <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                Save 20%
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg border-2 ${
                plan.popular ? 'border-primary-500 scale-105' : plan.borderColor
              } overflow-hidden`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`w-16 h-16 ${plan.bgColor} rounded-xl flex items-center justify-center ${plan.color} mx-auto mb-4`}>
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900">
                        ${isAnnual ? plan.price.annual : plan.price.monthly}
                      </span>
                      <span className="text-gray-600 ml-1">/month</span>
                    </div>
                    {isAnnual && plan.price.annual !== plan.price.monthly && (
                      <div className="text-sm text-gray-500 mt-1">
                        Billed annually (${plan.price.annual * 12}/year)
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                  {plan.limitations.map((limitation, limitationIndex) => (
                    <div key={limitationIndex} className="flex items-start">
                      <X className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-500">{limitation}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  variant={plan.ctaVariant}
                  size="lg"
                  className="w-full"
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Add-ons */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Add-ons & Extensions
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {addOns.map((addon, index) => (
              <div key={index} className="card card-hover">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {addon.name}
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  {addon.description}
                </p>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-primary-600">
                    ${isAnnual ? addon.price.annual : addon.price.monthly}
                  </span>
                  <span className="text-gray-600 ml-1 text-sm">
                    {addon.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <div key={index} className="card">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h4>
                <p className="text-gray-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of network professionals who trust 5GLabX for their protocol analysis needs. 
              Start your free trial today - no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" size="lg">
                Contact Sales
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              14-day free trial • No setup fees • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
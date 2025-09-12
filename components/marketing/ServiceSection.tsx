'use client';

import React, { useState } from 'react';
import { 
  Cloud, 
  Zap, 
  Shield, 
  BarChart3, 
  Users, 
  Globe, 
  Clock, 
  CheckCircle,
  ArrowRight,
  Play,
  Settings,
  Headphones,
  Rocket,
  Target,
  Award,
  TrendingUp
} from 'lucide-react';

const serviceFeatures = [
  {
    icon: Cloud,
    title: 'Cloud-Based Testing',
    description: 'Access 5G testing infrastructure from anywhere in the world',
    benefits: ['24/7 availability', 'Global access', 'Scalable resources']
  },
  {
    icon: Zap,
    title: 'Real-Time Simulation',
    description: 'Live 5G network simulation with instant results',
    benefits: ['Instant feedback', 'Live monitoring', 'Real-time analytics']
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-grade security for your testing data and processes',
    benefits: ['Data encryption', 'Secure access', 'Compliance ready']
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Comprehensive insights and reporting for your 5G projects',
    benefits: ['Detailed reports', 'Performance metrics', 'Trend analysis']
  }
];

const serviceTiers = [
  {
    name: 'Starter',
    price: '$99',
    period: '/month',
    description: 'Perfect for individual developers and small teams',
    features: [
      'Up to 10 test cases',
      'Basic 5G simulation',
      'Standard support',
      '1 concurrent user',
      'Basic analytics',
      'Email support'
    ],
    popular: false,
    cta: 'Start Free Trial'
  },
  {
    name: 'Professional',
    price: '$299',
    period: '/month',
    description: 'Ideal for growing teams and mid-size projects',
    features: [
      'Up to 100 test cases',
      'Advanced 5G simulation',
      'Priority support',
      '5 concurrent users',
      'Advanced analytics',
      'API access',
      'Phone support',
      'Custom integrations'
    ],
    popular: true,
    cta: 'Start Free Trial'
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'Tailored solutions for large organizations',
    features: [
      'Unlimited test cases',
      'Full 5G simulation suite',
      'Dedicated support',
      'Unlimited users',
      'Custom analytics',
      'Full API access',
      '24/7 phone support',
      'Custom integrations',
      'On-premise deployment',
      'SLA guarantee'
    ],
    popular: false,
    cta: 'Contact Sales'
  }
];

const serviceCapabilities = [
  {
    icon: Globe,
    title: 'Global Infrastructure',
    description: 'Access 5G testing infrastructure across multiple regions',
    stats: '15+ Data Centers'
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Round-the-clock access to testing resources',
    stats: '99.9% Uptime'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Collaborate with team members across different locations',
    stats: 'Unlimited Teams'
  },
  {
    icon: TrendingUp,
    title: 'Scalable Resources',
    description: 'Scale your testing resources based on project needs',
    stats: 'Auto-Scaling'
  }
];

const useCases = [
  {
    title: '5G Network Testing',
    description: 'Comprehensive testing of 5G network components and protocols',
    icon: Target,
    benefits: ['Protocol validation', 'Performance testing', 'Interoperability checks']
  },
  {
    title: 'Device Certification',
    description: 'Test and certify 5G devices for compliance and performance',
    icon: Award,
    benefits: ['Compliance testing', 'Performance validation', 'Certification reports']
  },
  {
    title: 'Application Development',
    description: 'Develop and test 5G applications with real network conditions',
    icon: Rocket,
    benefits: ['Real-world testing', 'Performance optimization', 'User experience validation']
  },
  {
    title: 'Research & Development',
    description: 'Advanced research capabilities for 5G technology development',
    icon: Settings,
    benefits: ['Custom scenarios', 'Advanced analytics', 'Research tools']
  }
];

const ServiceSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="5glab-service" className="py-20 bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="container-max">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-full text-sm font-medium mb-4">
            <Cloud className="w-4 h-4 mr-2" />
            5GLAB as a Service
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Professional 5G Testing as a Service
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access enterprise-grade 5G testing infrastructure, simulation tools, and expert support through our cloud-based platform
          </p>
        </div>

        {/* Service Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {serviceFeatures.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
                <feature.icon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {feature.description}
              </p>
              <ul className="space-y-1">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Service Capabilities */}
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Enterprise-Grade Capabilities
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Built for scale, security, and performance to meet the demands of modern 5G development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {serviceCapabilities.map((capability, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <capability.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {capability.title}
                </h4>
                <p className="text-gray-600 mb-3">
                  {capability.description}
                </p>
                <div className="text-2xl font-bold text-primary-600">
                  {capability.stats}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Use Cases
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From development to deployment, 5GLAB as a Service supports your entire 5G journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start mb-4">
                  <div className="p-3 bg-primary-100 rounded-lg mr-4">
                    <useCase.icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">
                      {useCase.title}
                    </h4>
                    <p className="text-gray-600">
                      {useCase.description}
                    </p>
                  </div>
                </div>
                
                <ul className="space-y-2">
                  {useCase.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Flexible pricing options to match your team size and project requirements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {serviceTiers.map((tier, index) => (
              <div key={index} className={`relative bg-white rounded-2xl shadow-lg p-8 ${
                tier.popular ? 'ring-2 ring-primary-600 transform scale-105' : ''
              }`}>
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">
                    {tier.name}
                  </h4>
                  <p className="text-gray-600 mb-4">
                    {tier.description}
                  </p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">
                      {tier.price}
                    </span>
                    <span className="text-gray-600 ml-1">
                      {tier.period}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  tier.popular
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}>
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of 5G professionals who trust 5GLAB as a Service for their testing needs. Start your free trial today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button className="inline-flex items-center px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-lg font-medium">
                <Play className="w-5 h-5 mr-2" />
                Start Free Trial
              </button>
              <button className="inline-flex items-center px-8 py-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-lg font-medium">
                <Headphones className="w-5 h-5 mr-2" />
                Schedule Demo
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-gray-600">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                14-day free trial
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
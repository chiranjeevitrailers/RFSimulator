'use client';

import React from 'react';
import { ArrowRight, Play, BarChart3, Download } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      title: 'Sign Up & Access',
      description: 'Create your account and get instant access to our comprehensive test case library.',
      icon: <Play className="w-6 h-6" />,
      details: [
        'Quick registration process',
        'Instant access to platform',
        'Free trial available',
        'No credit card required'
      ]
    },
    {
      number: '02',
      title: 'Select Test Case',
      description: 'Choose from 1000+ test cases across 7 different protocol categories.',
      icon: <BarChart3 className="w-6 h-6" />,
      details: [
        'Browse by protocol type',
        'Filter by complexity',
        'Search specific scenarios',
        'Preview test details'
      ]
    },
    {
      number: '03',
      title: 'Execute & Analyze',
      description: 'Run real-time protocol simulation and analyze results with professional tools.',
      icon: <Download className="w-6 h-6" />,
      details: [
        'Real-time execution',
        'Live protocol analysis',
        'Professional dashboard',
        'Export results'
      ]
    }
  ];

  return (
    <section id="how-it-works" className="section-padding gradient-bg">
      <div className="container-max">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get started with professional 3GPP protocol analysis in just three simple steps. 
            No complex setup or hardware required.
          </p>
        </div>

        {/* Steps */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Step Card */}
              <div className="card card-hover h-full">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 mb-6">
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {step.description}
                </p>

                {/* Details */}
                <ul className="space-y-2">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-3"></div>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Arrow (except for last step) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="w-8 h-8 text-primary-300" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Demo Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Demo Content */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                See It In Action
              </h3>
              <p className="text-gray-600 mb-6">
                Watch our interactive demo to see how 5GLabX Protocol Simulator works in real-time. 
                Experience the power of professional protocol analysis.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Real-time protocol simulation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Authentic 3GPP message flows</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Professional analysis tools</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Export and reporting</span>
                </div>
              </div>

              <button className="btn-primary mt-6">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </button>
            </div>

            {/* Right - Demo Visual */}
            <div className="relative">
              <div className="bg-gray-900 rounded-lg p-6 font-mono text-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <span className="text-gray-400">5GLabX Simulator</span>
                </div>
                
                <div className="space-y-2">
                  <div className="text-green-400">
                    [2024-01-15 10:30:45] PHY: RSRP=-85dBm, RSRQ=-12dB
                  </div>
                  <div className="text-blue-400">
                    [2024-01-15 10:30:46] MAC: HARQ Process 8: ACK
                  </div>
                  <div className="text-yellow-400">
                    [2024-01-15 10:30:47] RRC: RRC Setup Request
                  </div>
                  <div className="text-purple-400">
                    [2024-01-15 10:30:48] NAS: Registration Request
                  </div>
                  <div className="text-green-400">
                    [2024-01-15 10:30:49] RRC: RRC Setup Complete
                  </div>
                  <div className="text-blue-400">
                    [2024-01-15 10:30:50] NAS: Registration Accept
                  </div>
                </div>
              </div>

              {/* Floating Stats */}
              <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200">
                <div className="text-sm font-semibold text-gray-900">Test Status</div>
                <div className="text-xs text-green-600">✓ Running</div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200">
                <div className="text-sm font-semibold text-gray-900">Progress</div>
                <div className="text-xs text-blue-600">75% Complete</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
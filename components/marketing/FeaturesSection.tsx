'use client';

import React from 'react';
import { 
  Zap, 
  Shield, 
  Layers, 
  BarChart3, 
  Globe, 
  Users, 
  Clock, 
  CheckCircle,
  Cpu,
  Network,
  Database,
  Monitor
} from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <Layers className="w-8 h-8" />,
      title: 'Multi-Layer Protocol Analysis',
      description: 'Comprehensive analysis across PHY, MAC, RLC, PDCP, RRC, and NAS layers with real-time visualization.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Real-Time Simulation',
      description: 'Live protocol simulation with authentic 3GPP-compliant values and realistic timing.',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: '3GPP Compliance',
      description: 'Full compliance with 3GPP standards including ASN.1 decoding and message validation.',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Professional Analytics',
      description: 'Advanced statistics, KPIs, and performance metrics with customizable dashboards.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Global Protocol Support',
      description: 'Support for 4G LTE, 5G NR, IMS/SIP, O-RAN, NB-IoT, V2X, and NTN protocols.',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Team Collaboration',
      description: 'Multi-user support with role-based access control and team management features.',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: '24/7 Access',
      description: 'Cloud-based platform accessible anywhere, anytime with automatic updates.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: '1000+ Test Cases',
      description: 'Comprehensive test case library covering all major scenarios and edge cases.',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
    },
  ];

  const protocols = [
    { name: '4G LTE', icon: <Network className="w-6 h-6" />, count: '150 Test Cases' },
    { name: '5G NR', icon: <Cpu className="w-6 h-6" />, count: '150 Test Cases' },
    { name: 'IMS/SIP', icon: <Monitor className="w-6 h-6" />, count: '100 Test Cases' },
    { name: 'O-RAN', icon: <Database className="w-6 h-6" />, count: '100 Test Cases' },
    { name: 'NB-IoT', icon: <Zap className="w-6 h-6" />, count: '50 Test Cases' },
    { name: 'V2X', icon: <Globe className="w-6 h-6" />, count: '50 Test Cases' },
    { name: 'NTN', icon: <Shield className="w-6 h-6" />, count: '50 Test Cases' },
  ];

  return (
    <section id="features" className="section-padding bg-white">
      <div className="container-max">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for Professional{' '}
            <span className="gradient-text">Protocol Analysis</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform provides comprehensive tools and features to master 5G and 4G network protocols 
            with professional-grade analysis capabilities.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card card-hover text-center"
            >
              <div className={`w-16 h-16 ${feature.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4 ${feature.color}`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Protocol Support */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Supported Protocols & Test Cases
            </h3>
            <p className="text-gray-600">
              Comprehensive coverage of all major 3GPP protocols with authentic test scenarios
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {protocols.map((protocol, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow duration-200"
              >
                <div className="text-primary-600 mb-2 flex justify-center">
                  {protocol.icon}
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  {protocol.name}
                </h4>
                <p className="text-sm text-gray-600">
                  {protocol.count}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-primary-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start Your Protocol Analysis Journey?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of network professionals who trust 5GLabX for their 3GPP protocol analysis needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">
                Start Free Trial
              </button>
              <button className="btn-outline">
                View All Features
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
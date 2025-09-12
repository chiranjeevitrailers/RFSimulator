'use client';

import React, { useState } from 'react';
import { 
  Wifi, 
  Smartphone, 
  Router, 
  Server, 
  Antenna, 
  Cpu, 
  HardDrive, 
  Network,
  ArrowRight,
  CheckCircle,
  Zap,
  Shield,
  BarChart3
} from 'lucide-react';

const equipmentTypes = [
  {
    icon: Antenna,
    title: '5G Base Stations',
    description: 'Manage your 5G NR base stations, gNBs, and radio units',
    features: ['Multi-band support', 'MIMO configurations', 'Power management']
  },
  {
    icon: Smartphone,
    title: 'UE Devices',
    description: 'Track 5G user equipment and test devices',
    features: ['Device capabilities', 'Protocol support', 'Performance metrics']
  },
  {
    icon: Server,
    title: 'Core Network',
    description: 'Monitor 5G core network components and services',
    features: ['AMF, SMF, UPF', 'Service mesh', 'Network slicing']
  },
  {
    icon: Router,
    title: 'Network Equipment',
    description: 'Manage routers, switches, and network infrastructure',
    features: ['Traffic routing', 'QoS policies', 'Security protocols']
  },
  {
    icon: Cpu,
    title: 'Test Equipment',
    description: 'Track specialized 5G testing and measurement tools',
    features: ['Signal analyzers', 'Protocol testers', 'Performance monitors']
  },
  {
    icon: Network,
    title: 'Simulators',
    description: 'Manage network simulators and emulation platforms',
    features: ['Channel models', 'Traffic generation', 'Scenario testing']
  }
];

const benefits = [
  {
    icon: CheckCircle,
    title: 'Complete Inventory',
    description: 'Track all your 5G equipment in one centralized location'
  },
  {
    icon: Zap,
    title: 'Real-time Status',
    description: 'Monitor equipment status, health, and performance metrics'
  },
  {
    icon: Shield,
    title: 'Compliance Tracking',
    description: 'Ensure regulatory compliance and certification tracking'
  },
  {
    icon: BarChart3,
    title: 'Analytics & Reports',
    description: 'Generate detailed reports and analytics on equipment usage'
  }
];

const EquipmentSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="equipment" className="py-20 bg-gray-50">
      <div className="container-max">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Equipment Management
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive 5G equipment inventory and management system for your testing lab
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <benefit.icon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Equipment Types */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Supported Equipment Types
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {equipmentTypes.map((equipment, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-primary-100 rounded-lg mr-4">
                    <equipment.icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      {equipment.title}
                    </h4>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">
                  {equipment.description}
                </p>
                
                <ul className="space-y-2">
                  {equipment.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Features Showcase */}
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Advanced Equipment Tracking
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                    <CheckCircle className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Detailed Specifications
                    </h4>
                    <p className="text-gray-600">
                      Track frequency ranges, power output, protocol support, and technical specifications for each piece of equipment.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                    <Zap className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Status Monitoring
                    </h4>
                    <p className="text-gray-600">
                      Real-time status tracking including active, inactive, and maintenance states with automated alerts.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                    <Shield className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Compliance & Certification
                    </h4>
                    <p className="text-gray-600">
                      Track firmware versions, certifications, and compliance requirements for regulatory adherence.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  Start Managing Equipment
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8">
                <div className="space-y-4">
                  {/* Mock Equipment Card */}
                  <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="p-2 bg-primary-100 rounded-lg mr-3">
                          <Antenna className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900">5GLabX Base Station A1</h5>
                          <p className="text-sm text-gray-600">5GLabX --&gt;4G&5G LAB BS-001</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Active
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div>Serial: 5GLabX-SN-001</div>
                      <div>Firmware: 5GLabX-v2.1.3</div>
                      <div>Location: 5GLabX Lab A</div>
                      <div>Frequency: 5GLabX 3.5-3.7 GHz</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="p-2 bg-primary-100 rounded-lg mr-3">
                          <Smartphone className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900">5GLabX Test UE Device</h5>
                          <p className="text-sm text-gray-600">5GLabX --&gt;4G&5G LAB UE-001</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        Maintenance
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div>Serial: 5GLabX-SN-002</div>
                      <div>Firmware: 5GLabX-v1.8.2</div>
                      <div>Location: 5GLabX Test Bench</div>
                      <div>Protocol: 5GLabX 5G NR</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="p-2 bg-primary-100 rounded-lg mr-3">
                          <Cpu className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900">5GLabX Signal Analyzer</h5>
                          <p className="text-sm text-gray-600">5GLabX --&gt;4G&5G LAB SA-001</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Active
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div>Serial: 5GLabX-SN-003</div>
                      <div>Firmware: 5GLabX-v3.2.1</div>
                      <div>Location: 5GLabX Rack 2</div>
                      <div>Range: 5GLabX 1Hz-44GHz</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to manage your 5G equipment?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of 5G professionals who trust 5GLabX for their equipment management needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              View Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EquipmentSection;
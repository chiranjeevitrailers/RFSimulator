'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Cloud, 
  Zap, 
  Shield, 
  BarChart3, 
  Users, 
  Globe, 
  Clock,
  CheckCircle,
  Play,
  Settings,
  Headphones,
  Rocket,
  Target,
  Award,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';

interface ServiceInstance {
  id: string;
  name: string;
  type: 'testing' | 'simulation' | 'analytics' | 'development';
  status: 'active' | 'inactive' | 'maintenance' | 'suspended';
  plan: 'starter' | 'professional' | 'enterprise';
  createdAt: string;
  lastUsed: string;
  usage: {
    testCases: number;
    maxTestCases: number;
    users: number;
    maxUsers: number;
    storage: number;
    maxStorage: number;
  };
  cost: number;
}

const serviceTypes = [
  { value: 'testing', label: '5G Testing Service', icon: Target, color: 'bg-blue-100 text-blue-600' },
  { value: 'simulation', label: 'Network Simulation', icon: Zap, color: 'bg-green-100 text-green-600' },
  { value: 'analytics', label: 'Analytics & Reporting', icon: BarChart3, color: 'bg-purple-100 text-purple-600' },
  { value: 'development', label: 'Development Environment', icon: Settings, color: 'bg-orange-100 text-orange-600' }
];

const servicePlans = [
  { value: 'starter', label: 'Starter', price: 99, color: 'bg-gray-100 text-gray-800' },
  { value: 'professional', label: 'Professional', price: 299, color: 'bg-blue-100 text-blue-800' },
  { value: 'enterprise', label: 'Enterprise', price: 0, color: 'bg-purple-100 text-purple-800' }
];

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<ServiceInstance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Mock user for static export
    setUser({ email: 'demo@example.com', name: 'Demo User', role: 'admin' });
    
    // Mock services data
    setServices([
      {
        id: '1',
        name: '5G Network Testing Lab',
        type: 'testing',
        status: 'active',
        plan: 'professional',
        createdAt: '2024-01-15',
        lastUsed: '2024-01-20',
        usage: {
          testCases: 45,
          maxTestCases: 100,
          users: 3,
          maxUsers: 5,
          storage: 2.5,
          maxStorage: 10
        },
        cost: 299
      },
      {
        id: '2',
        name: '5G Simulation Environment',
        type: 'simulation',
        status: 'active',
        plan: 'starter',
        createdAt: '2024-01-10',
        lastUsed: '2024-01-19',
        usage: {
          testCases: 8,
          maxTestCases: 10,
          users: 1,
          maxUsers: 1,
          storage: 0.8,
          maxStorage: 5
        },
        cost: 99
      }
    ]);
    
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getServiceType = (type: string) => {
    return serviceTypes.find(t => t.value === type) || serviceTypes[0];
  };

  const getServicePlan = (plan: string) => {
    return servicePlans.find(p => p.value === plan) || servicePlans[0];
  };

  const totalCost = services.reduce((sum, service) => sum + service.cost, 0);
  const activeServices = services.filter(s => s.status === 'active').length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">5GLAB as a Service</h1>
                <p className="text-sm text-gray-600">Manage your 5G testing services and subscriptions</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'services', label: 'My Services', icon: Cloud },
              { id: 'billing', label: 'Billing', icon: Shield },
              { id: 'support', label: 'Support', icon: Headphones }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Cloud className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Services</p>
                    <p className="text-2xl font-bold text-gray-900">{activeServices}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Test Cases</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {services.reduce((sum, s) => sum + s.usage.testCases, 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Team Members</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {services.reduce((sum, s) => sum + s.usage.users, 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Monthly Cost</p>
                    <p className="text-2xl font-bold text-gray-900">${totalCost}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Types Overview */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Service Types</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {serviceTypes.map((type) => (
                  <div key={type.value} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-3">
                      <div className={`p-2 rounded-lg ${type.color}`}>
                        <type.icon className="w-6 h-6" />
                      </div>
                      <h4 className="font-medium text-gray-900 ml-3">{type.label}</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      {type.value === 'testing' && 'Comprehensive 5G network testing capabilities'}
                      {type.value === 'simulation' && 'Real-time 5G network simulation environment'}
                      {type.value === 'analytics' && 'Advanced analytics and reporting tools'}
                      {type.value === 'development' && 'Development environment for 5G applications'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">My Services</h3>
              <button className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                <Plus className="w-4 h-4 mr-2" />
                Add New Service
              </button>
            </div>

            <div className="grid gap-6">
              {services.map((service) => {
                const serviceType = getServiceType(service.type);
                const servicePlan = getServicePlan(service.plan);
                
                return (
                  <div key={service.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${serviceType.color}`}>
                          <serviceType.icon className="w-8 h-8" />
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-gray-900">{service.name}</h4>
                          <p className="text-gray-600">{serviceType.label}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                              {service.status}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${servicePlan.color}`}>
                              {servicePlan.label} Plan
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">${service.cost}/month</p>
                        <p className="text-sm text-gray-600">Last used: {service.lastUsed}</p>
                      </div>
                    </div>

                    {/* Usage Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Test Cases</span>
                          <span className="text-gray-900">{service.usage.testCases}/{service.usage.maxTestCases}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full" 
                            style={{ width: `${(service.usage.testCases / service.usage.maxTestCases) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Users</span>
                          <span className="text-gray-900">{service.usage.users}/{service.usage.maxUsers}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${(service.usage.users / service.usage.maxUsers) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Storage</span>
                          <span className="text-gray-900">{service.usage.storage}GB/{service.usage.maxStorage}GB</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ width: `${(service.usage.storage / service.usage.maxStorage) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-3">
                      <button className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                        <Play className="w-4 h-4 mr-2" />
                        Launch Service
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Billing & Usage</h3>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Billing information and usage details will be displayed here.</p>
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Support & Help</h3>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Support resources and help documentation will be displayed here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
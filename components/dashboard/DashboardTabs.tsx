'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  BarChart3, 
  Settings, 
  FileText,
  Play,
  Shield,
  Award,
  Database,
  Monitor,
  MessageSquare,
  Layers,
  CreditCard,
  Crown,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Globe,
  Server,
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  Router,
  Smartphone,
  Wifi,
  Signal,
  Battery,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Download,
  Upload,
  RefreshCw,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  Copy,
  Share,
  ExternalLink,
  Maximize2,
  Minimize2,
  Pause,
  Square,
  RotateCcw,
  Code,
  TrendingUp,
  Target,
  Info,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Save,
  Send,
  FileText as FileTextIcon,
  BookOpen,
  Terminal,
  Command,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ChevronLeft,
  User,
  Bell,
  HelpCircle
} from 'lucide-react';

// Subscription Plans Tab
export const SubscriptionTab: React.FC = () => {
  const [currentPlan, setCurrentPlan] = useState('free');
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      features: [
        'Up to 10 test executions per month',
        'Basic protocol analysis',
        'Standard support',
        'Community access'
      ],
      limitations: [
        'Limited to 3GPP basic tests',
        'No real-time monitoring',
        'Basic analytics only'
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      price: { monthly: 99, yearly: 990 },
      features: [
        'Unlimited test executions',
        'Advanced protocol analysis',
        'Real-time monitoring',
        'Professional test cases',
        'Advanced analytics',
        'Priority support',
        'API access'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: { monthly: 299, yearly: 2990 },
      features: [
        'Everything in Professional',
        'Custom test cases',
        'White-label solution',
        'Dedicated support',
        'On-premise deployment',
        'Custom integrations',
        'SLA guarantee'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg flex items-center justify-center">
            <Crown className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Subscription Plans</h2>
            <p className="text-sm text-gray-500">Choose the perfect plan for your 5G testing needs</p>
          </div>
        </div>
      </div>

      {/* Current Plan Status */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Plan</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Crown className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Professional Plan</h4>
              <p className="text-sm text-gray-500">Billed monthly • Next billing: Dec 15, 2024</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              Manage Billing
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Cancel Plan
            </button>
          </div>
        </div>
      </div>

      {/* Billing Cycle Toggle */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-center space-x-4">
          <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-primary-600' : 'text-gray-500'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-600 transition-colors"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-primary-600' : 'text-gray-500'}`}>
            Yearly
          </span>
          {billingCycle === 'yearly' && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              Save 20%
            </span>
          )}
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-lg border-2 p-6 relative ${
              plan.popular ? 'border-primary-500' : 'border-gray-200'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary-500 text-white px-3 py-1 text-xs font-medium rounded-full">
                  Most Popular
                </span>
              </div>
            )}
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">
                  ${billingCycle === 'yearly' ? plan.price.yearly : plan.price.monthly}
                </span>
                <span className="text-gray-500 ml-1">
                  /{billingCycle === 'yearly' ? 'year' : 'month'}
                </span>
              </div>
              {billingCycle === 'yearly' && plan.price.yearly > 0 && (
                <p className="text-sm text-gray-500">
                  ${Math.round(plan.price.yearly / 12)}/month billed yearly
                </p>
              )}
            </div>

            <div className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </div>
              ))}
            </div>

            {plan.limitations && (
              <div className="space-y-2 mb-6">
                <h4 className="text-sm font-medium text-gray-900">Limitations:</h4>
                {plan.limitations.map((limitation, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-gray-500">{limitation}</span>
                  </div>
                ))}
              </div>
            )}

            <button
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                plan.popular
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              {plan.id === currentPlan ? 'Current Plan' : 'Choose Plan'}
            </button>
          </div>
        ))}
      </div>

      {/* Usage Statistics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage This Month</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">47</div>
            <div className="text-sm text-gray-500">Test Executions</div>
            <div className="text-xs text-gray-400">of unlimited</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">2.3GB</div>
            <div className="text-sm text-gray-500">Data Processed</div>
            <div className="text-xs text-gray-400">of 10GB limit</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">12</div>
            <div className="text-sm text-gray-500">API Calls</div>
            <div className="text-xs text-gray-400">of 1000 limit</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simulations Tab
export const SimulationsTab: React.FC = () => {
  const [simulations, setSimulations] = useState([
    {
      id: '1',
      name: '5G NR Initial Access',
      status: 'running',
      progress: 75,
      startTime: new Date(Date.now() - 300000),
      protocol: '5G NR',
      testCases: 15
    },
    {
      id: '2',
      name: 'LTE Handover Procedure',
      status: 'completed',
      progress: 100,
      startTime: new Date(Date.now() - 1800000),
      protocol: '4G LTE',
      testCases: 8
    },
    {
      id: '3',
      name: 'IMS SIP Registration',
      status: 'pending',
      progress: 0,
      startTime: null,
      protocol: 'IMS/SIP',
      testCases: 12
    }
  ]);

  const [selectedSimulation, setSelectedSimulation] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Simulations</h2>
              <p className="text-sm text-gray-500">Manage and monitor your protocol simulations</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            <Plus className="w-4 h-4 mr-2 inline" />
            New Simulation
          </button>
        </div>
      </div>

      {/* Active Simulations */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Simulations</h3>
        <div className="space-y-4">
          {simulations.map((sim) => (
            <div
              key={sim.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedSimulation === sim.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedSimulation(selectedSimulation === sim.id ? null : sim.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Play className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{sim.name}</h4>
                    <p className="text-sm text-gray-500">{sim.protocol} • {sim.testCases} test cases</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {sim.status === 'running' ? `${sim.progress}%` : sim.status}
                    </div>
                    <div className="text-xs text-gray-500">
                      {sim.startTime ? new Date(sim.startTime).toLocaleTimeString() : 'Not started'}
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    sim.status === 'running' ? 'bg-green-500' :
                    sim.status === 'completed' ? 'bg-blue-500' : 'bg-gray-400'
                  }`} />
                </div>
              </div>
              {sim.status === 'running' && (
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${sim.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Simulation Templates */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Simulation Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: '5G NR Initial Access', protocol: '5G NR', testCases: 15, description: 'Complete initial access procedure testing' },
            { name: 'LTE Handover', protocol: '4G LTE', testCases: 8, description: 'Inter-cell handover scenarios' },
            { name: 'IMS Registration', protocol: 'IMS/SIP', testCases: 12, description: 'SIP registration and authentication' },
            { name: 'O-RAN F1 Interface', protocol: 'O-RAN', testCases: 20, description: 'F1 interface protocol testing' },
            { name: 'NB-IoT Attach', protocol: 'NB-IoT', testCases: 6, description: 'Narrowband IoT attachment procedures' },
            { name: 'V2X Communication', protocol: 'V2X', testCases: 10, description: 'Vehicle-to-everything communication' }
          ].map((template, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 cursor-pointer">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Play className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{template.name}</h4>
                  <p className="text-xs text-gray-500">{template.protocol}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{template.testCases} test cases</span>
                <button className="text-primary-600 text-sm font-medium hover:text-primary-700">
                  Start Simulation
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Executions Tab
export const ExecutionsTab: React.FC = () => {
  const [executions, setExecutions] = useState([
    {
      id: '1',
      name: '5G NR Initial Access',
      status: 'completed',
      startTime: new Date(Date.now() - 1800000),
      endTime: new Date(Date.now() - 1200000),
      duration: 600000,
      testCases: 15,
      passed: 14,
      failed: 1,
      protocol: '5G NR'
    },
    {
      id: '2',
      name: 'LTE Handover Procedure',
      status: 'completed',
      startTime: new Date(Date.now() - 3600000),
      endTime: new Date(Date.now() - 3000000),
      duration: 600000,
      testCases: 8,
      passed: 8,
      failed: 0,
      protocol: '4G LTE'
    },
    {
      id: '3',
      name: 'IMS SIP Registration',
      status: 'failed',
      startTime: new Date(Date.now() - 7200000),
      endTime: new Date(Date.now() - 6600000),
      duration: 600000,
      testCases: 12,
      passed: 5,
      failed: 7,
      protocol: 'IMS/SIP'
    }
  ]);

  const [selectedExecution, setSelectedExecution] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Test Executions</h2>
              <p className="text-sm text-gray-500">View and analyze your test execution history</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Executions</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="running">Running</option>
            </select>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
              <Download className="w-4 h-4 mr-2 inline" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Execution Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Executions</p>
              <p className="text-2xl font-bold text-gray-900">{executions.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round((executions.filter(e => e.status === 'completed').length / executions.length) * 100)}%
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Duration</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatDuration(executions.reduce((acc, e) => acc + e.duration, 0) / executions.length)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Test Cases</p>
              <p className="text-2xl font-bold text-gray-900">
                {executions.reduce((acc, e) => acc + e.testCases, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Execution History */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Execution History</h3>
        <div className="space-y-4">
          {executions.map((execution) => (
            <div
              key={execution.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedExecution === execution.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedExecution(selectedExecution === execution.id ? null : execution.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    execution.status === 'completed' ? 'bg-green-100' :
                    execution.status === 'failed' ? 'bg-red-100' : 'bg-yellow-100'
                  }`}>
                    {execution.status === 'completed' ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : execution.status === 'failed' ? (
                      <XCircle className="w-6 h-6 text-red-600" />
                    ) : (
                      <Clock className="w-6 h-6 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{execution.name}</h4>
                    <p className="text-sm text-gray-500">
                      {execution.protocol} • {execution.testCases} test cases • {formatDuration(execution.duration)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {execution.passed}/{execution.testCases} passed
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(execution.startTime).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Real-Time Tab
export const RealTimeTab: React.FC = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: '1',
      timestamp: Date.now() - 5000,
      direction: 'UL',
      layer: 'PHY',
      protocol: 'NR-PHY',
      messageType: 'RandomAccessPreamble',
      data: 'RA Preamble ID: 15, RA-RNTI: 12345'
    },
    {
      id: '2',
      timestamp: Date.now() - 3000,
      direction: 'DL',
      layer: 'MAC',
      protocol: 'NR-MAC',
      messageType: 'RandomAccessResponse',
      data: 'RA Response, TA: 12, UL Grant: 0x1A2B'
    },
    {
      id: '3',
      timestamp: Date.now() - 1000,
      direction: 'UL',
      layer: 'RRC',
      protocol: 'NR-RRC',
      messageType: 'RRCSetupRequest',
      data: 'UE Identity: 0x12345678, Establishment Cause: mo-Data'
    }
  ]);

  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-100 to-pink-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Real-Time Monitoring</h2>
              <p className="text-sm text-gray-500">Live protocol message monitoring and analysis</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMonitoring(!isMonitoring)}
              className={`px-4 py-2 rounded-lg font-medium ${
                isMonitoring
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isMonitoring ? (
                <>
                  <Square className="w-4 h-4 mr-2 inline" />
                  Stop Monitoring
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2 inline" />
                  Start Monitoring
                </>
              )}
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              <Settings className="w-4 h-4 mr-2 inline" />
              Configure
            </button>
          </div>
        </div>
      </div>

      {/* Monitoring Status */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-4 h-4 rounded-full ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className="font-medium text-gray-900">
              {isMonitoring ? 'Monitoring Active' : 'Monitoring Stopped'}
            </span>
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <span>Messages: {messages.length}</span>
            <span>Last Update: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Message Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Message Flow</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedMessage === message.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedMessage(selectedMessage === message.id ? null : message.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      message.direction === 'UL' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {message.direction}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                      {message.layer}
                    </span>
                    <span className="text-xs text-gray-500">{message.protocol}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-900 mb-1">{message.messageType}</div>
                <div className="text-xs text-gray-600">{message.data}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Message Details</h3>
          {selectedMessage ? (
            <div className="space-y-4">
              {(() => {
                const message = messages.find(m => m.id === selectedMessage);
                return message ? (
                  <>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Protocol Information</h4>
                      <div className="bg-gray-50 p-3 rounded-lg text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div><span className="font-medium">Direction:</span> {message.direction}</div>
                          <div><span className="font-medium">Layer:</span> {message.layer}</div>
                          <div><span className="font-medium">Protocol:</span> {message.protocol}</div>
                          <div><span className="font-medium">Type:</span> {message.messageType}</div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Message Data</h4>
                      <div className="bg-gray-900 text-green-400 p-3 rounded-lg text-sm font-mono">
                        {message.data}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Timestamp</h4>
                      <div className="text-sm text-gray-600">
                        {new Date(message.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </>
                ) : null;
              })()}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Select a message to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Protocol Statistics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Protocol Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">12</div>
            <div className="text-sm text-gray-500">UL Messages</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">8</div>
            <div className="text-sm text-gray-500">DL Messages</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">5</div>
            <div className="text-sm text-gray-500">Protocols</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">3</div>
            <div className="text-sm text-gray-500">Layers</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Placeholder components for other tabs
export const AnalyticsTab: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Dashboard</h3>
    <p className="text-gray-600">Analytics dashboard implementation coming soon...</p>
  </div>
);

export const APIDocsTab: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">API Documentation</h3>
    <p className="text-gray-600">API documentation implementation coming soon...</p>
  </div>
);

export const APITestingTab: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">API Testing Interface</h3>
    <p className="text-gray-600">API testing interface implementation coming soon...</p>
  </div>
);

export const ThreeGPPTestCasesTab: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">3GPP Test Cases</h3>
    <p className="text-gray-600">3GPP test cases implementation coming soon...</p>
  </div>
);

export const ProfessionalTestCasesTab: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Test Cases</h3>
    <p className="text-gray-600">Professional test cases implementation coming soon...</p>
  </div>
);

export const DetailedTestCasesTab: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Test Cases</h3>
    <p className="text-gray-600">Detailed test cases implementation coming soon...</p>
  </div>
);

export const ProtocolAnalyzerTab: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Protocol Analyzer</h3>
    <p className="text-gray-600">Protocol analyzer implementation coming soon...</p>
  </div>
);

export const LogViewerTab: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Log Viewer</h3>
    <p className="text-gray-600">Log viewer implementation coming soon...</p>
  </div>
);

export const ProtocolLayersTab: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Protocol Layers</h3>
    <p className="text-gray-600">Protocol layers implementation coming soon...</p>
  </div>
);

export const MonitoringTab: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Monitoring Dashboard</h3>
    <p className="text-gray-600">Monitoring dashboard implementation coming soon...</p>
  </div>
);

export const SettingsTab: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
    <p className="text-gray-600">Settings implementation coming soon...</p>
  </div>
);
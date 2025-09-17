import React, { useState } from 'react';
import { Settings, CreditCard, FileText, Key, Globe, Percent, Boxes, Brain } from 'lucide-react';
import PlansSettings from './PlansSettings';
import PaymentGatewaySettings from './PaymentGatewaySettings';
import ApiConfigSettings from './ApiConfigSettings';
import TaxSettings from './TaxSettings';
import InvoicesTable from './InvoicesTable';
import MLInsights from './MLInsights';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('plans');

  const tabs = [
    { id: 'plans', name: 'Subscription Plans', icon: Boxes },
    { id: 'gateways', name: 'Payment Gateways', icon: CreditCard },
    { id: 'api', name: 'API Configuration', icon: Key },
    { id: 'tax', name: 'Tax / GST', icon: Percent },
    { id: 'webhooks', name: 'Webhooks', icon: Globe },
    { id: 'invoices', name: 'Invoices', icon: FileText },
    { id: 'ml', name: 'ML Insights', icon: Brain }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'plans':
        return <PlansSettings />;
      case 'gateways':
        return <PaymentGatewaySettings />;
      case 'api':
        return <ApiConfigSettings />;
      case 'tax':
        return <TaxSettings />;
      case 'invoices':
        return <InvoicesTable />;
      case 'ml':
        return <MLInsights />;
      case 'webhooks':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Webhooks</h3>
            <p className="text-gray-600">Configure Stripe/Razorpay webhooks in your payment provider dashboards to point to your domain:</p>
            <ul className="list-disc pl-6 mt-3 text-sm text-gray-700">
              <li>Stripe: /api/webhooks/stripe</li>
              <li>Razorpay: /api/webhooks/razorpay</li>
            </ul>
          </div>
        );
      default:
        return <PlansSettings />;
    }
  };

  return (
    <div className="admin-dashboard h-full flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Settings className="w-5 h-5 text-gray-700" />
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
        <div className="text-sm text-gray-600">SaaS Controls</div>
      </div>

      <div className="bg-white border-b border-gray-200">
        <nav className="flex space-x-6 px-6 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
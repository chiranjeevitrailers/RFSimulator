import React, { useState } from 'react';
import { 
  Home, TestTube, Activity, BarChart3, Settings, 
  Bell, User, LogOut, Menu, X
} from 'lucide-react';

// Import consolidated tab components
import OverviewTab from './OverviewTab';
import TestManagementTab from './TestManagementTab';
import ProtocolAnalysisTab from './ProtocolAnalysisTab';
import AnalyticsTab from './AnalyticsTab';
import SettingsTab from './SettingsTab';

const OptimizedUserDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    {
      id: 'overview',
      name: 'Overview',
      icon: Home,
      description: 'Dashboard home with summary statistics and recent activity'
    },
    {
      id: 'test-management',
      name: 'Test Management',
      icon: TestTube,
      description: 'Unified test management with 1000+ test cases and real-time monitoring'
    },
    {
      id: 'protocol-analysis',
      name: 'Protocol Analysis',
      icon: Activity,
      description: 'Real-time protocol analysis with professional QXDM/Keysight-like interface'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: BarChart3,
      description: 'Performance analytics, compliance reports, and trend analysis'
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: Settings,
      description: 'Configuration, preferences, and account management'
    }
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'test-management':
        return <TestManagementTab />;
      case 'protocol-analysis':
        return <ProtocolAnalysisTab />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <OverviewTab />;
    }
  };

  const getActiveTabInfo = () => {
    return tabs.find(tab => tab.id === activeTab) || tabs[0];
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header Navigation Bar */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">5G</span>
                </div>
                <span className="text-xl font-bold text-gray-900">5GLabX</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{tab.name}</span>
                  </button>
                );
              })}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>

              {/* User Profile */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  user@5glabx.com
                </span>
              </div>

              {/* Sign Out */}
              <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <LogOut className="w-4 h-4" />
                <span className="hidden md:block text-sm">Sign Out</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <nav className="px-6 py-4 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium">{tab.name}</div>
                      <div className="text-xs opacity-75">{tab.description}</div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Tab Description Bar */}
      <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-blue-900">
              {getActiveTabInfo().name}
            </h1>
            <p className="text-sm text-blue-700">
              {getActiveTabInfo().description}
            </p>
          </div>
          
          {/* Tab-specific status indicators */}
          <div className="flex items-center space-x-4">
            {activeTab === 'test-management' && (
              <div className="flex items-center space-x-2 text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">1000+ Test Cases Available</span>
              </div>
            )}
            {activeTab === 'protocol-analysis' && (
              <div className="flex items-center space-x-2 text-blue-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">Real-time Analysis Active</span>
              </div>
            )}
            {activeTab === 'analytics' && (
              <div className="flex items-center space-x-2 text-purple-600">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium">Analytics Dashboard Ready</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        {renderActiveTab()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>© 2024 5GLabX Platform</span>
            <span>•</span>
            <span>Professional 5G/4G Protocol Testing</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Version 2.0</span>
            <span>•</span>
            <span>3GPP Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default OptimizedUserDashboard;
'use client';

import React, { useState } from 'react';
import { Activity, BarChart3, Grid, ListChecks } from 'lucide-react';

// Reuse existing rich views already implemented in the codebase
import TestSuitesView from '@/components/5glabx/views/TestSuitesView';
import TestExecutionDashboard from '@/components/simulation/TestExecutionDashboard';
import AnalyticsView from '@/components/5glabx/views/AnalyticsView';

type TabKey = 'library' | 'execute' | 'analytics';

const tabs: { key: TabKey; label: string; icon: any }[] = [
  { key: 'library', label: 'Test Library', icon: Grid },
  { key: 'execute', label: 'Execution', icon: Activity },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 }
];

const TestDashboard: React.FC<{ userId?: string }> = ({ userId = 'demo-user' }) => {
  const [active, setActive] = useState<TabKey>('library');

  const renderActive = () => {
    switch (active) {
      case 'library':
        return (
          <div className="min-h-[600px]">
            <TestSuitesView appState={{}} onStateChange={() => {}} />
          </div>
        );
      case 'execute':
        return (
          <div className="p-4">
            <TestExecutionDashboard userId={userId} />
          </div>
        );
      case 'analytics':
        return (
          <div className="min-h-[600px]">
            <AnalyticsView appState={{}} onStateChange={() => {}} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white border-b border-gray-200 px-4">
        <div className="flex items-center space-x-2 overflow-x-auto">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`px-4 py-3 text-sm font-medium inline-flex items-center whitespace-nowrap border-b-2 -mb-px transition-colors ${
                active === key
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {renderActive()}
    </div>
  );
};

export default TestDashboard;


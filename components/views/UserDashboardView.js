// UserDashboardView - Mirrors 5GLABX_USER_DASHBOARD_DIAGRAM.md
function UserDashboardView({ appState, onStateChange }) {
  try {
    React.useEffect(() => {
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }, []);

    const TABS = [
      { id: 'overview', label: 'Overview', icon: 'home' },
      { id: 'simulations', label: 'Simulations', icon: 'workflow' },
      { id: 'protocol-analyzer', label: 'Protocol Analyzer', icon: 'activity' },
      { id: 'analytics', label: 'Analytics', icon: 'bar-chart-3' },
      { id: 'platform', label: '5GLabX Platform', icon: 'layout-dashboard' },
      { id: 'advanced-analyzer', label: 'Advanced Analyzer', icon: 'settings' },
      { id: 'test-suites', label: 'Test Suites', icon: 'files' },
      { id: 'professional-testing', label: 'Professional Testing', icon: 'test-tube' },
      { id: 'settings', label: 'Settings', icon: 'sliders-horizontal' }
    ];

    const [selectedTab, setSelectedTab] = React.useState('overview');

    const StatCard = ({ title, value, color, icon }) => (
      React.createElement('div', { className: 'bg-white p-4 rounded-lg border shadow-sm flex items-center justify-between' }, [
        React.createElement('div', { key: 'left' }, [
          React.createElement('p', { key: 't', className: 'text-sm text-gray-500' }, title),
          React.createElement('p', { key: 'v', className: `text-2xl font-bold ${color}` }, value)
        ]),
        React.createElement('i', { key: 'i', 'data-lucide': icon, className: 'w-6 h-6 text-gray-400' })
      ])
    );

    const HeaderBar = () => (
      React.createElement('div', { className: 'bg-white border rounded-lg p-3 flex items-center justify-between' }, [
        React.createElement('div', { key: 'l', className: 'flex items-center space-x-2' }, [
          React.createElement('i', { key: 'logo', 'data-lucide': 'radar', className: 'w-5 h-5 text-blue-600' }),
          React.createElement('span', { key: 'brand', className: 'font-semibold' }, '5GLabX'),
          React.createElement('span', { key: 'sep', className: 'text-gray-400' }, '•'),
          React.createElement('span', { key: 'title', className: 'text-gray-700' }, 'User Dashboard')
        ]),
        React.createElement('div', { key: 'r', className: 'flex items-center space-x-3' }, [
          React.createElement('i', { key: 'bell', 'data-lucide': 'bell', className: 'w-5 h-5 text-gray-500' }),
          React.createElement('div', { key: 'user', className: 'flex items-center space-x-2' }, [
            React.createElement('i', { key: 'avatar', 'data-lucide': 'user', className: 'w-5 h-5 text-gray-500' }),
            React.createElement('span', { key: 'email', className: 'text-sm text-gray-600' }, 'user@example.com')
          ])
        ])
      ])
    );

    const TabBar = () => (
      React.createElement('div', { className: 'bg-white border rounded-lg p-2 flex flex-wrap gap-2' },
        TABS.map(tab => (
          React.createElement('button', {
            key: tab.id,
            onClick: () => setSelectedTab(tab.id),
            className: `px-3 py-1.5 rounded-md text-sm flex items-center space-x-2 border transition-colors ${
              selectedTab === tab.id ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-700 hover:bg-gray-50'
            }`
          }, [
            React.createElement('i', { key: 'icon', 'data-lucide': tab.icon, className: 'w-4 h-4' }),
            React.createElement('span', { key: 'label' }, tab.label)
          ])
        ))
      )
    );

    const OverviewTab = () => (
      React.createElement('div', { className: 'space-y-4' }, [
        React.createElement('div', { key: 'welcome', className: 'bg-white border rounded-lg p-4' }, [
          React.createElement('h3', { key: 't', className: 'text-lg font-semibold' }, 'Welcome back, Demo User!'),
          React.createElement('p', { key: 'p', className: 'text-gray-600 mt-1' }, "Here's what's happening with your 5G simulations today.")
        ]),
        React.createElement('div', { key: 'stats', className: 'grid grid-cols-1 md:grid-cols-4 gap-4' }, [
          React.createElement(StatCard, { key: 's1', title: 'Active Simulations', value: '3', color: 'text-blue-600', icon: 'activity' }),
          React.createElement(StatCard, { key: 's2', title: 'Completed Today', value: '12', color: 'text-emerald-600', icon: 'check-circle-2' }),
          React.createElement(StatCard, { key: 's3', title: 'Success Rate', value: '94.2%', color: 'text-indigo-600', icon: 'trending-up' }),
          React.createElement(StatCard, { key: 's4', title: 'Avg. Duration', value: '2.3m', color: 'text-orange-600', icon: 'clock' })
        ]),
        React.createElement('div', { key: 'feed', className: 'bg-white border rounded-lg p-4' }, [
          React.createElement('h3', { key: 't', className: 'text-lg font-semibold mb-2' }, 'Recent Activity'),
          React.createElement('ul', { key: 'ul', className: 'space-y-2 text-sm' }, [
            React.createElement('li', { key: 'a1', className: 'flex items-center space-x-2' }, [React.createElement('span', { key: 'dot', className: 'w-2 h-2 bg-green-500 rounded-full' }), React.createElement('span', { key: 'txt' }, '5G NR Random Access simulation completed successfully (2 min ago)')]),
            React.createElement('li', { key: 'a2', className: 'flex items-center space-x-2' }, [React.createElement('span', { key: 'dot', className: 'w-2 h-2 bg-blue-500 rounded-full' }), React.createElement('span', { key: 'txt' }, 'LTE Attach Procedure simulation started (5 min ago)')]),
            React.createElement('li', { key: 'a3', className: 'flex items-center space-x-2' }, [React.createElement('span', { key: 'dot', className: 'w-2 h-2 bg-yellow-500 rounded-full' }), React.createElement('span', { key: 'txt' }, 'IMS SIP Registration simulation in progress (8 min ago)')])
          ])
        ])
      ])
    );

    const SimulationsTab = () => (
      React.createElement('div', { className: 'space-y-4' }, [
        React.createElement('div', { key: 'header', className: 'flex items-center justify-between' }, [
          React.createElement('h3', { key: 't', className: 'text-lg font-semibold' }, 'Simulations'),
          React.createElement('button', { key: 'btn', className: 'btn-primary' }, '+ New Simulation')
        ]),
        React.createElement('div', { key: 'filters', className: 'bg-white border rounded-lg p-3 flex items-center justify-between' }, [
          React.createElement('div', { key: 'search', className: 'flex items-center space-x-2' }, [
            React.createElement('i', { key: 'i', 'data-lucide': 'search', className: 'w-4 h-4 text-gray-500' }),
            React.createElement('input', { key: 'inp', placeholder: 'Search simulations...', className: 'form-input w-64' })
          ]),
          React.createElement('button', { key: 'filter', className: 'btn-secondary' }, 'Filter')
        ]),
        React.createElement('div', { key: 'grid', className: 'grid grid-cols-1 md:grid-cols-3 gap-4' }, [
          ['5G NR Random Access', 'Running', '65%', '2m30s', '5G NR'],
          ['LTE Attach Procedure', 'Completed', '100%', '1m45s', '4G LTE'],
          ['IMS SIP Registration', 'Pending', '0%', '0s', 'IMS']
        ].map((card, idx) => (
          React.createElement('div', { key: idx, className: 'bg-white border rounded-lg p-4 space-y-2' }, [
            React.createElement('div', { key: 't', className: 'font-semibold' }, card[0]),
            React.createElement('div', { key: 's', className: 'text-sm text-gray-600' }, `Status: ${card[1]}`),
            React.createElement('div', { key: 'p', className: 'text-sm text-gray-600' }, `Progress: ${card[2]}`),
            React.createElement('div', { key: 'd', className: 'text-sm text-gray-600' }, `Duration: ${card[3]}`),
            React.createElement('div', { key: 'c', className: 'text-sm text-gray-600' }, `Category: ${card[4]}`),
            React.createElement('div', { key: 'actions', className: 'flex items-center space-x-2' }, [
              React.createElement('button', { key: 'view', className: 'px-2 py-1 text-sm rounded border' }, 'View'),
              React.createElement('button', { key: 'dl', className: 'px-2 py-1 text-sm rounded border' }, 'Export')
            ])
          ])
        )))
      ])
    );

    const LiveKPICards = () => (
      React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-6 gap-3' }, [
        ['Msgs/s', '45'], ['Success', '98.5%'], ['Error', '1.5%'], ['Throughput', '2.3 Mbps'], ['Latency', '12ms'], ['Total', '1,247']
      ].map(([t, v], i) => React.createElement('div', { key: i, className: 'bg-white border rounded p-3 text-center' }, [
        React.createElement('div', { key: 't', className: 'text-xs text-gray-500' }, t),
        React.createElement('div', { key: 'v', className: 'text-lg font-semibold' }, v)
      ])))
    );

    const ProtocolAnalyzerTab = () => (
      React.createElement('div', { className: 'space-y-4' }, [
        React.createElement('div', { key: 'hdr', className: 'bg-white border rounded-lg p-4 flex items-center justify-between' }, [
          React.createElement('div', { key: 'l' }, [
            React.createElement('h3', { key: 't', className: 'text-lg font-semibold' }, '5GLabX Protocol Analyzer Dashboard'),
            React.createElement('p', { key: 'sub', className: 'text-sm text-gray-600' }, 'Real-time 4G & 5G protocol analysis and monitoring')
          ]),
          React.createElement('span', { key: 'st', className: 'text-xs px-2 py-1 rounded-full bg-green-100 text-green-700' }, 'Analyzer Online')
        ]),
        React.createElement('div', { key: 'controls', className: 'bg-white border rounded-lg p-3 flex items-center space-x-2' }, [
          ['square', 'Step'], ['skip-back', 'Back'], ['play', 'Play/Pause'], ['skip-forward', 'Forward']
        ].map(([ic, label], i) => React.createElement('button', { key: i, className: 'px-2 py-1 rounded border flex items-center space-x-2' }, [React.createElement('i', { key: 'i', 'data-lucide': ic, className: 'w-4 h-4' }), React.createElement('span', { key: 'l' }, label)]))),
        React.createElement(LiveKPICards, { key: 'kpi' }),
        React.createElement('div', { key: 'split', className: 'grid grid-cols-1 lg:grid-cols-2 gap-4' }, [
          React.createElement('div', { key: 'left', className: 'bg-white border rounded-lg p-3' }, [
            React.createElement('div', { key: 'f', className: 'flex items-center space-x-2 mb-2' }, [
              React.createElement('i', { key: 'fi', 'data-lucide': 'filter', className: 'w-4 h-4 text-gray-500' }),
              React.createElement('input', { key: 'inp', placeholder: 'Filter by layer...', className: 'form-input w-64' })
            ]),
            React.createElement('ul', { key: 'layers', className: 'space-y-1 text-sm' }, [
              'PHY Layer (12 messages)', 'MAC Layer (8 messages)', 'RLC Layer (15 messages)', 'PDCP Layer (6 messages)', 'RRC Layer (23 messages)', 'NAS Layer (18 messages)', 'IMS Layer (5 messages)'
            ].map((txt, i) => React.createElement('li', { key: i, className: 'flex items-center justify-between px-2 py-1 rounded hover:bg-gray-50' }, [
              React.createElement('span', { key: 'l' }, txt),
              React.createElement('i', { key: 'c', 'data-lucide': 'chevron-right', className: 'w-4 h-4 text-gray-400' })
            ])))
          ]),
          React.createElement('div', { key: 'right', className: 'bg-white border rounded-lg p-3 space-y-2' }, [
            React.createElement('div', { key: 'h', className: 'font-semibold' }, 'Selected Message Details'),
            React.createElement('div', { key: 'd', className: 'text-sm text-gray-700' }, 'Message: RRC Setup Request | Timestamp: 00:02:35.123 | Protocol: 5G-NR | Layer: RRC | Direction: UL'),
            React.createElement('div', { key: 'box', className: 'border rounded p-2 text-xs bg-gray-50' }, 'Information Elements: ue_identity, establishment_cause, ng_ksi, rrc_transaction_id, security_config')
          ])
        ]),
        React.createElement('div', { key: 'charts', className: 'grid grid-cols-1 md:grid-cols-3 gap-4' }, [
          'Throughput', 'Protocol Distribution', 'Validation Status'
        ].map((t, i) => React.createElement('div', { key: i, className: 'chart-container h-48 flex items-center justify-center text-sm text-gray-500' }, `${t} Chart`)))
      ])
    );

    const PlatformTab = () => (
      React.createElement('div', { className: 'space-y-4' }, [
        React.createElement('div', { key: 'hdr', className: 'bg-white border rounded-lg p-4 flex items-center justify-between' }, [
          React.createElement('h3', { key: 't', className: 'text-lg font-semibold' }, '5GLabX Platform'),
          React.createElement('span', { key: 'st', className: 'text-xs px-2 py-1 rounded-full bg-green-100 text-green-700' }, 'Platform Online')
        ]),
        React.createElement('div', { key: 'frame', className: 'bg-white border rounded-lg p-4' }, [
          React.createElement('div', { key: 'title', className: 'font-semibold mb-2' }, 'Professional Platform Interface'),
          React.createElement('div', { key: 'box', className: 'border rounded p-4 text-sm text-gray-600' }, 'Subscribed5glabx placeholder (embed iframe or component here)')
        ])
      ])
    );

    const AdvancedAnalyzerTab = () => (
      React.createElement('div', { className: 'space-y-4' }, [
        React.createElement('div', { key: 'hdr', className: 'bg-white border rounded-lg p-4 flex items-center justify-between' }, [
          React.createElement('h3', { key: 't', className: 'text-lg font-semibold' }, 'Advanced Protocol Analyzer'),
          React.createElement('span', { key: 'st', className: 'text-xs px-2 py-1 rounded-full bg-green-100 text-green-700' }, 'Professional Analyzer Online')
        ]),
        React.createElement('div', { key: 'panes', className: 'grid grid-cols-1 lg:grid-cols-2 gap-4' }, [
          React.createElement('div', { key: 'tree', className: 'bg-white border rounded-lg p-3' }, [
            React.createElement('div', { key: 't', className: 'font-semibold mb-2' }, 'Message Tree View'),
            React.createElement('ul', { key: 'ul', className: 'text-sm space-y-1' }, [
              'Test Case: 5G NR Initial Access - 1',
              'PHY Layer Messages', 'MAC Layer Messages', 'RRC Layer Messages', 'NAS Layer Messages'
            ].map((txt, i) => React.createElement('li', { key: i, className: 'px-2 py-1 rounded hover:bg-gray-50' }, txt)))
          ]),
          React.createElement('div', { key: 'hex', className: 'bg-white border rounded-lg p-3 space-y-2' }, [
            React.createElement('div', { key: 't', className: 'font-semibold' }, 'Hex Dump View'),
            React.createElement('div', { key: 'meta', className: 'text-xs text-gray-600' }, 'Selected Message: RRC Setup Request | Timestamp: 00:00:03.000 | Protocol: 5G-NR | Layer: RRC | Direction: UL'),
            React.createElement('pre', { key: 'hex', className: 'text-xs bg-gray-50 border rounded p-2 overflow-auto' }, '0000: 01 23 45 67 89 AB CD EF ...\n0010: 01 23 45 67 89 AB CD EF ...')
          ])
        ]),
        React.createElement('div', { key: 'filters', className: 'bg-white border rounded-lg p-3 flex flex-wrap gap-2 items-center' }, [
          React.createElement('input', { key: 's', placeholder: 'Search messages...', className: 'form-input' }),
          React.createElement('select', { key: 'l', className: 'form-input' }, ['Layer', 'PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS', 'IMS'].map((o, i) => React.createElement('option', { key: i }, o))),
          React.createElement('select', { key: 'p', className: 'form-input' }, ['Protocol', '5G-NR', 'LTE', 'IMS'].map((o, i) => React.createElement('option', { key: i }, o))),
          React.createElement('button', { key: 'exp', className: 'btn-secondary' }, 'Export'),
          React.createElement('button', { key: 'cfg', className: 'btn-secondary' }, 'Settings')
        ])
      ])
    );

    const TestSuitesTab = () => (
      React.createElement('div', { className: 'space-y-4' }, [
        React.createElement('div', { key: 'hdr', className: 'bg-white border rounded-lg p-4 flex items-center justify-between' }, [
          React.createElement('h3', { key: 't', className: 'text-lg font-semibold' }, 'Professional Test Suite Library'),
          React.createElement('span', { key: 'cases', className: 'text-xs px-2 py-1 rounded-full bg-green-100 text-green-700' }, '1000+ Test Cases Available')
        ]),
        React.createElement('div', { key: 'grid', className: 'grid grid-cols-1 lg:grid-cols-2 gap-4' }, [
          React.createElement('div', { key: 'tree', className: 'bg-white border rounded-lg p-3' }, [
            React.createElement('div', { key: 't', className: 'font-semibold mb-2' }, 'Test Case Categories'),
            React.createElement('ul', { key: 'ul', className: 'text-sm space-y-1' }, [
              '5G NR Procedures (250)', 'VoLTE/VoNR/IMS (100)', 'LTE Procedures (200)', '3GPP Compliance (500)'
            ].map((txt, i) => React.createElement('li', { key: i, className: 'px-2 py-1 rounded hover:bg-gray-50' }, txt)))
          ]),
          React.createElement('div', { key: 'exec', className: 'bg-white border rounded-lg p-3 space-y-3' }, [
            React.createElement('div', { key: 't', className: 'font-semibold' }, 'Test Execution Controls'),
            React.createElement('div', { key: 'btns', className: 'flex flex-wrap gap-2' }, [
              React.createElement('button', { key: 'i', className: 'btn-primary', onClick: async () => {
                try {
                  const testCaseId = 'tc-5g-nr-initial-access-1';
                  const apiBaseUrl = window.CONSTANTS?.API_BASE_URL || '/api';
                  await fetch(`${apiBaseUrl}/test/playback/start`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ testCaseId, speed: 1.0, apiBaseUrl })
                  });
                  alert('Test playback started');
                } catch (e) {
                  console.error('Start playback failed', e);
                  alert('Failed to start playback');
                }
              } }, 'Run Individual Test'),
              React.createElement('button', { key: 'stop', className: 'btn-secondary', onClick: async () => {
                try {
                  const apiBaseUrl = window.CONSTANTS?.API_BASE_URL || '/api';
                  await fetch(`${apiBaseUrl}/test/playback/stop`, { method: 'POST' });
                  alert('Test playback stopped');
                } catch (e) {
                  console.error('Stop playback failed', e);
                  alert('Failed to stop playback');
                }
              } }, 'Stop Test'),
              React.createElement('button', { key: 'g', className: 'btn-primary' }, 'Run Test Group'),
              React.createElement('button', { key: 'f', className: 'btn-primary' }, 'Run Full Suite'),
              React.createElement('button', { key: 'sch', className: 'btn-secondary' }, 'Schedule Tests'),
              React.createElement('button', { key: 'cfg', className: 'btn-secondary' }, 'Configure'),
              React.createElement('button', { key: 'res', className: 'btn-secondary' }, 'View Results')
            ])
          ])
        ])
      ])
    );

    const ProfessionalTestingTab = () => {
      // Check if the real-time testing platform component is available
      if (window.RealTimeTestingPlatform) {
        return React.createElement(window.RealTimeTestingPlatform, {
          appState: appState,
          onStateChange: onStateChange
        });
      } else if (window.AdvancedTestingPlatform) {
        return React.createElement(window.AdvancedTestingPlatform, {
          appState: appState,
          onStateChange: onStateChange
        });
      } else {
        return React.createElement('div', { className: 'space-y-4' }, [
          React.createElement('div', { key: 'hdr', className: 'bg-white border rounded-lg p-4 flex items-center justify-between' }, [
            React.createElement('h3', { key: 't', className: 'text-lg font-semibold' }, 'Professional Testing Platform'),
            React.createElement('span', { key: 'st', className: 'text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700' }, 'QXDM/Keysight-like Interface')
          ]),
          React.createElement('div', { key: 'content', className: 'bg-white border rounded-lg p-6' }, [
            React.createElement('div', { key: 'info', className: 'text-center py-8' }, [
              React.createElement('i', { key: 'icon', 'data-lucide': 'test-tube', className: 'w-16 h-16 text-blue-600 mx-auto mb-4' }),
              React.createElement('h4', { key: 'title', className: 'text-lg font-semibold text-gray-900 mb-2' }, 'Professional Testing Platform'),
              React.createElement('p', { key: 'desc', className: 'text-gray-600 mb-4' }, 'Advanced testing interface with multi-column dashboard, real-time execution monitoring, and comprehensive test case management.'),
              React.createElement('div', { key: 'features', className: 'grid grid-cols-1 md:grid-cols-3 gap-4 mt-6' }, [
                React.createElement('div', { key: 'f1', className: 'text-center p-4' }, [
                  React.createElement('i', { key: 'i1', 'data-lucide': 'layers', className: 'w-8 h-8 text-green-600 mx-auto mb-2' }),
                  React.createElement('h5', { key: 't1', className: 'font-medium' }, 'Multi-Column Layout'),
                  React.createElement('p', { key: 'd1', className: 'text-sm text-gray-600' }, 'Professional dashboard with sidebar navigation and main content area')
                ]),
                React.createElement('div', { key: 'f2', className: 'text-center p-4' }, [
                  React.createElement('i', { key: 'i2', 'data-lucide': 'activity', className: 'w-8 h-8 text-blue-600 mx-auto mb-2' }),
                  React.createElement('h5', { key: 't2', className: 'font-medium' }, 'Real-time Execution'),
                  React.createElement('p', { key: 'd2', className: 'text-sm text-gray-600' }, 'Live test execution monitoring with progress tracking')
                ]),
                React.createElement('div', { key: 'f3', className: 'text-center p-4' }, [
                  React.createElement('i', { key: 'i3', 'data-lucide': 'bar-chart-3', className: 'w-8 h-8 text-purple-600 mx-auto mb-2' }),
                  React.createElement('h5', { key: 't3', className: 'font-medium' }, 'Advanced Analytics'),
                  React.createElement('p', { key: 'd3', className: 'text-sm text-gray-600' }, 'Comprehensive test results and performance metrics')
                ])
              ])
            ])
          ])
        ]);
      }
    };

    const SettingsTab = () => (
      React.createElement('div', { className: 'bg-white border rounded-lg p-4 space-y-4' }, [
        React.createElement('div', { key: 't', className: 'text-lg font-semibold' }, 'Preferences'),
        React.createElement('label', { key: 'rt', className: 'flex items-center space-x-2 text-sm' }, [
          React.createElement('input', { key: 'c', type: 'checkbox', className: 'form-checkbox' }),
          React.createElement('span', { key: 'l' }, 'Enable real-time updates')
        ]),
        React.createElement('label', { key: 'dm', className: 'flex items-center space-x-2 text-sm' }, [
          React.createElement('input', { key: 'c', type: 'checkbox', className: 'form-checkbox' }),
          React.createElement('span', { key: 'l' }, 'Dark mode')
        ])
      ])
    );

    const renderTab = () => {
      switch (selectedTab) {
        case 'overview': return React.createElement(OverviewTab);
        case 'simulations': return React.createElement(SimulationsTab);
        case 'protocol-analyzer': return React.createElement(ProtocolAnalyzerTab);
        case 'platform': return React.createElement(PlatformTab);
        case 'advanced-analyzer': return React.createElement(AdvancedAnalyzerTab);
        case 'test-suites': return React.createElement(TestSuitesTab);
        case 'professional-testing': return React.createElement(ProfessionalTestingTab);
        case 'analytics': return React.createElement('div', { className: 'bg-white border rounded-lg p-4' }, 'Analytics coming soon');
        case 'settings': return React.createElement(SettingsTab);
        default: return React.createElement(OverviewTab);
      }
    };

    return React.createElement('div', { className: 'p-6 space-y-4', 'data-name': 'user-dashboard-view', 'data-file': 'components/views/UserDashboardView.js' }, [
      React.createElement(HeaderBar, { key: 'hdr' }),
      React.createElement(TabBar, { key: 'tabs' }),
      React.createElement('div', { key: 'content' }, renderTab())
    ]);

  } catch (error) {
    console.error('UserDashboardView error:', error);
    return React.createElement('div', { className: 'text-red-600 p-4' }, 'User Dashboard failed to load');
  }
}

window.UserDashboardView = UserDashboardView;
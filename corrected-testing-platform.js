// Professional Testing Platform - QXDM/Keysight-like Interface (Corrected to match image)
function ProfessionalTestingPlatform({ appState, onStateChange }) {
  try {
    React.useEffect(() => {
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }, []);

    const [selectedComponent, setSelectedComponent] = React.useState('enodeb');
    const [selectedTestSuite, setSelectedTestSuite] = React.useState(null);
    const [selectedTests, setSelectedTests] = React.useState([]);
    const [isRunning, setIsRunning] = React.useState(false);
    const [scrollPosition, setScrollPosition] = React.useState(0);
    
    // TODO: Integrate with existing Supabase implementation
    // Load test cases and counts from Supabase database
    // The implementation is already available, just need to connect here
    React.useEffect(() => {
      // Load test cases from Supabase
      // loadTestCasesFromSupabase();
      // loadTestSuiteCountsFromSupabase();
    }, []);
    const [logs, setLogs] = React.useState([
      { timestamp: '2024-01-18 00:40:15', level: 'INFO', message: 'Initializing RAN-Core Test Manager' },
      { timestamp: '2024-01-18 00:40:16', level: 'INFO', message: 'loading component configurations' },
      { timestamp: '2024-01-18 00:40:17', level: 'INFO', message: 'Preparing test environment' },
      { timestamp: '2024-01-18 00:40:18', level: 'INFO', message: 'Test environment ready' },
      { timestamp: '2024-01-18 00:40:19', level: 'INFO', message: 'Monitoring system status' },
      { timestamp: '2024-01-18 00:40:20', level: 'INFO', message: 'All components online' }
    ]);
    const [testCases, setTestCases] = React.useState([
      {
        id: 'tc-001',
        name: 'Attach',
        component: 'eNodeB',
        status: 'Not Started',
        iterations: 'Never',
        successRate: 'N/A',
        lastRun: 'N/A',
        duration: '',
        priority: 'High',
        selected: false
      },
      {
        id: 'tc-002',
        name: 'Detach',
        component: 'eNodeB',
        status: 'Completed',
        iterations: '5',
        successRate: '100%',
        lastRun: '2024-01-18 00:35:22',
        duration: '2.3s',
        priority: 'Medium',
        selected: false
      },
      {
        id: 'tc-003',
        name: 'Handover',
        component: 'gNodeB',
        status: 'Running',
        iterations: '3',
        successRate: '66%',
        lastRun: '2024-01-18 00:38:15',
        duration: '1.8s',
        priority: 'High',
        selected: false
      },
      {
        id: 'tc-004',
        name: 'Paging',
        component: 'Core Network',
        status: 'Failed',
        iterations: '2',
        successRate: '0%',
        lastRun: '2024-01-18 00:32:45',
        duration: '5.1s',
        priority: 'Low',
        selected: false
      },
      {
        id: 'tc-005',
        name: 'Bearer Setup',
        component: 'eNodeB',
        status: 'Not Started',
        iterations: 'Never',
        successRate: 'N/A',
        lastRun: 'N/A',
        duration: '',
        priority: 'Medium',
        selected: false
      },
      {
        id: 'tc-006',
        name: 'Mobility Management',
        component: 'gNodeB',
        status: 'Paused',
        iterations: '1',
        successRate: 'N/A',
        lastRun: '2024-01-18 00:25:30',
        duration: '3.2s',
        priority: 'High',
        selected: false
      },
      {
        id: 'tc-007',
        name: 'Authentication',
        component: 'Core Network',
        status: 'Completed',
        iterations: '8',
        successRate: '87%',
        lastRun: '2024-01-18 00:30:15',
        duration: '1.2s',
        priority: 'High',
        selected: false
      },
      {
        id: 'tc-008',
        name: 'Session Management',
        component: 'gNodeB',
        status: 'Not Started',
        iterations: 'Never',
        successRate: 'N/A',
        lastRun: 'N/A',
        duration: '',
        priority: 'Medium',
        selected: false
      },
      {
        id: 'tc-009',
        name: 'Quality of Service',
        component: 'eNodeB',
        status: 'Running',
        iterations: '4',
        successRate: '75%',
        lastRun: '2024-01-18 00:28:45',
        duration: '4.5s',
        priority: 'High',
        selected: false
      },
      {
        id: 'tc-010',
        name: 'Load Balancing',
        component: 'Core Network',
        status: 'Failed',
        iterations: '1',
        successRate: '0%',
        lastRun: '2024-01-18 00:20:30',
        duration: '6.8s',
        priority: 'Low',
        selected: false
      },
      {
        id: 'tc-011',
        name: 'Power Control',
        component: 'gNodeB',
        status: 'Completed',
        iterations: '6',
        successRate: '83%',
        lastRun: '2024-01-18 00:15:20',
        duration: '2.1s',
        priority: 'Medium',
        selected: false
      },
      {
        id: 'tc-012',
        name: 'Interference Management',
        component: 'eNodeB',
        status: 'Not Started',
        iterations: 'Never',
        successRate: 'N/A',
        lastRun: 'N/A',
        duration: '',
        priority: 'High',
        selected: false
      },
      {
        id: 'tc-013',
        name: 'Resource Allocation',
        component: 'gNodeB',
        status: 'Paused',
        iterations: '2',
        successRate: '50%',
        lastRun: '2024-01-18 00:10:15',
        duration: '3.7s',
        priority: 'High',
        selected: false
      },
      {
        id: 'tc-014',
        name: 'Network Slicing',
        component: 'Core Network',
        status: 'Running',
        iterations: '3',
        successRate: '67%',
        lastRun: '2024-01-18 00:05:45',
        duration: '5.2s',
        priority: 'Medium',
        selected: false
      },
      {
        id: 'tc-015',
        name: 'Beam Management',
        component: 'gNodeB',
        status: 'Completed',
        iterations: '7',
        successRate: '86%',
        lastRun: '2024-01-18 00:00:30',
        duration: '1.9s',
        priority: 'High',
        selected: false
      }
    ]);

    // RAN Components
    const ranComponents = [
      { id: 'enodeb', name: 'eNodeB', status: 'active', color: 'green' },
      { id: 'gnodeb', name: 'gNodeB', status: 'active', color: 'green' },
      { id: 'core', name: 'Core Network', status: 'active', color: 'green' }
    ];

    // Test Suites Categories - Updated to match specified layout
    const testSuites = [
      {
        id: '5g-nr',
        name: '5G NR',
        totalCount: 450,
        expanded: true,
        children: [
          { id: '5g-functional', name: 'Functional', count: 200 },
          { id: '5g-performance', name: 'Performance', count: 150 },
          { id: '5g-mobility', name: 'Mobility', count: 75 },
          { id: '5g-rf', name: 'RF', count: 25 }
        ]
      },
      {
        id: '4g-lte',
        name: '4G LTE',
        totalCount: 600,
        expanded: true,
        children: [
          { id: '4g-functional', name: 'Functional', count: 300 },
          { id: '4g-performance', name: 'Performance', count: 200 },
          { id: '4g-mobility', name: 'Mobility', count: 80 },
          { id: '4g-rf', name: 'RF', count: 20 }
        ]
      },
      {
        id: 'core-network',
        name: 'Core Network',
        totalCount: 300,
        expanded: true,
        children: [
          { id: 'core-network-tests', name: 'Core Network', count: 300 }
        ]
      },
      {
        id: 'call-flows',
        name: 'Call Flows',
        totalCount: 350,
        expanded: true,
        children: [
          { id: 'call-flows-tests', name: 'Call Flows', count: 350 }
        ]
      },
      {
        id: 'other',
        name: 'Other',
        totalCount: 100,
        expanded: true,
        children: [
          { id: 'other-tests', name: 'Other', count: 100 }
        ]
      }
    ];

    const addLog = (level, message) => {
      const timestamp = new Date().toLocaleString();
      setLogs(prev => [...prev, { timestamp, level, message }]);
    };

    const handleRunTest = (testId) => {
      setIsRunning(true);
      addLog('INFO', `Starting test execution: ${testId}`);
      
      // Simulate test execution
      setTimeout(() => {
        setIsRunning(false);
        addLog('INFO', `Test execution completed: ${testId}`);
        setTestCases(prev => prev.map(tc => 
          tc.id === testId ? { ...tc, status: 'Completed', lastRun: new Date().toLocaleString() } : tc
        ));
      }, 3000);
    };

    const handleRunAllTests = () => {
      setIsRunning(true);
      addLog('INFO', 'Starting batch test execution');
      
      setTimeout(() => {
        setIsRunning(false);
        addLog('INFO', 'Batch test execution completed');
      }, 5000);
    };

    const handleRunSelectedTests = () => {
      const selectedTests = testCases.filter(tc => tc.selected);
      if (selectedTests.length === 0) {
        addLog('WARN', 'No tests selected for execution');
        return;
      }
      
      setIsRunning(true);
      addLog('INFO', `Starting execution of ${selectedTests.length} selected tests`);
      
      // Update selected tests to running status
      setTestCases(prev => prev.map(tc => 
        tc.selected ? { ...tc, status: 'Running' } : tc
      ));
      
      setTimeout(() => {
        setIsRunning(false);
        addLog('INFO', `Completed execution of ${selectedTests.length} selected tests`);
        setTestCases(prev => prev.map(tc => 
          tc.selected ? { ...tc, status: 'Completed', lastRun: new Date().toLocaleString() } : tc
        ));
      }, 3000);
    };

    const handleSelectAll = () => {
      const allSelected = testCases.every(tc => tc.selected);
      setTestCases(prev => prev.map(tc => ({ ...tc, selected: !allSelected })));
    };

    const handleDeleteSelected = () => {
      const selectedTests = testCases.filter(tc => tc.selected);
      if (selectedTests.length === 0) {
        addLog('WARN', 'No tests selected for deletion');
        return;
      }
      
      setTestCases(prev => prev.filter(tc => !tc.selected));
      addLog('INFO', `Deleted ${selectedTests.length} selected tests`);
    };

    const handleScroll = (e) => {
      const scrollTop = e.target.scrollTop;
      const scrollHeight = e.target.scrollHeight;
      const clientHeight = e.target.clientHeight;
      const scrollPercent = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);
      setScrollPosition(scrollPercent);
    };

    const toggleTestSelection = (testId) => {
      setTestCases(prev => prev.map(tc => 
        tc.id === testId ? { ...tc, selected: !tc.selected } : tc
      ));
    };

    const getStatusColor = (status) => {
      switch (status) {
        case 'Completed': return 'bg-green-100 text-green-800';
        case 'Running': return 'bg-blue-100 text-blue-800';
        case 'Failed': return 'bg-red-100 text-red-800';
        case 'Not Started': return 'bg-gray-100 text-gray-800';
        case 'Paused': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const getPriorityColor = (priority) => {
      switch (priority) {
        case 'High': return 'bg-red-100 text-red-800';
        case 'Medium': return 'bg-yellow-100 text-yellow-800';
        case 'Low': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const handleStartTest = (testId) => {
      setTestCases(prev => prev.map(tc => 
        tc.id === testId ? { ...tc, status: 'Running' } : tc
      ));
      addLog('INFO', `Starting test: ${testId}`);
    };

    const handleStopTest = (testId) => {
      setTestCases(prev => prev.map(tc => 
        tc.id === testId ? { ...tc, status: 'Failed' } : tc
      ));
      addLog('INFO', `Stopped test: ${testId}`);
    };

    const handlePauseTest = (testId) => {
      setTestCases(prev => prev.map(tc => 
        tc.id === testId ? { ...tc, status: 'Paused' } : tc
      ));
      addLog('INFO', `Paused test: ${testId}`);
    };

    const getLogLevelColor = (level) => {
      switch (level) {
        case 'ERROR': return 'bg-red-500 text-white';
        case 'WARN': return 'bg-yellow-500 text-white';
        case 'INFO': return 'bg-blue-500 text-white';
        case 'DEBUG': return 'bg-gray-500 text-white';
        default: return 'bg-gray-500 text-white';
      }
    };

    return React.createElement('div', {
      className: 'h-screen flex bg-gray-100', // Changed to light gray background
      'data-name': 'professional-testing-platform'
    }, [
      // Left Sidebar
      React.createElement('div', {
        key: 'sidebar',
        className: 'w-80 bg-gray-800 text-white flex flex-col'
      }, [
        // Header
        React.createElement('div', {
          key: 'header',
          className: 'bg-blue-600 p-4'
        }, [
          React.createElement('h1', {
            key: 'title',
            className: 'text-lg font-bold text-white'
          }, 'RAN-Core Automation Test Manager')
        ]),

        // RAN Components Section
        React.createElement('div', {
          key: 'components',
          className: 'p-4 border-b border-gray-700'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-semibold text-gray-300 mb-3'
          }, 'RAN Components'),
          React.createElement('div', {
            key: 'list',
            className: 'space-y-2'
          }, ranComponents.map(component => 
            React.createElement('div', {
              key: component.id,
              className: 'flex items-center justify-between p-2 hover:bg-gray-700 rounded'
            }, [
              React.createElement('span', {
                key: 'name',
                className: 'text-sm'
              }, component.name),
              React.createElement('div', {
                key: 'controls',
                className: 'flex items-center space-x-1'
              }, [
                React.createElement('button', {
                  key: 'play',
                  className: 'w-6 h-6 bg-green-600 rounded flex items-center justify-center hover:bg-green-700',
                  title: 'Start'
                }, React.createElement('i', { 'data-lucide': 'play', className: 'w-3 h-3' })),
                React.createElement('button', {
                  key: 'stop',
                  className: 'w-6 h-6 bg-red-600 rounded flex items-center justify-center hover:bg-red-700',
                  title: 'Stop'
                }, React.createElement('i', { 'data-lucide': 'square', className: 'w-3 h-3' })),
                React.createElement('button', {
                  key: 'settings',
                  className: 'w-6 h-6 bg-gray-600 rounded flex items-center justify-center hover:bg-gray-700',
                  title: 'Settings'
                }, React.createElement('i', { 'data-lucide': 'settings', className: 'w-3 h-3' }))
              ])
            ])
          ))
        ]),

        // Test Suites Section
        React.createElement('div', {
          key: 'suites',
          className: 'p-4 flex-1'
        }, [
          React.createElement('div', {
            key: 'header',
            className: 'flex items-center justify-between mb-3'
          }, [
            React.createElement('h3', {
              key: 'title',
              className: 'text-sm font-semibold text-gray-300'
            }, 'Test Suites'),
            React.createElement('button', {
              key: 'add',
              className: 'bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700'
            }, '+ Add Test Suite')
          ]),
          React.createElement('div', {
            key: 'list',
            className: 'space-y-1'
          }, testSuites.map(suite => 
            React.createElement('div', {
              key: suite.id,
              className: 'space-y-1'
            }, [
              React.createElement('div', {
                key: 'header',
                className: 'flex items-center justify-between p-2 hover:bg-gray-700 rounded cursor-pointer',
                onClick: () => setSelectedTestSuite(suite.id)
              }, [
                React.createElement('div', {
                  key: 'left',
                  className: 'flex items-center space-x-2'
                }, [
                  React.createElement('i', {
                    key: 'icon',
                    'data-lucide': suite.expanded ? 'chevron-down' : 'chevron-right',
                    className: 'w-4 h-4'
                  }),
                  React.createElement('span', {
                    key: 'name',
                    className: 'text-sm'
                  }, suite.name)
                ]),
                React.createElement('div', {
                  key: 'right',
                  className: 'flex items-center space-x-2'
                }, [
                  React.createElement('span', {
                    key: 'total-count',
                    className: 'bg-blue-600 text-white text-xs px-2 py-1 rounded-full'
                  }, `[${suite.totalCount}]`),
                  React.createElement('span', {
                    key: 'total-display',
                    className: 'text-xs text-gray-400'
                  }, `(${suite.totalCount})`)
                ])
              ]),
              suite.expanded && React.createElement('div', {
                key: 'children',
                className: 'ml-4 space-y-1'
              }, suite.children.map(child => 
                React.createElement('div', {
                  key: child.id,
                  className: 'flex items-center justify-between p-2 hover:bg-gray-700 rounded cursor-pointer',
                  onClick: () => setSelectedTestSuite(child.id)
                }, [
                  React.createElement('div', {
                    key: 'left',
                    className: 'flex items-center space-x-2'
                  }, [
                    React.createElement('span', {
                      key: 'tree',
                      className: 'text-gray-500 text-xs'
                    }, '├──'),
                    React.createElement('span', {
                      key: 'name',
                      className: 'text-sm text-gray-300'
                    }, child.name)
                  ]),
                  React.createElement('span', {
                    key: 'count',
                    className: 'bg-blue-600 text-white text-xs px-2 py-1 rounded-full'
                  }, `[${child.count}]`)
                ])
              ))
            ])
          ))
        ])
      ]),

      // Main Content Area - Fixed background color
      React.createElement('div', {
        key: 'main',
        className: 'flex-1 flex flex-col bg-gray-100' // Light gray background
      }, [
        // Test Cases Management Section - White panel on gray background
        React.createElement('div', {
          key: 'test-cases',
          className: 'bg-white border-b border-gray-200 p-4 m-4 rounded shadow-sm' // White panel with margin and shadow
        }, [
          React.createElement('div', {
            key: 'header',
            className: 'flex items-center justify-between mb-4'
          }, [
            React.createElement('h2', {
              key: 'title',
              className: 'text-lg font-semibold text-gray-900'
            }, 'Test Cases Management'),
            React.createElement('div', {
              key: 'actions',
              className: 'flex items-center space-x-2'
            }, [
              React.createElement('button', {
                key: 'add',
                className: 'bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700'
              }, '+ Add Test Case'),
              React.createElement('button', {
                key: 'run-selected',
                className: 'bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 flex items-center space-x-1',
                onClick: handleRunSelectedTests,
                disabled: isRunning
              }, [
                React.createElement('i', { key: 'icon', 'data-lucide': 'play', className: 'w-4 h-4' }),
                React.createElement('span', { key: 'text' }, 'Run Selected')
              ]),
              React.createElement('button', {
                key: 'run-all',
                className: 'bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 flex items-center space-x-1',
                onClick: handleRunAllTests,
                disabled: isRunning
              }, [
                React.createElement('i', { key: 'icon', 'data-lucide': 'play', className: 'w-4 h-4' }),
                React.createElement('span', { key: 'text' }, 'Run All Tests')
              ]),
              React.createElement('button', {
                key: 'delete',
                className: 'bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700',
                onClick: handleDeleteSelected
              }, 'Delete Selected')
            ])
          ]),

          // Scroll Indicator
          React.createElement('div', {
            key: 'scroll-info',
            className: 'text-xs text-gray-500 mb-2 text-center'
          }, [
            React.createElement('div', {
              key: 'count',
              className: 'mb-1'
            }, `Showing ${testCases.length} test cases - Scroll to view all`),
            React.createElement('div', {
              key: 'progress',
              className: 'w-full bg-gray-200 rounded-full h-1'
            }, React.createElement('div', {
              className: 'bg-blue-600 h-1 rounded-full transition-all duration-300',
              style: { width: `${scrollPosition}%` }
            }))
          ]),

          // Test Cases Table with Enhanced Scroll
          React.createElement('div', {
            key: 'table',
            className: 'overflow-x-auto max-h-80 overflow-y-auto border border-gray-200 rounded bg-white shadow-inner scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100',
            onScroll: handleScroll
          }, [
            React.createElement('table', {
              key: 'table',
              className: 'w-full border-collapse'
            }, [
              React.createElement('thead', {
                key: 'head'
              }, [
                React.createElement('tr', {
                  key: 'row',
                  className: 'bg-gray-50'
                }, [
                  React.createElement('th', { 
                    key: 'select', 
                    className: 'px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase sticky top-0 bg-gray-50' 
                  }, React.createElement('input', {
                    type: 'checkbox',
                    checked: testCases.length > 0 && testCases.every(tc => tc.selected),
                    onChange: handleSelectAll,
                    className: 'form-checkbox'
                  })),
                  React.createElement('th', { key: 'name', className: 'px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase sticky top-0 bg-gray-50' }, 'Name'),
                  React.createElement('th', { key: 'component', className: 'px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase sticky top-0 bg-gray-50' }, 'Component'),
                  React.createElement('th', { key: 'status', className: 'px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase sticky top-0 bg-gray-50' }, 'Status'),
                  React.createElement('th', { key: 'iterations', className: 'px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase sticky top-0 bg-gray-50' }, 'Iterations'),
                  React.createElement('th', { key: 'success', className: 'px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase sticky top-0 bg-gray-50' }, 'Success Rate'),
                  React.createElement('th', { key: 'last-run', className: 'px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase sticky top-0 bg-gray-50' }, 'Last Run'),
                  React.createElement('th', { key: 'duration', className: 'px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase sticky top-0 bg-gray-50' }, 'Duration'),
                  React.createElement('th', { key: 'priority', className: 'px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase sticky top-0 bg-gray-50' }, 'Priority'),
                  React.createElement('th', { key: 'controls', className: 'px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase sticky top-0 bg-gray-50' }, 'Controls'),
                  React.createElement('th', { key: 'actions', className: 'px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase sticky top-0 bg-gray-50' }, 'Actions')
                ])
              ]),
              React.createElement('tbody', {
                key: 'body',
                className: 'bg-white divide-y divide-gray-200'
              }, testCases.map(testCase => 
                React.createElement('tr', {
                  key: testCase.id,
                  className: `hover:bg-blue-50 transition-colors duration-150 ${testCase.selected ? 'bg-blue-100' : 'bg-white'}`
                }, [
                  React.createElement('td', {
                    key: 'select',
                    className: 'px-4 py-2'
                  }, React.createElement('input', {
                    type: 'checkbox',
                    checked: testCase.selected,
                    onChange: () => toggleTestSelection(testCase.id),
                    className: 'form-checkbox'
                  })),
                  React.createElement('td', {
                    key: 'name',
                    className: 'px-4 py-2 text-sm font-medium text-gray-900'
                  }, testCase.name),
                  React.createElement('td', {
                    key: 'component',
                    className: 'px-4 py-2 text-sm text-gray-500'
                  }, testCase.component),
                  React.createElement('td', {
                    key: 'status',
                    className: 'px-4 py-2'
                  }, React.createElement('span', {
                    className: `px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(testCase.status)}`
                  }, testCase.status)),
                  React.createElement('td', {
                    key: 'iterations',
                    className: 'px-4 py-2 text-sm text-gray-500'
                  }, testCase.iterations),
                  React.createElement('td', {
                    key: 'success',
                    className: 'px-4 py-2 text-sm text-gray-500'
                  }, testCase.successRate),
                  React.createElement('td', {
                    key: 'last-run',
                    className: 'px-4 py-2 text-sm text-gray-500'
                  }, testCase.lastRun),
                  React.createElement('td', {
                    key: 'duration',
                    className: 'px-4 py-2 text-sm text-gray-500'
                  }, testCase.duration),
                  React.createElement('td', {
                    key: 'priority',
                    className: 'px-4 py-2'
                  }, React.createElement('span', {
                    className: `px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(testCase.priority)}`
                  }, testCase.priority)),
                  React.createElement('td', {
                    key: 'controls',
                    className: 'px-4 py-2'
                  }, React.createElement('div', {
                    className: 'flex items-center space-x-1'
                  }, [
                    React.createElement('button', {
                      key: 'start',
                      className: 'bg-green-600 text-white p-1 rounded hover:bg-green-700',
                      onClick: () => handleStartTest(testCase.id),
                      disabled: testCase.status === 'Running'
                    }, React.createElement('i', { 'data-lucide': 'play', className: 'w-3 h-3' })),
                    React.createElement('button', {
                      key: 'stop',
                      className: 'bg-red-600 text-white p-1 rounded hover:bg-red-700',
                      onClick: () => handleStopTest(testCase.id),
                      disabled: testCase.status === 'Not Started'
                    }, React.createElement('i', { 'data-lucide': 'square', className: 'w-3 h-3' })),
                    React.createElement('button', {
                      key: 'pause',
                      className: 'bg-yellow-600 text-white p-1 rounded hover:bg-yellow-700',
                      onClick: () => handlePauseTest(testCase.id),
                      disabled: testCase.status !== 'Running'
                    }, React.createElement('i', { 'data-lucide': 'pause', className: 'w-3 h-3' }))
                  ])),
                  React.createElement('td', {
                    key: 'actions',
                    className: 'px-4 py-2'
                  }, React.createElement('div', {
                    className: 'flex items-center space-x-2'
                  }, [
                    React.createElement('button', {
                      key: 'run',
                      className: 'bg-blue-600 text-white p-1 rounded hover:bg-blue-700',
                      onClick: () => handleRunTest(testCase.id),
                      disabled: isRunning
                    }, React.createElement('i', { 'data-lucide': 'play', className: 'w-4 h-4' })),
                    React.createElement('button', {
                      key: 'view',
                      className: 'bg-gray-600 text-white p-1 rounded hover:bg-gray-700'
                    }, React.createElement('i', { 'data-lucide': 'eye', className: 'w-4 h-4' }))
                  ]))
                ])
              ))
            ])
          ])
        ]),

        // Automation Log Section - Positioned below Test Cases Management
        React.createElement('div', {
          key: 'logs',
          className: 'bg-white p-4 m-4 rounded shadow-sm' // White panel with margin and shadow
        }, [
          React.createElement('div', {
            key: 'header',
            className: 'flex items-center justify-between mb-4'
          }, [
            React.createElement('h2', {
              key: 'title',
              className: 'text-lg font-semibold text-gray-900'
            }, 'Automation Log'),
            React.createElement('div', {
              key: 'actions',
              className: 'flex items-center space-x-2'
            }, [
              React.createElement('button', {
                key: 'clear',
                className: 'bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700 flex items-center space-x-1'
              }, [
                React.createElement('i', { key: 'icon', 'data-lucide': 'square', className: 'w-4 h-4' }),
                React.createElement('span', { key: 'text' }, 'Clear')
              ]),
              React.createElement('button', {
                key: 'download',
                className: 'bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 flex items-center space-x-1'
              }, [
                React.createElement('i', { key: 'icon', 'data-lucide': 'download', className: 'w-4 h-4' }),
                React.createElement('span', { key: 'text' }, 'Download')
              ])
            ])
          ]),

          // Log Display - Dark gray background showing ongoing logs
          React.createElement('div', {
            key: 'log-display',
            className: 'bg-gray-800 text-white p-4 rounded font-mono text-sm h-64 overflow-y-auto border border-gray-600' // Dark gray background
          }, logs.map((log, index) => 
            React.createElement('div', {
              key: index,
              className: 'mb-1 flex items-start'
            }, [
              React.createElement('span', {
                key: 'timestamp',
                className: 'text-blue-300 font-bold'
              }, `[${log.timestamp}]`),
              React.createElement('span', {
                key: 'message',
                className: 'text-gray-100 ml-2'
              }, log.message)
            ])
          ))
        ])
      ])
    ]);

  } catch (error) {
    console.error('ProfessionalTestingPlatform error:', error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'Professional Testing Platform failed to load');
  }
}

window.ProfessionalTestingPlatform = ProfessionalTestingPlatform;
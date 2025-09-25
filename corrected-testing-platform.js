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
    const [logs, setLogs] = React.useState([
      { timestamp: '2024-01-18 00:40:15', level: 'INFO', message: 'Initializing RAN-Core Test Manager' },
      { timestamp: '2024-01-18 00:40:16', level: 'INFO', message: 'loading component configurations' },
      { timestamp: '2024-01-18 00:40:17', level: 'INFO', message: 'Preparing test environment' }
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
      }
    ]);

    // RAN Components
    const ranComponents = [
      { id: 'enodeb', name: 'eNodeB', status: 'active', color: 'green' },
      { id: 'gnodeb', name: 'gNodeB', status: 'active', color: 'green' },
      { id: 'core', name: 'Core Network', status: 'active', color: 'green' }
    ];

    // Test Suites Categories - Fixed to match image order
    const testSuites = [
      {
        id: 'enodeb-suites',
        name: 'eNodeB Test Suites',
        expanded: true,
        children: [
          { id: 'functional', name: 'Functional', count: 1 }
        ]
      },
      {
        id: 'gnodeb-suites',
        name: 'gNodeB Test Suites',
        expanded: true,
        children: [
          { id: '5g-connectivity', name: '5G Connectivity', count: 0 },
          { id: 'beam-management', name: 'Beam Management', count: 0 },
          { id: 'network-slice', name: 'Network Slice Test', count: 0 }
        ]
      },
      {
        id: 'core-network-suites',
        name: 'Core Network Test Suites',
        expanded: false,
        children: []
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
                  React.createElement('span', {
                    key: 'name',
                    className: 'text-sm text-gray-300'
                  }, child.name),
                  child.count > 0 && React.createElement('span', {
                    key: 'count',
                    className: 'bg-blue-600 text-white text-xs px-2 py-1 rounded-full'
                  }, child.count)
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
                className: 'bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700'
              }, 'Delete Selected')
            ])
          ]),

          // Test Cases Table with Scroll
          React.createElement('div', {
            key: 'table',
            className: 'overflow-x-auto max-h-96 overflow-y-auto border border-gray-200 rounded'
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
                  React.createElement('th', { key: 'select', className: 'px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase sticky top-0 bg-gray-50' }, ''),
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
                  className: 'hover:bg-gray-50'
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

        // Automation Log Section - White panel on gray background
        React.createElement('div', {
          key: 'logs',
          className: 'flex-1 bg-white p-4 m-4 rounded shadow-sm' // White panel with margin and shadow
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

          // Log Display - Dark blue/black background as in image
          React.createElement('div', {
            key: 'log-display',
            className: 'bg-gray-900 text-white p-4 rounded font-mono text-sm h-64 overflow-y-auto' // Changed to dark gray/black
          }, logs.map((log, index) => 
            React.createElement('div', {
              key: index,
              className: 'mb-1'
            }, [
              React.createElement('span', {
                key: 'timestamp',
                className: 'text-blue-400'
              }, `[${log.timestamp}]`),
              React.createElement('span', {
                key: 'message',
                className: 'text-white ml-2'
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
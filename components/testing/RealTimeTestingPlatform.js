// Real-Time Testing Platform - Enhanced with Supabase Integration
// Professional QXDM/Keysight-like interface with live test execution monitoring

function RealTimeTestingPlatform({ appState, onStateChange }) {
  try {
    React.useEffect(() => {
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }, []);

    // State management
    const [testCases, setTestCases] = React.useState([]);
    const [selectedTests, setSelectedTests] = React.useState([]);
    const [isRunning, setIsRunning] = React.useState(false);
    const [logs, setLogs] = React.useState([]);
    const [executionStatus, setExecutionStatus] = React.useState({});
    const [protocolLayers, setProtocolLayers] = React.useState({});
    const [ranComponents, setRanComponents] = React.useState([]);
    const [activeTab, setActiveTab] = React.useState('test-cases');
    const [supabaseConnected, setSupabaseConnected] = React.useState(false);

    // Initialize platform
    React.useEffect(() => {
      initializePlatform();
    }, []);

    // Initialize platform components
    const initializePlatform = async () => {
      try {
        // Check Supabase connection
        if (window.SupabaseTestingIntegration) {
          setSupabaseConnected(window.SupabaseTestingIntegration.isConnected);
          
          // Subscribe to real-time updates
          window.SupabaseTestingIntegration.onTestExecutionUpdate((update) => {
            handleRealtimeUpdate(update);
          });
        }

        // Load test cases
        await loadTestCases();
        
        // Load RAN components
        loadRanComponents();
        
        // Initialize protocol layers
        initializeProtocolLayers();
        
        addLog('INFO', 'Professional Testing Platform initialized successfully');
        
      } catch (error) {
        console.error('Platform initialization error:', error);
        addLog('ERROR', `Platform initialization failed: ${error.message}`);
      }
    };

    // Load test cases from Supabase or config
    const loadTestCases = async () => {
      try {
        let testCasesData = [];
        
        if (window.SupabaseTestingIntegration && window.SupabaseTestingIntegration.isConnected) {
          testCasesData = await window.SupabaseTestingIntegration.getAllTestCases();
        } else {
          // Fallback to config
          testCasesData = window.TestingPlatformConfig?.getAllTestCases() || [];
        }

        const formattedTestCases = testCasesData.map(test => ({
          ...test,
          status: 'Pending',
          iterations: { total: 0, passed: 0, failed: 0, skipped: 0 },
          successRate: 0,
          lastRun: 'Never',
          duration: '-',
          selected: false,
          executionId: null
        }));

        setTestCases(formattedTestCases);
        addLog('INFO', `Loaded ${formattedTestCases.length} test cases`);
        
      } catch (error) {
        console.error('Error loading test cases:', error);
        addLog('ERROR', `Failed to load test cases: ${error.message}`);
      }
    };

    // Load RAN components
    const loadRanComponents = () => {
      const components = window.TestingPlatformConfig?.getAllRanComponents() || [];
      setRanComponents(components);
    };

    // Initialize protocol layers
    const initializeProtocolLayers = () => {
      const layers = {
        'PHY': { name: 'Physical Layer', status: 'active', messages: [] },
        'MAC': { name: 'Medium Access Control', status: 'active', messages: [] },
        'RLC': { name: 'Radio Link Control', status: 'active', messages: [] },
        'PDCP': { name: 'Packet Data Convergence Protocol', status: 'active', messages: [] },
        'RRC': { name: 'Radio Resource Control', status: 'active', messages: [] },
        'NAS': { name: 'Non-Access Stratum', status: 'active', messages: [] }
      };
      setProtocolLayers(layers);
    };

    // Handle real-time updates from Supabase
    const handleRealtimeUpdate = (update) => {
      const { type, event, data, timestamp } = update;
      
      if (type === 'execution_log') {
        addLog(data.level, data.message, data.data);
      } else if (type === 'test_execution') {
        updateExecutionStatus(data);
      }
    };

    // Update execution status
    const updateExecutionStatus = (executionData) => {
      setExecutionStatus(prev => ({
        ...prev,
        [executionData.test_case_id]: executionData
      }));

      // Update test case status
      setTestCases(prev => prev.map(tc => 
        tc.id === executionData.test_case_id 
          ? { ...tc, status: executionData.status, executionId: executionData.id }
          : tc
      ));
    };

    // Add log entry
    const addLog = (level, message, data = null) => {
      const timestamp = new Date().toLocaleTimeString();
      const logEntry = { timestamp, level, message, data };
      setLogs(prev => [...prev.slice(-99), logEntry]); // Keep last 100 logs
    };

    // Start test execution
    const handleRunTest = async (testId) => {
      try {
        setIsRunning(true);
        addLog('INFO', `Starting test execution: ${testId}`);
        
        // Update test status
        setTestCases(prev => prev.map(tc => 
          tc.id === testId ? { ...tc, status: 'Running' } : tc
        ));

        let execution;
        if (window.SupabaseTestingIntegration && window.SupabaseTestingIntegration.isConnected) {
          execution = await window.SupabaseTestingIntegration.startTestExecution(testId);
        } else {
          // Simulate execution
          execution = await simulateTestExecution(testId);
        }

        addLog('INFO', `Test execution started: ${execution.id}`);
        
      } catch (error) {
        console.error('Test execution error:', error);
        addLog('ERROR', `Test execution failed: ${error.message}`);
        setIsRunning(false);
      }
    };

    // Simulate test execution for offline mode
    const simulateTestExecution = async (testId) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const testCase = testCases.find(tc => tc.id === testId);
          if (testCase) {
            setTestCases(prev => prev.map(tc => 
              tc.id === testId ? { 
                ...tc, 
                status: 'Completed',
                iterations: { total: 1, passed: 1, failed: 0, skipped: 0 },
                successRate: 100,
                lastRun: new Date().toLocaleString(),
                duration: '2m 15s'
              } : tc
            ));
          }
          addLog('INFO', `Test execution completed: ${testId}`);
          setIsRunning(false);
          resolve({ id: 'sim-' + Date.now(), test_case_id: testId, status: 'completed' });
        }, 3000);
      });
    };

    // Run selected tests
    const handleRunSelected = async () => {
      const selectedTestIds = testCases.filter(tc => tc.selected).map(tc => tc.id);
      if (selectedTestIds.length === 0) return;
      
      setIsRunning(true);
      addLog('INFO', `Starting batch execution of ${selectedTestIds.length} tests`);
      
      // Execute tests sequentially
      for (const testId of selectedTestIds) {
        await handleRunTest(testId);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Delay between tests
      }
      
      setIsRunning(false);
      addLog('INFO', 'Batch test execution completed');
    };

    // Toggle test selection
    const toggleTestSelection = (testId) => {
      setTestCases(prev => prev.map(tc => 
        tc.id === testId ? { ...tc, selected: !tc.selected } : tc
      ));
    };

    // Toggle all selection
    const toggleAllSelection = () => {
      const allSelected = testCases.every(tc => tc.selected);
      setTestCases(prev => prev.map(tc => ({ ...tc, selected: !allSelected })));
    };

    // Utility functions
    const getStatusColor = (status) => {
      switch (status) {
        case 'Completed': return 'bg-green-100 text-green-800';
        case 'Running': return 'bg-blue-100 text-blue-800';
        case 'Failed': return 'bg-red-100 text-red-800';
        case 'Pending': return 'bg-gray-100 text-gray-800';
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

    const getLogLevelColor = (level) => {
      switch (level) {
        case 'ERROR': return 'bg-red-500 text-white';
        case 'WARN': return 'bg-yellow-500 text-white';
        case 'INFO': return 'bg-blue-500 text-white';
        case 'DEBUG': return 'bg-gray-500 text-white';
        default: return 'bg-gray-500 text-white';
      }
    };

    const selectedCount = testCases.filter(tc => tc.selected).length;

    return React.createElement('div', {
      className: 'h-screen flex flex-col bg-gray-50',
      'data-name': 'realtime-testing-platform'
    }, [
      // Header
      React.createElement('div', {
        key: 'header',
        className: 'bg-white border-b border-gray-200 p-4'
      }, [
        React.createElement('div', {
          key: 'content',
          className: 'flex items-center justify-between'
        }, [
          React.createElement('div', {
            key: 'left',
            className: 'flex items-center space-x-3'
          }, [
            React.createElement('i', {
              key: 'icon',
              'data-lucide': 'activity',
              className: 'w-8 h-8 text-blue-600'
            }),
            React.createElement('div', {
              key: 'title'
            }, [
              React.createElement('h1', {
                key: 'main',
                className: 'text-2xl font-bold text-gray-900'
              }, 'Real-Time Testing Platform'),
              React.createElement('p', {
                key: 'sub',
                className: 'text-sm text-gray-600'
              }, 'Professional 5G/4G Protocol Testing with Live Monitoring')
            ])
          ]),
          React.createElement('div', {
            key: 'right',
            className: 'flex items-center space-x-3'
          }, [
            React.createElement('div', {
              key: 'connection-status',
              className: 'flex items-center space-x-2'
            }, [
              React.createElement('div', {
                key: 'indicator',
                className: `w-3 h-3 rounded-full ${supabaseConnected ? 'bg-green-500' : 'bg-red-500'}`
              }),
              React.createElement('span', {
                key: 'text',
                className: 'text-sm text-gray-600'
              }, supabaseConnected ? 'Supabase Connected' : 'Offline Mode')
            ]),
            React.createElement('button', {
              key: 'settings',
              className: 'p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded'
            }, React.createElement('i', { 'data-lucide': 'settings', className: 'w-5 h-5' }))
          ])
        ])
      ]),

      // Navigation Tabs
      React.createElement('div', {
        key: 'tabs',
        className: 'bg-white border-b border-gray-200'
      }, [
        React.createElement('div', {
          key: 'tab-list',
          className: 'flex space-x-8 px-6'
        }, [
          React.createElement('button', {
            key: 'test-cases',
            className: `py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'test-cases' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`,
            onClick: () => setActiveTab('test-cases')
          }, 'Test Cases'),
          React.createElement('button', {
            key: 'execution',
            className: `py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'execution' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`,
            onClick: () => setActiveTab('execution')
          }, 'Execution Monitor'),
          React.createElement('button', {
            key: 'protocol-layers',
            className: `py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'protocol-layers' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`,
            onClick: () => setActiveTab('protocol-layers')
          }, 'Protocol Layers'),
          React.createElement('button', {
            key: 'ran-components',
            className: `py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'ran-components' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`,
            onClick: () => setActiveTab('ran-components')
          }, 'RAN Components')
        ])
      ]),

      // Main Content
      React.createElement('div', {
        key: 'main',
        className: 'flex-1 flex flex-col overflow-hidden'
      }, [
        // Test Cases Tab
        activeTab === 'test-cases' && React.createElement('div', {
          key: 'test-cases-content',
          className: 'flex-1 bg-white p-6 overflow-auto'
        }, [
          React.createElement('div', {
            key: 'header',
            className: 'flex items-center justify-between mb-6'
          }, [
            React.createElement('h2', {
              key: 'title',
              className: 'text-xl font-semibold text-gray-900'
            }, 'Test Cases Management'),
            React.createElement('div', {
              key: 'actions',
              className: 'flex items-center space-x-3'
            }, [
              React.createElement('button', {
                key: 'refresh',
                className: 'bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 flex items-center space-x-2',
                onClick: loadTestCases
              }, [
                React.createElement('i', { key: 'icon', 'data-lucide': 'refresh-cw', className: 'w-4 h-4' }),
                React.createElement('span', { key: 'text' }, 'Refresh')
              ]),
              React.createElement('button', {
                key: 'add',
                className: 'bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 flex items-center space-x-2'
              }, [
                React.createElement('i', { key: 'icon', 'data-lucide': 'plus', className: 'w-4 h-4' }),
                React.createElement('span', { key: 'text' }, 'Add Test')
              ]),
              React.createElement('button', {
                key: 'run-selected',
                className: `px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 ${
                  selectedCount > 0 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`,
                onClick: handleRunSelected,
                disabled: selectedCount === 0 || isRunning
              }, [
                React.createElement('i', { key: 'icon', 'data-lucide': 'play', className: 'w-4 h-4' }),
                React.createElement('span', { key: 'text' }, `Run Selected (${selectedCount})`)
              ])
            ])
          ]),

          // Test Cases Table
          React.createElement('div', {
            key: 'table',
            className: 'overflow-x-auto'
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
                    className: 'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' 
                  }, React.createElement('input', {
                    type: 'checkbox',
                    checked: testCases.every(tc => tc.selected),
                    onChange: toggleAllSelection,
                    className: 'form-checkbox'
                  })),
                  React.createElement('th', { key: 'name', className: 'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' }, 'NAME'),
                  React.createElement('th', { key: 'status', className: 'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' }, 'STATUS'),
                  React.createElement('th', { key: 'iterations', className: 'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' }, 'ITERATIONS'),
                  React.createElement('th', { key: 'success', className: 'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' }, 'SUCCESS RATE'),
                  React.createElement('th', { key: 'last-run', className: 'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' }, 'LAST RUN'),
                  React.createElement('th', { key: 'duration', className: 'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' }, 'DURATION'),
                  React.createElement('th', { key: 'priority', className: 'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' }, 'PRIORITY'),
                  React.createElement('th', { key: 'actions', className: 'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider' }, 'ACTIONS')
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
                    className: 'px-4 py-4'
                  }, React.createElement('input', {
                    type: 'checkbox',
                    checked: testCase.selected,
                    onChange: () => toggleTestSelection(testCase.id),
                    className: 'form-checkbox'
                  })),
                  React.createElement('td', {
                    key: 'name',
                    className: 'px-4 py-4'
                  }, [
                    React.createElement('div', {
                      key: 'main',
                      className: 'text-sm font-medium text-gray-900'
                    }, testCase.name),
                    React.createElement('div', {
                      key: 'desc',
                      className: 'text-sm text-gray-500'
                    }, testCase.description)
                  ]),
                  React.createElement('td', {
                    key: 'status',
                    className: 'px-4 py-4'
                  }, React.createElement('span', {
                    className: `px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(testCase.status)}`
                  }, testCase.status)),
                  React.createElement('td', {
                    key: 'iterations',
                    className: 'px-4 py-4 text-sm text-gray-900'
                  }, [
                    React.createElement('div', { key: 'total' }, `Total: ${testCase.iterations.total}`),
                    React.createElement('div', { key: 'passed' }, `Passed: ${testCase.iterations.passed}`),
                    React.createElement('div', { key: 'failed', className: 'text-red-600' }, `Failed: ${testCase.iterations.failed}`),
                    React.createElement('div', { key: 'skipped', className: 'text-orange-600' }, `Skipped: ${testCase.iterations.skipped}`)
                  ]),
                  React.createElement('td', {
                    key: 'success',
                    className: 'px-4 py-4'
                  }, [
                    React.createElement('div', {
                      key: 'rate',
                      className: 'text-sm font-medium text-gray-900'
                    }, `${testCase.successRate}%`),
                    React.createElement('div', {
                      key: 'bar',
                      className: 'w-full bg-gray-200 rounded-full h-2 mt-1'
                    }, React.createElement('div', {
                      className: 'bg-blue-600 h-2 rounded-full',
                      style: { width: `${testCase.successRate}%` }
                    }))
                  ]),
                  React.createElement('td', {
                    key: 'last-run',
                    className: 'px-4 py-4 text-sm text-gray-500'
                  }, testCase.lastRun),
                  React.createElement('td', {
                    key: 'duration',
                    className: 'px-4 py-4 text-sm text-gray-500'
                  }, testCase.duration),
                  React.createElement('td', {
                    key: 'priority',
                    className: 'px-4 py-4'
                  }, React.createElement('span', {
                    className: `px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(testCase.priority)}`
                  }, testCase.priority)),
                  React.createElement('td', {
                    key: 'actions',
                    className: 'px-4 py-4'
                  }, React.createElement('div', {
                    className: 'flex items-center space-x-2'
                  }, [
                    React.createElement('button', {
                      key: 'run',
                      className: 'bg-green-600 text-white p-1 rounded hover:bg-green-700',
                      onClick: () => handleRunTest(testCase.id),
                      disabled: isRunning
                    }, React.createElement('i', { 'data-lucide': 'play', className: 'w-4 h-4' })),
                    React.createElement('button', {
                      key: 'edit',
                      className: 'bg-blue-600 text-white p-1 rounded hover:bg-blue-700'
                    }, React.createElement('i', { 'data-lucide': 'edit', className: 'w-4 h-4' })),
                    React.createElement('button', {
                      key: 'delete',
                      className: 'bg-red-600 text-white p-1 rounded hover:bg-red-700'
                    }, React.createElement('i', { 'data-lucide': 'trash-2', className: 'w-4 h-4' }))
                  ]))
                ])
              ))
            ])
          ])
        ]),

        // Execution Monitor Tab
        activeTab === 'execution' && React.createElement('div', {
          key: 'execution-content',
          className: 'flex-1 bg-white p-6 overflow-auto'
        }, [
          React.createElement('h2', {
            key: 'title',
            className: 'text-xl font-semibold text-gray-900 mb-6'
          }, 'Real-Time Execution Monitor'),
          
          // Execution Logs
          React.createElement('div', {
            key: 'logs',
            className: 'bg-black text-white p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto'
          }, logs.map((log, index) => 
            React.createElement('div', {
              key: index,
              className: 'flex items-start space-x-3 mb-2'
            }, [
              React.createElement('span', {
                key: 'timestamp',
                className: 'text-blue-400'
              }, `[${log.timestamp}]`),
              React.createElement('span', {
                key: 'level',
                className: `px-2 py-1 rounded text-xs font-bold ${getLogLevelColor(log.level)}`
              }, log.level),
              React.createElement('span', {
                key: 'message',
                className: 'text-white'
              }, log.message)
            ])
          ))
        ]),

        // Protocol Layers Tab
        activeTab === 'protocol-layers' && React.createElement('div', {
          key: 'protocol-layers-content',
          className: 'flex-1 bg-white p-6 overflow-auto'
        }, [
          React.createElement('h2', {
            key: 'title',
            className: 'text-xl font-semibold text-gray-900 mb-6'
          }, 'Protocol Layer Monitoring'),
          
          React.createElement('div', {
            key: 'layers',
            className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
          }, Object.entries(protocolLayers).map(([layerId, layer]) => 
            React.createElement('div', {
              key: layerId,
              className: 'bg-gray-50 p-4 rounded-lg border'
            }, [
              React.createElement('div', {
                key: 'header',
                className: 'flex items-center justify-between mb-2'
              }, [
                React.createElement('h3', {
                  key: 'name',
                  className: 'font-medium text-gray-900'
                }, layer.name),
                React.createElement('span', {
                  key: 'status',
                  className: `px-2 py-1 text-xs rounded-full ${
                    layer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`
                }, layer.status)
              ]),
              React.createElement('div', {
                key: 'messages',
                className: 'text-sm text-gray-600'
              }, `${layer.messages.length} messages`)
            ])
          ))
        ]),

        // RAN Components Tab
        activeTab === 'ran-components' && React.createElement('div', {
          key: 'ran-components-content',
          className: 'flex-1 bg-white p-6 overflow-auto'
        }, [
          React.createElement('h2', {
            key: 'title',
            className: 'text-xl font-semibold text-gray-900 mb-6'
          }, 'RAN Components Status'),
          
          React.createElement('div', {
            key: 'components',
            className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
          }, ranComponents.map(component => 
            React.createElement('div', {
              key: component.name,
              className: 'bg-gray-50 p-4 rounded-lg border'
            }, [
              React.createElement('div', {
                key: 'header',
                className: 'flex items-center justify-between mb-2'
              }, [
                React.createElement('h3', {
                  key: 'name',
                  className: 'font-medium text-gray-900'
                }, component.name),
                React.createElement('span', {
                  key: 'status',
                  className: `px-2 py-1 text-xs rounded-full ${
                    component.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`
                }, component.status)
              ]),
              React.createElement('p', {
                key: 'description',
                className: 'text-sm text-gray-600 mb-2'
              }, component.description),
              React.createElement('div', {
                key: 'capabilities',
                className: 'text-xs text-gray-500'
              }, `Capabilities: ${component.capabilities.join(', ')}`)
            ])
          ))
        ])
      ])
    ]);

  } catch (error) {
    console.error('RealTimeTestingPlatform error:', error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'Real-Time Testing Platform failed to load');
  }
}

window.RealTimeTestingPlatform = RealTimeTestingPlatform;
// Professional Testing Platform - QXDM/Keysight-like Interface
import React from 'react';

interface ProfessionalTestingPlatformProps {
  appState?: any;
  onStateChange?: (state: any) => void;
}

function ProfessionalTestingPlatform({ appState, onStateChange }: ProfessionalTestingPlatformProps) {
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
      { timestamp: '2024-01-18 00:40:16', level: 'INFO', message: 'Loading component configurations' },
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
        priority: '',
        selected: false
      }
    ]);

    // RAN Components
    const ranComponents = [
      { id: 'enodeb', name: 'eNodeB', status: 'active', color: 'green' },
      { id: 'gnodeb', name: 'gNodeB', status: 'active', color: 'green' },
      { id: 'core', name: 'Core Network', status: 'active', color: 'green' }
    ];

    // Test Suites Categories - Dynamic based on loaded test cases
    const getTestSuites = () => {
      const categories = {};
      testCases.forEach(tc => {
        const category = tc.category || 'Other';
        if (!categories[category]) {
          categories[category] = 0;
        }
        categories[category]++;
      });

      return [
        {
          id: '5g-nr',
          name: '5G NR Test Suites',
          expanded: true,
          children: [
            { id: '5g-connectivity', name: '5G Connectivity', count: categories['5G_NR'] || 0 },
            { id: 'beam-management', name: 'Beam Management', count: 0 },
            { id: 'network-slice', name: 'Network Slice Test', count: 0 }
          ]
        },
        {
          id: '4g-lte',
          name: '4G LTE Test Suites',
          expanded: true,
          children: [
            { id: 'lte-functional', name: 'Functional', count: categories['4G_LTE'] || 0 }
          ]
        },
        {
          id: 'core-network',
          name: 'Core Network Test Suites',
          expanded: false,
          children: [
            { id: 'core-functional', name: 'Core Network', count: categories['CORE_NETWORK'] || 0 }
          ]
        }
      ];
    };

    const testSuites = getTestSuites();

    const addLog = (level, message) => {
      const timestamp = new Date().toLocaleString();
      setLogs(prev => [...prev, { timestamp, level, message }]);
    };

    // Load test cases from database (backend change only)
    const fetchTestCases = async () => {
      try {
        addLog('INFO', 'Loading test cases from database...');
        
        const response = await fetch('/api/test-cases/simple');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const responseData = await response.json();
        const testCasesData = responseData.data?.testCases || responseData || [];
        
        if (!Array.isArray(testCasesData)) {
          throw new Error(`Expected array but got: ${typeof testCasesData}`);
        }
        
        const formattedTestCases = testCasesData.map(tc => ({
          id: tc.id,
          name: tc.name,
          component: tc.category || 'Unknown',
          status: 'Not Started',
          iterations: 'Never',
          successRate: 'N/A',
          lastRun: 'N/A',
          duration: '',
          priority: tc.priority || 'Medium',
          selected: false,
          category: tc.category,
          description: tc.description
        }));
        
        setTestCases(formattedTestCases);
        addLog('INFO', `Loaded ${formattedTestCases.length} test cases from database`);
        
      } catch (error) {
        addLog('ERROR', `Failed to load test cases: ${error.message}`);
        console.error('Error loading test cases:', error);
        
        // Keep the original fallback test case
        addLog('INFO', 'Using fallback test case');
      }
    };

    const handleRunTest = async (testId) => {
      setIsRunning(true);
      addLog('INFO', `Starting test execution: ${testId}`);
      
      try {
        // Call the test execution API (backend change only)
        const response = await fetch('/api/test-execution/enhanced', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            testCaseId: testId,
            userId: 'user-1',
            executionMode: 'comprehensive',
            configuration: {},
            timeAcceleration: 1.0,
            logLevel: 'detailed',
            captureMode: 'full'
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        addLog('INFO', `Test execution API called successfully: ${result.executionId}`);
        
        // Send data to 5GLabX Platform via custom event (backend change only)
        const testExecutionEvent = new CustomEvent('testCaseExecutionStarted', {
          detail: {
            executionId: result.executionId,
            testCaseId: testId,
            testCaseData: {
              id: testId,
              name: testCases.find(tc => tc.id === testId)?.name || 'Unknown Test',
              component: testCases.find(tc => tc.id === testId)?.component || 'Unknown Component',
              expectedLayerParameters: [
                { layer: 'PHY', parameter: 'RSRP', value: '-80 dBm' },
                { layer: 'MAC', parameter: 'CQI', value: '15' },
                { layer: 'RLC', parameter: 'PDU Size', value: '1500 bytes' }
              ]
            },
            timestamp: new Date().toISOString()
          }
        });
        
        if (typeof window !== 'undefined') {
          window.dispatchEvent(testExecutionEvent);
          addLog('INFO', `Data sent to 5GLabX Platform for execution: ${result.executionId}`);

          // Also send via postMessage for additional compatibility
          window.postMessage({
            type: '5GLABX_TEST_EXECUTION',
            executionId: result.executionId,
            testCaseId: testId,
            data: result
          }, '*');
        }

        setIsRunning(false);
        addLog('INFO', `Test execution completed: ${testId}`);
        setTestCases(prev => prev.map(tc => 
          tc.id === testId ? { ...tc, status: 'Completed', lastRun: new Date().toLocaleString() } : tc
        ));
        
      } catch (error) {
        setIsRunning(false);
        addLog('ERROR', `Test execution failed: ${error.message}`);
        console.error('Test execution error:', error);
      }
    };

    const handleRunAllTests = async () => {
      setIsRunning(true);
      addLog('INFO', 'Starting batch test execution');

      try {
        const selectedTests = testCases.filter(tc => tc.selected);
        if (selectedTests.length === 0) {
          addLog('WARNING', 'No tests selected for execution');
          setIsRunning(false);
          return;
        }

        for (const testCase of selectedTests) {
          await handleRunTest(testCase.id);
          // Small delay between tests
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        setIsRunning(false);
        addLog('INFO', 'Batch test execution completed');
      } catch (error) {
        setIsRunning(false);
        addLog('ERROR', `Batch test execution failed: ${error.message}`);
        console.error('Batch test execution error:', error);
      }
    };

    const toggleTestSelection = (testId) => {
      setTestCases(prev => prev.map(tc => 
        tc.id === testId ? { ...tc, selected: !tc.selected } : tc
      ));
    };

    const toggleTestSuite = (suiteId) => {
      setSelectedTestSuite(selectedTestSuite === suiteId ? null : suiteId);
    };

    // Load test cases on component mount (backend change only)
    React.useEffect(() => {
      fetchTestCases();
    }, []);

    return React.createElement('div', {
      className: 'h-full flex flex-col bg-gray-50'
    }, [
      // Header
      React.createElement('div', {
        key: 'header',
        className: 'bg-white border-b border-gray-200 px-6 py-4'
      }, [
        React.createElement('div', {
          key: 'header-content',
          className: 'flex items-center justify-between'
        }, [
          React.createElement('h1', {
            key: 'title',
            className: 'text-2xl font-bold text-gray-900'
          }, 'Professional Test Manager'),
          React.createElement('div', {
            key: 'status',
            className: 'flex items-center space-x-4'
          }, [
            React.createElement('div', {
              key: 'status-indicator',
              className: 'flex items-center space-x-2'
            }, [
              React.createElement('div', {
                key: 'status-dot',
                className: 'w-3 h-3 bg-green-500 rounded-full'
              }),
              React.createElement('span', {
                key: 'status-text',
                className: 'text-sm text-gray-600'
              }, 'System Online')
            ]),
            React.createElement('div', {
              key: 'controls',
              className: 'flex items-center space-x-2'
            }, [
              React.createElement('button', {
                key: 'play-btn',
                className: 'px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50',
                disabled: isRunning,
                onClick: handleRunAllTests
              }, React.createElement('i', { 'data-lucide': 'play', className: 'w-3 h-3' })),
              React.createElement('button', {
                key: 'stop-btn',
                className: 'px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50',
                disabled: !isRunning
              }, React.createElement('i', { 'data-lucide': 'square', className: 'w-3 h-3' })),
              React.createElement('button', {
                key: 'settings-btn',
                className: 'px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700'
              }, React.createElement('i', { 'data-lucide': 'settings', className: 'w-3 h-3' }))
            ])
          ])
        ])
      ]),

      // Main Content
      React.createElement('div', {
        key: 'main-content',
        className: 'flex-1 flex overflow-hidden'
      }, [
        // Left Sidebar - Test Suites
        React.createElement('div', {
          key: 'sidebar',
          className: 'w-80 bg-white border-r border-gray-200 flex flex-col'
        }, [
          React.createElement('div', {
            key: 'sidebar-header',
            className: 'p-4 border-b border-gray-200'
          }, [
            React.createElement('h3', {
              key: 'sidebar-title',
              className: 'text-lg font-semibold text-gray-900'
            }, 'Test Suites'),
            React.createElement('button', {
              key: 'refresh-btn',
              className: 'mt-2 text-sm text-blue-600 hover:text-blue-800',
              onClick: fetchTestCases
            }, 'Refresh from Database')
          ]),
          React.createElement('div', {
            key: 'sidebar-content',
            className: 'flex-1 overflow-y-auto p-4'
          }, [
            React.createElement('div', {
              key: 'test-suites',
              className: 'space-y-2'
            }, testSuites.map(suite => 
              React.createElement('div', {
                key: suite.id,
                className: 'border border-gray-200 rounded-lg'
              }, [
                React.createElement('div', {
                  key: 'suite-header',
                  className: 'p-3 bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100',
                  onClick: () => toggleTestSuite(suite.id)
                }, [
                  React.createElement('div', {
                    key: 'suite-content',
                    className: 'flex items-center justify-between'
                  }, [
                    React.createElement('div', {
                      key: 'suite-info',
                      className: 'flex items-center space-x-2'
                    }, [
                      React.createElement('i', {
                        key: 'suite-icon',
                        'data-lucide': selectedTestSuite === suite.id ? 'chevron-down' : 'chevron-right',
                        className: 'w-4 h-4 text-gray-500'
                      }),
                      React.createElement('span', {
                        key: 'suite-name',
                        className: 'font-medium text-gray-900'
                      }, suite.name)
                    ]),
                    React.createElement('span', {
                      key: 'suite-count',
                      className: 'text-sm text-gray-500'
                    }, suite.children.reduce((sum, child) => sum + child.count, 0))
                  ])
                ]),
                selectedTestSuite === suite.id && React.createElement('div', {
                  key: 'suite-children',
                  className: 'p-2 space-y-1'
                }, suite.children.map(child => 
                  React.createElement('div', {
                    key: child.id,
                    className: 'p-2 hover:bg-gray-50 rounded cursor-pointer'
                  }, [
                    React.createElement('div', {
                      key: 'child-content',
                      className: 'flex items-center justify-between'
                    }, [
                      React.createElement('span', {
                        key: 'child-name',
                        className: 'text-sm text-gray-700'
                      }, child.name),
                      child.count > 0 && React.createElement('span', {
                        key: 'child-count',
                        className: 'text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full'
                      }, child.count)
                    ])
                  ])
                ))
              ])
            ))
          ])
        ]),

        // Main Content Area
        React.createElement('div', {
          key: 'main-area',
          className: 'flex-1 flex flex-col'
        }, [
          // Test Cases List
          React.createElement('div', {
            key: 'test-cases',
            className: 'flex-1 p-6'
          }, [
            React.createElement('div', {
              key: 'test-cases-header',
              className: 'flex items-center justify-between mb-4'
            }, [
              React.createElement('h2', {
                key: 'test-cases-title',
                className: 'text-xl font-semibold text-gray-900'
              }, 'Test Cases'),
              React.createElement('div', {
                key: 'test-cases-actions',
                className: 'flex items-center space-x-2'
              }, [
                React.createElement('button', {
                  key: 'run-all-btn',
                  className: 'px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2',
                  disabled: isRunning || testCases.filter(tc => tc.selected).length === 0,
                  onClick: handleRunAllTests
                }, [
                  React.createElement('i', { key: 'icon', 'data-lucide': 'play', className: 'w-4 h-4' }),
                  React.createElement('span', { key: 'text' }, 'Run All Tests')
                ]),
                React.createElement('button', {
                  key: 'clear-btn',
                  className: 'px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700'
                }, [
                  React.createElement('i', { key: 'icon', 'data-lucide': 'square', className: 'w-4 h-4' }),
                  React.createElement('span', { key: 'text' }, 'Clear')
                ])
              ])
            ]),
            React.createElement('div', {
              key: 'test-cases-list',
              className: 'space-y-2'
            }, testCases.map(testCase => 
              React.createElement('div', {
                key: testCase.id,
                className: `p-4 border rounded-lg cursor-pointer transition-colors ${
                  testCase.selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`
              }, [
                React.createElement('div', {
                  key: 'test-case-content',
                  className: 'flex items-center justify-between'
                }, [
                  React.createElement('div', {
                    key: 'test-case-info',
                    className: 'flex items-center space-x-3'
                  }, [
                    React.createElement('input', {
                      key: 'test-case-checkbox',
                      type: 'checkbox',
                      checked: testCase.selected,
                      onChange: () => toggleTestSelection(testCase.id),
                      className: 'w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                    }),
                    React.createElement('div', {
                      key: 'test-case-details',
                      className: 'flex-1'
                    }, [
                      React.createElement('div', {
                        key: 'test-case-name',
                        className: 'font-medium text-gray-900'
                      }, testCase.name),
                      React.createElement('div', {
                        key: 'test-case-meta',
                        className: 'text-sm text-gray-500'
                      }, `${testCase.component} • ${testCase.status}`)
                    ])
                  ]),
                  React.createElement('div', {
                    key: 'test-case-actions',
                    className: 'flex items-center space-x-2'
                  }, [
                    React.createElement('button', {
                      key: 'run-btn',
                      className: 'px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50',
                      disabled: isRunning,
                      onClick: () => handleRunTest(testCase.id)
                    }, React.createElement('i', { 'data-lucide': 'play', className: 'w-4 h-4' })),
                    React.createElement('button', {
                      key: 'view-btn',
                      className: 'px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700'
                    }, React.createElement('i', { 'data-lucide': 'eye', className: 'w-4 h-4' }))
                  ])
                ])
              ])
            ))
          ]),

          // Logs Panel
          React.createElement('div', {
            key: 'logs-panel',
            className: 'h-64 bg-white border-t border-gray-200 flex flex-col'
          }, [
            React.createElement('div', {
              key: 'logs-header',
              className: 'p-4 border-b border-gray-200'
            }, [
              React.createElement('h2', {
                key: 'logs-title',
                className: 'text-lg font-semibold text-gray-900'
              }, 'Execution Logs'),
              React.createElement('div', {
                key: 'logs-actions',
                className: 'flex items-center space-x-2 mt-2'
              }, [
                React.createElement('button', {
                  key: 'clear-logs-btn',
                  className: 'px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center space-x-2'
                }, [
                  React.createElement('i', { key: 'icon', 'data-lucide': 'square', className: 'w-4 h-4' }),
                  React.createElement('span', { key: 'text' }, 'Clear')
                ]),
                React.createElement('button', {
                  key: 'download-logs-btn',
                  className: 'px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2'
                }, [
                  React.createElement('i', { key: 'icon', 'data-lucide': 'download', className: 'w-4 h-4' }),
                  React.createElement('span', { key: 'text' }, 'Download')
                ])
              ])
            ]),
            React.createElement('div', {
              key: 'logs-content',
              className: 'flex-1 overflow-y-auto p-4 font-mono text-sm'
            }, [
              React.createElement('div', {
                key: 'logs-list',
                className: 'space-y-1'
              }, logs.map((log, index) => 
                React.createElement('div', {
                  key: index,
                  className: `flex items-start space-x-2 ${
                    log.level === 'ERROR' ? 'text-red-600' : 
                    log.level === 'WARNING' ? 'text-yellow-600' : 
                    'text-gray-700'
                  }`
                }, [
                  React.createElement('span', {
                    key: 'timestamp',
                    className: 'text-gray-500'
                  }, `[${log.timestamp}]`),
                  React.createElement('span', {
                    key: 'level',
                    className: 'font-semibold'
                  }, log.level),
                  React.createElement('span', {
                    key: 'message',
                    className: 'flex-1'
                  }, log.message)
                ])
              ))
            ])
          ])
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

// Add default export
export default ProfessionalTestingPlatform;

if (typeof window !== 'undefined') {
  window.ProfessionalTestingPlatform = ProfessionalTestingPlatform;
}
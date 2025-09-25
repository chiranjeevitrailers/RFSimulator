// Professional Testing Platform - QXDM/Keysight-like Interface
import React from 'react';

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
      { timestamp: '2024-01-18 00:40:16', level: 'INFO', message: 'Loading component configurations' },
      { timestamp: '2024-01-18 00:40:17', level: 'INFO', message: 'Preparing test environment' }
    ]);
    const [testCases, setTestCases] = React.useState([]);
    const [loadingTestCases, setLoadingTestCases] = React.useState(true);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [selectedCategory, setSelectedCategory] = React.useState('all');

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
        },
        {
          id: 'other',
          name: 'Other Test Suites',
          expanded: false,
          children: Object.entries(categories)
            .filter(([cat]) => !['5G_NR', '4G_LTE', 'CORE_NETWORK'].includes(cat))
            .map(([cat, count]) => ({ id: cat.toLowerCase(), name: cat, count }))
        }
      ];
    };

    const testSuites = getTestSuites();

    // Filter test cases based on search and category
    const filteredTestCases = testCases.filter(tc => {
      const matchesSearch = tc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           tc.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || tc.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    const addLog = (level, message) => {
      const timestamp = new Date().toLocaleString();
      setLogs(prev => [...prev, { timestamp, level, message }]);
    };

    // Fetch test cases from Supabase
    const fetchTestCases = async () => {
      try {
        setLoadingTestCases(true);
        addLog('INFO', 'Loading test cases from database...');
        
        const response = await fetch('/api/test-cases/simple');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const responseData = await response.json();
        console.log('API Response:', responseData);
        
        const testCases = responseData.data?.testCases || responseData || [];
        console.log('Test Cases Array:', testCases);
        
        if (!Array.isArray(testCases)) {
          throw new Error(`Expected array but got: ${typeof testCases}`);
        }
        
        const formattedTestCases = testCases.map(tc => ({
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
        
        // Fallback to sample test cases
        setTestCases([
          {
            id: 'tc-001',
            name: 'Attach',
            component: 'eNodeB',
            status: 'Not Started',
            iterations: 'Never',
            successRate: 'N/A',
            lastRun: 'N/A',
            duration: '',
            priority: 'Medium',
            selected: false
          }
        ]);
      } finally {
        setLoadingTestCases(false);
      }
    };

    const handleRunTest = async (testId) => {
      setIsRunning(true);
      addLog('INFO', `Starting test execution: ${testId}`);
      
      try {
        // Call the test execution API
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
        
        // Send data to 5GLabX Platform via custom event
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

    // Load test cases on component mount
    React.useEffect(() => {
      fetchTestCases();
    }, []);

    const getStatusColor = (status) => {
      switch (status) {
        case 'Completed': return 'bg-green-100 text-green-800';
        case 'Running': return 'bg-blue-100 text-blue-800';
        case 'Failed': return 'bg-red-100 text-red-800';
        case 'Not Started': return 'bg-gray-100 text-gray-800';
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

    return React.createElement('div', {
      className: 'h-screen flex bg-gray-50',
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

      // Main Content Area
      React.createElement('div', {
        key: 'main',
        className: 'flex-1 flex flex-col'
      }, [
        // Test Cases Management Section
        React.createElement('div', {
          key: 'test-cases',
          className: 'bg-white border-b border-gray-200 p-4'
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

          // Search and Filter Controls
          React.createElement('div', {
            key: 'search-filters',
            className: 'mb-4 p-4 bg-gray-50 rounded-lg'
          }, [
            React.createElement('div', {
              key: 'search-row',
              className: 'flex gap-4 items-center'
            }, [
              React.createElement('div', {
                key: 'search',
                className: 'flex-1'
              }, [
                React.createElement('label', {
                  key: 'search-label',
                  className: 'block text-sm font-medium text-gray-700 mb-1'
                }, 'Search Test Cases'),
                React.createElement('input', {
                  key: 'search-input',
                  type: 'text',
                  placeholder: 'Search by name or description...',
                  value: searchTerm,
                  onChange: (e) => setSearchTerm(e.target.value),
                  className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                })
              ]),
              React.createElement('div', {
                key: 'category',
                className: 'flex-1'
              }, [
                React.createElement('label', {
                  key: 'category-label',
                  className: 'block text-sm font-medium text-gray-700 mb-1'
                }, 'Filter by Category'),
                React.createElement('select', {
                  key: 'category-select',
                  value: selectedCategory,
                  onChange: (e) => setSelectedCategory(e.target.value),
                  className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                }, [
                  React.createElement('option', { key: 'all', value: 'all' }, 'All Categories'),
                  ...Object.keys(testCases.reduce((acc, tc) => {
                    acc[tc.category || 'Other'] = true;
                    return acc;
                  }, {})).map(cat => 
                    React.createElement('option', { key: cat, value: cat }, cat)
                  )
                ])
              ]),
              React.createElement('div', {
                key: 'stats',
                className: 'text-sm text-gray-600'
              }, [
                React.createElement('div', { key: 'total' }, `Total: ${testCases.length}`),
                React.createElement('div', { key: 'filtered' }, `Showing: ${filteredTestCases.length}`)
              ])
            ])
          ]),

          // Loading Indicator
          loadingTestCases && React.createElement('div', {
            key: 'loading',
            className: 'text-center py-8'
          }, [
            React.createElement('div', {
              key: 'spinner',
              className: 'inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'
            }),
            React.createElement('p', {
              key: 'loading-text',
              className: 'mt-2 text-gray-600'
            }, 'Loading test cases from database...')
          ]),

          // Test Cases Table
          !loadingTestCases && React.createElement('div', {
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
                  React.createElement('th', { key: 'select', className: 'px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase' }, ''),
                  React.createElement('th', { key: 'name', className: 'px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase' }, 'Name'),
                  React.createElement('th', { key: 'component', className: 'px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase' }, 'Component'),
                  React.createElement('th', { key: 'status', className: 'px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase' }, 'Status'),
                  React.createElement('th', { key: 'iterations', className: 'px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase' }, 'Iterations'),
                  React.createElement('th', { key: 'success', className: 'px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase' }, 'Success Rate'),
                  React.createElement('th', { key: 'last-run', className: 'px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase' }, 'Last Run'),
                  React.createElement('th', { key: 'duration', className: 'px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase' }, 'Duration'),
                  React.createElement('th', { key: 'priority', className: 'px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase' }, 'Priority'),
                  React.createElement('th', { key: 'actions', className: 'px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase' }, 'Actions')
                ])
              ]),
              React.createElement('tbody', {
                key: 'body',
                className: 'bg-white divide-y divide-gray-200'
              }, filteredTestCases.map(testCase => 
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
                    className: 'px-4 py-2 text-sm text-gray-500'
                  }, testCase.priority),
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

        // Automation Log Section
        React.createElement('div', {
          key: 'logs',
          className: 'flex-1 bg-white p-4'
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

          // Log Display
          React.createElement('div', {
            key: 'log-display',
            className: 'bg-black text-white p-4 rounded font-mono text-sm h-64 overflow-y-auto'
          }, logs.map((log, index) => 
            React.createElement('div', {
              key: index,
              className: 'flex items-start space-x-2 mb-1'
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
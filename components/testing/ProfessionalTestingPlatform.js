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
    const [filteredTestCases, setFilteredTestCases] = React.useState([]);
    const [logs, setLogs] = React.useState([
      { timestamp: '2024-01-18 00:40:15', level: 'INFO', message: 'Initializing RAN-Core Test Manager' },
      { timestamp: '2024-01-18 00:40:16', level: 'INFO', message: 'Loading component configurations' },
      { timestamp: '2024-01-18 00:40:17', level: 'INFO', message: 'Preparing test environment' }
    ]);
    const [testCases, setTestCases] = React.useState([]);

    // RAN Components
    const ranComponents = [
      { id: 'enodeb', name: 'eNodeB', status: 'active', color: 'green' },
      { id: 'gnodeb', name: 'gNodeB', status: 'active', color: 'green' },
      { id: 'core', name: 'Core Network', status: 'active', color: 'green' }
    ];

    // Test Suites Categories - Dynamic based on loaded test cases from Supabase
    const getTestSuites = () => {
      // Helper function to categorize test cases
      const categorizeTestCase = (testCase) => {
        const category = testCase.category?.toUpperCase() || '';
        const name = testCase.name?.toUpperCase() || '';
        const description = testCase.description?.toUpperCase() || '';
        
        // Check for 5G NR
        if (category.includes('5G') || category.includes('NR') || 
            name.includes('5G') || name.includes('NR') ||
            description.includes('5G') || description.includes('NR')) {
          return '5G_NR';
        }
        
        // Check for 4G LTE
        if (category.includes('4G') || category.includes('LTE') || 
            name.includes('4G') || name.includes('LTE') ||
            description.includes('4G') || description.includes('LTE')) {
          return '4G_LTE';
        }
        
        // Check for Core Network
        if (category.includes('CORE') || category.includes('AMF') || category.includes('SMF') || 
            category.includes('UPF') || category.includes('AUSF') || category.includes('UDM') ||
            name.includes('CORE') || name.includes('AMF') || name.includes('SMF') ||
            description.includes('CORE') || description.includes('AMF') || description.includes('SMF')) {
          return 'CORE_NETWORK';
        }
        
        // Check for Call Flows
        if (category.includes('CALL') || category.includes('FLOW') || category.includes('SIP') || 
            category.includes('IMS') || category.includes('VOICE') || category.includes('VIDEO') ||
            category.includes('VOLTE') || category.includes('VONR') ||
            name.includes('CALL') || name.includes('FLOW') || name.includes('SIP') ||
            name.includes('IMS') || name.includes('VOICE') || name.includes('VIDEO') ||
            description.includes('CALL') || description.includes('FLOW') || description.includes('SIP')) {
          return 'CALL_FLOWS';
        }
        
        return 'OTHER';
      };

      // Helper function to get subcategory
      const getSubcategory = (testCase, mainCategory) => {
        const category = testCase.category?.toUpperCase() || '';
        const name = testCase.name?.toUpperCase() || '';
        const description = testCase.description?.toUpperCase() || '';
        
        if (mainCategory === '5G_NR' || mainCategory === '4G_LTE') {
          // Check for Functional
          if (category.includes('FUNCTIONAL') || name.includes('FUNCTIONAL') || 
              description.includes('FUNCTIONAL') || category.includes('ATTACH') ||
              category.includes('CONNECTIVITY') || name.includes('ATTACH') ||
              name.includes('CONNECTIVITY')) {
            return 'FUNCTIONAL';
          }
          
          // Check for Performance
          if (category.includes('PERFORMANCE') || name.includes('PERFORMANCE') || 
              description.includes('PERFORMANCE') || category.includes('THROUGHPUT') ||
              category.includes('LATENCY') || name.includes('THROUGHPUT') ||
              name.includes('LATENCY')) {
            return 'PERFORMANCE';
          }
          
          // Check for Mobility
          if (category.includes('MOBILITY') || name.includes('MOBILITY') || 
              description.includes('MOBILITY') || category.includes('HANDOVER') ||
              category.includes('HANDOFF') || name.includes('HANDOVER') ||
              name.includes('HANDOFF')) {
            return 'MOBILITY';
          }
          
          // Check for RF
          if (category.includes('RF') || name.includes('RF') || 
              description.includes('RF') || category.includes('RADIO') ||
              category.includes('BEAM') || name.includes('RADIO') ||
              name.includes('BEAM')) {
            return 'RF';
          }
          
          // Default to Functional if no specific match
          return 'FUNCTIONAL';
        }
        
        return 'GENERAL';
      };

      // Group test cases by main category and subcategory
      const categorizedTestCases = {
        '5G_NR': { FUNCTIONAL: [], PERFORMANCE: [], MOBILITY: [], RF: [] },
        '4G_LTE': { FUNCTIONAL: [], PERFORMANCE: [], MOBILITY: [], RF: [] },
        'CORE_NETWORK': { GENERAL: [] },
        'CALL_FLOWS': { GENERAL: [] },
        'OTHER': { GENERAL: [] }
      };

      // Categorize all test cases
      testCases.forEach(testCase => {
        const mainCategory = categorizeTestCase(testCase);
        const subcategory = getSubcategory(testCase, mainCategory);
        
        if (categorizedTestCases[mainCategory] && categorizedTestCases[mainCategory][subcategory]) {
          categorizedTestCases[mainCategory][subcategory].push(testCase);
        } else if (categorizedTestCases[mainCategory]) {
          categorizedTestCases[mainCategory].GENERAL = categorizedTestCases[mainCategory].GENERAL || [];
          categorizedTestCases[mainCategory].GENERAL.push(testCase);
        }
      });

      // Build test suites structure
      const testSuites = [];

      // 5G NR Test Suite
      if (categorizedTestCases['5G_NR'].FUNCTIONAL.length > 0 || 
          categorizedTestCases['5G_NR'].PERFORMANCE.length > 0 || 
          categorizedTestCases['5G_NR'].MOBILITY.length > 0 || 
          categorizedTestCases['5G_NR'].RF.length > 0) {
        testSuites.push({
          id: '5g-nr',
          name: '5G NR',
          expanded: true,
          children: [
            {
              id: '5g-functional',
              name: 'Functional',
              count: categorizedTestCases['5G_NR'].FUNCTIONAL.length,
              testCases: categorizedTestCases['5G_NR'].FUNCTIONAL
            },
            {
              id: '5g-performance',
              name: 'Performance',
              count: categorizedTestCases['5G_NR'].PERFORMANCE.length,
              testCases: categorizedTestCases['5G_NR'].PERFORMANCE
            },
            {
              id: '5g-mobility',
              name: 'Mobility',
              count: categorizedTestCases['5G_NR'].MOBILITY.length,
              testCases: categorizedTestCases['5G_NR'].MOBILITY
            },
            {
              id: '5g-rf',
              name: 'RF',
              count: categorizedTestCases['5G_NR'].RF.length,
              testCases: categorizedTestCases['5G_NR'].RF
            }
          ]
        });
      }

      // 4G LTE Test Suite
      if (categorizedTestCases['4G_LTE'].FUNCTIONAL.length > 0 || 
          categorizedTestCases['4G_LTE'].PERFORMANCE.length > 0 || 
          categorizedTestCases['4G_LTE'].MOBILITY.length > 0 || 
          categorizedTestCases['4G_LTE'].RF.length > 0) {
        testSuites.push({
          id: '4g-lte',
          name: '4G LTE',
          expanded: true,
          children: [
            {
              id: '4g-functional',
              name: 'Functional',
              count: categorizedTestCases['4G_LTE'].FUNCTIONAL.length,
              testCases: categorizedTestCases['4G_LTE'].FUNCTIONAL
            },
            {
              id: '4g-performance',
              name: 'Performance',
              count: categorizedTestCases['4G_LTE'].PERFORMANCE.length,
              testCases: categorizedTestCases['4G_LTE'].PERFORMANCE
            },
            {
              id: '4g-mobility',
              name: 'Mobility',
              count: categorizedTestCases['4G_LTE'].MOBILITY.length,
              testCases: categorizedTestCases['4G_LTE'].MOBILITY
            },
            {
              id: '4g-rf',
              name: 'RF',
              count: categorizedTestCases['4G_LTE'].RF.length,
              testCases: categorizedTestCases['4G_LTE'].RF
            }
          ]
        });
      }

      // Core Network Test Suite
      if (categorizedTestCases['CORE_NETWORK'].GENERAL.length > 0) {
        testSuites.push({
          id: 'core-network',
          name: 'Core Network',
          expanded: false,
          children: [
            {
              id: 'core-general',
              name: 'Core Network',
              count: categorizedTestCases['CORE_NETWORK'].GENERAL.length,
              testCases: categorizedTestCases['CORE_NETWORK'].GENERAL
            }
          ]
        });
      }

      // Call Flows Test Suite
      if (categorizedTestCases['CALL_FLOWS'].GENERAL.length > 0) {
        testSuites.push({
          id: 'call-flows',
          name: 'Call Flows',
          expanded: true,
          children: [
            {
              id: 'call-flows-general',
              name: 'Call Flows',
              count: categorizedTestCases['CALL_FLOWS'].GENERAL.length,
              testCases: categorizedTestCases['CALL_FLOWS'].GENERAL
            }
          ]
        });
      }

      // Other Test Suite (only if there are uncategorized test cases)
      if (categorizedTestCases['OTHER'].GENERAL.length > 0) {
        testSuites.push({
          id: 'other',
          name: 'Other',
          expanded: false,
          children: [
            {
              id: 'other-general',
              name: 'Other',
              count: categorizedTestCases['OTHER'].GENERAL.length,
              testCases: categorizedTestCases['OTHER'].GENERAL
            }
          ]
        });
      }

      return testSuites;
    };

    const testSuites = getTestSuites();

    const addLog = (level, message) => {
      const timestamp = new Date().toLocaleString();
      setLogs(prev => [...prev, { timestamp, level, message }]);
    };

    // Load test cases from database (Supabase)
    const fetchTestCases = async () => {
      try {
        addLog('INFO', 'Loading test cases from Supabase database...');
        
        const response = await fetch('/api/test-cases/simple');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const responseData = await response.json();
        const testCasesData = responseData.data?.testCases || responseData || [];
        
        if (!Array.isArray(testCasesData)) {
          throw new Error(`Expected array but got: ${typeof testCasesData}`);
        }
        
        if (testCasesData.length === 0) {
          addLog('WARNING', 'No test cases found in database');
          setTestCases([]);
          return;
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
        setFilteredTestCases(formattedTestCases); // Initialize filtered test cases
        addLog('INFO', `Successfully loaded ${formattedTestCases.length} test cases from Supabase`);
        
      } catch (error) {
        addLog('ERROR', `Failed to load test cases from Supabase: ${error.message}`);
        console.error('Error loading test cases:', error);
        setTestCases([]);
        setFilteredTestCases([]);
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
      const newSelectedSuite = selectedTestSuite === suiteId ? null : suiteId;
      setSelectedTestSuite(newSelectedSuite);
      
      // Filter test cases based on selected test suite
      if (newSelectedSuite) {
        const testSuites = getTestSuites();
        const selectedSuite = testSuites.find(suite => suite.id === newSelectedSuite);
        if (selectedSuite) {
          const allTestCases = selectedSuite.children.flatMap(child => child.testCases);
          setFilteredTestCases(allTestCases);
        }
      } else {
        setFilteredTestCases(testCases);
      }
    };

    // Function to get test cases for display
    const getDisplayTestCases = () => {
      return filteredTestCases.length > 0 ? filteredTestCases : testCases;
    };

    // Function to handle test suite child selection
    const handleTestSuiteChildClick = (child) => {
      if (child.testCases && child.testCases.length > 0) {
        setFilteredTestCases(child.testCases);
        addLog('INFO', `Filtered to ${child.name}: ${child.testCases.length} test cases`);
      } else {
        addLog('INFO', `No test cases available in ${child.name}`);
      }
    };

    // Function to show all test cases
    const showAllTestCases = () => {
      setFilteredTestCases(testCases);
      setSelectedTestSuite(null);
      addLog('INFO', `Showing all ${testCases.length} test cases`);
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
        // Left Sidebar - RAN Components and Test Suites
        React.createElement('div', {
          key: 'sidebar',
          className: 'w-80 bg-white border-r border-gray-200 flex flex-col'
        }, [
          // RAN Components Section
          React.createElement('div', {
            key: 'ran-components',
            className: 'p-4 border-b border-gray-200'
          }, [
            React.createElement('h3', {
              key: 'ran-components-title',
              className: 'text-lg font-semibold text-gray-900 mb-3'
            }, 'RAN Components'),
            React.createElement('div', {
              key: 'ran-components-list',
              className: 'space-y-2'
            }, ranComponents.map(component => 
              React.createElement('div', {
                key: component.id,
                className: 'flex items-center justify-between p-2 hover:bg-gray-50 rounded'
              }, [
                React.createElement('span', {
                  key: 'component-name',
                  className: 'text-sm font-medium text-gray-700'
                }, component.name),
                React.createElement('div', {
                  key: 'component-actions',
                  className: 'flex items-center space-x-1'
                }, [
                  React.createElement('button', {
                    key: 'play-btn',
                    className: 'p-1 text-green-600 hover:text-green-700'
                  }, React.createElement('i', { 'data-lucide': 'play', className: 'w-3 h-3' })),
                  React.createElement('button', {
                    key: 'stop-btn',
                    className: 'p-1 text-red-600 hover:text-red-700'
                  }, React.createElement('i', { 'data-lucide': 'square', className: 'w-3 h-3' })),
                  React.createElement('button', {
                    key: 'settings-btn',
                    className: 'p-1 text-gray-600 hover:text-gray-700'
                  }, React.createElement('i', { 'data-lucide': 'settings', className: 'w-3 h-3' }))
                ])
              ])
            ))
          ]),

          // Test Suites Section
          React.createElement('div', {
            key: 'test-suites-section',
            className: 'flex-1 p-4'
          }, [
            React.createElement('div', {
              key: 'test-suites-header',
              className: 'flex items-center justify-between mb-3'
            }, [
              React.createElement('h3', {
                key: 'test-suites-title',
                className: 'text-lg font-semibold text-gray-900'
              }, 'Test Suites'),
              React.createElement('div', {
                key: 'test-suites-actions',
                className: 'flex items-center space-x-2'
              }, [
                React.createElement('button', {
                  key: 'show-all-btn',
                  className: 'px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700',
                  onClick: showAllTestCases
                }, 'Show All'),
                React.createElement('button', {
                  key: 'add-test-suite-btn',
                  className: 'px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700'
                }, '+ Add Test Suite')
              ])
            ]),
            React.createElement('div', {
              key: 'test-suites-content',
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
                    className: 'space-y-1'
                  }, [
                    React.createElement('div', {
                      key: 'child-header',
                      className: 'p-2 hover:bg-gray-50 rounded cursor-pointer',
                      onClick: () => handleTestSuiteChildClick(child)
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
                    ]),
                    // Show test cases under each child if they exist
                    child.testCases && child.testCases.length > 0 && React.createElement('div', {
                      key: 'child-test-cases',
                      className: 'ml-4 space-y-1'
                    }, child.testCases.map(testCase => 
                      React.createElement('div', {
                        key: testCase.id,
                        className: 'p-1 text-xs text-gray-600 hover:bg-gray-100 rounded cursor-pointer',
                        onClick: () => {
                          setFilteredTestCases([testCase]);
                          addLog('INFO', `Selected test case: ${testCase.name}`);
                        }
                      }, [
                        React.createElement('div', {
                          key: 'test-case-info',
                          className: 'flex items-center justify-between'
                        }, [
                          React.createElement('span', {
                            key: 'test-case-name',
                            className: 'truncate'
                          }, testCase.name),
                          React.createElement('span', {
                            key: 'test-case-status',
                            className: `text-xs px-1 py-0.5 rounded ${
                              testCase.status === 'Completed' ? 'bg-green-100 text-green-800' :
                              testCase.status === 'Running' ? 'bg-blue-100 text-blue-800' :
                              testCase.status === 'Failed' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`
                          }, testCase.status)
                        ])
                      ])
                    ))
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
          // Test Cases Management
          React.createElement('div', {
            key: 'test-cases-management',
            className: 'flex-1 p-6'
          }, [
            React.createElement('div', {
              key: 'test-cases-header',
              className: 'flex items-center justify-between mb-4'
            }, [
              React.createElement('h2', {
                key: 'test-cases-title',
                className: 'text-xl font-semibold text-gray-900'
              }, 'Test Cases Management'),
              React.createElement('div', {
                key: 'test-cases-actions',
                className: 'flex items-center space-x-2'
              }, [
                React.createElement('button', {
                  key: 'add-test-case-btn',
                  className: 'px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2'
                }, [
                  React.createElement('i', { key: 'icon', 'data-lucide': 'plus', className: 'w-4 h-4' }),
                  React.createElement('span', { key: 'text' }, '+ Add Test Case')
                ]),
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
                  key: 'delete-selected-btn',
                  className: 'px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'
                }, [
                  React.createElement('i', { key: 'icon', 'data-lucide': 'trash-2', className: 'w-4 h-4' }),
                  React.createElement('span', { key: 'text' }, 'Delete Selected')
                ])
              ])
            ]),
            
            // Test Cases Table
            React.createElement('div', {
              key: 'test-cases-table',
              className: 'bg-white border border-gray-200 rounded-lg overflow-hidden'
            }, [
              // Table Header
              React.createElement('div', {
                key: 'table-header',
                className: 'bg-gray-50 border-b border-gray-200 px-6 py-3'
              }, [
                React.createElement('div', {
                  key: 'table-header-row',
                  className: 'grid grid-cols-9 gap-4 text-sm font-medium text-gray-700'
                }, [
                  React.createElement('div', { key: 'col-name' }, 'Name'),
                  React.createElement('div', { key: 'col-component' }, 'Component'),
                  React.createElement('div', { key: 'col-status' }, 'Status'),
                  React.createElement('div', { key: 'col-iterations' }, 'Iterations'),
                  React.createElement('div', { key: 'col-success-rate' }, 'Success Rate'),
                  React.createElement('div', { key: 'col-last-run' }, 'Last Run'),
                  React.createElement('div', { key: 'col-duration' }, 'Duration'),
                  React.createElement('div', { key: 'col-priority' }, 'Priority'),
                  React.createElement('div', { key: 'col-actions' }, 'Actions')
                ])
              ]),
              
              // Table Body
              React.createElement('div', {
                key: 'table-body',
                className: 'divide-y divide-gray-200'
              }, getDisplayTestCases().length > 0 ? getDisplayTestCases().map(testCase => 
                React.createElement('div', {
                  key: testCase.id,
                  className: 'px-6 py-4 hover:bg-gray-50'
                }, [
                  React.createElement('div', {
                    key: 'table-row',
                    className: 'grid grid-cols-9 gap-4 items-center'
                  }, [
                    React.createElement('div', {
                      key: 'col-name',
                      className: 'flex items-center space-x-2'
                    }, [
                      React.createElement('input', {
                        key: 'checkbox',
                        type: 'checkbox',
                        checked: testCase.selected,
                        onChange: () => toggleTestSelection(testCase.id),
                        className: 'w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                      }),
                      React.createElement('span', {
                        key: 'name',
                        className: 'text-sm font-medium text-gray-900'
                      }, testCase.name)
                    ]),
                    React.createElement('div', {
                      key: 'col-component',
                      className: 'text-sm text-gray-700'
                    }, testCase.component),
                    React.createElement('div', {
                      key: 'col-status',
                      className: 'text-sm text-gray-700'
                    }, testCase.status),
                    React.createElement('div', {
                      key: 'col-iterations',
                      className: 'text-sm text-gray-700'
                    }, testCase.iterations),
                    React.createElement('div', {
                      key: 'col-success-rate',
                      className: 'text-sm text-gray-700'
                    }, testCase.successRate),
                    React.createElement('div', {
                      key: 'col-last-run',
                      className: 'text-sm text-gray-700'
                    }, testCase.lastRun),
                    React.createElement('div', {
                      key: 'col-duration',
                      className: 'flex items-center space-x-2'
                    }, [
                      React.createElement('button', {
                        key: 'play-btn',
                        className: 'p-1 text-blue-600 hover:text-blue-700',
                        onClick: () => handleRunTest(testCase.id)
                      }, React.createElement('i', { 'data-lucide': 'play', className: 'w-4 h-4' })),
                      React.createElement('button', {
                        key: 'view-btn',
                        className: 'p-1 text-gray-600 hover:text-gray-700'
                      }, React.createElement('i', { 'data-lucide': 'eye', className: 'w-4 h-4' }))
                    ]),
                    React.createElement('div', {
                      key: 'col-priority',
                      className: 'text-sm text-gray-700'
                    }, testCase.priority),
                    React.createElement('div', {
                      key: 'col-actions',
                      className: 'text-sm text-gray-700'
                    }, '')
                  ])
                ])
              ) : [
                React.createElement('div', {
                  key: 'empty-state',
                  className: 'px-6 py-12 text-center'
                }, [
                  React.createElement('div', {
                    key: 'empty-icon',
                    className: 'w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'
                  }, React.createElement('i', { 'data-lucide': 'database', className: 'w-6 h-6 text-gray-400' })),
                  React.createElement('h3', {
                    key: 'empty-title',
                    className: 'text-lg font-medium text-gray-900 mb-2'
                  }, 'No Test Cases Found'),
                  React.createElement('p', {
                    key: 'empty-description',
                    className: 'text-sm text-gray-500 mb-4'
                  }, testCases.length === 0 ? 'Loading test cases from Supabase database...' : 'No test cases match the current filter.'),
                  testCases.length === 0 && React.createElement('button', {
                    key: 'refresh-btn',
                    className: 'px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700',
                    onClick: fetchTestCases
                  }, 'Refresh from Database')
                ])
              ])
            ])
          ]),

          // Automation Log
          React.createElement('div', {
            key: 'automation-log',
            className: 'h-64 bg-white border-t border-gray-200 flex flex-col'
          }, [
            React.createElement('div', {
              key: 'log-header',
              className: 'p-4 border-b border-gray-200'
            }, [
              React.createElement('h2', {
                key: 'log-title',
                className: 'text-lg font-semibold text-gray-900'
              }, 'Automation Log')
            ]),
            React.createElement('div', {
              key: 'log-content',
              className: 'flex-1 overflow-y-auto p-4 font-mono text-sm bg-gray-900 text-green-400'
            }, [
              React.createElement('div', {
                key: 'log-list',
                className: 'space-y-1'
              }, logs.map((log, index) => 
                React.createElement('div', {
                  key: index,
                  className: `flex items-start space-x-2 ${
                    log.level === 'ERROR' ? 'text-red-400' : 
                    log.level === 'WARNING' ? 'text-yellow-400' : 
                    'text-green-400'
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
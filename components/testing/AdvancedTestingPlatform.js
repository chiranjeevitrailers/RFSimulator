// Advanced Testing Platform - Enhanced QXDM/Keysight-like Interface
function AdvancedTestingPlatform({ appState, onStateChange }) {
  try {
    React.useEffect(() => {
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }, []);

    const [selectedTests, setSelectedTests] = React.useState([]);
    const [isRunning, setIsRunning] = React.useState(false);
    const [logs, setLogs] = React.useState([
      { timestamp: '7:47:37 PM', level: 'ERROR', message: 'Error loading component paths: Unexpected token "<","' }
    ]);
    const [testCases, setTestCases] = React.useState(() => {
      // Initialize with test cases from configuration
      const configTests = window.TestingPlatformConfig?.getAllTestCases() || [];
      return configTests.map(test => ({
        ...test,
        status: 'Pending',
        iterations: { total: 0, passed: 0, failed: 0, skipped: 0 },
        successRate: 0,
        lastRun: 'Never',
        duration: '-',
        selected: false
      }));
    });

    const addLog = (level, message) => {
      const timestamp = new Date().toLocaleTimeString();
      setLogs(prev => [...prev, { timestamp, level, message }]);
    };

    const handleRunTest = (testId) => {
      setIsRunning(true);
      addLog('INFO', `Starting test execution: ${testId}`);
      
      // Update test status
      setTestCases(prev => prev.map(tc => 
        tc.id === testId ? { ...tc, status: 'Running' } : tc
      ));
      
      // Simulate test execution
      setTimeout(() => {
        setIsRunning(false);
        addLog('INFO', `Test execution completed: ${testId}`);
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
      }, 3000);
    };

    const handleRunSelected = () => {
      const selectedTestIds = testCases.filter(tc => tc.selected).map(tc => tc.id);
      if (selectedTestIds.length === 0) return;
      
      setIsRunning(true);
      addLog('INFO', `Starting batch execution of ${selectedTestIds.length} tests`);
      
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

    const toggleAllSelection = () => {
      const allSelected = testCases.every(tc => tc.selected);
      setTestCases(prev => prev.map(tc => ({ ...tc, selected: !allSelected })));
    };

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
      'data-name': 'advanced-testing-platform'
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
              'data-lucide': 'test-tube',
              className: 'w-8 h-8 text-blue-600'
            }),
            React.createElement('div', {
              key: 'title'
            }, [
              React.createElement('h1', {
                key: 'main',
                className: 'text-2xl font-bold text-gray-900'
              }, 'Professional Testing Platform'),
              React.createElement('p', {
                key: 'sub',
                className: 'text-sm text-gray-600'
              }, 'Advanced 5G/4G Protocol Testing Suite')
            ])
          ]),
          React.createElement('div', {
            key: 'right',
            className: 'flex items-center space-x-3'
          }, [
            React.createElement('div', {
              key: 'status',
              className: 'flex items-center space-x-2'
            }, [
              React.createElement('div', {
                key: 'indicator',
                className: 'w-3 h-3 bg-green-500 rounded-full'
              }),
              React.createElement('span', {
                key: 'text',
                className: 'text-sm text-gray-600'
              }, 'Platform Online')
            ]),
            React.createElement('button', {
              key: 'settings',
              className: 'p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded'
            }, React.createElement('i', { 'data-lucide': 'settings', className: 'w-5 h-5' }))
          ])
        ])
      ]),

      // Main Content
      React.createElement('div', {
        key: 'main',
        className: 'flex-1 flex flex-col'
      }, [
        // Test Cases Section
        React.createElement('div', {
          key: 'test-cases',
          className: 'flex-1 bg-white border-b border-gray-200 p-6'
        }, [
          React.createElement('div', {
            key: 'header',
            className: 'flex items-center justify-between mb-6'
          }, [
            React.createElement('h2', {
              key: 'title',
              className: 'text-xl font-semibold text-gray-900'
            }, 'Test Cases'),
            React.createElement('div', {
              key: 'actions',
              className: 'flex items-center space-x-3'
            }, [
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

        // Automation Logs Section
        React.createElement('div', {
          key: 'logs',
          className: 'bg-white p-6'
        }, [
          React.createElement('div', {
            key: 'header',
            className: 'flex items-center justify-between mb-4'
          }, [
            React.createElement('h2', {
              key: 'title',
              className: 'text-xl font-semibold text-gray-900'
            }, 'Automation Logs'),
            React.createElement('div', {
              key: 'actions',
              className: 'flex items-center space-x-3'
            }, [
              React.createElement('button', {
                key: 'clear',
                className: 'bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 flex items-center space-x-2'
              }, [
                React.createElement('i', { key: 'icon', 'data-lucide': 'square', className: 'w-4 h-4' }),
                React.createElement('span', { key: 'text' }, 'Clear')
              ]),
              React.createElement('button', {
                key: 'download',
                className: 'bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center space-x-2'
              }, [
                React.createElement('i', { key: 'icon', 'data-lucide': 'download', className: 'w-4 h-4' }),
                React.createElement('span', { key: 'text' }, 'Download')
              ])
            ])
          ]),

          // Log Display
          React.createElement('div', {
            key: 'log-display',
            className: 'bg-black text-white p-4 rounded-lg font-mono text-sm h-48 overflow-y-auto'
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
        ])
      ])
    ]);

  } catch (error) {
    console.error('AdvancedTestingPlatform error:', error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'Advanced Testing Platform failed to load');
  }
}

window.AdvancedTestingPlatform = AdvancedTestingPlatform;
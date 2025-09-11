// Enhanced RRCStats Component with srsRAN-based RRC analysis
function RRCStats({ logs, stats }) {
  try {
    const rrcLogs = logs.filter(log =>
      log.protocol === 'RRC' || log.component === 'RRC' ||
      log.message?.includes('RRC') || log.message?.includes('rrc') ||
      log.message?.includes('connection') || log.message?.includes('handover') ||
      log.message?.includes('measurement') || log.message?.includes('reconfiguration')
    );

    const [selectedTab, setSelectedTab] = React.useState('overview');
    const [timeRange, setTimeRange] = React.useState('5m');

    const rrcStats = React.useMemo(() => {
      let connectionSetups = 0;
      let connectionSetupCompletes = 0;
      let connectionReleases = 0;
      let connectionRejects = 0;
      let reconfigurations = 0;
      let reconfigurationCompletes = 0;
      let measurementReports = 0;
      let handovers = 0;
      let handoverCommands = 0;
      let handoverCompletes = 0;
      let securityModeCommands = 0;
      let securityModeCompletes = 0;
      let ueCapabilityEnquiries = 0;
      let ueCapabilityInformations = 0;
      let systemInformationBlocks = 0;
      let pagingMessages = 0;
      let rrcConnectionReestablishmentRequests = 0;
      let rrcConnectionReestablishmentRejects = 0;

      let totalProcessingTime = 0;
      let messageCount = 0;
      const ueStats = new Map();
      const procedureLatencies = new Map();
      const timeSeriesData = [];

      // Time-based analysis
      const now = Date.now();
      const timeWindow = timeRange === '1m' ? 60000 : timeRange === '5m' ? 300000 : 900000;
      const startTime = now - timeWindow;

      rrcLogs.forEach(log => {
        const logTime = new Date(log.timestamp || log.time).getTime();
        if (logTime < startTime) return;

        const msg = log.message || '';
        messageCount++;

        // RRC Connection Management
        if (msg.includes('RRCConnectionSetup') || msg.includes('connection setup')) connectionSetups++;
        if (msg.includes('RRCConnectionSetupComplete') || msg.includes('setup complete')) connectionSetupCompletes++;
        if (msg.includes('RRCConnectionRelease') || msg.includes('connection release')) connectionReleases++;
        if (msg.includes('RRCConnectionReject') || msg.includes('connection reject')) connectionRejects++;

        // RRC Connection Reconfiguration
        if (msg.includes('RRCConnectionReconfiguration') || msg.includes('reconfiguration')) reconfigurations++;
        if (msg.includes('RRCConnectionReconfigurationComplete') || msg.includes('reconfiguration complete')) reconfigurationCompletes++;

        // Measurement Reports
        if (msg.includes('MeasurementReport') || msg.includes('measurement report')) measurementReports++;

        // Handover Procedures
        if (msg.includes('HandoverCommand') || msg.includes('handover command')) handoverCommands++;
        if (msg.includes('HandoverComplete') || msg.includes('handover complete')) handoverCompletes++;
        if (msg.includes('handover') && !msg.includes('command') && !msg.includes('complete')) handovers++;

        // Security Procedures
        if (msg.includes('SecurityModeCommand') || msg.includes('security mode command')) securityModeCommands++;
        if (msg.includes('SecurityModeComplete') || msg.includes('security mode complete')) securityModeCompletes++;

        // UE Capability Procedures
        if (msg.includes('UECapabilityEnquiry') || msg.includes('capability enquiry')) ueCapabilityEnquiries++;
        if (msg.includes('UECapabilityInformation') || msg.includes('capability information')) ueCapabilityInformations++;

        // System Information
        if (msg.includes('SystemInformationBlock') || msg.includes('SIB')) systemInformationBlocks++;
        if (msg.includes('Paging') || msg.includes('paging')) pagingMessages++;

        // Reestablishment
        if (msg.includes('RRCConnectionReestablishmentRequest') || msg.includes('reestablishment request')) rrcConnectionReestablishmentRequests++;
        if (msg.includes('RRCConnectionReestablishmentReject') || msg.includes('reestablishment reject')) rrcConnectionReestablishmentRejects++;

        // Processing time extraction
        const timeMatch = msg.match(/time[=:]?\s*(\d+(?:\.\d+)?)\s*(ms|us|μs)/i);
        if (timeMatch) {
          const time = parseFloat(timeMatch[1]);
          const unit = timeMatch[2].toLowerCase();
          const timeMs = unit === 'us' ? time / 1000 : time;
          totalProcessingTime += timeMs;
        }

        // UE-specific tracking
        const ueMatch = msg.match(/UE[=:]?\s*(\w+)/i) || msg.match(/rnti[=:]?\s*(\w+)/i);
        if (ueMatch) {
          const ueId = ueMatch[1];
          if (!ueStats.has(ueId)) {
            ueStats.set(ueId, {
              setups: 0, releases: 0, reconfigurations: 0,
              handovers: 0, measurementReports: 0, totalMessages: 0
            });
          }
          const ueStat = ueStats.get(ueId);
          ueStat.totalMessages++;

          if (msg.includes('setup')) ueStat.setups++;
          if (msg.includes('release')) ueStat.releases++;
          if (msg.includes('reconfiguration')) ueStat.reconfigurations++;
          if (msg.includes('handover')) ueStat.handovers++;
          if (msg.includes('measurement')) ueStat.measurementReports++;
        }

        // Time series data
        timeSeriesData.push({
          timestamp: logTime,
          procedure: msg.includes('setup') ? 'Setup' :
                    msg.includes('reconfiguration') ? 'Reconfig' :
                    msg.includes('handover') ? 'Handover' :
                    msg.includes('measurement') ? 'Measurement' : 'Other',
          success: !msg.includes('reject') && !msg.includes('failure') && !msg.includes('error')
        });
      });

      // Calculate advanced metrics
      const totalProcedures = connectionSetups + reconfigurations + handovers + measurementReports;
      const successfulProcedures = connectionSetupCompletes + reconfigurationCompletes + handoverCompletes;
      const procedureSuccessRate = totalProcedures > 0 ? ((successfulProcedures / totalProcedures) * 100).toFixed(1) : '100';

      const connectionSuccessRate = connectionSetups > 0 ?
        ((connectionSetupCompletes / connectionSetups) * 100).toFixed(1) : '100';

      const handoverSuccessRate = handoverCommands > 0 ?
        ((handoverCompletes / handoverCommands) * 100).toFixed(1) : '100';

      const avgProcessingTime = messageCount > 0 ? (totalProcessingTime / messageCount).toFixed(2) : '0';

      const securitySetupRate = securityModeCommands > 0 ?
        ((securityModeCompletes / securityModeCommands) * 100).toFixed(1) : '100';

      return {
        // Basic counters
        connectionSetups,
        connectionSetupCompletes,
        connectionReleases,
        connectionRejects,
        reconfigurations,
        reconfigurationCompletes,
        measurementReports,
        handovers,
        handoverCommands,
        handoverCompletes,
        securityModeCommands,
        securityModeCompletes,
        ueCapabilityEnquiries,
        ueCapabilityInformations,
        systemInformationBlocks,
        pagingMessages,
        rrcConnectionReestablishmentRequests,
        rrcConnectionReestablishmentRejects,

        // Success rates
        procedureSuccessRate,
        connectionSuccessRate,
        handoverSuccessRate,
        securitySetupRate,

        // Performance metrics
        avgProcessingTime,
        totalProcessingTime,
        messageCount,

        // Advanced analytics
        ueStats: Array.from(ueStats.entries()).map(([ueId, stats]) => ({ ueId, ...stats })),
        timeSeriesData: timeSeriesData.slice(-100),

        // Failure analysis
        connectionFailures: connectionRejects + rrcConnectionReestablishmentRejects,
        handoverFailures: handoverCommands - handoverCompletes,
        reconfigurationFailures: reconfigurations - reconfigurationCompletes,

        // System load indicators
        pagingLoad: pagingMessages,
        sibBroadcasts: systemInformationBlocks,
        reestablishmentAttempts: rrcConnectionReestablishmentRequests
      };
    }, [rrcLogs, timeRange]);
    
    return React.createElement('div', {
      className: 'p-6 space-y-6',
      'data-name': 'rrc-stats',
      'data-file': 'components/layers/RRCStats.js'
    }, [
      // Header with controls
      React.createElement('div', {
        key: 'header',
        className: 'flex items-center justify-between'
      }, [
        React.createElement('h1', {
          key: 'title',
          className: 'text-2xl font-bold text-gray-900 flex items-center'
        }, [
          React.createElement('i', {
            key: 'icon',
            'data-lucide': 'settings',
            className: 'w-6 h-6 text-red-600 mr-3'
          }),
          'Enhanced RRC Layer Analysis'
        ]),
        React.createElement('div', {
          key: 'controls',
          className: 'flex items-center gap-4'
        }, [
          React.createElement('select', {
            key: 'time-range',
            value: timeRange,
            onChange: (e) => setTimeRange(e.target.value),
            className: 'px-3 py-1 border rounded-md text-sm'
          }, [
            React.createElement('option', { key: '1m', value: '1m' }, 'Last 1 min'),
            React.createElement('option', { key: '5m', value: '5m' }, 'Last 5 min'),
            React.createElement('option', { key: '15m', value: '15m' }, 'Last 15 min')
          ]),
          React.createElement('span', {
            key: 'count',
            className: 'text-sm text-gray-600'
          }, `${rrcStats.messageCount} messages`)
        ])
      ]),

      // Tab Navigation
      React.createElement('div', {
        key: 'tabs',
        className: 'flex space-x-1 bg-gray-100 p-1 rounded-lg'
      }, [
        React.createElement('button', {
          key: 'overview',
          onClick: () => setSelectedTab('overview'),
          className: `px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            selectedTab === 'overview' ? 'bg-white text-gray-900 shadow' : 'text-gray-600 hover:text-gray-900'
          }`
        }, 'Overview'),
        React.createElement('button', {
          key: 'procedures',
          onClick: () => setSelectedTab('procedures'),
          className: `px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            selectedTab === 'procedures' ? 'bg-white text-gray-900 shadow' : 'text-gray-600 hover:text-gray-900'
          }`
        }, 'Procedures'),
        React.createElement('button', {
          key: 'mobility',
          onClick: () => setSelectedTab('mobility'),
          className: `px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            selectedTab === 'mobility' ? 'bg-white text-gray-900 shadow' : 'text-gray-600 hover:text-gray-900'
          }`
        }, 'Mobility'),
        React.createElement('button', {
          key: 'performance',
          onClick: () => setSelectedTab('performance'),
          className: `px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            selectedTab === 'performance' ? 'bg-white text-gray-900 shadow' : 'text-gray-600 hover:text-gray-900'
          }`
        }, 'Performance')
      ]),

      // Tab Content
      selectedTab === 'overview' && React.createElement('div', {
        key: 'overview-content',
        className: 'space-y-6'
      }, [
        // Key Metrics Grid
        React.createElement('div', {
          key: 'metrics-grid',
          className: 'grid grid-cols-2 md:grid-cols-4 gap-6'
        }, [
          React.createElement('div', {
            key: 'connection-success',
            className: 'bg-white rounded-lg shadow p-6'
          }, [
            React.createElement('div', {
              key: 'content',
              className: 'flex items-center justify-between'
            }, [
              React.createElement('div', { key: 'data' }, [
                React.createElement('p', {
                  key: 'label',
                  className: 'text-sm font-medium text-gray-600'
                }, 'Connection Success'),
                React.createElement('p', {
                  key: 'value',
                  className: 'text-2xl font-bold text-green-600'
                }, `${rrcStats.connectionSuccessRate}%`)
              ]),
              React.createElement('i', {
                key: 'icon',
                'data-lucide': 'link',
                className: 'w-6 h-6 text-green-600'
              })
            ])
          ]),
          React.createElement('div', {
            key: 'handover-success',
            className: 'bg-white rounded-lg shadow p-6'
          }, [
            React.createElement('div', {
              key: 'content',
              className: 'flex items-center justify-between'
            }, [
              React.createElement('div', { key: 'data' }, [
                React.createElement('p', {
                  key: 'label',
                  className: 'text-sm font-medium text-gray-600'
                }, 'Handover Success'),
                React.createElement('p', {
                  key: 'value',
                  className: 'text-2xl font-bold text-blue-600'
                }, `${rrcStats.handoverSuccessRate}%`)
              ]),
              React.createElement('i', {
                key: 'icon',
                'data-lucide': 'repeat',
                className: 'w-6 h-6 text-blue-600'
              })
            ])
          ]),
          React.createElement('div', {
            key: 'security-success',
            className: 'bg-white rounded-lg shadow p-6'
          }, [
            React.createElement('div', {
              key: 'content',
              className: 'flex items-center justify-between'
            }, [
              React.createElement('div', { key: 'data' }, [
                React.createElement('p', {
                  key: 'label',
                  className: 'text-sm font-medium text-gray-600'
                }, 'Security Setup'),
                React.createElement('p', {
                  key: 'value',
                  className: 'text-2xl font-bold text-purple-600'
                }, `${rrcStats.securitySetupRate}%`)
              ]),
              React.createElement('i', {
                key: 'icon',
                'data-lucide': 'shield',
                className: 'w-6 h-6 text-purple-600'
              })
            ])
          ]),
          React.createElement('div', {
            key: 'processing-time',
            className: 'bg-white rounded-lg shadow p-6'
          }, [
            React.createElement('div', {
              key: 'content',
              className: 'flex items-center justify-between'
            }, [
              React.createElement('div', { key: 'data' }, [
                React.createElement('p', {
                  key: 'label',
                  className: 'text-sm font-medium text-gray-600'
                }, 'Avg Processing'),
                React.createElement('p', {
                  key: 'value',
                  className: 'text-2xl font-bold text-orange-600'
                }, `${rrcStats.avgProcessingTime}ms`)
              ]),
              React.createElement('i', {
                key: 'icon',
                'data-lucide': 'clock',
                className: 'w-6 h-6 text-orange-600'
              })
            ])
          ])
        ]),

        // System Load Indicators
        React.createElement('div', {
          key: 'system-load',
          className: 'grid grid-cols-1 md:grid-cols-3 gap-6'
        }, [
          React.createElement('div', {
            key: 'paging-load',
            className: 'bg-white rounded-lg shadow p-6'
          }, [
            React.createElement('h3', {
              key: 'title',
              className: 'text-lg font-medium text-gray-900 mb-4'
            }, 'Paging Load'),
            React.createElement('div', {
              key: 'value',
              className: 'text-3xl font-bold text-indigo-600 mb-2'
            }, rrcStats.pagingLoad || 0),
            React.createElement('p', {
              key: 'description',
              className: 'text-sm text-gray-600'
            }, 'Active paging messages')
          ]),
          React.createElement('div', {
            key: 'sib-broadcasts',
            className: 'bg-white rounded-lg shadow p-6'
          }, [
            React.createElement('h3', {
              key: 'title',
              className: 'text-lg font-medium text-gray-900 mb-4'
            }, 'SIB Broadcasts'),
            React.createElement('div', {
              key: 'value',
              className: 'text-3xl font-bold text-teal-600 mb-2'
            }, rrcStats.sibBroadcasts || 0),
            React.createElement('p', {
              key: 'description',
              className: 'text-sm text-gray-600'
            }, 'System information blocks')
          ]),
          React.createElement('div', {
            key: 'reestablishment',
            className: 'bg-white rounded-lg shadow p-6'
          }, [
            React.createElement('h3', {
              key: 'title',
              className: 'text-lg font-medium text-gray-900 mb-4'
            }, 'Reestablishment'),
            React.createElement('div', {
              key: 'value',
              className: 'text-3xl font-bold text-red-600 mb-2'
            }, rrcStats.reestablishmentAttempts || 0),
            React.createElement('p', {
              key: 'description',
              className: 'text-sm text-gray-600'
            }, 'Connection recovery attempts')
          ])
        ])
      ]),

      // Procedures Tab
      selectedTab === 'procedures' && React.createElement('div', {
        key: 'procedures-content',
        className: 'space-y-6'
      }, [
        React.createElement('div', {
          key: 'procedure-stats',
          className: 'grid grid-cols-2 md:grid-cols-4 gap-6'
        }, [
          React.createElement('div', {
            key: 'setups',
            className: 'bg-white rounded-lg shadow p-6'
          }, [
            React.createElement('div', { key: 'data' }, [
              React.createElement('p', {
                key: 'label',
                className: 'text-sm font-medium text-gray-600'
              }, 'Connection Setups'),
              React.createElement('p', {
                key: 'value',
                className: 'text-2xl font-bold text-green-600'
              }, rrcStats.connectionSetups || 0),
              React.createElement('p', {
                key: 'complete',
                className: 'text-xs text-gray-500'
              }, `${rrcStats.connectionSetupCompletes || 0} completed`)
            ])
          ]),
          React.createElement('div', {
            key: 'reconfigs',
            className: 'bg-white rounded-lg shadow p-6'
          }, [
            React.createElement('div', { key: 'data' }, [
              React.createElement('p', {
                key: 'label',
                className: 'text-sm font-medium text-gray-600'
              }, 'Reconfigurations'),
              React.createElement('p', {
                key: 'value',
                className: 'text-2xl font-bold text-blue-600'
              }, rrcStats.reconfigurations || 0),
              React.createElement('p', {
                key: 'complete',
                className: 'text-xs text-gray-500'
              }, `${rrcStats.reconfigurationCompletes || 0} completed`)
            ])
          ]),
          React.createElement('div', {
            key: 'measurements',
            className: 'bg-white rounded-lg shadow p-6'
          }, [
            React.createElement('div', { key: 'data' }, [
              React.createElement('p', {
                key: 'label',
                className: 'text-sm font-medium text-gray-600'
              }, 'Measurement Reports'),
              React.createElement('p', {
                key: 'value',
                className: 'text-2xl font-bold text-purple-600'
              }, rrcStats.measurementReports || 0),
              React.createElement('p', {
                key: 'complete',
                className: 'text-xs text-gray-500'
              }, 'Radio measurements')
            ])
          ]),
          React.createElement('div', {
            key: 'security',
            className: 'bg-white rounded-lg shadow p-6'
          }, [
            React.createElement('div', { key: 'data' }, [
              React.createElement('p', {
                key: 'label',
                className: 'text-sm font-medium text-gray-600'
              }, 'Security Commands'),
              React.createElement('p', {
                key: 'value',
                className: 'text-2xl font-bold text-indigo-600'
              }, rrcStats.securityModeCommands || 0),
              React.createElement('p', {
                key: 'complete',
                className: 'text-xs text-gray-500'
              }, `${rrcStats.securityModeCompletes || 0} completed`)
            ])
          ])
        ]),

        React.createElement('div', {
          key: 'procedure-details',
          className: 'bg-white rounded-lg shadow p-6'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-lg font-medium text-gray-900 mb-4'
          }, 'RRC Procedure Details'),
          React.createElement('div', {
            key: 'procedure-grid',
            className: 'grid grid-cols-1 md:grid-cols-2 gap-6'
          }, [
            React.createElement('div', {
              key: 'connection-procedures',
              className: 'space-y-3'
            }, [
              React.createElement('h4', {
                key: 'title',
                className: 'font-medium text-gray-900'
              }, 'Connection Management'),
              React.createElement('div', {
                key: 'stats',
                className: 'space-y-2 text-sm'
              }, [
                React.createElement('div', {
                  key: 'releases',
                  className: 'flex justify-between'
                }, [
                  React.createElement('span', { key: 'label' }, 'Releases:'),
                  React.createElement('span', {
                    key: 'value',
                    className: 'font-medium'
                  }, rrcStats.connectionReleases || 0)
                ]),
                React.createElement('div', {
                  key: 'rejects',
                  className: 'flex justify-between'
                }, [
                  React.createElement('span', { key: 'label' }, 'Rejects:'),
                  React.createElement('span', {
                    key: 'value',
                    className: 'font-medium text-red-600'
                  }, rrcStats.connectionRejects || 0)
                ]),
                React.createElement('div', {
                  key: 'reestablishment',
                  className: 'flex justify-between'
                }, [
                  React.createElement('span', { key: 'label' }, 'Reestablishment:'),
                  React.createElement('span', {
                    key: 'value',
                    className: 'font-medium'
                  }, rrcStats.rrcConnectionReestablishmentRequests || 0)
                ])
              ])
            ]),
            React.createElement('div', {
              key: 'system-procedures',
              className: 'space-y-3'
            }, [
              React.createElement('h4', {
                key: 'title',
                className: 'font-medium text-gray-900'
              }, 'System Procedures'),
              React.createElement('div', {
                key: 'stats',
                className: 'space-y-2 text-sm'
              }, [
                React.createElement('div', {
                  key: 'paging',
                  className: 'flex justify-between'
                }, [
                  React.createElement('span', { key: 'label' }, 'Paging Messages:'),
                  React.createElement('span', {
                    key: 'value',
                    className: 'font-medium'
                  }, rrcStats.pagingMessages || 0)
                ]),
                React.createElement('div', {
                  key: 'sib',
                  className: 'flex justify-between'
                }, [
                  React.createElement('span', { key: 'label' }, 'SIB Broadcasts:'),
                  React.createElement('span', {
                    key: 'value',
                    className: 'font-medium'
                  }, rrcStats.systemInformationBlocks || 0)
                ]),
                React.createElement('div', {
                  key: 'capability',
                  className: 'flex justify-between'
                }, [
                  React.createElement('span', { key: 'label' }, 'UE Capabilities:'),
                  React.createElement('span', {
                    key: 'value',
                    className: 'font-medium'
                  }, rrcStats.ueCapabilityEnquiries || 0)
                ])
              ])
            ])
          ])
        ])
      ]),

      // Mobility Tab
      selectedTab === 'mobility' && React.createElement('div', {
        key: 'mobility-content',
        className: 'space-y-6'
      }, [
        React.createElement('div', {
          key: 'handover-stats',
          className: 'grid grid-cols-1 md:grid-cols-3 gap-6'
        }, [
          React.createElement('div', {
            key: 'handover-commands',
            className: 'bg-white rounded-lg shadow p-6'
          }, [
            React.createElement('h3', {
              key: 'title',
              className: 'text-lg font-medium text-gray-900 mb-4'
            }, 'Handover Commands'),
            React.createElement('div', {
              key: 'value',
              className: 'text-3xl font-bold text-blue-600 mb-2'
            }, rrcStats.handoverCommands || 0),
            React.createElement('p', {
              key: 'description',
              className: 'text-sm text-gray-600'
            }, 'Handover initiation messages')
          ]),
          React.createElement('div', {
            key: 'handover-completes',
            className: 'bg-white rounded-lg shadow p-6'
          }, [
            React.createElement('h3', {
              key: 'title',
              className: 'text-lg font-medium text-gray-900 mb-4'
            }, 'Handover Completes'),
            React.createElement('div', {
              key: 'value',
              className: 'text-3xl font-bold text-green-600 mb-2'
            }, rrcStats.handoverCompletes || 0),
            React.createElement('p', {
              key: 'description',
              className: 'text-sm text-gray-600'
            }, 'Successful handover completions')
          ]),
          React.createElement('div', {
            key: 'handover-failures',
            className: 'bg-white rounded-lg shadow p-6'
          }, [
            React.createElement('h3', {
              key: 'title',
              className: 'text-lg font-medium text-gray-900 mb-4'
            }, 'Handover Failures'),
            React.createElement('div', {
              key: 'value',
              className: 'text-3xl font-bold text-red-600 mb-2'
            }, rrcStats.handoverFailures || 0),
            React.createElement('p', {
              key: 'description',
              className: 'text-sm text-gray-600'
            }, 'Failed handover attempts')
          ])
        ]),

        React.createElement('div', {
          key: 'ue-mobility',
          className: 'bg-white rounded-lg shadow p-6'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-lg font-medium text-gray-900 mb-4'
          }, 'UE-Specific Mobility Statistics'),
          React.createElement('div', {
            key: 'ue-list',
            className: 'space-y-3'
          }, rrcStats.ueStats.slice(0, 8).map((ue, index) =>
            React.createElement('div', {
              key: `ue-${index}`,
              className: 'flex items-center justify-between p-3 bg-gray-50 rounded-lg'
            }, [
              React.createElement('div', {
                key: 'ue-info',
                className: 'flex items-center gap-3'
              }, [
                React.createElement('div', {
                  key: 'ue-avatar',
                  className: 'w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'
                }, [
                  React.createElement('span', {
                    key: 'ue-id',
                    className: 'text-xs font-medium text-blue-600'
                  }, ue.ueId.substring(0, 4))
                ]),
                React.createElement('div', { key: 'ue-details' }, [
                  React.createElement('p', {
                    key: 'ue-id-full',
                    className: 'font-medium text-gray-900'
                  }, `UE ${ue.ueId}`),
                  React.createElement('p', {
                    key: 'total-messages',
                    className: 'text-sm text-gray-600'
                  }, `${ue.totalMessages} RRC messages`)
                ])
              ]),
              React.createElement('div', {
                key: 'ue-mobility-stats',
                className: 'grid grid-cols-3 gap-4 text-sm'
              }, [
                React.createElement('div', {
                  key: 'setups',
                  className: 'text-center'
                }, [
                  React.createElement('p', {
                    key: 'value',
                    className: 'font-medium text-green-600'
                  }, ue.setups),
                  React.createElement('p', {
                    key: 'label',
                    className: 'text-gray-600'
                  }, 'Setups')
                ]),
                React.createElement('div', {
                  key: 'handovers',
                  className: 'text-center'
                }, [
                  React.createElement('p', {
                    key: 'value',
                    className: 'font-medium text-blue-600'
                  }, ue.handovers),
                  React.createElement('p', {
                    key: 'label',
                    className: 'text-gray-600'
                  }, 'Handovers')
                ]),
                React.createElement('div', {
                  key: 'measurements',
                  className: 'text-center'
                }, [
                  React.createElement('p', {
                    key: 'value',
                    className: 'font-medium text-purple-600'
                  }, ue.measurementReports),
                  React.createElement('p', {
                    key: 'label',
                    className: 'text-gray-600'
                  }, 'Measurements')
                ])
              ])
            ])
          ))
        ])
      ]),

      // Performance Tab
      selectedTab === 'performance' && React.createElement('div', {
        key: 'performance-content',
        className: 'space-y-6'
      }, [
        React.createElement('div', {
          key: 'performance-overview',
          className: 'grid grid-cols-1 md:grid-cols-2 gap-6'
        }, [
          React.createElement('div', {
            key: 'success-rates',
            className: 'bg-white rounded-lg shadow p-6'
          }, [
            React.createElement('h3', {
              key: 'title',
              className: 'text-lg font-medium text-gray-900 mb-4'
            }, 'RRC Success Rates'),
            React.createElement('div', {
              key: 'rates',
              className: 'space-y-4'
            }, [
              React.createElement('div', {
                key: 'connection-rate',
                className: 'flex items-center justify-between'
              }, [
                React.createElement('span', {
                  key: 'label',
                  className: 'text-sm font-medium'
                }, 'Connection Setup'),
                React.createElement('div', {
                  key: 'rate',
                  className: 'flex items-center gap-2'
                }, [
                  React.createElement('span', {
                    key: 'value',
                    className: 'text-lg font-bold text-green-600'
                  }, `${rrcStats.connectionSuccessRate}%`),
                  React.createElement('div', {
                    key: 'bar',
                    className: 'w-20 bg-gray-200 rounded-full h-2'
                  }, [
                    React.createElement('div', {
                      key: 'fill',
                      className: 'bg-green-600 h-2 rounded-full',
                      style: { width: `${rrcStats.connectionSuccessRate}%` }
                    })
                  ])
                ])
              ]),
              React.createElement('div', {
                key: 'handover-rate',
                className: 'flex items-center justify-between'
              }, [
                React.createElement('span', {
                  key: 'label',
                  className: 'text-sm font-medium'
                }, 'Handover Success'),
                React.createElement('div', {
                  key: 'rate',
                  className: 'flex items-center gap-2'
                }, [
                  React.createElement('span', {
                    key: 'value',
                    className: 'text-lg font-bold text-blue-600'
                  }, `${rrcStats.handoverSuccessRate}%`),
                  React.createElement('div', {
                    key: 'bar',
                    className: 'w-20 bg-gray-200 rounded-full h-2'
                  }, [
                    React.createElement('div', {
                      key: 'fill',
                      className: 'bg-blue-600 h-2 rounded-full',
                      style: { width: `${rrcStats.handoverSuccessRate}%` }
                    })
                  ])
                ])
              ]),
              React.createElement('div', {
                key: 'security-rate',
                className: 'flex items-center justify-between'
              }, [
                React.createElement('span', {
                  key: 'label',
                  className: 'text-sm font-medium'
                }, 'Security Setup'),
                React.createElement('div', {
                  key: 'rate',
                  className: 'flex items-center gap-2'
                }, [
                  React.createElement('span', {
                    key: 'value',
                    className: 'text-lg font-bold text-purple-600'
                  }, `${rrcStats.securitySetupRate}%`),
                  React.createElement('div', {
                    key: 'bar',
                    className: 'w-20 bg-gray-200 rounded-full h-2'
                  }, [
                    React.createElement('div', {
                      key: 'fill',
                      className: 'bg-purple-600 h-2 rounded-full',
                      style: { width: `${rrcStats.securitySetupRate}%` }
                    })
                  ])
                ])
              ])
            ])
          ]),
          React.createElement('div', {
            key: 'failure-analysis',
            className: 'bg-white rounded-lg shadow p-6'
          }, [
            React.createElement('h3', {
              key: 'title',
              className: 'text-lg font-medium text-gray-900 mb-4'
            }, 'Failure Analysis'),
            React.createElement('div', {
              key: 'failures',
              className: 'space-y-3'
            }, [
              React.createElement('div', {
                key: 'connection-failures',
                className: 'flex justify-between items-center'
              }, [
                React.createElement('span', {
                  key: 'label',
                  className: 'text-sm'
                }, 'Connection Failures'),
                React.createElement('span', {
                  key: 'value',
                  className: 'font-medium text-red-600'
                }, rrcStats.connectionFailures || 0)
              ]),
              React.createElement('div', {
                key: 'handover-failures',
                className: 'flex justify-between items-center'
              }, [
                React.createElement('span', {
                  key: 'label',
                  className: 'text-sm'
                }, 'Handover Failures'),
                React.createElement('span', {
                  key: 'value',
                  className: 'font-medium text-red-600'
                }, rrcStats.handoverFailures || 0)
              ]),
              React.createElement('div', {
                key: 'reconfig-failures',
                className: 'flex justify-between items-center'
              }, [
                React.createElement('span', {
                  key: 'label',
                  className: 'text-sm'
                }, 'Reconfiguration Failures'),
                React.createElement('span', {
                  key: 'value',
                  className: 'font-medium text-red-600'
                }, rrcStats.reconfigurationFailures || 0)
              ])
            ])
          ])
        ]),

        React.createElement('div', {
          key: 'processing-performance',
          className: 'bg-white rounded-lg shadow p-6'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-lg font-medium text-gray-900 mb-4'
          }, 'RRC Processing Performance'),
          React.createElement('div', {
            key: 'performance-grid',
            className: 'grid grid-cols-2 md:grid-cols-4 gap-4'
          }, [
            React.createElement('div', {
              key: 'avg-processing',
              className: 'text-center'
            }, [
              React.createElement('p', {
                key: 'value',
                className: 'text-2xl font-bold text-blue-600'
              }, `${rrcStats.avgProcessingTime}ms`),
              React.createElement('p', {
                key: 'label',
                className: 'text-sm text-gray-600'
              }, 'Avg Processing Time')
            ]),
            React.createElement('div', {
              key: 'total-processing',
              className: 'text-center'
            }, [
              React.createElement('p', {
                key: 'value',
                className: 'text-2xl font-bold text-green-600'
              }, `${(rrcStats.totalProcessingTime / 1000).toFixed(1)}s`),
              React.createElement('p', {
                key: 'label',
                className: 'text-sm text-gray-600'
              }, 'Total Processing Time')
            ]),
            React.createElement('div', {
              key: 'messages-processed',
              className: 'text-center'
            }, [
              React.createElement('p', {
                key: 'value',
                className: 'text-2xl font-bold text-purple-600'
              }, rrcStats.messageCount || 0),
              React.createElement('p', {
                key: 'label',
                className: 'text-sm text-gray-600'
              }, 'Messages Processed')
            ]),
            React.createElement('div', {
              key: 'procedures-completed',
              className: 'text-center'
            }, [
              React.createElement('p', {
                key: 'value',
                className: 'text-2xl font-bold text-orange-600'
              }, rrcStats.connectionSetupCompletes + rrcStats.reconfigurationCompletes + rrcStats.handoverCompletes || 0),
              React.createElement('p', {
                key: 'label',
                className: 'text-sm text-gray-600'
              }, 'Procedures Completed')
            ])
          ])
        ])
      ])
    ]);

  } catch (error) {
    console.error('RRCStats component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'RRCStats Error');
  }
}

// Export RRCStats component
window.RRCStats = RRCStats;

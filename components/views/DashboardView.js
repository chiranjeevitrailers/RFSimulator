// DashboardView - Enhanced dashboard with message analysis and KPI metrics
function DashboardView({ appState, onStateChange }) {
  try {
    const [analysisData, setAnalysisData] = React.useState(null);
    
    React.useEffect(() => {
      if (window.lucide?.createIcons) {
        window.lucide.createIcons();
      }

      // Simulate analyzed messages only if decoder exists
      if (!window.SrsranMessageDecoder || !window.MessageAnalyzer) return;

      const sampleMessages = [
        SrsranMessageDecoder.parseLogMessage('[PHY] [I] [931.6] PDSCH: rnti=0x4601 h_id=0 k1=4 prb=[0,87) symb=[1,14) mod=QPSK rv=0 tbs=309 t=135.5us'),
        SrsranMessageDecoder.parseLogMessage('[MAC] [I] [938.5] DL PDU: ue=0 rnti=0x4601 size=169: SDU: lcid=1 nof_sdus=1 total_size=55'),
        SrsranMessageDecoder.parseLogMessage('[RLC] [I] du=0 ue=0 SRB1 DL: TX PDU. dc=data p=1 si=full sn=0 pdu_len=53 grant_len=55'),
        SrsranMessageDecoder.parseLogMessage('[PHY] [E] [932.1] PUCCH decode failed: rnti=0x4601 format=1'),
        SrsranMessageDecoder.parseLogMessage('[SCHED] [W] [933.2] High scheduling latency detected: 250us')
      ];
      
      const analysis = window.MessageAnalyzer.analyzeMessages(sampleMessages);
      setAnalysisData(analysis);
    }, []);

    const stats = React.useMemo(() => {
      if (!analysisData) return { totalMessages: 0, errorRate: 0, avgThroughput: 0, successRate: 0 };
      
      return {
        totalMessages: analysisData.total || 0,
        errorRate: analysisData.kpis?.errorRate || '0',
        avgThroughput: analysisData.kpis?.avgThroughput || '0',
        successRate: analysisData.kpis?.successRate || '0'
      };
    }, [analysisData]);

    return React.createElement('div', {
      className: 'p-6 space-y-6',
      'data-name': 'dashboard-view', 
      'data-file': 'components/views/DashboardView.js'
    }, [
      React.createElement('h1', {
        key: 'title',
        className: 'text-2xl font-bold text-gray-900'
      }, '5GLabX Protocol Analyzer Dashboard'),

      React.createElement('div', {
        key: 'kpi-cards',
        className: 'grid grid-cols-1 md:grid-cols-4 gap-6'
      }, [
        React.createElement('div', {
          key: 'messages',
          className: 'bg-white p-6 rounded-lg border shadow-sm'
        }, [
          React.createElement('div', {
            key: 'header',
            className: 'flex items-center justify-between mb-2'
          }, [
            React.createElement('h3', {
              key: 'title',
              className: 'text-sm font-medium text-gray-500'
            }, 'Total Messages'),
            React.createElement('div', {
              key: 'icon',
              className: 'w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'
            }, [
              React.createElement('div', {
                key: 'icon-inner',
                className: 'icon-message-square text-sm text-blue-600'
              })
            ])
          ]),
          React.createElement('p', {
            key: 'value',
            className: 'text-3xl font-bold text-blue-600'
          }, stats.totalMessages)
        ]),
        
        React.createElement('div', {
          key: 'throughput',
          className: 'bg-white p-6 rounded-lg border shadow-sm'
        }, [
          React.createElement('div', {
            key: 'header',
            className: 'flex items-center justify-between mb-2'
          }, [
            React.createElement('h3', {
              key: 'title',
              className: 'text-sm font-medium text-gray-500'
            }, 'Avg Throughput'),
            React.createElement('div', {
              key: 'icon',
              className: 'w-8 h-8 bg-green-100 rounded-full flex items-center justify-center'
            }, [
              React.createElement('div', {
                key: 'icon-inner',
                className: 'icon-trending-up text-sm text-green-600'
              })
            ])
          ]),
          React.createElement('p', {
            key: 'value',
            className: 'text-3xl font-bold text-green-600'
          }, `${stats.avgThroughput} Kbps`)
        ]),
        
        React.createElement('div', {
          key: 'error-rate',
          className: 'bg-white p-6 rounded-lg border shadow-sm'
        }, [
          React.createElement('div', {
            key: 'header',
            className: 'flex items-center justify-between mb-2'
          }, [
            React.createElement('h3', {
              key: 'title',
              className: 'text-sm font-medium text-gray-500'
            }, 'Error Rate'),
            React.createElement('div', {
              key: 'icon',
              className: 'w-8 h-8 bg-red-100 rounded-full flex items-center justify-center'
            }, [
              React.createElement('div', {
                key: 'icon-inner',
                className: 'icon-alert-triangle text-sm text-red-600'
              })
            ])
          ]),
          React.createElement('p', {
            key: 'value',
            className: 'text-3xl font-bold text-red-600'
          }, `${stats.errorRate}%`)
        ]),
        
        React.createElement('div', {
          key: 'success-rate',
          className: 'bg-white p-6 rounded-lg border shadow-sm'
        }, [
          React.createElement('div', {
            key: 'header',
            className: 'flex items-center justify-between mb-2'
          }, [
            React.createElement('h3', {
              key: 'title',
              className: 'text-sm font-medium text-gray-500'
            }, 'Success Rate'),
            React.createElement('div', {
              key: 'icon',
              className: 'w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center'
            }, [
              React.createElement('div', {
                key: 'icon-inner',
                className: 'icon-check-circle text-sm text-purple-600'
              })
            ])
          ]),
          React.createElement('p', {
            key: 'value',
            className: 'text-3xl font-bold text-purple-600'
          }, `${stats.successRate}%`)
        ])
      ]),

      React.createElement('div', {
        key: 'analysis-grid',
        className: 'grid grid-cols-1 lg:grid-cols-2 gap-6'
      }, [
        React.createElement('div', {
          key: 'component-analysis',
          className: 'bg-white p-6 rounded-lg border'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-lg font-semibold mb-4'
          }, 'Message Distribution by Component'),
          analysisData?.byComponent && React.createElement('div', {
            key: 'components',
            className: 'space-y-3'
          }, Object.entries(analysisData.byComponent).map(([component, count]) =>
            React.createElement('div', {
              key: component,
              className: 'flex items-center justify-between'
            }, [
              React.createElement('span', {
                key: 'component',
                className: 'text-sm font-medium'
              }, component),
              React.createElement('span', {
                key: 'count',
                className: 'text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded'
              }, count)
            ])
          ))
        ]),

        React.createElement('div', {
          key: 'message-types',
          className: 'bg-white p-6 rounded-lg border'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-lg font-semibold mb-4'
          }, 'Message Types Analysis'),
          analysisData?.byType && React.createElement('div', {
            key: 'types',
            className: 'space-y-3'
          }, Object.entries(analysisData.byType).map(([type, count]) =>
            React.createElement('div', {
              key: type,
              className: 'flex items-center justify-between'
            }, [
              React.createElement('div', {
                key: 'type-info',
                className: 'flex items-center space-x-2'
              }, [
                React.createElement('div', {
                  key: 'indicator',
                  className: 'w-3 h-3 rounded-full',
                  style: { backgroundColor: (window.SrsranMessageDecoder?.getMessageTypeColor(type) || '#CBD5E1') }
                }),
                React.createElement('span', {
                  key: 'type',
                  className: 'text-sm font-medium'
                }, type)
              ]),
              React.createElement('span', {
                key: 'count',
                className: 'text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded'
              }, count)
            ])
          ))
        ])
      ])
    ]);

  } catch (error) {
    console.error('DashboardView error:', error);
    return React.createElement('div', { 
      className: 'text-red-600 p-4' 
    }, 'Dashboard failed to load');
  }
}

DashboardView.defaultProps = {
  appState: {},
  onStateChange: () => {}
};

window.DashboardView = DashboardView;
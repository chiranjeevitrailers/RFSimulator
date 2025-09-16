// NBIoTCallFlowView Component - NB-IoT call flow analysis
function NBIoTCallFlowView({ appState, onStateChange }) {
  try {
    React.useEffect(() => {
      if (window.lucide?.createIcons) {
        window.lucide.createIcons();
      }
    }, []);

    const [callFlows, setCallFlows] = React.useState([]);
    const [selectedFlow, setSelectedFlow] = React.useState(null);

    React.useEffect(() => {
      const generateCallFlows = () => {
        try {
          const flows = [
            {
              id: 1,
              procedure: 'Random Access',
              status: 'completed',
              duration: 245,
              steps: ['NPRACH Preamble', 'RAR', 'Msg3', 'Contention Resolution']
            },
            {
              id: 2,
              procedure: 'RRC Connection',
              status: 'ongoing',
              duration: 180,
              steps: ['RRC Request', 'RRC Setup', 'RRC Complete']
            },
            {
              id: 3,
              procedure: 'Data Transfer',
              status: 'completed',
              duration: 320,
              steps: ['UL Grant', 'Data TX', 'HARQ ACK']
            }
          ];
          setCallFlows(flows);
        } catch (error) {
          console.error('NBIoTCallFlowView generate flows error:', error);
        }
      };

      generateCallFlows();
      const interval = setInterval(generateCallFlows, 10000);
      return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status) => {
      switch (status) {
        case 'completed': return 'bg-green-100 text-green-700';
        case 'ongoing': return 'bg-blue-100 text-blue-700';
        case 'failed': return 'bg-red-100 text-red-700';
        default: return 'bg-gray-100 text-gray-700';
      }
    };

    return React.createElement('div', {
      className: 'p-6 space-y-6',
      'data-name': 'nbiot-callflow-view',
      'data-file': 'components/views/NBIoTCallFlowView.js'
    }, [
      React.createElement('div', {
        key: 'header',
        className: 'flex items-center justify-between'
      }, [
        React.createElement('h1', {
          key: 'title',
          className: 'text-2xl font-bold text-gray-900'
        }, 'NB-IoT Call Flow Analysis'),
        React.createElement('button', {
          key: 'refresh',
          className: 'px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
        }, [
          React.createElement('i', {
            key: 'icon',
            'data-lucide': 'refresh-cw',
            className: 'w-4 h-4 mr-2 inline'
          }),
          'Refresh'
        ])
      ]),

      React.createElement('div', {
        key: 'content',
        className: 'grid grid-cols-1 lg:grid-cols-2 gap-6'
      }, [
        React.createElement('div', {
          key: 'flows-list',
          className: 'bg-white rounded-lg border border-gray-200'
        }, [
          React.createElement('div', {
            key: 'header',
            className: 'p-4 border-b border-gray-200'
          }, React.createElement('h2', {
            className: 'text-lg font-semibold text-gray-900'
          }, 'Recent Procedures')),
          React.createElement('div', {
            key: 'list',
            className: 'divide-y divide-gray-200'
          }, callFlows.map(flow =>
            React.createElement('div', {
              key: flow.id,
              className: 'p-4 hover:bg-gray-50 cursor-pointer',
              onClick: () => setSelectedFlow(flow)
            }, [
              React.createElement('div', {
                key: 'header',
                className: 'flex items-center justify-between mb-2'
              }, [
                React.createElement('span', {
                  key: 'procedure',
                  className: 'font-medium text-gray-900'
                }, flow.procedure),
                React.createElement('span', {
                  key: 'status',
                  className: `px-2 py-1 rounded text-xs font-medium ${getStatusColor(flow.status)}`
                }, flow.status.toUpperCase())
              ]),
              React.createElement('div', {
                key: 'duration',
                className: 'text-sm text-gray-600'
              }, `Duration: ${flow.duration}ms`)
            ])
          ))
        ]),

        React.createElement('div', {
          key: 'flow-details',
          className: 'bg-white rounded-lg border border-gray-200'
        }, [
          React.createElement('div', {
            key: 'header',
            className: 'p-4 border-b border-gray-200'
          }, React.createElement('h2', {
            className: 'text-lg font-semibold text-gray-900'
          }, selectedFlow ? `${selectedFlow.procedure} Details` : 'Select a Procedure')),
          React.createElement('div', {
            key: 'content',
            className: 'p-4'
          }, selectedFlow ? React.createElement('div', {
            className: 'space-y-3'
          }, selectedFlow.steps.map((step, index) =>
            React.createElement('div', {
              key: index,
              className: 'flex items-center space-x-3'
            }, [
              React.createElement('div', {
                key: 'number',
                className: 'w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-medium'
              }, index + 1),
              React.createElement('span', {
                key: 'step',
                className: 'text-gray-900'
              }, step)
            ])
          )) : React.createElement('div', {
            className: 'text-center py-8 text-gray-500'
          }, 'Select a procedure to view details'))
        ])
      ])
    ]);

  } catch (error) {
    console.error('NBIoTCallFlowView component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'NB-IoT Call Flow Error');
  }
}

NBIoTCallFlowView.defaultProps = {
  appState: {},
  onStateChange: () => {}
};

window.NBIoTCallFlowView = NBIoTCallFlowView;

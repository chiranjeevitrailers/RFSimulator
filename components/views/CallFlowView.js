// CallFlowView - Professional protocol sequence analysis
function CallFlowView() {
  try {
    const [callFlows, setCallFlows] = React.useState([]);
    const [selectedFlow, setSelectedFlow] = React.useState(null);

    React.useEffect(() => {
      if (window.lucide?.createIcons) {
        window.lucide.createIcons();
      }
      
      // Sample call flows for demonstration
      const sampleFlows = [
        {
          id: 1,
          type: 'UE Registration',
          status: 'success',
          duration: 250,
          messageCount: 8,
          ue: '0x4601',
          timestamp: new Date().toISOString(),
          messages: [
            { step: 1, from: 'UE', to: 'gNB', message: 'RRC Setup Request', time: '10:30:01.100' },
            { step: 2, from: 'gNB', to: 'UE', message: 'RRC Setup', time: '10:30:01.150' },
            { step: 3, from: 'UE', to: 'gNB', message: 'RRC Setup Complete', time: '10:30:01.200' },
            { step: 4, from: 'gNB', to: 'AMF', message: 'Initial UE Message', time: '10:30:01.250' }
          ]
        },
        {
          id: 2,
          type: 'PDU Session Establishment',
          status: 'failed',
          duration: 1200,
          messageCount: 12,
          ue: '0x4602',
          timestamp: new Date(Date.now() - 60000).toISOString(),
          messages: [
            { step: 1, from: 'UE', to: 'AMF', message: 'PDU Session Establishment Request', time: '10:29:01.100' },
            { step: 2, from: 'AMF', to: 'SMF', message: 'Nsmf_PDUSession_CreateSMContext', time: '10:29:01.200' },
            { step: 3, from: 'SMF', to: 'AMF', message: 'Error: Session Creation Failed', time: '10:29:02.300' }
          ]
        }
      ];
      
      setCallFlows(sampleFlows);
    }, []);

    return React.createElement('div', {
      className: 'p-6 space-y-4',
      'data-name': 'call-flow-view',
      'data-file': 'components/views/CallFlowView.js'
    }, [
      React.createElement('div', {
        key: 'header',
        className: 'flex items-center justify-between'
      }, [
        React.createElement('h1', {
          key: 'title',
          className: 'text-2xl font-bold text-gray-900'
        }, 'Call Flow Analysis'),
        React.createElement('div', {
          key: 'badge',
          className: 'px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm'
        }, `${callFlows.length} flows`)
      ]),

      React.createElement('div', {
        key: 'flows-grid',
        className: 'grid grid-cols-1 lg:grid-cols-2 gap-6'
      }, [
        React.createElement('div', {
          key: 'flows-list',
          className: 'space-y-3'
        }, callFlows.map((flow) =>
          React.createElement('div', {
            key: flow.id,
            className: `p-4 bg-white border rounded-lg cursor-pointer hover:shadow-md transition-shadow ${
              selectedFlow?.id === flow.id ? 'border-blue-500 bg-blue-50' : ''
            }`,
            onClick: () => setSelectedFlow(flow)
          }, [
            React.createElement('div', {
              key: 'header',
              className: 'flex items-center justify-between mb-2'
            }, [
              React.createElement('h3', {
                key: 'type',
                className: 'font-semibold text-gray-900'
              }, flow.type),
              React.createElement('span', {
                key: 'status',
                className: `px-2 py-1 rounded text-xs font-medium ${
                  flow.status === 'success' ? 'bg-green-100 text-green-800' :
                  flow.status === 'failed' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`
              }, flow.status.toUpperCase())
            ]),
            React.createElement('div', {
              key: 'details',
              className: 'text-sm text-gray-600 space-y-1'
            }, [
              React.createElement('div', { key: 'ue' }, `UE: ${flow.ue}`),
              React.createElement('div', { key: 'duration' }, `Duration: ${flow.duration}ms`),
              React.createElement('div', { key: 'messages' }, `Messages: ${flow.messageCount}`)
            ])
          ])
        )),

        selectedFlow && React.createElement('div', {
          key: 'sequence',
          className: 'bg-white p-6 border rounded-lg'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-lg font-semibold mb-4'
          }, `${selectedFlow.type} - Sequence Diagram`),
          React.createElement('div', {
            key: 'entities',
            className: 'flex justify-between mb-4 text-sm font-medium text-gray-700'
          }, ['UE', 'gNB', 'AMF', 'SMF'].map(entity =>
            React.createElement('div', {
              key: entity,
              className: 'text-center'
            }, [
              React.createElement('div', {
                key: 'box',
                className: 'px-3 py-2 bg-gray-100 border rounded'
              }, entity),
              React.createElement('div', {
                key: 'line',
                className: 'w-px h-64 bg-gray-300 mx-auto mt-2'
              })
            ])
          )),
          React.createElement('div', {
            key: 'messages',
            className: 'space-y-2 mt-4'
          }, (selectedFlow.messages || []).map((msg, idx) =>
            React.createElement('div', {
              key: idx,
              className: 'text-xs text-gray-600 flex items-center space-x-2'
            }, [
              React.createElement('span', {
                key: 'step',
                className: 'w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center'
              }, msg.step),
              React.createElement('span', {
                key: 'arrow',
                className: 'icon-arrow-right text-gray-400'
              }),
              React.createElement('span', { key: 'message' }, msg.message),
              React.createElement('span', {
                key: 'time',
                className: 'text-gray-400 ml-auto'
              }, msg.time)
            ])
          ))
        ])
      ])
    ]);

  } catch (error) {
    console.error('CallFlowView error:', error);
    return React.createElement('div', { className: 'text-red-600 p-4' }, 'Failed to load');
  }
}

window.CallFlowView = CallFlowView;
// LayerTraceView - Professional layer-by-layer protocol analysis
function LayerTraceView() {
  try {
    const [selectedLayer, setSelectedLayer] = React.useState('PHY');
    const [traceData, setTraceData] = React.useState([]);

    React.useEffect(() => {
      if (window.lucide?.createIcons) {
        window.lucide.createIcons();
      }
      
      // Sample layer trace data
      const sampleTrace = {
        PHY: [
          { time: '10:30:01.100', event: 'PDSCH Transmission', details: 'RNTI: 0x4601, TBS: 309 bits', level: 'info' },
          { time: '10:30:01.150', event: 'PUCCH Reception', details: 'Format 1, SINR: -23.6dB', level: 'warn' },
          { time: '10:30:01.200', event: 'Channel Quality', details: 'CQI: 7, PMI: 1', level: 'info' }
        ],
        MAC: [
          { time: '10:30:01.100', event: 'DL PDU Scheduled', details: 'UE: 0, Size: 169 bytes', level: 'info' },
          { time: '10:30:01.150', event: 'UL Grant', details: 'HARQ ID: 1, TBS: 128', level: 'info' },
          { time: '10:30:01.200', event: 'CRC Check Failed', details: 'UL PDU corrupted', level: 'error' }
        ],
        RLC: [
          { time: '10:30:01.100', event: 'TX PDU', details: 'SRB1, SN: 0, Length: 53', level: 'info' },
          { time: '10:30:01.150', event: 'RX PDU', details: 'DRB1, SN: 15, Length: 87', level: 'info' }
        ]
      };
      
      setTraceData(sampleTrace);
    }, []);

    const layers = ['PHY', 'MAC', 'RLC', 'PDCP', 'RRC'];

    return React.createElement('div', {
      className: 'p-6 space-y-4',
      'data-name': 'layer-trace-view',
      'data-file': 'components/views/LayerTraceView.js'
    }, [
      React.createElement('h1', {
        key: 'title',
        className: 'text-2xl font-bold text-gray-900'
      }, 'Layer Protocol Trace'),

      React.createElement('div', {
        key: 'layer-tabs',
        className: 'flex space-x-1 bg-gray-100 p-1 rounded-lg'
      }, layers.map(layer =>
        React.createElement('button', {
          key: layer,
          onClick: () => setSelectedLayer(layer),
          className: `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedLayer === layer 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`
        }, layer)
      )),

      React.createElement('div', {
        key: 'trace-content',
        className: 'bg-white border rounded-lg'
      }, [
        React.createElement('div', {
          key: 'header',
          className: 'px-6 py-3 border-b bg-gray-50'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-lg font-semibold'
          }, `${selectedLayer} Layer Events`)
        ]),
        React.createElement('div', {
          key: 'events',
          className: 'divide-y'
        }, (traceData[selectedLayer] || []).map((event, idx) =>
          React.createElement('div', {
            key: idx,
            className: 'px-6 py-4 hover:bg-gray-50'
          }, [
            React.createElement('div', {
              key: 'header',
              className: 'flex items-center justify-between mb-2'
            }, [
              React.createElement('div', {
                key: 'event-info',
                className: 'flex items-center space-x-3'
              }, [
                React.createElement('span', {
                  key: 'level',
                  className: `w-2 h-2 rounded-full ${
                    event.level === 'error' ? 'bg-red-500' :
                    event.level === 'warn' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`
                }),
                React.createElement('span', {
                  key: 'event',
                  className: 'font-medium text-gray-900'
                }, event.event)
              ]),
              React.createElement('span', {
                key: 'time',
                className: 'text-sm text-gray-500 font-mono'
              }, event.time)
            ]),
            React.createElement('p', {
              key: 'details',
              className: 'text-sm text-gray-600 ml-5'
            }, event.details)
          ])
        ))
      ])
    ]);

  } catch (error) {
    console.error('LayerTraceView error:', error);
    return React.createElement('div', { className: 'text-red-600 p-4' }, 'Failed to load');
  }
}

window.LayerTraceView = LayerTraceView;
// NtnSib19View Component - SIB19 broadcast analysis
function NtnSib19View({ appState, onStateChange }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [sib19Data, setSib19Data] = React.useState({
      broadcastEnabled: true,
      period: 160,
      lastUpdate: new Date(),
      content: {
        satellitePosition: { latitude: 0, longitude: 0 },
        timing: { advance: 1024, offset: 0 },
        doppler: { compensation: true, frequency: -25 }
      }
    });

    return React.createElement('div', {
      className: 'p-6 space-y-6',
      'data-name': 'ntn-sib19-view',
      'data-file': 'components/views/NtnSib19View.js'
    }, [
      React.createElement('div', {
        key: 'header',
        className: 'flex items-center justify-between'
      }, [
        React.createElement('h1', {
          key: 'title',
          className: 'text-2xl font-bold text-gray-900'
        }, 'SIB19 Analysis'),
        React.createElement('div', {
          key: 'status',
          className: 'flex items-center space-x-2'
        }, [
          React.createElement('div', {
            key: 'indicator',
            className: `w-3 h-3 rounded-full ${sib19Data.broadcastEnabled ? 'bg-green-500' : 'bg-red-500'}`
          }),
          React.createElement('span', {
            key: 'text',
            className: 'text-sm text-gray-600'
          }, sib19Data.broadcastEnabled ? 'Broadcasting' : 'Stopped')
        ])
      ]),

      React.createElement('div', {
        key: 'overview',
        className: 'grid grid-cols-1 md:grid-cols-3 gap-6'
      }, [
        React.createElement('div', {
          key: 'broadcast-info',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-lg font-semibold text-gray-900 mb-4'
          }, 'Broadcast Info'),
          React.createElement('div', {
            key: 'details',
            className: 'space-y-3'
          }, [
            React.createElement('div', {
              key: 'period',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'Period'),
              React.createElement('span', { key: 'value' }, `${sib19Data.period} ms`)
            ]),
            React.createElement('div', {
              key: 'last-update',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'Last Update'),
              React.createElement('span', { key: 'value' }, sib19Data.lastUpdate.toLocaleTimeString())
            ])
          ])
        ]),

        React.createElement('div', {
          key: 'satellite-position',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-lg font-semibold text-gray-900 mb-4'
          }, 'Satellite Position'),
          React.createElement('div', {
            key: 'coordinates',
            className: 'space-y-3'
          }, [
            React.createElement('div', {
              key: 'latitude',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'Latitude'),
              React.createElement('span', { key: 'value' }, `${sib19Data.content.satellitePosition.latitude}°`)
            ]),
            React.createElement('div', {
              key: 'longitude',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'Longitude'),
              React.createElement('span', { key: 'value' }, `${sib19Data.content.satellitePosition.longitude}°`)
            ])
          ])
        ]),

        React.createElement('div', {
          key: 'timing-info',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-lg font-semibold text-gray-900 mb-4'
          }, 'Timing Info'),
          React.createElement('div', {
            key: 'timing',
            className: 'space-y-3'
          }, [
            React.createElement('div', {
              key: 'advance',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'Advance'),
              React.createElement('span', { key: 'value' }, `${sib19Data.content.timing.advance} samples`)
            ]),
            React.createElement('div', {
              key: 'offset',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'Offset'),
              React.createElement('span', { key: 'value' }, `${sib19Data.content.timing.offset} ms`)
            ])
          ])
        ])
      ]),

      React.createElement('div', {
        key: 'doppler-compensation',
        className: 'bg-white p-6 rounded-lg border border-gray-200'
      }, [
        React.createElement('h3', {
          key: 'title',
          className: 'text-lg font-semibold text-gray-900 mb-4'
        }, 'Doppler Compensation'),
        React.createElement('div', {
          key: 'content',
          className: 'grid grid-cols-1 md:grid-cols-2 gap-6'
        }, [
          React.createElement('div', {
            key: 'status',
            className: 'space-y-3'
          }, [
            React.createElement('div', {
              key: 'enabled',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'Compensation Enabled'),
              React.createElement('span', { 
                key: 'value', 
                className: sib19Data.content.doppler.compensation ? 'text-green-600' : 'text-red-600'
              }, sib19Data.content.doppler.compensation ? 'Yes' : 'No')
            ]),
            React.createElement('div', {
              key: 'frequency',
              className: 'flex justify-between'
            }, [
              React.createElement('span', { key: 'label' }, 'Frequency Offset'),
              React.createElement('span', { key: 'value' }, `${sib19Data.content.doppler.frequency} Hz`)
            ])
          ])
        ])
      ])
    ]);

  } catch (error) {
    console.error('NtnSib19View component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'NTN SIB19 Error');
  }
}

window.NtnSib19View = NtnSib19View;
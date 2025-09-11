// NtnTimingView Component - Timing and delay analysis
function NtnTimingView({ appState, onStateChange }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [timingData, setTimingData] = React.useState({
      propagationDelay: 270,
      roundTripTime: 540,
      timingAdvance: 1024,
      jitter: 5
    });

    React.useEffect(() => {
      const updateTiming = () => {
        try {
          setTimingData({
            propagationDelay: Math.floor(Math.random() * 50) + 250,
            roundTripTime: Math.floor(Math.random() * 100) + 500,
            timingAdvance: Math.floor(Math.random() * 200) + 1000,
            jitter: Math.floor(Math.random() * 10) + 1
          });
        } catch (error) {
          console.error('NtnTimingView timing update error:', error);
        }
      };

      updateTiming();
      const interval = setInterval(updateTiming, 3000);
      return () => clearInterval(interval);
    }, []);

    return React.createElement('div', {
      className: 'p-6 space-y-6',
      'data-name': 'ntn-timing-view',
      'data-file': 'components/views/NtnTimingView.js'
    }, [
      React.createElement('h1', {
        key: 'title',
        className: 'text-2xl font-bold text-gray-900'
      }, 'Timing & Delay Analysis'),

      React.createElement('div', {
        key: 'metrics',
        className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
      }, [
        React.createElement('div', {
          key: 'prop-delay',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600 mb-2'
          }, 'Propagation Delay'),
          React.createElement('div', {
            key: 'value',
            className: 'text-3xl font-bold text-indigo-600'
          }, `${timingData.propagationDelay} ms`)
        ]),

        React.createElement('div', {
          key: 'rtt',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600 mb-2'
          }, 'Round Trip Time'),
          React.createElement('div', {
            key: 'value',
            className: 'text-3xl font-bold text-blue-600'
          }, `${timingData.roundTripTime} ms`)
        ]),

        React.createElement('div', {
          key: 'timing-advance',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600 mb-2'
          }, 'Timing Advance'),
          React.createElement('div', {
            key: 'value',
            className: 'text-3xl font-bold text-green-600'
          }, `${timingData.timingAdvance} samples`)
        ]),

        React.createElement('div', {
          key: 'jitter',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600 mb-2'
          }, 'Jitter'),
          React.createElement('div', {
            key: 'value',
            className: 'text-3xl font-bold text-orange-600'
          }, `${timingData.jitter} ms`)
        ])
      ])
    ]);

  } catch (error) {
    console.error('NtnTimingView component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'NTN Timing Error');
  }
}

window.NtnTimingView = NtnTimingView;

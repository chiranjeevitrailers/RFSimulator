// NtnDopplerView Component - Doppler shift analysis
function NtnDopplerView({ appState, onStateChange }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [dopplerData, setDopplerData] = React.useState({
      currentShift: -25,
      maxShift: 100,
      compensation: 98,
      velocity: 0
    });

    return React.createElement('div', {
      className: 'p-6 space-y-6',
      'data-name': 'ntn-doppler-view',
      'data-file': 'components/views/NtnDopplerView.js'
    }, [
      React.createElement('h1', {
        key: 'title',
        className: 'text-2xl font-bold text-gray-900'
      }, 'Doppler Analysis'),

      React.createElement('div', {
        key: 'metrics',
        className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
      }, [
        React.createElement('div', {
          key: 'current',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600 mb-2'
          }, 'Current Shift'),
          React.createElement('div', {
            key: 'value',
            className: 'text-3xl font-bold text-blue-600'
          }, `${dopplerData.currentShift} Hz`)
        ]),

        React.createElement('div', {
          key: 'max',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600 mb-2'
          }, 'Max Expected'),
          React.createElement('div', {
            key: 'value',
            className: 'text-3xl font-bold text-red-600'
          }, `${dopplerData.maxShift} Hz`)
        ]),

        React.createElement('div', {
          key: 'compensation',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600 mb-2'
          }, 'Compensation'),
          React.createElement('div', {
            key: 'value',
            className: 'text-3xl font-bold text-green-600'
          }, `${dopplerData.compensation}%`)
        ]),

        React.createElement('div', {
          key: 'velocity',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600 mb-2'
          }, 'Relative Velocity'),
          React.createElement('div', {
            key: 'value',
            className: 'text-3xl font-bold text-purple-600'
          }, `${dopplerData.velocity} km/s`)
        ])
      ])
    ]);

  } catch (error) {
    console.error('NtnDopplerView component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'NTN Doppler Error');
  }
}

window.NtnDopplerView = NtnDopplerView;

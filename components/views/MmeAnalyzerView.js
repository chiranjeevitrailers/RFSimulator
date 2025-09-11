// MmeAnalyzerView Component - Mobility Management Entity analyzer
function MmeAnalyzerView({ appState, onStateChange }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [mmeData, setMmeData] = React.useState({
      attachedUes: 245,
      bearers: 387,
      handovers: 23,
      pagingRequests: 156
    });

    return React.createElement('div', {
      className: 'p-6 space-y-6',
      'data-name': 'mme-analyzer-view',
      'data-file': 'components/views/MmeAnalyzerView.js'
    }, [
      React.createElement('h1', {
        key: 'title',
        className: 'text-2xl font-bold text-gray-900'
      }, 'MME Analyzer'),

      React.createElement('div', {
        key: 'metrics',
        className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
      }, [
        React.createElement('div', {
          key: 'ues',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600 mb-2'
          }, 'Attached UEs'),
          React.createElement('div', {
            key: 'value',
            className: 'text-3xl font-bold text-blue-600'
          }, mmeData.attachedUes)
        ]),

        React.createElement('div', {
          key: 'bearers',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600 mb-2'
          }, 'Active Bearers'),
          React.createElement('div', {
            key: 'value',
            className: 'text-3xl font-bold text-green-600'
          }, mmeData.bearers)
        ]),

        React.createElement('div', {
          key: 'handovers',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600 mb-2'
          }, 'Handovers'),
          React.createElement('div', {
            key: 'value',
            className: 'text-3xl font-bold text-purple-600'
          }, mmeData.handovers)
        ]),

        React.createElement('div', {
          key: 'paging',
          className: 'bg-white p-6 rounded-lg border border-gray-200'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-600 mb-2'
          }, 'Paging Requests'),
          React.createElement('div', {
            key: 'value',
            className: 'text-3xl font-bold text-orange-600'
          }, mmeData.pagingRequests)
        ])
      ])
    ]);

  } catch (error) {
    console.error('MmeAnalyzerView component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'MME Analyzer Error');
  }
}

window.MmeAnalyzerView = MmeAnalyzerView;

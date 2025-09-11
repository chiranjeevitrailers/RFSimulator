// PHYChart Component - Specialized charts for PHY layer analysis
function PHYChart({ chartType, data, title }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const getChartColor = (type) => {
      switch (type) {
        case 'cqi-mcs': return 'bg-purple-500';
        case 'bler-throughput': return 'bg-red-500';
        case 'sinr-bler': return 'bg-blue-500';
        case 'mcs-throughput': return 'bg-green-500';
        default: return 'bg-gray-500';
      }
    };

    const getMaxValue = () => {
      if (!data.length) return 100;
      return Math.max(...data.map(d => d.y)) * 1.1;
    };

    const getMinValue = () => {
      if (!data.length) return 0;
      return Math.min(...data.map(d => d.y)) * 0.9;
    };

    const normalizeHeight = (value) => {
      const max = getMaxValue();
      const min = getMinValue();
      const range = max - min;
      if (range === 0) return 50;
      return ((value - min) / range) * 80 + 10; // 10-90% height range
    };

    const formatValue = (value, type) => {
      switch (type) {
        case 'bler-throughput':
        case 'sinr-bler':
          return value < 0.01 ? value.toExponential(2) : value.toFixed(3);
        default:
          return value.toFixed(1);
      }
    };

    return React.createElement('div', {
      className: 'bg-white rounded-lg shadow p-6',
      'data-name': 'phy-chart',
      'data-file': 'components/charts/PHYChart.js'
    }, [
      React.createElement('div', {
        key: 'chart-header',
        className: 'flex items-center justify-between mb-4'
      }, [
        React.createElement('h3', {
          key: 'title',
          className: 'text-lg font-semibold text-gray-900'
        }, title),
        React.createElement('div', {
          key: 'info',
          className: 'flex items-center text-sm text-gray-600'
        }, [
          React.createElement('i', {
            key: 'icon',
            'data-lucide': 'bar-chart-3',
            className: 'w-4 h-4 mr-1'
          }),
          `${data.length} points`
        ])
      ]),
      
      data.length === 0 ? React.createElement('div', {
        key: 'no-data',
        className: 'flex items-center justify-center h-64 text-gray-500'
      }, [
        React.createElement('div', {
          key: 'content',
          className: 'text-center'
        }, [
          React.createElement('i', {
            key: 'icon',
            'data-lucide': 'bar-chart-3',
            className: 'w-12 h-12 mx-auto mb-3 text-gray-400'
          }),
          React.createElement('p', {
            key: 'message',
            className: 'text-lg'
          }, 'No data available'),
          React.createElement('p', {
            key: 'hint',
            className: 'text-sm mt-2'
          }, 'Start logging to see PHY metrics')
        ])
      ]) : React.createElement('div', {
        key: 'chart-container',
        className: 'relative'
      }, [
        React.createElement('div', {
          key: 'chart',
          className: 'h-64 flex items-end justify-between px-4 bg-gray-50 rounded'
        }, data.slice(-20).map((point, index) => {
          const height = normalizeHeight(point.y);
          return React.createElement('div', {
            key: index,
            className: 'flex flex-col items-center group relative',
            style: { width: `${90 / Math.min(data.length, 20)}%` }
          }, [
            React.createElement('div', {
              key: 'tooltip',
              className: 'absolute bottom-full mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10'
            }, `${point.label}: ${formatValue(point.y, chartType)}`),
            React.createElement('div', {
              key: 'bar',
              className: `${getChartColor(chartType)} rounded-t w-full transition-all duration-300 hover:opacity-80`,
              style: { height: `${height}%` }
            }),
            React.createElement('div', {
              key: 'label',
              className: 'text-xs text-gray-600 mt-1 transform rotate-45 origin-top-left'
            }, point.x.toString().slice(0, 4))
          ]);
        })),
        
        React.createElement('div', {
          key: 'axes',
          className: 'mt-4 text-xs text-gray-600'
        }, [
          React.createElement('div', {
            key: 'x-axis',
            className: 'text-center'
          }, `X-Axis: ${chartType.split('-')[0].toUpperCase()}`),
          React.createElement('div', {
            key: 'y-axis',
            className: 'text-center mt-1'
          }, `Y-Axis: ${chartType.split('-')[1].toUpperCase()}`)
        ])
      ]),
      
      React.createElement('div', {
        key: 'stats',
        className: 'mt-4 pt-4 border-t border-gray-200'
      }, [
        React.createElement('div', {
          key: 'summary',
          className: 'grid grid-cols-3 gap-4 text-sm'
        }, [
          React.createElement('div', {
            key: 'min',
            className: 'text-center'
          }, [
            React.createElement('div', {
              key: 'label',
              className: 'text-gray-600'
            }, 'Min'),
            React.createElement('div', {
              key: 'value',
              className: 'font-medium'
            }, data.length ? formatValue(getMinValue(), chartType) : '-')
          ]),
          React.createElement('div', {
            key: 'avg',
            className: 'text-center'
          }, [
            React.createElement('div', {
              key: 'label',
              className: 'text-gray-600'
            }, 'Avg'),
            React.createElement('div', {
              key: 'value',
              className: 'font-medium'
            }, data.length ? formatValue(data.reduce((sum, d) => sum + d.y, 0) / data.length, chartType) : '-')
          ]),
          React.createElement('div', {
            key: 'max',
            className: 'text-center'
          }, [
            React.createElement('div', {
              key: 'label',
              className: 'text-gray-600'
            }, 'Max'),
            React.createElement('div', {
              key: 'value',
              className: 'font-medium'
            }, data.length ? formatValue(getMaxValue(), chartType) : '-')
          ])
        ])
      ])
    ]);

  } catch (error) {
    console.error('PHYChart component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'PHYChart Error');
  }
}

// Export PHYChart component
window.PHYChart = PHYChart;

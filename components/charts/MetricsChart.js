// MetricsChart Component
function MetricsChart({ data, title, type = 'line' }) {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [chartData, setChartData] = React.useState([]);

    React.useEffect(() => {
      if (data && data.length > 0) {
        setChartData(data.slice(-20)); // Last 20 data points
      }
    }, [data]);

    const renderLineChart = () => {
      try {
        if (chartData.length === 0) return null;

        const maxValue = Math.max(...chartData.map(d => d.value));
        const minValue = Math.min(...chartData.map(d => d.value));
        const range = maxValue - minValue || 1;

        return chartData.map((point, index) => {
          const height = ((point.value - minValue) / range) * 100;
          const x = (index / (chartData.length - 1)) * 100;
          
          return React.createElement('div', {
            key: index,
            className: 'absolute w-2 bg-blue-500 rounded-t',
            style: {
              left: `${x}%`,
              bottom: '0',
              height: `${height}%`
            }
          });
        });
      } catch (error) {
        console.error('MetricsChart render line chart error:', error);
        return null;
      }
    };

    const renderBarChart = () => {
      try {
        if (chartData.length === 0) return null;

        const maxValue = Math.max(...chartData.map(d => d.value));

        return chartData.map((point, index) => {
          const height = (point.value / maxValue) * 100;
          const width = 100 / chartData.length;
          
          return React.createElement('div', {
            key: index,
            className: 'bg-green-500 rounded-t mx-1',
            style: {
              width: `${width - 2}%`,
              height: `${height}%`
            }
          });
        });
      } catch (error) {
        console.error('MetricsChart render bar chart error:', error);
        return null;
      }
    };

    const getLatestValue = () => {
      return chartData.length > 0 ? chartData[chartData.length - 1].value : 0;
    };

    const getTrend = () => {
      if (chartData.length < 2) return 'stable';
      const recent = chartData.slice(-3).reduce((sum, d) => sum + d.value, 0) / 3;
      const previous = chartData.slice(-6, -3).reduce((sum, d) => sum + d.value, 0) / 3;
      
      if (recent > previous * 1.05) return 'up';
      if (recent < previous * 0.95) return 'down';
      return 'stable';
    };

    return React.createElement('div', {
      className: 'bg-white p-4 rounded-lg border border-gray-200',
      'data-name': 'metrics-chart',
      'data-file': 'components/charts/MetricsChart.js'
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
          key: 'trend',
          className: 'flex items-center space-x-2'
        }, [
          React.createElement('i', {
            key: 'trend-icon',
            'data-lucide': getTrend() === 'up' ? 'trending-up' : getTrend() === 'down' ? 'trending-down' : 'minus',
            className: `w-4 h-4 ${getTrend() === 'up' ? 'text-green-500' : getTrend() === 'down' ? 'text-red-500' : 'text-gray-400'}`
          }),
          React.createElement('span', {
            key: 'value',
            className: 'text-2xl font-bold text-gray-900'
          }, getLatestValue().toFixed(2))
        ])
      ]),
      React.createElement('div', {
        key: 'chart-container',
        className: 'relative h-32 bg-gray-50 rounded'
      }, [
        chartData.length === 0 ? React.createElement('div', {
          key: 'no-data',
          className: 'flex items-center justify-center h-full text-gray-500'
        }, 'No data available') : 
        React.createElement('div', {
          key: 'chart',
          className: `relative h-full ${type === 'bar' ? 'flex items-end' : ''}`
        }, type === 'bar' ? renderBarChart() : renderLineChart())
      ]),
      React.createElement('div', {
        key: 'chart-footer',
        className: 'mt-2 text-xs text-gray-500'
      }, `${chartData.length} data points`)
    ]);

  } catch (error) {
    console.error('MetricsChart component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'Chart failed to load');
  }
}

// Export MetricsChart component
window.MetricsChart = MetricsChart;

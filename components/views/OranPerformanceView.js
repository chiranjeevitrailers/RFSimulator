// OranPerformanceView Component - Real-time KPIs and performance metrics
function OranPerformanceView() {
  try {
    React.useEffect(() => {
      lucide.createIcons();
    }, []);

    const [performanceData, setPerformanceData] = React.useState([]);
    const [kpis, setKpis] = React.useState({
      throughput: 0,
      latency: 0,
      packetLoss: 0,
      availability: 99.9
    });

    React.useEffect(() => {
      const updateMetrics = () => {
        try {
          const newDataPoint = {
            timestamp: new Date().toISOString(),
            throughput: Math.floor(Math.random() * 1000) + 500,
            latency: Math.floor(Math.random() * 10) + 1,
            packetLoss: Math.random() * 2,
            cpu: Math.floor(Math.random() * 100),
            memory: Math.floor(Math.random() * 100)
          };

          setPerformanceData(prev => [...prev, newDataPoint].slice(-20));
          setKpis({
            throughput: newDataPoint.throughput,
            latency: newDataPoint.latency,
            packetLoss: newDataPoint.packetLoss.toFixed(2),
            availability: (99.5 + Math.random() * 0.5).toFixed(1)
          });
        } catch (error) {
          console.error('OranPerformanceView update metrics error:', error);
          reportError(error);
        }
      };

      const interval = setInterval(updateMetrics, 3000);
      updateMetrics();
      return () => clearInterval(interval);
    }, []);

    const renderKpiCard = (title, value, unit, icon, color) => {
      return React.createElement('div', {
        className: 'bg-white p-6 rounded-lg border border-gray-200'
      }, [
        React.createElement('div', { key: 'header', className: 'flex items-center justify-between mb-4' }, [
          React.createElement('h3', { key: 'title', className: 'text-sm font-medium text-gray-600' }, title),
          React.createElement('i', { key: 'icon', 'data-lucide': icon, className: `w-5 h-5 text-${color}-500` })
        ]),
        React.createElement('div', { key: 'content' }, [
          React.createElement('div', { key: 'value', className: `text-3xl font-bold text-${color}-600` }, value),
          React.createElement('span', { key: 'unit', className: 'text-sm text-gray-500 ml-1' }, unit)
        ])
      ]);
    };

    return React.createElement('div', {
      className: 'p-6 space-y-6',
      'data-name': 'oran-performance',
      'data-file': 'components/views/OranPerformanceView.js'
    }, [
      React.createElement('h1', {
        key: 'title',
        className: 'text-2xl font-bold text-gray-900'
      }, 'O-RAN Performance Metrics'),

      React.createElement('div', {
        key: 'kpis',
        className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
      }, [
        renderKpiCard('Throughput', kpis.throughput, 'Mbps', 'activity', 'blue'),
        renderKpiCard('Latency', kpis.latency, 'ms', 'clock', 'green'),
        renderKpiCard('Packet Loss', kpis.packetLoss, '%', 'alert-triangle', 'red'),
        renderKpiCard('Availability', kpis.availability, '%', 'shield-check', 'purple')
      ]),

      React.createElement('div', {
        key: 'charts',
        className: 'grid grid-cols-1 lg:grid-cols-2 gap-6'
      }, [
        React.createElement('div', { key: 'throughput-chart', className: 'bg-white p-6 rounded-lg border' }, [
          React.createElement('h3', { key: 'title', className: 'text-lg font-semibold mb-4' }, 'Throughput Trend'),
          React.createElement(MetricsChart, {
            key: 'chart',
            data: performanceData.map(d => ({ timestamp: d.timestamp, value: d.throughput })),
            title: 'Throughput (Mbps)',
            type: 'line'
          })
        ]),
        React.createElement('div', { key: 'latency-chart', className: 'bg-white p-6 rounded-lg border' }, [
          React.createElement('h3', { key: 'title', className: 'text-lg font-semibold mb-4' }, 'Latency Trend'),
          React.createElement(MetricsChart, {
            key: 'chart',
            data: performanceData.map(d => ({ timestamp: d.timestamp, value: d.latency })),
            title: 'Latency (ms)',
            type: 'line'
          })
        ])
      ])
    ]);

  } catch (error) {
    console.error('OranPerformanceView component error:', error);
    reportError(error);
    return React.createElement('div', { className: 'text-red-600 p-4' }, 'Performance View failed to load');
  }
}

// Export OranPerformanceView component
window.OranPerformanceView = OranPerformanceView;

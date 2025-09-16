// AnalyticsView - Advanced KPI and performance analytics with Chart.js
function AnalyticsView() {
  try {
    const [analysisData, setAnalysisData] = React.useState(null);
    const [selectedMetric, setSelectedMetric] = React.useState('throughput');
    const [chart, setChart] = React.useState(null);

    React.useEffect(() => {
      if (window.lucide?.createIcons) {
        window.lucide.createIcons();
      }

      // Sample message analysis for KPI calculation – safe fallback if decoder missing
      const sampleMessages = window.SrsranMessageDecoder && window.MessageAnalyzer ? [
        SrsranMessageDecoder.parseLogMessage('[PHY] [I] [931.6] PDSCH: rnti=0x4601 h_id=0 k1=4 prb=[0,87) symb=[1,14) mod=QPSK rv=0 tbs=309 t=135.5us'),
        SrsranMessageDecoder.parseLogMessage('[MAC] [I] [938.5] DL PDU: ue=0 rnti=0x4601 size=169: SDU: lcid=1 nof_sdus=1 total_size=55'),
        SrsranMessageDecoder.parseLogMessage('[PHY] [E] [932.1] PUCCH decode failed: rnti=0x4601 format=1'),
        SrsranMessageDecoder.parseLogMessage('[PHY] [I] [934.8] PUCCH: rnti=0x4601 format=1 prb1=4 prb2=na symb=[0,14) cs=0 occ=0 sr=no metric=0.1 sinr=-23.6dB t=56.2us')
      ] : [];

      if (window.MessageAnalyzer) {
        const analysis = window.MessageAnalyzer.analyzeMessages(sampleMessages);
        setAnalysisData(analysis);
      }
      
      // Initialize chart
      const timer = setTimeout(() => {
        const ctx = document.getElementById('analyticsChart');
        if (ctx && window.Chart) {
          const ChartJS = window.Chart;
          if (chart) chart.destroy();

          const newChart = new ChartJS(ctx, {
            type: 'line',
            data: {
              labels: ['10:00', '10:15', '10:30', '10:45', '11:00'],
              datasets: [{
                label: 'Throughput (Kbps)',
                data: [120, 135, 148, 142, 156],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.1
              }]
            },
            options: {
              responsive: true,
              plugins: { legend: { display: true } }
            }
          });
          setChart(newChart);
        }
      }, 100);

      // Cleanup chart on unmount
      return () => {
        clearTimeout(timer);
        if (chart) {
          chart.destroy();
        }
      };
    }, []);

    const metrics = React.useMemo(() => {
      if (!analysisData) return { throughput: 0, latency: 0, errorRate: 0, totalMessages: 0 };
      
      return {
        throughput: analysisData.kpis?.avgThroughput || '0',
        latency: analysisData.kpis?.avgLatency || '0',
        errorRate: analysisData.kpis?.errorRate || '0',
        totalMessages: analysisData.total || 0
      };
    }, [analysisData]);

    return React.createElement('div', {
      className: 'p-6 space-y-6',
      'data-name': 'analytics-view',
      'data-file': 'components/views/AnalyticsView.js'
    }, [
      React.createElement('h1', {
        key: 'title',
        className: 'text-2xl font-bold text-gray-900'
      }, 'Performance Analytics'),

      React.createElement('div', {
        key: 'kpis',
        className: 'grid grid-cols-4 gap-6'
      }, [
        React.createElement('div', {
          key: 'throughput',
          className: 'bg-white p-6 rounded-lg border shadow-sm'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-500'
          }, 'Avg Throughput'),
          React.createElement('p', {
            key: 'value',
            className: 'text-3xl font-bold text-blue-600'
          }, `${metrics.throughput} Kbps`)
        ]),
        React.createElement('div', {
          key: 'latency',
          className: 'bg-white p-6 rounded-lg border shadow-sm'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-medium text-gray-500'
          }, 'Avg Latency'),
          React.createElement('p', {
            key: 'value',
            className: 'text-3xl font-bold text-green-600'
          }, `${metrics.latency} μs`)
        ])
      ]),

      React.createElement('div', {
        key: 'chart',
        className: 'bg-white p-6 rounded-lg border shadow-sm'
      }, [
        React.createElement('h3', {
          key: 'title',
          className: 'text-lg font-semibold mb-4'
        }, 'Performance Trends'),
        React.createElement('canvas', {
          key: 'canvas',
          id: 'analyticsChart',
          className: 'w-full h-64'
        })
      ])
    ]);

  } catch (error) {
    console.error('AnalyticsView error:', error);
    return React.createElement('div', { className: 'text-red-600 p-4' }, 'Failed to load');
  }
}

window.AnalyticsView = AnalyticsView;
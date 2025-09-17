// PhyLayerViewWithAdapter - PHY layer analysis with DataFormatAdapter integration
import React from 'react';
import { LayerViewIntegration, useDataFormatAdapter } from '../../utils/DataFormatAdapterIntegration';

function PhyLayerViewWithAdapter() {
  const { processLayerData, validateData } = useDataFormatAdapter();
  
  const [phyData, setPhyData] = React.useState({
    pdschStats: { count: 0, avgThroughput: 0, avgSinr: 0, harqProcesses: 0 },
    puschStats: { count: 0, avgPower: 0, successRate: 0, retransmissions: 0 },
    pucchStats: { count: 0, avgCqi: 0, srCount: 0, ackNackCount: 0 },
    beamformingInfo: { activeBeams: 0, precoder: 'N/A' },
    mimoMetrics: { rank: 0, cqi: 0, pmi: 0, ri: 0 },
    channelEstimation: { rsrp: 0, rsrq: 0, rssi: 0 }
  });

  const [processedLogs, setProcessedLogs] = React.useState([]);
  const [layerMetrics, setLayerMetrics] = React.useState({});

  React.useEffect(() => {
    try {
      if (window.LogProcessor) {
        const logProcessor = new window.LogProcessor();
        const unsubscribe = logProcessor.subscribe((logs) => {
          // Filter PHY logs
          const phyLogs = logs.filter(log => 
            log.layer === 'PHY' || log.fields?.layer === 'PHY' ||
            log.message?.includes('PDSCH') || log.message?.includes('PUSCH') ||
            log.message?.includes('PUCCH') || log.channel?.includes('P')
          );
          
          // Process logs using DataFormatAdapter
          const adaptedLogs = phyLogs.map(log => {
            const adapted = LayerViewIntegration.processPhyData(log);
            return adapted;
          }).filter(log => log && validateData(log, 'layer'));
          
          setProcessedLogs(adaptedLogs);
          setPhyData(processPhyLogs(adaptedLogs));
        });
        
        if (window.CLIDataBridge) {
          const cliBridge = new window.CLIDataBridge();
          cliBridge.startCollection(['srsran']).catch(() => {});
        }
        return unsubscribe;
      } else {
        // Fallback for development/testing
        const updateData = () => {
          const mockLogs = generateMockPhyLogs();
          const adaptedLogs = mockLogs.map(log => LayerViewIntegration.processPhyData(log));
          setProcessedLogs(adaptedLogs);
          setPhyData(processPhyLogs(adaptedLogs));
        };
        const interval = setInterval(updateData, 1000);
        return () => clearInterval(interval);
      }
    } catch (error) {
      console.error('PHY CLI integration failed:', error);
    }
  }, []);

  const processPhyLogs = (logs) => {
    const pdschLogs = logs.filter(log => 
      log.channel === 'PDSCH' || log.fields?.channel === 'PDSCH' || log.message?.includes('PDSCH'));
    const puschLogs = logs.filter(log => 
      log.channel === 'PUSCH' || log.fields?.channel === 'PUSCH' || log.message?.includes('PUSCH'));
    const pucchLogs = logs.filter(log => 
      log.channel === 'PUCCH' || log.fields?.channel === 'PUCCH' || log.message?.includes('PUCCH'));

    // Extract metrics from adapted logs
    const metrics = logs.reduce((acc, log) => {
      if (log.metrics) {
        Object.keys(log.metrics).forEach(key => {
          if (!acc[key]) acc[key] = [];
          acc[key].push(log.metrics[key]);
        });
      }
      return acc;
    }, {});

    setLayerMetrics(metrics);

    return {
      pdschStats: {
        count: pdschLogs.length,
        avgThroughput: calculateAverage(metrics.throughput) || 0,
        avgSinr: calculateAverage(metrics.sinr) || 0,
        harqProcesses: calculateAverage(metrics.harqProcesses) || 0
      },
      puschStats: {
        count: puschLogs.length,
        avgPower: calculateAverage(metrics.rsrp) || 0,
        successRate: calculateAverage(metrics.successRate) || 0,
        retransmissions: calculateAverage(metrics.harqRetransmissions) || 0
      },
      pucchStats: {
        count: pucchLogs.length,
        avgCqi: calculateAverage(metrics.mcs) || 0,
        srCount: pucchLogs.filter(log => log.message?.includes('SR')).length,
        ackNackCount: pucchLogs.filter(log => log.message?.includes('ACK') || log.message?.includes('NACK')).length
      },
      beamformingInfo: {
        activeBeams: calculateAverage(metrics.rank) || 0,
        precoder: 'N/A' // Would be extracted from actual beamforming data
      },
      mimoMetrics: {
        rank: calculateAverage(metrics.rank) || 0,
        cqi: calculateAverage(metrics.mcs) || 0,
        pmi: 0, // Would be extracted from actual MIMO data
        ri: calculateAverage(metrics.layers) || 0
      },
      channelEstimation: {
        rsrp: calculateAverage(metrics.rsrp) || 0,
        rsrq: calculateAverage(metrics.rsrq) || 0,
        rssi: calculateAverage(metrics.rssi) || 0
      }
    };
  };

  const calculateAverage = (values) => {
    if (!values || values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  };

  const generateMockPhyLogs = () => {
    return [
      {
        layer: 'PHY',
        messageType: 'PDSCH',
        timestamp: Date.now(),
        fields: {
          decoded: {
            rsrp: -85 + Math.random() * 10,
            rsrq: -10 + Math.random() * 5,
            sinr: 15 + Math.random() * 10,
            throughput: 100 + Math.random() * 50,
            mcs: Math.floor(Math.random() * 28),
            rank: Math.floor(Math.random() * 4) + 1
          }
        }
      },
      {
        layer: 'PHY',
        messageType: 'PUSCH',
        timestamp: Date.now(),
        fields: {
          decoded: {
            rsrp: -80 + Math.random() * 10,
            successRate: 95 + Math.random() * 5,
            harqRetransmissions: Math.floor(Math.random() * 4)
          }
        }
      }
    ];
  };

  return (
    <div className="phy-layer-view p-6 bg-white rounded-lg shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">PHY Layer Analysis</h2>
        <p className="text-gray-600">Physical layer metrics and performance analysis</p>
      </div>

      {/* Channel Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* PDSCH Stats */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">PDSCH Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-blue-700">Count:</span>
              <span className="font-medium">{phyData.pdschStats.count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Avg Throughput:</span>
              <span className="font-medium">{phyData.pdschStats.avgThroughput.toFixed(2)} Mbps</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Avg SINR:</span>
              <span className="font-medium">{phyData.pdschStats.avgSinr.toFixed(2)} dB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">HARQ Processes:</span>
              <span className="font-medium">{phyData.pdschStats.harqProcesses.toFixed(0)}</span>
            </div>
          </div>
        </div>

        {/* PUSCH Stats */}
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900 mb-4">PUSCH Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-green-700">Count:</span>
              <span className="font-medium">{phyData.puschStats.count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Avg Power:</span>
              <span className="font-medium">{phyData.puschStats.avgPower.toFixed(2)} dBm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Success Rate:</span>
              <span className="font-medium">{phyData.puschStats.successRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Retransmissions:</span>
              <span className="font-medium">{phyData.puschStats.retransmissions.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* PUCCH Stats */}
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-900 mb-4">PUCCH Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-purple-700">Count:</span>
              <span className="font-medium">{phyData.pucchStats.count}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-700">Avg CQI:</span>
              <span className="font-medium">{phyData.pucchStats.avgCqi.toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-700">SR Count:</span>
              <span className="font-medium">{phyData.pucchStats.srCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-700">ACK/NACK:</span>
              <span className="font-medium">{phyData.pucchStats.ackNackCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Channel Estimation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Channel Estimation</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-700">RSRP:</span>
              <span className="font-medium">{phyData.channelEstimation.rsrp.toFixed(2)} dBm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">RSRQ:</span>
              <span className="font-medium">{phyData.channelEstimation.rsrq.toFixed(2)} dB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">RSSI:</span>
              <span className="font-medium">{phyData.channelEstimation.rssi.toFixed(2)} dBm</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">MIMO Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-700">Rank:</span>
              <span className="font-medium">{phyData.mimoMetrics.rank.toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">CQI:</span>
              <span className="font-medium">{phyData.mimoMetrics.cqi.toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">PMI:</span>
              <span className="font-medium">{phyData.mimoMetrics.pmi}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">RI:</span>
              <span className="font-medium">{phyData.mimoMetrics.ri.toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Processed Logs Display */}
      {processedLogs.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent PHY Logs</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {processedLogs.slice(-10).map((log, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-900">{log.messageType}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  {log.metrics?.rsrp && (
                    <span className="text-blue-600">RSRP: {log.metrics.rsrp.toFixed(1)} dBm</span>
                  )}
                  {log.metrics?.sinr && (
                    <span className="text-green-600">SINR: {log.metrics.sinr.toFixed(1)} dB</span>
                  )}
                  {log.metrics?.throughput && (
                    <span className="text-purple-600">TP: {log.metrics.throughput.toFixed(1)} Mbps</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Layer Metrics Summary */}
      {Object.keys(layerMetrics).length > 0 && (
        <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Layer Metrics Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(layerMetrics).map(([metric, values]) => (
              <div key={metric} className="text-center p-3 bg-gray-50 rounded">
                <div className="text-sm text-gray-600 capitalize">{metric.replace(/([A-Z])/g, ' $1')}</div>
                <div className="text-lg font-semibold text-gray-900">
                  {values.length > 0 ? calculateAverage(values).toFixed(2) : 'N/A'}
                </div>
                <div className="text-xs text-gray-500">{values.length} samples</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PhyLayerViewWithAdapter;
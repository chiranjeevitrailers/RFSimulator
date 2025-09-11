// CLI Monitor View - Production CLI monitoring interface
function CLIMonitorView() {
  const [controller, setController] = React.useState(null);
  const [status, setStatus] = React.useState(null);
  const [logs, setLogs] = React.useState([]);

  React.useEffect(() => {
    const cliController = new FullCLIController();
    setController(cliController);

    cliController.initialize().then(() => {
      updateStatus();
    });

    const interval = setInterval(updateStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = () => {
    if (controller) {
      setStatus(controller.getSystemStatus());
    }
  };

  const startSystem = async () => {
    if (controller) {
      const result = await controller.startSystem();
      if (result.success) {
        controller.subscribe((logEntry) => {
          setLogs(prev => [logEntry, ...prev.slice(0, 99)]);
        });
      }
      updateStatus();
    }
  };

  const stopSystem = () => {
    if (controller) {
      controller.stopSystem();
      updateStatus();
    }
  };

  return (
    <div className="p-6" data-name="cli-monitor-view" data-file="components/views/CLIMonitorView.js">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">CLI System Monitor</h2>
        <p className="text-gray-600">Production CLI integration monitoring</p>
      </div>

      {/* Control Panel */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">System Control</h3>
          <div className="flex gap-2">
            <button 
              onClick={startSystem}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Start CLI System
            </button>
            <button 
              onClick={stopSystem}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Stop System
            </button>
          </div>
        </div>
      </div>

      {/* Status Display */}
      {status && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="font-semibold mb-2">Data Adapter</h3>
            <div className="text-sm">
              <div>Status: {status.dataAdapter?.isActive ? 'Active' : 'Inactive'}</div>
              <div>Sources: {status.dataAdapter?.activeSources?.length || 0}</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="font-semibold mb-2">Dashboard</h3>
            <div className="text-sm">
              <div>Monitoring: {status.dashboard?.isMonitoring ? 'Yes' : 'No'}</div>
              <div>Alerts: {status.dashboard?.activeAlerts || 0}</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="font-semibold mb-2">Safety</h3>
            <div className="text-sm">
              <div>Emergency: {status.safety?.emergencyStop ? 'ACTIVE' : 'Clear'}</div>
              <div>Active Commands: {status.safety?.activeCommands || 0}</div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Logs */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <h3 className="font-semibold mb-4">Recent Logs</h3>
        <div className="max-h-96 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="py-2 border-b border-gray-100 text-sm">
              <div className="flex justify-between">
                <span className="font-mono">{log.source}</span>
                <span className="text-gray-500">{log.timestamp}</span>
              </div>
              <div className="text-gray-700">{log.message}</div>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="text-gray-500 text-center py-4">
              No logs available. Start the CLI system to see logs.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

if (typeof window !== 'undefined') {
  window.CLIMonitorView = CLIMonitorView;
}
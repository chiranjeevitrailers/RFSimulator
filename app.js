// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return React.createElement('div', {
        className: 'flex items-center justify-center h-screen bg-red-50'
      }, React.createElement('div', {
        className: 'text-center'
      }, [
        React.createElement('h2', {
          key: 'title',
          className: 'text-2xl font-bold text-red-600 mb-2'
        }, 'Something went wrong'),
        React.createElement('p', {
          key: 'message',
          className: 'text-red-500'
        }, 'Please refresh the page to try again')
      ]));
    }

    return this.props.children;
  }
}

// Main Application Component
function App() {
  try {
    React.useEffect(() => {
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }, []);

    const [appState, setAppState] = React.useState({
      currentView: 'user-dashboard',
      sidebarCollapsed: false,
      logs: [],
      selectedLog: null,
      filters: {
        level: 'all',
        component: 'all',
        timeRange: 'all'
      },
      searchQuery: '',
      realTimeEnabled: false,
      darkMode: false,
      isMonitoring: false
    });

    const [logProcessor] = React.useState(() => new LogProcessor());

    // Initialize with empty logs - real logs will come from backend WebSocket
    React.useEffect(() => {
      console.log('5GLabX Platform initialized - waiting for real CLI logs from backend server');
      console.log('Make sure to start the backend server with: npm run server');
    }, []);

    const handleLogReceived = async (logEntry) => {
      try {
        // Process log through LogProcessor if it's a raw message
        if (typeof logEntry === 'string' || logEntry.message) {
          const processed = await logProcessor.processLogLine(
            logEntry.message || logEntry, 
            logEntry.source || 'srsran'
          );
          setAppState(prev => ({ 
            ...prev, 
            logs: [...prev.logs, processed].slice(-1000) 
          }));
        } else {
          setAppState(prev => ({ 
            ...prev, 
            logs: [...prev.logs, logEntry].slice(-1000) 
          }));
        }
      } catch (error) {
        console.error('Log processing error:', error);
      }
    };

    const toggleMonitoring = () => {
      setAppState(prev => ({ ...prev, isMonitoring: !prev.isMonitoring }));
    };

    const navigate = (viewId) => {
      try {
        setAppState(prev => ({
          ...prev,
          currentView: viewId
        }));
      } catch (error) {
        console.error('Navigation error:', error);
        reportError(error);
      }
    };

    const renderCurrentView = () => {
      try {
        const viewComponents = {
          'user-dashboard': UserDashboardView,
          'dashboard': DashboardView,
          'logs': LogsView,
          'enhanced-logs': EnhancedLogsView,
          'analytics': AnalyticsView,
          'layer-trace': LayerTraceView,
          'callflow': CallFlowView,
          'phy-layer': PhyLayerView,
          'mac-layer': MacLayerView,
          'rlc-layer': RlcLayerView,
          'pdcp-layer': PdcpLayerView,
          'rrc-layer': RrcLayerView,
          'nas-layer': NasLayerView,
          'ims-layer': ImsLayerView,
          'amf-analyzer': AmfAnalyzerView,
          'smf-analyzer': SmfAnalyzerView,
          'upf-analyzer': UpfAnalyzerView,
          'ausf-analyzer': AusfAnalyzerView,
          'udm-analyzer': UdmAnalyzerView,
          'mme-analyzer': MmeAnalyzerView,
          'sgw-analyzer': SgwAnalyzerView,
          'pgw-analyzer': PgwAnalyzerView,
          'config-manager': ConfigManagerView,
          'oran-overview': OranOverviewView,
          'oran-interfaces': OranInterfacesView,
          'oran-cu-analysis': OranCuAnalysisView,
          'oran-du-analysis': OranDuAnalysisView,
          'oran-e1-interface': OranE1InterfaceView,
          'oran-f1-interface': OranF1InterfaceView,
          'oran-performance': OranPerformanceView,
          'oran-xapps': OranXappsView,
          'oran-smo': OranSmoView,
          'nbiot-overview': NBIoTOverviewView,
          'nbiot-callflow': NBIoTCallFlowView,
          'nbiot-analytics': NBIoTAnalyticsView,
          'nbiot-phy-layer': NBIoTPhyLayerView,
          'nbiot-mac-layer': NBIoTMacLayerView,
          'nbiot-rrc-layer': NBIoTRrcLayerView,
          'nbiot-testing': NBIoTTestingView,
          'v2x-overview': V2xOverviewView,
          'v2x-sidelink': V2xSidelinkView,
          'v2x-analytics': V2xAnalyticsView,
          'v2x-phy-layer': V2xPhyLayerView,
          'v2x-mac-layer': V2xMacLayerView,
          'v2x-testing': V2xTestingView,
          'v2x-scenarios': V2xScenariosView,
          'ntn-overview': NtnOverviewView,
          'ntn-satellites': NtnSatellitesView,
          'ntn-analytics': NtnAnalyticsView,
          'ntn-sib19': NtnSib19View,
          'ntn-timing': NtnTimingView,
          'ntn-doppler': NtnDopplerView,
          'ntn-scenarios': NtnScenariosView,
          'report-generator': ReportGeneratorView,
          'export-manager': ExportManagerView,
          'config-manager': ConfigManagerView,
          'cli-status-monitor': CLIStatusMonitor,
          'help-support': HelpSupportView
        };

        const ViewComponent = viewComponents[appState.currentView];
        
        if (ViewComponent) {
          return React.createElement(ViewComponent, {
            appState: appState,
            onStateChange: setAppState,
            onLogReceived: handleLogReceived,
            onToggleMonitoring: toggleMonitoring
          });
        }

        return React.createElement('div', {
          className: 'flex items-center justify-center h-full'
        }, [
          React.createElement('div', {
            key: 'not-found',
            className: 'text-center'
          }, [
            React.createElement('h2', {
              key: 'title',
              className: 'text-2xl font-bold text-gray-900 mb-2'
            }, 'View Not Found'),
            React.createElement('p', {
              key: 'message',
              className: 'text-gray-600'
            }, `View "${appState.currentView}" is not available`)
          ])
        ]);
      } catch (error) {
        console.error('Render view error:', error);
        reportError(error);
        return React.createElement('div', {
          className: 'text-red-600 p-4'
        }, 'Failed to render view');
      }
    };

    return React.createElement('div', {
      className: 'h-screen flex bg-gray-50'
    }, [
      React.createElement(Sidebar, {
        key: 'sidebar',
        appState: appState,
        onNavigate: navigate
      }),
      React.createElement('div', {
        key: 'main',
        className: 'flex-1 overflow-auto'
      }, renderCurrentView())
    ]);

  } catch (error) {
    console.error('App component error:', error);
    reportError(error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'Application failed to load');
  }
}

// Initialize React app with ErrorBoundary
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(ErrorBoundary, null, React.createElement(App)));

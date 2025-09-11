// Mock State Service for 5GLabX Platform Frontend Demo
window.MockStateService = (() => {
  let state = {
    currentView: 'dashboard',
    sidebarCollapsed: false,
    logs: [],
    metrics: {},
    config: {},
    filters: {
      level: 'all',
      source: 'all',
      search: ''
    },
    selectedLog: null,
    isConnected: false,
    lastUpdate: null
  };
  
  const subscribers = [];
  
  return {
    // Get current state
    getState() {
      return { ...state };
    },
    
    // Update state
    setState(updates) {
      const oldState = { ...state };
      state = { ...state, ...updates };
      state.lastUpdate = new Date().toISOString();
      
      // Notify subscribers
      subscribers.forEach(callback => {
        try {
          callback(state, oldState);
        } catch (error) {
          console.error('MockStateService subscriber error:', error);
        }
      });
    },
    
    // Subscribe to state changes
    subscribe(callback) {
      subscribers.push(callback);
      
      // Return unsubscribe function
      return () => {
        const index = subscribers.indexOf(callback);
        if (index > -1) {
          subscribers.splice(index, 1);
        }
      };
    },
    
    // Add log entry
    addLog(logEntry) {
      const newLogs = [logEntry, ...state.logs].slice(0, 1000); // Keep last 1000 logs
      this.setState({ logs: newLogs });
    },
    
    // Update metrics
    updateMetrics(metrics) {
      this.setState({ metrics });
    },
    
    // Set current view
    setCurrentView(view) {
      this.setState({ currentView: view });
    },
    
    // Toggle sidebar
    toggleSidebar() {
      this.setState({ sidebarCollapsed: !state.sidebarCollapsed });
    },
    
    // Update filters
    updateFilters(filters) {
      this.setState({ filters: { ...state.filters, ...filters } });
    },
    
    // Set selected log
    setSelectedLog(log) {
      this.setState({ selectedLog: log });
    },
    
    // Set connection status
    setConnectionStatus(connected) {
      this.setState({ isConnected: connected });
    },
    
    // Initialize demo data
    initializeDemoData() {
      // Add sample logs
      Constants.DEMO_DATA.SAMPLE_LOGS.forEach(log => {
        this.addLog(log);
      });
      
      // Set initial metrics
      this.updateMetrics(Constants.DEMO_DATA.SAMPLE_METRICS);
      
      // Set connection status
      this.setConnectionStatus(true);
      
      console.log('MockStateService: Demo data initialized');
    },
    
    // Clear all data
    clearData() {
      this.setState({
        logs: [],
        metrics: {},
        selectedLog: null
      });
    },
    
    // Get filtered logs
    getFilteredLogs() {
      let filtered = [...state.logs];
      
      // Filter by level
      if (state.filters.level !== 'all') {
        filtered = filtered.filter(log => log.level === state.filters.level);
      }
      
      // Filter by source
      if (state.filters.source !== 'all') {
        filtered = filtered.filter(log => log.source === state.filters.source);
      }
      
      // Filter by search term
      if (state.filters.search) {
        const searchTerm = state.filters.search.toLowerCase();
        filtered = filtered.filter(log => 
          log.message.toLowerCase().includes(searchTerm) ||
          log.source.toLowerCase().includes(searchTerm)
        );
      }
      
      return filtered;
    },
    
    // Get metrics for specific source
    getMetricsForSource(source) {
      return state.metrics[source] || {};
    },
    
    // Get connection info
    getConnectionInfo() {
      return {
        connected: state.isConnected,
        lastUpdate: state.lastUpdate,
        isDemo: true
      };
    }
  };
})();
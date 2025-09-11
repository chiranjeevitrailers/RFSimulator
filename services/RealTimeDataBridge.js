// Overview: Real-time data bridge connecting CLI backend to frontend
// Dependencies: CLIBridge.js, StreamProcessor.js, EnhancedParser.js
// Zero-Risk: Feature flag controlled, graceful fallback, error isolation

const RealTimeDataBridge = (() => {
    try {
        let bridgeActive = false;
        let dataSubscribers = new Map();
        let bridgeMetrics = { messages: 0, errors: 0, lastActivity: null };

        return {
            // Initialize real-time data bridge
            initialize() {
                if (!FeatureFlags.isEnabled('REAL_TIME_PROCESSING')) {
                    return 'Real-time data bridge disabled';
                }

                try {
                    bridgeActive = true;
                    this.setupDataFlow();
                    this.startBridgeMonitoring();
                    
                    console.log('RealTimeDataBridge: Bridge initialized');
                    return 'Real-time data bridge initialized successfully';

                } catch (error) {
                    SafetyLayer.handleError(error, 'data_bridge');
                    return 'Failed to initialize real-time data bridge';
                }
            },

            // Setup data flow from CLI to frontend
            setupDataFlow() {
                try {
                    // Connect to CLI Bridge for incoming data
                    if (typeof CLIBridge !== 'undefined') {
                        this.connectToCLIBridge();
                    }

                    // Connect to WebSocket for outgoing data
                    if (typeof WebSocketService !== 'undefined') {
                        this.connectToWebSocket();
                    }

                    // Initialize stream processing
                    if (typeof StreamProcessor !== 'undefined') {
                        StreamProcessor.startProcessing();
                    }

                } catch (error) {
                    SafetyLayer.handleError(error, 'data_bridge');
                }
            },

            // Connect to CLI Bridge for data input
            connectToCLIBridge() {
                try {
                    // Monitor CLI Bridge for new data
                    const checkInterval = setInterval(() => {
                        if (!bridgeActive) {
                            clearInterval(checkInterval);
                            return;
                        }

                        this.processCLIData();
                    }, 500); // Check every 500ms

                } catch (error) {
                    SafetyLayer.handleError(error, 'data_bridge');
                }
            },

            // Process incoming CLI data
            processCLIData() {
                try {
                    if (typeof CLIBridge === 'undefined') return;

                    const bufferedData = CLIBridge.getBufferedData(10);
                    if (bufferedData.length === 0) return;

                    bufferedData.forEach(dataItem => {
                        this.processDataItem(dataItem);
                    });

                    bridgeMetrics.lastActivity = Date.now();

                } catch (error) {
                    bridgeMetrics.errors++;
                    SafetyLayer.handleError(error, 'data_bridge');
                }
            },

            // Process individual data item
            processDataItem(dataItem) {
                try {
                    bridgeMetrics.messages++;

                    // Enhanced parsing if enabled
                    let processedData = dataItem;
                    if (FeatureFlags.isEnabled('ENHANCED_PARSING') && 
                        typeof EnhancedParser !== 'undefined') {
                        
                        const parsed = EnhancedParser.parseMetrics(dataItem.source, dataItem.data);
                        if (parsed) {
                            processedData = { ...dataItem, enhanced: parsed };
                        }
                    }

                    // Add to stream processor
                    if (typeof StreamProcessor !== 'undefined') {
                        StreamProcessor.addToStream(dataItem.source, processedData);
                    }

                    // Notify subscribers
                    this.notifySubscribers('data_processed', processedData);

                } catch (error) {
                    bridgeMetrics.errors++;
                    SafetyLayer.handleError(error, 'data_bridge');
                }
            },

            // Connect to WebSocket for data output
            connectToWebSocket() {
                try {
                    if (!FeatureFlags.isEnabled('WEBSOCKET_STREAMING')) return;

                    // Subscribe to processed data events
                    this.subscribe('data_processed', (data) => {
                        if (typeof WebSocketService !== 'undefined') {
                            WebSocketService.broadcastMessage('realtime_data', data);
                        }
                    });

                } catch (error) {
                    SafetyLayer.handleError(error, 'data_bridge');
                }
            },

            // Start bridge monitoring
            startBridgeMonitoring() {
                try {
                    const monitorInterval = setInterval(() => {
                        if (!bridgeActive) {
                            clearInterval(monitorInterval);
                            return;
                        }

                        this.performHealthCheck();
                    }, 10000); // Monitor every 10 seconds

                } catch (error) {
                    SafetyLayer.handleError(error, 'data_bridge');
                }
            },

            // Perform bridge health check
            performHealthCheck() {
                try {
                    const now = Date.now();
                    const maxInactivity = 30000; // 30 seconds

                    if (bridgeMetrics.lastActivity && 
                        now - bridgeMetrics.lastActivity > maxInactivity) {
                        console.warn('RealTimeDataBridge: No activity detected');
                    }

                    // Check component availability
                    const components = {
                        cliBridge: typeof CLIBridge !== 'undefined',
                        streamProcessor: typeof StreamProcessor !== 'undefined',
                        webSocket: typeof WebSocketService !== 'undefined',
                        enhancedParser: typeof EnhancedParser !== 'undefined'
                    };

                    console.log('RealTimeDataBridge health:', components);

                } catch (error) {
                    SafetyLayer.handleError(error, 'data_bridge');
                }
            },

            // Subscribe to bridge events
            subscribe(eventType, callback) {
                try {
                    if (!dataSubscribers.has(eventType)) {
                        dataSubscribers.set(eventType, []);
                    }
                    dataSubscribers.get(eventType).push(callback);

                } catch (error) {
                    SafetyLayer.handleError(error, 'data_bridge');
                }
            },

            // Notify event subscribers
            notifySubscribers(eventType, data) {
                try {
                    const callbacks = dataSubscribers.get(eventType) || [];
                    callbacks.forEach(callback => {
                        try {
                            callback(data);
                        } catch (error) {
                            SafetyLayer.handleError(error, 'data_bridge');
                        }
                    });

                } catch (error) {
                    SafetyLayer.handleError(error, 'data_bridge');
                }
            },

            // Get bridge status
            getStatus() {
                return {
                    active: bridgeActive,
                    metrics: { ...bridgeMetrics },
                    subscribers: dataSubscribers.size,
                    featureFlags: {
                        realTimeProcessing: FeatureFlags.isEnabled('REAL_TIME_PROCESSING'),
                        websocketStreaming: FeatureFlags.isEnabled('WEBSOCKET_STREAMING'),
                        enhancedParsing: FeatureFlags.isEnabled('ENHANCED_PARSING')
                    }
                };
            },

            // Shutdown bridge
            shutdown() {
                try {
                    bridgeActive = false;
                    dataSubscribers.clear();
                    
                    console.log('RealTimeDataBridge: Bridge shutdown');
                    return 'Real-time data bridge shutdown successfully';

                } catch (error) {
                    SafetyLayer.handleError(error, 'data_bridge');
                    return 'Error during bridge shutdown';
                }
            }
        };

    } catch (error) {
        console.error('RealTimeDataBridge initialization error:', error);
        reportError(error);
        // Safe fallback
        return {
            initialize: () => 'RealTimeDataBridge unavailable',
            subscribe: () => {},
            getStatus: () => ({ active: false, error: 'Unavailable' }),
            shutdown: () => 'No bridge to shutdown'
        };
    }
})();

// Overview: Real-time data stream processing for CLI integration
// Dependencies: DataAdapter.js, SafetyLayer.js | Defines: Stream processing
// Zero-Risk: Feature flag controlled, buffered processing, graceful fallback

const StreamProcessor = (() => {
    try {
        let processingActive = false;
        let streamBuffer = [];
        let processors = new Map();
        let metrics = { processed: 0, errors: 0, lastProcess: null };

        return {
            // Start stream processing
            startProcessing() {
                if (!FeatureFlags.isEnabled('REAL_TIME_PROCESSING')) {
                    return 'Real-time processing disabled';
                }

                try {
                    processingActive = true;
                    this.initializeProcessors();
                    this.startProcessingLoop();
                    
                    console.log('StreamProcessor: Processing started');
                    return 'Stream processing started successfully';

                } catch (error) {
                    SafetyLayer.handleError(error, 'stream_processor');
                    return 'Failed to start stream processing';
                }
            },

            // Initialize data processors for different sources
            initializeProcessors() {
                try {
                    // srsRAN data processor
                    processors.set('srsran', (data) => {
                        const adapted = DataAdapter.adaptSrsranData(data);
                        if (adapted) this.emitProcessedData('srsran_processed', adapted);
                    });

                    // Open5GS data processor
                    processors.set('open5gs', (data) => {
                        const adapted = DataAdapter.adaptOpen5gsData(data);
                        if (adapted) this.emitProcessedData('open5gs_processed', adapted);
                    });

                    // Kamailio data processor
                    processors.set('kamailio', (data) => {
                        const adapted = DataAdapter.adaptKamailioData(data);
                        if (adapted) this.emitProcessedData('kamailio_processed', adapted);
                    });

                } catch (error) {
                    SafetyLayer.handleError(error, 'stream_processor');
                }
            },

            // Start processing loop
            startProcessingLoop() {
                try {
                    const processInterval = setInterval(() => {
                        if (!processingActive) {
                            clearInterval(processInterval);
                            return;
                        }

                        this.processBatch();
                    }, 100); // Process every 100ms

                } catch (error) {
                    SafetyLayer.handleError(error, 'stream_processor');
                }
            },

            // Process buffered data in batches
            processBatch() {
                try {
                    if (streamBuffer.length === 0) return;

                    const batchSize = ConfigManager.get('stream.batchSize', 10);
                    const batch = streamBuffer.splice(0, batchSize);

                    batch.forEach(item => {
                        this.processStreamItem(item);
                    });

                    metrics.lastProcess = Date.now();

                } catch (error) {
                    SafetyLayer.handleError(error, 'stream_processor');
                }
            },

            // Process individual stream item
            processStreamItem(item) {
                try {
                    const processor = processors.get(item.source);
                    if (processor) {
                        processor(item.data);
                        metrics.processed++;
                    } else {
                        console.warn(`StreamProcessor: No processor for source ${item.source}`);
                    }

                } catch (error) {
                    metrics.errors++;
                    SafetyLayer.handleError(error, 'stream_processor');
                }
            },

            // Add data to processing stream
            addToStream(source, data) {
                if (!FeatureFlags.isEnabled('REAL_TIME_PROCESSING')) return;

                try {
                    const streamItem = {
                        timestamp: Date.now(),
                        source,
                        data
                    };

                    streamBuffer.push(streamItem);

                    // Limit buffer size
                    const maxBuffer = ConfigManager.get('stream.maxBuffer', 1000);
                    if (streamBuffer.length > maxBuffer) {
                        streamBuffer = streamBuffer.slice(-maxBuffer);
                    }

                } catch (error) {
                    SafetyLayer.handleError(error, 'stream_processor');
                }
            },

            // Emit processed data to subscribers
            emitProcessedData(eventType, data) {
                try {
                    // Use RealTimeProcessor if available
                    if (typeof RealTimeProcessor !== 'undefined') {
                        RealTimeProcessor.emit(eventType, data);
                    }

                    // Use WebSocketService if available
                    if (typeof WebSocketService !== 'undefined' && 
                        FeatureFlags.isEnabled('WEBSOCKET_STREAMING')) {
                        WebSocketService.broadcastMessage(eventType, data);
                    }

                } catch (error) {
                    SafetyLayer.handleError(error, 'stream_processor');
                }
            },

            // Stop stream processing
            stopProcessing() {
                try {
                    processingActive = false;
                    streamBuffer = [];
                    console.log('StreamProcessor: Processing stopped');
                    return 'Stream processing stopped';

                } catch (error) {
                    SafetyLayer.handleError(error, 'stream_processor');
                    return 'Error stopping stream processing';
                }
            },

            // Get processing metrics
            getMetrics() {
                return {
                    ...metrics,
                    bufferSize: streamBuffer.length,
                    processingActive,
                    processorsCount: processors.size
                };
            },

            // Clear processing buffer
            clearBuffer() {
                try {
                    streamBuffer = [];
                    return 'Stream buffer cleared';
                } catch (error) {
                    SafetyLayer.handleError(error, 'stream_processor');
                    return 'Failed to clear buffer';
                }
            }
        };

    } catch (error) {
        console.error('StreamProcessor initialization error:', error);
        reportError(error);
        // Safe fallback
        return {
            startProcessing: () => 'StreamProcessor unavailable',
            stopProcessing: () => 'StreamProcessor unavailable',
            addToStream: () => {},
            getMetrics: () => ({ error: 'Unavailable' }),
            clearBuffer: () => 'Unavailable'
        };
    }
})();

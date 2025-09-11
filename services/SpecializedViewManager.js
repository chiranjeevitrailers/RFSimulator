// Overview: Manager for all specialized view processors
// Dependencies: All specialized processors | Defines: Unified processor management
// Zero-Risk: Feature flag controlled, graceful fallback, error isolation

const SpecializedViewManager = (() => {
    try {
        let managementActive = false;
        let processors = new Map();
        let processorStatus = new Map();

        return {
            // Initialize all specialized view processors
            initialize() {
                try {
                    managementActive = true;
                    this.initializeProcessors();
                    this.startHealthMonitoring();
                    
                    console.log('SpecializedViewManager: All processors initialized');
                    return 'Specialized view processors initialized successfully';

                } catch (error) {
                    SafetyLayer.handleError(error, 'view_manager');
                    return 'Failed to initialize specialized view processors';
                }
            },

            // Initialize individual processors
            initializeProcessors() {
                try {
                    // O-RAN processor
                    if (FeatureFlags.isEnabled('ORAN_ENHANCED_VIEWS') && 
                        typeof RealTimeOranProcessor !== 'undefined') {
                        processors.set('oran', RealTimeOranProcessor);
                        processorStatus.set('oran', RealTimeOranProcessor.initialize());
                    }

                    // NB-IoT processor
                    if (FeatureFlags.isEnabled('NBIOT_SPECIALIZED_VIEWS') && 
                        typeof NbiotRealTimeProcessor !== 'undefined') {
                        processors.set('nbiot', NbiotRealTimeProcessor);
                        processorStatus.set('nbiot', NbiotRealTimeProcessor.initialize());
                    }

                    // V2X processor
                    if (FeatureFlags.isEnabled('V2X_SIDELINK_ANALYSIS') && 
                        typeof V2xRealTimeProcessor !== 'undefined') {
                        processors.set('v2x', V2xRealTimeProcessor);
                        processorStatus.set('v2x', V2xRealTimeProcessor.initialize());
                    }

                    // NTN processor
                    if (FeatureFlags.isEnabled('NTN_SATELLITE_TRACKING') && 
                        typeof NtnRealTimeProcessor !== 'undefined') {
                        processors.set('ntn', NtnRealTimeProcessor);
                        processorStatus.set('ntn', NtnRealTimeProcessor.initialize());
                    }

                } catch (error) {
                    SafetyLayer.handleError(error, 'view_manager');
                }
            },

            // Start health monitoring for all processors
            startHealthMonitoring() {
                try {
                    setInterval(() => {
                        if (!managementActive) return;
                        this.checkProcessorHealth();
                    }, 30000); // Check every 30 seconds

                } catch (error) {
                    SafetyLayer.handleError(error, 'view_manager');
                }
            },

            // Check health of all processors
            checkProcessorHealth() {
                try {
                    processors.forEach((processor, name) => {
                        if (processor && typeof processor.getMetrics === 'function') {
                            const metrics = processor.getMetrics();
                            processorStatus.set(name, {
                                active: metrics.processingActive || false,
                                lastCheck: Date.now(),
                                metrics
                            });
                        }
                    });

                } catch (error) {
                    SafetyLayer.handleError(error, 'view_manager');
                }
            },

            // Get processor by name
            getProcessor(name) {
                return processors.get(name) || null;
            },

            // Get all processor statuses
            getAllStatus() {
                const status = {};
                processorStatus.forEach((value, key) => {
                    status[key] = value;
                });
                return status;
            },

            // Get manager metrics
            getManagerMetrics() {
                return {
                    managementActive,
                    totalProcessors: processors.size,
                    activeProcessors: Array.from(processorStatus.values())
                        .filter(status => status.active).length,
                    lastHealthCheck: Date.now()
                };
            },

            // Stop specific processor
            stopProcessor(name) {
                try {
                    const processor = processors.get(name);
                    if (processor && typeof processor.stop === 'function') {
                        const result = processor.stop();
                        processorStatus.set(name, { active: false, stopped: Date.now() });
                        return result;
                    }
                    return `Processor ${name} not found`;

                } catch (error) {
                    SafetyLayer.handleError(error, 'view_manager');
                    return `Error stopping processor ${name}`;
                }
            },

            // Stop all processors
            stopAll() {
                try {
                    managementActive = false;
                    let results = [];

                    processors.forEach((processor, name) => {
                        if (processor && typeof processor.stop === 'function') {
                            results.push(`${name}: ${processor.stop()}`);
                        }
                    });

                    processors.clear();
                    processorStatus.clear();

                    console.log('SpecializedViewManager: All processors stopped');
                    return results.join(', ');

                } catch (error) {
                    SafetyLayer.handleError(error, 'view_manager');
                    return 'Error stopping processors';
                }
            }
        };

    } catch (error) {
        console.error('SpecializedViewManager initialization error:', error);
        reportError(error);
        // Safe fallback
        return {
            initialize: () => 'SpecializedViewManager unavailable',
            getProcessor: () => null,
            getAllStatus: () => ({}),
            getManagerMetrics: () => ({ error: 'Unavailable' }),
            stopProcessor: () => 'Manager unavailable',
            stopAll: () => 'Manager unavailable'
        };
    }
})();

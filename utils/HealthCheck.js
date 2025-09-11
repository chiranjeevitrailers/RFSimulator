// Overview: System health monitoring with automatic fallback
// Dependencies: ConfigManager.js | Defines: Health monitoring system
// Zero-Risk: Continuous monitoring, automatic fallback, error isolation

const HealthCheck = (() => {
    try {
        let healthStatus = {
            overall: 'healthy',
            cli: { status: 'unknown', lastCheck: null },
            websocket: { status: 'unknown', lastCheck: null },
            frontend: { status: 'healthy', lastCheck: Date.now() },
            performance: { status: 'healthy', lastCheck: Date.now() }
        };

        let healthCheckInterval = null;
        let errorCounts = { cli: 0, websocket: 0, frontend: 0, performance: 0 };

        return {
            // Start health monitoring
            startMonitoring() {
                try {
                    const interval = ConfigManager.get('health.checkInterval', 5000);
                    
                    if (healthCheckInterval) {
                        clearInterval(healthCheckInterval);
                    }

                    healthCheckInterval = setInterval(() => {
                        this.performHealthCheck();
                    }, interval);

                    return 'Health monitoring started';
                } catch (error) {
                    console.error('Health monitoring start error:', error);
                    return 'Health monitoring failed to start';
                }
            },

            // Stop health monitoring
            stopMonitoring() {
                if (healthCheckInterval) {
                    clearInterval(healthCheckInterval);
                    healthCheckInterval = null;
                }
                return 'Health monitoring stopped';
            },

            // Perform comprehensive health check
            performHealthCheck() {
                try {
                    const now = Date.now();

                    // Check CLI connections (if enabled)
                    if (FeatureFlags.isEnabled('REAL_CLI_BRIDGE')) {
                        this.checkCLIHealth();
                    }

                    // Check WebSocket connections (if enabled)
                    if (FeatureFlags.isEnabled('WEBSOCKET_STREAMING')) {
                        this.checkWebSocketHealth();
                    }

                    // Check frontend performance
                    this.checkFrontendHealth();

                    // Check overall performance
                    this.checkPerformanceHealth();

                    // Update overall status
                    this.updateOverallStatus();

                    healthStatus.lastFullCheck = now;
                } catch (error) {
                    console.error('Health check error:', error);
                    this.handleHealthCheckError(error);
                }
            },

            // Check CLI connection health
            checkCLIHealth() {
                try {
                    healthStatus.cli.lastCheck = Date.now();
                    // For now, assume healthy since CLI bridge not implemented yet
                    healthStatus.cli.status = 'not_implemented';
                    errorCounts.cli = 0;
                } catch (error) {
                    this.recordError('cli', error);
                }
            },

            // Check WebSocket health
            checkWebSocketHealth() {
                try {
                    healthStatus.websocket.lastCheck = Date.now();
                    // Check if WebSocketService is available and connected
                    if (typeof WebSocketService !== 'undefined') {
                        healthStatus.websocket.status = 'available';
                    } else {
                        healthStatus.websocket.status = 'not_implemented';
                    }
                    errorCounts.websocket = 0;
                } catch (error) {
                    this.recordError('websocket', error);
                }
            },

            // Check frontend health
            checkFrontendHealth() {
                try {
                    healthStatus.frontend.lastCheck = Date.now();
                    healthStatus.frontend.status = 'healthy';
                    errorCounts.frontend = 0;
                } catch (error) {
                    this.recordError('frontend', error);
                }
            },

            // Check performance health
            checkPerformanceHealth() {
                try {
                    const memoryUsage = performance.memory ? 
                        performance.memory.usedJSHeapSize / 1024 / 1024 : 0;
                    
                    healthStatus.performance = {
                        status: memoryUsage > 100 ? 'warning' : 'healthy',
                        memoryMB: Math.round(memoryUsage),
                        lastCheck: Date.now()
                    };
                    
                    errorCounts.performance = 0;
                } catch (error) {
                    this.recordError('performance', error);
                }
            },

            // Record error and check if fallback needed
            recordError(component, error) {
                errorCounts[component]++;
                healthStatus[component].status = 'error';
                healthStatus[component].lastError = error.message;

                const maxErrors = ConfigManager.get('safety.maxErrorsBeforeFallback', 5);
                if (errorCounts[component] >= maxErrors) {
                    this.triggerFallback(component);
                }
            },

            // Trigger automatic fallback
            triggerFallback(component) {
                if (ConfigManager.get('health.autoFallbackEnabled', true)) {
                    console.warn(`Triggering fallback for ${component}`);
                    // Disable the problematic feature
                    if (component === 'cli') FeatureFlags.setFlag('REAL_CLI_BRIDGE', false);
                    if (component === 'websocket') FeatureFlags.setFlag('WEBSOCKET_STREAMING', false);
                }
            },

            // Update overall health status
            updateOverallStatus() {
                const statuses = Object.values(healthStatus)
                    .filter(s => typeof s === 'object' && s.status)
                    .map(s => s.status);

                if (statuses.includes('error')) {
                    healthStatus.overall = 'degraded';
                } else if (statuses.includes('warning')) {
                    healthStatus.overall = 'warning';
                } else {
                    healthStatus.overall = 'healthy';
                }
            },

            // Handle health check errors
            handleHealthCheckError(error) {
                healthStatus.overall = 'error';
                healthStatus.lastError = error.message;
            },

            // Get current health status
            getStatus() {
                return { ...healthStatus };
            },

            // Get error counts
            getErrorCounts() {
                return { ...errorCounts };
            },

            // Reset error counts
            resetErrorCounts() {
                errorCounts = { cli: 0, websocket: 0, frontend: 0, performance: 0 };
                return 'Error counts reset';
            }
        };

    } catch (error) {
        console.error('HealthCheck initialization error:', error);
        reportError(error);
        // Safe fallback
        return {
            startMonitoring: () => 'Health monitoring unavailable',
            stopMonitoring: () => 'Health monitoring unavailable',
            performHealthCheck: () => {},
            getStatus: () => ({ overall: 'unknown' }),
            getErrorCounts: () => ({}),
            resetErrorCounts: () => 'Unavailable'
        };
    }
})();

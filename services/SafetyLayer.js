// Overview: Error isolation and automatic fallback management
// Dependencies: FeatureFlags.js, ConfigManager.js, HealthCheck.js
// Zero-Risk: Isolates errors, prevents cascading failures, automatic recovery

const SafetyLayer = (() => {
    try {
        let errorLog = [];
        let fallbackActive = false;
        let recoveryAttempts = {};

        return {
            // Wrap function with error isolation
            wrapFunction(fn, fallbackFn, context = 'unknown') {
                return (...args) => {
                    try {
                        return fn.apply(this, args);
                    } catch (error) {
                        this.handleError(error, context);
                        return fallbackFn ? fallbackFn.apply(this, args) : null;
                    }
                };
            },

            // Handle errors with isolation and fallback
            handleError(error, context = 'unknown') {
                try {
                    const errorEntry = {
                        timestamp: Date.now(),
                        context,
                        message: error.message,
                        stack: error.stack,
                        id: Date.now() + Math.random()
                    };

                    this.logError(errorEntry);
                    this.checkFallbackTrigger(context);
                    
                    // Don't call reportError here to avoid infinite loops
                    console.error(`SafetyLayer: Error in ${context}:`, error);

                } catch (safetyError) {
                    console.error('SafetyLayer: Error in error handling:', safetyError);
                }
            },

            // Log error with rotation
            logError(errorEntry) {
                errorLog.push(errorEntry);
                
                // Keep only last 100 errors to prevent memory issues
                if (errorLog.length > 100) {
                    errorLog = errorLog.slice(-100);
                }
            },

            // Check if fallback should be triggered
            checkFallbackTrigger(context) {
                const recentErrors = this.getRecentErrors(context, 60000); // Last minute
                const maxErrors = ConfigManager.get('safety.maxErrorsBeforeFallback', 5);

                if (recentErrors.length >= maxErrors) {
                    this.triggerFallback(context);
                }
            },

            // Get recent errors for context
            getRecentErrors(context, timeWindow = 60000) {
                const cutoff = Date.now() - timeWindow;
                return errorLog.filter(error => 
                    error.context === context && error.timestamp > cutoff
                );
            },

            // Trigger fallback for context
            triggerFallback(context) {
                if (fallbackActive) return;

                try {
                    fallbackActive = true;
                    console.warn(`SafetyLayer: Triggering fallback for ${context}`);

                    // Context-specific fallback actions
                    switch (context) {
                        case 'cli':
                            FeatureFlags.setFlag('REAL_CLI_BRIDGE', false);
                            break;
                        case 'websocket':
                            FeatureFlags.setFlag('WEBSOCKET_STREAMING', false);
                            break;
                        case 'parsing':
                            FeatureFlags.setFlag('ENHANCED_PARSING', false);
                            break;
                        default:
                            // General fallback - disable all new features
                            FeatureFlags.emergencyDisable();
                    }

                    this.scheduleRecovery(context);

                } catch (error) {
                    console.error('SafetyLayer: Error in fallback trigger:', error);
                }
            },

            // Schedule automatic recovery attempt
            scheduleRecovery(context) {
                const recoveryDelay = ConfigManager.get('safety.recoveryDelay', 30000);
                
                setTimeout(() => {
                    this.attemptRecovery(context);
                }, recoveryDelay);
            },

            // Attempt automatic recovery
            attemptRecovery(context) {
                if (!ConfigManager.get('safety.enableAutoRecovery', true)) return;

                try {
                    recoveryAttempts[context] = (recoveryAttempts[context] || 0) + 1;
                    const maxAttempts = ConfigManager.get('safety.maxRecoveryAttempts', 3);

                    if (recoveryAttempts[context] > maxAttempts) {
                        console.warn(`SafetyLayer: Max recovery attempts reached for ${context}`);
                        return;
                    }

                    // Check if system is stable
                    const recentErrors = this.getRecentErrors(context, 300000); // Last 5 minutes
                    if (recentErrors.length === 0) {
                        console.info(`SafetyLayer: Attempting recovery for ${context}`);
                        fallbackActive = false;
                        
                        // Context-specific recovery
                        this.performRecovery(context);
                    } else {
                        // System still unstable, schedule another recovery attempt
                        this.scheduleRecovery(context);
                    }

                } catch (error) {
                    console.error('SafetyLayer: Error in recovery attempt:', error);
                }
            },

            // Perform context-specific recovery
            performRecovery(context) {
                try {
                    switch (context) {
                        case 'cli':
                            if (HealthCheck.getStatus().cli.status === 'healthy') {
                                FeatureFlags.setFlag('REAL_CLI_BRIDGE', true);
                            }
                            break;
                        case 'websocket':
                            if (HealthCheck.getStatus().websocket.status === 'healthy') {
                                FeatureFlags.setFlag('WEBSOCKET_STREAMING', true);
                            }
                            break;
                        case 'parsing':
                            FeatureFlags.setFlag('ENHANCED_PARSING', true);
                            break;
                    }
                } catch (error) {
                    console.error('SafetyLayer: Error in recovery:', error);
                }
            },

            // Get error statistics
            getErrorStats() {
                const now = Date.now();
                const oneHour = 60 * 60 * 1000;
                const recentErrors = errorLog.filter(e => now - e.timestamp < oneHour);

                const byContext = {};
                recentErrors.forEach(error => {
                    byContext[error.context] = (byContext[error.context] || 0) + 1;
                });

                return {
                    totalErrors: errorLog.length,
                    recentErrors: recentErrors.length,
                    byContext,
                    fallbackActive,
                    recoveryAttempts: { ...recoveryAttempts }
                };
            },

            // Clear error log
            clearErrorLog() {
                errorLog = [];
                recoveryAttempts = {};
                fallbackActive = false;
                return 'Error log cleared';
            },

            // Check if system is in safe state
            isSafeState() {
                const recentErrors = this.getRecentErrors('any', 60000);
                const maxRecentErrors = ConfigManager.get('safety.maxRecentErrors', 10);
                return recentErrors.length < maxRecentErrors && !fallbackActive;
            }
        };

    } catch (error) {
        console.error('SafetyLayer initialization error:', error);
        reportError(error);
        // Safe fallback
        return {
            wrapFunction: (fn, fallback) => fallback || (() => null),
            handleError: (error, context) => console.error('SafetyLayer unavailable:', error),
            getErrorStats: () => ({ totalErrors: 0, recentErrors: 0 }),
            clearErrorLog: () => 'SafetyLayer unavailable',
            isSafeState: () => false
        };
    }
})();

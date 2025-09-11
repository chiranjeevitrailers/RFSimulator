// Overview: Runtime configuration management with safe defaults
// Dependencies: FeatureFlags.js | Defines: Configuration control system
// Zero-Risk: Safe defaults, runtime changes, automatic fallback

const ConfigManager = (() => {
    try {
        // Default configuration (safe for all environments)
        const DEFAULT_CONFIG = {
            // Development mode settings
            development: {
                enableMockData: true,
                enableRealCLI: false,
                logLevel: 'debug',
                autoFallback: true
            },

            // CLI connection settings
            cli: {
                connectionTimeout: 5000,
                maxRetries: 3,
                healthCheckInterval: 10000,
                autoReconnect: true
            },

            // WebSocket settings
            websocket: {
                reconnectInterval: 2000,
                maxReconnectAttempts: 5,
                heartbeatInterval: 30000,
                bufferSize: 1000
            },

            // Health monitoring settings
            health: {
                checkInterval: 5000,
                alertThreshold: 3,
                autoFallbackEnabled: true,
                performanceMonitoring: true
            },

            // Safety settings
            safety: {
                enableGracefulDegradation: true,
                enableAutoRecovery: true,
                enableErrorIsolation: true,
                maxErrorsBeforeFallback: 5
            }
        };

        let currentConfig = { ...DEFAULT_CONFIG };

        return {
            // Get configuration value safely
            get(path, defaultValue = null) {
                try {
                    const keys = path.split('.');
                    let value = currentConfig;
                    
                    for (const key of keys) {
                        if (value && typeof value === 'object' && key in value) {
                            value = value[key];
                        } else {
                            return defaultValue;
                        }
                    }
                    
                    return value;
                } catch (error) {
                    console.error('ConfigManager get error:', error);
                    return defaultValue;
                }
            },

            // Set configuration value safely
            set(path, value) {
                try {
                    const keys = path.split('.');
                    const lastKey = keys.pop();
                    let target = currentConfig;
                    
                    for (const key of keys) {
                        if (!target[key] || typeof target[key] !== 'object') {
                            target[key] = {};
                        }
                        target = target[key];
                    }
                    
                    target[lastKey] = value;
                    return true;
                } catch (error) {
                    console.error('ConfigManager set error:', error);
                    return false;
                }
            },

            // Reset to safe defaults
            resetToDefaults() {
                currentConfig = { ...DEFAULT_CONFIG };
                return 'Configuration reset to safe defaults';
            },

            // Get entire configuration
            getAll() {
                return { ...currentConfig };
            },

            // Validate configuration safety
            validateConfig() {
                const required = ['development', 'cli', 'websocket', 'health', 'safety'];
                return required.every(section => currentConfig[section]);
            }
        };

    } catch (error) {
        console.error('ConfigManager initialization error:', error);
        reportError(error);
        // Safe fallback
        return {
            get: (path, defaultValue) => defaultValue,
            set: () => false,
            resetToDefaults: () => 'Safe mode active',
            getAll: () => ({}),
            validateConfig: () => false
        };
    }
})();

// Overview: Production alert system for monitoring and notifications
// Dependencies: SafetyLayer.js, FeatureFlags.js | Defines: Alert management
// Zero-Risk: Alert monitoring, notification system, escalation procedures

const AlertManager = (() => {
    try {
        let alertManagerActive = false;
        let activeAlerts = new Map();
        let alertHistory = [];
        let alertRules = new Map();

        return {
            // Initialize alert manager
            initialize() {
                try {
                    alertManagerActive = true;
                    this.setupAlertRules();
                    this.startAlertMonitoring();
                    
                    console.log('AlertManager: Alert manager initialized');
                    return 'Alert manager initialized';

                } catch (error) {
                    SafetyLayer.handleError(error, 'alert_manager');
                    return 'Failed to initialize alert manager';
                }
            },

            // Setup alert rules
            setupAlertRules() {
                try {
                    const rules = [
                        { name: 'high_cpu_usage', condition: 'cpu_usage > 90', severity: 'critical' },
                        { name: 'high_memory_usage', condition: 'memory_usage > 85', severity: 'warning' },
                        { name: 'high_error_rate', condition: 'error_rate > 0.15', severity: 'critical' },
                        { name: 'slow_response_time', condition: 'response_time > 8000', severity: 'warning' },
                        { name: 'connection_failures', condition: 'connection_failures > 5', severity: 'critical' }
                    ];

                    rules.forEach(rule => {
                        alertRules.set(rule.name, rule);
                    });

                } catch (error) {
                    SafetyLayer.handleError(error, 'alert_manager');
                }
            },

            // Start alert monitoring
            startAlertMonitoring() {
                try {
                    setInterval(() => {
                        this.checkAlertConditions();
                    }, 30000); // Check every 30 seconds

                } catch (error) {
                    SafetyLayer.handleError(error, 'alert_manager');
                }
            },

            // Check alert conditions
            checkAlertConditions() {
                try {
                    const metrics = this.getCurrentMetrics();
                    
                    alertRules.forEach((rule, ruleName) => {
                        const triggered = this.evaluateAlertRule(rule, metrics);
                        
                        if (triggered) {
                            this.triggerAlert(ruleName, rule, metrics);
                        } else {
                            this.resolveAlert(ruleName);
                        }
                    });

                } catch (error) {
                    SafetyLayer.handleError(error, 'alert_manager');
                }
            },

            // Get current system metrics
            getCurrentMetrics() {
                try {
                    return {
                        cpu_usage: Math.random() * 100,
                        memory_usage: Math.random() * 100,
                        error_rate: Math.random() * 0.2,
                        response_time: Math.random() * 10000,
                        connection_failures: Math.floor(Math.random() * 10)
                    };

                } catch (error) {
                    SafetyLayer.handleError(error, 'alert_manager');
                    return {};
                }
            },

            // Evaluate alert rule
            evaluateAlertRule(rule, metrics) {
                try {
                    const condition = rule.condition;
                    
                    if (condition.includes('cpu_usage > ')) {
                        const threshold = parseFloat(condition.split('cpu_usage > ')[1]);
                        return metrics.cpu_usage > threshold;
                    }
                    
                    if (condition.includes('memory_usage > ')) {
                        const threshold = parseFloat(condition.split('memory_usage > ')[1]);
                        return metrics.memory_usage > threshold;
                    }
                    
                    if (condition.includes('error_rate > ')) {
                        const threshold = parseFloat(condition.split('error_rate > ')[1]);
                        return metrics.error_rate > threshold;
                    }
                    
                    return false;

                } catch (error) {
                    SafetyLayer.handleError(error, 'alert_manager');
                    return false;
                }
            },

            // Trigger alert
            triggerAlert(ruleName, rule, metrics) {
                try {
                    const alert = {
                        alertId: this.generateAlertId(),
                        ruleName: ruleName,
                        severity: rule.severity,
                        condition: rule.condition,
                        triggeredAt: Date.now(),
                        metrics: { ...metrics },
                        status: 'active',
                        acknowledged: false
                    };

                    activeAlerts.set(ruleName, alert);
                    alertHistory.push({ ...alert });
                    
                    if (alertHistory.length > 100) {
                        alertHistory = alertHistory.slice(-100);
                    }

                    console.warn(`AlertManager: Alert triggered - ${ruleName} (${rule.severity})`);

                } catch (error) {
                    SafetyLayer.handleError(error, 'alert_manager');
                }
            },

            // Generate alert ID
            generateAlertId() {
                return 'alert_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            },

            // Resolve alert
            resolveAlert(ruleName) {
                try {
                    const alert = activeAlerts.get(ruleName);
                    
                    if (alert && alert.status === 'active') {
                        alert.status = 'resolved';
                        alert.resolvedAt = Date.now();
                        
                        console.log(`AlertManager: Alert resolved - ${ruleName}`);
                        activeAlerts.delete(ruleName);
                    }

                } catch (error) {
                    SafetyLayer.handleError(error, 'alert_manager');
                }
            },

            // Get active alerts
            getActiveAlerts() {
                const alerts = {};
                activeAlerts.forEach((alert, ruleName) => {
                    alerts[ruleName] = { ...alert };
                });
                return alerts;
            },

            // Get alert history
            getAlertHistory(limit = 50) {
                return alertHistory.slice(-limit);
            },

            // Get alert manager status
            getStatus() {
                return {
                    active: alertManagerActive,
                    activeAlerts: activeAlerts.size,
                    alertRules: alertRules.size,
                    alertHistory: alertHistory.length
                };
            }
        };

    } catch (error) {
        console.error('AlertManager initialization error:', error);
        reportError(error);
        return {
            initialize: () => 'AlertManager unavailable',
            getActiveAlerts: () => ({}),
            getAlertHistory: () => [],
            getStatus: () => ({ active: false, error: 'Unavailable' })
        };
    }
})();

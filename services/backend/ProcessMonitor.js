// Overview: CLI process health monitoring with automatic recovery
// Dependencies: CLIManager.js, HealthCheck.js, SafetyLayer.js
// Zero-Risk: Continuous monitoring, automatic recovery, graceful degradation

const ProcessMonitor = (() => {
    try {
        let monitoringActive = false;
        let monitorInterval = null;
        let processMetrics = {};

        return {
            // Start monitoring CLI processes
            startMonitoring() {
                if (!FeatureFlags.isEnabled('REAL_CLI_BRIDGE')) {
                    return 'Process monitoring disabled - CLI bridge not enabled';
                }

                try {
                    if (monitoringActive) {
                        return 'Process monitoring already active';
                    }

                    monitoringActive = true;
                    const interval = ConfigManager.get('cli.healthCheckInterval', 10000);

                    monitorInterval = setInterval(() => {
                        this.performHealthCheck();
                    }, interval);

                    console.log('ProcessMonitor: Monitoring started');
                    return 'Process monitoring started successfully';

                } catch (error) {
                    SafetyLayer.handleError(error, 'process_monitor');
                    return 'Failed to start process monitoring';
                }
            },

            // Stop monitoring
            stopMonitoring() {
                try {
                    if (monitorInterval) {
                        clearInterval(monitorInterval);
                        monitorInterval = null;
                    }
                    
                    monitoringActive = false;
                    console.log('ProcessMonitor: Monitoring stopped');
                    return 'Process monitoring stopped';

                } catch (error) {
                    SafetyLayer.handleError(error, 'process_monitor');
                    return 'Error stopping process monitoring';
                }
            },

            // Perform health check on all processes
            performHealthCheck() {
                if (!FeatureFlags.isEnabled('REAL_CLI_BRIDGE')) return;

                try {
                    const processes = CLIManager.getProcessStatus();
                    const timestamp = Date.now();

                    Object.keys(processes).forEach(processName => {
                        const process = processes[processName];
                        this.checkProcessHealth(processName, process, timestamp);
                    });

                    this.updateOverallHealth();

                } catch (error) {
                    SafetyLayer.handleError(error, 'process_monitor');
                }
            },

            // Check individual process health
            checkProcessHealth(processName, process, timestamp) {
                try {
                    if (!processMetrics[processName]) {
                        processMetrics[processName] = {
                            lastHealthy: timestamp,
                            consecutiveFailures: 0,
                            totalChecks: 0,
                            healthyChecks: 0
                        };
                    }

                    const metrics = processMetrics[processName];
                    metrics.totalChecks++;

                    // Check process status
                    if (process.status === 'simulated' || process.status === 'running') {
                        metrics.healthyChecks++;
                        metrics.lastHealthy = timestamp;
                        metrics.consecutiveFailures = 0;
                    } else if (process.status === 'error' || process.status === 'stopped') {
                        metrics.consecutiveFailures++;
                        
                        // Trigger recovery if too many failures
                        const maxFailures = ConfigManager.get('cli.maxConsecutiveFailures', 3);
                        if (metrics.consecutiveFailures >= maxFailures) {
                            this.triggerProcessRecovery(processName);
                        }
                    }

                } catch (error) {
                    SafetyLayer.handleError(error, 'process_monitor');
                }
            },

            // Trigger process recovery
            triggerProcessRecovery(processName) {
                if (!ConfigManager.get('safety.enableAutoRecovery', true)) return;

                try {
                    console.warn(`ProcessMonitor: Triggering recovery for ${processName}`);

                    // Attempt to restart the process
                    switch (processName) {
                        case 'srsran':
                            CLIManager.startRanProcess();
                            break;
                        case 'open5gs':
                            CLIManager.startCoreProcess();
                            break;
                        case 'kamailio':
                            CLIManager.startImsProcess();
                            break;
                    }

                    // Reset failure count
                    if (processMetrics[processName]) {
                        processMetrics[processName].consecutiveFailures = 0;
                    }

                } catch (error) {
                    SafetyLayer.handleError(error, 'process_monitor');
                }
            },

            // Update overall health status
            updateOverallHealth() {
                try {
                    const processes = CLIManager.getProcessStatus();
                    const healthyProcesses = Object.values(processes)
                        .filter(p => p.status === 'simulated' || p.status === 'running').length;
                    
                    const totalProcesses = Object.keys(processes).length;
                    const healthPercentage = totalProcesses > 0 ? 
                        (healthyProcesses / totalProcesses) * 100 : 0;

                    // Update health check with process status
                    if (typeof HealthCheck !== 'undefined') {
                        if (healthPercentage >= 75) {
                            // Update CLI health as healthy
                        } else if (healthPercentage >= 50) {
                            // Update CLI health as warning
                        } else {
                            // Update CLI health as error
                        }
                    }

                } catch (error) {
                    SafetyLayer.handleError(error, 'process_monitor');
                }
            },

            // Get monitoring status
            getMonitoringStatus() {
                return {
                    active: monitoringActive,
                    metrics: { ...processMetrics },
                    lastCheck: monitorInterval ? Date.now() : null
                };
            },

            // Get process metrics
            getProcessMetrics(processName = null) {
                if (processName) {
                    return processMetrics[processName] || null;
                }
                return { ...processMetrics };
            },

            // Reset metrics
            resetMetrics() {
                processMetrics = {};
                return 'Process metrics reset';
            }
        };

    } catch (error) {
        console.error('ProcessMonitor initialization error:', error);
        reportError(error);
        // Safe fallback
        return {
            startMonitoring: () => 'ProcessMonitor unavailable',
            stopMonitoring: () => 'ProcessMonitor unavailable',
            performHealthCheck: () => {},
            getMonitoringStatus: () => ({ active: false }),
            getProcessMetrics: () => ({}),
            resetMetrics: () => 'Unavailable'
        };
    }
})();

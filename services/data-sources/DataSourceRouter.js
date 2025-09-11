// Overview: Route data requests to appropriate sources with health-based decisions
// Dependencies: DataSourceManager.js, CLIDataMerger.js | Defines: Intelligent routing
// Zero-Risk: Health-based routing, automatic failover, seamless user experience

const DataSourceRouter = (() => {
    try {
        let routerActive = false;
        let routingStats = new Map();
        let failoverHistory = [];

        return {
            // Initialize data source router
            initialize() {
                try {
                    routerActive = true;
                    this.initializeRoutingStats();
                    
                    console.log('DataSourceRouter: Data source router initialized');
                    return 'Data source router initialized';

                } catch (error) {
                    SafetyLayer.handleError(error, 'data_source_router');
                    return 'Failed to initialize data source router';
                }
            },

            // Initialize routing statistics
            initializeRoutingStats() {
                try {
                    const tools = ['srsran', 'open5gs', 'kamailio'];
                    
                    tools.forEach(tool => {
                        routingStats.set(tool, {
                            totalRequests: 0,
                            realDataRequests: 0,
                            cachedDataRequests: 0,
                            mockDataRequests: 0,
                            failoverCount: 0,
                            lastRequest: null
                        });
                    });

                } catch (error) {
                    SafetyLayer.handleError(error, 'data_source_router');
                }
            },

            // Route data request with intelligent decision making
            async routeRequest(tool, requestType = 'logs') {
                try {
                    const stats = routingStats.get(tool);
                    if (stats) {
                        stats.totalRequests++;
                        stats.lastRequest = Date.now();
                    }

                    // Determine best routing strategy
                    const routingDecision = await this.makeRoutingDecision(tool, requestType);
                    
                    // Execute routing decision
                    const result = await this.executeRouting(tool, routingDecision);
                    
                    // Update statistics
                    this.updateRoutingStats(tool, routingDecision.sourceType);
                    
                    return result;

                } catch (error) {
                    SafetyLayer.handleError(error, 'data_source_router');
                    return await this.getFallbackData(tool);
                }
            },

            // Make intelligent routing decision
            async makeRoutingDecision(tool, requestType) {
                try {
                    const decision = {
                        tool: tool,
                        requestType: requestType,
                        sourceType: 'mock', // Safe default
                        reasoning: [],
                        confidence: 0.5
                    };

                    // Check if real CLI data is enabled and available
                    if (FeatureFlags.isEnabled(`REAL_${tool.toUpperCase()}_DATA`)) {
                        const realDataHealth = await this.checkRealDataHealth(tool);
                        
                        if (realDataHealth.available) {
                            decision.sourceType = 'real';
                            decision.confidence = realDataHealth.confidence;
                            decision.reasoning.push('Real CLI data available and healthy');
                        } else {
                            decision.reasoning.push('Real CLI data unavailable or unhealthy');
                            
                            // Check for cached data
                            const cachedDataHealth = await this.checkCachedDataHealth(tool);
                            if (cachedDataHealth.available) {
                                decision.sourceType = 'cached';
                                decision.confidence = cachedDataHealth.confidence;
                                decision.reasoning.push('Using cached real data');
                            } else {
                                decision.reasoning.push('No cached data available, using mock');
                            }
                        }
                    } else {
                        decision.reasoning.push('Real CLI data disabled, using mock');
                    }

                    return decision;

                } catch (error) {
                    SafetyLayer.handleError(error, 'data_source_router');
                    return { 
                        tool, 
                        requestType, 
                        sourceType: 'mock', 
                        reasoning: ['Error in routing decision'], 
                        confidence: 0.1 
                    };
                }
            },

            // Check real data health
            async checkRealDataHealth(tool) {
                try {
                    // Simulate health check
                    const isHealthy = Math.random() > 0.15; // 85% healthy rate
                    
                    return {
                        available: isHealthy,
                        confidence: isHealthy ? 0.9 : 0.1,
                        lastCheck: Date.now()
                    };

                } catch (error) {
                    SafetyLayer.handleError(error, 'data_source_router');
                    return { available: false, confidence: 0.0, lastCheck: Date.now() };
                }
            },

            // Check cached data health
            async checkCachedDataHealth(tool) {
                try {
                    // Simulate cached data availability
                    const hasCachedData = Math.random() > 0.3; // 70% cached availability
                    
                    return {
                        available: hasCachedData,
                        confidence: hasCachedData ? 0.7 : 0.0,
                        age: hasCachedData ? Math.floor(Math.random() * 300000) : null
                    };

                } catch (error) {
                    SafetyLayer.handleError(error, 'data_source_router');
                    return { available: false, confidence: 0.0, age: null };
                }
            },

            // Execute routing decision
            async executeRouting(tool, decision) {
                try {
                    let result = null;

                    switch (decision.sourceType) {
                        case 'real':
                            result = await DataSourceManager.getDataFromSource(tool, 'real');
                            break;
                        case 'cached':
                            result = await DataSourceManager.getDataFromSource(tool, 'cached');
                            break;
                        case 'mock':
                        default:
                            result = await DataSourceManager.getDataFromSource(tool, 'mock');
                            break;
                    }

                    // Handle failover if primary source fails
                    if (!result && decision.sourceType !== 'mock') {
                        result = await this.handleFailover(tool, decision.sourceType);
                    }

                    // Add routing metadata
                    if (result) {
                        result.routingDecision = decision;
                        result.routedAt = Date.now();
                    }

                    return result;

                } catch (error) {
                    SafetyLayer.handleError(error, 'data_source_router');
                    return await this.handleFailover(tool, 'error');
                }
            },

            // Handle failover to backup sources
            async handleFailover(tool, failedSourceType) {
                try {
                    this.recordFailover(tool, failedSourceType);
                    
                    // Update stats
                    const stats = routingStats.get(tool);
                    if (stats) stats.failoverCount++;

                    // Try fallback sequence: real -> cached -> mock
                    if (failedSourceType === 'real') {
                        const cachedResult = await DataSourceManager.getDataFromSource(tool, 'cached');
                        if (cachedResult) return cachedResult;
                    }

                    // Final fallback to mock
                    return await DataSourceManager.getDataFromSource(tool, 'mock');

                } catch (error) {
                    SafetyLayer.handleError(error, 'data_source_router');
                    return await this.getFallbackData(tool);
                }
            },

            // Record failover event
            recordFailover(tool, failedSourceType) {
                try {
                    const failoverEvent = {
                        timestamp: Date.now(),
                        tool: tool,
                        failedSource: failedSourceType,
                        reason: 'Source unavailable or returned null'
                    };

                    failoverHistory.push(failoverEvent);

                    // Limit history
                    if (failoverHistory.length > 100) {
                        failoverHistory = failoverHistory.slice(-100);
                    }

                    console.log(`DataSourceRouter: Failover for ${tool} from ${failedSourceType}`);

                } catch (error) {
                    SafetyLayer.handleError(error, 'data_source_router');
                }
            },

            // Update routing statistics
            updateRoutingStats(tool, sourceType) {
                try {
                    const stats = routingStats.get(tool);
                    if (!stats) return;

                    switch (sourceType) {
                        case 'real':
                            stats.realDataRequests++;
                            break;
                        case 'cached':
                            stats.cachedDataRequests++;
                            break;
                        case 'mock':
                            stats.mockDataRequests++;
                            break;
                    }

                } catch (error) {
                    SafetyLayer.handleError(error, 'data_source_router');
                }
            },

            // Get fallback data
            async getFallbackData(tool) {
                return {
                    source: 'fallback',
                    tool: tool,
                    timestamp: Date.now(),
                    data: `Emergency fallback data for ${tool}`,
                    error: 'All data sources unavailable'
                };
            },

            // Get routing statistics
            getRoutingStats() {
                const stats = {};
                routingStats.forEach((value, key) => {
                    stats[key] = { ...value };
                });
                return stats;
            },

            // Get failover history
            getFailoverHistory() {
                return [...failoverHistory];
            },

            // Get router status
            getStatus() {
                return {
                    active: routerActive,
                    toolsTracked: Array.from(routingStats.keys()),
                    failoverEventCount: failoverHistory.length,
                    routingStats: this.getRoutingStats()
                };
            }
        };

    } catch (error) {
        console.error('DataSourceRouter initialization error:', error);
        reportError(error);
        return {
            initialize: () => 'DataSourceRouter unavailable',
            routeRequest: async (tool) => ({ source: 'fallback', tool, error: 'Router unavailable' }),
            getRoutingStats: () => ({}),
            getFailoverHistory: () => [],
            getStatus: () => ({ active: false, error: 'Unavailable' })
        };
    }
})();

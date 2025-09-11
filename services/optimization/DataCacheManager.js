// Overview: Intelligent data caching for CLI operations
// Dependencies: SafetyLayer.js, FeatureFlags.js | Defines: Smart caching system
// Zero-Risk: Cache optimization, memory management, automatic cleanup

const DataCacheManager = (() => {
    try {
        let cacheManagerActive = false;
        let cacheStorage = new Map();
        let cacheMetrics = new Map();
        let cleanupInterval = null;

        return {
            // Initialize data cache manager
            initialize() {
                try {
                    cacheManagerActive = true;
                    this.initializeCacheStorage();
                    this.startCacheCleanup();
                    
                    console.log('DataCacheManager: Data cache manager initialized');
                    return 'Data cache manager initialized';

                } catch (error) {
                    SafetyLayer.handleError(error, 'data_cache_manager');
                    return 'Failed to initialize data cache manager';
                }
            },

            // Initialize cache storage
            initializeCacheStorage() {
                try {
                    const tools = ['srsran', 'open5gs', 'kamailio'];
                    
                    tools.forEach(tool => {
                        cacheStorage.set(tool, {
                            data: new Map(),
                            maxSize: 1000, // Maximum cache entries
                            ttl: 300000, // 5 minutes TTL
                            accessCount: new Map(),
                            lastAccess: new Map()
                        });

                        cacheMetrics.set(tool, {
                            hits: 0,
                            misses: 0,
                            evictions: 0,
                            totalSize: 0,
                            hitRate: 0
                        });
                    });

                } catch (error) {
                    SafetyLayer.handleError(error, 'data_cache_manager');
                }
            },

            // Start cache cleanup process
            startCacheCleanup() {
                try {
                    if (cleanupInterval) {
                        clearInterval(cleanupInterval);
                    }

                    cleanupInterval = setInterval(() => {
                        this.performCacheCleanup();
                    }, 60000); // Cleanup every minute

                } catch (error) {
                    SafetyLayer.handleError(error, 'data_cache_manager');
                }
            },

            // Get cached data
            get(tool, key) {
                try {
                    const cache = cacheStorage.get(tool);
                    const metrics = cacheMetrics.get(tool);
                    
                    if (!cache || !metrics) return null;

                    const cacheEntry = cache.data.get(key);
                    
                    if (!cacheEntry) {
                        metrics.misses++;
                        this.updateHitRate(tool, metrics);
                        return null;
                    }

                    // Check TTL
                    if (Date.now() - cacheEntry.timestamp > cache.ttl) {
                        cache.data.delete(key);
                        cache.accessCount.delete(key);
                        cache.lastAccess.delete(key);
                        metrics.misses++;
                        this.updateHitRate(tool, metrics);
                        return null;
                    }

                    // Update access tracking
                    cache.accessCount.set(key, (cache.accessCount.get(key) || 0) + 1);
                    cache.lastAccess.set(key, Date.now());
                    
                    metrics.hits++;
                    this.updateHitRate(tool, metrics);
                    
                    return cacheEntry.data;

                } catch (error) {
                    SafetyLayer.handleError(error, 'data_cache_manager');
                    return null;
                }
            },

            // Set cached data
            set(tool, key, data) {
                try {
                    const cache = cacheStorage.get(tool);
                    const metrics = cacheMetrics.get(tool);
                    
                    if (!cache || !metrics) return false;

                    // Check cache size limit
                    if (cache.data.size >= cache.maxSize) {
                        this.evictLeastUsed(tool, cache, metrics);
                    }

                    // Create cache entry
                    const cacheEntry = {
                        data: data,
                        timestamp: Date.now(),
                        size: this.calculateDataSize(data)
                    };

                    cache.data.set(key, cacheEntry);
                    cache.accessCount.set(key, 1);
                    cache.lastAccess.set(key, Date.now());
                    
                    metrics.totalSize += cacheEntry.size;
                    
                    return true;

                } catch (error) {
                    SafetyLayer.handleError(error, 'data_cache_manager');
                    return false;
                }
            },

            // Calculate data size (approximate)
            calculateDataSize(data) {
                try {
                    if (typeof data === 'string') {
                        return data.length * 2; // Approximate bytes for string
                    } else if (typeof data === 'object') {
                        return JSON.stringify(data).length * 2; // Approximate bytes for object
                    }
                    return 100; // Default size

                } catch (error) {
                    return 100;
                }
            },

            // Evict least used cache entry
            evictLeastUsed(tool, cache, metrics) {
                try {
                    let leastUsedKey = null;
                    let leastUsedCount = Infinity;
                    let oldestAccess = Date.now();

                    // Find least used entry
                    cache.accessCount.forEach((count, key) => {
                        const lastAccess = cache.lastAccess.get(key) || 0;
                        
                        if (count < leastUsedCount || (count === leastUsedCount && lastAccess < oldestAccess)) {
                            leastUsedKey = key;
                            leastUsedCount = count;
                            oldestAccess = lastAccess;
                        }
                    });

                    // Evict the entry
                    if (leastUsedKey) {
                        const entry = cache.data.get(leastUsedKey);
                        if (entry) {
                            metrics.totalSize -= entry.size;
                        }
                        
                        cache.data.delete(leastUsedKey);
                        cache.accessCount.delete(leastUsedKey);
                        cache.lastAccess.delete(leastUsedKey);
                        
                        metrics.evictions++;
                    }

                } catch (error) {
                    SafetyLayer.handleError(error, 'data_cache_manager');
                }
            },

            // Update hit rate
            updateHitRate(tool, metrics) {
                try {
                    const totalRequests = metrics.hits + metrics.misses;
                    metrics.hitRate = totalRequests > 0 ? metrics.hits / totalRequests : 0;

                } catch (error) {
                    SafetyLayer.handleError(error, 'data_cache_manager');
                }
            },

            // Perform cache cleanup
            performCacheCleanup() {
                try {
                    const now = Date.now();
                    
                    cacheStorage.forEach((cache, tool) => {
                        const metrics = cacheMetrics.get(tool);
                        if (!metrics) return;

                        const expiredKeys = [];
                        
                        // Find expired entries
                        cache.data.forEach((entry, key) => {
                            if (now - entry.timestamp > cache.ttl) {
                                expiredKeys.push(key);
                            }
                        });

                        // Remove expired entries
                        expiredKeys.forEach(key => {
                            const entry = cache.data.get(key);
                            if (entry) {
                                metrics.totalSize -= entry.size;
                            }
                            
                            cache.data.delete(key);
                            cache.accessCount.delete(key);
                            cache.lastAccess.delete(key);
                        });

                        if (expiredKeys.length > 0) {
                            console.log(`DataCacheManager: Cleaned up ${expiredKeys.length} expired entries for ${tool}`);
                        }
                    });

                } catch (error) {
                    SafetyLayer.handleError(error, 'data_cache_manager');
                }
            },

            // Clear cache for specific tool
            clearCache(tool) {
                try {
                    const cache = cacheStorage.get(tool);
                    const metrics = cacheMetrics.get(tool);
                    
                    if (cache && metrics) {
                        cache.data.clear();
                        cache.accessCount.clear();
                        cache.lastAccess.clear();
                        
                        metrics.totalSize = 0;
                        
                        console.log(`DataCacheManager: Cache cleared for ${tool}`);
                        return true;
                    }
                    
                    return false;

                } catch (error) {
                    SafetyLayer.handleError(error, 'data_cache_manager');
                    return false;
                }
            },

            // Clear all caches
            clearAllCaches() {
                try {
                    let clearedCount = 0;
                    
                    cacheStorage.forEach((_, tool) => {
                        if (this.clearCache(tool)) {
                            clearedCount++;
                        }
                    });

                    console.log(`DataCacheManager: Cleared ${clearedCount} caches`);
                    return { success: true, clearedCount: clearedCount };

                } catch (error) {
                    SafetyLayer.handleError(error, 'data_cache_manager');
                    return { success: false, clearedCount: 0 };
                }
            },

            // Get cache statistics
            getCacheStats(tool) {
                try {
                    const cache = cacheStorage.get(tool);
                    const metrics = cacheMetrics.get(tool);
                    
                    if (!cache || !metrics) return null;

                    return {
                        tool: tool,
                        size: cache.data.size,
                        maxSize: cache.maxSize,
                        totalSizeBytes: metrics.totalSize,
                        hits: metrics.hits,
                        misses: metrics.misses,
                        evictions: metrics.evictions,
                        hitRate: metrics.hitRate,
                        utilizationRate: cache.data.size / cache.maxSize
                    };

                } catch (error) {
                    SafetyLayer.handleError(error, 'data_cache_manager');
                    return null;
                }
            },

            // Get all cache statistics
            getAllCacheStats() {
                const stats = {};
                cacheStorage.forEach((_, tool) => {
                    stats[tool] = this.getCacheStats(tool);
                });
                return stats;
            },

            // Get cache manager status
            getStatus() {
                return {
                    active: cacheManagerActive,
                    cleanupRunning: !!cleanupInterval,
                    totalCaches: cacheStorage.size,
                    cacheStats: this.getAllCacheStats()
                };
            }
        };

    } catch (error) {
        console.error('DataCacheManager initialization error:', error);
        reportError(error);
        return {
            initialize: () => 'DataCacheManager unavailable',
            get: () => null,
            set: () => false,
            clearCache: () => false,
            clearAllCaches: () => ({ success: false, clearedCount: 0 }),
            getCacheStats: () => null,
            getAllCacheStats: () => ({}),
            getStatus: () => ({ active: false, error: 'Unavailable' })
        };
    }
})();

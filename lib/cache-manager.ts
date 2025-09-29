import { TestCase, TestExecutionResult } from './test-cases';

export interface CacheConfig {
  maxSize: number;
  ttl: number; // Time to live in milliseconds
  strategy: 'LRU' | 'LFU' | 'FIFO';
  enableCompression: boolean;
  enablePersistence: boolean;
  persistencePath?: string;
}

export interface CacheEntry<T> {
  key: string;
  value: T;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
  size: number;
  compressed?: boolean;
}

export interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  totalSize: number;
  entryCount: number;
  evictions: number;
  compressionRatio: number;
}

export class CacheManager<T> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private config: CacheConfig;
  private stats: CacheStats;
  private cleanupInterval: NodeJS.Timeout | null = null;
  private persistenceInterval: NodeJS.Timeout | null = null;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: 1000,
      ttl: 5 * 60 * 1000, // 5 minutes
      strategy: 'LRU',
      enableCompression: true,
      enablePersistence: false,
      ...config
    };

    this.stats = {
      hits: 0,
      misses: 0,
      hitRate: 0,
      totalSize: 0,
      entryCount: 0,
      evictions: 0,
      compressionRatio: 0
    };

    this.startCleanup();
    if (this.config.enablePersistence) {
      this.startPersistence();
      this.loadFromPersistence();
    }
  }

  // Core cache operations
  public set(key: string, value: T, customTtl?: number): void {
    const ttl = customTtl || this.config.ttl;
    const timestamp = Date.now();
    const size = this.calculateSize(value);
    
    let processedValue = value;
    let compressed = false;

    // Compression
    if (this.config.enableCompression && size > 1024) {
      processedValue = this.compress(value);
      compressed = true;
    }

    const entry: CacheEntry<T> = {
      key,
      value: processedValue,
      timestamp,
      accessCount: 0,
      lastAccessed: timestamp,
      size: this.calculateSize(processedValue),
      compressed
    };

    // Check if key already exists
    if (this.cache.has(key)) {
      this.remove(key);
    }

    // Check capacity
    if (this.cache.size >= this.config.maxSize) {
      this.evict();
    }

    this.cache.set(key, entry);
    this.updateStats();
  }

  public get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }

    // Check TTL
    if (Date.now() - entry.timestamp > this.config.ttl) {
      this.remove(key);
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    this.stats.hits++;
    this.updateHitRate();

    // Decompress if needed
    if (entry.compressed) {
      return this.decompress(entry.value);
    }

    return entry.value;
  }

  public has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    // Check TTL
    if (Date.now() - entry.timestamp > this.config.ttl) {
      this.remove(key);
      return false;
    }
    
    return true;
  }

  public remove(key: string): boolean {
    const entry = this.cache.get(key);
    if (entry) {
      this.cache.delete(key);
      this.updateStats();
      return true;
    }
    return false;
  }

  public clear(): void {
    this.cache.clear();
    this.updateStats();
  }

  // Cache management
  public evict(): void {
    if (this.cache.size === 0) return;

    let keyToEvict: string | null = null;

    switch (this.config.strategy) {
      case 'LRU':
        keyToEvict = this.findLRUKey();
        break;
      case 'LFU':
        keyToEvict = this.findLFUKey();
        break;
      case 'FIFO':
        keyToEvict = this.findFIFOKey();
        break;
    }

    if (keyToEvict) {
      this.remove(keyToEvict);
      this.stats.evictions++;
    }
  }

  public cleanup(): void {
    const now = Date.now();
    const keysToRemove: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.config.ttl) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => this.remove(key));
  }

  // Statistics and monitoring
  public getStats(): CacheStats {
    return { ...this.stats };
  }

  public getKeys(): string[] {
    return Array.from(this.cache.keys());
  }

  public getSize(): number {
    return this.cache.size;
  }

  public getMemoryUsage(): number {
    return this.stats.totalSize;
  }

  // Persistence
  public async saveToPersistence(): Promise<void> {
    if (!this.config.enablePersistence || !this.config.persistencePath) {
      return;
    }

    try {
      const data = {
        config: this.config,
        entries: Array.from(this.cache.entries()),
        stats: this.stats
      };

      // SaaS: avoid localStorage; optionally persist to Supabase if available
      if (typeof window !== 'undefined' && (window as any).supabase) {
        try {
          const userId = (window as any).supabase?.auth?.getUser?.()?.id;
          if (userId) {
            await (window as any).supabase.from('cache_entries').upsert({
              user_id: userId,
              key: 'cache_data',
              data
            });
          }
        } catch {}
      }
    } catch (error) {
      console.error('Failed to save cache to persistence:', error);
    }
  }

  public async loadFromPersistence(): Promise<void> {
    if (!this.config.enablePersistence || !this.config.persistencePath) {
      return;
    }

    try {
      // SaaS: read from Supabase if available
      if (typeof window !== 'undefined' && (window as any).supabase) {
        try {
          const userId = (window as any).supabase?.auth?.getUser?.()?.id;
          if (userId) {
            const { data, error } = await (window as any).supabase
              .from('cache_entries')
              .select('data')
              .eq('user_id', userId)
              .eq('key', 'cache_data')
              .single();
            if (!error && data) {
              const parsed = data.data;
              this.cache = new Map(parsed.entries);
              this.stats = parsed.stats;
            }
          }
        } catch {}
      }
    } catch (error) {
      console.error('Failed to load cache from persistence:', error);
    }
  }

  // Utility methods
  private calculateSize(value: T): number {
    try {
      return JSON.stringify(value).length * 2; // Rough estimate
    } catch {
      return 0;
    }
  }

  private compress(value: T): T {
    // Simple compression - in a real implementation, you'd use a proper compression library
    try {
      const json = JSON.stringify(value);
      // This is a placeholder - real compression would use gzip, lz4, etc.
      return JSON.parse(json) as T;
    } catch {
      return value;
    }
  }

  private decompress(value: T): T {
    // Simple decompression - in a real implementation, you'd use a proper decompression library
    return value;
  }

  private findLRUKey(): string | null {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }

    return oldestKey;
  }

  private findLFUKey(): string | null {
    let leastFrequentKey: string | null = null;
    let leastFrequentCount = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.accessCount < leastFrequentCount) {
        leastFrequentCount = entry.accessCount;
        leastFrequentKey = key;
      }
    }

    return leastFrequentKey;
  }

  private findFIFOKey(): string | null {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        oldestKey = key;
      }
    }

    return oldestKey;
  }

  private updateStats(): void {
    this.stats.entryCount = this.cache.size;
    this.stats.totalSize = Array.from(this.cache.values())
      .reduce((total, entry) => total + entry.size, 0);
  }

  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;
  }

  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000); // Cleanup every minute
  }

  private startPersistence(): void {
    this.persistenceInterval = setInterval(() => {
      this.saveToPersistence();
    }, 300000); // Persist every 5 minutes
  }

  public destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    if (this.persistenceInterval) {
      clearInterval(this.persistenceInterval);
    }
    if (this.config.enablePersistence) {
      this.saveToPersistence();
    }
  }
}

// Specialized cache managers
export class TestCaseCache extends CacheManager<TestCase> {
  constructor() {
    super({
      maxSize: 500,
      ttl: 30 * 60 * 1000, // 30 minutes
      strategy: 'LRU',
      enableCompression: true,
      enablePersistence: true
    });
  }
}

export class ExecutionResultCache extends CacheManager<TestExecutionResult> {
  constructor() {
    super({
      maxSize: 1000,
      ttl: 60 * 60 * 1000, // 1 hour
      strategy: 'LRU',
      enableCompression: true,
      enablePersistence: true
    });
  }
}

export class AnalyticsCache extends CacheManager<any> {
  constructor() {
    super({
      maxSize: 200,
      ttl: 10 * 60 * 1000, // 10 minutes
      strategy: 'LFU',
      enableCompression: true,
      enablePersistence: false
    });
  }
}

// Global cache manager
export class GlobalCacheManager {
  private static instance: GlobalCacheManager;
  private testCaseCache: TestCaseCache;
  private executionCache: ExecutionResultCache;
  private analyticsCache: AnalyticsCache;
  private caches: Map<string, CacheManager<any>> = new Map();

  private constructor() {
    this.testCaseCache = new TestCaseCache();
    this.executionCache = new ExecutionResultCache();
    this.analyticsCache = new AnalyticsCache();
    
    this.caches.set('testCases', this.testCaseCache);
    this.caches.set('executions', this.executionCache);
    this.caches.set('analytics', this.analyticsCache);
  }

  public static getInstance(): GlobalCacheManager {
    if (!GlobalCacheManager.instance) {
      GlobalCacheManager.instance = new GlobalCacheManager();
    }
    return GlobalCacheManager.instance;
  }

  public getTestCaseCache(): TestCaseCache {
    return this.testCaseCache;
  }

  public getExecutionCache(): ExecutionResultCache {
    return this.executionCache;
  }

  public getAnalyticsCache(): AnalyticsCache {
    return this.analyticsCache;
  }

  public getCache<T>(name: string): CacheManager<T> | null {
    return this.caches.get(name) || null;
  }

  public createCache<T>(name: string, config: Partial<CacheConfig> = {}): CacheManager<T> {
    const cache = new CacheManager<T>(config);
    this.caches.set(name, cache);
    return cache;
  }

  public getAllStats(): { [name: string]: CacheStats } {
    const stats: { [name: string]: CacheStats } = {};
    for (const [name, cache] of this.caches.entries()) {
      stats[name] = cache.getStats();
    }
    return stats;
  }

  public clearAll(): void {
    for (const cache of this.caches.values()) {
      cache.clear();
    }
  }

  public destroy(): void {
    for (const cache of this.caches.values()) {
      cache.destroy();
    }
  }
}
import { supabase } from './supabase';

export interface DatabaseMetrics {
  queryCount: number;
  averageQueryTime: number;
  slowQueries: number;
  connectionCount: number;
  cacheHitRate: number;
  indexUsage: number;
  tableSize: number;
  deadlocks: number;
  locks: number;
}

export interface QueryOptimization {
  query: string;
  originalTime: number;
  optimizedTime: number;
  improvement: number;
  recommendations: string[];
  indexes: string[];
}

export interface DatabaseConfig {
  connectionPoolSize: number;
  queryTimeout: number;
  enableQueryCache: boolean;
  enableIndexOptimization: boolean;
  enableConnectionPooling: boolean;
  maxConnections: number;
  idleTimeout: number;
  statementTimeout: number;
}

export class DatabaseOptimizer {
  private static instance: DatabaseOptimizer;
  private config: DatabaseConfig;
  private metrics: DatabaseMetrics;
  private queryCache: Map<string, { result: any; timestamp: number; ttl: number }> = new Map();
  private slowQueries: Array<{ query: string; time: number; timestamp: Date }> = [];
  private optimizationHistory: QueryOptimization[] = [];

  private constructor() {
    this.config = {
      connectionPoolSize: 20,
      queryTimeout: 30000,
      enableQueryCache: true,
      enableIndexOptimization: true,
      enableConnectionPooling: true,
      maxConnections: 100,
      idleTimeout: 300000,
      statementTimeout: 60000
    };

    this.metrics = {
      queryCount: 0,
      averageQueryTime: 0,
      slowQueries: 0,
      connectionCount: 0,
      cacheHitRate: 0,
      indexUsage: 0,
      tableSize: 0,
      deadlocks: 0,
      locks: 0
    };

    this.startMonitoring();
  }

  public static getInstance(): DatabaseOptimizer {
    if (!DatabaseOptimizer.instance) {
      DatabaseOptimizer.instance = new DatabaseOptimizer();
    }
    return DatabaseOptimizer.instance;
  }

  // Optimized query execution
  public async executeQuery<T>(
    query: string,
    params: any[] = [],
    options: {
      useCache?: boolean;
      cacheTtl?: number;
      timeout?: number;
    } = {}
  ): Promise<T> {
    const startTime = Date.now();
    const cacheKey = this.generateCacheKey(query, params);
    
    // Check cache first
    if (options.useCache !== false && this.config.enableQueryCache) {
      const cached = this.queryCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < cached.ttl) {
        this.updateMetrics({ cacheHitRate: this.metrics.cacheHitRate + 1 });
        return cached.result;
      }
    }

    try {
      // Execute query with timeout
      const result = await this.executeWithTimeout(query, params, options.timeout);
      
      // Cache the result
      if (options.useCache !== false && this.config.enableQueryCache) {
        this.queryCache.set(cacheKey, {
          result,
          timestamp: Date.now(),
          ttl: options.cacheTtl || 300000 // 5 minutes default
        });
      }

      const executionTime = Date.now() - startTime;
      this.updateMetrics({
        queryCount: this.metrics.queryCount + 1,
        averageQueryTime: (this.metrics.averageQueryTime + executionTime) / 2
      });

      // Track slow queries
      if (executionTime > 1000) {
        this.slowQueries.push({
          query,
          time: executionTime,
          timestamp: new Date()
        });
        this.updateMetrics({ slowQueries: this.metrics.slowQueries + 1 });
      }

      return result;
    } catch (error) {
      console.error('Database query failed:', error);
      throw error;
    }
  }

  // Batch query execution
  public async executeBatch<T>(
    queries: Array<{ query: string; params: any[] }>,
    options: {
      useTransaction?: boolean;
      timeout?: number;
    } = {}
  ): Promise<T[]> {
    const startTime = Date.now();
    
    try {
      if (options.useTransaction !== false) {
        // Execute in transaction
        const results: T[] = [];
        
        for (const { query, params } of queries) {
          const result = await this.executeQuery<T>(query, params, {
            useCache: false,
            timeout: options.timeout
          });
          results.push(result);
        }
        
        return results;
      } else {
        // Execute in parallel
        const promises = queries.map(({ query, params }) =>
          this.executeQuery<T>(query, params, {
            useCache: false,
            timeout: options.timeout
          })
        );
        
        return await Promise.all(promises);
      }
    } catch (error) {
      console.error('Batch query execution failed:', error);
      throw error;
    }
  }

  // Query optimization
  public async optimizeQuery(query: string, params: any[] = []): Promise<QueryOptimization> {
    const startTime = Date.now();
    
    try {
      // Execute original query
      await this.executeQuery(query, params, { useCache: false });
      const originalTime = Date.now() - startTime;
      
      // Analyze query and generate optimizations
      const analysis = this.analyzeQuery(query);
      const optimizedQuery = this.generateOptimizedQuery(query, analysis);
      
      // Execute optimized query
      const optimizedStartTime = Date.now();
      await this.executeQuery(optimizedQuery, params, { useCache: false });
      const optimizedTime = Date.now() - optimizedStartTime;
      
      const improvement = originalTime > 0 ? ((originalTime - optimizedTime) / originalTime) * 100 : 0;
      
      const optimization: QueryOptimization = {
        query,
        originalTime,
        optimizedTime,
        improvement,
        recommendations: analysis.recommendations,
        indexes: analysis.suggestedIndexes
      };
      
      this.optimizationHistory.push(optimization);
      return optimization;
    } catch (error) {
      console.error('Query optimization failed:', error);
      throw error;
    }
  }

  // Index optimization
  public async optimizeIndexes(): Promise<{
    created: string[];
    dropped: string[];
    recommendations: string[];
  }> {
    try {
      const recommendations: string[] = [];
      const created: string[] = [];
      const dropped: string[] = [];
      
      // Analyze slow queries for index opportunities
      const indexOpportunities = this.analyzeIndexOpportunities();
      
      for (const opportunity of indexOpportunities) {
        try {
          // Create index
          await this.executeQuery(
            `CREATE INDEX IF NOT EXISTS ${opportunity.indexName} ON ${opportunity.table} (${opportunity.columns.join(', ')})`,
            [],
            { useCache: false }
          );
          created.push(opportunity.indexName);
          recommendations.push(`Created index ${opportunity.indexName} for better performance`);
        } catch (error) {
          console.error(`Failed to create index ${opportunity.indexName}:`, error);
        }
      }
      
      // Analyze unused indexes
      const unusedIndexes = await this.findUnusedIndexes();
      for (const index of unusedIndexes) {
        try {
          await this.executeQuery(`DROP INDEX IF EXISTS ${index}`, [], { useCache: false });
          dropped.push(index);
          recommendations.push(`Dropped unused index ${index}`);
        } catch (error) {
          console.error(`Failed to drop index ${index}:`, error);
        }
      }
      
      return { created, dropped, recommendations };
    } catch (error) {
      console.error('Index optimization failed:', error);
      throw error;
    }
  }

  // Connection pool management
  public async manageConnections(): Promise<{
    active: number;
    idle: number;
    total: number;
    recommendations: string[];
  }> {
    try {
      // Get connection statistics
      const stats = await this.executeQuery(`
        SELECT 
          count(*) as total_connections,
          count(*) FILTER (WHERE state = 'active') as active_connections,
          count(*) FILTER (WHERE state = 'idle') as idle_connections
        FROM pg_stat_activity 
        WHERE datname = current_database()
      `);
      
      const recommendations: string[] = [];
      
      if (stats.active_connections > this.config.maxConnections * 0.8) {
        recommendations.push('High connection usage detected. Consider increasing connection pool size.');
      }
      
      if (stats.idle_connections > this.config.maxConnections * 0.5) {
        recommendations.push('Many idle connections. Consider reducing idle timeout.');
      }
      
      return {
        active: stats.active_connections,
        idle: stats.idle_connections,
        total: stats.total_connections,
        recommendations
      };
    } catch (error) {
      console.error('Connection management failed:', error);
      throw error;
    }
  }

  // Database maintenance
  public async performMaintenance(): Promise<{
    vacuumed: string[];
    analyzed: string[];
    recommendations: string[];
  }> {
    try {
      const vacuumed: string[] = [];
      const analyzed: string[] = [];
      const recommendations: string[] = [];
      
      // Get table statistics
      const tables = await this.executeQuery(`
        SELECT schemaname, tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
      `);
      
      for (const table of tables) {
        const tableName = `${table.schemaname}.${table.tablename}`;
        
        try {
          // VACUUM table
          await this.executeQuery(`VACUUM ANALYZE ${tableName}`, [], { useCache: false });
          vacuumed.push(tableName);
          
          // ANALYZE table
          await this.executeQuery(`ANALYZE ${tableName}`, [], { useCache: false });
          analyzed.push(tableName);
          
          recommendations.push(`Maintained table ${tableName}`);
        } catch (error) {
          console.error(`Failed to maintain table ${tableName}:`, error);
        }
      }
      
      return { vacuumed, analyzed, recommendations };
    } catch (error) {
      console.error('Database maintenance failed:', error);
      throw error;
    }
  }

  // Performance monitoring
  private startMonitoring(): void {
    setInterval(() => {
      this.collectMetrics();
    }, 30000); // Collect metrics every 30 seconds
  }

  private async collectMetrics(): Promise<void> {
    try {
      // Get database statistics
      const stats = await this.executeQuery(`
        SELECT 
          count(*) as query_count,
          avg(mean_time) as avg_query_time,
          count(*) FILTER (WHERE mean_time > 1000) as slow_queries
        FROM pg_stat_statements
      `);
      
      this.updateMetrics({
        queryCount: stats.query_count || 0,
        averageQueryTime: stats.avg_query_time || 0,
        slowQueries: stats.slow_queries || 0
      });
    } catch (error) {
      console.error('Failed to collect database metrics:', error);
    }
  }

  // Utility methods
  private generateCacheKey(query: string, params: any[]): string {
    return `query_${btoa(JSON.stringify({ query, params }))}`;
  }

  private async executeWithTimeout<T>(
    query: string,
    params: any[],
    timeout?: number
  ): Promise<T> {
    const timeoutMs = timeout || this.config.queryTimeout;
    
    return new Promise(async (resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Query timeout after ${timeoutMs}ms`));
      }, timeoutMs);
      
      try {
        // Execute query using Supabase
        const { data, error } = await supabase.rpc('execute_query', {
          query_text: query,
          query_params: params
        });
        
        clearTimeout(timer);
        
        if (error) {
          reject(error);
        } else {
          resolve(data as T);
        }
      } catch (error) {
        clearTimeout(timer);
        reject(error);
      }
    });
  }

  private analyzeQuery(query: string): {
    recommendations: string[];
    suggestedIndexes: string[];
    complexity: 'low' | 'medium' | 'high';
  } {
    const recommendations: string[] = [];
    const suggestedIndexes: string[] = [];
    let complexity: 'low' | 'medium' | 'high' = 'low';
    
    // Simple query analysis
    if (query.includes('SELECT *')) {
      recommendations.push('Avoid SELECT * - specify only needed columns');
    }
    
    if (query.includes('ORDER BY') && !query.includes('LIMIT')) {
      recommendations.push('Consider adding LIMIT to ORDER BY queries');
    }
    
    if (query.includes('JOIN')) {
      complexity = 'medium';
      recommendations.push('Ensure JOIN columns are indexed');
    }
    
    if (query.includes('GROUP BY') || query.includes('HAVING')) {
      complexity = 'high';
      recommendations.push('Consider optimizing GROUP BY queries');
    }
    
    // Extract table and column information for index suggestions
    const tableMatch = query.match(/FROM\s+(\w+)/i);
    const columnMatch = query.match(/WHERE\s+(\w+)/i);
    
    if (tableMatch && columnMatch) {
      const table = tableMatch[1];
      const column = columnMatch[1];
      suggestedIndexes.push(`idx_${table}_${column}`);
    }
    
    return { recommendations, suggestedIndexes, complexity };
  }

  private generateOptimizedQuery(query: string, analysis: any): string {
    let optimizedQuery = query;
    
    // Apply basic optimizations
    if (query.includes('SELECT *')) {
      // This is a placeholder - in a real implementation, you'd analyze the table schema
      optimizedQuery = query.replace('SELECT *', 'SELECT id, name, created_at');
    }
    
    return optimizedQuery;
  }

  private analyzeIndexOpportunities(): Array<{
    table: string;
    columns: string[];
    indexName: string;
  }> {
    const opportunities: Array<{
      table: string;
      columns: string[];
      indexName: string;
    }> = [];
    
    // Analyze slow queries for index opportunities
    for (const slowQuery of this.slowQueries) {
      const tableMatch = slowQuery.query.match(/FROM\s+(\w+)/i);
      const columnMatch = slowQuery.query.match(/WHERE\s+(\w+)/i);
      
      if (tableMatch && columnMatch) {
        const table = tableMatch[1];
        const column = columnMatch[1];
        
        opportunities.push({
          table,
          columns: [column],
          indexName: `idx_${table}_${column}_${Date.now()}`
        });
      }
    }
    
    return opportunities;
  }

  private async findUnusedIndexes(): Promise<string[]> {
    try {
      const unusedIndexes = await this.executeQuery(`
        SELECT indexname 
        FROM pg_stat_user_indexes 
        WHERE idx_scan = 0
      `);
      
      return unusedIndexes.map((idx: any) => idx.indexname);
    } catch (error) {
      console.error('Failed to find unused indexes:', error);
      return [];
    }
  }

  private updateMetrics(updates: Partial<DatabaseMetrics>): void {
    this.metrics = { ...this.metrics, ...updates };
  }

  // Public getters
  public getMetrics(): DatabaseMetrics {
    return { ...this.metrics };
  }

  public getConfig(): DatabaseConfig {
    return { ...this.config };
  }

  public updateConfig(updates: Partial<DatabaseConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  public getSlowQueries(): Array<{ query: string; time: number; timestamp: Date }> {
    return [...this.slowQueries];
  }

  public getOptimizationHistory(): QueryOptimization[] {
    return [...this.optimizationHistory];
  }

  public clearCache(): void {
    this.queryCache.clear();
  }

  public getCacheStats(): {
    size: number;
    hitRate: number;
    entries: number;
  } {
    const totalRequests = this.metrics.queryCount;
    const hits = this.metrics.cacheHitRate;
    
    return {
      size: this.queryCache.size,
      hitRate: totalRequests > 0 ? (hits / totalRequests) * 100 : 0,
      entries: this.queryCache.size
    };
  }
}
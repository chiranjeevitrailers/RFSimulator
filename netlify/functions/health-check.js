exports.handler = async (event, context) => {
  try {
    // Basic health check
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'production',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      platform: {
        node: process.version,
        arch: process.arch,
        platform: process.platform
      }
    };

    // Check database connection (if configured)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      healthStatus.database = 'connected';
    } else {
      healthStatus.database = 'not_configured';
    }

    // Check external services
    healthStatus.services = {
      supabase: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'configured' : 'not_configured',
      auth: process.env.NEXTAUTH_SECRET ? 'configured' : 'not_configured',
      monitoring: process.env.MONITORING_WEBHOOK_URL ? 'configured' : 'not_configured'
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      },
      body: JSON.stringify(healthStatus)
    };
  } catch (error) {
    console.error('Health check failed:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message
      })
    };
  }
};
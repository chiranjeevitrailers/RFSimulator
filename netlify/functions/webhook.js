const crypto = require('crypto');

exports.handler = async (event, context) => {
  try {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

    // Verify webhook signature (if configured)
    const webhookSecret = process.env.WEBHOOK_SECRET;
    if (webhookSecret) {
      const signature = event.headers['x-webhook-signature'] || event.headers['X-Webhook-Signature'];
      const body = event.body;
      
      if (!signature) {
        return {
          statusCode: 401,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({ error: 'Missing signature' })
        };
      }

      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('hex');

      if (signature !== `sha256=${expectedSignature}`) {
        return {
          statusCode: 401,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({ error: 'Invalid signature' })
        };
      }
    }

    // Parse webhook payload
    const payload = JSON.parse(event.body);
    
    // Log webhook event
    console.log('Webhook received:', {
      type: payload.type || 'unknown',
      timestamp: new Date().toISOString(),
      source: event.headers['user-agent'] || 'unknown'
    });

    // Handle different webhook types
    let response = { received: true, timestamp: new Date().toISOString() };

    switch (payload.type) {
      case 'deployment.completed':
        response.message = 'Deployment completed successfully';
        // Add deployment completion logic here
        break;
      
      case 'deployment.failed':
        response.message = 'Deployment failed';
        // Add deployment failure logic here
        break;
      
      case 'monitoring.alert':
        response.message = 'Monitoring alert received';
        // Add alert handling logic here
        break;
      
      case 'backup.completed':
        response.message = 'Backup completed successfully';
        // Add backup completion logic here
        break;
      
      default:
        response.message = 'Webhook received';
        break;
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(response)
    };

  } catch (error) {
    console.error('Webhook handler error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message
      })
    };
  }
};
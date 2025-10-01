import { WebSocketServer } from 'ws';
import { NextResponse } from 'next/server';
import { NextApiRequest } from 'next';

// Store active WebSocket connections
const clients = new Map<string, Set<WebSocket>>();

// WebSocket server setup
let wss: WebSocketServer | null = null;

// Initialize WebSocket server
function setupWebSocketServer() {
  if (wss) return wss;

  wss = new WebSocketServer({ noServer: true });

  wss.on('connection', (ws, request) => {
    const url = new URL(request.url || '', `http://${request.headers.host}`);
    const executionId = url.pathname.split('/').pop();
    
    if (!executionId) {
      ws.close(1008, 'Missing executionId');
      return;
    }

    // Add client to the execution's client set
    if (!clients.has(executionId)) {
      clients.set(executionId, new Set());
    }
    const executionClients = clients.get(executionId)!;
    executionClients.add(ws);

    console.log(`New WebSocket connection for execution ${executionId}. Total clients: ${executionClients.size}`);

    // Handle incoming messages
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received message:', data);
        
        // Handle different message types
        switch (data.type) {
          case 'init':
            // Acknowledge initialization
            ws.send(JSON.stringify({
              type: 'init_ack',
              executionId: data.executionId,
              timestamp: new Date().toISOString()
            }));
            break;
          // Add more message types as needed
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    });

    // Handle client disconnection
    ws.on('close', () => {
      executionClients.delete(ws);
      console.log(`Client disconnected from execution ${executionId}. Remaining clients: ${executionClients.size}`);
      
      if (executionClients.size === 0) {
        clients.delete(executionId);
      }
    });
  });

  return wss;
}

// Function to broadcast a message to all clients for a specific execution
export function broadcastToExecution(executionId: string, message: any) {
  const executionClients = clients.get(executionId);
  if (!executionClients) return;

  const messageString = JSON.stringify(message);
  executionClients.forEach((client) => {
    if (client.readyState === 1) { // 1 = OPEN
      client.send(messageString);
    }
  });
}

// Next.js API route handler
export async function GET(request: Request, { params }: { params: { executionId: string } }) {
  if (!request.headers.get('upgrade') || request.headers.get('upgrade')?.toLowerCase() !== 'websocket') {
    return new NextResponse('Expected Upgrade: WebSocket', { status: 426 });
  }

  const { executionId } = params;
  if (!executionId) {
    return new NextResponse('Missing executionId', { status: 400 });
  }

  try {
    const wss = setupWebSocketServer();
    const { socket, response } = await (wss as any).handleUpgrade(
      request,
      request as any,
      Buffer.alloc(0)
    );

    wss.emit('connection', socket, request);
    return response;
  } catch (error) {
    console.error('WebSocket upgrade error:', error);
    return new NextResponse('WebSocket upgrade failed', { status: 500 });
  }
}

// Clean up WebSocket server on process exit
if (process.env.NODE_ENV !== 'production') {
  const cleanup = () => {
    if (wss) {
      wss.close(() => {
        console.log('WebSocket server closed');
      });
      wss = null;
    }
  };

  process.on('SIGTERM', cleanup);
  process.on('SIGINT', cleanup);
}

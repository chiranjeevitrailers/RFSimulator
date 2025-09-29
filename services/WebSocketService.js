// WebSocketService - Real-time CLI data streaming
class WebSocketService {
  constructor() {
    this.ws = null;
    this.callbacks = {};
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.isConnected = false;
  }

  connect(url = process.env.NEXT_PUBLIC_5GLABX_WS_URL) {
    // SaaS mode: prefer Supabase Realtime; do not default to localhost
    try {
      this.ws = new WebSocket(url);
      
      this.ws.onopen = () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.emit('connected');
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.emit('message', data);
        } catch (error) {
          this.emit('message', { type: 'raw', message: event.data });
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.emit('disconnected');
        this.scheduleReconnect();
      };

      this.ws.onerror = (error) => {
        this.emit('error', error);
      };

    } catch (error) {
      console.error('WebSocket connection error:', error);
      this.emit('error', error);
    }
  }

  scheduleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      setTimeout(() => {
        this.reconnectAttempts++;
        this.connect();
      }, Math.pow(2, this.reconnectAttempts) * 1000);
    }
  }

  on(event, callback) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }
    this.callbacks[event].push(callback);
  }

  emit(event, data) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => callback(data));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Export for ES6 modules
export default WebSocketService;
export { WebSocketService };

// Also make available globally for backward compatibility
window.WebSocketService = WebSocketService;
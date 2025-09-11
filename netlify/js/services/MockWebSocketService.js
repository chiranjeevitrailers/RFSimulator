// Mock WebSocket Service for 5GLabX Platform Frontend Demo
window.MockWebSocketService = (() => {
  let mockConnection = null;
  let messageInterval = null;
  let isConnected = false;
  const callbacks = {
    onOpen: [],
    onClose: [],
    onMessage: [],
    onError: []
  };
  
  return {
    // Connect to mock WebSocket
    connect() {
      if (isConnected) return;
      
      console.log('MockWebSocket: Connecting to demo WebSocket...');
      
      // Simulate connection delay
      setTimeout(() => {
        isConnected = true;
        mockConnection = { readyState: 1 }; // WebSocket.OPEN
        
        // Notify connection open
        callbacks.onOpen.forEach(callback => {
          try {
            callback();
          } catch (error) {
            console.error('MockWebSocket onOpen callback error:', error);
          }
        });
        
        // Start sending mock messages
        this.startMockMessages();
        
        console.log('MockWebSocket: Connected successfully');
      }, 1000);
    },
    
    // Disconnect from mock WebSocket
    disconnect() {
      if (!isConnected) return;
      
      console.log('MockWebSocket: Disconnecting...');
      
      isConnected = false;
      mockConnection = null;
      
      // Stop mock messages
      if (messageInterval) {
        clearInterval(messageInterval);
        messageInterval = null;
      }
      
      // Notify connection close
      callbacks.onClose.forEach(callback => {
        try {
          callback();
        } catch (error) {
          console.error('MockWebSocket onClose callback error:', error);
        }
      });
      
      console.log('MockWebSocket: Disconnected');
    },
    
    // Start sending mock messages
    startMockMessages() {
      if (messageInterval) return;
      
      messageInterval = setInterval(() => {
        if (!isConnected) return;
        
        // Generate random log message
        const mockMessage = {
          type: 'log',
          data: Helpers.generateRandomLog()
        };
        
        // Send to all message callbacks
        callbacks.onMessage.forEach(callback => {
          try {
            callback(mockMessage);
          } catch (error) {
            console.error('MockWebSocket onMessage callback error:', error);
          }
        });
      }, 2000 + Math.random() * 3000); // Random interval between 2-5 seconds
    },
    
    // Send message (mock implementation)
    send(message) {
      if (!isConnected) {
        console.warn('MockWebSocket: Cannot send message, not connected');
        return false;
      }
      
      console.log('MockWebSocket: Sending message:', message);
      
      // Simulate server response
      setTimeout(() => {
        const response = {
          type: 'response',
          data: { status: 'ok', message: 'Message received' }
        };
        
        callbacks.onMessage.forEach(callback => {
          try {
            callback(response);
          } catch (error) {
            console.error('MockWebSocket response callback error:', error);
          }
        });
      }, 100);
      
      return true;
    },
    
    // Add event listeners
    on(event, callback) {
      if (callbacks[event]) {
        callbacks[event].push(callback);
      }
    },
    
    // Remove event listeners
    off(event, callback) {
      if (callbacks[event]) {
        const index = callbacks[event].indexOf(callback);
        if (index > -1) {
          callbacks[event].splice(index, 1);
        }
      }
    },
    
    // Get connection status
    getStatus() {
      return {
        connected: isConnected,
        readyState: mockConnection ? mockConnection.readyState : 3 // WebSocket.CLOSED
      };
    },
    
    // Get connection info
    getInfo() {
      return {
        url: 'wss://demo.5glabx.com/ws',
        protocol: 'demo-protocol',
        isDemo: true
      };
    }
  };
})();
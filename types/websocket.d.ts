interface WebSocketClient extends WebSocket {
  isAlive?: boolean;
}

declare global {
  interface WebSocket {
    isAlive?: boolean;
  }
}

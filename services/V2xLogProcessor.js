// V2xLogProcessor - Service for processing V2X specific logs
class V2xLogProcessor {
  constructor() {
    this.parser = new V2xCliParser();
    this.messageQueue = [];
    this.subscribers = [];
    this.statistics = {
      psschMessages: 0,
      pscchMessages: 0,
      pc5Events: 0,
      totalMessages: 0
    };
  }

  processMessage(logEntry) {
    try {
      if (!logEntry || logEntry.source !== 'v2x') return;

      this.messageQueue.push(logEntry);
      this.updateStatistics(logEntry);
      this.notifySubscribers(logEntry);

      // Keep only last 500 messages
      if (this.messageQueue.length > 500) {
        this.messageQueue.shift();
      }
    } catch (error) {
      console.error('V2xLogProcessor process message error:', error);
    }
  }

  updateStatistics(logEntry) {
    try {
      this.statistics.totalMessages++;
      
      switch (logEntry.messageType) {
        case 'pssch':
          this.statistics.psschMessages++;
          break;
        case 'pscch':
          this.statistics.pscchMessages++;
          break;
        case 'pc5':
          this.statistics.pc5Events++;
          break;
      }
    } catch (error) {
      console.error('V2xLogProcessor update statistics error:', error);
    }
  }

  subscribe(callback) {
    try {
      this.subscribers.push(callback);
    } catch (error) {
      console.error('V2xLogProcessor subscribe error:', error);
    }
  }

  unsubscribe(callback) {
    try {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    } catch (error) {
      console.error('V2xLogProcessor unsubscribe error:', error);
    }
  }

  notifySubscribers(logEntry) {
    try {
      this.subscribers.forEach(callback => {
        try {
          callback(logEntry);
        } catch (error) {
          console.error('V2xLogProcessor notify error:', error);
        }
      });
    } catch (error) {
      console.error('V2xLogProcessor notify subscribers error:', error);
    }
  }

  getStatistics() {
    try {
      return { ...this.statistics };
    } catch (error) {
      console.error('V2xLogProcessor get statistics error:', error);
      return { psschMessages: 0, pscchMessages: 0, pc5Events: 0, totalMessages: 0 };
    }
  }

  clearQueue() {
    try {
      this.messageQueue = [];
      this.statistics = {
        psschMessages: 0,
        pscchMessages: 0,
        pc5Events: 0,
        totalMessages: 0
      };
    } catch (error) {
      console.error('V2xLogProcessor clear queue error:', error);
    }
  }

  getRecentMessages(count = 50) {
    try {
      return this.messageQueue.slice(-count);
    } catch (error) {
      console.error('V2xLogProcessor get recent messages error:', error);
      return [];
    }
  }
}

window.V2xLogProcessor = V2xLogProcessor;

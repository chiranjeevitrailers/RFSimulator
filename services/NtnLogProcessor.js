// NtnLogProcessor - Service for processing NTN specific logs
class NtnLogProcessor {
  constructor() {
    this.parser = new NtnCliParser();
    this.messageQueue = [];
    this.subscribers = [];
    this.statistics = {
      sib19Messages: 0,
      dopplerEvents: 0,
      delayMeasurements: 0,
      totalMessages: 0
    };
  }

  processMessage(logEntry) {
    try {
      if (!logEntry || logEntry.source !== 'ntn') return;

      this.messageQueue.push(logEntry);
      this.updateStatistics(logEntry);
      this.notifySubscribers(logEntry);

      // Keep only last 500 messages
      if (this.messageQueue.length > 500) {
        this.messageQueue.shift();
      }
    } catch (error) {
      console.error('NtnLogProcessor process message error:', error);
    }
  }

  updateStatistics(logEntry) {
    try {
      this.statistics.totalMessages++;
      
      switch (logEntry.messageType) {
        case 'sib19':
          this.statistics.sib19Messages++;
          break;
        case 'doppler':
          this.statistics.dopplerEvents++;
          break;
        case 'delay':
          this.statistics.delayMeasurements++;
          break;
      }
    } catch (error) {
      console.error('NtnLogProcessor update statistics error:', error);
    }
  }

  subscribe(callback) {
    try {
      this.subscribers.push(callback);
    } catch (error) {
      console.error('NtnLogProcessor subscribe error:', error);
    }
  }

  unsubscribe(callback) {
    try {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    } catch (error) {
      console.error('NtnLogProcessor unsubscribe error:', error);
    }
  }

  notifySubscribers(logEntry) {
    try {
      this.subscribers.forEach(callback => {
        try {
          callback(logEntry);
        } catch (error) {
          console.error('NtnLogProcessor notify error:', error);
        }
      });
    } catch (error) {
      console.error('NtnLogProcessor notify subscribers error:', error);
    }
  }

  getStatistics() {
    try {
      return { ...this.statistics };
    } catch (error) {
      console.error('NtnLogProcessor get statistics error:', error);
      return { sib19Messages: 0, dopplerEvents: 0, delayMeasurements: 0, totalMessages: 0 };
    }
  }

  clearQueue() {
    try {
      this.messageQueue = [];
      this.statistics = {
        sib19Messages: 0,
        dopplerEvents: 0,
        delayMeasurements: 0,
        totalMessages: 0
      };
    } catch (error) {
      console.error('NtnLogProcessor clear queue error:', error);
    }
  }

  getRecentMessages(count = 50) {
    try {
      return this.messageQueue.slice(-count);
    } catch (error) {
      console.error('NtnLogProcessor get recent messages error:', error);
      return [];
    }
  }
}

window.NtnLogProcessor = NtnLogProcessor;

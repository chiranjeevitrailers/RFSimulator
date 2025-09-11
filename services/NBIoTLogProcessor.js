// NBIoTLogProcessor - Service for processing NB-IoT specific logs
class NBIoTLogProcessor {
  constructor() {
    this.parser = new NbiotCliParser();
    this.messageQueue = [];
    this.subscribers = [];
  }

  processLogFile(content) {
    try {
      const lines = content.split('\n');
      const processedLogs = [];

      for (const line of lines) {
        const parsed = this.parser.parseLogLine(line);
        if (parsed) {
          processedLogs.push(parsed);
          this.notifySubscribers(parsed);
        }
      }

      return processedLogs;
    } catch (error) {
      console.error('NBIoTLogProcessor process file error:', error);
      return [];
    }
  }

  processRealTimeLog(logLine) {
    try {
      const parsed = this.parser.parseLogLine(logLine);
      if (parsed) {
        this.messageQueue.push(parsed);
        this.notifySubscribers(parsed);
        return parsed;
      }
      return null;
    } catch (error) {
      console.error('NBIoTLogProcessor real-time error:', error);
      return null;
    }
  }

  subscribe(callback) {
    try {
      this.subscribers.push(callback);
    } catch (error) {
      console.error('NBIoTLogProcessor subscribe error:', error);
    }
  }

  unsubscribe(callback) {
    try {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    } catch (error) {
      console.error('NBIoTLogProcessor unsubscribe error:', error);
    }
  }

  notifySubscribers(logEntry) {
    try {
      this.subscribers.forEach(callback => {
        try {
          callback(logEntry);
        } catch (error) {
          console.error('NBIoTLogProcessor notify error:', error);
        }
      });
    } catch (error) {
      console.error('NBIoTLogProcessor notify subscribers error:', error);
    }
  }

  getStatistics() {
    try {
      const stats = {
        totalMessages: this.messageQueue.length,
        byComponent: {},
        byLevel: {}
      };

      this.messageQueue.forEach(log => {
        stats.byComponent[log.component] = (stats.byComponent[log.component] || 0) + 1;
        stats.byLevel[log.level] = (stats.byLevel[log.level] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('NBIoTLogProcessor statistics error:', error);
      return { totalMessages: 0, byComponent: {}, byLevel: {} };
    }
  }

  clearQueue() {
    try {
      this.messageQueue = [];
    } catch (error) {
      console.error('NBIoTLogProcessor clear queue error:', error);
    }
  }
}

window.NBIoTLogProcessor = NBIoTLogProcessor;

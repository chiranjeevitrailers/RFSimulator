// RealTimeProcessor - Enhanced with O-RAN, V2X and NTN support
class RealTimeProcessor {
  constructor() {
    try {
      this.isActive = false;
      this.subscribers = [];
      this.logProcessor = new LogProcessor();
      this.messageCorrelator = new MessageCorrelator();
      this.oranCorrelator = new OranMessageCorrelator();
      this.v2xProcessor = new V2xLogProcessor();
      this.ntnProcessor = new NtnLogProcessor();
      this.processingQueue = [];
      this.maxQueueSize = 1000;
    } catch (error) {
      console.error('RealTimeProcessor constructor error:', error);
      reportError(error);
    }
  }

  start() {
    try {
      if (this.isActive) return;
      
      this.isActive = true;
      this.startProcessingLoop();
      this.emit('started', { timestamp: new Date().toISOString() });
    } catch (error) {
      console.error('RealTimeProcessor start error:', error);
      reportError(error);
    }
  }

  stop() {
    try {
      this.isActive = false;
      this.emit('stopped', { timestamp: new Date().toISOString() });
    } catch (error) {
      console.error('RealTimeProcessor stop error:', error);
      reportError(error);
    }
  }

  processLogEntry(logEntry) {
    try {
      if (!this.isActive || !logEntry) return;

      // Add to processing queue
      this.processingQueue.push(logEntry);
      if (this.processingQueue.length > this.maxQueueSize) {
        this.processingQueue.shift();
      }

      // Process based on source type
      switch (logEntry.source) {
        case 'ntn':
          this.processNtnMessage(logEntry);
          break;
        case 'v2x':
          this.processV2xMessage(logEntry);
          break;
        case 'oran':
          this.processOranMessage(logEntry);
          break;
        default:
          this.processGenericMessage(logEntry);
      }

      this.emit('logProcessed', logEntry);
    } catch (error) {
      console.error('RealTimeProcessor process log entry error:', error);
      reportError(error);
    }
  }

  processNtnMessage(logEntry) {
    try {
      this.ntnProcessor.processMessage(logEntry);
      
      if (logEntry.messageType === 'sib19') {
        this.emit('ntnSib19Update', logEntry);
      } else if (logEntry.messageType === 'doppler') {
        this.emit('ntnDopplerUpdate', logEntry);
      } else if (logEntry.messageType === 'delay') {
        this.emit('ntnDelayUpdate', logEntry);
      }
    } catch (error) {
      console.error('RealTimeProcessor process NTN message error:', error);
    }
  }

  processV2xMessage(logEntry) {
    try {
      this.v2xProcessor.processMessage(logEntry);
      
      if (logEntry.messageType === 'pssch') {
        this.emit('v2xPsschUpdate', logEntry);
      } else if (logEntry.messageType === 'pc5') {
        this.emit('v2xPc5Update', logEntry);
      }
    } catch (error) {
      console.error('RealTimeProcessor process V2X message error:', error);
    }
  }

  processOranMessage(logEntry) {
    try {
      this.oranCorrelator.processMessage(logEntry);
      this.emit('oranMessage', logEntry);
    } catch (error) {
      console.error('RealTimeProcessor process O-RAN message error:', error);
    }
  }

  processGenericMessage(logEntry) {
    try {
      this.messageCorrelator.addMessage(logEntry);
    } catch (error) {
      console.error('RealTimeProcessor process generic message error:', error);
    }
  }

  startProcessingLoop() {
    try {
      const processLoop = () => {
        if (!this.isActive) return;
        
        // Process any queued items
        if (this.processingQueue.length > 0) {
          const batch = this.processingQueue.splice(0, 10);
          batch.forEach(entry => this.emit('batchProcessed', entry));
        }
        
        setTimeout(processLoop, 100);
      };
      
      processLoop();
    } catch (error) {
      console.error('RealTimeProcessor processing loop error:', error);
      reportError(error);
    }
  }

  on(event, callback) {
    try {
      if (!this.subscribers[event]) {
        this.subscribers[event] = [];
      }
      this.subscribers[event].push(callback);
    } catch (error) {
      console.error('RealTimeProcessor on error:', error);
    }
  }

  emit(event, data) {
    try {
      if (this.subscribers[event]) {
        this.subscribers[event].forEach(callback => {
          try {
            callback(data);
          } catch (error) {
            console.error('RealTimeProcessor emit callback error:', error);
          }
        });
      }
    } catch (error) {
      console.error('RealTimeProcessor emit error:', error);
    }
  }
}

window.RealTimeProcessor = RealTimeProcessor;

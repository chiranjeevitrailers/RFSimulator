// OranMessageCorrelator - Correlate O-RAN messages into procedures
class OranMessageCorrelator {
  constructor() {
    try {
      this.activeFlows = new Map();
      this.procedures = new Map();
      this.callbacks = [];
    } catch (error) {
      console.error('OranMessageCorrelator constructor error:', error);
      reportError(error);
    }
  }

  processMessage(logEntry) {
    try {
      if (!logEntry.messageType) return null;

      const flowId = this.extractFlowId(logEntry);
      if (!flowId) return null;

      let flow = this.activeFlows.get(flowId);
      if (!flow) {
        flow = new CallFlow({
          callId: flowId,
          startTime: logEntry.timestamp
        });
        this.activeFlows.set(flowId, flow);
      }

      flow.addMessage(logEntry);
      this.updateProcedure(flow, logEntry);
      this.notifyCallbacks('flow_updated', flow);

      return flow;
    } catch (error) {
      console.error('OranMessageCorrelator process message error:', error);
      return null;
    }
  }

  extractFlowId(logEntry) {
    try {
      if (logEntry.metrics?.transactionId) {
        return `tx_${logEntry.metrics.transactionId}`;
      }
      if (logEntry.metrics?.gnbId) {
        return `gnb_${logEntry.metrics.gnbId}`;
      }
      return `flow_${Date.now()}`;
    } catch (error) {
      return null;
    }
  }

  updateProcedure(flow, logEntry) {
    try {
      const procedureName = this.getProcedureName(logEntry.messageType);
      if (procedureName) {
        flow.addProcedure(procedureName, logEntry.timestamp);
      }
    } catch (error) {
      console.error('OranMessageCorrelator update procedure error:', error);
    }
  }

  getProcedureName(messageType) {
    const procedures = {
      'F1SetupRequest': 'F1 Setup',
      'UEContextSetupRequest': 'UE Context Setup',
      'BearerContextSetupRequest': 'Bearer Setup',
      'NGSetupRequest': 'NG Setup',
      'InitialContextSetupRequest': 'Initial Context Setup'
    };
    return procedures[messageType] || null;
  }

  subscribe(callback) {
    try {
      this.callbacks.push(callback);
      return () => {
        const index = this.callbacks.indexOf(callback);
        if (index > -1) this.callbacks.splice(index, 1);
      };
    } catch (error) {
      return () => {};
    }
  }

  notifyCallbacks(event, data) {
    try {
      this.callbacks.forEach(callback => {
        try {
          callback(event, data);
        } catch (error) {
          console.error('Callback error:', error);
        }
      });
    } catch (error) {
      console.error('OranMessageCorrelator notify error:', error);
    }
  }
}

window.OranMessageCorrelator = OranMessageCorrelator;

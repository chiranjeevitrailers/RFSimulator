// CallFlow Data Model
class CallFlow {
  constructor(data = {}) {
    try {
      this.id = data.id || window.HELPERS.generateId();
      this.callId = data.callId || null;
      this.startTime = data.startTime || new Date().toISOString();
      this.endTime = data.endTime || null;
      this.status = data.status || 'active'; // active, completed, failed
      this.participants = data.participants || [];
      this.messages = data.messages || [];
      this.procedures = data.procedures || [];
      this.kpis = data.kpis || {};
      this.errors = data.errors || [];
    } catch (error) {
      console.error('CallFlow constructor error:', error);
      reportError(error);
    }
  }

  // Add participant to call flow
  addParticipant(entity, role = 'unknown') {
    try {
      const participant = {
        id: window.HELPERS.generateId(),
        entity: entity,
        role: role,
        joinTime: new Date().toISOString()
      };
      
      this.participants.push(participant);
      return participant.id;
    } catch (error) {
      console.error('CallFlow add participant error:', error);
      reportError(error);
      return null;
    }
  }

  // Add message to call flow
  addMessage(protocolMessage) {
    try {
      protocolMessage.callFlowId = this.id;
      this.messages.push(protocolMessage);
      this.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    } catch (error) {
      console.error('CallFlow add message error:', error);
      reportError(error);
    }
  }

  // Add procedure to call flow
  addProcedure(name, startTime, endTime = null, status = 'active') {
    try {
      const procedure = {
        id: window.HELPERS.generateId(),
        name: name,
        startTime: startTime,
        endTime: endTime,
        status: status,
        duration: endTime ? new Date(endTime) - new Date(startTime) : null
      };
      
      this.procedures.push(procedure);
      return procedure.id;
    } catch (error) {
      console.error('CallFlow add procedure error:', error);
      reportError(error);
      return null;
    }
  }

  // Complete call flow
  complete(status = 'completed') {
    try {
      this.endTime = new Date().toISOString();
      this.status = status;
      this.calculateKPIs();
    } catch (error) {
      console.error('CallFlow complete error:', error);
      reportError(error);
    }
  }

  // Calculate call flow KPIs
  calculateKPIs() {
    try {
      if (this.startTime && this.endTime) {
        this.kpis.duration = new Date(this.endTime) - new Date(this.startTime);
        this.kpis.messageCount = this.messages.length;
        this.kpis.procedureCount = this.procedures.length;
        this.kpis.errorCount = this.errors.length;
        this.kpis.successRate = this.status === 'completed' ? 100 : 0;
      }
    } catch (error) {
      console.error('CallFlow calculate KPIs error:', error);
      reportError(error);
    }
  }

  // Get call flow summary
  getSummary() {
    try {
      return {
        id: this.id,
        callId: this.callId,
        duration: this.kpis.duration ? window.HELPERS.formatDuration(this.kpis.duration) : 'Ongoing',
        status: this.status,
        participants: this.participants.length,
        messages: this.messages.length,
        procedures: this.procedures.length,
        errors: this.errors.length
      };
    } catch (error) {
      console.error('CallFlow summary error:', error);
      return {};
    }
  }
}

// Export CallFlow class
window.CallFlow = CallFlow;

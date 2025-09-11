// Message Analyzer - Statistical analysis and KPI calculation
class MessageAnalyzer {
  static analyzeMessages(messages) {
    try {
      const analysis = {
        total: messages.length,
        byComponent: {},
        byLevel: {},
        byType: {},
        kpis: {},
        timeline: []
      };

      messages.forEach(msg => {
        // Component analysis
        if (msg.component) {
          analysis.byComponent[msg.component] = (analysis.byComponent[msg.component] || 0) + 1;
        }
        
        // Level analysis
        if (msg.level) {
          analysis.byLevel[msg.level] = (analysis.byLevel[msg.level] || 0) + 1;
        }
        
        // Message type analysis
        if (msg.fields?.type) {
          analysis.byType[msg.fields.type] = (analysis.byType[msg.fields.type] || 0) + 1;
        }
      });

      // Calculate KPIs
      analysis.kpis = this.calculateKPIs(messages);
      analysis.timeline = this.generateTimeline(messages);
      
      return analysis;
    } catch (error) {
      console.error('MessageAnalyzer error:', error);
      return { error: error.message };
    }
  }

  static calculateKPIs(messages) {
    try {
      const kpis = {
        errorRate: 0,
        avgThroughput: 0,
        avgLatency: 0,
        successRate: 0
      };

      const errorCount = messages.filter(msg => msg.level === 'error').length;
      kpis.errorRate = messages.length > 0 ? (errorCount / messages.length * 100).toFixed(2) : 0;

      // PHY layer throughput calculation
      const pdschMessages = messages.filter(msg => msg.fields?.type === 'PDSCH');
      if (pdschMessages.length > 0) {
        const totalTbs = pdschMessages.reduce((sum, msg) => sum + (msg.fields.tbs || 0), 0);
        kpis.avgThroughput = (totalTbs / pdschMessages.length / 1000).toFixed(2); // Mbps
      }

      // Average processing time
      const timedMessages = messages.filter(msg => msg.fields?.time);
      if (timedMessages.length > 0) {
        const totalTime = timedMessages.reduce((sum, msg) => sum + msg.fields.time, 0);
        kpis.avgLatency = (totalTime / timedMessages.length).toFixed(2);
      }

      kpis.successRate = (100 - parseFloat(kpis.errorRate)).toFixed(2);
      
      return kpis;
    } catch (error) {
      console.error('KPI calculation error:', error);
      return {};
    }
  }

  static generateTimeline(messages) {
    try {
      const timeline = [];
      const timeSlots = {};

      messages.forEach(msg => {
        if (msg.timestamp) {
          const timeKey = this.getTimeSlot(msg.timestamp);
          if (!timeSlots[timeKey]) {
            timeSlots[timeKey] = { time: timeKey, messages: 0, errors: 0 };
          }
          timeSlots[timeKey].messages++;
          if (msg.level === 'error') {
            timeSlots[timeKey].errors++;
          }
        }
      });

      return Object.values(timeSlots).sort((a, b) => a.time.localeCompare(b.time));
    } catch (error) {
      console.error('Timeline generation error:', error);
      return [];
    }
  }

  static getTimeSlot(timestamp) {
    try {
      // Convert to 1-minute intervals
      const date = new Date(timestamp);
      date.setSeconds(0, 0);
      return date.toISOString().slice(0, 16);
    } catch (error) {
      return timestamp;
    }
  }

  static filterMessages(messages, filters) {
    try {
      let filtered = [...messages];

      if (filters.component && filters.component !== 'all') {
        filtered = filtered.filter(msg => msg.component === filters.component);
      }
      
      if (filters.level && filters.level !== 'all') {
        filtered = filtered.filter(msg => msg.level === filters.level);
      }
      
      if (filters.messageType && filters.messageType !== 'all') {
        filtered = filtered.filter(msg => msg.fields?.type === filters.messageType);
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filtered = filtered.filter(msg => 
          msg.message?.toLowerCase().includes(searchTerm) ||
          msg.raw?.toLowerCase().includes(searchTerm)
        );
      }

      return filtered;
    } catch (error) {
      console.error('Message filtering error:', error);
      return messages;
    }
  }
}

window.MessageAnalyzer = MessageAnalyzer;
// LayerStatsService - Integrate layer statistics with CLI backend
class LayerStatsService {
  static init() {
    this.layerStats = new Map();
    this.subscribers = new Set();
    this.isProcessing = false;
  }
  
  static processLogs(logs) {
    try {
      if (this.isProcessing || !logs || !Array.isArray(logs)) return;
      
      this.isProcessing = true;
      
      // Process each layer
      const layers = ['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS', 'SIP'];
      
      layers.forEach(layer => {
        const layerLogs = this.filterLogsByLayer(logs, layer);
        const stats = this.calculateLayerStats(layer, layerLogs);
        this.layerStats.set(layer, stats);
      });
      
      this.notifySubscribers();
      
    } catch (error) {
      console.error('LayerStatsService process error:', error);
    } finally {
      this.isProcessing = false;
    }
  }
  
  static filterLogsByLayer(logs, layer) {
    try {
      return logs.filter(log => {
        if (layer === 'SIP') {
          return log.protocol === 'SIP' || 
                 log.component === 'IMS' ||
                 log.message?.includes('SIP') ||
                 log.message?.includes('INVITE');
        }
        
        return log.protocol === layer || 
               log.component === layer ||
               log.layer === layer.toLowerCase();
      });
    } catch (error) {
      console.error('LayerStatsService filter error:', error);
      return [];
    }
  }
  
  static calculateLayerStats(layer, logs) {
    try {
      const baseStats = {
        layer: layer,
        totalMessages: logs.length,
        timestamp: new Date().toISOString(),
        errors: logs.filter(log => log.level === 'ERROR').length,
        warnings: logs.filter(log => log.level === 'WARN').length
      };
      
      // Layer-specific calculations
      switch (layer) {
        case 'PHY':
          return { ...baseStats, ...this.calculatePHYStats(logs) };
        case 'MAC':
          return { ...baseStats, ...this.calculateMACStats(logs) };
        case 'RRC':
          return { ...baseStats, ...this.calculateRRCStats(logs) };
        case 'NAS':
          return { ...baseStats, ...this.calculateNASStats(logs) };
        case 'SIP':
          return { ...baseStats, ...this.calculateSIPStats(logs) };
        default:
          return baseStats;
      }
    } catch (error) {
      console.error('LayerStatsService calculate error:', error);
      return { layer, totalMessages: 0, errors: 0, warnings: 0 };
    }
  }
  
  static calculatePHYStats(logs) {
    try {
      const rsrpValues = [];
      const sinrValues = [];
      
      logs.forEach(log => {
        const msg = log.message;
        const rsrpMatch = msg.match(/RSRP[=:]?\s*(-?\d+(?:\.\d+)?)/i);
        if (rsrpMatch) rsrpValues.push(parseFloat(rsrpMatch[1]));
        
        const sinrMatch = msg.match(/SINR[=:]?\s*(-?\d+(?:\.\d+)?)/i);
        if (sinrMatch) sinrValues.push(parseFloat(sinrMatch[1]));
      });
      
      return {
        avgRSRP: rsrpValues.length ? 
          (rsrpValues.reduce((a, b) => a + b, 0) / rsrpValues.length).toFixed(1) : null,
        avgSINR: sinrValues.length ? 
          (sinrValues.reduce((a, b) => a + b, 0) / sinrValues.length).toFixed(1) : null,
        measurementCount: rsrpValues.length + sinrValues.length
      };
    } catch (error) {
      console.error('LayerStatsService PHY stats error:', error);
      return {};
    }
  }
  
  static calculateMACStats(logs) {
    try {
      let ulGrants = 0;
      let dlAssignments = 0;
      let harqAcks = 0;
      let harqNacks = 0;
      
      logs.forEach(log => {
        const msg = log.message;
        if (msg.includes('UL_GRANT') || msg.includes('UL Grant')) ulGrants++;
        if (msg.includes('DL_ASSIGNMENT') || msg.includes('DL Assignment')) dlAssignments++;
        if (msg.includes('HARQ_ACK') || msg.includes('ACK')) harqAcks++;
        if (msg.includes('HARQ_NACK') || msg.includes('NACK')) harqNacks++;
      });
      
      return {
        ulGrants,
        dlAssignments,
        harqAcks,
        harqNacks,
        harqSuccessRate: (harqAcks + harqNacks) > 0 ? 
          ((harqAcks / (harqAcks + harqNacks)) * 100).toFixed(1) : null
      };
    } catch (error) {
      console.error('LayerStatsService MAC stats error:', error);
      return {};
    }
  }
  
  static calculateRRCStats(logs) {
    try {
      let connectionSetups = 0;
      let handovers = 0;
      let failures = 0;
      
      logs.forEach(log => {
        const msg = log.message.toLowerCase();
        if (msg.includes('connection setup')) connectionSetups++;
        if (msg.includes('handover')) handovers++;
        if (msg.includes('failure') || msg.includes('error')) failures++;
      });
      
      return {
        connectionSetups,
        handovers,
        failures,
        successRate: connectionSetups > 0 ? 
          (((connectionSetups - failures) / connectionSetups) * 100).toFixed(1) : null
      };
    } catch (error) {
      console.error('LayerStatsService RRC stats error:', error);
      return {};
    }
  }
  
  static calculateNASStats(logs) {
    try {
      let registrations = 0;
      let authentications = 0;
      let pduSessions = 0;
      
      logs.forEach(log => {
        const msg = log.message.toLowerCase();
        if (msg.includes('registration')) registrations++;
        if (msg.includes('authentication')) authentications++;
        if (msg.includes('pdu session')) pduSessions++;
      });
      
      return { registrations, authentications, pduSessions };
    } catch (error) {
      console.error('LayerStatsService NAS stats error:', error);
      return {};
    }
  }
  
  static calculateSIPStats(logs) {
    try {
      let invites = 0;
      let registers = 0;
      let responses200 = 0;
      let errors = 0;
      
      logs.forEach(log => {
        const msg = log.message;
        if (msg.includes('INVITE')) invites++;
        if (msg.includes('REGISTER')) registers++;
        if (msg.includes('200 OK')) responses200++;
        if (msg.match(/[45]\d\d/)) errors++;
      });
      
      return {
        invites,
        registers,
        responses200,
        errors,
        successRate: invites > 0 ? ((responses200 / invites) * 100).toFixed(1) : null
      };
    } catch (error) {
      console.error('LayerStatsService SIP stats error:', error);
      return {};
    }
  }
  
  static getLayerStats(layer) {
    return this.layerStats.get(layer) || null;
  }
  
  static getAllStats() {
    return Object.fromEntries(this.layerStats);
  }
  
  static subscribe(callback) {
    this.subscribers.add(callback);
  }
  
  static unsubscribe(callback) {
    this.subscribers.delete(callback);
  }
  
  static notifySubscribers() {
    this.subscribers.forEach(callback => {
      try {
        callback(this.getAllStats());
      } catch (error) {
        console.error('LayerStatsService notify error:', error);
      }
    });
  }
}

// Initialize service
LayerStatsService.init();

// Export LayerStatsService
// Export for ES6 modules
export default LayerStatsService;
export { LayerStatsService };

// Also make available globally for backward compatibility
window.LayerStatsService = LayerStatsService;

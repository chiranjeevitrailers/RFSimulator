// 3GPP Message Analyzer - Advanced analysis and correlation
class ThreeGPPMessageAnalyzer {
  constructor() {
    this.decoder = new ThreeGPPMessageDecoder();
    this.messageHistory = new Map();
    this.correlationRules = this.initializeCorrelationRules();
    this.analysisMetrics = new Map();
    this.anomalyDetector = new AnomalyDetector();
  }

  // Initialize correlation rules for message sequences
  initializeCorrelationRules() {
    return {
      // RRC Connection Establishment
      'RRC_CONNECTION_ESTABLISHMENT': {
        sequence: ['RRCSetupRequest', 'RRCSetup', 'RRCSetupComplete'],
        timeout: 10000, // 10 seconds
        description: 'RRC Connection Establishment Procedure'
      },

      // NAS Registration
      'NAS_REGISTRATION': {
        sequence: ['RegistrationRequest', 'AuthenticationRequest', 'AuthenticationResponse', 'SecurityModeCommand', 'SecurityModeComplete', 'RegistrationAccept', 'RegistrationComplete'],
        timeout: 30000, // 30 seconds
        description: '5G NAS Registration Procedure'
      },

      // Data Transfer
      'DATA_TRANSFER': {
        sequence: ['MACPDU', 'RLCDATA', 'PDCPPDU'],
        timeout: 1000, // 1 second
        description: 'Data Transfer Procedure'
      },

      // Handover
      'HANDOVER': {
        sequence: ['RRCReconfiguration', 'RRCReconfigurationComplete'],
        timeout: 5000, // 5 seconds
        description: 'RRC Reconfiguration (Handover) Procedure'
      }
    };
  }

  // Analyze a single message
  analyzeMessage(rawMessage, context = {}) {
    try {
      // Decode the message
      const decoded = this.decoder.decodeMessage(rawMessage, context.messageType);
      
      // Perform analysis
      const analysis = {
        decoded: decoded,
        timestamp: new Date().toISOString(),
        context: context,
        metrics: this.calculateMetrics(decoded),
        anomalies: this.detectAnomalies(decoded),
        correlations: this.findCorrelations(decoded),
        recommendations: this.generateRecommendations(decoded)
      };

      // Store in history for correlation
      this.storeMessage(decoded, analysis);
      
      // Update analysis metrics
      this.updateAnalysisMetrics(analysis);

      return analysis;

    } catch (error) {
      console.error('Message analysis error:', error);
      return this.createErrorAnalysis(rawMessage, error);
    }
  }

  // Calculate message metrics
  calculateMetrics(decoded) {
    const metrics = {
      messageSize: decoded.rawMessage ? decoded.rawMessage.length : 0,
      fieldCount: this.countFields(decoded.decoded),
      validationScore: this.calculateValidationScore(decoded.validation),
      complexityScore: this.calculateComplexityScore(decoded),
      protocolCompliance: decoded.compliance
    };

    // Protocol-specific metrics
    switch (decoded.protocol) {
      case 'RRC':
        metrics.rrcMetrics = this.calculateRRCMetrics(decoded);
        break;
      case 'NAS':
        metrics.nasMetrics = this.calculateNASMetrics(decoded);
        break;
      case 'MAC':
        metrics.macMetrics = this.calculateMACMetrics(decoded);
        break;
      case 'RLC':
        metrics.rlcMetrics = this.calculateRLCMetrics(decoded);
        break;
    }

    return metrics;
  }

  // Count fields in decoded message
  countFields(decoded) {
    if (!decoded || typeof decoded !== 'object') return 0;
    
    let count = 0;
    const countRecursive = (obj) => {
      for (const [key, value] of Object.entries(obj)) {
        if (value !== null && value !== undefined) {
          count++;
          if (typeof value === 'object' && !Array.isArray(value)) {
            countRecursive(value);
          }
        }
      }
    };
    
    countRecursive(decoded);
    return count;
  }

  // Calculate validation score
  calculateValidationScore(validation) {
    if (!validation) return 0;
    
    let score = 100;
    score -= validation.errors.length * 20; // -20 points per error
    score -= validation.warnings.length * 5; // -5 points per warning
    
    return Math.max(0, score);
  }

  // Calculate complexity score
  calculateComplexityScore(decoded) {
    let complexity = 0;
    
    // Base complexity by protocol
    const protocolComplexity = {
      'RRC': 30,
      'NAS': 25,
      'MAC': 15,
      'RLC': 20,
      'PDCP': 15,
      'PHY': 10
    };
    
    complexity += protocolComplexity[decoded.protocol] || 10;
    
    // Add complexity for field count
    complexity += this.countFields(decoded.decoded) * 2;
    
    // Add complexity for nested structures
    complexity += this.countNestedStructures(decoded.decoded) * 5;
    
    return Math.min(100, complexity);
  }

  // Count nested structures
  countNestedStructures(obj) {
    if (!obj || typeof obj !== 'object') return 0;
    
    let count = 0;
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        count++;
        count += this.countNestedStructures(value);
      }
    }
    
    return count;
  }

  // Calculate RRC-specific metrics
  calculateRRCMetrics(decoded) {
    const metrics = {
      transactionId: decoded.decoded?.rrcTransactionId?.value || null,
      messageType: decoded.messageType,
      hasCriticalExtensions: this.hasCriticalExtensions(decoded.decoded),
      bearerCount: this.countBearers(decoded.decoded),
      cellConfigPresent: this.hasCellConfig(decoded.decoded)
    };

    return metrics;
  }

  // Calculate NAS-specific metrics
  calculateNASMetrics(decoded) {
    const metrics = {
      securityContext: decoded.decoded?.ngKSI?.value || null,
      registrationType: decoded.decoded?.registrationType?.value || null,
      hasMobileIdentity: this.hasMobileIdentity(decoded.decoded),
      hasCapabilities: this.hasCapabilities(decoded.decoded),
      causeCode: decoded.decoded?.causeCode?.value || null
    };

    return metrics;
  }

  // Calculate MAC-specific metrics
  calculateMACMetrics(decoded) {
    const metrics = {
      logicalChannelId: decoded.decoded?.logicalChannelId?.value || null,
      pduSize: decoded.decoded?.pduSize?.value || null,
      hasBSR: this.hasBSR(decoded.decoded),
      hasPHR: this.hasPHR(decoded.decoded),
      hasTimingAdvance: this.hasTimingAdvance(decoded.decoded)
    };

    return metrics;
  }

  // Calculate RLC-specific metrics
  calculateRLCMetrics(decoded) {
    const metrics = {
      sequenceNumber: decoded.decoded?.sequenceNumber?.value || null,
      segmentOffset: decoded.decoded?.segmentOffset?.value || null,
      isDataPDU: decoded.decoded?.dataControlBit?.value === 'data',
      hasPollingBit: decoded.decoded?.pollingBit?.value === '1',
      segmentationInfo: decoded.decoded?.segmentationInfo?.value || null
    };

    return metrics;
  }

  // Detect anomalies in message
  detectAnomalies(decoded) {
    const anomalies = [];

    // Protocol compliance anomalies
    if (decoded.compliance !== '3GPP_COMPLIANT') {
      anomalies.push({
        type: 'COMPLIANCE',
        severity: 'HIGH',
        description: `Message not 3GPP compliant: ${decoded.compliance}`,
        recommendation: 'Check message format against 3GPP specifications'
      });
    }

    // Validation anomalies
    if (decoded.validation && decoded.validation.errors.length > 0) {
      anomalies.push({
        type: 'VALIDATION',
        severity: 'HIGH',
        description: `Validation errors: ${decoded.validation.errors.join(', ')}`,
        recommendation: 'Fix message format issues'
      });
    }

    // Protocol-specific anomalies
    switch (decoded.protocol) {
      case 'RRC':
        anomalies.push(...this.detectRRCAnomalies(decoded));
        break;
      case 'NAS':
        anomalies.push(...this.detectNASAnomalies(decoded));
        break;
      case 'MAC':
        anomalies.push(...this.detectMACAnomalies(decoded));
        break;
      case 'RLC':
        anomalies.push(...this.detectRLCAnomalies(decoded));
        break;
    }

    // Performance anomalies
    anomalies.push(...this.detectPerformanceAnomalies(decoded));

    return anomalies;
  }

  // Detect RRC-specific anomalies
  detectRRCAnomalies(decoded) {
    const anomalies = [];

    // Check for missing transaction ID
    if (!decoded.decoded?.rrcTransactionId) {
      anomalies.push({
        type: 'RRC_MISSING_TID',
        severity: 'MEDIUM',
        description: 'RRC message missing transaction ID',
        recommendation: 'Ensure RRC transaction ID is present'
      });
    }

    // Check for invalid transaction ID
    const tid = decoded.decoded?.rrcTransactionId?.value;
    if (tid !== null && (tid < 0 || tid > 3)) {
      anomalies.push({
        type: 'RRC_INVALID_TID',
        severity: 'HIGH',
        description: `Invalid RRC transaction ID: ${tid}`,
        recommendation: 'RRC transaction ID must be in range [0, 3]'
      });
    }

    return anomalies;
  }

  // Detect NAS-specific anomalies
  detectNASAnomalies(decoded) {
    const anomalies = [];

    // Check for missing security context
    if (!decoded.decoded?.ngKSI) {
      anomalies.push({
        type: 'NAS_MISSING_SECURITY',
        severity: 'HIGH',
        description: 'NAS message missing security context',
        recommendation: 'Ensure security context is present'
      });
    }

    return anomalies;
  }

  // Detect MAC-specific anomalies
  detectMACAnomalies(decoded) {
    const anomalies = [];

    // Check for missing logical channel ID
    if (!decoded.decoded?.logicalChannelId) {
      anomalies.push({
        type: 'MAC_MISSING_LCID',
        severity: 'MEDIUM',
        description: 'MAC PDU missing logical channel ID',
        recommendation: 'Ensure logical channel ID is present'
      });
    }

    return anomalies;
  }

  // Detect RLC-specific anomalies
  detectRLCAnomalies(decoded) {
    const anomalies = [];

    // Check for missing sequence number
    if (!decoded.decoded?.sequenceNumber) {
      anomalies.push({
        type: 'RLC_MISSING_SN',
        severity: 'HIGH',
        description: 'RLC PDU missing sequence number',
        recommendation: 'Ensure sequence number is present'
      });
    }

    return anomalies;
  }

  // Detect performance anomalies
  detectPerformanceAnomalies(decoded) {
    const anomalies = [];

    // Check message size
    const messageSize = decoded.rawMessage ? decoded.rawMessage.length : 0;
    if (messageSize > 10000) { // 10KB threshold
      anomalies.push({
        type: 'LARGE_MESSAGE',
        severity: 'MEDIUM',
        description: `Large message size: ${messageSize} bytes`,
        recommendation: 'Consider message fragmentation or optimization'
      });
    }

    // Check complexity
    const complexity = this.calculateComplexityScore(decoded);
    if (complexity > 80) {
      anomalies.push({
        type: 'HIGH_COMPLEXITY',
        severity: 'LOW',
        description: `High message complexity: ${complexity}%`,
        recommendation: 'Monitor for performance impact'
      });
    }

    return anomalies;
  }

  // Find message correlations
  findCorrelations(decoded) {
    const correlations = [];

    // Check for sequence correlations
    for (const [sequenceName, rule] of Object.entries(this.correlationRules)) {
      const correlation = this.checkSequenceCorrelation(decoded, sequenceName, rule);
      if (correlation) {
        correlations.push(correlation);
      }
    }

    // Check for UE correlations
    const ueCorrelation = this.checkUECorrelation(decoded);
    if (ueCorrelation) {
      correlations.push(ueCorrelation);
    }

    return correlations;
  }

  // Check sequence correlation
  checkSequenceCorrelation(decoded, sequenceName, rule) {
    const messageType = decoded.messageType;
    const sequence = rule.sequence;
    
    if (!sequence.includes(messageType)) {
      return null;
    }

    const messageIndex = sequence.indexOf(messageType);
    const expectedNext = sequence[messageIndex + 1];
    
    return {
      type: 'SEQUENCE',
      sequenceName: sequenceName,
      currentStep: messageIndex + 1,
      totalSteps: sequence.length,
      expectedNext: expectedNext,
      description: rule.description,
      timeout: rule.timeout
    };
  }

  // Check UE correlation
  checkUECorrelation(decoded) {
    const rnti = decoded.decoded?.rnti?.value;
    const ueId = decoded.decoded?.ueId?.value;
    
    if (!rnti && !ueId) {
      return null;
    }

    // Find related messages for this UE
    const relatedMessages = this.findRelatedMessages(rnti, ueId);
    
    return {
      type: 'UE_CORRELATION',
      rnti: rnti,
      ueId: ueId,
      relatedMessages: relatedMessages.length,
      description: `Messages related to UE ${ueId || rnti}`
    };
  }

  // Find related messages for UE
  findRelatedMessages(rnti, ueId) {
    const related = [];
    
    for (const [timestamp, message] of this.messageHistory) {
      const msgRnti = message.decoded?.rnti?.value;
      const msgUeId = message.decoded?.ueId?.value;
      
      if ((rnti && msgRnti === rnti) || (ueId && msgUeId === ueId)) {
        related.push(message);
      }
    }
    
    return related;
  }

  // Generate recommendations
  generateRecommendations(decoded) {
    const recommendations = [];

    // Compliance recommendations
    if (decoded.compliance !== '3GPP_COMPLIANT') {
      recommendations.push({
        type: 'COMPLIANCE',
        priority: 'HIGH',
        description: 'Improve 3GPP compliance',
        action: 'Review message format against 3GPP specifications'
      });
    }

    // Validation recommendations
    if (decoded.validation && decoded.validation.errors.length > 0) {
      recommendations.push({
        type: 'VALIDATION',
        priority: 'HIGH',
        description: 'Fix validation errors',
        action: 'Correct message format issues'
      });
    }

    // Performance recommendations
    const complexity = this.calculateComplexityScore(decoded);
    if (complexity > 70) {
      recommendations.push({
        type: 'PERFORMANCE',
        priority: 'MEDIUM',
        description: 'Optimize message complexity',
        action: 'Consider message simplification or fragmentation'
      });
    }

    return recommendations;
  }

  // Store message in history
  storeMessage(decoded, analysis) {
    const timestamp = new Date().toISOString();
    this.messageHistory.set(timestamp, {
      decoded: decoded,
      analysis: analysis,
      timestamp: timestamp
    });

    // Keep only last 1000 messages
    if (this.messageHistory.size > 1000) {
      const firstKey = this.messageHistory.keys().next().value;
      this.messageHistory.delete(firstKey);
    }
  }

  // Update analysis metrics
  updateAnalysisMetrics(analysis) {
    const timestamp = new Date().toISOString();
    const metrics = {
      timestamp: timestamp,
      messageType: analysis.decoded.messageType,
      protocol: analysis.decoded.protocol,
      validationScore: analysis.metrics.validationScore,
      complexityScore: analysis.metrics.complexityScore,
      anomalyCount: analysis.anomalies.length,
      correlationCount: analysis.correlations.length
    };

    this.analysisMetrics.set(timestamp, metrics);
  }

  // Helper methods for checking message properties
  hasCriticalExtensions(decoded) {
    return decoded?.criticalExtensions !== null && decoded?.criticalExtensions !== undefined;
  }

  countBearers(decoded) {
    let count = 0;
    if (decoded?.srbToAddModList) count += decoded.srbToAddModList.length;
    if (decoded?.drbToAddModList) count += decoded.drbToAddModList.length;
    return count;
  }

  hasCellConfig(decoded) {
    return decoded?.masterCellGroup !== null && decoded?.masterCellGroup !== undefined;
  }

  hasMobileIdentity(decoded) {
    return decoded?.mobileIdentity !== null && decoded?.mobileIdentity !== undefined;
  }

  hasCapabilities(decoded) {
    return decoded?.capabilities !== null && decoded?.capabilities !== undefined;
  }

  hasBSR(decoded) {
    return decoded?.bufferStatusReport !== null && decoded?.bufferStatusReport !== undefined;
  }

  hasPHR(decoded) {
    return decoded?.powerHeadroomReport !== null && decoded?.powerHeadroomReport !== undefined;
  }

  hasTimingAdvance(decoded) {
    return decoded?.timingAdvance !== null && decoded?.timingAdvance !== undefined;
  }

  // Create error analysis
  createErrorAnalysis(rawMessage, error) {
    return {
      decoded: null,
      timestamp: new Date().toISOString(),
      context: {},
      metrics: {
        messageSize: rawMessage ? rawMessage.length : 0,
        fieldCount: 0,
        validationScore: 0,
        complexityScore: 0,
        protocolCompliance: 'ERROR'
      },
      anomalies: [{
        type: 'ANALYSIS_ERROR',
        severity: 'HIGH',
        description: `Analysis failed: ${error.message}`,
        recommendation: 'Check message format and decoder configuration'
      }],
      correlations: [],
      recommendations: [{
        type: 'ERROR_RECOVERY',
        priority: 'HIGH',
        description: 'Fix analysis error',
        action: 'Review message format and decoder setup'
      }]
    };
  }

  // Get analysis statistics
  getAnalysisStatistics() {
    const stats = {
      totalMessages: this.messageHistory.size,
      messageTypes: {},
      protocols: {},
      averageValidationScore: 0,
      averageComplexityScore: 0,
      totalAnomalies: 0,
      totalCorrelations: 0
    };

    let totalValidationScore = 0;
    let totalComplexityScore = 0;

    for (const [timestamp, message] of this.messageHistory) {
      const analysis = message.analysis;
      
      // Count message types
      const messageType = analysis.decoded.messageType;
      stats.messageTypes[messageType] = (stats.messageTypes[messageType] || 0) + 1;
      
      // Count protocols
      const protocol = analysis.decoded.protocol;
      stats.protocols[protocol] = (stats.protocols[protocol] || 0) + 1;
      
      // Sum scores
      totalValidationScore += analysis.metrics.validationScore;
      totalComplexityScore += analysis.metrics.complexityScore;
      
      // Count anomalies and correlations
      stats.totalAnomalies += analysis.anomalies.length;
      stats.totalCorrelations += analysis.correlations.length;
    }

    // Calculate averages
    if (this.messageHistory.size > 0) {
      stats.averageValidationScore = totalValidationScore / this.messageHistory.size;
      stats.averageComplexityScore = totalComplexityScore / this.messageHistory.size;
    }

    return stats;
  }

  // Clear analysis history
  clearHistory() {
    this.messageHistory.clear();
    this.analysisMetrics.clear();
  }
}

// Anomaly Detector for advanced pattern recognition
class AnomalyDetector {
  constructor() {
    this.patterns = new Map();
    this.thresholds = {
      messageRate: 100, // messages per second
      errorRate: 0.1,   // 10% error rate
      complexityThreshold: 80
    };
  }

  detectAnomalies(messages) {
    const anomalies = [];
    
    // Rate-based anomalies
    anomalies.push(...this.detectRateAnomalies(messages));
    
    // Pattern-based anomalies
    anomalies.push(...this.detectPatternAnomalies(messages));
    
    // Statistical anomalies
    anomalies.push(...this.detectStatisticalAnomalies(messages));
    
    return anomalies;
  }

  detectRateAnomalies(messages) {
    const anomalies = [];
    
    // Check message rate
    const messageRate = this.calculateMessageRate(messages);
    if (messageRate > this.thresholds.messageRate) {
      anomalies.push({
        type: 'HIGH_MESSAGE_RATE',
        severity: 'MEDIUM',
        description: `High message rate: ${messageRate} msg/s`,
        recommendation: 'Monitor for potential flooding attack'
      });
    }
    
    return anomalies;
  }

  detectPatternAnomalies(messages) {
    const anomalies = [];
    
    // Check for repeated error patterns
    const errorPattern = this.detectErrorPatterns(messages);
    if (errorPattern.length > 5) {
      anomalies.push({
        type: 'REPEATED_ERRORS',
        severity: 'HIGH',
        description: `Repeated error pattern detected: ${errorPattern.length} consecutive errors`,
        recommendation: 'Investigate root cause of repeated errors'
      });
    }
    
    return anomalies;
  }

  detectStatisticalAnomalies(messages) {
    const anomalies = [];
    
    // Check for outliers in message complexity
    const complexities = messages.map(m => m.analysis?.metrics?.complexityScore || 0);
    const outliers = this.detectOutliers(complexities);
    
    if (outliers.length > 0) {
      anomalies.push({
        type: 'COMPLEXITY_OUTLIERS',
        severity: 'LOW',
        description: `Complexity outliers detected: ${outliers.length} messages`,
        recommendation: 'Review high-complexity messages for optimization'
      });
    }
    
    return anomalies;
  }

  calculateMessageRate(messages) {
    if (messages.length < 2) return 0;
    
    const timeSpan = new Date(messages[messages.length - 1].timestamp) - new Date(messages[0].timestamp);
    return (messages.length / timeSpan) * 1000; // messages per second
  }

  detectErrorPatterns(messages) {
    const errors = [];
    let consecutiveErrors = 0;
    
    for (const message of messages) {
      if (message.analysis?.anomalies?.length > 0) {
        consecutiveErrors++;
      } else {
        if (consecutiveErrors > 0) {
          errors.push(consecutiveErrors);
        }
        consecutiveErrors = 0;
      }
    }
    
    return errors;
  }

  detectOutliers(values) {
    if (values.length < 3) return [];
    
    const sorted = [...values].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    
    return values.filter(v => v < lowerBound || v > upperBound);
  }
}

// Export the analyzer
window.ThreeGPPMessageAnalyzer = ThreeGPPMessageAnalyzer;
window.AnomalyDetector = AnomalyDetector;
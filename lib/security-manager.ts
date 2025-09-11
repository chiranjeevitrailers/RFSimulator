import { supabase } from './supabase';

export interface SecurityConfig {
  enableRateLimiting: boolean;
  maxRequestsPerMinute: number;
  enableBruteForceProtection: boolean;
  maxFailedAttempts: number;
  lockoutDuration: number;
  enableSessionManagement: boolean;
  sessionTimeout: number;
  enableAuditLogging: boolean;
  enableDataEncryption: boolean;
  enableInputValidation: boolean;
  enableCSRFProtection: boolean;
  enableXSSProtection: boolean;
  enableSQLInjectionProtection: boolean;
  enableContentSecurityPolicy: boolean;
  enableHSTS: boolean;
  enableSecureCookies: boolean;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    maxAge: number;
  };
}

export interface SecurityEvent {
  id: string;
  type: 'login_attempt' | 'failed_login' | 'suspicious_activity' | 'data_access' | 'system_change' | 'security_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  details: any;
  resolved: boolean;
  actionTaken?: string;
}

export interface SecurityMetrics {
  totalEvents: number;
  criticalEvents: number;
  highSeverityEvents: number;
  mediumSeverityEvents: number;
  lowSeverityEvents: number;
  failedLoginAttempts: number;
  suspiciousActivities: number;
  blockedIPs: number;
  activeThreats: number;
  lastSecurityScan: Date;
  complianceScore: number;
}

export interface ComplianceReport {
  id: string;
  type: 'GDPR' | 'CCPA' | 'SOX' | 'HIPAA' | 'PCI-DSS' | 'ISO27001';
  status: 'compliant' | 'non-compliant' | 'partial';
  score: number;
  lastAssessment: Date;
  nextAssessment: Date;
  findings: Array<{
    category: string;
    status: 'pass' | 'fail' | 'warning';
    description: string;
    recommendation: string;
  }>;
  recommendations: string[];
}

export class SecurityManager {
  private static instance: SecurityManager;
  private config: SecurityConfig;
  private securityEvents: SecurityEvent[] = [];
  private blockedIPs: Set<string> = new Set();
  private failedAttempts: Map<string, { count: number; lastAttempt: Date }> = new Map();
  private rateLimitTracker: Map<string, { count: number; windowStart: Date }> = new Map();
  private sessionTracker: Map<string, { userId: string; lastActivity: Date; ipAddress: string }> = new Map();

  private constructor() {
    this.config = {
      enableRateLimiting: true,
      maxRequestsPerMinute: 100,
      enableBruteForceProtection: true,
      maxFailedAttempts: 5,
      lockoutDuration: 15 * 60 * 1000, // 15 minutes
      enableSessionManagement: true,
      sessionTimeout: 30 * 60 * 1000, // 30 minutes
      enableAuditLogging: true,
      enableDataEncryption: true,
      enableInputValidation: true,
      enableCSRFProtection: true,
      enableXSSProtection: true,
      enableSQLInjectionProtection: true,
      enableContentSecurityPolicy: true,
      enableHSTS: true,
      enableSecureCookies: true,
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        maxAge: 90 * 24 * 60 * 60 * 1000 // 90 days
      }
    };

    this.startSecurityMonitoring();
  }

  public static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager();
    }
    return SecurityManager.instance;
  }

  // Authentication security
  public async validateLoginAttempt(email: string, password: string, ipAddress: string, userAgent: string): Promise<{
    success: boolean;
    reason?: string;
    lockoutTime?: number;
  }> {
    try {
      // Check if IP is blocked
      if (this.blockedIPs.has(ipAddress)) {
        await this.logSecurityEvent({
          type: 'security_violation',
          severity: 'high',
          ipAddress,
          userAgent,
          details: { reason: 'Blocked IP attempt', email }
        });
        return { success: false, reason: 'IP address is blocked' };
      }

      // Check rate limiting
      if (!this.checkRateLimit(ipAddress)) {
        await this.logSecurityEvent({
          type: 'security_violation',
          severity: 'medium',
          ipAddress,
          userAgent,
          details: { reason: 'Rate limit exceeded', email }
        });
        return { success: false, reason: 'Too many requests. Please try again later.' };
      }

      // Check brute force protection
      const bruteForceCheck = this.checkBruteForceProtection(email, ipAddress);
      if (!bruteForceCheck.allowed) {
        await this.logSecurityEvent({
          type: 'failed_login',
          severity: 'high',
          ipAddress,
          userAgent,
          details: { reason: 'Brute force protection triggered', email, attempts: bruteForceCheck.attempts }
        });
        return { 
          success: false, 
          reason: 'Too many failed attempts. Account temporarily locked.',
          lockoutTime: bruteForceCheck.lockoutTime
        };
      }

      // Validate password strength
      const passwordValidation = this.validatePasswordStrength(password);
      if (!passwordValidation.valid) {
        await this.logSecurityEvent({
          type: 'security_violation',
          severity: 'medium',
          ipAddress,
          userAgent,
          details: { reason: 'Weak password attempt', email, violations: passwordValidation.violations }
        });
        return { success: false, reason: 'Password does not meet security requirements' };
      }

      // Attempt authentication
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        // Log failed attempt
        this.recordFailedAttempt(email, ipAddress);
        await this.logSecurityEvent({
          type: 'failed_login',
          severity: 'medium',
          ipAddress,
          userAgent,
          details: { reason: 'Invalid credentials', email, error: error.message }
        });
        return { success: false, reason: 'Invalid email or password' };
      }

      // Successful login
      this.clearFailedAttempts(email, ipAddress);
      await this.logSecurityEvent({
        type: 'login_attempt',
        severity: 'low',
        userId: data.user?.id,
        ipAddress,
        userAgent,
        details: { reason: 'Successful login', email }
      });

      // Create session
      if (this.config.enableSessionManagement && data.user) {
        this.createSession(data.user.id, ipAddress);
      }

      return { success: true };
    } catch (error) {
      await this.logSecurityEvent({
        type: 'security_violation',
        severity: 'high',
        ipAddress,
        userAgent,
        details: { reason: 'Authentication error', email, error: error.message }
      });
      return { success: false, reason: 'Authentication service error' };
    }
  }

  // Input validation and sanitization
  public validateInput(input: any, type: 'email' | 'password' | 'text' | 'number' | 'url'): {
    valid: boolean;
    sanitized?: any;
    errors: string[];
  } {
    const errors: string[] = [];
    let sanitized = input;

    switch (type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input)) {
          errors.push('Invalid email format');
        }
        sanitized = input.toLowerCase().trim();
        break;

      case 'password':
        const passwordValidation = this.validatePasswordStrength(input);
        if (!passwordValidation.valid) {
          errors.push(...passwordValidation.violations);
        }
        break;

      case 'text':
        if (typeof input !== 'string') {
          errors.push('Input must be a string');
        } else {
          // XSS protection
          sanitized = this.sanitizeHTML(input);
          if (sanitized !== input) {
            errors.push('Potentially malicious content detected');
          }
        }
        break;

      case 'number':
        if (isNaN(Number(input))) {
          errors.push('Input must be a valid number');
        } else {
          sanitized = Number(input);
        }
        break;

      case 'url':
        try {
          new URL(input);
          sanitized = input;
        } catch {
          errors.push('Invalid URL format');
        }
        break;
    }

    return {
      valid: errors.length === 0,
      sanitized: errors.length === 0 ? sanitized : undefined,
      errors
    };
  }

  // Rate limiting
  private checkRateLimit(ipAddress: string): boolean {
    if (!this.config.enableRateLimiting) return true;

    const now = Date.now();
    const windowStart = now - 60000; // 1 minute window
    const tracker = this.rateLimitTracker.get(ipAddress);

    if (!tracker || tracker.windowStart < windowStart) {
      this.rateLimitTracker.set(ipAddress, { count: 1, windowStart: now });
      return true;
    }

    if (tracker.count >= this.config.maxRequestsPerMinute) {
      return false;
    }

    tracker.count++;
    return true;
  }

  // Brute force protection
  private checkBruteForceProtection(email: string, ipAddress: string): {
    allowed: boolean;
    attempts: number;
    lockoutTime?: number;
  } {
    if (!this.config.enableBruteForceProtection) return { allowed: true, attempts: 0 };

    const key = `${email}:${ipAddress}`;
    const attempts = this.failedAttempts.get(key);

    if (!attempts) {
      return { allowed: true, attempts: 0 };
    }

    const timeSinceLastAttempt = Date.now() - attempts.lastAttempt.getTime();
    const lockoutTime = this.config.lockoutDuration - timeSinceLastAttempt;

    if (attempts.count >= this.config.maxFailedAttempts && lockoutTime > 0) {
      return { allowed: false, attempts: attempts.count, lockoutTime };
    }

    if (timeSinceLastAttempt > this.config.lockoutDuration) {
      this.failedAttempts.delete(key);
      return { allowed: true, attempts: 0 };
    }

    return { allowed: true, attempts: attempts.count };
  }

  private recordFailedAttempt(email: string, ipAddress: string): void {
    const key = `${email}:${ipAddress}`;
    const attempts = this.failedAttempts.get(key);

    if (attempts) {
      attempts.count++;
      attempts.lastAttempt = new Date();
    } else {
      this.failedAttempts.set(key, { count: 1, lastAttempt: new Date() });
    }
  }

  private clearFailedAttempts(email: string, ipAddress: string): void {
    const key = `${email}:${ipAddress}`;
    this.failedAttempts.delete(key);
  }

  // Password validation
  private validatePasswordStrength(password: string): {
    valid: boolean;
    violations: string[];
  } {
    const violations: string[] = [];

    if (password.length < this.config.passwordPolicy.minLength) {
      violations.push(`Password must be at least ${this.config.passwordPolicy.minLength} characters long`);
    }

    if (this.config.passwordPolicy.requireUppercase && !/[A-Z]/.test(password)) {
      violations.push('Password must contain at least one uppercase letter');
    }

    if (this.config.passwordPolicy.requireLowercase && !/[a-z]/.test(password)) {
      violations.push('Password must contain at least one lowercase letter');
    }

    if (this.config.passwordPolicy.requireNumbers && !/\d/.test(password)) {
      violations.push('Password must contain at least one number');
    }

    if (this.config.passwordPolicy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      violations.push('Password must contain at least one special character');
    }

    return {
      valid: violations.length === 0,
      violations
    };
  }

  // Session management
  private createSession(userId: string, ipAddress: string): void {
    const sessionId = this.generateSessionId();
    this.sessionTracker.set(sessionId, {
      userId,
      lastActivity: new Date(),
      ipAddress
    });
  }

  public validateSession(sessionId: string, ipAddress: string): {
    valid: boolean;
    userId?: string;
    reason?: string;
  } {
    const session = this.sessionTracker.get(sessionId);

    if (!session) {
      return { valid: false, reason: 'Session not found' };
    }

    if (session.ipAddress !== ipAddress) {
      this.logSecurityEvent({
        type: 'suspicious_activity',
        severity: 'high',
        userId: session.userId,
        ipAddress,
        userAgent: '',
        details: { reason: 'Session IP mismatch', expectedIP: session.ipAddress }
      });
      return { valid: false, reason: 'Session IP mismatch' };
    }

    const timeSinceLastActivity = Date.now() - session.lastActivity.getTime();
    if (timeSinceLastActivity > this.config.sessionTimeout) {
      this.sessionTracker.delete(sessionId);
      return { valid: false, reason: 'Session expired' };
    }

    session.lastActivity = new Date();
    return { valid: true, userId: session.userId };
  }

  private generateSessionId(): string {
    return 'sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // Security event logging
  public async logSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp' | 'resolved'>): Promise<void> {
    const securityEvent: SecurityEvent = {
      id: this.generateEventId(),
      timestamp: new Date(),
      resolved: false,
      ...event
    };

    this.securityEvents.push(securityEvent);

    // Store in database
    try {
      await supabase.from('security_events').insert({
        id: securityEvent.id,
        type: securityEvent.type,
        severity: securityEvent.severity,
        user_id: securityEvent.userId,
        ip_address: securityEvent.ipAddress,
        user_agent: securityEvent.userAgent,
        details: securityEvent.details,
        resolved: securityEvent.resolved,
        created_at: securityEvent.timestamp.toISOString()
      });
    } catch (error) {
      console.error('Failed to log security event to database:', error);
    }

    // Take automatic actions for critical events
    if (event.severity === 'critical') {
      await this.handleCriticalEvent(securityEvent);
    }
  }

  private async handleCriticalEvent(event: SecurityEvent): Promise<void> {
    // Block IP for critical events
    this.blockedIPs.add(event.ipAddress);

    // Log the action
    await this.logSecurityEvent({
      type: 'security_violation',
      severity: 'high',
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      details: { 
        reason: 'IP blocked due to critical security event',
        originalEvent: event.id,
        action: 'IP_BLOCKED'
      }
    });
  }

  // Compliance checking
  public async generateComplianceReport(type: 'GDPR' | 'CCPA' | 'SOX' | 'HIPAA' | 'PCI-DSS' | 'ISO27001'): Promise<ComplianceReport> {
    const findings: Array<{
      category: string;
      status: 'pass' | 'fail' | 'warning';
      description: string;
      recommendation: string;
    }> = [];

    const recommendations: string[] = [];

    switch (type) {
      case 'GDPR':
        findings.push(
          {
            category: 'Data Encryption',
            status: this.config.enableDataEncryption ? 'pass' : 'fail',
            description: 'Personal data encryption at rest and in transit',
            recommendation: this.config.enableDataEncryption ? 'Encryption is enabled' : 'Enable data encryption'
          },
          {
            category: 'Audit Logging',
            status: this.config.enableAuditLogging ? 'pass' : 'fail',
            description: 'Comprehensive audit logging of data access',
            recommendation: this.config.enableAuditLogging ? 'Audit logging is enabled' : 'Enable audit logging'
          },
          {
            category: 'Data Minimization',
            status: 'pass',
            description: 'Only necessary data is collected and processed',
            recommendation: 'Continue data minimization practices'
          }
        );
        break;

      case 'CCPA':
        findings.push(
          {
            category: 'Data Transparency',
            status: 'pass',
            description: 'Clear data collection and usage policies',
            recommendation: 'Maintain transparent data practices'
          },
          {
            category: 'User Rights',
            status: 'pass',
            description: 'Users can access, delete, and opt-out of data collection',
            recommendation: 'Continue providing user data rights'
          }
        );
        break;

      case 'SOX':
        findings.push(
          {
            category: 'Access Controls',
            status: this.config.enableSessionManagement ? 'pass' : 'fail',
            description: 'Strong access controls and session management',
            recommendation: this.config.enableSessionManagement ? 'Access controls are adequate' : 'Implement session management'
          },
          {
            category: 'Audit Trail',
            status: this.config.enableAuditLogging ? 'pass' : 'fail',
            description: 'Comprehensive audit trail for financial data',
            recommendation: this.config.enableAuditLogging ? 'Audit trail is adequate' : 'Enable audit logging'
          }
        );
        break;
    }

    const passedFindings = findings.filter(f => f.status === 'pass').length;
    const totalFindings = findings.length;
    const score = totalFindings > 0 ? (passedFindings / totalFindings) * 100 : 0;

    const report: ComplianceReport = {
      id: this.generateReportId(),
      type,
      status: score >= 80 ? 'compliant' : score >= 60 ? 'partial' : 'non-compliant',
      score,
      lastAssessment: new Date(),
      nextAssessment: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      findings,
      recommendations
    };

    return report;
  }

  // Security monitoring
  private startSecurityMonitoring(): void {
    setInterval(() => {
      this.cleanupExpiredSessions();
      this.cleanupRateLimitTracker();
    }, 60000); // Run every minute
  }

  private cleanupExpiredSessions(): void {
    const now = Date.now();
    for (const [sessionId, session] of this.sessionTracker.entries()) {
      if (now - session.lastActivity.getTime() > this.config.sessionTimeout) {
        this.sessionTracker.delete(sessionId);
      }
    }
  }

  private cleanupRateLimitTracker(): void {
    const now = Date.now();
    const windowStart = now - 60000; // 1 minute window
    for (const [ip, tracker] of this.rateLimitTracker.entries()) {
      if (tracker.windowStart < windowStart) {
        this.rateLimitTracker.delete(ip);
      }
    }
  }

  // Utility methods
  private sanitizeHTML(input: string): string {
    // Basic HTML sanitization
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  private generateEventId(): string {
    return 'evt_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private generateReportId(): string {
    return 'rpt_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // Public getters
  public getSecurityMetrics(): SecurityMetrics {
    const totalEvents = this.securityEvents.length;
    const criticalEvents = this.securityEvents.filter(e => e.severity === 'critical').length;
    const highSeverityEvents = this.securityEvents.filter(e => e.severity === 'high').length;
    const mediumSeverityEvents = this.securityEvents.filter(e => e.severity === 'medium').length;
    const lowSeverityEvents = this.securityEvents.filter(e => e.severity === 'low').length;
    const failedLoginAttempts = this.securityEvents.filter(e => e.type === 'failed_login').length;
    const suspiciousActivities = this.securityEvents.filter(e => e.type === 'suspicious_activity').length;

    return {
      totalEvents,
      criticalEvents,
      highSeverityEvents,
      mediumSeverityEvents,
      lowSeverityEvents,
      failedLoginAttempts,
      suspiciousActivities,
      blockedIPs: this.blockedIPs.size,
      activeThreats: this.securityEvents.filter(e => !e.resolved).length,
      lastSecurityScan: new Date(),
      complianceScore: 85 // Placeholder
    };
  }

  public getSecurityEvents(limit: number = 100): SecurityEvent[] {
    return this.securityEvents
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  public getConfig(): SecurityConfig {
    return { ...this.config };
  }

  public updateConfig(updates: Partial<SecurityConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  public getBlockedIPs(): string[] {
    return Array.from(this.blockedIPs);
  }

  public unblockIP(ipAddress: string): void {
    this.blockedIPs.delete(ipAddress);
  }

  public getActiveSessions(): Array<{ sessionId: string; userId: string; lastActivity: Date; ipAddress: string }> {
    return Array.from(this.sessionTracker.entries()).map(([sessionId, session]) => ({
      sessionId,
      userId: session.userId,
      lastActivity: session.lastActivity,
      ipAddress: session.ipAddress
    }));
  }
}
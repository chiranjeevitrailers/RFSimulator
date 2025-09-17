// Access Restrictions and Misuse Prevention System

/**
 * Access Restriction Configuration
 * Defines limits and restrictions for different user tiers
 */

export const ACCESS_RESTRICTIONS = {
  FREE: {
    timeLimit: {
      maxMonths: 4,
      gracePeriodDays: 30
    },
    usage: {
      testExecutionsPerDay: 3,
      testExecutionsPerHour: 1,
      apiCallsPerHour: 5,
      exportsPerWeek: 1,
      maxConcurrentSessions: 1
    },
    resources: {
      maxStorageMB: 10,
      maxBandwidthGB: 1,
      maxTestExecutionMinutes: 5
    },
    testRepetition: {
      maxExecutionsPerHour: 3,
      cooldownMinutes: 60
    }
  },
  PRO: {
    timeLimit: {
      maxMonths: -1, // Unlimited
      gracePeriodDays: 30
    },
    usage: {
      testExecutionsPerDay: 100,
      testExecutionsPerHour: 10,
      apiCallsPerHour: 1000,
      exportsPerDay: 10,
      maxConcurrentSessions: 5
    },
    resources: {
      maxStorageMB: 1000,
      maxBandwidthGB: 100,
      maxTestExecutionMinutes: 30
    },
    testRepetition: {
      maxExecutionsPerHour: 10,
      cooldownMinutes: 10
    }
  },
  ENTERPRISE: {
    timeLimit: {
      maxMonths: -1, // Unlimited
      gracePeriodDays: 60
    },
    usage: {
      testExecutionsPerDay: -1, // Unlimited
      testExecutionsPerHour: -1, // Unlimited
      apiCallsPerHour: -1, // Unlimited
      exportsPerDay: -1, // Unlimited
      maxConcurrentSessions: -1 // Unlimited
    },
    resources: {
      maxStorageMB: 10000,
      maxBandwidthGB: 1000,
      maxTestExecutionMinutes: 120
    },
    testRepetition: {
      maxExecutionsPerHour: -1, // Unlimited
      cooldownMinutes: 0
    }
  }
};

/**
 * Check if user has exceeded time-based access limits
 * @param {Object} user - User object with tier and created_at
 * @returns {Object} - Access check result
 */
export const checkTimeLimit = (user) => {
  const restrictions = ACCESS_RESTRICTIONS[user.tier] || ACCESS_RESTRICTIONS.FREE;
  
  // Enterprise and Pro users have no time limits
  if (restrictions.timeLimit.maxMonths === -1) {
    return { allowed: true };
  }
  
  const registrationDate = new Date(user.created_at);
  const limitDate = new Date();
  limitDate.setMonth(limitDate.getMonth() - restrictions.timeLimit.maxMonths);
  
  const gracePeriodDate = new Date();
  gracePeriodDate.setDate(gracePeriodDate.getDate() - restrictions.timeLimit.gracePeriodDays);
  
  if (registrationDate < limitDate) {
    if (registrationDate < gracePeriodDate) {
      return {
        allowed: false,
        reason: 'time_limit_exceeded',
        message: 'Your free trial has expired. Please upgrade to continue using the platform.',
        upgradeRequired: true,
        daysRemaining: 0
      };
    } else {
      return {
        allowed: true,
        warning: true,
        reason: 'grace_period',
        message: `Your free trial expires in ${Math.ceil((gracePeriodDate - new Date()) / (1000 * 60 * 60 * 24))} days. Please upgrade to continue.`,
        upgradeRequired: false,
        daysRemaining: Math.ceil((gracePeriodDate - new Date()) / (1000 * 60 * 60 * 24))
      };
    }
  }
  
  return { allowed: true };
};

/**
 * Check if user has exceeded usage limits
 * @param {Object} user - User object
 * @param {string} action - Action type (testExecution, apiCall, export)
 * @param {Object} usageData - Current usage data
 * @returns {Object} - Access check result
 */
export const checkUsageLimit = (user, action, usageData) => {
  const restrictions = ACCESS_RESTRICTIONS[user.tier] || ACCESS_RESTRICTIONS.FREE;
  const actionRestrictions = restrictions.usage;
  
  // Enterprise users have unlimited usage
  if (actionRestrictions[action] === -1) {
    return { allowed: true };
  }
  
  const limit = actionRestrictions[action];
  const currentUsage = usageData[action] || 0;
  
  if (currentUsage >= limit) {
    return {
      allowed: false,
      reason: 'usage_limit_exceeded',
      message: `You have reached your ${action} limit. Please upgrade to increase your limits.`,
      upgradeRequired: true,
      currentUsage,
      limit
    };
  }
  
  return { allowed: true };
};

/**
 * Check if user is repeating the same test case too frequently
 * @param {string} userId - User ID
 * @param {string} testCaseId - Test case ID
 * @param {Array} recentExecutions - Recent test executions
 * @returns {Object} - Access check result
 */
export const checkTestRepetition = (userId, testCaseId, recentExecutions) => {
  const user = { tier: 'FREE' }; // This should come from user data
  const restrictions = ACCESS_RESTRICTIONS[user.tier] || ACCESS_RESTRICTIONS.FREE;
  const repetitionRestrictions = restrictions.testRepetition;
  
  // Enterprise users have no repetition limits
  if (repetitionRestrictions.maxExecutionsPerHour === -1) {
    return { allowed: true };
  }
  
  const oneHourAgo = new Date(Date.now() - 3600000);
  const recentTestExecutions = recentExecutions.filter(execution => 
    execution.test_case_id === testCaseId && 
    new Date(execution.execution_time) > oneHourAgo
  );
  
  if (recentTestExecutions.length >= repetitionRestrictions.maxExecutionsPerHour) {
    return {
      allowed: false,
      reason: 'test_repetition_limit',
      message: `You have executed this test case too many times. Please wait ${repetitionRestrictions.cooldownMinutes} minutes before trying again.`,
      upgradeRequired: false,
      cooldownMinutes: repetitionRestrictions.cooldownMinutes,
      recentExecutions: recentTestExecutions.length
    };
  }
  
  return { allowed: true };
};

/**
 * Check if user has exceeded resource limits
 * @param {Object} user - User object
 * @param {string} resource - Resource type (storage, bandwidth, executionTime)
 * @param {number} currentUsage - Current resource usage
 * @returns {Object} - Access check result
 */
export const checkResourceLimit = (user, resource, currentUsage) => {
  const restrictions = ACCESS_RESTRICTIONS[user.tier] || ACCESS_RESTRICTIONS.FREE;
  const resourceRestrictions = restrictions.resources;
  
  const limit = resourceRestrictions[resource];
  if (limit === -1) {
    return { allowed: true };
  }
  
  if (currentUsage >= limit) {
    return {
      allowed: false,
      reason: 'resource_limit_exceeded',
      message: `You have exceeded your ${resource} limit. Please upgrade to increase your limits.`,
      upgradeRequired: true,
      currentUsage,
      limit
    };
  }
  
  return { allowed: true };
};

/**
 * Check concurrent session limits
 * @param {Object} user - User object
 * @param {number} activeSessions - Number of active sessions
 * @returns {Object} - Access check result
 */
export const checkConcurrentSessions = (user, activeSessions) => {
  const restrictions = ACCESS_RESTRICTIONS[user.tier] || ACCESS_RESTRICTIONS.FREE;
  const maxSessions = restrictions.usage.maxConcurrentSessions;
  
  if (maxSessions === -1) {
    return { allowed: true };
  }
  
  if (activeSessions >= maxSessions) {
    return {
      allowed: false,
      reason: 'concurrent_session_limit',
      message: `You have reached your maximum concurrent sessions (${maxSessions}). Please log out from other devices or upgrade your plan.`,
      upgradeRequired: true,
      currentSessions: activeSessions,
      maxSessions
    };
  }
  
  return { allowed: true };
};

/**
 * Comprehensive access check for any action
 * @param {Object} user - User object
 * @param {string} action - Action type
 * @param {Object} context - Additional context (testCaseId, usageData, etc.)
 * @returns {Object} - Comprehensive access check result
 */
export const checkAccess = async (user, action, context = {}) => {
  const results = [];
  
  // Check time limit
  const timeCheck = checkTimeLimit(user);
  results.push(timeCheck);
  
  // Check usage limits
  if (context.usageData) {
    const usageCheck = checkUsageLimit(user, action, context.usageData);
    results.push(usageCheck);
  }
  
  // Check test repetition
  if (action === 'testExecution' && context.testCaseId && context.recentExecutions) {
    const repetitionCheck = checkTestRepetition(user.id, context.testCaseId, context.recentExecutions);
    results.push(repetitionCheck);
  }
  
  // Check resource limits
  if (context.resourceUsage) {
    for (const [resource, usage] of Object.entries(context.resourceUsage)) {
      const resourceCheck = checkResourceLimit(user, resource, usage);
      results.push(resourceCheck);
    }
  }
  
  // Check concurrent sessions
  if (action === 'login' && context.activeSessions !== undefined) {
    const sessionCheck = checkConcurrentSessions(user, context.activeSessions);
    results.push(sessionCheck);
  }
  
  // Return the first restriction found, or allow if all checks pass
  const firstRestriction = results.find(result => !result.allowed);
  if (firstRestriction) {
    return firstRestriction;
  }
  
  // Check for warnings
  const warning = results.find(result => result.warning);
  if (warning) {
    return warning;
  }
  
  return { allowed: true };
};

/**
 * Get user's current usage statistics
 * @param {string} userId - User ID
 * @param {string} period - Time period (day, week, month)
 * @returns {Object} - Usage statistics
 */
export const getUserUsageStats = async (userId, period = 'day') => {
  // This would typically query the database
  // For now, return mock data
  return {
    testExecutions: 2,
    apiCalls: 15,
    exports: 0,
    storageUsed: 5, // MB
    bandwidthUsed: 0.1, // GB
    period
  };
};

/**
 * Log user action for tracking and monitoring
 * @param {string} userId - User ID
 * @param {string} action - Action type
 * @param {Object} metadata - Additional metadata
 */
export const logUserAction = async (userId, action, metadata = {}) => {
  // This would typically log to the database
  console.log('User action logged:', {
    userId,
    action,
    timestamp: new Date().toISOString(),
    metadata
  });
};

export default {
  ACCESS_RESTRICTIONS,
  checkTimeLimit,
  checkUsageLimit,
  checkTestRepetition,
  checkResourceLimit,
  checkConcurrentSessions,
  checkAccess,
  getUserUsageStats,
  logUserAction
};
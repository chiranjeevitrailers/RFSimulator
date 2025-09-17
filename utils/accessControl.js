// User Access Control System for 5GLabX Platform

/**
 * User Access Control Configuration
 * Defines what features and test cases each subscription tier can access
 */

export const ACCESS_LEVELS = {
  FREE: 'free',
  PRO: 'pro',
  ENTERPRISE: 'enterprise'
};

export const FEATURES = {
  BASIC_ANALYSIS: 'basic-analysis',
  ADVANCED_ANALYSIS: 'advanced-analysis',
  EXPORT: 'export',
  API_ACCESS: 'api-access',
  PRIORITY_SUPPORT: 'priority-support',
  CUSTOM_TEST_CASES: 'custom-test-cases',
  WHITE_LABEL: 'white-label',
  DEDICATED_SUPPORT: 'dedicated-support',
  UNLIMITED_USERS: 'unlimited-users',
  CUSTOM_INTEGRATIONS: 'custom-integrations',
  SLA_GUARANTEE: 'sla-guarantee'
};

export const PROTOCOLS = {
  '5G-NR-BASIC': '5G-NR-Basic',
  '5G-NR-ADVANCED': '5G-NR-Advanced',
  'LTE-BASIC': 'LTE-Basic',
  'LTE-ADVANCED': 'LTE-Advanced',
  'IMS-BASIC': 'IMS-Basic',
  'IMS-ADVANCED': 'IMS-Advanced',
  'O-RAN': 'O-RAN',
  'V2X': 'V2X',
  'NTN': 'NTN',
  'NB-IOT': 'NB-IoT',
  'CUSTOM': 'Custom'
};

// Access control configuration for each tier
export const ACCESS_CONFIG = {
  [ACCESS_LEVELS.FREE]: {
    name: 'Free',
    maxTestCases: 3,
    allowedProtocols: [
      PROTOCOLS['5G-NR-BASIC'],
      PROTOCOLS['LTE-BASIC'],
      PROTOCOLS['IMS-BASIC']
    ],
    allowedFeatures: [
      FEATURES.BASIC_ANALYSIS
    ],
    limitations: [
      'No Advanced Test Cases',
      'No Export Features',
      'No API Access',
      'No Priority Support'
    ],
    maxUsers: 1,
    trialDays: 7,
    price: 0
  },
  [ACCESS_LEVELS.PRO]: {
    name: 'Pro',
    maxTestCases: 1000,
    allowedProtocols: [
      PROTOCOLS['5G-NR-BASIC'],
      PROTOCOLS['5G-NR-ADVANCED'],
      PROTOCOLS['LTE-BASIC'],
      PROTOCOLS['LTE-ADVANCED'],
      PROTOCOLS['IMS-BASIC'],
      PROTOCOLS['IMS-ADVANCED'],
      PROTOCOLS['O-RAN'],
      PROTOCOLS['V2X'],
      PROTOCOLS['NTN'],
      PROTOCOLS['NB-IOT']
    ],
    allowedFeatures: [
      FEATURES.BASIC_ANALYSIS,
      FEATURES.ADVANCED_ANALYSIS,
      FEATURES.EXPORT,
      FEATURES.API_ACCESS,
      FEATURES.PRIORITY_SUPPORT,
      FEATURES.CUSTOM_TEST_CASES
    ],
    limitations: [],
    maxUsers: 5,
    trialDays: 7,
    price: 99
  },
  [ACCESS_LEVELS.ENTERPRISE]: {
    name: 'Enterprise',
    maxTestCases: 'unlimited',
    allowedProtocols: [
      PROTOCOLS['5G-NR-BASIC'],
      PROTOCOLS['5G-NR-ADVANCED'],
      PROTOCOLS['LTE-BASIC'],
      PROTOCOLS['LTE-ADVANCED'],
      PROTOCOLS['IMS-BASIC'],
      PROTOCOLS['IMS-ADVANCED'],
      PROTOCOLS['O-RAN'],
      PROTOCOLS['V2X'],
      PROTOCOLS['NTN'],
      PROTOCOLS['NB-IOT'],
      PROTOCOLS['CUSTOM']
    ],
    allowedFeatures: [
      FEATURES.BASIC_ANALYSIS,
      FEATURES.ADVANCED_ANALYSIS,
      FEATURES.EXPORT,
      FEATURES.API_ACCESS,
      FEATURES.PRIORITY_SUPPORT,
      FEATURES.CUSTOM_TEST_CASES,
      FEATURES.WHITE_LABEL,
      FEATURES.DEDICATED_SUPPORT,
      FEATURES.UNLIMITED_USERS,
      FEATURES.CUSTOM_INTEGRATIONS,
      FEATURES.SLA_GUARANTEE
    ],
    limitations: [],
    maxUsers: 'unlimited',
    trialDays: 14,
    price: 299
  }
};

// Test case access configuration
export const TEST_CASE_ACCESS = {
  [ACCESS_LEVELS.FREE]: [
    '5G-NR-Initial-Access-1',
    'LTE-Attach-Procedure-1',
    'IMS-SIP-Registration-1'
  ],
  [ACCESS_LEVELS.PRO]: 'all',
  [ACCESS_LEVELS.ENTERPRISE]: 'unlimited'
};

/**
 * Check if user has access to a specific feature
 * @param {string} userTier - User's subscription tier
 * @param {string} feature - Feature to check access for
 * @returns {boolean} - Whether user has access
 */
export const hasFeatureAccess = (userTier, feature) => {
  const config = ACCESS_CONFIG[userTier];
  if (!config) return false;
  
  return config.allowedFeatures.includes(feature);
};

/**
 * Check if user has access to a specific protocol
 * @param {string} userTier - User's subscription tier
 * @param {string} protocol - Protocol to check access for
 * @returns {boolean} - Whether user has access
 */
export const hasProtocolAccess = (userTier, protocol) => {
  const config = ACCESS_CONFIG[userTier];
  if (!config) return false;
  
  return config.allowedProtocols.includes(protocol);
};

/**
 * Check if user has access to a specific test case
 * @param {string} userTier - User's subscription tier
 * @param {string} testCaseId - Test case ID to check access for
 * @returns {boolean} - Whether user has access
 */
export const hasTestCaseAccess = (userTier, testCaseId) => {
  const access = TEST_CASE_ACCESS[userTier];
  
  if (access === 'all' || access === 'unlimited') {
    return true;
  }
  
  if (Array.isArray(access)) {
    return access.includes(testCaseId);
  }
  
  return false;
};

/**
 * Get user's test case limit
 * @param {string} userTier - User's subscription tier
 * @returns {number|string} - Test case limit
 */
export const getTestCaseLimit = (userTier) => {
  const config = ACCESS_CONFIG[userTier];
  return config ? config.maxTestCases : 0;
};

/**
 * Get user's user limit
 * @param {string} userTier - User's subscription tier
 * @returns {number|string} - User limit
 */
export const getUserLimit = (userTier) => {
  const config = ACCESS_CONFIG[userTier];
  return config ? config.maxUsers : 1;
};

/**
 * Check if user has reached their test case limit
 * @param {string} userTier - User's subscription tier
 * @param {number} currentUsage - Current test case usage
 * @returns {boolean} - Whether user has reached limit
 */
export const hasReachedTestCaseLimit = (userTier, currentUsage) => {
  const limit = getTestCaseLimit(userTier);
  
  if (limit === 'unlimited') {
    return false;
  }
  
  return currentUsage >= limit;
};

/**
 * Check if user has reached their user limit
 * @param {string} userTier - User's subscription tier
 * @param {number} currentUsers - Current number of users
 * @returns {boolean} - Whether user has reached limit
 */
export const hasReachedUserLimit = (userTier, currentUsers) => {
  const limit = getUserLimit(userTier);
  
  if (limit === 'unlimited') {
    return false;
  }
  
  return currentUsers >= limit;
};

/**
 * Get required tier for a specific feature
 * @param {string} feature - Feature to check
 * @returns {string} - Required tier
 */
export const getRequiredTierForFeature = (feature) => {
  for (const [tier, config] of Object.entries(ACCESS_CONFIG)) {
    if (config.allowedFeatures.includes(feature)) {
      return tier;
    }
  }
  return ACCESS_LEVELS.ENTERPRISE; // Default to highest tier
};

/**
 * Get required tier for a specific protocol
 * @param {string} protocol - Protocol to check
 * @returns {string} - Required tier
 */
export const getRequiredTierForProtocol = (protocol) => {
  for (const [tier, config] of Object.entries(ACCESS_CONFIG)) {
    if (config.allowedProtocols.includes(protocol)) {
      return tier;
    }
  }
  return ACCESS_LEVELS.ENTERPRISE; // Default to highest tier
};

/**
 * Get user's access configuration
 * @param {string} userTier - User's subscription tier
 * @returns {object} - Access configuration
 */
export const getUserAccessConfig = (userTier) => {
  return ACCESS_CONFIG[userTier] || ACCESS_CONFIG[ACCESS_LEVELS.FREE];
};

/**
 * Check if user is in trial period
 * @param {string} userTier - User's subscription tier
 * @param {Date} trialStartDate - Trial start date
 * @returns {boolean} - Whether user is in trial
 */
export const isInTrialPeriod = (userTier, trialStartDate) => {
  const config = ACCESS_CONFIG[userTier];
  if (!config || !trialStartDate) return false;
  
  const trialEndDate = new Date(trialStartDate);
  trialEndDate.setDate(trialEndDate.getDate() + config.trialDays);
  
  return new Date() < trialEndDate;
};

/**
 * Get trial end date
 * @param {string} userTier - User's subscription tier
 * @param {Date} trialStartDate - Trial start date
 * @returns {Date} - Trial end date
 */
export const getTrialEndDate = (userTier, trialStartDate) => {
  const config = ACCESS_CONFIG[userTier];
  if (!config || !trialStartDate) return null;
  
  const trialEndDate = new Date(trialStartDate);
  trialEndDate.setDate(trialEndDate.getDate() + config.trialDays);
  
  return trialEndDate;
};

/**
 * Get days remaining in trial
 * @param {string} userTier - User's subscription tier
 * @param {Date} trialStartDate - Trial start date
 * @returns {number} - Days remaining
 */
export const getTrialDaysRemaining = (userTier, trialStartDate) => {
  const trialEndDate = getTrialEndDate(userTier, trialStartDate);
  if (!trialEndDate) return 0;
  
  const now = new Date();
  const diffTime = trialEndDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
};

/**
 * Check if user needs to upgrade for a specific action
 * @param {string} userTier - User's subscription tier
 * @param {string} action - Action to check (feature, protocol, testCase)
 * @param {string} target - Target of the action
 * @returns {object} - Upgrade information
 */
export const needsUpgrade = (userTier, action, target) => {
  let requiredTier = ACCESS_LEVELS.FREE;
  
  switch (action) {
    case 'feature':
      requiredTier = getRequiredTierForFeature(target);
      break;
    case 'protocol':
      requiredTier = getRequiredTierForProtocol(target);
      break;
    case 'testCase':
      // Check if test case is in free tier
      if (TEST_CASE_ACCESS[ACCESS_LEVELS.FREE].includes(target)) {
        requiredTier = ACCESS_LEVELS.FREE;
      } else {
        requiredTier = ACCESS_LEVELS.PRO;
      }
      break;
    default:
      requiredTier = ACCESS_LEVELS.PRO;
  }
  
  const tierHierarchy = {
    [ACCESS_LEVELS.FREE]: 0,
    [ACCESS_LEVELS.PRO]: 1,
    [ACCESS_LEVELS.ENTERPRISE]: 2
  };
  
  const hasAccess = tierHierarchy[userTier] >= tierHierarchy[requiredTier];
  
  return {
    needsUpgrade: !hasAccess,
    requiredTier,
    currentTier: userTier
  };
};

export default {
  ACCESS_LEVELS,
  FEATURES,
  PROTOCOLS,
  ACCESS_CONFIG,
  TEST_CASE_ACCESS,
  hasFeatureAccess,
  hasProtocolAccess,
  hasTestCaseAccess,
  getTestCaseLimit,
  getUserLimit,
  hasReachedTestCaseLimit,
  hasReachedUserLimit,
  getRequiredTierForFeature,
  getRequiredTierForProtocol,
  getUserAccessConfig,
  isInTrialPeriod,
  getTrialEndDate,
  getTrialDaysRemaining,
  needsUpgrade
};
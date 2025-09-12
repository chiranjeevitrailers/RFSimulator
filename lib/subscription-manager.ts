// Subscription management for 5GLabX Platform
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  limitations: {
    testCasesPerMonth?: number;
    concurrentSessions?: number;
    apiCallsPerMonth?: number;
    supportLevel: 'community' | 'priority' | 'premium';
  };
  status: 'active' | 'trial' | 'expired' | 'cancelled';
  trialEndsAt?: Date;
  currentPeriodEnd?: Date;
}

export interface UserSubscription {
  userId: string;
  plan: SubscriptionPlan;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  usage: {
    testCasesThisMonth: number;
    apiCallsThisMonth: number;
    currentSessions: number;
  };
}

class SubscriptionManager {
  private static instance: SubscriptionManager;
  private subscriptions: Map<string, UserSubscription> = new Map();

  static getInstance(): SubscriptionManager {
    if (!SubscriptionManager.instance) {
      SubscriptionManager.instance = new SubscriptionManager();
    }
    return SubscriptionManager.instance;
  }

  // Check if user has access to platform
  hasPlatformAccess(userId: string): boolean {
    const subscription = this.subscriptions.get(userId);
    if (!subscription) return false;
    
    return subscription.isActive && 
           subscription.plan.status === 'active' || 
           subscription.plan.status === 'trial';
  }

  // Check if user can perform specific action
  canPerformAction(userId: string, action: 'testCase' | 'apiCall' | 'session'): boolean {
    const subscription = this.subscriptions.get(userId);
    if (!subscription || !subscription.isActive) return false;

    const { plan, usage } = subscription;
    const { limitations } = plan;

    switch (action) {
      case 'testCase':
        return !limitations.testCasesPerMonth || 
               usage.testCasesThisMonth < limitations.testCasesPerMonth;
      
      case 'apiCall':
        return !limitations.apiCallsPerMonth || 
               usage.apiCallsThisMonth < limitations.apiCallsPerMonth;
      
      case 'session':
        return !limitations.concurrentSessions || 
               usage.currentSessions < limitations.concurrentSessions;
      
      default:
        return false;
    }
  }

  // Get user's subscription details
  getUserSubscription(userId: string): UserSubscription | null {
    return this.subscriptions.get(userId) || null;
  }

  // Create a new subscription (for demo purposes)
  createSubscription(userId: string, planId: string): UserSubscription {
    const plan = this.getPlanById(planId);
    if (!plan) {
      throw new Error(`Plan ${planId} not found`);
    }

    const now = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // 1 month from now

    const subscription: UserSubscription = {
      userId,
      plan,
      startDate: now,
      endDate,
      isActive: true,
      usage: {
        testCasesThisMonth: 0,
        apiCallsThisMonth: 0,
        currentSessions: 0
      }
    };

    this.subscriptions.set(userId, subscription);
    return subscription;
  }

  // Start a trial subscription
  startTrial(userId: string, planId: string): UserSubscription {
    const plan = this.getPlanById(planId);
    if (!plan) {
      throw new Error(`Plan ${planId} not found`);
    }

    const now = new Date();
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14); // 14-day trial

    // Create trial plan with very limited access
    const trialPlan: SubscriptionPlan = {
      id: 'trial',
      name: 'Free Trial',
      price: 0,
      billingCycle: 'monthly',
      features: [
        'Access to 5GLabX Platform',
        'Basic Protocol Analysis',
        'Limited Test Cases (3 only)',
        '14-day trial period',
        'Community Support'
      ],
      limitations: {
        testCasesPerMonth: 3, // Only 3 test cases for trial
        concurrentSessions: 1, // Only 1 session at a time
        apiCallsPerMonth: 10, // Very limited API calls
        supportLevel: 'community'
      },
      status: 'trial',
      trialEndsAt
    };

    const subscription: UserSubscription = {
      userId,
      plan: trialPlan,
      startDate: now,
      endDate: trialEndsAt,
      isActive: true,
      usage: {
        testCasesThisMonth: 0,
        apiCallsThisMonth: 0,
        currentSessions: 0
      }
    };

    this.subscriptions.set(userId, subscription);
    return subscription;
  }

  // Update usage
  updateUsage(userId: string, action: 'testCase' | 'apiCall' | 'session', increment: number = 1): void {
    const subscription = this.subscriptions.get(userId);
    if (!subscription) return;

    switch (action) {
      case 'testCase':
        subscription.usage.testCasesThisMonth += increment;
        break;
      case 'apiCall':
        subscription.usage.apiCallsThisMonth += increment;
        break;
      case 'session':
        subscription.usage.currentSessions += increment;
        break;
    }

    this.subscriptions.set(userId, subscription);
  }

  // Get available plans
  getAvailablePlans(): SubscriptionPlan[] {
    return [
      {
        id: 'starter',
        name: 'Starter',
        price: 29,
        billingCycle: 'monthly',
        features: [
          'Access to 5GLabX Platform',
          'Basic Protocol Analysis',
          'O-RAN Network Monitoring',
          'NB-IoT Testing Tools',
          'V2X Communication Analysis',
          'NTN Satellite Monitoring',
          'Standard Support',
          '5 Concurrent Sessions'
        ],
        limitations: {
          testCasesPerMonth: 100,
          concurrentSessions: 5,
          apiCallsPerMonth: 1000,
          supportLevel: 'community'
        },
        status: 'active'
      },
      {
        id: 'professional',
        name: 'Professional',
        price: 99,
        billingCycle: 'monthly',
        features: [
          'Everything in Starter',
          'Advanced Protocol Analysis',
          'Real-time Network Monitoring',
          'Custom Test Case Creation',
          'Advanced Analytics & Reporting',
          'API Access',
          'Priority Support',
          '25 Concurrent Sessions',
          'Data Export (CSV, JSON)',
          'Custom Integrations'
        ],
        limitations: {
          testCasesPerMonth: 1000,
          concurrentSessions: 25,
          apiCallsPerMonth: 10000,
          supportLevel: 'priority'
        },
        status: 'active'
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 299,
        billingCycle: 'monthly',
        features: [
          'Everything in Professional',
          'Unlimited Test Cases',
          'Advanced Security Features',
          'Custom Deployment Options',
          'Dedicated Account Manager',
          '24/7 Premium Support',
          'Unlimited Concurrent Sessions',
          'White-label Options',
          'Custom Training & Onboarding',
          'SLA Guarantee (99.9%)',
          'Advanced Compliance Tools'
        ],
        limitations: {
          supportLevel: 'premium'
        },
        status: 'active'
      }
    ];
  }

  private getPlanById(planId: string): SubscriptionPlan | null {
    const plans = this.getAvailablePlans();
    return plans.find(plan => plan.id === planId) || null;
  }

  // Check subscription status
  checkSubscriptionStatus(userId: string): {
    hasAccess: boolean;
    isTrial: boolean;
    daysRemaining?: number;
    usage: any;
    limitations: any;
  } {
    const subscription = this.subscriptions.get(userId);
    if (!subscription) {
      return {
        hasAccess: false,
        isTrial: false,
        usage: null,
        limitations: null
      };
    }

    const isTrial = subscription.plan.status === 'trial';
    const hasAccess = subscription.isActive && 
                     (subscription.plan.status === 'active' || subscription.plan.status === 'trial');

    let daysRemaining: number | undefined;
    if (isTrial && subscription.plan.trialEndsAt) {
      const now = new Date();
      const diffTime = subscription.plan.trialEndsAt.getTime() - now.getTime();
      daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    return {
      hasAccess,
      isTrial,
      daysRemaining,
      usage: subscription.usage,
      limitations: subscription.plan.limitations
    };
  }
}

export const subscriptionManager = SubscriptionManager.getInstance();
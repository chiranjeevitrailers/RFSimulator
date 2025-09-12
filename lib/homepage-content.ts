// Homepage content management system
export interface HomepageContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    primaryButton: {
      text: string;
      link: string;
    };
    secondaryButton: {
      text: string;
      link: string;
    };
    backgroundImage?: string;
  };
  features: {
    title: string;
    subtitle: string;
    features: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
  };
  equipment: {
    title: string;
    subtitle: string;
    description: string;
  };
  service: {
    title: string;
    subtitle: string;
    description: string;
    pricing: {
      starter: {
        price: string;
        features: string[];
      };
      professional: {
        price: string;
        features: string[];
      };
      enterprise: {
        price: string;
        features: string[];
      };
    };
  };
  testimonials: {
    title: string;
    subtitle: string;
    testimonials: Array<{
      name: string;
      role: string;
      company: string;
      content: string;
      avatar?: string;
    }>;
  };
  cta: {
    title: string;
    description: string;
    primaryButton: {
      text: string;
      link: string;
    };
    secondaryButton: {
      text: string;
      link: string;
    };
  };
}

// Default homepage content
export const DEFAULT_HOMEPAGE_CONTENT: HomepageContent = {
  hero: {
    title: "Advanced 5G Testing & Simulation Platform",
    subtitle: "5GLabX",
    description: "Comprehensive 5G testing, simulation, and equipment management platform for telecommunications professionals, researchers, and developers.",
    primaryButton: {
      text: "Get Started Free",
      link: "/signup"
    },
    secondaryButton: {
      text: "View Demo",
      link: "#demo"
    }
  },
  features: {
    title: "Powerful Features",
    subtitle: "Everything you need for 5G testing and development",
    features: [
      {
        icon: "Zap",
        title: "Real-Time Testing",
        description: "Live 5G network testing with instant results and comprehensive analytics."
      },
      {
        icon: "Shield",
        title: "Enterprise Security",
        description: "Bank-grade security with encrypted data transmission and secure access controls."
      },
      {
        icon: "BarChart3",
        title: "Advanced Analytics",
        description: "Detailed insights, performance metrics, and comprehensive reporting tools."
      },
      {
        icon: "Users",
        title: "Team Collaboration",
        description: "Multi-user support with role-based access and real-time collaboration features."
      }
    ]
  },
  equipment: {
    title: "Equipment Management",
    subtitle: "Comprehensive 5G equipment inventory and management system",
    description: "Track, manage, and optimize your 5G testing equipment with our advanced inventory management system."
  },
  service: {
    title: "5GLAB as a Service",
    subtitle: "Professional 5G Testing as a Service",
    description: "Access enterprise-grade 5G testing infrastructure, simulation tools, and expert support through our cloud-based platform.",
    pricing: {
      starter: {
        price: "$99/month",
        features: [
          "Up to 10 test cases",
          "Basic 5G simulation",
          "Standard support",
          "1 concurrent user",
          "Basic analytics",
          "Email support"
        ]
      },
      professional: {
        price: "$299/month",
        features: [
          "Up to 100 test cases",
          "Advanced 5G simulation",
          "Priority support",
          "5 concurrent users",
          "Advanced analytics",
          "API access",
          "Phone support",
          "Custom integrations"
        ]
      },
      enterprise: {
        price: "Custom",
        features: [
          "Unlimited test cases",
          "Full 5G simulation suite",
          "Dedicated support",
          "Unlimited users",
          "Custom analytics",
          "Full API access",
          "24/7 phone support",
          "Custom integrations",
          "On-premise deployment",
          "SLA guarantee"
        ]
      }
    }
  },
  testimonials: {
    title: "What Our Customers Say",
    subtitle: "Trusted by 5G professionals worldwide",
    testimonials: [
      {
        name: "Dr. Sarah Chen",
        role: "Lead 5G Engineer",
        company: "TechCorp",
        content: "5GLabX has revolutionized our 5G testing process. The platform is intuitive, powerful, and has significantly reduced our testing time."
      },
      {
        name: "Michael Rodriguez",
        role: "Network Architect",
        company: "Telecom Solutions",
        content: "The equipment management system is outstanding. We can now track all our 5G equipment in one place with real-time status updates."
      },
      {
        name: "Dr. Emily Watson",
        role: "Research Director",
        company: "University Research Lab",
        content: "5GLabX as a Service has enabled us to conduct advanced 5G research without the need for expensive infrastructure investments."
      }
    ]
  },
  cta: {
    title: "Ready to Transform Your 5G Testing?",
    description: "Join thousands of professionals who trust 5GLabX for their 5G testing and development needs.",
    primaryButton: {
      text: "Start Free Trial",
      link: "/signup"
    },
    secondaryButton: {
      text: "Contact Sales",
      link: "/contact"
    }
  }
};

// Function to save homepage content (mock implementation)
export function saveHomepageContent(content: HomepageContent): Promise<{ success: boolean; message: string }> {
  return new Promise((resolve) => {
    // In a real application, this would save to a database
    // For now, we'll simulate a successful save
    setTimeout(() => {
      console.log('Homepage content saved:', content);
      resolve({
        success: true,
        message: 'Homepage content updated successfully!'
      });
    }, 1000);
  });
}

// Function to load homepage content (mock implementation)
export function loadHomepageContent(): Promise<HomepageContent> {
  return new Promise((resolve) => {
    // In a real application, this would load from a database
    // For now, we'll return the default content
    setTimeout(() => {
      resolve(DEFAULT_HOMEPAGE_CONTENT);
    }, 500);
  });
}
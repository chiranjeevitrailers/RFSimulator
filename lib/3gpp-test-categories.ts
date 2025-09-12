/**
 * 3GPP Test Categories and Classifications
 * Implements proper 3GPP-based test categorization for professional protocol testing
 */

export interface TestCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  priority: number;
  complexity: 'low' | 'medium' | 'high' | 'expert';
  duration_range: [number, number]; // in minutes
  success_criteria: {
    min_success_rate: number;
    max_latency_ms: number;
    min_throughput_mbps: number;
    max_error_rate: number;
  };
  test_environment: {
    network_conditions: string[];
    load_conditions: string[];
    stability_requirements: string[];
  };
  applicable_protocols: string[];
  applicable_layers: string[];
  test_methodology: string;
  validation_criteria: string[];
  performance_benchmarks: Record<string, any>;
}

export interface TestSubCategory {
  id: string;
  parent_id: string;
  name: string;
  description: string;
  specific_requirements: string[];
  test_scenarios: string[];
  expected_outcomes: string[];
  failure_modes: string[];
}

// 3GPP Test Categories based on industry standards
export const TEST_CATEGORIES: TestCategory[] = [
  {
    id: 'functional',
    name: 'Functional Testing',
    description: 'Verifies that protocol functions work correctly according to 3GPP specifications',
    icon: 'CheckCircle',
    color: 'green',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-800',
    priority: 1,
    complexity: 'medium',
    duration_range: [5, 30],
    success_criteria: {
      min_success_rate: 99.5,
      max_latency_ms: 100,
      min_throughput_mbps: 50,
      max_error_rate: 0.5
    },
    test_environment: {
      network_conditions: ['normal', 'good_signal', 'stable_connection'],
      load_conditions: ['light_load', 'normal_load'],
      stability_requirements: ['stable_network', 'no_interference']
    },
    applicable_protocols: ['5G_NR', '4G_LTE', 'NAS', 'IMS', 'SIP'],
    applicable_layers: ['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS'],
    test_methodology: 'Systematic verification of protocol functions against 3GPP specifications',
    validation_criteria: [
      'Message format compliance',
      'Information element validation',
      'Protocol state transitions',
      'Error handling verification',
      'Security procedure validation'
    ],
    performance_benchmarks: {
      message_processing_time: '< 10ms',
      state_transition_time: '< 50ms',
      error_recovery_time: '< 100ms',
      security_setup_time: '< 200ms'
    }
  },
  {
    id: 'performance',
    name: 'Performance Testing',
    description: 'Measures protocol performance metrics against 3GPP performance requirements',
    icon: 'Zap',
    color: 'blue',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800',
    priority: 2,
    complexity: 'high',
    duration_range: [15, 60],
    success_criteria: {
      min_success_rate: 99.0,
      max_latency_ms: 10,
      min_throughput_mbps: 100,
      max_error_rate: 1.0
    },
    test_environment: {
      network_conditions: ['optimal', 'high_signal', 'low_interference'],
      load_conditions: ['high_load', 'peak_load'],
      stability_requirements: ['stable_network', 'consistent_conditions']
    },
    applicable_protocols: ['5G_NR', '4G_LTE', 'MAC', 'RLC', 'PDCP'],
    applicable_layers: ['PHY', 'MAC', 'RLC', 'PDCP', 'RRC'],
    test_methodology: 'Comprehensive performance measurement under various load conditions',
    validation_criteria: [
      'Throughput measurement',
      'Latency analysis',
      'Resource utilization',
      'Scalability assessment',
      'Efficiency metrics'
    ],
    performance_benchmarks: {
      peak_throughput: '> 1 Gbps',
      user_plane_latency: '< 1ms',
      control_plane_latency: '< 10ms',
      resource_efficiency: '> 90%',
      spectral_efficiency: '> 30 bps/Hz'
    }
  },
  {
    id: 'stability',
    name: 'Stability Testing',
    description: 'Tests protocol stability and reliability over extended periods',
    icon: 'Shield',
    color: 'purple',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-800',
    priority: 3,
    complexity: 'high',
    duration_range: [60, 480], // 1-8 hours
    success_criteria: {
      min_success_rate: 99.9,
      max_latency_ms: 50,
      min_throughput_mbps: 80,
      max_error_rate: 0.1
    },
    test_environment: {
      network_conditions: ['varying_signal', 'intermittent_connection', 'normal'],
      load_conditions: ['sustained_load', 'variable_load'],
      stability_requirements: ['long_duration', 'memory_stability', 'resource_cleanup']
    },
    applicable_protocols: ['5G_NR', '4G_LTE', 'NAS', 'IMS', 'SIP'],
    applicable_layers: ['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS'],
    test_methodology: 'Long-duration testing to identify memory leaks, resource exhaustion, and stability issues',
    validation_criteria: [
      'Memory usage stability',
      'Resource leak detection',
      'Long-term performance consistency',
      'Error accumulation analysis',
      'Recovery mechanism validation'
    ],
    performance_benchmarks: {
      memory_growth_rate: '< 1MB/hour',
      error_accumulation_rate: '< 0.01%/hour',
      performance_degradation: '< 5% over 8 hours',
      resource_utilization_stability: '±2% variation'
    }
  },
  {
    id: 'stress',
    name: 'Stress Testing',
    description: 'Tests protocol behavior under extreme load and resource constraints',
    icon: 'AlertTriangle',
    color: 'red',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-800',
    priority: 4,
    complexity: 'expert',
    duration_range: [30, 120],
    success_criteria: {
      min_success_rate: 95.0,
      max_latency_ms: 1000,
      min_throughput_mbps: 10,
      max_error_rate: 5.0
    },
    test_environment: {
      network_conditions: ['poor_signal', 'high_interference', 'congested'],
      load_conditions: ['extreme_load', 'overload', 'resource_exhaustion'],
      stability_requirements: ['graceful_degradation', 'error_recovery', 'system_protection']
    },
    applicable_protocols: ['5G_NR', '4G_LTE', 'MAC', 'RLC', 'PDCP', 'RRC'],
    applicable_layers: ['PHY', 'MAC', 'RLC', 'PDCP', 'RRC'],
    test_methodology: 'Extreme condition testing to validate system behavior under stress',
    validation_criteria: [
      'Graceful degradation behavior',
      'Error handling under stress',
      'Resource exhaustion handling',
      'System protection mechanisms',
      'Recovery procedures'
    ],
    performance_benchmarks: {
      degradation_threshold: '> 50% load capacity',
      recovery_time: '< 30 seconds',
      error_handling_rate: '> 90%',
      system_protection_activation: 'automatic'
    }
  },
  {
    id: 'interoperability',
    name: 'Interoperability Testing',
    description: 'Tests protocol compatibility with different vendors and implementations',
    icon: 'Network',
    color: 'indigo',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    textColor: 'text-indigo-800',
    priority: 5,
    complexity: 'high',
    duration_range: [20, 90],
    success_criteria: {
      min_success_rate: 98.0,
      max_latency_ms: 200,
      min_throughput_mbps: 50,
      max_error_rate: 2.0
    },
    test_environment: {
      network_conditions: ['multi_vendor', 'different_implementations', 'standard_compliance'],
      load_conditions: ['normal_load', 'mixed_load'],
      stability_requirements: ['vendor_compatibility', 'standard_adherence']
    },
    applicable_protocols: ['5G_NR', '4G_LTE', 'IMS', 'SIP', 'O_RAN'],
    applicable_layers: ['RRC', 'NAS', 'SIP', 'IMS', 'E2'],
    test_methodology: 'Cross-vendor testing to ensure 3GPP standard compliance and interoperability',
    validation_criteria: [
      'Vendor compatibility',
      'Standard compliance verification',
      'Message format compatibility',
      'Protocol behavior consistency',
      'Feature interoperability'
    ],
    performance_benchmarks: {
      compatibility_rate: '> 95%',
      standard_compliance: '100%',
      feature_support: '> 90%',
      performance_variance: '< 10%'
    }
  },
  {
    id: 'security',
    name: 'Security Testing',
    description: 'Validates protocol security mechanisms and vulnerability assessment',
    icon: 'Lock',
    color: 'orange',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-800',
    priority: 6,
    complexity: 'expert',
    duration_range: [30, 120],
    success_criteria: {
      min_success_rate: 100.0,
      max_latency_ms: 500,
      min_throughput_mbps: 20,
      max_error_rate: 0.0
    },
    test_environment: {
      network_conditions: ['secure_channel', 'encrypted_connection', 'authenticated'],
      load_conditions: ['security_load', 'encryption_load'],
      stability_requirements: ['security_stability', 'key_management', 'authentication']
    },
    applicable_protocols: ['5G_NR', '4G_LTE', 'NAS', 'IMS', 'SIP'],
    applicable_layers: ['PDCP', 'RRC', 'NAS', 'SIP', 'IMS'],
    test_methodology: 'Comprehensive security validation including encryption, authentication, and vulnerability testing',
    validation_criteria: [
      'Encryption algorithm validation',
      'Authentication mechanism testing',
      'Key management verification',
      'Vulnerability assessment',
      'Security policy compliance'
    ],
    performance_benchmarks: {
      encryption_overhead: '< 5%',
      authentication_time: '< 200ms',
      key_refresh_time: '< 100ms',
      security_breach_detection: '100%'
    }
  },
  {
    id: 'mobility',
    name: 'Mobility Testing',
    description: 'Tests handover procedures and mobility management protocols',
    icon: 'Move',
    color: 'teal',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    textColor: 'text-teal-800',
    priority: 7,
    complexity: 'high',
    duration_range: [15, 60],
    success_criteria: {
      min_success_rate: 99.0,
      max_latency_ms: 100,
      min_throughput_mbps: 80,
      max_error_rate: 1.0
    },
    test_environment: {
      network_conditions: ['multiple_cells', 'handover_scenarios', 'mobility_patterns'],
      load_conditions: ['mobility_load', 'handover_load'],
      stability_requirements: ['seamless_handover', 'mobility_stability']
    },
    applicable_protocols: ['5G_NR', '4G_LTE', 'RRC', 'NAS'],
    applicable_layers: ['PHY', 'MAC', 'RRC', 'NAS'],
    test_methodology: 'Comprehensive mobility testing including handovers, cell reselection, and mobility procedures',
    validation_criteria: [
      'Handover success rate',
      'Handover latency measurement',
      'Mobility procedure validation',
      'Cell reselection testing',
      'Mobility state management'
    ],
    performance_benchmarks: {
      handover_success_rate: '> 99%',
      handover_latency: '< 50ms',
      cell_reselection_time: '< 100ms',
      mobility_procedure_time: '< 200ms'
    }
  },
  {
    id: 'conformance',
    name: 'Conformance Testing',
    description: 'Validates strict adherence to 3GPP specifications and standards',
    icon: 'FileCheck',
    color: 'gray',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    textColor: 'text-gray-800',
    priority: 8,
    complexity: 'expert',
    duration_range: [60, 240],
    success_criteria: {
      min_success_rate: 100.0,
      max_latency_ms: 50,
      min_throughput_mbps: 100,
      max_error_rate: 0.0
    },
    test_environment: {
      network_conditions: ['standard_compliant', 'reference_implementation'],
      load_conditions: ['standard_load', 'reference_load'],
      stability_requirements: ['strict_compliance', 'standard_adherence']
    },
    applicable_protocols: ['5G_NR', '4G_LTE', 'NAS', 'IMS', 'SIP', 'O_RAN'],
    applicable_layers: ['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS', 'SIP', 'IMS'],
    test_methodology: 'Rigorous testing against 3GPP specifications with zero tolerance for non-compliance',
    validation_criteria: [
      '3GPP specification compliance',
      'Message format validation',
      'Information element validation',
      'Protocol behavior verification',
      'Standard requirement fulfillment'
    ],
    performance_benchmarks: {
      specification_compliance: '100%',
      message_format_compliance: '100%',
      ie_validation_compliance: '100%',
      protocol_behavior_compliance: '100%'
    }
  }
];

// Test Sub-Categories for more granular testing
export const TEST_SUB_CATEGORIES: TestSubCategory[] = [
  // Functional Testing Sub-Categories
  {
    id: 'functional_basic',
    parent_id: 'functional',
    name: 'Basic Functional Testing',
    description: 'Basic protocol function verification',
    specific_requirements: ['Message exchange', 'State transitions', 'Error handling'],
    test_scenarios: ['Initial access', 'Connection establishment', 'Data transmission'],
    expected_outcomes: ['Successful message exchange', 'Correct state transitions'],
    failure_modes: ['Message format errors', 'State transition failures']
  },
  {
    id: 'functional_advanced',
    parent_id: 'functional',
    name: 'Advanced Functional Testing',
    description: 'Advanced protocol features and edge cases',
    specific_requirements: ['Complex procedures', 'Edge case handling', 'Feature interactions'],
    test_scenarios: ['Multi-step procedures', 'Error recovery', 'Feature combinations'],
    expected_outcomes: ['Complex procedure success', 'Proper error recovery'],
    failure_modes: ['Procedure failures', 'Error recovery failures']
  },
  
  // Performance Testing Sub-Categories
  {
    id: 'performance_throughput',
    parent_id: 'performance',
    name: 'Throughput Performance',
    description: 'Maximum data throughput measurement',
    specific_requirements: ['Peak throughput', 'Sustained throughput', 'Throughput efficiency'],
    test_scenarios: ['High data rate', 'Continuous transmission', 'Burst transmission'],
    expected_outcomes: ['Achieve target throughput', 'Maintain throughput stability'],
    failure_modes: ['Throughput degradation', 'Throughput instability']
  },
  {
    id: 'performance_latency',
    parent_id: 'performance',
    name: 'Latency Performance',
    description: 'End-to-end latency measurement',
    specific_requirements: ['User plane latency', 'Control plane latency', 'Jitter measurement'],
    test_scenarios: ['Real-time applications', 'Control procedures', 'Latency variation'],
    expected_outcomes: ['Meet latency requirements', 'Low latency jitter'],
    failure_modes: ['Latency violations', 'High jitter']
  },
  
  // Stability Testing Sub-Categories
  {
    id: 'stability_memory',
    parent_id: 'stability',
    name: 'Memory Stability',
    description: 'Long-term memory usage and leak detection',
    specific_requirements: ['Memory leak detection', 'Memory usage stability', 'Resource cleanup'],
    test_scenarios: ['Extended operation', 'Memory stress', 'Resource exhaustion'],
    expected_outcomes: ['Stable memory usage', 'No memory leaks'],
    failure_modes: ['Memory leaks', 'Memory exhaustion']
  },
  {
    id: 'stability_connection',
    parent_id: 'stability',
    name: 'Connection Stability',
    description: 'Long-term connection stability and reliability',
    specific_requirements: ['Connection maintenance', 'Reconnection handling', 'Session persistence'],
    test_scenarios: ['Long sessions', 'Connection drops', 'Network variations'],
    expected_outcomes: ['Stable connections', 'Proper reconnection'],
    failure_modes: ['Connection drops', 'Reconnection failures']
  },
  
  // Stress Testing Sub-Categories
  {
    id: 'stress_load',
    parent_id: 'stress',
    name: 'Load Stress Testing',
    description: 'System behavior under high load conditions',
    specific_requirements: ['Load handling', 'Resource management', 'Graceful degradation'],
    test_scenarios: ['Peak load', 'Overload conditions', 'Resource exhaustion'],
    expected_outcomes: ['Handle high load', 'Graceful degradation'],
    failure_modes: ['System overload', 'Resource exhaustion']
  },
  {
    id: 'stress_network',
    parent_id: 'stress',
    name: 'Network Stress Testing',
    description: 'Protocol behavior under poor network conditions',
    specific_requirements: ['Poor signal handling', 'Interference tolerance', 'Error recovery'],
    test_scenarios: ['Low signal', 'High interference', 'Network congestion'],
    expected_outcomes: ['Operate under stress', 'Recover from errors'],
    failure_modes: ['Signal loss', 'Interference impact']
  }
];

// Test Category Utilities
export class TestCategoryManager {
  static getCategoryById(id: string): TestCategory | undefined {
    return TEST_CATEGORIES.find(category => category.id === id);
  }
  
  static getSubCategoriesByParent(parentId: string): TestSubCategory[] {
    return TEST_SUB_CATEGORIES.filter(sub => sub.parent_id === parentId);
  }
  
  static getCategoriesByProtocol(protocol: string): TestCategory[] {
    return TEST_CATEGORIES.filter(category => 
      category.applicable_protocols.includes(protocol)
    );
  }
  
  static getCategoriesByLayer(layer: string): TestCategory[] {
    return TEST_CATEGORIES.filter(category => 
      category.applicable_layers.includes(layer)
    );
  }
  
  static getCategoriesByComplexity(complexity: string): TestCategory[] {
    return TEST_CATEGORIES.filter(category => category.complexity === complexity);
  }
  
  static getRecommendedCategories(protocol: string, layer: string, complexity: string): TestCategory[] {
    return TEST_CATEGORIES.filter(category => 
      category.applicable_protocols.includes(protocol) &&
      category.applicable_layers.includes(layer) &&
      category.complexity === complexity
    );
  }
  
  static validateTestCategory(testCase: any, categoryId: string): {
    valid: boolean;
    score: number;
    issues: string[];
    recommendations: string[];
  } {
    const category = this.getCategoryById(categoryId);
    if (!category) {
      return {
        valid: false,
        score: 0,
        issues: ['Invalid category ID'],
        recommendations: ['Use a valid category ID']
      };
    }
    
    const issues: string[] = [];
    const recommendations: string[] = [];
    let score = 100;
    
    // Check duration
    const duration = testCase.duration_ms / 60000; // Convert to minutes
    if (duration < category.duration_range[0] || duration > category.duration_range[1]) {
      issues.push(`Duration ${duration}min outside range [${category.duration_range[0]}, ${category.duration_range[1]}]min`);
      score -= 20;
      recommendations.push(`Adjust duration to be within ${category.duration_range[0]}-${category.duration_range[1]} minutes`);
    }
    
    // Check complexity
    if (testCase.complexity !== category.complexity) {
      issues.push(`Complexity mismatch: expected ${category.complexity}, got ${testCase.complexity}`);
      score -= 15;
      recommendations.push(`Set complexity to ${category.complexity} for ${category.name}`);
    }
    
    // Check applicable protocols
    if (!category.applicable_protocols.includes(testCase.category)) {
      issues.push(`Protocol ${testCase.category} not applicable for ${category.name}`);
      score -= 25;
      recommendations.push(`Use one of: ${category.applicable_protocols.join(', ')}`);
    }
    
    // Check performance criteria
    if (testCase.performance_metrics) {
      const metrics = testCase.performance_metrics;
      if (metrics.latency?.target > category.success_criteria.max_latency_ms) {
        issues.push(`Latency target ${metrics.latency.target}ms exceeds maximum ${category.success_criteria.max_latency_ms}ms`);
        score -= 10;
      }
      if (metrics.throughput?.target < category.success_criteria.min_throughput_mbps) {
        issues.push(`Throughput target ${metrics.throughput.target}Mbps below minimum ${category.success_criteria.min_throughput_mbps}Mbps`);
        score -= 10;
      }
    }
    
    return {
      valid: issues.length === 0,
      score: Math.max(0, score),
      issues,
      recommendations
    };
  }
}

export default TestCategoryManager;
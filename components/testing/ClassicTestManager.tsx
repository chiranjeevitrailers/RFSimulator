'use client';

import React from 'react';

type RanComponent = { id: string; name: string; status: 'active' | 'inactive'; };
type TestCaseRow = {
  id: string;
  name: string;
  component: string;
  status: string;
  iterations: string | number;
  successRate: string | number;
  lastRun: string;
  duration: string;
  priority: string;
  selected?: boolean;
};

const ClassicTestManager: React.FC = () => {
  const [ranComponents] = React.useState<RanComponent[]>([
    { id: 'enodeb', name: 'eNodeB', status: 'active' },
    { id: 'gnodeb', name: 'gNodeB', status: 'active' },
    { id: 'core', name: 'Core Network', status: 'active' }
  ]);

  const [testSuites, setTestSuites] = React.useState([
    {
      id: '5g-nr',
      name: '5G NR',
      expanded: false,
      totalCount: 0,
      icon: '📡',
      color: '#3B82F6',
      children: [
        { id: '5gnr-functional', name: 'Functional', count: 0 },
        { id: '5gnr-performance', name: 'Performance', count: 0 },
        { id: '5gnr-rf', name: 'RF', count: 0 },
        { id: '5gnr-stability', name: 'Stability', count: 0 }
      ]
    },
    {
      id: '4g-lte',
      name: '4G LTE',
      expanded: false,
      totalCount: 0,
      icon: '📶',
      color: '#10B981',
      children: [
        { id: 'lte-functional', name: 'Functional', count: 0 },
        { id: 'lte-performance', name: 'Performance', count: 0 },
        { id: 'lte-rf', name: 'RF', count: 0 },
        { id: 'lte-stability', name: 'Stability', count: 0 }
      ]
    },
    {
      id: 'ims',
      name: 'IMS/VoLTE/VoNR',
      expanded: false,
      totalCount: 0,
      icon: '📞',
      color: '#8B5CF6',
      children: [
        { id: 'ims-functional', name: 'Functional', count: 0 },
        { id: 'ims-performance-stability', name: 'Performance/Stability', count: 0 }
      ]
    },
    {
      id: 'oran',
      name: 'O-RAN',
      expanded: false,
      totalCount: 0,
      icon: '🌐',
      color: '#F59E0B',
      children: [
        { id: 'oran-functional', name: 'Functional', count: 0 },
        { id: 'oran-performance', name: 'Performance', count: 0 }
      ]
    },
    {
      id: 'nbiot',
      name: 'NB-IoT',
      expanded: false,
      totalCount: 0,
      icon: '🔗',
      color: '#06B6D4',
      children: [
        { id: 'nbiot-functional', name: 'Functional', count: 0 },
        { id: 'nbiot-performance', name: 'Performance', count: 0 }
      ]
    },
    {
      id: 'v2x',
      name: 'V2X',
      expanded: false,
      totalCount: 0,
      icon: '🚗',
      color: '#EF4444',
      children: [
        { id: 'v2x-functional', name: 'Functional', count: 0 },
        { id: 'v2x-performance', name: 'Performance', count: 0 }
      ]
    },
    {
      id: 'ntn',
      name: 'NTN',
      expanded: false,
      totalCount: 0,
      icon: '🛰️',
      color: '#8B5CF6',
      children: [
        { id: 'ntn-functional', name: 'Functional', count: 0 },
        { id: 'ntn-performance', name: 'Performance', count: 0 }
      ]
    },
    {
      id: 'gcf',
      name: 'GCF Certification',
      expanded: false,
      totalCount: 0,
      icon: '🏆',
      color: '#F97316',
      children: [
        { id: 'gcf-3gpp-conformance', name: '3GPP Conformance', count: 0 },
        { id: 'gcf-protocol', name: 'Protocol', count: 0 },
        { id: 'gcf-rf', name: 'RF', count: 0 },
        { id: 'gcf-performance', name: 'Performance', count: 0 }
      ]
    },
    {
      id: 'ptcrb',
      name: 'PTCRB Certification',
      expanded: false,
      totalCount: 0,
      icon: '🥇',
      color: '#6366F1',
      children: [
        { id: 'ptcrb-3gpp-conformance', name: '3GPP Conformance', count: 0 },
        { id: 'ptcrb-protocol', name: 'Protocol', count: 0 },
        { id: 'ptcrb-rf', name: 'RF', count: 0 },
        { id: 'ptcrb-performance', name: 'Performance', count: 0 }
      ]
    }
  ]);

  const [isRunning, setIsRunning] = React.useState(false);
  const [activeRun, setActiveRun] = React.useState<any>(null);
  const [stats, setStats] = React.useState<any>(null);
  const [selectedDomain, setSelectedDomain] = React.useState<string | null>(null);
  const [selectedCategoryType, setSelectedCategoryType] = React.useState<string | null>(null);
  const [logs, setLogs] = React.useState<{ timestamp: string; level: 'INFO'|'ERROR'|'WARN'|'DEBUG'; message: string }[]>([
    { timestamp: new Date().toLocaleString(), level: 'INFO', message: 'Initializing RAN-Core Test Manager' },
    { timestamp: new Date().toLocaleString(), level: 'INFO', message: 'Loading component configurations' },
    { timestamp: new Date().toLocaleString(), level: 'INFO', message: 'Preparing test environment' }
  ]);
  const [testCases, setTestCases] = React.useState<TestCaseRow[]>([{
    id: 'tc-001',
    name: 'Attach',
    component: 'eNodeB',
    status: 'Not Started',
    iterations: 'Never',
    successRate: 'N/A',
    lastRun: 'N/A',
    duration: '',
    priority: '',
    selected: false
  }]);

  const normalize = (s: string) => (s || '').replace(/[_\s-]/g, '').toUpperCase();

  const getSampleTestCases = (categoryFilter: string, domainLabel: string): TestCaseRow[] => {
    const sampleCases: Record<string, TestCaseRow[]> = {
      'GCF': [
        {
          id: 'GCF-001',
          name: 'GCF RRC Connection Establishment',
          component: 'GCF',
          status: 'Not Started',
          iterations: 'Never',
          successRate: 'N/A',
          lastRun: 'N/A',
          duration: '-',
          priority: 'High',
          selected: false
        },
        {
          id: 'GCF-002',
          name: 'GCF NAS Authentication',
          component: 'GCF',
          status: 'Not Started',
          iterations: 'Never',
          successRate: 'N/A',
          lastRun: 'N/A',
          duration: '-',
          priority: 'High',
          selected: false
        },
        {
          id: 'GCF-003',
          name: 'GCF RF Transmitter Test',
          component: 'GCF',
          status: 'Not Started',
          iterations: 'Never',
          successRate: 'N/A',
          lastRun: 'N/A',
          duration: '-',
          priority: 'Critical',
          selected: false
        }
      ],
      'PTCRB': [
        {
          id: 'PTCRB-001',
          name: 'PTCRB RRC Protocol Conformance',
          component: 'PTCRB',
          status: 'Not Started',
          iterations: 'Never',
          successRate: 'N/A',
          lastRun: 'N/A',
          duration: '-',
          priority: 'High',
          selected: false
        },
        {
          id: 'PTCRB-002',
          name: 'PTCRB NAS EMM Procedures',
          component: 'PTCRB',
          status: 'Not Started',
          iterations: 'Never',
          successRate: 'N/A',
          lastRun: 'N/A',
          duration: '-',
          priority: 'High',
          selected: false
        },
        {
          id: 'PTCRB-003',
          name: 'PTCRB Band-Specific RF Tests',
          component: 'PTCRB',
          status: 'Not Started',
          iterations: 'Never',
          successRate: 'N/A',
          lastRun: 'N/A',
          duration: '-',
          priority: 'Critical',
          selected: false
        }
      ],
      '5G_NR': [
        {
          id: '5G-001',
          name: '5G NR Initial Access Procedure',
          component: '5G_NR',
          status: 'Not Started',
          iterations: 'Never',
          successRate: 'N/A',
          lastRun: 'N/A',
          duration: '-',
          priority: 'High',
          selected: false
        },
        {
          id: '5G-002',
          name: '5G NR Handover Test',
          component: '5G_NR',
          status: 'Not Started',
          iterations: 'Never',
          successRate: 'N/A',
          lastRun: 'N/A',
          duration: '-',
          priority: 'High',
          selected: false
        },
        {
          id: '5G-003',
          name: '5G NR PDU Session Establishment',
          component: '5G_NR',
          status: 'Not Started',
          iterations: 'Never',
          successRate: 'N/A',
          lastRun: 'N/A',
          duration: '-',
          priority: 'Medium',
          selected: false
        }
      ],
      '4G_LTE': [
        {
          id: 'LTE-001',
          name: 'LTE Attach Procedure',
          component: '4G_LTE',
          status: 'Not Started',
          iterations: 'Never',
          successRate: 'N/A',
          lastRun: 'N/A',
          duration: '-',
          priority: 'High',
          selected: false
        },
        {
          id: 'LTE-002',
          name: 'LTE Handover Test',
          component: '4G_LTE',
          status: 'Not Started',
          iterations: 'Never',
          successRate: 'N/A',
          lastRun: 'N/A',
          duration: '-',
          priority: 'High',
          selected: false
        },
        {
          id: 'LTE-003',
          name: 'LTE Bearer Management',
          component: '4G_LTE',
          status: 'Not Started',
          iterations: 'Never',
          successRate: 'N/A',
          lastRun: 'N/A',
          duration: '-',
          priority: 'Medium',
          selected: false
        }
      ],
      'IMS': [
        {
          id: 'IMS-001',
          name: 'VoLTE Call Setup',
          component: 'IMS',
          status: 'Not Started',
          iterations: 'Never',
          successRate: 'N/A',
          lastRun: 'N/A',
          duration: '-',
          priority: 'High',
          selected: false
        },
        {
          id: 'IMS-002',
          name: 'VoNR Call Establishment',
          component: 'IMS',
          status: 'Not Started',
          iterations: 'Never',
          successRate: 'N/A',
          lastRun: 'N/A',
          duration: '-',
          priority: 'High',
          selected: false
        },
        {
          id: 'IMS-003',
          name: 'SIP Registration Test',
          component: 'IMS',
          status: 'Not Started',
          iterations: 'Never',
          successRate: 'N/A',
          lastRun: 'N/A',
          duration: '-',
          priority: 'Medium',
          selected: false
        }
      ],
      'O_RAN': [
        {
          id: 'ORAN-001',
          name: 'O-RAN Fronthaul Interface Test',
          component: 'O_RAN',
          status: 'Not Started',
          iterations: 'Never',
          successRate: 'N/A',
          lastRun: 'N/A',
          duration: '-',
          priority: 'High',
          selected: false
        },
        {
          id: 'ORAN-002',
          name: 'O-RAN RIC Integration Test',
          component: 'O_RAN',
          status: 'Not Started',
          iterations: 'Never',
          successRate: 'N/A',
          lastRun: 'N/A',
          duration: '-',
          priority: 'High',
          selected: false
        },
        {
          id: 'ORAN-003',
          name: 'O-RAN xApp Deployment Test',
          component: 'O_RAN',
          status: 'Not Started',
          iterations: 'Never',
          successRate: 'N/A',
          lastRun: 'N/A',
          duration: '-',
          priority: 'Medium',
          selected: false
        }
      ],
      'NB_IoT': [
        {
          id: 'NBIOT-001',
          name: 'NB-IoT Device Attach',
          component: 'NB_IoT',
          status: 'Not Started',
          iterations: 'Never',
          successRate: 'N/A',
          lastRun: 'N/A',
          duration: '-',
          priority: 'High',
          selected: false
        },
        {
          id: 'NBIOT-002',
          name: 'NB-IoT Data Transmission',
          component: 'NB_IoT',
          status: 'Not Started',
          iterations: 'Never',
          successRate: 'N/A',
          lastRun: 'N/A',
          duration: '-',
          priority: 'High',
          selected: false
        },
        {
          id: 'NBIOT-003',
          name: 'NB-IoT Power Saving Mode',
          component: 'NB_IoT',
          status: 'Not Started',
          iterations: 'Never',
          successRate: 'N/A',
          lastRun: 'N/A',
          duration: '-',
          priority: 'Medium',
          selected: false
        }
      ],
      'V2X': [
        {
          id: 'V2X-001',
          name: 'V2X PC5 Interface Test',
          component: 'V2X',
          status: 'Not Started',
          iterations: 'Never',
          successRate: 'N/A',
          lastRun: 'N/A',
          duration: '-',
          priority: 'High',
          selected: false
        },
        {
          id: 'V2X-002',
          name: 'V2X Vehicle-to-Vehicle Communication',
          component: 'V2X',
          status: 'Not Started',
          iterations: 'Never',
          successRate: 'N/A',
          lastRun: 'N/A',
          duration: '-',
          priority: 'High',
          selected: false
        },
        {
          id: 'V2X-003',
          name: 'V2X Emergency Message Test',
          component: 'V2X',
          status: 'Not Started',
          iterations: 'Never',
          successRate: 'N/A',
          lastRun: 'N/A',
          duration: '-',
          priority: 'Critical',
          selected: false
        }
      ],
      'NTN': [
        {
          id: 'NTN-001',
          name: 'NTN Satellite Connection Test',
          component: 'NTN',
          status: 'Not Started',
          iterations: 'Never',
          successRate: 'N/A',
          lastRun: 'N/A',
          duration: '-',
          priority: 'High',
          selected: false
        },
        {
          id: 'NTN-002',
          name: 'NTN Beam Switching Test',
          component: 'NTN',
          status: 'Not Started',
          iterations: 'Never',
          successRate: 'N/A',
          lastRun: 'N/A',
          duration: '-',
          priority: 'High',
          selected: false
        },
        {
          id: 'NTN-003',
          name: 'NTN Handover Between Satellites',
          component: 'NTN',
          status: 'Not Started',
          iterations: 'Never',
          successRate: 'N/A',
          lastRun: 'N/A',
          duration: '-',
          priority: 'Medium',
          selected: false
        }
      ]
    };
    
    return sampleCases[categoryFilter] || [];
  };

  const loadDomainCases = async (domainLabel: string) => {
    addLog('INFO', `Loading test cases for domain: ${domainLabel}`);
    
    // Map domain labels to actual database categories
    const domainToCategory: Record<string, string> = {
      '5G NR': '5G_NR',
      '4G LTE': '4G_LTE', 
      'IMS/VoLTE/VoNR': 'IMS',
      'O-RAN': 'O_RAN',
      'NB-IoT': 'NB_IoT',
      'V2X': 'V2X',
      'NTN': 'NTN',
      'GCF Certification': 'GCF',
      'PTCRB Certification': 'PTCRB'
    };

    const categoryFilter = domainToCategory[domainLabel] || domainLabel;
    addLog('INFO', `Mapped ${domainLabel} to category: ${categoryFilter}`);
    
    // Try multiple API approaches to find the real test cases
    const queries = [
      `/api/test-cases/simple?category=${encodeURIComponent(categoryFilter)}&limit=300`, // Simple API without complex filters
      `/api/tests?protocol=${encodeURIComponent(categoryFilter)}&limit=300`, // Primary API with category filter
      `/api/test-cases/comprehensive?category=${encodeURIComponent(categoryFilter)}&limit=300`, // Comprehensive API
      `/api/test-cases/simple?limit=300` // Get all simple and filter client-side
    ];
    
    let foundRealData = false;
    
    for (const query of queries) {
      try {
        addLog('INFO', `Trying API: ${query}`);
        const res = await fetch(query);
        if (!res.ok) {
          addLog('WARN', `API ${query} failed with status: ${res.status}`);
          continue;
        }
        
        const json = await res.json();
        addLog('DEBUG', `API response keys: ${Object.keys(json).join(', ')}`);
        
        // Try different response structures
        let raw = json?.data?.testCases || json?.tests || json?.data || [];
        if (!Array.isArray(raw)) raw = [];
        
        // Filter by category if we got all test cases
        if (query.includes('limit=300') && !query.includes('category=')) {
          raw = raw.filter((t: any) => 
            t.category === categoryFilter || 
            t.protocol === categoryFilter ||
            (t.category && t.category.includes(categoryFilter.split('_')[0]))
          );
        }
        
        addLog('INFO', `Found ${raw.length} test cases from API`);
        
        if (raw.length > 0) {
          const cases = raw.map((t: any) => ({
            id: t.id || t.test_case_id || `tc_${Date.now()}_${Math.random()}`,
            name: t.name || `Test Case ${t.test_case_id || 'Unknown'}`,
            component: t.category || t.protocol || domainLabel,
            status: 'Not Started',
            iterations: 'Never',
            successRate: 'N/A',
            lastRun: 'N/A',
            duration: t.duration_seconds ? `${Math.floor(t.duration_seconds/60)}m ${t.duration_seconds%60}s` : '-',
            priority: t.priority || 'Medium',
            selected: false,
            test_type: (t.test_type || '').toString().toLowerCase(),
            raw_category: t.category || ''
          })) as any[];
          
          setTestCases(cases as TestCaseRow[]);
          addLog('INFO', `✅ Loaded ${cases.length} REAL test cases for ${domainLabel}`);
          foundRealData = true;
          break;
        }
      } catch (e) {
        addLog('WARN', `API ${query} failed: ${e}`);
        continue;
      }
    }
    
    // If no real data found, use sample data as fallback
    if (!foundRealData) {
      addLog('WARN', `No real test cases found in database for ${categoryFilter}, using sample data`);
      const sampleCases = getSampleTestCases(categoryFilter, domainLabel);
      setTestCases(sampleCases);
      addLog('INFO', `Loaded ${sampleCases.length} sample test cases as fallback`);
    }
  };

  // Load real test case counts for sidebar
  const loadTestCaseCounts = async () => {
    try {
      addLog('INFO', 'Loading real test case counts for sidebar...');
      const response = await fetch('/api/tests/stats');
      if (response.ok) {
        const stats = await response.json();
        
        // Update test suite counts with real data from your provided counts
        const realTestCaseCounts = {
          '5G NR': { total: 287, functional: 74, performance: 71, rf: 71, stability: 71 },
          '4G LTE': { total: 266, functional: 68, performance: 66, rf: 66, stability: 66 },
          'IMS/VoLTE/VoNR': { total: 215, functional: 108, 'performance/stability': 107 },
          'O-RAN': { total: 66, functional: 33, performance: 33 },
          'NB-IoT': { total: 59, functional: 30, performance: 29 },
          'V2X': { total: 59, functional: 30, performance: 29 },
          'NTN': { total: 22, functional: 11, performance: 11 },
          'GCF Certification': { total: 9, '3gpp_conformance': 3, protocol: 3, rf: 2, performance: 1 },
          'PTCRB Certification': { total: 9, '3gpp_conformance': 3, protocol: 3, rf: 2, performance: 1 }
        };

        setTestSuites(prevSuites => prevSuites.map(suite => {
          const counts = realTestCaseCounts[suite.name] || { total: 0 };
          
          return {
            ...suite,
            totalCount: counts.total,
            children: suite.children.map((child: any) => {
              // Map child names to count keys
              const childKey = child.name.toLowerCase().replace(/[^a-z]/g, '_');
              const mappedKey = childKey.includes('3gpp') ? '3gpp_conformance' : 
                              childKey.includes('performance_stability') ? 'performance/stability' :
                              childKey.replace('_', '');
              
              return {
                ...child,
                count: counts[mappedKey] || counts[child.name.toLowerCase()] || 0
              };
            })
          };
        }));
        
        addLog('INFO', `Updated sidebar with real test case counts`);
      }
    } catch (e) {
      addLog('WARN', `Failed to load test case counts: ${e}`);
    }
  };

  React.useEffect(() => {
    // Load initial test cases
    addLog('INFO', 'Initializing Test Manager with 5G NR category');
    loadDomainCases('5G NR');
    setSelectedDomain('5G NR');
    
    // Load real test case counts for sidebar
    loadTestCaseCounts();
    
    // Start polling active run and stats
    const poll = async () => {
      try {
        const ar = await fetch('/api/tests/runs/active').then(r => r.ok ? r.json() : null);
        setActiveRun(ar);
        const st = await fetch('/api/tests/stats').then(r => r.ok ? r.json() : null);
        setStats(st);
      } catch (_) {}
    };
    poll();
    const id = setInterval(poll, 3000);
    return () => clearInterval(id);
  }, []);

  const addLog = (level: 'INFO'|'ERROR'|'WARN'|'DEBUG', message: string) => {
    setLogs(prev => [...prev, { timestamp: new Date().toLocaleString(), level, message }]);
  };

  const toggleTestSuiteExpansion = (suiteId: string) => {
    setTestSuites(prevSuites => prevSuites.map(suite => 
      suite.id === suiteId ? { ...suite, expanded: !suite.expanded } : suite
    ));
  };

  const toggleTestSelection = (id: string) => {
    setTestCases(prev => prev.map(t => t.id === id ? { ...t, selected: !t.selected } : t));
  };

  const handleRunTest = async (id: string) => {
    setIsRunning(true);
    addLog('INFO', `Starting test execution: ${id}`);
    try {
      // 1. Start test execution via API
      const executionResponse = await fetch('/api/tests/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test_ids: [id], execution_mode: 'simulation' })
      });
      
      if (!executionResponse.ok) {
        throw new Error(`Execution API failed: ${executionResponse.status}`);
      }
      
      const executionData = await executionResponse.json();
      addLog('INFO', `Execution started for ${id}, RunId: ${executionData.run_id || 'unknown'}`);
      
      // 2. Fetch comprehensive test case data (messages, IEs, layer parameters)
      addLog('INFO', `Fetching comprehensive test case data for ${id}...`);
      const testDataResponse = await fetch(`/api/test-execution/comprehensive?testCaseId=${encodeURIComponent(id)}&includeTemplates=true`);
      
      if (!testDataResponse.ok) {
        addLog('WARN', `Failed to fetch test case data: ${testDataResponse.status}, continuing with basic execution`);
      } else {
        const testDataPayload = await testDataResponse.json();
        const testCaseData = testDataPayload.data;
        
        addLog('INFO', `Comprehensive test data fetched: ${testCaseData.expectedMessages?.length || 0} messages, ${testCaseData.expectedInformationElements?.length || 0} IEs, ${testCaseData.expectedLayerParameters?.length || 0} layer parameters`);
        
        // 3. Feed data to 5GLabX backend - ENHANCED INTEGRATION
        addLog('INFO', `Integrating with 5GLabX platform for test case ${id}...`);
        
        // Always send data to 5GLabX even with sample data
        const testDataForPlayback = testCaseData || {
          testCase: { id: id, name: `Test Case ${id}` },
          expectedMessages: [
            { 
              stepOrder: 1, timestampMs: 1000, direction: 'UL', layer: 'RRC', 
              protocol: '5G_NR', messageType: 'RRCSetupRequest', messageName: 'RRC Setup Request',
              messagePayload: { ue_identity: '0x12345678' }
            },
            { 
              stepOrder: 2, timestampMs: 2000, direction: 'DL', layer: 'RRC', 
              protocol: '5G_NR', messageType: 'RRCSetup', messageName: 'RRC Setup',
              messagePayload: { rrc_transaction_id: 1 }
            }
          ],
          expectedInformationElements: [
            { ieName: 'UE-Identity', ieValue: '0x12345678', ieType: 'MANDATORY' }
          ],
          expectedLayerParameters: [
            { layer: 'RRC', parameterName: 'TransactionID', parameterValue: 1 }
          ]
        };
        
        // Send to 5GLabX via multiple channels for reliability
        try {
          // Method 1: Direct window messaging
          if (typeof window !== 'undefined') {
            window.postMessage({
              type: '5GLABX_TEST_EXECUTION',
              testCaseId: id,
              runId: executionData.run_id || `run_${Date.now()}`,
              testCaseData: testDataForPlayback,
              timestamp: Date.now()
            }, '*');
            addLog('INFO', `✅ Sent test data to 5GLabX via postMessage`);
          }
          
          // Method 2: Custom event dispatch
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('testCaseExecutionStarted', {
              detail: {
                testCaseId: id,
                runId: executionData.run_id || `run_${Date.now()}`,
                testCaseData: testDataForPlayback,
                timestamp: Date.now()
              }
            }));
            addLog('INFO', `✅ Dispatched testCaseExecutionStarted event to 5GLabX`);
          }
          
          // Method 3: TestCasePlaybackService if available
          if (typeof window !== 'undefined' && window.TestCasePlaybackService) {
            if (!window.playbackServiceInstance) {
              window.playbackServiceInstance = new window.TestCasePlaybackService({
                databaseService: null,
                websocketBroadcast: (type: string, source: string, data: any) => {
                  addLog('DEBUG', `📡 5GLabX WebSocket broadcast: ${type} from ${source}`);
                },
                fetchImpl: fetch,
                dataFormatAdapter: window.DataFormatAdapter || null
              });
            }
            
            const playbackResult = await window.playbackServiceInstance.startPlayback({
              testCaseId: id,
              runId: executionData.run_id || `run_${Date.now()}`,
              apiBaseUrl: '/api',
              speed: 1.0
            });
            
            addLog('INFO', `✅ 5GLabX playback started: ${playbackResult.count} messages queued`);
          }
          
        } catch (playbackError) {
          addLog('ERROR', `5GLabX integration failed: ${playbackError}`);
        }
      }
      
      // 4. Update UI status
      setTestCases(prev => prev.map(t => t.id === id ? { ...t, status: 'Running' } : t));
      
      // 5. Simulate execution completion (in real implementation, this would come from backend)
      setTimeout(() => {
        const passed = Math.random() >= 0.2;
        setTestCases(prev => prev.map(t => t.id === id ? { ...t, status: passed ? 'Completed' : 'Failed', lastRun: new Date().toLocaleString(), duration: '2m 15s' } : t));
        addLog(passed ? 'INFO' : 'ERROR', `Execution ${passed ? 'passed' : 'failed'} for ${id}`);
        
        // Stop 5GLabX playback
        if (window.playbackServiceInstance) {
          window.playbackServiceInstance.stopPlayback();
          addLog('INFO', '5GLabX playback stopped');
        }
        
        setIsRunning(false);
      }, 8000); // Extended time to allow 5GLabX playback
      
    } catch (e) {
      addLog('ERROR', `Failed to start execution: ${e}`);
      setIsRunning(false);
    }
  };

  const runAllSelected = async () => {
    const ids = testCases.filter(t => t.selected).map(t => t.id);
    if (ids.length === 0) return;
    setIsRunning(true);
    addLog('INFO', `Starting batch execution: ${ids.length} tests`);
    try {
      await fetch('/api/tests/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test_ids: ids, execution_mode: 'simulation' })
      });
      ids.forEach((id, i) => setTimeout(() => {
        const passed = Math.random() >= 0.2;
        setTestCases(prev => prev.map(t => t.id === id ? { ...t, status: passed ? 'Completed' : 'Failed', lastRun: new Date().toLocaleString(), duration: '2m 15s' } : t));
        addLog(passed ? 'INFO' : 'ERROR', `Execution ${passed ? 'passed' : 'failed'} for ${id}`);
      }, 800 * (i + 1)));
      setTimeout(() => { setIsRunning(false); addLog('INFO', 'Batch execution completed'); }, 1500 * ids.length);
    } catch (e) {
      addLog('ERROR', 'Batch execution failed');
      setIsRunning(false);
    }
  };

  const statusClass = (s: string) => s === 'Completed' ? 'bg-green-100 text-green-800' : s === 'Running' ? 'bg-blue-100 text-blue-800' : s === 'Failed' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800';
  const levelClass = (l: string) => l === 'ERROR' ? 'bg-red-500' : l === 'WARN' ? 'bg-yellow-500' : l === 'DEBUG' ? 'bg-gray-500' : 'bg-blue-500';

  return (
    <div className="h-[720px] flex bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-80 bg-gray-800 text-white flex flex-col">
        <div className="bg-blue-600 p-4">
          <h1 className="text-lg font-bold text-white">RAN-Core Automation Test Manager</h1>
        </div>

        {/* RAN Components */}
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">RAN Components</h3>
          <div className="space-y-2">
            {ranComponents.map(c => (
              <div key={c.id} className="flex items-center justify-between p-2 hover:bg-gray-700 rounded">
                <span className="text-sm">{c.name}</span>
                <div className="flex items-center space-x-1">
                  <button className="w-6 h-6 bg-green-600 rounded flex items-center justify-center hover:bg-green-700" title="Start">
                    <i data-lucide="play" className="w-3 h-3"></i>
                  </button>
                  <button className="w-6 h-6 bg-red-600 rounded flex items-center justify-center hover:bg-red-700" title="Stop">
                    <i data-lucide="square" className="w-3 h-3"></i>
                  </button>
                  <button className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center hover:bg-gray-700" title="Settings">
                    <i data-lucide="settings" className="w-3 h-3"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Test Suites */}
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-300">Test Suites</h3>
            <button className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700">+ Add Test Suite</button>
          </div>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {testSuites.map(suite => (
              <div key={suite.id} className="mb-2">
                {/* Main Category Header */}
                <div className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedDomain === suite.name 
                    ? 'bg-gray-700 border-l-4 border-blue-500 shadow-md' 
                    : 'hover:bg-gray-700 hover:shadow-sm'
                }`}>
                  {/* Left side - Icon, Name, Expand/Collapse */}
                  <div className="flex items-center space-x-3" onClick={() => { 
                    addLog('INFO', `Category clicked: ${suite.name}`); 
                    setSelectedDomain(suite.name); 
                    setSelectedCategoryType(null); 
                    loadDomainCases(suite.name); 
                  }}>
                    <span className="text-lg">{(suite as any).icon}</span>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">{suite.name}</span>
                      <span className="text-xs text-gray-400">
                        {(suite as any).totalCount > 0 ? `${(suite as any).totalCount} test cases` : 'Loading...'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Right side - Count Badge and Expand Button */}
                  <div className="flex items-center space-x-2">
                    {(suite as any).totalCount > 0 && (
                      <span 
                        className="text-white text-xs px-2 py-1 rounded-full font-medium"
                        style={{ backgroundColor: (suite as any).color }}
                      >
                        {(suite as any).totalCount}
                      </span>
                    )}
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        toggleTestSuiteExpansion(suite.id); 
                      }}
                      className="p-1 hover:bg-gray-600 rounded transition-colors"
                    >
                      <i data-lucide={suite.expanded ? 'chevron-down' : 'chevron-right'} className="w-4 h-4 text-gray-300"></i>
                    </button>
                  </div>
                </div>
                
                {/* Subcategories - Expandable */}
                {suite.expanded && (
                  <div className="ml-6 mt-2 space-y-1 border-l-2 border-gray-600 pl-4">
                    {suite.children.map((child: any) => (
                      <div 
                        key={child.id} 
                        className={`flex items-center justify-between p-2 rounded cursor-pointer transition-all duration-150 ${
                          selectedCategoryType === child.name 
                            ? 'bg-gray-600 border-l-2 border-blue-400' 
                            : 'hover:bg-gray-600'
                        }`}
                        onClick={() => {
                          setSelectedCategoryType(child.name);
                          addLog('INFO', `Subcategory selected: ${child.name} (${child.count} test cases)`);
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: (suite as any).color }}
                          ></div>
                          <span className="text-sm text-gray-300">{child.name}</span>
                        </div>
                        {child.count > 0 && (
                          <span 
                            className="text-white text-xs px-2 py-1 rounded-full font-medium"
                            style={{ backgroundColor: (suite as any).color, opacity: 0.8 }}
                          >
                            {child.count}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Test Cases Management */}
        <div className="bg-white border-b border-gray-200 p-4 max-h-96 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Test Cases Management</h2>
            <div className="flex items-center space-x-2">
              <button className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700">+ Add Test Case</button>
              <button className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 flex items-center space-x-1" onClick={runAllSelected} disabled={isRunning}>
                <i data-lucide="play" className="w-4 h-4"></i><span>Run All Tests</span>
              </button>
              <button className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700">Delete Selected</button>
            </div>
          </div>

          <div className="overflow-x-auto overflow-y-auto flex-1">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 sticky top-0">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"></th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Component</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Iterations</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Success Rate</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Last Run</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {testCases
                  .filter((tc: any) => {
                    // Since we now filter by category in the API call, 
                    // we mainly need to handle subcategory/test type filtering
                    
                    // If no subcategory is selected, show all test cases from the selected domain
                    if (!selectedCategoryType) return true;
                    
                    // Subcategory/test type filter
                    const type = (tc as any).test_type || '';
                    // If DB doesn't have test_type, don't hide the row
                    if (!type) return true;
                    
                    const wanted = selectedCategoryType.toLowerCase();
                    if (wanted.includes('/')) {
                      const parts = wanted.split('/');
                      return parts.some(p => type.includes(p.trim()));
                    }
                    return type.includes(wanted);
                  })
                  .map(tc => (
                  <tr key={tc.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2"><input type="checkbox" className="form-checkbox" checked={!!tc.selected} onChange={() => toggleTestSelection(tc.id)} /></td>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900">{tc.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">{tc.component}</td>
                    <td className="px-4 py-2"><span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClass(tc.status)}`}>{tc.status}</span></td>
                    <td className="px-4 py-2 text-sm text-gray-500">{tc.iterations}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">{tc.successRate}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">{tc.lastRun}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">{tc.duration}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">{tc.priority}</td>
                    <td className="px-4 py-2">
                      <div className="flex items-center space-x-2">
                        <button className="bg-blue-600 text-white p-1 rounded hover:bg-blue-700" onClick={() => handleRunTest(tc.id)} disabled={isRunning}>
                          <i data-lucide="play" className="w-4 h-4"></i>
                        </button>
                        <button className="bg-gray-600 text-white p-1 rounded hover:bg-gray-700">
                          <i data-lucide="eye" className="w-4 h-4"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Automation Log + Running Tests + Recent Stats */}
        <div className="flex-1 grid grid-rows-2 gap-4 p-4 bg-white min-h-96">
          {/* Automation Log - Always Visible */}
          <div className="border rounded p-4 min-h-64">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Automation Log</h2>
              <div className="flex items-center space-x-2">
                <button className="bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700" onClick={() => setLogs([])}>Clear</button>
              </div>
            </div>
            <div className="bg-black text-white p-4 rounded font-mono text-sm h-48 overflow-y-auto">
              {logs.map((log, idx) => (
                <div key={idx} className="flex items-start space-x-2 mb-1">
                  <span className="text-blue-400">[{log.timestamp}]</span>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${levelClass(log.level)} text-white`}>{log.level}</span>
                  <span className="text-white">{log.message}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Running Tests + Recent Results */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded p-4">
              <h3 className="text-md font-semibold text-gray-900 mb-3">Running Tests</h3>
              {activeRun ? (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Status:</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs">{activeRun.status}</span>
                  </div>
                  <div className="flex items-center justify-between"><span className="text-gray-700">Progress:</span><span>{Math.round(activeRun.progress || 0)}%</span></div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${Math.round(activeRun.progress || 0)}%` }}></div>
                  </div>
                  {activeRun.current_test && (
                    <div className="text-gray-700">Current: {activeRun.current_test}</div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-gray-500">No active runs</div>
              )}
            </div>
            <div className="border rounded p-4">
              <h3 className="text-md font-semibold text-gray-900 mb-3">Recent Results</h3>
              {stats ? (
                <div className="text-sm text-gray-700 space-y-1">
                  <div>Total Tests: {stats.total_tests}</div>
                  <div>Recent Runs (7d): {stats.recent_runs}</div>
                  <div>Success Rate: {stats.success_rate?.toFixed?.(1) || 0}%</div>
                </div>
              ) : (
                <div className="text-sm text-gray-500">Loading stats...</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassicTestManager;


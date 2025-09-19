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

  const [testSuites] = React.useState([
    {
      id: '5g-nr',
      name: '5G NR',
      expanded: true,
      children: [
        { id: '5gnr-functional', name: 'Functional', count: 3 },
        { id: '5gnr-performance', name: 'Performance', count: 2 },
        { id: '5gnr-rf', name: 'RF', count: 2 },
        { id: '5gnr-stability', name: 'Stability', count: 1 }
      ]
    },
    {
      id: '4g-lte',
      name: '4G LTE',
      expanded: true,
      children: [
        { id: 'lte-functional', name: 'Functional', count: 3 },
        { id: 'lte-performance', name: 'Performance', count: 2 },
        { id: 'lte-rf', name: 'RF', count: 1 },
        { id: 'lte-stability', name: 'Stability', count: 1 }
      ]
    },
    {
      id: 'ims',
      name: 'IMS/VoLTE/VoNR',
      expanded: true,
      children: [
        { id: 'ims-functional', name: 'Functional', count: 3 },
        { id: 'ims-performance-stability', name: 'Performance/Stability', count: 2 }
      ]
    },
    {
      id: 'oran',
      name: 'O-RAN',
      expanded: true,
      children: [
        { id: 'oran-functional', name: 'Functional', count: 3 },
        { id: 'oran-performance', name: 'Performance', count: 2 }
      ]
    },
    {
      id: 'nbiot',
      name: 'NB-IoT',
      expanded: true,
      children: [
        { id: 'nbiot-functional', name: 'Functional', count: 3 },
        { id: 'nbiot-performance', name: 'Performance', count: 2 }
      ]
    },
    {
      id: 'v2x',
      name: 'V2X',
      expanded: true,
      children: [
        { id: 'v2x-functional', name: 'Functional', count: 3 },
        { id: 'v2x-performance', name: 'Performance', count: 2 }
      ]
    },
    {
      id: 'ntn',
      name: 'NTN',
      expanded: true,
      children: [
        { id: 'ntn-functional', name: 'Functional', count: 3 },
        { id: 'ntn-performance', name: 'Performance', count: 2 }
      ]
    },
    {
      id: 'gcf',
      name: 'GCF Certification',
      expanded: true,
      children: [
        { id: 'gcf-3gpp-conformance', name: '3GPP Conformance', count: 3 },
        { id: 'gcf-protocol', name: 'Protocol', count: 3 },
        { id: 'gcf-rf', name: 'RF', count: 2 },
        { id: 'gcf-performance', name: 'Performance', count: 1 }
      ]
    },
    {
      id: 'ptcrb',
      name: 'PTCRB Certification',
      expanded: true,
      children: [
        { id: 'ptcrb-3gpp-conformance', name: '3GPP Conformance', count: 3 },
        { id: 'ptcrb-protocol', name: 'Protocol', count: 3 },
        { id: 'ptcrb-rf', name: 'RF', count: 2 },
        { id: 'ptcrb-performance', name: 'Performance', count: 1 }
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
    
    // ALWAYS load sample test cases first for immediate display
    const sampleCases = getSampleTestCases(categoryFilter, domainLabel);
    setTestCases(sampleCases);
    addLog('INFO', `Loaded ${sampleCases.length} sample test cases for immediate display`);
    
    // Then try to load from API (this will replace sample data if successful)
    const query = `/api/test-cases/comprehensive?category=${encodeURIComponent(categoryFilter)}&limit=300`;
    try {
      addLog('INFO', `Attempting API fetch from: ${query}`);
      const res = await fetch(query);
      if (!res.ok) {
        const errorText = await res.text();
        addLog('WARN', `API call failed for ${domainLabel}, status: ${res.status}, keeping sample data`);
        return; // Keep sample data
      }
      const json = await res.json();
      addLog('DEBUG', `API response received, processing...`);
      
      const raw = (json?.data?.testCases || []) as any[];
      if (raw.length > 0) {
        const cases = raw.map((t: any) => ({
          id: t.id || t.test_case_id || 'unknown',
          name: t.name,
          component: t.category || t.protocol || domainLabel,
          status: 'Not Started',
          iterations: 'Never',
          successRate: 'N/A',
          lastRun: 'N/A',
          duration: '-',
          priority: t.priority || '',
          selected: false,
          test_type: (t.test_type || '').toString().toLowerCase(),
          raw_category: t.category || ''
        })) as any[];
        setTestCases(cases as TestCaseRow[]);
        addLog('INFO', `Replaced with ${cases.length} real test cases from database`);
      } else {
        addLog('INFO', `API returned no test cases, keeping ${sampleCases.length} sample test cases`);
      }
    } catch (e) {
      addLog('WARN', `API fetch failed: ${e}, keeping sample test cases`);
      // Sample cases already loaded, no need to reload
    }
  };

  React.useEffect(() => {
    // Load initial test cases
    addLog('INFO', 'Initializing Test Manager with 5G NR category');
    loadDomainCases('5G NR');
    setSelectedDomain('5G NR');
    
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
        
        // 3. Feed data to 5GLabX backend via TestCasePlaybackService
        if (typeof window !== 'undefined' && window.TestCasePlaybackService) {
          try {
            addLog('INFO', `Starting 5GLabX playback service for test case ${id}...`);
            
            // Initialize playback service if not already done
            if (!window.playbackServiceInstance) {
              window.playbackServiceInstance = new window.TestCasePlaybackService({
                databaseService: null,
                websocketBroadcast: (type: string, source: string, data: any) => {
                  // Broadcast to 5GLabX frontend
                  if (typeof window !== 'undefined' && window.postMessage) {
                    window.postMessage({
                      type: '5GLABX_TEST_DATA',
                      source: source,
                      testCaseId: id,
                      data: data
                    }, '*');
                  }
                  addLog('DEBUG', `Broadcasting ${type} data from ${source} to 5GLabX`);
                },
                fetchImpl: fetch,
                dataFormatAdapter: window.DataFormatAdapter || null
              });
            }
            
            // Start playback with the fetched test case data
            const playbackResult = await window.playbackServiceInstance.startPlayback({
              testCaseId: id,
              runId: executionData.run_id || `run_${Date.now()}`,
              apiBaseUrl: '/api',
              speed: 1.0
            });
            
            addLog('INFO', `5GLabX playback started successfully: ${playbackResult.count} messages queued`);
            
            // Notify 5GLabX platform about test execution
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('testCaseExecutionStarted', {
                detail: {
                  testCaseId: id,
                  runId: executionData.run_id,
                  testCaseData: testCaseData,
                  playbackResult: playbackResult
                }
              }));
            }
            
          } catch (playbackError) {
            addLog('WARN', `5GLabX playback failed: ${playbackError}, continuing with standard execution`);
          }
        } else {
          addLog('WARN', '5GLabX TestCasePlaybackService not available, continuing with standard execution');
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
              <div key={suite.id} className="space-y-1">
                <div className={`flex items-center justify-between p-2 hover:bg-gray-700 rounded cursor-pointer ${selectedDomain === suite.name ? 'bg-gray-700 border-l-2 border-blue-500' : ''}`} onClick={() => { 
                  addLog('INFO', `Category clicked: ${suite.name}`); 
                  setSelectedDomain(suite.name); 
                  setSelectedCategoryType(null); 
                  loadDomainCases(suite.name); 
                }}>
                  <div className="flex items-center space-x-2">
                    <i data-lucide={suite.expanded ? 'chevron-down' : 'chevron-right'} className="w-4 h-4"></i>
                    <span className="text-sm">{suite.name}</span>
                  </div>
                </div>
                {suite.expanded && (
                  <div className="ml-4 space-y-1">
                    {suite.children.map((child: any) => (
                      <div key={child.id} className="flex items-center justify-between p-2 hover:bg-gray-700 rounded cursor-pointer" onClick={() => setSelectedCategoryType(child.name)}>
                        <span className="text-sm text-gray-300">{child.name}</span>
                        {child.count > 0 && <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">{child.count}</span>}
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
        <div className="bg-white border-b border-gray-200 p-4">
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

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
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
        <div className="flex-1 grid grid-rows-2 gap-4 p-4 bg-white">
          {/* Automation Log */}
          <div className="border rounded p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Automation Log</h2>
              <div className="flex items-center space-x-2">
                <button className="bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700" onClick={() => setLogs([])}>Clear</button>
              </div>
            </div>
            <div className="bg-black text-white p-4 rounded font-mono text-sm h-56 overflow-y-auto">
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


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
        { id: '5gnr-functional', name: 'Functional', count: 0 },
        { id: '5gnr-performance', name: 'Performance', count: 0 },
        { id: '5gnr-rf', name: 'RF', count: 0 },
        { id: '5gnr-stability', name: 'Stability', count: 0 }
      ]
    },
    {
      id: '4g-lte',
      name: '4G LTE',
      expanded: true,
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
      expanded: true,
      children: [
        { id: 'ims-functional', name: 'Functional', count: 0 },
        { id: 'ims-performance-stability', name: 'Performance/Stability', count: 0 }
      ]
    },
    {
      id: 'oran',
      name: 'O-RAN',
      expanded: true,
      children: [
        { id: 'oran-functional', name: 'Functional', count: 0 },
        { id: 'oran-performance', name: 'Performance', count: 0 }
      ]
    },
    {
      id: 'nbiot',
      name: 'NB-IoT',
      expanded: true,
      children: [
        { id: 'nbiot-functional', name: 'Functional', count: 0 },
        { id: 'nbiot-performance', name: 'Performance', count: 0 }
      ]
    },
    {
      id: 'v2x',
      name: 'V2X',
      expanded: true,
      children: [
        { id: 'v2x-functional', name: 'Functional', count: 0 },
        { id: 'v2x-performance', name: 'Performance', count: 0 }
      ]
    },
    {
      id: 'ntn',
      name: 'NTN',
      expanded: true,
      children: [
        { id: 'ntn-functional', name: 'Functional', count: 0 },
        { id: 'ntn-performance', name: 'Performance', count: 0 }
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

  const loadDomainCases = async (domainLabel: string) => {
    // Fetch a broader list to avoid server-side category mismatches; filter on client
    const query = '/api/test-cases/comprehensive?limit=300';
    try {
      const res = await fetch(query);
      if (!res.ok) return;
      const json = await res.json();
      const raw = (json?.data?.testCases || []) as any[];
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
      addLog('INFO', `Loaded ${cases.length} test cases; filtering for ${domainLabel}`);
    } catch (e) {
      addLog('WARN', `Failed loading ${domainLabel} test cases; using defaults`);
    }
  };

  React.useEffect(() => {
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
      // Use single-run API (batch also supported)
      await fetch('/api/tests/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test_ids: [id], execution_mode: 'simulation' })
      });
      addLog('INFO', `Execution started for ${id}`);
      setTestCases(prev => prev.map(t => t.id === id ? { ...t, status: 'Running' } : t));
      setTimeout(() => {
        const passed = Math.random() >= 0.2;
        setTestCases(prev => prev.map(t => t.id === id ? { ...t, status: passed ? 'Completed' : 'Failed', lastRun: new Date().toLocaleString(), duration: '2m 15s' } : t));
        addLog(passed ? 'INFO' : 'ERROR', `Execution ${passed ? 'passed' : 'failed'} for ${id}`);
        setIsRunning(false);
      }, 3000);
    } catch (e) {
      addLog('ERROR', `Failed to start execution: ${id}`);
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
        <div className="p-4 flex-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-300">Test Suites</h3>
            <button className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700">+ Add Test Suite</button>
          </div>
          <div className="space-y-1">
            {testSuites.map(suite => (
              <div key={suite.id} className="space-y-1">
                <div className="flex items-center justify-between p-2 hover:bg-gray-700 rounded cursor-pointer" onClick={() => { setSelectedDomain(suite.name); setSelectedCategoryType(null); loadDomainCases(suite.name); }}>
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
                    // Domain filter (match codes or labels)
                    if (selectedDomain) {
                      const dom = normalize(selectedDomain);
                      const comp = normalize(tc.component || tc.raw_category || '');
                      if (!comp.includes(dom)) return false;
                    }
                    // Subcategory/test type filter
                    if (!selectedCategoryType) return true;
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


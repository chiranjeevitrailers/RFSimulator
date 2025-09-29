'use client';

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Square, 
  RefreshCw, 
  ChevronDown, 
  ChevronRight,
  Activity,
  BarChart3,
  Database,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Pause,
  Download,
  Eye
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Professional Testing Platform - QXDM/Keysight-like Interface (Netlify Deployment Fix)
const ProfessionalTestManager: React.FC = () => {
  try {
    React.useEffect(() => {
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    }, []);

    const [selectedComponent, setSelectedComponent] = useState('enodeb');
    const [selectedTestSuite, setSelectedTestSuite] = useState(null);
    const [selectedTests, setSelectedTests] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isPanelVisible, setIsPanelVisible] = useState(true);
    const [horizontalScrollPosition, setHorizontalScrollPosition] = useState(0);
    
    // Integrate with existing working Supabase implementation
    useEffect(() => {
      // Load test cases from existing Supabase test_cases table
      loadTestCasesFromSupabase();
      // Skip problematic test suite counts loading to avoid infinite recursion
      // loadTestSuiteCountsFromSupabase(); // Fixed for Netlify deployment
      // Connect to 5GLabX backend for real-time log analysis
      const ws = connectTo5GLabX();
      
      // Cleanup WebSocket connection on unmount
      return () => {
        if (ws) {
          ws.close();
        }
      };
    }, []);

    // Connect to existing Supabase test_cases table
    const loadTestCasesFromSupabase = async () => {
      try {
        // Use comprehensive API endpoint to get all 1800+ test cases
        const response = await fetch('/api/test-cases/comprehensive/?limit=2000');
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        const testCasesData = result.data || result;
        
        if (Array.isArray(testCasesData)) {
          // Transform API data to match our frontend structure
          const transformedTestCases = testCasesData.map(testCase => ({
            id: testCase.id,
            name: testCase.name,
            component: testCase.component || testCase.protocol,
            status: testCase.status || 'Not Started',
            iterations: testCase.iterations || 'Never',
            successRate: testCase.success_rate || 'N/A',
            lastRun: testCase.last_run || 'N/A',
            duration: testCase.duration || '',
            priority: testCase.priority || 'Medium',
            category: testCase.category,
            protocol: testCase.protocol,
            layer: testCase.layer,
            complexity: testCase.complexity,
            selected: false
          }));
          
          setTestCases(transformedTestCases);
          addLog('INFO', `Loaded ${transformedTestCases.length} test cases from Supabase (Total: ${result.total || transformedTestCases.length})`);
        } else {
          addLog('ERROR', 'Invalid test cases data format');
        }
      } catch (error) {
        console.error('Error loading test cases:', error);
        addLog('ERROR', `Failed to load test cases: ${error.message}`);
      }
    };

    // Load test suite counts from existing Supabase data
    const loadTestSuiteCountsFromSupabase = async () => {
      try {
        // Get counts from existing test_cases table grouped by category
        const { data, error } = await supabase
          .from('test_cases')
          .select('category, subcategory')
          .not('category', 'is', null);
        
        if (error) throw error;
        
        // Process counts for each category and subcategory
        const counts = {};
        data.forEach(item => {
          if (!counts[item.category]) {
            counts[item.category] = { total: 0, subcategories: {} };
          }
          counts[item.category].total++;
          if (item.subcategory) {
            counts[item.category].subcategories[item.subcategory] = 
              (counts[item.category].subcategories[item.subcategory] || 0) + 1;
          }
        });
        
        // Update testSuites with real counts from Supabase (avoid infinite recursion)
        const updatedTestSuites = testSuites.map(suite => {
          const categoryKey = suite.id === '5g-nr' ? '5G_NR' :
                             suite.id === '4g-lte' ? '4G_LTE' :
                             suite.id === 'o-ran' ? 'O_RAN' :
                             suite.id === 'nb-iot' ? 'NB_IoT' :
                             suite.id === 'ntn' ? 'NTN' :
                             suite.id === 'v2x' ? 'V2X' :
                             suite.id === 'core-network' ? 'IMS_SIP' :
                             suite.id === 'call-flows' ? 'IMS_SIP' :
                             'Other';
          
          const realCount = counts[categoryKey]?.total || 0;
          
          return {
            ...suite,
            totalCount: realCount,
            children: suite.children.map(child => {
              // Map subcategories to real counts if available
              const subcategoryCount = counts[categoryKey]?.subcategories[child.name] || 
                                     Math.floor(realCount / suite.children.length);
              return { ...child, count: subcategoryCount };
            })
          };
        });
        
        setTestSuites(updatedTestSuites);
        
        addLog('INFO', `Loaded test suite counts from Supabase: ${Object.keys(counts).join(', ')}`);
        return counts;
      } catch (error) {
        console.error('Error loading test suite counts:', error);
        addLog('ERROR', `Failed to load test suite counts: ${error.message}`);
      }
    };
    const [logs, setLogs] = useState([
      { timestamp: '2024-01-18 00:40:15', level: 'INFO', message: 'Initializing RAN-Core Test Manager' },
      { timestamp: '2024-01-18 00:40:16', level: 'INFO', message: 'loading component configurations' },
      { timestamp: '2024-01-18 00:40:17', level: 'INFO', message: 'Preparing test environment' },
      { timestamp: '2024-01-18 00:40:18', level: 'INFO', message: 'Test environment ready' },
      { timestamp: '2024-01-18 00:40:19', level: 'INFO', message: 'Monitoring system status' },
      { timestamp: '2024-01-18 00:40:20', level: 'INFO', message: 'All components online' }
    ]);
    const [testCases, setTestCases] = React.useState([
      {
        id: 'tc-001',
        name: 'Attach',
        component: 'eNodeB',
        status: 'Not Started',
        iterations: 'Never',
        successRate: 'N/A',
        lastRun: 'N/A',
        duration: '',
        priority: 'High',
        selected: false
      },
      {
        id: 'tc-002',
        name: 'Detach',
        component: 'eNodeB',
        status: 'Completed',
        iterations: '5',
        successRate: '100%',
        lastRun: '2024-01-18 00:35:22',
        duration: '2.3s',
        priority: 'Medium',
        selected: false
      },
      {
        id: 'tc-003',
        name: 'Handover',
        component: 'gNodeB',
        status: 'Running',
        iterations: '3',
        successRate: '66%',
        lastRun: '2024-01-18 00:38:15',
        duration: '1.8s',
        priority: 'High',
        selected: false
      },
      {
        id: 'tc-004',
        name: 'Paging',
        component: 'Core Network',
        status: 'Failed',
        iterations: '2',
        successRate: '0%',
        lastRun: '2024-01-18 00:32:45',
        duration: '5.1s',
        priority: 'Low',
        selected: false
      },
      {
        id: 'tc-005',
        name: 'Bearer Setup',
        component: 'eNodeB',
        status: 'Not Started',
        iterations: 'Never',
        successRate: 'N/A',
        lastRun: 'N/A',
        duration: '',
        priority: 'Medium',
        selected: false
      },
      {
        id: 'tc-006',
        name: 'Mobility Management',
        component: 'gNodeB',
        status: 'Paused',
        iterations: '1',
        successRate: 'N/A',
        lastRun: '2024-01-18 00:25:30',
        duration: '3.2s',
        priority: 'High',
        selected: false
      },
      {
        id: 'tc-007',
        name: 'Authentication',
        component: 'Core Network',
        status: 'Completed',
        iterations: '8',
        successRate: '87%',
        lastRun: '2024-01-18 00:30:15',
        duration: '1.2s',
        priority: 'High',
        selected: false
      },
      {
        id: 'tc-008',
        name: 'Session Management',
        component: 'gNodeB',
        status: 'Not Started',
        iterations: 'Never',
        successRate: 'N/A',
        lastRun: 'N/A',
        duration: '',
        priority: 'Medium',
        selected: false
      },
      {
        id: 'tc-009',
        name: 'Quality of Service',
        component: 'eNodeB',
        status: 'Running',
        iterations: '4',
        successRate: '75%',
        lastRun: '2024-01-18 00:28:45',
        duration: '4.5s',
        priority: 'High',
        selected: false
      },
      {
        id: 'tc-010',
        name: 'Load Balancing',
        component: 'Core Network',
        status: 'Failed',
        iterations: '1',
        successRate: '0%',
        lastRun: '2024-01-18 00:20:30',
        duration: '6.8s',
        priority: 'Low',
        selected: false
      },
      {
        id: 'tc-011',
        name: 'Power Control',
        component: 'gNodeB',
        status: 'Completed',
        iterations: '6',
        successRate: '83%',
        lastRun: '2024-01-18 00:15:20',
        duration: '2.1s',
        priority: 'Medium',
        selected: false
      },
      {
        id: 'tc-012',
        name: 'Interference Management',
        component: 'eNodeB',
        status: 'Not Started',
        iterations: 'Never',
        successRate: 'N/A',
        lastRun: 'N/A',
        duration: '',
        priority: 'High',
        selected: false
      },
      {
        id: 'tc-013',
        name: 'Resource Allocation',
        component: 'gNodeB',
        status: 'Paused',
        iterations: '2',
        successRate: '50%',
        lastRun: '2024-01-18 00:10:15',
        duration: '3.7s',
        priority: 'High',
        selected: false
      },
      {
        id: 'tc-014',
        name: 'Network Slicing',
        component: 'Core Network',
        status: 'Running',
        iterations: '3',
        successRate: '67%',
        lastRun: '2024-01-18 00:05:45',
        duration: '5.2s',
        priority: 'Medium',
        selected: false
      },
      {
        id: 'tc-015',
        name: 'Beam Management',
        component: 'gNodeB',
        status: 'Completed',
        iterations: '7',
        successRate: '86%',
        lastRun: '2024-01-18 00:00:30',
        duration: '1.9s',
        priority: 'High',
        selected: false
      }
    ]);

    // RAN Components
    const ranComponents = [
      { id: 'enodeb', name: 'eNodeB', status: 'active', color: 'green' },
      { id: 'gnodeb', name: 'gNodeB', status: 'active', color: 'green' },
      { id: 'core', name: 'Core Network', status: 'active', color: 'green' }
    ];

    // Test Suites Categories - Updated to match specified layout
    const [testSuites, setTestSuites] = useState([
      {
        id: '5g-nr',
        name: '5G NR',
        totalCount: 450,
        expanded: true,
        children: [
          { id: '5g-functional', name: 'Functional', count: 200 },
          { id: '5g-performance', name: 'Performance', count: 150 },
          { id: '5g-mobility', name: 'Mobility', count: 75 },
          { id: '5g-rf', name: 'RF', count: 25 }
        ]
      },
      {
        id: '4g-lte',
        name: '4G LTE',
        totalCount: 600,
        expanded: true,
        children: [
          { id: '4g-functional', name: 'Functional', count: 300 },
          { id: '4g-performance', name: 'Performance', count: 200 },
          { id: '4g-mobility', name: 'Mobility', count: 80 },
          { id: '4g-rf', name: 'RF', count: 20 }
        ]
      },
      {
        id: 'core-network',
        name: 'Core Network',
        totalCount: 300,
        expanded: true,
        children: [
          { id: 'core-network-tests', name: 'Core Network', count: 300 }
        ]
      },
      {
        id: 'call-flows',
        name: 'Call Flows',
        totalCount: 350,
        expanded: true,
        children: [
          { id: 'call-flows-tests', name: 'Call Flows', count: 350 }
        ]
      },
      {
        id: 'o-ran',
        name: 'O-RAN',
        totalCount: 250,
        expanded: true,
        children: [
          { id: 'oran-interface', name: 'Interface Tests', count: 100 },
          { id: 'oran-performance', name: 'Performance', count: 80 },
          { id: 'oran-security', name: 'Security', count: 70 }
        ]
      },
      {
        id: 'nb-iot',
        name: 'NB-IoT',
        totalCount: 180,
        expanded: true,
        children: [
          { id: 'nb-iot-functional', name: 'Functional', count: 90 },
          { id: 'nb-iot-coverage', name: 'Coverage', count: 50 },
          { id: 'nb-iot-power', name: 'Power Management', count: 40 }
        ]
      },
      {
        id: 'ntn',
        name: 'NTN',
        totalCount: 120,
        expanded: true,
        children: [
          { id: 'ntn-satellite', name: 'Satellite', count: 60 },
          { id: 'ntn-handover', name: 'Handover', count: 40 },
          { id: 'ntn-latency', name: 'Latency', count: 20 }
        ]
      },
      {
        id: 'v2x',
        name: 'V2X',
        totalCount: 200,
        expanded: true,
        children: [
          { id: 'v2x-safety', name: 'Safety', count: 80 },
          { id: 'v2x-mobility', name: 'Mobility', count: 70 },
          { id: 'v2x-communication', name: 'Communication', count: 50 }
        ]
      },
      {
        id: 'other',
        name: 'Other',
        totalCount: 100,
        expanded: true,
        children: [
          { id: 'other-tests', name: 'Other', count: 100 }
        ]
      }
    ]);

    const addLog = (level, message) => {
      const timestamp = new Date().toLocaleString();
      setLogs(prev => [...prev, { timestamp, level, message }]);
    };

    const handleRunTest = async (testId) => {
      setIsRunning(true);
      addLog('INFO', `Starting test execution: ${testId}`);
      
      try {
        // Use existing API endpoint for test execution
        const response = await fetch('/api/test-execution/simple/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            testCaseId: testId,
            userId: 'system'
          })
        });
        
        if (!response.ok) {
          throw new Error(`Test execution failed: ${response.statusText}`);
        }
        
        const result = await response.json();
        addLog('INFO', `Test execution started: ${testId}`);
        
        // Update test case status
        setTestCases(prev => prev.map(tc => 
          tc.id === testId ? { ...tc, status: 'Running' } : tc
        ));
        
        // Monitor test execution status
        monitorTestExecution(testId);
        
      } catch (error) {
        console.error('Error running test:', error);
        addLog('ERROR', `Failed to run test ${testId}: ${error.message}`);
        setIsRunning(false);
        setTestCases(prev => prev.map(tc => 
          tc.id === testId ? { ...tc, status: 'Failed' } : tc
        ));
      }
    };

    // Monitor test execution using existing WebSocket/Streaming
    const monitorTestExecution = async (testId) => {
      try {
        // Connect to existing 5GLabX backend WebSocket for real-time updates
        const wsUrl = process.env.NEXT_PUBLIC_5GLABX_WS_URL || 'ws://localhost:8081';
        const ws = new WebSocket(`${wsUrl}?testCaseId=${testId}`);
        
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            if (data.type === 'test_execution_progress') {
              addLog('INFO', `Test execution progress: ${data.message} (${data.progress}%)`);
              
              // Update test case status based on execution progress
              if (data.progress === 100) {
                setIsRunning(false);
                addLog('INFO', `Test execution completed: ${testId}`);
                setTestCases(prev => prev.map(tc => 
                  tc.id === testId ? { 
                    ...tc, 
                    status: 'Completed',
                    lastRun: new Date().toLocaleString(),
                    successRate: '100%',
                    duration: '2.5s'
                  } : tc
                ));
                ws.close();
              }
            } else if (data.type === 'test_execution_update') {
              addLog('INFO', `Test execution update: ${data.message}`);
            } else if (data.type === 'test_execution_acknowledged') {
              addLog('INFO', `Test execution acknowledged: ${data.message}`);
            } else if (data.type === 'test_completed') {
              setIsRunning(false);
              addLog('INFO', `Test execution completed: ${testId}`);
              setTestCases(prev => prev.map(tc => 
                tc.id === testId ? { 
                  ...tc, 
                  status: data.success ? 'Completed' : 'Failed',
                  lastRun: new Date().toLocaleString(),
                  successRate: data.success_rate || tc.successRate,
                  duration: data.duration || tc.duration
                } : tc
              ));
              ws.close();
            } else if (data.type === 'log_message') {
              addLog('INFO', data.message);
            }
          } catch (parseError) {
            console.error('Error parsing test execution message:', parseError);
          }
        };
        
        ws.onopen = () => {
          addLog('INFO', `Connected to test execution monitoring for ${testId}`);
          // Send test execution start message
          ws.send(JSON.stringify({
            type: 'test_execution_start',
            testCaseId: testId,
            executionId: `exec-${Date.now()}`,
            timestamp: new Date().toISOString()
          }));
        };
        
        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          addLog('ERROR', `Connection error for test ${testId}`);
          setIsRunning(false);
        };
        
        ws.onclose = () => {
          addLog('INFO', `Test execution monitoring connection closed for ${testId}`);
        };
        
      } catch (error) {
        console.error('Error monitoring test execution:', error);
        addLog('ERROR', `Failed to monitor test ${testId}: ${error.message}`);
        setIsRunning(false);
      }
    };

    const handleRunAllTests = async () => {
      setIsRunning(true);
      addLog('INFO', 'Starting batch test execution');
      
      try {
        // Use existing API endpoint for batch test execution
        const response = await fetch('/api/test-execution/batch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'start_all',
            testIds: testCases.map(tc => tc.id)
          })
        });
        
        if (!response.ok) {
          throw new Error(`Batch test execution failed: ${response.statusText}`);
        }
        
        const result = await response.json();
        addLog('INFO', 'Batch test execution started');
        
        // Update all test cases to running status
        setTestCases(prev => prev.map(tc => ({ ...tc, status: 'Running' })));
        
        // Monitor batch execution
        monitorBatchExecution();
        
      } catch (error) {
        console.error('Error running batch tests:', error);
        addLog('ERROR', `Failed to run batch tests: ${error.message}`);
        setIsRunning(false);
      }
    };

    const handleRunSelectedTests = async () => {
      const selectedTests = testCases.filter(tc => tc.selected);
      if (selectedTests.length === 0) {
        addLog('WARN', 'No tests selected for execution');
        return;
      }
      
      setIsRunning(true);
      addLog('INFO', `Starting execution of ${selectedTests.length} selected tests`);
      
      try {
        // Use existing API endpoint for selected test execution
        const response = await fetch('/api/test-execution/batch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'start_selected',
            testIds: selectedTests.map(tc => tc.id)
          })
        });
        
        if (!response.ok) {
          throw new Error(`Selected test execution failed: ${response.statusText}`);
        }
        
        const result = await response.json();
        addLog('INFO', `Started execution of ${selectedTests.length} selected tests`);
        
        // Update selected tests to running status
        setTestCases(prev => prev.map(tc => 
          tc.selected ? { ...tc, status: 'Running' } : tc
        ));
        
        // Monitor selected execution
        monitorSelectedExecution(selectedTests.map(tc => tc.id));
        
      } catch (error) {
        console.error('Error running selected tests:', error);
        addLog('ERROR', `Failed to run selected tests: ${error.message}`);
        setIsRunning(false);
      }
    };

    // Monitor batch test execution
    const monitorBatchExecution = async () => {
      try {
        const ws = new WebSocket('ws://localhost:8080/test-execution/batch');
        
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          
          if (data.type === 'batch_completed') {
            setIsRunning(false);
            addLog('INFO', 'Batch test execution completed');
            setTestCases(prev => prev.map(tc => ({ 
              ...tc, 
              status: 'Completed', 
              lastRun: new Date().toLocaleString() 
            })));
            ws.close();
          } else if (data.type === 'test_update') {
            setTestCases(prev => prev.map(tc => 
              tc.id === data.testId ? { 
                ...tc, 
                status: data.status,
                successRate: data.success_rate || tc.successRate,
                duration: data.duration || tc.duration
              } : tc
            ));
          }
        };
        
      } catch (error) {
        console.error('Error monitoring batch execution:', error);
        addLog('ERROR', `Failed to monitor batch execution: ${error.message}`);
        setIsRunning(false);
      }
    };

    // Monitor selected test execution
    const monitorSelectedExecution = async (testIds) => {
      try {
        const ws = new WebSocket(`ws://localhost:8080/test-execution/selected?ids=${testIds.join(',')}`);
        
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          
          if (data.type === 'selected_completed') {
            setIsRunning(false);
            addLog('INFO', `Completed execution of ${testIds.length} selected tests`);
            setTestCases(prev => prev.map(tc => 
              testIds.includes(tc.id) ? { 
                ...tc, 
                status: 'Completed', 
                lastRun: new Date().toLocaleString() 
              } : tc
            ));
            ws.close();
          } else if (data.type === 'test_update') {
            setTestCases(prev => prev.map(tc => 
              tc.id === data.testId ? { 
                ...tc, 
                status: data.status,
                successRate: data.success_rate || tc.successRate,
                duration: data.duration || tc.duration
              } : tc
            ));
          }
        };
        
      } catch (error) {
        console.error('Error monitoring selected execution:', error);
        addLog('ERROR', `Failed to monitor selected execution: ${error.message}`);
        setIsRunning(false);
      }
    };

    const handleSelectAll = () => {
      const allSelected = testCases.every(tc => tc.selected);
      setTestCases(prev => prev.map(tc => ({ ...tc, selected: !allSelected })));
    };

    const handleDeleteSelected = () => {
      const selectedTests = testCases.filter(tc => tc.selected);
      if (selectedTests.length === 0) {
        addLog('WARN', 'No tests selected for deletion');
        return;
      }
      
      setTestCases(prev => prev.filter(tc => !tc.selected));
      addLog('INFO', `Deleted ${selectedTests.length} selected tests`);
    };

    // Fetch test execution data from existing Supabase tables
    const fetchTestExecutionData = async (testId) => {
      try {
        // Fetch from existing test_case_executions table
        const { data: executions, error: execError } = await supabase
          .from('test_case_executions')
          .select('*')
          .eq('test_case_id', testId)
          .order('created_at', { ascending: false })
          .limit(1);
        
        if (execError) throw execError;
        
        // Fetch decoded messages from existing decoded_messages table
        const { data: messages, error: msgError } = await supabase
          .from('decoded_messages')
          .select('*')
          .eq('test_case_id', testId)
          .order('timestamp', { ascending: false });
        
        if (msgError) throw msgError;
        
        addLog('INFO', `Fetched execution data for test ${testId}`);
        return { executions, messages };
        
      } catch (error) {
        console.error('Error fetching test execution data:', error);
        addLog('ERROR', `Failed to fetch execution data for test ${testId}: ${error.message}`);
        return null;
      }
    };

    // Connect to 5GLabX backend for real-time log analysis
    const connectTo5GLabX = () => {
      try {
        // Connect to the proper 5GLabX WebSocket server
        const wsUrl = process.env.NEXT_PUBLIC_5GLABX_WS_URL || 'ws://localhost:8081';
        const ws = new WebSocket(wsUrl);
        
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            if (data.type === 'log_analysis') {
              // Add log analysis results to the automation log
              addLog('INFO', `5GLabX Analysis: ${data.analysis}`);
            } else if (data.type === 'decoded_message') {
              // Add decoded message to logs
              addLog('INFO', `Decoded: ${data.message}`);
            } else if (data.type === 'test_execution_update') {
              // Handle test execution updates
              addLog('INFO', `Test Execution Update: ${data.message}`);
            }
          } catch (parseError) {
            console.error('Error parsing WebSocket message:', parseError);
          }
        };
        
        ws.onopen = () => {
          addLog('INFO', 'Connected to 5GLabX backend for log analysis');
        };
        
        ws.onerror = (error) => {
          console.error('5GLabX WebSocket error:', error);
          addLog('ERROR', 'Failed to connect to 5GLabX backend - WebSocket server may not be running');
        };
        
        ws.onclose = () => {
          addLog('WARNING', '5GLabX WebSocket connection closed');
        };
        
        return ws;
      } catch (error) {
        console.error('Error connecting to 5GLabX:', error);
        addLog('ERROR', `Failed to connect to 5GLabX: ${error.message}`);
        return null;
      }
    };

    const handleScroll = (e) => {
      const scrollTop = e.target.scrollTop;
      const scrollHeight = e.target.scrollHeight;
      const clientHeight = e.target.clientHeight;
      const scrollLeft = e.target.scrollLeft;
      const scrollWidth = e.target.scrollWidth;
      const clientWidth = e.target.clientWidth;
      
      const verticalScrollPercent = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);
      const horizontalScrollPercent = Math.round((scrollLeft / (scrollWidth - clientWidth)) * 100);
      
      setScrollPosition(verticalScrollPercent);
      setHorizontalScrollPosition(horizontalScrollPercent);
    };

    const toggleTestSelection = (testId) => {
      setTestCases(prev => prev.map(tc => 
        tc.id === testId ? { ...tc, selected: !tc.selected } : tc
      ));
    };

    const toggleTestSuite = (suiteId) => {
      setTestSuites(prev => prev.map(suite => 
        suite.id === suiteId ? { ...suite, expanded: !suite.expanded } : suite
      ));
    };

    const getStatusColor = (status) => {
      switch (status) {
        case 'Completed': return 'bg-green-100 text-green-800';
        case 'Running': return 'bg-blue-100 text-blue-800';
        case 'Failed': return 'bg-red-100 text-red-800';
        case 'Not Started': return 'bg-gray-100 text-gray-800';
        case 'Paused': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const getPriorityColor = (priority) => {
      switch (priority) {
        case 'High': return 'bg-red-100 text-red-800';
        case 'Medium': return 'bg-yellow-100 text-yellow-800';
        case 'Low': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const handleStartTest = (testId) => {
      setTestCases(prev => prev.map(tc => 
        tc.id === testId ? { ...tc, status: 'Running' } : tc
      ));
      addLog('INFO', `Starting test: ${testId}`);
    };

    const handleStopTest = (testId) => {
      setTestCases(prev => prev.map(tc => 
        tc.id === testId ? { ...tc, status: 'Failed' } : tc
      ));
      addLog('INFO', `Stopped test: ${testId}`);
    };

    const handlePauseTest = (testId) => {
      setTestCases(prev => prev.map(tc => 
        tc.id === testId ? { ...tc, status: 'Paused' } : tc
      ));
      addLog('INFO', `Paused test: ${testId}`);
    };

    const getLogLevelColor = (level) => {
      switch (level) {
        case 'ERROR': return 'bg-red-500 text-white';
        case 'WARN': return 'bg-yellow-500 text-white';
        case 'INFO': return 'bg-blue-500 text-white';
        case 'DEBUG': return 'bg-gray-500 text-white';
        default: return 'bg-gray-500 text-white';
      }
    };

    return React.createElement('div', {
      className: 'h-screen flex bg-gray-100', // Changed to light gray background
      'data-name': 'professional-testing-platform'
    }, [
      // Left Sidebar
      React.createElement('div', {
        key: 'sidebar',
        className: 'w-80 bg-gray-800 text-white flex flex-col'
      }, [
        // Header
        React.createElement('div', {
          key: 'header',
          className: 'bg-blue-600 p-4'
        }, [
          React.createElement('h1', {
            key: 'title',
            className: 'text-lg font-bold text-white'
          }, 'RAN-Core Automation Test Manager')
        ]),

        // RAN Components Section
        React.createElement('div', {
          key: 'components',
          className: 'p-4 border-b border-gray-700'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-sm font-semibold text-gray-300 mb-3'
          }, 'RAN Components'),
          React.createElement('div', {
            key: 'list',
            className: 'space-y-2'
          }, ranComponents.map(component => 
            React.createElement('div', {
              key: component.id,
              className: 'flex items-center justify-between p-2 hover:bg-gray-700 rounded'
            }, [
              React.createElement('span', {
                key: 'name',
                className: 'text-sm'
              }, component.name),
              React.createElement('div', {
                key: 'controls',
                className: 'flex items-center space-x-1'
              }, [
                React.createElement('button', {
                  key: 'play',
                  className: 'w-6 h-6 bg-green-600 rounded flex items-center justify-center hover:bg-green-700',
                  title: 'Start'
                }, React.createElement('i', { 'data-lucide': 'play', className: 'w-3 h-3' })),
                React.createElement('button', {
                  key: 'stop',
                  className: 'w-6 h-6 bg-red-600 rounded flex items-center justify-center hover:bg-red-700',
                  title: 'Stop'
                }, React.createElement('i', { 'data-lucide': 'square', className: 'w-3 h-3' })),
                React.createElement('button', {
                  key: 'settings',
                  className: 'w-6 h-6 bg-gray-600 rounded flex items-center justify-center hover:bg-gray-700',
                  title: 'Settings'
                }, React.createElement('i', { 'data-lucide': 'settings', className: 'w-3 h-3' }))
              ])
            ])
          ))
        ]),

        // Test Suites Section
        React.createElement('div', {
          key: 'suites',
          className: 'p-4 flex-1'
        }, [
          React.createElement('div', {
            key: 'header',
            className: 'flex items-center justify-between mb-3'
          }, [
            React.createElement('h3', {
              key: 'title',
              className: 'text-sm font-semibold text-gray-300'
            }, 'Test Suites'),
            React.createElement('button', {
              key: 'add',
              className: 'bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700'
            }, '+ Add Test Suite')
          ]),
          React.createElement('div', {
            key: 'list',
            className: 'space-y-1'
          }, testSuites.map(suite => 
            React.createElement('div', {
              key: suite.id,
              className: 'space-y-1'
            }, [
              React.createElement('div', {
                key: 'header',
                className: 'flex items-center justify-between p-2 hover:bg-gray-700 rounded cursor-pointer',
                onClick: () => toggleTestSuite(suite.id)
              }, [
                React.createElement('div', {
                  key: 'left',
                  className: 'flex items-center space-x-2'
                }, [
                  React.createElement('i', {
                    key: 'icon',
                    'data-lucide': suite.expanded ? 'chevron-down' : 'chevron-right',
                    className: 'w-4 h-4'
                  }),
                  React.createElement('span', {
                    key: 'name',
                    className: 'text-sm'
                  }, suite.name)
                ]),
                React.createElement('div', {
                  key: 'right',
                  className: 'flex items-center space-x-2'
                }, [
                  React.createElement('span', {
                    key: 'total-count',
                    className: 'bg-blue-600 text-white text-xs px-2 py-1 rounded-full'
                  }, `[${suite.totalCount}]`),
                  React.createElement('span', {
                    key: 'total-display',
                    className: 'text-xs text-gray-400'
                  }, `(${suite.totalCount})`)
                ])
              ]),
              suite.expanded && React.createElement('div', {
                key: 'children',
                className: 'ml-4 space-y-1'
              }, suite.children.map(child => 
                React.createElement('div', {
                  key: child.id,
                  className: 'flex items-center justify-between p-2 hover:bg-gray-700 rounded cursor-pointer',
                  onClick: () => setSelectedTestSuite(child.id)
                }, [
                  React.createElement('div', {
                    key: 'left',
                    className: 'flex items-center space-x-2'
                  }, [
                    React.createElement('span', {
                      key: 'tree',
                      className: 'text-gray-500 text-xs'
                    }, '├──'),
                    React.createElement('span', {
                      key: 'name',
                      className: 'text-sm text-gray-300'
                    }, child.name)
                  ]),
                  React.createElement('span', {
                    key: 'count',
                    className: 'bg-blue-600 text-white text-xs px-2 py-1 rounded-full'
                  }, `[${child.count}]`)
                ])
              ))
            ])
          ))
        ])
      ]),

      // Main Content Area - Fixed background color
      React.createElement('div', {
        key: 'main',
        className: 'flex-1 flex flex-col bg-gray-100' // Light gray background
      }, [
        // Test Cases Management Section - White panel on gray background
        React.createElement('div', {
          key: 'test-cases',
          className: 'bg-white border-b border-gray-200 p-4 m-4 rounded shadow-sm' // White panel with margin and shadow
        }, [
          React.createElement('div', {
            key: 'header',
            className: 'flex items-center justify-between mb-4'
          }, [
            React.createElement('h2', {
              key: 'title',
              className: 'text-lg font-semibold text-gray-900'
            }, 'Test Cases Management'),
            React.createElement('div', {
              key: 'actions',
              className: 'flex items-center space-x-2'
            }, [
              React.createElement('button', {
                key: 'toggle-visibility',
                className: `px-3 py-2 rounded text-sm flex items-center space-x-1 ${isPanelVisible ? 'bg-gray-600 text-white hover:bg-gray-700' : 'bg-green-600 text-white hover:bg-green-700'}`,
                onClick: () => setIsPanelVisible(!isPanelVisible)
              }, [
                React.createElement('i', { key: 'icon', 'data-lucide': isPanelVisible ? 'eye-off' : 'eye', className: 'w-4 h-4' }),
                React.createElement('span', { key: 'text' }, isPanelVisible ? 'Hide Panel' : 'Show Panel')
              ]),
              React.createElement('button', {
                key: 'add',
                className: 'bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700'
              }, '+ Add Test Case'),
              React.createElement('button', {
                key: 'run-selected',
                className: 'bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 flex items-center space-x-1',
                onClick: handleRunSelectedTests,
                disabled: isRunning
              }, [
                React.createElement('i', { key: 'icon', 'data-lucide': 'play', className: 'w-4 h-4' }),
                React.createElement('span', { key: 'text' }, '▶ Run Selected')
              ]),
              React.createElement('button', {
                key: 'run-all',
                className: 'bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 flex items-center space-x-1',
                onClick: handleRunAllTests,
                disabled: isRunning
              }, [
                React.createElement('i', { key: 'icon', 'data-lucide': 'play', className: 'w-4 h-4' }),
                React.createElement('span', { key: 'text' }, '▶ Run All Tests')
              ]),
              React.createElement('button', {
                key: 'stop-all',
                className: 'bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 flex items-center space-x-1',
                onClick: () => {
                  setTestCases(prev => prev.map(tc => ({ ...tc, status: 'Not Started' })));
                  setIsRunning(false);
                  addLog('INFO', 'All tests stopped');
                },
                disabled: !isRunning
              }, [
                React.createElement('i', { key: 'icon', 'data-lucide': 'square', className: 'w-4 h-4' }),
                React.createElement('span', { key: 'text' }, '⏹ Stop All')
              ]),
              React.createElement('button', {
                key: 'delete',
                className: 'bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700',
                onClick: handleDeleteSelected
              }, 'Delete Selected')
            ])
          ]),

          // Scroll Indicator
          React.createElement('div', {
            key: 'scroll-info',
            className: 'text-xs text-gray-500 mb-2 text-center'
          }, [
            React.createElement('div', {
              key: 'count',
              className: 'mb-1'
            }, `Showing ${testCases.length} test cases - Scroll to view all`),
            React.createElement('div', {
              key: 'progress',
              className: 'w-full bg-gray-200 rounded-full h-1'
            }, React.createElement('div', {
              className: 'bg-blue-600 h-1 rounded-full transition-all duration-300',
              style: { width: `${scrollPosition}%` }
            }))
          ]),

          // Test Cases Table with Enhanced Scroll and Visibility Controls
          isPanelVisible && React.createElement('div', {
            key: 'table-container',
            className: 'relative border border-gray-200 rounded bg-white shadow-inner'
          }, [
            // Scroll Controls Header
            React.createElement('div', {
              key: 'scroll-controls',
              className: 'flex items-center justify-between p-2 bg-gray-50 border-b border-gray-200'
            }, [
              React.createElement('div', {
                key: 'scroll-info',
                className: 'flex items-center space-x-4 text-sm text-gray-600'
              }, [
                React.createElement('span', { key: 'count' }, `${testCases.length} test cases`),
                React.createElement('span', { key: 'scroll-hint' }, 'Use scroll bars to navigate ↑↓ ←→'),
                React.createElement('div', {
                  key: 'scroll-indicators',
                  className: 'flex items-center space-x-2 text-xs'
                }, [
                  React.createElement('span', { key: 'vertical-indicator' }, `↑↓ ${scrollPosition}%`),
                  React.createElement('span', { key: 'horizontal-indicator' }, `←→ ${horizontalScrollPosition}%`)
                ])
              ]),
              React.createElement('div', {
                key: 'scroll-buttons',
                className: 'flex items-center space-x-2'
              }, [
                // Vertical Scroll Controls
                React.createElement('div', {
                  key: 'vertical-controls',
                  className: 'flex items-center space-x-1'
                }, [
                  React.createElement('button', {
                    key: 'scroll-top',
                    className: 'px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200',
                    onClick: () => {
                      const tableContainer = document.querySelector('.test-cases-table');
                      if (tableContainer) tableContainer.scrollTop = 0;
                    }
                  }, '↑ Top'),
                  React.createElement('button', {
                    key: 'scroll-bottom',
                    className: 'px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200',
                    onClick: () => {
                      const tableContainer = document.querySelector('.test-cases-table');
                      if (tableContainer) tableContainer.scrollTop = tableContainer.scrollHeight;
                    }
                  }, '↓ Bottom')
                ]),
                
                // Horizontal Scroll Controls
                React.createElement('div', {
                  key: 'horizontal-controls',
                  className: 'flex items-center space-x-1'
                }, [
                  React.createElement('button', {
                    key: 'scroll-left',
                    className: 'px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200',
                    onClick: () => {
                      const tableContainer = document.querySelector('.test-cases-table');
                      if (tableContainer) tableContainer.scrollLeft -= 200;
                    }
                  }, '← Left'),
                  React.createElement('button', {
                    key: 'scroll-right',
                    className: 'px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200',
                    onClick: () => {
                      const tableContainer = document.querySelector('.test-cases-table');
                      if (tableContainer) tableContainer.scrollLeft += 200;
                    }
                  }, 'Right →')
                ])
              ])
            ]),
            
            // Scrollable Table Container
            React.createElement('div', {
              key: 'table',
              className: 'test-cases-table overflow-x-auto overflow-y-auto max-h-96 border-0 bg-white',
              style: {
                scrollbarWidth: 'thin',
                scrollbarColor: '#9CA3AF #F3F4F6'
              },
              onScroll: handleScroll
            }, [
            React.createElement('table', {
              key: 'table',
              className: 'w-full border-collapse'
            }, [
              React.createElement('thead', {
                key: 'head'
              }, [
                React.createElement('tr', {
                  key: 'row',
                  className: 'bg-gray-50'
                }, [
                  React.createElement('th', { 
                    key: 'select', 
                    className: 'px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase sticky top-0 bg-gray-50' 
                  }, React.createElement('input', {
                    type: 'checkbox',
                    checked: testCases.length > 0 && testCases.every(tc => tc.selected),
                    onChange: handleSelectAll,
                    className: 'form-checkbox'
                  })),
                  React.createElement('th', { key: 'name', className: 'px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase sticky top-0 bg-gray-50' }, 'Name'),
                  React.createElement('th', { key: 'component', className: 'px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase sticky top-0 bg-gray-50' }, 'Component'),
                  React.createElement('th', { key: 'status', className: 'px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase sticky top-0 bg-gray-50' }, 'Status'),
                  React.createElement('th', { key: 'iterations', className: 'px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase sticky top-0 bg-gray-50' }, 'Iterations'),
                  React.createElement('th', { key: 'success', className: 'px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase sticky top-0 bg-gray-50' }, 'Success Rate'),
                  React.createElement('th', { key: 'last-run', className: 'px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase sticky top-0 bg-gray-50' }, 'Last Run'),
                  React.createElement('th', { key: 'duration', className: 'px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase sticky top-0 bg-gray-50' }, 'Duration'),
                  React.createElement('th', { key: 'priority', className: 'px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase sticky top-0 bg-gray-50' }, 'Priority'),
                  React.createElement('th', { key: 'controls', className: 'px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase sticky top-0 bg-gray-50' }, 'Controls'),
                  React.createElement('th', { key: 'actions', className: 'px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase sticky top-0 bg-gray-50' }, 'Actions')
                ])
              ]),
              React.createElement('tbody', {
                key: 'body',
                className: 'bg-white divide-y divide-gray-200'
              }, testCases.map(testCase => 
                React.createElement('tr', {
                  key: testCase.id,
                  className: `hover:bg-blue-50 transition-colors duration-150 ${testCase.selected ? 'bg-blue-100' : 'bg-white'}`
                }, [
                  React.createElement('td', {
                    key: 'select',
                    className: 'px-4 py-2'
                  }, React.createElement('input', {
                    type: 'checkbox',
                    checked: testCase.selected,
                    onChange: () => toggleTestSelection(testCase.id),
                    className: 'form-checkbox'
                  })),
                  React.createElement('td', {
                    key: 'name',
                    className: 'px-4 py-2 text-sm font-medium text-gray-900'
                  }, testCase.name),
                  React.createElement('td', {
                    key: 'component',
                    className: 'px-4 py-2 text-sm text-gray-500'
                  }, testCase.component),
                  React.createElement('td', {
                    key: 'status',
                    className: 'px-4 py-2'
                  }, React.createElement('span', {
                    className: `px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(testCase.status)}`
                  }, testCase.status)),
                  React.createElement('td', {
                    key: 'iterations',
                    className: 'px-4 py-2 text-sm text-gray-500'
                  }, testCase.iterations),
                  React.createElement('td', {
                    key: 'success',
                    className: 'px-4 py-2 text-sm text-gray-500'
                  }, testCase.successRate),
                  React.createElement('td', {
                    key: 'last-run',
                    className: 'px-4 py-2 text-sm text-gray-500'
                  }, testCase.lastRun),
                  React.createElement('td', {
                    key: 'duration',
                    className: 'px-4 py-2 text-sm text-gray-500'
                  }, testCase.duration),
                  React.createElement('td', {
                    key: 'priority',
                    className: 'px-4 py-2'
                  }, React.createElement('span', {
                    className: `px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(testCase.priority)}`
                  }, testCase.priority)),
                  React.createElement('td', {
                    key: 'controls',
                    className: 'px-4 py-2'
                  }, React.createElement('div', {
                    className: 'flex items-center space-x-1'
                  }, [
                    React.createElement('button', {
                      key: 'start',
                      className: 'bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 flex items-center space-x-1',
                      onClick: () => handleStartTest(testCase.id),
                      disabled: testCase.status === 'Running'
                    }, [
                      React.createElement('i', { key: 'icon', 'data-lucide': 'play', className: 'w-3 h-3' }),
                      React.createElement('span', { key: 'text' }, 'Run')
                    ]),
                    React.createElement('button', {
                      key: 'stop',
                      className: 'bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 flex items-center space-x-1',
                      onClick: () => handleStopTest(testCase.id),
                      disabled: testCase.status === 'Not Started'
                    }, [
                      React.createElement('i', { key: 'icon', 'data-lucide': 'square', className: 'w-3 h-3' }),
                      React.createElement('span', { key: 'text' }, 'Stop')
                    ]),
                    React.createElement('button', {
                      key: 'pause',
                      className: 'bg-yellow-600 text-white px-2 py-1 rounded text-xs hover:bg-yellow-700 flex items-center space-x-1',
                      onClick: () => handlePauseTest(testCase.id),
                      disabled: testCase.status !== 'Running'
                    }, [
                      React.createElement('i', { key: 'icon', 'data-lucide': 'pause', className: 'w-3 h-3' }),
                      React.createElement('span', { key: 'text' }, 'Pause')
                    ])
                  ])),
                  React.createElement('td', {
                    key: 'actions',
                    className: 'px-4 py-2'
                  }, React.createElement('div', {
                    className: 'flex items-center space-x-2'
                  }, [
                    React.createElement('button', {
                      key: 'run',
                      className: 'bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 flex items-center space-x-1',
                      onClick: () => handleRunTest(testCase.id),
                      disabled: isRunning
                    }, [
                      React.createElement('i', { key: 'icon', 'data-lucide': 'play', className: 'w-3 h-3' }),
                      React.createElement('span', { key: 'text' }, 'Execute')
                    ]),
                    React.createElement('button', {
                      key: 'view',
                      className: 'bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700 flex items-center space-x-1'
                    }, [
                      React.createElement('i', { key: 'icon', 'data-lucide': 'eye', className: 'w-3 h-3' }),
                      React.createElement('span', { key: 'text' }, 'View')
                    ])
                  ]))
                ])
              ))
            ])
          ])
        ]),

        // Automation Log Section - Positioned below Test Cases Management
        React.createElement('div', {
          key: 'logs',
          className: 'bg-white p-4 m-4 rounded shadow-sm' // White panel with margin and shadow
        }, [
          React.createElement('div', {
            key: 'header',
            className: 'flex items-center justify-between mb-4'
          }, [
            React.createElement('h2', {
              key: 'title',
              className: 'text-lg font-semibold text-gray-900'
            }, 'Automation Log'),
            React.createElement('div', {
              key: 'actions',
              className: 'flex items-center space-x-2'
            }, [
              React.createElement('button', {
                key: 'clear',
                className: 'bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700 flex items-center space-x-1'
              }, [
                React.createElement('i', { key: 'icon', 'data-lucide': 'square', className: 'w-4 h-4' }),
                React.createElement('span', { key: 'text' }, 'Clear')
              ]),
              React.createElement('button', {
                key: 'download',
                className: 'bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 flex items-center space-x-1'
              }, [
                React.createElement('i', { key: 'icon', 'data-lucide': 'download', className: 'w-4 h-4' }),
                React.createElement('span', { key: 'text' }, 'Download')
              ])
            ])
          ]),

          // Log Display - Dark gray background showing ongoing logs
          React.createElement('div', {
            key: 'log-display',
            className: 'bg-gray-800 text-white p-4 rounded font-mono text-sm h-64 overflow-y-auto border border-gray-600' // Dark gray background
          }, logs.map((log, index) => 
            React.createElement('div', {
              key: index,
              className: 'mb-1 flex items-start'
            }, [
              React.createElement('span', {
                key: 'timestamp',
                className: 'text-blue-300 font-bold'
              }, `[${log.timestamp}]`),
              React.createElement('span', {
                key: 'message',
                className: 'text-gray-100 ml-2'
              }, log.message)
            ])
          ))
        ])
      ])
      ])
    ]);

  } catch (error) {
    console.error('ProfessionalTestManager error:', error);
    return React.createElement('div', {
      className: 'text-red-600 p-4'
    }, 'Professional Test Manager failed to load');
  }
};

export default ProfessionalTestManager;

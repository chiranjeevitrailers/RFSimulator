import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, Square, RotateCcw, Settings, Calendar,
  Search, Filter, Eye, Download, BarChart3, TrendingUp,
  CheckCircle, XCircle, Clock, Activity, FileText, Share2,
  Lock, Crown, Zap, AlertTriangle
} from 'lucide-react';
import SubscriptionGuard from './SubscriptionGuard';
import UpgradePrompt from './UpgradePrompt';
import AccessRestrictions from './AccessRestrictions';
import AccessRestrictionGuard from './AccessRestrictionGuard';
import { 
  hasTestCaseAccess, 
  hasFeatureAccess, 
  getTestCaseLimit,
  hasReachedTestCaseLimit,
  needsUpgrade,
  ACCESS_LEVELS,
  FEATURES
} from '../../utils/accessControl';
import { checkAccess } from '../../utils/accessRestrictions';

const TestManagementTabWithAccess = ({ user }) => {
  const [selectedTests, setSelectedTests] = useState([]);
  const [activeTests, setActiveTests] = useState([]);
  const [testQueue, setTestQueue] = useState([]);
  const [recentResults, setRecentResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProtocol, setSelectedProtocol] = useState('all');
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [upgradeTarget, setUpgradeTarget] = useState(null);

  // Get user's current tier and access level
  const userTier = user?.tier || ACCESS_LEVELS.FREE;
  const userAccessConfig = getUserAccessConfig(userTier);
  const testCaseLimit = getTestCaseLimit(userTier);

  // Test case categories data with access control
  const testCategories = {
    '5G NR': {
      count: 400,
      accessLevel: ACCESS_LEVELS.PRO,
      subcategories: {
        'Initial Access': { count: 50, accessLevel: ACCESS_LEVELS.PRO },
        'Handover': { count: 50, accessLevel: ACCESS_LEVELS.PRO },
        'PDU Session': { count: 50, accessLevel: ACCESS_LEVELS.PRO },
        'Mobility': { count: 50, accessLevel: ACCESS_LEVELS.PRO },
        'Security': { count: 50, accessLevel: ACCESS_LEVELS.PRO },
        'Measurement': { count: 50, accessLevel: ACCESS_LEVELS.PRO },
        'Power Control': { count: 50, accessLevel: ACCESS_LEVELS.PRO },
        'Scheduling': { count: 50, accessLevel: ACCESS_LEVELS.PRO }
      }
    },
    'NSA': {
      count: 120,
      accessLevel: ACCESS_LEVELS.PRO,
      subcategories: {
        'EN-DC': { count: 50, accessLevel: ACCESS_LEVELS.PRO },
        'NE-DC': { count: 15, accessLevel: ACCESS_LEVELS.PRO },
        'NGEN-DC': { count: 5, accessLevel: ACCESS_LEVELS.PRO },
        'Multiple Split Bearer': { count: 40, accessLevel: ACCESS_LEVELS.PRO },
        'NSA PDU Session': { count: 10, accessLevel: ACCESS_LEVELS.PRO }
      }
    },
    'VoLTE/VoNR/IMS': {
      count: 160,
      accessLevel: ACCESS_LEVELS.PRO,
      subcategories: {
        'VoLTE Call Setup': { count: 20, accessLevel: ACCESS_LEVELS.PRO },
        'VoLTE Call Release': { count: 15, accessLevel: ACCESS_LEVELS.PRO },
        'VoLTE Call Handover': { count: 25, accessLevel: ACCESS_LEVELS.PRO },
        'VoLTE Emergency Call': { count: 10, accessLevel: ACCESS_LEVELS.PRO },
        'VoNR Call Setup': { count: 20, accessLevel: ACCESS_LEVELS.PRO },
        'VoNR Call Release': { count: 15, accessLevel: ACCESS_LEVELS.PRO },
        'VoNR Call Handover': { count: 25, accessLevel: ACCESS_LEVELS.PRO },
        'VoNR Emergency Call': { count: 10, accessLevel: ACCESS_LEVELS.PRO },
        'IMS Conference Setup': { count: 15, accessLevel: ACCESS_LEVELS.PRO },
        'IMS Conference Management': { count: 20, accessLevel: ACCESS_LEVELS.PRO },
        'IMS Conference Release': { count: 10, accessLevel: ACCESS_LEVELS.PRO }
      }
    },
    'LTE': {
      count: 300,
      accessLevel: ACCESS_LEVELS.PRO,
      subcategories: {
        'Initial Access': { count: 50, accessLevel: ACCESS_LEVELS.PRO },
        'Handover': { count: 50, accessLevel: ACCESS_LEVELS.PRO },
        'Bearer Management': { count: 50, accessLevel: ACCESS_LEVELS.PRO },
        'Mobility': { count: 50, accessLevel: ACCESS_LEVELS.PRO },
        'Security': { count: 50, accessLevel: ACCESS_LEVELS.PRO },
        'Measurement': { count: 50, accessLevel: ACCESS_LEVELS.PRO },
        'Power Control': { count: 50, accessLevel: ACCESS_LEVELS.PRO },
        'Scheduling': { count: 50, accessLevel: ACCESS_LEVELS.PRO }
      }
    },
    'O-RAN': {
      count: 30,
      accessLevel: ACCESS_LEVELS.PRO,
      subcategories: {
        'E2 Interface': { count: 15, accessLevel: ACCESS_LEVELS.PRO },
        'A1 Interface': { count: 10, accessLevel: ACCESS_LEVELS.PRO },
        'O1 Interface': { count: 5, accessLevel: ACCESS_LEVELS.PRO }
      }
    },
    'V2X': {
      count: 20,
      accessLevel: ACCESS_LEVELS.PRO,
      subcategories: {
        'PC5 Interface': { count: 15, accessLevel: ACCESS_LEVELS.PRO },
        'Uu Interface': { count: 5, accessLevel: ACCESS_LEVELS.PRO }
      }
    },
    'NTN': {
      count: 20,
      accessLevel: ACCESS_LEVELS.PRO,
      subcategories: {
        'Initial Access': { count: 15, accessLevel: ACCESS_LEVELS.PRO },
        'Handover': { count: 5, accessLevel: ACCESS_LEVELS.PRO }
      }
    },
    'NB-IoT': {
      count: 20,
      accessLevel: ACCESS_LEVELS.PRO,
      subcategories: {
        'Initial Access': { count: 15, accessLevel: ACCESS_LEVELS.PRO },
        'Data Transmission': { count: 5, accessLevel: ACCESS_LEVELS.PRO }
      }
    }
  };

  // Free tier test cases
  const freeTestCases = [
    { id: '5G-NR-Initial-Access-1', name: '5G NR Initial Access - Basic', category: '5G NR' },
    { id: 'LTE-Attach-Procedure-1', name: 'LTE Attach Procedure - Basic', category: 'LTE' },
    { id: 'IMS-SIP-Registration-1', name: 'IMS SIP Registration - Basic', category: 'IMS' }
  ];

  // Sample active tests data
  const sampleActiveTests = [
    {
      id: 1,
      name: '5G NR Random Access - Test Case 1',
      status: 'Running',
      progress: 65,
      duration: '2m30s',
      category: '5G NR'
    },
    {
      id: 2,
      name: 'LTE Attach Procedure - Test Case 2',
      status: 'Running',
      progress: 45,
      duration: '1m15s',
      category: 'LTE'
    },
    {
      id: 3,
      name: 'IMS SIP Registration - Test Case 3',
      status: 'Running',
      progress: 25,
      duration: '0m45s',
      category: 'IMS'
    }
  ];

  // Sample test queue data
  const sampleTestQueue = [
    { id: 4, name: '5G NR Handover - Test Case 4', scheduled: '10:30 AM' },
    { id: 5, name: 'VoLTE Call Setup - Test Case 5', scheduled: '10:35 AM' },
    { id: 6, name: 'LTE Bearer Management - Test Case 6', scheduled: '10:40 AM' },
    { id: 7, name: 'O-RAN E2 Interface - Test Case 7', scheduled: '10:45 AM' },
    { id: 8, name: 'V2X PC5 Interface - Test Case 8', scheduled: '10:50 AM' }
  ];

  // Sample recent results data
  const sampleRecentResults = [
    {
      id: 1,
      name: '5G NR Random Access - Test Case 1',
      status: 'Passed',
      completed: '2 min ago',
      duration: '2m30s',
      successRate: 100,
      messages: 1247,
      compliance: 100
    },
    {
      id: 2,
      name: 'LTE Attach Procedure - Test Case 2',
      status: 'Passed',
      completed: '5 min ago',
      duration: '1m45s',
      successRate: 100,
      messages: 856,
      compliance: 100
    },
    {
      id: 3,
      name: 'IMS SIP Registration - Test Case 3',
      status: 'Failed',
      completed: '8 min ago',
      duration: '0m45s',
      successRate: 0,
      messages: 234,
      compliance: 85
    }
  ];

  useEffect(() => {
    setActiveTests(sampleActiveTests);
    setTestQueue(sampleTestQueue);
    setRecentResults(sampleRecentResults);
  }, []);

  const handleTestSelection = (testId) => {
    // Check if user has access to this test case
    if (!hasTestCaseAccess(userTier, testId)) {
      setUpgradeTarget({ type: 'testCase', id: testId });
      setShowUpgradePrompt(true);
      return;
    }

    setSelectedTests(prev => 
      prev.includes(testId) 
        ? prev.filter(id => id !== testId)
        : [...prev, testId]
    );
  };

  const handleSelectAll = () => {
    // For free tier, only select available test cases
    if (userTier === ACCESS_LEVELS.FREE) {
      setSelectedTests(freeTestCases.map(tc => tc.id));
    } else {
      // For pro/enterprise, select all visible test cases
      console.log('Select all tests');
    }
  };

  const handleSelectCategory = (category) => {
    // Check if user has access to this category
    const categoryConfig = testCategories[category];
    if (categoryConfig && categoryConfig.accessLevel !== userTier && userTier === ACCESS_LEVELS.FREE) {
      setUpgradeTarget({ type: 'category', name: category });
      setShowUpgradePrompt(true);
      return;
    }
    console.log('Select category:', category);
  };

  const handleRunSelected = async () => {
    // Check access restrictions first
    const accessCheck = await checkAccess(user, 'testExecution', {
      usageData: { testExecutions: selectedTests.length },
      testCaseId: selectedTests[0], // Check first selected test
      recentExecutions: [] // This would come from database
    });

    if (!accessCheck.allowed) {
      if (accessCheck.upgradeRequired) {
        setUpgradeTarget({ type: 'restriction', reason: accessCheck.reason, message: accessCheck.message });
        setShowUpgradePrompt(true);
      } else {
        alert(accessCheck.message);
      }
      return;
    }

    // Check if user has reached test case limit
    if (hasReachedTestCaseLimit(userTier, selectedTests.length)) {
      setUpgradeTarget({ type: 'limit', current: selectedTests.length, limit: testCaseLimit });
      setShowUpgradePrompt(true);
      return;
    }

    // Check if user has access to run tests
    if (!hasFeatureAccess(userTier, FEATURES.BASIC_ANALYSIS)) {
      setUpgradeTarget({ type: 'feature', name: 'test execution' });
      setShowUpgradePrompt(true);
      return;
    }

    console.log('Run selected tests:', selectedTests);
  };

  const handleScheduleSelected = () => {
    // Check if user has access to scheduling
    if (!hasFeatureAccess(userTier, FEATURES.ADVANCED_ANALYSIS)) {
      setUpgradeTarget({ type: 'feature', name: 'test scheduling' });
      setShowUpgradePrompt(true);
      return;
    }
    console.log('Schedule selected tests:', selectedTests);
  };

  const handleConfigureSelected = () => {
    // Check if user has access to configuration
    if (!hasFeatureAccess(userTier, FEATURES.CUSTOM_TEST_CASES)) {
      setUpgradeTarget({ type: 'feature', name: 'test configuration' });
      setShowUpgradePrompt(true);
      return;
    }
    console.log('Configure selected tests:', selectedTests);
  };

  const handleStartTest = () => {
    // Check if user has access to start tests
    if (!hasFeatureAccess(userTier, FEATURES.BASIC_ANALYSIS)) {
      setUpgradeTarget({ type: 'feature', name: 'test execution' });
      setShowUpgradePrompt(true);
      return;
    }
    console.log('Start test');
  };

  const handleExportTest = (testId) => {
    // Check if user has access to export
    if (!hasFeatureAccess(userTier, FEATURES.EXPORT)) {
      setUpgradeTarget({ type: 'feature', name: 'export functionality' });
      setShowUpgradePrompt(true);
      return;
    }
    console.log('Export test:', testId);
  };

  const handleUpgrade = (plan) => {
    console.log('Upgrade to plan:', plan);
    // Redirect to payment page or handle upgrade
  };

  const getTierIcon = (tier) => {
    switch (tier) {
      case ACCESS_LEVELS.FREE:
        return Lock;
      case ACCESS_LEVELS.PRO:
        return Crown;
      case ACCESS_LEVELS.ENTERPRISE:
        return Zap;
      default:
        return Lock;
    }
  };

  const getTierColor = (tier) => {
    switch (tier) {
      case ACCESS_LEVELS.FREE:
        return 'gray';
      case ACCESS_LEVELS.PRO:
        return 'blue';
      case ACCESS_LEVELS.ENTERPRISE:
        return 'purple';
      default:
        return 'gray';
    }
  };

  const renderTestCategory = (categoryName, categoryData) => {
    const hasAccess = categoryData.accessLevel === userTier || userTier === ACCESS_LEVELS.ENTERPRISE;
    const TierIcon = getTierIcon(categoryData.accessLevel);
    const tierColor = getTierColor(categoryData.accessLevel);

    return (
      <div key={categoryName} className="border border-gray-200 rounded-lg">
        <div className="p-3 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900">
                📁 {categoryName} ({categoryData.count} test cases)
              </span>
              {!hasAccess && (
                <TierIcon className={`w-4 h-4 text-${tierColor}-600`} />
              )}
            </div>
            {!hasAccess && (
              <span className={`text-xs px-2 py-1 rounded-full bg-${tierColor}-100 text-${tierColor}-800`}>
                {categoryData.accessLevel === ACCESS_LEVELS.PRO ? 'Pro' : 'Enterprise'}
              </span>
            )}
          </div>
        </div>
        
        <div className="p-2">
          {Object.entries(categoryData.subcategories).map(([subcategory, subData]) => {
            const subHasAccess = subData.accessLevel === userTier || userTier === ACCESS_LEVELS.ENTERPRISE;
            const SubTierIcon = getTierIcon(subData.accessLevel);
            const subTierColor = getTierColor(subData.accessLevel);

            return (
              <div key={subcategory} className="ml-4 py-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">
                    📁 {subcategory} ({subData.count} test cases)
                  </span>
                  {!subHasAccess && (
                    <div className="flex items-center space-x-1">
                      <SubTierIcon className={`w-3 h-3 text-${subTierColor}-600`} />
                      <span className={`text-xs px-1 py-0.5 rounded bg-${subTierColor}-100 text-${subTierColor}-800`}>
                        {subData.accessLevel === ACCESS_LEVELS.PRO ? 'Pro' : 'Enterprise'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Test Management</h1>
            <p className="text-gray-600 mt-1">
              Professional 5G/4G Protocol Testing with Complete Test Case Library
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {/* User Tier Indicator */}
            <div className={`flex items-center space-x-2 text-${getTierColor(userTier)}-600`}>
              {React.createElement(getTierIcon(userTier), { className: "w-5 h-5" })}
              <span className="text-sm font-medium">{userAccessConfig.name} Plan</span>
            </div>
            
            {/* Test Case Limit Indicator */}
            <div className="flex items-center space-x-2 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">
                {testCaseLimit === 'unlimited' ? 'Unlimited' : `${testCaseLimit}+`} Test Cases Available
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - 3 Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Test Case Library (40%) */}
        <div className="w-2/5 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Case Library</h2>
            
            {/* Search and Filter Controls */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search test cases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex space-x-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {Object.keys(testCategories).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                <select
                  value={selectedProtocol}
                  onChange={(e) => setSelectedProtocol(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Protocols</option>
                  <option value="5G-NR">5G-NR</option>
                  <option value="LTE">LTE</option>
                  <option value="IMS">IMS</option>
                  <option value="O-RAN">O-RAN</option>
                </select>
              </div>
            </div>
          </div>

          {/* Test Case Categories Tree */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {/* Free Tier Test Cases */}
              {userTier === ACCESS_LEVELS.FREE && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Available Test Cases (Free)</h3>
                  <div className="space-y-2">
                    {freeTestCases.map((testCase) => (
                      <div key={testCase.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedTests.includes(testCase.id)}
                            onChange={() => handleTestSelection(testCase.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-900">{testCase.name}</span>
                        </div>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Free</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* All Test Categories */}
              {Object.entries(testCategories).map(([categoryName, categoryData]) => 
                renderTestCategory(categoryName, categoryData)
              )}
            </div>
          </div>

          {/* Test Case Actions */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleSelectAll}
                className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                📋 Select All
              </button>
              <button
                onClick={handleSelectCategory}
                className="px-3 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                📋 Select Category
              </button>
              <button
                onClick={handleRunSelected}
                className="px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                ▶️ Run Selected
              </button>
              <button
                onClick={handleScheduleSelected}
                className="px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                📅 Schedule Selected
              </button>
            </div>
          </div>
        </div>

        {/* Center Panel - Test Execution & Monitoring (40%) */}
        <div className="w-2/5 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Execution & Monitoring</h2>
            
            {/* Execution Controls */}
            <div className="flex space-x-2 mb-4">
              <button
                onClick={handleStartTest}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>Start Test</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                <Square className="w-4 h-4" />
                <span>Stop</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
              <button
                onClick={handleConfigureSelected}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Configure</span>
              </button>
              <button
                onClick={handleScheduleSelected}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule</span>
              </button>
            </div>
          </div>

          {/* Active Test Executions */}
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-md font-medium text-gray-900 mb-3">
              Currently Running Tests ({activeTests.length} active)
            </h3>
            
            <div className="space-y-4">
              {activeTests.map((test) => (
                <div key={test.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{test.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      test.status === 'Running' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {test.status}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    Progress: {test.progress}% | Duration: {test.duration} | Category: {test.category}
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${test.progress}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                      <Eye className="w-3 h-3" />
                      <span>View</span>
                    </button>
                    <button className="flex items-center space-x-1 px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors">
                      <Pause className="w-3 h-3" />
                      <span>Pause</span>
                    </button>
                    <button className="flex items-center space-x-1 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
                      <Square className="w-3 h-3" />
                      <span>Stop</span>
                    </button>
                    <button
                      onClick={() => handleExportTest(test.id)}
                      className="flex items-center space-x-1 px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      <span>Export</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Test Queue */}
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-900 mb-3">
                Queued Tests ({testQueue.length} pending)
              </h3>
              
              <div className="space-y-2">
                {testQueue.map((test, index) => (
                  <div key={test.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-900">{index + 1}. {test.name}</span>
                      <div className="text-xs text-gray-600">Scheduled: {test.scheduled}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time Test Metrics */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <h3 className="text-md font-medium text-gray-900 mb-3">Live Test Performance</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">3</div>
                <div className="text-xs text-gray-600">Active Tests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">12</div>
                <div className="text-xs text-gray-600">Passed Tests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">1</div>
                <div className="text-xs text-gray-600">Failed Tests</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Results & Analytics (20%) */}
        <div className="w-1/5 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Results & Analytics</h2>
          </div>

          {/* Access Restrictions */}
          <div className="p-4 border-b border-gray-200">
            <AccessRestrictions user={user} onUpgrade={handleUpgrade} />
          </div>

          {/* Recent Test Results */}
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-md font-medium text-gray-900 mb-3">Latest Test Results</h3>
            
            <div className="space-y-3">
              {recentResults.map((result) => (
                <div key={result.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    {result.status === 'Passed' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="text-sm font-medium text-gray-900">{result.name}</span>
                  </div>
                  
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>Completed: {result.completed}</div>
                    <div>Duration: {result.duration}</div>
                    <div>Success Rate: {result.successRate}%</div>
                    <div>Messages: {result.messages}</div>
                    <div>Compliance: {result.compliance}%</div>
                  </div>
                  
                  <div className="flex space-x-1 mt-2">
                    <button className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                      📊 Report
                    </button>
                    <button
                      onClick={() => handleExportTest(result.id)}
                      className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                    >
                      📥 Export
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <h3 className="text-md font-medium text-gray-900 mb-3">Quick Actions</h3>
            
            <div className="space-y-2">
              <button className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                📊 View All Results
              </button>
              <button className="w-full px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                📈 Performance Report
              </button>
              <button className="w-full px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                📋 Compliance Report
              </button>
              <button className="w-full px-3 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                📥 Export Results
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Prompt Modal */}
      <UpgradePrompt
        isOpen={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
        onUpgrade={handleUpgrade}
        currentTier={userTier}
        feature={upgradeTarget?.name || 'this feature'}
        showPricing={true}
      />
    </div>
  );
};

export default TestManagementTabWithAccess;
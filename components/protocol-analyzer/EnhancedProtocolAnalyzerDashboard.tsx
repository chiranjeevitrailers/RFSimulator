'use client';

import React, { useState, useEffect } from 'react';
import { Activity, BarChart3, TrendingUp, Users, Wifi, Zap, Play, Pause, Square } from 'lucide-react';
import RealtimePlaybackControls from './RealtimePlaybackControls';
import LiveKPIDashboard from './LiveKPIDashboard';
import LiveLayerGrouping from './LiveLayerGrouping';
import LiveCharts from './LiveCharts';
import TimeController from './TimeController';

export default function EnhancedProtocolAnalyzerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTestCase, setSelectedTestCase] = useState<string | null>(null);
  const [simulationState, setSimulationState] = useState<any>(null);
  const [isSimulationActive, setIsSimulationActive] = useState(false);

  // Sample test cases for selection
  const testCases = [
    { id: 'tc-001', name: '5G RRC Setup Flow', description: 'Complete RRC setup procedure', duration: '2.5s', messages: 45 },
    { id: 'tc-002', name: '4G LTE Attach', description: 'LTE attach procedure', duration: '1.8s', messages: 32 },
    { id: 'tc-003', name: '5G PDU Session', description: 'PDU session establishment', duration: '3.2s', messages: 67 },
    { id: 'tc-004', name: '4G Handover', description: 'Inter-cell handover', duration: '1.5s', messages: 28 },
  ];

  const handleTestCaseSelect = (testCaseId: string) => {
    setSelectedTestCase(testCaseId);
    setIsSimulationActive(true);
  };

  const handleSimulationStateChange = (state: any) => {
    setSimulationState(state);
  };

  const handleSimulationComplete = () => {
    setIsSimulationActive(false);
    console.log('Simulation completed');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">5GLabX Protocol Analyzer</h1>
          <p className="text-gray-600">Real-time 4G & 5G protocol analysis and monitoring</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isSimulationActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          <span className="text-sm text-gray-600">
            {isSimulationActive ? 'Simulation Active' : 'System Ready'}
          </span>
        </div>
      </div>

      {/* Test Case Selection */}
      {!selectedTestCase && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Test Case</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testCases.map((testCase) => (
              <div
                key={testCase.id}
                onClick={() => handleTestCaseSelect(testCase.id)}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{testCase.name}</h4>
                  <span className="text-sm text-gray-500">{testCase.duration}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{testCase.description}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>{testCase.messages} messages</span>
                  <span>•</span>
                  <span>Ready to run</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Real-time Simulation Interface */}
      {selectedTestCase && (
        <div className="space-y-6">
          {/* Test Case Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {testCases.find(tc => tc.id === selectedTestCase)?.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {testCases.find(tc => tc.id === selectedTestCase)?.description}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedTestCase(null);
                  setIsSimulationActive(false);
                }}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Change Test Case
              </button>
            </div>
          </div>

          {/* Real-time Controls */}
          <RealtimePlaybackControls
            testCaseId={selectedTestCase}
            onStateChange={handleSimulationStateChange}
          />

          {/* Live KPIs */}
          <LiveKPIDashboard
            testCaseId={selectedTestCase}
            onKPIsUpdate={(kpis) => console.log('KPIs updated:', kpis)}
          />

          {/* Time Controller */}
          <TimeController
            testCaseId={selectedTestCase}
            onTimeChange={(time) => console.log('Time changed:', time)}
            onSpeedChange={(speed) => console.log('Speed changed:', speed)}
            onPlayStateChange={(isPlaying) => setIsSimulationActive(isPlaying)}
          />
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'messages', label: 'Live Messages' },
              { id: 'layers', label: 'Layer Groups' },
              { id: 'analytics', label: 'Live Analytics' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {!selectedTestCase ? (
                <div className="text-center py-12">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Test Case Selected</h3>
                  <p className="text-gray-600">Select a test case above to start real-time protocol analysis</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Simulation Status</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Status</span>
                        <span className={`text-sm font-medium ${
                          isSimulationActive ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {isSimulationActive ? 'Running' : 'Stopped'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Test Case</span>
                        <span className="text-sm text-gray-600">
                          {testCases.find(tc => tc.id === selectedTestCase)?.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Duration</span>
                        <span className="text-sm text-gray-600">
                          {testCases.find(tc => tc.id === selectedTestCase)?.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Total Messages</span>
                        <span className="text-sm text-gray-600">
                          {testCases.find(tc => tc.id === selectedTestCase)?.messages}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Protocol Layers</span>
                        <span className="text-sm text-gray-600">7 (PHY-IMS)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Real-time Updates</span>
                        <span className="text-sm text-green-600">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'messages' && selectedTestCase && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Message Flow</h3>
              <LiveLayerGrouping
                testCaseId={selectedTestCase}
                onMessageSelect={(message) => console.log('Message selected:', message)}
              />
            </div>
          )}

          {activeTab === 'layers' && selectedTestCase && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Protocol Layer Groups</h3>
              <LiveLayerGrouping
                testCaseId={selectedTestCase}
                onMessageSelect={(message) => console.log('Message selected:', message)}
              />
            </div>
          )}

          {activeTab === 'analytics' && selectedTestCase && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Analytics & Charts</h3>
              <LiveCharts
                testCaseId={selectedTestCase}
                onChartUpdate={(chartType, data) => console.log('Chart updated:', chartType, data)}
              />
            </div>
          )}

          {/* Show placeholder for tabs when no test case is selected */}
          {!selectedTestCase && activeTab !== 'overview' && (
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Test Case</h3>
              <p className="text-gray-600">Choose a test case to view {activeTab} data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
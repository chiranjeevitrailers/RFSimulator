'use client';

import React, { useState, useEffect } from 'react';

interface OranNode {
  id: string;
  type: string;
  name: string;
  status: 'online' | 'offline';
  ipAddress: string;
  cpu: number;
  memory: number;
  lastSeen: Date;
}

interface OranInterface {
  id: string;
  type: string;
  status: 'up' | 'down';
  latency: number;
  throughput: number;
  errorRate: number;
  lastUpdate: Date;
}

interface OranOverviewProps {
  executionId: string;
  testCaseId: string;
  userId: string;
}

const OranOverview: React.FC<OranOverviewProps> = ({ 
  executionId, 
  testCaseId, 
  userId 
}) => {
  const [oranStatus, setOranStatus] = useState({
    totalNodes: 0,
    activeNodes: 0,
    totalInterfaces: 0,
    activeInterfaces: 0,
    throughput: 0,
    latency: 0
  });

  const [nodes, setNodes] = useState<OranNode[]>([]);
  const [interfaces, setInterfaces] = useState<OranInterface[]>([]);

  useEffect(() => {
    const simulateData = () => {
      const nodeTypes = ['cu-cp', 'cu-up', 'du', 'ru'];
      const interfaceTypes = ['f1-c', 'f1-u', 'e1', 'o1', 'a1'];
      
      const mockNodes: OranNode[] = nodeTypes.map((type, index) => ({
        id: `${type}-${index}`,
        type: type,
        name: `${type.toUpperCase()}-${index + 1}`,
        status: Math.random() > 0.2 ? 'online' : 'offline',
        ipAddress: `192.168.1.${10 + index}`,
        cpu: Math.floor(Math.random() * 100),
        memory: Math.floor(Math.random() * 100),
        lastSeen: new Date()
      }));

      const mockInterfaces: OranInterface[] = interfaceTypes.map((type, index) => ({
        id: `${type}-${index}`,
        type: type,
        status: Math.random() > 0.3 ? 'up' : 'down',
        latency: Math.floor(Math.random() * 10) + 1,
        throughput: Math.floor(Math.random() * 1000) + 100,
        errorRate: Math.random() * 5,
        lastUpdate: new Date()
      }));

      setNodes(mockNodes);
      setInterfaces(mockInterfaces);

      const activeNodes = mockNodes.filter(n => n.status === 'online').length;
      const activeInterfaces = mockInterfaces.filter(i => i.status === 'up').length;

      setOranStatus({
        totalNodes: mockNodes.length,
        activeNodes: activeNodes,
        totalInterfaces: mockInterfaces.length,
        activeInterfaces: activeInterfaces,
        throughput: mockInterfaces.reduce((sum, i) => sum + i.throughput, 0),
        latency: mockInterfaces.reduce((sum, i) => sum + i.latency, 0) / mockInterfaces.length
      });
    };

    simulateData();
    const interval = setInterval(simulateData, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'up':
        return 'text-green-600 bg-green-100';
      case 'offline':
      case 'down':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
      case 'up':
        return <CheckCircle className="w-4 h-4" />;
      case 'offline':
      case 'down':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getNodeTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'cu-cp': 'bg-blue-100 text-blue-800',
      'cu-up': 'bg-green-100 text-green-800',
      'du': 'bg-yellow-100 text-yellow-800',
      'ru': 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">O-RAN Network Overview</h1>
          <p className="text-sm text-gray-600">Real-time O-RAN network monitoring and analysis</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="text-sm text-gray-600">Network Active</span>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-4">Total Nodes</h3>
          <div className="text-3xl font-bold text-blue-600">{oranStatus.totalNodes}</div>
          <p className="text-sm text-gray-500 mt-1">{oranStatus.activeNodes} active</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-4">Interfaces</h3>
          <div className="text-3xl font-bold text-green-600">{oranStatus.totalInterfaces}</div>
          <p className="text-sm text-gray-500 mt-1">{oranStatus.activeInterfaces} up</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-4">Throughput</h3>
          <div className="text-3xl font-bold text-purple-600">{Math.floor(oranStatus.throughput)}</div>
          <p className="text-sm text-gray-500 mt-1">Mbps total network</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-4">Avg Latency</h3>
          <div className="text-3xl font-bold text-orange-600">{oranStatus.latency.toFixed(1)}</div>
          <p className="text-sm text-gray-500 mt-1">ms network latency</p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* O-RAN Nodes */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">O-RAN Nodes</h3>
          <div className="space-y-3">
            {nodes.map((node) => (
              <div key={node.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${node.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div>
                    <div className="font-medium text-gray-900">{node.name}</div>
                    <div className="text-sm text-gray-500">{node.ipAddress}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs ${getNodeTypeColor(node.type)}`}>
                    {node.type.toUpperCase()}
                  </span>
                  <div className="text-right text-sm">
                    <div>CPU: {node.cpu}%</div>
                    <div>RAM: {node.memory}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interface Status */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Interface Status</h3>
          <div className="space-y-3">
            {interfaces.map((intf) => (
              <div key={intf.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${intf.status === 'up' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div>
                    <div className="font-medium text-gray-900">{intf.type.toUpperCase()}</div>
                    <div className="text-sm text-gray-500">{intf.latency}ms latency</div>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div className="font-medium">{intf.throughput} Mbps</div>
                  <div className="text-red-600">{intf.errorRate.toFixed(2)}% errors</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Trends */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Performance Trends</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">98.5%</div>
            <div className="text-sm text-gray-600">Network Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">2.3ms</div>
            <div className="text-sm text-gray-600">Average Latency</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">1.2Gbps</div>
            <div className="text-sm text-gray-600">Peak Throughput</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OranOverview;
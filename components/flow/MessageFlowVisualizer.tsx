'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw,
  Eye,
  EyeOff,
  Settings,
  Download,
  Maximize2,
  Minimize2,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Layers,
  MessageSquare,
  Activity,
  Zap,
  Shield,
  Network,
  Database,
  Cpu,
  HardDrive,
  Wifi
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { messageFlowEngine, MessageFlowStep, DataFlowContext } from '@/lib/message-flow-engine';

interface MessageFlowVisualizerProps {
  testCaseId: string;
  userId: string;
  onFlowComplete?: (results: any) => void;
}

interface FlowNode {
  id: string;
  type: 'message' | 'layer' | 'response' | 'error';
  layer: string;
  message: string;
  direction: 'UL' | 'DL' | 'BIDIRECTIONAL';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'skipped';
  timestamp: number;
  duration: number;
  data: any;
  position: { x: number; y: number };
  connections: string[];
}

interface FlowConnection {
  from: string;
  to: string;
  type: 'success' | 'error' | 'timeout' | 'dependency';
  label?: string;
}

const MessageFlowVisualizer: React.FC<MessageFlowVisualizerProps> = ({
  testCaseId,
  userId,
  onFlowComplete
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [flowNodes, setFlowNodes] = useState<FlowNode[]>([]);
  const [flowConnections, setFlowConnections] = useState<FlowConnection[]>([]);
  const [flowContext, setFlowContext] = useState<DataFlowContext | null>(null);
  const [showLayerDetails, setShowLayerDetails] = useState(true);
  const [showTiming, setShowTiming] = useState(true);
  const [showMetrics, setShowMetrics] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    initializeFlow();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [testCaseId]);

  useEffect(() => {
    if (isPlaying) {
      startAnimation();
    } else {
      stopAnimation();
    }
  }, [isPlaying, playbackSpeed]);

  const initializeFlow = async () => {
    try {
      // Generate sample message flow for demonstration
      const sampleFlow: MessageFlowStep[] = [
        {
          step_id: 'step_1',
          timestamp: 0,
          direction: 'UL',
          layer: 'PHY',
          message_type: 'PRACH_Preamble',
          message_name: 'PRACH Preamble Transmission',
          source: 'UE',
          destination: 'gNB',
          data_payload: { preamble_id: 23, power: 23 },
          information_elements: { preamble_id: 23, power: 23, timing: 0 },
          layer_parameters: { subcarrier_spacing: 15, prach_config_index: 0 },
          dependencies: [],
          processing_delay: 100,
          retry_count: 0,
          max_retries: 3
        },
        {
          step_id: 'step_2',
          timestamp: 5,
          direction: 'DL',
          layer: 'PHY',
          message_type: 'RAR',
          message_name: 'Random Access Response',
          source: 'gNB',
          destination: 'UE',
          data_payload: { ra_rnti: 17921, ta: 31 },
          information_elements: { ra_rnti: 17921, ta: 31, ul_grant: true },
          layer_parameters: { ra_response_window: 10, backoff_indicator: 0 },
          dependencies: ['step_1'],
          processing_delay: 50,
          retry_count: 0,
          max_retries: 3
        },
        {
          step_id: 'step_3',
          timestamp: 10,
          direction: 'UL',
          layer: 'RRC',
          message_type: 'RRCSetupRequest',
          message_name: 'RRC Setup Request',
          source: 'UE',
          destination: 'gNB',
          data_payload: { establishment_cause: 'mo-Data', ue_identity: '001010123456789' },
          information_elements: { 
            rrc_transaction_id: 0, 
            establishment_cause: 'mo-Data', 
            ue_identity: '001010123456789' 
          },
          layer_parameters: { selected_plmn: '001-01' },
          dependencies: ['step_2'],
          processing_delay: 200,
          retry_count: 0,
          max_retries: 3
        },
        {
          step_id: 'step_4',
          timestamp: 15,
          direction: 'DL',
          layer: 'RRC',
          message_type: 'RRCSetup',
          message_name: 'RRC Setup',
          source: 'gNB',
          destination: 'UE',
          data_payload: { srb1_config: 'configured' },
          information_elements: { rrc_transaction_id: 0, srb1_config: 'configured' },
          layer_parameters: { cell_group_config: 'configured' },
          dependencies: ['step_3'],
          processing_delay: 150,
          retry_count: 0,
          max_retries: 3
        },
        {
          step_id: 'step_5',
          timestamp: 20,
          direction: 'UL',
          layer: 'RRC',
          message_type: 'RRCSetupComplete',
          message_name: 'RRC Setup Complete',
          source: 'UE',
          destination: 'gNB',
          data_payload: { selected_plmn: '001-01' },
          information_elements: { rrc_transaction_id: 0, selected_plmn: '001-01' },
          layer_parameters: {},
          dependencies: ['step_4'],
          processing_delay: 100,
          retry_count: 0,
          max_retries: 3
        }
      ];

      // Create flow context
      const context: DataFlowContext = {
        session_id: `session_${testCaseId}_${Date.now()}`,
        ue_id: '001010123456789',
        cell_id: '12345',
        plmn: { mcc: '001', mnc: '01' },
        current_state: 'RRC_IDLE',
        variables: {},
        layer_states: {},
        message_history: [],
        performance_metrics: {}
      };

      setFlowContext(context);

      // Convert message flow to visual nodes
      const nodes = sampleFlow.map((step, index) => ({
        id: step.step_id,
        type: 'message' as const,
        layer: step.layer,
        message: step.message_name,
        direction: step.direction,
        status: 'pending' as const,
        timestamp: step.timestamp,
        duration: step.processing_delay,
        data: step,
        position: { x: 100 + (index * 200), y: 200 + (index % 2 === 0 ? 0 : 100) },
        connections: index < sampleFlow.length - 1 ? [sampleFlow[index + 1].step_id] : []
      }));

      // Create connections
      const connections: FlowConnection[] = [];
      for (let i = 0; i < nodes.length - 1; i++) {
        connections.push({
          from: nodes[i].id,
          to: nodes[i + 1].id,
          type: 'success',
          label: `${nodes[i].duration}ms`
        });
      }

      setFlowNodes(nodes);
      setFlowConnections(connections);

    } catch (error) {
      console.error('Error initializing flow:', error);
    }
  };

  const startAnimation = () => {
    const animate = () => {
      setCurrentStep(prev => {
        if (prev < flowNodes.length - 1) {
          // Update node status
          setFlowNodes(nodes => 
            nodes.map((node, index) => ({
              ...node,
              status: index <= prev + 1 ? 
                (index === prev + 1 ? 'processing' : 'completed') : 
                'pending'
            }))
          );
          return prev + 1;
        } else {
          // Animation complete
          setIsPlaying(false);
          setFlowNodes(nodes => 
            nodes.map(node => ({ ...node, status: 'completed' }))
          );
          if (onFlowComplete) {
            onFlowComplete({ success: true, totalSteps: flowNodes.length });
          }
          return prev;
        }
      });

      if (isPlaying) {
        animationRef.current = setTimeout(animate, 1000 / playbackSpeed);
      }
    };

    animate();
  };

  const stopAnimation = () => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  };

  const resetFlow = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setFlowNodes(nodes => 
      nodes.map(node => ({ ...node, status: 'pending' }))
    );
    setSelectedNode(null);
  };

  const getNodeColor = (node: FlowNode) => {
    switch (node.status) {
      case 'completed': return '#10B981'; // green
      case 'processing': return '#3B82F6'; // blue
      case 'failed': return '#EF4444'; // red
      case 'skipped': return '#6B7280'; // gray
      default: return '#9CA3AF'; // light gray
    }
  };

  const getLayerIcon = (layer: string) => {
    const icons: Record<string, any> = {
      'PHY': Wifi,
      'MAC': Network,
      'RLC': Layers,
      'PDCP': Shield,
      'RRC': MessageSquare,
      'NAS': Database,
      'SIP': Activity,
      'IMS': Zap
    };
    return icons[layer] || MessageSquare;
  };

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'UL': return ArrowUp;
      case 'DL': return ArrowDown;
      case 'BIDIRECTIONAL': return ArrowRight;
      default: return ArrowRight;
    }
  };

  const renderFlowCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    flowConnections.forEach(conn => {
      const fromNode = flowNodes.find(n => n.id === conn.from);
      const toNode = flowNodes.find(n => n.id === conn.to);
      
      if (fromNode && toNode) {
        ctx.beginPath();
        ctx.moveTo(fromNode.position.x + 50, fromNode.position.y + 25);
        ctx.lineTo(toNode.position.x, toNode.position.y + 25);
        ctx.strokeStyle = conn.type === 'success' ? '#10B981' : '#EF4444';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw arrow
        const angle = Math.atan2(toNode.position.y - fromNode.position.y, toNode.position.x - fromNode.position.x);
        ctx.beginPath();
        ctx.moveTo(toNode.position.x - 10, toNode.position.y + 25);
        ctx.lineTo(toNode.position.x - 10 - 10 * Math.cos(angle - Math.PI / 6), toNode.position.y + 25 - 10 * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(toNode.position.x - 10 - 10 * Math.cos(angle + Math.PI / 6), toNode.position.y + 25 - 10 * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fillStyle = conn.type === 'success' ? '#10B981' : '#EF4444';
        ctx.fill();
      }
    });

    // Draw nodes
    flowNodes.forEach(node => {
      const color = getNodeColor(node);
      const LayerIcon = getLayerIcon(node.layer);
      const DirectionIcon = getDirectionIcon(node.direction);

      // Draw node background
      ctx.fillStyle = color;
      ctx.fillRect(node.position.x, node.position.y, 100, 50);

      // Draw node border
      ctx.strokeStyle = selectedNode?.id === node.id ? '#3B82F6' : '#374151';
      ctx.lineWidth = selectedNode?.id === node.id ? 3 : 1;
      ctx.strokeRect(node.position.x, node.position.y, 100, 50);

      // Draw text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(node.message.substring(0, 15), node.position.x + 50, node.position.y + 20);
      ctx.fillText(node.layer, node.position.x + 50, node.position.y + 35);

      // Draw status indicator
      if (node.status === 'processing') {
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(node.position.x + 90, node.position.y + 10, 5, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
  };

  useEffect(() => {
    renderFlowCanvas();
  }, [flowNodes, flowConnections, selectedNode]);

  const handleNodeClick = (node: FlowNode) => {
    setSelectedNode(node);
  };

  const renderNodeDetails = () => {
    if (!selectedNode) return null;

    return (
      <div className="bg-white border rounded-lg p-4">
        <h3 className="font-semibold mb-3">{selectedNode.message}</h3>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Layer:</span>
            <span className="ml-2">{selectedNode.layer}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Direction:</span>
            <span className="ml-2">{selectedNode.direction}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Status:</span>
            <span className="ml-2 capitalize">{selectedNode.status}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Duration:</span>
            <span className="ml-2">{selectedNode.duration}ms</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Timestamp:</span>
            <span className="ml-2">{selectedNode.timestamp}ms</span>
          </div>
        </div>

        {showLayerDetails && (
          <div className="mt-4">
            <h4 className="font-medium text-gray-700 mb-2">Layer Details</h4>
            <div className="bg-gray-50 p-3 rounded text-sm">
              <pre>{JSON.stringify(selectedNode.data, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderLayerTimeline = () => {
    const layers = ['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS'];
    
    return (
      <div className="bg-white border rounded-lg p-4">
        <h3 className="font-semibold mb-3">Layer Timeline</h3>
        <div className="space-y-2">
          {layers.map(layer => {
            const layerNodes = flowNodes.filter(node => node.layer === layer);
            const LayerIcon = getLayerIcon(layer);
            
            return (
              <div key={layer} className="flex items-center space-x-3">
                <LayerIcon className="w-4 h-4 text-gray-600" />
                <span className="w-12 text-sm font-medium">{layer}</span>
                <div className="flex-1 flex space-x-1">
                  {layerNodes.map((node, index) => (
                    <div
                      key={node.id}
                      className={`h-4 w-8 rounded cursor-pointer ${
                        node.status === 'completed' ? 'bg-green-500' :
                        node.status === 'processing' ? 'bg-blue-500' :
                        node.status === 'failed' ? 'bg-red-500' : 'bg-gray-300'
                      }`}
                      onClick={() => handleNodeClick(node)}
                      title={`${node.message} (${node.duration}ms)`}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderPerformanceMetrics = () => {
    if (!flowContext) return null;

    const totalDuration = flowNodes.reduce((sum, node) => sum + node.duration, 0);
    const completedNodes = flowNodes.filter(node => node.status === 'completed').length;
    const successRate = (completedNodes / flowNodes.length) * 100;

    return (
      <div className="bg-white border rounded-lg p-4">
        <h3 className="font-semibold mb-3">Performance Metrics</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Total Duration:</span>
            <span className="ml-2">{totalDuration}ms</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Success Rate:</span>
            <span className="ml-2">{successRate.toFixed(1)}%</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Messages Processed:</span>
            <span className="ml-2">{completedNodes}/{flowNodes.length}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Current Step:</span>
            <span className="ml-2">{currentStep + 1}/{flowNodes.length}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''} p-6`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Message Flow Visualization</h1>
          <p className="text-gray-600">Real-time 3GPP protocol message flow and data flow</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLayerDetails(!showLayerDetails)}
          >
            {showLayerDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTiming(!showTiming)}
          >
            <Clock className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMetrics(!showMetrics)}
          >
            <Activity className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={currentStep >= flowNodes.length}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button variant="outline" onClick={resetFlow}>
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button variant="outline" onClick={() => setCurrentStep(0)}>
            <Square className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium">Speed:</label>
          <select
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          >
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={2}>2x</option>
            <option value={4}>4x</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Flow Canvas */}
        <div className="lg:col-span-3">
          <div className="bg-white border rounded-lg p-4">
            <h3 className="font-semibold mb-4">Message Flow Diagram</h3>
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={800}
                height={400}
                className="border border-gray-200 rounded cursor-pointer"
                onClick={(e) => {
                  const rect = canvasRef.current?.getBoundingClientRect();
                  if (rect) {
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const clickedNode = flowNodes.find(node => 
                      x >= node.position.x && x <= node.position.x + 100 &&
                      y >= node.position.y && y <= node.position.y + 50
                    );
                    
                    if (clickedNode) {
                      handleNodeClick(clickedNode);
                    }
                  }
                }}
              />
              
              {/* Legend */}
              <div className="absolute top-4 right-4 bg-white border rounded p-2 text-xs">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-3 h-3 bg-gray-300 rounded"></div>
                  <span>Pending</span>
                </div>
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>Processing</span>
                </div>
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Completed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>Failed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {selectedNode && renderNodeDetails()}
          {showTiming && renderLayerTimeline()}
          {showMetrics && renderPerformanceMetrics()}
        </div>
      </div>
    </div>
  );
};

export default MessageFlowVisualizer;
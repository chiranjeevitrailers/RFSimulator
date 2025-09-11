'use client';

import React, { useState, useEffect } from 'react';
import { DeploymentManager, DeploymentConfig, Deployment, Environment, DeploymentPipeline } from '@/lib/deployment-manager';
import { 
  Rocket, 
  Play, 
  Pause, 
  RefreshCw, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Settings, 
  Clock, 
  Calendar, 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Target, 
  Timer, 
  Users, 
  Server, 
  Cpu, 
  MemoryStick, 
  HardDrive, 
  Network, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronRight, 
  Copy, 
  Save, 
  X, 
  Info, 
  Download, 
  Upload, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  PlayCircle, 
  PauseCircle, 
  StopCircle, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  XCircle as XCircleIcon, 
  Clock as ClockIcon, 
  Calendar as CalendarIcon, 
  Activity as ActivityIcon, 
  TrendingUp as TrendingUpIcon, 
  TrendingDown as TrendingDownIcon, 
  BarChart3 as BarChart3Icon, 
  PieChart as PieChartIcon, 
  LineChart as LineChartIcon, 
  Target as TargetIcon, 
  Timer as TimerIcon, 
  Users as UsersIcon, 
  Server as ServerIcon, 
  Cpu as CpuIcon, 
  MemoryStick as MemoryStickIcon, 
  HardDrive as HardDriveIcon, 
  Network as NetworkIcon, 
  AlertTriangle as AlertTriangleIcon, 
  CheckCircle as CheckCircleIcon, 
  XCircle as XCircleIcon2, 
  Search as SearchIcon, 
  Filter as FilterIcon, 
  ChevronDown as ChevronDownIcon, 
  ChevronRight as ChevronRightIcon, 
  Copy as CopyIcon, 
  Save as SaveIcon, 
  X as XIcon, 
  Info as InfoIcon, 
  Download as DownloadIcon, 
  Upload as UploadIcon, 
  Maximize2 as Maximize2Icon, 
  Minimize2 as Minimize2Icon, 
  RotateCcw as RotateCcwIcon, 
  PlayCircle as PlayCircleIcon, 
  PauseCircle as PauseCircleIcon, 
  StopCircle as StopCircleIcon, 
  Loader2 as Loader2Icon, 
  AlertCircle as AlertCircleIcon, 
  CheckCircle2 as CheckCircle2Icon,
  Globe,
  Shield,
  Zap,
  GitBranch,
  GitCommit,
  Code,
  Terminal,
  Monitor,
  Database,
  Cloud,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface DeploymentDashboardProps {
  userId: string;
}

const DeploymentDashboard: React.FC<DeploymentDashboardProps> = ({ userId }) => {
  const [deploymentManager] = useState(() => DeploymentManager.getInstance());
  const [activeTab, setActiveTab] = useState<'overview' | 'configs' | 'deployments' | 'environments' | 'pipelines'>('overview');
  const [deploymentConfigs, setDeploymentConfigs] = useState<DeploymentConfig[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [pipelines, setPipelines] = useState<DeploymentPipeline[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      await deploymentManager.initialize();
      
      setDeploymentConfigs(deploymentManager.getDeploymentConfigs());
      setDeployments(await deploymentManager.getDeployments());
      setEnvironments(deploymentManager.getEnvironments());
      setPipelines(deploymentManager.getPipelines());
    } catch (error) {
      console.error('Failed to load deployment data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeploy = async (configId: string) => {
    try {
      const version = `v${Date.now()}`;
      const commitHash = Math.random().toString(36).substring(2, 15);
      const branch = 'main';
      
      const deployment = await deploymentManager.createDeployment(configId, version, commitHash, branch);
      setDeployments(prev => [...prev, deployment]);
    } catch (error) {
      console.error('Failed to create deployment:', error);
    }
  };

  const handleCancelDeployment = async (deploymentId: string) => {
    try {
      const success = await deploymentManager.cancelDeployment(deploymentId);
      if (success) {
        setDeployments(prev => prev.map(deployment => 
          deployment.id === deploymentId ? { ...deployment, status: 'cancelled' } : deployment
        ));
      }
    } catch (error) {
      console.error('Failed to cancel deployment:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'building':
      case 'deploying':
        return 'text-blue-600 bg-blue-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'cancelled':
        return 'text-gray-600 bg-gray-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getEnvironmentIcon = (type: string) => {
    switch (type) {
      case 'production':
        return <Globe className="w-4 h-4" />;
      case 'staging':
        return <Server className="w-4 h-4" />;
      case 'development':
        return <Code className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'netlify':
        return <Cloud className="w-4 h-4" />;
      case 'vercel':
        return <Zap className="w-4 h-4" />;
      case 'aws':
        return <Database className="w-4 h-4" />;
      default:
        return <Server className="w-4 h-4" />;
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-100';
      case 'down':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredDeployments = deployments.filter(deployment => {
    const matchesSearch = deployment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deployment.version.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deployment.environment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || deployment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getOverviewStats = () => {
    const totalDeployments = deployments.length;
    const successfulDeployments = deployments.filter(deployment => deployment.status === 'completed').length;
    const failedDeployments = deployments.filter(deployment => deployment.status === 'failed').length;
    const runningDeployments = deployments.filter(deployment => ['pending', 'building', 'deploying'].includes(deployment.status)).length;
    const avgDeploymentTime = deployments
      .filter(deployment => deployment.duration)
      .reduce((sum, deployment) => sum + (deployment.duration || 0), 0) / 
      deployments.filter(deployment => deployment.duration).length || 0;
    const activeEnvironments = environments.filter(env => env.status === 'active').length;

    return {
      totalDeployments,
      successfulDeployments,
      failedDeployments,
      runningDeployments,
      avgDeploymentTime,
      activeEnvironments,
      successRate: totalDeployments > 0 ? (successfulDeployments / totalDeployments) * 100 : 0
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading deployment data...</p>
        </div>
      </div>
    );
  }

  const stats = getOverviewStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
              <Rocket className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Deployment & CI/CD</h2>
              <p className="text-sm text-gray-500">Production deployment and continuous integration</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={loadData}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Deploy
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search deployments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="building">Building</option>
            <option value="deploying">Deploying</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'configs', name: 'Configs', icon: <Settings className="w-4 h-4" />, count: deploymentConfigs.length },
              { id: 'deployments', name: 'Deployments', icon: <Rocket className="w-4 h-4" />, count: deployments.length },
              { id: 'environments', name: 'Environments', icon: <Globe className="w-4 h-4" />, count: environments.length },
              { id: 'pipelines', name: 'Pipelines', icon: <GitBranch className="w-4 h-4" />, count: pipelines.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
                {tab.count !== undefined && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Rocket className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Deployments</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalDeployments}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Success Rate</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.successRate.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Timer className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Avg Deploy Time</p>
                      <p className="text-2xl font-bold text-gray-900">{formatDuration(stats.avgDeploymentTime)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Globe className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Environments</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.activeEnvironments}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Deployments</h3>
                  <div className="space-y-3">
                    {deployments.slice(0, 5).map((deployment) => (
                      <div key={deployment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Rocket className="w-4 h-4" />
                          <div>
                            <p className="font-medium text-gray-900">{deployment.version}</p>
                            <p className="text-sm text-gray-500">
                              {deployment.environment} • {new Date(deployment.startedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deployment.status)}`}>
                            {deployment.status.toUpperCase()}
                          </span>
                          {deployment.duration && (
                            <span className="text-sm text-gray-500">{formatDuration(deployment.duration)}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Environment Status</h3>
                  <div className="space-y-3">
                    {environments.slice(0, 5).map((environment) => (
                      <div key={environment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getEnvironmentIcon(environment.type)}
                          <div>
                            <p className="font-medium text-gray-900">{environment.name}</p>
                            <p className="text-sm text-gray-500">{environment.url}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthStatusColor(environment.health.status)}`}>
                            {environment.health.status.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-500">{environment.health.responseTime}ms</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Deployment Configs Tab */}
          {activeTab === 'configs' && (
            <div className="space-y-4">
              {deploymentConfigs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {deploymentConfigs.map((config) => (
                    <div key={config.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {getPlatformIcon(config.platform)}
                          <h3 className="font-medium text-gray-900">{config.name}</h3>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeploy(config.id)}
                          >
                            <Play className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingItem(config);
                              setShowEditModal(true);
                            }}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{config.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Environment:</span>
                          <span className="font-medium">{config.environment}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Platform:</span>
                          <span className="font-medium">{config.platform}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Domain:</span>
                          <span className="font-medium">{config.config.domain}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">SSL:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            config.config.ssl ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {config.config.ssl ? 'ENABLED' : 'DISABLED'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">CDN:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            config.config.cdn ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {config.config.cdn ? 'ENABLED' : 'DISABLED'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Features:</span>
                          <div className="flex items-center space-x-2">
                            {config.monitoring.enabled && <Activity className="w-3 h-3 text-blue-600" />}
                            {config.security.enabled && <Shield className="w-3 h-3 text-green-600" />}
                            {config.config.compression && <Zap className="w-3 h-3 text-purple-600" />}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Rocket className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Deployment Configurations</h4>
                  <p className="text-gray-500">Create your first deployment configuration to get started.</p>
                </div>
              )}
            </div>
          )}

          {/* Deployments Tab */}
          {activeTab === 'deployments' && (
            <div className="space-y-4">
              {filteredDeployments.length > 0 ? (
                <div className="space-y-3">
                  {filteredDeployments.map((deployment) => (
                    <div key={deployment.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Rocket className="w-4 h-4" />
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900">{deployment.version}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deployment.status)}`}>
                                {deployment.status.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">
                              {deployment.environment} • {new Date(deployment.startedAt).toLocaleString()}
                            </p>
                            {deployment.completedAt && (
                              <p className="text-sm text-gray-500">
                                Duration: {deployment.duration ? formatDuration(deployment.duration) : 'N/A'}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {deployment.url && (
                            <a
                              href={deployment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              View Site
                            </a>
                          )}
                          {['pending', 'building', 'deploying'].includes(deployment.status) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelDeployment(deployment.id)}
                            >
                              <Pause className="w-3 h-3" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setExpandedItem(
                              expandedItem === deployment.id ? null : deployment.id
                            )}
                          >
                            {expandedItem === deployment.id ? 
                              <ChevronDown className="w-3 h-3" /> : 
                              <ChevronRight className="w-3 h-3" />
                            }
                          </Button>
                        </div>
                      </div>
                      
                      {expandedItem === deployment.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <h4 className="font-medium text-gray-900 mb-2">Deployment Info</h4>
                              <div className="space-y-1 text-sm text-gray-600">
                                <p><strong>ID:</strong> {deployment.id}</p>
                                <p><strong>Version:</strong> {deployment.version}</p>
                                <p><strong>Commit:</strong> {deployment.commitHash.substring(0, 8)}</p>
                                <p><strong>Branch:</strong> {deployment.branch}</p>
                              </div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <h4 className="font-medium text-gray-900 mb-2">Performance</h4>
                              <div className="space-y-1 text-sm text-gray-600">
                                <p><strong>Build Time:</strong> {formatDuration(deployment.metadata.performance.buildTime / 1000)}</p>
                                <p><strong>Deploy Time:</strong> {formatDuration(deployment.metadata.performance.deployTime / 1000)}</p>
                                <p><strong>Bundle Size:</strong> {formatBytes(deployment.metadata.performance.bundleSize)}</p>
                                <p><strong>Lighthouse:</strong> {deployment.metadata.performance.lighthouseScore}/100</p>
                              </div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <h4 className="font-medium text-gray-900 mb-2">Checks</h4>
                              <div className="space-y-1 text-sm text-gray-600">
                                <p><strong>Health Check:</strong> {deployment.metadata.checks.healthCheck ? '✅' : '❌'}</p>
                                <p><strong>Smoke Test:</strong> {deployment.metadata.checks.smokeTest ? '✅' : '❌'}</p>
                                <p><strong>Security Scan:</strong> {deployment.metadata.checks.securityScan ? '✅' : '❌'}</p>
                                <p><strong>Performance:</strong> {deployment.metadata.checks.performanceTest ? '✅' : '❌'}</p>
                              </div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <h4 className="font-medium text-gray-900 mb-2">Logs</h4>
                              <div className="space-y-1 text-sm text-gray-600">
                                <p><strong>Build Logs:</strong> {deployment.metadata.buildLogs.length} entries</p>
                                <p><strong>Deploy Logs:</strong> {deployment.metadata.deploymentLogs.length} entries</p>
                              </div>
                            </div>
                          </div>
                          {deployment.error && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                              <h4 className="font-medium text-red-900 mb-1">Error</h4>
                              <p className="text-sm text-red-700">{deployment.error}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Rocket className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Deployments</h4>
                  <p className="text-gray-500">No deployments found matching your criteria.</p>
                </div>
              )}
            </div>
          )}

          {/* Environments Tab */}
          {activeTab === 'environments' && (
            <div className="space-y-4">
              {environments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {environments.map((environment) => (
                    <div key={environment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {getEnvironmentIcon(environment.type)}
                          <h3 className="font-medium text-gray-900">{environment.name}</h3>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthStatusColor(environment.health.status)}`}>
                          {environment.health.status.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{environment.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Type:</span>
                          <span className="font-medium">{environment.type}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">URL:</span>
                          <a href={environment.url} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:text-blue-800">
                            {environment.url}
                          </a>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Response Time:</span>
                          <span className="font-medium">{environment.health.responseTime}ms</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Uptime:</span>
                          <span className="font-medium">{environment.health.uptime}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Version:</span>
                          <span className="font-medium">{environment.version || 'N/A'}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Resources:</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {environment.resources.cpu} CPU
                            </span>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {environment.resources.memory}GB RAM
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Globe className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Environments</h4>
                  <p className="text-gray-500">No environments configured.</p>
                </div>
              )}
            </div>
          )}

          {/* Pipelines Tab */}
          {activeTab === 'pipelines' && (
            <div className="space-y-4">
              {pipelines.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pipelines.map((pipeline) => (
                    <div key={pipeline.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <GitBranch className="w-4 h-4" />
                          <h3 className="font-medium text-gray-900">{pipeline.name}</h3>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          pipeline.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {pipeline.enabled ? 'ENABLED' : 'DISABLED'}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{pipeline.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Stages:</span>
                          <span className="font-medium">{pipeline.stages.length}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Branches:</span>
                          <span className="font-medium">{pipeline.triggers.branches.join(', ')}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Manual:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            pipeline.triggers.manual ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {pipeline.triggers.manual ? 'ENABLED' : 'DISABLED'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Notifications:</span>
                          <div className="flex items-center space-x-2">
                            {pipeline.notifications.slack && <span className="text-xs bg-blue-100 px-2 py-1 rounded">Slack</span>}
                            {pipeline.notifications.email && <span className="text-xs bg-green-100 px-2 py-1 rounded">Email</span>}
                            {pipeline.notifications.webhook && <span className="text-xs bg-purple-100 px-2 py-1 rounded">Webhook</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <GitBranch className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Pipelines</h4>
                  <p className="text-gray-500">No deployment pipelines configured.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {showCreateModal ? 'Create' : 'Edit'} Deployment
              </h3>
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  setEditingItem(null);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="text-center py-8">
              <Rocket className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Form Implementation</h4>
              <p className="text-gray-500">The form for creating/editing deployments will be implemented here.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeploymentDashboard;
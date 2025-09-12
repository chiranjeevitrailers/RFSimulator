'use client';

import React, { useState, useEffect } from 'react';
import { BackupManager, BackupConfig, BackupJob, RecoveryJob, DisasterRecoveryPlan } from '@/lib/backup-manager';
import { 
  Database, 
  Download, 
  Upload, 
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
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Activity, 
  HardDrive, 
  Cloud, 
  Server, 
  Zap, 
  FileText, 
  Archive, 
  Lock, 
  Unlock, 
  FileArchive, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronRight, 
  Copy, 
  Save, 
  X, 
  Info, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  LineChart, 
  Target, 
  Timer, 
  Users, 
  Globe, 
  Mail, 
  Phone, 
  Bell, 
  AlertCircle as AlertCircleIcon, 
  CheckCircle as CheckCircleIcon, 
  XCircle as XCircleIcon, 
  Clock as ClockIcon, 
  Calendar as CalendarIcon, 
  Shield as ShieldIcon, 
  Database as DatabaseIcon, 
  Server as ServerIcon, 
  HardDrive as HardDriveIcon, 
  Cloud as CloudIcon, 
  Archive as ArchiveIcon, 
  Lock as LockIcon, 
  Unlock as UnlockIcon, 
  Compress as CompressIcon, 
  FileText as FileTextIcon, 
  Settings as SettingsIcon, 
  Play as PlayIcon, 
  Pause as PauseIcon, 
  RefreshCw as RefreshCwIcon, 
  Plus as PlusIcon, 
  Edit as EditIcon, 
  Trash2 as Trash2Icon, 
  Eye as EyeIcon, 
  Search as SearchIcon, 
  Filter as FilterIcon, 
  ChevronDown as ChevronDownIcon, 
  ChevronRight as ChevronRightIcon, 
  Copy as CopyIcon, 
  Save as SaveIcon, 
  X as XIcon, 
  Info as InfoIcon, 
  TrendingUp as TrendingUpIcon, 
  TrendingDown as TrendingDownIcon, 
  BarChart3 as BarChart3Icon, 
  PieChart as PieChartIcon, 
  LineChart as LineChartIcon, 
  Target as TargetIcon, 
  Timer as TimerIcon, 
  Users as UsersIcon, 
  Globe as GlobeIcon, 
  Mail as MailIcon, 
  Phone as PhoneIcon, 
  Bell as BellIcon
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface BackupDashboardProps {
  userId: string;
}

const BackupDashboard: React.FC<BackupDashboardProps> = ({ userId }) => {
  const [backupManager] = useState(() => BackupManager.getInstance());
  const [activeTab, setActiveTab] = useState<'overview' | 'configs' | 'jobs' | 'recovery' | 'plans'>('overview');
  const [backupConfigs, setBackupConfigs] = useState<BackupConfig[]>([]);
  const [backupJobs, setBackupJobs] = useState<BackupJob[]>([]);
  const [recoveryJobs, setRecoveryJobs] = useState<RecoveryJob[]>([]);
  const [disasterRecoveryPlans, setDisasterRecoveryPlans] = useState<DisasterRecoveryPlan[]>([]);
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
      await backupManager.initialize();
      
      setBackupConfigs(backupManager.getBackupConfigs());
      setBackupJobs(await backupManager.getBackupJobs());
      setRecoveryJobs(await backupManager.getRecoveryJobs());
      setDisasterRecoveryPlans(backupManager.getDisasterRecoveryPlans());
    } catch (error) {
      console.error('Failed to load backup data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBackup = async (configId: string) => {
    try {
      const job = await backupManager.createBackupJob(configId, 'manual');
      setBackupJobs(prev => [...prev, job]);
    } catch (error) {
      console.error('Failed to create backup:', error);
    }
  };

  const handleCancelBackup = async (jobId: string) => {
    try {
      const success = await backupManager.cancelBackupJob(jobId);
      if (success) {
        setBackupJobs(prev => prev.map(job => 
          job.id === jobId ? { ...job, status: 'cancelled' } : job
        ));
      }
    } catch (error) {
      console.error('Failed to cancel backup:', error);
    }
  };

  const handleCreateRecovery = async (backupJobId: string) => {
    try {
      const job = await backupManager.createRecoveryJob(backupJobId, 'full', ['users', 'test_cases']);
      setRecoveryJobs(prev => [...prev, job]);
    } catch (error) {
      console.error('Failed to create recovery:', error);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'running':
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'full':
        return <Database className="w-4 h-4" />;
      case 'incremental':
        return <TrendingUp className="w-4 h-4" />;
      case 'differential':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Archive className="w-4 h-4" />;
    }
  };

  const getStorageIcon = (type: string) => {
    switch (type) {
      case 'local':
        return <HardDrive className="w-4 h-4" />;
      case 's3':
      case 'gcs':
      case 'azure':
        return <Cloud className="w-4 h-4" />;
      case 'ftp':
      case 'sftp':
        return <Server className="w-4 h-4" />;
      default:
        return <Archive className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredBackupJobs = backupJobs.filter(job => {
    const matchesSearch = job.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredRecoveryJobs = recoveryJobs.filter(job => {
    const matchesSearch = job.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getOverviewStats = () => {
    const totalBackups = backupJobs.length;
    const successfulBackups = backupJobs.filter(job => job.status === 'completed').length;
    const failedBackups = backupJobs.filter(job => job.status === 'failed').length;
    const runningBackups = backupJobs.filter(job => job.status === 'running').length;
    const totalRecoveries = recoveryJobs.length;
    const successfulRecoveries = recoveryJobs.filter(job => job.status === 'completed').length;
    const totalSize = backupJobs
      .filter(job => job.size)
      .reduce((sum, job) => sum + (job.size || 0), 0);
    const totalRecords = backupJobs
      .filter(job => job.records)
      .reduce((sum, job) => sum + (job.records || 0), 0);

    return {
      totalBackups,
      successfulBackups,
      failedBackups,
      runningBackups,
      totalRecoveries,
      successfulRecoveries,
      totalSize,
      totalRecords,
      successRate: totalBackups > 0 ? (successfulBackups / totalBackups) * 100 : 0
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading backup data...</p>
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
            <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-green-100 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Backup & Recovery</h2>
              <p className="text-sm text-gray-500">Database backup and disaster recovery management</p>
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
              Create Backup
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search backups..."
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
            <option value="running">Running</option>
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
              { id: 'configs', name: 'Configurations', icon: <Settings className="w-4 h-4" />, count: backupConfigs.length },
              { id: 'jobs', name: 'Backup Jobs', icon: <Archive className="w-4 h-4" />, count: backupJobs.length },
              { id: 'recovery', name: 'Recovery Jobs', icon: <Download className="w-4 h-4" />, count: recoveryJobs.length },
              { id: 'plans', name: 'DR Plans', icon: <Shield className="w-4 h-4" />, count: disasterRecoveryPlans.length }
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
                      <Archive className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Backups</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalBackups}</p>
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
                      <HardDrive className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Size</p>
                      <p className="text-2xl font-bold text-gray-900">{formatBytes(stats.totalSize)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Database className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Records</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalRecords.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Backup Jobs</h3>
                  <div className="space-y-3">
                    {backupJobs.slice(0, 5).map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getTypeIcon(job.type)}
                          <div>
                            <p className="font-medium text-gray-900">{job.type} Backup</p>
                            <p className="text-sm text-gray-500">
                              {new Date(job.startedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                            {job.status.toUpperCase()}
                          </span>
                          {job.size && (
                            <span className="text-sm text-gray-500">{formatBytes(job.size)}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Recovery Jobs</h3>
                  <div className="space-y-3">
                    {recoveryJobs.slice(0, 5).map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Download className="w-4 h-4" />
                          <div>
                            <p className="font-medium text-gray-900">{job.type} Recovery</p>
                            <p className="text-sm text-gray-500">
                              {new Date(job.startedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                            {job.status.toUpperCase()}
                          </span>
                          {job.recordsRestored && (
                            <span className="text-sm text-gray-500">{job.recordsRestored} records</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Configurations Tab */}
          {activeTab === 'configs' && (
            <div className="space-y-4">
              {backupConfigs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {backupConfigs.map((config) => (
                    <div key={config.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(config.type)}
                          <h3 className="font-medium text-gray-900">{config.name}</h3>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCreateBackup(config.id)}
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
                          <span className="text-gray-500">Type:</span>
                          <span className="font-medium">{config.type}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Schedule:</span>
                          <span className="font-medium">{config.schedule.frequency}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Storage:</span>
                          <div className="flex items-center space-x-1">
                            {getStorageIcon(config.storage.type)}
                            <span className="font-medium">{config.storage.type}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Tables:</span>
                          <span className="font-medium">{config.tables.length}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            config.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {config.enabled ? 'ENABLED' : 'DISABLED'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Features:</span>
                          <div className="flex items-center space-x-2">
                            {config.storage.encryption && <Lock className="w-3 h-3 text-green-600" />}
                            {config.storage.compression && <Compress className="w-3 h-3 text-blue-600" />}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Archive className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Backup Configurations</h4>
                  <p className="text-gray-500">Create your first backup configuration to get started.</p>
                </div>
              )}
            </div>
          )}

          {/* Backup Jobs Tab */}
          {activeTab === 'jobs' && (
            <div className="space-y-4">
              {filteredBackupJobs.length > 0 ? (
                <div className="space-y-3">
                  {filteredBackupJobs.map((job) => (
                    <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getTypeIcon(job.type)}
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900">{job.type} Backup</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                                {job.status.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">
                              Started: {new Date(job.startedAt).toLocaleString()}
                            </p>
                            {job.completedAt && (
                              <p className="text-sm text-gray-500">
                                Duration: {job.duration ? formatDuration(job.duration) : 'N/A'}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {job.size && (
                            <span className="text-sm text-gray-500">{formatBytes(job.size)}</span>
                          )}
                          {job.records && (
                            <span className="text-sm text-gray-500">{job.records.toLocaleString()} records</span>
                          )}
                          {job.status === 'running' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelBackup(job.id)}
                            >
                              <Pause className="w-3 h-3" />
                            </Button>
                          )}
                          {job.status === 'completed' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCreateRecovery(job.id)}
                            >
                              <Download className="w-3 h-3" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setExpandedItem(
                              expandedItem === job.id ? null : job.id
                            )}
                          >
                            {expandedItem === job.id ? 
                              <ChevronDown className="w-3 h-3" /> : 
                              <ChevronRight className="w-3 h-3" />
                            }
                          </Button>
                        </div>
                      </div>
                      
                      {expandedItem === job.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Job Details</h4>
                              <div className="space-y-1 text-sm text-gray-600">
                                <p><strong>ID:</strong> {job.id}</p>
                                <p><strong>Type:</strong> {job.type}</p>
                                <p><strong>Status:</strong> {job.status}</p>
                                <p><strong>Started:</strong> {new Date(job.startedAt).toLocaleString()}</p>
                                {job.completedAt && (
                                  <p><strong>Completed:</strong> {new Date(job.completedAt).toLocaleString()}</p>
                                )}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Metadata</h4>
                              <div className="bg-gray-50 p-2 rounded text-sm">
                                <pre className="text-gray-700 overflow-auto">
                                  {JSON.stringify(job.metadata, null, 2)}
                                </pre>
                              </div>
                            </div>
                          </div>
                          {job.error && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                              <h4 className="font-medium text-red-900 mb-1">Error</h4>
                              <p className="text-sm text-red-700">{job.error}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Archive className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Backup Jobs</h4>
                  <p className="text-gray-500">No backup jobs found matching your criteria.</p>
                </div>
              )}
            </div>
          )}

          {/* Recovery Jobs Tab */}
          {activeTab === 'recovery' && (
            <div className="space-y-4">
              {filteredRecoveryJobs.length > 0 ? (
                <div className="space-y-3">
                  {filteredRecoveryJobs.map((job) => (
                    <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Download className="w-4 h-4" />
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900">{job.type} Recovery</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                                {job.status.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">
                              Started: {new Date(job.startedAt).toLocaleString()}
                            </p>
                            {job.completedAt && (
                              <p className="text-sm text-gray-500">
                                Duration: {job.duration ? formatDuration(job.duration) : 'N/A'}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {job.recordsRestored && (
                            <span className="text-sm text-gray-500">{job.recordsRestored.toLocaleString()} records</span>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setExpandedItem(
                              expandedItem === job.id ? null : job.id
                            )}
                          >
                            {expandedItem === job.id ? 
                              <ChevronDown className="w-3 h-3" /> : 
                              <ChevronRight className="w-3 h-3" />
                            }
                          </Button>
                        </div>
                      </div>
                      
                      {expandedItem === job.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Recovery Details</h4>
                              <div className="space-y-1 text-sm text-gray-600">
                                <p><strong>ID:</strong> {job.id}</p>
                                <p><strong>Type:</strong> {job.type}</p>
                                <p><strong>Status:</strong> {job.status}</p>
                                <p><strong>Target Tables:</strong> {job.targetTables.join(', ')}</p>
                                <p><strong>Started:</strong> {new Date(job.startedAt).toLocaleString()}</p>
                                {job.completedAt && (
                                  <p><strong>Completed:</strong> {new Date(job.completedAt).toLocaleString()}</p>
                                )}
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">Metadata</h4>
                              <div className="bg-gray-50 p-2 rounded text-sm">
                                <pre className="text-gray-700 overflow-auto">
                                  {JSON.stringify(job.metadata, null, 2)}
                                </pre>
                              </div>
                            </div>
                          </div>
                          {job.error && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                              <h4 className="font-medium text-red-900 mb-1">Error</h4>
                              <p className="text-sm text-red-700">{job.error}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Download className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Recovery Jobs</h4>
                  <p className="text-gray-500">No recovery jobs found matching your criteria.</p>
                </div>
              )}
            </div>
          )}

          {/* Disaster Recovery Plans Tab */}
          {activeTab === 'plans' && (
            <div className="space-y-4">
              {disasterRecoveryPlans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {disasterRecoveryPlans.map((plan) => (
                    <div key={plan.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Shield className="w-4 h-4" />
                          <h3 className="font-medium text-gray-900">{plan.name}</h3>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(plan.priority)}`}>
                          {plan.priority.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">RTO:</span>
                          <span className="font-medium">{plan.rto} minutes</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">RPO:</span>
                          <span className="font-medium">{plan.rpo} minutes</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Components:</span>
                          <span className="font-medium">{plan.components.length}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Contacts:</span>
                          <span className="font-medium">{plan.contacts.length}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            plan.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {plan.enabled ? 'ENABLED' : 'DISABLED'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Last Test:</span>
                          <span className="font-medium">
                            {plan.testingSchedule.lastTest 
                              ? new Date(plan.testingSchedule.lastTest).toLocaleDateString()
                              : 'Never'
                            }
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Next Test:</span>
                          <span className="font-medium">
                            {plan.testingSchedule.nextTest 
                              ? new Date(plan.testingSchedule.nextTest).toLocaleDateString()
                              : 'Not scheduled'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Disaster Recovery Plans</h4>
                  <p className="text-gray-500">Create your first disaster recovery plan to get started.</p>
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
                {showCreateModal ? 'Create' : 'Edit'} Backup Configuration
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
              <Settings className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Form Implementation</h4>
              <p className="text-gray-500">The form for creating/editing backup configurations will be implemented here.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackupDashboard;
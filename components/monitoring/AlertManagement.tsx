'use client';

import React, { useState, useEffect } from 'react';
import { AlertManager, AlertTemplate, AlertAction, AlertSuppression, AlertCorrelation } from '@/lib/alert-manager';
import { 
  AlertTriangle, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Settings, 
  Bell, 
  Filter, 
  Search, 
  Save, 
  X, 
  Check, 
  Clock, 
  Calendar, 
  Zap, 
  Shield, 
  Activity, 
  Mail, 
  MessageSquare, 
  Webhook, 
  Smartphone, 
  Code, 
  Link, 
  Target, 
  Timer, 
  Users, 
  Globe, 
  Database, 
  Server, 
  Cpu, 
  MemoryStick, 
  HardDrive, 
  Network, 
  AlertCircle, 
  Info, 
  ChevronDown, 
  ChevronRight, 
  Copy, 
  Download, 
  Upload, 
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface AlertManagementProps {
  userId: string;
}

const AlertManagement: React.FC<AlertManagementProps> = ({ userId }) => {
  const [alertManager] = useState(() => AlertManager.getInstance());
  const [activeTab, setActiveTab] = useState<'templates' | 'actions' | 'suppressions' | 'correlations'>('templates');
  const [templates, setTemplates] = useState<AlertTemplate[]>([]);
  const [actions, setActions] = useState<AlertAction[]>([]);
  const [suppressions, setSuppressions] = useState<AlertSuppression[]>([]);
  const [correlations, setCorrelations] = useState<AlertCorrelation[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      await alertManager.initialize();
      
      setTemplates(alertManager.getAlertTemplates());
      setActions(alertManager.getAlertActions());
      setSuppressions(alertManager.getAlertSuppressions());
      setCorrelations(alertManager.getAlertCorrelations());
    } catch (error) {
      console.error('Failed to load alert management data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTemplate = async (template: Omit<AlertTemplate, 'id'>) => {
    try {
      const newTemplate = await alertManager.createAlertTemplate(template);
      setTemplates(prev => [...prev, newTemplate]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create template:', error);
    }
  };

  const handleUpdateTemplate = async (id: string, updates: Partial<AlertTemplate>) => {
    try {
      const updatedTemplate = await alertManager.updateAlertTemplate(id, updates);
      if (updatedTemplate) {
        setTemplates(prev => prev.map(t => t.id === id ? updatedTemplate : t));
        setShowEditModal(false);
        setEditingItem(null);
      }
    } catch (error) {
      console.error('Failed to update template:', error);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      const success = await alertManager.deleteAlertTemplate(id);
      if (success) {
        setTemplates(prev => prev.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete template:', error);
    }
  };

  const handleCreateAction = async (action: Omit<AlertAction, 'id'>) => {
    try {
      const newAction = await alertManager.createAlertAction(action);
      setActions(prev => [...prev, newAction]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create action:', error);
    }
  };

  const handleUpdateAction = async (id: string, updates: Partial<AlertAction>) => {
    try {
      const updatedAction = await alertManager.updateAlertAction(id, updates);
      if (updatedAction) {
        setActions(prev => prev.map(a => a.id === id ? updatedAction : a));
        setShowEditModal(false);
        setEditingItem(null);
      }
    } catch (error) {
      console.error('Failed to update action:', error);
    }
  };

  const handleDeleteAction = async (id: string) => {
    try {
      const success = await alertManager.deleteAlertAction(id);
      if (success) {
        setActions(prev => prev.filter(a => a.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete action:', error);
    }
  };

  const handleCreateSuppression = async (suppression: Omit<AlertSuppression, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newSuppression = await alertManager.createAlertSuppression(suppression);
      setSuppressions(prev => [...prev, newSuppression]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create suppression:', error);
    }
  };

  const handleUpdateSuppression = async (id: string, updates: Partial<AlertSuppression>) => {
    try {
      const updatedSuppression = await alertManager.updateAlertSuppression(id, updates);
      if (updatedSuppression) {
        setSuppressions(prev => prev.map(s => s.id === id ? updatedSuppression : s));
        setShowEditModal(false);
        setEditingItem(null);
      }
    } catch (error) {
      console.error('Failed to update suppression:', error);
    }
  };

  const handleDeleteSuppression = async (id: string) => {
    try {
      const success = await alertManager.deleteAlertSuppression(id);
      if (success) {
        setSuppressions(prev => prev.filter(s => s.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete suppression:', error);
    }
  };

  const handleCreateCorrelation = async (correlation: Omit<AlertCorrelation, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newCorrelation = await alertManager.createAlertCorrelation(correlation);
      setCorrelations(prev => [...prev, newCorrelation]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create correlation:', error);
    }
  };

  const handleUpdateCorrelation = async (id: string, updates: Partial<AlertCorrelation>) => {
    try {
      const updatedCorrelation = await alertManager.updateAlertCorrelation(id, updates);
      if (updatedCorrelation) {
        setCorrelations(prev => prev.map(c => c.id === id ? updatedCorrelation : c));
        setShowEditModal(false);
        setEditingItem(null);
      }
    } catch (error) {
      console.error('Failed to update correlation:', error);
    }
  };

  const handleDeleteCorrelation = async (id: string) => {
    try {
      const success = await alertManager.deleteAlertCorrelation(id);
      if (success) {
        setCorrelations(prev => prev.filter(c => c.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete correlation:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'system':
        return <Server className="w-4 h-4" />;
      case 'application':
        return <Activity className="w-4 h-4" />;
      case 'database':
        return <Database className="w-4 h-4" />;
      case 'network':
        return <Network className="w-4 h-4" />;
      case 'security':
        return <Shield className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'slack':
        return <MessageSquare className="w-4 h-4" />;
      case 'webhook':
        return <Webhook className="w-4 h-4" />;
      case 'script':
        return <Code className="w-4 h-4" />;
      case 'pagerduty':
        return <Smartphone className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredActions = actions.filter(action => {
    const matchesSearch = action.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredSuppressions = suppressions.filter(suppression => {
    const matchesSearch = suppression.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         suppression.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredCorrelations = correlations.filter(correlation => {
    const matchesSearch = correlation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         correlation.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading alert management data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-100 to-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Alert Management</h2>
              <p className="text-sm text-gray-500">Configure alert templates, actions, suppressions, and correlations</p>
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
              Create
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          {activeTab === 'templates' && (
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="system">System</option>
              <option value="application">Application</option>
              <option value="database">Database</option>
              <option value="network">Network</option>
              <option value="security">Security</option>
            </select>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'templates', name: 'Templates', icon: <AlertTriangle className="w-4 h-4" />, count: templates.length },
              { id: 'actions', name: 'Actions', icon: <Zap className="w-4 h-4" />, count: actions.length },
              { id: 'suppressions', name: 'Suppressions', icon: <EyeOff className="w-4 h-4" />, count: suppressions.length },
              { id: 'correlations', name: 'Correlations', icon: <Link className="w-4 h-4" />, count: correlations.length }
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
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <div className="space-y-4">
              {filteredTemplates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTemplates.map((template) => (
                    <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {getCategoryIcon(template.category)}
                          <h3 className="font-medium text-gray-900">{template.name}</h3>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingItem(template);
                              setShowEditModal(true);
                            }}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteTemplate(template.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Metric:</span>
                          <span className="font-medium">{template.metric}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Condition:</span>
                          <span className="font-medium">{template.condition.replace('_', ' ')}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Threshold:</span>
                          <span className="font-medium">{template.threshold}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Severity:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(template.severity)}`}>
                            {template.severity.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Cooldown:</span>
                          <span className="font-medium">{template.cooldown}m</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex flex-wrap gap-1">
                          {template.tags.map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Alert Templates</h4>
                  <p className="text-gray-500">Create your first alert template to get started.</p>
                </div>
              )}
            </div>
          )}

          {/* Actions Tab */}
          {activeTab === 'actions' && (
            <div className="space-y-4">
              {filteredActions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredActions.map((action) => (
                    <div key={action.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          {getActionIcon(action.type)}
                          <h3 className="font-medium text-gray-900">{action.name}</h3>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingItem(action);
                              setShowEditModal(true);
                            }}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAction(action.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Type:</span>
                          <span className="font-medium">{action.type}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            action.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {action.enabled ? 'ENABLED' : 'DISABLED'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Conditions:</span>
                          <span className="font-medium">{action.conditions.length}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Zap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Alert Actions</h4>
                  <p className="text-gray-500">Create your first alert action to get started.</p>
                </div>
              )}
            </div>
          )}

          {/* Suppressions Tab */}
          {activeTab === 'suppressions' && (
            <div className="space-y-4">
              {filteredSuppressions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSuppressions.map((suppression) => (
                    <div key={suppression.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <EyeOff className="w-4 h-4" />
                          <h3 className="font-medium text-gray-900">{suppression.name}</h3>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingItem(suppression);
                              setShowEditModal(true);
                            }}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteSuppression(suppression.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{suppression.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Rules:</span>
                          <span className="font-medium">{suppression.rules.length}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Schedule:</span>
                          <span className="font-medium">
                            {suppression.schedule ? 'Scheduled' : 'Always'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            suppression.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {suppression.enabled ? 'ENABLED' : 'DISABLED'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <EyeOff className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Alert Suppressions</h4>
                  <p className="text-gray-500">Create your first alert suppression to get started.</p>
                </div>
              )}
            </div>
          )}

          {/* Correlations Tab */}
          {activeTab === 'correlations' && (
            <div className="space-y-4">
              {filteredCorrelations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCorrelations.map((correlation) => (
                    <div key={correlation.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Link className="w-4 h-4" />
                          <h3 className="font-medium text-gray-900">{correlation.name}</h3>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingItem(correlation);
                              setShowEditModal(true);
                            }}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCorrelation(correlation.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{correlation.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Rules:</span>
                          <span className="font-medium">{correlation.rules.length}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Window:</span>
                          <span className="font-medium">{correlation.correlationWindow}m</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Action:</span>
                          <span className="font-medium">{correlation.action}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            correlation.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {correlation.enabled ? 'ENABLED' : 'DISABLED'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Link className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No Alert Correlations</h4>
                  <p className="text-gray-500">Create your first alert correlation to get started.</p>
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
                {showCreateModal ? 'Create' : 'Edit'} {activeTab.slice(0, -1)}
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
              <p className="text-gray-500">The form for creating/editing {activeTab} will be implemented here.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertManagement;
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Settings,
  Play,
  Square,
  RotateCcw,
  Save,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

// Import configuration editors
import { SrsranConfigEditor } from './SrsranConfigEditor';
import { Open5gsConfigEditor } from './Open5gsConfigEditor';
import { KamailioConfigEditor } from './KamailioConfigEditor';

interface ConfigManagerProps {
  onConfigChange?: (tool: string, config: any) => void;
}

export const ConfigManager: React.FC<ConfigManagerProps> = ({ onConfigChange }) => {
  const [activeTab, setActiveTab] = useState('srsran');
  const [serviceStatus, setServiceStatus] = useState({
    srsran: { status: 'stopped', loading: false },
    open5gs: { status: 'stopped', loading: false },
    kamailio: { status: 'stopped', loading: false }
  });
  const [configs, setConfigs] = useState({
    srsran: null,
    open5gs: null,
    kamailio: null
  });
  const [configModified, setConfigModified] = useState({
    srsran: false,
    open5gs: false,
    kamailio: false
  });

  // Load initial configurations
  useEffect(() => {
    loadConfigurations();
    loadServiceStatus();
  }, []);

  const loadConfigurations = async () => {
    try {
      const [srsranRes, open5gsRes, kamailioRes] = await Promise.all([
        fetch('/api/config/srsran'),
        fetch('/api/config/open5gs'),
        fetch('/api/config/kamailio')
      ]);

      if (srsranRes.ok) {
        const srsranConfig = await srsranRes.json();
        setConfigs(prev => ({ ...prev, srsran: srsranConfig }));
      }

      if (open5gsRes.ok) {
        const open5gsConfig = await open5gsRes.json();
        setConfigs(prev => ({ ...prev, open5gs: open5gsConfig }));
      }

      if (kamailioRes.ok) {
        const kamailioConfig = await kamailioRes.json();
        setConfigs(prev => ({ ...prev, kamailio: kamailioConfig }));
      }
    } catch (error) {
      console.error('Failed to load configurations:', error);
      toast.error('Failed to load configurations');
    }
  };

  const loadServiceStatus = async () => {
    try {
      const response = await fetch('/api/cli/status');
      if (response.ok) {
        const status = await response.json();
        setServiceStatus(prev => ({
          ...prev,
          srsran: { ...prev.srsran, status: status.srsran?.running ? 'running' : 'stopped' },
          open5gs: { ...prev.open5gs, status: status.open5gs?.running ? 'running' : 'stopped' },
          kamailio: { ...prev.kamailio, status: status.kamailio?.running ? 'running' : 'stopped' }
        }));
      }
    } catch (error) {
      console.error('Failed to load service status:', error);
    }
  };

  const handleConfigChange = (tool: string, newConfig: any) => {
    setConfigs(prev => ({ ...prev, [tool]: newConfig }));
    setConfigModified(prev => ({ ...prev, [tool]: true }));
    onConfigChange?.(tool, newConfig);
  };

  const handleSaveConfig = async (tool: string) => {
    try {
      const response = await fetch(`/api/config/${tool}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configs[tool])
      });

      if (response.ok) {
        setConfigModified(prev => ({ ...prev, [tool]: false }));
        toast.success(`${tool.toUpperCase()} configuration saved successfully`);
      } else {
        throw new Error('Failed to save configuration');
      }
    } catch (error) {
      console.error(`Failed to save ${tool} config:`, error);
      toast.error(`Failed to save ${tool.toUpperCase()} configuration`);
    }
  };

  const handleStartService = async (tool: string) => {
    setServiceStatus(prev => ({
      ...prev,
      [tool]: { ...prev[tool], loading: true }
    }));

    try {
      const response = await fetch(`/api/cli/start/${tool}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: configs[tool] })
      });

      if (response.ok) {
        setServiceStatus(prev => ({
          ...prev,
          [tool]: { status: 'running', loading: false }
        }));
        toast.success(`${tool.toUpperCase()} started successfully`);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to start service');
      }
    } catch (error) {
      console.error(`Failed to start ${tool}:`, error);
      setServiceStatus(prev => ({
        ...prev,
        [tool]: { ...prev[tool], loading: false }
      }));
      toast.error(`Failed to start ${tool.toUpperCase()}: ${error.message}`);
    }
  };

  const handleStopService = async (tool: string) => {
    setServiceStatus(prev => ({
      ...prev,
      [tool]: { ...prev[tool], loading: true }
    }));

    try {
      const response = await fetch(`/api/cli/stop/${tool}`, {
        method: 'POST'
      });

      if (response.ok) {
        setServiceStatus(prev => ({
          ...prev,
          [tool]: { status: 'stopped', loading: false }
        }));
        toast.success(`${tool.toUpperCase()} stopped successfully`);
      } else {
        throw new Error('Failed to stop service');
      }
    } catch (error) {
      console.error(`Failed to stop ${tool}:`, error);
      setServiceStatus(prev => ({
        ...prev,
        [tool]: { ...prev[tool], loading: false }
      }));
      toast.error(`Failed to stop ${tool.toUpperCase()}`);
    }
  };

  const handleRestartService = async (tool: string) => {
    await handleStopService(tool);
    setTimeout(() => handleStartService(tool), 2000);
  };

  const getStatusIcon = (status: string, loading: boolean) => {
    if (loading) return <Loader2 className="h-4 w-4 animate-spin" />;
    switch (status) {
      case 'running': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'stopped': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running': return <Badge variant="default" className="bg-green-500">Running</Badge>;
      case 'stopped': return <Badge variant="secondary">Stopped</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration Management
          </CardTitle>
          <CardDescription>
            Configure and manage srsRAN, Open5GS, and Kamailio IMS settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="srsran" className="flex items-center gap-2">
                {getStatusIcon(serviceStatus.srsran.status, serviceStatus.srsran.loading)}
                srsRAN (eNB/gNB)
              </TabsTrigger>
              <TabsTrigger value="open5gs" className="flex items-center gap-2">
                {getStatusIcon(serviceStatus.open5gs.status, serviceStatus.open5gs.loading)}
                Open5GS (Core)
              </TabsTrigger>
              <TabsTrigger value="kamailio" className="flex items-center gap-2">
                {getStatusIcon(serviceStatus.kamailio.status, serviceStatus.kamailio.loading)}
                Kamailio (IMS)
              </TabsTrigger>
            </TabsList>

            {/* Service Control Panel */}
            <div className="mt-4 p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h3 className="font-semibold">
                    {activeTab.toUpperCase()} Service Control
                  </h3>
                  {getStatusBadge(serviceStatus[activeTab].status)}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSaveConfig(activeTab)}
                    disabled={!configModified[activeTab]}
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save Config
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStartService(activeTab)}
                    disabled={serviceStatus[activeTab].status === 'running' || serviceStatus[activeTab].loading}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Start
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStopService(activeTab)}
                    disabled={serviceStatus[activeTab].status === 'stopped' || serviceStatus[activeTab].loading}
                  >
                    <Square className="h-4 w-4 mr-1" />
                    Stop
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRestartService(activeTab)}
                    disabled={serviceStatus[activeTab].loading}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Restart
                  </Button>
                </div>
              </div>
              {configModified[activeTab] && (
                <div className="mt-2 text-sm text-yellow-600 flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  Configuration has unsaved changes
                </div>
              )}
            </div>

            {/* Configuration Editors */}
            <TabsContent value="srsran" className="mt-6">
              <SrsranConfigEditor
                config={configs.srsran}
                onChange={(config) => handleConfigChange('srsran', config)}
              />
            </TabsContent>

            <TabsContent value="open5gs" className="mt-6">
              <Open5gsConfigEditor
                config={configs.open5gs}
                onChange={(config) => handleConfigChange('open5gs', config)}
              />
            </TabsContent>

            <TabsContent value="kamailio" className="mt-6">
              <KamailioConfigEditor
                config={configs.kamailio}
                onChange={(config) => handleConfigChange('kamailio', config)}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
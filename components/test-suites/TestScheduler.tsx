'use client';

import React, { useState } from 'react';
import { 
  Calendar,
  Clock,
  Play,
  Pause,
  Square,
  Settings,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Repeat,
  Bell,
  Mail,
  Zap,
  Database,
  Monitor,
  Activity,
  TrendingUp
} from 'lucide-react';

interface TestSchedulerProps {
  tests: any[];
  onSchedule: (schedule: any) => void;
}

const TestScheduler: React.FC<TestSchedulerProps> = ({ tests, onSchedule }) => {
  const [schedules, setSchedules] = useState([
    {
      id: '1',
      name: 'Daily 5G NR Tests',
      test_ids: ['5NR_INIT_0001', '5NR_INIT_0002'],
      cron_expression: '0 9 * * *',
      is_active: true,
      next_run: '2024-01-15T09:00:00Z',
      created_at: '2024-01-10T10:00:00Z'
    },
    {
      id: '2',
      name: 'Weekly Performance Tests',
      test_ids: ['PERF_001', 'PERF_002'],
      cron_expression: '0 2 * * 1',
      is_active: false,
      next_run: '2024-01-15T02:00:00Z',
      created_at: '2024-01-08T14:30:00Z'
    }
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    name: '',
    test_ids: [] as string[],
    cron_expression: '0 9 * * *',
    is_active: true,
    notifications: {
      email: true,
      webhook: false
    }
  });

  const cronPresets = [
    { label: 'Daily at 9 AM', value: '0 9 * * *' },
    { label: 'Daily at 6 PM', value: '0 18 * * *' },
    { label: 'Weekly on Monday', value: '0 9 * * 1' },
    { label: 'Weekly on Friday', value: '0 17 * * 5' },
    { label: 'Monthly on 1st', value: '0 9 1 * *' },
    { label: 'Every 6 hours', value: '0 */6 * * *' },
    { label: 'Every 30 minutes', value: '*/30 * * * *' }
  ];

  const handleCreateSchedule = () => {
    if (!newSchedule.name || newSchedule.test_ids.length === 0) {
      alert('Please provide a name and select at least one test');
      return;
    }

    const schedule = {
      ...newSchedule,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      next_run: calculateNextRun(newSchedule.cron_expression)
    };

    setSchedules(prev => [...prev, schedule]);
    setNewSchedule({
      name: '',
      test_ids: [],
      cron_expression: '0 9 * * *',
      is_active: true,
      notifications: {
        email: true,
        webhook: false
      }
    });
    setIsCreating(false);
    onSchedule(schedule);
  };

  const calculateNextRun = (cronExpression: string) => {
    // Simplified next run calculation
    // In a real implementation, you'd use a cron parser library
    return new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  };

  const toggleSchedule = (id: string) => {
    setSchedules(prev => prev.map(schedule => 
      schedule.id === id 
        ? { ...schedule, is_active: !schedule.is_active }
        : schedule
    ));
  };

  const deleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(schedule => schedule.id !== id));
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <XCircle className="w-5 h-5 text-gray-400" />
    );
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Test Scheduler</h3>
          <p className="text-sm text-gray-600">Schedule automated test executions</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Schedule
        </button>
      </div>

      {/* Create Schedule Modal */}
      {isCreating && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Create New Schedule</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Name</label>
              <input
                type="text"
                value={newSchedule.name}
                onChange={(e) => setNewSchedule(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Daily 5G NR Tests"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Tests</label>
              <div className="border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto">
                {tests.slice(0, 10).map((test) => (
                  <label key={test.id} className="flex items-center space-x-2 py-1">
                    <input
                      type="checkbox"
                      checked={newSchedule.test_ids.includes(test.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewSchedule(prev => ({
                            ...prev,
                            test_ids: [...prev.test_ids, test.id]
                          }));
                        } else {
                          setNewSchedule(prev => ({
                            ...prev,
                            test_ids: prev.test_ids.filter(id => id !== test.id)
                          }));
                        }
                      }}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{test.name}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {newSchedule.test_ids.length} tests selected
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Schedule</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Preset</label>
                  <select
                    value={newSchedule.cron_expression}
                    onChange={(e) => setNewSchedule(prev => ({ ...prev, cron_expression: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    {cronPresets.map((preset) => (
                      <option key={preset.value} value={preset.value}>
                        {preset.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Custom Cron</label>
                  <input
                    type="text"
                    value={newSchedule.cron_expression}
                    onChange={(e) => setNewSchedule(prev => ({ ...prev, cron_expression: e.target.value }))}
                    placeholder="0 9 * * *"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Format: minute hour day month weekday
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notifications</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newSchedule.notifications.email}
                    onChange={(e) => setNewSchedule(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, email: e.target.checked }
                    }))}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Email notifications</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={newSchedule.notifications.webhook}
                    onChange={(e) => setNewSchedule(prev => ({
                      ...prev,
                      notifications: { ...prev.notifications, webhook: e.target.checked }
                    }))}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <Bell className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Webhook notifications</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSchedule}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Create Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedules List */}
      <div className="space-y-4">
        {schedules.map((schedule) => (
          <div
            key={schedule.id}
            className="bg-white rounded-lg border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {getStatusIcon(schedule.is_active)}
                <div>
                  <h4 className="font-semibold text-gray-900">{schedule.name}</h4>
                  <p className="text-sm text-gray-600">
                    {schedule.test_ids.length} tests • Next run: {new Date(schedule.next_run).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(schedule.is_active)}`}>
                  {schedule.is_active ? 'Active' : 'Inactive'}
                </span>
                <button
                  onClick={() => toggleSchedule(schedule.id)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  {schedule.is_active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteSchedule(schedule.id)}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Cron Expression:</span>
                <span className="ml-2 font-mono text-gray-900">{schedule.cron_expression}</span>
              </div>
              <div>
                <span className="text-gray-600">Created:</span>
                <span className="ml-2 text-gray-900">{new Date(schedule.created_at).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-gray-600">Tests:</span>
                <span className="ml-2 text-gray-900">{schedule.test_ids.length}</span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <span className={`ml-2 ${schedule.is_active ? 'text-green-600' : 'text-gray-600'}`}>
                  {schedule.is_active ? 'Running' : 'Paused'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {schedules.length === 0 && !isCreating && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Scheduled Tests</h3>
          <p className="text-gray-600 mb-4">Create a schedule to automate test executions.</p>
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Schedule
          </button>
        </div>
      )}
    </div>
  );
};

export default TestScheduler;
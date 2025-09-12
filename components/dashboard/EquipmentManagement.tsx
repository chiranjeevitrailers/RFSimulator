'use client';

import React, { useState } from 'react';
import { 
  Wifi, 
  Smartphone, 
  Router, 
  Server, 
  Antenna, 
  Cpu, 
  HardDrive, 
  Network,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
  MapPin,
  Settings
} from 'lucide-react';

const equipmentTypes = [
  { id: 'base-station', name: 'Base Station', icon: Antenna, count: 12 },
  { id: 'ue-device', name: 'UE Device', icon: Smartphone, count: 8 },
  { id: 'core-network', name: 'Core Network', icon: Server, count: 5 },
  { id: 'antenna', name: 'Antenna', icon: Wifi, count: 15 },
  { id: 'router', name: 'Router', icon: Router, count: 6 },
  { id: 'test-equipment', name: 'Test Equipment', icon: Cpu, count: 10 },
  { id: 'simulator', name: 'Simulator', icon: Network, count: 3 },
  { id: 'storage', name: 'Storage', icon: HardDrive, count: 4 }
];

const mockEquipment = [
  {
    id: 'eq-001',
    name: '5GLabX Base Station A1',
    type: 'Base Station',
    model: '5GLabX --&gt;4G&5G LAB BS-001',
    serialNumber: '5GLabX-SN-001',
    status: 'Active',
    location: '5GLabX Lab A',
    firmwareVersion: '5GLabX-v2.1.3',
    lastMaintenance: '2024-01-15',
    specifications: {
      frequencyRange: '5GLabX 3.5-3.7 GHz',
      powerOutput: '5GLabX 40W',
      coverage: '5GLabX 2km radius',
      capacity: '5GLabX 1000 users'
    }
  },
  {
    id: 'eq-002',
    name: '5GLabX Test UE Device',
    type: 'UE Device',
    model: '5GLabX --&gt;4G&5G LAB UE-001',
    serialNumber: '5GLabX-SN-002',
    status: 'Maintenance',
    location: '5GLabX Test Bench',
    firmwareVersion: '5GLabX-v1.8.2',
    lastMaintenance: '2024-01-10',
    specifications: {
      frequencyRange: '5GLabX 3.3-3.8 GHz',
      powerOutput: '5GLabX 200mW',
      coverage: '5GLabX Mobile',
      capacity: '5GLabX Single user'
    }
  },
  {
    id: 'eq-003',
    name: '5GLabX Signal Analyzer',
    type: 'Test Equipment',
    model: '5GLabX --&gt;4G&5G LAB SA-001',
    serialNumber: '5GLabX-SN-003',
    status: 'Active',
    location: '5GLabX Rack 2',
    firmwareVersion: '5GLabX-v3.2.1',
    lastMaintenance: '2024-01-20',
    specifications: {
      frequencyRange: '5GLabX 1Hz-44GHz',
      powerOutput: '5GLabX N/A',
      coverage: '5GLabX Lab',
      capacity: '5GLabX Analysis'
    }
  },
  {
    id: 'eq-004',
    name: '5GLabX Core Network Unit',
    type: 'Core Network',
    model: '5GLabX --&gt;4G&5G LAB CN-001',
    serialNumber: '5GLabX-SN-004',
    status: 'Inactive',
    location: '5GLabX Server Room',
    firmwareVersion: '5GLabX-v4.0.1',
    lastMaintenance: '2024-01-05',
    specifications: {
      frequencyRange: '5GLabX Core',
      powerOutput: '5GLabX 500W',
      coverage: '5GLabX Network',
      capacity: '5GLabX 10K users'
    }
  }
];

const EquipmentManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredEquipment = mockEquipment.filter(equipment => {
    const matchesSearch = equipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         equipment.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || equipment.type.toLowerCase().replace(' ', '-') === selectedType;
    const matchesStatus = selectedStatus === 'all' || equipment.status.toLowerCase() === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <AlertCircle className="w-4 h-4" />;
      case 'maintenance': return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Equipment Management</h2>
          <p className="text-gray-600">Manage your 5GLabX equipment inventory and monitoring</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Equipment
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {equipmentTypes.map((type) => {
          const IconComponent = type.icon;
          return (
            <div key={type.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <IconComponent className="w-6 h-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{type.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{type.count}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              {equipmentTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
              </div>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <div className="w-4 h-4 space-y-1">
                <div className="bg-current rounded-sm h-0.5"></div>
                <div className="bg-current rounded-sm h-0.5"></div>
                <div className="bg-current rounded-sm h-0.5"></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Equipment List/Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {viewMode === 'grid' ? (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEquipment.map((equipment) => (
                <div key={equipment.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="p-2 bg-primary-100 rounded-lg mr-3">
                        {equipmentTypes.find(t => t.name === equipment.type)?.icon && 
                          React.createElement(equipmentTypes.find(t => t.name === equipment.type)!.icon, { className: "w-5 h-5 text-primary-600" })
                        }
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{equipment.name}</h3>
                        <p className="text-sm text-gray-600">{equipment.model}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(equipment.status)}`}>
                      {getStatusIcon(equipment.status)}
                      <span className="ml-1">{equipment.status}</span>
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium w-20">Serial:</span>
                      <span>{equipment.serialNumber}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{equipment.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Settings className="w-4 h-4 mr-1" />
                      <span>{equipment.firmwareVersion}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-xs text-gray-500">
                      Last maintenance: {equipment.lastMaintenance}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Equipment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Firmware
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEquipment.map((equipment) => (
                  <tr key={equipment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-2 bg-primary-100 rounded-lg mr-3">
                          {equipmentTypes.find(t => t.name === equipment.type)?.icon && 
                            React.createElement(equipmentTypes.find(t => t.name === equipment.type)!.icon, { className: "w-4 h-4 text-primary-600" })
                          }
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{equipment.name}</div>
                          <div className="text-sm text-gray-500">{equipment.serialNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {equipment.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(equipment.status)}`}>
                        {getStatusIcon(equipment.status)}
                        <span className="ml-1">{equipment.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {equipment.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {equipment.firmwareVersion}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-primary-600 hover:text-primary-900">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentManagement;
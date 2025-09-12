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
  Save,
  X,
  Plus,
  Trash2
} from 'lucide-react';

interface EquipmentItem {
  id: string;
  name: string;
  type: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  firmwareVersion: string;
  status: 'active' | 'inactive' | 'maintenance';
  location: string;
  specifications: {
    frequency?: string;
    power?: string;
    range?: string;
    capacity?: string;
    protocol?: string;
  };
  notes?: string;
}

const equipmentTypes = [
  { value: 'base-station', label: '5G Base Station', icon: Antenna },
  { value: 'ue-device', label: 'UE Device', icon: Smartphone },
  { value: 'core-network', label: 'Core Network', icon: Server },
  { value: 'antenna', label: 'Antenna', icon: Antenna },
  { value: 'router', label: 'Router/Switch', icon: Router },
  { value: 'test-equipment', label: 'Test Equipment', icon: Cpu },
  { value: 'simulator', label: 'Network Simulator', icon: Network },
  { value: 'storage', label: 'Storage Device', icon: HardDrive },
];

const manufacturers = [
  'Ericsson', 'Nokia', 'Huawei', 'Samsung', 'Qualcomm', 'Intel',
  'Keysight', 'Rohde & Schwarz', 'Anritsu', 'VIAVI', 'Spirent',
  'Cisco', 'Juniper', 'Dell', 'HP', 'IBM', 'Other'
];

const EquipmentForm: React.FC = () => {
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EquipmentItem | null>(null);
  const [formData, setFormData] = useState<Partial<EquipmentItem>>({
    name: '',
    type: '',
    manufacturer: '',
    model: '',
    serialNumber: '',
    firmwareVersion: '',
    status: 'active',
    location: '',
    specifications: {},
    notes: ''
  });

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('specifications.')) {
      const specField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      // Update existing item
      setEquipment(prev => prev.map(item => 
        item.id === editingItem.id 
          ? { ...formData, id: editingItem.id } as EquipmentItem
          : item
      ));
    } else {
      // Add new item
      const newItem: EquipmentItem = {
        ...formData,
        id: Date.now().toString(),
      } as EquipmentItem;
      setEquipment(prev => [...prev, newItem]);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: '',
      manufacturer: '',
      model: '',
      serialNumber: '',
      firmwareVersion: '',
      status: 'active',
      location: '',
      specifications: {},
      notes: ''
    });
    setEditingItem(null);
    setIsFormOpen(false);
  };

  const handleEdit = (item: EquipmentItem) => {
    setFormData(item);
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setEquipment(prev => prev.filter(item => item.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = equipmentTypes.find(t => t.value === type);
    return typeConfig ? typeConfig.icon : Network;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Equipment Management</h2>
        <p className="text-gray-600">Manage your 5G testing equipment inventory</p>
      </div>

      {/* Add Equipment Button */}
      <div className="mb-6">
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Equipment
        </button>
      </div>

      {/* Equipment List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {equipment.map((item) => {
          const IconComponent = getTypeIcon(item.type);
          return (
            <div key={item.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <IconComponent className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.manufacturer} {item.model}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Serial:</span>
                  <span className="text-gray-900">{item.serialNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Firmware:</span>
                  <span className="text-gray-900">{item.firmwareVersion}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Location:</span>
                  <span className="text-gray-900">{item.location}</span>
                </div>
              </div>

              {item.specifications && Object.keys(item.specifications).length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Specifications</h4>
                  <div className="space-y-1">
                    {Object.entries(item.specifications).map(([key, value]) => (
                      value && (
                        <div key={key} className="flex justify-between text-xs">
                          <span className="text-gray-500 capitalize">{key}:</span>
                          <span className="text-gray-900">{value}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}

              {item.notes && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 italic">"{item.notes}"</p>
                </div>
              )}

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {equipment.length === 0 && (
        <div className="text-center py-12">
          <Network className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No equipment added yet</h3>
          <p className="text-gray-600 mb-4">Start by adding your first piece of 5G testing equipment</p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Equipment
          </button>
        </div>
      )}

      {/* Equipment Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingItem ? 'Edit Equipment' : 'Add New Equipment'}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Equipment Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., 5G Base Station A1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Equipment Type *
                    </label>
                    <select
                      required
                      value={formData.type || ''}
                      onChange={(e) => handleInputChange('type', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select type</option>
                      {equipmentTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Manufacturer *
                    </label>
                    <select
                      required
                      value={formData.manufacturer || ''}
                      onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select manufacturer</option>
                      {manufacturers.map((manufacturer) => (
                        <option key={manufacturer} value={manufacturer}>
                          {manufacturer}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Model *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.model || ''}
                      onChange={(e) => handleInputChange('model', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., AIR 6449"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Serial Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.serialNumber || ''}
                      onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., SN123456789"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Firmware Version
                    </label>
                    <input
                      type="text"
                      value={formData.firmwareVersion || ''}
                      onChange={(e) => handleInputChange('firmwareVersion', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., v2.1.3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status || 'active'}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., Lab Room A, Rack 1"
                    />
                  </div>
                </div>

                {/* Technical Specifications */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Technical Specifications</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frequency Range
                      </label>
                      <input
                        type="text"
                        value={formData.specifications?.frequency || ''}
                        onChange={(e) => handleInputChange('specifications.frequency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="e.g., 3.5-3.7 GHz"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Power Output
                      </label>
                      <input
                        type="text"
                        value={formData.specifications?.power || ''}
                        onChange={(e) => handleInputChange('specifications.power', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="e.g., 40W"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Range/Coverage
                      </label>
                      <input
                        type="text"
                        value={formData.specifications?.range || ''}
                        onChange={(e) => handleInputChange('specifications.range', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="e.g., 2km radius"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Capacity
                      </label>
                      <input
                        type="text"
                        value={formData.specifications?.capacity || ''}
                        onChange={(e) => handleInputChange('specifications.capacity', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="e.g., 1000 concurrent users"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Protocol Support
                      </label>
                      <input
                        type="text"
                        value={formData.specifications?.protocol || ''}
                        onChange={(e) => handleInputChange('specifications.protocol', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="e.g., 5G NR, LTE, 3GPP Release 16"
                      />
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes || ''}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Additional notes, maintenance history, or special instructions..."
                  />
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingItem ? 'Update Equipment' : 'Add Equipment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentForm;
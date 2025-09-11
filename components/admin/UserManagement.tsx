'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Shield, 
  UserCheck, 
  UserX,
  Mail,
  Calendar,
  Activity,
  ChevronDown,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  profile?: {
    first_name?: string;
    last_name?: string;
    role?: string;
    company?: string;
  };
  created_at: string;
  last_sign_in_at?: string;
  is_active?: boolean;
}

interface UserManagementProps {
  users: User[];
  onUserUpdate: (user: User) => void;
  onUserDelete: (userId: string) => void;
  onUserCreate: (user: Partial<User>) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({
  users,
  onUserUpdate,
  onUserDelete,
  onUserCreate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Filter and sort users
  const filteredUsers = users
    .filter(user => {
      const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.profile?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.profile?.last_name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = filterRole === 'all' || user.profile?.role === filterRole;
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'active' && user.is_active) ||
                           (filterStatus === 'inactive' && !user.is_active);
      
      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'email':
          aValue = a.email;
          bValue = b.email;
          break;
        case 'name':
          aValue = `${a.profile?.first_name || ''} ${a.profile?.last_name || ''}`.trim();
          bValue = `${b.profile?.first_name || ''} ${b.profile?.last_name || ''}`.trim();
          break;
        case 'role':
          aValue = a.profile?.role || 'user';
          bValue = b.profile?.role || 'user';
          break;
        case 'last_sign_in':
          aValue = new Date(a.last_sign_in_at || 0);
          bValue = new Date(b.last_sign_in_at || 0);
          break;
        default:
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedUsers.length === 0) {
      toast.error('Please select users first');
      return;
    }

    switch (action) {
      case 'activate':
        selectedUsers.forEach(userId => {
          const user = users.find(u => u.id === userId);
          if (user) {
            onUserUpdate({ ...user, is_active: true });
          }
        });
        toast.success(`${selectedUsers.length} users activated`);
        break;
      case 'deactivate':
        selectedUsers.forEach(userId => {
          const user = users.find(u => u.id === userId);
          if (user) {
            onUserUpdate({ ...user, is_active: false });
          }
        });
        toast.success(`${selectedUsers.length} users deactivated`);
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) {
          selectedUsers.forEach(userId => onUserDelete(userId));
          toast.success(`${selectedUsers.length} users deleted`);
        }
        break;
    }
    
    setSelectedUsers([]);
    setShowBulkActions(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600 mt-1">
            Manage users, roles, and permissions
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={() => setShowCreateModal(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Role Filter */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Sort */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="created_at-desc">Newest First</option>
            <option value="created_at-asc">Oldest First</option>
            <option value="email-asc">Email A-Z</option>
            <option value="email-desc">Email Z-A</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="last_sign_in-desc">Last Active</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-primary-900">
                {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('activate')}
                >
                  <UserCheck className="w-4 h-4 mr-1" />
                  Activate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('deactivate')}
                >
                  <UserX className="w-4 h-4 mr-1" />
                  Deactivate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('delete')}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
            <button
              onClick={() => setSelectedUsers([])}
              className="text-primary-600 hover:text-primary-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Sign In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {getInitials(`${user.profile?.first_name || ''} ${user.profile?.last_name || ''}`.trim() || user.email)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.profile?.first_name && user.profile?.last_name
                            ? `${user.profile.first_name} ${user.profile.last_name}`
                            : user.email}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        {user.profile?.company && (
                          <div className="text-xs text-gray-400">{user.profile.company}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.profile?.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.profile?.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                      {user.profile?.role || 'user'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.is_active !== false
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_active !== false ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.last_sign_in_at ? formatDate(user.last_sign_in_at) : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this user?')) {
                            onUserDelete(user.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500">
              {searchTerm || filterRole !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first user'}
            </p>
          </div>
        )}
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onCreate={onUserCreate}
        />
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onUpdate={onUserUpdate}
        />
      )}
    </div>
  );
};

// Create User Modal Component
const CreateUserModal: React.FC<{
  onClose: () => void;
  onCreate: (user: Partial<User>) => void;
}> = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    company: '',
    role: 'user',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      email: formData.email,
      profile: {
        first_name: formData.firstName,
        last_name: formData.lastName,
        company: formData.company,
        role: formData.role,
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New User</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Create User
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit User Modal Component
const EditUserModal: React.FC<{
  user: User;
  onClose: () => void;
  onUpdate: (user: User) => void;
}> = ({ user, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    firstName: user.profile?.first_name || '',
    lastName: user.profile?.last_name || '',
    company: user.profile?.company || '',
    role: user.profile?.role || 'user',
    is_active: user.is_active !== false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...user,
      profile: {
        ...user.profile,
        first_name: formData.firstName,
        last_name: formData.lastName,
        company: formData.company,
        role: formData.role,
      },
      is_active: formData.is_active,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit User</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
            </label>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Update User
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserManagement;
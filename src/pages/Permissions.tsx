import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Plus, Trash2, Globe, Check, X } from 'lucide-react';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Card from '../components/UI/Card';
import { Permission } from '../types/profile';
import { icpService } from '../services/icp';

const Permissions: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPermission, setNewPermission] = useState({
    website: '',
    allowedFields: [] as string[]
  });

  const availableFields = [
    'name', 'email', 'phone', 'github', 'linkedin',
    'college', 'degree', 'branch', 'year',
    'projects', 'achievements', 'workExperience'
  ];

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      const perms = await icpService.getPermissions();
      setPermissions(perms);
    } catch (error) {
      console.error('Error loading permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPermission = async () => {
    if (!newPermission.website.trim() || newPermission.allowedFields.length === 0) {
      alert('Please enter a website and select at least one field.');
      return;
    }

    try {
      const success = await icpService.grantPermission(
        newPermission.website,
        newPermission.allowedFields
      );

      if (success) {
        await loadPermissions();
        setShowAddModal(false);
        setNewPermission({ website: '', allowedFields: [] });
        alert('Permission granted successfully!');
      } else {
        alert('Error granting permission. Please try again.');
      }
    } catch (error) {
      console.error('Error granting permission:', error);
      alert('Error granting permission. Please try again.');
    }
  };

  const handleRevokePermission = async (website: string) => {
    if (!confirm(`Are you sure you want to revoke access for ${website}?`)) {
      return;
    }

    try {
      const success = await icpService.revokePermission(website);
      if (success) {
        await loadPermissions();
        alert('Permission revoked successfully!');
      } else {
        alert('Error revoking permission. Please try again.');
      }
    } catch (error) {
      console.error('Error revoking permission:', error);
      alert('Error revoking permission. Please try again.');
    }
  };

  const toggleField = (field: string) => {
    setNewPermission(prev => ({
      ...prev,
      allowedFields: prev.allowedFields.includes(field)
        ? prev.allowedFields.filter(f => f !== field)
        : [...prev.allowedFields, field]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Permissions</h1>
              <p className="text-gray-600">Manage which applications can access your profile data</p>
            </div>
            
            <Button
              onClick={() => setShowAddModal(true)}
              className="flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Grant Access
            </Button>
          </div>
        </motion.div>

        {/* Permissions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Permissions</h2>
            
            {permissions.length > 0 ? (
              <div className="space-y-4">
                {permissions.map((permission, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Globe className="w-5 h-5 text-blue-600 mr-3" />
                        <div>
                          <h3 className="font-medium text-gray-900">{permission.website}</h3>
                          <p className="text-sm text-gray-600">
                            Granted on {new Date(Number(permission.grantedAt) / 1000000).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => handleRevokePermission(permission.website)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Revoke
                      </Button>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Allowed Fields:</p>
                      <div className="flex flex-wrap gap-2">
                        {permission.allowedFields.map((field, fieldIndex) => (
                          <span
                            key={fieldIndex}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            {field}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Permissions Granted</h3>
                <p className="text-gray-600 mb-4">
                  You haven't granted access to any applications yet
                </p>
                <Button onClick={() => setShowAddModal(true)}>
                  Grant First Permission
                </Button>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="flex items-start">
              <Shield className="w-6 h-6 text-blue-600 mr-3 mt-1" />
              <div>
                <h3 className="font-medium text-blue-900 mb-2">Security Notice</h3>
                <p className="text-blue-800 text-sm mb-2">
                  Your data is stored securely on the Internet Computer blockchain. Only grant access to trusted applications.
                </p>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• You can revoke access at any time</li>
                  <li>• Applications can only access the fields you explicitly allow</li>
                  <li>• All access requests are logged and tracked</li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Add Permission Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Grant Permission</h2>
                <Button
                  onClick={() => setShowAddModal(false)}
                  variant="ghost"
                  size="sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <Input
                  label="Website/Application"
                  value={newPermission.website}
                  onChange={(e) => setNewPermission(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="e.g., hackerrank.com"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Allowed Fields
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {availableFields.map((field) => (
                      <label
                        key={field}
                        className="flex items-center p-2 rounded border cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={newPermission.allowedFields.includes(field)}
                          onChange={() => toggleField(field)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700 capitalize">{field}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={handleAddPermission}
                    className="flex-1"
                  >
                    Grant Permission
                  </Button>
                  <Button
                    onClick={() => setShowAddModal(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Permissions;
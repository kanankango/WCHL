import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Download, Trash2, Key, Globe } from 'lucide-react';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import { Credential, icpService } from '../services/icp';

const Account: React.FC = () => {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [stats, setStats] = useState({
    dataSize: '0 KB',
    credentialCount: 0
  });

  useEffect(() => {
    loadAccountData();
  }, []);

  const loadAccountData = async () => {
    try {
      const profile = await icpService.getMyProfile();
      setCredentials(profile.credentials);
      setStats({
        dataSize: `${Math.round(JSON.stringify(profile.credentials).length / 1024)} KB`,
        credentialCount: profile.credentials.length
      });
    } catch (error) {
      setCredentials([]);
      setStats({ dataSize: '0 KB', credentialCount: 0 });
    }
  };

  const exportData = () => {
    if (!credentials.length) return;
    const dataStr = JSON.stringify(credentials, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'uniident-credentials.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const deleteAccount = () => {
    const confirmMessage = 'Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data from the blockchain.';
    if (confirm(confirmMessage)) {
      alert('Account deletion is not implemented in this demo. In production, this would permanently delete your data from the ICP blockchain.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
          <p className="text-gray-600">Manage your UniIdent account and data preferences</p>
        </motion.div>

        {/* Account Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="p-6">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mr-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  UniIdent User
                </h2>
                <p className="text-gray-600">{stats.credentialCount} credentials stored</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{stats.credentialCount}</div>
                <div className="text-sm text-gray-600">Credentials</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.dataSize}</div>
                <div className="text-sm text-gray-600">Data Size</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Security Settings
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <Key className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-green-900">Internet Identity</h3>
                    <p className="text-sm text-green-700">Your account is secured with ICP's Internet Identity</p>
                  </div>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center">
                  <Globe className="w-5 h-5 text-blue-600 mr-3" />
                  <div>
                    <h3 className="font-medium text-blue-900">Blockchain Storage</h3>
                    <p className="text-sm text-blue-700">Data stored securely on Internet Computer</p>
                  </div>
                </div>
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Security Features</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• End-to-end encryption for all data</li>
                  <li>• Decentralized storage on ICP blockchain</li>
                  <li>• No single point of failure</li>
                  <li>• You control your private keys</li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Data Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Management</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Export Credentials</h3>
                  <p className="text-sm text-gray-600">Download a copy of your credentials as JSON</p>
                </div>
                <Button
                  onClick={exportData}
                  variant="outline"
                  size="sm"
                  disabled={!credentials.length}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Profile Backup</h3>
                  <p className="text-sm text-gray-600">Your data is automatically backed up on the blockchain</p>
                </div>
                <div className="text-sm text-green-600 font-medium">Active</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 border-red-200">
            <h2 className="text-xl font-semibold text-red-900 mb-4">Danger Zone</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-red-900">Delete Account</h3>
                  <p className="text-sm text-red-700">
                    Permanently delete your account and all associated data from the blockchain
                  </p>
                </div>
                <Button
                  onClick={deleteAccount}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
              <div className="mt-3 text-xs text-red-600">
                <strong>Warning:</strong> This action cannot be undone. All your credentials and settings will be permanently removed from the Internet Computer blockchain.
              </div>
            </div>
          </Card>
        </motion.div>

        {/* ICP Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <div className="text-center">
              <Globe className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Powered by Internet Computer</h3>
              <p className="text-purple-700 text-sm mb-4">
                Your data is stored on the Internet Computer Protocol (ICP), ensuring maximum security, 
                decentralization, and permanence.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-purple-600">100%</div>
                  <div className="text-xs text-purple-700">Decentralized</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-600">∞</div>
                  <div className="text-xs text-purple-700">Permanent Storage</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-600">🔒</div>
                  <div className="text-xs text-purple-700">Cryptographically Secure</div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
export default Account;
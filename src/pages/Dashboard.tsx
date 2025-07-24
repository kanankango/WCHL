import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Plus, Eye, Download, Users, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import { Credential, icpService } from '../services/icp';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    try {
      const profile = await icpService.getMyProfile();
      setCredentials(profile.credentials);
    } catch (error) {
      setCredentials([]);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Credentials', value: credentials.length, icon: Shield },
    { label: 'Forms Filled', value: '12', icon: Zap },
    { label: 'Categories', value: new Set(credentials.map(c => c.category)).size, icon: Users },
  ];

  const quickActions = [
    {
      title: 'Add Credential',
      description: 'Add a new credential to your vault',
      icon: Plus,
      onClick: () => navigate('/vault'),
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Generate AutoFill JSON',
      description: 'Create form data export',
      icon: Download,
      onClick: () => navigate('/autofill'),
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Preview Autofill',
      description: 'See autofill results',
      icon: Eye,
      onClick: () => navigate('/autofill'),
      color: 'from-green-500 to-green-600'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back!
          </h1>
          <p className="text-gray-600">
            Manage your credentials and automate form filling with AI precision
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6" hover>
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg mr-4">
                    <stat.icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Credentials Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Credentials</h2>
            {credentials.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {credentials.map((cred) => (
                  <div key={cred.id} className="border border-gray-100 rounded-lg p-4">
                    <div className="font-semibold text-gray-900">{cred.label}</div>
                    <div className="text-sm text-gray-600">{cred.category}</div>
                    <div className="text-sm text-gray-700 break-all">{cred.value}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Credentials</h3>
                <p className="text-gray-600 mb-4">Start by adding your credentials to enable autofill</p>
                <Button onClick={() => navigate('/vault')}>
                  Add Credential
                </Button>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Card className="p-6 cursor-pointer" hover>
                  <div onClick={action.onClick}>
                    <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{action.description}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      Get Started
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {[
                { action: 'Credential updated', time: '2 hours ago', type: 'update' },
                { action: 'AutoFill generated for job application', time: '1 day ago', type: 'autofill' },
                { action: 'Credential added', time: '3 days ago', type: 'add' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-3 ${
                      activity.type === 'update' ? 'bg-green-500' :
                      activity.type === 'autofill' ? 'bg-blue-500' : 'bg-purple-500'
                    }`}></div>
                    <span className="text-gray-900">{activity.action}</span>
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
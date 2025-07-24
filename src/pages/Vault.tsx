import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, Trash2, Eye, EyeOff, Edit2 } from 'lucide-react';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Card from '../components/UI/Card';
import { Credential, icpService } from '../services/icp';

const emptyCredential: Credential = {
  id: '',
  category: '',
  label: '',
  value: '',
};

const Vault: React.FC = () => {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [editing, setEditing] = useState<Credential | null>(null);
  const [form, setForm] = useState<Credential>(emptyCredential);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    setLoading(true);
    try {
      const profile = await icpService.getMyProfile();
      setCredentials(profile.credentials);
    } catch (error) {
      console.error('Error loading credentials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let success = false;
      if (editing) {
        success = await icpService.editCredential(form);
      } else {
        // Generate a unique id if not set
        const cred = { ...form, id: form.id || `${form.label}-${Date.now()}` };
        success = await icpService.addCredential(cred);
      }
      if (success) {
        await loadCredentials();
        setForm(emptyCredential);
        setEditing(null);
        alert('Credential saved!');
      } else {
        alert('Error saving credential.');
      }
    } catch (error) {
      alert('Error saving credential.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (cred: Credential) => {
    setEditing(cred);
    setForm(cred);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this credential?')) return;
    try {
      const success = await icpService.deleteCredential(id);
      if (success) {
        await loadCredentials();
        alert('Credential deleted.');
      } else {
        alert('Error deleting credential.');
      }
    } catch (error) {
      alert('Error deleting credential.');
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setForm(emptyCredential);
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Vault</h1>
              <p className="text-gray-600">Manage your credentials securely on Internet Computer</p>
            </div>
            <div className="flex space-x-4">
              <Button
                onClick={() => setShowPreview(!showPreview)}
                variant="outline"
                className="flex items-center"
              >
                {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showPreview ? 'Hide Preview' : 'Preview JSON'}
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Credential Form */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{editing ? 'Edit Credential' : 'Add Credential'}</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="Category (e.g. Education, Work, Social)"
                    name="category"
                    value={form.category}
                    onChange={handleInput}
                    required
                  />
                  <Input
                    label="Label (e.g. GitHub, Email, Degree)"
                    name="label"
                    value={form.label}
                    onChange={handleInput}
                    required
                  />
                  <Input
                    label="Value"
                    name="value"
                    value={form.value}
                    onChange={handleInput}
                    required
                    className="md:col-span-2"
                  />
                </div>
                <div className="flex space-x-2 mt-4">
                  <Button onClick={handleSave} disabled={saving || !form.category || !form.label || !form.value}>
                    <Save className="w-4 h-4 mr-2" />
                    {editing ? 'Update' : 'Add'}
                  </Button>
                  {editing && (
                    <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Credentials List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Credentials</h2>
                {credentials.length === 0 ? (
                  <p className="text-gray-500">No credentials added yet.</p>
                ) : (
                  <div className="space-y-4">
                    {credentials.map((cred) => (
                      <div key={cred.id} className="flex flex-col md:flex-row md:items-center md:justify-between border border-gray-100 rounded-lg p-4">
                        <div>
                          <div className="font-semibold text-gray-900">{cred.label}</div>
                          <div className="text-sm text-gray-600">{cred.category}</div>
                          <div className="text-sm text-gray-700 break-all">{cred.value}</div>
                        </div>
                        <div className="flex space-x-2 mt-2 md:mt-0">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(cred)}>
                            <Edit2 className="w-4 h-4 mr-1" /> Edit
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(cred.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          </div>

          {/* JSON Preview */}
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <Card className="p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">JSON Preview</h3>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-auto max-h-96">
                  {JSON.stringify(credentials, null, 2)}
                </pre>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Vault;
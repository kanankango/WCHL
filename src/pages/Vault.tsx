"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Save, Plus, Trash2, Eye, EyeOff, Edit2 } from "lucide-react"
import Button from "../components/UI/Button"
import Input from "../components/UI/Input"
import Card from "../components/UI/Card"
import { type Credential, icpService } from "../services/icp"

const emptyCredential: Credential = {
  id: "",
  category: "",
  label: "",
  value: "",
}

const Vault: React.FC = () => {
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [loading, setLoading] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const [editing, setEditing] = useState<Credential | null>(null)
  const [form, setForm] = useState<Credential>(emptyCredential)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadCredentials()
  }, [])

  const loadCredentials = async () => {
    setLoading(true)
    try {
      const profile = await icpService.getMyProfile()
      setCredentials(profile.credentials)
    } catch (error) {
      console.error("Error loading credentials:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, category: e.target.value })
  }

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, label: e.target.value })
  }

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, value: e.target.value })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      let success = false
      if (editing) {
        success = await icpService.editCredential(form)
      } else {
        // Generate a unique id if not set
        const cred = { ...form, id: form.id || `${form.label}-${Date.now()}` }
        success = await icpService.addCredential(cred)
      }
      if (success) {
        await loadCredentials()
        setForm(emptyCredential)
        setEditing(null)
        alert("Credential saved!")
      } else {
        alert("Error saving credential.")
      }
    } catch (error) {
      alert("Error saving credential.")
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (cred: Credential) => {
    setEditing(cred)
    setForm(cred)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this credential?")) return
    try {
      const success = await icpService.deleteCredential(id)
      if (success) {
        await loadCredentials()
        alert("Credential deleted.")
      } else {
        alert("Error deleting credential.")
      }
    } catch (error) {
      alert("Error deleting credential.")
    }
  }

  const handleCancel = () => {
    setEditing(null)
    setForm(emptyCredential)
  }

  if (loading) {
    return (
      <>
        <style>{`
          @keyframes vaultBlob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .vault-animate-blob { animation: vaultBlob 7s infinite; }
          .vault-delay-2000 { animation-delay: 2s; }
          .vault-delay-4000 { animation-delay: 4s; }
          .vault-loading-container {
            min-height: 100vh;
            background: linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%);
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}</style>
        <div className="vault-loading-container">
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-transparent border-t-purple-400 border-r-blue-400"></div>
            <div className="absolute inset-0 animate-pulse rounded-full h-32 w-32 border-4 border-transparent border-b-purple-300 border-l-blue-300"></div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{`
        @keyframes vaultBlob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        .vault-animate-blob { animation: vaultBlob 7s infinite; }
        .vault-delay-2000 { animation-delay: 2s; }
        .vault-delay-4000 { animation-delay: 4s; }
        
        .vault-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 25%, #ddd6fe 75%, #e0e7ff 100%);
          position: relative;
        }
        
        .vault-floating-elements {
          position: fixed;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }
        
        .vault-floating-blob {
          position: absolute;
          border-radius: 50%;
          mix-blend-mode: multiply;
          filter: blur(40px);
          opacity: 0.15;
        }
        
        .vault-blob-1 {
          top: -120px;
          right: -120px;
          width: 240px;
          height: 240px;
          background: linear-gradient(135deg, #8b5cf6, #a855f7);
        }
        
        .vault-blob-2 {
          bottom: -120px;
          left: -120px;
          width: 240px;
          height: 240px;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
        }
        
        .vault-blob-3 {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 200px;
          height: 200px;
          background: linear-gradient(135deg, #06b6d4, #0891b2);
        }
        
        .vault-glass-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        .vault-glass-card:hover {
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }
        
        .vault-hero-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .vault-form-gradient {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        
        .vault-list-gradient {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
        
        .vault-preview-gradient {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }
        
        .vault-credential-item {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.9));
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 16px;
          padding: 20px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .vault-credential-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #8b5cf6, #3b82f6, #06b6d4);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .vault-credential-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
          border-color: rgba(139, 92, 246, 0.3);
        }
        
        .vault-credential-item:hover::before {
          opacity: 1;
        }
        
        .vault-form-input {
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        
        .vault-form-input:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
          background: rgba(255, 255, 255, 1);
        }
        
        .vault-button-primary {
          background: linear-gradient(135deg, #8b5cf6, #3b82f6);
          border: none;
          color: white;
          font-weight: 600;
          padding: 12px 24px;
          border-radius: 12px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        }
        
        .vault-button-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4);
        }
        
        .vault-button-secondary {
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid rgba(139, 92, 246, 0.3);
          color: #8b5cf6;
          font-weight: 600;
          padding: 10px 20px;
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        
        .vault-button-secondary:hover {
          background: rgba(139, 92, 246, 0.1);
          border-color: #8b5cf6;
        }
        
        .vault-json-preview {
          background: linear-gradient(135deg, #1a202c, #2d3748);
          border-radius: 16px;
          padding: 20px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 12px;
          line-height: 1.6;
          color: #68d391;
          max-height: 500px;
          overflow-y: auto;
          border: 1px solid rgba(104, 211, 145, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        .vault-section-header {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95));
          backdrop-filter: blur(8px);
          border-radius: 16px 16px 0 0;
          padding: 24px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
        }
        
        .vault-stats-badge {
          background: linear-gradient(135deg, #8b5cf6, #3b82f6);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
      `}</style>

      <div className="vault-container">
        {/* Floating Background Elements */}
        <div className="vault-floating-elements">
          <div className="vault-floating-blob vault-blob-1 vault-animate-blob"></div>
          <div className="vault-floating-blob vault-blob-2 vault-animate-blob vault-delay-2000"></div>
          <div className="vault-floating-blob vault-blob-3 vault-animate-blob vault-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Enhanced Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <div className="vault-glass-card rounded-3xl overflow-hidden">
              <div className="vault-hero-gradient p-8 text-white relative">
                <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                <div className="relative z-10">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="mb-6 lg:mb-0">
                      <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl font-bold mb-3"
                      >
                        🔐 Your Secure Vault
                      </motion.h1>
                      <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-lg opacity-90"
                      >
                        Manage your credentials securely on Internet Computer
                      </motion.p>
                      <div className="mt-4">
                        <span className="vault-stats-badge">
                          <span>{credentials.length}</span>
                          <span>Credentials Stored</span>
                        </span>
                      </div>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Button
                        onClick={() => setShowPreview(!showPreview)}
                        className="vault-button-secondary bg-white bg-opacity-20 border-white border-opacity-30 text-white hover:bg-opacity-30"
                      >
                        {showPreview ? <EyeOff className="w-5 h-5 mr-2" /> : <Eye className="w-5 h-5 mr-2" />}
                        {showPreview ? "Hide Preview" : "Preview JSON"}
                      </Button>
                    </motion.div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-40 h-40 bg-white bg-opacity-10 rounded-full transform -translate-y-20 translate-x-20"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white bg-opacity-5 rounded-full transform translate-y-16 -translate-x-16"></div>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Credential Form */}
            <div className={`${showPreview ? "lg:col-span-8" : "lg:col-span-12"} space-y-8`}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="vault-glass-card overflow-hidden transition-all duration-300">
                  <div className="vault-section-header">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                          {editing ? (
                            <>
                              <Edit2 className="w-6 h-6 mr-3 text-orange-500" />
                              Edit Credential
                            </>
                          ) : (
                            <>
                              <Plus className="w-6 h-6 mr-3 text-green-500" />
                              Add New Credential
                            </>
                          )}
                        </h2>
                        <p className="text-gray-600 mt-1">
                          {editing ? "Update your existing credential" : "Securely store a new credential"}
                        </p>
                      </div>
                      {editing && (
                        <div className="vault-form-gradient w-12 h-12 rounded-full flex items-center justify-center">
                          <Edit2 className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Input
                          label="Category"
                          value={form.category}
                          onChange={handleCategoryChange}
                          required
                          className="vault-form-input"
                          placeholder="e.g. Education, Work, Social"
                        />
                        <p className="text-xs text-gray-500">Group your credentials by type</p>
                      </div>
                      <div className="space-y-2">
                        <Input
                          label="Label"
                          value={form.label}
                          onChange={handleLabelChange}
                          required
                          className="vault-form-input"
                          placeholder="e.g. GitHub, Email, Degree"
                        />
                        <p className="text-xs text-gray-500">Give your credential a memorable name</p>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <Input
                          label="Value"
                          value={form.value}
                          onChange={handleValueChange}
                          required
                          className="vault-form-input"
                          placeholder="Enter the credential value"
                        />
                        <p className="text-xs text-gray-500">The actual credential data or identifier</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                      <Button
                        onClick={handleSave}
                        disabled={saving || !form.category || !form.label || !form.value}
                        className="vault-button-primary flex-1 sm:flex-none"
                      >
                        <Save className="w-5 h-5 mr-2" />
                        {saving ? "Saving..." : editing ? "Update Credential" : "Add Credential"}
                      </Button>
                      {editing && (
                        <Button onClick={handleCancel} className="vault-button-secondary">
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Credentials List */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="vault-glass-card overflow-hidden">
                  <div className="vault-section-header">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                          <div className="vault-list-gradient w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white font-bold text-sm">{credentials.length}</span>
                          </div>
                          Your Credentials
                        </h2>
                        <p className="text-gray-600 mt-1">Manage and organize your stored credentials</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    {credentials.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Plus className="w-12 h-12 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">No Credentials Yet</h3>
                        <p className="text-gray-600 max-w-md mx-auto">
                          Start building your secure credential vault by adding your first credential above.
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-6">
                        {credentials.map((cred, index) => (
                          <motion.div
                            key={cred.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="vault-credential-item group"
                          >
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                    {cred.label.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="font-bold text-gray-900 text-lg">{cred.label}</div>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                                      {cred.category}
                                    </span>
                                  </div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3 font-mono text-sm text-gray-700 break-all border-l-4 border-purple-300">
                                  {cred.value}
                                </div>
                              </div>
                              <div className="flex gap-3 lg:flex-col lg:gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleEdit(cred)}
                                  className="vault-button-secondary flex-1 lg:flex-none"
                                >
                                  <Edit2 className="w-4 h-4 mr-2" />
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleDelete(cred.id)}
                                  className="bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 flex-1 lg:flex-none"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* JSON Preview */}
            {showPreview && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-4">
                <Card className="vault-glass-card sticky top-8 overflow-hidden">
                  <div className="vault-section-header">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                      <div className="vault-preview-gradient w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                        <Eye className="w-5 h-5 text-white" />
                      </div>
                      JSON Preview
                    </h3>
                    <p className="text-gray-600 mt-1">Live preview of your credentials data</p>
                  </div>
                  <div className="p-6">
                    <pre className="vault-json-preview">{JSON.stringify(credentials, null, 2)}</pre>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Vault;

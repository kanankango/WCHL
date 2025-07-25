"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Shield, Plus, Trash2, Globe, Check, X } from "lucide-react"
import Button from "../components/UI/Button"
import Input from "../components/UI/Input"
import Card from "../components/UI/Card"
import type { Permission } from "../types/profile"

// Mock ICP service functions for demonstration
const mockICPService = {
  getPermissions: async (): Promise<Permission[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Return mock data from localStorage or empty array
    const stored = localStorage.getItem("permissions")
    return stored ? JSON.parse(stored) : []
  },

  grantPermission: async (website: string, allowedFields: string[]): Promise<boolean> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    try {
      const existing = localStorage.getItem("permissions")
      const permissions: Permission[] = existing ? JSON.parse(existing) : []

      // Check if permission already exists
      const existingIndex = permissions.findIndex((p) => p.website === website)

      const newPermission: Permission = {
        website,
        allowedFields,
        grantedAt: BigInt(Date.now() * 1000000), // Convert to nanoseconds for ICP format
      }

      if (existingIndex >= 0) {
        permissions[existingIndex] = newPermission
      } else {
        permissions.push(newPermission)
      }

      localStorage.setItem("permissions", JSON.stringify(permissions))
      return true
    } catch (error) {
      console.error("Error granting permission:", error)
      return false
    }
  },

  revokePermission: async (website: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    try {
      const existing = localStorage.getItem("permissions")
      const permissions: Permission[] = existing ? JSON.parse(existing) : []

      const filtered = permissions.filter((p) => p.website !== website)
      localStorage.setItem("permissions", JSON.stringify(filtered))
      return true
    } catch (error) {
      console.error("Error revoking permission:", error)
      return false
    }
  },
}

const Permissions: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newPermission, setNewPermission] = useState({
    website: "",
    allowedFields: [] as string[],
  })

  const availableFields = [
    "name",
    "email",
    "phone",
    "github",
    "linkedin",
    "college",
    "degree",
    "branch",
    "year",
    "projects",
    "achievements",
    "workExperience",
  ]

  useEffect(() => {
    loadPermissions()
  }, [])

  const loadPermissions = async () => {
    try {
      const perms = await mockICPService.getPermissions()
      setPermissions(perms)
    } catch (error) {
      console.error("Error loading permissions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddPermission = async () => {
    if (!newPermission.website.trim() || newPermission.allowedFields.length === 0) {
      alert("Please enter a website and select at least one field.")
      return
    }

    try {
      const success = await mockICPService.grantPermission(newPermission.website, newPermission.allowedFields)
      if (success) {
        await loadPermissions()
        setShowAddModal(false)
        setNewPermission({ website: "", allowedFields: [] })
        alert("Permission granted successfully!")
      } else {
        alert("Error granting permission. Please try again.")
      }
    } catch (error) {
      console.error("Error granting permission:", error)
      alert("Error granting permission. Please try again.")
    }
  }

  const handleRevokePermission = async (website: string) => {
    if (!confirm(`Are you sure you want to revoke access for ${website}?`)) {
      return
    }

    try {
      const success = await mockICPService.revokePermission(website)
      if (success) {
        await loadPermissions()
        alert("Permission revoked successfully!")
      } else {
        alert("Error revoking permission. Please try again.")
      }
    } catch (error) {
      console.error("Error revoking permission:", error)
      alert("Error revoking permission. Please try again.")
    }
  }

  const toggleField = (field: string) => {
    setNewPermission((prev) => ({
      ...prev,
      allowedFields: prev.allowedFields.includes(field)
        ? prev.allowedFields.filter((f) => f !== field)
        : [...prev.allowedFields, field],
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
          <div className="relative animate-spin rounded-full h-32 w-32 border-4 border-transparent border-t-white border-r-purple-400"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                Permissions
              </h1>
              <p className="text-gray-300 text-lg">Manage which applications can access your profile data</p>
            </div>

            <Button
              onClick={() => setShowAddModal(true)}
              className="flex items-center bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              Grant Access
            </Button>
          </div>
        </motion.div>

        {/* Permissions List */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <Shield className="w-6 h-6 mr-3 text-purple-400" />
              Active Permissions
            </h2>

            {permissions.length > 0 ? (
              <div className="space-y-6">
                {permissions.map((permission, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="p-3 bg-blue-500/20 rounded-full mr-4">
                          <Globe className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-lg group-hover:text-purple-200 transition-colors">
                            {permission.website}
                          </h3>
                          <p className="text-gray-400">
                            Granted on {new Date(Number(permission.grantedAt) / 1000000).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleRevokePermission(permission.website)}
                        variant="outline"
                        size="sm"
                        className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-300"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Revoke
                      </Button>
                    </div>

                    <div>
                      <p className="text-gray-300 font-medium mb-3">Allowed Fields:</p>
                      <div className="flex flex-wrap gap-2">
                        {permission.allowedFields.map((field, fieldIndex) => (
                          <span
                            key={fieldIndex}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-300 border border-green-500/30"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            {field}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-2xl"></div>
                  <Shield className="relative w-20 h-20 text-gray-400 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">No Permissions Granted</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  You haven't granted access to any applications yet
                </p>
                <Button
                  onClick={() => setShowAddModal(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
                >
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
          <Card className="bg-blue-500/10 backdrop-blur-lg border border-blue-500/20 p-8 rounded-2xl">
            <div className="flex items-start">
              <div className="p-3 bg-blue-500/20 rounded-full mr-4 mt-1">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-200 mb-3 text-lg">Security Notice</h3>
                <p className="text-blue-300 mb-4">
                  Your data is stored securely on the Internet Computer blockchain. Only grant access to trusted
                  applications.
                </p>
                <ul className="text-blue-300 space-y-2">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 mr-2 text-green-400" />
                    You can revoke access at any time
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 mr-2 text-green-400" />
                    Applications can only access the fields you explicitly allow
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 mr-2 text-green-400" />
                    All access requests are logged and tracked
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Add Permission Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 max-w-md w-full"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">Grant Permission</h2>
                <Button
                  onClick={() => setShowAddModal(false)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full p-2"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <Input
                    label="Website/Application"
                    value={newPermission.website}
                    onChange={(e) => setNewPermission((prev) => ({ ...prev, website: e.target.value }))}
                    placeholder="e.g., hackerrank.com"
                    className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Allowed Fields</label>
                  <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-2">
                    {availableFields.map((field) => (
                      <label
                        key={field}
                        className="flex items-center p-3 rounded-lg border border-white/10 cursor-pointer hover:bg-white/5 transition-all duration-200 group"
                      >
                        <input
                          type="checkbox"
                          checked={newPermission.allowedFields.includes(field)}
                          onChange={() => toggleField(field)}
                          className="mr-3 rounded border-white/20 bg-white/5 text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
                        />
                        <span className="text-sm text-gray-300 capitalize group-hover:text-white transition-colors">
                          {field}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <Button
                    onClick={handleAddPermission}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-full transition-all duration-300 transform hover:scale-105"
                  >
                    Grant Permission
                  </Button>
                  <Button
                    onClick={() => setShowAddModal(false)}
                    variant="outline"
                    className="flex-1 bg-white/5 border-white/20 text-gray-300 hover:bg-white/10 hover:text-white py-3 rounded-full transition-all duration-300"
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
  )
}

export default Permissions;

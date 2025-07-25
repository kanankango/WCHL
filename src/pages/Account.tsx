"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { User, Shield, Download, Trash2, Key, Globe } from "lucide-react"
import Button from "../components/UI/Button"
import Card from "../components/UI/Card"
import { type Credential, icpService } from "../services/icp"

const Account: React.FC = () => {
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [stats, setStats] = useState({
    dataSize: "0 KB",
    credentialCount: 0,
  })

  useEffect(() => {
    loadAccountData()
  }, [])

  const loadAccountData = async () => {
    try {
      const profile = await icpService.getMyProfile()
      setCredentials(profile.credentials)
      setStats({
        dataSize: `${Math.round(JSON.stringify(profile.credentials).length / 1024)} KB`,
        credentialCount: profile.credentials.length,
      })
    } catch (error) {
      setCredentials([])
      setStats({ dataSize: "0 KB", credentialCount: 0 })
    }
  }

  const exportData = () => {
    if (!credentials.length) return
    const dataStr = JSON.stringify(credentials, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "uniident-credentials.json"
    link.click()
    URL.revokeObjectURL(url)
  }

  const deleteAccount = () => {
    const confirmMessage =
      "Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data from the blockchain."
    if (confirm(confirmMessage)) {
      alert(
        "Account deletion is not implemented in this demo. In production, this would permanently delete your data from the ICP blockchain.",
      )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-purple-800 relative overflow-hidden py-8">
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Account Settings</h1>
          <p className="text-purple-200">Manage your UniIdent account and data preferences</p>
        </motion.div>

        {/* Account Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-purple-800/50 p-8 rounded-2xl">
            <div className="flex items-center mb-8">
              <div className="relative mr-6">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">UniIdent User</h2>
                <p className="text-purple-200">{stats.credentialCount} credentials stored</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center p-6 bg-purple-700/50 rounded-xl">
                <div className="text-3xl font-bold text-white mb-2">{stats.credentialCount}</div>
                <div className="text-purple-200">Credentials</div>
              </div>
              <div className="text-center p-6 bg-purple-700/50 rounded-xl">
                <div className="text-3xl font-bold text-white mb-2">{stats.dataSize}</div>
                <div className="text-purple-200">Data Size</div>
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
          <Card className="bg-purple-800/50 p-8 rounded-2xl">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <Shield className="w-6 h-6 mr-3 text-purple-300" />
              Security Settings
            </h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-green-800/30 rounded-xl">
                <div className="flex items-center">
                  <div className="p-3 bg-green-700/30 rounded-full mr-4">
                    <Key className="w-6 h-6 text-green-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">Internet Identity</h3>
                    <p className="text-green-200">Your account is secured with ICP's Internet Identity</p>
                  </div>
                </div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>

              <div className="flex items-center justify-between p-6 bg-blue-800/30 rounded-xl">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-700/30 rounded-full mr-4">
                    <Globe className="w-6 h-6 text-blue-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">Blockchain Storage</h3>
                    <p className="text-blue-200">Data stored securely on Internet Computer</p>
                  </div>
                </div>
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              </div>

              <div className="p-6 bg-purple-700/50 rounded-xl">
                <h3 className="font-semibold text-white mb-4 text-lg">Security Features</h3>
                <ul className="text-purple-200 space-y-3">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-300 rounded-full mr-3"></div>
                    End-to-end encryption for all data
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-300 rounded-full mr-3"></div>
                    Decentralized storage on ICP blockchain
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-300 rounded-full mr-3"></div>
                    No single point of failure
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-300 rounded-full mr-3"></div>
                    You control your private keys
                  </li>
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
          <Card className="bg-purple-800/50 p-8 rounded-2xl">
            <h2 className="text-2xl font-semibold text-white mb-6">Data Management</h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-purple-700/50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-white text-lg">Export Credentials</h3>
                  <p className="text-purple-200">Download a copy of your credentials as JSON</p>
                </div>
                <Button
                  onClick={exportData}
                  variant="outline"
                  size="sm"
                  disabled={!credentials.length}
                  className="border-purple-400 text-white hover:bg-purple-700/70 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>

              <div className="flex items-center justify-between p-6 bg-purple-700/50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-white text-lg">Profile Backup</h3>
                  <p className="text-purple-200">Your data is automatically backed up on the blockchain</p>
                </div>
                <div className="text-green-300 font-medium px-3 py-1 bg-green-800/30 rounded-full">Active</div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="bg-purple-800/50 p-8 rounded-2xl">
            <h2 className="text-2xl font-semibold text-pink-300 mb-6">Danger Zone</h2>

            <div className="bg-purple-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-pink-300 text-lg">Delete Account</h3>
                  <p className="text-pink-200">
                    Permanently delete your account and all associated data from the blockchain
                  </p>
                </div>
                <Button
                  onClick={deleteAccount}
                  variant="outline"
                  size="sm"
                  className="bg-red-500/20 border-red-400/50 text-red-300 hover:bg-red-500/30"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>

              <div className="mt-4 text-sm text-pink-200 border-l-2 border-pink-400/50 pl-4">
                <strong>Warning:</strong> This action cannot be undone. All your credentials and settings will be
                permanently removed from the Internet Computer blockchain.
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
          <Card className="bg-purple-700/40 p-8 rounded-2xl">
            <div className="text-center">
              <div className="relative mb-6 inline-block">
                <Globe className="w-16 h-16 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-3">Powered by Internet Computer</h3>
              <p className="text-purple-100 mb-6 max-w-lg mx-auto">
                Your data is stored on the Internet Computer Protocol (ICP), ensuring maximum security,
                decentralization, and permanence.
              </p>

              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="p-4 bg-purple-600/40 rounded-xl">
                  <div className="text-2xl font-bold text-white mb-1">100%</div>
                  <div className="text-purple-200">Decentralized</div>
                </div>
                <div className="p-4 bg-purple-600/40 rounded-xl">
                  <div className="text-2xl font-bold text-white mb-1">∞</div>
                  <div className="text-purple-200">Permanent Storage</div>
                </div>
                <div className="p-4 bg-purple-600/40 rounded-xl">
                  <div className="text-2xl font-bold text-white mb-1">🔒</div>
                  <div className="text-purple-200">Cryptographically Secure</div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Account;

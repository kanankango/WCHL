"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Shield, Plus, Eye, Download, Users, Zap } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Button from "../components/UI/Button"
import Card from "../components/UI/Card"
import { type Credential, icpService } from "../services/icp"

// Styles component
const DashboardStyles = () => (
  <style>{`
    @keyframes blob {
      0% {
        transform: translate(0px, 0px) scale(1);
      }
      33% {
        transform: translate(30px, -50px) scale(1.1);
      }
      66% {
        transform: translate(-20px, 20px) scale(0.9);
      }
      100% {
        transform: translate(0px, 0px) scale(1);
      }
    }

    .animate-blob {
      animation: blob 7s infinite;
    }

    .animation-delay-2000 {
      animation-delay: 2s;
    }

    .animation-delay-4000 {
      animation-delay: 4s;
    }

    .gradient-purple-blue {
      background: linear-gradient(135deg, #8b5cf6, #3b82f6);
    }

    .gradient-blue-indigo {
      background: linear-gradient(135deg, #3b82f6, #6366f1);
    }

    .gradient-green-blue {
      background: linear-gradient(135deg, #10b981, #3b82f6);
    }

    .dashboard-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fafc 0%, #dbeafe 50%, #e0e7ff 100%);
    }

    .loading-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .glass-card {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
      border: 0;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }

    .glass-card:hover {
      box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.35);
    }

    .hero-gradient {
      background: linear-gradient(135deg, #7c3aed 0%, #2563eb 50%, #4f46e5 100%);
    }

    .text-gradient {
      background: linear-gradient(135deg, #1f2937, #374151);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .progress-bar {
      height: 8px;
      background: #f3f4f6;
      border-radius: 9999px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      border-radius: 9999px;
      transition: width 1s ease-in-out;
    }

    .activity-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-top: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .credential-card {
      background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
      border: 1px solid #f3f4f6;
      border-radius: 12px;
      padding: 16px;
      transition: all 0.3s ease;
    }

    .credential-card:hover {
      border-color: #c084fc;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .credential-card:hover .credential-overlay {
      opacity: 1;
    }

    .credential-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(59, 130, 246, 0.05));
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .action-card {
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .action-card:hover {
      transform: translateY(-8px) scale(1.02);
    }

    .action-card:active {
      transform: scale(0.98);
    }

    .floating-elements {
      position: fixed;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
    }

    .floating-blob {
      position: absolute;
      border-radius: 50%;
      mix-blend-mode: multiply;
      filter: blur(40px);
      opacity: 0.2;
    }

    .floating-blob-1 {
      top: -160px;
      right: -160px;
      width: 320px;
      height: 320px;
      background: #c084fc;
    }

    .floating-blob-2 {
      bottom: -160px;
      left: -160px;
      width: 320px;
      height: 320px;
      background: #60a5fa;
    }

    .floating-blob-3 {
      top: 160px;
      left: 160px;
      width: 320px;
      height: 320px;
      background: #818cf8;
    }
  `}</style>
)

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCredentials()
  }, [])

  const loadCredentials = async () => {
    try {
      const profile = await icpService.getMyProfile()
      setCredentials(profile.credentials)
    } catch (error) {
      console.error("Failed to load credentials:", error)
      setCredentials([])
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    { label: "Credentials", value: credentials.length, icon: Shield, color: "from-purple-500 to-purple-600" },
    { label: "Forms Filled", value: "12", icon: Zap, color: "from-blue-500 to-blue-600" },
    {
      label: "Categories",
      value: new Set(credentials.map((c) => c.category)).size,
      icon: Users,
      color: "from-indigo-500 to-indigo-600",
    },
  ]

  const quickActions = [
    {
      title: "Add Credential",
      description: "Add a new credential to your vault",
      icon: Plus,
      onClick: () => navigate("/vault"),
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Generate AutoFill JSON",
      description: "Create form data export",
      icon: Download,
      onClick: () => navigate("/autofill"),
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Preview Autofill",
      description: "See autofill results",
      icon: Eye,
      onClick: () => navigate("/autofill"),
      color: "from-green-500 to-green-600",
    },
  ]

  const recentActivities = [
    { action: "Credential updated", time: "2 hours ago", type: "update" },
    { action: "AutoFill generated for job application", time: "1 day ago", type: "autofill" },
    { action: "Credential added", time: "3 days ago", type: "add" },
  ]

  if (loading) {
    return (
      <>
        <DashboardStyles />
        <div className="loading-container">
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
      <DashboardStyles />
      <div className="dashboard-container">
        {/* Floating Background Elements */}
        <div className="floating-elements">
          <div className="floating-blob floating-blob-1 animate-blob"></div>
          <div className="floating-blob floating-blob-2 animate-blob animation-delay-2000"></div>
          <div className="floating-blob floating-blob-3 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <div className="hero-gradient relative overflow-hidden rounded-3xl p-8 shadow-2xl">
              <div className="absolute inset-0 bg-black bg-opacity-10"></div>
              <div className="relative z-10">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl font-bold text-white mb-3"
                >
                  Welcome back! ✨
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-blue-100 text-lg"
                >
                  Manage your credentials and automate form filling with AI precision
                </motion.p>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full transform -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 right-8 w-24 h-24 bg-white bg-opacity-5 rounded-full transform translate-y-12"></div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.4 }}
                whileHover={{ y: -5 }}
              >
                <Card className="glass-card relative overflow-hidden transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-white from-opacity-50 to-transparent"></div>
                  <div className="relative p-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                        <stat.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold text-gradient">{stat.value}</p>
                      </div>
                    </div>
                    <div className="progress-bar">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "75%" }}
                        transition={{ delay: index * 0.2 + 0.8, duration: 1 }}
                        className={`progress-fill bg-gradient-to-r ${stat.color}`}
                      ></motion.div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Credentials Summary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="lg:col-span-2"
            >
              <Card className="glass-card overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Shield className="w-6 h-6 mr-3 text-purple-600" />
                    Your Credentials
                  </h2>
                </div>
                <div className="p-6">
                  {credentials.length > 0 ? (
                    <div className="space-y-4">
                      {credentials.map((cred, index) => (
                        <motion.div
                          key={cred.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 + 0.8 }}
                          className="credential-card group relative overflow-hidden"
                        >
                          <div className="credential-overlay"></div>
                          <div className="relative">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-semibold text-gray-900">{cred.label}</div>
                              <span className="px-3 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                                {cred.category}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 font-mono bg-gray-50 rounded-lg p-2 break-all">
                              {cred.value}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="relative mb-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto">
                          <Shield className="w-12 h-12 text-purple-600" />
                        </div>
                        <div className="absolute inset-0 w-24 h-24 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full mx-auto animate-ping opacity-20"></div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">No Credentials Yet</h3>
                      <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                        Start building your secure credential vault to enable intelligent autofill across all your forms
                      </p>
                      <Button
                        onClick={() => navigate("/vault")}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        Add Your First Credential
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
              <Card className="glass-card h-full">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 1 }}
                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div
                          className={`activity-dot ${
                            activity.type === "update"
                              ? "bg-gradient-to-r from-green-400 to-green-500"
                              : activity.type === "autofill"
                                ? "bg-gradient-to-r from-blue-400 to-blue-500"
                                : "bg-gradient-to-r from-purple-400 to-purple-500"
                          }`}
                        ></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Quick Actions</h2>
              <p className="text-gray-600">Get started with these essential features</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {quickActions.map((action, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="action-card"
                >
                  <Card className="glass-card relative overflow-hidden h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-white from-opacity-50 to-transparent"></div>
                    <div className="relative p-8" onClick={action.onClick}>
                      <div
                        className={`w-16 h-16 bg-gradient-to-r ${action.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-transform duration-300 group-hover:scale-110`}
                      >
                        <action.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 transition-colors">{action.title}</h3>
                      <p className="text-gray-600 text-sm mb-6 leading-relaxed">{action.description}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full transition-all duration-300 hover:bg-gray-900 hover:text-white hover:border-gray-900 bg-transparent"
                      >
                        Get Started
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default Dashboard;

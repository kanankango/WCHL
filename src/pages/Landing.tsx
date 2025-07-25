"use client"

import React from "react"
import { motion } from "framer-motion"
import { Shield, Bot, Download, Users, Zap } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Button from "../components/UI/Button"
import Card from "../components/UI/Card"

const features = [
  {
    icon: <Shield className="w-8 h-8 text-purple-600 mb-2" />,
    title: "Decentralized Security",
    description: "Your credentials are encrypted and stored on the ICP blockchain.",
  },
  {
    icon: <Bot className="w-8 h-8 text-blue-600 mb-2" />,
    title: "AI-Powered AutoFill",
    description: "Intelligent form field matching and autofill using advanced NLP.",
  },
  {
    icon: <Users className="w-8 h-8 text-green-600 mb-2" />,
    title: "Permissioned Access",
    description: "Grant specific applications access to only the data they need.",
  },
  {
    icon: <Download className="w-8 h-8 text-indigo-600 mb-2" />,
    title: "Easy Export",
    description: "Export your data as JSON or CSV for universal compatibility.",
  },
  {
    icon: <Zap className="w-8 h-8 text-yellow-500 mb-2" />,
    title: "Save Time",
    description: "Automate repetitive form filling and reduce errors.",
  },
]

const Landing: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 flex flex-col items-center justify-center text-center py-32 px-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="relative mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-2xl opacity-50 scale-150"></div>
          <Shield className="relative w-20 h-20 text-white drop-shadow-2xl" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-blue-200 mb-6 tracking-tight"
        >
          UniIdent
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-xl text-gray-300 max-w-3xl mb-12 leading-relaxed"
        >
          AI-Powered Credential Autofill Vault on ICP. Securely store your credentials, automate form filling, and
          control your data with blockchain security.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Button
            size="lg"
            onClick={() => navigate("/vault")}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
          >
            Get Started
          </Button>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto py-24 px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-center text-white mb-16"
        >
          Why UniIdent?
        </motion.h2>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group"
            >
              <Card className="relative overflow-hidden bg-white/10 backdrop-blur-lg border border-white/20 p-8 h-full rounded-2xl hover:bg-white/15 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="mb-4 p-3 rounded-full bg-white/10 backdrop-blur-sm">
                    {React.cloneElement(feature.icon, {
                      className: "w-8 h-8 mb-0",
                    })}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-200 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative z-10 py-24 px-4 text-center"
      >
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12">
              <h2 className="text-4xl font-bold mb-6 text-white">Ready to AutoFill Your Future?</h2>
              <p className="text-xl mb-10 text-gray-300 max-w-2xl mx-auto">
                Create your profile and experience the power of AI + Blockchain.
              </p>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/vault")}
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-900 px-12 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Create Your Vault
              </Button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
    </div>
  )
}

export default Landing;

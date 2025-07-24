"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Bot, Upload, FileText, Download, Copy, Zap } from "lucide-react"
import Button from "../components/UI/Button"
import Card from "../components/UI/Card"
import { type Credential, icpService } from "../services/icp"

const AutoFill: React.FC = () => {
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [formInput, setFormInput] = useState("")
  const [matchedCreds, setMatchedCreds] = useState<Credential[]>([])
  const [generatedJSON, setGeneratedJSON] = useState("")
  const [generatedCSV, setGeneratedCSV] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [hasProfile, setHasProfile] = useState(true)

  useEffect(() => {
    loadCredentials()
  }, [])

  const loadCredentials = async () => {
    try {
      const profile = await icpService.getMyProfile()
      setCredentials(profile.credentials)
      setHasProfile(profile.credentials.length > 0)
    } catch (error) {
      setHasProfile(false)
      setCredentials([])
    }
  }

  const processForm = async () => {
    if (!hasProfile) {
      alert("Please create your credentials first!")
      return
    }
    setIsProcessing(true)
    try {
      // For MVP, use formInput as a form type (e.g., 'internship', 'college', etc.)
      // In a real app, parse fields and do semantic matching
      const autofillCreds = await icpService.getAutofillTemplate(formInput.trim() || "")
      setMatchedCreds(autofillCreds)
      setGeneratedJSON(JSON.stringify(autofillCreds, null, 2))
      // Generate CSV
      const csv =
        "label,category,value\n" +
        autofillCreds.map((c) => `${c.label},${c.category},${c.value.replace(/\n/g, " ")}`).join("\n")
      setGeneratedCSV(csv)
    } catch (error) {
      alert("Error processing autofill.")
    } finally {
      setIsProcessing(false)
    }
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`${type} copied to clipboard!`)
    })
  }

  const sampleFormText = `internship`

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="relative bg-white shadow-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-100/40 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-100/40 to-transparent rounded-full translate-y-32 -translate-x-32"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl">
                  <Bot className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
              AutoFill Assistant
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Enter a form type (e.g., internship, college, scholarship) and get relevant credentials for autofill
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Warning Banner */}
        {!hasProfile && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="relative bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-6 shadow-xl">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-t-3xl"></div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-amber-900">Credentials Required</h3>
                  <p className="text-amber-800 mt-2 text-lg">
                    Please add your credentials in the Vault to enable autofill functionality.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Input Section */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="relative h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-3xl"></div>
              <Card className="relative bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden h-full flex flex-col">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mr-4 shadow-xl">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">Form Type Input</h2>
                      <p className="text-gray-600 mt-1 text-lg">Specify the type of form you need to fill</p>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-lg font-bold text-gray-700 mb-4">
                          Enter a form type (e.g., internship, college, scholarship)
                        </label>
                        <div className="flex flex-wrap gap-4 mb-6">
                          <Button
                            onClick={() => setFormInput(sampleFormText)}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-xl px-6 py-3 rounded-2xl font-bold text-lg"
                            size="sm"
                          >
                            <FileText className="w-5 h-5 mr-3" />
                            Load Sample
                          </Button>
                          <Button
                            disabled
                            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0 shadow-xl px-6 py-3 rounded-2xl font-bold text-lg opacity-90"
                            size="sm"
                          >
                            <Upload className="w-5 h-5 mr-3" />
                            Upload PDF (Coming Soon)
                          </Button>
                        </div>
                        <div className="relative">
                          <input
                            value={formInput}
                            onChange={(e) => setFormInput(e.target.value)}
                            placeholder="e.g. internship, college, scholarship"
                            className="w-full px-6 py-5 bg-white border-2 border-gray-200 rounded-3xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-xl placeholder-gray-400 text-gray-900 font-medium shadow-inner"
                          />
                          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none"></div>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6">
                        <h4 className="font-bold text-blue-900 mb-4 text-lg">💡 Quick Tips</h4>
                        <ul className="text-blue-800 space-y-2 text-lg">
                          <li>• Try "internship" for job applications</li>
                          <li>• Use "college" for university forms</li>
                          <li>• Enter "scholarship" for funding applications</li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-8">
                      <Button
                        onClick={processForm}
                        disabled={!formInput.trim() || !hasProfile || isProcessing}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-5 rounded-3xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 flex items-center justify-center text-xl"
                      >
                        <Zap className="w-6 h-6 mr-3" />
                        {isProcessing ? "Processing..." : "Process Form"}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <div className="relative h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-blue-600/10 rounded-3xl"></div>
              <Card className="relative bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden h-full flex flex-col">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 to-blue-600"></div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl flex items-center justify-center mr-4 shadow-xl">
                      <Bot className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">Autofill Results</h2>
                      <p className="text-gray-600 mt-1 text-lg">Matched credentials for your form</p>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col">
                    {matchedCreds.length > 0 ? (
                      <div className="space-y-6 flex-1">
                        <div className="flex-1 overflow-y-auto space-y-4 max-h-80">
                          {matchedCreds.map((cred, idx) => (
                            <motion.div
                              key={cred.id || idx}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="relative bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-3xl p-5 hover:shadow-xl transition-all duration-300"
                            >
                              <div className="absolute top-0 right-0 w-4 h-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full m-4 shadow-lg"></div>
                              <div className="pr-8">
                                <div className="font-bold text-gray-900 mb-3 text-lg">{cred.label}</div>
                                <div className="text-blue-700 bg-white/80 rounded-2xl px-4 py-3 font-mono text-sm shadow-inner">
                                  {cred.value}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        <div className="pt-6 border-t border-gray-200">
                          <div className="flex items-center justify-center mb-6">
                            <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-6 py-3 rounded-full font-bold text-lg">
                              {matchedCreds.length} credentials matched
                            </span>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <label className="font-bold text-gray-700 text-lg">Generated JSON</label>
                                <Button
                                  onClick={() => copyToClipboard(generatedJSON, "JSON")}
                                  size="sm"
                                  className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 border-0 shadow-lg px-4 py-2 rounded-xl"
                                >
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copy
                                </Button>
                              </div>
                              <pre className="bg-gray-900 text-blue-400 p-5 rounded-3xl text-sm overflow-auto max-h-40 shadow-inner">
                                {generatedJSON}
                              </pre>
                            </div>
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <label className="font-bold text-gray-700 text-lg">Generated CSV</label>
                                <Button
                                  onClick={() => copyToClipboard(generatedCSV, "CSV")}
                                  size="sm"
                                  className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 border-0 shadow-lg px-4 py-2 rounded-xl"
                                >
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copy
                                </Button>
                              </div>
                              <pre className="bg-gray-50 border border-gray-200 p-5 rounded-3xl text-sm overflow-auto max-h-40 text-gray-700 shadow-inner">
                                {generatedCSV}
                              </pre>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                          <Bot className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Process</h3>
                        <p className="text-gray-600 max-w-sm mx-auto leading-relaxed mb-8 text-lg">
                          Enter a form type on the left and click "Process Form" to see autofill results
                        </p>

                        <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 w-full max-w-sm">
                          <h4 className="font-bold text-gray-900 mb-4 text-lg">📊 Status</h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600 text-lg">Credentials Available:</span>
                              <span className="font-bold text-blue-600 text-lg">{credentials.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600 text-lg">System Status:</span>
                              <span className="font-bold text-blue-600 text-lg">Ready</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-indigo-600/5 rounded-3xl"></div>
            <Card className="relative bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
              <div className="p-10">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-indigo-800 bg-clip-text text-transparent mb-6">
                    How AutoFill Works
                  </h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Our intelligent system matches your credentials to form requirements automatically
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-10">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-center group"
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-300">
                      <FileText className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-4 text-xl">Form Type</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      Enter a form type to get relevant credentials
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-center group"
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:shadow-blue-500/25 transition-all duration-300">
                      <Bot className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-4 text-xl">Smart Matching</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">Backend selects credentials for your form</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-center group"
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:shadow-indigo-500/25 transition-all duration-300">
                      <Download className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-4 text-xl">Generate Output</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">Export as JSON or CSV for easy form filling</p>
                  </motion.div>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AutoFill;

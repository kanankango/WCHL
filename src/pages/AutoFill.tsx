import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Upload, FileText, Download, Copy, Zap } from 'lucide-react';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import { Credential, icpService } from '../services/icp';

const AutoFill: React.FC = () => {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [formInput, setFormInput] = useState('');
  const [matchedCreds, setMatchedCreds] = useState<Credential[]>([]);
  const [generatedJSON, setGeneratedJSON] = useState('');
  const [generatedCSV, setGeneratedCSV] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasProfile, setHasProfile] = useState(true);

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    try {
      const profile = await icpService.getMyProfile();
      setCredentials(profile.credentials);
      setHasProfile(profile.credentials.length > 0);
    } catch (error) {
      setHasProfile(false);
      setCredentials([]);
    }
  };

  const processForm = async () => {
    if (!hasProfile) {
      alert('Please create your credentials first!');
      return;
    }
    setIsProcessing(true);
    try {
      // For MVP, use formInput as a form type (e.g., 'internship', 'college', etc.)
      // In a real app, parse fields and do semantic matching
      const autofillCreds = await icpService.getAutofillTemplate(formInput.trim() || '');
      setMatchedCreds(autofillCreds);
      setGeneratedJSON(JSON.stringify(autofillCreds, null, 2));
      // Generate CSV
      const csv =
        'label,category,value\n' +
        autofillCreds.map(c => `${c.label},${c.category},${c.value.replace(/\n/g, ' ')}`).join('\n');
      setGeneratedCSV(csv);
    } catch (error) {
      alert('Error processing autofill.');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`${type} copied to clipboard!`);
    });
  };

  const sampleFormText = `internship`;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
              <Bot className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AutoFill Assistant</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enter a form type (e.g., internship, college, scholarship) and get relevant credentials for autofill
          </p>
        </motion.div>

        {!hasProfile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="p-6 bg-yellow-50 border-yellow-200">
              <div className="flex items-center">
                <FileText className="w-6 h-6 text-yellow-600 mr-3" />
                <div>
                  <h3 className="font-medium text-yellow-800">Credentials Required</h3>
                  <p className="text-yellow-700 text-sm">Please add your credentials in the Vault to enable autofill functionality.</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Form Type</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter a form type (e.g., internship, college, scholarship)
                </label>
                <div className="flex space-x-2 mb-4">
                  <Button
                    onClick={() => setFormInput(sampleFormText)}
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Load Sample
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                    disabled
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload PDF (Coming Soon)
                  </Button>
                </div>
                <input
                  value={formInput}
                  onChange={e => setFormInput(e.target.value)}
                  placeholder="e.g. internship, college, scholarship"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                />
              </div>
              <Button
                onClick={processForm}
                disabled={!formInput.trim() || !hasProfile || isProcessing}
                className="w-full flex items-center justify-center"
              >
                <Zap className="w-4 h-4 mr-2" />
                {isProcessing ? 'Processing...' : 'Process Form'}
              </Button>
            </Card>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Autofill Results</h2>
              {matchedCreds.length > 0 ? (
                <div className="space-y-4">
                  <div className="max-h-80 overflow-y-auto">
                    {matchedCreds.map((cred, idx) => (
                      <div key={cred.id || idx} className="flex items-center justify-between p-3 rounded-lg border bg-green-50 border-green-200">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{cred.label}</div>
                          <div className="text-sm text-green-700">{cred.value}</div>
                        </div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600 mb-4">
                      {matchedCreds.length} credentials matched
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-gray-700">Generated JSON</label>
                          <Button
                            onClick={() => copyToClipboard(generatedJSON, 'JSON')}
                            size="sm"
                            variant="outline"
                          >
                            <Copy className="w-4 h-4 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <pre className="bg-gray-900 text-green-400 p-3 rounded text-xs overflow-auto max-h-40">
                          {generatedJSON}
                        </pre>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-gray-700">Generated CSV</label>
                          <Button
                            onClick={() => copyToClipboard(generatedCSV, 'CSV')}
                            size="sm"
                            variant="outline"
                          >
                            <Copy className="w-4 h-4 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
                          {generatedCSV}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Process</h3>
                  <p className="text-gray-600">
                    Enter a form type on the left and click "Process Form" to see autofill results
                  </p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">How AutoFill Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Form Type</h3>
                <p className="text-sm text-gray-600">Enter a form type to get relevant credentials</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Bot className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Smart Matching</h3>
                <p className="text-sm text-gray-600">Backend selects credentials for your form</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Download className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Generate Output</h3>
                <p className="text-sm text-gray-600">Export as JSON or CSV for easy form filling</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AutoFill;
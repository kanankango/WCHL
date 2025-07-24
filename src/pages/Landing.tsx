import React from "react";
import { motion } from "framer-motion";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import { Shield, Bot, Download, Users, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: <Shield className="w-8 h-8 text-purple-600 mb-2" />,
    title: "Decentralized Security",
    description: "Your credentials are encrypted and stored on the ICP blockchain."
  },
  {
    icon: <Bot className="w-8 h-8 text-blue-600 mb-2" />,
    title: "AI-Powered AutoFill",
    description: "Intelligent form field matching and autofill using advanced NLP."
  },
  {
    icon: <Users className="w-8 h-8 text-green-600 mb-2" />,
    title: "Permissioned Access",
    description: "Grant specific applications access to only the data they need."
  },
  {
    icon: <Download className="w-8 h-8 text-indigo-600 mb-2" />,
    title: "Easy Export",
    description: "Export your data as JSON or CSV for universal compatibility."
  },
  {
    icon: <Zap className="w-8 h-8 text-yellow-500 mb-2" />,
    title: "Save Time",
    description: "Automate repetitive form filling and reduce errors."
  }
];

const Landing: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col items-center justify-center text-center py-24 px-4 bg-gradient-to-br from-purple-50 to-blue-50"
      >
        <Shield className="w-16 h-16 text-purple-600 mb-4" />
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          UniIdent
        </h1>
        <p className="text-xl text-gray-700 max-w-2xl mb-8">
          AI-Powered Credential Autofill Vault on ICP. Securely store your credentials, automate form filling, and control your data with blockchain security.
        </p>
        <Button size="lg" onClick={() => navigate("/vault")}>Get Started</Button>
      </motion.section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center text-gray-900 mb-12"
        >
          Why UniIdent?
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <Card className="flex flex-col items-center p-8 h-full" hover>
                {feature.icon}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
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
        className="py-20 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center"
      >
        <h2 className="text-3xl font-bold mb-4">Ready to AutoFill Your Future?</h2>
        <p className="text-lg mb-8">Create your profile and experience the power of AI + Blockchain.</p>
        <Button size="lg" variant="outline" onClick={() => navigate("/vault")}>Create Your Vault</Button>
      </motion.section>
    </div>
  );
};

export default Landing;
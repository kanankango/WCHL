# UniIdent - AI-Powered Credential Autofill Vault on ICP

UniIdent is a decentralized application (dApp) built on the Internet Computer Protocol (ICP) that allows users to securely store their credentials and use AI-powered autofill to automatically complete forms.

## 🚀 Features

- **Decentralized Profile Storage**: Store your credentials securely on ICP blockchain using Motoko smart contracts
- **AI-Powered AutoFill**: Intelligent form field matching and autofill using advanced NLP algorithms
- **Permissioned Access**: Grant specific applications access to only the data they need
- **Beautiful UI**: Modern, responsive design inspired by Story Foundation
- **Blockchain Security**: All data encrypted and stored on Internet Computer Protocol
- **Universal Compatibility**: Works with job portals, college applications, hackathons, and government forms

## 🛠 Tech Stack

- **Frontend**: React.js + TypeScript + TailwindCSS + Framer Motion
- **Backend**: Motoko smart contracts on Internet Computer
- **Blockchain**: Internet Computer Protocol (ICP)
- **AI**: Custom field matching algorithms with NLP
- **Deployment**: DFX (DFINITY SDK)

## 📦 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- DFX (DFINITY SDK) - [Install Instructions](https://internetcomputer.org/docs/current/developer-docs/setup/install)

### Local Development

1. **Clone and install dependencies**:
```bash
npm install
```

2. **Start the Internet Computer replica**:
```bash
dfx start --background
```

3. **Deploy the canisters**:
```bash
dfx deploy
```

4. **Start the frontend development server**:
```bash
npm run dev
```

5. **Access the application**:
   - Frontend: http://localhost:5173
   - Candid UI: http://127.0.0.1:4943/?canisterId={canister-id}&id={backend-canister-id}

### Production Deployment

1. **Deploy to IC mainnet**:
```bash
dfx deploy --network ic
```

2. **Build for production**:
```bash
npm run build
```

## 🏗 Architecture

### Smart Contract (Motoko)
- **Profile Management**: Store and retrieve user profiles
- **Permission System**: Manage access control for external applications  
- **AutoFill Logic**: Server-side field matching and data retrieval
- **Security**: Row-level security with Internet Identity integration

### Frontend (React)
- **Landing Page**: Marketing site with animated sections
- **Dashboard**: Overview of profile and recent activity
- **Vault**: Profile management and data entry
- **AutoFill Assistant**: Form processing and AI matching
- **Permissions**: Access control management
- **Account**: User settings and security options

### AI Engine
- **Field Parsing**: Extract form fields from text input
- **Smart Matching**: Map form fields to profile data using NLP
- **Output Generation**: Create JSON/CSV exports for forms

## 🔧 Core Functions

### Profile Management
```motoko
// Add or update user profile
public shared(msg) func addProfile(profile: Profile) : async Bool
public shared(msg) func updateProfile(profile: Profile) : async Bool
public shared query(msg) func getProfile() : async ?Profile
```

### AutoFill System
```motoko
// Get matched fields for form
public shared query(msg) func getFieldsForForm(formFields: [Text]) : async [(Text, Text)]
```

### Permission Management
```motoko
// Grant and manage permissions
public shared(msg) func grantPermission(website: Text, allowedFields: [Text]) : async Bool
public shared(msg) func revokePermission(website: Text) : async Bool
```

## 🎯 Usage

### 1. Create Your Profile
- Navigate to the Vault page
- Fill in your personal information, education, projects, and work experience
- Save your profile to the ICP blockchain

### 2. Use AutoFill Assistant
- Paste form fields or upload a form
- Click "Process Form" to see AI matching results
- Copy the generated JSON or CSV for form filling

### 3. Manage Permissions
- Grant specific applications access to your data
- Control which fields each application can access
- Revoke access at any time

## 🔐 Security Features

- **Internet Identity**: Secure authentication using ICP's native identity system
- **Blockchain Storage**: Immutable, decentralized data storage
- **Encryption**: End-to-end encryption for all sensitive data
- **Permission Control**: Granular access control for external applications
- **No Single Point of Failure**: Distributed across ICP network

## 🌟 Key Benefits

- **Save 80% of time** on repetitive form filling
- **Reduce errors** with accurate AI data mapping
- **Maintain privacy** with blockchain security
- **Universal compatibility** across platforms
- **Future-proof** with decentralized architecture

## 📱 Demo Flow

1. **Visit Landing Page**: Learn about UniIdent features
2. **Create Profile**: Add your credentials to the vault
3. **Test AutoFill**: Process sample forms with AI
4. **Grant Permissions**: Allow applications to access your data
5. **Export Data**: Generate JSON/CSV for external use

## 🚀 Deployment Commands

```bash
# Local deployment
dfx start --background
dfx deploy

# Mainnet deployment  
dfx deploy --network ic

# Frontend build
npm run build

# Development server
npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🌐 Links

- **ICP Documentation**: https://internetcomputer.org/docs
- **DFINITY SDK**: https://github.com/dfinity/sdk
- **Internet Identity**: https://identity.ic0.app

---

**Built with ❤️ on Internet Computer Protocol**

*AutoFill your future with UniIdent - the decentralized credential vault that puts you in control of your data.*
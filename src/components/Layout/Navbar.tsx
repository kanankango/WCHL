import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Home, Vault, Bot, Settings, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/vault', icon: Vault, label: 'Vault' },
    { path: '/autofill', icon: Bot, label: 'AutoFill Assistant' },
    { path: '/permissions', icon: Settings, label: 'Permissions' },
    { path: '/account', icon: User, label: 'Account' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-purple-600" />
              <span className="text-xl font-bold text-gray-900">UniIdent</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-8">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(path)
                    ? 'text-purple-600 bg-purple-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
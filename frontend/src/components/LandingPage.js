import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BeakerIcon, 
  MapIcon, 
  ChartBarIcon, 
  CogIcon,
  ArrowRightIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

/**
 * Beautiful Landing Page for H2 Optimize
 * Features hero section, benefits, and authentication
 */

const LandingPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { register, login } = useAuth();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData.email, formData.password, formData.name);
      }
      
      if (!result.success) {
        setError(result.error);
      }
      // If successful, the AuthContext will handle navigation
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({ email: '', password: '', name: '' });
    setError('');
  };

  const features = [
    {
      icon: MapIcon,
      title: 'Interactive Mapping',
      description: 'Visualize hydrogen infrastructure with advanced geospatial tools'
    },
    {
      icon: ChartBarIcon,
      title: 'Site Analysis',
      description: 'Comprehensive suitability analysis for hydrogen facility placement'
    },
    {
      icon: BeakerIcon,
      title: 'Green Technology',
      description: 'Focus on sustainable hydrogen production and distribution'
    },
    {
      icon: CogIcon,
      title: 'Optimization Tools',
      description: 'Advanced algorithms for infrastructure planning and optimization'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-hydrogen-50 via-energy-50 to-green-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #22c55e 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, #f59e0b 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="relative min-h-screen flex">
        {/* Left Side - Hero Content */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-2xl"
          >
            {/* Logo and Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-hydrogen-500 to-energy-500 rounded-xl mr-4 flex items-center justify-center">
                  <BeakerIcon className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-hydrogen-600 to-energy-600 bg-clip-text text-transparent">
                  H2 Optimize
                </h1>
              </div>
              
              <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Green Hydrogen
                <span className="block text-hydrogen-600">Infrastructure</span>
                <span className="block text-energy-600">Mapping</span>
              </h2>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Advanced geospatial analysis and optimization tools for sustainable 
                hydrogen infrastructure planning. Map, analyze, and optimize your 
                green energy future.
              </p>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 gap-4 mb-8"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="glass-panel p-4 hover:bg-white/80 transition-all duration-300"
                >
                  <feature.icon className="w-8 h-8 text-hydrogen-500 mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex items-center text-hydrogen-600 font-medium"
            >
              <span className="mr-2">Ready to optimize your hydrogen infrastructure?</span>
              <ArrowRightIcon className="w-5 h-5 animate-pulse" />
            </motion.div>
          </motion.div>
        </div>

        {/* Right Side - Authentication Form */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="w-full max-w-md"
          >
            <div className="glass-panel p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                  {isLogin ? 'Welcome Back' : 'Get Started'}
                </h3>
                <p className="text-gray-600 text-center mb-8">
                  {isLogin 
                    ? 'Sign in to access your hydrogen infrastructure dashboard' 
                    : 'Create your account to start optimizing hydrogen infrastructure'
                  }
                </p>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
                  >
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {!isLogin && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hydrogen-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your full name"
                        required={!isLogin}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hydrogen-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hydrogen-500 focus:border-transparent transition-all duration-200 pr-12"
                        placeholder="Enter your password"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {!isLogin && (
                      <p className="text-xs text-gray-500 mt-2">
                        Password must be at least 6 characters long
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-hydrogen-500 to-energy-500 text-white py-3 px-4 rounded-lg font-medium hover:from-hydrogen-600 hover:to-energy-600 focus:ring-2 focus:ring-hydrogen-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        {isLogin ? 'Signing In...' : 'Creating Account...'}
                      </>
                    ) : (
                      <>
                        {isLogin ? 'Sign In' : 'Create Account'}
                        <ArrowRightIcon className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </button>
                </form>

                {/* Toggle between login and signup */}
                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button
                      type="button"
                      onClick={toggleAuthMode}
                      className="ml-2 text-hydrogen-600 hover:text-hydrogen-700 font-medium transition-colors duration-200"
                    >
                      {isLogin ? 'Sign up' : 'Sign in'}
                    </button>
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="fixed top-8 right-8 w-20 h-20 bg-gradient-to-r from-hydrogen-400 to-energy-400 rounded-full opacity-20 animate-pulse"
      ></motion.div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="fixed bottom-8 left-8 w-16 h-16 bg-gradient-to-r from-energy-400 to-hydrogen-400 rounded-full opacity-20 animate-pulse"
      ></motion.div>
    </div>
  );
};

export default LandingPage;

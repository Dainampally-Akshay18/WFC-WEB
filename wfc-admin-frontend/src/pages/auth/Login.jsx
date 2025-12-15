import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import { Eye, EyeOff, Shield, ArrowRight, Lock, Mail, Sparkles } from 'lucide-react';
import { APP_NAME } from '@config/constants';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isHovered, setIsHovered] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = await login(formData);

    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-100 to-transparent rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-l from-cyan-100 to-transparent rounded-full blur-3xl opacity-50" />
      
      {/* Decorative Elements */}
      <div className="absolute top-8 left-8 hidden lg:block">
        <div className="flex items-center gap-2 text-slate-600">
          <Shield className="h-6 w-6 text-blue-500" />
          <span className="font-semibold text-lg">Secure Access</span>
        </div>
      </div>

      <div className="max-w-7xl w-full flex items-center justify-center gap-12">
        {/* Left Side - Branding & Info */}
        <div className="hidden lg:flex flex-col flex-1 max-w-lg space-y-8 animate-fade-in">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
                {APP_NAME}
              </h1>
            </div>
            
            <p className="text-2xl font-light text-slate-600 leading-relaxed">
              Enterprise-grade security meets intuitive design. Access your dashboard with confidence.
            </p>
          </div>

          <div className="space-y-6 pt-8">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Lock className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Military-Grade Security</h3>
                <p className="text-slate-600 text-sm">256-bit encryption & multi-factor authentication ready</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Sparkles className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Enterprise Ready</h3>
                <p className="text-slate-600 text-sm">Built for scale with enterprise SLAs and 24/7 support</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">99.9% Uptime</h3>
                <p className="text-slate-600 text-sm">Guaranteed reliability for mission-critical operations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md animate-slide-up">
          <div className="relative">
            {/* Card with Glass Morphism Effect */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
              {/* Card Accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500" />
              
              {/* Inner Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 to-transparent pointer-events-none" />

              <div className="relative">
                {/* Mobile Header */}
                <div className="lg:hidden text-center mb-8">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
                      {APP_NAME}
                    </h1>
                  </div>
                  <p className="text-slate-600">
                    Secure access to your dashboard
                  </p>
                </div>

                {/* Form Header */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-slate-600">
                    Enter your credentials to continue
                  </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Input with Icon */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </label>
                    <div className="relative group">
                      <Input
                        type="email"
                        name="email"
                        placeholder="admin@wfc.com"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        disabled={isLoading}
                        autoComplete="email"
                        required
                        className="pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 group-hover:border-slate-300"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-hover:text-slate-600 transition-colors">
                        <Mail className="h-5 w-5" />
                      </div>
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password Input with Icon */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Password
                    </label>
                    <div className="relative group">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                        disabled={isLoading}
                        autoComplete="current-password"
                        required
                        className="pl-10 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 group-hover:border-slate-300"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-hover:text-slate-600 transition-colors">
                        <Lock className="h-5 w-5" />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Global Error */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-shake">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-red-100 rounded-lg">
                          <svg className="h-4 w-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <p className="text-sm text-red-700 font-medium">{error}</p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full group relative overflow-hidden"
                    isLoading={isLoading}
                    disabled={isLoading}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isLoading ? (
                        'Signing In...'
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className={`h-4 w-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </form>

                {/* Additional Info */}
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Your data is encrypted end-to-end</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-slate-500 mt-6">
            © 2025 WFC Christian Congregation. All rights reserved.
          </p>
        </div>
      </div>

      {/* Add these styles for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .bg-grid-slate-100 {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23f1f5f9'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
        }
      `}</style>
    </div>
  );
};

export default Login;
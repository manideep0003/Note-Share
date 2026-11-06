import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import useAuth from '../hooks/useAuth';
import { APP_ROUTES } from '../utils/constants';
import { getApiErrorMessage } from '../utils/errorHelper';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Retrieve origin route for post-login redirect, defaulting to Dashboard
  const from = location.state?.from?.pathname || APP_ROUTES.DASHBOARD;

  // Authenticated users are redirected appropriately
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Campus or academic email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const response = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      toast.success(response?.message || 'Access granted to academic repository.');
      navigate(from, { replace: true });
    } catch (err) {
      const errorMsg = getApiErrorMessage(err, 'Authentication failed. Please verify credentials.');
      toast.error(errorMsg);
      setErrors((prev) => ({ ...prev, form: errorMsg }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-6 sm:py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-academic-lg bg-navy-900 text-ivory-50 items-center justify-center shadow-academic-sm mb-1">
            <GraduationCap className="w-6 h-6 text-ivory-100" />
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl text-navy-900">
            Sign In to NoteShare
          </h1>
          <p className="text-sm text-navy-800/70">
            Access your university notes archive and saved bookmarks
          </p>
        </div>

        {/* Login Card */}
        <div className="clay-card p-6 sm:p-8 rounded-academic-xl space-y-6">
          {errors.form && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-academic text-xs text-red-700 leading-relaxed">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Student / Institutional Email"
              type="email"
              name="email"
              required
              leftIcon={Mail}
              placeholder="student@university.edu"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              autoComplete="email"
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              leftIcon={Lock}
              rightIcon={showPassword ? EyeOff : Eye}
              onRightIconClick={() => setShowPassword(!showPassword)}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="current-password"
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
                loadingText="Authenticating..."
                rightIcon={ArrowRight}
              >
                Sign In
              </Button>
            </div>
          </form>

          {/* Registration Prompt */}
          <div className="text-center pt-2 border-t border-ivory-300">
            <p className="text-xs text-navy-700/80">
              New to the platform?{' '}
              <Link
                to={APP_ROUTES.REGISTER}
                className="font-semibold text-navy-900 hover:underline"
              >
                Register an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

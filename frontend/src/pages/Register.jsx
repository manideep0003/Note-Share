import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Eye, EyeOff, BookOpen, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import useAuth from '../hooks/useAuth';
import { APP_ROUTES, ROLES } from '../utils/constants';
import { getApiErrorMessage } from '../utils/errorHelper';

export const Register = () => {
  const navigate = useNavigate();
  const { isAuthenticated, register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Authenticated users are redirected appropriately
  useEffect(() => {
    if (isAuthenticated) {
      navigate(APP_ROUTES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Full student name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
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
      // Public registration strictly assigns the student role; admin privileges are never sent
      const response = await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: ROLES.STUDENT,
      });

      toast.success(response?.message || 'Academic student account created successfully!');

      // If backend returned token directly in data, user is logged in
      if (response?.data?.token || response?.token) {
        navigate(APP_ROUTES.DASHBOARD);
      } else {
        // Otherwise prompt login
        navigate(APP_ROUTES.LOGIN);
      }
    } catch (err) {
      const errorMsg = getApiErrorMessage(err, 'Registration could not be completed. Please check your details.');
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
            <BookOpen className="w-6 h-6 text-ivory-100" />
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl text-navy-900">
            Join NoteShare
          </h1>
          <p className="text-sm text-navy-800/70">
            Create your student account to exchange course materials &amp; curate notes
          </p>
        </div>

        {/* Register Card */}
        <div className="clay-card p-6 sm:p-8 rounded-academic-xl space-y-6">
          {errors.form && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-academic text-xs text-red-700 leading-relaxed">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              name="name"
              required
              leftIcon={User}
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              autoComplete="name"
            />

            <Input
              label="Institutional / Campus Email"
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
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="new-password"
            />

            {/* Academic Student Account Notice */}
            <div className="flex items-center gap-2 p-3 bg-sage-50/70 border border-sage-200/80 rounded-academic text-xs text-sage-900">
              <ShieldCheck className="w-4 h-4 text-sage-600 shrink-0" />
              <span>Standard enrollment: Automatically registers as a verified Student Member.</span>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
                loadingText="Registering..."
                rightIcon={ArrowRight}
              >
                Create Student Account
              </Button>
            </div>
          </form>

          {/* Login Prompt */}
          <div className="text-center pt-2 border-t border-ivory-300">
            <p className="text-xs text-navy-700/80">
              Already registered?{' '}
              <Link
                to={APP_ROUTES.LOGIN}
                className="font-semibold text-navy-900 hover:underline"
              >
                Sign in to your account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

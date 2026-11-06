import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  ShieldCheck,
  Calendar,
  Lock,
  Save,
  AlertCircle,
  RefreshCw,
  GraduationCap,
  Eye,
  EyeOff,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import useAuth from '../hooks/useAuth';
import userService from '../services/userService';
import { formatDate } from '../utils/formatters';
import { getApiErrorMessage } from '../utils/errorHelper';

export const Profile = () => {
  const { user: authUser, updateUser } = useAuth();

  const [profileData, setProfileData] = useState({
    name: authUser?.name || '',
    email: authUser?.email || '',
    role: authUser?.role || 'student',
    createdAt: authUser?.createdAt || null,
  });

  const [nameInput, setNameInput] = useState(authUser?.name || '');
  const [emailInput, setEmailInput] = useState(authUser?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const isNameChanged = nameInput.trim() !== profileData.name;
  const isEmailChanged =
    emailInput.trim().toLowerCase() !== (profileData.email || '').toLowerCase();
  const hasChanges = isNameChanged || isEmailChanged;

  const handleCancelEmailChange = () => {
    setEmailInput(profileData.email || '');
    setCurrentPassword('');
    setShowPassword(false);
  };

  const fetchProfile = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await userService.getProfile();
      // Backend response contract: { success: true, data: { user: {...} } } or { success: true, data: {...} }
      const remoteUser =
        response?.data?.user ||
        response?.data ||
        response?.user ||
        authUser;

      if (remoteUser) {
        setProfileData({
          name: remoteUser.name || '',
          email: remoteUser.email || '',
          role: remoteUser.role || 'student',
          createdAt: remoteUser.createdAt || null,
        });
        setNameInput(remoteUser.name || '');
        setEmailInput(remoteUser.email || '');
        setCurrentPassword('');
        updateUser(remoteUser);
      }
    } catch (err) {
      const msg = getApiErrorMessage(
        err,
        'Unable to synchronize latest profile details from server.'
      );
      setErrorMessage(msg);
      // Fallback to local authUser
      if (authUser) {
        setProfileData({
          name: authUser.name || '',
          email: authUser.email || '',
          role: authUser.role || 'student',
          createdAt: authUser.createdAt || null,
        });
        setNameInput(authUser.name || '');
        setEmailInput(authUser.email || '');
        setCurrentPassword('');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!nameInput.trim() || nameInput.trim().length < 2) {
      toast.error('Student name must be at least 2 characters.');
      return;
    }

    const trimmedEmail = emailInput.trim().toLowerCase();
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error('Please provide a valid institutional email address.');
      return;
    }

    if (isEmailChanged && !currentPassword) {
      toast.error('Enter your current password to confirm your email address change.');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {};
      if (isNameChanged) {
        payload.name = nameInput.trim();
      }
      if (isEmailChanged) {
        payload.email = trimmedEmail;
        payload.currentPassword = currentPassword;
      }

      const response = await userService.updateProfile(payload);
      const updatedUser =
        response?.data?.user ||
        response?.data ||
        response?.user || {
          ...profileData,
          ...(isNameChanged ? { name: nameInput.trim() } : {}),
          ...(isEmailChanged ? { email: trimmedEmail } : {}),
        };

      setProfileData((prev) => ({
        ...prev,
        name: updatedUser.name || (isNameChanged ? nameInput.trim() : prev.name),
        email: updatedUser.email || (isEmailChanged ? trimmedEmail : prev.email),
      }));

      setNameInput(updatedUser.name || nameInput.trim());
      setEmailInput(updatedUser.email || trimmedEmail);
      setCurrentPassword('');
      setShowPassword(false);

      updateUser(updatedUser);

      if (isEmailChanged && isNameChanged) {
        toast.success('Scholar profile and institutional email updated successfully!');
      } else if (isEmailChanged) {
        toast.success('Institutional email updated successfully!');
      } else {
        toast.success('Scholar profile updated successfully!');
      }
    } catch (err) {
      const msg = getApiErrorMessage(err, 'Failed to update profile information.');
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-2">
      {/* Header */}
      <div className="space-y-1 border-b border-ivory-300 pb-5">
        <span className="text-xs uppercase font-bold tracking-widest text-navy-700/60">
          Account Governance
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl text-navy-900">
          Student Profile
        </h1>
        <p className="text-sm text-navy-800/70">
          Review your university scholar identity, institutional email, and authorized membership status.
        </p>
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div className="clay-card p-4 rounded-academic border border-red-200 bg-red-50/30 flex items-center justify-between gap-3 text-xs text-red-800">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <Button variant="outline" size="sm" leftIcon={RefreshCw} onClick={fetchProfile}>
            Retry Sync
          </Button>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="clay-card rounded-academic-xl p-6 sm:p-8 border border-ivory-300 space-y-8">
        {/* User Identity Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-ivory-300">
          <div className="w-20 h-20 rounded-full bg-navy-900 text-ivory-50 flex items-center justify-center font-editorial text-3xl shadow-academic shrink-0 border-2 border-ivory-200">
            {profileData.name ? profileData.name.charAt(0).toUpperCase() : <User className="w-10 h-10" />}
          </div>

          <div className="space-y-1.5 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-editorial text-2xl text-navy-900 truncate">
                {profileData.name || 'Scholar'}
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sage-100 text-sage-800 border border-sage-200">
                <ShieldCheck className="w-3.5 h-3.5 text-sage-600" />
                Verified Student
              </span>
            </div>

            <p className="text-xs text-navy-700/80 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-navy-600" />
              <span>{profileData.email || 'student@university.edu'}</span>
            </p>

            {profileData.createdAt && (
              <p className="text-[11px] text-navy-700/60 flex items-center gap-1 pt-0.5">
                <Calendar className="w-3 h-3" />
                <span>Member since {formatDate(profileData.createdAt)}</span>
              </p>
            )}
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-navy-900">
              Personal Information
            </h3>

            {/* Editable Name */}
            <Input
              label="Full Student Name"
              required
              leftIcon={User}
              placeholder="e.g. John Doe"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              helperText="Displayed as author attribution on your uploaded lecture notes."
              disabled={isLoading || isSaving}
            />

            {/* Editable Institutional Email */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="profile-email"
                  className="text-xs font-semibold uppercase tracking-wider text-navy-800"
                >
                  Institutional Campus Email <span className="text-red-600 font-bold">*</span>
                </label>
                {isEmailChanged && (
                  <button
                    type="button"
                    onClick={handleCancelEmailChange}
                    className="text-[11px] text-navy-700 hover:text-navy-950 underline font-medium transition-colors"
                  >
                    Cancel change
                  </button>
                )}
              </div>
              <Input
                id="profile-email"
                type="email"
                leftIcon={Mail}
                placeholder="e.g. student@university.edu"
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value);
                  if (e.target.value.trim().toLowerCase() === (profileData.email || '').toLowerCase()) {
                    setCurrentPassword('');
                  }
                }}
                helperText={
                  isEmailChanged
                    ? 'Current password verification is required below to update your campus email.'
                    : 'Primary university email address used for campus session authentication.'
                }
                disabled={isLoading || isSaving}
                required
              />
            </div>

            {/* Current Password Verification Section (rendered strictly when email change needs confirmation) */}
            {isEmailChanged && (
              <div className="p-4 sm:p-5 rounded-academic-lg bg-ivory-200/70 border border-ivory-300 space-y-3.5 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-academic bg-navy-900 text-ivory-50 flex items-center justify-center shrink-0 shadow-academic-sm">
                    <Lock className="w-4 h-4 text-ivory-100" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-navy-900">
                      Verify Your Identity
                    </h4>
                    <p className="text-xs text-navy-700/80">
                      Enter your current password to confirm your email address change.
                    </p>
                  </div>
                </div>

                <Input
                  id="current-password"
                  type={showPassword ? 'text' : 'password'}
                  label="Current Password"
                  placeholder="Enter your current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  leftIcon={Lock}
                  rightIcon={showPassword ? EyeOff : Eye}
                  onRightIconClick={() => setShowPassword(!showPassword)}
                  autoComplete="current-password"
                  required
                  disabled={isLoading || isSaving}
                  helperText="Your password will never be stored locally or exposed."
                />
              </div>
            )}

            {/* Read-Only Academic Role */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="profile-role"
                className="text-xs font-semibold uppercase tracking-wider text-navy-800 flex items-center justify-between"
              >
                <span>Academic Account Role</span>
                <span className="text-[11px] text-navy-700/60 flex items-center gap-1 font-normal lowercase">
                  <Lock className="w-3 h-3" /> non-modifiable
                </span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="profile-role"
                  type="text"
                  value={profileData.role ? profileData.role.toUpperCase() : 'STUDENT'}
                  readOnly
                  disabled
                  className="w-full bg-ivory-200/50 text-navy-900/70 text-sm font-sans rounded-academic border border-ivory-300 py-2.5 px-3.5 cursor-not-allowed uppercase font-semibold text-xs tracking-wider select-none"
                />
              </div>
              <p className="text-xs text-navy-700/60 mt-0.5">
                Role elevation is restricted to collegiate administration to maintain academic integrity.
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-4 border-t border-ivory-300 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-navy-700/70">
              <GraduationCap className="w-4 h-4 text-navy-700 shrink-0" />
              <span>NoteShare Honor Code Protected</span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              leftIcon={Save}
              isLoading={isSaving}
              loadingText="Updating..."
              disabled={
                isLoading ||
                isSaving ||
                !hasChanges ||
                nameInput.trim().length < 2 ||
                !emailInput.trim() ||
                (isEmailChanged && !currentPassword)
              }
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;

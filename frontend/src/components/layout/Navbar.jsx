import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Upload,
  Bookmark,
  Library,
  LogOut,
  Menu,
  X,
  User,
  GraduationCap,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Button from '../common/Button';
import { APP_ROUTES } from '../../utils/constants';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate(APP_ROUTES.LOGIN);
  };

  const navLinks = [
    { label: 'Explore Notes', path: APP_ROUTES.NOTES, icon: BookOpen },
    { label: 'Dashboard', path: APP_ROUTES.DASHBOARD, icon: LayoutDashboard, authRequired: true },
    { label: 'Upload Note', path: APP_ROUTES.UPLOAD_NOTE, icon: Upload, authRequired: true },
    { label: 'Bookmarks', path: APP_ROUTES.BOOKMARKS, icon: Bookmark, authRequired: true },
    { label: 'My Uploads', path: APP_ROUTES.MY_UPLOADS, icon: Library, authRequired: true },
  ];

  const visibleLinks = navLinks.filter(
    (item) => !item.authRequired || (item.authRequired && isAuthenticated)
  );

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Academic Brand */}
          <Link
            to={APP_ROUTES.HOME}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-academic bg-navy-900 text-ivory-50 flex items-center justify-center shadow-academic-sm group-hover:bg-navy-800 transition-colors">
              <GraduationCap className="w-5 h-5 text-ivory-100" />
            </div>
            <div className="flex flex-col">
              <span className="font-editorial text-2xl text-navy-900 tracking-tight leading-none group-hover:text-navy-800 transition-colors">
                NoteShare
              </span>
              <span className="text-[10px] uppercase tracking-widest font-semibold text-navy-700/60 mt-0.5">
                Academic Exchange
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {visibleLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-2 px-3.5 py-2 rounded-academic text-sm font-medium transition-colors
                    ${
                      isActive
                        ? 'bg-navy-900 text-ivory-50 shadow-academic-sm'
                        : 'text-navy-800 hover:text-navy-950 hover:bg-ivory-200/70'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Desktop Auth Controls */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-3 border-l border-ivory-300">
                <Link
                  to={APP_ROUTES.DASHBOARD}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-academic hover:bg-ivory-200/80 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-navy-900/10 text-navy-900 border border-navy-900/20 flex items-center justify-center font-semibold text-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-navy-900 leading-tight">
                      {user?.name || 'Student'}
                    </p>
                    <span className="inline-block px-1.5 py-0.2 text-[9px] font-medium tracking-wide uppercase rounded bg-sage-100 text-sage-800 border border-sage-200/60">
                      {user?.role || 'student'}
                    </span>
                  </div>
                </Link>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  leftIcon={LogOut}
                  className="text-navy-700 hover:text-red-700"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(APP_ROUTES.LOGIN)}
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(APP_ROUTES.REGISTER)}
                >
                  Join NoteShare
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-academic text-navy-900 hover:bg-ivory-200 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-ivory-300 bg-ivory-100/95 backdrop-blur-md px-4 pt-2 pb-6 space-y-3">
          <nav className="flex flex-col gap-1">
            {visibleLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-3.5 py-2.5 rounded-academic text-sm font-medium
                    ${
                      isActive
                        ? 'bg-navy-900 text-ivory-50'
                        : 'text-navy-900 hover:bg-ivory-200'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-ivory-300">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-9 h-9 rounded-full bg-navy-900/10 text-navy-900 border border-navy-900/20 flex items-center justify-center font-bold text-sm">
                    {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy-900">{user?.name}</p>
                    <p className="text-xs text-navy-700/70">{user?.email}</p>
                  </div>
                </div>
                <Button
                  fullWidth
                  variant="outline"
                  leftIcon={LogOut}
                  onClick={handleLogout}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Button
                  fullWidth
                  variant="outline"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate(APP_ROUTES.LOGIN);
                  }}
                >
                  Sign In
                </Button>
                <Button
                  fullWidth
                  variant="primary"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate(APP_ROUTES.REGISTER);
                  }}
                >
                  Join NoteShare
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Upload,
  Library,
  Bookmark,
  User,
  LogOut,
  GraduationCap,
  Menu,
  X,
  Plus,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import ToastConfig from '../common/ToastConfig';
import { APP_ROUTES } from '../../utils/constants';

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(APP_ROUTES.LOGIN);
  };

  const navItems = [
    { label: 'Overview', path: APP_ROUTES.DASHBOARD, icon: LayoutDashboard, exact: true },
    { label: 'Explore Notes', path: APP_ROUTES.NOTES, icon: BookOpen, exact: true },
    { label: 'Upload Note', path: APP_ROUTES.UPLOAD_NOTE, icon: Upload },
    { label: 'My Uploads', path: APP_ROUTES.MY_UPLOADS, icon: Library },
    { label: 'Saved Bookmarks', path: APP_ROUTES.BOOKMARKS, icon: Bookmark },
    { label: 'Student Profile', path: APP_ROUTES.PROFILE, icon: User },
  ];

  return (
    <div className="min-h-screen bg-ivory-100 text-navy-900 flex flex-col font-sans">
      {/* Mobile Top App Bar */}
      <div className="lg:hidden sticky top-0 z-40 glass-nav px-4 py-3 flex items-center justify-between border-b border-ivory-300">
        <Link to={APP_ROUTES.HOME} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-academic bg-navy-900 text-ivory-50 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-ivory-100" />
          </div>
          <span className="font-editorial text-xl text-navy-900">NoteShare</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(APP_ROUTES.UPLOAD_NOTE)}
            className="p-1.5 rounded-academic bg-navy-900 text-ivory-50 text-xs font-medium flex items-center gap-1 shadow-academic-sm"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="p-1.5 rounded-academic text-navy-900 hover:bg-ivory-200"
            aria-label="Toggle navigation drawer"
          >
            {mobileDrawerOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div className="flex-1 flex w-full">
        {/* Desktop Left Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col justify-between bg-[#FAF9F5] border-r border-ivory-300 p-6 sticky top-0 h-screen select-none">
          <div className="space-y-6">
            {/* Brand Logo */}
            <Link to={APP_ROUTES.HOME} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-academic bg-navy-900 text-ivory-50 flex items-center justify-center shadow-academic-sm">
                <GraduationCap className="w-5 h-5 text-ivory-100" />
              </div>
              <div className="flex flex-col">
                <span className="font-editorial text-2xl text-navy-900 leading-tight">NoteShare</span>
                <span className="text-[9px] uppercase tracking-widest font-semibold text-navy-700/60">
                  Scholar Workspace
                </span>
              </div>
            </Link>

            {/* User Profile Snippet */}
            <div className="p-3.5 rounded-academic-lg bg-ivory-200/60 border border-ivory-300/80 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-navy-900 text-ivory-50 flex items-center justify-center font-bold text-xs shrink-0 shadow-academic-sm">
                {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-navy-900 truncate">{user?.name || 'Student'}</p>
                <span className="inline-block px-1.5 py-0.2 text-[9px] font-semibold uppercase tracking-wider rounded bg-sage-100 text-sage-800 border border-sage-200/60">
                  {user?.role || 'student'}
                </span>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={Boolean(item.exact)}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-3.5 py-2.5 rounded-academic text-xs font-semibold tracking-wide transition-all
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
          </div>

          {/* Bottom Actions */}
          <div className="pt-6 border-t border-ivory-300 space-y-3">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-academic text-xs font-medium text-navy-700 hover:text-red-700 hover:bg-red-50/50 transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile Navigation Drawer Overlay */}
        {mobileDrawerOpen && (
          <div
            className="lg:hidden fixed inset-0 z-50 bg-navy-950/40 backdrop-blur-sm"
            onClick={() => setMobileDrawerOpen(false)}
          >
            <div
              className="w-64 max-w-[80vw] h-full bg-[#FAF9F5] p-5 flex flex-col justify-between shadow-academic-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-ivory-300">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-academic bg-navy-900 text-ivory-50 flex items-center justify-center">
                      <GraduationCap className="w-4 h-4 text-ivory-100" />
                    </div>
                    <span className="font-editorial text-xl text-navy-900">NoteShare</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-1 rounded-md text-navy-700 hover:bg-ivory-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-3 rounded-academic bg-ivory-200/60 border border-ivory-300 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-navy-900 text-ivory-50 flex items-center justify-center font-bold text-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-navy-900 truncate">{user?.name}</p>
                    <p className="text-[10px] text-navy-700/70 truncate">{user?.email}</p>
                  </div>
                </div>

                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        end={Boolean(item.exact)}
                        onClick={() => setMobileDrawerOpen(false)}
                        className={({ isActive }) => `
                          flex items-center gap-3 px-3.5 py-2.5 rounded-academic text-xs font-semibold
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
              </div>

              <button
                type="button"
                onClick={() => {
                  setMobileDrawerOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-50 rounded-academic"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Content Pane */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <Outlet />
        </main>
      </div>

      <ToastConfig />
    </div>
  );
};

export default DashboardLayout;


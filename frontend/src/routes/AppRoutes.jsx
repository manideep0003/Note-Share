import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import { APP_ROUTES } from '../utils/constants';

// Public & Shared Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Notes from '../pages/Notes';
import NotFound from '../pages/NotFound';

// Authenticated Student Workspace Pages
import Dashboard from '../pages/Dashboard';
import UploadNote from '../pages/UploadNote';
import MyUploads from '../pages/MyUploads';
import Bookmarks from '../pages/Bookmarks';
import Profile from '../pages/Profile';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages Layout (Header & Full-Width Academic Container) */}
      <Route element={<AppLayout />}>
        <Route path={APP_ROUTES.HOME} element={<Home />} />
        <Route path={APP_ROUTES.LOGIN} element={<Login />} />
        <Route path={APP_ROUTES.REGISTER} element={<Register />} />
        <Route path={APP_ROUTES.NOTES} element={<Notes />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Authenticated Student Workspace Layout (Desktop Sidebar & Responsive Mobile Drawer) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path={APP_ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={APP_ROUTES.UPLOAD_NOTE} element={<UploadNote />} />
          <Route path={APP_ROUTES.MY_UPLOADS} element={<MyUploads />} />
          <Route path={APP_ROUTES.BOOKMARKS} element={<Bookmarks />} />
          <Route path={APP_ROUTES.PROFILE} element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;

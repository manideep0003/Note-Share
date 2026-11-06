import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Loader from '../components/common/Loader';
import { APP_ROUTES } from '../utils/constants';

/**
 * ProtectedRoute component that guards private routes from unauthenticated users
 */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory-100">
        <Loader size="lg" message="Verifying credentials..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Preserve attempted URL location for post-login redirect
    return <Navigate to={APP_ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;


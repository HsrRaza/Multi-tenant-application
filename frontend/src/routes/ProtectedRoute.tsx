import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/common/Loader';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowOnboardingOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowOnboardingOnly = false,
}) => {
  const { isAuthenticated, hasOrganization, loading } = useAuth();
  const location = useLocation();

  

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Multi-tenant check
  if (!hasOrganization && !allowOnboardingOnly) {
    // Authenticated but no organization -> force onboarding
    return <Navigate to="/onboarding" replace />;
  }

  if (hasOrganization && allowOnboardingOnly) {
    // Already in an organization -> redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

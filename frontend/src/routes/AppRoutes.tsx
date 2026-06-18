import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ProtectedRoute } from './ProtectedRoute';
import DashboardLayout from '../components/layout/DashboardLayout';

// Pages
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import OnboardingPage from '../pages/OnboardingPage';
import DashboardPage from '../pages/DashboardPage';
import ProjectsPage from '../pages/ProjectsPage';
import ProjectDetailsPage from '../pages/ProjectDetailsPage';
import MembersPage from '../pages/MembersPage';
import ProfilePage from '../pages/ProfilePage';

export const AppRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Onboarding route (requires auth, but must NOT have an organization yet) */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute allowOnboardingOnly={true}>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />

        {/* Protected SaaS routes (requires auth AND must have an organization) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ProjectsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects/:projectId"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ProjectDetailsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/members"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <MembersPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ProfilePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;

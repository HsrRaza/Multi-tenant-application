import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AnimatedPage from '../components/common/AnimatedPage';
import {
  Building,
  ArrowRight,
  Shield,
  Layers,
  Zap,
  Users,
  Compass,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-brand-bg text-brand-text overflow-x-hidden flex flex-col">
        {/* Glow Backdrops */}
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-brand-primary/10 blur-[120px] -z-10" />
        <div className="absolute top-1/3 right-1/4 h-[600px] w-[600px] rounded-full bg-blue-500/5 blur-[150px] -z-10" />

        {/* Navigation Header */}
        <header className="sticky top-0 z-40 w-full border-b border-brand-border bg-brand-bg/85 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8">
            {/* Logo */}
            <div className="flex items-center space-x-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-primary/10 border border-brand-primary/20 text-brand-primary">
                <Building className="h-5 w-5" />
              </div>
              <span className="text-base font-bold tracking-wider uppercase text-brand-text">
                SaaS Project Workspace
              </span>
            </div>

            {/* Action Buttons */}
            <nav className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-1 text-sm font-semibold text-brand-text hover:text-brand-primary transition-all duration-200"
                  >
                    <span>Go to Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="rounded-md border border-brand-border bg-brand-card px-4 py-2 text-sm font-semibold text-brand-muted hover:text-brand-text hover:border-brand-primary/30 transition-all duration-200 cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-semibold text-brand-muted hover:text-brand-text transition-all duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="rounded-md bg-brand-primary px-4 py-2 text-sm font-semibold text-brand-text hover:bg-brand-primary-hover shadow-lg shadow-brand-primary/15 transition-all duration-200"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="flex-1 mx-auto max-w-7xl px-6 pt-16 pb-24 text-center sm:px-8 lg:pt-24 min-h-screen">
          {/* Intro Badge */}
          <div className="inline-flex items-center space-x-2 rounded-full border border-brand-primary/20 bg-brand-primary/5 px-3.5 py-1 text-xs font-medium text-brand-primary mb-8 animate-pulse">
            <Zap className="h-3.5 w-3.5" />
            <span>Introducing Multi-Tenant SaaS Workspace</span>
          </div>

          {/* Hero Title */}
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl max-w-4xl mx-auto leading-tight">
            The Collaborative Space for{' '}
            <span className="bg-gradient-to-r from-brand-primary via-red-400 to-rose-500 bg-clip-text text-transparent">
              Multi-Tenant Projects
            </span>
          </h1>

          {/* Hero Subtitle */}
          <p className="mt-6 text-lg text-brand-muted max-w-2xl mx-auto leading-relaxed">
            Seamlessly organize workspaces, manage multi-tenant projects, assign team roles, and track tasks with robust security, built-in invitation codes, and a fully customizable interface.
          </p>

          {/* CTA Actions */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to={isAuthenticated ? "/dashboard" : "/signup"}
              className="flex items-center space-x-2 rounded-md bg-brand-primary px-6 py-3.5 text-base font-semibold text-brand-text hover:bg-brand-primary-hover shadow-xl shadow-brand-primary/20 transition-all duration-200 cursor-pointer"
            >
              <span>{isAuthenticated ? 'Enter Workspace' : 'Get Started Free'}</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to={isAuthenticated ? "/profile" : "/login"}
              className="rounded-md border border-brand-border bg-brand-card/50 px-6 py-3.5 text-base font-semibold text-brand-text hover:bg-brand-card hover:border-brand-primary/30 transition-all duration-200 cursor-pointer"
            >
              {isAuthenticated ? 'View Profile' : 'Sign In to Workspace'}
            </Link>
          </div>
        </section>

        {/* Features Grid Section */}
        <section className="border-brand-border bg-brand-card/10 py-24">
          <div className="mx-auto max-w-7xl px-6 sm:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Engineered for Speed, Structure, and Growth
              </h2>
              <p className="mt-4 text-base text-brand-muted">
                Built on a enterprise-grade stack to ensure complete data isolation and top-tier user experiences.
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="group rounded-xl border border-brand-border bg-brand-card/30 p-8 hover:border-brand-primary/30 hover:bg-brand-card/50 transition-all duration-300">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-primary/10 border border-brand-primary/20 text-brand-primary mb-6 transition-all duration-300 group-hover:scale-110">
                  <Building className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold">Multi-Tenancy Isolation</h3>
                <p className="mt-3 text-sm leading-relaxed text-brand-muted">
                  Create independent organizational nodes. Complete data segregation ensures your team's projects remain strictly confidential and isolated.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group rounded-xl border border-brand-border bg-brand-card/30 p-8 hover:border-brand-primary/30 hover:bg-brand-card/50 transition-all duration-300">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-6 transition-all duration-300 group-hover:scale-110">
                  <Compass className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold">Collapsible Navigation</h3>
                <p className="mt-3 text-sm leading-relaxed text-brand-muted">
                  Ditch layout clutter. Shrink your sidebar to icon-only mode with a slick border-floating slider button, optimized for maximum code and workspace view.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group rounded-xl border border-brand-border bg-brand-card/30 p-8 hover:border-brand-primary/30 hover:bg-brand-card/50 transition-all duration-300">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-6 transition-all duration-300 group-hover:scale-110">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold">Onboarding & Invite Codes</h3>
                <p className="mt-3 text-sm leading-relaxed text-brand-muted">
                  Onboard new team members instantly. Generate unique organizational invite codes to join existant groups or establish new organizational nodes.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="group rounded-xl border border-brand-border bg-brand-card/30 p-8 hover:border-brand-primary/30 hover:bg-brand-card/50 transition-all duration-300">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-6 transition-all duration-300 group-hover:scale-110">
                  <Shield className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold">Role-Based Access (RBAC)</h3>
                <p className="mt-3 text-sm leading-relaxed text-brand-muted">
                  Control access levels by assigning team members roles like Admins or Members. Set granular controls for project updates and deletions.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="group rounded-xl border border-brand-border bg-brand-card/30 p-8 hover:border-brand-primary/30 hover:bg-brand-card/50 transition-all duration-300">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-6 transition-all duration-300 group-hover:scale-110">
                  <Layers className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold">Project Workspaces</h3>
                <p className="mt-3 text-sm leading-relaxed text-brand-muted">
                  Manage development cycles efficiently with custom project cards, member assignment modals, and simple details summaries.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="group rounded-xl border border-brand-border bg-brand-card/30 p-8 hover:border-brand-primary/30 hover:bg-brand-card/50 transition-all duration-300">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-6 transition-all duration-300 group-hover:scale-110">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold">High Performance Stack</h3>
                <p className="mt-3 text-sm leading-relaxed text-brand-muted">
                  Powered by Vite, TanStack Query, Axios, Zod, and PostgreSQL for instantaneous UI state caching, schema validations, and database reliability.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-brand-border bg-brand-bg py-8 mt-auto">
          <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between text-center sm:px-8 text-sm text-brand-muted">
            <span>&copy; {new Date().getFullYear()}</span>

            {/* Centered Animated Brand Name */}
            <div className="my-4 sm:my-0 flex items-center justify-center">
              <span className="font-extrabold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-red-400 to-brand-primary animate-shimmer">
                saas project workspace
              </span>
            </div>

            <div className="flex space-x-6 mt-4 sm:mt-0">
              <span className="hover:text-brand-text transition-colors">Privacy Policy</span>
              <span className="hover:text-brand-text transition-colors">Terms of Service</span>
            </div>
          </div>
        </footer>
      </div>
    </AnimatedPage>
  );
};

export default LandingPage;

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useOrganization } from '../hooks/useOrganization';
import { useProjects } from '../hooks/useProjects';
import { Link } from 'react-router-dom';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import AnimatedPage from '../components/common/AnimatedPage';
import {
  FolderKanban,
  Users,
  Briefcase,
  Copy,
  Check,
  Building,
  Key,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, organization, role } = useAuth();
  const { useDashboardStatsQuery } = useOrganization();
  const { useProjectsQuery } = useProjects();
  const [copied, setCopied] = useState(false);

  const { data: stats, isLoading: isStatsLoading } = useDashboardStatsQuery(!!organization);
  const { data: projects, isLoading: isProjectsLoading } = useProjectsQuery(!!organization);

  const copyInviteCode = () => {
    if (organization?.invite_code) {
      navigator.clipboard.writeText(organization.invite_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isLoading = isStatsLoading || isProjectsLoading;

  if (isLoading) {
    return (
      <AnimatedPage>
        <div className="flex h-96 items-center justify-center">
          <Loader size="large" />
        </div>
      </AnimatedPage>
    );
  }

  const recentProjects = projects ? projects.slice(0, 3) : [];

  return (
    <AnimatedPage>
      <div className="space-y-8 text-brand-text">
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 pb-4 border-b border-brand-border">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
            <p className="mt-1.5 text-sm text-brand-muted">
              Overview of your team's project workspace and stats.
            </p>
          </div>

          {/* Quick Invite Code Banner */}
          <div className="flex items-center space-x-3 rounded-lg border border-brand-border bg-brand-card px-4 py-2 text-sm">
            <div className="flex items-center space-x-1.5 text-brand-muted">
              <Key className="h-4 w-4 text-brand-primary" />
              <span>Invite Code:</span>
            </div>
            <span className="font-mono font-bold tracking-wider text-brand-text">
              {organization?.invite_code}
            </span>
            <button
              onClick={copyInviteCode}
              className="rounded p-1 text-brand-muted hover:bg-brand-bg hover:text-brand-text transition-colors cursor-pointer"
              title="Copy Invite Code"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Stat 1: Total Projects */}
          <div className="flex items-center justify-between rounded-xl border border-brand-border bg-brand-card p-6 shadow-sm">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
                Total Projects
              </p>
              <p className="text-3xl font-extrabold">{stats?.totalProjects ?? 0}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
              <FolderKanban className="h-6 w-6" />
            </div>
          </div>

          {/* Stat 2: Total Members */}
          <div className="flex items-center justify-between rounded-xl border border-brand-border bg-brand-card p-6 shadow-sm">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
                Total Members
              </p>
              <p className="text-3xl font-extrabold">{stats?.totalMembers ?? 0}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
              <Users className="h-6 w-6" />
            </div>
          </div>

          {/* Stat 3: Total Assignments */}
          <div className="flex items-center justify-between rounded-xl border border-brand-border bg-brand-card p-6 shadow-sm">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
                Total Assignments
              </p>
              <p className="text-3xl font-extrabold">{stats?.totalAssignments ?? 0}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
              <Briefcase className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Organization Info Panel */}
          <div className="rounded-xl border border-brand-border bg-brand-card p-6 lg:col-span-1">
            <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
              <Building className="h-5 w-5 text-brand-primary" />
              <span>Workspace Info</span>
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-brand-border/50 pb-2">
                <span className="text-brand-muted">Name</span>
                <span className="font-semibold">{organization?.name}</span>
              </div>
              <div className="flex justify-between border-b border-brand-border/50 pb-2">
                <span className="text-brand-muted">Invite Code</span>
                <span className="font-semibold font-mono">{organization?.invite_code}</span>
              </div>
              <div className="flex justify-between border-b border-brand-border/50 pb-2">
                <span className="text-brand-muted">Your Role</span>
                <span className="font-semibold capitalize text-brand-primary">{role}</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-brand-muted">Active User</span>
                <span className="font-semibold truncate max-w-[150px]">{user?.name}</span>
              </div>
            </div>
          </div>

          {/* Recent Projects Panel */}
          <div className="rounded-xl border border-brand-border bg-brand-card p-6 lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center space-x-2">
                <FolderKanban className="h-5 w-5 text-brand-primary" />
                <span>Recent Projects</span>
              </h3>
              <Link
                to="/projects"
                className="text-xs font-semibold text-brand-primary hover:text-brand-primary-hover transition-colors"
              >
                View All
              </Link>
            </div>

            {recentProjects.length === 0 ? (
              <EmptyState
                title="No projects yet"
                description="Create a project to start planning workloads and assignments."
              />
            ) : (
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between rounded-lg border border-brand-border bg-brand-bg/50 p-4 transition-all hover:border-brand-primary/50"
                  >
                    <div className="space-y-1 text-left">
                      <h4 className="font-bold text-brand-text">{project.name}</h4>
                      <p className="text-xs text-brand-muted truncate max-w-[300px] sm:max-w-[450px]">
                        {project.description || 'No description provided.'}
                      </p>
                    </div>
                    <Link
                      to={`/projects/${project.id}`}
                      className="rounded-md bg-brand-bg border border-brand-border px-3 py-1.5 text-xs font-medium text-brand-text hover:bg-brand-card hover:border-brand-primary transition-all"
                    >
                      Manage
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default DashboardPage;

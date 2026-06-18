import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProjects } from '../hooks/useProjects';
import AssignMemberModal from '../components/project/AssignMemberModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import AnimatedPage from '../components/common/AnimatedPage';
import {
  ArrowLeft,
  Calendar,
  User,
  UserMinus,
  UserPlus,
  Briefcase,
  FileText,
  ShieldAlert,
} from 'lucide-react';

export const ProjectDetailsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { role } = useAuth();
  const { useProjectMembersQuery, removeMember } = useProjects();

  const id = Number(projectId);
  const isAdmin = role === 'admin';

  // Modal States
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [removingUserId, setRemovingUserId] = useState<number | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const { data: projectData, isLoading, error } = useProjectMembersQuery(id, !isNaN(id));

  const handleRemoveConfirm = async () => {
    if (removingUserId === null || isNaN(id)) return;
    setIsRemoving(true);
    try {
      await removeMember({
        projectId: id,
        userId: removingUserId,
      });
      setRemovingUserId(null);
    } catch (err) {
      console.error('Failed to remove member:', err);
    } finally {
      setIsRemoving(false);
    }
  };

  if (isNaN(id)) {
    return (
      <AnimatedPage>
        <div className="text-center py-12 text-brand-text">
          <p className="text-red-500 font-semibold mb-4">Invalid Project ID</p>
          <Link to="/projects" className="text-brand-primary hover:underline">
            Back to Projects
          </Link>
        </div>
      </AnimatedPage>
    );
  }

  if (isLoading) {
    return (
      <AnimatedPage>
        <div className="flex h-96 items-center justify-center">
          <Loader size="large" />
        </div>
      </AnimatedPage>
    );
  }

  if (error || !projectData) {
    return (
      <AnimatedPage>
        <div className="text-center py-12 text-brand-text space-y-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold">Project Not Found</h3>
          <p className="text-sm text-brand-muted">
            The project may have been deleted, or you might not have authorization to view it.
          </p>
          <Link
            to="/projects"
            className="inline-flex items-center text-sm font-semibold text-brand-primary hover:underline"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            <span>Back to Projects</span>
          </Link>
        </div>
      </AnimatedPage>
    );
  }

  const { project, members } = projectData;
  const assignedMemberIds = members.map((m) => m.id);

  const formattedDate = new Date(project.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <AnimatedPage>
      <div className="space-y-8 text-brand-text">
        {/* Back Breadcrumb */}
        <div className="text-left">
          <Link
            to="/projects"
            className="inline-flex items-center text-xs font-semibold text-brand-muted hover:text-brand-text transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="mr-1 h-3.5 w-3.5" />
            <span>Back to Projects</span>
          </Link>
        </div>

        {/* Header Info */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-4 md:space-y-0 pb-6 border-b border-brand-border">
          <div className="text-left space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight">{project.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-brand-muted">
              <span className="flex items-center space-x-1">
                <Calendar className="h-4 w-4 text-brand-primary" />
                <span>Created on {formattedDate}</span>
              </span>
            </div>
          </div>

          {isAdmin && (
            <Button
              variant="primary"
              onClick={() => setIsAssignOpen(true)}
              className="flex items-center space-x-2 self-start md:self-auto"
            >
              <UserPlus className="h-4 w-4" />
              <span>Assign Member</span>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left 2 Cols: Description & Members List */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="rounded-xl border border-brand-border bg-brand-card p-6 space-y-3">
              <h3 className="text-lg font-bold flex items-center space-x-2 border-b border-brand-border/50 pb-3">
                <FileText className="h-5 w-5 text-brand-primary" />
                <span>Project Description</span>
              </h3>
              <p className="text-sm text-brand-muted leading-relaxed text-left whitespace-pre-line">
                {project.description || 'No description provided for this project.'}
              </p>
            </div>

            {/* Project Members List */}
            <div className="rounded-xl border border-brand-border bg-brand-card p-6 space-y-4">
              <h3 className="text-lg font-bold flex items-center space-x-2">
                <User className="h-5 w-5 text-brand-primary" />
                <span>Assigned Team Members ({members.length})</span>
              </h3>

              {members.length === 0 ? (
                <EmptyState
                  title="No members assigned"
                  description="This project currently has no assigned team members. Workloads will not track for this project."
                  actionText={isAdmin ? 'Assign First Member' : undefined}
                  onAction={isAdmin ? () => setIsAssignOpen(true) : undefined}
                />
              ) : (
                <div className="overflow-hidden rounded-lg border border-brand-border">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-brand-border">
                      <thead className="bg-brand-bg/60">
                        <tr>
                          <th className="px-6 py-3.5 text-left text-xs font-semibold text-brand-muted uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3.5 text-left text-xs font-semibold text-brand-muted uppercase tracking-wider">
                            Email Address
                          </th>
                          {isAdmin && (
                            <th className="px-6 py-3.5 text-right text-xs font-semibold text-brand-muted uppercase tracking-wider">
                              Actions
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-border/50 bg-brand-card/20">
                        {members.map((member) => (
                          <tr key={member.id} className="hover:bg-brand-card/50 transition-colors">
                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-brand-text text-left">
                              <div className="flex items-center space-x-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold uppercase">
                                  {member.name.slice(0, 2)}
                                </div>
                                <span>{member.name}</span>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-brand-muted text-left">
                              {member.email}
                            </td>
                            {isAdmin && (
                              <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setRemovingUserId(member.id)}
                                  className="p-1.5 cursor-pointer"
                                  title="Remove member from project"
                                >
                                  <UserMinus className="h-4 w-4 text-brand-muted hover:text-red-500" />
                                </Button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right 1 Col: Summary Panel */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-brand-border bg-brand-card p-6 space-y-4">
              <h3 className="text-lg font-bold flex items-center space-x-2 border-b border-brand-border/50 pb-3">
                <Briefcase className="h-5 w-5 text-brand-primary" />
                <span>Project Summary</span>
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between border-b border-brand-border/50 pb-2">
                  <span className="text-brand-muted">Status</span>
                  <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400 border border-green-500/20">
                    Active
                  </span>
                </div>
                <div className="flex justify-between border-b border-brand-border/50 pb-2">
                  <span className="text-brand-muted">Assigned Members</span>
                  <span className="font-semibold">{members.length}</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-brand-muted">Project ID</span>
                  <span className="font-semibold font-mono text-brand-primary">{project.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assign Member Modal */}
        <AssignMemberModal
          isOpen={isAssignOpen}
          onClose={() => setIsAssignOpen(false)}
          projectId={id}
          assignedMemberIds={assignedMemberIds}
        />

        {/* Remove Member Confirmation */}
        <ConfirmDialog
          isOpen={removingUserId !== null}
          title="Remove Member from Project"
          message="Are you sure you want to remove this member? They will lose access to the project details and workloads assignments."
          confirmText="Remove Member"
          cancelText="Cancel"
          confirmVariant="danger"
          isLoading={isRemoving}
          onConfirm={handleRemoveConfirm}
          onCancel={() => setRemovingUserId(null)}
        />
      </div>
    </AnimatedPage>
  );
};

export default ProjectDetailsPage;

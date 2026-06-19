import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useProjects } from '../hooks/useProjects';
import ProjectCard from '../components/project/ProjectCard';
import CreateProjectModal from '../components/project/CreateProjectModal';
import EditProjectModal from '../components/project/EditProjectModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import AnimatedPage from '../components/common/AnimatedPage';
import { FolderKanban, Plus } from 'lucide-react';
import type { Project } from '../types/project.types';

export const ProjectsPage: React.FC = () => {
  const { role } = useAuth();
  const { useProjectsQuery, deleteProject } = useProjects();
  const isAdmin = role === 'admin';

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: projects, isLoading } = useProjectsQuery(true);

  const handleDeleteConfirm = async () => {
    if (deletingProjectId === null) return;
    setIsDeleting(true);
    try {
      await deleteProject(deletingProjectId);
      setDeletingProjectId(null);
    } catch (err) {
      console.error('Failed to delete project:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <AnimatedPage>
        <div className="flex h-96 items-center justify-center">
          <Loader size="large" />
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="space-y-8 text-brand-text">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 pb-4 border-b border-brand-border">
          <div className="text-left">
            <h1 className="text-3xl font-extrabold tracking-tight flex items-center space-x-2">
              <span>Projects</span>
            </h1>
            <p className="mt-1.5 text-sm text-brand-muted">
              Manage, organize, and view all projects assigned in your organization workspace.
            </p>
          </div>

          {isAdmin && (
            <Button
              variant="primary"
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center space-x-2 self-start sm:self-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Create Project</span>
            </Button>
          )}
        </div>

        {/* Grid List */}
        {!projects || projects.length === 0 ? (
          <EmptyState
            title="No projects found"
            description="It looks like there are no projects in this workspace yet."
            icon={FolderKanban}
            actionText={isAdmin ? 'Create First Project' : undefined}
            onAction={isAdmin ? () => setIsCreateOpen(true) : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isAdmin={isAdmin}
                onEdit={(proj) => setEditingProject(proj)}
                onDelete={(id) => setDeletingProjectId(id)}
              />
            ))}
          </div>
        )}

        {/* Create Project Modal */}
        <CreateProjectModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
        />

        {/* Edit Project Modal */}
        <EditProjectModal
          isOpen={!!editingProject}
          onClose={() => setEditingProject(null)}
          project={editingProject}
        />

        {/* Delete Confirmation Modal */}
        <ConfirmDialog
          isOpen={deletingProjectId !== null}
          title="Delete Project"
          message="Are you sure you want to delete this project? This will permanently delete the project and all assignments. This action cannot be undone."
          confirmText="Delete Project"
          cancelText="Cancel"
          confirmVariant="danger"
          isLoading={isDeleting}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingProjectId(null)}
        />
      </div>
    </AnimatedPage>
  );
};

export default ProjectsPage;

import React from 'react';
import type { Project } from '../../types/project.types';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, ArrowRight, FolderKanban } from 'lucide-react';
import Button from '../common/Button';

interface ProjectCardProps {
  project: Project;
  isAdmin: boolean;
  onEdit: (project: Project) => void;
  onDelete: (projectId: number) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isAdmin,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex flex-col h-full rounded-xl border border-brand-border bg-brand-card p-6 transition-all hover:border-brand-primary/50 shadow-sm text-brand-text">
      {/* Title */}
      <div className="flex items-center space-x-3 mb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
          <FolderKanban className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-bold truncate text-left flex-1">{project.name}</h3>
      </div>

      {/* Description */}
      <p className="text-sm text-brand-muted text-left flex-1 min-h-[50px] line-clamp-3 mb-6">
        {project.description || 'No description provided.'}
      </p>

      {/* Footer controls */}
      <div className="flex items-center justify-between border-t border-brand-border/50 pt-4 mt-auto">
        <Link
          to={`/projects/${project.id}`}
          className="inline-flex items-center text-xs font-semibold text-brand-primary hover:text-brand-primary-hover transition-colors"
        >
          <span>View Details</span>
          <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </Link>

        {isAdmin && (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(project)}
              className="p-1.5"
              title="Edit Project"
            >
              <Edit2 className="h-3.5 w-3.5 text-brand-muted hover:text-brand-text" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(project.id)}
              className="p-1.5"
              title="Delete Project"
            >
              <Trash2 className="h-3.5 w-3.5 text-brand-muted hover:text-red-500" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;

import React, { useState, useEffect } from 'react';
import { useProjects } from '../../hooks/useProjects';
import type { Project } from '../../types/project.types';
import Input from '../common/Input';
import Button from '../common/Button';
import { ShieldAlert } from 'lucide-react';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export const EditProjectModal: React.FC<EditProjectModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const { updateProject, isUpdatingProject } = useProjects();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description || '');
    }
  }, [project]);

  if (!isOpen || !project) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Project name is required');
      return;
    }

    try {
      await updateProject({
        projectId: project.id,
        name,
        description,
      });
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update project.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-bg/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-lg border border-brand-border bg-brand-card p-6 shadow-xl transition-all text-brand-text">
        <h3 className="text-lg font-medium leading-6 mb-4">Edit Project</h3>

        {error && (
          <div className="flex items-center space-x-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400 mb-4">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Project Name"
            type="text"
            placeholder="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isUpdatingProject}
          />

          <div className="text-left">
            <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              className="w-full rounded-md border border-brand-border bg-brand-bg/50 px-3 py-2 text-sm text-brand-text placeholder-gray-500 transition-all focus:border-brand-primary focus:bg-brand-bg focus:outline-none focus:ring-1 focus:ring-brand-primary disabled:opacity-50"
              rows={3}
              placeholder="Provide a brief summary of the goals..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isUpdatingProject}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <Button variant="secondary" onClick={onClose} type="button" disabled={isUpdatingProject}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isUpdatingProject}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProjectModal;

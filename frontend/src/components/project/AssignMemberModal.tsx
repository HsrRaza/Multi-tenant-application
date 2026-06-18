import React, { useState } from 'react';
import { useOrganization } from '../../hooks/useOrganization';
import { useProjects } from '../../hooks/useProjects';
import Button from '../common/Button';
import Loader from '../common/Loader';
import { ShieldAlert, UserPlus } from 'lucide-react';

interface AssignMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  assignedMemberIds: number[];
}

export const AssignMemberModal: React.FC<AssignMemberModalProps> = ({
  isOpen,
  onClose,
  projectId,
  assignedMemberIds,
}) => {
  const { useMembersQuery } = useOrganization();
  const { assignMember, isAssigningMember } = useProjects();
  const [selectedUserId, setSelectedUserId] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);

  const { data: orgMembers, isLoading: isMembersLoading } = useMembersQuery(isOpen);

  if (!isOpen) return null;

  // Filter out members who are already assigned to this project
  const availableMembers = orgMembers
    ? orgMembers.filter((m) => !assignedMemberIds.includes(m.id))
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (selectedUserId === '') {
      setError('Please select a member to assign');
      return;
    }

    try {
      await assignMember({
        projectId,
        userId: Number(selectedUserId),
      });
      setSelectedUserId('');
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to assign member to project.');
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
        <h3 className="text-lg font-medium leading-6 mb-4 flex items-center space-x-2">
          <UserPlus className="h-5 w-5 text-brand-primary" />
          <span>Assign Member to Project</span>
        </h3>

        {error && (
          <div className="flex items-center space-x-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400 mb-4">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {isMembersLoading ? (
          <div className="py-8">
            <Loader />
          </div>
        ) : availableMembers.length === 0 ? (
          <div className="space-y-4 py-4">
            <p className="text-sm text-brand-muted">
              All organization members are already assigned to this project.
            </p>
            <div className="flex justify-end">
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-left">
              <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1.5">
                Select Member
              </label>
              <select
                className="w-full rounded-md border border-brand-border bg-brand-bg/50 px-3 py-2 text-sm text-brand-text placeholder-gray-500 transition-all focus:border-brand-primary focus:bg-brand-bg focus:outline-none focus:ring-1 focus:ring-brand-primary"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : '')}
                disabled={isAssigningMember}
              >
                <option value="" className="bg-brand-card">
                  Select a team member...
                </option>
                {availableMembers.map((member) => (
                  <option key={member.id} value={member.id} className="bg-brand-card">
                    {member.name} ({member.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <Button variant="secondary" onClick={onClose} type="button" disabled={isAssigningMember}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" isLoading={isAssigningMember}>
                Assign Member
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AssignMemberModal;

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useOrganization } from '../hooks/useOrganization';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Button from '../components/common/Button';
import AnimatedPage from '../components/common/AnimatedPage';
import { User, Mail, Shield, Building, LogOut, ShieldAlert } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, organization, role } = useAuth();
  const { leaveOrganization, isLeavingOrg } = useOrganization();
  const navigate = useNavigate();

  const [isLeaveOpen, setIsLeaveOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLeaveConfirm = async () => {
    setError(null);
    try {
      await leaveOrganization();
      setIsLeaveOpen(false);
      navigate('/onboarding', { replace: true });
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to leave organization. Admins cannot leave without transferring ownership or deleting the organization first.');
      setIsLeaveOpen(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <AnimatedPage>
      <div className="max-w-3xl mx-auto space-y-8 text-brand-text">
        {/* Header */}
        <div className="pb-4 border-b border-brand-border text-left">
          <h1 className="text-3xl font-extrabold tracking-tight">Profile Settings</h1>
          <p className="mt-1.5 text-sm text-brand-muted">
            Manage your personal details and organization membership status.
          </p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            <ShieldAlert className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Profile Info Card */}
        <div className="rounded-xl border border-brand-border bg-brand-card p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-brand-border/50">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-primary/10 border border-brand-primary/25 text-2xl font-extrabold text-brand-primary uppercase">
              {user?.name ? getInitials(user.name) : <User className="h-10 w-10" />}
            </div>
            <div className="text-center sm:text-left space-y-1">
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="text-sm text-brand-muted flex items-center justify-center sm:justify-start space-x-1">
                <Mail className="h-4 w-4 text-brand-primary" />
                <span>{user?.email}</span>
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 pt-6">
            <div className="text-left space-y-1">
              <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
                Organization
              </span>
              <div className="flex items-center space-x-2 text-sm font-semibold">
                <Building className="h-4 w-4 text-brand-primary" />
                <span>{organization?.name || 'No Organization'}</span>
              </div>
            </div>

            <div className="text-left space-y-1">
              <span className="text-xs font-semibold text-brand-muted uppercase tracking-wider">
                Workspace Role
              </span>
              <div className="flex items-center space-x-2 text-sm font-semibold capitalize">
                <Shield className="h-4 w-4 text-brand-primary" />
                <span>{role || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone Card */}
        {organization && (
          <div className="rounded-xl border border-red-500/20 bg-red-950/10 p-8 shadow-sm space-y-6">
            <div className="text-left">
              <h3 className="text-lg font-bold text-red-500">Danger Zone</h3>
              <p className="text-sm text-brand-muted mt-1">
                Actions related to leaving or modifying your current workspace enrollment.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 rounded-lg border border-brand-border bg-brand-bg/50 p-6 text-left">
              <div className="space-y-1">
                <h4 className="text-sm font-bold">Leave Organization</h4>
                <p className="text-xs text-brand-muted">
                  Remove yourself from the <span className="font-semibold">{organization.name}</span> workspace. You will lose access to all projects and workloads.
                </p>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setIsLeaveOpen(true)}
                className="flex items-center space-x-2 shrink-0 self-start sm:self-auto"
              >
                <LogOut className="h-4 w-4" />
                <span>Leave Workspace</span>
              </Button>
            </div>
          </div>
        )}

        {/* Leave Organization Dialog */}
        <ConfirmDialog
          isOpen={isLeaveOpen}
          title="Leave Organization"
          message={`Are you sure you want to leave ${organization?.name}? You will lose access to all its projects, members directory, and workspace resources immediately.`}
          confirmText="Leave Organization"
          cancelText="Cancel"
          confirmVariant="danger"
          isLoading={isLeavingOrg}
          onConfirm={handleLeaveConfirm}
          onCancel={() => setIsLeaveOpen(false)}
        />
      </div>
    </AnimatedPage>
  );
};

export default ProfilePage;

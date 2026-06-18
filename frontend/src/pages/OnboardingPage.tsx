import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrganization } from '../hooks/useOrganization';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import AnimatedPage from '../components/common/AnimatedPage';
import { PlusCircle, Key, LogOut, Building, ShieldAlert } from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const { createOrganization, joinOrganization, isCreatingOrg, isJoiningOrg } = useOrganization();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [orgName, setOrgName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    if (!orgName.trim()) {
      setCreateError('Organization name is required');
      return;
    }

    try {
      await createOrganization(orgName);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      console.error(err);
      setCreateError(err.response?.data?.message || 'Failed to create organization.');
    }
  };

  const handleJoinOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    setJoinError(null);
    if (!inviteCode.trim()) {
      setJoinError('Invite code is required');
      return;
    }

    try {
      await joinOrganization(inviteCode);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      console.error(err);
      setJoinError(err.response?.data?.message || 'Failed to join organization. Please check invite code.');
    }
  };

  return (
    <AnimatedPage>
      <div className="flex min-h-screen flex-col bg-brand-bg px-4 py-12 sm:px-6 lg:px-8 text-brand-text">
        {/* Top Header */}
        <div className="mx-auto w-full max-w-4xl flex items-center justify-between mb-12">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-primary/10 border border-brand-primary/20 text-brand-primary">
              <Building className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-wider uppercase">SaaS Project Workspace</span>
          </div>
          <button
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
            className="flex items-center space-x-2 text-sm text-brand-muted hover:text-brand-text transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>

        <div className="mx-auto w-full max-w-4xl flex-1 flex flex-col justify-center">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight">Welcome, {user?.name || 'there'}!</h1>
            <p className="mt-3 text-lg text-brand-muted max-w-xl mx-auto">
              To get started, you can either spin up a brand new organization workspace or join an existing team.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-4">
            {/* Card 1: Create Organization */}
            <div className="flex flex-col rounded-xl border border-brand-border bg-brand-card p-8 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
                  <PlusCircle className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold">Create Organization</h2>
              </div>
              <p className="text-sm text-brand-muted mb-6 flex-1">
                Start a fresh organization to manage your company's projects, invite members, and configure admin authorizations.
              </p>

              {createError && (
                <div className="flex items-center space-x-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400 mb-4">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>{createError}</span>
                </div>
              )}

              <form onSubmit={handleCreateOrg} className="space-y-4">
                <Input
                  label="Organization Name"
                  type="text"
                  placeholder="Acme Corporation"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  disabled={isCreatingOrg}
                />
                <Button type="submit" variant="primary" fullWidth isLoading={isCreatingOrg}>
                  Create Workspace
                </Button>
              </form>
            </div>

            {/* Card 2: Join Organization */}
            <div className="flex flex-col rounded-xl border border-brand-border bg-brand-card p-8 shadow-lg">
              <div className="flex items-center space-x-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary/10 text-brand-primary">
                  <Key className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold">Join Organization</h2>
              </div>
              <p className="text-sm text-brand-muted mb-6 flex-1">
                Already have a team workspace? Ask your administrator for the invite code to join their organization.
              </p>

              {joinError && (
                <div className="flex items-center space-x-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400 mb-4">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span>{joinError}</span>
                </div>
              )}

              <form onSubmit={handleJoinOrg} className="space-y-4">
                <Input
                  label="Invite Code"
                  type="text"
                  placeholder="E.g., AB12CD"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  disabled={isJoiningOrg}
                />
                <Button type="submit" variant="secondary" fullWidth isLoading={isJoiningOrg}>
                  Join Team Workspace
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default OnboardingPage;

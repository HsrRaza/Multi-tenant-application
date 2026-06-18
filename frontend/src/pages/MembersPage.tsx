import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useOrganization } from '../hooks/useOrganization';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import AnimatedPage from '../components/common/AnimatedPage';
import { Users, Copy, Check, Key, Shield, User } from 'lucide-react';

export const MembersPage: React.FC = () => {
  const { organization } = useAuth();
  const { useMembersQuery } = useOrganization();
  const [copied, setCopied] = useState(false);

  const { data: members, isLoading } = useMembersQuery(!!organization);

  const copyInviteCode = () => {
    if (organization?.invite_code) {
      navigator.clipboard.writeText(organization.invite_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
              <span>Members Directory</span>
            </h1>
            <p className="mt-1.5 text-sm text-brand-muted">
              View all users joined to your organization workspace and manage permissions.
            </p>
          </div>

          {/* Invite Code card */}
          <div className="flex items-center space-x-3 rounded-lg border border-brand-border bg-brand-card px-4 py-2 text-sm self-start sm:self-auto">
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

        {/* Members Directory */}
        {!members || members.length === 0 ? (
          <EmptyState
            title="No members found"
            description="It looks like there are no members in this workspace."
            icon={Users}
          />
        ) : (
          <div className="overflow-hidden rounded-lg border border-brand-border bg-brand-card/20">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-brand-border">
                <thead className="bg-brand-bg/60">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-brand-muted uppercase tracking-wider">
                      Member Name
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-brand-muted uppercase tracking-wider">
                      Email Address
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-brand-muted uppercase tracking-wider">
                      Role / Permissions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/50 bg-transparent">
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-brand-card/30 transition-colors">
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
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-left">
                        <span
                          className={`inline-flex items-center space-x-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                            member.role === 'admin'
                              ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
                              : 'bg-brand-card text-brand-muted border-brand-border'
                          }`}
                        >
                          {member.role === 'admin' ? (
                            <Shield className="h-3 w-3" />
                          ) : (
                            <User className="h-3 w-3" />
                          )}
                          <span className="capitalize">{member.role}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
};

export default MembersPage;

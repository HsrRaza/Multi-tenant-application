import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Shield, User as UserIcon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, role, organization } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-brand-border bg-brand-bg px-8">
      {/* Page Context */}
      <div>
        <h2 className="text-sm font-semibold tracking-wider uppercase text-brand-muted">
          {organization?.name || 'Organization Workspace'}
        </h2>
      </div>

      {/* User Info / Profile Section */}
      <div className="flex items-center space-x-4">
        {/* Role Badge */}
        {role && (
          <div className="flex items-center space-x-1 rounded-full bg-brand-card px-2.5 py-0.5 border border-brand-border text-xs font-semibold text-brand-text">
            <Shield className="h-3 w-3 text-brand-primary" />
            <span className="capitalize">{role}</span>
          </div>
        )}

        <div className="flex items-center space-x-3">
          <div className="flex flex-col text-right">
            <span className="text-sm font-medium text-brand-text">
              {user?.name || 'User'}
            </span>
            <span className="text-xs text-brand-muted truncate max-w-[150px]">
              {user?.email || 'email@example.com'}
            </span>
          </div>

          {/* User Avatar */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary/10 border border-brand-primary/25 text-sm font-bold text-brand-primary">
            {user?.name ? getInitials(user.name) : <UserIcon className="h-4 w-4" />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

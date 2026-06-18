import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  User,
  LogOut,
  Building,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const { logout, organization, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Members', path: '/members', icon: Users },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <aside className={`relative flex h-full flex-col border-r border-brand-border bg-brand-bg text-brand-text transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-64'}`}>
      {/* Branding / Active Org */}
      <div className={`flex h-16 items-center px-4 border-b border-brand-border ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed ? (
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10 border border-brand-primary/20 text-brand-primary">
              <Building className="h-5 w-5" />
            </div>
            <div className="flex flex-col truncate">
              <span className="text-sm font-semibold tracking-wide truncate">
                {organization?.name || 'My Tenant'}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-brand-muted">
                {role || 'No Org'} Role
              </span>
            </div>
          </div>
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-primary/10 border border-brand-primary/20 text-brand-primary">
            <Building className="h-5 w-5" />
          </div>
        )}

        {/* Floating Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute top-4.5 right-[-14px] flex h-7 w-7 items-center justify-center rounded-full border border-brand-border bg-brand-card text-brand-muted hover:text-brand-text hover:bg-brand-primary/10 hover:border-brand-primary/30 shadow-md transition-all duration-200 z-50 cursor-pointer"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 px-3 py-6">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            title={isCollapsed ? item.name : undefined}
            className={({ isActive }) =>
              `flex items-center rounded-md p-2.5 text-sm font-medium transition-all duration-200 ${
                isCollapsed ? 'justify-center' : 'space-x-3'
              } ${
                isActive
                  ? 'bg-brand-primary/10 text-brand-primary border-l-2 border-brand-primary'
                  : 'text-brand-muted hover:bg-brand-card hover:text-brand-text'
              }`
            }
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span className="truncate">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="border-t border-brand-border p-3">
        <button
          onClick={handleLogout}
          title={isCollapsed ? 'Logout' : undefined}
          className={`flex w-full items-center rounded-md p-2.5 text-sm font-medium text-brand-muted transition-all duration-200 hover:bg-red-500/10 hover:text-red-500 ${isCollapsed ? 'justify-center' : 'space-x-3'}`}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

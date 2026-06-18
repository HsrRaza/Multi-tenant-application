export interface Organization {
  id: number;
  name: string;
  invite_code: string;
  role: 'admin' | 'member';
}

export interface OrganizationMember {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'member';
}

export interface DashboardStats {
  totalProjects: number;
  totalMembers: number;
  totalAssignments: number;
}

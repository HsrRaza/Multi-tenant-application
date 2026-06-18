export interface Project {
  id: number;
  organization_id: number;
  name: string;
  description: string;
  created_at: string;
}

export interface ProjectWithMembers {
  project: Project;
  members: {
    id: number;
    name: string;
    email: string;
  }[];
}

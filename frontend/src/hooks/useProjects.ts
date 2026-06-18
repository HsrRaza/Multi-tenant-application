import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/axios';
import type { Project, ProjectWithMembers } from '../types/project.types';

export const useProjects = () => {
  const queryClient = useQueryClient();

  const useProjectsQuery = (enabled: boolean) => {
    return useQuery<Project[]>({
      queryKey: ['projects'],
      queryFn: async () => {
        const res = await api.get('/projects/my');
        return res.data.data;
      },
      enabled,
    });
  };

  const useProjectQuery = (projectId: number, enabled: boolean) => {
    return useQuery<Project>({
      queryKey: ['projects', projectId],
      queryFn: async () => {
        const res = await api.get(`/projects/${projectId}`);
        return res.data.data;
      },
      enabled: enabled && !isNaN(projectId),
    });
  };

  const useProjectMembersQuery = (projectId: number, enabled: boolean) => {
    return useQuery<ProjectWithMembers>({
      queryKey: ['projects', projectId, 'members'],
      queryFn: async () => {
        const res = await api.get(`/projects/${projectId}/members`);
        return res.data.data;
      },
      enabled: enabled && !isNaN(projectId),
    });
  };

  const createProjectMutation = useMutation({
    mutationFn: async (data: { name: string; description: string }) => {
      const res = await api.post('/projects', data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async (data: { projectId: number; name: string; description: string }) => {
      const { projectId, ...body } = data;
      const res = await api.put(`/projects/${projectId}`, body);
      return res.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['projects', variables.projectId] });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId: number) => {
      const res = await api.delete(`/projects/${projectId}`);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
    },
  });

  const assignMemberMutation = useMutation({
    mutationFn: async (data: { projectId: number; userId: number }) => {
      const res = await api.post(`/projects/${data.projectId}/members`, { userId: data.userId });
      return res.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects', variables.projectId, 'members'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (data: { projectId: number; userId: number }) => {
      const res = await api.delete(`/projects/${data.projectId}/members/${data.userId}`);
      return res.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects', variables.projectId, 'members'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'stats'] });
    },
  });

  return {
    useProjectsQuery,
    useProjectQuery,
    useProjectMembersQuery,
    createProject: createProjectMutation.mutateAsync,
    isCreatingProject: createProjectMutation.isPending,
    updateProject: updateProjectMutation.mutateAsync,
    isUpdatingProject: updateProjectMutation.isPending,
    deleteProject: deleteProjectMutation.mutateAsync,
    isDeletingProject: deleteProjectMutation.isPending,
    assignMember: assignMemberMutation.mutateAsync,
    isAssigningMember: assignMemberMutation.isPending,
    removeMember: removeMemberMutation.mutateAsync,
    isRemovingMember: removeMemberMutation.isPending,
  };
};

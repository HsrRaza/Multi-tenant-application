import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../utils/axios';
import type { OrganizationMember, DashboardStats } from '../types/organization.types';
import { useAuth } from './useAuth';

export const useOrganization = () => {
  const queryClient = useQueryClient();
  const { checkAuth } = useAuth();

  const createOrganizationMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await api.post('/organizations', { name });
      return res.data.data;
    },
    onSuccess: async () => {
      await checkAuth(); // Reload auth context state to reflect new org
      queryClient.invalidateQueries({ queryKey: ['organization'] });
    },
  });

  const joinOrganizationMutation = useMutation({
    mutationFn: async (inviteCode: string) => {
      const res = await api.post('/organizations/join', { inviteCode });
      return res.data.data;
    },
    onSuccess: async () => {
      await checkAuth(); // Reload auth context state to reflect new org
      queryClient.invalidateQueries({ queryKey: ['organization'] });
    },
  });

  const leaveOrganizationMutation = useMutation({
    mutationFn: async () => {
      const res = await api.delete('/organizations/leave');
      return res.data.data;
    },
    onSuccess: async () => {
      await checkAuth(); // Reload auth context state to reflect no org
      queryClient.invalidateQueries({ queryKey: ['organization'] });
      queryClient.clear();
    },
  });

  const useMembersQuery = (enabled: boolean) => {
    return useQuery<OrganizationMember[]>({
      queryKey: ['organization', 'members'],
      queryFn: async () => {
        const res = await api.get('/organizations/members');
        return res.data.data;
      },
      enabled,
    });
  };

  const useDashboardStatsQuery = (enabled: boolean) => {
    return useQuery<DashboardStats>({
      queryKey: ['dashboard', 'stats'],
      queryFn: async () => {
        const res = await api.get('/dashboard');
        return res.data.data;
      },
      enabled,
    });
  };

  return {
    createOrganization: createOrganizationMutation.mutateAsync,
    isCreatingOrg: createOrganizationMutation.isPending,
    joinOrganization: joinOrganizationMutation.mutateAsync,
    isJoiningOrg: joinOrganizationMutation.isPending,
    leaveOrganization: leaveOrganizationMutation.mutateAsync,
    isLeavingOrg: leaveOrganizationMutation.isPending,
    useMembersQuery,
    useDashboardStatsQuery,
  };
};

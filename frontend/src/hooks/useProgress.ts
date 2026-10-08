import { useQuery } from '@tanstack/react-query';
import { taskApi } from '../services/apiClient';

export const useProgress = (projectId: string = 'PROJ-ERP-01') => {
  return useQuery({
    queryKey: ['deliverableProgress', projectId],
    queryFn: () => taskApi.getDeliverableProgress(projectId),
    refetchInterval: 15000, // Real-time poll every 15s
  });
};

export const useModules = (projectId: string = 'PROJ-ERP-01') => {
  return useQuery({
    queryKey: ['modules', projectId],
    queryFn: () => taskApi.getModules(projectId),
  });
};

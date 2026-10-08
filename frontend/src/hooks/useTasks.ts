import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../services/apiClient';
import { CreateTaskPayload } from '../types/api.types';

export const useTasks = (params?: { module_id?: string; feature_id?: string; status?: string }) => {
  return useQuery({
    queryKey: ['tasks', params],
    queryFn: () => taskApi.getTasks(params),
  });
};

export const useHierarchy = (projectId: string = 'PROJ-ERP-01') => {
  return useQuery({
    queryKey: ['hierarchy', projectId],
    queryFn: () => taskApi.getHierarchy(projectId),
  });
};

export const useTaskDetails = (taskId: string) => {
  return useQuery({
    queryKey: ['task', taskId],
    queryFn: () => taskApi.getTaskById(taskId),
    enabled: !!taskId,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTaskPayload) => taskApi.createTask(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['hierarchy'] });
      queryClient.invalidateQueries({ queryKey: ['deliverableProgress'] });
    },
  });
};

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      taskId,
      status,
      assignee_id,
      assignee_name,
    }: {
      taskId: string;
      status: string;
      assignee_id?: string;
      assignee_name?: string;
    }) => taskApi.updateStatus(taskId, status, assignee_id, assignee_name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['hierarchy'] });
      queryClient.invalidateQueries({ queryKey: ['deliverableProgress'] });
    },
  });
};

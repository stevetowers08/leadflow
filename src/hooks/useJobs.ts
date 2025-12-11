import { toast } from '@/utils/toast';
import { queryKeys, type JobFilters } from '@/lib/queryKeys';
import { jobsService, type Job } from '@/services/jobsService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useJobs(filters: JobFilters = {}) {
  return useQuery({
    queryKey: queryKeys.jobs.list(filters),
    queryFn: () => jobsService.getJobs(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 2,
  });
}

export function useJob(id: string) {
  return useQuery({
    queryKey: queryKeys.jobs.detail(id),
    queryFn: () => jobsService.getJob(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: jobsService.createJob,
    onSuccess: newJob => {
      // Invalidate and refetch jobs list
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });

      toast.success('Success', {
        description: `Job "${newJob.title}" created successfully`,
      });
    },
    onError: error => {
      toast.error('Error', {
        description: `Failed to create job: ${error.message}`,
      });
    },
  });
}

export function useUpdateJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Job> }) =>
      jobsService.updateJob(id, updates),
    onMutate: async ({ id, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.jobs.all });

      // Snapshot previous value
      const previousJobs = queryClient.getQueryData(queryKeys.jobs.all);

      // Optimistically update
      queryClient.setQueryData(queryKeys.jobs.all, (old: Job[] | undefined) =>
        old?.map(job => (job.id === id ? { ...job, ...updates } : job))
      );

      return { previousJobs };
    },
    onError: (error, { id }, context) => {
      // Rollback on error
      if (context?.previousJobs) {
        queryClient.setQueryData(queryKeys.jobs.all, context.previousJobs);
      }

      toast.error('Error', {
        description: `Failed to update job: ${error.message}`,
      });
    },
    onSuccess: updatedJob => {
      toast.success('Success', {
        description: `Job "${updatedJob.title}" updated successfully`,
      });
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
    },
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: jobsService.deleteJob,
    onSuccess: () => {
      // Invalidate and refetch jobs list
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });

      toast.success('Success', {
        description: 'Job deleted successfully',
      });
    },
    onError: error => {
      toast.error('Error', {
        description: `Failed to delete job: ${error.message}`,
      });
    },
  });
}

export function useJobPrefetch() {
  const queryClient = useQueryClient();

  const prefetchJob = (id: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.jobs.detail(id),
      queryFn: () => jobsService.getJob(id),
      staleTime: 5 * 60 * 1000,
    });
  };

  return { prefetchJob };
}

import { useQuery } from '@tanstack/react-query';
import { fetchIssues, fetchIssueById } from '@/data/issues';

export const useIssues = () => {
  return useQuery({
    queryKey: ['issues'],
    queryFn: fetchIssues,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useIssue = (id) => {
  return useQuery({
    queryKey: ['issue', id],
    queryFn: () => fetchIssueById(id),
    enabled: !!id,
  });
};

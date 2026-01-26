import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  // ... other fields
}

interface CustomersResponse {
  customers: Customer[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useCustomers(page = 1, search = '') {
  return useQuery({
    queryKey: ['customers', page, search],
    queryFn: async () => {
      const { data } = await apiClient.get<CustomersResponse>('/customers', {
        params: { page, search },
      });
      return data;
    },
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: ['customers', id],
    queryFn: async () => {
      const { data } = await apiClient.get<Customer>(`/customers/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newCustomer: Partial<Customer>) =>
      apiClient.post('/customers', newCustomer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Customer> }) =>
      apiClient.put(`/customers/${id}`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customers', variables.id] });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/customers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

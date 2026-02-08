import { QueryClient } from '@tanstack/react-query'

// Configure React Query client with Supabase-optimized settings
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Data is fresh for 5 minutes
            staleTime: 5 * 60 * 1000,

            // Keep unused data in cache for 10 minutes
            gcTime: 10 * 60 * 1000,

            // Retry failed requests 1 time
            retry: 1,

            // Refetch on window focus for real-time feel
            refetchOnWindowFocus: true,

            // Don't refetch on mount if data is fresh
            refetchOnMount: false,
        },
        mutations: {
            // Retry failed mutations once
            retry: 1,
        },
    },
})

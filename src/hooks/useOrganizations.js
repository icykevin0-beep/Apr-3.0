import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

// Query Keys
const ORGANIZATIONS_KEY = ['organizations']

/**
 * Fetch current user's organization
 */
export function useOrganization() {
    const { user } = useAuth()

    return useQuery({
        queryKey: ORGANIZATIONS_KEY,
        queryFn: async () => {
            if (!user) return null

            const { data, error } = await supabase
                .from('organizations')
                .select('*')
                .eq('owner_id', user.id)
                .single()

            if (error && error.code !== 'PGRST116') throw error // PGRST116 = not found
            return data
        },
        enabled: !!user,
    })
}

/**
 * Create organization
 */
export function useCreateOrganization() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (newOrg) => {
            const { data, error } = await supabase
                .from('organizations')
                .insert([newOrg])
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ORGANIZATIONS_KEY })
        },
    })
}

/**
 * Update organization
 */
export function useUpdateOrganization() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, updates }) => {
            const { data, error } = await supabase
                .from('organizations')
                .update(updates)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ORGANIZATIONS_KEY })
        },
    })
}

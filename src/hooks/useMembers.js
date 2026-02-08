import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

// Query Keys
const MEMBERS_KEY = ['members']

/**
 * Fetch all members
 */
export function useMembers() {
    return useQuery({
        queryKey: MEMBERS_KEY,
        queryFn: async () => {
            const { data, error } = await supabase
                .from('members')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            return data
        },
    })
}

/**
 * Fetch single member by ID
 */
export function useMember(id) {
    return useQuery({
        queryKey: [...MEMBERS_KEY, id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('members')
                .select('*')
                .eq('id', id)
                .single()

            if (error) throw error
            return data
        },
        enabled: !!id, // Only run if id is provided
    })
}

/**
 * Create new member
 */
export function useCreateMember() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (newMember) => {
            const { data, error } = await supabase
                .from('members')
                .insert([newMember])
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            // Invalidate and refetch members list
            queryClient.invalidateQueries({ queryKey: MEMBERS_KEY })
        },
    })
}

/**
 * Update existing member
 */
export function useUpdateMember() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, updates }) => {
            const { data, error } = await supabase
                .from('members')
                .update(updates)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: (data) => {
            // Invalidate members list
            queryClient.invalidateQueries({ queryKey: MEMBERS_KEY })
            // Invalidate specific member
            queryClient.invalidateQueries({ queryKey: [...MEMBERS_KEY, data.id] })
        },
    })
}

/**
 * Delete member
 */
export function useDeleteMember() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id) => {
            const { error } = await supabase
                .from('members')
                .delete()
                .eq('id', id)

            if (error) throw error
            return id
        },
        onSuccess: () => {
            // Invalidate and refetch members list
            queryClient.invalidateQueries({ queryKey: MEMBERS_KEY })
        },
    })
}

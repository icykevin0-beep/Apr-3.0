import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

// Query Keys
const READINGS_KEY = ['readings']

/**
 * Fetch readings with optional filters
 * @param {Object} filters - { memberId, month, year }
 */
export function useReadings(filters = {}) {
    return useQuery({
        queryKey: [...READINGS_KEY, filters],
        queryFn: async () => {
            let query = supabase
                .from('readings')
                .select(`
          *,
          member:members(id, name, meter_number)
        `)
                .order('reading_date', { ascending: false })

            // Apply filters
            if (filters.memberId) {
                query = query.eq('member_id', filters.memberId)
            }

            if (filters.month && filters.year) {
                const startDate = new Date(filters.year, filters.month - 1, 1).toISOString()
                const endDate = new Date(filters.year, filters.month, 0).toISOString()
                query = query.gte('reading_date', startDate).lte('reading_date', endDate)
            }

            const { data, error } = await query

            if (error) throw error
            return data
        },
    })
}

/**
 * Create new reading
 */
export function useCreateReading() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (newReading) => {
            const { data, error } = await supabase
                .from('readings')
                .insert([newReading])
                .select(`
          *,
          member:members(id, name, meter_number)
        `)
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: READINGS_KEY })
        },
    })
}

/**
 * Update reading
 */
export function useUpdateReading() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, updates }) => {
            const { data, error } = await supabase
                .from('readings')
                .update(updates)
                .eq('id', id)
                .select(`
          *,
          member:members(id, name, meter_number)
        `)
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: READINGS_KEY })
        },
    })
}

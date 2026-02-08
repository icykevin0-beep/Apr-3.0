import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

// Query Keys
const INVOICES_KEY = ['invoices']

/**
 * Fetch invoices with optional filters
 * @param {Object} filters - { memberId, status, month, year }
 */
export function useInvoices(filters = {}) {
    return useQuery({
        queryKey: [...INVOICES_KEY, filters],
        queryFn: async () => {
            let query = supabase
                .from('invoices')
                .select(`
          *,
          member:members(id, name, meter_number)
        `)
                .order('issue_date', { ascending: false })

            // Apply filters
            if (filters.memberId) {
                query = query.eq('member_id', filters.memberId)
            }

            if (filters.status) {
                query = query.eq('status', filters.status)
            }

            if (filters.month && filters.year) {
                const startDate = new Date(filters.year, filters.month - 1, 1).toISOString()
                const endDate = new Date(filters.year, filters.month, 0).toISOString()
                query = query.gte('issue_date', startDate).lte('issue_date', endDate)
            }

            const { data, error } = await query

            if (error) throw error
            return data
        },
    })
}

/**
 * Create new invoice
 */
export function useCreateInvoice() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (newInvoice) => {
            const { data, error } = await supabase
                .from('invoices')
                .insert([newInvoice])
                .select(`
          *,
          member:members(id, name, meter_number)
        `)
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: INVOICES_KEY })
        },
    })
}

/**
 * Update invoice (e.g., mark as paid)
 */
export function useUpdateInvoice() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({ id, updates }) => {
            const { data, error } = await supabase
                .from('invoices')
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
            queryClient.invalidateQueries({ queryKey: INVOICES_KEY })
        },
    })
}

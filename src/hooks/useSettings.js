import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

// Query Keys
const RATES_KEY = ['water_rates']

/**
 * Fetch current water rates
 */
export function useWaterRates() {
    return useQuery({
        queryKey: RATES_KEY,
        queryFn: async () => {
            const { data, error } = await supabase
                .from('water_rates')
                .select('*')
                .eq('is_active', true)
                .order('tier_min', { ascending: true })

            if (error) throw error
            return data
        },
    })
}

/**
 * Update water rates
 */
export function useUpdateWaterRates() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (rates) => {
            // Delete all existing rates and insert new ones
            await supabase.from('water_rates').delete().eq('is_active', true)

            const { data, error } = await supabase
                .from('water_rates')
                .insert(rates)
                .select()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: RATES_KEY })
        },
    })
}

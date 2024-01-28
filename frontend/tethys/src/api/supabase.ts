import { River, RiverPermitStatus } from "@/pages/riverMap"
import { AlertDateRange } from "@/pages/alerts"
import { Transition } from "@/pages/data"

interface SupabaseRespone {
    count?: number
    data: River[] | AlertDateRange[] | Transition[] | RiverPermitStatus[]
    error?: any
    status: number
    statusTest: string
}

export async function fetchRiversData(supabase: any): Promise<River[]> {
    return await supabase
        .from('rivers')
        .select()
        .then((response: SupabaseRespone) => {
            if (response.data) {
                return response.data
            } else {
                return []
            }
        })
}

export async function fetchAlertDatesByUser(supabase: any, userId: string): Promise<AlertDateRange[]> {
    return await supabase
        .from('alerts')
        .select('*')
        .eq('user_id', userId)
        .then((response: SupabaseRespone) => {
            if (response.data) {
                const alertDateRanges = response.data.flatMap((r: AlertDateRange) => ({
                    startDate: r.start_date,
                    endDate: r.end_date,
                    river: r.river,
                }))
                return alertDateRanges
            } else {
                return []
            }
        })
}

export async function fetchTransitionData(
    supabase: any,
    minScrapeTimestamp: string = new Date().toISOString(),
    nRecords: number = 50
): Promise<Transition[]> {
    return await supabase
        .from('transitions_v')
        .select()
        .lte('scrape_timestamp', minScrapeTimestamp)
        .order('scrape_timestamp', { ascending: false })
        .limit(nRecords)
        .then((response: SupabaseRespone) => {
            if (response.data) {
                return response.data
            } else {
                return []
            }
        })
}

export async function fetchCurrentStatus(supabase: any, river: River): Promise<RiverPermitStatus[]> {
    return await supabase
        .from('current_status_v')
        .select()
        .eq('permit_name', river.name)
        .then((response: SupabaseRespone) => {
            if (response.data) {
                return response.data
            } else {
                return []
            }
        })
}
import { atom } from 'jotai'
import { River } from './riverMap'

interface SupabaseUser {
    id: string
    email: string
    access_token: string
    refresh_token: string
    expires_in: number
}

export const activeTab_s = atom<string>('Home')
export const currentUser_s = atom<SupabaseUser | null>(null)
export const authenticated_s = atom<boolean>(false)
export const activeRiver_s = atom<River | null>(null)
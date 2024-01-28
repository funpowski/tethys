import { atom } from 'jotai'
import dynamic from "next/dynamic"
import React, { useState } from "react";
import { River } from './pages/riverMap';
import { AlertDateRange } from './pages/alerts';
const MapWithNoSSR = dynamic(() => import('./pages/riverMap'), {
    ssr: false,
});

export interface SupabaseUser {
    id: string
    email: string
    access_token: string
    refresh_token: string
    expires_in: number
}

export const activeTab_s = atom<React.ReactNode>(<MapWithNoSSR />)
export const currentUser_s = atom<SupabaseUser | null>(null)
export const authenticated_s = atom<boolean>(false)
export const activeRiver_s = atom<River | null>(null)
export const riverList_s = atom<River[] | null>(null)
export const userAlerts_s = atom<AlertDateRange[] | null>(null)
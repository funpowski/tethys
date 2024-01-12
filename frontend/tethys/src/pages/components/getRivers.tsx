import { useAtom } from "jotai"
import { useEffect, useState } from "react"
import { supabase_s } from "../_app"
import { River } from '../riverMap'
import { riverList_s } from "../state"

export default function GetRivers() {
    const [supabase, setSupabase] = useAtom(supabase_s)
    const [riverList, setRiverList] = useAtom(riverList_s)
    useEffect(() => {
        const fetchMapData = async () => {
            await supabase.from('rivers').select().then((data) => {
                if (data.data) {
                    console.log(data.data)
                    setRiverList(data.data)
                }
            })
        }

        fetchMapData()
    }, [])

    return null;
}
import { Box, Container, Title } from "@mantine/core";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef, useState } from "react";
import type { GeoJSON as GeoJSONType } from "leaflet";
import { useAtom } from "jotai";
import { supabase_s } from "./_app";
import { GeoJSON } from "react-leaflet";


interface River {
    name: string
    geometry: GeoJSONType
}

export default function RiverMap() {
    const [riverList, setRiverList] = useState<River[]>([])
    const [supabase, setSupabase] = useAtom(supabase_s)

    useEffect(() => {
        const fetchMapData = async () => {
            await supabase.from('rivers').select().then((data) => {
                if (data.data) {
                    setRiverList(data.data)
                }
            })
        }

        fetchMapData()
    }, [])

    return (
        <MapContainer center={[39.86883571107782, -107.73610748111314]} style={{ height: "100%", width: "100%" }} zoom={5}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {riverList.map((river) => {
                return <GeoJSON
                    key={river.name}
                    data={JSON.parse(river.geometry)}
                    onEachFeature={(feature, leafletLayer) => {
                        const popupOptions = {
                            minWidth: 100,
                            maxWidth: 250,
                            className: "popup-classname"
                        };

                        leafletLayer.bindPopup(() => {
                            return river.name
                        }, popupOptions);
                    }}
                />
            })}
        </MapContainer>
    )
}
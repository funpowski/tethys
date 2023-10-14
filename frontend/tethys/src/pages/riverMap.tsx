import { Text, Box, Container, Header, Title, Button } from "@mantine/core";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef, useState } from "react";
import type { GeoJSON as GeoJSONType } from "leaflet";
import { useAtom } from "jotai";
import { supabase_s } from "./_app";
import { GeoJSON } from "react-leaflet";
import ReactDOMServer from 'react-dom/server';


interface River {
    name: string
    geometry: GeoJSONType
    display_name: string
    permit_id: number
    division_id: number
}

function getRiverData(river: River) {

}

function RiverCard(river: River) {
    return (
        <>
            <Header>
                {river.display_name}
            </Header>
        </>
    )
}

export default function RiverMap() {
    const [riverList, setRiverList] = useState<River[]>([])
    const [supabase, setSupabase] = useAtom(supabase_s)

    useEffect(() => {
        const fetchMapData = async () => {
            await supabase.from('rivers').select().then((data) => {
                if (data.data) {
                    setRiverList(data.data)
                    console.log(data.data)
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
                const popupContent = (
                    <>
                        <h2>{river.display_name}</h2>
                        <Text>Division ID: {river.division_id}</Text>
                        <Text>Permit ID: {river.permit_id}</Text>
                        <Button onClick={() => console.log('clicked')}>
                            Run Analytics
                        </Button>
                    </>
                )

                return <GeoJSON
                    key={river.name}
                    data={JSON.parse(river.geometry)}
                    onEachFeature={(feature, leafletLayer) => {
                        const popupOptions = {
                            minWidth: 100,
                            className: "popup-classname"
                        };

                        leafletLayer.bindPopup(ReactDOMServer.renderToString(popupContent), popupOptions);
                    }}
                />
            })}
        </MapContainer>
    )
}
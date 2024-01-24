import { Text, Box, Container, Header, Title, Button, Drawer } from "@mantine/core";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef, useState } from "react";
import type { GeoJSON as GeoJSONType } from "leaflet";
import { useAtom } from "jotai";
import { supabase_s } from "./_app";
import { activeRiver_s } from "./state";
import { GeoJSON } from "react-leaflet";
import ReactDOMServer from 'react-dom/server';
import { riverList_s } from "./state"

export interface River {
    name: string
    geometry: GeoJSONType
    display_name: string
    permit_id: number
    division_id: number
}


const Sidebar = ({ isOpen, onOpen, onClose }) => {
    const [activeRiver, setActiveRiver] = useAtom(activeRiver_s)
    const [sidebarWidth, setSidebarWidth] = useState(500);
    const [supabase, setSupabase] = useAtom(supabase_s)

    const handleMouseDown = (e) => {
        e.preventDefault()
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
        let minWidth = screen.width * 0.2;
        let maxWidth = screen.width * 0.7;
        let updatedWidth = document.body.offsetWidth - (e.clientX - document.body.offsetLeft);
        updatedWidth = Math.min(maxWidth, Math.max(minWidth, updatedWidth));
        setSidebarWidth(updatedWidth);
    };


    useEffect(() => {
        const fetchMapData = async () => {
            await supabase.from('scraped_data').select().eq('permit_name', activeRiver?.name).then((data) => {
                if (data.data) {
                    console.log('payload:', data.data)
                }
            })
        }

        fetchMapData()
    }, [activeRiver])

    return (
        <>
            <Drawer
                withOverlay={false}
                closeOnClickOutside={false}
                zIndex={999}
                styles={{ root: { width: 0, height: 0 } }}
                opened={isOpen}
                onClose={onClose}
                position="right"
                size={sidebarWidth}
                title={<Title order={1}>{activeRiver?.display_name}</Title>}
                transitionProps={{ duration: 0, timingFunction: 'linear' }}
            >
            </Drawer>
            <div
                style={{
                    width: '5px',
                    height: 'calc(100vh - 20px)',
                    backgroundColor: '#e0e0e0',
                    cursor: 'ew-resize',
                    position: 'absolute',
                    zIndex: 999,
                    right: sidebarWidth,
                    visibility: isOpen ? "visible" : "hidden",
                }}
                onMouseDown={(e) => {
                    handleMouseDown(e)
                }}
            ></div>
        </>
    );
};

export default function RiverMap() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeRiver, setActiveRiver] = useAtom(activeRiver_s)
    const [riverList, setRiverList] = useAtom(riverList_s)

    const openSidebar = () => {
        setIsSidebarOpen(true);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };


    return (
        <>
            <Sidebar isOpen={isSidebarOpen} onOpen={openSidebar} onClose={closeSidebar} />
            <MapContainer center={[39.86883571107782, -107.73610748111314]} style={{ height: "100%", width: "100%" }
            } zoom={5} >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {
                    riverList?.map((river) => {
                        const popupContent = (
                            <>
                                <h2>{river.display_name}</h2>
                                <Text>Division ID: {river.division_id}</Text>
                                <Text>Permit ID: {river.permit_id}</Text>
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
                                leafletLayer.on("mouseover", (event) => {
                                    leafletLayer.openPopup();
                                });
                                leafletLayer.on("mouseout", (event) => {
                                    leafletLayer.closePopup();
                                });
                                leafletLayer.on("click", (event) => {
                                    openSidebar();
                                    setActiveRiver(river)
                                });

                                leafletLayer.bindPopup(ReactDOMServer.renderToString(popupContent), popupOptions,);
                            }}
                        />
                    })
                }
            </MapContainer >
        </>
    )
}
import { Text, Box, Title, Drawer, Paper, List, Divider, Space, Container, Center, ActionIconGroup, Indicator, Popover, Stack, Group, LoadingOverlay } from "@mantine/core";
import dayjs, { Dayjs } from 'dayjs';
import { MapContainer, TileLayer, Tooltip } from "react-leaflet";
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from "react";
import type { GeoJSON as GeoJSONType } from "leaflet";
import { useAtom } from "jotai";
import { supabase_s } from "./_app";
import { activeRiver_s, userAlerts_s, currentUser_s } from "./state";
import { GeoJSON } from "react-leaflet";
import { riverList_s } from "./state"
import { Calendar, DatePicker, DatePickerProps } from '@mantine/dates';
import { fetchAlertDatesByUser, fetchCurrentStatus } from "@/api/supabase";
import { AlertDateRange } from "./alerts";
import AvailabilityRange from "./components/calendarColorBoxes";

export interface River {
    name: string
    geometry: GeoJSONType
    display_name: string
    permit_id: number
    division_id: number
    rec_gov_url: string
}

export interface RiverPermitStatus {
    availability_date: Date
    total: number
    remaining: number
    permit_name: string
    scrape_time: Date
}

interface AvailabilityStatus {
    availability_date: Dayjs
    availability_ratio: number
    river_name: string
}

const Sidebar = ({ isOpen, onOpen, onClose }) => {
    const [activeRiver, setActiveRiver] = useAtom(activeRiver_s)
    const [sidebarWidth, setSidebarWidth] = useState(500);
    const [supabase, setSupabase] = useAtom(supabase_s)
    const [alertDateRanges, setAlertDateRanges] = useAtom(userAlerts_s)
    const [currentUser] = useAtom(currentUser_s)
    const [currentStatus, setCurrentStatus] = useState<RiverPermitStatus[]>([])
    const [availableDatesByRiver, setAvailableDatesByRiver] = useState<AvailabilityStatus[]>([])
    const [defaultCalendarDate, setDefaultCalendarDate] = useState<Date>(new Date());
    const [selectedDrawerDate, setSelectedDrawerDate] = useState<Date | null>(null);
    const [datePickerLoadingReady, setDatePickerLoadingReady] = useState<boolean>(false);



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

    const getDayProps: DatePickerProps['getDayProps'] = (date) => {
        if (availableDatesByRiver.some((status) => status.availability_date.isSame(dayjs(date), 'day'))) {
            const availabilityStatus = availableDatesByRiver.find((status) => status.availability_date.isSame(dayjs(date)));
            if (dayjs(selectedDrawerDate).isSame(availabilityStatus?.availability_date)) {
                return {
                    style: {
                        backgroundColor: 'darkcyan',
                        color: 'var(--mantine-color-white)',
                    },
                }
            } else if (availabilityStatus?.availability_ratio !== undefined && availabilityStatus?.availability_ratio > 0) {
                return {
                    style: {
                        backgroundColor: `rgba(60, 179, 113, ${availabilityStatus?.availability_ratio})`,
                        color: 'var(--mantine-color-white)',
                    },
                }
            } else {
                return {
                    style: {},
                }
            }
        }

        return {};
    };

    useEffect(() => {
        const fetchData = async () => {
            if (activeRiver !== null) {
                await fetchCurrentStatus(supabase, activeRiver).then((currentStatuses: RiverPermitStatus[]) => {
                    setCurrentStatus(currentStatuses)
                    const updatedAvailabilityDates = currentStatuses.map((status) => ({
                        'availability_date': dayjs(status.availability_date),
                        'availability_ratio': status.remaining / status.total,
                        'river_name': status.permit_name,
                    }))
                    setAvailableDatesByRiver(updatedAvailabilityDates)
                })
            }
            if (currentUser !== null) {
                await fetchAlertDatesByUser(supabase, currentUser?.id).then((alertDateRanges: AlertDateRange[]) => {
                    setAlertDateRanges(alertDateRanges)
                    setDefaultCalendarDate(getMinDateByRiver(alertDateRanges, activeRiver))
                })
            }
        }
        fetchData();
    }, [activeRiver])

    useEffect(() => {
        if (
            currentStatus.length > 0 &&
            currentStatus[0].permit_name === activeRiver?.name
        ) {
            setDatePickerLoadingReady(true)
        } else {
            setDatePickerLoadingReady(false)
        }
    }, [availableDatesByRiver])

    function getMinDateByRiver(alerts: AlertDateRange[] | null, river: River | null): Date {
        if (alerts !== null && river !== null) {
            const filteredRivers = alerts.filter(alert => alert.river === river.name)
            if (filteredRivers.length > 0) {
                const minDate = filteredRivers.reduce((minDate, currentDate) => {
                    return minDate.startDate < currentDate.startDate ? minDate : currentDate;
                }, alerts[0]).startDate
                return new Date(minDate)
            } else {
                return new Date()
            }
        } else {
            return new Date()
        }
    }

    function getAvailabilityInfoFromDate(): RiverPermitStatus | undefined {
        const availabilityInfo = currentStatus.find((status) => dayjs(status.availability_date).isSame(dayjs(selectedDrawerDate), 'day'))
        return availabilityInfo

    }


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
                // title={<Title order={1}>{activeRiver?.display_name}</Title>}
                title={<Text
                    fw={700}
                    style={{
                        fontSize: 36
                    }}
                >
                    {activeRiver?.display_name}
                </Text>
                }
                // title={activeRiver?.display_name}
                transitionProps={{ duration: 0, timingFunction: 'linear' }}
            >
                <Container p={'md'}>
                    <Title order={4}>River Details:</Title>
                    <List>
                        <List.Item>River Scrape Name: {activeRiver?.name}</List.Item>
                        <List.Item>Permit ID: {activeRiver?.permit_id}</List.Item>
                        <List.Item>Permit Division: {activeRiver?.division_id}</List.Item>
                        <List.Item><a target="_blank" rel="noopener noreferrer" href={activeRiver?.rec_gov_url}>Permit Link</a></List.Item>
                    </List>
                    <Divider my="md" />
                    <Title order={4}>Current Alerts:</Title>
                    {currentUser ?
                        alertDateRanges?.filter((alert) => alert.river === activeRiver?.name).length !== 0 ?
                            <List>
                                {alertDateRanges?.filter((alert) => alert.river === activeRiver?.name)
                                    .map((alert) => (
                                        <List.Item key={`${alert.river}-${alert.startDate}-${alert.endDate}`}>{alert.startDate.toISOString().split('T')[0]} - {alert.endDate.toISOString().split('T')[0]}</List.Item>
                                    ))

                                }
                            </List>
                            :
                            <Text>No alerts set for this river.</Text>
                        :
                        <Text>Please login to display current alerts for this river.</Text>
                    }
                    <Divider my="md" />
                    <Title order={4}>Current Availability:</Title>
                    <Text fs='italic'>Note: Scraping endpoint availabilities may differ from what is shown online; especially pre-permit draw.</Text>
                    <Space my="md" />
                    <Center>
                        <Stack>
                            <Box pos={'relative'}>
                                {
                                    datePickerLoadingReady &&
                                    <DatePicker
                                        value={selectedDrawerDate}
                                        onChange={setSelectedDrawerDate}
                                        getDayProps={getDayProps}
                                        hideOutsideDates={true}
                                        allowDeselect={true}
                                    />
                                }
                            </Box>
                            <AvailabilityRange />
                            {
                                selectedDrawerDate !== null ?
                                    <>
                                        <Stack gap={'xs'}>
                                            <Title order={6}> Selected Date Information:</Title>
                                            <List>
                                                <List.Item>Date: {selectedDrawerDate.toISOString().split('T')[0]}</List.Item>
                                                <List.Item>Availabile Permits: {getAvailabilityInfoFromDate() ? getAvailabilityInfoFromDate()?.remaining : 0}</List.Item>
                                                <List.Item>Total Permits: {getAvailabilityInfoFromDate() ? getAvailabilityInfoFromDate()?.total : 0}</List.Item>
                                            </List>
                                        </Stack>
                                    </>
                                    :
                                    null
                            }
                        </Stack>
                    </Center>
                </Container>
            </Drawer >
            <div
                style={{
                    width: '5px',
                    height: 'calc(100vh - 20px)',
                    // backgroundColor: '#e0e0e0',
                    cursor: 'ew-resize',
                    position: 'absolute',
                    backgroundColor: 'transparent',
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
            <Box style={{ height: 'calc(100vh - 35px)' }} >
                <Sidebar isOpen={isSidebarOpen} onOpen={openSidebar} onClose={closeSidebar} />
                <MapContainer center={[39.86883571107782, -107.73610748111314]} style={{ height: "100%", width: "100%" }
                } zoom={5} >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {
                        riverList?.map((river) => {
                            return <GeoJSON
                                key={river.name}
                                data={JSON.parse(river?.geometry as any)}
                                onEachFeature={(feature, leafletLayer) => {
                                    leafletLayer.on("click", (event) => {
                                        openSidebar();
                                        setActiveRiver(river)
                                    });

                                }}
                            >
                                <Tooltip>{river.display_name}</Tooltip>
                            </GeoJSON>
                        })
                    }
                </MapContainer >
            </Box>
        </>
    )
}

import { List, Title, Center, Container, Text, Stack, Box } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { supabase_s } from "./_app";
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

interface Transition {
    "id": string
    "permit_name": string
    "permit_availability_date": Date
    "available_permits_t": number
    "available_permits_t1": number
    "transition": number
    "scrape_day_of_week": number
    "scrape_hour": number
    "scrape_time": Date
    [key: number]: any
}

export default function Data() {
    const [supabase, setSupabase] = useAtom(supabase_s)
    const [transitionData, setTransitionData] = useState<Transition[]>([])
    useEffect(() => {
        const fetchData = async () => {
            await supabase.from('transitions').select().neq('transition', 0).then((data) => {
                if (data?.data) {
                    setTransitionData(data.data.map(item => ({ ...item })) as Transition[])
                }
            })
        }

        fetchData()
    }, [])

    // generate radar data
    const riverNames = [...new Set(transitionData.map(item => item.permit_name))]
    const radarDataWeekly = {
        labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        datasets: [...riverNames.map(name => {
            return ({
                label: name,
                data: Object.values(transitionData.reduce((acc, obj) => {
                    const key = obj.scrape_day_of_week;
                    if (!acc[key]) {
                        acc[key] = 0
                    }
                    acc[key] += 1
                    return acc
                })),
                fill: true,
            })
        })]
    };

    return (
        <Center>
            <Stack>
                <Container size={'lg'}>
                    <Title>Data</Title>
                    <Text>Let's </Text>
                </Container>
                <Box sx={{ height: '50vh' }}>
                    <Radar data={radarDataWeekly} />
                </Box>
            </Stack>
        </Center>
    )
}
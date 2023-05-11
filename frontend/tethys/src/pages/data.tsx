import { List, Title, Center, Container, Text, Stack, Box, Blockquote, Header, Space, Tabs, Image } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { useAtom } from "jotai";
import { supabase_s } from "./_app";
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
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
            <Container size={'sm'}>
                <Title>Data</Title>
                <Blockquote cite='- Booz Allen Hamilton probably'>
                    Yo dawg I heard you like accessing public lands so I put your tax dollars to work® so you can pay us <a href="https://www.nationalparkstraveler.org/2023/02/update-lawsuit-alleges-recreationgov-cluttered-junk-fees-seeks-refunds">fees</a> while losing the lottery every year
                </Blockquote>
                <Tabs defaultValue="vis">
                    <Tabs.List>
                        <Tabs.Tab value="vis" >Visualizations</Tabs.Tab>
                        <Tabs.Tab value="source" >Data Source</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="source" pt="xs">
                        <Stack>
                            <Text>
                                Let's understand how the data is scraped/structured (with some unnecessary
                                exposition that really only serves to show people I know how how to use <InlineMath>\LaTeX</InlineMath>).
                            </Text>
                            <Text>
                                Every hour an AWS lambda function makes a request to the API that generates those little reservation availability calendars. If we think about
                                each rivers availability calendar and "stretch" it out into a vector <InlineMath>{"\\bold{X}"}</InlineMath> for some river <InlineMath>r</InlineMath>,
                                each element of the vector represents the availability for some date in the future
                                during the time it was scraped. More formally, we can represent this as:
                                <BlockMath math={"\\bold{X}_{t,r} =  [x_{i,t,r} \\dots x_{i+n,t,r}]"} />
                                Where <InlineMath>t</InlineMath> is the time at which the calendar was scraped, <InlineMath>i</InlineMath> is the specific availability date, and <InlineMath>n</InlineMath> is the lookahead period.
                                Visualizing this is personally really useful for me so here is what this stuff means on the calendar:
                            </Text>
                            <Center>
                                <Image src='/img/recgov_calendar.png' width={'60%'} />
                            </Center>
                            <Text>
                                Continuing with this notation, we can define an "availability transition"
                            </Text>
                        </Stack>
                        <Space h={'lg'} />
                    </Tabs.Panel>
                    <Tabs.Panel value="vis" pt="xs">
                        <Box sx={{ height: '50vh' }}>
                            <Radar style={{ height: '50vh' }} data={radarDataWeekly} />
                        </Box>
                    </Tabs.Panel>
                </Tabs>
            </Container>
        </Center>
    )
}
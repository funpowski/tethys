import { useAtom } from "jotai";
import { supabase_s } from "./_app";
import { activeRiver_s, riverList_s } from "./state";
import { Box, Button, Center, Collapse, Container, Divider, Group, MultiSelect, ScrollArea, Space, Stack, Text, Title } from "@mantine/core";
import { Table } from "@mantine/core";
import { useEffect, useState } from "react";
import { fetchTransitionData } from "@/api/supabase";
import { DatePicker, DatePickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";

export interface Transition {
    permit_name: string
    permit_date: Date
    total_permits: number
    availabile_permits: number
    transition_type: "permit_claimed" | "permit_released"
    scrape_timestamp: Date
}
export default function DataContainer() {
    const [activeRiver, setActiveRiver] = useAtom(activeRiver_s)
    const [riverList, setRiverList] = useAtom(riverList_s)
    const [supabase, setSupabase] = useAtom(supabase_s)
    const [transitions, setTransitions] = useState<Transition[]>([]);
    const [displayTransitions, setDisplayTransitions] = useState<Transition[]>([]);
    const [riverNameFilter, setRiverNameFilter] = useState<string[] | undefined>([]);
    const [transitionTypeFilter, setTransitionTypeFilter] = useState<string[]>([]);
    const [permitDateFilter, setPermitDateFilter] = useState<[Date | null, Date | null]>([null, null]);
    const [filtersOpened, { toggle }] = useDisclosure(false);

    const loadMoreData = async () => {
        const minScrapeTimestamp = transitions.reduce((prev, curr) => prev.scrape_timestamp < curr.scrape_timestamp ? prev : curr).scrape_timestamp;
        await fetchTransitionData(supabase, minScrapeTimestamp.toISOString().split('T')[0]).then((moreTransitions: Transition[]) => {
            const mergedArrays = [... new Set([...moreTransitions, ...transitions])]
            mergedArrays.sort(function (a, b) {
                return new Date(b.scrape_timestamp).valueOf() - new Date(a.scrape_timestamp).valueOf();
            });
            setTransitions(mergedArrays)
            setDisplayTransitions(mergedArrays)
        })
    }

    useEffect(() => {
        const fetchData = async () => {
            await fetchTransitionData(supabase).then((transitions: Transition[]) => {
                setTransitions(transitions)
                setDisplayTransitions(transitions)
                setRiverNameFilter(riverList?.map((river) => river.name))
                setTransitionTypeFilter([...new Set(transitions.map((t) => t.transition_type))])
            })
        }
        fetchData();
    }, [])

    useEffect(() => {
        const updateDisplayTransitions = () => {
            const [minDateFilter, maxDateFilter] = permitDateFilter
            const filteredTransitions = transitions?.filter((t) =>
                riverNameFilter !== undefined &&
                riverNameFilter.includes(t.permit_name) &&
                transitionTypeFilter.includes(t.transition_type) &&
                (
                    minDateFilter !== null && maxDateFilter !== null ?
                        minDateFilter <= new Date(t.permit_date) && maxDateFilter >= new Date(t.permit_date) :
                        true
                )
            )
            setDisplayTransitions(filteredTransitions)

        }
        updateDisplayTransitions()
    }, [riverNameFilter, transitionTypeFilter, permitDateFilter, transitions])

    return (
        <>
            <Center>
                <Box style={{ 'width': '70vw' }}>
                    <Stack>
                        <Group justify="space-between">
                            <Title>Data Viewer</Title>
                            <Button variant="outline" onClick={toggle}>{filtersOpened ? 'Hide' : 'Display'} Filters</Button>
                        </Group>
                        <Collapse in={filtersOpened}>
                            <Divider />
                            <Group justify="space-between" p={'20px'} grow>
                                <Box style={{ width: '50%' }}>
                                    <Text fw={500}>Filter table based on date range, permit name, and permit transition type.</Text>
                                    <Space h={'lg'} />
                                    <MultiSelect
                                        label="Rivers"
                                        description="Filter by Rivers"
                                        data={riverList?.map((river) => river.name)}
                                        value={riverNameFilter}
                                        onChange={setRiverNameFilter}
                                        clearable

                                    />
                                    <Space h={'lg'} />
                                    <MultiSelect
                                        label="Transition Type"
                                        description="Filter by Transition Type"
                                        data={[...new Set(transitions.map((t) => t.transition_type))]}
                                        value={transitionTypeFilter}
                                        onChange={setTransitionTypeFilter}
                                        clearable

                                    />
                                </Box>
                                <Box>
                                    <Center>
                                        <DatePicker
                                            type="range"
                                            value={permitDateFilter}
                                            onChange={setPermitDateFilter}
                                        />
                                    </Center>
                                </Box>
                            </Group>
                        </Collapse>
                        <ScrollArea h={'85vh'}>
                            <Table
                                stickyHeader
                                highlightOnHover
                            >
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>#</Table.Th>
                                        <Table.Th>Permit Name</Table.Th>
                                        <Table.Th>Permit Date</Table.Th>
                                        <Table.Th>Total Permits</Table.Th>
                                        <Table.Th># Permits Available</Table.Th>
                                        <Table.Th>Transition Type</Table.Th>
                                        <Table.Th>Scrape Timestamp (UTC)</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {displayTransitions?.map((row, index) => (
                                        <Table.Tr key={index}>
                                            <Table.Td>{index + 1}</Table.Td>
                                            <Table.Td>{row.permit_name}</Table.Td>
                                            <Table.Td>{row.permit_date.toISOString().split('T')[0]}</Table.Td>
                                            <Table.Td>{row.total_permits}</Table.Td>
                                            <Table.Td>{row.availabile_permits}</Table.Td>
                                            <Table.Td>{row.transition_type}</Table.Td>
                                            <Table.Td>{row.scrape_timestamp.toISOString()}</Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                                <Table.Caption>
                                    <Button
                                        color="blue"
                                        onClick={loadMoreData}
                                        variant="outline"
                                    >
                                        Load More Data
                                    </Button>
                                </Table.Caption>
                            </Table>
                        </ScrollArea>
                    </Stack>
                </Box>
            </Center >
        </>
    )
}
import { Title, Center, Container, Text, Stack, Group, Button, Divider, Table, ActionIcon, MultiSelect } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import type { GeoJSON as GeoJSONType } from "leaflet";
import { supabase_s } from "./_app";
import { useAtom } from "jotai";
import { authenticated_s, currentUser_s } from "./state";
var _ = require('lodash');

export default function Alerts() {


    const dateOptions = { month: '2-digit', day: '2-digit', year: 'numeric' };

    interface AlertDateRange {
        startDate: Date
        endDate: Date
        river: string
    }


    const [riverList, setRiverList] = useState<string[]>([])
    const [selectedRivers, setSelectedRivers] = useState<string[]>([])

    const [supabase, setSupabase] = useAtom(supabase_s)
    const [authenticated] = useAtom(authenticated_s)
    const [currentUser] = useAtom(currentUser_s)

    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])
    const [alertDateRanges, setAlertDateRanges] = useState<AlertDateRange[]>([])

    useEffect(() => {
        const fetchMapData = async () => {
            await supabase.from('rivers').select().then((data) => {
                if (data.data) {
                    setRiverList(data.data.map((item) => (item.name)))
                }
            })
        }
        fetchMapData()

        const getAlertDates = async () => {
            const { data, error } = await supabase
                .from('alerts')
                .select('*')
                .eq('user_id', currentUser?.id)

            if (error) {
                console.log(error)
            } else {
                const alertDateRanges = data.flatMap((r) => ({
                    startDate: r.start_date,
                    endDate: r.end_date,
                    river: r.river,
                }))
                setAlertDateRanges(alertDateRanges)
            }
        }
        getAlertDates()

    }, [authenticated])



    const addRow = async (dateRange: [Date, Date]) => {
        if (authenticated) {

            const selectedAlerts = selectedRivers.flatMap((r) => ({
                startDate: dateRange[0].toLocaleDateString('en-US', dateOptions),
                endDate: dateRange[1].toLocaleDateString('en-US', dateOptions),
                river: r
            }));
            console.log(selectedAlerts)
            const newAlerts = _.differenceWith(selectedAlerts, alertDateRanges, _.isEqual)
            setAlertDateRanges([...alertDateRanges, ...newAlerts])
            for (const alertDateRange of newAlerts) {
                const { data, error } = await supabase
                    .from('alerts')
                    .insert({
                        start_date: alertDateRange.startDate,
                        end_date: alertDateRange.endDate,
                        river: alertDateRange.river,
                        user_id: currentUser?.id,
                    })
                if (error) {
                    console.error(error);
                }
            }
        } else {
            alert('You must be logged in to complete this action!')
        }
    };

    const removeRow = async (index) => {
        const newAlertDateRanges = alertDateRanges.filter((_, i) => i !== index);
        setAlertDateRanges(newAlertDateRanges)

        const deleteAlert = alertDateRanges.filter((_, i) => i === index)[0]
        const { data, error } = await supabase
            .from('alerts')
            .delete()
            .eq('start_date', deleteAlert.startDate)
            .eq('end_date', deleteAlert.endDate)
            .eq('river', deleteAlert.river)
        if (error) {
            console.error(error);
        }

    };


    return (
        <Center>
            <Container size={'sm'}>
                <Title>Alerts</Title>
                <Stack>
                    <Text>
                        Select dates on the calendar below to subscribe to alerts for.
                    </Text>
                    <Center>
                        <DatePicker
                            numberOfColumns={2}
                            type="range"
                            value={dateRange}
                            onChange={setDateRange} />
                    </Center>
                    <MultiSelect
                        value={selectedRivers}
                        onChange={setSelectedRivers}
                        data={riverList}
                        placeholder="Select river(s)"
                    />

                    <Button onClick={() => addRow(dateRange)}>Add Alert</Button>
                    <Divider />
                    <Title order={3}>Selected Alerts</Title>
                    <Text>For user {currentUser?.email}</Text>
                    <Table>
                        <thead>
                            <tr>
                                <th>River</th>
                                <th>Alert Start Date</th>
                                <th>Alert End Date</th>
                                <th>Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alertDateRanges.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.river}</td>
                                    <td>{row.startDate}</td>
                                    <td>{row.endDate}</td>
                                    <td>
                                        <ActionIcon onClick={() => removeRow(index)}>
                                            <IconX />
                                        </ActionIcon>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Stack>
            </Container>
        </Center>
    )
}
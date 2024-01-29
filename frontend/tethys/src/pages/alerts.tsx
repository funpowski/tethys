import { Title, Center, Container, Text, Stack, Group, Button, Divider, Table, ActionIcon, MultiSelect, Code, Space, Checkbox, Switch, TextInput, em, ScrollArea, Box } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { supabase_s } from "./_app";
import { useAtom } from "jotai";
import { authenticated_s, currentUser_s, userAlerts_s } from "../state";
var _ = require('lodash');
import { fetchAlertDatesByUser, fetchRiversData } from "@/api/supabase";
import { River } from "./riverMap";
import { useMediaQuery } from "@mantine/hooks";

export interface AlertDateRange {
    startDate: Date
    endDate: Date
    river: string
    slack_member_id: string | null
}

export default function Alerts() {


    const dateOptions = { month: '2-digit', day: '2-digit', year: 'numeric' };



    const [riverList, setRiverList] = useState<string[]>([])
    const [selectedRivers, setSelectedRivers] = useState<string[]>([])

    const [supabase, setSupabase] = useAtom(supabase_s)
    const [authenticated] = useAtom(authenticated_s)
    const [currentUser] = useAtom(currentUser_s)

    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])
    const [alertDateRanges, setAlertDateRanges] = useAtom(userAlerts_s)
    const [slackAlertToggle, setSlackAlertToggle] = useState<boolean>(false)
    const [slackAlertMemberId, setSlackAlertMemberId] = useState<string | null>(null)
    const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

    useEffect(() => {
        const fetchData = async () => {
            await fetchRiversData(supabase).then((rivers: River[]) => {
                setRiverList(rivers.map((item) => (item.name)))
            })
            if (currentUser !== null) {
                await fetchAlertDatesByUser(supabase, currentUser?.id).then((alertDateRanges: AlertDateRange[]) => {
                    setAlertDateRanges(alertDateRanges)
                })
            }
        }
        fetchData();

    }, [authenticated])


    const addRow = async (dateRange: [Date | null, Date | null]) => {
        if (authenticated) {

            const [startDate, endDate] = dateRange;
            if (startDate !== null && endDate !== null) {
                const selectedAlerts = selectedRivers.flatMap((r) => ({
                    startDate: startDate.toISOString().split('T')[0],
                    endDate: endDate.toISOString().split('T')[0],
                    river: r,
                    slack_member_id: slackAlertToggle ? slackAlertMemberId : null
                }));
                const newAlerts = _.differenceWith(selectedAlerts, alertDateRanges, _.isEqual)
                if (alertDateRanges !== null) {
                    setAlertDateRanges([...alertDateRanges, ...newAlerts])
                }
                for (const alertDateRange of newAlerts) {
                    await supabase?.from('alerts')
                        .insert({
                            start_date: alertDateRange.startDate,
                            end_date: alertDateRange.endDate,
                            river: alertDateRange.river,
                            user_id: currentUser?.id,
                            slack_member_id: alertDateRange.slack_member_id
                        })
                }
            }
        } else {
            alert('You must be logged in to complete this action!')
        }
    };

    const removeRow = async (index: number) => {
        if (alertDateRanges !== null) {
            const newAlertDateRanges = alertDateRanges.filter((_, i) => i !== index);
            setAlertDateRanges(newAlertDateRanges)

            const deleteAlert = alertDateRanges.filter((_, i) => i === index)[0]
            await supabase?.from('alerts')
                .delete()
                .eq('start_date', deleteAlert.startDate)
                .eq('end_date', deleteAlert.endDate)
                .eq('river', deleteAlert.river)
        }

    };

    function generateTable() {
        return (
            <Table highlightOnHover stickyHeader >
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th align='left'>River</Table.Th>
                        <Table.Th align='left'>Alert Start Date</Table.Th>
                        <Table.Th align='left'>Alert End Date</Table.Th>
                        <Table.Th align='left'>Slack Alert Target</Table.Th>
                        <Table.Th align='center'>Remove</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                {
                    currentUser !== null ?
                        <Table.Tbody>
                            {alertDateRanges?.map((row, index) => (
                                <Table.Tr key={index}>
                                    <Table.Td align="left">{row.river}</Table.Td>
                                    <Table.Td align="left">{row.startDate.toString()}</Table.Td>
                                    <Table.Td align="left">{row.endDate.toString()}</Table.Td>
                                    <Table.Td align="left">{row.slack_member_id}</Table.Td>
                                    <Table.Td align="center">
                                        <ActionIcon color="red" variant="outline" onClick={() => removeRow(index)}>
                                            <IconX />
                                        </ActionIcon>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                        :
                        <Table.Caption>Please login to see alerts</Table.Caption>
                }
            </Table>
        )
    }

    return (
        <Center>
            <Container size={'lg'}>
                {!isMobile && <Title>Alerts</Title>}
                <Space my={'md'} />
                <Text>Use the following date picker and river selector to setup alerts for specific rivers.</Text>
                <Space my={'md'} />
                <Stack>
                    <MultiSelect
                        value={selectedRivers}
                        onChange={setSelectedRivers}
                        data={riverList}
                        placeholder="Select river(s)"
                    />
                    <Group>
                        <Switch
                            checked={slackAlertToggle}
                            onChange={(event) => setSlackAlertToggle(event.currentTarget.checked)}
                            label={'Enable Slack Notification for Alert?'}
                            description={<a target="_blank" rel="noopener noreferrer" href="https://www.workast.com/help/article/how-to-find-a-slack-user-id/">How to find Slack Member ID</a>}
                        />
                        <TextInput
                            disabled={!slackAlertToggle}
                            placeholder="Slack Member ID"
                            value={slackAlertMemberId === null ? "" : slackAlertMemberId}
                            onChange={(event) => setSlackAlertMemberId(event.currentTarget.value)}
                        />
                    </Group>
                    <DatePicker
                        type="range"
                        numberOfColumns={isMobile ? 1 : 2}
                        value={dateRange}
                        onChange={setDateRange}
                    />

                    <Button onClick={() => {
                        addRow(dateRange)
                    }}>Add Alert</Button>
                    <Space my={'md'} />
                    <Group>
                        <Title order={3}>Selected Alerts</Title>
                        <Code>{currentUser !== null ? currentUser?.email : null}</Code>
                    </Group>
                    {isMobile ?
                        <ScrollArea w={'80vw'} >
                            {generateTable()}
                        </ScrollArea>
                        :
                        generateTable()
                    }
                </Stack>
            </Container>
        </Center >
    )
}
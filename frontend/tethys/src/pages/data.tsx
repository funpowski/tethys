import { useAtom } from "jotai";
import { supabase_s } from "./_app";
import { activeRiver_s, riverList_s } from "./state";
import { Center, Container, Divider, Select, Space, Stack, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";

export default function DataContainer() {
    const [activeRiver, setActiveRiver] = useAtom(activeRiver_s)
    const [riverList, setRiverList] = useAtom(riverList_s)
    const [supabase, setSupabase] = useAtom(supabase_s)

    useEffect(() => {
        const fetchMapData = async () => {
            await supabase.from('transitions').select().eq('permit_name', activeRiver?.name).then((data) => {
                if (data.data) {
                    console.log(data.data)
                }
            })
        }

        fetchMapData()
    }, [activeRiver])

    return (
        <>
            <Center>
                <Stack>
                    <Container size={'sm'}>
                        <Title>Data Explorer</Title>
                        <Stack>
                            <Text>
                                Use this tool to explore data about different rivers.
                            </Text>
                        </Stack>
                        <Space h="lg" />
                    </Container >
                    <Select
                        label="Select River"
                        placeholder=""
                        data={riverList?.map(obj => ({
                            value: obj.name,
                            label: obj.display_name
                        }))}
                        onChange={(selectedValue) => {
                            const selectedRiver = riverList?.find(obj => obj.name === selectedValue);
                            if (selectedRiver !== null) {
                                console.log(selectedRiver)
                                setActiveRiver(selectedRiver);
                            }
                        }}
                    />
                    <Divider />
                </Stack>
            </Center>
        </>
    )
}
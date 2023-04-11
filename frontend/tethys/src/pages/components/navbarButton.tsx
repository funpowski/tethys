import { Avatar, Container, Group, Text, UnstyledButton } from "@mantine/core";
import type { Icon } from "@tabler/icons-react";
import React from "react";
import { activeTab_s } from "../state";
import { useAtom } from "jotai";

interface NavbarButtonInterface {
    name: string
    icon: any
    setActiveTab: React.Dispatch<React.SetStateAction<JSX.Element>>
    tab: JSX.Element
}

export function NavbarButton({ name, icon, setActiveTab, tab }: NavbarButtonInterface) {
    return (
        <UnstyledButton onClick={() => setActiveTab(tab)}>
            <Group >
                {icon}
                <div>
                    <Text>{name}</Text>
                </div>
            </Group>
        </UnstyledButton>
    )
}
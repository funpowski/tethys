import { Avatar, Container, Group, Text, UnstyledButton, em } from "@mantine/core";
import type { Icon } from "@tabler/icons-react";
import React, { ChangeEvent, useEffect, useState } from "react";
import { activeTabName_s, activeTab_s } from "../../state";
import { useAtom } from "jotai";
import { useMediaQuery } from "@mantine/hooks";

interface NavbarButtonInterface {
    name: string
    icon: any
    tab: React.ElementRef<any>
    onSelect: React.Dispatch<React.SetStateAction<string>>
    isSelected: boolean
    sidebarToggle: React.ChangeEventHandler
}


export default function NavbarButton({ name, icon, tab, onSelect, isSelected, sidebarToggle }: NavbarButtonInterface) {
    const [isHovered, setIsHovered] = useState(false);
    const [activeTab, setActiveTab] = useAtom(activeTab_s)
    const [activeTabName, setActiveTabName] = useAtom(activeTabName_s)
    const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

    const getBackgroundColor: () => string = () => {
        if (isSelected) {
            return 'lightblue'
        } else if (isHovered) {
            return 'lightgray'
        } else {
            return 'transparent'
        }
    };

    useEffect(() => {
        if (isMobile) {
            isMobile ? sidebarToggle(null as unknown as ChangeEvent) : 0 // hacky to trick typescript into not complaining
        }
    }, [activeTabName])
    return (
        <UnstyledButton
            onClick={() => {
                setActiveTab(tab as unknown as React.ReactNode);
                onSelect(name);
                setActiveTabName(name);
            }}
            onMouseOver={() => setIsHovered(true)}
            onMouseOut={() => setIsHovered(false)}
            style={{
                backgroundColor: getBackgroundColor(),
                borderRadius: '4px',
                padding: '10px'
            }}
        >
            <Group >
                {icon}
                <div>
                    <Text>{name}</Text>
                </div>
            </Group>
        </UnstyledButton>
    )
}
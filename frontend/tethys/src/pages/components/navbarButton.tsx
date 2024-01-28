import { Avatar, Container, Group, Text, UnstyledButton } from "@mantine/core";
import type { Icon } from "@tabler/icons-react";
import React, { useState } from "react";
import { activeTab_s } from "../../state";
import { useAtom } from "jotai";

interface NavbarButtonInterface {
    name: string
    icon: any
    tab: React.ElementRef<any>
    onSelect: React.Dispatch<React.SetStateAction<string>>
    isSelected: boolean

}


export default function NavbarButton({ name, icon, tab, onSelect, isSelected }: NavbarButtonInterface) {
    const [isHovered, setIsHovered] = useState(false);
    const [activeTab, setActiveTab] = useAtom(activeTab_s)
    const [isActive, setIsActive] = useState(false);

    const getBackgroundColor: () => string = () => {
        if (isSelected) {
            return 'lightblue'
        } else if (isHovered) {
            return 'lightgray'
        } else {
            return 'transparent'
        }
    };
    return (
        <UnstyledButton
            onClick={() => {
                setActiveTab(tab as unknown as React.ReactNode);
                onSelect(name);

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
import { Box, Burger, Group, Title, em } from "@mantine/core";
import About from "../about";
import { activeTabName_s, activeTab_s } from "@/state";
import { useAtom } from 'jotai';
import { useDisclosure, useMediaQuery } from "@mantine/hooks";

export default function AppTitleBar({ mobileSidebarOpen, toggle }) {
    const [activeTab, setActiveTab] = useAtom(activeTab_s)
    const [activeTabName, setActiveTabName] = useAtom(activeTabName_s)
    const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

    function getTitleName(): string {
        if (isMobile) {
            if (mobileSidebarOpen) {
                return 'Tethys'
            } else {
                if (activeTabName === 'River Map') { // handle landing page case
                    return 'Tethys'
                } else {
                    return activeTabName
                }
            }
        } else {
            return 'Tethys'
        }
    }

    return (
        <Box style={{
            padding: '20px',
            backgroundColor: 'white',
            borderColor: 'black',
            zIndex: 9999,
            position: 'sticky',
            top: 0,
        }}>
            <Group justify="space-between">
                <Title onClick={() => setActiveTab(<About />)} style={{ cursor: 'pointer' }}>
                    🦦 {getTitleName()}
                </Title>
                {isMobile && <Burger opened={mobileSidebarOpen} onClick={toggle} aria-label="Toggle navigation" />}
            </Group>
        </Box>
    )
}
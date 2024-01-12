import { AppShell, Navbar, Header, Text, Stack, Title, Container, Divider, Space, NavLink, UnstyledButton, Group } from '@mantine/core';
import { NavbarButton } from './components/navbarButton';
import { IconAlarm, IconDatabase, IconHelpCircle, IconMap, IconUser } from '@tabler/icons-react';
import { activeTab_s, currentUser_s } from './state';
import About from './about';
import { useRef, useState } from 'react';
import Alerts from './alerts';
import Account from './account';
import DataContainer from './data';
import dynamic from "next/dynamic"
import { useDisclosure } from '@mantine/hooks';
import { useAtom } from 'jotai';
import RiverMap from './riverMap';

const MapWithNoSSR = dynamic(() => import('./riverMap'), {
  ssr: false,
});

export default function App() {

  const [currentUser, setCurrentUser] = useAtom(currentUser_s)
  const [activeTab, setActiveTab] = useState(<MapWithNoSSR />)
  const [loginModalOpen, { open, close }] = useDisclosure(false)
  const buttons = [
    <NavbarButton name={'River Map'} icon={<IconMap />} tab={<MapWithNoSSR />} setActiveTab={setActiveTab} />,
    <NavbarButton name={'Data'} icon={<IconDatabase />} tab={<DataContainer />} setActiveTab={setActiveTab} />,
    <NavbarButton name={'Alerts'} icon={<IconAlarm />} tab={<Alerts />} setActiveTab={setActiveTab} />,
    <NavbarButton name={'About'} icon={<IconHelpCircle />} tab={<About />} setActiveTab={setActiveTab} />,
  ]

  return (
    <>

      <AppShell
        padding="md"
        navbar={
          <Navbar width={{ base: 300 }} height={'100vh'} p="xs">
            <Navbar.Section>
              <Title onClick={() => setActiveTab(<About />)} sx={{ cursor: 'pointer' }}>
                🦦 Tethys
              </Title>
            </Navbar.Section>

            <Space h="md" />
            <Divider />

            <Navbar.Section grow mt="md">
              <Stack>
                {...buttons}
              </Stack>
            </Navbar.Section>

            <Divider />
            <Space h="md" />

            <Navbar.Section>
              <UnstyledButton onClick={open}>
                <Group >
                  <IconUser />
                  <div>
                    <Text>{currentUser === null ? 'Account' : currentUser.email}</Text>
                  </div>
                </Group>
              </UnstyledButton>
              <Account opened={loginModalOpen} close={close} />
            </Navbar.Section>
          </Navbar>}
        styles={(theme) => ({
          main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
        })}
      >
        {activeTab}
      </AppShell>
    </>
  );
}
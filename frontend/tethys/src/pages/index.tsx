import { AppShell, Navbar, Header, Text, Stack, Title, Container, Divider, Space, NavLink } from '@mantine/core';
import { NavbarButton } from './components/navbarButton';
import { IconAlarm, IconDatabase, IconHome, IconMap, IconUser } from '@tabler/icons-react';
import { activeTab_s } from './state';
import Home from './home';
import { useRef, useState } from 'react';
import Alerts from './alerts';
import Account from './account';
import Data from './data';
import dynamic from "next/dynamic"

const MapWithNoSSR = dynamic(() => import('./riverMap'), {
  ssr: false,
});

export default function App() {

  const [activeTab, setActiveTab] = useState(<Home />)

  const buttons = [
    <NavbarButton name={'Home'} icon={<IconHome />} tab={<Home />} setActiveTab={setActiveTab} />,
    <NavbarButton name={'River Map'} icon={<IconMap />} tab={<MapWithNoSSR />} setActiveTab={setActiveTab} />,
    <NavbarButton name={'Data'} icon={<IconDatabase />} tab={<Data />} setActiveTab={setActiveTab} />,
    <NavbarButton name={'Alerts'} icon={<IconAlarm />} tab={<Alerts />} setActiveTab={setActiveTab} />,
  ]

  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar width={{ base: 300 }} height={'100vh'} p="xs">
          <Navbar.Section>
            <Title onClick={() => setActiveTab(<Home />)} sx={{ cursor: 'pointer' }}>
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
            <NavbarButton name={'Account'} icon={<IconUser />} tab={<Account />} setActiveTab={setActiveTab} />,
          </Navbar.Section>
        </Navbar>}
      styles={(theme) => ({
        main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
      })}
    >
      {activeTab}
    </AppShell>
  );
}
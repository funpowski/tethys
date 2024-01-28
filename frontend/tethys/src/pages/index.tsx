import { AppShell, ScrollArea, Text, Stack, Title, Container, Divider, Space, NavLink, UnstyledButton, Group, Box } from '@mantine/core';
import { IconAlarm, IconDatabase, IconHelpCircle, IconMap, IconUser } from '@tabler/icons-react';
import { activeTab_s, currentUser_s } from '../state';
import About from './about';
import { useEffect, useRef, useState } from 'react';
import Alerts from './alerts';
import Account from './account';
import DataContainer from './data';
import dynamic from "next/dynamic"
import { useDisclosure } from '@mantine/hooks';
import { useAtom } from 'jotai';
import { River } from './riverMap';
import { fetchRiversData } from '@/api/supabase';
import { supabase_s } from "./_app"
import { riverList_s } from "../state"
import NavbarButton from './components/navbarButton';

const MapWithNoSSR = dynamic(() => import('./riverMap'), {
  ssr: false,
});

export default function App() {

  const [currentUser, setCurrentUser] = useAtom(currentUser_s)
  const [activeTab, setActiveTab] = useAtom(activeTab_s)
  const [loginModalOpen, { open, close }] = useDisclosure(false)
  const [supabase, setSupabase] = useAtom(supabase_s)
  const [riverList, setRiverList] = useAtom(riverList_s)
  const [selectedButton, setSelectedButton] = useState<string>('River Map');


  const buttons = [
    <NavbarButton
      name={'River Map'}
      icon={<IconMap />}
      tab={<MapWithNoSSR />}
      onSelect={setSelectedButton}
      isSelected={selectedButton === 'River Map'}
      key={'river_map'}
    />,
    <NavbarButton
      name={'Data'}
      icon={<IconDatabase />}
      tab={<DataContainer />}
      onSelect={setSelectedButton}
      isSelected={selectedButton === 'Data'}
      key={'data'}
    />,
    <NavbarButton
      name={'Alerts'}
      icon={<IconAlarm />}
      tab={<Alerts />}
      onSelect={setSelectedButton}
      isSelected={selectedButton === 'Alerts'}
      key={'alerts'}
    />,
    <NavbarButton
      name={'About'}
      icon={<IconHelpCircle />}
      tab={<About />}
      onSelect={setSelectedButton}
      isSelected={selectedButton === 'About'}
      key={'about'}
    />,
  ]

  useEffect(() => {
    const fetchData = async () => {
      await fetchRiversData(supabase).then((rivers: River[]) => {
        setRiverList(rivers)
      })
    }
    fetchData();

  }, [])


  return (
    <>

      <AppShell
        padding="md"
        withBorder={false}
        navbar={{
          width: 300,
          breakpoint: 'sm',
          collapsed: { mobile: !loginModalOpen },
        }}
        zIndex={0}
      >
        <AppShell.Navbar >
          <AppShell.Section p={10}>
            <Title onClick={() => setActiveTab(<About />)} style={{ cursor: 'pointer' }}>
              🦦 Tethys
            </Title>
          </AppShell.Section>
          <Divider />

          <AppShell.Section grow component={ScrollArea}>
            <Stack p={10}>
              {...buttons}
            </Stack>
          </AppShell.Section>

          <Divider />
          <Space h="md" />

          <AppShell.Section p={10} w={'100%'}>
            <Stack>
              <NavbarButton
                name={currentUser === null ? 'Account' : currentUser.email}
                icon={<IconUser />}
                tab={<Account />}
                onSelect={setSelectedButton}
                isSelected={selectedButton === 'Account' || selectedButton === currentUser?.email}
                key={'account'}
              />
            </Stack>
          </AppShell.Section>
        </AppShell.Navbar>
        <AppShell.Main>
          {activeTab}
        </AppShell.Main>
      </AppShell>
    </>
  );
}
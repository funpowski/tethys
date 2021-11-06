import { Box, Center, IconButton, Text, Flex } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react"
import { ChevronRightIcon } from '@chakra-ui/icons'

import Map from '../../components/Map'
import RangePicker from '../../components/Calendar'

interface Props {
  onShowSidebar: Function
  showSidebarButton?: boolean
}

const Header = ({ showSidebarButton = true, onShowSidebar }: Props) => {
  return (
    <Tabs isFitted variant="enclosed">
      <TabList mb="1em">
        <Tab>Calendar</Tab>
        <Tab>Map</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Center>
            <RangePicker />
          </Center>
        </TabPanel>
        <TabPanel>
          <Box>
            <Map />
          </Box>
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

export default Header

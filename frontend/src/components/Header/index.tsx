import { Box, Center, VStack } from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react"
import { Component } from 'react'

import Map from '../../components/Map'
import RangePicker from '../../components/Calendar'
import RangeTable from '../../components/Table'

interface tableEntry{
  startDate:string,
  endDate:string
}

// good notes about why any is required https://stackoverflow.com/a/47562985/13354634
class Header extends Component<any, any>{
  constructor(props) {
    super(props);
    this.state = {
      invalidate:false,
      datesList:[]
    }
  }

  rerenderMap(){
    // console.log(this.trigger.current.focus())
    this.setState({invalidate:!this.state.invalidate})
  }

  render(){
    return (
      <Tabs isFitted variant="enclosed">
        <TabList mb="1em">
          <Tab>Calendar</Tab>
          <Tab onClick={() => this.rerenderMap()}>Map</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Center>
              <VStack>
              <RangePicker />
              <RangeTable />
              </VStack>
            </Center>
          </TabPanel>
          <TabPanel>
            <Box>
              <Map invalidate={this.state.invalidate}/>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    )
  }
}

export default Header

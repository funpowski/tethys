import {Box, VStack, Spacer, Flex } from '@chakra-ui/react'
import { Calendar, Map, Home, Tool } from 'react-feather';  // icons
import { Component } from 'react'

class Sidebar extends Component{
  constructor(props) {
    super(props);
  }

  clicked(){
    console.log("shit")
  }

  render(){
    return(
      <Flex direction="column" height="100%" p="2">
        <VStack spacing="2">
          <Box as="button" onClick={() => this.clicked()} title="Home" borderRadius="md" bg="nord.3" color="white" px={2} h={8}>
            <Home/>
          </Box>
          <Box as="button" title="Map" borderRadius="md" bg="nord.3" color="white" px={2} h={8}>
            <Map />
          </Box>
          <Box as="button" title="Calendar" borderRadius="md" bg="nord.3" color="white" px={2} h={8}>
            <Calendar />
          </Box>
        </VStack>
        <Spacer />
        <Box as="button" title="Settings" borderRadius="md" bg="nord.3" color="white" px={2} h={8}>
          <Tool />
        </Box>
      </Flex>
    )
  }

}

export default Sidebar

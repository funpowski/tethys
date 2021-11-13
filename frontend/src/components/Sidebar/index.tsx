import {Box, VStack, Spacer, Flex } from '@chakra-ui/react'
import { Calendar, Map, Home, Tool } from 'react-feather';  // icons
import { Component } from 'react'

class Sidebar extends Component{
  constructor(props) {
    super(props);
  }

  render(){
    return(
      <Flex direction="column" height="100%">
        <Box as="button" borderRadius="md" color="white" px={4} h={8}>
          <Home />
        </Box>
        <Box as="button" borderRadius="md" color="white" px={4} h={8}>
          <Map />
        </Box>
        <Box as="button" borderRadius="md" color="white" px={4} h={8}>
          <Calendar />
        </Box>
        <Spacer />
        <Box as="button" borderRadius="md" color="white" px={4} h={8}>
          <Tool />
        </Box>
      </Flex>
    )
  }

}

export default Sidebar

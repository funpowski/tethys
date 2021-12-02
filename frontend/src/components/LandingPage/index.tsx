import { Box, Center, Text } from '@chakra-ui/react'
import { Component } from 'react'

// good notes about why any is required https://stackoverflow.com/a/47562985/13354634
class LandingPage extends Component<any, any>{

  render(){
    return (
      <Center vertical-align="center">
        <Box bg="nord.1" p="4" borderRadius="10" >
          <Text fontSize="6xl" color="nord.4" >
             tethys.[something]
          </Text>
          <Text color="nord.4">
             My silly little app for booking silly little river trips.
          </Text>
        </Box>
      </Center>
    )
  }
}

export default LandingPage

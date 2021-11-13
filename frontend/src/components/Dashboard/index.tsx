import { Box, Flex, Center, Square } from '@chakra-ui/react'
import { Component } from 'react'

import LandingPage from '../../components/LandingPage'
import Sidebar from '../../components/Sidebar'


// good notes about why any is required https://stackoverflow.com/a/47562985/13354634
class Dashboard extends Component<any, any>{
  constructor(props) {
    super(props);
    this.state = {
      invalidate:false,
      datesList:[],
      activeTab: <LandingPage />
    }
    this.changeTab = this.changeTab.bind(this)
  }

  changeTab(newTab){
    this.setState({activeTab:newTab});
  }

  rerenderMap(){
    this.setState({invalidate:!this.state.invalidate})
  }

  render(){
    return (
      <Flex color="nord.0">
        <Center h="100vh" bg="nord.1">
          <Sidebar changeTab={this.changeTab}/>
        </Center>
        <Square h="100vh" flex="1" bg="nord.0">
          <Box w="100%" h="100%" p={2}>
            {this.state.activeTab}
          </Box>
        </Square>
      </Flex>
    )
  }
}

export default Dashboard

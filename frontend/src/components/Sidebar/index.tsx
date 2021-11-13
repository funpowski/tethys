import {Box, VStack, Spacer, Flex, Button } from '@chakra-ui/react'
import { Calendar, Map, Home, Tool } from 'react-feather';  // icons
import { Component } from 'react'

class SidebarButton extends Component<any, any>{
  constructor(props) {
    super(props);
  }

  clicked(){
    console.log("fuck")
  }

  render(){
    return(
      <Button
        onClick={this.clicked}
        _hover={{color:"nord.11"}}
        title={this.props.title}
        borderRadius="md"
        bg="nord.3"
        color="white"
        px={2}
        h={8}
      >
        {this.props.icon}
      </Button>
    )
  }
}

class Sidebar extends Component{
  constructor(props) {
    super(props);
  }

  homeIcon = <Home />;
  mapIcon = <Map />;
  calendarIcon = <Calendar />;
  settingsIcon = <Tool />;

  render(){
    return(
      <Flex direction="column" height="100%" p="2">
        <VStack spacing="2">
          <SidebarButton title="Home" icon={this.homeIcon} />
          <SidebarButton title="Map" icon={this.mapIcon} />
          <SidebarButton title="Calendar" icon={this.calendarIcon} />
        </VStack>
        <Spacer />
        <SidebarButton title="Settings" icon={this.settingsIcon} />
      </Flex>
    )
  }

}

export default Sidebar

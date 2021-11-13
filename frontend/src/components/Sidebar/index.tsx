import { VStack, Spacer, Flex, Button } from '@chakra-ui/react'
import * as Feather from 'react-feather';  // icons
import { Component } from 'react'

import Map from '../../components/Map'
import Calendar from '../../components/Calendar'
import LandingPage from '../../components/LandingPage'

class SidebarButton extends Component<any, any>{
  constructor(props) {
    super(props);
    this.clicked = this.clicked.bind(this)
  }

  clicked(){
    this.props.updateTab(this.props.title)
  }

  render(){
    return(
      <Button
        onClick={() => this.clicked()}
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

class Sidebar extends Component<any, any>{
  constructor(props) {
    super(props);
    this.state={
      activeTab:this.props.activeTab
    }
    this.updateTab = this.updateTab.bind(this)
  }

  homeIcon = <Feather.Home/>;
  mapIcon = <Feather.Map />;
  calendarIcon = <Feather.Calendar />;
  settingsIcon = <Feather.Tool />;

  tabDict = {
    "Home": <LandingPage />,
    "Map": <Map />,
    "Calendar": <Calendar />,
    "Settings": <LandingPage />
  }

  updateTab(name){
    this.props.changeTab(this.tabDict[name])
  }

  render(){
    return(
      <Flex direction="column" height="100%" p="2">
        <VStack spacing="2">
          <SidebarButton title="Home" icon={this.homeIcon} activeTab={this.state.activeTab} updateTab={this.updateTab}/>
          <SidebarButton title="Map" icon={this.mapIcon} activeTab={this.state.activeTab} updateTab={this.updateTab}/>
          <SidebarButton title="Calendar" icon={this.calendarIcon} activeTab={this.state.activeTab} updateTab={this.updateTab}/>
        </VStack>
        <Spacer />
        <SidebarButton title="Settings" icon={this.settingsIcon} activeTab={this.state.activeTab} updateTab={this.updateTab}/>
      </Flex>
    )
  }

}

export default Sidebar

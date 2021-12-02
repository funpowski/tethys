import { VStack, Spacer, Button, Box, Flex, Center, Square } from '@chakra-ui/react'
import { Component } from 'react'
import * as Feather from 'react-feather';  // icons

import LandingPage from '../../components/LandingPage'
import Map from '../../components/Map'
import Calendar from '../../components/Calendar'

// SIDEBAR BUTTON
class SidebarButton extends Component<any, any>{
  constructor(props) {
    super(props);
    this.clicked = this.clicked.bind(this);
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

//DASHBOARD (Sidebar and Main Layout)
// good notes about why any is required https://stackoverflow.com/a/47562985/13354634
class Dashboard extends Component<any, any>{
  constructor(props) {
    super(props);
    this.state = {
      tableData:[],
      datesList:[],
      activeTab: <LandingPage />,
    }
    this.updateTab = this.updateTab.bind(this);
    this.updateTableData = this.updateTableData.bind(this);
    this.deleteTableRow = this.deleteTableRow.bind(this);
    console.log(this.state)
  }

  updateTab(name){
    var tabDict = {
      "Home": <LandingPage />,
      "Map": <Map />,
      "Calendar": <Calendar
        tableData={this.state.tableData}
        deleteTableRow={this.deleteTableRow}
        updateTableData={this.updateTableData}
        />,
      "Settings": <LandingPage />,
      "Account": <LandingPage />
    }
    this.setState({
      activeTab: tabDict[name]
    })
  }

  updateTableData(newTableData){
    this.setState({
      tableData: newTableData
    })
  }

  deleteTableRow(key){
    var tableData = this.state.tableData;
    delete tableData[key];
    this.updateTableData(tableData);
  }

  render(){
    return (
      <Flex color="nord.0">
        <Center h="100vh" bg="nord.1">
          <Flex direction="column" height="100%" p="2">
            <VStack spacing="2">
              <SidebarButton title="Home" icon={<Feather.Home />} activeTab={this.state.activeTab} updateTab={this.updateTab}/>
              <SidebarButton title="Map" icon={<Feather.Map />} activeTab={this.state.activeTab} updateTab={this.updateTab}/>
              <SidebarButton title="Calendar" icon={<Feather.Calendar />} activeTab={this.state.activeTab} updateTab={this.updateTab}/>
            </VStack>
            <Spacer />
            <VStack spacing="2">
              <SidebarButton title="Account" icon={<Feather.User />} activeTab={this.state.activeTab} updateTab={this.updateTab}/>
              <SidebarButton title="Settings" icon={<Feather.Tool />} activeTab={this.state.activeTab} updateTab={this.updateTab}/>
            </VStack>
          </Flex>
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

import { Box, } from '@chakra-ui/react'
import { Component } from 'react'

import Map from '../../components/Map'
import RangePicker from '../../components/Calendar'
import RangeTable from '../../components/Table'
import LandingPage from '../../components/LandingPage'

interface tableEntry{
  startDate:string,
  endDate:string
}

// good notes about why any is required https://stackoverflow.com/a/47562985/13354634
class Dashboard extends Component<any, any>{
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
      <Box w="100%" h="100%">
        <LandingPage />
      </Box>
    )
  }
}

export default Dashboard

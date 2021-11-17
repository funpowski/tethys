import { Box, Flex, Center } from '@chakra-ui/react'
import { Component } from 'react';
import DatePicker from "react-datepicker";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
} from "@chakra-ui/react"

import "./react-datepicker.css";

class Calendar extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      endDate: null,
      calendarMonthDivWidth: 240,
      viewportWidth: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
    }
  }

  handleSelect(ranges){
    console.log(ranges);
  }

  render(){
    return (
      <Flex spacing="2" h="100%" direction="column">
        <Box w="100%" p={2}>
          <Center>
            <DatePicker
              selected={this.state.startDate}
              onChange={(dates) => {
                const [start, end] = dates;
                this.setState({
                  startDate:start,
                  endDate:end
                })
              }}
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              monthsShown={Math.round(this.state.viewportWidth/this.state.calendarMonthDivWidth*0.9)}
              selectsRange
              inline
            />
          </Center>
        </Box>
        <Box w="100%" overflow="auto" flex={1} p={2}>
          <Table variant="simple" colorScheme="nordscheme" bg="nord.7">
            <TableCaption>Imperial to metric conversion factors</TableCaption>
            <Thead>
              <Tr>
                <Th>To convert</Th>
                <Th>into</Th>
                <Th isNumeric>multiply by</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>inches</Td>
                <Td>millimetres (mm)</Td>
                <Td isNumeric>25.4</Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      </Flex>
    )
  }
}

export default Calendar

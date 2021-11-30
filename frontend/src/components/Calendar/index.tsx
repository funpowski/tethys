import { Box, Flex, Center, Spacer } from '@chakra-ui/react'
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

function TableEntry(props){
  return (
    <Tr>
      <Td>{props.start.toLocaleDateString('en-us')}</Td>
      <Td>{props.end.toLocaleDateString('en-us')}</Td>
      <Td>River place holder</Td>
    </Tr>
  )
}

class Calendar extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      endDate: null,
      tableData:[],
    }
  }

  datePickerChange(dates){
    const [start, end] = dates;
    if (end != null){
      this.setState({
        tableData: [...this.state.tableData, {
            start:start,
            end:end,
        }]
      })
    }
    this.setState({
      startDate:start,
      endDate:end,
    })
  }

  render(){
    return (
      <Flex spacing="2" h="100%" direction="column">
        <Box w="100%" p={2}>
          <Center>
            <DatePicker
              selected={this.state.startDate}
              onChange={(dates) => this.datePickerChange(dates)}
              startDate={this.state.startDate}
              endDate={this.state.endDate}
              monthsShown={3}
              selectsRange
              inline
            />
          </Center>
        </Box>
        <Flex>
        <Spacer />
          <Box w="720px" overflow="auto">
            <Table variant="simple" colorScheme="nordscheme" bg="nord.7">
              <TableCaption>Imperial to metric conversion factors</TableCaption>
              <Thead>
                <Tr>
                  <Th>Start Date</Th>
                  <Th>End Date</Th>
                  <Th>River</Th>
                </Tr>
              </Thead>
              <Tbody>
                 {this.state.tableData.map((data, i) =>
                   <TableEntry
                      key={i}
                      start={data.start}
                      end={data.end}
                   />
                 )}
              </Tbody>
            </Table>
          </Box>
        <Spacer />
        </Flex>
      </Flex>
    )
  }
}

export default Calendar

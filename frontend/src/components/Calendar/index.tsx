import { Box, IconButton, Flex, Center, Spacer, Checkbox, Stack } from '@chakra-ui/react'
import React, { Component } from 'react';
import DatePicker from "react-datepicker";
import * as Feather from 'react-feather';  // icons
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

// TABLE ENTRY CLASS
function TableEntry(props){
  return (
    <Tr>
      <Td>{props.start.toLocaleDateString('en-us')}</Td>
      <Td>{props.end.toLocaleDateString('en-us')}</Td>
      <Td>{props.name}</Td>
      <Td>
        <IconButton icon={<Feather.XCircle />} />
      </Td>
    </Tr>
  )
}

// RIVER CHECKBOX CLASS
function RiverCheckboxes(props) {
  // BONE figure out better way to do this
  return(
    <Stack spacing={10} direction='column'>
      <Checkbox onChange={(e) => props.riverSelector("Middle Fork Salmon", e.target.checked)}>
        Middle Fork Salmon
      </Checkbox>
      <Checkbox onChange={(e) => props.riverSelector("Main Salmon", e.target.checked)}>
        Main Salmon
      </Checkbox>
    </Stack>
  )
}

// CALENDAR CLASS
// two structs:
//  riverRange is list of river name, start/end dates for table
//  temp struct for storing stuff intermediary??

class Calendar extends Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      endDate: null,
      tableData:[],
      riverSelection:{},
    }
    this.updateRiverSelection = this.updateRiverSelection.bind(this)
  }

  datePickerChange(dates){
    const [start, end] = dates;
    if (end != null){
      for (const [name, _] of Object.entries(this.state.riverSelection)) {
        this.setState({
          tableData: [...this.state.tableData, {
              start:start,
              end:end,
              name:name
          }]
        })
      }
    }
    this.setState({
      startDate:start,
      endDate:end,
    })
  }

  updateRiverSelection(riverName, isChecked){
    var riverSelectList = this.state.riverSelection;
    if (isChecked){
      riverSelectList[riverName] = riverName;
    } else {
      delete riverSelectList[riverName]
    }
    this.setState({
      riverSelection: riverSelectList,
    })
  }

  updateTable(){
    return(
      this.state.tableData.map((data, i) =>
        <TableEntry
           key={i}
           start={data.start}
           end={data.end}
           name={data.name}
        />
      )
    )
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
          <Box w="720px" overflow="auto" bg="white" p={2}>
            <RiverCheckboxes riverSelector={this.updateRiverSelection}/>
          </Box>
        <Spacer />
        </Flex>
        <Flex>
        <Spacer />
          <Box w="720px" overflow="auto">
            <Table variant="simple" colorScheme="nordscheme" bg="nord.7">
              <TableCaption>BONE figure this out</TableCaption>
              <Thead>
                <Tr>
                  <Th>Start Date</Th>
                  <Th>End Date</Th>
                  <Th>River</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {this.updateTable()}
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

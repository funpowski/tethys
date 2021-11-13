import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react"
import React, { Component } from 'react'


class RangeTable extends Component{
  render(){
    return(
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Start Date</Th>
            <Th>End Date</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>inches</Td>
            <Td>millimetres (mm)</Td>
          </Tr>
        </Tbody>
      </Table>
    )
  }
}
export default RangeTable

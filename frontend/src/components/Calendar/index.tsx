import { DateRange } from 'react-date-range';
import { Component } from 'react';

class Calendar extends Component {
  handleSelect(ranges){
    console.log(ranges);
    // {
    //   selection: {
    //     startDate: [native Date Object],
    //     endDate: [native Date Object],
    //   }
    // }
  }
  render(){
    const selectionRange = {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    }
    return (
      <DateRange
        ranges={[selectionRange]}
        onChange={this.handleSelect}
        months={3}
        direction="horizontal"
        scroll={{ enabled: true }}
      />
    )
  }
}

export default Calendar

import { MapContainer, TileLayer } from "react-leaflet";
import React, { Component } from 'react'

// good info on adding markers
// https://stackoverflow.com/questions/62182987/is-the-react-way-really-to-re-render-the-whole-react-leaflet-component-regular

class Map extends Component<any, any>{
  constructor(props) {
    super(props);
    this.state = {invalidate:false}
  }


  componentDidUpdate(prevProps) {
    if(this.props.invalidate !== prevProps.invalidate) // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
    {
      this.setState({invalidate:true})
      console.log(this)
    }
  }

  render(){
      return (
      <MapContainer
        key={this.state.invalidate}
        style={{ height: "50vh" }}
        center={[48.864716, 2.349]}
        zoom={13}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

      </MapContainer>
    )
  }
}

export default Map

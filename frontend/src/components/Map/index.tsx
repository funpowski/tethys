import { MapContainer, TileLayer } from "react-leaflet";
import React, { Component } from 'react'

// good info on adding markers
// https://stackoverflow.com/questions/62182987/is-the-react-way-really-to-re-render-the-whole-react-leaflet-component-regular
class PermitMap extends Component<any, any>{
  constructor(props) {
    super(props);
    this.state = {
      lon: 39.7671,
      lat: -105.0452,
      zoom:7
    }
    this.getUserLocation()
      .then(data => this.setState({
        lat:data.lon,
        lon:data.lat,
      })
    )
  }

  async getUserLocation(){
    // get user location by IP
    const locationAPIurl = "http://ip-api.com/json"
    const data = await fetch(locationAPIurl)
      .then(function(response) {
        return response.json();
      })
    return data
  }

  render(){
      return (
      <MapContainer
        style={{ height: "50%", width:"100%" }}
        center={[this.state.lon, this.state.lat]}
        zoom={this.state.zoom}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

      </MapContainer>
    )
  }
}

export default PermitMap

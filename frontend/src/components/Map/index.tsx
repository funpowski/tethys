import { MapContainer, TileLayer } from "react-leaflet";
import React, { Component } from 'react'
import { OpenStreetMapProvider } from 'leaflet-geosearch';


// good info on adding markers
// https://stackoverflow.com/questions/62182987/is-the-react-way-really-to-re-render-the-whole-react-leaflet-component-regular

class Map extends Component<any, any>{
  constructor(props) {
    super(props);
    this.state = {
      invalidate:false,  // use this to toggle map rerender on tab click
      lat:1,
      lon:2,
      city:null,
      regionName:null,
      zoom:8,
      provider: new OpenStreetMapProvider()
    }
  }

  async componentDidMount(){
    // get user location by IP
    const locationAPIurl = "http://ip-api.com/json"
    const data = await fetch(locationAPIurl)
      .then(function(response) {
        return response.json();
      });

    // then, update state
    this.setState({
      city:data.city,
      regionName: data.regionName
    })
  }

  async componentDidUpdate(prevProps) {
    if(this.props.invalidate !== prevProps.invalidate) // Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
    {
      // first, update based on user location by searching for location in OSM
      const query = `${this.state.city}, ${this.state.regionName}`;
      const results = await this.state.provider.search({ query: query });
      if(results.length > 0){
        const location = results[1];
        this.setState({
          lat:location.x,
          lon:location.y,
        })

      // then invalidate map
      this.setState({invalidate:true})
      }
    }
  }

  render(){
      return (
      <MapContainer
        key={this.state.invalidate}
        style={{ height: "50vh" }}
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

export default Map

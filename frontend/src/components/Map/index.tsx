import { MapContainer, TileLayer, GeoJSON, Tooltip } from "react-leaflet";
import React, { Component} from 'react'

// good info on adding markers
// https://stackoverflow.com/questions/62182987/is-the-react-way-really-to-re-render-the-whole-react-leaflet-component-regular
class PermitMap extends Component<any, any>{
  constructor(props) {
    super(props);
    this.state = {
      lon: 39.7671,
      lat: -105.0452,
      zoom:7,
      jsonFilesNames:['GC', 'desogray', 'middlefork', 'rogue'],
      jsonFiles:[],
      riverInfo:{
        'GC': {
          name: 'Grand Canyon',
          available: true,
          availability: ['4/1/22']
        },
        'desogray': {
          name: 'Desolation Gray',
          available: false,
          availability: []
        },
        'middlefork': {
          name: 'Middle Fork of the Salmon River',
          available: false,
          availability: []
        },
        'rogue': {
          name: 'Rogue River',
          available: true,
          availability: []
        },
      }

    }
    this.getUserLocation()
      .then(data => this.setState({
        lat:data.lon,
        lon:data.lat,
      })
    )
    this.state.jsonFilesNames.forEach((name) =>
      this.loadJson(name)
    )
  }

  async loadJson(name){
      // load data
      const fgdata = await fetch(`river_data/${name}.json`)
        .then(function(response) {
          return response.json();
        })

      // extracted data is feature group so we strip then add stuff
      const data = fgdata.features[0]
      Object.assign(data.properties, this.state.riverInfo[name])

      // append data to list
      var jsonFiles = this.state.jsonFiles
      jsonFiles.push(data);
      this.setState({
        jsonFiles: jsonFiles
      })
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

  onEachFeature(feature,layer) {
    layer.bindTooltip(feature.properties.label);
    const highlightWeight = 5;
    const nonHighlightWeight = 3;
    layer.on({
      mouseover: (e) => {
        e.target.setStyle({
          weight: highlightWeight,
        })
      },

      mouseout: (e) => {
        e.target.setStyle({
          weight: nonHighlightWeight,
        })

      },
      click: (e) => {
        console.log("fart")
      },
    });
  }

  getStyle(feature, layer){
    var color;
    switch(feature.properties.available){
      case true:
        color = '#00FF00';
        break;
      case false:
        color = '#FF0000';
        break;
    }
    return {
      weight: 3,
      opacity: 1,
      color: color,
    };
  }

  returnTooltip(json){
    switch (json.properties.available){
      case true:
        return(
          <Tooltip >
            Click for availability of {json.properties.name}
          </Tooltip>
        )
      case false:
        return(
          <Tooltip >
            No cancellation dates currently available for {json.properties.name}
          </Tooltip>
        )
    }
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
        {this.state.jsonFiles.map((json, i) =>
          <GeoJSON
            data={json}
            onEachFeature={this.onEachFeature.bind(this)}
            style={this.getStyle.bind(this)}
          >
            {this.returnTooltip(json)}
          </GeoJSON>
        )}
      </MapContainer>
    )
  }
}

export default PermitMap

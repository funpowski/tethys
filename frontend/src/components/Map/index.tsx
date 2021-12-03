import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
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
      const data = await fetch(`river_data/${name}.json`)
        .then(function(response) {
          return response.json()
        })
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

  highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        dashArray: '',
        fillOpacity: 0.7
    });
  }

  resetHighlight(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 3,
        dashArray: '',
        fillOpacity: 1
    });
  }

  onClick(e){
    console.log("fuck")
  }

  onEachFeature(feature,layer) {
    layer.bindTooltip(feature.properties.label);
    layer.on({
      mouseover: this.highlightFeature,
      mouseout: this.resetHighlight,
      click: this.onClick,
    });
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
          >
          </GeoJSON>
        )}
      </MapContainer>
    )
  }
}

export default PermitMap

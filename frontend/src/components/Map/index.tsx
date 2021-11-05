import { MapContainer, TileLayer } from "react-leaflet";

const Map = () => {

  return (
    <div className="map__container">
      <MapContainer
        style={{ width: "100%", height: "50vh" }}
        center={[48.864716, 2.349]}
        zoom={13}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

      console.log(this.map)
      </MapContainer>
    </div>
  );
};

export default Map

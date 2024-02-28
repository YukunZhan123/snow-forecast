import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix the default marker icon issue with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});



const ResortMap = ({ resorts, userLocation }) => {

  return (
    <MapContainer center={[userLocation.lat, userLocation.lng]} zoom={10} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {resorts.map((resort) => (
        <Marker
          key={resort._id}
          position={[resort.lat, resort.lon]}
        >
          <Popup>{resort.name}</Popup>
        </Marker>
      ))}
      <Marker position={[userLocation.lat, userLocation.lng]} >
        <Popup>You are here</Popup>
      </Marker>
    </MapContainer>
  );
};

export default ResortMap;

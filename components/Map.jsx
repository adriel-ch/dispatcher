'use client'

import React from 'react'
import "leaflet/dist/leaflet.css"
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import "leaflet/dist/leaflet.js"
import 'leaflet-defaulticon-compatibility'
import { MapContainer, Marker, TileLayer, Tooltip, Popup } from "react-leaflet"

const Map = (props) => {
  const { position, zoom } = props

  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={{height: '100vh'}}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[51.505, -0.09]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  )
}

export default Map
'use client'

import React from 'react'
import { useState, useMemo, useCallback } from 'react';
import "leaflet/dist/leaflet.css"
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import "leaflet/dist/leaflet.js"
import 'leaflet-defaulticon-compatibility'
import { MapContainer, Marker, TileLayer, Popup, useMap, useMapEvent, Rectangle } from "react-leaflet"
import { useEventHandlers } from '@react-leaflet/core';

const Map = ({ position, zoom }) => {

  return (
    <div className='flex-1 w-full'>
      <MapContainer center={[51.505, -0.09]} zoom={zoom} scrollWheelZoom={false} style={{height: '100vh'}}>
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
    </div>
  )
}

export default Map
'use client'

import React from 'react'
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import "leaflet/dist/leaflet.css"
import 'leaflet-defaulticon-compatibility'
// Re-uses images from ~leaflet package
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import "leaflet/dist/leaflet.js"
import { MapContainer, Marker, TileLayer, Popup, useMap, useMapEvent, Rectangle, Polyline, Tooltip, useMapEvents, FeatureGroup } from "react-leaflet"
import { useEventHandlers } from '@react-leaflet/core';
import { polyline, Icon } from 'leaflet';

function ChangeView({ center, zoom, coordinateList }) {
  const map = useMap();
  // map.flyTo(center, zoom);
  // create marker list based on
  console.log(coordinateList)
  // const polyline1 = polyline(coordinateList)
  if (coordinateList[0]) {
    map.fitBounds(polyline(coordinateList).getBounds())
  }
  return null;
}

const Map = ({ flightObject }) => {
  // build array of coords starting from departure, then list of route elements, finally arrival
  // const coordinateList = []
  // coordinateList.push([flightObject.departure.latitude, flightObject.departure.longitude])
  // flightObject.waypoints.forEach((element) => {
  //   coordinateList.push([element.position.lat, element.position.lon])
  // })
  // coordinateList.push([flightObject.arrival.latitude, flightObject.arrival.longitude])
  // const coordinateListFiltered = coordinateList.filter((element) => element[0] !== null)
  // console.log(coordinateList)
  // console.log(coordinateListFiltered)
  var greenIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [13, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    tooltipAnchor: [0, -30]
  });
  const [coordinateList, setCoordinateList] = useState([])
  // const [center, setCenter] = useState([0, 0])
  // const [zoom, setZoom] = useState(3)
  const features = useRef()
  useEffect(() => {
    const coords = []
    if (flightObject.departure.airport) {
      coords.push([flightObject.departure.latitude, flightObject.departure.longitude])
      flightObject.waypoints.forEach((element) => {
        coords.push([element.position.lat, element.position.lon])
      })
      coords.push([flightObject.arrival.latitude, flightObject.arrival.longitude])
      // setCenter([flightObject.departure.latitude, flightObject.departure.longitude])
      // setZoom(5)
    }
    const filtered = coords.filter((element) => element[0] !== null)
    // console.log(filtered)
    setCoordinateList(filtered)
  }, [flightObject])
  // console.log(center)
  
  return (
    <div className="flex-1 w-full">
      <MapContainer
        center={[0, 0]}
        zoom={3}
        scrollWheelZoom={false}
        style={{ height: "100vh" }}
      >
        <ChangeView
          // center={center}
          // zoom={zoom}
          coordinateList={coordinateList}
        />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker> */}
        <FeatureGroup ref={features}>
          {/* {coordinateList ? <Polyline positions={coordinateList} /> : <></>} */}
          <Polyline positions={coordinateList} />
          {coordinateList.map((element, index) => (
            <Marker key={index} position={element} icon={greenIcon}>
              <Tooltip direction="top" /*offset={[-15, -5]}*/>
                Index: {index} <br />
                Latitude: {element[0]}
                <br />
                Longitude: {element[1]}
              </Tooltip>
            </Marker>
          ))}
        </FeatureGroup>
      </MapContainer>
    </div>
  );
};

export default Map
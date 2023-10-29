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
import { polyline, Icon, latLng, Path, tileLayer, marker } from 'leaflet';
import { GeodesicLine } from 'leaflet.geodesic';

// class ReactGeodesicLine extends Path {
//   createLeafletElement(props) {
//     const { positions, options } = props
//     return new GeodesicLine(positions, options)
//   }

//   updateLeafletElement(fromProps, toProps) {
//     if (toProps.positions !== fromProps.positions) {
//       this.leafletElement.setLatLngs(toProps.positions)
//     }
//     this.setStyleIfChanged(fromProps, toProps)
//   }
// }

function ChangeView({ center, zoom, coordinateList, flightObject }) {
  const map = useMap();
  // Remove all layers except tileLayer
  map.eachLayer((layer) => {
    if (layer.options.attribution) {
      return
    } else {
      layer.remove()
    }
  }) // layer.remove()
  // tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map)
  const line = new GeodesicLine(coordinateList, {wrap: false, steps: 5}).addTo(map)
  // map.flyTo(center, zoom);
  // create marker list based on
  // console.log('coord list', coordinateList[0].lat)
  // color gold #C48A17
  const departIcon = new Icon({
    iconUrl: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512"><path d="M381 114.9L186.1 41.8c-16.7-6.2-35.2-5.3-51.1 2.7L89.1 67.4C78 73 77.2 88.5 87.6 95.2l146.9 94.5L136 240 77.8 214.1c-8.7-3.9-18.8-3.7-27.3 .6L18.3 230.8c-9.3 4.7-11.8 16.8-5 24.7l73.1 85.3c6.1 7.1 15 11.2 24.3 11.2H248.4c5 0 9.9-1.2 14.3-3.4L535.6 212.2c46.5-23.3 82.5-63.3 100.8-112C645.9 75 627.2 48 600.2 48H542.8c-20.2 0-40.2 4.8-58.2 14L381 114.9zM0 480c0 17.7 14.3 32 32 32H608c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32z" fill="%23C48A17" stroke="%23285192" stroke-width="20"/></svg>`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [35, 51],
    iconAnchor: [18, 46],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    shadowAnchor: [13, 41],
    tooltipAnchor: [0, -32]
  })
  const arriveIcon = new Icon({
    iconUrl: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512"><path d="M.3 166.9L0 68C0 57.7 9.5 50.1 19.5 52.3l35.6 7.9c10.6 2.3 19.2 9.9 23 20L96 128l127.3 37.6L181.8 20.4C178.9 10.2 186.6 0 197.2 0h40.1c11.6 0 22.2 6.2 27.9 16.3l109 193.8 107.2 31.7c15.9 4.7 30.8 12.5 43.7 22.8l34.4 27.6c24 19.2 18.1 57.3-10.7 68.2c-41.2 15.6-86.2 18.1-128.8 7L121.7 289.8c-11.1-2.9-21.2-8.7-29.3-16.9L9.5 189.4c-5.9-6-9.3-14-9.3-22.5zM32 448H608c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32zm96-80a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm128-16a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" fill="%23C48A17" stroke="%23285192" stroke-width="20"/></svg>`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [35, 51],
    iconAnchor: [18, 46],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    shadowAnchor: [13, 41],
    tooltipAnchor: [0, -35]
  })
  if (coordinateList[0]) {
    map.fitBounds(line.getBounds())

    const depart = marker(coordinateList[0], {icon: departIcon}).addTo(map)
    depart.bindTooltip(`Departure: ${flightObject.departure.airport}`, {direction: "top", permanent: true})

    const arrival = marker(coordinateList[coordinateList.length - 1], {icon: arriveIcon}).addTo(map)
    arrival.bindTooltip(`Arrival: ${flightObject.arrival.airport}`, {direction: "top", permanent: true})

    const depart2 = marker([coordinateList[0].lat, coordinateList[0].lng + 360], {icon: departIcon}).addTo(map)
    depart2.bindTooltip(`Departure: ${flightObject.departure.airport}`, {direction: "top", permanent: true})

    const arrival2 = marker([coordinateList[coordinateList.length - 1].lat, coordinateList[coordinateList.length - 1].lng + 360], {icon: arriveIcon}).addTo(map)
    arrival2.bindTooltip(`Arrival: ${flightObject.arrival.airport}`, {direction: "top", permanent: true})
    // console.log('coord list', coordinateList[coordinateList.length - 1].lat + 360)
    // line.setLatLngs(coordinateList)
  }
  // const coordinateListLatLon = coordinateList.map((element) => (latLng(element[0], element[1])))
  // console.log(coordinateListLatLon)
  return null;
}

// const Geoline = (coordinateList) => {
//   const map = useMap()
//   line = new GeodesicLine(coordinateList, {wrap: false}).addTo(map)
//   return (<line></line>)
// }

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
  // var greenIcon = new Icon({
  //   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  //   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  //   iconSize: [25, 41],
  //   iconAnchor: [13, 41],
  //   popupAnchor: [1, -34],
  //   shadowSize: [41, 41],
  //   tooltipAnchor: [0, -30]
  // });
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
    const coordinateListLatLon = filtered.map((element) => (latLng(element[0], element[1])))
    // console.log(filtered)
    setCoordinateList(coordinateListLatLon)
  }, [flightObject])
  // console.log(center)
  
  return (
    <div className="flex-1 w-full">
      <MapContainer
        center={[1.36, 103.99]}
        zoom={3}
        scrollWheelZoom={false}
        style={{ height: "100vh" }}
      >
        {/* <ChangeView
          // center={center}
          // zoom={zoom}
          coordinateList={coordinateList}
        /> */}
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
          <ChangeView
            // center={center}
            // zoom={zoom}
            coordinateList={coordinateList}
            flightObject={flightObject}
          />
          {/* {coordinateList ? <Polyline positions={coordinateList} /> : <></>} */}
          {/* <Polyline positions={coordinateList} /> */}
          {/* {coordinateList ? (e) => new GeodesicLine(coordinateList).addTo(useMap()) : ([])} */}
          {/* {coordinateList.map((element, index) => (
            <Marker key={index} position={element} icon={greenIcon}>
              <Tooltip direction="top" offset={[-15, -5]}>
                Index: {index} <br />
                Latitude: {element[0]}
                <br />
                Longitude: {element[1]}
              </Tooltip>
            </Marker>
          ))} */}
        </FeatureGroup>
      </MapContainer>
    </div>
  );
};

export default Map
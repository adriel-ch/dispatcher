"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import dynamic from "next/dynamic";

// import flightobject from "@/displayAll-schema.json"; // test json

const Map = dynamic(() => import("@/components/Map"), {
  loading: () => <div className="p-2 m-2 text-xl">A map is loading...</div>,
  ssr: false,
});

export default function Home() {
  const [flightPlanList, setFlightPlanList] = useState([]); // state of flight objects
  const [flightRouteObject, setFlightRouteObject] = useState({
    id: "", // flightplan id
    flightNumber: "", // flight number
    departure: { airport: "", latitude: 0, longitude: 0 }, // departure airport
    arrival: { airport: "", latitude: 0, longitude: 0 }, // arrival airport
    waypoints: [
      {
        seqNum: 0,
        position: {
          lat: 0,
          lon: 0,
          designatedPoint: "",
          bearing: "",
          distance: "",
        },
        airway: "",
        airwayType: "",
        changeSpeed: "",
        changeLevel: "",
        changeOfFlightRule: "",
      },
    ],
    // airwayRoute: [
    //   {
    //     airwayName: "",
    //     // Must be ordered from entry to exit
    //     airwayPoints: [
    //       {
    //         designatedPoint: "",
    //         lat: 0,
    //         lon: 0,
    //       },
    //     ],
    //   },
    // ],
  });

  const handleSearch = async (searchTerm) => {
    if (searchTerm) {
      // Remove spaces and covert to upper case
      const flightName = searchTerm.replace(/ /g, "").toUpperCase();
      // console.log(flightName);
      const response = await fetch(`/api/displayAll`);
      const responseJson = await response.json(); // returns an obj
      const filteredSearchResults = []
      for (const element of responseJson.data) {
        // console.log(element.aircraftIdentification.includes(flightName))
        if (element.aircraftIdentification.includes(flightName)) {
          // console.log(element)
          filteredSearchResults.push(element)
        }
      }
      // Sort flights lexicographically
      filteredSearchResults.sort((a, b) => {
        const flightA = a.aircraftIdentification
        const flightB = b.aircraftIdentification
        if (flightA < flightB) return -1
        if (flightA > flightB) return 1
        return 0
      })
      // console.log(filteredSearchResults)
      setFlightPlanList(filteredSearchResults)
    }
  };
  
  const listAllFlights = async () => {
    console.log("Clicked List All");
    // https://app.swaggerhub.com/apis-docs/CAASFSDATMSE/flight-object-manager/1.0.0#/
    // Fetch data from /displayAll
    const response = await fetch(`/api/displayAll`);
    const responseJson = await response.json(); // returns an obj
    // console.log(responseJson)
    // setFlightPlanList(flightobject); // for testing
    setFlightPlanList(responseJson.data);
  };

  const handleClickRoute = async (obj) => {
    // https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop
    const regexLatLon = /\(([^,]+),([^)]+)\)/;
    const regexPoint = /[a-zA-Z0-9]+/;
    // const regexAirways = /([a-zA-Z0-9]+)/;
    // const regexFixesFromAirways = /\[(.*?)\]/;

    // Returns a single object with latitude and longitude values or null if no match
    const processResponseJSON = (
      point,
      responseJSON,
      regexPoint,
      regexLatLon,
      // obj,
      // index,
      prevLatLon
    ) => {
      if (responseJSON.data.length > 1) {
        // if more than 1 set of values returned from api call -> find closest matching coords
        const pointExactMatch = [];
        // for loop to build array of latlon objects that match the nav value
        for (const nav of responseJSON.data) {
          // console.log(nav);
          const matchPoint = regexPoint.exec(nav); // exec returns an array if found
          // if nav === point, extract latlon and push into pointsExactMatch array
          if (matchPoint[0] === point) {
            const match = regexLatLon.exec(nav); // extract numbers
            if (match) {
              const objectLatLon = {
                latitude: match.slice(1)[0],
                longitude: match.slice(1)[1],
              };
              pointExactMatch.push(objectLatLon); // push to build po
            } else {
              console.log("No match found");
            }
          }
        }
        // console.log(pointExactMatch);
        if (pointExactMatch.length == 0) return null;
        // potential corner case here, waypoints array of length 0, meaning no values yet
        // const prevLatLon = {
        //   latitude: obj.waypoints[index - 1].position.lat,
        //   longitude: obj.waypoints[index - 1].position.lon,
        // };
        console.log("prev value", prevLatLon);
        // Haversine function to find great circle (geodesic) distance between two coords
        // https://stackoverflow.com/questions/63013252/in-array-of-coordinates-find-the-point-closest-to-the-given?noredirect=1&lq=1
        const haversine = (
            { longitude: lonA, latitude: latA },
            { longitude: lonB, latitude: latB }
          ) => {
            const { PI, sin, cos, atan2 } = Math,
              r = PI / 180,
              R = 6371,
              deltaLat = (latB - latA) * r,
              deltaLon = (lonB - lonA) * r,
              // c is real if and only if 0 <= a <= 1, else c = NaN
              // https://en.wikipedia.org/wiki/Haversine_formula
              a =
                sin(deltaLat / 2) ** 2 +
                cos(cos(latB * r) * latA * r) * sin(deltaLon / 2) ** 2,
              c = 2 * atan2(a ** 0.5, (1 - a) ** 0.5),
              d = R * c;
            return d;
          },
          //handle prevlatlon value == null
          { closest } = pointExactMatch.reduce(
            (r, o, index, array) => {
              const distance = haversine(o, prevLatLon);
              console.log("distance", distance);
              console.log("min dist", r.minDistance);
              // distance < r.minDistance || (!r.closest && ((r.closest = o), (r.minDistance = distance)));
              if (distance) {
                if (distance < r.minDistance) {
                  // Update the closest and minimum distance properties to the current point.
                  r.closest = o;
                  r.minDistance = distance;
                } else if (!r.closest) {
                  // If the closest property is null, update it to the current point.
                  r.closest = o;
                  r.minDistance = distance;
                }
                return r;
              } else if (distance === 0) {
                r.closest = o;
                r.minDistance = distance;
                return r;
              } else {
                // skip current coords if distance is NaN
                // r.closest = {
                //   latitude: array[index + 1] ? (array[index + 1].latitude) : (null),
                //   longitude: array[index + 1] ? (array[index + 1].longitude) : (null),
                // }
                // r.minDistance = null;
                console.log(r, "skipping current iteration due to dist == NaN");
                return r;
              }
            },
            { closest: null, minDistance: null }
          );
        // console.log(closest);
        return closest;
      } else {
        // extract coords since array size = 1 indicates 1 exact match
        const match = regexLatLon.exec(responseJSON.data);
        if (match) {
          // Extract the two numbers
          const targetLatLon = match.slice(1);
          console.log(targetLatLon);
          const closest = {
            latitude: targetLatLon[0],
            longitude: targetLatLon[1],
          };
          return closest;
        } else {
          console.log("No match found");
        }
      }
    };

    if (obj.arrival) {
      // get arrival airport coords
      const responseAirports = await fetch(
        `/api/geopoints/search/airports/${obj.arrival.airport}`
      );
      const responseAirportsJson = await responseAirports.json(); // returns an obj
      const match = regexLatLon.exec(responseAirportsJson.data);
      if (match) {
        // Extract the two numbers
        const targetLatLon = match.slice(1);
        console.log("Arrival airport:", obj.arrival.airport, targetLatLon);
        obj.arrival.latitude = targetLatLon[0];
        obj.arrival.longitude = targetLatLon[1];
      } else {
        console.log("No match found");
      }
    }

    if (obj.departure) {
      // get arrival airport coords
      const responseAirports = await fetch(
        `/api/geopoints/search/airports/${obj.departure.airport}`
      );
      const responseAirportsJson = await responseAirports.json(); // returns an obj
      const match = regexLatLon.exec(responseAirportsJson.data);
      if (match) {
        // Extract the two numbers
        const targetLatLon = match.slice(1);
        console.log("Departure airport:", obj.departure.airport, targetLatLon);
        obj.departure.latitude = targetLatLon[0];
        obj.departure.longitude = targetLatLon[1];
      } else {
        console.log("No match found");
      }
    }
    // if empty waypoints array -> no route data
    for (const [index, element] of obj.waypoints.entries()) {
      // https://app.swaggerhub.com/apis-docs/CAASFSDATMSE/aeronautical-data-service/1.0.0/
      // fetch data from geopoints/search/{type}/{term}
      // type: airports, airways, fixes, navaids, runways
      // term: search term

      // Init position.lat and position.lon
      if (element.position) {
        obj.waypoints[index].position.lat = null;
        obj.waypoints[index].position.lon = null;
      } else {
        obj.waypoints[index].position = { lat: null, lon: null };
      }

      // Build coords for airways 
      // let fixesFromAirwaysArray = []
      // const responseAirways = await fetch(
      //   `/api/geopoints/search/airways/${element.airway}`
      // );
      // const responseAirwaysJson = await responseAirways.json(); // returns an obj
      // if (responseAirwaysJson.data.length > 1) {
      //   const pointExactMatch = [];
      //   // for loop to build array of latlon objects that match the nav value
      //   for (const nav of responseAirwaysJson.data) {
      //     // console.log(nav);
      //     const matchPoint = regexAirways.exec(nav); // exec returns an array if found
      //     // if nav === point, extract latlon and push into pointsExactMatch array
      //     if (matchPoint[0] === element.airway) {
      //       pointExactMatch.push(nav);
      //     }
      //   }
      //   // more logic to handle the case of more than 1 exact match below
      // } else if (responseAirwaysJson.data.length === 1) {
      //   // array size = 1 indicates 1 exact match
      //   // extract [fix1,fix2,fix3,...] portion and array it
      //   const fixesFromAirways = regexFixesFromAirways.exec(
      //     responseAirwaysJson.data[0]
      //   );
      //   console.log(responseAirwaysJson.data)
      //   fixesFromAirwaysArray = fixesFromAirways[1].split(",");
      // } else {
      //   console.log("No data returned from airways API for airway: ", element.airway)
      // }
      // // console.log(fixesFromAirwaysArray)
      // console.log("--- Start ---\n", index, element.airway);
      // obj.airwayRoute[index] = { airwayName: '', airwayPoints: []}
      // // only fixes or also include navaids inside?
      // for (const [index2, fix] of fixesFromAirwaysArray.entries()) {
      //   // checck navaids and fixes api for match
      //   // Build obj.waypoints here using loop
      //   console.log('Start airway fixes list', index2, fix);
      //   console.log(obj.airwayRoute)
      //   obj.airwayRoute[index].airwayName = element.airway
      //   obj.airwayRoute[index].airwayPoints[index2] = {
      //     // Must be ordered from entry to exit
      //     designatedPoint: fix,
      //     lat: null,
      //     lon: null,
      //   };
      //   // console.log(index, obj.airwayRoute);

      //   const point = fix;
      //   console.log("Current point in airway fixes list:", point);
      //   // console.log(obj.airwayRoute)
      //   const prevLatLon = {
      //     latitude: index2 > 1 ? (obj.airwayRoute[index].airwayPoints[index2 - 1].lat) : (null),
      //     longitude: index2 > 1 ? (obj.airwayRoute[index].airwayPoints[index2 - 1].lon) : (null),
      //   }
      //   const responseNavaids = await fetch(
      //     `/api/geopoints/search/navaids/${point}`
      //   );
      //   const responseNavaidsJson = await responseNavaids.json(); // returns an obj
      //   const responseFixes = await fetch(
      //     `/api/geopoints/search/fixes/${point}`
      //   );
      //   const responseFixesJson = await responseFixes.json(); // returns an obj
      //   if (
      //     responseNavaidsJson.data.length === 0 &&
      //     responseFixesJson.data.length === 0
      //   ) {
      //     // No data returned from both Navaids or Fixes APIs
      //     console.log("No coordinate data found for either Navaids or Fixes.");
      //     obj.airwayRoute[index].airwayPoints[index2].lat = null;
      //     obj.airwayRoute[index].airwayPoints[index2].lon = null;
      //   } else if (
      //     responseNavaidsJson.data.length > 0 &&
      //     responseFixesJson.data.length === 0
      //   ) {
      //     // Data returned from Navaids API
      //     console.log("Data found in Navaids API.");
      //     const navaidArray = processResponseJSON(
      //       point,
      //       responseNavaidsJson,
      //       regexPoint,
      //       regexLatLon,
      //       // obj,
      //       // index,
      //       prevLatLon
      //     );
      //     obj.airwayRoute[index].airwayPoints[index2].lat = navaidArray.latitude;
      //     obj.airwayRoute[index].airwayPoints[index2].lon = navaidArray.longitude;
      //   } else if (
      //     responseNavaidsJson.data.length === 0 &&
      //     responseFixesJson.data.length > 0
      //   ) {
      //     // Data returned from Fixes API
      //     console.log("Data found in Fixes API.");
      //     const fixesArray = processResponseJSON(
      //       point,
      //       responseFixesJson,
      //       regexPoint,
      //       regexLatLon,
      //       // obj,
      //       // index,
      //       prevLatLon
      //     );
      //     console.log(index2, obj.airwayRoute[index].airwayPoints[index2])
      //     obj.airwayRoute[index].airwayPoints[index2].lat = fixesArray.latitude;
      //     obj.airwayRoute[index].airwayPoints[index2].lon = fixesArray.longitude;
      //   } else if (
      //     responseNavaidsJson.data.length > 0 &&
      //     responseFixesJson.data.length > 0
      //   ) {
      //     // Data returned from both Navaids and Fixes APIs
      //     // search both arrays for exact match, typically will be in navaid array
      //     // if array has more than 1 exact match, go thru array to find closest match to previous position value
      //     console.log("Data found in both Navaid and Fixes.");
      //     console.log("Navaid array:", responseNavaidsJson.data);
      //     console.log("Fixes array:", responseFixesJson.data);
      //     const navaidArray = processResponseJSON(
      //       point,
      //       responseNavaidsJson,
      //       regexPoint,
      //       regexLatLon,
      //       // obj,
      //       // index,
      //       prevLatLon
      //     );
      //     const fixesArray = processResponseJSON(
      //       point,
      //       responseFixesJson,
      //       regexPoint,
      //       regexLatLon,
      //       // obj,
      //       // index,
      //       prevLatLon
      //     );
      //     // console.log("navaid array", navaidArray);
      //     // console.log("fixes array", fixesArray);
      //     if (navaidArray) {
      //       obj.airwayRoute[index].airwayPoints[index2].lat = navaidArray.latitude;
      //       obj.airwayRoute[index].airwayPoints[index2].lon = navaidArray.longitude;
      //     } else if (fixesArray) {
      //       obj.airwayRoute[index].airwayPoints[index2].lat = fixesArray.latitude;
      //       obj.airwayRoute[index].airwayPoints[index2].lon = fixesArray.longitude;
      //     }
      //   }
      //   console.log('End ---')
      // }

      console.log("Start ---\n", index, element);
      if (element.position) {
        const point = element.position.designatedPoint;
        console.log("Current point:", point);
        // set prevlatlon value to whatever the previous element latlon is
        // if null, go back some more until not null, else use departure airport
        let prevLatLon = {}
        for (let i = index; i > 0; i--) {
          let a = 1
          if (obj.waypoints[i - a].position.lat) {
            prevLatLon = {
              latitude: i >= 1 ? (obj.waypoints[i - a].position.lat) : (obj.departure.latitude),
              longitude: i >= 1 ? (obj.waypoints[i - a].position.lon) : (obj.departure.longitude),
            }
            break
          } else {
            a++
          }
        }
        // const prevLatLon = {
        //   latitude: index >= 1 ? (obj.waypoints[index - 1].position.lat) : (null),
        //   longitude: index >= 1 ? (obj.waypoints[index - 1].position.lon) : (null),
        // }
        const responseNavaids = await fetch(
          `/api/geopoints/search/navaids/${point}`
        );
        const responseNavaidsJson = await responseNavaids.json(); // returns an obj
        const responseFixes = await fetch(
          `/api/geopoints/search/fixes/${point}`
        );
        const responseFixesJson = await responseFixes.json(); // returns an obj
        // const regexLatLon = /\(([^,]+),([^)]+)\)/;
        // const regexPoint = /[a-zA-Z0-9]+/;
        if (
          responseNavaidsJson.data.length === 0 &&
          responseFixesJson.data.length === 0
        ) {
          // No data returned from both Navaids or Fixes APIs
          console.log("No coordinate data found for either Navaids or Fixes.");
          element.position.lat = null;
          element.position.lon = null;
        } else if (
          responseNavaidsJson.data.length > 0 &&
          responseFixesJson.data.length === 0
        ) {
          // Data returned from Navaids API
          
          console.log("Data found in Navaids API.");
          console.log("Navaid array:", responseNavaidsJson.data);
          const navaidArray = processResponseJSON(
            point,
            responseNavaidsJson,
            regexPoint,
            regexLatLon,
            // obj,
            // index,
            prevLatLon
          );
          element.position.lat = navaidArray.latitude;
          element.position.lon = navaidArray.longitude;
        } else if (
          responseNavaidsJson.data.length === 0 &&
          responseFixesJson.data.length > 0
        ) {
          // Data returned from Fixes API
          console.log("Data found in Fixes API.");
          console.log("Fixes array:", responseFixesJson.data);
          const fixesArray = processResponseJSON(
            point,
            responseFixesJson,
            regexPoint,
            regexLatLon,
            // obj,
            // index,
            prevLatLon
          );
          element.position.lat = fixesArray.latitude;
          element.position.lon = fixesArray.longitude;
        } else if (
          responseNavaidsJson.data.length > 0 &&
          responseFixesJson.data.length > 0
        ) {
          // Data returned from both Navaids and Fixes APIs
          // search both arrays for exact match, typically will be in navaid array
          // if array has more than 1 exact match, go thru array to find closest match to previous position value
          console.log("Data found in both Navaid and Fixes.");
          console.log("Navaid array:", responseNavaidsJson.data);
          console.log("Fixes array:", responseFixesJson.data);
          const navaidArray = processResponseJSON(
            point,
            responseNavaidsJson,
            regexPoint,
            regexLatLon,
            // obj,
            // index,
            prevLatLon
          );
          const fixesArray = processResponseJSON(
            point,
            responseFixesJson,
            regexPoint,
            regexLatLon,
            // obj,
            // index,
            prevLatLon
          );
          // console.log("navaid array", navaidArray);
          // console.log("fixes array", fixesArray);
          if (navaidArray) {
            element.position.lat = navaidArray.latitude;
            element.position.lon = navaidArray.longitude;
          } else if (fixesArray) {
            element.position.lat = fixesArray.latitude;
            element.position.lon = fixesArray.longitude;
          }
        }
      } else {
        // Handle missing position object
        // element.position = {
        //   designatedPoint: "",
        //   lat: null,
        //   lon: null,
        // };
      }
      console.log("--- End ---");
    }
    setFlightRouteObject(obj);
    console.log(obj);
  };
  return (
    <section className="flex">
      <Sidebar
        handleListAllFlights={listAllFlights}
        flightPlanList={flightPlanList} // is a state
        handleClickRoute={handleClickRoute}
        handleSearch={handleSearch}
      />
      <Map flightObject={flightRouteObject} />
    </section>
  );
}

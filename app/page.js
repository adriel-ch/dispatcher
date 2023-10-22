"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import dynamic from "next/dynamic";

import flightobject from "@/displayAll-schema.json"; // test json

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
    ], // waypoint array
  });

  const listAllFlights = async () => {
    console.log("Clicked List All");
    // https://app.swaggerhub.com/apis-docs/CAASFSDATMSE/flight-object-manager/1.0.0#/
    // Fetch data from /displayAll
    // const response = await fetch(`/api/displayAll`);
    // setFlightPlanList(await fetch(`/api/displayAll`));

    setFlightPlanList(flightobject); // for testing
  };

  const handleClickRoute = async (obj) => {
    // https://stackoverflow.com/questions/37576685/using-async-await-with-a-foreach-loop

    // Returns a single object with latitude and longitude values or null if no match
    const processResponseJSON = (
      point,
      responseJSON,
      regexPoint,
      regexLatLon,
      obj,
      index
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
        console.log(pointExactMatch);
        if (pointExactMatch.length == 0) return null;
        // potential corner case here, waypoints array of length 0, meaning no values yet
        const prevLatLon = {
          latitude: obj.waypoints[index - 1].position.lat,
          longitude: obj.waypoints[index - 1].position.lon,
        };
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
          { closest } = pointExactMatch.reduce(
            (r, o, index, array) => {
              const distance = haversine(o, prevLatLon);
              // console.log("distance", distance);
              // console.log("min dist", r.minDistance);
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
                r.closest = array[index + 1];
                r.minDistance = null;
                console.log(r, "skipping current iteration due to dist == NaN");
                return r;
              }
            },
            { closest: null, minDistance: null }
          );
        console.log(closest);
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

    // if empty waypoints array -> no route data
    for (const [index, element] of obj.waypoints.entries()) {
      // https://app.swaggerhub.com/apis-docs/CAASFSDATMSE/aeronautical-data-service/1.0.0/
      // fetch data from geopoints/search/{type}/{term}
      // type: airports, airways, fixes, navaids, runways
      // term: search term
      console.log("Start ---\n", index, element);
      if (element.position) {
        const point = element.position.designatedPoint;
        console.log("Current point:", point);
        const responseNavaids = await fetch(
          `/api/geopoints/search/navaids/${point}`
        );
        const responseNavaidsJson = await responseNavaids.json(); // returns an obj
        const responseFixes = await fetch(
          `/api/geopoints/search/fixes/${point}`
        );
        const responseFixesJson = await responseFixes.json(); // returns an obj
        const regexLatLon = /\(([^,]+),([^)]+)\)/;
        const regexPoint = /[a-zA-Z0-9]+/;
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
          const navaidArray = processResponseJSON(
            point,
            responseNavaidsJson,
            regexPoint,
            regexLatLon,
            obj,
            index
          );
          element.position.lat = navaidArray.latitude;
          element.position.lon = navaidArray.longitude;
        } else if (
          responseNavaidsJson.data.length === 0 &&
          responseFixesJson.data.length > 0
        ) {
          // Data returned from Fixes API
          console.log("Data found in Fixes API.");
          const fixesArray = processResponseJSON(
            point,
            responseFixesJson,
            regexPoint,
            regexLatLon,
            obj,
            index
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
            obj,
            index
          );
          const fixesArray = processResponseJSON(
            point,
            responseFixesJson,
            regexPoint,
            regexLatLon,
            obj,
            index
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
        element.position = {
          designatedPoint: "",
          lat: null,
          lon: null,
        };
      }
      console.log("End ---");
    }
    setFlightRouteObject(obj);
    console.log(obj);
  };
  return (
    <section className="flex">
      <Sidebar
        handleListAllFlights={listAllFlights}
        flightPlanList={flightPlanList}
        handleClickRoute={handleClickRoute}
      />
      <Map flightObject={flightRouteObject} />
    </section>
  );
}

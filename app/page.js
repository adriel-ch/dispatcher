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
  const listAllFlights = () => {
    console.log("Clicked List All");
    // fetch data from GET endpoint
    // const response = await fetch(`/api/displayAll`); // already jsonified
    // setFlightPlanList(await fetch(`/api/displayAll`));
    // set flight list state
    setFlightPlanList(flightobject); // for testing
  };
  const handleClickRoute = (id, aircraftIdentification, departure, arrival, waypoints) => {
    console.log(aircraftIdentification, departure, arrival)
  };
  return (
    <section className="flex">
      <Sidebar
        handleListAllFlights={listAllFlights}
        flightPlanList={flightPlanList}
        handleClickRoute={handleClickRoute}
      />
      <Map zoom={10} />
    </section>
  );
}

// import { useMemo } from 'react'
// import dynamic from 'next/dynamic'

// insert into fn
// const Map = useMemo(() => dynamic(
//   () => import('@/components/Maps'),
//   {
//     loading: () => <p>A map is loading</p>,
//     ssr: false
//   }
// ), [])

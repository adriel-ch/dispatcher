"use client";

import React from "react";
import dynamic from "next/dynamic";

import { roboto_mono } from "@/app/fonts";

const Search = dynamic(() => import("@/components/TWE-components/Search"), {
  loading: () => <div className="p-2 m-2 text-xl text-black">loading...</div>,
  ssr: false,
});

// const FlightButton = ({ flightObject }) => {
//   return (
//     <div className="w-full text-black overflow-auto">
//       <button
//         type="button"
//         onClick={(e) => {
//           console.log(e.currentTarget.className)
//           e.currentTarget.className = 'block w-full cursor-pointer rounded-lg p-4 text-left bg-primary-100 text-primary-600'
//         }}
//         className="block w-full cursor-pointer rounded-lg p-4 text-left transition duration-500 hover:bg-neutral-100 hover:text-neutral-500 focus:bg-neutral-100 focus:text-neutral-500 focus:ring-0 dark:hover:bg-neutral-600 dark:hover:text-neutral-200 dark:focus:bg-neutral-600 dark:focus:text-neutral-200"
//       >
//         {flightObject.aircraftIdentification}
//       </button>
//     </div>
//   );
// };

// const BuildFlightList = ({ flightListArray, handleClick }) => {
//   // takes input list/array and builds a button list for users to select flight number
//   //     element.aircraftIdentification, // flight number
//   //     element.departure.departureAerodrome, // departure airport
//   //     element.arrival.destinationAerodrome, // arrival airport
//   //     element.filedRoute.routeElement // waypoint array
//   return (
//     <div>
//       {flightListArray.map((element) => (
//         <FlightButton key={element._id} flightObject={element} />
//       ))}
//     </div>
//   );
// };

// const BuildFlightList = ({ flightListArray }) => {
//   // takes input list/array and builds a button list for users to select flight number
//   //     element.aircraftIdentification, // flight number
//   //     element.departure.departureAerodrome, // departure airport
//   //     element.arrival.destinationAerodrome, // arrival airport
//   //     element.filedRoute.routeElement // waypoint array
//   const handleChange = (event) => {
//     console.log('123')
//   }
//   return (
//     <div className="w-full text-black overflow-auto py-2.5">
//       {flightListArray.map((element) => (
//         <div
//           key={element._id}
//           className="mb-[0.125rem] block min-h-[1.5rem] pl-[2.5rem] py-1"
//         >
//           <input
//             className="relative float-left -ml-[1.5rem] mr-1 mt-0.5 h-5 w-5 appearance-none rounded-full border-2 border-solid border-neutral-300 before:pointer-events-none before:absolute before:h-4 before:w-4 before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] after:absolute after:z-[1] after:block after:h-4 after:w-4 after:rounded-full after:content-[''] checked:border-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-[0.625rem] checked:after:w-[0.625rem] checked:after:rounded-full checked:after:border-primary checked:after:bg-primary checked:after:content-[''] checked:after:[transform:translate(-50%,-50%)] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:border-primary checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:border-neutral-600 dark:checked:border-primary dark:checked:after:border-primary dark:checked:after:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:border-primary dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
//             type="radio"
//             name="flexRadioDefault"
//             id={element._id}
//             onChange={handleChange()}
//           />
//           <label
//             className="mt-px inline-block pl-[0.75rem] hover:cursor-pointer w-full"
//             htmlFor={element._id}
//           >
//             {element.aircraftIdentification}
//           </label>
//         </div>
//       ))}
//     </div>
//   );
// };

const BuildFlightList = ({ flightListArray, handleClickRoute }) => {
  // takes input list/array and builds a button list for users to select flight number
  const makeDate = (unixTimeStamp) => {
    // console.log(unixTimeStamp)
    const unixTimeStampMili = unixTimeStamp * 1000
    const dateOfFlight = new Date(unixTimeStampMili).toISOString().slice(2,-8).replace("T", " ")
    // console.log(dateOfFlight)
    return dateOfFlight
  }
  const splitFlightNumber = (flightNumber) => {
    const airline = flightNumber.slice(0,3)
    const airlineNumber = flightNumber.slice(3)
    const newFlightNumber = airline + "-" + airlineNumber
    return newFlightNumber
  }
  return (
    <div className="w-full text-black overflow-auto">
      {flightListArray.map((element) => (
        <div key={element._id}>
          <button
            type="button"
            // key={element._id}
            id={element._id}
            onClick={(e) => {
              handleClickRoute({
                id: element._id, // flightplan id
                flightNumber: element.aircraftIdentification, // flight number
                departure: {
                  airport: element.departure.departureAerodrome,
                  latitude: 0,
                  longitude: 0,
                }, // departure airport
                arrival: {
                  airport: element.arrival.destinationAerodrome,
                  latitude: 0,
                  longitude: 0,
                }, // arrival airport
                waypoints: element.filedRoute
                  ? element.filedRoute.routeElement
                  : [], // waypoint array
                // airwayRoute: [{ airwayName: "", airwayPoints: [] }],
              });
              flightListArray.forEach((element) => {
                document.getElementById(element._id).className = "";
                document.getElementById(element._id).className =
                  "flex justify-between w-full cursor-pointer rounded-lg px-4 py-2 text-left transition duration-500 hover:bg-neutral-100 hover:text-neutral-500 focus:bg-neutral-100 focus:text-neutral-500 focus:ring-0 dark:hover:bg-neutral-600 dark:hover:text-neutral-200 dark:focus:bg-neutral-600 dark:focus:text-neutral-200";
                document.getElementById(element._id + "_icon").hidden = true;
              });
              e.currentTarget.className =
                "flex justify-between w-full cursor-pointer rounded-lg px-4 py-2 text-left bg-primary-100 text-primary-600";
              document.getElementById(
                e.currentTarget.id + "_icon"
              ).hidden = false;
            }}
            className="flex justify-between w-full cursor-pointer rounded-lg px-4 py-2 text-left transition duration-500 hover:bg-neutral-100 hover:text-neutral-500 focus:bg-neutral-100 focus:text-neutral-500 focus:ring-0 dark:hover:bg-neutral-600 dark:hover:text-neutral-200 dark:focus:bg-neutral-600 dark:focus:text-neutral-200"
          >
            <div>
              {/* {element.aircraftIdentification} */}
              {splitFlightNumber(element.aircraftIdentification)}
            </div>
            <div className={roboto_mono.className}>
              {makeDate(element.departure.timeOfFlight)}
            </div>
            <h1 id={element._id + "_icon"} hidden={true}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
              >
                <path d="M120-120v-80h720v80H120Zm74-200L80-514l62-12 70 62 192-52-162-274 78-24 274 246 200-54q32-9 58 12t26 56q0 22-13.5 39T830-492L194-320Z" />
              </svg>
            </h1>
          </button>
        </div>
      ))}
    </div>
  );
};

const Sidebar = ({
  handleListAllFlights,
  flightPlanList,
  handleClickRoute,
  handleSearch
}) => {
  return (
    <div className="flex-initial top-0 left-0 h-screen w-80 m-0 p-4 flex flex-col bg-white border-r-2 shadow-lg">
      <h1 className="text-neutral-800 text-center text-3xl mb-4 leading-tight font-sans font-bold">
        Dispatcher
      </h1>
      <Search handleSearch={handleSearch} />
      <div className="flex gap-2 justify-evenly my-3">
        <button
          type="submit"
          className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
          onClick={(e) => {
            const searchInput = document.getElementById("flightNumberSearchInput")
            handleSearch(searchInput.value)
            // if (searchInput.value) {
            //   // console.log(searchInput.value)
            //   // console.log('<', searchInput.value, '>')
            //   handleSearch(searchInput.value)
            // }
          }}
        >
          Search
        </button>
        <button
          type="button"
          className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
          onClick={handleListAllFlights}
        >
          List All
        </button>
      </div>
      <hr className="my-2 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" />
      <BuildFlightList
        flightListArray={flightPlanList ? (flightPlanList) : ([])}
        handleClickRoute={handleClickRoute}
      />
    </div>
  );
};

export default Sidebar;

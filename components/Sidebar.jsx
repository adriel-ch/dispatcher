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
    <div className="w-full text-primary-900 overflow-auto shadow-xl rounded-lg">
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
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 -960 960 960"
                width="24"
                className="fill-warning-600"
              >
                <path d="M120-120v-80h720v80H120Zm74-200L80-514l62-12 70 62 192-52-162-274 78-24 274 246 200-54q32-9 58 12t26 56q0 22-13.5 39T830-492L194-320Z" />
              </svg> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                width="24"
                viewBox="0 0 640 512"
                className="fill-warning-600"
              >
                <path d="M381 114.9L186.1 41.8c-16.7-6.2-35.2-5.3-51.1 2.7L89.1 67.4C78 73 77.2 88.5 87.6 95.2l146.9 94.5L136 240 77.8 214.1c-8.7-3.9-18.8-3.7-27.3 .6L18.3 230.8c-9.3 4.7-11.8 16.8-5 24.7l73.1 85.3c6.1 7.1 15 11.2 24.3 11.2H248.4c5 0 9.9-1.2 14.3-3.4L535.6 212.2c46.5-23.3 82.5-63.3 100.8-112C645.9 75 627.2 48 600.2 48H542.8c-20.2 0-40.2 4.8-58.2 14L381 114.9zM0 480c0 17.7 14.3 32 32 32H608c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32z" />
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
  // console.log(flightPlanList)
  return (
    <div className="flex-initial top-0 left-0 h-screen w-80 m-0 p-4 flex flex-col bg-stone-50 border-r-2 shadow-lg">
      {/* <div className="flex justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="37.5"
          width="37.5"
          viewBox="0 0 640 512"
          className="-mr-1.5 fill-warning-600"
          transform="rotate(90)"
        >
          <path d="M0 488V171.3c0-26.2 15.9-49.7 40.2-59.4L308.1 4.8c7.6-3.1 16.1-3.1 23.8 0L599.8 111.9c24.3 9.7 40.2 33.3 40.2 59.4V488c0 13.3-10.7 24-24 24H568c-13.3 0-24-10.7-24-24V224c0-17.7-14.3-32-32-32H128c-17.7 0-32 14.3-32 32V488c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24zm488 24l-336 0c-13.3 0-24-10.7-24-24V432H512l0 56c0 13.3-10.7 24-24 24zM128 400V336H512v64H128zm0-96V224H512l0 80H128z" />
        </svg>
        <h1 className="text-primary-900 text-center text-3xl mb-4 leading-tight font-sans font-bold italic pt-2">
          ispatcher
        </h1>
      </div> */}
      <div className="flex justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="60"
          width="60"
          viewBox="0 0 576 512"
          className="-mr-6 fill-warning-600"
        >
          <path d="M482.3 192c34.2 0 93.7 29 93.7 64c0 36-59.5 64-93.7 64l-116.6 0L265.2 495.9c-5.7 10-16.3 16.1-27.8 16.1l-56.2 0c-10.6 0-18.3-10.2-15.4-20.4l49-171.6L112 320 68.8 377.6c-3 4-7.8 6.4-12.8 6.4l-42 0c-7.8 0-14-6.3-14-14c0-1.3 .2-2.6 .5-3.9L32 256 .5 145.9c-.4-1.3-.5-2.6-.5-3.9c0-7.8 6.3-14 14-14l42 0c5 0 9.8 2.4 12.8 6.4L112 192l102.9 0-49-171.6C162.9 10.2 170.6 0 181.2 0l56.2 0c11.5 0 22.1 6.2 27.8 16.1L365.7 192l116.6 0z" />
        </svg>
        <h1 className="text-primary-900 text-center text-2xl mb-2 leading-tight font-sans font-bold italic pt-8 -skew-x-[20deg]">
          DISPATCHER
        </h1>
      </div>
      <Search handleSearch={handleSearch} />
      <div className="flex gap-2 justify-evenly my-3">
        <button
          type="submit"
          className="inline-block rounded bg-primary-900 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-warning-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-warning-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-warning-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
          onClick={(e) => {
            const searchInput = document.getElementById(
              "flightNumberSearchInput"
            );
            handleSearch(searchInput.value);
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
          className="inline-block rounded bg-primary-900 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-warning-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-warning-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-warning-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
          onClick={handleListAllFlights}
        >
          List All
        </button>
      </div>
      <hr className="my-2 h-0.5 border-t-2 bg-neutral-100 opacity-100 dark:opacity-50" />
      <h2 className="text-secondary-600 text-center pb-2">Departure times are in UTC</h2>
      {flightPlanList[0] ? (
        <BuildFlightList
          flightListArray={flightPlanList ? flightPlanList : []}
          handleClickRoute={handleClickRoute}
        />
      ) : (
        <div className="flex flex-col text-center h-full justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 512 512"
            className="h-24 my-5 fill-warning-600"
          >
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM288 176c0-44.2-35.8-80-80-80s-80 35.8-80 80c0 48.8 46.5 111.6 68.6 138.6c6 7.3 16.8 7.3 22.7 0c22.1-27 68.6-89.8 68.6-138.6zm-112 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" />
          </svg>
          <h1 className="text-primary-800 text-2xl">No flight routes listed</h1>
          <h2 className="text-secondary-600">
            Search for a callsign above <br /> (E.g. "SIA22" or "346") <br /> or
            click <b>List All</b> to populate this list
          </h2>
        </div>
      )}
      {/* <BuildFlightList
        flightListArray={flightPlanList ? (flightPlanList) : ([])}
        handleClickRoute={handleClickRoute}
      /> */}
    </div>
  );
};

export default Sidebar;

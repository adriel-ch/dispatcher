"use client";
import { useEffect } from "react";

const search = () => {
  useEffect(() => {
    const init = async () => {
      const { Input, initTE } = await import("tw-elements");
      initTE({ Input });
    };
    init();
  }, []);

  return (
    <div className="relative mb-5" data-te-input-wrapper-init>
      <input
        type="search"
        className="text-neutral-800 peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[2.15] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[te-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:peer-focus:text-primary [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
        id="flightNumberSearchInput"
        placeholder="Example label"
      />
      <label
        htmlFor="flightNumberSearchInput"
        className="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[2.15] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[1.15rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[1.15rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
      >
        <div className="flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-5 w-5 mt-1.5 mr-1"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clipRule="evenodd"
            />
          </svg>
          Flight Number
        </div>
      </label>
      <div
        className="absolute w-full text-sm text-neutral-500 peer-focus:text-primary dark:text-neutral-200 dark:peer-focus:text-primary pl-3"
        data-te-input-helper-ref
      >
        Search for a flight plan
      </div>
    </div>
  );
};

export default search;

import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Sidebar from "@/components/Sidebar";

describe("Sidebar", () => {
  it("Checks if a flight number is rendered correctly from flightPlanList", () => {
    const sampleFlight = [
      {
        _id: "64df456e20abcfdf99bfde0a",
        messageType: "DEP",
        aircraftIdentification: "SIA288",
        enroute: { currentModeACode: "1505" },
        departure: {
          departureAerodrome: "YSCB",
          actualTimeOfDeparture: "2023-08-18T09:44:00.000Z",
          dateOfFlight: "2023-08-18",
          timeOfFlight: 1692351840,
        },
        arrival: { destinationAerodrome: "WSSS" },
        receptionTime: "2023-08-18T09:42:19.907Z",
        src: "AFTN",
        lastUpdatedTimeStamp: "2023-08-18T10:18:22.685Z",
      },
    ];
    render(<Sidebar flightPlanList={sampleFlight} />)
    const flightNumber = screen.getByText("SIA-288")
    expect(flightNumber).toBeInTheDocument()
  });
});

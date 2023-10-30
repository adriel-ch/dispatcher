# Dispatcher

A tool to display flight routes on a map.

Uses React and Next.js with OpenStreetMap for map data.

## Getting Started with Dev

Ensure that you have Node and npm installed. Using nvm is highly recommended.

https://github.com/nvm-sh/nvm#install--update-script

First, clone this repo.

Next, ensure that you have an .env file setup with the following variables to access the API:

```bash
DATA_API_KEY=asd123 # Required
DATA_API_IPADDRESS=1337.1.1.9 # Required
```

Next, run ```npm install``` to load dependencies.

Finally, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Running in prod

We use GitHub Actions to handle CI/CD and Vercel to host our deployment.

The Action does the following for each push to main:
1. Checkout main branch
2. Setup a Node environment
3. npm install > npm run build > npm test
4. If pass, deploy build to Vercel

#### A dockerfile is also included

Ensure that you have the required env variables in a ```.env``` file or have them injected during buildtime/deployment.

## How it works

This app gets information on flight routes from an API source. Per flight route, it gets more information on the latitude and longitude coordinates for each listed point of the airways on the route.

With that information, the route is plotted on the map showing the departure and arrival airports, as well as the points inbetween.

### List All

Clicking on List All will display a list of all flight plans. It is GET method that calls an API to obtain the info.

Here we utilise a feature of Next.js called route handlers to execute the data fetch on the server and return the response data to the client. This helps to keep sensitive info such as API keys hidden.

### Searching

This app also offers the ability to search for a specific flight number/callsign. Search for a flight number in the search field to get a list of flights that match your query.

The results are listed lexicographically, i.e. sorted alphanumerically, and are listed in reverse chronological order.

### Route Calulation and data cleaning

Once a flight has been selected we need to retrieve the coordinate data for each point in the route we wish to plot. The app will search for the coordinates for the departure and arrival airports, and each of the listed points inbetween.

The coordinates of the points (fixes and navaids) are not unique to their names. E.g. a point ABC can have two sets of coordinate data [1, 1] and [12, 56]. If a search for a point returns more than one result, we need to find out which set of coordinates to use from the result.

To do that, we need to find out which point of all the returned points has the shortest distance between it and a previously know point from the route.

As the surface of the Earth is not a flat surface, we need to use the Haversine formula to find the distance between two coordinate points. The Haversine formula calculates the great-circle distance between two coordinate points.

### Route Plotting

Once a flight has been selected, the app will plot a route from the departure airport to the arrival airport using the waypoints given in the flight plan.

The surface of the Earth is not a flat surface i.e. so we cannot use the simple pythagorean theorem (x^2 + y^2 = z^2) to calculate distance between two points to plot them on the map.

Instead, we have to use methods fit for the spherical nature of the surface. To plot the distance between points, we use Vincenty's formulae implemented via leaflet.geodesic

## Further improvements

More tests

Optimise route display

More accurate route plot

## Refs

https://leafletjs.com/examples/quick-start/

https://github.com/colbyfayock/next-leaflet-starter

https://placekit.io/blog/articles/making-react-leaflet-work-with-nextjs-493i

https://medium.com/@tomisinabiodun/displaying-a-leaflet-map-in-nextjs-85f86fccc10c

https://react-leaflet.js.org/docs/example-external-state/

https://stackoverflow.com/questions/64665827/react-leaflet-center-attribute-does-not-change-when-the-center-state-changes

https://stackoverflow.com/questions/16845614/zoom-to-fit-all-markers-in-mapbox-or-leaflet?rq=3

https://stackoverflow.com/questions/67629532/fit-a-maps-bounds-to-contents-of-a-featuregroup-in-react-leaflet

https://stackoverflow.com/questions/40532496/wrapping-lines-polygons-across-the-antimeridian-in-leaflet-js

https://stackoverflow.com/questions/34053715/how-to-output-date-in-javascript-in-iso-8601-without-milliseconds-and-with-z

https://stackoverflow.com/questions/5963182/how-to-remove-spaces-from-a-string-using-javascript

Brute force method to reset everything
https://stackoverflow.com/questions/72363723/how-to-reset-a-leaflet-map-after-a-case-in-js

https://stackoverflow.com/questions/38820724/how-to-display-leaflet-markers-near-the-180-meridian

https://stackoverflow.com/questions/62617927/colored-svg-icons-in-leaflet

### Testing

https://stackoverflow.com/questions/74022933/how-do-i-test-a-function-inside-a-component-by-using-jest

### CICD

#### Vercel deployment
https://github.com/vercel/examples/tree/main/ci-cd/github-actions

https://github.com/orgs/vercel/discussions/3307

https://github.com/vercel/vercel/discussions/4589

https://github.com/marketplace/actions/vercel-action
// ref: https://blog.devgenius.io/next-js-with-mapbox-gl-js-map-707fed31beea
import React, { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const cityData = require("./data/City_Maintained_Street_Lights.json");
const filteredCityData = cityData.features.filter(
  (streetlight) =>
    streetlight.properties.OBJECTID < 100 &&
    streetlight.properties.Removal_Date === null
); //

const Marker = ({ children, feature }) => {
  return <button className="marker">{children}</button>;
};

const MapWithMarker = () => {
  //console.log(cityData.features[0]);

  const mapContainer = useRef(null);
  const map = useRef(null);
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN;

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map(
      {
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/navigation-night-v1",
        center: [-89.4008, 43.0722], // center map on Chad
        zoom: 11,
      },
      []
    );

    // Create default markers
    const marker = new mapboxgl.Marker()
      .setLngLat([-89.4008, 43.0722])
      .addTo(map.current);
    // filteredCityData.map((feature) =>
    //   new mapboxgl.Marker().setLngLat(feature.geometry.coordinates).addTo(map.current)
    // );

    // Render custom marker components
    filteredCityData.forEach((feature) => {
      // Create a React ref
      const ref = React.createRef();
      // Create a new DOM node and save it to the React ref
      ref.current = document.createElement("div"); // ref.current is a container
      // Render a Marker Component on our new DOM node
      //   ReactDOM.render(<Marker feature={feature} />, ref.current); [ReactDOM.render is no longer supported in React 18]
      const root = createRoot(ref.current);
      root.render(<Marker feature={feature} />);

      // Create Mapbox Marker at our new DOM node
      new mapboxgl.Marker(ref.current)
        .setLngLat(feature.geometry.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }) // add popups
            .setHTML(
              `<h3>Wattage: ${feature.properties.Wattage}</h3><h4>Utility: City of Madison</h4>`
            )
        )
        .addTo(map.current);
    });

    map.current.on("zoom", () => {
      const scalePercent = 1 + (map.current.getZoom() - 8) * 0.4;
      const svgElement = marker.getElement().children[0];
      svgElement.style.transform = `scale(${scalePercent})`;
      svgElement.style.transformOrigin = "bottom";
    });

    // Add navigation control (the +/- zoom buttons)
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
  });

  return (
    <main>
      <div className="map-container" ref={mapContainer} />
    </main>
  );
};

export default MapWithMarker;

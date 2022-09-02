// ref: https://docs.mapbox.com/mapbox-gl-js/example/center-on-feature/
// ref: https://docs.mapbox.com/mapbox-gl-js/example/filter-features-within-map-view/
import React, { useState, useEffect, useRef } from "react";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
// import MapboxDirections from '@mapbox/mapbox-gl-directions';
// import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css'

const MapWithLayer = (props) => {
  const data = [props.data, props.data2];
  const mapContainer = useRef(null);
  const map = useRef(null);
  // const [crExpression, setCrExpression] = useState(["interpolate", ["linear"], ["zoom"], 11, 1, 16, 7]); // zoom_start, radius_start, zoom_end, radius_end,

  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN;

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/navigation-night-v1",
      center: [-89.4008, 43.0722], // center map on Chad
      zoom: 11,
    });

    // Create a popup, but don't add it to the map yet.
    const popup = new mapboxgl.Popup({
      //closeButton: false,
    });

    map.current.on("load", () => {
      // Add a GeoJSON source
      map.current.addSource("citySource", {
        type: "geojson",
        data: data[0],
      });
      map.current.addSource("utilitySource", {
        type: "geojson",
        data: data[1],
      });
      // Add a circle layer
      let crExpression = ["interpolate", ["linear"], ["zoom"], 11, 1, 16, 7];
      const circleOpacity = 0.5;
      map.current.addLayer({
        id: "cityMaintainedLayer",
        type: "circle",
        source: "citySource",
        paint: {
          "circle-color": "#efb336",
          "circle-radius": crExpression,
          "circle-stroke-width": 0,
          "circle-stroke-color": "#ffffff",
          "circle-opacity": circleOpacity,
        },
      });
      map.current.addLayer({
        id: "utilityMaintainedLayer",
        type: "circle",
        source: "utilitySource",
        paint: {
          "circle-color": "#efb336",
          "circle-radius": crExpression,
          "circle-stroke-width": 0,
          "circle-stroke-color": "#ffffff",
          "circle-opacity": circleOpacity,
        },
      });

      // add popup for cityMaintainedLayer
      map.current.on("click", "cityMaintainedLayer", (e) => {
        // Populate the popup and set its coordinates based on the feature.
        const feature = e.features[0];
        popup
          .setLngLat(feature.geometry.coordinates)
          .setHTML(
            `<h4>Watt: ${feature.properties.Wattage}</h4><p>Utility: City of Madison</p>`
          )
          .addTo(map.current);
      });

      // Change the cursor to a pointer when the mouse is over the places layer.
      map.current.on("mouseenter", "cityMaintainedLayer", () => {
        map.current.getCanvas().style.cursor = "pointer";
      });

      // Change it back to a pointer when it leaves.
      map.current.on("mouseleave", "cityMaintainedLayer", () => {
        map.current.getCanvas().style.cursor = "";
      });

      // add popup for utilityMaintainedLayer
      map.current.on("click", "utilityMaintainedLayer", (e) => {
        // Populate the popup and set its coordinates based on the feature.
        const feature = e.features[0];
        popup
          .setLngLat(feature.geometry.coordinates)
          .setHTML(
            `<h4>Watt: ${feature.properties.Watt2}</h4><p>Utility: ${feature.properties.Utility}</p>`
          )
          .addTo(map.current);
      });

      // Change the cursor to a pointer when the mouse is over the places layer.
      map.current.on("mouseenter", "utilityMaintainedLayer", () => {
        map.current.getCanvas().style.cursor = "pointer";
      });

      // Change it back to a pointer when it leaves.
      map.current.on("mouseleave", "utilityMaintainedLayer", () => {
        map.current.getCanvas().style.cursor = "";
      });
    });

    // Add navigation control (the +/- zoom buttons)
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
  }, []);

  const routefinder = () => {
    map.current.addControl(
      new MapboxDirections({
        accessToken: mapboxgl.accessToken,
      }),
      "top-left"
    );
    map.current.setPaintProperty("cityMaintainedLayer", "circle-radius", [
      "interpolate",
      ["linear"],
      ["zoom"],
      11,
      1,
      16,
      13,
    ]);
    map.current.setPaintProperty("utilityMaintainedLayer", "circle-radius", [
      "interpolate",
      ["linear"],
      ["zoom"],
      11,
      1,
      16,
      13,
    ]);
  };

  return (
    <main>
      <button id="launchRoutefinder" onClick={routefinder}>
        Find a <p>Brightway</p>
      </button>
      <div className="map-container" ref={mapContainer} />
    </main>
  );
};

export default MapWithLayer;

// ref: https://docs.mapbox.com/mapbox-gl-js/example/center-on-feature/
// ref: https://docs.mapbox.com/mapbox-gl-js/example/filter-features-within-map-view/
import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";


const MapWithLayer = (props) => {
  
  const mapContainer = useRef(null);
  const map = useRef(null);
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN;

  
 

  useEffect( () => {
    if (map.current) return; // initialize map only once
  console.log(props.data);

    map.current = new mapboxgl.Map(
      {
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/navigation-night-v1",
        center: [-89.4008, 43.0722], // center map on Chad
        zoom: 11,
      },
      []
    );

    map.current.on("load", () => {
      // Add a GeoJSON source
      map.current.addSource("points", {
        type: "geojson",
        data: props.data
      });
      map.current.addSource("points2", {
        type: "geojson",
        data: props.data2
      });
      // Add a circle layer
      map.current.addLayer({
        id: "circle",
        type: "circle",
        source: "points",
        paint: {
          "circle-color": "#efb336",
          "circle-radius": 4,
          "circle-stroke-width": 0,
          "circle-stroke-color": "#ffffff",
          'circle-opacity': 0.5,
        },
      });
      map.current.addLayer({
        id: "circle2",
        type: "circle",
        source: "points2",
        paint: {
          "circle-color": "#efb336",
          "circle-radius": 4,
          "circle-stroke-width": 0,
          "circle-stroke-color": "#ffffff",
          'circle-opacity': 0.5,
        },
      });
    });
    
    // Add navigation control (the +/- zoom buttons)
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
  }, []);
  // console.log(cityData);
  return (
    <main>
      <div className="map-container" ref={mapContainer} />
    </main>
  );
};

export default MapWithLayer;

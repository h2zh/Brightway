import React, { useState, useEffect } from "react";
import axios from "axios";
import MapWithLayer from "./MapWithLayer";
import localCityData from "./data/City_Maintained_Street_Lights.json";
import localUtilityData from "./data/Utility_Maintained_Street_Lights.json";

const cityUrl =
  "https://maps.cityofmadison.com/arcgis/rest/services/Public/OPEN_DATA_TE/MapServer/28/query?outFields=*&where=1%3D1&f=geojson";

const MapData = () => {
  const [cityData, setCityData] = useState(null);

  useEffect(() => {
    // IMPORTANT: ARCGIS api can only get first 1000 objects in a dataset
    const getData = async () => {
      await axios
        .get(cityUrl)
        .then((response) => {
          //console.log(response);
          setCityData(response.data);
        })
        .catch((err) => console.warn(err));
    };
    getData();
  }, []);


  const filteredValidData = (rawData) => {
    let filteredFeatures = rawData.features.filter(
        (entry) => entry.properties.Removal_Date === null
    );
    let filteredGeojson = {
      type: "FeatureCollection",
      name: "Foo",
      crs: {
        type: "name",
        properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
      },
      features: filteredFeatures,
    };
    return filteredGeojson;
  };

  return (
    <div>
      {localCityData ? <MapWithLayer data={localCityData} data2={localUtilityData}/> : ""}
    </div>
  );
};

export default MapData;

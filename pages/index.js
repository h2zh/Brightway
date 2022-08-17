import Head from "next/head";
import Script from "next/script";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import MapData from "./MapData";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Brightway: A Street Lights Map</title>
        <script src="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.1.0/mapbox-gl-directions.js"></script>
        <link
          rel="stylesheet"
          href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-directions/v4.1.0/mapbox-gl-directions.css"
          type="text/css"
        />
      </Head>
      <MapData />
    </div>
  );
}

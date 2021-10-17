import Head from "next/head";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { addDataLayer } from "../map/addDataLayer";
import { initializeMap } from "../map/initializeMap";
import { fetcher } from "../utilities/fetcher";
import styles from "../styles/Home.module.css";
const mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");

export default function Home() {
  const [pageIsMounted, setPageIsMounted] = useState(false);
  const [Map, setMap] = useState();
  const { data, error } = useSWR("/api/liveMusic", fetcher);

  if (error) {
    console.error(error);
  }

  mapboxgl.accessToken =
    "pk.eyJ1Ijoid2FubmFkYyIsImEiOiJjazBja2M1ZzYwM2lnM2dvM3o1bmF1dmV6In0.50nuNnApjrJYkMfR2AUpXA";

  useEffect(() => {
    setPageIsMounted(true);

    let map = new mapboxgl.Map({
      container: "my-map",
      /*https://docs.mapbox.com/api/maps/styles/*/
      style: "mapbox://styles/mapbox/dark-v10",
      center: [-77.02, 38.887],
      zoom: 12.5,
      pitch: 45,
     
    });

    initializeMap(mapboxgl, map);
    setMap(map);
  }, []);

  useEffect(() => {
    if (pageIsMounted && data) {
      Map.on("load", function () {
        addDataLayer(Map, data);
      });
    }
  }, [pageIsMounted, setMap, data, Map]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Covid Updates</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css"
          rel="stylesheet"
        />
      </Head>

      <main className={styles.main}>
        <div className="rounded-lg shadow-xl">
        <div className="rounded-xl" style={{height:400, width:500}} id="my-map"  />
        </div>
        
      </main>
    </div>
  );
}

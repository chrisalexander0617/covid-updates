import Head from "next/head";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { addDataLayer } from "../map/addDataLayer";
import { initializeMap } from "../map/initializeMap";
import { fetcher } from "../utilities/fetcher";
import styles from "../styles/Home.module.css";
const mapboxgl = require("mapbox-gl/dist/mapbox-gl.js");

export default function Home({covidData}) {
  const [pageIsMounted, setPageIsMounted] = useState(false);
  const [Map, setMap] = useState();
  const { data, error } = useSWR("/api/liveMusic", fetcher);

  console.log(covidData);
  const totalUSCases = covidData.US.All.confirmed

  if (error) console.error(error);
 
  mapboxgl.accessToken =
    "pk.eyJ1Ijoid2FubmFkYyIsImEiOiJjazBja2M1ZzYwM2lnM2dvM3o1bmF1dmV6In0.50nuNnApjrJYkMfR2AUpXA";

  useEffect(() => {
    setPageIsMounted(true);

    let map = new mapboxgl.Map({
      container: "my-map",
      /*https://docs.mapbox.com/api/maps/styles/*/
      style: "mapbox://styles/mapbox/navigation-night-v1",
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
        <div className="bg-gray-200 shadow-xl">
          <div style={{height:500, width:500}} id="my-map"  />
          <div className="text-2xl font-bold px-5 pt-4 mb-5">Covid Updates</div>
          <div className="px-5 py-3 mb-5">
            <div className="mb-2 text-gray-400">United States of America</div>
           <h2 className=" text-lg font-extrabold text-red-700">{ Number(totalUSCases.toFixed(0)).toLocaleString().split(/\s/).join(',')}</h2> 
          </div>
        </div>
      </main>

    </div>
  );
}

export async function getStaticProps() {
  const res = await fetch('https://covid-api.mmediagroup.fr/v1/cases');
  const covidData = await res.json();

  if (!covidData) {
    return {
      notFound: true
    }
  }

  return {
    props: { covidData }, // will be passed to the page component as props
  }
}
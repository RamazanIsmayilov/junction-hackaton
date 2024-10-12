import React, { useEffect, useRef } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";

const MapComponent = () => {
  const mapRef = useRef(null); // Map üçün referans yaradılır
  const mapInstance = useRef(null); // Xəritə instance-ni saxlamaq üçün

  useEffect(() => {
    if (!mapInstance.current) {
      // Yalnız bir dəfə xəritə yaradırıq
      mapInstance.current = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: fromLonLat([49.8671, 40.4093]), // Bakı koordinatları
          zoom: 6,
        }),
      });
    }
  }, []);

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <div
        ref={mapRef}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      ></div>
      <div
        className="bg-black"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          opacity: 0.5,
          zIndex: 1,
          pointerEvents: "none",
        }}
      ></div>
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "white",
          fontSize: "24px",
          fontWeight: "bold",
          zIndex: 2,
        }}
      >
        <h1 className="text-black text-5xl">GreenWave Baku</h1>
        <form className="mt-5">
          <input
            type="text"
            className="w-full h-12 bg-transparent border border-gray-300 rounded-lg p-2 focus:outline-none"
            placeholder="Search Here"
          />
        </form>
      </div>
    </div>
  );
};

export default MapComponent;

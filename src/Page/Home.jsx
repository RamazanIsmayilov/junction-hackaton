import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search) {
      navigate(`/search?query=${search}`);
    }
  };

  useEffect(() => {
    if (!mapInstance.current) {
      mapInstance.current = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: fromLonLat([49.8671, 40.4093]),
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
        <h1 className="text-white text-6xl font-bold drop-shadow-md text-center tracking-[0.1em]">
          GreenWave
        </h1>
        <form onSubmit={handleSubmit} className="mt-5 flex items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            className="w-full h-12 bg-transparent border border-gray-300 rounded-l-lg p-2 focus:outline-none"
            placeholder="Enter city name"
          />
          <button className="h-12 bg-purple-500 text-white rounded-r-lg px-4 hover:bg-purple-600 transition-colors duration-200">
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;

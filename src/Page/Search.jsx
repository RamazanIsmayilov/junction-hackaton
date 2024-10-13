import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Map from "ol/Map";
import { View } from "ol";
import TileLayer from "ol/layer/Tile";
import { fromLonLat } from "ol/proj";
import { OSM } from "ol/source";

const Search = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [coordinates, setCoordinates] = useState([49.8671, 40.4093]);
  const [selectedFilter, setSelectedFilter] = useState("Temperature");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryParam = searchParams.get("query");
    if (queryParam) {
      setQuery(queryParam);
      fetchWeatherAndCoordinates(queryParam);
    }
  }, [location]);

  const fetchWeatherAndCoordinates = async (city) => {
    try {
      const apiKey = "00580b0ee6169bdb85569e16d6e3e7c5";

      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
      );
      const geoData = await geoResponse.json();
      const { lat, lon } = geoData[0];
      setCoordinates([lon, lat]);

      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      const weather = await weatherResponse.json();
      setWeatherData(weather);

      mapInstance.current.getView().setCenter(fromLonLat([lon, lat]));
      mapInstance.current.getView().setZoom(10);
    } catch (error) {
      console.error("Error fetching weather or coordinates", error);
    }
  };

  const calculateHeatIndex = (temp, humidity) => {
    if (temp === undefined || humidity === undefined) {
      console.error("Temperature or humidity is undefined");
      return { heatIndexF: 0, heatIndexC: 0 };
    }

    const T = (temp * 9) / 5 + 32;
    const RH = humidity;

    const heatIndexF =
      -42.379 +
      2.04901523 * T +
      10.14333127 * RH -
      0.22475541 * T * RH -
      6.83783e-3 * T * T -
      5.481717e-2 * RH * RH +
      1.22874e-3 * T * T * RH +
      8.5282e-4 * T * RH * RH -
      1.99e-6 * T * T * RH * RH;

    const heatIndexC = ((heatIndexF - 32) * 5) / 9;

    return {
      heatIndexF: heatIndexF.toFixed(2),
      heatIndexC: heatIndexC.toFixed(2),
    };
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
          center: fromLonLat(coordinates),
          zoom: 6,
        }),
      });
    }
  }, [coordinates]);

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
  };

  const getAverageTemperature = () => {
    switch (selectedFilter) {
      case "Temperature":
        return `${weatherData ? weatherData.main.temp.toFixed(1) : 0} °C`;
      case "Heat Index":
        const { heatIndexC } = calculateHeatIndex(
          weatherData.main.temp,
          weatherData.main.humidity
        );
        return `${heatIndexC} °C`;
      case "Wind Speed":
        return `${weatherData ? weatherData.wind.speed.toFixed(1) : 0} m/s`;
      case "Humidity":
        return `${weatherData ? weatherData.main.humidity : 0} %`;
      default:
        return "0 °C";
    }
  };

  const heatIndexData = weatherData
    ? calculateHeatIndex(weatherData.main.temp, weatherData.main.humidity)
    : { heatIndexF: 0 };

  return (
    <div className="mx-auto flex">
      <section style={{ position: "relative", height: "100vh", width: "70vw" }}>
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
          <h1>
            {query ? `Results for "${query}"` : "No search query provided"}
          </h1>
        </div>
      </section>
      <section className="px-5 w-[30vw] bg-[#D9D9D9]">
        <div className="title mt-5">
          <h3 className="text-3xl font-semibold">Preview</h3>
        </div>
        <div className="types mt-4">
          <h4 className="text-xl font-semibold">Select Sensor Type</h4>
          <div className="filters flex gap-1 mt-3">
            {["Temperature", "Heat Index", "Wind Speed", "Humidity"].map(
              (filter) => (
                <button
                  key={filter}
                  className={`bg-[#fff] border border-orange-400 hover:bg-orange-400 font-semibold py-2 px-2 rounded-full ${
                    selectedFilter === filter ? "bg-orange-400" : ""
                  }`}
                  onClick={() => handleFilterClick(filter)}
                >
                  {filter}
                </button>
              )
            )}
          </div>
          <hr className="mt-5 border-t-2 border-black" />
        </div>
        <div className="avarage mt-5">
          <h4 className="text-xl font-semibold">Average {selectedFilter}</h4>
          <p className="mt-3 font-medium">
            <span className="text-orange-400">Date:</span> 10/13/2024
          </p>
          <div className="result mt-5">
            <h1 className="text-6xl text-orange-400">
              {getAverageTemperature()}
            </h1>
          </div>
        </div>
        {weatherData && (
          <div>
            <div className="mt-5 text-black">
              <h2 className="text-xl font-medium">
                Location: {weatherData.name}, {weatherData.sys.country}
              </h2>
            </div>
            <div
              className={`notifiaction mt-5 ${
                heatIndexData.heatIndexC > 20
                  ? "bg-red-200 border-red-600 text-red-600"
                  : "bg-green-200 border-green-600 text-green-600"
              } border rounded p-4`}
            >
              {heatIndexData.heatIndexC > 20
                ? "Warning! The temperature in the greenhouse is too high for the plants, please take action."
                : "Great! The greenhouse conditions are currently ideal for the plants"}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Search;

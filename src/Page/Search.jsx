import Map from 'ol/Map'; // Add this import for Map
import { View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import { OSM } from 'ol/source';
import React, { useEffect, useRef } from 'react';

const Search = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

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
    <div className="mx-auto flex">
      <section style={{ position: 'relative', height: '100vh', width: '70vw' }}>
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
        </div>
        <div className='w-full flex justify-center'>
          <input className='absolute top-0 w-[80%] my-5 py-2 border-2 z-50 border-white rounded-full bg-transparent px-5 text-white' placeholder='Write something to there' type="text" />
        </div>
        <div className='absolute z-50 bottom-96 left-60 w-72 h-36  bg-[#D9D9D9] p-2'>
          <div className='grid grid-cols-3 text-center border-b-2 border-black pb-5'>
            <div>
              <h2>Temp.</h2>
              <p className='text-lg text-[#CB6600]'>84F</p>
            </div>
            <div>
              <h2>Hum.</h2>
              <p className='text-lg text-[#CB6600]'>28%</p>
            </div>
            <div>
              <h2>Pol.</h2>
              <p className='text-lg text-[#CB6600]'>60</p>
            </div>
          </div>
          <div className='flex justify-center items-end gap-5 mt-5'>
            <p>Lat: <span className='font-bold'>4247892</span> </p>
            <p>Long: <span className='font-bold'>4247892</span></p>
          </div>
        </div>
      </section>
      <section className='px-7 w-[30vw]  bg-[#D9D9D9]'>
        <div className='py-5 border-b-2 border-black'>
          <h2 className='mb-10 font-medium text-2xl'>Preview</h2>
          <p className=' mb-10 text-lg'>Select Sensor Type</p>
          <ul className='flex justify-start gap-5'>
            <li className='text-[#CB1900] border border-[#CB1900] rounded-full px-2 py-1'>Temperature</li>
            <li className=' border border-black  rounded-full px-2 py-1'>Humilidity</li>
            <li className=' border border-black  rounded-full px-2 py-1'>Pollution</li>
          </ul>
        </div>
        <div className='mt-5 border-b-2 border-black pb-10'>
          <h2 className='mb-10 font-medium text-2xl'>Average Temperature</h2>
          <span>29/05/2024</span>
          <p className='text-6xl text-[#CB6600] font-medium my-2.5'>84 F</p>
          <span className='text-sm'>Averege temprature in X</span>
        </div>
      </section>
    </div>
  );
};

export default Search;

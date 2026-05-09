import React, { useState, useCallback, useEffect } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import MapSection from './components/MapSection';
import AddressForm from './components/AddressForm';
import PriceCalculator from './components/PriceCalculator';
import { ADMIN_LOCATION } from './utils/constants';
import './App.css'

const libraries = ['places'];

export default function App() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [storeLocation, setStoreLocation] = useState(null);
  const [customerLocation, setCustomerLocation] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distances, setDistances] = useState({ pickup: 0, delivery: 0 });

  const calculateRoute = useCallback(async () => {
    if (!storeLocation || !customerLocation) return;

    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();

    try {
      const results = await directionsService.route({
        origin: ADMIN_LOCATION,
        destination: customerLocation.coords,
        waypoints: [{ location: storeLocation.coords, stopover: true }],
        // eslint-disable-next-line no-undef
        travelMode: google.maps.TravelMode.DRIVING,
      });

      setDirectionsResponse(results);
      
      const legs = results.routes[0].legs;
      
      // Debugging: Cek di Console Browser (F12)
      console.log("Leg 0 (Admin-Toko):", legs[0].distance.text);
      console.log("Leg 1 (Toko-Customer):", legs[1].distance.text);

      const newDistances = {
        pickup: legs[0].distance.value / 1000, 
        delivery: legs[1].distance.value / 1000,
      };

      setDistances(newDistances);
      console.log("State Distances Updated:", newDistances);

    } catch (error) {
      console.error("Gagal menghitung rute:", error);
    }
  }, [storeLocation, customerLocation]);

  // Efek Real-time: Kalkulasi otomatis saat lokasi berubah
  useEffect(() => {
    if (storeLocation && customerLocation) {
      calculateRoute();
    }
  }, [storeLocation, customerLocation, calculateRoute]);

  if (loadError) return <div className="p-4 text-red-500">Error loading maps</div>;
  if (!isLoaded) return <div className="p-4">Memuat aplikasi...</div>;

 // Di dalam return App.jsx
return (
  <div className="fixed inset-0 flex flex-col md:flex-row bg-gray-50 overflow-hidden font-sans">
    
    {/* BAGIAN MAP */}
    <div className="h-[40dvh] md:h-full md:w-3/5 lg:w-2/3 relative shrink-0">
      <MapSection 
        adminLocation={ADMIN_LOCATION}
        storeLocation={storeLocation?.coords}
        customerLocation={customerLocation?.coords}
        directionsResponse={directionsResponse}
      />
    </div>

    {/* BAGIAN PANEL (SCROLLABLE) */}
    <div className="flex-1 flex flex-col bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.05)] z-20 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-6 text-left"> 
        {/* Tambahkan text-left karena CSS kamu sebelumnya set text-center */}
        
        <div>
          <h1 className="text-2xl font-bold text-blue-600 m-0 p-0 leading-tight">Truken Jastip</h1>
          <p className="text-sm text-gray-500 font-medium">Kendal & Sekitarnya • Real-time Shipping</p>
        </div>

        <AddressForm 
          setStoreLocation={setStoreLocation}
          setCustomerLocation={setCustomerLocation}
          onCalculate={calculateRoute}
          isReady={storeLocation && customerLocation}
        />

        <PriceCalculator distances={distances} />
        
        {/* Spasi tambahan di bawah biar nggak mentok navigasi HP */}
        <div className="h-20 md:hidden"></div>
      </div>
    </div>

  </div>
);
}
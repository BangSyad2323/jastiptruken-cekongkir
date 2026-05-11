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
  const [durations, setDurations] = useState({ pickup: 0, delivery: 0 });

  const [showQRIS, setShowQRIS] = useState(false);

  const whatsappNumber = "62895379007437"; // Ganti pakai nomor WA-mu ndes (awali 62)
  const textWA = encodeURIComponent("Halo Truken Jastip! Saya mau pesan jastip dong, tadi sudah cek ongkir di website.");

  const calculateRoute = useCallback(async () => {
  if (!customerLocation) return;

  const directionsService = new google.maps.DirectionsService();

  try {
    // 1. HITUNG JARAK LANGSUNG (Patokan Admin -> Customer)
    const directResults = await directionsService.route({
      origin: ADMIN_LOCATION,
      destination: customerLocation.coords,
      travelMode: google.maps.TravelMode.DRIVING,
      avoidTolls: true,
    });
    const directDist = directResults.routes[0].legs[0].distance.value / 1000;

    // 2. HITUNG RUTE ASLI (Admin -> [Toko] -> Customer)
    const routeOptions = {
      origin: ADMIN_LOCATION,
      destination: customerLocation.coords,
      travelMode: google.maps.TravelMode.DRIVING,
      avoidTolls: true,
    };

    if (storeLocation) {
      routeOptions.waypoints = [{ location: storeLocation.coords, stopover: true }];
    }

    const jastipResults = await directionsService.route(routeOptions);
    setDirectionsResponse(jastipResults);
    
    const legs = jastipResults.routes[0].legs;

    if (storeLocation) {
      const distAT = legs[0].distance.value / 1000; // Admin ke Toko
      const distTC = legs[1].distance.value / 1000; // Toko ke Customer
      const totalDistJastip = distAT + distTC;

      // LOGIKA SEARAH: Selisih rute jastip vs rute langsung
      const detourDistance = totalDistJastip - directDist;
      
      // Jika mampir toko cuma nambah < 1.5 km, kita anggap SEARAH
      const isSearah = detourDistance < 0.1; 

      setDistances({
        direct: directDist, // Kita simpan jarak patokan 2000/km
        pickup: distAT,     // Jarak jemput (untuk biaya tambahan jika berlawanan)
        delivery: distTC,
        isOpposite: !isSearah, // Kebalikan dari searah
        hasStore: true
      });

      setDurations({
        pickup: Math.ceil(legs[0].duration.value / 60),
        delivery: Math.ceil(legs[1].duration.value / 60),
      });

    } else {
      // MODE ANTAR SAJA (Tanpa Toko)
      setDistances({
        direct: directDist,
        pickup: 0, 
        delivery: directDist,
        isOpposite: false,
        hasStore: false
      });
      setDurations({
        pickup: 0,
        delivery: Math.ceil(legs[0].duration.value / 60),
      });
    }
      
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
      <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-2 text-left"> 
        {/* Tambahkan text-left karena CSS kamu sebelumnya set text-center */}
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-md  text-amber-700  tracking-tight">Truken Jastip</h1>
            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest ">Kendal & Sekitarnya</p>
          </div>
            
          <div className="flex gap-3 items-center">
          {/* TOMBOL QRIS (FOTO KECIL) */}
          <div className='flex flex-col justify-center items-center'>
            <button 
              onClick={() => setShowQRIS(true)}
              className="group relative w-10 h-10 rounded-xl border-2 border-purple-200 overflow-hidden hover:border-purple-500 transition-all shadow-sm active:scale-95"
            >
              <img 
                src="/qris-truken.jpeg" 
                alt="QRIS Small" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <p className='text-[11px] pt-1 block font-bold '>QRIS</p>
            </div>

            {/* TOMBOL WHATSAPP ASLI */}
            <div className='flex flex-col justify-center items-center'>
            <a 
              href={`https://wa.me/${whatsappNumber}?text=${textWA}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center bg-[#25D366] text-white rounded-xl shadow-md hover:bg-[#20ba5a] transition-all active:scale-95"
            >
              <svg 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className="w-6 h-6"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
            <p className='text-[11px] pt-1 block font-bold '>WA</p>
            </div>
        </div>
      </div>

    {/* MODAL QRIS (Overlay) */}
      {showQRIS && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <div className="bg-white rounded-3xl p-6 max-w-sm w-full relative shadow-2xl">
          {/* Tombol Tutup */}
          <button 
            onClick={() => setShowQRIS(false)}
            className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 active:scale-90"
          >
            <svg size={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Scan QRIS Truken</h2>
            <div className="bg-white rounded-2xl p-2 border-2 border-gray-100">
              <img src="/qris-truken.jpeg" alt="QRIS Truken" className="w-full rounded-xl" />
            </div>
            <p className="text-[10px] text-gray-400 font-medium">Bisa bayar pakai Dana, OVO, ShopeePay, atau Mobile Banking.</p>
          </div>
        </div>
      </div>
    )}

        <AddressForm 
          setStoreLocation={setStoreLocation}
          setCustomerLocation={setCustomerLocation}
          customerLocation={customerLocation}
          onCalculate={calculateRoute}
          isReady={!customerLocation}
        />

        <PriceCalculator distances={distances} durations={durations} />
        
        {/* Spasi tambahan di bawah biar nggak mentok navigasi HP */}
        <div className="h-20 md:hidden"></div>
      </div>
    </div>

  </div>
);
}
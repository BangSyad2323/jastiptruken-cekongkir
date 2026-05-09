// src/utils/constants.js

// Koordinat Admin (Contoh: Area Kendal/Semarang)
export const ADMIN_LOCATION = { lat: -6.9557782, lng: 110.1525442 }; 

export const PRICING_CONFIG = {
  PICKUP_FEE_PER_KM: 1000,    // Admin ke Toko
  DELIVERY_FEE_PER_KM: 3000,  // Toko ke Customer
  FIXED_JASTIP_FEE: 4000,    // Fee Jastip Tetap
};

export const MAP_OPTIONS = {
  disableDefaultUI: true,
  zoomControl: true,
  streetViewControl: false,
};
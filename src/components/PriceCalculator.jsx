// src/components/PriceCalculator.jsx
import React from 'react';
import { PRICING_CONFIG } from '../utils/constants';
import { formatRupiah } from '../utils/helpers';
import { Calculator, Truck, PackageCheck, Wallet } from 'lucide-react';

export default function PriceCalculator({ distances }) {
  const { pickup, delivery } = distances;
  
  // Kalkulasi Biaya
  const pickupCost = pickup * PRICING_CONFIG.PICKUP_FEE_PER_KM;
  const deliveryCost = delivery * PRICING_CONFIG.DELIVERY_FEE_PER_KM;
  const totalCost = pickupCost + deliveryCost + PRICING_CONFIG.FIXED_JASTIP_FEE;

  // Render state kosong jika belum ada perhitungan
  if (pickup === 0 && delivery === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-6 border-2 border-dashed border-gray-200 rounded-xl">
        <Calculator size={48} className="mb-3 opacity-50" />
        <p className="text-sm text-center">Masukkan lokasi toko dan tujuan untuk melihat estimasi ongkir.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden flex flex-col">
      <div className="bg-slate-50 border-b border-gray-100 p-4">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <Wallet size={18} className="text-slate-600" />
          Rincian Biaya
        </h3>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Jarak A */}
        <div className="flex justify-between items-center">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Truck size={16} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Ambil Barang</p>
              <p className="text-xs text-gray-500">{pickup.toFixed(1)} km x {formatRupiah(PRICING_CONFIG.PICKUP_FEE_PER_KM)}/km</p>
            </div>
          </div>
          <span className="text-sm font-semibold text-gray-800">{formatRupiah(pickupCost)}</span>
        </div>

        {/* Jarak B */}
        <div className="flex justify-between items-center">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
              <PackageCheck size={16} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Antar Barang</p>
              <p className="text-xs text-gray-500">{delivery.toFixed(1)} km x {formatRupiah(PRICING_CONFIG.DELIVERY_FEE_PER_KM)}/km</p>
            </div>
          </div>
          <span className="text-sm font-semibold text-gray-800">{formatRupiah(deliveryCost)}</span>
        </div>

        {/* Fee Jastip */}
       <div className="flex justify-between items-center pb-2 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
            <Calculator size={16} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">Fee Jasa Titip</p>
            {/* Harga coret kecil di bawah judul fee */}
            <span className="text-[10px] text-gray-400 line-through decoration-red-400 block">
              {formatRupiah(5000)}
            </span>
          </div>
        </div>
        {/* Harga promo yang aktif */}
        <span className="text-sm font-semibold text-purple-600">
          {formatRupiah(PRICING_CONFIG.FIXED_JASTIP_FEE)}
        </span>
      </div>

        {/* Total Keseluruhan */}
        <div className="flex justify-between items-center pt-2">
          <p className="text-base font-bold text-gray-900">Total Ongkir</p>
          <p className="text-xl font-black text-blue-600">{formatRupiah(totalCost)}</p>
        </div>
      </div>
    </div>
  );
}
// src/components/PriceCalculator.jsx
import React from 'react';
import { PRICING_CONFIG } from '../utils/constants';
import { formatRupiah } from '../utils/helpers';
import { Calculator, Truck, PackageCheck, Wallet, Clock, MapPin } from 'lucide-react';

export default function PriceCalculator({ distances, durations }) {
  // Kita kasih nilai default 0 kalau variabelnya belum ada
const { direct = 0, pickup = 0, delivery = 0, isOpposite = false, hasStore = false } = distances || {};
  const { pickup: pTime, delivery: dTime } = durations || { pickup: 0, delivery: 0 };
  
  // Kalkulasi Biaya
  let pickupCost = 0;
  let deliveryCost = 0;
  let labelAntar = "";
  let jarakAntar = 0;
  


  if (hasStore && isOpposite) {
    // LOGIKA NOMOR 2: BERLAWANAN ARAH
    pickupCost = pickup * PRICING_CONFIG.PICKUP_FEE_PER_KM;          // Lokasi awal ke Toko x 1000
    deliveryCost = delivery * PRICING_CONFIG.DELIVERY_FEE_PER_KM;      // Toko ke Tujuan x 2000
    jarakAntar = delivery;
    labelAntar = "Antar Barang (Dari Toko)";
  } else {
    // LOGIKA NOMOR 1: SEARAH (atau tanpa toko)
    pickupCost = 0;                      // Gratis biaya jemput
    deliveryCost = direct * 2000;        // Lokasi awal ke Tujuan x 2000
    jarakAntar = direct;
    labelAntar = "Ongkir Utama";
  }

  const totalCost = deliveryCost + pickupCost + PRICING_CONFIG.FIXED_JASTIP_FEE;
  const totalTime = pTime + dTime;

    // Render state kosong jika belum ada perhitungan
    // Render state kosong jika belum ada perhitungan
  if (direct === 0) { // Cukup cek direct-nya saja ndes
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-6 border-2 border-dashed border-gray-200 rounded-xl">
        <Calculator size={48} className="mb-3 opacity-50" />
        <p className="text-sm text-center">Masukkan lokasi tujuan untuk melihat estimasi ongkir.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden flex flex-col">
      {/* Header Rincian & Badge Waktu Tetap Sama */}
      <div className="bg-slate-50 border-b border-gray-100 p-4 flex justify-between items-center text-left">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <Wallet size={18} className="text-slate-600" /> Rincian Biaya
        </h3>
        {totalTime > 0 && (
          <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 animate-pulse">
            <Clock size={12} /> ±{totalTime} MENIT
          </div>
        )}
      </div>

      <div className="p-4 space-y-4 text-left">
        {/* Notifikasi Searah */}
        {hasStore && !isOpposite && (
          <div className="bg-green-50 text-green-700 p-2 rounded-lg text-[10px] font-bold border border-green-100 flex items-center gap-2">
            <PackageCheck size={14} /> JALUR SEARAH! BIAYA AMBIL BARANG GRATIS.
          </div>
        )}

        {/* BIAYA JEMPUT (Hanya tampil kalau Berlawanan) */}
        {hasStore && isOpposite && (
          <div className="flex justify-between items-center">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                <MapPin size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Tambahan Jemput</p>
                <p className="text-xs text-gray-500">{pickup.toFixed(1)} km x Rp 1.000/km</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-gray-800">{formatRupiah(pickupCost)}</span>
          </div>
        )}

        {/* ONGKIR ANTAR (Dinamis sesuai logika) */}
        <div className="flex justify-between items-center">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Truck size={16} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{labelAntar}</p>
              <p className="text-xs text-gray-500">{jarakAntar.toFixed(1)} km x Rp 2.000/km</p>
            </div>
          </div>
          <span className="text-sm font-semibold text-gray-800">{formatRupiah(deliveryCost)}</span>
        </div>

        {/* Fee Jastip & Total Tetap Sama */}
        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <Calculator size={16} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Fee Jasa Titip</p>
              <span className="text-[10px] text-gray-400 line-through decoration-red-400 block">{formatRupiah(5000)}</span>
            </div>
          </div>
          <span className="text-sm font-semibold text-purple-600">{formatRupiah(PRICING_CONFIG.FIXED_JASTIP_FEE)}</span>
        </div>

        <div className="flex justify-between items-center pt-2">
          <div>
            <p className="text-base font-bold text-gray-900">Total Ongkir</p>
            <p className="text-[10px] text-gray-400 italic">*Belum termasuk harga barang</p>
          </div>
          <p className="text-xl font-black text-blue-600">{formatRupiah(totalCost)}</p>
        </div>
      </div>
    </div>
  );
}
// src/pages/DetailMenu.jsx
import React, {useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DUMMY_MENU } from '../utils/dataDummy';
import { ArrowLeft, MapPin, Clock, ShoppingCart, X, ZoomIn } from 'lucide-react';

export default function DetailMenu() {
  const { id } = useParams(); // Ambil ID dari URL
  const navigate = useNavigate();
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  // Di dalam function DetailMenu
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [extraMenu, setExtraMenu] = useState(""); // Buat menu tambahan dari daftar toko

  const handleOrderWA = () => {
  const phoneNumber = "62895379007437"; // No WA Truken
  const message = `Halo Truken! %0A%0ASaya mau pesan Jastip *${produk.nama}* %0A%0A*Dengan Menu:*%0A${extraMenu || "-"}%0A%0A*Catatan Khusus:*%0A${note || "-"}%0A%0A*Lokasi Warung:* ${produk.lokasi}%0A---------------------------%0A*Mohon diproses yaaa*`;

  window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  // Cari data yang ID-nya cocok dengan ID di URL
  const produk = DUMMY_MENU.find((item) => item.id === parseInt(id));

  if (!produk) return <div>Menu tidak ditemukan!</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Tombol Back Melayang */}
      <button 
        onClick={() => navigate('/menu')}
        className="fixed top-4 left-4 z-20 bg-white/80 backdrop-blur p-2 rounded-full shadow-md"
      >
        <ArrowLeft size={24} />
      </button>

      {/* Hero Image */}
      <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar h-80 bg-gray-200">
        {produk.galeri.map((foto, index) => (
          <div key={index} className="flex-none w-full h-full snap-center">
            <img 
              src={foto} 
              alt={`${produk.nama} ${index + 1}`} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Indikator Galeri (Opsional - Biar user tahu bisa digeser) */}
      <div className="flex justify-center gap-1.5 -mt-6 relative z-20">
        {produk.galeri.map((_, index) => (
          <div key={index} className="w-1.5 h-1.5 rounded-full bg-amber-600 shadow-sm"></div>
        ))}
      </div>

      {/* Konten Detail */}
      <div className="p-6 mt-5 bg-white rounded-t-[32px] relative z-10 ">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-2xl font-black text-slate-800 flex-1">{produk.nama}</h1>
          <span className="text-lg font-black text-blue-600">{produk.harga}</span>
        </div>

        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
            <MapPin size={16} className="text-red-500" /> {produk.lokasi}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h2 className="text-sm font-black text-slate-800 uppercase mb-2 tracking-widest">Tentang Makanan Ini</h2>
          <p className="text-gray-600 leading-relaxed text-sm">{produk.deskripsi}</p>
        </div>

        {/* Tombol Aksi */}
        <div className="fixed bottom-6 left-0 right-0 px-4 z-50">
          <div className="bg-slate-900 p-2 rounded-[28px] shadow-2xl flex items-center gap-3 border border-white/10 backdrop-blur-md">
            {/* WADAH FOTO MENU TOKO DENGAN LABEL */}
            <div className="relative flex-none group">
              <button 
                onClick={() => setSelectedImg(produk.menu_toko)}
                className="h-14 w-14 rounded-2xl overflow-hidden border-2 border-blue-500/50 shadow-lg shadow-blue-500/20 active:scale-90 transition-all overflow-hidden relative"
              >
                <img src={produk.menu_toko} className="w-full h-full object-cover brightness-75 group-hover:brightness-100 transition-all" />
                
                {/* Overlay Tulisan MENU */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <span className="text-[9px] font-black text-white tracking-tighter leading-none text-center">
                    LIHAT<br/>MENU
                  </span>
                </div>
              </button>
              
              {/* Label Penjelas di Atas (Tooltip-ish) */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-[8px] font-bold px-2 py-0.5 rounded-md text-white whitespace-nowrap animate-bounce shadow-lg">
                Klik Daftar Menu
              </div>
            </div>

            {/* TOMBOL UTAMA */}
            {/* UPDATE TOMBOL UTAMA DI ACTION BAR */}
              <button 
                onClick={() => setShowOrderModal(true)} // Buka modal dulu
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
              >
                <ShoppingCart size={16} strokeWidth={3} />
                PESAN JASTIP SEKARANG
              </button>
          </div>
        </div>
      </div>


      {selectedImg && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl transition-all">
          <button 
            onClick={() => setSelectedImg(null)}
            className="absolute top-6 right-6 bg-white/20 p-2 rounded-full text-white"
          >
            <X size={24} />
          </button>
          <img 
            src={selectedImg} 
            className="w-full max-h-[80vh] object-contain rounded-xl shadow-2xl" 
            alt="Zoom View" 
          />
        </div>
      )}

      {/* MODAL ORDER */}
       {/* MODAL ORDER */}
      {showOrderModal && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-t-[32px] sm:rounded-3xl p-8 max-h-[90vh] overflow-y-auto no-scrollbar animate-in slide-in-from-bottom duration-300">
            
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-black text-slate-800">Detail Pesanan</h2>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{produk.nama}</p>
              </div>
              <button onClick={() => setShowOrderModal(false)} className="p-2 bg-gray-100 rounded-full"><X size={20}/></button>
            </div>

            {/* 2. INPUT MENU TAMBAHAN (BARU!) */}
            <div className="mb-6">
              <label className="text-[10px] font-black text-gray-800 uppercase tracking-widest block mb-3">Pesan Menu (Sesuai Daftar Menu)</label>
              <textarea 
                value={extraMenu}
                onChange={(e) => setExtraMenu(e.target.value)}
                placeholder="Contoh: Nasi Putih 2, Es Teh Manis 1, Kerupuk 3..."
                className="w-full bg-gray-50 border border-gray-500 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
              />
              <p className="text-[9px] text-gray-800 mt-2 font-medium italic">*Lihat foto daftar menu di pojok kiri bawah tombol pesan </p>
            </div>

            {/* 3. INPUT CATATAN */}
            <div className="mb-8">
              <label className="text-[10px] font-black text-gray-800 uppercase tracking-widest block mb-3">Catatan Tambahan</label>
              <input 
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Contoh: Gak pake seledri, sambal pisah..."
                className="w-full bg-gray-50 border border-gray-500 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <button 
              onClick={handleOrderWA}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl shadow-green-200 transition-all active:scale-95"
            >
              <ShoppingCart size={20} />
              KIRIM PESANAN KE WA
            </button>
          </div>
        </div>
      )}


    </div>
  );
}
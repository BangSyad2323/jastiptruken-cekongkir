import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Search, Utensils } from 'lucide-react';
import { DUMMY_MENU } from '../utils/dataDummy';

// DATA DUMMY (Gampang ditambahin/diubah)

export default function Menu() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* HEADER */}
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-slate-800" />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-800 leading-none">KATALOG MENU</h1>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Truken Jastip Food</p>
          </div>
        </div>
      </div>

      {/* SEARCH BAR (Biar makin pro) */}
      <div className="p-4 max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Mau titip makanan apa hari ini?"
            className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          />
        </div>
      </div>

      {/* KONTEN MENU */}
      <div className="px-4 max-w-md mx-auto space-y-4">
        {DUMMY_MENU.map((item) => (
          <div 
            key={item.id} 
            className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group active:scale-[0.98] transition-transform"
          >
            {/* Foto Makanan */}
            <div className="relative h-48 w-full overflow-hidden">
              <img 
                src={item.galeri[0]} 
                alt={item.nama}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-sm">
                <span className="text-xs font-black text-blue-600">{item.harga}</span>
              </div>
            </div>

            {/* Detail Makanan */}
            <div className="p-4">
              <h3 className="text-lg font-black text-slate-800 mb-1">{item.nama}</h3>
              <div className="flex items-center gap-1.5 text-gray-500 mb-4">
                <MapPin size={14} className="text-red-500" />
                <span className="text-xs font-medium">{item.lokasi}</span>
              </div>
              
              {/* // Di dalam Menu.jsx (bagian button) */}
                <button 
                onClick={() => navigate(`/menu/${item.id}`)}
                className="w-full py-3 bg-amber-700 text-white rounded-xl font-bold text-xs"
                >
                LIHAT DETAIL & PESAN
                </button>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER NOTE */}
      <div className="mt-8 text-center px-8 pb-10">
        <p className="text-xs text-gray-400 font-medium">
          Gak nemu yang dicari? Langsung chat ajah
        </p>
      </div>
    </div>
  );
}
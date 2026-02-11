
import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { Icons } from '../constants';

interface Props {
  categories: string[];
  items: InventoryItem[];
  sheetUrl: string;
  bridgeUrl?: string;
  onUpdateSheetUrl: (url: string) => void;
  onUpdateBridgeUrl: (url: string) => void;
  onAddCategory: (name: string) => void;
  onEditCategory: (oldName: string, newName: string) => void;
  onDeleteCategory: (name: string) => void;
}

const SettingsView: React.FC<Props> = ({ 
  categories, 
  items, 
  sheetUrl,
  bridgeUrl = '',
  onUpdateSheetUrl,
  onUpdateBridgeUrl,
  onAddCategory, 
  onEditCategory, 
  onDeleteCategory 
}) => {
  const [newCategory, setNewCategory] = useState('');
  const [inputSheetUrl, setInputSheetUrl] = useState(sheetUrl);
  const [inputBridgeUrl, setInputBridgeUrl] = useState(bridgeUrl);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const getUsageCount = (cat: string) => items.filter(i => i.category === cat).length;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim());
      setNewCategory('');
    }
  };

  const handleClearLocalData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-black text-slate-900">Pengaturan Sistem</h2>
        <p className="text-xs text-slate-500">Konfigurasi database dan kelola preferensi aplikasi.</p>
      </div>

      {/* Database Connection Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className={`p-4 border-b border-slate-50 text-white ${sheetUrl ? 'bg-green-600' : 'bg-indigo-600'}`}>
          <h3 className="text-sm font-bold flex items-center gap-2">
            <span className="text-lg">{sheetUrl ? '✅' : '🛠️'}</span> 
            {sheetUrl ? 'Database Terhubung' : 'Setup Database Mandiri'}
          </h3>
          <p className="text-[10px] opacity-80 mt-1">
            {sheetUrl ? 'Aplikasi sedang mensinkronkan data dengan Google Sheets Anda secara real-time.' : 'Hubungkan ke Google Drive Anda agar data bisa diakses oleh seluruh tim.'}
          </p>
        </div>
        
        <div className="p-4 space-y-5">
          {/* Step 1: Read */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">1</span>
              <label className="text-[10px] font-black text-slate-600 uppercase">Google Sheet URL (Read)</label>
            </div>
            <div className="flex gap-2 px-7">
              <input 
                type="text"
                placeholder="Link Publish to Web (CSV)..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-[10px] focus:ring-2 focus:ring-indigo-500 outline-none"
                value={inputSheetUrl}
                onChange={(e) => setInputSheetUrl(e.target.value)}
              />
              <button 
                onClick={() => onUpdateSheetUrl(inputSheetUrl)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-[10px] font-bold active:scale-95"
              >
                Simpan
              </button>
            </div>
          </div>

          {/* Step 2: Write */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">2</span>
              <label className="text-[10px] font-black text-slate-600 uppercase">Cloud Bridge API (Write)</label>
            </div>
            <div className="flex gap-2 px-7">
              <input 
                type="text"
                placeholder="URL Google Apps Script..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-[10px] focus:ring-2 focus:ring-indigo-500 outline-none"
                value={inputBridgeUrl}
                onChange={(e) => setInputBridgeUrl(e.target.value)}
              />
              <button 
                onClick={() => onUpdateBridgeUrl(inputBridgeUrl)}
                className="bg-purple-600 text-white px-4 py-2 rounded-xl text-[10px] font-bold active:scale-95"
              >
                Aktifkan
              </button>
            </div>
          </div>
          
          {!sheetUrl && (
            <div className="mx-7 p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-center gap-3 animate-pulse">
              <span className="text-xl">💡</span>
              <p className="text-[10px] text-amber-700 leading-tight font-medium">
                <b>Mode Lokal Aktif:</b> Data tersimpan di HP ini. Gunakan fitur di atas jika Anda ingin berbagi data dengan tim.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Category Management */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-50 bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span className="text-lg">🏷️</span> Daftar Kategori
          </h3>
        </div>
        
        <div className="p-4 space-y-4">
          <form onSubmit={handleAdd} className="flex gap-2">
            <input 
              type="text" 
              placeholder="Kategori baru..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button type="submit" className="bg-slate-900 text-white p-2.5 rounded-xl"><Icons.Plus /></button>
          </form>

          <div className="grid grid-cols-1 gap-2">
            {categories.map((cat) => (
              <div key={cat} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-sm font-semibold text-slate-700">{cat}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded-lg border border-slate-100">{getUsageCount(cat)} Item</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reset Section for Buyers */}
      <div className="bg-red-50/50 rounded-2xl border border-red-100 p-4 space-y-3">
        <h3 className="text-xs font-bold text-red-800 uppercase tracking-wider">Zona Bahaya</h3>
        <p className="text-[10px] text-red-600 leading-tight">Gunakan fitur ini jika Anda ingin menghapus semua data demo dan memulai inventaris baru untuk bisnis Anda.</p>
        
        {!showConfirmClear ? (
          <button 
            onClick={() => setShowConfirmClear(true)}
            className="w-full py-2 border border-red-200 text-red-600 text-[10px] font-black uppercase rounded-xl hover:bg-red-50 transition-colors"
          >
            Hapus Semua Data & Mulai Baru
          </button>
        ) : (
          <div className="flex gap-2">
            <button 
              onClick={handleClearLocalData}
              className="flex-1 py-2 bg-red-600 text-white text-[10px] font-black uppercase rounded-xl shadow-lg"
            >
              YA, HAPUS SEKARANG
            </button>
            <button 
              onClick={() => setShowConfirmClear(false)}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-[10px] font-black uppercase rounded-xl"
            >
              BATAL
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsView;

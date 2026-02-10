
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
  const [editingCategory, setEditingCategory] = useState<{old: string, new: string} | null>(null);
  const [inputSheetUrl, setInputSheetUrl] = useState(sheetUrl);
  const [inputBridgeUrl, setInputBridgeUrl] = useState(bridgeUrl);

  const getUsageCount = (cat: string) => items.filter(i => i.category === cat).length;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim());
      setNewCategory('');
    }
  };

  const handleSaveEdit = () => {
    if (editingCategory && editingCategory.new.trim() && editingCategory.new !== editingCategory.old) {
      onEditCategory(editingCategory.old, editingCategory.new.trim());
    }
    setEditingCategory(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-black text-slate-900">Pengaturan Sistem</h2>
        <p className="text-xs text-slate-500">Konfigurasi database Cloud untuk penyimpanan permanen.</p>
      </div>

      {/* Database Connection Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-50 bg-indigo-600 text-white">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <span className="text-lg">🛠️</span> Setup Database Mandiri
          </h3>
          <p className="text-[10px] opacity-80 mt-1">Ikuti langkah ini agar data Anda tersimpan selamanya di Google Drive Anda sendiri.</p>
        </div>
        
        <div className="p-4 space-y-5">
          {/* Step 1: Read */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">1</span>
              <label className="text-[10px] font-black text-slate-600 uppercase">Hubungkan Database (Baca)</label>
            </div>
            <p className="text-[9px] text-slate-400 italic px-7">Gunakan menu 'File' > 'Share' > 'Publish to Web' (CSV) di Google Sheet Anda.</p>
            <div className="flex gap-2 px-7">
              <input 
                type="text"
                placeholder="Paste URL Google Sheets (CSV) Anda di sini..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-[10px] focus:ring-2 focus:ring-indigo-500 outline-none"
                value={inputSheetUrl}
                onChange={(e) => setInputSheetUrl(e.target.value)}
              />
              <button 
                onClick={() => onUpdateSheetUrl(inputSheetUrl)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-[10px] font-bold active:scale-95"
              >
                Hubungkan
              </button>
            </div>
          </div>

          {/* Step 2: Write */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">2</span>
              <label className="text-[10px] font-black text-slate-600 uppercase">Aktivasi Fitur Tulis (Write)</label>
            </div>
            <p className="text-[9px] text-slate-400 italic px-7">Masukkan URL Google Apps Script 'Bridge API' untuk izin mengubah data stok.</p>
            <div className="flex gap-2 px-7">
              <input 
                type="text"
                placeholder="https://script.google.com/macros/s/.../exec"
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
            <div className="mx-7 p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-center gap-3">
              <span className="text-xl">💡</span>
              <p className="text-[10px] text-amber-700 leading-tight font-medium">
                Aplikasi saat ini berjalan dalam <b>Mode Offline/Lokal</b>. Data hanya tersimpan di HP/Browser ini. Hubungkan ke Cloud agar bisa diakses tim.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Category Management */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-50 bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span className="text-lg">🏷️</span> Daftar Kategori Produk
          </h3>
        </div>
        
        <div className="p-4 space-y-4">
          <form onSubmit={handleAdd} className="flex gap-2">
            <input 
              type="text" 
              placeholder="Contoh: Frozen Food, Elektronik..."
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
                <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded-lg border border-slate-100">{getUsageCount(cat)} Item</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;

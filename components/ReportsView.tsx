
import React from 'react';
import { InventoryItem, StockLog } from '../types';

interface Props {
  items: InventoryItem[];
  logs: StockLog[];
}

const ReportsView: React.FC<Props> = ({ items, logs }) => {
  const totalValue = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalItems = items.length;
  const criticalItems = items.filter(i => i.quantity <= i.reorderLevel * 0.5).length;
  
  // Hitung nilai per kategori
  const categories = Array.from(new Set(items.map(i => i.category)));
  const categoryStats = categories.map(cat => {
    const catItems = items.filter(i => i.category === cat);
    const value = catItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    return { name: cat, count: catItems.length, value };
  }).sort((a, b) => b.value - a.value);

  const maxValue = Math.max(...categoryStats.map(s => s.value), 1);

  const handleExportCSV = () => {
    const headers = ["Nama Produk", "SKU", "Kategori", "Stok", "Harga Satuan", "Total Nilai", "Pemasok"];
    const rows = items.map(i => [
      i.name,
      i.sku,
      i.category,
      i.quantity,
      i.price,
      i.price * i.quantity,
      i.supplier
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Laporan_Inventaris_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black text-slate-900">Laporan Bisnis</h2>
        <button 
          onClick={handleExportCSV}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-95"
        >
          <span>📥</span> Ekspor CSV
        </button>
      </div>

      {/* Grid Ringkasan */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total Aset</p>
          <p className="text-lg font-black text-slate-900">Rp{totalValue.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Kesehatan Stok</p>
          <p className="text-lg font-black text-green-600">{((totalItems - criticalItems) / totalItems * 100).toFixed(0)}% Aman</p>
        </div>
      </div>

      {/* Grafik Batang Kustom: Nilai Per Kategori */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-6 flex justify-between items-center">
          Visualisasi Nilai Aset
          <span className="text-[10px] font-medium text-slate-400 px-2 py-0.5 bg-slate-50 rounded-lg">Berdasarkan Kategori</span>
        </h3>
        
        <div className="space-y-5">
          {categoryStats.map((stat, idx) => (
            <div key={stat.name} className="group">
              <div className="flex justify-between items-end mb-1.5">
                <span className="text-xs font-bold text-slate-700">{stat.name}</span>
                <span className="text-[11px] font-black text-indigo-600">Rp{stat.value.toLocaleString('id-ID')}</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out group-hover:from-indigo-400 group-hover:to-purple-400"
                  style={{ width: `${(stat.value / maxValue) * 100}%`, transitionDelay: `${idx * 100}ms` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Distribusi Kategori (Tabel) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-50">
          <h3 className="text-sm font-bold text-slate-800">Detail Distribusi</h3>
        </div>
        <table className="w-full text-xs">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-2 text-left font-bold text-slate-500">Kategori</th>
              <th className="px-4 py-2 text-center font-bold text-slate-500">Item</th>
              <th className="px-4 py-2 text-right font-bold text-slate-500">Nilai</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {categoryStats.map(stat => (
              <tr key={stat.name} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-medium">{stat.name}</td>
                <td className="px-4 py-3 text-center text-slate-600">{stat.count}</td>
                <td className="px-4 py-3 text-right font-bold">Rp{stat.value.toLocaleString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Log Aktivitas Global */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-800">Riwayat Aktivitas Terbaru</h3>
        <div className="space-y-2">
          {logs.length > 0 ? logs.slice(-10).reverse().map(log => (
            <div key={log.id} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center hover:border-indigo-100 transition-colors">
              <div className="flex gap-3 items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${log.change > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {log.change > 0 ? '↑' : '↓'}
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-[11px]">{log.itemName}</p>
                  <p className="text-slate-400 text-[9px] uppercase">{log.reason} • {log.user}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-black text-xs ${log.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {log.change > 0 ? '+' : ''}{log.change}
                </p>
                <p className="text-slate-300 text-[8px]">{new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          )) : (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400 text-xs italic">Belum ada riwayat aktivitas log.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsView;

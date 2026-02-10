
import React, { useEffect, useState } from 'react';
import { InventoryItem, UserRole } from '../types';
import { getInventoryInsights } from '../services/geminiService';

interface Props {
  items: InventoryItem[];
  userRole: UserRole;
}

const Dashboard: React.FC<Props> = ({ items, userRole }) => {
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const isManager = userRole === UserRole.MANAGER;

  const totalValue = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const lowStockCount = items.filter(item => item.quantity <= item.reorderLevel).length;
  const criticalStockCount = items.filter(item => item.quantity <= item.reorderLevel * 0.5).length;

  const categories = Array.from(new Set(items.map(i => i.category)));
  const categoryStats = categories.map(cat => {
    const catItems = items.filter(i => i.category === cat);
    const value = catItems.reduce((acc, i) => acc + (i.price * i.quantity), 0);
    return { name: cat, value };
  }).sort((a, b) => b.value - a.value);

  const maxValue = Math.max(...categoryStats.map(s => s.value), 1);

  const handleGetInsight = async () => {
    setIsGenerating(true);
    const insight = await getInventoryInsights(items);
    setAiInsight(insight || "Tidak ada wawasan tersedia.");
    setIsGenerating(false);
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Kartu Metrik Utama */}
      <div className={`grid gap-3 ${isManager ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
        {isManager && (
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-center">
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Total Nilai Aset</p>
            <p className="text-xl font-black text-slate-900">Rp{totalValue.toLocaleString('id-ID')}</p>
          </div>
        )}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Status Kesehatan Stok</p>
          <div className="flex items-end gap-2">
            <p className="text-2xl font-black text-amber-500">{lowStockCount}</p>
            <p className="text-[10px] text-slate-400 font-medium mb-1.5 uppercase">Rendah</p>
            <p className="text-2xl font-black text-red-500 ml-2">{criticalStockCount}</p>
            <p className="text-[10px] text-slate-400 font-medium mb-1.5 uppercase">Kritis</p>
          </div>
        </div>
      </div>

      {/* Visualisasi Nilai Per Kategori - Hanya Manajer */}
      {isManager && (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Rincian Nilai per Kategori</h3>
          <div className="space-y-4">
            {categoryStats.slice(0, 3).map((stat) => (
              <div key={stat.name} className="space-y-1.5">
                <div className="flex justify-between items-center text-[11px] font-bold">
                  <span className="text-slate-600">{stat.name}</span>
                  <span className="text-slate-900">Rp{stat.value.toLocaleString('id-ID')}</span>
                </div>
                <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${(stat.value / maxValue) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Asisten AI */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-5 rounded-xl text-white shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold flex items-center gap-2 text-sm">
              <span className="bg-white/20 p-1 rounded">✨</span>
              Analisis Stok AI
            </h3>
            <button 
              onClick={handleGetInsight}
              disabled={isGenerating}
              className="text-[10px] font-bold uppercase tracking-wider bg-white/20 hover:bg-white/30 transition-colors px-3 py-1.5 rounded-lg border border-white/30"
            >
              {isGenerating ? 'Menganalisis...' : 'Mulai Analisis'}
            </button>
          </div>
          {aiInsight ? (
            <div className="text-xs text-indigo-50 leading-relaxed space-y-2 prose-invert prose-p:m-0">
              {aiInsight.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          ) : (
            <p className="text-xs text-indigo-100">AI akan menganalisis stok kritis dan memberikan saran restok tanpa menampilkan data finansial sensitif.</p>
          )}
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
      </div>
    </div>
  );
};

export default Dashboard;

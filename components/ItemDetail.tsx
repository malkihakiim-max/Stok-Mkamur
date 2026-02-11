
import React, { useState } from 'react';
import { InventoryItem, UserRole, StockLog } from '../types';
import { Icons } from '../constants';

interface Props {
  item: InventoryItem;
  logs: StockLog[];
  userRole: UserRole;
  onClose: () => void;
  onRestock: (quantity: number, reason: string) => void;
}

const ItemDetail: React.FC<Props> = ({ item, logs, userRole, onClose, onRestock }) => {
  const [adjustAmount, setAdjustAmount] = useState<number>(0);
  const [reason, setReason] = useState<string>('Pembaruan Stok');
  const [showRestockForm, setShowRestockForm] = useState(false);

  const itemLogs = logs.filter(l => l.itemId === item.id).reverse();
  const isManager = userRole === UserRole.MANAGER;

  const handleOrderMore = () => {
    const subject = `Permintaan Pesanan: ${item.name} (${item.sku})`;
    const body = `Halo ${item.supplier},\n\nKami ingin mengajukan permintaan restok untuk ${item.name}.\nSKU: ${item.sku}\nJumlah yang diinginkan: [Isi jumlah]\n\nMohon informasikan tanggal pengiriman tercepat.\n\nSalam,\nTim Gudang ${userRole}`;
    window.location.href = `mailto:${item.supplierEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-xl rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{item.name}</h2>
            <p className="text-sm text-slate-500 uppercase font-mono tracking-wider">{item.sku} • {item.category}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-6">
          {/* Main Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl flex flex-col justify-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Stok Saat Ini</p>
              <p className={`text-2xl font-black ${item.quantity <= item.reorderLevel ? 'text-amber-600' : 'text-slate-800'}`}>
                {item.quantity} unit
              </p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-2xl">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Tempat Simpan</p>
              <p className="text-lg font-black text-indigo-600">{item.location || '-'}</p>
            </div>
          </div>

          {/* Operational Details */}
          <div className="grid grid-cols-2 gap-3">
             <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Kondisi Barang</p>
                <p className="text-xs font-bold text-slate-700">{item.condition || '-'}</p>
             </div>
             <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Penanggung Jawab</p>
                <p className="text-xs font-bold text-slate-700">{item.responsiblePerson || '-'}</p>
             </div>
          </div>

          {isManager && (
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Harga Satuan</p>
                  <p className="text-sm font-bold text-slate-800">Rp{item.price.toLocaleString('id-ID')}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Nilai</p>
                  <p className="text-sm font-bold text-slate-800">Rp{(item.price * item.quantity).toLocaleString('id-ID')}</p>
                </div>
            </div>
          )}

          {/* Supplier Info */}
          <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
            <h3 className="text-sm font-bold text-indigo-900 mb-2 flex items-center gap-2">
              <Icons.Warehouse /> Info Pemasok
            </h3>
            <p className="text-sm font-semibold text-indigo-800">{item.supplier}</p>
            <p className="text-xs text-indigo-600 mb-3">{item.supplierEmail}</p>
            <button 
              onClick={handleOrderMore}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-md transition-all active:scale-95"
            >
              Minta Restok via Email
            </button>
          </div>

          {/* Restock Form Section */}
          <div className="border-t border-slate-100 pt-4">
            {!showRestockForm ? (
              <button 
                onClick={() => setShowRestockForm(true)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Icons.Plus /> Update Jumlah Stok
              </button>
            ) : (
              <div className="bg-white border border-slate-200 p-4 rounded-2xl space-y-3">
                <h4 className="font-bold text-slate-800 text-sm">Pembaruan Cepat</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Input (+ / -)</label>
                    <input 
                      type="number" 
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                      value={adjustAmount}
                      onChange={(e) => setAdjustAmount(parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Alasan</label>
                    <select 
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    >
                      <option value="Restok">Restok Masuk</option>
                      <option value="Terjual">Barang Keluar</option>
                      <option value="Rusak">Rusak / Hilang</option>
                      <option value="Audit">Penyesuaian Audit</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      onRestock(adjustAmount, reason);
                      setAdjustAmount(0);
                      setShowRestockForm(false);
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all"
                  >
                    Simpan Perubahan
                  </button>
                  <button 
                    onClick={() => setShowRestockForm(false)}
                    className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* History Log */}
          <div className="space-y-3 pb-8">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Icons.History /> Riwayat Stok Terbaru
            </h3>
            <div className="space-y-2">
              {itemLogs.length > 0 ? (
                itemLogs.map(log => (
                  <div key={log.id} className="text-xs bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-slate-700">{log.reason}</p>
                      <p className="text-slate-400 text-[10px]">{new Date(log.timestamp).toLocaleString('id-ID')}</p>
                      <p className="text-slate-400 text-[10px]">Oleh {log.user}</p>
                    </div>
                    <div className={`font-black text-sm ${log.change > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {log.change > 0 ? '+' : ''}{log.change}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">Belum ada riwayat stok.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;

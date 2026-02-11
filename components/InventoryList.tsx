
import React from 'react';
import { InventoryItem, StockStatus, UserRole } from '../types';
import { Icons } from '../constants';

interface Props {
  items: InventoryItem[];
  categories: string[];
  userRole: UserRole;
  onSelectItem: (item: InventoryItem) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeFilter: string;
  setActiveFilter: (f: string) => void;
}

const InventoryList: React.FC<Props> = ({ 
  items, 
  categories,
  userRole,
  onSelectItem, 
  searchQuery, 
  setSearchQuery,
  activeFilter,
  setActiveFilter
}) => {
  const isManager = userRole === UserRole.MANAGER;

  const getStatus = (item: InventoryItem): StockStatus => {
    if (item.quantity <= item.reorderLevel * 0.5) return StockStatus.CRITICAL;
    if (item.quantity <= item.reorderLevel) return StockStatus.LOW;
    return StockStatus.HEALTHY;
  };

  const getStatusBadge = (status: StockStatus) => {
    switch (status) {
      case StockStatus.CRITICAL:
        return <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-100 text-red-600 border border-red-200 uppercase whitespace-nowrap">Kritis</span>;
      case StockStatus.LOW:
        return <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-600 border border-amber-200 uppercase whitespace-nowrap">Rendah</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-green-100 text-green-600 border border-green-200 uppercase whitespace-nowrap">Aman</span>;
    }
  };

  const filterOptions = ['Semua', 'Stok Rendah', ...categories.filter(c => c !== 'Semua')];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'Semua' || item.category === activeFilter || 
                         (activeFilter === 'Stok Rendah' && item.quantity <= item.reorderLevel);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icons.Search />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
            placeholder="Cari nama produk atau SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {filterOptions.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                activeFilter === filter 
                ? 'bg-indigo-600 text-white border-indigo-600' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="min-w-full divide-y divide-slate-100">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider sticky left-0 bg-slate-50 z-10">Produk</th>
                <th className="px-3 py-3 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">Stok</th>
                <th className="px-3 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lokasi</th>
                <th className="px-3 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kondisi</th>
                <th className="px-3 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">PIC</th>
                {isManager && <th className="px-4 py-3 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider">Harga</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map(item => (
                <tr 
                  key={item.id} 
                  onClick={() => onSelectItem(item)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 sticky left-0 bg-white hover:bg-slate-50 z-10">
                    <div className="flex flex-col min-w-[120px]">
                      <span className="text-sm font-semibold text-slate-900">{item.name}</span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-tight">{item.sku}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-sm font-bold text-slate-700">{item.quantity}</span>
                      {getStatusBadge(getStatus(item))}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-left">
                    <span className="text-[11px] font-medium text-slate-600 whitespace-nowrap bg-slate-100 px-1.5 py-0.5 rounded">{item.location}</span>
                  </td>
                  <td className="px-3 py-3 text-left">
                    <span className="text-[11px] text-slate-500 whitespace-nowrap">{item.condition}</span>
                  </td>
                  <td className="px-3 py-3 text-left">
                    <span className="text-[11px] font-bold text-indigo-600 whitespace-nowrap">{item.responsiblePerson}</span>
                  </td>
                  {isManager && (
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-medium text-slate-600 whitespace-nowrap">Rp{item.price.toLocaleString('id-ID')}</span>
                    </td>
                  )}
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={isManager ? 6 : 5} className="px-4 py-10 text-center text-slate-400 text-sm italic">
                    Produk tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-2 bg-slate-50 border-t border-slate-100 text-center md:hidden">
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Geser tabel untuk info lengkap →</p>
        </div>
      </div>
    </div>
  );
};

export default InventoryList;

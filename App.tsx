
import React, { useState, useEffect } from 'react';
import { InventoryItem, StockLog, UserRole } from './types';
import { INITIAL_DATA } from './constants';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import InventoryList from './components/InventoryList';
import ItemDetail from './components/ItemDetail';
import ReportsView from './components/ReportsView';
import SettingsView from './components/SettingsView';
import { sendSlackNotification } from './services/slackService';
import { fetchSheetData, updateSheetData } from './services/sheetService';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserRole>(UserRole.MANAGER);
  const [activeTab, setActiveTab] = useState('inventory');
  
  const [items, setItems] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('stok_makmur_items');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('stok_makmur_categories');
    return saved ? JSON.parse(saved) : [];
  });

  const [logs, setLogs] = useState<StockLog[]>(() => {
    const saved = localStorage.getItem('stok_makmur_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSlackToast, setShowSlackToast] = useState(false);
  
  const [sheetUrl, setSheetUrl] = useState<string>(localStorage.getItem('stok_makmur_sheet_url') || '');
  const [bridgeUrl, setBridgeUrl] = useState<string>(localStorage.getItem('stok_makmur_bridge_url') || '');

  // Simpan data ke local storage SETIAP ada perubahan
  useEffect(() => {
    localStorage.setItem('stok_makmur_items', JSON.stringify(items));
    localStorage.setItem('stok_makmur_categories', JSON.stringify(categories));
    localStorage.setItem('stok_makmur_logs', JSON.stringify(logs));
  }, [items, categories, logs]);

  const loadData = async (url?: string) => {
    const targetUrl = url || sheetUrl;
    if (!targetUrl) {
      // Jika tidak ada URL, pastikan ada data awal untuk dilihat pengguna baru
      if (items.length === 0) {
        setItems(INITIAL_DATA);
        setCategories(Array.from(new Set(INITIAL_DATA.map(i => i.category))));
      }
      return;
    }

    setIsSyncing(true);
    setError(null);
    
    try {
      const remoteData = await fetchSheetData(targetUrl);
      if (remoteData && remoteData.length > 0) {
        setItems(remoteData);
        const remoteCategories = Array.from(new Set(remoteData.map(i => i.category)));
        setCategories(prev => Array.from(new Set([...prev, ...remoteCategories])));
      }
    } catch (err: any) {
      setError(err.message || 'Gagal sinkronisasi Cloud');
      // Jangan hapus data lokal jika sinkronisasi gagal
    } finally {
      setIsSyncing(false);
      setIsLoading(false);
    }
  };

  // Jalankan saat startup
  useEffect(() => {
    if (items.length === 0 || sheetUrl) {
      loadData();
    }
  }, []);

  const handleUpdateSheetUrl = (url: string) => {
    setSheetUrl(url);
    localStorage.setItem('stok_makmur_sheet_url', url);
    loadData(url);
  };

  const handleUpdateBridgeUrl = (url: string) => {
    setBridgeUrl(url);
    localStorage.setItem('stok_makmur_bridge_url', url);
  };

  const handleRestock = async (quantity: number, reason: string) => {
    if (!selectedItem) return;
    const previousQuantity = selectedItem.quantity;
    const newQuantity = previousQuantity + quantity;
    const updatedItem = { ...selectedItem, quantity: newQuantity };
    
    // Update Lokal
    setItems(prev => prev.map(item => item.id === selectedItem.id ? updatedItem : item));
    setSelectedItem(updatedItem);

    // Update Cloud (jika ada)
    if (bridgeUrl) {
      updateSheetData(bridgeUrl, selectedItem.sku, newQuantity);
    }

    // Log Aktivitas (Lokal)
    const userName = currentUser === UserRole.MANAGER ? 'Manajer' : 'Staf Gudang';
    const newLog: StockLog = {
      id: Math.random().toString(36).substr(2, 9),
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      change: quantity,
      previousQuantity,
      newQuantity,
      reason,
      timestamp: new Date().toISOString(),
      user: userName,
      role: currentUser
    };

    setLogs(prev => [...prev, newLog]);

    if (newQuantity <= selectedItem.reorderLevel) {
      sendSlackNotification(updatedItem, userName, currentUser).then(sent => {
        if (sent) {
          setShowSlackToast(true);
          setTimeout(() => setShowSlackToast(false), 3000);
        }
      });
    }
  };

  const handleAddCategory = (name: string) => {
    if (!categories.includes(name)) {
      setCategories(prev => [...prev, name]);
    }
  };

  const handleEditCategory = (oldName: string, newName: string) => {
    setCategories(prev => prev.map(c => c === oldName ? newName : c));
    setItems(prev => prev.map(item => item.category === oldName ? { ...item, category: newName } : item));
  };

  const handleDeleteCategory = (name: string) => {
    setCategories(prev => prev.filter(c => c !== name));
  };

  return (
    <Layout 
      userRole={currentUser} 
      onSwitchUser={setCurrentUser} 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
    >
      {/* Alert Status Koneksi */}
      <div className="flex justify-between items-center mb-4 px-1">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status Database</span>
          <span className={`text-[10px] font-bold flex items-center gap-1 ${sheetUrl ? 'text-green-600' : 'text-amber-500'}`}>
            {sheetUrl ? '● Cloud Linked' : '○ Local Storage'}
          </span>
        </div>
        {sheetUrl && (
          <button 
            onClick={() => loadData()}
            disabled={isSyncing}
            className={`p-1.5 rounded-lg border border-slate-200 bg-white shadow-sm transition-all active:scale-95 ${isSyncing ? 'animate-spin' : ''}`}
          >
            🔄
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-[10px] text-red-600 font-medium">
          <span>⚠️</span> {error}
        </div>
      )}

      {activeTab === 'inventory' ? (
        <>
          <Dashboard items={items} userRole={currentUser} />
          <InventoryList 
            items={items} 
            categories={categories}
            userRole={currentUser}
            onSelectItem={setSelectedItem}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
          />
        </>
      ) : activeTab === 'reports' ? (
        <ReportsView items={items} logs={logs} />
      ) : activeTab === 'settings' ? (
        <SettingsView 
          categories={categories}
          items={items}
          sheetUrl={sheetUrl}
          bridgeUrl={bridgeUrl}
          onUpdateSheetUrl={handleUpdateSheetUrl}
          onUpdateBridgeUrl={handleUpdateBridgeUrl}
          onAddCategory={handleAddCategory}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 opacity-40">
          <span className="text-6xl mb-4">🚚</span>
          <p className="text-sm font-bold uppercase tracking-widest text-center leading-tight">Daftar Pemasok<br/><span className="text-[10px]">Fitur ini segera hadir</span></p>
        </div>
      )}

      {selectedItem && (
        <ItemDetail 
          item={selectedItem}
          logs={logs}
          userRole={currentUser}
          onClose={() => setSelectedItem(null)}
          onRestock={handleRestock}
        />
      )}

      {showSlackToast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[100] bg-slate-900 text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 border border-white/10 animate-in slide-in-from-top duration-300">
          <span className="text-lg">💬</span>
          <span className="text-xs font-bold">Notifikasi Terkirim!</span>
        </div>
      )}
    </Layout>
  );
};

export default App;

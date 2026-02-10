
import React from 'react';
import { UserRole } from '../types';

interface Props {
  children: React.ReactNode;
  userRole: UserRole;
  onSwitchUser: (role: UserRole) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Layout: React.FC<Props> = ({ children, userRole, onSwitchUser, activeTab, onTabChange }) => {
  const isManager = userRole === UserRole.MANAGER;

  return (
    <div className="min-h-screen pb-24 max-w-lg mx-auto bg-slate-50 sm:shadow-xl sm:border-x sm:border-slate-200">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-200">S</div>
          <h1 className="text-lg font-black tracking-tight text-slate-900">Stok<span className="text-indigo-600">Makmur</span></h1>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={userRole}
            onChange={(e) => {
              const newRole = e.target.value as UserRole;
              onSwitchUser(newRole);
              // Jika staf gudang mencoba mengakses tab yang dilarang, pindahkan ke inventory
              if (newRole === UserRole.WAREHOUSE && (activeTab === 'reports' || activeTab === 'settings')) {
                onTabChange('inventory');
              }
            }}
            className="text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-600 px-2 py-1.5 rounded-lg border-none focus:ring-0 cursor-pointer transition-colors hover:bg-slate-200"
          >
            <option value={UserRole.MANAGER}>Manajer</option>
            <option value={UserRole.WAREHOUSE}>Staf Gudang</option>
          </select>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white/90 backdrop-blur-lg border-t border-slate-100 px-6 py-4 flex justify-around items-center shadow-[0_-8px_30px_rgba(0,0,0,0.04)] z-40 rounded-t-3xl">
        <NavItem 
          active={activeTab === 'inventory'} 
          label="Stok" 
          icon="📦" 
          onClick={() => onTabChange('inventory')}
        />
        
        {isManager && (
          <>
            <NavItem 
              active={activeTab === 'reports'} 
              label="Laporan" 
              icon="📊" 
              onClick={() => onTabChange('reports')}
            />
            <NavItem 
              active={activeTab === 'settings'} 
              label="Atur" 
              icon="⚙️" 
              onClick={() => onTabChange('settings')}
            />
          </>
        )}

        <NavItem 
          active={activeTab === 'suppliers'} 
          label="Pemasok" 
          icon="🚚" 
          onClick={() => onTabChange('suppliers')}
        />
      </nav>
    </div>
  );
};

const NavItem = ({ active, label, icon, onClick }: { active?: boolean, label: string, icon: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center gap-1 group relative outline-none min-w-[60px]"
  >
    <span className={`text-xl transition-all duration-300 group-active:scale-75 ${active ? 'scale-110' : 'grayscale opacity-40'}`}>{icon}</span>
    <span className={`text-[9px] font-bold transition-colors ${active ? 'text-indigo-600' : 'text-slate-400'}`}>{label}</span>
    {active && (
      <div className="absolute -bottom-1 w-1 h-1 bg-indigo-600 rounded-full animate-pulse"></div>
    )}
  </button>
);

export default Layout;

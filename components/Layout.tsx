import React from 'react';
import { Tenant, User, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  FileBarChart, 
  LogOut, 
  Languages, 
  Menu, 
  X,
  Settings,
  Calendar,
  Users
} from 'lucide-react';

interface LayoutProps {
  tenant: Tenant;
  user: User;
  children: React.ReactNode;
  currentLang: Language;
  setLanguage: (lang: Language) => void;
  onLogout: () => void;
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({
  tenant,
  user,
  children,
  currentLang,
  setLanguage,
  onLogout,
  currentView,
  setCurrentView
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const t = TRANSLATIONS[currentLang];

  const navItems = [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'schedule', label: t.schedule, icon: Calendar },
    { id: 'attendance', label: t.attendance, icon: ClipboardCheck },
    { id: 'users', label: t.users, icon: Users },
    { id: 'reports', label: t.reports, icon: FileBarChart },
    { id: 'settings', label: t.settings, icon: Settings },
  ];

  const toggleLanguage = () => {
    setLanguage(currentLang === 'en' ? 'so' : 'en');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 text-white transition-colors duration-300" style={{ backgroundColor: tenant.primaryColor }}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden">
            <img src={tenant.logoUrl} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="font-bold text-lg leading-tight">{tenant.name}</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                currentView === item.id 
                  ? 'bg-white/20 font-semibold shadow-inner' 
                  : 'hover:bg-white/10'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/20">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors"
          >
            <LogOut size={20} />
            <span>{t.logout}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-gray-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
            <h2 className="text-xl font-semibold text-gray-800">
              {navItems.find(i => i.id === currentView)?.label}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-medium transition-colors border"
            >
              <Languages size={16} className="text-gray-500" />
              <span className="uppercase text-gray-600">{currentLang}</span>
            </button>
            <div className="flex items-center gap-3 border-l pl-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ').toLowerCase()}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold overflow-hidden border border-gray-300">
                {user.photoUrl ? (
                  <img src={user.photoUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name.charAt(0)
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="absolute inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
            <div 
              className="absolute left-0 top-0 bottom-0 w-64 text-white p-4 flex flex-col"
              style={{ backgroundColor: tenant.primaryColor }}
            >
              <div className="flex justify-between items-center mb-8">
                 <h1 className="font-bold">{tenant.name}</h1>
                 <button onClick={() => setIsMobileMenuOpen(false)}><X /></button>
              </div>
              <nav className="space-y-2 flex-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                      currentView === item.id ? 'bg-white/20' : ''
                    }`}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
               <button 
                onClick={onLogout}
                className="flex items-center gap-3 px-4 py-3 mt-auto"
              >
                <LogOut size={20} />
                <span>{t.logout}</span>
              </button>
            </div>
          </div>
        )}

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-auto p-4 md:p-8 bg-gray-50/50">
          {children}
        </main>
      </div>
    </div>
  );
};
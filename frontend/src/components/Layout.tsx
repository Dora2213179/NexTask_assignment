import { useContext, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, LogOut, Menu, X, Command } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Projects', href: '/projects', icon: FolderKanban },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 z-20 flex items-center px-4">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 -ml-2 text-slate-300">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="ml-4 flex items-center gap-2 text-white font-bold text-xl">
          <Command className="text-indigo-500" /> NexTask
        </div>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-10 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-auto md:h-screen shadow-xl
        ${sidebarOpen ? 'translate-x-0 pt-16 md:pt-0' : '-translate-x-full pt-16 md:pt-0'}
      `}>
        <div className="hidden md:flex h-16 items-center px-6 border-b border-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-2xl tracking-tight">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Command size={20} className="text-white" />
            </div>
            NexTask
          </div>
        </div>
        
        <div className="flex flex-col h-[calc(100vh-4rem)]">
          <div className="flex-1 px-4 py-6 space-y-1">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">Overview</div>
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || (location.pathname.startsWith('/projects') && item.href === '/projects');
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon size={20} className={isActive ? 'text-indigo-200' : 'text-slate-500'} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
          
          <div className="p-4 border-t border-slate-800">
            <div className="mb-4 px-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-lg">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-slate-400 truncate mb-1">{user?.email}</p>
                <span className="inline-block px-1.5 py-0.5 bg-slate-800 border border-slate-700 text-indigo-400 text-[9px] font-bold rounded uppercase tracking-wider">
                  {user?.role?.replace('ROLE_', '')}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
            >
              <LogOut size={18} />
              <span className="font-medium text-sm">Sign out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 pt-16 md:pt-0 h-screen overflow-y-auto">
        <main className="p-6 md:p-8 max-w-[1600px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

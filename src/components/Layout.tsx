import React from 'react';
import { Outlet, NavLink, useLocation, Navigate } from 'react-router-dom';
import { Home, Activity, Users, Bot, User, Map } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAppContext } from '../contexts/AppContext';

export default function Layout() {
  const { mode } = useAppContext();
  const location = useLocation();

  // Protect restricted routes in child mode
  if (mode === 'child' && ['/community', '/simbie', '/guide'].includes(location.pathname)) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans max-w-md mx-auto relative shadow-2xl overflow-hidden">
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 w-full max-w-md bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 pb-6 pt-2 z-50">
        <div className="flex justify-between items-end">
          <NavItem to="/home" icon={<Home className="w-6 h-6" />} label="Inicio" />
          {mode === 'adult' && <NavItem to="/guide" icon={<Map className="w-6 h-6" />} label="Guía" />}
          <NavItem to="/therapy" icon={<Activity className="w-6 h-6" />} label="Terapia" />
          {mode === 'adult' && <NavItem to="/community" icon={<Users className="w-6 h-6" />} label="Comunidad" />}
          {mode === 'adult' && <NavItem to="/simbie" icon={<Bot className="w-6 h-6" />} label="Simbie AI" />}
          <NavItem to="/profile" icon={<User className="w-6 h-6" />} label="Perfil" />
        </div>
      </nav>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex flex-1 flex-col items-center justify-center gap-1 group transition-colors',
          isActive ? 'text-blue-600 dark:text-blue-500' : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-500'
        )
      }
    >
      {({ isActive }) => (
        <>
          <div className={cn('relative p-1 rounded-xl transition-all duration-300', isActive && 'bg-blue-100 dark:bg-blue-900/30')}>
            {icon}
          </div>
          <span className="text-[10px] font-medium">{label}</span>
        </>
      )}
    </NavLink>
  );
}

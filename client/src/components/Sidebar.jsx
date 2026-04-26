import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function NavItem({ to, icon, label, exact }) {
  return (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
          isActive
            ? 'bg-[#D4860B]/20 text-[#F0A830] border border-[#D4860B]/30'
            : 'text-slate-400 hover:text-slate-200 hover:bg-[#21253A]'
        }`
      }
    >
      <span className="text-base">{icon}</span>
      {label}
    </NavLink>
  );
}

function SectionLabel({ label }) {
  return <div className="px-3 pt-4 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-600">{label}</div>;
}

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="w-56 flex-shrink-0 bg-[#0D1018] border-r border-[#2E3349] flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-[#2E3349]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#D4860B] flex items-center justify-center text-white font-bold text-sm">⛏</div>
          <div>
            <div className="font-sora font-bold text-white text-sm leading-tight">Mining Tracker</div>
            <div className="text-[10px] text-slate-500">Advisory & Trading</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5 overflow-y-auto">
        <NavItem to="/" exact icon="◈" label="Dashboard" />

        <SectionLabel label="Trading" />
        <NavItem to="/sources" icon="⛰" label="Sources" />
        <NavItem to="/buyers" icon="🏢" label="Buyers" />
        <NavItem to="/trades" icon="↔" label="Trade Requests" />

        <SectionLabel label="Advisory" />
        <NavItem to="/projects" icon="◉" label="Projects" />

        {user?.role === 'admin' && (
          <>
            <SectionLabel label="Admin" />
            <NavItem to="/team" icon="◎" label="Team" />
          </>
        )}
      </nav>

      {/* User */}
      <div className="px-3 py-3 border-t border-[#2E3349]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#D4860B]/20 border border-[#D4860B]/40 flex items-center justify-center text-[#F0A830] text-xs font-bold">
            {user?.name?.[0] || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-slate-200 truncate">{user?.name}</div>
            <div className="text-[10px] text-slate-500 capitalize">{user?.role}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

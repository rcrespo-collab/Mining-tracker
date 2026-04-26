import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header({ title, actions }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-[#2E3349] bg-[#0F1117] flex-shrink-0">
      <h1 className="font-sora font-semibold text-white text-lg">{title}</h1>
      <div className="flex items-center gap-3">
        {actions}
        <div className="flex items-center gap-2 pl-3 border-l border-[#2E3349]">
          <span className="text-sm text-slate-400">{user?.name}</span>
          <button onClick={handleLogout} className="text-xs text-slate-500 hover:text-slate-300 transition-colors px-2 py-1 rounded hover:bg-[#21253A]">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

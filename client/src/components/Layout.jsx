import React from 'react';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}

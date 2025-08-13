import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Layout = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="flex min-h-screen bg-black">
      <div className={`relative transition-all duration-300 ease-in-out ${isExpanded ? 'w-64' : 'w-20'}`}>
        <Sidebar isExpanded={isExpanded} />
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -right-4 top-6 p-2 bg-zinc-800 rounded-full border border-zinc-700 hover:bg-zinc-700 transition-colors z-50"
        >
          {isExpanded ? (
            <ChevronLeft className="w-4 h-4 text-zinc-200" />
          ) : (
            <ChevronRight className="w-4 h-4 text-zinc-200" />
          )}
        </button>
      </div>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
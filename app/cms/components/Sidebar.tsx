'use client';

import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, FileText, Settings, LogOut, ChevronRight, MessageSquare, Package, Compass } from 'lucide-react';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export default function Sidebar({ activePage, setActivePage }: SidebarProps) {
  const menuItems = [
    /* {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard className="w-5 h-5" />,
    }, */
    {
      id: 'blogs',
      label: 'Blog Stories',
      icon: <FileText className="w-5 h-5" />,
    },
    {
      id: 'packages',
      label: 'Tour Packages',
      icon: <Compass className="w-5 h-5" />,
    },
    {
      id: 'enquiries',
      label: 'Enquiry Details',
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      id: 'custom-packages',
      label: 'Customised Package Details',
      icon: <Package className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 shadow-sm">
      {/* Header */}
      <div className="p-8">
        <Link href="/" className="flex flex-col">
          <span className="text-2xl font-bold tracking-tight text-gray-900">Experience My </span>
          <span className="text-sm font-medium text-orange-500 uppercase tracking-widest -mt-1">India</span>
        </Link>
        <div className="mt-4 px-3 py-1 bg-gray-50 rounded-full w-max border border-gray-100">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Admin Dashboard</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group ${
              activePage === item.id
                ? 'bg-orange-50 text-orange-600 shadow-sm'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`${activePage === item.id ? 'text-orange-600' : 'text-gray-400 group-hover:text-orange-400'} transition-colors`}>
                {item.icon}
              </span>
              <span className="font-medium text-sm">{item.label}</span>
            </div>
            {activePage === item.id && <ChevronRight className="w-4 h-4" />}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-gray-50">
        <Link 
          href="/" 
          className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-gray-900 transition-colors text-sm font-medium group"
        >
          <LogOut className="w-5 h-5 group-hover:text-red-500 transition-colors" />
          <span>Exit Admin</span>
        </Link>
      </div>
    </aside>
  );
}

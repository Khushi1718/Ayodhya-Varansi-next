'use client';

import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import BlogManager from './components/BlogManager';
import PackageManager from './components/PackageManager';
import FormSubmissions from './components/FormSubmissions';
import DashboardOverview from './components/DashboardOverview';

export default function Page() {
  const [activePage, setActivePage] = useState('blogs');

  return (
    <div className="flex min-h-screen bg-[#fcfbf9]">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 h-screen overflow-y-auto">
        {/* {activePage === 'overview' && <DashboardOverview onNavigate={setActivePage} />} */}
        {activePage === 'blogs' && <BlogManager />}
        {activePage === 'packages' && <PackageManager />}
        {activePage === 'enquiries' && <FormSubmissions type="enquiries" />}
        {activePage === 'custom-packages' && <FormSubmissions type="custom-packages" />}
      </main>
    </div>
  );
}

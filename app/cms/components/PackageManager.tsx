'use client';

import React, { useState, useEffect } from 'react';
import PackageList from './PackageList';
import PackageDetail from './PackageDetail';
import { Loader } from 'lucide-react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:17182';

export default function PackageManager() {
  const [packages, setPackages] = useState<any[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isViewingDrafts, setIsViewingDrafts] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/admin/packages`);
      const data = await response.json();
      if (data.success) {
        setPackages(data.data);
      }
    } catch (error) {
      console.error('Connection error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePackageSelect = (pkg: any) => {
    setSelectedPackage(pkg);
    setIsViewingDrafts(false);
    setShowCreateForm(false);
  };

  const handlePackageDeleted = () => {
    setSelectedPackage(null);
    fetchPackages();
  };

  const handlePackageCreated = () => {
    setSelectedPackage(null);
    setIsViewingDrafts(false);
    setShowCreateForm(false);
    fetchPackages();
  };

  const drafts = packages.filter(p => p.status === 'draft');
  const published = packages.filter(p => p.status !== 'draft');

  return (
    <div className="flex-1 bg-[#fcfbf9] overflow-hidden flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-8 pt-8 pb-0 shrink-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Travel Packages</h1>
            <p className="text-sm text-gray-500 mt-1">Design and manage pilgrimage experiences</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <button 
            onClick={() => {
              setIsViewingDrafts(false);
              setShowCreateForm(false);
              setSelectedPackage(null);
            }}
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
              !isViewingDrafts && !showCreateForm && !selectedPackage 
                ? 'text-orange-500' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Live Packages
            <span className="ml-2 bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-[10px]">{published.length}</span>
            {!isViewingDrafts && !showCreateForm && !selectedPackage && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
            )}
          </button>
          <button 
            onClick={() => {
              setIsViewingDrafts(true);
              setShowCreateForm(false);
              setSelectedPackage(null);
            }}
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
              isViewingDrafts 
                ? 'text-orange-500' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Drafts
            <span className="ml-2 bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-[10px]">{drafts.length}</span>
            {isViewingDrafts && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
            )}
          </button>
          <button 
            onClick={() => {
              setShowCreateForm(true);
              setSelectedPackage(null);
              setIsViewingDrafts(false);
            }}
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
              showCreateForm && !selectedPackage
                ? 'text-orange-500' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            New Package
            {showCreateForm && !selectedPackage && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
            )}
          </button>
          {selectedPackage && (
            <button className="pb-4 text-sm font-bold uppercase tracking-widest text-orange-500 relative">
              Editing: {selectedPackage.title.substring(0, 20)}...
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative bg-white">
        {isViewingDrafts ? (
          <PackageList
            title="Manage Drafts"
            packages={drafts}
            selectedPackage={selectedPackage}
            onSelectPackage={handlePackageSelect}
            onCreateNew={() => {
              setShowCreateForm(true);
              setSelectedPackage(null);
              setIsViewingDrafts(false);
            }}
            onDeletePackage={handlePackageDeleted}
            loading={loading}
            onRefresh={fetchPackages}
            fullWidth={true}
          />
        ) : (showCreateForm || selectedPackage) ? (
          <div className="h-full overflow-y-auto">
            <PackageDetail 
              packageData={selectedPackage} 
              onDeleted={handlePackageDeleted} 
              onCreated={handlePackageCreated}
              onBack={() => {
                if (selectedPackage) {
                  setSelectedPackage(null);
                } else {
                  setShowCreateForm(false);
                }
              }}
              onViewDrafts={() => {
                setIsViewingDrafts(true);
                setShowCreateForm(false);
                setSelectedPackage(null);
              }}
            />
          </div>
        ) : (
          <PackageList
            title="Manage Published Packages"
            packages={published}
            selectedPackage={selectedPackage}
            onSelectPackage={handlePackageSelect}
            onCreateNew={() => {
              setShowCreateForm(true);
              setSelectedPackage(null);
            }}
            onDeletePackage={handlePackageDeleted}
            loading={loading}
            onRefresh={fetchPackages}
            fullWidth={true}
          />
        )}
      </div>
    </div>
  );
}

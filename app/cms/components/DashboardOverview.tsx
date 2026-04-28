'use client';

import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  MessageSquare, 
  Package, 
  TrendingUp, 
  Users, 
  Clock, 
  ArrowUpRight,
  Plus,
  MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const API_BASE = "/api";

export default function DashboardOverview({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [stats, setStats] = useState({
    blogs: 0,
    enquiries: 0,
    customPackages: 0
  });
  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogsRes, enquiriesRes, packagesRes] = await Promise.all([
          fetch(`${API_BASE}/admin/blogs`),
          fetch(`${API_BASE}/enquiries`),
          fetch(`${API_BASE}/custom-packages`)
        ]);

        const blogsData = await blogsRes.json();
        const enquiriesData = await enquiriesRes.json();
        const packagesData = await packagesRes.json();

        setStats({
          blogs: blogsData.success ? blogsData.data.length : 0,
          enquiries: enquiriesData.success ? enquiriesData.data.length : 0,
          customPackages: packagesData.success ? packagesData.data.length : 0
        });

        // Get latest 3 enquiries
        if (enquiriesData.success) {
          setRecentEnquiries(enquiriesData.data.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      label: 'Published Stories',
      value: stats.blogs,
      icon: <FileText className="w-6 h-6 text-orange-500" />,
      change: '+12%',
      page: 'blogs'
    },
    {
      label: 'Enquiry Details',
      value: stats.enquiries,
      icon: <MessageSquare className="w-6 h-6 text-blue-500" />,
      change: '+5%',
      page: 'enquiries'
    },
    {
      label: 'Customised Package Details',
      value: stats.customPackages,
      icon: <Package className="w-6 h-6 text-purple-500" />,
      change: '+8%',
      page: 'custom-packages'
    },
    {
      label: 'Total Visitors',
      value: '2.4k',
      icon: <Users className="w-6 h-6 text-green-500" />,
      change: '+18%',
      page: 'overview'
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => onNavigate('blogs')}
            className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-100 rounded-xl px-6 h-11 font-bold text-xs uppercase tracking-widest"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Story
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div 
            key={idx}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-100 transition-all group cursor-pointer"
            onClick={() => onNavigate(stat.page)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-2xl bg-gray-50 group-hover:bg-orange-50 transition-colors">
                {stat.icon}
              </div>
              <span className="text-[10px] font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {stat.change}
              </span>
            </div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">{loading ? '...' : stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Recent Enquiries</h2>
              <button 
                onClick={() => onNavigate('enquiries')}
                className="text-xs font-bold text-orange-500 hover:text-orange-600 uppercase tracking-widest flex items-center gap-2"
              >
                View All <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {loading ? (
                  <div className="p-8 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Leads...</div>
                ) : recentEnquiries.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">No Recent Enquiries</div>
                ) : (
                  recentEnquiries.map((enquiry, i) => (
                    <div 
                      key={enquiry.id} 
                      className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-all cursor-pointer group"
                      onClick={() => onNavigate('enquiries')}
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 font-bold group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        {enquiry.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">{enquiry.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                          <Clock className="w-3 h-3" /> {new Date(enquiry.createdAt).toLocaleDateString()}
                          {enquiry.destination && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {enquiry.destination}</span>}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" className="rounded-xl text-[10px] font-bold uppercase">Details</Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tips / Support */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-orange-500 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
            <h3 className="text-xl font-bold mb-4">Editorial Tip</h3>
            <p className="text-gray-300 text-sm leading-relaxed mb-6 font-light">
              Stories with high-quality landscape images get 40% more engagement. Make sure to use the cover image field for impact.
            </p>
            <Button className="w-full bg-white text-gray-900 hover:bg-gray-100 rounded-xl font-bold text-xs uppercase tracking-widest h-12 shadow-sm">
              Read Guide
            </Button>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">System Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 font-medium">Database</span>
                <span className="text-green-500 font-bold flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 font-medium">Image Hosting</span>
                <span className="text-green-500 font-bold flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Optimal
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 font-medium">Form Sync</span>
                <span className="text-green-500 font-bold flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

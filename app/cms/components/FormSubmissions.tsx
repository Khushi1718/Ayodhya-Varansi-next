'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  RefreshCw, 
  Loader, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar, 
  User, 
  MapPin, 
  ChevronRight,
  Package,
  MessageSquare,
  Clock,
  ArrowRight
} from 'lucide-react';

const API_BASE = "/api";

interface Submission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  subject?: string;
  destination?: string;
  travelDate?: string;
  guests?: string;
  budget?: string;
  createdAt: string;
  status: 'pending' | 'processed' | 'archived';
}

export default function FormSubmissions({ type }: { type: 'enquiries' | 'custom-packages' }) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  const endpoint = type === 'enquiries' ? 'enquiries' : 'custom-packages';
  const title = type === 'enquiries' ? 'Enquiry Details' : 'Customised Package Details';

  useEffect(() => {
    fetchSubmissions();
  }, [type]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/${endpoint}`);
      const data = await response.json();
      if (data.success) {
        setSubmissions(data.data);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSubmission = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this submission?')) return;
    
    try {
      const response = await fetch(`${API_BASE}/${endpoint}/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setSubmissions(submissions.filter(s => s.id !== id));
        if (selectedSubmission?.id === id) setSelectedSubmission(null);
      }
    } catch (error) {
      console.error('Error deleting submission:', error);
    }
  };

  const filteredSubmissions = submissions.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.destination && s.destination.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex h-screen bg-[#fcfbf9] overflow-hidden">
      {/* List Section */}
      <div className={`flex flex-col border-r border-gray-100 transition-all duration-500 bg-white ${selectedSubmission ? 'w-1/3' : 'w-full'}`}>
        <div className="p-8 border-b border-gray-50 bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h2>
              <p className="text-sm text-gray-500 mt-1">Manage incoming leads and requests</p>
            </div>
            <button 
              onClick={fetchSubmissions}
              className="p-3 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-2xl transition-all border border-transparent hover:border-orange-100"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name, email or destination..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-2xl text-sm focus:bg-white focus:border-orange-200 transition-all outline-none shadow-sm focus:shadow-orange-100/50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <Loader className="w-10 h-10 animate-spin mb-4 text-orange-500" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Retrieving Data...</p>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-100 mx-2">
              <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-900 font-bold">No submissions yet</p>
              <p className="text-gray-400 text-sm mt-1">When users fill out forms, they'll appear here.</p>
            </div>
          ) : (
            filteredSubmissions.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSubmission(sub)}
                className={`w-full group text-left p-5 rounded-3xl transition-all duration-300 relative border ${
                  selectedSubmission?.id === sub.id 
                    ? 'bg-orange-50 border-orange-200 shadow-xl shadow-orange-100/20 translate-x-2' 
                    : 'bg-white border-gray-50 hover:border-orange-100 hover:shadow-lg hover:shadow-gray-100 hover:bg-gray-50/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg transition-colors ${
                      selectedSubmission?.id === sub.id ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-600 group-hover:bg-orange-200'
                    }`}>
                      {sub.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 leading-tight">{sub.name}</h3>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => deleteSubmission(sub.id, e)}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {sub.email.split('@')[0]}
                  </span>
                  {sub.destination && (
                    <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {sub.destination}
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Detail Section */}
      <div className={`flex-1 bg-[#fcfbf9] transition-all duration-500 ${selectedSubmission ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0 pointer-events-none'}`}>
        {selectedSubmission && (
          <div className="h-full flex flex-col p-12 overflow-y-auto">
            <div className="max-w-3xl mx-auto w-full">
              {/* Profile Header */}
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-[2.5rem] bg-orange-500 flex items-center justify-center text-white text-4xl font-bold shadow-2xl shadow-orange-200">
                    {selectedSubmission.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-4xl font-black text-gray-900 tracking-tighter">{selectedSubmission.name}</h1>
                      <span className="px-4 py-1.5 bg-orange-100 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                        {type === 'enquiries' ? 'Enquiry' : 'Custom Trip'}
                      </span>
                    </div>
                    <p className="text-gray-400 mt-2 font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Received on {new Date(selectedSubmission.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedSubmission(null)}
                  className="p-4 bg-white text-gray-400 hover:text-gray-900 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-xl"
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>

              {/* Information Cards Grid */}
              <div className="grid grid-cols-2 gap-6 mb-12">
                <div className="p-8 bg-white rounded-[2rem] border border-gray-50 shadow-sm">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Contact Information</p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 hover:bg-orange-50 rounded-2xl transition-colors group">
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-orange-500 shadow-sm transition-all">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Email Address</p>
                        <p className="text-gray-900 font-bold">{selectedSubmission.email}</p>
                      </div>
                    </div>
                    {selectedSubmission.phone && (
                      <div className="flex items-center gap-4 p-3 hover:bg-orange-50 rounded-2xl transition-colors group">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-orange-500 shadow-sm transition-all">
                          <Phone className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Phone Number</p>
                          <p className="text-gray-900 font-bold">{selectedSubmission.phone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-8 bg-white rounded-[2rem] border border-gray-50 shadow-sm">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Request Details</p>
                  <div className="space-y-4">
                    {selectedSubmission.destination && (
                      <div className="flex items-center gap-4 p-3 hover:bg-orange-50 rounded-2xl transition-colors group">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-orange-500 shadow-sm transition-all">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Destination</p>
                          <p className="text-gray-900 font-bold">{selectedSubmission.destination}</p>
                        </div>
                      </div>
                    )}
                    {selectedSubmission.travelDate && (
                      <div className="flex items-center gap-4 p-3 hover:bg-orange-50 rounded-2xl transition-colors group">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-orange-500 shadow-sm transition-all">
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Planned Date</p>
                          <p className="text-gray-900 font-bold">{selectedSubmission.travelDate}</p>
                        </div>
                      </div>
                    )}
                    {!selectedSubmission.destination && !selectedSubmission.travelDate && (
                      <div className="flex items-center gap-4 p-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300">
                          <Package className="w-5 h-5" />
                        </div>
                        <p className="text-gray-400 text-sm italic">General Information Enquiry</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="p-10 bg-white rounded-[3rem] border border-gray-50 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-orange-500"></div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Message Content</h3>
                </div>
                
                {selectedSubmission.subject && (
                  <div className="mb-6">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Subject</p>
                    <p className="text-lg font-bold text-gray-900 italic">"{selectedSubmission.subject}"</p>
                  </div>
                )}

                <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 min-h-[200px]">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg italic font-medium">
                    {selectedSubmission.message || "No message provided."}
                  </p>
                </div>

                {type === 'custom-packages' && (
                  <div className="space-y-6 mt-8 pt-8 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Guests</p>
                        <p className="text-lg font-bold text-gray-900">{selectedSubmission.guests || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Travel Date</p>
                        <p className="text-lg font-bold text-gray-900">{selectedSubmission.travelDate ? new Date(selectedSubmission.travelDate).toLocaleDateString() : 'Not specified'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Estimated Budget</p>
                      <p className="text-xl font-bold text-orange-600">{selectedSubmission.budget || 'Not specified'}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Footer */}
              <div className="mt-12 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button className="px-8 py-4 bg-gray-900 text-white rounded-3xl font-bold text-sm hover:bg-black transition-all shadow-xl shadow-gray-200">
                    Mark as Processed
                  </button>
                  <button className="px-8 py-4 bg-white text-gray-600 border border-gray-100 rounded-3xl font-bold text-sm hover:bg-gray-50 transition-all">
                    Archive
                  </button>
                </div>
                <button 
                  onClick={(e) => deleteSubmission(selectedSubmission.id, e)}
                  className="flex items-center gap-2 text-red-500 font-bold text-sm hover:underline"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Forever
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

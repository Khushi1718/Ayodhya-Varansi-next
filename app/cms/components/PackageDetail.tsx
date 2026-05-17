'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Trash2, Eye, Loader, Save, Plus, ArrowRight, Clock, MapPin, 
  Check, X, Maximize2, ImageIcon, Upload, ArrowLeft, PlusCircle,
  HelpCircle, Calendar, Star, Info, Share2, ThumbsUp, ChevronDown,
  Award, Shield, Phone, Mail, Sparkles, Layout, FileText
} from 'lucide-react';
import { Package, PackageDetailProps, ItineraryDay, FAQ } from './types';
import { uploadImageToCloudinary } from '@/lib/cloudinaryUpload';

const API_BASE = "/api";

export default function PackageDetail({ packageData: initialPackage, onDeleted, onCreated, onBack, onViewDrafts }: PackageDetailProps) {
  const [loading, setLoading] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);
  const [previewTab, setPreviewTab] = useState<'page' | 'card'>('page');
  const [openDay, setOpenDay] = useState(0);
  
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const galleryImageInputRef = useRef<HTMLInputElement>(null);

  const initialFormState: Omit<Package, 'id' | 'slug'> = {
    title: '',
    destination: '',
    duration: '',
    durationCategory: '2-3',
    rating: 5.0,
    reviews: 128,
    price: '',
    originalPrice: '',
    savings: '',
    about: '',
    highlights: [''],
    itinerary: [{ day: 'Day 1', title: '', desc: '' }],
    included: [''],
    excluded: [''],
    faq: [{ q: '', a: '' }],
    images: {
      main: '',
      gallery: ['', '', '', '']
    },
    isOffer: false,
    offerPercentage: '10% OFF',
    status: 'published'
  };

  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    if (initialPackage) {
      setForm({
        ...initialFormState,
        ...initialPackage,
        highlights: initialPackage.highlights || [''],
        itinerary: initialPackage.itinerary || [{ day: 'Day 1', title: '', desc: '' }],
        included: initialPackage.included || [''],
        excluded: initialPackage.excluded || [''],
        faq: initialPackage.faq || [{ q: '', a: '' }],
        images: {
          main: initialPackage.images?.main || '',
          gallery: initialPackage.images?.gallery || ['', '', '', '']
        },
        isOffer: initialPackage.isOffer || false,
        offerPercentage: initialPackage.offerPercentage || '10% OFF',
        status: initialPackage.status || 'published'
      });
    } else {
      setForm(initialFormState);
    }
    setMessage(null);
  }, [initialPackage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (index: number, value: string, field: 'highlights' | 'included' | 'excluded') => {
    const newArray = [...form[field]];
    newArray[index] = value;
    setForm(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field: 'highlights' | 'included' | 'excluded') => {
    setForm(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (index: number, field: 'highlights' | 'included' | 'excluded') => {
    const newArray = form[field].filter((_, i) => i !== index);
    setForm(prev => ({ ...prev, [field]: newArray.length ? newArray : [''] }));
  };

  const handleItineraryChange = (index: number, field: keyof ItineraryDay, value: string) => {
    const newItinerary = [...form.itinerary];
    newItinerary[index] = { ...newItinerary[index], [field]: value };
    setForm(prev => ({ ...prev, itinerary: newItinerary }));
  };

  const addItineraryDay = () => {
    const nextDayNum = form.itinerary.length + 1;
    setForm(prev => ({ 
      ...prev, 
      itinerary: [...prev.itinerary, { day: `Day ${nextDayNum}`, title: '', desc: '' }] 
    }));
  };

  const removeItineraryDay = (index: number) => {
    const newItinerary = form.itinerary.filter((_, i) => i !== index)
      .map((day, i) => ({ ...day, day: `Day ${i + 1}` }));
    setForm(prev => ({ ...prev, itinerary: newItinerary.length ? newItinerary : [{ day: 'Day 1', title: '', desc: '' }] }));
  };

  const handleFAQChange = (index: number, field: keyof FAQ, value: string) => {
    const newFAQ = [...form.faq];
    newFAQ[index] = { ...newFAQ[index], [field]: value };
    setForm(prev => ({ ...prev, faq: newFAQ }));
  };

  const addFAQ = () => {
    setForm(prev => ({ ...prev, faq: [...prev.faq, { q: '', a: '' }] }));
  };

  const removeFAQ = (index: number) => {
    const newFAQ = form.faq.filter((_, i) => i !== index);
    setForm(prev => ({ ...prev, faq: newFAQ.length ? newFAQ : [{ q: '', a: '' }] }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'main' | number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const uploadKey = field === 'main' ? 'main' : `gallery-${field}`;
      setUploadingField(uploadKey);
      const uploadedUrl = await uploadImageToCloudinary(file, field === 'main' ? 'packages/main' : 'packages/gallery');

      if (field === 'main') {
        setForm(prev => ({ ...prev, images: { ...prev.images, main: uploadedUrl } }));
      } else {
        const newGallery = [...form.images.gallery];
        newGallery[field] = uploadedUrl;
        setForm(prev => ({ ...prev, images: { ...prev.images, gallery: newGallery } }));
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Image upload failed'
      });
    } finally {
      setUploadingField(null);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent, isDraft = false) => {
    if (e) e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (!form.title.trim()) throw new Error('Title is required');
      
      // Build payload with clean form data
      const payload = {
        title: form.title,
        destination: form.destination,
        duration: form.duration,
        durationCategory: form.durationCategory,
        rating: form.rating,
        reviews: form.reviews,
        price: form.price,
        originalPrice: form.originalPrice,
        savings: form.savings,
        about: form.about,
        status: isDraft ? 'draft' : 'published',
        highlights: form.highlights.filter(h => h.trim()).length > 0 
          ? form.highlights.filter(h => h.trim()) 
          : [''],
        included: form.included.filter(h => h.trim()).length > 0 
          ? form.included.filter(h => h.trim()) 
          : [''],
        excluded: form.excluded.filter(h => h.trim()).length > 0 
          ? form.excluded.filter(h => h.trim()) 
          : [''],
        faq: form.faq.filter(f => f.q.trim() && f.a.trim()),
        itinerary: form.itinerary.filter(d => d.title.trim() && d.desc.trim()).length > 0
          ? form.itinerary.filter(d => d.title.trim() && d.desc.trim())
          : [{ day: 'Day 1', title: '', desc: '' }],
        images: form.images,
        isOffer: form.isOffer,
        offerPercentage: form.offerPercentage
      };

      // Use id if available, otherwise use _id (MongoDB ID)
      const packageId = initialPackage ? (initialPackage.id || initialPackage._id) : null;
      const url = initialPackage ? `${API_BASE}/packages/${packageId}` : `${API_BASE}/packages`;
      const method = initialPackage ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.success) {
        const isDraftStatus = isDraft || data.data?.status === 'draft';
        const statusText = isDraftStatus ? 'Draft' : 'Published';
        const actionText = initialPackage ? 'updated' : 'created';
        setMessage({ type: 'success', text: `${statusText} ${actionText}!` });
        if (onCreated) setTimeout(() => onCreated(), 1500);
      } else {
        throw new Error(data.error || 'Save failed');
      }
    } catch (error) {
      console.error('Save error:', error);
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!initialPackage || !window.confirm('Delete this package permanently?')) return;

    try {
      setLoading(true);
      const packageId = initialPackage.id || initialPackage._id;
      const response = await fetch(`${API_BASE}/packages/${packageId}`, { method: 'DELETE' });
      if (response.ok) {
        setMessage({ type: 'success', text: 'Package deleted' });
        setTimeout(() => onDeleted?.(), 1000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Delete failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#fcfbf9]">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-500"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">{initialPackage ? 'Edit Package' : 'Create Package'}</h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Package Builder</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={onViewDrafts}
            className="text-xs font-bold uppercase tracking-wider text-orange-500 hover:text-orange-600 hover:bg-orange-50 h-9 px-4 rounded-xl"
          >
            <FileText className="w-3.5 h-3.5 mr-2" />
            View Drafts
          </Button>

          {initialPackage && initialPackage.status === 'published' && (
            <Button
              variant="outline"
              onClick={() => window.open(`/packages/${initialPackage.slug || initialPackage.id || 'template'}`, '_blank')}
              className="text-xs font-bold uppercase tracking-wider border-gray-200 h-9 px-4 rounded-xl"
            >
              <Eye className="w-3.5 h-3.5 mr-2" /> Live Post
            </Button>
          )}
          {initialPackage && (
            <Button variant="ghost" onClick={handleDelete} className="text-xs font-bold uppercase tracking-wider text-red-500 hover:bg-red-50 h-9 px-4 rounded-xl">
              <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete
            </Button>
          )}
          <Button variant="outline" onClick={(e) => handleSubmit(e, true)} disabled={loading} className="text-xs font-bold uppercase tracking-wider border-gray-200 h-9 px-4 rounded-xl">
            <Save className="w-3.5 h-3.5 mr-2" /> 
            {initialPackage?.status === 'draft' ? 'Save Draft' : 'Save as Draft'}
          </Button>
          <Button onClick={(e) => handleSubmit(e, false)} disabled={loading} className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-100 px-6 h-9 rounded-xl font-bold uppercase tracking-wider text-xs">
            {loading ? <Loader className="w-3.5 h-3.5 animate-spin mr-2" /> : <Save className="w-3.5 h-3.5 mr-2" />}
            {initialPackage?.status === 'draft' ? (initialPackage ? 'Publish Package' : 'Publish') : (initialPackage ? 'Update & Publish' : 'Publish Package')}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 pb-40">
        <div className="max-w-4xl mx-auto space-y-12">
          {message && (
            <div className={`p-4 rounded-2xl flex items-center gap-3 border animate-in slide-in-from-top-4 duration-300 ${
              message.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
            }`}>
              <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          )}

          <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-12">
            {/* PACKAGE CARD FIELDS (Identity) */}
            <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-orange-50 rounded-2xl text-orange-500">
                  <Layout className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">Package Identity & Card</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Package Title (Displays on Card)</label>
                  <Input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Divine Ayodhya & Kashi Pilgrimage"
                    className="h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all text-lg font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Destination</label>
                  <Input
                    name="destination"
                    value={form.destination}
                    onChange={handleChange}
                    placeholder="e.g. Ayodhya + Varanasi"
                    className="h-12 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Duration (Short)</label>
                  <Input
                    name="duration"
                    value={form.duration}
                    onChange={handleChange}
                    placeholder="e.g. 5 Days / 4 Nights"
                    className="h-12 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Duration Category</label>
                  <select 
                    name="durationCategory" 
                    value={form.durationCategory} 
                    onChange={handleChange} 
                    className="w-full h-12 rounded-2xl border border-gray-100 bg-gray-50 focus:bg-white px-4 text-sm font-medium transition-all"
                  >
                    <option value="2-3">2-3 Days</option>
                    <option value="4-5">4-5 Days</option>
                    <option value="6+">6+ Days</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Rating</label>
                  <Input
                    name="rating"
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={form.rating}
                    onChange={handleChange}
                    placeholder="e.g. 4.9"
                    className="h-12 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Total Reviews</label>
                  <Input
                    name="reviews"
                    type="number"
                    value={form.reviews}
                    onChange={handleChange}
                    placeholder="e.g. 128"
                    className="h-12 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center justify-between">
                    <span>Is Offer Package?</span>
                    <input 
                      type="checkbox" 
                      name="isOffer" 
                      checked={form.isOffer} 
                      onChange={(e) => setForm(prev => ({ ...prev, isOffer: e.target.checked }))} 
                      className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500 border-gray-300"
                    />
                  </label>
                  <div className={`transition-all duration-300 ${form.isOffer ? 'opacity-100 h-12 mt-2' : 'opacity-30 h-12 mt-2 pointer-events-none'}`}>
                    <Input
                      name="offerPercentage"
                      value={form.offerPercentage}
                      onChange={handleChange}
                      placeholder="e.g. 10% OFF"
                      className="h-12 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all"
                      disabled={!form.isOffer}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Thumbnail (Card Image)</label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                       <Input
                        name="main"
                        value={form.images.main}
                        onChange={(e) => setForm(prev => ({...prev, images: {...prev.images, main: e.target.value}}))}
                        placeholder="Image URL or Upload..."
                        className="h-12 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all pr-10 truncate"
                      />
                    </div>
                    <input type="file" ref={mainImageInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'main')} />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => mainImageInputRef.current?.click()}
                      disabled={uploadingField === 'main'}
                      className="h-12 w-12 p-0 rounded-2xl border-gray-100 hover:bg-orange-50 transition-all"
                    >
                      {uploadingField === 'main' ? '...' : <Upload className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>


              </div>
            </section>

            {/* SEPARATOR */}
            <div className="relative py-12">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 border-dashed"></div></div>
              <div className="relative flex justify-center">
                <span className="bg-[#fcfbf9] px-10 text-3xl font-heading font-bold text-gray-900 tracking-tight">Write Detail Content for Package</span>
              </div>
            </div>

            {/* PACKAGE DETAIL FIELDS */}
            <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 space-y-10">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-500"><Info className="w-6 h-6" /></div>
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">Journey Narrative</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">About the Journey</label>
                  <Textarea
                    name="about"
                    value={form.about}
                    onChange={handleChange}
                    placeholder="Describe the soul of this spiritual journey..."
                    className="rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all min-h-[160px] leading-relaxed"
                  />
                </div>

                {/* Itinerary */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest">Day-wise Itinerary</label>
                    <Button type="button" onClick={addItineraryDay} variant="outline" className="h-8 rounded-full text-[10px] font-bold uppercase tracking-wider border-orange-200 text-orange-600">
                      <Plus className="w-3 h-3 mr-1" /> Add Day
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {form.itinerary.map((day, idx) => (
                      <div key={idx} className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 space-y-4 relative group">
                        <button type="button" onClick={() => removeItineraryDay(idx)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-bold text-orange-500 border border-orange-100 shadow-sm shrink-0">{idx + 1}</div>
                          <Input value={day.title} onChange={(e) => handleItineraryChange(idx, 'title', e.target.value)} placeholder="Day Title (e.g. Arrival & Evening Aarti)" className="h-12 rounded-2xl border-white focus:bg-white shadow-sm" />
                        </div>
                        <Textarea value={day.desc} onChange={(e) => handleItineraryChange(idx, 'desc', e.target.value)} placeholder="What happens on this day?" className="rounded-2xl border-white focus:bg-white shadow-sm min-h-[100px]" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Array Sections: Highlights, Included, Excluded */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Highlights */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest">Highlights</label>
                      <button type="button" onClick={() => addArrayItem('highlights')} className="text-orange-500"><PlusCircle className="w-4 h-4" /></button>
                    </div>
                    {form.highlights.map((h, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input value={h} onChange={(e) => handleArrayChange(idx, e.target.value, 'highlights')} placeholder="Highlight..." className="h-10 rounded-xl border-gray-100 bg-gray-50 focus:bg-white" />
                        <button type="button" onClick={() => removeArrayItem(idx, 'highlights')} className="text-gray-300 hover:text-red-500"><X className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>

                  {/* Included */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest text-green-600">What's Included</label>
                      <button type="button" onClick={() => addArrayItem('included')} className="text-green-500"><PlusCircle className="w-4 h-4" /></button>
                    </div>
                    {form.included.map((h, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input value={h} onChange={(e) => handleArrayChange(idx, e.target.value, 'included')} placeholder="Inclusion..." className="h-10 rounded-xl border-gray-100 bg-gray-50 focus:bg-white" />
                        <button type="button" onClick={() => removeArrayItem(idx, 'included')} className="text-gray-300 hover:text-red-500"><X className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>

                  {/* Excluded (The Missing Section) */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest text-red-400">What's Excluded</label>
                      <button type="button" onClick={() => addArrayItem('excluded')} className="text-red-400"><PlusCircle className="w-4 h-4" /></button>
                    </div>
                    {form.excluded.map((h, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input value={h} onChange={(e) => handleArrayChange(idx, e.target.value, 'excluded')} placeholder="Exclusion..." className="h-10 rounded-xl border-gray-100 bg-gray-50 focus:bg-white" />
                        <button type="button" onClick={() => removeArrayItem(idx, 'excluded')} className="text-gray-300 hover:text-red-500"><X className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>

                  {/* FAQs */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest">FAQs</label>
                      <button type="button" onClick={addFAQ} className="text-blue-500"><PlusCircle className="w-4 h-4" /></button>
                    </div>
                    {form.faq.map((f, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-2xl space-y-2 relative border border-gray-100 shadow-sm">
                        <button type="button" onClick={() => removeFAQ(idx)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500"><X className="w-3 h-3" /></button>
                        <Input value={f.q} onChange={(e) => handleFAQChange(idx, 'q', e.target.value)} placeholder="Question" className="h-8 rounded-lg text-[10px] font-bold border-white" />
                        <Textarea value={f.a} onChange={(e) => handleFAQChange(idx, 'a', e.target.value)} placeholder="Answer" className="rounded-lg text-[10px] min-h-[60px] border-white" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gallery Images */}
                <div className="space-y-4 pt-6 border-t border-gray-50">
                   <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest">Bento Gallery (4 Images)</label>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {form.images.gallery.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 hover:border-orange-200 transition-all cursor-pointer flex items-center justify-center">
                          {img ? <img src={img} className="w-full h-full object-cover" alt="" /> : <Upload className="w-5 h-5 text-gray-300" />}
                          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={(e) => handleFileUpload(e, idx)} />
                          {uploadingField === `gallery-${idx}` && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/80 text-[10px] font-bold uppercase tracking-widest text-orange-600">Uploading</div>
                          )}
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            </section>

            {/* PREVIEWS SECTION (At the very end like Blog CMS) */}
            <section className="space-y-12 pb-20">
               <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-gray-200"></div>
                  <div className="flex items-center gap-6">
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.3em]">Live Visual Previews</h3>
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={() => setIsFullscreenPreview(true)}
                      className="h-10 rounded-full border-orange-200 text-[10px] font-bold uppercase tracking-wider text-orange-600 hover:bg-orange-500 hover:text-white transition-all shadow-sm shadow-orange-50"
                    >
                      <Maximize2 className="w-3.5 h-3.5 mr-2" /> Full Window Preview
                    </Button>
                  </div>
                  <div className="h-px flex-1 bg-gray-200"></div>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* CARD PREVIEW */}
                  <div className="space-y-6">
                    <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Packages Page Card</h4>
                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 flex justify-center hover:shadow-2xl transition-all duration-500 group">
                      <div className="max-w-[320px] w-full">
                        <div className="relative h-48 rounded-2xl overflow-hidden mb-6 bg-gray-50 border border-gray-100">
                          {form.images.main ? <img src={form.images.main} alt="Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" /> : <div className="w-full h-full flex items-center justify-center text-gray-200"><ImageIcon className="w-12 h-12" /></div>}
                          <div className="absolute top-4 left-4"><span className="px-3 py-1 bg-white/95 backdrop-blur shadow-sm rounded-full text-[9px] font-bold text-gray-900 uppercase tracking-wider">{form.destination || 'India'}</span></div>
                          {form.isOffer ? (
                            <div className="absolute top-4 right-4 bg-[#00b67a] text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-[0_4px_12px_rgba(0,182,122,0.25)] z-10"><span className="text-[10px] font-bold uppercase tracking-wider">{form.offerPercentage}</span></div>
                          ) : (
                            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur shadow-sm px-2.5 py-1 rounded-full flex items-center gap-1 border border-gray-100"><Star size={12} className="text-orange-500 fill-orange-500" /><span className="text-xs font-bold text-gray-900">{form.rating}</span></div>
                          )}
                        </div>
                        <h3 className="font-heading font-bold text-gray-900 text-xl leading-tight mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">{form.title || 'Untitled Package'}</h3>
                        <div className="flex items-center gap-3 text-gray-500 text-[11px] font-medium mb-4">
                          <span className="flex items-center gap-1"><Clock size={12} /> {form.duration || '0 Days'}</span>
                          <span className="flex items-center gap-1"><MapPin size={12} /> India</span>
                        </div>
                        <ul className="space-y-1.5 mb-6">
                          {form.highlights.slice(0, 3).map((h, i) => (
                            <li key={i} className="text-[11px] text-gray-500 flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-orange-500 shrink-0" /> {h || 'Feature...'}</li>
                          ))}
                        </ul>
                        <div className="flex gap-2 pt-4 border-t border-gray-50">
                           <div className="flex-1 py-2.5 rounded-xl border border-gray-100 text-[10px] font-bold uppercase tracking-widest text-center text-gray-400">View Details</div>
                           <div className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white text-[10px] font-bold uppercase tracking-widest text-center shadow-lg shadow-orange-100">Enquire</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* MINI PREVIEW (HEADER ONLY) */}
                  <div className="space-y-6">
                    <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Web Page Hero</h4>
                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 flex items-center justify-center min-h-[420px]">
                      <div className="text-center w-full">
                         <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 mb-6 font-bold uppercase tracking-[0.2em]">Home / Packages / {form.title}</div>
                         <h3 className="font-heading text-4xl font-bold text-gray-900 leading-[1.1] mb-8 tracking-tight">{form.title || 'Your Package Title'}</h3>
                         <div className="flex items-center justify-center gap-6 text-gray-500 text-xs font-bold uppercase tracking-widest">
                           <div className="flex items-center gap-1.5 text-orange-500"><Star size={16} className="fill-orange-500" /><span>{form.rating}</span></div>
                           <span className="flex items-center gap-2"><MapPin size={16} /> {form.destination}</span>
                           <span className="flex items-center gap-2"><Clock size={16} /> {form.duration}</span>
                         </div>
                         <div className="mt-12 inline-flex items-center gap-4 px-8 py-4 bg-orange-500 text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-orange-100">Check Availability <ArrowRight size={18} /></div>
                      </div>
                    </div>
                  </div>
               </div>
            </section>
          </form>
        </div>
      </div>

      {/* FULLSCREEN PREVIEW MODAL (Just like Blog CMS) */}
      {isFullscreenPreview && (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto animate-in fade-in zoom-in duration-500">
          <div className="sticky top-0 z-[110] bg-white/95 backdrop-blur-xl border-b border-gray-100 px-8 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <span className="px-4 py-1.5 bg-orange-50 text-orange-600 text-[10px] font-bold uppercase rounded-full border border-orange-100 shadow-sm">Live Preview</span>
              <h2 className="text-sm font-bold text-gray-900 line-clamp-1 max-w-md">{form.title}</h2>
            </div>
            <button 
              onClick={() => setIsFullscreenPreview(false)}
              className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-900 hover:bg-black hover:text-white transition-all shadow-sm active:scale-90"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="min-h-screen bg-[#fafaf8] pb-40 font-sans">
             {/* Website Simulation Header */}
             <section className="pt-24 pb-12 px-6 bg-white">
                <div className="container mx-auto">
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-8 font-bold uppercase tracking-[0.2em]">Home / Packages / {form.title}</div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="max-w-4xl">
                      <h1 className="text-4xl md:text-7xl font-extrabold text-gray-900 mb-6 leading-[1.05] tracking-tighter">{form.title || 'Package Title'}</h1>
                      <div className="flex flex-wrap items-center gap-8 text-gray-500 text-sm font-bold uppercase tracking-[0.15em]">
                        <div className="flex items-center gap-1.5 text-gray-900"><Star size={18} className="text-orange-500 fill-orange-500" /><span>{form.rating}</span> <span className="text-gray-300 ml-1">({form.reviews} reviews)</span></div>
                        <span className="flex items-center gap-2"><MapPin size={20} className="text-orange-300" /> {form.destination}</span>
                        <span className="flex items-center gap-2"><Clock size={20} className="text-orange-300" /> {form.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Bento Photo Gallery Simulation */}
              <section className="px-6 pb-20 bg-[#fafaf8]">
                <div className="container mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-4 h-auto md:h-[65vh] md:min-h-[550px]">
                    <div className="col-span-1 md:col-span-8 md:row-span-2 relative rounded-[3rem] overflow-hidden bg-gray-100 group shadow-2xl">
                      {form.images.main ? <img src={form.images.main} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="" /> : <div className="w-full h-full flex items-center justify-center text-gray-200"><ImageIcon size={64} /></div>}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                      <div className="absolute bottom-0 left-0 p-12 w-full">
                         <p className="text-xs font-bold text-orange-400 uppercase tracking-[0.4em] mb-4">Experience My India Exclusive</p>
                         <h3 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">{form.title}</h3>
                         <div className="inline-flex items-center gap-4 bg-white/20 backdrop-blur-2xl px-5 py-3 rounded-2xl text-white text-[11px] font-bold border border-white/20 uppercase tracking-[0.2em]">
                           Save {form.savings} • VIP Darshan • Premium Stays
                         </div>
                      </div>
                    </div>
                    <div className="col-span-1 md:col-span-4 md:row-span-2 grid grid-cols-2 md:grid-cols-1 md:grid-rows-2 gap-4">
                       <div className="relative rounded-[3rem] overflow-hidden bg-gray-100 shadow-xl">
                         {form.images.gallery[0] && <img src={form.images.gallery[0]} className="w-full h-full object-cover" alt="" />}
                       </div>
                       <div className="relative rounded-[3rem] overflow-hidden bg-gray-100 shadow-xl">
                         {form.images.gallery[1] && <img src={form.images.gallery[1]} className="w-full h-full object-cover" alt="" />}
                       </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Main Simulation Content */}
              <section className="py-24 px-6 bg-white border-t border-gray-100">
                <div className="container mx-auto flex flex-col lg:flex-row gap-20">
                  <div className="w-full lg:w-[65%] space-y-24">
                     {/* Overview */}
                     <div className="space-y-10">
                        <h2 className="text-4xl font-bold text-gray-900 tracking-tight">About the Journey</h2>
                        <p className="text-gray-600 leading-relaxed text-xl font-medium">{form.about || 'Describe the soul of this spiritual journey...'}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {form.highlights.map((h, i) => (
                            <div key={i} className="flex items-center gap-5 bg-[#fafaf8] p-6 rounded-[2rem] border border-gray-100 transition-all hover:border-orange-200 shadow-sm">
                              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0"><Check size={18} strokeWidth={3} /></div>
                              <span className="text-gray-800 font-bold text-lg">{h || 'Highlight...'}</span>
                            </div>
                          ))}
                        </div>
                     </div>

                     {/* Itinerary */}
                     <div>
                        <div className="flex items-center justify-between mb-12">
                           <h2 className="text-4xl font-bold text-gray-900 flex items-center gap-5 tracking-tight"><Calendar size={40} className="text-orange-500" /> Journey Itinerary</h2>
                           <span className="bg-gray-50 px-6 py-2.5 rounded-full border border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-widest">{form.duration}</span>
                        </div>
                        <div className="space-y-6">
                           {form.itinerary.map((day, i) => (
                             <div key={i} className={`border rounded-[3rem] overflow-hidden transition-all duration-500 ${openDay === i ? 'border-orange-200 shadow-[0_40px_80px_rgba(255,107,0,0.08)] bg-white' : 'border-gray-100 bg-white shadow-sm'}`}>
                                <button onClick={() => setOpenDay(i)} className="w-full text-left p-10 flex items-center justify-between">
                                   <div className="flex items-center gap-10">
                                      <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center font-bold text-2xl transition-all ${openDay === i ? 'bg-orange-500 text-white shadow-xl shadow-orange-200' : 'bg-gray-50 text-gray-300'}`}>{i+1}</div>
                                      <h3 className={`font-bold text-2xl md:text-3xl transition-colors ${openDay === i ? 'text-orange-600' : 'text-gray-900'}`}>{day.title || `Day ${i+1}`}</h3>
                                   </div>
                                   <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${openDay === i ? 'bg-orange-50 text-orange-500 rotate-180' : 'bg-gray-50 text-gray-300'}`}><ChevronDown size={28} /></div>
                                </button>
                                {openDay === i && (
                                  <div className="px-10 pb-12 pl-32 text-gray-500 leading-relaxed text-xl animate-in slide-in-from-top-6 duration-500">{day.desc || 'Journey details...'}</div>
                                )}
                             </div>
                           ))}
                        </div>
                     </div>

                     {/* Inclusions / Exclusions Simulation */}
                     <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-[#f8fdf8] rounded-[3rem] p-12 border border-green-100 shadow-sm">
                           <h3 className="text-3xl font-bold text-gray-900 mb-10 flex items-center gap-5"><div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-sm"><Check size={24} strokeWidth={3} /></div> What's Included</h3>
                           <ul className="space-y-6">
                              {form.included.map((item, i) => (
                                <li key={i} className="flex items-start gap-5 text-gray-700 font-bold text-lg"><span className="w-2.5 h-2.5 bg-green-500 rounded-full mt-2 shrink-0 shadow-sm shadow-green-200" /> {item || 'Included...'}</li>
                              ))}
                           </ul>
                        </div>
                        <div className="bg-[#fdf8f8] rounded-[3rem] p-12 border border-red-100 shadow-sm">
                           <h3 className="text-3xl font-bold text-gray-900 mb-10 flex items-center gap-5"><div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center shadow-sm"><X size={24} strokeWidth={3} /></div> What's Excluded</h3>
                           <ul className="space-y-6">
                              {form.excluded.map((item, i) => (
                                <li key={i} className="flex items-start gap-5 text-gray-700 font-bold text-lg"><span className="w-2.5 h-2.5 bg-red-400 rounded-full mt-2 shrink-0 shadow-sm shadow-red-200" /> {item || 'Excluded...'}</li>
                              ))}
                           </ul>
                        </div>
                     </div>
                  </div>

                  {/* Sidebar Simulation */}
                  <div className="w-full lg:w-[35%] relative">
                     <div className="sticky top-32 space-y-10">
                        <div className="bg-white rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.08)] border border-gray-100 p-10 group/sidebar">
                           <div className="flex justify-between items-center mb-8">
                              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.3em]">Premium Experience</span>
                              <span className="bg-green-50 text-green-600 text-[11px] font-bold px-4 py-1.5 rounded-full uppercase border border-green-100">Save {form.savings}</span>
                           </div>
                           <div className="mb-10">
                              <div className="text-5xl font-black text-gray-900 mb-2 tracking-tighter">{form.price || '₹0'}</div>
                              <div className="text-lg text-gray-400 line-through font-bold">{form.originalPrice}</div>
                           </div>
                           <button className="w-full h-16 bg-orange-500 text-white font-bold rounded-[1.5rem] shadow-2xl shadow-orange-200 hover:scale-[1.02] transition-all text-sm uppercase tracking-[0.2em]">Check Availability</button>
                           <p className="text-[11px] text-gray-400 text-center mt-6 font-bold uppercase tracking-[0.2em] italic">Official Best Price Guarantee</p>
                        </div>
                     </div>
                  </div>
                </div>
              </section>
          </div>
        </div>
      )}
    </div>
  );
}

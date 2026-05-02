'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Trash2, Eye, Loader, Save, Plus, ArrowRight, Clock, User, 
  Tag, Quote as QuoteIcon, Image as ImageIcon, Upload, X, Maximize2,
  Compass, Share2, Link2, ArrowLeft, Type
} from 'lucide-react';
import 'react-quill-new/dist/quill.snow.css';
import { Blog, BlogDetailProps } from './types';
import { uploadImageToCloudinary } from '@/lib/cloudinaryUpload';

// Dynamic import for ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-gray-50 animate-pulse rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Editor...</div>
});

const API_BASE = "/api";

export default function BlogDetail({ blog, onDeleted, onCreated, onBack, onViewDrafts }: BlogDetailProps) {
  const [loading, setLoading] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);
  
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const initialFormState = {
    title: '',
    subtitle: '',
    category: 'Travel',
    author: '',
    authorRole: 'Travel Expert',
    date: new Date().toISOString().split('T')[0],
    thumbnailImage: '',
    content: '',
    readTime: '5 min read',
    coverImage: '',
    tags: '',
    quotes: '',
    additionalImages: '',
    status: 'published'
  };

  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    if (blog) {
      setForm({
        ...initialFormState,
        ...blog,
        tags: blog.tags?.join(', ') || '',
        quotes: blog.quotes?.join('\n') || '',
        additionalImages: blog.additionalImages?.join('\n') || '',
        status: blog.status || 'published'
      });
    } else {
      setForm(initialFormState);
    }
    setMessage(null);
  }, [blog]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content: string) => {
    setForm(prev => ({ ...prev, content }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'thumbnailImage' | 'coverImage' | 'additionalImages') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingField(field);
      const uploadedUrl = await uploadImageToCloudinary(file, field === 'additionalImages' ? 'blogs/additional' : 'blogs');

      if (field === 'additionalImages') {
        setForm(prev => ({
          ...prev,
          additionalImages: prev.additionalImages ? `${prev.additionalImages}\n${uploadedUrl}` : uploadedUrl
        }));
      } else {
        setForm(prev => ({ ...prev, [field]: uploadedUrl }));
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
      const tagsArray = form.tags.split(',').map((t) => t.trim()).filter(Boolean);
      const quotesArray = form.quotes.split('\n').map((q) => q.trim()).filter(Boolean);
      const imagesArray = form.additionalImages.split('\n').map((i) => i.trim()).filter(Boolean);

      // Validate required fields (Drafts only require title)
      if (!form.title.trim()) throw new Error('Title is required');
      
      if (!isDraft) {
        if (!form.subtitle.trim()) throw new Error('Summary is required');
        if (!form.author.trim()) throw new Error('Author is required');
        if (!form.content.trim()) throw new Error('Content is required');
      }

      const payload = {
        ...form,
        preview: form.subtitle,
        tags: tagsArray,
        quotes: quotesArray,
        additionalImages: imagesArray,
        status: isDraft ? 'draft' : 'published'
      };

      const url = blog ? `${API_BASE}/blogs/${blog.id}` : `${API_BASE}/blogs`;
      const method = blog ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || 'Request failed'}`);
      }

      const data = await response.json();

      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: isDraft 
            ? 'Draft saved successfully!' 
            : (blog ? 'Story updated successfully!' : 'Story published successfully!') 
        });
        if (onCreated) setTimeout(() => onCreated(), 1500);
      } else {
        setMessage({ type: 'error', text: `Error: ${data.error}` });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!blog || !window.confirm('Are you sure you want to delete this blog?')) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/blogs/${blog.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Story deleted successfully' });
        setTimeout(() => onDeleted?.(), 1000);
      } else {
        setMessage({ type: 'error', text: `Error: ${data.error}` });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const quillModules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'clean']
    ],
  }), []);

  const quillFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list',
    'link'
  ];

  const renderPremiumContent = (html: string) => {
    if (!html) return <p className="text-gray-400 italic text-center py-20">Story content will appear here...</p>;
    
    if (typeof window === 'undefined') return <div dangerouslySetInnerHTML={{ __html: html }} />;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const firstP = doc.querySelector('p');
    
    if (firstP && firstP.textContent && firstP.textContent.length > 0) {
      const text = firstP.textContent;
      const firstChar = text.charAt(0);
      const restText = text.slice(1);
      firstP.innerHTML = `<span class="float-left text-6xl leading-[0.8] pr-3 pt-1 font-heading font-bold text-orange-500">${firstChar}</span>${restText}`;
    }
    
    return <div className="premium-article-content" dangerouslySetInnerHTML={{ __html: doc.body.innerHTML }} />;
  };

  return (
    <div className="flex flex-col h-full bg-[#fcfbf9]">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">{blog ? 'Edit Story' : 'Create New Story'}</h1>
            <div className="flex items-center gap-2">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Premium Editor</p>
              {form.status === 'draft' && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[9px] font-bold uppercase tracking-widest">Draft</span>
              )}
            </div>
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

          {blog && (
            <Button
              variant="outline"
              onClick={() => window.open(`/blog/${blog.slug}`, '_blank')}
              className="text-xs font-bold uppercase tracking-wider border-gray-200 hover:bg-gray-50 h-9 px-4 rounded-xl"
            >
              <Eye className="w-3.5 h-3.5 mr-2" />
              Live Post
            </Button>
          )}
          {blog && (
            <Button
              variant="ghost"
              onClick={handleDelete}
              className="text-xs font-bold uppercase tracking-wider text-red-500 hover:text-red-600 hover:bg-red-50 h-9 px-4 rounded-xl"
            >
              <Trash2 className="w-3.5 h-3.5 mr-2" />
              Delete
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={(e) => handleSubmit(e, true)}
            disabled={loading}
            className="text-xs font-bold uppercase tracking-wider border-gray-200 hover:bg-gray-50 h-9 px-4 rounded-xl"
          >
            {loading ? <Loader className="w-3.5 h-3.5 animate-spin mr-2" /> : <Save className="w-3.5 h-3.5 mr-2" />}
            Save Draft
          </Button>

          <Button
            onClick={(e) => handleSubmit(e, false)}
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-100 px-6 h-9 rounded-xl font-bold uppercase tracking-wider text-xs transition-all active:scale-95"
          >
            {loading ? <Loader className="w-3.5 h-3.5 animate-spin mr-2" /> : <Save className="w-3.5 h-3.5 mr-2" />}
            {blog ? 'Update Story' : 'Publish Story'}
          </Button>
        </div>
      </div>


      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-12">
          {message && (
            <div className={`p-4 rounded-2xl flex items-center gap-3 border animate-in slide-in-from-top-4 duration-300 ${
              message.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
            }`}>
              <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-12">
            {/* BLOG CARD FIELDS */}
            <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-orange-50 rounded-2xl text-orange-500">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">Blog Identity</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Engaging Title</label>
                  <Input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Enter an engaging title..."
                    className="h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all text-lg font-bold"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Short Summary (for Card)</label>
                  <Textarea 
                    name="subtitle" 
                    value={form.subtitle} 
                    onChange={handleChange} 
                    placeholder="Brief summary for the blog card..."
                    className="rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all resize-none min-h-[100px] leading-relaxed"
                    required 
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Category</label>
                  <Input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="e.g. Travel, Spiritual"
                    className="h-12 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Publish Date</label>
                  <Input
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    className="h-12 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Author Name</label>
                  <Input
                    name="author"
                    value={form.author}
                    onChange={handleChange}
                    placeholder="Writer's name"
                    className="h-12 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Thumbnail (Card Image)</label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                       <Input
                        name="thumbnailImage"
                        value={form.thumbnailImage}
                        onChange={handleChange}
                        placeholder="Image URL or Upload..."
                        className="h-12 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all pr-10 truncate"
                      />
                      {form.thumbnailImage && (
                        <button 
                          type="button"
                          onClick={() => setForm(prev => ({...prev, thumbnailImage: ''}))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <input 
                      type="file" 
                      ref={thumbnailInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={(e) => handleFileUpload(e, 'thumbnailImage')} 
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => thumbnailInputRef.current?.click()}
                      disabled={uploadingField === 'thumbnailImage'}
                      className="h-12 w-12 p-0 rounded-2xl border-gray-100 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-500 transition-all shadow-sm"
                    >
                      {uploadingField === 'thumbnailImage' ? '...' : <Upload className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* HEADING SEPARATOR */}
            <div className="relative py-12">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 border-dashed"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#fcfbf9] px-10 text-3xl font-heading font-bold text-gray-900 tracking-tight">
                  Write the content for blog
                </span>
              </div>
            </div>

            {/* FULL ARTICLE FIELDS */}
            <section className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-10">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-500">
                  <Type className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">Article Narrative</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Author Designation</label>
                  <Input
                    name="authorRole"
                    value={form.authorRole}
                    onChange={handleChange}
                    placeholder="e.g. Spiritual Travel Expert"
                    className="h-12 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Estimated Read Time</label>
                  <Input
                    name="readTime"
                    value={form.readTime}
                    onChange={handleChange}
                    placeholder="e.g. 8 min read"
                    className="h-12 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all font-medium"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Hero Cover Image (High-Res)</label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Input
                        name="coverImage"
                        value={form.coverImage}
                        onChange={handleChange}
                        placeholder="Main high-res image URL or Upload..."
                        className="h-12 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all pr-10 truncate"
                      />
                      {form.coverImage && (
                        <button 
                          type="button"
                          onClick={() => setForm(prev => ({...prev, coverImage: ''}))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <input 
                      type="file" 
                      ref={coverInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={(e) => handleFileUpload(e, 'coverImage')} 
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => coverInputRef.current?.click()}
                      disabled={uploadingField === 'coverImage'}
                      className="h-12 w-12 p-0 rounded-2xl border-gray-100 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-500 transition-all shadow-sm"
                    >
                      {uploadingField === 'coverImage' ? '...' : <Upload className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Article Story (Rich Content)</label>
                  <div className="quill-wrapper rounded-3xl overflow-hidden border border-gray-100 bg-gray-50 focus-within:bg-white focus-within:border-orange-200 transition-all min-h-[450px]">
                    <ReactQuill 
                      theme="snow"
                      value={form.content}
                      onChange={handleEditorChange}
                      modules={quillModules}
                      formats={quillFormats}
                      placeholder="Start writing your beautiful story here..."
                      className="h-full min-h-[400px]"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Tags (comma-separated)</label>
                  <Input
                    name="tags"
                    value={form.tags}
                    onChange={handleChange}
                    placeholder="Varanasi, Spiritual, Pilgrimage, Guide..."
                    className="h-12 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <QuoteIcon className="w-3 h-3" /> Impactful Quotes (one per line)
                  </label>
                  <Textarea
                    name="quotes"
                    value={form.quotes}
                    onChange={handleChange}
                    placeholder="Add powerful quotes to break up the text..."
                    className="rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all resize-none min-h-[140px] leading-relaxed font-serif italic"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <ImageIcon className="w-3 h-3" /> Story Gallery (Image URLs or Uploads)
                  </label>
                  <div className="flex gap-2 h-full min-h-[140px]">
                    <Textarea
                      name="additionalImages"
                      value={form.additionalImages}
                      onChange={handleChange}
                      placeholder="Image URLs or use the upload button to add more..."
                      className="rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all resize-none flex-1 leading-relaxed font-medium"
                    />
                    <div className="flex flex-col gap-2">
                      <input 
                        type="file" 
                        ref={galleryInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={(e) => handleFileUpload(e, 'additionalImages')} 
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => galleryInputRef.current?.click()}
                        disabled={uploadingField === 'additionalImages'}
                        className="flex-1 px-4 rounded-2xl border-gray-100 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-500 transition-all shadow-sm"
                      >
                        {uploadingField === 'additionalImages' ? '...' : <Upload className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full h-16 bg-black hover:bg-gray-900 text-white rounded-3xl text-lg font-bold uppercase tracking-widest shadow-2xl shadow-gray-200 transition-all hover:-translate-y-1 active:scale-[0.98]"
                  >
                    {loading ? 'Processing...' : blog ? 'Update Story' : 'Publish Story'}
                  </Button>
                </div>
              </div>
            </section>
          </form>

          {/* PREVIEWS SECTION */}
          <section className="space-y-12 pb-20">
             <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-gray-200"></div>
                <div className="flex items-center gap-6">
                  <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.3em]">Live Visual Previews</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsFullscreenPreview(true)}
                    className="h-10 rounded-full border-orange-200 text-[10px] font-bold uppercase tracking-wider text-orange-600 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all shadow-sm shadow-orange-50"
                  >
                    <Maximize2 className="w-3.5 h-3.5 mr-2" />
                    Full Window Preview
                  </Button>
                </div>
                <div className="h-px flex-1 bg-gray-200"></div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* CARD PREVIEW */}
                <div className="space-y-6">
                  <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Home Page Card</h4>
                  <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 flex justify-center hover:shadow-2xl transition-all duration-500 group">
                    <div className="max-w-[320px] w-full">
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-gray-50 border border-gray-100">
                        {form.thumbnailImage ? (
                          <img src={form.thumbnailImage} alt="Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-200 bg-gray-50">
                            <ImageIcon className="w-12 h-12" />
                          </div>
                        )}
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-white/90 backdrop-blur shadow-sm rounded-full text-[9px] font-bold text-orange-600 uppercase tracking-wider">{form.category}</span>
                        </div>
                      </div>
                      <h3 className="font-heading font-bold text-gray-900 text-xl leading-tight mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">{form.title || 'Untitled Story'}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-6 font-medium">{form.subtitle || 'Your preview text will appear here...'}</p>
                      <div className="pt-5 border-t border-gray-50 flex justify-between items-center">
                         <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-[10px] font-bold text-orange-600">{form.author?.charAt(0) || 'A'}</div>
                           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{form.author || 'AUTHOR'}</span>
                         </div>
                         <span className="text-[10px] font-bold text-orange-500 flex items-center gap-1 uppercase tracking-wider">Read More <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" /></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DETAIL HEADER PREVIEW */}
                <div className="space-y-6">
                  <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Article Hero Header</h4>
                  <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 flex items-center justify-center min-h-[420px]">
                    <div className="text-center w-full">
                       <div className="flex items-center justify-center gap-4 mb-8 flex-wrap">
                         <span className="text-[11px] font-bold text-orange-500 uppercase tracking-[0.2em] px-4 py-1.5 bg-orange-50 rounded-full border border-orange-100 shadow-sm">
                           {form.category}
                         </span>
                         <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                           {new Date(form.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                         </span>
                       </div>
                       <h3 className="font-heading text-4xl font-bold text-gray-900 leading-[1.1] mb-10 max-w-md mx-auto tracking-tight">{form.title || 'Your Article Title'}</h3>
                       <div className="flex items-center justify-center gap-4 pt-4">
                         <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-red-500 border-4 border-white shadow-xl flex items-center justify-center text-white font-bold text-lg">
                           {form.author?.charAt(0) || 'A'}
                         </div>
                         <div className="text-left">
                           <p className="font-bold text-gray-900 text-base leading-none">{form.author || 'Author Name'}</p>
                           <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mt-1.5">{form.authorRole}</p>
                         </div>
                       </div>
                    </div>
                  </div>
                </div>
             </div>
          </section>
        </div>
      </div>

      {/* FULLSCREEN PREVIEW MODAL */}
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
            <section className="pt-24 pb-20 text-center px-8">
                <div className="flex items-center justify-center gap-4 mb-10 flex-wrap">
                  <span className="text-[12px] font-bold text-orange-500 uppercase tracking-[0.3em] px-5 py-2 bg-orange-50 rounded-full border border-orange-100 shadow-sm">
                    {form.category}
                  </span>
                  <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">
                    {new Date(form.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                  <span className="flex items-center gap-2 text-[12px] font-bold text-gray-400 uppercase tracking-widest">
                    <Clock size={14} className="text-orange-300" /> {form.readTime}
                  </span>
                </div>

                <h1 className="font-heading text-5xl md:text-6xl lg:text-8xl font-bold text-gray-900 leading-[1.02] mb-16 tracking-tighter max-w-[900px] mx-auto">
                  {form.title}
                </h1>

                <div className="flex items-center justify-center gap-5">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 border-4 border-white shadow-2xl flex items-center justify-center text-white font-bold text-xl">
                    {form.author?.charAt(0) || 'A'}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-900 text-lg leading-tight">{form.author}</p>
                    <p className="text-gray-500 text-[11px] font-bold uppercase tracking-[0.2em] mt-1">{form.authorRole}</p>
                  </div>
                </div>
              </section>

              {form.coverImage && (
                <section className="px-8 mb-24">
                  <div className="max-w-[1100px] mx-auto relative aspect-[21/9] md:aspect-[2.5/1] rounded-[3rem] overflow-hidden shadow-2xl bg-gray-50 border border-gray-100 p-1">
                    <div className="w-full h-full rounded-[2.8rem] overflow-hidden">
                      <img src={form.coverImage} className="w-full h-full object-cover" alt="" />
                    </div>
                  </div>
                </section>
              )}

              <section className="px-8 relative">
                <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-12 relative">
                  
                  {/* LEFT: SOCIAL SHARE (Restored) */}
                  <div className="hidden lg:block w-16 shrink-0 relative">
                    <div className="sticky top-32 flex flex-col gap-4">
                      <div className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-2" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Share Article</div>
                      <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 bg-white shadow-sm hover:text-orange-500 hover:border-orange-200 transition-all"><Share2 size={16} /></button>
                      <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 bg-white shadow-sm hover:text-orange-500 hover:border-orange-200 transition-all"><Link2 size={16} /></button>
                      <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 bg-white shadow-sm hover:text-orange-500 hover:border-orange-200 transition-all"><Compass size={16} /></button>
                    </div>
                  </div>

                  <article className="max-w-[700px] w-full">
                    <div className="premium-article-wrapper">
                      {renderPremiumContent(form.content)}
                    </div>

                    {form.quotes && form.quotes.split('\n').filter(Boolean).map((quote, i) => (
                      <blockquote key={i} className="relative p-12 md:p-20 bg-white rounded-[3rem] shadow-2xl shadow-orange-100/20 border border-orange-50 my-24 text-center">
                        <QuoteIcon className="absolute top-10 left-1/2 -translate-x-1/2 text-orange-100 w-24 h-24 rotate-180 -z-0 opacity-40" />
                        <p className="relative z-10 text-3xl md:text-4xl font-heading font-medium italic text-gray-900 leading-snug">"{quote}"</p>
                      </blockquote>
                    ))}

                    {form.additionalImages && form.additionalImages.split('\n').filter(Boolean).map((img, i) => (
                      <div key={i} className="relative w-full aspect-video rounded-[3rem] overflow-hidden bg-gray-100 my-20 shadow-2xl border border-gray-200 p-1">
                        <div className="w-full h-full rounded-[2.8rem] overflow-hidden">
                          <img src={img} className="w-full h-full object-cover" alt="" />
                        </div>
                      </div>
                    ))}

                    {form.tags && (
                      <div className="flex flex-wrap justify-center gap-4 mt-24 pt-12 border-t border-gray-100">
                        {form.tags.split(',').map((tag, index) => (
                          <span key={`${tag}-${index}`} className="px-8 py-3 bg-white border border-gray-200 rounded-full text-[11px] font-bold text-gray-500 uppercase tracking-[0.3em] hover:border-orange-500 hover:text-orange-500 transition-all shadow-sm">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>

                  {/* RIGHT: CONVERSION CTA (Restored) */}
                  <div className="hidden lg:block w-[360px] shrink-0 relative">
                    <div className="sticky top-32 bg-white rounded-[3rem] p-10 shadow-[0_40px_80px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden group">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-orange-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none opacity-40" />
                      <div className="relative z-10 text-center">
                        <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-orange-100">
                          <Compass className="w-8 h-8 text-orange-500" />
                        </div>
                        <h3 className="font-heading text-3xl font-bold text-gray-900 mb-4 tracking-tight">Inspired to visit?</h3>
                        <p className="text-sm text-gray-500 leading-relaxed mb-10 font-medium">Our local experts are ready to craft your perfect spiritual retreat.</p>
                        <div className="flex flex-col gap-4">
                          <button className="w-full py-5 bg-orange-500 text-white text-sm font-bold rounded-2xl shadow-xl shadow-orange-100 uppercase tracking-widest hover:brightness-110 transition-all">Enquire Now</button>
                          <button className="w-full py-5 bg-white border border-gray-200 text-gray-900 text-sm font-bold rounded-2xl uppercase tracking-widest hover:border-orange-500 hover:text-orange-500 transition-all">Customise Journey</button>
                        </div>
                      </div>
                      <div className="mt-10 pt-10 border-t border-gray-50 relative z-10">
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 text-[13px] font-bold text-gray-700"><div className="w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-[12px]">✓</div>Local Expertise & Access</div>
                          <div className="flex items-center gap-4 text-[13px] font-bold text-gray-700"><div className="w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-[12px]">✓</div>Verified Premium Stays</div>
                          <div className="flex items-center gap-4 text-[13px] font-bold text-gray-700"><div className="w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-[12px]">✓</div>24/7 Spiritual Concierge</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
          </div>
        </div>
      )}

      <style>{`
        .quill-wrapper .ql-toolbar.ql-snow {
          border: none;
          background: #fff;
          padding: 1rem;
          border-bottom: 1px solid #f3f4f6;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .quill-wrapper .ql-container.ql-snow {
          border: none;
          font-family: inherit;
          font-size: 1rem;
        }
        .quill-wrapper .ql-editor {
          padding: 2rem;
          min-height: 400px;
          line-height: 1.8;
          color: #374151;
        }
        .quill-wrapper .ql-editor p {
          margin-bottom: 1.5rem;
        }
        .quill-wrapper .ql-editor h1, .quill-wrapper .ql-editor h2 {
          font-family: var(--font-heading);
          font-weight: bold;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #111827;
        }
        
        .premium-article-content {
          font-family: 'Georgia', serif;
          font-size: 1.25rem;
          line-height: 1.8;
          color: #374151;
        }
        .premium-article-content p {
          margin-bottom: 2rem;
        }
        .premium-article-content h1, 
        .premium-article-content h2, 
        .premium-article-content h3 {
          font-family: var(--font-heading);
          color: #111827;
          font-weight: bold;
          margin-top: 3rem;
          margin-bottom: 1.5rem;
        }
        .premium-article-content h1 { font-size: 2.5rem; }
        .premium-article-content h2 { font-size: 2rem; }
        .premium-article-content h3 { font-size: 1.5rem; }
        
        .premium-article-content a {
          color: #f97316;
          text-decoration: underline;
          text-underline-offset: 4px;
          font-weight: 600;
        }
        
        .premium-article-content ul, .premium-article-content ol {
          margin-bottom: 2rem;
          padding-left: 1.5rem;
          list-style-type: disc;
        }
        .premium-article-content li {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
}

function FileText(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}

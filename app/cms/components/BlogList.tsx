'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader, Plus, RefreshCw, Search, LayoutGrid, List as ListIcon, Trash2, Edit3, Eye } from 'lucide-react';
import { Blog, BlogListProps } from './types';

const API_BASE = "/api";

export default function BlogList({
  blogs,
  selectedBlog,
  onSelectBlog,
  onCreateNew,
  onDeleteBlog,
  loading,
  onRefresh,
  fullWidth = false,
  title = "Blog Articles",
}: BlogListProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>(fullWidth ? 'grid' : 'list');

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this story?')) return;
    
    try {
      const response = await fetch(`${API_BASE}/blogs/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        if (onDeleteBlog) onDeleteBlog(id);
        onRefresh();
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`h-full flex flex-col bg-white ${fullWidth ? 'max-w-[1200px] mx-auto w-full' : ''}`}>
      {/* Header */}
      <div className={`p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${fullWidth ? 'mt-8' : ''}`}>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h2>
          <p className="text-sm text-gray-500 mt-1">Manage and edit your travel stories</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl mr-2">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search stories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent rounded-xl text-sm focus:bg-white focus:border-orange-200 transition-all outline-none"
            />
          </div>
          <button 
            onClick={onRefresh} 
            disabled={loading}
            className="p-2.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all disabled:opacity-50 border border-transparent hover:border-orange-100"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Button 
            onClick={onCreateNew} 
            className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-100 px-6 h-11 rounded-xl font-bold uppercase tracking-wider text-[10px]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New
          </Button>
        </div>
      </div>

      {/* Blog List/Grid */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader className="w-10 h-10 animate-spin mb-4 text-orange-500" />
            <p className="text-xs font-bold uppercase tracking-widest">Syncing Articles...</p>
          </div>
        )}

        {!loading && filteredBlogs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
            <div className="w-16 h-16 bg-white rounded-[2rem] flex items-center justify-center mb-6 shadow-sm">
              <Search className="w-8 h-8 text-gray-200" />
            </div>
            <p className="text-gray-900 font-bold text-lg">No articles found</p>
            <p className="text-gray-400 text-sm mt-2 max-w-xs mx-auto">We couldn't find any stories matching your search. Try a different keyword or create a new post.</p>
            <Button onClick={onCreateNew} variant="outline" className="mt-8 rounded-xl border-orange-200 text-orange-500 hover:bg-orange-50">
              Create New Article
            </Button>
          </div>
        )}

        {!loading && filteredBlogs.length > 0 && viewMode === 'grid' && (
          <div className={fullWidth ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-4"}>
            {filteredBlogs.map((blog) => (
              <button
                key={blog.id}
                onClick={() => onSelectBlog(blog)}
                className={`text-left transition-all relative group ${
                  fullWidth 
                    ? 'bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-100 hover:-translate-y-1' 
                    : `w-full p-4 rounded-2xl border ${selectedBlog?.id === blog.id ? 'bg-orange-50 border-orange-200' : 'bg-white border-transparent hover:bg-gray-50'}`
                }`}
              >
                <div className={fullWidth ? "flex flex-col relative" : "flex gap-4 items-center relative"}>
                  <div className={fullWidth ? "aspect-[16/9] w-full relative bg-gray-100" : "w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0"}>
                    {blog.thumbnailImage ? (
                      <img
                        src={blog.thumbnailImage}
                        alt=""
                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/800x450/f3f4f6/9ca3af?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 uppercase text-[10px] font-bold">No Image</div>
                    )}
                    
                    {/* Hover Actions for Grid View */}
                    {fullWidth && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <Button 
                          size="sm" 
                          className="bg-white text-gray-900 hover:bg-orange-500 hover:text-white rounded-xl font-bold text-[10px] uppercase tracking-wider"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectBlog(blog);
                          }}
                        >
                          Edit Story
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          className="bg-white/10 backdrop-blur-md text-white hover:bg-red-500 border border-white/20 rounded-xl font-bold text-[10px] uppercase tracking-wider"
                          onClick={(e) => handleDelete(blog.id, e)}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className={fullWidth ? "p-6" : "flex-1 min-w-0"}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-bold text-orange-500 uppercase tracking-[0.2em]">{blog.category}</span>
                      {!fullWidth && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectBlog(blog);
                            }}
                            className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={(e) => handleDelete(blog.id, e)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                    <h3 className={`font-bold text-gray-900 leading-tight ${fullWidth ? 'text-lg line-clamp-2' : 'text-sm truncate'} group-hover:text-orange-600 transition-colors`}>
                      {blog.title}
                    </h3>
                    {fullWidth && (
                      <p className="text-gray-500 text-xs mt-3 line-clamp-2 leading-relaxed">
                        {blog.subtitle}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
                      <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-[10px] font-bold text-orange-600">
                        {blog.author.charAt(0)}
                      </div>
                      <span className="text-[10px] font-semibold text-gray-400 truncate uppercase tracking-widest">{blog.author}</span>
                      <span className="ml-auto text-[10px] font-medium text-gray-400">{new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {!loading && filteredBlogs.length > 0 && viewMode === 'list' && (
          <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Story</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Author</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                          <img 
                            src={blog.thumbnailImage} 
                            alt="" 
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/f3f4f6/9ca3af?text=NA'; }}
                          />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm line-clamp-1">{blog.title}</p>
                          <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">{blog.subtitle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {blog.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{blog.author}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{new Date(blog.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${
                        blog.status === 'draft' ? 'bg-gray-100 text-gray-500' : 'bg-green-50 text-green-600'
                      }`}>
                        {blog.status || 'published'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => onSelectBlog(blog)}
                          className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => handleDelete(blog.id, e)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => window.open(`/blog/${blog.slug}`, '_blank')}
                          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                          title="View Live"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

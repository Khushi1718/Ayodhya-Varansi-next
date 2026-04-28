'use client';

import React, { useState, useEffect } from 'react';
import BlogList from './BlogList';
import BlogDetail from './BlogDetail';
import { Loader } from 'lucide-react';
import { Blog } from './types';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:17182';

export default function BlogManager() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false); // Default to false to show the list of blogs first
  const [isViewingDrafts, setIsViewingDrafts] = useState(false);

  // Fetch all blogs on mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/admin/blogs`);
      const data = await response.json();

      if (data.success) {
        setBlogs(data.data);
      }
    } catch (error) {
      console.error('Connection error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlogSelect = (blog: Blog) => {
    setSelectedBlog(blog);
    setIsViewingDrafts(false);
    setShowCreateForm(false);
  };

  const handleBlogDeleted = () => {
    setSelectedBlog(null);
    fetchBlogs();
  };

  const handleBlogCreated = () => {
    // setShowCreateForm(false);
    setSelectedBlog(null);
    setIsViewingDrafts(false);
    fetchBlogs();
  };

  const drafts = blogs.filter(b => b.status === 'draft');
  const published = blogs.filter(b => b.status !== 'draft');

  return (
    <div className="flex-1 bg-[#fcfbf9] overflow-hidden flex flex-col h-screen">
      {/* Header with Navigation */}
      <div className="bg-white border-b border-gray-100 px-8 pt-8 pb-0 shrink-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Editorial Manager</h1>
            <p className="text-sm text-gray-500 mt-1">Compose and curate your travel narratives</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <button 
            onClick={() => {
              setIsViewingDrafts(false);
              setShowCreateForm(false);
              setSelectedBlog(null);
            }}
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
              !isViewingDrafts && !showCreateForm && !selectedBlog 
                ? 'text-orange-500' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            Published Stories
            <span className="ml-2 bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-[10px]">{published.length}</span>
            {!isViewingDrafts && !showCreateForm && !selectedBlog && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
            )}
          </button>
          <button 
            onClick={() => {
              setIsViewingDrafts(true);
              setShowCreateForm(false);
              setSelectedBlog(null);
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
              setSelectedBlog(null);
              setIsViewingDrafts(false);
            }}
            className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
              showCreateForm && !selectedBlog
                ? 'text-orange-500' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            New Article
            {showCreateForm && !selectedBlog && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
            )}
          </button>
          {selectedBlog && (
            <button 
              className="pb-4 text-sm font-bold uppercase tracking-widest text-orange-500 relative"
            >
              Editing: {selectedBlog.title.substring(0, 20)}...
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative bg-white">
        {isViewingDrafts ? (
          <BlogList
            title="Manage Drafts"
            blogs={drafts}
            selectedBlog={selectedBlog}
            onSelectBlog={handleBlogSelect}
            onCreateNew={() => {
              setShowCreateForm(true);
              setSelectedBlog(null);
              setIsViewingDrafts(false);
            }}
            onDeleteBlog={handleBlogDeleted}
            loading={loading}
            onRefresh={fetchBlogs}
            fullWidth={true}
          />
        ) : (showCreateForm || selectedBlog) ? (
          <div className="h-full overflow-y-auto">
            <BlogDetail 
              blog={selectedBlog} 
              onDeleted={handleBlogDeleted} 
              onCreated={handleBlogCreated}
              onViewDrafts={() => setIsViewingDrafts(true)}
              onBack={() => {
                if (selectedBlog) {
                  setSelectedBlog(null);
                } else {
                  setShowCreateForm(false);
                }
              }}
            />
          </div>
        ) : (
          <BlogList
            title="Manage Published Stories"
            blogs={published}
            selectedBlog={selectedBlog}
            onSelectBlog={handleBlogSelect}
            onCreateNew={() => {
              setShowCreateForm(true);
              setSelectedBlog(null);
            }}
            onDeleteBlog={handleBlogDeleted}
            loading={loading}
            onRefresh={fetchBlogs}
            fullWidth={true}
          />
        )}
      </div>
    </div>
  );
}




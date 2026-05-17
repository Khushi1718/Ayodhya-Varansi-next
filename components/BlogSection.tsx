"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Loader } from "lucide-react";
import { useState, useEffect } from "react";

const API_BASE = "/api";

const ArticleCard = ({ post }: { post: any }) => {
  return (
    <Link href={`/blog/${post.slug}`} className="flex flex-col group cursor-pointer h-full">
      <div className="relative w-full overflow-hidden mb-5 bg-[#f4f2ee] aspect-[4/3] rounded-[1.5rem] shadow-sm border border-gray-100 p-0.5">
        <div className="w-full h-full rounded-[1.4rem] overflow-hidden">
          {post.thumbnailImage || post.image ? (
            <img
              src={post.thumbnailImage || post.image}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
          )}
        </div>
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-md shadow-sm rounded-full text-[9px] font-bold text-orange-600 uppercase tracking-widest border border-orange-50">{post.category || "TRAVEL GUIDE"}</span>
        </div>
      </div>
      <div className="flex flex-col flex-1 px-1">
        <h3 className="font-heading font-bold text-gray-900 mb-3 leading-[1.2] group-hover:text-orange-500 transition-colors text-lg lg:text-xl tracking-tight">
          {post.title}
        </h3>
        <p className="text-gray-500 font-medium leading-relaxed mb-6 text-sm line-clamp-2">
          {post.preview || post.subtitle}
        </p>
        <div className="mt-auto pt-4 flex justify-between items-center border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-[10px] font-bold text-orange-600 border border-white shadow-sm">
              {post.author?.charAt(0) || 'G'}
            </div>
            <span className="text-[10px] font-bold text-gray-400 tracking-[0.1em] uppercase">
              {post.author}
            </span>
          </div>
          <span className="text-[10px] font-bold text-gray-400 group-hover:text-orange-500 flex items-center gap-1.5 transition-all uppercase tracking-widest">
            Read Full Story <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  )
}

const BlogSection = () => {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE}/blogs`);
        const data = await response.json();

        if (data.success && data.data) {
          // Show first 5 blogs on homepage
          setBlogs(data.data.slice(0, 5));
        } else {
          setError('Failed to fetch blogs');
          setBlogs([]);
        }
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section id="blog" className="py-24 md:py-32 bg-[#fafaf8] border-t border-gray-50">
      <div className="max-w-[1300px] mx-auto px-6 md:px-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-xl">
            <p className="text-orange-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-4">Latest from The Journal</p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
              Spiritual Wisdom & Local Guides
            </h2>
          </div>
          <Link href="/blog" className="inline-flex items-center gap-3 text-[11px] font-bold tracking-[0.2em] text-gray-400 hover:text-orange-500 transition-all uppercase group whitespace-nowrap border-b border-gray-100 pb-2 hover:border-orange-200">
            Explore All Stories
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-20">
            {[1,2,3,4].map(i => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="aspect-[4/3] bg-gray-100 rounded-2xl" />
                <div className="h-4 bg-gray-100 w-1/2 rounded" />
                <div className="h-10 bg-gray-100 w-full rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* ASYMMETRICAL GRID LAYOUT - 5 BLOGS */}
        {!loading && !error && blogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            {/* LEFT COLUMN - 2 SMALL CARDS */}
            <div className="col-span-1 md:col-span-3 flex flex-col gap-12">
              {blogs[0] && <ArticleCard post={blogs[0]} />}
              {blogs[1] && <ArticleCard post={blogs[1]} />}
            </div>

            {/* CENTER COLUMN - 1 LARGE FEATURED CARD */}
            <div className="col-span-1 md:col-span-6">
              {blogs[2] && (
                <Link href={`/blog/${blogs[2].slug}`} className="flex flex-col group cursor-pointer h-full">
                  <div className="relative w-full overflow-hidden mb-6 bg-[#f4f2ee] aspect-square rounded-[2.5rem] shadow-xl border border-gray-100 p-1">
                    <div className="w-full h-full rounded-[2.3rem] overflow-hidden">
                      {blogs[2].thumbnailImage || blogs[2].image ? (
                        <img
                          src={blogs[2].thumbnailImage || blogs[2].image}
                          alt={blogs[2].title}
                          className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                      )}
                    </div>
                    <div className="absolute top-8 left-8">
                       <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md shadow-lg rounded-full text-[10px] font-bold text-orange-600 uppercase tracking-widest border border-orange-50">FEATURED STORY</span>
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 px-4">
                    <h3 className="font-heading font-bold text-gray-900 mb-5 leading-[1.1] group-hover:text-orange-500 transition-colors text-2xl lg:text-4xl tracking-tighter">
                      {blogs[2].title}
                    </h3>
                    <p className="text-gray-500 font-medium leading-relaxed mb-8 text-base lg:text-lg">
                      {blogs[2].preview || blogs[2].subtitle}
                    </p>
                    <div className="mt-auto pt-6 flex justify-between items-center border-t border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-600 border-2 border-white shadow-md">
                          {blogs[2].author?.charAt(0) || 'G'}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 leading-none">{blogs[2].author}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Spiritual Expert</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 group-hover:translate-x-2 transition-transform">
                        <span className="text-[11px] font-bold text-gray-400 group-hover:text-orange-500 uppercase tracking-[0.2em]">Read Full Story</span>
                        <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500 transition-all text-gray-400 shadow-sm">
                          <ArrowRight size={20} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </div>

            {/* RIGHT COLUMN - 2 SMALL CARDS */}
            <div className="col-span-1 md:col-span-3 flex flex-col gap-12">
              {blogs[3] && <ArticleCard post={blogs[3]} />}
              {blogs[4] && <ArticleCard post={blogs[4]} />}
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && blogs.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-gray-200">
            <p className="text-gray-400 font-medium italic">New spiritual stories are being curated. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;

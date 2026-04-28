"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Loader } from "lucide-react";
import { useState, useEffect } from "react";

const API_BASE = "/api";

const ArticleCard = ({ post }: { post: any }) => {
  return (
    <Link href={`/blog/${post.slug}`} className="flex flex-col group cursor-pointer h-full">
      <div className="relative w-full overflow-hidden mb-4 bg-[#f4f2ee] aspect-[4/3] rounded-xl">
        {post.thumbnailImage || post.image ? (
          <img
            src={post.thumbnailImage || post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
        )}
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
      </div>
      <div className="flex flex-col flex-1">
        <span className="text-[9px] font-bold text-[hsl(var(--primary))] tracking-[0.2em] uppercase mb-2">
          {post.category || "Travel"}
        </span>
        <h3 className="font-heading font-bold text-gray-900 mb-2 leading-tight group-hover:text-[hsl(var(--primary))] transition-colors text-base lg:text-lg">
          {post.title}
        </h3>
        <p className="text-gray-500 font-normal leading-relaxed mb-4 text-sm lg:text-[15px]">
          {post.preview}
        </p>
        <div className="mt-auto pt-1 flex justify-between items-center border-t border-gray-100/50 pt-3">
          <span className="text-[9px] font-semibold text-gray-400 tracking-[0.15em] uppercase">
            {post.author}
          </span>
          <span className="text-[11px] font-bold text-gray-400 group-hover:text-[hsl(var(--primary))] flex items-center gap-1 transition-colors uppercase tracking-[0.1em]">
            Read Full <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
    <section id="blog" className="py-16 md:py-24 bg-[#fcfbf9] border-t border-gray-100">
      <div className="max-w-[1140px] mx-auto px-6 md:px-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 border-b border-gray-200 pb-5 relative">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mx-auto text-center w-full uppercase tracking-tight">
            Travel Stories & Guides
          </h2>
          <Link href="/blog" className="mt-4 md:mt-0 md:absolute right-0 flex items-center justify-center gap-2 text-[11px] font-bold tracking-[0.15em] text-[hsl(var(--primary))] bg-white border border-[hsl(var(--primary))] px-6 py-3 rounded-xl hover:bg-[hsl(var(--primary))] hover:text-white transition-all shadow-sm uppercase group">
            Explore More
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader className="w-6 h-6 animate-spin text-[hsl(var(--primary))]" />
          </div>
        )}

        {/* ERROR STATE */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 text-yellow-800">
            <p className="text-sm">Unable to load blog posts. Please try again later.</p>
          </div>
        )}

        {/* ASYMMETRICAL GRID LAYOUT - 5 BLOGS */}
        {!loading && !error && blogs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN - 2 SMALL CARDS */}
            <div className="col-span-1 md:col-span-3 flex flex-col gap-8">
              {blogs[0] && <ArticleCard post={blogs[0]} />}
              {blogs[1] && <ArticleCard post={blogs[1]} />}
            </div>

            {/* CENTER COLUMN - 1 LARGE FEATURED CARD */}
            <div className="col-span-1 md:col-span-6">
              {blogs[2] && (
                <Link href={`/blog/${blogs[2].slug}`} className="flex flex-col group cursor-pointer h-full">
                  <div className="relative w-full overflow-hidden mb-4 bg-[#f4f2ee] aspect-square rounded-xl">
                    {blogs[2].thumbnailImage || blogs[2].image ? (
                      <img
                        src={blogs[2].thumbnailImage || blogs[2].image}
                        alt={blogs[2].title}
                        className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
                    )}
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-[9px] font-bold text-[hsl(var(--primary))] tracking-[0.2em] uppercase mb-2">
                      {blogs[2].category || "Travel"}
                    </span>
                    <h3 className="font-heading font-bold text-gray-900 mb-2 leading-tight group-hover:text-[hsl(var(--primary))] transition-colors text-lg lg:text-xl">
                      {blogs[2].title}
                    </h3>
                    <p className="text-gray-500 font-normal leading-relaxed mb-4 text-sm lg:text-base">
                      {blogs[2].preview}
                    </p>
                    <div className="mt-auto pt-3 flex justify-between items-center border-t border-gray-100/50">
                      <span className="text-[9px] font-semibold text-gray-400 tracking-[0.15em] uppercase">
                        {blogs[2].author}
                      </span>
                      <span className="text-[11px] font-bold text-gray-400 group-hover:text-[hsl(var(--primary))] flex items-center gap-1 transition-colors uppercase tracking-[0.1em]">
                        Read Full <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              )}
            </div>

            {/* RIGHT COLUMN - 2 SMALL CARDS */}
            <div className="col-span-1 md:col-span-3 flex flex-col gap-8">
              {blogs[3] && <ArticleCard post={blogs[3]} />}
              {blogs[4] && <ArticleCard post={blogs[4]} />}
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && !error && blogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No blog posts available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;

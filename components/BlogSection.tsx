"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Loader } from "lucide-react";
import { useState, useEffect } from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:17182';

const ArticleCard = ({ post, isMain = false }: { post: any, isMain?: boolean }) => {
  return (
    <Link href={`/blog/${post.slug}`} className="flex flex-col group cursor-pointer h-full">
      <div className={`relative w-full overflow-hidden mb-3.5 bg-[#f4f2ee] ${isMain ? 'aspect-[4/5]' : 'aspect-[4/3]'} rounded-xl`}>
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
        <h3 className={`font-heading font-bold text-gray-900 mb-2 leading-tight group-hover:text-[hsl(var(--primary))] transition-colors ${isMain ? 'text-2xl lg:text-[28px]' : 'text-[15px] lg:text-base'}`}>
          {post.title}
        </h3>
        <p className={`text-gray-500 font-normal leading-relaxed mb-4 ${isMain ? 'text-sm lg:text-[15px]' : 'text-xs lg:text-[13px]'}`}>
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
        const response = await fetch(`${BACKEND_URL}/blogs`);
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

  const featuredPost = blogs[0];
  const otherPosts = blogs.slice(1);

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

        {/* FEATURED POST + GRID */}
        {!loading && !error && blogs.length > 0 && (
          <div>
            {/* FEATURED POST */}
            {featuredPost && (
              <div className="mb-16 md:mb-20">
                <Link href={`/blog/${featuredPost.slug}`} className="group cursor-pointer grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100 transition-shadow hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] block">
                  <div className="relative aspect-square lg:aspect-auto lg:h-full overflow-hidden bg-gray-200">
                    {featuredPost.thumbnailImage ? (
                      <img
                        src={featuredPost.thumbnailImage}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
                    )}
                  </div>
                  <div className="p-10 md:p-16 flex flex-col justify-center">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-[10px] font-bold text-[hsl(var(--primary))] tracking-[0.2em] uppercase">
                        {featuredPost.category || "Featured"}
                      </span>
                      <span className="w-8 h-px bg-gray-200"></span>
                      <span className="text-[10px] font-semibold text-gray-400 tracking-[0.1em] uppercase">
                        {new Date(featuredPost.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-[1.15] group-hover:text-[hsl(var(--primary))] transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8">
                      {featuredPost.preview || featuredPost.subtitle}
                    </p>
                    <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-semibold text-gray-400 tracking-[0.15em] uppercase mb-1">
                          BY {featuredPost.author}
                        </span>
                        <span className="text-xs text-gray-900 font-medium">{new Date(featuredPost.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                        <span className="text-[11px] font-bold text-[hsl(var(--primary))] uppercase tracking-wider">
                          Read Full Story
                        </span>
                        <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-[hsl(var(--primary))] group-hover:bg-[hsl(var(--primary))] group-hover:text-white transition-all text-gray-900">
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* GRID OF OTHER BLOGS */}
            {otherPosts.length > 0 && (
              <div>
                <h3 className="font-heading text-2xl font-bold text-gray-900 mb-10 border-b border-gray-200 pb-5">
                  Latest Stories
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                  {otherPosts.map((post, i) => (
                    <ArticleCard key={i} post={post} />
                  ))}
                </div>
              </div>
            )}
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

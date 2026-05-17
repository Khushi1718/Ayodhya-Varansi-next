"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function BlogContent({ blogs }: { blogs: any[] }) {
  const featuredPost = blogs[0] || null;
  const otherPosts = blogs.slice(1);

  return (
    <main className="min-h-screen bg-[#fafaf8] pt-24 pb-20">
      <div className="max-w-[1300px] mx-auto px-6 md:px-10">
        <div className="py-14 md:py-16 text-center max-w-4xl mx-auto">
          <h1 className="font-heading text-[56px] md:text-[80px] font-bold text-[#111b34] leading-[1.03] tracking-tight">
            The Journal
          </h1>
          <p className="mt-6 text-[#2f3747] text-[18px] md:text-[20px] leading-[1.45] max-w-[980px] mx-auto">
            Travel stories, expert guides, and inspiration for your next divine journey. Curated by the people who know India best.
          </p>
        </div>

        {/* FEATURED POST */}
        {featuredPost && (
          <div className="mb-12 md:mb-16">
            <Link href={`/blog/${featuredPost.slug}`} className="group cursor-pointer grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-[28px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100 transition-shadow hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] block">
              <div className="relative aspect-[4/3] lg:aspect-[16/11] overflow-hidden bg-gray-200">
                {featuredPost.coverImage || featuredPost.thumbnailImage ? (
                  <img 
                    src={featuredPost.coverImage || featuredPost.thumbnailImage} 
                    alt={featuredPost.title}
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300" />
                )}
              </div>
              <div className="p-8 md:p-10 flex flex-col justify-start bg-[#f7f7fa]">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-[10px] font-bold text-[hsl(var(--primary))] tracking-[0.2em] uppercase">
                    Featured Story
                  </span>
                  <span className="w-8 h-px bg-gray-200"></span>
                  <span className="text-[10px] font-semibold text-gray-400 tracking-[0.1em] uppercase">
                    {featuredPost.readTime || "5 min read"}
                  </span>
                </div>
                <h2 className="font-heading text-[40px] md:text-[60px] font-bold text-[hsl(var(--primary))] mb-4 leading-[1.05] transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-[#56627a] text-[16px] md:text-[18px] leading-[1.5] mb-6">
                  {featuredPost.preview || featuredPost.subtitle || featuredPost.seoDescription}
                </p>
                <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-5">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-semibold text-gray-400 tracking-[0.15em] uppercase mb-1">
                      BY {featuredPost.author || "Experience My India"}
                    </span>
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

        {/* LATEST POSTS GRID */}
        {blogs.length > 0 ? (
          <div className="mb-10">
            <div className="flex items-center justify-between mb-10 border-b border-gray-200 pb-4">
              <h3 className="font-heading text-4xl font-bold text-[#111b34] leading-none">
                {blogs.length > 1 ? 'Latest Stories' : 'Blog Posts'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {otherPosts.map((post: any, index: number) => (
                <Link href={`/blog/${post.slug}`} key={`blog-card-${post.id || index}-${index}`} className="flex flex-col group cursor-pointer h-full block">
                  <div className="relative w-full aspect-[4/3] overflow-hidden mb-4 bg-[#f4f2ee] rounded-xl">
                    {post.coverImage || post.thumbnailImage ? (
                      <img
                        src={post.coverImage || post.thumbnailImage}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300" />
                    )}
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-[9px] font-bold text-[hsl(var(--primary))] tracking-[0.2em] uppercase mb-2">
                      {post.category || "Travel"}
                    </span>
                    <h4 className="font-heading font-bold text-[24px] text-[#111b34] mb-3 leading-[1.18] group-hover:text-[hsl(var(--primary))] transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    <p className="text-[#646f85] font-normal leading-relaxed text-[16px] mb-5 line-clamp-3">
                      {post.preview || post.subtitle || post.seoDescription}
                    </p>
                    <div className="mt-auto pt-3 border-t border-gray-100 transition-colors flex items-center justify-between">
                      <span className="text-[9px] font-semibold text-gray-400 tracking-[0.15em] uppercase line-clamp-1">
                        BY {post.author || "Experience My India"}
                      </span>
                      <span className="text-[11px] font-bold text-gray-400 group-hover:text-[hsl(var(--primary))] flex items-center gap-1 transition-colors uppercase tracking-[0.1em]">
                        Read <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No blogs found yet.</p>
          </div>
        )}
      </div>
    </main>
  );
}

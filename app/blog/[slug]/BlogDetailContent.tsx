"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, Share2, Link2, Compass, MessageCircle, Mail, MapPin } from "lucide-react";
// Force Refresh: v2.1.0 - purging legacy static fields
export default function BlogDetailContent({ blog, relatedBlogs }: { blog: any, relatedBlogs: any[] }) {
  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: blog?.title,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing", err);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const renderContentWithDropCap = (html: string) => {
    if (!html) return null;
    
    const paragraphs = html.split('</p>');
    if (paragraphs.length > 0 && paragraphs[0].includes('<p>')) {
      const firstP = paragraphs[0];
      const match = firstP.match(/<p>(.*)/);
      if (match && match[1]) {
        const text = match[1];
        const firstChar = text.charAt(0);
        const restText = text.slice(1);
        const updatedFirstP = `<p><span class="float-left text-6xl leading-[0.8] pr-3 pt-1 font-heading font-bold text-[hsl(var(--primary))]">${firstChar}</span>${restText}`;
        paragraphs[0] = updatedFirstP;
        return <div className="premium-article-content" dangerouslySetInnerHTML={{ __html: paragraphs.join('</p>') }} />;
      }
    }
    
    return <div className="premium-article-content" dangerouslySetInnerHTML={{ __html: html }} />;
  };

  // Generate TOC items from H2s in content
  const tocItems = blog.content?.match(/<h2 id="(.*?)">(.*?)<\/h2>/g)?.map((h2: string) => {
    const id = h2.match(/id="(.*?)"/)?.[1];
    const title = h2.match(/<\/h2>/) ? h2.replace(/<h2.*?>/, '').replace(/<\/h2>/, '') : '';
    return { id, title };
  }) || [];

  return (
    <main className="min-h-screen bg-[#fafaf8] selection:bg-[hsl(var(--primary))] selection:text-white pb-20">
      
      {/* ── HEADER OVERLAY ── */}
      <section className="pt-24 pb-12 px-6">
        <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
           <Link href="/" className="inline-flex items-center gap-2 text-[11px] font-bold text-gray-400 hover:text-[hsl(var(--primary))] transition-colors uppercase tracking-[0.15em]">
             <ArrowLeft size={14} /> Back to Home
           </Link>
           <div className="flex items-center gap-3">
             <span className="text-[10px] font-bold text-[hsl(var(--primary))] uppercase tracking-widest px-3 py-1 bg-orange-50 rounded-full border border-orange-100 shadow-sm">
               {blog.category || "TRAVEL GUIDE"} · {blog.region || "BRAJ REGION"} · UPDATED {new Date(blog.date || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()}
             </span>
           </div>
        </div>

        <div className="max-w-[900px] mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] mb-8 tracking-tight">
            {blog.title}
          </h1>

          <div className="flex items-center justify-center mb-4">
            <div className="text-center">
              <p className="font-bold text-gray-900 text-sm leading-none">By {blog.author || 'Gurudutt'}</p>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1.5">{new Date(blog.date || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} · {blog.readTime || "5 min read"}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FULL WIDTH HERO IMAGE ── */}
      {blog.coverImage && (
        <section className="px-6 mb-16">
          <div className="max-w-[1100px] mx-auto relative aspect-[21/9] md:aspect-[2.5/1] rounded-[2.5rem] overflow-hidden shadow-xl bg-gray-50 border border-gray-100 p-1">
            <div className="w-full h-full rounded-[2.3rem] overflow-hidden">
              <img 
                src={blog.coverImage} 
                alt={blog.title}
                className="w-full h-full object-cover"
                width={1200}
                height={630}
              />
            </div>
          </div>
        </section>
      )}

      {/* ── CONTENT BODY ── */}
      <section className="px-6 relative">
        <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-12 xl:gap-16 relative items-stretch">
          
          <div className="flex-1 min-w-0 flex gap-8 xl:pr-10">
            {/* LEFT: STICKY SOCIAL SHARE */}
            <div className="hidden lg:block w-16 shrink-0 relative">
              <div className="sticky top-32 flex flex-col gap-4">
                <div className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-2" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                  Share Article
                </div>
                <button 
                  onClick={handleShare}
                  className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[hsl(var(--primary))] hover:border-[hsl(var(--primary))] transition-all hover:shadow-md bg-white active:scale-90"
                >
                  <Share2 size={16} />
                </button>
                <button 
                  onClick={handleCopyLink}
                  className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-900 transition-all hover:shadow-md bg-white active:scale-90"
                >
                  <Link2 size={16} />
                </button>
              </div>
            </div>

            {/* MAIN ARTICLE TEXT */}
            <div className="flex-1 min-w-0">
            
            {/* SECTION 5 — QUICK SUMMARY */}
            {blog.subtitle && (
              <div className="mb-12 bg-orange-50/50 border-l-4 border-orange-400 p-6 md:p-8 rounded-r-3xl">
                <h4 className="text-[10px] font-bold text-orange-500 tracking-[0.2em] uppercase mb-3 flex items-center gap-2">
                  Quick Summary
                </h4>
                <p className="text-gray-700 text-[16px] md:text-[18px] leading-relaxed font-medium">
                  {blog.subtitle}
                </p>
              </div>
            )}

            {/* SECTION 6 — TABLE OF CONTENTS */}
            {tocItems.length > 0 && (
               <nav className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-12">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                     <Compass size={14} className="text-gray-400" /> Quick Navigation:
                  </p>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                     {tocItems.map((item: any) => (
                        <li key={item.id} className="flex items-start gap-3">
                           <span className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0 mt-2" />
                           <a href={`#${item.id}`} className="text-sm font-semibold text-gray-700 hover:text-primary transition-colors border-b border-transparent hover:border-primary/20 pb-0.5 leading-snug">
                              {item.title}
                           </a>
                        </li>
                     ))}
                  </ul>
               </nav>
            )}

            <article className="premium-article-wrapper mb-20">
              {renderContentWithDropCap(blog.content)}
            </article>

            {/* SECTION 9 — DYNAMIC FAQ SECTION FROM CMS */}
            {blog.faqs && blog.faqs.length > 0 && (
               <section className="mt-16 mb-20">
                  <div className="flex items-center gap-3 mb-8">
                     <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                        <MessageCircle size={20} />
                     </div>
                     <h3 className="font-heading text-2xl font-bold text-gray-900 tracking-tight">Frequently Asked Questions</h3>
                  </div>
                  <div className="space-y-4">
                     {blog.faqs.map((faq: any, index: number) => (
                        <div key={index} className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 hover:shadow-md transition-all">
                           <h4 className="font-bold text-gray-900 mb-3 flex items-start gap-3">
                              <span className="text-purple-400 font-serif italic text-lg leading-none">Q.</span>
                              {faq.question}
                           </h4>
                           <p className="text-gray-600 text-sm leading-relaxed pl-7">
                              {faq.answer}
                           </p>
                        </div>
                     ))}
                  </div>
               </section>
            )}

            {/* SECTION 10 — DYNAMIC RECOMMENDATION MATRIX FROM CMS */}
            {blog.recommendations && blog.recommendations.length > 0 && (
               <section className="mt-20 mb-20" id="recommendations">
                  <div className="flex items-center gap-4 mb-8">
                     <div className="h-px w-12 bg-gray-200" />
                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] whitespace-nowrap">End of Article</span>
                     <div className="h-px flex-1 bg-gray-200" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-gray-900 tracking-tight mb-6">Recommended Packages</h3>
                  <div className="flex flex-col gap-3">
                     {blog.recommendations.map((rec: any, index: number) => (
                        <Link
                           key={index}
                           href={rec.url || "/packages"}
                           className="flex items-center justify-between p-5 md:p-6 bg-white border border-gray-100 rounded-2xl hover:border-orange-200 shadow-sm hover:shadow-md transition-all duration-300 group"
                        >
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                 <MapPin size={18} />
                              </div>
                              <h4 className="font-heading text-lg md:text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors m-0">
                                 {rec.title}
                              </h4>
                           </div>
                           <div className="flex items-center gap-3 shrink-0">
                              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest hidden sm:block group-hover:text-orange-600 transition-colors">View Details</span>
                              <div className="w-8 h-8 rounded-full border border-gray-100 group-hover:border-orange-300 group-hover:bg-orange-500 flex items-center justify-center text-gray-400 group-hover:text-white transition-all duration-300">
                                 <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                              </div>
                           </div>
                        </Link>
                     ))}
                  </div>
               </section>
            )}

            {/* Form Removed */}
            </div>
          </div>

          {/* RIGHT: STICKY CONVERSION CTA */}
          <div className="hidden lg:block w-[320px] xl:w-[340px] shrink-0 relative">
            <div className="sticky top-32 space-y-4 pb-12">
              {/* Main CTA Card */}
              <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)] overflow-hidden">
                {/* Top accent bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 to-amber-400" />
                <div className="p-8 xl:p-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center border border-orange-100 shrink-0">
                      <Compass className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="font-heading text-xl font-bold text-gray-900 leading-tight mb-1">Inspired to visit?</h3>
                      <p className="text-[11px] text-gray-400 font-medium">Our local experts are ready</p>
                    </div>
                  </div>
                  <p className="text-[14px] text-gray-500 leading-relaxed mb-8">
                    Let our specialists craft your perfect spiritual retreat — tailored to your soul's calling.
                  </p>
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/contact"
                      className="w-full h-12 bg-gray-900 hover:bg-black text-white text-[12px] font-bold rounded-xl transition-all uppercase tracking-[0.15em] shadow-md hover:shadow-xl active:scale-[0.98] flex items-center justify-center"
                    >
                      Enquire Now
                    </Link>
                    <a
                      href="tel:+917302265809"
                      className="w-full h-12 bg-orange-50 hover:bg-orange-500 border border-orange-100 hover:border-orange-500 text-orange-600 hover:text-white text-[12px] font-bold rounded-xl transition-all uppercase tracking-[0.15em] text-center flex items-center justify-center active:scale-[0.98]"
                    >
                      Call Expert
                    </a>
                  </div>
                </div>
                {/* Trust indicators */}
                <div className="px-10 xl:px-12 pb-10 xl:pb-12 space-y-4">
                  <div className="h-px bg-gray-100 mb-6" />
                  <div className="flex items-center gap-4">
                    <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0 text-[11px] font-bold">✓</div>
                    <span className="text-[13px] font-semibold text-gray-600">Local Expertise &amp; Access</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0 text-[11px] font-bold">✓</div>
                    <span className="text-[13px] font-semibold text-gray-600">Verified Premium Stays</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0 text-[11px] font-bold">✓</div>
                    <span className="text-[13px] font-semibold text-gray-600">24/7 Spiritual Concierge</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── RELATED BLOGS RECOMMENDATION ── */}
      {relatedBlogs && relatedBlogs.length > 0 && (
        <section className="bg-white border-t border-gray-100 py-16 mt-10">
          <div className="max-w-[1300px] mx-auto px-6 md:px-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
               <div className="max-w-2xl">
                  <h3 className="font-heading text-2xl md:text-3xl font-bold text-[#111b34] tracking-tight leading-tight">Recommended Blogs</h3>
               </div>
               <Link href="/blog" className="text-[11px] font-bold text-[#111b34] hover:text-[hsl(var(--primary))] transition-colors uppercase tracking-[0.1em] flex items-center gap-2 group border-b border-gray-200 hover:border-[hsl(var(--primary))] pb-1">
                  View All Journal <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {relatedBlogs.map((item, index) => (
                  <Link href={`/blog/${item.slug}`} key={item.slug} className="flex flex-col group cursor-pointer h-full block">
                     <div className="relative w-full aspect-[4/3] overflow-hidden mb-4 bg-[#f4f2ee] rounded-xl">
                        {item.coverImage || item.thumbnailImage ? (
                           <img src={item.coverImage || item.thumbnailImage} alt={item.title} className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105" />
                        ) : (
                           <div className="w-full h-full bg-gray-300" />
                        )}
                     </div>
                     <div className="flex flex-col flex-1">
                        <span className="text-[9px] font-bold text-[hsl(var(--primary))] tracking-[0.2em] uppercase mb-2">
                           {item.category || "Travel"}
                        </span>
                        <h4 className="font-heading font-bold text-[18px] text-[#111b34] mb-2 leading-[1.2] group-hover:text-[hsl(var(--primary))] transition-colors line-clamp-2">
                           {item.title}
                        </h4>
                        <p className="text-[#646f85] font-normal leading-relaxed text-[14px] mb-4 line-clamp-2">
                           {item.preview || item.subtitle || item.seoDescription}
                        </p>
                        <div className="mt-auto pt-4 border-t border-gray-100 transition-colors flex items-center justify-between">
                           <span className="text-[9px] font-semibold text-gray-400 tracking-[0.15em] uppercase line-clamp-1">
                              BY {item.author || "Experience My India"}
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
        </section>
      )}

      <style jsx global>{`
        .premium-article-content {
          font-family: 'Georgia', serif;
          font-size: 1.25rem;
          line-height: 1.8;
          color: #374151;
          word-wrap: break-word;
          overflow-wrap: break-word;
          white-space: normal;
          max-width: 100%;
        }
        .premium-article-content p {
          margin-bottom: 2rem;
          max-width: 100%;
        }
        .premium-article-content img,
        .premium-article-content video,
        .premium-article-content iframe {
          max-width: 100%;
          height: auto;
          border-radius: 1rem;
          margin: 2rem 0;
        }
        .premium-article-content table {
          display: block;
          overflow-x: auto;
          width: 100%;
          max-width: 100%;
        }
        .premium-article-content h1, 
        .premium-article-content h2, 
        .premium-article-content h3 {
          font-family: var(--font-heading);
          color: #111827;
          font-weight: bold;
          margin-top: 3.5rem;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
          word-wrap: break-word;
        }
        .premium-article-content h2 { font-size: 2.25rem; }
        .premium-article-content h3 { font-size: 1.75rem; }
        
        .premium-article-content a {
          color: #f97316;
          text-decoration: underline;
          text-underline-offset: 4px;
          font-weight: 600;
        }
        
        .premium-article-content ul, .premium-article-content ol {
          margin-bottom: 2.5rem;
          padding-left: 1.5rem;
          list-style-type: disc;
        }
        .premium-article-content li {
          margin-bottom: 0.75rem;
          padding-left: 0.5rem;
        }
      `}</style>
    </main>
  );
}

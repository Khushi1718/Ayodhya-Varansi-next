"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, Share2, MessageCircle, Mail, Link2, Bookmark, Quote, Star, Compass, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";

const EnquireNowModal = dynamic(() => import("@/components/EnquireNowModal"), { ssr: false });
const CustomisedPackageModal = dynamic(() => import("@/components/CustomisedPackageModal"), { ssr: false });

const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || '') + '/api';

export default function BlogTemplate() {
  const params = useParams();
  const slug = params?.slug;
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnquireOpen, setIsEnquireOpen] = useState(false);
  const [isCustomiseOpen, setIsCustomiseOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${BACKEND_URL}/blogs/${slug}`);
        const data = await response.json();

        if (data.success && data.data) {
          setBlog(data.data);
        } else {
          setError('Blog not found');
        }
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError(`Connection error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

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
    
    // In a real App Router environment, we'd use a server-side parser or JSDOM
    // Since this is client-side, we can use the browser's DOMParser
    if (typeof window === 'undefined') return <div dangerouslySetInnerHTML={{ __html: html }} />;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const firstP = doc.querySelector('p');
    
    if (firstP && firstP.textContent && firstP.textContent.length > 0) {
      const text = firstP.textContent;
      const firstChar = text.charAt(0);
      const restText = text.slice(1);
      firstP.innerHTML = `<span class="float-left text-6xl leading-[0.8] pr-3 pt-1 font-heading font-bold text-[hsl(var(--primary))]">${firstChar}</span>${restText}`;
    }
    
    return <div className="premium-article-content" dangerouslySetInnerHTML={{ __html: doc.body.innerHTML }} />;
  };

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-[#fafaf8] flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading blog...</p>
        </div>
      </main>
    );
  }

  // Error state
  if (error || !blog) {
    return (
      <main className="min-h-screen bg-[#fafaf8] pt-28 pb-20">
        <div className="max-w-[900px] mx-auto px-6 text-center">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors mb-8 uppercase tracking-widest">
            <ArrowLeft size={16} /> Back to Stories
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The blog post you are looking for does not exist.'}</p>
          <p className="text-sm text-gray-500 mb-8">Make sure the backend server is running on port 17182</p>
          <Link href="/blog" className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-medium hover:opacity-90">
            Back to All Blogs
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafaf8] selection:bg-[hsl(var(--primary))] selection:text-white pb-20">
      
      {/* ── HEADER OVERLAY ── */}
      <section className="pt-28 pb-10 px-6">
        <div className="max-w-[900px] mx-auto text-center">
          
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[hsl(var(--primary))] transition-colors mb-8 uppercase tracking-widest">
            <ArrowLeft size={16} /> Back to Stories
          </Link>

          <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
            <span className="text-[11px] font-bold text-[hsl(var(--primary))] uppercase tracking-widest px-3 py-1 bg-orange-50 rounded-full border border-orange-100 shadow-sm">
              {blog.category || "Travel"}
            </span>
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              {new Date(blog.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
              <Clock size={12} className="text-orange-300" /> {blog.readTime || "5 min read"}
            </span>
          </div>

          <h1 className="font-heading text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 leading-[1.05] mb-12 tracking-tight">
            {blog.title}
          </h1>

          <div className="flex items-center justify-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden relative shadow-lg border-2 border-white bg-gray-100">
              <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center text-white font-bold text-lg">
                {blog.author?.charAt(0) || 'A'}
              </div>
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-900 text-base leading-none">{blog.author || 'Divine Journeys'}</p>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1.5">{blog.authorRole || 'Travel Expert'}</p>
            </div>
          </div>
          
        </div>
      </section>

      {/* ── FULL WIDTH HERO IMAGE ── */}
      {blog.coverImage && (
        <section className="px-6 mb-20">
          <div className="max-w-[1100px] mx-auto relative aspect-[21/9] md:aspect-[2.5/1] rounded-[3rem] overflow-hidden shadow-2xl bg-gray-50 border border-gray-100 p-1">
            <div className="w-full h-full rounded-[2.8rem] overflow-hidden">
              <img 
                src={blog.coverImage} 
                alt={blog.title}
                className="w-full h-full object-cover"
                onError={(e: any) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>
        </section>
      )}

      {/* ── CONTENT BODY ── */}
      <section className="px-6 relative">
        <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-12 relative">
          
          {/* LEFT: STICKY SOCIAL SHARE */}
          <div className="hidden lg:block w-16 shrink-0 relative">
            <div className="sticky top-32 flex flex-col gap-4">
              <div className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-2" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                Share Article
              </div>
              <button 
                onClick={handleShare}
                className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[hsl(var(--primary))] hover:border-[hsl(var(--primary))] transition-all hover:shadow-md bg-white active:scale-90"
                title="Share Article"
              >
                <Share2 size={16} />
              </button>
              <button 
                onClick={handleCopyLink}
                className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:border-gray-900 transition-all hover:shadow-md bg-white active:scale-90"
                title="Copy Link"
              >
                <Link2 size={16} />
              </button>
              <button 
                onClick={() => setIsEnquireOpen(true)}
                className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[hsl(var(--primary))] hover:border-[hsl(var(--primary))] transition-all hover:shadow-md bg-white active:scale-90"
                title="Plan Your Journey"
              >
                <Compass size={16} />
              </button>
            </div>
          </div>

          {/* MAIN ARTICLE TEXT */}
          <div className="max-w-[700px] w-full">
            <article className="premium-article-wrapper">
              {renderContentWithDropCap(blog.content)}
            </article>

            {/* Quotes Section */}
            {blog.quotes && blog.quotes.length > 0 && (
              <div className="space-y-12 my-20">
                {blog.quotes.map((quote: string, index: number) => (
                  <blockquote key={index} className="relative p-12 md:p-16 bg-white rounded-[3rem] shadow-xl shadow-gray-100/50 border border-gray-100 text-center group">
                    <Quote className="absolute top-8 left-1/2 -translate-x-1/2 text-orange-50 w-20 h-20 rotate-180 -z-0 opacity-40 group-hover:scale-110 transition-transform duration-700" />
                    <p className="relative z-10 text-2xl md:text-3xl font-heading font-medium italic text-gray-900 leading-snug">
                      "{quote}"
                    </p>
                  </blockquote>
                ))}
              </div>
            )}

            {/* Additional Images */}
            {blog.additionalImages && blog.additionalImages.length > 0 && (
              <div className="space-y-12 my-20">
                {blog.additionalImages.map((image: string, index: number) => (
                  <div key={index} className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden bg-gray-50 shadow-2xl border border-gray-100 p-1">
                    <div className="w-full h-full rounded-[2.3rem] overflow-hidden">
                      <img 
                        src={image} 
                        alt={`Additional story image ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                        onError={(e: any) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="h-px w-full bg-gray-100 my-16" />

            {/* TAGS */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-16">
                {blog.tags.map((tag: string) => (
                  <span key={tag} className="px-6 py-2.5 bg-white border border-gray-200 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))] transition-all cursor-pointer shadow-sm active:scale-95">
                    {tag}
                  </span>
                ))}
              </div>
            )}

          </div>

          {/* RIGHT: STICKY CONVERSION CTA */}
          <div className="hidden lg:block w-[360px] shrink-0 relative">
            <div className="sticky top-32 bg-white rounded-[3rem] p-10 shadow-[0_40px_80px_rgba(0,0,0,0.06)] border border-gray-100 overflow-hidden group">
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[hsl(var(--primary))/0.03] rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-50 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl pointer-events-none opacity-40" />
              
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3 group-hover:rotate-0 transition-transform duration-500 shadow-sm border border-orange-100">
                  <Compass className="w-8 h-8 text-[hsl(var(--primary))]" />
                </div>
                <h3 className="font-heading text-3xl font-bold text-gray-900 mb-4 tracking-tight">Inspired to visit?</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-10 px-2 font-medium">
                  Our local experts are ready to craft your perfect spiritual retreat in these sacred lands.
                </p>
                
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => setIsEnquireOpen(true)}
                    className="w-full py-5 bg-[hsl(var(--primary))] text-white text-sm font-bold rounded-2xl shadow-xl shadow-orange-200/50 hover:brightness-110 hover:-translate-y-1 active:scale-95 transition-all uppercase tracking-widest"
                  >
                    Enquire Now
                  </button>
                  <button 
                    onClick={() => setIsCustomiseOpen(true)}
                    className="w-full py-5 bg-white border border-gray-100 text-gray-900 text-sm font-bold rounded-2xl hover:border-[hsl(var(--primary))] hover:text-[hsl(var(--primary))] transition-all uppercase tracking-widest shadow-sm active:scale-95"
                  >
                    Customise Journey
                  </button>
                </div>
              </div>

              <div className="mt-10 pt-10 border-t border-gray-50 relative z-10">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 text-center">Exclusively curated for you</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-[13px] font-bold text-gray-700">
                    <div className="w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0 text-[12px] shadow-sm">✓</div>
                    Local Expertise & Access
                  </div>
                  <div className="flex items-center gap-4 text-[13px] font-bold text-gray-700">
                    <div className="w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0 text-[12px] shadow-sm">✓</div>
                    Verified Premium Stays
                  </div>
                  <div className="flex items-center gap-4 text-[13px] font-bold text-gray-700">
                    <div className="w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0 text-[12px] shadow-sm">✓</div>
                    24/7 Spiritual Concierge
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── RELATED POSTS BOTTOM ── */}
      <section className="bg-white border-t border-gray-50 py-24 mt-20">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="flex flex-col items-center">
            <h3 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center tracking-tight">Embark on more Journeys</h3>
            <div className="w-12 h-1.5 bg-orange-500 rounded-full mb-12" />
            
            <Link href="/blog" className="inline-flex items-center gap-3 px-8 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold uppercase tracking-widest text-gray-900 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all group shadow-sm active:scale-95">
              Explore All Stories <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <EnquireNowModal open={isEnquireOpen} onOpenChange={setIsEnquireOpen} />
      <CustomisedPackageModal open={isCustomiseOpen} onOpenChange={setIsCustomiseOpen} />

      <style jsx global>{`
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
    </main>
  );
}

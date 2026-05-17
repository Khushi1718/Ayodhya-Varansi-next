EXPERIENCE MY INDIA
vrindavanmathuraguide.com
BLOG PAGE
DEVELOPER TECHNICAL SOP
CMS Implementation Guide — SEO · AEO · GEO
Version 1.0 · May 2026 · For Developer / Tech Team Only


STEP 1 <head> Setup	STEP 2 CMS Fields	STEP 3 Body Sections	STEP 4 Schema + Validate

📋 WHAT THIS SOP COVERS
This document tells the Developer exactly how to build EVERY blog page on vrindavanmathuraguide.com in the CMS.
Apply this SOP to every new blog post. No exceptions.

Input you receive: A completed handover document from the Content + SEO team containing:
  → Blog title (H1) · Meta description · URL slug · All content blocks · Anchor IDs
  → Table of contents · Target keywords · Internal link list · Image brief · FAQ list

Your output: A published blog page that is technically correct and passes all validation checks.

BLOG PAGE vs PRODUCT PAGE — KEY DIFFERENCE:
  Blog uses: Article schema + FAQPage schema + BreadcrumbList schema
  Product uses: TouristTrip + Product + AggregateRating + FAQPage + BreadcrumbList
  NEVER add TouristTrip or Product schema to a blog page.


01	HEAD SECTION — CMS Settings and Meta Fields
All fields in this step go into the CMS SEO panel — not the page body

FIELD 1.1 — PAGE TITLE TAG
RULES
Maximum 60 characters — count before saving
Format from SEO team handover: copy exactly as given — do not modify
If title exceeds 60 characters — alert SEO team before publishing

CMS FIELD NAME (WordPress / common CMS):
  WordPress + Yoast SEO: SEO Title field
  WordPress + RankMath: Meta Title field
  Custom CMS: <title> tag or 'Page Title' in SEO settings

VALIDATION: After publish — view live page source → find <title> → confirm it matches

LOCATION IN CODE (if manually editing):
<head>
  <title>[EXACT TITLE FROM SEO TEAM HANDOVER]</title>
</head>

EXAMPLE:
<title>How Many Days for Mathura Vrindavan? | Experience My India</title>

CHARACTER LIMIT: 60 max
TOOL TO COUNT: charactercounttool.com

FIELD 1.2 — META DESCRIPTION
RULES
Maximum 155 characters — count before saving
Copy exactly from SEO team handover — do not modify
If missing from handover — alert SEO team. Do not write your own.

CMS FIELD NAME:
  WordPress + Yoast SEO: Meta Description field
  WordPress + RankMath: Meta Description field
  Custom CMS: meta description or 'Search Description'

<meta name="description"
  content="[EXACT DESCRIPTION FROM SEO TEAM HANDOVER]"/>

EXAMPLE:
<meta name="description"
  content="How many days for Mathura Vrindavan? Experience My India recommends
  3 days minimum — 4 days for Govardhan. Complete guide 2026.
  WhatsApp +91-7302265809."/>

CHARACTER LIMIT: 155 max

FIELD 1.3 — CANONICAL TAG
RULES — CRITICAL
Every blog page must have a self-referencing canonical.
NEVER point canonical to the homepage.
NEVER point canonical to another page.
NEVER leave canonical blank on a blog page.

CMS FIELD NAME:
  WordPress + Yoast: Advanced tab → Canonical URL
  WordPress + RankMath: Advanced tab → Canonical URL
  Custom CMS: canonical URL field in SEO settings

<link rel="canonical"
  href="https://vrindavanmathuraguide.com/blog/[slug]"/>

EXAMPLE:
<link rel="canonical"
  href="https://vrindavanmathuraguide.com/blog/
  how-many-days-for-mathura-vrindavan"/>

RULE: canonical href must exactly match the live page URL.
If URL is /blog/post-name → canonical must be /blog/post-name
If URL is /post-name → canonical must be /post-name
They must match character for character.

FIELD 1.4 — URL SLUG
RULES
Get exact slug from SEO team handover document.
Do NOT create your own slug — use exactly what SEO team specified.

Rules (for reference — SEO team has already applied these):
  Lowercase only · hyphens only · no spaces · no special characters
  Blog URL format: /blog/[topic-keyword-year]

CMS FIELD NAME:
  WordPress: Permalink / Slug field (below title editor)
  Custom CMS: URL or Slug field

After setting slug — confirm the live URL matches exactly.
Check: does the URL contain any uppercase letters? → fix if yes
Check: does the URL contain underscores? → change to hyphens if yes

CORRECT SLUG EXAMPLES:
/blog/how-many-days-for-mathura-vrindavan-2026
/blog/best-time-to-visit-mathura-vrindavan-2026
/blog/govardhan-parikrama-complete-guide-2026
/blog/mathura-vrindavan-from-bangalore-guide
/blog/banke-bihari-temple-timings-2026

WRONG SLUGS (fix before publishing):
/blog/How-Many-Days-Mathura (uppercase letters)
/blog/how_many_days_mathura (underscores)
/blog/best-amazing-mathura-tour-guide (promotional word)
/Blog/post-1 (uppercase B · generic post-1)

FIELD 1.5 — OPEN GRAPH TAGS
RULES
OG tags control how the page appears when shared on WhatsApp and social media.
Add to <head> section — most CMS SEO plugins handle this automatically.
If CMS does not auto-generate — add manually as shown below.

<meta property="og:title"
  content="[SAME TEXT AS TITLE TAG]"/>
<meta property="og:description"
  content="[SAME TEXT AS META DESCRIPTION]"/>
<meta property="og:url"
  content="https://vrindavanmathuraguide.com/blog/[slug]"/>
<meta property="og:image"
  content="https://vrindavanmathuraguide.com/images/blog/[image-name].webp"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
<meta property="og:type" content="article"/>
<meta property="og:locale" content="en_IN"/>
<meta property="og:site_name" content="Experience My India"/>
<meta property="article:author" content="Experience My India"/>
<meta property="article:published_time" content="2026-05-16T00:00:00+05:30"/>
<meta property="article:modified_time" content="2026-05-16T00:00:00+05:30"/>

FIELD 1.6 — ROBOTS META TAG
<!-- Standard blog page — allow indexing and crawling -->
<meta name="robots" content="index, follow"/>

EXCEPTIONS — use noindex only for:
  Draft or test posts
  Duplicate content pages
  Tag or category archive pages with thin content

NEVER add noindex to published blog posts targeting keywords.


02	CMS FIELDS — Every Field in the Blog Editor
Complete field-by-field guide for the CMS backend

2.1 — Complete CMS Field Reference
Fill every field below before publishing. Fields marked REQUIRED must be filled. Fields marked OPTIONAL improve ranking.

CMS FIELD	WHAT TO ENTER	WHERE TO FIND IT
Post Title	Exact H1 text from SEO team handover This auto-generates the H1 tag Do NOT modify after SEO team provides it	SEO team handover Section: H1 HEADING
URL Slug / Permalink	Exact slug from SEO team handover Set BEFORE publishing — cannot easily change after	SEO team handover Section: URL SLUG
SEO Title / Meta Title	Exact title tag text from SEO team Maximum 60 characters Verify character count	SEO team handover Section: TITLE TAG
Meta Description	Exact meta description from SEO team Maximum 155 characters	SEO team handover Section: META DESCRIPTION
Canonical URL	Full URL of this page Format: https://vrindavanmathuraguide.com/blog/[slug] Must be self-referencing	Set to current page URL Never homepage
Featured Image	Hero image for the post Format: WebP only Size: exactly 1200 × 630 pixels File size: maximum 150KB Filename: [slug]-hero.webp	From image brief in SEO handover
Featured Image Alt Text	Exact alt text from SEO team image brief Format: [Description] — [Location] — Experience My India	SEO team handover Section: IMAGE BRIEF
Author	Gurudutt Never leave as 'admin' or blank Author profile must have bio filled	CMS Users settings Gurudutt profile
Category	Select correct category: Travel Guide · Festival Guide · Temple Guide City Guide · Pilgrimage Tips Never leave uncategorised	CMS Categories panel
Tags	3 to 5 tags maximum Exact destination names: mathura · vrindavan · braj · govardhan Never create duplicate tags	CMS Tags panel
Publish Date	Today's date in correct timezone IST (UTC+5:30) Never publish with future date unless scheduling	CMS Publish panel
Focus Keyword	Primary keyword from SEO handover Yoast / RankMath uses this for scoring	SEO team handover Section: TARGET KEYWORDS
OG Image	Same as Featured Image Or a custom 1200×630px variant WebP format	From image brief
Twitter Card	summary_large_image Most CMS plugins set this automatically	CMS SEO plugin Social tab
Reading Time	Estimated reading time CMS usually auto-calculates If not — calculate: word count ÷ 200	Auto-calculated Or manual entry


03	PAGE BODY — Complete Section-by-Section Build Guide
Every section of the blog in exact order

Build each section in the CMS body editor in this exact order. Never change the order.

SECTION 1 — BREADCRUMB
IMPLEMENTATION
Position: Very top of page — above everything
Format: Home > Blog > [Post Title]
Each level except the last must be a clickable link

Home → https://vrindavanmathuraguide.com
Blog → https://vrindavanmathuraguide.com/blog
[Post Title] → no link (current page)

CMS Implementation:
  If using WordPress with breadcrumb plugin (Yoast / RankMath):
    Enable breadcrumbs in plugin settings → they auto-generate
  If custom CMS:
    Add breadcrumb component from your component library
    Pass three parameters: Home, Blog, Post Title

CRITICAL: Breadcrumb must match BreadcrumbList schema exactly.
If breadcrumb shows 'Blog' but schema says 'Articles' → fix the mismatch.

SECTION 2 — CATEGORY LABEL (ABOVE H1)
IMPLEMENTATION
One line of small text above the H1 heading.
Format: [CATEGORY] · [REGION] · UPDATED [MONTH YEAR]
Example: TRAVEL GUIDE · BRAJ REGION · UPDATED MAY 2026

CSS class: .blog-category-label or .post-label
Font size: 11px to 13px
Color: saffron orange #E8650A
Letter spacing: 0.1em
Text transform: uppercase

This is NOT an H tag. It is a <p> or <span> with a CSS class.
Never use an H2 or H3 for this label.

SECTION 3 — H1 HEADING
IMPLEMENTATION
Content: Exact H1 from SEO team handover.
In most CMS the Post Title field auto-generates the H1.

CRITICAL CHECKS:
  → Only ONE H1 on the page — verify this
  → The Post Title in CMS and the visible H1 on page must match
  → View page source → Ctrl+F → search '<h1' → count = 1

If CMS generates H1 from Post Title AND body has another H1 → remove body H1
If theme adds site name as H1 somewhere → fix theme or report to team lead

H1 for blog is NOT the same format as product page H1:
  Product H1: '4 Days Mathura Vrindavan Govardhan Barsana Nandgaon Tour'
  Blog H1: 'How Many Days for Mathura Vrindavan? Complete 2026 Guide'

SECTION 4 — AUTHOR + DATE LINE
IMPLEMENTATION
Display: By Gurudutt, Experience My India · [Published Date] · [X] min read

This must show the AUTHOR NAME — not 'admin' or 'editor'.
If CMS shows 'admin' as author → change the author on this post to Gurudutt.
Gurudutt's author profile must have:
  Name: Gurudutt
  Bio: 'Born and raised in Braj Bhoomi. Founder of Experience My India.
        Guiding pilgrims through Mathura Vrindavan since 2014.'
  Photo: Professional photo (for E-E-A-T signal)

CMS: Assign this post to Gurudutt author before publishing.
WordPress: Edit post → Author box → select Gurudutt

SECTION 5 — TL;DR SUMMARY BOX
IMPLEMENTATION — CRITICAL
Position: Immediately after the H1 and author line.
Before the table of contents.
Before any other content.

MUST BE STATIC HTML — NOT JAVASCRIPT RENDERED

Test for static HTML:
  Right click page → View Page Source
  Search for any word from the TL;DR text
  If it appears in page source → STATIC. PASS.
  If it does NOT appear → JavaScript rendered. FAIL. Fix before publishing.

CSS class: .tldr-box or .summary-box
Style: left border 4px solid #E8650A · background #FEF3E8 · padding 16px

HTML STRUCTURE:
<div class="tldr-box">
  <p class="tldr-label">📌 QUICK ANSWER</p>
  <p>[TL;DR content from SEO team handover — 60-80 words]</p>
</div>

CSS (add to stylesheet):
.tldr-box {
  background: #FEF3E8;
  border-left: 4px solid #E8650A;
  border-radius: 8px;
  padding: 16px 20px;
  margin: 24px 0;
}
.tldr-label {
  font-weight: 700;
  color: #E8650A;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 8px;
}
.tldr-box p:last-child {
  font-size: 15px;
  line-height: 1.7;
  color: #1A0A00;
  margin: 0;
}

SECTION 6 — TABLE OF CONTENTS
IMPLEMENTATION
Position: Below TL;DR box. Above introduction paragraph.
Content: Get from SEO team handover — Section: TABLE OF CONTENTS

Each TOC item is an anchor link pointing to the matching H2 section.
Format: • [Section Title] (clickable — jumps to that section)

HEADING ID IMPLEMENTATION:
Every H2 on the page must have a unique id= attribute.
Get the ID list from SEO team handover — Section: ANCHOR ID LIST

CMS IMPLEMENTATION:
  WordPress with block editor (Gutenberg):
    Click H2 block → Block settings (right panel)
    → Advanced → HTML Anchor → type the id (without #)
    Example: type 'govardhan-parikrama' for id='govardhan-parikrama'

  WordPress classic editor:
    Switch to Text/HTML view
    Find <h2> tag → add id attribute manually
    <h2 id="govardhan-parikrama">Govardhan Parikrama...</h2>

  Custom CMS:
    Add id= to each H2 element using your editor's HTML mode

TOC HTML STRUCTURE:
<nav class="table-of-contents">
  <p class="toc-label">Quick Navigation:</p>
  <ul>
    <li><a href="#tldr">Quick Answer</a></li>
    <li><a href="#[id-from-handover]">[Section title]</a></li>
    <li><a href="#[id-from-handover]">[Section title]</a></li>
    <li><a href="#[id-from-handover]">[Section title]</a></li>
    <li><a href="#faq">Frequently Asked Questions</a></li>
  </ul>
</nav>

H2 WITH ANCHOR ID (add to every H2):
<h2 id="[id-from-handover]">
  [H2 heading text from content team]
</h2>

EXAMPLE:
<h2 id="govardhan-parikrama">
  Govardhan Parikrama — What Nobody Tells You
</h2>

SECTION 7 — INTRODUCTION PARAGRAPH
IMPLEMENTATION
Content: From SEO team handover — Section: INTRODUCTION
Approximately 150 words · 3 paragraphs
First internal link to product page appears here

INTERNAL LINK IMPLEMENTATION:
  The content team marks where internal links go in the handover document.
  Find the marked anchor text → wrap in <a> tag with correct href

  Format: <a href="/tour-packages/[slug]">[anchor text]</a>
  Open in same tab — do NOT use target='_blank' for internal links
  Do NOT add nofollow to internal links

  EXAMPLE:
  'See our <a href="/tour-packages/four-days/
  mathura-vrindavan-govardhan-barsana-nandgaon-tour">
  4 Days Mathura Vrindavan Govardhan Barsana Nandgaon Tour</a>'

SECTION 8 — MAIN CONTENT H2 SECTIONS
IMPLEMENTATION RULES FOR EVERY H2 SECTION
Content: From SEO team handover — all H2 sections in order

HEADING HIERARCHY RULE — CRITICAL:
  H1: Page title — ONE only — auto-generated from Post Title field
  H2: Main section headings — all have unique id= attributes
  H3: Sub-sections within an H2 — no id= required
  H4: Minor sub-points only — use sparingly
  NEVER skip heading levels (H1 → H3, skipping H2 = wrong)
  NEVER use bold paragraph text as a heading substitute

TABLES:
  Build using the CMS table block or HTML <table> tag
  Every table needs a header row (<thead>)
  Apply CSS class: .blog-table for consistent styling
  Tables must be horizontally scrollable on mobile

INTERNAL LINK CTA BOXES:
  Insert after every 2nd or 3rd H2 section
  Use the CTA box component from your component library
  Content: package name + price + link to product page
  CSS class: .internal-cta-box

HEADING STRUCTURE (copy this pattern):

<h2 id="section-one-id">Section One Heading</h2>
<p>Opening sentence — direct answer to what this section covers.</p>
<p>Main content paragraph.</p>
<!-- TABLE if relevant -->
<p>Ground truth detail paragraph.</p>

<!-- INTERNAL CTA BOX after every 2-3 H2 sections -->
<div class="internal-cta-box">
  <p class="cta-emoji">🙏</p>
  <p class="cta-title">Ready to book [X] days?</p>
  <p class="cta-text">Experience My India's [Package] covers all
  of this with expert Braj guide. From ₹[PRICE].</p>
  <a href="/tour-packages/[slug]" class="cta-button">
    View Package →
  </a>
</div>

<h2 id="section-two-id">Section Two Heading</h2>
...continue for all sections...

CSS FOR CTA BOX:
.internal-cta-box {
  background: #FEF3E8;
  border: 1.5px solid #E8650A;
  border-radius: 12px;
  padding: 20px;
  margin: 32px 0;
  text-align: center;
}
.cta-button {
  display: inline-block;
  background: #E8650A;
  color: white;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  margin-top: 12px;
}

SECTION 9 — FAQ SECTION
IMPLEMENTATION
H2 heading: 'Frequently Asked Questions — [Blog Topic]'
H2 must have id='faq'
Content: All FAQ questions and answers from SEO team handover

CMS IMPLEMENTATION:
  Build FAQ items as H3 + paragraph pairs in the body editor
  OR use your CMS FAQ accordion component if available
  Accordion is better for UX — Google reads both formats

ACCORDION IMPLEMENTATION:
  Each FAQ item: question as button/heading + answer as hidden div
  Use CSS + minimal JS for open/close toggle
  Default state: all closed except first item (open)
  Mobile: full width accordion items

IMPORTANT: FAQ content must be in static HTML
  If FAQ is rendered by JavaScript after page load →
  Google and LLMs may not read it
  Test: View page source → search for FAQ question text
  If not found in source → FAQ is JS-rendered → fix

FAQ HTML STRUCTURE (accordion):

<section id="faq">
<h2 id="faq">Frequently Asked Questions — [Topic]</h2>

<div class="faq-item">
  <button class="faq-question"
          aria-expanded="true"
          aria-controls="faq-1">
    [Question 1 from handover]
  </button>
  <div id="faq-1" class="faq-answer">
    <p>[Answer 1 from handover — 40-80 words]</p>
  </div>
</div>

<div class="faq-item">
  <button class="faq-question"
          aria-expanded="false"
          aria-controls="faq-2">
    [Question 2 from handover]
  </button>
  <div id="faq-2" class="faq-answer" hidden>
    <p>[Answer 2 from handover]</p>
  </div>
</div>

<!-- Repeat for all FAQ items -->

CSS:
.faq-item { border: 1px solid #E5E7EB; border-radius: 8px; margin-bottom: 8px; }
.faq-question { width: 100%; text-align: left; padding: 14px 16px;
  font-weight: 500; background: white; border: none; cursor: pointer; }
.faq-answer { padding: 12px 16px; font-size: 14px; line-height: 1.7; }

JS (minimal toggle):
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const answer = document.getElementById(btn.getAttribute('aria-controls'));
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', !isOpen);
    answer.hidden = isOpen;
  });
});

SECTION 10 — CLOSING RECOMMENDATION SECTION
IMPLEMENTATION
H2: 'Our Recommendation — Based on Your Situation'
H2 id: recommendation

Content: Decision matrix from SEO team handover
Format: If [situation] → [recommendation] + internal link

This section has the highest product page CTR of any blog section.
Every recommendation must have a clickable internal link to the product page.
Use the exact anchor text specified in the SEO team handover.

RECOMMENDATION SECTION HTML:

<h2 id="recommendation">
  Our Recommendation — Based on Your Situation
</h2>

<div class="recommendation-grid">

  <div class="rec-item">
    <p class="rec-if">If you are coming from Delhi for the first time</p>
    <p class="rec-then">→ 3 Days is ideal</p>
    <a href="/tour-packages/three-days/mathura-vrindavan-tour-package"
       class="rec-link">
      View 3 Days Mathura Vrindavan Tour Package →
    </a>
  </div>

  <div class="rec-item">
    <p class="rec-if">If you want to include Govardhan and Barsana</p>
    <p class="rec-then">→ 4 Days is recommended</p>
    <a href="/tour-packages/four-days/mathura-vrindavan-govardhan-barsana-nandgaon-tour"
       class="rec-link">
      View 4 Days Braj Outer Circuit Tour →
    </a>
  </div>

</div>

CSS:
.recommendation-grid { display: flex; flex-direction: column; gap: 12px; }
.rec-item { background: #FEF3E8; border-left: 3px solid #E8650A;
  border-radius: 0 8px 8px 0; padding: 14px 16px; }
.rec-if { font-size: 13px; color: #6B6B6B; margin-bottom: 4px; }
.rec-then { font-size: 15px; font-weight: 600; color: #1A0A00; margin-bottom: 8px; }
.rec-link { font-size: 13px; color: #E8650A; text-decoration: none; font-weight: 500; }

SECTION 11 — AUTHOR BOX
IMPLEMENTATION
Position: After all content — before related posts
This is a critical E-E-A-T (Experience Expertise Authority Trust) signal.
Google quality raters specifically check for author credentials on travel content.

Must show:
  → Author photo (Gurudutt professional photo)
  → Author name: Gurudutt
  → Title: Founder, Experience My India
  → Bio: 'Born and raised in Braj Bhoomi. Guiding pilgrims through
          Mathura Vrindavan since 2014. 10,000+ pilgrims served.'

CMS implementation:
  WordPress: Use author bio box from theme or plugin
  Custom CMS: Author box component — fill from Gurudutt's profile

Author photo: minimum 200×200px · WebP · professional · clear face

SECTION 12 — RELATED POSTS
IMPLEMENTATION
Position: After author box — before footer
Show: 3 to 4 related blog posts
Selection: Get from SEO team handover — Section: RELATED POSTS

CMS implementation:
  WordPress: Related posts plugin or manual selection in post editor
  Custom CMS: Related posts component — pass post IDs from handover

Each related post card shows:
  → Featured image (thumbnail 400×250px WebP)
  → Post title
  → 1-line excerpt (max 100 chars)
  → Read more link

These are INTERNAL links — they keep readers on the site.
Time on site = positive ranking signal for Google.
Do NOT link to competitor sites here.


04	IMAGES — Complete Image Implementation Guide
Rules for every image on the blog page

Image	Size (px)	Max File Size	Format	Alt Text Rule	Position
Hero / Featured image	1200 × 630	150KB	WebP only	[Description] — [Location] — Experience My India	Featured image field + top of post
In-body image 1	900 × 600	100KB	WebP only	Specific description — location — brand	After first H2 section
In-body image 2	900 × 600	100KB	WebP only	Specific description — location — brand	After third or fourth H2
Author photo	200 × 200	30KB	WebP only	Gurudutt — Founder Experience My India	Author box
TOC decorative icon	32 × 32	5KB	WebP or SVG	Decorative — leave alt empty: alt=""	Next to TOC heading

IMAGE RULES — APPLY TO EVERY IMAGE
1. FORMAT: WebP only. Convert all images before uploading.
   Tool: squoosh.app (free) or tinypng.com

2. FILE SIZE: Hero image max 150KB. All others max 100KB.
   Check in browser Network tab after upload.

3. ALT TEXT: Every image must have descriptive alt text.
   Format: [Specific description] — [Location name] — Experience My India
   NEVER leave alt text empty except for purely decorative images.
   NEVER write: 'image1' or 'photo' or 'tour'

4. FILENAME: Use descriptive hyphenated names before uploading.
   CORRECT: govardhan-parikrama-mathura-dawn.webp
   WRONG: IMG_2047.jpg or photo1.png

5. LAZY LOADING: Add loading='lazy' to all images EXCEPT the hero image.
   Hero image must NOT have lazy loading (it is above the fold).

6. DIMENSIONS: Always add width and height attributes.
   This prevents Cumulative Layout Shift (CLS) — a ranking signal.

CORRECT IMAGE HTML:

<!-- Hero image (no lazy loading) -->
<img src="/images/blog/[slug]-hero.webp"
     alt="[Description] — [Location] — Experience My India"
     width="1200"
     height="630"/>

<!-- In-body images (with lazy loading) -->
<img src="/images/blog/[slug]-[section].webp"
     alt="[Description] — [Location] — Experience My India"
     width="900"
     height="600"
     loading="lazy"/>

WRONG IMAGE HTML (never do this):
<img src="photo.jpg" alt="mathura vrindavan tour"/> ← wrong format, wrong alt
<img src="image.webp"/> ← no alt text, no dimensions
<img src="tour.webp" alt=""/> ← empty alt on non-decorative image


05	SCHEMA MARKUP — Complete JSON-LD for Blog Pages
Blog uses Article + FAQPage + BreadcrumbList only

BLOG SCHEMA STACK — 2026 RULES
BLOG PAGE uses ONLY these schema types:
  ✅ Article — identifies this as a content article
  ✅ FAQPage — feeds AI models with Q&A content
  ✅ BreadcrumbList — shows navigation in search results

BLOG PAGE NEVER uses these (product page only):
  ❌ TouristTrip — only for package/product pages
  ❌ Product — only for package/product pages
  ❌ Offer — only for package/product pages
  ❌ AggregateRating on blog — only for product pages with reviews
  ❌ HowTo — deprecated for rich results since September 2023
  ❌ Review — not applicable to blog pages

Complete Blog Schema Template
Copy this template. Fill all [PLACEHOLDERS] from the SEO team handover. Add to <head> as a single JSON-LD script block.

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [

    {
      "@type": "Article",
      "headline": "[EXACT H1 TEXT]",
      "description": "[EXACT META DESCRIPTION TEXT]",
      "image": {
        "@type": "ImageObject",
        "url": "https://vrindavanmathuraguide.com/images/blog/[slug]-hero.webp",
        "width": 1200,
        "height": 630
      },
      "author": {
        "@type": "Person",
        "name": "Gurudutt",
        "jobTitle": "Founder",
        "worksFor": {
          "@type": "Organization",
          "name": "Experience My India"
        },
        "description": "Born and raised in Braj Bhoomi. Guiding pilgrims
         through Mathura Vrindavan since 2014. Founder of Experience My India."
      },
      "publisher": {
        "@type": "Organization",
        "name": "Experience My India",
        "url": "https://vrindavanmathuraguide.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://vrindavanmathuraguide.com/images/logo.webp",
          "width": 200,
          "height": 60
        }
      },
      "url": "https://vrindavanmathuraguide.com/blog/[slug]",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://vrindavanmathuraguide.com/blog/[slug]"
      },
      "datePublished": "[YYYY-MM-DD]",
      "dateModified": "[YYYY-MM-DD]",
      "inLanguage": "en-IN",
      "about": [
        {"@type": "Thing", "name": "Mathura Vrindavan"},
        {"@type": "Thing", "name": "[Primary topic of blog]"},
        {"@type": "Place", "name": "Braj Bhoomi"}
      ],
      "mentions": {
        "@type": "Organization",
        "name": "Experience My India",
        "telephone": "+91-7302265809"
      },
      "wordCount": [ACTUAL WORD COUNT],
      "timeRequired": "PT[X]M"
    },

    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "[FAQ Question 1 from handover]",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "[FAQ Answer 1 from handover — full answer text]"
          }
        },
        {
          "@type": "Question",
          "name": "[FAQ Question 2 from handover]",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "[FAQ Answer 2 from handover]"
          }
        }
        /* REPEAT FOR ALL FAQ ITEMS FROM HANDOVER */
      ]
    },

    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://vrindavanmathuraguide.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blog",
          "item": "https://vrindavanmathuraguide.com/blog"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "[EXACT H1 TEXT]"
        }
      ]
    }

  ]
}
</script>

SCHEMA NOTES:
wordCount: count words in CMS word counter and enter the number
timeRequired: PT[X]M where X is reading minutes (word count ÷ 200)
datePublished and dateModified: use actual publish date in YYYY-MM-DD format
Fill ALL FAQ items from the handover — do not reduce the count


06	INTERNAL LINKS — Complete Implementation Guide
All links from blog to product pages

INTERNAL LINK RULES FOR BLOG PAGES
Total internal links to product pages: minimum 3 · maximum 7
Links to other blogs: 3 to 4 (related posts section + in-content)

Get the complete internal link list from SEO team handover
Section: INTERNAL LINKS — this tells you exactly:
  → Where in the content the link goes
  → What the anchor text is
  → Which product page URL it links to

LINK IMPLEMENTATION RULES:
  1. Internal links: same tab (no target='_blank')
  2. External links: new tab (target='_blank' rel='noopener noreferrer')
  3. Never add rel='nofollow' to internal links
  4. Anchor text must match exactly what SEO team specified
  5. Never change the anchor text — it is an SEO signal

CORRECT INTERNAL LINK:
<a href="/tour-packages/four-days/mathura-vrindavan-govardhan-barsana-nandgaon-tour">
  4 Days Mathura Vrindavan Govardhan Barsana Nandgaon Tour
</a>

WRONG (never do these):
<a href="/tour-packages/..." target="_blank"> ← wrong: same tab for internal
<a href="/tour-packages/..." rel="nofollow"> ← wrong: never nofollow internal
<a href="/tour-packages/...">click here</a>   ← wrong: meaningless anchor text
<a href="/tour-packages/...">here</a>         ← wrong: wasted anchor signal

INTERNAL CTA BOX LINK:
<a href="/tour-packages/[slug]" class="cta-button">
  View [Package Name] →
</a>

RELATED POSTS LINKS:
<a href="/blog/[related-post-slug]">
  [Related Post Title]
</a>


07	PERFORMANCE — Mobile Speed and Core Web Vitals
Must pass before publishing

Metric	Target	Test Tool	If Failing
LCP (Largest Contentful Paint)	Under 2.5 seconds on mobile	pagespeed.web.dev	Compress hero image · preload critical fonts
CLS (Cumulative Layout Shift)	Under 0.1	pagespeed.web.dev	Add width/height to all images
FID / INP (Interaction)	Under 100ms	pagespeed.web.dev	Reduce JS · defer non-critical scripts
Mobile PageSpeed Score	Above 75	pagespeed.web.dev	Fix largest issues from PageSpeed report
Hero image load time	Under 1.5 seconds	Network tab in Chrome DevTools	Compress to WebP under 150KB
Total page size	Under 2MB	Network tab in Chrome DevTools	Compress images · lazy load below fold

FONT LOADING — IMPORTANT FOR LOCAL LANGUAGE PAGES
Hindi and Telugu script fonts add 300-500ms load time if not preloaded.
For English blog pages: standard system fonts — no special action needed.
For Hindi blog pages: preload Noto Sans Devanagari
For Telugu blog pages: preload Noto Sans Telugu

Add to <head> for language pages:
<link rel='preload' as='font' type='font/woff2'
  href='/fonts/noto-sans-devanagari.woff2' crossorigin/>


08	PRE-PUBLISH CHECKLIST — Sign Off Every Item
Do not publish until every item is ticked

Developer Signs Off — All Items
#	Check	How to Verify	Pass?
1	Title tag — correct text, max 60 chars	View source → find <title> → count chars	☐
2	Meta description — correct text, max 155 chars	View source → find meta description → count chars	☐
3	Canonical tag — self-referencing, matches live URL	View source → find canonical → compare to URL bar	☐
4	URL slug — lowercase, hyphens, matches handover	Check browser URL bar → no uppercase or underscores	☐
5	ONE H1 only — no duplicate H1 tags	View source → Ctrl+F → search '<h1' → count = 1	☐
6	All H2 headings have unique id= attributes	View source → find each H2 → confirm id= present	☐
7	TL;DR box is static HTML	View source → search for TL;DR text → must appear	☐
8	All internal links use correct anchor text	Click each link → check destination → check anchor text	☐
9	All internal links open in same tab	Click each link → confirm no new tab opens	☐
10	FAQ section is static HTML (not JS-rendered)	View source → search for FAQ question text	☐
11	Article schema in <head>	View source → find script/ld+json → confirm Article type	☐
12	FAQPage schema complete — all questions included	Count FAQ items in schema vs FAQ items on page	☐
13	BreadcrumbList schema matches visible breadcrumb	Compare schema text to breadcrumb on page	☐
14	Author set to Gurudutt (not admin or editor)	View post in CMS → check Author field	☐
15	Featured image WebP, 1200×630, under 150KB	Check Network tab → image file → size and format	☐
16	All body images have alt text — no empty alt	View source → search 'alt=' → check every image	☐
17	All body images have width and height attributes	View source → check img tags for width and height	☐
18	Hero image does NOT have loading='lazy'	View source → find hero img → no loading attribute	☐
19	All other images have loading='lazy'	View source → find body imgs → loading='lazy' present	☐
20	OG tags complete — title, description, image, type	View source → find og: meta tags → all 6 present	☐
21	Mobile rendering correct — test on actual phone	Open on mobile → check layout, fonts, buttons	☐
22	PageSpeed mobile score above 75	pagespeed.web.dev → enter URL → mobile tab → score	☐
23	Rich Results Test — 0 errors	search.google.com/test/rich-results → paste URL	☐
24	Breadcrumb on page matches BreadcrumbList schema	Compare visual breadcrumb to schema itemListElement	☐
25	Related posts section shows 3-4 posts with images	Load page → scroll to bottom → check related posts	☐
26	TOC links all work — each jumps to correct section	Click every TOC item → confirm it jumps correctly	☐


09	POST-PUBLISH — Do Within 2 Hours of Publishing
Critical actions after page goes live

Order	Action	How	Time
1	Submit to Google Search Console	search.google.com/search-console → URL Inspection → paste live URL → Request Indexing → confirm green tick	Within 1 hour
2	Run Rich Results Test on live URL	search.google.com/test/rich-results → enter live URL → confirm 0 errors → Screenshot result → send to SEO team	Within 1 hour
3	Run PageSpeed Insights on live URL	pagespeed.web.dev → enter live URL → Mobile tab → confirm score above 75 → If below 75 → fix before next post	Within 2 hours
4	Update XML sitemap	Add new blog post URL to sitemap.xml Priority: 0.7 for blog (vs 0.9 for product) Changefreq: monthly Submit updated sitemap in GSC	Same day
5	Confirm internal links are working	Visit each product page that links to this blog → Confirm the link now appears and works Also confirm links FROM this blog TO product pages	Same day
6	Check robots.txt	Open vrindavanmathuraguide.com/robots.txt Confirm /blog/ is not blocked Confirm new URL is not blocked	Before publish (check once per week)
7	Notify SEO team	Send live URL + confirmation that all validation checks passed + Rich Results Test screenshot	Same day


COMMON MISTAKES — Never Do These
Mistake	Consequence	Correct Approach
Canonical pointing to homepage or another page	Blog authority credited to wrong URL — blog does not rank	Self-referencing canonical always — must match live URL exactly
Using TouristTrip or Product schema on blog page	Schema mismatch — Google treats blog as product page — confusion	Blog uses ONLY Article + FAQPage + BreadcrumbList
H1 auto-generated by theme AND another H1 in body	Two H1 tags — Google ignores both — page does not rank well	Check for duplicate H1s after publishing — always
FAQ section rendered by JavaScript	Google and LLMs cannot read FAQs — no AI citation possible	FAQ must be static HTML — verify with View Page Source
TL;DR box rendered by JavaScript	AI tools cannot extract summary — page not cited by LLMs	TL;DR must be static HTML — verify with View Page Source
Internal links open in new tab	Bad UX signal — passes no PageRank — confuses user	Internal links always same tab — never target='_blank'
Empty alt text on content images	Image not indexed — accessibility failure — ranking signal missed	Every content image needs descriptive alt text
Images uploaded as PNG or JPEG	File size 3-5x larger than needed — slow page — LCP failure	Convert all images to WebP before uploading
No width and height on images	CLS failure — layout shifts as images load — ranking penalty	Always add width and height attributes to every img tag
Author left as 'admin'	E-E-A-T failure — Google sees no expert author	Always assign Gurudutt as author before publishing
HowTo schema added	Deprecated — wasted code — no benefit since Sept 2023	Remove all HowTo schema from blog pages
Post published without GSC submission	Indexing takes weeks instead of 24-48 hours	Always submit via URL Inspection within 1 hour of publish

BLOG PAGE DEVELOPER SOP · Experience My India · vrindavanmathuraguide.com
Any technical question → escalate to team lead before publishing
🙏 Jai Shri Krishna


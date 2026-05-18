export interface Blog {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  author: string;
  date: string;
  thumbnailImage: string;
  status?: string;

  // Detail fields may be missing in lightweight list payloads.
  content?: string;
  tags?: string[];
  quotes?: string[];
  additionalImages?: string[];
  coverImage?: string;
  authorRole?: string;
  readTime?: string;
  
  // New SOP Fields
  region?: string;
  tldr?: string;
  seoTitle?: string;
  seoDescription?: string;
  faqs?: { question: string; answer: string }[];
  recommendations?: { title: string; url: string }[];
}

export interface BlogDetailProps {
  blog: Blog | null;
  onDeleted?: () => void;
  onCreated?: () => void;
  onBack?: () => void;
  onViewDrafts?: () => void;
}

export interface BlogListProps {
  blogs: Blog[];
  selectedBlog: Blog | null;
  onSelectBlog: (blog: Blog) => void;
  onCreateNew: () => void;
  onDeleteBlog?: (id: string) => void;
  loading: boolean;
  onRefresh: () => void;
  fullWidth?: boolean;
  title?: string;
}

export interface ItineraryDay {
  day: string;
  title: string;
  details?: string; // Rich text/HTML content from editor
  tags?: { title: string; content: string }[]; // Practical notes/tips
}

export interface FAQ {
  q: string;
  a: string;
}

export interface GroundTruth {
  title: string;
  description: string; // Rich text/HTML content
}

export interface Testimonial {
  name: string;
  rating: number;
  review: string;
  avatar?: string;
}

export interface Package {
  id: string;
  _id?: string;
  slug: string;
  title: string;
  destination: string;
  duration: string;
  durationCategory?: string;
  rating: number;
  reviews?: number;
  price: string;
  originalPrice?: string;
  savings?: string;
  about: string;
  highlights: string[];
  itinerary: ItineraryDay[];
  included: string[];
  excluded: string[];
  faq: FAQ[];
  images: {
    main: string;
    gallery: string[];
  };
  isOffer?: boolean;
  offerPercentage?: string;
  status?: string;
  knowBeforeYouGo?: string[];
  groundTruth?: GroundTruth[];
  testimonials?: Testimonial[];
  cardKeyPoints?: string[];
  // New CMS-driven fields
  benefits?: Record<string, boolean> | string[];
  route?: {
    overview?: string;
    departure?: string;
    arrival?: string;
    stops?: { title: string; desc?: string }[];
  };
}

export interface PackageListProps {
  packages: Package[];
  selectedPackage: Package | null;
  onSelectPackage: (pkg: Package) => void;
  onCreateNew: () => void;
  onDeletePackage?: (id: string) => void;
  loading: boolean;
  onRefresh: () => void;
  fullWidth?: boolean;
  title?: string;
}

export interface PackageDetailProps {
  packageData: Package | null;
  onDeleted?: () => void;
  onCreated?: () => void;
  onBack?: () => void;
  onViewDrafts?: () => void;
}

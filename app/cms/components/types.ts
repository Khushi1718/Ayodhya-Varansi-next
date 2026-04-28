export interface Blog {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  author: string;
  date: string;
  thumbnailImage: string;
  content: string;
  tags: string[];
  quotes: string[];
  additionalImages: string[];
  coverImage: string;
  authorRole: string;
  readTime: string;
  status?: string;
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
  desc: string;
}

export interface FAQ {
  q: string;
  a: string;
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
  status?: string;
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

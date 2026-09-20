export type ProductCategory = 'cakes' | 'pastries' | 'breads';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: string;
  image: string;
  isFeatured?: boolean;
  dietary?: string[];
  servings?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  occasion: string;
  quote: string;
  rating: number;
}

export type GalleryCategory =
  | 'all'
  | 'cakes'
  | 'pastries'
  | 'bread'
  | 'celebration-cakes'
  | 'bakery-interior'
  | 'behind-the-scenes';

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  categoryLabel: string;
  image: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape';
  caption: string;
}

export interface CustomOrderFormData {
  name: string;
  phone: string;
  email: string;
  occasion: string;
  cakeType: string;
  preferredDate: string;
  numberOfPeople: string;
  budgetRange?: string;
  preferredFlavour?: string;
  message: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface EnquirySubmissionResult {
  success: boolean;
  message: string;
  timestamp?: string;
  enquiryId?: string;
  details?: Record<string, unknown>;
}

// ============================================================
// नेपाल Hostel Finder — Core TypeScript Types
// ============================================================

// ---- Enums ----

export type UserRole = "user" | "host" | "admin";

export type GenderCategory = "boys" | "girls" | "unisex" | "tourist";

export type StayType = "short" | "long";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed";

export type PaymentStatus = "unpaid" | "advance_paid" | "fully_paid";

export type PaymentMethod = "esewa" | "stripe" | "offline";

// ---- City ----

export interface City {
  id: string;
  name: string;
  tagline: string;
  imageUrl: string | null;
  isActive: boolean;
  ordering: number;
  createdAt: string;
}

// ---- User ----

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// ---- Hostel ----

export interface HostelImage {
  id: string;
  url: string;
  altText?: string;
  isPrimary: boolean;
}

export interface HostelAmenity {
  id: string;
  name: string;
  icon?: string;
}

export interface Hostel {
  id: string;
  name: string;
  slug: string;
  description: string;
  city: string;
  address: string;
  latitude?: number;
  longitude?: number;
  genderCategory: GenderCategory;
  pricePerNight: number;
  pricePerMonth: number;
  totalBeds: number;
  availableBeds: number;
  amenities: HostelAmenity[];
  images: HostelImage[];
  reviews: Review[];
  rating: number;
  reviewCount: number;
  host: Pick<User, "id" | "fullName" | "avatarUrl">;
  isFeatured: boolean;
  isActive: boolean;
  isApproved: boolean;
  createdAt: string;
}

export type HostelSummary = Pick<
  Hostel,
  | "id"
  | "name"
  | "slug"
  | "city"
  | "address"
  | "latitude"
  | "longitude"
  | "genderCategory"
  | "pricePerNight"
  | "pricePerMonth"
  | "availableBeds"
  | "rating"
  | "reviewCount"
  | "isFeatured"
  | "isApproved"
> & {
  primaryImage: string;
  distance?: number;
};

// ---- Booking ----

export interface Booking {
  id: string;
  hostel: HostelSummary;
  user: Pick<User, "id" | "fullName" | "email" | "phone">;
  stayType: StayType;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  advanceAmount?: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

// ---- Review ----

export interface Review {
  id: string;
  hostelId: string;
  user: Pick<User, "id" | "fullName" | "avatarUrl">;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewEligibility {
  canReview: boolean;
  alreadyReviewed: boolean;
  hasCompletedStay: boolean;
}

// ---- API ----

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

export type SiteSettingsMap = Record<string, string>;

// ---- Search / Filters ----

export interface HostelFilters {
  city?: string;
  genderCategory?: GenderCategory;
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  maxBeds?: number;
  stayType?: StayType;
  amenities?: string[];
  search?: string;
  ordering?: string;
  page?: number;
}

// ---- Forms ----

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  avatar?: File | null;
}

export interface EmailVerificationRequestData {
  email: string;
}

export interface EmailVerificationConfirmData {
  email: string;
  otp: string;
}

export interface HostelFormData {
  name: string;
  description: string;
  city: string;
  address: string;
  genderCategory: GenderCategory;
  pricePerNight: number;
  pricePerMonth: number;
  totalBeds: number;
  amenities: string[];
  images: File[];
}

export interface BookingFormData {
  hostelId: string;
  stayType: StayType;
  checkIn: string;
  checkOut: string;
}

// ---- Contact ----

export type ContactSubject =
  | "general"
  | "booking"
  | "listing"
  | "feedback"
  | "partnership"
  | "other";

export interface ContactEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: ContactSubject;
  message: string;
  createdAt: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: ContactSubject;
  message: string;
}

// ---- Wishlist ----

export interface WishlistItem {
  id: string;
  hostel: HostelSummary;
  createdAt: string;
}

// ---- Site Page (About, etc.) ----

export type SitePageSectionType = "stat" | "feature" | "team" | "value" | "faq";

export interface SitePageSection {
  id: string;
  sectionType: SitePageSectionType;
  title: string;
  subtitle: string;
  body: string;
  icon: string;
  imageUrl: string | null;
  ordering: number;
  isActive: boolean;
  createdAt: string;
}

export interface SitePage {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  body: string;
  isActive: boolean;
  sections: SitePageSection[];
  createdAt: string;
  updatedAt: string;
}

// ---- Social Links ----

export type SocialPlatform =
  | "facebook"
  | "instagram"
  | "twitter"
  | "youtube"
  | "tiktok"
  | "linkedin"
  | "whatsapp"
  | "viber"
  | "other";

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  url: string;
  label: string;
  isActive: boolean;
  ordering: number;
  createdAt: string;
}

// ---- Chatbot ----

export interface ChatbotQA {
  id: string;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  ordering: number;
  createdAt: string;
  updatedAt: string;
}

export type ChatbotQueryStatus = "pending" | "replied" | "closed";

export interface ChatbotUserQuery {
  id: string;
  question: string;
  status: ChatbotQueryStatus;
  adminReply: string;
  repliedAt: string | null;
  replySeen: boolean;
  createdAt: string;
  updatedAt: string;
}

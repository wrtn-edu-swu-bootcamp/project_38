// Common types for FactChecker application

export type { 
  User, 
  FactCheck, 
  Reference, 
  Library, 
  LibraryBook,
  InputType,
  FactCheckStatus,
  Verdict,
  ReferenceType
} from "@prisma/client";

// Frontend types
export interface FactCheckInput {
  inputType: "TEXT" | "URL" | "IMAGE";
  content: string;
  imageUrl?: string;
}

export interface FactCheckResult {
  id: string;
  trustScore: number;
  verdict: "CONFIRMED" | "MOSTLY_TRUE" | "CAUTION" | "FALSE" | "UNVERIFIABLE";
  summary: string;
  explanation: string;
  references: ReferenceWithLibraries[];
  createdAt: Date;
}

export interface ReferenceWithLibraries {
  id: string;
  type: "ACADEMIC_PAPER" | "BOOK" | "NEWS" | "JOURNAL" | "THESIS" | "REPORT" | "WEB";
  title: string;
  authors?: string;
  publisher?: string;
  publicationDate?: string;
  url?: string;
  snippet?: string;
  relevanceScore?: number;
  trustScore?: number;
  isbn?: string;
  doi?: string;
  imageUrl?: string;
  libraryBooks?: LibraryBookWithLibrary[];
}

export interface LibraryBookWithLibrary {
  id: string;
  available: boolean;
  callNumber?: string;
  location?: string;
  library: LibraryLocation;
}

export interface LibraryLocation {
  id: string;
  name: string;
  address: string;
  phone?: string;
  website?: string;
  latitude: number;
  longitude: number;
  distance?: number; // calculated distance from user
}

export interface SearchResult {
  papers: ReferenceData[];
  books: ReferenceData[];
  news: ReferenceData[];
}

export interface ReferenceData {
  type: "ACADEMIC_PAPER" | "BOOK" | "NEWS" | "JOURNAL" | "THESIS" | "REPORT" | "WEB";
  title: string;
  authors?: string;
  publisher?: string;
  publicationDate?: string;
  url?: string;
  snippet?: string;
  isbn?: string;
  doi?: string;
  imageUrl?: string;
}

// API Response types
export interface ApiError {
  code: string;
  message: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// UI Component types
export type ButtonVariant = "primary" | "secondary" | "text" | "danger";
export type ButtonSize = "small" | "default" | "large";

export type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral";

// Utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

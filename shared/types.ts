/**
 * Unified type exports
 * Import shared types from this single entry point.
 */

export type * from "../drizzle/schema";
export * from "./_core/errors";

// Wallpaper types
export interface Wallpaper {
  id: string;
  url: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  photographer: string;
  photographerUrl: string;
  avgColor: string;
  source: "pexels" | "ai" | "user" | "catapi";
}

export interface Category {
  id: string;
  name: string;
  query: string;
  icon?: string;
}

export interface PexelsPhoto {
  id: number | string;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  liked: boolean;
  alt: string;
}

export interface PexelsResponse {
  total_results: number;
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
  next_page?: string;
}

// User types
export interface UserFavorite {
  id: number;
  userId: number;
  wallpaperId: string;
  wallpaperUrl: string;
  thumbnailUrl: string;
  createdAt: Date;
}

// AI Generation types
export interface GenerationRequest {
  prompt: string;
}

export interface GenerationResult {
  id: string;
  url: string;
  prompt: string;
  createdAt: Date;
}

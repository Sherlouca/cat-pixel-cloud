import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Wallpaper, Category, PexelsPhoto, PexelsResponse } from "@/shared/types";

// Categories for cat wallpapers
export const CATEGORIES: Category[] = [
  { id: "all", name: "Todos", query: "cat" },
  { id: "cute", name: "Fofinhos", query: "cute cat" },
  { id: "funny", name: "Engraçados", query: "funny cat" },
  { id: "sleeping", name: "Dormindo", query: "sleeping cat" },
  { id: "kitten", name: "Filhotes", query: "kitten" },
  { id: "black", name: "Pretos", query: "black cat" },
  { id: "white", name: "Brancos", query: "white cat" },
  { id: "orange", name: "Laranja", query: "orange cat" },
];

// Convert Pexels photo to our Wallpaper type
export function pexelsToWallpaper(photo: PexelsPhoto): Wallpaper {
  return {
    id: photo.id.toString(),
    url: photo.src.original,
    thumbnailUrl: photo.src.large,
    width: photo.width,
    height: photo.height,
    photographer: photo.photographer,
    photographerUrl: photo.photographer_url,
    avgColor: photo.avg_color,
    source: "pexels",
  };
}

interface WallpaperState {
  // Wallpapers
  wallpapers: Wallpaper[];
  isLoading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  
  // Filters
  selectedCategory: string;
  selectedTab: "popular" | "new" | "foryou";
  
  // Favorites (local)
  favorites: string[];
  
  // Actions
  setWallpapers: (wallpapers: Wallpaper[]) => void;
  appendWallpapers: (wallpapers: Wallpaper[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPage: (page: number) => void;
  setHasMore: (hasMore: boolean) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedTab: (tab: "popular" | "new" | "foryou") => void;
  toggleFavorite: (wallpaperId: string) => void;
  isFavorite: (wallpaperId: string) => boolean;
  reset: () => void;
}

export const useWallpaperStore = create<WallpaperState>()(
  persist(
    (set, get) => ({
      // Initial state
      wallpapers: [],
      isLoading: false,
      error: null,
      page: 1,
      hasMore: true,
      selectedCategory: "all",
      selectedTab: "popular",
      favorites: [],

      // Actions
      setWallpapers: (wallpapers) => set({ wallpapers }),
      appendWallpapers: (wallpapers) =>
        set((state) => ({
          wallpapers: [...state.wallpapers, ...wallpapers],
        })),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setPage: (page) => set({ page }),
      setHasMore: (hasMore) => set({ hasMore }),
      setSelectedCategory: (selectedCategory) =>
        set({ selectedCategory, wallpapers: [], page: 1, hasMore: true }),
      setSelectedTab: (selectedTab) =>
        set({ selectedTab, wallpapers: [], page: 1, hasMore: true }),
      toggleFavorite: (wallpaperId: string) =>
        set((state: WallpaperState) => ({
          favorites: state.favorites.includes(wallpaperId)
            ? state.favorites.filter((id: string) => id !== wallpaperId)
            : [...state.favorites, wallpaperId],
        })),
      isFavorite: (wallpaperId: string) => get().favorites.includes(wallpaperId),
      reset: () =>
        set({
          wallpapers: [],
          isLoading: false,
          error: null,
          page: 1,
          hasMore: true,
        }),
    }),
    {
      name: "wallpaper-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state: WallpaperState) => ({ favorites: state.favorites }),
    }
  )
);

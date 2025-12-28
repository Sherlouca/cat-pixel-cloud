import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PREMIUM_STORAGE_KEY = "@cats_wallpaper_premium";
const USAGE_STORAGE_KEY = "@cats_wallpaper_usage";

// Limites para usuários gratuitos
export const FREE_LIMITS = {
  AI_GENERATIONS_PER_DAY: 3,
  WALLPAPERS_PER_DAY: 20,
  MAX_RESOLUTION: "sd" as const, // Standard Definition
};

// Benefícios premium
export const PREMIUM_BENEFITS = {
  AI_GENERATIONS_PER_DAY: Infinity,
  WALLPAPERS_PER_DAY: Infinity,
  MAX_RESOLUTION: "4k" as const,
  NO_ADS: true,
  EXCLUSIVE_CATEGORIES: true,
  EARLY_ACCESS: true,
};

// Planos disponíveis
export const SUBSCRIPTION_PLANS = {
  monthly: {
    id: "cats_premium_monthly",
    name: "Mensal",
    price: "R$ 4,90",
    priceValue: 4.9,
    period: "mês",
    description: "Cobrado mensalmente",
  },
  yearly: {
    id: "cats_premium_yearly",
    name: "Anual",
    price: "R$ 29,90",
    priceValue: 29.9,
    period: "ano",
    description: "Economize 49%",
    savings: "49%",
  },
};

interface DailyUsage {
  date: string; // YYYY-MM-DD
  aiGenerations: number;
  wallpaperViews: number;
}

interface PremiumState {
  isPremium: boolean;
  subscriptionPlan: "monthly" | "yearly" | null;
  subscriptionExpiry: string | null; // ISO date string
  dailyUsage: DailyUsage;
  isLoading: boolean;
  
  // Actions
  loadPremiumStatus: () => Promise<void>;
  setPremium: (plan: "monthly" | "yearly", expiryDate: string) => Promise<void>;
  removePremium: () => Promise<void>;
  
  // Usage tracking
  incrementAIGeneration: () => Promise<boolean>; // Returns true if allowed
  incrementWallpaperView: () => Promise<boolean>; // Returns true if allowed
  canGenerateAI: () => boolean;
  canViewWallpaper: () => boolean;
  getRemainingAIGenerations: () => number;
  getRemainingWallpaperViews: () => number;
  resetDailyUsageIfNeeded: () => Promise<void>;
}

const getTodayDate = () => {
  return new Date().toISOString().split("T")[0];
};

const getDefaultUsage = (): DailyUsage => ({
  date: getTodayDate(),
  aiGenerations: 0,
  wallpaperViews: 0,
});

export const usePremiumStore = create<PremiumState>((set, get) => ({
  isPremium: false,
  subscriptionPlan: null,
  subscriptionExpiry: null,
  dailyUsage: getDefaultUsage(),
  isLoading: true,

  loadPremiumStatus: async () => {
    try {
      const [premiumData, usageData] = await Promise.all([
        AsyncStorage.getItem(PREMIUM_STORAGE_KEY),
        AsyncStorage.getItem(USAGE_STORAGE_KEY),
      ]);

      let isPremium = false;
      let subscriptionPlan: "monthly" | "yearly" | null = null;
      let subscriptionExpiry: string | null = null;

      if (premiumData) {
        const parsed = JSON.parse(premiumData);
        // Check if subscription is still valid
        if (parsed.expiryDate && new Date(parsed.expiryDate) > new Date()) {
          isPremium = true;
          subscriptionPlan = parsed.plan;
          subscriptionExpiry = parsed.expiryDate;
        }
      }

      let dailyUsage = getDefaultUsage();
      if (usageData) {
        const parsed = JSON.parse(usageData);
        // Reset if it's a new day
        if (parsed.date === getTodayDate()) {
          dailyUsage = parsed;
        }
      }

      set({
        isPremium,
        subscriptionPlan,
        subscriptionExpiry,
        dailyUsage,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error loading premium status:", error);
      set({ isLoading: false });
    }
  },

  setPremium: async (plan, expiryDate) => {
    try {
      const data = { plan, expiryDate };
      await AsyncStorage.setItem(PREMIUM_STORAGE_KEY, JSON.stringify(data));
      set({
        isPremium: true,
        subscriptionPlan: plan,
        subscriptionExpiry: expiryDate,
      });
    } catch (error) {
      console.error("Error setting premium:", error);
    }
  },

  removePremium: async () => {
    try {
      await AsyncStorage.removeItem(PREMIUM_STORAGE_KEY);
      set({
        isPremium: false,
        subscriptionPlan: null,
        subscriptionExpiry: null,
      });
    } catch (error) {
      console.error("Error removing premium:", error);
    }
  },

  resetDailyUsageIfNeeded: async () => {
    const { dailyUsage } = get();
    const today = getTodayDate();
    
    if (dailyUsage.date !== today) {
      const newUsage = getDefaultUsage();
      await AsyncStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(newUsage));
      set({ dailyUsage: newUsage });
    }
  },

  canGenerateAI: () => {
    const { isPremium, dailyUsage } = get();
    if (isPremium) return true;
    return dailyUsage.aiGenerations < FREE_LIMITS.AI_GENERATIONS_PER_DAY;
  },

  canViewWallpaper: () => {
    const { isPremium, dailyUsage } = get();
    if (isPremium) return true;
    return dailyUsage.wallpaperViews < FREE_LIMITS.WALLPAPERS_PER_DAY;
  },

  getRemainingAIGenerations: () => {
    const { isPremium, dailyUsage } = get();
    if (isPremium) return Infinity;
    return Math.max(0, FREE_LIMITS.AI_GENERATIONS_PER_DAY - dailyUsage.aiGenerations);
  },

  getRemainingWallpaperViews: () => {
    const { isPremium, dailyUsage } = get();
    if (isPremium) return Infinity;
    return Math.max(0, FREE_LIMITS.WALLPAPERS_PER_DAY - dailyUsage.wallpaperViews);
  },

  incrementAIGeneration: async () => {
    const { isPremium, dailyUsage } = get();
    
    // Reset if new day
    await get().resetDailyUsageIfNeeded();
    
    if (isPremium) return true;
    
    if (dailyUsage.aiGenerations >= FREE_LIMITS.AI_GENERATIONS_PER_DAY) {
      return false;
    }

    const newUsage = {
      ...dailyUsage,
      aiGenerations: dailyUsage.aiGenerations + 1,
    };
    
    await AsyncStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(newUsage));
    set({ dailyUsage: newUsage });
    return true;
  },

  incrementWallpaperView: async () => {
    const { isPremium, dailyUsage } = get();
    
    // Reset if new day
    await get().resetDailyUsageIfNeeded();
    
    if (isPremium) return true;
    
    if (dailyUsage.wallpaperViews >= FREE_LIMITS.WALLPAPERS_PER_DAY) {
      return false;
    }

    const newUsage = {
      ...dailyUsage,
      wallpaperViews: dailyUsage.wallpaperViews + 1,
    };
    
    await AsyncStorage.setItem(USAGE_STORAGE_KEY, JSON.stringify(newUsage));
    set({ dailyUsage: newUsage });
    return true;
  },
}));

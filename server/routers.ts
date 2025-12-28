import { z } from "zod";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { generateImage } from "./_core/imageGeneration";
import * as db from "./db";

// The Cat API - Free, no API key required for basic usage
const CAT_API_BASE = "https://api.thecatapi.com/v1";

interface CatImage {
  id: string;
  url: string;
  width: number;
  height: number;
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Wallpapers router using The Cat API
  wallpapers: router({
    // Search wallpapers from The Cat API
    search: publicProcedure
      .input(
        z.object({
          query: z.string().default("cat"),
          page: z.number().min(1).default(1),
          perPage: z.number().min(1).max(80).default(20),
        })
      )
      .mutation(async ({ input }) => {
        const { page, perPage } = input;
        
        try {
          // Build URL with parameters
          const params = new URLSearchParams({
            limit: perPage.toString(),
            page: page.toString(),
            order: "RANDOM",
            size: "full",
          });

          const response = await fetch(`${CAT_API_BASE}/images/search?${params}`);
          
          if (!response.ok) {
            throw new Error(`Cat API error: ${response.status}`);
          }

          const cats: CatImage[] = await response.json();

          // Transform to match our expected format
          const photos = cats.map((cat) => ({
            id: cat.id,
            width: cat.width || 1920,
            height: cat.height || 1080,
            url: cat.url,
            photographer: "The Cat API",
            photographer_url: "https://thecatapi.com",
            photographer_id: 0,
            avg_color: "#1a1a2e",
            src: {
              original: cat.url,
              large2x: cat.url,
              large: cat.url,
              medium: cat.url,
              small: cat.url,
              portrait: cat.url,
              landscape: cat.url,
              tiny: cat.url,
            },
            liked: false,
            alt: "Cat wallpaper",
          }));

          return {
            total_results: photos.length,
            page,
            per_page: perPage,
            photos,
          };
        } catch (error) {
          console.error("Error fetching from Cat API:", error);
          return {
            total_results: 0,
            page,
            per_page: perPage,
            photos: [],
          };
        }
      }),
  }),

  // AI Generation router
  generate: router({
    // Generate wallpaper with AI
    create: publicProcedure
      .input(
        z.object({
          prompt: z.string().min(1).max(500),
        })
      )
      .mutation(async ({ input }) => {
        const { prompt } = input;
        
        // Enhance prompt for better cat wallpaper results
        const enhancedPrompt = `High quality smartphone wallpaper, vertical orientation, ${prompt}, cat theme, beautiful lighting, professional photography style, 4K resolution`;
        
        const result = await generateImage({
          prompt: enhancedPrompt,
        });

        return {
          url: result.url,
          prompt: input.prompt,
        };
      }),
  }),

  // Favorites router (requires authentication)
  favorites: router({
    // List user favorites
    list: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserFavorites(ctx.user.id);
    }),

    // Add to favorites
    add: protectedProcedure
      .input(
        z.object({
          wallpaperId: z.string(),
          wallpaperUrl: z.string().url(),
          thumbnailUrl: z.string().url(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return db.addFavorite(ctx.user.id, input);
      }),

    // Remove from favorites
    remove: protectedProcedure
      .input(
        z.object({
          wallpaperId: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return db.removeFavorite(ctx.user.id, input.wallpaperId);
      }),
  }),
});

export type AppRouter = typeof appRouter;

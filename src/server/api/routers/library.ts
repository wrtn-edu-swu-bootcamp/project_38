// Library router

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { searchKakaoLibraries, searchKakaoLibrariesByKeyword } from "@/server/services/datasource/kakao";
import { calculateDistance } from "@/server/utils/geo";

export const libraryRouter = createTRPCRouter({
  // Search libraries by location using Kakao API
  searchNearby: publicProcedure
    .input(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
        radius: z.number().min(100).max(20000).default(5000), // meters
      })
    )
    .query(async ({ input }) => {
      const libraries = await searchKakaoLibraries(
        input.latitude,
        input.longitude,
        input.radius
      );

      // Calculate distance for each library
      return libraries.map((library) => ({
        ...library,
        distance: calculateDistance(
          input.latitude,
          input.longitude,
          library.latitude,
          library.longitude
        ),
      })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }),

  // Search libraries by keyword
  searchByKeyword: publicProcedure
    .input(
      z.object({
        keyword: z.string().min(1),
        page: z.number().min(1).default(1),
        userLatitude: z.number().optional(),
        userLongitude: z.number().optional(),
      })
    )
    .query(async ({ input }) => {
      const libraries = await searchKakaoLibrariesByKeyword(input.keyword, input.page);

      // Add distance if user location is provided
      if (input.userLatitude && input.userLongitude) {
        return libraries.map((library) => ({
          ...library,
          distance: calculateDistance(
            input.userLatitude!,
            input.userLongitude!,
            library.latitude,
            library.longitude
          ),
        })).sort((a, b) => (a.distance || 0) - (b.distance || 0));
      }

      return libraries;
    }),

  // Find libraries with specific book (by ISBN)
  findWithBook: publicProcedure
    .input(
      z.object({
        isbn: z.string(),
        userLatitude: z.number().optional(),
        userLongitude: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      // Find libraries that have this book
      const libraryBooks = await ctx.db.libraryBook.findMany({
        where: {
          reference: {
            isbn: input.isbn,
          },
        },
        include: {
          library: true,
          reference: true,
        },
      });

      // Add distance if user location is provided
      const results = libraryBooks.map((lb) => ({
        id: lb.id,
        library: lb.library,
        available: lb.available,
        callNumber: lb.callNumber,
        location: lb.location,
        distance:
          input.userLatitude && input.userLongitude
            ? calculateDistance(
                input.userLatitude,
                input.userLongitude,
                lb.library.latitude,
                lb.library.longitude
              )
            : undefined,
      }));

      // Sort by distance if available
      return results.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }),

  // Get library by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const library = await ctx.db.library.findUnique({
        where: { id: input.id },
        include: {
          books: {
            include: {
              reference: true,
            },
          },
        },
      });
      return library;
    }),

  // Get all libraries (for map)
  getAll: publicProcedure
    .input(
      z.object({
        region: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const libraries = await ctx.db.library.findMany({
        where: input?.region ? { region: input.region } : undefined,
        take: input?.limit ?? 50,
      });
      return libraries;
    }),
});

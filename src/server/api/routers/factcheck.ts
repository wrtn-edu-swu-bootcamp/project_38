// Fact-checking router

import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/api/trpc";
import { analyzeFactCheck } from "@/server/services/factcheck/analyzer";

export const factCheckRouter = createTRPCRouter({
  // Create a new fact-check request (protected - requires login)
  create: protectedProcedure
    .input(
      z.object({
        inputType: z.enum(["TEXT", "URL", "IMAGE"]),
        content: z.string().min(10, "최소 10자 이상 입력해주세요").max(5000),
        imageUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Create fact-check in database
      const factCheck = await ctx.db.factCheck.create({
        data: {
          userId: ctx.session.user.id,
          inputType: input.inputType,
          content: input.content,
          imageUrl: input.imageUrl,
          status: "PENDING",
        },
      });

      // Start analysis in background (don't await)
      analyzeFactCheck(factCheck.id, input.content).catch((error) => {
        console.error("Background analysis failed:", error);
      });

      return factCheck;
    }),

  // Create a new fact-check request (public - no login required)
  createPublic: publicProcedure
    .input(
      z.object({
        inputType: z.enum(["TEXT", "URL", "IMAGE"]),
        content: z.string().min(10, "최소 10자 이상 입력해주세요").max(5000),
        imageUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Create fact-check in database (without user)
      const factCheck = await ctx.db.factCheck.create({
        data: {
          inputType: input.inputType,
          content: input.content,
          imageUrl: input.imageUrl,
          status: "PENDING",
        },
      });

      // Start analysis in background (don't await)
      analyzeFactCheck(factCheck.id, input.content).catch((error) => {
        console.error("Background analysis failed:", error);
      });

      return factCheck;
    }),

  // Get fact-check by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const factCheck = await ctx.db.factCheck.findUnique({
        where: { id: input.id },
        include: {
          references: {
            include: {
              libraryBooks: {
                include: {
                  library: true,
                },
              },
            },
            orderBy: {
              relevanceScore: "desc",
            },
          },
        },
      });
      return factCheck;
    }),

  // Get all fact-checks for current user
  getAll: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
        cursor: z.string().optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 20;
      const cursor = input?.cursor;

      const factChecks = await ctx.db.factCheck.findMany({
        where: { userId: ctx.session.user.id },
        orderBy: { createdAt: "desc" },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        include: {
          references: {
            take: 3,
          },
        },
      });

      let nextCursor: string | undefined = undefined;
      if (factChecks.length > limit) {
        const nextItem = factChecks.pop();
        nextCursor = nextItem?.id;
      }

      return {
        items: factChecks,
        nextCursor,
      };
    }),

  // Get recent fact-checks (public - for homepage)
  getRecent: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(10).default(5) }))
    .query(async ({ ctx, input }) => {
      const factChecks = await ctx.db.factCheck.findMany({
        where: { status: "COMPLETED" },
        orderBy: { createdAt: "desc" },
        take: input.limit,
        select: {
          id: true,
          content: true,
          trustScore: true,
          verdict: true,
          summary: true,
          createdAt: true,
        },
      });
      return factChecks;
    }),

  // Delete a fact-check
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      const factCheck = await ctx.db.factCheck.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });

      if (!factCheck) {
        throw new Error("팩트체크를 찾을 수 없거나 삭제 권한이 없습니다.");
      }

      await ctx.db.factCheck.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});

// Fact-checking router
// TODO: Implement fact-checking logic in Phase 3

import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/api/trpc";

export const factCheckRouter = createTRPCRouter({
  // Create a new fact-check request
  create: protectedProcedure
    .input(
      z.object({
        inputType: z.enum(["TEXT", "URL", "IMAGE"]),
        content: z.string(),
        imageUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: Implement in Phase 3
      // For now, create a placeholder fact-check in the database
      const factCheck = await ctx.db.factCheck.create({
        data: {
          userId: ctx.session.user.id,
          inputType: input.inputType,
          content: input.content,
          imageUrl: input.imageUrl,
          status: "PENDING",
        },
      });
      return factCheck;
    }),

  // Get fact-check by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // TODO: Implement in Phase 3
      const factCheck = await ctx.db.factCheck.findUnique({
        where: { id: input.id },
        include: {
          references: true,
        },
      });
      return factCheck;
    }),

  // Get all fact-checks for current user
  getAll: protectedProcedure.query(async ({ ctx }) => {
    // TODO: Implement in Phase 3
    const factChecks = await ctx.db.factCheck.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        references: true,
      },
    });
    return factChecks;
  }),
});

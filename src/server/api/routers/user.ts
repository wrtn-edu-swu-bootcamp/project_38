// User router

import { z } from "zod";
import bcrypt from "bcryptjs";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  // Register a new user
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email("유효한 이메일을 입력해주세요"),
        password: z.string().min(8, "비밀번호는 최소 8자 이상이어야 합니다"),
        name: z.string().min(2, "이름은 최소 2자 이상이어야 합니다").optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if email already exists
      const existingUser = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new Error("이미 등록된 이메일입니다.");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(input.password, 12);

      // Create user
      const user = await ctx.db.user.create({
        data: {
          email: input.email,
          password: hashedPassword,
          name: input.name,
        },
      });

      return {
        id: user.id,
        email: user.email,
        name: user.name,
      };
    }),

  // Get current user profile
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        _count: {
          select: {
            factChecks: true,
          },
        },
      },
    });

    return user;
  }),

  // Update user profile
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).optional(),
        image: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          name: input.name,
          image: input.image,
        },
      });

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      };
    }),

  // Change password
  changePassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string(),
        newPassword: z.string().min(8, "새 비밀번호는 최소 8자 이상이어야 합니다"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (!user || !user.password) {
        throw new Error("사용자를 찾을 수 없습니다.");
      }

      const isPasswordValid = await bcrypt.compare(
        input.currentPassword,
        user.password
      );

      if (!isPasswordValid) {
        throw new Error("현재 비밀번호가 일치하지 않습니다.");
      }

      const hashedPassword = await bcrypt.hash(input.newPassword, 12);

      await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { password: hashedPassword },
      });

      return { success: true };
    }),

  // Get user stats
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const [totalChecks, completedChecks, verdictCounts] = await Promise.all([
      ctx.db.factCheck.count({
        where: { userId: ctx.session.user.id },
      }),
      ctx.db.factCheck.count({
        where: {
          userId: ctx.session.user.id,
          status: "COMPLETED",
        },
      }),
      ctx.db.factCheck.groupBy({
        by: ["verdict"],
        where: {
          userId: ctx.session.user.id,
          status: "COMPLETED",
        },
        _count: true,
      }),
    ]);

    return {
      totalChecks,
      completedChecks,
      verdictCounts: verdictCounts.reduce(
        (acc, item) => {
          if (item.verdict) {
            acc[item.verdict] = item._count;
          }
          return acc;
        },
        {} as Record<string, number>
      ),
    };
  }),

  // Delete account
  deleteAccount: protectedProcedure
    .input(
      z.object({
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (!user || !user.password) {
        throw new Error("사용자를 찾을 수 없습니다.");
      }

      const isPasswordValid = await bcrypt.compare(input.password, user.password);

      if (!isPasswordValid) {
        throw new Error("비밀번호가 일치하지 않습니다.");
      }

      // Delete user (cascades to related data)
      await ctx.db.user.delete({
        where: { id: ctx.session.user.id },
      });

      return { success: true };
    }),
});

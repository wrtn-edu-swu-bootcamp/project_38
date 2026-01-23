import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const bookmarkRouter = createTRPCRouter({
  // 북마크 추가
  create: protectedProcedure
    .input(
      z.object({
        factCheckId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { factCheckId } = input;
      const userId = ctx.session.user.id;

      // 팩트체크 존재 확인
      const factCheck = await ctx.db.factCheck.findUnique({
        where: { id: factCheckId },
      });

      if (!factCheck) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "팩트체크를 찾을 수 없습니다.",
        });
      }

      // 이미 북마크 되어있는지 확인
      const existingBookmark = await ctx.db.bookmark.findUnique({
        where: {
          userId_factCheckId: {
            userId,
            factCheckId,
          },
        },
      });

      if (existingBookmark) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "이미 북마크에 추가되어 있습니다.",
        });
      }

      // 북마크 생성
      const bookmark = await ctx.db.bookmark.create({
        data: {
          userId,
          factCheckId,
        },
        include: {
          factCheck: {
            select: {
              id: true,
              content: true,
              verdict: true,
              trustScore: true,
              createdAt: true,
            },
          },
        },
      });

      return bookmark;
    }),

  // 북마크 삭제
  delete: protectedProcedure
    .input(
      z.object({
        factCheckId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { factCheckId } = input;
      const userId = ctx.session.user.id;

      // 북마크 존재 확인
      const bookmark = await ctx.db.bookmark.findUnique({
        where: {
          userId_factCheckId: {
            userId,
            factCheckId,
          },
        },
      });

      if (!bookmark) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "북마크를 찾을 수 없습니다.",
        });
      }

      // 북마크 삭제
      await ctx.db.bookmark.delete({
        where: {
          id: bookmark.id,
        },
      });

      return { success: true };
    }),

  // 북마크 목록 조회
  getAll: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;
      const userId = ctx.session.user.id;

      const bookmarks = await ctx.db.bookmark.findMany({
        where: {
          userId,
        },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          factCheck: {
            select: {
              id: true,
              content: true,
              verdict: true,
              trustScore: true,
              status: true,
              createdAt: true,
              _count: {
                select: {
                  references: true,
                },
              },
            },
          },
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (bookmarks.length > limit) {
        const nextItem = bookmarks.pop();
        nextCursor = nextItem!.id;
      }

      return {
        bookmarks,
        nextCursor,
      };
    }),

  // 북마크 여부 확인
  check: protectedProcedure
    .input(
      z.object({
        factCheckId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { factCheckId } = input;
      const userId = ctx.session.user.id;

      const bookmark = await ctx.db.bookmark.findUnique({
        where: {
          userId_factCheckId: {
            userId,
            factCheckId,
          },
        },
      });

      return {
        bookmarked: !!bookmark,
      };
    }),

  // 북마크 개수 조회
  getCount: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const count = await ctx.db.bookmark.count({
      where: {
        userId,
      },
    });

    return { count };
  }),
});

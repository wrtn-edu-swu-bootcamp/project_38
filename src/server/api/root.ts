// Root tRPC router
// All API routers are combined here

import { createTRPCRouter } from "@/server/api/trpc";
import { factCheckRouter } from "./routers/factcheck";
import { libraryRouter } from "./routers/library";
import { userRouter } from "./routers/user";
import { bookmarkRouter } from "./routers/bookmark";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  factCheck: factCheckRouter,
  library: libraryRouter,
  user: userRouter,
  bookmark: bookmarkRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;

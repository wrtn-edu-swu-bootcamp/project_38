// Root tRPC router
// All API routers are combined here

import { createTRPCRouter } from "@/server/api/trpc";
import { factCheckRouter } from "./routers/factcheck";
import { libraryRouter } from "./routers/library";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  factCheck: factCheckRouter,
  library: libraryRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter;

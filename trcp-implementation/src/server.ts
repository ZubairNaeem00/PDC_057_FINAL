import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import { initTRPC } from "@trpc/server";

console.log("🚀 Server file loaded");

const t = initTRPC.create();

const appRouter = t.router({
  uploadImage: t.procedure.query(() => {
    return { label: "cat", confidence: 0.9 };
  })
});

export type AppRouter = typeof appRouter;

const app = express();

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter
  })
);

app.listen(4000, () => {
  console.log("✅ tRPC server running at http://localhost:4000/trpc");
});

import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { classifyImage } from "./model";

const t = initTRPC.create();

export const appRouter = t.router({
  uploadImage: t.procedure
    .input(z.object({ imageName: z.string() }))
    .mutation(async () => {
      return classifyImage();
    })
});

export type AppRouter = typeof appRouter; // ✅ export AppRouter here

import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "./router"; // ✅ import from router.ts

const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:4000/trpc",
    }),
  ],
});

async function run() {
  const start = Date.now();

  // call mutation correctly
  const res = await client.uploadImage.mutate({
    imageName: "image_test.jpg",
  });

  console.log(res);
  console.log("Time:", Date.now() - start, "ms");
}

run();

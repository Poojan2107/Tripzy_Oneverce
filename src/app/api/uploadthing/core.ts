import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/src/backend/lib/auth";

const f = createUploadthing();

async function uploadAuthMiddleware({ req }: { req: Request }) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return { userId: session.user.id };
}

export const ourFileRouter = {
  destinationImage: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(uploadAuthMiddleware)
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl };
    }),

  experienceImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(uploadAuthMiddleware)
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

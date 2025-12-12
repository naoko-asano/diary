import { upload } from "@vercel/blob/client";

export async function uploadImage(file: File) {
  return await upload(`${process.env.NODE_ENV}/${file.name}`, file, {
    access: "public",
    handleUploadUrl: "/api/images/",
  });
}

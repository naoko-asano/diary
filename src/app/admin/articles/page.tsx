import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { FlashMessageNotifier } from "@/components/FlashMessageNotifier";
import { ArticleList } from "@/features/articles/components/ArticleList";
import { deleteArticle } from "@/features/articles/services";
import prisma from "@/lib/database";

export default async function Page() {
  const articles = await prisma.article.findMany();

  // Article Formから遷移してきた場合のみ通知を表示
  const flashMessageCookie = (await cookies()).get("flash-message");
  const notification = flashMessageCookie
    ? JSON.parse(flashMessageCookie.value)
    : null;
  const isCreated = notification?.type === "success";

  async function handleDelete(id: number) {
    "use server";
    await deleteArticle(id);
    revalidatePath("/admin/articles");
  }
  return (
    <>
      {isCreated && (
        <FlashMessageNotifier
          type={notification.type}
          message={notification.message}
        />
      )}
      <ArticleList articles={articles} onDeleteAction={handleDelete} />
    </>
  );
}

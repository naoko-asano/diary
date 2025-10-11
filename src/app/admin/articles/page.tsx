import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { FlashMessageNotifier } from "@/components/FlashMessageNotifier";
import { ArticleList } from "@/features/articles/components/ArticleList";
import { deleteArticle } from "@/features/articles/services";
import prisma from "@/lib/database";
import {
  FLASH_MESSAGE_COOKIE_NAME,
  resolveFlashMessageContent,
} from "@/utils/flashMessage";

export default async function Page() {
  const articles = await prisma.article.findMany();

  // Article Formから遷移してきた場合のみ通知を表示
  const flashMessageCookie = (await cookies()).get(FLASH_MESSAGE_COOKIE_NAME);
  const flashMessageContent = resolveFlashMessageContent(flashMessageCookie);

  async function handleDelete(id: number) {
    "use server";
    await deleteArticle(id);
    revalidatePath("/admin/articles");
  }
  return (
    <>
      {flashMessageContent && <FlashMessageNotifier {...flashMessageContent} />}
      <ArticleList articles={articles} onDeleteAction={handleDelete} />
    </>
  );
}

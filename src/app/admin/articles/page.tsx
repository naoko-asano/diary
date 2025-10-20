import { Box, Center, Flex, Pagination } from "@mantine/core";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { FlashMessageNotifier } from "@/components/FlashMessageNotifier";
import { ArticleList } from "@/features/articles/components/ArticleList";
import { deleteArticle } from "@/features/articles/services";
import { getAllArticles } from "@/features/articles/services";
import {
  FLASH_MESSAGE_COOKIE_NAME,
  resolveFlashMessageContent,
} from "@/utils/flashMessage";

const ARTICLE_COUNT_PER_PAGE = 20;

export default async function Page() {
  const articles = await getAllArticles();
  const lastPageIndex = Math.ceil(articles.length / ARTICLE_COUNT_PER_PAGE);

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
      <Flex
        direction="column"
        miw="100%"
        mih="calc(100vh - 128px - 78px - 64px)"
      >
        {flashMessageContent && (
          <FlashMessageNotifier {...flashMessageContent} />
        )}
        <Box style={{ flex: 1 }}>
          <ArticleList articles={articles} onDeleteAction={handleDelete} />
        </Box>
        <Center mt="auto">
          <Pagination
            total={lastPageIndex}
            size="sm"
            styles={{ control: { fontSize: "20px" } }}
          />
        </Center>
      </Flex>
    </>
  );
}

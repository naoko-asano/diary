import { Box, Center } from "@mantine/core";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { Pagination } from "@/components/Pagination";
import { PlusButton } from "@/components/PlusButton";
import { ArticleList } from "@/features/articles/components/ArticleList";
import { deleteArticle } from "@/features/articles/services";
import { getPaginatedArticles } from "@/features/articles/services";
import { FlashMessageNotifier } from "@/features/flashMessage/components/FlashMessageNotifier";
import {
  FLASH_MESSAGE_COOKIE_NAME,
  resolveFlashMessageContent,
} from "@/features/flashMessage/model";
import { parsePageParam } from "@/utils/parsePageParam";

type Props = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;
  const page = parsePageParam(searchParams.page);
  const { articles, totalPage } = await getPaginatedArticles({ page });

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
      <Box style={{ flex: 1 }}>
        <ArticleList articles={articles} onDeleteAction={handleDelete} />
      </Box>
      <Box ta="right">
        <PlusButton
          role="link"
          href="/admin/articles/new"
          size="input-xl"
          aria-label="Add Article"
        />
      </Box>
      <Center mt="auto">
        <Pagination activePage={page} total={totalPage} />
      </Center>
    </>
  );
}

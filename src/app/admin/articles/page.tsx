import { Box, Center } from "@mantine/core";
import { revalidatePath } from "next/cache";

import { Pagination } from "@/components/Pagination";
import { PlusButton } from "@/components/PlusButton";
import { ArticleList } from "@/features/articles/components/ArticleList";
import { deleteArticle } from "@/features/articles/gateway";
import { getPaginatedArticles } from "@/features/articles/gateway";
import { FlashMessageNotifier } from "@/features/flashMessage/components/FlashMessageNotifier";
import { flashMessageCookie } from "@/features/flashMessage/gateway/flashMessageCookie";
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
  const hasFlashMessage = !!(await flashMessageCookie());

  async function handleDelete(id: number) {
    "use server";
    await deleteArticle(id);
    revalidatePath("/admin/articles");
  }

  return (
    <>
      {hasFlashMessage && <FlashMessageNotifier />}
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

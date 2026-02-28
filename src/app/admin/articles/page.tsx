import { Box, Center } from "@mantine/core";
import { revalidatePath } from "next/cache";

import { Pagination } from "@/components/Pagination";
import { PlusButton } from "@/components/PlusButton";
import { ArticleList } from "@/features/articles/components/ArticleList";
import { articleRepository } from "@/features/articles/infrastructure/repository";
import {
  deleteArticle,
  findPaginatedArticles,
} from "@/features/articles/usecases";
import { FlashMessageNotifier } from "@/features/flashMessage/components/FlashMessageNotifier";
import { flashMessageCookie } from "@/features/flashMessage/gateway/flashMessageCookie";
import { computeTotalPages } from "@/utils/page";
import { parsePageParam } from "@/utils/parsePageParam";

type Props = {
  searchParams: Promise<{
    page?: string;
  }>;
};

const ARTICLES_PER_PAGE = 15;

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;
  const currentPage = parsePageParam(searchParams.page);
  const { articles, totalCount } = await findPaginatedArticles(
    { currentPage, perPage: ARTICLES_PER_PAGE },
    articleRepository,
  );
  const hasFlashMessage = !!(await flashMessageCookie());

  async function handleDelete(id: number) {
    "use server";
    await deleteArticle({ id }, articleRepository);
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
        <Pagination
          activePage={currentPage}
          total={computeTotalPages({ totalCount, perPage: ARTICLES_PER_PAGE })}
        />
      </Center>
    </>
  );
}

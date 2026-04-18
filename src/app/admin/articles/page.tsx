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
import { StoredNotificationDisplay } from "@/features/notifications/components/StoredNotificationDisplay";
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

  async function remove(articleId: number) {
    "use server";
    await deleteArticle({ id: articleId }, articleRepository);
    revalidatePath("/admin/articles");
  }

  return (
    <>
      <StoredNotificationDisplay />
      <Box style={{ flex: 1 }}>
        <ArticleList articles={articles} deleteAction={remove} />
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

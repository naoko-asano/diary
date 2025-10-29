"use client";

import {
  Anchor,
  Button,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
} from "@mantine/core";
import { useState } from "react";

import { ConfirmationModal } from "@/components/ConfirmationModal";
import { Article } from "@/generated/prisma";

type Props = {
  articles: Article[];
  onDeleteAction: (id: number) => void;
};

export function ArticleList({ articles, onDeleteAction }: Props) {
  const [deletingModalOpened, setDeletingModalOpened] = useState<{
    opened: boolean;
    articleId: number | null;
  }>({
    opened: false,
    articleId: null,
  });

  return (
    <>
      <Table>
        <TableThead>
          <TableTr>
            <TableTh>Title</TableTh>
          </TableTr>
        </TableThead>
        {articles.map((article) => (
          <TableTbody key={article.id}>
            <TableTr>
              <TableTd>
                <Anchor href={`/articles/${article.id}`} c="white">
                  {article.title}
                </Anchor>
              </TableTd>
              <TableTd>
                <Button
                  size="xs"
                  component="a"
                  href={`/admin/articles/${article.id}/edit`}
                >
                  Edit
                </Button>
              </TableTd>
              <TableTd>
                <Button
                  size="xs"
                  color="red"
                  onClick={() =>
                    setDeletingModalOpened({
                      opened: true,
                      articleId: article.id,
                    })
                  }
                >
                  Delete
                </Button>
              </TableTd>
            </TableTr>
          </TableTbody>
        ))}
      </Table>
      <ConfirmationModal
        isOpened={deletingModalOpened.opened}
        onAccept={() => {
          deletingModalOpened.articleId &&
            onDeleteAction(deletingModalOpened.articleId);
        }}
        onClose={() =>
          setDeletingModalOpened({ opened: false, articleId: null })
        }
        body={"記事を削除します。\nこの操作は元に戻せません。よろしいですか？"}
      />
    </>
  );
}

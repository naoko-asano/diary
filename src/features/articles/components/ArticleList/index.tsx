"use client";

import {
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
              <TableTd>{article.title}</TableTd>
              <TableTd>
                <Button size="xs">Edit</Button>
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
        body="記事を削除します。よろしいですか？"
      />
    </>
  );
}

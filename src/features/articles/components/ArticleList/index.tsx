"use client";

import {
  Button,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Text,
} from "@mantine/core";
import Link from "next/link";
import { useState } from "react";

import { ConfirmationModal } from "@/components/ConfirmationModal";
import { TrashButton } from "@/components/TrashButton";
import { Article } from "@/generated/prisma";
import { formatDate } from "@/utils/date";
import { FlashMessageTypes, showFlashMessage } from "@/utils/flashMessage";

import styles from "./styles.module.css";

type Props = {
  articles: Article[];
  onDeleteAction: (id: number) => Promise<void>;
};

export function ArticleList({ articles, onDeleteAction }: Props) {
  const [deleteModalOpened, setDeleteModalOpened] = useState<{
    opened: boolean;
    articleId: number | null;
  }>({
    opened: false,
    articleId: null,
  });

  const handleDelete = async () => {
    if (!deleteModalOpened.articleId) return;
    try {
      await onDeleteAction(deleteModalOpened.articleId);
      showFlashMessage({
        type: FlashMessageTypes.SUCCESS,
        message: "Article deleted successfully!",
      });
    } catch {
      showFlashMessage({
        type: FlashMessageTypes.ERROR,
        message: "Failed to delete article.\nPlease try again later.",
      });
    }
  };

  return (
    <>
      <Table>
        <TableThead>
          <TableTr>
            <TableTh>Title</TableTh>
            <TableTh>Date</TableTh>
          </TableTr>
        </TableThead>
        {articles.map((article) => (
          <TableTbody key={article.id}>
            <TableTr>
              <TableTd>
                <Link href={`/articles/${article.id}`}>
                  <Text size="sm" className={styles.title} td="underline">
                    {article.title}
                  </Text>
                </Link>
              </TableTd>
              <TableTd>{formatDate(article.date)}</TableTd>
              <TableTd>
                <Button
                  size="xs"
                  component={Link}
                  href={`/admin/articles/${article.id}/edit`}
                >
                  Edit
                </Button>
              </TableTd>
              <TableTd>
                <TrashButton
                  onClick={() => {
                    setDeleteModalOpened({
                      opened: true,
                      articleId: article.id,
                    });
                  }}
                  aria-label="Delete Article"
                  size="input-sm"
                />
              </TableTd>
            </TableTr>
          </TableTbody>
        ))}
      </Table>
      <ConfirmationModal
        isOpened={deleteModalOpened.opened}
        onAccept={handleDelete}
        onClose={() => setDeleteModalOpened({ opened: false, articleId: null })}
        body={"記事を削除します。\nこの操作は元に戻せません。よろしいですか？"}
      />
    </>
  );
}

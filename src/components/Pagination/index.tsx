"use client";

import { Pagination as OriginalPagination } from "@mantine/core";
import { redirect, usePathname } from "next/navigation";

type Props = {
  total: number;
};

export function Pagination(props: Props) {
  const { total } = props;

  const pathName = usePathname();

  function handlePageChange(page: number) {
    redirect(`${pathName}?page=${page}`);
  }

  return (
    <OriginalPagination
      total={total}
      size="sm"
      styles={{ control: { fontSize: "20px" } }}
      onChange={(page) => {
        handlePageChange(page);
      }}
    />
  );
}

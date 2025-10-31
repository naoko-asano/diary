"use client";

import { Pagination as OriginalPagination } from "@mantine/core";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  activePage: number;
  total: number;
};

export function Pagination(props: Props) {
  const { activePage, total } = props;
  const pathName = usePathname();
  const router = useRouter();

  function handlePageChange(page: number, pathName: string) {
    if (page === activePage) return;
    router.push(`${pathName}?page=${page}`);
  }

  return (
    <OriginalPagination
      value={activePage}
      total={total}
      size="sm"
      styles={{ control: { fontSize: "var(--mantine-font-size-xs)" } }}
      onChange={(page) => {
        handlePageChange(page, pathName);
      }}
    />
  );
}

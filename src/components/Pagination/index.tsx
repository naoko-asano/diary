"use client";

import { Pagination as OriginalPagination } from "@mantine/core";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  total: number;
};

export function Pagination(props: Props) {
  const { total } = props;
  const pathName = usePathname();
  const router = useRouter();

  function handlePageChange(page: number, pathName: string) {
    router.push(`${pathName}?page=${page}`);
  }

  return (
    <OriginalPagination
      total={total}
      size="sm"
      styles={{ control: { fontSize: "20px" } }}
      onChange={(page) => {
        handlePageChange(page, pathName);
      }}
    />
  );
}

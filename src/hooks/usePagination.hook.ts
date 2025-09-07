import { useState } from "react";

export const DEFAULT_PAGE_SIZE = 10;

export interface PaginationConfig {
  initialPage?: number;
  initialPageSize?: number;
}

export const usePagination = <T>({
  initialPage = 1,
  initialPageSize = DEFAULT_PAGE_SIZE,
}: PaginationConfig = {}) => {
  const [page, setPage] = useState<number>(initialPage);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [data, setData] = useState<T[]>([]);

  const setResponseData = (newData: T[], total: number) => {
    setData(newData);
    setTotalPages(total);
  };

  return {
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    data,
    setResponseData,
  };
};

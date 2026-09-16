import { EMPTY_PAGINATION, type Paginated, type PaginationMeta } from "@/lib/types/pagination";

/**
 * Flatten `{ data: { items }, pagination }` into `{ items, pagination }`.
 *
 * Kept out of the service modules on purpose: those carry `"use server"` and
 * may export only async functions, so a shared sync helper cannot live there.
 * It is also free of `next/headers`, unlike `lib/api/axios.ts`.
 */
export function unwrapPaginated<T>(body: unknown): Paginated<T> {
  const envelope = (body ?? {}) as {
    data?: { items?: T[] };
    pagination?: Partial<PaginationMeta>;
  };

  const items = envelope.data?.items ?? [];
  const raw = envelope.pagination ?? {};
  const pageSize = raw.pageSize ?? items.length;
  const totalItems = raw.totalItems ?? items.length;

  return {
    items,
    pagination: {
      page: raw.page ?? 1,
      pageSize,
      totalItems,
      totalPages: raw.totalPages ?? (pageSize > 0 ? Math.ceil(totalItems / pageSize) : 1),
    },
  };
}

export function emptyPage<T>(): Paginated<T> {
  return { items: [], pagination: { ...EMPTY_PAGINATION } };
}

/** True for a 404 from the backend — "no such brand/category/vendor". */
export function isNotFound(error: unknown): boolean {
  return (error as { response?: { status?: number } })?.response?.status === 404;
}

/**
 * The envelope's pagination block.
 *
 * It arrives as a **sibling** of `data`, not inside it, and the count field is
 * `totalItems` — not `total`. Reading `data.pagination` or `pagination.total`
 * silently yields `undefined`, which renders as "page 1 of 1" over a catalog
 * of thousands.
 *
 * These live in `lib/types` rather than in a service because a `"use server"`
 * module may export nothing but async functions — an exported interface there
 * is a build error.
 */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

/** A list response flattened into `{ items, pagination }`. */
export interface Paginated<T> {
  items: T[];
  pagination: PaginationMeta;
}

export interface PageQuery {
  page?: number;
  pageSize?: number;
}

/** The backend rejects `page_size > 100` with a validation error. */
export const MAX_PAGE_SIZE = 100;

export const EMPTY_PAGINATION: PaginationMeta = {
  page: 1,
  pageSize: 0,
  totalItems: 0,
  totalPages: 0,
};

/** A page number from a URL — 1 for anything absent, non-numeric or < 1. */
export function parsePage(raw: string | string[] | undefined): number {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const n = Number(value);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}

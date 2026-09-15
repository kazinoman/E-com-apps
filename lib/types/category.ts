/**
 * Category shapes shared between the services and the filter UI.
 *
 * They live here rather than in a service because a `"use server"` module may
 * export nothing but async functions — a re-exported type there is a build
 * error, not a no-op.
 */
export interface SubCategory {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  subcategories: SubCategory[];
}

/** The same tree in the `{ value, label }` shape the search filters expect. */
export interface CategoryOption {
  value: string;
  label: string;
  children?: { value: string; label: string }[];
}

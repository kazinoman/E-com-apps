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

/**
 * `GET /categories/:slug`. `ancestors` is the backend's breadcrumb trail and is
 * an empty array at the top level. There are no children on this shape — the
 * two-level tree comes from the flat `GET /categories` list instead.
 */
export interface CategoryDetail {
  slug: string;
  name: string;
  parentSlug: string | null;
  ancestors: { slug: string; name: string }[];
}

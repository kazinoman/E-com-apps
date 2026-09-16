"use server";

import { category as categoryUrls, products as productUrls } from "@/lib/api/apiUrls";
import { api } from "@/lib/api/axios";
import { emptyPage, isNotFound, unwrapPaginated } from "@/lib/api/paginated";
import type { Category, CategoryDetail, CategoryOption } from "@/lib/types/category";
import type { Paginated } from "@/lib/types/pagination";
import type { ProductCardData } from "@/schemas/product";

/**
 * `GET /categories` answers one flat list — every category, each carrying its
 * `parentSlug` (null at the top level). There is no nested endpoint, so the
 * two-level tree the menus want is assembled here.
 */

interface RawCategory {
  slug: string;
  name: string;
  parentSlug: string | null;
}

async function fetchRaw(): Promise<RawCategory[]> {
  const res = await api.get(categoryUrls.list);
  return res.data?.data ?? [];
}

/** Top-level categories with their children nested underneath. */
function toTree(rows: RawCategory[]): Category[] {
  const roots = rows.filter((r) => r.parentSlug === null);
  const byParent = new Map<string, RawCategory[]>();
  for (const row of rows) {
    if (row.parentSlug === null) continue;
    const siblings = byParent.get(row.parentSlug) ?? [];
    siblings.push(row);
    byParent.set(row.parentSlug, siblings);
  }

  return roots.map((root) => ({
    id: root.slug,
    name: root.name,
    subcategories: (byParent.get(root.slug) ?? []).map((child) => ({
      id: child.slug,
      name: child.name,
    })),
  }));
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    return toTree(await fetchRaw());
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

/** The same tree in the `{ value, label }` shape the search filters expect. */
export async function fetchCategoryOptions(): Promise<CategoryOption[]> {
  const tree = await fetchCategories();
  return tree.map((c) => ({
    value: c.id,
    label: c.name,
    children: c.subcategories.map((s) => ({ value: s.id, label: s.name })),
  }));
}

/**
 * One category by slug. `ancestors` is the backend's own breadcrumb trail and
 * is empty for a top-level category. Answers null on 404 (`CATEGORY_NOT_FOUND`)
 * so the route can render a real 404 instead of an empty grid.
 */
export async function fetchCategory(slug: string): Promise<CategoryDetail | null> {
  try {
    const res = await api.get(categoryUrls.detail(slug));
    return res.data?.data ?? null;
  } catch (error) {
    if (isNotFound(error)) return null;
    console.error("Error fetching category:", error);
    return null;
  }
}

/**
 * The products in a category.
 *
 * There is no `/categories/:slug/products` — the catalog answers this through
 * `GET /products?category=<slug>`, the same endpoint the search page uses.
 * `sort` must be one of the backend's five enum values; anything else is a
 * 400, so an unrecognised value is dropped rather than forwarded.
 */
export async function fetchCategoryProducts(
  slug: string,
  page = 1,
  pageSize = 24,
  sort?: string,
): Promise<Paginated<ProductCardData>> {
  try {
    const res = await api.get(productUrls.list, {
      params: { category: slug, page, pageSize, sort },
    });
    return unwrapPaginated<ProductCardData>(res.data);
  } catch (error) {
    console.error("Error fetching category products:", error);
    return emptyPage<ProductCardData>();
  }
}

/**
 * The tree node for a slug, whether it names a parent or a child, plus the
 * parent it hangs off. Built from the one flat `/categories` payload that
 * `fetchCategories` already fetches — the detail endpoint carries no children.
 */
export async function fetchCategoryContext(
  slug: string,
): Promise<{ parent: Category | null; node: Category | null }> {
  const tree = await fetchCategories();

  const asRoot = tree.find((c) => c.id === slug);
  if (asRoot) return { parent: null, node: asRoot };

  const parent = tree.find((c) => c.subcategories.some((s) => s.id === slug)) ?? null;
  return { parent, node: null };
}

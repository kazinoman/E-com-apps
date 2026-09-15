"use server";

import { category as categoryUrls } from "@/lib/api/apiUrls";
import { api } from "@/lib/api/axios";
import type { Category, CategoryOption } from "@/lib/types/category";

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

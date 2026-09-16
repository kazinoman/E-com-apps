"use client";

import Image from "next/image";
import Link from "next/link";
import { X, Trash2 } from "lucide-react";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/contexts/CompareContext";
import type { CompareItem } from "@/lib/types/compare";

/**
 * The comparison table.
 *
 * The backend has already widened every product's spec map to the full
 * `specKeys` union, so this renders a rectangle without reconciling anything:
 * one column per product, one row per spec key, and a missing value is null,
 * which renders as an em dash rather than as invented text.
 *
 * Nothing here is derived or defaulted. A null price, a null MOQ and a null
 * weight all render as nothing — a product that has stopped being sellable is
 * shown with that fact, not hidden and not given a placeholder.
 */

/** Whole Taka. The backend is the only rounding boundary; never re-derive. */
const taka = (value: number | null) => (value === null ? null : `৳${value.toLocaleString()}`);

const EMPTY_CELL = <span className="text-[#C4C8D2] dark:text-gray-600">—</span>;

function cell(value: string | null) {
  return value === null || value === "" ? EMPTY_CELL : value;
}

function ProductColumn({ item, onRemove }: { item: CompareItem; onRemove: () => void }) {
  return (
    <div className="flex flex-col items-center text-center gap-3">
      <div className="relative w-full aspect-square max-w-[160px] bg-[#F6F6F9] dark:bg-zinc-800 rounded-xl overflow-hidden">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            sizes="160px"
            className="object-contain p-3"
          />
        ) : null}
        <button
          onClick={onRemove}
          aria-label={`Remove ${item.title} from comparison`}
          className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-white/90 dark:bg-gray-900/90 text-[#8C93A3] hover:text-[#E94B4B] flex items-center justify-center shadow-sm transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <Link
        href={`/products/${item.productId}`}
        className="text-[13px] font-medium text-[#333333] dark:text-gray-100 line-clamp-3 hover:text-[#4A85F6] transition-colors"
      >
        {item.title}
      </Link>

      {/* An unavailable product stays in the table — it is the honest answer
          to "how do these compare", and hiding the row would make a price
          that is missing for a reason look like a glitch. */}
      {item.available ? null : (
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FDECEC] dark:bg-red-950 text-[#E94B4B]">
          Unavailable
        </span>
      )}
    </div>
  );
}

export function ComparePage() {
  const { items, specKeys, count, limit, isPending, removeFromCompare, clearCompare } = useCompare();

  const columns = `minmax(140px, 200px) repeat(${Math.max(items.length, 1)}, minmax(160px, 1fr))`;

  const Row = ({ label, values }: { label: string; values: (string | null)[] }) => (
    <div
      className="grid items-start gap-4 px-4 py-3 border-t border-gray-100 dark:border-gray-800 text-[13px]"
      style={{ gridTemplateColumns: columns }}
    >
      <div className="font-bold text-[#8C93A3]">{label}</div>
      {values.map((value, i) => (
        <div key={i} className="text-[#333333] dark:text-gray-200 break-words">
          {cell(value)}
        </div>
      ))}
    </div>
  );

  return (
    <main className="min-h-screen py-12 bg-white dark:bg-gray-950 transition-colors">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl font-bold text-[#1C244B] dark:text-white">
            Compare{" "}
            <span className="text-[#6B7280] dark:text-gray-400 font-normal text-xl">
              ({count} of {limit})
            </span>
          </h1>

          {items.length > 0 ? (
            <button
              onClick={() => clearCompare()}
              disabled={isPending}
              className="flex items-center gap-2 text-[13px] font-bold text-[#8C93A3] hover:text-[#E94B4B] disabled:opacity-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear all
            </button>
          ) : null}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm text-center space-y-6 transition-colors">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Nothing to compare yet
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
              Add up to {limit} products from the catalog and their specs will line up side by side
              here.
            </p>
            <Link href="/">
              <Button className="text-white px-8 h-12 text-base font-medium">START SHOPPING</Button>
            </Link>
          </div>
        ) : (
          <>
            {count >= limit ? (
              <p className="mb-4 text-[13px] font-medium text-[#8C93A3]">
                You are comparing the maximum of {limit} products. Remove one to add another.
              </p>
            ) : null}

            <div className="overflow-x-auto rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
              <div className="min-w-[640px]">
                {/* Product header row */}
                <div
                  className="grid gap-4 px-4 py-6"
                  style={{ gridTemplateColumns: columns }}
                >
                  <div />
                  {items.map((item) => (
                    <ProductColumn
                      key={item.id}
                      item={item}
                      onRemove={() => removeFromCompare(item.productId)}
                    />
                  ))}
                </div>

                <Row label="Price" values={items.map((i) => taka(i.priceBdt))} />
                <Row
                  label="Minimum order"
                  values={items.map((i) => (i.moq === null ? null : `${i.moq} pcs`))}
                />
                <Row
                  label="Weight"
                  values={items.map((i) => (i.weightKg === null ? null : `${i.weightKg} kg`))}
                />
                <Row
                  label="Sold"
                  values={items.map((i) =>
                    i.salesCount === null ? null : i.salesCount.toLocaleString(),
                  )}
                />
                <Row
                  label="Availability"
                  values={items.map((i) => (i.available ? "Available" : "Unavailable"))}
                />

                {/* Spec keys are opaque upstream strings, printed as they came. */}
                {specKeys.map((key) => (
                  <Row key={key} label={key} values={items.map((i) => i.attributes[key] ?? null)} />
                ))}
              </div>
            </div>
          </>
        )}
      </Container>
    </main>
  );
}

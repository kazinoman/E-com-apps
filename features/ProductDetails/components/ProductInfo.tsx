"use client";

import { useMemo, useState } from "react";
import { tierPriceFor, type Product, type Sku } from "@/schemas/product";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { CompareButton } from "@/components/common/CompareButton";
import { Star, Minus, Plus, Heart } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { vendorScore } from "@/lib/types/vendor";

interface ProductInfoProps {
  product: Product;
  selectedSku?: Sku;
  onSkuSelect?: (sku: Sku) => void;
}

const taka = (n: number) => `৳${n.toLocaleString()}`;

export const ProductInfo = ({ product, selectedSku: externalSku, onSkuSelect }: ProductInfoProps) => {
  const { addToCart, isPending } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  /*
   * Variants are chosen by axis, not by SKU.
   *
   * A product carries up to ~98 SKUs — one per combination — so rendering a
   * button per SKU would be a wall. `variantAxes` is the same data factored
   * into the axes a shopper actually picks (Colour, Size…); the SKU is then
   * whichever one matches every choice.
   */
  const [choice, setChoice] = useState<Record<string, string>>({});
  const [internalSku, setInternalSku] = useState<Sku | undefined>(undefined);
  const selectedSku = externalSku ?? internalSku;

  const resolveSku = (next: Record<string, string>): Sku | undefined => {
    const axes = product.variantAxes.map((a) => a.axis);
    if (axes.some((axis) => !next[axis])) return undefined;
    return product.skus.find((sku) => axes.every((axis) => sku.attributes?.[axis] === next[axis]));
  };

  const pick = (axis: string, value: string) => {
    const next = { ...choice, [axis]: value };
    setChoice(next);
    const sku = resolveSku(next);
    if (!sku) return;
    if (onSkuSelect) onSkuSelect(sku);
    else setInternalSku(sku);
  };

  /** MOQ is the product's own; 1 when it has none. Never a hardcoded number. */
  const moq = product.moq ?? 1;
  const [quantity, setQuantity] = useState(moq);

  const increaseQuantity = () => setQuantity((q) => q + 1);
  const decreaseQuantity = () => setQuantity((q) => (q > moq ? q - 1 : moq));

  /*
   * Quantity breaks apply to the product; a chosen SKU overrides the base
   * price. Nothing here recomputes a total the server will own — this is a
   * quote, and the cart re-prices every line from the catalog on add.
   */
  const unitPrice = useMemo(() => {
    if (selectedSku) return selectedSku.price.bdt;
    return tierPriceFor(product, quantity).bdt;
  }, [product, selectedSku, quantity]);

  const nextTier = useMemo(
    () =>
      product.priceTiers
        .filter((t) => t.minQuantity > quantity)
        .sort((a, b) => a.minQuantity - b.minQuantity)[0] ?? null,
    [product.priceTiers, quantity],
  );

  const outOfStock = selectedSku?.stock === 0;
  const needsChoice = product.variantAxes.length > 0 && !selectedSku;
  const isWished = isInWishlist(product.id);

  // The vendor's name is the vendor id for part of the catalog (an upstream
  // backfill that never completed). An opaque token is not a seller name.
  const vendorName =
    product.vendor && product.vendor.name && product.vendor.name !== product.vendor.id
      ? product.vendor.name
      : null;
  // 0 upstream means "unrated", not "rated zero" — see vendorScore.
  const score = vendorScore(product.vendor?.score);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-gray-100 leading-tight">
          {product.title}
        </h1>
        {(product.ratingAvg !== null || product.salesCount) && (
          <div className="flex items-center gap-4 mt-3 text-sm text-slate-500 dark:text-gray-400">
            {product.ratingAvg !== null && (
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                {product.ratingAvg.toFixed(1)}
                {product.ratingCount ? ` (${product.ratingCount})` : ""}
              </span>
            )}
            {product.salesCount ? <span>{product.salesCount.toLocaleString()} sold</span> : null}
          </div>
        )}
      </div>

      {/* Variant axes */}
      {product.variantAxes.map((axis) => (
        <div key={axis.axis} className="space-y-3">
          <p className="text-sm font-medium text-slate-500 dark:text-gray-400">
            {axis.axis}
            {choice[axis.axis] ? (
              <span className="text-slate-800 dark:text-gray-200"> : {choice[axis.axis]}</span>
            ) : null}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {axis.values.map((v) => {
              const active = choice[axis.axis] === v.value;
              return (
                <button
                  key={v.value}
                  onClick={() => pick(axis.axis, v.value)}
                  title={v.value}
                  className={cn(
                    "flex items-center gap-2 p-1.5 rounded-xl border-2 transition-all duration-200 bg-white dark:bg-gray-800",
                    active
                      ? "border-slate-800 dark:border-gray-200 ring-1 ring-slate-800 dark:ring-gray-200"
                      : "border-slate-200 dark:border-gray-700 hover:border-slate-300 dark:hover:border-gray-600",
                  )}
                >
                  {v.imageUrl && (
                    <span className="relative w-9 h-9 rounded-lg overflow-hidden bg-slate-50 dark:bg-gray-900 block">
                      <Image src={v.imageUrl} alt={v.value} fill className="object-cover" />
                    </span>
                  )}
                  <span className="text-xs font-medium text-slate-700 dark:text-gray-200 px-1 max-w-[9rem] truncate">
                    {v.value}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <hr className="border-slate-200 dark:border-gray-800" />

      {/* Seller */}
      {(vendorName || score !== null) && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Seller</p>
          <div className="flex items-center gap-3 text-sm">
            {vendorName && (
              <span className="font-semibold text-slate-800 dark:text-gray-200">{vendorName}</span>
            )}
            {score !== null && (
              <span className="flex items-center gap-1 text-slate-500 dark:text-gray-400">
                <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                {score.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Pricing & Quantity */}
      <div className="grid grid-cols-[120px_1fr] items-center gap-y-4">
        <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Price</p>
        <p className="font-semibold text-slate-800 dark:text-gray-200">
          <span className="text-xl">{taka(unitPrice)}</span>
          <span className="text-sm text-slate-400 dark:text-gray-500 font-normal"> /pcs</span>
        </p>

        <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Quantity</p>
        <div className="flex flex-col gap-1">
          <div className="flex items-center rounded-lg bg-slate-50 dark:bg-gray-800 p-1 w-fit">
            <button
              onClick={decreaseQuantity}
              disabled={quantity <= moq}
              aria-label="Decrease quantity"
              className="w-8 h-8 flex items-center justify-center text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center font-medium text-slate-800 dark:text-gray-200">
              {quantity}
            </span>
            <button
              onClick={increaseQuantity}
              aria-label="Increase quantity"
              className="w-8 h-8 flex items-center justify-center text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {product.moq ? (
            <p className="text-[11px] text-slate-400 dark:text-gray-500 font-medium">
              Minimum order quantity is {product.moq}
            </p>
          ) : null}
          {nextTier && (
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              Buy {nextTier.minQuantity} or more for {taka(nextTier.price.bdt)} each
            </p>
          )}
        </div>

        <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Total</p>
        <p className="text-2xl font-bold text-slate-800 dark:text-gray-100">
          {taka(unitPrice * quantity)}
        </p>
      </div>

      {/*
        Delivery is quoted at checkout from the merchant's own shipping
        settings. The per-kg rate card and the 70/30 advance split that used to
        sit here were copied from skybuybd and match nothing this backend
        charges — see HYDRA 8a4109f5, the open shipping/pricing decision.
      */}
      {product.weightKg ? (
        <p className="text-sm text-slate-500 dark:text-gray-400">
          Approximate weight {product.weightKg} kg per piece. Delivery is calculated at checkout.
        </p>
      ) : null}

      {/* Actions */}
      <div className="flex items-center gap-4 mt-2">
        <Button
          onClick={() => addToCart(product.id, quantity, selectedSku?.skuId ?? null)}
          disabled={isPending || needsChoice || outOfStock}
          className="flex-1 bg-slate-800 hover:bg-slate-700 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-gray-200 h-12 rounded-lg font-medium text-base"
        >
          {outOfStock ? "Out of stock" : needsChoice ? "Choose an option" : "Add to cart"}
        </Button>
        <CompareButton
          productId={product.id}
          withLabel
          className="h-12 px-4 rounded-lg border border-slate-300 dark:border-gray-700"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => toggleWishlist(product.id)}
          aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
          className="w-12 h-12 rounded-lg border-slate-300 dark:border-gray-700 text-slate-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <Heart className={cn("w-5 h-5", isWished && "fill-[#FF4D4F] text-[#FF4D4F]")} />
        </Button>
      </div>
    </div>
  );
};

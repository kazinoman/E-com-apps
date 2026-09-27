"use client";

import { useMemo, useState } from "react";
import { tierPriceFor, type Product, type Sku } from "@/schemas/product";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { CompareButton } from "@/components/common/CompareButton";
import { Star, Minus, Plus, Heart, Plane, Scale, CreditCard, Info, Ship, ExternalLink } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { vendorScore } from "@/lib/types/vendor";
import { toast } from "sonner";
import { FreightCategoryModal } from "./FreightCategoryModal";

interface ProductInfoProps {
  product: Product;
  selectedSku?: Sku;
  onSkuSelect?: (sku: Sku) => void;
  /** Merchant's current advance percentage — fetched server-side, never hardcoded. */
  advancePct: number;
}

const taka = (n?: number) => `৳${(n ?? 0).toLocaleString()}`;

export const ProductInfo = ({ product, selectedSku: externalSku, onSkuSelect, advancePct }: ProductInfoProps) => {
  const { addToCart, isPending, cart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isFreightModalOpen, setIsFreightModalOpen] = useState(false);

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

  const handleAddToCart = () => {
    const minQty = Math.max(3, moq);
    const existingItem = cart.find(
      (item) => item.productId === String(product.id) && item.skuExternalId === (selectedSku?.skuId ?? null)
    );
    const existingQty = existingItem ? existingItem.quantity : 0;
    const newTotal = existingQty + quantity;

    if (newTotal < minQty) {
      toast.info(`Please select at least ${minQty} items to add to cart. Thank you!`, {
        className: "!bg-blue-50 dark:!bg-blue-950 !text-blue-700 dark:!text-blue-300 !border-blue-200 dark:!border-blue-800"
      });
      return;
    }
    addToCart(product.id, quantity, selectedSku?.skuId ?? null);
  };

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
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={quantity === 0 ? '' : quantity}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '') {
                  setQuantity(0);
                  return;
                }
                const num = parseInt(val, 10);
                if (!isNaN(num)) {
                  setQuantity(num);
                }
              }}
              onBlur={() => {
                if (quantity < moq) setQuantity(moq);
              }}
              className="w-12 text-center font-medium text-slate-800 dark:text-gray-200 bg-white dark:bg-gray-900 border border-slate-300 dark:border-gray-600 rounded-md mx-1 py-1 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
            />
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

      {/* Actions */}
      <div className="flex items-center gap-4 mt-2">
        <Button
          onClick={handleAddToCart}
          disabled={isPending || needsChoice || outOfStock}
          className="flex-1 bg-slate-800 hover:bg-slate-700 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-gray-200 h-12 rounded-lg font-medium text-base"
        >
          {outOfStock ? "Out of stock" : needsChoice ? "Choose an option" : "Add to cart"}
        </Button>
        {/* <CompareButton
          productId={product.id}
          withLabel
          className="h-12 px-4 rounded-lg border border-slate-300 dark:border-gray-700"
        /> */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => toggleWishlist(product.id)}
          aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
          className={cn(
            "w-12 h-12 rounded-lg transition-colors hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20",
            isWished
              ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/30 text-red-500"
              : "border-slate-300 dark:border-gray-700 text-slate-500 dark:text-gray-400"
          )}
        >
          <Heart className={cn("w-5 h-5", isWished && "fill-[#FF4D4F] text-[#FF4D4F]")} />
        </Button>
      </div>

      {/* Shipping & Payment Info Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/50 dark:from-gray-900 dark:via-gray-800/80 dark:to-gray-900 rounded-2xl p-5 border border-indigo-100/60 dark:border-gray-700/60 shadow-sm transition-all hover:shadow-md mt-2">
        {/* Subtle background pattern/glow */}
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 dark:bg-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800 dark:text-gray-100 text-sm flex items-center gap-2">
            <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/50 rounded-md text-indigo-600 dark:text-indigo-400">
              <Plane className="w-4 h-4" />
            </div>
            Shipping & Payment Details
          </h3>
          <button 
            onClick={() => setIsFreightModalOpen(true)}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1 bg-white/50 dark:bg-gray-800/50 px-2.5 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-900/50 hover:bg-white dark:hover:bg-gray-800 transition-colors z-10"
          >
            Details <ExternalLink className="w-3 h-3" />
          </button>
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center gap-3 text-sm group">
            <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-slate-100 dark:border-gray-700 flex items-center justify-center text-slate-400 group-hover:text-indigo-500 group-hover:border-indigo-200 transition-colors shrink-0">
              <Plane className="w-4 h-4" />
            </div>
            <p className="text-slate-600 dark:text-gray-300">
              Air freight: <span className="font-semibold text-slate-800 dark:text-gray-100">৳770/kg</span>
              <span className="text-xs text-slate-500 ml-1">(customs included)</span>
            </p>
          </div>

          <div className="flex items-center gap-3 text-sm group">
            <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-slate-100 dark:border-gray-700 flex items-center justify-center text-slate-400 group-hover:text-orange-500 group-hover:border-orange-200 transition-colors shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <p className="text-slate-600 dark:text-gray-300">
              Approximate weight: <span className="font-semibold text-slate-800 dark:text-gray-100">0.49 kg</span> <span className="text-xs text-slate-500">per piece.</span>
            </p>
          </div>
          
          <div className="flex items-center gap-3 text-sm group">
            <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-sm border border-slate-100 dark:border-gray-700 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 group-hover:border-emerald-200 transition-colors shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
            <p className="text-slate-600 dark:text-gray-300">
              <span className="font-semibold text-slate-800 dark:text-gray-100">Pay 70% now</span>, rest on delivery
            </p>
          </div>
        </div>

        <div className="mt-4 bg-indigo-50/80 dark:bg-indigo-950/30 rounded-xl p-3 border border-indigo-100/50 dark:border-indigo-900/30 flex gap-3 items-start">
          <Info className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
          <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed">
            Freight is billed on delivery based on actual weight. Customs is already included in the per-kg rate.
          </p>
        </div>
      </div>

      <FreightCategoryModal 
        isOpen={isFreightModalOpen} 
        onClose={() => setIsFreightModalOpen(false)} 
      />
    </div>
  );
};

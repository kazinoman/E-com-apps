"use client";

import { useMemo, useState } from "react";
import { tierPriceFor, type Product, type Sku } from "@/schemas/product";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { CompareButton } from "@/components/common/CompareButton";
import { Star, Minus, Plus, Heart, Plane, Scale, CreditCard, Info, ExternalLink, MessageCircle, Link as LinkIcon, Store, Ship, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { vendorScore } from "@/lib/types/vendor";
import { toast } from "sonner";
import { FreightCategoryModal } from "./FreightCategoryModal";
import { useAuth } from "@/contexts/UserInfoContext";
import { useRouter } from "next/navigation";
import { MdFacebook } from "react-icons/md";
import { RiWhatsappFill } from "react-icons/ri";
import { MdWhatsapp } from "react-icons/md";
import { MdCopyAll } from "react-icons/md";

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
  const { user } = useAuth();
  const router = useRouter();
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
  const [shippingMethod, setShippingMethod] = useState<'air' | 'sea'>('air');
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

  const handleAddToCart = async () => {
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
      return false;
    }
    await addToCart(product.id, quantity, selectedSku?.skuId ?? null);
    return true;
  };

  const handleBuyNow = async () => {
    const success = await handleAddToCart();
    if (success) {
      router.push('/checkout');
    }
  };

  const handleWishlistClick = () => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(`/products/${product.id}`)}`);
      return;
    }
    toggleWishlist(product.id);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const handleShareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(window.location.href)}`, '_blank');
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
        <h1 className="text-lg md:text-xl lg:text-3xl font-bold text-slate-800 dark:text-gray-100 leading-tight">
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
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-800 dark:text-gray-200">{axis.axis}</span>
            {choice[axis.axis] && (
              <>
                <span className="text-slate-300 dark:text-gray-600">|</span>
                <span className="text-sm font-medium text-primary">{choice[axis.axis]}</span>
              </>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {axis.values.map((v) => {
              const active = choice[axis.axis] === v.value;
              const hasImage = !!v.imageUrl;
              return (
                <button
                  key={v.value}
                  onClick={() => pick(axis.axis, v.value)}
                  title={v.value}
                  className={cn(
                    "relative overflow-hidden transition-all duration-200",
                    hasImage
                      ? cn(
                        "w-14 h-14 md:w-16 md:h-16 rounded-xl",
                        active
                          ? "ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-900"
                          : "ring-1 ring-slate-200 dark:ring-gray-700 hover:ring-slate-400 dark:hover:ring-gray-500"
                      )
                      : cn(
                        "px-4 py-2 rounded-xl border text-sm md:text-base font-medium",
                        active
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-slate-200 dark:border-gray-700 text-slate-700 dark:text-gray-300 hover:border-slate-300 dark:hover:border-gray-600 bg-card"
                      )
                  )}
                >
                  {hasImage && v.imageUrl ? (
                    <Image src={v.imageUrl as string} alt={v.value} fill className="object-cover" />
                  ) : (
                    <span className="max-w-[12rem] truncate block">{v.value}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <hr className="border-slate-200 dark:border-gray-800" />

      {/* Seller */}
      {(vendorName || score !== null) && (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center text-slate-500 dark:text-gray-400 shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-gray-400 mb-0.5">Sold by</p>
            <div className="flex items-center gap-2">
              {vendorName && <span className="font-semibold text-slate-900 dark:text-white">{vendorName}</span>}
              {score !== null && (
                <div className="flex items-center gap-1 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 px-1.5 py-0.5 rounded text-xs font-bold">
                  <Star className="w-3 h-3 fill-current" />
                  {score.toFixed(1)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pricing & Quantity Block */}
      <div className="flex flex-col gap-6">

        {/* Price and Share */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-gray-400 mb-1">Price</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">{taka(unitPrice)}</span>
              <span className="text-sm font-medium text-slate-500 dark:text-gray-400">/ piece</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button onClick={handleShareFacebook} aria-label="Share on Facebook" className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30 dark:hover:text-blue-400 transition-colors">
              <MdFacebook className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button onClick={handleShareWhatsApp} aria-label="Share on WhatsApp" className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/30 dark:hover:text-green-400 transition-colors">
              <MdWhatsapp className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button onClick={handleCopyLink} aria-label="Copy link" className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-gray-700 hover:text-slate-900 dark:hover:text-white transition-colors">
              <MdCopyAll className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>

        {/* Quantity & Total Row */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-5 bg-slate-50 dark:bg-gray-800/40 p-4 md:p-5 rounded-2xl border border-slate-100 dark:border-gray-800">

          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-700 dark:text-gray-300 mb-2">Quantity</p>
            <div className="flex items-center w-fit bg-white dark:bg-gray-900 rounded-xl border border-slate-200 dark:border-gray-700 overflow-hidden shadow-sm">
              <button
                onClick={decreaseQuantity}
                disabled={quantity <= moq}
                aria-label="Decrease quantity"
                className="w-11 h-11 flex items-center justify-center text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-40"
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
                className="w-16 h-11 text-center font-bold text-lg text-slate-900 dark:text-white bg-transparent border-x border-slate-200 dark:border-gray-700 focus:outline-none focus:ring-0"
              />
              <button
                onClick={increaseQuantity}
                aria-label="Increase quantity"
                className="w-11 h-11 flex items-center justify-center text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
              {product.moq ? (
                <p className="text-xs font-medium text-slate-500 dark:text-gray-400">
                  Min. order: {product.moq} pieces
                </p>
              ) : null}
              {!needsChoice && (() => {
                const stock = selectedSku ? (selectedSku.stock ?? 0) : product.skus.reduce((acc, sku) => acc + (sku.stock ?? 0), 0);
                return stock > 0 ? (
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    Available: {stock.toLocaleString()} pieces
                  </p>
                ) : (
                  <p className="text-xs font-medium text-red-500">Out of stock</p>
                );
              })()}
            </div>
          </div>

          <div className="sm:text-right border-t border-slate-200 dark:border-gray-700 sm:border-t-0 pt-4 sm:pt-0">
            <p className="text-sm font-medium text-slate-500 dark:text-gray-400 mb-1">Total Price</p>
            <p className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">{taka(unitPrice * quantity)}</p>
          </div>

        </div>

        {nextTier && (
          <div className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm font-medium px-4 py-3 rounded-xl flex items-center gap-2 border border-emerald-100 dark:border-emerald-500/20">
            <Info className="w-4 h-4 shrink-0" />
            Buy {nextTier.minQuantity} or more for <span className="font-bold">{taka(nextTier.price.bdt)}</span> each
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        <Button
          onClick={handleAddToCart}
          disabled={isPending || needsChoice || outOfStock}
          className="flex-2 bg-black hover:bg-zinc-800 text-white h-11 md:h-14 rounded-lg md:rounded-xl font-bold text-sm md:text-lg shadow-sm flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
          {outOfStock ? "Out of stock" : needsChoice ? "Choose an option" : "Add to cart"}
        </Button>
        <Button
          onClick={handleBuyNow}
          variant="outline"
          disabled={isPending || needsChoice || outOfStock}
          className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 h-11 md:h-14 rounded-lg md:rounded-xl font-semibold text-xs md:text-base"
        >
          {outOfStock ? "Out of stock" : needsChoice ? "Choose an option" : "Buy Now"}
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={handleWishlistClick}
          aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
          className={cn(
            "w-11 h-11 md:w-14 md:h-14 rounded-lg md:rounded-xl transition-colors hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0",
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
              {shippingMethod === 'air' ? <Plane className="w-4 h-4" /> : <Ship className="w-4 h-4" />}
            </div>
            Shipping & Payment Details
          </h3>
          {shippingMethod === 'air' && (
            <button
              onClick={() => setIsFreightModalOpen(true)}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center gap-1 bg-card px-2.5 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-900/50 hover:bg-white dark:hover:bg-gray-800 transition-colors z-10"
            >
              Details <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Shipping Method Tabs */}
        <div className="flex bg-slate-100/80 dark:bg-gray-800/80 p-1 rounded-xl mb-4 relative z-10">
          <button
            onClick={() => setShippingMethod('air')}
            className={cn(
              "group flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all duration-300",
              shippingMethod === 'air'
                ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-gray-700/50"
            )}
          >
            <Plane className={cn("w-4 h-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 hover:animate-pulse", shippingMethod === 'air' && "text-indigo-500")} />
            By Air
          </button>
          <button
            onClick={() => setShippingMethod('sea')}
            className={cn(
              "group flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all duration-300",
              shippingMethod === 'sea'
                ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-gray-700/50"
            )}
          >
            <Ship className={cn("w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-rotate-6 hover:animate-pulse", shippingMethod === 'sea' && "text-blue-500")} />
            By Sea
          </button>
        </div>

        <div className="flex flex-col min-h-[140px] transition-all">
          {shippingMethod === 'air' ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-3 text-sm group">
                <div className="w-8 h-8 rounded-full bg-card shadow-sm border border-slate-100 dark:border-gray-700 flex items-center justify-center text-slate-400 group-hover:text-indigo-500 group-hover:border-indigo-200 transition-colors shrink-0">
                  <Plane className="w-4 h-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
                <p className="text-slate-600 dark:text-gray-300">
                  Air freight: <span className="font-semibold text-slate-800 dark:text-gray-100">৳770/kg</span>
                  <span className="text-xs text-slate-500 ml-1">(customs included)</span>
                </p>
              </div>

              <div className="flex items-center gap-3 text-sm group mt-3">
                <div className="w-8 h-8 rounded-full bg-card shadow-sm border border-slate-100 dark:border-gray-700 flex items-center justify-center text-slate-400 group-hover:text-orange-500 group-hover:border-orange-200 transition-colors shrink-0">
                  <Scale className="w-4 h-4" />
                </div>
                <p className="text-slate-600 dark:text-gray-300">
                  Approximate weight: <span className="font-semibold text-slate-800 dark:text-gray-100">0.49 kg</span> <span className="text-xs text-slate-500">per piece.</span>
                </p>
              </div>

              <div className="flex items-center gap-3 text-sm group mt-3">
                <div className="w-8 h-8 rounded-full bg-card shadow-sm border border-slate-100 dark:border-gray-700 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 group-hover:border-emerald-200 transition-colors shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <p className="text-slate-600 dark:text-gray-300">
                  <span className="font-semibold text-slate-800 dark:text-gray-100">Pay 70% now</span>, rest on delivery
                </p>
              </div>
              
              <div className="mt-4 bg-indigo-50/80 dark:bg-indigo-950/30 rounded-xl p-3 border border-indigo-100/50 dark:border-indigo-900/30 flex gap-3 items-start">
                <Info className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed">
                  Freight is billed on delivery based on actual weight. Customs is already included in the per-kg rate.
                </p>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-3 text-sm group">
                <div className="w-8 h-8 rounded-full bg-card shadow-sm border border-slate-100 dark:border-gray-700 flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:border-blue-200 transition-colors shrink-0">
                  <Ship className="w-4 h-4 group-hover:-rotate-12 transition-transform duration-300" />
                </div>
                <p className="text-slate-600 dark:text-gray-300">
                  শিপিং চার্জ <span className="font-semibold text-slate-800 dark:text-gray-100">৳120/Kg</span> থেকে শুরু
                </p>
              </div>
              
              <div className="mt-4 bg-blue-50/80 dark:bg-blue-950/30 rounded-xl p-4 border border-blue-100/50 dark:border-blue-900/30 flex gap-3 items-start">
                <Info className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                  অর্ডার প্লেস করার পর আমাদের একজন প্রতিনিধি আপনার সঙ্গে যোগাযোগ করবেন এবং উক্ত প্রোডাক্টটি সি শিপমেন্টের মাধ্যমে আনা যাবে কি না এবং শিপিং চার্জ কত হবে, সে বিষয়ে নিশ্চিত করবেন। নিশ্চিত হওয়ার আগে কোনো ধরনের পেমেন্ট করা থেকে বিরত থাকুন।
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <FreightCategoryModal
        isOpen={isFreightModalOpen}
        onClose={() => setIsFreightModalOpen(false)}
      />
    </div>
  );
};

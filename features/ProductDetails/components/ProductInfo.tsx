"use client";

import { useState } from "react";
import { Product, ProductColor, Sku } from "@/schemas/product";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import {
  Star,
  StarHalf,
  BadgeCheck,
  Minus,
  Plus,
  Heart,
  X
} from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductInfoProps {
  product: Product;
  selectedSku?: Sku;
  onSkuSelect?: (sku: Sku) => void;
}

export const ProductInfo = ({ product, selectedSku: externalSku, onSkuSelect }: ProductInfoProps) => {
  const { addToCart } = useCart();
  const [internalSku, setInternalSku] = useState<Sku | undefined>(product.skus?.[0]);
  const selectedSku = externalSku !== undefined ? externalSku : internalSku;

  const handleSkuSelect = (sku: Sku) => {
    if (onSkuSelect) onSkuSelect(sku);
    else setInternalSku(sku);
  };
  const [quantity, setQuantity] = useState(3);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 3 ? prev - 1 : 3));

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-4 h-4 fill-orange-400 text-orange-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<StarHalf key={i} className="w-4 h-4 fill-orange-400 text-orange-400" />);
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-slate-300" />);
      }
    }
    return stars;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <p className="text-sm text-slate-400 font-medium mb-1">{product.brand}</p>
        <h1 className="text-3xl font-bold text-slate-800 leading-tight">
          {product.title}
        </h1>
      </div>

      {/* Ratings & Social */}
      <div className="flex items-center gap-6 text-sm text-slate-500">
        {/* <div className="flex items-center gap-2">
          <div className="flex">{renderStars(product.rating)}</div>
          <span className="font-semibold text-slate-700">{product.rating}</span>
          <span>·</span>
          <span>{product.reviewsCount.toLocaleString()} reviews</span>
        </div> */}
        <div className="flex items-center gap-3">
          <span className="text-slate-400">Share :</span>


          <button className="text-slate-600 hover:text-slate-900 transition-colors">
            <FaFacebook size={20} />
          </button>
          <button className="text-slate-600 hover:text-slate-900 transition-colors">
            <FaInstagram size={20} />
          </button>
          <button className="text-slate-600 hover:text-slate-900 transition-colors">
            <FaTwitter size={20} />
          </button>
        </div>
      </div>

      {/* SKUs / Colors */}
      {product.skus && product.skus.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-500">Variants</p>
          <div className="flex flex-wrap items-center gap-3">
            {product.skus.map((sku) => (
              <button
                key={sku.id}
                onClick={() => handleSkuSelect(sku)}
                className={cn(
                  "flex items-center gap-3 p-1.5 pr-4 rounded-xl border-2 transition-all duration-200 bg-white",
                  selectedSku?.id === sku.id
                    ? "border-slate-800 ring-1 ring-slate-800"
                    : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
                )}
              >
                <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                  <Image
                    src={sku.image || product.image}
                    alt={sku.color}
                    fill
                    className="object-contain p-1 mix-blend-multiply"
                  />
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="text-sm font-semibold text-slate-800 leading-none">{sku.color}</span>
                  <span className="text-[11px] font-medium text-slate-400 mt-1">{sku.sku}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Divider */}
      <hr className="border-slate-200" />

      {/* Seller */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-slate-500">Seller</p>
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-100">
            <Image
              src={product?.seller?.logo}
              alt={product?.seller?.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-slate-800">{product?.seller?.name}</span>
              {product?.seller?.verified && (
                <BadgeCheck className="w-4 h-4 text-blue-500" />
              )}
            </div>
            <div className="flex items-center gap-1 text-sm text-slate-500">
              <Star className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
              <span>{product?.seller?.rating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing & Quantity */}
      <div className="grid grid-cols-[120px_1fr] items-center gap-y-4">
        <p className="text-sm font-medium text-slate-500">Price</p>
        <p className="font-semibold text-slate-800">
          <span className="text-xl">${(selectedSku?.price ?? product.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span className="text-sm text-slate-400 font-normal"> /pcs</span>
        </p>

        <p className="text-sm font-medium text-slate-500">Quantity</p>
        <div className="flex flex-col gap-1">
          <div className="flex items-center">
            <div className="flex items-center rounded-lg bg-slate-50 p-1">
              <button
                onClick={decreaseQuantity}
                disabled={quantity <= 3}
                className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-medium text-slate-800">{quantity}</span>
              <button
                onClick={increaseQuantity}
                className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Minimum order quantity is 3</p>
        </div>

        <p className="text-sm font-medium text-slate-500">Total Price</p>
        <p className="text-2xl font-bold text-slate-800">
          ${((selectedSku?.price ?? product.price) * quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>

      {/* Shipping / Price Details */}
      <div className="bg-slate-50/80 p-5 rounded-xl space-y-3 text-sm border border-slate-100">
        <div>
          <span className="font-semibold text-slate-800">Product Quantity: </span>
          <span className="text-slate-800">{quantity}</span>
        </div>
        <div>
          <span className="font-semibold text-slate-800">Product Price: </span>
          <span className="text-slate-800">৳ {((selectedSku?.price ?? product.price) * quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div>
          <span className="font-semibold text-slate-800">Shipping Charge: </span>
          <span className="text-red-500">৳ 750/1100 Per Kg </span>
          <button onClick={() => setIsModalOpen(true)} className="text-red-500 hover:underline">(বিস্তারিত)</button>
        </div>
        <div>
          <span className="font-semibold text-slate-800">Approximate Weight: </span>
          <span className="text-slate-800">Check below package info or contact support.</span>
        </div>
        <div>
          <span className="font-semibold text-slate-800">Pay Now (70%): </span>
          <span className="text-slate-800">৳ {(((selectedSku?.price ?? product.price) * quantity) * 0.7).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div>
          <span className="font-semibold text-slate-800">Pay on Delivery: </span>
          <span className="text-slate-800">৳ {(((selectedSku?.price ?? product.price) * quantity) * 0.3).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} + চায়না কুরিয়ার বিল + চায়না থেকে বাংলাদেশ শিপিং চার্জ</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 mt-2">
        <Button 
          onClick={() => addToCart(product, quantity, selectedSku)}
          className="flex-1 bg-slate-800 hover:bg-slate-700 text-white h-12 rounded-lg font-medium text-base"
        >
          Add to cart
        </Button>
        <Button variant="outline" className="flex-1 border-slate-300 text-slate-700 h-12 rounded-lg font-medium text-base hover:bg-slate-50">
          Add to compare
        </Button>
        <Button variant="outline" size="icon" className="w-12 h-12 rounded-lg border-slate-300 text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors">
          <Heart className="w-5 h-5" />
        </Button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-slate-900 text-base mb-2">
                  ক্যাটাগরি: এ - 780 থেকে 950 টাকা প্রতি কেজি (08 Jan 2026)
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed">
                  প্রতি কেজি জুতা, ব্যাগ, জুয়েলারী,যন্ত্রপাতি, স্টিকার, ইলেকট্রনিক্স, কম্পিউটার এক্সেসরিজ, সিরামিক, ধাতব, চামরা, রাবার,প্লাস্টিক জাতীয় পন্য, ব্যাটারি ব্যাতিত খেলনা।
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base mb-2">
                  ক্যাটাগরি: বি - 1100 থেকে 1350 টাকা প্রতি কেজি
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed">
                  ব্যাটারি জাতীয় যেকোন পন্য, ডুপ্লিকেট ব্রান্ড বা কপি পন্য, জীবন্ত উদ্ভিদ, বীজ,রাসায়নিক দ্রব্য, খাদ্য,নেটওয়ার্কিং আইটেম, ম্যাগনেট বা লেজার জাতীয় পন্য।
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base mb-2">
                  ক্যাটাগরি: সি
                </h3>
                <p className="text-slate-700 text-sm leading-relaxed">
                  পোশাক বা যেকোন গার্মেন্টস আইটেম 850 থেকে 950 টাকা , হিজাব /ওড়না 850 টাকা , পাউডার 1150 টাকা, পারফিউম 1250 টাকা, ট্রিমার 1380 টাকা , সানগ্লাস 3500 টাকা , তরল পণ্য বা কসমেটিক্স 1200 টাকা থেকে 1350 টাকা, শুধু ব্যাটারি বা পাওয়ার ব্যাংক 1350 টাকা, স্মার্ট ওয়াচ 1250 থেকে 1450 টাকা , সাধারন ঘড়ি 1300 টাকা , Bluetooth হেডফোন 1250 টাকা, চকলেট 3200 টাকা
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                onClick={() => setIsModalOpen(false)}
                className="bg-[#D92D20] hover:bg-[#B42318] text-white px-8 font-semibold rounded-md"
              >
                Accept
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

"use client";

import React, { useEffect, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft, Loader2 } from "lucide-react";
import { createOrder } from "@/services/order.service";
import { getAddresses } from "@/services/profile.service";

/**
 * Checkout sends three things and nothing more: which saved address to ship
 * to, how the shopper intends to pay, and an optional note. The server prices
 * the order from the cart it already holds — sending items or totals from here
 * would let the browser name its own price.
 *
 * There are no card fields. Card details are entered on SSLCommerz's own
 * hosted page after the redirect; a PAN typed into this form would be ours to
 * protect, and we have no business holding one.
 */

type Address = {
  id: string;
  label: string | null;
  recipientName: string;
  phone: string;
  line1: string;
  line2: string | null;
  area: string;
  city: string;
  district: string;
  postalCode: string | null;
  isDefault: boolean;
};

const taka = (n: number) => `৳ ${n.toLocaleString()}`;

function formatAddress(a: Address) {
  return [a.line1, a.line2, a.area, a.city, a.district, a.postalCode]
    .filter(Boolean)
    .join(", ");
}

export default function CheckoutPage() {
  const { cart, cartTotal, shipping, total, cartItemCount, refresh } = useCart();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(true);
  const [addressId, setAddressId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "sslcommerz">("cod");
  const [orderNote, setOrderNote] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getAddresses();
        if (cancelled) return;
        const list: Address[] = res?.data ?? [];
        setAddresses(list);
        setAddressId((list.find((a) => a.isDefault) ?? list[0])?.id ?? null);
      } catch {
        if (!cancelled) toast.error("Could not load your saved addresses.");
      } finally {
        if (!cancelled) setAddressesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleConfirmOrder = async () => {
    if (!addressId) {
      toast.error("Choose a delivery address first.");
      return;
    }
    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    setIsLoading(true);
    const res = await createOrder({
      addressId,
      paymentMethod,
      notes: orderNote.trim() || undefined,
    });
    setIsLoading(false);

    if (!res.ok) {
      toast.error(res.error ?? "Failed to confirm order.");
      return;
    }

    // Checkout consumes the cart server-side; pull the emptied one rather than
    // clearing a copy locally.
    await refresh();

    // An online payment is not finished until SSLCommerz says so — follow the
    // redirect the backend handed back instead of showing a confirmation.
    const redirect = res.data?.gatewayRedirectUrl;
    if (redirect) {
      window.location.href = redirect;
      return;
    }

    toast.success("Order confirmed successfully!");
    router.push(`/order-confirmation/${res.data?.order?.id}`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-20">
      <header className="border-b border-gray-100 dark:border-gray-800 py-4 mb-8">
        <Container className="flex items-center justify-center relative">
          <button onClick={() => router.back()} className="absolute left-4 top-1/2 -translate-y-1/2">
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-[18px] font-bold text-[#1C244B] dark:text-white">Checkout</h1>
        </Container>
      </header>

      <Container className="">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Left Column: Delivery + payment */}
          <div className="flex-1 space-y-8">
            <div className="border-b border-gray-100 dark:border-gray-800 pb-2 mb-6">
              <h2 className="text-[15px] font-semibold text-[#8C93A3] text-center">Delivery address</h2>
            </div>

            {addressesLoading ? (
              <div className="flex items-center gap-2 text-[14px] text-[#8C93A3]">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading your addresses…
              </div>
            ) : addresses.length === 0 ? (
              <div className="rounded-md border border-dashed border-gray-300 dark:border-gray-700 p-6 text-center">
                <p className="text-[14px] text-[#8C93A3] mb-4">
                  You have no saved addresses yet. Add one to place this order.
                </p>
                <Link
                  href="/profile/address"
                  className="inline-block bg-[#333333] hover:bg-black text-white px-5 py-2.5 rounded-lg text-[13px] font-bold transition-colors"
                >
                  Add an address
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => setAddressId(a.id)}
                    className={`flex items-start gap-3 p-4 rounded-md border cursor-pointer transition-colors ${
                      addressId === a.id
                        ? "border-gray-800 bg-gray-50 dark:bg-gray-800"
                        : "border-gray-200 bg-white dark:bg-gray-900"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 mt-1 rounded-full border flex items-center justify-center shrink-0 ${
                        addressId === a.id ? "border-gray-800" : "border-gray-400"
                      }`}
                    >
                      {addressId === a.id && <div className="w-2 h-2 bg-gray-800 rounded-full" />}
                    </div>
                    <div className="text-left">
                      <p className="text-[14px] font-medium text-gray-800 dark:text-gray-200">
                        {a.recipientName} · {a.phone}
                        {a.label ? <span className="text-[#8C93A3] font-normal"> ({a.label})</span> : null}
                      </p>
                      <p className="text-[13px] text-[#8C93A3] mt-1">{formatAddress(a)}</p>
                    </div>
                  </div>
                ))}
                <Link href="/profile/address" className="inline-block text-[13px] font-semibold text-[#4A85F6] hover:underline">
                  Manage addresses
                </Link>
              </div>
            )}

            <div className="pt-4">
              <h3 className="text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-3">Payment method</h3>
              <div className="space-y-3">
                {([
                  { id: "cod", label: "Cash on delivery", hint: "Pay the courier when your order arrives." },
                  { id: "sslcommerz", label: "Online payment", hint: "Card, mobile banking or net banking via SSLCommerz." },
                ] as const).map((option) => (
                  <div
                    key={option.id}
                    onClick={() => setPaymentMethod(option.id)}
                    className={`flex items-start gap-3 p-4 rounded-md border cursor-pointer transition-colors ${
                      paymentMethod === option.id
                        ? "border-gray-800 bg-gray-50 dark:bg-gray-800"
                        : "border-gray-200 bg-white dark:bg-gray-900"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 mt-1 rounded-full border flex items-center justify-center shrink-0 ${
                        paymentMethod === option.id ? "border-gray-800" : "border-gray-400"
                      }`}
                    >
                      {paymentMethod === option.id && <div className="w-2 h-2 bg-gray-800 rounded-full" />}
                    </div>
                    <div className="text-left">
                      <span className="text-[14px] text-gray-700 dark:text-gray-200">{option.label}</span>
                      <p className="text-[13px] text-[#8C93A3] mt-1">{option.hint}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Summary */}
          <div className="w-full lg:w-[450px] xl:w-[500px]">
            <div className="border-b border-gray-100 dark:border-gray-800 pb-2 mb-6 text-center lg:text-left">
              <h2 className="text-[15px] font-semibold text-[#8C93A3]">Order summary</h2>
            </div>

            <div className="bg-[#F9FAFB] dark:bg-gray-900 rounded-xl p-6 mb-6">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
                <span className="font-semibold text-[14px]">
                  Total items <span className="text-[#8C93A3] font-normal">({cartItemCount} items)</span>
                </span>
                <span className="font-bold text-[15px]">{taka(cartTotal)}</span>
              </div>

              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div>
                      <p className="text-[14px] font-medium text-gray-800 dark:text-gray-200">{item.title}</p>
                      <p className="text-[13px] text-[#8C93A3] mt-1">
                        {item.quantity} × {taka(item.unitPriceBdt)}
                      </p>
                    </div>
                    <span className="text-[14px] font-medium">{taka(item.lineTotalBdt)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#F9FAFB] dark:bg-gray-900 rounded-xl p-6 mb-6">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-[14px] text-[#8C93A3]">Sub total</span>
                  <span className="text-[14px] text-[#8C93A3]">{taka(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[14px] text-[#8C93A3]">Delivery</span>
                  <span className="text-[14px] text-[#8C93A3]">{taka(shipping)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-800">
                <span className="text-[16px] font-bold text-[#1C244B] dark:text-white">Total</span>
                <span className="text-[18px] font-bold text-[#1C244B] dark:text-white">{taka(total)}</span>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-[14px] text-[#1C244B] dark:text-white mb-2 font-medium">Order note</label>
              <textarea
                className="w-full h-24 p-4 text-[14px] bg-[#F9FAFB] dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none focus:ring-1 focus:ring-primary resize-none placeholder:text-[#8C93A3]"
                placeholder="Write your order instructions here..."
                maxLength={500}
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
              />
              <p className="text-[12px] text-[#8C93A3] mt-2">{orderNote.length} / 500 characters</p>
            </div>

            <div className="flex flex-col items-center gap-4 mb-12 w-full">
              <Button
                onClick={handleConfirmOrder}
                disabled={isLoading || !addressId || cart.length === 0}
                className="w-full h-12 bg-[#333333] hover:bg-black text-white font-medium text-[15px]"
              >
                {isLoading ? "Confirming..." : "Confirm order"}
              </Button>
              <div className="text-[14px] text-[#8C93A3]">
                Need to modify items?{" "}
                <Link href="/cart" className="text-[#1C244B] dark:text-white font-semibold hover:underline">
                  Change your order
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

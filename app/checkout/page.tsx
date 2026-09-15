"use client";

import React, { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Container } from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { createOrder } from "@/services/order.service";

export default function CheckoutPage() {
  const { cart, cartTotal, cartItemCount, clearCart } = useCart();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [billingSameAsDelivery, setBillingSameAsDelivery] = useState(true);
  const [deliveryType, setDeliveryType] = useState("Standard delivery");
  const [paymentMethod, setPaymentMethod] = useState("Online payment");
  const [cardNumber, setCardNumber] = useState("");
  const [cvc, setCvc] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [orderNote, setOrderNote] = useState("");

  const shippingCosts: Record<string, number> = {
    "Free delivery": 0,
    "Standard delivery": 6.99,
    "Express delivery": 12.99,
  };

  const currentShippingCost = shippingCosts[deliveryType] || 0;
  const finalTotal = cartTotal + currentShippingCost;

  const handleConfirmOrder = async () => {
    if (!fullName || !phone || !deliveryAddress) {
      toast.error("Please fill in all required fields (Name, Phone, Address).");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    setIsLoading(true);

    const orderData = {
      customer: {
        fullName,
        phone,
        email,
        deliveryAddress,
        billingAddress: billingSameAsDelivery ? "Same as delivery address" : "",
        orderNote,
      },
      payment: {
        deliveryType,
        paymentMethod,
        cardDetails: paymentMethod === "Online payment" ? `**** **** **** ${cardNumber.slice(-4)}` : undefined,
      },
      items: cart,
      totals: {
        subtotal: cartTotal,
        shipping: currentShippingCost,
        discount: 0,
        total: finalTotal,
      },
    };

    try {
      const { ok, data } = await createOrder(orderData);

      if (ok) {
        clearCart();
        toast.success("Order confirmed successfully!");
        router.push(`/order-confirmation/${data.order.id}`);
      } else {
        toast.error(data.error || "Failed to confirm order.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
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

          {/* Left Column: Form */}
          <div className="flex-1 space-y-8">
            <div className="border-b border-gray-100 dark:border-gray-800 pb-2 mb-6">
              <h2 className="text-[15px] font-semibold text-[#8C93A3] text-center">Order information</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-2">Full name</label>
                <Input className="pl-4 rounded-md bg-[#F9FAFB] dark:bg-gray-900 border-gray-200 dark:border-gray-800 dark:text-gray-200" placeholder="username" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>

              <div>
                <label className="block text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-2">Phone number</label>
                <Input className="pl-4 rounded-md bg-[#F9FAFB] dark:bg-gray-900 border-gray-200 dark:border-gray-800 dark:text-gray-200" placeholder="+880 - 1234567890" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>

              <div>
                <label className="block text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-2">Email (Optional)</label>
                <Input className="pl-4 rounded-md bg-[#F9FAFB] dark:bg-gray-900 border-gray-200 dark:border-gray-800 dark:text-gray-200" placeholder="username@mail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div>
                <label className="block text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-2">Delivery address</label>
                <textarea
                  className="w-full h-24 p-4 text-[14px] bg-[#F9FAFB] dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  placeholder="e.g. Road no., Area, City, Zip code etc."
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className="text-[14px] font-medium text-[#1C244B] dark:text-gray-300">Billing address</span>
                <div className="flex items-center gap-3">
                  <span className="text-[13px] text-[#8C93A3]">Same as delivery address</span>
                  {/* Custom Toggle Switch */}
                  <div
                    className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors ${billingSameAsDelivery ? 'bg-gray-800' : ''}`}
                    onClick={() => setBillingSameAsDelivery(!billingSameAsDelivery)}
                  >
                    <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${billingSameAsDelivery ? 'translate-x-5' : ''}`} />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <h3 className="text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-3">Delivery type</h3>
              <div className="space-y-3">
                {[
                  { id: "Free delivery", price: 0 },
                  { id: "Standard delivery", price: 6.99 },
                  { id: "Express delivery", price: 12.99 }
                ].map((type) => (
                  <div
                    key={type.id}
                    onClick={() => setDeliveryType(type.id)}
                    className={`flex items-center justify-between p-4 rounded-md border cursor-pointer transition-colors ${deliveryType === type.id ? 'border-gray-800 bg-gray-50 dark:bg-gray-800' : 'border-gray-200 bg-white dark:bg-gray-900'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${deliveryType === type.id ? 'border-gray-800' : 'border-gray-400'}`}>
                        {deliveryType === type.id && <div className="w-2 h-2 bg-gray-800 rounded-full" />}
                      </div>
                      <span className="text-[14px] text-gray-700 dark:text-gray-200">{type.id}</span>
                    </div>
                    <span className="text-[14px] font-medium text-gray-900 dark:text-white">
                      ৳ {type.price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <h3 className="text-[14px] font-medium text-gray-700 dark:text-gray-300 mb-3">Payment method</h3>
              <div className="space-y-3">
                <div
                  onClick={() => setPaymentMethod("Cash on delivery")}
                  className="flex items-center gap-3 p-4 rounded-md border border-gray-200 bg-white dark:bg-gray-900 cursor-pointer"
                >
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === "Cash on delivery" ? 'border-gray-800' : 'border-gray-400'}`}>
                    {paymentMethod === "Cash on delivery" && <div className="w-2 h-2 bg-gray-800 rounded-full" />}
                  </div>
                  <span className="text-[14px] text-gray-700 dark:text-gray-200">Cash on delivery</span>
                </div>

                <div
                  onClick={() => setPaymentMethod("Online payment")}
                  className={`border rounded-md cursor-pointer transition-colors ${paymentMethod === "Online payment" ? 'border-gray-800 bg-gray-50 dark:bg-gray-800' : 'border-gray-200 bg-white dark:bg-gray-900'}`}
                >
                  <div className="flex items-center gap-3 p-4">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === "Online payment" ? 'border-gray-800' : 'border-gray-400'}`}>
                      {paymentMethod === "Online payment" && <div className="w-2 h-2 bg-gray-800 rounded-full" />}
                    </div>
                    <span className="text-[14px] text-gray-700 dark:text-gray-200">Online payment</span>
                  </div>

                  {paymentMethod === "Online payment" && (
                    <div className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700 mt-2">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 rounded-full bg-gray-800" />
                        <span className="text-[13px] font-medium">Credit or debit card</span>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-[12px] text-[#8C93A3] mb-1">Card number</label>
                          <Input className="pl-4 rounded-md bg-[#F9FAFB] dark:bg-gray-900 border-gray-200 dark:border-gray-800 dark:text-gray-200 h-10" placeholder="e.g. 123456789" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
                        </div>
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <label className="block text-[12px] text-[#8C93A3] mb-1">CVC/CVV</label>
                            <Input className="pl-4 rounded-md bg-[#F9FAFB] dark:bg-gray-900 border-gray-200 dark:border-gray-800 dark:text-gray-200 h-10" placeholder="e.g. 123" value={cvc} onChange={(e) => setCvc(e.target.value)} />
                          </div>
                          <div className="flex-1">
                            <label className="block text-[12px] text-[#8C93A3] mb-1">Expiry date</label>
                            <div className="flex gap-2">
                              <select className="w-full h-10 px-3 bg-[#F9FAFB] dark:bg-gray-900 border border-gray-200 dark:border-gray-800 dark:text-gray-200 rounded-md text-[13px] outline-none" value={expiryMonth} onChange={(e) => setExpiryMonth(e.target.value)}>
                                <option value="">MM</option>
                                <option value="01">01</option>
                                <option value="02">02</option>
                              </select>
                              <select className="w-full h-10 px-3 bg-[#F9FAFB] dark:bg-gray-900 border border-gray-200 dark:border-gray-800 dark:text-gray-200 rounded-md text-[13px] outline-none" value={expiryYear} onChange={(e) => setExpiryYear(e.target.value)}>
                                <option value="">YYYY</option>
                                <option value="2025">2025</option>
                                <option value="2026">2026</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
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
                <span className="font-semibold text-[14px]">Total items <span className="text-[#8C93A3] font-normal">({cartItemCount} items)</span></span>
                <span className="font-bold text-[15px]">৳ {cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>

              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div>
                      <p className="text-[14px] font-medium text-gray-800 dark:text-gray-200">{item.title}</p>
                      <p className="text-[13px] text-[#8C93A3] mt-1">{item.quantity} x ৳ {item.unitPriceBdt.toLocaleString()}</p>
                    </div>
                    <span className="text-[14px] font-medium">৳ {item.lineTotalBdt.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-[14px] text-[#8C93A3] mb-2">Coupon code <span className="text-gray-400">(Optional)</span></label>
              <div className="flex gap-3">
                <Input className="flex-1 bg-[#F9FAFB] dark:bg-gray-900 border border-gray-200 dark:border-gray-800 dark:text-gray-200 h-11 pl-4" placeholder="e.g. zaag40" />
                <Button variant="secondary" className="px-6 h-11 bg-[#F3F4F6] dark:bg-gray-800 text-gray-500 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700">Apply</Button>
              </div>
            </div>

            <div className="bg-[#F9FAFB] dark:bg-gray-900 rounded-xl p-6 mb-6">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 border-dashed dark:border-gray-800">
                <span className="text-[14px] font-medium text-[#1C244B] dark:text-white">Total items</span>
                <span className="text-[14px] font-medium">{cartItemCount}</span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-[14px] text-[#8C93A3]">Sub total</span>
                  <span className="text-[14px] text-[#8C93A3]">৳ {cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[14px] text-[#8C93A3]">Shipping cost</span>
                  <span className="text-[14px] text-[#8C93A3]">৳ {currentShippingCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[14px] text-[#8C93A3]">Discount</span>
                  <span className="text-[14px] text-red-500">- ৳ 0.00</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-800">
                <span className="text-[16px] font-bold text-[#1C244B] dark:text-white">Total</span>
                <span className="text-[18px] font-bold text-[#1C244B] dark:text-white">৳ {finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-[14px] text-[#1C244B] dark:text-white mb-2 font-medium">Order note</label>
              <textarea
                className="w-full h-24 p-4 text-[14px] bg-[#F9FAFB] dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none focus:ring-1 focus:ring-primary resize-none placeholder:text-[#8C93A3]"
                placeholder="Write your order instructions here..."
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
              />
              <p className="text-[12px] text-[#8C93A3] mt-2">Max character : 300</p>
            </div>

            <div className="flex flex-col items-center gap-4 mb-12 w-full">
              <Button
                onClick={handleConfirmOrder}
                disabled={isLoading}
                className="w-full h-12 bg-[#333333] hover:bg-black text-white font-medium text-[15px]"
              >
                {isLoading ? "Confirming..." : "Confirm order"}
              </Button>
              <div className="text-[14px] text-[#8C93A3]">
                Need to modify items? <Link href="/cart" className="text-[#1C244B] dark:text-white font-semibold hover:underline">Change your order</Link>
              </div>
            </div>

            <div className="text-center text-[13px] text-[#8C93A3] space-y-1">
              <p>To save your information for your next purchase, <Link href="/signup" className="text-[#1C244B] dark:text-white font-semibold hover:underline">Sign up</Link></p>
              <p>Or</p>
              <p>If you already have an account ? <Link href="/login" className="text-[#1C244B] dark:text-white font-semibold hover:underline">Sign in</Link></p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

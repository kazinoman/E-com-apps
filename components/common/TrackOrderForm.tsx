"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

interface TrackOrderFormProps {
  onTrack: (phone: string, orderId: string) => Promise<void> | void;
  isLoading: boolean;
}

export function TrackOrderForm({ onTrack, isLoading }: TrackOrderFormProps) {
  const [phone, setPhone] = useState("");
  const [orderId, setOrderId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTrack(phone, orderId);
  };

  return (
    <div className="w-full">
      <h2 className="text-[22px] font-bold text-[#333333] dark:text-white mb-2">Track your order</h2>
      <p className="text-[14px] text-[#8C93A3] mb-8 leading-relaxed">
        Enter your phone number and order id to get the latest update on your order status
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[13px] font-medium text-[#333333] dark:text-gray-300 mb-2">Phone number</label>
          <input 
            type="text" 
            placeholder="+880 - 1234567890" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-[#F8F9FA] dark:bg-gray-800 border border-transparent focus:border-[#4A85F6] focus:ring-1 focus:ring-[#4A85F6] rounded-xl px-4 py-3.5 text-[14px] outline-none text-[#333333] dark:text-white transition-all placeholder:text-[#8C93A3]"
          />
        </div>

        <div>
          <label className="block text-[13px] font-medium text-[#333333] dark:text-gray-300 mb-2">Order Id</label>
          <input 
            type="text" 
            placeholder="e.g. #123456789" 
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full bg-[#F8F9FA] dark:bg-gray-800 border border-transparent focus:border-[#4A85F6] focus:ring-1 focus:ring-[#4A85F6] rounded-xl px-4 py-3.5 text-[14px] outline-none text-[#333333] dark:text-white transition-all placeholder:text-[#8C93A3]"
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-[#333333] dark:bg-white text-white dark:text-[#333333] rounded-xl py-4 text-[15px] font-bold mt-2 hover:bg-black dark:hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Track your order"}
        </button>
      </form>

      <div className="text-center mt-8 text-[13px] text-[#8C93A3]">
        Facing some difficulties, please visit <Link href="/contact" className="font-bold text-[#333333] dark:text-white hover:underline">Contact us</Link> page.
      </div>
    </div>
  );
}

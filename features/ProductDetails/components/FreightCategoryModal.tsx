"use client";

import { X } from "lucide-react";

interface FreightCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FreightCategoryModal({ isOpen, onClose }: FreightCategoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div 
        className="bg-card rounded-2xl shadow-2xl w-full max-w-[600px] relative animate-in fade-in zoom-in-95 duration-200 overflow-hidden border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-border flex justify-between items-center bg-muted/50">
          <h2 className="text-lg font-bold text-slate-800 dark:text-gray-100">Freight Category Details</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-800 dark:text-gray-500 dark:hover:text-gray-200 transition-colors bg-card p-1.5 rounded-full shadow-sm"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Category A */}
          <div className="bg-indigo-50/50 dark:bg-indigo-950/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30 space-y-2">
            <h3 className="font-bold text-indigo-700 dark:text-indigo-400 text-base">
              ক্যাটাগরিঃ এ - 780 থেকে 950 টাকা প্রতি কেজি <span className="text-sm font-normal text-indigo-500">(08 Jan 2026)</span>
            </h3>
            <p className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed">
              প্রতি কেজি জুতা, ব্যাগ, জুয়েলারী, যন্ত্রপাতি, স্টিকার, ইলেকট্রনিক্স, কম্পিউটার এক্সেসরীস, সিরামিক, ধাতব, চামরা, রাবার, প্লাস্টিক জাতীয় পন্য, ব্যাটারি ব্যাতিত খেলনা।
            </p>
          </div>

          {/* Category B */}
          <div className="bg-orange-50/50 dark:bg-orange-950/20 p-4 rounded-xl border border-orange-100 dark:border-orange-900/30 space-y-2">
            <h3 className="font-bold text-orange-700 dark:text-orange-400 text-base">
              ক্যাটাগরিঃ বি - 1100 থেকে 1350 টাকা প্রতি কেজি
            </h3>
            <p className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed">
              ব্যাটারি জাতীয় যেকোণ পন্য, ডুপ্লিকেট ব্রান্ড বা কপিঁ পন্য, জীবন্ত উদ্ভিদ, বীজ, রাসায়নীক দ্রব্য, খাদ্য, নেটওয়ার্কিং আইটেম, ম্যাগনেট বা লেজার জাতীয় পন্য।
            </p>
          </div>

          {/* Category C */}
          <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30 space-y-2">
            <h3 className="font-bold text-emerald-700 dark:text-emerald-400 text-base">
              ক্যাটাগরিঃ সি
            </h3>
            <ul className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed space-y-1 list-disc list-inside">
              <li>পোশাক বা যেকোন গার্মেন্টস আইটেম <span className="font-medium text-slate-900 dark:text-white">850 থেকে 950 টাকা</span></li>
              <li>হিজাব / ওড়না <span className="font-medium text-slate-900 dark:text-white">850 টাকা</span></li>
              <li>পাউডার <span className="font-medium text-slate-900 dark:text-white">1150 টাকা</span></li>
              <li>পারফিউম <span className="font-medium text-slate-900 dark:text-white">1250 টাকা</span></li>
              <li>ট্রিমার <span className="font-medium text-slate-900 dark:text-white">1380 টাকা</span></li>
              <li>সানগ্লাস <span className="font-medium text-slate-900 dark:text-white">3500 টাকা</span></li>
              <li>তরল পণ্য বা কসমেটিক্স <span className="font-medium text-slate-900 dark:text-white">1200 টাকা থেকে 1350 টাকা</span></li>
              <li>শুধু ব্যাটারি বা পাওয়ার ব্যাংক <span className="font-medium text-slate-900 dark:text-white">1350 টাকা</span></li>
              <li>স্মার্ট ওয়াচ <span className="font-medium text-slate-900 dark:text-white">1250 থেকে 1450 টাকা</span></li>
              <li>সাধারন ঘড়ি <span className="font-medium text-slate-900 dark:text-white">1300 টাকা</span></li>
              <li>Bluetooth হেডফোন <span className="font-medium text-slate-900 dark:text-white">1250 টাকা</span></li>
              <li>চকলেট <span className="font-medium text-slate-900 dark:text-white">3200 টাকা</span></li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Backdrop click handler */}
      <div className="absolute inset-0 z-[-1]" onClick={onClose} />
    </div>
  );
}

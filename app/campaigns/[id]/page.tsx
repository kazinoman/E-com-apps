import React from "react";
import { notFound } from "next/navigation";
import { Container } from "@/components/common/Container";
import { fetchCampaignById } from "@/services/campaign.service";
import { CustomBreadcrumb } from "@/components/common/CustomBreadcrumb";
import { CountdownTimer } from "@/components/common/CountdownTimer";
import { ProductCard } from "@/components/common/ProductCard";
import { Flame, ShieldCheck, Ticket, Plane, Banknote, LayoutGrid, List, ChevronDown, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const campaign = await fetchCampaignById(id);

  if (!campaign) {
    notFound();
  }

  return (
    <div className="bg-zinc-50 dark:bg-background min-h-screen pb-20">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#2D141C] to-[#120B0F] pt-6 pb-20 border-b border-white/5 relative overflow-hidden">
        {/* Abstract graphic overlay (optional) */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#FF4747]/10 to-transparent pointer-events-none" />

        <Container className="relative z-10">
          {/* <CustomBreadcrumb
            routes={[
              { label: "Home", href: "/" },
              { label: "Global Campaigns", href: "/campaigns" },
              { label: campaign.title }
            ]}
          // className="text-white/60 hover:text-white"
          /> */}

          <div className="mt-8 flex flex-col lg:flex-row lg:items-start justify-between gap-10">
            {/* Left Content */}
            <div className="flex-1 max-w-3xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="inline-flex items-center gap-1.5 bg-[#FF4747] text-white px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> FLASH DROP • 48H CLEARANCE
                </div>
                <div className="inline-flex items-center gap-1.5 border border-[#00A65A]/50 bg-[#00A65A]/10 text-[#00A65A] px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                  <ShieldCheck className="w-3 h-3" /> Overseas Factory Direct
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-[56px] font-black text-white tracking-tight leading-[1.1] mb-6">
                {campaign.title}
              </h1>

              <p className="text-[16px] text-white/70 leading-relaxed max-w-2xl mb-10">
                {campaign.description}
              </p>

              {/* Stats Row */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-white">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black">{campaign.products.length}</span>
                  <span className="text-sm text-white/60">Curated Lots</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-white/20 hidden sm:block" />
                <div className="flex items-center gap-2 text-[#FF4747]">
                  <span className="text-[18px] font-bold">{campaign.tags[0] || "Up to 65% OFF"}</span>
                  <span className="text-sm text-white/60">Limited Margin</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-white/20 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <span className="text-[18px] font-bold">৳200</span>
                  <span className="text-sm text-white/60">Min. Cart Size</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-white/20 hidden lg:block" />
                <div className="flex items-center gap-2 text-[#00A65A]">
                  <Plane className="w-4 h-4" />
                  <span className="text-sm font-semibold">Free Air Delivery &gt; ৳3,000</span>
                </div>
              </div>
            </div>

            {/* Right Timer Box */}
            <div className="bg-[#1F1417]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 lg:w-[380px] shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-[#FF4747] font-bold text-[13px] tracking-widest uppercase">
                  <Flame className="w-4 h-4" /> SALE ENDS IN
                </div>
                <div className="flex items-center gap-1.5 text-[#FF4747] text-[11px] font-bold">
                  <Flame className="w-3 h-3 fill-[#FF4747]" /> {campaign.soldPercentage}% Claimed
                </div>
              </div>

              <CountdownTimer targetDate={campaign.endDate} variant="detail" className="mb-6 justify-between" />

              <div className="flex items-center justify-between text-[11px] font-bold tracking-wider text-[#00A65A] uppercase">
                <span className="inline-flex items-center gap-1.5"><Ticket className="w-3 h-3" /> Vouchers Auto-Applied</span>
                <span className="inline-flex items-center gap-1.5 text-white/60"><ShieldCheck className="w-3 h-3" /> Stock Locked on Add</span>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Voucher Bar */}
      <div className="bg-white dark:bg-card border-b border-gray-100 dark:border-gray-800 shadow-sm sticky top-[72px] z-40">
        <Container className="py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 bg-[#FFF5F5] dark:bg-[#FF4747]/10 px-4 py-2.5 rounded-xl border border-[#FF4747]/20">
            <Ticket className="w-6 h-6 text-[#FF4747]" />
            <div className="flex flex-col">
              <span className="text-[11px] font-bold tracking-wider text-gray-500 dark:text-gray-400 uppercase">
                Extra Savings Voucher
              </span>
              <div className="text-[13px] font-medium text-[#1A1A1A] dark:text-white">
                Use Code: <strong className="text-[#FF4747] font-bold mx-1">LUXE2025</strong> for extra 15% off
              </div>
            </div>
            <button className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 px-4 py-1.5 rounded-lg text-[12px] font-bold ml-2 transition-colors">
              Copy
            </button>
          </div>

          <div className="flex items-center gap-6 text-[12px] font-semibold text-gray-600 dark:text-gray-300">
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00A65A]" /> 100% Genuine Guaranteed</span>
            <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
            <span className="inline-flex items-center gap-2"><Plane className="w-4 h-4 text-[#00A65A]" /> CN → BD Express 7-10 Days</span>
            <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
            <span className="inline-flex items-center gap-2 text-[#F59E0B]"><Banknote className="w-4 h-4" /> Instant bKash/Nagad CashBack</span>
          </div>
        </Container>
      </div>

      {/* Product Grid */}
      <Container className="py-12">
        <div className="flex items-center justify-between mb-8">
          <p className="text-[14px] text-gray-500 font-medium">
            Showing <strong className="text-[#1A1A1A] dark:text-white">{campaign.products.length}</strong> of {campaign.products.length} products
          </p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[13px] text-gray-500">
              Sort by:
              <button className="flex items-center gap-1 font-bold text-[#1A1A1A] dark:text-white bg-white dark:bg-card border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg hover:border-gray-300 transition-colors">
                Featured • Best Match <ChevronDown className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>
            <div className="flex items-center bg-white dark:bg-card border border-gray-200 dark:border-gray-700 rounded-lg p-1">
              <button className="p-1.5 rounded bg-gray-100 dark:bg-gray-800 text-[#1A1A1A] dark:text-white shadow-sm">
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded text-gray-400 hover:text-[#1A1A1A] dark:hover:text-white transition-colors">
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {campaign.products.map(product => (
            <div key={product.id} className="relative">
              {/* Optional: we can inject a campaign badge directly over the product card if needed */}
              <div className="absolute top-3 left-3 z-10 bg-[#FF4747] text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-wider shadow-sm">
                CAMPAIGN DEAL
              </div>
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

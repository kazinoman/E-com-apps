import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/common/Container";
import { fetchCampaigns, Campaign } from "@/services/campaign.service";
import { CountdownTimer } from "@/components/common/CountdownTimer";
import { CustomBreadcrumb } from "@/components/common/CustomBreadcrumb";
import { Plane, ShieldCheck, Banknote, RefreshCcw, ArrowRight, Circle, CheckCircle2, ChevronDown, Sparkles, Flame, Clock, Headphones, Shirt } from "lucide-react";
import { cn } from "@/lib/utils";

// We copy formatCurrency locally to avoid the missing module error.
const formatCurr = (value: number) => {
  return new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(value).replace('BDT', '৳');
};

export const metadata = {
  title: "Campaigns | Mega Flash Sale Hub",
};

export default async function CampaignsPage() {
  const campaigns = await fetchCampaigns();

  return (
    <div className="bg-zinc-50 dark:bg-background min-h-screen pb-20">
      {/* Hero Banner Area */}
      <div className="bg-gradient-to-br from-[#93291E] via-[#2F1020] to-[#0F172A] pt-6 pb-20">
        <Container>
          {/* <CustomBreadcrumb 
            routes={[
              { label: "Home", href: "/" }, 
              { label: "Campaigns", href: "/campaigns" },
              { label: "Mega Flash Sale Hub" }
            ]} 
            className="text-white/70 hover:text-white"
          /> */}

          <div className="mt-8 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="inline-flex items-center gap-1.5 bg-white/10 text-white/90 border border-white/20 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-[#FF4747] animate-pulse" /> LIVE CAMPAIGN DROPS
              </div>
              <div className="inline-flex items-center gap-1.5 text-white/80 text-[12px] font-medium tracking-wide">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00A65A]" /> VERIFIED STOCK TICKERS
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight max-w-3xl leading-[1.1]">
              Mega Flash Sale Hub
            </h1>

            <p className="text-[15px] text-white/80 max-w-2xl leading-relaxed">
              Exclusive limited-time drops with up to <strong className="text-[#00A65A]">75% OFF</strong>. Guaranteed authentic global imports, express direct CN-to-BD customs clearance, and instant cash rebate vouchers.
            </p>

            {/* Filter Tabs */}
            <div className="flex items-center justify-between mt-8">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide w-full max-w-[calc(100%-180px)]">
                <button className="whitespace-nowrap px-4 py-2 bg-white text-black rounded-full text-[13px] font-bold inline-flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#FF4747] fill-[#FF4747]" /> All Live Deals (48)
                </button>
                <button className="whitespace-nowrap px-4 py-2 bg-white/10 text-white hover:bg-white/20 rounded-full text-[13px] font-medium border border-white/10 transition-colors inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#00A65A]" /> Ending Soon (&lt; 3h)
                </button>
                <button className="whitespace-nowrap px-4 py-2 bg-white/10 text-white hover:bg-white/20 rounded-full text-[13px] font-medium border border-white/10 transition-colors">
                  <Headphones className="w-3.5 h-3.5 inline-block mr-1.5" /> Electronics & Gadgets
                </button>
                <button className="whitespace-nowrap px-4 py-2 bg-white/10 text-white hover:bg-white/20 rounded-full text-[13px] font-medium border border-white/10 transition-colors">
                  <Shirt className="w-3.5 h-3.5 inline-block mr-1.5" /> Luxe & Apparel
                </button>
              </div>

              <div className="hidden lg:flex items-center bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-[13px] text-white/90 gap-4 cursor-pointer">
                <span><span className="text-white/50 mr-2">Sort:</span> Ending Soonest</span>
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="-mt-10 relative z-10">
        {/* Benefit Pills */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <div className="bg-card rounded-2xl p-4 shadow-sm border border-border flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#E8F5E9] dark:bg-[#0A2F1A] flex items-center justify-center shrink-0">
              <Plane className="w-5 h-5 text-[#00A65A]" />
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-[#1A1A1A] dark:text-white">Express Air Courier</h4>
              <p className="text-[11px] text-gray-500">Direct CN → BD in 4-7 Days</p>
            </div>
          </div>
          <div className="bg-card rounded-2xl p-4 shadow-sm border border-border flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#E3F2FD] dark:bg-[#0A1A2F] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#3B82F6]" />
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-[#1A1A1A] dark:text-white">100% Verified Authentic</h4>
              <p className="text-[11px] text-gray-500">Full Double-Money Guarantee</p>
            </div>
          </div>
          <div className="bg-card rounded-2xl p-4 shadow-sm border border-border flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FFF3E0] dark:bg-[#2F1A0A] flex items-center justify-center shrink-0">
              <Banknote className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-[#1A1A1A] dark:text-white">Instant MFS Rebates</h4>
              <p className="text-[11px] text-gray-500">Extra 10% on bKash & Nagad</p>
            </div>
          </div>
          <div className="bg-card rounded-2xl p-4 shadow-sm border border-border flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FCE4EC] dark:bg-[#2F0A1A] flex items-center justify-center shrink-0">
              <RefreshCcw className="w-5 h-5 text-[#EC4899]" />
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-[#1A1A1A] dark:text-white">Hassle-Free 7D Returns</h4>
              <p className="text-[11px] text-gray-500">Doorstep Pickup across Dhaka</p>
            </div>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[#FF4747] text-[11px] font-bold tracking-wider uppercase mb-2">
              <Sparkles className="w-3 h-3" /> PRIORITY CLEARANCE DROPS
            </div>
            <h2 className="text-2xl font-extrabold text-[#1A1A1A] dark:text-white tracking-tight mb-1.5">
              Active Campaign Stages & Countdown Deals
            </h2>
            <p className="text-[14px] text-gray-500 dark:text-gray-400">
              Locked quantities at wholesale import rates. Deals expire strictly when counter hits zero or inventory sells out.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-card border border-border rounded-full px-3 py-1.5 text-[12px] font-semibold text-gray-600 dark:text-gray-300 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#00A65A]" />
            1,248 shoppers checking out now
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map(campaign => (
            <CampaignListCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </Container>
    </div>
  );
}

function CampaignListCard({ campaign }: { campaign: Campaign }) {
  const isDanger = campaign.stockLeft < 20;

  return (
    <Link href={`/campaigns/${campaign.id}`} className="group bg-card rounded-[24px] overflow-hidden border border-[#F0F0F0] dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image Block */}
      <div className="relative aspect-[16/9] w-full bg-muted overflow-hidden">
        <Image
          src={campaign.cardImage}
          alt={campaign.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider bg-[#FF4747] text-white">
            {campaign.tags[0]}
          </span>
          {campaign.tags[1] && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider bg-white/90 text-[#1A1A1A] backdrop-blur-sm">
              {campaign.tags[1]}
            </span>
          )}
        </div>

        {/* Timer */}
        <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between">
          <CountdownTimer targetDate={campaign.endDate} variant="list" className={isDanger ? "bg-[#FF4747]/90" : ""} />
        </div>
      </div>

      {/* Content Block */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">
            {campaign.category}
          </span>
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#00A65A]">
            <ShieldCheck className="w-3 h-3" /> {campaign.features[0]}
          </div>
        </div>

        <h3 className="text-[17px] font-extrabold text-[#1A1A1A] dark:text-white leading-snug mb-1.5 group-hover:text-primary transition-colors line-clamp-1">
          {campaign.title}
        </h3>

        <p className="text-[12px] text-[#666666] dark:text-gray-400 line-clamp-2 mb-5">
          {campaign.description}
        </p>

        {/* Featured Steal */}
        <div className="border-t border-border pt-4 mb-5">
          <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mb-1 block">
            FEATURED STEAL
          </span>
          <div className="flex items-end justify-between">
            <h4 className="text-[13px] font-bold text-[#1A1A1A] dark:text-white line-clamp-2">
              {campaign.featuredProductName}
            </h4>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6 mt-auto">
          <div className="flex items-center justify-between text-[11px] font-bold mb-2">
            <span className="text-[#1A1A1A] dark:text-gray-200">Claimed: {campaign.soldPercentage}%</span>
            <span className={cn(isDanger ? "text-[#FF4747]" : "text-[#F59E0B]")}>
              {isDanger ? `Only ${campaign.stockLeft} items left!` : `Just ${campaign.stockLeft} Units in Stock`}
            </span>
          </div>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-1000",
                isDanger ? "bg-[#FF4747]" : "bg-[#00A65A]"
              )}
              style={{ width: `${campaign.soldPercentage}%` }}
            />
          </div>
        </div>

        {/* Action */}
        <button className="w-full bg-[#1A1A1A] dark:bg-white text-white dark:text-[#1A1A1A] hover:bg-black dark:hover:bg-gray-100 py-3 rounded-xl text-[13px] font-bold inline-flex items-center justify-center gap-2 transition-colors">
          Explore Campaign <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </Link>
  );
}



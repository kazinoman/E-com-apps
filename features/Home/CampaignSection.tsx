import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/common/Container";
import { Campaign } from "@/services/campaign.service";
import { CountdownTimer } from "@/components/common/CountdownTimer";
import { Flame, CheckCircle2, Zap, Heart, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(value).replace('BDT', '৳');
};

interface CampaignSectionProps {
  campaigns: Campaign[];
}

export const CampaignSection = ({ campaigns }: CampaignSectionProps) => {
  if (!campaigns || campaigns.length === 0) return null;

  return (
    <section className="bg-background py-16">
      <Container>
        {/* Banner Header */}
        <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-6 md:gap-8 mb-10 bg-gradient-to-r from-[#1F080C] via-[#160508] to-[#120406] p-5 sm:p-6 lg:p-8 rounded-[24px] border border-[#331118]">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 lg:gap-10 w-full lg:w-auto text-center md:text-left">
            {/* Left Title Area */}
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#FF0033] shadow-[0_0_20px_rgba(255,0,51,0.4)] flex items-center justify-center shrink-0">
                <Zap className="w-7 h-7 text-white fill-white" />
              </div>
              <div className="flex flex-col items-center md:items-start">
                <span className="text-gray-400 text-[11px] font-bold tracking-widest uppercase mb-1">
                  LIMITED TIME - UP TO 70% OFF
                </span>
                <h2 className="text-3xl font-medium text-white tracking-tight">
                  Flash Sale
                </h2>
              </div>
            </div>
            
            {/* Middle Description */}
            <p className="text-gray-400 text-[14px] lg:max-w-sm hidden md:block leading-relaxed">
              Premium picks at all-time-low prices. New items added every hour — once they're gone, they're gone.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-6 w-full lg:w-auto border-t border-gray-800/50 lg:border-t-0 pt-5 lg:pt-0">
            <div className="flex flex-col sm:flex-row items-center w-full">
              <CountdownTimer targetDate={campaigns[0].endDate} variant="home" className="w-full" />
            </div>
            
            <Link href="/campaigns" className="bg-[#FFD4DF] text-[#1A0006] hover:bg-[#FFC2D1] px-6 py-3 rounded-full text-[14px] font-bold flex items-center justify-center gap-2 transition-colors w-full sm:w-auto shrink-0">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.slice(0, 3).map(campaign => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </Container>
    </section>
  );
};

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const isDanger = campaign.stockLeft < 20;

  return (
    <Link href={`/campaigns/${campaign.id}`} className="group bg-card rounded-[24px] overflow-hidden border border-[#F0F0F0] dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image Block */}
      <div className="relative aspect-[4/3] w-full bg-muted overflow-hidden">
        <Image
          src={campaign.cardImage}
          alt={campaign.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
          {campaign.tags.map((tag, idx) => (
            <span 
              key={idx}
              className={cn(
                "px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider",
                idx === 0 ? "bg-[#FF4747] text-white" : 
                idx === 1 ? "bg-black text-white" : "bg-[#00A65A] text-white"
              )}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content Block */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold tracking-wider text-[#6366F1] uppercase">
            {campaign.category}
          </span>
          <div className="flex items-center gap-1 text-[12px] font-bold text-[#F59E0B]">
            ★ {campaign.rating} <span className="text-gray-400 font-medium">({campaign.soldCount})</span>
          </div>
        </div>

        <h3 className="text-[17px] font-extrabold text-[#1A1A1A] dark:text-white leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {campaign.title}
        </h3>
        
        <p className="text-[13px] text-[#666666] dark:text-gray-400 line-clamp-2 mb-6 flex-1">
          {campaign.description}
        </p>

        {/* Progress */}
        <div className="bg-[#F8F9FA] dark:bg-[#1A1A1A] rounded-xl p-3 mb-6 border border-border">
          <div className="flex items-center justify-between text-[12px] font-bold mb-2">
            <span className="text-[#1A1A1A] dark:text-gray-200">Sold: {campaign.soldPercentage}k products</span>
            <span className={cn(isDanger ? "text-[#FF4747]" : "text-gray-500")}>
              {isDanger ? `Almost Gone!` : `Only ${campaign.stockLeft} left!`}
            </span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-1000",
                isDanger ? "bg-gradient-to-r from-[#FF4747] to-[#FF8A00]" : "bg-gradient-to-r from-[#6366F1] to-[#00A65A]"
              )}
              style={{ width: `${campaign.soldPercentage}%` }}
            />
          </div>
        </div>

        {/* Action (No Price) */}
        <div className="flex items-end justify-end mt-auto">
          <button className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 px-5 py-2.5 rounded-full text-[13px] font-bold inline-flex items-center gap-2 transition-colors w-full justify-center">
            Explore Campaign <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}

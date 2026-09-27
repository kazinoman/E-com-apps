"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  targetDate: string;
  variant?: "home" | "list" | "detail";
  className?: string;
}

export function CountdownTimer({ targetDate, variant = "home", className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const target = new Date(targetDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!isClient) {
    return null; // Avoid hydration mismatch
  }

  const { days, hours, minutes, seconds } = timeLeft;

  const pad = (num: number) => String(num).padStart(2, "0");

  if (variant === "home") {
    return (
      <div className={cn("flex items-center gap-4 bg-white dark:bg-card px-4 py-2.5 rounded-full shadow-sm border border-gray-100 dark:border-gray-800", className)}>
        <div className="flex items-center gap-1.5 text-[#F05C22] dark:text-[#F05C22] font-semibold text-xs tracking-wide">
          <Clock className="w-3.5 h-3.5" /> ENDS IN:
        </div>
        <div className="flex items-center gap-2">
          <TimeBlock value={pad(days)} label="DAYS" />
          <span className="text-xl font-bold text-gray-300 dark:text-gray-600 -mt-3">:</span>
          <TimeBlock value={pad(hours)} label="HOURS" />
          <span className="text-xl font-bold text-gray-300 dark:text-gray-600 -mt-3">:</span>
          <TimeBlock value={pad(minutes)} label="MINS" />
          <span className="text-xl font-bold text-gray-300 dark:text-gray-600 -mt-3">:</span>
          <TimeBlock value={pad(seconds)} label="SECS" isAccent />
        </div>
      </div>
    );
  }
  
  if (variant === "list") {
    return (
      <div className={cn("inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-md text-[13px] font-bold tracking-wider", className)}>
        <Clock className="w-4 h-4 text-white/70" /> 
        TIME LEFT: 
        <span className="ml-1">{pad(days)}d : {pad(hours)}h : {pad(minutes)}m : {pad(seconds)}s</span>
      </div>
    );
  }

  if (variant === "detail") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <TimeBlockDetail value={pad(days)} label="DAYS" />
        <TimeBlockDetail value={pad(hours)} label="HOURS" />
        <TimeBlockDetail value={pad(minutes)} label="MINS" />
        <TimeBlockDetail value={pad(seconds)} label="SECS" isAccent />
      </div>
    );
  }

  return null;
}

function TimeBlock({ value, label, isAccent }: { value: string, label: string, isAccent?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div className={cn(
        "w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold text-white shadow-sm",
        isAccent ? "bg-[#F05C22]" : "bg-black dark:bg-gray-800"
      )}>
        {value}
      </div>
      <span className={cn("text-[9px] font-bold uppercase tracking-wider mt-1.5", isAccent ? "text-[#F05C22]" : "text-gray-400")}>
        {label}
      </span>
    </div>
  );
}

function TimeBlockDetail({ value, label, isAccent }: { value: string, label: string, isAccent?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div className={cn(
        "w-12 h-14 rounded-lg flex items-center justify-center text-2xl font-bold text-white shadow-sm",
        isAccent ? "bg-[#F05C22]" : "bg-[#1A1A1A]"
      )}>
        {value}
      </div>
      <span className={cn("text-[10px] font-bold uppercase tracking-wider mt-2", isAccent ? "text-[#F05C22]" : "text-gray-500")}>
        {label}
      </span>
    </div>
  );
}

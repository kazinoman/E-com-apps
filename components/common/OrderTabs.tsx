"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function OrderTabs() {
  const pathname = usePathname();

  const tabs = [
    { name: "Active", href: "/profile/orders/active" },
    { name: "Completed", href: "/profile/orders/history" },
  ];

  return (
    <div className="flex items-center gap-8 border-b border-gray-200 dark:border-gray-800 mb-6">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={`pb-3 px-1 text-[15px] font-bold transition-colors ${
              isActive
                ? "text-[#333333] dark:text-white border-b-2 border-[#333333] dark:border-white"
                : "text-[#8C93A3] hover:text-[#333333] dark:hover:text-gray-300"
            }`}
          >
            {tab.name}
          </Link>
        );
      })}
    </div>
  );
}

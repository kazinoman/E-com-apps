"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, MapPin, Heart, Crosshair, ClipboardList, Package, LogOut, Menu, CheckCircle2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from "@/contexts/UserInfoContext";
import { useLogout } from "@/hooks/useLogout";
import Image from "next/image";

const accountItems = [
  { name: "My Account", href: "/profile/my-profile", icon: User },
  { name: "My Address", href: "/profile/address", icon: MapPin },
  { name: "My Wishlists", href: "/profile/wishlist", icon: Heart },
];

const orderItems = [
  { name: "Track Orders", href: "/profile/orders/track", icon: Crosshair },
  { name: "Active Orders", href: "/profile/orders/active", icon: ClipboardList },
  { name: "Orders History", href: "/profile/orders/history", icon: Package },
];

export function ProfileSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { logout, isLoggingOut } = useLogout();
  const [accordionValue, setAccordionValue] = useState<string>("");

  const getActivePageName = () => {
    const allItems = [...accountItems, ...orderItems];
    const activeItem = allItems.find(
      (item) => pathname === item.href || pathname?.startsWith(item.href + "/")
    );
    return activeItem ? activeItem.name : "Profile Menu";
  };

  const renderLink = (item: { name: string; href: string; icon: any }) => {
    const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
    return (
      <Link
        key={item.name}
        href={item.href}
        onClick={() => setAccordionValue("")}
        className={`flex items-center justify-between p-3.5 text-[14px] rounded-xl transition-all ${isActive
          ? "bg-[#F7F7FA] dark:bg-gray-800 text-[#1C244B] dark:text-white font-semibold"
          : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-700 dark:hover:text-gray-300 font-medium"
          }`}
      >
        <div className="flex items-center gap-3.5">
          <item.icon className={`w-5 h-5 ${isActive ? "text-[#1C244B] dark:text-white" : "text-gray-400"}`} strokeWidth={isActive ? 2.5 : 2} />
          {item.name}
        </div>
        {isActive && (
          <CheckCircle2 className="w-5 h-5 text-[#333333] dark:text-white fill-[#1C244B] dark:fill-white text-white dark:text-[#1C244B]" />
        )}
      </Link>
    );
  };

  const renderMenuItems = (isMobile: boolean = false) => {
    return (
      <div className={`flex flex-col ${isMobile ? "" : "h-full py-6 px-4"}`}>
        {/* User Info Section */}
        <div className="flex items-center gap-4 px-2 mb-8">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden shrink-0">
            {/* If there's no actual user image, use a placeholder or initials. The design shows an avatar image. */}
            <Image
              src={user?.avatar || "https://i.pravatar.cc/150?u=a042581f4e29026704d"}
              alt="User Avatar"
              width={48}
              height={48}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="overflow-hidden">
            <h3 className="text-[15px] font-bold text-[#333333] dark:text-white truncate">
              {user?.fullName || "Mr. Bilal Assad"}
            </h3>
          </div>
        </div>

        <div className="space-y-6">
          {/* Accounts Section */}
          <div>
            <div className="text-[13px] font-medium text-[#8C93A3] mb-3 px-2">
              Account
            </div>
            <div className="space-y-1">{accountItems.map(renderLink)}</div>
          </div>

          {/* Orders Section */}
          <div>
            <div className="text-[13px] font-medium text-[#8C93A3] mb-3 px-2">
              Orders
            </div>
            <div className="space-y-1">{orderItems.map(renderLink)}</div>
          </div>
        </div>

        <div className="pt-6 mt-8 border-t border-gray-100 dark:border-gray-800">
          {/* Logout Button */}
          <button
            onClick={logout}
            disabled={isLoggingOut}
            className={`flex items-center gap-3.5 px-3.5 py-2 w-full text-left text-[14px] font-bold text-[#E94B4B] hover:text-[#c43c3c] transition-colors ${isLoggingOut ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            <LogOut className={`w-5 h-5 ${isLoggingOut ? "animate-pulse" : ""}`} strokeWidth={2.5} />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile View: Accordion */}
      <div className="lg:hidden mb-6">
        <Accordion
          type="single"
          collapsible
          value={accordionValue}
          onValueChange={setAccordionValue}
          className="w-full bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800"
        >
          <AccordionItem value="mobile-menu" className="border-none">
            <AccordionTrigger className="px-5 py-4 hover:no-underline [&[data-state=open]]:border-b dark:[&[data-state=open]]:border-gray-800">
              <div className="flex items-center gap-3 text-base font-semibold dark:text-white">
                <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                {getActivePageName()}
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-0 max-h-[60vh] overflow-y-auto">
              {renderMenuItems(true)}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Desktop View: Regular Sidebar */}
      <div className="hidden lg:block bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 h-full">
        {renderMenuItems(false)}
      </div>
    </>
  );
}

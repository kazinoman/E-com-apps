"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, MapPin, Heart, Package, LogOut, Menu, XCircle, Clock, LayoutDashboard, CreditCard, AlertCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from "@/contexts/UserInfoContext";
import { useLogout } from "@/hooks/useLogout";

const accountItems = [
  { name: "Dashboard", href: "/profile/dashboard", icon: LayoutDashboard },
  { name: "My Profile", href: "/profile/my-profile", icon: User },
  { name: "Address", href: "/profile/address", icon: MapPin },
  { name: "My Wishlist", href: "/profile/wishlist", icon: Heart },
  { name: "Payments", href: "/profile/payments", icon: CreditCard },
  { name: "Complain", href: "/profile/complain", icon: AlertCircle },
];

const orderItems = [
  { name: "Active Orders", href: "/profile/orders/active", icon: Package },
  { name: "Cancel Orders", href: "/profile/orders/cancel", icon: XCircle },
  { name: "Order History", href: "/profile/orders/history", icon: Clock },
];

export function ProfileSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { logout, isLoggingOut } = useLogout();
  const [accordionValue, setAccordionValue] = useState<string>("");

  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

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
        className={`flex items-center gap-3 p-2.5 text-sm rounded-md transition-colors ${isActive
          ? "bg-primary text-primary-foreground font-medium shadow-sm"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
          }`}
      >
        <item.icon className={`w-5 h-5 ${isActive ? "" : "text-gray-500 dark:text-gray-400"}`} />
        {item.name}
      </Link>
    );
  };

  const renderMenuItems = (isMobile: boolean = false) => {
    return (
      <div className={`flex flex-col ${isMobile ? "" : "h-full"}`}>
        {/* User Info Section */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-gray-700">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold shrink-0">
            {getInitials(user?.fullName || "")}
          </div>
          <div className="overflow-hidden">
            <h3 className="font-semibold text-gray-800 dark:text-white truncate">
              {user?.fullName || "Guest User"}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email || "guest@example.com"}
            </p>
          </div>
        </div>

        <div className={`p-2 space-y-4 ${isMobile ? "" : "flex-1"}`}>
          {/* Accounts Section */}
          <div>
            <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-2">
              Accounts
            </div>
            <div className="space-y-1">{accountItems.map(renderLink)}</div>
          </div>

          {/* Orders Section */}
          <div>
            <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-2">
              Orders
            </div>
            <div className="space-y-1">{orderItems.map(renderLink)}</div>
          </div>
        </div>

        <div className={`p-2 border-t border-gray-100 dark:border-gray-700 ${isMobile ? "" : "mt-auto"}`}>
          {/* Logout Button */}
          <button
            onClick={logout}
            disabled={isLoggingOut}
            className={`flex items-center gap-3 p-2.5 w-full text-left text-sm font-medium text-red-600 dark:text-red-500 rounded-md transition-colors hover:bg-red-50 dark:hover:bg-red-950/30 ${isLoggingOut ? "opacity-70 cursor-not-allowed" : ""
              }`}
          >
            <LogOut className={`w-5 h-5 ${isLoggingOut ? "animate-pulse" : ""}`} />
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
          className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md"
        >
          <AccordionItem value="mobile-menu" className="border-none">
            <AccordionTrigger className="px-4 py-4 hover:no-underline [&[data-state=open]]:border-b dark:[&[data-state=open]]:border-gray-700">
              <div className="flex items-center gap-3 text-base font-semibold dark:text-white">
                <Menu className="w-5 h-5 text-primary" />
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
      <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-lg shadow-md h-full">
        {renderMenuItems(false)}
      </div>
    </>
  );
}

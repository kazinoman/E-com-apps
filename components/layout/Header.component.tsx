"use client";

// 1. Remove 'Link' and import 'useRouter'
import { usePathname, useRouter } from "next/navigation";

import { User, ShoppingBag, Menu, Search, Home as HomeIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/UserInfoContext";
import { Button } from "../ui/button";
import { CartButton } from "../common/CartButton";
import Link from "next/link";
import { PageUrls } from "@/constants/PageUrls";
import { ThemeToggle } from "../common/ThemeToggleButton";

export function Header() {
  const pathname = usePathname();
  const router = useRouter(); // 2. Initialize the router
  const { user, isAuthLoading } = useAuth();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Collections", href: "#", active: true },
    { name: "Boutique", href: "#" },
    { name: "Editorial", href: "#" },
    { name: "Atelier", href: "#" },
    { name: "Sustainability", href: "#" },
  ];

  return (
    <>
      {/* Desktop Header */}
      <header className="border-b border-[#EAE4E3]  bg-header">
        <div className="hidden md:flex items-center justify-between mx-auto max-w-7xl h-[var(--header-height)] sticky top-0 z-50">
          {/* Replaced Link with button + router.push */}
          <button onClick={() => router.push("/")} className="text-4xl font-bold text-primary tracking-tighter">
            LUXE
          </button>

          <nav className="flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <button
                  key={link.name}
                  onClick={() => router.push(link.href)}
                  className={cn(
                    "text-[15px] font-medium transition-colors relative py-1",
                    isActive ? "text-primary" : "text-[#6B6565] hover:text-primary",
                  )}
                >
                  {link.name}
                  {isActive && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-6">
            <ThemeToggle />

            {isAuthLoading ? (
              <div className="w-20 h-8 bg-gray-200 animate-pulse rounded" />
            ) : (
              // No need for 'asChild' anymore, just use onClick directly on the Button
              <Link
                href={user ? PageUrls.profile : PageUrls.login}
                className="text-primary hover:text-primary-hover transition-colors"
              >
                {user ? user.fullName : "Sign In"}
              </Link>
            )}

            <div className="mr-2">
              <CartButton cartCount={10} />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-4 h-16 border-b border-[#EAE4E3] bg-[#FCFAF9] sticky top-0 z-50">
        <button className="text-primary">
          <Menu size={28} strokeWidth={1.5} />
        </button>

        <button
          onClick={() => router.push(PageUrls.home)}
          className="text-2xl font-bold text-primary tracking-tighter absolute left-1/2 -translate-x-1/2"
        >
          LUXE
        </button>

        <CartButton cartCount={10} />
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#FCFAF9] border-t border-[#EAE4E3] flex items-center justify-around h-[68px] pb-safe z-50">
        <button
          onClick={() => router.push("/")}
          className="flex flex-col items-center gap-1 text-[#6B6565] hover:text-primary transition-colors"
        >
          <HomeIcon size={22} strokeWidth={1.5} />
          <span className="text-[12px] font-medium">Home</span>
        </button>

        <button className="flex flex-col items-center gap-1 text-primary transition-colors">
          <Search size={22} strokeWidth={1.5} />
          <span className="text-[12px] font-medium">Search</span>
          <span className="w-1 h-1 bg-primary rounded-full mt-0.5" />
        </button>

        <button className="flex flex-col items-center gap-1 text-[#6B6565] hover:text-primary transition-colors relative">
          <div className="relative">
            <ShoppingBag size={22} strokeWidth={1.5} />
          </div>
          <span className="text-[12px] font-medium">Cart</span>
        </button>

        <button
          onClick={() => router.push(user ? PageUrls.profile : PageUrls.login)}
          className="flex flex-col items-center gap-1 text-[#6B6565] hover:text-primary transition-colors"
        >
          <User size={22} strokeWidth={1.5} />
          <span className="text-[12px] font-medium">Profile</span>
        </button>
      </nav>
    </>
  );
}

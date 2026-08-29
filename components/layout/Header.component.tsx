"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { User, ShoppingBag, Menu, Search, Heart, ArrowRightLeft, SlidersHorizontal, Home as HomeIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/UserInfoContext";
import { CartButton } from "../common/CartButton";
import Link from "next/link";
import { PageUrls } from "@/constants/PageUrls";
import { ThemeToggle } from "../common/ThemeToggleButton";
import { Container } from "../common/Container";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthLoading } = useAuth();

  const [searchTerm, setSearchTerm] = useState(searchParams?.get("title") || "");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const isTyping = useRef(false);

  useEffect(() => {
    if (!isTyping.current) {
      setSearchTerm(searchParams?.get("title") || "");
    }
  }, [searchParams]);

  useEffect(() => {
    // Only execute the search push if the user has actually stopped typing 
    // AND the change originated from their typing, not an external URL change
    if (isTyping.current && searchTerm === debouncedSearchTerm) {
      const currentTitle = searchParams?.get("title") || "";
      if (debouncedSearchTerm !== currentTitle) {
        const newParams = new URLSearchParams(searchParams?.toString() || "");
        if (debouncedSearchTerm.trim()) {
          newParams.set("title", debouncedSearchTerm.trim());
          newParams.set("page", "1");
          router.push(`/search?${newParams.toString()}`);
        } else {
          newParams.delete("title");
          if (pathname === "/search") {
            router.push(`/search?${newParams.toString()}`);
          }
        }
      }
      isTyping.current = false;
    }
  }, [debouncedSearchTerm, searchTerm, pathname, router, searchParams]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Deals", href: "#" },
    { name: "All Categories", href: "#" },
    { name: "All Brands", href: "#" },
    { name: "Track order", href: "#" },
  ];

  return (
    <>
      {/* Desktop Header Top Bar */}
      <header className="hidden md:block border-b border-[#EAE4E3] bg-background">
        <Container className="h-[80px] flex items-center justify-between gap-8">
          {/* Logo */}
          <button onClick={() => router.push("/")} className="text-4xl font-black text-foreground tracking-tight">
            Zaag
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-3xl relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Search size={20} strokeWidth={1.5} />
            </div>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => {
                isTyping.current = true;
                setSearchTerm(e.target.value);
              }}
              placeholder="Search Product Name" 
              className="w-full h-[46px] pl-12 pr-12 bg-[#F6F7F9] dark:bg-secondary/50 border border-transparent rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent text-[15px] transition-all text-foreground"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              <SlidersHorizontal size={20} strokeWidth={1.5} />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6">
            <ThemeToggle />
            
            <button className="text-[#6B6565] hover:text-foreground transition-colors">
              <ArrowRightLeft size={24} strokeWidth={1.5} />
            </button>
            <button className="text-[#6B6565] hover:text-foreground transition-colors">
              <Heart size={24} strokeWidth={1.5} />
            </button>
            
            {isAuthLoading ? (
              <div className="w-24 h-8 bg-secondary animate-pulse rounded" />
            ) : (
              <div className="flex items-center gap-2 text-[15px] font-medium text-[#6B6565]">
                <User size={24} strokeWidth={1.5} />
                {user ? (
                  <Link href={PageUrls.profile} className="hover:text-foreground transition-colors">
                    {user.fullName}
                  </Link>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <Link href={PageUrls.login} className="hover:text-foreground transition-colors">Sign in</Link>
                    <span className="text-[#EAE4E3]">|</span>
                    <Link href={PageUrls.signup} className="hover:text-foreground transition-colors">Sign up</Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </Container>
      </header>

      {/* Desktop Header Bottom Bar */}
      <div className="hidden md:block bg-[#333333] text-white">
        <Container className="h-[52px] flex items-center justify-between">
          <nav className="flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <button
                  key={link.name}
                  onClick={() => router.push(link.href)}
                  className={cn(
                    "text-[14px] font-medium transition-colors py-1",
                    isActive ? "text-white" : "text-[#B3B3B3] hover:text-white",
                  )}
                >
                  {link.name}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 text-[14px] font-medium text-[#B3B3B3] cursor-pointer hover:text-white transition-colors">
            <ShoppingBag size={20} strokeWidth={1.5} />
            <span>$ 0.00 <span className="text-[#808080]">(0 items)</span></span>
          </div>
        </Container>
      </div>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-4 h-16 border-b border-[#EAE4E3] bg-background sticky top-0 z-50">
        <button className="text-foreground">
          <Menu size={28} strokeWidth={1.5} />
        </button>

        <button
          onClick={() => router.push(PageUrls.home)}
          className="text-2xl font-black text-foreground tracking-tight absolute left-1/2 -translate-x-1/2"
        >
          Zaag
        </button>

        <div className="flex items-center gap-3">
          <Search size={22} strokeWidth={1.5} className="text-foreground" />
          <CartButton cartCount={10} />
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-background border-t border-[#EAE4E3] flex items-center justify-around h-[68px] pb-safe z-50">
        <button
          onClick={() => router.push("/")}
          className={cn(
            "flex flex-col items-center gap-1 transition-colors",
            pathname === "/" ? "text-primary" : "text-[#6B6565] hover:text-foreground"
          )}
        >
          <HomeIcon size={22} strokeWidth={1.5} />
          <span className="text-[12px] font-medium">Home</span>
        </button>

        <button className="flex flex-col items-center gap-1 text-[#6B6565] hover:text-foreground transition-colors">
          <ArrowRightLeft size={22} strokeWidth={1.5} />
          <span className="text-[12px] font-medium">Compare</span>
        </button>

        <button className="flex flex-col items-center gap-1 text-[#6B6565] hover:text-foreground transition-colors relative">
          <Heart size={22} strokeWidth={1.5} />
          <span className="text-[12px] font-medium">Wishlist</span>
        </button>

        <button
          onClick={() => router.push(user ? PageUrls.profile : PageUrls.login)}
          className="flex flex-col items-center gap-1 text-[#6B6565] hover:text-foreground transition-colors"
        >
          <User size={22} strokeWidth={1.5} />
          <span className="text-[12px] font-medium">Profile</span>
        </button>
      </nav>
    </>
  );
}

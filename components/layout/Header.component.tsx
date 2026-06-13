"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, ShoppingBag, Menu, Search, Home as HomeIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/UserInfoContext";
import { Button } from "../ui/button";

export function Header() {
  const pathname = usePathname();
  const { user } = useAuth();

  // console.log({ user });

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
      <header className="  border-b border-[#EAE4E3] bg-[#FCFAF9] ">
        <div className="hidden md:flex items-center justify-between mx-auto  max-w-7xl h-[var(--header-height)] sticky top-0 z-50">
          <Link href="/" className="text-4xl font-bold text-primary tracking-tighter">
            LUXE
          </Link>

          <nav className="flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "text-[15px] font-medium transition-colors relative py-1",
                    isActive ? "text-primary" : "text-[#6B6565] hover:text-primary",
                  )}
                >
                  {link.name}
                  {isActive && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" />}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-6">
            {user ? (
              <Link
                href={user ? "/profile" : "/login"}
                className="text-primary hover:text-primary-hover transition-colors"
              >
                <Button className="" variant={"ghost"}>
                  {user.fullName}
                </Button>
              </Link>
            ) : (
              <Link href={"/login"}>
                <Button className="" variant={"ghost"}>
                  Sign In
                </Button>
              </Link>
            )}

            <button className="text-primary hover:text-primary-hover transition-colors relative">
              <ShoppingBag size={24} strokeWidth={1.5} />
              <span className="absolute -top-1.5 -right-2 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                2
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-4 h-16 border-b border-[#EAE4E3] bg-[#FCFAF9] sticky top-0 z-50">
        <button className="text-primary">
          <Menu size={28} strokeWidth={1.5} />
        </button>

        <Link href="/" className="text-2xl font-bold text-primary tracking-tighter absolute left-1/2 -translate-x-1/2">
          LUXE
        </Link>

        <button className="text-primary relative shadow-sm">
          <ShoppingBag size={24} strokeWidth={1.5} />
        </button>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-[#FCFAF9] border-t border-[#EAE4E3] flex items-center justify-around h-[68px] pb-safe z-50">
        <Link href="/" className="flex flex-col items-center gap-1 text-[#6B6565] hover:text-primary transition-colors">
          <HomeIcon size={22} strokeWidth={1.5} />
          <span className="text-[12px] font-medium">Home</span>
        </Link>
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
        <Link
          href={user ? "/profile" : "/login"}
          className="flex flex-col items-center gap-1 text-[#6B6565] hover:text-primary transition-colors"
        >
          <User size={22} strokeWidth={1.5} />
          <span className="text-[12px] font-medium">Profile</span>
        </Link>
      </nav>
    </>
  );
}

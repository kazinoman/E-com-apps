import { X, User, LogOut, ChevronRight, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/UserInfoContext';
import { PageUrls } from '@/constants/PageUrls';
import { ThemeToggle } from '../common/ThemeToggleButton';
import { logoutAction } from '@/server/actions/logout.action';
import { toast } from 'sonner';

import { fetchCategories } from "@/services/category.service";
import type { Category } from "@/lib/types/category";
import { useEffect } from "react";

interface MobileMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: { name: string; href: string }[];
}

export function MobileMenuDrawer({ isOpen, onClose, navLinks }: MobileMenuDrawerProps) {
  const { user, setUser } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && categories.length === 0) {
      fetchCategories().then(setCategories);
    }
  }, [isOpen, categories.length]);

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
      setUser(null);
      toast.success("Logged out successfully");
      onClose();
      router.push('/');
    });
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] animate-in fade-in duration-300"
          onClick={onClose}
        />
      )}

      {/* Drawer Panel */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-[85%] max-w-[320px] bg-background z-[100] shadow-2xl transition-transform duration-300 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-border">
          <span className="text-2xl font-black tracking-tight text-foreground">XYZ</span>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground"
            >
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-6">
          <div className="px-6 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Menu
          </div>
          <ul className="flex flex-col">
            {navLinks.map((link, idx) => {
              if (link.name === "All Categories") {
                return (
                  <li key={idx} className="flex flex-col">
                    <button
                      onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                      className="flex items-center justify-between px-6 py-3.5 text-[15px] font-medium text-foreground hover:bg-secondary/50 hover:text-primary transition-colors"
                    >
                      {link.name}
                      <ChevronDown
                        size={16}
                        className={cn(
                          "text-muted-foreground/50 transition-transform duration-200",
                          isCategoriesOpen ? "rotate-180" : ""
                        )}
                      />
                    </button>
                    {isCategoriesOpen && (
                      <div className="bg-secondary/10 flex flex-col py-2 px-6 overflow-y-auto max-h-[40vh]">
                        {categories.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/search?category=${encodeURIComponent(cat.id)}`}
                            onClick={onClose}
                            className="py-2.5 px-4 text-[14px] text-muted-foreground hover:text-primary transition-colors border-l-2 border-transparent hover:border-primary"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </li>
                );
              }

              return (
                <li key={idx}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="flex items-center justify-between px-6 py-3.5 text-[15px] font-medium text-foreground hover:bg-secondary/50 hover:text-primary transition-colors"
                  >
                    {link.name}
                    <ChevronRight size={16} className="text-muted-foreground/50" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer / User actions */}
        <div className="border-t border-border bg-secondary/20 relative">
          {user ? (
            <>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-secondary/40 transition-colors text-left"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-base">
                    {user.fullName.charAt(0)}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-semibold text-foreground truncate">{user.fullName}</span>
                    <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                  </div>
                </div>

                <div className={cn(
                  "p-2 rounded-full transition-colors shrink-0",
                  isDropdownOpen && "bg-secondary/80"
                )}>
                  <ChevronDown
                    size={20}
                    className={cn(
                      "text-muted-foreground transition-transform duration-200",
                      isDropdownOpen ? "rotate-180" : ""
                    )}
                  />
                </div>
              </button>

              {/* Floating Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute bottom-full left-4 right-4 mb-2 bg-card border border-border rounded-lg shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <Link
                      href={PageUrls.profile}
                      onClick={onClose}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/60 transition-colors text-sm font-medium text-foreground"
                    >
                      <User size={16} className="text-muted-foreground" />
                      My Profile
                    </Link>
                    <div className="h-px bg-border/50 w-full" />
                    <button
                      onClick={handleLogout}
                      disabled={isPending}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/60 transition-colors text-sm font-medium text-destructive w-full text-left"
                    >
                      <LogOut size={16} className="text-destructive/80" />
                      {isPending ? "Logging out..." : "Log Out"}
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex flex-col gap-3 p-6">
              <Link
                href={PageUrls.login}
                onClick={onClose}
                className="w-full text-center bg-primary text-primary-foreground py-2.5 rounded-lg text-[15px] font-semibold shadow-sm hover:bg-primary/90 transition-all active:scale-[0.98]"
              >
                Sign In
              </Link>
              <Link
                href={PageUrls.signup}
                onClick={onClose}
                className="w-full text-center bg-background border border-border text-foreground py-2.5 rounded-lg text-[15px] font-semibold hover:bg-secondary transition-all active:scale-[0.98]"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
